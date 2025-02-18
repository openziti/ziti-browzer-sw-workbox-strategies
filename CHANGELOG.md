# [0.78.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.77.0...v0.78.0) (2025-02-18)


### Features

* fix a 500 error caused by a bad redirect transform ([#244](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/244)) ([89b0743](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/89b0743926c736e7809f2d4b27a1c76524c66894))



# [0.77.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.76.1...v0.77.0) (2025-02-13)


### Features

* HA OIDC auth mechanisms ([#242](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/242)) ([13e7b07](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/13e7b07a53122d18ed93010e3da4ddf69fceee93))



## [0.76.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.76.0...v0.76.1) (2025-01-21)


### Bug Fixes

* Correct 30x Location header target transform error ([#241](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/241)) ([0206009](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/0206009b204d266f2e05e193c02e1d7f43b7114e))



# [0.76.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.75.5...v0.76.0) (2025-01-21)


### Features

* Add 'Sec-Fetch-Mode navigate' header to HTTP requests when appropriate ([#240](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/240)) ([cd824dd](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/cd824dd150f01bca670fe24bdde2a2338e4a4bbc))



## [0.75.5](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.75.4...v0.75.5) (2025-01-17)


### Bug Fixes

* Correct sub-domain Service-routing issue ([#239](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/239)) ([70427d9](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/70427d9db9470d1104cbcff752e6f1103ad8c4d5))



## [0.75.4](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.75.3...v0.75.4) (2025-01-16)


### Bug Fixes

* Correct sub-domain Service-routing issue ([#238](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/238)) ([d2e0999](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/d2e0999086481375943526cc1206a4f7fd8b2023))



## [0.75.3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.75.2...v0.75.3) (2025-01-15)


### Bug Fixes

* POST via fetch to private API listening on HTTPS fails ([#237](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/237)) ([7994d01](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/7994d014f52282cabbcb44b099d8dea2d59974d7))



## [0.75.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.75.1...v0.75.2) (2025-01-10)


### Bug Fixes

* Bogus access_token from Entra can cause PKCE redirect loop in ZBR ([#236](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/236)) ([19f0a5c](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/19f0a5cc27c9c47e82b59db6c8af63f48862c49b))



## [0.75.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.75.0...v0.75.1) (2025-01-09)


### Bug Fixes

* Drop of very large files into Mattermost causes exception ([#235](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/235)) ([3978157](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/397815701260133e97f49ece32b97d861da0ee62))



# [0.75.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.74.0...v0.75.0) (2024-12-19)


### Features

* Make ZAC served from Controller's /zac binding work under browZer ([#234](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/234)) ([0177bf6](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/0177bf6012b4bf6fca5676545e6cac94552afe73))



# [0.74.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.73.0...v0.74.0) (2024-12-11)


### Features

* Null ptr exception while mishandling service app-connect data results in 500 Response ([#233](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/233)) ([0a4e3fc](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/0a4e3fcc469c3ecb61094215150f45b95373e325))



# [0.73.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.72.0...v0.73.0) (2024-11-20)


### Features

* CSP 'font-src' tweak (add 'data:') ([#232](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/232)) ([4d8decd](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/4d8decddd3cbda71d682058628eab3d286ff0f5a))



# [0.72.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.71.0...v0.72.0) (2024-11-01)


### Features

* id_token -> access_token refactor ([#231](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/231)) ([9c99f5d](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/9c99f5da375548b14f2aa98939b35b73bdfc2a5b))



# [0.71.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.70.0...v0.71.0) (2024-10-21)


### Features

* handle null targetServiceAppData ([#230](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/230)) ([5f64112](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/5f64112c115aa101b2828145559d12db753cc263))



# [0.70.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.69.0...v0.70.0) (2024-10-21)


### Features

* handle null targetServiceAppData ([#229](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/229)) ([5406ddf](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/5406ddf91d2717a2ed366865594d79db2ce0196d))



# [0.69.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.68.0...v0.69.0) (2024-10-20)


### Features

* introduce 'target host transformer' to gzip inflator ([#228](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/228)) ([8833200](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/8833200f2e80ce5322974920480c3a55528570ce))



# [0.68.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.67.0...v0.68.0) (2024-10-08)


### Features

* do not process 'null' as a WebSocket event listener ([#227](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/227)) ([58062e4](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/58062e45b46f537bb8b824e7c1279299ba63d07e))



# [0.67.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.66.0...v0.67.0) (2024-09-26)


### Features

* don't evaporate Angular-specific attributes during HTML streaming ([#226](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/226)) ([569251b](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/569251bbe77cc6026fea59ac503d7c4d61113658))



# [0.66.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.65.0...v0.66.0) (2024-09-24)


### Features

* bump to @openziti/libcrypto-js 0.24.0 ([#225](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/225)) ([beb7dba](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/beb7dba66f55308d2c5afd71e004edafb958f8aa))



# [0.65.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.64.0...v0.65.0) (2024-09-09)


### Features

* HA network detection, and authentication ([#224](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/224)) ([d32bd52](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/d32bd52d3e2c19ecbc912bf84812ea6983787e02))



# [0.64.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.63.0...v0.64.0) (2024-08-29)


### Features

* Use Cert chain when in HA networks ([#222](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/222)) ([b4c941c](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/b4c941c44ec0a214bdbfced96f49865f32b1fe14))



# [0.63.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.62.0...v0.63.0) (2024-08-27)


### Features

* Do not attempt to wrap/stream the Body of a 204 Response ([#221](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/221)) ([549bcf3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/549bcf388942b7ece256ffdcbb453a637ead234e))



# [0.62.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.61.0...v0.62.0) (2024-08-26)


### Features

* Cert chain parsing support ([#220](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/220)) ([fe46469](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/fe46469b6295336ebc735a8cf0fd5e2f88b5c303))



# [0.61.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.60.0...v0.61.0) (2024-08-21)


### Features

* HomeAssistant support: URL intercept tweak ([#219](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/219)) ([75fbf20](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/75fbf208b204c25278e7568ff94325df96708866))



# [0.60.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.59.1...v0.60.0) (2024-08-13)


### Features

* [@import](https://github.com/import) URLs not being adjusted during Response streaming ([#218](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/218)) ([cd5281a](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/cd5281a7712a8bcc4799fb28eeb6936655c65a20))



## [0.59.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.59.0...v0.59.1) (2024-08-06)


### Bug Fixes

* add controller to 'CSP connect-src' if present ([#217](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/217)) ([6eb75e0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/6eb75e09d005b90f666b06c9ef397b0b2abe9c94))



# [0.59.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.58.0...v0.59.0) (2024-08-02)


### Features

* Render Error page if Controller certs are expired ([#216](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/216)) ([53c4613](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/53c461375b447146d1ebe06ad5e92eb7e93fcca1))



# [0.58.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.57.0...v0.58.0) (2024-07-12)


### Features

* new throughput chart in browZer tools ([#215](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/215)) ([8e45448](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/8e454487a7156342aadedf9392271a3554903ab7))



# [0.57.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.56.9...v0.57.0) (2024-07-09)


### Features

* emit error page if wssER connections fail ([#214](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/214)) ([099b869](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/099b86984397b36a4c7df4aef08af65c63d6c940))



## [0.56.9](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.56.8...v0.56.9) (2024-07-08)


### Bug Fixes

* remove obsolete hotkey/modal ([#213](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/213)) ([21ff77f](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/21ff77f9c9e35698ae34870b14c3a19f4e88ac06))



## [0.56.8](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.56.7...v0.56.8) (2024-07-02)


### Bug Fixes

* properly handle WebSocket msgs sent with opcode 2 (binary) ([#212](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/212)) ([29d7881](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/29d788199c2a6ae5e1d7cc8f101b3e917ecbe8dc))



## [0.56.7](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.56.6...v0.56.7) (2024-06-28)


### Bug Fixes

* send chunked WebSocket frames in a single write (prevent RSV2/3 errs) ([#211](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/211)) ([f2ea508](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/f2ea508f6ac328554b4d7e18d2cb094c027be31d))



## [0.56.6](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.56.5...v0.56.6) (2024-06-14)


### Bug Fixes

* upgrade workbox-strategies from 6.5.3 to 6.6.0 ([#210](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/210)) ([fc0c7e4](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/fc0c7e45e5abee6863a3d06d2f32f8037bbfd604))



## [0.56.5](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.56.4...v0.56.5) (2024-06-14)


### Bug Fixes

* upgrade workbox-expiration from 6.5.3 to 6.6.0 ([#209](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/209)) ([585f1bc](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/585f1bc62113e8b3082492c72328ef768e2c39dc))



## [0.56.4](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.56.3...v0.56.4) (2024-06-14)


### Bug Fixes

* upgrade workbox-core from 6.5.3 to 6.6.0 ([#208](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/208)) ([1733f79](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/1733f798bfc99ca0d5658798f4e359f1fe58656d))



## [0.56.3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.56.2...v0.56.3) (2024-06-14)


### Bug Fixes

* upgrade async-mutex from 0.3.2 to 0.5.0 ([#207](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/207)) ([c74095e](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/c74095ea62d48b68503461e2f7875ad4280af4cf))



## [0.56.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.56.1...v0.56.2) (2024-05-22)


### Bug Fixes

* Properly handle cookie values that are b64 (end with '=') ([#206](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/206)) ([ae1b144](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/ae1b144060278c2465758bd8aaa39fe87fdced19))



## [0.56.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.56.0...v0.56.1) (2024-05-13)


### Bug Fixes

* correct a cookie handling issue (Wazuh) ([#205](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/205)) ([d57c760](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/d57c760b6dc8f2d131a817ffa6e4ad76d548867b))



# [0.56.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.55.0...v0.56.0) (2024-04-29)


### Features

* adjust CI/runtime to use hash-bundle name for browZer CSS ([#204](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/204)) ([d812303](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/d812303b504cf54390d6adbb11192e86f25fdba4))



# [0.55.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.54.1...v0.55.0) (2024-04-29)


### Features

* New Settings Dlg (with 'Changelog' and 'Feedback' widgets) ([#203](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/203)) ([934a985](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/934a985df0f2cfd549fbb45543188b6d5eae29ec))



## [0.54.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.54.0...v0.54.1) (2024-04-22)


### Bug Fixes

* Service revocation detect/react enhancements ([#202](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/202)) ([d7c6b8a](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/d7c6b8aa23844c9b4483d6b51493807be1b7f57e))



# [0.54.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.53.0...v0.54.0) (2024-04-19)


### Features

* Origin Trial support ([#201](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/201)) ([ed0de9b](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/ed0de9b579c39349196da4fc4c70bec37185307e))



# [0.53.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.52.6...v0.53.0) (2024-03-31)


### Features

* Blueframe support ([#200](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/200)) ([555f820](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/555f8204f8e23a39ae19fea131febaa6dbf9bbe1))



## [0.52.6](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.52.5...v0.52.6) (2024-03-21)


### Bug Fixes

* avoid using null appdata ([#199](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/199)) ([d3ec6bf](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/d3ec6bfa6b49b095802ffab508b546154c606926))



## [0.52.5](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.52.4...v0.52.5) (2024-03-18)


### Bug Fixes

* Scada web app loses WebSocket connection ([#198](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/198)) ([c855df1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/c855df11971f9f512548085fdf96142fe1d2be9d))



## [0.52.4](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.52.3...v0.52.4) (2024-03-17)


### Bug Fixes

* lb+bootstrapper port handling ([#197](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/197)) ([2ffa428](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/2ffa428c2f1c4899f68007ec618a54c147adcb1f))



## [0.52.3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.52.2...v0.52.3) (2024-03-17)


### Bug Fixes

* non-default lb+bootstrapper port handling ([#196](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/196)) ([cb6819a](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/cb6819a518cf2761f203fb593bd2755e358af9de))



## [0.52.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.52.1...v0.52.2) (2024-03-15)


### Bug Fixes

* non-default bootstrapper port handling ([#195](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/195)) ([7133377](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/71333778a56ff676a6b5285b85a8886f23156677))



## [0.52.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.52.0...v0.52.1) (2024-03-06)


### Bug Fixes

* match redirects with serviceConnectAppData.dst_ip ([#194](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/194)) ([e95f074](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/e95f0742c7c94a8ad6e4f195ef8513583a2cf88e))



# [0.52.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.51.0...v0.52.0) (2024-03-05)


### Features

* improve intercept.v1 config protocol parsing ([#193](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/193)) ([40cdfe5](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/40cdfe5259bc6a377ae8d74c3a27b61a420edc34))



# [0.51.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.50.5...v0.51.0) (2024-03-05)


### Features

* add inflate-deflate support ([#192](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/192)) ([693e8c1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/693e8c147aa61766ba9122637816bacac2d8b010))



## [0.50.5](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.50.4...v0.50.5) (2024-02-28)


### Bug Fixes

* relative path redirect tweak ([#191](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/191)) ([c7ffcae](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/c7ffcae6ecacf201a6a958296eafb1a33a4d8385))



## [0.50.4](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.50.3...v0.50.4) (2024-02-28)


### Bug Fixes

* ECS tweak ([#190](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/190)) ([f8d38b9](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/f8d38b90b717ef7b273ece2466428884191b48c4))



## [0.50.3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.50.2...v0.50.3) (2024-02-22)


### Bug Fixes

* ECS tweak ([#189](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/189)) ([b5b041b](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/b5b041bac1388cdf768ef38b6ceb5f63292c509d))



## [0.50.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.50.1...v0.50.2) (2024-02-21)


### Bug Fixes

* ECS tweak ([#188](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/188)) ([20bd932](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/20bd932676469ed73022638b9df523f7f6021eab))



## [0.50.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.50.0...v0.50.1) (2024-02-21)



# [0.50.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.49.1...v0.50.0) (2024-02-10)


### Features

* OIDC refactor ([#187](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/187)) ([bde75ec](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/bde75ec7e8f394fe883ec1769c5af05f0df2e018))



## [0.49.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.49.0...v0.49.1) (2024-02-05)


### Bug Fixes

* introduce ZitiDummyWebSocketWrapper ([#186](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/186)) ([a4b0b17](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/a4b0b178b223280d2632934d0251aea3dfac08da))



# [0.49.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.48.1...v0.49.0) (2024-02-05)


### Features

* introduce ZitiDummyWebSocketWrapper ([#185](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/185)) ([109c9ae](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/109c9ae020082f41a4525958fa3027b46949c049))



## [0.48.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.48.0...v0.48.1) (2024-01-31)


### Bug Fixes

* do not cache JSON content ([#184](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/184)) ([3dd7de8](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/3dd7de81c69722154b1b886e728dc0901faa2325))



# [0.48.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.47.3...v0.48.0) (2024-01-25)


### Features

* agent pool ([#183](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/183)) ([3b2ba95](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/3b2ba95bd46e21394dc877b37a7eee598689933e))



## [0.47.3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.47.2...v0.47.3) (2024-01-11)


### Bug Fixes

* multi-MB writes fail under nestedTLS ([#182](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/182)) ([90d16a5](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/90d16a58945af4c91565b19b872310cae2de25ce))



## [0.47.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.47.1...v0.47.2) (2024-01-08)


### Bug Fixes

* 'socket hang up' errors (again) ([#181](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/181)) ([854d817](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/854d8175850953fa97a9d479b0fcb0002b871767))



## [0.47.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.47.0...v0.47.1) (2024-01-05)


### Bug Fixes

* typo ([#180](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/180)) ([af48390](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/af483907f28d55f59da7efb9cb1d11b67a53ec46))



# [0.47.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.46.0...v0.47.0) (2024-01-05)


### Features

* introduce 'eruda' url query parm ([#179](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/179)) ([868b628](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/868b6282f18e01c977c559ea1eb74ba56a0bdb7f))



# [0.46.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.45.1...v0.46.0) (2023-12-19)


### Features

* eruda ([#178](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/178)) ([4dc7961](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/4dc79614faeebb865a8d771093de8e2157a32f85))



## [0.45.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.45.0...v0.45.1) (2023-12-18)


### Bug Fixes

* img fetch/render broken due to CSP misalignment ([#177](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/177)) ([eb3857a](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/eb3857a291d3a11194a204e0aeb174afe13b4bfe))



# [0.45.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.44.3...v0.45.0) (2023-12-16)


### Features

* add gzip, and Angular HTML-frag support ([#176](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/176)) ([36e64c9](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/36e64c9ecb2dc236ec767412c4665d3e9b6b3c0a))



## [0.44.3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.44.2...v0.44.3) (2023-12-13)


### Bug Fixes

* add controller and bootstrapper to 'connect-src' CSP ([#175](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/175)) ([46a1d9d](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/46a1d9d5a8e9f07da436ecc7aaf5389b46e62098))



## [0.44.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.44.1...v0.44.2) (2023-12-12)


### Bug Fixes

* inject Keycloak early ([#174](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/174)) ([c6dfd61](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/c6dfd6126ff3b358b1f510ce55d721425ad0c0d5))



## [0.44.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.44.0...v0.44.1) (2023-12-12)


### Bug Fixes

* CSP for Keycloak ([#173](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/173)) ([460d2fd](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/460d2fde30652eb6e4f4a9c9d06d8e20ea57887c))



# [0.44.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.43.1...v0.44.0) (2023-12-11)


### Features

* support Keycloak ([#172](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/172)) ([1ecc155](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/1ecc155fe76f39825a99620e2a26dda889e2dafa))



## [0.43.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.43.0...v0.43.1) (2023-12-06)


### Bug Fixes

* loadBalancer url calc ([#171](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/171)) ([cd45a91](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/cd45a91a40367ebc280e766eef9675b6c076d4dd))



# [0.43.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.42.0...v0.43.0) (2023-12-06)


### Features

* Support multiple wssER's in same network ([#170](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/170)) ([376a624](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/376a624fafdd4db55b870ee080079009763b8c65))



# [0.42.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.41.1...v0.42.0) (2023-12-03)


### Features

* TLS handshake timeout event ([#169](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/169)) ([b5c9b3d](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/b5c9b3dcba32e09034305c57cdecb07a44e75117))



## [0.41.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.41.0...v0.41.1) (2023-11-24)


### Bug Fixes

* handle port on bootstrapper URL ([#168](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/168)) ([0c27c5d](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/0c27c5de8d2cdcee52a10b9599e50f52dcf7b7d0))



# [0.41.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.40.1...v0.41.0) (2023-11-20)


### Features

* Load Balancer support ([#167](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/167)) ([f803889](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/f8038891ffb4275ab6ce48c970c8f60aa930ff6c))



## [0.40.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.40.0...v0.40.1) (2023-11-19)


### Bug Fixes

* typos ([#166](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/166)) ([4f439df](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/4f439df64d0259572908484b2291c8892f703de6))



# [0.40.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.39.2...v0.40.0) (2023-11-14)


### Features

* MSFT RDS/RDP ([#165](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/165)) ([0f532e8](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/0f532e8bb6d5329e4ce8d8c8885ae40bd155aa3d))



## [0.39.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.39.1...v0.39.2) (2023-11-03)


### Bug Fixes

* ensure UA header is present (keep Observium happy) ([#164](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/164)) ([4feb38d](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/4feb38d99e64aee83ea4122113936395d69ca9ff))



## [0.39.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.39.0...v0.39.1) (2023-11-01)


### Bug Fixes

* handle duplicate Set-Cookie headers from Icinga ([#163](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/163)) ([c15d360](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/c15d36044e1e010af0c72e291aa2e8158b40e934))



# [0.39.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.38.0...v0.39.0) (2023-10-30)


### Features

* Dual-mode: JSPI or NO_JSPI ([#162](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/162)) ([6680c27](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/6680c27313f1fd9581ecae25b0cdbd3f798174d8))



# [0.38.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.37.0...v0.38.0) (2023-10-26)


### Features

* monitorix support ([#161](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/161)) ([494fe19](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/494fe192230e59a4c64a922d612511b1f795e021))



# [0.37.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.36.4...v0.37.0) (2023-10-23)


### Features

* JSPI ([#160](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/160)) ([fab5ca5](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/fab5ca50cf10f4eb20db196409d510dc2f856c48))



## [0.36.4](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.36.3...v0.36.4) (2023-09-18)


### Bug Fixes

* add 'worker-src' CSP handling ([#159](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/159)) ([8f03c39](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/8f03c39bfeeaee39201b32c33ce6b06d98a3a118))



## [0.36.3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.36.2...v0.36.3) (2023-09-14)


### Bug Fixes

* correct problem with intercepted WebSocket msg handling ([#158](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/158)) ([4ccb761](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/4ccb7619a8c01fb0719c3069e4e8c50429e77434))



## [0.36.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.36.1...v0.36.2) (2023-09-13)


### Bug Fixes

* drop unnecessary/skewed 'origin' header ([#157](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/157)) ([92a3797](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/92a37970235ef485a47af43aa4cda1500eecf7da))



## [0.36.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.36.0...v0.36.1) (2023-09-11)


### Bug Fixes

* don't drop METHOD when building ClientRequest ([#156](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/156)) ([d4fe87c](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/d4fe87ca35b8785d87789974882d991aba7bea14))



# [0.36.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.35.2...v0.36.0) (2023-08-31)


### Features

* Rancher support ([#155](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/155)) ([cf657d0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/cf657d0af093529f6ef02bfd97fa3d86c906a5fc))



## [0.35.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.35.1...v0.35.2) (2023-08-21)


### Bug Fixes

* adjust servicePath ([#154](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/154)) ([dcf71c6](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/dcf71c68e41620902b4b8a74fad146bd550571aa))



## [0.35.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.35.0...v0.35.1) (2023-08-08)


### Bug Fixes

* remove utf-8-validate dep ([#153](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/153)) ([62aa33f](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/62aa33f3fd087874f5c2f527ff717bbd39f68c62))



# [0.35.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.34.0...v0.35.0) (2023-08-08)


### Features

* ZITI_EVENT_NO_WSS_ROUTERS ([#152](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/152)) ([27beebb](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/27beebb4053eb6cf3a3dc96993898d7dff2ef58f))



# [0.34.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.33.2...v0.34.0) (2023-08-02)


### Features

* alert on channelConnectFailEvent ([#151](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/151)) ([41cd843](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/41cd843a8c3ee17432a930d8e8db9f895b942baa))



## [0.33.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.33.1...v0.33.2) (2023-08-02)


### Bug Fixes

* skip 'inject check' when not going over Ziti ([#150](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/150)) ([4be9522](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/4be9522c22157890fabbfb42d59de0c28fb2e211))



## [0.33.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.33.0...v0.33.1) (2023-08-02)


### Bug Fixes

* async SET_COOKIE msging ([#149](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/149)) ([63eb57e](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/63eb57ec62535a1352d3deb7d4c5e3bfa91fb311))



# [0.33.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.32.0...v0.33.0) (2023-07-26)


### Features

* bootstrapper config rename ([#148](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/148)) ([2a6a3aa](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/2a6a3aa9f20fd484b205a5fa8b47af0dfdb6b113))



# [0.32.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.31.0...v0.32.0) (2023-07-24)


### Features

* cert expired alert ([#147](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/147)) ([0c80bd7](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/0c80bd705e5f1a050be7a190f90a2962ef525223))



# [0.31.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.30.4...v0.31.0) (2023-07-19)


### Features

* emit troubleshooting alerts ([#146](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/146)) ([03d45cd](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/03d45cd9ced91648e9653030bba87e4e21f12f90))



## [0.30.4](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.30.3...v0.30.4) (2023-07-13)


### Bug Fixes

* do a GET before a POST at startup (use listControllerVersion) ([#145](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/145)) ([c155409](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/c155409a69337aa945001cdf0e17aeea9cc9bffb))



## [0.30.3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.30.2...v0.30.3) (2023-07-09)


### Bug Fixes

* correct CSP connect-src handling ([#144](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/144)) ([bb21e8b](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/bb21e8bfd089247cc293eec0569d5ff64a15ba4e))



## [0.30.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.30.1...v0.30.2) (2023-06-21)


### Bug Fixes

* eliminate typo in CSP re-generator ([#143](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/143)) ([c94aff2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/c94aff29d40a1eb2c9d89a65c0032f673aa088e6))



## [0.30.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.30.0...v0.30.1) (2023-06-12)


### Bug Fixes

* handle spaces in Service name ([#142](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/142)) ([2150141](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/215014154e72bafedccdd511c994ed7383a078b9))



# [0.30.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.29.0...v0.30.0) (2023-06-03)


### Features

* xgressEvent ([#141](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/141)) ([46ad444](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/46ad444e159bf889ffdfaddb00c989dca4536219))



# [0.29.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.28.0...v0.29.0) (2023-05-30)


### Features

* SW bootstrap enhancement ([#140](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/140)) ([a4320f1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/a4320f1b0c01aa9a95ff8bad2c2c6fec37d74188))



# [0.28.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.27.0...v0.28.0) (2023-05-26)


### Features

* support both 'ws' and 'wss' ER bindings ([#139](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/139)) ([0a96cf7](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/0a96cf7e9e3d70d869d70468cb0aa661fe1aab40))



# [0.27.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.26.1...v0.27.0) (2023-05-23)


### Features

* advanced services support ([#138](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/138)) ([076c032](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/076c032ededac66b320b32062ef657336fe4c760))



## [0.26.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.26.0...v0.26.1) (2023-05-19)


### Bug Fixes

* temp bypass of idpAuthHealthEvent ([#137](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/137)) ([1812a4e](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/1812a4eb86def27d758106aaf3941fc2ed26619c))



# [0.26.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.25.0...v0.26.0) (2023-05-17)


### Features

* bump to core v0.21.1 ([#136](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/136)) ([8e0cffc](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/8e0cffca6f06da6d2472de37dc4644e86bfaa689))



# [0.25.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.24.3...v0.25.0) (2023-05-17)


### Features

* new CSP parser/generator ([#135](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/135)) ([e591980](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/e591980c9dadc7d1d7cec46668314b73e6e54454))



## [0.24.3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.24.2...v0.24.3) (2023-04-22)



## [0.24.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.24.1...v0.24.2) (2023-04-22)


### Bug Fixes

* disable _zbrReloadPending check ([#134](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/134)) ([9d6b421](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/9d6b421dde8cc570f3a472735b0f981c2d93388a))



## [0.24.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.24.0...v0.24.1) (2023-04-05)


### Bug Fixes

* use authQueryElement.typeId ([#133](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/133)) ([b9a840e](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/b9a840e0901bac5e68f5f0fb3ce0b7f6bf9af389))



# [0.24.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.23.0...v0.24.0) (2023-04-04)


### Features

* listen for idpAuthHealthEvent ([#132](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/132)) ([ecf659a](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/ecf659aa88a34956b9c3d7c882111bfbe0e2ef3f))



# [0.23.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.22.0...v0.23.0) (2023-03-30)


### Features

* IdP OIDC work moved to ZBR ([#131](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/131)) ([0544fc5](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/0544fc5d5bd86e33d88a312ee3ce32aeaf5fb28d))



# [0.22.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.21.1...v0.22.0) (2023-01-23)


### Features

* phase-1 https service support ([#128](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/128)) ([1de0051](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/1de0051f7594065d58012487379e69e16e411a1e))



## [0.21.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.21.0...v0.21.1) (2022-11-29)


### Bug Fixes

* handle array of 'Set-Cookie' headers ([#124](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/124)) ([a95f6d0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/a95f6d0426acb338b6489730b1085054f7466431))



# [0.21.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.20.2...v0.21.0) (2022-11-27)


### Features

* use 'memoization' for some frequently-used expensive (core) funcs ([#122](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/122)) ([5c433b3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/5c433b31fe2cc3d6ddff54f554327b6dd58ee237))



## [0.20.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.20.1...v0.20.2) (2022-11-23)


### Bug Fixes

* adjust event handling for large Blob responses (Jellyfin streaming) ([#121](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/121)) ([6b849a9](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/6b849a96a539759b9be41662bce2b9560ff6aab2))



## [0.20.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.20.0...v0.20.1) (2022-11-21)


### Bug Fixes

* host the 'toast' locally, not in CDN ([#120](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/120)) ([f1d3be9](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/f1d3be94dc5064c16fb2b019bd589b407f81fb04))



# [0.20.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.19.0...v0.20.0) (2022-11-18)


### Features

* ZBR CSS handling, logLevel bugfix ([#119](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/119)) ([98bd2bb](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/98bd2bb6db8576d25d4f2951214eedf971aee5fb))



# [0.19.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.18.5...v0.19.0) (2022-11-03)


### Features

* hard refresh recovery ([#116](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/116)) ([68da683](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/68da683a8e81570d4e895af0c84c20c400504182))



## [0.18.5](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.18.4...v0.18.5) (2022-10-31)


### Bug Fixes

* bump to core 0.16.12 ([#115](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/115)) ([8ad3983](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/8ad3983c584c2e60f7d3f7bf3fdb3849edba3afb))



## [0.18.4](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.18.3...v0.18.4) (2022-10-19)


### Bug Fixes

* channel/ws close handling ([#113](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/113)) ([4c657ac](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/4c657acb743129b5c8de3d801e10719ccf2637aa))



## [0.18.3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.18.2...v0.18.3) (2022-10-13)


### Bug Fixes

* adjust ZBR regex ([#111](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/111)) ([d783038](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/d783038c4dc53b4c37a9a2d878f350c08c2be9a5))



## [0.18.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.18.1...v0.18.2) (2022-10-07)


### Bug Fixes

* adjust ZBR regex ([#109](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/109)) ([e840359](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/e84035969567685cfc6a53f5343129b14b57e041))



## [0.18.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.18.0...v0.18.1) (2022-09-13)


### Bug Fixes

* don't hang if some wsER's are offline ([#103](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/103)) ([04e4791](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/04e479128d6b751e609d48367228dc94ded7ebb4))



# [0.18.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.17.0...v0.18.0) (2022-09-06)


### Features

* client-side logLevel control ([#102](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/102)) ([5ee0a72](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/5ee0a722d9729f2e1c8c0c9c4fddb81df4949318))



# [0.17.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.16.1...v0.17.0) (2022-08-31)


### Features

* hotKey modal support ([#99](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/99)) ([bc0dcc4](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/bc0dcc4345b0914a07acfacc350a01e3d0bf4e01))



## [0.16.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.16.0...v0.16.1) (2022-08-30)


### Bug Fixes

* allow longer ZBR init time ([#97](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/97)) ([a030b0b](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/a030b0bd13cea8c55b519fef040008fff5499e2e))



# [0.16.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.15.3...v0.16.0) (2022-08-30)


### Features

* add IdP host to CSP ([#96](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/96)) ([c964acb](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/c964acb9b27c1c408ab7cdb429141b22de25013c))



## [0.15.3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.15.2...v0.15.3) (2022-08-30)


### Bug Fixes

* correct IdP token refresh issue ([#95](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/95)) ([6d6cb2a](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/6d6cb2a8196e4d373ebbf9e02551d90e9e9817dc))



## [0.15.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.15.1...v0.15.2) (2022-08-23)


### Bug Fixes

* correct libsodium e2e encryption regression ([#93](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/93)) ([59bbba8](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/59bbba89fd31c70502e891192b2f5cffe3d8c5f6))



## [0.15.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.15.0...v0.15.1) (2022-08-16)


### Bug Fixes

* initiate proper ZBR bootstrapping by SW ([#91](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/91)) ([98e9336](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/98e9336662dc1020e3164301a7e56fa32c404f79))



# [0.15.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.14.2...v0.15.0) (2022-08-11)


### Features

* initiate proper ZBR bootstrapping by SW ([#89](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/89)) ([1bcfd56](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/1bcfd5621f1943d55525f31a9c8931a1f51cea06))



## [0.14.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.14.1...v0.14.2) (2022-08-05)


### Bug Fixes

* correct unneeded unregister/reloads ([#87](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/87)) ([7d1273d](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/7d1273dae86fcc29e19ebb7846f9426cd83ade8e))



## [0.14.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.14.0...v0.14.1) (2022-08-05)


### Bug Fixes

* correct unregister/reload race ([#86](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/86)) ([c55c204](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/c55c2043542ae9a9fe25115a5d8ff45d3e31983e))



# [0.14.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.13.0...v0.14.0) (2022-08-05)


### Features

* add SW reload event mechanism ([#85](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/85)) ([7b03ef0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/7b03ef0e769d6b4c040658a2bf64787ed8afb253))



# [0.13.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.12.0...v0.13.0) (2022-08-04)


### Features

* add 'toast' mechanism ([#84](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/84)) ([b3d420b](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/b3d420b49182c5e3cb737069abb3d09488d74c0d))



# [0.12.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.11.0...v0.12.0) (2022-08-03)


### Features

* no limits on simultaneous requests ([#83](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/83)) ([04480b3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/04480b3de3848a3cef58e098e76e76e17541b3dd))



# [0.11.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.10.7...v0.11.0) (2022-08-03)


### Features

* enhance SW caching ([#82](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/82)) ([1cba171](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/1cba171572879a987a133bc66e75b9063698b8ee))



## [0.10.7](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.10.6...v0.10.7) (2022-08-02)


### Bug Fixes

* correct MM channel 'Loading...' issue ([#81](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/81)) ([108a33b](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/108a33b4f08cb97662414944e0b956dd120506f2))



## [0.10.6](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.10.5...v0.10.6) (2022-07-25)


### Bug Fixes

* correct missing Buffer reference ([#76](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/76)) ([72488f9](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/72488f92c7a3629ee353cb81125db6fce69babde))



## [0.10.5](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.10.4...v0.10.5) (2022-07-24)


### Bug Fixes

* JWT expiration improvements ([#75](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/75)) ([e6dc9e1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/e6dc9e1f8cd6a7a77516659ed7c05144960b3d61))



## [0.10.4](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.10.3...v0.10.4) (2022-07-21)


### Bug Fixes

* Need for Speed: make EC keys the default ([#74](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/74)) ([0523375](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/0523375ac65f909ca3351bc35dd0600f1908988c))



## [0.10.3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.10.2...v0.10.3) (2022-07-20)


### Bug Fixes

* getMatchConfigInterceptV1 false positives ([#73](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/73)) ([81216b5](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/81216b5712b3124ba0bdd446b2a3643e3df0279f))



## [0.10.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.10.1...v0.10.2) (2022-07-19)


### Bug Fixes

* Pause for session cert sync to ER ([#72](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/72)) ([c6774b2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/c6774b2e8e3e3ffa466f157f8be924693fb2bf00))



## [0.10.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.10.0...v0.10.1) (2022-07-19)


### Bug Fixes

* OWASP JuiceShop fixes ([#71](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/71)) ([e2bce78](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/e2bce78d7f2bc2148510a229785fdb01f97ad00a))



# [0.10.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.6.3...v0.10.0) (2022-07-16)


### Bug Fixes

* Optional WASM Load ([#68](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/68)) ([819a87b](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/819a87b279a9861749e05726553bcab3004ae3e4))
* semver bump ([#66](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/66)) ([e0946dd](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/e0946dd4d7e9c16f55977249b894c250ba2e6efc))
* semver bump ([#67](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/67)) ([3001e78](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/3001e78a3175056dec0400335b32e63b953d98f7))


### Features

* Improved CSP handling; Zitified ZAC enablement ([#65](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/65)) ([c6a5d05](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/c6a5d05d2bd3a8d5ab7453776fc628186c60ea43))



## [0.6.3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.6.2...v0.6.3) (2022-06-21)


### Bug Fixes

* use httpAgent.target.service ([#60](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/60)) ([3d06b52](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/3d06b52ffbd9c35389e00de85763558150e25c68))



## [0.6.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.6.1...v0.6.2) (2022-06-01)



## [0.6.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.6.0...v0.6.1) (2022-05-04)



# [0.6.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.5.0...v0.6.0) (2022-05-02)


### Features

* add IdP access_token handling ([#36](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/36)) ([bff33c9](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/bff33c9c8b629387771615ad7fe99d992f543a94))



# [0.5.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.4.2...v0.5.0) (2022-04-20)


### Features

* intercepts ([#30](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/30)) ([b0d1d6d](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/b0d1d6df22789739ab6419bf0abaa4d85e9e003b))



## [0.4.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.4.1...v0.4.2) (2022-04-12)



## [0.4.1](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.4.0...v0.4.1) (2022-04-12)



# [0.4.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.3.0...v0.4.0) (2022-04-12)


### Features

* phase5 ([#25](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/25)) ([5639106](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/5639106dd9f94eb54237a8fbdac2b1128953c223))



# [0.3.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.2.0...v0.3.0) (2022-04-06)


### Features

* phase4 ([#21](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/21)) ([1d0fd48](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/1d0fd48fd63a01907e17b926dff73d49c1a39591))



# [0.2.0](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.15...v0.2.0) (2022-04-04)


### Features

* phase3 ([#19](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/issues/19)) ([df670b3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/commit/df670b38ba8e8f9f7b79be770732fedb3348269e))



## [0.1.15](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.14...v0.1.15) (2022-03-31)



## [0.1.14](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.13...v0.1.14) (2022-03-28)



## [0.1.13](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.12...v0.1.13) (2022-03-28)



## [0.1.12](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.11...v0.1.12) (2022-03-28)



## [0.1.11](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.10...v0.1.11) (2022-03-28)



## [0.1.10](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.9...v0.1.10) (2022-03-28)



## [0.1.9](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.8...v0.1.9) (2022-03-27)



## [0.1.8](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.7...v0.1.8) (2022-03-25)



## [0.1.7](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.6...v0.1.7) (2022-03-25)



## [0.1.6](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.5...v0.1.6) (2022-03-24)



## [0.1.5](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.4...v0.1.5) (2022-03-04)



## [0.1.4](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.3...v0.1.4) (2022-03-03)



## [0.1.3](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.2...v0.1.3) (2022-03-02)



## [0.1.2](https://github.com/openziti/ziti-browzer-sw-workbox-strategies/compare/v0.1.1...v0.1.2) (2022-03-02)



## 0.1.1 (2022-03-02)



