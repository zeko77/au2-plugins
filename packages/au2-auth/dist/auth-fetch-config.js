var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { IHttpClient } from "@aurelia/fetch-client";
import { Authentication } from "./authentication";
let FetchConfig = class FetchConfig {
    httpClient;
    auth;
    constructor(httpClient, auth) {
        this.httpClient = httpClient;
        this.auth = auth;
    }
    configure() {
        this.httpClient.configure((httpConfig) => {
            httpConfig.withInterceptor(this.auth.tokenInterceptor);
            return httpConfig;
        });
    }
};
FetchConfig = __decorate([
    __param(0, IHttpClient),
    __metadata("design:paramtypes", [Object, Authentication])
], FetchConfig);
export { FetchConfig };
//# sourceMappingURL=auth-fetch-config.js.map