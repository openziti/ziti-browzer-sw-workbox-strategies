
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
  url?: string | '';
}

var regexZBR      = new RegExp( /ziti-browzer-runtime/, 'g' );
var regexZBWASM   = new RegExp( /libcrypto.wasm/,       'g' );
var regexSlash    = new RegExp( /^\/$/,                 'g' );
var regexDotSlash = new RegExp( /^\.\//,                'g' );
var regexTextHtml = new RegExp( /text\/html/,           'i' );
var regexImage    = new RegExp( /image\//,              'i' );
var regexCSS      = new RegExp( /^.*\.css$/,            'i' );
var regexJS       = new RegExp( /^.*\.js$/,             'i' );
var regexPNG      = new RegExp( /^.*\.png$/,            'i' );
var regexJPG      = new RegExp( /^.*\.jpg$/,            'i' );
var regexSVG      = new RegExp( /^.*\.svg$/,            'i' );
var regexControllerAPI: any;

var MAX_ZITI_FETCH_COUNT = 10;   // aka the maximum number of concurrent Ziti Network Requests (TEMP)

/**
 * An initial (stub) implementation of a
 * [Ziti network first]{@link }
 * request strategy.
 *
 * By default, this strategy will cache responses with a 200 status code as
 * well as [opaque responses]{@link https://developers.google.com/web/tools/workbox/guides/handle-third-party-requests}.
 * Opaque responses are are cross-origin requests where the response doesn't
 * support [CORS]{@link https://enable-cors.org/}.
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
  private _fetchSemaphore: any;
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
    this._fetchSemaphore = withTimeout(new Semaphore( MAX_ZITI_FETCH_COUNT ), 15000);
    this._uuid = options.uuid;
    this._rootPaths = [];

    this._core = new ZitiBrowzerCore({});
    this.logger = this._core.createZitiLogger({
      logLevel: this._logLevel,
      suffix: 'SW'
    });
    this.logger.trace(`ZitiFirstStrategy ctor completed`);
  }


  /**
   * Remain in lazy-sleepy loop until z-b-runtime sends us the _zitiConfig
   * 
   */
  async await_zitiConfig() {
    let self = this;
    let ctr = 0;
    return new Promise((resolve: any, reject: any) => {
      (async function waitFor_zitiConfig() {
        if (isUndefined(self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig)) {
          ctr++;
          self.logger.trace(`await_zitiConfig: ...waiting [${ctr}]`);
          if (ctr > 2) {
            // Kick the ZBR, and request the config
            self.logger.trace(`await_zitiConfig: sending ZITI_CONFIG_NEEDED to ZBR`);
            await self._zitiBrowzerServiceWorkerGlobalScope._sendMessageToClients( 
              { 
                type: 'ZITI_CONFIG_NEEDED'
              } 
            );
          }
          else if (ctr > 5) { 
            self.logger.trace(`await_zitiConfig: giving up`);
            return reject('await_zitiConfig timeout') 
          }
          setTimeout(waitFor_zitiConfig, 250);  
        } else {
          self.logger.trace(`await_zitiConfig: config acquired`);
          return resolve();
        }
      })();
    });
  }

  /**
   * Remain in lazy-sleepy loop until z-b-runtime notifies us that it has completed initialization
   * 
   */
   async await_zbrInitialized() {
    let self = this;
    let ctr = 0;
    return new Promise((resolve: any, _reject: any) => {
      (function waitFor_zbrInitialized() {
        if (self._zitiBrowzerServiceWorkerGlobalScope._zbrReloadPending) { // this gets reset when ZBR sends the SW the 
          self.logger.trace(`await_zbrInitialized: ...waiting`);
          if (ctr++ > 1) { return resolve() }
          setTimeout(waitFor_zbrInitialized, 1000);
        } else {
          return resolve();
        }
      })();
    });
  }
  
  /**
   * Do all work necessary to initialize the ZitiFirstStrategy instance.
   * 
   */
  async _initialize() {
    
    // Run the init sequence within a critical-section
    await this._initializationMutex.runExclusive(async () => {
      
      if (!this._initialized) {

        this.logger.trace(`_initialize: entered`);

        if (isUndefined(this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig) || 
            isUndefined(this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.decodedJWT)
        ) {
          await this.await_zitiConfig();
        }

        if (isUndefined(this._zitiContext)) {

          this._zitiContext = this._core.createZitiContext({
            logger:         this.logger,
            controllerApi:  this._controllerApi,
            sdkType:        pjson.name,
            sdkVersion:     pjson.version,
            sdkBranch:      buildInfo.sdkBranch,
            sdkRevision:    buildInfo.sdkRevision,
            token_type:     this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.decodedJWT.token_type,
            access_token:   this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.decodedJWT.access_token,
            httpAgentTargetService: this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.service,
          });
          this.logger.trace(`_initialize: ZitiContext created`);
          this._zitiBrowzerServiceWorkerGlobalScope._zitiContext = this._zitiContext;

          this._zitiContext.setKeyTypeEC();
    
          await this._zitiContext.initialize({
            loadWASM: true   // unlike the ZBR, here in the ZBSW, we always instantiate the internal WebAssembly
          });
    
          this.logger.trace(`_initialize: ZitiContext '${this._uuid}' initialized`);

        } else {

          await this._zitiContext.reInitialize({
            token_type:     this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.decodedJWT.token_type,
            access_token:   this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.decodedJWT.access_token,
          });
    
          this.logger.trace(`_initialize: ZitiContext '${this._uuid}' re-initialized`);

        }

        await this._zitiContext.listControllerVersion();
  
        let result = await this._zitiContext.enroll(); // this acquires an ephemeral Cert

        if (!result) {
          
          this.logger.trace(`_initialize: ephemeral Cert acquisition failed`);

          // If we couldn't acquire a cert, it most likely means that the JWT from the IdP needs a refresh
          
          this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig = undefined;

          let resp = await this._zitiBrowzerServiceWorkerGlobalScope._sendMessageToClients( 
            { 
              type: 'IDP_TOKEN_RESET_NEEDED'
            } 
          );
          this.logger.trace( 'ZitiFirstStrategy: IDP_TOKEN_RESET_NEEDED response: ', resp);

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
    var targetServiceRegex = new RegExp( this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.service, 'g' );
  
    if (request.url.match( regex )) { // yes, the request is targeting the Ziti HTTP Agent

      // let isExpired = await this._zitiContext.isCertExpired();
  
      var newUrl = new URL( request.url );

      if ( newUrl.pathname === '/' ) {

        // this.logger.trace('_shouldRouteOverZiti: root path, bypassing intercept of [%s]: ', request.url);

        result.url = request.url;
        result.routeOverZiti = true;
        result.serviceName = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.service;  

      }
      else 
      if ( (request.url.match( regexZBR )) || ((request.url.match( regexZBWASM ))) ) { // the request seeks z-b-r/wasm
        this.logger.trace('_shouldRouteOverZiti: z-b-r/wasm, bypassing intercept of [%s]: ', request.url);
      }  
      else {

        newUrl.hostname = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.service;
        newUrl.port = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.port;
        this.logger.trace( '_shouldRouteOverZiti: transformed URL: ', newUrl.toString());
    
        result.serviceName = await this._zitiContext.shouldRouteOverZiti( newUrl );
        this.logger.trace(`_shouldRouteOverZiti result.serviceName[%o]`, result.serviceName);
  
        if (isEqual(result.serviceName, '')) { // If we have no config associated with the hostname:port, do not intercept
          this.logger.warn('_shouldRouteOverZiti: no associated Ziti config, bypassing intercept of [%s]', request.url);
        } else {
          result.url = newUrl.toString();
          result.routeOverZiti = true;
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

    if (request.method !== 'GET') {   // Only cache GET responses
      this.logger.trace(`_shouldUseCache: handling ${request.method} method; NOT using cache`);
      return false;
    }
    if (request.url.match( regexControllerAPI )) {   // Never cache responses from Ziti Controller
      this.logger.trace(`_shouldUseCache: handling request to Ziti Controller; NOT using cache`);
      return false;
    }

    if ( (request.url.match( regexZBR )) || ((request.url.match( regexZBWASM ))) ) { // Do not cache the ZBR/WASM
      this.logger.trace(`_shouldUseCache: handling request for ZBR|WASM; NOT using cache`);
      return false;
    }

    if (request.url.match( regexSlash ) ) { // Never cache responses for root path
      this.logger.trace(`_shouldUseCache: handling request for '/'; NOT using cache`);
      return false;
    }

    let url = new URL(request.url);
    let isRootPath = this._rootPaths.find((element: string) => element === `${url.pathname}`);
    if ( isRootPath ) {   // Do not cache the web app's root path
      this.logger.trace(`_shouldUseCache: handling request for ROOT path; NOT using cache`);
      return false;
    }
    
    // Cache everything else
    return true;
  }

  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(request: Request, handler: StrategyHandler): Promise<Response> {

    this.logger.trace(`_handle entered for: `, request.url, this._zitiBrowzerServiceWorkerGlobalScope._uuid);

    if (this._zitiBrowzerServiceWorkerGlobalScope._zbrReloadPending) {
      if (request.url.match( regexZBWASM )) {  // the ZBR loads the WASM during init, so we need to process that request; all others wait
        /* NOP */
      }
      else if (request.url.match( regexControllerAPI )) {   // the ZBR hits the Ziti Controller during init, so we need to process that request; all others wait
        /* NOP */
      }
      else {
        await this.await_zbrInitialized();
      }
    }

    let self = this;
    let skipInject = false;
    let useCache = await this._shouldUseCache(request);
    let url = new URL(request.url);

    if (request.url.match( regexZBR )) {
      self._zitiBrowzerServiceWorkerGlobalScope._zbrReloadPending = true;
      this.logger.trace(`_handle: setting  _zbrReloadPending=true`);
    }

    if (useCache) {
      let cachResponse = await handler.cacheMatch(request);
      if (cachResponse) {
        return cachResponse;
      }
    }

    let response = await this._fetchSemaphore.runExclusive( async ( value: any ) => {

      self.logger.trace('_handle now inside _fetchSemaphore count[%o]: request.url[%o]', value, request.url);

      const promises: Promise<Response | undefined>[] = [];
      let timeoutId: number | undefined;
      let tryZiti: boolean | false;

      let shouldRoute: ZitiShouldRouteResult = {routeOverZiti: false}

      // If hitting the Controller, or seeking z-b-runtime|WASM, then
      // we never go over Ziti, and we let the browser route the request 
      // to the Controller or HTTP Agent.  
      if ( 
        // (isRootPath) ||
        (request.url.match( regexControllerAPI )) ||    // seeking Ziti Controller
        (request.url.match( regexZBR )) ||              // seeking Ziti BrowZer Runtime
        (request.url.match( regexZBWASM ))              // seeking Ziti BrowZer WASM
      ) {
        tryZiti = false;
      } else {
        tryZiti = true;
      }

      if ( tryZiti ) {

        // If possibly going over Ziti, we must first complete the work
        await this._initialize();   //  to ensure WASM is instantiated, 
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

      const _response = await handler.waitUntil(
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

      self.logger.trace('_handle now inside _fetchSemaphore count[%o]: response for request.url[%o] is [%o]', value, request.url, _response);

      return _response;

    }).catch(( err: any ) => {
      this.logger.error(err);
      return new Promise( async (_, reject) => {
        reject( err );
      });
    });

    self.logger.trace('_handle now exited from _fetchSemaphore request.url[%o]', request.url);

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

    if (useCache) {
      await handler.waitUntil(handler.cachePut(request, response.clone()));
    }

    if (!contentType || !contentType.match( regexTextHtml )) {
      skipInject = true;
    }

    if (!skipInject) {
      
      var ignore = false;
          
      if (!ignore) {

        let zbrLocation = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.browzer.runtime.src;
        let httpAgentLocation = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.self.host;
    
        // Inject the Ziti browZer Runtime at the front of <head> element so we are prepared to intercept as soon as possible over on the browser
        let zbr_inject_html = `
<!-- load Ziti browZer Runtime (SW) -->
<script type="text/javascript" src="https://${zbrLocation}"></script>
`;

        if (response.body) {
        
          function streamingHEADReplace() {
  
            let buffer = '';
                      
            return new TransformStream({

              transform(chunk, _controller) {

                chunk = decodeURIComponent(chunk).replace(/\n/g,'').replace(/\t/g,'');

                // Parse the HTML
                const $ = cheerio.load(chunk);

                let zbrElement = $('<script></script> ').attr('type', 'text/javascript').attr('src', `https://${zbrLocation}`).attr('defer', `defer`);

                // Locate the CSP
                let cspElement = $('meta[http-equiv="content-security-policy"]');

                // If we found a CSP
                if (cspElement.length > 0) {

                  self.logger.trace('streamingHEADReplace: CSP found in html with content: ', cspElement.attr('content'));
                  // then augment it to enable WASM load/xeq
                  cspElement.attr('content', cspElement.attr('content') + ` 'unsafe-eval'`);
                  self.logger.trace('streamingHEADReplace: CSP is now enhanced with content: ', cspElement.attr('content'));
                  // Inject the ZBR immediately after the CSP
                  cspElement.after(zbrElement);

                  buffer += $.html();
                }

                // If we did NOT find a CSP
                else {

                  // Inject the ZBR immediately after the <HEAD>
                  buffer += chunk.replace(/<head>/i,`<head>\n${zbr_inject_html}\n`);
                }
              },
              flush(controller) {
                if (buffer) {
                  self.logger.trace('streamingHEADReplace: response HTML is now: ', buffer);
                  controller.enqueue(buffer);
                }
              }
            })
          }
          
          const bodyStream = response.body
            .pipeThrough(new TextDecoderStream())
            .pipeThrough(streamingHEADReplace())
            .pipeThrough(new TextEncoderStream())
            ;

          const newHeaders = new Headers(response.headers);
          
          const newResponse = new Response(bodyStream, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        
          return newResponse;
        }

      }
    
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
      newHeaders.append( 'referer', request.referrer );

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
      var headers = new Headers();
      const keys = Object.keys(zitiHeaders);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let val = zitiHeaders[key][0];
        this.logger.trace( 'ZitiFirstStrategy: zitiResponse.headers: ', key, val);

        if (key.toLowerCase() === 'set-cookie') {
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
        
        else if (key.toLowerCase() === 'content-security-policy') {
          val += ` 'unsafe-eval'`;
        }
        
        headers.append( key, val);
      }
      headers.append( 'x-ziti-browzer-sw-workbox-strategies-version', pjson.version );

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
      if (useCache) {
        this.logger.debug(`doing raw internet fetchAndCachePut for: `, request.url);
        response = await handler.fetchAndCachePut(request);
      } else {
        this.logger.debug(`doing raw internet fetch for: `, request.url);
        response = await handler.fetch(request);
      }
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