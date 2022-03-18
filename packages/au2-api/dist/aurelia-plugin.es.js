import{IHttpClient,HttpClient}from"@aurelia/fetch-client";import{DI,Registration,noop}from"@aurelia/kernel";import{AppTask}from"@aurelia/runtime-html";import{IAureliaConfiguration}from"@starnetbih/au2-configuration";import{Authentication,IAuthConfigOptions}from"@starnetbih/au2-auth";
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */const encode=encodeURIComponent,encodeKey=k=>encode(k).replace("%24","$");function buildParam(key,value,traditional){let result=[];if(null==value)return result;if(Array.isArray(value))for(let i=0,l=value.length;i<l;i++)if(traditional)result.push(`${encodeKey(key)}=${encode(value[i])}`);else{const arrayKey=key+"["+("object"==typeof value[i]&&null!==value[i]?i:"")+"]";result=result.concat(buildParam(arrayKey,value[i]))}else if("object"!=typeof value||traditional)result.push(`${encodeKey(key)}=${encode(value)}`);else for(const propertyName in value)result=result.concat(buildParam(key+"["+propertyName+"]",value[propertyName]));return result}function buildQueryString(params,traditional){let pairs=[];const keys=Object.keys(params||{}).sort();for(let i=0,len=keys.length;i<len;i++){const key=keys[i];pairs=pairs.concat(buildParam(key,params[key],traditional))}return 0===pairs.length?"":pairs.join("&")}let Rest=class{client;endpoint;useTraditionalUriTemplates;defaults={headers:{Accept:"application/json","Content-Type":"application/json"}};constructor(client,endpoint,useTraditionalUriTemplates){this.client=client,this.endpoint=endpoint,this.useTraditionalUriTemplates=useTraditionalUriTemplates}addInterceptor(interceptor){this.client.interceptors.push(interceptor)}find(req){return"string"==typeof req?this.request("GET",this.getRequestPath(req,this.useTraditionalUriTemplates)):this.request("GET",this.getRequestPath(req.resource,this.useTraditionalUriTemplates,req.idOrCriteria),void 0,req.options,req.responseOutput)}getRequestPath(resource,traditional,idOrCriteria,criteria){const hasSlash="/"===resource.slice(-1);return"string"==typeof idOrCriteria||"number"==typeof idOrCriteria?resource=`${function(path1,path2){if(!path1)return path2;if(!path2)return path1;const schemeMatch=path1.match(/^([^/]*?:)\//),scheme=schemeMatch&&schemeMatch.length>0?schemeMatch[1]:"";let urlPrefix;urlPrefix=0===(path1=path1.substr(scheme.length)).indexOf("///")&&"file:"===scheme?"///":0===path1.indexOf("//")?"//":0===path1.indexOf("/")?"/":"";const trailingSlash="/"===path2.slice(-1)?"/":"",url1=path1.split("/"),url2=path2.split("/"),url3=[];for(let i=0,ii=url1.length;i<ii;++i)if(".."===url1[i])url3.length&&".."!==url3[url3.length-1]?url3.pop():url3.push(url1[i]);else{if("."===url1[i]||""===url1[i])continue;url3.push(url1[i])}for(let i=0,ii=url2.length;i<ii;++i)if(".."===url2[i])url3.length&&".."!==url3[url3.length-1]?url3.pop():url3.push(url2[i]);else{if("."===url2[i]||""===url2[i])continue;url3.push(url2[i])}return scheme+urlPrefix+url3.join("/")+trailingSlash}(resource,String(idOrCriteria))}${hasSlash?"/":""}`:criteria=idOrCriteria,"object"==typeof criteria&&null!==criteria?resource+=`?${buildQueryString(criteria,traditional)}`:criteria&&(resource+=`${hasSlash?"":"/"}${criteria}${hasSlash?"/":""}`),resource}post(req){return this.request("POST",req.resource,req.body,req.options,req.responseOutput)}async request(method,path,body,options,responseOutput){const requestOptions=this.createRequestOptions(options,method,body),contentType=requestOptions.headers["Content-Type"]||requestOptions.headers["content-type"];this.IsObject(body,contentType)&&(requestOptions.body=/^application\/(.+\+)?json/.test(contentType.toLowerCase())?JSON.stringify(body):buildQueryString(body));const response=await this.client.fetch(path,requestOptions);if(response.status>=200&&response.status<400)return responseOutput&&(responseOutput.response=response),response.json().catch((()=>null));throw response}createRequestOptions(options,method,body){return{headers:{},...this.defaults||{},...options||{},...{method:method,body:body}}}IsObject(body,contentType){return"object"==typeof body&&null!==body&&contentType}};var paramIndex,decorator;Rest=function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r}([(paramIndex=0,decorator=IHttpClient,function(target,key){decorator(target,key,paramIndex)}),function(metadataKey,metadataValue){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(metadataKey,metadataValue)}("design:paramtypes",[Object,String,Boolean])],Rest);const IApiRegistry=DI.createInterface("IApiRegistry");class ApiRegistry{endpoints={};defaultEndpoint;defaultBaseUrl;registerEndpoint(name,configureMethod,defaults,restOptions){const newClient=new HttpClient;let useTraditionalUriTemplates;return void 0!==restOptions&&(useTraditionalUriTemplates=restOptions.useTraditionalUriTemplates),this.endpoints[name]=new Rest(newClient,name,useTraditionalUriTemplates),void 0!==defaults&&(this.endpoints[name].defaults=defaults),"function"==typeof configureMethod?(newClient.configure((newClientConfig=>configureMethod(newClientConfig.withDefaults(this.endpoints[name].defaults)))),this.endpoints[name].defaults=newClient.defaults,this):"string"==typeof configureMethod||this.defaultBaseUrl?this.defaultBaseUrl&&"string"!=typeof configureMethod&&"function"!=typeof configureMethod?(newClient.configure((configure=>configure.withBaseUrl(this.defaultBaseUrl))),this):(newClient.configure((configure=>configure.withBaseUrl(configureMethod))),this):this}getEndpoint(name){return name?this.endpoints[name]||null:this.defaultEndpoint||null}endpointExists(name){return!!this.endpoints[name]}setDefaultEndpoint(name){return this.defaultEndpoint=this.getEndpoint(name),this}setDefaultBaseUrl(baseUrl){return this.defaultBaseUrl=baseUrl,this}configure(config){return config.defaultBaseUrl&&(this.defaultBaseUrl=config.defaultBaseUrl),config.endpoints.forEach((endpoint=>{this.registerEndpoint(endpoint.name,endpoint.endpoint,endpoint.config),endpoint.default&&this.setDefaultEndpoint(endpoint.name)})),config.defaultEndpoint&&this.setDefaultEndpoint(config.defaultEndpoint),this}static register(container){container.register(Registration.singleton(IApiRegistry,this)),container.register(AppTask.beforeActivate(IApiRegistry,(async plugin=>{await ApiRegistry.RegisterFromConfigFileAndAddAuthIntercetor(container,plugin)})))}static async RegisterFromConfigFileAndAddAuthIntercetor(container,plugin){const cfgProvider=container.get(IAureliaConfiguration),cnf=await cfgProvider.get("au2-api"),aut=container.get(Authentication),autoptions=container.get(IAuthConfigOptions);if(cnf)for(const key of Object.keys(cnf))if("authApi"==key)autoptions&&(autoptions.baseUrl=cnf[key].url);else if(plugin.registerEndpoint(key,cnf[key].url),cnf[key].auth){plugin.endpoints[key].addInterceptor(aut.tokenInterceptor)}}}const AureliaApiConfiguration=function createConfiguration(cb,registrations){return{configureCallback:cb,register:ctn=>ctn.register(...registrations,AppTask.beforeCreate((()=>cb(ctn.get(IApiRegistry))))),configure:(cb,regs)=>createConfiguration(cb,regs??registrations)}}(noop,[ApiRegistry]);export{ApiRegistry,AureliaApiConfiguration,IApiRegistry,Rest};
