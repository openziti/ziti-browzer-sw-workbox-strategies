
import {WorkboxError} from 'workbox-core/_private/WorkboxError.js';
import {StrategyHandler} from 'workbox-strategies/StrategyHandler.js';
import {NetworkFirst} from 'workbox-strategies/NetworkFirst.js';
import {StrategyOptions} from 'workbox-strategies/Strategy.js';
import {Mutex} from 'async-mutex';
import { v4 as uuidv4 } from 'uuid';


import { ZitiBrowzerCore } from '@openziti/ziti-browzer-core';

import pjson from '../package.json';
import { buildInfo } from './buildInfo'


export interface ZitiFirstOptions extends StrategyOptions {
  zitiBrowzerServiceWorkerGlobalScope?: any;
  logLevel?: string;
  controllerApi?: string;
  decodedJWTtoken?: any;
  zitiNetworkTimeoutSeconds?: number;
}

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
class ZitiFirstStrategy extends NetworkFirst {

  private readonly _zitiBrowzerServiceWorkerGlobalScope: any;
  private readonly _zitiNetworkTimeoutSeconds: number;
  private readonly _logLevel: string;
  private readonly _controllerApi: string;
  private readonly _decodedJWTtoken: any;
  private _core: any;
  private _logger: any;
  private _context: any;
  private _initialized: boolean;
  private _initializationMutex: any;
  private _uuid: any;

  /**
   * @param {Object} [options]
   * @param {string} [options._zitiBrowzerServiceWorkerGlobalScope] config dsts
   * @param {string} [options._logLevel] Which level to log at
   * @param {string} [options._controllerApi] Location of Ziti Controller
   * @param {Object} [options.decodedJWTtoken] JWT info
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
    this._decodedJWTtoken = options.decodedJWTtoken || {};
    this._initialized = false;

    this._initializationMutex = new Mutex();
    this._uuid = uuidv4();

    this._core = new ZitiBrowzerCore({});
    this._logger = this._core.createZitiLogger({
      logLevel: this._logLevel,
      suffix: 'SW'
    });
    this._logger.trace(`ZitiFirstStrategy ctor completed`);
  }


  /**
   * Do all work necessry to initialize the ZitiFirstStrategy instance.
   * 
   */
  async _initialize() {
    
    // Run the init sequence within a critical-section
    await this._initializationMutex.runExclusive(async () => {

      if (!this._initialized) {
  
        if (typeof this._zitiBrowzerServiceWorkerGlobalScope._decodedJWTtoken === 'undefined') {
          return
        }

        this._context = this._core.createZitiContext({
          logger:         this._logger,
          controllerApi:  this._controllerApi,
          sdkType:        pjson.name,
          sdkVersion:     pjson.version,
          sdkBranch:      buildInfo.sdkBranch,
          sdkRevision:    buildInfo.sdkRevision,
          updbUser:       this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.decodedJWT.updbUser,
          updbPswd:       this._zitiBrowzerServiceWorkerGlobalScope._zitiConfig.decodedJWT.updbPswd,
        });
        this._logger.trace(`ZitiContext created`);
  
        await this._context.initialize(); // this instantiates the internal WebAssembly
  
        this._logger.trace(`ZitiContext '${this._uuid}' initialized`);
  
        await this._context.enroll(); // this acquires an ephemeral Cert

        this._initialized = true;
  
      }

    })
    .catch(( err: any ) => {
      this._logger.error(err);
      return new Promise( async (_, reject) => {
        reject( err );
      });
    });

  }


  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(request: Request, handler: StrategyHandler): Promise<Response> {

    // 
    await this._initialize()

    const logs: any[] = [];

    const promises: Promise<Response | undefined>[] = [];
    let timeoutId: number | undefined;

    if (this._zitiNetworkTimeoutSeconds) {
      const {id, promise} = this._getZitiTimeoutPromise({request, logs, handler});
      timeoutId = id;
      promises.push(promise);
    }

    const networkPromise = this._getNetworkPromise({
      timeoutId,
      request,
      logs,
      handler,
    });

    promises.push(networkPromise);

    const response = await handler.waitUntil(
      (async () => {
        // Promise.race() will resolve as soon as the first promise resolves.
        return (
          (await handler.waitUntil(Promise.race(promises))) ||
          // If Promise.race() resolved with null, it might be due to a network
          // timeout + a cache miss. If that were to happen, we'd rather wait until
          // the networkPromise resolves instead of returning null.
          // Note that it's fine to await an already-resolved promise, so we don't
          // have to check to see if it's still "in flight".
          (await networkPromise)
        );
      })(),
    );

    if (!response) {
      throw new WorkboxError('no-response', {url: request.url});
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
    logs,
    handler,
  }: {
    request: Request;
    logs: any[];
    timeoutId?: number;
    handler: StrategyHandler;
  }): Promise<Response | undefined> {
    let error;
    let response;
    try {
      this._logger.trace(`doing fetch for: `, request);
      response = await handler.fetchAndCachePut(request);
      this._logger.trace(`Got response: `, response);
    } catch (fetchError) {
      this._logger.trace(`Got error: `, fetchError);
      if (fetchError instanceof Error) {
        error = fetchError;
      }
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (process.env.NODE_ENV !== 'production') {
      if (response) {
        logs.push(`Got response from network.`);
      } else {
        logs.push(
          `Unable to get a response from the network. Will respond ` +
            `with a cached response.`,
        );
      }
    }

    if (error || !response) {
      response = await handler.cacheMatch(request);

      if (process.env.NODE_ENV !== 'production') {
        if (response) {
          logs.push(
            `Found a cached response in the '${this.cacheName}'` + ` cache.`,
          );
        } else {
          logs.push(`No response found in the '${this.cacheName}' cache.`);
        }
      }
    }

    return response;
  }
}

export {ZitiFirstStrategy};