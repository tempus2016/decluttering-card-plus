function t(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:h,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,g=globalThis,m=g.trustedTypes,f=m?m.emptyScript:"",_=g.reactiveElementPolyfillSupport,v=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!l(t,e),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const t=this._$Eu(e,i);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const o=n.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const o=this.constructor;if(!1===s&&(n=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??b)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,_?.({ReactiveElement:w}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,E=t=>t,C=A.trustedTypes,S=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,x="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+T,j=`<${O}>`,P=document,k=()=>P.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,N="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,L=/>/g,D=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,q=/"/g,I=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),B=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),J=new WeakMap,F=P.createTreeWalker(P,129);function G(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=H;for(let a=0;a<i;a++){const e=t[a];let i,l,h=-1,c=0;for(;c<e.length&&(r.lastIndex=c,l=r.exec(e),null!==l);)c=r.lastIndex,r===H?"!--"===l[1]?r=M:void 0!==l[1]?r=L:void 0!==l[2]?(I.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=D):void 0!==l[3]&&(r=D):r===D?">"===l[0]?(r=n??H,h=-1):void 0===l[1]?h=-2:(h=r.lastIndex-l[2].length,i=l[1],r=void 0===l[3]?D:'"'===l[3]?q:z):r===q||r===z?r=D:r===M||r===L?r=H:(r=D,n=void 0);const d=r===D&&t[a+1].startsWith("/>")?" ":"";o+=r===H?e+j:h>=0?(s.push(i),e.slice(0,h)+x+e.slice(h)+T+d):e+T+(-2===h?a:d)}return[G(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[l,h]=Y(t,e);if(this.el=K.createElement(l,i),F.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=F.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(x)){const e=h[o++],i=s.getAttribute(t).split(T),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(T)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(I.test(s.tagName)){const t=s.textContent.split(T),e=t.length-1;if(e>0){s.textContent=C?C.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],k()),F.nextNode(),a.push({type:2,index:++n});s.append(t[e],k())}}}else if(8===s.nodeType)if(s.data===O)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(T,t+1));)a.push({type:7,index:n}),t+=T.length-1}n++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,s){if(e===B)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=R(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=Z(t,n._$AS(t,e.values),n,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);F.currentNode=s;let n=F.nextNode(),o=0,r=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new X(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new nt(n,this,t)),this._$AV.push(e),a=i[++r]}o!==a?.index&&(n=F.nextNode(),o++)}return F.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),R(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new K(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new X(this.O(k()),this.O(k()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=E(t).nextSibling;E(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=Z(this,t,e,0),o=!R(t)||t!==this._$AH&&t!==B,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=Z(this,s[i+r],e,r),a===B&&(a=this._$AH[r]),o||=!R(a)||a!==this._$AH[r],a===V?t=V:t!==V&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class st extends tt{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??V)===B)return;const i=this._$AH,s=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const ot=A.litHtmlPolyfillSupport;ot?.(K,X),(A.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class at extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new X(e.insertBefore(k(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const lt=rt.litElementPolyfillSupport;lt?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},ct=(t=ht,e,i)=>{const{kind:s,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function dt(t){return(e,i)=>"object"==typeof i?ct(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ut(t){return dt({...t,state:!0,attribute:!1})}var pt,gt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(pt||(pt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(gt||(gt={}));const mt=(t,e,i,s)=>{s=s||{},i=null==i?{}:i;const n=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return n.detail=i,t.dispatchEvent(n),n},ft=new Set(["call-service","divider","section","weblink","cast","select"]),_t={alert:"toggle",automation:"toggle",climate:"climate",cover:"cover",fan:"toggle",group:"group",input_boolean:"toggle",input_number:"input-number",input_select:"input-select",input_text:"input-text",light:"toggle",lock:"lock",media_player:"media-player",remote:"toggle",scene:"scene",script:"script",sensor:"sensor",timer:"timer",switch:"toggle",vacuum:"toggle",water_heater:"climate",input_datetime:"input-datetime"},vt="\\[\\[([^[\\]]+)\\]\\]",yt="\\[\\[!([^[\\]]+)\\]\\]";const bt=new RegExp(vt),$t={slug:t=>t.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,""),upper:t=>t.toUpperCase(),lower:t=>t.toLowerCase(),title:t=>t.replace(/\S+/g,t=>t[0].toUpperCase()+t.slice(1).toLowerCase()),kebab:t=>t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")},wt=Object.keys($t).join("|"),At=`(?:\\|(${`(?:${wt})(?:\\|(?:${wt}))*`}))?`,Et=new RegExp(`(?:\\|(?:${wt}))+$`);function Ct(t,e){let i=String(e);for(const s of t?t.split("|"):[]){const t=$t[s];if(!t)return String(e);i=t(i)}return i}const St=["card","badge","row","element","style"];function xt(t){if(t&&"object"==typeof t&&!Array.isArray(t))return Object.keys(t)[0]}const Tt=xt;function Ot(t){const e=[],i=t=>{if(t&&"object"==typeof t&&!Array.isArray(t))for(const[i,s]of Object.entries(t))e.push({[i]:s})};return Array.isArray(t)?t.forEach(i):i(t),e}function jt(t){const e=null==t?void 0:t.variables;if(!Array.isArray(e))return[];const i=new Set,s=[];for(const n of e){if(!n||"object"!=typeof n||Array.isArray(n))continue;const t=n.name;"string"==typeof t&&t.trim()&&!i.has(t)&&(i.add(t),s.push(n))}return s}function Pt(t){return Ot(null==t?void 0:t.default)}function kt(t,e){const i=[];i.push(...Ot(t));for(const s of jt(e))"default"in s&&i.push({[s.name]:s.default});return i.push(...Pt(e)),function(t){const e=new Set;return t.filter(t=>{const i=Tt(t);return void 0!==i&&!e.has(i)&&(e.add(i),!0)})}(i)}function Rt(t){const e={};for(const i of Ot(t)){const t=Tt(i);void 0===t||t in e||(e[t]=i[t])}return e}function Ut(t){if(void 0===t)return[];const e=[],i=JSON.stringify(t);if("string"!=typeof i)return e;const s=new RegExp(vt,"g");let n=s.exec(i);for(;null!==n;)n[1].startsWith("!")||e.push(n[1].replace(Et,"")),n=s.exec(i);return e}function Nt(t,e){const i=Ut(function(t){return St.map(e=>null==t?void 0:t[e]).filter(t=>void 0!==t)}(t)),s=new Set,n=[];for(;i.length;){const t=i.shift();s.has(t)||(s.add(t),n.push(t),t in e&&i.push(...Ut(e[t])))}return n}function Ht(t){const e=jt(t),i=new Set(function(t){return Nt(t,Rt(kt(void 0,t)))}(t)),s=new Set(Pt(t).map(Tt)),n=[],o=[],r=[];for(const a of e){const{name:t}=a;i.has(t)||n.push(t),s.has(t)&&o.push(t),!0===a.required&&("default"in a||s.has(t))&&r.push(t)}return{unused:n,duplicated:o,contradictory:r}}function Mt(t){return Array.isArray(t)?t:t&&"object"==typeof t&&Object.keys(t).length?[t]:void 0}const Lt=["index","count"];function Dt(t){const e=JSON.stringify(t);return e.slice(1,e.length-1)}function zt(t,e){let i=t;return e.forEach(t=>{const e=function(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(Object.keys(t)[0]),s=Object.values(t)[0],n=new RegExp(`"\\[\\[${e}${At}\\]\\]"`,"gm"),o=new RegExp(`\\[\\[${e}${At}\\]\\]`,"gm"),r=null===s||"object"!=typeof s;i=i.replace(n,(t,e)=>e?r?JSON.stringify(Ct(e,s)):t:function(t,e){return"object"==typeof t?JSON.stringify(t):"number"==typeof t||"boolean"==typeof t?String(t):e}(s,t)),i=i.replace(o,(t,e)=>e?r?Dt(Ct(e,s)):t:function(t){return"object"==typeof t?Dt(JSON.stringify(t)):"number"==typeof t||"boolean"==typeof t?String(t):Dt(String(t))}(s))}),i}var qt=(t,e,i)=>{if(void 0===i)return i;const s=kt(t,e);let n=JSON.stringify(i);if(s.length){let t=0;for(;bt.test(n)&&t<10;){const e=n;if(n=zt(n,s),t+=1,n===e)break}10===t&&bt.test(n)&&console.warn("decluttering-card-plus: gave up substituting variables after 10 passes. Check whether a variable refers to itself.")}return o=n,new RegExp(yt).test(o)?JSON.parse(function(t){return t.replace(new RegExp(yt,"g"),"[[$1]]")}(n)):s.length?JSON.parse(n):i;var o};const It="custom:decluttering-template",Wt="custom:decluttering-template-plus",Bt=["lovelace","default",""];function Vt(t){return t===Wt||t===It}function Jt(t,e){if(Array.isArray(t))for(const i of t)Jt(i,e);else if(t&&"object"==typeof t)if(Vt(t.type))"string"==typeof t.template&&(e[t.template]=t);else for(const i of Object.values(t))Jt(i,e)}function Ft(t){const e={};if(!t)return e;const i=t.decluttering_templates;return i&&Object.assign(e,i),t.views&&Jt(t.views,e),e}function Gt(t){const e=null==t?void 0:t.decluttering_templates_from;return e?(Array.isArray(e)?e:[e]).filter(t=>"string"==typeof t):[]}const Yt=new Map;let Kt=!1;function Zt(t){var e;Kt||"function"!=typeof(null===(e=null==t?void 0:t.connection)||void 0===e?void 0:e.subscribeEvents)||(Kt=!0,t.connection.subscribeEvents(t=>{var e;for(const i of function(t){const e=null!=t?t:"";return Bt.includes(e)?[...Bt]:[e]}(null===(e=null==t?void 0:t.data)||void 0===e?void 0:e.url_path))Yt.delete(i)},"lovelace_updated"))}async function Qt(t,e){const i=Ft(e),s=Gt(e);if(!t||!s.length)return i;const n=await Promise.all(s.map(e=>function(t,e){Zt(t);const i=Yt.get(e);if(i)return i;const s=Bt.includes(e)?null:e,n=t.callWS({type:"lovelace/config",url_path:s}).catch(t=>{var i;return console.warn(`decluttering-card-plus: could not read the dashboard "${e}":`,null!==(i=null==t?void 0:t.message)&&void 0!==i?i:t),null});return Yt.set(e,n),n}(t,e))),o={};for(const r of n)Object.assign(o,Ft(r));return Object.assign(Object.assign({},o),i)}const Xt=["custom:decluttering-card-plus","custom:decluttering-card"];function te(t,e){if(Array.isArray(t))return t.reduce((t,i)=>t+te(i,e),0);if(!t||"object"!=typeof t)return 0;if(Vt(t.type))return 0;let i=Xt.includes(t.type)&&t.template===e?1:0;for(const s of Object.values(t))i+=te(s,e);return i}function ee(t,e){var i;const s={views:[],templates:[]};if(!t)return s;(null!==(i=t.views)&&void 0!==i?i:[]).forEach((t,i)=>{var n,o,r;const a=te(t,e);a&&s.views.push({title:null!==(o=null!==(n=t.title)&&void 0!==n?n:t.path)&&void 0!==o?o:"",path:null!==(r=t.path)&&void 0!==r?r:"",index:i,count:a})});for(const[n,o]of Object.entries(Ft(t)))n!==e&&te(Object.values(o),e)&&s.templates.push(n);return s}function ie(t,e){return Array.isArray(t)?t.some(t=>ie(t,e)):!(!t||"object"!=typeof t)&&(Vt(t.type)?t.template===e:Object.values(t).some(t=>ie(t,e)))}const se=[Wt,It,...Xt],ne=["card","badge","row","element"],oe=["type","template","description","variables","default",...ne,"style"];function re(t,e){if(Array.isArray(t))for(const i of t)re(i,e);else if(t&&"object"==typeof t){e(t);for(const i of Object.values(t))re(i,e)}}function ae(t){const e=new Set,i=new Set;return re(t,t=>{const s=t.type;"string"==typeof s&&(s.startsWith("custom:")&&!se.includes(s)&&e.add(s),Xt.includes(s)&&"string"==typeof t.template&&i.add(t.template))}),{customTypes:[...e].sort(),templateRefs:[...i].sort()}}function le(t){const e={};for(const o of oe)void 0!==(null==t?void 0:t[o])&&(e[o]=t[o]);for(const o of Object.keys(null!=t?t:{}))o in e||(e[o]=t[o]);const{customTypes:i,templateRefs:s}=ae(t),n=[];return i.length&&n.push(`Requires these custom cards: ${i.join(", ")}`),s.length&&n.push(`Uses these other templates, which are not included here: ${s.join(", ")}`),{payload:e,notes:n}}const he=/^[a-z_]+\.[a-z0-9_]+$/,ce={base:"entity",label:"Entity",selector:{entity:{}},matches:t=>he.test(t)};function de(t,e){return{base:t,label:e,selector:{text:{}},matches:t=>t.trim().length>0}}const ue={entity:ce,entity_id:ce,name:de("name","Name"),title:de("title","Title"),heading:de("heading","Heading"),icon:{base:"icon",label:"Icon",selector:{icon:{}},matches:t=>t.includes(":")}};function pe(t,e){return 1===e?t.label:`${t.label} ${e}`}function ge(){let t=document.querySelector("hc-main");return t=t&&t.shadowRoot,t=t&&t.querySelector("hc-lovelace"),t=t&&t.shadowRoot,t=t&&t.querySelector("hui-view"),t?t.lovelace:null}function me(){let t=document.querySelector("home-assistant");return t=t&&t.shadowRoot,t=t&&t.querySelector("home-assistant-main"),t=t&&t.shadowRoot,t=t&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),t=t&&t.shadowRoot||t,t=t&&t.querySelector("ha-panel-lovelace"),t=t&&t.shadowRoot,t=t&&t.querySelector("hui-root"),t?t.lovelace:null}function fe(){const t=me()||ge();return null==t?void 0:t.config}const _e="decluttering-card-plus",ve="decluttering-card-plus-editor",ye="decluttering-template-plus",be="decluttering-template-plus-editor",$e="decluttering-card",we="decluttering-template",Ae={card:{type:"entity",entity:"sun.sun"},badge:{type:"entity",entity:"sun.sun"},row:{entity:"sun.sun"},element:{type:"icon",icon:"mdi:weather-sunny",style:{color:"yellow"}}},Ee="variable:",Ce=[{name:"for_each",label:"Repeat for each",helper:"One copy of the template per item. Example: - entity: light.hall, name: Hall",selector:{object:{}}},{name:"columns",label:"Columns",helper:"How many copies sit side by side. One stacks them vertically",selector:{number:{min:1,max:6,mode:"box"}}},{name:"min_column_width",label:"Minimum column width",helper:"Pixels. Drops a column rather than going narrower, so the card suits a phone too",selector:{number:{min:50,max:1e3,step:10,mode:"box"}}}];function Se(t){return void 0===t||Array.isArray(t)||!!t&&"object"==typeof t}function xe(t,e,i){void 0===i||""===i||Array.isArray(i)&&0===i.length?delete t[e]:t[e]=i}const Te=window.loadCardHelpers?window.loadCardHelpers():void 0;function Oe(t){const e=Object.keys(t).filter(t=>["card","row","element","badge"].includes(t));return 1===e.length?e[0]:void 0}console.info("%c DECLUTTERING-CARD-PLUS \n%c   Version 1.0.0   ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray");class je extends at{constructor(){super(...arguments),this.preview=!1}set hass(t){t&&(this._hass=t,this._thing&&(this._thing.hass=t),this.hassAvailable(t))}hassAvailable(t){}static get styles(){return r`
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
    `}firstUpdated(){this.updateComplete.then(()=>{this._displayHidden()})}updated(t){super.updated(t);const e=this._thing;e&&("preview"in e&&(e.preview=this.preview),"layout"in e&&(e.layout=this.layout))}_childIsHidden(){const t=this._thing;return!!t&&(!!t.hasAttribute("hidden")||"none"===getComputedStyle(t).display)}_displayHidden(){this._childIsHidden()?this.classList.add("child-card-hidden"):this.classList.contains("child-card-hidden")&&this.classList.remove("child-card-hidden")}_setTemplateConfig(t,e,i){var s,n,o;const r=Oe(t);if(!r)throw new Error("You must define one card, badge, element, or row in the template");const a=null!==(o=null!==(n=null!==(s=t.card)&&void 0!==s?s:t.element)&&void 0!==n?n:t.row)&&void 0!==o?o:t.badge;this._setResolved(r,qt(e,t,a),this._resolveStyles(t,e,i))}_resolveStyles(t,e,i){let s="";return t.style&&(s+=qt(e,t,t.style)),i&&(s+=qt(e,t,i)),s}_setResolved(t,e,i){this._style=i,this._thingConfig=e,this._thingType=t,je._createThing(e,t,i=>{this._thingConfig===e&&this._setThing(i,"element"===t?e.style:void 0)})}_setForEach(t,e,i){var s;if("card"!==Oe(t))throw new Error("for_each needs a template that defines a card");const n=i.map((s,n)=>qt(function(t,e,i,s){const n=void 0===i?[]:[{index:i+1},{count:null!=s?s:0}];return[...Ot(t),...Ot(e),...n]}(s,e.variables,n,i.length),t,t.card));this._forEach={cards:n,max:Number(e.columns)||1,minWidth:Number(e.min_column_width)||void 0,styles:this._resolveStyles(t,e.variables,e.style)},this._columnsShown=void 0,this._layoutForEach(),this._forEach.minWidth?this._watchWidth():null===(s=this._widths)||void 0===s||s.disconnect()}_layoutForEach(){const t=this._forEach;if(!t)return;const e=function(t,e,i){const s=Math.max(1,Math.floor(e)||1);return!i||i<=0||!t||t<=0?s:Math.min(s,Math.max(1,Math.floor(t/i)))}(this.clientWidth,t.max,t.minWidth);if(e===this._columnsShown)return;this._columnsShown=e;const i=e>1?{type:"grid",columns:e,square:!1,cards:t.cards}:{type:"vertical-stack",cards:t.cards};this._setResolved("card",i,t.styles)}_watchWidth(){this._widths||(this._widths=new ResizeObserver(()=>this._layoutForEach())),this._widths.disconnect(),this._widths.observe(this)}_setThing(t,e){var i;null===(i=this._savedStyles)||void 0===i||i.forEach((t,e)=>this.style.setProperty(e,t[0],t[1])),this._savedStyles=void 0,e&&(this._savedStyles=new Map,Object.keys(e).forEach(t=>{var i;null===(i=this._savedStyles)||void 0===i||i.set(t,[this.style.getPropertyValue(t),this.style.getPropertyPriority(t)]),this.style.setProperty(t,e[t])})),this._thing=t,this._forwardGridApi(t),this._hass&&(t.hass=this._hass),this._watchForHiding(t)}_watchForHiding(t){this._resizes||(this._resizes=new ResizeObserver(()=>{this._displayHidden()})),this._resizes.disconnect(),this._resizes.observe(t)}connectedCallback(){var t;super.connectedCallback(),this._thing&&this._watchForHiding(this._thing),(null===(t=this._forEach)||void 0===t?void 0:t.minWidth)&&this._watchWidth()}disconnectedCallback(){var t,e;super.disconnectedCallback(),null===(t=this._resizes)||void 0===t||t.disconnect(),null===(e=this._widths)||void 0===e||e.disconnect()}_forwardGridApi(t){const e=this;delete e.getGridOptions,delete e.getLayoutOptions,"card"===this._thingType&&t&&("function"==typeof t.getGridOptions&&(e.getGridOptions=()=>t.getGridOptions()),"function"==typeof t.getLayoutOptions&&(e.getLayoutOptions=()=>t.getLayoutOptions()))}render(){return this._error?W` <ha-alert alert-type="error">${this._error}</ha-alert> `:this._hass&&this._thing?(this.classList.toggle("decluttering-badge","badge"===this._thingType),this.classList.toggle("decluttering-container","badge"!==this._thingType),this.classList.toggle("decluttering-card","card"===this._thingType),W`
      ${this._style?W`
              <style>
                ${this._style}
              </style>
            `:""}
      ${this._thing}
    `):W``}static async _createThing(t,e,i){let s,n;if("card"===e&&"divider"!==t.type?n=customElements.get("hui-card"):"badge"===e&&(n=customElements.get("hui-badge")),n){const e=new n;return e.config=t,void i(e)}if(Te)if("card"===e)s="divider"===t.type?(await Te).createRowElement(t):(await Te).createCardElement(t);else if("row"===e)s=(await Te).createRowElement(t);else if("element"===e)s=(await Te).createHuiElement(t);else{if("badge"!==e)throw new Error(`Unsupported thing type '${e}'`);s=(await Te).createBadgeElement(t)}else s=((t,e=!1)=>{const i=(t,e)=>s("hui-error-card",{type:"error",error:t,config:e}),s=(t,e)=>{const s=window.document.createElement(t);try{if(!s.setConfig)return;s.setConfig(e)}catch(n){return console.error(t,n),i(n.message,e)}return s};if(!t||"object"!=typeof t||!e&&!t.type)return i("No type defined",t);let n=t.type;if(n&&n.startsWith("custom:"))n=n.substr(7);else if(e)if(ft.has(n))n=`hui-${n}-row`;else{if(!t.entity)return i("Invalid config given.",t);const e=t.entity.split(".",1)[0];n=`hui-${_t[e]||"text"}-entity-row`}else n=`hui-${n}-card`;if(customElements.get(n))return s(n,t);const o=i(`Custom element doesn't exist: ${t.type}.`,t);o.style.display="None";const r=setTimeout(()=>{o.style.display=""},2e3);return customElements.whenDefined(t.type).then(()=>{clearTimeout(r),mt(o,"ll-rebuild",{},o)}),o})(t,"row"===e);s.addEventListener("ll-rebuild",n=>{n.stopPropagation(),je._createThing(t,e,t=>{s.replaceWith(t),i(t)})},{once:!0}),i(s)}getCardSize(){return this._thing&&"card"===this._thingType?this._thing.getCardSize():1}}t([ut()],je.prototype,"_hass",void 0),t([ut()],je.prototype,"_thing",void 0),t([dt({type:Boolean})],je.prototype,"preview",void 0),t([dt({attribute:!1})],je.prototype,"layout",void 0),t([ut()],je.prototype,"_style",void 0),t([ut()],je.prototype,"_error",void 0);class Pe extends je{static getConfigElement(){return document.createElement(ve)}static getStubConfig(){return{type:`custom:${_e}`,template:"follow_the_sun"}}setConfig(t){if(!t.template)throw new Error("Missing template object in your config");const e=fe();if(!e)throw new Error("Could not retrieve the lovelace configuration.");this._error=void 0;const i=function(t,e){var i;return null!==(i=Ft(t)[e])&&void 0!==i?i:null}(e,t.template);if(i)return this._pendingConfig=void 0,void this._applyTemplate(i,t);if(!Gt(e).length)throw new Error(`The template "${t.template}" doesn't exist in decluttering_templates or in a custom:decluttering-template card`);this._pendingConfig=t,this._hass&&this.hassAvailable(this._hass)}_applyTemplate(t,e){const i=Mt(e.for_each);i?this._setForEach(t,e,i):this._setTemplateConfig(t,e.variables,e.style)}hassAvailable(t){const e=this._pendingConfig;if(!e)return;this._pendingConfig=void 0;(async function(t,e,i){var s;return null!==(s=(await Qt(t,e))[i])&&void 0!==s?s:null})(t,fe(),e.template).then(t=>{t?this._applyTemplate(t,e):this._error=`The template "${e.template}" doesn't exist in decluttering_templates, in a custom:decluttering-template card, or on any dashboard listed in decluttering_templates_from`}).catch(t=>{var i;this._error=`Could not resolve the template "${e.template}": ${null!==(i=null==t?void 0:t.message)&&void 0!==i?i:t}`})}}class ke extends at{constructor(){super(...arguments),this._loadingTemplates=!1}static get styles(){return r`
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
    `}set lovelace(t){this._lovelace=t,this._templates=void 0,this._schema=void 0}setConfig(t){this._config=t}willUpdate(){var t;this.hass&&this._config&&(this._lovelace||(this._lovelace=null!==(t=fe())&&void 0!==t?t:void 0),this._lovelace&&(this._templates||(this._templates=Ft(this._lovelace),this._loadBorrowedTemplates()),this._schema||(this._schema=[{name:"template",label:"Template to use",selector:{select:{mode:"dropdown",sort:!0,custom_value:!0,options:Object.keys(this._templates)}}},{name:"variables",label:"Variables",helper:"Example: - variable_name: value",selector:{object:{}}}])))}render(){if(!(this.hass&&this._config&&this._templates&&this._schema))return W``;const t=this._templates[this._config.template],e=jt(t),i=Se(this._config.variables),s=!!t&&"card"===Oe(t)||void 0!==this._config.for_each,n={};return t||this._loadingTemplates||(n.template="No template exists with this name"),i||(n.variables="Variables must be a list of key and value pairs, or a mapping of them"),W`
      ${(null==t?void 0:t.description)?W`<p class="description">${t.description}</p>`:W``}
      ${this._renderSource(t)} ${this._renderDiagnostics(t,i)}
      <ha-form
        .hass=${this.hass}
        .data=${this._formData(e)}
        .schema=${this._formSchema(e,s)}
        .error=${n}
        .computeLabel=${t=>{var e;return null!==(e=t.label)&&void 0!==e?e:t.name}}
        .computeHelper=${t=>{var e;return null!==(e=t.helper)&&void 0!==e?e:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `}_renderSource(t){var e;const i=null===(e=this._config)||void 0===e?void 0:e.template;if(!i||!t||this._loadingTemplates)return W``;const s=function(t,e){var i,s,n,o,r;if(!t)return null;const a=null!==(i=t.views)&&void 0!==i?i:[];for(let l=0;l<a.length;l+=1){const t=a[l];if(ie(t,e))return{declared:!1,view:{title:null!==(n=null!==(s=t.title)&&void 0!==s?s:t.path)&&void 0!==n?n:"",path:null!==(o=t.path)&&void 0!==o?o:"",index:l}}}return void 0!==(null===(r=t.decluttering_templates)||void 0===r?void 0:r[e])?{declared:!0}:null}(this._lovelace,i);if(!s)return W`<p class="hint">This template is borrowed from another dashboard, so it is edited there.</p>`;if(s.declared||!s.view)return W`<p class="hint">Defined in this dashboard's decluttering_templates.</p>`;const{view:n}=s,o=document.location.pathname.split("/").slice(0,2).join("/");return W`<p class="hint">
      Defined in
      <a href=${`${o}/${n.path||n.index}`} target="_blank" rel="noreferrer"
        >${n.title||n.path||"an untitled view"}</a
      >.
    </p>`}_formSchema(t,e){const i=e?Ce:[];return t.length?[this._schema[0],...t.map(t=>{var e,i;return{name:Ee+t.name,label:null!==(e=t.label)&&void 0!==e?e:t.name,helper:t.description,selector:null!==(i=t.selector)&&void 0!==i?i:{text:{}},required:!0===t.required}}),{name:"extras",label:"Other variables",helper:"Anything this template does not describe. Example: - variable_name: value",selector:{object:{}}},...i]:[...this._schema,...i]}_formData(t){var e,i,s,n,o,r;if(!t.length)return this._config;const a=Rt(null===(e=this._config)||void 0===e?void 0:e.variables),l=new Set(t.map(t=>t.name)),h={template:null===(i=this._config)||void 0===i?void 0:i.template};for(const d of t)d.name in a&&(h[Ee+d.name]=a[d.name]);const c=Ot(null===(s=this._config)||void 0===s?void 0:s.variables).filter(t=>{const e=xt(t);return void 0!==e&&!l.has(e)});return c.length&&(h.extras=c),void 0!==(null===(n=this._config)||void 0===n?void 0:n.for_each)&&(h.for_each=this._config.for_each),void 0!==(null===(o=this._config)||void 0===o?void 0:o.columns)&&(h.columns=this._config.columns),void 0!==(null===(r=this._config)||void 0===r?void 0:r.min_column_width)&&(h.min_column_width=this._config.min_column_width),h}_renderDiagnostics(t,e){var i,s;if(!t||this._loadingTemplates||!e)return W``;const n=function(t){var e;const i=null!==(e=Mt(t))&&void 0!==e?e:[],s=new Set(i.length?Lt:[]);for(const n of i)for(const t of Ot(n))s.add(Object.keys(t)[0]);return[...s]}(null===(i=this._config)||void 0===i?void 0:i.for_each).map(t=>({[t]:null})),{missing:o,unused:r,required:a}=function(t,e,i){const s=Rt([...kt(t,e),...Ot(i)]),n=Nt(e,s),o=new Set(n),r=Ot(t),a=[];for(const c of r){const t=Tt(c);void 0===t||o.has(t)||a.includes(t)||a.push(t)}const l=n.filter(t=>!(t in s)),h=new Set(jt(e).filter(t=>!0===t.required).map(t=>t.name));return{missing:l,unused:a,required:l.filter(t=>h.has(t))}}(null===(s=this._config)||void 0===s?void 0:s.variables,t,n),l=o.filter(t=>!a.includes(t));return W`
      ${a.length?W`<ha-alert alert-type="error">
              ${1===a.length?"This template needs a variable":"This template needs variables"} you have not
              set: ${a.join(", ")}.
            </ha-alert>`:W``}
      ${l.length?W`<ha-alert alert-type="warning">
              ${1===l.length?"This template uses a variable":"This template uses variables"} with no value
              and no default: ${l.join(", ")}.
            </ha-alert>`:W``}
      ${r.length?W`<ha-alert alert-type="info">
              ${1===r.length?"This variable is":"These variables are"} set here but never used by the
              template: ${r.join(", ")}.
            </ha-alert>`:W``}
    `}_valueChanged(t){var e,i;const s=t.detail.value,n=jt(null===(e=this._templates)||void 0===e?void 0:e[s.template]);if(!n.length)return void mt(this,"config-changed",{config:s});const o=[];for(const l of n){const t=s[Ee+l.name];void 0!==t&&""!==t&&o.push({[l.name]:t})}Array.isArray(s.extras)&&o.push(...s.extras);const r=Object.assign(Object.assign({},this._config),{template:s.template}),a=function(t,e){const i=new Map;for(const n of e){const t=Tt(n);void 0===t||i.has(t)||i.set(t,n)}const s=[];for(const n of Array.isArray(t)?t:[]){const t=Tt(n);void 0!==t&&i.has(t)&&(s.push(i.get(t)),i.delete(t))}return s.push(...i.values()),s}(Ot(null===(i=this._config)||void 0===i?void 0:i.variables),o);a.length?r.variables=a:delete r.variables,xe(r,"for_each",s.for_each),xe(r,"columns",s.columns),xe(r,"min_column_width",s.min_column_width),mt(this,"config-changed",{config:r})}_loadBorrowedTemplates(){Gt(this._lovelace).length&&(this._loadingTemplates=!0,Qt(this.hass,this._lovelace).then(t=>{this._templates=t,this._schema=void 0}).finally(()=>{this._loadingTemplates=!1,this.requestUpdate()}))}}t([ut()],ke.prototype,"_lovelace",void 0),t([ut()],ke.prototype,"_config",void 0),t([dt()],ke.prototype,"hass",void 0),t([ut()],ke.prototype,"_loadingTemplates",void 0);class Re extends je{constructor(){super(...arguments),this.preview=!1}static getConfigElement(){return document.createElement(be)}static getStubConfig(){return{type:`custom:${ye}`,template:"follow_the_sun",card:{type:"entity",entity:"sun.sun"}}}static get styles(){return r`
      ${je.styles}
      .badge {
        margin: 8px;
        color: var(--primary-color);
      }
      :host([preview]) {
        display: block !important;
        border: 1px solid var(--primary-color);
      }
    `}setConfig(t){if(!t.template)throw new Error("Missing template property");this._template=t.template,this._setTemplateConfig(t,void 0,void 0)}render(){return this.setHidden(!this.preview),this.preview?W`
        <div class="badge">${this._template}</div>
        ${super.render()}
      `:W``}setHidden(t){this.hasAttribute("hidden")!==t&&(this.toggleAttribute("hidden",t),this.dispatchEvent(new Event("card-visibility-changed",{bubbles:!0,composed:!0})))}}t([dt({type:Boolean,reflect:!0})],Re.prototype,"preview",void 0),t([ut()],Re.prototype,"_template",void 0);class Ue extends at{constructor(){super(...arguments),this._selectedTab="settings",this._importParses=!0,this._importErrors=[],this._copyState="",this._suggestedNothing=!1,this._renameTo="",this._renaming=!1,this._loadedElements=!1}setConfig(t){this._config=t,this._suggestion=void 0,this._suggestedNothing=!1}static get styles(){return r`
      ${je.styles}
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
    `}async connectedCallback(){super.connectedCallback(),this._loadedElements||(await async function(){let t=customElements.get("hui-vertical-stack-card");t||((await Te).createCardElement({type:"vertical-stack",cards:[]}),await customElements.whenDefined("hui-vertical-stack-card"),t=customElements.get("hui-vertical-stack-card")),t&&(t=t.prototype.constructor),t&&t.getConfigElement&&await t.getConfigElement()}(),await async function(){let t=customElements.get("hui-entities-card");t||((await Te).createCardElement({type:"entities",entities:[]}),await customElements.whenDefined("hui-entities-card"),t=customElements.get("hui-entities-card")),t&&t.getConfigElement&&await t.getConfigElement()}(),this._loadedElements=!0)}render(){var t;if(!this.hass||!this._config)return W``;const e={};Se(this._config.default)||(e.default="Variables must be a list of key and value pairs, or a mapping of them"),void 0===this._config.variables||Array.isArray(this._config.variables)||(e.variables="The declarations must be a list, each entry naming one variable");const i={template:this._config.template,thingType:null!==(t=Oe(this._config))&&void 0!==t?t:"card",description:this._config.description,variables:this._config.variables,default:this._config.default};return W`
      <ha-tab-group .active=${this._selectedTab} @click=${this._activateTab}>
        <ha-tab-group-tab slot="nav" panel="settings">Settings</ha-tab-group-tab>
        ${"card"===i.thingType?W`
                <ha-tab-group-tab slot="nav" panel="card">Card</ha-tab-group-tab>
                <ha-tab-group-tab slot="nav" panel="change_card">Change card type</ha-tab-group-tab>
              `:"row"===i.thingType?W`<ha-tab-group-tab slot="nav" panel="row">Row</ha-tab-group-tab>`:W``}
        <ha-tab-group-tab slot="nav" panel="usages">Where used</ha-tab-group-tab>
        <ha-tab-group-tab slot="nav" panel="share">Share</ha-tab-group-tab>
      </ha-tab-group>
      ${"settings"===this._selectedTab?W`
              ${this._renderDiagnostics()} ${this._renderSuggest("card"===i.thingType)}
              <ha-form
                .hass=${this.hass}
                .data=${i}
                .schema=${Ue.schema}
                .error=${e}
                .computeLabel=${t=>{var e;return null!==(e=t.label)&&void 0!==e?e:t.name}}
                .computeHelper=${t=>{var e;return null!==(e=t.helper)&&void 0!==e?e:""}}
                @value-changed=${this._valueChanged}
              ></ha-form>
            `:"card"===this._selectedTab?W`
                <hui-card-element-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .value=${this._config.card}
                  @config-changed=${this._cardChanged}
                ></hui-card-element-editor>
              `:"change_card"===this._selectedTab?W`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this.lovelace}
                    @config-changed=${this._cardPicked}
                  ></hui-card-picker>
                `:"row"===this._selectedTab?W`
                    <hui-row-element-editor
                      .hass=${this.hass}
                      .lovelace=${this.lovelace}
                      .value=${this._config.row}
                      @config-changed=${this._rowChanged}
                    ></hui-row-element-editor>
                  `:"usages"===this._selectedTab?this._renderUsages():"share"===this._selectedTab?this._renderShare():W``}
    `}_renderDiagnostics(){if(!this._config||void 0!==this._config.variables&&!Array.isArray(this._config.variables))return W``;const{unused:t,duplicated:e,contradictory:i}=Ht(this._config);return W`
      ${t.length?W`<ha-alert alert-type="info">
              ${1===t.length?"This variable is declared":"These variables are declared"} but never used in
              the template: ${t.join(", ")}.
            </ha-alert>`:W``}
      ${e.length?W`<ha-alert alert-type="warning">
              ${1===e.length?"This variable has":"These variables have"} a default in both places; the
              declaration is the one that counts: ${e.join(", ")}.
            </ha-alert>`:W``}
      ${i.length?W`<ha-alert alert-type="warning">
              ${1===i.length?"This variable is":"These variables are"} marked required but have a
              default, so they can never be unset: ${i.join(", ")}.
            </ha-alert>`:W``}
    `}_renderSuggest(t){var e;return t&&(null===(e=this._config)||void 0===e?void 0:e.card)?W`
      <div class="suggest">
        ${this._suggestedNothing?W`<ha-alert alert-type="info">
                Nothing here looks like it varies between copies. Entities, names, titles and icons are what get
                offered, and this card either has none or they are variables already.
              </ha-alert>`:W``}
        ${this._suggestion?W`<ha-alert alert-type="warning">
                This will rewrite the card to use
                ${this._suggestion.variables.map(t=>t.name).join(", ")}, and declare
                ${1===this._suggestion.variables.length?"it":"them"} with the value
                ${1===this._suggestion.variables.length?"it has":"they have"} now. Press again to go ahead.
              </ha-alert>`:W``}
        <mwc-button @click=${this._suggest}>
          ${this._suggestion?"Suggest variables anyway":"Suggest variables from the card"}
        </mwc-button>
      </div>
    `:W``}_suggest(){var t;if(!(null===(t=this._config)||void 0===t?void 0:t.card))return;if(this._suggestion){const t=Object.assign(Object.assign({},this._config),{card:this._suggestion.card});return t.variables=[...jt(this._config),...this._suggestion.variables],this._suggestion=void 0,void this._fireConfigChanged(t)}this._suggestedNothing=!1;const e=jt(this._config).map(t=>t.name),i=function(t,e){const i=new Set(e),s=[],n=new Map,o=(t,e)=>{const o=`${t.base} ${e}`,r=n.get(o);if(r)return r;let a=1,l=t.base;for(;i.has(l);)a+=1,l=`${t.base}_${a}`;return i.add(l),n.set(o,l),s.push({name:l,label:pe(t,a),selector:t.selector,default:e}),l},r=t=>{if(Array.isArray(t))return t.map(r);if(!t||"object"!=typeof t)return t;const e={};for(const[i,s]of Object.entries(t)){const t=ue[i];t&&"string"==typeof s&&!bt.test(s)&&t.matches(s)?e[i]=`[[${o(t,s)}]]`:e[i]=r(s)}return e};return{card:r(t),variables:s}}(this._config.card,e);i.variables.length?this._suggestion=i:this._suggestedNothing=!0}_renderUsages(){var t,e,i;const s=null===(t=this._config)||void 0===t?void 0:t.template;if(!s)return W``;const n=null!==(e=this.lovelace)&&void 0!==e?e:fe();if(!n)return W`<div class="usages">
        <ha-alert alert-type="warning">
          The dashboard configuration could not be read, so uses cannot be counted here.
        </ha-alert>
      </div>`;(null===(i=this._usages)||void 0===i?void 0:i.name)===s&&this._usages.ll===n||(this._usages={name:s,ll:n,usages:ee(n,s)});const{views:o,templates:r}=this._usages.usages,a=o.reduce((t,e)=>t+e.count,0),l=document.location.pathname.split("/").slice(0,2).join("/");return W`
      <div class="usages">
        ${0!==a||r.length?W`
                <p class="hint">
                  ${1===a?"One card uses":`${a} cards use`} "${s}" on this dashboard. Cards on other
                  dashboards are not counted.
                </p>
                <ul>
                  ${o.map(t=>W`
                      <li>
                        <a href=${`${l}/${t.path||t.index}`} target="_blank" rel="noreferrer">
                          ${t.title||t.path||"Untitled view"}
                        </a>
                        — ${1===t.count?"once":`${t.count} times`}
                      </li>
                    `)}
                </ul>
              `:W`<ha-alert alert-type="info">
                Nothing on this dashboard uses "${s}" yet. Cards on other dashboards are not counted here, even ones
                that borrow this dashboard's templates.
              </ha-alert>`}
        ${r.length?W`<ha-alert alert-type="info">
                This template is used by ${1===r.length?"another template":"other templates"}:
                ${r.join(", ")}. Changing it changes ${1===r.length?"that one":"those"} too.
              </ha-alert>`:W``}
        ${this._renderRename(s,a)}
      </div>
    `}_renderShare(){const{payload:t,notes:e}=le(this._config);return W`
      <div class="share">
        <h3>Export</h3>
        <p class="hint">Copy this and send it to someone else, or paste it into another dashboard.</p>
        ${e.map(t=>W`<ha-alert alert-type="info">${t}</ha-alert>`)}
        <ha-yaml-editor id="export" .hass=${this.hass} .defaultValue=${t} read-only></ha-yaml-editor>
        <mwc-button @click=${this._copyExport}>
          ${"done"===this._copyState?"Copied":"failed"===this._copyState?"Could not copy - select the text above instead":"Copy to clipboard"}
        </mwc-button>

        <h3>Import</h3>
        <p class="hint">Paste a template someone shared with you. It will replace the one you are editing.</p>
        <ha-yaml-editor .hass=${this.hass} @value-changed=${this._importChanged}></ha-yaml-editor>
        ${this._importErrors.map(t=>W`<ha-alert alert-type="error">${t}</ha-alert>`)}
        ${this._importClash?W`<ha-alert alert-type="warning">
                This dashboard already has a template called "${this._importClash}". Importing will give you two
                templates with the same name, and only one of them will be used. Press Import again to go ahead.
              </ha-alert>`:W``}
        <mwc-button @click=${this._import}>${this._importClash?"Import anyway":"Import"}</mwc-button>
      </div>
    `}_renderRename(t,e){const i=this._renameTo.trim(),s=1===e?"one card":`${e} cards`,n=!!i&&this._renamePending===i;return W`
      <div class="rename">
        <h3>Rename</h3>
        <p class="hint">
          Changes the name here and in every card on this dashboard that uses it. Cards on other dashboards are not
          touched, even ones that borrow this dashboard's templates.
        </p>
        ${this._renameError?W`<ha-alert alert-type="error">${this._renameError}</ha-alert>`:W``}
        ${n?W`<ha-alert alert-type="warning">
                This renames "${t}" to "${i}"${e?W` and rewrites ${s}`:W``}, and saves the
                dashboard straight away. Press again to go ahead.
              </ha-alert>`:W``}
        <ha-textfield
          label="New name"
          .value=${this._renameTo}
          .disabled=${this._renaming}
          @input=${this._renameChanged}
        ></ha-textfield>
        <mwc-button .disabled=${this._renaming||!i||i===t} @click=${this._rename}>
          ${n?"Rename anyway":e?`Rename and update ${s}`:"Rename"}
        </mwc-button>
      </div>
    `}_renameChanged(t){var e;this._renameTo=null!==(e=t.target.value)&&void 0!==e?e:"",this._renameError=void 0,this._renamePending=void 0}async _rename(){var t,e;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._renameTo.trim();if(!i||!s||s===i)return;const n=function(){const t=me()||ge();return"function"==typeof(null==t?void 0:t.saveConfig)?t:null}();if(n)if(void 0===Ft(n.config)[s])if(this._renamePending===s){this._renaming=!0,this._renameError=void 0;try{await n.saveConfig(function(t,e,i){const s=t=>{if(Array.isArray(t))return t.map(s);if(!t||"object"!=typeof t)return t;const n={};for(const[e,i]of Object.entries(t))n[e]=s(i);return(Vt(t.type)||Xt.includes(t.type))&&t.template===e&&(n.template=i),n},n=s(t),o=null==n?void 0:n.decluttering_templates;if(o&&"object"==typeof o&&e in o){const t={};for(const[s,n]of Object.entries(o))t[s===e?i:s]=n;n.decluttering_templates=t}return n}(n.config,i,s)),this._fireConfigChanged(Object.assign(Object.assign({},this._config),{template:s})),this._renameTo="",this._renamePending=void 0}catch(o){this._renameError=`Could not save the dashboard: ${null!==(e=null==o?void 0:o.message)&&void 0!==e?e:o}`}finally{this._renaming=!1}}else this._renamePending=s;else this._renameError=`A template called "${s}" already exists on this dashboard.`;else this._renameError="This dashboard cannot be saved from here, so it cannot be renamed here either."}async _copyExport(){const t=this.renderRoot.querySelector("#export"),e=null==t?void 0:t.yaml;if(!e)return;const{notes:i}=le(this._config),s=[...i.map(t=>`# ${t}`),e].join("\n");this._copyState=await async function(t){var e;if(null===(e=navigator.clipboard)||void 0===e?void 0:e.writeText)try{return await navigator.clipboard.writeText(t),!0}catch(n){}const i=document.createElement("textarea");i.value=t,i.setAttribute("readonly",""),i.style.cssText="position:fixed;top:-1000px;opacity:0;",document.body.appendChild(i),i.select();let s=!1;try{s=document.execCommand("copy")}catch(o){s=!1}return i.remove(),s}(s)?"done":"failed",setTimeout(()=>this._copyState="",3e3)}_importChanged(t){t.stopPropagation(),this._importValue=t.detail.value,this._importParses=!1!==t.detail.isValid,this._importErrors=[],this._importClash=void 0}_import(){var t;if(!this._config)return;if(!this._importParses)return void(this._importErrors=["This is not valid YAML, so it cannot be read."]);const e=function(t){if(!t||"object"!=typeof t||Array.isArray(t))return{ok:!1,errors:["This does not look like a template: it should be a block of YAML keys and values."]};const e=[];"string"==typeof t.template&&t.template.trim()||e.push('This template has no name: it needs a "template:" line.');const i=ne.filter(e=>void 0!==t[e]);return 0===i.length?e.push('This template defines nothing: it needs one of "card:", "badge:", "row:" or "element:".'):i.length>1&&e.push(`This template defines both "${i[0]}" and "${i[1]}": it can only define one of them.`),{ok:0===e.length,errors:e}}(this._importValue);if(!e.ok)return this._importErrors=e.errors,void(this._importClash=void 0);this._importErrors=[];const i=this._importValue.template,s=Ft(null!==(t=this.lovelace)&&void 0!==t?t:fe());this._importClash||i===this._config.template||!(i in s)?(this._fireConfigChanged(Object.assign(Object.assign({},this._importValue),{type:this._config.type})),this._importClash=void 0,this._selectedTab="settings"):this._importClash=i}_activateTab(t){const e=t.composedPath().find(t=>"ha-tab-group-tab"===t.localName),i=null==e?void 0:e.getAttribute("panel");i&&(this._selectedTab=i)}_valueChanged(t){if(!this._config)return;const e=t.detail.value,i=Object.assign(Object.assign({},this._config),{template:e.template,default:e.default});xe(i,"description",e.description),xe(i,"variables",e.variables);for(const[s,n]of Object.entries(Ae))Ue.stubMember(e.thingType===s,i,s,n);this._fireConfigChanged(i)}_cardChanged(t){if(t.stopPropagation(),!this._config)return;this._suggestion=void 0,this._suggestedNothing=!1;const e=Object.assign(Object.assign({},this._config),{card:t.detail.config});this._fireConfigChanged(e)}_cardPicked(t){this._selectedTab="card",this._cardChanged(t)}_rowChanged(t){if(t.stopPropagation(),!this._config)return;const e=Object.assign(Object.assign({},this._config),{row:t.detail.config});this._fireConfigChanged(e)}_fireConfigChanged(t){this._suggestion=void 0,this._suggestedNothing=!1,mt(this,"config-changed",{config:t})}static stubMember(t,e,i,s){t?i in e||(e[i]=s):delete e[i]}}function Ne(t,e){return customElements.get(t)?(console.warn(`decluttering-card-plus: <${t}> is already registered by something else, skipping it.`),!1):(customElements.define(t,e),!0)}Ue.schema=[{name:"template",label:"Template to define",selector:{text:{}}},{name:"thingType",label:"Type of thing to template",selector:{select:{mode:"dropdown",options:[{value:"card",label:"Card"},{value:"badge",label:"Badge"},{value:"row",label:"Row"},{value:"element",label:"Element"}]}}},{name:"description",label:"Description",helper:"What this template is for, shown to whoever uses it",selector:{text:{multiline:!0}}},{name:"variables",label:"Variable declarations",helper:"Describe a variable and its editor shows the right control. Example: - name: entity, selector: {entity: {}}",selector:{object:{}}},{name:"default",label:"Variables",helper:"Example: - variable_name: default_value",selector:{object:{}}}],t([ut()],Ue.prototype,"_config",void 0),t([ut()],Ue.prototype,"_selectedTab",void 0),t([ut()],Ue.prototype,"_importErrors",void 0),t([ut()],Ue.prototype,"_importClash",void 0),t([ut()],Ue.prototype,"_copyState",void 0),t([ut()],Ue.prototype,"_suggestion",void 0),t([ut()],Ue.prototype,"_suggestedNothing",void 0),t([ut()],Ue.prototype,"_renameTo",void 0),t([ut()],Ue.prototype,"_renameError",void 0),t([ut()],Ue.prototype,"_renaming",void 0),t([ut()],Ue.prototype,"_renamePending",void 0),t([dt()],Ue.prototype,"lovelace",void 0),t([dt()],Ue.prototype,"hass",void 0);const He=window.customCards=window.customCards||[],Me=window.customBadges=window.customBadges||[],Le="https://github.com/tempus2016/decluttering-card-plus";Ne(ve,ke),Ne(be,Ue),Ne(_e,Pe)&&(He.push({type:_e,documentationURL:Le,name:"Decluttering Card Plus",preview:!1,description:"Reuse multiple times the same card configuration with variables to declutter your config."}),Me.push({type:_e,documentationURL:Le,name:"Decluttering Card Plus",preview:!1,description:"Instantiate a template whose content is a badge."})),Ne(ye,Re)&&He.push({type:ye,documentationURL:Le,name:"Decluttering Template Plus",preview:!1,description:"Define a reusable template for decluttering cards to instantiate."});Ne($e,class extends Pe{static getStubConfig(){return Object.assign(Object.assign({},Pe.getStubConfig()),{type:`custom:${$e}`})}})&&He.push({type:$e,documentationURL:Le,name:"Decluttering Card (compatibility)",preview:!1,description:"Compatibility alias for existing custom:decluttering-card configurations."}),Ne(we,class extends Re{static getStubConfig(){return Object.assign(Object.assign({},Re.getStubConfig()),{type:`custom:${we}`})}})&&He.push({type:we,documentationURL:Le,name:"Decluttering Template (compatibility)",preview:!1,description:"Compatibility alias for existing custom:decluttering-template configurations."});
