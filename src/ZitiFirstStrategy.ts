
import {WorkboxError} from 'workbox-core/_private/WorkboxError.js';
import {StrategyHandler} from 'workbox-strategies/StrategyHandler.js';
import {NetworkFirst} from 'workbox-strategies/NetworkFirst.js';
import {CacheFirst} from 'workbox-strategies/CacheFirst.js';
import {StrategyOptions} from 'workbox-strategies/Strategy.js';
import {Mutex} from 'async-mutex';
import { isUndefined, isEqual } from 'lodash-es';


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
var regexControllerAPI: any;

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
  private _uuid: any;

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

    regexControllerAPI = new RegExp( this._controllerApi, 'g' );

    this._initializationMutex = new Mutex();
    this._uuid = options.uuid;

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
      (function waitFor_zitiConfig() {
        if (isUndefined(self._zitiBrowzerServiceWorkerGlobalScope._zitiConfig)) {
          if (ctr++ > 5) { return reject() }
          setTimeout(waitFor_zitiConfig, 500);  
        } else {
          return resolve();
        }
      })();
    });
  }
  
  /**
   * Do all work necessry to initialize the ZitiFirstStrategy instance.
   * 
   */
  async _initialize() {
    
    // Run the init sequence within a critical-section
    await this._initializationMutex.runExclusive(async () => {

      if (!this._initialized) {

        this.logger.trace(`_initialize entered`);

        if (isUndefined(this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig) || 
            isUndefined(this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.decodedJWT)
        ) {
          await this.await_zitiConfig();
          // this.logger.error(`_zitiConfig.decodedJWT not defined`);
          // return
        }

        this._zitiContext = this._core.createZitiContext({
          logger:         this.logger,
          controllerApi:  this._controllerApi,
          sdkType:        pjson.name,
          sdkVersion:     pjson.version,
          sdkBranch:      buildInfo.sdkBranch,
          sdkRevision:    buildInfo.sdkRevision,
          token_type:     this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.decodedJWT.token_type,
          access_token:   this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.decodedJWT.access_token,
          httpAgentTargetHost: this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.host,
        });
        this.logger.trace(`ZitiContext created`);
        this._zitiBrowzerServiceWorkerGlobalScope._zitiContext = this._zitiContext;
  
        await this._zitiContext.initialize(); // this instantiates the internal WebAssembly
  
        this.logger.trace(`ZitiContext '${this._uuid}' initialized`);
  
        await this._zitiContext.enroll(); // this acquires an ephemeral Cert

        this._initialized = true;
  
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
  
    if (request.url.match( regex )) { // yes, the request is targeting the Ziti HTTP Agent

      // let isExpired = await this._zitiContext.isCertExpired();
  
      var newUrl = new URL( request.url );

      // If seeking root page, do NOT route over Ziti.  Instead, we 
      if ( newUrl.pathname === '/' ) {

        this.logger.trace('_shouldRouteOverZiti: root path, bypassing intercept of [%s]: ', request.url);

      }
      else if ( (request.url.match( regexZBR )) || ((request.url.match( regexZBWASM ))) ) { // the request seeks z-b-r/wasm
        this.logger.trace('_shouldRouteOverZiti: z-b-r/wasm, bypassing intercept of [%s]: ', request.url);
      }  
      else {

        newUrl.hostname = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.host;
        newUrl.port = this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.httpAgent.target.port;
        this.logger.trace( '_shouldRouteOverZiti: transformed URL: ', newUrl.toString());
    
        result.serviceName = await this._zitiContext.shouldRouteOverZiti( newUrl );
        this.logger.trace(`_shouldRouteOverZiti result.serviceName[%o]`, result.serviceName);
  
        if (isEqual(result.serviceName, '')) { // If we have no config associated with the hostname:port, do not intercept
          this.logger.warn('_shouldRouteOverZiti: no associated config, bypassing intercept of [%s]', request.url);
        } else {
          result.url = newUrl.toString();
          result.routeOverZiti = true;
        }   
  
      }
    
    } 
    else if ( (request.url.match( regexZBR )) || ((request.url.match( regexZBWASM ))) ) { // the request seeks z-b-r/wasm
      this.logger.trace('_shouldRouteOverZiti: z-b-r/wasm, bypassing intercept of [%s]: ', request.url);
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
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(request: Request, handler: StrategyHandler): Promise<Response> {

    this.logger.trace('_handle entered for UUID: ', this._zitiBrowzerServiceWorkerGlobalScope._uuid)

    this.logger.trace(`_handle entered for: `, request.url);

    let url = new URL(request.url);
    let useCache = true;

    // Look for requests that should never received cached responses
    if ( 
      (request.url.match( regexControllerAPI )) ||    // seeking Ziti Controller
      (request.url.match( regexZBR )) ||              // seeking Ziti BrowZer Runtime
      (request.url.match( regexZBWASM )) ||           // seeking Ziti BrowZer WASM
      (url.pathname.match( regexSlash ))              // seeking root page of webapp
    ) {
      useCache = false;
    }

    if (useCache) {
      let cachResponse = await handler.cacheMatch(request);
      if (cachResponse) {
        return cachResponse;
      }
    }

    const logs: any[] = [];

    const promises: Promise<Response | undefined>[] = [];
    let timeoutId: number | undefined;
    let tryZiti: boolean | false;

    let shouldRoute: ZitiShouldRouteResult = {routeOverZiti: false}

    let newUrl = new URL( request.url );

    // If hitting the root page, or Controller, or seeking z-b-runtime/WASM, then
    // we never go over Ziti, and we let the browser route the request to the HTTP Agent.  
    if ( 
      (newUrl.pathname === '/' ) ||                   // seeking root page
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
      const {id, promise} = this._getZitiTimeoutPromise({request, logs, handler});
      timeoutId = id;
      promises.push(promise);
    }

    let networkPromise = null;
    let zitiNetworkPromise = null;

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

    const response = await handler.waitUntil(
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
    );

    if (!response) {
      throw new WorkboxError('no-response', {url: request.url});
    }

    if (useCache) {
      await handler.waitUntil(handler.cachePut(request, response.clone()));
    }

    return response;
  }

  /**
   * @param {Object} options
   * @param {Request} options.request
   * @param {Array} options.logs A reference to the logs array
   * @param {Event} options.event
   * @return {Promise<Response>}
   *
   * @private
   */
  private _getZitiTimeoutPromise({
    request,
    logs,
    handler,
  }: {
    request: Request;
    logs: any[];
    handler: StrategyHandler;
  }): {promise: Promise<Response | undefined>; id?: number} {
    let timeoutId;
    const timeoutPromise: Promise<Response | undefined> = new Promise(
      (resolve) => {
        const onNetworkTimeout = async () => {
          if (process.env.NODE_ENV !== 'production') {
            logs.push(
              `Timing out the network response at ` +
                `${this._zitiNetworkTimeoutSeconds} seconds.`,
            );
          }
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
   * @param {Array} options.logs A reference to the logs Array.
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

    let error;
    let response;

    try {

      this.logger.debug(`doing Ziti fetch for: `, request.url);
      // response = await handler.fetchAndCachePut(request);
      // this.logger.trace(`Got response: `, response);

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
      
      this.logger.debug(`cookieHeaderValue is: `, cookieHeaderValue);      
                
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
        const key = keys[i];
        const val = zitiHeaders[key][0];
        headers.append( key, val);
        this.logger.trace( 'ZitiFirstStrategy: zitiResponse.headers: ', key, val);
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

    
  /**
   * @param {Object} options
   * @param {number|undefined} options.timeoutId
   * @param {Request} options.request
   * @param {Array} options.logs A reference to the logs Array.
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