import{b as e,O as t,r as i,a as s,l as a,c as n,v as o,d as r,P as l,e as d,n as c,_ as h,f as p,g as u,i as m,h as f,j as g,k as v,m as _,B as y,o as b,p as $,q as w,s as x,t as k,u as j,w as A,x as S,y as O,z as C,A as E,C as T,D as N,E as P,F as L,G as I,H as F,I as M,J as V,K as H,L as D,M as q,N as R,Q as z,R as U,S as W,T as B,U as K,W as J,X as Y,Y as Z,Z as G,$ as Q,a0 as X,a1 as ee,a2 as te,a3 as ie,a4 as se,a5 as ae,a6 as ne,a7 as oe,a8 as re,a9 as le,aa as de,ab as ce,ac as he,ad as pe,ae as ue,af as me,ag as fe,ah as ge,ai as ve,aj as _e,ak as ye,al as be,am as $e,an as we,ao as xe,ap as ke,aq as je,ar as Ae,as as Se,at as Oe,au as Ce,av as Ee,aw as Te,ax as Ne,ay as Pe,az as Le,aA as Ie,aB as Fe,aC as Me,aD as Ve,aE as He,aF as De,aG as qe,aH as Re,aI as ze,aJ as Ue,aK as We,aL as Be,aM as Ke,aN as Je,aO as Ye,aP as Ze,aQ as Ge,aR as Qe,aS as Xe,aT as et,aU as tt,aV as it,aW as st,V as at,aX as nt,aY as ot,aZ as rt,a_ as lt,a$ as dt,b0 as ct,b1 as ht,b2 as pt,b3 as ut,b4 as mt,b5 as ft,b6 as gt,b7 as vt,b8 as _t,b9 as yt,ba as bt,bb as $t,bc as wt,bd as xt,be as kt,bf as jt,bg as At,bh as St,bi as Ot,bj as Ct,bk as Et,bl as Tt,bm as Nt,bn as Pt,bo as Lt,bp as It,bq as Ft,br as Mt,bs as Vt,bt as Ht,bu as Dt,bv as qt,bw as Rt,bx as zt,by as Ut,bz as Wt,bA as Bt,bB as Kt}from"./decluttering-card-plus.core-DrjWlJno.js";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Jt=Symbol.for(""),Yt=e=>{if(e?.r===Jt)return e?._$litStatic$},Zt=e=>({_$litStatic$:e,r:Jt}),Gt=new Map,Qt=(e=>(t,...i)=>{const s=i.length;let a,n;const o=[],r=[];let l,d=0,c=!1;for(;d<s;){for(l=t[d];d<s&&void 0!==(n=i[d],a=Yt(n));)l+=a+t[++d],c=!0;d!==s&&r.push(n),o.push(l),d++}if(d===s&&o.push(t[s]),c){const e=o.join("$$lit$$");void 0===(t=Gt.get(e))&&(o.raw=o,Gt.set(e,t=o)),i=r}return e(t,...i)})(e),Xt=["grid_options","style",t,"strict","rebuild_on","debug","name","inherit_variables"];function ei(e){return"number"==typeof e&&Number.isFinite(e)?String(e):"string"==typeof e&&e.trim()?e.trim():void 0}function ti(e){if("number"==typeof e)return e;if("string"!=typeof e||!e.trim())return;const t=e.trim(),i=Number(t);return Number.isFinite(i)&&/^\d+$/.test(t)?i:t}function ii(e){return e===s?"hide":e&&"object"==typeof e&&!Array.isArray(e)?"card":"show"}function si(e){const s={on_error_mode:ii(e[t]),debug:(a=e.debug,!0===a?"json":"yaml"===a||"console"===a||"report"===a?a:"off")};var a;const n=e.grid_options,o=ei(null==n?void 0:n.columns),r=ei(null==n?void 0:n.rows);void 0!==o&&(s.grid_columns=o),void 0!==r&&(s.grid_rows=r),"string"==typeof e.style&&e.style&&(s.style=e.style),!0===e.strict&&(s.strict=!0);const l=i(e.rebuild_on);return l.length&&(s.rebuild_on=l),"string"==typeof e.name&&e.name&&(s.name=e.name),!0===e.inherit_variables&&(s.inherit_variables=!0),s}function ai(e,a){var n;const o=Object.assign({},e),r=Object.assign({},null!==(n=e.grid_options)&&void 0!==n?n:{}),l=ti(a.grid_columns),d=ti(a.grid_rows);void 0===l?delete r.columns:r.columns=l,void 0===d?delete r.rows:r.rows=d,Object.keys(r).length?o.grid_options=r:delete o.grid_options;const c="string"==typeof a.style?a.style:"";switch(c.trim()?o.style=c:delete o.style,a.on_error_mode){case"hide":o[t]=s;break;case"card":"card"!==ii(e[t])&&delete o[t];break;default:delete o[t]}!0===a.strict?o.strict=!0:delete o.strict;const h=i(a.rebuild_on);switch(h.length?o.rebuild_on=h:delete o.rebuild_on,a.debug){case"json":o.debug=!0;break;case"yaml":case"console":case"report":o.debug=a.debug;break;default:delete o.debug}const p="string"==typeof a.name?a.name.trim():"";return p?o.name=p:delete o.name,!0===a.inherit_variables?o.inherit_variables=!0:delete o.inherit_variables,o}function ni(e){const i=e[t];return i&&"object"==typeof i&&!Array.isArray(i)?i:void 0}function oi(e,i){const s=Object.assign({},e);return i&&"object"==typeof i?s[t]=i:delete s[t],s}const ri=["1","2","3","4","5","6","7","8","9","10","11","12","full"],li=["1","2","3","4","5","6","7","8","auto"];const di=["for_each","for_each_from","columns","min_column_width","gap","lazy","lazy_eager","empty"],ci=["repeat","extras","fit","advanced",...Xt],hi={grid_options:["grid_columns","grid_rows"],on_error:["on_error_mode"]};function pi(e){const t=null==e?void 0:e.editor_hide;return(Array.isArray(t)?t:void 0===t?[]:[t]).filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>e.trim().toLowerCase())}const ui=(e,t)=>void 0!==(null==e?void 0:e[t]);function mi(e,t,i){const s=new Set(pi(e)),a=Xt.some(e=>ui(t,e));return{repeat:s.has("repeat")&&!di.some(e=>ui(t,e)),extras:s.has("extras")&&!(null==i?void 0:i.length),fit:s.has("fit")&&!ui(t,"fit"),advanced:s.has("advanced")&&!a,advancedFields:[].concat(...Xt.filter(e=>s.has(e)&&!ui(t,e)).map(e=>{var t;return null!==(t=hi[e])&&void 0!==t?t:[e]}))}}function fi(e,t,i,s){if(void 0===e)return;const a=JSON.stringify(e);if("string"!=typeof a||!l.test(a))return e;let n,o=!1;try{n=d(c(t),i,{value:e},void 0,s,!0,()=>{o=!0})}catch(p){return}if(o)return;const r=null==n?void 0:n.value,h=JSON.stringify(r);return"string"==typeof h&&l.test(h)?void 0:r}function gi(e,t){return e===t||"object"==typeof e&&null!==e&&"object"==typeof t&&null!==t&&JSON.stringify(e)===JSON.stringify(t)}const vi="decluttering-card-plus-card-slot";class _i extends m{constructor(){super(...arguments),this.label="",this.emptyHint="",this._picking=!1,this._editing=!1}static get styles(){return f`
      :host {
        display: block;
        margin: 0 0 16px;
      }
      .slot {
        border: 1px dashed var(--divider-color);
        border-radius: 8px;
        padding: 10px 12px;
      }
      .slot.filled {
        border-style: solid;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .row .text {
        flex: 1;
        min-width: 0;
      }
      .label {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin: 16px 0 6px;
      }
      .hint {
        color: var(--secondary-text-color);
        font-size: 0.9em;
        margin: 0;
      }
      .summary b {
        font-weight: 500;
      }
      .summary small {
        display: block;
        color: var(--secondary-text-color);
      }
      hui-card-picker,
      hui-card-element-editor {
        display: block;
        margin-top: 12px;
      }
    `}render(){const t=function(e){var t,i,s,n;if(!e||"object"!=typeof e||Array.isArray(e))return;const o=e,r="string"==typeof o.type?o.type:"",l=r.startsWith("custom:")?r.slice(7):r?r[0].toUpperCase()+r.slice(1):"",d=e=>"string"==typeof e&&e.trim()?e.split("\n")[0].trim():void 0,c=Array.isArray(o.cards)?o.cards.length:void 0;return{type:l,text:null!==(n=null!==(s=null!==(i=null!==(t=d(o.content))&&void 0!==t?t:d(o.title))&&void 0!==i?i:d(o.name))&&void 0!==s?s:d(o.entity))&&void 0!==n?n:void 0!==c?a("editor.slot.cards",{count:c}):""}}(this.value);return e`
      ${this.label?e`<p class="label">${this.label}</p>`:e``}
      <div class="slot ${t?"filled":""}">
        ${t?e`
                <div class="row">
                  <div class="text summary">
                    <b>${t.type}</b>
                    ${t.text?e`<small>${t.text}</small>`:e``}
                  </div>
                  <ha-button @click=${()=>this._toggleEdit()}>
                    ${a(this._editing?"editor.slot.done":"editor.slot.edit",void 0,this.hass)}
                  </ha-button>
                  <ha-button @click=${()=>this._set(void 0)}>
                    ${a("editor.slot.remove",void 0,this.hass)}
                  </ha-button>
                </div>
                ${this._editing?e`<hui-card-element-editor
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        .value=${this.value}
                        @config-changed=${this._edited}
                      ></hui-card-element-editor>`:e``}
              `:e`
                <div class="row">
                  <p class="text hint">${this.emptyHint}</p>
                  <ha-button @click=${()=>this._togglePick()}>
                    ${a(this._picking?"editor.slot.cancel":"editor.slot.choose",void 0,this.hass)}
                  </ha-button>
                </div>
                ${this._picking?e`<hui-card-picker
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        @config-changed=${this._picked}
                      ></hui-card-picker>`:e``}
              `}
      </div>
    `}_togglePick(){this._picking=!this._picking}_toggleEdit(){this._editing=!this._editing}_picked(e){var t;e.stopPropagation(),this._picking=!1,this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_edited(e){var t;e.stopPropagation(),this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_set(e){this._editing=this._editing&&!!e,g(this,"value-changed",{value:e&&"object"==typeof e?e:void 0})}}function yi(e,t){const i=Math.max(0,t-e);return i<1?"<1 ms":`${Math.round(i)} ms`}h([p({attribute:!1})],_i.prototype,"hass",void 0),h([p({attribute:!1})],_i.prototype,"lovelace",void 0),h([p({attribute:!1})],_i.prototype,"value",void 0),h([p()],_i.prototype,"label",void 0),h([p()],_i.prototype,"emptyHint",void 0),h([u()],_i.prototype,"_picking",void 0),h([u()],_i.prototype,"_editing",void 0),"undefined"==typeof customElements||customElements.get(vi)||customElements.define(vi,_i);const bi="decluttering-card-plus-return";function $i(e){try{return"undefined"==typeof sessionStorage?void 0:sessionStorage}catch(t){return}}const wi="default";function xi(e){const t=null==e?void 0:e[y];return t&&"object"==typeof t&&!Array.isArray(t)?t:void 0}function ki(e,t,i){var s,a;const n={};for(const r of t){const e=null===(s=r.domain)||void 0===s?void 0:s.trim(),t=null===(a=r.template)||void 0===a?void 0:a.trim();e&&t&&e!==wi&&(n[e]=t)}(null==i?void 0:i.trim())&&(n[wi]=i.trim());const o=Object.assign({},e);return Object.keys(n).length?o[y]=n:delete o[y],o}function ji(e,t){const i=new Set(t.map(e=>e.domain));return e.filter(e=>!i.has(e))}const Ai=["entities","areas","devices","floors","labels","views"];function Si(e){if(!e||"object"!=typeof e||Array.isArray(e))return;const t=e;if(void 0!==t.template||void 0!==t.range||void 0!==t.with)return;if(void 0!==t.exclude&&"object"==typeof t.exclude&&!Array.isArray(t.exclude))return;const i=Ai.filter(e=>void 0!==t[e]);return i.length>1?void 0:1===i.length?i[0]:b(e)?"entities":void 0}function Oi(e){var t;return void 0!==e.for_each_from?null!==(t=Si(e.for_each_from))&&void 0!==t?t:"other":void 0!==e.for_each?"list":"none"}function Ci(e){if(null==e||!0===e)return;return(Array.isArray(e)?e:[e]).filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>e.trim())}function Ei(e){const t="number"==typeof e?e:"string"==typeof e&&e.trim()?Number(e):NaN;return Number.isFinite(t)?t:void 0}const Ti=["domain","area","floor","label","device_class","integration","exclude"];function Ni(e){if(e&&e.length)return 1===e.length?e[0]:e}function Pi(e,t){var i,s;const a=Object.assign({},null!=e?e:{});a[null!==(i=Si(e))&&void 0!==i?i:"entities"]=!t.patterns||!t.patterns.length||Ni(t.patterns.map(e=>e.trim()).filter(Boolean));for(const l of Ti){const e=Ni(null===(s=t[l])||void 0===s?void 0:s.filter(e=>e.trim()));void 0===e?delete a[l]:a[l]=e}const n=[t.sort,t.then].filter(e=>"string"==typeof e&&""!==e.trim());n.length?a.sort=1===n.length?n[0]:n:delete a.sort,!0===t.reverse?a.reverse=!0:delete a.reverse;const o=Ei(t.limit);void 0===o?delete a.limit:a.limit=o;const r=Ei(t.offset);return void 0===r||0===r?delete a.offset:a.offset=r,"string"==typeof t.group_by&&t.group_by?a.group_by=t.group_by:delete a.group_by,!0===t.entity_category?Array.isArray(a.entity_category)||"string"==typeof a.entity_category||(a.entity_category="all"):delete a.entity_category,a}function Li(e){return e.split(".")[0]}function Ii(e){var t;return[...new Set(Object.keys(null!==(t=null==e?void 0:e.states)&&void 0!==t?t:{}).map(Li))].sort()}function Fi(e){var t,i;const s=new Set;for(const a of Object.values(null!==(t=null==e?void 0:e.states)&&void 0!==t?t:{})){const e=null===(i=null==a?void 0:a.attributes)||void 0===i?void 0:i.device_class;"string"==typeof e&&e&&s.add(e)}return[...s].sort()}function Mi(e){var t;const i=new Set;for(const s of Object.values(null!==(t=null==e?void 0:e.entities)&&void 0!==t?t:{}))"string"==typeof(null==s?void 0:s.platform)&&s.platform&&i.add(s.platform);return[...i].sort()}const Vi=["name","-name","entity","area","floor","domain","entity_count","none"],Hi=["","area","floor","domain","label"];function Di(e,t){return{select:{mode:"dropdown",multiple:!0,custom_value:!0,options:[...e,...(null!=t?t:[]).filter(t=>!e.includes(t))].map(e=>({value:e,label:e}))}}}function qi(e,t){const i=["none","list",...Ai];return"other"===t&&i.push("other"),i.map(t=>({value:t,label:a(`editor.repeat.mode_${t}`,void 0,e)}))}const Ri="variable:";function zi(e,t,i){var s;const n=e&&"object"==typeof e?e:{},o=null!==(s=["areas","devices","floors","labels","views","entities"].find(e=>void 0!==n[e]))&&void 0!==s?s:b(e)?"entities":"items";return a(`editor.matches_${o}_${1===t?"one":"many"}`,void 0,i)}let Ui,Wi;function Bi(e,t){const i=e.indexOf(t);return-1===i?[e,""]:[e.slice(0,i),e.slice(i+t.length)]}const Ki=new Set(["true","yes","on","1"]),Ji=/:host|\.decluttering-container/;class Yi extends m{constructor(){super(...arguments),this._shownAs=new Map,this._loadingTemplates=!1,this._ejectPending=!1,this._sectionsPending=!1,this._previewMode="yaml",this._copied=!1,this._markedLines=[],this._cannotOpen=!1,this._matchesOpen=!1,this._openItems=new Set,this._renderedTemplates={},this._renderingTemplates=new Set}static get styles(){return f`
      .description {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
      }
      .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .hint a {
        color: var(--primary-color);
      }
      ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      ha-expansion-panel,
      decluttering-card-plus-health {
        margin-top: 16px;
      }
      .risks {
        margin: 4px 0 0;
        padding-left: 18px;
      }
      .result {
        padding: 0 8px 8px;
      }
      .result .hint {
        margin: 8px 0;
      }
      .section-per-copy {
        margin-top: 16px;
      }
      .examples {
        margin-bottom: 8px;
      }
      .advanced .count {
        color: var(--secondary-text-color);
        font-size: 0.85em;
        margin-left: 8px;
      }
      .advanced-body {
        padding: 8px 8px 0;
      }
      .preview {
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        padding: 12px 16px;
        margin: 0 0 16px;
        background: var(--card-background-color);
      }
      .preview-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0 0 10px;
      }
      .preview-title {
        flex: 1;
        font-weight: 500;
      }
      .segmented {
        display: inline-flex;
        border: 1px solid var(--divider-color);
        border-radius: 18px;
        overflow: hidden;
      }
      .segmented button {
        border: 0;
        background: transparent;
        color: var(--secondary-text-color);
        font: inherit;
        padding: 6px 14px;
        cursor: pointer;
      }
      .segmented button.on {
        background: rgba(var(--rgb-primary-color), 0.12);
        color: var(--primary-color);
        font-weight: 500;
      }
      .rendered {
        margin: 0 0 8px;
      }
      pre.yaml {
        margin: 0 0 8px;
        padding: 8px 10px;
        border-radius: 8px;
        background: var(--secondary-background-color);
        font-family: var(--ha-font-family-code, monospace);
        font-size: 12.5px;
        line-height: 1.5;
        overflow: auto;
        max-height: 320px;
        -webkit-user-select: text;
        user-select: text;
      }
      pre.yaml .l {
        display: block;
        white-space: pre;
      }
      pre.yaml .l.changed {
        background: rgba(var(--rgb-accent-color, 255, 152, 0), 0.18);
      }
      .preview-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .edit-template {
        margin-left: 6px;
      }
      ha-alert .actions {
        margin-top: 8px;
        display: flex;
        gap: 8px;
      }
      .repeat h3 {
        font-size: 16px;
        font-weight: 500;
        margin: 8px 0 12px;
      }
      .matches-line {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 12px;
        margin: 0 0 12px;
        border-radius: 8px;
        background: rgba(var(--rgb-success-color, 76, 175, 80), 0.12);
      }
      .matches-line ha-svg-icon {
        color: var(--success-color);
      }
      .matches-line span {
        flex: 1;
      }
      .matches {
        margin: -4px 0 12px;
      }
      .items {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .items li {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 2px 6px;
        margin: 0 0 6px;
      }
      .item-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .item-row .handle {
        color: var(--secondary-text-color);
        cursor: grab;
      }
      .item-row .spacer {
        flex: 1;
      }
      .by-domain h3 {
        font-size: 16px;
        font-weight: 500;
        margin: 8px 0 4px;
      }
      .bd-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 12px;
      }
      .bd-row ha-selector {
        flex: 1;
        min-width: 0;
      }
      .bd-row .bd-default {
        flex: 1;
        color: var(--secondary-text-color);
      }
      .bd-row .bd-spacer {
        width: 48px;
      }
    `}set lovelace(e){this._lovelace=e,this._templates=void 0,this._schema=void 0}_editingPlace(){const e=$(this),t=e?w(e):void 0;return null!=t?t:{view:x(this._lovelace)}}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}async connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=k(()=>this.requestUpdate())),await j()}setConfig(e){this._openedWith||(this._openedWith=e,this._resume=function(e,t,i=Date.now()){var s;const a=$i();if(!a)return;let n;try{const e=a.getItem(bi);n=e?JSON.parse(e):void 0}catch(o){n=void 0}if(n)if(i-n.at>18e5)a.removeItem(bi);else if(JSON.stringify(null!==(s=n.openedWith)&&void 0!==s?s:null)===JSON.stringify(null!=e?e:null))return a.removeItem(bi),n}(e)),this._config=e}willUpdate(){var e;if(this.hass&&this._config&&(this._lovelace||(this._lovelace=null!==(e=A())&&void 0!==e?e:void 0),this._lovelace)){if(!this._templates){const e=this._editingPlace();this._templates=S(this._lovelace,e.view,void 0,e.section),this._loadBorrowedTemplates()}this._schema||(this._schema=[{name:"template",label:a("editor.template_label",void 0,this.hass),selector:{select:{mode:"dropdown",custom_value:!0,options:O(this._templates,this.hass)}}},{name:"variables",label:a("editor.variables_label",void 0,this.hass),helper:a("editor.variables_helper",void 0,this.hass),selector:{object:{}}}])}}render(){if(!(this.hass&&this._config&&this._templates&&this._schema))return e``;const t=this._templates[this._config.template],i=C(t),s=this._hiddenNames(t,i),n=i.filter(e=>!s.has(e.name)),o=E(this._config.variables),r=T(this._config),l=!!t&&"card"===N(t)||!!r||void 0!==this._config.for_each||void 0!==this._config.for_each_from,d=this._formData(i),c=mi(t,this._config,d.extras),h={};t||this._loadingTemplates||r&&!this._config.template||(h.template=a("editor.no_such_template",void 0,this.hass)),o||(h.variables=a("error.variables_shape",void 0,this.hass));const p=_(t);return e`
      ${(null==t?void 0:t.description)?e`<p class="description">${t.description}</p>`:e``}
      ${r?this._renderByDomain(r):e``}
      ${void 0===p?e``:e`<ha-alert alert-type="warning">
              ${p?a("editor.template_deprecated_because",{message:p},this.hass):a("editor.template_deprecated",void 0,this.hass)}
            </ha-alert>`}
      ${this._renderResume()} ${this._renderResult(t)} ${this._renderSource(t)}
      ${this._renderStartFromExample(t)} ${this._renderDiagnostics(t,o)}
      <ha-form
        .hass=${this.hass}
        .data=${d}
        .schema=${this._formSchema(n,c,t)}
        .error=${h}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._renderCardVariables(n)} ${this._renderRepeat(l&&!c.repeat,t)}
      ${this._renderLayout(d,l&&!c.repeat,c)} ${this._renderEmptySlot(l)}
      ${this._renderAdvanced(c)} ${this._renderSectionPerCopy()}
      <decluttering-card-plus-health .hass=${this.hass} .lovelace=${this._lovelace}></decluttering-card-plus-health>
    `}_renderAdvanced(t){if(!this._config||t.advanced)return e``;const i=function(e){const t=si(e);let i=0;return void 0===t.grid_columns&&void 0===t.grid_rows||(i+=1),void 0!==t.style&&(i+=1),"show"!==t.on_error_mode&&(i+=1),t.strict&&(i+=1),t.rebuild_on&&(i+=1),"off"!==t.debug&&(i+=1),void 0!==t.name&&(i+=1),t.inherit_variables&&(i+=1),i}(this._config),s=si(this._config),n=this._onErrorMode&&"card"!==s.on_error_mode?Object.assign(Object.assign({},s),{on_error_mode:this._onErrorMode}):s;"card"===s.on_error_mode&&this._onErrorMode&&(this._onErrorMode=void 0);const o=ni(this._config),r=Zt(vi);return e`
      <ha-expansion-panel outlined class="advanced">
        <span slot="header">
          ${a("editor.advanced.header",void 0,this.hass)}
          <span class="count">
            ${0===i?"":1===i?a("editor.advanced.count_one",void 0,this.hass):a("editor.advanced.count_many",{count:i},this.hass)}
          </span>
        </span>
        <div class="advanced-body">
          <ha-form
            .hass=${this.hass}
            .data=${n}
            .schema=${function(e,t){return t.length?e.filter(e=>!t.includes(null==e?void 0:e.name)):e}(function(e){const t=t=>a(t,void 0,e),i=(e,i)=>e.map(e=>({value:e,label:/^\d+$/.test(e)?e:t(`${i}${e}`)}));return[{name:"grid_columns",label:t("editor.advanced.grid_columns_label"),helper:t("editor.advanced.grid_helper"),selector:{select:{mode:"dropdown",custom_value:!0,options:i(ri,"editor.advanced.grid_")}}},{name:"grid_rows",label:t("editor.advanced.grid_rows_label"),selector:{select:{mode:"dropdown",custom_value:!0,options:i(li,"editor.advanced.grid_")}}},{name:"style",label:t("editor.advanced.style_label"),helper:t("editor.advanced.style_helper"),selector:{text:{multiline:!0}}},{name:"on_error_mode",label:t("editor.advanced.on_error_label"),helper:t("editor.advanced.on_error_helper"),selector:{select:{mode:"dropdown",options:[{value:"show",label:t("editor.advanced.on_error_show")},{value:"hide",label:t("editor.advanced.on_error_hide")},{value:"card",label:t("editor.advanced.on_error_card")}]}}},{name:"strict",label:t("editor.advanced.strict_label"),helper:t("editor.advanced.strict_helper"),selector:{boolean:{}}},{name:"rebuild_on",label:t("editor.advanced.rebuild_on_label"),helper:t("editor.advanced.rebuild_on_helper"),selector:{entity:{multiple:!0}}},{name:"debug",label:t("editor.advanced.debug_label"),helper:t("editor.advanced.debug_helper"),selector:{select:{mode:"dropdown",options:[{value:"off",label:t("editor.advanced.debug_off")},{value:"json",label:t("editor.advanced.debug_json")},{value:"yaml",label:t("editor.advanced.debug_yaml")},{value:"console",label:t("editor.advanced.debug_console")},{value:"report",label:t("editor.advanced.debug_report")}]}}},{name:"name",label:t("editor.advanced.name_label"),helper:t("editor.advanced.name_helper"),selector:{text:{}}},{name:"inherit_variables",label:t("editor.advanced.inherit_label"),helper:t("editor.advanced.inherit_helper"),selector:{boolean:{}}}]}(this.hass),t.advancedFields)}
            .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
            .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
            @value-changed=${this._advancedChanged}
          ></ha-form>
          ${"card"===n.on_error_mode?Qt`<${r}
                  .hass=${this.hass}
                  .lovelace=${this._lovelace}
                  .value=${o}
                  .label=${a("editor.advanced.fallback_label",void 0,this.hass)}
                  .emptyHint=${a("editor.advanced.fallback_hint",void 0,this.hass)}
                  @value-changed=${this._fallbackChanged}
                ></${r}>`:e``}
        </div>
      </ha-expansion-panel>
    `}_advancedChanged(e){if(e.stopPropagation(),!this._config)return;const t=e.detail.value;this._onErrorMode="card"!==t.on_error_mode||ni(this._config)?void 0:"card",g(this,"config-changed",{config:ai(this._config,t)})}_fallbackChanged(e){e.stopPropagation(),this._config&&(e.detail.value&&(this._onErrorMode=void 0),g(this,"config-changed",{config:oi(this._config,e.detail.value)}))}_renderEmptySlot(t){if(!this._config||!t)return e``;if(!(void 0!==this._config.for_each||void 0!==this._config.for_each_from||void 0!==this._config.empty))return e``;const i=Zt(vi),s=this._config.empty;return Qt`<${i}
      .hass=${this.hass}
      .lovelace=${this._lovelace}
      .value=${s&&"object"==typeof s?s:void 0}
      .label=${a("editor.empty_label",void 0,this.hass)}
      .emptyHint=${a("editor.empty_slot_hint",void 0,this.hass)}
      @value-changed=${this._emptyChanged}
    ></${i}>`}_emptyChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);P(t,"empty",e.detail.value),g(this,"config-changed",{config:t})}_renderStartFromExample(t){const i=L(t);return i.length&&this._config&&!I(this._config.variables).length?e`
      <div class="examples">
        <p class="hint">${a("editor.start_from_example_hint",void 0,this.hass)}</p>
        ${i.map((t,i)=>e`
            <ha-button @click=${()=>this._startFromExample(t)}>
              ${a("editor.start_from_example",{number:i+1},this.hass)}
            </ha-button>
          `)}
      </div>
    `:e``}_startFromExample(e){e.length&&g(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{variables:e})})}_renderByDomain(t){var i,s;if(!this._config)return e``;if(!function(e){const t=xi(e);return!t||Object.values(t).every(e=>"string"==typeof e)}(this._config))return e`<ha-alert alert-type="info">
        ${a("editor.by_domain_hint",{templates:Object.entries(t).map(([e,t])=>`${e}: ${t}`).join(", ")},this.hass)}
      </ha-alert>`;const{rows:n,fallback:o}=function(e){var t;const i=null!==(t=xi(e))&&void 0!==t?t:{};return{rows:Object.entries(i).filter(([e,t])=>e!==wi&&"string"==typeof t).map(([e,t])=>({domain:e,template:t})),fallback:"string"==typeof i[wi]?i[wi]:void 0}}(this._config),r=null!==(i=this._byDomainDraft)&&void 0!==i?i:n,l=function(e,t){return Object.keys(e).filter(t=>{return!!(i=e[t])&&(void 0!==i.card||void 0!==i.group);var i}).sort().map(i=>({value:i,label:void 0!==_(e[i])?i+a("editor.deprecated_suffix",void 0,t):i}))}(null!==(s=this._templates)&&void 0!==s?s:{},this.hass),d=Ii(this.hass),c=(e,t)=>{const i=e.every(e=>{var t,i;return(null===(t=e.domain)||void 0===t?void 0:t.trim())&&(null===(i=e.template)||void 0===i?void 0:i.trim())});this._byDomainDraft=i?void 0:e,g(this,"config-changed",{config:ki(this._config,e,t)})};return e`
      <div class="by-domain">
        <h3>${a("editor.by_domain.header",void 0,this.hass)}</h3>
        <p class="hint">${a("editor.by_domain.hint",void 0,this.hass)}</p>
        ${r.map((t,i)=>{return e`
            <div class="bd-row">
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",custom_value:!0,options:(s=t.domain,[...new Set([s,...d])].filter(Boolean).map(e=>({value:e,label:e})))}}}
                .value=${t.domain}
                .label=${a("editor.by_domain.domain",void 0,this.hass)}
                @value-changed=${e=>{e.stopPropagation(),c(r.map((t,s)=>{var a;return s===i?Object.assign(Object.assign({},t),{domain:String(null!==(a=e.detail.value)&&void 0!==a?a:"")}):t}),null!=o?o:"")}}
              ></ha-selector>
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",options:l}}}
                .value=${t.template}
                .label=${a("editor.by_domain.template",void 0,this.hass)}
                @value-changed=${e=>{e.stopPropagation(),c(r.map((t,s)=>{var a;return s===i?Object.assign(Object.assign({},t),{template:String(null!==(a=e.detail.value)&&void 0!==a?a:"")}):t}),null!=o?o:"")}}
              ></ha-selector>
              <ha-icon-button
                .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                .label=${a("editor.by_domain.remove",{domain:t.domain},this.hass)}
                @click=${()=>c(r.filter((e,t)=>t!==i),null!=o?o:"")}
              ></ha-icon-button>
            </div>
          `;var s})}
        <div class="bd-row">
          <span class="bd-default">${a("editor.by_domain.anything_else",void 0,this.hass)}</span>
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:l}}}
            .value=${null!=o?o:""}
            .label=${a("editor.by_domain.template",void 0,this.hass)}
            @value-changed=${e=>{var t;e.stopPropagation(),c(r,String(null!==(t=e.detail.value)&&void 0!==t?t:""))}}
          ></ha-selector>
          <span class="bd-spacer"></span>
        </div>
        <ha-button
          @click=${()=>{var e;return c([...r,{domain:null!==(e=ji(d,r)[0])&&void 0!==e?e:"",template:""}],null!=o?o:"")}}
        >
          ${a("editor.by_domain.add",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderCardVariables(t){var i;const s=t.filter(e=>F(e));if(!s.length)return e``;const n=o(null===(i=this._config)||void 0===i?void 0:i.variables);return e`${s.map(t=>{var i;const s=n[t.name],o=!!s&&"object"==typeof s;return e`
        <div class="card-variable">
          <h3>${null!==(i=t.label)&&void 0!==i?i:t.name}</h3>
          ${t.description?e`<p class="hint">${t.description}</p>`:e``}
          ${o?e`
                  <hui-card-element-editor
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    .value=${s}
                    @config-changed=${e=>this._cardVariableChanged(t.name,e)}
                  ></hui-card-element-editor>
                  <ha-button @click=${()=>this._cardVariableChanged(t.name)}>
                    ${a("editor.card_variable_clear",void 0,this.hass)}
                  </ha-button>
                `:e`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    @config-changed=${e=>this._cardVariableChanged(t.name,e)}
                  ></hui-card-picker>
                `}
        </div>
      `})}`}_registryItemsForPreview(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.for_each_from;if(!this.hass||!b(t))return;const i=M(t);if(void 0===i||Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))try{const e=V(this.hass,t,Object.assign(Object.assign({},H(this._lovelace)),{rendered:this._renderedTemplates}));return e.length?e:void 0}catch(s){return}}_cardVariableChanged(e,t){var i,s;null==t||t.stopPropagation();const a=null===(i=null==t?void 0:t.detail)||void 0===i?void 0:i.config,n=I(null===(s=this._config)||void 0===s?void 0:s.variables).filter(t=>D(t)!==e);a&&"object"==typeof a&&n.push({[e]:a});const o=Object.assign({},this._config);n.length?o.variables=n:delete o.variables,g(this,"config-changed",{config:o})}_renderResult(t){var s,n,o;if(!this._config)return e``;const r=null!==(s=q(this._config.for_each))&&void 0!==s?s:this._registryItemsForPreview();let l=(null==r?void 0:r.length)?R(r[0],this._config.variables,0,r.length):this._config.variables,c=t,h=this._config.template;if(T(this._config))try{const e=null!==(n=this._templates)&&void 0!==n?n:{};let t;({template:c,name:h,entity:t}=z(this._config,l,t=>e[t],this.hass,Object.keys(e))),l=U(l,t)}catch(S){return e``}if(!c)return e``;const p=N(c);if(!p)return e``;const u=W(c);let m;const f=performance.now();try{const e=B(this.hass,i(this._config.rebuild_on)),t=null!==(o=this._lovelace)&&void 0!==o?o:A();m=K(d(l,c,u,h,e,!0,void 0,0,void 0,void 0,!1,{itemTemplates:J(t),context:H(t)}),this._config,p)}catch(O){return e`<ha-alert alert-type="warning">
        ${a("editor.result_error",{error:String(O)},this.hass)}
      </ha-alert>`}const g=performance.now(),v=(null==r?void 0:r.length)?a("editor.result_copies",{total:r.length},this.hass):"",[_,y]=Bi(a("editor.result_hint",{kind:p},this.hass),"[[name]]"),$=Y(m);$!==this._lastYaml&&(this._markedLines=function(e,t){const i=""===t?[]:t.replace(/\n$/,"").split("\n");if(void 0===e)return i.map(e=>({text:e,changed:!1}));const s=new Set(e.replace(/\n$/,"").split("\n"));return i.map(e=>({text:e,changed:!s.has(e)}))}(this._lastYaml,$),this._lastYaml=$);const w=void 0!==this._editingPlace().section?"grid":void 0,x=function(e){return"card"===e?["rendered","yaml"]:["yaml"]}(p),k=x.includes(this._previewMode)?this._previewMode:"yaml",j=!(null==r?void 0:r.length)&&!b(this._config.for_each_from)&&m&&"object"==typeof m;return e`
      <div class="preview">
        <div class="preview-head">
          <span class="preview-title">${a("editor.preview.header",void 0,this.hass)}${v}</span>
          ${x.length>1?e`<div class="segmented" role="group">
                  ${x.map(t=>e`<button
                        type="button"
                        class=${t===k?"on":""}
                        aria-pressed=${t===k?"true":"false"}
                        @click=${()=>{this._previewMode=t}}
                      >
                        ${a(`editor.preview.${t}`,void 0,this.hass)}
                      </button>`)}
                </div>`:e``}
        </div>
        ${"rendered"===k?e`<div class="rendered">
                <hui-card .hass=${this.hass} .config=${m} .preview=${!0} .layout=${w}></hui-card>
              </div>`:e`<pre class="yaml">
${this._markedLines.map(t=>e`<span class="l ${t.changed?"changed":""}">${t.text}</span>`)}</pre>`}
        <p class="hint">
          ${a("editor.preview.built_in",{time:yi(f,g),template:null!=h?h:""},this.hass)}
          ${"yaml"===k?a("editor.preview.changed_hint",void 0,this.hass):""}
        </p>
        <p class="hint">${_}<code>[[name]]</code>${y}</p>
        <div class="preview-actions">
          ${"yaml"===k?e`<ha-button @click=${()=>this._copyYaml($)}>
                  ${a(this._copied?"editor.preview.copied":"editor.preview.copy",void 0,this.hass)}
                </ha-button>`:e``}
          ${j?e`
                  <ha-button @click=${()=>this._eject(m)}>
                    ${a(this._ejectPending?"editor.eject_confirm":"editor.eject",void 0,this.hass)}
                  </ha-button>
                `:e``}
        </div>
      </div>
    `}_copyYaml(e){Z(e).then(e=>{this._copied=e,e&&setTimeout(()=>this._copied=!1,1500)})}_renderResume(){const t=this._resume;return t?e`<ha-alert alert-type="info">
      ${a("editor.link.resume",{template:t.template},this.hass)}
      <div class="actions">
        <ha-button
          @click=${()=>{this._resume=void 0,g(this,"config-changed",{config:t.config})}}
        >
          ${a("editor.link.resume_button",void 0,this.hass)}
        </ha-button>
        <ha-button
          @click=${()=>{this._resume=void 0}}
        >
          ${a("editor.link.discard_button",void 0,this.hass)}
        </ha-button>
      </div>
    </ha-alert>`:e``}_openTemplate(e){var t,i,s,a;const n=G(),o=function(e,t){var i,s;const a=null==e?void 0:e.views;if(!Array.isArray(a))return;const n=e=>!!e&&v(e.type)&&e.template===t;for(let o=0;o<a.length;o+=1){const e=null!==(i=a[o])&&void 0!==i?i:{},t=Array.isArray(e.cards)?e.cards:[];for(let i=0;i<t.length;i+=1)if(n(t[i]))return[o,i];const r=Array.isArray(e.sections)?e.sections:[];for(let i=0;i<r.length;i+=1){const e=Array.isArray(null===(s=r[i])||void 0===s?void 0:s.cards)?r[i].cards:[];for(let t=0;t<e.length;t+=1)if(n(e[t]))return[o,i,t]}}}(null!==(t=null==n?void 0:n.config)&&void 0!==t?t:this._lovelace,e);if(!n||!o)return void(this._cannotOpen=!0);this._config&&function(e,i,s=Date.now()){const a=$i();if(a)try{a.setItem(bi,JSON.stringify(Object.assign(Object.assign({},e),{at:s})))}catch(t){}}({config:this._config,openedWith:this._openedWith,template:e});const r=function(e,t){var i,s,a,n,o;const r=null===(i=null==e?void 0:e.views)||void 0===i?void 0:i[t[0]];if(!r)return;const l=3===t.length?null===(n=null===(a=null===(s=r.sections)||void 0===s?void 0:s[t[1]])||void 0===a?void 0:a.cards)||void 0===n?void 0:n[t[2]]:null===(o=r.cards)||void 0===o?void 0:o[t[1]];return l&&"object"==typeof l?l:void 0}(n.config,o),l=null!==(i=document.querySelector("home-assistant"))&&void 0!==i?i:document.body,d=()=>{g(l,"show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>Promise.resolve(),dialogParams:{lovelaceConfig:n.config,cardConfig:r,saveCardConfig:e=>n.saveConfig(r?ie(n.config,r,e):n.config),saveConfig:e=>n.saveConfig(e),path:o}})},c=$(this);if(!c)return void d();this._config&&(null===(s=c._discardDirtyStateChanges)||void 0===s||s.call(c),"_dirty"in c&&(c._dirty=!1));let h=!1;const p=()=>{h||(h=!0,setTimeout(d,0))};c.addEventListener("dialog-closed",p,{once:!0});!1!==(null===(a=c.closeDialog)||void 0===a?void 0:a.call(c))&&setTimeout(p,400)}_renderSectionPerCopy(){var t;const i=null===(t=G())||void 0===t?void 0:t.config;return this._config&&i&&Q(i,this._config)?e`
      <div class="section-per-copy">
        <p class="hint">${a("editor.section_per_copy_hint",void 0,this.hass)}</p>
        ${this._sectionsError?e`<ha-alert alert-type="error">${this._sectionsError}</ha-alert>`:e``}
        <ha-button @click=${this._sectionPerCopy}>
          ${a(this._sectionsPending?"editor.section_per_copy_confirm":"editor.section_per_copy",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}async _sectionPerCopy(){var e,t;if(!this._sectionsPending)return void(this._sectionsPending=!0);this._sectionsPending=!1;const i=G(),s=this._config;if(!i||!s)return;try{await X(this,this.hass,"section_per_copy",[{urlPath:te(),build:e=>ee(e,s)}])}catch(o){return void(this._sectionsError=a("tools.save_failed",{message:null!==(e=null==o?void 0:o.message)&&void 0!==e?e:o},this.hass))}let n=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;for(;n&&"hui-dialog-edit-card"!==n.localName;)n=n.parentNode instanceof ShadowRoot?n.parentNode.host:n.parentNode;null===(t=null==n?void 0:n.closeDialog)||void 0===t||t.call(n)}_eject(e){this._ejectPending?(this._ejectPending=!1,this._holdEjectUndo(e),g(this,"config-changed",{config:e})):this._ejectPending=!0}_holdEjectUndo(e){const t=G();if(!t||!this._openedWith)return;const i=ie(t.config,this._openedWith,e);i!==t.config&&se({operation:"eject",at:Date.now(),dashboards:[{urlPath:te(),before:t.config,after:i}]})}_renderSource(t){var i;const s=null===(i=this._config)||void 0===i?void 0:i.template;if(!s||!t||this._loadingTemplates)return e``;const n=ae(this._lovelace,s);if(!n){const t=ne(s);return e`<p class="hint">
        ${a("editor.source_borrowed",void 0,this.hass)}
        ${t?e`<a href=${o=t,`/${o.replace(/^\/+/,"")}`} target="_blank" rel="noreferrer"
                >${a("editor.link.open_dashboard",void 0,this.hass)}</a
              >`:e``}
      </p>`}var o;if(n.declared||!n.view)return e`<p class="hint">
        ${a("editor.source_declared",void 0,this.hass)}
        ${a("editor.link.raw_editor",void 0,this.hass)}
      </p>`;const{view:r}=n,l=document.location.pathname.split("/").slice(0,2).join("/"),[d,c]=Bi(a("editor.source_view",{view:""},this.hass),"");return e`<p class="hint">
      ${d}<a href=${`${l}/${r.path||r.index}`} target="_blank" rel="noreferrer"
        >${r.title||r.path||a("editor.untitled_view",void 0,this.hass)}</a
      >${c}
      <a
        href="#"
        class="edit-template"
        @click=${e=>{e.preventDefault(),this._openTemplate(s)}}
        >${a("editor.link.edit_template",void 0,this.hass)}</a
      >
      ${this._cannotOpen?e`<br />${a("editor.link.cannot_open",void 0,this.hass)}`:e``}
    </p>`}_filledSource(e){var t,i;return oe(null===(t=this._config)||void 0===t?void 0:t.for_each_from,null===(i=this._config)||void 0===i?void 0:i.variables,e,this.hass)}_renderedTemplateNames(e){const t=this._filledSource(e),i=M(t);if(!this.hass||void 0===i)return[];if(!Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))return[];const s=new Set,a=V(this.hass,t,{rendered:this._renderedTemplates});for(const n of a)for(const e of Object.keys(n))s.add(e);return[...s]}_renderEditorTemplate(e){this.hass&&!this._renderingTemplates.has(e)&&(this._renderingTemplates.add(e),re(this.hass,e).then(t=>{this._renderingTemplates.delete(e),this._renderedTemplates=Object.assign(Object.assign({},this._renderedTemplates),{[e]:t})}))}_renderMatches(t){var i,s;if(!this.hass||!b(null===(i=this._config)||void 0===i?void 0:i.for_each_from))return e``;const n=this._filledSource(t);le(n)&&!de()&&ce(this.hass).then(()=>this.requestUpdate());const o=M(n);if(void 0!==o){const t=Object.prototype.hasOwnProperty.call(this._renderedTemplates,o)?this._renderedTemplates[o]:void 0;if(!t)return this._renderEditorTemplate(o),e`<p class="hint">${a("editor.matches_template_pending",void 0,this.hass)}</p>`;const i=he(t);if(!("list"in i)){const t="error"===i.problem?"editor.matches_template_failed":"editor.matches_template_not_list";return e`<ha-alert alert-type="warning"> ${a(t,{detail:i.detail},this.hass)} </ha-alert>`}}let r=[];try{r=V(this.hass,n,Object.assign(Object.assign({},H(this._lovelace)),{rendered:this._renderedTemplates}))}catch(d){return e``}if(!r.length)return e`<ha-alert alert-type="warning">
        ${a("editor.matches_none",{but:(null===(s=this._config)||void 0===s?void 0:s.empty)?a("editor.matches_none_but_empty",void 0,this.hass):""},this.hass)}
      </ha-alert>`;const l=r.slice(0,12);return e`
      <div class="matches-line">
        <ha-svg-icon .path=${"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}></ha-svg-icon>
        <span>
          ${1===r.length?a("editor.matches_header_one",{what:zi(n,1,this.hass)},this.hass):a("editor.matches_header_many",{count:r.length,what:zi(n,r.length,this.hass)},this.hass)}
        </span>
        <ha-button
          @click=${()=>{this._matchesOpen=!this._matchesOpen}}
        >
          ${a(this._matchesOpen?"editor.repeat.matches_hide":"editor.repeat.matches_show",void 0,this.hass)}
        </ha-button>
      </div>
      ${this._matchesOpen?e`<div class="matches">
              <ul>
                ${l.map((t,i)=>e`<li>${pe(t,i)}</li>`)}
              </ul>
              ${r.length>l.length?e`<p class="hint">
                      ${a("editor.matches_more",{count:r.length-l.length},this.hass)}
                    </p>`:e``}
              <p class="hint">
                ${a(void 0===o?"editor.matches_hint":"editor.matches_template_hint",void 0,this.hass)}
              </p>
            </div>`:e``}
    `}_suppliedNames(e){var t,i,s;return[...me(null===(t=this._config)||void 0===t?void 0:t.for_each),...fe(null===(i=this._config)||void 0===i?void 0:i.for_each_from),...b(null===(s=this._config)||void 0===s?void 0:s.for_each_from)?ue:[],...e?this._renderedTemplateNames(e):[]]}_renderRepeat(t,i){if(!this._config||!t)return e``;const s=Oi(this._config),n=[{name:"mode",label:a("editor.repeat.mode_label",void 0,this.hass),helper:a("editor.repeat.mode_helper",void 0,this.hass),selector:{select:{mode:"dropdown",options:qi(this.hass,s)}}}];return e`
      <div class="repeat">
        <h3>${a("editor.repeat.header",void 0,this.hass)}</h3>
        <ha-form
          .hass=${this.hass}
          .data=${{mode:s}}
          .schema=${n}
          .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
          .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
          @value-changed=${this._repeatModeChanged}
        ></ha-form>
        ${"list"===s?this._renderRepeatList():"other"===s?this._renderOtherSource(i):"none"===s?e``:this._renderRepeatBuilder(i)}
      </div>
    `}_renderLayout(t,i,s){const n=[...i?(null!=Ui||(Ui=[{name:"gap",label:a("editor.gap_label"),helper:a("editor.gap_helper"),selector:{number:{min:0,max:64,mode:"box"}}},{name:"columns",label:a("editor.columns_label"),helper:a("editor.columns_helper"),selector:{number:{min:1,max:6,mode:"box"}}},{name:"min_column_width",label:a("editor.min_column_width_label"),helper:a("editor.min_column_width_helper"),selector:{number:{min:50,max:1e3,step:10,mode:"box"}}},{name:"lazy",label:a("editor.lazy_label"),helper:a("editor.lazy_helper"),selector:{boolean:{}}},{name:"lazy_eager",label:a("editor.lazy_eager_label"),helper:a("editor.lazy_eager_helper"),selector:{number:{min:0,max:100,mode:"box"}}}]),Ui):[],...s.fit?[]:(null!=Wi||(Wi=[{name:"fit",label:a("editor.fit_label"),helper:a("editor.fit_helper"),selector:{select:{mode:"dropdown",options:[{value:"box",label:a("editor.fit_box")},{value:"contents",label:a("editor.fit_contents")}]}}}]),Wi)];return n.length?e`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${n}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:e``}_repeatModeChanged(e){var t;if(e.stopPropagation(),!this._config)return;const i=null===(t=e.detail.value)||void 0===t?void 0:t.mode;if(!i)return;const s=function(e,t){if(Oi(e)===t||"other"===t)return e;const i=Object.assign({},e);if(delete i.for_each,delete i.for_each_from,"list"===t)i.for_each=[];else if("none"!==t){const s=Si(e.for_each_from)?Object.assign({},e.for_each_from):{};for(const e of Ai)delete s[e];i.for_each_from=Object.assign({[t]:!0},s)}return i}(this._config,i);s!==this._config&&g(this,"config-changed",{config:s})}_renderRepeatBuilder(t){var i;const s=null===(i=this._config)||void 0===i?void 0:i.for_each_from,n=Si(s);if(!n)return e``;const o=function(e){var t,i,s;const a=null!=e?e:{},n={patterns:null!==(i=Ci(a[null!==(t=Si(e))&&void 0!==t?t:"entities"]))&&void 0!==i?i:[],reverse:!0===a.reverse,entity_category:!1};for(const c of Ti){const e=Ci(a[c]);e&&e.length&&(n[c]=e)}const o=null!==(s=Ci(a.sort))&&void 0!==s?s:[];o[0]&&(n.sort=o[0]),o[1]&&(n.then=o[1]);const r=Ei(a.limit);void 0!==r&&(n.limit=r);const l=Ei(a.offset);void 0!==l&&(n.offset=l),"string"==typeof a.group_by&&a.group_by&&(n.group_by=a.group_by);const d=a.entity_category;return n.entity_category=!0===d||"all"===d||"string"==typeof d&&!!d||Array.isArray(d)&&d.length>0,n}(s);return e`
      <ha-form
        .hass=${this.hass}
        .data=${o}
        .schema=${function(e,t,i){const s=t=>a(t,void 0,e),n=e=>({select:{mode:"dropdown",custom_value:!0,options:[...Vi,...e&&!Vi.includes(e)?[e]:[]].map(e=>({value:e,label:Vi.includes(e)?s(`editor.repeat.sort_${e.replace("-","desc_")}`):e}))}}),o="entities"===t,r="areas"===t,l="devices"===t;return[{name:"patterns",label:s(`editor.repeat.patterns_${t}`),helper:s("editor.repeat.patterns_helper"),selector:Di([],null==i?void 0:i.patterns)},o&&{name:"domain",label:s("editor.repeat.domain_label"),selector:Di(Ii(e),null==i?void 0:i.domain)},(o||l)&&{name:"area",label:s("editor.repeat.area_label"),selector:{area:{multiple:!0}}},(o||r||l)&&{name:"floor",label:s("editor.repeat.floor_label"),selector:{floor:{multiple:!0}}},(o||r||l)&&{name:"label",label:s("editor.repeat.label_label"),selector:{label:{multiple:!0}}},o&&{name:"device_class",label:s("editor.repeat.device_class_label"),selector:Di(Fi(e),null==i?void 0:i.device_class)},o&&{name:"integration",label:s("editor.repeat.integration_label"),selector:Di(Mi(e),null==i?void 0:i.integration)},{name:"exclude",label:s("editor.repeat.exclude_label"),helper:s("editor.repeat.exclude_helper"),selector:o?{entity:{multiple:!0}}:Di([],null==i?void 0:i.exclude)},{name:"sort",label:s("editor.repeat.sort_label"),selector:n(null==i?void 0:i.sort)},{name:"then",label:s("editor.repeat.then_label"),selector:n(null==i?void 0:i.then)},{name:"reverse",label:s("editor.repeat.reverse_label"),selector:{boolean:{}}},{name:"limit",label:s("editor.repeat.limit_label"),selector:{number:{min:0,max:500,mode:"box"}}},{name:"offset",label:s("editor.repeat.offset_label"),helper:s("editor.repeat.offset_helper"),selector:{number:{min:0,max:500,mode:"box"}}},o&&{name:"group_by",label:s("editor.repeat.group_by_label"),helper:s("editor.repeat.group_by_helper"),selector:{select:{mode:"dropdown",options:Hi.map(e=>({value:e,label:s(`editor.repeat.group_${e||"none"}`)}))}}},o&&{name:"entity_category",label:s("editor.repeat.entity_category_label"),helper:s("editor.repeat.entity_category_helper"),selector:{boolean:{}}}].filter(e=>!1!==e)}(this.hass,n,o)}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._repeatBuilderChanged}
      ></ha-form>
      ${this._renderMatches(t)}
    `}_repeatBuilderChanged(e){if(e.stopPropagation(),!this._config||void 0===Si(this._config.for_each_from))return;const t=Object.assign(Object.assign({},this._config),{for_each_from:Pi(this._config.for_each_from,e.detail.value)});g(this,"config-changed",{config:t})}_renderOtherSource(t){var i;return e`
      <p class="hint">${a("editor.repeat.other_hint",void 0,this.hass)}</p>
      <ha-yaml-editor
        .hass=${this.hass}
        .defaultValue=${null===(i=this._config)||void 0===i?void 0:i.for_each_from}
        @value-changed=${this._otherSourceChanged}
      ></ha-yaml-editor>
      ${this._renderMatches(t)}
    `}_otherSourceChanged(e){var t;if(e.stopPropagation(),!this._config||!1===(null===(t=e.detail)||void 0===t?void 0:t.isValid))return;const i=Object.assign({},this._config);P(i,"for_each_from",e.detail.value),g(this,"config-changed",{config:i})}_listItems(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.for_each;return Array.isArray(t)?t:t&&"object"==typeof t?[t]:[]}_setList(e){this._config&&g(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{for_each:e})})}_renderRepeatList(){const t=this._listItems(),i=(e,t)=>function(e){var t,i;const s=Array.isArray(e)?Object.assign({},...e.filter(e=>e&&"object"==typeof e)):e&&"object"==typeof e?e:{},a=e=>"string"==typeof e&&e.trim()?e.trim():void 0,n=Object.values(s).find(e=>"string"==typeof e&&e.trim());return null!==(i=null!==(t=a(s.name))&&void 0!==t?t:a(s.entity))&&void 0!==i?i:"string"==typeof n?n.trim():""}(e)||a("editor.repeat.list_item",{number:t+1},this.hass),s=(e,i)=>{e.preventDefault();const s=this._dragging;this._dragging=void 0,void 0!==s&&s!==i&&this._setList(ge(t,s,i))};return e`
      <p class="hint">${a("editor.repeat.list_hint",void 0,this.hass)}</p>
      <ul class="items">
        ${t.map((n,o)=>e`
            <li
              draggable="true"
              @dragstart=${e=>{var t;this._dragging=o,null===(t=e.dataTransfer)||void 0===t||t.setData("text/plain",i(n,o)),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}}
              @dragover=${e=>{void 0!==this._dragging&&e.preventDefault()}}
              @drop=${e=>s(e,o)}
              @dragend=${()=>{this._dragging=void 0}}
            >
              <div class="item-row">
                <ha-svg-icon class="handle" .path=${"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"}></ha-svg-icon>
                <span class="item-name">${i(n,o)}</span>
                <span class="spacer"></span>
                <ha-icon-button
                  .path=${"M7,15L12,10L17,15H7Z"}
                  .disabled=${0===o}
                  .label=${a("editor.repeat.move_up",{name:i(n,o)},this.hass)}
                  @click=${()=>this._setList(ge(t,o,o-1))}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M7,10L12,15L17,10H7Z"}
                  .disabled=${o===t.length-1}
                  .label=${a("editor.repeat.move_down",{name:i(n,o)},this.hass)}
                  @click=${()=>this._setList(ge(t,o,o+1))}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"}
                  .label=${a("editor.repeat.list_edit",{name:i(n,o)},this.hass)}
                  @click=${()=>this._toggleItem(o)}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                  .label=${a("editor.repeat.list_remove",{name:i(n,o)},this.hass)}
                  @click=${()=>this._setList(function(e,t){return e.filter((e,i)=>i!==t)}(t,o))}
                ></ha-icon-button>
              </div>
              ${this._openItems.has(o)?e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${n}
                      @value-changed=${e=>{var i;e.stopPropagation(),!1!==(null===(i=e.detail)||void 0===i?void 0:i.isValid)&&this._setList(function(e,t,i){return e.map((e,s)=>s===t?i:e)}(t,o,e.detail.value))}}
                    ></ha-yaml-editor>`:e``}
            </li>
          `)}
      </ul>
      <ha-button @click=${()=>this._setList(function(e){const t=e[e.length-1],i=t&&"object"==typeof t&&!Array.isArray(t)?Object.keys(t):[],s={};for(const a of i.length?i:["entity"])s[a]="";return[...e,s]}(t))}>
        ${a("editor.repeat.list_add",void 0,this.hass)}
      </ha-button>
    `}_toggleItem(e){const t=new Set(this._openItems);t.has(e)?t.delete(e):t.add(e),this._openItems=t}_hiddenNames(e,t){var i;const s=new Set;if(!t.some(e=>void 0!==e.show_if||void 0!==e.hide_if))return s;const a=o(r(null===(i=this._config)||void 0===i?void 0:i.variables,e)),n=e=>a[e];for(const o of t)ve(o,n)||s.add(o.name);return s}_formSchema(e,t,i){if(!e.length)return this._schema;const s=new Set(this._suppliedNames(i)),n=e=>{var t;const i=s.has(e.name);return{name:Ri+e.name,label:null!==(t=e.label)&&void 0!==t?t:e.name,helper:i?a("editor.repeat.from_each_copy_helper",void 0,this.hass):e.description,selector:ye(e),required:!0===e.required&&!i,disabled:i}},o=[];for(const a of _e(e.filter(e=>!F(e))))void 0===a.group?o.push(...a.declarations.map(n)):o.push({name:"",type:"expandable",title:a.group,schema:a.declarations.map(n)});return[this._schema[0],...o,...t.extras?[]:[{name:"extras",label:a("editor.extras_label",void 0,this.hass),helper:a("editor.extras_helper",void 0,this.hass),selector:{object:{}}}]]}_formData(e){var t,i,s,a,n,l,d,c,h,p,u,m;if(!e.length)return this._config;const f=o(null===(t=this._config)||void 0===t?void 0:t.variables),g=new Set(e.map(e=>e.name)),v={template:null===(i=this._config)||void 0===i?void 0:i.template};this._shownAs=new Map;const _=function(e,t,i,s){const a=new Map;if(!i||!e.length)return a;const n=o(r(t,i));for(const o of e){if(!(o in n))continue;const e=fi(n[o],t,i,s);null!=e&&""!==e&&a.set(o,e)}return a}(e.filter(e=>!(e.name in f)&&!F(e)).map(e=>e.name),null===(s=this._config)||void 0===s?void 0:s.variables,null===(a=this._templates)||void 0===a?void 0:a[null===(n=this._config)||void 0===n?void 0:n.template],this.hass);for(const o of e){if(!(o.name in f)){if(!_.has(o.name))continue;let e=_.get(o.name);"boolean"in ye(o)&&"boolean"!=typeof e&&(e=Ki.has(String(e).trim().toLowerCase())),this._shownAs.set(o.name,{shown:e,written:void 0}),v[Ri+o.name]=e;continue}const e=f[o.name];if("boolean"!=typeof e&&"boolean"in ye(o)){const t=Ki.has(String(e).trim().toLowerCase());this._shownAs.set(o.name,{shown:t,written:e}),v[Ri+o.name]=t}else v[Ri+o.name]=e}const y=I(null===(l=this._config)||void 0===l?void 0:l.variables).filter(e=>{const t=D(e);return void 0!==t&&!g.has(t)});return y.length&&(v.extras=y),void 0!==(null===(d=this._config)||void 0===d?void 0:d.columns)&&(v.columns=this._config.columns),void 0!==(null===(c=this._config)||void 0===c?void 0:c.min_column_width)&&(v.min_column_width=this._config.min_column_width),void 0!==(null===(h=this._config)||void 0===h?void 0:h.gap)&&(v.gap=this._config.gap),void 0!==(null===(p=this._config)||void 0===p?void 0:p.fit)&&(v.fit=this._config.fit),void 0!==(null===(u=this._config)||void 0===u?void 0:u.lazy)&&(v.lazy=this._config.lazy),void 0!==(null===(m=this._config)||void 0===m?void 0:m.lazy_eager)&&(v.lazy_eager=this._config.lazy_eager),v}_renderDiagnostics(t,s){var n,o,r,l,d,h,p,u,m,f,g,v,_,y,b,$,w;if(!t||this._loadingTemplates||!s||T(this._config))return e``;const x=[...this._suppliedNames(t),...i(null===(n=this._config)||void 0===n?void 0:n.rebuild_on),...be(t,c(null===(o=this._config)||void 0===o?void 0:o.variables)),...Object.keys(J(null!==(r=this._lovelace)&&void 0!==r?r:A()))].map(e=>({[e]:null})),{missing:k,unused:j,required:S}=$e(null===(l=this._config)||void 0===l?void 0:l.variables,t,x,[null===(d=this._config)||void 0===d?void 0:d.for_each_from,null===(h=this._config)||void 0===h?void 0:h.on_error],we(t,J(null!==(p=this._lovelace)&&void 0!==p?p:A()))),O=xe(null===(u=this._config)||void 0===u?void 0:u.variables,t,this.hass),E=this._hiddenNames(t,C(t)),P=S.filter(e=>!E.has(e)),L=k.filter(e=>!S.includes(e)&&!E.has(e)),F=new Set(I(null===(m=this._config)||void 0===m?void 0:m.variables).map(D)),M=[...E].filter(e=>F.has(e)),V=Ji.test(`${null!==(f=t.style)&&void 0!==f?f:""}\n${null!==(v=null===(g=this._config)||void 0===g?void 0:g.style)&&void 0!==v?v:""}`),H="contents"===(null===(_=this._config)||void 0===_?void 0:_.fit)&&V,q=Number(null===(y=this._config)||void 0===y?void 0:y.columns),R=(void 0!==(null===(b=this._config)||void 0===b?void 0:b.for_each)||void 0!==(null===($=this._config)||void 0===$?void 0:$.for_each_from))&&q>1&&!(Number(null===(w=this._config)||void 0===w?void 0:w.min_column_width)>0),z=N(t),U=ke(this._config,z);return e`
      ${U.map(t=>{var i,s;return e`<ha-alert alert-type="warning">
            ${a("editor.override_misplaced",{key:t,kind:z,template:null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""},this.hass)}
          </ha-alert>`})}
      ${R?e`<ha-alert alert-type="info">
              ${a("editor.columns_without_min_width",{columns:q},this.hass)}
            </ha-alert>`:e``}
      ${H?e`<ha-alert alert-type="warning">${a("editor.fit_hides_style",void 0,this.hass)}</ha-alert>`:e``}
      ${M.length?e`<ha-alert alert-type="warning">
              ${a(1===M.length?"editor.hidden_but_set_one":"editor.hidden_but_set_many",{names:M.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${P.length?e`<ha-alert alert-type="error">
              ${a(1===P.length?"editor.required_one":"editor.required_many",{names:P.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${L.length?e`<ha-alert alert-type="warning">
              ${a(1===L.length?"editor.optional_one":"editor.optional_many",{names:L.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${O.map(t=>e`<ha-alert alert-type="warning">
            ${a("editor.invalid_value",{name:t.name,expected:t.expected},this.hass)}
          </ha-alert>`)}
      ${j.length?e`<ha-alert alert-type="info">
              ${a(1===j.length?"editor.unused_one":"editor.unused_many",{names:j.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_valueChanged(e){var t,i;const s=e.detail.value,a=C(null===(t=this._templates)||void 0===t?void 0:t[s.template]);if(!a.length)return void g(this,"config-changed",{config:s});const n=[];for(const l of a){let e=s[Ri+l.name];const t=this._shownAs.get(l.name);t&&gi(e,t.shown)&&(e=t.written),void 0!==e&&""!==e&&n.push({[l.name]:e})}Array.isArray(s.extras)&&n.push(...s.extras);const o=Object.assign(Object.assign({},this._config),{template:s.template}),r=je(I(null===(i=this._config)||void 0===i?void 0:i.variables),n);r.length?o.variables=r:delete o.variables,P(o,"columns",s.columns),P(o,"min_column_width",s.min_column_width),P(o,"gap",s.gap),P(o,"lazy",!0===s.lazy||void 0),P(o,"lazy_eager",s.lazy_eager),g(this,"config-changed",{config:o})}_loadBorrowedTemplates(){if(!Ae(this._lovelace))return;this._loadingTemplates=!0;const e=this._editingPlace();Se(this.hass,this._lovelace,e.view,void 0,e.section).then(e=>{this._templates=e,this._schema=void 0}).finally(()=>{this._loadingTemplates=!1,this.requestUpdate()})}}h([u()],Yi.prototype,"_lovelace",void 0),h([u()],Yi.prototype,"_config",void 0),h([p()],Yi.prototype,"hass",void 0),h([u()],Yi.prototype,"_loadingTemplates",void 0),h([u()],Yi.prototype,"_ejectPending",void 0),h([u()],Yi.prototype,"_sectionsPending",void 0),h([u()],Yi.prototype,"_sectionsError",void 0),h([u()],Yi.prototype,"_onErrorMode",void 0),h([u()],Yi.prototype,"_previewMode",void 0),h([u()],Yi.prototype,"_copied",void 0),h([u()],Yi.prototype,"_cannotOpen",void 0),h([u()],Yi.prototype,"_resume",void 0),h([u()],Yi.prototype,"_matchesOpen",void 0),h([u()],Yi.prototype,"_byDomainDraft",void 0),h([u()],Yi.prototype,"_openItems",void 0),h([u()],Yi.prototype,"_renderedTemplates",void 0);const Zi=/^[a-z_]+\.[a-z0-9_]+$/,Gi={base:"entity",label:"Entity",selector:{entity:{}},matches:e=>Zi.test(e)};function Qi(e,t){return{base:e,label:t,selector:{text:{}},matches:e=>e.trim().length>0}}const Xi={entity:Gi,entity_id:Gi,name:Qi("name","Name"),title:Qi("title","Title"),heading:Qi("heading","Heading"),icon:{base:"icon",label:"Icon",selector:{icon:{}},matches:e=>e.includes(":")}};function es(e,t){return 1===t?e.label:`${e.label} ${t}`}const ts=(e,t=200)=>{if("number"==typeof e&&(e=String(e)),"string"!=typeof e)return;const i=e.trim();return i?i.length>t?`${i.slice(0,t-1)}…`:i:void 0};function is(e){const t=ts(e,2e3);if(t&&/^https?:\/\/[^\s/]+/i.test(t))return t}const ss=e=>[].concat(null!=e?e:[]).map(e=>ts(e)).filter(e=>!!e).slice(0,50);function as(e){if("string"==typeof e){const t=ts(e);return t?{name:t}:void 0}if(!e||"object"!=typeof e||Array.isArray(e))return;const t=e,i=ts(t.github),s={name:ts(t.name),github:i&&/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(i)?i:void 0,email:ts(t.email),url:is(t.url)};for(const a of Object.keys(s))void 0===s[a]&&delete s[a];return Object.keys(s).length?s:void 0}function ns(e){const t=e&&"object"==typeof e?e:{},i={author:as(t.author),license:ts(t.license),help:is(t.help),homepage:is(t.homepage),readme:ts(t.readme,8e3),related:ss(t.related),setup:ss(t.setup)};for(const s of["author","license","help","homepage","readme"])void 0===i[s]&&delete i[s];return i}const os=["author","license","help","homepage","readme","requires","setup","related"];function rs(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);for(const i of os)delete t[i];return t}const ls={integrations:{kind:"integration",key:"integration"},entities:{kind:"entity",key:"entity"},custom_cards:{kind:"custom_card",key:"card"}},ds=e=>{const t=ts(e,40);return t&&t.replace(/\+$/,"").trim()||void 0};function cs(e){var t;const i=null==e?void 0:e.requires;if(!i||"object"!=typeof i||Array.isArray(i))return[];const s=[];for(const[a,{kind:n,key:o}]of Object.entries(ls))for(const e of[].concat(null!==(t=i[a])&&void 0!==t?t:[]).slice(0,50)){const t=e&&"object"==typeof e&&!Array.isArray(e)?e:void 0,i=ss(t?t[o]:e).map(e=>"custom_card"===n?e.replace(/^custom:/,""):e);if(!i.length)continue;const a=t?ts(t.message,300):void 0;s.push(a?{kind:n,any:i,message:a}:{kind:n,any:i})}for(const a of["homeassistant","card"]){const e=ds(i[a]);e&&s.push({kind:a,any:[e]})}return s}function hs(e,t){var i,s;const a=e=>e.split(".").map(e=>parseInt(e,10)||0),n=a(e),o=a(t);for(let r=0;r<Math.max(n.length,o.length);r++){const e=null!==(i=n[r])&&void 0!==i?i:0,t=null!==(s=o[r])&&void 0!==s?s:0;if(e!==t)return e>t}return!0}function ps(e,t){switch(e.kind){case"integration":{const i=new Set;for(const e of t.components)i.add(e),i.add(e.split(".").pop());return e.any.some(e=>i.has(e))}case"entity":return e.any.some(e=>{const i=function(e){const t=e.replace(/[.+?^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*");return new RegExp(`^${t}$`,"i")}(e);return t.entities.some(e=>i.test(e))});case"custom_card":return e.any.some(e=>t.isDefined(e));case"homeassistant":return!t.homeassistant||hs(t.homeassistant,e.any[0]);case"card":return t.card.startsWith("0.0.0")||hs(t.card,e.any[0])}}function us(e,t){const i=Oe(e),s=Array.isArray(i)?i.filter(e=>e&&"object"==typeof e):i&&"object"==typeof i?Object.entries(i).map(([e,t])=>({[e]:t})):[],a=s.find(e=>Object.prototype.hasOwnProperty.call(e,t)),n=null==a?void 0:a[t];return"string"==typeof n||"number"==typeof n?String(n):void 0}function ms(e,t){const i=ns(e).setup.filter(e=>"string"==typeof t[e]&&""!==t[e]);if(!i.length)return e;const s=Oe(e),a=(Array.isArray(s)?s.filter(e=>e&&"object"==typeof e):s&&"object"==typeof s?Object.entries(s).map(([e,t])=>({[e]:t})):[]).filter(e=>!i.some(t=>Object.prototype.hasOwnProperty.call(e,t))),n=Object.assign(Object.assign({},e),{default:[...i.map(e=>({[e]:t[e]})),...a]});return delete n[Ce],n}const fs={integrations:"requires_integrations",entities:"requires_entities",custom_cards:"requires_custom_cards"},gs=e=>"string"==typeof e?e:"number"==typeof e?String(e):void 0,vs=e=>[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);const _s=e=>"string"==typeof e&&e.trim()?e.trim():void 0,ys=e=>[].concat(null!=e?e:[]).map(_s).filter(e=>!!e);const bs=[Te,Ne,...Pe],$s=["card","badge","row","element","group"],ws=["type","template","description","author","license","help","homepage","readme","requires","setup","related","variables","default",...$s,"style"];function xs(e,t){if(Array.isArray(e))for(const i of e)xs(i,t);else if(e&&"object"==typeof e){t(e);for(const i of Object.values(e))xs(i,t)}}function ks(e){const t=new Set,i=new Set;xs(e,e=>{const s=e.type;if("string"==typeof s){s.startsWith("custom:")&&!bs.includes(s)&&t.add(s);for(const t of Le(e))i.add(t)}});for(const s of Ee(e))i.add(s);return{customTypes:[...t].sort(),templateRefs:[...i].sort()}}function js(e,t){const i=e&&"object"==typeof e&&void 0!==e[Ce]?Object.assign(Object.assign({},e),{default:Oe(e)}):e,s={};for(const a of ws)void 0!==(null==i?void 0:i[a])&&(s[a]=i[a]);for(const a of Object.keys(null!=i?i:{}))a in s||a===Ce||"source"===a||(s[a]=i[a]);const{customTypes:n,templateRefs:o}=ks(e),r=[];if(t){const i={},a=[...o],n=null==e?void 0:e.template,l=new Set(ns(e).related.filter(e=>e!==n));for(a.push(...l);a.length;){const e=a.shift();if(e in i)continue;const s=t[e];if(s){i[e]=As(s),a.push(...ks(s).templateRefs);for(const e of ns(s).related)e===n||l.has(e)||(l.add(e),a.push(e))}else l.has(e)||r.push(e)}Object.keys(i).length&&(s.includes=i)}else r.push(...o);const l=[];n.length&&l.push(a("share.requires_custom_cards",{types:n.join(", ")})),r.length&&l.push(a("share.uses_other_templates",{names:r.join(", ")}));const d=function(e){const t=null==e?void 0:e.requires;return t&&"object"==typeof t?["homeassistant","card"].filter(e=>"number"==typeof t[e]):[]}(e);return d.length&&l.push(a("share.version_unquoted",{keys:d.join(", ")})),{payload:s,notes:l}}function As(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);return delete t.source,t}function Ss(e,t){if(!t.includes(e))return e;let i=2;for(;t.includes(`${e}_${i}`);)i+=1;return`${e}_${i}`}function Os(e){if(!e||"object"!=typeof e||Array.isArray(e))return{ok:!1,errors:[a("share.import_not_a_template")]};const t=[];"string"==typeof e.template&&e.template.trim()||t.push(a("share.import_no_name"));const i=$s.filter(t=>void 0!==e[t]);return 0===i.length?t.push(a("share.import_defines_nothing")):i.length>1&&t.push(a("share.import_defines_both",{first:i[0],second:i[1]})),{ok:0===t.length,errors:t}}function Cs(e,t){const i=new Set;for(const s of e)for(const e of ks(s).customTypes){const s=e.slice(7);s&&!t(s)&&i.add(s)}return[...i].sort()}const Es=["card","badge","row","element","group"],Ts=/^[A-Za-z0-9_-]+$/,Ns=/^[a-z_]+\.[a-z0-9_]+$/;function Ps(e){return Es.find(t=>void 0!==(null==e?void 0:e[t])&&null!==(null==e?void 0:e[t]))}function Ls(e){return e.map(e=>"number"==typeof e?`#${e+1}`:e).join(" › ")}function Is(e){const t=new Set;for(const a of Ie(null==e?void 0:e.variables))a&&"string"==typeof a.name&&t.add(a.name);const i=JSON.stringify(null!=e?e:{}),s=/\[\[([A-Za-z0-9_-]+)/g;for(let a=s.exec(i);a;a=s.exec(i))t.add(a[1]);return[...t]}function Fs(e){return"boolean"==typeof e?"boolean":"number"==typeof e?"number":"string"==typeof e&&Ns.test(e)?"entity":"string"==typeof e&&/^[a-z]+:[a-z0-9-]+$/.test(e)?"icon":"text"}function Ms(e,t,i){if(!t.length)return i;const[s,...a]=t;return Array.isArray(e)?e.map((e,t)=>t===s?Ms(e,a,i):e):Object.assign(Object.assign({},e),{[s]:Ms(null==e?void 0:e[s],a,i)})}const Vs=["card","badge","row","element","group","style","let","default","grid_options","name"],Hs="default:",Ds="or:";function qs(e){return e.startsWith(Ds)?e.slice(3):He(e)}function Rs(e,t,i){if(!e.includes("[[")&&!e.includes("]]"))return;const s=function(e){let t=0,i=!1;for(let s=0;s<e.length-1;s+=1){const a=e.slice(s,s+2);"[["===a?(t+=1,s+=1):"]]"===a&&(0===t?i=!0:t-=1,s+=1)}return{unclosed:t>0,stray:i}}(e);s.unclosed&&i.findings.push({level:"warning",key:"lint.unclosed",params:{},path:t}),s.stray&&i.findings.push({level:"warning",key:"lint.stray_close",params:{},path:t});let a=e;for(let n=0;n<5;n+=1){let e=!1;if(a=a.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(s,a)=>(e=!0,a.startsWith(De)||zs(a,t,i),"_")),!e)break}}function zs(e,t,i){const s=e.endsWith("?")?e.slice(0,-1):e,[a,...n]=s.split("|"),o=`[[${e}]]`,r=(a.endsWith("?")?a.slice(0,-1):a).split(".")[0];r&&"_"!==r&&!i.heads.has(r)&&i.heads.set(r,t);let l=!1;for(const d of n){if(!qe(d)){const e=Re(d);i.findings.push({level:"warning",key:"lint.unknown_step",params:e?{step:d,placeholder:o,closest:e}:{step:d,placeholder:o},path:t});continue}(d.startsWith(Hs)||d.startsWith(Ds))&&l&&i.findings.push({level:"warning",key:"lint.after_default",params:{step:d,placeholder:o},path:t}),d.startsWith(Hs)&&d.length>8&&(l=!0);const e=qs(d);e&&"_"!==e&&i.targets.push({name:e,placeholder:o,path:t})}}function Us(e,t,i){if("string"!=typeof e){if(Array.isArray(e))e.forEach((e,s)=>Us(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,a]of Object.entries(e))Rs(s,t,i),Us(a,t?`${t}.${s}`:s,i)}else Rs(e,t,i)}function Ws(e){const t=new Set;for(const i of C(e))t.add(i.name);for(const i of[...c(Oe(e)),...c(null==e?void 0:e.let)]){const e=D(i);void 0!==e&&t.add(e)}return[...t]}function Bs(e,t=[]){if(!e||"object"!=typeof e)return[];const i={findings:[],heads:new Map,targets:[]};for(const n of Vs){const t=e[n];void 0!==t&&Us(t,n,i)}C(e).forEach((e,t)=>{void 0!==e.default&&Us(e.default,`variables[${t}].default`,i);for(const s of["show_if","hide_if"]){const a=`variables[${t}].${s}`;for(const t of Me(e,s)){const e=t.slice(3);if(!Ve(t)){i.findings.push({level:"warning",key:"lint.condition_malformed",params:{key:s,condition:e},path:a});continue}const n=He(t);n&&i.targets.push({name:n.split(".")[0],placeholder:`${s}: ${e}`,path:a})}}});const s=new Set([...Ws(e),...t,...ue,...be(e)]),a=[...i.findings],o=e=>s.has(e)||i.heads.has(e),r=e=>o(e)||e.split(".").some((e,t,i)=>t>0&&o(i.slice(0,t).join(".")));for(const c of i.targets){if(r(c.name))continue;const e=n(c.name,[...s,...i.heads.keys()]);a.push({level:"warning",key:"lint.target_unknown",params:e?{name:c.name,placeholder:c.placeholder,closest:e}:{name:c.name,placeholder:c.placeholder},path:c.path})}const l=[...i.heads.entries()].filter(([e])=>!s.has(e));l.length&&a.push({level:"info",key:"lint.undeclared",params:{names:l.map(([e,t])=>l.length>1?`${e} (${t})`:e).join(", ")},path:l.length>1?"":l[0][1]});for(const c of function(e){return pi(e).filter(e=>!ci.includes(e)).map(e=>{const t=n(e,ci);return t?{name:e,closest:t}:{name:e}})}(e))a.push({level:"warning",key:"lint.editor_hide_unknown",params:Object.assign({},c),path:"editor_hide"});const d=new Set;return a.filter(e=>{const t=JSON.stringify([e.key,e.params,e.path]);return!d.has(t)&&(d.add(t),!0)})}const Ks={card:{type:"entity",entity:"sun.sun"},badge:{type:"entity",entity:"sun.sun"},row:{entity:"sun.sun"},element:{type:"icon",icon:"mdi:weather-sunny",style:{color:"yellow"}}},Js=50,Ys=e=>!!customElements.get(e),Zs=e=>e.actions.length>0||e.urls.length>0||e.embeds||e.scripts||e.placeholders||e.overlay;const Gs=500,Qs="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z";function Xs(t){const i=e=>{var i;return t.onInput(null!==(i=e.target.value)&&void 0!==i?i:"")},s=e=>{var i;return null===(i=t.onKeydown)||void 0===i?void 0:i.call(t,e)};return Ys("ha-input")?e`<ha-input
        label=${t.label}
        .value=${t.value}
        .disabled=${!0===t.disabled}
        @input=${i}
        @keydown=${s}
      ></ha-input>`:e`<ha-textfield
        label=${t.label}
        .value=${t.value}
        .disabled=${!0===t.disabled}
        @input=${i}
        @keydown=${s}
      ></ha-textfield>`}async function ea(e,t,i,s){var n;if(!G())return e._toolError=a("tools.cannot_save_here",void 0,e.hass),!1;e._busy=!0,e._toolError=void 0;try{return await X(e,e.hass,i,[{urlPath:te(),build:t}],s),e._undoChanged=void 0,!0}catch(o){return e._toolError=a("tools.save_failed",{message:null!==(n=null==o?void 0:o.message)&&void 0!==n?n:o},e.hass),!1}finally{e._busy=!1}}const ta=f`
  /* The Settings tab's three panels (idea 32). */
  ha-expansion-panel {
    display: block;
    margin-bottom: 12px;
  }
  ha-expansion-panel small {
    color: var(--secondary-text-color);
    font-weight: 400;
    margin-left: 6px;
  }
  .panel {
    padding: 12px 4px 4px;
  }

  ${Ue.styles}
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
  .share ha-button {
    margin-top: 8px;
  }
  .share a {
    color: var(--primary-color);
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
  .rename ha-textfield,
  .rename ha-input {
    display: block;
    width: 100%;
  }
  .rename ha-button {
    margin-top: 8px;
  }
  .order ul {
    margin: 0 0 8px;
    padding: 0;
    list-style: none;
  }
  .order li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    border-bottom: 1px solid var(--divider-color);
  }
  .order .spacer {
    flex: 1;
  }
  .order li[draggable='true'] {
    cursor: grab;
  }
  .order .handle {
    color: var(--secondary-text-color);
    flex: none;
  }
  .promote {
    display: block;
    margin-bottom: 16px;
  }
  .promote .hint {
    margin: 0 0 8px;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }
  .promote ha-textfield,
  .promote ha-input {
    display: block;
    width: 100%;
    margin-top: 8px;
  }
  .promote ha-alert {
    display: block;
    margin-top: 8px;
  }
  .promote ha-button {
    margin-top: 8px;
  }
  .share .trash ha-alert {
    margin: 4px 0 0;
  }
  .library {
    margin: 0 0 8px;
  }
  .library .hint {
    margin: 8px 0 0;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }
  .library ha-button {
    margin-top: 8px;
  }
  .share .about > * + *::before {
    content: ' · ';
  }
  .share .readme {
    display: block;
    padding: 0 16px 8px;
  }
  .share .installed {
    margin: 0 0 8px;
    padding-left: 20px;
  }
  .share .installed li {
    margin-bottom: 8px;
  }
  .share .installed .status {
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }
  .undo {
    margin-bottom: 8px;
  }
  .similar {
    margin: 8px 0 16px;
  }
  .similar h3 {
    margin: 0 0 4px;
    font-size: 1em;
  }
  .similar .hint {
    margin: 0 0 8px;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }
  .similar ul {
    margin: 0 0 8px;
    padding-left: 20px;
  }
  .similar ha-textfield,
  .similar ha-input {
    display: block;
    width: 100%;
  }
  .similar ha-button {
    margin-top: 8px;
  }
  .undo .hint {
    margin: 0 0 8px;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }

  /* A field with its help icon beside it, at the end of the line (idea 61). */
  .field-row {
    display: flex;
    align-items: flex-start;
    gap: 4px;
  }
  .field-row > ha-form {
    flex: 1;
    min-width: 0;
  }
  .field-row > decluttering-help {
    flex: none;
    margin-top: 14px;
  }
  .field-row.help-only {
    justify-content: flex-end;
    margin: -4px 0 4px;
  }
  .field-row.help-only > decluttering-help {
    margin-top: 0;
  }
`
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,ia=2,sa=e=>(...t)=>({_$litDirective$:e,values:t});let aa=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:na}=We,oa=e=>e,ra=()=>document.createComment(""),la=(e,t,i)=>{const s=e._$AA.parentNode,a=void 0===t?e._$AB:t._$AA;if(void 0===i){const t=s.insertBefore(ra(),a),n=s.insertBefore(ra(),a);i=new na(t,n,e,e.options)}else{const t=i._$AB.nextSibling,n=i._$AM,o=n!==e;if(o){let t;i._$AQ?.(e),i._$AM=e,void 0!==i._$AP&&(t=e._$AU)!==n._$AU&&i._$AP(t)}if(t!==a||o){let e=i._$AA;for(;e!==t;){const t=oa(e).nextSibling;oa(s).insertBefore(e,a),e=t}}}return i},da=(e,t,i=e)=>(e._$AI(t,i),e),ca={},ha=(e,t=ca)=>e._$AH=t,pa=e=>{e._$AR(),e._$AA.remove()},ua=sa(class extends aa{constructor(){super(...arguments),this.key=Be}render(e,t){return this.key=e,t}update(e,[t,i]){return t!==this.key&&(ha(e),this.key=t),i}}),ma=[{name:"room_light_tile",summary:"A tile per light, with the light named after itself.",template:{description:"A tile for one light, taking its name from Home Assistant.",variables:[{name:"entity",label:"Light",selector:{entity:{domain:"light"}},required:!0},{name:"name",label:"Name",description:"Leave empty to use the light’s own name",selector:{text:{}}}],card:{type:"tile",entity:"[[entity]]",name:"[[name|or:entity|friendly_name]]",features:[{type:"light-brightness"}]}}},{name:"room_summary",summary:"A heading per area, listing the lights in it. Uses grouping.",template:{description:"One card per area, with a tile for every light in that area.",card:{type:"vertical-stack",cards:[{type:"markdown",content:"## [[area]]\n\n[[entity_count]] lights"},{type:"custom:decluttering-card-plus",template:"room_light_tile",for_each:"[[items]]"}]}}},{name:"sensor_line",summary:"An Entities row showing one sensor with its area.",template:{description:"A row for one sensor, labelled with the area it is in.",variables:[{name:"entity",label:"Sensor",selector:{entity:{}},required:!0}],row:{entity:"[[entity]]",name:"[[entity|friendly_name]] ([[entity|area|default:no area]])"}}},{name:"status_badge",summary:"A badge that only appears when something needs attention.",template:{description:"A badge for one entity, hidden unless it is in the state you care about.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0},{name:"when",label:"Show when the state is",selector:{text:{}},default:"on"}],badge:{type:"entity",entity:"[[entity]]",visibility:[{condition:"state",entity:"[[entity]]",state:"[[when]]"}]}}},{name:"counted_grid",summary:'A numbered grid of anything, showing "3 of 12".',template:{description:"A tile that knows where it sits in a repeat.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0}],card:{type:"tile",entity:"[[entity]]",name:"[[entity|friendly_name]]",footer:{type:"markdown",content:"[[index]] of [[total|or:count]]"}}}}];
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function fa(e){return ma.find(t=>t.name===e)}function ga(e,t){const i=new Set,s=e=>{Array.isArray(e)?e.forEach(s):e&&"object"==typeof e&&("string"==typeof e.type&&e.type.includes("decluttering-card")&&"string"==typeof e.template&&i.add(e.template),Object.values(e).forEach(s))};return s(e.template),[...i].filter(e=>!t.includes(e))}function va(e,t){return{library:e,version:t}}
/*! js-yaml 5.5.0 https://github.com/nodeca/js-yaml @license MIT */var _a=Symbol("NOT_RESOLVED");function ya(e,t){return{tagName:e,nodeKind:"scalar",implicit:t.implicit??!1,matchByTagPrefix:t.matchByTagPrefix??!1,implicitFirstChars:t.implicitFirstChars??null,resolve:t.resolve,identify:t.identify,represent:t.represent??(e=>String(e)),representTagName:t.representTagName??(()=>e)}}function ba(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"sequence",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addItem:t.addItem,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}function $a(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"mapping",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addPair:t.addPair,has:t.has,keys:t.keys,get:t.get,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}var wa=ya("tag:yaml.org,2002:str",{resolve:e=>e,identify:e=>"string"==typeof e}),xa=["","~","null","Null","NULL"],ka=ya("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==xa.indexOf(e)?null:_a,identify:e=>null===e,represent:()=>"null"}),ja=ya("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(e,t)=>"null"===e||t&&""===e?null:_a,identify:e=>null===e,represent:()=>"null"}),Aa=["","~","null","Null","NULL"],Sa=ya("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==Aa.indexOf(e)?null:_a,identify:e=>null===e,represent:()=>"null"}),Oa=["true","True","TRUE"],Ca=["false","False","FALSE"],Ea=ya("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:e=>-1!==Oa.indexOf(e)||-1===Ca.indexOf(e)&&_a,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Ta=["true"],Na=["false"],Pa=ya("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:e=>-1!==Ta.indexOf(e)||-1===Na.indexOf(e)&&_a,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),La=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],Ia=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],Fa=ya("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:e=>-1!==La.indexOf(e)||-1===Ia.indexOf(e)&&_a,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Ma=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),Va=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var Ha=ya("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e,t){if(t){if(!Va.test(e))return _a}else if(!Ma.test(e))return _a;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:_a},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),Da=new RegExp("^-?(?:0|[1-9][0-9]*)$"),qa=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var Ra=ya("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!qa.test(e))return _a}else if(!Da.test(e))return _a;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:_a},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),za=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$");var Ua=ya("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e){if(!za.test(e))return _a;const t=function(e){let t=e.replace(/_/g,""),i=1;if("-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b"))return i*parseInt(t.slice(2),2);if(t.startsWith("0x"))return i*parseInt(t.slice(2),16);if(t.includes(":")){let e=0;for(const i of t.split(":"))e=60*e+Number(i);return i*e}return"0"!==t&&"0"===t[0]?i*parseInt(t,8):i*parseInt(t,10)}(e);return Number.isFinite(t)?t:_a},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),Wa=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),Ba=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var Ka=ya("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!Wa.test(e))return _a;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const s=i*parseFloat(t);return Number.isFinite(s)||Ba.test(e)?s:_a},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),Ja=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),Ya=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var Za=ya("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!Ya.test(e))return _a;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const s=i*parseFloat(t);return Number.isFinite(s)?s:_a}if(!Ja.test(e))return _a;const i=Number(e);return Number.isFinite(i)?i:_a},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),Ga=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),Qa=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var Xa=ya("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!Ga.test(e))return _a;let t=e.toLowerCase().replace(/_/g,"");const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;let s=0;if(t.includes(":")){for(const e of t.split(":"))s=60*s+Number(e);s*=i}else s=i*parseFloat(t);return Number.isFinite(s)||Qa.test(e)?s:_a},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),en=ya("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(e,t)=>"<<"===e||t&&""===e?"<<":_a,identify:()=>!1}),tn=/^[A-Za-z0-9+/]*={0,2}$/;var sn=ya("tag:yaml.org,2002:binary",{resolve:function(e){const t=e.replace(/\s/g,"");if(t.length%4!=0||!tn.test(t))return _a;const i=atob(t),s=new Uint8Array(i.length);for(let a=0;a<i.length;a++)s[a]=i.charCodeAt(a);return s},identify:e=>"[object Uint8Array]"===Object.prototype.toString.call(e),represent:function(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t)}}),an=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),nn=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function on(e,t,i,s=0,a=0,n=0,o=0){const r=new Date(Date.UTC(e,t,i,s,a,n,o));return r.setUTCFullYear(e,t,i),r}var rn=ya("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(e){let t=an.exec(e);if(null===t&&(t=nn.exec(e)),null===t)return _a;const i=+t[1],s=+t[2]-1,a=+t[3];if(!t[4]){const e=on(i,s,a);return e.getUTCFullYear()!==i||e.getUTCMonth()!==s||e.getUTCDate()!==a?_a:e}const n=+t[4],o=+t[5],r=+t[6];let l=0;if(n>23||o>59||r>59)return _a;if(t[7]){let e=t[7].slice(0,3);for(;e.length<3;)e+="0";l=+e}const d=on(i,s,a,n,o,r,l);if(d.getUTCFullYear()!==i||d.getUTCMonth()!==s||d.getUTCDate()!==a)return _a;if(t[9]){const e=+t[10],i=+(t[11]||0);if(e>23||i>59)return _a;const s=6e4*(60*e+i);d.setTime(d.getTime()-("-"===t[9]?-s:s))}return d},identify:e=>e instanceof Date,represent:e=>e.toISOString()}),ln=ba("tag:yaml.org,2002:seq",{create:()=>[],addItem:(e,t)=>{e.push(t)},identify:Array.isArray});function dn(e){if(null===e||"object"!=typeof e||Array.isArray(e))return!1;const t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}function cn(e,t){const i={};for(const s of t)void 0!==e[s]&&(i[s]=e[s]);return i}var hn=ba("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(e,t)=>{let i;if(t instanceof Map){if(1!==t.size)return"cannot resolve an ordered map item";i=t.keys().next().value}else{if(!dn(t))return"cannot resolve an ordered map item";{const e=Object.keys(t);if(1!==e.length)return"cannot resolve an ordered map item";i=e[0]}}return e.seen.has(i)?"duplicate key in ordered map":(e.seen.add(i),e.list.push(t),"")},finalize:e=>e.list,identify:()=>!1}),pn=ba("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(e,t)=>{if(t instanceof Map)return 1!==t.size?"cannot resolve a pairs item":(e.push(t.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(t))return"cannot resolve a pairs item";const i=t,s=Object.keys(i);return 1!==s.length?"cannot resolve a pairs item":(e.push([s[0],i[s[0]]]),"")},identify:()=>!1}),un=$a("tag:yaml.org,2002:map",{create:()=>({}),identify:dn,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{if(null!==t&&"object"==typeof t)return"object-based map does not support complex keys";const s=String(t);return"__proto__"===s?Object.defineProperty(e,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[s]=i,""},has:(e,t)=>(null===t||"object"!=typeof t)&&Object.prototype.hasOwnProperty.call(e,String(t)),keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}}),mn=$a("tag:yaml.org,2002:set",{create:()=>new Set,identify:e=>e instanceof Set,represent:e=>{const t=new Map;for(const i of e)t.set(i,null);return t},addPair:(e,t,i)=>null!==i?"cannot resolve a set item":(e.add(t),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:()=>null});var fn=class e{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(e){const t=function(e){const t=[];for(const i of e){let e=t.length;for(let s=0;s<t.length;s++){const a=t[s];if(a.nodeKind===i.nodeKind&&a.tagName===i.tagName&&a.matchByTagPrefix===i.matchByTagPrefix){e=s;break}}t[e]=i}return t}(e),i=[],s={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},a={scalar:[],sequence:[],mapping:[]};for(const d of t){if("scalar"===d.nodeKind&&d.implicit){if(d.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(d)}switch(d.nodeKind){case"scalar":d.matchByTagPrefix?a.scalar.push(d):s.scalar[d.tagName]=d;break;case"sequence":d.matchByTagPrefix?a.sequence.push(d):s.sequence[d.tagName]=d;break;case"mapping":d.matchByTagPrefix?a.mapping.push(d):s.mapping[d.tagName]=d}}const n=i.filter(e=>null===e.implicitFirstChars),o=new Set;for(const d of i)if(null!==d.implicitFirstChars)for(const e of d.implicitFirstChars)o.add(e);const r=new Map;for(const d of o)r.set(d,i.filter(e=>null===e.implicitFirstChars||-1!==e.implicitFirstChars.indexOf(d)));const l=s.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=t,this.implicitScalarTags=i,this.implicitScalarByFirstChar=r,this.implicitScalarAnyFirstChar=n,this.defaultScalarTag=l,this.defaultSequenceTag=s.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=s.mapping["tag:yaml.org,2002:map"],this.exact=s,this.prefix=a}lookupScalarTag(e){const t=this.exact.scalar[e];if(t)return t;for(const i of this.prefix.scalar)if(e.startsWith(i.tagName))return i}lookupSequenceTag(e){const t=this.exact.sequence[e];if(t)return t;for(const i of this.prefix.sequence)if(e.startsWith(i.tagName))return i}lookupMappingTag(e){const t=this.exact.mapping[e];if(t)return t;for(const i of this.prefix.mapping)if(e.startsWith(i.tagName))return i}resolveImplicitScalarTag(e){const t=this.implicitScalarByFirstChar.get(e.charAt(0))??this.implicitScalarAnyFirstChar;for(const s of t){const t=s.resolve(e,!1,s.tagName);if(t!==_a)return{value:t,tag:s}}const i=this.defaultScalarTag;return{value:i.resolve(e,!1,i.tagName),tag:i}}withTags(...t){let i=[];for(const e of t)i=i.concat(e);return new e([...this.tags,...i])}},gn=new fn([wa,ln,un]);new fn([...gn.tags,ja,Pa,Ra,Za]);var vn=new fn([...gn.tags,ka,Ea,Ha,Ka]);function _n(e){if(Array.isArray(e)){const t=Array.prototype.slice.call(e);for(let e=0;e<t.length;e++){if(Array.isArray(t[e]))return null;"object"==typeof t[e]&&"[object Object]"===Object.prototype.toString.call(t[e])&&(t[e]="[object Object]")}return String(t)}return"object"==typeof e&&"[object Object]"===Object.prototype.toString.call(e)?"[object Object]":String(e)}new fn([...gn.tags,Sa,Fa,Ua,Xa,rn,en,sn,hn,pn,mn]).withTags({...Ua,resolve:(e,t,i)=>{const s=Ua.resolve(e,t,i);return s===_a?Ha.resolve(e,t,i):s}},{...Xa,resolve:(e,t,i)=>{const s=Xa.resolve(e,t,i);return s===_a?Ka.resolve(e,t,i):s}}),$a("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(e,t,i)=>(e.set(t,i),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:(e,t)=>e.get(t),identify:e=>e instanceof Map||dn(e),represent:e=>{if(e instanceof Map)return e;const t=new Map,i=e;for(const s of Object.keys(i))t.set(s,i[s]);return t}}),$a("tag:yaml.org,2002:map",{create:()=>({}),identify:dn,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{const s=_n(t);return null===s?"nested arrays are not supported inside keys":("__proto__"===s?Object.defineProperty(e,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[s]=i,"")},has:(e,t)=>{const i=_n(t);return null!==i&&Object.prototype.hasOwnProperty.call(e,i)},keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}});var yn={maxLength:79,indent:1,linesBefore:3,linesAfter:2};function bn(e,t,i,s,a){let n="",o="";const r=Math.floor(a/2)-1;return s-t>r&&(n=" ... ",t=s-r+n.length),i-s>r&&(o=" ...",i=s+r-o.length),{str:n+e.slice(t,i).replace(/\t/g,"→")+o,pos:s-t+n.length}}function $n(e,t){return" ".repeat(Math.max(t-e.length,0))+e}function wn(e,t){let i="";return e.mark?(e.mark.name&&(i+=`in "${e.mark.name}" `),i+=`(${e.mark.line+1}:${e.mark.column+1})`,!t&&e.mark.snippet&&(i+=`\n\n${e.mark.snippet}`),`${e.reason} ${i}`):e.reason}var xn=class e extends Error{reason;mark;constructor(e,t){super(),this.name="YAMLException",this.reason=e,this.mark=t,this.message=wn(this,!1),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}toString(e){return`${this.name}: ${wn(this,e)}`}static throwAt(t,i,s,a=""){let n=0,o=0;for(let e=0;e<i;e++){const i=t.charCodeAt(e);10===i?(n++,o=e+1):13===i&&(n++,10===t.charCodeAt(e+1)&&e++,o=e+1)}const r={name:a,buffer:t,position:i,line:n,column:i-o};throw r.snippet=function(e,t){if(!e.buffer)return null;const i={...yn,...t},s=/\r?\n|\r|\0/g,a=[0],n=[];let o,r=-1;for(;o=s.exec(e.buffer);)n.push(o.index),a.push(o.index+o[0].length),e.position<=o.index&&r<0&&(r=a.length-2);r<0&&(r=a.length-1);let l="";const d=Math.min(e.line+i.linesAfter,n.length).toString().length,c=i.maxLength-(i.indent+d+3);for(let p=1;p<=i.linesBefore&&!(r-p<0);p++){const t=bn(e.buffer,a[r-p],n[r-p],e.position-(a[r]-a[r-p]),c);l=`${" ".repeat(i.indent)}${$n((e.line-p+1).toString(),d)} | ${t.str}\n${l}`}const h=bn(e.buffer,a[r],n[r],e.position,c);l+=`${" ".repeat(i.indent)}${$n((e.line+1).toString(),d)} | ${h.str}\n`,l+=`${"-".repeat(i.indent+d+3+h.pos)}^\n`;for(let p=1;p<=i.linesAfter&&!(r+p>=n.length);p++){const t=bn(e.buffer,a[r+p],n[r+p],e.position-(a[r]-a[r+p]),c);l+=`${" ".repeat(i.indent)}${$n((e.line+p+1).toString(),d)} | ${t.str}\n`}return l.replace(/\n$/,"")}(r),new e(s,r)}},kn=1,jn=2,An=3,Sn=4,On=5,Cn=6,En=1,Tn=2,Nn=3,Pn=4,Ln=5,In=1,Fn=2,Mn=1,Vn=2,Hn=3;function Dn(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}var qn=new Array(256),Rn=new Array(256);for(let gd=0;gd<256;gd++)qn[gd]=Dn(gd)?1:0,Rn[gd]=Dn(gd);function zn(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function Un(e){return e>=48&&e<=57?e-48:(32|e)-97+10}function Wn(e){return 120===e?2:117===e?4:8}function Bn(e,t,i){let s=0;for(;t<i;){const i=e.charCodeAt(t);if(10===i)s++,t++;else if(13===i)s++,t++,10===e.charCodeAt(t)&&t++;else{if(32!==i&&9!==i)break;t++}}return{position:t,breaks:s}}function Kn(e){return 1===e?" ":"\n".repeat(e-1)}function Jn(e,t,i,s,a,n){const o=s<0?0:s,r=e.slice(t,i).replace(/\r\n?/g,"\n"),l=""===r?[]:(r.endsWith("\n")?r.slice(0,-1):r).split("\n");let d="",c=!1,h=0,p=!1;for(const u of l){let e=0;for(;e<o&&32===u.charCodeAt(e);)e++;if(s<0||e>=u.length){h++;continue}const t=u.slice(o),i=t.charCodeAt(0);n?32===i||9===i?(p=!0,d+="\n".repeat(c?1+h:h)):p?(p=!1,d+="\n".repeat(h+1)):0===h?c&&(d+=" "):d+="\n".repeat(h):d+="\n".repeat(c?1+h:h),d+=t,c=!0,h=0}return a===Hn?d+="\n".repeat(c?1+h:h):a!==Vn&&c&&(d+="\n"),d}function Yn(e,t){if(-1===t.valueStart)return"";const{valueStart:i,valueEnd:s}=t;if(t.fast)return e.slice(i,s);switch(t.style){case Tn:return function(e,t,i){let s="",a=t,n=t,o=t;for(;a<i;){const t=e.charCodeAt(a);if(39===t)s+=e.slice(n,a)+"'",a+=2,n=o=a;else if(10===t||13===t){s+=e.slice(n,o);const t=Bn(e,a,i);s+=Kn(t.breaks),a=n=o=t.position}else a++,32!==t&&9!==t&&(o=a)}return s+e.slice(n,i)}(e,i,s);case Nn:return function(e,t,i){let s="",a=t,n=t,o=t;for(;a<i;){const t=e.charCodeAt(a);if(92===t){s+=e.slice(n,a),a++;const t=e.charCodeAt(a);if(10===t||13===t)a=Bn(e,a,i).position;else if(t<256&&qn[t])s+=Rn[t],a++;else{let i=Wn(t),n=0;for(;i>0;i--)a++,n=(n<<4)+Un(e.charCodeAt(a));s+=zn(n),a++}n=o=a}else if(10===t||13===t){s+=e.slice(n,o);const t=Bn(e,a,i);s+=Kn(t.breaks),a=n=o=t.position}else a++,32!==t&&9!==t&&(o=a)}return s+e.slice(n,i)}(e,i,s);case Pn:return Jn(e,i,s,t.indent,t.chomping,!1);case Ln:return Jn(e,i,s,t.indent,t.chomping,!0);default:return function(e,t,i){let s="",a=t,n=t,o=t;for(;a<i;){const t=e.charCodeAt(a);if(10===t||13===t){s+=e.slice(n,o);const t=Bn(e,a,i);s+=Kn(t.breaks),a=n=o=t.position}else a++,32!==t&&9!==t&&(o=a)}return s+e.slice(n,o)}(e,i,s)}}var Zn=Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"});function Gn(e){let t="",i=0;for(;i<e.length;){if(37!==e.charCodeAt(i)){t+=e[i++];continue}let s=parseInt(e.slice(i+1,i+3),16);if(i+=3,s>=192){let t=s<224?1:s<240?2:3;for(s&=(1<<6-t)-1;t-- >0;)s=s<<6|63&parseInt(e.slice(i+1,i+3),16),i+=3}s<65536?t+=String.fromCharCode(s):(s-=65536,t+=String.fromCharCode(55296|s>>10,56320|1023&s))}return t}function Qn(e,t){if(e.startsWith("!<")&&e.endsWith(">"))return Gn(e.slice(2,-1));const i=e.indexOf("!",1),s=-1===i?"!":e.slice(0,i+1);return Gn(t?.[s]??Zn[s]??s)+Gn(e.slice(s.length))}var Xn=-1,eo={filename:"",schema:vn,json:!1,maxTotalMergeKeys:1e4,maxAliases:-1};function to(e){return"tagStart"in e&&e.tagStart!==Xn?e.tagStart:"anchorStart"in e&&e.anchorStart!==Xn?e.anchorStart:"valueStart"in e&&e.valueStart!==Xn?e.valueStart:"start"in e?e.start:0}function io(e,t){xn.throwAt(e.source,e.position,t,e.filename)}function so(e,t,i,s){try{return i.finalize(s)}catch(a){if(a instanceof xn)throw a;xn.throwAt(e.source,t,a instanceof Error?a.message:String(a),e.filename)}}function ao(e,t){const i=Yn(e.source,t),s=t.tagStart===Xn?"":e.source.slice(t.tagStart,t.tagEnd),a=e.schema.defaultScalarTag;if(""!==s){if("!"===s)return{value:i,tag:a};const t=Qn(s,e.tagHandlers),n=e.schema.lookupScalarTag(t);if(n){const s=n.resolve(i,!0,t);return s===_a&&io(e,`cannot resolve a node with !<${t}> explicit tag`),{value:s,tag:n}}const o=e.schema.lookupMappingTag(t)??e.schema.lookupSequenceTag(t);if(o){""!==i&&io(e,`cannot resolve a node with !<${t}> explicit tag`);const s=o.create(t);return{value:o.carrierIsResult?s:so(e,e.position,o,s),tag:o}}io(e,`unknown scalar tag !<${t}>`)}return t.style===En?e.schema.resolveImplicitScalarTag(i):{value:a.resolve(i,!1,a.tagName),tag:a}}function no(e,t,i){const s=t.tagStart===Xn?"":e.source.slice(t.tagStart,t.tagEnd);return""===s||"!"===s?i:Qn(s,e.tagHandlers)}function oo(e){return"mapping"===e.nodeKind}function ro(e){e.totalMergeKeys++,-1!==e.maxTotalMergeKeys&&e.totalMergeKeys>e.maxTotalMergeKeys&&io(e,`merge keys exceeded maxTotalMergeKeys (${e.maxTotalMergeKeys})`)}function lo(e,t,i,s){ro(e);for(const a of s.keys(i)){if(ro(e),t.tag.has(t.value,a))continue;const n=t.tag.addPair(t.value,a,s.get(i,a));n&&io(e,n),t.overridable??=new Set,t.overridable.add(a)}}function co(e,t,i,s,a){if(e.position=t.keyPosition,t.keyIsMerge)return void function(e,t,i,s){if(e.position=t.keyPosition,oo(s))lo(e,t,i,s);else if("sequence"===s.nodeKind&&Array.isArray(i)){i.length>100&&io(e,"abnormal merge sequence size");for(const s of i){const i=e.nodeTags.get(s);i||io(e,"cannot merge mappings; the provided source object is unacceptable"),lo(e,t,s,i)}}else io(e,"cannot merge mappings; the provided source object is unacceptable")}(e,t,s,a);e.json||!t.tag.has(t.value,i)||t.overridable?.has(i)||io(e,"duplicated mapping key");const n=t.tag.addPair(t.value,i,s);n&&io(e,n),t.overridable?.delete(i)}function ho(e,t,i){const s=e.frames[e.frames.length-1];if("document"===s.kind)s.value=t,s.hasValue=!0;else if("sequence"===s.kind){oo(i)&&e.nodeTags.set(t,i);const a=s.tag.addItem(s.value,t,s.index++);a&&io(e,a)}else if(s.hasKey){const a=s.key;s.key=void 0,s.hasKey=!1,co(e,s,a,t,i)}else s.key=t,s.keyPosition=e.position,s.hasKey=!0,s.keyIsMerge="tag:yaml.org,2002:merge"===i.tagName}function po(e,t,i,s,a){if(t.anchorStart!==Xn){const n={value:i,tag:s,isValueFinal:a};return e.anchors.set(e.source.slice(t.anchorStart,t.anchorEnd),n),n}return null}var uo=-1,mo=Object.prototype.hasOwnProperty,fo=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,go=/[,\[\]{}]/,vo=/^(?:!|!!|![0-9A-Za-z-]+!)$/,_o=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,yo=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`,bo=new RegExp(`^(?:${_o})*$`),$o=new RegExp(`^(?:${yo})+$`),wo=new RegExp(`^(?:!(?:${_o})*|${yo}(?:${_o})*)$`),xo={filename:"",maxDepth:100};function ko(e,t,i,s,a,n,o){e.events.push({type:jn,start:t,anchorStart:i,anchorEnd:s,tagStart:a,tagEnd:n,style:o})}function jo(e,t,i,s,a,n,o){e.events.push({type:An,start:t,anchorStart:i,anchorEnd:s,tagStart:a,tagEnd:n,style:o})}function Ao(e,t){e.events.splice(t.eventsLength,0,{type:An,start:t.position,anchorStart:uo,anchorEnd:uo,tagStart:uo,tagEnd:uo,style:Fn})}function So(e,t,i,s,a,n,o,r,l=Mn,d=-1,c=!1){e.events.push({type:Sn,valueStart:t,valueEnd:i,anchorStart:s,anchorEnd:a,tagStart:n,tagEnd:o,style:r,chomping:l,indent:d,fast:c})}function Oo(e){e.events.push({type:Cn})}function Co(e){So(e,uo,uo,uo,uo,uo,uo,En)}function Eo(){return{anchorStart:uo,anchorEnd:uo,tagStart:uo,tagEnd:uo}}function To(e){return{position:e.position,line:e.line,lineStart:e.lineStart,lineIndent:e.lineIndent,firstTabInLine:e.firstTabInLine,eventsLength:e.events.length}}function No(e,t){e.position=t.position,e.line=t.line,e.lineStart=t.lineStart,e.lineIndent=t.lineIndent,e.firstTabInLine=t.firstTabInLine,e.events.length=t.eventsLength}function Po(e,t){xn.throwAt(e.input.slice(0,e.length),e.position,t,e.filename)}function Lo(e){return 10===e||13===e}function Io(e){return 9===e||32===e}function Fo(e){return Io(e)||Lo(e)}function Mo(e){return 0===e||Fo(e)}function Vo(e){return 44===e||91===e||93===e||123===e||125===e}function Ho(e){return e>=48&&e<=57?e-48:-1}function Do(e){if(e>=48&&e<=57)return e-48;const t=32|e;return t>=97&&t<=102?t-97+10:-1}function qo(e){return 120===e?2:117===e?4:85===e?8:0}function Ro(e){return 48===e||97===e||98===e||116===e||9===e||110===e||118===e||102===e||114===e||101===e||32===e||34===e||47===e||92===e||78===e||95===e||76===e||80===e}function zo(e){10===e.input.charCodeAt(e.position)?e.position++:(e.position++,10===e.input.charCodeAt(e.position)&&e.position++),e.line++,e.lineStart=e.position,e.lineIndent=0,e.firstTabInLine=-1}function Uo(e,t){let i=0,s=e.input.charCodeAt(e.position),a=e.position===e.lineStart||Fo(e.input.charCodeAt(e.position-1));for(;0!==s;){for(;Io(s);)a=!0,9===s&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),s=e.input.charCodeAt(++e.position);if(t&&a&&35===s)do{s=e.input.charCodeAt(++e.position)}while(!Lo(s)&&0!==s);if(!Lo(s))break;for(zo(e),i++,a=!0,s=e.input.charCodeAt(e.position);32===s;)e.lineIndent++,s=e.input.charCodeAt(++e.position)}return i}function Wo(e,t=e.position){const i=e.input.charCodeAt(t);if((45===i||46===i)&&i===e.input.charCodeAt(t+1)&&i===e.input.charCodeAt(t+2)){const i=e.input.charCodeAt(t+3);return 0===i||Fo(i)}return!1}function Bo(e){e.position===e.lineStart&&65279===e.input.charCodeAt(e.position)&&(e.position++,e.lineStart=e.position)}function Ko(e){if(e.position!==e.lineStart)return!1;if(Wo(e))return!0;if(65279!==e.input.charCodeAt(e.position))return!1;const t=To(e);Bo(e),Uo(e,!0);const i=e.input.charCodeAt(e.position),s=e.position===e.lineStart&&(37===i||45===i&&Wo(e));return No(e,t),s}function Jo(e){let t=e.input.charCodeAt(e.position);for(;0!==t&&!Lo(t);)t=e.input.charCodeAt(++e.position)}function Yo(e,t,i){const s=fo.exec(e.input.slice(t,i));null!==s&&(e.position=t+s.index+s[0].length-1,Po(e,"the stream contains non-printable characters"))}function Zo(e,t,i){if(33!==e.input.charCodeAt(e.position))return!1;t.tagStart!==uo&&Po(e,"duplication of a tag property");const s=e.position;let a=!1,n=!1,o="!",r=e.input.charCodeAt(++e.position);60===r?(a=!0,r=e.input.charCodeAt(++e.position)):33===r&&(n=!0,o="!!",r=e.input.charCodeAt(++e.position));let l,d=e.position;if(a){for(;0!==r&&62!==r;)r=e.input.charCodeAt(++e.position);62!==r&&Po(e,"unexpected end of the stream within a verbatim tag"),l=e.input.slice(d,e.position),e.position++}else{for(;!(0===r||Fo(r)||i&&Vo(r));)33===r&&(n?Po(e,"tag suffix cannot contain exclamation marks"):(o=e.input.slice(d-1,e.position+1),vo.test(o)||Po(e,"named tag handle cannot contain such characters"),n=!0,d=e.position+1)),r=e.input.charCodeAt(++e.position);l=e.input.slice(d,e.position),go.test(l)&&Po(e,"tag suffix cannot contain flow indicator characters")}return l&&!(a?bo.test(l):$o.test(l))&&Po(e,`tag name cannot contain such characters: ${l}`),a||"!"===o||"!!"===o||mo.call(e.tagHandlers,o)||Po(e,`undeclared tag handle "${o}"`),t.tagStart=s,t.tagEnd=e.position,!0}function Go(e,t){if(38!==e.input.charCodeAt(e.position))return!1;t.anchorStart!==uo&&Po(e,"duplication of an anchor property"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!Fo(e.input.charCodeAt(e.position))&&!Vo(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&Po(e,"name of an anchor node must contain at least one character"),t.anchorStart=i,t.anchorEnd=e.position,!0}function Qo(e,t){if(42!==e.input.charCodeAt(e.position))return!1;t.anchorStart===uo&&t.tagStart===uo||Po(e,"alias node should not have any properties"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!Fo(e.input.charCodeAt(e.position))&&!Vo(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&Po(e,"name of an alias node must contain at least one character"),function(e,t,i){e.events.push({type:On,anchorStart:t,anchorEnd:i})}(e,i,e.position),!0}function Xo(e,t){Uo(e,!1),e.lineIndent<t&&Po(e,"deficient indentation")}function er(e,t,i,s){if(!function(e,t){const i=e.input.charCodeAt(e.position),s=1===t;if(0===i||Fo(i)||35===i||38===i||42===i||33===i||124===i||62===i||39===i||34===i||37===i||64===i||96===i||Vo(i))return!1;if(63===i||45===i){const t=e.input.charCodeAt(e.position+1);if(Mo(t)||s&&Vo(t))return!1}return!0}(e,i))return!1;const a=e.position;let n=e.position,o=e.input.charCodeAt(e.position);const r=1===i;let l=!1;for(;0!==o&&!Ko(e);){if(58===o){const t=e.input.charCodeAt(e.position+1);if(Mo(t)||r&&Vo(t))break}else if(35===o){if(Fo(e.input.charCodeAt(e.position-1)))break}else{if(r&&Vo(o))break;if(Lo(o)){const i=e.position,s=e.line,a=e.lineStart,n=e.lineIndent;if(Uo(e,!1),e.lineIndent>=t){l=!0,o=e.input.charCodeAt(e.position);continue}e.position=i,e.line=s,e.lineStart=a,e.lineIndent=n;break}}Io(o)||(n=e.position+1),o=e.input.charCodeAt(++e.position)}return n!==a&&(Yo(e,a,n),So(e,a,n,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,En,Mn,-1,!l),!0)}function tr(e,t){const i=e.line;Uo(e,!0),(e.line>i&&e.lineIndent<t||-1!==e.firstTabInLine&&e.lineIndent<t)&&Po(e,"deficient indentation")}function ir(e,t,i){if(-1!==e.firstTabInLine||45!==e.input.charCodeAt(e.position)||!Mo(e.input.charCodeAt(e.position+1)))return!1;for(ko(e,e.position,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,In);45===e.input.charCodeAt(e.position)&&Mo(e.input.charCodeAt(e.position+1));){-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,Po(e,"tab characters must not be used in indentation"));const i=e.line;e.position++;const s=Uo(e,!0)>0;if(-1!==e.firstTabInLine&&45===e.input.charCodeAt(e.position)&&Mo(e.input.charCodeAt(e.position+1))&&Po(e,"bad indentation of a sequence entry"),s&&e.lineIndent<=t?Co(e):ar(e,t,3,!1,!0),Uo(e,!0),e.lineIndent<t||e.position>=e.length)break;e.lineIndent>t&&Po(e,"bad indentation of a sequence entry"),e.line===i&&45===e.input.charCodeAt(e.position)&&Mo(e.input.charCodeAt(e.position+1))&&Po(e,"bad indentation of a sequence entry")}return Oo(e),!0}function sr(e,t,i,s){let a=!1,n=!1,o=!1,r=!1;if(-1!==e.firstTabInLine)return!1;let l=e.input.charCodeAt(e.position);for(;0!==l;){a||-1===e.firstTabInLine||(e.position=e.firstTabInLine,Po(e,"tab characters must not be used in indentation"));const d=e.input.charCodeAt(e.position+1),c=e.line;if(63!==l&&58!==l||!Mo(d)){a&&(Co(e),a=!1);const t=To(e);if(!ar(e,i,2,!1,!0))break;if(e.line===c){for(l=e.input.charCodeAt(e.position);Io(l);)l=e.input.charCodeAt(++e.position);if(58===l)l=e.input.charCodeAt(++e.position),Mo(l)||Po(e,"a whitespace character is expected after the key-value separator within a block mapping"),o||(e.events.splice(t.eventsLength,0,{type:An,start:t.position,anchorStart:s.anchorStart,anchorEnd:s.anchorEnd,tagStart:s.tagStart,tagEnd:s.tagEnd,style:In}),o=!0),n=!0,a=!1,r=!1;else{if(!n)return s.anchorStart===uo&&s.tagStart===uo||(No(e,t),!1);Po(e,"expected ':' after a mapping key")}}else{if(!n)return s.anchorStart===uo&&s.tagStart===uo||(No(e,t),!1);Po(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else o||(jo(e,e.position,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,In),o=!0),63===l?(a&&Co(e),n=!0,a=!0):(a||(Co(e),n=!0),a=!1),e.position+=1,r=!0;if(ar(e,t,4,!0,r)&&(r=!1),a||r&&(Co(e),r=!1),Uo(e,!0),l=e.input.charCodeAt(e.position),(e.line===c||e.lineIndent>t)&&0!==l)Po(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return!!n&&(a&&Co(e),o&&Oo(e),!0)}function ar(e,t,i,s,a,n=!0){e.depth>=e.maxDepth&&Po(e,`nesting exceeded maxDepth (${e.maxDepth})`),e.depth++;let o=1,r=!1,l=!1,d=null;const c=Eo();let h=4===i||3===i,p=h;const u=h;if(s&&Uo(e,!0)&&(r=!0,o=e.lineIndent>t?1:e.lineIndent===t?0:-1),1===o)for(;;){const s=e.input.charCodeAt(e.position),a=To(e);if(r&&1!==o&&(33===s||38===s))break;if(r&&u&&(c.tagStart!==uo||c.anchorStart!==uo)&&(33===s||38===s)){const i=To(e),s=t+1;if(sr(e,e.position-e.lineStart,s,c)&&e.events[i.eventsLength]?.type===An)return e.depth--,!0;No(e,i)}if(r&&(33===s&&c.tagStart!==uo||38===s&&c.anchorStart!==uo))break;if(!Zo(e,c,1===i)&&!Go(e,c))break;null===d&&(d=a),Uo(e,!0)?(r=!0,p=u,o=e.lineIndent>t?1:e.lineIndent===t?0:-1):p=!1}if(p&&(p=r||a),1===o||4===i){const s=1===i||2===i?t:t+1,a=e.position-e.lineStart;if(1===o)if(p&&(ir(e,a,c)||sr(e,a,s,c))||function(e,t,i){const s=e.input.charCodeAt(e.position),a=123===s,n=e.position;let o=!0;if(91!==s&&123!==s)return!1;const r=a?125:93;for(a?jo(e,n,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Fn):ko(e,n,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Fn),e.position++;0!==e.input.charCodeAt(e.position);){tr(e,t);let i=e.input.charCodeAt(e.position);if(i===r)return e.position++,Oo(e),!0;o?44===i&&Po(e,"expected the node content, but found ','"):Po(e,"missed comma between flow collection entries");let s=!1,n=!1;63===i&&Fo(e.input.charCodeAt(e.position+1))&&(s=n=!0,e.position+=1,tr(e,t));const l=e.line,d=To(e),c=ar(e,t,1,!1,!0);tr(e,t),i=e.input.charCodeAt(e.position),(a||n||e.line===l)&&58===i?(s=!0,e.position++,tr(e,t),a||Ao(e,d),c||Co(e),ar(e,t,1,!1,!0)||Co(e),tr(e,t),a||Oo(e)):a&&s?(c||Co(e),Co(e)):a?Co(e):s&&(Ao(e,d),c||Co(e),Co(e),Oo(e)),i=e.input.charCodeAt(e.position),44===i?(o=!0,e.position++):o=!1}Po(e,"unexpected end of the stream within a flow collection")}(e,s,c))l=!0;else{const t=e.input.charCodeAt(e.position);if(null!==d&&n&&u&&!p&&124!==t&&62!==t){const t=To(e),i=d.position-d.lineStart;No(e,d),sr(e,i,s,Eo())&&e.events[t.eventsLength]?.type===An?l=!0:No(e,t)}!l&&(h&&function(e,t,i){const s=e.input.charCodeAt(e.position);let a=Mn,n=-1,o=!1;if(124!==s&&62!==s)return!1;const r=124===s?Pn:Ln;for(e.position++;0!==e.input.charCodeAt(e.position);){const i=e.input.charCodeAt(e.position),s=Ho(i);if(43===i||45===i)a!==Mn&&Po(e,"repeat of a chomping mode identifier"),a=43===i?Hn:Vn,e.position++;else{if(!(s>=0))break;0===s&&Po(e,"bad explicit indentation width of a block scalar; it cannot be less than one"),o&&Po(e,"repeat of an indentation width identifier"),n=t+s-1,o=!0,e.position++}}let l=!1;for(;Io(e.input.charCodeAt(e.position));)l=!0,e.position++;l&&35===e.input.charCodeAt(e.position)&&Jo(e),Lo(e.input.charCodeAt(e.position))?zo(e):0!==e.input.charCodeAt(e.position)&&Po(e,"a line break is expected");let d=o?n:-1,c=0;const h=e.position;let p=e.position;for(;0!==e.input.charCodeAt(e.position);){const i=e.position;let s=0;for(;32===e.input.charCodeAt(i+s);)s++;const a=e.input.charCodeAt(i+s);if(0===a){d>=0?s>d&&(p=i+s):s>0&&(p=i+s);break}if(Ko(e))break;if(!o&&-1===d&&Lo(a)&&(c=Math.max(c,s)),o||-1!==d||Lo(a)||(9===a&&s<t&&(e.position=i+s,Po(e,"tab characters must not be used in indentation")),s>=t&&s<c&&(e.position=i+s,Po(e,"bad indentation of a mapping entry"))),-1===d&&0!==a&&!Lo(a)&&s<t){e.lineIndent=s,e.position=i+s;break}o||0===a||Lo(a)||-1!==d||(d=s);const n=-1===d?t+1:d;if(0!==a&&!Lo(a)&&s<n){e.lineIndent=s,e.position=i+s;break}Jo(e),p=e.position,Lo(e.input.charCodeAt(e.position))&&(zo(e),p=e.position)}return Yo(e,h,p),So(e,h,p,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,r,a,d),!0}(e,s,c)||function(e,t,i){if(39!==e.input.charCodeAt(e.position))return!1;e.position++;const s=e.position;let a=!0;for(;0!==e.input.charCodeAt(e.position);){const n=e.input.charCodeAt(e.position);if(39===n){if(39===e.input.charCodeAt(e.position+1)){a=!1,e.position+=2;continue}const t=e.position;return e.position++,So(e,s,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Tn,Mn,-1,a),!0}Lo(n)?(a=!1,Xo(e,t)):e.position===e.lineStart&&Wo(e)?Po(e,"unexpected end of the document within a single quoted scalar"):9!==n&&n<32?Po(e,"expected valid JSON character"):e.position++}Po(e,"unexpected end of the stream within a single quoted scalar")}(e,s,c)||function(e,t,i){if(34!==e.input.charCodeAt(e.position))return!1;e.position++;const s=e.position;let a=!0;for(;0!==e.input.charCodeAt(e.position);){const n=e.input.charCodeAt(e.position);if(34===n){const t=e.position;return e.position++,So(e,s,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Nn,Mn,-1,a),!0}if(92===n){a=!1;const i=e.input.charCodeAt(++e.position);if(Lo(i))Xo(e,t);else if(Ro(i))e.position++;else{let t=qo(i);for(0===t&&Po(e,"unknown escape sequence");t-- >0;)e.position++,Do(e.input.charCodeAt(e.position))<0&&Po(e,"expected hexadecimal character");e.position++}}else Lo(n)?(a=!1,Xo(e,t)):e.position===e.lineStart&&Wo(e)?Po(e,"unexpected end of the document within a double quoted scalar"):9!==n&&n<32?Po(e,"expected valid JSON character"):e.position++}Po(e,"unexpected end of the stream within a double quoted scalar")}(e,s,c)||Qo(e,c)||er(e,s,i,c))&&(l=!0)}else 0===o&&(l=p&&ir(e,a,c))}return h=h&&!l,l||c.anchorStart===uo&&c.tagStart===uo&&!h||(So(e,uo,uo,c.anchorStart,c.anchorEnd,c.tagStart,c.tagEnd,En),l=!0),e.depth--,l||c.anchorStart!==uo||c.tagStart!==uo}function nr(e){if(e.lineIndent>0||37!==e.input.charCodeAt(e.position))return!1;e.position++;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!Fo(e.input.charCodeAt(e.position));)e.position++;const i=e.input.slice(t,e.position),s=[];for(0===i.length&&Po(e,"directive name must not be less than one character in length");0!==e.input.charCodeAt(e.position)&&!Lo(e.input.charCodeAt(e.position));){for(;Io(e.input.charCodeAt(e.position));)e.position++;if(35===e.input.charCodeAt(e.position)||Lo(e.input.charCodeAt(e.position))||0===e.input.charCodeAt(e.position))break;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!Fo(e.input.charCodeAt(e.position));)e.position++;s.push(e.input.slice(t,e.position))}if(Lo(e.input.charCodeAt(e.position))&&zo(e),"YAML"===i){e.directives.some(e=>"yaml"===e.kind)&&Po(e,"duplication of %YAML directive"),1!==s.length&&Po(e,"YAML directive accepts exactly one argument");const t=/^([0-9]+)\.([0-9]+)$/.exec(s[0]);null===t&&Po(e,"ill-formed argument of the YAML directive"),1!==parseInt(t[1],10)&&Po(e,"unacceptable YAML version of the document"),e.directives.push({kind:"yaml",version:s[0]})}else if("TAG"===i){2!==s.length&&Po(e,"TAG directive accepts exactly two arguments");const[t,i]=s;vo.test(t)||Po(e,"ill-formed tag handle (first argument) of the TAG directive"),mo.call(e.tagHandlers,t)&&Po(e,`there is a previously declared suffix for "${t}" tag handle`),wo.test(i)||Po(e,"ill-formed tag prefix (second argument) of the TAG directive"),e.tagHandlers[t]=i,e.directives.push({kind:"tag",handle:t,prefix:i})}return!0}function or(e){e.directives=[],e.tagHandlers=Object.create(null);let t=!1;for(Uo(e,!0);nr(e);)t=!0,Uo(e,!0);let i=!1,s=!1,a=!0;if(0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)&&Mo(e.input.charCodeAt(e.position+3))){i=!0;const t=e.line;e.position+=3,Uo(e,!0),a=e.line>t}else t&&Po(e,"directives end mark is expected");const n=e.events.length;if(!i&&e.position===e.lineStart&&46===e.input.charCodeAt(e.position)&&Wo(e))return e.position+=3,void Uo(e,!0);if(function(e,t,i){e.events.push({type:kn,explicitStart:t,explicitEnd:i,directives:e.directives})}(e,i,!1),ar(e,e.lineIndent-1,4,!1,a,a)||Co(e),Uo(e,!0),e.position===e.lineStart&&Wo(e)&&(s=46===e.input.charCodeAt(e.position),s)){const t=e.line;e.position+=3,Uo(e,!0),e.line===t&&e.position<e.length&&Po(e,"end of the stream or a document separator is expected")}const o=e.events[n];o?.type===kn&&(o.explicitEnd=s),Oo(e),!s&&e.position<e.length&&!Ko(e)&&Po(e,"end of the stream or a document separator is expected")}var rr={...xo,...eo};function lr(e,t={}){const i={...rr,...t},s=String(e),a=Object.keys(xo),n=Object.keys(eo);return function(e,t){const i={...eo,...t,events:e,documents:[],eventIndex:0,position:0,frames:[],anchors:new Map,nodeTags:new Map,tagHandlers:Object.create(null),totalMergeKeys:0,aliasCount:0};for(;i.eventIndex<i.events.length;){const e=i.events[i.eventIndex++];switch(i.position=to(e),e.type){case kn:i.anchors=new Map,i.nodeTags=new Map,i.aliasCount=0,i.tagHandlers=Object.create(null);for(const t of e.directives)"tag"===t.kind&&(i.tagHandlers[t.handle]=t.prefix);i.frames.push({kind:"document",position:i.position,value:void 0,hasValue:!1});break;case Sn:{const{value:t,tag:s}=ao(i,e);po(i,e,t,s,!0),ho(i,t,s);break}case jn:{const t=no(i,e,"tag:yaml.org,2002:seq"),s=i.schema.lookupSequenceTag(t);s||io(i,`unknown sequence tag !<${t}>`);const a=s.create(t),n=po(i,e,a,s,s.carrierIsResult);i.frames.push({kind:"sequence",position:i.position,value:a,tag:s,anchor:n,index:0});break}case An:{const t=no(i,e,"tag:yaml.org,2002:map"),s=i.schema.lookupMappingTag(t);s||io(i,`unknown mapping tag !<${t}>`);const a=s.create(t),n=po(i,e,a,s,s.carrierIsResult);i.frames.push({kind:"mapping",position:i.position,value:a,tag:s,anchor:n,key:void 0,keyPosition:i.position,hasKey:!1,keyIsMerge:!1,overridable:null});break}case On:{-1!==i.maxAliases&&++i.aliasCount>i.maxAliases&&io(i,`aliases exceeded maxAliases (${i.maxAliases})`);const t=i.source.slice(e.anchorStart,e.anchorEnd),s=i.anchors.get(t);s||io(i,`unidentified alias "${t}"`),s.isValueFinal||io(i,`recursive alias "${t}" is not supported for tag ${s.tag.tagName} because it uses finalize()`),ho(i,s.value,s.tag);break}case Cn:{const e=i.frames.pop();if("mapping"===e.kind&&e.hasKey&&(i.position=e.keyPosition,io(i,"incomplete mapping pair in event stream")),"document"===e.kind)i.documents.push(e.value);else{const t=e.tag.carrierIsResult?e.value:so(i,e.position,e.tag,e.value);e.anchor&&(e.anchor.value=t,e.anchor.isValueFinal=!0),ho(i,t,e.tag)}break}}}return i.documents}(function(e,t){const i=e.length,s={...xo,...t,input:`${e}\0`,length:i,position:0,line:0,lineStart:0,lineIndent:0,firstTabInLine:-1,depth:0,directives:[],tagHandlers:Object.create(null),events:[]},a=e.indexOf("\0");for(-1!==a&&xn.throwAt(e,a,"null byte is not allowed in input",s.filename);s.position<s.length&&(Bo(s),Uo(s,!0),!(s.position>=s.length));){const e=s.position;or(s),s.position===e&&Po(s,"can not read a document")}return s.events}(s,cn(i,a)),{...cn(i,n),source:s})}function dr(e,t){return!!(e&1<<t)}var cr={applyQuoteFlowKeysOption:function(e){if(!e.presenterOptions.quoteFlowKeys)return;if(!e.isKey||!e.flowOnly||e.style!==En)return;e.style=Nn},doubleQuoteForInvisibles:function(e){e.style===En&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(e.node.value)&&(e.style=Nn)},doubleQuoteWhitespaceOnly:function(e){e.style===En&&/^\s+$/.test(e.node.value)&&(e.style=Nn)},applyForceQuotesOption:function(e){if(!e.presenterOptions.forceQuotes)return;if(e.isKey||e.style!==En)return;if(e.node.tag!==e.presenterOptions.schema.defaultScalarTag.tagName)return;e.style=e.node.value.includes("\n")?Nn:hr(e)},tryLongOrMultilineAsBlock:function(e){if(e.style!==En||e.isKey)return;const t=e.node.value,i=-1!==t.indexOf("\n");if(!dr(e.allowedStylesMask,Pn))return void(i&&(e.style=Nn));const s=e.presenterOptions.lineWidth;if(-1===s)return void(i&&(e.style=Pn));const a=Math.max(Math.min(s,40),s-e.shiftOfContent);let n=0,o=!1;for(;n<=t.length;){let e=t.length;const i=t.indexOf("\n",n);-1!==i&&(e=i);const s=t.slice(n,e);if(s.length>a&&" "!==s[0]&&/ [^ \t]/.test(s)&&(o=!0),-1===i)break;n=i+1}o?e.style=Ln:i&&(e.style=Pn)},quoteInvalidPlain:function(e){e.style!==En||dr(e.allowedStylesMask,En)||(e.style=hr(e))},fallbackToDoubleQuoted:function(e){dr(e.allowedStylesMask,e.style)||(e.style=Nn)}};function hr(e){return"single"===e.presenterOptions.quoteStyle&&dr(e.allowedStylesMask,Tn)?Tn:Nn}Object.keys(cr).map(e=>Reflect.get(cr,e));const pr="tempus2016/decluttering-card-plus",ur="share-your-templates",mr=`https://github.com/${pr}/discussions/new?category=${ur}`,fr="decluttering-card-plus-community";function gr(e){let t=2e4;const i=e=>(t-=1+Math.ceil(e/16))>=0,s=e=>"string"==typeof e?i(e.length):!!i(0)&&(Array.isArray(e)?e.every(s):!e||"object"!=typeof e||Object.entries(e).every(([e,t])=>i(e.length)&&s(t)));return s(e)}const vr=e=>!!e&&"object"==typeof e&&!Array.isArray(e);function _r(e){if(gr(e))return JSON.parse(JSON.stringify(e),(e,t)=>"__proto__"===e?void 0:t)}const yr=/[\p{Cf}\u2800\u3164\u115F\u1160\uFFA0]/gu;function br(e){if("string"!=typeof e)return;const t=e.replace(yr,"").replace(/\s+/g," ").trim();return t?t.length>80?`${t.slice(0,79)}…`:t:void 0}const $r=["card","badge","row","element","group"];function wr(e){if(!vr(e))return{};const t={};for(const[i,s]of Object.entries(e))vr(s)&&$r.some(e=>void 0!==s[e])&&(t[i]=s);return t}function xr(e,t){return"string"==typeof t&&/^https:\/\/github\.com\//.test(t)?t:`https://github.com/${pr}/discussions/${e}`}function kr(e){var t,i,s,a,n;const o=function(e){if("string"!=typeof e||e.length>65536)return;const t=/^ {0,3}(`{3,}|~{3,})[ \t]*([\w-]*)/,i=[];let s;for(const o of function(e){return e.replace(/<!--[\s\S]*?(?:-->|$)/g,"")}(e).split("\n")){if(s){o.trim()===s.fence?(i.push({lang:s.lang,text:s.lines.join("\n")+"\n"}),s=void 0):s.lines.push(o);continue}const e=t.exec(o);e&&(s={fence:e[1],lang:e[2],lines:[]})}const a=i.find(e=>/^ya?ml$/i.test(e.lang)),n=null!=a?a:i.find(e=>""===e.lang);return null==n?void 0:n.text}(null==e?void 0:e.body);if(!o)return;let r;try{if(r=_r(function(e,t){const i=lr(e,t);if(0===i.length)throw new xn("expected a document, but the input is empty");if(1===i.length)return i[0];throw new xn("expected a single document in the stream, but found more")}(o,{maxAliases:50})),void 0===r)return}catch(h){return}if(!Os(r).ok)return;if("number"!=typeof(null==e?void 0:e.number))return;const{template:l,includes:d}=r,c=Ke(r,["template","includes"]);return delete c.type,"string"!=typeof c.description&&delete c.description,{id:e.number,title:null!==(t=br(e.title))&&void 0!==t?t:l,author:"string"==typeof(null===(i=e.user)||void 0===i?void 0:i.login)?e.user.login:"",url:xr(e.number,e.html_url),name:l.trim(),template:c,includes:wr(d),reactions:"number"==typeof(null===(s=e.reactions)||void 0===s?void 0:s.total_count)?e.reactions.total_count:0,updated:"string"==typeof(null!==(a=e.updated_at)&&void 0!==a?a:e.created_at)?null!==(n=e.updated_at)&&void 0!==n?n:e.created_at:""}}const jr=["lock","alarm_control_panel","cover","valve","siren","script","automation","button","input_button","water_heater","lawn_mower","update"],Ar=["more-info","navigate","none","assist"],Sr=["action","perform_action","service","type"],Or=/\b[a-z][a-z0-9+.-]{1,31}:(?:\/\/)?[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?|\/\/[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?/gi,Cr=[/(?:url|image-set|src)\(\s*['"]?([^'")\s{}]+)/gi,/@import\s+(?:url\(\s*)?['"]?([^'")\s;{}]+)/gi],Er=/^(?:\/(?!\/)|#|data:)/i,Tr=["image","url","url_path","entity_picture","camera_image","image_url","icon_url","src"],Nr=/\[\[\[|\{\{|\{%|\$\{/,Pr=/^\s*(?:javascript|data|vbscript):/i,Lr=/position\s*:\s*(?:fixed|absolute)/i,Ir=/opacity\s*:\s*0(?:[^.\d]|$)|visibility\s*:\s*hidden|transparent/i,Fr=e=>"string"==typeof e&&jr.includes(e.split(".")[0]),Mr=e=>e.replace(/\\/g,"/"),Vr="*";function Hr(e,t){const i=[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);if(i.length)return i.includes(Vr)?[Vr]:i;const s=[].concat(null!=t?t:[]).filter(e=>"string"==typeof e);if(!s.length)return[Vr];const a=s.map(e=>{const t=e.indexOf("."),i=-1===t?e:e.slice(0,t);return/^[a-z_]+$/.test(i)?i:Vr});return a.includes(Vr)?[Vr]:[...new Set(a)]}function Dr(e,t,i=new Set){var s,a,n,o;if(Array.isArray(e))return e.forEach(e=>Dr(e,t,i)),i;if(!vr(e))return i;const r="string"==typeof e.entity?e.entity:t,l=e.action;if("string"==typeof l&&!Ar.includes(l)&&!l.includes("[[")&&"perform-action"!==l&&"call-service"!==l&&"fire-dom-event"!==l&&"url"!==l){const t=[].concat(null!==(o=null!==(n=null!==(a=null===(s=e.target)||void 0===s?void 0:s.entity_id)&&void 0!==a?a:e.entity_id)&&void 0!==n?n:r)&&void 0!==o?o:[]);t.length&&!t.some(e=>"string"!=typeof e||e.includes("[["))||i.add(l)}return Object.values(e).forEach(e=>Dr(e,r,i)),i}function qr(e,t){const i=$r.find(t=>void 0!==e[t]);if(i)try{return d(t,e,e[i],void 0,void 0,!0)}catch(s){return}}function Rr(e){const t=new Set,i=new Set;let s=!1,a=!1,n=!1,o=!1;const r=e=>{const t=Mr(e).trim();!t||Er.test(t)||t.startsWith("[[")||t.startsWith("{{")||/^[\w.-]+\.[a-z]{2,}(?:[:/?#]|$)/i.test(t)&&i.add(t)},l=new Set,d=(e,i)=>{for(const s of e)if(i.includes(Vr))t.add(`${s} *`);else for(const e of i)jr.includes(e)&&t.add(`${s} ${e}.*`)},c=(h,p)=>{var u;if("string"==typeof h)return void(e=>{var t;const s=Mr(e);for(const a of null!==(t=s.match(Or))&&void 0!==t?t:[])i.add(a);for(const a of Cr){a.lastIndex=0;let e=a.exec(s);for(;e;)Er.test(e[1])||i.add(e[1]),e=a.exec(s)}Nr.test(e)&&(a=!0),Lr.test(e)&&Ir.test(e)&&(o=!0)})(h);if(Array.isArray(h))return void h.forEach(e=>c(e,p));if(!vr(h))return;const m="string"==typeof h.entity?h.entity:p;Object.keys(h).some(e=>e.includes("[["))&&(n=!0),Sr.some(e=>"string"==typeof h[e]&&h[e].includes("[["))&&(n=!0),"string"==typeof h.action&&((e,s)=>{var n,o,r,l,d,c;const h=e.action;if("perform-action"===h||"call-service"===h){const i=null!==(n=e.perform_action)&&void 0!==n?n:e.service;return void("string"!=typeof i?t.add("?"):i.includes("[[")||t.add(i))}if("fire-dom-event"===h)return void t.add("fire-dom-event");if("url"===h)return i.add("string"==typeof e.url_path?e.url_path:"?"),void("string"==typeof e.url_path&&Pr.test(e.url_path)&&(a=!0));if(Ar.includes(h)||h.includes("[["))return;const p=[].concat(null!==(c=null!==(d=null!==(l=null!==(r=null===(o=e.target)||void 0===o?void 0:o.entity_id)&&void 0!==r?r:e.entity_id)&&void 0!==l?l:e.entity)&&void 0!==d?d:s)&&void 0!==c?c:[]);for(const i of p)Fr(i)&&t.add(`${h} ${i}`)})(h,m),"iframe"!==h.type&&"webpage"!==h.type||(s=!0);for(const e of Tr)"string"==typeof h[e]&&r(h[e]);if("string"==typeof h.type&&Pe.includes(h.type)){const t=(t=>{if("string"==typeof t)return t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0})(h.template);if(t){if(b(h.for_each_from)){const e=h.for_each_from,i=$r.map(e=>t[e]).find(e=>void 0!==e);d(Dr(i,void 0),Hr(e.domain,e.entities))}const e=(f=h.variables,Array.isArray(f)?f.filter(vr):vr(f)?Object.entries(f).map(([e,t])=>({[e]:t})):void 0);(null==e?void 0:e.length)&&!l.has(h.template)&&(l.add(h.template),c(qr(t,e),void 0),l.delete(h.template))}}var f;if("custom:auto-entities"===h.type&&vr(h.filter))for(const e of[].concat(null!==(u=h.filter.include)&&void 0!==u?u:[])){if(!vr(e))continue;const t=Hr(e.domain,e.entity_id);d(Dr(e.options,void 0),t),d(Dr(h.card,void 0),t)}Object.values(h).forEach(e=>c(e,m))},h=[e.template,...Object.values(e.includes)].map(rs);c(h,void 0);for(const p of h)c(qr(p),void 0);return{actions:[...t].sort(),urls:[...i].sort(),embeds:s,scripts:a,placeholders:n,overlay:o}}function zr(e){return e.filter(e=>{var t;return(null===(t=null==e?void 0:e.category)||void 0===t?void 0:t.slug)===ur}).map(kr).filter(e=>!!e).sort((e,t)=>t.reactions-e.reactions||t.updated.localeCompare(e.updated))}class Ur extends Error{}function Wr(e){var t;if(!vr(e)||"number"!=typeof e.id||"string"!=typeof e.name)return;if(!vr(e.template))return;const i=_r({template:e.template,includes:e.includes});if(!i||!vr(i.template))return;if(!Os(Object.assign({template:e.name},i.template)).ok)return;const s=Object.assign({},i.template);return delete s.type,"string"!=typeof s.description&&delete s.description,{id:e.id,title:null!==(t=br(e.title))&&void 0!==t?t:e.name,author:"string"==typeof e.author?e.author:"",url:xr(e.id,e.url),name:e.name,template:s,includes:wr(i.includes),reactions:"number"==typeof e.reactions?e.reactions:0,updated:"string"==typeof e.updated?e.updated:""}}async function Br(e={}){var t,i,s,a;const n=null!==(t=e.fetcher)&&void 0!==t?t:fetch.bind(globalThis),o=null!==(i=e.storage)&&void 0!==i?i:"undefined"==typeof localStorage?void 0:localStorage,r=null!==(s=e.now)&&void 0!==s?s:Date.now(),l=function(e){var t;try{const i=JSON.parse(null!==(t=null==e?void 0:e.getItem(fr))&&void 0!==t?t:"null");if(!i||!Array.isArray(i.entries)||"number"!=typeof i.fetched)return;return{entries:i.entries.map(Wr).filter(e=>!!e),fetched:i.fetched}}catch(i){return}}(o);if(l&&!e.refresh&&r-l.fetched<216e5)return l;const d=[];try{for(let e=1;e<=10;e+=1){const t=await n(`https://api.github.com/repos/${pr}/discussions?per_page=100&page=${e}`,{headers:{Accept:"application/vnd.github+json"}});if(!t.ok){const e=new Ur(`GitHub answered ${t.status}`);throw"0"===t.headers.get("x-ratelimit-remaining")&&(e.retryAt=1e3*Number(t.headers.get("x-ratelimit-reset"))||void 0),e}const i=await t.json();if(!Array.isArray(i))break;if(d.push(...i),i.length<100)break}}catch(h){const e=h instanceof Ur?h:new Ur(null!==(a=null==h?void 0:h.message)&&void 0!==a?a:String(h));throw e.cached=l,e}const c={entries:zr(d),fetched:r};try{null==o||o.setItem(fr,JSON.stringify(c))}catch(p){}return c}function Kr(e,t){return{discussion:e.id,updated:e.updated,name:t,author:e.author}}function Jr(e,t){return Object.assign(Object.assign({},e),{source:t})}function Yr(e,t){return e.map(({name:e,source:i})=>{var s;const a=t.entries.find(e=>e.id===i.discussion),n="string"==typeof i.name?i.name:void 0,o=a?function(e,t){return void 0===t||t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0}(a,n):void 0;if(!a||!o)return Object.assign({name:e,status:"gone"},a?{entry:a}:{});if("string"!=typeof i.author||!i.author||i.author!==a.author)return{name:e,status:"unverified",entry:a};const r=Date.parse(null!==(s=i.updated)&&void 0!==s?s:""),l=Date.parse(a.updated);return{name:e,status:(Number.isFinite(r)?Number.isFinite(l)&&l>r:Number.isFinite(l))?"update":"current",entry:a,latest:Jr(o,Kr(a,null!=n?n:a.name))}})}function Zr(e){if(""===e)return[];const t=e.split("\n");return""===t[t.length-1]&&t.pop(),t}function Gr(e,t){const i=e=>({kind:"remove",text:e}),s=e=>({kind:"add",text:e});if(!e.length||!t.length||e.length*t.length>4e6)return[...e.map(i),...t.map(s)];const a=e.length,n=t.length,o=Array.from({length:a+1},()=>new Uint32Array(n+1));for(let c=a-1;c>=0;c-=1)for(let i=n-1;i>=0;i-=1)o[c][i]=e[c]===t[i]?o[c+1][i+1]+1:Math.max(o[c+1][i],o[c][i+1]);const r=[];let l=0,d=0;for(;l<a&&d<n;)e[l]===t[d]?(r.push({kind:"same",text:e[l]}),l+=1,d+=1):o[l+1][d]>=o[l][d+1]?(r.push(i(e[l])),l+=1):(r.push(s(t[d])),d+=1);for(;l<a;)r.push(i(e[l++]));for(;d<n;)r.push(s(t[d++]));return r}const Qr=e`<style>
  .dcp-diff {
    margin: 0;
    padding: 4px 0;
    overflow: auto;
    font-family: var(--ha-font-family-code, monospace);
    font-size: 0.85em;
    line-height: 1.45;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    -webkit-user-select: text;
    user-select: text;
  }
  .dcp-diff div {
    white-space: pre;
    padding: 0 8px;
  }
  .dcp-diff .add {
    background: color-mix(in srgb, var(--success-color, #43a047) 18%, transparent);
  }
  .dcp-diff .remove {
    background: color-mix(in srgb, var(--error-color, #db4437) 18%, transparent);
  }
  .dcp-diff .skip {
    color: var(--secondary-text-color);
    font-style: italic;
  }
  .dcp-diff-none {
    margin: 0;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }
</style>`;function Xr(e){return"string"==typeof e?e:void 0===e?"":Y(e)}const el={same:" ",add:"+",remove:"-"};function tl(t,i,s,n=3){const o=function(e,t){const i=Zr(e),s=Zr(t);let a=0;for(;a<i.length&&a<s.length&&i[a]===s[a];)a+=1;let n=i.length,o=s.length;for(;n>a&&o>a&&i[n-1]===s[o-1];)n-=1,o-=1;const r=i.slice(0,a).map(e=>({kind:"same",text:e})),l=i.slice(n).map(e=>({kind:"same",text:e}));return[...r,...Gr(i.slice(a,n),s.slice(a,o)),...l]}(Xr(t),Xr(i));return function(e){return e.some(e=>"same"!==e.kind)}(o)?e`${Qr}
    <div class="dcp-diff" role="figure" aria-label=${a("diff.label",void 0,s)}>
      ${function(e,t=3){const i=e.map(e=>"same"!==e.kind),s=new Array(e.length).fill(!1);e.forEach((i,a)=>{if("same"!==i.kind)for(let n=Math.max(0,a-t);n<=Math.min(e.length-1,a+t);n+=1)s[n]=!0});const a=[];let n=0;for(;n<e.length;){if(i[n]||s[n]){a.push(e[n]),n+=1;continue}let t=n;for(;t<e.length&&!i[t]&&!s[t];)t+=1;const o=t-n;1===o?a.push(e[n]):a.push({kind:"skip",count:o}),n=t}return a}(o,n).map(t=>function(t,i){return"skip"===t.kind?e`<div class="skip">${a("diff.skipped",{count:t.count},i)}</div>`:e`<div class=${t.kind}>${el[t.kind]} ${t.text}</div>`}(t,s))}
    </div>`:e`${Qr}
      <p class="dcp-diff-none">${a("diff.no_change",void 0,s)}</p>`}function il(t,i,s){var n,o;const r=null!==(n=JSON.stringify(t))&&void 0!==n?n:"",l=null!==(o=JSON.stringify(i))&&void 0!==o?o:"";return e`
    ${tl(t,i,s)}
    <ha-expansion-panel outlined>
      <span slot="header">${a("diff.full",void 0,s)}</span>
      <p class="dcp-diff-none">${a("diff.before",void 0,s)}</p>
      ${ua(r,e`<ha-yaml-editor .hass=${s} .defaultValue=${t} read-only></ha-yaml-editor>`)}
      <p class="dcp-diff-none">${a("diff.after",void 0,s)}</p>
      ${ua(l,e`<ha-yaml-editor .hass=${s} .defaultValue=${i} read-only></ha-yaml-editor>`)}
    </ha-expansion-panel>
  `}const sl=["readme","related","setup","requires_entities","requires_homeassistant","requires_card"];class al extends m{constructor(){super(...arguments),this._importParses=!0,this._importErrors=[],this._importArmedAt=0,this._copyState="",this._busy=!1,this._libraryDestination="view",this._communityLoading=!1,this._communityKnownFailed=!1,this._installArmedAt=0,this._postCopyState="",this._setupValues={},this._updatesLoading=!1,this._updateArmedAt=0,this._trashArmedAt=0}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=G())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:A()}static get styles(){return ta}_fireConfigChanged(e){g(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return ea(this,e,t,i)}render(){return this.hass&&this._config?this._renderShare():e``}async _loadTrash(){this.hass&&(this._trash=await Je(this.hass))}_renderShare(){const{payload:t,notes:i}=js(this._config,S(this._savedLovelace));return e`
      <div class="share">
        ${this._renderDetails()}
        <h3>${a("share.export_header",void 0,this.hass)}</h3>
        <p class="hint">${a("share.export_hint",void 0,this.hass)}</p>
        ${i.map(t=>e`<ha-alert alert-type="info">${t}</ha-alert>`)}
        <ha-yaml-editor id="export" .hass=${this.hass} .defaultValue=${t} read-only></ha-yaml-editor>
        <ha-button @click=${this._copyExport}>
          ${"done"===this._copyState?a("share.copied",void 0,this.hass):"failed"===this._copyState?a("share.copy_failed",void 0,this.hass):a("share.copy",void 0,this.hass)}
        </ha-button>
        <ha-button @click=${this._downloadExport}> ${a("share.download",void 0,this.hass)} </ha-button>
        <ha-button @click=${this._copyPost}>
          ${"done"===this._postCopyState?a("share.copied",void 0,this.hass):"failed"===this._postCopyState?a("share.copy_failed",void 0,this.hass):a("share.post_copy",void 0,this.hass)}
        </ha-button>
        <p class="hint">
          ${a("share.post_hint",void 0,this.hass)}
          <a href=${mr} target="_blank" rel="noopener noreferrer"
            >${a("share.post_open",void 0,this.hass)}</a
          >
        </p>

        <h3>${a("share.import_header",void 0,this.hass)}</h3>
        <p class="hint">${a("share.import_hint",void 0,this.hass)}</p>
        <ha-yaml-editor id="import" .hass=${this.hass} @value-changed=${this._importChanged}></ha-yaml-editor>
        <input
          id="import-file"
          type="file"
          accept=".yaml,.yml,.json,text/yaml,application/json"
          hidden
          @change=${this._importFile}
        />
        <ha-button @click=${()=>{var e;return null===(e=this.renderRoot.querySelector("#import-file"))||void 0===e?void 0:e.click()}}>
          ${a("share.import_file",void 0,this.hass)}
        </ha-button>
        ${this._importErrors.map(t=>e`<ha-alert alert-type="error">${t}</ha-alert>`)}
        ${this._renderImportDetails()}
        ${this._importClash?e`<ha-alert alert-type="warning">
                ${a("share.import_clash",{name:this._importClash},this.hass)}
              </ha-alert>`:e``}
        ${this._importRisks?this._renderRisks(this._importRisks,"share.import_risks"):e``}
        <ha-button @click=${this._import}>
          ${a(this._importClash||this._importRisks?"share.import_anyway":"share.import",void 0,this.hass)}
        </ha-button>
        ${this._importClash?e`<ha-button @click=${this._importAsCopy}>
                ${a("share.import_copy",void 0,this.hass)}
              </ha-button>`:e``}
        ${this._renderTrash()}

        <h3>${a("share.library_header",void 0,this.hass)}</h3>
        <p class="hint">${a("share.library_hint",void 0,this.hass)}</p>
        ${this._renderLibrary()}

        <h3>${a("share.community_header",void 0,this.hass)}</h3>
        <p class="hint">${a("share.community_hint",void 0,this.hass)}</p>
        ${this._renderCommunity()} ${this._renderInstalled()}
        ${this._toolError?e`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:e``}
      </div>
    `}_renderDetails(){var t,i,s,n;const o=this._config,r=function(e){const t=e&&"object"==typeof e?e:{},i=t.author&&"object"==typeof t.author&&!Array.isArray(t.author)?t.author:void 0,s=t.requires&&"object"==typeof t.requires&&!Array.isArray(t.requires)?t.requires:{},a={author_name:gs(i?i.name:t.author),author_github:gs(null==i?void 0:i.github),author_email:gs(null==i?void 0:i.email),author_url:gs(null==i?void 0:i.url),license:gs(t.license),help:gs(t.help),homepage:gs(t.homepage),readme:gs(t.readme),related:vs(t.related),setup:vs(t.setup),requires_integrations:vs(s.integrations),requires_entities:vs(s.entities),requires_custom_cards:vs(s.custom_cards),requires_homeassistant:gs(s.homeassistant),requires_card:gs(s.card)};for(const n of Object.keys(a))void 0===a[n]&&delete a[n];return a}(o),l=e=>[...new Set(e)].sort().map(e=>({value:e,label:e})),d=e=>({select:{multiple:!0,custom_value:!0,options:l(e)}}),c=Object.keys(S(this._savedLovelace)).filter(e=>e!==o.template),h=[...C(o).map(e=>e.name),...null!==(t=r.setup)&&void 0!==t?t:[]],p=(Array.isArray(null===(s=null===(i=this.hass)||void 0===i?void 0:i.config)||void 0===s?void 0:s.components)?this.hass.config.components:[]).filter(e=>!e.includes(".")),u=(null!==(n=window.customCards)&&void 0!==n?n:[]).map(e=>e.type).filter(e=>"string"==typeof e),m=(e,t)=>({name:e,selector:t}),f=[m("author_name",{text:{}}),m("author_github",{text:{}}),m("author_email",{text:{}}),m("author_url",{text:{type:"url"}}),m("license",{text:{}}),m("help",{text:{type:"url"}}),m("homepage",{text:{type:"url"}}),m("readme",{text:{multiline:!0}}),m("related",d(c)),m("setup",d(h)),m("requires_integrations",d(p)),m("requires_entities",d([])),m("requires_custom_cards",d(u)),m("requires_homeassistant",{text:{}}),m("requires_card",{text:{}})];return e`
      <ha-expansion-panel outlined class="details">
        <span slot="header">${a("share.details_header",void 0,this.hass)}</span>
        <p class="hint">${a("share.details_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${r}
          .schema=${f}
          .computeLabel=${e=>a(`share.details_${e.name}`,void 0,this.hass)}
          .computeHelper=${e=>sl.includes(e.name)?a(`share.details_${e.name}_helper`,void 0,this.hass):""}
          @value-changed=${this._detailsChanged}
        ></ha-form>
      </ha-expansion-panel>
    `}_detailsChanged(e){if(e.stopPropagation(),!this._config)return;const t=function(e,t){var i;const s=Object.assign({},e),a=(e,t)=>{void 0===t||Array.isArray(t)&&!t.length?delete s[e]:s[e]=t},n={},o=_s(t.author_name);o&&(n.name=o);for(const c of["github","email","url"]){const e=_s(t[`author_${c}`]);e&&(n[c]=e)}const r=e.author&&"object"==typeof e.author&&!Array.isArray(e.author)?e.author:{};for(const[c,h]of Object.entries(r))["name","github","email","url"].includes(c)||(n[c]=h);const l=Object.keys(n);a("author",l.length?1===l.length&&o?o:n:void 0);for(const c of["license","help","homepage"])a(c,_s(t[c]));a("readme","string"==typeof t.readme&&t.readme.trim()?t.readme:void 0),a("related",ys(t.related)),a("setup",ys(t.setup));const d=e.requires&&"object"==typeof e.requires&&!Array.isArray(e.requires)?Object.assign({},e.requires):{};for(const[c,h]of Object.entries(fs)){const e=[].concat(null!==(i=d[c])&&void 0!==i?i:[]).filter(e=>"string"!=typeof e),s=[...ys(t[h]),...e];s.length?d[c]=s:delete d[c]}for(const c of["homeassistant","card"]){const e=_s(t[`requires_${c}`]);e?d[c]=e:delete d[c]}return a("requires",Object.keys(d).length?d:void 0),s}(this._config,e.detail.value);this._fireConfigChanged(t)}_renderCommunity(){const t=this._community,i=e`
      ${this._communityError?e`<ha-alert alert-type="warning">${this._communityError}</ha-alert>`:e``}
      ${this._communityError&&t?e`<p class="hint">
              ${a("share.community_showing_cached",{time:(e=>{var t,i;return new Date(e).toLocaleString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)})(t.fetched)},this.hass)}
            </p>`:e``}
    `;if(!t)return e`
        <div class="library">
          ${i}
          <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!1)}}>
            ${a(this._communityLoading?"share.community_loading":"share.community_load",void 0,this.hass)}
          </ha-button>
        </div>
      `;const s=this._communityExisting(),n=t.entries.find(e=>e.id===this._communitySelected),o=n?`community:${n.id}:${n.updated}`:"",r=!!n&&this._installPending===o,l=n&&s.includes(n.name)?Ss(n.name,s):void 0,d=n?function(e,t){const i=new Set,s=new Set;for(const a of[e.template,...Object.values(e.includes)]){const e=ks(a);e.customTypes.forEach(e=>i.add(e)),e.templateRefs.forEach(e=>s.add(e))}return{customTypes:[...i].sort(),templates:[...s].filter(i=>i!==e.name&&!(i in e.includes)&&!t.includes(i)).sort()}}(n,s):void 0,c=n?Object.keys(n.includes).filter(e=>!s.includes(e)):[],h=n?Rr(n):void 0,p=void 0!==this._communityKnown;return e`
      <div class="library">
        ${i}
        ${t.entries.length?e`<ha-form
                .hass=${this.hass}
                .data=${{entry:n?String(n.id):""}}
                .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:t.entries.map(e=>({value:String(e.id),label:a("share.community_by",{title:e.title,author:e.author},this.hass)}))}}}]}
                .computeLabel=${()=>a("share.community_pick",void 0,this.hass)}
                @value-changed=${this._communityPicked}
              ></ha-form>`:e`<p class="hint">${a("share.community_none",void 0,this.hass)}</p>`}
        ${n&&d?e`
                <p class="hint">
                  ${"string"==typeof n.template.description?n.template.description:""}
                  <a href=${n.url} target="_blank" rel="noopener noreferrer"
                    >${a("share.community_open",void 0,this.hass)}</a
                  >
                </p>
                ${this._renderAbout(n.template)}
                ${c.length?e`<p class="hint">
                        ${a("share.library_needs",{names:c.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderUnmet([n.template,...Object.values(n.includes)])}
                ${this._renderMissingCards([n.template,...Object.values(n.includes)])}
                ${d.templates.length?e`<ha-alert alert-type="warning">
                        ${a("share.community_needs_templates",{names:d.templates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
                ${h&&Zs(h)?this._renderRisks(h,"share.community_risks"):e``}
                ${this._renderSetup([n.template,...Object.values(n.includes)])}
                <ha-expansion-panel outlined expanded>
                  <span slot="header">${a("share.library_preview",void 0,this.hass)}</span>
                  ${ua(`${n.id}:${n.updated}`,e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${Object.assign(Object.assign({template:n.name},n.template),Object.keys(n.includes).length?{includes:n.includes}:{})}
                      read-only
                    ></ha-yaml-editor>`)}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{where:this._libraryDestination}}
                  .schema=${[{name:"where",selector:{select:{mode:"dropdown",options:[{value:"view",label:a("share.library_where_view",void 0,this.hass)},{value:"root",label:a("share.library_where_root",void 0,this.hass)}]}}}]}
                  .computeLabel=${()=>a("share.library_where",void 0,this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                ${this._communityKnownFailed?e`<ha-alert alert-type="error">
                        ${a("share.community_names_failed",void 0,this.hass)}
                      </ha-alert>`:e``}
                <ha-button .disabled=${this._busy||!p} @click=${()=>{this._installShared(n)}}>
                  ${p||this._communityKnownFailed?r?a("share.install_anyway",void 0,this.hass):l?a("share.community_install_as",{name:l},this.hass):a("share.install",void 0,this.hass):a("share.community_names_loading",void 0,this.hass)}
                </ha-button>
              `:e``}
        <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!0)}}>
          ${a(this._communityLoading?"share.community_loading":"share.community_refresh",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderAbout(t){var i,s,n;const o=ns(t),r=(l=o.author)?[l.name,l.github?`@${l.github}`:void 0,l.email].filter(Boolean).join(" · "):"";var l;const d=null!==(s=null===(i=o.author)||void 0===i?void 0:i.url)&&void 0!==s?s:(null===(n=o.author)||void 0===n?void 0:n.github)?`https://github.com/${o.author.github}`:void 0,c=[o.help?{url:o.help,label:a("share.about_help",void 0,this.hass)}:void 0,o.homepage?{url:o.homepage,label:a("share.about_homepage",void 0,this.hass)}:void 0].filter(e=>!!e);return r||o.license||c.length||o.readme?e`
      ${r||o.license||c.length?e`<p class="hint about">
              ${r?e`<span
                      >${a("share.about_author",void 0,this.hass)}
                      ${d?e`<a href=${d} target="_blank" rel="noopener noreferrer">${r}</a>`:r}</span
                    >`:e``}
              ${o.license?e`<span>${a("share.about_license",{license:o.license},this.hass)}</span>`:e``}
              ${c.map(t=>e`<a href=${t.url} target="_blank" rel="noopener noreferrer">${t.label}</a>`)}
            </p>`:e``}
      ${o.readme?e`<ha-expansion-panel outlined>
              <span slot="header">${a("share.about_readme",void 0,this.hass)}</span>
              <ha-markdown class="readme" .content=${o.readme}></ha-markdown>
            </ha-expansion-panel>`:e``}
    `:e``}_renderUnmet(t){const i=t.filter(e=>void 0!==e),s=new Set(Cs(i,Ys)),n=function(e,t){const i=new Set,s=[];for(const a of e)for(const e of cs(a)){const a=`${e.kind}:${e.any.join("|")}`;if(i.has(a))continue;if(i.add(a),ps(e,t))continue;const n="homeassistant"===e.kind?t.homeassistant:"card"===e.kind?t.card:void 0;s.push(n?Object.assign(Object.assign({},e),{have:n}):e)}return s}(i,(o=this.hass,r=at,l=Ys,{components:Array.isArray(null===(d=null==o?void 0:o.config)||void 0===d?void 0:d.components)?o.config.components:[],entities:Object.keys(null!==(c=null==o?void 0:o.states)&&void 0!==c?c:{}),homeassistant:"string"==typeof(null===(h=null==o?void 0:o.config)||void 0===h?void 0:h.version)?o.config.version:void 0,card:r,isDefined:l})).filter(e=>!("custom_card"===e.kind&&!e.message&&e.any.every(e=>s.has(e))));var o,r,l,d,c,h;return n.length?e`<ha-alert alert-type="warning" .title=${a("share.requires_header",void 0,this.hass)}>
      <ul class="risks">
        ${n.map(t=>e`<li>${this._unmetLine(t)}</li>`)}
      </ul>
      ${a("share.requires_hint",void 0,this.hass)}
    </ha-alert>`:e``}_unmetLine(e){var t;const i=a("share.requires_or",void 0,this.hass),s=a(`share.requires_${e.kind}`,{names:e.any.join(i),want:e.any[0],have:null!==(t=e.have)&&void 0!==t?t:"?"},this.hass);return e.message?`${s}: ${e.message}`:s}_renderSetup(t){const i=t.filter(e=>void 0!==e),s=function(e){const t=[];for(const i of e)for(const e of ns(i).setup)t.includes(e)||t.push(e);return t}(i);if(!s.length)return e``;const n=e=>{if(e in this._setupValues)return this._setupValues[e];for(const t of i){const i=us(t,e);if(void 0!==i)return i}return""};return e`
      <h4>${a("share.setup_header",void 0,this.hass)}</h4>
      <p class="hint">${a("share.setup_hint",void 0,this.hass)}</p>
      <ha-form
        .hass=${this.hass}
        .data=${s.reduce((e,t)=>Object.assign(Object.assign({},e),{[t]:n(t)}),{})}
        .schema=${s.map(e=>({name:e,selector:{text:{}}}))}
        .computeLabel=${e=>e.name}
        @value-changed=${this._setupChanged}
      ></ha-form>
    `}_setupChanged(e){var t;e.stopPropagation();const i={};for(const[s,a]of Object.entries(null!==(t=e.detail.value)&&void 0!==t?t:{}))i[s]=null==a?"":String(a);this._setupValues=i}_keptSetup(e){const t={};for(const i of ns(e).setup){const s=us(e,i);void 0!==s&&(t[i]=s)}return t}_renderRisks(t,i){return e`<ha-alert alert-type="warning" .title=${a(i,void 0,this.hass)}>
      <ul class="risks">
        ${t.actions.length?e`<li>${a("share.community_risk_actions",{list:t.actions.join(", ")},this.hass)}</li>`:e``}
        ${t.urls.length?e`<li>${a("share.community_risk_urls",{list:t.urls.join(", ")},this.hass)}</li>`:e``}
        ${t.embeds?e`<li>${a("share.community_risk_embeds",void 0,this.hass)}</li>`:e``}
        ${t.scripts?e`<li>${a("share.community_risk_scripts",void 0,this.hass)}</li>`:e``}
        ${t.placeholders?e`<li>${a("share.community_risk_placeholders",void 0,this.hass)}</li>`:e``}
        ${t.overlay?e`<li>${a("share.community_risk_overlay",void 0,this.hass)}</li>`:e``}
      </ul>
    </ha-alert>`}async _loadCommunity(e){var t,i;this._communityLoading=!0,this._communityError=void 0,this._installPending=void 0,this._communityKnown=void 0,this._communityKnownFailed=!1;try{this._community=await Br({refresh:e})}catch(s){const e=s;e.cached&&(this._community=e.cached),this._communityError=e.retryAt?a("share.community_rate_limited",{time:new Date(e.retryAt).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)},this.hass):a("share.community_failed",{message:e.message},this.hass)}finally{this._communityLoading=!1}this._community&&this._loadCommunityKnown()}_communityExisting(){var e;const t=Object.keys(S(this._savedLovelace));return[...new Set([...t,...null!==(e=this._communityKnown)&&void 0!==e?e:[]])]}async _loadCommunityKnown(){try{const e=await Se(this.hass,this._savedLovelace);this._communityKnown=Object.keys(e)}catch(e){this._communityKnownFailed=!0}}_communityPicked(e){e.stopPropagation();const t=Number(e.detail.value.entry);this._communitySelected=Number.isFinite(t)&&t>0?t:void 0,this._installPending=void 0,this._setupValues={}}async _installShared(e){var t,i,s,a,n;if(void 0===this._communityKnown)return;const o=`community:${e.id}:${e.updated}`;if(this._installPending!==o)return this._installPending=o,void(this._installArmedAt=Date.now());if(Date.now()-this._installArmedAt<Gs)return;const r=G(),l=this._communityExisting(),d=l.includes(e.name)?Ss(e.name,l):e.name,c=[...Object.entries(e.includes).filter(([e])=>!l.includes(e)).map(([t,i])=>[t,Jr(ms(i,this._setupValues),Kr(e,t))]),[d,Jr(ms(e.template,this._setupValues),Kr(e,e.name))]],h=ae(null!==(t=null==r?void 0:r.config)&&void 0!==t?t:this.lovelace,null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""),p=null!==(n=null===(a=null==h?void 0:h.view)||void 0===a?void 0:a.index)&&void 0!==n?n:0;await this._saveDashboard(e=>c.reduce((e,[t,i])=>"root"===this._libraryDestination?Ye(e,t,i):Ze(e,p,Object.assign({type:Te,template:t},i,{type:Te,template:t})),e),"community_install")&&(this._installPending=void 0,this._setupValues={})}_renderMissingCards(t){const i=Cs(t.filter(e=>void 0!==e),Ys);return i.length?e`<ha-alert alert-type="warning">
      ${a(1===i.length?"share.missing_card_one":"share.missing_card_many",{cards:i.join(", ")},this.hass)}
    </ha-alert>`:e``}_renderInstalled(){var t;const i=Ge(this._savedLovelace);if(!i.length)return e``;const s=new Map((null!==(t=this._updates)&&void 0!==t?t:[]).map(e=>[e.name,e]));return e`
      <h3>${a("share.installed_header",void 0,this.hass)}</h3>
      <p class="hint">${a("share.installed_hint",void 0,this.hass)}</p>
      ${this._updatesError?e`<ha-alert alert-type="warning">${this._updatesError}</ha-alert>`:e``}
      <ul class="installed">
        ${i.map(({name:t,source:i,template:n})=>{var o,r;const l=s.get(t);return e`<li>
            ${t} —
            <a
              href=${null!==(r=null===(o=null==l?void 0:l.entry)||void 0===o?void 0:o.url)&&void 0!==r?r:`https://github.com/${pr}/discussions/${i.discussion}`}
              target="_blank"
              rel="noopener noreferrer"
              >${a("share.installed_from",{discussion:i.discussion},this.hass)}</a
            >
            ${l?e`<span class="status"
                    >${a(`share.installed_status_${l.status}`,void 0,this.hass)}</span
                  >`:e``}
            ${"update"===(null==l?void 0:l.status)&&l.latest?this._renderUpdate(t,n,l):e``}
          </li>`})}
      </ul>
      <ha-button .disabled=${this._updatesLoading} @click=${()=>{this._checkUpdates()}}>
        ${a(this._updatesLoading?"share.community_loading":"share.installed_check",void 0,this.hass)}
      </ha-button>
    `}_renderUpdate(t,i,s){const n=ms(s.latest,this._keptSetup(i)),o=e=>{const t=Object.assign({},e);return delete t.source,delete t.type,delete t.template,t},r=o(i),l=o(n),d=Rr({template:l,includes:{}}),c=function(e,t){return{actions:e.actions.filter(e=>!t.actions.includes(e)),urls:e.urls.filter(e=>!t.urls.includes(e)),embeds:e.embeds&&!t.embeds,scripts:e.scripts&&!t.scripts,placeholders:e.placeholders&&!t.placeholders,overlay:e.overlay&&!t.overlay}}(d,Rr({template:r,includes:{}})),h=this._updatePending===t;return e`
      <p class="hint">${a("share.installed_compare",void 0,this.hass)}</p>
      ${il(r,l,this.hass)} ${this._renderMissingCards([n])} ${this._renderUnmet([n])}
      ${Zs(c)?this._renderRisks(c,"share.installed_risks_new"):Zs(d)?this._renderRisks(d,"share.installed_risks"):e``}
      ${h?e`<ha-alert alert-type="warning">
              ${a("share.installed_update_confirm",{name:t},this.hass)}
            </ha-alert>`:e``}
      <ha-button .disabled=${this._busy} @click=${()=>{this._updateShared(t,n)}}>
        ${a(h?"share.installed_update_anyway":"share.installed_update",void 0,this.hass)}
      </ha-button>
    `}async _checkUpdates(){var e,t;this._updatesLoading=!0,this._updatesError=void 0,this._updatePending=void 0;const i=Ge(this._savedLovelace);try{this._updates=Yr(i,await Br({refresh:!0}))}catch(s){const i=s;this._updatesError=i.retryAt?a("share.community_rate_limited",{time:new Date(i.retryAt).toLocaleTimeString(null===(t=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===t?void 0:t.language)},this.hass):a("share.community_failed",{message:i.message},this.hass)}finally{this._updatesLoading=!1}}async _updateShared(e,t){var i,s;if(this._updatePending!==e)return this._updatePending=e,void(this._updateArmedAt=Date.now());if(Date.now()-this._updateArmedAt<Gs)return;await this._saveDashboard(i=>Qe(i,e,t),"shared_update")&&(this._updatePending=void 0,this._updates=null===(i=this._updates)||void 0===i?void 0:i.map(t=>t.name===e?Object.assign(Object.assign({},t),{status:"current"}):t),(null===(s=this._config)||void 0===s?void 0:s.template)===e&&this._fireConfigChanged(Object.assign(Object.assign({},t),{type:this._config.type,template:e})))}_renderLibrary(){var t;const i=Object.keys(S(this._savedLovelace)),s=this._librarySelected?fa(this._librarySelected):void 0,n=!!s&&i.includes(s.name),o=!!s&&this._installPending===s.name,r=s?ga(s,i):[];return e`
      <div class="library">
        <ha-form
          .hass=${this.hass}
          .data=${{entry:null!==(t=this._librarySelected)&&void 0!==t?t:""}}
          .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:ma.map(e=>({value:e.name,label:e.name}))}}}]}
          .computeLabel=${()=>a("share.library_pick",void 0,this.hass)}
          @value-changed=${this._libraryPicked}
        ></ha-form>
        ${s?e`
                <p class="hint">${a(`library.${s.name}.summary`,void 0,this.hass)}</p>
                ${r.length?e`<p class="hint">
                        ${a("share.library_needs",{names:r.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderMissingCards([s,...r.map(e=>fa(e))].map(e=>null==e?void 0:e.template))}
                <ha-expansion-panel outlined>
                  <span slot="header">${a("share.library_preview",void 0,this.hass)}</span>
                  ${ua(s.name,e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${s.template}
                      read-only
                    ></ha-yaml-editor>`)}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{where:this._libraryDestination}}
                  .schema=${[{name:"where",selector:{select:{mode:"dropdown",options:[{value:"view",label:a("share.library_where_view",void 0,this.hass)},{value:"root",label:a("share.library_where_root",void 0,this.hass)}]}}}]}
                  .computeLabel=${()=>a("share.library_where",void 0,this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                <ha-button .disabled=${this._busy||n} @click=${()=>{this._install(s.name)}}>
                  ${a(n?"share.already_here":o?"share.install_anyway":"share.install",void 0,this.hass)}
                </ha-button>
              `:e``}
      </div>
    `}_libraryDestinationPicked(e){e.stopPropagation();const t=e.detail.value.where;this._libraryDestination="root"===t?"root":"view"}_libraryPicked(e){e.stopPropagation(),this._librarySelected=e.detail.value.entry||void 0,this._installPending=void 0}async _install(e){var t,i,s,a,n,o;const r=fa(e);if(!r)return;if(this._installPending!==e)return void(this._installPending=e);const l=G(),d=Object.keys(S(null!==(t=null==l?void 0:l.config)&&void 0!==t?t:this._savedLovelace)),c=[...ga(r,d),r.name].filter(e=>!d.includes(e)),h=ae(null!==(i=null==l?void 0:l.config)&&void 0!==i?i:this.lovelace,null!==(a=null===(s=this._config)||void 0===s?void 0:s.template)&&void 0!==a?a:""),p=null!==(o=null===(n=null==h?void 0:h.view)||void 0===n?void 0:n.index)&&void 0!==o?o:0;await this._saveDashboard(e=>c.reduce((e,t)=>{const i=fa(t);if(!i)return e;const s=Object.assign(Object.assign({},i.template),{source:va(i.name,at)});return"root"===this._libraryDestination?Ye(e,i.name,s):Ze(e,p,Object.assign({type:Te,template:i.name},s))},e),"library_install")&&(this._installPending=void 0)}async _copyExport(){const e=this.renderRoot.querySelector("#export"),t=null==e?void 0:e.yaml;if(!t)return;const{notes:i}=js(this._config),s=[...i.map(e=>`# ${e}`),t].join("\n");this._copyState=await Z(s)?"done":"failed",setTimeout(()=>this._copyState="",3e3)}async _copyPost(){var e,t;const i=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!i)return;const{notes:s}=js(this._config,S(this._savedLovelace));this._postCopyState=await Z(function(e,t,i){return[...[i,...t].filter(e=>"string"==typeof e&&e.trim()),"```yaml\n"+e.replace(/\n*$/,"")+"\n```"].join("\n\n")+"\n"}(i,s,null===(t=this._config)||void 0===t?void 0:t.description))?"done":"failed",setTimeout(()=>this._postCopyState="",3e3)}_downloadExport(){var e,t,i;const s=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!s)return;const{notes:a}=js(this._config),n=[...a.map(e=>`# ${e}`),s].join("\n"),o=document.createElement("a");o.href=URL.createObjectURL(new Blob([n],{type:"text/yaml"})),o.download=`${(null!==(i=null===(t=this._config)||void 0===t?void 0:t.template)&&void 0!==i?i:"template").replace(/[^\w-]+/g,"_")}.yaml`,o.click(),setTimeout(()=>URL.revokeObjectURL(o.href),1e3)}async _importFile(e){var t,i,s;const n=e.target,o=null===(t=n.files)||void 0===t?void 0:t[0];if(n.value="",!o)return;const r=await o.text(),l=null===(s=null===(i=this.renderRoot.querySelector("#import"))||void 0===i?void 0:i.shadowRoot)||void 0===s?void 0:s.querySelector("ha-code-editor");l?(l.value=r,l.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r}}))):this._importErrors=[a("share.import_not_yaml",void 0,this.hass)]}_renderTrash(){if(void 0===this._trash)return this._loadTrash(),e``;const t=e=>{var t,i;return new Date(e).toLocaleString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)};return e`
      <h3>${a("share.trash_header",void 0,this.hass)}</h3>
      <p class="hint">${a("share.trash_hint",void 0,this.hass)}</p>
      ${this._trash.length?e`<ul class="installed trash">
              ${this._trash.map((i,s)=>e`
                  <li>
                    <strong>${i.name}</strong>
                    <div class="status">
                      ${a("removed"===i.reason?"share.trash_removed":"share.trash_replaced",{when:t(i.at),dashboard:i.dashboard},this.hass)}
                    </div>
                    ${this._trashPending===s?e`<ha-alert alert-type="warning">
                            ${a("share.trash_clash",{name:i.name},this.hass)}
                          </ha-alert>`:e``}
                    <ha-button .disabled=${this._busy} @click=${()=>this._restore(i,s)}>
                      ${a(this._trashPending===s?"share.trash_restore_anyway":"share.trash_restore",void 0,this.hass)}
                    </ha-button>
                    <ha-button
                      @click=${()=>{this._trashShown=this._trashShown===s?void 0:s}}
                    >
                      ${a(this._trashShown===s?"share.trash_hide":"share.trash_show",void 0,this.hass)}
                    </ha-button>
                    <ha-button .disabled=${this._busy} @click=${()=>this._forget(i)}>
                      ${a("share.trash_forget",void 0,this.hass)}
                    </ha-button>
                    ${this._trashShown===s?e`<ha-yaml-editor
                            .hass=${this.hass}
                            .defaultValue=${i.template}
                            read-only
                          ></ha-yaml-editor>`:e``}
                  </li>
                `)}
            </ul>`:e`<p class="hint">${a("share.trash_empty",void 0,this.hass)}</p>`}
    `}async _restore(e,t){var i,s;if(!this.hass)return;const n=Xe(this.hass);let o;try{o=await et(n,e.dashboard)}catch(l){return void(this._toolError=a("tools.save_failed",{message:null!==(i=null==l?void 0:l.message)&&void 0!==i?i:l},this.hass))}const r=e.name in S(o);if(r&&this._trashPending!==t)return this._trashPending=t,void(this._trashArmedAt=Date.now());if(!(r&&Date.now()-this._trashArmedAt<Gs)){this._busy=!0,this._toolError=void 0;try{await X(this,this.hass,"restore",[{urlPath:e.dashboard,build:t=>tt(t,e)}]),this._trashPending=void 0,this._trashShown=void 0,await this._forget(e)}catch(l){this._toolError=a("tools.save_failed",{message:null!==(s=null==l?void 0:l.message)&&void 0!==s?s:l},this.hass)}finally{this._busy=!1}}}async _forget(e){if(!this.hass)return;const t=it(await Je(this.hass),e);await st(this.hass,t),this._trash=t,this._trashPending=void 0}_renderImportDetails(){const t=this._importValue;if(!this._importParses||!t||"object"!=typeof t||Array.isArray(t))return e``;if(!gr(t))return e``;const i=[t,...t.includes&&"object"==typeof t.includes&&!Array.isArray(t.includes)?Object.values(t.includes):[]];return e`${this._renderAbout(t)} ${this._renderUnmet(i)} ${this._renderSetup(i)}`}_importChanged(e){e.stopPropagation(),this._importValue=e.detail.value,this._importParses=!1!==e.detail.isValid,this._importErrors=[],this._importClash=void 0,this._importRisks=void 0,this._setupValues={}}_import(){if(!this._config)return;if(!this._importParses)return void(this._importErrors=[a("share.import_not_yaml",void 0,this.hass)]);if(!gr(this._importValue))return void(this._importErrors=[a("share.import_too_big",void 0,this.hass)]);const e=Os(this._importValue);if(!e.ok)return this._importErrors=e.errors,void(this._importClash=void 0);this._importErrors=[];const t=this._importValue.template,i=S(this._savedLovelace),s=t!==this._config.template&&t in i?t:void 0,n=Rr({template:this._importValue,includes:{}});if(s&&!this._importClash||Zs(n)&&!this._importRisks)return this._importClash=s,this._importRisks=Zs(n)?n:void 0,void(this._importArmedAt=Date.now());Date.now()-this._importArmedAt<Gs||this._applyImport(t)}_importAsCopy(){if(!this._config||!this._importParses)return;if(Date.now()-this._importArmedAt<Gs)return;const e=Object.keys(S(this._savedLovelace));this._applyImport(Ss(this._importValue.template,e))}_applyImport(e){var t;const i=function(e){const t=As(e);if((null==t?void 0:t.includes)&&"object"==typeof t.includes&&!Array.isArray(t.includes)){const e={};for(const[i,s]of Object.entries(t.includes))e[i]=As(s);t.includes=e}return t}(this._importValue),s=ms(i,this._setupValues);s.includes&&"object"==typeof s.includes&&!Array.isArray(s.includes)&&(s.includes=Object.entries(s.includes).reduce((e,[t,i])=>Object.assign(Object.assign({},e),{[t]:i&&"object"==typeof i&&!Array.isArray(i)?ms(i,this._setupValues):i}),{}));const a=s.includes;if(a&&"object"==typeof a&&!Array.isArray(a)){const e=Object.keys(S(this._savedLovelace)),t=Object.entries(a).filter(([t])=>!e.includes(t));t.length&&this._saveDashboard(e=>t.reduce((e,[t,i])=>Ye(e,t,i),e),"import",this._config)}const n=Object.assign(Object.assign({},s),{template:e,type:null===(t=this._config)||void 0===t?void 0:t.type});delete n.includes,this._fireConfigChanged(n),this._importClash=void 0,this._importRisks=void 0,this._setupValues={},this.dispatchEvent(new CustomEvent("select-tab",{detail:"settings",bubbles:!0,composed:!0}))}}h([p({attribute:!1})],al.prototype,"hass",void 0),h([p({attribute:!1})],al.prototype,"lovelace",void 0),h([p({attribute:!1})],al.prototype,"config",void 0),h([u()],al.prototype,"_importErrors",void 0),h([u()],al.prototype,"_importClash",void 0),h([u()],al.prototype,"_importRisks",void 0),h([u()],al.prototype,"_copyState",void 0),h([u()],al.prototype,"_toolError",void 0),h([u()],al.prototype,"_busy",void 0),h([u()],al.prototype,"_installPending",void 0),h([u()],al.prototype,"_librarySelected",void 0),h([u()],al.prototype,"_libraryDestination",void 0),h([u()],al.prototype,"_community",void 0),h([u()],al.prototype,"_communityLoading",void 0),h([u()],al.prototype,"_communityError",void 0),h([u()],al.prototype,"_communitySelected",void 0),h([u()],al.prototype,"_communityKnown",void 0),h([u()],al.prototype,"_communityKnownFailed",void 0),h([u()],al.prototype,"_postCopyState",void 0),h([u()],al.prototype,"_setupValues",void 0),h([u()],al.prototype,"_updates",void 0),h([u()],al.prototype,"_updatesLoading",void 0),h([u()],al.prototype,"_updatesError",void 0),h([u()],al.prototype,"_updatePending",void 0),h([u()],al.prototype,"_trash",void 0),h([u()],al.prototype,"_trashShown",void 0),h([u()],al.prototype,"_trashPending",void 0),customElements.get("decluttering-template-share-tab")||customElements.define("decluttering-template-share-tab",al)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;const nl=(e,t,i)=>{const s=new Map;for(let a=t;a<=i;a++)s.set(e[a],a);return s},ol=sa(class extends aa{constructor(e){if(super(e),e.type!==ia)throw Error("repeat() can only be used in text expressions")}dt(e,t,i){let s;void 0===i?i=t:void 0!==t&&(s=t);const a=[],n=[];let o=0;for(const r of e)a[o]=s?s(r,o):o,n[o]=i(r,o),o++;return{values:n,keys:a}}render(e,t,i){return this.dt(e,t,i).values}update(e,[t,i,s]){const a=(e=>e._$AH)(e),{values:n,keys:o}=this.dt(t,i,s);if(!Array.isArray(a))return this.ut=o,n;const r=this.ut??=[],l=[];let d,c,h=0,p=a.length-1,u=0,m=n.length-1;for(;h<=p&&u<=m;)if(null===a[h])h++;else if(null===a[p])p--;else if(r[h]===o[u])l[u]=da(a[h],n[u]),h++,u++;else if(r[p]===o[m])l[m]=da(a[p],n[m]),p--,m--;else if(r[h]===o[m])l[m]=da(a[h],n[m]),la(e,l[m+1],a[h]),h++,m--;else if(r[p]===o[u])l[u]=da(a[p],n[u]),la(e,a[h],a[p]),p--,u++;else if(void 0===d&&(d=nl(o,u,m),c=nl(r,h,p)),d.has(r[h]))if(d.has(r[p])){const t=c.get(o[u]),i=void 0!==t?a[t]:null;if(null===i){const t=la(e,a[h]);da(t,n[u]),l[u]=t}else l[u]=da(i,n[u]),la(e,a[h],i),a[t]=null;u++}else pa(a[p]),p--;else pa(a[h]),h++;for(;u<=m;){const t=la(e,l[m+1]);da(t,n[u]),l[u++]=t}for(;h<=p;){const e=a[h++];null!==e&&pa(e)}return this.ut=o,ha(e,l),nt}}),rl=["type","label","description","default","required","group","pattern","allowed","domain","device_class","min","max","step","unit","multiline","selector"];function ll(e){const t={};for(const s of rl){const i=e[s];void 0!==i&&(t[s]=i)}Object.assign(t,e.extra);const i={name:e.name};for(const s of e.order)s in t&&(i[s]=t[s]);for(const s of Object.keys(t))s in i||(i[s]=t[s]);return i}function dl(e){return!!e&&"object"==typeof e&&!Array.isArray(e)}function cl(e,t){const i=e.map(ll);if("mapping"===t){const e={};for(const t of i){const{name:i}=t,s=Ke(t,["name"]),a=Object.keys(s);a.length?1!==a.length||"default"!==a[0]||dl(s.default)||null===s.default?e[String(i)]=s:e[String(i)]=s.default:e[String(i)]=null}return e}if("none"!==t||i.length)return i}function hl(e,t){const i=new Set(e.map(e=>e.name));if(!i.has(t))return t;let s=2;for(;i.has(`${t}_${s}`);)s+=1;return`${t}_${s}`}function pl(e,t,i){const s=Object.assign(Object.assign({},e),{extra:Object.assign({},e.extra)});return void 0===i?delete s[t]:s[t]=i,s}function ul(e){return void 0!==e.type?String(e.type):e.selector&&"object"==typeof e.selector&&"card"in e.selector?"card":""}const ml=e=>Array.isArray(e)?e.map(String).join(", "):null==e?"":String(e),fl=e=>{const t=e.split(",").map(e=>e.trim()).filter(Boolean);return t.length?t:void 0};class gl extends m{constructor(){super(...arguments),this._reorderedAsList=!1,this.shared=[],this._asYaml=!1,this._picking=!1}static get styles(){return f`
      :host {
        display: block;
        margin-bottom: 16px;
      }
      .hint {
        margin: 6px 0 0;
        color: var(--secondary-text-color);
        font-size: 12.5px;
      }
      .rows {
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        overflow: hidden;
      }
      .group {
        padding: 6px 12px;
        background: var(--secondary-background-color);
        color: var(--secondary-text-color);
        font-size: 0.9em;
        border-top: 1px solid var(--divider-color);
      }
      .row {
        display: flex;
        align-items: flex-start;
        gap: 4px;
        padding: 10px 8px 2px;
        border-top: 1px solid var(--divider-color);
      }
      .rows > :first-child {
        border-top: 0;
      }
      .row ha-form {
        flex: 1;
        min-width: 0;
      }
      .row .handle {
        color: var(--secondary-text-color);
        cursor: grab;
        margin-top: 16px;
      }
      .row[data-dragging] {
        opacity: 0.5;
      }
      .buttons {
        display: flex;
        flex-direction: column;
      }
      .more {
        padding: 0 16px 12px 44px;
        border-top: 1px dashed var(--divider-color);
        background: var(--secondary-background-color);
      }
      .more ha-form {
        display: block;
        padding-top: 12px;
      }
      .add {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
      }
      .add .spacer {
        flex: 1;
      }
      .pick {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 8px 12px;
        margin-top: 8px;
      }
      .pick ul {
        margin: 4px 0 0;
        padding-left: 18px;
      }
      .pick a {
        cursor: pointer;
        color: var(--primary-color);
      }
      .empty {
        padding: 12px;
        color: var(--secondary-text-color);
      }
    `}get _rows(){return function(e){var t;const i=[];for(const s of Ie(e)){if(!s||"object"!=typeof s)continue;const e={name:"string"==typeof s.name?s.name:String(null!==(t=s.name)&&void 0!==t?t:""),extra:{},order:Object.keys(s).filter(e=>"name"!==e)};for(const[t,i]of Object.entries(s))"name"!==t&&(rl.includes(t)?e[t]=i:e.extra[t]=i);i.push(e)}return i}(this.variables)}get _shape(){const e=(t=this.variables,Array.isArray(t)?"list":t&&"object"==typeof t?"mapping":"none");var t;return"none"===e?"list":e}render(){const t=this._rows;return e`
      ${this._asYaml?this._renderYaml():this._renderRows(t)}
      ${this._reorderedAsList?e`<p class="hint">${a("declarations.reordered_as_list",void 0,this.hass)}</p>`:Be}
      <div class="add">
        <ha-button @click=${this._add}>${a("declarations.add",void 0,this.hass)}</ha-button>
        ${this.shared.length?e`<ha-button
                appearance="plain"
                @click=${()=>{this._picking=!this._picking}}
                >${a("declarations.take_shared",void 0,this.hass)}</ha-button
              >`:Be}
        <span class="spacer"></span>
        <ha-button
          appearance="plain"
          @click=${()=>{this._asYaml=!this._asYaml}}
          >${a(this._asYaml?"declarations.as_rows":"declarations.as_yaml",void 0,this.hass)}</ha-button
        >
      </div>
      ${this._picking?this._renderShared(t):Be}
    `}_renderRows(t){if(!t.length)return e`<div class="rows">
        <div class="empty">${a("declarations.none",void 0,this.hass)}</div>
      </div>`;const i=function(e){return e.map((t,i)=>{const s=void 0===t.group?void 0:String(t.group),a=i?e[i-1].group:void 0;return void 0!==s&&s!==(void 0===a?void 0:String(a))?s:void 0})}(t);return e`<div class="rows">
      ${ol(t,e=>e.name,(s,n)=>e`
          ${void 0!==i[n]?e`<div class="group">${i[n]}</div>`:Be}
          <div
            class="row"
            draggable="true"
            ?data-dragging=${this._dragging===n}
            @dragstart=${()=>{this._dragging=n}}
            @dragover=${e=>{void 0!==this._dragging&&e.preventDefault()}}
            @drop=${e=>this._drop(e,n)}
            @dragend=${()=>{this._dragging=void 0,this.requestUpdate()}}
          >
            <ha-svg-icon
              class="handle"
              role="img"
              aria-label=${a("template_editor.drag_hint",void 0,this.hass)}
              .path=${Qs}
            ></ha-svg-icon>
            <ha-form
              .hass=${this.hass}
              .data=${this._rowData(s)}
              .schema=${this._rowSchema(s)}
              .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
              @value-changed=${e=>this._rowChanged(e,n)}
            ></ha-form>
            <div class="buttons">
              <ha-icon-button
                .path=${"M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z"}
                .label=${a(this._open===s.name?"declarations.less":"declarations.more",void 0,this.hass)}
                @click=${()=>{this._open=this._open===s.name?void 0:s.name}}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,15L12,10L17,15H7Z"}
                .disabled=${0===n}
                .label=${a("template_editor.move_up",{name:s.name},this.hass)}
                @click=${()=>this._move(n,n-1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,10L12,15L17,10H7Z"}
                .disabled=${n===t.length-1}
                .label=${a("template_editor.move_down",{name:s.name},this.hass)}
                @click=${()=>this._move(n,n+1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                .label=${a("declarations.remove",{name:s.name},this.hass)}
                @click=${()=>this._remove(n)}
              ></ha-icon-button>
            </div>
          </div>
          ${this._open===s.name?this._renderMore(s,n):Be}
        `)}
    </div>`}_renderMore(t,i){const s={description:t.description,group:t.group,pattern:t.pattern,domain:ml(t.domain),device_class:ml(t.device_class),min:t.min,max:t.max,step:t.step,unit:t.unit,allowed:ml(t.allowed),multiline:t.multiline};return e`<div class="more">
      <ha-form
        .hass=${this.hass}
        .data=${s}
        .schema=${function(e,t){const i=ul(e),s={name:"description",label:a("declarations.description",void 0,t),selector:{text:{multiline:!0}}},n=[{name:"group",label:a("declarations.group",void 0,t),selector:{text:{}}}],o="entity"===i?[{name:"domain",label:a("declarations.domain",void 0,t),selector:{text:{}}},{name:"device_class",label:a("declarations.device_class",void 0,t),selector:{text:{}}}]:"number"===i?[{name:"min",label:a("declarations.min",void 0,t),selector:{number:{mode:"box"}}},{name:"max",label:a("declarations.max",void 0,t),selector:{number:{mode:"box"}}},{name:"step",label:a("declarations.step",void 0,t),selector:{number:{mode:"box"}}},{name:"unit",label:a("declarations.unit",void 0,t),selector:{text:{}}}]:"select"===i?[{name:"allowed",label:a("declarations.allowed",void 0,t),selector:{text:{}}}]:"text"===i?[{name:"multiline",label:a("declarations.multiline",void 0,t),selector:{boolean:{}}}]:[],r="card"===i?[]:[{name:"pattern",label:a("declarations.pattern",void 0,t),selector:{text:{}}}];return[s,{name:"",type:"grid",column_min_width:"260px",schema:[...n,...o,..."select"!==i&&void 0!==e.allowed?[{name:"allowed",label:a("declarations.allowed",void 0,t),selector:{text:{}}}]:[],...r]}]}(t,this.hass)}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        @value-changed=${e=>this._moreChanged(e,i)}
      ></ha-form>
      ${void 0!==t.selector&&"card"!==ul(t)?e`<ha-form
              .hass=${this.hass}
              .data=${{selector:t.selector}}
              .schema=${[{name:"selector",label:a("declarations.selector",void 0,this.hass),selector:{object:{}}}]}
              .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
              @value-changed=${e=>this._selectorChanged(e,i)}
            ></ha-form>`:Be}
    </div>`}_renderYaml(){return e`<ha-form
      .hass=${this.hass}
      .data=${{variables:this.variables}}
      .schema=${[{name:"variables",label:a("template_editor.declarations_label",void 0,this.hass),helper:a("template_editor.declarations_helper",void 0,this.hass),selector:{object:{}}}]}
      .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
      .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
      @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value.variables)}}
    ></ha-form>`}_renderShared(t){const i=new Set(t.map(e=>e.name)),s=this.shared.filter(e=>!i.has(e.name));return e`<div class="pick">
      ${a("declarations.take_shared_hint",void 0,this.hass)}
      ${s.length?e`<ul>
              ${s.map(t=>e`<li>
                    <a @click=${()=>this._takeShared(t)}>${t.name}</a>
                    ${t.label?e` - ${t.label}`:Be}
                  </li>`)}
            </ul>`:e`<p>${a("declarations.take_shared_none",void 0,this.hass)}</p>`}
    </div>`}_rowData(e){const t=void 0===e.default||["string","number","boolean"].includes(typeof e.default);return{name:e.name,type:ul(e),label:e.label,default:t?void 0===e.default?void 0:String(e.default):e.default,required:!0===e.required}}_rowSchema(e){const t=void 0===e.default||["string","number","boolean"].includes(typeof e.default),[i]=(s=this.hass,[{name:"",type:"grid",column_min_width:"120px",schema:[{name:"name",label:a("declarations.name",void 0,s),selector:{text:{}}},{name:"type",label:a("declarations.type",void 0,s),selector:{select:{mode:"dropdown",options:[{value:"",label:a("declarations.type_any",void 0,s)},...ot.map(e=>({value:e,label:a(`type_name.${e}`,void 0,s)})),{value:"card",label:a("type_name.card",void 0,s)}]}}},{name:"label",label:a("declarations.label",void 0,s),selector:{text:{}}},{name:"default",label:a("declarations.default",void 0,s),selector:{text:{}}},{name:"required",label:a("declarations.required",void 0,s),selector:{boolean:{}}}]}]);var s;if(t)return[i];const n=i.schema.map(e=>"default"===e.name?(e=>({name:"default",label:a("declarations.default",void 0,e),selector:{object:{}}}))(this.hass):e);return[Object.assign(Object.assign({},i),{schema:n})]}_rowChanged(e,t){var i,s;e.stopPropagation();const a=this._rows,n=a[t];if(!n)return;const o=e.detail.value;let r=n;const l="string"==typeof o.name?o.name.trim():n.name;l&&l!==n.name&&(r=pl(r,"name",hl(a.filter((e,i)=>i!==t),l)),this._open===n.name&&(this._open=r.name)),(null!==(i=o.type)&&void 0!==i?i:"")!==ul(n)&&(r=function(e,t){let i=pl(e,"type",void 0);return i=pl(i,"selector",void 0),"card"===t?pl(i,"selector",{card:{}}):t?pl(i,"type",t):i}(r,String(null!==(s=o.type)&&void 0!==s?s:""))),r=pl(r,"label","string"==typeof o.label&&""!==o.label?o.label:void 0),r=pl(r,"required",!0===o.required||void 0),o.default===n.default||""===o.default&&void 0===n.default||(r=pl(r,"default",this._defaultFrom(o.default,n))),this._emit(cl(a.map((e,i)=>i===t?r:e),this._shape))}_defaultFrom(e,t){if(""===e||null==e)return;if("string"!=typeof e)return e;const i=ul(t);return"number"!==i||""===e.trim()||Number.isNaN(Number(e))?"boolean"===i&&["true","false"].includes(e.trim().toLowerCase())?"true"===e.trim():e:Number(e)}_moreChanged(e,t){e.stopPropagation();const i=this._rows,s=i[t];if(!s)return;const a=e.detail.value;let n=s;const o=e=>"string"==typeof e&&e.trim()?e:void 0;n=pl(n,"description",o(a.description)),n=pl(n,"group",o(a.group)),n=pl(n,"pattern",o(a.pattern)),n=pl(n,"unit",o(a.unit));for(const l of["min","max","step"])n=pl(n,l,"number"==typeof a[l]?a[l]:void 0);n=pl(n,"multiline",!0===a.multiline||void 0);const r=e=>{const t="string"==typeof e?fl(e):void 0;return void 0===t?void 0:1===t.length?t[0]:t};n=pl(n,"domain",r(a.domain)),n=pl(n,"device_class",r(a.device_class)),n=pl(n,"allowed","string"==typeof a.allowed?fl(a.allowed):void 0),this._emit(cl(i.map((e,i)=>i===t?n:e),this._shape))}_selectorChanged(e,t){e.stopPropagation();const i=this._rows,s=e.detail.value.selector,a=pl(i[t],"selector",s&&"object"==typeof s?s:void 0);this._emit(cl(i.map((e,i)=>i===t?a:e),this._shape))}_add(){const e=this._rows,t=function(e,t="variable"){return{name:hl(e,t),extra:{},order:[]}}(e);this._open=t.name,this._emit(cl([...e,t],this._shape))}_takeShared(e){const t=this._rows,i={name:e.name,extra:{},order:[]};this._picking=!1,this._emit(cl([...t,i],this._shape))}_remove(e){const t=this._rows;this._emit(cl(t.filter((t,i)=>i!==e),this._shape))}_move(e,t){const i=this._rows,s=function(e,t,i){if(t===i||t<0||i<0||t>=e.length||i>=e.length)return e;const s=[...e],[a]=s.splice(t,1);return s.splice(i,0,a),s}(i,e,t);if(s===i)return;const a="mapping"===this._shape?"list":this._shape;this._reorderedAsList="mapping"===this._shape,this._emit(cl(s,a))}_drop(e,t){e.preventDefault();const i=this._dragging;this._dragging=void 0,void 0!==i&&this._move(i,t)}_emit(e){g(this,"value-changed",{value:e})}}h([p({attribute:!1})],gl.prototype,"hass",void 0),h([p({attribute:!1})],gl.prototype,"variables",void 0),h([u()],gl.prototype,"_reorderedAsList",void 0),h([p({attribute:!1})],gl.prototype,"shared",void 0),h([u()],gl.prototype,"_open",void 0),h([u()],gl.prototype,"_asYaml",void 0),h([u()],gl.prototype,"_picking",void 0);const vl="decluttering-declarations-editor";customElements.get(vl)||customElements.define(vl,gl);const _l=["name","title","label","entity","area","room"];function yl(e,t){const i=Object.assign({},o(t)),s=null==e?void 0:e.examples,a=null==s?[]:Array.isArray(s)?s:[s];return Object.assign(Object.assign({},e),{examples:[...a,i]})}class bl extends m{static get styles(){return f`
      :host {
        display: block;
        margin: 0 0 16px;
      }
      .strip {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        background: var(--secondary-background-color);
        border-radius: 8px;
      }
      .strip ha-form {
        flex: 1;
        min-width: 160px;
      }
      .passes {
        font-size: 0.85em;
        padding: 2px 8px;
        border-radius: 10px;
        background: var(--success-color, #43a047);
        color: #fff;
        white-space: nowrap;
      }
      .passes.some {
        background: var(--warning-color, #ffa600);
      }
      ha-alert {
        display: block;
        margin-top: 8px;
      }
    `}render(){var t;const i=this.config,s=null==i?void 0:i.template;if(!i||!s)return e``;const n=L(i),r=rt.get(s),l=void 0===r||r>=n.length?"":String(r),d=null!==(t=S(this.lovelace,void 0,i)[s])&&void 0!==t?t:i,c=n.length?lt({[s]:d},[],this.hass):[],h=n.length-c.length,p=""===l?void 0:c.find(e=>e.example===Number(l)+1),u=[{name:"example",label:a("template_editor.preview_example_label",void 0,this.hass),selector:{select:{mode:"dropdown",options:[{value:"",label:a("template_editor.preview_defaults",void 0,this.hass)},...n.map((e,t)=>{const i=function(e){const t=o(e);for(const s of _l){const e=t[s];if("string"==typeof e&&e.trim())return e.trim();if("number"==typeof e)return String(e)}const i=e.map(D).find(e=>void 0!==e);if(void 0!==i){const e=t[i];if("string"==typeof e||"number"==typeof e)return`${i}: ${e}`}}(e),s=a("template_editor.example_n",{number:t+1},this.hass);return{value:String(t),label:i?`${s}: ${i}`:s}})]}}}];return e`
      <div class="strip">
        <ha-form
          .hass=${this.hass}
          .data=${{example:l}}
          .schema=${u}
          .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
          @value-changed=${this._picked}
        ></ha-form>
        ${n.length?e`<span class="passes ${h<n.length?"some":""}"
                >${a("template_editor.examples_pass",{passes:h,total:n.length},this.hass)}</span
              >`:Be}
        <ha-icon-button
          .path=${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}
          .label=${a("template_editor.example_add",void 0,this.hass)}
          @click=${this._add}
        ></ha-icon-button>
      </div>
      ${p?e`<ha-alert alert-type="warning"
              >${a("tools.health_example",{template:s,number:p.example,problems:p.problems.join(" ")},this.hass)}</ha-alert
            >`:Be}
    `}_picked(e){var t;e.stopPropagation();const i=null===(t=this.config)||void 0===t?void 0:t.template;if(!i)return;const s=e.detail.value.example;void 0===s||""===s?rt.delete(i):rt.set(i,Number(s)),window.dispatchEvent(new CustomEvent(dt,{detail:{template:i}})),this.dispatchEvent(new CustomEvent("example-picked",{detail:{template:i,example:""===s?void 0:Number(s)},bubbles:!0,composed:!0})),this.requestUpdate()}_add(){const e=this.config;if(!e)return;const t=L(e),i=rt.get(e.template),s=void 0!==i&&t[i]?t[i]:c(Oe(e));g(this,"config-changed",{config:yl(e,s)})}}h([p({attribute:!1})],bl.prototype,"hass",void 0),h([p({attribute:!1})],bl.prototype,"lovelace",void 0),h([p({attribute:!1})],bl.prototype,"config",void 0);const $l="decluttering-example-strip";customElements.get($l)||customElements.define($l,bl);const wl=B({states:{"light.kitchen_ceiling":{entity_id:"light.kitchen_ceiling",state:"on",attributes:{friendly_name:"Kitchen ceiling",brightness:180}},"sensor.garden_temperature":{entity_id:"sensor.garden_temperature",state:"14.6",attributes:{friendly_name:"Garden temperature",unit_of_measurement:"°C",device_class:"temperature"}},"binary_sensor.bedroom_window":{entity_id:"binary_sensor.bedroom_window",state:"off",attributes:{friendly_name:"Bedroom window",device_class:"window"}},"input_select.house_mode":{entity_id:"input_select.house_mode",state:"night",attributes:{friendly_name:"House mode",options:["day","night","away"]}}},entities:{"light.kitchen_ceiling":{entity_id:"light.kitchen_ceiling",device_id:"kitchen_hue",labels:["evening"]},"sensor.garden_temperature":{entity_id:"sensor.garden_temperature",device_id:"garden_aqara",labels:[]},"binary_sensor.bedroom_window":{entity_id:"binary_sensor.bedroom_window",area_id:"bedroom",icon:"mdi:window-closed-variant",labels:[]},"input_select.house_mode":{entity_id:"input_select.house_mode",labels:[]}},devices:{kitchen_hue:{id:"kitchen_hue",name:"Hue ceiling",manufacturer:"Signify",model:"Hue White",area_id:"kitchen"},garden_aqara:{id:"garden_aqara",name:"Garden sensor",manufacturer:"Aqara",model:"WSDCGQ11LM",area_id:"back_garden"}},areas:{kitchen:{area_id:"kitchen",name:"Kitchen",floor_id:"ground_floor",icon:"mdi:fridge"},back_garden:{area_id:"back_garden",name:"Back Garden",floor_id:null,icon:null},bedroom:{area_id:"bedroom",name:"Bedroom",floor_id:"first_floor",icon:"mdi:bed"}},floors:{ground_floor:{floor_id:"ground_floor",name:"Ground floor",icon:"mdi:home-floor-0"},first_floor:{floor_id:"first_floor",name:"First floor",icon:"mdi:home-floor-1"}},labels:{evening:{label_id:"evening",name:"Evening lights"}},language:"en",locale:{language:"en"},localize:()=>""},["light.kitchen_ceiling","sensor.garden_temperature","binary_sensor.bedroom_window","input_select.house_mode"]);function xl(e,t,i,s={},a=wl){const n=d(e,s,{value:t},null==s?void 0:s.template,a,!0,e=>e.forEach(e=>i.add(e.split("|")[0].replace(/\?$/,""))));return{value:null==n?void 0:n.value,removed:!n||!("value"in n)}}function kl(e){return e.removed?{value:void 0,kind:"removed"}:{value:e.value,kind:(t=e.value,null===t?"null":Array.isArray(t)?"list":"object"==typeof t?"mapping":"number"==typeof t?"number":"boolean"==typeof t?"boolean":"string"==typeof t&&/\[\[[^\]]/.test(t)?"unresolved":"text")};var t}function jl(e,t,i,s){return function(e,t,i,s){const a=new Set,n=kl(xl(e,t,a,i,s)),o=xl(e,`<${t}>`,new Set,i,s),r=[],l=function(e){const t=e.trim();if(!t.startsWith("[[")||!t.endsWith("]]"))return;const i=[];let s=0,a="";for(let r=2;r<t.length-2;r+=1){const e=t.slice(r,r+2);if("[["===e)s+=1,a+=e,r+=1;else if("]]"===e){if(0===s)return;s-=1,a+=e,r+=1}else"|"===t[r]&&0===s?(i.push(a),a=""):a+=t[r]}if(0!==s)return;i.push(a);const n=i.length-1,o=i[n].endsWith("?");return o&&(i[n]=i[n].slice(0,-1)),{name:i[0],steps:i.slice(1),optional:o}}(t);if(l&&l.steps.length)for(let d=0;d<=l.steps.length;d+=1){const t=`[[${[l.name,...l.steps.slice(0,d)].join("|")}${d===l.steps.length&&l.optional?"?":""}]]`;r.push(Object.assign({written:t,step:0===d?l.name:l.steps[d-1]},kl(xl(e,t,new Set,i,s))))}return{steps:r,whole:n,inText:"string"==typeof o.value?o.value.slice(1,-1):void 0,unset:[...a]}}(t,i,null!=e?e:{},null!=s?s:wl)}const Al=["card","badge","row","element","group","style","let","default","defaults","grid_options","name"],Sl="[^[\\]]*",Ol=new RegExp(`\\[\\[(?:${Sl}|${`\\[\\[(?:${Sl}|${`\\[\\[${Sl}\\]\\]`})*\\]\\]`})*\\]\\]`,"g");function Cl(e){var t;const i=[];for(const s of null!==(t=e.match(Ol))&&void 0!==t?t:[])s.startsWith("[[!")||i.includes(s)||i.push(s);return i}const El=["slug","title","upper","default:","if:","bool","replace:","friendly_name","area","state"];class Tl extends m{constructor(){super(...arguments),this._expression="",this._more=!1}static get styles(){return f`
      :host {
        display: block;
      }
      .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        margin: 0 0 12px;
        font-size: 0.9em;
      }
      .chip {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 3px 8px;
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.9em;
        cursor: pointer;
        background: var(--card-background-color);
      }
      .chip:hover {
        border-color: var(--primary-color);
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9em;
      }
      th {
        text-align: left;
        color: var(--secondary-text-color);
        font-weight: 500;
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
      }
      td {
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
        vertical-align: top;
      }
      td.code {
        font-family: var(--ha-font-family-code, monospace);
        word-break: break-word;
      }
      /* Only the value keeps its spaces: on the cell, the template's own indent showed too. */
      td.code .value {
        white-space: pre-wrap;
      }
      td.gap {
        color: var(--secondary-text-color);
        font-style: italic;
      }
      tr.bad td {
        background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      }
      td.bad {
        color: var(--error-color, #db4437);
      }
      td.from {
        color: var(--secondary-text-color);
      }
    `}render(){const t=this.config;if(!t||!this.hass)return e``;const i=function(e){if(!e||"object"!=typeof e)return[];const t=[];for(const i of Al){const s=e[i];if(void 0===s)continue;const a="string"==typeof s?s:JSON.stringify(s);for(const e of Cl(a))t.includes(e)||t.push(e)}return t}(t),s=this._expression||i[0]||"",n=[{name:"placeholder",label:a("placeholder_tool.placeholder",void 0,this.hass),selector:{select:{mode:"dropdown",custom_value:!0,options:i.map(e=>({value:e,label:e}))}}}];return e`
      <ha-expansion-panel outlined>
        <span slot="header"
          >${a("placeholder_tool.header",void 0,this.hass)} <small>${this._exampleLabel()}</small></span
        >
        <div style="padding: 12px 4px 4px">
          <ha-form
            .hass=${this.hass}
            .data=${{placeholder:s}}
            .schema=${n}
            .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
            @value-changed=${this._picked}
          ></ha-form>
          <p class="hint">${a("placeholder_tool.hint",{count:i.length},this.hass)}</p>
          <div class="chips">
            <span>${a("placeholder_tool.add_step",void 0,this.hass)}</span>
            ${(this._more?[...ct,...ht.map(e=>`${e}:`)]:El).map(t=>e`<span class="chip" @click=${()=>this._addStep(s,t)}>${t}</span>`)}
            ${this._more?Be:e`<span
                    class="chip"
                    @click=${()=>{this._more=!0}}
                    >…</span
                  >`}
          </div>
          ${s?this._renderResult(s):Be}
        </div>
      </ha-expansion-panel>
    `}_exampleLabel(){var e;const t=null===(e=this.config)||void 0===e?void 0:e.template,i=t?rt.get(t):void 0;return void 0===i?a("placeholder_tool.under_defaults",void 0,this.hass):a("placeholder_tool.under_example",{number:i+1},this.hass)}_result(e){var t;const i=this.config;if(!i)return;const s=null!==(t=S(this.lovelace,void 0,i)[i.template])&&void 0!==t?t:i,a=pt(s,rt.get(i.template)),n=null!=a?a:c(Oe(s));try{return jl(s,n,e,this.hass)}catch(o){return}}_renderResult(t){const i=this._result(t);if(!i)return e``;if(i.error)return e`<ha-alert alert-type="error">${i.error}</ha-alert>`;const s=i.steps.length?i.steps:[],n=s.findIndex(e=>"unresolved"===e.kind);return e`
      <table>
        <thead>
          <tr>
            <th>${a("placeholder_tool.col_step",void 0,this.hass)}</th>
            <th>${a("placeholder_tool.col_gives",void 0,this.hass)}</th>
            <th>${a("placeholder_tool.col_from",void 0,this.hass)}</th>
          </tr>
        </thead>
        <tbody>
          ${s.map((e,t)=>this._renderStep(e,t,n,i))}
          <tr class=${"unresolved"===i.whole.kind?"bad":""}>
            <td class="code">${a("placeholder_tool.result",void 0,this.hass)}</td>
            <td class="code ${"unresolved"===i.whole.kind?"bad":""}">
              <span class="value">${this._shown(i.whole.value,i.whole.kind)}</span>
            </td>
            <td class="from">${a(`placeholder_tool.kind_${i.whole.kind}`,void 0,this.hass)}</td>
          </tr>
        </tbody>
      </table>
      <p class="hint">${a("placeholder_tool.steps_hint",void 0,this.hass)}</p>
    `}_renderStep(t,i,s,n){const o="unresolved"===t.kind&&(-1===s||i===s),r=void 0===t.value||""===t.value||"removed"===t.kind,l=0===i?n.unset.includes(t.step)?a("placeholder_tool.from_unset",void 0,this.hass):a("placeholder_tool.from_variables",void 0,this.hass):o?a("placeholder_tool.from_refused",void 0,this.hass):"";return e`<tr class=${o?"bad":""}>
      <td class="code">${t.step}</td>
      <td class="code ${o?"bad":r?"gap":""}">
        <span class="value"
          >${r&&!o?a("placeholder_tool.nothing",void 0,this.hass):this._shown(t.value,t.kind)}</span
        >
      </td>
      <td class="from">${l}</td>
    </tr>`}_shown(e,t){return"removed"===t?a("placeholder_tool.removed",void 0,this.hass):void 0===e?"":"string"==typeof e?e:JSON.stringify(e)}_picked(e){e.stopPropagation();const t=e.detail.value.placeholder;this._expression="string"==typeof t?t:""}_addStep(e,t){let i=e.trim()||"[[]]";const s=i.endsWith("?]]");i=i.replace(/\??\]\]$/,"");const a=i.slice(2),n=""===a?t:`${a}|${t}`;this._expression=`[[${n}${s?"?":""}]]`}}h([p({attribute:!1})],Tl.prototype,"hass",void 0),h([p({attribute:!1})],Tl.prototype,"lovelace",void 0),h([p({attribute:!1})],Tl.prototype,"config",void 0),h([u()],Tl.prototype,"_expression",void 0),h([u()],Tl.prototype,"_more",void 0);const Nl="decluttering-placeholder-tool";customElements.get(Nl)||customElements.define(Nl,Tl);const Pl="https://tempus2016.github.io/decluttering-card-plus/",Ll=`${Pl}help-index.json`,Il={template:"Defining-Templates.html",type:"Defining-Templates.html",description:"Defining-Templates.html",category:"Defining-Templates.html",variables:"Describing-Variables.html",default:"Variables.html",defaults:"Variables.html",let:"Variables.html",extends:"Defining-Templates.html",examples:"Describing-Variables.html",for_each:"Repeating-a-Template.html",for_each_from:"Repeating-a-Template.html",columns:"Repeating-a-Template.html",min_column_width:"Repeating-a-Template.html",gap:"Styling.html",empty:"Repeating-a-Template.html",lazy:"Repeating-a-Template.html",style:"Styling.html",grid_options:"Styling.html",on_error:"Using-Templates.html",rebuild_on:"Using-Templates.html",debug:"Troubleshooting.html",strict:"Using-Templates.html",fit:"Styling.html",group:"Cards.html",publish:"Using-Templates.html",suggest_for:"Using-Templates.html",visibility:"Visibility.html"};let Fl;function Ml(e=fetch){return null!=Fl||(Fl=e(Ll,{cache:"force-cache"}).then(async e=>{if(!e.ok)return{};return function(e){const t={};if(!e||"object"!=typeof e)return t;for(const[i,s]of Object.entries(e)){if(!s||"object"!=typeof s)continue;const e=s;"string"==typeof e.page&&"string"==typeof e.text&&"string"==typeof e.url&&(e.url.startsWith(Pl)&&(t[i]=Object.assign(Object.assign({key:i,page:e.page,heading:"string"==typeof e.heading?e.heading:"",text:e.text},"string"==typeof e.yaml?{yaml:e.yaml}:{}),{url:e.url})))}return t}(await e.json())}).catch(()=>({}))),Fl}class Vl extends m{constructor(){super(...arguments),this.key="",this._open=!1,this._loaded=!1}static get styles(){return f`
      :host {
        display: inline-block;
        position: relative;
      }
      button {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1.5px solid var(--secondary-text-color);
        color: var(--secondary-text-color);
        background: transparent;
        font: 500 13px var(--ha-font-family, inherit);
        cursor: pointer;
        padding: 0;
      }
      button[aria-expanded='true'] {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      .pop {
        position: absolute;
        right: 0;
        top: 30px;
        z-index: 5;
        width: min(420px, 80vw);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        padding: 12px 14px;
        font-size: 0.9em;
        line-height: 1.5;
        text-align: left;
      }
      .pop h5 {
        margin: 0 0 6px;
        font-size: 1em;
        font-weight: 500;
      }
      .pop p {
        margin: 0 0 8px;
      }
      .pop pre {
        margin: 8px 0;
        padding: 8px 10px;
        background: var(--secondary-background-color);
        border-radius: 6px;
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.9em;
        white-space: pre-wrap;
        overflow: auto;
        max-height: 160px;
      }
      .foot {
        display: flex;
        gap: 12px;
        align-items: center;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .foot a {
        color: var(--primary-color);
        text-decoration: none;
      }
      .foot .esc {
        margin-left: auto;
      }
    `}render(){return e`
      <button
        aria-expanded=${this._open}
        aria-label=${a("help.button",{key:this.key},this.hass)}
        title=${a("help.button",{key:this.key},this.hass)}
        @click=${this._toggle}
        @keydown=${this._keydown}
      >
        ?
      </button>
      ${this._open?this._renderPop():Be}
    `}_renderPop(){var t;const i=this._entry,s=null!==(t=null==i?void 0:i.url)&&void 0!==t?t:function(e){var t;return Pl+(null!==(t=Il[e])&&void 0!==t?t:"Configuration-Reference.html")}(this.key);return e`
      <div class="pop" role="dialog" @keydown=${this._keydown}>
        ${i?e`
                <h5>${i.page}${i.heading?` · ${i.heading}`:""}</h5>
                <p>${i.text}</p>
                ${i.yaml?e`<pre>${i.yaml}</pre>`:Be}
              `:e`<p>
                ${a(this._loaded?"help.not_in_index":"help.loading",{key:this.key},this.hass)}
              </p>`}
        <div class="foot">
          <a href=${s} target="_blank" rel="noopener noreferrer"
            >${a("help.open_page",void 0,this.hass)}</a
          >
          <span class="esc">${a("help.esc",void 0,this.hass)}</span>
        </div>
      </div>
    `}async _toggle(){this._open=!this._open,this._open&&!this._loaded&&(this._entry=await async function(e,t){return(await Ml(t))[e]}(this.key),this._loaded=!0)}_keydown(e){"Escape"===e.key&&this._open&&(e.stopPropagation(),this._open=!1)}}h([p({attribute:!1})],Vl.prototype,"hass",void 0),h([p()],Vl.prototype,"key",void 0),h([u()],Vl.prototype,"_open",void 0),h([u()],Vl.prototype,"_entry",void 0),h([u()],Vl.prototype,"_loaded",void 0);const Hl="decluttering-help";customElements.get(Hl)||customElements.define(Hl,Vl);const Dl=["card","badge","row","element"];function ql(e,t,i=[]){if(Array.isArray(e))e.forEach((e,s)=>ql(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,a]of Object.entries(e))ql(a,t?`${t}.${s}`:s,i);else null!=e&&i.push({path:t,value:String(e)});return i}const Rl=["grid_options","visibility","view_layout","layout_options"];function zl(e){const t={};for(const[i,s]of Object.entries(null!=e?e:{}))Rl.includes(i)||(t[i]=s);return t}function Ul(e){if(Array.isArray(e))return e.map(Ul);if(e&&"object"==typeof e){const t={};for(const i of Object.keys(e).sort())t[i]=Ul(e[i]);return t}return 0}function Wl(e,t=[],i=[]){if(Array.isArray(e))e.forEach((e,s)=>Wl(e,[...t,s],i));else if(e&&"object"==typeof e)for(const[s,a]of Object.entries(e))Wl(a,[...t,s],i);else i.push({path:t,value:e});return i}function Bl(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}function Kl(e){const t=new Map;e.forEach((e,i)=>{var s;if(!e||"object"!=typeof e||"string"!=typeof e.type)return;const a=zl(e);if(JSON.stringify(a).includes("[["))return;const n=JSON.stringify([e.type,Ul(a)]);t.set(n,[...null!==(s=t.get(n))&&void 0!==s?s:[],i])});const i=[];for(const[s,a]of t){if(a.length<2)continue;const t=a.map(t=>zl(e[t])),n=Wl(t[0]).map(e=>e.path).filter(e=>t.some(i=>JSON.stringify(Bl(i,e))!==JSON.stringify(Bl(t[0],e))));!n.length||n.length>8||i.push({indices:a,type:e[a[0]].type,differing:n,key:s})}return i.sort((e,t)=>t.indices.length-e.indices.length||e.indices[0]-t.indices[0])}const Jl=e=>e.replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value";function Yl(e){const t=e[e.length-1];if("string"==typeof t)return Jl(t);const i=[...e].reverse().find(e=>"string"==typeof e);return Jl(`${null!=i?i:"item"}_${t+1}`)}function Zl(e){const t=e.map(Yl),i=[];return e.forEach((e,s)=>{const a=(n=t[s],t.filter(e=>e===n).length>1?function(e){return Jl(e.map(e=>"number"==typeof e?String(e+1):e).join("_"))}(e):t[s]);var n;i.push(Ss(a,i))}),i}function Gl(e){var t;const i=e.map(zl),s=null!==(t=i[0])&&void 0!==t?t:{},a=Wl(s).map(e=>e.path).filter(e=>i.some(t=>JSON.stringify(Bl(t,e))!==JSON.stringify(Bl(s,e)))),n=Zl(a),o=JSON.parse(JSON.stringify(s));return a.forEach((e,t)=>{Bl(o,e.slice(0,-1))[e[e.length-1]]=`[[${n[t]}]]`}),{template:{card:o},names:n,variables:i.map(e=>a.map((t,i)=>({[n[i]]:Bl(e,t)}))),layout:e.map(e=>{const t={};for(const i of Rl)void 0!==(null==e?void 0:e[i])&&(t[i]=e[i]);return t})}}function Ql(e,t,i){return Object.assign({type:"custom:decluttering-card-plus",template:e,variables:t},i)}const Xl="_";function ed(e){let t="string"==typeof e?e:JSON.stringify(e);if("string"!=typeof t||!t.includes("[["))return[];const i=new Set;for(let s=0;s<5;s+=1){let e=!1;if(t=t.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(t,s)=>{if(e=!0,s.startsWith(De))return Xl;const a=s.endsWith("?")?s.slice(0,-1):s,[n,...o]=a.split("|"),r=n.endsWith("?")?n.slice(0,-1):n;for(const e of[r,r.split(".")[0]])e&&e!==Xl&&i.add(e);for(const e of o){const t=e.startsWith("or:")?e.slice(3):He(e);t&&t!==Xl&&i.add(t)}return Xl}),!e)break}return[...i]}function td(e,t=[]){if(Array.isArray(e)){for(const i of e)td(i,t);return t}if(!e||"object"!=typeof e)return t;Pe.includes(e.type)&&!0===e[vt]&&"string"==typeof e.template&&t.push(e.template);for(const i of Object.values(e))td(i,t);return t}function id(e,t,i=new Set){const s=new Set;if(!e)return{names:s,complete:!0};gt in e&&(e=Object.assign(Object.assign({},e),{default:e[gt]}));for(const n of C(e))s.add(n.name);for(const n of c(Oe(e))){const e=D(n);void 0!==e&&s.add(e)}for(const n of ed(e))s.add(n);let a=!0;for(const n of td(e)){if(i.has(n))continue;if(i.add(n),!Object.prototype.hasOwnProperty.call(t,n)){a=!1;continue}const e=id(t[n],t,i);for(const t of e.names)s.add(t);e.complete||(a=!1)}return{names:s,complete:a}}function sd(e,t){const i=new Map,s=(e,t,s,a)=>{const n=JSON.stringify([e.index,t,a.name,s]),o=i.get(n);o?(o.count+=1,!o.closest&&a.closest&&(o.closest=a.closest)):i.set(n,Object.assign(Object.assign({view:e,template:t,name:a.name},a.closest?{closest:a.closest}:{}),{where:s,count:1}))},a=(e,i,o)=>{var r,l;if(Array.isArray(e))for(const t of e)a(t,i,o);else if(e&&"object"==typeof e){if(Pe.includes(e.type)&&"string"==typeof e.template){const a=Object.prototype.hasOwnProperty.call(t,e.template)?t[e.template]:void 0;if(a){const d=new Set,h=(r,l)=>{for(const h of function(e,t,i,s={lets:[],defaults:[]},a){if(!e)return[];const{names:o,complete:r}=id(e,t);if(!r)return[];const l=new Set([...c(e.let),...s.lets].map(D).filter(e=>void 0!==e)),d=I(i),h=new Set(o);for(const n of ed(a))h.add(n);for(const n of[...s.lets,...s.defaults]){const e=D(n);if(void 0!==e)for(const t of ed(n[e]))h.add(t)}const p=e=>!l.has(e)&&(h.has(e)||h.has(e.split(".")[0]));let u=!0;const m=new Set;for(;u;){u=!1;for(const e of d){const t=D(e);if(!m.has(t)&&p(t)){m.add(t);for(const i of ed(e[t]))h.has(i)||(h.add(i),u=!0)}}}const f=new Set(d.map(e=>D(e))),g=[...h].filter(e=>!f.has(e)&&!l.has(e)),v=[];for(const c of f){if(p(c))continue;const e=n(c,g);v.push(e?{name:c,closest:e}:{name:c})}return v}(a,t,l,o,[e.on_error,e.for_each_from]))d.has(h.name)||(d.add(h.name),s(i,e.template,r,h))};h("variables",e.variables);for(const t of null!==(r=q(e.for_each))&&void 0!==r?r:[])h("for_each",t);const p=null===(l=e.for_each_from)||void 0===l?void 0:l.overrides;if(p&&"object"==typeof p)for(const e of Object.values(p))h("overrides",e)}}for(const t of Object.values(e))a(t,i,o)}};return mt(e,(t,i,s)=>{var n,o,r;const l=e.views[i];a(t,{title:null!==(o=null!==(n=null==l?void 0:l.title)&&void 0!==n?n:null==l?void 0:l.path)&&void 0!==o?o:"",path:null!==(r=null==l?void 0:l.path)&&void 0!==r?r:"",index:i},ft(e,i,s))}),[...i.values()].map(({view:e,template:t,name:i,closest:s,where:a,count:n})=>s?{view:e,template:t,name:i,closest:s,where:a,count:n}:{view:e,template:t,name:i,where:a,count:n})}function ad(e,t,i){if(!e.includes("[["))return e;const s=e.replace(/\[\[([^[\]]+)\]\]/g,(e,s)=>s.startsWith(De)?e:`[[${function(e,t,i){const s=e.endsWith("?"),a=(s?e.slice(0,-1):e).split("|"),n=a[0],o=n.endsWith("?"),r=o?n.slice(0,-1):n;(r===t||r.startsWith(`${t}.`))&&(a[0]=`${i}${r.slice(t.length)}${o?"?":""}`);for(let l=1;l<a.length;l+=1){const e=a[l];if(e===`or:${t}`)a[l]=`or:${i}`;else if(He(e)===t){const s=e.startsWith("if:!")?"!":"";a[l]=`if:${s}${i}${e.slice(3+s.length+t.length)}`}}return`${a.join("|")}${s?"?":""}`}(s,t,i)}]]`);return s.replace(new RegExp(`\\[\\[${a=t,a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=\\.\\[\\[)`,"g"),`[[${i}`);var a}function nd(e,t,i){if("string"==typeof e)return ad(e,t,i);if(Array.isArray(e))return e.map(e=>nd(e,t,i));if(e&&"object"==typeof e){const s={};for(const[a,n]of Object.entries(e))s[ad(a,t,i)]=nd(n,t,i);return s}return e}function od(e,t,i){const s=e=>!!e&&"object"==typeof e&&!Array.isArray(e),a=(e,t)=>s(e)&&Object.prototype.hasOwnProperty.call(e,t),n=e=>{if(!s(e))return e;const a={};for(const[s,n]of Object.entries(e))s!==i&&(a[s===t?i:s]=n);return a};return Array.isArray(e)?e.some(e=>a(e,t))?e.map(n).filter(e=>!s(e)||Object.keys(e).length>0):e:a(e,t)?n(e):e}function rd(e,t,i){const s=nd(e,t,i);return Array.isArray(s.variables)?s.variables=s.variables.map(e=>e&&"object"==typeof e&&e.name===t?Object.assign(Object.assign({},e),{name:i}):e):s.variables&&"object"==typeof s.variables&&(s.variables=od(s.variables,t,i)),void 0!==s.default&&(s.default=od(s.default,t,i)),void 0!==s.defaults&&(s.defaults=od(s.defaults,t,i)),void 0!==s.let&&(s.let=od(s.let,t,i)),s}function ld(e){const t=null==e?void 0:e.extends;return(Array.isArray(t)?t:[t]).filter(e=>"string"==typeof e)}function dd(e,t,i){const s=ut(e),a=new Set([t]);for(const o of null!=i?i:[])Object.prototype.hasOwnProperty.call(s,o)||a.add(o);let n=!0;for(;n;){n=!1;for(const[e,t]of Object.entries(s))!a.has(e)&&ld(t).some(e=>a.has(e))&&(a.add(e),n=!0)}return a}function cd(e){if(!e)return[];const t=new Set(Ws(e));for(const i of ed(e))i.includes(".")||"_"===i||t.add(i);return[...t].sort()}function hd(e,t,i,s,a){const n=dd(e,t,a);let o=0,r=0;const l=(e,t)=>JSON.stringify(e)!==JSON.stringify(t),d=e=>{if(Array.isArray(e))return e.map(d);if(!e||"object"!=typeof e)return e;let t={};for(const[i,s]of Object.entries(e))t[i]=d(s);if(Pe.includes(e.type)&&n.has(e.template)){const e=function(e,t,i){var s;const a=Object.assign({},e);void 0!==a.variables&&(a.variables=od(a.variables,t,i)),Array.isArray(a.for_each)?a.for_each=a.for_each.map(e=>od(e,t,i)):void 0!==a.for_each&&(a.for_each=od(a.for_each,t,i));const n=null===(s=a.for_each_from)||void 0===s?void 0:s.overrides;if(n&&"object"==typeof n&&!Array.isArray(n)){const e={};for(const[s,a]of Object.entries(n))e[s]=od(a,t,i);a.for_each_from=Object.assign(Object.assign({},a.for_each_from),{overrides:e})}return"string"==typeof a.name&&(a.name=ad(a.name,t,i)),a}(t,i,s);l(e,t)&&(o+=1),t=e}if(v(e.type)&&n.has(e.template)){const e=rd(t,i,s);l(e,t)&&(r+=1),t=e}return t},c=Object.assign({},e);Array.isArray(null==e?void 0:e.views)&&(c.views=d(e.views));const h=null==e?void 0:e.decluttering_templates;if(h&&"object"==typeof h){const e={};for(const[t,a]of Object.entries(h)){let o=d(a);if(n.has(t)){const e=rd(o,i,s);l(e,o)&&(r+=1),o=e}e[t]=o}c.decluttering_templates=e}return{config:c,cards:o,templates:r}}function pd(e,t,i){if(Object.prototype.hasOwnProperty.call(ut(e),t))return!1;if(i===_t)return!0;const s=yt(e);return s.includes(i)||s.includes("*")}class ud extends m{constructor(){super(...arguments),this._renameTo="",this._renaming=!1,this._duplicateTo="",this._busy=!1,this._modernisePending=!1,this._similarNames={},this._searchQuery="",this._searching=!1,this._varTo=""}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=G())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:A()}static get styles(){return ta}_fireConfigChanged(e){g(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return ea(this,e,t,i)}render(){return this.hass&&this._config?this._renderUsages():e``}_renderUsages(){var t,i;const s=null===(t=this._config)||void 0===t?void 0:t.template;if(!s)return e``;const n=this._savedLovelace;if(!n)return e`<div class="usages">
        <ha-alert alert-type="warning">${a("template_editor.usages_unreadable",void 0,this.hass)}</ha-alert>
      </div>`;(null===(i=this._usages)||void 0===i?void 0:i.name)===s&&this._usages.ll===n||(this._usages={name:s,ll:n,usages:bt(n,s)});const{views:o,templates:r}=this._usages.usages,l=o.reduce((e,t)=>e+t.count,0),d=document.location.pathname.split("/").slice(0,2).join("/");return e`
      <div class="usages">
        ${0!==l||r.length?e`
                <p class="hint">
                  ${a(1===l?"template_editor.usages_one":"template_editor.usages_many",{total:l,name:s},this.hass)}
                </p>
                <ul>
                  ${o.map(t=>e`
                      <li>
                        <a href=${`${d}/${t.path||t.index}`} target="_blank" rel="noreferrer">
                          ${t.title||t.path||a("template_editor.untitled_view",void 0,this.hass)}
                        </a>
                        —
                        ${1===t.count?a("template_editor.used_once",void 0,this.hass):a("template_editor.used_times",{count:t.count},this.hass)}
                      </li>
                    `)}
                </ul>
              `:e`<ha-alert alert-type="info">
                ${a("template_editor.usages_none",{name:s},this.hass)}
              </ha-alert>`}
        ${r.length?e`<ha-alert alert-type="info">
                ${a(1===r.length?"template_editor.used_by_template":"template_editor.used_by_templates",{names:r.join(", ")},this.hass)}
              </ha-alert>`:e``}
        ${this._renderElsewhere(s)} ${this._renderImpact(n,s)}
        <decluttering-card-plus-health .hass=${this.hass} .lovelace=${n}
          >${this._renderUndo()}</decluttering-card-plus-health
        >
        ${this._renderSimilar(n)} ${this._renderSearch()} ${this._renderRename(s,l)}
        ${this._renderRenameVariable(s)} ${this._renderDuplicate(s)} ${this._renderModernise()}
        ${this._toolError?e`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:e``}
      </div>
    `}_renderUndo(){var t,i;const s=$t();if(!s)return e``;const n=wt(s.operation,this.hass),o=new Date(s.at).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language);return e`
      <div class="undo">
        <p class="hint">${a("undo.held",{operation:n,time:o},this.hass)}</p>
        ${this._undoChanged?e`<ha-alert alert-type="warning">
                ${a("undo.changed_here",{operation:n,dashboards:this._undoChanged.join(", ")},this.hass)}
              </ha-alert>`:e``}
        <ha-button .disabled=${this._busy} @click=${this._undo}>
          ${a(this._undoChanged?"undo.anyway_button":"undo.button",{operation:n},this.hass)}
        </ha-button>
      </div>
    `}async _undo(){const e=$t();if(e){this._busy=!0;try{const t=await xt(this,this.hass,e,!!this._undoChanged,!1);this._undoChanged="changed"===(null==t?void 0:t.result)?t.dashboards:void 0}finally{this._busy=!1}}}_renderSimilar(t){var i;if((null===(i=this._similar)||void 0===i?void 0:i.ll)!==t){const e=kt(t);this._similar={ll:t,cards:e,groups:Kl(e.map(e=>e.config))}}const{cards:s,groups:n}=this._similar;if(!n.length)return e``;const o=Object.keys(S(t));return e`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${a(1===n.length?"tools.similar_header_one":"tools.similar_header",{count:n.length},this.hass)}
        </span>
        <p class="hint">${a("tools.similar_hint",{max:8},this.hass)}</p>
        ${n.slice(0,10).map(e=>this._renderSimilarGroup(e,s,o))}
      </ha-expansion-panel>
    `}_renderSimilarGroup(t,i,s){var n;const o=t.indices.map(e=>i[e]),r=Gl(o.map(e=>e.config)),l=(null!==(n=this._similarNames[t.key])&&void 0!==n?n:function(e,t,i=[]){let s=Jl(e.replace(/^custom:/,"").replace(/-/g,"_")).toLowerCase();/(^|_)card$/.test(s)||(s=`${s}_card`);const a=new Set(i.map(e=>"string"==typeof(null==e?void 0:e.entity)&&e.entity.includes(".")?e.entity.split(".")[0]:"")),[n]=[...a];return 1===a.size&&n&&(s=`${Jl(n).toLowerCase()}_${s}`),Ss(s,t)}(t.type,s,o.map(e=>e.config))).trim(),d=this._similarPending===`${t.key}\0${l}`,c=s.includes(l);return e`
      <div class="similar">
        <h3>${a("tools.similar_group",{count:o.length,type:t.type},this.hass)}</h3>
        <p class="hint">${a("tools.similar_differ",{names:r.names.join(", ")},this.hass)}</p>
        <ul>
          ${o.slice(0,8).map(t=>e`<li>${t.label}</li>`)}
        </ul>
        ${o.length>8?e`<p class="hint">
                ${a("editor.matches_more",{count:o.length-8},this.hass)}
              </p>`:e``}
        ${c?e`<ha-alert alert-type="error">${a("tools.name_taken",{name:l},this.hass)}</ha-alert>`:e``}
        ${d?e`
                <ha-alert alert-type="warning">
                  ${a("tools.similar_confirm",{name:l,count:o.length},this.hass)}
                </ha-alert>
                <p class="hint">${a("tools.similar_template",{name:l},this.hass)}</p>
                ${ua(`${t.key}\0${l}`,e`<ha-yaml-editor
                    .hass=${this.hass}
                    .defaultValue=${{[l]:r.template}}
                    read-only
                  ></ha-yaml-editor>`)}
                <p class="hint">${a("tools.similar_first_card",void 0,this.hass)}</p>
                ${tl(o[0].config,Ql(l,r.variables[0],r.layout[0]),this.hass)}
              `:e``}
        ${Xs({label:a("tools.similar_name",void 0,this.hass),value:l,disabled:this._busy,onInput:e=>{this._similarNames=Object.assign(Object.assign({},this._similarNames),{[t.key]:e}),this._similarPending=void 0}})}
        <ha-button
          .disabled=${this._busy||!l||c}
          @click=${()=>{this._makeTemplate(t,o,l)}}
        >
          ${a(d?"tools.similar_make_anyway":"tools.similar_make",void 0,this.hass)}
        </ha-button>
      </div>
    `}async _makeTemplate(e,t,i){const s=`${e.key}\0${i}`;if(this._similarPending!==s)return void(this._similarPending=s);const a=await this._saveDashboard(e=>function(e,t,i){const{template:s,variables:a,layout:n}=Gl(t);let o=Ye(e,i,s);return t.forEach((e,t)=>{o=ie(o,e,Ql(i,a[t],n[t]))}),o}(e,t.map(e=>e.config),i),"make_template");if(a){this._similarPending=void 0;const t=Object.assign({},this._similarNames);delete t[e.key],this._similarNames=t}}_renderElsewhere(t){var i;if((null===(i=this._remoteUsages)||void 0===i?void 0:i.name)!==t){this._remoteUsages={name:t,list:[]};const e=document.location.pathname.split("/").filter(Boolean)[0];jt(this.hass,t,e).then(e=>{var i;(null===(i=this._remoteUsages)||void 0===i?void 0:i.name)===t&&(this._remoteUsages={name:t,list:e})})}const s=this._remoteUsages.list;if(!s.length)return e``;const n=s.map(e=>`${e.urlPath} (${e.total})`).join(", ");return e`<ha-alert alert-type="info">
      ${a("template_editor.usages_elsewhere",{list:n},this.hass)}
    </ha-alert>`}_renderImpact(t,i){const s=At(t,i);if(!s||!this._config)return e``;const n=e=>{if(e)return d(s.variables,e,W(e),i,this.hass,!0)};let o,r;try{o=n(S(t)[i]),r=n(S(t,void 0,this._config)[i])}catch(l){return e``}return e`
      <ha-expansion-panel outlined>
        <span slot="header">${a("template_editor.impact_header",void 0,this.hass)}</span>
        <p class="hint">${a("template_editor.impact_diff_hint",void 0,this.hass)}</p>
        ${il(o,r,this.hass)}
      </ha-expansion-panel>
    `}_renderRename(t,i){const s=this._renameTo.trim(),n=!!s&&this._renamePending===s,o=i?1===i?a("tools.rewrites_one",void 0,this.hass):a("tools.rewrites_many",{count:i},this.hass):"";return e`
      <div class="rename">
        <h3>${a("tools.rename_header",void 0,this.hass)}</h3>
        <p class="hint">${a("tools.rename_hint",void 0,this.hass)}</p>
        ${this._renameError?e`<ha-alert alert-type="error">${this._renameError}</ha-alert>`:e``}
        ${n?e`<ha-alert alert-type="warning">
                ${a("tools.rename_confirm",{from:t,to:s,rewrites:o},this.hass)}
              </ha-alert>`:e``}
        ${Xs({label:a("tools.new_name",void 0,this.hass),value:this._renameTo,disabled:this._renaming,onInput:e=>this._renameChanged(e)})}
        <ha-button .disabled=${this._renaming||!s||s===t} @click=${this._rename}>
          ${n?a("tools.rename_anyway",void 0,this.hass):1===i?a("tools.rename_update_one",void 0,this.hass):i?a("tools.rename_update_many",{count:i},this.hass):a("tools.rename",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderModernise(){const t=this._savedLovelace,i=t?St(t):0;return i?e`
      <div class="rename">
        <h3>${a("tools.modernise_header",void 0,this.hass)}</h3>
        <p class="hint">
          ${a(1===i?"tools.modernise_hint_one":"tools.modernise_hint_many",{count:i},this.hass)}
        </p>
        ${this._modernisePending?e`<ha-alert alert-type="warning">
                ${a(1===i?"tools.modernise_confirm_one":"tools.modernise_confirm_many",{count:i},this.hass)}
              </ha-alert>`:e``}
        <ha-button .disabled=${this._busy} @click=${this._modernise}>
          ${a(this._modernisePending?"tools.modernise_anyway":1===i?"tools.modernise_one":"tools.modernise_many",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}async _modernise(){if(!this._modernisePending)return void(this._modernisePending=!0);await this._saveDashboard(e=>Ot(e),"modernise")&&(this._modernisePending=!1)}_renameChanged(e){this._renameTo=e,this._renameError=void 0,this._renamePending=void 0}async _rename(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._renameTo.trim();if(!i||!s||s===i)return;const n=G();if(n)if(void 0===S(n.config)[s])if(this._renamePending===s){this._renaming=!0,this._renameError=void 0;try{await X(this,this.hass,"rename_template",[{urlPath:te(),build:e=>Ct(e,i,s)}],this._config),this._undoChanged=void 0,this._fireConfigChanged(Object.assign(Object.assign({},this._config),{template:s})),this._renameTo="",this._renamePending=void 0}catch(o){this._renameError=a("tools.save_failed",{message:null!==(t=null==o?void 0:o.message)&&void 0!==t?t:o},this.hass)}finally{this._renaming=!1}}else this._renamePending=s;else this._renameError=a("tools.name_taken",{name:s},this.hass);else this._renameError=a("tools.cannot_rename_here",void 0,this.hass)}_renderSearch(){const t=this._searchQuery.trim(),i=this._searchResult,s=e=>"variables"===e.where?"":a(`tools.search_in_${e.where}`,void 0,this.hass),n=e=>e.view.title||e.view.path||a("template_editor.untitled_view",void 0,this.hass);return e`
      <div class="rename">
        <h3>${a("tools.search_header",void 0,this.hass)}</h3>
        <p class="hint">${a("tools.search_hint",void 0,this.hass)}</p>
        ${Xs({label:a("tools.search_label",void 0,this.hass),value:this._searchQuery,onInput:e=>{this._searchQuery=e},onKeydown:e=>{"Enter"===e.key&&this._search()}})}
        <ha-button .disabled=${this._searching||!t} @click=${()=>{this._search()}}>
          ${a(this._searching?"tools.searching":"tools.search",void 0,this.hass)}
        </ha-button>
        ${!i||i.cards.length||i.templates.length?e``:e`<p class="hint">${a("tools.search_none",{query:i.query},this.hass)}</p>`}
        ${(null==i?void 0:i.cards.length)?e`
                <p class="hint">${a("tools.search_cards",{count:i.cards.length},this.hass)}</p>
                <ul>
                  ${i.cards.slice(0,Js).map(t=>e`
                      <li>
                        <a
                          href=${`/${t.urlPath}/${t.view.path||t.view.index}`}
                          target="_blank"
                          rel="noreferrer"
                          >${t.urlPath} › ${n(t)}</a
                        >
                        — ${t.template}: <code>${t.variable}</code> = ${t.value}${s(t)}
                      </li>
                    `)}
                </ul>
                ${i.cards.length>Js?e`<p class="hint">
                        ${a("editor.matches_more",{count:i.cards.length-Js},this.hass)}
                      </p>`:e``}
              `:e``}
        ${(null==i?void 0:i.templates.length)?e`
                <p class="hint">${a("tools.search_templates",{count:i.templates.length},this.hass)}</p>
                <ul>
                  ${i.templates.slice(0,Js).map(t=>e`<li>
                          ${t.urlPath} › ${t.template}: <code>${t.path}</code> = ${t.value}
                        </li>`)}
                </ul>
                ${i.templates.length>Js?e`<p class="hint">
                        ${a("editor.matches_more",{count:i.templates.length-Js},this.hass)}
                      </p>`:e``}
              `:e``}
      </div>
    `}async _search(){const e=this._searchQuery.trim();if(e&&!this._searching){this._searching=!0;try{const i=te(),s=Xe(this.hass),a=[{urlPath:i,config:this._savedLovelace}];for(const e of this.hass?await Et(this.hass):[])if(Tt(e)!==i)try{a.push({urlPath:e,config:await et(s,e)})}catch(t){}this._searchResult=Object.assign({query:e},function(e,t){var i;const s=t.trim().toLowerCase(),a=[],n=[];if(!s)return{cards:a,templates:n};const o=e=>e.toLowerCase().includes(s);for(const{urlPath:r,config:l}of e){const e=(e,t)=>{var i,s;const n=(i,s,n)=>{a.push({urlPath:r,view:t,template:e.template,where:i,variable:s,value:n})},l=(e,t,i="")=>{for(const s of I(t)){const[t,a]=Object.entries(s)[0];for(const s of ql(a,`${i}${t}`))o(s.value)&&n(e,s.path,s.value)}};l("variables",e.variables);for(const a of null!==(i=q(e.for_each))&&void 0!==i?i:[])l("for_each",a);const d=null===(s=e.for_each_from)||void 0===s?void 0:s.overrides;if(d&&"object"==typeof d)for(const[a,r]of Object.entries(d))o(a)&&n("overrides",a,a),l("overrides",r,`${a} › `);for(const a of Dl)if(void 0!==e[a])for(const t of ql(e[a],a))o(t.value)&&n("override_block",t.path,t.value)},t=(i,s)=>{if(Array.isArray(i))for(const e of i)t(e,s);else if(i&&"object"==typeof i&&!v(i.type)){Pe.includes(i.type)&&"string"==typeof i.template&&e(i,s);for(const e of Object.values(i))t(e,s)}};(null!==(i=null==l?void 0:l.views)&&void 0!==i?i:[]).forEach((e,i)=>{var s,a,n;return t(e,{title:null!==(a=null!==(s=null==e?void 0:e.title)&&void 0!==s?s:null==e?void 0:e.path)&&void 0!==a?a:"",path:null!==(n=null==e?void 0:e.path)&&void 0!==n?n:"",index:i})});for(const[i,s]of Object.entries(ut(l))){const e=Object.assign({},null!=s?s:{});delete e.type,delete e.template;for(const t of ql(e,""))o(t.value)&&n.push(Object.assign({urlPath:r,template:i},t))}}return{cards:a,templates:n}}(a,e))}finally{this._searching=!1}}}_renderRenameVariable(t){const i=cd(this._config);if(!i.length||!this._config)return e``;const s=this._varFrom&&i.includes(this._varFrom)?this._varFrom:void 0,n=this._varTo.trim(),o=this._varPending,r=!!o&&o.from===s&&o.to===n,l=r&&o.elsewhere.length?a("tools.rename_variable_elsewhere",{list:o.elsewhere.map(e=>`${e.urlPath} (${e.cards})`).join(", ")},this.hass):"";return e`
      <div class="rename">
        <h3>${a("tools.rename_variable_header",void 0,this.hass)}</h3>
        <p class="hint">${a("tools.rename_variable_hint",void 0,this.hass)}</p>
        ${this._varError?e`<ha-alert alert-type="error">${this._varError}</ha-alert>`:e``}
        ${r&&s?e`
                <ha-alert alert-type="warning">
                  ${a("tools.rename_variable_confirm",{from:s,to:n,templates:o.templates,cards:o.cards,elsewhere:l},this.hass)}
                </ha-alert>
                ${tl(this._config,rd(this._config,s,n),this.hass)}
              `:e``}
        <ha-form
          .hass=${this.hass}
          .data=${{variable:null!=s?s:""}}
          .schema=${[{name:"variable",selector:{select:{mode:"dropdown",options:i.map(e=>({value:e,label:e}))}}}]}
          .computeLabel=${()=>a("tools.rename_variable_pick",void 0,this.hass)}
          @value-changed=${this._varPicked}
        ></ha-form>
        ${Xs({label:a("tools.new_name",void 0,this.hass),value:this._varTo,disabled:this._busy,onInput:e=>this._varToChanged(e)})}
        <ha-button
          .disabled=${this._busy||!s||!n||n===s}
          @click=${()=>{this._renameVariable(t)}}
        >
          ${a(r?"tools.rename_anyway":"tools.rename_variable",void 0,this.hass)}
        </ha-button>
      </div>
    `}_varPicked(e){e.stopPropagation(),this._varFrom=e.detail.value.variable||void 0,this._varError=void 0,this._varPending=void 0}_varToChanged(e){this._varTo=e,this._varError=void 0,this._varPending=void 0}async _renameVariable(e){var t;const i=this._varFrom,s=this._varTo.trim();if(!i||!s||s===i||!this._config)return;if(!function(e){return/^[A-Za-z0-9_-]+$/.test(e)}(s))return void(this._varError=a("tools.rename_variable_invalid",{name:s},this.hass));const n=G();if(!n)return void(this._varError=a("tools.cannot_save_here",void 0,this.hass));if(function(e,t,i,s){const a=ut(e);for(const n of dd(e,t))if(cd(n===t&&s?s:a[n]).includes(i))return!0;return!1}(n.config,e,s,this._config))return void(this._varError=a("tools.rename_variable_taken",{name:s},this.hass));const o=te(),r=this._varPending;if(r&&r.from===i&&r.to===s){this._busy=!0,this._varError=void 0;try{let t;await X(this,this.hass,"rename_variable",[{urlPath:o,build:a=>(t=dd(a,e),hd(a,e,i,s).config)},...r.elsewhere.map(a=>({urlPath:a.urlPath,build:a=>pd(a,e,o)?hd(a,e,i,s,t).config:a}))],this._config),this._undoChanged=void 0,this._fireConfigChanged(rd(this._config,i,s)),this._varFrom=s,this._varTo="",this._varPending=void 0}catch(l){this._varError=a("tools.save_failed",{message:null!==(t=null==l?void 0:l.message)&&void 0!==t?t:l},this.hass)}finally{this._busy=!1}}else{this._busy=!0;try{const t=Xe(this.hass),a=await et(t,o).catch(()=>n.config),r=hd(a,e,i,s),l=dd(a,e),c=[];for(const n of this.hass?await Et(this.hass):[]){if(Tt(n)===o)continue;let a;try{a=await et(t,n)}catch(d){continue}if(!pd(a,e,o))continue;const r=hd(a,e,i,s,l);(r.cards||r.templates)&&c.push({urlPath:n,cards:r.cards})}this._varPending={from:i,to:s,cards:r.cards,templates:r.templates,elsewhere:c}}finally{this._busy=!1}}}_renderDuplicate(t){const i=this._duplicateTo.trim(),s=!!i&&this._duplicatePending===i;return e`
      <div class="rename">
        <h3>${a("tools.duplicate_header",void 0,this.hass)}</h3>
        <p class="hint">${a("tools.duplicate_hint",void 0,this.hass)}</p>
        ${s?e`<ha-alert alert-type="warning">
                ${a("tools.duplicate_confirm",{to:i,name:t},this.hass)}
              </ha-alert>`:e``}
        ${Xs({label:a("tools.copy_name",void 0,this.hass),value:this._duplicateTo,disabled:this._busy,onInput:e=>this._duplicateChanged(e)})}
        <ha-button .disabled=${this._busy||!i||i===t} @click=${this._duplicate}>
          ${a(s?"tools.duplicate_anyway":"tools.duplicate",void 0,this.hass)}
        </ha-button>
      </div>
    `}_duplicateChanged(e){this._duplicateTo=e,this._toolError=void 0,this._duplicatePending=void 0}async _duplicate(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._duplicateTo.trim();if(!i||!s||s===i)return;const n=G();if(n&&void 0!==S(n.config)[s])return void(this._toolError=a("tools.name_taken",{name:s},this.hass));if(this._duplicatePending!==s)return void(this._duplicatePending=s);const o=Object.assign(Object.assign({},this._config),{template:s}),r=ae(null!==(t=null==n?void 0:n.config)&&void 0!==t?t:this.lovelace,i),l=await this._saveDashboard(e=>{var t,i;return Ze(e,null!==(i=null===(t=null==r?void 0:r.view)||void 0===t?void 0:t.index)&&void 0!==i?i:0,o)},"duplicate");l&&(this._duplicateTo="",this._duplicatePending=void 0)}}h([p({attribute:!1})],ud.prototype,"hass",void 0),h([p({attribute:!1})],ud.prototype,"lovelace",void 0),h([p({attribute:!1})],ud.prototype,"config",void 0),h([u()],ud.prototype,"_renameTo",void 0),h([u()],ud.prototype,"_renameError",void 0),h([u()],ud.prototype,"_renaming",void 0),h([u()],ud.prototype,"_renamePending",void 0),h([u()],ud.prototype,"_duplicateTo",void 0),h([u()],ud.prototype,"_duplicatePending",void 0),h([u()],ud.prototype,"_toolError",void 0),h([u()],ud.prototype,"_busy",void 0),h([u()],ud.prototype,"_modernisePending",void 0),h([u()],ud.prototype,"_remoteUsages",void 0),h([u()],ud.prototype,"_undoChanged",void 0),h([u()],ud.prototype,"_similarNames",void 0),h([u()],ud.prototype,"_similarPending",void 0),h([u()],ud.prototype,"_searchQuery",void 0),h([u()],ud.prototype,"_searching",void 0),h([u()],ud.prototype,"_searchResult",void 0),h([u()],ud.prototype,"_varFrom",void 0),h([u()],ud.prototype,"_varTo",void 0),h([u()],ud.prototype,"_varError",void 0),h([u()],ud.prototype,"_varPending",void 0),customElements.get("decluttering-template-usages-tab")||customElements.define("decluttering-template-usages-tab",ud);class md extends m{constructor(){super(...arguments),this._selectedTab="settings",this._suggestedNothing=!1,this._busy=!1,this._declutterPending=!1,this._promoteName="",this._loadedElements=!1}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=G())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:A()}static describeSchema(){var e;return null!==(e=md._describeSchema)&&void 0!==e||(md._describeSchema=[{name:"template",label:a("template_editor.template_label"),selector:{text:{}}},{name:"thingType",label:a("template_editor.type_label"),selector:{select:{mode:"dropdown",options:[{value:"card",label:a("template_editor.type_card")},{value:"badge",label:a("template_editor.type_badge")},{value:"row",label:a("template_editor.type_row")},{value:"element",label:a("template_editor.type_element")}]}}},{name:"description",label:a("template_editor.description_label"),helper:a("template_editor.description_helper"),selector:{text:{multiline:!0}}},{name:"category",label:a("template_editor.category_label"),helper:a("template_editor.category_helper"),selector:{text:{}}}]),md._describeSchema}static defaultsSchema(){var e;return null!==(e=md._defaultsSchema)&&void 0!==e||(md._defaultsSchema=[{name:"default",label:a("template_editor.defaults_label"),helper:a("template_editor.defaults_helper"),selector:{object:{}}}]),md._defaultsSchema}setConfig(e){this._config=e,this._suggestion=void 0,this._suggestedNothing=!1}render(){var t;if(!this.hass||!this._config)return e``;const i={};E(this._config.default)&&E(this._config.defaults)||(i.default=a("error.variables_shape",void 0,this.hass)),Nt(this._config.variables)||(i.variables=a("template_editor.declarations_shape",void 0,this.hass));const s={template:this._config.template,thingType:null!==(t=N(this._config))&&void 0!==t?t:"card",description:this._config.description,category:this._config.category},n={default:Oe(this._config)},o=C(this._config).length;return e`
      <ha-tab-group .active=${this._selectedTab} @click=${this._activateTab}>
        <ha-tab-group-tab slot="nav" panel="settings">
          ${a("template_editor.tab_settings",void 0,this.hass)}
        </ha-tab-group-tab>
        ${"card"===s.thingType&&void 0===this._config.group?e`
                <ha-tab-group-tab slot="nav" panel="card">
                  ${a("template_editor.tab_card",void 0,this.hass)}
                </ha-tab-group-tab>
                <ha-tab-group-tab slot="nav" panel="change_card">
                  ${a("template_editor.tab_change_card",void 0,this.hass)}
                </ha-tab-group-tab>
              `:"row"===s.thingType?e`<ha-tab-group-tab slot="nav" panel="row">
                  ${a("template_editor.tab_row",void 0,this.hass)}
                </ha-tab-group-tab>`:e``}
        <ha-tab-group-tab slot="nav" panel="usages">
          ${a("template_editor.tab_usages",void 0,this.hass)}
        </ha-tab-group-tab>
        <ha-tab-group-tab slot="nav" panel="share">
          ${a("template_editor.tab_share",void 0,this.hass)}
        </ha-tab-group-tab>
      </ha-tab-group>
      <decluttering-example-strip
        .hass=${this.hass}
        .lovelace=${this._savedLovelace}
        .config=${this._config}
        @config-changed=${this._childConfigChanged}
      ></decluttering-example-strip>
      ${"settings"===this._selectedTab?e`
              <ha-expansion-panel outlined expanded>
                <span slot="header">${a("template_editor.panel_describe",void 0,this.hass)}</span>
                <div class="panel">
                  ${this._renderInUse()}
                  ${md.describeSchema().map(t=>e`
                      <div class="field-row">
                        <ha-form
                          .hass=${this.hass}
                          .data=${s}
                          .schema=${[t]}
                          .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
                          .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
                          @value-changed=${this._describeChanged}
                        ></ha-form>
                        <decluttering-help
                          .hass=${this.hass}
                          key=${"thingType"===t.name?"type":t.name}
                        ></decluttering-help>
                      </div>
                    `)}
                </div>
              </ha-expansion-panel>
              <ha-expansion-panel outlined expanded>
                <span slot="header"
                  >${a("template_editor.panel_variables",void 0,this.hass)}
                  <small>${a("declarations.count",{count:o},this.hass)}</small></span
                >
                <div class="panel">
                  ${this._renderDiagnostics()}
                  ${i.variables?e`<ha-alert alert-type="error">${i.variables}</ha-alert>`:e``}
                  <div class="field-row help-only">
                    <decluttering-help .hass=${this.hass} key="variables"></decluttering-help>
                  </div>
                  <decluttering-declarations-editor
                    .hass=${this.hass}
                    .variables=${this._config.variables}
                    .shared=${Pt(this._savedLovelace)}
                    @value-changed=${this._declarationsChanged}
                  ></decluttering-declarations-editor>
                  <div class="field-row">
                    <ha-form
                      .hass=${this.hass}
                      .data=${n}
                      .schema=${md.defaultsSchema()}
                      .error=${i}
                      .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
                      .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
                      @value-changed=${this._defaultsChanged}
                    ></ha-form>
                    <decluttering-help .hass=${this.hass} key="default"></decluttering-help>
                  </div>
                  ${this._renderLint()} ${this._renderSuggest("card"===s.thingType)}
                </div>
              </ha-expansion-panel>
              <ha-expansion-panel outlined>
                <span slot="header">${a("template_editor.panel_tools",void 0,this.hass)}</span>
                <div class="panel">
                  ${this._renderPromote()} ${this._renderGroupOrder()} ${this._renderDeclutter()}
                  <decluttering-placeholder-tool
                    .hass=${this.hass}
                    .lovelace=${this._savedLovelace}
                    .config=${this._config}
                  ></decluttering-placeholder-tool>
                </div>
              </ha-expansion-panel>
            `:"card"===this._selectedTab?e`
                <hui-card-element-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .value=${this._config.card}
                  @config-changed=${this._cardChanged}
                ></hui-card-element-editor>
              `:"change_card"===this._selectedTab?e`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this.lovelace}
                    @config-changed=${this._cardPicked}
                  ></hui-card-picker>
                `:"row"===this._selectedTab?e`
                    <hui-row-element-editor
                      .hass=${this.hass}
                      .lovelace=${this.lovelace}
                      .value=${this._config.row}
                      @config-changed=${this._rowChanged}
                    ></hui-row-element-editor>
                  `:"usages"===this._selectedTab?e`<decluttering-template-usages-tab
                      .hass=${this.hass}
                      .lovelace=${this.lovelace}
                      .config=${this._config}
                      @select-tab=${this._selectTab}
                    ></decluttering-template-usages-tab>`:"share"===this._selectedTab?e`<decluttering-template-share-tab
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        .config=${this._config}
                        @select-tab=${this._selectTab}
                      ></decluttering-template-share-tab>`:e``}
    `}_renderDiagnostics(){if(!this._config||!Nt(this._config.variables))return e``;const{unused:t,duplicated:i,contradictory:s}=Lt(this._config);return e`
      ${t.length?e`<ha-alert alert-type="info">
              ${a(1===t.length?"template_editor.declared_unused_one":"template_editor.declared_unused_many",{names:t.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${i.length?e`<ha-alert alert-type="warning">
              ${a(1===i.length?"template_editor.duplicated_one":"template_editor.duplicated_many",{names:i.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${s.length?e`<ha-alert alert-type="warning">
              ${a(1===s.length?"template_editor.contradictory_one":"template_editor.contradictory_many",{names:s.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_renderLint(){if(!this._config)return e``;const t=this._savedLovelace,i=S(t,void 0,this._config)[this._config.template],s=Bs(this._config,[...Ws(i),...Object.keys(J(t))]);return s.length?e`${s.map(t=>e`<ha-alert alert-type=${t.level}>
          ${a(t.key,t.params,this.hass)}${t.params.closest?a("error.did_you_mean",{closest:t.params.closest},this.hass):""}${t.path?a("lint.where",{path:t.path},this.hass):""}
        </ha-alert>`)}`:e``}_renderSortable(t,i,s){const n=(e,i)=>{e.preventDefault();const a=this._dragging;this._dragging=void 0,(null==a?void 0:a.list)===t&&s(a.from,i)};return e`
      <ul>
        ${i.map((o,r)=>e`
            <li
              draggable="true"
              @dragstart=${e=>{var i;this._dragging={list:t,from:r},null===(i=e.dataTransfer)||void 0===i||i.setData("text/plain",o.name),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}}
              @dragover=${e=>{var i;(null===(i=this._dragging)||void 0===i?void 0:i.list)===t&&e.preventDefault()}}
              @drop=${e=>n(e,r)}
              @dragend=${()=>{this._dragging=void 0}}
            >
              <ha-svg-icon class="handle" .path=${Qs}></ha-svg-icon>
              <span>${o.label}</span>
              <span class="spacer"></span>
              <ha-icon-button
                .path=${"M7,15L12,10L17,15H7Z"}
                .disabled=${0===r}
                .label=${a("template_editor.move_up",{name:o.name},this.hass)}
                @click=${()=>s(r,r-1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,10L12,15L17,10H7Z"}
                .disabled=${r===i.length-1}
                .label=${a("template_editor.move_down",{name:o.name},this.hass)}
                @click=${()=>s(r,r+1)}
              ></ha-icon-button>
            </li>
          `)}
      </ul>
    `}_renderGroupOrder(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.group,s=It(i);if(void 0===i||s.length<2)return e``;const n=s.map((e,t)=>{var i,s,a,n;const o=null!==(a=null!==(s=null!==(i=null==e?void 0:e.name)&&void 0!==i?i:null==e?void 0:e.heading)&&void 0!==s?s:null==e?void 0:e.title)&&void 0!==a?a:null==e?void 0:e.entity,r=String(null!==(n=null==e?void 0:e.type)&&void 0!==n?n:"?").replace(/^custom:/,"");return{label:"string"==typeof o?`${r} (${o})`:r,name:`${t+1} ${r}`}});return e`
      <div class="order">
        <p class="hint">${a("template_editor.group_order_hint",void 0,this.hass)}</p>
        ${this._renderSortable("group",n,(e,t)=>{const a=ge(s,e,t);a!==s&&this._config&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{group:Ft(i,a)}))})}
      </div>
    `}_renderPromote(){const t=Ps(this._config);if(!this._config||!t)return e``;const i=function(e){const t=[],i=(e,s)=>{if(Array.isArray(e))e.forEach((e,t)=>i(e,[...s,t]));else if(e&&"object"==typeof e)for(const[t,a]of Object.entries(e))"type"===t&&"string"==typeof a||i(a,[...s,t]);else"string"==typeof e&&l.test(e)||s.length&&null!=e&&("string"!=typeof e&&"number"!=typeof e&&"boolean"!=typeof e||t.push({path:s,value:e,label:Ls(s)}))};return i(e,[]),t}(this._config[t]);if(!i.length)return e``;const s=this._promotePath?JSON.stringify(this._promotePath):"",n=e=>{const t=String(e);return t.length>40?`${t.slice(0,39)}…`:t};return e`
      <ha-expansion-panel outlined class="promote">
        <span slot="header">${a("template_editor.promote_header",void 0,this.hass)}</span>
        <p class="hint">${a("template_editor.promote_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${{setting:s}}
          .schema=${[{name:"setting",selector:{select:{mode:"dropdown",options:i.map(e=>({value:JSON.stringify(e.path),label:`${e.label} = ${n(e.value)}`}))}}}]}
          .computeLabel=${()=>a("template_editor.promote_pick",void 0,this.hass)}
          @value-changed=${this._promotePicked}
        ></ha-form>
        ${this._promotePath?e`
                ${Xs({label:a("template_editor.promote_name",void 0,this.hass),value:this._promoteName,onInput:e=>{this._promoteName=e,this._promoteError=void 0}})}
                ${this._promoteError?e`<ha-alert alert-type="error">${this._promoteError}</ha-alert>`:e``}
                <ha-button .disabled=${!this._promoteName.trim()} @click=${this._promote}>
                  ${a("template_editor.promote_button",void 0,this.hass)}
                </ha-button>
              `:e``}
      </ha-expansion-panel>
    `}_promotePicked(e){e.stopPropagation();const t=e.detail.value.setting;t&&(this._promotePath=JSON.parse(t),this._promoteName=function(e,t){const i=[...e].reverse().find(e=>"string"==typeof e),s=e[e.length-1];return Ss(("number"==typeof s?`${null!=i?i:"item"}_${s+1}`:null!=i?i:"value").replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value",t)}(this._promotePath,Is(this._config)),this._promoteError=void 0)}_promote(){if(!this._config||!this._promotePath)return;const e=this._promoteName.trim(),t=function(e,t,i){if(!Ts.test(i))return{ok:!1,error:"name_invalid"};if(Is(e).includes(i))return{ok:!1,error:"name_taken"};const s=Ps(e),a=s?function(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}(e[s],t):void 0;if(!s||null==a||"object"==typeof a)return{ok:!1,error:"gone"};const n={name:i,type:Fs(a),default:a};return{ok:!0,template:Object.assign(Object.assign({},e),{[s]:Ms(e[s],t,`[[${i}]]`),variables:Fe(e.variables,[n])})}}(this._config,this._promotePath,e);t.ok?(this._promotePath=void 0,this._promoteName="",this._fireConfigChanged(t.template)):this._promoteError=a(`template_editor.promote_${t.error}`,{name:e},this.hass)}_renderInUse(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._savedLovelace;if(!i||!s)return e``;const{views:n,templates:o}=bt(s,i),r=n.reduce((e,t)=>e+t.count,0)+o.length;return r?e`<ha-alert alert-type="info">
      ${a(1===r?"template_editor.in_use_one":"template_editor.in_use_many",{total:r},this.hass)}
    </ha-alert>`:e``}_renderSuggest(t){var i;return t&&(null===(i=this._config)||void 0===i?void 0:i.card)?e`
      <div class="suggest">
        ${this._suggestedNothing?e`<ha-alert alert-type="info">
                ${a("template_editor.suggest_nothing",void 0,this.hass)}
              </ha-alert>`:e``}
        ${this._suggestion?e`<ha-alert alert-type="warning">
                ${a(1===this._suggestion.variables.length?"template_editor.suggest_confirm_one":"template_editor.suggest_confirm_many",{names:this._suggestion.variables.map(e=>e.name).join(", ")},this.hass)}
              </ha-alert>`:e``}
        <ha-button @click=${this._suggest}>
          ${a(this._suggestion?"template_editor.suggest_anyway":"template_editor.suggest_button",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}_suggest(){var e;if(!(null===(e=this._config)||void 0===e?void 0:e.card))return;if(this._suggestion){const e=Object.assign(Object.assign({},this._config),{card:this._suggestion.card});return e.variables=Fe(this._config.variables,this._suggestion.variables),this._suggestion=void 0,void this._fireConfigChanged(e)}this._suggestedNothing=!1;const t=C(this._config).map(e=>e.name),i=function(e,t){const i=new Set(t),s=[],a=new Map,n=(e,t)=>{const n=`${e.base} ${t}`,o=a.get(n);if(o)return o;let r=1,l=e.base;for(;i.has(l);)r+=1,l=`${e.base}_${r}`;return i.add(l),a.set(n,l),s.push({name:l,label:es(e,r),selector:e.selector,default:t}),l},o=e=>{if(Array.isArray(e))return e.map(o);if(!e||"object"!=typeof e)return e;const t={};for(const[i,s]of Object.entries(e)){const e=Object.prototype.hasOwnProperty.call(Xi,i)?Xi[i]:void 0;e&&"string"==typeof s&&!l.test(s)&&e.matches(s)?t[i]=`[[${n(e,s)}]]`:t[i]=o(s)}return t};return{card:o(e),variables:s}}(this._config.card,t);i.variables.length?this._suggestion=i:this._suggestedNothing=!0}_renderDeclutter(){var t,i;const s=this._savedLovelace,n=kt(s),o="card"===N(null!==(t=this._config)&&void 0!==t?t:{})?Mt(s):[];if(!n.length&&!o.length||!this._config)return e``;const r=this._config.template,l=!!r&&r in S(s),d=null!==(i=this._declutterOriginal)&&void 0!==i?i:this._declutterSection;return e`
      <ha-expansion-panel outlined>
        <span slot="header">${a("template_editor.declutter_header",void 0,this.hass)}</span>
        <p class="hint">${a("template_editor.declutter_hint",void 0,this.hass)}</p>
        ${n.length?e`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:n.map((e,t)=>({value:String(t),label:e.label}))}}}]}
                .computeLabel=${()=>a("template_editor.declutter_pick",void 0,this.hass)}
                @value-changed=${e=>this._declutterPicked(e,n)}
              ></ha-form>`:e``}
        ${o.length?e`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:o.map((e,t)=>({value:String(t),label:a(1===e.cards.length?"template_editor.declutter_section_one":"template_editor.declutter_section_many",{where:e.label,count:e.cards.length},this.hass)}))}}}]}
                .computeLabel=${()=>a("template_editor.declutter_pick_section",void 0,this.hass)}
                @value-changed=${e=>this._declutterSectionPicked(e,o)}
              ></ha-form>`:e``}
        ${d?e`
                <ha-button .disabled=${this._busy||!l} @click=${this._declutterReplace}>
                  ${a(this._declutterPending?"template_editor.declutter_replace_confirm":this._declutterSection?"template_editor.declutter_replace_section":"template_editor.declutter_replace",void 0,this.hass)}
                </ha-button>
                ${l?e``:e`<p class="hint">${a("template_editor.declutter_save_first",void 0,this.hass)}</p>`}
              `:e``}
      </ha-expansion-panel>
    `}_declutterPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterOriginal=i.config,this._declutterSection=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{card:JSON.parse(JSON.stringify(i.config))});delete s.group,this._fireConfigChanged(s)}_declutterSectionPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterSection={view:i.view,section:i.section,cards:i.cards},this._declutterOriginal=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{group:{cards:JSON.parse(JSON.stringify(i.cards))}});delete s.card,this._fireConfigChanged(s)}async _declutterReplace(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.template,i=this._declutterOriginal,s=this._declutterSection;if(!t||!i&&!s)return;if(!this._declutterPending)return void(this._declutterPending=!0);const n={type:"custom:decluttering-card-plus",template:t};let o=!1;const r=await this._saveDashboard(e=>{if(i)return ie(e,i,n);const t=Vt(e,s.view,s.section,s.cards,[n]);return o=t===e,t},"declutter");r&&o&&(this._toolError=a("template_editor.declutter_section_changed",void 0,this.hass)),r&&(this._declutterPending=!1,this._declutterOriginal=void 0,this._declutterSection=void 0)}_selectTab(e){e.stopPropagation(),this._selectedTab=e.detail}_activateTab(e){const t=e.composedPath().find(e=>"ha-tab-group-tab"===e.localName),i=null==t?void 0:t.getAttribute("panel");i&&(this._selectedTab=i)}_describeChanged(e){var t;if(!this._config)return;const i=Object.assign({template:this._config.template,thingType:null!==(t=N(this._config))&&void 0!==t?t:"card",description:this._config.description,category:this._config.category},e.detail.value),s=Object.assign(Object.assign({},this._config),{template:i.template});P(s,"description",i.description),P(s,"category",i.category);const a=void 0!==s.group&&"card"===i.thingType;a||delete s.group;for(const[n,o]of Object.entries(Ks))md.stubMember(!a&&i.thingType===n,s,n,o);this._fireConfigChanged(s)}_declarationsChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);P(t,"variables",e.detail.value),this._fireConfigChanged(t)}_defaultsChanged(e){if(!this._config)return;const t=e.detail.value,i=Object.assign(Object.assign({},this._config),{default:t.default});void 0!==this._config.defaults&&(JSON.stringify(t.default)===JSON.stringify(Oe(this._config))?i.default=this._config.default:delete i.defaults),this._fireConfigChanged(i)}_childConfigChanged(e){e.stopPropagation(),this._fireConfigChanged(e.detail.config)}_cardChanged(e){if(e.stopPropagation(),!this._config)return;this._suggestion=void 0,this._suggestedNothing=!1;const t=Object.assign(Object.assign({},this._config),{card:e.detail.config});this._fireConfigChanged(t)}_cardPicked(e){this._selectedTab="card",this._cardChanged(e)}_rowChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign(Object.assign({},this._config),{row:e.detail.config});this._fireConfigChanged(t)}_fireConfigChanged(e){this._suggestion=void 0,this._suggestedNothing=!1,g(this,"config-changed",{config:e})}static stubMember(e,t,i,s){e?i in t||(t[i]=s):delete t[i]}static get styles(){return ta}_saveDashboard(e,t,i){return ea(this,e,t,i)}async connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=k(()=>this.requestUpdate())),this._loadedElements||(await j(),await async function(){let e=customElements.get("hui-entities-card");if(!e){if(!ze)return;(await ze).createCardElement({type:"entities",entities:[]}),await customElements.whenDefined("hui-entities-card"),e=customElements.get("hui-entities-card")}e&&e.getConfigElement&&await e.getConfigElement()}(),this._loadedElements=!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}}h([u()],md.prototype,"_config",void 0),h([u()],md.prototype,"_selectedTab",void 0),h([u()],md.prototype,"_suggestion",void 0),h([u()],md.prototype,"_suggestedNothing",void 0),h([u()],md.prototype,"_toolError",void 0),h([u()],md.prototype,"_busy",void 0),h([u()],md.prototype,"_declutterOriginal",void 0),h([u()],md.prototype,"_declutterSection",void 0),h([u()],md.prototype,"_declutterPending",void 0),h([u()],md.prototype,"_promotePath",void 0),h([u()],md.prototype,"_promoteName",void 0),h([u()],md.prototype,"_promoteError",void 0),h([p()],md.prototype,"lovelace",void 0),h([p()],md.prototype,"hass",void 0);class fd extends m{connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=k(()=>this.requestUpdate()))}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}static get styles(){return f`
      :host {
        display: block;
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
      .timings-header {
        margin: 16px 0 4px;
      }
      .timings {
        margin: 0 0 8px;
        padding-left: 20px;
        font-size: 0.9em;
      }
    `}render(){var t,i,s,n,o,r,l,d,c;const h=this.lovelace,p=Ae(h);if(p&&(null===(t=this._borrowed)||void 0===t?void 0:t.ll)!==h){this._borrowed={ll:h};const e=new Set(Object.keys(S(h)));Se(this.hass,h).then(t=>{var i;(null===(i=this._borrowed)||void 0===i?void 0:i.ll)===h&&(this._borrowed={ll:h,names:Object.keys(t).filter(t=>!e.has(t)),templates:t})})}const u=p&&!(null===(i=this._borrowed)||void 0===i?void 0:i.names),m=Ht(h,p&&null!==(n=null===(s=this._borrowed)||void 0===s?void 0:s.names)&&void 0!==n?n:[]),f=u?Object.assign(Object.assign({},m),{missingTemplates:[]}):m,g=Dt(h),v=qt(h),_=null===(o=this._borrowed)||void 0===o?void 0:o.names,y=this._examplesChecked;u||(null==y?void 0:y.ll)===h&&(null==y?void 0:y.borrowed)===_||(this._examplesChecked={ll:h,borrowed:_,failed:lt(S(h),null!=_?_:[],this.hass)});const b=u?[]:null!==(l=null===(r=this._examplesChecked)||void 0===r?void 0:r.failed)&&void 0!==l?l:[],$=sd(h,null!==(c=null===(d=this._borrowed)||void 0===d?void 0:d.templates)&&void 0!==c?c:S(h)),w=!(f.missingTemplates.length||f.unsetVariables.length||f.unusedTemplates.length||g.length||v.length||b.length||$.length);return e`
      <ha-expansion-panel outlined>
        <span slot="header">${a("tools.health_header",void 0,this.hass)}</span>
        <slot></slot>
        ${w?e`<p class="hint">${a("tools.health_ok",void 0,this.hass)}</p>`:e`
                ${b.map(t=>e`<ha-alert alert-type="error">
                      ${a("tools.health_example",{template:t.template,number:t.example,problems:t.problems.join(" ")},this.hass)}
                    </ha-alert>`)}
                ${g.map(t=>e`<ha-alert alert-type="error">
                      ${a("tools.health_extends_loop",{path:t.join(" → ")},this.hass)}
                    </ha-alert>`)}
                ${f.missingTemplates.map(t=>e`<ha-alert alert-type="error">
                      ${a("tools.health_missing",{template:t.template,count:t.count},this.hass)}${t.closest?a("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${f.unsetVariables.map(t=>e`<ha-alert alert-type="warning">
                      ${a("tools.health_unset",{template:t.template,names:t.names.join(", "),count:t.count},this.hass)}
                    </ha-alert>`)}
                ${v.map(t=>{const i=[...t.views.map(e=>a("tools.health_view_uses",{view:e.title||a("template_editor.untitled_view",void 0,this.hass),count:e.count},this.hass)),...t.templates.map(e=>a("tools.health_template_uses",{name:e},this.hass))].join(", ");return e`<ha-alert alert-type="warning">
                    ${t.message?a("tools.health_deprecated_because",{template:t.template,message:t.message,uses:i},this.hass):a("tools.health_deprecated",{template:t.template,uses:i},this.hass)}
                  </ha-alert>`})}
                ${$.map(t=>e`<ha-alert alert-type="warning">
                      ${a("tools.health_unread",{template:t.template,name:t.name,count:t.count,view:t.view.title||t.view.path||a("template_editor.untitled_view",void 0,this.hass)},this.hass)}${"variables"===t.where?"":a(`tools.health_unread_${t.where}`,void 0,this.hass)}${t.closest?a("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${f.unusedTemplates.length?e`<ha-alert alert-type="info">
                        ${a("tools.health_unused",{names:f.unusedTemplates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
              `}
        ${this._renderTimings()}
      </ha-expansion-panel>
    `}_renderTimings(){const t=Rt.entries(),i=e=>e.toFixed(1),s=e`<h4 class="timings-header">${a("tools.timings_header",void 0,this.hass)}</h4>`;if(!t.length)return e`${s}
        <p class="hint">${a("tools.timings_none",void 0,this.hass)}</p>`;const{byTotal:n,byMax:o,repeats:r}=zt(t);return e`
      ${s}
      <p class="hint">${a("tools.timings_hint",{count:t.length},this.hass)}</p>
      <p class="hint">${a("tools.timings_by_total",void 0,this.hass)}</p>
      <ul class="timings">
        ${n.map(t=>e`<li>
              ${a(1===t.builds?"tools.timings_total_row_one":"tools.timings_total_row",{template:t.template,total:i(t.total),builds:t.builds,max:i(t.max)},this.hass)}
            </li>`)}
      </ul>
      <p class="hint">${a("tools.timings_by_max",void 0,this.hass)}</p>
      <ul class="timings">
        ${o.map(t=>e`<li>
              ${a("tools.timings_max_row",{template:t.template,max:i(t.max)},this.hass)}
            </li>`)}
      </ul>
      ${r.length?e`
              <p class="hint">${a("tools.timings_repeats",void 0,this.hass)}</p>
              <ul class="timings">
                ${r.map(t=>{var i;return e`<li>
                      ${a(t.name?"tools.timings_repeat_named_row":"tools.timings_repeat_row",{template:t.template,name:null!==(i=t.name)&&void 0!==i?i:"",copies:t.copies},this.hass)}
                    </li>`})}
              </ul>
            `:e``}
    `}}h([p({attribute:!1})],fd.prototype,"hass",void 0),h([p({attribute:!1})],fd.prototype,"lovelace",void 0),h([u()],fd.prototype,"_borrowed",void 0),Ut(Wt,Yi),Ut(Bt,md),Ut(Kt,fd);export{Yi as DeclutteringCardEditor,fd as DeclutteringHealthPanel,md as DeclutteringTemplateEditor};
//# sourceMappingURL=decluttering-card-plus.editors-CZm7oQlB.js.map
