function e(e,t,i,n){var s,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(r=(o<3?s(r):o>3?s(t,i,r):s(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),s=new WeakMap;let o=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new o(i,e,n)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,n))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,g=globalThis,m=g.trustedTypes,f=m?m.emptyScript:"",v=g.reactiveElementPolyfillSupport,_=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},b=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&c(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:s}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const o=n?.call(this);s?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const e=this.properties,t=[...d(e),...u(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[t,i]of this.elementProperties){const e=this._$Eu(t,i);void 0!==e&&this._$Eh.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,n)=>{if(i)e.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of n){const n=document.createElement("style"),s=t.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=i.cssText,e.appendChild(n)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=n;const o=s.fromAttribute(t,e.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(e,t,i,n=!1,s){if(void 0!==e){const o=this.constructor;if(!1===n&&(s=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??b)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:s},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==s||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[_("elementProperties")]=new Map,w[_("finalized")]=new Map,v?.({ReactiveElement:w}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,E=e=>e,x=A.trustedTypes,C=x?x.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+O,j=`<${T}>`,k=document,P=()=>k.createComment(""),R=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,M="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,L=/>/g,D=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,W=/"/g,q=/^(?:script|style|textarea|title)$/i,I=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),B=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),V=new WeakMap,J=k.createTreeWalker(k,129);function G(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(t):t}const Z=(e,t)=>{const i=e.length-1,n=[];let s,o=2===t?"<svg>":3===t?"<math>":"",r=U;for(let a=0;a<i;a++){const t=e[a];let i,l,c=-1,h=0;for(;h<t.length&&(r.lastIndex=h,l=r.exec(t),null!==l);)h=r.lastIndex,r===U?"!--"===l[1]?r=H:void 0!==l[1]?r=L:void 0!==l[2]?(q.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=D):void 0!==l[3]&&(r=D):r===D?">"===l[0]?(r=s??U,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,i=l[1],r=void 0===l[3]?D:'"'===l[3]?W:z):r===W||r===z?r=D:r===H||r===L?r=U:(r=D,s=void 0);const d=r===D&&e[a+1].startsWith("/>")?" ":"";o+=r===U?t+j:c>=0?(n.push(i),t.slice(0,c)+S+t.slice(c)+O+d):t+O+(-2===c?a:d)}return[G(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class K{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let s=0,o=0;const r=e.length-1,a=this.parts,[l,c]=Z(e,t);if(this.el=K.createElement(l,i),J.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=J.nextNode())&&a.length<r;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(S)){const t=c[o++],i=n.getAttribute(e).split(O),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?te:"?"===r[1]?ie:"@"===r[1]?ne:ee}),n.removeAttribute(e)}else e.startsWith(O)&&(a.push({type:6,index:s}),n.removeAttribute(e));if(q.test(n.tagName)){const e=n.textContent.split(O),t=e.length-1;if(t>0){n.textContent=x?x.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],P()),J.nextNode(),a.push({type:2,index:++s});n.append(e[t],P())}}}else if(8===n.nodeType)if(n.data===T)a.push({type:2,index:s});else{let e=-1;for(;-1!==(e=n.data.indexOf(O,e+1));)a.push({type:7,index:s}),e+=O.length-1}s++}}static createElement(e,t){const i=k.createElement("template");return i.innerHTML=e,i}}function Y(e,t,i=e,n){if(t===B)return t;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const o=R(t)?void 0:t._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),void 0===o?s=void 0:(s=new o(e),s._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(t=Y(e,s._$AS(e,t.values),s,n)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??k).importNode(t,!0);J.currentNode=n;let s=J.nextNode(),o=0,r=0,a=i[0];for(;void 0!==a;){if(o===a.index){let t;2===a.type?t=new X(s,s.nextSibling,this,e):1===a.type?t=new a.ctor(s,a.name,a.strings,this,e):6===a.type&&(t=new se(s,this,e)),this._$AV.push(t),a=i[++r]}o!==a?.index&&(s=J.nextNode(),o++)}return J.currentNode=k,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),R(e)?e===F||null==e||""===e?(this._$AH!==F&&this._$AR(),this._$AH=F):e!==this._$AH&&e!==B&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>N(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==F&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(k.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=K.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new Q(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=V.get(e.strings);return void 0===t&&V.set(e.strings,t=new K(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const s of e)n===t.length?t.push(i=new X(this.O(P()),this.O(P()),this,this.options)):i=t[n],i._$AI(s),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=E(e).nextSibling;E(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,s){this.type=1,this._$AH=F,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(e,t=this,i,n){const s=this.strings;let o=!1;if(void 0===s)e=Y(this,e,t,0),o=!R(e)||e!==this._$AH&&e!==B,o&&(this._$AH=e);else{const n=e;let r,a;for(e=s[0],r=0;r<s.length-1;r++)a=Y(this,n[i+r],t,r),a===B&&(a=this._$AH[r]),o||=!R(a)||a!==this._$AH[r],a===F?e=F:e!==F&&(e+=(a??"")+s[r+1]),this._$AH[r]=a}o&&!n&&this.j(e)}j(e){e===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===F?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==F)}}class ne extends ee{constructor(e,t,i,n,s){super(e,t,i,n,s),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??F)===B)return;const i=this._$AH,n=e===F&&i!==F||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==F&&(i===F||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const oe=A.litHtmlPolyfillSupport;oe?.(K,X),(A.litHtmlVersions??=[]).push("3.3.3");const re=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ae extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const n=i?.renderBefore??t;let s=n._$litPart$;if(void 0===s){const e=i?.renderBefore??null;n._$litPart$=s=new X(t.insertBefore(P(),e),e,void 0,i??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}ae._$litElement$=!0,ae.finalized=!0,re.litElementHydrateSupport?.({LitElement:ae});const le=re.litElementPolyfillSupport;le?.({LitElement:ae}),(re.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},he=(e=ce,t,i)=>{const{kind:n,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(void 0===o&&globalThis.litPropertyMetadata.set(s,o=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),"accessor"===n){const{name:n}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(n,s,e,!0,i)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=i;return function(i){const s=this[n];t.call(this,i),this.requestUpdate(n,s,e,!0,i)}}throw Error("Unsupported decorator location: "+n)};function de(e){return(t,i)=>"object"==typeof i?he(e,t,i):((e,t,i)=>{const n=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),n?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ue(e){return de({...e,state:!0,attribute:!1})}var pe,ge;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(pe||(pe={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(ge||(ge={}));const me=(e,t,i,n)=>{n=n||{},i=null==i?{}:i;const s=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return s.detail=i,e.dispatchEvent(s),s},fe=new Set(["call-service","divider","section","weblink","cast","select"]),ve={alert:"toggle",automation:"toggle",climate:"climate",cover:"cover",fan:"toggle",group:"group",input_boolean:"toggle",input_number:"input-number",input_select:"input-select",input_text:"input-text",light:"toggle",lock:"lock",media_player:"media-player",remote:"toggle",scene:"scene",script:"script",sensor:"sensor",timer:"timer",switch:"toggle",vacuum:"toggle",water_heater:"climate",input_datetime:"input-datetime"},_e="\\[\\[([^[\\]]+)\\]\\]",ye="!",be=`\\[\\[${ye}([^[\\]]+)\\]\\]`;function $e(e){return new RegExp(be).test(e)}const we="(\\?)?",Ae=new RegExp("\\?$");function Ee(e){return e.replace(Ae,"")}function xe(e){return Ae.test(e)}const Ce=new RegExp(_e),Se={slug:e=>e.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,""),upper:e=>e.toUpperCase(),lower:e=>e.toLowerCase(),title:e=>e.replace(/\S+/g,e=>e[0].toUpperCase()+e.slice(1).toLowerCase()),kebab:e=>e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")},Oe="json",Te=[...Object.keys(Se),Oe].join("|"),je={friendly_name:(e,t)=>{var i,n,s,o,r,a;const l=null===(i=null==t?void 0:t.entities)||void 0===i?void 0:i[e];return null!==(a=null!==(r=null===(o=null===(s=null===(n=null==t?void 0:t.states)||void 0===n?void 0:n[e])||void 0===s?void 0:s.attributes)||void 0===o?void 0:o.friendly_name)&&void 0!==r?r:null==l?void 0:l.name)&&void 0!==a?a:null==l?void 0:l.original_name},area:(e,t)=>{var i,n,s,o,r,a;const l=null===(i=null==t?void 0:t.entities)||void 0===i?void 0:i[e],c=null!==(n=null==l?void 0:l.area_id)&&void 0!==n?n:null===(o=null===(s=null==t?void 0:t.devices)||void 0===s?void 0:s[null==l?void 0:l.device_id])||void 0===o?void 0:o.area_id;return c?null===(a=null===(r=null==t?void 0:t.areas)||void 0===r?void 0:r[c])||void 0===a?void 0:a.name:void 0},device:(e,t)=>{var i,n,s;const o=null===(i=null==t?void 0:t.entities)||void 0===i?void 0:i[e],r=null===(n=null==t?void 0:t.devices)||void 0===n?void 0:n[null==o?void 0:o.device_id];return null!==(s=null==r?void 0:r.name_by_user)&&void 0!==s?s:null==r?void 0:r.name},floor:(e,t)=>{var i,n,s,o,r,a,l,c;const h=null===(i=null==t?void 0:t.entities)||void 0===i?void 0:i[e],d=null!==(n=null==h?void 0:h.area_id)&&void 0!==n?n:null===(o=null===(s=null==t?void 0:t.devices)||void 0===s?void 0:s[null==h?void 0:h.device_id])||void 0===o?void 0:o.area_id,u=d?null===(a=null===(r=null==t?void 0:t.areas)||void 0===r?void 0:r[d])||void 0===a?void 0:a.floor_id:void 0;return u?null===(c=null===(l=null==t?void 0:t.floors)||void 0===l?void 0:l[u])||void 0===c?void 0:c.name:void 0},area_id:(e,t)=>{var i,n,s,o;const r=null===(i=null==t?void 0:t.entities)||void 0===i?void 0:i[e];return null!==(n=null==r?void 0:r.area_id)&&void 0!==n?n:null===(o=null===(s=null==t?void 0:t.devices)||void 0===s?void 0:s[null==r?void 0:r.device_id])||void 0===o?void 0:o.area_id},device_id:(e,t)=>{var i,n;return null===(n=null===(i=null==t?void 0:t.entities)||void 0===i?void 0:i[e])||void 0===n?void 0:n.device_id}},ke="default:",Pe="or:",Re=`${ke}[^|\\]]*`,Ne=`${Pe}[A-Za-z0-9_-]+`;function Me(e){return e.startsWith(ke)||e.startsWith(Pe)}function Ue(e){return e.startsWith(Pe)?e.slice(3):void 0}const He="attr:",Le=`${He}[a-zA-Z0-9_]+`,De=`${Object.keys(je).sort((e,t)=>t.length-e.length).join("|")}|${Le}`;function ze(e){return e in je||e.startsWith(He)}function We(e,t,i){var n,s,o,r;if(e.startsWith(He)){const r=null===(o=null===(s=null===(n=null==i?void 0:i.states)||void 0===n?void 0:n[t])||void 0===s?void 0:s.attributes)||void 0===o?void 0:o[e.slice(5)];return null==r?void 0:String(r)}const a=null===(r=je[e])||void 0===r?void 0:r.call(je,t,i);return null==a?void 0:String(a)}const qe=`(?:${Te}|${De}|${Ne}|${Re})`,Ie=`(?:\\|(${`${qe}(?:\\|${qe})*`}))?`,Be=new RegExp(`(?:\\|${qe})+$`);function Fe(e,t,i,n){const s=e?e.split("|"):[],o=s[0]===Oe;let r=o?JSON.stringify(t):void 0===t?void 0:String(t),a=null==t||""===t;for(const l of s.slice(o?1:0)){if(Me(l)){if(a){const e=Ue(l),t=void 0===e?l.slice(8):null==n?void 0:n[e];r=null!=t&&"object"!=typeof t?String(t):void 0,a=void 0===r||""===r}continue}if(void 0===r)continue;if(ze(l)){r=We(l,r,i),a=void 0===r||""===r;continue}const e=Se[l];if(!e)return void 0===t?void 0:String(t);r=e(r),a=""===r}return r}function Ve(e,t,i){if(e.startsWith(ye))return;const[n,...s]=Ee(e).split("|");return s.some(Me)?Fe(s.join("|"),t[n],i,t):void 0}const Je=["card","badge","row","element","style"];function Ge(e){if(e&&"object"==typeof e&&!Array.isArray(e))return Object.keys(e)[0]}const Ze=Ge;function Ke(e,t,i,n){if(!(n>=3)&&t&&"object"==typeof t&&!Array.isArray(t))for(const[s,o]of Object.entries(t)){const t=`${e}.${s}`;i.push({[t]:o}),Ke(t,o,i,n+1)}}function Ye(e){const t=[],i=e=>{if(e&&"object"==typeof e&&!Array.isArray(e))for(const[i,n]of Object.entries(e))t.push({[i]:n}),Ke(i,n,t,0)};return Array.isArray(e)?e.forEach(i):i(e),t}function Qe(e){const t=null==e?void 0:e.variables;if(!Array.isArray(t))return[];const i=new Set,n=[];for(const s of t){if(!s||"object"!=typeof s||Array.isArray(s))continue;const e=s.name;"string"==typeof e&&e.trim()&&!i.has(e)&&(i.add(e),n.push(s))}return n}function Xe(e){return Ye(null==e?void 0:e.default)}function et(e,t){const i=[];i.push(...Ye(e));for(const n of Qe(t))"default"in n&&i.push({[n.name]:n.default});return i.push(...Xe(t)),function(e){const t=new Set;return e.filter(e=>{const i=Ze(e);return void 0!==i&&!t.has(i)&&(t.add(i),!0)})}(i)}function tt(e){const t={};for(const i of Ye(e)){const e=Ze(i);void 0===e||e in t||(t[e]=i[e])}return t}function it(e){if(void 0===e)return[];const t=[],i=JSON.stringify(e);if("string"!=typeof i)return t;const n=new RegExp(_e,"g");let s=n.exec(i);for(;null!==s;){if(!s[1].startsWith(ye)){const e=Ee(s[1]);t.push(e.replace(Be,""));for(const i of e.split("|").slice(1)){const e=Ue(i);e&&t.push(e)}}s=n.exec(i)}return t}function nt(e){return Je.map(t=>null==e?void 0:e[t]).filter(e=>void 0!==e)}function st(e,t){const i=it(nt(e)),n=new Set,s=[];for(;i.length;){const e=i.shift();n.has(e)||(n.add(e),s.push(e),e in t&&i.push(...it(t[e])))}return s}function ot(e){const t=Qe(e),i=new Set(function(e){return st(e,tt(et(void 0,e)))}(e)),n=new Set(Xe(e).map(Ze)),s=[],o=[],r=[];for(const a of t){const{name:e}=a;i.has(e)||s.push(e),n.has(e)&&o.push(e),!0===a.required&&("default"in a||n.has(e))&&r.push(e)}return{unused:s,duplicated:o,contradictory:r}}function rt(e,t,i,n){const s=void 0===i?[]:[{index:i+1},{index0:i},{count:null!=n?n:0},{first:0===i},{last:i===(null!=n?n:0)-1}];return[...Ye(e),...Ye(t),...s]}function at(e){return Array.isArray(e)?e:e&&"object"==typeof e&&Object.keys(e).length?[e]:void 0}const lt=["index","index0","count","first","last"];function ct(e){var t;const i=null!==(t=at(e))&&void 0!==t?t:[],n=new Set(i.length?lt:[]);for(const s of i)for(const e of Ye(s))n.add(Object.keys(e)[0]);return[...n]}const ht="nothing in Home Assistant for";function dt(e){const t=JSON.stringify(e);return t.slice(1,t.length-1)}function ut(e,t,i,n){let s=e;return t.forEach(e=>{const t=function(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(Object.keys(e)[0]),o=Object.values(e)[0],r=new RegExp(`"\\[\\[${t}${Ie}${we}\\]\\]"`,"gm"),a=new RegExp(`\\[\\[${t}${Ie}${we}\\]\\]`,"gm"),l=null===o||"object"!=typeof o,c=e=>l||(null!=e?e:"").split("|")[0]===Oe,h=(t,n,s)=>(i.set(`${Object.keys(e)[0]}|${n}`,null!=s?s:function(e){return Array.isArray(e)?"a list":"a mapping"}(o)),t),d=(e,t,i)=>{const s=Fe(t,o,n);return void 0===s?h(e,t,`${ht} "${o}"`):i(s)},u=e=>!!e&&(null==o||""===o);s=s.replace(r,(e,t,i)=>u(i)?e:t?c(t)?d(e,t,e=>JSON.stringify(e)):h(e,t):function(e,t){return"object"==typeof e?JSON.stringify(e):"number"==typeof e||"boolean"==typeof e?String(e):t}(o,e)),s=s.replace(a,(e,t,i)=>u(i)?e:t?c(t)?d(e,t,dt):h(e,t):function(e){return"object"==typeof e?dt(JSON.stringify(e)):"number"==typeof e||"boolean"==typeof e?String(e):dt(String(e))}(o))}),s}function pt(e){if("string"!=typeof e)return!1;const t=new RegExp(`^${Ce.source}$`).exec(e);return!!t&&!t[1].startsWith(ye)&&xe(t[1])}function gt(e){if(Array.isArray(e))return e.filter(e=>!pt(e)).map(e=>gt(e));if(e&&"object"==typeof e){const t={};for(const[i,n]of Object.entries(e))pt(n)||(t[i]=gt(n));return t}if("string"==typeof e){const t=new RegExp(Ce.source,"g");return e.replace(t,(e,t)=>!t.startsWith(ye)&&xe(t)?"":e)}return e}var mt=(e,t,i,n,s,o,r)=>{if(void 0===i)return i;const a=et(e,t);let l=JSON.stringify(i);const c=new RegExp("\\[\\[[^[\\]]*\\?\\]\\]").test(l),h=new Map;if(a.length){let e=0;for(;Ce.test(l)&&e<10;){const t=l;if(l=ut(l,a,h,s),e+=1,l===t)break}if(!o&&10===e&&Ce.test(l)&&console.warn("decluttering-card-plus: gave up substituting variables after 10 passes. Check whether a variable refers to itself."),!o&&h.size){const e=[...h].map(([e,t])=>`[[${e}]] (${t})`),t=[...h.values()].some(e=>e.startsWith(ht)),i=[[...h.values()].some(e=>!e.startsWith(ht))?"A transform only shapes text, so it needs a scalar value - applying one to a mapping or a list would garble its JSON. Give the variable a scalar value, or drop the transform.":"",t?"A resolver reads its value as an entity id and asks Home Assistant, so it needs one that exists and carries what was asked for.":""].filter(Boolean).join(" ");console.warn(`decluttering-card-plus: left ${e.join(", ")} in the card rather than substituting. ${i}`)}}const d=function(e){const t=/\[\[([^[\]]+)\]\]/g;let i=t.exec(e);for(;null!==i;){if(Ee(i[1]).split("|").slice(1).some(Me))return!0;i=t.exec(e)}return!1}(l);d&&(l=function(e,t,i){let n=e;return n=n.replace(/"\[\[([^[\]]+)\]\]"/g,(e,n)=>{const s=Ve(n,t,i);return void 0===s?e:JSON.stringify(s)}),n.replace(/\[\[([^[\]]+)\]\]/g,(e,n)=>{const s=Ve(n,t,i);return void 0===s?e:dt(s)})}(l,tt(a),s));const u=function(e,t){const i=new Set,n=new RegExp(Ce.source,"g");let s=n.exec(e);for(;s;){const o=s[1];o.startsWith(ye)||t.has(o)||xe(o)||i.add(o),s=n.exec(e)}return[...i]}(l,h);if(r&&u.length&&r(u),!o&&u.length){const e=u.map(e=>`[[${e}]]`).join(", "),t=n?`template "${n}"`:"this template";console.warn(`decluttering-card-plus: ${t} uses ${e}, which nothing gives a value to, so it is rendered as written. Set it on the card, or give it a default in the template. To write those brackets on purpose, escape it as [[${ye}${u[0]}]].`)}if(!(a.length||c||d||$e(l)))return i;const p=c?gt(JSON.parse(l)):JSON.parse(l);return $e(l)?JSON.parse(JSON.stringify(p).replace(new RegExp(be,"g"),"[[$1]]")):p};const ft="custom:decluttering-template",vt="custom:decluttering-template-plus",_t=["lovelace","default",""];function yt(e){return e===vt||e===ft}function bt(e,t){if(Array.isArray(e))for(const i of e)bt(i,t);else if(e&&"object"==typeof e)if(yt(e.type))"string"==typeof e.template&&(t[e.template]=e);else for(const i of Object.values(e))bt(i,t)}function $t(e){return Ye(null==e?void 0:e.decluttering_defaults)}function wt(e,t){return t.length?Object.assign(Object.assign({},e),{default:[...Ye(e.default),...t]}):e}function At(e){const t={};if(!e)return t;const i=e.decluttering_templates;return i&&Object.assign(t,i),e.views&&bt(e.views,t),t}function Et(e){const t=At(e),i=$t(e);if(!i.length)return t;const n={};for(const[s,o]of Object.entries(t))n[s]=wt(o,i);return n}function xt(e){const t=null==e?void 0:e.decluttering_templates_from;return t?(Array.isArray(t)?t:[t]).filter(e=>"string"==typeof e):[]}const Ct=new Map;let St=!1;function Ot(e){var t;St||"function"!=typeof(null===(t=null==e?void 0:e.connection)||void 0===t?void 0:t.subscribeEvents)||(St=!0,e.connection.subscribeEvents(e=>{var t;for(const i of function(e){const t=null!=e?e:"";return _t.includes(t)?[..._t]:[t]}(null===(t=null==e?void 0:e.data)||void 0===t?void 0:t.url_path))Ct.delete(i)},"lovelace_updated"))}async function Tt(e,t){const i=Et(t),n=xt(t);if(!e||!n.length)return i;const s=await Promise.all(n.map(t=>function(e,t){Ot(e);const i=Ct.get(t);if(i)return i;const n=_t.includes(t)?null:t,s=e.callWS({type:"lovelace/config",url_path:n}).catch(e=>{var i;return console.warn(`decluttering-card-plus: could not read the dashboard "${t}":`,null!==(i=null==e?void 0:e.message)&&void 0!==i?i:e),null});return Ct.set(t,s),s}(e,t))),o=$t(t),r={};for(const a of s){const e=[...o,...$t(a)];for(const[t,i]of Object.entries(At(a)))r[t]=wt(i,e)}return Object.assign(Object.assign({},r),i)}const jt=["custom:decluttering-card-plus","custom:decluttering-card"];function kt(e,t){if(Array.isArray(e))return e.reduce((e,i)=>e+kt(i,t),0);if(!e||"object"!=typeof e)return 0;if(yt(e.type))return 0;let i=jt.includes(e.type)&&e.template===t?1:0;for(const n of Object.values(e))i+=kt(n,t);return i}function Pt(e,t){var i;const n={views:[],templates:[]};if(!e)return n;(null!==(i=e.views)&&void 0!==i?i:[]).forEach((e,i)=>{var s,o,r;const a=kt(e,t);a&&n.views.push({title:null!==(o=null!==(s=e.title)&&void 0!==s?s:e.path)&&void 0!==o?o:"",path:null!==(r=e.path)&&void 0!==r?r:"",index:i,count:a})});for(const[s,o]of Object.entries(Et(e)))s!==t&&kt(Object.values(o),t)&&n.templates.push(s);return n}function Rt(e,t){return Array.isArray(e)?e.some(e=>Rt(e,t)):!(!e||"object"!=typeof e)&&(yt(e.type)?e.template===t:Object.values(e).some(e=>Rt(e,t)))}function Nt(e,t){var i,n,s,o,r;if(!e)return null;const a=null!==(i=e.views)&&void 0!==i?i:[];for(let l=0;l<a.length;l+=1){const e=a[l];if(Rt(e,t))return{declared:!1,view:{title:null!==(s=null!==(n=e.title)&&void 0!==n?n:e.path)&&void 0!==s?s:"",path:null!==(o=e.path)&&void 0!==o?o:"",index:l}}}return void 0!==(null===(r=e.decluttering_templates)||void 0===r?void 0:r[t])?{declared:!0}:null}function Mt(e,t,i){if(Math.abs(e.length-t.length)>i)return i+1;let n=Array.from({length:t.length+1},(e,t)=>t);for(let s=1;s<=e.length;s+=1){const o=[s];for(let i=1;i<=t.length;i+=1)o[i]=e[s-1]===t[i-1]?n[i-1]:1+Math.min(n[i-1],n[i],o[i-1]);if(Math.min(...o)>i)return i+1;n=o}return n[t.length]}function Ut(e,t){const i=function(e,t){if(!e)return;const i=e.length>8?3:2;let n,s=i+1;for(const o of t){if(o===e)return;const t=Mt(e.toLowerCase(),o.toLowerCase(),i);t<s&&(s=t,n=o)}return s<=i?n:void 0}(e,t);return i?` Did you mean "${i}"?`:""}function Ht(e,t,i){const n=Array.isArray(null==e?void 0:e.views)?e.views:[];return n[t]?Object.assign(Object.assign({},e),{views:n.map((e,n)=>{var s;return n===t?Object.assign(Object.assign({},e),{cards:[...null!==(s=e.cards)&&void 0!==s?s:[],i]}):e})}):e}const Lt=[vt,ft,...jt],Dt=["card","badge","row","element"],zt=["type","template","description","variables","default",...Dt,"style"];function Wt(e,t){if(Array.isArray(e))for(const i of e)Wt(i,t);else if(e&&"object"==typeof e){t(e);for(const i of Object.values(e))Wt(i,t)}}function qt(e){const t=new Set,i=new Set;return Wt(e,e=>{const n=e.type;"string"==typeof n&&(n.startsWith("custom:")&&!Lt.includes(n)&&t.add(n),jt.includes(n)&&"string"==typeof e.template&&i.add(e.template))}),{customTypes:[...t].sort(),templateRefs:[...i].sort()}}function It(e){const t={};for(const o of zt)void 0!==(null==e?void 0:e[o])&&(t[o]=e[o]);for(const o of Object.keys(null!=e?e:{}))o in t||(t[o]=e[o]);const{customTypes:i,templateRefs:n}=qt(e),s=[];return i.length&&s.push(`Requires these custom cards: ${i.join(", ")}`),n.length&&s.push(`Uses these other templates, which are not included here: ${n.join(", ")}`),{payload:t,notes:s}}const Bt=/^[a-z_]+\.[a-z0-9_]+$/,Ft={base:"entity",label:"Entity",selector:{entity:{}},matches:e=>Bt.test(e)};function Vt(e,t){return{base:e,label:t,selector:{text:{}},matches:e=>e.trim().length>0}}const Jt={entity:Ft,entity_id:Ft,name:Vt("name","Name"),title:Vt("title","Title"),heading:Vt("heading","Heading"),icon:{base:"icon",label:"Icon",selector:{icon:{}},matches:e=>e.includes(":")}};function Gt(e,t){return 1===t?e.label:`${e.label} ${t}`}const Zt=[{name:"room_light_tile",summary:"A tile per light, with the light named after itself.",template:{description:"A tile for one light, taking its name from Home Assistant.",variables:[{name:"entity",label:"Light",selector:{entity:{domain:"light"}},required:!0},{name:"name",label:"Name",description:"Leave empty to use the light’s own name",selector:{text:{}}}],card:{type:"tile",entity:"[[entity]]",name:"[[name|or:entity|friendly_name]]",features:[{type:"light-brightness"}]}}},{name:"room_summary",summary:"A heading per area, listing the lights in it. Uses grouping.",template:{description:"One card per area, with a tile for every light in that area.",card:{type:"vertical-stack",cards:[{type:"markdown",content:"## [[area]]\n\n[[entity_count]] lights"},{type:"custom:decluttering-card-plus",template:"room_light_tile",for_each:"[[items]]"}]}}},{name:"sensor_line",summary:"An Entities row showing one sensor with its area.",template:{description:"A row for one sensor, labelled with the area it is in.",variables:[{name:"entity",label:"Sensor",selector:{entity:{}},required:!0}],row:{entity:"[[entity]]",name:"[[entity|friendly_name]] ([[entity|area|default:no area]])"}}},{name:"status_badge",summary:"A badge that only appears when something needs attention.",template:{description:"A badge for one entity, hidden unless it is in the state you care about.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0},{name:"when",label:"Show when the state is",selector:{text:{}},default:"on"}],badge:{type:"entity",entity:"[[entity]]",visibility:[{condition:"state",entity:"[[entity]]",state:"[[when]]"}]}}},{name:"counted_grid",summary:'A numbered grid of anything, showing "3 of 12".',template:{description:"A tile that knows where it sits in a repeat.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0}],card:{type:"tile",entity:"[[entity]]",name:"[[entity|friendly_name]]",footer:{type:"markdown",content:"[[index]] of [[total|or:count]]"}}}}];function Kt(e){return Zt.find(t=>t.name===e)}function Yt(e,t){const i=new Set,n=e=>{Array.isArray(e)?e.forEach(n):e&&"object"==typeof e&&("string"==typeof e.type&&e.type.includes("decluttering-card")&&"string"==typeof e.template&&i.add(e.template),Object.values(e).forEach(n))};return n(e.template),[...i].filter(e=>!t.includes(e))}const Qt="decluttering_open_templates";function Xt(e){const t=null==e?void 0:e[Qt];return Array.isArray(t)?t.filter(e=>"string"==typeof e):[]}function ei(e){return Array.isArray(e)?e.some(ei):!(!e||"object"!=typeof e)&&(!("string"!=typeof e.type||!jt.includes(e.type))||Object.values(e).some(ei))}const ti=["areas","entities","domain","area","floor","label","device_class","integration","exclude","range"];function ii(e){return!(!e||"object"!=typeof e||Array.isArray(e))&&ti.some(t=>void 0!==e[t])}function ni(e){if(void 0===e||!1===e)return;if(!0===e)return["*"];const t=(Array.isArray(e)?e:[e]).filter(e=>"string"==typeof e);return t.length?t:void 0}function si(e,t){if(null==e)return!1;const i=String(e).toLowerCase();return t.some(e=>{const t=e.toLowerCase().split("*").map(e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join(".*");return new RegExp(`^${t}$`).test(i)})}function oi(e,t){return!t||e.some(e=>si(e,t))}function ri(e,t){var i,n,s,o;const r=null!==(i=null==t?void 0:t.area_id)&&void 0!==i?i:null===(s=null===(n=null==e?void 0:e.devices)||void 0===n?void 0:n[null==t?void 0:t.device_id])||void 0===s?void 0:s.area_id;return r?null===(o=null==e?void 0:e.areas)||void 0===o?void 0:o[r]:void 0}function ai(e,t,i){return!i||t.some(t=>{var n,s;return oi([t,null===(s=null===(n=null==e?void 0:e.labels)||void 0===n?void 0:n[t])||void 0===s?void 0:s.name],i)})}function li(e,t,i){var n;if(!i)return!0;const s=(null==t?void 0:t.floor_id)?null===(n=null==e?void 0:e.floors)||void 0===n?void 0:n[t.floor_id]:void 0;return oi([null==t?void 0:t.floor_id,null==s?void 0:s.name],i)}function ci(e,t,i){var n,s,o,r,a,l;return null!==(l=null!==(a=null!==(r=null===(o=null===(s=null===(n=null==e?void 0:e.states)||void 0===n?void 0:n[t])||void 0===s?void 0:s.attributes)||void 0===o?void 0:o.friendly_name)&&void 0!==r?r:null==i?void 0:i.name)&&void 0!==a?a:null==i?void 0:i.original_name)&&void 0!==l?l:t}function hi(e,t){const i=e=>{var t,i;return String(null!==(i=null!==(t=e.name)&&void 0!==t?t:e.area)&&void 0!==i?i:"")},n=e=>{var t,i;return String(null!==(i=null!==(t=e.entity)&&void 0!==t?t:e.area_id)&&void 0!==i?i:"")};return i(e).localeCompare(i(t))||n(e).localeCompare(n(t))}const di={name:e=>{var t,i;return String(null!==(i=null!==(t=e.name)&&void 0!==t?t:e.area)&&void 0!==i?i:"")},entity:e=>{var t,i;return String(null!==(i=null!==(t=e.entity)&&void 0!==t?t:e.area_id)&&void 0!==i?i:"")},id:e=>{var t,i;return String(null!==(i=null!==(t=e.entity)&&void 0!==t?t:e.area_id)&&void 0!==i?i:"")},area:e=>{var t;return String(null!==(t=e.area)&&void 0!==t?t:"")},domain:e=>{var t;return String(null!==(t=e.domain)&&void 0!==t?t:"")},floor:e=>{var t;return String(null!==(t=e.floor)&&void 0!==t?t:"")}};function ui(e,t,i){var n;return!!oi([t.area_id,t.name],ni(i.areas))&&(!!oi([t.area_id,t.name],ni(i.area))&&(!!li(e,t,ni(i.floor))&&!!ai(e,null!==(n=t.labels)&&void 0!==n?n:[],ni(i.label))))}function pi(e,t,i,n){if(!oi([t],ni(n.entities)))return!1;const s=ni(n.domain);if(s&&!si(t.split(".")[0],s))return!1;const o=ni(n.device_class);if(o&&!si(function(e,t,i){var n,s,o,r;return null!==(r=null===(o=null===(s=null===(n=null==e?void 0:e.states)||void 0===n?void 0:n[t])||void 0===s?void 0:s.attributes)||void 0===o?void 0:o.device_class)&&void 0!==r?r:null==i?void 0:i.device_class}(e,t,i),o))return!1;const r=ni(n.integration);if(r&&!oi([null==i?void 0:i.platform],r))return!1;const a=ri(e,i),l=ni(n.area);return!(l&&!oi([null==a?void 0:a.area_id,null==a?void 0:a.name],l))&&(!!li(e,a,ni(n.floor))&&!!ai(e,function(e,t){var i,n,s;const o=null===(i=null==e?void 0:e.devices)||void 0===i?void 0:i[null==t?void 0:t.device_id];return[...null!==(n=null==t?void 0:t.labels)&&void 0!==n?n:[],...null!==(s=null==o?void 0:o.labels)&&void 0!==s?s:[]]}(e,i),ni(n.label)))}function gi(e){if(null!=e)return"object"!=typeof e||Array.isArray(e)?{entities:e}:e}function mi(e,t){var i,n,s;const o=gi(t.exclude),r=[];for(const[a,l]of Object.entries(null!==(i=null==e?void 0:e.entities)&&void 0!==i?i:{})){if(null==l?void 0:l.hidden)continue;if(!pi(e,a,l,t))continue;if(o&&pi(e,a,l,o))continue;const i=ri(e,l);r.push({entity:a,name:ci(e,a,l),domain:a.split(".")[0],area:null!==(n=null==i?void 0:i.name)&&void 0!==n?n:"",area_id:null!==(s=null==i?void 0:i.area_id)&&void 0!==s?s:""})}return r}const fi=["entity","name","domain","area","area_id","total"],vi=["area_id","area","area_icon","floor","total"],_i=["items","entities","entity_count"],yi=["total"];function bi(e,t){if(!ii(t))return[];if(void 0!==t.range){const e=Number(t.range),i=Number.isFinite(e)&&e>0?Math.floor(e):0;return Array.from({length:i},()=>({total:i}))}const i=void 0!==t.areas?function(e,t){var i,n,s,o,r;const a=gi(t.exclude),l=void 0!==(null==a?void 0:a.entities)?Object.assign({areas:a.entities},a):a,c=t.with,h=[];for(const d of Object.values(null!==(i=null==e?void 0:e.areas)&&void 0!==i?i:{})){if(!ui(e,d,t))continue;if(l&&ui(e,d,l))continue;const i=d.floor_id?null===(n=null==e?void 0:e.floors)||void 0===n?void 0:n[d.floor_id]:void 0,a={area_id:d.area_id,area:null!==(s=d.name)&&void 0!==s?s:d.area_id,area_icon:null!==(o=d.icon)&&void 0!==o?o:"",floor:null!==(r=null==i?void 0:i.name)&&void 0!==r?r:""};if(c){const t=[...mi(e,Object.assign(Object.assign({},c),{area:d.area_id}))].sort(hi);if(!t.length&&!c.keep_empty)continue;a.items=t,a.entities=t.map(e=>e.entity),a.entity_count=t.length}h.push(a)}return h}(e,t):mi(e,t);return function(e,t){const i="string"==typeof t.sort?di[t.sort]:void 0,n=void 0===t.sort?[...e].sort(hi):i?[...e].sort((e,t)=>i(e).localeCompare(i(t))||hi(e,t)):[...e];t.reverse&&n.reverse();const s=n.length,o=n.map(e=>Object.assign(Object.assign({},e),{total:s})),r=Number(t.limit);return Number.isFinite(r)&&r>=0?o.slice(0,r):o}(i,t)}function $i(e){return[null==e?void 0:e.entities,null==e?void 0:e.devices,null==e?void 0:e.areas,null==e?void 0:e.floors,null==e?void 0:e.labels]}function wi(e,t){return!!e&&e.length===t.length&&e.every((e,i)=>e===t[i])}function Ai(){let e=document.querySelector("hc-main");return e=e&&e.shadowRoot,e=e&&e.querySelector("hc-lovelace"),e=e&&e.shadowRoot,e=e&&e.querySelector("hui-view"),e?e.lovelace:null}function Ei(){let e=document.querySelector("home-assistant");return e=e&&e.shadowRoot,e=e&&e.querySelector("home-assistant-main"),e=e&&e.shadowRoot,e=e&&e.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),e=e&&e.shadowRoot||e,e=e&&e.querySelector("ha-panel-lovelace"),e=e&&e.shadowRoot,e=e&&e.querySelector("hui-root"),e?e.lovelace:null}function xi(){const e=Ei()||Ai();return null==e?void 0:e.config}function Ci(){const e=Ei()||Ai();return"function"==typeof(null==e?void 0:e.saveConfig)?e:null}const Si="decluttering-card-plus",Oi="decluttering-card-plus-editor",Ti="decluttering-template-plus",ji="decluttering-template-plus-editor",ki="decluttering-card",Pi="decluttering-template",Ri={card:{type:"entity",entity:"sun.sun"},badge:{type:"entity",entity:"sun.sun"},row:{entity:"sun.sun"},element:{type:"icon",icon:"mdi:weather-sunny",style:{color:"yellow"}}},Ni="variable:",Mi=[{name:"for_each",label:"Repeat for each",helper:"One copy of the template per item. Example: - entity: light.hall, name: Hall",selector:{object:{}}},{name:"for_each_from",label:"Repeat for each thing Home Assistant knows about",helper:"One copy per entity or area, kept up to date. Example: domain: light, area: Kitchen",selector:{object:{}}},{name:"gap",label:"Space between copies",helper:"Pixels. Leave it out for the spacing Home Assistant uses everywhere else",selector:{number:{min:0,max:64,mode:"box"}}},{name:"empty",label:"Show instead when nothing matches",helper:"A card to render when the repeat produces no copies. Example: type: markdown, content: Nothing here",selector:{object:{}}},{name:"columns",label:"Columns",helper:"How many copies sit side by side. One stacks them vertically",selector:{number:{min:1,max:6,mode:"box"}}},{name:"min_column_width",label:"Minimum column width",helper:"Pixels. Drops a column rather than going narrower, so the card suits a phone too",selector:{number:{min:50,max:1e3,step:10,mode:"box"}}}],Ui=[{name:"fit",label:"Fit into the layout",helper:"Get out of the way if a card that sizes itself comes out spread across the row",selector:{select:{mode:"dropdown",options:[{value:"box",label:"Keep its own box (default)"},{value:"contents",label:"Get out of the way"}]}}}],Hi=/:host|\.decluttering-container/;function Li(e){return void 0===e||Array.isArray(e)||!!e&&"object"==typeof e}function Di(e,t,i){void 0===i||""===i||Array.isArray(i)&&0===i.length?delete e[t]:e[t]=i}const zi=window.loadCardHelpers?window.loadCardHelpers():void 0;console.info("%c DECLUTTERING-CARD-PLUS \n%c   Version 1.1.0   ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray");const Wi=["card","row","element","badge"];function qi(e){const t=Object.keys(e).filter(e=>Wi.includes(e));return 1===t.length?t[0]:void 0}class Ii extends ae{constructor(){super(...arguments),this.preview=!1,this._strict=!1,this._debug=!1,this._openTemplates=[],this._fitContents=!1}set hass(e){e&&(this._hass=e,this._thing&&(this._thing.hass=e),this.hassAvailable(e))}hassAvailable(e){}static get styles(){return r`
      /*
       * A badge belongs to the flex row of badges, so this wrapper has to get out of the
       * way rather than box it. Styles injected with the style option still reach the
       * badge, but cannot paint on the wrapper itself.
       */
      :host(.decluttering-badge) {
        display: contents;
      }
      :host(.decluttering-container) {
        display: block;
      }
      .debug {
        padding: 12px 16px;
      }
      .debug p {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .debug pre {
        margin: 0;
        overflow: auto;
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.85em;
        white-space: pre-wrap;
        word-break: break-word;
      }
      /*
       * The host is an extra level between the layout and the wrapped card, so a card
       * sized against its container - fill_container on a tile, for example - would
       * otherwise measure itself against this wrapper's content height instead of the
       * space the layout gave it. Against an auto-height parent this resolves to auto,
       * so it changes nothing outside sized containers.
       *
       * Only a card is laid out that way. A picture-elements element is positioned
       * absolutely inside the card, where height: 100% stretches it over the whole
       * image instead of leaving it the size of its icon.
       */
      :host(.decluttering-card) {
        height: 100%;
      }
      /*
       * A card that sizes itself - a button-card given a width, say - is narrower than the
       * share of a row this wrapper is handed, and sits at the left of it, so a stack of
       * them ends up spread out instead of packed together. Asking it to fit its contents takes the
       * wrapper out of the layout so the card becomes the stack's own child and lays out
       * as it would without any of this.
       *
       * Not the default, and it cannot be: with no box there is nothing for the style
       * option to paint on, and the height above stops applying.
       */
      :host(.decluttering-fit-contents) {
        display: contents;
      }
      /*
       * Last, and it has to stay last. Every rule here is :host(.one-class), so they all
       * have the same specificity and the later one wins - which meant a hidden card kept
       * the display: block above and went on holding its place in the layout. It looked
       * right in a masonry view, where a zero-height block leaves no visible gap, and
       * wrong in a horizontal-stack, where it still took a full share of the row and
       * squeezed the cards either side of it.
       */
      :host(.child-card-hidden) {
        display: none;
      }
    `}firstUpdated(){this.updateComplete.then(()=>{this._displayHidden()})}updated(e){super.updated(e);const t=this._thing;t&&("preview"in t&&(t.preview=this.preview),"layout"in t&&(t.layout=this.layout))}_childIsHidden(){const e=this._thing;return!!e&&(!!e.hasAttribute("hidden")||"none"===getComputedStyle(e).display)}_displayHidden(){this._childIsHidden()?this.classList.add("child-card-hidden"):this.classList.contains("child-card-hidden")&&this.classList.remove("child-card-hidden")}_setTemplateConfig(e,t,i,n){var s,o,r;const a=qi(e);if(!a){const t=Wi.filter(t=>void 0!==e[t]);throw new Error(t.length?`This template defines both "${t[0]}" and "${t[1]}". A template can only define one of card, badge, element or row.`:"You must define one card, badge, element, or row in the template")}this._templateName=null!=n?n:this._templateName;const l=null!==(r=null!==(o=null!==(s=e.card)&&void 0!==s?s:e.element)&&void 0!==o?o:e.row)&&void 0!==r?r:e.badge,c=[];this._setResolved(a,mt(t,e,l,n,this._hass,!1,e=>c.push(...e)),this._resolveStyles(e,t,i,n)),this._refuseIfStrict(c)}_refuseIfStrict(e){if(!this._strict||!e.length)return;const t=e.map(e=>`[[${e}]]`).join(", ");this._error=`${1===e.length?"This variable has":"These variables have"} no value: ${t}. The card is set to strict, so it refuses rather than rendering the brackets.`}_resolveStyles(e,t,i,n){let s="";return e.style&&(s+=mt(t,e,e.style,n,this._hass)),i&&(s+=mt(t,e,i,n,this._hass)),s}_setResolved(e,t,i){const n=function(e,t){if(!ei(e))return e;const i=JSON.parse(JSON.stringify(e)),n=e=>{Array.isArray(e)?e.forEach(n):e&&"object"==typeof e&&("string"==typeof e.type&&jt.includes(e.type)?e[Qt]=t:Object.values(e).forEach(n))};return n(i),i}(t,function(e,t){const i=null!=e?e:[];return"string"==typeof t&&t?[...i,t]:[...i]}(this._openTemplates,this._templateName));this._style=i,this._thingConfig=n,this._thingType=e,Ii._createThing(n,e,i=>{this._thingConfig===n&&this._setThing(i,"element"===e?t.style:void 0)})}_setForEach(e,t,i){var n,s,o;if("card"!==qi(e))throw new Error(`for_each needs a template that defines a card. "${t.template}" defines a ${null!==(n=qi(e))&&void 0!==n?n:"different kind of thing"}, which Home Assistant gives one slot - put what you want repeated inside a card template instead.`);const r=i.filter(i=>function(e,t,i){const n=Qe(e).filter(e=>!0===e.required);if(!n.length)return!0;const s=Object.assign(Object.assign({},tt(i)),tt(t));return n.every(e=>{const t=s[e.name];return null!=t&&""!==t})}(e,i,t.variables));if(!r.length&&t.empty)return this._forEach=void 0,null===(s=this._widths)||void 0===s||s.disconnect(),void this._setResolved("card",t.empty,this._resolveStyles(e,t.variables,t.style,t.template));r.length>50&&this._manyWarnedFor!==r.length&&(this._manyWarnedFor=r.length,console.warn(`decluttering-card-plus: the template "${t.template}" is being repeated ${r.length} times on one card. That is a lot to build and a lot to scroll - narrow what it repeats over.`));const a=r.map((i,n)=>mt(rt(i,t.variables,n,r.length),e,e.card,t.template,this._hass));this._forEach={cards:a,max:Number(t.columns)||1,minWidth:Number(t.min_column_width)||void 0,styles:this._resolveStyles(e,t.variables,t.style,t.template)},this._columnsShown=void 0,this._layoutForEach(),this._forEach.minWidth?this._watchWidth():null===(o=this._widths)||void 0===o||o.disconnect()}_layoutForEach(){const e=this._forEach;if(!e)return;const t=function(e,t,i){const n=Math.max(1,Math.floor(t)||1);return!i||i<=0||!e||e<=0?n:Math.min(n,Math.max(1,Math.floor(e/i)))}(this.clientWidth,e.max,e.minWidth);if(t===this._columnsShown)return;this._columnsShown=t;const i=t>1?{type:"grid",columns:t,square:!1,cards:e.cards}:{type:"vertical-stack",cards:e.cards};this._setResolved("card",i,e.styles)}_watchWidth(){this._widths||(this._widths=new ResizeObserver(()=>this._layoutForEach())),this._widths.disconnect(),this._widths.observe(this)}_applyGap(e){const t=Number(e);Number.isFinite(t)&&t>=0?(this.style.setProperty("--grid-card-gap",`${t}px`),this.style.setProperty("--stack-card-gap",`${t}px`)):(this.style.removeProperty("--grid-card-gap"),this.style.removeProperty("--stack-card-gap"))}_setThing(e,t){var i;null===(i=this._savedStyles)||void 0===i||i.forEach((e,t)=>this.style.setProperty(t,e[0],e[1])),this._savedStyles=void 0,t&&(this._savedStyles=new Map,Object.keys(t).forEach(e=>{var i;null===(i=this._savedStyles)||void 0===i||i.set(e,[this.style.getPropertyValue(e),this.style.getPropertyPriority(e)]),this.style.setProperty(e,t[e])})),this._thing=e,this._forwardGridApi(e),this._hass&&(e.hass=this._hass),this._watchForHiding(e)}_watchForHiding(e){this._resizes||(this._resizes=new ResizeObserver(()=>{this._displayHidden()})),this._resizes.disconnect(),this._resizes.observe(e)}connectedCallback(){var e;super.connectedCallback(),this._thing&&this._watchForHiding(this._thing),(null===(e=this._forEach)||void 0===e?void 0:e.minWidth)&&this._watchWidth()}disconnectedCallback(){var e,t;super.disconnectedCallback(),null===(e=this._resizes)||void 0===e||e.disconnect(),null===(t=this._widths)||void 0===t||t.disconnect()}_forwardGridApi(e){const t=this;if(delete t.getGridOptions,delete t.getLayoutOptions,"card"===this._thingType&&e){if(void 0!==this._gridOptions)return t.getGridOptions=()=>this._gridOptions,void("function"==typeof e.getLayoutOptions&&(t.getLayoutOptions=()=>e.getLayoutOptions()));"function"==typeof e.getGridOptions&&(t.getGridOptions=()=>e.getGridOptions()),"function"==typeof e.getLayoutOptions&&(t.getLayoutOptions=()=>e.getLayoutOptions())}}render(){return this._error?I` <ha-alert alert-type="error">${this._error}</ha-alert> `:this._debug&&this._thingConfig?I`
        <ha-card>
          <div class="debug">
            <p>Debug: what this card builds${this._templateName?I` from "${this._templateName}"`:I``}.</p>
            <pre>${JSON.stringify(this._thingConfig,null,2)}</pre>
          </div>
        </ha-card>
      `:this._hass&&this._thing?(this.classList.toggle("decluttering-badge","badge"===this._thingType),this.classList.toggle("decluttering-container","badge"!==this._thingType),this.classList.toggle("decluttering-card","card"===this._thingType),this.classList.toggle("decluttering-fit-contents","card"===this._thingType&&this._fitContents),I`
      ${this._style?I`
              <style>
                ${this._style}
              </style>
            `:""}
      ${this._thing}
    `):I``}static async _createThing(e,t,i){let n,s;if("card"===t&&"divider"!==e.type?s=customElements.get("hui-card"):"badge"===t&&(s=customElements.get("hui-badge")),s){const t=new s;return t.config=e,void i(t)}if(zi)if("card"===t)n="divider"===e.type?(await zi).createRowElement(e):(await zi).createCardElement(e);else if("row"===t)n=(await zi).createRowElement(e);else if("element"===t)n=(await zi).createHuiElement(e);else{if("badge"!==t)throw new Error(`Unsupported thing type '${t}'`);n=(await zi).createBadgeElement(e)}else n=((e,t=!1)=>{const i=(e,t)=>n("hui-error-card",{type:"error",error:e,config:t}),n=(e,t)=>{const n=window.document.createElement(e);try{if(!n.setConfig)return;n.setConfig(t)}catch(s){return console.error(e,s),i(s.message,t)}return n};if(!e||"object"!=typeof e||!t&&!e.type)return i("No type defined",e);let s=e.type;if(s&&s.startsWith("custom:"))s=s.substr(7);else if(t)if(fe.has(s))s=`hui-${s}-row`;else{if(!e.entity)return i("Invalid config given.",e);const t=e.entity.split(".",1)[0];s=`hui-${ve[t]||"text"}-entity-row`}else s=`hui-${s}-card`;if(customElements.get(s))return n(s,e);const o=i(`Custom element doesn't exist: ${e.type}.`,e);o.style.display="None";const r=setTimeout(()=>{o.style.display=""},2e3);return customElements.whenDefined(e.type).then(()=>{clearTimeout(r),me(o,"ll-rebuild",{},o)}),o})(e,"row"===t);n.addEventListener("ll-rebuild",s=>{s.stopPropagation(),Ii._createThing(e,t,e=>{n.replaceWith(e),i(e)})},{once:!0}),i(n)}getCardSize(){return this._thing&&"card"===this._thingType?this._thing.getCardSize():1}}e([ue()],Ii.prototype,"_hass",void 0),e([ue()],Ii.prototype,"_thing",void 0),e([de({type:Boolean})],Ii.prototype,"preview",void 0),e([de({attribute:!1})],Ii.prototype,"layout",void 0),e([ue()],Ii.prototype,"_debug",void 0),e([ue()],Ii.prototype,"_style",void 0),e([ue()],Ii.prototype,"_error",void 0),e([ue()],Ii.prototype,"_fitContents",void 0);class Bi extends Ii{static getConfigElement(){return document.createElement(Oi)}static getStubConfig(){return{type:`custom:${Si}`,template:"follow_the_sun"}}setConfig(e){if(!e.template)throw new Error("Missing template object in your config");this._openTemplates=Xt(e),this._templateName=e.template;const t=function(e,t){if("string"!=typeof t||!t)return;const i=null!=e?e:[],n=i.indexOf(t);return-1===n?void 0:[...i.slice(n),t]}(this._openTemplates,e.template),i=this._openTemplates.length>=25;if(t||i)return void(this._error=t?function(e){const t=e.join(" → ");return 2===e.length?`The template "${e[0]}" uses itself (${t}), which would never finish. A template cannot contain a card that uses it.`:`These templates use each other in a loop (${t}), which would never finish. One of them has to stop using the next.`}(t):(n=this._openTemplates,`Templates are nested more than 25 deep (${n.slice(0,3).join(" → ")} → …), which is deeper than anything is meant to go. Check whether a template ends up using itself.`));var n;const s=xi();if(!s)throw new Error("Could not retrieve the lovelace configuration.");this._error=void 0,this._fitContents="contents"===e.fit;const o=function(e,t){var i;return null!==(i=Et(e)[t])&&void 0!==i?i:null}(s,e.template);if(o)return this._pendingConfig=void 0,void this._applyTemplate(o,e);if(!xt(s).length)throw new Error(`The template "${e.template}" doesn't exist in decluttering_templates or in a custom:decluttering-template card.`+Ut(e.template,Object.keys(Et(s))));this._pendingConfig=e,this._hass&&this.hassAvailable(this._hass)}_applyTemplate(e,t){var i;this._fromRegistry=void 0,this._registry=void 0,this._applyGap(t.gap),this._strict=!0===t.strict,this._debug=!0===t.debug,this._gridOptions=null!==(i=t.grid_options)&&void 0!==i?i:e.grid_options;const n=at(t.for_each);if(n)this._setForEach(e,t,n);else{if(ii(t.for_each_from))return this._fromRegistry={templateConfig:e,config:t},void(this._hass&&this._resolveFromRegistry(this._hass));this._fromResolvers=function(e){const t=JSON.stringify(nt(e));if("string"!=typeof t)return!1;const i=new RegExp(_e,"g");let n=i.exec(t);for(;null!==n;){if(!n[1].startsWith(ye)&&Ee(n[1]).split("|").slice(1).some(ze))return!0;n=i.exec(t)}return!1}(e)?{templateConfig:e,config:t}:void 0,this._setTemplateConfig(e,t.variables,t.style,t.template)}}_rebuildForResolvers(e){const t=this._fromResolvers;if(!t)return;const i=$i(e);wi(this._resolverRegistry,i)||(this._resolverRegistry=i,this._setTemplateConfig(t.templateConfig,t.config.variables,t.config.style,t.config.template))}_resolveFromRegistry(e){var t;const i=this._fromRegistry;if(!i)return;const n=$i(e);if(!wi(this._registry,n)){this._registry=n;try{const t=bi(e,i.config.for_each_from);this._setForEach(i.templateConfig,i.config,t),this._error=void 0}catch(s){this._error=null!==(t=null==s?void 0:s.message)&&void 0!==t?t:String(s)}}}hassAvailable(e){const t=this._pendingConfig;if(!t)return this._resolveFromRegistry(e),void this._rebuildForResolvers(e);this._pendingConfig=void 0;const i=xi();(async function(e,t,i){var n;return null!==(n=(await Tt(e,t))[i])&&void 0!==n?n:null})(e,i,t.template).then(n=>{n?this._applyTemplate(n,t):(this._error=`The template "${t.template}" doesn't exist in decluttering_templates, in a custom:decluttering-template card, or on any dashboard listed in decluttering_templates_from.`,Tt(e,i).then(e=>{this._error+=Ut(t.template,Object.keys(e))}))}).catch(e=>{var i;this._error=`Could not resolve the template "${t.template}": ${null!==(i=null==e?void 0:e.message)&&void 0!==i?i:e}`})}}class Fi extends ae{constructor(){super(...arguments),this._loadingTemplates=!1}static get styles(){return r`
      .description {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
      }
      .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      ha-expansion-panel {
        margin-top: 16px;
      }
      .result {
        padding: 0 8px 8px;
      }
      .result .hint {
        margin: 8px 0;
      }
    `}set lovelace(e){this._lovelace=e,this._templates=void 0,this._schema=void 0}setConfig(e){this._config=e}willUpdate(){var e;this.hass&&this._config&&(this._lovelace||(this._lovelace=null!==(e=xi())&&void 0!==e?e:void 0),this._lovelace&&(this._templates||(this._templates=Et(this._lovelace),this._loadBorrowedTemplates()),this._schema||(this._schema=[{name:"template",label:"Template to use",selector:{select:{mode:"dropdown",sort:!0,custom_value:!0,options:Object.entries(this._templates).map(([e,t])=>({value:e,label:(null==t?void 0:t.description)?`${e} — ${t.description}`:e}))}}},{name:"variables",label:"Variables",helper:"Example: - variable_name: value",selector:{object:{}}}])))}render(){if(!(this.hass&&this._config&&this._templates&&this._schema))return I``;const e=this._templates[this._config.template],t=Qe(e),i=Li(this._config.variables),n=!!e&&"card"===qi(e)||void 0!==this._config.for_each||void 0!==this._config.for_each_from,s={};return e||this._loadingTemplates||(s.template="No template exists with this name"),i||(s.variables="Variables must be a list of key and value pairs, or a mapping of them"),I`
      ${(null==e?void 0:e.description)?I`<p class="description">${e.description}</p>`:I``}
      ${this._renderSource(e)} ${this._renderDiagnostics(e,i)} ${this._renderMatches()}
      <ha-form
        .hass=${this.hass}
        .data=${this._formData(t)}
        .schema=${this._formSchema(t,n)}
        .error=${s}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._renderResult(e)}
    `}_renderResult(e){var t,i,n;if(!e||!this._config)return I``;const s=qi(e);if(!s)return I``;const o=null!==(n=null!==(i=null!==(t=e.card)&&void 0!==t?t:e.element)&&void 0!==i?i:e.row)&&void 0!==n?n:e.badge,r=at(this._config.for_each),a=(null==r?void 0:r.length)?rt(r[0],this._config.variables,0,r.length):this._config.variables;let l;try{l=mt(a,e,o,this._config.template,this.hass,!0)}catch(h){return I`<ha-alert alert-type="warning">Could not work out the result: ${String(h)}</ha-alert>`}const c=(null==r?void 0:r.length)?` (copy 1 of ${r.length})`:"";return I`
      <ha-expansion-panel outlined>
        <span slot="header">Result${c}</span>
        <div class="result">
          <p class="hint">
            The ${s} this card builds, with every variable put in. Anything still written as
            <code>[[name]]</code> is a variable nothing gave a value to.
          </p>
          <ha-yaml-editor .hass=${this.hass} .defaultValue=${l} read-only></ha-yaml-editor>
        </div>
      </ha-expansion-panel>
    `}_renderSource(e){var t;const i=null===(t=this._config)||void 0===t?void 0:t.template;if(!i||!e||this._loadingTemplates)return I``;const n=Nt(this._lovelace,i);if(!n)return I`<p class="hint">This template is borrowed from another dashboard, so it is edited there.</p>`;if(n.declared||!n.view)return I`<p class="hint">Defined in this dashboard's decluttering_templates.</p>`;const{view:s}=n,o=document.location.pathname.split("/").slice(0,2).join("/");return I`<p class="hint">
      Defined in
      <a href=${`${o}/${s.path||s.index}`} target="_blank" rel="noreferrer"
        >${s.title||s.path||"an untitled view"}</a
      >.
    </p>`}_renderMatches(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.for_each_from;if(!this.hass||!ii(i))return I``;let n=[];try{n=bi(this.hass,i)}catch(o){return I``}if(!n.length)return I`<ha-alert alert-type="warning">
        Nothing matches this right now, so the card renders
        nothing${(null===(t=this._config)||void 0===t?void 0:t.empty)?" but what you set below":""}. Check the domain, area or label against what
        Home Assistant actually has.
      </ha-alert>`;const s=n.slice(0,12);return I`
      <ha-expansion-panel outlined>
        <span slot="header">
          Matches ${1===n.length?"one thing":`${n.length} things`} right now
        </span>
        <div class="matches">
          <ul>
            ${s.map(e=>I`<li>${(e=>{var t,i,n;return String(null!==(i=null!==(t=e.entity)&&void 0!==t?t:e.area_id)&&void 0!==i?i:`${null!==(n=e.total)&&void 0!==n?n:""}`)})(e)}</li>`)}
          </ul>
          ${n.length>s.length?I`<p class="hint">and ${n.length-s.length} more.</p>`:I``}
          <p class="hint">
            What it matches is worked out again whenever Home Assistant's registry changes, so this list is what the
            card would build now.
          </p>
        </div>
      </ha-expansion-panel>
    `}_formSchema(e,t){const i=t?Mi:[];return e.length?[this._schema[0],...e.map(e=>{var t,i;return{name:Ni+e.name,label:null!==(t=e.label)&&void 0!==t?t:e.name,helper:e.description,selector:null!==(i=e.selector)&&void 0!==i?i:{text:{}},required:!0===e.required}}),{name:"extras",label:"Other variables",helper:"Anything this template does not describe. Example: - variable_name: value",selector:{object:{}}},...i,...Ui]:[...this._schema,...i,...Ui]}_formData(e){var t,i,n,s,o,r,a,l,c,h;if(!e.length)return this._config;const d=tt(null===(t=this._config)||void 0===t?void 0:t.variables),u=new Set(e.map(e=>e.name)),p={template:null===(i=this._config)||void 0===i?void 0:i.template};for(const m of e)m.name in d&&(p[Ni+m.name]=d[m.name]);const g=Ye(null===(n=this._config)||void 0===n?void 0:n.variables).filter(e=>{const t=Ge(e);return void 0!==t&&!u.has(t)});return g.length&&(p.extras=g),void 0!==(null===(s=this._config)||void 0===s?void 0:s.for_each)&&(p.for_each=this._config.for_each),void 0!==(null===(o=this._config)||void 0===o?void 0:o.for_each_from)&&(p.for_each_from=this._config.for_each_from),void 0!==(null===(r=this._config)||void 0===r?void 0:r.columns)&&(p.columns=this._config.columns),void 0!==(null===(a=this._config)||void 0===a?void 0:a.min_column_width)&&(p.min_column_width=this._config.min_column_width),void 0!==(null===(l=this._config)||void 0===l?void 0:l.empty)&&(p.empty=this._config.empty),void 0!==(null===(c=this._config)||void 0===c?void 0:c.gap)&&(p.gap=this._config.gap),void 0!==(null===(h=this._config)||void 0===h?void 0:h.fit)&&(p.fit=this._config.fit),p}_renderDiagnostics(e,t){var i,n,s,o,r,a,l,c;if(!e||this._loadingTemplates||!t)return I``;var h;const d=[...ct(null===(i=this._config)||void 0===i?void 0:i.for_each),...(h=null===(n=this._config)||void 0===n?void 0:n.for_each_from,ii(h)?void 0!==h.range?[...yi]:void 0===h.areas?[...fi]:h.with?[...vi,..._i]:[...vi]:[]),...ii(null===(s=this._config)||void 0===s?void 0:s.for_each_from)?lt:[]].map(e=>({[e]:null})),{missing:u,unused:p,required:g}=function(e,t,i){const n=tt([...et(e,t),...Ye(i)]),s=st(t,n),o=new Set(s),r=Ye(e),a=[];for(const h of r){const e=Ze(h);void 0===e||o.has(e)||a.includes(e)||a.push(e)}const l=s.filter(e=>!(e in n)),c=new Set(Qe(t).filter(e=>!0===e.required).map(e=>e.name));return{missing:l,unused:a,required:l.filter(e=>c.has(e))}}(null===(o=this._config)||void 0===o?void 0:o.variables,e,d),m=u.filter(e=>!g.includes(e)),f=Hi.test(`${null!==(r=e.style)&&void 0!==r?r:""}\n${null!==(l=null===(a=this._config)||void 0===a?void 0:a.style)&&void 0!==l?l:""}`),v="contents"===(null===(c=this._config)||void 0===c?void 0:c.fit)&&f;return I`
      ${v?I`<ha-alert alert-type="warning">
              This card is set to get out of the way, so it has no box of its own - and the styles here that paint on it
              have nothing to paint on. Style the card inside it, or set this back to keeping its own box.
            </ha-alert>`:I``}
      ${g.length?I`<ha-alert alert-type="error">
              ${1===g.length?"This template needs a variable":"This template needs variables"} you have not
              set: ${g.join(", ")}.
            </ha-alert>`:I``}
      ${m.length?I`<ha-alert alert-type="warning">
              ${1===m.length?"This template uses a variable":"This template uses variables"} with no value
              and no default: ${m.join(", ")}.
            </ha-alert>`:I``}
      ${p.length?I`<ha-alert alert-type="info">
              ${1===p.length?"This variable is":"These variables are"} set here but never used by the
              template: ${p.join(", ")}.
            </ha-alert>`:I``}
    `}_valueChanged(e){var t,i;const n=e.detail.value,s=Qe(null===(t=this._templates)||void 0===t?void 0:t[n.template]);if(!s.length)return void me(this,"config-changed",{config:n});const o=[];for(const l of s){const e=n[Ni+l.name];void 0!==e&&""!==e&&o.push({[l.name]:e})}Array.isArray(n.extras)&&o.push(...n.extras);const r=Object.assign(Object.assign({},this._config),{template:n.template}),a=function(e,t){const i=new Map;for(const s of t){const e=Ze(s);void 0===e||i.has(e)||i.set(e,s)}const n=[];for(const s of Array.isArray(e)?e:[]){const e=Ze(s);void 0!==e&&i.has(e)&&(n.push(i.get(e)),i.delete(e))}return n.push(...i.values()),n}(Ye(null===(i=this._config)||void 0===i?void 0:i.variables),o);a.length?r.variables=a:delete r.variables,Di(r,"for_each",n.for_each),Di(r,"for_each_from",n.for_each_from),Di(r,"columns",n.columns),Di(r,"min_column_width",n.min_column_width),Di(r,"empty",n.empty),Di(r,"gap",n.gap),me(this,"config-changed",{config:r})}_loadBorrowedTemplates(){xt(this._lovelace).length&&(this._loadingTemplates=!0,Tt(this.hass,this._lovelace).then(e=>{this._templates=e,this._schema=void 0}).finally(()=>{this._loadingTemplates=!1,this.requestUpdate()}))}}e([ue()],Fi.prototype,"_lovelace",void 0),e([ue()],Fi.prototype,"_config",void 0),e([de()],Fi.prototype,"hass",void 0),e([ue()],Fi.prototype,"_loadingTemplates",void 0);class Vi extends Ii{constructor(){super(...arguments),this.preview=!1}static getConfigElement(){return document.createElement(ji)}static getStubConfig(){return{type:`custom:${Ti}`,template:"follow_the_sun",card:{type:"entity",entity:"sun.sun"}}}static get styles(){return r`
      ${Ii.styles}
      .badge {
        margin: 8px;
        color: var(--primary-color);
      }
      :host([preview]) {
        display: block !important;
        border: 1px solid var(--primary-color);
      }
    `}setConfig(e){if(this._openTemplates=Xt(e),this._templateName=e.template,!e.template)throw new Error("Missing template property");this._template=e.template,this._setTemplateConfig(e,void 0,void 0,e.template)}render(){return this.setHidden(!this.preview),this.preview?I`
        <div class="badge">${this._template}</div>
        ${super.render()}
      `:I``}setHidden(e){this.hasAttribute("hidden")!==e&&(this.toggleAttribute("hidden",e),this.dispatchEvent(new Event("card-visibility-changed",{bubbles:!0,composed:!0})))}}e([de({type:Boolean,reflect:!0})],Vi.prototype,"preview",void 0),e([ue()],Vi.prototype,"_template",void 0);class Ji extends ae{constructor(){super(...arguments),this._selectedTab="settings",this._importParses=!0,this._importErrors=[],this._copyState="",this._suggestedNothing=!1,this._renameTo="",this._renaming=!1,this._duplicateTo="",this._busy=!1,this._modernisePending=!1,this._loadedElements=!1}setConfig(e){this._config=e,this._suggestion=void 0,this._suggestedNothing=!1}static get styles(){return r`
      ${Ii.styles}
      ha-tab-group {
        display: block;
        margin-bottom: 16px;
      }
      .share h3 {
        margin: 0 0 4px;
      }
      .share h3 ~ h3 {
        margin-top: 24px;
      }
      .share .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .share ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      .share mwc-button {
        margin-top: 8px;
      }
      .suggest {
        margin-bottom: 16px;
      }
      .suggest ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      .usages ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      .usages ul {
        margin: 0;
        padding-left: 20px;
      }
      .usages li {
        margin-bottom: 4px;
      }
      .rename {
        margin-top: 24px;
      }
      .rename h3 {
        margin: 0 0 4px;
      }
      .rename .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .rename ha-textfield {
        display: block;
        width: 100%;
      }
      .rename mwc-button {
        margin-top: 8px;
      }
      .order ul,
      .library {
        margin: 0 0 8px;
        padding: 0;
        list-style: none;
      }
      .order li,
      .library li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .order .spacer,
      .library li > div {
        flex: 1;
      }
      .library li .hint {
        display: block;
        margin: 0;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
    `}async connectedCallback(){super.connectedCallback(),this._loadedElements||(await async function(){let e=customElements.get("hui-vertical-stack-card");e||((await zi).createCardElement({type:"vertical-stack",cards:[]}),await customElements.whenDefined("hui-vertical-stack-card"),e=customElements.get("hui-vertical-stack-card")),e&&(e=e.prototype.constructor),e&&e.getConfigElement&&await e.getConfigElement()}(),await async function(){let e=customElements.get("hui-entities-card");e||((await zi).createCardElement({type:"entities",entities:[]}),await customElements.whenDefined("hui-entities-card"),e=customElements.get("hui-entities-card")),e&&e.getConfigElement&&await e.getConfigElement()}(),this._loadedElements=!0)}render(){var e;if(!this.hass||!this._config)return I``;const t={};Li(this._config.default)||(t.default="Variables must be a list of key and value pairs, or a mapping of them"),void 0===this._config.variables||Array.isArray(this._config.variables)||(t.variables="The declarations must be a list, each entry naming one variable");const i={template:this._config.template,thingType:null!==(e=qi(this._config))&&void 0!==e?e:"card",description:this._config.description,variables:this._config.variables,default:this._config.default};return I`
      <ha-tab-group .active=${this._selectedTab} @click=${this._activateTab}>
        <ha-tab-group-tab slot="nav" panel="settings">Settings</ha-tab-group-tab>
        ${"card"===i.thingType?I`
                <ha-tab-group-tab slot="nav" panel="card">Card</ha-tab-group-tab>
                <ha-tab-group-tab slot="nav" panel="change_card">Change card type</ha-tab-group-tab>
              `:"row"===i.thingType?I`<ha-tab-group-tab slot="nav" panel="row">Row</ha-tab-group-tab>`:I``}
        <ha-tab-group-tab slot="nav" panel="usages">Where used</ha-tab-group-tab>
        <ha-tab-group-tab slot="nav" panel="share">Share</ha-tab-group-tab>
      </ha-tab-group>
      ${"settings"===this._selectedTab?I`
              ${this._renderInUse()} ${this._renderDiagnostics()} ${this._renderSuggest("card"===i.thingType)}
              ${this._renderOrder()}
              <ha-form
                .hass=${this.hass}
                .data=${i}
                .schema=${Ji.schema}
                .error=${t}
                .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
                .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
                @value-changed=${this._valueChanged}
              ></ha-form>
            `:"card"===this._selectedTab?I`
                <hui-card-element-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .value=${this._config.card}
                  @config-changed=${this._cardChanged}
                ></hui-card-element-editor>
              `:"change_card"===this._selectedTab?I`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this.lovelace}
                    @config-changed=${this._cardPicked}
                  ></hui-card-picker>
                `:"row"===this._selectedTab?I`
                    <hui-row-element-editor
                      .hass=${this.hass}
                      .lovelace=${this.lovelace}
                      .value=${this._config.row}
                      @config-changed=${this._rowChanged}
                    ></hui-row-element-editor>
                  `:"usages"===this._selectedTab?this._renderUsages():"share"===this._selectedTab?this._renderShare():I``}
    `}_renderDiagnostics(){if(!this._config||void 0!==this._config.variables&&!Array.isArray(this._config.variables))return I``;const{unused:e,duplicated:t,contradictory:i}=ot(this._config);return I`
      ${e.length?I`<ha-alert alert-type="info">
              ${1===e.length?"This variable is declared":"These variables are declared"} but never used in
              the template: ${e.join(", ")}.
            </ha-alert>`:I``}
      ${t.length?I`<ha-alert alert-type="warning">
              ${1===t.length?"This variable has":"These variables have"} a default in both places; the
              declaration is the one that counts: ${t.join(", ")}.
            </ha-alert>`:I``}
      ${i.length?I`<ha-alert alert-type="warning">
              ${1===i.length?"This variable is":"These variables are"} marked required but have a
              default, so they can never be unset: ${i.join(", ")}.
            </ha-alert>`:I``}
    `}_renderOrder(){const e=Qe(this._config);return e.length<2?I``:I`
      <div class="order">
        <p class="hint">The order these appear in is the order every card using the template shows them in.</p>
        <ul>
          ${e.map((t,i)=>{var n;return I`
              <li>
                <span>${null!==(n=t.label)&&void 0!==n?n:t.name}</span>
                <span class="spacer"></span>
                <ha-icon-button
                  .path=${"M7,15L12,10L17,15H7Z"}
                  .disabled=${0===i}
                  .label=${`Move ${t.name} up`}
                  @click=${()=>this._move(i,-1)}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M7,10L12,15L17,10H7Z"}
                  .disabled=${i===e.length-1}
                  .label=${`Move ${t.name} down`}
                  @click=${()=>this._move(i,1)}
                ></ha-icon-button>
              </li>
            `})}
        </ul>
      </div>
    `}_move(e,t){const i=[...Qe(this._config)],n=e+t;n<0||n>=i.length||([i[e],i[n]]=[i[n],i[e]],this._fireConfigChanged(Object.assign(Object.assign({},this._config),{variables:i})))}_renderInUse(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,n=null!==(t=this.lovelace)&&void 0!==t?t:xi();if(!i||!n)return I``;const{views:s,templates:o}=Pt(n,i),r=s.reduce((e,t)=>e+t.count,0)+o.length;return r?I`<ha-alert alert-type="info">
      ${1===r?"One card or template uses":`${r} cards and templates use`} this. Changing it changes
      ${1===r?"that one":"them all"}, and deleting this card leaves ${1===r?"it":"them"} pointing at
      a template that is not there.
    </ha-alert>`:I``}_renderSuggest(e){var t;return e&&(null===(t=this._config)||void 0===t?void 0:t.card)?I`
      <div class="suggest">
        ${this._suggestedNothing?I`<ha-alert alert-type="info">
                Nothing here looks like it varies between copies. Entities, names, titles and icons are what get
                offered, and this card either has none or they are variables already.
              </ha-alert>`:I``}
        ${this._suggestion?I`<ha-alert alert-type="warning">
                This will rewrite the card to use
                ${this._suggestion.variables.map(e=>e.name).join(", ")}, and declare
                ${1===this._suggestion.variables.length?"it":"them"} with the value
                ${1===this._suggestion.variables.length?"it has":"they have"} now. Press again to go ahead.
              </ha-alert>`:I``}
        <mwc-button @click=${this._suggest}>
          ${this._suggestion?"Suggest variables anyway":"Suggest variables from the card"}
        </mwc-button>
      </div>
    `:I``}_suggest(){var e;if(!(null===(e=this._config)||void 0===e?void 0:e.card))return;if(this._suggestion){const e=Object.assign(Object.assign({},this._config),{card:this._suggestion.card});return e.variables=[...Qe(this._config),...this._suggestion.variables],this._suggestion=void 0,void this._fireConfigChanged(e)}this._suggestedNothing=!1;const t=Qe(this._config).map(e=>e.name),i=function(e,t){const i=new Set(t),n=[],s=new Map,o=(e,t)=>{const o=`${e.base} ${t}`,r=s.get(o);if(r)return r;let a=1,l=e.base;for(;i.has(l);)a+=1,l=`${e.base}_${a}`;return i.add(l),s.set(o,l),n.push({name:l,label:Gt(e,a),selector:e.selector,default:t}),l},r=e=>{if(Array.isArray(e))return e.map(r);if(!e||"object"!=typeof e)return e;const t={};for(const[i,n]of Object.entries(e)){const e=Jt[i];e&&"string"==typeof n&&!Ce.test(n)&&e.matches(n)?t[i]=`[[${o(e,n)}]]`:t[i]=r(n)}return t};return{card:r(e),variables:n}}(this._config.card,t);i.variables.length?this._suggestion=i:this._suggestedNothing=!0}_renderUsages(){var e,t,i;const n=null===(e=this._config)||void 0===e?void 0:e.template;if(!n)return I``;const s=null!==(t=this.lovelace)&&void 0!==t?t:xi();if(!s)return I`<div class="usages">
        <ha-alert alert-type="warning">
          The dashboard configuration could not be read, so uses cannot be counted here.
        </ha-alert>
      </div>`;(null===(i=this._usages)||void 0===i?void 0:i.name)===n&&this._usages.ll===s||(this._usages={name:n,ll:s,usages:Pt(s,n)});const{views:o,templates:r}=this._usages.usages,a=o.reduce((e,t)=>e+t.count,0),l=document.location.pathname.split("/").slice(0,2).join("/");return I`
      <div class="usages">
        ${0!==a||r.length?I`
                <p class="hint">
                  ${1===a?"One card uses":`${a} cards use`} "${n}" on this dashboard. Cards on other
                  dashboards are not counted.
                </p>
                <ul>
                  ${o.map(e=>I`
                      <li>
                        <a href=${`${l}/${e.path||e.index}`} target="_blank" rel="noreferrer">
                          ${e.title||e.path||"Untitled view"}
                        </a>
                        — ${1===e.count?"once":`${e.count} times`}
                      </li>
                    `)}
                </ul>
              `:I`<ha-alert alert-type="info">
                Nothing on this dashboard uses "${n}" yet. Cards on other dashboards are not counted here, even ones
                that borrow this dashboard's templates.
              </ha-alert>`}
        ${r.length?I`<ha-alert alert-type="info">
                This template is used by ${1===r.length?"another template":"other templates"}:
                ${r.join(", ")}. Changing it changes ${1===r.length?"that one":"those"} too.
              </ha-alert>`:I``}
        ${this._renderRename(n,a)} ${this._renderDuplicate(n)} ${this._renderModernise()}
        ${this._toolError?I`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:I``}
      </div>
    `}_renderShare(){const{payload:e,notes:t}=It(this._config);return I`
      <div class="share">
        <h3>Export</h3>
        <p class="hint">Copy this and send it to someone else, or paste it into another dashboard.</p>
        ${t.map(e=>I`<ha-alert alert-type="info">${e}</ha-alert>`)}
        <ha-yaml-editor id="export" .hass=${this.hass} .defaultValue=${e} read-only></ha-yaml-editor>
        <mwc-button @click=${this._copyExport}>
          ${"done"===this._copyState?"Copied":"failed"===this._copyState?"Could not copy - select the text above instead":"Copy to clipboard"}
        </mwc-button>

        <h3>Import</h3>
        <p class="hint">Paste a template someone shared with you. It will replace the one you are editing.</p>
        <ha-yaml-editor .hass=${this.hass} @value-changed=${this._importChanged}></ha-yaml-editor>
        ${this._importErrors.map(e=>I`<ha-alert alert-type="error">${e}</ha-alert>`)}
        ${this._importClash?I`<ha-alert alert-type="warning">
                This dashboard already has a template called "${this._importClash}". Importing will give you two
                templates with the same name, and only one of them will be used. Press Import again to go ahead.
              </ha-alert>`:I``}
        <mwc-button @click=${this._import}>${this._importClash?"Import anyway":"Import"}</mwc-button>

        <h3>Start from one of these</h3>
        <p class="hint">
          Worked examples of the shapes people build most. Installing one adds it to this view as its own template card,
          leaving the one you are editing alone.
        </p>
        ${this._renderLibrary()}
      </div>
    `}_renderLibrary(){var e,t,i;const n=Object.keys(Et(null!==(i=null!==(t=null===(e=Ci())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:xi()));return I`
      <ul class="library">
        ${Zt.map(e=>{const t=n.includes(e.name),i=this._installPending===e.name,s=Yt(e,n);return I`
            <li>
              <div>
                <strong>${e.name}</strong>
                <span class="hint">${e.summary}</span>
                ${s.length?I`<span class="hint">Also installs ${s.join(", ")}, which it uses.</span>`:I``}
              </div>
              <mwc-button .disabled=${this._busy||t} @click=${()=>{this._install(e.name)}}>
                ${t?"Already here":i?"Install anyway":"Install"}
              </mwc-button>
            </li>
          `})}
      </ul>
    `}async _install(e){var t,i,n,s,o,r,a;const l=Kt(e);if(!l)return;if(this._installPending!==e)return void(this._installPending=e);const c=Ci(),h=Object.keys(Et(null!==(i=null!==(t=null==c?void 0:c.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:xi())),d=[...Yt(l,h),l.name].filter(e=>!h.includes(e)),u=Nt(null!==(n=null==c?void 0:c.config)&&void 0!==n?n:this.lovelace,null!==(o=null===(s=this._config)||void 0===s?void 0:s.template)&&void 0!==o?o:""),p=null!==(a=null===(r=null==u?void 0:u.view)||void 0===r?void 0:r.index)&&void 0!==a?a:0;await this._saveDashboard(e=>d.reduce((e,t)=>{const i=Kt(t);return i?Ht(e,p,Object.assign({type:vt,template:i.name},i.template)):e},e))&&(this._installPending=void 0)}_renderRename(e,t){const i=this._renameTo.trim(),n=1===t?"one card":`${t} cards`,s=!!i&&this._renamePending===i;return I`
      <div class="rename">
        <h3>Rename</h3>
        <p class="hint">
          Changes the name here and in every card on this dashboard that uses it. Cards on other dashboards are not
          touched, even ones that borrow this dashboard's templates.
        </p>
        ${this._renameError?I`<ha-alert alert-type="error">${this._renameError}</ha-alert>`:I``}
        ${s?I`<ha-alert alert-type="warning">
                This renames "${e}" to "${i}"${t?I` and rewrites ${n}`:I``}, and saves the
                dashboard straight away. Press again to go ahead.
              </ha-alert>`:I``}
        <ha-textfield
          label="New name"
          .value=${this._renameTo}
          .disabled=${this._renaming}
          @input=${this._renameChanged}
        ></ha-textfield>
        <mwc-button .disabled=${this._renaming||!i||i===e} @click=${this._rename}>
          ${s?"Rename anyway":t?`Rename and update ${n}`:"Rename"}
        </mwc-button>
      </div>
    `}async _saveDashboard(e){var t;const i=Ci();if(!i)return this._toolError="This dashboard cannot be saved from here, so it cannot be changed here either.",!1;this._busy=!0,this._toolError=void 0;try{return await i.saveConfig(e(i.config)),!0}catch(n){return this._toolError=`Could not save the dashboard: ${null!==(t=null==n?void 0:n.message)&&void 0!==t?t:n}`,!1}finally{this._busy=!1}}_renderModernise(){var e,t,i;const n=null!==(i=null!==(t=null===(e=Ci())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:xi(),s=n?function(e){let t=0;const i=e=>{Array.isArray(e)?e.forEach(i):e&&"object"==typeof e&&(e.type!==ft&&"custom:decluttering-card"!==e.type||(t+=1),Object.values(e).forEach(i))};return i(e),t}(n):0;return s?I`
      <div class="rename">
        <h3>Move off the original card's names</h3>
        <p class="hint">
          ${1===s?"One card on this dashboard still uses":`${s} cards on this dashboard still use`} the
          original decluttering-card type names. They work, because this card answers to both - but they would stop
          working the day the original is installed alongside it.
        </p>
        ${this._modernisePending?I`<ha-alert alert-type="warning">
                This rewrites ${1===s?"that card":`all ${s} of them`} to this card's own names, and saves the
                dashboard straight away. Press again to go ahead.
              </ha-alert>`:I``}
        <mwc-button .disabled=${this._busy} @click=${this._modernise}>
          ${this._modernisePending?"Move them anyway":`Move ${1===s?"it":"them"} over`}
        </mwc-button>
      </div>
    `:I``}async _modernise(){if(!this._modernisePending)return void(this._modernisePending=!0);await this._saveDashboard(e=>function(e){const t={"custom:decluttering-card":"custom:decluttering-card-plus",[ft]:vt},i=e=>{if(Array.isArray(e))return e.map(i);if(!e||"object"!=typeof e)return e;const n={};for(const[t,s]of Object.entries(e))n[t]=i(s);return"string"==typeof e.type&&t[e.type]&&(n.type=t[e.type]),n};return i(e)}(e))&&(this._modernisePending=!1)}_renameChanged(e){var t;this._renameTo=null!==(t=e.target.value)&&void 0!==t?t:"",this._renameError=void 0,this._renamePending=void 0}async _rename(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,n=this._renameTo.trim();if(!i||!n||n===i)return;const s=Ci();if(s)if(void 0===Et(s.config)[n])if(this._renamePending===n){this._renaming=!0,this._renameError=void 0;try{await s.saveConfig(function(e,t,i){const n=e=>{if(Array.isArray(e))return e.map(n);if(!e||"object"!=typeof e)return e;const s={};for(const[t,i]of Object.entries(e))s[t]=n(i);return(yt(e.type)||jt.includes(e.type))&&e.template===t&&(s.template=i),s},s=n(e),o=null==s?void 0:s.decluttering_templates;if(o&&"object"==typeof o&&t in o){const e={};for(const[n,s]of Object.entries(o))e[n===t?i:n]=s;s.decluttering_templates=e}return s}(s.config,i,n)),this._fireConfigChanged(Object.assign(Object.assign({},this._config),{template:n})),this._renameTo="",this._renamePending=void 0}catch(o){this._renameError=`Could not save the dashboard: ${null!==(t=null==o?void 0:o.message)&&void 0!==t?t:o}`}finally{this._renaming=!1}}else this._renamePending=n;else this._renameError=`A template called "${n}" already exists on this dashboard.`;else this._renameError="This dashboard cannot be saved from here, so it cannot be renamed here either."}_renderDuplicate(e){const t=this._duplicateTo.trim(),i=!!t&&this._duplicatePending===t;return I`
      <div class="rename">
        <h3>Duplicate</h3>
        <p class="hint">
          Adds a copy of this template to this view under a new name, and saves the dashboard. The copy is yours to
          change; nothing using this one is touched.
        </p>
        ${i?I`<ha-alert alert-type="warning">
                This adds "${t}" to this view as a copy of "${e}", and saves the dashboard straight away. Press
                again to go ahead.
              </ha-alert>`:I``}
        <ha-textfield
          label="Name for the copy"
          .value=${this._duplicateTo}
          .disabled=${this._busy}
          @input=${this._duplicateChanged}
        ></ha-textfield>
        <mwc-button .disabled=${this._busy||!t||t===e} @click=${this._duplicate}>
          ${i?"Duplicate anyway":"Duplicate"}
        </mwc-button>
      </div>
    `}_duplicateChanged(e){var t;this._duplicateTo=null!==(t=e.target.value)&&void 0!==t?t:"",this._toolError=void 0,this._duplicatePending=void 0}async _duplicate(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,n=this._duplicateTo.trim();if(!i||!n||n===i)return;const s=Ci();if(s&&void 0!==Et(s.config)[n])return void(this._toolError=`A template called "${n}" already exists on this dashboard.`);if(this._duplicatePending!==n)return void(this._duplicatePending=n);const o=Object.assign(Object.assign({},this._config),{template:n}),r=Nt(null!==(t=null==s?void 0:s.config)&&void 0!==t?t:this.lovelace,i),a=await this._saveDashboard(e=>{var t,i;return Ht(e,null!==(i=null===(t=null==r?void 0:r.view)||void 0===t?void 0:t.index)&&void 0!==i?i:0,o)});a&&(this._duplicateTo="",this._duplicatePending=void 0)}async _copyExport(){const e=this.renderRoot.querySelector("#export"),t=null==e?void 0:e.yaml;if(!t)return;const{notes:i}=It(this._config),n=[...i.map(e=>`# ${e}`),t].join("\n");this._copyState=await async function(e){var t;if(null===(t=navigator.clipboard)||void 0===t?void 0:t.writeText)try{return await navigator.clipboard.writeText(e),!0}catch(s){}const i=document.createElement("textarea");i.value=e,i.setAttribute("readonly",""),i.style.cssText="position:fixed;top:-1000px;opacity:0;",document.body.appendChild(i),i.select();let n=!1;try{n=document.execCommand("copy")}catch(o){n=!1}return i.remove(),n}(n)?"done":"failed",setTimeout(()=>this._copyState="",3e3)}_importChanged(e){e.stopPropagation(),this._importValue=e.detail.value,this._importParses=!1!==e.detail.isValid,this._importErrors=[],this._importClash=void 0}_import(){var e;if(!this._config)return;if(!this._importParses)return void(this._importErrors=["This is not valid YAML, so it cannot be read."]);const t=function(e){if(!e||"object"!=typeof e||Array.isArray(e))return{ok:!1,errors:["This does not look like a template: it should be a block of YAML keys and values."]};const t=[];"string"==typeof e.template&&e.template.trim()||t.push('This template has no name: it needs a "template:" line.');const i=Dt.filter(t=>void 0!==e[t]);return 0===i.length?t.push('This template defines nothing: it needs one of "card:", "badge:", "row:" or "element:".'):i.length>1&&t.push(`This template defines both "${i[0]}" and "${i[1]}": it can only define one of them.`),{ok:0===t.length,errors:t}}(this._importValue);if(!t.ok)return this._importErrors=t.errors,void(this._importClash=void 0);this._importErrors=[];const i=this._importValue.template,n=Et(null!==(e=this.lovelace)&&void 0!==e?e:xi());this._importClash||i===this._config.template||!(i in n)?(this._fireConfigChanged(Object.assign(Object.assign({},this._importValue),{type:this._config.type})),this._importClash=void 0,this._selectedTab="settings"):this._importClash=i}_activateTab(e){const t=e.composedPath().find(e=>"ha-tab-group-tab"===e.localName),i=null==t?void 0:t.getAttribute("panel");i&&(this._selectedTab=i)}_valueChanged(e){if(!this._config)return;const t=e.detail.value,i=Object.assign(Object.assign({},this._config),{template:t.template,default:t.default});Di(i,"description",t.description),Di(i,"variables",t.variables);for(const[n,s]of Object.entries(Ri))Ji.stubMember(t.thingType===n,i,n,s);this._fireConfigChanged(i)}_cardChanged(e){if(e.stopPropagation(),!this._config)return;this._suggestion=void 0,this._suggestedNothing=!1;const t=Object.assign(Object.assign({},this._config),{card:e.detail.config});this._fireConfigChanged(t)}_cardPicked(e){this._selectedTab="card",this._cardChanged(e)}_rowChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign(Object.assign({},this._config),{row:e.detail.config});this._fireConfigChanged(t)}_fireConfigChanged(e){this._suggestion=void 0,this._suggestedNothing=!1,me(this,"config-changed",{config:e})}static stubMember(e,t,i,n){e?i in t||(t[i]=n):delete t[i]}}function Gi(e,t){return customElements.get(e)?(console.warn(`decluttering-card-plus: <${e}> is already registered by something else, skipping it.`),!1):(customElements.define(e,t),!0)}Ji.schema=[{name:"template",label:"Template to define",selector:{text:{}}},{name:"thingType",label:"Type of thing to template",selector:{select:{mode:"dropdown",options:[{value:"card",label:"Card"},{value:"badge",label:"Badge"},{value:"row",label:"Row"},{value:"element",label:"Element"}]}}},{name:"description",label:"Description",helper:"What this template is for, shown to whoever uses it",selector:{text:{multiline:!0}}},{name:"variables",label:"Variable declarations",helper:"Describe a variable and its editor shows the right control. Example: - name: entity, selector: {entity: {}}",selector:{object:{}}},{name:"default",label:"Variables",helper:"Example: - variable_name: default_value",selector:{object:{}}}],e([ue()],Ji.prototype,"_config",void 0),e([ue()],Ji.prototype,"_selectedTab",void 0),e([ue()],Ji.prototype,"_importErrors",void 0),e([ue()],Ji.prototype,"_importClash",void 0),e([ue()],Ji.prototype,"_copyState",void 0),e([ue()],Ji.prototype,"_suggestion",void 0),e([ue()],Ji.prototype,"_suggestedNothing",void 0),e([ue()],Ji.prototype,"_renameTo",void 0),e([ue()],Ji.prototype,"_renameError",void 0),e([ue()],Ji.prototype,"_renaming",void 0),e([ue()],Ji.prototype,"_renamePending",void 0),e([ue()],Ji.prototype,"_duplicateTo",void 0),e([ue()],Ji.prototype,"_duplicatePending",void 0),e([ue()],Ji.prototype,"_toolError",void 0),e([ue()],Ji.prototype,"_busy",void 0),e([ue()],Ji.prototype,"_modernisePending",void 0),e([ue()],Ji.prototype,"_installPending",void 0),e([de()],Ji.prototype,"lovelace",void 0),e([de()],Ji.prototype,"hass",void 0);const Zi=window.customCards=window.customCards||[],Ki=window.customBadges=window.customBadges||[],Yi="https://github.com/tempus2016/decluttering-card-plus";Gi(Oi,Fi),Gi(ji,Ji),Gi(Si,Bi)&&(Zi.push({type:Si,documentationURL:Yi,name:"Decluttering Card Plus",preview:!1,description:"Reuse multiple times the same card configuration with variables to declutter your config."}),Ki.push({type:Si,documentationURL:Yi,name:"Decluttering Card Plus",preview:!1,description:"Instantiate a template whose content is a badge."})),Gi(Ti,Vi)&&Zi.push({type:Ti,documentationURL:Yi,name:"Decluttering Template Plus",preview:!1,description:"Define a reusable template for decluttering cards to instantiate."});Gi(ki,class extends Bi{static getStubConfig(){return Object.assign(Object.assign({},Bi.getStubConfig()),{type:`custom:${ki}`})}})&&Zi.push({type:ki,documentationURL:Yi,name:"Decluttering Card (compatibility)",preview:!1,description:"Compatibility alias for existing custom:decluttering-card configurations."}),Gi(Pi,class extends Vi{static getStubConfig(){return Object.assign(Object.assign({},Vi.getStubConfig()),{type:`custom:${Pi}`})}})&&Zi.push({type:Pi,documentationURL:Yi,name:"Decluttering Template (compatibility)",preview:!1,description:"Compatibility alias for existing custom:decluttering-template configurations."});
