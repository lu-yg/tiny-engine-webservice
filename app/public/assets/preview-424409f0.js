import{w as D,h as a,S as W}from"./index-11692c7d.js";import{resolveComponent as f,openBlock as m,createBlock as A,defineAsyncComponent as B,createVNode as v,createElementBlock as _,createElementVNode as O,resolveDynamicComponent as C,Fragment as x,createCommentVNode as $,createApp as Y}from"vue";import{b as V,a as k,y as J}from"./virtual_svg-icons-register-9a77a691.js";import{R as K,a as z,l as G,_ as q,b as Q}from"./vendor-6a2a38e0.js";import{Notify as X}from"@opentiny/vue";import{_ as L}from"./_plugin-vue_export-helper-c27b6911.js";import"./monaco-73815df4.js";import"prettier";import"prettier/parser-html";import"prettier/parser-postcss";import"prettier/parser-babel";import"@opentiny/vue-icon";import"@opentiny/vue-locale";const y=D(),h="x-lowcode-org",P=()=>{let e;try{e=JSON.parse(V(location.hash.slice(1)))}catch{e={}}return e},Z=async({platform:e,app:r,type:o,id:n,history:t,pageInfo:s,tenant:i}={})=>s?y.post("/app-center/api/schema2code",{platform:e,app:r,pageInfo:s},{headers:{[h]:i}}):y.get("/app-center/api/code",{headers:{[h]:i},params:{platform:e,app:r,type:o,id:n,history:t}}),ee=async({platform:e,app:r,type:o,id:n,history:t,tenant:s}={})=>n?y.get("/app-center/api/preview/metadata",{headers:{[h]:s},params:{platform:e,app:r,type:o,id:n,history:t}}):{},N={},g="~3.11",ne={"@opentiny/vue":`${a}/@opentiny/vue@${g}/runtime/tiny-vue.mjs`,"@opentiny/vue-icon":`${a}/@opentiny/vue@${g}/runtime/tiny-vue-icon.mjs`,"@opentiny/vue-common":`${a}/@opentiny/vue@${g}/runtime/tiny-vue-common.mjs`,"@opentiny/vue-locale":`${a}/@opentiny/vue@${g}/runtime/tiny-vue-locale.mjs`,"@opentiny/vue-renderless/":`${a}/@opentiny/vue-renderless@${g}/`};N.imports={vue:`${a}/vue@3.2.36/dist/vue.runtime.esm-browser.js`,"vue/server-renderer":`${a}/@vue/server-renderer@3.2.36/dist/server-renderer.esm-browser.js`,"vue-i18n":`${a}/vue-i18n@9.2.0-beta.36/dist/vue-i18n.esm-browser.js`,"vue-router":`${a}/vue-router@4.0.16/dist/vue-router.esm-browser.js`,"@vue/devtools-api":`${a}/@vue/devtools-api@6.5.1/lib/esm/index.js`,"@vueuse/core":`${a}/@vueuse/core@9.6.0/index.mjs`,"@vueuse/shared":`${a}/@vueuse/shared@9.6.0/index.mjs`,axios:`${a}/axios@1.0.0-alpha.1/dist/esm/axios.js`,"axios-mock-adapter":`${a}/axios-mock-adapter@1.21.1/dist/axios-mock-adapter.js`,"@opentiny/tiny-engine-webcomponent-core":`${a}/@opentiny/tiny-engine-webcomponent-core@1/dist/tiny-engine-webcomponent-core.es.js`,"@opentiny/tiny-engine-i18n-host":`${a}/@opentiny/tiny-engine-i18n-host@1/dist/tiny-engine-i18n-host.es.js`,"vue-demi":`${a}/vue-demi@0.13.11/lib/index.mjs`,pinia:`${a}/pinia@2.0.22/dist/pinia.esm-browser.js`,...ne,...P().scripts};const re=`<template>\r
  <Main />\r
</template>\r
\r
<script setup>\r
import { provide, watch } from 'vue'\r
import { I18nInjectionKey, createI18n } from 'vue-i18n'\r
import { createPinia } from 'pinia'\r
import { useBroadcastChannel } from '@vueuse/core'\r
import { BROADCAST_CHANNEL, I18N_KEY_MAPS } from './constant.js'\r
import './injectGlobal.js'\r
import './app.js'\r
import lowcode from './lowcode.js'\r
import messages from './locales.js'\r
import Main from './Main.vue'\r
import locale from '@opentiny/vue-locale'\r
\r
const customCreateI18n = ({ locale, messages }) => {\r
  const newMessages = {}\r
  Object.keys(messages).forEach((key) => {\r
    const lang = I18N_KEY_MAPS[key] || key\r
    newMessages[lang] = messages[key]\r
  })\r
\r
  return createI18n({\r
    locale,\r
    messages: newMessages,\r
    legacy: false\r
  })\r
}\r
\r
const i18n = locale.initI18n({\r
  i18n: { locale: 'zh_CN' },\r
  createI18n: customCreateI18n,\r
  messages: {\r
    zhCN: {\r
      change_lang: '切换语言'\r
    },\r
    enUS: {\r
      change_lang: 'change lang'\r
    }\r
  }\r
})\r
\r
if (messages && typeof messages === 'object') {\r
  Object.entries(messages).forEach(([locale, message]) => {\r
    i18n.global.mergeLocaleMessage(locale, message)\r
  })\r
}\r
\r
i18n.lowcode = lowcode\r
\r
window.__app__.use(i18n)\r
provide(I18nInjectionKey, i18n)\r
\r
const { data } = useBroadcastChannel({ name: BROADCAST_CHANNEL.PreviewLang })\r
\r
watch(data, () => {\r
  i18n.global.locale.value = data.value\r
})\r
\r
window.__app__.use(createPinia())\r
<\/script>\r
\r
<style>\r
body {\r
  margin: 0;\r
}\r
</style>\r
`,te=`/**\r
* Copyright (c) 2023 - present TinyEngine Authors.\r
* Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.\r
*\r
* Use of this source code is governed by an MIT-style license.\r
*\r
* THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,\r
* BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR\r
* A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.\r
*\r
*/\r
\r
import * as Vue from 'vue'\r
import * as VueI18n from 'vue-i18n'\r
\r
window.Vue = Vue\r
window.VueI18n = VueI18n\r
`,oe=`/**\r
* Copyright (c) 2023 - present TinyEngine Authors.\r
* Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.\r
*\r
* Use of this source code is governed by an MIT-style license.\r
*\r
* THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,\r
* BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR\r
* A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.\r
*\r
*/\r
\r
const BROADCAST_CHANNEL = {\r
  PreviewLang: 'tiny-lowcode-preview-lang'\r
}\r
\r
export const I18N_KEY_MAPS = {\r
  zhCN: 'zh_CN',\r
  enUS: 'en_US'\r
}\r
\r
export { BROADCAST_CHANNEL }\r
`,se=`/**\r
 * Copyright (c) 2023 - present TinyEngine Authors.\r
 * Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.\r
 *\r
 * Use of this source code is governed by an MIT-style license.\r
 *\r
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,\r
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR\r
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.\r
 *\r
 */\r
\r
function addCss(href) {\r
  const link = document.createElement('link')\r
  link.setAttribute('rel', 'stylesheet')\r
  link.setAttribute('href', href)\r
  document.head.appendChild(link)\r
}\r
addCss('VITE_CDN_DOMAIN/@opentiny/vue-theme@3.11/index.css')\r
addCss('VITE_CDN_DOMAIN/@opentiny/vue-theme-mobile@3.11/index.css')\r
`,ie=`<template>\r
  <h2>页面加载中...</h2>\r
</template>\r
`,ae=`/**\r
 * Copyright (c) 2023 - present TinyEngine Authors.\r
 * Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.\r
 *\r
 * Use of this source code is governed by an MIT-style license.\r
 *\r
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,\r
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR\r
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.\r
 *\r
 */\r
\r
import { getCurrentInstance, nextTick, provide, inject } from 'vue'\r
import { I18nInjectionKey } from 'vue-i18n'\r
import dataSourceMap from './dataSourceMap.js'\r
import * as utils from './utils.js'\r
import * as bridge from './bridge.js'\r
import { useStores } from './storesHelper.js'\r
import { Modal } from '@opentiny/vue'\r
\r
export const lowcodeWrap = (props, context) => {\r
  const global = {}\r
  const instance = getCurrentInstance()\r
  const router = new Proxy(\r
    {},\r
    {\r
      get() {\r
        Modal.alert('页面和区块预览不支持路由操作，请使用应用预览', '提示')\r
        return () => {}\r
      }\r
    }\r
  )\r
  const { t, locale } = inject(I18nInjectionKey).global\r
  const emit = context.emit\r
  const ref = (ref) => instance.refs[ref]\r
\r
  const setState = (newState, callback) => {\r
    Object.assign(global.state, newState)\r
    nextTick(() => callback?.apply(global))\r
  }\r
\r
  const getLocale = () => locale.value\r
  const setLocale = (val) => {\r
    locale.value = val\r
  }\r
\r
  const location = () => window.location\r
  const history = () => window.history\r
\r
  Object.defineProperties(global, {\r
    props: { get: () => props },\r
    emit: { get: () => emit },\r
    setState: { get: () => setState },\r
    router: { get: () => router },\r
    i18n: { get: () => t },\r
    getLocale: { get: () => getLocale },\r
    setLocale: { get: () => setLocale },\r
    location: { get: location },\r
    history: { get: history },\r
    utils: { get: () => utils },\r
    bridge: { get: () => bridge },\r
    dataSourceMap: { get: () => dataSourceMap },\r
    $: { get: () => ref }\r
  })\r
\r
  const wrap = (fn) => {\r
    if (typeof fn === 'function') {\r
      return (...args) => fn.apply(global, args)\r
    }\r
\r
    Object.entries(fn).forEach(([name, value]) => {\r
      Object.defineProperty(global, name, {\r
        get: () => value\r
      })\r
    })\r
\r
    fn.t = t\r
\r
    return fn\r
  }\r
\r
  return wrap\r
}\r
\r
export default () => {\r
  const i18n = inject(I18nInjectionKey)\r
  provide(I18nInjectionKey, i18n)\r
\r
  const stores = useStores()\r
\r
  return { t: i18n.global.t, stores, lowcodeWrap }\r
}\r
`,ce=`/**\r
* Copyright (c) 2023 - present TinyEngine Authors.\r
* Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.\r
*\r
* Use of this source code is governed by an MIT-style license.\r
*\r
* THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,\r
* BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR\r
* A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.\r
*\r
*/\r
\r
import dataSources from './dataSource.js'\r
\r
const dataSourceMap = {}\r
\r
Array.isArray(dataSources.list) &&\r
  dataSources.list.forEach((config) => {\r
    const dataSource = { config: config.data }\r
\r
    const result = {\r
      code: '',\r
      msg: 'success',\r
      data: {}\r
    }\r
    result.data =\r
      dataSource.config.type === 'array'\r
        ? { items: dataSource?.config?.data, total: dataSource?.config?.data?.length }\r
        : dataSource?.config?.data\r
    dataSourceMap[config.name] = dataSource\r
\r
    dataSource.load = () => Promise.resolve(result)\r
  })\r
\r
export default dataSourceMap\r
`,pe=`/**\r
* Copyright (c) 2023 - present TinyEngine Authors.\r
* Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.\r
*\r
* Use of this source code is governed by an MIT-style license.\r
*\r
* THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,\r
* BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR\r
* A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.\r
*\r
*/\r
\r
export default {\r
  list: [],\r
  dataHandler: null\r
}\r
`,le=`/**\r
* Copyright (c) 2023 - present TinyEngine Authors.\r
* Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.\r
*\r
* Use of this source code is governed by an MIT-style license.\r
*\r
* THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,\r
* BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR\r
* A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.\r
*\r
*/\r
\r
import { Pager, Select, Modal, Input } from '@opentiny/vue'\r
export { Pager, Select, Modal, Input }\r
`,Te=`/**\r
* Copyright (c) 2023 - present TinyEngine Authors.\r
* Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.\r
*\r
* Use of this source code is governed by an MIT-style license.\r
*\r
* THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,\r
* BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR\r
* A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.\r
*\r
*/\r
\r
export default {}\r
`,Ee=`/**\r
* Copyright (c) 2023 - present TinyEngine Authors.\r
* Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.\r
*\r
* Use of this source code is governed by an MIT-style license.\r
*\r
* THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,\r
* BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR\r
* A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.\r
*\r
*/\r
\r
export default {\r
  zh_CN: {},\r
  en_US: {}\r
}\r
`,ue=`/**\r
* Copyright (c) 2023 - present TinyEngine Authors.\r
* Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.\r
*\r
* Use of this source code is governed by an MIT-style license.\r
*\r
* THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,\r
* BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR\r
* A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.\r
*\r
*/\r
\r
export {}\r
`,Ie=`/**\r
* Copyright (c) 2023 - present TinyEngine Authors.\r
* Copyright (c) 2023 - present Huawei Cloud Computing Technologies Co., Ltd.\r
*\r
* Use of this source code is governed by an MIT-style license.\r
*\r
* THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,\r
* BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR\r
* A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.\r
*\r
*/\r
\r
import * as userDefinedStores from './stores.js'\r
\r
const validStore = (store) => typeof store === 'function' && store.name === 'useStore' && store.$id\r
\r
const useStores = () => {\r
  const stores = {}\r
\r
  Object.values(userDefinedStores)\r
    .filter(validStore)\r
    .forEach((store) => {\r
      stores[store.$id] = store()\r
    })\r
\r
  return stores\r
}\r
\r
export { validStore, useStores }\r
`,l={};l["App.vue"]=re;l["Main.vue"]=ie;l["constant.js"]=oe;l["app.js"]=se.replace(/VITE_CDN_DOMAIN/g,"https://npm.onmicrosoft.cn");l["injectGlobal.js"]=te;l["lowcode.js"]=ae;l["dataSourceMap.js"]=ce;l["dataSource.js"]=pe;l["utils.js"]=le;l["bridge.js"]=Te;l["locales.js"]=Ee;l["stores.js"]=ue;l["storesHelper.js"]=Ie;const H=e=>e&&typeof e=="object"?`export default ${JSON.stringify(e,null,2)}`.trim():"export default {}",de=e=>{if(!Array.isArray(e))return"export {}";const r=[`import { defineStore } from 'pinia'
`],o=(n={})=>Object.values(n).map(({value:t})=>t==null?void 0:t.replace(/function /,"")).join(`,
`);return e.forEach(({id:n,state:t,getters:s,actions:i})=>{const E=`export const ${n} = defineStore({
  id: '${n}',
  state: () => (${JSON.stringify(t)}),
  getters: {
    ${o(s)}
  },
  actions: {
    ${o(i)}
  }
})`;r.push(E)}),r.join(`
`)},me=()=>"export default {}",Se=e=>{if(!e)return!1;try{const r=Function,o=new r(`return ${e}`),n=Object.prototype.toString.call(o);return n==="[object Function]"||n==="[object AsyncFunction]"}catch{return!1}};function ge({item:e,imports:r,exportNames:o,functionStrs:n}){if(e.type==="npm"){const t=`${e.content.package||""}${e.content.main||""}`;if(t){r[t]=r[t]||{};const s=r[t];e.content.destructuring?(s.destructurings=s.destructurings||[],s.destructurings.push(e.content.exportName),s.aliases=s.aliases||[],s.aliases.push(e.name)):s.exportName=e.name,o.push(e.name)}}else e.type==="function"&&Se(e.content.value)&&(n.push(`const ${e.name} = ${e.content.value}`),o.push(e.name))}function Ae({imports:e,strs:r,functionStrs:o,exportNames:n}){const t=[];Object.entries(e).forEach(([s,i])=>{const E=[];if(i.exportName&&E.push(i.exportName),Array.isArray(i.destructurings)&&i.destructurings.length){const T=i.destructurings.map((c,d)=>{const u=i.aliases[d];return c===u?c:`${c} as ${u}`});E.push(`{ ${T.join(", ")} }`)}t.push(`import ${E.join(", ")} from '${s}'`)}),r.push(...t,...o),n.length&&r.push(`export { ${n.join(", ")} }`)}const Re=e=>{const r=[];if(Array.isArray(e)){const o=[],n=[],t={};e.forEach(s=>{ge({item:s,imports:t,exportNames:o,functionStrs:n})}),Ae({imports:t,strs:r,functionStrs:n,exportNames:o})}return r.join(`
`)},Oe=(e,r)=>`${e}${r.map(o=>`addCss('${o}')`).join(`
`)}`,Ce=e=>{const r=H(e.i18n),o=H(e.dataSource),n=de(e.globalState),t=me(e.bridge),s=Re(e.utils);return{"locales.js":r,"dataSource.js":o,"stores.js":n,"bridge.js":t,"utils.js":s}},fe={VUE:"vue"},U={ERROR_WHEN_COMPILE:"预览时，代码解析、预编译报错",READY_FOR_PREVIEW:"schema 生成的代码，装载成功，即将在线编译预览"};const ye=["createVNode","Fragment","resolveComponent","withDirectives","vShow","vModelSelect","vModelText","vModelCheckbox","vModelRadio","vModelText","vModelDynamic","resolveDirective","mergeProps","createTextVNode","isVNode"],he=ye.map(e=>({regexp:new RegExp(`_${e}`,"g"),replace:`vue.${e}`})),Ne={components:{Repl:K},setup(){const e=new z,r=e.compiler,o=r.compileScript;e.compiler={...r,compileScript(...T){const c=o(...T);let u=G.transformSync(c.content,{babelrc:!1,plugins:[q],sourceMaps:!1,configFile:!1}).code.replace(/import \{.+\} from "vue";/,"");return he.forEach(S=>{u=u.replace(S.regexp,S.replace)}),c.content=u,c}};const n={script:{inlineTemplate:!1}};e.setImportMap(N);const t=async(T,c)=>{await e.setFiles(T,c),e.state.resetFlip=!e.state.resetFlip},s=(T=[])=>{const c={};T.forEach(({type:u,content:{package:S,cdnLink:I}})=>{u==="npm"&&I&&(c[S]=I)});const d={imports:{...N.imports,...c}};e.setImportMap(d)},i=P(),E=[Z(i),ee(i),t(l,"src/Main.vue")];return Promise.all(E).then(([T,c])=>{s(c.utils||[]);const d=T.filter(({errors:p})=>p==null?void 0:p.length).map(({errors:p})=>p).flat().map(({message:p})=>p);if(d.length){const p=U.ERROR_WHEN_COMPILE;return X({type:"error",title:p,message:d.join(`
`),duration:0,position:"top-right"}),p}const u=/lang="jsx"/,S=p=>{const R={...p};return p.panelType===fe.VUE&&(R.panelValue=p.panelValue.replace(u,"")),R},I=e.getFiles(),b=({panelName:p,panelValue:R,index:j})=>{j&&(p="Main.vue"),I[p]=R},F=Oe(I["app.js"],i.styles);I["app.js"]=F,T.map(S).forEach(b);const w=Ce(c);return Object.assign(I,w),t(I),U.READY_FOR_PREVIEW}),{store:e,sfcOptions:n,Monaco:Q}}};function Le(e,r,o,n,t,s){const i=f("Repl");return m(),A(i,{editor:n.Monaco,store:n.store,sfcOptions:n.sfcOptions,showCompileOutput:!1,showImportMap:!1,clearConsole:!1,autoResize:!1},null,8,["editor","store","sfcOptions"])}const Pe=L(Ne,[["render",Le]]),He={PreviewLang:"tiny-lowcode-preview-lang"},Ue=e=>B(()=>{var r,o,n;return Promise.resolve(((n=(o=(r=k)==null?void 0:r.toolbars)==null?void 0:o.find(t=>t.id===e))==null?void 0:n.component)||v("span",null,null))}),ve={setup(){const e=["breadcrumb","lang","media"],[r,o,n]=e.map(Ue),{setBreadcrumbPage:t}=W(),{pageInfo:s}=P();t([s==null?void 0:s.name]);const i=E=>{const T=document.getElementsByClassName("iframe-container")[0],c=document.getElementById("app");T.style.width=E,T.style.margin="auto",c.style.overflow="hidden"};return{previewLangChannel:He.PreviewLang,Breadcrumb:r,ChangeLang:o,ToolbarMedia:n,setViewPort:i}}};const _e={class:"toolbar-wrap"},Me={class:"toolbar-left"},be={class:"toolbar-center"},Fe={class:"toolbar-right"};function we(e,r,o,n,t,s){return m(),_("div",_e,[O("div",Me,[(m(),A(C(n.Breadcrumb)))]),O("div",be,[(m(),A(C(n.ToolbarMedia),{isCanvas:!1,onSetViewPort:n.setViewPort},null,40,["onSetViewPort"]))]),O("div",Fe,[(m(),A(C(n.ChangeLang),{langChannel:n.previewLangChannel},null,8,["langChannel"]))])])}const je=L(ve,[["render",we],["__scopeId","data-v-36726165"]]);const De={components:{Preview:Pe,Toolbar:je},props:{showToolbar:{type:Boolean,default:!0}}};function We(e,r,o,n,t,s){const i=f("Toolbar"),E=f("Preview");return m(),_(x,null,[o.showToolbar?(m(),A(i,{key:0})):$("",!0),v(E)],64)}const Be=L(De,[["render",We],["__scopeId","data-v-506c3d1b"]]),M=Y(Be);J(M);M.mount("#app");
