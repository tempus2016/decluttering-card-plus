import{b as e,O as t,c as i,d as s,l as a,e as o,v as r,f as n,P as l,g as d,h,_ as c,n as u,a as p,j as m,k as _,m as v,o as g,p as f,B as y,q as b,t as $,u as w,w as x,x as k,y as j,z as O,C as A,D as S,E as P,F as C,G as E,H as L,I as T,J as V,K as N,L as H,M,N as D,Q as q,R as z,T as R,U,W as I,X as J,Y as F,Z as W,$ as B,a0 as Z,a1 as K,a2 as Y,a3 as Q,a4 as G,a5 as X,a6 as ee,a7 as te,a8 as ie,a9 as se,aa as ae,ab as oe,ac as re,ad as ne,ae as le,af as de,ag as he,ah as ce,ai as ue,aj as pe,ak as me,al as _e,am as ve,an as ge,ao as fe,ap as ye,aq as be,ar as $e,as as we,at as xe,au as ke,av as je,aw as Oe,ax as Ae,ay as Se,az as Pe,aA as Ce,aB as Ee,aC as Le,aD as Te,aE as Ve,aF as Ne,aG as He,aH as Me,aI as De,aJ as qe,aK as ze,aL as Re,aM as Ue,aN as Ie,aO as Je,aP as Fe,A as We,aQ as Be,aR as Ze,aS as Ke,aT as Ye,aU as Qe,aV as Ge,aW as Xe,aX as et,aY as tt,aZ as it,a_ as st,V as at,a$ as ot,b0 as rt,b1 as nt,b2 as lt,b3 as dt,b4 as ht,b5 as ct,b6 as ut,b7 as pt,b8 as mt,b9 as _t,ba as vt,bb as gt,bc as ft,bd as yt,be as bt,bf as $t,bg as wt,bh as xt,bi as kt,bj as jt,bk as Ot,bl as At,bm as St,bn as Pt,bo as Ct,bp as Et,bq as Lt,br as Tt,bs as Vt,bt as Nt,bu as Ht,bv as Mt,bw as Dt,bx as qt,by as zt,bz as Rt,bA as Ut,bB as It,bC as Jt}from"./decluttering-card-plus.core-BlnNs9wI.js";import{l as Ft}from"./decluttering-card-plus.placeholder-tool-DqzvsVUO.js";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Wt=Symbol.for(""),Bt=e=>{if(e?.r===Wt)return e?._$litStatic$},Zt=e=>({_$litStatic$:e,r:Wt}),Kt=new Map,Yt=(e=>(t,...i)=>{const s=i.length;let a,o;const r=[],n=[];let l,d=0,h=!1;for(;d<s;){for(l=t[d];d<s&&void 0!==(o=i[d],a=Bt(o));)l+=a+t[++d],h=!0;d!==s&&n.push(o),r.push(l),d++}if(d===s&&r.push(t[s]),h){const e=r.join("$$lit$$");void 0===(t=Kt.get(e))&&(r.raw=r,Kt.set(e,t=r)),i=n}return e(t,...i)})(e),Qt=["grid_options","style",t,"strict","rebuild_on","debug","name","inherit_variables"];function Gt(e){return"number"==typeof e&&Number.isFinite(e)?String(e):"string"==typeof e&&e.trim()?e.trim():void 0}function Xt(e){if("number"==typeof e)return e;if("string"!=typeof e||!e.trim())return;const t=e.trim(),i=Number(t);return Number.isFinite(i)&&/^\d+$/.test(t)?i:t}function ei(e){return e===s?"hide":e&&"object"==typeof e&&!Array.isArray(e)?"card":"show"}function ti(e){const s={on_error_mode:ei(e[t]),debug:(a=e.debug,!0===a?"json":"yaml"===a||"console"===a||"report"===a?a:"off")};var a;const o=e.grid_options,r=Gt(null==o?void 0:o.columns),n=Gt(null==o?void 0:o.rows);void 0!==r&&(s.grid_columns=r),void 0!==n&&(s.grid_rows=n),"string"==typeof e.style&&e.style&&(s.style=e.style),!0===e.strict&&(s.strict=!0);const l=i(e.rebuild_on);return l.length&&(s.rebuild_on=l),"string"==typeof e.name&&e.name&&(s.name=e.name),!0===e.inherit_variables&&(s.inherit_variables=!0),s}function ii(e,a){var o;const r=Object.assign({},e),n=Object.assign({},null!==(o=e.grid_options)&&void 0!==o?o:{}),l=Xt(a.grid_columns),d=Xt(a.grid_rows);void 0===l?delete n.columns:n.columns=l,void 0===d?delete n.rows:n.rows=d,Object.keys(n).length?r.grid_options=n:delete r.grid_options;const h="string"==typeof a.style?a.style:"";switch(h.trim()?r.style=h:delete r.style,a.on_error_mode){case"hide":r[t]=s;break;case"card":"card"!==ei(e[t])&&delete r[t];break;default:delete r[t]}!0===a.strict?r.strict=!0:delete r.strict;const c=i(a.rebuild_on);switch(c.length?r.rebuild_on=c:delete r.rebuild_on,a.debug){case"json":r.debug=!0;break;case"yaml":case"console":case"report":r.debug=a.debug;break;default:delete r.debug}const u="string"==typeof a.name?a.name.trim():"";return u?r.name=u:delete r.name,!0===a.inherit_variables?r.inherit_variables=!0:delete r.inherit_variables,r}function si(e){const i=e[t];return i&&"object"==typeof i&&!Array.isArray(i)?i:void 0}function ai(e,i){const s=Object.assign({},e);return i&&"object"==typeof i?s[t]=i:delete s[t],s}const oi=["1","2","3","4","5","6","7","8","9","10","11","12","full"],ri=["1","2","3","4","5","6","7","8","auto"];const ni=["for_each","for_each_from","columns","min_column_width","gap","lazy","lazy_eager","empty"],li=["repeat","extras","fit","advanced",...Qt],di={grid_options:["grid_columns","grid_rows"],on_error:["on_error_mode"]};function hi(e){const t=null==e?void 0:e.editor_hide;return(Array.isArray(t)?t:void 0===t?[]:[t]).filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>e.trim().toLowerCase())}const ci=(e,t)=>void 0!==(null==e?void 0:e[t]);function ui(e,t,i){const s=new Set(hi(e)),a=Qt.some(e=>ci(t,e));return{repeat:s.has("repeat")&&!ni.some(e=>ci(t,e)),extras:s.has("extras")&&!(null==i?void 0:i.length),fit:s.has("fit")&&!ci(t,"fit"),advanced:s.has("advanced")&&!a,advancedFields:[].concat(...Qt.filter(e=>s.has(e)&&!ci(t,e)).map(e=>{var t;return null!==(t=di[e])&&void 0!==t?t:[e]}))}}function pi(e,t,i,s){if(void 0===e)return;const a=JSON.stringify(e);if("string"!=typeof a||!l.test(a))return e;let o,r=!1;try{o=d(h(t),i,{value:e},void 0,s,!0,()=>{r=!0})}catch(u){return}if(r)return;const n=null==o?void 0:o.value,c=JSON.stringify(n);return"string"==typeof c&&l.test(c)?void 0:n}function mi(e,t){return e===t||"object"==typeof e&&null!==e&&"object"==typeof t&&null!==t&&JSON.stringify(e)===JSON.stringify(t)}const _i="decluttering-card-plus-card-slot";class vi extends m{constructor(){super(...arguments),this.label="",this.emptyHint="",this._picking=!1,this._editing=!1}static get styles(){return _`
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
    `}render(){const t=function(e){var t,i,s,o;if(!e||"object"!=typeof e||Array.isArray(e))return;const r=e,n="string"==typeof r.type?r.type:"",l=n.startsWith("custom:")?n.slice(7):n?n[0].toUpperCase()+n.slice(1):"",d=e=>"string"==typeof e&&e.trim()?e.split("\n")[0].trim():void 0,h=Array.isArray(r.cards)?r.cards.length:void 0;return{type:l,text:null!==(o=null!==(s=null!==(i=null!==(t=d(r.content))&&void 0!==t?t:d(r.title))&&void 0!==i?i:d(r.name))&&void 0!==s?s:d(r.entity))&&void 0!==o?o:void 0!==h?a("editor.slot.cards",{count:h}):""}}(this.value);return e`
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
    `}_togglePick(){this._picking=!this._picking}_toggleEdit(){this._editing=!this._editing}_picked(e){var t;e.stopPropagation(),this._picking=!1,this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_edited(e){var t;e.stopPropagation(),this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_set(e){this._editing=this._editing&&!!e,v(this,"value-changed",{value:e&&"object"==typeof e?e:void 0})}}function gi(e,t){const i=Math.max(0,t-e);return i<1?"<1 ms":`${Math.round(i)} ms`}c([u({attribute:!1})],vi.prototype,"hass",void 0),c([u({attribute:!1})],vi.prototype,"lovelace",void 0),c([u({attribute:!1})],vi.prototype,"value",void 0),c([u()],vi.prototype,"label",void 0),c([u()],vi.prototype,"emptyHint",void 0),c([p()],vi.prototype,"_picking",void 0),c([p()],vi.prototype,"_editing",void 0),"undefined"==typeof customElements||customElements.get(_i)||customElements.define(_i,vi);const fi="decluttering-card-plus-return";function yi(e){try{return"undefined"==typeof sessionStorage?void 0:sessionStorage}catch(t){return}}const bi="default";function $i(e){const t=null==e?void 0:e[y];return t&&"object"==typeof t&&!Array.isArray(t)?t:void 0}function wi(e,t,i){var s,a;const o={};for(const n of t){const e=null===(s=n.domain)||void 0===s?void 0:s.trim(),t=null===(a=n.template)||void 0===a?void 0:a.trim();e&&t&&e!==bi&&(o[e]=t)}(null==i?void 0:i.trim())&&(o[bi]=i.trim());const r=Object.assign({},e);return Object.keys(o).length?r[y]=o:delete r[y],r}function xi(e,t){const i=new Set(t.map(e=>e.domain));return e.filter(e=>!i.has(e))}const ki=["entities","areas","devices","floors","labels","views"];function ji(e){if(!e||"object"!=typeof e||Array.isArray(e))return;const t=e;if(void 0!==t.template||void 0!==t.range||void 0!==t.with)return;if(void 0!==t.exclude&&"object"==typeof t.exclude&&!Array.isArray(t.exclude))return;const i=ki.filter(e=>void 0!==t[e]);return i.length>1?void 0:1===i.length?i[0]:b(e)?"entities":void 0}function Oi(e){var t;return void 0!==e.for_each_from?null!==(t=ji(e.for_each_from))&&void 0!==t?t:"other":void 0!==e.for_each?"list":"none"}function Ai(e){if(null==e||!0===e)return;return(Array.isArray(e)?e:[e]).filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>e.trim())}function Si(e){const t="number"==typeof e?e:"string"==typeof e&&e.trim()?Number(e):NaN;return Number.isFinite(t)?t:void 0}const Pi=["domain","area","floor","label","device_class","integration","exclude"];function Ci(e){if(e&&e.length)return 1===e.length?e[0]:e}function Ei(e,t){var i,s;const a=Object.assign({},null!=e?e:{});a[null!==(i=ji(e))&&void 0!==i?i:"entities"]=!t.patterns||!t.patterns.length||Ci(t.patterns.map(e=>e.trim()).filter(Boolean));for(const l of Pi){const e=Ci(null===(s=t[l])||void 0===s?void 0:s.filter(e=>e.trim()));void 0===e?delete a[l]:a[l]=e}const o=[t.sort,t.then].filter(e=>"string"==typeof e&&""!==e.trim());o.length?a.sort=1===o.length?o[0]:o:delete a.sort,!0===t.reverse?a.reverse=!0:delete a.reverse;const r=Si(t.limit);void 0===r?delete a.limit:a.limit=r;const n=Si(t.offset);return void 0===n||0===n?delete a.offset:a.offset=n,"string"==typeof t.group_by&&t.group_by?a.group_by=t.group_by:delete a.group_by,!0===t.entity_category?Array.isArray(a.entity_category)||"string"==typeof a.entity_category||(a.entity_category="all"):delete a.entity_category,a}function Li(e){return e.split(".")[0]}function Ti(e){var t;return[...new Set(Object.keys(null!==(t=null==e?void 0:e.states)&&void 0!==t?t:{}).map(Li))].sort()}function Vi(e){var t,i;const s=new Set;for(const a of Object.values(null!==(t=null==e?void 0:e.states)&&void 0!==t?t:{})){const e=null===(i=null==a?void 0:a.attributes)||void 0===i?void 0:i.device_class;"string"==typeof e&&e&&s.add(e)}return[...s].sort()}function Ni(e){var t;const i=new Set;for(const s of Object.values(null!==(t=null==e?void 0:e.entities)&&void 0!==t?t:{}))"string"==typeof(null==s?void 0:s.platform)&&s.platform&&i.add(s.platform);return[...i].sort()}const Hi=["name","-name","entity","area","floor","domain","entity_count","none"],Mi=["","area","floor","domain","label"];function Di(e,t){return{select:{mode:"dropdown",multiple:!0,custom_value:!0,options:[...e,...(null!=t?t:[]).filter(t=>!e.includes(t))].map(e=>({value:e,label:e}))}}}function qi(e,t){const i=["none","list",...ki];return"other"===t&&i.push("other"),i.map(t=>({value:t,label:a(`editor.repeat.mode_${t}`,void 0,e)}))}const zi="variable:";function Ri(e,t,i){var s;const o=e&&"object"==typeof e?e:{},r=null!==(s=["areas","devices","floors","labels","views","entities"].find(e=>void 0!==o[e]))&&void 0!==s?s:b(e)?"entities":"items";return a(`editor.matches_${r}_${1===t?"one":"many"}`,void 0,i)}let Ui,Ii;function Ji(e,t){const i=e.indexOf(t);return-1===i?[e,""]:[e.slice(0,i),e.slice(i+t.length)]}const Fi=new Set(["true","yes","on","1"]),Wi=/:host|\.decluttering-container/;class Bi extends m{constructor(){super(...arguments),this._shownAs=new Map,this._loadingTemplates=!1,this._ejectPending=!1,this._sectionsPending=!1,this._previewMode="yaml",this._copied=!1,this._markedLines=[],this._cannotOpen=!1,this._matchesOpen=!1,this._openItems=new Set,this._renderedTemplates={},this._renderingTemplates=new Set}static get styles(){return _`
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
    `}set lovelace(e){this._lovelace=e,this._templates=void 0,this._schema=void 0}_editingPlace(){const e=$(this),t=e?w(e):void 0;return null!=t?t:{view:x(this._lovelace)}}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}async connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=k(()=>this.requestUpdate())),await j()}setConfig(e){this._openedWith||(this._openedWith=e,this._resume=function(e,t,i=Date.now()){var s;const a=yi();if(!a)return;let o;try{const e=a.getItem(fi);o=e?JSON.parse(e):void 0}catch(r){o=void 0}if(o)if(i-o.at>18e5)a.removeItem(fi);else if(JSON.stringify(null!==(s=o.openedWith)&&void 0!==s?s:null)===JSON.stringify(null!=e?e:null))return a.removeItem(fi),o}(e)),this._config=e}willUpdate(){var e;if(this.hass&&this._config&&(this._lovelace||(this._lovelace=null!==(e=O())&&void 0!==e?e:void 0),this._lovelace)){if(!this._templates){const e=this._editingPlace();this._templates=A(this._lovelace,e.view,void 0,e.section),this._loadBorrowedTemplates()}this._schema||(this._schema=[{name:"template",label:a("editor.template_label",void 0,this.hass),selector:{select:{mode:"dropdown",custom_value:!0,options:S(this._templates,this.hass)}}},{name:"variables",label:a("editor.variables_label",void 0,this.hass),helper:a("editor.variables_helper",void 0,this.hass),selector:{object:{}}}])}}render(){if(!(this.hass&&this._config&&this._templates&&this._schema))return e``;const t=this._templates[this._config.template],i=P(t),s=this._hiddenNames(t,i),o=i.filter(e=>!s.has(e.name)),r=C(this._config.variables),n=E(this._config),l=!!t&&"card"===L(t)||!!n||void 0!==this._config.for_each||void 0!==this._config.for_each_from,d=this._formData(i),h=ui(t,this._config,d.extras),c={};t||this._loadingTemplates||n&&!this._config.template||(c.template=a("editor.no_such_template",void 0,this.hass)),r||(c.variables=a("error.variables_shape",void 0,this.hass));const u=f(t);return e`
      ${(null==t?void 0:t.description)?e`<p class="description">${t.description}</p>`:e``}
      ${n?this._renderByDomain(n):e``}
      ${void 0===u?e``:e`<ha-alert alert-type="warning">
              ${u?a("editor.template_deprecated_because",{message:u},this.hass):a("editor.template_deprecated",void 0,this.hass)}
            </ha-alert>`}
      ${this._renderResume()} ${this._renderResult(t)} ${this._renderSource(t)}
      ${this._renderStartFromExample(t)} ${this._renderDiagnostics(t,r)}
      <ha-form
        .hass=${this.hass}
        .data=${d}
        .schema=${this._formSchema(o,h,t)}
        .error=${c}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._renderCardVariables(o)} ${this._renderRepeat(l&&!h.repeat,t)}
      ${this._renderLayout(d,l&&!h.repeat,h)} ${this._renderEmptySlot(l)}
      ${this._renderAdvanced(h)} ${this._renderSectionPerCopy()}
      <decluttering-card-plus-health .hass=${this.hass} .lovelace=${this._lovelace}></decluttering-card-plus-health>
    `}_renderAdvanced(t){if(!this._config||t.advanced)return e``;const i=function(e){const t=ti(e);let i=0;return void 0===t.grid_columns&&void 0===t.grid_rows||(i+=1),void 0!==t.style&&(i+=1),"show"!==t.on_error_mode&&(i+=1),t.strict&&(i+=1),t.rebuild_on&&(i+=1),"off"!==t.debug&&(i+=1),void 0!==t.name&&(i+=1),t.inherit_variables&&(i+=1),i}(this._config),s=ti(this._config),o=this._onErrorMode&&"card"!==s.on_error_mode?Object.assign(Object.assign({},s),{on_error_mode:this._onErrorMode}):s;"card"===s.on_error_mode&&this._onErrorMode&&(this._onErrorMode=void 0);const r=si(this._config),n=Zt(_i);return e`
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
            .data=${o}
            .schema=${function(e,t){return t.length?e.filter(e=>!t.includes(null==e?void 0:e.name)):e}(function(e){const t=t=>a(t,void 0,e),i=(e,i)=>e.map(e=>({value:e,label:/^\d+$/.test(e)?e:t(`${i}${e}`)}));return[{name:"grid_columns",label:t("editor.advanced.grid_columns_label"),helper:t("editor.advanced.grid_helper"),selector:{select:{mode:"dropdown",custom_value:!0,options:i(oi,"editor.advanced.grid_")}}},{name:"grid_rows",label:t("editor.advanced.grid_rows_label"),selector:{select:{mode:"dropdown",custom_value:!0,options:i(ri,"editor.advanced.grid_")}}},{name:"style",label:t("editor.advanced.style_label"),helper:t("editor.advanced.style_helper"),selector:{text:{multiline:!0}}},{name:"on_error_mode",label:t("editor.advanced.on_error_label"),helper:t("editor.advanced.on_error_helper"),selector:{select:{mode:"dropdown",options:[{value:"show",label:t("editor.advanced.on_error_show")},{value:"hide",label:t("editor.advanced.on_error_hide")},{value:"card",label:t("editor.advanced.on_error_card")}]}}},{name:"strict",label:t("editor.advanced.strict_label"),helper:t("editor.advanced.strict_helper"),selector:{boolean:{}}},{name:"rebuild_on",label:t("editor.advanced.rebuild_on_label"),helper:t("editor.advanced.rebuild_on_helper"),selector:{entity:{multiple:!0}}},{name:"debug",label:t("editor.advanced.debug_label"),helper:t("editor.advanced.debug_helper"),selector:{select:{mode:"dropdown",options:[{value:"off",label:t("editor.advanced.debug_off")},{value:"json",label:t("editor.advanced.debug_json")},{value:"yaml",label:t("editor.advanced.debug_yaml")},{value:"console",label:t("editor.advanced.debug_console")},{value:"report",label:t("editor.advanced.debug_report")}]}}},{name:"name",label:t("editor.advanced.name_label"),helper:t("editor.advanced.name_helper"),selector:{text:{}}},{name:"inherit_variables",label:t("editor.advanced.inherit_label"),helper:t("editor.advanced.inherit_helper"),selector:{boolean:{}}}]}(this.hass),t.advancedFields)}
            .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
            .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
            @value-changed=${this._advancedChanged}
          ></ha-form>
          ${"card"===o.on_error_mode?Yt`<${n}
                  .hass=${this.hass}
                  .lovelace=${this._lovelace}
                  .value=${r}
                  .label=${a("editor.advanced.fallback_label",void 0,this.hass)}
                  .emptyHint=${a("editor.advanced.fallback_hint",void 0,this.hass)}
                  @value-changed=${this._fallbackChanged}
                ></${n}>`:e``}
        </div>
      </ha-expansion-panel>
    `}_advancedChanged(e){if(e.stopPropagation(),!this._config)return;const t=e.detail.value;this._onErrorMode="card"!==t.on_error_mode||si(this._config)?void 0:"card",v(this,"config-changed",{config:ii(this._config,t)})}_fallbackChanged(e){e.stopPropagation(),this._config&&(e.detail.value&&(this._onErrorMode=void 0),v(this,"config-changed",{config:ai(this._config,e.detail.value)}))}_renderEmptySlot(t){if(!this._config||!t)return e``;if(!(void 0!==this._config.for_each||void 0!==this._config.for_each_from||void 0!==this._config.empty))return e``;const i=Zt(_i),s=this._config.empty;return Yt`<${i}
      .hass=${this.hass}
      .lovelace=${this._lovelace}
      .value=${s&&"object"==typeof s?s:void 0}
      .label=${a("editor.empty_label",void 0,this.hass)}
      .emptyHint=${a("editor.empty_slot_hint",void 0,this.hass)}
      @value-changed=${this._emptyChanged}
    ></${i}>`}_emptyChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);T(t,"empty",e.detail.value),v(this,"config-changed",{config:t})}_renderStartFromExample(t){const i=V(t);return i.length&&this._config&&!N(this._config.variables).length?e`
      <div class="examples">
        <p class="hint">${a("editor.start_from_example_hint",void 0,this.hass)}</p>
        ${i.map((t,i)=>e`
            <ha-button @click=${()=>this._startFromExample(t)}>
              ${a("editor.start_from_example",{number:i+1},this.hass)}
            </ha-button>
          `)}
      </div>
    `:e``}_startFromExample(e){e.length&&v(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{variables:e})})}_renderByDomain(t){var i,s;if(!this._config)return e``;if(!function(e){const t=$i(e);return!t||Object.values(t).every(e=>"string"==typeof e)}(this._config))return e`<ha-alert alert-type="info">
        ${a("editor.by_domain_hint",{templates:Object.entries(t).map(([e,t])=>`${e}: ${t}`).join(", ")},this.hass)}
      </ha-alert>`;const{rows:o,fallback:r}=function(e){var t;const i=null!==(t=$i(e))&&void 0!==t?t:{};return{rows:Object.entries(i).filter(([e,t])=>e!==bi&&"string"==typeof t).map(([e,t])=>({domain:e,template:t})),fallback:"string"==typeof i[bi]?i[bi]:void 0}}(this._config),n=null!==(i=this._byDomainDraft)&&void 0!==i?i:o,l=function(e,t){return Object.keys(e).filter(t=>{return!!(i=e[t])&&(void 0!==i.card||void 0!==i.group);var i}).sort().map(i=>({value:i,label:void 0!==f(e[i])?i+a("editor.deprecated_suffix",void 0,t):i}))}(null!==(s=this._templates)&&void 0!==s?s:{},this.hass),d=Ti(this.hass),h=(e,t)=>{const i=e.every(e=>{var t,i;return(null===(t=e.domain)||void 0===t?void 0:t.trim())&&(null===(i=e.template)||void 0===i?void 0:i.trim())});this._byDomainDraft=i?void 0:e,v(this,"config-changed",{config:wi(this._config,e,t)})};return e`
      <div class="by-domain">
        <h3>${a("editor.by_domain.header",void 0,this.hass)}</h3>
        <p class="hint">${a("editor.by_domain.hint",void 0,this.hass)}</p>
        ${n.map((t,i)=>{return e`
            <div class="bd-row">
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",custom_value:!0,options:(s=t.domain,[...new Set([s,...d])].filter(Boolean).map(e=>({value:e,label:e})))}}}
                .value=${t.domain}
                .label=${a("editor.by_domain.domain",void 0,this.hass)}
                @value-changed=${e=>{e.stopPropagation(),h(n.map((t,s)=>{var a;return s===i?Object.assign(Object.assign({},t),{domain:String(null!==(a=e.detail.value)&&void 0!==a?a:"")}):t}),null!=r?r:"")}}
              ></ha-selector>
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",options:l}}}
                .value=${t.template}
                .label=${a("editor.by_domain.template",void 0,this.hass)}
                @value-changed=${e=>{e.stopPropagation(),h(n.map((t,s)=>{var a;return s===i?Object.assign(Object.assign({},t),{template:String(null!==(a=e.detail.value)&&void 0!==a?a:"")}):t}),null!=r?r:"")}}
              ></ha-selector>
              <ha-icon-button
                .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                .label=${a("editor.by_domain.remove",{domain:t.domain},this.hass)}
                @click=${()=>h(n.filter((e,t)=>t!==i),null!=r?r:"")}
              ></ha-icon-button>
            </div>
          `;var s})}
        <div class="bd-row">
          <span class="bd-default">${a("editor.by_domain.anything_else",void 0,this.hass)}</span>
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:l}}}
            .value=${null!=r?r:""}
            .label=${a("editor.by_domain.template",void 0,this.hass)}
            @value-changed=${e=>{var t;e.stopPropagation(),h(n,String(null!==(t=e.detail.value)&&void 0!==t?t:""))}}
          ></ha-selector>
          <span class="bd-spacer"></span>
        </div>
        <ha-button
          @click=${()=>{var e;return h([...n,{domain:null!==(e=xi(d,n)[0])&&void 0!==e?e:"",template:""}],null!=r?r:"")}}
        >
          ${a("editor.by_domain.add",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderCardVariables(t){var i;const s=t.filter(e=>H(e));if(!s.length)return e``;const o=r(null===(i=this._config)||void 0===i?void 0:i.variables);return e`${s.map(t=>{var i;const s=o[t.name],r=!!s&&"object"==typeof s;return e`
        <div class="card-variable">
          <h3>${null!==(i=t.label)&&void 0!==i?i:t.name}</h3>
          ${t.description?e`<p class="hint">${t.description}</p>`:e``}
          ${r?e`
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
      `})}`}_registryItemsForPreview(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.for_each_from;if(!this.hass||!b(t))return;const i=M(t);if(void 0===i||Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))try{const e=D(this.hass,t,Object.assign(Object.assign({},q(this._lovelace)),{rendered:this._renderedTemplates}));return e.length?e:void 0}catch(s){return}}_cardVariableChanged(e,t){var i,s;null==t||t.stopPropagation();const a=null===(i=null==t?void 0:t.detail)||void 0===i?void 0:i.config,o=N(null===(s=this._config)||void 0===s?void 0:s.variables).filter(t=>z(t)!==e);a&&"object"==typeof a&&o.push({[e]:a});const r=Object.assign({},this._config);o.length?r.variables=o:delete r.variables,v(this,"config-changed",{config:r})}_renderResult(t){var s,o,r;if(!this._config)return e``;const n=null!==(s=R(this._config.for_each))&&void 0!==s?s:this._registryItemsForPreview();let l=(null==n?void 0:n.length)?U(n[0],this._config.variables,0,n.length):this._config.variables,h=t,c=this._config.template;if(E(this._config))try{const e=null!==(o=this._templates)&&void 0!==o?o:{};let t;({template:h,name:c,entity:t}=I(this._config,l,t=>e[t],this.hass,Object.keys(e))),l=J(l,t)}catch(A){return e``}if(!h)return e``;const u=L(h);if(!u)return e``;const p=F(h);let m;const _=performance.now();try{const e=W(this.hass,i(this._config.rebuild_on)),t=null!==(r=this._lovelace)&&void 0!==r?r:O();m=B(d(l,h,p,c,e,!0,void 0,0,void 0,void 0,!1,{itemTemplates:Z(t),context:q(t)}),this._config,u)}catch(S){return e`<ha-alert alert-type="warning">
        ${a("editor.result_error",{error:String(S)},this.hass)}
      </ha-alert>`}const v=performance.now(),g=(null==n?void 0:n.length)?a("editor.result_copies",{total:n.length},this.hass):"",[f,y]=Ji(a("editor.result_hint",{kind:u},this.hass),"[[name]]"),$=K(m);$!==this._lastYaml&&(this._markedLines=function(e,t){const i=""===t?[]:t.replace(/\n$/,"").split("\n");if(void 0===e)return i.map(e=>({text:e,changed:!1}));const s=new Set(e.replace(/\n$/,"").split("\n"));return i.map(e=>({text:e,changed:!s.has(e)}))}(this._lastYaml,$),this._lastYaml=$);const w=void 0!==this._editingPlace().section?"grid":void 0,x=function(e){return"card"===e?["rendered","yaml"]:["yaml"]}(u),k=x.includes(this._previewMode)?this._previewMode:"yaml",j=!(null==n?void 0:n.length)&&!b(this._config.for_each_from)&&m&&"object"==typeof m;return e`
      <div class="preview">
        <div class="preview-head">
          <span class="preview-title">${a("editor.preview.header",void 0,this.hass)}${g}</span>
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
          ${a("editor.preview.built_in",{time:gi(_,v),template:null!=c?c:""},this.hass)}
          ${"yaml"===k?a("editor.preview.changed_hint",void 0,this.hass):""}
        </p>
        <p class="hint">${f}<code>[[name]]</code>${y}</p>
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
    `}_copyYaml(e){Y(e).then(e=>{this._copied=e,e&&setTimeout(()=>this._copied=!1,1500)})}_renderResume(){const t=this._resume;return t?e`<ha-alert alert-type="info">
      ${a("editor.link.resume",{template:t.template},this.hass)}
      <div class="actions">
        <ha-button
          @click=${()=>{this._resume=void 0,v(this,"config-changed",{config:t.config})}}
        >
          ${a("editor.link.resume_button",void 0,this.hass)}
        </ha-button>
        <ha-button
          @click=${()=>{this._resume=void 0}}
        >
          ${a("editor.link.discard_button",void 0,this.hass)}
        </ha-button>
      </div>
    </ha-alert>`:e``}_openTemplate(e){var t,i,s,a;const o=Q(),r=function(e,t){var i,s;const a=null==e?void 0:e.views;if(!Array.isArray(a))return;const o=e=>!!e&&g(e.type)&&e.template===t;for(let r=0;r<a.length;r+=1){const e=null!==(i=a[r])&&void 0!==i?i:{},t=Array.isArray(e.cards)?e.cards:[];for(let i=0;i<t.length;i+=1)if(o(t[i]))return[r,i];const n=Array.isArray(e.sections)?e.sections:[];for(let i=0;i<n.length;i+=1){const e=Array.isArray(null===(s=n[i])||void 0===s?void 0:s.cards)?n[i].cards:[];for(let t=0;t<e.length;t+=1)if(o(e[t]))return[r,i,t]}}}(null!==(t=null==o?void 0:o.config)&&void 0!==t?t:this._lovelace,e);if(!o||!r)return void(this._cannotOpen=!0);this._config&&function(e,i,s=Date.now()){const a=yi();if(a)try{a.setItem(fi,JSON.stringify(Object.assign(Object.assign({},e),{at:s})))}catch(t){}}({config:this._config,openedWith:this._openedWith,template:e});const n=function(e,t){var i,s,a,o,r;const n=null===(i=null==e?void 0:e.views)||void 0===i?void 0:i[t[0]];if(!n)return;const l=3===t.length?null===(o=null===(a=null===(s=n.sections)||void 0===s?void 0:s[t[1]])||void 0===a?void 0:a.cards)||void 0===o?void 0:o[t[2]]:null===(r=n.cards)||void 0===r?void 0:r[t[1]];return l&&"object"==typeof l?l:void 0}(o.config,r),l=null!==(i=document.querySelector("home-assistant"))&&void 0!==i?i:document.body,d=()=>{v(l,"show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>Promise.resolve(),dialogParams:{lovelaceConfig:o.config,cardConfig:n,saveCardConfig:e=>o.saveConfig(n?ie(o.config,n,e):o.config),saveConfig:e=>o.saveConfig(e),path:r}})},h=$(this);if(!h)return void d();this._config&&(null===(s=h._discardDirtyStateChanges)||void 0===s||s.call(h),"_dirty"in h&&(h._dirty=!1));let c=!1;const u=()=>{c||(c=!0,setTimeout(d,0))};h.addEventListener("dialog-closed",u,{once:!0});!1!==(null===(a=h.closeDialog)||void 0===a?void 0:a.call(h))&&setTimeout(u,400)}_renderSectionPerCopy(){var t;const i=null===(t=Q())||void 0===t?void 0:t.config;return this._config&&i&&G(i,this._config)?e`
      <div class="section-per-copy">
        <p class="hint">${a("editor.section_per_copy_hint",void 0,this.hass)}</p>
        ${this._sectionsError?e`<ha-alert alert-type="error">${this._sectionsError}</ha-alert>`:e``}
        <ha-button @click=${this._sectionPerCopy}>
          ${a(this._sectionsPending?"editor.section_per_copy_confirm":"editor.section_per_copy",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}async _sectionPerCopy(){var e,t;if(!this._sectionsPending)return void(this._sectionsPending=!0);this._sectionsPending=!1;const i=Q(),s=this._config;if(!i||!s)return;try{await X(this,this.hass,"section_per_copy",[{urlPath:te(),build:e=>ee(e,s)}])}catch(r){return void(this._sectionsError=a("tools.save_failed",{message:null!==(e=null==r?void 0:r.message)&&void 0!==e?e:r},this.hass))}let o=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;for(;o&&"hui-dialog-edit-card"!==o.localName;)o=o.parentNode instanceof ShadowRoot?o.parentNode.host:o.parentNode;null===(t=null==o?void 0:o.closeDialog)||void 0===t||t.call(o)}_eject(e){this._ejectPending?(this._ejectPending=!1,this._holdEjectUndo(e),v(this,"config-changed",{config:e})):this._ejectPending=!0}_holdEjectUndo(e){const t=Q();if(!t||!this._openedWith)return;const i=ie(t.config,this._openedWith,e);i!==t.config&&se({operation:"eject",at:Date.now(),dashboards:[{urlPath:te(),before:t.config,after:i}]})}_renderSource(t){var i;const s=null===(i=this._config)||void 0===i?void 0:i.template;if(!s||!t||this._loadingTemplates)return e``;const o=ae(this._lovelace,s);if(!o){const t=oe(s);return e`<p class="hint">
        ${a("editor.source_borrowed",void 0,this.hass)}
        ${t?e`<a href=${r=t,`/${r.replace(/^\/+/,"")}`} target="_blank" rel="noreferrer"
                >${a("editor.link.open_dashboard",void 0,this.hass)}</a
              >`:e``}
      </p>`}var r;if(o.declared||!o.view)return e`<p class="hint">
        ${a("editor.source_declared",void 0,this.hass)}
        ${a("editor.link.raw_editor",void 0,this.hass)}
      </p>`;const{view:n}=o,l=document.location.pathname.split("/").slice(0,2).join("/"),[d,h]=Ji(a("editor.source_view",{view:""},this.hass),"");return e`<p class="hint">
      ${d}<a href=${`${l}/${n.path||n.index}`} target="_blank" rel="noreferrer"
        >${n.title||n.path||a("editor.untitled_view",void 0,this.hass)}</a
      >${h}
      <a
        href="#"
        class="edit-template"
        @click=${e=>{e.preventDefault(),this._openTemplate(s)}}
        >${a("editor.link.edit_template",void 0,this.hass)}</a
      >
      ${this._cannotOpen?e`<br />${a("editor.link.cannot_open",void 0,this.hass)}`:e``}
    </p>`}_filledSource(e){var t,i;return re(null===(t=this._config)||void 0===t?void 0:t.for_each_from,null===(i=this._config)||void 0===i?void 0:i.variables,e,this.hass)}_renderedTemplateNames(e){const t=this._filledSource(e),i=M(t);if(!this.hass||void 0===i)return[];if(!Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))return[];const s=new Set,a=D(this.hass,t,{rendered:this._renderedTemplates});for(const o of a)for(const e of Object.keys(o))s.add(e);return[...s]}_renderEditorTemplate(e){this.hass&&!this._renderingTemplates.has(e)&&(this._renderingTemplates.add(e),ne(this.hass,e).then(t=>{this._renderingTemplates.delete(e),this._renderedTemplates=Object.assign(Object.assign({},this._renderedTemplates),{[e]:t})}))}_renderMatches(t){var i,s;if(!this.hass||!b(null===(i=this._config)||void 0===i?void 0:i.for_each_from))return e``;const o=this._filledSource(t);le(o)&&!de()&&he(this.hass).then(()=>this.requestUpdate());const r=M(o);if(void 0!==r){const t=Object.prototype.hasOwnProperty.call(this._renderedTemplates,r)?this._renderedTemplates[r]:void 0;if(!t)return this._renderEditorTemplate(r),e`<p class="hint">${a("editor.matches_template_pending",void 0,this.hass)}</p>`;const i=ce(t);if(!("list"in i)){const t="error"===i.problem?"editor.matches_template_failed":"editor.matches_template_not_list";return e`<ha-alert alert-type="warning"> ${a(t,{detail:i.detail},this.hass)} </ha-alert>`}}let n=[];try{n=D(this.hass,o,Object.assign(Object.assign({},q(this._lovelace)),{rendered:this._renderedTemplates}))}catch(d){return e``}if(!n.length)return e`<ha-alert alert-type="warning">
        ${a("editor.matches_none",{but:(null===(s=this._config)||void 0===s?void 0:s.empty)?a("editor.matches_none_but_empty",void 0,this.hass):""},this.hass)}
      </ha-alert>`;const l=n.slice(0,12);return e`
      <div class="matches-line">
        <ha-svg-icon .path=${"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}></ha-svg-icon>
        <span>
          ${1===n.length?a("editor.matches_header_one",{what:Ri(o,1,this.hass)},this.hass):a("editor.matches_header_many",{count:n.length,what:Ri(o,n.length,this.hass)},this.hass)}
        </span>
        <ha-button
          @click=${()=>{this._matchesOpen=!this._matchesOpen}}
        >
          ${a(this._matchesOpen?"editor.repeat.matches_hide":"editor.repeat.matches_show",void 0,this.hass)}
        </ha-button>
      </div>
      ${this._matchesOpen?e`<div class="matches">
              <ul>
                ${l.map((t,i)=>e`<li>${ue(t,i)}</li>`)}
              </ul>
              ${n.length>l.length?e`<p class="hint">
                      ${a("editor.matches_more",{count:n.length-l.length},this.hass)}
                    </p>`:e``}
              <p class="hint">
                ${a(void 0===r?"editor.matches_hint":"editor.matches_template_hint",void 0,this.hass)}
              </p>
            </div>`:e``}
    `}_suppliedNames(e){var t,i,s;return[...me(null===(t=this._config)||void 0===t?void 0:t.for_each),..._e(null===(i=this._config)||void 0===i?void 0:i.for_each_from),...b(null===(s=this._config)||void 0===s?void 0:s.for_each_from)?pe:[],...e?this._renderedTemplateNames(e):[]]}_renderRepeat(t,i){if(!this._config||!t)return e``;const s=Oi(this._config),o=[{name:"mode",label:a("editor.repeat.mode_label",void 0,this.hass),helper:a("editor.repeat.mode_helper",void 0,this.hass),selector:{select:{mode:"dropdown",options:qi(this.hass,s)}}}];return e`
      <div class="repeat">
        <h3>${a("editor.repeat.header",void 0,this.hass)}</h3>
        <ha-form
          .hass=${this.hass}
          .data=${{mode:s}}
          .schema=${o}
          .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
          .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
          @value-changed=${this._repeatModeChanged}
        ></ha-form>
        ${"list"===s?this._renderRepeatList():"other"===s?this._renderOtherSource(i):"none"===s?e``:this._renderRepeatBuilder(i)}
      </div>
    `}_renderLayout(t,i,s){const o=[...i?(null!=Ui||(Ui=[{name:"gap",label:a("editor.gap_label"),helper:a("editor.gap_helper"),selector:{number:{min:0,max:64,mode:"box"}}},{name:"columns",label:a("editor.columns_label"),helper:a("editor.columns_helper"),selector:{number:{min:1,max:6,mode:"box"}}},{name:"min_column_width",label:a("editor.min_column_width_label"),helper:a("editor.min_column_width_helper"),selector:{number:{min:50,max:1e3,step:10,mode:"box"}}},{name:"lazy",label:a("editor.lazy_label"),helper:a("editor.lazy_helper"),selector:{boolean:{}}},{name:"lazy_eager",label:a("editor.lazy_eager_label"),helper:a("editor.lazy_eager_helper"),selector:{number:{min:0,max:100,mode:"box"}}}]),Ui):[],...s.fit?[]:(null!=Ii||(Ii=[{name:"fit",label:a("editor.fit_label"),helper:a("editor.fit_helper"),selector:{select:{mode:"dropdown",options:[{value:"box",label:a("editor.fit_box")},{value:"contents",label:a("editor.fit_contents")}]}}}]),Ii)];return o.length?e`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${o}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:e``}_repeatModeChanged(e){var t;if(e.stopPropagation(),!this._config)return;const i=null===(t=e.detail.value)||void 0===t?void 0:t.mode;if(!i)return;const s=function(e,t){if(Oi(e)===t||"other"===t)return e;const i=Object.assign({},e);if(delete i.for_each,delete i.for_each_from,"list"===t)i.for_each=[];else if("none"!==t){const s=ji(e.for_each_from)?Object.assign({},e.for_each_from):{};for(const e of ki)delete s[e];i.for_each_from=Object.assign({[t]:!0},s)}return i}(this._config,i);s!==this._config&&v(this,"config-changed",{config:s})}_renderRepeatBuilder(t){var i;const s=null===(i=this._config)||void 0===i?void 0:i.for_each_from,o=ji(s);if(!o)return e``;const r=function(e){var t,i,s;const a=null!=e?e:{},o={patterns:null!==(i=Ai(a[null!==(t=ji(e))&&void 0!==t?t:"entities"]))&&void 0!==i?i:[],reverse:!0===a.reverse,entity_category:!1};for(const h of Pi){const e=Ai(a[h]);e&&e.length&&(o[h]=e)}const r=null!==(s=Ai(a.sort))&&void 0!==s?s:[];r[0]&&(o.sort=r[0]),r[1]&&(o.then=r[1]);const n=Si(a.limit);void 0!==n&&(o.limit=n);const l=Si(a.offset);void 0!==l&&(o.offset=l),"string"==typeof a.group_by&&a.group_by&&(o.group_by=a.group_by);const d=a.entity_category;return o.entity_category=!0===d||"all"===d||"string"==typeof d&&!!d||Array.isArray(d)&&d.length>0,o}(s);return e`
      <ha-form
        .hass=${this.hass}
        .data=${r}
        .schema=${function(e,t,i){const s=t=>a(t,void 0,e),o=e=>({select:{mode:"dropdown",custom_value:!0,options:[...Hi,...e&&!Hi.includes(e)?[e]:[]].map(e=>({value:e,label:Hi.includes(e)?s(`editor.repeat.sort_${e.replace("-","desc_")}`):e}))}}),r="entities"===t,n="areas"===t,l="devices"===t;return[{name:"patterns",label:s(`editor.repeat.patterns_${t}`),helper:s("editor.repeat.patterns_helper"),selector:Di([],null==i?void 0:i.patterns)},r&&{name:"domain",label:s("editor.repeat.domain_label"),selector:Di(Ti(e),null==i?void 0:i.domain)},(r||l)&&{name:"area",label:s("editor.repeat.area_label"),selector:{area:{multiple:!0}}},(r||n||l)&&{name:"floor",label:s("editor.repeat.floor_label"),selector:{floor:{multiple:!0}}},(r||n||l)&&{name:"label",label:s("editor.repeat.label_label"),selector:{label:{multiple:!0}}},r&&{name:"device_class",label:s("editor.repeat.device_class_label"),selector:Di(Vi(e),null==i?void 0:i.device_class)},r&&{name:"integration",label:s("editor.repeat.integration_label"),selector:Di(Ni(e),null==i?void 0:i.integration)},{name:"exclude",label:s("editor.repeat.exclude_label"),helper:s("editor.repeat.exclude_helper"),selector:r?{entity:{multiple:!0}}:Di([],null==i?void 0:i.exclude)},{name:"sort",label:s("editor.repeat.sort_label"),selector:o(null==i?void 0:i.sort)},{name:"then",label:s("editor.repeat.then_label"),selector:o(null==i?void 0:i.then)},{name:"reverse",label:s("editor.repeat.reverse_label"),selector:{boolean:{}}},{name:"limit",label:s("editor.repeat.limit_label"),selector:{number:{min:0,max:500,mode:"box"}}},{name:"offset",label:s("editor.repeat.offset_label"),helper:s("editor.repeat.offset_helper"),selector:{number:{min:0,max:500,mode:"box"}}},r&&{name:"group_by",label:s("editor.repeat.group_by_label"),helper:s("editor.repeat.group_by_helper"),selector:{select:{mode:"dropdown",options:Mi.map(e=>({value:e,label:s(`editor.repeat.group_${e||"none"}`)}))}}},r&&{name:"entity_category",label:s("editor.repeat.entity_category_label"),helper:s("editor.repeat.entity_category_helper"),selector:{boolean:{}}}].filter(e=>!1!==e)}(this.hass,o,r)}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._repeatBuilderChanged}
      ></ha-form>
      ${this._renderMatches(t)}
    `}_repeatBuilderChanged(e){if(e.stopPropagation(),!this._config||void 0===ji(this._config.for_each_from))return;const t=Object.assign(Object.assign({},this._config),{for_each_from:Ei(this._config.for_each_from,e.detail.value)});v(this,"config-changed",{config:t})}_renderOtherSource(t){var i;return e`
      <p class="hint">${a("editor.repeat.other_hint",void 0,this.hass)}</p>
      <ha-yaml-editor
        .hass=${this.hass}
        .defaultValue=${null===(i=this._config)||void 0===i?void 0:i.for_each_from}
        @value-changed=${this._otherSourceChanged}
      ></ha-yaml-editor>
      ${this._renderMatches(t)}
    `}_otherSourceChanged(e){var t;if(e.stopPropagation(),!this._config||!1===(null===(t=e.detail)||void 0===t?void 0:t.isValid))return;const i=Object.assign({},this._config);T(i,"for_each_from",e.detail.value),v(this,"config-changed",{config:i})}_listItems(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.for_each;return Array.isArray(t)?t:t&&"object"==typeof t?[t]:[]}_setList(e){this._config&&v(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{for_each:e})})}_renderRepeatList(){const t=this._listItems(),i=(e,t)=>function(e){var t,i;const s=Array.isArray(e)?Object.assign({},...e.filter(e=>e&&"object"==typeof e)):e&&"object"==typeof e?e:{},a=e=>"string"==typeof e&&e.trim()?e.trim():void 0,o=Object.values(s).find(e=>"string"==typeof e&&e.trim());return null!==(i=null!==(t=a(s.name))&&void 0!==t?t:a(s.entity))&&void 0!==i?i:"string"==typeof o?o.trim():""}(e)||a("editor.repeat.list_item",{number:t+1},this.hass),s=(e,i)=>{e.preventDefault();const s=this._dragging;this._dragging=void 0,void 0!==s&&s!==i&&this._setList(ve(t,s,i))};return e`
      <p class="hint">${a("editor.repeat.list_hint",void 0,this.hass)}</p>
      <ul class="items">
        ${t.map((o,r)=>e`
            <li
              draggable="true"
              @dragstart=${e=>{var t;this._dragging=r,null===(t=e.dataTransfer)||void 0===t||t.setData("text/plain",i(o,r)),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}}
              @dragover=${e=>{void 0!==this._dragging&&e.preventDefault()}}
              @drop=${e=>s(e,r)}
              @dragend=${()=>{this._dragging=void 0}}
            >
              <div class="item-row">
                <ha-svg-icon class="handle" .path=${"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"}></ha-svg-icon>
                <span class="item-name">${i(o,r)}</span>
                <span class="spacer"></span>
                <ha-icon-button
                  .path=${"M7,15L12,10L17,15H7Z"}
                  .disabled=${0===r}
                  .label=${a("editor.repeat.move_up",{name:i(o,r)},this.hass)}
                  @click=${()=>this._setList(ve(t,r,r-1))}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M7,10L12,15L17,10H7Z"}
                  .disabled=${r===t.length-1}
                  .label=${a("editor.repeat.move_down",{name:i(o,r)},this.hass)}
                  @click=${()=>this._setList(ve(t,r,r+1))}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"}
                  .label=${a("editor.repeat.list_edit",{name:i(o,r)},this.hass)}
                  @click=${()=>this._toggleItem(r)}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                  .label=${a("editor.repeat.list_remove",{name:i(o,r)},this.hass)}
                  @click=${()=>this._setList(function(e,t){return e.filter((e,i)=>i!==t)}(t,r))}
                ></ha-icon-button>
              </div>
              ${this._openItems.has(r)?e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${o}
                      @value-changed=${e=>{var i;e.stopPropagation(),!1!==(null===(i=e.detail)||void 0===i?void 0:i.isValid)&&this._setList(function(e,t,i){return e.map((e,s)=>s===t?i:e)}(t,r,e.detail.value))}}
                    ></ha-yaml-editor>`:e``}
            </li>
          `)}
      </ul>
      <ha-button @click=${()=>this._setList(function(e){const t=e[e.length-1],i=t&&"object"==typeof t&&!Array.isArray(t)?Object.keys(t):[],s={};for(const a of i.length?i:["entity"])s[a]="";return[...e,s]}(t))}>
        ${a("editor.repeat.list_add",void 0,this.hass)}
      </ha-button>
    `}_toggleItem(e){const t=new Set(this._openItems);t.has(e)?t.delete(e):t.add(e),this._openItems=t}_hiddenNames(e,t){var i;const s=new Set;if(!t.some(e=>void 0!==e.show_if||void 0!==e.hide_if))return s;const a=r(n(null===(i=this._config)||void 0===i?void 0:i.variables,e)),o=e=>a[e];for(const r of t)ge(r,o)||s.add(r.name);return s}_formSchema(e,t,i){if(!e.length)return this._schema;const s=new Set(this._suppliedNames(i)),o=e=>{var t;const i=s.has(e.name);return{name:zi+e.name,label:null!==(t=e.label)&&void 0!==t?t:e.name,helper:i?a("editor.repeat.from_each_copy_helper",void 0,this.hass):e.description,selector:ye(e),required:!0===e.required&&!i,disabled:i}},r=[];for(const a of fe(e.filter(e=>!H(e))))void 0===a.group?r.push(...a.declarations.map(o)):r.push({name:"",type:"expandable",title:a.group,schema:a.declarations.map(o)});return[this._schema[0],...r,...t.extras?[]:[{name:"extras",label:a("editor.extras_label",void 0,this.hass),helper:a("editor.extras_helper",void 0,this.hass),selector:{object:{}}}]]}_formData(e){var t,i,s,a,o,l,d,h,c,u,p,m;if(!e.length)return this._config;const _=r(null===(t=this._config)||void 0===t?void 0:t.variables),v=new Set(e.map(e=>e.name)),g={template:null===(i=this._config)||void 0===i?void 0:i.template};this._shownAs=new Map;const f=function(e,t,i,s){const a=new Map;if(!i||!e.length)return a;const o=r(n(t,i));for(const r of e){if(!(r in o))continue;const e=pi(o[r],t,i,s);null!=e&&""!==e&&a.set(r,e)}return a}(e.filter(e=>!(e.name in _)&&!H(e)).map(e=>e.name),null===(s=this._config)||void 0===s?void 0:s.variables,null===(a=this._templates)||void 0===a?void 0:a[null===(o=this._config)||void 0===o?void 0:o.template],this.hass);for(const r of e){if(!(r.name in _)){if(!f.has(r.name))continue;let e=f.get(r.name);"boolean"in ye(r)&&"boolean"!=typeof e&&(e=Fi.has(String(e).trim().toLowerCase())),this._shownAs.set(r.name,{shown:e,written:void 0}),g[zi+r.name]=e;continue}const e=_[r.name];if("boolean"!=typeof e&&"boolean"in ye(r)){const t=Fi.has(String(e).trim().toLowerCase());this._shownAs.set(r.name,{shown:t,written:e}),g[zi+r.name]=t}else g[zi+r.name]=e}const y=N(null===(l=this._config)||void 0===l?void 0:l.variables).filter(e=>{const t=z(e);return void 0!==t&&!v.has(t)});return y.length&&(g.extras=y),void 0!==(null===(d=this._config)||void 0===d?void 0:d.columns)&&(g.columns=this._config.columns),void 0!==(null===(h=this._config)||void 0===h?void 0:h.min_column_width)&&(g.min_column_width=this._config.min_column_width),void 0!==(null===(c=this._config)||void 0===c?void 0:c.gap)&&(g.gap=this._config.gap),void 0!==(null===(u=this._config)||void 0===u?void 0:u.fit)&&(g.fit=this._config.fit),void 0!==(null===(p=this._config)||void 0===p?void 0:p.lazy)&&(g.lazy=this._config.lazy),void 0!==(null===(m=this._config)||void 0===m?void 0:m.lazy_eager)&&(g.lazy_eager=this._config.lazy_eager),g}_renderDiagnostics(t,s){var o,r,n,l,d,c,u,p,m,_,v,g,f,y,b,$,w;if(!t||this._loadingTemplates||!s||E(this._config))return e``;const x=[...this._suppliedNames(t),...i(null===(o=this._config)||void 0===o?void 0:o.rebuild_on),...be(t,h(null===(r=this._config)||void 0===r?void 0:r.variables)),...Object.keys(Z(null!==(n=this._lovelace)&&void 0!==n?n:O()))].map(e=>({[e]:null})),{missing:k,unused:j,required:A}=$e(null===(l=this._config)||void 0===l?void 0:l.variables,t,x,[null===(d=this._config)||void 0===d?void 0:d.for_each_from,null===(c=this._config)||void 0===c?void 0:c.on_error],we(t,Z(null!==(u=this._lovelace)&&void 0!==u?u:O()))),S=xe(null===(p=this._config)||void 0===p?void 0:p.variables,t,this.hass),C=this._hiddenNames(t,P(t)),T=A.filter(e=>!C.has(e)),V=k.filter(e=>!A.includes(e)&&!C.has(e)),H=new Set(N(null===(m=this._config)||void 0===m?void 0:m.variables).map(z)),M=[...C].filter(e=>H.has(e)),D=Wi.test(`${null!==(_=t.style)&&void 0!==_?_:""}\n${null!==(g=null===(v=this._config)||void 0===v?void 0:v.style)&&void 0!==g?g:""}`),q="contents"===(null===(f=this._config)||void 0===f?void 0:f.fit)&&D,R=Number(null===(y=this._config)||void 0===y?void 0:y.columns),U=(void 0!==(null===(b=this._config)||void 0===b?void 0:b.for_each)||void 0!==(null===($=this._config)||void 0===$?void 0:$.for_each_from))&&R>1&&!(Number(null===(w=this._config)||void 0===w?void 0:w.min_column_width)>0),I=L(t),J=ke(this._config,I);return e`
      ${J.map(t=>{var i,s;return e`<ha-alert alert-type="warning">
            ${a("editor.override_misplaced",{key:t,kind:I,template:null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""},this.hass)}
          </ha-alert>`})}
      ${U?e`<ha-alert alert-type="info">
              ${a("editor.columns_without_min_width",{columns:R},this.hass)}
            </ha-alert>`:e``}
      ${q?e`<ha-alert alert-type="warning">${a("editor.fit_hides_style",void 0,this.hass)}</ha-alert>`:e``}
      ${M.length?e`<ha-alert alert-type="warning">
              ${a(1===M.length?"editor.hidden_but_set_one":"editor.hidden_but_set_many",{names:M.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${T.length?e`<ha-alert alert-type="error">
              ${a(1===T.length?"editor.required_one":"editor.required_many",{names:T.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${V.length?e`<ha-alert alert-type="warning">
              ${a(1===V.length?"editor.optional_one":"editor.optional_many",{names:V.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${S.map(t=>e`<ha-alert alert-type="warning">
            ${a("editor.invalid_value",{name:t.name,expected:t.expected},this.hass)}
          </ha-alert>`)}
      ${j.length?e`<ha-alert alert-type="info">
              ${a(1===j.length?"editor.unused_one":"editor.unused_many",{names:j.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_valueChanged(e){var t,i;const s=e.detail.value,a=P(null===(t=this._templates)||void 0===t?void 0:t[s.template]);if(!a.length)return void v(this,"config-changed",{config:s});const o=[];for(const l of a){let e=s[zi+l.name];const t=this._shownAs.get(l.name);t&&mi(e,t.shown)&&(e=t.written),void 0!==e&&""!==e&&o.push({[l.name]:e})}Array.isArray(s.extras)&&o.push(...s.extras);const r=Object.assign(Object.assign({},this._config),{template:s.template}),n=je(N(null===(i=this._config)||void 0===i?void 0:i.variables),o);n.length?r.variables=n:delete r.variables,T(r,"columns",s.columns),T(r,"min_column_width",s.min_column_width),T(r,"gap",s.gap),T(r,"lazy",!0===s.lazy||void 0),T(r,"lazy_eager",s.lazy_eager),v(this,"config-changed",{config:r})}_loadBorrowedTemplates(){if(!Oe(this._lovelace))return;this._loadingTemplates=!0;const e=this._editingPlace();Ae(this.hass,this._lovelace,e.view,void 0,e.section).then(e=>{this._templates=e,this._schema=void 0}).finally(()=>{this._loadingTemplates=!1,this.requestUpdate()})}}c([p()],Bi.prototype,"_lovelace",void 0),c([p()],Bi.prototype,"_config",void 0),c([u()],Bi.prototype,"hass",void 0),c([p()],Bi.prototype,"_loadingTemplates",void 0),c([p()],Bi.prototype,"_ejectPending",void 0),c([p()],Bi.prototype,"_sectionsPending",void 0),c([p()],Bi.prototype,"_sectionsError",void 0),c([p()],Bi.prototype,"_onErrorMode",void 0),c([p()],Bi.prototype,"_previewMode",void 0),c([p()],Bi.prototype,"_copied",void 0),c([p()],Bi.prototype,"_cannotOpen",void 0),c([p()],Bi.prototype,"_resume",void 0),c([p()],Bi.prototype,"_matchesOpen",void 0),c([p()],Bi.prototype,"_byDomainDraft",void 0),c([p()],Bi.prototype,"_openItems",void 0),c([p()],Bi.prototype,"_renderedTemplates",void 0);const Zi=/^[a-z_]+\.[a-z0-9_]+$/,Ki={base:"entity",label:"Entity",selector:{entity:{}},matches:e=>Zi.test(e)};function Yi(e,t){return{base:e,label:t,selector:{text:{}},matches:e=>e.trim().length>0}}const Qi={entity:Ki,entity_id:Ki,name:Yi("name","Name"),title:Yi("title","Title"),heading:Yi("heading","Heading"),icon:{base:"icon",label:"Icon",selector:{icon:{}},matches:e=>e.includes(":")}};function Gi(e,t){return 1===t?e.label:`${e.label} ${t}`}const Xi=(e,t=200)=>{if("number"==typeof e&&(e=String(e)),"string"!=typeof e)return;const i=e.trim();return i?i.length>t?`${i.slice(0,t-1)}…`:i:void 0};function es(e){const t=Xi(e,2e3);if(t&&/^https?:\/\/[^\s/]+/i.test(t))return t}const ts=e=>[].concat(null!=e?e:[]).map(e=>Xi(e)).filter(e=>!!e).slice(0,50);function is(e){if("string"==typeof e){const t=Xi(e);return t?{name:t}:void 0}if(!e||"object"!=typeof e||Array.isArray(e))return;const t=e,i=Xi(t.github),s={name:Xi(t.name),github:i&&/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(i)?i:void 0,email:Xi(t.email),url:es(t.url)};for(const a of Object.keys(s))void 0===s[a]&&delete s[a];return Object.keys(s).length?s:void 0}function ss(e){const t=e&&"object"==typeof e?e:{},i={author:is(t.author),license:Xi(t.license),help:es(t.help),homepage:es(t.homepage),readme:Xi(t.readme,8e3),related:ts(t.related),setup:ts(t.setup)};for(const s of["author","license","help","homepage","readme"])void 0===i[s]&&delete i[s];return i}const as=["author","license","help","homepage","readme","requires","setup","related"];function os(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);for(const i of as)delete t[i];return t}const rs={integrations:{kind:"integration",key:"integration"},entities:{kind:"entity",key:"entity"},custom_cards:{kind:"custom_card",key:"card"}},ns=e=>{const t=Xi(e,40);return t&&t.replace(/\+$/,"").trim()||void 0};function ls(e){var t;const i=null==e?void 0:e.requires;if(!i||"object"!=typeof i||Array.isArray(i))return[];const s=[];for(const[a,{kind:o,key:r}]of Object.entries(rs))for(const e of[].concat(null!==(t=i[a])&&void 0!==t?t:[]).slice(0,50)){const t=e&&"object"==typeof e&&!Array.isArray(e)?e:void 0,i=ts(t?t[r]:e).map(e=>"custom_card"===o?e.replace(/^custom:/,""):e);if(!i.length)continue;const a=t?Xi(t.message,300):void 0;s.push(a?{kind:o,any:i,message:a}:{kind:o,any:i})}for(const a of["homeassistant","card"]){const e=ns(i[a]);e&&s.push({kind:a,any:[e]})}return s}function ds(e,t){var i,s;const a=e=>e.split(".").map(e=>parseInt(e,10)||0),o=a(e),r=a(t);for(let n=0;n<Math.max(o.length,r.length);n++){const e=null!==(i=o[n])&&void 0!==i?i:0,t=null!==(s=r[n])&&void 0!==s?s:0;if(e!==t)return e>t}return!0}function hs(e,t){switch(e.kind){case"integration":{const i=new Set;for(const e of t.components)i.add(e),i.add(e.split(".").pop());return e.any.some(e=>i.has(e))}case"entity":return e.any.some(e=>{const i=function(e){const t=e.replace(/[.+?^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*");return new RegExp(`^${t}$`,"i")}(e);return t.entities.some(e=>i.test(e))});case"custom_card":return e.any.some(e=>t.isDefined(e));case"homeassistant":return!t.homeassistant||ds(t.homeassistant,e.any[0]);case"card":return t.card.startsWith("0.0.0")||ds(t.card,e.any[0])}}function cs(e,t){const i=Se(e),s=Array.isArray(i)?i.filter(e=>e&&"object"==typeof e):i&&"object"==typeof i?Object.entries(i).map(([e,t])=>({[e]:t})):[],a=s.find(e=>Object.prototype.hasOwnProperty.call(e,t)),o=null==a?void 0:a[t];return"string"==typeof o||"number"==typeof o?String(o):void 0}function us(e,t){const i=ss(e).setup.filter(e=>"string"==typeof t[e]&&""!==t[e]);if(!i.length)return e;const s=Se(e),a=(Array.isArray(s)?s.filter(e=>e&&"object"==typeof e):s&&"object"==typeof s?Object.entries(s).map(([e,t])=>({[e]:t})):[]).filter(e=>!i.some(t=>Object.prototype.hasOwnProperty.call(e,t))),o=Object.assign(Object.assign({},e),{default:[...i.map(e=>({[e]:t[e]})),...a]});return delete o[Pe],o}const ps={integrations:"requires_integrations",entities:"requires_entities",custom_cards:"requires_custom_cards"},ms=e=>"string"==typeof e?e:"number"==typeof e?String(e):void 0,_s=e=>[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);const vs=e=>"string"==typeof e&&e.trim()?e.trim():void 0,gs=e=>[].concat(null!=e?e:[]).map(vs).filter(e=>!!e);const fs=[Ee,Le,...Te],ys=["card","badge","row","element","group"],bs=["type","template","description","author","license","help","homepage","readme","requires","setup","related","variables","default",...ys,"style"];function $s(e,t){if(Array.isArray(e))for(const i of e)$s(i,t);else if(e&&"object"==typeof e){t(e);for(const i of Object.values(e))$s(i,t)}}function ws(e){const t=new Set,i=new Set;$s(e,e=>{const s=e.type;if("string"==typeof s){s.startsWith("custom:")&&!fs.includes(s)&&t.add(s);for(const t of Ve(e))i.add(t)}});for(const s of Ce(e))i.add(s);return{customTypes:[...t].sort(),templateRefs:[...i].sort()}}function xs(e,t){const i=e&&"object"==typeof e&&void 0!==e[Pe]?Object.assign(Object.assign({},e),{default:Se(e)}):e,s={};for(const a of bs)void 0!==(null==i?void 0:i[a])&&(s[a]=i[a]);for(const a of Object.keys(null!=i?i:{}))a in s||a===Pe||"source"===a||(s[a]=i[a]);const{customTypes:o,templateRefs:r}=ws(e),n=[];if(t){const i={},a=[...r],o=null==e?void 0:e.template,l=new Set(ss(e).related.filter(e=>e!==o));for(a.push(...l);a.length;){const e=a.shift();if(e in i)continue;const s=t[e];if(s){i[e]=ks(s),a.push(...ws(s).templateRefs);for(const e of ss(s).related)e===o||l.has(e)||(l.add(e),a.push(e))}else l.has(e)||n.push(e)}Object.keys(i).length&&(s.includes=i)}else n.push(...r);const l=[];o.length&&l.push(a("share.requires_custom_cards",{types:o.join(", ")})),n.length&&l.push(a("share.uses_other_templates",{names:n.join(", ")}));const d=function(e){const t=null==e?void 0:e.requires;return t&&"object"==typeof t?["homeassistant","card"].filter(e=>"number"==typeof t[e]):[]}(e);return d.length&&l.push(a("share.version_unquoted",{keys:d.join(", ")})),{payload:s,notes:l}}function ks(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);return delete t.source,t}function js(e,t){if(!t.includes(e))return e;let i=2;for(;t.includes(`${e}_${i}`);)i+=1;return`${e}_${i}`}function Os(e){if(!e||"object"!=typeof e||Array.isArray(e))return{ok:!1,errors:[a("share.import_not_a_template")]};const t=[];"string"==typeof e.template&&e.template.trim()||t.push(a("share.import_no_name"));const i=ys.filter(t=>void 0!==e[t]);return 0===i.length?t.push(a("share.import_defines_nothing")):i.length>1&&t.push(a("share.import_defines_both",{first:i[0],second:i[1]})),{ok:0===t.length,errors:t}}function As(e,t){const i=new Set;for(const s of e)for(const e of ws(s).customTypes){const s=e.slice(7);s&&!t(s)&&i.add(s)}return[...i].sort()}const Ss=["card","badge","row","element","group"],Ps=/^[A-Za-z0-9_-]+$/,Cs=/^[a-z_]+\.[a-z0-9_]+$/;function Es(e){return Ss.find(t=>void 0!==(null==e?void 0:e[t])&&null!==(null==e?void 0:e[t]))}function Ls(e){return e.map(e=>"number"==typeof e?`#${e+1}`:e).join(" › ")}function Ts(e){const t=new Set;for(const a of Ne(null==e?void 0:e.variables))a&&"string"==typeof a.name&&t.add(a.name);const i=JSON.stringify(null!=e?e:{}),s=/\[\[([A-Za-z0-9_-]+)/g;for(let a=s.exec(i);a;a=s.exec(i))t.add(a[1]);return[...t]}function Vs(e){return"boolean"==typeof e?"boolean":"number"==typeof e?"number":"string"==typeof e&&Cs.test(e)?"entity":"string"==typeof e&&/^[a-z]+:[a-z0-9-]+$/.test(e)?"icon":"text"}function Ns(e,t,i){if(!t.length)return i;const[s,...a]=t;return Array.isArray(e)?e.map((e,t)=>t===s?Ns(e,a,i):e):Object.assign(Object.assign({},e),{[s]:Ns(null==e?void 0:e[s],a,i)})}const Hs=["card","badge","row","element","group","style","let","default","grid_options","name"],Ms="default:",Ds="or:";function qs(e){return e.startsWith(Ds)?e.slice(3):qe(e)}function zs(e,t,i){if(!e.includes("[[")&&!e.includes("]]"))return;const s=function(e){let t=0,i=!1;for(let s=0;s<e.length-1;s+=1){const a=e.slice(s,s+2);"[["===a?(t+=1,s+=1):"]]"===a&&(0===t?i=!0:t-=1,s+=1)}return{unclosed:t>0,stray:i}}(e);s.unclosed&&i.findings.push({level:"warning",key:"lint.unclosed",params:{},path:t}),s.stray&&i.findings.push({level:"warning",key:"lint.stray_close",params:{},path:t});let a=e;for(let o=0;o<5;o+=1){let e=!1;if(a=a.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(s,a)=>(e=!0,a.startsWith(ze)||Rs(a,t,i),"_")),!e)break}}function Rs(e,t,i){const s=e.endsWith("?")?e.slice(0,-1):e,[a,...o]=s.split("|"),r=`[[${e}]]`,n=(a.endsWith("?")?a.slice(0,-1):a).split(".")[0];n&&"_"!==n&&!i.heads.has(n)&&i.heads.set(n,t);let l=!1;for(const d of o){if(!Re(d)){const e=Ue(d);i.findings.push({level:"warning",key:"lint.unknown_step",params:e?{step:d,placeholder:r,closest:e}:{step:d,placeholder:r},path:t});continue}(d.startsWith(Ms)||d.startsWith(Ds))&&l&&i.findings.push({level:"warning",key:"lint.after_default",params:{step:d,placeholder:r},path:t}),d.startsWith(Ms)&&d.length>8&&(l=!0);const e=qs(d);e&&"_"!==e&&i.targets.push({name:e,placeholder:r,path:t})}}function Us(e,t,i){if("string"!=typeof e){if(Array.isArray(e))e.forEach((e,s)=>Us(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,a]of Object.entries(e))zs(s,t,i),Us(a,t?`${t}.${s}`:s,i)}else zs(e,t,i)}function Is(e){const t=new Set;for(const i of P(e))t.add(i.name);for(const i of[...h(Se(e)),...h(null==e?void 0:e.let)]){const e=z(i);void 0!==e&&t.add(e)}return[...t]}function Js(e,t=[]){if(!e||"object"!=typeof e)return[];const i={findings:[],heads:new Map,targets:[]};for(const o of Hs){const t=e[o];void 0!==t&&Us(t,o,i)}P(e).forEach((e,t)=>{void 0!==e.default&&Us(e.default,`variables[${t}].default`,i);for(const s of["show_if","hide_if"]){const a=`variables[${t}].${s}`;for(const t of Me(e,s)){const e=t.slice(3);if(!De(t)){i.findings.push({level:"warning",key:"lint.condition_malformed",params:{key:s,condition:e},path:a});continue}const o=qe(t);o&&i.targets.push({name:o.split(".")[0],placeholder:`${s}: ${e}`,path:a})}}});const s=new Set([...Is(e),...t,...pe,...be(e)]),a=[...i.findings],r=e=>s.has(e)||i.heads.has(e),n=e=>r(e)||e.split(".").some((e,t,i)=>t>0&&r(i.slice(0,t).join(".")));for(const h of i.targets){if(n(h.name))continue;const e=o(h.name,[...s,...i.heads.keys()]);a.push({level:"warning",key:"lint.target_unknown",params:e?{name:h.name,placeholder:h.placeholder,closest:e}:{name:h.name,placeholder:h.placeholder},path:h.path})}const l=[...i.heads.entries()].filter(([e])=>!s.has(e));l.length&&a.push({level:"info",key:"lint.undeclared",params:{names:l.map(([e,t])=>l.length>1?`${e} (${t})`:e).join(", ")},path:l.length>1?"":l[0][1]});for(const h of function(e){return hi(e).filter(e=>!li.includes(e)).map(e=>{const t=o(e,li);return t?{name:e,closest:t}:{name:e}})}(e))a.push({level:"warning",key:"lint.editor_hide_unknown",params:Object.assign({},h),path:"editor_hide"});const d=new Set;return a.filter(e=>{const t=JSON.stringify([e.key,e.params,e.path]);return!d.has(t)&&(d.add(t),!0)})}const Fs={card:{type:"entity",entity:"sun.sun"},badge:{type:"entity",entity:"sun.sun"},row:{entity:"sun.sun"},element:{type:"icon",icon:"mdi:weather-sunny",style:{color:"yellow"}}},Ws=50,Bs=e=>!!customElements.get(e),Zs=e=>e.actions.length>0||e.urls.length>0||e.embeds||e.scripts||e.placeholders||e.overlay;const Ks=500,Ys="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z";function Qs(t){const i=e=>{var i;return t.onInput(null!==(i=e.target.value)&&void 0!==i?i:"")},s=e=>{var i;return null===(i=t.onKeydown)||void 0===i?void 0:i.call(t,e)};return Bs("ha-input")?e`<ha-input
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
      ></ha-textfield>`}async function Gs(e,t,i,s){var o;if(!Q())return e._toolError=a("tools.cannot_save_here",void 0,e.hass),!1;e._busy=!0,e._toolError=void 0;try{return await X(e,e.hass,i,[{urlPath:te(),build:t}],s),e._undoChanged=void 0,!0}catch(r){return e._toolError=a("tools.save_failed",{message:null!==(o=null==r?void 0:r.message)&&void 0!==o?o:r},e.hass),!1}finally{e._busy=!1}}const Xs=_`
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

  ${Je.styles}
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
 */,ea=2,ta=e=>(...t)=>({_$litDirective$:e,values:t});let ia=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:sa}=Fe,aa=e=>e,oa=()=>document.createComment(""),ra=(e,t,i)=>{const s=e._$AA.parentNode,a=void 0===t?e._$AB:t._$AA;if(void 0===i){const t=s.insertBefore(oa(),a),o=s.insertBefore(oa(),a);i=new sa(t,o,e,e.options)}else{const t=i._$AB.nextSibling,o=i._$AM,r=o!==e;if(r){let t;i._$AQ?.(e),i._$AM=e,void 0!==i._$AP&&(t=e._$AU)!==o._$AU&&i._$AP(t)}if(t!==a||r){let e=i._$AA;for(;e!==t;){const t=aa(e).nextSibling;aa(s).insertBefore(e,a),e=t}}}return i},na=(e,t,i=e)=>(e._$AI(t,i),e),la={},da=(e,t=la)=>e._$AH=t,ha=e=>{e._$AR(),e._$AA.remove()},ca=ta(class extends ia{constructor(){super(...arguments),this.key=We}render(e,t){return this.key=e,t}update(e,[t,i]){return t!==this.key&&(da(e),this.key=t),i}}),ua=[{name:"room_light_tile",summary:"A tile per light, with the light named after itself.",template:{description:"A tile for one light, taking its name from Home Assistant.",variables:[{name:"entity",label:"Light",selector:{entity:{domain:"light"}},required:!0},{name:"name",label:"Name",description:"Leave empty to use the light’s own name",selector:{text:{}}}],card:{type:"tile",entity:"[[entity]]",name:"[[name|or:entity|friendly_name]]",features:[{type:"light-brightness"}]}}},{name:"room_summary",summary:"A heading per area, listing the lights in it. Uses grouping.",template:{description:"One card per area, with a tile for every light in that area.",card:{type:"vertical-stack",cards:[{type:"markdown",content:"## [[area]]\n\n[[entity_count]] lights"},{type:"custom:decluttering-card-plus",template:"room_light_tile",for_each:"[[items]]"}]}}},{name:"sensor_line",summary:"An Entities row showing one sensor with its area.",template:{description:"A row for one sensor, labelled with the area it is in.",variables:[{name:"entity",label:"Sensor",selector:{entity:{}},required:!0}],row:{entity:"[[entity]]",name:"[[entity|friendly_name]] ([[entity|area|default:no area]])"}}},{name:"status_badge",summary:"A badge that only appears when something needs attention.",template:{description:"A badge for one entity, hidden unless it is in the state you care about.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0},{name:"when",label:"Show when the state is",selector:{text:{}},default:"on"}],badge:{type:"entity",entity:"[[entity]]",visibility:[{condition:"state",entity:"[[entity]]",state:"[[when]]"}]}}},{name:"counted_grid",summary:'A numbered grid of anything, showing "3 of 12".',template:{description:"A tile that knows where it sits in a repeat.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0}],card:{type:"tile",entity:"[[entity]]",name:"[[entity|friendly_name]]",footer:{type:"markdown",content:"[[index]] of [[total|or:count]]"}}}}];
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pa(e){return ua.find(t=>t.name===e)}function ma(e,t){const i=new Set,s=e=>{Array.isArray(e)?e.forEach(s):e&&"object"==typeof e&&("string"==typeof e.type&&e.type.includes("decluttering-card")&&"string"==typeof e.template&&i.add(e.template),Object.values(e).forEach(s))};return s(e.template),[...i].filter(e=>!t.includes(e))}function _a(e,t){return{library:e,version:t}}const va="tempus2016/decluttering-card-plus",ga="share-your-templates",fa=`https://github.com/${va}/discussions/new?category=${ga}`,ya="decluttering-card-plus-community";function ba(e){let t=2e4;const i=e=>(t-=1+Math.ceil(e/16))>=0,s=e=>"string"==typeof e?i(e.length):!!i(0)&&(Array.isArray(e)?e.every(s):!e||"object"!=typeof e||Object.entries(e).every(([e,t])=>i(e.length)&&s(t)));return s(e)}const $a=e=>!!e&&"object"==typeof e&&!Array.isArray(e);function wa(e){if(ba(e))return JSON.parse(JSON.stringify(e),(e,t)=>"__proto__"===e?void 0:t)}const xa=/[\p{Cf}\u2800\u3164\u115F\u1160\uFFA0]/gu;function ka(e){if("string"!=typeof e)return;const t=e.replace(xa,"").replace(/\s+/g," ").trim();return t?t.length>80?`${t.slice(0,79)}…`:t:void 0}const ja=["card","badge","row","element","group"];function Oa(e){if(!$a(e))return{};const t={};for(const[i,s]of Object.entries(e))$a(s)&&ja.some(e=>void 0!==s[e])&&(t[i]=s);return t}function Aa(e,t){return"string"==typeof t&&/^https:\/\/github\.com\//.test(t)?t:`https://github.com/${va}/discussions/${e}`}function Sa(e){var t,i,s,a,o;const r=function(e){if("string"!=typeof e||e.length>65536)return;const t=/^ {0,3}(`{3,}|~{3,})[ \t]*([\w-]*)/,i=[];let s;for(const r of function(e){return e.replace(/<!--[\s\S]*?(?:-->|$)/g,"")}(e).split("\n")){if(s){r.trim()===s.fence?(i.push({lang:s.lang,text:s.lines.join("\n")+"\n"}),s=void 0):s.lines.push(r);continue}const e=t.exec(r);e&&(s={fence:e[1],lang:e[2],lines:[]})}const a=i.find(e=>/^ya?ml$/i.test(e.lang)),o=null!=a?a:i.find(e=>""===e.lang);return null==o?void 0:o.text}(null==e?void 0:e.body);if(!r)return;let n;try{if(n=wa(Ft(r,{maxAliases:50})),void 0===n)return}catch(c){return}if(!Os(n).ok)return;if("number"!=typeof(null==e?void 0:e.number))return;const{template:l,includes:d}=n,h=Be(n,["template","includes"]);return delete h.type,"string"!=typeof h.description&&delete h.description,{id:e.number,title:null!==(t=ka(e.title))&&void 0!==t?t:l,author:"string"==typeof(null===(i=e.user)||void 0===i?void 0:i.login)?e.user.login:"",url:Aa(e.number,e.html_url),name:l.trim(),template:h,includes:Oa(d),reactions:"number"==typeof(null===(s=e.reactions)||void 0===s?void 0:s.total_count)?e.reactions.total_count:0,updated:"string"==typeof(null!==(a=e.updated_at)&&void 0!==a?a:e.created_at)?null!==(o=e.updated_at)&&void 0!==o?o:e.created_at:""}}const Pa=["lock","alarm_control_panel","cover","valve","siren","script","automation","button","input_button","water_heater","lawn_mower","update"],Ca=["more-info","navigate","none","assist"],Ea=["action","perform_action","service","type"],La=/\b[a-z][a-z0-9+.-]{1,31}:(?:\/\/)?[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?|\/\/[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?/gi,Ta=[/(?:url|image-set|src)\(\s*['"]?([^'")\s{}]+)/gi,/@import\s+(?:url\(\s*)?['"]?([^'")\s;{}]+)/gi],Va=/^(?:\/(?!\/)|#|data:)/i,Na=["image","url","url_path","entity_picture","camera_image","image_url","icon_url","src"],Ha=/\[\[\[|\{\{|\{%|\$\{/,Ma=/^\s*(?:javascript|data|vbscript):/i,Da=/position\s*:\s*(?:fixed|absolute)/i,qa=/opacity\s*:\s*0(?:[^.\d]|$)|visibility\s*:\s*hidden|transparent/i,za=e=>"string"==typeof e&&Pa.includes(e.split(".")[0]),Ra=e=>e.replace(/\\/g,"/"),Ua="*";function Ia(e,t){const i=[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);if(i.length)return i.includes(Ua)?[Ua]:i;const s=[].concat(null!=t?t:[]).filter(e=>"string"==typeof e);if(!s.length)return[Ua];const a=s.map(e=>{const t=e.indexOf("."),i=-1===t?e:e.slice(0,t);return/^[a-z_]+$/.test(i)?i:Ua});return a.includes(Ua)?[Ua]:[...new Set(a)]}function Ja(e,t,i=new Set){var s,a,o,r;if(Array.isArray(e))return e.forEach(e=>Ja(e,t,i)),i;if(!$a(e))return i;const n="string"==typeof e.entity?e.entity:t,l=e.action;if("string"==typeof l&&!Ca.includes(l)&&!l.includes("[[")&&"perform-action"!==l&&"call-service"!==l&&"fire-dom-event"!==l&&"url"!==l){const t=[].concat(null!==(r=null!==(o=null!==(a=null===(s=e.target)||void 0===s?void 0:s.entity_id)&&void 0!==a?a:e.entity_id)&&void 0!==o?o:n)&&void 0!==r?r:[]);t.length&&!t.some(e=>"string"!=typeof e||e.includes("[["))||i.add(l)}return Object.values(e).forEach(e=>Ja(e,n,i)),i}function Fa(e,t){const i=ja.find(t=>void 0!==e[t]);if(i)try{return d(t,e,e[i],void 0,void 0,!0)}catch(s){return}}function Wa(e){const t=new Set,i=new Set;let s=!1,a=!1,o=!1,r=!1;const n=e=>{const t=Ra(e).trim();!t||Va.test(t)||t.startsWith("[[")||t.startsWith("{{")||/^[\w.-]+\.[a-z]{2,}(?:[:/?#]|$)/i.test(t)&&i.add(t)},l=new Set,d=(e,i)=>{for(const s of e)if(i.includes(Ua))t.add(`${s} *`);else for(const e of i)Pa.includes(e)&&t.add(`${s} ${e}.*`)},h=(c,u)=>{var p;if("string"==typeof c)return void(e=>{var t;const s=Ra(e);for(const a of null!==(t=s.match(La))&&void 0!==t?t:[])i.add(a);for(const a of Ta){a.lastIndex=0;let e=a.exec(s);for(;e;)Va.test(e[1])||i.add(e[1]),e=a.exec(s)}Ha.test(e)&&(a=!0),Da.test(e)&&qa.test(e)&&(r=!0)})(c);if(Array.isArray(c))return void c.forEach(e=>h(e,u));if(!$a(c))return;const m="string"==typeof c.entity?c.entity:u;Object.keys(c).some(e=>e.includes("[["))&&(o=!0),Ea.some(e=>"string"==typeof c[e]&&c[e].includes("[["))&&(o=!0),"string"==typeof c.action&&((e,s)=>{var o,r,n,l,d,h;const c=e.action;if("perform-action"===c||"call-service"===c){const i=null!==(o=e.perform_action)&&void 0!==o?o:e.service;return void("string"!=typeof i?t.add("?"):i.includes("[[")||t.add(i))}if("fire-dom-event"===c)return void t.add("fire-dom-event");if("url"===c)return i.add("string"==typeof e.url_path?e.url_path:"?"),void("string"==typeof e.url_path&&Ma.test(e.url_path)&&(a=!0));if(Ca.includes(c)||c.includes("[["))return;const u=[].concat(null!==(h=null!==(d=null!==(l=null!==(n=null===(r=e.target)||void 0===r?void 0:r.entity_id)&&void 0!==n?n:e.entity_id)&&void 0!==l?l:e.entity)&&void 0!==d?d:s)&&void 0!==h?h:[]);for(const i of u)za(i)&&t.add(`${c} ${i}`)})(c,m),"iframe"!==c.type&&"webpage"!==c.type||(s=!0);for(const e of Na)"string"==typeof c[e]&&n(c[e]);if("string"==typeof c.type&&Te.includes(c.type)){const t=(t=>{if("string"==typeof t)return t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0})(c.template);if(t){if(b(c.for_each_from)){const e=c.for_each_from,i=ja.map(e=>t[e]).find(e=>void 0!==e);d(Ja(i,void 0),Ia(e.domain,e.entities))}const e=(_=c.variables,Array.isArray(_)?_.filter($a):$a(_)?Object.entries(_).map(([e,t])=>({[e]:t})):void 0);(null==e?void 0:e.length)&&!l.has(c.template)&&(l.add(c.template),h(Fa(t,e),void 0),l.delete(c.template))}}var _;if("custom:auto-entities"===c.type&&$a(c.filter))for(const e of[].concat(null!==(p=c.filter.include)&&void 0!==p?p:[])){if(!$a(e))continue;const t=Ia(e.domain,e.entity_id);d(Ja(e.options,void 0),t),d(Ja(c.card,void 0),t)}Object.values(c).forEach(e=>h(e,m))},c=[e.template,...Object.values(e.includes)].map(os);h(c,void 0);for(const u of c)h(Fa(u),void 0);return{actions:[...t].sort(),urls:[...i].sort(),embeds:s,scripts:a,placeholders:o,overlay:r}}function Ba(e){return e.filter(e=>{var t;return(null===(t=null==e?void 0:e.category)||void 0===t?void 0:t.slug)===ga}).map(Sa).filter(e=>!!e).sort((e,t)=>t.reactions-e.reactions||t.updated.localeCompare(e.updated))}class Za extends Error{}function Ka(e){var t;if(!$a(e)||"number"!=typeof e.id||"string"!=typeof e.name)return;if(!$a(e.template))return;const i=wa({template:e.template,includes:e.includes});if(!i||!$a(i.template))return;if(!Os(Object.assign({template:e.name},i.template)).ok)return;const s=Object.assign({},i.template);return delete s.type,"string"!=typeof s.description&&delete s.description,{id:e.id,title:null!==(t=ka(e.title))&&void 0!==t?t:e.name,author:"string"==typeof e.author?e.author:"",url:Aa(e.id,e.url),name:e.name,template:s,includes:Oa(i.includes),reactions:"number"==typeof e.reactions?e.reactions:0,updated:"string"==typeof e.updated?e.updated:""}}async function Ya(e={}){var t,i,s,a;const o=null!==(t=e.fetcher)&&void 0!==t?t:fetch.bind(globalThis),r=null!==(i=e.storage)&&void 0!==i?i:"undefined"==typeof localStorage?void 0:localStorage,n=null!==(s=e.now)&&void 0!==s?s:Date.now(),l=function(e){var t;try{const i=JSON.parse(null!==(t=null==e?void 0:e.getItem(ya))&&void 0!==t?t:"null");if(!i||!Array.isArray(i.entries)||"number"!=typeof i.fetched)return;return{entries:i.entries.map(Ka).filter(e=>!!e),fetched:i.fetched}}catch(i){return}}(r);if(l&&!e.refresh&&n-l.fetched<216e5)return l;const d=[];try{for(let e=1;e<=10;e+=1){const t=await o(`https://api.github.com/repos/${va}/discussions?per_page=100&page=${e}`,{headers:{Accept:"application/vnd.github+json"}});if(!t.ok){const e=new Za(`GitHub answered ${t.status}`);throw"0"===t.headers.get("x-ratelimit-remaining")&&(e.retryAt=1e3*Number(t.headers.get("x-ratelimit-reset"))||void 0),e}const i=await t.json();if(!Array.isArray(i))break;if(d.push(...i),i.length<100)break}}catch(c){const e=c instanceof Za?c:new Za(null!==(a=null==c?void 0:c.message)&&void 0!==a?a:String(c));throw e.cached=l,e}const h={entries:Ba(d),fetched:n};try{null==r||r.setItem(ya,JSON.stringify(h))}catch(u){}return h}function Qa(e,t){return{discussion:e.id,updated:e.updated,name:t,author:e.author}}function Ga(e,t){return Object.assign(Object.assign({},e),{source:t})}function Xa(e,t){return e.map(({name:e,source:i})=>{var s;const a=t.entries.find(e=>e.id===i.discussion),o="string"==typeof i.name?i.name:void 0,r=a?function(e,t){return void 0===t||t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0}(a,o):void 0;if(!a||!r)return Object.assign({name:e,status:"gone"},a?{entry:a}:{});if("string"!=typeof i.author||!i.author||i.author!==a.author)return{name:e,status:"unverified",entry:a};const n=Date.parse(null!==(s=i.updated)&&void 0!==s?s:""),l=Date.parse(a.updated);return{name:e,status:(Number.isFinite(n)?Number.isFinite(l)&&l>n:Number.isFinite(l))?"update":"current",entry:a,latest:Ga(r,Qa(a,null!=o?o:a.name))}})}function eo(e){if(""===e)return[];const t=e.split("\n");return""===t[t.length-1]&&t.pop(),t}function to(e,t){const i=e=>({kind:"remove",text:e}),s=e=>({kind:"add",text:e});if(!e.length||!t.length||e.length*t.length>4e6)return[...e.map(i),...t.map(s)];const a=e.length,o=t.length,r=Array.from({length:a+1},()=>new Uint32Array(o+1));for(let h=a-1;h>=0;h-=1)for(let i=o-1;i>=0;i-=1)r[h][i]=e[h]===t[i]?r[h+1][i+1]+1:Math.max(r[h+1][i],r[h][i+1]);const n=[];let l=0,d=0;for(;l<a&&d<o;)e[l]===t[d]?(n.push({kind:"same",text:e[l]}),l+=1,d+=1):r[l+1][d]>=r[l][d+1]?(n.push(i(e[l])),l+=1):(n.push(s(t[d])),d+=1);for(;l<a;)n.push(i(e[l++]));for(;d<o;)n.push(s(t[d++]));return n}const io=e`<style>
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
</style>`;function so(e){return"string"==typeof e?e:void 0===e?"":K(e)}const ao={same:" ",add:"+",remove:"-"};function oo(t,i,s,o=3){const r=function(e,t){const i=eo(e),s=eo(t);let a=0;for(;a<i.length&&a<s.length&&i[a]===s[a];)a+=1;let o=i.length,r=s.length;for(;o>a&&r>a&&i[o-1]===s[r-1];)o-=1,r-=1;const n=i.slice(0,a).map(e=>({kind:"same",text:e})),l=i.slice(o).map(e=>({kind:"same",text:e}));return[...n,...to(i.slice(a,o),s.slice(a,r)),...l]}(so(t),so(i));return function(e){return e.some(e=>"same"!==e.kind)}(r)?e`${io}
    <div class="dcp-diff" role="figure" aria-label=${a("diff.label",void 0,s)}>
      ${function(e,t=3){const i=e.map(e=>"same"!==e.kind),s=new Array(e.length).fill(!1);e.forEach((i,a)=>{if("same"!==i.kind)for(let o=Math.max(0,a-t);o<=Math.min(e.length-1,a+t);o+=1)s[o]=!0});const a=[];let o=0;for(;o<e.length;){if(i[o]||s[o]){a.push(e[o]),o+=1;continue}let t=o;for(;t<e.length&&!i[t]&&!s[t];)t+=1;const r=t-o;1===r?a.push(e[o]):a.push({kind:"skip",count:r}),o=t}return a}(r,o).map(t=>function(t,i){return"skip"===t.kind?e`<div class="skip">${a("diff.skipped",{count:t.count},i)}</div>`:e`<div class=${t.kind}>${ao[t.kind]} ${t.text}</div>`}(t,s))}
    </div>`:e`${io}
      <p class="dcp-diff-none">${a("diff.no_change",void 0,s)}</p>`}function ro(t,i,s){var o,r;const n=null!==(o=JSON.stringify(t))&&void 0!==o?o:"",l=null!==(r=JSON.stringify(i))&&void 0!==r?r:"";return e`
    ${oo(t,i,s)}
    <ha-expansion-panel outlined>
      <span slot="header">${a("diff.full",void 0,s)}</span>
      <p class="dcp-diff-none">${a("diff.before",void 0,s)}</p>
      ${ca(n,e`<ha-yaml-editor .hass=${s} .defaultValue=${t} read-only></ha-yaml-editor>`)}
      <p class="dcp-diff-none">${a("diff.after",void 0,s)}</p>
      ${ca(l,e`<ha-yaml-editor .hass=${s} .defaultValue=${i} read-only></ha-yaml-editor>`)}
    </ha-expansion-panel>
  `}const no=["readme","related","setup","requires_entities","requires_homeassistant","requires_card"];class lo extends m{constructor(){super(...arguments),this._importParses=!0,this._importErrors=[],this._importArmedAt=0,this._copyState="",this._busy=!1,this._libraryDestination="view",this._communityLoading=!1,this._communityKnownFailed=!1,this._installArmedAt=0,this._postCopyState="",this._setupValues={},this._updatesLoading=!1,this._updateArmedAt=0,this._trashArmedAt=0}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=Q())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:O()}static get styles(){return Xs}_fireConfigChanged(e){v(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return Gs(this,e,t,i)}render(){return this.hass&&this._config?this._renderShare():e``}async _loadTrash(){this.hass&&(this._trash=await Ze(this.hass))}_renderShare(){const{payload:t,notes:i}=xs(this._config,A(this._savedLovelace));return e`
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
          <a href=${fa} target="_blank" rel="noopener noreferrer"
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
    `}_renderDetails(){var t,i,s,o;const r=this._config,n=function(e){const t=e&&"object"==typeof e?e:{},i=t.author&&"object"==typeof t.author&&!Array.isArray(t.author)?t.author:void 0,s=t.requires&&"object"==typeof t.requires&&!Array.isArray(t.requires)?t.requires:{},a={author_name:ms(i?i.name:t.author),author_github:ms(null==i?void 0:i.github),author_email:ms(null==i?void 0:i.email),author_url:ms(null==i?void 0:i.url),license:ms(t.license),help:ms(t.help),homepage:ms(t.homepage),readme:ms(t.readme),related:_s(t.related),setup:_s(t.setup),requires_integrations:_s(s.integrations),requires_entities:_s(s.entities),requires_custom_cards:_s(s.custom_cards),requires_homeassistant:ms(s.homeassistant),requires_card:ms(s.card)};for(const o of Object.keys(a))void 0===a[o]&&delete a[o];return a}(r),l=e=>[...new Set(e)].sort().map(e=>({value:e,label:e})),d=e=>({select:{multiple:!0,custom_value:!0,options:l(e)}}),h=Object.keys(A(this._savedLovelace)).filter(e=>e!==r.template),c=[...P(r).map(e=>e.name),...null!==(t=n.setup)&&void 0!==t?t:[]],u=(Array.isArray(null===(s=null===(i=this.hass)||void 0===i?void 0:i.config)||void 0===s?void 0:s.components)?this.hass.config.components:[]).filter(e=>!e.includes(".")),p=(null!==(o=window.customCards)&&void 0!==o?o:[]).map(e=>e.type).filter(e=>"string"==typeof e),m=(e,t)=>({name:e,selector:t}),_=[m("author_name",{text:{}}),m("author_github",{text:{}}),m("author_email",{text:{}}),m("author_url",{text:{type:"url"}}),m("license",{text:{}}),m("help",{text:{type:"url"}}),m("homepage",{text:{type:"url"}}),m("readme",{text:{multiline:!0}}),m("related",d(h)),m("setup",d(c)),m("requires_integrations",d(u)),m("requires_entities",d([])),m("requires_custom_cards",d(p)),m("requires_homeassistant",{text:{}}),m("requires_card",{text:{}})];return e`
      <ha-expansion-panel outlined class="details">
        <span slot="header">${a("share.details_header",void 0,this.hass)}</span>
        <p class="hint">${a("share.details_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${n}
          .schema=${_}
          .computeLabel=${e=>a(`share.details_${e.name}`,void 0,this.hass)}
          .computeHelper=${e=>no.includes(e.name)?a(`share.details_${e.name}_helper`,void 0,this.hass):""}
          @value-changed=${this._detailsChanged}
        ></ha-form>
      </ha-expansion-panel>
    `}_detailsChanged(e){if(e.stopPropagation(),!this._config)return;const t=function(e,t){var i;const s=Object.assign({},e),a=(e,t)=>{void 0===t||Array.isArray(t)&&!t.length?delete s[e]:s[e]=t},o={},r=vs(t.author_name);r&&(o.name=r);for(const h of["github","email","url"]){const e=vs(t[`author_${h}`]);e&&(o[h]=e)}const n=e.author&&"object"==typeof e.author&&!Array.isArray(e.author)?e.author:{};for(const[h,c]of Object.entries(n))["name","github","email","url"].includes(h)||(o[h]=c);const l=Object.keys(o);a("author",l.length?1===l.length&&r?r:o:void 0);for(const h of["license","help","homepage"])a(h,vs(t[h]));a("readme","string"==typeof t.readme&&t.readme.trim()?t.readme:void 0),a("related",gs(t.related)),a("setup",gs(t.setup));const d=e.requires&&"object"==typeof e.requires&&!Array.isArray(e.requires)?Object.assign({},e.requires):{};for(const[h,c]of Object.entries(ps)){const e=[].concat(null!==(i=d[h])&&void 0!==i?i:[]).filter(e=>"string"!=typeof e),s=[...gs(t[c]),...e];s.length?d[h]=s:delete d[h]}for(const h of["homeassistant","card"]){const e=vs(t[`requires_${h}`]);e?d[h]=e:delete d[h]}return a("requires",Object.keys(d).length?d:void 0),s}(this._config,e.detail.value);this._fireConfigChanged(t)}_renderCommunity(){const t=this._community,i=e`
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
      `;const s=this._communityExisting(),o=t.entries.find(e=>e.id===this._communitySelected),r=o?`community:${o.id}:${o.updated}`:"",n=!!o&&this._installPending===r,l=o&&s.includes(o.name)?js(o.name,s):void 0,d=o?function(e,t){const i=new Set,s=new Set;for(const a of[e.template,...Object.values(e.includes)]){const e=ws(a);e.customTypes.forEach(e=>i.add(e)),e.templateRefs.forEach(e=>s.add(e))}return{customTypes:[...i].sort(),templates:[...s].filter(i=>i!==e.name&&!(i in e.includes)&&!t.includes(i)).sort()}}(o,s):void 0,h=o?Object.keys(o.includes).filter(e=>!s.includes(e)):[],c=o?Wa(o):void 0,u=void 0!==this._communityKnown;return e`
      <div class="library">
        ${i}
        ${t.entries.length?e`<ha-form
                .hass=${this.hass}
                .data=${{entry:o?String(o.id):""}}
                .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:t.entries.map(e=>({value:String(e.id),label:a("share.community_by",{title:e.title,author:e.author},this.hass)}))}}}]}
                .computeLabel=${()=>a("share.community_pick",void 0,this.hass)}
                @value-changed=${this._communityPicked}
              ></ha-form>`:e`<p class="hint">${a("share.community_none",void 0,this.hass)}</p>`}
        ${o&&d?e`
                <p class="hint">
                  ${"string"==typeof o.template.description?o.template.description:""}
                  <a href=${o.url} target="_blank" rel="noopener noreferrer"
                    >${a("share.community_open",void 0,this.hass)}</a
                  >
                </p>
                ${this._renderAbout(o.template)}
                ${h.length?e`<p class="hint">
                        ${a("share.library_needs",{names:h.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderUnmet([o.template,...Object.values(o.includes)])}
                ${this._renderMissingCards([o.template,...Object.values(o.includes)])}
                ${d.templates.length?e`<ha-alert alert-type="warning">
                        ${a("share.community_needs_templates",{names:d.templates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
                ${c&&Zs(c)?this._renderRisks(c,"share.community_risks"):e``}
                ${this._renderSetup([o.template,...Object.values(o.includes)])}
                <ha-expansion-panel outlined expanded>
                  <span slot="header">${a("share.library_preview",void 0,this.hass)}</span>
                  ${ca(`${o.id}:${o.updated}`,e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${Object.assign(Object.assign({template:o.name},o.template),Object.keys(o.includes).length?{includes:o.includes}:{})}
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
                <ha-button .disabled=${this._busy||!u} @click=${()=>{this._installShared(o)}}>
                  ${u||this._communityKnownFailed?n?a("share.install_anyway",void 0,this.hass):l?a("share.community_install_as",{name:l},this.hass):a("share.install",void 0,this.hass):a("share.community_names_loading",void 0,this.hass)}
                </ha-button>
              `:e``}
        <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!0)}}>
          ${a(this._communityLoading?"share.community_loading":"share.community_refresh",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderAbout(t){var i,s,o;const r=ss(t),n=(l=r.author)?[l.name,l.github?`@${l.github}`:void 0,l.email].filter(Boolean).join(" · "):"";var l;const d=null!==(s=null===(i=r.author)||void 0===i?void 0:i.url)&&void 0!==s?s:(null===(o=r.author)||void 0===o?void 0:o.github)?`https://github.com/${r.author.github}`:void 0,h=[r.help?{url:r.help,label:a("share.about_help",void 0,this.hass)}:void 0,r.homepage?{url:r.homepage,label:a("share.about_homepage",void 0,this.hass)}:void 0].filter(e=>!!e);return n||r.license||h.length||r.readme?e`
      ${n||r.license||h.length?e`<p class="hint about">
              ${n?e`<span
                      >${a("share.about_author",void 0,this.hass)}
                      ${d?e`<a href=${d} target="_blank" rel="noopener noreferrer">${n}</a>`:n}</span
                    >`:e``}
              ${r.license?e`<span>${a("share.about_license",{license:r.license},this.hass)}</span>`:e``}
              ${h.map(t=>e`<a href=${t.url} target="_blank" rel="noopener noreferrer">${t.label}</a>`)}
            </p>`:e``}
      ${r.readme?e`<ha-expansion-panel outlined>
              <span slot="header">${a("share.about_readme",void 0,this.hass)}</span>
              <ha-markdown class="readme" .content=${r.readme}></ha-markdown>
            </ha-expansion-panel>`:e``}
    `:e``}_renderUnmet(t){const i=t.filter(e=>void 0!==e),s=new Set(As(i,Bs)),o=function(e,t){const i=new Set,s=[];for(const a of e)for(const e of ls(a)){const a=`${e.kind}:${e.any.join("|")}`;if(i.has(a))continue;if(i.add(a),hs(e,t))continue;const o="homeassistant"===e.kind?t.homeassistant:"card"===e.kind?t.card:void 0;s.push(o?Object.assign(Object.assign({},e),{have:o}):e)}return s}(i,(r=this.hass,n=at,l=Bs,{components:Array.isArray(null===(d=null==r?void 0:r.config)||void 0===d?void 0:d.components)?r.config.components:[],entities:Object.keys(null!==(h=null==r?void 0:r.states)&&void 0!==h?h:{}),homeassistant:"string"==typeof(null===(c=null==r?void 0:r.config)||void 0===c?void 0:c.version)?r.config.version:void 0,card:n,isDefined:l})).filter(e=>!("custom_card"===e.kind&&!e.message&&e.any.every(e=>s.has(e))));var r,n,l,d,h,c;return o.length?e`<ha-alert alert-type="warning" .title=${a("share.requires_header",void 0,this.hass)}>
      <ul class="risks">
        ${o.map(t=>e`<li>${this._unmetLine(t)}</li>`)}
      </ul>
      ${a("share.requires_hint",void 0,this.hass)}
    </ha-alert>`:e``}_unmetLine(e){var t;const i=a("share.requires_or",void 0,this.hass),s=a(`share.requires_${e.kind}`,{names:e.any.join(i),want:e.any[0],have:null!==(t=e.have)&&void 0!==t?t:"?"},this.hass);return e.message?`${s}: ${e.message}`:s}_renderSetup(t){const i=t.filter(e=>void 0!==e),s=function(e){const t=[];for(const i of e)for(const e of ss(i).setup)t.includes(e)||t.push(e);return t}(i);if(!s.length)return e``;const o=e=>{if(e in this._setupValues)return this._setupValues[e];for(const t of i){const i=cs(t,e);if(void 0!==i)return i}return""};return e`
      <h4>${a("share.setup_header",void 0,this.hass)}</h4>
      <p class="hint">${a("share.setup_hint",void 0,this.hass)}</p>
      <ha-form
        .hass=${this.hass}
        .data=${s.reduce((e,t)=>Object.assign(Object.assign({},e),{[t]:o(t)}),{})}
        .schema=${s.map(e=>({name:e,selector:{text:{}}}))}
        .computeLabel=${e=>e.name}
        @value-changed=${this._setupChanged}
      ></ha-form>
    `}_setupChanged(e){var t;e.stopPropagation();const i={};for(const[s,a]of Object.entries(null!==(t=e.detail.value)&&void 0!==t?t:{}))i[s]=null==a?"":String(a);this._setupValues=i}_keptSetup(e){const t={};for(const i of ss(e).setup){const s=cs(e,i);void 0!==s&&(t[i]=s)}return t}_renderRisks(t,i){return e`<ha-alert alert-type="warning" .title=${a(i,void 0,this.hass)}>
      <ul class="risks">
        ${t.actions.length?e`<li>${a("share.community_risk_actions",{list:t.actions.join(", ")},this.hass)}</li>`:e``}
        ${t.urls.length?e`<li>${a("share.community_risk_urls",{list:t.urls.join(", ")},this.hass)}</li>`:e``}
        ${t.embeds?e`<li>${a("share.community_risk_embeds",void 0,this.hass)}</li>`:e``}
        ${t.scripts?e`<li>${a("share.community_risk_scripts",void 0,this.hass)}</li>`:e``}
        ${t.placeholders?e`<li>${a("share.community_risk_placeholders",void 0,this.hass)}</li>`:e``}
        ${t.overlay?e`<li>${a("share.community_risk_overlay",void 0,this.hass)}</li>`:e``}
      </ul>
    </ha-alert>`}async _loadCommunity(e){var t,i;this._communityLoading=!0,this._communityError=void 0,this._installPending=void 0,this._communityKnown=void 0,this._communityKnownFailed=!1;try{this._community=await Ya({refresh:e})}catch(s){const e=s;e.cached&&(this._community=e.cached),this._communityError=e.retryAt?a("share.community_rate_limited",{time:new Date(e.retryAt).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)},this.hass):a("share.community_failed",{message:e.message},this.hass)}finally{this._communityLoading=!1}this._community&&this._loadCommunityKnown()}_communityExisting(){var e;const t=Object.keys(A(this._savedLovelace));return[...new Set([...t,...null!==(e=this._communityKnown)&&void 0!==e?e:[]])]}async _loadCommunityKnown(){try{const e=await Ae(this.hass,this._savedLovelace);this._communityKnown=Object.keys(e)}catch(e){this._communityKnownFailed=!0}}_communityPicked(e){e.stopPropagation();const t=Number(e.detail.value.entry);this._communitySelected=Number.isFinite(t)&&t>0?t:void 0,this._installPending=void 0,this._setupValues={}}async _installShared(e){var t,i,s,a,o;if(void 0===this._communityKnown)return;const r=`community:${e.id}:${e.updated}`;if(this._installPending!==r)return this._installPending=r,void(this._installArmedAt=Date.now());if(Date.now()-this._installArmedAt<Ks)return;const n=Q(),l=this._communityExisting(),d=l.includes(e.name)?js(e.name,l):e.name,h=[...Object.entries(e.includes).filter(([e])=>!l.includes(e)).map(([t,i])=>[t,Ga(us(i,this._setupValues),Qa(e,t))]),[d,Ga(us(e.template,this._setupValues),Qa(e,e.name))]],c=ae(null!==(t=null==n?void 0:n.config)&&void 0!==t?t:this.lovelace,null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""),u=null!==(o=null===(a=null==c?void 0:c.view)||void 0===a?void 0:a.index)&&void 0!==o?o:0;await this._saveDashboard(e=>h.reduce((e,[t,i])=>"root"===this._libraryDestination?Ke(e,t,i):Ye(e,u,Object.assign({type:Ee,template:t},i,{type:Ee,template:t})),e),"community_install")&&(this._installPending=void 0,this._setupValues={})}_renderMissingCards(t){const i=As(t.filter(e=>void 0!==e),Bs);return i.length?e`<ha-alert alert-type="warning">
      ${a(1===i.length?"share.missing_card_one":"share.missing_card_many",{cards:i.join(", ")},this.hass)}
    </ha-alert>`:e``}_renderInstalled(){var t;const i=Qe(this._savedLovelace);if(!i.length)return e``;const s=new Map((null!==(t=this._updates)&&void 0!==t?t:[]).map(e=>[e.name,e]));return e`
      <h3>${a("share.installed_header",void 0,this.hass)}</h3>
      <p class="hint">${a("share.installed_hint",void 0,this.hass)}</p>
      ${this._updatesError?e`<ha-alert alert-type="warning">${this._updatesError}</ha-alert>`:e``}
      <ul class="installed">
        ${i.map(({name:t,source:i,template:o})=>{var r,n;const l=s.get(t);return e`<li>
            ${t} —
            <a
              href=${null!==(n=null===(r=null==l?void 0:l.entry)||void 0===r?void 0:r.url)&&void 0!==n?n:`https://github.com/${va}/discussions/${i.discussion}`}
              target="_blank"
              rel="noopener noreferrer"
              >${a("share.installed_from",{discussion:i.discussion},this.hass)}</a
            >
            ${l?e`<span class="status"
                    >${a(`share.installed_status_${l.status}`,void 0,this.hass)}</span
                  >`:e``}
            ${"update"===(null==l?void 0:l.status)&&l.latest?this._renderUpdate(t,o,l):e``}
          </li>`})}
      </ul>
      <ha-button .disabled=${this._updatesLoading} @click=${()=>{this._checkUpdates()}}>
        ${a(this._updatesLoading?"share.community_loading":"share.installed_check",void 0,this.hass)}
      </ha-button>
    `}_renderUpdate(t,i,s){const o=us(s.latest,this._keptSetup(i)),r=e=>{const t=Object.assign({},e);return delete t.source,delete t.type,delete t.template,t},n=r(i),l=r(o),d=Wa({template:l,includes:{}}),h=function(e,t){return{actions:e.actions.filter(e=>!t.actions.includes(e)),urls:e.urls.filter(e=>!t.urls.includes(e)),embeds:e.embeds&&!t.embeds,scripts:e.scripts&&!t.scripts,placeholders:e.placeholders&&!t.placeholders,overlay:e.overlay&&!t.overlay}}(d,Wa({template:n,includes:{}})),c=this._updatePending===t;return e`
      <p class="hint">${a("share.installed_compare",void 0,this.hass)}</p>
      ${ro(n,l,this.hass)} ${this._renderMissingCards([o])} ${this._renderUnmet([o])}
      ${Zs(h)?this._renderRisks(h,"share.installed_risks_new"):Zs(d)?this._renderRisks(d,"share.installed_risks"):e``}
      ${c?e`<ha-alert alert-type="warning">
              ${a("share.installed_update_confirm",{name:t},this.hass)}
            </ha-alert>`:e``}
      <ha-button .disabled=${this._busy} @click=${()=>{this._updateShared(t,o)}}>
        ${a(c?"share.installed_update_anyway":"share.installed_update",void 0,this.hass)}
      </ha-button>
    `}async _checkUpdates(){var e,t;this._updatesLoading=!0,this._updatesError=void 0,this._updatePending=void 0;const i=Qe(this._savedLovelace);try{this._updates=Xa(i,await Ya({refresh:!0}))}catch(s){const i=s;this._updatesError=i.retryAt?a("share.community_rate_limited",{time:new Date(i.retryAt).toLocaleTimeString(null===(t=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===t?void 0:t.language)},this.hass):a("share.community_failed",{message:i.message},this.hass)}finally{this._updatesLoading=!1}}async _updateShared(e,t){var i,s;if(this._updatePending!==e)return this._updatePending=e,void(this._updateArmedAt=Date.now());if(Date.now()-this._updateArmedAt<Ks)return;await this._saveDashboard(i=>Ge(i,e,t),"shared_update")&&(this._updatePending=void 0,this._updates=null===(i=this._updates)||void 0===i?void 0:i.map(t=>t.name===e?Object.assign(Object.assign({},t),{status:"current"}):t),(null===(s=this._config)||void 0===s?void 0:s.template)===e&&this._fireConfigChanged(Object.assign(Object.assign({},t),{type:this._config.type,template:e})))}_renderLibrary(){var t;const i=Object.keys(A(this._savedLovelace)),s=this._librarySelected?pa(this._librarySelected):void 0,o=!!s&&i.includes(s.name),r=!!s&&this._installPending===s.name,n=s?ma(s,i):[];return e`
      <div class="library">
        <ha-form
          .hass=${this.hass}
          .data=${{entry:null!==(t=this._librarySelected)&&void 0!==t?t:""}}
          .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:ua.map(e=>({value:e.name,label:e.name}))}}}]}
          .computeLabel=${()=>a("share.library_pick",void 0,this.hass)}
          @value-changed=${this._libraryPicked}
        ></ha-form>
        ${s?e`
                <p class="hint">${a(`library.${s.name}.summary`,void 0,this.hass)}</p>
                ${n.length?e`<p class="hint">
                        ${a("share.library_needs",{names:n.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderMissingCards([s,...n.map(e=>pa(e))].map(e=>null==e?void 0:e.template))}
                <ha-expansion-panel outlined>
                  <span slot="header">${a("share.library_preview",void 0,this.hass)}</span>
                  ${ca(s.name,e`<ha-yaml-editor
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
                <ha-button .disabled=${this._busy||o} @click=${()=>{this._install(s.name)}}>
                  ${a(o?"share.already_here":r?"share.install_anyway":"share.install",void 0,this.hass)}
                </ha-button>
              `:e``}
      </div>
    `}_libraryDestinationPicked(e){e.stopPropagation();const t=e.detail.value.where;this._libraryDestination="root"===t?"root":"view"}_libraryPicked(e){e.stopPropagation(),this._librarySelected=e.detail.value.entry||void 0,this._installPending=void 0}async _install(e){var t,i,s,a,o,r;const n=pa(e);if(!n)return;if(this._installPending!==e)return void(this._installPending=e);const l=Q(),d=Object.keys(A(null!==(t=null==l?void 0:l.config)&&void 0!==t?t:this._savedLovelace)),h=[...ma(n,d),n.name].filter(e=>!d.includes(e)),c=ae(null!==(i=null==l?void 0:l.config)&&void 0!==i?i:this.lovelace,null!==(a=null===(s=this._config)||void 0===s?void 0:s.template)&&void 0!==a?a:""),u=null!==(r=null===(o=null==c?void 0:c.view)||void 0===o?void 0:o.index)&&void 0!==r?r:0;await this._saveDashboard(e=>h.reduce((e,t)=>{const i=pa(t);if(!i)return e;const s=Object.assign(Object.assign({},i.template),{source:_a(i.name,at)});return"root"===this._libraryDestination?Ke(e,i.name,s):Ye(e,u,Object.assign({type:Ee,template:i.name},s))},e),"library_install")&&(this._installPending=void 0)}async _copyExport(){const e=this.renderRoot.querySelector("#export"),t=null==e?void 0:e.yaml;if(!t)return;const{notes:i}=xs(this._config),s=[...i.map(e=>`# ${e}`),t].join("\n");this._copyState=await Y(s)?"done":"failed",setTimeout(()=>this._copyState="",3e3)}async _copyPost(){var e,t;const i=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!i)return;const{notes:s}=xs(this._config,A(this._savedLovelace));this._postCopyState=await Y(function(e,t,i){return[...[i,...t].filter(e=>"string"==typeof e&&e.trim()),"```yaml\n"+e.replace(/\n*$/,"")+"\n```"].join("\n\n")+"\n"}(i,s,null===(t=this._config)||void 0===t?void 0:t.description))?"done":"failed",setTimeout(()=>this._postCopyState="",3e3)}_downloadExport(){var e,t,i;const s=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!s)return;const{notes:a}=xs(this._config),o=[...a.map(e=>`# ${e}`),s].join("\n"),r=document.createElement("a");r.href=URL.createObjectURL(new Blob([o],{type:"text/yaml"})),r.download=`${(null!==(i=null===(t=this._config)||void 0===t?void 0:t.template)&&void 0!==i?i:"template").replace(/[^\w-]+/g,"_")}.yaml`,r.click(),setTimeout(()=>URL.revokeObjectURL(r.href),1e3)}async _importFile(e){var t,i,s;const o=e.target,r=null===(t=o.files)||void 0===t?void 0:t[0];if(o.value="",!r)return;const n=await r.text(),l=null===(s=null===(i=this.renderRoot.querySelector("#import"))||void 0===i?void 0:i.shadowRoot)||void 0===s?void 0:s.querySelector("ha-code-editor");l?(l.value=n,l.dispatchEvent(new CustomEvent("value-changed",{detail:{value:n}}))):this._importErrors=[a("share.import_not_yaml",void 0,this.hass)]}_renderTrash(){if(void 0===this._trash)return this._loadTrash(),e``;const t=e=>{var t,i;return new Date(e).toLocaleString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)};return e`
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
    `}async _restore(e,t){var i,s;if(!this.hass)return;const o=Xe(this.hass);let r;try{r=await et(o,e.dashboard)}catch(l){return void(this._toolError=a("tools.save_failed",{message:null!==(i=null==l?void 0:l.message)&&void 0!==i?i:l},this.hass))}const n=e.name in A(r);if(n&&this._trashPending!==t)return this._trashPending=t,void(this._trashArmedAt=Date.now());if(!(n&&Date.now()-this._trashArmedAt<Ks)){this._busy=!0,this._toolError=void 0;try{await X(this,this.hass,"restore",[{urlPath:e.dashboard,build:t=>tt(t,e)}]),this._trashPending=void 0,this._trashShown=void 0,await this._forget(e)}catch(l){this._toolError=a("tools.save_failed",{message:null!==(s=null==l?void 0:l.message)&&void 0!==s?s:l},this.hass)}finally{this._busy=!1}}}async _forget(e){if(!this.hass)return;const t=it(await Ze(this.hass),e);await st(this.hass,t),this._trash=t,this._trashPending=void 0}_renderImportDetails(){const t=this._importValue;if(!this._importParses||!t||"object"!=typeof t||Array.isArray(t))return e``;if(!ba(t))return e``;const i=[t,...t.includes&&"object"==typeof t.includes&&!Array.isArray(t.includes)?Object.values(t.includes):[]];return e`${this._renderAbout(t)} ${this._renderUnmet(i)} ${this._renderSetup(i)}`}_importChanged(e){e.stopPropagation(),this._importValue=e.detail.value,this._importParses=!1!==e.detail.isValid,this._importErrors=[],this._importClash=void 0,this._importRisks=void 0,this._setupValues={}}_import(){if(!this._config)return;if(!this._importParses)return void(this._importErrors=[a("share.import_not_yaml",void 0,this.hass)]);if(!ba(this._importValue))return void(this._importErrors=[a("share.import_too_big",void 0,this.hass)]);const e=Os(this._importValue);if(!e.ok)return this._importErrors=e.errors,void(this._importClash=void 0);this._importErrors=[];const t=this._importValue.template,i=A(this._savedLovelace),s=t!==this._config.template&&t in i?t:void 0,o=Wa({template:this._importValue,includes:{}});if(s&&!this._importClash||Zs(o)&&!this._importRisks)return this._importClash=s,this._importRisks=Zs(o)?o:void 0,void(this._importArmedAt=Date.now());Date.now()-this._importArmedAt<Ks||this._applyImport(t)}_importAsCopy(){if(!this._config||!this._importParses)return;if(Date.now()-this._importArmedAt<Ks)return;const e=Object.keys(A(this._savedLovelace));this._applyImport(js(this._importValue.template,e))}_applyImport(e){var t;const i=function(e){const t=ks(e);if((null==t?void 0:t.includes)&&"object"==typeof t.includes&&!Array.isArray(t.includes)){const e={};for(const[i,s]of Object.entries(t.includes))e[i]=ks(s);t.includes=e}return t}(this._importValue),s=us(i,this._setupValues);s.includes&&"object"==typeof s.includes&&!Array.isArray(s.includes)&&(s.includes=Object.entries(s.includes).reduce((e,[t,i])=>Object.assign(Object.assign({},e),{[t]:i&&"object"==typeof i&&!Array.isArray(i)?us(i,this._setupValues):i}),{}));const a=s.includes;if(a&&"object"==typeof a&&!Array.isArray(a)){const e=Object.keys(A(this._savedLovelace)),t=Object.entries(a).filter(([t])=>!e.includes(t));t.length&&this._saveDashboard(e=>t.reduce((e,[t,i])=>Ke(e,t,i),e),"import",this._config)}const o=Object.assign(Object.assign({},s),{template:e,type:null===(t=this._config)||void 0===t?void 0:t.type});delete o.includes,this._fireConfigChanged(o),this._importClash=void 0,this._importRisks=void 0,this._setupValues={},this.dispatchEvent(new CustomEvent("select-tab",{detail:"settings",bubbles:!0,composed:!0}))}}c([u({attribute:!1})],lo.prototype,"hass",void 0),c([u({attribute:!1})],lo.prototype,"lovelace",void 0),c([u({attribute:!1})],lo.prototype,"config",void 0),c([p()],lo.prototype,"_importErrors",void 0),c([p()],lo.prototype,"_importClash",void 0),c([p()],lo.prototype,"_importRisks",void 0),c([p()],lo.prototype,"_copyState",void 0),c([p()],lo.prototype,"_toolError",void 0),c([p()],lo.prototype,"_busy",void 0),c([p()],lo.prototype,"_installPending",void 0),c([p()],lo.prototype,"_librarySelected",void 0),c([p()],lo.prototype,"_libraryDestination",void 0),c([p()],lo.prototype,"_community",void 0),c([p()],lo.prototype,"_communityLoading",void 0),c([p()],lo.prototype,"_communityError",void 0),c([p()],lo.prototype,"_communitySelected",void 0),c([p()],lo.prototype,"_communityKnown",void 0),c([p()],lo.prototype,"_communityKnownFailed",void 0),c([p()],lo.prototype,"_postCopyState",void 0),c([p()],lo.prototype,"_setupValues",void 0),c([p()],lo.prototype,"_updates",void 0),c([p()],lo.prototype,"_updatesLoading",void 0),c([p()],lo.prototype,"_updatesError",void 0),c([p()],lo.prototype,"_updatePending",void 0),c([p()],lo.prototype,"_trash",void 0),c([p()],lo.prototype,"_trashShown",void 0),c([p()],lo.prototype,"_trashPending",void 0),customElements.get("decluttering-template-share-tab")||customElements.define("decluttering-template-share-tab",lo)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;const ho=(e,t,i)=>{const s=new Map;for(let a=t;a<=i;a++)s.set(e[a],a);return s},co=ta(class extends ia{constructor(e){if(super(e),e.type!==ea)throw Error("repeat() can only be used in text expressions")}dt(e,t,i){let s;void 0===i?i=t:void 0!==t&&(s=t);const a=[],o=[];let r=0;for(const n of e)a[r]=s?s(n,r):r,o[r]=i(n,r),r++;return{values:o,keys:a}}render(e,t,i){return this.dt(e,t,i).values}update(e,[t,i,s]){const a=(e=>e._$AH)(e),{values:o,keys:r}=this.dt(t,i,s);if(!Array.isArray(a))return this.ut=r,o;const n=this.ut??=[],l=[];let d,h,c=0,u=a.length-1,p=0,m=o.length-1;for(;c<=u&&p<=m;)if(null===a[c])c++;else if(null===a[u])u--;else if(n[c]===r[p])l[p]=na(a[c],o[p]),c++,p++;else if(n[u]===r[m])l[m]=na(a[u],o[m]),u--,m--;else if(n[c]===r[m])l[m]=na(a[c],o[m]),ra(e,l[m+1],a[c]),c++,m--;else if(n[u]===r[p])l[p]=na(a[u],o[p]),ra(e,a[c],a[u]),u--,p++;else if(void 0===d&&(d=ho(r,p,m),h=ho(n,c,u)),d.has(n[c]))if(d.has(n[u])){const t=h.get(r[p]),i=void 0!==t?a[t]:null;if(null===i){const t=ra(e,a[c]);na(t,o[p]),l[p]=t}else l[p]=na(i,o[p]),ra(e,a[c],i),a[t]=null;p++}else ha(a[u]),u--;else ha(a[c]),c++;for(;p<=m;){const t=ra(e,l[m+1]);na(t,o[p]),l[p++]=t}for(;c<=u;){const e=a[c++];null!==e&&ha(e)}return this.ut=r,da(e,l),ot}}),uo=["type","label","description","default","required","group","pattern","allowed","domain","device_class","min","max","step","unit","multiline","selector"];function po(e){const t={};for(const s of uo){const i=e[s];void 0!==i&&(t[s]=i)}Object.assign(t,e.extra);const i={name:e.name};for(const s of e.order)s in t&&(i[s]=t[s]);for(const s of Object.keys(t))s in i||(i[s]=t[s]);return i}function mo(e){return!!e&&"object"==typeof e&&!Array.isArray(e)}function _o(e,t){const i=e.map(po);if("mapping"===t){const e={};for(const t of i){const{name:i}=t,s=Be(t,["name"]),a=Object.keys(s);a.length?1!==a.length||"default"!==a[0]||mo(s.default)||null===s.default?e[String(i)]=s:e[String(i)]=s.default:e[String(i)]=null}return e}if("none"!==t||i.length)return i}function vo(e,t){const i=new Set(e.map(e=>e.name));if(!i.has(t))return t;let s=2;for(;i.has(`${t}_${s}`);)s+=1;return`${t}_${s}`}function go(e,t,i){const s=Object.assign(Object.assign({},e),{extra:Object.assign({},e.extra)});return void 0===i?delete s[t]:s[t]=i,s}function fo(e){return void 0!==e.type?String(e.type):e.selector&&"object"==typeof e.selector&&"card"in e.selector?"card":""}const yo=e=>Array.isArray(e)?e.map(String).join(", "):null==e?"":String(e),bo=e=>{const t=e.split(",").map(e=>e.trim()).filter(Boolean);return t.length?t:void 0};class $o extends m{constructor(){super(...arguments),this._reorderedAsList=!1,this.shared=[],this._asYaml=!1,this._picking=!1}static get styles(){return _`
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
    `}get _rows(){return function(e){var t;const i=[];for(const s of Ne(e)){if(!s||"object"!=typeof s)continue;const e={name:"string"==typeof s.name?s.name:String(null!==(t=s.name)&&void 0!==t?t:""),extra:{},order:Object.keys(s).filter(e=>"name"!==e)};for(const[t,i]of Object.entries(s))"name"!==t&&(uo.includes(t)?e[t]=i:e.extra[t]=i);i.push(e)}return i}(this.variables)}get _shape(){const e=(t=this.variables,Array.isArray(t)?"list":t&&"object"==typeof t?"mapping":"none");var t;return"none"===e?"list":e}render(){const t=this._rows;return e`
      ${this._asYaml?this._renderYaml():this._renderRows(t)}
      ${this._reorderedAsList?e`<p class="hint">${a("declarations.reordered_as_list",void 0,this.hass)}</p>`:We}
      <div class="add">
        <ha-button @click=${this._add}>${a("declarations.add",void 0,this.hass)}</ha-button>
        ${this.shared.length?e`<ha-button
                appearance="plain"
                @click=${()=>{this._picking=!this._picking}}
                >${a("declarations.take_shared",void 0,this.hass)}</ha-button
              >`:We}
        <span class="spacer"></span>
        <ha-button
          appearance="plain"
          @click=${()=>{this._asYaml=!this._asYaml}}
          >${a(this._asYaml?"declarations.as_rows":"declarations.as_yaml",void 0,this.hass)}</ha-button
        >
      </div>
      ${this._picking?this._renderShared(t):We}
    `}_renderRows(t){if(!t.length)return e`<div class="rows">
        <div class="empty">${a("declarations.none",void 0,this.hass)}</div>
      </div>`;const i=function(e){return e.map((t,i)=>{const s=void 0===t.group?void 0:String(t.group),a=i?e[i-1].group:void 0;return void 0!==s&&s!==(void 0===a?void 0:String(a))?s:void 0})}(t);return e`<div class="rows">
      ${co(t,e=>e.name,(s,o)=>e`
          ${void 0!==i[o]?e`<div class="group">${i[o]}</div>`:We}
          <div
            class="row"
            draggable="true"
            ?data-dragging=${this._dragging===o}
            @dragstart=${()=>{this._dragging=o}}
            @dragover=${e=>{void 0!==this._dragging&&e.preventDefault()}}
            @drop=${e=>this._drop(e,o)}
            @dragend=${()=>{this._dragging=void 0,this.requestUpdate()}}
          >
            <ha-svg-icon
              class="handle"
              role="img"
              aria-label=${a("template_editor.drag_hint",void 0,this.hass)}
              .path=${Ys}
            ></ha-svg-icon>
            <ha-form
              .hass=${this.hass}
              .data=${this._rowData(s)}
              .schema=${this._rowSchema(s)}
              .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
              @value-changed=${e=>this._rowChanged(e,o)}
            ></ha-form>
            <div class="buttons">
              <ha-icon-button
                .path=${"M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z"}
                .label=${a(this._open===s.name?"declarations.less":"declarations.more",void 0,this.hass)}
                @click=${()=>{this._open=this._open===s.name?void 0:s.name}}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,15L12,10L17,15H7Z"}
                .disabled=${0===o}
                .label=${a("template_editor.move_up",{name:s.name},this.hass)}
                @click=${()=>this._move(o,o-1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,10L12,15L17,10H7Z"}
                .disabled=${o===t.length-1}
                .label=${a("template_editor.move_down",{name:s.name},this.hass)}
                @click=${()=>this._move(o,o+1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                .label=${a("declarations.remove",{name:s.name},this.hass)}
                @click=${()=>this._remove(o)}
              ></ha-icon-button>
            </div>
          </div>
          ${this._open===s.name?this._renderMore(s,o):We}
        `)}
    </div>`}_renderMore(t,i){const s={description:t.description,group:t.group,pattern:t.pattern,domain:yo(t.domain),device_class:yo(t.device_class),min:t.min,max:t.max,step:t.step,unit:t.unit,allowed:yo(t.allowed),multiline:t.multiline};return e`<div class="more">
      <ha-form
        .hass=${this.hass}
        .data=${s}
        .schema=${function(e,t){const i=fo(e),s={name:"description",label:a("declarations.description",void 0,t),selector:{text:{multiline:!0}}},o=[{name:"group",label:a("declarations.group",void 0,t),selector:{text:{}}}],r="entity"===i?[{name:"domain",label:a("declarations.domain",void 0,t),selector:{text:{}}},{name:"device_class",label:a("declarations.device_class",void 0,t),selector:{text:{}}}]:"number"===i?[{name:"min",label:a("declarations.min",void 0,t),selector:{number:{mode:"box"}}},{name:"max",label:a("declarations.max",void 0,t),selector:{number:{mode:"box"}}},{name:"step",label:a("declarations.step",void 0,t),selector:{number:{mode:"box"}}},{name:"unit",label:a("declarations.unit",void 0,t),selector:{text:{}}}]:"select"===i?[{name:"allowed",label:a("declarations.allowed",void 0,t),selector:{text:{}}}]:"text"===i?[{name:"multiline",label:a("declarations.multiline",void 0,t),selector:{boolean:{}}}]:[],n="card"===i?[]:[{name:"pattern",label:a("declarations.pattern",void 0,t),selector:{text:{}}}];return[s,{name:"",type:"grid",column_min_width:"260px",schema:[...o,...r,..."select"!==i&&void 0!==e.allowed?[{name:"allowed",label:a("declarations.allowed",void 0,t),selector:{text:{}}}]:[],...n]}]}(t,this.hass)}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        @value-changed=${e=>this._moreChanged(e,i)}
      ></ha-form>
      ${void 0!==t.selector&&"card"!==fo(t)?e`<ha-form
              .hass=${this.hass}
              .data=${{selector:t.selector}}
              .schema=${[{name:"selector",label:a("declarations.selector",void 0,this.hass),selector:{object:{}}}]}
              .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
              @value-changed=${e=>this._selectorChanged(e,i)}
            ></ha-form>`:We}
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
                    ${t.label?e` - ${t.label}`:We}
                  </li>`)}
            </ul>`:e`<p>${a("declarations.take_shared_none",void 0,this.hass)}</p>`}
    </div>`}_rowData(e){const t=void 0===e.default||["string","number","boolean"].includes(typeof e.default);return{name:e.name,type:fo(e),label:e.label,default:t?void 0===e.default?void 0:String(e.default):e.default,required:!0===e.required}}_rowSchema(e){const t=void 0===e.default||["string","number","boolean"].includes(typeof e.default),[i]=(s=this.hass,[{name:"",type:"grid",column_min_width:"120px",schema:[{name:"name",label:a("declarations.name",void 0,s),selector:{text:{}}},{name:"type",label:a("declarations.type",void 0,s),selector:{select:{mode:"dropdown",options:[{value:"",label:a("declarations.type_any",void 0,s)},...rt.map(e=>({value:e,label:a(`type_name.${e}`,void 0,s)})),{value:"card",label:a("type_name.card",void 0,s)}]}}},{name:"label",label:a("declarations.label",void 0,s),selector:{text:{}}},{name:"default",label:a("declarations.default",void 0,s),selector:{text:{}}},{name:"required",label:a("declarations.required",void 0,s),selector:{boolean:{}}}]}]);var s;if(t)return[i];const o=i.schema.map(e=>"default"===e.name?(e=>({name:"default",label:a("declarations.default",void 0,e),selector:{object:{}}}))(this.hass):e);return[Object.assign(Object.assign({},i),{schema:o})]}_rowChanged(e,t){var i,s;e.stopPropagation();const a=this._rows,o=a[t];if(!o)return;const r=e.detail.value;let n=o;const l="string"==typeof r.name?r.name.trim():o.name;l&&l!==o.name&&(n=go(n,"name",vo(a.filter((e,i)=>i!==t),l)),this._open===o.name&&(this._open=n.name)),(null!==(i=r.type)&&void 0!==i?i:"")!==fo(o)&&(n=function(e,t){let i=go(e,"type",void 0);return i=go(i,"selector",void 0),"card"===t?go(i,"selector",{card:{}}):t?go(i,"type",t):i}(n,String(null!==(s=r.type)&&void 0!==s?s:""))),n=go(n,"label","string"==typeof r.label&&""!==r.label?r.label:void 0),n=go(n,"required",!0===r.required||void 0),r.default===o.default||""===r.default&&void 0===o.default||(n=go(n,"default",this._defaultFrom(r.default,o))),this._emit(_o(a.map((e,i)=>i===t?n:e),this._shape))}_defaultFrom(e,t){if(""===e||null==e)return;if("string"!=typeof e)return e;const i=fo(t);return"number"!==i||""===e.trim()||Number.isNaN(Number(e))?"boolean"===i&&["true","false"].includes(e.trim().toLowerCase())?"true"===e.trim():e:Number(e)}_moreChanged(e,t){e.stopPropagation();const i=this._rows,s=i[t];if(!s)return;const a=e.detail.value;let o=s;const r=e=>"string"==typeof e&&e.trim()?e:void 0;o=go(o,"description",r(a.description)),o=go(o,"group",r(a.group)),o=go(o,"pattern",r(a.pattern)),o=go(o,"unit",r(a.unit));for(const l of["min","max","step"])o=go(o,l,"number"==typeof a[l]?a[l]:void 0);o=go(o,"multiline",!0===a.multiline||void 0);const n=e=>{const t="string"==typeof e?bo(e):void 0;return void 0===t?void 0:1===t.length?t[0]:t};o=go(o,"domain",n(a.domain)),o=go(o,"device_class",n(a.device_class)),o=go(o,"allowed","string"==typeof a.allowed?bo(a.allowed):void 0),this._emit(_o(i.map((e,i)=>i===t?o:e),this._shape))}_selectorChanged(e,t){e.stopPropagation();const i=this._rows,s=e.detail.value.selector,a=go(i[t],"selector",s&&"object"==typeof s?s:void 0);this._emit(_o(i.map((e,i)=>i===t?a:e),this._shape))}_add(){const e=this._rows,t=function(e,t="variable"){return{name:vo(e,t),extra:{},order:[]}}(e);this._open=t.name,this._emit(_o([...e,t],this._shape))}_takeShared(e){const t=this._rows,i={name:e.name,extra:{},order:[]};this._picking=!1,this._emit(_o([...t,i],this._shape))}_remove(e){const t=this._rows;this._emit(_o(t.filter((t,i)=>i!==e),this._shape))}_move(e,t){const i=this._rows,s=function(e,t,i){if(t===i||t<0||i<0||t>=e.length||i>=e.length)return e;const s=[...e],[a]=s.splice(t,1);return s.splice(i,0,a),s}(i,e,t);if(s===i)return;const a="mapping"===this._shape?"list":this._shape;this._reorderedAsList="mapping"===this._shape,this._emit(_o(s,a))}_drop(e,t){e.preventDefault();const i=this._dragging;this._dragging=void 0,void 0!==i&&this._move(i,t)}_emit(e){v(this,"value-changed",{value:e})}}c([u({attribute:!1})],$o.prototype,"hass",void 0),c([u({attribute:!1})],$o.prototype,"variables",void 0),c([p()],$o.prototype,"_reorderedAsList",void 0),c([u({attribute:!1})],$o.prototype,"shared",void 0),c([p()],$o.prototype,"_open",void 0),c([p()],$o.prototype,"_asYaml",void 0),c([p()],$o.prototype,"_picking",void 0);const wo="decluttering-declarations-editor";customElements.get(wo)||customElements.define(wo,$o);const xo=["name","title","label","entity","area","room"];function ko(e,t){const i=Object.assign({},r(t)),s=null==e?void 0:e.examples,a=null==s?[]:Array.isArray(s)?s:[s];return Object.assign(Object.assign({},e),{examples:[...a,i]})}class jo extends m{static get styles(){return _`
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
    `}render(){var t;const i=this.config,s=null==i?void 0:i.template;if(!i||!s)return e``;const o=V(i),n=nt.get(s),l=void 0===n||n>=o.length?"":String(n),d=null!==(t=A(this.lovelace,void 0,i)[s])&&void 0!==t?t:i,h=o.length?lt({[s]:d},[],this.hass):[],c=o.length-h.length,u=""===l?void 0:h.find(e=>e.example===Number(l)+1),p=[{name:"example",label:a("template_editor.preview_example_label",void 0,this.hass),selector:{select:{mode:"dropdown",options:[{value:"",label:a("template_editor.preview_defaults",void 0,this.hass)},...o.map((e,t)=>{const i=function(e){const t=r(e);for(const s of xo){const e=t[s];if("string"==typeof e&&e.trim())return e.trim();if("number"==typeof e)return String(e)}const i=e.map(z).find(e=>void 0!==e);if(void 0!==i){const e=t[i];if("string"==typeof e||"number"==typeof e)return`${i}: ${e}`}}(e),s=a("template_editor.example_n",{number:t+1},this.hass);return{value:String(t),label:i?`${s}: ${i}`:s}})]}}}];return e`
      <div class="strip">
        <ha-form
          .hass=${this.hass}
          .data=${{example:l}}
          .schema=${p}
          .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
          @value-changed=${this._picked}
        ></ha-form>
        ${o.length?e`<span class="passes ${c<o.length?"some":""}"
                >${a("template_editor.examples_pass",{passes:c,total:o.length},this.hass)}</span
              >`:We}
        <ha-icon-button
          .path=${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}
          .label=${a("template_editor.example_add",void 0,this.hass)}
          @click=${this._add}
        ></ha-icon-button>
      </div>
      ${u?e`<ha-alert alert-type="warning"
              >${a("tools.health_example",{template:s,number:u.example,problems:u.problems.join(" ")},this.hass)}</ha-alert
            >`:We}
    `}_picked(e){var t;e.stopPropagation();const i=null===(t=this.config)||void 0===t?void 0:t.template;if(!i)return;const s=e.detail.value.example;void 0===s||""===s?nt.delete(i):nt.set(i,Number(s)),window.dispatchEvent(new CustomEvent(dt,{detail:{template:i}})),this.dispatchEvent(new CustomEvent("example-picked",{detail:{template:i,example:""===s?void 0:Number(s)},bubbles:!0,composed:!0})),this.requestUpdate()}_add(){const e=this.config;if(!e)return;const t=V(e),i=nt.get(e.template),s=void 0!==i&&t[i]?t[i]:h(Se(e));v(this,"config-changed",{config:ko(e,s)})}}c([u({attribute:!1})],jo.prototype,"hass",void 0),c([u({attribute:!1})],jo.prototype,"lovelace",void 0),c([u({attribute:!1})],jo.prototype,"config",void 0);const Oo="decluttering-example-strip";customElements.get(Oo)||customElements.define(Oo,jo);const Ao="https://tempus2016.github.io/decluttering-card-plus/",So=`${Ao}help-index.json`,Po={template:"Defining-Templates.html",type:"Defining-Templates.html",description:"Defining-Templates.html",category:"Defining-Templates.html",variables:"Describing-Variables.html",default:"Variables.html",defaults:"Variables.html",let:"Variables.html",extends:"Defining-Templates.html",examples:"Describing-Variables.html",for_each:"Repeating-a-Template.html",for_each_from:"Repeating-a-Template.html",columns:"Repeating-a-Template.html",min_column_width:"Repeating-a-Template.html",gap:"Styling.html",empty:"Repeating-a-Template.html",lazy:"Repeating-a-Template.html",style:"Styling.html",grid_options:"Styling.html",on_error:"Using-Templates.html",rebuild_on:"Using-Templates.html",debug:"Troubleshooting.html",strict:"Using-Templates.html",fit:"Styling.html",group:"Cards.html",publish:"Using-Templates.html",suggest_for:"Using-Templates.html",visibility:"Visibility.html"};let Co;function Eo(e=fetch){return null!=Co||(Co=e(So,{cache:"force-cache"}).then(async e=>{if(!e.ok)return{};return function(e){const t={};if(!e||"object"!=typeof e)return t;for(const[i,s]of Object.entries(e)){if(!s||"object"!=typeof s)continue;const e=s;"string"==typeof e.page&&"string"==typeof e.text&&"string"==typeof e.url&&(e.url.startsWith(Ao)&&(t[i]=Object.assign(Object.assign({key:i,page:e.page,heading:"string"==typeof e.heading?e.heading:"",text:e.text},"string"==typeof e.yaml?{yaml:e.yaml}:{}),{url:e.url})))}return t}(await e.json())}).catch(()=>({}))),Co}class Lo extends m{constructor(){super(...arguments),this.key="",this._open=!1,this._loaded=!1}static get styles(){return _`
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
      ${this._open?this._renderPop():We}
    `}_renderPop(){var t;const i=this._entry,s=null!==(t=null==i?void 0:i.url)&&void 0!==t?t:function(e){var t;return Ao+(null!==(t=Po[e])&&void 0!==t?t:"Configuration-Reference.html")}(this.key);return e`
      <div class="pop" role="dialog" @keydown=${this._keydown}>
        ${i?e`
                <h5>${i.page}${i.heading?` · ${i.heading}`:""}</h5>
                <p>${i.text}</p>
                ${i.yaml?e`<pre>${i.yaml}</pre>`:We}
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
    `}async _toggle(){this._open=!this._open,this._open&&!this._loaded&&(this._entry=await async function(e,t){return(await Eo(t))[e]}(this.key),this._loaded=!0)}_keydown(e){"Escape"===e.key&&this._open&&(e.stopPropagation(),this._open=!1)}}c([u({attribute:!1})],Lo.prototype,"hass",void 0),c([u()],Lo.prototype,"key",void 0),c([p()],Lo.prototype,"_open",void 0),c([p()],Lo.prototype,"_entry",void 0),c([p()],Lo.prototype,"_loaded",void 0);const To="decluttering-help";customElements.get(To)||customElements.define(To,Lo);const Vo=["card","badge","row","element"];function No(e,t,i=[]){if(Array.isArray(e))e.forEach((e,s)=>No(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,a]of Object.entries(e))No(a,t?`${t}.${s}`:s,i);else null!=e&&i.push({path:t,value:String(e)});return i}const Ho=["grid_options","visibility","view_layout","layout_options"];function Mo(e){const t={};for(const[i,s]of Object.entries(null!=e?e:{}))Ho.includes(i)||(t[i]=s);return t}function Do(e){if(Array.isArray(e))return e.map(Do);if(e&&"object"==typeof e){const t={};for(const i of Object.keys(e).sort())t[i]=Do(e[i]);return t}return 0}function qo(e,t=[],i=[]){if(Array.isArray(e))e.forEach((e,s)=>qo(e,[...t,s],i));else if(e&&"object"==typeof e)for(const[s,a]of Object.entries(e))qo(a,[...t,s],i);else i.push({path:t,value:e});return i}function zo(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}function Ro(e){const t=new Map;e.forEach((e,i)=>{var s;if(!e||"object"!=typeof e||"string"!=typeof e.type)return;const a=Mo(e);if(JSON.stringify(a).includes("[["))return;const o=JSON.stringify([e.type,Do(a)]);t.set(o,[...null!==(s=t.get(o))&&void 0!==s?s:[],i])});const i=[];for(const[s,a]of t){if(a.length<2)continue;const t=a.map(t=>Mo(e[t])),o=qo(t[0]).map(e=>e.path).filter(e=>t.some(i=>JSON.stringify(zo(i,e))!==JSON.stringify(zo(t[0],e))));!o.length||o.length>8||i.push({indices:a,type:e[a[0]].type,differing:o,key:s})}return i.sort((e,t)=>t.indices.length-e.indices.length||e.indices[0]-t.indices[0])}const Uo=e=>e.replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value";function Io(e){const t=e[e.length-1];if("string"==typeof t)return Uo(t);const i=[...e].reverse().find(e=>"string"==typeof e);return Uo(`${null!=i?i:"item"}_${t+1}`)}function Jo(e){const t=e.map(Io),i=[];return e.forEach((e,s)=>{const a=(o=t[s],t.filter(e=>e===o).length>1?function(e){return Uo(e.map(e=>"number"==typeof e?String(e+1):e).join("_"))}(e):t[s]);var o;i.push(js(a,i))}),i}function Fo(e){var t;const i=e.map(Mo),s=null!==(t=i[0])&&void 0!==t?t:{},a=qo(s).map(e=>e.path).filter(e=>i.some(t=>JSON.stringify(zo(t,e))!==JSON.stringify(zo(s,e)))),o=Jo(a),r=JSON.parse(JSON.stringify(s));return a.forEach((e,t)=>{zo(r,e.slice(0,-1))[e[e.length-1]]=`[[${o[t]}]]`}),{template:{card:r},names:o,variables:i.map(e=>a.map((t,i)=>({[o[i]]:zo(e,t)}))),layout:e.map(e=>{const t={};for(const i of Ho)void 0!==(null==e?void 0:e[i])&&(t[i]=e[i]);return t})}}function Wo(e,t,i){return Object.assign({type:"custom:decluttering-card-plus",template:e,variables:t},i)}const Bo="_";function Zo(e){let t="string"==typeof e?e:JSON.stringify(e);if("string"!=typeof t||!t.includes("[["))return[];const i=new Set;for(let s=0;s<5;s+=1){let e=!1;if(t=t.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(t,s)=>{if(e=!0,s.startsWith(ze))return Bo;const a=s.endsWith("?")?s.slice(0,-1):s,[o,...r]=a.split("|"),n=o.endsWith("?")?o.slice(0,-1):o;for(const e of[n,n.split(".")[0]])e&&e!==Bo&&i.add(e);for(const e of r){const t=e.startsWith("or:")?e.slice(3):qe(e);t&&t!==Bo&&i.add(t)}return Bo}),!e)break}return[...i]}function Ko(e,t=[]){if(Array.isArray(e)){for(const i of e)Ko(i,t);return t}if(!e||"object"!=typeof e)return t;Te.includes(e.type)&&!0===e[mt]&&"string"==typeof e.template&&t.push(e.template);for(const i of Object.values(e))Ko(i,t);return t}function Yo(e,t,i=new Set){const s=new Set;if(!e)return{names:s,complete:!0};pt in e&&(e=Object.assign(Object.assign({},e),{default:e[pt]}));for(const o of P(e))s.add(o.name);for(const o of h(Se(e))){const e=z(o);void 0!==e&&s.add(e)}for(const o of Zo(e))s.add(o);let a=!0;for(const o of Ko(e)){if(i.has(o))continue;if(i.add(o),!Object.prototype.hasOwnProperty.call(t,o)){a=!1;continue}const e=Yo(t[o],t,i);for(const t of e.names)s.add(t);e.complete||(a=!1)}return{names:s,complete:a}}function Qo(e,t){const i=new Map,s=(e,t,s,a)=>{const o=JSON.stringify([e.index,t,a.name,s]),r=i.get(o);r?(r.count+=1,!r.closest&&a.closest&&(r.closest=a.closest)):i.set(o,Object.assign(Object.assign({view:e,template:t,name:a.name},a.closest?{closest:a.closest}:{}),{where:s,count:1}))},a=(e,i,r)=>{var n,l;if(Array.isArray(e))for(const t of e)a(t,i,r);else if(e&&"object"==typeof e){if(Te.includes(e.type)&&"string"==typeof e.template){const a=Object.prototype.hasOwnProperty.call(t,e.template)?t[e.template]:void 0;if(a){const d=new Set,c=(n,l)=>{for(const c of function(e,t,i,s={lets:[],defaults:[]},a){if(!e)return[];const{names:r,complete:n}=Yo(e,t);if(!n)return[];const l=new Set([...h(e.let),...s.lets].map(z).filter(e=>void 0!==e)),d=N(i),c=new Set(r);for(const o of Zo(a))c.add(o);for(const o of[...s.lets,...s.defaults]){const e=z(o);if(void 0!==e)for(const t of Zo(o[e]))c.add(t)}const u=e=>!l.has(e)&&(c.has(e)||c.has(e.split(".")[0]));let p=!0;const m=new Set;for(;p;){p=!1;for(const e of d){const t=z(e);if(!m.has(t)&&u(t)){m.add(t);for(const i of Zo(e[t]))c.has(i)||(c.add(i),p=!0)}}}const _=new Set(d.map(e=>z(e))),v=[...c].filter(e=>!_.has(e)&&!l.has(e)),g=[];for(const h of _){if(u(h))continue;const e=o(h,v);g.push(e?{name:h,closest:e}:{name:h})}return g}(a,t,l,r,[e.on_error,e.for_each_from]))d.has(c.name)||(d.add(c.name),s(i,e.template,n,c))};c("variables",e.variables);for(const t of null!==(n=R(e.for_each))&&void 0!==n?n:[])c("for_each",t);const u=null===(l=e.for_each_from)||void 0===l?void 0:l.overrides;if(u&&"object"==typeof u)for(const e of Object.values(u))c("overrides",e)}}for(const t of Object.values(e))a(t,i,r)}};return ct(e,(t,i,s)=>{var o,r,n;const l=e.views[i];a(t,{title:null!==(r=null!==(o=null==l?void 0:l.title)&&void 0!==o?o:null==l?void 0:l.path)&&void 0!==r?r:"",path:null!==(n=null==l?void 0:l.path)&&void 0!==n?n:"",index:i},ut(e,i,s))}),[...i.values()].map(({view:e,template:t,name:i,closest:s,where:a,count:o})=>s?{view:e,template:t,name:i,closest:s,where:a,count:o}:{view:e,template:t,name:i,where:a,count:o})}function Go(e,t,i){if(!e.includes("[["))return e;const s=e.replace(/\[\[([^[\]]+)\]\]/g,(e,s)=>s.startsWith(ze)?e:`[[${function(e,t,i){const s=e.endsWith("?"),a=(s?e.slice(0,-1):e).split("|"),o=a[0],r=o.endsWith("?"),n=r?o.slice(0,-1):o;(n===t||n.startsWith(`${t}.`))&&(a[0]=`${i}${n.slice(t.length)}${r?"?":""}`);for(let l=1;l<a.length;l+=1){const e=a[l];if(e===`or:${t}`)a[l]=`or:${i}`;else if(qe(e)===t){const s=e.startsWith("if:!")?"!":"";a[l]=`if:${s}${i}${e.slice(3+s.length+t.length)}`}}return`${a.join("|")}${s?"?":""}`}(s,t,i)}]]`);return s.replace(new RegExp(`\\[\\[${a=t,a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=\\.\\[\\[)`,"g"),`[[${i}`);var a}function Xo(e,t,i){if("string"==typeof e)return Go(e,t,i);if(Array.isArray(e))return e.map(e=>Xo(e,t,i));if(e&&"object"==typeof e){const s={};for(const[a,o]of Object.entries(e))s[Go(a,t,i)]=Xo(o,t,i);return s}return e}function er(e,t,i){const s=e=>!!e&&"object"==typeof e&&!Array.isArray(e),a=(e,t)=>s(e)&&Object.prototype.hasOwnProperty.call(e,t),o=e=>{if(!s(e))return e;const a={};for(const[s,o]of Object.entries(e))s!==i&&(a[s===t?i:s]=o);return a};return Array.isArray(e)?e.some(e=>a(e,t))?e.map(o).filter(e=>!s(e)||Object.keys(e).length>0):e:a(e,t)?o(e):e}function tr(e,t,i){const s=Xo(e,t,i);return Array.isArray(s.variables)?s.variables=s.variables.map(e=>e&&"object"==typeof e&&e.name===t?Object.assign(Object.assign({},e),{name:i}):e):s.variables&&"object"==typeof s.variables&&(s.variables=er(s.variables,t,i)),void 0!==s.default&&(s.default=er(s.default,t,i)),void 0!==s.defaults&&(s.defaults=er(s.defaults,t,i)),void 0!==s.let&&(s.let=er(s.let,t,i)),s}function ir(e){const t=null==e?void 0:e.extends;return(Array.isArray(t)?t:[t]).filter(e=>"string"==typeof e)}function sr(e,t,i){const s=ht(e),a=new Set([t]);for(const r of null!=i?i:[])Object.prototype.hasOwnProperty.call(s,r)||a.add(r);let o=!0;for(;o;){o=!1;for(const[e,t]of Object.entries(s))!a.has(e)&&ir(t).some(e=>a.has(e))&&(a.add(e),o=!0)}return a}function ar(e){if(!e)return[];const t=new Set(Is(e));for(const i of Zo(e))i.includes(".")||"_"===i||t.add(i);return[...t].sort()}function or(e,t,i,s,a){const o=sr(e,t,a);let r=0,n=0;const l=(e,t)=>JSON.stringify(e)!==JSON.stringify(t),d=e=>{if(Array.isArray(e))return e.map(d);if(!e||"object"!=typeof e)return e;let t={};for(const[i,s]of Object.entries(e))t[i]=d(s);if(Te.includes(e.type)&&o.has(e.template)){const e=function(e,t,i){var s;const a=Object.assign({},e);void 0!==a.variables&&(a.variables=er(a.variables,t,i)),Array.isArray(a.for_each)?a.for_each=a.for_each.map(e=>er(e,t,i)):void 0!==a.for_each&&(a.for_each=er(a.for_each,t,i));const o=null===(s=a.for_each_from)||void 0===s?void 0:s.overrides;if(o&&"object"==typeof o&&!Array.isArray(o)){const e={};for(const[s,a]of Object.entries(o))e[s]=er(a,t,i);a.for_each_from=Object.assign(Object.assign({},a.for_each_from),{overrides:e})}return"string"==typeof a.name&&(a.name=Go(a.name,t,i)),a}(t,i,s);l(e,t)&&(r+=1),t=e}if(g(e.type)&&o.has(e.template)){const e=tr(t,i,s);l(e,t)&&(n+=1),t=e}return t},h=Object.assign({},e);Array.isArray(null==e?void 0:e.views)&&(h.views=d(e.views));const c=null==e?void 0:e.decluttering_templates;if(c&&"object"==typeof c){const e={};for(const[t,a]of Object.entries(c)){let r=d(a);if(o.has(t)){const e=tr(r,i,s);l(e,r)&&(n+=1),r=e}e[t]=r}h.decluttering_templates=e}return{config:h,cards:r,templates:n}}function rr(e,t,i){if(Object.prototype.hasOwnProperty.call(ht(e),t))return!1;if(i===_t)return!0;const s=vt(e);return s.includes(i)||s.includes("*")}class nr extends m{constructor(){super(...arguments),this._renameTo="",this._renaming=!1,this._duplicateTo="",this._busy=!1,this._modernisePending=!1,this._similarNames={},this._searchQuery="",this._searching=!1,this._varTo=""}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=Q())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:O()}static get styles(){return Xs}_fireConfigChanged(e){v(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return Gs(this,e,t,i)}render(){return this.hass&&this._config?this._renderUsages():e``}_renderUsages(){var t,i;const s=null===(t=this._config)||void 0===t?void 0:t.template;if(!s)return e``;const o=this._savedLovelace;if(!o)return e`<div class="usages">
        <ha-alert alert-type="warning">${a("template_editor.usages_unreadable",void 0,this.hass)}</ha-alert>
      </div>`;(null===(i=this._usages)||void 0===i?void 0:i.name)===s&&this._usages.ll===o||(this._usages={name:s,ll:o,usages:gt(o,s)});const{views:r,templates:n}=this._usages.usages,l=r.reduce((e,t)=>e+t.count,0),d=document.location.pathname.split("/").slice(0,2).join("/");return e`
      <div class="usages">
        ${0!==l||n.length?e`
                <p class="hint">
                  ${a(1===l?"template_editor.usages_one":"template_editor.usages_many",{total:l,name:s},this.hass)}
                </p>
                <ul>
                  ${r.map(t=>e`
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
        ${n.length?e`<ha-alert alert-type="info">
                ${a(1===n.length?"template_editor.used_by_template":"template_editor.used_by_templates",{names:n.join(", ")},this.hass)}
              </ha-alert>`:e``}
        ${this._renderElsewhere(s)} ${this._renderImpact(o,s)}
        <decluttering-card-plus-health .hass=${this.hass} .lovelace=${o}
          >${this._renderUndo()}</decluttering-card-plus-health
        >
        ${this._renderSimilar(o)} ${this._renderSearch()} ${this._renderRename(s,l)}
        ${this._renderRenameVariable(s)} ${this._renderDuplicate(s)} ${this._renderModernise()}
        ${this._toolError?e`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:e``}
      </div>
    `}_renderUndo(){var t,i;const s=ft();if(!s)return e``;const o=yt(s.operation,this.hass),r=new Date(s.at).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language);return e`
      <div class="undo">
        <p class="hint">${a("undo.held",{operation:o,time:r},this.hass)}</p>
        ${this._undoChanged?e`<ha-alert alert-type="warning">
                ${a("undo.changed_here",{operation:o,dashboards:this._undoChanged.join(", ")},this.hass)}
              </ha-alert>`:e``}
        <ha-button .disabled=${this._busy} @click=${this._undo}>
          ${a(this._undoChanged?"undo.anyway_button":"undo.button",{operation:o},this.hass)}
        </ha-button>
      </div>
    `}async _undo(){const e=ft();if(e){this._busy=!0;try{const t=await bt(this,this.hass,e,!!this._undoChanged,!1);this._undoChanged="changed"===(null==t?void 0:t.result)?t.dashboards:void 0}finally{this._busy=!1}}}_renderSimilar(t){var i;if((null===(i=this._similar)||void 0===i?void 0:i.ll)!==t){const e=$t(t);this._similar={ll:t,cards:e,groups:Ro(e.map(e=>e.config))}}const{cards:s,groups:o}=this._similar;if(!o.length)return e``;const r=Object.keys(A(t));return e`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${a(1===o.length?"tools.similar_header_one":"tools.similar_header",{count:o.length},this.hass)}
        </span>
        <p class="hint">${a("tools.similar_hint",{max:8},this.hass)}</p>
        ${o.slice(0,10).map(e=>this._renderSimilarGroup(e,s,r))}
      </ha-expansion-panel>
    `}_renderSimilarGroup(t,i,s){var o;const r=t.indices.map(e=>i[e]),n=Fo(r.map(e=>e.config)),l=(null!==(o=this._similarNames[t.key])&&void 0!==o?o:function(e,t,i=[]){let s=Uo(e.replace(/^custom:/,"").replace(/-/g,"_")).toLowerCase();/(^|_)card$/.test(s)||(s=`${s}_card`);const a=new Set(i.map(e=>"string"==typeof(null==e?void 0:e.entity)&&e.entity.includes(".")?e.entity.split(".")[0]:"")),[o]=[...a];return 1===a.size&&o&&(s=`${Uo(o).toLowerCase()}_${s}`),js(s,t)}(t.type,s,r.map(e=>e.config))).trim(),d=this._similarPending===`${t.key}\0${l}`,h=s.includes(l);return e`
      <div class="similar">
        <h3>${a("tools.similar_group",{count:r.length,type:t.type},this.hass)}</h3>
        <p class="hint">${a("tools.similar_differ",{names:n.names.join(", ")},this.hass)}</p>
        <ul>
          ${r.slice(0,8).map(t=>e`<li>${t.label}</li>`)}
        </ul>
        ${r.length>8?e`<p class="hint">
                ${a("editor.matches_more",{count:r.length-8},this.hass)}
              </p>`:e``}
        ${h?e`<ha-alert alert-type="error">${a("tools.name_taken",{name:l},this.hass)}</ha-alert>`:e``}
        ${d?e`
                <ha-alert alert-type="warning">
                  ${a("tools.similar_confirm",{name:l,count:r.length},this.hass)}
                </ha-alert>
                <p class="hint">${a("tools.similar_template",{name:l},this.hass)}</p>
                ${ca(`${t.key}\0${l}`,e`<ha-yaml-editor
                    .hass=${this.hass}
                    .defaultValue=${{[l]:n.template}}
                    read-only
                  ></ha-yaml-editor>`)}
                <p class="hint">${a("tools.similar_first_card",void 0,this.hass)}</p>
                ${oo(r[0].config,Wo(l,n.variables[0],n.layout[0]),this.hass)}
              `:e``}
        ${Qs({label:a("tools.similar_name",void 0,this.hass),value:l,disabled:this._busy,onInput:e=>{this._similarNames=Object.assign(Object.assign({},this._similarNames),{[t.key]:e}),this._similarPending=void 0}})}
        <ha-button
          .disabled=${this._busy||!l||h}
          @click=${()=>{this._makeTemplate(t,r,l)}}
        >
          ${a(d?"tools.similar_make_anyway":"tools.similar_make",void 0,this.hass)}
        </ha-button>
      </div>
    `}async _makeTemplate(e,t,i){const s=`${e.key}\0${i}`;if(this._similarPending!==s)return void(this._similarPending=s);const a=await this._saveDashboard(e=>function(e,t,i){const{template:s,variables:a,layout:o}=Fo(t);let r=Ke(e,i,s);return t.forEach((e,t)=>{r=ie(r,e,Wo(i,a[t],o[t]))}),r}(e,t.map(e=>e.config),i),"make_template");if(a){this._similarPending=void 0;const t=Object.assign({},this._similarNames);delete t[e.key],this._similarNames=t}}_renderElsewhere(t){var i;if((null===(i=this._remoteUsages)||void 0===i?void 0:i.name)!==t){this._remoteUsages={name:t,list:[]};const e=document.location.pathname.split("/").filter(Boolean)[0];wt(this.hass,t,e).then(e=>{var i;(null===(i=this._remoteUsages)||void 0===i?void 0:i.name)===t&&(this._remoteUsages={name:t,list:e})})}const s=this._remoteUsages.list;if(!s.length)return e``;const o=s.map(e=>`${e.urlPath} (${e.total})`).join(", ");return e`<ha-alert alert-type="info">
      ${a("template_editor.usages_elsewhere",{list:o},this.hass)}
    </ha-alert>`}_renderImpact(t,i){const s=xt(t,i);if(!s||!this._config)return e``;const o=e=>{if(e)return d(s.variables,e,F(e),i,this.hass,!0)};let r,n;try{r=o(A(t)[i]),n=o(A(t,void 0,this._config)[i])}catch(l){return e``}return e`
      <ha-expansion-panel outlined>
        <span slot="header">${a("template_editor.impact_header",void 0,this.hass)}</span>
        <p class="hint">${a("template_editor.impact_diff_hint",void 0,this.hass)}</p>
        ${ro(r,n,this.hass)}
      </ha-expansion-panel>
    `}_renderRename(t,i){const s=this._renameTo.trim(),o=!!s&&this._renamePending===s,r=i?1===i?a("tools.rewrites_one",void 0,this.hass):a("tools.rewrites_many",{count:i},this.hass):"";return e`
      <div class="rename">
        <h3>${a("tools.rename_header",void 0,this.hass)}</h3>
        <p class="hint">${a("tools.rename_hint",void 0,this.hass)}</p>
        ${this._renameError?e`<ha-alert alert-type="error">${this._renameError}</ha-alert>`:e``}
        ${o?e`<ha-alert alert-type="warning">
                ${a("tools.rename_confirm",{from:t,to:s,rewrites:r},this.hass)}
              </ha-alert>`:e``}
        ${Qs({label:a("tools.new_name",void 0,this.hass),value:this._renameTo,disabled:this._renaming,onInput:e=>this._renameChanged(e)})}
        <ha-button .disabled=${this._renaming||!s||s===t} @click=${this._rename}>
          ${o?a("tools.rename_anyway",void 0,this.hass):1===i?a("tools.rename_update_one",void 0,this.hass):i?a("tools.rename_update_many",{count:i},this.hass):a("tools.rename",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderModernise(){const t=this._savedLovelace,i=t?kt(t):0;return i?e`
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
    `:e``}async _modernise(){if(!this._modernisePending)return void(this._modernisePending=!0);await this._saveDashboard(e=>jt(e),"modernise")&&(this._modernisePending=!1)}_renameChanged(e){this._renameTo=e,this._renameError=void 0,this._renamePending=void 0}async _rename(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._renameTo.trim();if(!i||!s||s===i)return;const o=Q();if(o)if(void 0===A(o.config)[s])if(this._renamePending===s){this._renaming=!0,this._renameError=void 0;try{await X(this,this.hass,"rename_template",[{urlPath:te(),build:e=>Ot(e,i,s)}],this._config),this._undoChanged=void 0,this._fireConfigChanged(Object.assign(Object.assign({},this._config),{template:s})),this._renameTo="",this._renamePending=void 0}catch(r){this._renameError=a("tools.save_failed",{message:null!==(t=null==r?void 0:r.message)&&void 0!==t?t:r},this.hass)}finally{this._renaming=!1}}else this._renamePending=s;else this._renameError=a("tools.name_taken",{name:s},this.hass);else this._renameError=a("tools.cannot_rename_here",void 0,this.hass)}_renderSearch(){const t=this._searchQuery.trim(),i=this._searchResult,s=e=>"variables"===e.where?"":a(`tools.search_in_${e.where}`,void 0,this.hass),o=e=>e.view.title||e.view.path||a("template_editor.untitled_view",void 0,this.hass);return e`
      <div class="rename">
        <h3>${a("tools.search_header",void 0,this.hass)}</h3>
        <p class="hint">${a("tools.search_hint",void 0,this.hass)}</p>
        ${Qs({label:a("tools.search_label",void 0,this.hass),value:this._searchQuery,onInput:e=>{this._searchQuery=e},onKeydown:e=>{"Enter"===e.key&&this._search()}})}
        <ha-button .disabled=${this._searching||!t} @click=${()=>{this._search()}}>
          ${a(this._searching?"tools.searching":"tools.search",void 0,this.hass)}
        </ha-button>
        ${!i||i.cards.length||i.templates.length?e``:e`<p class="hint">${a("tools.search_none",{query:i.query},this.hass)}</p>`}
        ${(null==i?void 0:i.cards.length)?e`
                <p class="hint">${a("tools.search_cards",{count:i.cards.length},this.hass)}</p>
                <ul>
                  ${i.cards.slice(0,Ws).map(t=>e`
                      <li>
                        <a
                          href=${`/${t.urlPath}/${t.view.path||t.view.index}`}
                          target="_blank"
                          rel="noreferrer"
                          >${t.urlPath} › ${o(t)}</a
                        >
                        — ${t.template}: <code>${t.variable}</code> = ${t.value}${s(t)}
                      </li>
                    `)}
                </ul>
                ${i.cards.length>Ws?e`<p class="hint">
                        ${a("editor.matches_more",{count:i.cards.length-Ws},this.hass)}
                      </p>`:e``}
              `:e``}
        ${(null==i?void 0:i.templates.length)?e`
                <p class="hint">${a("tools.search_templates",{count:i.templates.length},this.hass)}</p>
                <ul>
                  ${i.templates.slice(0,Ws).map(t=>e`<li>
                          ${t.urlPath} › ${t.template}: <code>${t.path}</code> = ${t.value}
                        </li>`)}
                </ul>
                ${i.templates.length>Ws?e`<p class="hint">
                        ${a("editor.matches_more",{count:i.templates.length-Ws},this.hass)}
                      </p>`:e``}
              `:e``}
      </div>
    `}async _search(){const e=this._searchQuery.trim();if(e&&!this._searching){this._searching=!0;try{const i=te(),s=Xe(this.hass),a=[{urlPath:i,config:this._savedLovelace}];for(const e of this.hass?await At(this.hass):[])if(St(e)!==i)try{a.push({urlPath:e,config:await et(s,e)})}catch(t){}this._searchResult=Object.assign({query:e},function(e,t){var i;const s=t.trim().toLowerCase(),a=[],o=[];if(!s)return{cards:a,templates:o};const r=e=>e.toLowerCase().includes(s);for(const{urlPath:n,config:l}of e){const e=(e,t)=>{var i,s;const o=(i,s,o)=>{a.push({urlPath:n,view:t,template:e.template,where:i,variable:s,value:o})},l=(e,t,i="")=>{for(const s of N(t)){const[t,a]=Object.entries(s)[0];for(const s of No(a,`${i}${t}`))r(s.value)&&o(e,s.path,s.value)}};l("variables",e.variables);for(const a of null!==(i=R(e.for_each))&&void 0!==i?i:[])l("for_each",a);const d=null===(s=e.for_each_from)||void 0===s?void 0:s.overrides;if(d&&"object"==typeof d)for(const[a,n]of Object.entries(d))r(a)&&o("overrides",a,a),l("overrides",n,`${a} › `);for(const a of Vo)if(void 0!==e[a])for(const t of No(e[a],a))r(t.value)&&o("override_block",t.path,t.value)},t=(i,s)=>{if(Array.isArray(i))for(const e of i)t(e,s);else if(i&&"object"==typeof i&&!g(i.type)){Te.includes(i.type)&&"string"==typeof i.template&&e(i,s);for(const e of Object.values(i))t(e,s)}};(null!==(i=null==l?void 0:l.views)&&void 0!==i?i:[]).forEach((e,i)=>{var s,a,o;return t(e,{title:null!==(a=null!==(s=null==e?void 0:e.title)&&void 0!==s?s:null==e?void 0:e.path)&&void 0!==a?a:"",path:null!==(o=null==e?void 0:e.path)&&void 0!==o?o:"",index:i})});for(const[i,s]of Object.entries(ht(l))){const e=Object.assign({},null!=s?s:{});delete e.type,delete e.template;for(const t of No(e,""))r(t.value)&&o.push(Object.assign({urlPath:n,template:i},t))}}return{cards:a,templates:o}}(a,e))}finally{this._searching=!1}}}_renderRenameVariable(t){const i=ar(this._config);if(!i.length||!this._config)return e``;const s=this._varFrom&&i.includes(this._varFrom)?this._varFrom:void 0,o=this._varTo.trim(),r=this._varPending,n=!!r&&r.from===s&&r.to===o,l=n&&r.elsewhere.length?a("tools.rename_variable_elsewhere",{list:r.elsewhere.map(e=>`${e.urlPath} (${e.cards})`).join(", ")},this.hass):"";return e`
      <div class="rename">
        <h3>${a("tools.rename_variable_header",void 0,this.hass)}</h3>
        <p class="hint">${a("tools.rename_variable_hint",void 0,this.hass)}</p>
        ${this._varError?e`<ha-alert alert-type="error">${this._varError}</ha-alert>`:e``}
        ${n&&s?e`
                <ha-alert alert-type="warning">
                  ${a("tools.rename_variable_confirm",{from:s,to:o,templates:r.templates,cards:r.cards,elsewhere:l},this.hass)}
                </ha-alert>
                ${oo(this._config,tr(this._config,s,o),this.hass)}
              `:e``}
        <ha-form
          .hass=${this.hass}
          .data=${{variable:null!=s?s:""}}
          .schema=${[{name:"variable",selector:{select:{mode:"dropdown",options:i.map(e=>({value:e,label:e}))}}}]}
          .computeLabel=${()=>a("tools.rename_variable_pick",void 0,this.hass)}
          @value-changed=${this._varPicked}
        ></ha-form>
        ${Qs({label:a("tools.new_name",void 0,this.hass),value:this._varTo,disabled:this._busy,onInput:e=>this._varToChanged(e)})}
        <ha-button
          .disabled=${this._busy||!s||!o||o===s}
          @click=${()=>{this._renameVariable(t)}}
        >
          ${a(n?"tools.rename_anyway":"tools.rename_variable",void 0,this.hass)}
        </ha-button>
      </div>
    `}_varPicked(e){e.stopPropagation(),this._varFrom=e.detail.value.variable||void 0,this._varError=void 0,this._varPending=void 0}_varToChanged(e){this._varTo=e,this._varError=void 0,this._varPending=void 0}async _renameVariable(e){var t;const i=this._varFrom,s=this._varTo.trim();if(!i||!s||s===i||!this._config)return;if(!function(e){return/^[A-Za-z0-9_-]+$/.test(e)}(s))return void(this._varError=a("tools.rename_variable_invalid",{name:s},this.hass));const o=Q();if(!o)return void(this._varError=a("tools.cannot_save_here",void 0,this.hass));if(function(e,t,i,s){const a=ht(e);for(const o of sr(e,t))if(ar(o===t&&s?s:a[o]).includes(i))return!0;return!1}(o.config,e,s,this._config))return void(this._varError=a("tools.rename_variable_taken",{name:s},this.hass));const r=te(),n=this._varPending;if(n&&n.from===i&&n.to===s){this._busy=!0,this._varError=void 0;try{let t;await X(this,this.hass,"rename_variable",[{urlPath:r,build:a=>(t=sr(a,e),or(a,e,i,s).config)},...n.elsewhere.map(a=>({urlPath:a.urlPath,build:a=>rr(a,e,r)?or(a,e,i,s,t).config:a}))],this._config),this._undoChanged=void 0,this._fireConfigChanged(tr(this._config,i,s)),this._varFrom=s,this._varTo="",this._varPending=void 0}catch(l){this._varError=a("tools.save_failed",{message:null!==(t=null==l?void 0:l.message)&&void 0!==t?t:l},this.hass)}finally{this._busy=!1}}else{this._busy=!0;try{const t=Xe(this.hass),a=await et(t,r).catch(()=>o.config),n=or(a,e,i,s),l=sr(a,e),h=[];for(const o of this.hass?await At(this.hass):[]){if(St(o)===r)continue;let a;try{a=await et(t,o)}catch(d){continue}if(!rr(a,e,r))continue;const n=or(a,e,i,s,l);(n.cards||n.templates)&&h.push({urlPath:o,cards:n.cards})}this._varPending={from:i,to:s,cards:n.cards,templates:n.templates,elsewhere:h}}finally{this._busy=!1}}}_renderDuplicate(t){const i=this._duplicateTo.trim(),s=!!i&&this._duplicatePending===i;return e`
      <div class="rename">
        <h3>${a("tools.duplicate_header",void 0,this.hass)}</h3>
        <p class="hint">${a("tools.duplicate_hint",void 0,this.hass)}</p>
        ${s?e`<ha-alert alert-type="warning">
                ${a("tools.duplicate_confirm",{to:i,name:t},this.hass)}
              </ha-alert>`:e``}
        ${Qs({label:a("tools.copy_name",void 0,this.hass),value:this._duplicateTo,disabled:this._busy,onInput:e=>this._duplicateChanged(e)})}
        <ha-button .disabled=${this._busy||!i||i===t} @click=${this._duplicate}>
          ${a(s?"tools.duplicate_anyway":"tools.duplicate",void 0,this.hass)}
        </ha-button>
      </div>
    `}_duplicateChanged(e){this._duplicateTo=e,this._toolError=void 0,this._duplicatePending=void 0}async _duplicate(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._duplicateTo.trim();if(!i||!s||s===i)return;const o=Q();if(o&&void 0!==A(o.config)[s])return void(this._toolError=a("tools.name_taken",{name:s},this.hass));if(this._duplicatePending!==s)return void(this._duplicatePending=s);const r=Object.assign(Object.assign({},this._config),{template:s}),n=ae(null!==(t=null==o?void 0:o.config)&&void 0!==t?t:this.lovelace,i),l=await this._saveDashboard(e=>{var t,i;return Ye(e,null!==(i=null===(t=null==n?void 0:n.view)||void 0===t?void 0:t.index)&&void 0!==i?i:0,r)},"duplicate");l&&(this._duplicateTo="",this._duplicatePending=void 0)}}c([u({attribute:!1})],nr.prototype,"hass",void 0),c([u({attribute:!1})],nr.prototype,"lovelace",void 0),c([u({attribute:!1})],nr.prototype,"config",void 0),c([p()],nr.prototype,"_renameTo",void 0),c([p()],nr.prototype,"_renameError",void 0),c([p()],nr.prototype,"_renaming",void 0),c([p()],nr.prototype,"_renamePending",void 0),c([p()],nr.prototype,"_duplicateTo",void 0),c([p()],nr.prototype,"_duplicatePending",void 0),c([p()],nr.prototype,"_toolError",void 0),c([p()],nr.prototype,"_busy",void 0),c([p()],nr.prototype,"_modernisePending",void 0),c([p()],nr.prototype,"_remoteUsages",void 0),c([p()],nr.prototype,"_undoChanged",void 0),c([p()],nr.prototype,"_similarNames",void 0),c([p()],nr.prototype,"_similarPending",void 0),c([p()],nr.prototype,"_searchQuery",void 0),c([p()],nr.prototype,"_searching",void 0),c([p()],nr.prototype,"_searchResult",void 0),c([p()],nr.prototype,"_varFrom",void 0),c([p()],nr.prototype,"_varTo",void 0),c([p()],nr.prototype,"_varError",void 0),c([p()],nr.prototype,"_varPending",void 0),customElements.get("decluttering-template-usages-tab")||customElements.define("decluttering-template-usages-tab",nr);class lr extends m{constructor(){super(...arguments),this._selectedTab="settings",this._suggestedNothing=!1,this._busy=!1,this._declutterPending=!1,this._promoteName="",this._loadedElements=!1}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=Q())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:O()}static describeSchema(){var e;return null!==(e=lr._describeSchema)&&void 0!==e||(lr._describeSchema=[{name:"template",label:a("template_editor.template_label"),selector:{text:{}}},{name:"thingType",label:a("template_editor.type_label"),selector:{select:{mode:"dropdown",options:[{value:"card",label:a("template_editor.type_card")},{value:"badge",label:a("template_editor.type_badge")},{value:"row",label:a("template_editor.type_row")},{value:"element",label:a("template_editor.type_element")}]}}},{name:"description",label:a("template_editor.description_label"),helper:a("template_editor.description_helper"),selector:{text:{multiline:!0}}},{name:"category",label:a("template_editor.category_label"),helper:a("template_editor.category_helper"),selector:{text:{}}}]),lr._describeSchema}static defaultsSchema(){var e;return null!==(e=lr._defaultsSchema)&&void 0!==e||(lr._defaultsSchema=[{name:"default",label:a("template_editor.defaults_label"),helper:a("template_editor.defaults_helper"),selector:{object:{}}}]),lr._defaultsSchema}setConfig(e){this._config=e,this._suggestion=void 0,this._suggestedNothing=!1}render(){var t;if(!this.hass||!this._config)return e``;const i={};C(this._config.default)&&C(this._config.defaults)||(i.default=a("error.variables_shape",void 0,this.hass)),Pt(this._config.variables)||(i.variables=a("template_editor.declarations_shape",void 0,this.hass));const s={template:this._config.template,thingType:null!==(t=L(this._config))&&void 0!==t?t:"card",description:this._config.description,category:this._config.category},o={default:Se(this._config)},r=P(this._config).length;return e`
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
                  ${lr.describeSchema().map(t=>e`
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
                  <small>${a("declarations.count",{count:r},this.hass)}</small></span
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
                    .shared=${Ct(this._savedLovelace)}
                    @value-changed=${this._declarationsChanged}
                  ></decluttering-declarations-editor>
                  <div class="field-row">
                    <ha-form
                      .hass=${this.hass}
                      .data=${o}
                      .schema=${lr.defaultsSchema()}
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
    `}_renderDiagnostics(){if(!this._config||!Pt(this._config.variables))return e``;const{unused:t,duplicated:i,contradictory:s}=Et(this._config);return e`
      ${t.length?e`<ha-alert alert-type="info">
              ${a(1===t.length?"template_editor.declared_unused_one":"template_editor.declared_unused_many",{names:t.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${i.length?e`<ha-alert alert-type="warning">
              ${a(1===i.length?"template_editor.duplicated_one":"template_editor.duplicated_many",{names:i.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${s.length?e`<ha-alert alert-type="warning">
              ${a(1===s.length?"template_editor.contradictory_one":"template_editor.contradictory_many",{names:s.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_renderLint(){if(!this._config)return e``;const t=this._savedLovelace,i=A(t,void 0,this._config)[this._config.template],s=Js(this._config,[...Is(i),...Object.keys(Z(t))]);return s.length?e`${s.map(t=>e`<ha-alert alert-type=${t.level}>
          ${a(t.key,t.params,this.hass)}${t.params.closest?a("error.did_you_mean",{closest:t.params.closest},this.hass):""}${t.path?a("lint.where",{path:t.path},this.hass):""}
        </ha-alert>`)}`:e``}_renderSortable(t,i,s){const o=(e,i)=>{e.preventDefault();const a=this._dragging;this._dragging=void 0,(null==a?void 0:a.list)===t&&s(a.from,i)};return e`
      <ul>
        ${i.map((r,n)=>e`
            <li
              draggable="true"
              @dragstart=${e=>{var i;this._dragging={list:t,from:n},null===(i=e.dataTransfer)||void 0===i||i.setData("text/plain",r.name),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}}
              @dragover=${e=>{var i;(null===(i=this._dragging)||void 0===i?void 0:i.list)===t&&e.preventDefault()}}
              @drop=${e=>o(e,n)}
              @dragend=${()=>{this._dragging=void 0}}
            >
              <ha-svg-icon class="handle" .path=${Ys}></ha-svg-icon>
              <span>${r.label}</span>
              <span class="spacer"></span>
              <ha-icon-button
                .path=${"M7,15L12,10L17,15H7Z"}
                .disabled=${0===n}
                .label=${a("template_editor.move_up",{name:r.name},this.hass)}
                @click=${()=>s(n,n-1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,10L12,15L17,10H7Z"}
                .disabled=${n===i.length-1}
                .label=${a("template_editor.move_down",{name:r.name},this.hass)}
                @click=${()=>s(n,n+1)}
              ></ha-icon-button>
            </li>
          `)}
      </ul>
    `}_renderGroupOrder(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.group,s=Lt(i);if(void 0===i||s.length<2)return e``;const o=s.map((e,t)=>{var i,s,a,o;const r=null!==(a=null!==(s=null!==(i=null==e?void 0:e.name)&&void 0!==i?i:null==e?void 0:e.heading)&&void 0!==s?s:null==e?void 0:e.title)&&void 0!==a?a:null==e?void 0:e.entity,n=String(null!==(o=null==e?void 0:e.type)&&void 0!==o?o:"?").replace(/^custom:/,"");return{label:"string"==typeof r?`${n} (${r})`:n,name:`${t+1} ${n}`}});return e`
      <div class="order">
        <p class="hint">${a("template_editor.group_order_hint",void 0,this.hass)}</p>
        ${this._renderSortable("group",o,(e,t)=>{const a=ve(s,e,t);a!==s&&this._config&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{group:Tt(i,a)}))})}
      </div>
    `}_renderPromote(){const t=Es(this._config);if(!this._config||!t)return e``;const i=function(e){const t=[],i=(e,s)=>{if(Array.isArray(e))e.forEach((e,t)=>i(e,[...s,t]));else if(e&&"object"==typeof e)for(const[t,a]of Object.entries(e))"type"===t&&"string"==typeof a||i(a,[...s,t]);else"string"==typeof e&&l.test(e)||s.length&&null!=e&&("string"!=typeof e&&"number"!=typeof e&&"boolean"!=typeof e||t.push({path:s,value:e,label:Ls(s)}))};return i(e,[]),t}(this._config[t]);if(!i.length)return e``;const s=this._promotePath?JSON.stringify(this._promotePath):"",o=e=>{const t=String(e);return t.length>40?`${t.slice(0,39)}…`:t};return e`
      <ha-expansion-panel outlined class="promote">
        <span slot="header">${a("template_editor.promote_header",void 0,this.hass)}</span>
        <p class="hint">${a("template_editor.promote_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${{setting:s}}
          .schema=${[{name:"setting",selector:{select:{mode:"dropdown",options:i.map(e=>({value:JSON.stringify(e.path),label:`${e.label} = ${o(e.value)}`}))}}}]}
          .computeLabel=${()=>a("template_editor.promote_pick",void 0,this.hass)}
          @value-changed=${this._promotePicked}
        ></ha-form>
        ${this._promotePath?e`
                ${Qs({label:a("template_editor.promote_name",void 0,this.hass),value:this._promoteName,onInput:e=>{this._promoteName=e,this._promoteError=void 0}})}
                ${this._promoteError?e`<ha-alert alert-type="error">${this._promoteError}</ha-alert>`:e``}
                <ha-button .disabled=${!this._promoteName.trim()} @click=${this._promote}>
                  ${a("template_editor.promote_button",void 0,this.hass)}
                </ha-button>
              `:e``}
      </ha-expansion-panel>
    `}_promotePicked(e){e.stopPropagation();const t=e.detail.value.setting;t&&(this._promotePath=JSON.parse(t),this._promoteName=function(e,t){const i=[...e].reverse().find(e=>"string"==typeof e),s=e[e.length-1];return js(("number"==typeof s?`${null!=i?i:"item"}_${s+1}`:null!=i?i:"value").replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value",t)}(this._promotePath,Ts(this._config)),this._promoteError=void 0)}_promote(){if(!this._config||!this._promotePath)return;const e=this._promoteName.trim(),t=function(e,t,i){if(!Ps.test(i))return{ok:!1,error:"name_invalid"};if(Ts(e).includes(i))return{ok:!1,error:"name_taken"};const s=Es(e),a=s?function(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}(e[s],t):void 0;if(!s||null==a||"object"==typeof a)return{ok:!1,error:"gone"};const o={name:i,type:Vs(a),default:a};return{ok:!0,template:Object.assign(Object.assign({},e),{[s]:Ns(e[s],t,`[[${i}]]`),variables:He(e.variables,[o])})}}(this._config,this._promotePath,e);t.ok?(this._promotePath=void 0,this._promoteName="",this._fireConfigChanged(t.template)):this._promoteError=a(`template_editor.promote_${t.error}`,{name:e},this.hass)}_renderInUse(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._savedLovelace;if(!i||!s)return e``;const{views:o,templates:r}=gt(s,i),n=o.reduce((e,t)=>e+t.count,0)+r.length;return n?e`<ha-alert alert-type="info">
      ${a(1===n?"template_editor.in_use_one":"template_editor.in_use_many",{total:n},this.hass)}
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
    `:e``}_suggest(){var e;if(!(null===(e=this._config)||void 0===e?void 0:e.card))return;if(this._suggestion){const e=Object.assign(Object.assign({},this._config),{card:this._suggestion.card});return e.variables=He(this._config.variables,this._suggestion.variables),this._suggestion=void 0,void this._fireConfigChanged(e)}this._suggestedNothing=!1;const t=P(this._config).map(e=>e.name),i=function(e,t){const i=new Set(t),s=[],a=new Map,o=(e,t)=>{const o=`${e.base} ${t}`,r=a.get(o);if(r)return r;let n=1,l=e.base;for(;i.has(l);)n+=1,l=`${e.base}_${n}`;return i.add(l),a.set(o,l),s.push({name:l,label:Gi(e,n),selector:e.selector,default:t}),l},r=e=>{if(Array.isArray(e))return e.map(r);if(!e||"object"!=typeof e)return e;const t={};for(const[i,s]of Object.entries(e)){const e=Object.prototype.hasOwnProperty.call(Qi,i)?Qi[i]:void 0;e&&"string"==typeof s&&!l.test(s)&&e.matches(s)?t[i]=`[[${o(e,s)}]]`:t[i]=r(s)}return t};return{card:r(e),variables:s}}(this._config.card,t);i.variables.length?this._suggestion=i:this._suggestedNothing=!0}_renderDeclutter(){var t,i;const s=this._savedLovelace,o=$t(s),r="card"===L(null!==(t=this._config)&&void 0!==t?t:{})?Vt(s):[];if(!o.length&&!r.length||!this._config)return e``;const n=this._config.template,l=!!n&&n in A(s),d=null!==(i=this._declutterOriginal)&&void 0!==i?i:this._declutterSection;return e`
      <ha-expansion-panel outlined>
        <span slot="header">${a("template_editor.declutter_header",void 0,this.hass)}</span>
        <p class="hint">${a("template_editor.declutter_hint",void 0,this.hass)}</p>
        ${o.length?e`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:o.map((e,t)=>({value:String(t),label:e.label}))}}}]}
                .computeLabel=${()=>a("template_editor.declutter_pick",void 0,this.hass)}
                @value-changed=${e=>this._declutterPicked(e,o)}
              ></ha-form>`:e``}
        ${r.length?e`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:r.map((e,t)=>({value:String(t),label:a(1===e.cards.length?"template_editor.declutter_section_one":"template_editor.declutter_section_many",{where:e.label,count:e.cards.length},this.hass)}))}}}]}
                .computeLabel=${()=>a("template_editor.declutter_pick_section",void 0,this.hass)}
                @value-changed=${e=>this._declutterSectionPicked(e,r)}
              ></ha-form>`:e``}
        ${d?e`
                <ha-button .disabled=${this._busy||!l} @click=${this._declutterReplace}>
                  ${a(this._declutterPending?"template_editor.declutter_replace_confirm":this._declutterSection?"template_editor.declutter_replace_section":"template_editor.declutter_replace",void 0,this.hass)}
                </ha-button>
                ${l?e``:e`<p class="hint">${a("template_editor.declutter_save_first",void 0,this.hass)}</p>`}
              `:e``}
      </ha-expansion-panel>
    `}_declutterPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterOriginal=i.config,this._declutterSection=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{card:JSON.parse(JSON.stringify(i.config))});delete s.group,this._fireConfigChanged(s)}_declutterSectionPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterSection={view:i.view,section:i.section,cards:i.cards},this._declutterOriginal=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{group:{cards:JSON.parse(JSON.stringify(i.cards))}});delete s.card,this._fireConfigChanged(s)}async _declutterReplace(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.template,i=this._declutterOriginal,s=this._declutterSection;if(!t||!i&&!s)return;if(!this._declutterPending)return void(this._declutterPending=!0);const o={type:"custom:decluttering-card-plus",template:t};let r=!1;const n=await this._saveDashboard(e=>{if(i)return ie(e,i,o);const t=Nt(e,s.view,s.section,s.cards,[o]);return r=t===e,t},"declutter");n&&r&&(this._toolError=a("template_editor.declutter_section_changed",void 0,this.hass)),n&&(this._declutterPending=!1,this._declutterOriginal=void 0,this._declutterSection=void 0)}_selectTab(e){e.stopPropagation(),this._selectedTab=e.detail}_activateTab(e){const t=e.composedPath().find(e=>"ha-tab-group-tab"===e.localName),i=null==t?void 0:t.getAttribute("panel");i&&(this._selectedTab=i)}_describeChanged(e){var t;if(!this._config)return;const i=Object.assign({template:this._config.template,thingType:null!==(t=L(this._config))&&void 0!==t?t:"card",description:this._config.description,category:this._config.category},e.detail.value),s=Object.assign(Object.assign({},this._config),{template:i.template});T(s,"description",i.description),T(s,"category",i.category);const a=void 0!==s.group&&"card"===i.thingType;a||delete s.group;for(const[o,r]of Object.entries(Fs))lr.stubMember(!a&&i.thingType===o,s,o,r);this._fireConfigChanged(s)}_declarationsChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);T(t,"variables",e.detail.value),this._fireConfigChanged(t)}_defaultsChanged(e){if(!this._config)return;const t=e.detail.value,i=Object.assign(Object.assign({},this._config),{default:t.default});void 0!==this._config.defaults&&(JSON.stringify(t.default)===JSON.stringify(Se(this._config))?i.default=this._config.default:delete i.defaults),this._fireConfigChanged(i)}_childConfigChanged(e){e.stopPropagation(),this._fireConfigChanged(e.detail.config)}_cardChanged(e){if(e.stopPropagation(),!this._config)return;this._suggestion=void 0,this._suggestedNothing=!1;const t=Object.assign(Object.assign({},this._config),{card:e.detail.config});this._fireConfigChanged(t)}_cardPicked(e){this._selectedTab="card",this._cardChanged(e)}_rowChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign(Object.assign({},this._config),{row:e.detail.config});this._fireConfigChanged(t)}_fireConfigChanged(e){this._suggestion=void 0,this._suggestedNothing=!1,v(this,"config-changed",{config:e})}static stubMember(e,t,i,s){e?i in t||(t[i]=s):delete t[i]}static get styles(){return Xs}_saveDashboard(e,t,i){return Gs(this,e,t,i)}async connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=k(()=>this.requestUpdate())),this._loadedElements||(await j(),await async function(){let e=customElements.get("hui-entities-card");if(!e){if(!Ie)return;(await Ie).createCardElement({type:"entities",entities:[]}),await customElements.whenDefined("hui-entities-card"),e=customElements.get("hui-entities-card")}e&&e.getConfigElement&&await e.getConfigElement()}(),this._loadedElements=!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}}c([p()],lr.prototype,"_config",void 0),c([p()],lr.prototype,"_selectedTab",void 0),c([p()],lr.prototype,"_suggestion",void 0),c([p()],lr.prototype,"_suggestedNothing",void 0),c([p()],lr.prototype,"_toolError",void 0),c([p()],lr.prototype,"_busy",void 0),c([p()],lr.prototype,"_declutterOriginal",void 0),c([p()],lr.prototype,"_declutterSection",void 0),c([p()],lr.prototype,"_declutterPending",void 0),c([p()],lr.prototype,"_promotePath",void 0),c([p()],lr.prototype,"_promoteName",void 0),c([p()],lr.prototype,"_promoteError",void 0),c([u()],lr.prototype,"lovelace",void 0),c([u()],lr.prototype,"hass",void 0);class dr extends m{connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=k(()=>this.requestUpdate()))}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}static get styles(){return _`
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
    `}render(){var t,i,s,o,r,n,l,d,h;const c=this.lovelace,u=Oe(c);if(u&&(null===(t=this._borrowed)||void 0===t?void 0:t.ll)!==c){this._borrowed={ll:c};const e=new Set(Object.keys(A(c)));Ae(this.hass,c).then(t=>{var i;(null===(i=this._borrowed)||void 0===i?void 0:i.ll)===c&&(this._borrowed={ll:c,names:Object.keys(t).filter(t=>!e.has(t)),templates:t})})}const p=u&&!(null===(i=this._borrowed)||void 0===i?void 0:i.names),m=Ht(c,u&&null!==(o=null===(s=this._borrowed)||void 0===s?void 0:s.names)&&void 0!==o?o:[]),_=p?Object.assign(Object.assign({},m),{missingTemplates:[]}):m,v=Mt(c),g=Dt(c),f=null===(r=this._borrowed)||void 0===r?void 0:r.names,y=this._examplesChecked;p||(null==y?void 0:y.ll)===c&&(null==y?void 0:y.borrowed)===f||(this._examplesChecked={ll:c,borrowed:f,failed:lt(A(c),null!=f?f:[],this.hass)});const b=p?[]:null!==(l=null===(n=this._examplesChecked)||void 0===n?void 0:n.failed)&&void 0!==l?l:[],$=Qo(c,null!==(h=null===(d=this._borrowed)||void 0===d?void 0:d.templates)&&void 0!==h?h:A(c)),w=!(_.missingTemplates.length||_.unsetVariables.length||_.unusedTemplates.length||v.length||g.length||b.length||$.length);return e`
      <ha-expansion-panel outlined>
        <span slot="header">${a("tools.health_header",void 0,this.hass)}</span>
        <slot></slot>
        ${w?e`<p class="hint">${a("tools.health_ok",void 0,this.hass)}</p>`:e`
                ${b.map(t=>e`<ha-alert alert-type="error">
                      ${a("tools.health_example",{template:t.template,number:t.example,problems:t.problems.join(" ")},this.hass)}
                    </ha-alert>`)}
                ${v.map(t=>e`<ha-alert alert-type="error">
                      ${a("tools.health_extends_loop",{path:t.join(" → ")},this.hass)}
                    </ha-alert>`)}
                ${_.missingTemplates.map(t=>e`<ha-alert alert-type="error">
                      ${a("tools.health_missing",{template:t.template,count:t.count},this.hass)}${t.closest?a("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${_.unsetVariables.map(t=>e`<ha-alert alert-type="warning">
                      ${a("tools.health_unset",{template:t.template,names:t.names.join(", "),count:t.count},this.hass)}
                    </ha-alert>`)}
                ${g.map(t=>{const i=[...t.views.map(e=>a("tools.health_view_uses",{view:e.title||a("template_editor.untitled_view",void 0,this.hass),count:e.count},this.hass)),...t.templates.map(e=>a("tools.health_template_uses",{name:e},this.hass))].join(", ");return e`<ha-alert alert-type="warning">
                    ${t.message?a("tools.health_deprecated_because",{template:t.template,message:t.message,uses:i},this.hass):a("tools.health_deprecated",{template:t.template,uses:i},this.hass)}
                  </ha-alert>`})}
                ${$.map(t=>e`<ha-alert alert-type="warning">
                      ${a("tools.health_unread",{template:t.template,name:t.name,count:t.count,view:t.view.title||t.view.path||a("template_editor.untitled_view",void 0,this.hass)},this.hass)}${"variables"===t.where?"":a(`tools.health_unread_${t.where}`,void 0,this.hass)}${t.closest?a("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${_.unusedTemplates.length?e`<ha-alert alert-type="info">
                        ${a("tools.health_unused",{names:_.unusedTemplates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
              `}
        ${this._renderTimings()}
      </ha-expansion-panel>
    `}_renderTimings(){const t=qt.entries(),i=e=>e.toFixed(1),s=e`<h4 class="timings-header">${a("tools.timings_header",void 0,this.hass)}</h4>`;if(!t.length)return e`${s}
        <p class="hint">${a("tools.timings_none",void 0,this.hass)}</p>`;const{byTotal:o,byMax:r,repeats:n}=zt(t);return e`
      ${s}
      <p class="hint">${a("tools.timings_hint",{count:t.length},this.hass)}</p>
      <p class="hint">${a("tools.timings_by_total",void 0,this.hass)}</p>
      <ul class="timings">
        ${o.map(t=>e`<li>
              ${a(1===t.builds?"tools.timings_total_row_one":"tools.timings_total_row",{template:t.template,total:i(t.total),builds:t.builds,max:i(t.max)},this.hass)}
            </li>`)}
      </ul>
      <p class="hint">${a("tools.timings_by_max",void 0,this.hass)}</p>
      <ul class="timings">
        ${r.map(t=>e`<li>
              ${a("tools.timings_max_row",{template:t.template,max:i(t.max)},this.hass)}
            </li>`)}
      </ul>
      ${n.length?e`
              <p class="hint">${a("tools.timings_repeats",void 0,this.hass)}</p>
              <ul class="timings">
                ${n.map(t=>{var i;return e`<li>
                      ${a(t.name?"tools.timings_repeat_named_row":"tools.timings_repeat_row",{template:t.template,name:null!==(i=t.name)&&void 0!==i?i:"",copies:t.copies},this.hass)}
                    </li>`})}
              </ul>
            `:e``}
    `}}c([u({attribute:!1})],dr.prototype,"hass",void 0),c([u({attribute:!1})],dr.prototype,"lovelace",void 0),c([p()],dr.prototype,"_borrowed",void 0),Rt(Ut,Bi),Rt(It,lr),Rt(Jt,dr);export{Bi as DeclutteringCardEditor,dr as DeclutteringHealthPanel,lr as DeclutteringTemplateEditor};
//# sourceMappingURL=decluttering-card-plus.editors-DRe0Nz1A.js.map
