function e(e,t,s,i){var n,r=arguments.length,o=r<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,s,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(o=(r<3?n(o):r>3?n(t,s,o):n(t,s))||o);return r>3&&o&&Object.defineProperty(t,s,o),o}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,s=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let r=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&n.set(t,e))}return e}toString(){return this.cssText}};const o=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new r(s,e,i)},a=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:l,defineProperty:h,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,g=globalThis,m=g.trustedTypes,f=m?m.emptyScript:"",_=g.reactiveElementPolyfillSupport,v=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},b=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&h(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:n}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const r=i?.call(this);n?.call(this,t),this.requestUpdate(e,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...d(e),...u(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const e=this._$Eu(t,s);void 0!==e&&this._$Eh.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(s)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of i){const i=document.createElement("style"),n=t.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=s.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(t,s.type);this._$Em=e,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=i;const r=n.fromAttribute(t,e.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(void 0!==e){const r=this.constructor;if(!1===i&&(n=this[e]),s??=r.getPropertyOptions(e),!((s.hasChanged??b)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==n||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,_?.({ReactiveElement:w}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,E=e=>e,C=A.trustedTypes,S=C?C.createPolicy("lit-html",{createHTML:e=>e}):void 0,x="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+T,j=`<${O}>`,P=document,k=()=>P.createComment(""),R=e=>null===e||"object"!=typeof e&&"function"!=typeof e,U=Array.isArray,N="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,L=/>/g,D=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,q=/"/g,I=/^(?:script|style|textarea|title)$/i,B=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),V=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),J=new WeakMap,G=P.createTreeWalker(P,129);function F(e,t){if(!U(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const Y=(e,t)=>{const s=e.length-1,i=[];let n,r=2===t?"<svg>":3===t?"<math>":"",o=H;for(let a=0;a<s;a++){const t=e[a];let s,l,h=-1,c=0;for(;c<t.length&&(o.lastIndex=c,l=o.exec(t),null!==l);)c=o.lastIndex,o===H?"!--"===l[1]?o=M:void 0!==l[1]?o=L:void 0!==l[2]?(I.test(l[2])&&(n=RegExp("</"+l[2],"g")),o=D):void 0!==l[3]&&(o=D):o===D?">"===l[0]?(o=n??H,h=-1):void 0===l[1]?h=-2:(h=o.lastIndex-l[2].length,s=l[1],o=void 0===l[3]?D:'"'===l[3]?q:z):o===q||o===z?o=D:o===M||o===L?o=H:(o=D,n=void 0);const d=o===D&&e[a+1].startsWith("/>")?" ":"";r+=o===H?t+j:h>=0?(i.push(s),t.slice(0,h)+x+t.slice(h)+T+d):t+T+(-2===h?a:d)}return[F(e,r+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class K{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,r=0;const o=e.length-1,a=this.parts,[l,h]=Y(e,t);if(this.el=K.createElement(l,s),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=G.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(x)){const t=h[r++],s=i.getAttribute(e).split(T),o=/([.?@])?(.*)/.exec(t);a.push({type:1,index:n,name:o[2],strings:s,ctor:"."===o[1]?te:"?"===o[1]?se:"@"===o[1]?ie:ee}),i.removeAttribute(e)}else e.startsWith(T)&&(a.push({type:6,index:n}),i.removeAttribute(e));if(I.test(i.tagName)){const e=i.textContent.split(T),t=e.length-1;if(t>0){i.textContent=C?C.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],k()),G.nextNode(),a.push({type:2,index:++n});i.append(e[t],k())}}}else if(8===i.nodeType)if(i.data===O)a.push({type:2,index:n});else{let e=-1;for(;-1!==(e=i.data.indexOf(T,e+1));)a.push({type:7,index:n}),e+=T.length-1}n++}}static createElement(e,t){const s=P.createElement("template");return s.innerHTML=e,s}}function Z(e,t,s=e,i){if(t===V)return t;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const r=R(t)?void 0:t._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(e),n._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(t=Z(e,n._$AS(e,t.values),n,i)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??P).importNode(t,!0);G.currentNode=i;let n=G.nextNode(),r=0,o=0,a=s[0];for(;void 0!==a;){if(r===a.index){let t;2===a.type?t=new X(n,n.nextSibling,this,e):1===a.type?t=new a.ctor(n,a.name,a.strings,this,e):6===a.type&&(t=new ne(n,this,e)),this._$AV.push(t),a=s[++o]}r!==a?.index&&(n=G.nextNode(),r++)}return G.currentNode=P,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Z(this,e,t),R(e)?e===W||null==e||""===e?(this._$AH!==W&&this._$AR(),this._$AH=W):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>U(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==W&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=K.createElement(F(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new Q(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=J.get(e.strings);return void 0===t&&J.set(e.strings,t=new K(e)),t}k(e){U(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const n of e)i===t.length?t.push(s=new X(this.O(k()),this.O(k()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=E(e).nextSibling;E(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=W,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(e,t=this,s,i){const n=this.strings;let r=!1;if(void 0===n)e=Z(this,e,t,0),r=!R(e)||e!==this._$AH&&e!==V,r&&(this._$AH=e);else{const i=e;let o,a;for(e=n[0],o=0;o<n.length-1;o++)a=Z(this,i[s+o],t,o),a===V&&(a=this._$AH[o]),r||=!R(a)||a!==this._$AH[o],a===W?e=W:e!==W&&(e+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!i&&this.j(e)}j(e){e===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===W?void 0:e}}class se extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==W)}}class ie extends ee{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=Z(this,e,t,0)??W)===V)return;const s=this._$AH,i=e===W&&s!==W||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){Z(this,e)}}const re=A.litHtmlPolyfillSupport;re?.(K,X),(A.litHtmlVersions??=[]).push("3.3.3");const oe=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ae extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let n=i._$litPart$;if(void 0===n){const e=s?.renderBefore??null;i._$litPart$=n=new X(t.insertBefore(k(),e),e,void 0,s??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}ae._$litElement$=!0,ae.finalized=!0,oe.litElementHydrateSupport?.({LitElement:ae});const le=oe.litElementPolyfillSupport;le?.({LitElement:ae}),(oe.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const he={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},ce=(e=he,t,s)=>{const{kind:i,metadata:n}=s;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),r.set(s.name,e),"accessor"===i){const{name:i}=s;return{set(s){const n=t.get.call(this);t.set.call(this,s),this.requestUpdate(i,n,e,!0,s)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=s;return function(s){const n=this[i];t.call(this,s),this.requestUpdate(i,n,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function de(e){return(t,s)=>"object"==typeof s?ce(e,t,s):((e,t,s)=>{const i=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),i?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ue(e){return de({...e,state:!0,attribute:!1})}var pe,ge;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(pe||(pe={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(ge||(ge={}));const me=(e,t,s,i)=>{i=i||{},s=null==s?{}:s;const n=new Event(t,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return n.detail=s,e.dispatchEvent(n),n},fe=new Set(["call-service","divider","section","weblink","cast","select"]),_e={alert:"toggle",automation:"toggle",climate:"climate",cover:"cover",fan:"toggle",group:"group",input_boolean:"toggle",input_number:"input-number",input_select:"input-select",input_text:"input-text",light:"toggle",lock:"lock",media_player:"media-player",remote:"toggle",scene:"scene",script:"script",sensor:"sensor",timer:"timer",switch:"toggle",vacuum:"toggle",water_heater:"climate",input_datetime:"input-datetime"},ve="\\[\\[([^[\\]]+)\\]\\]",ye="\\[\\[!([^[\\]]+)\\]\\]";const be=new RegExp(ve),$e={slug:e=>e.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,""),upper:e=>e.toUpperCase(),lower:e=>e.toLowerCase(),title:e=>e.replace(/\S+/g,e=>e[0].toUpperCase()+e.slice(1).toLowerCase()),kebab:e=>e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")},we=Object.keys($e).join("|"),Ae=`(?:\\|(${`(?:${we})(?:\\|(?:${we}))*`}))?`,Ee=new RegExp(`(?:\\|(?:${we}))+$`);function Ce(e,t){let s=String(t);for(const i of e?e.split("|"):[]){const e=$e[i];if(!e)return String(t);s=e(s)}return s}const Se=["card","badge","row","element","style"];function xe(e){if(e&&"object"==typeof e&&!Array.isArray(e))return Object.keys(e)[0]}const Te=xe;function Oe(e){const t=[],s=e=>{if(e&&"object"==typeof e&&!Array.isArray(e))for(const[s,i]of Object.entries(e))t.push({[s]:i})};return Array.isArray(e)?e.forEach(s):s(e),t}function je(e){const t=null==e?void 0:e.variables;if(!Array.isArray(t))return[];const s=new Set,i=[];for(const n of t){if(!n||"object"!=typeof n||Array.isArray(n))continue;const e=n.name;"string"==typeof e&&e.trim()&&!s.has(e)&&(s.add(e),i.push(n))}return i}function Pe(e){return Oe(null==e?void 0:e.default)}function ke(e,t){const s=[];s.push(...Oe(e));for(const i of je(t))"default"in i&&s.push({[i.name]:i.default});return s.push(...Pe(t)),function(e){const t=new Set;return e.filter(e=>{const s=Te(e);return void 0!==s&&!t.has(s)&&(t.add(s),!0)})}(s)}function Re(e){const t={};for(const s of Oe(e)){const e=Te(s);void 0===e||e in t||(t[e]=s[e])}return t}function Ue(e){if(void 0===e)return[];const t=[],s=JSON.stringify(e);if("string"!=typeof s)return t;const i=new RegExp(ve,"g");let n=i.exec(s);for(;null!==n;)n[1].startsWith("!")||t.push(n[1].replace(Ee,"")),n=i.exec(s);return t}function Ne(e,t){const s=Ue(function(e){return Se.map(t=>null==e?void 0:e[t]).filter(e=>void 0!==e)}(e)),i=new Set,n=[];for(;s.length;){const e=s.shift();i.has(e)||(i.add(e),n.push(e),e in t&&s.push(...Ue(t[e])))}return n}function He(e){const t=je(e),s=new Set(function(e){return Ne(e,Re(ke(void 0,e)))}(e)),i=new Set(Pe(e).map(Te)),n=[],r=[],o=[];for(const a of t){const{name:e}=a;s.has(e)||n.push(e),i.has(e)&&r.push(e),!0===a.required&&("default"in a||i.has(e))&&o.push(e)}return{unused:n,duplicated:r,contradictory:o}}function Me(e){return Array.isArray(e)?e:e&&"object"==typeof e&&Object.keys(e).length?[e]:void 0}const Le=["index","count"];function De(e){const t=JSON.stringify(e);return t.slice(1,t.length-1)}function ze(e,t){let s=e;return t.forEach(e=>{const t=function(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(Object.keys(e)[0]),i=Object.values(e)[0],n=new RegExp(`"\\[\\[${t}${Ae}\\]\\]"`,"gm"),r=new RegExp(`\\[\\[${t}${Ae}\\]\\]`,"gm"),o=null===i||"object"!=typeof i;s=s.replace(n,(e,t)=>t?o?JSON.stringify(Ce(t,i)):e:function(e,t){return"object"==typeof e?JSON.stringify(e):"number"==typeof e||"boolean"==typeof e?String(e):t}(i,e)),s=s.replace(r,(e,t)=>t?o?De(Ce(t,i)):e:function(e){return"object"==typeof e?De(JSON.stringify(e)):"number"==typeof e||"boolean"==typeof e?String(e):De(String(e))}(i))}),s}var qe=(e,t,s)=>{if(void 0===s)return s;const i=ke(e,t);let n=JSON.stringify(s);if(i.length){let e=0;for(;be.test(n)&&e<10;){const t=n;if(n=ze(n,i),e+=1,n===t)break}10===e&&be.test(n)&&console.warn("decluttering-card-plus: gave up substituting variables after 10 passes. Check whether a variable refers to itself.")}return r=n,new RegExp(ye).test(r)?JSON.parse(function(e){return e.replace(new RegExp(ye,"g"),"[[$1]]")}(n)):i.length?JSON.parse(n):s;var r};const Ie="custom:decluttering-template",Be="custom:decluttering-template-plus",Ve=["lovelace","default",""];function We(e){return e===Be||e===Ie}function Je(e,t){if(Array.isArray(e))for(const s of e)Je(s,t);else if(e&&"object"==typeof e)if(We(e.type))"string"==typeof e.template&&(t[e.template]=e);else for(const s of Object.values(e))Je(s,t)}function Ge(e){const t={};if(!e)return t;const s=e.decluttering_templates;return s&&Object.assign(t,s),e.views&&Je(e.views,t),t}function Fe(e){const t=null==e?void 0:e.decluttering_templates_from;return t?(Array.isArray(t)?t:[t]).filter(e=>"string"==typeof e):[]}const Ye=new Map;async function Ke(e,t){const s=Ge(t),i=Fe(t);if(!e||!i.length)return s;const n=await Promise.all(i.map(t=>function(e,t){const s=Ye.get(t);if(s)return s;const i=Ve.includes(t)?null:t,n=e.callWS({type:"lovelace/config",url_path:i}).catch(e=>{var s;return console.warn(`decluttering-card-plus: could not read the dashboard "${t}":`,null!==(s=null==e?void 0:e.message)&&void 0!==s?s:e),null});return Ye.set(t,n),n}(e,t))),r={};for(const o of n)Object.assign(r,Ge(o));return Object.assign(Object.assign({},r),s)}const Ze=["custom:decluttering-card-plus","custom:decluttering-card"];function Qe(e,t){if(Array.isArray(e))return e.reduce((e,s)=>e+Qe(s,t),0);if(!e||"object"!=typeof e)return 0;if(We(e.type))return 0;let s=Ze.includes(e.type)&&e.template===t?1:0;for(const i of Object.values(e))s+=Qe(i,t);return s}function Xe(e,t){var s;const i={views:[],templates:[]};if(!e)return i;(null!==(s=e.views)&&void 0!==s?s:[]).forEach((e,s)=>{var n,r,o;const a=Qe(e,t);a&&i.views.push({title:null!==(r=null!==(n=e.title)&&void 0!==n?n:e.path)&&void 0!==r?r:"",path:null!==(o=e.path)&&void 0!==o?o:"",index:s,count:a})});for(const[n,r]of Object.entries(Ge(e)))n!==t&&Qe(Object.values(r),t)&&i.templates.push(n);return i}function et(e,t){return Array.isArray(e)?e.some(e=>et(e,t)):!(!e||"object"!=typeof e)&&(We(e.type)?e.template===t:Object.values(e).some(e=>et(e,t)))}const tt=[Be,Ie,...Ze],st=["card","badge","row","element"],it=["type","template","description","variables","default",...st,"style"];function nt(e,t){if(Array.isArray(e))for(const s of e)nt(s,t);else if(e&&"object"==typeof e){t(e);for(const s of Object.values(e))nt(s,t)}}function rt(e){const t=new Set,s=new Set;return nt(e,e=>{const i=e.type;"string"==typeof i&&(i.startsWith("custom:")&&!tt.includes(i)&&t.add(i),Ze.includes(i)&&"string"==typeof e.template&&s.add(e.template))}),{customTypes:[...t].sort(),templateRefs:[...s].sort()}}function ot(e){const t={};for(const r of it)void 0!==(null==e?void 0:e[r])&&(t[r]=e[r]);for(const r of Object.keys(null!=e?e:{}))r in t||(t[r]=e[r]);const{customTypes:s,templateRefs:i}=rt(e),n=[];return s.length&&n.push(`Requires these custom cards: ${s.join(", ")}`),i.length&&n.push(`Uses these other templates, which are not included here: ${i.join(", ")}`),{payload:t,notes:n}}const at=/^[a-z_]+\.[a-z0-9_]+$/,lt={base:"entity",label:"Entity",selector:{entity:{}},matches:e=>at.test(e)};function ht(e,t){return{base:e,label:t,selector:{text:{}},matches:e=>e.trim().length>0}}const ct={entity:lt,entity_id:lt,name:ht("name","Name"),title:ht("title","Title"),heading:ht("heading","Heading"),icon:{base:"icon",label:"Icon",selector:{icon:{}},matches:e=>e.includes(":")}};function dt(e,t){return 1===t?e.label:`${e.label} ${t}`}function ut(){let e=document.querySelector("hc-main");return e=e&&e.shadowRoot,e=e&&e.querySelector("hc-lovelace"),e=e&&e.shadowRoot,e=e&&e.querySelector("hui-view"),e?e.lovelace:null}function pt(){let e=document.querySelector("home-assistant");return e=e&&e.shadowRoot,e=e&&e.querySelector("home-assistant-main"),e=e&&e.shadowRoot,e=e&&e.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),e=e&&e.shadowRoot||e,e=e&&e.querySelector("ha-panel-lovelace"),e=e&&e.shadowRoot,e=e&&e.querySelector("hui-root"),e?e.lovelace:null}function gt(){const e=pt()||ut();return null==e?void 0:e.config}const mt="decluttering-card-plus",ft="decluttering-card-plus-editor",_t="decluttering-template-plus",vt="decluttering-template-plus-editor",yt="decluttering-card",bt="decluttering-template",$t={card:{type:"entity",entity:"sun.sun"},badge:{type:"entity",entity:"sun.sun"},row:{entity:"sun.sun"},element:{type:"icon",icon:"mdi:weather-sunny",style:{color:"yellow"}}},wt="variable:",At=[{name:"for_each",label:"Repeat for each",helper:"One copy of the template per item. Example: - entity: light.hall, name: Hall",selector:{object:{}}},{name:"columns",label:"Columns",helper:"How many copies sit side by side. One stacks them vertically",selector:{number:{min:1,max:6,mode:"box"}}}];function Et(e){return void 0===e||Array.isArray(e)||!!e&&"object"==typeof e}function Ct(e,t,s){void 0===s||""===s||Array.isArray(s)&&0===s.length?delete e[t]:e[t]=s}const St=window.loadCardHelpers?window.loadCardHelpers():void 0;function xt(e){const t=Object.keys(e).filter(e=>["card","row","element","badge"].includes(e));return 1===t.length?t[0]:void 0}console.info("%c DECLUTTERING-CARD-PLUS \n%c   Version 1.0.0   ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray");class Tt extends ae{constructor(){super(...arguments),this.preview=!1}set hass(e){e&&(this._hass=e,this._thing&&(this._thing.hass=e),this.hassAvailable(e))}hassAvailable(e){}static get styles(){return o`
      :host(.child-card-hidden) {
        display: none;
      }
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
    `}firstUpdated(){this.updateComplete.then(()=>{this._displayHidden()})}updated(e){super.updated(e);const t=this._thing;t&&("preview"in t&&(t.preview=this.preview),"layout"in t&&(t.layout=this.layout))}_childIsHidden(){const e=this._thing;return!!e&&(!!e.hasAttribute("hidden")||"none"===getComputedStyle(e).display)}_displayHidden(){this._childIsHidden()?this.classList.add("child-card-hidden"):this.classList.contains("child-card-hidden")&&this.classList.remove("child-card-hidden")}_setTemplateConfig(e,t,s){var i,n,r;const o=xt(e);if(!o)throw new Error("You must define one card, badge, element, or row in the template");const a=null!==(r=null!==(n=null!==(i=e.card)&&void 0!==i?i:e.element)&&void 0!==n?n:e.row)&&void 0!==r?r:e.badge;this._setResolved(o,qe(t,e,a),this._resolveStyles(e,t,s))}_resolveStyles(e,t,s){let i="";return e.style&&(i+=qe(t,e,e.style)),s&&(i+=qe(t,e,s)),i}_setResolved(e,t,s){this._style=s,this._thingConfig=t,this._thingType=e,Tt._createThing(t,e,s=>{this._thingConfig===t&&this._setThing(s,"element"===e?t.style:void 0)})}_setForEach(e,t,s){if("card"!==xt(e))throw new Error("for_each needs a template that defines a card");const i=s.map((i,n)=>qe(function(e,t,s,i){const n=void 0===s?[]:[{index:s+1},{count:null!=i?i:0}];return[...Oe(e),...Oe(t),...n]}(i,t.variables,n,s.length),e,e.card)),n=Number(t.columns)||1,r=n>1?{type:"grid",columns:n,square:!1,cards:i}:{type:"vertical-stack",cards:i};this._setResolved("card",r,this._resolveStyles(e,t.variables,t.style))}_setThing(e,t){var s;null===(s=this._savedStyles)||void 0===s||s.forEach((e,t)=>this.style.setProperty(t,e[0],e[1])),this._savedStyles=void 0,t&&(this._savedStyles=new Map,Object.keys(t).forEach(e=>{var s;null===(s=this._savedStyles)||void 0===s||s.set(e,[this.style.getPropertyValue(e),this.style.getPropertyPriority(e)]),this.style.setProperty(e,t[e])})),this._thing=e,this._forwardGridApi(e),this._hass&&(e.hass=this._hass),this._watchForHiding(e)}_watchForHiding(e){this._resizes||(this._resizes=new ResizeObserver(()=>{this._displayHidden()})),this._resizes.disconnect(),this._resizes.observe(e)}connectedCallback(){super.connectedCallback(),this._thing&&this._watchForHiding(this._thing)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._resizes)||void 0===e||e.disconnect()}_forwardGridApi(e){const t=this;delete t.getGridOptions,delete t.getLayoutOptions,"card"===this._thingType&&e&&("function"==typeof e.getGridOptions&&(t.getGridOptions=()=>e.getGridOptions()),"function"==typeof e.getLayoutOptions&&(t.getLayoutOptions=()=>e.getLayoutOptions()))}render(){return this._error?B` <ha-alert alert-type="error">${this._error}</ha-alert> `:this._hass&&this._thing?(this.classList.toggle("decluttering-badge","badge"===this._thingType),this.classList.toggle("decluttering-container","badge"!==this._thingType),this.classList.toggle("decluttering-card","card"===this._thingType),B`
      ${this._style?B`
              <style>
                ${this._style}
              </style>
            `:""}
      ${this._thing}
    `):B``}static async _createThing(e,t,s){let i,n;if("card"===t&&"divider"!==e.type?n=customElements.get("hui-card"):"badge"===t&&(n=customElements.get("hui-badge")),n){const t=new n;return t.config=e,void s(t)}if(St)if("card"===t)i="divider"===e.type?(await St).createRowElement(e):(await St).createCardElement(e);else if("row"===t)i=(await St).createRowElement(e);else if("element"===t)i=(await St).createHuiElement(e);else{if("badge"!==t)throw new Error(`Unsupported thing type '${t}'`);i=(await St).createBadgeElement(e)}else i=((e,t=!1)=>{const s=(e,t)=>i("hui-error-card",{type:"error",error:e,config:t}),i=(e,t)=>{const i=window.document.createElement(e);try{if(!i.setConfig)return;i.setConfig(t)}catch(n){return console.error(e,n),s(n.message,t)}return i};if(!e||"object"!=typeof e||!t&&!e.type)return s("No type defined",e);let n=e.type;if(n&&n.startsWith("custom:"))n=n.substr(7);else if(t)if(fe.has(n))n=`hui-${n}-row`;else{if(!e.entity)return s("Invalid config given.",e);const t=e.entity.split(".",1)[0];n=`hui-${_e[t]||"text"}-entity-row`}else n=`hui-${n}-card`;if(customElements.get(n))return i(n,e);const r=s(`Custom element doesn't exist: ${e.type}.`,e);r.style.display="None";const o=setTimeout(()=>{r.style.display=""},2e3);return customElements.whenDefined(e.type).then(()=>{clearTimeout(o),me(r,"ll-rebuild",{},r)}),r})(e,"row"===t);i.addEventListener("ll-rebuild",n=>{n.stopPropagation(),Tt._createThing(e,t,e=>{i.replaceWith(e),s(e)})},{once:!0}),s(i)}getCardSize(){return this._thing&&"card"===this._thingType?this._thing.getCardSize():1}}e([ue()],Tt.prototype,"_hass",void 0),e([ue()],Tt.prototype,"_thing",void 0),e([de({type:Boolean})],Tt.prototype,"preview",void 0),e([de({attribute:!1})],Tt.prototype,"layout",void 0),e([ue()],Tt.prototype,"_style",void 0),e([ue()],Tt.prototype,"_error",void 0);class Ot extends Tt{static getConfigElement(){return document.createElement(ft)}static getStubConfig(){return{type:`custom:${mt}`,template:"follow_the_sun"}}setConfig(e){if(!e.template)throw new Error("Missing template object in your config");const t=gt();if(!t)throw new Error("Could not retrieve the lovelace configuration.");this._error=void 0;const s=function(e,t){var s;return null!==(s=Ge(e)[t])&&void 0!==s?s:null}(t,e.template);if(s)return this._pendingConfig=void 0,void this._applyTemplate(s,e);if(!Fe(t).length)throw new Error(`The template "${e.template}" doesn't exist in decluttering_templates or in a custom:decluttering-template card`);this._pendingConfig=e,this._hass&&this.hassAvailable(this._hass)}_applyTemplate(e,t){const s=Me(t.for_each);s?this._setForEach(e,t,s):this._setTemplateConfig(e,t.variables,t.style)}hassAvailable(e){const t=this._pendingConfig;if(!t)return;this._pendingConfig=void 0;(async function(e,t,s){var i;return null!==(i=(await Ke(e,t))[s])&&void 0!==i?i:null})(e,gt(),t.template).then(e=>{e?this._applyTemplate(e,t):this._error=`The template "${t.template}" doesn't exist in decluttering_templates, in a custom:decluttering-template card, or on any dashboard listed in decluttering_templates_from`}).catch(e=>{var s;this._error=`Could not resolve the template "${t.template}": ${null!==(s=null==e?void 0:e.message)&&void 0!==s?s:e}`})}}class jt extends ae{constructor(){super(...arguments),this._loadingTemplates=!1}static get styles(){return o`
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
    `}set lovelace(e){this._lovelace=e,this._templates=void 0,this._schema=void 0}setConfig(e){this._config=e}willUpdate(){var e;this.hass&&this._config&&(this._lovelace||(this._lovelace=null!==(e=gt())&&void 0!==e?e:void 0),this._lovelace&&(this._templates||(this._templates=Ge(this._lovelace),this._loadBorrowedTemplates()),this._schema||(this._schema=[{name:"template",label:"Template to use",selector:{select:{mode:"dropdown",sort:!0,custom_value:!0,options:Object.keys(this._templates)}}},{name:"variables",label:"Variables",helper:"Example: - variable_name: value",selector:{object:{}}}])))}render(){if(!(this.hass&&this._config&&this._templates&&this._schema))return B``;const e=this._templates[this._config.template],t=je(e),s=Et(this._config.variables),i=!!e&&"card"===xt(e)||void 0!==this._config.for_each,n={};return e||this._loadingTemplates||(n.template="No template exists with this name"),s||(n.variables="Variables must be a list of key and value pairs, or a mapping of them"),B`
      ${(null==e?void 0:e.description)?B`<p class="description">${e.description}</p>`:B``}
      ${this._renderSource(e)} ${this._renderDiagnostics(e,s)}
      <ha-form
        .hass=${this.hass}
        .data=${this._formData(t)}
        .schema=${this._formSchema(t,i)}
        .error=${n}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}_renderSource(e){var t;const s=null===(t=this._config)||void 0===t?void 0:t.template;if(!s||!e||this._loadingTemplates)return B``;const i=function(e,t){var s,i,n,r,o;if(!e)return null;const a=null!==(s=e.views)&&void 0!==s?s:[];for(let l=0;l<a.length;l+=1){const e=a[l];if(et(e,t))return{declared:!1,view:{title:null!==(n=null!==(i=e.title)&&void 0!==i?i:e.path)&&void 0!==n?n:"",path:null!==(r=e.path)&&void 0!==r?r:"",index:l}}}return void 0!==(null===(o=e.decluttering_templates)||void 0===o?void 0:o[t])?{declared:!0}:null}(this._lovelace,s);if(!i)return B`<p class="hint">This template is borrowed from another dashboard, so it is edited there.</p>`;if(i.declared||!i.view)return B`<p class="hint">Defined in this dashboard's decluttering_templates.</p>`;const{view:n}=i,r=document.location.pathname.split("/").slice(0,2).join("/");return B`<p class="hint">
      Defined in
      <a href=${`${r}/${n.path||n.index}`} target="_blank" rel="noreferrer"
        >${n.title||n.path||"an untitled view"}</a
      >.
    </p>`}_formSchema(e,t){const s=t?At:[];return e.length?[this._schema[0],...e.map(e=>{var t,s;return{name:wt+e.name,label:null!==(t=e.label)&&void 0!==t?t:e.name,helper:e.description,selector:null!==(s=e.selector)&&void 0!==s?s:{text:{}},required:!0===e.required}}),{name:"extras",label:"Other variables",helper:"Anything this template does not describe. Example: - variable_name: value",selector:{object:{}}},...s]:[...this._schema,...s]}_formData(e){var t,s,i,n,r;if(!e.length)return this._config;const o=Re(null===(t=this._config)||void 0===t?void 0:t.variables),a=new Set(e.map(e=>e.name)),l={template:null===(s=this._config)||void 0===s?void 0:s.template};for(const c of e)c.name in o&&(l[wt+c.name]=o[c.name]);const h=Oe(null===(i=this._config)||void 0===i?void 0:i.variables).filter(e=>{const t=xe(e);return void 0!==t&&!a.has(t)});return h.length&&(l.extras=h),void 0!==(null===(n=this._config)||void 0===n?void 0:n.for_each)&&(l.for_each=this._config.for_each),void 0!==(null===(r=this._config)||void 0===r?void 0:r.columns)&&(l.columns=this._config.columns),l}_renderDiagnostics(e,t){var s,i;if(!e||this._loadingTemplates||!t)return B``;const n=function(e){var t;const s=null!==(t=Me(e))&&void 0!==t?t:[],i=new Set(s.length?Le:[]);for(const n of s)for(const e of Oe(n))i.add(Object.keys(e)[0]);return[...i]}(null===(s=this._config)||void 0===s?void 0:s.for_each).map(e=>({[e]:null})),{missing:r,unused:o,required:a}=function(e,t,s){const i=Re([...ke(e,t),...Oe(s)]),n=Ne(t,i),r=new Set(n),o=Oe(e),a=[];for(const c of o){const e=Te(c);void 0===e||r.has(e)||a.includes(e)||a.push(e)}const l=n.filter(e=>!(e in i)),h=new Set(je(t).filter(e=>!0===e.required).map(e=>e.name));return{missing:l,unused:a,required:l.filter(e=>h.has(e))}}(null===(i=this._config)||void 0===i?void 0:i.variables,e,n),l=r.filter(e=>!a.includes(e));return B`
      ${a.length?B`<ha-alert alert-type="error">
              ${1===a.length?"This template needs a variable":"This template needs variables"} you have not
              set: ${a.join(", ")}.
            </ha-alert>`:B``}
      ${l.length?B`<ha-alert alert-type="warning">
              ${1===l.length?"This template uses a variable":"This template uses variables"} with no value
              and no default: ${l.join(", ")}.
            </ha-alert>`:B``}
      ${o.length?B`<ha-alert alert-type="info">
              ${1===o.length?"This variable is":"These variables are"} set here but never used by the
              template: ${o.join(", ")}.
            </ha-alert>`:B``}
    `}_valueChanged(e){var t,s;const i=e.detail.value,n=je(null===(t=this._templates)||void 0===t?void 0:t[i.template]);if(!n.length)return void me(this,"config-changed",{config:i});const r=[];for(const l of n){const e=i[wt+l.name];void 0!==e&&""!==e&&r.push({[l.name]:e})}Array.isArray(i.extras)&&r.push(...i.extras);const o=Object.assign(Object.assign({},this._config),{template:i.template}),a=function(e,t){const s=new Map;for(const n of t){const e=Te(n);void 0===e||s.has(e)||s.set(e,n)}const i=[];for(const n of Array.isArray(e)?e:[]){const e=Te(n);void 0!==e&&s.has(e)&&(i.push(s.get(e)),s.delete(e))}return i.push(...s.values()),i}(Oe(null===(s=this._config)||void 0===s?void 0:s.variables),r);a.length?o.variables=a:delete o.variables,Ct(o,"for_each",i.for_each),Ct(o,"columns",i.columns),me(this,"config-changed",{config:o})}_loadBorrowedTemplates(){Fe(this._lovelace).length&&(this._loadingTemplates=!0,Ke(this.hass,this._lovelace).then(e=>{this._templates=e,this._schema=void 0}).finally(()=>{this._loadingTemplates=!1,this.requestUpdate()}))}}e([ue()],jt.prototype,"_lovelace",void 0),e([ue()],jt.prototype,"_config",void 0),e([de()],jt.prototype,"hass",void 0),e([ue()],jt.prototype,"_loadingTemplates",void 0);class Pt extends Tt{constructor(){super(...arguments),this.preview=!1}static getConfigElement(){return document.createElement(vt)}static getStubConfig(){return{type:`custom:${_t}`,template:"follow_the_sun",card:{type:"entity",entity:"sun.sun"}}}static get styles(){return o`
      ${Tt.styles}
      .badge {
        margin: 8px;
        color: var(--primary-color);
      }
      :host([preview]) {
        display: block !important;
        border: 1px solid var(--primary-color);
      }
    `}setConfig(e){if(!e.template)throw new Error("Missing template property");this._template=e.template,this._setTemplateConfig(e,void 0,void 0)}render(){return this.setHidden(!this.preview),this.preview?B`
        <div class="badge">${this._template}</div>
        ${super.render()}
      `:B``}setHidden(e){this.hasAttribute("hidden")!==e&&(this.toggleAttribute("hidden",e),this.dispatchEvent(new Event("card-visibility-changed",{bubbles:!0,composed:!0})))}}e([de({type:Boolean,reflect:!0})],Pt.prototype,"preview",void 0),e([ue()],Pt.prototype,"_template",void 0);class kt extends ae{constructor(){super(...arguments),this._selectedTab="settings",this._importParses=!0,this._importErrors=[],this._copyState="",this._suggestedNothing=!1,this._renameTo="",this._renaming=!1,this._loadedElements=!1}setConfig(e){this._config=e,this._suggestion=void 0,this._suggestedNothing=!1}static get styles(){return o`
      ${Tt.styles}
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
    `}async connectedCallback(){super.connectedCallback(),this._loadedElements||(await async function(){let e=customElements.get("hui-vertical-stack-card");e||((await St).createCardElement({type:"vertical-stack",cards:[]}),await customElements.whenDefined("hui-vertical-stack-card"),e=customElements.get("hui-vertical-stack-card")),e&&(e=e.prototype.constructor),e&&e.getConfigElement&&await e.getConfigElement()}(),await async function(){let e=customElements.get("hui-entities-card");e||((await St).createCardElement({type:"entities",entities:[]}),await customElements.whenDefined("hui-entities-card"),e=customElements.get("hui-entities-card")),e&&e.getConfigElement&&await e.getConfigElement()}(),this._loadedElements=!0)}render(){var e;if(!this.hass||!this._config)return B``;const t={};Et(this._config.default)||(t.default="Variables must be a list of key and value pairs, or a mapping of them"),void 0===this._config.variables||Array.isArray(this._config.variables)||(t.variables="The declarations must be a list, each entry naming one variable");const s={template:this._config.template,thingType:null!==(e=xt(this._config))&&void 0!==e?e:"card",description:this._config.description,variables:this._config.variables,default:this._config.default};return B`
      <ha-tab-group .active=${this._selectedTab} @click=${this._activateTab}>
        <ha-tab-group-tab slot="nav" panel="settings">Settings</ha-tab-group-tab>
        ${"card"===s.thingType?B`
                <ha-tab-group-tab slot="nav" panel="card">Card</ha-tab-group-tab>
                <ha-tab-group-tab slot="nav" panel="change_card">Change card type</ha-tab-group-tab>
              `:"row"===s.thingType?B`<ha-tab-group-tab slot="nav" panel="row">Row</ha-tab-group-tab>`:B``}
        <ha-tab-group-tab slot="nav" panel="usages">Where used</ha-tab-group-tab>
        <ha-tab-group-tab slot="nav" panel="share">Share</ha-tab-group-tab>
      </ha-tab-group>
      ${"settings"===this._selectedTab?B`
              ${this._renderDiagnostics()} ${this._renderSuggest("card"===s.thingType)}
              <ha-form
                .hass=${this.hass}
                .data=${s}
                .schema=${kt.schema}
                .error=${t}
                .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
                .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
                @value-changed=${this._valueChanged}
              ></ha-form>
            `:"card"===this._selectedTab?B`
                <hui-card-element-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .value=${this._config.card}
                  @config-changed=${this._cardChanged}
                ></hui-card-element-editor>
              `:"change_card"===this._selectedTab?B`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this.lovelace}
                    @config-changed=${this._cardPicked}
                  ></hui-card-picker>
                `:"row"===this._selectedTab?B`
                    <hui-row-element-editor
                      .hass=${this.hass}
                      .lovelace=${this.lovelace}
                      .value=${this._config.row}
                      @config-changed=${this._rowChanged}
                    ></hui-row-element-editor>
                  `:"usages"===this._selectedTab?this._renderUsages():"share"===this._selectedTab?this._renderShare():B``}
    `}_renderDiagnostics(){if(!this._config||void 0!==this._config.variables&&!Array.isArray(this._config.variables))return B``;const{unused:e,duplicated:t,contradictory:s}=He(this._config);return B`
      ${e.length?B`<ha-alert alert-type="info">
              ${1===e.length?"This variable is declared":"These variables are declared"} but never used in
              the template: ${e.join(", ")}.
            </ha-alert>`:B``}
      ${t.length?B`<ha-alert alert-type="warning">
              ${1===t.length?"This variable has":"These variables have"} a default in both places; the
              declaration is the one that counts: ${t.join(", ")}.
            </ha-alert>`:B``}
      ${s.length?B`<ha-alert alert-type="warning">
              ${1===s.length?"This variable is":"These variables are"} marked required but have a
              default, so they can never be unset: ${s.join(", ")}.
            </ha-alert>`:B``}
    `}_renderSuggest(e){var t;return e&&(null===(t=this._config)||void 0===t?void 0:t.card)?B`
      <div class="suggest">
        ${this._suggestedNothing?B`<ha-alert alert-type="info">
                Nothing here looks like it varies between copies. Entities, names, titles and icons are what get
                offered, and this card either has none or they are variables already.
              </ha-alert>`:B``}
        ${this._suggestion?B`<ha-alert alert-type="warning">
                This will rewrite the card to use
                ${this._suggestion.variables.map(e=>e.name).join(", ")}, and declare
                ${1===this._suggestion.variables.length?"it":"them"} with the value
                ${1===this._suggestion.variables.length?"it has":"they have"} now. Press again to go ahead.
              </ha-alert>`:B``}
        <mwc-button @click=${this._suggest}>
          ${this._suggestion?"Suggest variables anyway":"Suggest variables from the card"}
        </mwc-button>
      </div>
    `:B``}_suggest(){var e;if(!(null===(e=this._config)||void 0===e?void 0:e.card))return;if(this._suggestion){const e=Object.assign(Object.assign({},this._config),{card:this._suggestion.card});return e.variables=[...je(this._config),...this._suggestion.variables],this._suggestion=void 0,void this._fireConfigChanged(e)}this._suggestedNothing=!1;const t=je(this._config).map(e=>e.name),s=function(e,t){const s=new Set(t),i=[],n=new Map,r=(e,t)=>{const r=`${e.base} ${t}`,o=n.get(r);if(o)return o;let a=1,l=e.base;for(;s.has(l);)a+=1,l=`${e.base}_${a}`;return s.add(l),n.set(r,l),i.push({name:l,label:dt(e,a),selector:e.selector,default:t}),l},o=e=>{if(Array.isArray(e))return e.map(o);if(!e||"object"!=typeof e)return e;const t={};for(const[s,i]of Object.entries(e)){const e=ct[s];e&&"string"==typeof i&&!be.test(i)&&e.matches(i)?t[s]=`[[${r(e,i)}]]`:t[s]=o(i)}return t};return{card:o(e),variables:i}}(this._config.card,t);s.variables.length?this._suggestion=s:this._suggestedNothing=!0}_renderUsages(){var e,t,s;const i=null===(e=this._config)||void 0===e?void 0:e.template;if(!i)return B``;const n=null!==(t=this.lovelace)&&void 0!==t?t:gt();if(!n)return B`<div class="usages">
        <ha-alert alert-type="warning">
          The dashboard configuration could not be read, so uses cannot be counted here.
        </ha-alert>
      </div>`;(null===(s=this._usages)||void 0===s?void 0:s.name)===i&&this._usages.ll===n||(this._usages={name:i,ll:n,usages:Xe(n,i)});const{views:r,templates:o}=this._usages.usages,a=r.reduce((e,t)=>e+t.count,0),l=document.location.pathname.split("/").slice(0,2).join("/");return B`
      <div class="usages">
        ${0!==a||o.length?B`
                <p class="hint">
                  ${1===a?"One card uses":`${a} cards use`} "${i}" on this dashboard. Cards on other
                  dashboards are not counted.
                </p>
                <ul>
                  ${r.map(e=>B`
                      <li>
                        <a href=${`${l}/${e.path||e.index}`} target="_blank" rel="noreferrer">
                          ${e.title||e.path||"Untitled view"}
                        </a>
                        — ${1===e.count?"once":`${e.count} times`}
                      </li>
                    `)}
                </ul>
              `:B`<ha-alert alert-type="info">
                Nothing on this dashboard uses "${i}" yet. Cards on other dashboards are not counted here, even ones
                that borrow this dashboard's templates.
              </ha-alert>`}
        ${o.length?B`<ha-alert alert-type="info">
                This template is used by ${1===o.length?"another template":"other templates"}:
                ${o.join(", ")}. Changing it changes ${1===o.length?"that one":"those"} too.
              </ha-alert>`:B``}
        ${this._renderRename(i,a)}
      </div>
    `}_renderShare(){const{payload:e,notes:t}=ot(this._config);return B`
      <div class="share">
        <h3>Export</h3>
        <p class="hint">Copy this and send it to someone else, or paste it into another dashboard.</p>
        ${t.map(e=>B`<ha-alert alert-type="info">${e}</ha-alert>`)}
        <ha-yaml-editor id="export" .hass=${this.hass} .defaultValue=${e} read-only></ha-yaml-editor>
        <mwc-button @click=${this._copyExport}>
          ${"done"===this._copyState?"Copied":"failed"===this._copyState?"Could not copy - select the text above instead":"Copy to clipboard"}
        </mwc-button>

        <h3>Import</h3>
        <p class="hint">Paste a template someone shared with you. It will replace the one you are editing.</p>
        <ha-yaml-editor .hass=${this.hass} @value-changed=${this._importChanged}></ha-yaml-editor>
        ${this._importErrors.map(e=>B`<ha-alert alert-type="error">${e}</ha-alert>`)}
        ${this._importClash?B`<ha-alert alert-type="warning">
                This dashboard already has a template called "${this._importClash}". Importing will give you two
                templates with the same name, and only one of them will be used. Press Import again to go ahead.
              </ha-alert>`:B``}
        <mwc-button @click=${this._import}>${this._importClash?"Import anyway":"Import"}</mwc-button>
      </div>
    `}_renderRename(e,t){const s=this._renameTo.trim(),i=1===t?"one card":`${t} cards`,n=!!s&&this._renamePending===s;return B`
      <div class="rename">
        <h3>Rename</h3>
        <p class="hint">
          Changes the name here and in every card on this dashboard that uses it. Cards on other dashboards are not
          touched, even ones that borrow this dashboard's templates.
        </p>
        ${this._renameError?B`<ha-alert alert-type="error">${this._renameError}</ha-alert>`:B``}
        ${n?B`<ha-alert alert-type="warning">
                This renames "${e}" to "${s}"${t?B` and rewrites ${i}`:B``}, and saves the
                dashboard straight away. Press again to go ahead.
              </ha-alert>`:B``}
        <ha-textfield
          label="New name"
          .value=${this._renameTo}
          .disabled=${this._renaming}
          @input=${this._renameChanged}
        ></ha-textfield>
        <mwc-button .disabled=${this._renaming||!s||s===e} @click=${this._rename}>
          ${n?"Rename anyway":t?`Rename and update ${i}`:"Rename"}
        </mwc-button>
      </div>
    `}_renameChanged(e){var t;this._renameTo=null!==(t=e.target.value)&&void 0!==t?t:"",this._renameError=void 0,this._renamePending=void 0}async _rename(){var e,t;const s=null===(e=this._config)||void 0===e?void 0:e.template,i=this._renameTo.trim();if(!s||!i||i===s)return;const n=function(){const e=pt()||ut();return"function"==typeof(null==e?void 0:e.saveConfig)?e:null}();if(n)if(void 0===Ge(n.config)[i])if(this._renamePending===i){this._renaming=!0,this._renameError=void 0;try{await n.saveConfig(function(e,t,s){const i=e=>{if(Array.isArray(e))return e.map(i);if(!e||"object"!=typeof e)return e;const n={};for(const[t,s]of Object.entries(e))n[t]=i(s);return(We(e.type)||Ze.includes(e.type))&&e.template===t&&(n.template=s),n},n=i(e),r=null==n?void 0:n.decluttering_templates;if(r&&"object"==typeof r&&t in r){const e={};for(const[i,n]of Object.entries(r))e[i===t?s:i]=n;n.decluttering_templates=e}return n}(n.config,s,i)),this._fireConfigChanged(Object.assign(Object.assign({},this._config),{template:i})),this._renameTo="",this._renamePending=void 0}catch(r){this._renameError=`Could not save the dashboard: ${null!==(t=null==r?void 0:r.message)&&void 0!==t?t:r}`}finally{this._renaming=!1}}else this._renamePending=i;else this._renameError=`A template called "${i}" already exists on this dashboard.`;else this._renameError="This dashboard cannot be saved from here, so it cannot be renamed here either."}async _copyExport(){const e=this.renderRoot.querySelector("#export"),t=null==e?void 0:e.yaml;if(!t)return;const{notes:s}=ot(this._config),i=[...s.map(e=>`# ${e}`),t].join("\n");this._copyState=await async function(e){var t;if(null===(t=navigator.clipboard)||void 0===t?void 0:t.writeText)try{return await navigator.clipboard.writeText(e),!0}catch(n){}const s=document.createElement("textarea");s.value=e,s.setAttribute("readonly",""),s.style.cssText="position:fixed;top:-1000px;opacity:0;",document.body.appendChild(s),s.select();let i=!1;try{i=document.execCommand("copy")}catch(r){i=!1}return s.remove(),i}(i)?"done":"failed",setTimeout(()=>this._copyState="",3e3)}_importChanged(e){e.stopPropagation(),this._importValue=e.detail.value,this._importParses=!1!==e.detail.isValid,this._importErrors=[],this._importClash=void 0}_import(){var e;if(!this._config)return;if(!this._importParses)return void(this._importErrors=["This is not valid YAML, so it cannot be read."]);const t=function(e){if(!e||"object"!=typeof e||Array.isArray(e))return{ok:!1,errors:["This does not look like a template: it should be a block of YAML keys and values."]};const t=[];"string"==typeof e.template&&e.template.trim()||t.push('This template has no name: it needs a "template:" line.');const s=st.filter(t=>void 0!==e[t]);return 0===s.length?t.push('This template defines nothing: it needs one of "card:", "badge:", "row:" or "element:".'):s.length>1&&t.push(`This template defines both "${s[0]}" and "${s[1]}": it can only define one of them.`),{ok:0===t.length,errors:t}}(this._importValue);if(!t.ok)return this._importErrors=t.errors,void(this._importClash=void 0);this._importErrors=[];const s=this._importValue.template,i=Ge(null!==(e=this.lovelace)&&void 0!==e?e:gt());this._importClash||s===this._config.template||!(s in i)?(this._fireConfigChanged(Object.assign(Object.assign({},this._importValue),{type:this._config.type})),this._importClash=void 0,this._selectedTab="settings"):this._importClash=s}_activateTab(e){const t=e.composedPath().find(e=>"ha-tab-group-tab"===e.localName),s=null==t?void 0:t.getAttribute("panel");s&&(this._selectedTab=s)}_valueChanged(e){if(!this._config)return;const t=e.detail.value,s=Object.assign(Object.assign({},this._config),{template:t.template,default:t.default});Ct(s,"description",t.description),Ct(s,"variables",t.variables);for(const[i,n]of Object.entries($t))kt.stubMember(t.thingType===i,s,i,n);this._fireConfigChanged(s)}_cardChanged(e){if(e.stopPropagation(),!this._config)return;this._suggestion=void 0,this._suggestedNothing=!1;const t=Object.assign(Object.assign({},this._config),{card:e.detail.config});this._fireConfigChanged(t)}_cardPicked(e){this._selectedTab="card",this._cardChanged(e)}_rowChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign(Object.assign({},this._config),{row:e.detail.config});this._fireConfigChanged(t)}_fireConfigChanged(e){this._suggestion=void 0,this._suggestedNothing=!1,me(this,"config-changed",{config:e})}static stubMember(e,t,s,i){e?s in t||(t[s]=i):delete t[s]}}function Rt(e,t){return customElements.get(e)?(console.warn(`decluttering-card-plus: <${e}> is already registered by something else, skipping it.`),!1):(customElements.define(e,t),!0)}kt.schema=[{name:"template",label:"Template to define",selector:{text:{}}},{name:"thingType",label:"Type of thing to template",selector:{select:{mode:"dropdown",options:[{value:"card",label:"Card"},{value:"badge",label:"Badge"},{value:"row",label:"Row"},{value:"element",label:"Element"}]}}},{name:"description",label:"Description",helper:"What this template is for, shown to whoever uses it",selector:{text:{multiline:!0}}},{name:"variables",label:"Variable declarations",helper:"Describe a variable and its editor shows the right control. Example: - name: entity, selector: {entity: {}}",selector:{object:{}}},{name:"default",label:"Variables",helper:"Example: - variable_name: default_value",selector:{object:{}}}],e([ue()],kt.prototype,"_config",void 0),e([ue()],kt.prototype,"_selectedTab",void 0),e([ue()],kt.prototype,"_importErrors",void 0),e([ue()],kt.prototype,"_importClash",void 0),e([ue()],kt.prototype,"_copyState",void 0),e([ue()],kt.prototype,"_suggestion",void 0),e([ue()],kt.prototype,"_suggestedNothing",void 0),e([ue()],kt.prototype,"_renameTo",void 0),e([ue()],kt.prototype,"_renameError",void 0),e([ue()],kt.prototype,"_renaming",void 0),e([ue()],kt.prototype,"_renamePending",void 0),e([de()],kt.prototype,"lovelace",void 0),e([de()],kt.prototype,"hass",void 0);const Ut=window.customCards=window.customCards||[],Nt=window.customBadges=window.customBadges||[],Ht="https://github.com/tempus2016/decluttering-card-plus";Rt(ft,jt),Rt(vt,kt),Rt(mt,Ot)&&(Ut.push({type:mt,documentationURL:Ht,name:"Decluttering Card Plus",preview:!1,description:"Reuse multiple times the same card configuration with variables to declutter your config."}),Nt.push({type:mt,documentationURL:Ht,name:"Decluttering Card Plus",preview:!1,description:"Instantiate a template whose content is a badge."})),Rt(_t,Pt)&&Ut.push({type:_t,documentationURL:Ht,name:"Decluttering Template Plus",preview:!1,description:"Define a reusable template for decluttering cards to instantiate."});Rt(yt,class extends Ot{static getStubConfig(){return Object.assign(Object.assign({},Ot.getStubConfig()),{type:`custom:${yt}`})}})&&Ut.push({type:yt,documentationURL:Ht,name:"Decluttering Card (compatibility)",preview:!1,description:"Compatibility alias for existing custom:decluttering-card configurations."}),Rt(bt,class extends Pt{static getStubConfig(){return Object.assign(Object.assign({},Pt.getStubConfig()),{type:`custom:${bt}`})}})&&Ut.push({type:bt,documentationURL:Ht,name:"Decluttering Template (compatibility)",preview:!1,description:"Compatibility alias for existing custom:decluttering-template configurations."});
