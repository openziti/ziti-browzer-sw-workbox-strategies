
import {WorkboxError} from 'workbox-core/_private/WorkboxError.js';
import {StrategyHandler} from 'workbox-strategies/StrategyHandler.js';
import {CacheFirst} from 'workbox-strategies/CacheFirst.js';
import {StrategyOptions} from 'workbox-strategies/Strategy.js';
import {Mutex, withTimeout, Semaphore} from 'async-mutex';
import { isUndefined, isEqual } from 'lodash-es';
import * as cheerio from 'cheerio';


import { ZitiBrowzerCore } from '@openziti/ziti-browzer-core';

import pjson from '../package.json';
import { buildInfo } from './buildInfo'


export interface ZitiFirstOptions extends StrategyOptions {
  zitiBrowzerServiceWorkerGlobalScope?: any;
  logLevel?: string;
  controllerApi?: string;
  zitiNetworkTimeoutSeconds?: number;
  uuid?: string;
}

type ZitiShouldRouteResult = {
  routeOverZiti?: boolean | false;
  serviceName?: string | '';
  serviceScheme?: string | '';
  url?: string | '';
}

var regexZBR      = new RegExp( /ziti-browzer-runtime-[0-9a-f]{8}\.js/, 'gi' );
var regexZBRLogo  = new RegExp( /ziti-browzer-logo/,    'g' );
var regexZBRcss   = new RegExp( /ziti-browzer-css/,     'g' );
var regexZBRCORS  = new RegExp( /ziti-cors-proxy/,      'g' );
var regexEdgeClt  = new RegExp( /\/edge\/client\/v1/,   'g' );
var regexZBWASM   = new RegExp( /libcrypto.wasm/,       'g' );
var regexHystmodal = new RegExp( /hystmodal/,           'g' );
var regexPolipop  = new RegExp( /polipop/,              'g' );
var regexHotkeys  = new RegExp( /hotkeys/,              'g' );

var regexSlash    = new RegExp( /^\/$/,                 'g' );
var regexDotSlash = new RegExp( /^\.\//,                'g' );
var regexTextHtml = new RegExp( /text\/html/,           'i' );
var regexVideo    = new RegExp( /video/,                'i' );
var regexMpeg     = new RegExp( /mpeg/,                 'i' );
var regexImage    = new RegExp( /image\//,              'i' );
var regexCSS      = new RegExp( /^.*\.css$/,            'i' );
var regexJS       = new RegExp( /^.*\.js$/,             'i' );
var regexPNG      = new RegExp( /^.*\.png$/,            'i' );
var regexJPG      = new RegExp( /^.*\.jpg$/,            'i' );
var regexSVG      = new RegExp( /^.*\.svg$/,            'i' );
var regexControllerAPI: any;

interface PolicyResult {
  [key: string]: string[];
}
interface PolicyBuilderOptions {
  directives: Readonly<Record<string, string[] | string | boolean>>;
}

/**
 * An implementation of a Ziti network request strategy.
 *
 * If the network request fails, and there is no cache match, this will throw
 * a `WorkboxError` exception.
 *
 */
class ZitiFirstStrategy extends CacheFirst /* NetworkFirst */ {

  _zitiBrowzerServiceWorkerGlobalScope: any;
  private readonly _zitiNetworkTimeoutSeconds: number;
  private readonly _logLevel: string;
  private readonly _controllerApi: string;
  private _core: any;
  private logger: any;
  private _zitiContext: any;
  private _initialized: boolean;
  private _initializationMutex: any;
  private _uuid: any;
  private _rootPaths: any;

  /**
   * @param {Object} [options]
   * @param {string} [options._zitiBrowzerServiceWorkerGlobalScope] config dsts
   * @param {string} [options._logLevel] Which level to log at
   * @param {string} [options._controllerApi] Location of Ziti Controller
   * @param {number} [options.zitiNetworkTimeoutSeconds] If set, any network requests
   * that fail to respond within the timeout will fallback to the cache.
   *
   */
  constructor(options: ZitiFirstOptions = {}) {
    super(options);

    this._zitiBrowzerServiceWorkerGlobalScope = options.zitiBrowzerServiceWorkerGlobalScope || 0;
    this._zitiNetworkTimeoutSeconds = options.zitiNetworkTimeoutSeconds || 0;
    this._logLevel = options.logLevel || 'Silent';
    this._controllerApi = options.controllerApi || '<controllerApi-not-configured>';
    this._initialized = false;

    var controllerAPIURL = new URL( this._controllerApi );
    regexControllerAPI = new RegExp( controllerAPIURL.host, 'g' );

    this._initializationMutex = new Mutex();
    this._uuid = options.uuid;
    this._rootPaths = [];

    this._core = new ZitiBrowzerCore({});
    this.logger = this._core.createZitiLogger({
      logLevel: this._logLevel,
      suffix: 'SW'
    });
    this.logger.trace(`ZitiFirstStrategy ctor completed`);
  }

  parseCSP(policy: any): PolicyResult {
    const result: PolicyResult = {};
    policy.split(";").forEach((directive: any) => {
      const [directiveKey, ...directiveValue] = directive.trim().split(/\s+/g);
      if (
        directiveKey &&
        !Object.prototype.hasOwnProperty.call(result, directiveKey)
      ) {
        result[directiveKey] = directiveValue;
      }
    });
    return result;
  };

  buildCSP({ directives }: Readonly<PolicyBuilderOptions>): string {
    const namesSeen = new Set<string>();
  
    const result: string[] = [];
  
    Object.keys(directives).forEach((originalName) => {
      const name = originalName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  
      if (namesSeen.has(name)) {
        throw new Error(`${originalName} is specified more than once`);
      }
      namesSeen.add(name);
  
      let value = directives[originalName];
      if (Array.isArray(value)) {
        value = value.join(" ");
      } else if (value === true) {
        value = "";
      }
  
      if (value) {
        result.push(`${name} ${value}`);
      } else if (value !== false) {
        result.push(name);
      }
    });
  
    return result.join("; ");
  };  

  generateNewCSP(val:string|undefined) {

    let origCSP = this.parseCSP(val);
    this.logger.trace( `generateNewCSP() origCSP: `, origCSP);

    if (origCSP['script-src']) {
      origCSP['script-src'].push(`${this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.idp.host}`);
      if (!origCSP['script-src'].includes("'unsafe-eval'")) {
        origCSP['script-src'].push("'unsafe-eval'");
      }
      if (!origCSP['script-src'].includes("'unsafe-inline'")) {
        origCSP['script-src'].push("'unsafe-inline'");
      }
    }

    let directives:any = {}
    if (!isUndefined(origCSP['child-src']))       { directives.childSrc       = origCSP['child-src'];}
    if (!isUndefined(origCSP['connect-src']))     { directives.connectdSrc    = origCSP['connect-src'];}
    if (!isUndefined(origCSP['default-src']))     { directives.defaultSrc     = origCSP['default-src'];}
    if (!isUndefined(origCSP['font-src']))        { directives.fontSrc        = origCSP['font-src'];}
    if (!isUndefined(origCSP['frame-ancestors'])) { directives.frameAncestors = origCSP['frame-ancestors'];}
    if (!isUndefined(origCSP['frame-src']))       { directives.frameSrc       = origCSP['frame-src'];}
    if (!isUndefined(origCSP['img-src']))         { directives.imgSrc         = origCSP['img-src'];}
    if (!isUndefined(origCSP['media-src']))       { directives.mediaSrc       = origCSP['media-src'];}
    if (!isUndefined(origCSP['object-src']))      { directives.objectSrc      = origCSP['object-src'];}
    if (!isUndefined(origCSP['script-src']))      { directives.scriptSrc      = origCSP['script-src'];}
    if (!isUndefined(origCSP['style-src']))       { directives.styleSrc       = origCSP['style-src'];}          

    let newCSP = this.buildCSP({ directives });
    this.logger.trace( `generateNewCSP() newCSP: `, newCSP);

    return newCSP;
  }

  /**
   * Remain in lazy-sleepy loop until z-b-runtime sends us the _zitiConfig
   * 
   */
  async await_zitiConfig(request: Request) {
    let self = this;
    let ctr = 0;
    return new Promise((resolve: any, _reject: any) => {
      (async function waitFor_zitiConfig() {
        if (isUndefined(self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig)) {
          ctr++;
          self.logger.trace(`await_zitiConfig: ...waiting [${ctr}] for [${request.url}]`);
          if (ctr == 5) {  // kick the ZBR, and ask for the config
            self.logger.trace( 'await_zitiConfig: sending ZITI_CONFIG_NEEDED msg to ZBR');  
            self._zitiBrowzerServiceWorkerGlobalScope._sendMessageToClients( { type: 'ZITI_CONFIG_NEEDED'} );
            setTimeout(waitFor_zitiConfig, 250);  
          }
          else if (ctr == 10) {  // only do the unregister once
            self.logger.trace(`await_zitiConfig: initiating unregister`);
            // Let's try and 'reboot' the ZBR/SW pair
            await self._zitiBrowzerServiceWorkerGlobalScope._unregister();

            setTimeout(waitFor_zitiConfig, 3000);  // this doesn't do much except cause us to wait for ourselves to be unregistered
          }
          else if (ctr == 13) {
            return resolve( -1 );
          } else {
            setTimeout(waitFor_zitiConfig, 250);  
          }
        } else {
          self.logger.trace(`await_zitiConfig: config acquired for [${request.url}]`);
          return resolve( 0 );
        }
      })();
    });
  }

  /**
   * Remain in lazy-sleepy loop until z-b-runtime notifies us that it has completed initialization
   * 
   */
   async await_zbrInitialized(request: Request) {
    let self = this;
    let ctr = 0;
    return new Promise((resolve: any, reject: any) => {
      (function waitFor_zbrInitialized() {
        if (self._zitiBrowzerServiceWorkerGlobalScope._zbrReloadPending) { // this gets reset when ZBR sends the SW the 
          self.logger.trace(`await_zbrInitialized: ...waiting for [${request.url}]`);
          ctr++;
          if (ctr > 40) {return reject();}
          setTimeout(waitFor_zbrInitialized, 250);
        } else {
          self.logger.trace(`await_zbrInitialized: ...acquired for [${request.url}]`);
          self.logger.trace(`await_zbrInitialized: ...setting logLevel to [${self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.browzer.sw.logLevel}]`);
          self.logger.logLevel = self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.browzer.sw.logLevel;
          return resolve();
        }
      })();
    });
  }

  idpAuthHealthEventEventHandler(idpAuthHealthEvent: any) {

    this.logger.trace(`idpAuthHealthEventEventHandler() `, idpAuthHealthEvent);

    if (idpAuthHealthEvent.expired) {

      this.logger.trace( `idpAuthHealthEventEventHandler: authToken has expired and will be torn down`);

      setTimeout(function(_zitiBrowzerServiceWorkerGlobalScope: any) {
        _zitiBrowzerServiceWorkerGlobalScope._accessTokenExpired(); // This will cause a logout with the IdP
      }, 10, this._zitiBrowzerServiceWorkerGlobalScope);

      setTimeout(function(_zitiBrowzerServiceWorkerGlobalScope: any) {
        _zitiBrowzerServiceWorkerGlobalScope._unregister();         // Let's try and 'reboot' the ZBR/SW pair
      }, 500, this._zitiBrowzerServiceWorkerGlobalScope);

    }
  }

  async noConfigForServiceEventHandler(noConfigForServiceEvent: any) {

    this.logger.trace(`noConfigForServiceEventHandler() `, noConfigForServiceEvent);

    await this._zitiBrowzerServiceWorkerGlobalScope._noConfigForService(noConfigForServiceEvent);

  }

  
  /**
   * Do all work necessary to initialize the ZitiFirstStrategy instance.
   * 
   */
  async _initialize(request: Request) {
    
    // Run the init sequence within a critical-section
    await this._initializationMutex.runExclusive(async () => {
      
      if (!this._initialized) {

        this.logger.trace(`_initialize: entered`);

        if (isUndefined(this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig) 
        ) {
          await this.await_zitiConfig(request);
        }

        if (isUndefined(this._zitiContext)) {

          this._zitiContext = this._core.createZitiContext({
            logger:         this.logger,
            controllerApi:  this._controllerApi,
            sdkType:        pjson.name,
            sdkVersion:     pjson.version,
            sdkBranch:      buildInfo.sdkBranch,
            sdkRevision:    buildInfo.sdkRevision,
            token_type:     this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.token_type,
            access_token:   this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.access_token,
            httpAgentTargetService: this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.service,
          });
          this.logger.trace(`_initialize: ZitiContext created`);
          this._zitiBrowzerServiceWorkerGlobalScope._zitiContext = this._zitiContext;

          // Make SW scope available to idpAuthHealthEventEventHandler
          this._zitiContext._zitiBrowzerServiceWorkerGlobalScope = this._zitiBrowzerServiceWorkerGlobalScope;

          this._zitiContext.setKeyTypeEC();
    
          await this._zitiContext.initialize({
            loadWASM: true   // unlike the ZBR, here in the ZBSW, we always instantiate the internal WebAssembly
          });

          this._zitiContext.on('idpAuthHealthEvent', this.idpAuthHealthEventEventHandler);
          this._zitiContext.on('noConfigForServiceEvent',  this.noConfigForServiceEventHandler);
    
          this.logger.trace(`_initialize: ZitiContext '${this._uuid}' initialized`);

        } else {

          this.logger.trace(`_initialize: initiating unregister`);
          await this._zitiBrowzerServiceWorkerGlobalScope._unregister(); // Let's try and 'reboot' the ZBR/SW pair
          this.logger.trace(`_initialize: terminated`);

        }

        await this._zitiContext.listControllerVersion();
  
        let result = await this._zitiContext.enroll(); // this acquires an ephemeral Cert

        if (!result) {
          
          this.logger.trace(`_initialize: ephemeral Cert acquisition failed`);

          // If we couldn't acquire a cert, it most likely means that the JWT from the IdP needs a refresh

          this.logger.trace(`_initialize: initiating unregister`);
          
          await this._zitiBrowzerServiceWorkerGlobalScope._unregister(); // Let's try and 'reboot' the ZBR/SW pair

          this.logger.trace(`_initialize: terminated`);

        } else {
          
          this.logger.trace(`_initialize: ephemeral Cert acquisition succeeded`);

          this._rootPaths.push(this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.path);

          this._initialized = true;
    
          this.logger.trace(`_initialize: complete`);
        }
      }

    })
    .catch(( err: any ) => {
      this.logger.error(err);
      return new Promise( async (_, reject) => {
        reject( err );
      });
    });

  }

  _sendServiceUnavailable(_zitiBrowzerServiceWorkerGlobalScope: any, newUrl: any) {
    _zitiBrowzerServiceWorkerGlobalScope._sendMessageToClients( 
      { 
        type: 'SERVICE_UNAVAILABLE_TO_IDENTITY',
        payload: {
          message: `Ziti Service ${newUrl.hostname} is unavailable to your identity; Notify your administrator.`
        }
      } 
    )
  }

  /**
   * Determine if this request should be routed over Ziti, or over raw internet.
   * 
   * @private
   * @param {Request} request The request from the fetch event.
   * @return {ZitiShouldRouteResult} If request should go over Ziti we return a (possibly adjusted) URL

   */
  async _shouldRouteOverZiti(request: Request) {

    let result: ZitiShouldRouteResult = {}
    
    this.logger.trace(`_shouldRouteOverZiti starting`);

    result.routeOverZiti = false;  // default is to route over raw internet

    // We want to intercept fetch requests that target the Ziti HTTP Agent... that is...
    // ...we want to intercept any request from the web app that targets the server from 
    // which the app was loaded.
  
    var regex = new RegExp( this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.host, 'g' );
    let targetserviceHost = await this._zitiContext.getConfigHostByServiceName (this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.service);
    var targetServiceRegex = new RegExp( targetserviceHost , 'g' );
  
    if (request.url.match( regex )) { // yes, the request is targeting the Ziti HTTP Agent

      // let isExpired = await this._zitiContext.isCertExpired();
  
      var newUrl = new URL( request.url );

      if ( newUrl.pathname === '/' ) {

        // this.logger.trace('_shouldRouteOverZiti: root path, bypassing intercept of [%s]: ', request.url);

        result.url = request.url;
        result.routeOverZiti = true;
        result.serviceName = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.service;  
        result.serviceScheme = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.scheme;

      }
      else 
      if ( (request.url.match( regexZBR )) || (request.url.match( regexZBWASM )) || (request.url.match( regexZBRLogo )) || (request.url.match( regexZBRcss )) || (request.url.match( regexZBRCORS ))) { // the request seeks z-b-r/wasm/logo/css/cors-proxy
        this.logger.trace('_shouldRouteOverZiti: z-b-r/wasm/logo, bypassing intercept of [%s]: ', request.url);
      }  
      else {

        newUrl.hostname = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.service;
        newUrl.port = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.port;
        this.logger.trace( '_shouldRouteOverZiti: transformed URL: ', newUrl.toString());
    
        result.serviceName = await this._zitiContext.shouldRouteOverZiti( newUrl );
        this.logger.trace(`_shouldRouteOverZiti result.serviceName[%o]`, result.serviceName);
  
        if (isUndefined(result.serviceName) || isEqual(result.serviceName, '')) { // If we have no config associated with the hostname:port, do not intercept
          this.logger.warn('_shouldRouteOverZiti: no associated Ziti config, bypassing intercept of [%s]', request.url);
          setTimeout(this._sendServiceUnavailable, 250, this._zitiBrowzerServiceWorkerGlobalScope, newUrl);
        } else {
          result.url = newUrl.toString();
          result.routeOverZiti = true;
          result.serviceScheme = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.scheme;
        }   
  
      }
    
    } 
    else if ( (request.url.match( regexZBR )) || ((request.url.match( regexZBWASM ))) ) { // the request seeks z-b-r/wasm
      this.logger.trace('_shouldRouteOverZiti: z-b-r/wasm, bypassing intercept of [%s]: ', request.url);
    }
    else if (request.url.match( targetServiceRegex )) { // yes, the request is targeting the 'dark' web app

      result.url = request.url;
      result.routeOverZiti = true;
      result.serviceName = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.service;
      result.serviceScheme = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.scheme;
    }

    else if ( (request.url.match( regexSlash )) || ((request.url.match( regexDotSlash ))) ) { // the request starts with a slash

      this.logger.error(`_shouldRouteOverZiti implement me `);

    } else {  // the request is targeting the raw internet

      result.serviceName = await this._zitiContext.shouldRouteOverZiti( request.url );
      this.logger.trace(`_shouldRouteOverZiti result.serviceName[%o]`, result.serviceName);

      if (isUndefined(result.serviceName) || isEqual(result.serviceName, '')) { // If we have no config associated with the hostname:port

        this.logger.warn('_shouldRouteOverZiti: no associated config, bypassing intercept of [%s]', request.url);
  
      } else {

        result.url = request.url;
        result.routeOverZiti = true;
        result.serviceScheme = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.scheme;
  
      }

    }  

    this.logger.trace(`_shouldRouteOverZiti result[%o]`, result);

    return result;

  }

  /**
   * Determine if this request can used previously cached response, or be routed over Ziti/internet.
   * 
   * @private
   * @param {Request} request The request from the fetch event.
   * @return {boolean} If request can used previously cached response

   */
  _shouldUseCache(request: Request): boolean {

    if (request.method !== 'GET') {                   // Only cache GET responses
      this.logger.trace(`_shouldUseCache: handling ${request.method} method; NOT using cache`);
      return false;
    }
    
    if (request.url.match( regexEdgeClt )) {          // Never cache responses from Ziti Controller
      this.logger.trace(`_shouldUseCache: handling request to Ziti Controller; NOT using cache`);
      return false;
    }

    if (request.url.match( regexControllerAPI )) {    // Never cache responses from Ziti Controller
      this.logger.trace(`_shouldUseCache: handling request to Ziti Controller; NOT using cache`);
      return false;
    }

    // We will allow the SW to cache teh ZBR/WASM files ...for the moment
    //
    // if ( (request.url.match( regexZBR )) || ((request.url.match( regexZBWASM ))) ) { // Do not cache the ZBR/WASM
    //   this.logger.trace(`_shouldUseCache: handling request for ZBR|WASM; NOT using cache`);
    //   return false;
    // }

    if (request.url.match( regexSlash ) ) {           // Never cache responses for root path
      this.logger.trace(`_shouldUseCache: handling request for '/'; NOT using cache`);
      return false;
    }

    let url = new URL(request.url);
    if ( url.pathname === '/' ) {                     // Do not cache the web app's root path
      this.logger.trace(`_shouldUseCache: handling request for ROOT path; NOT using cache`);
      return false;
    }
    let isRootPath = this._rootPaths.find((element: string) => element === `${url.pathname}`);
    if ( isRootPath ) {                               // Do not cache the web app's root path
      this.logger.trace(`_shouldUseCache: handling request for ROOT path; NOT using cache`);
      return false;
    }
    
    // Cache everything else
    return true;
  }

  _isRootPATH(request: Request): boolean {

    if (request.url.match( regexSlash ) ) {          
      return true;
    }
    let url = new URL(request.url);
    if ( url.pathname === '/' ) {             
      return true;
    }
    let isRootPath = this._rootPaths.find((element: string) => element === `${url.pathname}`);
    if ( isRootPath ) {                             
      return true;
    }
    
    return false;
  }

  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(request: Request, handler: StrategyHandler): Promise<Response> {

    let tryZiti: boolean | false;

    this.logger.trace(`_handle entered for: `, request.url, this._zitiBrowzerServiceWorkerGlobalScope._uuid);

    // If hitting the Controller, or seeking z-b-runtime|WASM, then
    // we never go over Ziti, and we let the browser route the request 
    // to the Controller or HTTP Agent.  
    if ( 
      (request.url.match( regexEdgeClt )) ||          // seeking Ziti Controller
      (request.url.match( regexControllerAPI )) ||    //    "     "      "
      (request.url.match( regexZBR )) ||              // seeking Ziti BrowZer Runtime
      (request.url.match( regexZBRLogo )) ||          // seeking Ziti BrowZer Logo
      (request.url.match( regexZBRCORS )) ||          // seeking Ziti BrowZer CORS proxy
      (request.url.match( regexZBRcss )) ||           // seeking Ziti BrowZer CSS
      (request.url.match( regexHystmodal )) ||        // seeking Ziti Hystmodal
      (request.url.match( regexPolipop )) ||          // seeking Ziti Polipop
      (request.url.match( regexHotkeys )) ||          // seeking Ziti Hotkeys
      (request.url.match( regexZBWASM ))              // seeking Ziti BrowZer WASM
    ) {
      tryZiti = false;
    } else {
      tryZiti = true;
    }

    /**
     * If the ZBR hasn't sent a ping in the last few seconds, it's probably not there.
     * This can happen when the SW is running, and the user does a hard-reload of the 
     * page (i.e. clicks browser's refresh button), and the URL was NOT the root URL 
     * of the web app.  
     * 
     * In this case, we initiate a page reboot to get the ZBR back on its feet.
     */
    if (tryZiti && !this._isRootPATH(request)) {
      let pingDelta = Date.now() - this._zitiBrowzerServiceWorkerGlobalScope._zbrPingTimestamp;
      this.logger.trace(`pingDelta is ${pingDelta}`);
      if ( pingDelta > 5000) {
        let newUrl = new URL(request.url);

        let extension = newUrl.pathname.split(/[#?]/)[0]?.split('.')?.pop()?.trim();
        this.logger.trace(`newUrl.pathname is ${newUrl.pathname}, extension is ${extension}`);
        // if (!this._zitiBrowzerServiceWorkerGlobalScope._zbrReloadPending) {
        if (extension && extension.includes('/')) {
          this._zitiBrowzerServiceWorkerGlobalScope._zbrPingTimestamp = (Date.now() - 1000);
          let redirectResponse = new Response('', {
              status: 302,
              statusText: 'Found',
              headers: {
                Location: '/'
              }
            }
          );
          return redirectResponse;
        }
      }
    }

    if (tryZiti && this._zitiBrowzerServiceWorkerGlobalScope._zbrReloadPending) {
      if (request.url.match( regexZBWASM )) {  // the ZBR loads the WASM during init, so we need to process that request; all others wait
        /* NOP */
      }
      else if (request.url.match( regexControllerAPI )) {   // the ZBR hits the Ziti Controller during init, so we need to process that request; all others wait
        /* NOP */
      }
      else {
        await this.await_zbrInitialized(request).catch( async ( _err: any ) => {
          this.logger.debug(`ZBR init not responding`);
          await this._zitiBrowzerServiceWorkerGlobalScope._unregister();  
          throw new WorkboxError('no-response', {url: request.url});
        });    
      }
    }

    if (tryZiti && (!this._isRootPATH(request)) && (!request.url.match( regexZBR ))) {       // if NOT in the process of bootstrapping from HTTP Agent
      if (isUndefined(this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig) ) {  // ...and we don't yet have the zitiConfig from ZBR
        if (!request.url.match( regexEdgeClt )) {                                 // ...and NOT hitting the controller
          let result: any = await this.await_zitiConfig(request);                      // ...then wait for ZBR to send zitiConfig to us
          if (result < 0) {
            let redirectResponse = new Response('', {                             // If ZBR is AWOL, initiate top-level page reboot
                status: 302,
                statusText: 'Found',
                headers: {
                  Location: '/'
                }
              }
            );
            return redirectResponse;
          };
        }
      }
    }

    let self = this;
    let skipInject = false;
    let useCache = this._shouldUseCache(request);

    // if (request.url.match( regexZBR )) {
    //   self._zitiBrowzerServiceWorkerGlobalScope._zbrReloadPending = true;
    //   this.logger.trace(`_handle: setting  _zbrReloadPending=true`);
    // }

    if (useCache) {
      let cachResponse = await handler.cacheMatch(request);
      if (cachResponse) {
        return cachResponse;
      }
    }

    const promises: Promise<Response | undefined>[] = [];
    let timeoutId: number | undefined;
    let bootstrappingZBRFromSW: boolean | false;
    let response: Response | undefined;

    let shouldRoute: ZitiShouldRouteResult = {routeOverZiti: false}

    if (tryZiti) {   
      if (this._isRootPATH(request) ) {               // seeking root path
        if (isUndefined(this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig) ) {  // ...but we don't yet have the zitiConfig from ZBR
          tryZiti = false;                            // ...then we're bootstrapping, so load ZBR from HTTP Agent
          bootstrappingZBRFromSW = true;
        }
      }
    }

    if ( tryZiti ) {

      // If possibly going over Ziti, we must first complete the work
      await this._initialize(request);   //  to ensure WASM is instantiated, 
                                  //   we have a cert, etc
        
      // Now determine if we're going over Ziti or not
      shouldRoute = await this._shouldRouteOverZiti(request);
    }

    if (this._zitiNetworkTimeoutSeconds) {
      const {id, promise} = this._getZitiTimeoutPromise({request, handler});
      timeoutId = id;
      promises.push(promise);
    }

    let networkPromise;
    let zitiNetworkPromise;

    if (!shouldRoute.routeOverZiti) {

      this.logger.trace(`_handle: ------- routing over raw internet ----------`);

      networkPromise = this._getNetworkPromise({
        timeoutId,
        request,
        handler,
        useCache,
      });
  
      promises.push(networkPromise);
  
    } else {

      this.logger.trace(`_handle: ------- routing over Ziti ----------`);

      zitiNetworkPromise = this._getZitiNetworkPromise({
        timeoutId,
        shouldRoute,
        request,
        handler,
        useCache,
      });
  
      promises.push(zitiNetworkPromise);
    }

    response = await handler.waitUntil(
      (async () => {

        let netPromise = networkPromise || zitiNetworkPromise;

        // Promise.race() will resolve as soon as the first promise resolves.
        return (
          (await handler.waitUntil(Promise.race(promises))) ||
          // If Promise.race() resolved with null, it might be due to a network
          // timeout + a cache miss. If that were to happen, we'd rather wait until
          // the netPromise (which is either over Ziti or raw internet) resolves 
          // instead of returning null.
          //
          // Note that it's fine to await an already-resolved promise, so we don't
          // have to check to see if it's still "in flight".
          (await netPromise)
        );
      })(),
    ).catch(( err: any ) => {
      this.logger.error(err);
      return new Promise( async (_, reject) => {
        reject( err );
      });
    });

    if (!response) {
      throw new WorkboxError('no-response', {url: request.url});
    }

    const location = response.headers.get('Location');
    const contentType = response.headers.get('Content-Type');

    if ( location && response.status >= 300 && response.status < 400 ) {
      if (!this._rootPaths.find((element: string) => element === `${location}`)) {
        this._rootPaths.push(location);
      }
      skipInject = true;
    }
    if ( response.status === 403 ) {
      skipInject = true;
    }

    if (!contentType || !contentType.match( regexTextHtml )) {
      skipInject = true;
    }

    if (contentType && contentType.match( regexTextHtml )) {
      /**
       * Jenkins thing
       */
      useCache = false;
    }

    if ((contentType && contentType.match( regexVideo )) || (contentType && contentType.match( regexMpeg ))) {
      /**
       * streaming media server thing
       */
      useCache = false;
    }

    if (!skipInject) {
      
      var ignore = false;
          
      if (!ignore) {

        if (response.body) {

          let fromHttpAgent = false;

          function detectFromHttpAgent() {
  
            let buffer = '';
                      
            return new TransformStream({

              transform(chunk, _controller) {

                try {

                  // Parse the HTML
                  const $ = cheerio.load(chunk);

                  let fromAgentEl = $('script[id="from-ziti-http-agent"]');

                  if (fromAgentEl.length > 0) {

                    fromHttpAgent = true;

                    if (bootstrappingZBRFromSW) {
                      self.logger.trace('detectFromHttpAgent: bootstrappingZBRFromSW [%o]', bootstrappingZBRFromSW);

                      let bootstrappingZBRFromSWElement = $('<script></script> ').attr('id', 'ziti-browzer-sw-bootstrap').attr('name', `ziti-browzer-sw-bootstrap`);

                      fromAgentEl.before(bootstrappingZBRFromSWElement);

                    }

                  }

                  buffer += $.html();
                }
                catch (e) {
                  self.logger.error(e);
                }

              },
              flush(controller) {
                if (buffer) {
                  self.logger.trace('detectFromHttpAgent: result [%o]', fromHttpAgent);
                  controller.enqueue(buffer);
                }
              }
            })
          }
        
          function streamingHEADReplace() {
  
            let buffer = '';
                      
            return new TransformStream({

              transform(chunk, _controller) {


                try {


                  if (!fromHttpAgent) {

                    let zbrLocation = self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.browzer.runtime.src;

                    // Parse the HTML
                    const $ = cheerio.load(chunk);

                    self.logger.trace('streamingHEADReplace: HTML before modifications is: ', $.html());

                    let zbrElement = $('<script></script> ').attr('type', 'text/javascript').attr('src', `${self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.scheme}://${zbrLocation}`); //.attr('defer', `defer`);
                    let ppElement = $('<script></script> ')
                        .attr('id', 'ziti-browzer-pp')
                        .attr('type', 'text/javascript')
                        .attr('src', `${self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.scheme}://${self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.host}/polipop.min.js`);
                    let ppCss1Element = $('<link> ')
                        .attr('id', 'ziti-browzer-ppcss')
                        .attr('rel', 'stylesheet')
                        .attr('href', `${self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.scheme}://${self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.host}/polipop.core.min.css`);
                    let ppCss2Element = $('<link> ')
                        .attr('rel', 'stylesheet')
                        .attr('href', `${self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.scheme}://${self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.host}/polipop.compact.min.css`);
                    let hmElement = $('<script></script> ')
                        .attr('id', 'ziti-browzer-hm')
                        .attr('type', 'text/javascript')
                        .attr('src', `${self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.scheme}://${self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.host}/hystmodal.min.js`);
                    let hmCss1Element = $('<link> ')
                        .attr('id', 'ziti-browzer-hmcss')
                        .attr('rel', 'stylesheet')
                        .attr('href', `${self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.scheme}://${self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.host}/hystmodal.min.css`);

                    let hkElement = $('<script></script> ')
                        .attr('id', 'ziti-browzer-rhk')
                        .attr('type', 'text/javascript')
                        .attr('src', `${self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.scheme}://${self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.host}/hotkeys.min.js`);

                    // Locate the CSP
                    let cspElement = $('meta[http-equiv="content-security-policy"]');

                    // If we found a CSP
                    if (cspElement.length > 0) {

                      self.logger.trace('streamingHEADReplace: CSP found in html with content: ', cspElement.attr('content'));
                      // then augment it to enable WASM load/xeq
                      let cspContent = cspElement.attr('content');
                      let newCspContent = self.generateNewCSP(cspContent);
                      cspElement.attr('content', newCspContent);
                      self.logger.trace('streamingHEADReplace: CSP is now enhanced with content: ', cspElement.attr('content'));

                      // Inject the PP immediately after the CSP
                      cspElement.after(ppCss1Element);
                      cspElement.after(ppCss2Element);
                      cspElement.after(ppElement);
                      cspElement.after(hkElement);
                      cspElement.after(hmElement);
                      cspElement.after(hmCss1Element);
                      let ppEl = $('link[id="ziti-browzer-ppcss"]');
                      // Inject the ZBR immediately after the PP
                      ppEl.after(zbrElement);

                      buffer += $.html();
                    }

                    // If we did NOT find a CSP
                    else {

                      // Locate the HEAD
                      let headElement = $('head');

                      // Inject the Ziti browZer Runtime at the front of <head> element so we are prepared to intercept as soon as possible over on the browser
                      headElement.prepend(zbrElement);
                      headElement.prepend(hmCss1Element);
                      headElement.prepend(hmElement);
                      headElement.prepend(hkElement);
                      headElement.prepend(ppElement);
                      headElement.prepend(ppCss2Element);
                      headElement.prepend(ppCss1Element);

                      buffer += $.html();
                    }
                  } else {

                    buffer += chunk;
                
                  }
                }
                catch (e) {
                  self.logger.error(e);
                }

              },
              flush(controller) {
                if (buffer) {
                  buffer = buffer.replace('document.domain', 'document.zitidomain');
                  self.logger.trace('streamingHEADReplace: HTML after modifications is: ', buffer);
                  controller.enqueue(buffer);
                }
              }
            })
          }
          
          const bodyStream = response.body
            .pipeThrough(new TextDecoderStream())
            .pipeThrough(detectFromHttpAgent())
            .pipeThrough(streamingHEADReplace())
            .pipeThrough(new TextEncoderStream())
            ;

          const newHeaders = new Headers(response.headers);
          
          const newResponse = new Response(bodyStream, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        
          response = newResponse;
        }
      }
    }

    if (useCache) {
      await handler.waitUntil(handler.cachePut(request, response.clone()));
    }

    return response;
  }

  /**
   * @param {Object} options
   * @param {Request} options.request
   * @param {Event} options.event
   * @return {Promise<Response>}
   *
   * @private
   */
  private _getZitiTimeoutPromise({
    request,
    handler,
  }: {
    request: Request;
    handler: StrategyHandler;
  }): {promise: Promise<Response | undefined>; id?: number} {
    let timeoutId;
    let self = this;
    const timeoutPromise: Promise<Response | undefined> = new Promise(
      (resolve) => {
        const onNetworkTimeout = async () => {
          self.logger.debug(`Timing out the network response at ${self._zitiNetworkTimeoutSeconds} seconds`);
          resolve(await handler.cacheMatch(request));
        };
        timeoutId = setTimeout(
          onNetworkTimeout,
          this._zitiNetworkTimeoutSeconds * 1000,
        );
      },
    );

    return {
      promise: timeoutPromise,
      id: timeoutId,
    };
  }


  /**
   * 
   * @param zitiRequest 
   * @returns body|undefined
   */
  async getRequestBody( zitiRequest: any ) {
    var requestBlob = await zitiRequest.blob();
    if (requestBlob.size > 0) {
        return ( requestBlob );
    }
    return ( undefined );
  }

  /**
   * 
   * @param headersObject 
   */
  dumpHeaders( headersObject: any) {
    for (var pair of headersObject.entries()) {
      this.logger.trace( 'dumpHeaders: ', pair[0], pair[1]);
    }
  }

  /**
   * 
   * @param headersObject 
   */
   generateCSP( headersObject: any) {
    for (var pair of headersObject.entries()) {
      this.logger.trace( 'dumpHeaders: ', pair[0], pair[1]);
    }
  }

  /**
   * @param {Object} options
   * @param {number|undefined} options.timeoutId
   * @param {string} options.zitiURL
   * @param {Request} options.request
   * @param {Event} options.event
   * @return {Promise<Response>}
   *
   * @private
   */
  async _getZitiNetworkPromise({
    timeoutId,
    shouldRoute,
    request,
    handler,
    useCache,
  }: {
    timeoutId?: number;
    shouldRoute: ZitiShouldRouteResult;
    request: Request;
    handler: StrategyHandler;
    useCache: boolean;
  }): Promise<Response | undefined> {

    let error: any = null;
    let response: Response | PromiseLike<Response | undefined> | undefined;

    try {

      this.logger.debug(`doing Ziti fetch for: `, request.url);

      /**
       * Instantiate a fresh HTTP Request object that we will push through the ziti-browzer-core which will:
       * 
       * 1) contain re-routed host
       * 2) have any headers we need to pile on
       * 3) prepare to stream out any body data associated with the intercepted request
       */                 
      const zitiRequest = new Request(request, {} );
      
      var newHeaders = new Headers();

      zitiRequest.headers.forEach(function (header, key) {
        newHeaders.append( key, header );
      });
      if (!isEqual(request.referrer, '')) {
        newHeaders.append( 'referer', request.referrer );
      }

      // Propagate any Cookie values we have accumulated
      let cookieHeaderValue = '';
      for (const cookie in this._zitiBrowzerServiceWorkerGlobalScope._cookieObject) {
          if (cookie !== '') {
              if (this._zitiBrowzerServiceWorkerGlobalScope._cookieObject.hasOwnProperty(cookie)) {
                  cookieHeaderValue += cookie + '=' + this._zitiBrowzerServiceWorkerGlobalScope._cookieObject[cookie] + '; ';
              }
          }
      }
      if (cookieHeaderValue !== '') {
          newHeaders.append( 'Cookie', cookieHeaderValue );
      }
          
      var blob = await this.getRequestBody( zitiRequest );

      var zitiResponse = await this._zitiContext.httpFetch(
          shouldRoute.url, {
              serviceName:    shouldRoute.serviceName,
              serviceScheme:  shouldRoute.serviceScheme,
              method:         zitiRequest.method, 
              headers:        newHeaders,
              mode:           zitiRequest.mode,
              cache:          zitiRequest.cache,
              credentials:    zitiRequest.credentials,
              redirect:       zitiRequest.redirect,
              referrerPolicy: zitiRequest.referrerPolicy,
              body:           blob
          }
      );        

      this.logger.debug(`Got zitiResponse: `, zitiResponse);

      /**
       * Now that ziti-browzer-core has returned us a ZitiResponse, instantiate a fresh native Response object that we 
       * will return to the Browser. This requires us to:
       * 
       * 1) propagate the HTTP headers, status, etc
       * 2) pipe the HTTP response body 
       */

      var zitiHeaders = zitiResponse.headers.raw();
      const contentType = zitiHeaders['content-type'];
      let isTextHtml = false;
      if (contentType && contentType[0] && contentType[0].match( regexTextHtml )) {  
        isTextHtml = true;
      }
      var headers = new Headers();
      const keys = Object.keys(zitiHeaders);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let val = zitiHeaders[key][0];
        this.logger.trace( 'ZitiFirstStrategy: zitiResponse.headers: ', key, val);

        if (key.toLowerCase() === 'set-cookie') {
          if (Array.isArray(val)) {
            for (var ndx = 0; ndx < val.length; ndx++) {
              this.logger.trace( 'ZitiFirstStrategy: sending SET_COOKIE cmd');
              let resp = await this._zitiBrowzerServiceWorkerGlobalScope._sendMessageToClients( 
                { 
                  type: 'SET_COOKIE',
                  payload: val[ndx]
                } 
              );
              this.logger.trace( 'ZitiFirstStrategy: SET_COOKIE response: ', resp);
              let parts = val[ndx].split('=');
              this._zitiBrowzerServiceWorkerGlobalScope._cookieObject[parts[0]] = parts[1];  
            }
          }
          else {
            headers.append( 'x-ziti-browzer-set-cookie', val );
            this.logger.trace( 'ZitiFirstStrategy: sending SET_COOKIE cmd');
            let resp = await this._zitiBrowzerServiceWorkerGlobalScope._sendMessageToClients( 
              { 
                type: 'SET_COOKIE',
                payload: val
              } 
            );
            this.logger.trace( 'ZitiFirstStrategy: SET_COOKIE response: ', resp);
            let parts = val.split('=');
            this._zitiBrowzerServiceWorkerGlobalScope._cookieObject[parts[0]] = parts[1];  
          }
        }
        else if (key.toLowerCase() === 'location') {
          this.logger.trace( `location header transform needed for: ${val}`);
          let pathname;
          if (val.startsWith('/')) {
            pathname = val;
          } else {
            let locationUrl = new URL( val );
            pathname = locationUrl.pathname;
          }
          // let locationUrl = new URL( val );
          let newLocationUrl = new URL( 
            `${this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.scheme}://` + 
            this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.host + 
            ':' + 
            this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.port + 
            pathname 
          );
          val = newLocationUrl.toString();
          this.logger.trace( `location header transformed to: ${val}`);
        }
        
        else if (key.toLowerCase() === 'content-security-policy') {

          val = this.generateNewCSP(val);

        }
        
        headers.append( key, val);
      }
      headers.append( 'x-ziti-browzer-sw-workbox-strategies-version', pjson.version );

      if ( (zitiResponse.status < 300 || zitiResponse.status > 399) ) {

        if (isTextHtml) {

          var responseBlob = await zitiResponse.blob();
          var responseBlobStream = responseBlob.stream();               
          const responseStream = new ReadableStream({
              start(controller) {
                  function push() {
                      var chunk = responseBlobStream.read();
                      if (chunk) {
                          controller.enqueue(chunk);
                          push();  
                      } else {
                          controller.close();
                          return;
                      }
                  };
                  push();
              }
          });
  
          response = new Response( responseStream, { "status": zitiResponse.status, "headers":  headers } );
  
        } else {

          const responseStream = new ReadableStream({
              start(controller) {
                  function push(chunk: any) {
                      if (chunk) {
                        controller.enqueue(chunk);
                      } else {
                        controller.close();
                        return;
                      }
                  };
                  zitiResponse.body.on('data', (chunk: any) => {
                    push(chunk);
                  });
                  zitiResponse.body.on('end', () => {
                    push(null);
                  });
              }
          });

          response = new Response( responseStream, { "status": zitiResponse.status, "headers":  headers } );
        }

      } else {

        response = new Response( null, { "status": zitiResponse.status, "headers":  headers } );

      }
      
      this.logger.trace(`ZitiFirstStrategy: formed native response: `, response);

    } catch (fetchError) {
      this.logger.error(`Got error: `, fetchError);
      if (fetchError instanceof Error) {
        error = fetchError;
      }
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (response) {
      this.logger.debug(`Got response from Ziti network.`);
    } else {
      if (useCache) {
        this.logger.warn(
          `Unable to get a response from Ziti network. Will respond ` +
            `with a cached response.`,
        );
      }
    }

    if ((error || !response) && useCache) {
      response = await handler.cacheMatch(request);
      if (response) {
        this.logger.debug(`Found a cached response in the '${this.cacheName}'` + ` cache.`);
      }
    }

    return response;
  }

    
  /**
   * @param {Object} options
   * @param {number|undefined} options.timeoutId
   * @param {Request} options.request
   * @param {Event} options.event
   * @return {Promise<Response>}
   *
   * @private
   */
  async _getNetworkPromise({
    timeoutId,
    request,
    handler,
    useCache,
  }: {
    request: Request;
    timeoutId?: number;
    handler: StrategyHandler;
    useCache: boolean;
  }): Promise<Response | undefined> {
    let error;
    let response;
    try {
      // if (useCache) {
      //   this.logger.debug(`doing raw internet fetchAndCachePut for: `, request.url);
      //   response = await handler.fetchAndCachePut(request);
      // } else {
        this.logger.debug(`doing raw internet fetch for: `, request.url);
        response = await handler.fetch(request);
      // }
      this.logger.debug(`Got response: `, response);
    } catch (fetchError) {
      this.logger.error(`Got error: `, fetchError);
      if (fetchError instanceof Error) {
        error = fetchError;
      }
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (response) {
      this.logger.debug(`Got response from network.`);

      /**
       * If we get a failed respose that is also an 'opaqueredirect', it is most likely
       * because the attempt to fetch something served by the HTTP Agent is being canceled,
       * then redirected to the IdP (re)authentication URL.
       * 
       * HACK ALERT:
       * For reaons currently unknown, if we do NOT unregister the SW, before letting 
       * the OIDC middleware continue, it will fail... 
       * So, we force an unregister of the SW here to keep the (re)authentication flow working.
       */
      if (!response.ok && ( response.type === 'opaqueredirect' ) ) {
        this.logger.debug(`Got 'opaqueredirect' response from network; doing SW unregister now`);
        await this._zitiBrowzerServiceWorkerGlobalScope._unregister();
      }
  
    } else {
      if (useCache) {
        this.logger.warn(
          `Unable to get a response from the network. Will respond ` +
            `with a cached response.`,
        );
      }
    }

    if ((error || !response) && useCache) {
      response = await handler.cacheMatch(request);
      if (response) {
        this.logger.debug(`Found a cached response in the '${this.cacheName}'` + ` cache.`);
      }
    }

    return response;
  }
}

export {ZitiFirstStrategy};