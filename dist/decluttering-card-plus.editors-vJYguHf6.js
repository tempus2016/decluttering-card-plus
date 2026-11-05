import{b as e,O as t,r as i,a as s,l as n,c as a,v as o,d as r,P as l,e as c,n as d,_ as h,f as p,g as u,i as m,h as f,j as g,k as v,m as _,B as y,o as b,p as $,q as w,s as x,t as k,u as j,w as A,x as S,y as O,z as C,A as E,C as T,D as N,E as P,F as L,G as I,H as F,I as M,J as V,K as H,L as D,M as q,N as R,Q as z,R as U,S as W,T as B,U as K,W as J,X as Y,Y as Z,Z as G,$ as Q,a0 as X,a1 as ee,a2 as te,a3 as ie,a4 as se,a5 as ne,a6 as ae,a7 as oe,a8 as re,a9 as le,aa as ce,ab as de,ac as he,ad as pe,ae as ue,af as me,ag as fe,ah as ge,ai as ve,aj as _e,ak as ye,al as be,am as $e,an as we,ao as xe,ap as ke,aq as je,ar as Ae,as as Se,at as Oe,au as Ce,av as Ee,aw as Te,ax as Ne,ay as Pe,az as Le,aA as Ie,aB as Fe,aC as Me,aD as Ve,aE as He,aF as De,aG as qe,aH as Re,aI as ze,aJ as Ue,aK as We,aL as Be,aM as Ke,aN as Je,aO as Ye,aP as Ze,aQ as Ge,aR as Qe,aS as Xe,aT as et,aU as tt,aV as it,aW as st,V as nt,aX as at,aY as ot,aZ as rt,a_ as lt,a$ as ct,b0 as dt,b1 as ht,b2 as pt,b3 as ut,b4 as mt,b5 as ft,b6 as gt,b7 as vt,b8 as _t,b9 as yt,ba as bt,bb as $t,bc as wt,bd as xt,be as kt,bf as jt,bg as At,bh as St,bi as Ot,bj as Ct,bk as Et,bl as Tt,bm as Nt,bn as Pt,bo as Lt,bp as It,bq as Ft,br as Mt,bs as Vt,bt as Ht,bu as Dt,bv as qt,bw as Rt,bx as zt,by as Ut,bz as Wt,bA as Bt,bB as Kt}from"./decluttering-card-plus.core-JQcb86W9.js";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Jt=Symbol.for(""),Yt=e=>{if(e?.r===Jt)return e?._$litStatic$},Zt=e=>({_$litStatic$:e,r:Jt}),Gt=new Map,Qt=(e=>(t,...i)=>{const s=i.length;let n,a;const o=[],r=[];let l,c=0,d=!1;for(;c<s;){for(l=t[c];c<s&&void 0!==(a=i[c],n=Yt(a));)l+=n+t[++c],d=!0;c!==s&&r.push(a),o.push(l),c++}if(c===s&&o.push(t[s]),d){const e=o.join("$$lit$$");void 0===(t=Gt.get(e))&&(o.raw=o,Gt.set(e,t=o)),i=r}return e(t,...i)})(e),Xt=["grid_options","style",t,"strict","rebuild_on","debug","name","inherit_variables"];function ei(e){return"number"==typeof e&&Number.isFinite(e)?String(e):"string"==typeof e&&e.trim()?e.trim():void 0}function ti(e){if("number"==typeof e)return e;if("string"!=typeof e||!e.trim())return;const t=e.trim(),i=Number(t);return Number.isFinite(i)&&/^\d+$/.test(t)?i:t}function ii(e){return e===s?"hide":e&&"object"==typeof e&&!Array.isArray(e)?"card":"show"}function si(e){const s={on_error_mode:ii(e[t]),debug:(n=e.debug,!0===n?"json":"yaml"===n||"console"===n||"report"===n?n:"off")};var n;const a=e.grid_options,o=ei(null==a?void 0:a.columns),r=ei(null==a?void 0:a.rows);void 0!==o&&(s.grid_columns=o),void 0!==r&&(s.grid_rows=r),"string"==typeof e.style&&e.style&&(s.style=e.style),!0===e.strict&&(s.strict=!0);const l=i(e.rebuild_on);return l.length&&(s.rebuild_on=l),"string"==typeof e.name&&e.name&&(s.name=e.name),!0===e.inherit_variables&&(s.inherit_variables=!0),s}function ni(e,n){var a;const o=Object.assign({},e),r=Object.assign({},null!==(a=e.grid_options)&&void 0!==a?a:{}),l=ti(n.grid_columns),c=ti(n.grid_rows);void 0===l?delete r.columns:r.columns=l,void 0===c?delete r.rows:r.rows=c,Object.keys(r).length?o.grid_options=r:delete o.grid_options;const d="string"==typeof n.style?n.style:"";switch(d.trim()?o.style=d:delete o.style,n.on_error_mode){case"hide":o[t]=s;break;case"card":"card"!==ii(e[t])&&delete o[t];break;default:delete o[t]}!0===n.strict?o.strict=!0:delete o.strict;const h=i(n.rebuild_on);switch(h.length?o.rebuild_on=h:delete o.rebuild_on,n.debug){case"json":o.debug=!0;break;case"yaml":case"console":case"report":o.debug=n.debug;break;default:delete o.debug}const p="string"==typeof n.name?n.name.trim():"";return p?o.name=p:delete o.name,!0===n.inherit_variables?o.inherit_variables=!0:delete o.inherit_variables,o}function ai(e){const i=e[t];return i&&"object"==typeof i&&!Array.isArray(i)?i:void 0}function oi(e,i){const s=Object.assign({},e);return i&&"object"==typeof i?s[t]=i:delete s[t],s}const ri=["1","2","3","4","5","6","7","8","9","10","11","12","full"],li=["1","2","3","4","5","6","7","8","auto"];const ci=["for_each","for_each_from","columns","min_column_width","gap","lazy","lazy_eager","empty"],di=["repeat","extras","fit","advanced",...Xt],hi={grid_options:["grid_columns","grid_rows"],on_error:["on_error_mode"]};function pi(e){const t=null==e?void 0:e.editor_hide;return(Array.isArray(t)?t:void 0===t?[]:[t]).filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>e.trim().toLowerCase())}const ui=(e,t)=>void 0!==(null==e?void 0:e[t]);function mi(e,t,i){const s=new Set(pi(e)),n=Xt.some(e=>ui(t,e));return{repeat:s.has("repeat")&&!ci.some(e=>ui(t,e)),extras:s.has("extras")&&!(null==i?void 0:i.length),fit:s.has("fit")&&!ui(t,"fit"),advanced:s.has("advanced")&&!n,advancedFields:[].concat(...Xt.filter(e=>s.has(e)&&!ui(t,e)).map(e=>{var t;return null!==(t=hi[e])&&void 0!==t?t:[e]}))}}function fi(e,t,i,s){if(void 0===e)return;const n=JSON.stringify(e);if("string"!=typeof n||!l.test(n))return e;let a,o=!1;try{a=c(d(t),i,{value:e},void 0,s,!0,()=>{o=!0})}catch(p){return}if(o)return;const r=null==a?void 0:a.value,h=JSON.stringify(r);return"string"==typeof h&&l.test(h)?void 0:r}function gi(e,t){return e===t||"object"==typeof e&&null!==e&&"object"==typeof t&&null!==t&&JSON.stringify(e)===JSON.stringify(t)}const vi="decluttering-card-plus-card-slot";class _i extends m{constructor(){super(...arguments),this.label="",this.emptyHint="",this._picking=!1,this._editing=!1}static get styles(){return f`
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
    `}render(){const t=function(e){var t,i,s,a;if(!e||"object"!=typeof e||Array.isArray(e))return;const o=e,r="string"==typeof o.type?o.type:"",l=r.startsWith("custom:")?r.slice(7):r?r[0].toUpperCase()+r.slice(1):"",c=e=>"string"==typeof e&&e.trim()?e.split("\n")[0].trim():void 0,d=Array.isArray(o.cards)?o.cards.length:void 0;return{type:l,text:null!==(a=null!==(s=null!==(i=null!==(t=c(o.content))&&void 0!==t?t:c(o.title))&&void 0!==i?i:c(o.name))&&void 0!==s?s:c(o.entity))&&void 0!==a?a:void 0!==d?n("editor.slot.cards",{count:d}):""}}(this.value);return e`
      ${this.label?e`<p class="label">${this.label}</p>`:e``}
      <div class="slot ${t?"filled":""}">
        ${t?e`
                <div class="row">
                  <div class="text summary">
                    <b>${t.type}</b>
                    ${t.text?e`<small>${t.text}</small>`:e``}
                  </div>
                  <ha-button @click=${()=>this._toggleEdit()}>
                    ${n(this._editing?"editor.slot.done":"editor.slot.edit",void 0,this.hass)}
                  </ha-button>
                  <ha-button @click=${()=>this._set(void 0)}>
                    ${n("editor.slot.remove",void 0,this.hass)}
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
                    ${n(this._picking?"editor.slot.cancel":"editor.slot.choose",void 0,this.hass)}
                  </ha-button>
                </div>
                ${this._picking?e`<hui-card-picker
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        @config-changed=${this._picked}
                      ></hui-card-picker>`:e``}
              `}
      </div>
    `}_togglePick(){this._picking=!this._picking}_toggleEdit(){this._editing=!this._editing}_picked(e){var t;e.stopPropagation(),this._picking=!1,this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_edited(e){var t;e.stopPropagation(),this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_set(e){this._editing=this._editing&&!!e,g(this,"value-changed",{value:e&&"object"==typeof e?e:void 0})}}function yi(e,t){const i=Math.max(0,t-e);return i<1?"<1 ms":`${Math.round(i)} ms`}h([p({attribute:!1})],_i.prototype,"hass",void 0),h([p({attribute:!1})],_i.prototype,"lovelace",void 0),h([p({attribute:!1})],_i.prototype,"value",void 0),h([p()],_i.prototype,"label",void 0),h([p()],_i.prototype,"emptyHint",void 0),h([u()],_i.prototype,"_picking",void 0),h([u()],_i.prototype,"_editing",void 0),"undefined"==typeof customElements||customElements.get(vi)||customElements.define(vi,_i);const bi="decluttering-card-plus-return";function $i(e){try{return"undefined"==typeof sessionStorage?void 0:sessionStorage}catch(t){return}}const wi="default";function xi(e){const t=null==e?void 0:e[y];return t&&"object"==typeof t&&!Array.isArray(t)?t:void 0}function ki(e,t,i){var s,n;const a={};for(const r of t){const e=null===(s=r.domain)||void 0===s?void 0:s.trim(),t=null===(n=r.template)||void 0===n?void 0:n.trim();e&&t&&e!==wi&&(a[e]=t)}(null==i?void 0:i.trim())&&(a[wi]=i.trim());const o=Object.assign({},e);return Object.keys(a).length?o[y]=a:delete o[y],o}function ji(e,t){const i=new Set(t.map(e=>e.domain));return e.filter(e=>!i.has(e))}const Ai=["entities","areas","devices","floors","labels","views"];function Si(e){if(!e||"object"!=typeof e||Array.isArray(e))return;const t=e;if(void 0!==t.template||void 0!==t.range||void 0!==t.with)return;if(void 0!==t.exclude&&"object"==typeof t.exclude&&!Array.isArray(t.exclude))return;const i=Ai.filter(e=>void 0!==t[e]);return i.length>1?void 0:1===i.length?i[0]:b(e)?"entities":void 0}function Oi(e){var t;return void 0!==e.for_each_from?null!==(t=Si(e.for_each_from))&&void 0!==t?t:"other":void 0!==e.for_each?"list":"none"}function Ci(e){if(null==e||!0===e)return;return(Array.isArray(e)?e:[e]).filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>e.trim())}function Ei(e){const t="number"==typeof e?e:"string"==typeof e&&e.trim()?Number(e):NaN;return Number.isFinite(t)?t:void 0}const Ti=["domain","area","floor","label","device_class","integration","exclude"];function Ni(e){if(e&&e.length)return 1===e.length?e[0]:e}function Pi(e,t){var i,s;const n=Object.assign({},null!=e?e:{});n[null!==(i=Si(e))&&void 0!==i?i:"entities"]=!t.patterns||!t.patterns.length||Ni(t.patterns.map(e=>e.trim()).filter(Boolean));for(const l of Ti){const e=Ni(null===(s=t[l])||void 0===s?void 0:s.filter(e=>e.trim()));void 0===e?delete n[l]:n[l]=e}const a=[t.sort,t.then].filter(e=>"string"==typeof e&&""!==e.trim());a.length?n.sort=1===a.length?a[0]:a:delete n.sort,!0===t.reverse?n.reverse=!0:delete n.reverse;const o=Ei(t.limit);void 0===o?delete n.limit:n.limit=o;const r=Ei(t.offset);return void 0===r||0===r?delete n.offset:n.offset=r,"string"==typeof t.group_by&&t.group_by?n.group_by=t.group_by:delete n.group_by,!0===t.entity_category?Array.isArray(n.entity_category)||"string"==typeof n.entity_category||(n.entity_category="all"):delete n.entity_category,n}function Li(e){return e.split(".")[0]}function Ii(e){var t;return[...new Set(Object.keys(null!==(t=null==e?void 0:e.states)&&void 0!==t?t:{}).map(Li))].sort()}function Fi(e){var t,i;const s=new Set;for(const n of Object.values(null!==(t=null==e?void 0:e.states)&&void 0!==t?t:{})){const e=null===(i=null==n?void 0:n.attributes)||void 0===i?void 0:i.device_class;"string"==typeof e&&e&&s.add(e)}return[...s].sort()}function Mi(e){var t;const i=new Set;for(const s of Object.values(null!==(t=null==e?void 0:e.entities)&&void 0!==t?t:{}))"string"==typeof(null==s?void 0:s.platform)&&s.platform&&i.add(s.platform);return[...i].sort()}const Vi=["name","-name","entity","area","floor","domain","entity_count","none"],Hi=["","area","floor","domain","label"];function Di(e,t){return{select:{mode:"dropdown",multiple:!0,custom_value:!0,options:[...e,...(null!=t?t:[]).filter(t=>!e.includes(t))].map(e=>({value:e,label:e}))}}}function qi(e,t){const i=["none","list",...Ai];return"other"===t&&i.push("other"),i.map(t=>({value:t,label:n(`editor.repeat.mode_${t}`,void 0,e)}))}const Ri="variable:";function zi(e,t,i){var s;const a=e&&"object"==typeof e?e:{},o=null!==(s=["areas","devices","floors","labels","views","entities"].find(e=>void 0!==a[e]))&&void 0!==s?s:b(e)?"entities":"items";return n(`editor.matches_${o}_${1===t?"one":"many"}`,void 0,i)}let Ui,Wi;function Bi(e,t){const i=e.indexOf(t);return-1===i?[e,""]:[e.slice(0,i),e.slice(i+t.length)]}const Ki=new Set(["true","yes","on","1"]),Ji=/:host|\.decluttering-container/;class Yi extends m{constructor(){super(...arguments),this._shownAs=new Map,this._loadingTemplates=!1,this._ejectPending=!1,this._sectionsPending=!1,this._previewMode="yaml",this._copied=!1,this._markedLines=[],this._cannotOpen=!1,this._matchesOpen=!1,this._openItems=new Set,this._renderedTemplates={},this._renderingTemplates=new Set}static get styles(){return f`
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
    `}set lovelace(e){this._lovelace=e,this._templates=void 0,this._schema=void 0}_editingPlace(){const e=$(this),t=e?w(e):void 0;return null!=t?t:{view:x(this._lovelace)}}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}async connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=k(()=>this.requestUpdate())),await j()}setConfig(e){this._openedWith||(this._openedWith=e,this._resume=function(e,t,i=Date.now()){var s;const n=$i();if(!n)return;let a;try{const e=n.getItem(bi);a=e?JSON.parse(e):void 0}catch(o){a=void 0}if(a)if(i-a.at>18e5)n.removeItem(bi);else if(JSON.stringify(null!==(s=a.openedWith)&&void 0!==s?s:null)===JSON.stringify(null!=e?e:null))return n.removeItem(bi),a}(e)),this._config=e}willUpdate(){var e;if(this.hass&&this._config&&(this._lovelace||(this._lovelace=null!==(e=A())&&void 0!==e?e:void 0),this._lovelace)){if(!this._templates){const e=this._editingPlace();this._templates=S(this._lovelace,e.view,void 0,e.section),this._loadBorrowedTemplates()}this._schema||(this._schema=[{name:"template",label:n("editor.template_label",void 0,this.hass),selector:{select:{mode:"dropdown",custom_value:!0,options:O(this._templates,this.hass)}}},{name:"variables",label:n("editor.variables_label",void 0,this.hass),helper:n("editor.variables_helper",void 0,this.hass),selector:{object:{}}}])}}render(){if(!(this.hass&&this._config&&this._templates&&this._schema))return e``;const t=this._templates[this._config.template],i=C(t),s=this._hiddenNames(t,i),a=i.filter(e=>!s.has(e.name)),o=E(this._config.variables),r=T(this._config),l=!!t&&"card"===N(t)||!!r||void 0!==this._config.for_each||void 0!==this._config.for_each_from,c=this._formData(i),d=mi(t,this._config,c.extras),h={};t||this._loadingTemplates||r&&!this._config.template||(h.template=n("editor.no_such_template",void 0,this.hass)),o||(h.variables=n("error.variables_shape",void 0,this.hass));const p=_(t);return e`
      ${(null==t?void 0:t.description)?e`<p class="description">${t.description}</p>`:e``}
      ${r?this._renderByDomain(r):e``}
      ${void 0===p?e``:e`<ha-alert alert-type="warning">
              ${p?n("editor.template_deprecated_because",{message:p},this.hass):n("editor.template_deprecated",void 0,this.hass)}
            </ha-alert>`}
      ${this._renderResume()} ${this._renderResult(t)} ${this._renderSource(t)}
      ${this._renderStartFromExample(t)} ${this._renderDiagnostics(t,o)}
      <ha-form
        .hass=${this.hass}
        .data=${c}
        .schema=${this._formSchema(a,d,t)}
        .error=${h}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._renderCardVariables(a)} ${this._renderRepeat(l&&!d.repeat,t)}
      ${this._renderLayout(c,l&&!d.repeat,d)} ${this._renderEmptySlot(l)}
      ${this._renderAdvanced(d)} ${this._renderSectionPerCopy()}
      <decluttering-card-plus-health .hass=${this.hass} .lovelace=${this._lovelace}></decluttering-card-plus-health>
    `}_renderAdvanced(t){if(!this._config||t.advanced)return e``;const i=function(e){const t=si(e);let i=0;return void 0===t.grid_columns&&void 0===t.grid_rows||(i+=1),void 0!==t.style&&(i+=1),"show"!==t.on_error_mode&&(i+=1),t.strict&&(i+=1),t.rebuild_on&&(i+=1),"off"!==t.debug&&(i+=1),void 0!==t.name&&(i+=1),t.inherit_variables&&(i+=1),i}(this._config),s=si(this._config),a=this._onErrorMode&&"card"!==s.on_error_mode?Object.assign(Object.assign({},s),{on_error_mode:this._onErrorMode}):s;"card"===s.on_error_mode&&this._onErrorMode&&(this._onErrorMode=void 0);const o=ai(this._config),r=Zt(vi);return e`
      <ha-expansion-panel outlined class="advanced">
        <span slot="header">
          ${n("editor.advanced.header",void 0,this.hass)}
          <span class="count">
            ${0===i?"":1===i?n("editor.advanced.count_one",void 0,this.hass):n("editor.advanced.count_many",{count:i},this.hass)}
          </span>
        </span>
        <div class="advanced-body">
          <ha-form
            .hass=${this.hass}
            .data=${a}
            .schema=${function(e,t){return t.length?e.filter(e=>!t.includes(null==e?void 0:e.name)):e}(function(e){const t=t=>n(t,void 0,e),i=(e,i)=>e.map(e=>({value:e,label:/^\d+$/.test(e)?e:t(`${i}${e}`)}));return[{name:"grid_columns",label:t("editor.advanced.grid_columns_label"),helper:t("editor.advanced.grid_helper"),selector:{select:{mode:"dropdown",custom_value:!0,options:i(ri,"editor.advanced.grid_")}}},{name:"grid_rows",label:t("editor.advanced.grid_rows_label"),selector:{select:{mode:"dropdown",custom_value:!0,options:i(li,"editor.advanced.grid_")}}},{name:"style",label:t("editor.advanced.style_label"),helper:t("editor.advanced.style_helper"),selector:{text:{multiline:!0}}},{name:"on_error_mode",label:t("editor.advanced.on_error_label"),helper:t("editor.advanced.on_error_helper"),selector:{select:{mode:"dropdown",options:[{value:"show",label:t("editor.advanced.on_error_show")},{value:"hide",label:t("editor.advanced.on_error_hide")},{value:"card",label:t("editor.advanced.on_error_card")}]}}},{name:"strict",label:t("editor.advanced.strict_label"),helper:t("editor.advanced.strict_helper"),selector:{boolean:{}}},{name:"rebuild_on",label:t("editor.advanced.rebuild_on_label"),helper:t("editor.advanced.rebuild_on_helper"),selector:{entity:{multiple:!0}}},{name:"debug",label:t("editor.advanced.debug_label"),helper:t("editor.advanced.debug_helper"),selector:{select:{mode:"dropdown",options:[{value:"off",label:t("editor.advanced.debug_off")},{value:"json",label:t("editor.advanced.debug_json")},{value:"yaml",label:t("editor.advanced.debug_yaml")},{value:"console",label:t("editor.advanced.debug_console")},{value:"report",label:t("editor.advanced.debug_report")}]}}},{name:"name",label:t("editor.advanced.name_label"),helper:t("editor.advanced.name_helper"),selector:{text:{}}},{name:"inherit_variables",label:t("editor.advanced.inherit_label"),helper:t("editor.advanced.inherit_helper"),selector:{boolean:{}}}]}(this.hass),t.advancedFields)}
            .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
            .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
            @value-changed=${this._advancedChanged}
          ></ha-form>
          ${"card"===a.on_error_mode?Qt`<${r}
                  .hass=${this.hass}
                  .lovelace=${this._lovelace}
                  .value=${o}
                  .label=${n("editor.advanced.fallback_label",void 0,this.hass)}
                  .emptyHint=${n("editor.advanced.fallback_hint",void 0,this.hass)}
                  @value-changed=${this._fallbackChanged}
                ></${r}>`:e``}
        </div>
      </ha-expansion-panel>
    `}_advancedChanged(e){if(e.stopPropagation(),!this._config)return;const t=e.detail.value;this._onErrorMode="card"!==t.on_error_mode||ai(this._config)?void 0:"card",g(this,"config-changed",{config:ni(this._config,t)})}_fallbackChanged(e){e.stopPropagation(),this._config&&(e.detail.value&&(this._onErrorMode=void 0),g(this,"config-changed",{config:oi(this._config,e.detail.value)}))}_renderEmptySlot(t){if(!this._config||!t)return e``;if(!(void 0!==this._config.for_each||void 0!==this._config.for_each_from||void 0!==this._config.empty))return e``;const i=Zt(vi),s=this._config.empty;return Qt`<${i}
      .hass=${this.hass}
      .lovelace=${this._lovelace}
      .value=${s&&"object"==typeof s?s:void 0}
      .label=${n("editor.empty_label",void 0,this.hass)}
      .emptyHint=${n("editor.empty_slot_hint",void 0,this.hass)}
      @value-changed=${this._emptyChanged}
    ></${i}>`}_emptyChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);P(t,"empty",e.detail.value),g(this,"config-changed",{config:t})}_renderStartFromExample(t){const i=L(t);return i.length&&this._config&&!I(this._config.variables).length?e`
      <div class="examples">
        <p class="hint">${n("editor.start_from_example_hint",void 0,this.hass)}</p>
        ${i.map((t,i)=>e`
            <ha-button @click=${()=>this._startFromExample(t)}>
              ${n("editor.start_from_example",{number:i+1},this.hass)}
            </ha-button>
          `)}
      </div>
    `:e``}_startFromExample(e){e.length&&g(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{variables:e})})}_renderByDomain(t){var i,s;if(!this._config)return e``;if(!function(e){const t=xi(e);return!t||Object.values(t).every(e=>"string"==typeof e)}(this._config))return e`<ha-alert alert-type="info">
        ${n("editor.by_domain_hint",{templates:Object.entries(t).map(([e,t])=>`${e}: ${t}`).join(", ")},this.hass)}
      </ha-alert>`;const{rows:a,fallback:o}=function(e){var t;const i=null!==(t=xi(e))&&void 0!==t?t:{};return{rows:Object.entries(i).filter(([e,t])=>e!==wi&&"string"==typeof t).map(([e,t])=>({domain:e,template:t})),fallback:"string"==typeof i[wi]?i[wi]:void 0}}(this._config),r=null!==(i=this._byDomainDraft)&&void 0!==i?i:a,l=function(e,t){return Object.keys(e).filter(t=>{return!!(i=e[t])&&(void 0!==i.card||void 0!==i.group);var i}).sort().map(i=>({value:i,label:void 0!==_(e[i])?i+n("editor.deprecated_suffix",void 0,t):i}))}(null!==(s=this._templates)&&void 0!==s?s:{},this.hass),c=Ii(this.hass),d=(e,t)=>{const i=e.every(e=>{var t,i;return(null===(t=e.domain)||void 0===t?void 0:t.trim())&&(null===(i=e.template)||void 0===i?void 0:i.trim())});this._byDomainDraft=i?void 0:e,g(this,"config-changed",{config:ki(this._config,e,t)})};return e`
      <div class="by-domain">
        <h3>${n("editor.by_domain.header",void 0,this.hass)}</h3>
        <p class="hint">${n("editor.by_domain.hint",void 0,this.hass)}</p>
        ${r.map((t,i)=>{return e`
            <div class="bd-row">
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",custom_value:!0,options:(s=t.domain,[...new Set([s,...c])].filter(Boolean).map(e=>({value:e,label:e})))}}}
                .value=${t.domain}
                .label=${n("editor.by_domain.domain",void 0,this.hass)}
                @value-changed=${e=>{e.stopPropagation(),d(r.map((t,s)=>{var n;return s===i?Object.assign(Object.assign({},t),{domain:String(null!==(n=e.detail.value)&&void 0!==n?n:"")}):t}),null!=o?o:"")}}
              ></ha-selector>
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",options:l}}}
                .value=${t.template}
                .label=${n("editor.by_domain.template",void 0,this.hass)}
                @value-changed=${e=>{e.stopPropagation(),d(r.map((t,s)=>{var n;return s===i?Object.assign(Object.assign({},t),{template:String(null!==(n=e.detail.value)&&void 0!==n?n:"")}):t}),null!=o?o:"")}}
              ></ha-selector>
              <ha-icon-button
                .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                .label=${n("editor.by_domain.remove",{domain:t.domain},this.hass)}
                @click=${()=>d(r.filter((e,t)=>t!==i),null!=o?o:"")}
              ></ha-icon-button>
            </div>
          `;var s})}
        <div class="bd-row">
          <span class="bd-default">${n("editor.by_domain.anything_else",void 0,this.hass)}</span>
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:l}}}
            .value=${null!=o?o:""}
            .label=${n("editor.by_domain.template",void 0,this.hass)}
            @value-changed=${e=>{var t;e.stopPropagation(),d(r,String(null!==(t=e.detail.value)&&void 0!==t?t:""))}}
          ></ha-selector>
          <span class="bd-spacer"></span>
        </div>
        <ha-button
          @click=${()=>{var e;return d([...r,{domain:null!==(e=ji(c,r)[0])&&void 0!==e?e:"",template:""}],null!=o?o:"")}}
        >
          ${n("editor.by_domain.add",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderCardVariables(t){var i;const s=t.filter(e=>F(e));if(!s.length)return e``;const a=o(null===(i=this._config)||void 0===i?void 0:i.variables);return e`${s.map(t=>{var i;const s=a[t.name],o=!!s&&"object"==typeof s;return e`
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
                    ${n("editor.card_variable_clear",void 0,this.hass)}
                  </ha-button>
                `:e`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    @config-changed=${e=>this._cardVariableChanged(t.name,e)}
                  ></hui-card-picker>
                `}
        </div>
      `})}`}_registryItemsForPreview(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.for_each_from;if(!this.hass||!b(t))return;const i=M(t);if(void 0===i||Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))try{const e=V(this.hass,t,Object.assign(Object.assign({},H(this._lovelace)),{rendered:this._renderedTemplates}));return e.length?e:void 0}catch(s){return}}_cardVariableChanged(e,t){var i,s;null==t||t.stopPropagation();const n=null===(i=null==t?void 0:t.detail)||void 0===i?void 0:i.config,a=I(null===(s=this._config)||void 0===s?void 0:s.variables).filter(t=>D(t)!==e);n&&"object"==typeof n&&a.push({[e]:n});const o=Object.assign({},this._config);a.length?o.variables=a:delete o.variables,g(this,"config-changed",{config:o})}_renderResult(t){var s,a,o;if(!this._config)return e``;const r=null!==(s=q(this._config.for_each))&&void 0!==s?s:this._registryItemsForPreview();let l=(null==r?void 0:r.length)?R(r[0],this._config.variables,0,r.length):this._config.variables,d=t,h=this._config.template;if(T(this._config))try{const e=null!==(a=this._templates)&&void 0!==a?a:{};let t;({template:d,name:h,entity:t}=z(this._config,l,t=>e[t],this.hass,Object.keys(e))),l=U(l,t)}catch(S){return e``}if(!d)return e``;const p=N(d);if(!p)return e``;const u=W(d);let m;const f=performance.now();try{const e=B(this.hass,i(this._config.rebuild_on)),t=null!==(o=this._lovelace)&&void 0!==o?o:A();m=K(c(l,d,u,h,e,!0,void 0,0,void 0,void 0,!1,{itemTemplates:J(t),context:H(t)}),this._config,p)}catch(O){return e`<ha-alert alert-type="warning">
        ${n("editor.result_error",{error:String(O)},this.hass)}
      </ha-alert>`}const g=performance.now(),v=(null==r?void 0:r.length)?n("editor.result_copies",{total:r.length},this.hass):"",[_,y]=Bi(n("editor.result_hint",{kind:p},this.hass),"[[name]]"),$=Y(m);$!==this._lastYaml&&(this._markedLines=function(e,t){const i=""===t?[]:t.replace(/\n$/,"").split("\n");if(void 0===e)return i.map(e=>({text:e,changed:!1}));const s=new Set(e.replace(/\n$/,"").split("\n"));return i.map(e=>({text:e,changed:!s.has(e)}))}(this._lastYaml,$),this._lastYaml=$);const w=void 0!==this._editingPlace().section?"grid":void 0,x=function(e){return"card"===e?["rendered","yaml"]:["yaml"]}(p),k=x.includes(this._previewMode)?this._previewMode:"yaml",j=!(null==r?void 0:r.length)&&!b(this._config.for_each_from)&&m&&"object"==typeof m;return e`
      <div class="preview">
        <div class="preview-head">
          <span class="preview-title">${n("editor.preview.header",void 0,this.hass)}${v}</span>
          ${x.length>1?e`<div class="segmented" role="group">
                  ${x.map(t=>e`<button
                        type="button"
                        class=${t===k?"on":""}
                        aria-pressed=${t===k?"true":"false"}
                        @click=${()=>{this._previewMode=t}}
                      >
                        ${n(`editor.preview.${t}`,void 0,this.hass)}
                      </button>`)}
                </div>`:e``}
        </div>
        ${"rendered"===k?e`<div class="rendered">
                <hui-card .hass=${this.hass} .config=${m} .preview=${!0} .layout=${w}></hui-card>
              </div>`:e`<pre class="yaml">
${this._markedLines.map(t=>e`<span class="l ${t.changed?"changed":""}">${t.text}</span>`)}</pre>`}
        <p class="hint">
          ${n("editor.preview.built_in",{time:yi(f,g),template:null!=h?h:""},this.hass)}
          ${"yaml"===k?n("editor.preview.changed_hint",void 0,this.hass):""}
        </p>
        <p class="hint">${_}<code>[[name]]</code>${y}</p>
        <div class="preview-actions">
          ${"yaml"===k?e`<ha-button @click=${()=>this._copyYaml($)}>
                  ${n(this._copied?"editor.preview.copied":"editor.preview.copy",void 0,this.hass)}
                </ha-button>`:e``}
          ${j?e`
                  <ha-button @click=${()=>this._eject(m)}>
                    ${n(this._ejectPending?"editor.eject_confirm":"editor.eject",void 0,this.hass)}
                  </ha-button>
                `:e``}
        </div>
      </div>
    `}_copyYaml(e){Z(e).then(e=>{this._copied=e,e&&setTimeout(()=>this._copied=!1,1500)})}_renderResume(){const t=this._resume;return t?e`<ha-alert alert-type="info">
      ${n("editor.link.resume",{template:t.template},this.hass)}
      <div class="actions">
        <ha-button
          @click=${()=>{this._resume=void 0,g(this,"config-changed",{config:t.config})}}
        >
          ${n("editor.link.resume_button",void 0,this.hass)}
        </ha-button>
        <ha-button
          @click=${()=>{this._resume=void 0}}
        >
          ${n("editor.link.discard_button",void 0,this.hass)}
        </ha-button>
      </div>
    </ha-alert>`:e``}_openTemplate(e){var t,i,s,n;const a=G(),o=function(e,t){var i,s;const n=null==e?void 0:e.views;if(!Array.isArray(n))return;const a=e=>!!e&&v(e.type)&&e.template===t;for(let o=0;o<n.length;o+=1){const e=null!==(i=n[o])&&void 0!==i?i:{},t=Array.isArray(e.cards)?e.cards:[];for(let i=0;i<t.length;i+=1)if(a(t[i]))return[o,i];const r=Array.isArray(e.sections)?e.sections:[];for(let i=0;i<r.length;i+=1){const e=Array.isArray(null===(s=r[i])||void 0===s?void 0:s.cards)?r[i].cards:[];for(let t=0;t<e.length;t+=1)if(a(e[t]))return[o,i,t]}}}(null!==(t=null==a?void 0:a.config)&&void 0!==t?t:this._lovelace,e);if(!a||!o)return void(this._cannotOpen=!0);this._config&&function(e,i,s=Date.now()){const n=$i();if(n)try{n.setItem(bi,JSON.stringify(Object.assign(Object.assign({},e),{at:s})))}catch(t){}}({config:this._config,openedWith:this._openedWith,template:e});const r=function(e,t){var i,s,n,a,o;const r=null===(i=null==e?void 0:e.views)||void 0===i?void 0:i[t[0]];if(!r)return;const l=3===t.length?null===(a=null===(n=null===(s=r.sections)||void 0===s?void 0:s[t[1]])||void 0===n?void 0:n.cards)||void 0===a?void 0:a[t[2]]:null===(o=r.cards)||void 0===o?void 0:o[t[1]];return l&&"object"==typeof l?l:void 0}(a.config,o),l=null!==(i=document.querySelector("home-assistant"))&&void 0!==i?i:document.body,c=()=>{g(l,"show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>Promise.resolve(),dialogParams:{lovelaceConfig:a.config,cardConfig:r,saveCardConfig:e=>a.saveConfig(r?ie(a.config,r,e):a.config),saveConfig:e=>a.saveConfig(e),path:o}})},d=$(this);if(!d)return void c();this._config&&(null===(s=d._discardDirtyStateChanges)||void 0===s||s.call(d),"_dirty"in d&&(d._dirty=!1));let h=!1;const p=()=>{h||(h=!0,setTimeout(c,0))};d.addEventListener("dialog-closed",p,{once:!0});!1!==(null===(n=d.closeDialog)||void 0===n?void 0:n.call(d))&&setTimeout(p,400)}_renderSectionPerCopy(){var t;const i=null===(t=G())||void 0===t?void 0:t.config;return this._config&&i&&Q(i,this._config)?e`
      <div class="section-per-copy">
        <p class="hint">${n("editor.section_per_copy_hint",void 0,this.hass)}</p>
        ${this._sectionsError?e`<ha-alert alert-type="error">${this._sectionsError}</ha-alert>`:e``}
        <ha-button @click=${this._sectionPerCopy}>
          ${n(this._sectionsPending?"editor.section_per_copy_confirm":"editor.section_per_copy",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}async _sectionPerCopy(){var e,t;if(!this._sectionsPending)return void(this._sectionsPending=!0);this._sectionsPending=!1;const i=G(),s=this._config;if(!i||!s)return;try{await X(this,this.hass,"section_per_copy",[{urlPath:te(),build:e=>ee(e,s)}])}catch(o){return void(this._sectionsError=n("tools.save_failed",{message:null!==(e=null==o?void 0:o.message)&&void 0!==e?e:o},this.hass))}let a=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;for(;a&&"hui-dialog-edit-card"!==a.localName;)a=a.parentNode instanceof ShadowRoot?a.parentNode.host:a.parentNode;null===(t=null==a?void 0:a.closeDialog)||void 0===t||t.call(a)}_eject(e){this._ejectPending?(this._ejectPending=!1,this._holdEjectUndo(e),g(this,"config-changed",{config:e})):this._ejectPending=!0}_holdEjectUndo(e){const t=G();if(!t||!this._openedWith)return;const i=ie(t.config,this._openedWith,e);i!==t.config&&se({operation:"eject",at:Date.now(),dashboards:[{urlPath:te(),before:t.config,after:i}]})}_renderSource(t){var i;const s=null===(i=this._config)||void 0===i?void 0:i.template;if(!s||!t||this._loadingTemplates)return e``;const a=ne(this._lovelace,s);if(!a){const t=ae(s);return e`<p class="hint">
        ${n("editor.source_borrowed",void 0,this.hass)}
        ${t?e`<a href=${o=t,`/${o.replace(/^\/+/,"")}`} target="_blank" rel="noreferrer"
                >${n("editor.link.open_dashboard",void 0,this.hass)}</a
              >`:e``}
      </p>`}var o;if(a.declared||!a.view)return e`<p class="hint">
        ${n("editor.source_declared",void 0,this.hass)}
        ${n("editor.link.raw_editor",void 0,this.hass)}
      </p>`;const{view:r}=a,l=document.location.pathname.split("/").slice(0,2).join("/"),[c,d]=Bi(n("editor.source_view",{view:""},this.hass),"");return e`<p class="hint">
      ${c}<a href=${`${l}/${r.path||r.index}`} target="_blank" rel="noreferrer"
        >${r.title||r.path||n("editor.untitled_view",void 0,this.hass)}</a
      >${d}
      <a
        href="#"
        class="edit-template"
        @click=${e=>{e.preventDefault(),this._openTemplate(s)}}
        >${n("editor.link.edit_template",void 0,this.hass)}</a
      >
      ${this._cannotOpen?e`<br />${n("editor.link.cannot_open",void 0,this.hass)}`:e``}
    </p>`}_filledSource(e){var t,i;return oe(null===(t=this._config)||void 0===t?void 0:t.for_each_from,null===(i=this._config)||void 0===i?void 0:i.variables,e,this.hass)}_renderedTemplateNames(e){const t=this._filledSource(e),i=M(t);if(!this.hass||void 0===i)return[];if(!Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))return[];const s=new Set,n=V(this.hass,t,{rendered:this._renderedTemplates});for(const a of n)for(const e of Object.keys(a))s.add(e);return[...s]}_renderEditorTemplate(e){this.hass&&!this._renderingTemplates.has(e)&&(this._renderingTemplates.add(e),re(this.hass,e).then(t=>{this._renderingTemplates.delete(e),this._renderedTemplates=Object.assign(Object.assign({},this._renderedTemplates),{[e]:t})}))}_renderMatches(t){var i,s;if(!this.hass||!b(null===(i=this._config)||void 0===i?void 0:i.for_each_from))return e``;const a=this._filledSource(t);le(a)&&!ce()&&de(this.hass).then(()=>this.requestUpdate());const o=M(a);if(void 0!==o){const t=Object.prototype.hasOwnProperty.call(this._renderedTemplates,o)?this._renderedTemplates[o]:void 0;if(!t)return this._renderEditorTemplate(o),e`<p class="hint">${n("editor.matches_template_pending",void 0,this.hass)}</p>`;const i=he(t);if(!("list"in i)){const t="error"===i.problem?"editor.matches_template_failed":"editor.matches_template_not_list";return e`<ha-alert alert-type="warning"> ${n(t,{detail:i.detail},this.hass)} </ha-alert>`}}let r=[];try{r=V(this.hass,a,Object.assign(Object.assign({},H(this._lovelace)),{rendered:this._renderedTemplates}))}catch(c){return e``}if(!r.length)return e`<ha-alert alert-type="warning">
        ${n("editor.matches_none",{but:(null===(s=this._config)||void 0===s?void 0:s.empty)?n("editor.matches_none_but_empty",void 0,this.hass):""},this.hass)}
      </ha-alert>`;const l=r.slice(0,12);return e`
      <div class="matches-line">
        <ha-svg-icon .path=${"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}></ha-svg-icon>
        <span>
          ${1===r.length?n("editor.matches_header_one",{what:zi(a,1,this.hass)},this.hass):n("editor.matches_header_many",{count:r.length,what:zi(a,r.length,this.hass)},this.hass)}
        </span>
        <ha-button
          @click=${()=>{this._matchesOpen=!this._matchesOpen}}
        >
          ${n(this._matchesOpen?"editor.repeat.matches_hide":"editor.repeat.matches_show",void 0,this.hass)}
        </ha-button>
      </div>
      ${this._matchesOpen?e`<div class="matches">
              <ul>
                ${l.map((t,i)=>e`<li>${pe(t,i)}</li>`)}
              </ul>
              ${r.length>l.length?e`<p class="hint">
                      ${n("editor.matches_more",{count:r.length-l.length},this.hass)}
                    </p>`:e``}
              <p class="hint">
                ${n(void 0===o?"editor.matches_hint":"editor.matches_template_hint",void 0,this.hass)}
              </p>
            </div>`:e``}
    `}_suppliedNames(e){var t,i,s;return[...me(null===(t=this._config)||void 0===t?void 0:t.for_each),...fe(null===(i=this._config)||void 0===i?void 0:i.for_each_from),...b(null===(s=this._config)||void 0===s?void 0:s.for_each_from)?ue:[],...e?this._renderedTemplateNames(e):[]]}_renderRepeat(t,i){if(!this._config||!t)return e``;const s=Oi(this._config),a=[{name:"mode",label:n("editor.repeat.mode_label",void 0,this.hass),helper:n("editor.repeat.mode_helper",void 0,this.hass),selector:{select:{mode:"dropdown",options:qi(this.hass,s)}}}];return e`
      <div class="repeat">
        <h3>${n("editor.repeat.header",void 0,this.hass)}</h3>
        <ha-form
          .hass=${this.hass}
          .data=${{mode:s}}
          .schema=${a}
          .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
          .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
          @value-changed=${this._repeatModeChanged}
        ></ha-form>
        ${"list"===s?this._renderRepeatList():"other"===s?this._renderOtherSource(i):"none"===s?e``:this._renderRepeatBuilder(i)}
      </div>
    `}_renderLayout(t,i,s){const a=[...i?(null!=Ui||(Ui=[{name:"gap",label:n("editor.gap_label"),helper:n("editor.gap_helper"),selector:{number:{min:0,max:64,mode:"box"}}},{name:"columns",label:n("editor.columns_label"),helper:n("editor.columns_helper"),selector:{number:{min:1,max:6,mode:"box"}}},{name:"min_column_width",label:n("editor.min_column_width_label"),helper:n("editor.min_column_width_helper"),selector:{number:{min:50,max:1e3,step:10,mode:"box"}}},{name:"lazy",label:n("editor.lazy_label"),helper:n("editor.lazy_helper"),selector:{boolean:{}}},{name:"lazy_eager",label:n("editor.lazy_eager_label"),helper:n("editor.lazy_eager_helper"),selector:{number:{min:0,max:100,mode:"box"}}}]),Ui):[],...s.fit?[]:(null!=Wi||(Wi=[{name:"fit",label:n("editor.fit_label"),helper:n("editor.fit_helper"),selector:{select:{mode:"dropdown",options:[{value:"box",label:n("editor.fit_box")},{value:"contents",label:n("editor.fit_contents")}]}}}]),Wi)];return a.length?e`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${a}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:e``}_repeatModeChanged(e){var t;if(e.stopPropagation(),!this._config)return;const i=null===(t=e.detail.value)||void 0===t?void 0:t.mode;if(!i)return;const s=function(e,t){if(Oi(e)===t||"other"===t)return e;const i=Object.assign({},e);if(delete i.for_each,delete i.for_each_from,"list"===t)i.for_each=[];else if("none"!==t){const s=Si(e.for_each_from)?Object.assign({},e.for_each_from):{};for(const e of Ai)delete s[e];i.for_each_from=Object.assign({[t]:!0},s)}return i}(this._config,i);s!==this._config&&g(this,"config-changed",{config:s})}_renderRepeatBuilder(t){var i;const s=null===(i=this._config)||void 0===i?void 0:i.for_each_from,a=Si(s);if(!a)return e``;const o=function(e){var t,i,s;const n=null!=e?e:{},a={patterns:null!==(i=Ci(n[null!==(t=Si(e))&&void 0!==t?t:"entities"]))&&void 0!==i?i:[],reverse:!0===n.reverse,entity_category:!1};for(const d of Ti){const e=Ci(n[d]);e&&e.length&&(a[d]=e)}const o=null!==(s=Ci(n.sort))&&void 0!==s?s:[];o[0]&&(a.sort=o[0]),o[1]&&(a.then=o[1]);const r=Ei(n.limit);void 0!==r&&(a.limit=r);const l=Ei(n.offset);void 0!==l&&(a.offset=l),"string"==typeof n.group_by&&n.group_by&&(a.group_by=n.group_by);const c=n.entity_category;return a.entity_category=!0===c||"all"===c||"string"==typeof c&&!!c||Array.isArray(c)&&c.length>0,a}(s);return e`
      <ha-form
        .hass=${this.hass}
        .data=${o}
        .schema=${function(e,t,i){const s=t=>n(t,void 0,e),a=e=>({select:{mode:"dropdown",custom_value:!0,options:[...Vi,...e&&!Vi.includes(e)?[e]:[]].map(e=>({value:e,label:Vi.includes(e)?s(`editor.repeat.sort_${e.replace("-","desc_")}`):e}))}}),o="entities"===t,r="areas"===t,l="devices"===t;return[{name:"patterns",label:s(`editor.repeat.patterns_${t}`),helper:s("editor.repeat.patterns_helper"),selector:Di([],null==i?void 0:i.patterns)},o&&{name:"domain",label:s("editor.repeat.domain_label"),selector:Di(Ii(e),null==i?void 0:i.domain)},(o||l)&&{name:"area",label:s("editor.repeat.area_label"),selector:{area:{multiple:!0}}},(o||r||l)&&{name:"floor",label:s("editor.repeat.floor_label"),selector:{floor:{multiple:!0}}},(o||r||l)&&{name:"label",label:s("editor.repeat.label_label"),selector:{label:{multiple:!0}}},o&&{name:"device_class",label:s("editor.repeat.device_class_label"),selector:Di(Fi(e),null==i?void 0:i.device_class)},o&&{name:"integration",label:s("editor.repeat.integration_label"),selector:Di(Mi(e),null==i?void 0:i.integration)},{name:"exclude",label:s("editor.repeat.exclude_label"),helper:s("editor.repeat.exclude_helper"),selector:o?{entity:{multiple:!0}}:Di([],null==i?void 0:i.exclude)},{name:"sort",label:s("editor.repeat.sort_label"),selector:a(null==i?void 0:i.sort)},{name:"then",label:s("editor.repeat.then_label"),selector:a(null==i?void 0:i.then)},{name:"reverse",label:s("editor.repeat.reverse_label"),selector:{boolean:{}}},{name:"limit",label:s("editor.repeat.limit_label"),selector:{number:{min:0,max:500,mode:"box"}}},{name:"offset",label:s("editor.repeat.offset_label"),helper:s("editor.repeat.offset_helper"),selector:{number:{min:0,max:500,mode:"box"}}},o&&{name:"group_by",label:s("editor.repeat.group_by_label"),helper:s("editor.repeat.group_by_helper"),selector:{select:{mode:"dropdown",options:Hi.map(e=>({value:e,label:s(`editor.repeat.group_${e||"none"}`)}))}}},o&&{name:"entity_category",label:s("editor.repeat.entity_category_label"),helper:s("editor.repeat.entity_category_helper"),selector:{boolean:{}}}].filter(e=>!1!==e)}(this.hass,a,o)}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._repeatBuilderChanged}
      ></ha-form>
      ${this._renderMatches(t)}
    `}_repeatBuilderChanged(e){if(e.stopPropagation(),!this._config||void 0===Si(this._config.for_each_from))return;const t=Object.assign(Object.assign({},this._config),{for_each_from:Pi(this._config.for_each_from,e.detail.value)});g(this,"config-changed",{config:t})}_renderOtherSource(t){var i;return e`
      <p class="hint">${n("editor.repeat.other_hint",void 0,this.hass)}</p>
      <ha-yaml-editor
        .hass=${this.hass}
        .defaultValue=${null===(i=this._config)||void 0===i?void 0:i.for_each_from}
        @value-changed=${this._otherSourceChanged}
      ></ha-yaml-editor>
      ${this._renderMatches(t)}
    `}_otherSourceChanged(e){var t;if(e.stopPropagation(),!this._config||!1===(null===(t=e.detail)||void 0===t?void 0:t.isValid))return;const i=Object.assign({},this._config);P(i,"for_each_from",e.detail.value),g(this,"config-changed",{config:i})}_listItems(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.for_each;return Array.isArray(t)?t:t&&"object"==typeof t?[t]:[]}_setList(e){this._config&&g(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{for_each:e})})}_renderRepeatList(){const t=this._listItems(),i=(e,t)=>function(e){var t,i;const s=Array.isArray(e)?Object.assign({},...e.filter(e=>e&&"object"==typeof e)):e&&"object"==typeof e?e:{},n=e=>"string"==typeof e&&e.trim()?e.trim():void 0,a=Object.values(s).find(e=>"string"==typeof e&&e.trim());return null!==(i=null!==(t=n(s.name))&&void 0!==t?t:n(s.entity))&&void 0!==i?i:"string"==typeof a?a.trim():""}(e)||n("editor.repeat.list_item",{number:t+1},this.hass),s=(e,i)=>{e.preventDefault();const s=this._dragging;this._dragging=void 0,void 0!==s&&s!==i&&this._setList(ge(t,s,i))};return e`
      <p class="hint">${n("editor.repeat.list_hint",void 0,this.hass)}</p>
      <ul class="items">
        ${t.map((a,o)=>e`
            <li
              draggable="true"
              @dragstart=${e=>{var t;this._dragging=o,null===(t=e.dataTransfer)||void 0===t||t.setData("text/plain",i(a,o)),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}}
              @dragover=${e=>{void 0!==this._dragging&&e.preventDefault()}}
              @drop=${e=>s(e,o)}
              @dragend=${()=>{this._dragging=void 0}}
            >
              <div class="item-row">
                <ha-svg-icon class="handle" .path=${"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"}></ha-svg-icon>
                <span class="item-name">${i(a,o)}</span>
                <span class="spacer"></span>
                <ha-icon-button
                  .path=${"M7,15L12,10L17,15H7Z"}
                  .disabled=${0===o}
                  .label=${n("editor.repeat.move_up",{name:i(a,o)},this.hass)}
                  @click=${()=>this._setList(ge(t,o,o-1))}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M7,10L12,15L17,10H7Z"}
                  .disabled=${o===t.length-1}
                  .label=${n("editor.repeat.move_down",{name:i(a,o)},this.hass)}
                  @click=${()=>this._setList(ge(t,o,o+1))}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"}
                  .label=${n("editor.repeat.list_edit",{name:i(a,o)},this.hass)}
                  @click=${()=>this._toggleItem(o)}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                  .label=${n("editor.repeat.list_remove",{name:i(a,o)},this.hass)}
                  @click=${()=>this._setList(function(e,t){return e.filter((e,i)=>i!==t)}(t,o))}
                ></ha-icon-button>
              </div>
              ${this._openItems.has(o)?e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${a}
                      @value-changed=${e=>{var i;e.stopPropagation(),!1!==(null===(i=e.detail)||void 0===i?void 0:i.isValid)&&this._setList(function(e,t,i){return e.map((e,s)=>s===t?i:e)}(t,o,e.detail.value))}}
                    ></ha-yaml-editor>`:e``}
            </li>
          `)}
      </ul>
      <ha-button @click=${()=>this._setList(function(e){const t=e[e.length-1],i=t&&"object"==typeof t&&!Array.isArray(t)?Object.keys(t):[],s={};for(const n of i.length?i:["entity"])s[n]="";return[...e,s]}(t))}>
        ${n("editor.repeat.list_add",void 0,this.hass)}
      </ha-button>
    `}_toggleItem(e){const t=new Set(this._openItems);t.has(e)?t.delete(e):t.add(e),this._openItems=t}_hiddenNames(e,t){var i;const s=new Set;if(!t.some(e=>void 0!==e.show_if||void 0!==e.hide_if))return s;const n=o(r(null===(i=this._config)||void 0===i?void 0:i.variables,e)),a=e=>n[e];for(const o of t)ve(o,a)||s.add(o.name);return s}_formSchema(e,t,i){if(!e.length)return this._schema;const s=new Set(this._suppliedNames(i)),a=e=>{var t;const i=s.has(e.name);return{name:Ri+e.name,label:null!==(t=e.label)&&void 0!==t?t:e.name,helper:i?n("editor.repeat.from_each_copy_helper",void 0,this.hass):e.description,selector:ye(e),required:!0===e.required&&!i,disabled:i}},o=[];for(const n of _e(e.filter(e=>!F(e))))void 0===n.group?o.push(...n.declarations.map(a)):o.push({name:"",type:"expandable",title:n.group,schema:n.declarations.map(a)});return[this._schema[0],...o,...t.extras?[]:[{name:"extras",label:n("editor.extras_label",void 0,this.hass),helper:n("editor.extras_helper",void 0,this.hass),selector:{object:{}}}]]}_formData(e){var t,i,s,n,a,l,c,d,h,p,u,m;if(!e.length)return this._config;const f=o(null===(t=this._config)||void 0===t?void 0:t.variables),g=new Set(e.map(e=>e.name)),v={template:null===(i=this._config)||void 0===i?void 0:i.template};this._shownAs=new Map;const _=function(e,t,i,s){const n=new Map;if(!i||!e.length)return n;const a=o(r(t,i));for(const o of e){if(!(o in a))continue;const e=fi(a[o],t,i,s);null!=e&&""!==e&&n.set(o,e)}return n}(e.filter(e=>!(e.name in f)&&!F(e)).map(e=>e.name),null===(s=this._config)||void 0===s?void 0:s.variables,null===(n=this._templates)||void 0===n?void 0:n[null===(a=this._config)||void 0===a?void 0:a.template],this.hass);for(const o of e){if(!(o.name in f)){if(!_.has(o.name))continue;let e=_.get(o.name);"boolean"in ye(o)&&"boolean"!=typeof e&&(e=Ki.has(String(e).trim().toLowerCase())),this._shownAs.set(o.name,{shown:e,written:void 0}),v[Ri+o.name]=e;continue}const e=f[o.name];if("boolean"!=typeof e&&"boolean"in ye(o)){const t=Ki.has(String(e).trim().toLowerCase());this._shownAs.set(o.name,{shown:t,written:e}),v[Ri+o.name]=t}else v[Ri+o.name]=e}const y=I(null===(l=this._config)||void 0===l?void 0:l.variables).filter(e=>{const t=D(e);return void 0!==t&&!g.has(t)});return y.length&&(v.extras=y),void 0!==(null===(c=this._config)||void 0===c?void 0:c.columns)&&(v.columns=this._config.columns),void 0!==(null===(d=this._config)||void 0===d?void 0:d.min_column_width)&&(v.min_column_width=this._config.min_column_width),void 0!==(null===(h=this._config)||void 0===h?void 0:h.gap)&&(v.gap=this._config.gap),void 0!==(null===(p=this._config)||void 0===p?void 0:p.fit)&&(v.fit=this._config.fit),void 0!==(null===(u=this._config)||void 0===u?void 0:u.lazy)&&(v.lazy=this._config.lazy),void 0!==(null===(m=this._config)||void 0===m?void 0:m.lazy_eager)&&(v.lazy_eager=this._config.lazy_eager),v}_renderDiagnostics(t,s){var a,o,r,l,c,h,p,u,m,f,g,v,_,y,b,$,w;if(!t||this._loadingTemplates||!s||T(this._config))return e``;const x=[...this._suppliedNames(t),...i(null===(a=this._config)||void 0===a?void 0:a.rebuild_on),...be(t,d(null===(o=this._config)||void 0===o?void 0:o.variables)),...Object.keys(J(null!==(r=this._lovelace)&&void 0!==r?r:A()))].map(e=>({[e]:null})),{missing:k,unused:j,required:S}=$e(null===(l=this._config)||void 0===l?void 0:l.variables,t,x,[null===(c=this._config)||void 0===c?void 0:c.for_each_from,null===(h=this._config)||void 0===h?void 0:h.on_error],we(t,J(null!==(p=this._lovelace)&&void 0!==p?p:A()))),O=xe(null===(u=this._config)||void 0===u?void 0:u.variables,t,this.hass),E=this._hiddenNames(t,C(t)),P=S.filter(e=>!E.has(e)),L=k.filter(e=>!S.includes(e)&&!E.has(e)),F=new Set(I(null===(m=this._config)||void 0===m?void 0:m.variables).map(D)),M=[...E].filter(e=>F.has(e)),V=Ji.test(`${null!==(f=t.style)&&void 0!==f?f:""}\n${null!==(v=null===(g=this._config)||void 0===g?void 0:g.style)&&void 0!==v?v:""}`),H="contents"===(null===(_=this._config)||void 0===_?void 0:_.fit)&&V,q=Number(null===(y=this._config)||void 0===y?void 0:y.columns),R=(void 0!==(null===(b=this._config)||void 0===b?void 0:b.for_each)||void 0!==(null===($=this._config)||void 0===$?void 0:$.for_each_from))&&q>1&&!(Number(null===(w=this._config)||void 0===w?void 0:w.min_column_width)>0),z=N(t),U=ke(this._config,z);return e`
      ${U.map(t=>{var i,s;return e`<ha-alert alert-type="warning">
            ${n("editor.override_misplaced",{key:t,kind:z,template:null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""},this.hass)}
          </ha-alert>`})}
      ${R?e`<ha-alert alert-type="info">
              ${n("editor.columns_without_min_width",{columns:q},this.hass)}
            </ha-alert>`:e``}
      ${H?e`<ha-alert alert-type="warning">${n("editor.fit_hides_style",void 0,this.hass)}</ha-alert>`:e``}
      ${M.length?e`<ha-alert alert-type="warning">
              ${n(1===M.length?"editor.hidden_but_set_one":"editor.hidden_but_set_many",{names:M.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${P.length?e`<ha-alert alert-type="error">
              ${n(1===P.length?"editor.required_one":"editor.required_many",{names:P.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${L.length?e`<ha-alert alert-type="warning">
              ${n(1===L.length?"editor.optional_one":"editor.optional_many",{names:L.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${O.map(t=>e`<ha-alert alert-type="warning">
            ${n("editor.invalid_value",{name:t.name,expected:t.expected},this.hass)}
          </ha-alert>`)}
      ${j.length?e`<ha-alert alert-type="info">
              ${n(1===j.length?"editor.unused_one":"editor.unused_many",{names:j.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_valueChanged(e){var t,i;const s=e.detail.value,n=C(null===(t=this._templates)||void 0===t?void 0:t[s.template]);if(!n.length)return void g(this,"config-changed",{config:s});const a=[];for(const l of n){let e=s[Ri+l.name];const t=this._shownAs.get(l.name);t&&gi(e,t.shown)&&(e=t.written),void 0!==e&&""!==e&&a.push({[l.name]:e})}Array.isArray(s.extras)&&a.push(...s.extras);const o=Object.assign(Object.assign({},this._config),{template:s.template}),r=je(I(null===(i=this._config)||void 0===i?void 0:i.variables),a);r.length?o.variables=r:delete o.variables,P(o,"columns",s.columns),P(o,"min_column_width",s.min_column_width),P(o,"gap",s.gap),P(o,"lazy",!0===s.lazy||void 0),P(o,"lazy_eager",s.lazy_eager),g(this,"config-changed",{config:o})}_loadBorrowedTemplates(){if(!Ae(this._lovelace))return;this._loadingTemplates=!0;const e=this._editingPlace();Se(this.hass,this._lovelace,e.view,void 0,e.section).then(e=>{this._templates=e,this._schema=void 0}).finally(()=>{this._loadingTemplates=!1,this.requestUpdate()})}}h([u()],Yi.prototype,"_lovelace",void 0),h([u()],Yi.prototype,"_config",void 0),h([p()],Yi.prototype,"hass",void 0),h([u()],Yi.prototype,"_loadingTemplates",void 0),h([u()],Yi.prototype,"_ejectPending",void 0),h([u()],Yi.prototype,"_sectionsPending",void 0),h([u()],Yi.prototype,"_sectionsError",void 0),h([u()],Yi.prototype,"_onErrorMode",void 0),h([u()],Yi.prototype,"_previewMode",void 0),h([u()],Yi.prototype,"_copied",void 0),h([u()],Yi.prototype,"_cannotOpen",void 0),h([u()],Yi.prototype,"_resume",void 0),h([u()],Yi.prototype,"_matchesOpen",void 0),h([u()],Yi.prototype,"_byDomainDraft",void 0),h([u()],Yi.prototype,"_openItems",void 0),h([u()],Yi.prototype,"_renderedTemplates",void 0);const Zi=/^[a-z_]+\.[a-z0-9_]+$/,Gi={base:"entity",label:"Entity",selector:{entity:{}},matches:e=>Zi.test(e)};function Qi(e,t){return{base:e,label:t,selector:{text:{}},matches:e=>e.trim().length>0}}const Xi={entity:Gi,entity_id:Gi,name:Qi("name","Name"),title:Qi("title","Title"),heading:Qi("heading","Heading"),icon:{base:"icon",label:"Icon",selector:{icon:{}},matches:e=>e.includes(":")}};function es(e,t){return 1===t?e.label:`${e.label} ${t}`}const ts=(e,t=200)=>{if("number"==typeof e&&(e=String(e)),"string"!=typeof e)return;const i=e.trim();return i?i.length>t?`${i.slice(0,t-1)}…`:i:void 0};function is(e){const t=ts(e,2e3);if(t&&/^https?:\/\/[^\s/]+/i.test(t))return t}const ss=e=>[].concat(null!=e?e:[]).map(e=>ts(e)).filter(e=>!!e).slice(0,50);function ns(e){if("string"==typeof e){const t=ts(e);return t?{name:t}:void 0}if(!e||"object"!=typeof e||Array.isArray(e))return;const t=e,i=ts(t.github),s={name:ts(t.name),github:i&&/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(i)?i:void 0,email:ts(t.email),url:is(t.url)};for(const n of Object.keys(s))void 0===s[n]&&delete s[n];return Object.keys(s).length?s:void 0}function as(e){const t=e&&"object"==typeof e?e:{},i={author:ns(t.author),license:ts(t.license),help:is(t.help),homepage:is(t.homepage),readme:ts(t.readme,8e3),related:ss(t.related),setup:ss(t.setup)};for(const s of["author","license","help","homepage","readme"])void 0===i[s]&&delete i[s];return i}const os=["author","license","help","homepage","readme","requires","setup","related"];function rs(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);for(const i of os)delete t[i];return t}const ls={integrations:{kind:"integration",key:"integration"},entities:{kind:"entity",key:"entity"},custom_cards:{kind:"custom_card",key:"card"}},cs=e=>{const t=ts(e,40);return t&&t.replace(/\+$/,"").trim()||void 0};function ds(e){var t;const i=null==e?void 0:e.requires;if(!i||"object"!=typeof i||Array.isArray(i))return[];const s=[];for(const[n,{kind:a,key:o}]of Object.entries(ls))for(const e of[].concat(null!==(t=i[n])&&void 0!==t?t:[]).slice(0,50)){const t=e&&"object"==typeof e&&!Array.isArray(e)?e:void 0,i=ss(t?t[o]:e).map(e=>"custom_card"===a?e.replace(/^custom:/,""):e);if(!i.length)continue;const n=t?ts(t.message,300):void 0;s.push(n?{kind:a,any:i,message:n}:{kind:a,any:i})}for(const n of["homeassistant","card"]){const e=cs(i[n]);e&&s.push({kind:n,any:[e]})}return s}function hs(e,t){var i,s;const n=e=>e.split(".").map(e=>parseInt(e,10)||0),a=n(e),o=n(t);for(let r=0;r<Math.max(a.length,o.length);r++){const e=null!==(i=a[r])&&void 0!==i?i:0,t=null!==(s=o[r])&&void 0!==s?s:0;if(e!==t)return e>t}return!0}function ps(e,t){switch(e.kind){case"integration":{const i=new Set;for(const e of t.components)i.add(e),i.add(e.split(".").pop());return e.any.some(e=>i.has(e))}case"entity":return e.any.some(e=>{const i=function(e){const t=e.replace(/[.+?^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*");return new RegExp(`^${t}$`,"i")}(e);return t.entities.some(e=>i.test(e))});case"custom_card":return e.any.some(e=>t.isDefined(e));case"homeassistant":return!t.homeassistant||hs(t.homeassistant,e.any[0]);case"card":return t.card.startsWith("0.0.0")||hs(t.card,e.any[0])}}function us(e,t){const i=Oe(e),s=Array.isArray(i)?i.filter(e=>e&&"object"==typeof e):i&&"object"==typeof i?Object.entries(i).map(([e,t])=>({[e]:t})):[],n=s.find(e=>Object.prototype.hasOwnProperty.call(e,t)),a=null==n?void 0:n[t];return"string"==typeof a||"number"==typeof a?String(a):void 0}function ms(e,t){const i=as(e).setup.filter(e=>"string"==typeof t[e]&&""!==t[e]);if(!i.length)return e;const s=Oe(e),n=(Array.isArray(s)?s.filter(e=>e&&"object"==typeof e):s&&"object"==typeof s?Object.entries(s).map(([e,t])=>({[e]:t})):[]).filter(e=>!i.some(t=>Object.prototype.hasOwnProperty.call(e,t))),a=Object.assign(Object.assign({},e),{default:[...i.map(e=>({[e]:t[e]})),...n]});return delete a[Ce],a}const fs={integrations:"requires_integrations",entities:"requires_entities",custom_cards:"requires_custom_cards"},gs=e=>"string"==typeof e?e:"number"==typeof e?String(e):void 0,vs=e=>[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);const _s=e=>"string"==typeof e&&e.trim()?e.trim():void 0,ys=e=>[].concat(null!=e?e:[]).map(_s).filter(e=>!!e);const bs=[Te,Ne,...Pe],$s=["card","badge","row","element","group"],ws=["type","template","description","author","license","help","homepage","readme","requires","setup","related","variables","default",...$s,"style"];function xs(e,t){if(Array.isArray(e))for(const i of e)xs(i,t);else if(e&&"object"==typeof e){t(e);for(const i of Object.values(e))xs(i,t)}}function ks(e){const t=new Set,i=new Set;xs(e,e=>{const s=e.type;if("string"==typeof s){s.startsWith("custom:")&&!bs.includes(s)&&t.add(s);for(const t of Le(e))i.add(t)}});for(const s of Ee(e))i.add(s);return{customTypes:[...t].sort(),templateRefs:[...i].sort()}}function js(e){return e.includes("[[")}function As(e,t){const i=e.split(/\[\[[^\]]*\]\]/);if(!i.join(""))return[];const s=i.map(e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join(".+"),n=new RegExp(`^${s}$`);return t.filter(e=>n.test(e))}function Ss(e,t){const i=e&&"object"==typeof e&&void 0!==e[Ce]?Object.assign(Object.assign({},e),{default:Oe(e)}):e,s={};for(const n of ws)void 0!==(null==i?void 0:i[n])&&(s[n]=i[n]);for(const n of Object.keys(null!=i?i:{}))n in s||n===Ce||"source"===n||(s[n]=i[n]);const{customTypes:a,templateRefs:o}=ks(e),r=[],l=[];let c=!1;if(t){const i={},n=[...o],a=null==e?void 0:e.template,d=new Set(as(e).related.filter(e=>e!==a));for(n.push(...d);n.length;){const e=n.shift();if(e in i)continue;if(js(e)){l.includes(e)||l.push(e);const i=As(e,Object.keys(t)).filter(e=>e!==a);i.length&&(c=!0),n.push(...i);continue}const s=t[e];if(s){i[e]=Os(s),n.push(...ks(s).templateRefs);for(const e of as(s).related)e===a||d.has(e)||(d.add(e),n.push(e))}else d.has(e)||r.push(e)}Object.keys(i).length&&(s.includes=i)}else for(const n of o)(js(n)?l:r).push(n);const d=[];if(a.length&&d.push(n("share.requires_custom_cards",{types:a.join(", ")})),r.length&&d.push(n("share.uses_other_templates",{names:r.join(", ")})),l.length){const e=c?"share.picked_templates_found":"share.picked_templates";d.push(n(e,{names:l.join(", ")}))}const h=function(e){const t=null==e?void 0:e.requires;return t&&"object"==typeof t?["homeassistant","card"].filter(e=>"number"==typeof t[e]):[]}(e);return h.length&&d.push(n("share.version_unquoted",{keys:h.join(", ")})),{payload:s,notes:d}}function Os(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);return delete t.source,t}function Cs(e,t){if(!t.includes(e))return e;let i=2;for(;t.includes(`${e}_${i}`);)i+=1;return`${e}_${i}`}function Es(e){if(!e||"object"!=typeof e||Array.isArray(e))return{ok:!1,errors:[n("share.import_not_a_template")]};const t=[];"string"==typeof e.template&&e.template.trim()||t.push(n("share.import_no_name"));const i=$s.filter(t=>void 0!==e[t]);return 0===i.length?t.push(n("share.import_defines_nothing")):i.length>1&&t.push(n("share.import_defines_both",{first:i[0],second:i[1]})),{ok:0===t.length,errors:t}}function Ts(e,t){const i=new Set;for(const s of e)for(const e of ks(s).customTypes){const s=e.slice(7);s&&!t(s)&&i.add(s)}return[...i].sort()}const Ns=["card","badge","row","element","group"],Ps=/^[A-Za-z0-9_-]+$/,Ls=/^[a-z_]+\.[a-z0-9_]+$/;function Is(e){return Ns.find(t=>void 0!==(null==e?void 0:e[t])&&null!==(null==e?void 0:e[t]))}function Fs(e){return e.map(e=>"number"==typeof e?`#${e+1}`:e).join(" › ")}function Ms(e){const t=new Set;for(const n of Ie(null==e?void 0:e.variables))n&&"string"==typeof n.name&&t.add(n.name);const i=JSON.stringify(null!=e?e:{}),s=/\[\[([A-Za-z0-9_-]+)/g;for(let n=s.exec(i);n;n=s.exec(i))t.add(n[1]);return[...t]}function Vs(e){return"boolean"==typeof e?"boolean":"number"==typeof e?"number":"string"==typeof e&&Ls.test(e)?"entity":"string"==typeof e&&/^[a-z]+:[a-z0-9-]+$/.test(e)?"icon":"text"}function Hs(e,t,i){if(!t.length)return i;const[s,...n]=t;return Array.isArray(e)?e.map((e,t)=>t===s?Hs(e,n,i):e):Object.assign(Object.assign({},e),{[s]:Hs(null==e?void 0:e[s],n,i)})}const Ds=["card","badge","row","element","group","style","let","default","grid_options","name"],qs="default:",Rs="or:";function zs(e){return e.startsWith(Rs)?e.slice(3):He(e)}function Us(e,t,i){if(!e.includes("[[")&&!e.includes("]]"))return;const s=function(e){let t=0,i=!1;for(let s=0;s<e.length-1;s+=1){const n=e.slice(s,s+2);"[["===n?(t+=1,s+=1):"]]"===n&&(0===t?i=!0:t-=1,s+=1)}return{unclosed:t>0,stray:i}}(e);s.unclosed&&i.findings.push({level:"warning",key:"lint.unclosed",params:{},path:t}),s.stray&&i.findings.push({level:"warning",key:"lint.stray_close",params:{},path:t});let n=e;for(let a=0;a<5;a+=1){let e=!1;if(n=n.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(s,n)=>(e=!0,n.startsWith(De)||Ws(n,t,i),"_")),!e)break}}function Ws(e,t,i){const s=e.endsWith("?")?e.slice(0,-1):e,[n,...a]=s.split("|"),o=`[[${e}]]`,r=(n.endsWith("?")?n.slice(0,-1):n).split(".")[0];r&&"_"!==r&&!i.heads.has(r)&&i.heads.set(r,t);let l=!1;for(const c of a){if(!qe(c)){const e=Re(c);i.findings.push({level:"warning",key:"lint.unknown_step",params:e?{step:c,placeholder:o,closest:e}:{step:c,placeholder:o},path:t});continue}(c.startsWith(qs)||c.startsWith(Rs))&&l&&i.findings.push({level:"warning",key:"lint.after_default",params:{step:c,placeholder:o},path:t}),c.startsWith(qs)&&c.length>8&&(l=!0);const e=zs(c);e&&"_"!==e&&i.targets.push({name:e,placeholder:o,path:t})}}function Bs(e,t,i){if("string"!=typeof e){if(Array.isArray(e))e.forEach((e,s)=>Bs(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,n]of Object.entries(e))Us(s,t,i),Bs(n,t?`${t}.${s}`:s,i)}else Us(e,t,i)}function Ks(e){const t=new Set;for(const i of C(e))t.add(i.name);for(const i of[...d(Oe(e)),...d(null==e?void 0:e.let)]){const e=D(i);void 0!==e&&t.add(e)}return[...t]}function Js(e,t=[]){if(!e||"object"!=typeof e)return[];const i={findings:[],heads:new Map,targets:[]};for(const a of Ds){const t=e[a];void 0!==t&&Bs(t,a,i)}C(e).forEach((e,t)=>{void 0!==e.default&&Bs(e.default,`variables[${t}].default`,i);for(const s of["show_if","hide_if"]){const n=`variables[${t}].${s}`;for(const t of Me(e,s)){const e=t.slice(3);if(!Ve(t)){i.findings.push({level:"warning",key:"lint.condition_malformed",params:{key:s,condition:e},path:n});continue}const a=He(t);a&&i.targets.push({name:a.split(".")[0],placeholder:`${s}: ${e}`,path:n})}}});const s=new Set([...Ks(e),...t,...ue,...be(e)]),n=[...i.findings],o=e=>s.has(e)||i.heads.has(e),r=e=>o(e)||e.split(".").some((e,t,i)=>t>0&&o(i.slice(0,t).join(".")));for(const d of i.targets){if(r(d.name))continue;const e=a(d.name,[...s,...i.heads.keys()]);n.push({level:"warning",key:"lint.target_unknown",params:e?{name:d.name,placeholder:d.placeholder,closest:e}:{name:d.name,placeholder:d.placeholder},path:d.path})}const l=[...i.heads.entries()].filter(([e])=>!s.has(e));l.length&&n.push({level:"info",key:"lint.undeclared",params:{names:l.map(([e,t])=>l.length>1?`${e} (${t})`:e).join(", ")},path:l.length>1?"":l[0][1]});for(const d of function(e){return pi(e).filter(e=>!di.includes(e)).map(e=>{const t=a(e,di);return t?{name:e,closest:t}:{name:e}})}(e))n.push({level:"warning",key:"lint.editor_hide_unknown",params:Object.assign({},d),path:"editor_hide"});const c=new Set;return n.filter(e=>{const t=JSON.stringify([e.key,e.params,e.path]);return!c.has(t)&&(c.add(t),!0)})}const Ys={card:{type:"entity",entity:"sun.sun"},badge:{type:"entity",entity:"sun.sun"},row:{entity:"sun.sun"},element:{type:"icon",icon:"mdi:weather-sunny",style:{color:"yellow"}}},Zs=50,Gs=e=>!!customElements.get(e),Qs=e=>e.actions.length>0||e.urls.length>0||e.embeds||e.scripts||e.placeholders||e.overlay;const Xs=500,en="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z";function tn(t){const i=e=>{var i;return t.onInput(null!==(i=e.target.value)&&void 0!==i?i:"")},s=e=>{var i;return null===(i=t.onKeydown)||void 0===i?void 0:i.call(t,e)};return Gs("ha-input")?e`<ha-input
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
      ></ha-textfield>`}async function sn(e,t,i,s){var a;if(!G())return e._toolError=n("tools.cannot_save_here",void 0,e.hass),!1;e._busy=!0,e._toolError=void 0;try{return await X(e,e.hass,i,[{urlPath:te(),build:t}],s),e._undoChanged=void 0,!0}catch(o){return e._toolError=n("tools.save_failed",{message:null!==(a=null==o?void 0:o.message)&&void 0!==a?a:o},e.hass),!1}finally{e._busy=!1}}const nn=f`
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
 */,an=2,on=e=>(...t)=>({_$litDirective$:e,values:t});let rn=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:ln}=We,cn=e=>e,dn=()=>document.createComment(""),hn=(e,t,i)=>{const s=e._$AA.parentNode,n=void 0===t?e._$AB:t._$AA;if(void 0===i){const t=s.insertBefore(dn(),n),a=s.insertBefore(dn(),n);i=new ln(t,a,e,e.options)}else{const t=i._$AB.nextSibling,a=i._$AM,o=a!==e;if(o){let t;i._$AQ?.(e),i._$AM=e,void 0!==i._$AP&&(t=e._$AU)!==a._$AU&&i._$AP(t)}if(t!==n||o){let e=i._$AA;for(;e!==t;){const t=cn(e).nextSibling;cn(s).insertBefore(e,n),e=t}}}return i},pn=(e,t,i=e)=>(e._$AI(t,i),e),un={},mn=(e,t=un)=>e._$AH=t,fn=e=>{e._$AR(),e._$AA.remove()},gn=on(class extends rn{constructor(){super(...arguments),this.key=Be}render(e,t){return this.key=e,t}update(e,[t,i]){return t!==this.key&&(mn(e),this.key=t),i}}),vn=[{name:"room_light_tile",summary:"A tile per light, with the light named after itself.",template:{description:"A tile for one light, taking its name from Home Assistant.",variables:[{name:"entity",label:"Light",selector:{entity:{domain:"light"}},required:!0},{name:"name",label:"Name",description:"Leave empty to use the light’s own name",selector:{text:{}}}],card:{type:"tile",entity:"[[entity]]",name:"[[name|or:entity|friendly_name]]",features:[{type:"light-brightness"}]}}},{name:"room_summary",summary:"A heading per area, listing the lights in it. Uses grouping.",template:{description:"One card per area, with a tile for every light in that area.",card:{type:"vertical-stack",cards:[{type:"markdown",content:"## [[area]]\n\n[[entity_count]] lights"},{type:"custom:decluttering-card-plus",template:"room_light_tile",for_each:"[[items]]"}]}}},{name:"sensor_line",summary:"An Entities row showing one sensor with its area.",template:{description:"A row for one sensor, labelled with the area it is in.",variables:[{name:"entity",label:"Sensor",selector:{entity:{}},required:!0}],row:{entity:"[[entity]]",name:"[[entity|friendly_name]] ([[entity|area|default:no area]])"}}},{name:"status_badge",summary:"A badge that only appears when something needs attention.",template:{description:"A badge for one entity, hidden unless it is in the state you care about.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0},{name:"when",label:"Show when the state is",selector:{text:{}},default:"on"}],badge:{type:"entity",entity:"[[entity]]",visibility:[{condition:"state",entity:"[[entity]]",state:"[[when]]"}]}}},{name:"counted_grid",summary:'A numbered grid of anything, showing "3 of 12".',template:{description:"A tile that knows where it sits in a repeat.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0}],card:{type:"tile",entity:"[[entity]]",name:"[[entity|friendly_name]]",footer:{type:"markdown",content:"[[index]] of [[total|or:count]]"}}}}];
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _n(e){return vn.find(t=>t.name===e)}function yn(e,t){const i=new Set,s=e=>{Array.isArray(e)?e.forEach(s):e&&"object"==typeof e&&("string"==typeof e.type&&e.type.includes("decluttering-card")&&"string"==typeof e.template&&i.add(e.template),Object.values(e).forEach(s))};return s(e.template),[...i].filter(e=>!t.includes(e))}function bn(e,t){return{library:e,version:t}}
/*! js-yaml 5.5.0 https://github.com/nodeca/js-yaml @license MIT */var $n=Symbol("NOT_RESOLVED");function wn(e,t){return{tagName:e,nodeKind:"scalar",implicit:t.implicit??!1,matchByTagPrefix:t.matchByTagPrefix??!1,implicitFirstChars:t.implicitFirstChars??null,resolve:t.resolve,identify:t.identify,represent:t.represent??(e=>String(e)),representTagName:t.representTagName??(()=>e)}}function xn(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"sequence",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addItem:t.addItem,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}function kn(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"mapping",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addPair:t.addPair,has:t.has,keys:t.keys,get:t.get,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}var jn=wn("tag:yaml.org,2002:str",{resolve:e=>e,identify:e=>"string"==typeof e}),An=["","~","null","Null","NULL"],Sn=wn("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==An.indexOf(e)?null:$n,identify:e=>null===e,represent:()=>"null"}),On=wn("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(e,t)=>"null"===e||t&&""===e?null:$n,identify:e=>null===e,represent:()=>"null"}),Cn=["","~","null","Null","NULL"],En=wn("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==Cn.indexOf(e)?null:$n,identify:e=>null===e,represent:()=>"null"}),Tn=["true","True","TRUE"],Nn=["false","False","FALSE"],Pn=wn("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:e=>-1!==Tn.indexOf(e)||-1===Nn.indexOf(e)&&$n,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Ln=["true"],In=["false"],Fn=wn("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:e=>-1!==Ln.indexOf(e)||-1===In.indexOf(e)&&$n,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Mn=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],Vn=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],Hn=wn("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:e=>-1!==Mn.indexOf(e)||-1===Vn.indexOf(e)&&$n,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Dn=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),qn=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var Rn=wn("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e,t){if(t){if(!qn.test(e))return $n}else if(!Dn.test(e))return $n;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:$n},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),zn=new RegExp("^-?(?:0|[1-9][0-9]*)$"),Un=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var Wn=wn("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!Un.test(e))return $n}else if(!zn.test(e))return $n;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:$n},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),Bn=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$");var Kn=wn("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e){if(!Bn.test(e))return $n;const t=function(e){let t=e.replace(/_/g,""),i=1;if("-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b"))return i*parseInt(t.slice(2),2);if(t.startsWith("0x"))return i*parseInt(t.slice(2),16);if(t.includes(":")){let e=0;for(const i of t.split(":"))e=60*e+Number(i);return i*e}return"0"!==t&&"0"===t[0]?i*parseInt(t,8):i*parseInt(t,10)}(e);return Number.isFinite(t)?t:$n},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),Jn=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),Yn=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var Zn=wn("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!Jn.test(e))return $n;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const s=i*parseFloat(t);return Number.isFinite(s)||Yn.test(e)?s:$n},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),Gn=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),Qn=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var Xn=wn("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!Qn.test(e))return $n;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const s=i*parseFloat(t);return Number.isFinite(s)?s:$n}if(!Gn.test(e))return $n;const i=Number(e);return Number.isFinite(i)?i:$n},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),ea=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ta=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var ia=wn("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!ea.test(e))return $n;let t=e.toLowerCase().replace(/_/g,"");const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;let s=0;if(t.includes(":")){for(const e of t.split(":"))s=60*s+Number(e);s*=i}else s=i*parseFloat(t);return Number.isFinite(s)||ta.test(e)?s:$n},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),sa=wn("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(e,t)=>"<<"===e||t&&""===e?"<<":$n,identify:()=>!1}),na=/^[A-Za-z0-9+/]*={0,2}$/;var aa=wn("tag:yaml.org,2002:binary",{resolve:function(e){const t=e.replace(/\s/g,"");if(t.length%4!=0||!na.test(t))return $n;const i=atob(t),s=new Uint8Array(i.length);for(let n=0;n<i.length;n++)s[n]=i.charCodeAt(n);return s},identify:e=>"[object Uint8Array]"===Object.prototype.toString.call(e),represent:function(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t)}}),oa=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),ra=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function la(e,t,i,s=0,n=0,a=0,o=0){const r=new Date(Date.UTC(e,t,i,s,n,a,o));return r.setUTCFullYear(e,t,i),r}var ca=wn("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(e){let t=oa.exec(e);if(null===t&&(t=ra.exec(e)),null===t)return $n;const i=+t[1],s=+t[2]-1,n=+t[3];if(!t[4]){const e=la(i,s,n);return e.getUTCFullYear()!==i||e.getUTCMonth()!==s||e.getUTCDate()!==n?$n:e}const a=+t[4],o=+t[5],r=+t[6];let l=0;if(a>23||o>59||r>59)return $n;if(t[7]){let e=t[7].slice(0,3);for(;e.length<3;)e+="0";l=+e}const c=la(i,s,n,a,o,r,l);if(c.getUTCFullYear()!==i||c.getUTCMonth()!==s||c.getUTCDate()!==n)return $n;if(t[9]){const e=+t[10],i=+(t[11]||0);if(e>23||i>59)return $n;const s=6e4*(60*e+i);c.setTime(c.getTime()-("-"===t[9]?-s:s))}return c},identify:e=>e instanceof Date,represent:e=>e.toISOString()}),da=xn("tag:yaml.org,2002:seq",{create:()=>[],addItem:(e,t)=>{e.push(t)},identify:Array.isArray});function ha(e){if(null===e||"object"!=typeof e||Array.isArray(e))return!1;const t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}function pa(e,t){const i={};for(const s of t)void 0!==e[s]&&(i[s]=e[s]);return i}var ua=xn("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(e,t)=>{let i;if(t instanceof Map){if(1!==t.size)return"cannot resolve an ordered map item";i=t.keys().next().value}else{if(!ha(t))return"cannot resolve an ordered map item";{const e=Object.keys(t);if(1!==e.length)return"cannot resolve an ordered map item";i=e[0]}}return e.seen.has(i)?"duplicate key in ordered map":(e.seen.add(i),e.list.push(t),"")},finalize:e=>e.list,identify:()=>!1}),ma=xn("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(e,t)=>{if(t instanceof Map)return 1!==t.size?"cannot resolve a pairs item":(e.push(t.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(t))return"cannot resolve a pairs item";const i=t,s=Object.keys(i);return 1!==s.length?"cannot resolve a pairs item":(e.push([s[0],i[s[0]]]),"")},identify:()=>!1}),fa=kn("tag:yaml.org,2002:map",{create:()=>({}),identify:ha,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{if(null!==t&&"object"==typeof t)return"object-based map does not support complex keys";const s=String(t);return"__proto__"===s?Object.defineProperty(e,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[s]=i,""},has:(e,t)=>(null===t||"object"!=typeof t)&&Object.prototype.hasOwnProperty.call(e,String(t)),keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}}),ga=kn("tag:yaml.org,2002:set",{create:()=>new Set,identify:e=>e instanceof Set,represent:e=>{const t=new Map;for(const i of e)t.set(i,null);return t},addPair:(e,t,i)=>null!==i?"cannot resolve a set item":(e.add(t),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:()=>null});var va=class e{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(e){const t=function(e){const t=[];for(const i of e){let e=t.length;for(let s=0;s<t.length;s++){const n=t[s];if(n.nodeKind===i.nodeKind&&n.tagName===i.tagName&&n.matchByTagPrefix===i.matchByTagPrefix){e=s;break}}t[e]=i}return t}(e),i=[],s={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},n={scalar:[],sequence:[],mapping:[]};for(const c of t){if("scalar"===c.nodeKind&&c.implicit){if(c.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(c)}switch(c.nodeKind){case"scalar":c.matchByTagPrefix?n.scalar.push(c):s.scalar[c.tagName]=c;break;case"sequence":c.matchByTagPrefix?n.sequence.push(c):s.sequence[c.tagName]=c;break;case"mapping":c.matchByTagPrefix?n.mapping.push(c):s.mapping[c.tagName]=c}}const a=i.filter(e=>null===e.implicitFirstChars),o=new Set;for(const c of i)if(null!==c.implicitFirstChars)for(const e of c.implicitFirstChars)o.add(e);const r=new Map;for(const c of o)r.set(c,i.filter(e=>null===e.implicitFirstChars||-1!==e.implicitFirstChars.indexOf(c)));const l=s.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=t,this.implicitScalarTags=i,this.implicitScalarByFirstChar=r,this.implicitScalarAnyFirstChar=a,this.defaultScalarTag=l,this.defaultSequenceTag=s.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=s.mapping["tag:yaml.org,2002:map"],this.exact=s,this.prefix=n}lookupScalarTag(e){const t=this.exact.scalar[e];if(t)return t;for(const i of this.prefix.scalar)if(e.startsWith(i.tagName))return i}lookupSequenceTag(e){const t=this.exact.sequence[e];if(t)return t;for(const i of this.prefix.sequence)if(e.startsWith(i.tagName))return i}lookupMappingTag(e){const t=this.exact.mapping[e];if(t)return t;for(const i of this.prefix.mapping)if(e.startsWith(i.tagName))return i}resolveImplicitScalarTag(e){const t=this.implicitScalarByFirstChar.get(e.charAt(0))??this.implicitScalarAnyFirstChar;for(const s of t){const t=s.resolve(e,!1,s.tagName);if(t!==$n)return{value:t,tag:s}}const i=this.defaultScalarTag;return{value:i.resolve(e,!1,i.tagName),tag:i}}withTags(...t){let i=[];for(const e of t)i=i.concat(e);return new e([...this.tags,...i])}},_a=new va([jn,da,fa]);new va([..._a.tags,On,Fn,Wn,Xn]);var ya=new va([..._a.tags,Sn,Pn,Rn,Zn]);function ba(e){if(Array.isArray(e)){const t=Array.prototype.slice.call(e);for(let e=0;e<t.length;e++){if(Array.isArray(t[e]))return null;"object"==typeof t[e]&&"[object Object]"===Object.prototype.toString.call(t[e])&&(t[e]="[object Object]")}return String(t)}return"object"==typeof e&&"[object Object]"===Object.prototype.toString.call(e)?"[object Object]":String(e)}new va([..._a.tags,En,Hn,Kn,ia,ca,sa,aa,ua,ma,ga]).withTags({...Kn,resolve:(e,t,i)=>{const s=Kn.resolve(e,t,i);return s===$n?Rn.resolve(e,t,i):s}},{...ia,resolve:(e,t,i)=>{const s=ia.resolve(e,t,i);return s===$n?Zn.resolve(e,t,i):s}}),kn("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(e,t,i)=>(e.set(t,i),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:(e,t)=>e.get(t),identify:e=>e instanceof Map||ha(e),represent:e=>{if(e instanceof Map)return e;const t=new Map,i=e;for(const s of Object.keys(i))t.set(s,i[s]);return t}}),kn("tag:yaml.org,2002:map",{create:()=>({}),identify:ha,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{const s=ba(t);return null===s?"nested arrays are not supported inside keys":("__proto__"===s?Object.defineProperty(e,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[s]=i,"")},has:(e,t)=>{const i=ba(t);return null!==i&&Object.prototype.hasOwnProperty.call(e,i)},keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}});var $a={maxLength:79,indent:1,linesBefore:3,linesAfter:2};function wa(e,t,i,s,n){let a="",o="";const r=Math.floor(n/2)-1;return s-t>r&&(a=" ... ",t=s-r+a.length),i-s>r&&(o=" ...",i=s+r-o.length),{str:a+e.slice(t,i).replace(/\t/g,"→")+o,pos:s-t+a.length}}function xa(e,t){return" ".repeat(Math.max(t-e.length,0))+e}function ka(e,t){let i="";return e.mark?(e.mark.name&&(i+=`in "${e.mark.name}" `),i+=`(${e.mark.line+1}:${e.mark.column+1})`,!t&&e.mark.snippet&&(i+=`\n\n${e.mark.snippet}`),`${e.reason} ${i}`):e.reason}var ja=class e extends Error{reason;mark;constructor(e,t){super(),this.name="YAMLException",this.reason=e,this.mark=t,this.message=ka(this,!1),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}toString(e){return`${this.name}: ${ka(this,e)}`}static throwAt(t,i,s,n=""){let a=0,o=0;for(let e=0;e<i;e++){const i=t.charCodeAt(e);10===i?(a++,o=e+1):13===i&&(a++,10===t.charCodeAt(e+1)&&e++,o=e+1)}const r={name:n,buffer:t,position:i,line:a,column:i-o};throw r.snippet=function(e,t){if(!e.buffer)return null;const i={...$a,...t},s=/\r?\n|\r|\0/g,n=[0],a=[];let o,r=-1;for(;o=s.exec(e.buffer);)a.push(o.index),n.push(o.index+o[0].length),e.position<=o.index&&r<0&&(r=n.length-2);r<0&&(r=n.length-1);let l="";const c=Math.min(e.line+i.linesAfter,a.length).toString().length,d=i.maxLength-(i.indent+c+3);for(let p=1;p<=i.linesBefore&&!(r-p<0);p++){const t=wa(e.buffer,n[r-p],a[r-p],e.position-(n[r]-n[r-p]),d);l=`${" ".repeat(i.indent)}${xa((e.line-p+1).toString(),c)} | ${t.str}\n${l}`}const h=wa(e.buffer,n[r],a[r],e.position,d);l+=`${" ".repeat(i.indent)}${xa((e.line+1).toString(),c)} | ${h.str}\n`,l+=`${"-".repeat(i.indent+c+3+h.pos)}^\n`;for(let p=1;p<=i.linesAfter&&!(r+p>=a.length);p++){const t=wa(e.buffer,n[r+p],a[r+p],e.position-(n[r]-n[r+p]),d);l+=`${" ".repeat(i.indent)}${xa((e.line+p+1).toString(),c)} | ${t.str}\n`}return l.replace(/\n$/,"")}(r),new e(s,r)}},Aa=1,Sa=2,Oa=3,Ca=4,Ea=5,Ta=6,Na=1,Pa=2,La=3,Ia=4,Fa=5,Ma=1,Va=2,Ha=1,Da=2,qa=3;function Ra(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}var za=new Array(256),Ua=new Array(256);for(let _c=0;_c<256;_c++)za[_c]=Ra(_c)?1:0,Ua[_c]=Ra(_c);function Wa(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function Ba(e){return e>=48&&e<=57?e-48:(32|e)-97+10}function Ka(e){return 120===e?2:117===e?4:8}function Ja(e,t,i){let s=0;for(;t<i;){const i=e.charCodeAt(t);if(10===i)s++,t++;else if(13===i)s++,t++,10===e.charCodeAt(t)&&t++;else{if(32!==i&&9!==i)break;t++}}return{position:t,breaks:s}}function Ya(e){return 1===e?" ":"\n".repeat(e-1)}function Za(e,t,i,s,n,a){const o=s<0?0:s,r=e.slice(t,i).replace(/\r\n?/g,"\n"),l=""===r?[]:(r.endsWith("\n")?r.slice(0,-1):r).split("\n");let c="",d=!1,h=0,p=!1;for(const u of l){let e=0;for(;e<o&&32===u.charCodeAt(e);)e++;if(s<0||e>=u.length){h++;continue}const t=u.slice(o),i=t.charCodeAt(0);a?32===i||9===i?(p=!0,c+="\n".repeat(d?1+h:h)):p?(p=!1,c+="\n".repeat(h+1)):0===h?d&&(c+=" "):c+="\n".repeat(h):c+="\n".repeat(d?1+h:h),c+=t,d=!0,h=0}return n===qa?c+="\n".repeat(d?1+h:h):n!==Da&&d&&(c+="\n"),c}function Ga(e,t){if(-1===t.valueStart)return"";const{valueStart:i,valueEnd:s}=t;if(t.fast)return e.slice(i,s);switch(t.style){case Pa:return function(e,t,i){let s="",n=t,a=t,o=t;for(;n<i;){const t=e.charCodeAt(n);if(39===t)s+=e.slice(a,n)+"'",n+=2,a=o=n;else if(10===t||13===t){s+=e.slice(a,o);const t=Ja(e,n,i);s+=Ya(t.breaks),n=a=o=t.position}else n++,32!==t&&9!==t&&(o=n)}return s+e.slice(a,i)}(e,i,s);case La:return function(e,t,i){let s="",n=t,a=t,o=t;for(;n<i;){const t=e.charCodeAt(n);if(92===t){s+=e.slice(a,n),n++;const t=e.charCodeAt(n);if(10===t||13===t)n=Ja(e,n,i).position;else if(t<256&&za[t])s+=Ua[t],n++;else{let i=Ka(t),a=0;for(;i>0;i--)n++,a=(a<<4)+Ba(e.charCodeAt(n));s+=Wa(a),n++}a=o=n}else if(10===t||13===t){s+=e.slice(a,o);const t=Ja(e,n,i);s+=Ya(t.breaks),n=a=o=t.position}else n++,32!==t&&9!==t&&(o=n)}return s+e.slice(a,i)}(e,i,s);case Ia:return Za(e,i,s,t.indent,t.chomping,!1);case Fa:return Za(e,i,s,t.indent,t.chomping,!0);default:return function(e,t,i){let s="",n=t,a=t,o=t;for(;n<i;){const t=e.charCodeAt(n);if(10===t||13===t){s+=e.slice(a,o);const t=Ja(e,n,i);s+=Ya(t.breaks),n=a=o=t.position}else n++,32!==t&&9!==t&&(o=n)}return s+e.slice(a,o)}(e,i,s)}}var Qa=Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"});function Xa(e){let t="",i=0;for(;i<e.length;){if(37!==e.charCodeAt(i)){t+=e[i++];continue}let s=parseInt(e.slice(i+1,i+3),16);if(i+=3,s>=192){let t=s<224?1:s<240?2:3;for(s&=(1<<6-t)-1;t-- >0;)s=s<<6|63&parseInt(e.slice(i+1,i+3),16),i+=3}s<65536?t+=String.fromCharCode(s):(s-=65536,t+=String.fromCharCode(55296|s>>10,56320|1023&s))}return t}function eo(e,t){if(e.startsWith("!<")&&e.endsWith(">"))return Xa(e.slice(2,-1));const i=e.indexOf("!",1),s=-1===i?"!":e.slice(0,i+1);return Xa(t?.[s]??Qa[s]??s)+Xa(e.slice(s.length))}var to=-1,io={filename:"",schema:ya,json:!1,maxTotalMergeKeys:1e4,maxAliases:-1};function so(e){return"tagStart"in e&&e.tagStart!==to?e.tagStart:"anchorStart"in e&&e.anchorStart!==to?e.anchorStart:"valueStart"in e&&e.valueStart!==to?e.valueStart:"start"in e?e.start:0}function no(e,t){ja.throwAt(e.source,e.position,t,e.filename)}function ao(e,t,i,s){try{return i.finalize(s)}catch(n){if(n instanceof ja)throw n;ja.throwAt(e.source,t,n instanceof Error?n.message:String(n),e.filename)}}function oo(e,t){const i=Ga(e.source,t),s=t.tagStart===to?"":e.source.slice(t.tagStart,t.tagEnd),n=e.schema.defaultScalarTag;if(""!==s){if("!"===s)return{value:i,tag:n};const t=eo(s,e.tagHandlers),a=e.schema.lookupScalarTag(t);if(a){const s=a.resolve(i,!0,t);return s===$n&&no(e,`cannot resolve a node with !<${t}> explicit tag`),{value:s,tag:a}}const o=e.schema.lookupMappingTag(t)??e.schema.lookupSequenceTag(t);if(o){""!==i&&no(e,`cannot resolve a node with !<${t}> explicit tag`);const s=o.create(t);return{value:o.carrierIsResult?s:ao(e,e.position,o,s),tag:o}}no(e,`unknown scalar tag !<${t}>`)}return t.style===Na?e.schema.resolveImplicitScalarTag(i):{value:n.resolve(i,!1,n.tagName),tag:n}}function ro(e,t,i){const s=t.tagStart===to?"":e.source.slice(t.tagStart,t.tagEnd);return""===s||"!"===s?i:eo(s,e.tagHandlers)}function lo(e){return"mapping"===e.nodeKind}function co(e){e.totalMergeKeys++,-1!==e.maxTotalMergeKeys&&e.totalMergeKeys>e.maxTotalMergeKeys&&no(e,`merge keys exceeded maxTotalMergeKeys (${e.maxTotalMergeKeys})`)}function ho(e,t,i,s){co(e);for(const n of s.keys(i)){if(co(e),t.tag.has(t.value,n))continue;const a=t.tag.addPair(t.value,n,s.get(i,n));a&&no(e,a),t.overridable??=new Set,t.overridable.add(n)}}function po(e,t,i,s,n){if(e.position=t.keyPosition,t.keyIsMerge)return void function(e,t,i,s){if(e.position=t.keyPosition,lo(s))ho(e,t,i,s);else if("sequence"===s.nodeKind&&Array.isArray(i)){i.length>100&&no(e,"abnormal merge sequence size");for(const s of i){const i=e.nodeTags.get(s);i||no(e,"cannot merge mappings; the provided source object is unacceptable"),ho(e,t,s,i)}}else no(e,"cannot merge mappings; the provided source object is unacceptable")}(e,t,s,n);e.json||!t.tag.has(t.value,i)||t.overridable?.has(i)||no(e,"duplicated mapping key");const a=t.tag.addPair(t.value,i,s);a&&no(e,a),t.overridable?.delete(i)}function uo(e,t,i){const s=e.frames[e.frames.length-1];if("document"===s.kind)s.value=t,s.hasValue=!0;else if("sequence"===s.kind){lo(i)&&e.nodeTags.set(t,i);const n=s.tag.addItem(s.value,t,s.index++);n&&no(e,n)}else if(s.hasKey){const n=s.key;s.key=void 0,s.hasKey=!1,po(e,s,n,t,i)}else s.key=t,s.keyPosition=e.position,s.hasKey=!0,s.keyIsMerge="tag:yaml.org,2002:merge"===i.tagName}function mo(e,t,i,s,n){if(t.anchorStart!==to){const a={value:i,tag:s,isValueFinal:n};return e.anchors.set(e.source.slice(t.anchorStart,t.anchorEnd),a),a}return null}var fo=-1,go=Object.prototype.hasOwnProperty,vo=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,_o=/[,\[\]{}]/,yo=/^(?:!|!!|![0-9A-Za-z-]+!)$/,bo=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,$o=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`,wo=new RegExp(`^(?:${bo})*$`),xo=new RegExp(`^(?:${$o})+$`),ko=new RegExp(`^(?:!(?:${bo})*|${$o}(?:${bo})*)$`),jo={filename:"",maxDepth:100};function Ao(e,t,i,s,n,a,o){e.events.push({type:Sa,start:t,anchorStart:i,anchorEnd:s,tagStart:n,tagEnd:a,style:o})}function So(e,t,i,s,n,a,o){e.events.push({type:Oa,start:t,anchorStart:i,anchorEnd:s,tagStart:n,tagEnd:a,style:o})}function Oo(e,t){e.events.splice(t.eventsLength,0,{type:Oa,start:t.position,anchorStart:fo,anchorEnd:fo,tagStart:fo,tagEnd:fo,style:Va})}function Co(e,t,i,s,n,a,o,r,l=Ha,c=-1,d=!1){e.events.push({type:Ca,valueStart:t,valueEnd:i,anchorStart:s,anchorEnd:n,tagStart:a,tagEnd:o,style:r,chomping:l,indent:c,fast:d})}function Eo(e){e.events.push({type:Ta})}function To(e){Co(e,fo,fo,fo,fo,fo,fo,Na)}function No(){return{anchorStart:fo,anchorEnd:fo,tagStart:fo,tagEnd:fo}}function Po(e){return{position:e.position,line:e.line,lineStart:e.lineStart,lineIndent:e.lineIndent,firstTabInLine:e.firstTabInLine,eventsLength:e.events.length}}function Lo(e,t){e.position=t.position,e.line=t.line,e.lineStart=t.lineStart,e.lineIndent=t.lineIndent,e.firstTabInLine=t.firstTabInLine,e.events.length=t.eventsLength}function Io(e,t){ja.throwAt(e.input.slice(0,e.length),e.position,t,e.filename)}function Fo(e){return 10===e||13===e}function Mo(e){return 9===e||32===e}function Vo(e){return Mo(e)||Fo(e)}function Ho(e){return 0===e||Vo(e)}function Do(e){return 44===e||91===e||93===e||123===e||125===e}function qo(e){return e>=48&&e<=57?e-48:-1}function Ro(e){if(e>=48&&e<=57)return e-48;const t=32|e;return t>=97&&t<=102?t-97+10:-1}function zo(e){return 120===e?2:117===e?4:85===e?8:0}function Uo(e){return 48===e||97===e||98===e||116===e||9===e||110===e||118===e||102===e||114===e||101===e||32===e||34===e||47===e||92===e||78===e||95===e||76===e||80===e}function Wo(e){10===e.input.charCodeAt(e.position)?e.position++:(e.position++,10===e.input.charCodeAt(e.position)&&e.position++),e.line++,e.lineStart=e.position,e.lineIndent=0,e.firstTabInLine=-1}function Bo(e,t){let i=0,s=e.input.charCodeAt(e.position),n=e.position===e.lineStart||Vo(e.input.charCodeAt(e.position-1));for(;0!==s;){for(;Mo(s);)n=!0,9===s&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),s=e.input.charCodeAt(++e.position);if(t&&n&&35===s)do{s=e.input.charCodeAt(++e.position)}while(!Fo(s)&&0!==s);if(!Fo(s))break;for(Wo(e),i++,n=!0,s=e.input.charCodeAt(e.position);32===s;)e.lineIndent++,s=e.input.charCodeAt(++e.position)}return i}function Ko(e,t=e.position){const i=e.input.charCodeAt(t);if((45===i||46===i)&&i===e.input.charCodeAt(t+1)&&i===e.input.charCodeAt(t+2)){const i=e.input.charCodeAt(t+3);return 0===i||Vo(i)}return!1}function Jo(e){e.position===e.lineStart&&65279===e.input.charCodeAt(e.position)&&(e.position++,e.lineStart=e.position)}function Yo(e){if(e.position!==e.lineStart)return!1;if(Ko(e))return!0;if(65279!==e.input.charCodeAt(e.position))return!1;const t=Po(e);Jo(e),Bo(e,!0);const i=e.input.charCodeAt(e.position),s=e.position===e.lineStart&&(37===i||45===i&&Ko(e));return Lo(e,t),s}function Zo(e){let t=e.input.charCodeAt(e.position);for(;0!==t&&!Fo(t);)t=e.input.charCodeAt(++e.position)}function Go(e,t,i){const s=vo.exec(e.input.slice(t,i));null!==s&&(e.position=t+s.index+s[0].length-1,Io(e,"the stream contains non-printable characters"))}function Qo(e,t,i){if(33!==e.input.charCodeAt(e.position))return!1;t.tagStart!==fo&&Io(e,"duplication of a tag property");const s=e.position;let n=!1,a=!1,o="!",r=e.input.charCodeAt(++e.position);60===r?(n=!0,r=e.input.charCodeAt(++e.position)):33===r&&(a=!0,o="!!",r=e.input.charCodeAt(++e.position));let l,c=e.position;if(n){for(;0!==r&&62!==r;)r=e.input.charCodeAt(++e.position);62!==r&&Io(e,"unexpected end of the stream within a verbatim tag"),l=e.input.slice(c,e.position),e.position++}else{for(;!(0===r||Vo(r)||i&&Do(r));)33===r&&(a?Io(e,"tag suffix cannot contain exclamation marks"):(o=e.input.slice(c-1,e.position+1),yo.test(o)||Io(e,"named tag handle cannot contain such characters"),a=!0,c=e.position+1)),r=e.input.charCodeAt(++e.position);l=e.input.slice(c,e.position),_o.test(l)&&Io(e,"tag suffix cannot contain flow indicator characters")}return l&&!(n?wo.test(l):xo.test(l))&&Io(e,`tag name cannot contain such characters: ${l}`),n||"!"===o||"!!"===o||go.call(e.tagHandlers,o)||Io(e,`undeclared tag handle "${o}"`),t.tagStart=s,t.tagEnd=e.position,!0}function Xo(e,t){if(38!==e.input.charCodeAt(e.position))return!1;t.anchorStart!==fo&&Io(e,"duplication of an anchor property"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!Vo(e.input.charCodeAt(e.position))&&!Do(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&Io(e,"name of an anchor node must contain at least one character"),t.anchorStart=i,t.anchorEnd=e.position,!0}function er(e,t){if(42!==e.input.charCodeAt(e.position))return!1;t.anchorStart===fo&&t.tagStart===fo||Io(e,"alias node should not have any properties"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!Vo(e.input.charCodeAt(e.position))&&!Do(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&Io(e,"name of an alias node must contain at least one character"),function(e,t,i){e.events.push({type:Ea,anchorStart:t,anchorEnd:i})}(e,i,e.position),!0}function tr(e,t){Bo(e,!1),e.lineIndent<t&&Io(e,"deficient indentation")}function ir(e,t,i,s){if(!function(e,t){const i=e.input.charCodeAt(e.position),s=1===t;if(0===i||Vo(i)||35===i||38===i||42===i||33===i||124===i||62===i||39===i||34===i||37===i||64===i||96===i||Do(i))return!1;if(63===i||45===i){const t=e.input.charCodeAt(e.position+1);if(Ho(t)||s&&Do(t))return!1}return!0}(e,i))return!1;const n=e.position;let a=e.position,o=e.input.charCodeAt(e.position);const r=1===i;let l=!1;for(;0!==o&&!Yo(e);){if(58===o){const t=e.input.charCodeAt(e.position+1);if(Ho(t)||r&&Do(t))break}else if(35===o){if(Vo(e.input.charCodeAt(e.position-1)))break}else{if(r&&Do(o))break;if(Fo(o)){const i=e.position,s=e.line,n=e.lineStart,a=e.lineIndent;if(Bo(e,!1),e.lineIndent>=t){l=!0,o=e.input.charCodeAt(e.position);continue}e.position=i,e.line=s,e.lineStart=n,e.lineIndent=a;break}}Mo(o)||(a=e.position+1),o=e.input.charCodeAt(++e.position)}return a!==n&&(Go(e,n,a),Co(e,n,a,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,Na,Ha,-1,!l),!0)}function sr(e,t){const i=e.line;Bo(e,!0),(e.line>i&&e.lineIndent<t||-1!==e.firstTabInLine&&e.lineIndent<t)&&Io(e,"deficient indentation")}function nr(e,t,i){if(-1!==e.firstTabInLine||45!==e.input.charCodeAt(e.position)||!Ho(e.input.charCodeAt(e.position+1)))return!1;for(Ao(e,e.position,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Ma);45===e.input.charCodeAt(e.position)&&Ho(e.input.charCodeAt(e.position+1));){-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,Io(e,"tab characters must not be used in indentation"));const i=e.line;e.position++;const s=Bo(e,!0)>0;if(-1!==e.firstTabInLine&&45===e.input.charCodeAt(e.position)&&Ho(e.input.charCodeAt(e.position+1))&&Io(e,"bad indentation of a sequence entry"),s&&e.lineIndent<=t?To(e):or(e,t,3,!1,!0),Bo(e,!0),e.lineIndent<t||e.position>=e.length)break;e.lineIndent>t&&Io(e,"bad indentation of a sequence entry"),e.line===i&&45===e.input.charCodeAt(e.position)&&Ho(e.input.charCodeAt(e.position+1))&&Io(e,"bad indentation of a sequence entry")}return Eo(e),!0}function ar(e,t,i,s){let n=!1,a=!1,o=!1,r=!1;if(-1!==e.firstTabInLine)return!1;let l=e.input.charCodeAt(e.position);for(;0!==l;){n||-1===e.firstTabInLine||(e.position=e.firstTabInLine,Io(e,"tab characters must not be used in indentation"));const c=e.input.charCodeAt(e.position+1),d=e.line;if(63!==l&&58!==l||!Ho(c)){n&&(To(e),n=!1);const t=Po(e);if(!or(e,i,2,!1,!0))break;if(e.line===d){for(l=e.input.charCodeAt(e.position);Mo(l);)l=e.input.charCodeAt(++e.position);if(58===l)l=e.input.charCodeAt(++e.position),Ho(l)||Io(e,"a whitespace character is expected after the key-value separator within a block mapping"),o||(e.events.splice(t.eventsLength,0,{type:Oa,start:t.position,anchorStart:s.anchorStart,anchorEnd:s.anchorEnd,tagStart:s.tagStart,tagEnd:s.tagEnd,style:Ma}),o=!0),a=!0,n=!1,r=!1;else{if(!a)return s.anchorStart===fo&&s.tagStart===fo||(Lo(e,t),!1);Io(e,"expected ':' after a mapping key")}}else{if(!a)return s.anchorStart===fo&&s.tagStart===fo||(Lo(e,t),!1);Io(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else o||(So(e,e.position,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,Ma),o=!0),63===l?(n&&To(e),a=!0,n=!0):(n||(To(e),a=!0),n=!1),e.position+=1,r=!0;if(or(e,t,4,!0,r)&&(r=!1),n||r&&(To(e),r=!1),Bo(e,!0),l=e.input.charCodeAt(e.position),(e.line===d||e.lineIndent>t)&&0!==l)Io(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return!!a&&(n&&To(e),o&&Eo(e),!0)}function or(e,t,i,s,n,a=!0){e.depth>=e.maxDepth&&Io(e,`nesting exceeded maxDepth (${e.maxDepth})`),e.depth++;let o=1,r=!1,l=!1,c=null;const d=No();let h=4===i||3===i,p=h;const u=h;if(s&&Bo(e,!0)&&(r=!0,o=e.lineIndent>t?1:e.lineIndent===t?0:-1),1===o)for(;;){const s=e.input.charCodeAt(e.position),n=Po(e);if(r&&1!==o&&(33===s||38===s))break;if(r&&u&&(d.tagStart!==fo||d.anchorStart!==fo)&&(33===s||38===s)){const i=Po(e),s=t+1;if(ar(e,e.position-e.lineStart,s,d)&&e.events[i.eventsLength]?.type===Oa)return e.depth--,!0;Lo(e,i)}if(r&&(33===s&&d.tagStart!==fo||38===s&&d.anchorStart!==fo))break;if(!Qo(e,d,1===i)&&!Xo(e,d))break;null===c&&(c=n),Bo(e,!0)?(r=!0,p=u,o=e.lineIndent>t?1:e.lineIndent===t?0:-1):p=!1}if(p&&(p=r||n),1===o||4===i){const s=1===i||2===i?t:t+1,n=e.position-e.lineStart;if(1===o)if(p&&(nr(e,n,d)||ar(e,n,s,d))||function(e,t,i){const s=e.input.charCodeAt(e.position),n=123===s,a=e.position;let o=!0;if(91!==s&&123!==s)return!1;const r=n?125:93;for(n?So(e,a,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Va):Ao(e,a,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Va),e.position++;0!==e.input.charCodeAt(e.position);){sr(e,t);let i=e.input.charCodeAt(e.position);if(i===r)return e.position++,Eo(e),!0;o?44===i&&Io(e,"expected the node content, but found ','"):Io(e,"missed comma between flow collection entries");let s=!1,a=!1;63===i&&Vo(e.input.charCodeAt(e.position+1))&&(s=a=!0,e.position+=1,sr(e,t));const l=e.line,c=Po(e),d=or(e,t,1,!1,!0);sr(e,t),i=e.input.charCodeAt(e.position),(n||a||e.line===l)&&58===i?(s=!0,e.position++,sr(e,t),n||Oo(e,c),d||To(e),or(e,t,1,!1,!0)||To(e),sr(e,t),n||Eo(e)):n&&s?(d||To(e),To(e)):n?To(e):s&&(Oo(e,c),d||To(e),To(e),Eo(e)),i=e.input.charCodeAt(e.position),44===i?(o=!0,e.position++):o=!1}Io(e,"unexpected end of the stream within a flow collection")}(e,s,d))l=!0;else{const t=e.input.charCodeAt(e.position);if(null!==c&&a&&u&&!p&&124!==t&&62!==t){const t=Po(e),i=c.position-c.lineStart;Lo(e,c),ar(e,i,s,No())&&e.events[t.eventsLength]?.type===Oa?l=!0:Lo(e,t)}!l&&(h&&function(e,t,i){const s=e.input.charCodeAt(e.position);let n=Ha,a=-1,o=!1;if(124!==s&&62!==s)return!1;const r=124===s?Ia:Fa;for(e.position++;0!==e.input.charCodeAt(e.position);){const i=e.input.charCodeAt(e.position),s=qo(i);if(43===i||45===i)n!==Ha&&Io(e,"repeat of a chomping mode identifier"),n=43===i?qa:Da,e.position++;else{if(!(s>=0))break;0===s&&Io(e,"bad explicit indentation width of a block scalar; it cannot be less than one"),o&&Io(e,"repeat of an indentation width identifier"),a=t+s-1,o=!0,e.position++}}let l=!1;for(;Mo(e.input.charCodeAt(e.position));)l=!0,e.position++;l&&35===e.input.charCodeAt(e.position)&&Zo(e),Fo(e.input.charCodeAt(e.position))?Wo(e):0!==e.input.charCodeAt(e.position)&&Io(e,"a line break is expected");let c=o?a:-1,d=0;const h=e.position;let p=e.position;for(;0!==e.input.charCodeAt(e.position);){const i=e.position;let s=0;for(;32===e.input.charCodeAt(i+s);)s++;const n=e.input.charCodeAt(i+s);if(0===n){c>=0?s>c&&(p=i+s):s>0&&(p=i+s);break}if(Yo(e))break;if(!o&&-1===c&&Fo(n)&&(d=Math.max(d,s)),o||-1!==c||Fo(n)||(9===n&&s<t&&(e.position=i+s,Io(e,"tab characters must not be used in indentation")),s>=t&&s<d&&(e.position=i+s,Io(e,"bad indentation of a mapping entry"))),-1===c&&0!==n&&!Fo(n)&&s<t){e.lineIndent=s,e.position=i+s;break}o||0===n||Fo(n)||-1!==c||(c=s);const a=-1===c?t+1:c;if(0!==n&&!Fo(n)&&s<a){e.lineIndent=s,e.position=i+s;break}Zo(e),p=e.position,Fo(e.input.charCodeAt(e.position))&&(Wo(e),p=e.position)}return Go(e,h,p),Co(e,h,p,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,r,n,c),!0}(e,s,d)||function(e,t,i){if(39!==e.input.charCodeAt(e.position))return!1;e.position++;const s=e.position;let n=!0;for(;0!==e.input.charCodeAt(e.position);){const a=e.input.charCodeAt(e.position);if(39===a){if(39===e.input.charCodeAt(e.position+1)){n=!1,e.position+=2;continue}const t=e.position;return e.position++,Co(e,s,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Pa,Ha,-1,n),!0}Fo(a)?(n=!1,tr(e,t)):e.position===e.lineStart&&Ko(e)?Io(e,"unexpected end of the document within a single quoted scalar"):9!==a&&a<32?Io(e,"expected valid JSON character"):e.position++}Io(e,"unexpected end of the stream within a single quoted scalar")}(e,s,d)||function(e,t,i){if(34!==e.input.charCodeAt(e.position))return!1;e.position++;const s=e.position;let n=!0;for(;0!==e.input.charCodeAt(e.position);){const a=e.input.charCodeAt(e.position);if(34===a){const t=e.position;return e.position++,Co(e,s,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,La,Ha,-1,n),!0}if(92===a){n=!1;const i=e.input.charCodeAt(++e.position);if(Fo(i))tr(e,t);else if(Uo(i))e.position++;else{let t=zo(i);for(0===t&&Io(e,"unknown escape sequence");t-- >0;)e.position++,Ro(e.input.charCodeAt(e.position))<0&&Io(e,"expected hexadecimal character");e.position++}}else Fo(a)?(n=!1,tr(e,t)):e.position===e.lineStart&&Ko(e)?Io(e,"unexpected end of the document within a double quoted scalar"):9!==a&&a<32?Io(e,"expected valid JSON character"):e.position++}Io(e,"unexpected end of the stream within a double quoted scalar")}(e,s,d)||er(e,d)||ir(e,s,i,d))&&(l=!0)}else 0===o&&(l=p&&nr(e,n,d))}return h=h&&!l,l||d.anchorStart===fo&&d.tagStart===fo&&!h||(Co(e,fo,fo,d.anchorStart,d.anchorEnd,d.tagStart,d.tagEnd,Na),l=!0),e.depth--,l||d.anchorStart!==fo||d.tagStart!==fo}function rr(e){if(e.lineIndent>0||37!==e.input.charCodeAt(e.position))return!1;e.position++;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!Vo(e.input.charCodeAt(e.position));)e.position++;const i=e.input.slice(t,e.position),s=[];for(0===i.length&&Io(e,"directive name must not be less than one character in length");0!==e.input.charCodeAt(e.position)&&!Fo(e.input.charCodeAt(e.position));){for(;Mo(e.input.charCodeAt(e.position));)e.position++;if(35===e.input.charCodeAt(e.position)||Fo(e.input.charCodeAt(e.position))||0===e.input.charCodeAt(e.position))break;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!Vo(e.input.charCodeAt(e.position));)e.position++;s.push(e.input.slice(t,e.position))}if(Fo(e.input.charCodeAt(e.position))&&Wo(e),"YAML"===i){e.directives.some(e=>"yaml"===e.kind)&&Io(e,"duplication of %YAML directive"),1!==s.length&&Io(e,"YAML directive accepts exactly one argument");const t=/^([0-9]+)\.([0-9]+)$/.exec(s[0]);null===t&&Io(e,"ill-formed argument of the YAML directive"),1!==parseInt(t[1],10)&&Io(e,"unacceptable YAML version of the document"),e.directives.push({kind:"yaml",version:s[0]})}else if("TAG"===i){2!==s.length&&Io(e,"TAG directive accepts exactly two arguments");const[t,i]=s;yo.test(t)||Io(e,"ill-formed tag handle (first argument) of the TAG directive"),go.call(e.tagHandlers,t)&&Io(e,`there is a previously declared suffix for "${t}" tag handle`),ko.test(i)||Io(e,"ill-formed tag prefix (second argument) of the TAG directive"),e.tagHandlers[t]=i,e.directives.push({kind:"tag",handle:t,prefix:i})}return!0}function lr(e){e.directives=[],e.tagHandlers=Object.create(null);let t=!1;for(Bo(e,!0);rr(e);)t=!0,Bo(e,!0);let i=!1,s=!1,n=!0;if(0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)&&Ho(e.input.charCodeAt(e.position+3))){i=!0;const t=e.line;e.position+=3,Bo(e,!0),n=e.line>t}else t&&Io(e,"directives end mark is expected");const a=e.events.length;if(!i&&e.position===e.lineStart&&46===e.input.charCodeAt(e.position)&&Ko(e))return e.position+=3,void Bo(e,!0);if(function(e,t,i){e.events.push({type:Aa,explicitStart:t,explicitEnd:i,directives:e.directives})}(e,i,!1),or(e,e.lineIndent-1,4,!1,n,n)||To(e),Bo(e,!0),e.position===e.lineStart&&Ko(e)&&(s=46===e.input.charCodeAt(e.position),s)){const t=e.line;e.position+=3,Bo(e,!0),e.line===t&&e.position<e.length&&Io(e,"end of the stream or a document separator is expected")}const o=e.events[a];o?.type===Aa&&(o.explicitEnd=s),Eo(e),!s&&e.position<e.length&&!Yo(e)&&Io(e,"end of the stream or a document separator is expected")}var cr={...jo,...io};function dr(e,t={}){const i={...cr,...t},s=String(e),n=Object.keys(jo),a=Object.keys(io);return function(e,t){const i={...io,...t,events:e,documents:[],eventIndex:0,position:0,frames:[],anchors:new Map,nodeTags:new Map,tagHandlers:Object.create(null),totalMergeKeys:0,aliasCount:0};for(;i.eventIndex<i.events.length;){const e=i.events[i.eventIndex++];switch(i.position=so(e),e.type){case Aa:i.anchors=new Map,i.nodeTags=new Map,i.aliasCount=0,i.tagHandlers=Object.create(null);for(const t of e.directives)"tag"===t.kind&&(i.tagHandlers[t.handle]=t.prefix);i.frames.push({kind:"document",position:i.position,value:void 0,hasValue:!1});break;case Ca:{const{value:t,tag:s}=oo(i,e);mo(i,e,t,s,!0),uo(i,t,s);break}case Sa:{const t=ro(i,e,"tag:yaml.org,2002:seq"),s=i.schema.lookupSequenceTag(t);s||no(i,`unknown sequence tag !<${t}>`);const n=s.create(t),a=mo(i,e,n,s,s.carrierIsResult);i.frames.push({kind:"sequence",position:i.position,value:n,tag:s,anchor:a,index:0});break}case Oa:{const t=ro(i,e,"tag:yaml.org,2002:map"),s=i.schema.lookupMappingTag(t);s||no(i,`unknown mapping tag !<${t}>`);const n=s.create(t),a=mo(i,e,n,s,s.carrierIsResult);i.frames.push({kind:"mapping",position:i.position,value:n,tag:s,anchor:a,key:void 0,keyPosition:i.position,hasKey:!1,keyIsMerge:!1,overridable:null});break}case Ea:{-1!==i.maxAliases&&++i.aliasCount>i.maxAliases&&no(i,`aliases exceeded maxAliases (${i.maxAliases})`);const t=i.source.slice(e.anchorStart,e.anchorEnd),s=i.anchors.get(t);s||no(i,`unidentified alias "${t}"`),s.isValueFinal||no(i,`recursive alias "${t}" is not supported for tag ${s.tag.tagName} because it uses finalize()`),uo(i,s.value,s.tag);break}case Ta:{const e=i.frames.pop();if("mapping"===e.kind&&e.hasKey&&(i.position=e.keyPosition,no(i,"incomplete mapping pair in event stream")),"document"===e.kind)i.documents.push(e.value);else{const t=e.tag.carrierIsResult?e.value:ao(i,e.position,e.tag,e.value);e.anchor&&(e.anchor.value=t,e.anchor.isValueFinal=!0),uo(i,t,e.tag)}break}}}return i.documents}(function(e,t){const i=e.length,s={...jo,...t,input:`${e}\0`,length:i,position:0,line:0,lineStart:0,lineIndent:0,firstTabInLine:-1,depth:0,directives:[],tagHandlers:Object.create(null),events:[]},n=e.indexOf("\0");for(-1!==n&&ja.throwAt(e,n,"null byte is not allowed in input",s.filename);s.position<s.length&&(Jo(s),Bo(s,!0),!(s.position>=s.length));){const e=s.position;lr(s),s.position===e&&Io(s,"can not read a document")}return s.events}(s,pa(i,n)),{...pa(i,a),source:s})}function hr(e,t){return!!(e&1<<t)}var pr={applyQuoteFlowKeysOption:function(e){if(!e.presenterOptions.quoteFlowKeys)return;if(!e.isKey||!e.flowOnly||e.style!==Na)return;e.style=La},doubleQuoteForInvisibles:function(e){e.style===Na&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(e.node.value)&&(e.style=La)},doubleQuoteWhitespaceOnly:function(e){e.style===Na&&/^\s+$/.test(e.node.value)&&(e.style=La)},applyForceQuotesOption:function(e){if(!e.presenterOptions.forceQuotes)return;if(e.isKey||e.style!==Na)return;if(e.node.tag!==e.presenterOptions.schema.defaultScalarTag.tagName)return;e.style=e.node.value.includes("\n")?La:ur(e)},tryLongOrMultilineAsBlock:function(e){if(e.style!==Na||e.isKey)return;const t=e.node.value,i=-1!==t.indexOf("\n");if(!hr(e.allowedStylesMask,Ia))return void(i&&(e.style=La));const s=e.presenterOptions.lineWidth;if(-1===s)return void(i&&(e.style=Ia));const n=Math.max(Math.min(s,40),s-e.shiftOfContent);let a=0,o=!1;for(;a<=t.length;){let e=t.length;const i=t.indexOf("\n",a);-1!==i&&(e=i);const s=t.slice(a,e);if(s.length>n&&" "!==s[0]&&/ [^ \t]/.test(s)&&(o=!0),-1===i)break;a=i+1}o?e.style=Fa:i&&(e.style=Ia)},quoteInvalidPlain:function(e){e.style!==Na||hr(e.allowedStylesMask,Na)||(e.style=ur(e))},fallbackToDoubleQuoted:function(e){hr(e.allowedStylesMask,e.style)||(e.style=La)}};function ur(e){return"single"===e.presenterOptions.quoteStyle&&hr(e.allowedStylesMask,Pa)?Pa:La}Object.keys(pr).map(e=>Reflect.get(pr,e));const mr="tempus2016/decluttering-card-plus",fr="share-your-templates",gr=`https://github.com/${mr}/discussions/new?category=${fr}`,vr="decluttering-card-plus-community";function _r(e){let t=2e4;const i=e=>(t-=1+Math.ceil(e/16))>=0,s=e=>"string"==typeof e?i(e.length):!!i(0)&&(Array.isArray(e)?e.every(s):!e||"object"!=typeof e||Object.entries(e).every(([e,t])=>i(e.length)&&s(t)));return s(e)}const yr=e=>!!e&&"object"==typeof e&&!Array.isArray(e);function br(e){if(_r(e))return JSON.parse(JSON.stringify(e),(e,t)=>"__proto__"===e?void 0:t)}const $r=/[\p{Cf}\u2800\u3164\u115F\u1160\uFFA0]/gu;function wr(e){if("string"!=typeof e)return;const t=e.replace($r,"").replace(/\s+/g," ").trim();return t?t.length>80?`${t.slice(0,79)}…`:t:void 0}const xr=["card","badge","row","element","group"];function kr(e){if(!yr(e))return{};const t={};for(const[i,s]of Object.entries(e))yr(s)&&xr.some(e=>void 0!==s[e])&&(t[i]=s);return t}function jr(e,t){return"string"==typeof t&&/^https:\/\/github\.com\//.test(t)?t:`https://github.com/${mr}/discussions/${e}`}function Ar(e){var t,i,s,n,a;const o=function(e){if("string"!=typeof e||e.length>65536)return;const t=/^ {0,3}(`{3,}|~{3,})[ \t]*([\w-]*)/,i=[];let s;for(const o of function(e){return e.replace(/<!--[\s\S]*?(?:-->|$)/g,"")}(e).split("\n")){if(s){o.trim()===s.fence?(i.push({lang:s.lang,text:s.lines.join("\n")+"\n"}),s=void 0):s.lines.push(o);continue}const e=t.exec(o);e&&(s={fence:e[1],lang:e[2],lines:[]})}const n=i.find(e=>/^ya?ml$/i.test(e.lang)),a=null!=n?n:i.find(e=>""===e.lang);return null==a?void 0:a.text}(null==e?void 0:e.body);if(!o)return;let r;try{if(r=br(function(e,t){const i=dr(e,t);if(0===i.length)throw new ja("expected a document, but the input is empty");if(1===i.length)return i[0];throw new ja("expected a single document in the stream, but found more")}(o,{maxAliases:50})),void 0===r)return}catch(h){return}if(!Es(r).ok)return;if("number"!=typeof(null==e?void 0:e.number))return;const{template:l,includes:c}=r,d=Ke(r,["template","includes"]);return delete d.type,"string"!=typeof d.description&&delete d.description,{id:e.number,title:null!==(t=wr(e.title))&&void 0!==t?t:l,author:"string"==typeof(null===(i=e.user)||void 0===i?void 0:i.login)?e.user.login:"",url:jr(e.number,e.html_url),name:l.trim(),template:d,includes:kr(c),reactions:"number"==typeof(null===(s=e.reactions)||void 0===s?void 0:s.total_count)?e.reactions.total_count:0,updated:"string"==typeof(null!==(n=e.updated_at)&&void 0!==n?n:e.created_at)?null!==(a=e.updated_at)&&void 0!==a?a:e.created_at:""}}const Sr=["lock","alarm_control_panel","cover","valve","siren","script","automation","button","input_button","water_heater","lawn_mower","update"],Or=["more-info","navigate","none","assist"],Cr=["action","perform_action","service","type"],Er=/\b[a-z][a-z0-9+.-]{1,31}:(?:\/\/)?[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?|\/\/[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?/gi,Tr=[/(?:url|image-set|src)\(\s*['"]?([^'")\s{}]+)/gi,/@import\s+(?:url\(\s*)?['"]?([^'")\s;{}]+)/gi],Nr=/^(?:\/(?!\/)|#|data:)/i,Pr=["image","url","url_path","entity_picture","camera_image","image_url","icon_url","src"],Lr=/\[\[\[|\{\{|\{%|\$\{/,Ir=/^\s*(?:javascript|data|vbscript):/i,Fr=/position\s*:\s*(?:fixed|absolute)/i,Mr=/opacity\s*:\s*0(?:[^.\d]|$)|visibility\s*:\s*hidden|transparent/i,Vr=e=>"string"==typeof e&&Sr.includes(e.split(".")[0]),Hr=e=>e.replace(/\\/g,"/"),Dr="*";function qr(e,t){const i=[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);if(i.length)return i.includes(Dr)?[Dr]:i;const s=[].concat(null!=t?t:[]).filter(e=>"string"==typeof e);if(!s.length)return[Dr];const n=s.map(e=>{const t=e.indexOf("."),i=-1===t?e:e.slice(0,t);return/^[a-z_]+$/.test(i)?i:Dr});return n.includes(Dr)?[Dr]:[...new Set(n)]}function Rr(e,t,i=new Set){var s,n,a,o;if(Array.isArray(e))return e.forEach(e=>Rr(e,t,i)),i;if(!yr(e))return i;const r="string"==typeof e.entity?e.entity:t,l=e.action;if("string"==typeof l&&!Or.includes(l)&&!l.includes("[[")&&"perform-action"!==l&&"call-service"!==l&&"fire-dom-event"!==l&&"url"!==l){const t=[].concat(null!==(o=null!==(a=null!==(n=null===(s=e.target)||void 0===s?void 0:s.entity_id)&&void 0!==n?n:e.entity_id)&&void 0!==a?a:r)&&void 0!==o?o:[]);t.length&&!t.some(e=>"string"!=typeof e||e.includes("[["))||i.add(l)}return Object.values(e).forEach(e=>Rr(e,r,i)),i}function zr(e,t){const i=xr.find(t=>void 0!==e[t]);if(i)try{return c(t,e,e[i],void 0,void 0,!0)}catch(s){return}}function Ur(e){const t=new Set,i=new Set;let s=!1,n=!1,a=!1,o=!1;const r=e=>{const t=Hr(e).trim();!t||Nr.test(t)||t.startsWith("[[")||t.startsWith("{{")||/^[\w.-]+\.[a-z]{2,}(?:[:/?#]|$)/i.test(t)&&i.add(t)},l=new Set,c=(e,i)=>{for(const s of e)if(i.includes(Dr))t.add(`${s} *`);else for(const e of i)Sr.includes(e)&&t.add(`${s} ${e}.*`)},d=(h,p)=>{var u;if("string"==typeof h)return void(e=>{var t;const s=Hr(e);for(const n of null!==(t=s.match(Er))&&void 0!==t?t:[])i.add(n);for(const n of Tr){n.lastIndex=0;let e=n.exec(s);for(;e;)Nr.test(e[1])||i.add(e[1]),e=n.exec(s)}Lr.test(e)&&(n=!0),Fr.test(e)&&Mr.test(e)&&(o=!0)})(h);if(Array.isArray(h))return void h.forEach(e=>d(e,p));if(!yr(h))return;const m="string"==typeof h.entity?h.entity:p;Object.keys(h).some(e=>e.includes("[["))&&(a=!0),Cr.some(e=>"string"==typeof h[e]&&h[e].includes("[["))&&(a=!0),"string"==typeof h.action&&((e,s)=>{var a,o,r,l,c,d;const h=e.action;if("perform-action"===h||"call-service"===h){const i=null!==(a=e.perform_action)&&void 0!==a?a:e.service;return void("string"!=typeof i?t.add("?"):i.includes("[[")||t.add(i))}if("fire-dom-event"===h)return void t.add("fire-dom-event");if("url"===h)return i.add("string"==typeof e.url_path?e.url_path:"?"),void("string"==typeof e.url_path&&Ir.test(e.url_path)&&(n=!0));if(Or.includes(h)||h.includes("[["))return;const p=[].concat(null!==(d=null!==(c=null!==(l=null!==(r=null===(o=e.target)||void 0===o?void 0:o.entity_id)&&void 0!==r?r:e.entity_id)&&void 0!==l?l:e.entity)&&void 0!==c?c:s)&&void 0!==d?d:[]);for(const i of p)Vr(i)&&t.add(`${h} ${i}`)})(h,m),"iframe"!==h.type&&"webpage"!==h.type||(s=!0);for(const e of Pr)"string"==typeof h[e]&&r(h[e]);if("string"==typeof h.type&&Pe.includes(h.type)){const t=(t=>{if("string"==typeof t)return t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0})(h.template);if(t){if(b(h.for_each_from)){const e=h.for_each_from,i=xr.map(e=>t[e]).find(e=>void 0!==e);c(Rr(i,void 0),qr(e.domain,e.entities))}const e=(f=h.variables,Array.isArray(f)?f.filter(yr):yr(f)?Object.entries(f).map(([e,t])=>({[e]:t})):void 0);(null==e?void 0:e.length)&&!l.has(h.template)&&(l.add(h.template),d(zr(t,e),void 0),l.delete(h.template))}}var f;if("custom:auto-entities"===h.type&&yr(h.filter))for(const e of[].concat(null!==(u=h.filter.include)&&void 0!==u?u:[])){if(!yr(e))continue;const t=qr(e.domain,e.entity_id);c(Rr(e.options,void 0),t),c(Rr(h.card,void 0),t)}Object.values(h).forEach(e=>d(e,m))},h=[e.template,...Object.values(e.includes)].map(rs);d(h,void 0);for(const p of h)d(zr(p),void 0);return{actions:[...t].sort(),urls:[...i].sort(),embeds:s,scripts:n,placeholders:a,overlay:o}}function Wr(e){return e.filter(e=>{var t;return(null===(t=null==e?void 0:e.category)||void 0===t?void 0:t.slug)===fr}).map(Ar).filter(e=>!!e).sort((e,t)=>t.reactions-e.reactions||t.updated.localeCompare(e.updated))}class Br extends Error{}function Kr(e){var t;if(!yr(e)||"number"!=typeof e.id||"string"!=typeof e.name)return;if(!yr(e.template))return;const i=br({template:e.template,includes:e.includes});if(!i||!yr(i.template))return;if(!Es(Object.assign({template:e.name},i.template)).ok)return;const s=Object.assign({},i.template);return delete s.type,"string"!=typeof s.description&&delete s.description,{id:e.id,title:null!==(t=wr(e.title))&&void 0!==t?t:e.name,author:"string"==typeof e.author?e.author:"",url:jr(e.id,e.url),name:e.name,template:s,includes:kr(i.includes),reactions:"number"==typeof e.reactions?e.reactions:0,updated:"string"==typeof e.updated?e.updated:""}}async function Jr(e={}){var t,i,s,n;const a=null!==(t=e.fetcher)&&void 0!==t?t:fetch.bind(globalThis),o=null!==(i=e.storage)&&void 0!==i?i:"undefined"==typeof localStorage?void 0:localStorage,r=null!==(s=e.now)&&void 0!==s?s:Date.now(),l=function(e){var t;try{const i=JSON.parse(null!==(t=null==e?void 0:e.getItem(vr))&&void 0!==t?t:"null");if(!i||!Array.isArray(i.entries)||"number"!=typeof i.fetched)return;return{entries:i.entries.map(Kr).filter(e=>!!e),fetched:i.fetched}}catch(i){return}}(o);if(l&&!e.refresh&&r-l.fetched<216e5)return l;const c=[];try{for(let e=1;e<=10;e+=1){const t=await a(`https://api.github.com/repos/${mr}/discussions?per_page=100&page=${e}`,{headers:{Accept:"application/vnd.github+json"}});if(!t.ok){const e=new Br(`GitHub answered ${t.status}`);throw"0"===t.headers.get("x-ratelimit-remaining")&&(e.retryAt=1e3*Number(t.headers.get("x-ratelimit-reset"))||void 0),e}const i=await t.json();if(!Array.isArray(i))break;if(c.push(...i),i.length<100)break}}catch(h){const e=h instanceof Br?h:new Br(null!==(n=null==h?void 0:h.message)&&void 0!==n?n:String(h));throw e.cached=l,e}const d={entries:Wr(c),fetched:r};try{null==o||o.setItem(vr,JSON.stringify(d))}catch(p){}return d}function Yr(e,t){return{discussion:e.id,updated:e.updated,name:t,author:e.author}}function Zr(e,t){return Object.assign(Object.assign({},e),{source:t})}function Gr(e,t){return e.map(({name:e,source:i})=>{var s;const n=t.entries.find(e=>e.id===i.discussion),a="string"==typeof i.name?i.name:void 0,o=n?function(e,t){return void 0===t||t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0}(n,a):void 0;if(!n||!o)return Object.assign({name:e,status:"gone"},n?{entry:n}:{});if("string"!=typeof i.author||!i.author||i.author!==n.author)return{name:e,status:"unverified",entry:n};const r=Date.parse(null!==(s=i.updated)&&void 0!==s?s:""),l=Date.parse(n.updated);return{name:e,status:(Number.isFinite(r)?Number.isFinite(l)&&l>r:Number.isFinite(l))?"update":"current",entry:n,latest:Zr(o,Yr(n,null!=a?a:n.name))}})}function Qr(e){if(""===e)return[];const t=e.split("\n");return""===t[t.length-1]&&t.pop(),t}function Xr(e,t){const i=e=>({kind:"remove",text:e}),s=e=>({kind:"add",text:e});if(!e.length||!t.length||e.length*t.length>4e6)return[...e.map(i),...t.map(s)];const n=e.length,a=t.length,o=Array.from({length:n+1},()=>new Uint32Array(a+1));for(let d=n-1;d>=0;d-=1)for(let i=a-1;i>=0;i-=1)o[d][i]=e[d]===t[i]?o[d+1][i+1]+1:Math.max(o[d+1][i],o[d][i+1]);const r=[];let l=0,c=0;for(;l<n&&c<a;)e[l]===t[c]?(r.push({kind:"same",text:e[l]}),l+=1,c+=1):o[l+1][c]>=o[l][c+1]?(r.push(i(e[l])),l+=1):(r.push(s(t[c])),c+=1);for(;l<n;)r.push(i(e[l++]));for(;c<a;)r.push(s(t[c++]));return r}const el=e`<style>
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
</style>`;function tl(e){return"string"==typeof e?e:void 0===e?"":Y(e)}const il={same:" ",add:"+",remove:"-"};function sl(t,i,s,a=3){const o=function(e,t){const i=Qr(e),s=Qr(t);let n=0;for(;n<i.length&&n<s.length&&i[n]===s[n];)n+=1;let a=i.length,o=s.length;for(;a>n&&o>n&&i[a-1]===s[o-1];)a-=1,o-=1;const r=i.slice(0,n).map(e=>({kind:"same",text:e})),l=i.slice(a).map(e=>({kind:"same",text:e}));return[...r,...Xr(i.slice(n,a),s.slice(n,o)),...l]}(tl(t),tl(i));return function(e){return e.some(e=>"same"!==e.kind)}(o)?e`${el}
    <div class="dcp-diff" role="figure" aria-label=${n("diff.label",void 0,s)}>
      ${function(e,t=3){const i=e.map(e=>"same"!==e.kind),s=new Array(e.length).fill(!1);e.forEach((i,n)=>{if("same"!==i.kind)for(let a=Math.max(0,n-t);a<=Math.min(e.length-1,n+t);a+=1)s[a]=!0});const n=[];let a=0;for(;a<e.length;){if(i[a]||s[a]){n.push(e[a]),a+=1;continue}let t=a;for(;t<e.length&&!i[t]&&!s[t];)t+=1;const o=t-a;1===o?n.push(e[a]):n.push({kind:"skip",count:o}),a=t}return n}(o,a).map(t=>function(t,i){return"skip"===t.kind?e`<div class="skip">${n("diff.skipped",{count:t.count},i)}</div>`:e`<div class=${t.kind}>${il[t.kind]} ${t.text}</div>`}(t,s))}
    </div>`:e`${el}
      <p class="dcp-diff-none">${n("diff.no_change",void 0,s)}</p>`}function nl(t,i,s){var a,o;const r=null!==(a=JSON.stringify(t))&&void 0!==a?a:"",l=null!==(o=JSON.stringify(i))&&void 0!==o?o:"";return e`
    ${sl(t,i,s)}
    <ha-expansion-panel outlined>
      <span slot="header">${n("diff.full",void 0,s)}</span>
      <p class="dcp-diff-none">${n("diff.before",void 0,s)}</p>
      ${gn(r,e`<ha-yaml-editor .hass=${s} .defaultValue=${t} read-only></ha-yaml-editor>`)}
      <p class="dcp-diff-none">${n("diff.after",void 0,s)}</p>
      ${gn(l,e`<ha-yaml-editor .hass=${s} .defaultValue=${i} read-only></ha-yaml-editor>`)}
    </ha-expansion-panel>
  `}const al=["readme","related","setup","requires_entities","requires_homeassistant","requires_card"];class ol extends m{constructor(){super(...arguments),this._importParses=!0,this._importErrors=[],this._importArmedAt=0,this._copyState="",this._busy=!1,this._libraryDestination="view",this._communityLoading=!1,this._communityKnownFailed=!1,this._installArmedAt=0,this._postCopyState="",this._setupValues={},this._updatesLoading=!1,this._updateArmedAt=0,this._trashArmedAt=0}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=G())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:A()}static get styles(){return nn}_fireConfigChanged(e){g(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return sn(this,e,t,i)}render(){return this.hass&&this._config?this._renderShare():e``}async _loadTrash(){this.hass&&(this._trash=await Je(this.hass))}_renderShare(){const{payload:t,notes:i}=Ss(this._config,S(this._savedLovelace));return e`
      <div class="share">
        ${this._renderDetails()}
        <h3>${n("share.export_header",void 0,this.hass)}</h3>
        <p class="hint">${n("share.export_hint",void 0,this.hass)}</p>
        ${i.map(t=>e`<ha-alert alert-type="info">${t}</ha-alert>`)}
        <ha-yaml-editor id="export" .hass=${this.hass} .defaultValue=${t} read-only></ha-yaml-editor>
        <ha-button @click=${this._copyExport}>
          ${"done"===this._copyState?n("share.copied",void 0,this.hass):"failed"===this._copyState?n("share.copy_failed",void 0,this.hass):n("share.copy",void 0,this.hass)}
        </ha-button>
        <ha-button @click=${this._downloadExport}> ${n("share.download",void 0,this.hass)} </ha-button>
        <ha-button @click=${this._copyPost}>
          ${"done"===this._postCopyState?n("share.copied",void 0,this.hass):"failed"===this._postCopyState?n("share.copy_failed",void 0,this.hass):n("share.post_copy",void 0,this.hass)}
        </ha-button>
        <p class="hint">
          ${n("share.post_hint",void 0,this.hass)}
          <a href=${gr} target="_blank" rel="noopener noreferrer"
            >${n("share.post_open",void 0,this.hass)}</a
          >
        </p>

        <h3>${n("share.import_header",void 0,this.hass)}</h3>
        <p class="hint">${n("share.import_hint",void 0,this.hass)}</p>
        <ha-yaml-editor id="import" .hass=${this.hass} @value-changed=${this._importChanged}></ha-yaml-editor>
        <input
          id="import-file"
          type="file"
          accept=".yaml,.yml,.json,text/yaml,application/json"
          hidden
          @change=${this._importFile}
        />
        <ha-button @click=${()=>{var e;return null===(e=this.renderRoot.querySelector("#import-file"))||void 0===e?void 0:e.click()}}>
          ${n("share.import_file",void 0,this.hass)}
        </ha-button>
        ${this._importErrors.map(t=>e`<ha-alert alert-type="error">${t}</ha-alert>`)}
        ${this._renderImportDetails()}
        ${this._importClash?e`<ha-alert alert-type="warning">
                ${n("share.import_clash",{name:this._importClash},this.hass)}
              </ha-alert>`:e``}
        ${this._importRisks?this._renderRisks(this._importRisks,"share.import_risks"):e``}
        <ha-button @click=${this._import}>
          ${n(this._importClash||this._importRisks?"share.import_anyway":"share.import",void 0,this.hass)}
        </ha-button>
        ${this._importClash?e`<ha-button @click=${this._importAsCopy}>
                ${n("share.import_copy",void 0,this.hass)}
              </ha-button>`:e``}
        ${this._renderTrash()}

        <h3>${n("share.library_header",void 0,this.hass)}</h3>
        <p class="hint">${n("share.library_hint",void 0,this.hass)}</p>
        ${this._renderLibrary()}

        <h3>${n("share.community_header",void 0,this.hass)}</h3>
        <p class="hint">${n("share.community_hint",void 0,this.hass)}</p>
        ${this._renderCommunity()} ${this._renderInstalled()}
        ${this._toolError?e`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:e``}
      </div>
    `}_renderDetails(){var t,i,s,a;const o=this._config,r=function(e){const t=e&&"object"==typeof e?e:{},i=t.author&&"object"==typeof t.author&&!Array.isArray(t.author)?t.author:void 0,s=t.requires&&"object"==typeof t.requires&&!Array.isArray(t.requires)?t.requires:{},n={author_name:gs(i?i.name:t.author),author_github:gs(null==i?void 0:i.github),author_email:gs(null==i?void 0:i.email),author_url:gs(null==i?void 0:i.url),license:gs(t.license),help:gs(t.help),homepage:gs(t.homepage),readme:gs(t.readme),related:vs(t.related),setup:vs(t.setup),requires_integrations:vs(s.integrations),requires_entities:vs(s.entities),requires_custom_cards:vs(s.custom_cards),requires_homeassistant:gs(s.homeassistant),requires_card:gs(s.card)};for(const a of Object.keys(n))void 0===n[a]&&delete n[a];return n}(o),l=e=>[...new Set(e)].sort().map(e=>({value:e,label:e})),c=e=>({select:{multiple:!0,custom_value:!0,options:l(e)}}),d=Object.keys(S(this._savedLovelace)).filter(e=>e!==o.template),h=[...C(o).map(e=>e.name),...null!==(t=r.setup)&&void 0!==t?t:[]],p=(Array.isArray(null===(s=null===(i=this.hass)||void 0===i?void 0:i.config)||void 0===s?void 0:s.components)?this.hass.config.components:[]).filter(e=>!e.includes(".")),u=(null!==(a=window.customCards)&&void 0!==a?a:[]).map(e=>e.type).filter(e=>"string"==typeof e),m=(e,t)=>({name:e,selector:t}),f=[m("author_name",{text:{}}),m("author_github",{text:{}}),m("author_email",{text:{}}),m("author_url",{text:{type:"url"}}),m("license",{text:{}}),m("help",{text:{type:"url"}}),m("homepage",{text:{type:"url"}}),m("readme",{text:{multiline:!0}}),m("related",c(d)),m("setup",c(h)),m("requires_integrations",c(p)),m("requires_entities",c([])),m("requires_custom_cards",c(u)),m("requires_homeassistant",{text:{}}),m("requires_card",{text:{}})];return e`
      <ha-expansion-panel outlined class="details">
        <span slot="header">${n("share.details_header",void 0,this.hass)}</span>
        <p class="hint">${n("share.details_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${r}
          .schema=${f}
          .computeLabel=${e=>n(`share.details_${e.name}`,void 0,this.hass)}
          .computeHelper=${e=>al.includes(e.name)?n(`share.details_${e.name}_helper`,void 0,this.hass):""}
          @value-changed=${this._detailsChanged}
        ></ha-form>
      </ha-expansion-panel>
    `}_detailsChanged(e){if(e.stopPropagation(),!this._config)return;const t=function(e,t){var i;const s=Object.assign({},e),n=(e,t)=>{void 0===t||Array.isArray(t)&&!t.length?delete s[e]:s[e]=t},a={},o=_s(t.author_name);o&&(a.name=o);for(const d of["github","email","url"]){const e=_s(t[`author_${d}`]);e&&(a[d]=e)}const r=e.author&&"object"==typeof e.author&&!Array.isArray(e.author)?e.author:{};for(const[d,h]of Object.entries(r))["name","github","email","url"].includes(d)||(a[d]=h);const l=Object.keys(a);n("author",l.length?1===l.length&&o?o:a:void 0);for(const d of["license","help","homepage"])n(d,_s(t[d]));n("readme","string"==typeof t.readme&&t.readme.trim()?t.readme:void 0),n("related",ys(t.related)),n("setup",ys(t.setup));const c=e.requires&&"object"==typeof e.requires&&!Array.isArray(e.requires)?Object.assign({},e.requires):{};for(const[d,h]of Object.entries(fs)){const e=[].concat(null!==(i=c[d])&&void 0!==i?i:[]).filter(e=>"string"!=typeof e),s=[...ys(t[h]),...e];s.length?c[d]=s:delete c[d]}for(const d of["homeassistant","card"]){const e=_s(t[`requires_${d}`]);e?c[d]=e:delete c[d]}return n("requires",Object.keys(c).length?c:void 0),s}(this._config,e.detail.value);this._fireConfigChanged(t)}_renderCommunity(){const t=this._community,i=e`
      ${this._communityError?e`<ha-alert alert-type="warning">${this._communityError}</ha-alert>`:e``}
      ${this._communityError&&t?e`<p class="hint">
              ${n("share.community_showing_cached",{time:(e=>{var t,i;return new Date(e).toLocaleString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)})(t.fetched)},this.hass)}
            </p>`:e``}
    `;if(!t)return e`
        <div class="library">
          ${i}
          <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!1)}}>
            ${n(this._communityLoading?"share.community_loading":"share.community_load",void 0,this.hass)}
          </ha-button>
        </div>
      `;const s=this._communityExisting(),a=t.entries.find(e=>e.id===this._communitySelected),o=a?`community:${a.id}:${a.updated}`:"",r=!!a&&this._installPending===o,l=a&&s.includes(a.name)?Cs(a.name,s):void 0,c=a?function(e,t){const i=new Set,s=new Set;for(const n of[e.template,...Object.values(e.includes)]){const e=ks(n);e.customTypes.forEach(e=>i.add(e)),e.templateRefs.forEach(e=>s.add(e))}return{customTypes:[...i].sort(),templates:[...s].filter(i=>i!==e.name&&!(i in e.includes)&&!t.includes(i)).sort()}}(a,s):void 0,d=a?Object.keys(a.includes).filter(e=>!s.includes(e)):[],h=a?Ur(a):void 0,p=void 0!==this._communityKnown;return e`
      <div class="library">
        ${i}
        ${t.entries.length?e`<ha-form
                .hass=${this.hass}
                .data=${{entry:a?String(a.id):""}}
                .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:t.entries.map(e=>({value:String(e.id),label:n("share.community_by",{title:e.title,author:e.author},this.hass)}))}}}]}
                .computeLabel=${()=>n("share.community_pick",void 0,this.hass)}
                @value-changed=${this._communityPicked}
              ></ha-form>`:e`<p class="hint">${n("share.community_none",void 0,this.hass)}</p>`}
        ${a&&c?e`
                <p class="hint">
                  ${"string"==typeof a.template.description?a.template.description:""}
                  <a href=${a.url} target="_blank" rel="noopener noreferrer"
                    >${n("share.community_open",void 0,this.hass)}</a
                  >
                </p>
                ${this._renderAbout(a.template)}
                ${d.length?e`<p class="hint">
                        ${n("share.library_needs",{names:d.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderUnmet([a.template,...Object.values(a.includes)])}
                ${this._renderMissingCards([a.template,...Object.values(a.includes)])}
                ${c.templates.length?e`<ha-alert alert-type="warning">
                        ${n("share.community_needs_templates",{names:c.templates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
                ${h&&Qs(h)?this._renderRisks(h,"share.community_risks"):e``}
                ${this._renderSetup([a.template,...Object.values(a.includes)])}
                <ha-expansion-panel outlined expanded>
                  <span slot="header">${n("share.library_preview",void 0,this.hass)}</span>
                  ${gn(`${a.id}:${a.updated}`,e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${Object.assign(Object.assign({template:a.name},a.template),Object.keys(a.includes).length?{includes:a.includes}:{})}
                      read-only
                    ></ha-yaml-editor>`)}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{where:this._libraryDestination}}
                  .schema=${[{name:"where",selector:{select:{mode:"dropdown",options:[{value:"view",label:n("share.library_where_view",void 0,this.hass)},{value:"root",label:n("share.library_where_root",void 0,this.hass)}]}}}]}
                  .computeLabel=${()=>n("share.library_where",void 0,this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                ${this._communityKnownFailed?e`<ha-alert alert-type="error">
                        ${n("share.community_names_failed",void 0,this.hass)}
                      </ha-alert>`:e``}
                <ha-button .disabled=${this._busy||!p} @click=${()=>{this._installShared(a)}}>
                  ${p||this._communityKnownFailed?r?n("share.install_anyway",void 0,this.hass):l?n("share.community_install_as",{name:l},this.hass):n("share.install",void 0,this.hass):n("share.community_names_loading",void 0,this.hass)}
                </ha-button>
              `:e``}
        <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!0)}}>
          ${n(this._communityLoading?"share.community_loading":"share.community_refresh",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderAbout(t){var i,s,a;const o=as(t),r=(l=o.author)?[l.name,l.github?`@${l.github}`:void 0,l.email].filter(Boolean).join(" · "):"";var l;const c=null!==(s=null===(i=o.author)||void 0===i?void 0:i.url)&&void 0!==s?s:(null===(a=o.author)||void 0===a?void 0:a.github)?`https://github.com/${o.author.github}`:void 0,d=[o.help?{url:o.help,label:n("share.about_help",void 0,this.hass)}:void 0,o.homepage?{url:o.homepage,label:n("share.about_homepage",void 0,this.hass)}:void 0].filter(e=>!!e);return r||o.license||d.length||o.readme?e`
      ${r||o.license||d.length?e`<p class="hint about">
              ${r?e`<span
                      >${n("share.about_author",void 0,this.hass)}
                      ${c?e`<a href=${c} target="_blank" rel="noopener noreferrer">${r}</a>`:r}</span
                    >`:e``}
              ${o.license?e`<span>${n("share.about_license",{license:o.license},this.hass)}</span>`:e``}
              ${d.map(t=>e`<a href=${t.url} target="_blank" rel="noopener noreferrer">${t.label}</a>`)}
            </p>`:e``}
      ${o.readme?e`<ha-expansion-panel outlined>
              <span slot="header">${n("share.about_readme",void 0,this.hass)}</span>
              <ha-markdown class="readme" .content=${o.readme}></ha-markdown>
            </ha-expansion-panel>`:e``}
    `:e``}_renderUnmet(t){const i=t.filter(e=>void 0!==e),s=new Set(Ts(i,Gs)),a=function(e,t){const i=new Set,s=[];for(const n of e)for(const e of ds(n)){const n=`${e.kind}:${e.any.join("|")}`;if(i.has(n))continue;if(i.add(n),ps(e,t))continue;const a="homeassistant"===e.kind?t.homeassistant:"card"===e.kind?t.card:void 0;s.push(a?Object.assign(Object.assign({},e),{have:a}):e)}return s}(i,(o=this.hass,r=nt,l=Gs,{components:Array.isArray(null===(c=null==o?void 0:o.config)||void 0===c?void 0:c.components)?o.config.components:[],entities:Object.keys(null!==(d=null==o?void 0:o.states)&&void 0!==d?d:{}),homeassistant:"string"==typeof(null===(h=null==o?void 0:o.config)||void 0===h?void 0:h.version)?o.config.version:void 0,card:r,isDefined:l})).filter(e=>!("custom_card"===e.kind&&!e.message&&e.any.every(e=>s.has(e))));var o,r,l,c,d,h;return a.length?e`<ha-alert alert-type="warning" .title=${n("share.requires_header",void 0,this.hass)}>
      <ul class="risks">
        ${a.map(t=>e`<li>${this._unmetLine(t)}</li>`)}
      </ul>
      ${n("share.requires_hint",void 0,this.hass)}
    </ha-alert>`:e``}_unmetLine(e){var t;const i=n("share.requires_or",void 0,this.hass),s=n(`share.requires_${e.kind}`,{names:e.any.join(i),want:e.any[0],have:null!==(t=e.have)&&void 0!==t?t:"?"},this.hass);return e.message?`${s}: ${e.message}`:s}_renderSetup(t){const i=t.filter(e=>void 0!==e),s=function(e){const t=[];for(const i of e)for(const e of as(i).setup)t.includes(e)||t.push(e);return t}(i);if(!s.length)return e``;const a=e=>{if(e in this._setupValues)return this._setupValues[e];for(const t of i){const i=us(t,e);if(void 0!==i)return i}return""};return e`
      <h4>${n("share.setup_header",void 0,this.hass)}</h4>
      <p class="hint">${n("share.setup_hint",void 0,this.hass)}</p>
      <ha-form
        .hass=${this.hass}
        .data=${s.reduce((e,t)=>Object.assign(Object.assign({},e),{[t]:a(t)}),{})}
        .schema=${s.map(e=>({name:e,selector:{text:{}}}))}
        .computeLabel=${e=>e.name}
        @value-changed=${this._setupChanged}
      ></ha-form>
    `}_setupChanged(e){var t;e.stopPropagation();const i={};for(const[s,n]of Object.entries(null!==(t=e.detail.value)&&void 0!==t?t:{}))i[s]=null==n?"":String(n);this._setupValues=i}_keptSetup(e){const t={};for(const i of as(e).setup){const s=us(e,i);void 0!==s&&(t[i]=s)}return t}_renderRisks(t,i){return e`<ha-alert alert-type="warning" .title=${n(i,void 0,this.hass)}>
      <ul class="risks">
        ${t.actions.length?e`<li>${n("share.community_risk_actions",{list:t.actions.join(", ")},this.hass)}</li>`:e``}
        ${t.urls.length?e`<li>${n("share.community_risk_urls",{list:t.urls.join(", ")},this.hass)}</li>`:e``}
        ${t.embeds?e`<li>${n("share.community_risk_embeds",void 0,this.hass)}</li>`:e``}
        ${t.scripts?e`<li>${n("share.community_risk_scripts",void 0,this.hass)}</li>`:e``}
        ${t.placeholders?e`<li>${n("share.community_risk_placeholders",void 0,this.hass)}</li>`:e``}
        ${t.overlay?e`<li>${n("share.community_risk_overlay",void 0,this.hass)}</li>`:e``}
      </ul>
    </ha-alert>`}async _loadCommunity(e){var t,i;this._communityLoading=!0,this._communityError=void 0,this._installPending=void 0,this._communityKnown=void 0,this._communityKnownFailed=!1;try{this._community=await Jr({refresh:e})}catch(s){const e=s;e.cached&&(this._community=e.cached),this._communityError=e.retryAt?n("share.community_rate_limited",{time:new Date(e.retryAt).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)},this.hass):n("share.community_failed",{message:e.message},this.hass)}finally{this._communityLoading=!1}this._community&&this._loadCommunityKnown()}_communityExisting(){var e;const t=Object.keys(S(this._savedLovelace));return[...new Set([...t,...null!==(e=this._communityKnown)&&void 0!==e?e:[]])]}async _loadCommunityKnown(){try{const e=await Se(this.hass,this._savedLovelace);this._communityKnown=Object.keys(e)}catch(e){this._communityKnownFailed=!0}}_communityPicked(e){e.stopPropagation();const t=Number(e.detail.value.entry);this._communitySelected=Number.isFinite(t)&&t>0?t:void 0,this._installPending=void 0,this._setupValues={}}async _installShared(e){var t,i,s,n,a;if(void 0===this._communityKnown)return;const o=`community:${e.id}:${e.updated}`;if(this._installPending!==o)return this._installPending=o,void(this._installArmedAt=Date.now());if(Date.now()-this._installArmedAt<Xs)return;const r=G(),l=this._communityExisting(),c=l.includes(e.name)?Cs(e.name,l):e.name,d=[...Object.entries(e.includes).filter(([e])=>!l.includes(e)).map(([t,i])=>[t,Zr(ms(i,this._setupValues),Yr(e,t))]),[c,Zr(ms(e.template,this._setupValues),Yr(e,e.name))]],h=ne(null!==(t=null==r?void 0:r.config)&&void 0!==t?t:this.lovelace,null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""),p=null!==(a=null===(n=null==h?void 0:h.view)||void 0===n?void 0:n.index)&&void 0!==a?a:0;await this._saveDashboard(e=>d.reduce((e,[t,i])=>"root"===this._libraryDestination?Ye(e,t,i):Ze(e,p,Object.assign({type:Te,template:t},i,{type:Te,template:t})),e),"community_install")&&(this._installPending=void 0,this._setupValues={})}_renderMissingCards(t){const i=Ts(t.filter(e=>void 0!==e),Gs);return i.length?e`<ha-alert alert-type="warning">
      ${n(1===i.length?"share.missing_card_one":"share.missing_card_many",{cards:i.join(", ")},this.hass)}
    </ha-alert>`:e``}_renderInstalled(){var t;const i=Ge(this._savedLovelace);if(!i.length)return e``;const s=new Map((null!==(t=this._updates)&&void 0!==t?t:[]).map(e=>[e.name,e]));return e`
      <h3>${n("share.installed_header",void 0,this.hass)}</h3>
      <p class="hint">${n("share.installed_hint",void 0,this.hass)}</p>
      ${this._updatesError?e`<ha-alert alert-type="warning">${this._updatesError}</ha-alert>`:e``}
      <ul class="installed">
        ${i.map(({name:t,source:i,template:a})=>{var o,r;const l=s.get(t);return e`<li>
            ${t} —
            <a
              href=${null!==(r=null===(o=null==l?void 0:l.entry)||void 0===o?void 0:o.url)&&void 0!==r?r:`https://github.com/${mr}/discussions/${i.discussion}`}
              target="_blank"
              rel="noopener noreferrer"
              >${n("share.installed_from",{discussion:i.discussion},this.hass)}</a
            >
            ${l?e`<span class="status"
                    >${n(`share.installed_status_${l.status}`,void 0,this.hass)}</span
                  >`:e``}
            ${"update"===(null==l?void 0:l.status)&&l.latest?this._renderUpdate(t,a,l):e``}
          </li>`})}
      </ul>
      <ha-button .disabled=${this._updatesLoading} @click=${()=>{this._checkUpdates()}}>
        ${n(this._updatesLoading?"share.community_loading":"share.installed_check",void 0,this.hass)}
      </ha-button>
    `}_renderUpdate(t,i,s){const a=ms(s.latest,this._keptSetup(i)),o=e=>{const t=Object.assign({},e);return delete t.source,delete t.type,delete t.template,t},r=o(i),l=o(a),c=Ur({template:l,includes:{}}),d=function(e,t){return{actions:e.actions.filter(e=>!t.actions.includes(e)),urls:e.urls.filter(e=>!t.urls.includes(e)),embeds:e.embeds&&!t.embeds,scripts:e.scripts&&!t.scripts,placeholders:e.placeholders&&!t.placeholders,overlay:e.overlay&&!t.overlay}}(c,Ur({template:r,includes:{}})),h=this._updatePending===t;return e`
      <p class="hint">${n("share.installed_compare",void 0,this.hass)}</p>
      ${nl(r,l,this.hass)} ${this._renderMissingCards([a])} ${this._renderUnmet([a])}
      ${Qs(d)?this._renderRisks(d,"share.installed_risks_new"):Qs(c)?this._renderRisks(c,"share.installed_risks"):e``}
      ${h?e`<ha-alert alert-type="warning">
              ${n("share.installed_update_confirm",{name:t},this.hass)}
            </ha-alert>`:e``}
      <ha-button .disabled=${this._busy} @click=${()=>{this._updateShared(t,a)}}>
        ${n(h?"share.installed_update_anyway":"share.installed_update",void 0,this.hass)}
      </ha-button>
    `}async _checkUpdates(){var e,t;this._updatesLoading=!0,this._updatesError=void 0,this._updatePending=void 0;const i=Ge(this._savedLovelace);try{this._updates=Gr(i,await Jr({refresh:!0}))}catch(s){const i=s;this._updatesError=i.retryAt?n("share.community_rate_limited",{time:new Date(i.retryAt).toLocaleTimeString(null===(t=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===t?void 0:t.language)},this.hass):n("share.community_failed",{message:i.message},this.hass)}finally{this._updatesLoading=!1}}async _updateShared(e,t){var i,s;if(this._updatePending!==e)return this._updatePending=e,void(this._updateArmedAt=Date.now());if(Date.now()-this._updateArmedAt<Xs)return;await this._saveDashboard(i=>Qe(i,e,t),"shared_update")&&(this._updatePending=void 0,this._updates=null===(i=this._updates)||void 0===i?void 0:i.map(t=>t.name===e?Object.assign(Object.assign({},t),{status:"current"}):t),(null===(s=this._config)||void 0===s?void 0:s.template)===e&&this._fireConfigChanged(Object.assign(Object.assign({},t),{type:this._config.type,template:e})))}_renderLibrary(){var t;const i=Object.keys(S(this._savedLovelace)),s=this._librarySelected?_n(this._librarySelected):void 0,a=!!s&&i.includes(s.name),o=!!s&&this._installPending===s.name,r=s?yn(s,i):[];return e`
      <div class="library">
        <ha-form
          .hass=${this.hass}
          .data=${{entry:null!==(t=this._librarySelected)&&void 0!==t?t:""}}
          .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:vn.map(e=>({value:e.name,label:e.name}))}}}]}
          .computeLabel=${()=>n("share.library_pick",void 0,this.hass)}
          @value-changed=${this._libraryPicked}
        ></ha-form>
        ${s?e`
                <p class="hint">${n(`library.${s.name}.summary`,void 0,this.hass)}</p>
                ${r.length?e`<p class="hint">
                        ${n("share.library_needs",{names:r.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderMissingCards([s,...r.map(e=>_n(e))].map(e=>null==e?void 0:e.template))}
                <ha-expansion-panel outlined>
                  <span slot="header">${n("share.library_preview",void 0,this.hass)}</span>
                  ${gn(s.name,e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${s.template}
                      read-only
                    ></ha-yaml-editor>`)}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{where:this._libraryDestination}}
                  .schema=${[{name:"where",selector:{select:{mode:"dropdown",options:[{value:"view",label:n("share.library_where_view",void 0,this.hass)},{value:"root",label:n("share.library_where_root",void 0,this.hass)}]}}}]}
                  .computeLabel=${()=>n("share.library_where",void 0,this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                <ha-button .disabled=${this._busy||a} @click=${()=>{this._install(s.name)}}>
                  ${n(a?"share.already_here":o?"share.install_anyway":"share.install",void 0,this.hass)}
                </ha-button>
              `:e``}
      </div>
    `}_libraryDestinationPicked(e){e.stopPropagation();const t=e.detail.value.where;this._libraryDestination="root"===t?"root":"view"}_libraryPicked(e){e.stopPropagation(),this._librarySelected=e.detail.value.entry||void 0,this._installPending=void 0}async _install(e){var t,i,s,n,a,o;const r=_n(e);if(!r)return;if(this._installPending!==e)return void(this._installPending=e);const l=G(),c=Object.keys(S(null!==(t=null==l?void 0:l.config)&&void 0!==t?t:this._savedLovelace)),d=[...yn(r,c),r.name].filter(e=>!c.includes(e)),h=ne(null!==(i=null==l?void 0:l.config)&&void 0!==i?i:this.lovelace,null!==(n=null===(s=this._config)||void 0===s?void 0:s.template)&&void 0!==n?n:""),p=null!==(o=null===(a=null==h?void 0:h.view)||void 0===a?void 0:a.index)&&void 0!==o?o:0;await this._saveDashboard(e=>d.reduce((e,t)=>{const i=_n(t);if(!i)return e;const s=Object.assign(Object.assign({},i.template),{source:bn(i.name,nt)});return"root"===this._libraryDestination?Ye(e,i.name,s):Ze(e,p,Object.assign({type:Te,template:i.name},s))},e),"library_install")&&(this._installPending=void 0)}async _copyExport(){const e=this.renderRoot.querySelector("#export"),t=null==e?void 0:e.yaml;if(!t)return;const{notes:i}=Ss(this._config),s=[...i.map(e=>`# ${e}`),t].join("\n");this._copyState=await Z(s)?"done":"failed",setTimeout(()=>this._copyState="",3e3)}async _copyPost(){var e,t;const i=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!i)return;const{notes:s}=Ss(this._config,S(this._savedLovelace));this._postCopyState=await Z(function(e,t,i){return[...[i,...t].filter(e=>"string"==typeof e&&e.trim()),"```yaml\n"+e.replace(/\n*$/,"")+"\n```"].join("\n\n")+"\n"}(i,s,null===(t=this._config)||void 0===t?void 0:t.description))?"done":"failed",setTimeout(()=>this._postCopyState="",3e3)}_downloadExport(){var e,t,i;const s=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!s)return;const{notes:n}=Ss(this._config),a=[...n.map(e=>`# ${e}`),s].join("\n"),o=document.createElement("a");o.href=URL.createObjectURL(new Blob([a],{type:"text/yaml"})),o.download=`${(null!==(i=null===(t=this._config)||void 0===t?void 0:t.template)&&void 0!==i?i:"template").replace(/[^\w-]+/g,"_")}.yaml`,o.click(),setTimeout(()=>URL.revokeObjectURL(o.href),1e3)}async _importFile(e){var t,i,s;const a=e.target,o=null===(t=a.files)||void 0===t?void 0:t[0];if(a.value="",!o)return;const r=await o.text(),l=null===(s=null===(i=this.renderRoot.querySelector("#import"))||void 0===i?void 0:i.shadowRoot)||void 0===s?void 0:s.querySelector("ha-code-editor");l?(l.value=r,l.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r}}))):this._importErrors=[n("share.import_not_yaml",void 0,this.hass)]}_renderTrash(){if(void 0===this._trash)return this._loadTrash(),e``;const t=e=>{var t,i;return new Date(e).toLocaleString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)};return e`
      <h3>${n("share.trash_header",void 0,this.hass)}</h3>
      <p class="hint">${n("share.trash_hint",void 0,this.hass)}</p>
      ${this._trash.length?e`<ul class="installed trash">
              ${this._trash.map((i,s)=>e`
                  <li>
                    <strong>${i.name}</strong>
                    <div class="status">
                      ${n("removed"===i.reason?"share.trash_removed":"share.trash_replaced",{when:t(i.at),dashboard:i.dashboard},this.hass)}
                    </div>
                    ${this._trashPending===s?e`<ha-alert alert-type="warning">
                            ${n("share.trash_clash",{name:i.name},this.hass)}
                          </ha-alert>`:e``}
                    <ha-button .disabled=${this._busy} @click=${()=>this._restore(i,s)}>
                      ${n(this._trashPending===s?"share.trash_restore_anyway":"share.trash_restore",void 0,this.hass)}
                    </ha-button>
                    <ha-button
                      @click=${()=>{this._trashShown=this._trashShown===s?void 0:s}}
                    >
                      ${n(this._trashShown===s?"share.trash_hide":"share.trash_show",void 0,this.hass)}
                    </ha-button>
                    <ha-button .disabled=${this._busy} @click=${()=>this._forget(i)}>
                      ${n("share.trash_forget",void 0,this.hass)}
                    </ha-button>
                    ${this._trashShown===s?e`<ha-yaml-editor
                            .hass=${this.hass}
                            .defaultValue=${i.template}
                            read-only
                          ></ha-yaml-editor>`:e``}
                  </li>
                `)}
            </ul>`:e`<p class="hint">${n("share.trash_empty",void 0,this.hass)}</p>`}
    `}async _restore(e,t){var i,s;if(!this.hass)return;const a=Xe(this.hass);let o;try{o=await et(a,e.dashboard)}catch(l){return void(this._toolError=n("tools.save_failed",{message:null!==(i=null==l?void 0:l.message)&&void 0!==i?i:l},this.hass))}const r=e.name in S(o);if(r&&this._trashPending!==t)return this._trashPending=t,void(this._trashArmedAt=Date.now());if(!(r&&Date.now()-this._trashArmedAt<Xs)){this._busy=!0,this._toolError=void 0;try{await X(this,this.hass,"restore",[{urlPath:e.dashboard,build:t=>tt(t,e)}]),this._trashPending=void 0,this._trashShown=void 0,await this._forget(e)}catch(l){this._toolError=n("tools.save_failed",{message:null!==(s=null==l?void 0:l.message)&&void 0!==s?s:l},this.hass)}finally{this._busy=!1}}}async _forget(e){if(!this.hass)return;const t=it(await Je(this.hass),e);await st(this.hass,t),this._trash=t,this._trashPending=void 0}_renderImportDetails(){const t=this._importValue;if(!this._importParses||!t||"object"!=typeof t||Array.isArray(t))return e``;if(!_r(t))return e``;const i=[t,...t.includes&&"object"==typeof t.includes&&!Array.isArray(t.includes)?Object.values(t.includes):[]];return e`${this._renderAbout(t)} ${this._renderUnmet(i)} ${this._renderSetup(i)}`}_importChanged(e){e.stopPropagation(),this._importValue=e.detail.value,this._importParses=!1!==e.detail.isValid,this._importErrors=[],this._importClash=void 0,this._importRisks=void 0,this._setupValues={}}_import(){if(!this._config)return;if(!this._importParses)return void(this._importErrors=[n("share.import_not_yaml",void 0,this.hass)]);if(!_r(this._importValue))return void(this._importErrors=[n("share.import_too_big",void 0,this.hass)]);const e=Es(this._importValue);if(!e.ok)return this._importErrors=e.errors,void(this._importClash=void 0);this._importErrors=[];const t=this._importValue.template,i=S(this._savedLovelace),s=t!==this._config.template&&t in i?t:void 0,a=Ur({template:this._importValue,includes:{}});if(s&&!this._importClash||Qs(a)&&!this._importRisks)return this._importClash=s,this._importRisks=Qs(a)?a:void 0,void(this._importArmedAt=Date.now());Date.now()-this._importArmedAt<Xs||this._applyImport(t)}_importAsCopy(){if(!this._config||!this._importParses)return;if(Date.now()-this._importArmedAt<Xs)return;const e=Object.keys(S(this._savedLovelace));this._applyImport(Cs(this._importValue.template,e))}_applyImport(e){var t;const i=function(e){const t=Os(e);if((null==t?void 0:t.includes)&&"object"==typeof t.includes&&!Array.isArray(t.includes)){const e={};for(const[i,s]of Object.entries(t.includes))e[i]=Os(s);t.includes=e}return t}(this._importValue),s=ms(i,this._setupValues);s.includes&&"object"==typeof s.includes&&!Array.isArray(s.includes)&&(s.includes=Object.entries(s.includes).reduce((e,[t,i])=>Object.assign(Object.assign({},e),{[t]:i&&"object"==typeof i&&!Array.isArray(i)?ms(i,this._setupValues):i}),{}));const n=s.includes;if(n&&"object"==typeof n&&!Array.isArray(n)){const e=Object.keys(S(this._savedLovelace)),t=Object.entries(n).filter(([t])=>!e.includes(t));t.length&&this._saveDashboard(e=>t.reduce((e,[t,i])=>Ye(e,t,i),e),"import",this._config)}const a=Object.assign(Object.assign({},s),{template:e,type:null===(t=this._config)||void 0===t?void 0:t.type});delete a.includes,this._fireConfigChanged(a),this._importClash=void 0,this._importRisks=void 0,this._setupValues={},this.dispatchEvent(new CustomEvent("select-tab",{detail:"settings",bubbles:!0,composed:!0}))}}h([p({attribute:!1})],ol.prototype,"hass",void 0),h([p({attribute:!1})],ol.prototype,"lovelace",void 0),h([p({attribute:!1})],ol.prototype,"config",void 0),h([u()],ol.prototype,"_importErrors",void 0),h([u()],ol.prototype,"_importClash",void 0),h([u()],ol.prototype,"_importRisks",void 0),h([u()],ol.prototype,"_copyState",void 0),h([u()],ol.prototype,"_toolError",void 0),h([u()],ol.prototype,"_busy",void 0),h([u()],ol.prototype,"_installPending",void 0),h([u()],ol.prototype,"_librarySelected",void 0),h([u()],ol.prototype,"_libraryDestination",void 0),h([u()],ol.prototype,"_community",void 0),h([u()],ol.prototype,"_communityLoading",void 0),h([u()],ol.prototype,"_communityError",void 0),h([u()],ol.prototype,"_communitySelected",void 0),h([u()],ol.prototype,"_communityKnown",void 0),h([u()],ol.prototype,"_communityKnownFailed",void 0),h([u()],ol.prototype,"_postCopyState",void 0),h([u()],ol.prototype,"_setupValues",void 0),h([u()],ol.prototype,"_updates",void 0),h([u()],ol.prototype,"_updatesLoading",void 0),h([u()],ol.prototype,"_updatesError",void 0),h([u()],ol.prototype,"_updatePending",void 0),h([u()],ol.prototype,"_trash",void 0),h([u()],ol.prototype,"_trashShown",void 0),h([u()],ol.prototype,"_trashPending",void 0),customElements.get("decluttering-template-share-tab")||customElements.define("decluttering-template-share-tab",ol)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;const rl=(e,t,i)=>{const s=new Map;for(let n=t;n<=i;n++)s.set(e[n],n);return s},ll=on(class extends rn{constructor(e){if(super(e),e.type!==an)throw Error("repeat() can only be used in text expressions")}dt(e,t,i){let s;void 0===i?i=t:void 0!==t&&(s=t);const n=[],a=[];let o=0;for(const r of e)n[o]=s?s(r,o):o,a[o]=i(r,o),o++;return{values:a,keys:n}}render(e,t,i){return this.dt(e,t,i).values}update(e,[t,i,s]){const n=(e=>e._$AH)(e),{values:a,keys:o}=this.dt(t,i,s);if(!Array.isArray(n))return this.ut=o,a;const r=this.ut??=[],l=[];let c,d,h=0,p=n.length-1,u=0,m=a.length-1;for(;h<=p&&u<=m;)if(null===n[h])h++;else if(null===n[p])p--;else if(r[h]===o[u])l[u]=pn(n[h],a[u]),h++,u++;else if(r[p]===o[m])l[m]=pn(n[p],a[m]),p--,m--;else if(r[h]===o[m])l[m]=pn(n[h],a[m]),hn(e,l[m+1],n[h]),h++,m--;else if(r[p]===o[u])l[u]=pn(n[p],a[u]),hn(e,n[h],n[p]),p--,u++;else if(void 0===c&&(c=rl(o,u,m),d=rl(r,h,p)),c.has(r[h]))if(c.has(r[p])){const t=d.get(o[u]),i=void 0!==t?n[t]:null;if(null===i){const t=hn(e,n[h]);pn(t,a[u]),l[u]=t}else l[u]=pn(i,a[u]),hn(e,n[h],i),n[t]=null;u++}else fn(n[p]),p--;else fn(n[h]),h++;for(;u<=m;){const t=hn(e,l[m+1]);pn(t,a[u]),l[u++]=t}for(;h<=p;){const e=n[h++];null!==e&&fn(e)}return this.ut=o,mn(e,l),at}}),cl=["type","label","description","default","required","group","pattern","allowed","domain","device_class","min","max","step","unit","multiline","selector"];function dl(e){const t={};for(const s of cl){const i=e[s];void 0!==i&&(t[s]=i)}Object.assign(t,e.extra);const i={name:e.name};for(const s of e.order)s in t&&(i[s]=t[s]);for(const s of Object.keys(t))s in i||(i[s]=t[s]);return i}function hl(e){return!!e&&"object"==typeof e&&!Array.isArray(e)}function pl(e,t){const i=e.map(dl);if("mapping"===t){const e={};for(const t of i){const{name:i}=t,s=Ke(t,["name"]),n=Object.keys(s);n.length?1!==n.length||"default"!==n[0]||hl(s.default)||null===s.default?e[String(i)]=s:e[String(i)]=s.default:e[String(i)]=null}return e}if("none"!==t||i.length)return i}function ul(e,t){const i=new Set(e.map(e=>e.name));if(!i.has(t))return t;let s=2;for(;i.has(`${t}_${s}`);)s+=1;return`${t}_${s}`}function ml(e,t,i){const s=Object.assign(Object.assign({},e),{extra:Object.assign({},e.extra)});return void 0===i?delete s[t]:s[t]=i,s}function fl(e){return void 0!==e.type?String(e.type):e.selector&&"object"==typeof e.selector&&"card"in e.selector?"card":""}const gl=e=>Array.isArray(e)?e.map(String).join(", "):null==e?"":String(e),vl=e=>{const t=e.split(",").map(e=>e.trim()).filter(Boolean);return t.length?t:void 0};class _l extends m{constructor(){super(...arguments),this._reorderedAsList=!1,this.shared=[],this._asYaml=!1,this._picking=!1}static get styles(){return f`
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
    `}get _rows(){return function(e){var t;const i=[];for(const s of Ie(e)){if(!s||"object"!=typeof s)continue;const e={name:"string"==typeof s.name?s.name:String(null!==(t=s.name)&&void 0!==t?t:""),extra:{},order:Object.keys(s).filter(e=>"name"!==e)};for(const[t,i]of Object.entries(s))"name"!==t&&(cl.includes(t)?e[t]=i:e.extra[t]=i);i.push(e)}return i}(this.variables)}get _shape(){const e=(t=this.variables,Array.isArray(t)?"list":t&&"object"==typeof t?"mapping":"none");var t;return"none"===e?"list":e}render(){const t=this._rows;return e`
      ${this._asYaml?this._renderYaml():this._renderRows(t)}
      ${this._reorderedAsList?e`<p class="hint">${n("declarations.reordered_as_list",void 0,this.hass)}</p>`:Be}
      <div class="add">
        <ha-button @click=${this._add}>${n("declarations.add",void 0,this.hass)}</ha-button>
        ${this.shared.length?e`<ha-button
                appearance="plain"
                @click=${()=>{this._picking=!this._picking}}
                >${n("declarations.take_shared",void 0,this.hass)}</ha-button
              >`:Be}
        <span class="spacer"></span>
        <ha-button
          appearance="plain"
          @click=${()=>{this._asYaml=!this._asYaml}}
          >${n(this._asYaml?"declarations.as_rows":"declarations.as_yaml",void 0,this.hass)}</ha-button
        >
      </div>
      ${this._picking?this._renderShared(t):Be}
    `}_renderRows(t){if(!t.length)return e`<div class="rows">
        <div class="empty">${n("declarations.none",void 0,this.hass)}</div>
      </div>`;const i=function(e){return e.map((t,i)=>{const s=void 0===t.group?void 0:String(t.group),n=i?e[i-1].group:void 0;return void 0!==s&&s!==(void 0===n?void 0:String(n))?s:void 0})}(t);return e`<div class="rows">
      ${ll(t,e=>e.name,(s,a)=>e`
          ${void 0!==i[a]?e`<div class="group">${i[a]}</div>`:Be}
          <div
            class="row"
            draggable="true"
            ?data-dragging=${this._dragging===a}
            @dragstart=${()=>{this._dragging=a}}
            @dragover=${e=>{void 0!==this._dragging&&e.preventDefault()}}
            @drop=${e=>this._drop(e,a)}
            @dragend=${()=>{this._dragging=void 0,this.requestUpdate()}}
          >
            <ha-svg-icon
              class="handle"
              role="img"
              aria-label=${n("template_editor.drag_hint",void 0,this.hass)}
              .path=${en}
            ></ha-svg-icon>
            <ha-form
              .hass=${this.hass}
              .data=${this._rowData(s)}
              .schema=${this._rowSchema(s)}
              .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
              @value-changed=${e=>this._rowChanged(e,a)}
            ></ha-form>
            <div class="buttons">
              <ha-icon-button
                .path=${"M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z"}
                .label=${n(this._open===s.name?"declarations.less":"declarations.more",void 0,this.hass)}
                @click=${()=>{this._open=this._open===s.name?void 0:s.name}}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,15L12,10L17,15H7Z"}
                .disabled=${0===a}
                .label=${n("template_editor.move_up",{name:s.name},this.hass)}
                @click=${()=>this._move(a,a-1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,10L12,15L17,10H7Z"}
                .disabled=${a===t.length-1}
                .label=${n("template_editor.move_down",{name:s.name},this.hass)}
                @click=${()=>this._move(a,a+1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                .label=${n("declarations.remove",{name:s.name},this.hass)}
                @click=${()=>this._remove(a)}
              ></ha-icon-button>
            </div>
          </div>
          ${this._open===s.name?this._renderMore(s,a):Be}
        `)}
    </div>`}_renderMore(t,i){const s={description:t.description,group:t.group,pattern:t.pattern,domain:gl(t.domain),device_class:gl(t.device_class),min:t.min,max:t.max,step:t.step,unit:t.unit,allowed:gl(t.allowed),multiline:t.multiline};return e`<div class="more">
      <ha-form
        .hass=${this.hass}
        .data=${s}
        .schema=${function(e,t){const i=fl(e),s={name:"description",label:n("declarations.description",void 0,t),selector:{text:{multiline:!0}}},a=[{name:"group",label:n("declarations.group",void 0,t),selector:{text:{}}}],o="entity"===i?[{name:"domain",label:n("declarations.domain",void 0,t),selector:{text:{}}},{name:"device_class",label:n("declarations.device_class",void 0,t),selector:{text:{}}}]:"number"===i?[{name:"min",label:n("declarations.min",void 0,t),selector:{number:{mode:"box"}}},{name:"max",label:n("declarations.max",void 0,t),selector:{number:{mode:"box"}}},{name:"step",label:n("declarations.step",void 0,t),selector:{number:{mode:"box"}}},{name:"unit",label:n("declarations.unit",void 0,t),selector:{text:{}}}]:"select"===i?[{name:"allowed",label:n("declarations.allowed",void 0,t),selector:{text:{}}}]:"text"===i?[{name:"multiline",label:n("declarations.multiline",void 0,t),selector:{boolean:{}}}]:[],r="card"===i?[]:[{name:"pattern",label:n("declarations.pattern",void 0,t),selector:{text:{}}}];return[s,{name:"",type:"grid",column_min_width:"260px",schema:[...a,...o,..."select"!==i&&void 0!==e.allowed?[{name:"allowed",label:n("declarations.allowed",void 0,t),selector:{text:{}}}]:[],...r]}]}(t,this.hass)}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        @value-changed=${e=>this._moreChanged(e,i)}
      ></ha-form>
      ${void 0!==t.selector&&"card"!==fl(t)?e`<ha-form
              .hass=${this.hass}
              .data=${{selector:t.selector}}
              .schema=${[{name:"selector",label:n("declarations.selector",void 0,this.hass),selector:{object:{}}}]}
              .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
              @value-changed=${e=>this._selectorChanged(e,i)}
            ></ha-form>`:Be}
    </div>`}_renderYaml(){return e`<ha-form
      .hass=${this.hass}
      .data=${{variables:this.variables}}
      .schema=${[{name:"variables",label:n("template_editor.declarations_label",void 0,this.hass),helper:n("template_editor.declarations_helper",void 0,this.hass),selector:{object:{}}}]}
      .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
      .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
      @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value.variables)}}
    ></ha-form>`}_renderShared(t){const i=new Set(t.map(e=>e.name)),s=this.shared.filter(e=>!i.has(e.name));return e`<div class="pick">
      ${n("declarations.take_shared_hint",void 0,this.hass)}
      ${s.length?e`<ul>
              ${s.map(t=>e`<li>
                    <a @click=${()=>this._takeShared(t)}>${t.name}</a>
                    ${t.label?e` - ${t.label}`:Be}
                  </li>`)}
            </ul>`:e`<p>${n("declarations.take_shared_none",void 0,this.hass)}</p>`}
    </div>`}_rowData(e){const t=void 0===e.default||["string","number","boolean"].includes(typeof e.default);return{name:e.name,type:fl(e),label:e.label,default:t?void 0===e.default?void 0:String(e.default):e.default,required:!0===e.required}}_rowSchema(e){const t=void 0===e.default||["string","number","boolean"].includes(typeof e.default),[i]=(s=this.hass,[{name:"",type:"grid",column_min_width:"120px",schema:[{name:"name",label:n("declarations.name",void 0,s),selector:{text:{}}},{name:"type",label:n("declarations.type",void 0,s),selector:{select:{mode:"dropdown",options:[{value:"",label:n("declarations.type_any",void 0,s)},...ot.map(e=>({value:e,label:n(`type_name.${e}`,void 0,s)})),{value:"card",label:n("type_name.card",void 0,s)}]}}},{name:"label",label:n("declarations.label",void 0,s),selector:{text:{}}},{name:"default",label:n("declarations.default",void 0,s),selector:{text:{}}},{name:"required",label:n("declarations.required",void 0,s),selector:{boolean:{}}}]}]);var s;if(t)return[i];const a=i.schema.map(e=>"default"===e.name?(e=>({name:"default",label:n("declarations.default",void 0,e),selector:{object:{}}}))(this.hass):e);return[Object.assign(Object.assign({},i),{schema:a})]}_rowChanged(e,t){var i,s;e.stopPropagation();const n=this._rows,a=n[t];if(!a)return;const o=e.detail.value;let r=a;const l="string"==typeof o.name?o.name.trim():a.name;l&&l!==a.name&&(r=ml(r,"name",ul(n.filter((e,i)=>i!==t),l)),this._open===a.name&&(this._open=r.name)),(null!==(i=o.type)&&void 0!==i?i:"")!==fl(a)&&(r=function(e,t){let i=ml(e,"type",void 0);return i=ml(i,"selector",void 0),"card"===t?ml(i,"selector",{card:{}}):t?ml(i,"type",t):i}(r,String(null!==(s=o.type)&&void 0!==s?s:""))),r=ml(r,"label","string"==typeof o.label&&""!==o.label?o.label:void 0),r=ml(r,"required",!0===o.required||void 0),o.default===a.default||""===o.default&&void 0===a.default||(r=ml(r,"default",this._defaultFrom(o.default,a))),this._emit(pl(n.map((e,i)=>i===t?r:e),this._shape))}_defaultFrom(e,t){if(""===e||null==e)return;if("string"!=typeof e)return e;const i=fl(t);return"number"!==i||""===e.trim()||Number.isNaN(Number(e))?"boolean"===i&&["true","false"].includes(e.trim().toLowerCase())?"true"===e.trim():e:Number(e)}_moreChanged(e,t){e.stopPropagation();const i=this._rows,s=i[t];if(!s)return;const n=e.detail.value;let a=s;const o=e=>"string"==typeof e&&e.trim()?e:void 0;a=ml(a,"description",o(n.description)),a=ml(a,"group",o(n.group)),a=ml(a,"pattern",o(n.pattern)),a=ml(a,"unit",o(n.unit));for(const l of["min","max","step"])a=ml(a,l,"number"==typeof n[l]?n[l]:void 0);a=ml(a,"multiline",!0===n.multiline||void 0);const r=e=>{const t="string"==typeof e?vl(e):void 0;return void 0===t?void 0:1===t.length?t[0]:t};a=ml(a,"domain",r(n.domain)),a=ml(a,"device_class",r(n.device_class)),a=ml(a,"allowed","string"==typeof n.allowed?vl(n.allowed):void 0),this._emit(pl(i.map((e,i)=>i===t?a:e),this._shape))}_selectorChanged(e,t){e.stopPropagation();const i=this._rows,s=e.detail.value.selector,n=ml(i[t],"selector",s&&"object"==typeof s?s:void 0);this._emit(pl(i.map((e,i)=>i===t?n:e),this._shape))}_add(){const e=this._rows,t=function(e,t="variable"){return{name:ul(e,t),extra:{},order:[]}}(e);this._open=t.name,this._emit(pl([...e,t],this._shape))}_takeShared(e){const t=this._rows,i={name:e.name,extra:{},order:[]};this._picking=!1,this._emit(pl([...t,i],this._shape))}_remove(e){const t=this._rows;this._emit(pl(t.filter((t,i)=>i!==e),this._shape))}_move(e,t){const i=this._rows,s=function(e,t,i){if(t===i||t<0||i<0||t>=e.length||i>=e.length)return e;const s=[...e],[n]=s.splice(t,1);return s.splice(i,0,n),s}(i,e,t);if(s===i)return;const n="mapping"===this._shape?"list":this._shape;this._reorderedAsList="mapping"===this._shape,this._emit(pl(s,n))}_drop(e,t){e.preventDefault();const i=this._dragging;this._dragging=void 0,void 0!==i&&this._move(i,t)}_emit(e){g(this,"value-changed",{value:e})}}h([p({attribute:!1})],_l.prototype,"hass",void 0),h([p({attribute:!1})],_l.prototype,"variables",void 0),h([u()],_l.prototype,"_reorderedAsList",void 0),h([p({attribute:!1})],_l.prototype,"shared",void 0),h([u()],_l.prototype,"_open",void 0),h([u()],_l.prototype,"_asYaml",void 0),h([u()],_l.prototype,"_picking",void 0);const yl="decluttering-declarations-editor";customElements.get(yl)||customElements.define(yl,_l);const bl=["name","title","label","entity","area","room"];function $l(e,t){const i=Object.assign({},o(t)),s=null==e?void 0:e.examples,n=null==s?[]:Array.isArray(s)?s:[s];return Object.assign(Object.assign({},e),{examples:[...n,i]})}class wl extends m{static get styles(){return f`
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
    `}render(){var t;const i=this.config,s=null==i?void 0:i.template;if(!i||!s)return e``;const a=L(i),r=rt.get(s),l=void 0===r||r>=a.length?"":String(r),c=null!==(t=S(this.lovelace,void 0,i)[s])&&void 0!==t?t:i,d=a.length?lt({[s]:c},[],this.hass):[],h=a.length-d.length,p=""===l?void 0:d.find(e=>e.example===Number(l)+1),u=[{name:"example",label:n("template_editor.preview_example_label",void 0,this.hass),selector:{select:{mode:"dropdown",options:[{value:"",label:n("template_editor.preview_defaults",void 0,this.hass)},...a.map((e,t)=>{const i=function(e){const t=o(e);for(const s of bl){const e=t[s];if("string"==typeof e&&e.trim())return e.trim();if("number"==typeof e)return String(e)}const i=e.map(D).find(e=>void 0!==e);if(void 0!==i){const e=t[i];if("string"==typeof e||"number"==typeof e)return`${i}: ${e}`}}(e),s=n("template_editor.example_n",{number:t+1},this.hass);return{value:String(t),label:i?`${s}: ${i}`:s}})]}}}];return e`
      <div class="strip">
        <ha-form
          .hass=${this.hass}
          .data=${{example:l}}
          .schema=${u}
          .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
          @value-changed=${this._picked}
        ></ha-form>
        ${a.length?e`<span class="passes ${h<a.length?"some":""}"
                >${n("template_editor.examples_pass",{passes:h,total:a.length},this.hass)}</span
              >`:Be}
        <ha-icon-button
          .path=${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}
          .label=${n("template_editor.example_add",void 0,this.hass)}
          @click=${this._add}
        ></ha-icon-button>
      </div>
      ${p?e`<ha-alert alert-type="warning"
              >${n("tools.health_example",{template:s,number:p.example,problems:p.problems.join(" ")},this.hass)}</ha-alert
            >`:Be}
    `}_picked(e){var t;e.stopPropagation();const i=null===(t=this.config)||void 0===t?void 0:t.template;if(!i)return;const s=e.detail.value.example;void 0===s||""===s?rt.delete(i):rt.set(i,Number(s)),window.dispatchEvent(new CustomEvent(ct,{detail:{template:i}})),this.dispatchEvent(new CustomEvent("example-picked",{detail:{template:i,example:""===s?void 0:Number(s)},bubbles:!0,composed:!0})),this.requestUpdate()}_add(){const e=this.config;if(!e)return;const t=L(e),i=rt.get(e.template),s=void 0!==i&&t[i]?t[i]:d(Oe(e));g(this,"config-changed",{config:$l(e,s)})}}h([p({attribute:!1})],wl.prototype,"hass",void 0),h([p({attribute:!1})],wl.prototype,"lovelace",void 0),h([p({attribute:!1})],wl.prototype,"config",void 0);const xl="decluttering-example-strip";customElements.get(xl)||customElements.define(xl,wl);const kl=B({states:{"light.kitchen_ceiling":{entity_id:"light.kitchen_ceiling",state:"on",attributes:{friendly_name:"Kitchen ceiling",brightness:180}},"sensor.garden_temperature":{entity_id:"sensor.garden_temperature",state:"14.6",attributes:{friendly_name:"Garden temperature",unit_of_measurement:"°C",device_class:"temperature"}},"binary_sensor.bedroom_window":{entity_id:"binary_sensor.bedroom_window",state:"off",attributes:{friendly_name:"Bedroom window",device_class:"window"}},"input_select.house_mode":{entity_id:"input_select.house_mode",state:"night",attributes:{friendly_name:"House mode",options:["day","night","away"]}}},entities:{"light.kitchen_ceiling":{entity_id:"light.kitchen_ceiling",device_id:"kitchen_hue",labels:["evening"]},"sensor.garden_temperature":{entity_id:"sensor.garden_temperature",device_id:"garden_aqara",labels:[]},"binary_sensor.bedroom_window":{entity_id:"binary_sensor.bedroom_window",area_id:"bedroom",icon:"mdi:window-closed-variant",labels:[]},"input_select.house_mode":{entity_id:"input_select.house_mode",labels:[]}},devices:{kitchen_hue:{id:"kitchen_hue",name:"Hue ceiling",manufacturer:"Signify",model:"Hue White",area_id:"kitchen"},garden_aqara:{id:"garden_aqara",name:"Garden sensor",manufacturer:"Aqara",model:"WSDCGQ11LM",area_id:"back_garden"}},areas:{kitchen:{area_id:"kitchen",name:"Kitchen",floor_id:"ground_floor",icon:"mdi:fridge"},back_garden:{area_id:"back_garden",name:"Back Garden",floor_id:null,icon:null},bedroom:{area_id:"bedroom",name:"Bedroom",floor_id:"first_floor",icon:"mdi:bed"}},floors:{ground_floor:{floor_id:"ground_floor",name:"Ground floor",icon:"mdi:home-floor-0"},first_floor:{floor_id:"first_floor",name:"First floor",icon:"mdi:home-floor-1"}},labels:{evening:{label_id:"evening",name:"Evening lights"}},language:"en",locale:{language:"en"},localize:()=>""},["light.kitchen_ceiling","sensor.garden_temperature","binary_sensor.bedroom_window","input_select.house_mode"]);function jl(e,t,i,s={},n=kl){const a=c(e,s,{value:t},null==s?void 0:s.template,n,!0,e=>e.forEach(e=>i.add(e.split("|")[0].replace(/\?$/,""))));return{value:null==a?void 0:a.value,removed:!a||!("value"in a)}}function Al(e){return e.removed?{value:void 0,kind:"removed"}:{value:e.value,kind:(t=e.value,null===t?"null":Array.isArray(t)?"list":"object"==typeof t?"mapping":"number"==typeof t?"number":"boolean"==typeof t?"boolean":"string"==typeof t&&/\[\[[^\]]/.test(t)?"unresolved":"text")};var t}function Sl(e,t,i,s){return function(e,t,i,s){const n=new Set,a=Al(jl(e,t,n,i,s)),o=jl(e,`<${t}>`,new Set,i,s),r=[],l=function(e){const t=e.trim();if(!t.startsWith("[[")||!t.endsWith("]]"))return;const i=[];let s=0,n="";for(let r=2;r<t.length-2;r+=1){const e=t.slice(r,r+2);if("[["===e)s+=1,n+=e,r+=1;else if("]]"===e){if(0===s)return;s-=1,n+=e,r+=1}else"|"===t[r]&&0===s?(i.push(n),n=""):n+=t[r]}if(0!==s)return;i.push(n);const a=i.length-1,o=i[a].endsWith("?");return o&&(i[a]=i[a].slice(0,-1)),{name:i[0],steps:i.slice(1),optional:o}}(t);if(l&&l.steps.length)for(let c=0;c<=l.steps.length;c+=1){const t=`[[${[l.name,...l.steps.slice(0,c)].join("|")}${c===l.steps.length&&l.optional?"?":""}]]`;r.push(Object.assign({written:t,step:0===c?l.name:l.steps[c-1]},Al(jl(e,t,new Set,i,s))))}return{steps:r,whole:a,inText:"string"==typeof o.value?o.value.slice(1,-1):void 0,unset:[...n]}}(t,i,null!=e?e:{},null!=s?s:kl)}const Ol=["card","badge","row","element","group","style","let","default","defaults","grid_options","name"],Cl="[^[\\]]*",El=new RegExp(`\\[\\[(?:${Cl}|${`\\[\\[(?:${Cl}|${`\\[\\[${Cl}\\]\\]`})*\\]\\]`})*\\]\\]`,"g");function Tl(e){var t;const i=[];for(const s of null!==(t=e.match(El))&&void 0!==t?t:[])s.startsWith("[[!")||i.includes(s)||i.push(s);return i}const Nl=["slug","title","upper","default:","if:","bool","replace:","friendly_name","area","state"];class Pl extends m{constructor(){super(...arguments),this._expression="",this._more=!1}static get styles(){return f`
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
    `}render(){const t=this.config;if(!t||!this.hass)return e``;const i=function(e){if(!e||"object"!=typeof e)return[];const t=[];for(const i of Ol){const s=e[i];if(void 0===s)continue;const n="string"==typeof s?s:JSON.stringify(s);for(const e of Tl(n))t.includes(e)||t.push(e)}return t}(t),s=this._expression||i[0]||"",a=[{name:"placeholder",label:n("placeholder_tool.placeholder",void 0,this.hass),selector:{select:{mode:"dropdown",custom_value:!0,options:i.map(e=>({value:e,label:e}))}}}];return e`
      <ha-expansion-panel outlined>
        <span slot="header"
          >${n("placeholder_tool.header",void 0,this.hass)} <small>${this._exampleLabel()}</small></span
        >
        <div style="padding: 12px 4px 4px">
          <ha-form
            .hass=${this.hass}
            .data=${{placeholder:s}}
            .schema=${a}
            .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
            @value-changed=${this._picked}
          ></ha-form>
          <p class="hint">${n("placeholder_tool.hint",{count:i.length},this.hass)}</p>
          <div class="chips">
            <span>${n("placeholder_tool.add_step",void 0,this.hass)}</span>
            ${(this._more?[...dt,...ht.map(e=>`${e}:`)]:Nl).map(t=>e`<span class="chip" @click=${()=>this._addStep(s,t)}>${t}</span>`)}
            ${this._more?Be:e`<span
                    class="chip"
                    @click=${()=>{this._more=!0}}
                    >…</span
                  >`}
          </div>
          ${s?this._renderResult(s):Be}
        </div>
      </ha-expansion-panel>
    `}_exampleLabel(){var e;const t=null===(e=this.config)||void 0===e?void 0:e.template,i=t?rt.get(t):void 0;return void 0===i?n("placeholder_tool.under_defaults",void 0,this.hass):n("placeholder_tool.under_example",{number:i+1},this.hass)}_result(e){var t;const i=this.config;if(!i)return;const s=null!==(t=S(this.lovelace,void 0,i)[i.template])&&void 0!==t?t:i,n=pt(s,rt.get(i.template)),a=null!=n?n:d(Oe(s));try{return Sl(s,a,e,this.hass)}catch(o){return}}_renderResult(t){const i=this._result(t);if(!i)return e``;if(i.error)return e`<ha-alert alert-type="error">${i.error}</ha-alert>`;const s=i.steps.length?i.steps:[],a=s.findIndex(e=>"unresolved"===e.kind);return e`
      <table>
        <thead>
          <tr>
            <th>${n("placeholder_tool.col_step",void 0,this.hass)}</th>
            <th>${n("placeholder_tool.col_gives",void 0,this.hass)}</th>
            <th>${n("placeholder_tool.col_from",void 0,this.hass)}</th>
          </tr>
        </thead>
        <tbody>
          ${s.map((e,t)=>this._renderStep(e,t,a,i))}
          <tr class=${"unresolved"===i.whole.kind?"bad":""}>
            <td class="code">${n("placeholder_tool.result",void 0,this.hass)}</td>
            <td class="code ${"unresolved"===i.whole.kind?"bad":""}">
              <span class="value">${this._shown(i.whole.value,i.whole.kind)}</span>
            </td>
            <td class="from">${n(`placeholder_tool.kind_${i.whole.kind}`,void 0,this.hass)}</td>
          </tr>
        </tbody>
      </table>
      <p class="hint">${n("placeholder_tool.steps_hint",void 0,this.hass)}</p>
    `}_renderStep(t,i,s,a){const o="unresolved"===t.kind&&(-1===s||i===s),r=void 0===t.value||""===t.value||"removed"===t.kind,l=0===i?a.unset.includes(t.step)?n("placeholder_tool.from_unset",void 0,this.hass):n("placeholder_tool.from_variables",void 0,this.hass):o?n("placeholder_tool.from_refused",void 0,this.hass):"";return e`<tr class=${o?"bad":""}>
      <td class="code">${t.step}</td>
      <td class="code ${o?"bad":r?"gap":""}">
        <span class="value"
          >${r&&!o?n("placeholder_tool.nothing",void 0,this.hass):this._shown(t.value,t.kind)}</span
        >
      </td>
      <td class="from">${l}</td>
    </tr>`}_shown(e,t){return"removed"===t?n("placeholder_tool.removed",void 0,this.hass):void 0===e?"":"string"==typeof e?e:JSON.stringify(e)}_picked(e){e.stopPropagation();const t=e.detail.value.placeholder;this._expression="string"==typeof t?t:""}_addStep(e,t){let i=e.trim()||"[[]]";const s=i.endsWith("?]]");i=i.replace(/\??\]\]$/,"");const n=i.slice(2),a=""===n?t:`${n}|${t}`;this._expression=`[[${a}${s?"?":""}]]`}}h([p({attribute:!1})],Pl.prototype,"hass",void 0),h([p({attribute:!1})],Pl.prototype,"lovelace",void 0),h([p({attribute:!1})],Pl.prototype,"config",void 0),h([u()],Pl.prototype,"_expression",void 0),h([u()],Pl.prototype,"_more",void 0);const Ll="decluttering-placeholder-tool";customElements.get(Ll)||customElements.define(Ll,Pl);const Il="https://tempus2016.github.io/decluttering-card-plus/",Fl=`${Il}help-index.json`,Ml={template:"Defining-Templates.html",type:"Defining-Templates.html",description:"Defining-Templates.html",category:"Defining-Templates.html",variables:"Describing-Variables.html",default:"Variables.html",defaults:"Variables.html",let:"Variables.html",extends:"Defining-Templates.html",examples:"Describing-Variables.html",for_each:"Repeating-a-Template.html",for_each_from:"Repeating-a-Template.html",columns:"Repeating-a-Template.html",min_column_width:"Repeating-a-Template.html",gap:"Styling.html",empty:"Repeating-a-Template.html",lazy:"Repeating-a-Template.html",style:"Styling.html",grid_options:"Styling.html",on_error:"Using-Templates.html",rebuild_on:"Using-Templates.html",debug:"Troubleshooting.html",strict:"Using-Templates.html",fit:"Styling.html",group:"Cards.html",publish:"Using-Templates.html",suggest_for:"Using-Templates.html",visibility:"Visibility.html"};let Vl;function Hl(e=fetch){return null!=Vl||(Vl=e(Fl,{cache:"force-cache"}).then(async e=>{if(!e.ok)return{};return function(e){const t={};if(!e||"object"!=typeof e)return t;for(const[i,s]of Object.entries(e)){if(!s||"object"!=typeof s)continue;const e=s;"string"==typeof e.page&&"string"==typeof e.text&&"string"==typeof e.url&&(e.url.startsWith(Il)&&(t[i]=Object.assign(Object.assign({key:i,page:e.page,heading:"string"==typeof e.heading?e.heading:"",text:e.text},"string"==typeof e.yaml?{yaml:e.yaml}:{}),{url:e.url})))}return t}(await e.json())}).catch(()=>({}))),Vl}class Dl extends m{constructor(){super(...arguments),this.key="",this._open=!1,this._loaded=!1}static get styles(){return f`
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
        aria-label=${n("help.button",{key:this.key},this.hass)}
        title=${n("help.button",{key:this.key},this.hass)}
        @click=${this._toggle}
        @keydown=${this._keydown}
      >
        ?
      </button>
      ${this._open?this._renderPop():Be}
    `}_renderPop(){var t;const i=this._entry,s=null!==(t=null==i?void 0:i.url)&&void 0!==t?t:function(e){var t;return Il+(null!==(t=Ml[e])&&void 0!==t?t:"Configuration-Reference.html")}(this.key);return e`
      <div class="pop" role="dialog" @keydown=${this._keydown}>
        ${i?e`
                <h5>${i.page}${i.heading?` · ${i.heading}`:""}</h5>
                <p>${i.text}</p>
                ${i.yaml?e`<pre>${i.yaml}</pre>`:Be}
              `:e`<p>
                ${n(this._loaded?"help.not_in_index":"help.loading",{key:this.key},this.hass)}
              </p>`}
        <div class="foot">
          <a href=${s} target="_blank" rel="noopener noreferrer"
            >${n("help.open_page",void 0,this.hass)}</a
          >
          <span class="esc">${n("help.esc",void 0,this.hass)}</span>
        </div>
      </div>
    `}async _toggle(){this._open=!this._open,this._open&&!this._loaded&&(this._entry=await async function(e,t){return(await Hl(t))[e]}(this.key),this._loaded=!0)}_keydown(e){"Escape"===e.key&&this._open&&(e.stopPropagation(),this._open=!1)}}h([p({attribute:!1})],Dl.prototype,"hass",void 0),h([p()],Dl.prototype,"key",void 0),h([u()],Dl.prototype,"_open",void 0),h([u()],Dl.prototype,"_entry",void 0),h([u()],Dl.prototype,"_loaded",void 0);const ql="decluttering-help";customElements.get(ql)||customElements.define(ql,Dl);const Rl=["card","badge","row","element"];function zl(e,t,i=[]){if(Array.isArray(e))e.forEach((e,s)=>zl(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,n]of Object.entries(e))zl(n,t?`${t}.${s}`:s,i);else null!=e&&i.push({path:t,value:String(e)});return i}const Ul=["grid_options","visibility","view_layout","layout_options"];function Wl(e){const t={};for(const[i,s]of Object.entries(null!=e?e:{}))Ul.includes(i)||(t[i]=s);return t}function Bl(e){if(Array.isArray(e))return e.map(Bl);if(e&&"object"==typeof e){const t={};for(const i of Object.keys(e).sort())t[i]=Bl(e[i]);return t}return 0}function Kl(e,t=[],i=[]){if(Array.isArray(e))e.forEach((e,s)=>Kl(e,[...t,s],i));else if(e&&"object"==typeof e)for(const[s,n]of Object.entries(e))Kl(n,[...t,s],i);else i.push({path:t,value:e});return i}function Jl(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}function Yl(e){const t=new Map;e.forEach((e,i)=>{var s;if(!e||"object"!=typeof e||"string"!=typeof e.type)return;const n=Wl(e);if(JSON.stringify(n).includes("[["))return;const a=JSON.stringify([e.type,Bl(n)]);t.set(a,[...null!==(s=t.get(a))&&void 0!==s?s:[],i])});const i=[];for(const[s,n]of t){if(n.length<2)continue;const t=n.map(t=>Wl(e[t])),a=Kl(t[0]).map(e=>e.path).filter(e=>t.some(i=>JSON.stringify(Jl(i,e))!==JSON.stringify(Jl(t[0],e))));!a.length||a.length>8||i.push({indices:n,type:e[n[0]].type,differing:a,key:s})}return i.sort((e,t)=>t.indices.length-e.indices.length||e.indices[0]-t.indices[0])}const Zl=e=>e.replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value";function Gl(e){const t=e[e.length-1];if("string"==typeof t)return Zl(t);const i=[...e].reverse().find(e=>"string"==typeof e);return Zl(`${null!=i?i:"item"}_${t+1}`)}function Ql(e){const t=e.map(Gl),i=[];return e.forEach((e,s)=>{const n=(a=t[s],t.filter(e=>e===a).length>1?function(e){return Zl(e.map(e=>"number"==typeof e?String(e+1):e).join("_"))}(e):t[s]);var a;i.push(Cs(n,i))}),i}function Xl(e){var t;const i=e.map(Wl),s=null!==(t=i[0])&&void 0!==t?t:{},n=Kl(s).map(e=>e.path).filter(e=>i.some(t=>JSON.stringify(Jl(t,e))!==JSON.stringify(Jl(s,e)))),a=Ql(n),o=JSON.parse(JSON.stringify(s));return n.forEach((e,t)=>{Jl(o,e.slice(0,-1))[e[e.length-1]]=`[[${a[t]}]]`}),{template:{card:o},names:a,variables:i.map(e=>n.map((t,i)=>({[a[i]]:Jl(e,t)}))),layout:e.map(e=>{const t={};for(const i of Ul)void 0!==(null==e?void 0:e[i])&&(t[i]=e[i]);return t})}}function ec(e,t,i){return Object.assign({type:"custom:decluttering-card-plus",template:e,variables:t},i)}const tc="_";function ic(e){let t="string"==typeof e?e:JSON.stringify(e);if("string"!=typeof t||!t.includes("[["))return[];const i=new Set;for(let s=0;s<5;s+=1){let e=!1;if(t=t.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(t,s)=>{if(e=!0,s.startsWith(De))return tc;const n=s.endsWith("?")?s.slice(0,-1):s,[a,...o]=n.split("|"),r=a.endsWith("?")?a.slice(0,-1):a;for(const e of[r,r.split(".")[0]])e&&e!==tc&&i.add(e);for(const e of o){const t=e.startsWith("or:")?e.slice(3):He(e);t&&t!==tc&&i.add(t)}return tc}),!e)break}return[...i]}function sc(e,t=[]){if(Array.isArray(e)){for(const i of e)sc(i,t);return t}if(!e||"object"!=typeof e)return t;Pe.includes(e.type)&&!0===e[vt]&&"string"==typeof e.template&&t.push(e.template);for(const i of Object.values(e))sc(i,t);return t}function nc(e,t,i=new Set){const s=new Set;if(!e)return{names:s,complete:!0};gt in e&&(e=Object.assign(Object.assign({},e),{default:e[gt]}));for(const a of C(e))s.add(a.name);for(const a of d(Oe(e))){const e=D(a);void 0!==e&&s.add(e)}for(const a of ic(e))s.add(a);let n=!0;for(const a of sc(e)){if(i.has(a))continue;if(i.add(a),!Object.prototype.hasOwnProperty.call(t,a)){n=!1;continue}const e=nc(t[a],t,i);for(const t of e.names)s.add(t);e.complete||(n=!1)}return{names:s,complete:n}}function ac(e,t){const i=new Map,s=(e,t,s,n)=>{const a=JSON.stringify([e.index,t,n.name,s]),o=i.get(a);o?(o.count+=1,!o.closest&&n.closest&&(o.closest=n.closest)):i.set(a,Object.assign(Object.assign({view:e,template:t,name:n.name},n.closest?{closest:n.closest}:{}),{where:s,count:1}))},n=(e,i,o)=>{var r,l;if(Array.isArray(e))for(const t of e)n(t,i,o);else if(e&&"object"==typeof e){if(Pe.includes(e.type)&&"string"==typeof e.template){const n=Object.prototype.hasOwnProperty.call(t,e.template)?t[e.template]:void 0;if(n){const c=new Set,h=(r,l)=>{for(const h of function(e,t,i,s={lets:[],defaults:[]},n){if(!e)return[];const{names:o,complete:r}=nc(e,t);if(!r)return[];const l=new Set([...d(e.let),...s.lets].map(D).filter(e=>void 0!==e)),c=I(i),h=new Set(o);for(const a of ic(n))h.add(a);for(const a of[...s.lets,...s.defaults]){const e=D(a);if(void 0!==e)for(const t of ic(a[e]))h.add(t)}const p=e=>!l.has(e)&&(h.has(e)||h.has(e.split(".")[0]));let u=!0;const m=new Set;for(;u;){u=!1;for(const e of c){const t=D(e);if(!m.has(t)&&p(t)){m.add(t);for(const i of ic(e[t]))h.has(i)||(h.add(i),u=!0)}}}const f=new Set(c.map(e=>D(e))),g=[...h].filter(e=>!f.has(e)&&!l.has(e)),v=[];for(const d of f){if(p(d))continue;const e=a(d,g);v.push(e?{name:d,closest:e}:{name:d})}return v}(n,t,l,o,[e.on_error,e.for_each_from]))c.has(h.name)||(c.add(h.name),s(i,e.template,r,h))};h("variables",e.variables);for(const t of null!==(r=q(e.for_each))&&void 0!==r?r:[])h("for_each",t);const p=null===(l=e.for_each_from)||void 0===l?void 0:l.overrides;if(p&&"object"==typeof p)for(const e of Object.values(p))h("overrides",e)}}for(const t of Object.values(e))n(t,i,o)}};return mt(e,(t,i,s)=>{var a,o,r;const l=e.views[i];n(t,{title:null!==(o=null!==(a=null==l?void 0:l.title)&&void 0!==a?a:null==l?void 0:l.path)&&void 0!==o?o:"",path:null!==(r=null==l?void 0:l.path)&&void 0!==r?r:"",index:i},ft(e,i,s))}),[...i.values()].map(({view:e,template:t,name:i,closest:s,where:n,count:a})=>s?{view:e,template:t,name:i,closest:s,where:n,count:a}:{view:e,template:t,name:i,where:n,count:a})}function oc(e,t,i){if(!e.includes("[["))return e;const s=e.replace(/\[\[([^[\]]+)\]\]/g,(e,s)=>s.startsWith(De)?e:`[[${function(e,t,i){const s=e.endsWith("?"),n=(s?e.slice(0,-1):e).split("|"),a=n[0],o=a.endsWith("?"),r=o?a.slice(0,-1):a;(r===t||r.startsWith(`${t}.`))&&(n[0]=`${i}${r.slice(t.length)}${o?"?":""}`);for(let l=1;l<n.length;l+=1){const e=n[l];if(e===`or:${t}`)n[l]=`or:${i}`;else if(He(e)===t){const s=e.startsWith("if:!")?"!":"";n[l]=`if:${s}${i}${e.slice(3+s.length+t.length)}`}}return`${n.join("|")}${s?"?":""}`}(s,t,i)}]]`);return s.replace(new RegExp(`\\[\\[${n=t,n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=\\.\\[\\[)`,"g"),`[[${i}`);var n}function rc(e,t,i){if("string"==typeof e)return oc(e,t,i);if(Array.isArray(e))return e.map(e=>rc(e,t,i));if(e&&"object"==typeof e){const s={};for(const[n,a]of Object.entries(e))s[oc(n,t,i)]=rc(a,t,i);return s}return e}function lc(e,t,i){const s=e=>!!e&&"object"==typeof e&&!Array.isArray(e),n=(e,t)=>s(e)&&Object.prototype.hasOwnProperty.call(e,t),a=e=>{if(!s(e))return e;const n={};for(const[s,a]of Object.entries(e))s!==i&&(n[s===t?i:s]=a);return n};return Array.isArray(e)?e.some(e=>n(e,t))?e.map(a).filter(e=>!s(e)||Object.keys(e).length>0):e:n(e,t)?a(e):e}function cc(e,t,i){const s=rc(e,t,i);return Array.isArray(s.variables)?s.variables=s.variables.map(e=>e&&"object"==typeof e&&e.name===t?Object.assign(Object.assign({},e),{name:i}):e):s.variables&&"object"==typeof s.variables&&(s.variables=lc(s.variables,t,i)),void 0!==s.default&&(s.default=lc(s.default,t,i)),void 0!==s.defaults&&(s.defaults=lc(s.defaults,t,i)),void 0!==s.let&&(s.let=lc(s.let,t,i)),s}function dc(e){const t=null==e?void 0:e.extends;return(Array.isArray(t)?t:[t]).filter(e=>"string"==typeof e)}function hc(e,t,i){const s=ut(e),n=new Set([t]);for(const o of null!=i?i:[])Object.prototype.hasOwnProperty.call(s,o)||n.add(o);let a=!0;for(;a;){a=!1;for(const[e,t]of Object.entries(s))!n.has(e)&&dc(t).some(e=>n.has(e))&&(n.add(e),a=!0)}return n}function pc(e){if(!e)return[];const t=new Set(Ks(e));for(const i of ic(e))i.includes(".")||"_"===i||t.add(i);return[...t].sort()}function uc(e,t,i,s,n){const a=hc(e,t,n);let o=0,r=0;const l=(e,t)=>JSON.stringify(e)!==JSON.stringify(t),c=e=>{if(Array.isArray(e))return e.map(c);if(!e||"object"!=typeof e)return e;let t={};for(const[i,s]of Object.entries(e))t[i]=c(s);if(Pe.includes(e.type)&&a.has(e.template)){const e=function(e,t,i){var s;const n=Object.assign({},e);void 0!==n.variables&&(n.variables=lc(n.variables,t,i)),Array.isArray(n.for_each)?n.for_each=n.for_each.map(e=>lc(e,t,i)):void 0!==n.for_each&&(n.for_each=lc(n.for_each,t,i));const a=null===(s=n.for_each_from)||void 0===s?void 0:s.overrides;if(a&&"object"==typeof a&&!Array.isArray(a)){const e={};for(const[s,n]of Object.entries(a))e[s]=lc(n,t,i);n.for_each_from=Object.assign(Object.assign({},n.for_each_from),{overrides:e})}return"string"==typeof n.name&&(n.name=oc(n.name,t,i)),n}(t,i,s);l(e,t)&&(o+=1),t=e}if(v(e.type)&&a.has(e.template)){const e=cc(t,i,s);l(e,t)&&(r+=1),t=e}return t},d=Object.assign({},e);Array.isArray(null==e?void 0:e.views)&&(d.views=c(e.views));const h=null==e?void 0:e.decluttering_templates;if(h&&"object"==typeof h){const e={};for(const[t,n]of Object.entries(h)){let o=c(n);if(a.has(t)){const e=cc(o,i,s);l(e,o)&&(r+=1),o=e}e[t]=o}d.decluttering_templates=e}return{config:d,cards:o,templates:r}}function mc(e,t,i){if(Object.prototype.hasOwnProperty.call(ut(e),t))return!1;if(i===_t)return!0;const s=yt(e);return s.includes(i)||s.includes("*")}class fc extends m{constructor(){super(...arguments),this._renameTo="",this._renaming=!1,this._duplicateTo="",this._busy=!1,this._modernisePending=!1,this._similarNames={},this._searchQuery="",this._searching=!1,this._varTo=""}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=G())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:A()}static get styles(){return nn}_fireConfigChanged(e){g(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return sn(this,e,t,i)}render(){return this.hass&&this._config?this._renderUsages():e``}_renderUsages(){var t,i;const s=null===(t=this._config)||void 0===t?void 0:t.template;if(!s)return e``;const a=this._savedLovelace;if(!a)return e`<div class="usages">
        <ha-alert alert-type="warning">${n("template_editor.usages_unreadable",void 0,this.hass)}</ha-alert>
      </div>`;(null===(i=this._usages)||void 0===i?void 0:i.name)===s&&this._usages.ll===a||(this._usages={name:s,ll:a,usages:bt(a,s)});const{views:o,templates:r}=this._usages.usages,l=o.reduce((e,t)=>e+t.count,0),c=document.location.pathname.split("/").slice(0,2).join("/");return e`
      <div class="usages">
        ${0!==l||r.length?e`
                <p class="hint">
                  ${n(1===l?"template_editor.usages_one":"template_editor.usages_many",{total:l,name:s},this.hass)}
                </p>
                <ul>
                  ${o.map(t=>e`
                      <li>
                        <a href=${`${c}/${t.path||t.index}`} target="_blank" rel="noreferrer">
                          ${t.title||t.path||n("template_editor.untitled_view",void 0,this.hass)}
                        </a>
                        —
                        ${1===t.count?n("template_editor.used_once",void 0,this.hass):n("template_editor.used_times",{count:t.count},this.hass)}
                      </li>
                    `)}
                </ul>
              `:e`<ha-alert alert-type="info">
                ${n("template_editor.usages_none",{name:s},this.hass)}
              </ha-alert>`}
        ${r.length?e`<ha-alert alert-type="info">
                ${n(1===r.length?"template_editor.used_by_template":"template_editor.used_by_templates",{names:r.join(", ")},this.hass)}
              </ha-alert>`:e``}
        ${this._renderElsewhere(s)} ${this._renderImpact(a,s)}
        <decluttering-card-plus-health .hass=${this.hass} .lovelace=${a}
          >${this._renderUndo()}</decluttering-card-plus-health
        >
        ${this._renderSimilar(a)} ${this._renderSearch()} ${this._renderRename(s,l)}
        ${this._renderRenameVariable(s)} ${this._renderDuplicate(s)} ${this._renderModernise()}
        ${this._toolError?e`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:e``}
      </div>
    `}_renderUndo(){var t,i;const s=$t();if(!s)return e``;const a=wt(s.operation,this.hass),o=new Date(s.at).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language);return e`
      <div class="undo">
        <p class="hint">${n("undo.held",{operation:a,time:o},this.hass)}</p>
        ${this._undoChanged?e`<ha-alert alert-type="warning">
                ${n("undo.changed_here",{operation:a,dashboards:this._undoChanged.join(", ")},this.hass)}
              </ha-alert>`:e``}
        <ha-button .disabled=${this._busy} @click=${this._undo}>
          ${n(this._undoChanged?"undo.anyway_button":"undo.button",{operation:a},this.hass)}
        </ha-button>
      </div>
    `}async _undo(){const e=$t();if(e){this._busy=!0;try{const t=await xt(this,this.hass,e,!!this._undoChanged,!1);this._undoChanged="changed"===(null==t?void 0:t.result)?t.dashboards:void 0}finally{this._busy=!1}}}_renderSimilar(t){var i;if((null===(i=this._similar)||void 0===i?void 0:i.ll)!==t){const e=kt(t);this._similar={ll:t,cards:e,groups:Yl(e.map(e=>e.config))}}const{cards:s,groups:a}=this._similar;if(!a.length)return e``;const o=Object.keys(S(t));return e`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${n(1===a.length?"tools.similar_header_one":"tools.similar_header",{count:a.length},this.hass)}
        </span>
        <p class="hint">${n("tools.similar_hint",{max:8},this.hass)}</p>
        ${a.slice(0,10).map(e=>this._renderSimilarGroup(e,s,o))}
      </ha-expansion-panel>
    `}_renderSimilarGroup(t,i,s){var a;const o=t.indices.map(e=>i[e]),r=Xl(o.map(e=>e.config)),l=(null!==(a=this._similarNames[t.key])&&void 0!==a?a:function(e,t,i=[]){let s=Zl(e.replace(/^custom:/,"").replace(/-/g,"_")).toLowerCase();/(^|_)card$/.test(s)||(s=`${s}_card`);const n=new Set(i.map(e=>"string"==typeof(null==e?void 0:e.entity)&&e.entity.includes(".")?e.entity.split(".")[0]:"")),[a]=[...n];return 1===n.size&&a&&(s=`${Zl(a).toLowerCase()}_${s}`),Cs(s,t)}(t.type,s,o.map(e=>e.config))).trim(),c=this._similarPending===`${t.key}\0${l}`,d=s.includes(l);return e`
      <div class="similar">
        <h3>${n("tools.similar_group",{count:o.length,type:t.type},this.hass)}</h3>
        <p class="hint">${n("tools.similar_differ",{names:r.names.join(", ")},this.hass)}</p>
        <ul>
          ${o.slice(0,8).map(t=>e`<li>${t.label}</li>`)}
        </ul>
        ${o.length>8?e`<p class="hint">
                ${n("editor.matches_more",{count:o.length-8},this.hass)}
              </p>`:e``}
        ${d?e`<ha-alert alert-type="error">${n("tools.name_taken",{name:l},this.hass)}</ha-alert>`:e``}
        ${c?e`
                <ha-alert alert-type="warning">
                  ${n("tools.similar_confirm",{name:l,count:o.length},this.hass)}
                </ha-alert>
                <p class="hint">${n("tools.similar_template",{name:l},this.hass)}</p>
                ${gn(`${t.key}\0${l}`,e`<ha-yaml-editor
                    .hass=${this.hass}
                    .defaultValue=${{[l]:r.template}}
                    read-only
                  ></ha-yaml-editor>`)}
                <p class="hint">${n("tools.similar_first_card",void 0,this.hass)}</p>
                ${sl(o[0].config,ec(l,r.variables[0],r.layout[0]),this.hass)}
              `:e``}
        ${tn({label:n("tools.similar_name",void 0,this.hass),value:l,disabled:this._busy,onInput:e=>{this._similarNames=Object.assign(Object.assign({},this._similarNames),{[t.key]:e}),this._similarPending=void 0}})}
        <ha-button
          .disabled=${this._busy||!l||d}
          @click=${()=>{this._makeTemplate(t,o,l)}}
        >
          ${n(c?"tools.similar_make_anyway":"tools.similar_make",void 0,this.hass)}
        </ha-button>
      </div>
    `}async _makeTemplate(e,t,i){const s=`${e.key}\0${i}`;if(this._similarPending!==s)return void(this._similarPending=s);const n=await this._saveDashboard(e=>function(e,t,i){const{template:s,variables:n,layout:a}=Xl(t);let o=Ye(e,i,s);return t.forEach((e,t)=>{o=ie(o,e,ec(i,n[t],a[t]))}),o}(e,t.map(e=>e.config),i),"make_template");if(n){this._similarPending=void 0;const t=Object.assign({},this._similarNames);delete t[e.key],this._similarNames=t}}_renderElsewhere(t){var i;if((null===(i=this._remoteUsages)||void 0===i?void 0:i.name)!==t){this._remoteUsages={name:t,list:[]};const e=document.location.pathname.split("/").filter(Boolean)[0];jt(this.hass,t,e).then(e=>{var i;(null===(i=this._remoteUsages)||void 0===i?void 0:i.name)===t&&(this._remoteUsages={name:t,list:e})})}const s=this._remoteUsages.list;if(!s.length)return e``;const a=s.map(e=>`${e.urlPath} (${e.total})`).join(", ");return e`<ha-alert alert-type="info">
      ${n("template_editor.usages_elsewhere",{list:a},this.hass)}
    </ha-alert>`}_renderImpact(t,i){const s=At(t,i);if(!s||!this._config)return e``;const a=e=>{if(e)return c(s.variables,e,W(e),i,this.hass,!0)};let o,r;try{o=a(S(t)[i]),r=a(S(t,void 0,this._config)[i])}catch(l){return e``}return e`
      <ha-expansion-panel outlined>
        <span slot="header">${n("template_editor.impact_header",void 0,this.hass)}</span>
        <p class="hint">${n("template_editor.impact_diff_hint",void 0,this.hass)}</p>
        ${nl(o,r,this.hass)}
      </ha-expansion-panel>
    `}_renderRename(t,i){const s=this._renameTo.trim(),a=!!s&&this._renamePending===s,o=i?1===i?n("tools.rewrites_one",void 0,this.hass):n("tools.rewrites_many",{count:i},this.hass):"";return e`
      <div class="rename">
        <h3>${n("tools.rename_header",void 0,this.hass)}</h3>
        <p class="hint">${n("tools.rename_hint",void 0,this.hass)}</p>
        ${this._renameError?e`<ha-alert alert-type="error">${this._renameError}</ha-alert>`:e``}
        ${a?e`<ha-alert alert-type="warning">
                ${n("tools.rename_confirm",{from:t,to:s,rewrites:o},this.hass)}
              </ha-alert>`:e``}
        ${tn({label:n("tools.new_name",void 0,this.hass),value:this._renameTo,disabled:this._renaming,onInput:e=>this._renameChanged(e)})}
        <ha-button .disabled=${this._renaming||!s||s===t} @click=${this._rename}>
          ${a?n("tools.rename_anyway",void 0,this.hass):1===i?n("tools.rename_update_one",void 0,this.hass):i?n("tools.rename_update_many",{count:i},this.hass):n("tools.rename",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderModernise(){const t=this._savedLovelace,i=t?St(t):0;return i?e`
      <div class="rename">
        <h3>${n("tools.modernise_header",void 0,this.hass)}</h3>
        <p class="hint">
          ${n(1===i?"tools.modernise_hint_one":"tools.modernise_hint_many",{count:i},this.hass)}
        </p>
        ${this._modernisePending?e`<ha-alert alert-type="warning">
                ${n(1===i?"tools.modernise_confirm_one":"tools.modernise_confirm_many",{count:i},this.hass)}
              </ha-alert>`:e``}
        <ha-button .disabled=${this._busy} @click=${this._modernise}>
          ${n(this._modernisePending?"tools.modernise_anyway":1===i?"tools.modernise_one":"tools.modernise_many",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}async _modernise(){if(!this._modernisePending)return void(this._modernisePending=!0);await this._saveDashboard(e=>Ot(e),"modernise")&&(this._modernisePending=!1)}_renameChanged(e){this._renameTo=e,this._renameError=void 0,this._renamePending=void 0}async _rename(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._renameTo.trim();if(!i||!s||s===i)return;const a=G();if(a)if(void 0===S(a.config)[s])if(this._renamePending===s){this._renaming=!0,this._renameError=void 0;try{await X(this,this.hass,"rename_template",[{urlPath:te(),build:e=>Ct(e,i,s)}],this._config),this._undoChanged=void 0,this._fireConfigChanged(Object.assign(Object.assign({},this._config),{template:s})),this._renameTo="",this._renamePending=void 0}catch(o){this._renameError=n("tools.save_failed",{message:null!==(t=null==o?void 0:o.message)&&void 0!==t?t:o},this.hass)}finally{this._renaming=!1}}else this._renamePending=s;else this._renameError=n("tools.name_taken",{name:s},this.hass);else this._renameError=n("tools.cannot_rename_here",void 0,this.hass)}_renderSearch(){const t=this._searchQuery.trim(),i=this._searchResult,s=e=>"variables"===e.where?"":n(`tools.search_in_${e.where}`,void 0,this.hass),a=e=>e.view.title||e.view.path||n("template_editor.untitled_view",void 0,this.hass);return e`
      <div class="rename">
        <h3>${n("tools.search_header",void 0,this.hass)}</h3>
        <p class="hint">${n("tools.search_hint",void 0,this.hass)}</p>
        ${tn({label:n("tools.search_label",void 0,this.hass),value:this._searchQuery,onInput:e=>{this._searchQuery=e},onKeydown:e=>{"Enter"===e.key&&this._search()}})}
        <ha-button .disabled=${this._searching||!t} @click=${()=>{this._search()}}>
          ${n(this._searching?"tools.searching":"tools.search",void 0,this.hass)}
        </ha-button>
        ${!i||i.cards.length||i.templates.length?e``:e`<p class="hint">${n("tools.search_none",{query:i.query},this.hass)}</p>`}
        ${(null==i?void 0:i.cards.length)?e`
                <p class="hint">${n("tools.search_cards",{count:i.cards.length},this.hass)}</p>
                <ul>
                  ${i.cards.slice(0,Zs).map(t=>e`
                      <li>
                        <a
                          href=${`/${t.urlPath}/${t.view.path||t.view.index}`}
                          target="_blank"
                          rel="noreferrer"
                          >${t.urlPath} › ${a(t)}</a
                        >
                        — ${t.template}: <code>${t.variable}</code> = ${t.value}${s(t)}
                      </li>
                    `)}
                </ul>
                ${i.cards.length>Zs?e`<p class="hint">
                        ${n("editor.matches_more",{count:i.cards.length-Zs},this.hass)}
                      </p>`:e``}
              `:e``}
        ${(null==i?void 0:i.templates.length)?e`
                <p class="hint">${n("tools.search_templates",{count:i.templates.length},this.hass)}</p>
                <ul>
                  ${i.templates.slice(0,Zs).map(t=>e`<li>
                          ${t.urlPath} › ${t.template}: <code>${t.path}</code> = ${t.value}
                        </li>`)}
                </ul>
                ${i.templates.length>Zs?e`<p class="hint">
                        ${n("editor.matches_more",{count:i.templates.length-Zs},this.hass)}
                      </p>`:e``}
              `:e``}
      </div>
    `}async _search(){const e=this._searchQuery.trim();if(e&&!this._searching){this._searching=!0;try{const i=te(),s=Xe(this.hass),n=[{urlPath:i,config:this._savedLovelace}];for(const e of this.hass?await Et(this.hass):[])if(Tt(e)!==i)try{n.push({urlPath:e,config:await et(s,e)})}catch(t){}this._searchResult=Object.assign({query:e},function(e,t){var i;const s=t.trim().toLowerCase(),n=[],a=[];if(!s)return{cards:n,templates:a};const o=e=>e.toLowerCase().includes(s);for(const{urlPath:r,config:l}of e){const e=(e,t)=>{var i,s;const a=(i,s,a)=>{n.push({urlPath:r,view:t,template:e.template,where:i,variable:s,value:a})},l=(e,t,i="")=>{for(const s of I(t)){const[t,n]=Object.entries(s)[0];for(const s of zl(n,`${i}${t}`))o(s.value)&&a(e,s.path,s.value)}};l("variables",e.variables);for(const n of null!==(i=q(e.for_each))&&void 0!==i?i:[])l("for_each",n);const c=null===(s=e.for_each_from)||void 0===s?void 0:s.overrides;if(c&&"object"==typeof c)for(const[n,r]of Object.entries(c))o(n)&&a("overrides",n,n),l("overrides",r,`${n} › `);for(const n of Rl)if(void 0!==e[n])for(const t of zl(e[n],n))o(t.value)&&a("override_block",t.path,t.value)},t=(i,s)=>{if(Array.isArray(i))for(const e of i)t(e,s);else if(i&&"object"==typeof i&&!v(i.type)){Pe.includes(i.type)&&"string"==typeof i.template&&e(i,s);for(const e of Object.values(i))t(e,s)}};(null!==(i=null==l?void 0:l.views)&&void 0!==i?i:[]).forEach((e,i)=>{var s,n,a;return t(e,{title:null!==(n=null!==(s=null==e?void 0:e.title)&&void 0!==s?s:null==e?void 0:e.path)&&void 0!==n?n:"",path:null!==(a=null==e?void 0:e.path)&&void 0!==a?a:"",index:i})});for(const[i,s]of Object.entries(ut(l))){const e=Object.assign({},null!=s?s:{});delete e.type,delete e.template;for(const t of zl(e,""))o(t.value)&&a.push(Object.assign({urlPath:r,template:i},t))}}return{cards:n,templates:a}}(n,e))}finally{this._searching=!1}}}_renderRenameVariable(t){const i=pc(this._config);if(!i.length||!this._config)return e``;const s=this._varFrom&&i.includes(this._varFrom)?this._varFrom:void 0,a=this._varTo.trim(),o=this._varPending,r=!!o&&o.from===s&&o.to===a,l=r&&o.elsewhere.length?n("tools.rename_variable_elsewhere",{list:o.elsewhere.map(e=>`${e.urlPath} (${e.cards})`).join(", ")},this.hass):"";return e`
      <div class="rename">
        <h3>${n("tools.rename_variable_header",void 0,this.hass)}</h3>
        <p class="hint">${n("tools.rename_variable_hint",void 0,this.hass)}</p>
        ${this._varError?e`<ha-alert alert-type="error">${this._varError}</ha-alert>`:e``}
        ${r&&s?e`
                <ha-alert alert-type="warning">
                  ${n("tools.rename_variable_confirm",{from:s,to:a,templates:o.templates,cards:o.cards,elsewhere:l},this.hass)}
                </ha-alert>
                ${sl(this._config,cc(this._config,s,a),this.hass)}
              `:e``}
        <ha-form
          .hass=${this.hass}
          .data=${{variable:null!=s?s:""}}
          .schema=${[{name:"variable",selector:{select:{mode:"dropdown",options:i.map(e=>({value:e,label:e}))}}}]}
          .computeLabel=${()=>n("tools.rename_variable_pick",void 0,this.hass)}
          @value-changed=${this._varPicked}
        ></ha-form>
        ${tn({label:n("tools.new_name",void 0,this.hass),value:this._varTo,disabled:this._busy,onInput:e=>this._varToChanged(e)})}
        <ha-button
          .disabled=${this._busy||!s||!a||a===s}
          @click=${()=>{this._renameVariable(t)}}
        >
          ${n(r?"tools.rename_anyway":"tools.rename_variable",void 0,this.hass)}
        </ha-button>
      </div>
    `}_varPicked(e){e.stopPropagation(),this._varFrom=e.detail.value.variable||void 0,this._varError=void 0,this._varPending=void 0}_varToChanged(e){this._varTo=e,this._varError=void 0,this._varPending=void 0}async _renameVariable(e){var t;const i=this._varFrom,s=this._varTo.trim();if(!i||!s||s===i||!this._config)return;if(!function(e){return/^[A-Za-z0-9_-]+$/.test(e)}(s))return void(this._varError=n("tools.rename_variable_invalid",{name:s},this.hass));const a=G();if(!a)return void(this._varError=n("tools.cannot_save_here",void 0,this.hass));if(function(e,t,i,s){const n=ut(e);for(const a of hc(e,t))if(pc(a===t&&s?s:n[a]).includes(i))return!0;return!1}(a.config,e,s,this._config))return void(this._varError=n("tools.rename_variable_taken",{name:s},this.hass));const o=te(),r=this._varPending;if(r&&r.from===i&&r.to===s){this._busy=!0,this._varError=void 0;try{let t;await X(this,this.hass,"rename_variable",[{urlPath:o,build:n=>(t=hc(n,e),uc(n,e,i,s).config)},...r.elsewhere.map(n=>({urlPath:n.urlPath,build:n=>mc(n,e,o)?uc(n,e,i,s,t).config:n}))],this._config),this._undoChanged=void 0,this._fireConfigChanged(cc(this._config,i,s)),this._varFrom=s,this._varTo="",this._varPending=void 0}catch(l){this._varError=n("tools.save_failed",{message:null!==(t=null==l?void 0:l.message)&&void 0!==t?t:l},this.hass)}finally{this._busy=!1}}else{this._busy=!0;try{const t=Xe(this.hass),n=await et(t,o).catch(()=>a.config),r=uc(n,e,i,s),l=hc(n,e),d=[];for(const a of this.hass?await Et(this.hass):[]){if(Tt(a)===o)continue;let n;try{n=await et(t,a)}catch(c){continue}if(!mc(n,e,o))continue;const r=uc(n,e,i,s,l);(r.cards||r.templates)&&d.push({urlPath:a,cards:r.cards})}this._varPending={from:i,to:s,cards:r.cards,templates:r.templates,elsewhere:d}}finally{this._busy=!1}}}_renderDuplicate(t){const i=this._duplicateTo.trim(),s=!!i&&this._duplicatePending===i;return e`
      <div class="rename">
        <h3>${n("tools.duplicate_header",void 0,this.hass)}</h3>
        <p class="hint">${n("tools.duplicate_hint",void 0,this.hass)}</p>
        ${s?e`<ha-alert alert-type="warning">
                ${n("tools.duplicate_confirm",{to:i,name:t},this.hass)}
              </ha-alert>`:e``}
        ${tn({label:n("tools.copy_name",void 0,this.hass),value:this._duplicateTo,disabled:this._busy,onInput:e=>this._duplicateChanged(e)})}
        <ha-button .disabled=${this._busy||!i||i===t} @click=${this._duplicate}>
          ${n(s?"tools.duplicate_anyway":"tools.duplicate",void 0,this.hass)}
        </ha-button>
      </div>
    `}_duplicateChanged(e){this._duplicateTo=e,this._toolError=void 0,this._duplicatePending=void 0}async _duplicate(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._duplicateTo.trim();if(!i||!s||s===i)return;const a=G();if(a&&void 0!==S(a.config)[s])return void(this._toolError=n("tools.name_taken",{name:s},this.hass));if(this._duplicatePending!==s)return void(this._duplicatePending=s);const o=Object.assign(Object.assign({},this._config),{template:s}),r=ne(null!==(t=null==a?void 0:a.config)&&void 0!==t?t:this.lovelace,i),l=await this._saveDashboard(e=>{var t,i;return Ze(e,null!==(i=null===(t=null==r?void 0:r.view)||void 0===t?void 0:t.index)&&void 0!==i?i:0,o)},"duplicate");l&&(this._duplicateTo="",this._duplicatePending=void 0)}}h([p({attribute:!1})],fc.prototype,"hass",void 0),h([p({attribute:!1})],fc.prototype,"lovelace",void 0),h([p({attribute:!1})],fc.prototype,"config",void 0),h([u()],fc.prototype,"_renameTo",void 0),h([u()],fc.prototype,"_renameError",void 0),h([u()],fc.prototype,"_renaming",void 0),h([u()],fc.prototype,"_renamePending",void 0),h([u()],fc.prototype,"_duplicateTo",void 0),h([u()],fc.prototype,"_duplicatePending",void 0),h([u()],fc.prototype,"_toolError",void 0),h([u()],fc.prototype,"_busy",void 0),h([u()],fc.prototype,"_modernisePending",void 0),h([u()],fc.prototype,"_remoteUsages",void 0),h([u()],fc.prototype,"_undoChanged",void 0),h([u()],fc.prototype,"_similarNames",void 0),h([u()],fc.prototype,"_similarPending",void 0),h([u()],fc.prototype,"_searchQuery",void 0),h([u()],fc.prototype,"_searching",void 0),h([u()],fc.prototype,"_searchResult",void 0),h([u()],fc.prototype,"_varFrom",void 0),h([u()],fc.prototype,"_varTo",void 0),h([u()],fc.prototype,"_varError",void 0),h([u()],fc.prototype,"_varPending",void 0),customElements.get("decluttering-template-usages-tab")||customElements.define("decluttering-template-usages-tab",fc);class gc extends m{constructor(){super(...arguments),this._selectedTab="settings",this._suggestedNothing=!1,this._busy=!1,this._declutterPending=!1,this._promoteName="",this._loadedElements=!1}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=G())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:A()}static describeSchema(){var e;return null!==(e=gc._describeSchema)&&void 0!==e||(gc._describeSchema=[{name:"template",label:n("template_editor.template_label"),selector:{text:{}}},{name:"thingType",label:n("template_editor.type_label"),selector:{select:{mode:"dropdown",options:[{value:"card",label:n("template_editor.type_card")},{value:"badge",label:n("template_editor.type_badge")},{value:"row",label:n("template_editor.type_row")},{value:"element",label:n("template_editor.type_element")}]}}},{name:"description",label:n("template_editor.description_label"),helper:n("template_editor.description_helper"),selector:{text:{multiline:!0}}},{name:"category",label:n("template_editor.category_label"),helper:n("template_editor.category_helper"),selector:{text:{}}}]),gc._describeSchema}static defaultsSchema(){var e;return null!==(e=gc._defaultsSchema)&&void 0!==e||(gc._defaultsSchema=[{name:"default",label:n("template_editor.defaults_label"),helper:n("template_editor.defaults_helper"),selector:{object:{}}}]),gc._defaultsSchema}setConfig(e){this._config=e,this._suggestion=void 0,this._suggestedNothing=!1}render(){var t;if(!this.hass||!this._config)return e``;const i={};E(this._config.default)&&E(this._config.defaults)||(i.default=n("error.variables_shape",void 0,this.hass)),Nt(this._config.variables)||(i.variables=n("template_editor.declarations_shape",void 0,this.hass));const s={template:this._config.template,thingType:null!==(t=N(this._config))&&void 0!==t?t:"card",description:this._config.description,category:this._config.category},a={default:Oe(this._config)},o=C(this._config).length;return e`
      <ha-tab-group .active=${this._selectedTab} @click=${this._activateTab}>
        <ha-tab-group-tab slot="nav" panel="settings">
          ${n("template_editor.tab_settings",void 0,this.hass)}
        </ha-tab-group-tab>
        ${"card"===s.thingType&&void 0===this._config.group?e`
                <ha-tab-group-tab slot="nav" panel="card">
                  ${n("template_editor.tab_card",void 0,this.hass)}
                </ha-tab-group-tab>
                <ha-tab-group-tab slot="nav" panel="change_card">
                  ${n("template_editor.tab_change_card",void 0,this.hass)}
                </ha-tab-group-tab>
              `:"row"===s.thingType?e`<ha-tab-group-tab slot="nav" panel="row">
                  ${n("template_editor.tab_row",void 0,this.hass)}
                </ha-tab-group-tab>`:e``}
        <ha-tab-group-tab slot="nav" panel="usages">
          ${n("template_editor.tab_usages",void 0,this.hass)}
        </ha-tab-group-tab>
        <ha-tab-group-tab slot="nav" panel="share">
          ${n("template_editor.tab_share",void 0,this.hass)}
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
                <span slot="header">${n("template_editor.panel_describe",void 0,this.hass)}</span>
                <div class="panel">
                  ${this._renderInUse()}
                  ${gc.describeSchema().map(t=>e`
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
                  >${n("template_editor.panel_variables",void 0,this.hass)}
                  <small>${n("declarations.count",{count:o},this.hass)}</small></span
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
                      .data=${a}
                      .schema=${gc.defaultsSchema()}
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
                <span slot="header">${n("template_editor.panel_tools",void 0,this.hass)}</span>
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
              ${n(1===t.length?"template_editor.declared_unused_one":"template_editor.declared_unused_many",{names:t.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${i.length?e`<ha-alert alert-type="warning">
              ${n(1===i.length?"template_editor.duplicated_one":"template_editor.duplicated_many",{names:i.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${s.length?e`<ha-alert alert-type="warning">
              ${n(1===s.length?"template_editor.contradictory_one":"template_editor.contradictory_many",{names:s.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_renderLint(){if(!this._config)return e``;const t=this._savedLovelace,i=S(t,void 0,this._config)[this._config.template],s=Js(this._config,[...Ks(i),...Object.keys(J(t))]);return s.length?e`${s.map(t=>e`<ha-alert alert-type=${t.level}>
          ${n(t.key,t.params,this.hass)}${t.params.closest?n("error.did_you_mean",{closest:t.params.closest},this.hass):""}${t.path?n("lint.where",{path:t.path},this.hass):""}
        </ha-alert>`)}`:e``}_renderSortable(t,i,s){const a=(e,i)=>{e.preventDefault();const n=this._dragging;this._dragging=void 0,(null==n?void 0:n.list)===t&&s(n.from,i)};return e`
      <ul>
        ${i.map((o,r)=>e`
            <li
              draggable="true"
              @dragstart=${e=>{var i;this._dragging={list:t,from:r},null===(i=e.dataTransfer)||void 0===i||i.setData("text/plain",o.name),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}}
              @dragover=${e=>{var i;(null===(i=this._dragging)||void 0===i?void 0:i.list)===t&&e.preventDefault()}}
              @drop=${e=>a(e,r)}
              @dragend=${()=>{this._dragging=void 0}}
            >
              <ha-svg-icon class="handle" .path=${en}></ha-svg-icon>
              <span>${o.label}</span>
              <span class="spacer"></span>
              <ha-icon-button
                .path=${"M7,15L12,10L17,15H7Z"}
                .disabled=${0===r}
                .label=${n("template_editor.move_up",{name:o.name},this.hass)}
                @click=${()=>s(r,r-1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,10L12,15L17,10H7Z"}
                .disabled=${r===i.length-1}
                .label=${n("template_editor.move_down",{name:o.name},this.hass)}
                @click=${()=>s(r,r+1)}
              ></ha-icon-button>
            </li>
          `)}
      </ul>
    `}_renderGroupOrder(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.group,s=It(i);if(void 0===i||s.length<2)return e``;const a=s.map((e,t)=>{var i,s,n,a;const o=null!==(n=null!==(s=null!==(i=null==e?void 0:e.name)&&void 0!==i?i:null==e?void 0:e.heading)&&void 0!==s?s:null==e?void 0:e.title)&&void 0!==n?n:null==e?void 0:e.entity,r=String(null!==(a=null==e?void 0:e.type)&&void 0!==a?a:"?").replace(/^custom:/,"");return{label:"string"==typeof o?`${r} (${o})`:r,name:`${t+1} ${r}`}});return e`
      <div class="order">
        <p class="hint">${n("template_editor.group_order_hint",void 0,this.hass)}</p>
        ${this._renderSortable("group",a,(e,t)=>{const n=ge(s,e,t);n!==s&&this._config&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{group:Ft(i,n)}))})}
      </div>
    `}_renderPromote(){const t=Is(this._config);if(!this._config||!t)return e``;const i=function(e){const t=[],i=(e,s)=>{if(Array.isArray(e))e.forEach((e,t)=>i(e,[...s,t]));else if(e&&"object"==typeof e)for(const[t,n]of Object.entries(e))"type"===t&&"string"==typeof n||i(n,[...s,t]);else"string"==typeof e&&l.test(e)||s.length&&null!=e&&("string"!=typeof e&&"number"!=typeof e&&"boolean"!=typeof e||t.push({path:s,value:e,label:Fs(s)}))};return i(e,[]),t}(this._config[t]);if(!i.length)return e``;const s=this._promotePath?JSON.stringify(this._promotePath):"",a=e=>{const t=String(e);return t.length>40?`${t.slice(0,39)}…`:t};return e`
      <ha-expansion-panel outlined class="promote">
        <span slot="header">${n("template_editor.promote_header",void 0,this.hass)}</span>
        <p class="hint">${n("template_editor.promote_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${{setting:s}}
          .schema=${[{name:"setting",selector:{select:{mode:"dropdown",options:i.map(e=>({value:JSON.stringify(e.path),label:`${e.label} = ${a(e.value)}`}))}}}]}
          .computeLabel=${()=>n("template_editor.promote_pick",void 0,this.hass)}
          @value-changed=${this._promotePicked}
        ></ha-form>
        ${this._promotePath?e`
                ${tn({label:n("template_editor.promote_name",void 0,this.hass),value:this._promoteName,onInput:e=>{this._promoteName=e,this._promoteError=void 0}})}
                ${this._promoteError?e`<ha-alert alert-type="error">${this._promoteError}</ha-alert>`:e``}
                <ha-button .disabled=${!this._promoteName.trim()} @click=${this._promote}>
                  ${n("template_editor.promote_button",void 0,this.hass)}
                </ha-button>
              `:e``}
      </ha-expansion-panel>
    `}_promotePicked(e){e.stopPropagation();const t=e.detail.value.setting;t&&(this._promotePath=JSON.parse(t),this._promoteName=function(e,t){const i=[...e].reverse().find(e=>"string"==typeof e),s=e[e.length-1];return Cs(("number"==typeof s?`${null!=i?i:"item"}_${s+1}`:null!=i?i:"value").replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value",t)}(this._promotePath,Ms(this._config)),this._promoteError=void 0)}_promote(){if(!this._config||!this._promotePath)return;const e=this._promoteName.trim(),t=function(e,t,i){if(!Ps.test(i))return{ok:!1,error:"name_invalid"};if(Ms(e).includes(i))return{ok:!1,error:"name_taken"};const s=Is(e),n=s?function(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}(e[s],t):void 0;if(!s||null==n||"object"==typeof n)return{ok:!1,error:"gone"};const a={name:i,type:Vs(n),default:n};return{ok:!0,template:Object.assign(Object.assign({},e),{[s]:Hs(e[s],t,`[[${i}]]`),variables:Fe(e.variables,[a])})}}(this._config,this._promotePath,e);t.ok?(this._promotePath=void 0,this._promoteName="",this._fireConfigChanged(t.template)):this._promoteError=n(`template_editor.promote_${t.error}`,{name:e},this.hass)}_renderInUse(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._savedLovelace;if(!i||!s)return e``;const{views:a,templates:o}=bt(s,i),r=a.reduce((e,t)=>e+t.count,0)+o.length;return r?e`<ha-alert alert-type="info">
      ${n(1===r?"template_editor.in_use_one":"template_editor.in_use_many",{total:r},this.hass)}
    </ha-alert>`:e``}_renderSuggest(t){var i;return t&&(null===(i=this._config)||void 0===i?void 0:i.card)?e`
      <div class="suggest">
        ${this._suggestedNothing?e`<ha-alert alert-type="info">
                ${n("template_editor.suggest_nothing",void 0,this.hass)}
              </ha-alert>`:e``}
        ${this._suggestion?e`<ha-alert alert-type="warning">
                ${n(1===this._suggestion.variables.length?"template_editor.suggest_confirm_one":"template_editor.suggest_confirm_many",{names:this._suggestion.variables.map(e=>e.name).join(", ")},this.hass)}
              </ha-alert>`:e``}
        <ha-button @click=${this._suggest}>
          ${n(this._suggestion?"template_editor.suggest_anyway":"template_editor.suggest_button",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}_suggest(){var e;if(!(null===(e=this._config)||void 0===e?void 0:e.card))return;if(this._suggestion){const e=Object.assign(Object.assign({},this._config),{card:this._suggestion.card});return e.variables=Fe(this._config.variables,this._suggestion.variables),this._suggestion=void 0,void this._fireConfigChanged(e)}this._suggestedNothing=!1;const t=C(this._config).map(e=>e.name),i=function(e,t){const i=new Set(t),s=[],n=new Map,a=(e,t)=>{const a=`${e.base} ${t}`,o=n.get(a);if(o)return o;let r=1,l=e.base;for(;i.has(l);)r+=1,l=`${e.base}_${r}`;return i.add(l),n.set(a,l),s.push({name:l,label:es(e,r),selector:e.selector,default:t}),l},o=e=>{if(Array.isArray(e))return e.map(o);if(!e||"object"!=typeof e)return e;const t={};for(const[i,s]of Object.entries(e)){const e=Object.prototype.hasOwnProperty.call(Xi,i)?Xi[i]:void 0;e&&"string"==typeof s&&!l.test(s)&&e.matches(s)?t[i]=`[[${a(e,s)}]]`:t[i]=o(s)}return t};return{card:o(e),variables:s}}(this._config.card,t);i.variables.length?this._suggestion=i:this._suggestedNothing=!0}_renderDeclutter(){var t,i;const s=this._savedLovelace,a=kt(s),o="card"===N(null!==(t=this._config)&&void 0!==t?t:{})?Mt(s):[];if(!a.length&&!o.length||!this._config)return e``;const r=this._config.template,l=!!r&&r in S(s),c=null!==(i=this._declutterOriginal)&&void 0!==i?i:this._declutterSection;return e`
      <ha-expansion-panel outlined>
        <span slot="header">${n("template_editor.declutter_header",void 0,this.hass)}</span>
        <p class="hint">${n("template_editor.declutter_hint",void 0,this.hass)}</p>
        ${a.length?e`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:a.map((e,t)=>({value:String(t),label:e.label}))}}}]}
                .computeLabel=${()=>n("template_editor.declutter_pick",void 0,this.hass)}
                @value-changed=${e=>this._declutterPicked(e,a)}
              ></ha-form>`:e``}
        ${o.length?e`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:o.map((e,t)=>({value:String(t),label:n(1===e.cards.length?"template_editor.declutter_section_one":"template_editor.declutter_section_many",{where:e.label,count:e.cards.length},this.hass)}))}}}]}
                .computeLabel=${()=>n("template_editor.declutter_pick_section",void 0,this.hass)}
                @value-changed=${e=>this._declutterSectionPicked(e,o)}
              ></ha-form>`:e``}
        ${c?e`
                <ha-button .disabled=${this._busy||!l} @click=${this._declutterReplace}>
                  ${n(this._declutterPending?"template_editor.declutter_replace_confirm":this._declutterSection?"template_editor.declutter_replace_section":"template_editor.declutter_replace",void 0,this.hass)}
                </ha-button>
                ${l?e``:e`<p class="hint">${n("template_editor.declutter_save_first",void 0,this.hass)}</p>`}
              `:e``}
      </ha-expansion-panel>
    `}_declutterPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterOriginal=i.config,this._declutterSection=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{card:JSON.parse(JSON.stringify(i.config))});delete s.group,this._fireConfigChanged(s)}_declutterSectionPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterSection={view:i.view,section:i.section,cards:i.cards},this._declutterOriginal=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{group:{cards:JSON.parse(JSON.stringify(i.cards))}});delete s.card,this._fireConfigChanged(s)}async _declutterReplace(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.template,i=this._declutterOriginal,s=this._declutterSection;if(!t||!i&&!s)return;if(!this._declutterPending)return void(this._declutterPending=!0);const a={type:"custom:decluttering-card-plus",template:t};let o=!1;const r=await this._saveDashboard(e=>{if(i)return ie(e,i,a);const t=Vt(e,s.view,s.section,s.cards,[a]);return o=t===e,t},"declutter");r&&o&&(this._toolError=n("template_editor.declutter_section_changed",void 0,this.hass)),r&&(this._declutterPending=!1,this._declutterOriginal=void 0,this._declutterSection=void 0)}_selectTab(e){e.stopPropagation(),this._selectedTab=e.detail}_activateTab(e){const t=e.composedPath().find(e=>"ha-tab-group-tab"===e.localName),i=null==t?void 0:t.getAttribute("panel");i&&(this._selectedTab=i)}_describeChanged(e){var t;if(!this._config)return;const i=Object.assign({template:this._config.template,thingType:null!==(t=N(this._config))&&void 0!==t?t:"card",description:this._config.description,category:this._config.category},e.detail.value),s=Object.assign(Object.assign({},this._config),{template:i.template});P(s,"description",i.description),P(s,"category",i.category);const n=void 0!==s.group&&"card"===i.thingType;n||delete s.group;for(const[a,o]of Object.entries(Ys))gc.stubMember(!n&&i.thingType===a,s,a,o);this._fireConfigChanged(s)}_declarationsChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);P(t,"variables",e.detail.value),this._fireConfigChanged(t)}_defaultsChanged(e){if(!this._config)return;const t=e.detail.value,i=Object.assign(Object.assign({},this._config),{default:t.default});void 0!==this._config.defaults&&(JSON.stringify(t.default)===JSON.stringify(Oe(this._config))?i.default=this._config.default:delete i.defaults),this._fireConfigChanged(i)}_childConfigChanged(e){e.stopPropagation(),this._fireConfigChanged(e.detail.config)}_cardChanged(e){if(e.stopPropagation(),!this._config)return;this._suggestion=void 0,this._suggestedNothing=!1;const t=Object.assign(Object.assign({},this._config),{card:e.detail.config});this._fireConfigChanged(t)}_cardPicked(e){this._selectedTab="card",this._cardChanged(e)}_rowChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign(Object.assign({},this._config),{row:e.detail.config});this._fireConfigChanged(t)}_fireConfigChanged(e){this._suggestion=void 0,this._suggestedNothing=!1,g(this,"config-changed",{config:e})}static stubMember(e,t,i,s){e?i in t||(t[i]=s):delete t[i]}static get styles(){return nn}_saveDashboard(e,t,i){return sn(this,e,t,i)}async connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=k(()=>this.requestUpdate())),this._loadedElements||(await j(),await async function(){let e=customElements.get("hui-entities-card");if(!e){if(!ze)return;(await ze).createCardElement({type:"entities",entities:[]}),await customElements.whenDefined("hui-entities-card"),e=customElements.get("hui-entities-card")}e&&e.getConfigElement&&await e.getConfigElement()}(),this._loadedElements=!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}}h([u()],gc.prototype,"_config",void 0),h([u()],gc.prototype,"_selectedTab",void 0),h([u()],gc.prototype,"_suggestion",void 0),h([u()],gc.prototype,"_suggestedNothing",void 0),h([u()],gc.prototype,"_toolError",void 0),h([u()],gc.prototype,"_busy",void 0),h([u()],gc.prototype,"_declutterOriginal",void 0),h([u()],gc.prototype,"_declutterSection",void 0),h([u()],gc.prototype,"_declutterPending",void 0),h([u()],gc.prototype,"_promotePath",void 0),h([u()],gc.prototype,"_promoteName",void 0),h([u()],gc.prototype,"_promoteError",void 0),h([p()],gc.prototype,"lovelace",void 0),h([p()],gc.prototype,"hass",void 0);class vc extends m{connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=k(()=>this.requestUpdate()))}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}static get styles(){return f`
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
    `}render(){var t,i,s,a,o,r,l,c,d;const h=this.lovelace,p=Ae(h);if(p&&(null===(t=this._borrowed)||void 0===t?void 0:t.ll)!==h){this._borrowed={ll:h};const e=new Set(Object.keys(S(h)));Se(this.hass,h).then(t=>{var i;(null===(i=this._borrowed)||void 0===i?void 0:i.ll)===h&&(this._borrowed={ll:h,names:Object.keys(t).filter(t=>!e.has(t)),templates:t})})}const u=p&&!(null===(i=this._borrowed)||void 0===i?void 0:i.names),m=Ht(h,p&&null!==(a=null===(s=this._borrowed)||void 0===s?void 0:s.names)&&void 0!==a?a:[]),f=u?Object.assign(Object.assign({},m),{missingTemplates:[]}):m,g=Dt(h),v=qt(h),_=null===(o=this._borrowed)||void 0===o?void 0:o.names,y=this._examplesChecked;u||(null==y?void 0:y.ll)===h&&(null==y?void 0:y.borrowed)===_||(this._examplesChecked={ll:h,borrowed:_,failed:lt(S(h),null!=_?_:[],this.hass)});const b=u?[]:null!==(l=null===(r=this._examplesChecked)||void 0===r?void 0:r.failed)&&void 0!==l?l:[],$=ac(h,null!==(d=null===(c=this._borrowed)||void 0===c?void 0:c.templates)&&void 0!==d?d:S(h)),w=!(f.missingTemplates.length||f.unsetVariables.length||f.unusedTemplates.length||g.length||v.length||b.length||$.length);return e`
      <ha-expansion-panel outlined>
        <span slot="header">${n("tools.health_header",void 0,this.hass)}</span>
        <slot></slot>
        ${w?e`<p class="hint">${n("tools.health_ok",void 0,this.hass)}</p>`:e`
                ${b.map(t=>e`<ha-alert alert-type="error">
                      ${n("tools.health_example",{template:t.template,number:t.example,problems:t.problems.join(" ")},this.hass)}
                    </ha-alert>`)}
                ${g.map(t=>e`<ha-alert alert-type="error">
                      ${n("tools.health_extends_loop",{path:t.join(" → ")},this.hass)}
                    </ha-alert>`)}
                ${f.missingTemplates.map(t=>e`<ha-alert alert-type="error">
                      ${n("tools.health_missing",{template:t.template,count:t.count},this.hass)}${t.closest?n("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${f.unsetVariables.map(t=>e`<ha-alert alert-type="warning">
                      ${n("tools.health_unset",{template:t.template,names:t.names.join(", "),count:t.count},this.hass)}
                    </ha-alert>`)}
                ${v.map(t=>{const i=[...t.views.map(e=>n("tools.health_view_uses",{view:e.title||n("template_editor.untitled_view",void 0,this.hass),count:e.count},this.hass)),...t.templates.map(e=>n("tools.health_template_uses",{name:e},this.hass))].join(", ");return e`<ha-alert alert-type="warning">
                    ${t.message?n("tools.health_deprecated_because",{template:t.template,message:t.message,uses:i},this.hass):n("tools.health_deprecated",{template:t.template,uses:i},this.hass)}
                  </ha-alert>`})}
                ${$.map(t=>e`<ha-alert alert-type="warning">
                      ${n("tools.health_unread",{template:t.template,name:t.name,count:t.count,view:t.view.title||t.view.path||n("template_editor.untitled_view",void 0,this.hass)},this.hass)}${"variables"===t.where?"":n(`tools.health_unread_${t.where}`,void 0,this.hass)}${t.closest?n("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${f.unusedTemplates.length?e`<ha-alert alert-type="info">
                        ${n("tools.health_unused",{names:f.unusedTemplates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
              `}
        ${this._renderTimings()}
      </ha-expansion-panel>
    `}_renderTimings(){const t=Rt.entries(),i=e=>e.toFixed(1),s=e`<h4 class="timings-header">${n("tools.timings_header",void 0,this.hass)}</h4>`;if(!t.length)return e`${s}
        <p class="hint">${n("tools.timings_none",void 0,this.hass)}</p>`;const{byTotal:a,byMax:o,repeats:r}=zt(t);return e`
      ${s}
      <p class="hint">${n("tools.timings_hint",{count:t.length},this.hass)}</p>
      <p class="hint">${n("tools.timings_by_total",void 0,this.hass)}</p>
      <ul class="timings">
        ${a.map(t=>e`<li>
              ${n(1===t.builds?"tools.timings_total_row_one":"tools.timings_total_row",{template:t.template,total:i(t.total),builds:t.builds,max:i(t.max)},this.hass)}
            </li>`)}
      </ul>
      <p class="hint">${n("tools.timings_by_max",void 0,this.hass)}</p>
      <ul class="timings">
        ${o.map(t=>e`<li>
              ${n("tools.timings_max_row",{template:t.template,max:i(t.max)},this.hass)}
            </li>`)}
      </ul>
      ${r.length?e`
              <p class="hint">${n("tools.timings_repeats",void 0,this.hass)}</p>
              <ul class="timings">
                ${r.map(t=>{var i;return e`<li>
                      ${n(t.name?"tools.timings_repeat_named_row":"tools.timings_repeat_row",{template:t.template,name:null!==(i=t.name)&&void 0!==i?i:"",copies:t.copies},this.hass)}
                    </li>`})}
              </ul>
            `:e``}
    `}}h([p({attribute:!1})],vc.prototype,"hass",void 0),h([p({attribute:!1})],vc.prototype,"lovelace",void 0),h([u()],vc.prototype,"_borrowed",void 0),Ut(Wt,Yi),Ut(Bt,gc),Ut(Kt,vc);export{Yi as DeclutteringCardEditor,vc as DeclutteringHealthPanel,gc as DeclutteringTemplateEditor};
//# sourceMappingURL=decluttering-card-plus.editors-vJYguHf6.js.map
