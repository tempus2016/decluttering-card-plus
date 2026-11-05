import{b as e,O as t,s as i,r as s,E as n,W as a,a as o,S as r,l,c,v as d,d as h,P as p,e as u,n as m,_ as f,f as g,g as v,i as _,h as y,j as b,k as $,m as w,B as x,o as k,p as j,q as A,t as S,u as O,w as C,x as E,y as T,z as N,A as P,C as L,D as I,F,G as M,H as V,I as H,J as D,K as q,L as R,M as z,N as U,Q as W,R as B,T as K,U as J,X as Y,Y as Z,Z as G,$ as Q,a0 as X,a1 as ee,a2 as te,a3 as ie,a4 as se,a5 as ne,a6 as ae,a7 as oe,a8 as re,a9 as le,aa as ce,ab as de,ac as he,ad as pe,ae as ue,af as me,ag as fe,ah as ge,ai as ve,aj as _e,ak as ye,al as be,am as $e,an as we,ao as xe,ap as ke,aq as je,ar as Ae,as as Se,at as Oe,au as Ce,av as Ee,aw as Te,ax as Ne,ay as Pe,az as Le,aA as Ie,aB as Fe,aC as Me,aD as Ve,aE as He,aF as De,aG as qe,aH as Re,aI as ze,aJ as Ue,aK as We,aL as Be,aM as Ke,aN as Je,aO as Ye,aP as Ze,aQ as Ge,aR as Qe,aS as Xe,aT as et,aU as tt,aV as it,aW as st,aX as nt,aY as at,aZ as ot,a_ as rt,a$ as lt,V as ct,b0 as dt,b1 as ht,b2 as pt,b3 as ut,b4 as mt,b5 as ft,b6 as gt,b7 as vt,b8 as _t,b9 as yt,ba as bt,bb as $t,bc as wt,bd as xt,be as kt,bf as jt,bg as At,bh as St,bi as Ot,bj as Ct,bk as Et,bl as Tt,bm as Nt,bn as Pt,bo as Lt,bp as It,bq as Ft,br as Mt,bs as Vt,bt as Ht,bu as Dt,bv as qt,bw as Rt,bx as zt,by as Ut,bz as Wt,bA as Bt,bB as Kt,bC as Jt,bD as Yt,bE as Zt,bF as Gt,bG as Qt}from"./decluttering-card-plus.core-gr0iIWCi.js";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xt=Symbol.for(""),ei=e=>{if(e?.r===Xt)return e?._$litStatic$},ti=e=>({_$litStatic$:e,r:Xt}),ii=new Map,si=(e=>(t,...i)=>{const s=i.length;let n,a;const o=[],r=[];let l,c=0,d=!1;for(;c<s;){for(l=t[c];c<s&&void 0!==(a=i[c],n=ei(a));)l+=n+t[++c],d=!0;c!==s&&r.push(a),o.push(l),c++}if(c===s&&o.push(t[s]),d){const e=o.join("$$lit$$");void 0===(t=ii.get(e))&&(o.raw=o,ii.set(e,t=o)),i=r}return e(t,...i)})(e),ni=["grid_options","style",t,"strict","rebuild_on","debug","name","inherit_variables"];function ai(e){return"number"==typeof e&&Number.isFinite(e)?String(e):"string"==typeof e&&e.trim()?e.trim():void 0}function oi(e){if("number"==typeof e)return e;if("string"!=typeof e||!e.trim())return;const t=e.trim(),i=Number(t);return Number.isFinite(i)&&/^\d+$/.test(t)?i:t}function ri(e){return e===o?"hide":e&&"object"==typeof e&&!Array.isArray(e)?"card":"show"}function li(e){var n,a;const o=i(e.strict),r={on_error_mode:ri(e[t]),strict_errors:null!==(n=o.errors)&&void 0!==n?n:"ignore",strict_warnings:null!==(a=o.warnings)&&void 0!==a?a:"ignore",debug:(l=e.debug,!0===l?"json":"yaml"===l||"console"===l||"report"===l?l:"off")};var l;const c=e.grid_options,d=ai(null==c?void 0:c.columns),h=ai(null==c?void 0:c.rows);void 0!==d&&(r.grid_columns=d),void 0!==h&&(r.grid_rows=h),"string"==typeof e.style&&e.style&&(r.style=e.style);const p=s(e.rebuild_on);return p.length&&(r.rebuild_on=p),"string"==typeof e.name&&e.name&&(r.name=e.name),!0===e.inherit_variables&&(r.inherit_variables=!0),r}function ci(e,n){var a,l,c;const d=Object.assign({},e),h=Object.assign({},null!==(a=e.grid_options)&&void 0!==a?a:{}),p=oi(n.grid_columns),u=oi(n.grid_rows);void 0===p?delete h.columns:h.columns=p,void 0===u?delete h.rows:h.rows=u,Object.keys(h).length?d.grid_options=h:delete d.grid_options;const m="string"==typeof n.style?n.style:"";switch(m.trim()?d.style=m:delete d.style,n.on_error_mode){case"hide":d[t]=o;break;case"card":"card"!==ri(e[t])&&delete d[t];break;default:delete d[t]}const f=null!==(l=n.strict_errors)&&void 0!==l?l:"ignore",g=null!==(c=n.strict_warnings)&&void 0!==c?c:"ignore",v=e.strict&&"object"==typeof e.strict?i(e.strict):{},_=Object.assign(Object.assign({},"ignore"!==f||v.errors?{errors:f}:{}),"ignore"!==g||v.warnings?{warnings:g}:{});f!==r.errors||g!==r.warnings||v.warnings?Object.keys(_).length?d.strict=_:delete d.strict:d.strict=!0;const y=s(n.rebuild_on);switch(y.length?d.rebuild_on=y:delete d.rebuild_on,n.debug){case"json":d.debug=!0;break;case"yaml":case"console":case"report":d.debug=n.debug;break;default:delete d.debug}const b="string"==typeof n.name?n.name.trim():"";return b?d.name=b:delete d.name,!0===n.inherit_variables?d.inherit_variables=!0:delete d.inherit_variables,d}function di(e){const i=e[t];return i&&"object"==typeof i&&!Array.isArray(i)?i:void 0}function hi(e,i){const s=Object.assign({},e);return i&&"object"==typeof i?s[t]=i:delete s[t],s}const pi=["1","2","3","4","5","6","7","8","9","10","11","12","full"],ui=["1","2","3","4","5","6","7","8","auto"];const mi=["for_each","for_each_from","columns","min_column_width","gap","lazy","lazy_eager","empty"],fi=["repeat","extras","fit","advanced",...ni],gi={grid_options:["grid_columns","grid_rows"],on_error:["on_error_mode"],strict:["strict_errors","strict_warnings"]};function vi(e){const t=null==e?void 0:e.editor_hide;return(Array.isArray(t)?t:void 0===t?[]:[t]).filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>e.trim().toLowerCase())}const _i=(e,t)=>void 0!==(null==e?void 0:e[t]);function yi(e,t,i){const s=new Set(vi(e)),n=ni.some(e=>_i(t,e));return{repeat:s.has("repeat")&&!mi.some(e=>_i(t,e)),extras:s.has("extras")&&!(null==i?void 0:i.length),fit:s.has("fit")&&!_i(t,"fit"),advanced:s.has("advanced")&&!n,advancedFields:[].concat(...ni.filter(e=>s.has(e)&&!_i(t,e)).map(e=>{var t;return null!==(t=gi[e])&&void 0!==t?t:[e]}))}}function bi(e,t,i,s){if(void 0===e)return;const n=JSON.stringify(e);if("string"!=typeof n||!p.test(n))return e;let a,o=!1;try{a=u(m(t),i,{value:e},void 0,s,!0,()=>{o=!0})}catch(c){return}if(o)return;const r=null==a?void 0:a.value,l=JSON.stringify(r);return"string"==typeof l&&p.test(l)?void 0:r}function $i(e,t){return e===t||"object"==typeof e&&null!==e&&"object"==typeof t&&null!==t&&JSON.stringify(e)===JSON.stringify(t)}const wi="decluttering-card-plus-card-slot";class xi extends _{constructor(){super(...arguments),this.label="",this.emptyHint="",this._picking=!1,this._editing=!1}static get styles(){return y`
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
    `}render(){const t=function(e){var t,i,s,n;if(!e||"object"!=typeof e||Array.isArray(e))return;const a=e,o="string"==typeof a.type?a.type:"",r=o.startsWith("custom:")?o.slice(7):o?o[0].toUpperCase()+o.slice(1):"",c=e=>"string"==typeof e&&e.trim()?e.split("\n")[0].trim():void 0,d=Array.isArray(a.cards)?a.cards.length:void 0;return{type:r,text:null!==(n=null!==(s=null!==(i=null!==(t=c(a.content))&&void 0!==t?t:c(a.title))&&void 0!==i?i:c(a.name))&&void 0!==s?s:c(a.entity))&&void 0!==n?n:void 0!==d?l("editor.slot.cards",{count:d}):""}}(this.value);return e`
      ${this.label?e`<p class="label">${this.label}</p>`:e``}
      <div class="slot ${t?"filled":""}">
        ${t?e`
                <div class="row">
                  <div class="text summary">
                    <b>${t.type}</b>
                    ${t.text?e`<small>${t.text}</small>`:e``}
                  </div>
                  <ha-button @click=${()=>this._toggleEdit()}>
                    ${l(this._editing?"editor.slot.done":"editor.slot.edit",void 0,this.hass)}
                  </ha-button>
                  <ha-button @click=${()=>this._set(void 0)}>
                    ${l("editor.slot.remove",void 0,this.hass)}
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
                    ${l(this._picking?"editor.slot.cancel":"editor.slot.choose",void 0,this.hass)}
                  </ha-button>
                </div>
                ${this._picking?e`<hui-card-picker
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        @config-changed=${this._picked}
                      ></hui-card-picker>`:e``}
              `}
      </div>
    `}_togglePick(){this._picking=!this._picking}_toggleEdit(){this._editing=!this._editing}_picked(e){var t;e.stopPropagation(),this._picking=!1,this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_edited(e){var t;e.stopPropagation(),this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_set(e){this._editing=this._editing&&!!e,b(this,"value-changed",{value:e&&"object"==typeof e?e:void 0})}}function ki(e,t){const i=Math.max(0,t-e);return i<1?"<1 ms":`${Math.round(i)} ms`}f([g({attribute:!1})],xi.prototype,"hass",void 0),f([g({attribute:!1})],xi.prototype,"lovelace",void 0),f([g({attribute:!1})],xi.prototype,"value",void 0),f([g()],xi.prototype,"label",void 0),f([g()],xi.prototype,"emptyHint",void 0),f([v()],xi.prototype,"_picking",void 0),f([v()],xi.prototype,"_editing",void 0),"undefined"==typeof customElements||customElements.get(wi)||customElements.define(wi,xi);const ji="decluttering-card-plus-return";function Ai(e){try{return"undefined"==typeof sessionStorage?void 0:sessionStorage}catch(t){return}}const Si="default";function Oi(e){const t=null==e?void 0:e[x];return t&&"object"==typeof t&&!Array.isArray(t)?t:void 0}function Ci(e,t,i){var s,n;const a={};for(const r of t){const e=null===(s=r.domain)||void 0===s?void 0:s.trim(),t=null===(n=r.template)||void 0===n?void 0:n.trim();e&&t&&e!==Si&&(a[e]=t)}(null==i?void 0:i.trim())&&(a[Si]=i.trim());const o=Object.assign({},e);return Object.keys(a).length?o[x]=a:delete o[x],o}function Ei(e,t){const i=new Set(t.map(e=>e.domain));return e.filter(e=>!i.has(e))}const Ti=["entities","areas","devices","floors","labels","views"];function Ni(e){if(!e||"object"!=typeof e||Array.isArray(e))return;const t=e;if(void 0!==t.template||void 0!==t.range||void 0!==t.with)return;if(void 0!==t.exclude&&"object"==typeof t.exclude&&!Array.isArray(t.exclude))return;const i=Ti.filter(e=>void 0!==t[e]);return i.length>1?void 0:1===i.length?i[0]:k(e)?"entities":void 0}function Pi(e){var t;return void 0!==e.for_each_from?null!==(t=Ni(e.for_each_from))&&void 0!==t?t:"other":void 0!==e.for_each?"list":"none"}function Li(e){if(null==e||!0===e)return;return(Array.isArray(e)?e:[e]).filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>e.trim())}function Ii(e){const t="number"==typeof e?e:"string"==typeof e&&e.trim()?Number(e):NaN;return Number.isFinite(t)?t:void 0}const Fi=["domain","area","floor","label","device_class","integration","exclude"];function Mi(e){if(e&&e.length)return 1===e.length?e[0]:e}function Vi(e,t){var i,s;const n=Object.assign({},null!=e?e:{});n[null!==(i=Ni(e))&&void 0!==i?i:"entities"]=!t.patterns||!t.patterns.length||Mi(t.patterns.map(e=>e.trim()).filter(Boolean));for(const l of Fi){const e=Mi(null===(s=t[l])||void 0===s?void 0:s.filter(e=>e.trim()));void 0===e?delete n[l]:n[l]=e}const a=[t.sort,t.then].filter(e=>"string"==typeof e&&""!==e.trim());a.length?n.sort=1===a.length?a[0]:a:delete n.sort,!0===t.reverse?n.reverse=!0:delete n.reverse;const o=Ii(t.limit);void 0===o?delete n.limit:n.limit=o;const r=Ii(t.offset);return void 0===r||0===r?delete n.offset:n.offset=r,"string"==typeof t.group_by&&t.group_by?n.group_by=t.group_by:delete n.group_by,!0===t.entity_category?Array.isArray(n.entity_category)||"string"==typeof n.entity_category||(n.entity_category="all"):delete n.entity_category,n}function Hi(e){return e.split(".")[0]}function Di(e){var t;return[...new Set(Object.keys(null!==(t=null==e?void 0:e.states)&&void 0!==t?t:{}).map(Hi))].sort()}function qi(e){var t,i;const s=new Set;for(const n of Object.values(null!==(t=null==e?void 0:e.states)&&void 0!==t?t:{})){const e=null===(i=null==n?void 0:n.attributes)||void 0===i?void 0:i.device_class;"string"==typeof e&&e&&s.add(e)}return[...s].sort()}function Ri(e){var t;const i=new Set;for(const s of Object.values(null!==(t=null==e?void 0:e.entities)&&void 0!==t?t:{}))"string"==typeof(null==s?void 0:s.platform)&&s.platform&&i.add(s.platform);return[...i].sort()}const zi=["name","-name","entity","area","floor","domain","entity_count","none"],Ui=["","area","floor","domain","label"];function Wi(e,t){return{select:{mode:"dropdown",multiple:!0,custom_value:!0,options:[...e,...(null!=t?t:[]).filter(t=>!e.includes(t))].map(e=>({value:e,label:e}))}}}function Bi(e,t){const i=["none","list",...Ti];return"other"===t&&i.push("other"),i.map(t=>({value:t,label:l(`editor.repeat.mode_${t}`,void 0,e)}))}const Ki="variable:";function Ji(e,t,i){var s;const n=e&&"object"==typeof e?e:{},a=null!==(s=["areas","devices","floors","labels","views","entities"].find(e=>void 0!==n[e]))&&void 0!==s?s:k(e)?"entities":"items";return l(`editor.matches_${a}_${1===t?"one":"many"}`,void 0,i)}let Yi,Zi;function Gi(e,t){const i=e.indexOf(t);return-1===i?[e,""]:[e.slice(0,i),e.slice(i+t.length)]}const Qi=new Set(["true","yes","on","1"]),Xi=/:host|\.decluttering-container/;class es extends _{constructor(){super(...arguments),this._shownAs=new Map,this._loadingTemplates=!1,this._ejectPending=!1,this._sectionsPending=!1,this._previewMode="yaml",this._copied=!1,this._markedLines=[],this._cannotOpen=!1,this._matchesOpen=!1,this._openItems=new Set,this._renderedTemplates={},this._renderingTemplates=new Set}static get styles(){return y`
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
    `}set lovelace(e){this._lovelace=e,this._templates=void 0,this._schema=void 0}_editingPlace(){const e=j(this),t=e?A(e):void 0;return null!=t?t:{view:S(this._lovelace)}}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}async connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=O(()=>this.requestUpdate())),await C()}setConfig(e){this._openedWith||(this._openedWith=e,this._resume=function(e,t,i=Date.now()){var s;const n=Ai();if(!n)return;let a;try{const e=n.getItem(ji);a=e?JSON.parse(e):void 0}catch(o){a=void 0}if(a)if(i-a.at>18e5)n.removeItem(ji);else if(JSON.stringify(null!==(s=a.openedWith)&&void 0!==s?s:null)===JSON.stringify(null!=e?e:null))return n.removeItem(ji),a}(e)),this._config=e}willUpdate(){var e;if(this.hass&&this._config&&(this._lovelace||(this._lovelace=null!==(e=E())&&void 0!==e?e:void 0),this._lovelace)){if(!this._templates){const e=this._editingPlace();this._templates=T(this._lovelace,e.view,void 0,e.section),this._loadBorrowedTemplates()}this._schema||(this._schema=[{name:"template",label:l("editor.template_label",void 0,this.hass),selector:{select:{mode:"dropdown",custom_value:!0,options:N(this._templates,this.hass)}}},{name:"variables",label:l("editor.variables_label",void 0,this.hass),helper:l("editor.variables_helper",void 0,this.hass),selector:{object:{}}}])}}render(){if(!(this.hass&&this._config&&this._templates&&this._schema))return e``;const t=this._templates[this._config.template],i=P(t),s=this._hiddenNames(t,i),n=i.filter(e=>!s.has(e.name)),a=L(this._config.variables),o=I(this._config),r=!!t&&"card"===F(t)||!!o||void 0!==this._config.for_each||void 0!==this._config.for_each_from,c=this._formData(i),d=yi(t,this._config,c.extras),h={};t||this._loadingTemplates||o&&!this._config.template||(h.template=l("editor.no_such_template",void 0,this.hass)),a||(h.variables=l("error.variables_shape",void 0,this.hass));const p=w(t);return e`
      ${(null==t?void 0:t.description)?e`<p class="description">${t.description}</p>`:e``}
      ${o?this._renderByDomain(o):e``}
      ${void 0===p?e``:e`<ha-alert alert-type="warning">
              ${p?l("editor.template_deprecated_because",{message:p},this.hass):l("editor.template_deprecated",void 0,this.hass)}
            </ha-alert>`}
      ${this._renderResume()} ${this._renderResult(t)} ${this._renderSource(t)}
      ${this._renderStartFromExample(t)} ${this._renderDiagnostics(t,a)}
      <ha-form
        .hass=${this.hass}
        .data=${c}
        .schema=${this._formSchema(n,d,t)}
        .error=${h}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._renderCardVariables(n)} ${this._renderRepeat(r&&!d.repeat,t)}
      ${this._renderLayout(c,r&&!d.repeat,d)} ${this._renderEmptySlot(r)}
      ${this._renderAdvanced(d)} ${this._renderSectionPerCopy()}
      <decluttering-card-plus-health .hass=${this.hass} .lovelace=${this._lovelace}></decluttering-card-plus-health>
    `}_renderAdvanced(t){if(!this._config||t.advanced)return e``;const i=function(e){const t=li(e);let i=0;return void 0===t.grid_columns&&void 0===t.grid_rows||(i+=1),void 0!==t.style&&(i+=1),"show"!==t.on_error_mode&&(i+=1),"ignore"===t.strict_errors&&"ignore"===t.strict_warnings||(i+=1),t.rebuild_on&&(i+=1),"off"!==t.debug&&(i+=1),void 0!==t.name&&(i+=1),t.inherit_variables&&(i+=1),i}(this._config),s=li(this._config),o=this._onErrorMode&&"card"!==s.on_error_mode?Object.assign(Object.assign({},s),{on_error_mode:this._onErrorMode}):s;"card"===s.on_error_mode&&this._onErrorMode&&(this._onErrorMode=void 0);const r=di(this._config),c=ti(wi);return e`
      <ha-expansion-panel outlined class="advanced">
        <span slot="header">
          ${l("editor.advanced.header",void 0,this.hass)}
          <span class="count">
            ${0===i?"":1===i?l("editor.advanced.count_one",void 0,this.hass):l("editor.advanced.count_many",{count:i},this.hass)}
          </span>
        </span>
        <div class="advanced-body">
          <ha-form
            .hass=${this.hass}
            .data=${o}
            .schema=${function(e,t){return t.length?e.filter(e=>!t.includes(null==e?void 0:e.name)):e}(function(e){const t=t=>l(t,void 0,e),i=(e,i)=>e.map(e=>({value:e,label:/^\d+$/.test(e)?e:t(`${i}${e}`)}));return[{name:"grid_columns",label:t("editor.advanced.grid_columns_label"),helper:t("editor.advanced.grid_helper"),selector:{select:{mode:"dropdown",custom_value:!0,options:i(pi,"editor.advanced.grid_")}}},{name:"grid_rows",label:t("editor.advanced.grid_rows_label"),selector:{select:{mode:"dropdown",custom_value:!0,options:i(ui,"editor.advanced.grid_")}}},{name:"style",label:t("editor.advanced.style_label"),helper:t("editor.advanced.style_helper"),selector:{text:{multiline:!0}}},{name:"on_error_mode",label:t("editor.advanced.on_error_label"),helper:t("editor.advanced.on_error_helper"),selector:{select:{mode:"dropdown",options:[{value:"show",label:t("editor.advanced.on_error_show")},{value:"hide",label:t("editor.advanced.on_error_hide")},{value:"card",label:t("editor.advanced.on_error_card")}]}}},{name:"strict_errors",label:t("editor.advanced.strict_errors_label"),helper:t("editor.advanced.strict_errors_helper"),selector:{select:{mode:"dropdown",options:n.map(e=>({value:e,label:t(`editor.advanced.strict_errors_${e}`)}))}}},{name:"strict_warnings",label:t("editor.advanced.strict_warnings_label"),helper:t("editor.advanced.strict_warnings_helper"),selector:{select:{mode:"dropdown",options:a.map(e=>({value:e,label:t(`editor.advanced.strict_warnings_${e}`)}))}}},{name:"rebuild_on",label:t("editor.advanced.rebuild_on_label"),helper:t("editor.advanced.rebuild_on_helper"),selector:{entity:{multiple:!0}}},{name:"debug",label:t("editor.advanced.debug_label"),helper:t("editor.advanced.debug_helper"),selector:{select:{mode:"dropdown",options:[{value:"off",label:t("editor.advanced.debug_off")},{value:"json",label:t("editor.advanced.debug_json")},{value:"yaml",label:t("editor.advanced.debug_yaml")},{value:"console",label:t("editor.advanced.debug_console")},{value:"report",label:t("editor.advanced.debug_report")}]}}},{name:"name",label:t("editor.advanced.name_label"),helper:t("editor.advanced.name_helper"),selector:{text:{}}},{name:"inherit_variables",label:t("editor.advanced.inherit_label"),helper:t("editor.advanced.inherit_helper"),selector:{boolean:{}}}]}(this.hass),t.advancedFields)}
            .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
            .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
            @value-changed=${this._advancedChanged}
          ></ha-form>
          ${"card"===o.on_error_mode?si`<${c}
                  .hass=${this.hass}
                  .lovelace=${this._lovelace}
                  .value=${r}
                  .label=${l("editor.advanced.fallback_label",void 0,this.hass)}
                  .emptyHint=${l("editor.advanced.fallback_hint",void 0,this.hass)}
                  @value-changed=${this._fallbackChanged}
                ></${c}>`:e``}
        </div>
      </ha-expansion-panel>
    `}_advancedChanged(e){if(e.stopPropagation(),!this._config)return;const t=e.detail.value;this._onErrorMode="card"!==t.on_error_mode||di(this._config)?void 0:"card",b(this,"config-changed",{config:ci(this._config,t)})}_fallbackChanged(e){e.stopPropagation(),this._config&&(e.detail.value&&(this._onErrorMode=void 0),b(this,"config-changed",{config:hi(this._config,e.detail.value)}))}_renderEmptySlot(t){if(!this._config||!t)return e``;if(!(void 0!==this._config.for_each||void 0!==this._config.for_each_from||void 0!==this._config.empty))return e``;const i=ti(wi),s=this._config.empty;return si`<${i}
      .hass=${this.hass}
      .lovelace=${this._lovelace}
      .value=${s&&"object"==typeof s?s:void 0}
      .label=${l("editor.empty_label",void 0,this.hass)}
      .emptyHint=${l("editor.empty_slot_hint",void 0,this.hass)}
      @value-changed=${this._emptyChanged}
    ></${i}>`}_emptyChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);M(t,"empty",e.detail.value),b(this,"config-changed",{config:t})}_renderStartFromExample(t){const i=V(t);return i.length&&this._config&&!H(this._config.variables).length?e`
      <div class="examples">
        <p class="hint">${l("editor.start_from_example_hint",void 0,this.hass)}</p>
        ${i.map((t,i)=>e`
            <ha-button @click=${()=>this._startFromExample(t)}>
              ${l("editor.start_from_example",{number:i+1},this.hass)}
            </ha-button>
          `)}
      </div>
    `:e``}_startFromExample(e){e.length&&b(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{variables:e})})}_renderByDomain(t){var i,s;if(!this._config)return e``;if(!function(e){const t=Oi(e);return!t||Object.values(t).every(e=>"string"==typeof e)}(this._config))return e`<ha-alert alert-type="info">
        ${l("editor.by_domain_hint",{templates:Object.entries(t).map(([e,t])=>`${e}: ${t}`).join(", ")},this.hass)}
      </ha-alert>`;const{rows:n,fallback:a}=function(e){var t;const i=null!==(t=Oi(e))&&void 0!==t?t:{};return{rows:Object.entries(i).filter(([e,t])=>e!==Si&&"string"==typeof t).map(([e,t])=>({domain:e,template:t})),fallback:"string"==typeof i[Si]?i[Si]:void 0}}(this._config),o=null!==(i=this._byDomainDraft)&&void 0!==i?i:n,r=function(e,t){return Object.keys(e).filter(t=>{return!!(i=e[t])&&(void 0!==i.card||void 0!==i.group);var i}).sort().map(i=>({value:i,label:void 0!==w(e[i])?i+l("editor.deprecated_suffix",void 0,t):i}))}(null!==(s=this._templates)&&void 0!==s?s:{},this.hass),c=Di(this.hass),d=(e,t)=>{const i=e.every(e=>{var t,i;return(null===(t=e.domain)||void 0===t?void 0:t.trim())&&(null===(i=e.template)||void 0===i?void 0:i.trim())});this._byDomainDraft=i?void 0:e,b(this,"config-changed",{config:Ci(this._config,e,t)})};return e`
      <div class="by-domain">
        <h3>${l("editor.by_domain.header",void 0,this.hass)}</h3>
        <p class="hint">${l("editor.by_domain.hint",void 0,this.hass)}</p>
        ${o.map((t,i)=>{return e`
            <div class="bd-row">
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",custom_value:!0,options:(s=t.domain,[...new Set([s,...c])].filter(Boolean).map(e=>({value:e,label:e})))}}}
                .value=${t.domain}
                .label=${l("editor.by_domain.domain",void 0,this.hass)}
                @value-changed=${e=>{e.stopPropagation(),d(o.map((t,s)=>{var n;return s===i?Object.assign(Object.assign({},t),{domain:String(null!==(n=e.detail.value)&&void 0!==n?n:"")}):t}),null!=a?a:"")}}
              ></ha-selector>
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",options:r}}}
                .value=${t.template}
                .label=${l("editor.by_domain.template",void 0,this.hass)}
                @value-changed=${e=>{e.stopPropagation(),d(o.map((t,s)=>{var n;return s===i?Object.assign(Object.assign({},t),{template:String(null!==(n=e.detail.value)&&void 0!==n?n:"")}):t}),null!=a?a:"")}}
              ></ha-selector>
              <ha-icon-button
                .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                .label=${l("editor.by_domain.remove",{domain:t.domain},this.hass)}
                @click=${()=>d(o.filter((e,t)=>t!==i),null!=a?a:"")}
              ></ha-icon-button>
            </div>
          `;var s})}
        <div class="bd-row">
          <span class="bd-default">${l("editor.by_domain.anything_else",void 0,this.hass)}</span>
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:r}}}
            .value=${null!=a?a:""}
            .label=${l("editor.by_domain.template",void 0,this.hass)}
            @value-changed=${e=>{var t;e.stopPropagation(),d(o,String(null!==(t=e.detail.value)&&void 0!==t?t:""))}}
          ></ha-selector>
          <span class="bd-spacer"></span>
        </div>
        <ha-button
          @click=${()=>{var e;return d([...o,{domain:null!==(e=Ei(c,o)[0])&&void 0!==e?e:"",template:""}],null!=a?a:"")}}
        >
          ${l("editor.by_domain.add",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderCardVariables(t){var i;const s=t.filter(e=>D(e));if(!s.length)return e``;const n=d(null===(i=this._config)||void 0===i?void 0:i.variables);return e`${s.map(t=>{var i;const s=n[t.name],a=!!s&&"object"==typeof s;return e`
        <div class="card-variable">
          <h3>${null!==(i=t.label)&&void 0!==i?i:t.name}</h3>
          ${t.description?e`<p class="hint">${t.description}</p>`:e``}
          ${a?e`
                  <hui-card-element-editor
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    .value=${s}
                    @config-changed=${e=>this._cardVariableChanged(t.name,e)}
                  ></hui-card-element-editor>
                  <ha-button @click=${()=>this._cardVariableChanged(t.name)}>
                    ${l("editor.card_variable_clear",void 0,this.hass)}
                  </ha-button>
                `:e`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    @config-changed=${e=>this._cardVariableChanged(t.name,e)}
                  ></hui-card-picker>
                `}
        </div>
      `})}`}_registryItemsForPreview(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.for_each_from;if(!this.hass||!k(t))return;const i=q(t);if(void 0===i||Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))try{const e=R(this.hass,t,Object.assign(Object.assign({},z(this._lovelace)),{rendered:this._renderedTemplates}));return e.length?e:void 0}catch(s){return}}_cardVariableChanged(e,t){var i,s;null==t||t.stopPropagation();const n=null===(i=null==t?void 0:t.detail)||void 0===i?void 0:i.config,a=H(null===(s=this._config)||void 0===s?void 0:s.variables).filter(t=>U(t)!==e);n&&"object"==typeof n&&a.push({[e]:n});const o=Object.assign({},this._config);a.length?o.variables=a:delete o.variables,b(this,"config-changed",{config:o})}_renderResult(t){var i,n,a;if(!this._config)return e``;const o=null!==(i=W(this._config.for_each))&&void 0!==i?i:this._registryItemsForPreview();let r=(null==o?void 0:o.length)?B(o[0],this._config.variables,0,o.length):this._config.variables,c=t,d=this._config.template;if(I(this._config))try{const e=null!==(n=this._templates)&&void 0!==n?n:{};let t;({template:c,name:d,entity:t}=K(this._config,r,t=>e[t],this.hass,Object.keys(e))),r=J(r,t)}catch(A){return e``}if(!c)return e``;const h=F(c);if(!h)return e``;const p=Y(c);let m;const f=performance.now();try{const e=Z(this.hass,s(this._config.rebuild_on)),t=null!==(a=this._lovelace)&&void 0!==a?a:E();m=G(u(r,c,p,d,e,!0,void 0,0,void 0,void 0,!1,{itemTemplates:Q(t),context:z(t)}),this._config,h)}catch(S){return e`<ha-alert alert-type="warning">
        ${l("editor.result_error",{error:String(S)},this.hass)}
      </ha-alert>`}const g=performance.now(),v=(null==o?void 0:o.length)?l("editor.result_copies",{total:o.length},this.hass):"",[_,y]=Gi(l("editor.result_hint",{kind:h},this.hass),"[[name]]"),b=X(m);b!==this._lastYaml&&(this._markedLines=function(e,t){const i=""===t?[]:t.replace(/\n$/,"").split("\n");if(void 0===e)return i.map(e=>({text:e,changed:!1}));const s=new Set(e.replace(/\n$/,"").split("\n"));return i.map(e=>({text:e,changed:!s.has(e)}))}(this._lastYaml,b),this._lastYaml=b);const $=void 0!==this._editingPlace().section?"grid":void 0,w=function(e){return"card"===e?["rendered","yaml"]:["yaml"]}(h),x=w.includes(this._previewMode)?this._previewMode:"yaml",j=!(null==o?void 0:o.length)&&!k(this._config.for_each_from)&&m&&"object"==typeof m;return e`
      <div class="preview">
        <div class="preview-head">
          <span class="preview-title">${l("editor.preview.header",void 0,this.hass)}${v}</span>
          ${w.length>1?e`<div class="segmented" role="group">
                  ${w.map(t=>e`<button
                        type="button"
                        class=${t===x?"on":""}
                        aria-pressed=${t===x?"true":"false"}
                        @click=${()=>{this._previewMode=t}}
                      >
                        ${l(`editor.preview.${t}`,void 0,this.hass)}
                      </button>`)}
                </div>`:e``}
        </div>
        ${"rendered"===x?e`<div class="rendered">
                <hui-card .hass=${this.hass} .config=${m} .preview=${!0} .layout=${$}></hui-card>
              </div>`:e`<pre class="yaml">
${this._markedLines.map(t=>e`<span class="l ${t.changed?"changed":""}">${t.text}</span>`)}</pre>`}
        <p class="hint">
          ${l("editor.preview.built_in",{time:ki(f,g),template:null!=d?d:""},this.hass)}
          ${"yaml"===x?l("editor.preview.changed_hint",void 0,this.hass):""}
        </p>
        <p class="hint">${_}<code>[[name]]</code>${y}</p>
        <div class="preview-actions">
          ${"yaml"===x?e`<ha-button @click=${()=>this._copyYaml(b)}>
                  ${l(this._copied?"editor.preview.copied":"editor.preview.copy",void 0,this.hass)}
                </ha-button>`:e``}
          ${j?e`
                  <ha-button @click=${()=>this._eject(m)}>
                    ${l(this._ejectPending?"editor.eject_confirm":"editor.eject",void 0,this.hass)}
                  </ha-button>
                `:e``}
        </div>
      </div>
    `}_copyYaml(e){ee(e).then(e=>{this._copied=e,e&&setTimeout(()=>this._copied=!1,1500)})}_renderResume(){const t=this._resume;return t?e`<ha-alert alert-type="info">
      ${l("editor.link.resume",{template:t.template},this.hass)}
      <div class="actions">
        <ha-button
          @click=${()=>{this._resume=void 0,b(this,"config-changed",{config:t.config})}}
        >
          ${l("editor.link.resume_button",void 0,this.hass)}
        </ha-button>
        <ha-button
          @click=${()=>{this._resume=void 0}}
        >
          ${l("editor.link.discard_button",void 0,this.hass)}
        </ha-button>
      </div>
    </ha-alert>`:e``}_openTemplate(e){var t,i,s,n;const a=te(),o=function(e,t){var i,s;const n=null==e?void 0:e.views;if(!Array.isArray(n))return;const a=e=>!!e&&$(e.type)&&e.template===t;for(let o=0;o<n.length;o+=1){const e=null!==(i=n[o])&&void 0!==i?i:{},t=Array.isArray(e.cards)?e.cards:[];for(let i=0;i<t.length;i+=1)if(a(t[i]))return[o,i];const r=Array.isArray(e.sections)?e.sections:[];for(let i=0;i<r.length;i+=1){const e=Array.isArray(null===(s=r[i])||void 0===s?void 0:s.cards)?r[i].cards:[];for(let t=0;t<e.length;t+=1)if(a(e[t]))return[o,i,t]}}}(null!==(t=null==a?void 0:a.config)&&void 0!==t?t:this._lovelace,e);if(!a||!o)return void(this._cannotOpen=!0);this._config&&function(e,i,s=Date.now()){const n=Ai();if(n)try{n.setItem(ji,JSON.stringify(Object.assign(Object.assign({},e),{at:s})))}catch(t){}}({config:this._config,openedWith:this._openedWith,template:e});const r=function(e,t){var i,s,n,a,o;const r=null===(i=null==e?void 0:e.views)||void 0===i?void 0:i[t[0]];if(!r)return;const l=3===t.length?null===(a=null===(n=null===(s=r.sections)||void 0===s?void 0:s[t[1]])||void 0===n?void 0:n.cards)||void 0===a?void 0:a[t[2]]:null===(o=r.cards)||void 0===o?void 0:o[t[1]];return l&&"object"==typeof l?l:void 0}(a.config,o),l=null!==(i=document.querySelector("home-assistant"))&&void 0!==i?i:document.body,c=()=>{b(l,"show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>Promise.resolve(),dialogParams:{lovelaceConfig:a.config,cardConfig:r,saveCardConfig:e=>a.saveConfig(r?oe(a.config,r,e):a.config),saveConfig:e=>a.saveConfig(e),path:o}})},d=j(this);if(!d)return void c();this._config&&(null===(s=d._discardDirtyStateChanges)||void 0===s||s.call(d),"_dirty"in d&&(d._dirty=!1));let h=!1;const p=()=>{h||(h=!0,setTimeout(c,0))};d.addEventListener("dialog-closed",p,{once:!0});!1!==(null===(n=d.closeDialog)||void 0===n?void 0:n.call(d))&&setTimeout(p,400)}_renderSectionPerCopy(){var t;const i=null===(t=te())||void 0===t?void 0:t.config;return this._config&&i&&ie(i,this._config)?e`
      <div class="section-per-copy">
        <p class="hint">${l("editor.section_per_copy_hint",void 0,this.hass)}</p>
        ${this._sectionsError?e`<ha-alert alert-type="error">${this._sectionsError}</ha-alert>`:e``}
        <ha-button @click=${this._sectionPerCopy}>
          ${l(this._sectionsPending?"editor.section_per_copy_confirm":"editor.section_per_copy",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}async _sectionPerCopy(){var e,t;if(!this._sectionsPending)return void(this._sectionsPending=!0);this._sectionsPending=!1;const i=te(),s=this._config;if(!i||!s)return;try{await se(this,this.hass,"section_per_copy",[{urlPath:ae(),build:e=>ne(e,s)}])}catch(a){return void(this._sectionsError=l("tools.save_failed",{message:null!==(e=null==a?void 0:a.message)&&void 0!==e?e:a},this.hass))}let n=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;for(;n&&"hui-dialog-edit-card"!==n.localName;)n=n.parentNode instanceof ShadowRoot?n.parentNode.host:n.parentNode;null===(t=null==n?void 0:n.closeDialog)||void 0===t||t.call(n)}_eject(e){this._ejectPending?(this._ejectPending=!1,this._holdEjectUndo(e),b(this,"config-changed",{config:e})):this._ejectPending=!0}_holdEjectUndo(e){const t=te();if(!t||!this._openedWith)return;const i=oe(t.config,this._openedWith,e);i!==t.config&&re({operation:"eject",at:Date.now(),dashboards:[{urlPath:ae(),before:t.config,after:i}]})}_renderSource(t){var i;const s=null===(i=this._config)||void 0===i?void 0:i.template;if(!s||!t||this._loadingTemplates)return e``;const n=le(this._lovelace,s);if(!n){const t=ce(s);return e`<p class="hint">
        ${l("editor.source_borrowed",void 0,this.hass)}
        ${t?e`<a href=${a=t,`/${a.replace(/^\/+/,"")}`} target="_blank" rel="noreferrer"
                >${l("editor.link.open_dashboard",void 0,this.hass)}</a
              >`:e``}
      </p>`}var a;if(n.declared||!n.view)return e`<p class="hint">
        ${l("editor.source_declared",void 0,this.hass)}
        ${l("editor.link.raw_editor",void 0,this.hass)}
      </p>`;const{view:o}=n,r=document.location.pathname.split("/").slice(0,2).join("/"),[c,d]=Gi(l("editor.source_view",{view:""},this.hass),"");return e`<p class="hint">
      ${c}<a href=${`${r}/${o.path||o.index}`} target="_blank" rel="noreferrer"
        >${o.title||o.path||l("editor.untitled_view",void 0,this.hass)}</a
      >${d}
      <a
        href="#"
        class="edit-template"
        @click=${e=>{e.preventDefault(),this._openTemplate(s)}}
        >${l("editor.link.edit_template",void 0,this.hass)}</a
      >
      ${this._cannotOpen?e`<br />${l("editor.link.cannot_open",void 0,this.hass)}`:e``}
    </p>`}_filledSource(e){var t,i;return de(null===(t=this._config)||void 0===t?void 0:t.for_each_from,null===(i=this._config)||void 0===i?void 0:i.variables,e,this.hass)}_renderedTemplateNames(e){const t=this._filledSource(e),i=q(t);if(!this.hass||void 0===i)return[];if(!Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))return[];const s=new Set,n=R(this.hass,t,{rendered:this._renderedTemplates});for(const a of n)for(const e of Object.keys(a))s.add(e);return[...s]}_renderEditorTemplate(e){this.hass&&!this._renderingTemplates.has(e)&&(this._renderingTemplates.add(e),he(this.hass,e).then(t=>{this._renderingTemplates.delete(e),this._renderedTemplates=Object.assign(Object.assign({},this._renderedTemplates),{[e]:t})}))}_renderMatches(t){var i,s;if(!this.hass||!k(null===(i=this._config)||void 0===i?void 0:i.for_each_from))return e``;const n=this._filledSource(t);pe(n)&&!ue()&&me(this.hass).then(()=>this.requestUpdate());const a=q(n);if(void 0!==a){const t=Object.prototype.hasOwnProperty.call(this._renderedTemplates,a)?this._renderedTemplates[a]:void 0;if(!t)return this._renderEditorTemplate(a),e`<p class="hint">${l("editor.matches_template_pending",void 0,this.hass)}</p>`;const i=fe(t);if(!("list"in i)){const t="error"===i.problem?"editor.matches_template_failed":"editor.matches_template_not_list";return e`<ha-alert alert-type="warning"> ${l(t,{detail:i.detail},this.hass)} </ha-alert>`}}let o=[];try{o=R(this.hass,n,Object.assign(Object.assign({},z(this._lovelace)),{rendered:this._renderedTemplates}))}catch(c){return e``}if(!o.length)return e`<ha-alert alert-type="warning">
        ${l("editor.matches_none",{but:(null===(s=this._config)||void 0===s?void 0:s.empty)?l("editor.matches_none_but_empty",void 0,this.hass):""},this.hass)}
      </ha-alert>`;const r=o.slice(0,12);return e`
      <div class="matches-line">
        <ha-svg-icon .path=${"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}></ha-svg-icon>
        <span>
          ${1===o.length?l("editor.matches_header_one",{what:Ji(n,1,this.hass)},this.hass):l("editor.matches_header_many",{count:o.length,what:Ji(n,o.length,this.hass)},this.hass)}
        </span>
        <ha-button
          @click=${()=>{this._matchesOpen=!this._matchesOpen}}
        >
          ${l(this._matchesOpen?"editor.repeat.matches_hide":"editor.repeat.matches_show",void 0,this.hass)}
        </ha-button>
      </div>
      ${this._matchesOpen?e`<div class="matches">
              <ul>
                ${r.map((t,i)=>e`<li>${ge(t,i)}</li>`)}
              </ul>
              ${o.length>r.length?e`<p class="hint">
                      ${l("editor.matches_more",{count:o.length-r.length},this.hass)}
                    </p>`:e``}
              <p class="hint">
                ${l(void 0===a?"editor.matches_hint":"editor.matches_template_hint",void 0,this.hass)}
              </p>
            </div>`:e``}
    `}_suppliedNames(e){var t,i,s;return[..._e(null===(t=this._config)||void 0===t?void 0:t.for_each),...ye(null===(i=this._config)||void 0===i?void 0:i.for_each_from),...k(null===(s=this._config)||void 0===s?void 0:s.for_each_from)?ve:[],...e?this._renderedTemplateNames(e):[]]}_renderRepeat(t,i){if(!this._config||!t)return e``;const s=Pi(this._config),n=[{name:"mode",label:l("editor.repeat.mode_label",void 0,this.hass),helper:l("editor.repeat.mode_helper",void 0,this.hass),selector:{select:{mode:"dropdown",options:Bi(this.hass,s)}}}];return e`
      <div class="repeat">
        <h3>${l("editor.repeat.header",void 0,this.hass)}</h3>
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
    `}_renderLayout(t,i,s){const n=[...i?(null!=Yi||(Yi=[{name:"gap",label:l("editor.gap_label"),helper:l("editor.gap_helper"),selector:{number:{min:0,max:64,mode:"box"}}},{name:"columns",label:l("editor.columns_label"),helper:l("editor.columns_helper"),selector:{number:{min:1,max:6,mode:"box"}}},{name:"min_column_width",label:l("editor.min_column_width_label"),helper:l("editor.min_column_width_helper"),selector:{number:{min:50,max:1e3,step:10,mode:"box"}}},{name:"lazy",label:l("editor.lazy_label"),helper:l("editor.lazy_helper"),selector:{boolean:{}}},{name:"lazy_eager",label:l("editor.lazy_eager_label"),helper:l("editor.lazy_eager_helper"),selector:{number:{min:0,max:100,mode:"box"}}}]),Yi):[],...s.fit?[]:(null!=Zi||(Zi=[{name:"fit",label:l("editor.fit_label"),helper:l("editor.fit_helper"),selector:{select:{mode:"dropdown",options:[{value:"box",label:l("editor.fit_box")},{value:"contents",label:l("editor.fit_contents")}]}}}]),Zi)];return n.length?e`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${n}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:e``}_repeatModeChanged(e){var t;if(e.stopPropagation(),!this._config)return;const i=null===(t=e.detail.value)||void 0===t?void 0:t.mode;if(!i)return;const s=function(e,t){if(Pi(e)===t||"other"===t)return e;const i=Object.assign({},e);if(delete i.for_each,delete i.for_each_from,"list"===t)i.for_each=[];else if("none"!==t){const s=Ni(e.for_each_from)?Object.assign({},e.for_each_from):{};for(const e of Ti)delete s[e];i.for_each_from=Object.assign({[t]:!0},s)}return i}(this._config,i);s!==this._config&&b(this,"config-changed",{config:s})}_renderRepeatBuilder(t){var i;const s=null===(i=this._config)||void 0===i?void 0:i.for_each_from,n=Ni(s);if(!n)return e``;const a=function(e){var t,i,s;const n=null!=e?e:{},a={patterns:null!==(i=Li(n[null!==(t=Ni(e))&&void 0!==t?t:"entities"]))&&void 0!==i?i:[],reverse:!0===n.reverse,entity_category:!1};for(const d of Fi){const e=Li(n[d]);e&&e.length&&(a[d]=e)}const o=null!==(s=Li(n.sort))&&void 0!==s?s:[];o[0]&&(a.sort=o[0]),o[1]&&(a.then=o[1]);const r=Ii(n.limit);void 0!==r&&(a.limit=r);const l=Ii(n.offset);void 0!==l&&(a.offset=l),"string"==typeof n.group_by&&n.group_by&&(a.group_by=n.group_by);const c=n.entity_category;return a.entity_category=!0===c||"all"===c||"string"==typeof c&&!!c||Array.isArray(c)&&c.length>0,a}(s);return e`
      <ha-form
        .hass=${this.hass}
        .data=${a}
        .schema=${function(e,t,i){const s=t=>l(t,void 0,e),n=e=>({select:{mode:"dropdown",custom_value:!0,options:[...zi,...e&&!zi.includes(e)?[e]:[]].map(e=>({value:e,label:zi.includes(e)?s(`editor.repeat.sort_${e.replace("-","desc_")}`):e}))}}),a="entities"===t,o="areas"===t,r="devices"===t;return[{name:"patterns",label:s(`editor.repeat.patterns_${t}`),helper:s("editor.repeat.patterns_helper"),selector:Wi([],null==i?void 0:i.patterns)},a&&{name:"domain",label:s("editor.repeat.domain_label"),selector:Wi(Di(e),null==i?void 0:i.domain)},(a||r)&&{name:"area",label:s("editor.repeat.area_label"),selector:{area:{multiple:!0}}},(a||o||r)&&{name:"floor",label:s("editor.repeat.floor_label"),selector:{floor:{multiple:!0}}},(a||o||r)&&{name:"label",label:s("editor.repeat.label_label"),selector:{label:{multiple:!0}}},a&&{name:"device_class",label:s("editor.repeat.device_class_label"),selector:Wi(qi(e),null==i?void 0:i.device_class)},a&&{name:"integration",label:s("editor.repeat.integration_label"),selector:Wi(Ri(e),null==i?void 0:i.integration)},{name:"exclude",label:s("editor.repeat.exclude_label"),helper:s("editor.repeat.exclude_helper"),selector:a?{entity:{multiple:!0}}:Wi([],null==i?void 0:i.exclude)},{name:"sort",label:s("editor.repeat.sort_label"),selector:n(null==i?void 0:i.sort)},{name:"then",label:s("editor.repeat.then_label"),selector:n(null==i?void 0:i.then)},{name:"reverse",label:s("editor.repeat.reverse_label"),selector:{boolean:{}}},{name:"limit",label:s("editor.repeat.limit_label"),selector:{number:{min:0,max:500,mode:"box"}}},{name:"offset",label:s("editor.repeat.offset_label"),helper:s("editor.repeat.offset_helper"),selector:{number:{min:0,max:500,mode:"box"}}},a&&{name:"group_by",label:s("editor.repeat.group_by_label"),helper:s("editor.repeat.group_by_helper"),selector:{select:{mode:"dropdown",options:Ui.map(e=>({value:e,label:s(`editor.repeat.group_${e||"none"}`)}))}}},a&&{name:"entity_category",label:s("editor.repeat.entity_category_label"),helper:s("editor.repeat.entity_category_helper"),selector:{boolean:{}}}].filter(e=>!1!==e)}(this.hass,n,a)}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._repeatBuilderChanged}
      ></ha-form>
      ${this._renderMatches(t)}
    `}_repeatBuilderChanged(e){if(e.stopPropagation(),!this._config||void 0===Ni(this._config.for_each_from))return;const t=Object.assign(Object.assign({},this._config),{for_each_from:Vi(this._config.for_each_from,e.detail.value)});b(this,"config-changed",{config:t})}_renderOtherSource(t){var i;return e`
      <p class="hint">${l("editor.repeat.other_hint",void 0,this.hass)}</p>
      <ha-yaml-editor
        .hass=${this.hass}
        .defaultValue=${null===(i=this._config)||void 0===i?void 0:i.for_each_from}
        @value-changed=${this._otherSourceChanged}
      ></ha-yaml-editor>
      ${this._renderMatches(t)}
    `}_otherSourceChanged(e){var t;if(e.stopPropagation(),!this._config||!1===(null===(t=e.detail)||void 0===t?void 0:t.isValid))return;const i=Object.assign({},this._config);M(i,"for_each_from",e.detail.value),b(this,"config-changed",{config:i})}_listItems(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.for_each;return Array.isArray(t)?t:t&&"object"==typeof t?[t]:[]}_setList(e){this._config&&b(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{for_each:e})})}_renderRepeatList(){const t=this._listItems(),i=(e,t)=>function(e){var t,i;const s=Array.isArray(e)?Object.assign({},...e.filter(e=>e&&"object"==typeof e)):e&&"object"==typeof e?e:{},n=e=>"string"==typeof e&&e.trim()?e.trim():void 0,a=Object.values(s).find(e=>"string"==typeof e&&e.trim());return null!==(i=null!==(t=n(s.name))&&void 0!==t?t:n(s.entity))&&void 0!==i?i:"string"==typeof a?a.trim():""}(e)||l("editor.repeat.list_item",{number:t+1},this.hass),s=(e,i)=>{e.preventDefault();const s=this._dragging;this._dragging=void 0,void 0!==s&&s!==i&&this._setList(be(t,s,i))};return e`
      <p class="hint">${l("editor.repeat.list_hint",void 0,this.hass)}</p>
      <ul class="items">
        ${t.map((n,a)=>e`
            <li
              draggable="true"
              @dragstart=${e=>{var t;this._dragging=a,null===(t=e.dataTransfer)||void 0===t||t.setData("text/plain",i(n,a)),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}}
              @dragover=${e=>{void 0!==this._dragging&&e.preventDefault()}}
              @drop=${e=>s(e,a)}
              @dragend=${()=>{this._dragging=void 0}}
            >
              <div class="item-row">
                <ha-svg-icon class="handle" .path=${"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"}></ha-svg-icon>
                <span class="item-name">${i(n,a)}</span>
                <span class="spacer"></span>
                <ha-icon-button
                  .path=${"M7,15L12,10L17,15H7Z"}
                  .disabled=${0===a}
                  .label=${l("editor.repeat.move_up",{name:i(n,a)},this.hass)}
                  @click=${()=>this._setList(be(t,a,a-1))}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M7,10L12,15L17,10H7Z"}
                  .disabled=${a===t.length-1}
                  .label=${l("editor.repeat.move_down",{name:i(n,a)},this.hass)}
                  @click=${()=>this._setList(be(t,a,a+1))}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"}
                  .label=${l("editor.repeat.list_edit",{name:i(n,a)},this.hass)}
                  @click=${()=>this._toggleItem(a)}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                  .label=${l("editor.repeat.list_remove",{name:i(n,a)},this.hass)}
                  @click=${()=>this._setList(function(e,t){return e.filter((e,i)=>i!==t)}(t,a))}
                ></ha-icon-button>
              </div>
              ${this._openItems.has(a)?e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${n}
                      @value-changed=${e=>{var i;e.stopPropagation(),!1!==(null===(i=e.detail)||void 0===i?void 0:i.isValid)&&this._setList(function(e,t,i){return e.map((e,s)=>s===t?i:e)}(t,a,e.detail.value))}}
                    ></ha-yaml-editor>`:e``}
            </li>
          `)}
      </ul>
      <ha-button @click=${()=>this._setList(function(e){const t=e[e.length-1],i=t&&"object"==typeof t&&!Array.isArray(t)?Object.keys(t):[],s={};for(const n of i.length?i:["entity"])s[n]="";return[...e,s]}(t))}>
        ${l("editor.repeat.list_add",void 0,this.hass)}
      </ha-button>
    `}_toggleItem(e){const t=new Set(this._openItems);t.has(e)?t.delete(e):t.add(e),this._openItems=t}_hiddenNames(e,t){var i;const s=new Set;if(!t.some(e=>void 0!==e.show_if||void 0!==e.hide_if))return s;const n=d(h(null===(i=this._config)||void 0===i?void 0:i.variables,e)),a=e=>n[e];for(const o of t)$e(o,a)||s.add(o.name);return s}_formSchema(e,t,i){if(!e.length)return this._schema;const s=new Set(this._suppliedNames(i)),n=e=>{var t;const i=s.has(e.name);return{name:Ki+e.name,label:null!==(t=e.label)&&void 0!==t?t:e.name,helper:i?l("editor.repeat.from_each_copy_helper",void 0,this.hass):e.description,selector:xe(e),required:!0===e.required&&!i,disabled:i}},a=[];for(const o of we(e.filter(e=>!D(e))))void 0===o.group?a.push(...o.declarations.map(n)):a.push({name:"",type:"expandable",title:o.group,schema:o.declarations.map(n)});return[this._schema[0],...a,...t.extras?[]:[{name:"extras",label:l("editor.extras_label",void 0,this.hass),helper:l("editor.extras_helper",void 0,this.hass),selector:{object:{}}}]]}_formData(e){var t,i,s,n,a,o,r,l,c,p,u,m;if(!e.length)return this._config;const f=d(null===(t=this._config)||void 0===t?void 0:t.variables),g=new Set(e.map(e=>e.name)),v={template:null===(i=this._config)||void 0===i?void 0:i.template};this._shownAs=new Map;const _=function(e,t,i,s){const n=new Map;if(!i||!e.length)return n;const a=d(h(t,i));for(const o of e){if(!(o in a))continue;const e=bi(a[o],t,i,s);null!=e&&""!==e&&n.set(o,e)}return n}(e.filter(e=>!(e.name in f)&&!D(e)).map(e=>e.name),null===(s=this._config)||void 0===s?void 0:s.variables,null===(n=this._templates)||void 0===n?void 0:n[null===(a=this._config)||void 0===a?void 0:a.template],this.hass);for(const d of e){if(!(d.name in f)){if(!_.has(d.name))continue;let e=_.get(d.name);"boolean"in xe(d)&&"boolean"!=typeof e&&(e=Qi.has(String(e).trim().toLowerCase())),this._shownAs.set(d.name,{shown:e,written:void 0}),v[Ki+d.name]=e;continue}const e=f[d.name];if("boolean"!=typeof e&&"boolean"in xe(d)){const t=Qi.has(String(e).trim().toLowerCase());this._shownAs.set(d.name,{shown:t,written:e}),v[Ki+d.name]=t}else v[Ki+d.name]=e}const y=H(null===(o=this._config)||void 0===o?void 0:o.variables).filter(e=>{const t=U(e);return void 0!==t&&!g.has(t)});return y.length&&(v.extras=y),void 0!==(null===(r=this._config)||void 0===r?void 0:r.columns)&&(v.columns=this._config.columns),void 0!==(null===(l=this._config)||void 0===l?void 0:l.min_column_width)&&(v.min_column_width=this._config.min_column_width),void 0!==(null===(c=this._config)||void 0===c?void 0:c.gap)&&(v.gap=this._config.gap),void 0!==(null===(p=this._config)||void 0===p?void 0:p.fit)&&(v.fit=this._config.fit),void 0!==(null===(u=this._config)||void 0===u?void 0:u.lazy)&&(v.lazy=this._config.lazy),void 0!==(null===(m=this._config)||void 0===m?void 0:m.lazy_eager)&&(v.lazy_eager=this._config.lazy_eager),v}_renderDiagnostics(t,i){var n,a,o,r,c,d,h,p,u,f,g,v,_,y,b,$,w;if(!t||this._loadingTemplates||!i||I(this._config))return e``;const x=[...this._suppliedNames(t),...s(null===(n=this._config)||void 0===n?void 0:n.rebuild_on),...ke(t,m(null===(a=this._config)||void 0===a?void 0:a.variables)),...Object.keys(Q(null!==(o=this._lovelace)&&void 0!==o?o:E()))].map(e=>({[e]:null})),{missing:k,unused:j,required:A}=je(null===(r=this._config)||void 0===r?void 0:r.variables,t,x,[null===(c=this._config)||void 0===c?void 0:c.for_each_from,null===(d=this._config)||void 0===d?void 0:d.on_error],Ae(t,Q(null!==(h=this._lovelace)&&void 0!==h?h:E()))),S=Se(null===(p=this._config)||void 0===p?void 0:p.variables,t,this.hass),O=this._hiddenNames(t,P(t)),C=A.filter(e=>!O.has(e)),T=k.filter(e=>!A.includes(e)&&!O.has(e)),N=new Set(H(null===(u=this._config)||void 0===u?void 0:u.variables).map(U)),L=[...O].filter(e=>N.has(e)),M=Xi.test(`${null!==(f=t.style)&&void 0!==f?f:""}\n${null!==(v=null===(g=this._config)||void 0===g?void 0:g.style)&&void 0!==v?v:""}`),V="contents"===(null===(_=this._config)||void 0===_?void 0:_.fit)&&M,D=Number(null===(y=this._config)||void 0===y?void 0:y.columns),q=(void 0!==(null===(b=this._config)||void 0===b?void 0:b.for_each)||void 0!==(null===($=this._config)||void 0===$?void 0:$.for_each_from))&&D>1&&!(Number(null===(w=this._config)||void 0===w?void 0:w.min_column_width)>0),R=F(t),z=Oe(this._config,R);return e`
      ${z.map(t=>{var i,s;return e`<ha-alert alert-type="warning">
            ${l("editor.override_misplaced",{key:t,kind:R,template:null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""},this.hass)}
          </ha-alert>`})}
      ${q?e`<ha-alert alert-type="info">
              ${l("editor.columns_without_min_width",{columns:D},this.hass)}
            </ha-alert>`:e``}
      ${V?e`<ha-alert alert-type="warning">${l("editor.fit_hides_style",void 0,this.hass)}</ha-alert>`:e``}
      ${L.length?e`<ha-alert alert-type="warning">
              ${l(1===L.length?"editor.hidden_but_set_one":"editor.hidden_but_set_many",{names:L.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${C.length?e`<ha-alert alert-type="error">
              ${l(1===C.length?"editor.required_one":"editor.required_many",{names:C.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${T.length?e`<ha-alert alert-type="warning">
              ${l(1===T.length?"editor.optional_one":"editor.optional_many",{names:T.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${S.map(t=>e`<ha-alert alert-type="warning">
            ${l("editor.invalid_value",{name:t.name,expected:t.expected},this.hass)}
          </ha-alert>`)}
      ${j.length?e`<ha-alert alert-type="info">
              ${l(1===j.length?"editor.unused_one":"editor.unused_many",{names:j.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_valueChanged(e){var t,i;const s=e.detail.value,n=P(null===(t=this._templates)||void 0===t?void 0:t[s.template]);if(!n.length)return void b(this,"config-changed",{config:s});const a=[];for(const l of n){let e=s[Ki+l.name];const t=this._shownAs.get(l.name);t&&$i(e,t.shown)&&(e=t.written),void 0!==e&&""!==e&&a.push({[l.name]:e})}Array.isArray(s.extras)&&a.push(...s.extras);const o=Object.assign(Object.assign({},this._config),{template:s.template}),r=Ce(H(null===(i=this._config)||void 0===i?void 0:i.variables),a);r.length?o.variables=r:delete o.variables,M(o,"columns",s.columns),M(o,"min_column_width",s.min_column_width),M(o,"gap",s.gap),M(o,"lazy",!0===s.lazy||void 0),M(o,"lazy_eager",s.lazy_eager),b(this,"config-changed",{config:o})}_loadBorrowedTemplates(){if(!Ee(this._lovelace))return;this._loadingTemplates=!0;const e=this._editingPlace();Te(this.hass,this._lovelace,e.view,void 0,e.section).then(e=>{this._templates=e,this._schema=void 0}).finally(()=>{this._loadingTemplates=!1,this.requestUpdate()})}}f([v()],es.prototype,"_lovelace",void 0),f([v()],es.prototype,"_config",void 0),f([g()],es.prototype,"hass",void 0),f([v()],es.prototype,"_loadingTemplates",void 0),f([v()],es.prototype,"_ejectPending",void 0),f([v()],es.prototype,"_sectionsPending",void 0),f([v()],es.prototype,"_sectionsError",void 0),f([v()],es.prototype,"_onErrorMode",void 0),f([v()],es.prototype,"_previewMode",void 0),f([v()],es.prototype,"_copied",void 0),f([v()],es.prototype,"_cannotOpen",void 0),f([v()],es.prototype,"_resume",void 0),f([v()],es.prototype,"_matchesOpen",void 0),f([v()],es.prototype,"_byDomainDraft",void 0),f([v()],es.prototype,"_openItems",void 0),f([v()],es.prototype,"_renderedTemplates",void 0);const ts=/^[a-z_]+\.[a-z0-9_]+$/,is={base:"entity",label:"Entity",selector:{entity:{}},matches:e=>ts.test(e)};function ss(e,t){return{base:e,label:t,selector:{text:{}},matches:e=>e.trim().length>0}}const ns={entity:is,entity_id:is,name:ss("name","Name"),title:ss("title","Title"),heading:ss("heading","Heading"),icon:{base:"icon",label:"Icon",selector:{icon:{}},matches:e=>e.includes(":")}};function as(e,t){return 1===t?e.label:`${e.label} ${t}`}const os=(e,t=200)=>{if("number"==typeof e&&(e=String(e)),"string"!=typeof e)return;const i=e.trim();return i?i.length>t?`${i.slice(0,t-1)}…`:i:void 0};function rs(e){const t=os(e,2e3);if(t&&/^https?:\/\/[^\s/]+/i.test(t))return t}const ls=e=>[].concat(null!=e?e:[]).map(e=>os(e)).filter(e=>!!e).slice(0,50);function cs(e){if("string"==typeof e){const t=os(e);return t?{name:t}:void 0}if(!e||"object"!=typeof e||Array.isArray(e))return;const t=e,i=os(t.github),s={name:os(t.name),github:i&&/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(i)?i:void 0,email:os(t.email),url:rs(t.url)};for(const n of Object.keys(s))void 0===s[n]&&delete s[n];return Object.keys(s).length?s:void 0}function ds(e){const t=e&&"object"==typeof e?e:{},i={author:cs(t.author),license:os(t.license),help:rs(t.help),homepage:rs(t.homepage),readme:os(t.readme,8e3),related:ls(t.related),setup:ls(t.setup)};for(const s of["author","license","help","homepage","readme"])void 0===i[s]&&delete i[s];return i}const hs=["author","license","help","homepage","readme","requires","setup","related"];function ps(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);for(const i of hs)delete t[i];return t}const us={integrations:{kind:"integration",key:"integration"},entities:{kind:"entity",key:"entity"},custom_cards:{kind:"custom_card",key:"card"}},ms=e=>{const t=os(e,40);return t&&t.replace(/\+$/,"").trim()||void 0};function fs(e){var t;const i=null==e?void 0:e.requires;if(!i||"object"!=typeof i||Array.isArray(i))return[];const s=[];for(const[n,{kind:a,key:o}]of Object.entries(us))for(const e of[].concat(null!==(t=i[n])&&void 0!==t?t:[]).slice(0,50)){const t=e&&"object"==typeof e&&!Array.isArray(e)?e:void 0,i=ls(t?t[o]:e).map(e=>"custom_card"===a?e.replace(/^custom:/,""):e);if(!i.length)continue;const n=t?os(t.message,300):void 0;s.push(n?{kind:a,any:i,message:n}:{kind:a,any:i})}for(const n of["homeassistant","card"]){const e=ms(i[n]);e&&s.push({kind:n,any:[e]})}return s}function gs(e,t){var i,s;const n=e=>e.split(".").map(e=>parseInt(e,10)||0),a=n(e),o=n(t);for(let r=0;r<Math.max(a.length,o.length);r++){const e=null!==(i=a[r])&&void 0!==i?i:0,t=null!==(s=o[r])&&void 0!==s?s:0;if(e!==t)return e>t}return!0}function vs(e,t){switch(e.kind){case"integration":{const i=new Set;for(const e of t.components)i.add(e),i.add(e.split(".").pop());return e.any.some(e=>i.has(e))}case"entity":return e.any.some(e=>{const i=function(e){const t=e.replace(/[.+?^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*");return new RegExp(`^${t}$`,"i")}(e);return t.entities.some(e=>i.test(e))});case"custom_card":return e.any.some(e=>t.isDefined(e));case"homeassistant":return!t.homeassistant||gs(t.homeassistant,e.any[0]);case"card":return t.card.startsWith("0.0.0")||gs(t.card,e.any[0])}}function _s(e,t){const i=Ne(e),s=Array.isArray(i)?i.filter(e=>e&&"object"==typeof e):i&&"object"==typeof i?Object.entries(i).map(([e,t])=>({[e]:t})):[],n=s.find(e=>Object.prototype.hasOwnProperty.call(e,t)),a=null==n?void 0:n[t];return"string"==typeof a||"number"==typeof a?String(a):void 0}function ys(e,t){const i=ds(e).setup.filter(e=>"string"==typeof t[e]&&""!==t[e]);if(!i.length)return e;const s=Ne(e),n=(Array.isArray(s)?s.filter(e=>e&&"object"==typeof e):s&&"object"==typeof s?Object.entries(s).map(([e,t])=>({[e]:t})):[]).filter(e=>!i.some(t=>Object.prototype.hasOwnProperty.call(e,t))),a=Object.assign(Object.assign({},e),{default:[...i.map(e=>({[e]:t[e]})),...n]});return delete a[Pe],a}const bs={integrations:"requires_integrations",entities:"requires_entities",custom_cards:"requires_custom_cards"},$s=e=>"string"==typeof e?e:"number"==typeof e?String(e):void 0,ws=e=>[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);const xs=e=>"string"==typeof e&&e.trim()?e.trim():void 0,ks=e=>[].concat(null!=e?e:[]).map(xs).filter(e=>!!e);const js=[Ie,Fe,...Me],As=["card","badge","row","element","group"],Ss=["type","template","description","author","license","help","homepage","readme","requires","setup","related","variables","default",...As,"style"];function Os(e,t){if(Array.isArray(e))for(const i of e)Os(i,t);else if(e&&"object"==typeof e){t(e);for(const i of Object.values(e))Os(i,t)}}function Cs(e){const t=new Set,i=new Set;Os(e,e=>{const s=e.type;if("string"==typeof s){s.startsWith("custom:")&&!js.includes(s)&&t.add(s);for(const t of Ve(e))i.add(t)}});for(const s of Le(e))i.add(s);return{customTypes:[...t].sort(),templateRefs:[...i].sort()}}function Es(e,t){const i=e&&"object"==typeof e&&void 0!==e[Pe]?Object.assign(Object.assign({},e),{default:Ne(e)}):e,s={};for(const l of Ss)void 0!==(null==i?void 0:i[l])&&(s[l]=i[l]);for(const l of Object.keys(null!=i?i:{}))l in s||l===Pe||"source"===l||(s[l]=i[l]);const{customTypes:n,templateRefs:a}=Cs(e),o=[];if(t){const i={},n=[...a],r=null==e?void 0:e.template,l=new Set(ds(e).related.filter(e=>e!==r));for(n.push(...l);n.length;){const e=n.shift();if(e in i)continue;const s=t[e];if(s){i[e]=Ts(s),n.push(...Cs(s).templateRefs);for(const e of ds(s).related)e===r||l.has(e)||(l.add(e),n.push(e))}else l.has(e)||o.push(e)}Object.keys(i).length&&(s.includes=i)}else o.push(...a);const r=[];n.length&&r.push(l("share.requires_custom_cards",{types:n.join(", ")})),o.length&&r.push(l("share.uses_other_templates",{names:o.join(", ")}));const c=function(e){const t=null==e?void 0:e.requires;return t&&"object"==typeof t?["homeassistant","card"].filter(e=>"number"==typeof t[e]):[]}(e);return c.length&&r.push(l("share.version_unquoted",{keys:c.join(", ")})),{payload:s,notes:r}}function Ts(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);return delete t.source,t}function Ns(e,t){if(!t.includes(e))return e;let i=2;for(;t.includes(`${e}_${i}`);)i+=1;return`${e}_${i}`}function Ps(e){if(!e||"object"!=typeof e||Array.isArray(e))return{ok:!1,errors:[l("share.import_not_a_template")]};const t=[];"string"==typeof e.template&&e.template.trim()||t.push(l("share.import_no_name"));const i=As.filter(t=>void 0!==e[t]);return 0===i.length?t.push(l("share.import_defines_nothing")):i.length>1&&t.push(l("share.import_defines_both",{first:i[0],second:i[1]})),{ok:0===t.length,errors:t}}function Ls(e,t){const i=new Set;for(const s of e)for(const e of Cs(s).customTypes){const s=e.slice(7);s&&!t(s)&&i.add(s)}return[...i].sort()}const Is=["card","badge","row","element","group"],Fs=/^[A-Za-z0-9_-]+$/,Ms=/^[a-z_]+\.[a-z0-9_]+$/;function Vs(e){return Is.find(t=>void 0!==(null==e?void 0:e[t])&&null!==(null==e?void 0:e[t]))}function Hs(e){return e.map(e=>"number"==typeof e?`#${e+1}`:e).join(" › ")}function Ds(e){const t=new Set;for(const n of He(null==e?void 0:e.variables))n&&"string"==typeof n.name&&t.add(n.name);const i=JSON.stringify(null!=e?e:{}),s=/\[\[([A-Za-z0-9_-]+)/g;for(let n=s.exec(i);n;n=s.exec(i))t.add(n[1]);return[...t]}function qs(e){return"boolean"==typeof e?"boolean":"number"==typeof e?"number":"string"==typeof e&&Ms.test(e)?"entity":"string"==typeof e&&/^[a-z]+:[a-z0-9-]+$/.test(e)?"icon":"text"}function Rs(e,t,i){if(!t.length)return i;const[s,...n]=t;return Array.isArray(e)?e.map((e,t)=>t===s?Rs(e,n,i):e):Object.assign(Object.assign({},e),{[s]:Rs(null==e?void 0:e[s],n,i)})}const zs=["card","badge","row","element","group","style","let","default","grid_options","name"],Us="default:",Ws="or:";function Bs(e){return e.startsWith(Ws)?e.slice(3):ze(e)}function Ks(e,t,i){if(!e.includes("[[")&&!e.includes("]]"))return;const s=function(e){let t=0,i=!1;for(let s=0;s<e.length-1;s+=1){const n=e.slice(s,s+2);"[["===n?(t+=1,s+=1):"]]"===n&&(0===t?i=!0:t-=1,s+=1)}return{unclosed:t>0,stray:i}}(e);s.unclosed&&i.findings.push({level:"warning",key:"lint.unclosed",params:{},path:t}),s.stray&&i.findings.push({level:"warning",key:"lint.stray_close",params:{},path:t});let n=e;for(let a=0;a<5;a+=1){let e=!1;if(n=n.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(s,n)=>(e=!0,n.startsWith(We)||Js(n,t,i),"_")),!e)break}}function Js(e,t,i){const s=e.endsWith("?")?e.slice(0,-1):e,[n,...a]=s.split("|"),o=`[[${e}]]`,r=(n.endsWith("?")?n.slice(0,-1):n).split(".")[0];r&&"_"!==r&&!i.heads.has(r)&&i.heads.set(r,t);let l=!1;for(const c of a){if(!Be(c)){const e=Ke(c);i.findings.push({level:"warning",key:"lint.unknown_step",params:e?{step:c,placeholder:o,closest:e}:{step:c,placeholder:o},path:t});continue}(c.startsWith(Us)||c.startsWith(Ws))&&l&&i.findings.push({level:"warning",key:"lint.after_default",params:{step:c,placeholder:o},path:t}),c.startsWith(Us)&&c.length>8&&(l=!0);const e=Bs(c);e&&"_"!==e&&i.targets.push({name:e,placeholder:o,path:t})}}function Ys(e,t,i){if("string"!=typeof e){if(Array.isArray(e))e.forEach((e,s)=>Ys(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,n]of Object.entries(e))Ks(s,t,i),Ys(n,t?`${t}.${s}`:s,i)}else Ks(e,t,i)}function Zs(e){const t=new Set;for(const i of P(e))t.add(i.name);for(const i of[...m(Ne(e)),...m(null==e?void 0:e.let)]){const e=U(i);void 0!==e&&t.add(e)}return[...t]}function Gs(e,t=[]){if(!e||"object"!=typeof e)return[];const i={findings:[],heads:new Map,targets:[]};for(const c of zs){const t=e[c];void 0!==t&&Ys(t,c,i)}P(e).forEach((e,t)=>{void 0!==e.default&&Ys(e.default,`variables[${t}].default`,i);for(const s of["show_if","hide_if"]){const n=`variables[${t}].${s}`;for(const t of qe(e,s)){const e=t.slice(3);if(!Re(t)){i.findings.push({level:"warning",key:"lint.condition_malformed",params:{key:s,condition:e},path:n});continue}const a=ze(t);a&&i.targets.push({name:a.split(".")[0],placeholder:`${s}: ${e}`,path:n})}}});const s=new Set([...Zs(e),...t,...ve,...ke(e)]),n=[...i.findings],a=e=>s.has(e)||i.heads.has(e),o=e=>a(e)||e.split(".").some((e,t,i)=>t>0&&a(i.slice(0,t).join(".")));for(const d of i.targets){if(o(d.name))continue;const e=c(d.name,[...s,...i.heads.keys()]);n.push({level:"warning",key:"lint.target_unknown",params:e?{name:d.name,placeholder:d.placeholder,closest:e}:{name:d.name,placeholder:d.placeholder},path:d.path})}const r=[...i.heads.entries()].filter(([e])=>!s.has(e));r.length&&n.push({level:"info",key:"lint.undeclared",params:{names:r.map(([e,t])=>r.length>1?`${e} (${t})`:e).join(", ")},path:r.length>1?"":r[0][1]});for(const d of function(e){return vi(e).filter(e=>!fi.includes(e)).map(e=>{const t=c(e,fi);return t?{name:e,closest:t}:{name:e}})}(e))n.push({level:"warning",key:"lint.editor_hide_unknown",params:Object.assign({},d),path:"editor_hide"});for(const c of Ue(e.strict))n.push({level:"warning",key:"lint.strict_unknown",params:c,path:"strict"});const l=new Set;return n.filter(e=>{const t=JSON.stringify([e.key,e.params,e.path]);return!l.has(t)&&(l.add(t),!0)})}const Qs={card:{type:"entity",entity:"sun.sun"},badge:{type:"entity",entity:"sun.sun"},row:{entity:"sun.sun"},element:{type:"icon",icon:"mdi:weather-sunny",style:{color:"yellow"}}},Xs=50,en=e=>!!customElements.get(e),tn=e=>e.actions.length>0||e.urls.length>0||e.embeds||e.scripts||e.placeholders||e.overlay;const sn=500,nn="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z";function an(t){const i=e=>{var i;return t.onInput(null!==(i=e.target.value)&&void 0!==i?i:"")},s=e=>{var i;return null===(i=t.onKeydown)||void 0===i?void 0:i.call(t,e)};return en("ha-input")?e`<ha-input
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
      ></ha-textfield>`}async function on(e,t,i,s){var n;if(!te())return e._toolError=l("tools.cannot_save_here",void 0,e.hass),!1;e._busy=!0,e._toolError=void 0;try{return await se(e,e.hass,i,[{urlPath:ae(),build:t}],s),e._undoChanged=void 0,!0}catch(a){return e._toolError=l("tools.save_failed",{message:null!==(n=null==a?void 0:a.message)&&void 0!==n?n:a},e.hass),!1}finally{e._busy=!1}}const rn=y`
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

  ${Ye.styles}
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
 */,ln=2,cn=e=>(...t)=>({_$litDirective$:e,values:t});let dn=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:hn}=Ze,pn=e=>e,un=()=>document.createComment(""),mn=(e,t,i)=>{const s=e._$AA.parentNode,n=void 0===t?e._$AB:t._$AA;if(void 0===i){const t=s.insertBefore(un(),n),a=s.insertBefore(un(),n);i=new hn(t,a,e,e.options)}else{const t=i._$AB.nextSibling,a=i._$AM,o=a!==e;if(o){let t;i._$AQ?.(e),i._$AM=e,void 0!==i._$AP&&(t=e._$AU)!==a._$AU&&i._$AP(t)}if(t!==n||o){let e=i._$AA;for(;e!==t;){const t=pn(e).nextSibling;pn(s).insertBefore(e,n),e=t}}}return i},fn=(e,t,i=e)=>(e._$AI(t,i),e),gn={},vn=(e,t=gn)=>e._$AH=t,_n=e=>{e._$AR(),e._$AA.remove()},yn=cn(class extends dn{constructor(){super(...arguments),this.key=Ge}render(e,t){return this.key=e,t}update(e,[t,i]){return t!==this.key&&(vn(e),this.key=t),i}}),bn=[{name:"room_light_tile",summary:"A tile per light, with the light named after itself.",template:{description:"A tile for one light, taking its name from Home Assistant.",variables:[{name:"entity",label:"Light",selector:{entity:{domain:"light"}},required:!0},{name:"name",label:"Name",description:"Leave empty to use the light’s own name",selector:{text:{}}}],card:{type:"tile",entity:"[[entity]]",name:"[[name|or:entity|friendly_name]]",features:[{type:"light-brightness"}]}}},{name:"room_summary",summary:"A heading per area, listing the lights in it. Uses grouping.",template:{description:"One card per area, with a tile for every light in that area.",card:{type:"vertical-stack",cards:[{type:"markdown",content:"## [[area]]\n\n[[entity_count]] lights"},{type:"custom:decluttering-card-plus",template:"room_light_tile",for_each:"[[items]]"}]}}},{name:"sensor_line",summary:"An Entities row showing one sensor with its area.",template:{description:"A row for one sensor, labelled with the area it is in.",variables:[{name:"entity",label:"Sensor",selector:{entity:{}},required:!0}],row:{entity:"[[entity]]",name:"[[entity|friendly_name]] ([[entity|area|default:no area]])"}}},{name:"status_badge",summary:"A badge that only appears when something needs attention.",template:{description:"A badge for one entity, hidden unless it is in the state you care about.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0},{name:"when",label:"Show when the state is",selector:{text:{}},default:"on"}],badge:{type:"entity",entity:"[[entity]]",visibility:[{condition:"state",entity:"[[entity]]",state:"[[when]]"}]}}},{name:"counted_grid",summary:'A numbered grid of anything, showing "3 of 12".',template:{description:"A tile that knows where it sits in a repeat.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0}],card:{type:"tile",entity:"[[entity]]",name:"[[entity|friendly_name]]",footer:{type:"markdown",content:"[[index]] of [[total|or:count]]"}}}}];
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $n(e){return bn.find(t=>t.name===e)}function wn(e,t){const i=new Set,s=e=>{Array.isArray(e)?e.forEach(s):e&&"object"==typeof e&&("string"==typeof e.type&&e.type.includes("decluttering-card")&&"string"==typeof e.template&&i.add(e.template),Object.values(e).forEach(s))};return s(e.template),[...i].filter(e=>!t.includes(e))}function xn(e,t){return{library:e,version:t}}
/*! js-yaml 5.5.0 https://github.com/nodeca/js-yaml @license MIT */var kn=Symbol("NOT_RESOLVED");function jn(e,t){return{tagName:e,nodeKind:"scalar",implicit:t.implicit??!1,matchByTagPrefix:t.matchByTagPrefix??!1,implicitFirstChars:t.implicitFirstChars??null,resolve:t.resolve,identify:t.identify,represent:t.represent??(e=>String(e)),representTagName:t.representTagName??(()=>e)}}function An(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"sequence",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addItem:t.addItem,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}function Sn(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"mapping",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addPair:t.addPair,has:t.has,keys:t.keys,get:t.get,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}var On=jn("tag:yaml.org,2002:str",{resolve:e=>e,identify:e=>"string"==typeof e}),Cn=["","~","null","Null","NULL"],En=jn("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==Cn.indexOf(e)?null:kn,identify:e=>null===e,represent:()=>"null"}),Tn=jn("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(e,t)=>"null"===e||t&&""===e?null:kn,identify:e=>null===e,represent:()=>"null"}),Nn=["","~","null","Null","NULL"],Pn=jn("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==Nn.indexOf(e)?null:kn,identify:e=>null===e,represent:()=>"null"}),Ln=["true","True","TRUE"],In=["false","False","FALSE"],Fn=jn("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:e=>-1!==Ln.indexOf(e)||-1===In.indexOf(e)&&kn,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Mn=["true"],Vn=["false"],Hn=jn("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:e=>-1!==Mn.indexOf(e)||-1===Vn.indexOf(e)&&kn,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Dn=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],qn=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],Rn=jn("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:e=>-1!==Dn.indexOf(e)||-1===qn.indexOf(e)&&kn,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),zn=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),Un=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var Wn=jn("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e,t){if(t){if(!Un.test(e))return kn}else if(!zn.test(e))return kn;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:kn},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),Bn=new RegExp("^-?(?:0|[1-9][0-9]*)$"),Kn=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var Jn=jn("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!Kn.test(e))return kn}else if(!Bn.test(e))return kn;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:kn},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),Yn=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$");var Zn=jn("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e){if(!Yn.test(e))return kn;const t=function(e){let t=e.replace(/_/g,""),i=1;if("-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b"))return i*parseInt(t.slice(2),2);if(t.startsWith("0x"))return i*parseInt(t.slice(2),16);if(t.includes(":")){let e=0;for(const i of t.split(":"))e=60*e+Number(i);return i*e}return"0"!==t&&"0"===t[0]?i*parseInt(t,8):i*parseInt(t,10)}(e);return Number.isFinite(t)?t:kn},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),Gn=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),Qn=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var Xn=jn("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!Gn.test(e))return kn;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const s=i*parseFloat(t);return Number.isFinite(s)||Qn.test(e)?s:kn},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),ea=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),ta=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var ia=jn("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!ta.test(e))return kn;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const s=i*parseFloat(t);return Number.isFinite(s)?s:kn}if(!ea.test(e))return kn;const i=Number(e);return Number.isFinite(i)?i:kn},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),sa=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),na=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var aa=jn("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!sa.test(e))return kn;let t=e.toLowerCase().replace(/_/g,"");const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;let s=0;if(t.includes(":")){for(const e of t.split(":"))s=60*s+Number(e);s*=i}else s=i*parseFloat(t);return Number.isFinite(s)||na.test(e)?s:kn},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),oa=jn("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(e,t)=>"<<"===e||t&&""===e?"<<":kn,identify:()=>!1}),ra=/^[A-Za-z0-9+/]*={0,2}$/;var la=jn("tag:yaml.org,2002:binary",{resolve:function(e){const t=e.replace(/\s/g,"");if(t.length%4!=0||!ra.test(t))return kn;const i=atob(t),s=new Uint8Array(i.length);for(let n=0;n<i.length;n++)s[n]=i.charCodeAt(n);return s},identify:e=>"[object Uint8Array]"===Object.prototype.toString.call(e),represent:function(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t)}}),ca=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),da=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function ha(e,t,i,s=0,n=0,a=0,o=0){const r=new Date(Date.UTC(e,t,i,s,n,a,o));return r.setUTCFullYear(e,t,i),r}var pa=jn("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(e){let t=ca.exec(e);if(null===t&&(t=da.exec(e)),null===t)return kn;const i=+t[1],s=+t[2]-1,n=+t[3];if(!t[4]){const e=ha(i,s,n);return e.getUTCFullYear()!==i||e.getUTCMonth()!==s||e.getUTCDate()!==n?kn:e}const a=+t[4],o=+t[5],r=+t[6];let l=0;if(a>23||o>59||r>59)return kn;if(t[7]){let e=t[7].slice(0,3);for(;e.length<3;)e+="0";l=+e}const c=ha(i,s,n,a,o,r,l);if(c.getUTCFullYear()!==i||c.getUTCMonth()!==s||c.getUTCDate()!==n)return kn;if(t[9]){const e=+t[10],i=+(t[11]||0);if(e>23||i>59)return kn;const s=6e4*(60*e+i);c.setTime(c.getTime()-("-"===t[9]?-s:s))}return c},identify:e=>e instanceof Date,represent:e=>e.toISOString()}),ua=An("tag:yaml.org,2002:seq",{create:()=>[],addItem:(e,t)=>{e.push(t)},identify:Array.isArray});function ma(e){if(null===e||"object"!=typeof e||Array.isArray(e))return!1;const t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}function fa(e,t){const i={};for(const s of t)void 0!==e[s]&&(i[s]=e[s]);return i}var ga=An("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(e,t)=>{let i;if(t instanceof Map){if(1!==t.size)return"cannot resolve an ordered map item";i=t.keys().next().value}else{if(!ma(t))return"cannot resolve an ordered map item";{const e=Object.keys(t);if(1!==e.length)return"cannot resolve an ordered map item";i=e[0]}}return e.seen.has(i)?"duplicate key in ordered map":(e.seen.add(i),e.list.push(t),"")},finalize:e=>e.list,identify:()=>!1}),va=An("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(e,t)=>{if(t instanceof Map)return 1!==t.size?"cannot resolve a pairs item":(e.push(t.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(t))return"cannot resolve a pairs item";const i=t,s=Object.keys(i);return 1!==s.length?"cannot resolve a pairs item":(e.push([s[0],i[s[0]]]),"")},identify:()=>!1}),_a=Sn("tag:yaml.org,2002:map",{create:()=>({}),identify:ma,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{if(null!==t&&"object"==typeof t)return"object-based map does not support complex keys";const s=String(t);return"__proto__"===s?Object.defineProperty(e,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[s]=i,""},has:(e,t)=>(null===t||"object"!=typeof t)&&Object.prototype.hasOwnProperty.call(e,String(t)),keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}}),ya=Sn("tag:yaml.org,2002:set",{create:()=>new Set,identify:e=>e instanceof Set,represent:e=>{const t=new Map;for(const i of e)t.set(i,null);return t},addPair:(e,t,i)=>null!==i?"cannot resolve a set item":(e.add(t),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:()=>null});var ba=class e{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(e){const t=function(e){const t=[];for(const i of e){let e=t.length;for(let s=0;s<t.length;s++){const n=t[s];if(n.nodeKind===i.nodeKind&&n.tagName===i.tagName&&n.matchByTagPrefix===i.matchByTagPrefix){e=s;break}}t[e]=i}return t}(e),i=[],s={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},n={scalar:[],sequence:[],mapping:[]};for(const c of t){if("scalar"===c.nodeKind&&c.implicit){if(c.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(c)}switch(c.nodeKind){case"scalar":c.matchByTagPrefix?n.scalar.push(c):s.scalar[c.tagName]=c;break;case"sequence":c.matchByTagPrefix?n.sequence.push(c):s.sequence[c.tagName]=c;break;case"mapping":c.matchByTagPrefix?n.mapping.push(c):s.mapping[c.tagName]=c}}const a=i.filter(e=>null===e.implicitFirstChars),o=new Set;for(const c of i)if(null!==c.implicitFirstChars)for(const e of c.implicitFirstChars)o.add(e);const r=new Map;for(const c of o)r.set(c,i.filter(e=>null===e.implicitFirstChars||-1!==e.implicitFirstChars.indexOf(c)));const l=s.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=t,this.implicitScalarTags=i,this.implicitScalarByFirstChar=r,this.implicitScalarAnyFirstChar=a,this.defaultScalarTag=l,this.defaultSequenceTag=s.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=s.mapping["tag:yaml.org,2002:map"],this.exact=s,this.prefix=n}lookupScalarTag(e){const t=this.exact.scalar[e];if(t)return t;for(const i of this.prefix.scalar)if(e.startsWith(i.tagName))return i}lookupSequenceTag(e){const t=this.exact.sequence[e];if(t)return t;for(const i of this.prefix.sequence)if(e.startsWith(i.tagName))return i}lookupMappingTag(e){const t=this.exact.mapping[e];if(t)return t;for(const i of this.prefix.mapping)if(e.startsWith(i.tagName))return i}resolveImplicitScalarTag(e){const t=this.implicitScalarByFirstChar.get(e.charAt(0))??this.implicitScalarAnyFirstChar;for(const s of t){const t=s.resolve(e,!1,s.tagName);if(t!==kn)return{value:t,tag:s}}const i=this.defaultScalarTag;return{value:i.resolve(e,!1,i.tagName),tag:i}}withTags(...t){let i=[];for(const e of t)i=i.concat(e);return new e([...this.tags,...i])}},$a=new ba([On,ua,_a]);new ba([...$a.tags,Tn,Hn,Jn,ia]);var wa=new ba([...$a.tags,En,Fn,Wn,Xn]);function xa(e){if(Array.isArray(e)){const t=Array.prototype.slice.call(e);for(let e=0;e<t.length;e++){if(Array.isArray(t[e]))return null;"object"==typeof t[e]&&"[object Object]"===Object.prototype.toString.call(t[e])&&(t[e]="[object Object]")}return String(t)}return"object"==typeof e&&"[object Object]"===Object.prototype.toString.call(e)?"[object Object]":String(e)}new ba([...$a.tags,Pn,Rn,Zn,aa,pa,oa,la,ga,va,ya]).withTags({...Zn,resolve:(e,t,i)=>{const s=Zn.resolve(e,t,i);return s===kn?Wn.resolve(e,t,i):s}},{...aa,resolve:(e,t,i)=>{const s=aa.resolve(e,t,i);return s===kn?Xn.resolve(e,t,i):s}}),Sn("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(e,t,i)=>(e.set(t,i),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:(e,t)=>e.get(t),identify:e=>e instanceof Map||ma(e),represent:e=>{if(e instanceof Map)return e;const t=new Map,i=e;for(const s of Object.keys(i))t.set(s,i[s]);return t}}),Sn("tag:yaml.org,2002:map",{create:()=>({}),identify:ma,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{const s=xa(t);return null===s?"nested arrays are not supported inside keys":("__proto__"===s?Object.defineProperty(e,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[s]=i,"")},has:(e,t)=>{const i=xa(t);return null!==i&&Object.prototype.hasOwnProperty.call(e,i)},keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}});var ka={maxLength:79,indent:1,linesBefore:3,linesAfter:2};function ja(e,t,i,s,n){let a="",o="";const r=Math.floor(n/2)-1;return s-t>r&&(a=" ... ",t=s-r+a.length),i-s>r&&(o=" ...",i=s+r-o.length),{str:a+e.slice(t,i).replace(/\t/g,"→")+o,pos:s-t+a.length}}function Aa(e,t){return" ".repeat(Math.max(t-e.length,0))+e}function Sa(e,t){let i="";return e.mark?(e.mark.name&&(i+=`in "${e.mark.name}" `),i+=`(${e.mark.line+1}:${e.mark.column+1})`,!t&&e.mark.snippet&&(i+=`\n\n${e.mark.snippet}`),`${e.reason} ${i}`):e.reason}var Oa=class e extends Error{reason;mark;constructor(e,t){super(),this.name="YAMLException",this.reason=e,this.mark=t,this.message=Sa(this,!1),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}toString(e){return`${this.name}: ${Sa(this,e)}`}static throwAt(t,i,s,n=""){let a=0,o=0;for(let e=0;e<i;e++){const i=t.charCodeAt(e);10===i?(a++,o=e+1):13===i&&(a++,10===t.charCodeAt(e+1)&&e++,o=e+1)}const r={name:n,buffer:t,position:i,line:a,column:i-o};throw r.snippet=function(e,t){if(!e.buffer)return null;const i={...ka,...t},s=/\r?\n|\r|\0/g,n=[0],a=[];let o,r=-1;for(;o=s.exec(e.buffer);)a.push(o.index),n.push(o.index+o[0].length),e.position<=o.index&&r<0&&(r=n.length-2);r<0&&(r=n.length-1);let l="";const c=Math.min(e.line+i.linesAfter,a.length).toString().length,d=i.maxLength-(i.indent+c+3);for(let p=1;p<=i.linesBefore&&!(r-p<0);p++){const t=ja(e.buffer,n[r-p],a[r-p],e.position-(n[r]-n[r-p]),d);l=`${" ".repeat(i.indent)}${Aa((e.line-p+1).toString(),c)} | ${t.str}\n${l}`}const h=ja(e.buffer,n[r],a[r],e.position,d);l+=`${" ".repeat(i.indent)}${Aa((e.line+1).toString(),c)} | ${h.str}\n`,l+=`${"-".repeat(i.indent+c+3+h.pos)}^\n`;for(let p=1;p<=i.linesAfter&&!(r+p>=a.length);p++){const t=ja(e.buffer,n[r+p],a[r+p],e.position-(n[r]-n[r+p]),d);l+=`${" ".repeat(i.indent)}${Aa((e.line+p+1).toString(),c)} | ${t.str}\n`}return l.replace(/\n$/,"")}(r),new e(s,r)}},Ca=1,Ea=2,Ta=3,Na=4,Pa=5,La=6,Ia=1,Fa=2,Ma=3,Va=4,Ha=5,Da=1,qa=2,Ra=1,za=2,Ua=3;function Wa(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}var Ba=new Array(256),Ka=new Array(256);for(let $c=0;$c<256;$c++)Ba[$c]=Wa($c)?1:0,Ka[$c]=Wa($c);function Ja(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function Ya(e){return e>=48&&e<=57?e-48:(32|e)-97+10}function Za(e){return 120===e?2:117===e?4:8}function Ga(e,t,i){let s=0;for(;t<i;){const i=e.charCodeAt(t);if(10===i)s++,t++;else if(13===i)s++,t++,10===e.charCodeAt(t)&&t++;else{if(32!==i&&9!==i)break;t++}}return{position:t,breaks:s}}function Qa(e){return 1===e?" ":"\n".repeat(e-1)}function Xa(e,t,i,s,n,a){const o=s<0?0:s,r=e.slice(t,i).replace(/\r\n?/g,"\n"),l=""===r?[]:(r.endsWith("\n")?r.slice(0,-1):r).split("\n");let c="",d=!1,h=0,p=!1;for(const u of l){let e=0;for(;e<o&&32===u.charCodeAt(e);)e++;if(s<0||e>=u.length){h++;continue}const t=u.slice(o),i=t.charCodeAt(0);a?32===i||9===i?(p=!0,c+="\n".repeat(d?1+h:h)):p?(p=!1,c+="\n".repeat(h+1)):0===h?d&&(c+=" "):c+="\n".repeat(h):c+="\n".repeat(d?1+h:h),c+=t,d=!0,h=0}return n===Ua?c+="\n".repeat(d?1+h:h):n!==za&&d&&(c+="\n"),c}function eo(e,t){if(-1===t.valueStart)return"";const{valueStart:i,valueEnd:s}=t;if(t.fast)return e.slice(i,s);switch(t.style){case Fa:return function(e,t,i){let s="",n=t,a=t,o=t;for(;n<i;){const t=e.charCodeAt(n);if(39===t)s+=e.slice(a,n)+"'",n+=2,a=o=n;else if(10===t||13===t){s+=e.slice(a,o);const t=Ga(e,n,i);s+=Qa(t.breaks),n=a=o=t.position}else n++,32!==t&&9!==t&&(o=n)}return s+e.slice(a,i)}(e,i,s);case Ma:return function(e,t,i){let s="",n=t,a=t,o=t;for(;n<i;){const t=e.charCodeAt(n);if(92===t){s+=e.slice(a,n),n++;const t=e.charCodeAt(n);if(10===t||13===t)n=Ga(e,n,i).position;else if(t<256&&Ba[t])s+=Ka[t],n++;else{let i=Za(t),a=0;for(;i>0;i--)n++,a=(a<<4)+Ya(e.charCodeAt(n));s+=Ja(a),n++}a=o=n}else if(10===t||13===t){s+=e.slice(a,o);const t=Ga(e,n,i);s+=Qa(t.breaks),n=a=o=t.position}else n++,32!==t&&9!==t&&(o=n)}return s+e.slice(a,i)}(e,i,s);case Va:return Xa(e,i,s,t.indent,t.chomping,!1);case Ha:return Xa(e,i,s,t.indent,t.chomping,!0);default:return function(e,t,i){let s="",n=t,a=t,o=t;for(;n<i;){const t=e.charCodeAt(n);if(10===t||13===t){s+=e.slice(a,o);const t=Ga(e,n,i);s+=Qa(t.breaks),n=a=o=t.position}else n++,32!==t&&9!==t&&(o=n)}return s+e.slice(a,o)}(e,i,s)}}var to=Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"});function io(e){let t="",i=0;for(;i<e.length;){if(37!==e.charCodeAt(i)){t+=e[i++];continue}let s=parseInt(e.slice(i+1,i+3),16);if(i+=3,s>=192){let t=s<224?1:s<240?2:3;for(s&=(1<<6-t)-1;t-- >0;)s=s<<6|63&parseInt(e.slice(i+1,i+3),16),i+=3}s<65536?t+=String.fromCharCode(s):(s-=65536,t+=String.fromCharCode(55296|s>>10,56320|1023&s))}return t}function so(e,t){if(e.startsWith("!<")&&e.endsWith(">"))return io(e.slice(2,-1));const i=e.indexOf("!",1),s=-1===i?"!":e.slice(0,i+1);return io(t?.[s]??to[s]??s)+io(e.slice(s.length))}var no=-1,ao={filename:"",schema:wa,json:!1,maxTotalMergeKeys:1e4,maxAliases:-1};function oo(e){return"tagStart"in e&&e.tagStart!==no?e.tagStart:"anchorStart"in e&&e.anchorStart!==no?e.anchorStart:"valueStart"in e&&e.valueStart!==no?e.valueStart:"start"in e?e.start:0}function ro(e,t){Oa.throwAt(e.source,e.position,t,e.filename)}function lo(e,t,i,s){try{return i.finalize(s)}catch(n){if(n instanceof Oa)throw n;Oa.throwAt(e.source,t,n instanceof Error?n.message:String(n),e.filename)}}function co(e,t){const i=eo(e.source,t),s=t.tagStart===no?"":e.source.slice(t.tagStart,t.tagEnd),n=e.schema.defaultScalarTag;if(""!==s){if("!"===s)return{value:i,tag:n};const t=so(s,e.tagHandlers),a=e.schema.lookupScalarTag(t);if(a){const s=a.resolve(i,!0,t);return s===kn&&ro(e,`cannot resolve a node with !<${t}> explicit tag`),{value:s,tag:a}}const o=e.schema.lookupMappingTag(t)??e.schema.lookupSequenceTag(t);if(o){""!==i&&ro(e,`cannot resolve a node with !<${t}> explicit tag`);const s=o.create(t);return{value:o.carrierIsResult?s:lo(e,e.position,o,s),tag:o}}ro(e,`unknown scalar tag !<${t}>`)}return t.style===Ia?e.schema.resolveImplicitScalarTag(i):{value:n.resolve(i,!1,n.tagName),tag:n}}function ho(e,t,i){const s=t.tagStart===no?"":e.source.slice(t.tagStart,t.tagEnd);return""===s||"!"===s?i:so(s,e.tagHandlers)}function po(e){return"mapping"===e.nodeKind}function uo(e){e.totalMergeKeys++,-1!==e.maxTotalMergeKeys&&e.totalMergeKeys>e.maxTotalMergeKeys&&ro(e,`merge keys exceeded maxTotalMergeKeys (${e.maxTotalMergeKeys})`)}function mo(e,t,i,s){uo(e);for(const n of s.keys(i)){if(uo(e),t.tag.has(t.value,n))continue;const a=t.tag.addPair(t.value,n,s.get(i,n));a&&ro(e,a),t.overridable??=new Set,t.overridable.add(n)}}function fo(e,t,i,s,n){if(e.position=t.keyPosition,t.keyIsMerge)return void function(e,t,i,s){if(e.position=t.keyPosition,po(s))mo(e,t,i,s);else if("sequence"===s.nodeKind&&Array.isArray(i)){i.length>100&&ro(e,"abnormal merge sequence size");for(const s of i){const i=e.nodeTags.get(s);i||ro(e,"cannot merge mappings; the provided source object is unacceptable"),mo(e,t,s,i)}}else ro(e,"cannot merge mappings; the provided source object is unacceptable")}(e,t,s,n);e.json||!t.tag.has(t.value,i)||t.overridable?.has(i)||ro(e,"duplicated mapping key");const a=t.tag.addPair(t.value,i,s);a&&ro(e,a),t.overridable?.delete(i)}function go(e,t,i){const s=e.frames[e.frames.length-1];if("document"===s.kind)s.value=t,s.hasValue=!0;else if("sequence"===s.kind){po(i)&&e.nodeTags.set(t,i);const n=s.tag.addItem(s.value,t,s.index++);n&&ro(e,n)}else if(s.hasKey){const n=s.key;s.key=void 0,s.hasKey=!1,fo(e,s,n,t,i)}else s.key=t,s.keyPosition=e.position,s.hasKey=!0,s.keyIsMerge="tag:yaml.org,2002:merge"===i.tagName}function vo(e,t,i,s,n){if(t.anchorStart!==no){const a={value:i,tag:s,isValueFinal:n};return e.anchors.set(e.source.slice(t.anchorStart,t.anchorEnd),a),a}return null}var _o=-1,yo=Object.prototype.hasOwnProperty,bo=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,$o=/[,\[\]{}]/,wo=/^(?:!|!!|![0-9A-Za-z-]+!)$/,xo=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,ko=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`,jo=new RegExp(`^(?:${xo})*$`),Ao=new RegExp(`^(?:${ko})+$`),So=new RegExp(`^(?:!(?:${xo})*|${ko}(?:${xo})*)$`),Oo={filename:"",maxDepth:100};function Co(e,t,i,s,n,a,o){e.events.push({type:Ea,start:t,anchorStart:i,anchorEnd:s,tagStart:n,tagEnd:a,style:o})}function Eo(e,t,i,s,n,a,o){e.events.push({type:Ta,start:t,anchorStart:i,anchorEnd:s,tagStart:n,tagEnd:a,style:o})}function To(e,t){e.events.splice(t.eventsLength,0,{type:Ta,start:t.position,anchorStart:_o,anchorEnd:_o,tagStart:_o,tagEnd:_o,style:qa})}function No(e,t,i,s,n,a,o,r,l=Ra,c=-1,d=!1){e.events.push({type:Na,valueStart:t,valueEnd:i,anchorStart:s,anchorEnd:n,tagStart:a,tagEnd:o,style:r,chomping:l,indent:c,fast:d})}function Po(e){e.events.push({type:La})}function Lo(e){No(e,_o,_o,_o,_o,_o,_o,Ia)}function Io(){return{anchorStart:_o,anchorEnd:_o,tagStart:_o,tagEnd:_o}}function Fo(e){return{position:e.position,line:e.line,lineStart:e.lineStart,lineIndent:e.lineIndent,firstTabInLine:e.firstTabInLine,eventsLength:e.events.length}}function Mo(e,t){e.position=t.position,e.line=t.line,e.lineStart=t.lineStart,e.lineIndent=t.lineIndent,e.firstTabInLine=t.firstTabInLine,e.events.length=t.eventsLength}function Vo(e,t){Oa.throwAt(e.input.slice(0,e.length),e.position,t,e.filename)}function Ho(e){return 10===e||13===e}function Do(e){return 9===e||32===e}function qo(e){return Do(e)||Ho(e)}function Ro(e){return 0===e||qo(e)}function zo(e){return 44===e||91===e||93===e||123===e||125===e}function Uo(e){return e>=48&&e<=57?e-48:-1}function Wo(e){if(e>=48&&e<=57)return e-48;const t=32|e;return t>=97&&t<=102?t-97+10:-1}function Bo(e){return 120===e?2:117===e?4:85===e?8:0}function Ko(e){return 48===e||97===e||98===e||116===e||9===e||110===e||118===e||102===e||114===e||101===e||32===e||34===e||47===e||92===e||78===e||95===e||76===e||80===e}function Jo(e){10===e.input.charCodeAt(e.position)?e.position++:(e.position++,10===e.input.charCodeAt(e.position)&&e.position++),e.line++,e.lineStart=e.position,e.lineIndent=0,e.firstTabInLine=-1}function Yo(e,t){let i=0,s=e.input.charCodeAt(e.position),n=e.position===e.lineStart||qo(e.input.charCodeAt(e.position-1));for(;0!==s;){for(;Do(s);)n=!0,9===s&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),s=e.input.charCodeAt(++e.position);if(t&&n&&35===s)do{s=e.input.charCodeAt(++e.position)}while(!Ho(s)&&0!==s);if(!Ho(s))break;for(Jo(e),i++,n=!0,s=e.input.charCodeAt(e.position);32===s;)e.lineIndent++,s=e.input.charCodeAt(++e.position)}return i}function Zo(e,t=e.position){const i=e.input.charCodeAt(t);if((45===i||46===i)&&i===e.input.charCodeAt(t+1)&&i===e.input.charCodeAt(t+2)){const i=e.input.charCodeAt(t+3);return 0===i||qo(i)}return!1}function Go(e){e.position===e.lineStart&&65279===e.input.charCodeAt(e.position)&&(e.position++,e.lineStart=e.position)}function Qo(e){if(e.position!==e.lineStart)return!1;if(Zo(e))return!0;if(65279!==e.input.charCodeAt(e.position))return!1;const t=Fo(e);Go(e),Yo(e,!0);const i=e.input.charCodeAt(e.position),s=e.position===e.lineStart&&(37===i||45===i&&Zo(e));return Mo(e,t),s}function Xo(e){let t=e.input.charCodeAt(e.position);for(;0!==t&&!Ho(t);)t=e.input.charCodeAt(++e.position)}function er(e,t,i){const s=bo.exec(e.input.slice(t,i));null!==s&&(e.position=t+s.index+s[0].length-1,Vo(e,"the stream contains non-printable characters"))}function tr(e,t,i){if(33!==e.input.charCodeAt(e.position))return!1;t.tagStart!==_o&&Vo(e,"duplication of a tag property");const s=e.position;let n=!1,a=!1,o="!",r=e.input.charCodeAt(++e.position);60===r?(n=!0,r=e.input.charCodeAt(++e.position)):33===r&&(a=!0,o="!!",r=e.input.charCodeAt(++e.position));let l,c=e.position;if(n){for(;0!==r&&62!==r;)r=e.input.charCodeAt(++e.position);62!==r&&Vo(e,"unexpected end of the stream within a verbatim tag"),l=e.input.slice(c,e.position),e.position++}else{for(;!(0===r||qo(r)||i&&zo(r));)33===r&&(a?Vo(e,"tag suffix cannot contain exclamation marks"):(o=e.input.slice(c-1,e.position+1),wo.test(o)||Vo(e,"named tag handle cannot contain such characters"),a=!0,c=e.position+1)),r=e.input.charCodeAt(++e.position);l=e.input.slice(c,e.position),$o.test(l)&&Vo(e,"tag suffix cannot contain flow indicator characters")}return l&&!(n?jo.test(l):Ao.test(l))&&Vo(e,`tag name cannot contain such characters: ${l}`),n||"!"===o||"!!"===o||yo.call(e.tagHandlers,o)||Vo(e,`undeclared tag handle "${o}"`),t.tagStart=s,t.tagEnd=e.position,!0}function ir(e,t){if(38!==e.input.charCodeAt(e.position))return!1;t.anchorStart!==_o&&Vo(e,"duplication of an anchor property"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!qo(e.input.charCodeAt(e.position))&&!zo(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&Vo(e,"name of an anchor node must contain at least one character"),t.anchorStart=i,t.anchorEnd=e.position,!0}function sr(e,t){if(42!==e.input.charCodeAt(e.position))return!1;t.anchorStart===_o&&t.tagStart===_o||Vo(e,"alias node should not have any properties"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!qo(e.input.charCodeAt(e.position))&&!zo(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&Vo(e,"name of an alias node must contain at least one character"),function(e,t,i){e.events.push({type:Pa,anchorStart:t,anchorEnd:i})}(e,i,e.position),!0}function nr(e,t){Yo(e,!1),e.lineIndent<t&&Vo(e,"deficient indentation")}function ar(e,t,i,s){if(!function(e,t){const i=e.input.charCodeAt(e.position),s=1===t;if(0===i||qo(i)||35===i||38===i||42===i||33===i||124===i||62===i||39===i||34===i||37===i||64===i||96===i||zo(i))return!1;if(63===i||45===i){const t=e.input.charCodeAt(e.position+1);if(Ro(t)||s&&zo(t))return!1}return!0}(e,i))return!1;const n=e.position;let a=e.position,o=e.input.charCodeAt(e.position);const r=1===i;let l=!1;for(;0!==o&&!Qo(e);){if(58===o){const t=e.input.charCodeAt(e.position+1);if(Ro(t)||r&&zo(t))break}else if(35===o){if(qo(e.input.charCodeAt(e.position-1)))break}else{if(r&&zo(o))break;if(Ho(o)){const i=e.position,s=e.line,n=e.lineStart,a=e.lineIndent;if(Yo(e,!1),e.lineIndent>=t){l=!0,o=e.input.charCodeAt(e.position);continue}e.position=i,e.line=s,e.lineStart=n,e.lineIndent=a;break}}Do(o)||(a=e.position+1),o=e.input.charCodeAt(++e.position)}return a!==n&&(er(e,n,a),No(e,n,a,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,Ia,Ra,-1,!l),!0)}function or(e,t){const i=e.line;Yo(e,!0),(e.line>i&&e.lineIndent<t||-1!==e.firstTabInLine&&e.lineIndent<t)&&Vo(e,"deficient indentation")}function rr(e,t,i){if(-1!==e.firstTabInLine||45!==e.input.charCodeAt(e.position)||!Ro(e.input.charCodeAt(e.position+1)))return!1;for(Co(e,e.position,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Da);45===e.input.charCodeAt(e.position)&&Ro(e.input.charCodeAt(e.position+1));){-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,Vo(e,"tab characters must not be used in indentation"));const i=e.line;e.position++;const s=Yo(e,!0)>0;if(-1!==e.firstTabInLine&&45===e.input.charCodeAt(e.position)&&Ro(e.input.charCodeAt(e.position+1))&&Vo(e,"bad indentation of a sequence entry"),s&&e.lineIndent<=t?Lo(e):cr(e,t,3,!1,!0),Yo(e,!0),e.lineIndent<t||e.position>=e.length)break;e.lineIndent>t&&Vo(e,"bad indentation of a sequence entry"),e.line===i&&45===e.input.charCodeAt(e.position)&&Ro(e.input.charCodeAt(e.position+1))&&Vo(e,"bad indentation of a sequence entry")}return Po(e),!0}function lr(e,t,i,s){let n=!1,a=!1,o=!1,r=!1;if(-1!==e.firstTabInLine)return!1;let l=e.input.charCodeAt(e.position);for(;0!==l;){n||-1===e.firstTabInLine||(e.position=e.firstTabInLine,Vo(e,"tab characters must not be used in indentation"));const c=e.input.charCodeAt(e.position+1),d=e.line;if(63!==l&&58!==l||!Ro(c)){n&&(Lo(e),n=!1);const t=Fo(e);if(!cr(e,i,2,!1,!0))break;if(e.line===d){for(l=e.input.charCodeAt(e.position);Do(l);)l=e.input.charCodeAt(++e.position);if(58===l)l=e.input.charCodeAt(++e.position),Ro(l)||Vo(e,"a whitespace character is expected after the key-value separator within a block mapping"),o||(e.events.splice(t.eventsLength,0,{type:Ta,start:t.position,anchorStart:s.anchorStart,anchorEnd:s.anchorEnd,tagStart:s.tagStart,tagEnd:s.tagEnd,style:Da}),o=!0),a=!0,n=!1,r=!1;else{if(!a)return s.anchorStart===_o&&s.tagStart===_o||(Mo(e,t),!1);Vo(e,"expected ':' after a mapping key")}}else{if(!a)return s.anchorStart===_o&&s.tagStart===_o||(Mo(e,t),!1);Vo(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else o||(Eo(e,e.position,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,Da),o=!0),63===l?(n&&Lo(e),a=!0,n=!0):(n||(Lo(e),a=!0),n=!1),e.position+=1,r=!0;if(cr(e,t,4,!0,r)&&(r=!1),n||r&&(Lo(e),r=!1),Yo(e,!0),l=e.input.charCodeAt(e.position),(e.line===d||e.lineIndent>t)&&0!==l)Vo(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return!!a&&(n&&Lo(e),o&&Po(e),!0)}function cr(e,t,i,s,n,a=!0){e.depth>=e.maxDepth&&Vo(e,`nesting exceeded maxDepth (${e.maxDepth})`),e.depth++;let o=1,r=!1,l=!1,c=null;const d=Io();let h=4===i||3===i,p=h;const u=h;if(s&&Yo(e,!0)&&(r=!0,o=e.lineIndent>t?1:e.lineIndent===t?0:-1),1===o)for(;;){const s=e.input.charCodeAt(e.position),n=Fo(e);if(r&&1!==o&&(33===s||38===s))break;if(r&&u&&(d.tagStart!==_o||d.anchorStart!==_o)&&(33===s||38===s)){const i=Fo(e),s=t+1;if(lr(e,e.position-e.lineStart,s,d)&&e.events[i.eventsLength]?.type===Ta)return e.depth--,!0;Mo(e,i)}if(r&&(33===s&&d.tagStart!==_o||38===s&&d.anchorStart!==_o))break;if(!tr(e,d,1===i)&&!ir(e,d))break;null===c&&(c=n),Yo(e,!0)?(r=!0,p=u,o=e.lineIndent>t?1:e.lineIndent===t?0:-1):p=!1}if(p&&(p=r||n),1===o||4===i){const s=1===i||2===i?t:t+1,n=e.position-e.lineStart;if(1===o)if(p&&(rr(e,n,d)||lr(e,n,s,d))||function(e,t,i){const s=e.input.charCodeAt(e.position),n=123===s,a=e.position;let o=!0;if(91!==s&&123!==s)return!1;const r=n?125:93;for(n?Eo(e,a,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,qa):Co(e,a,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,qa),e.position++;0!==e.input.charCodeAt(e.position);){or(e,t);let i=e.input.charCodeAt(e.position);if(i===r)return e.position++,Po(e),!0;o?44===i&&Vo(e,"expected the node content, but found ','"):Vo(e,"missed comma between flow collection entries");let s=!1,a=!1;63===i&&qo(e.input.charCodeAt(e.position+1))&&(s=a=!0,e.position+=1,or(e,t));const l=e.line,c=Fo(e),d=cr(e,t,1,!1,!0);or(e,t),i=e.input.charCodeAt(e.position),(n||a||e.line===l)&&58===i?(s=!0,e.position++,or(e,t),n||To(e,c),d||Lo(e),cr(e,t,1,!1,!0)||Lo(e),or(e,t),n||Po(e)):n&&s?(d||Lo(e),Lo(e)):n?Lo(e):s&&(To(e,c),d||Lo(e),Lo(e),Po(e)),i=e.input.charCodeAt(e.position),44===i?(o=!0,e.position++):o=!1}Vo(e,"unexpected end of the stream within a flow collection")}(e,s,d))l=!0;else{const t=e.input.charCodeAt(e.position);if(null!==c&&a&&u&&!p&&124!==t&&62!==t){const t=Fo(e),i=c.position-c.lineStart;Mo(e,c),lr(e,i,s,Io())&&e.events[t.eventsLength]?.type===Ta?l=!0:Mo(e,t)}!l&&(h&&function(e,t,i){const s=e.input.charCodeAt(e.position);let n=Ra,a=-1,o=!1;if(124!==s&&62!==s)return!1;const r=124===s?Va:Ha;for(e.position++;0!==e.input.charCodeAt(e.position);){const i=e.input.charCodeAt(e.position),s=Uo(i);if(43===i||45===i)n!==Ra&&Vo(e,"repeat of a chomping mode identifier"),n=43===i?Ua:za,e.position++;else{if(!(s>=0))break;0===s&&Vo(e,"bad explicit indentation width of a block scalar; it cannot be less than one"),o&&Vo(e,"repeat of an indentation width identifier"),a=t+s-1,o=!0,e.position++}}let l=!1;for(;Do(e.input.charCodeAt(e.position));)l=!0,e.position++;l&&35===e.input.charCodeAt(e.position)&&Xo(e),Ho(e.input.charCodeAt(e.position))?Jo(e):0!==e.input.charCodeAt(e.position)&&Vo(e,"a line break is expected");let c=o?a:-1,d=0;const h=e.position;let p=e.position;for(;0!==e.input.charCodeAt(e.position);){const i=e.position;let s=0;for(;32===e.input.charCodeAt(i+s);)s++;const n=e.input.charCodeAt(i+s);if(0===n){c>=0?s>c&&(p=i+s):s>0&&(p=i+s);break}if(Qo(e))break;if(!o&&-1===c&&Ho(n)&&(d=Math.max(d,s)),o||-1!==c||Ho(n)||(9===n&&s<t&&(e.position=i+s,Vo(e,"tab characters must not be used in indentation")),s>=t&&s<d&&(e.position=i+s,Vo(e,"bad indentation of a mapping entry"))),-1===c&&0!==n&&!Ho(n)&&s<t){e.lineIndent=s,e.position=i+s;break}o||0===n||Ho(n)||-1!==c||(c=s);const a=-1===c?t+1:c;if(0!==n&&!Ho(n)&&s<a){e.lineIndent=s,e.position=i+s;break}Xo(e),p=e.position,Ho(e.input.charCodeAt(e.position))&&(Jo(e),p=e.position)}return er(e,h,p),No(e,h,p,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,r,n,c),!0}(e,s,d)||function(e,t,i){if(39!==e.input.charCodeAt(e.position))return!1;e.position++;const s=e.position;let n=!0;for(;0!==e.input.charCodeAt(e.position);){const a=e.input.charCodeAt(e.position);if(39===a){if(39===e.input.charCodeAt(e.position+1)){n=!1,e.position+=2;continue}const t=e.position;return e.position++,No(e,s,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Fa,Ra,-1,n),!0}Ho(a)?(n=!1,nr(e,t)):e.position===e.lineStart&&Zo(e)?Vo(e,"unexpected end of the document within a single quoted scalar"):9!==a&&a<32?Vo(e,"expected valid JSON character"):e.position++}Vo(e,"unexpected end of the stream within a single quoted scalar")}(e,s,d)||function(e,t,i){if(34!==e.input.charCodeAt(e.position))return!1;e.position++;const s=e.position;let n=!0;for(;0!==e.input.charCodeAt(e.position);){const a=e.input.charCodeAt(e.position);if(34===a){const t=e.position;return e.position++,No(e,s,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Ma,Ra,-1,n),!0}if(92===a){n=!1;const i=e.input.charCodeAt(++e.position);if(Ho(i))nr(e,t);else if(Ko(i))e.position++;else{let t=Bo(i);for(0===t&&Vo(e,"unknown escape sequence");t-- >0;)e.position++,Wo(e.input.charCodeAt(e.position))<0&&Vo(e,"expected hexadecimal character");e.position++}}else Ho(a)?(n=!1,nr(e,t)):e.position===e.lineStart&&Zo(e)?Vo(e,"unexpected end of the document within a double quoted scalar"):9!==a&&a<32?Vo(e,"expected valid JSON character"):e.position++}Vo(e,"unexpected end of the stream within a double quoted scalar")}(e,s,d)||sr(e,d)||ar(e,s,i,d))&&(l=!0)}else 0===o&&(l=p&&rr(e,n,d))}return h=h&&!l,l||d.anchorStart===_o&&d.tagStart===_o&&!h||(No(e,_o,_o,d.anchorStart,d.anchorEnd,d.tagStart,d.tagEnd,Ia),l=!0),e.depth--,l||d.anchorStart!==_o||d.tagStart!==_o}function dr(e){if(e.lineIndent>0||37!==e.input.charCodeAt(e.position))return!1;e.position++;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!qo(e.input.charCodeAt(e.position));)e.position++;const i=e.input.slice(t,e.position),s=[];for(0===i.length&&Vo(e,"directive name must not be less than one character in length");0!==e.input.charCodeAt(e.position)&&!Ho(e.input.charCodeAt(e.position));){for(;Do(e.input.charCodeAt(e.position));)e.position++;if(35===e.input.charCodeAt(e.position)||Ho(e.input.charCodeAt(e.position))||0===e.input.charCodeAt(e.position))break;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!qo(e.input.charCodeAt(e.position));)e.position++;s.push(e.input.slice(t,e.position))}if(Ho(e.input.charCodeAt(e.position))&&Jo(e),"YAML"===i){e.directives.some(e=>"yaml"===e.kind)&&Vo(e,"duplication of %YAML directive"),1!==s.length&&Vo(e,"YAML directive accepts exactly one argument");const t=/^([0-9]+)\.([0-9]+)$/.exec(s[0]);null===t&&Vo(e,"ill-formed argument of the YAML directive"),1!==parseInt(t[1],10)&&Vo(e,"unacceptable YAML version of the document"),e.directives.push({kind:"yaml",version:s[0]})}else if("TAG"===i){2!==s.length&&Vo(e,"TAG directive accepts exactly two arguments");const[t,i]=s;wo.test(t)||Vo(e,"ill-formed tag handle (first argument) of the TAG directive"),yo.call(e.tagHandlers,t)&&Vo(e,`there is a previously declared suffix for "${t}" tag handle`),So.test(i)||Vo(e,"ill-formed tag prefix (second argument) of the TAG directive"),e.tagHandlers[t]=i,e.directives.push({kind:"tag",handle:t,prefix:i})}return!0}function hr(e){e.directives=[],e.tagHandlers=Object.create(null);let t=!1;for(Yo(e,!0);dr(e);)t=!0,Yo(e,!0);let i=!1,s=!1,n=!0;if(0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)&&Ro(e.input.charCodeAt(e.position+3))){i=!0;const t=e.line;e.position+=3,Yo(e,!0),n=e.line>t}else t&&Vo(e,"directives end mark is expected");const a=e.events.length;if(!i&&e.position===e.lineStart&&46===e.input.charCodeAt(e.position)&&Zo(e))return e.position+=3,void Yo(e,!0);if(function(e,t,i){e.events.push({type:Ca,explicitStart:t,explicitEnd:i,directives:e.directives})}(e,i,!1),cr(e,e.lineIndent-1,4,!1,n,n)||Lo(e),Yo(e,!0),e.position===e.lineStart&&Zo(e)&&(s=46===e.input.charCodeAt(e.position),s)){const t=e.line;e.position+=3,Yo(e,!0),e.line===t&&e.position<e.length&&Vo(e,"end of the stream or a document separator is expected")}const o=e.events[a];o?.type===Ca&&(o.explicitEnd=s),Po(e),!s&&e.position<e.length&&!Qo(e)&&Vo(e,"end of the stream or a document separator is expected")}var pr={...Oo,...ao};function ur(e,t={}){const i={...pr,...t},s=String(e),n=Object.keys(Oo),a=Object.keys(ao);return function(e,t){const i={...ao,...t,events:e,documents:[],eventIndex:0,position:0,frames:[],anchors:new Map,nodeTags:new Map,tagHandlers:Object.create(null),totalMergeKeys:0,aliasCount:0};for(;i.eventIndex<i.events.length;){const e=i.events[i.eventIndex++];switch(i.position=oo(e),e.type){case Ca:i.anchors=new Map,i.nodeTags=new Map,i.aliasCount=0,i.tagHandlers=Object.create(null);for(const t of e.directives)"tag"===t.kind&&(i.tagHandlers[t.handle]=t.prefix);i.frames.push({kind:"document",position:i.position,value:void 0,hasValue:!1});break;case Na:{const{value:t,tag:s}=co(i,e);vo(i,e,t,s,!0),go(i,t,s);break}case Ea:{const t=ho(i,e,"tag:yaml.org,2002:seq"),s=i.schema.lookupSequenceTag(t);s||ro(i,`unknown sequence tag !<${t}>`);const n=s.create(t),a=vo(i,e,n,s,s.carrierIsResult);i.frames.push({kind:"sequence",position:i.position,value:n,tag:s,anchor:a,index:0});break}case Ta:{const t=ho(i,e,"tag:yaml.org,2002:map"),s=i.schema.lookupMappingTag(t);s||ro(i,`unknown mapping tag !<${t}>`);const n=s.create(t),a=vo(i,e,n,s,s.carrierIsResult);i.frames.push({kind:"mapping",position:i.position,value:n,tag:s,anchor:a,key:void 0,keyPosition:i.position,hasKey:!1,keyIsMerge:!1,overridable:null});break}case Pa:{-1!==i.maxAliases&&++i.aliasCount>i.maxAliases&&ro(i,`aliases exceeded maxAliases (${i.maxAliases})`);const t=i.source.slice(e.anchorStart,e.anchorEnd),s=i.anchors.get(t);s||ro(i,`unidentified alias "${t}"`),s.isValueFinal||ro(i,`recursive alias "${t}" is not supported for tag ${s.tag.tagName} because it uses finalize()`),go(i,s.value,s.tag);break}case La:{const e=i.frames.pop();if("mapping"===e.kind&&e.hasKey&&(i.position=e.keyPosition,ro(i,"incomplete mapping pair in event stream")),"document"===e.kind)i.documents.push(e.value);else{const t=e.tag.carrierIsResult?e.value:lo(i,e.position,e.tag,e.value);e.anchor&&(e.anchor.value=t,e.anchor.isValueFinal=!0),go(i,t,e.tag)}break}}}return i.documents}(function(e,t){const i=e.length,s={...Oo,...t,input:`${e}\0`,length:i,position:0,line:0,lineStart:0,lineIndent:0,firstTabInLine:-1,depth:0,directives:[],tagHandlers:Object.create(null),events:[]},n=e.indexOf("\0");for(-1!==n&&Oa.throwAt(e,n,"null byte is not allowed in input",s.filename);s.position<s.length&&(Go(s),Yo(s,!0),!(s.position>=s.length));){const e=s.position;hr(s),s.position===e&&Vo(s,"can not read a document")}return s.events}(s,fa(i,n)),{...fa(i,a),source:s})}function mr(e,t){return!!(e&1<<t)}var fr={applyQuoteFlowKeysOption:function(e){if(!e.presenterOptions.quoteFlowKeys)return;if(!e.isKey||!e.flowOnly||e.style!==Ia)return;e.style=Ma},doubleQuoteForInvisibles:function(e){e.style===Ia&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(e.node.value)&&(e.style=Ma)},doubleQuoteWhitespaceOnly:function(e){e.style===Ia&&/^\s+$/.test(e.node.value)&&(e.style=Ma)},applyForceQuotesOption:function(e){if(!e.presenterOptions.forceQuotes)return;if(e.isKey||e.style!==Ia)return;if(e.node.tag!==e.presenterOptions.schema.defaultScalarTag.tagName)return;e.style=e.node.value.includes("\n")?Ma:gr(e)},tryLongOrMultilineAsBlock:function(e){if(e.style!==Ia||e.isKey)return;const t=e.node.value,i=-1!==t.indexOf("\n");if(!mr(e.allowedStylesMask,Va))return void(i&&(e.style=Ma));const s=e.presenterOptions.lineWidth;if(-1===s)return void(i&&(e.style=Va));const n=Math.max(Math.min(s,40),s-e.shiftOfContent);let a=0,o=!1;for(;a<=t.length;){let e=t.length;const i=t.indexOf("\n",a);-1!==i&&(e=i);const s=t.slice(a,e);if(s.length>n&&" "!==s[0]&&/ [^ \t]/.test(s)&&(o=!0),-1===i)break;a=i+1}o?e.style=Ha:i&&(e.style=Va)},quoteInvalidPlain:function(e){e.style!==Ia||mr(e.allowedStylesMask,Ia)||(e.style=gr(e))},fallbackToDoubleQuoted:function(e){mr(e.allowedStylesMask,e.style)||(e.style=Ma)}};function gr(e){return"single"===e.presenterOptions.quoteStyle&&mr(e.allowedStylesMask,Fa)?Fa:Ma}Object.keys(fr).map(e=>Reflect.get(fr,e));const vr="tempus2016/decluttering-card-plus",_r="share-your-templates",yr=`https://github.com/${vr}/discussions/new?category=${_r}`,br="decluttering-card-plus-community";function $r(e){let t=2e4;const i=e=>(t-=1+Math.ceil(e/16))>=0,s=e=>"string"==typeof e?i(e.length):!!i(0)&&(Array.isArray(e)?e.every(s):!e||"object"!=typeof e||Object.entries(e).every(([e,t])=>i(e.length)&&s(t)));return s(e)}const wr=e=>!!e&&"object"==typeof e&&!Array.isArray(e);function xr(e){if($r(e))return JSON.parse(JSON.stringify(e),(e,t)=>"__proto__"===e?void 0:t)}const kr=/[\p{Cf}\u2800\u3164\u115F\u1160\uFFA0]/gu;function jr(e){if("string"!=typeof e)return;const t=e.replace(kr,"").replace(/\s+/g," ").trim();return t?t.length>80?`${t.slice(0,79)}…`:t:void 0}const Ar=["card","badge","row","element","group"];function Sr(e){if(!wr(e))return{};const t={};for(const[i,s]of Object.entries(e))wr(s)&&Ar.some(e=>void 0!==s[e])&&(t[i]=s);return t}function Or(e,t){return"string"==typeof t&&/^https:\/\/github\.com\//.test(t)?t:`https://github.com/${vr}/discussions/${e}`}function Cr(e){var t,i,s,n,a;const o=function(e){if("string"!=typeof e||e.length>65536)return;const t=/^ {0,3}(`{3,}|~{3,})[ \t]*([\w-]*)/,i=[];let s;for(const o of function(e){return e.replace(/<!--[\s\S]*?(?:-->|$)/g,"")}(e).split("\n")){if(s){o.trim()===s.fence?(i.push({lang:s.lang,text:s.lines.join("\n")+"\n"}),s=void 0):s.lines.push(o);continue}const e=t.exec(o);e&&(s={fence:e[1],lang:e[2],lines:[]})}const n=i.find(e=>/^ya?ml$/i.test(e.lang)),a=null!=n?n:i.find(e=>""===e.lang);return null==a?void 0:a.text}(null==e?void 0:e.body);if(!o)return;let r;try{if(r=xr(function(e,t){const i=ur(e,t);if(0===i.length)throw new Oa("expected a document, but the input is empty");if(1===i.length)return i[0];throw new Oa("expected a single document in the stream, but found more")}(o,{maxAliases:50})),void 0===r)return}catch(h){return}if(!Ps(r).ok)return;if("number"!=typeof(null==e?void 0:e.number))return;const{template:l,includes:c}=r,d=Qe(r,["template","includes"]);return delete d.type,"string"!=typeof d.description&&delete d.description,{id:e.number,title:null!==(t=jr(e.title))&&void 0!==t?t:l,author:"string"==typeof(null===(i=e.user)||void 0===i?void 0:i.login)?e.user.login:"",url:Or(e.number,e.html_url),name:l.trim(),template:d,includes:Sr(c),reactions:"number"==typeof(null===(s=e.reactions)||void 0===s?void 0:s.total_count)?e.reactions.total_count:0,updated:"string"==typeof(null!==(n=e.updated_at)&&void 0!==n?n:e.created_at)?null!==(a=e.updated_at)&&void 0!==a?a:e.created_at:""}}const Er=["lock","alarm_control_panel","cover","valve","siren","script","automation","button","input_button","water_heater","lawn_mower","update"],Tr=["more-info","navigate","none","assist"],Nr=["action","perform_action","service","type"],Pr=/\b[a-z][a-z0-9+.-]{1,31}:(?:\/\/)?[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?|\/\/[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?/gi,Lr=[/(?:url|image-set|src)\(\s*['"]?([^'")\s{}]+)/gi,/@import\s+(?:url\(\s*)?['"]?([^'")\s;{}]+)/gi],Ir=/^(?:\/(?!\/)|#|data:)/i,Fr=["image","url","url_path","entity_picture","camera_image","image_url","icon_url","src"],Mr=/\[\[\[|\{\{|\{%|\$\{/,Vr=/^\s*(?:javascript|data|vbscript):/i,Hr=/position\s*:\s*(?:fixed|absolute)/i,Dr=/opacity\s*:\s*0(?:[^.\d]|$)|visibility\s*:\s*hidden|transparent/i,qr=e=>"string"==typeof e&&Er.includes(e.split(".")[0]),Rr=e=>e.replace(/\\/g,"/"),zr="*";function Ur(e,t){const i=[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);if(i.length)return i.includes(zr)?[zr]:i;const s=[].concat(null!=t?t:[]).filter(e=>"string"==typeof e);if(!s.length)return[zr];const n=s.map(e=>{const t=e.indexOf("."),i=-1===t?e:e.slice(0,t);return/^[a-z_]+$/.test(i)?i:zr});return n.includes(zr)?[zr]:[...new Set(n)]}function Wr(e,t,i=new Set){var s,n,a,o;if(Array.isArray(e))return e.forEach(e=>Wr(e,t,i)),i;if(!wr(e))return i;const r="string"==typeof e.entity?e.entity:t,l=e.action;if("string"==typeof l&&!Tr.includes(l)&&!l.includes("[[")&&"perform-action"!==l&&"call-service"!==l&&"fire-dom-event"!==l&&"url"!==l){const t=[].concat(null!==(o=null!==(a=null!==(n=null===(s=e.target)||void 0===s?void 0:s.entity_id)&&void 0!==n?n:e.entity_id)&&void 0!==a?a:r)&&void 0!==o?o:[]);t.length&&!t.some(e=>"string"!=typeof e||e.includes("[["))||i.add(l)}return Object.values(e).forEach(e=>Wr(e,r,i)),i}function Br(e,t){const i=Ar.find(t=>void 0!==e[t]);if(i)try{return u(t,e,e[i],void 0,void 0,!0)}catch(s){return}}function Kr(e){const t=new Set,i=new Set;let s=!1,n=!1,a=!1,o=!1;const r=e=>{const t=Rr(e).trim();!t||Ir.test(t)||t.startsWith("[[")||t.startsWith("{{")||/^[\w.-]+\.[a-z]{2,}(?:[:/?#]|$)/i.test(t)&&i.add(t)},l=new Set,c=(e,i)=>{for(const s of e)if(i.includes(zr))t.add(`${s} *`);else for(const e of i)Er.includes(e)&&t.add(`${s} ${e}.*`)},d=(h,p)=>{var u;if("string"==typeof h)return void(e=>{var t;const s=Rr(e);for(const n of null!==(t=s.match(Pr))&&void 0!==t?t:[])i.add(n);for(const n of Lr){n.lastIndex=0;let e=n.exec(s);for(;e;)Ir.test(e[1])||i.add(e[1]),e=n.exec(s)}Mr.test(e)&&(n=!0),Hr.test(e)&&Dr.test(e)&&(o=!0)})(h);if(Array.isArray(h))return void h.forEach(e=>d(e,p));if(!wr(h))return;const m="string"==typeof h.entity?h.entity:p;Object.keys(h).some(e=>e.includes("[["))&&(a=!0),Nr.some(e=>"string"==typeof h[e]&&h[e].includes("[["))&&(a=!0),"string"==typeof h.action&&((e,s)=>{var a,o,r,l,c,d;const h=e.action;if("perform-action"===h||"call-service"===h){const i=null!==(a=e.perform_action)&&void 0!==a?a:e.service;return void("string"!=typeof i?t.add("?"):i.includes("[[")||t.add(i))}if("fire-dom-event"===h)return void t.add("fire-dom-event");if("url"===h)return i.add("string"==typeof e.url_path?e.url_path:"?"),void("string"==typeof e.url_path&&Vr.test(e.url_path)&&(n=!0));if(Tr.includes(h)||h.includes("[["))return;const p=[].concat(null!==(d=null!==(c=null!==(l=null!==(r=null===(o=e.target)||void 0===o?void 0:o.entity_id)&&void 0!==r?r:e.entity_id)&&void 0!==l?l:e.entity)&&void 0!==c?c:s)&&void 0!==d?d:[]);for(const i of p)qr(i)&&t.add(`${h} ${i}`)})(h,m),"iframe"!==h.type&&"webpage"!==h.type||(s=!0);for(const e of Fr)"string"==typeof h[e]&&r(h[e]);if("string"==typeof h.type&&Me.includes(h.type)){const t=(t=>{if("string"==typeof t)return t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0})(h.template);if(t){if(k(h.for_each_from)){const e=h.for_each_from,i=Ar.map(e=>t[e]).find(e=>void 0!==e);c(Wr(i,void 0),Ur(e.domain,e.entities))}const e=(f=h.variables,Array.isArray(f)?f.filter(wr):wr(f)?Object.entries(f).map(([e,t])=>({[e]:t})):void 0);(null==e?void 0:e.length)&&!l.has(h.template)&&(l.add(h.template),d(Br(t,e),void 0),l.delete(h.template))}}var f;if("custom:auto-entities"===h.type&&wr(h.filter))for(const e of[].concat(null!==(u=h.filter.include)&&void 0!==u?u:[])){if(!wr(e))continue;const t=Ur(e.domain,e.entity_id);c(Wr(e.options,void 0),t),c(Wr(h.card,void 0),t)}Object.values(h).forEach(e=>d(e,m))},h=[e.template,...Object.values(e.includes)].map(ps);d(h,void 0);for(const p of h)d(Br(p),void 0);return{actions:[...t].sort(),urls:[...i].sort(),embeds:s,scripts:n,placeholders:a,overlay:o}}function Jr(e){return e.filter(e=>{var t;return(null===(t=null==e?void 0:e.category)||void 0===t?void 0:t.slug)===_r}).map(Cr).filter(e=>!!e).sort((e,t)=>t.reactions-e.reactions||t.updated.localeCompare(e.updated))}class Yr extends Error{}function Zr(e){var t;if(!wr(e)||"number"!=typeof e.id||"string"!=typeof e.name)return;if(!wr(e.template))return;const i=xr({template:e.template,includes:e.includes});if(!i||!wr(i.template))return;if(!Ps(Object.assign({template:e.name},i.template)).ok)return;const s=Object.assign({},i.template);return delete s.type,"string"!=typeof s.description&&delete s.description,{id:e.id,title:null!==(t=jr(e.title))&&void 0!==t?t:e.name,author:"string"==typeof e.author?e.author:"",url:Or(e.id,e.url),name:e.name,template:s,includes:Sr(i.includes),reactions:"number"==typeof e.reactions?e.reactions:0,updated:"string"==typeof e.updated?e.updated:""}}async function Gr(e={}){var t,i,s,n;const a=null!==(t=e.fetcher)&&void 0!==t?t:fetch.bind(globalThis),o=null!==(i=e.storage)&&void 0!==i?i:"undefined"==typeof localStorage?void 0:localStorage,r=null!==(s=e.now)&&void 0!==s?s:Date.now(),l=function(e){var t;try{const i=JSON.parse(null!==(t=null==e?void 0:e.getItem(br))&&void 0!==t?t:"null");if(!i||!Array.isArray(i.entries)||"number"!=typeof i.fetched)return;return{entries:i.entries.map(Zr).filter(e=>!!e),fetched:i.fetched}}catch(i){return}}(o);if(l&&!e.refresh&&r-l.fetched<216e5)return l;const c=[];try{for(let e=1;e<=10;e+=1){const t=await a(`https://api.github.com/repos/${vr}/discussions?per_page=100&page=${e}`,{headers:{Accept:"application/vnd.github+json"}});if(!t.ok){const e=new Yr(`GitHub answered ${t.status}`);throw"0"===t.headers.get("x-ratelimit-remaining")&&(e.retryAt=1e3*Number(t.headers.get("x-ratelimit-reset"))||void 0),e}const i=await t.json();if(!Array.isArray(i))break;if(c.push(...i),i.length<100)break}}catch(h){const e=h instanceof Yr?h:new Yr(null!==(n=null==h?void 0:h.message)&&void 0!==n?n:String(h));throw e.cached=l,e}const d={entries:Jr(c),fetched:r};try{null==o||o.setItem(br,JSON.stringify(d))}catch(p){}return d}function Qr(e,t){return{discussion:e.id,updated:e.updated,name:t,author:e.author}}function Xr(e,t){return Object.assign(Object.assign({},e),{source:t})}function el(e,t){return e.map(({name:e,source:i})=>{var s;const n=t.entries.find(e=>e.id===i.discussion),a="string"==typeof i.name?i.name:void 0,o=n?function(e,t){return void 0===t||t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0}(n,a):void 0;if(!n||!o)return Object.assign({name:e,status:"gone"},n?{entry:n}:{});if("string"!=typeof i.author||!i.author||i.author!==n.author)return{name:e,status:"unverified",entry:n};const r=Date.parse(null!==(s=i.updated)&&void 0!==s?s:""),l=Date.parse(n.updated);return{name:e,status:(Number.isFinite(r)?Number.isFinite(l)&&l>r:Number.isFinite(l))?"update":"current",entry:n,latest:Xr(o,Qr(n,null!=a?a:n.name))}})}function tl(e){if(""===e)return[];const t=e.split("\n");return""===t[t.length-1]&&t.pop(),t}function il(e,t){const i=e=>({kind:"remove",text:e}),s=e=>({kind:"add",text:e});if(!e.length||!t.length||e.length*t.length>4e6)return[...e.map(i),...t.map(s)];const n=e.length,a=t.length,o=Array.from({length:n+1},()=>new Uint32Array(a+1));for(let d=n-1;d>=0;d-=1)for(let i=a-1;i>=0;i-=1)o[d][i]=e[d]===t[i]?o[d+1][i+1]+1:Math.max(o[d+1][i],o[d][i+1]);const r=[];let l=0,c=0;for(;l<n&&c<a;)e[l]===t[c]?(r.push({kind:"same",text:e[l]}),l+=1,c+=1):o[l+1][c]>=o[l][c+1]?(r.push(i(e[l])),l+=1):(r.push(s(t[c])),c+=1);for(;l<n;)r.push(i(e[l++]));for(;c<a;)r.push(s(t[c++]));return r}const sl=e`<style>
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
</style>`;function nl(e){return"string"==typeof e?e:void 0===e?"":X(e)}const al={same:" ",add:"+",remove:"-"};function ol(t,i,s,n=3){const a=function(e,t){const i=tl(e),s=tl(t);let n=0;for(;n<i.length&&n<s.length&&i[n]===s[n];)n+=1;let a=i.length,o=s.length;for(;a>n&&o>n&&i[a-1]===s[o-1];)a-=1,o-=1;const r=i.slice(0,n).map(e=>({kind:"same",text:e})),l=i.slice(a).map(e=>({kind:"same",text:e}));return[...r,...il(i.slice(n,a),s.slice(n,o)),...l]}(nl(t),nl(i));return function(e){return e.some(e=>"same"!==e.kind)}(a)?e`${sl}
    <div class="dcp-diff" role="figure" aria-label=${l("diff.label",void 0,s)}>
      ${function(e,t=3){const i=e.map(e=>"same"!==e.kind),s=new Array(e.length).fill(!1);e.forEach((i,n)=>{if("same"!==i.kind)for(let a=Math.max(0,n-t);a<=Math.min(e.length-1,n+t);a+=1)s[a]=!0});const n=[];let a=0;for(;a<e.length;){if(i[a]||s[a]){n.push(e[a]),a+=1;continue}let t=a;for(;t<e.length&&!i[t]&&!s[t];)t+=1;const o=t-a;1===o?n.push(e[a]):n.push({kind:"skip",count:o}),a=t}return n}(a,n).map(t=>function(t,i){return"skip"===t.kind?e`<div class="skip">${l("diff.skipped",{count:t.count},i)}</div>`:e`<div class=${t.kind}>${al[t.kind]} ${t.text}</div>`}(t,s))}
    </div>`:e`${sl}
      <p class="dcp-diff-none">${l("diff.no_change",void 0,s)}</p>`}function rl(t,i,s){var n,a;const o=null!==(n=JSON.stringify(t))&&void 0!==n?n:"",r=null!==(a=JSON.stringify(i))&&void 0!==a?a:"";return e`
    ${ol(t,i,s)}
    <ha-expansion-panel outlined>
      <span slot="header">${l("diff.full",void 0,s)}</span>
      <p class="dcp-diff-none">${l("diff.before",void 0,s)}</p>
      ${yn(o,e`<ha-yaml-editor .hass=${s} .defaultValue=${t} read-only></ha-yaml-editor>`)}
      <p class="dcp-diff-none">${l("diff.after",void 0,s)}</p>
      ${yn(r,e`<ha-yaml-editor .hass=${s} .defaultValue=${i} read-only></ha-yaml-editor>`)}
    </ha-expansion-panel>
  `}const ll=["readme","related","setup","requires_entities","requires_homeassistant","requires_card"];class cl extends _{constructor(){super(...arguments),this._importParses=!0,this._importErrors=[],this._importArmedAt=0,this._copyState="",this._busy=!1,this._libraryDestination="view",this._communityLoading=!1,this._communityKnownFailed=!1,this._installArmedAt=0,this._postCopyState="",this._setupValues={},this._updatesLoading=!1,this._updateArmedAt=0,this._trashArmedAt=0}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=te())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:E()}static get styles(){return rn}_fireConfigChanged(e){b(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return on(this,e,t,i)}render(){return this.hass&&this._config?this._renderShare():e``}async _loadTrash(){this.hass&&(this._trash=await Xe(this.hass))}_renderShare(){const{payload:t,notes:i}=Es(this._config,T(this._savedLovelace));return e`
      <div class="share">
        ${this._renderDetails()}
        <h3>${l("share.export_header",void 0,this.hass)}</h3>
        <p class="hint">${l("share.export_hint",void 0,this.hass)}</p>
        ${i.map(t=>e`<ha-alert alert-type="info">${t}</ha-alert>`)}
        <ha-yaml-editor id="export" .hass=${this.hass} .defaultValue=${t} read-only></ha-yaml-editor>
        <ha-button @click=${this._copyExport}>
          ${"done"===this._copyState?l("share.copied",void 0,this.hass):"failed"===this._copyState?l("share.copy_failed",void 0,this.hass):l("share.copy",void 0,this.hass)}
        </ha-button>
        <ha-button @click=${this._downloadExport}> ${l("share.download",void 0,this.hass)} </ha-button>
        <ha-button @click=${this._copyPost}>
          ${"done"===this._postCopyState?l("share.copied",void 0,this.hass):"failed"===this._postCopyState?l("share.copy_failed",void 0,this.hass):l("share.post_copy",void 0,this.hass)}
        </ha-button>
        <p class="hint">
          ${l("share.post_hint",void 0,this.hass)}
          <a href=${yr} target="_blank" rel="noopener noreferrer"
            >${l("share.post_open",void 0,this.hass)}</a
          >
        </p>

        <h3>${l("share.import_header",void 0,this.hass)}</h3>
        <p class="hint">${l("share.import_hint",void 0,this.hass)}</p>
        <ha-yaml-editor id="import" .hass=${this.hass} @value-changed=${this._importChanged}></ha-yaml-editor>
        <input
          id="import-file"
          type="file"
          accept=".yaml,.yml,.json,text/yaml,application/json"
          hidden
          @change=${this._importFile}
        />
        <ha-button @click=${()=>{var e;return null===(e=this.renderRoot.querySelector("#import-file"))||void 0===e?void 0:e.click()}}>
          ${l("share.import_file",void 0,this.hass)}
        </ha-button>
        ${this._importErrors.map(t=>e`<ha-alert alert-type="error">${t}</ha-alert>`)}
        ${this._renderImportDetails()}
        ${this._importClash?e`<ha-alert alert-type="warning">
                ${l("share.import_clash",{name:this._importClash},this.hass)}
              </ha-alert>`:e``}
        ${this._importRisks?this._renderRisks(this._importRisks,"share.import_risks"):e``}
        <ha-button @click=${this._import}>
          ${l(this._importClash||this._importRisks?"share.import_anyway":"share.import",void 0,this.hass)}
        </ha-button>
        ${this._importClash?e`<ha-button @click=${this._importAsCopy}>
                ${l("share.import_copy",void 0,this.hass)}
              </ha-button>`:e``}
        ${this._renderTrash()}

        <h3>${l("share.library_header",void 0,this.hass)}</h3>
        <p class="hint">${l("share.library_hint",void 0,this.hass)}</p>
        ${this._renderLibrary()}

        <h3>${l("share.community_header",void 0,this.hass)}</h3>
        <p class="hint">${l("share.community_hint",void 0,this.hass)}</p>
        ${this._renderCommunity()} ${this._renderInstalled()}
        ${this._toolError?e`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:e``}
      </div>
    `}_renderDetails(){var t,i,s,n;const a=this._config,o=function(e){const t=e&&"object"==typeof e?e:{},i=t.author&&"object"==typeof t.author&&!Array.isArray(t.author)?t.author:void 0,s=t.requires&&"object"==typeof t.requires&&!Array.isArray(t.requires)?t.requires:{},n={author_name:$s(i?i.name:t.author),author_github:$s(null==i?void 0:i.github),author_email:$s(null==i?void 0:i.email),author_url:$s(null==i?void 0:i.url),license:$s(t.license),help:$s(t.help),homepage:$s(t.homepage),readme:$s(t.readme),related:ws(t.related),setup:ws(t.setup),requires_integrations:ws(s.integrations),requires_entities:ws(s.entities),requires_custom_cards:ws(s.custom_cards),requires_homeassistant:$s(s.homeassistant),requires_card:$s(s.card)};for(const a of Object.keys(n))void 0===n[a]&&delete n[a];return n}(a),r=e=>[...new Set(e)].sort().map(e=>({value:e,label:e})),c=e=>({select:{multiple:!0,custom_value:!0,options:r(e)}}),d=Object.keys(T(this._savedLovelace)).filter(e=>e!==a.template),h=[...P(a).map(e=>e.name),...null!==(t=o.setup)&&void 0!==t?t:[]],p=(Array.isArray(null===(s=null===(i=this.hass)||void 0===i?void 0:i.config)||void 0===s?void 0:s.components)?this.hass.config.components:[]).filter(e=>!e.includes(".")),u=(null!==(n=window.customCards)&&void 0!==n?n:[]).map(e=>e.type).filter(e=>"string"==typeof e),m=(e,t)=>({name:e,selector:t}),f=[m("author_name",{text:{}}),m("author_github",{text:{}}),m("author_email",{text:{}}),m("author_url",{text:{type:"url"}}),m("license",{text:{}}),m("help",{text:{type:"url"}}),m("homepage",{text:{type:"url"}}),m("readme",{text:{multiline:!0}}),m("related",c(d)),m("setup",c(h)),m("requires_integrations",c(p)),m("requires_entities",c([])),m("requires_custom_cards",c(u)),m("requires_homeassistant",{text:{}}),m("requires_card",{text:{}})];return e`
      <ha-expansion-panel outlined class="details">
        <span slot="header">${l("share.details_header",void 0,this.hass)}</span>
        <p class="hint">${l("share.details_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${o}
          .schema=${f}
          .computeLabel=${e=>l(`share.details_${e.name}`,void 0,this.hass)}
          .computeHelper=${e=>ll.includes(e.name)?l(`share.details_${e.name}_helper`,void 0,this.hass):""}
          @value-changed=${this._detailsChanged}
        ></ha-form>
      </ha-expansion-panel>
    `}_detailsChanged(e){if(e.stopPropagation(),!this._config)return;const t=function(e,t){var i;const s=Object.assign({},e),n=(e,t)=>{void 0===t||Array.isArray(t)&&!t.length?delete s[e]:s[e]=t},a={},o=xs(t.author_name);o&&(a.name=o);for(const d of["github","email","url"]){const e=xs(t[`author_${d}`]);e&&(a[d]=e)}const r=e.author&&"object"==typeof e.author&&!Array.isArray(e.author)?e.author:{};for(const[d,h]of Object.entries(r))["name","github","email","url"].includes(d)||(a[d]=h);const l=Object.keys(a);n("author",l.length?1===l.length&&o?o:a:void 0);for(const d of["license","help","homepage"])n(d,xs(t[d]));n("readme","string"==typeof t.readme&&t.readme.trim()?t.readme:void 0),n("related",ks(t.related)),n("setup",ks(t.setup));const c=e.requires&&"object"==typeof e.requires&&!Array.isArray(e.requires)?Object.assign({},e.requires):{};for(const[d,h]of Object.entries(bs)){const e=[].concat(null!==(i=c[d])&&void 0!==i?i:[]).filter(e=>"string"!=typeof e),s=[...ks(t[h]),...e];s.length?c[d]=s:delete c[d]}for(const d of["homeassistant","card"]){const e=xs(t[`requires_${d}`]);e?c[d]=e:delete c[d]}return n("requires",Object.keys(c).length?c:void 0),s}(this._config,e.detail.value);this._fireConfigChanged(t)}_renderCommunity(){const t=this._community,i=e`
      ${this._communityError?e`<ha-alert alert-type="warning">${this._communityError}</ha-alert>`:e``}
      ${this._communityError&&t?e`<p class="hint">
              ${l("share.community_showing_cached",{time:(e=>{var t,i;return new Date(e).toLocaleString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)})(t.fetched)},this.hass)}
            </p>`:e``}
    `;if(!t)return e`
        <div class="library">
          ${i}
          <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!1)}}>
            ${l(this._communityLoading?"share.community_loading":"share.community_load",void 0,this.hass)}
          </ha-button>
        </div>
      `;const s=this._communityExisting(),n=t.entries.find(e=>e.id===this._communitySelected),a=n?`community:${n.id}:${n.updated}`:"",o=!!n&&this._installPending===a,r=n&&s.includes(n.name)?Ns(n.name,s):void 0,c=n?function(e,t){const i=new Set,s=new Set;for(const n of[e.template,...Object.values(e.includes)]){const e=Cs(n);e.customTypes.forEach(e=>i.add(e)),e.templateRefs.forEach(e=>s.add(e))}return{customTypes:[...i].sort(),templates:[...s].filter(i=>i!==e.name&&!(i in e.includes)&&!t.includes(i)).sort()}}(n,s):void 0,d=n?Object.keys(n.includes).filter(e=>!s.includes(e)):[],h=n?Kr(n):void 0,p=void 0!==this._communityKnown;return e`
      <div class="library">
        ${i}
        ${t.entries.length?e`<ha-form
                .hass=${this.hass}
                .data=${{entry:n?String(n.id):""}}
                .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:t.entries.map(e=>({value:String(e.id),label:l("share.community_by",{title:e.title,author:e.author},this.hass)}))}}}]}
                .computeLabel=${()=>l("share.community_pick",void 0,this.hass)}
                @value-changed=${this._communityPicked}
              ></ha-form>`:e`<p class="hint">${l("share.community_none",void 0,this.hass)}</p>`}
        ${n&&c?e`
                <p class="hint">
                  ${"string"==typeof n.template.description?n.template.description:""}
                  <a href=${n.url} target="_blank" rel="noopener noreferrer"
                    >${l("share.community_open",void 0,this.hass)}</a
                  >
                </p>
                ${this._renderAbout(n.template)}
                ${d.length?e`<p class="hint">
                        ${l("share.library_needs",{names:d.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderUnmet([n.template,...Object.values(n.includes)])}
                ${this._renderMissingCards([n.template,...Object.values(n.includes)])}
                ${c.templates.length?e`<ha-alert alert-type="warning">
                        ${l("share.community_needs_templates",{names:c.templates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
                ${h&&tn(h)?this._renderRisks(h,"share.community_risks"):e``}
                ${this._renderSetup([n.template,...Object.values(n.includes)])}
                <ha-expansion-panel outlined expanded>
                  <span slot="header">${l("share.library_preview",void 0,this.hass)}</span>
                  ${yn(`${n.id}:${n.updated}`,e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${Object.assign(Object.assign({template:n.name},n.template),Object.keys(n.includes).length?{includes:n.includes}:{})}
                      read-only
                    ></ha-yaml-editor>`)}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{where:this._libraryDestination}}
                  .schema=${[{name:"where",selector:{select:{mode:"dropdown",options:[{value:"view",label:l("share.library_where_view",void 0,this.hass)},{value:"root",label:l("share.library_where_root",void 0,this.hass)}]}}}]}
                  .computeLabel=${()=>l("share.library_where",void 0,this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                ${this._communityKnownFailed?e`<ha-alert alert-type="error">
                        ${l("share.community_names_failed",void 0,this.hass)}
                      </ha-alert>`:e``}
                <ha-button .disabled=${this._busy||!p} @click=${()=>{this._installShared(n)}}>
                  ${p||this._communityKnownFailed?o?l("share.install_anyway",void 0,this.hass):r?l("share.community_install_as",{name:r},this.hass):l("share.install",void 0,this.hass):l("share.community_names_loading",void 0,this.hass)}
                </ha-button>
              `:e``}
        <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!0)}}>
          ${l(this._communityLoading?"share.community_loading":"share.community_refresh",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderAbout(t){var i,s,n;const a=ds(t),o=(r=a.author)?[r.name,r.github?`@${r.github}`:void 0,r.email].filter(Boolean).join(" · "):"";var r;const c=null!==(s=null===(i=a.author)||void 0===i?void 0:i.url)&&void 0!==s?s:(null===(n=a.author)||void 0===n?void 0:n.github)?`https://github.com/${a.author.github}`:void 0,d=[a.help?{url:a.help,label:l("share.about_help",void 0,this.hass)}:void 0,a.homepage?{url:a.homepage,label:l("share.about_homepage",void 0,this.hass)}:void 0].filter(e=>!!e);return o||a.license||d.length||a.readme?e`
      ${o||a.license||d.length?e`<p class="hint about">
              ${o?e`<span
                      >${l("share.about_author",void 0,this.hass)}
                      ${c?e`<a href=${c} target="_blank" rel="noopener noreferrer">${o}</a>`:o}</span
                    >`:e``}
              ${a.license?e`<span>${l("share.about_license",{license:a.license},this.hass)}</span>`:e``}
              ${d.map(t=>e`<a href=${t.url} target="_blank" rel="noopener noreferrer">${t.label}</a>`)}
            </p>`:e``}
      ${a.readme?e`<ha-expansion-panel outlined>
              <span slot="header">${l("share.about_readme",void 0,this.hass)}</span>
              <ha-markdown class="readme" .content=${a.readme}></ha-markdown>
            </ha-expansion-panel>`:e``}
    `:e``}_renderUnmet(t){const i=t.filter(e=>void 0!==e),s=new Set(Ls(i,en)),n=function(e,t){const i=new Set,s=[];for(const n of e)for(const e of fs(n)){const n=`${e.kind}:${e.any.join("|")}`;if(i.has(n))continue;if(i.add(n),vs(e,t))continue;const a="homeassistant"===e.kind?t.homeassistant:"card"===e.kind?t.card:void 0;s.push(a?Object.assign(Object.assign({},e),{have:a}):e)}return s}(i,(a=this.hass,o=ct,r=en,{components:Array.isArray(null===(c=null==a?void 0:a.config)||void 0===c?void 0:c.components)?a.config.components:[],entities:Object.keys(null!==(d=null==a?void 0:a.states)&&void 0!==d?d:{}),homeassistant:"string"==typeof(null===(h=null==a?void 0:a.config)||void 0===h?void 0:h.version)?a.config.version:void 0,card:o,isDefined:r})).filter(e=>!("custom_card"===e.kind&&!e.message&&e.any.every(e=>s.has(e))));var a,o,r,c,d,h;return n.length?e`<ha-alert alert-type="warning" .title=${l("share.requires_header",void 0,this.hass)}>
      <ul class="risks">
        ${n.map(t=>e`<li>${this._unmetLine(t)}</li>`)}
      </ul>
      ${l("share.requires_hint",void 0,this.hass)}
    </ha-alert>`:e``}_unmetLine(e){var t;const i=l("share.requires_or",void 0,this.hass),s=l(`share.requires_${e.kind}`,{names:e.any.join(i),want:e.any[0],have:null!==(t=e.have)&&void 0!==t?t:"?"},this.hass);return e.message?`${s}: ${e.message}`:s}_renderSetup(t){const i=t.filter(e=>void 0!==e),s=function(e){const t=[];for(const i of e)for(const e of ds(i).setup)t.includes(e)||t.push(e);return t}(i);if(!s.length)return e``;const n=e=>{if(e in this._setupValues)return this._setupValues[e];for(const t of i){const i=_s(t,e);if(void 0!==i)return i}return""};return e`
      <h4>${l("share.setup_header",void 0,this.hass)}</h4>
      <p class="hint">${l("share.setup_hint",void 0,this.hass)}</p>
      <ha-form
        .hass=${this.hass}
        .data=${s.reduce((e,t)=>Object.assign(Object.assign({},e),{[t]:n(t)}),{})}
        .schema=${s.map(e=>({name:e,selector:{text:{}}}))}
        .computeLabel=${e=>e.name}
        @value-changed=${this._setupChanged}
      ></ha-form>
    `}_setupChanged(e){var t;e.stopPropagation();const i={};for(const[s,n]of Object.entries(null!==(t=e.detail.value)&&void 0!==t?t:{}))i[s]=null==n?"":String(n);this._setupValues=i}_keptSetup(e){const t={};for(const i of ds(e).setup){const s=_s(e,i);void 0!==s&&(t[i]=s)}return t}_renderRisks(t,i){return e`<ha-alert alert-type="warning" .title=${l(i,void 0,this.hass)}>
      <ul class="risks">
        ${t.actions.length?e`<li>${l("share.community_risk_actions",{list:t.actions.join(", ")},this.hass)}</li>`:e``}
        ${t.urls.length?e`<li>${l("share.community_risk_urls",{list:t.urls.join(", ")},this.hass)}</li>`:e``}
        ${t.embeds?e`<li>${l("share.community_risk_embeds",void 0,this.hass)}</li>`:e``}
        ${t.scripts?e`<li>${l("share.community_risk_scripts",void 0,this.hass)}</li>`:e``}
        ${t.placeholders?e`<li>${l("share.community_risk_placeholders",void 0,this.hass)}</li>`:e``}
        ${t.overlay?e`<li>${l("share.community_risk_overlay",void 0,this.hass)}</li>`:e``}
      </ul>
    </ha-alert>`}async _loadCommunity(e){var t,i;this._communityLoading=!0,this._communityError=void 0,this._installPending=void 0,this._communityKnown=void 0,this._communityKnownFailed=!1;try{this._community=await Gr({refresh:e})}catch(s){const e=s;e.cached&&(this._community=e.cached),this._communityError=e.retryAt?l("share.community_rate_limited",{time:new Date(e.retryAt).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)},this.hass):l("share.community_failed",{message:e.message},this.hass)}finally{this._communityLoading=!1}this._community&&this._loadCommunityKnown()}_communityExisting(){var e;const t=Object.keys(T(this._savedLovelace));return[...new Set([...t,...null!==(e=this._communityKnown)&&void 0!==e?e:[]])]}async _loadCommunityKnown(){try{const e=await Te(this.hass,this._savedLovelace);this._communityKnown=Object.keys(e)}catch(e){this._communityKnownFailed=!0}}_communityPicked(e){e.stopPropagation();const t=Number(e.detail.value.entry);this._communitySelected=Number.isFinite(t)&&t>0?t:void 0,this._installPending=void 0,this._setupValues={}}async _installShared(e){var t,i,s,n,a;if(void 0===this._communityKnown)return;const o=`community:${e.id}:${e.updated}`;if(this._installPending!==o)return this._installPending=o,void(this._installArmedAt=Date.now());if(Date.now()-this._installArmedAt<sn)return;const r=te(),l=this._communityExisting(),c=l.includes(e.name)?Ns(e.name,l):e.name,d=[...Object.entries(e.includes).filter(([e])=>!l.includes(e)).map(([t,i])=>[t,Xr(ys(i,this._setupValues),Qr(e,t))]),[c,Xr(ys(e.template,this._setupValues),Qr(e,e.name))]],h=le(null!==(t=null==r?void 0:r.config)&&void 0!==t?t:this.lovelace,null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""),p=null!==(a=null===(n=null==h?void 0:h.view)||void 0===n?void 0:n.index)&&void 0!==a?a:0;await this._saveDashboard(e=>d.reduce((e,[t,i])=>"root"===this._libraryDestination?et(e,t,i):tt(e,p,Object.assign({type:Ie,template:t},i,{type:Ie,template:t})),e),"community_install")&&(this._installPending=void 0,this._setupValues={})}_renderMissingCards(t){const i=Ls(t.filter(e=>void 0!==e),en);return i.length?e`<ha-alert alert-type="warning">
      ${l(1===i.length?"share.missing_card_one":"share.missing_card_many",{cards:i.join(", ")},this.hass)}
    </ha-alert>`:e``}_renderInstalled(){var t;const i=it(this._savedLovelace);if(!i.length)return e``;const s=new Map((null!==(t=this._updates)&&void 0!==t?t:[]).map(e=>[e.name,e]));return e`
      <h3>${l("share.installed_header",void 0,this.hass)}</h3>
      <p class="hint">${l("share.installed_hint",void 0,this.hass)}</p>
      ${this._updatesError?e`<ha-alert alert-type="warning">${this._updatesError}</ha-alert>`:e``}
      <ul class="installed">
        ${i.map(({name:t,source:i,template:n})=>{var a,o;const r=s.get(t);return e`<li>
            ${t} —
            <a
              href=${null!==(o=null===(a=null==r?void 0:r.entry)||void 0===a?void 0:a.url)&&void 0!==o?o:`https://github.com/${vr}/discussions/${i.discussion}`}
              target="_blank"
              rel="noopener noreferrer"
              >${l("share.installed_from",{discussion:i.discussion},this.hass)}</a
            >
            ${r?e`<span class="status"
                    >${l(`share.installed_status_${r.status}`,void 0,this.hass)}</span
                  >`:e``}
            ${"update"===(null==r?void 0:r.status)&&r.latest?this._renderUpdate(t,n,r):e``}
          </li>`})}
      </ul>
      <ha-button .disabled=${this._updatesLoading} @click=${()=>{this._checkUpdates()}}>
        ${l(this._updatesLoading?"share.community_loading":"share.installed_check",void 0,this.hass)}
      </ha-button>
    `}_renderUpdate(t,i,s){const n=ys(s.latest,this._keptSetup(i)),a=e=>{const t=Object.assign({},e);return delete t.source,delete t.type,delete t.template,t},o=a(i),r=a(n),c=Kr({template:r,includes:{}}),d=function(e,t){return{actions:e.actions.filter(e=>!t.actions.includes(e)),urls:e.urls.filter(e=>!t.urls.includes(e)),embeds:e.embeds&&!t.embeds,scripts:e.scripts&&!t.scripts,placeholders:e.placeholders&&!t.placeholders,overlay:e.overlay&&!t.overlay}}(c,Kr({template:o,includes:{}})),h=this._updatePending===t;return e`
      <p class="hint">${l("share.installed_compare",void 0,this.hass)}</p>
      ${rl(o,r,this.hass)} ${this._renderMissingCards([n])} ${this._renderUnmet([n])}
      ${tn(d)?this._renderRisks(d,"share.installed_risks_new"):tn(c)?this._renderRisks(c,"share.installed_risks"):e``}
      ${h?e`<ha-alert alert-type="warning">
              ${l("share.installed_update_confirm",{name:t},this.hass)}
            </ha-alert>`:e``}
      <ha-button .disabled=${this._busy} @click=${()=>{this._updateShared(t,n)}}>
        ${l(h?"share.installed_update_anyway":"share.installed_update",void 0,this.hass)}
      </ha-button>
    `}async _checkUpdates(){var e,t;this._updatesLoading=!0,this._updatesError=void 0,this._updatePending=void 0;const i=it(this._savedLovelace);try{this._updates=el(i,await Gr({refresh:!0}))}catch(s){const i=s;this._updatesError=i.retryAt?l("share.community_rate_limited",{time:new Date(i.retryAt).toLocaleTimeString(null===(t=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===t?void 0:t.language)},this.hass):l("share.community_failed",{message:i.message},this.hass)}finally{this._updatesLoading=!1}}async _updateShared(e,t){var i,s;if(this._updatePending!==e)return this._updatePending=e,void(this._updateArmedAt=Date.now());if(Date.now()-this._updateArmedAt<sn)return;await this._saveDashboard(i=>st(i,e,t),"shared_update")&&(this._updatePending=void 0,this._updates=null===(i=this._updates)||void 0===i?void 0:i.map(t=>t.name===e?Object.assign(Object.assign({},t),{status:"current"}):t),(null===(s=this._config)||void 0===s?void 0:s.template)===e&&this._fireConfigChanged(Object.assign(Object.assign({},t),{type:this._config.type,template:e})))}_renderLibrary(){var t;const i=Object.keys(T(this._savedLovelace)),s=this._librarySelected?$n(this._librarySelected):void 0,n=!!s&&i.includes(s.name),a=!!s&&this._installPending===s.name,o=s?wn(s,i):[];return e`
      <div class="library">
        <ha-form
          .hass=${this.hass}
          .data=${{entry:null!==(t=this._librarySelected)&&void 0!==t?t:""}}
          .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:bn.map(e=>({value:e.name,label:e.name}))}}}]}
          .computeLabel=${()=>l("share.library_pick",void 0,this.hass)}
          @value-changed=${this._libraryPicked}
        ></ha-form>
        ${s?e`
                <p class="hint">${l(`library.${s.name}.summary`,void 0,this.hass)}</p>
                ${o.length?e`<p class="hint">
                        ${l("share.library_needs",{names:o.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderMissingCards([s,...o.map(e=>$n(e))].map(e=>null==e?void 0:e.template))}
                <ha-expansion-panel outlined>
                  <span slot="header">${l("share.library_preview",void 0,this.hass)}</span>
                  ${yn(s.name,e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${s.template}
                      read-only
                    ></ha-yaml-editor>`)}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{where:this._libraryDestination}}
                  .schema=${[{name:"where",selector:{select:{mode:"dropdown",options:[{value:"view",label:l("share.library_where_view",void 0,this.hass)},{value:"root",label:l("share.library_where_root",void 0,this.hass)}]}}}]}
                  .computeLabel=${()=>l("share.library_where",void 0,this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                <ha-button .disabled=${this._busy||n} @click=${()=>{this._install(s.name)}}>
                  ${l(n?"share.already_here":a?"share.install_anyway":"share.install",void 0,this.hass)}
                </ha-button>
              `:e``}
      </div>
    `}_libraryDestinationPicked(e){e.stopPropagation();const t=e.detail.value.where;this._libraryDestination="root"===t?"root":"view"}_libraryPicked(e){e.stopPropagation(),this._librarySelected=e.detail.value.entry||void 0,this._installPending=void 0}async _install(e){var t,i,s,n,a,o;const r=$n(e);if(!r)return;if(this._installPending!==e)return void(this._installPending=e);const l=te(),c=Object.keys(T(null!==(t=null==l?void 0:l.config)&&void 0!==t?t:this._savedLovelace)),d=[...wn(r,c),r.name].filter(e=>!c.includes(e)),h=le(null!==(i=null==l?void 0:l.config)&&void 0!==i?i:this.lovelace,null!==(n=null===(s=this._config)||void 0===s?void 0:s.template)&&void 0!==n?n:""),p=null!==(o=null===(a=null==h?void 0:h.view)||void 0===a?void 0:a.index)&&void 0!==o?o:0;await this._saveDashboard(e=>d.reduce((e,t)=>{const i=$n(t);if(!i)return e;const s=Object.assign(Object.assign({},i.template),{source:xn(i.name,ct)});return"root"===this._libraryDestination?et(e,i.name,s):tt(e,p,Object.assign({type:Ie,template:i.name},s))},e),"library_install")&&(this._installPending=void 0)}async _copyExport(){const e=this.renderRoot.querySelector("#export"),t=null==e?void 0:e.yaml;if(!t)return;const{notes:i}=Es(this._config),s=[...i.map(e=>`# ${e}`),t].join("\n");this._copyState=await ee(s)?"done":"failed",setTimeout(()=>this._copyState="",3e3)}async _copyPost(){var e,t;const i=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!i)return;const{notes:s}=Es(this._config,T(this._savedLovelace));this._postCopyState=await ee(function(e,t,i){return[...[i,...t].filter(e=>"string"==typeof e&&e.trim()),"```yaml\n"+e.replace(/\n*$/,"")+"\n```"].join("\n\n")+"\n"}(i,s,null===(t=this._config)||void 0===t?void 0:t.description))?"done":"failed",setTimeout(()=>this._postCopyState="",3e3)}_downloadExport(){var e,t,i;const s=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!s)return;const{notes:n}=Es(this._config),a=[...n.map(e=>`# ${e}`),s].join("\n"),o=document.createElement("a");o.href=URL.createObjectURL(new Blob([a],{type:"text/yaml"})),o.download=`${(null!==(i=null===(t=this._config)||void 0===t?void 0:t.template)&&void 0!==i?i:"template").replace(/[^\w-]+/g,"_")}.yaml`,o.click(),setTimeout(()=>URL.revokeObjectURL(o.href),1e3)}async _importFile(e){var t,i,s;const n=e.target,a=null===(t=n.files)||void 0===t?void 0:t[0];if(n.value="",!a)return;const o=await a.text(),r=null===(s=null===(i=this.renderRoot.querySelector("#import"))||void 0===i?void 0:i.shadowRoot)||void 0===s?void 0:s.querySelector("ha-code-editor");r?(r.value=o,r.dispatchEvent(new CustomEvent("value-changed",{detail:{value:o}}))):this._importErrors=[l("share.import_not_yaml",void 0,this.hass)]}_renderTrash(){if(void 0===this._trash)return this._loadTrash(),e``;const t=e=>{var t,i;return new Date(e).toLocaleString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)};return e`
      <h3>${l("share.trash_header",void 0,this.hass)}</h3>
      <p class="hint">${l("share.trash_hint",void 0,this.hass)}</p>
      ${this._trash.length?e`<ul class="installed trash">
              ${this._trash.map((i,s)=>e`
                  <li>
                    <strong>${i.name}</strong>
                    <div class="status">
                      ${l("removed"===i.reason?"share.trash_removed":"share.trash_replaced",{when:t(i.at),dashboard:i.dashboard},this.hass)}
                    </div>
                    ${this._trashPending===s?e`<ha-alert alert-type="warning">
                            ${l("share.trash_clash",{name:i.name},this.hass)}
                          </ha-alert>`:e``}
                    <ha-button .disabled=${this._busy} @click=${()=>this._restore(i,s)}>
                      ${l(this._trashPending===s?"share.trash_restore_anyway":"share.trash_restore",void 0,this.hass)}
                    </ha-button>
                    <ha-button
                      @click=${()=>{this._trashShown=this._trashShown===s?void 0:s}}
                    >
                      ${l(this._trashShown===s?"share.trash_hide":"share.trash_show",void 0,this.hass)}
                    </ha-button>
                    <ha-button .disabled=${this._busy} @click=${()=>this._forget(i)}>
                      ${l("share.trash_forget",void 0,this.hass)}
                    </ha-button>
                    ${this._trashShown===s?e`<ha-yaml-editor
                            .hass=${this.hass}
                            .defaultValue=${i.template}
                            read-only
                          ></ha-yaml-editor>`:e``}
                  </li>
                `)}
            </ul>`:e`<p class="hint">${l("share.trash_empty",void 0,this.hass)}</p>`}
    `}async _restore(e,t){var i,s;if(!this.hass)return;const n=nt(this.hass);let a;try{a=await at(n,e.dashboard)}catch(r){return void(this._toolError=l("tools.save_failed",{message:null!==(i=null==r?void 0:r.message)&&void 0!==i?i:r},this.hass))}const o=e.name in T(a);if(o&&this._trashPending!==t)return this._trashPending=t,void(this._trashArmedAt=Date.now());if(!(o&&Date.now()-this._trashArmedAt<sn)){this._busy=!0,this._toolError=void 0;try{await se(this,this.hass,"restore",[{urlPath:e.dashboard,build:t=>ot(t,e)}]),this._trashPending=void 0,this._trashShown=void 0,await this._forget(e)}catch(r){this._toolError=l("tools.save_failed",{message:null!==(s=null==r?void 0:r.message)&&void 0!==s?s:r},this.hass)}finally{this._busy=!1}}}async _forget(e){if(!this.hass)return;const t=rt(await Xe(this.hass),e);await lt(this.hass,t),this._trash=t,this._trashPending=void 0}_renderImportDetails(){const t=this._importValue;if(!this._importParses||!t||"object"!=typeof t||Array.isArray(t))return e``;if(!$r(t))return e``;const i=[t,...t.includes&&"object"==typeof t.includes&&!Array.isArray(t.includes)?Object.values(t.includes):[]];return e`${this._renderAbout(t)} ${this._renderUnmet(i)} ${this._renderSetup(i)}`}_importChanged(e){e.stopPropagation(),this._importValue=e.detail.value,this._importParses=!1!==e.detail.isValid,this._importErrors=[],this._importClash=void 0,this._importRisks=void 0,this._setupValues={}}_import(){if(!this._config)return;if(!this._importParses)return void(this._importErrors=[l("share.import_not_yaml",void 0,this.hass)]);if(!$r(this._importValue))return void(this._importErrors=[l("share.import_too_big",void 0,this.hass)]);const e=Ps(this._importValue);if(!e.ok)return this._importErrors=e.errors,void(this._importClash=void 0);this._importErrors=[];const t=this._importValue.template,i=T(this._savedLovelace),s=t!==this._config.template&&t in i?t:void 0,n=Kr({template:this._importValue,includes:{}});if(s&&!this._importClash||tn(n)&&!this._importRisks)return this._importClash=s,this._importRisks=tn(n)?n:void 0,void(this._importArmedAt=Date.now());Date.now()-this._importArmedAt<sn||this._applyImport(t)}_importAsCopy(){if(!this._config||!this._importParses)return;if(Date.now()-this._importArmedAt<sn)return;const e=Object.keys(T(this._savedLovelace));this._applyImport(Ns(this._importValue.template,e))}_applyImport(e){var t;const i=function(e){const t=Ts(e);if((null==t?void 0:t.includes)&&"object"==typeof t.includes&&!Array.isArray(t.includes)){const e={};for(const[i,s]of Object.entries(t.includes))e[i]=Ts(s);t.includes=e}return t}(this._importValue),s=ys(i,this._setupValues);s.includes&&"object"==typeof s.includes&&!Array.isArray(s.includes)&&(s.includes=Object.entries(s.includes).reduce((e,[t,i])=>Object.assign(Object.assign({},e),{[t]:i&&"object"==typeof i&&!Array.isArray(i)?ys(i,this._setupValues):i}),{}));const n=s.includes;if(n&&"object"==typeof n&&!Array.isArray(n)){const e=Object.keys(T(this._savedLovelace)),t=Object.entries(n).filter(([t])=>!e.includes(t));t.length&&this._saveDashboard(e=>t.reduce((e,[t,i])=>et(e,t,i),e),"import",this._config)}const a=Object.assign(Object.assign({},s),{template:e,type:null===(t=this._config)||void 0===t?void 0:t.type});delete a.includes,this._fireConfigChanged(a),this._importClash=void 0,this._importRisks=void 0,this._setupValues={},this.dispatchEvent(new CustomEvent("select-tab",{detail:"settings",bubbles:!0,composed:!0}))}}f([g({attribute:!1})],cl.prototype,"hass",void 0),f([g({attribute:!1})],cl.prototype,"lovelace",void 0),f([g({attribute:!1})],cl.prototype,"config",void 0),f([v()],cl.prototype,"_importErrors",void 0),f([v()],cl.prototype,"_importClash",void 0),f([v()],cl.prototype,"_importRisks",void 0),f([v()],cl.prototype,"_copyState",void 0),f([v()],cl.prototype,"_toolError",void 0),f([v()],cl.prototype,"_busy",void 0),f([v()],cl.prototype,"_installPending",void 0),f([v()],cl.prototype,"_librarySelected",void 0),f([v()],cl.prototype,"_libraryDestination",void 0),f([v()],cl.prototype,"_community",void 0),f([v()],cl.prototype,"_communityLoading",void 0),f([v()],cl.prototype,"_communityError",void 0),f([v()],cl.prototype,"_communitySelected",void 0),f([v()],cl.prototype,"_communityKnown",void 0),f([v()],cl.prototype,"_communityKnownFailed",void 0),f([v()],cl.prototype,"_postCopyState",void 0),f([v()],cl.prototype,"_setupValues",void 0),f([v()],cl.prototype,"_updates",void 0),f([v()],cl.prototype,"_updatesLoading",void 0),f([v()],cl.prototype,"_updatesError",void 0),f([v()],cl.prototype,"_updatePending",void 0),f([v()],cl.prototype,"_trash",void 0),f([v()],cl.prototype,"_trashShown",void 0),f([v()],cl.prototype,"_trashPending",void 0),customElements.get("decluttering-template-share-tab")||customElements.define("decluttering-template-share-tab",cl)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;const dl=(e,t,i)=>{const s=new Map;for(let n=t;n<=i;n++)s.set(e[n],n);return s},hl=cn(class extends dn{constructor(e){if(super(e),e.type!==ln)throw Error("repeat() can only be used in text expressions")}dt(e,t,i){let s;void 0===i?i=t:void 0!==t&&(s=t);const n=[],a=[];let o=0;for(const r of e)n[o]=s?s(r,o):o,a[o]=i(r,o),o++;return{values:a,keys:n}}render(e,t,i){return this.dt(e,t,i).values}update(e,[t,i,s]){const n=(e=>e._$AH)(e),{values:a,keys:o}=this.dt(t,i,s);if(!Array.isArray(n))return this.ut=o,a;const r=this.ut??=[],l=[];let c,d,h=0,p=n.length-1,u=0,m=a.length-1;for(;h<=p&&u<=m;)if(null===n[h])h++;else if(null===n[p])p--;else if(r[h]===o[u])l[u]=fn(n[h],a[u]),h++,u++;else if(r[p]===o[m])l[m]=fn(n[p],a[m]),p--,m--;else if(r[h]===o[m])l[m]=fn(n[h],a[m]),mn(e,l[m+1],n[h]),h++,m--;else if(r[p]===o[u])l[u]=fn(n[p],a[u]),mn(e,n[h],n[p]),p--,u++;else if(void 0===c&&(c=dl(o,u,m),d=dl(r,h,p)),c.has(r[h]))if(c.has(r[p])){const t=d.get(o[u]),i=void 0!==t?n[t]:null;if(null===i){const t=mn(e,n[h]);fn(t,a[u]),l[u]=t}else l[u]=fn(i,a[u]),mn(e,n[h],i),n[t]=null;u++}else _n(n[p]),p--;else _n(n[h]),h++;for(;u<=m;){const t=mn(e,l[m+1]);fn(t,a[u]),l[u++]=t}for(;h<=p;){const e=n[h++];null!==e&&_n(e)}return this.ut=o,vn(e,l),dt}}),pl=["type","label","description","default","required","group","pattern","allowed","domain","device_class","min","max","step","unit","multiline","selector"];function ul(e){const t={};for(const s of pl){const i=e[s];void 0!==i&&(t[s]=i)}Object.assign(t,e.extra);const i={name:e.name};for(const s of e.order)s in t&&(i[s]=t[s]);for(const s of Object.keys(t))s in i||(i[s]=t[s]);return i}function ml(e){return!!e&&"object"==typeof e&&!Array.isArray(e)}function fl(e,t){const i=e.map(ul);if("mapping"===t){const e={};for(const t of i){const{name:i}=t,s=Qe(t,["name"]),n=Object.keys(s);n.length?1!==n.length||"default"!==n[0]||ml(s.default)||null===s.default?e[String(i)]=s:e[String(i)]=s.default:e[String(i)]=null}return e}if("none"!==t||i.length)return i}function gl(e,t){const i=new Set(e.map(e=>e.name));if(!i.has(t))return t;let s=2;for(;i.has(`${t}_${s}`);)s+=1;return`${t}_${s}`}function vl(e,t,i){const s=Object.assign(Object.assign({},e),{extra:Object.assign({},e.extra)});return void 0===i?delete s[t]:s[t]=i,s}function _l(e){return void 0!==e.type?String(e.type):e.selector&&"object"==typeof e.selector&&"card"in e.selector?"card":""}const yl=e=>Array.isArray(e)?e.map(String).join(", "):null==e?"":String(e),bl=e=>{const t=e.split(",").map(e=>e.trim()).filter(Boolean);return t.length?t:void 0};class $l extends _{constructor(){super(...arguments),this._reorderedAsList=!1,this.shared=[],this._asYaml=!1,this._picking=!1}static get styles(){return y`
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
    `}get _rows(){return function(e){var t;const i=[];for(const s of He(e)){if(!s||"object"!=typeof s)continue;const e={name:"string"==typeof s.name?s.name:String(null!==(t=s.name)&&void 0!==t?t:""),extra:{},order:Object.keys(s).filter(e=>"name"!==e)};for(const[t,i]of Object.entries(s))"name"!==t&&(pl.includes(t)?e[t]=i:e.extra[t]=i);i.push(e)}return i}(this.variables)}get _shape(){const e=(t=this.variables,Array.isArray(t)?"list":t&&"object"==typeof t?"mapping":"none");var t;return"none"===e?"list":e}render(){const t=this._rows;return e`
      ${this._asYaml?this._renderYaml():this._renderRows(t)}
      ${this._reorderedAsList?e`<p class="hint">${l("declarations.reordered_as_list",void 0,this.hass)}</p>`:Ge}
      <div class="add">
        <ha-button @click=${this._add}>${l("declarations.add",void 0,this.hass)}</ha-button>
        ${this.shared.length?e`<ha-button
                appearance="plain"
                @click=${()=>{this._picking=!this._picking}}
                >${l("declarations.take_shared",void 0,this.hass)}</ha-button
              >`:Ge}
        <span class="spacer"></span>
        <ha-button
          appearance="plain"
          @click=${()=>{this._asYaml=!this._asYaml}}
          >${l(this._asYaml?"declarations.as_rows":"declarations.as_yaml",void 0,this.hass)}</ha-button
        >
      </div>
      ${this._picking?this._renderShared(t):Ge}
    `}_renderRows(t){if(!t.length)return e`<div class="rows">
        <div class="empty">${l("declarations.none",void 0,this.hass)}</div>
      </div>`;const i=function(e){return e.map((t,i)=>{const s=void 0===t.group?void 0:String(t.group),n=i?e[i-1].group:void 0;return void 0!==s&&s!==(void 0===n?void 0:String(n))?s:void 0})}(t);return e`<div class="rows">
      ${hl(t,e=>e.name,(s,n)=>e`
          ${void 0!==i[n]?e`<div class="group">${i[n]}</div>`:Ge}
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
              aria-label=${l("template_editor.drag_hint",void 0,this.hass)}
              .path=${nn}
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
                .label=${l(this._open===s.name?"declarations.less":"declarations.more",void 0,this.hass)}
                @click=${()=>{this._open=this._open===s.name?void 0:s.name}}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,15L12,10L17,15H7Z"}
                .disabled=${0===n}
                .label=${l("template_editor.move_up",{name:s.name},this.hass)}
                @click=${()=>this._move(n,n-1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,10L12,15L17,10H7Z"}
                .disabled=${n===t.length-1}
                .label=${l("template_editor.move_down",{name:s.name},this.hass)}
                @click=${()=>this._move(n,n+1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                .label=${l("declarations.remove",{name:s.name},this.hass)}
                @click=${()=>this._remove(n)}
              ></ha-icon-button>
            </div>
          </div>
          ${this._open===s.name?this._renderMore(s,n):Ge}
        `)}
    </div>`}_renderMore(t,i){const s={description:t.description,group:t.group,pattern:t.pattern,domain:yl(t.domain),device_class:yl(t.device_class),min:t.min,max:t.max,step:t.step,unit:t.unit,allowed:yl(t.allowed),multiline:t.multiline};return e`<div class="more">
      <ha-form
        .hass=${this.hass}
        .data=${s}
        .schema=${function(e,t){const i=_l(e),s={name:"description",label:l("declarations.description",void 0,t),selector:{text:{multiline:!0}}},n=[{name:"group",label:l("declarations.group",void 0,t),selector:{text:{}}}],a="entity"===i?[{name:"domain",label:l("declarations.domain",void 0,t),selector:{text:{}}},{name:"device_class",label:l("declarations.device_class",void 0,t),selector:{text:{}}}]:"number"===i?[{name:"min",label:l("declarations.min",void 0,t),selector:{number:{mode:"box"}}},{name:"max",label:l("declarations.max",void 0,t),selector:{number:{mode:"box"}}},{name:"step",label:l("declarations.step",void 0,t),selector:{number:{mode:"box"}}},{name:"unit",label:l("declarations.unit",void 0,t),selector:{text:{}}}]:"select"===i?[{name:"allowed",label:l("declarations.allowed",void 0,t),selector:{text:{}}}]:"text"===i?[{name:"multiline",label:l("declarations.multiline",void 0,t),selector:{boolean:{}}}]:[],o="card"===i?[]:[{name:"pattern",label:l("declarations.pattern",void 0,t),selector:{text:{}}}];return[s,{name:"",type:"grid",column_min_width:"260px",schema:[...n,...a,..."select"!==i&&void 0!==e.allowed?[{name:"allowed",label:l("declarations.allowed",void 0,t),selector:{text:{}}}]:[],...o]}]}(t,this.hass)}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        @value-changed=${e=>this._moreChanged(e,i)}
      ></ha-form>
      ${void 0!==t.selector&&"card"!==_l(t)?e`<ha-form
              .hass=${this.hass}
              .data=${{selector:t.selector}}
              .schema=${[{name:"selector",label:l("declarations.selector",void 0,this.hass),selector:{object:{}}}]}
              .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
              @value-changed=${e=>this._selectorChanged(e,i)}
            ></ha-form>`:Ge}
    </div>`}_renderYaml(){return e`<ha-form
      .hass=${this.hass}
      .data=${{variables:this.variables}}
      .schema=${[{name:"variables",label:l("template_editor.declarations_label",void 0,this.hass),helper:l("template_editor.declarations_helper",void 0,this.hass),selector:{object:{}}}]}
      .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
      .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
      @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value.variables)}}
    ></ha-form>`}_renderShared(t){const i=new Set(t.map(e=>e.name)),s=this.shared.filter(e=>!i.has(e.name));return e`<div class="pick">
      ${l("declarations.take_shared_hint",void 0,this.hass)}
      ${s.length?e`<ul>
              ${s.map(t=>e`<li>
                    <a @click=${()=>this._takeShared(t)}>${t.name}</a>
                    ${t.label?e` - ${t.label}`:Ge}
                  </li>`)}
            </ul>`:e`<p>${l("declarations.take_shared_none",void 0,this.hass)}</p>`}
    </div>`}_rowData(e){const t=void 0===e.default||["string","number","boolean"].includes(typeof e.default);return{name:e.name,type:_l(e),label:e.label,default:t?void 0===e.default?void 0:String(e.default):e.default,required:!0===e.required}}_rowSchema(e){const t=void 0===e.default||["string","number","boolean"].includes(typeof e.default),[i]=(s=this.hass,[{name:"",type:"grid",column_min_width:"120px",schema:[{name:"name",label:l("declarations.name",void 0,s),selector:{text:{}}},{name:"type",label:l("declarations.type",void 0,s),selector:{select:{mode:"dropdown",options:[{value:"",label:l("declarations.type_any",void 0,s)},...ht.map(e=>({value:e,label:l(`type_name.${e}`,void 0,s)})),{value:"card",label:l("type_name.card",void 0,s)}]}}},{name:"label",label:l("declarations.label",void 0,s),selector:{text:{}}},{name:"default",label:l("declarations.default",void 0,s),selector:{text:{}}},{name:"required",label:l("declarations.required",void 0,s),selector:{boolean:{}}}]}]);var s;if(t)return[i];const n=i.schema.map(e=>"default"===e.name?(e=>({name:"default",label:l("declarations.default",void 0,e),selector:{object:{}}}))(this.hass):e);return[Object.assign(Object.assign({},i),{schema:n})]}_rowChanged(e,t){var i,s;e.stopPropagation();const n=this._rows,a=n[t];if(!a)return;const o=e.detail.value;let r=a;const l="string"==typeof o.name?o.name.trim():a.name;l&&l!==a.name&&(r=vl(r,"name",gl(n.filter((e,i)=>i!==t),l)),this._open===a.name&&(this._open=r.name)),(null!==(i=o.type)&&void 0!==i?i:"")!==_l(a)&&(r=function(e,t){let i=vl(e,"type",void 0);return i=vl(i,"selector",void 0),"card"===t?vl(i,"selector",{card:{}}):t?vl(i,"type",t):i}(r,String(null!==(s=o.type)&&void 0!==s?s:""))),r=vl(r,"label","string"==typeof o.label&&""!==o.label?o.label:void 0),r=vl(r,"required",!0===o.required||void 0),o.default===a.default||""===o.default&&void 0===a.default||(r=vl(r,"default",this._defaultFrom(o.default,a))),this._emit(fl(n.map((e,i)=>i===t?r:e),this._shape))}_defaultFrom(e,t){if(""===e||null==e)return;if("string"!=typeof e)return e;const i=_l(t);return"number"!==i||""===e.trim()||Number.isNaN(Number(e))?"boolean"===i&&["true","false"].includes(e.trim().toLowerCase())?"true"===e.trim():e:Number(e)}_moreChanged(e,t){e.stopPropagation();const i=this._rows,s=i[t];if(!s)return;const n=e.detail.value;let a=s;const o=e=>"string"==typeof e&&e.trim()?e:void 0;a=vl(a,"description",o(n.description)),a=vl(a,"group",o(n.group)),a=vl(a,"pattern",o(n.pattern)),a=vl(a,"unit",o(n.unit));for(const l of["min","max","step"])a=vl(a,l,"number"==typeof n[l]?n[l]:void 0);a=vl(a,"multiline",!0===n.multiline||void 0);const r=e=>{const t="string"==typeof e?bl(e):void 0;return void 0===t?void 0:1===t.length?t[0]:t};a=vl(a,"domain",r(n.domain)),a=vl(a,"device_class",r(n.device_class)),a=vl(a,"allowed","string"==typeof n.allowed?bl(n.allowed):void 0),this._emit(fl(i.map((e,i)=>i===t?a:e),this._shape))}_selectorChanged(e,t){e.stopPropagation();const i=this._rows,s=e.detail.value.selector,n=vl(i[t],"selector",s&&"object"==typeof s?s:void 0);this._emit(fl(i.map((e,i)=>i===t?n:e),this._shape))}_add(){const e=this._rows,t=function(e,t="variable"){return{name:gl(e,t),extra:{},order:[]}}(e);this._open=t.name,this._emit(fl([...e,t],this._shape))}_takeShared(e){const t=this._rows,i={name:e.name,extra:{},order:[]};this._picking=!1,this._emit(fl([...t,i],this._shape))}_remove(e){const t=this._rows;this._emit(fl(t.filter((t,i)=>i!==e),this._shape))}_move(e,t){const i=this._rows,s=function(e,t,i){if(t===i||t<0||i<0||t>=e.length||i>=e.length)return e;const s=[...e],[n]=s.splice(t,1);return s.splice(i,0,n),s}(i,e,t);if(s===i)return;const n="mapping"===this._shape?"list":this._shape;this._reorderedAsList="mapping"===this._shape,this._emit(fl(s,n))}_drop(e,t){e.preventDefault();const i=this._dragging;this._dragging=void 0,void 0!==i&&this._move(i,t)}_emit(e){b(this,"value-changed",{value:e})}}f([g({attribute:!1})],$l.prototype,"hass",void 0),f([g({attribute:!1})],$l.prototype,"variables",void 0),f([v()],$l.prototype,"_reorderedAsList",void 0),f([g({attribute:!1})],$l.prototype,"shared",void 0),f([v()],$l.prototype,"_open",void 0),f([v()],$l.prototype,"_asYaml",void 0),f([v()],$l.prototype,"_picking",void 0);const wl="decluttering-declarations-editor";customElements.get(wl)||customElements.define(wl,$l);const xl=["name","title","label","entity","area","room"];function kl(e,t){const i=Object.assign({},d(t)),s=null==e?void 0:e.examples,n=null==s?[]:Array.isArray(s)?s:[s];return Object.assign(Object.assign({},e),{examples:[...n,i]})}class jl extends _{static get styles(){return y`
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
    `}render(){var t;const i=this.config,s=null==i?void 0:i.template;if(!i||!s)return e``;const n=V(i),a=pt.get(s),o=void 0===a||a>=n.length?"":String(a),r=null!==(t=T(this.lovelace,void 0,i)[s])&&void 0!==t?t:i,c=n.length?ut({[s]:r},[],this.hass):[],h=n.length-c.length,p=""===o?void 0:c.find(e=>e.example===Number(o)+1),u=[{name:"example",label:l("template_editor.preview_example_label",void 0,this.hass),selector:{select:{mode:"dropdown",options:[{value:"",label:l("template_editor.preview_defaults",void 0,this.hass)},...n.map((e,t)=>{const i=function(e){const t=d(e);for(const s of xl){const e=t[s];if("string"==typeof e&&e.trim())return e.trim();if("number"==typeof e)return String(e)}const i=e.map(U).find(e=>void 0!==e);if(void 0!==i){const e=t[i];if("string"==typeof e||"number"==typeof e)return`${i}: ${e}`}}(e),s=l("template_editor.example_n",{number:t+1},this.hass);return{value:String(t),label:i?`${s}: ${i}`:s}})]}}}];return e`
      <div class="strip">
        <ha-form
          .hass=${this.hass}
          .data=${{example:o}}
          .schema=${u}
          .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
          @value-changed=${this._picked}
        ></ha-form>
        ${n.length?e`<span class="passes ${h<n.length?"some":""}"
                >${l("template_editor.examples_pass",{passes:h,total:n.length},this.hass)}</span
              >`:Ge}
        <ha-icon-button
          .path=${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}
          .label=${l("template_editor.example_add",void 0,this.hass)}
          @click=${this._add}
        ></ha-icon-button>
      </div>
      ${p?e`<ha-alert alert-type="warning"
              >${l("tools.health_example",{template:s,number:p.example,problems:p.problems.join(" ")},this.hass)}</ha-alert
            >`:Ge}
    `}_picked(e){var t;e.stopPropagation();const i=null===(t=this.config)||void 0===t?void 0:t.template;if(!i)return;const s=e.detail.value.example;void 0===s||""===s?pt.delete(i):pt.set(i,Number(s)),window.dispatchEvent(new CustomEvent(mt,{detail:{template:i}})),this.dispatchEvent(new CustomEvent("example-picked",{detail:{template:i,example:""===s?void 0:Number(s)},bubbles:!0,composed:!0})),this.requestUpdate()}_add(){const e=this.config;if(!e)return;const t=V(e),i=pt.get(e.template),s=void 0!==i&&t[i]?t[i]:m(Ne(e));b(this,"config-changed",{config:kl(e,s)})}}f([g({attribute:!1})],jl.prototype,"hass",void 0),f([g({attribute:!1})],jl.prototype,"lovelace",void 0),f([g({attribute:!1})],jl.prototype,"config",void 0);const Al="decluttering-example-strip";customElements.get(Al)||customElements.define(Al,jl);const Sl=Z({states:{"light.kitchen_ceiling":{entity_id:"light.kitchen_ceiling",state:"on",attributes:{friendly_name:"Kitchen ceiling",brightness:180}},"sensor.garden_temperature":{entity_id:"sensor.garden_temperature",state:"14.6",attributes:{friendly_name:"Garden temperature",unit_of_measurement:"°C",device_class:"temperature"}},"binary_sensor.bedroom_window":{entity_id:"binary_sensor.bedroom_window",state:"off",attributes:{friendly_name:"Bedroom window",device_class:"window"}},"input_select.house_mode":{entity_id:"input_select.house_mode",state:"night",attributes:{friendly_name:"House mode",options:["day","night","away"]}}},entities:{"light.kitchen_ceiling":{entity_id:"light.kitchen_ceiling",device_id:"kitchen_hue",labels:["evening"]},"sensor.garden_temperature":{entity_id:"sensor.garden_temperature",device_id:"garden_aqara",labels:[]},"binary_sensor.bedroom_window":{entity_id:"binary_sensor.bedroom_window",area_id:"bedroom",icon:"mdi:window-closed-variant",labels:[]},"input_select.house_mode":{entity_id:"input_select.house_mode",labels:[]}},devices:{kitchen_hue:{id:"kitchen_hue",name:"Hue ceiling",manufacturer:"Signify",model:"Hue White",area_id:"kitchen"},garden_aqara:{id:"garden_aqara",name:"Garden sensor",manufacturer:"Aqara",model:"WSDCGQ11LM",area_id:"back_garden"}},areas:{kitchen:{area_id:"kitchen",name:"Kitchen",floor_id:"ground_floor",icon:"mdi:fridge"},back_garden:{area_id:"back_garden",name:"Back Garden",floor_id:null,icon:null},bedroom:{area_id:"bedroom",name:"Bedroom",floor_id:"first_floor",icon:"mdi:bed"}},floors:{ground_floor:{floor_id:"ground_floor",name:"Ground floor",icon:"mdi:home-floor-0"},first_floor:{floor_id:"first_floor",name:"First floor",icon:"mdi:home-floor-1"}},labels:{evening:{label_id:"evening",name:"Evening lights"}},language:"en",locale:{language:"en"},localize:()=>""},["light.kitchen_ceiling","sensor.garden_temperature","binary_sensor.bedroom_window","input_select.house_mode"]);function Ol(e,t,i,s={},n=Sl){const a=u(e,s,{value:t},null==s?void 0:s.template,n,!0,e=>e.forEach(e=>i.add(e.split("|")[0].replace(/\?$/,""))));return{value:null==a?void 0:a.value,removed:!a||!("value"in a)}}function Cl(e){return e.removed?{value:void 0,kind:"removed"}:{value:e.value,kind:(t=e.value,null===t?"null":Array.isArray(t)?"list":"object"==typeof t?"mapping":"number"==typeof t?"number":"boolean"==typeof t?"boolean":"string"==typeof t&&/\[\[[^\]]/.test(t)?"unresolved":"text")};var t}function El(e,t,i,s){return function(e,t,i,s){const n=new Set,a=Cl(Ol(e,t,n,i,s)),o=Ol(e,`<${t}>`,new Set,i,s),r=[],l=function(e){const t=e.trim();if(!t.startsWith("[[")||!t.endsWith("]]"))return;const i=[];let s=0,n="";for(let r=2;r<t.length-2;r+=1){const e=t.slice(r,r+2);if("[["===e)s+=1,n+=e,r+=1;else if("]]"===e){if(0===s)return;s-=1,n+=e,r+=1}else"|"===t[r]&&0===s?(i.push(n),n=""):n+=t[r]}if(0!==s)return;i.push(n);const a=i.length-1,o=i[a].endsWith("?");return o&&(i[a]=i[a].slice(0,-1)),{name:i[0],steps:i.slice(1),optional:o}}(t);if(l&&l.steps.length)for(let c=0;c<=l.steps.length;c+=1){const t=`[[${[l.name,...l.steps.slice(0,c)].join("|")}${c===l.steps.length&&l.optional?"?":""}]]`;r.push(Object.assign({written:t,step:0===c?l.name:l.steps[c-1]},Cl(Ol(e,t,new Set,i,s))))}return{steps:r,whole:a,inText:"string"==typeof o.value?o.value.slice(1,-1):void 0,unset:[...n]}}(t,i,null!=e?e:{},null!=s?s:Sl)}const Tl=["card","badge","row","element","group","style","let","default","defaults","grid_options","name"],Nl="[^[\\]]*",Pl=new RegExp(`\\[\\[(?:${Nl}|${`\\[\\[(?:${Nl}|${`\\[\\[${Nl}\\]\\]`})*\\]\\]`})*\\]\\]`,"g");function Ll(e){var t;const i=[];for(const s of null!==(t=e.match(Pl))&&void 0!==t?t:[])s.startsWith("[[!")||i.includes(s)||i.push(s);return i}const Il=["slug","title","upper","default:","if:","bool","replace:","friendly_name","area","state"];class Fl extends _{constructor(){super(...arguments),this._expression="",this._more=!1}static get styles(){return y`
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
    `}render(){const t=this.config;if(!t||!this.hass)return e``;const i=function(e){if(!e||"object"!=typeof e)return[];const t=[];for(const i of Tl){const s=e[i];if(void 0===s)continue;const n="string"==typeof s?s:JSON.stringify(s);for(const e of Ll(n))t.includes(e)||t.push(e)}return t}(t),s=this._expression||i[0]||"",n=[{name:"placeholder",label:l("placeholder_tool.placeholder",void 0,this.hass),selector:{select:{mode:"dropdown",custom_value:!0,options:i.map(e=>({value:e,label:e}))}}}];return e`
      <ha-expansion-panel outlined>
        <span slot="header"
          >${l("placeholder_tool.header",void 0,this.hass)} <small>${this._exampleLabel()}</small></span
        >
        <div style="padding: 12px 4px 4px">
          <ha-form
            .hass=${this.hass}
            .data=${{placeholder:s}}
            .schema=${n}
            .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
            @value-changed=${this._picked}
          ></ha-form>
          <p class="hint">${l("placeholder_tool.hint",{count:i.length},this.hass)}</p>
          <div class="chips">
            <span>${l("placeholder_tool.add_step",void 0,this.hass)}</span>
            ${(this._more?[...ft,...gt.map(e=>`${e}:`)]:Il).map(t=>e`<span class="chip" @click=${()=>this._addStep(s,t)}>${t}</span>`)}
            ${this._more?Ge:e`<span
                    class="chip"
                    @click=${()=>{this._more=!0}}
                    >…</span
                  >`}
          </div>
          ${s?this._renderResult(s):Ge}
        </div>
      </ha-expansion-panel>
    `}_exampleLabel(){var e;const t=null===(e=this.config)||void 0===e?void 0:e.template,i=t?pt.get(t):void 0;return void 0===i?l("placeholder_tool.under_defaults",void 0,this.hass):l("placeholder_tool.under_example",{number:i+1},this.hass)}_result(e){var t;const i=this.config;if(!i)return;const s=null!==(t=T(this.lovelace,void 0,i)[i.template])&&void 0!==t?t:i,n=vt(s,pt.get(i.template)),a=null!=n?n:m(Ne(s));try{return El(s,a,e,this.hass)}catch(o){return}}_renderResult(t){const i=this._result(t);if(!i)return e``;if(i.error)return e`<ha-alert alert-type="error">${i.error}</ha-alert>`;const s=i.steps.length?i.steps:[],n=s.findIndex(e=>"unresolved"===e.kind);return e`
      <table>
        <thead>
          <tr>
            <th>${l("placeholder_tool.col_step",void 0,this.hass)}</th>
            <th>${l("placeholder_tool.col_gives",void 0,this.hass)}</th>
            <th>${l("placeholder_tool.col_from",void 0,this.hass)}</th>
          </tr>
        </thead>
        <tbody>
          ${s.map((e,t)=>this._renderStep(e,t,n,i))}
          <tr class=${"unresolved"===i.whole.kind?"bad":""}>
            <td class="code">${l("placeholder_tool.result",void 0,this.hass)}</td>
            <td class="code ${"unresolved"===i.whole.kind?"bad":""}">
              <span class="value">${this._shown(i.whole.value,i.whole.kind)}</span>
            </td>
            <td class="from">${l(`placeholder_tool.kind_${i.whole.kind}`,void 0,this.hass)}</td>
          </tr>
        </tbody>
      </table>
      <p class="hint">${l("placeholder_tool.steps_hint",void 0,this.hass)}</p>
    `}_renderStep(t,i,s,n){const a="unresolved"===t.kind&&(-1===s||i===s),o=void 0===t.value||""===t.value||"removed"===t.kind,r=0===i?n.unset.includes(t.step)?l("placeholder_tool.from_unset",void 0,this.hass):l("placeholder_tool.from_variables",void 0,this.hass):a?l("placeholder_tool.from_refused",void 0,this.hass):"";return e`<tr class=${a?"bad":""}>
      <td class="code">${t.step}</td>
      <td class="code ${a?"bad":o?"gap":""}">
        <span class="value"
          >${o&&!a?l("placeholder_tool.nothing",void 0,this.hass):this._shown(t.value,t.kind)}</span
        >
      </td>
      <td class="from">${r}</td>
    </tr>`}_shown(e,t){return"removed"===t?l("placeholder_tool.removed",void 0,this.hass):void 0===e?"":"string"==typeof e?e:JSON.stringify(e)}_picked(e){e.stopPropagation();const t=e.detail.value.placeholder;this._expression="string"==typeof t?t:""}_addStep(e,t){let i=e.trim()||"[[]]";const s=i.endsWith("?]]");i=i.replace(/\??\]\]$/,"");const n=i.slice(2),a=""===n?t:`${n}|${t}`;this._expression=`[[${a}${s?"?":""}]]`}}f([g({attribute:!1})],Fl.prototype,"hass",void 0),f([g({attribute:!1})],Fl.prototype,"lovelace",void 0),f([g({attribute:!1})],Fl.prototype,"config",void 0),f([v()],Fl.prototype,"_expression",void 0),f([v()],Fl.prototype,"_more",void 0);const Ml="decluttering-placeholder-tool";customElements.get(Ml)||customElements.define(Ml,Fl);const Vl="https://tempus2016.github.io/decluttering-card-plus/",Hl=`${Vl}help-index.json`,Dl={template:"Defining-Templates.html",type:"Defining-Templates.html",description:"Defining-Templates.html",category:"Defining-Templates.html",variables:"Describing-Variables.html",default:"Variables.html",defaults:"Variables.html",let:"Variables.html",extends:"Defining-Templates.html",examples:"Describing-Variables.html",for_each:"Repeating-a-Template.html",for_each_from:"Repeating-a-Template.html",columns:"Repeating-a-Template.html",min_column_width:"Repeating-a-Template.html",gap:"Styling.html",empty:"Repeating-a-Template.html",lazy:"Repeating-a-Template.html",style:"Styling.html",grid_options:"Styling.html",on_error:"Using-Templates.html",rebuild_on:"Using-Templates.html",debug:"Troubleshooting.html",strict:"Using-Templates.html",fit:"Styling.html",group:"Cards.html",publish:"Using-Templates.html",suggest_for:"Using-Templates.html",visibility:"Visibility.html"};let ql;function Rl(e=fetch){return null!=ql||(ql=e(Hl,{cache:"force-cache"}).then(async e=>{if(!e.ok)return{};return function(e){const t={};if(!e||"object"!=typeof e)return t;for(const[i,s]of Object.entries(e)){if(!s||"object"!=typeof s)continue;const e=s;"string"==typeof e.page&&"string"==typeof e.text&&"string"==typeof e.url&&(e.url.startsWith(Vl)&&(t[i]=Object.assign(Object.assign({key:i,page:e.page,heading:"string"==typeof e.heading?e.heading:"",text:e.text},"string"==typeof e.yaml?{yaml:e.yaml}:{}),{url:e.url})))}return t}(await e.json())}).catch(()=>({}))),ql}class zl extends _{constructor(){super(...arguments),this.key="",this._open=!1,this._loaded=!1}static get styles(){return y`
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
        aria-label=${l("help.button",{key:this.key},this.hass)}
        title=${l("help.button",{key:this.key},this.hass)}
        @click=${this._toggle}
        @keydown=${this._keydown}
      >
        ?
      </button>
      ${this._open?this._renderPop():Ge}
    `}_renderPop(){var t;const i=this._entry,s=null!==(t=null==i?void 0:i.url)&&void 0!==t?t:function(e){var t;return Vl+(null!==(t=Dl[e])&&void 0!==t?t:"Configuration-Reference.html")}(this.key);return e`
      <div class="pop" role="dialog" @keydown=${this._keydown}>
        ${i?e`
                <h5>${i.page}${i.heading?` · ${i.heading}`:""}</h5>
                <p>${i.text}</p>
                ${i.yaml?e`<pre>${i.yaml}</pre>`:Ge}
              `:e`<p>
                ${l(this._loaded?"help.not_in_index":"help.loading",{key:this.key},this.hass)}
              </p>`}
        <div class="foot">
          <a href=${s} target="_blank" rel="noopener noreferrer"
            >${l("help.open_page",void 0,this.hass)}</a
          >
          <span class="esc">${l("help.esc",void 0,this.hass)}</span>
        </div>
      </div>
    `}async _toggle(){this._open=!this._open,this._open&&!this._loaded&&(this._entry=await async function(e,t){return(await Rl(t))[e]}(this.key),this._loaded=!0)}_keydown(e){"Escape"===e.key&&this._open&&(e.stopPropagation(),this._open=!1)}}f([g({attribute:!1})],zl.prototype,"hass",void 0),f([g()],zl.prototype,"key",void 0),f([v()],zl.prototype,"_open",void 0),f([v()],zl.prototype,"_entry",void 0),f([v()],zl.prototype,"_loaded",void 0);const Ul="decluttering-help";customElements.get(Ul)||customElements.define(Ul,zl);const Wl=["card","badge","row","element"];function Bl(e,t,i=[]){if(Array.isArray(e))e.forEach((e,s)=>Bl(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,n]of Object.entries(e))Bl(n,t?`${t}.${s}`:s,i);else null!=e&&i.push({path:t,value:String(e)});return i}const Kl=["grid_options","visibility","view_layout","layout_options"];function Jl(e){const t={};for(const[i,s]of Object.entries(null!=e?e:{}))Kl.includes(i)||(t[i]=s);return t}function Yl(e){if(Array.isArray(e))return e.map(Yl);if(e&&"object"==typeof e){const t={};for(const i of Object.keys(e).sort())t[i]=Yl(e[i]);return t}return 0}function Zl(e,t=[],i=[]){if(Array.isArray(e))e.forEach((e,s)=>Zl(e,[...t,s],i));else if(e&&"object"==typeof e)for(const[s,n]of Object.entries(e))Zl(n,[...t,s],i);else i.push({path:t,value:e});return i}function Gl(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}function Ql(e){const t=new Map;e.forEach((e,i)=>{var s;if(!e||"object"!=typeof e||"string"!=typeof e.type)return;const n=Jl(e);if(JSON.stringify(n).includes("[["))return;const a=JSON.stringify([e.type,Yl(n)]);t.set(a,[...null!==(s=t.get(a))&&void 0!==s?s:[],i])});const i=[];for(const[s,n]of t){if(n.length<2)continue;const t=n.map(t=>Jl(e[t])),a=Zl(t[0]).map(e=>e.path).filter(e=>t.some(i=>JSON.stringify(Gl(i,e))!==JSON.stringify(Gl(t[0],e))));!a.length||a.length>8||i.push({indices:n,type:e[n[0]].type,differing:a,key:s})}return i.sort((e,t)=>t.indices.length-e.indices.length||e.indices[0]-t.indices[0])}const Xl=e=>e.replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value";function ec(e){const t=e[e.length-1];if("string"==typeof t)return Xl(t);const i=[...e].reverse().find(e=>"string"==typeof e);return Xl(`${null!=i?i:"item"}_${t+1}`)}function tc(e){const t=e.map(ec),i=[];return e.forEach((e,s)=>{const n=(a=t[s],t.filter(e=>e===a).length>1?function(e){return Xl(e.map(e=>"number"==typeof e?String(e+1):e).join("_"))}(e):t[s]);var a;i.push(Ns(n,i))}),i}function ic(e){var t;const i=e.map(Jl),s=null!==(t=i[0])&&void 0!==t?t:{},n=Zl(s).map(e=>e.path).filter(e=>i.some(t=>JSON.stringify(Gl(t,e))!==JSON.stringify(Gl(s,e)))),a=tc(n),o=JSON.parse(JSON.stringify(s));return n.forEach((e,t)=>{Gl(o,e.slice(0,-1))[e[e.length-1]]=`[[${a[t]}]]`}),{template:{card:o},names:a,variables:i.map(e=>n.map((t,i)=>({[a[i]]:Gl(e,t)}))),layout:e.map(e=>{const t={};for(const i of Kl)void 0!==(null==e?void 0:e[i])&&(t[i]=e[i]);return t})}}function sc(e,t,i){return Object.assign({type:"custom:decluttering-card-plus",template:e,variables:t},i)}const nc="_";function ac(e){let t="string"==typeof e?e:JSON.stringify(e);if("string"!=typeof t||!t.includes("[["))return[];const i=new Set;for(let s=0;s<5;s+=1){let e=!1;if(t=t.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(t,s)=>{if(e=!0,s.startsWith(We))return nc;const n=s.endsWith("?")?s.slice(0,-1):s,[a,...o]=n.split("|"),r=a.endsWith("?")?a.slice(0,-1):a;for(const e of[r,r.split(".")[0]])e&&e!==nc&&i.add(e);for(const e of o){const t=e.startsWith("or:")?e.slice(3):ze(e);t&&t!==nc&&i.add(t)}return nc}),!e)break}return[...i]}function oc(e,t=[]){if(Array.isArray(e)){for(const i of e)oc(i,t);return t}if(!e||"object"!=typeof e)return t;Me.includes(e.type)&&!0===e[wt]&&"string"==typeof e.template&&t.push(e.template);for(const i of Object.values(e))oc(i,t);return t}function rc(e,t,i=new Set){const s=new Set;if(!e)return{names:s,complete:!0};$t in e&&(e=Object.assign(Object.assign({},e),{default:e[$t]}));for(const a of P(e))s.add(a.name);for(const a of m(Ne(e))){const e=U(a);void 0!==e&&s.add(e)}for(const a of ac(e))s.add(a);let n=!0;for(const a of oc(e)){if(i.has(a))continue;if(i.add(a),!Object.prototype.hasOwnProperty.call(t,a)){n=!1;continue}const e=rc(t[a],t,i);for(const t of e.names)s.add(t);e.complete||(n=!1)}return{names:s,complete:n}}function lc(e,t){const i=new Map,s=(e,t,s,n)=>{const a=JSON.stringify([e.index,t,n.name,s]),o=i.get(a);o?(o.count+=1,!o.closest&&n.closest&&(o.closest=n.closest)):i.set(a,Object.assign(Object.assign({view:e,template:t,name:n.name},n.closest?{closest:n.closest}:{}),{where:s,count:1}))},n=(e,i,a)=>{var o,r;if(Array.isArray(e))for(const t of e)n(t,i,a);else if(e&&"object"==typeof e){if(Me.includes(e.type)&&"string"==typeof e.template){const n=Object.prototype.hasOwnProperty.call(t,e.template)?t[e.template]:void 0;if(n){const l=new Set,d=(o,r)=>{for(const d of function(e,t,i,s={lets:[],defaults:[]},n){if(!e)return[];const{names:a,complete:o}=rc(e,t);if(!o)return[];const r=new Set([...m(e.let),...s.lets].map(U).filter(e=>void 0!==e)),l=H(i),d=new Set(a);for(const c of ac(n))d.add(c);for(const c of[...s.lets,...s.defaults]){const e=U(c);if(void 0!==e)for(const t of ac(c[e]))d.add(t)}const h=e=>!r.has(e)&&(d.has(e)||d.has(e.split(".")[0]));let p=!0;const u=new Set;for(;p;){p=!1;for(const e of l){const t=U(e);if(!u.has(t)&&h(t)){u.add(t);for(const i of ac(e[t]))d.has(i)||(d.add(i),p=!0)}}}const f=new Set(l.map(e=>U(e))),g=[...d].filter(e=>!f.has(e)&&!r.has(e)),v=[];for(const m of f){if(h(m))continue;const e=c(m,g);v.push(e?{name:m,closest:e}:{name:m})}return v}(n,t,r,a,[e.on_error,e.for_each_from]))l.has(d.name)||(l.add(d.name),s(i,e.template,o,d))};d("variables",e.variables);for(const t of null!==(o=W(e.for_each))&&void 0!==o?o:[])d("for_each",t);const h=null===(r=e.for_each_from)||void 0===r?void 0:r.overrides;if(h&&"object"==typeof h)for(const e of Object.values(h))d("overrides",e)}}for(const t of Object.values(e))n(t,i,a)}};return yt(e,(t,i,s)=>{var a,o,r;const l=e.views[i];n(t,{title:null!==(o=null!==(a=null==l?void 0:l.title)&&void 0!==a?a:null==l?void 0:l.path)&&void 0!==o?o:"",path:null!==(r=null==l?void 0:l.path)&&void 0!==r?r:"",index:i},bt(e,i,s))}),[...i.values()].map(({view:e,template:t,name:i,closest:s,where:n,count:a})=>s?{view:e,template:t,name:i,closest:s,where:n,count:a}:{view:e,template:t,name:i,where:n,count:a})}function cc(e,t,i){if(!e.includes("[["))return e;const s=e.replace(/\[\[([^[\]]+)\]\]/g,(e,s)=>s.startsWith(We)?e:`[[${function(e,t,i){const s=e.endsWith("?"),n=(s?e.slice(0,-1):e).split("|"),a=n[0],o=a.endsWith("?"),r=o?a.slice(0,-1):a;(r===t||r.startsWith(`${t}.`))&&(n[0]=`${i}${r.slice(t.length)}${o?"?":""}`);for(let l=1;l<n.length;l+=1){const e=n[l];if(e===`or:${t}`)n[l]=`or:${i}`;else if(ze(e)===t){const s=e.startsWith("if:!")?"!":"";n[l]=`if:${s}${i}${e.slice(3+s.length+t.length)}`}}return`${n.join("|")}${s?"?":""}`}(s,t,i)}]]`);return s.replace(new RegExp(`\\[\\[${n=t,n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=\\.\\[\\[)`,"g"),`[[${i}`);var n}function dc(e,t,i){if("string"==typeof e)return cc(e,t,i);if(Array.isArray(e))return e.map(e=>dc(e,t,i));if(e&&"object"==typeof e){const s={};for(const[n,a]of Object.entries(e))s[cc(n,t,i)]=dc(a,t,i);return s}return e}function hc(e,t,i){const s=e=>!!e&&"object"==typeof e&&!Array.isArray(e),n=(e,t)=>s(e)&&Object.prototype.hasOwnProperty.call(e,t),a=e=>{if(!s(e))return e;const n={};for(const[s,a]of Object.entries(e))s!==i&&(n[s===t?i:s]=a);return n};return Array.isArray(e)?e.some(e=>n(e,t))?e.map(a).filter(e=>!s(e)||Object.keys(e).length>0):e:n(e,t)?a(e):e}function pc(e,t,i){const s=dc(e,t,i);return Array.isArray(s.variables)?s.variables=s.variables.map(e=>e&&"object"==typeof e&&e.name===t?Object.assign(Object.assign({},e),{name:i}):e):s.variables&&"object"==typeof s.variables&&(s.variables=hc(s.variables,t,i)),void 0!==s.default&&(s.default=hc(s.default,t,i)),void 0!==s.defaults&&(s.defaults=hc(s.defaults,t,i)),void 0!==s.let&&(s.let=hc(s.let,t,i)),s}function uc(e){const t=null==e?void 0:e.extends;return(Array.isArray(t)?t:[t]).filter(e=>"string"==typeof e)}function mc(e,t,i){const s=_t(e),n=new Set([t]);for(const o of null!=i?i:[])Object.prototype.hasOwnProperty.call(s,o)||n.add(o);let a=!0;for(;a;){a=!1;for(const[e,t]of Object.entries(s))!n.has(e)&&uc(t).some(e=>n.has(e))&&(n.add(e),a=!0)}return n}function fc(e){if(!e)return[];const t=new Set(Zs(e));for(const i of ac(e))i.includes(".")||"_"===i||t.add(i);return[...t].sort()}function gc(e,t,i,s,n){const a=mc(e,t,n);let o=0,r=0;const l=(e,t)=>JSON.stringify(e)!==JSON.stringify(t),c=e=>{if(Array.isArray(e))return e.map(c);if(!e||"object"!=typeof e)return e;let t={};for(const[i,s]of Object.entries(e))t[i]=c(s);if(Me.includes(e.type)&&a.has(e.template)){const e=function(e,t,i){var s;const n=Object.assign({},e);void 0!==n.variables&&(n.variables=hc(n.variables,t,i)),Array.isArray(n.for_each)?n.for_each=n.for_each.map(e=>hc(e,t,i)):void 0!==n.for_each&&(n.for_each=hc(n.for_each,t,i));const a=null===(s=n.for_each_from)||void 0===s?void 0:s.overrides;if(a&&"object"==typeof a&&!Array.isArray(a)){const e={};for(const[s,n]of Object.entries(a))e[s]=hc(n,t,i);n.for_each_from=Object.assign(Object.assign({},n.for_each_from),{overrides:e})}return"string"==typeof n.name&&(n.name=cc(n.name,t,i)),n}(t,i,s);l(e,t)&&(o+=1),t=e}if($(e.type)&&a.has(e.template)){const e=pc(t,i,s);l(e,t)&&(r+=1),t=e}return t},d=Object.assign({},e);Array.isArray(null==e?void 0:e.views)&&(d.views=c(e.views));const h=null==e?void 0:e.decluttering_templates;if(h&&"object"==typeof h){const e={};for(const[t,n]of Object.entries(h)){let o=c(n);if(a.has(t)){const e=pc(o,i,s);l(e,o)&&(r+=1),o=e}e[t]=o}d.decluttering_templates=e}return{config:d,cards:o,templates:r}}function vc(e,t,i){if(Object.prototype.hasOwnProperty.call(_t(e),t))return!1;if(i===xt)return!0;const s=kt(e);return s.includes(i)||s.includes("*")}class _c extends _{constructor(){super(...arguments),this._renameTo="",this._renaming=!1,this._duplicateTo="",this._busy=!1,this._modernisePending=!1,this._similarNames={},this._searchQuery="",this._searching=!1,this._varTo=""}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=te())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:E()}static get styles(){return rn}_fireConfigChanged(e){b(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return on(this,e,t,i)}render(){return this.hass&&this._config?this._renderUsages():e``}_renderUsages(){var t,i;const s=null===(t=this._config)||void 0===t?void 0:t.template;if(!s)return e``;const n=this._savedLovelace;if(!n)return e`<div class="usages">
        <ha-alert alert-type="warning">${l("template_editor.usages_unreadable",void 0,this.hass)}</ha-alert>
      </div>`;(null===(i=this._usages)||void 0===i?void 0:i.name)===s&&this._usages.ll===n||(this._usages={name:s,ll:n,usages:jt(n,s)});const{views:a,templates:o}=this._usages.usages,r=a.reduce((e,t)=>e+t.count,0),c=document.location.pathname.split("/").slice(0,2).join("/");return e`
      <div class="usages">
        ${0!==r||o.length?e`
                <p class="hint">
                  ${l(1===r?"template_editor.usages_one":"template_editor.usages_many",{total:r,name:s},this.hass)}
                </p>
                <ul>
                  ${a.map(t=>e`
                      <li>
                        <a href=${`${c}/${t.path||t.index}`} target="_blank" rel="noreferrer">
                          ${t.title||t.path||l("template_editor.untitled_view",void 0,this.hass)}
                        </a>
                        —
                        ${1===t.count?l("template_editor.used_once",void 0,this.hass):l("template_editor.used_times",{count:t.count},this.hass)}
                      </li>
                    `)}
                </ul>
              `:e`<ha-alert alert-type="info">
                ${l("template_editor.usages_none",{name:s},this.hass)}
              </ha-alert>`}
        ${o.length?e`<ha-alert alert-type="info">
                ${l(1===o.length?"template_editor.used_by_template":"template_editor.used_by_templates",{names:o.join(", ")},this.hass)}
              </ha-alert>`:e``}
        ${this._renderElsewhere(s)} ${this._renderImpact(n,s)}
        <decluttering-card-plus-health .hass=${this.hass} .lovelace=${n}
          >${this._renderUndo()}</decluttering-card-plus-health
        >
        ${this._renderSimilar(n)} ${this._renderSearch()} ${this._renderRename(s,r)}
        ${this._renderRenameVariable(s)} ${this._renderDuplicate(s)} ${this._renderModernise()}
        ${this._toolError?e`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:e``}
      </div>
    `}_renderUndo(){var t,i;const s=At();if(!s)return e``;const n=St(s.operation,this.hass),a=new Date(s.at).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language);return e`
      <div class="undo">
        <p class="hint">${l("undo.held",{operation:n,time:a},this.hass)}</p>
        ${this._undoChanged?e`<ha-alert alert-type="warning">
                ${l("undo.changed_here",{operation:n,dashboards:this._undoChanged.join(", ")},this.hass)}
              </ha-alert>`:e``}
        <ha-button .disabled=${this._busy} @click=${this._undo}>
          ${l(this._undoChanged?"undo.anyway_button":"undo.button",{operation:n},this.hass)}
        </ha-button>
      </div>
    `}async _undo(){const e=At();if(e){this._busy=!0;try{const t=await Ot(this,this.hass,e,!!this._undoChanged,!1);this._undoChanged="changed"===(null==t?void 0:t.result)?t.dashboards:void 0}finally{this._busy=!1}}}_renderSimilar(t){var i;if((null===(i=this._similar)||void 0===i?void 0:i.ll)!==t){const e=Ct(t);this._similar={ll:t,cards:e,groups:Ql(e.map(e=>e.config))}}const{cards:s,groups:n}=this._similar;if(!n.length)return e``;const a=Object.keys(T(t));return e`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${l(1===n.length?"tools.similar_header_one":"tools.similar_header",{count:n.length},this.hass)}
        </span>
        <p class="hint">${l("tools.similar_hint",{max:8},this.hass)}</p>
        ${n.slice(0,10).map(e=>this._renderSimilarGroup(e,s,a))}
      </ha-expansion-panel>
    `}_renderSimilarGroup(t,i,s){var n;const a=t.indices.map(e=>i[e]),o=ic(a.map(e=>e.config)),r=(null!==(n=this._similarNames[t.key])&&void 0!==n?n:function(e,t,i=[]){let s=Xl(e.replace(/^custom:/,"").replace(/-/g,"_")).toLowerCase();/(^|_)card$/.test(s)||(s=`${s}_card`);const n=new Set(i.map(e=>"string"==typeof(null==e?void 0:e.entity)&&e.entity.includes(".")?e.entity.split(".")[0]:"")),[a]=[...n];return 1===n.size&&a&&(s=`${Xl(a).toLowerCase()}_${s}`),Ns(s,t)}(t.type,s,a.map(e=>e.config))).trim(),c=this._similarPending===`${t.key}\0${r}`,d=s.includes(r);return e`
      <div class="similar">
        <h3>${l("tools.similar_group",{count:a.length,type:t.type},this.hass)}</h3>
        <p class="hint">${l("tools.similar_differ",{names:o.names.join(", ")},this.hass)}</p>
        <ul>
          ${a.slice(0,8).map(t=>e`<li>${t.label}</li>`)}
        </ul>
        ${a.length>8?e`<p class="hint">
                ${l("editor.matches_more",{count:a.length-8},this.hass)}
              </p>`:e``}
        ${d?e`<ha-alert alert-type="error">${l("tools.name_taken",{name:r},this.hass)}</ha-alert>`:e``}
        ${c?e`
                <ha-alert alert-type="warning">
                  ${l("tools.similar_confirm",{name:r,count:a.length},this.hass)}
                </ha-alert>
                <p class="hint">${l("tools.similar_template",{name:r},this.hass)}</p>
                ${yn(`${t.key}\0${r}`,e`<ha-yaml-editor
                    .hass=${this.hass}
                    .defaultValue=${{[r]:o.template}}
                    read-only
                  ></ha-yaml-editor>`)}
                <p class="hint">${l("tools.similar_first_card",void 0,this.hass)}</p>
                ${ol(a[0].config,sc(r,o.variables[0],o.layout[0]),this.hass)}
              `:e``}
        ${an({label:l("tools.similar_name",void 0,this.hass),value:r,disabled:this._busy,onInput:e=>{this._similarNames=Object.assign(Object.assign({},this._similarNames),{[t.key]:e}),this._similarPending=void 0}})}
        <ha-button
          .disabled=${this._busy||!r||d}
          @click=${()=>{this._makeTemplate(t,a,r)}}
        >
          ${l(c?"tools.similar_make_anyway":"tools.similar_make",void 0,this.hass)}
        </ha-button>
      </div>
    `}async _makeTemplate(e,t,i){const s=`${e.key}\0${i}`;if(this._similarPending!==s)return void(this._similarPending=s);const n=await this._saveDashboard(e=>function(e,t,i){const{template:s,variables:n,layout:a}=ic(t);let o=et(e,i,s);return t.forEach((e,t)=>{o=oe(o,e,sc(i,n[t],a[t]))}),o}(e,t.map(e=>e.config),i),"make_template");if(n){this._similarPending=void 0;const t=Object.assign({},this._similarNames);delete t[e.key],this._similarNames=t}}_renderElsewhere(t){var i;if((null===(i=this._remoteUsages)||void 0===i?void 0:i.name)!==t){this._remoteUsages={name:t,list:[]};const e=document.location.pathname.split("/").filter(Boolean)[0];Et(this.hass,t,e).then(e=>{var i;(null===(i=this._remoteUsages)||void 0===i?void 0:i.name)===t&&(this._remoteUsages={name:t,list:e})})}const s=this._remoteUsages.list;if(!s.length)return e``;const n=s.map(e=>`${e.urlPath} (${e.total})`).join(", ");return e`<ha-alert alert-type="info">
      ${l("template_editor.usages_elsewhere",{list:n},this.hass)}
    </ha-alert>`}_renderImpact(t,i){const s=Tt(t,i);if(!s||!this._config)return e``;const n=e=>{if(e)return u(s.variables,e,Y(e),i,this.hass,!0)};let a,o;try{a=n(T(t)[i]),o=n(T(t,void 0,this._config)[i])}catch(r){return e``}return e`
      <ha-expansion-panel outlined>
        <span slot="header">${l("template_editor.impact_header",void 0,this.hass)}</span>
        <p class="hint">${l("template_editor.impact_diff_hint",void 0,this.hass)}</p>
        ${rl(a,o,this.hass)}
      </ha-expansion-panel>
    `}_renderRename(t,i){const s=this._renameTo.trim(),n=!!s&&this._renamePending===s,a=i?1===i?l("tools.rewrites_one",void 0,this.hass):l("tools.rewrites_many",{count:i},this.hass):"";return e`
      <div class="rename">
        <h3>${l("tools.rename_header",void 0,this.hass)}</h3>
        <p class="hint">${l("tools.rename_hint",void 0,this.hass)}</p>
        ${this._renameError?e`<ha-alert alert-type="error">${this._renameError}</ha-alert>`:e``}
        ${n?e`<ha-alert alert-type="warning">
                ${l("tools.rename_confirm",{from:t,to:s,rewrites:a},this.hass)}
              </ha-alert>`:e``}
        ${an({label:l("tools.new_name",void 0,this.hass),value:this._renameTo,disabled:this._renaming,onInput:e=>this._renameChanged(e)})}
        <ha-button .disabled=${this._renaming||!s||s===t} @click=${this._rename}>
          ${n?l("tools.rename_anyway",void 0,this.hass):1===i?l("tools.rename_update_one",void 0,this.hass):i?l("tools.rename_update_many",{count:i},this.hass):l("tools.rename",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderModernise(){const t=this._savedLovelace,i=t?Nt(t):0;return i?e`
      <div class="rename">
        <h3>${l("tools.modernise_header",void 0,this.hass)}</h3>
        <p class="hint">
          ${l(1===i?"tools.modernise_hint_one":"tools.modernise_hint_many",{count:i},this.hass)}
        </p>
        ${this._modernisePending?e`<ha-alert alert-type="warning">
                ${l(1===i?"tools.modernise_confirm_one":"tools.modernise_confirm_many",{count:i},this.hass)}
              </ha-alert>`:e``}
        <ha-button .disabled=${this._busy} @click=${this._modernise}>
          ${l(this._modernisePending?"tools.modernise_anyway":1===i?"tools.modernise_one":"tools.modernise_many",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}async _modernise(){if(!this._modernisePending)return void(this._modernisePending=!0);await this._saveDashboard(e=>Pt(e),"modernise")&&(this._modernisePending=!1)}_renameChanged(e){this._renameTo=e,this._renameError=void 0,this._renamePending=void 0}async _rename(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._renameTo.trim();if(!i||!s||s===i)return;const n=te();if(n)if(void 0===T(n.config)[s])if(this._renamePending===s){this._renaming=!0,this._renameError=void 0;try{await se(this,this.hass,"rename_template",[{urlPath:ae(),build:e=>Lt(e,i,s)}],this._config),this._undoChanged=void 0,this._fireConfigChanged(Object.assign(Object.assign({},this._config),{template:s})),this._renameTo="",this._renamePending=void 0}catch(a){this._renameError=l("tools.save_failed",{message:null!==(t=null==a?void 0:a.message)&&void 0!==t?t:a},this.hass)}finally{this._renaming=!1}}else this._renamePending=s;else this._renameError=l("tools.name_taken",{name:s},this.hass);else this._renameError=l("tools.cannot_rename_here",void 0,this.hass)}_renderSearch(){const t=this._searchQuery.trim(),i=this._searchResult,s=e=>"variables"===e.where?"":l(`tools.search_in_${e.where}`,void 0,this.hass),n=e=>e.view.title||e.view.path||l("template_editor.untitled_view",void 0,this.hass);return e`
      <div class="rename">
        <h3>${l("tools.search_header",void 0,this.hass)}</h3>
        <p class="hint">${l("tools.search_hint",void 0,this.hass)}</p>
        ${an({label:l("tools.search_label",void 0,this.hass),value:this._searchQuery,onInput:e=>{this._searchQuery=e},onKeydown:e=>{"Enter"===e.key&&this._search()}})}
        <ha-button .disabled=${this._searching||!t} @click=${()=>{this._search()}}>
          ${l(this._searching?"tools.searching":"tools.search",void 0,this.hass)}
        </ha-button>
        ${!i||i.cards.length||i.templates.length?e``:e`<p class="hint">${l("tools.search_none",{query:i.query},this.hass)}</p>`}
        ${(null==i?void 0:i.cards.length)?e`
                <p class="hint">${l("tools.search_cards",{count:i.cards.length},this.hass)}</p>
                <ul>
                  ${i.cards.slice(0,Xs).map(t=>e`
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
                ${i.cards.length>Xs?e`<p class="hint">
                        ${l("editor.matches_more",{count:i.cards.length-Xs},this.hass)}
                      </p>`:e``}
              `:e``}
        ${(null==i?void 0:i.templates.length)?e`
                <p class="hint">${l("tools.search_templates",{count:i.templates.length},this.hass)}</p>
                <ul>
                  ${i.templates.slice(0,Xs).map(t=>e`<li>
                          ${t.urlPath} › ${t.template}: <code>${t.path}</code> = ${t.value}
                        </li>`)}
                </ul>
                ${i.templates.length>Xs?e`<p class="hint">
                        ${l("editor.matches_more",{count:i.templates.length-Xs},this.hass)}
                      </p>`:e``}
              `:e``}
      </div>
    `}async _search(){const e=this._searchQuery.trim();if(e&&!this._searching){this._searching=!0;try{const i=ae(),s=nt(this.hass),n=[{urlPath:i,config:this._savedLovelace}];for(const e of this.hass?await It(this.hass):[])if(Ft(e)!==i)try{n.push({urlPath:e,config:await at(s,e)})}catch(t){}this._searchResult=Object.assign({query:e},function(e,t){var i;const s=t.trim().toLowerCase(),n=[],a=[];if(!s)return{cards:n,templates:a};const o=e=>e.toLowerCase().includes(s);for(const{urlPath:r,config:l}of e){const e=(e,t)=>{var i,s;const a=(i,s,a)=>{n.push({urlPath:r,view:t,template:e.template,where:i,variable:s,value:a})},l=(e,t,i="")=>{for(const s of H(t)){const[t,n]=Object.entries(s)[0];for(const s of Bl(n,`${i}${t}`))o(s.value)&&a(e,s.path,s.value)}};l("variables",e.variables);for(const n of null!==(i=W(e.for_each))&&void 0!==i?i:[])l("for_each",n);const c=null===(s=e.for_each_from)||void 0===s?void 0:s.overrides;if(c&&"object"==typeof c)for(const[n,r]of Object.entries(c))o(n)&&a("overrides",n,n),l("overrides",r,`${n} › `);for(const n of Wl)if(void 0!==e[n])for(const t of Bl(e[n],n))o(t.value)&&a("override_block",t.path,t.value)},t=(i,s)=>{if(Array.isArray(i))for(const e of i)t(e,s);else if(i&&"object"==typeof i&&!$(i.type)){Me.includes(i.type)&&"string"==typeof i.template&&e(i,s);for(const e of Object.values(i))t(e,s)}};(null!==(i=null==l?void 0:l.views)&&void 0!==i?i:[]).forEach((e,i)=>{var s,n,a;return t(e,{title:null!==(n=null!==(s=null==e?void 0:e.title)&&void 0!==s?s:null==e?void 0:e.path)&&void 0!==n?n:"",path:null!==(a=null==e?void 0:e.path)&&void 0!==a?a:"",index:i})});for(const[i,s]of Object.entries(_t(l))){const e=Object.assign({},null!=s?s:{});delete e.type,delete e.template;for(const t of Bl(e,""))o(t.value)&&a.push(Object.assign({urlPath:r,template:i},t))}}return{cards:n,templates:a}}(n,e))}finally{this._searching=!1}}}_renderRenameVariable(t){const i=fc(this._config);if(!i.length||!this._config)return e``;const s=this._varFrom&&i.includes(this._varFrom)?this._varFrom:void 0,n=this._varTo.trim(),a=this._varPending,o=!!a&&a.from===s&&a.to===n,r=o&&a.elsewhere.length?l("tools.rename_variable_elsewhere",{list:a.elsewhere.map(e=>`${e.urlPath} (${e.cards})`).join(", ")},this.hass):"";return e`
      <div class="rename">
        <h3>${l("tools.rename_variable_header",void 0,this.hass)}</h3>
        <p class="hint">${l("tools.rename_variable_hint",void 0,this.hass)}</p>
        ${this._varError?e`<ha-alert alert-type="error">${this._varError}</ha-alert>`:e``}
        ${o&&s?e`
                <ha-alert alert-type="warning">
                  ${l("tools.rename_variable_confirm",{from:s,to:n,templates:a.templates,cards:a.cards,elsewhere:r},this.hass)}
                </ha-alert>
                ${ol(this._config,pc(this._config,s,n),this.hass)}
              `:e``}
        <ha-form
          .hass=${this.hass}
          .data=${{variable:null!=s?s:""}}
          .schema=${[{name:"variable",selector:{select:{mode:"dropdown",options:i.map(e=>({value:e,label:e}))}}}]}
          .computeLabel=${()=>l("tools.rename_variable_pick",void 0,this.hass)}
          @value-changed=${this._varPicked}
        ></ha-form>
        ${an({label:l("tools.new_name",void 0,this.hass),value:this._varTo,disabled:this._busy,onInput:e=>this._varToChanged(e)})}
        <ha-button
          .disabled=${this._busy||!s||!n||n===s}
          @click=${()=>{this._renameVariable(t)}}
        >
          ${l(o?"tools.rename_anyway":"tools.rename_variable",void 0,this.hass)}
        </ha-button>
      </div>
    `}_varPicked(e){e.stopPropagation(),this._varFrom=e.detail.value.variable||void 0,this._varError=void 0,this._varPending=void 0}_varToChanged(e){this._varTo=e,this._varError=void 0,this._varPending=void 0}async _renameVariable(e){var t;const i=this._varFrom,s=this._varTo.trim();if(!i||!s||s===i||!this._config)return;if(!function(e){return/^[A-Za-z0-9_-]+$/.test(e)}(s))return void(this._varError=l("tools.rename_variable_invalid",{name:s},this.hass));const n=te();if(!n)return void(this._varError=l("tools.cannot_save_here",void 0,this.hass));if(function(e,t,i,s){const n=_t(e);for(const a of mc(e,t))if(fc(a===t&&s?s:n[a]).includes(i))return!0;return!1}(n.config,e,s,this._config))return void(this._varError=l("tools.rename_variable_taken",{name:s},this.hass));const a=ae(),o=this._varPending;if(o&&o.from===i&&o.to===s){this._busy=!0,this._varError=void 0;try{let t;await se(this,this.hass,"rename_variable",[{urlPath:a,build:n=>(t=mc(n,e),gc(n,e,i,s).config)},...o.elsewhere.map(n=>({urlPath:n.urlPath,build:n=>vc(n,e,a)?gc(n,e,i,s,t).config:n}))],this._config),this._undoChanged=void 0,this._fireConfigChanged(pc(this._config,i,s)),this._varFrom=s,this._varTo="",this._varPending=void 0}catch(r){this._varError=l("tools.save_failed",{message:null!==(t=null==r?void 0:r.message)&&void 0!==t?t:r},this.hass)}finally{this._busy=!1}}else{this._busy=!0;try{const t=nt(this.hass),o=await at(t,a).catch(()=>n.config),r=gc(o,e,i,s),l=mc(o,e),d=[];for(const n of this.hass?await It(this.hass):[]){if(Ft(n)===a)continue;let o;try{o=await at(t,n)}catch(c){continue}if(!vc(o,e,a))continue;const r=gc(o,e,i,s,l);(r.cards||r.templates)&&d.push({urlPath:n,cards:r.cards})}this._varPending={from:i,to:s,cards:r.cards,templates:r.templates,elsewhere:d}}finally{this._busy=!1}}}_renderDuplicate(t){const i=this._duplicateTo.trim(),s=!!i&&this._duplicatePending===i;return e`
      <div class="rename">
        <h3>${l("tools.duplicate_header",void 0,this.hass)}</h3>
        <p class="hint">${l("tools.duplicate_hint",void 0,this.hass)}</p>
        ${s?e`<ha-alert alert-type="warning">
                ${l("tools.duplicate_confirm",{to:i,name:t},this.hass)}
              </ha-alert>`:e``}
        ${an({label:l("tools.copy_name",void 0,this.hass),value:this._duplicateTo,disabled:this._busy,onInput:e=>this._duplicateChanged(e)})}
        <ha-button .disabled=${this._busy||!i||i===t} @click=${this._duplicate}>
          ${l(s?"tools.duplicate_anyway":"tools.duplicate",void 0,this.hass)}
        </ha-button>
      </div>
    `}_duplicateChanged(e){this._duplicateTo=e,this._toolError=void 0,this._duplicatePending=void 0}async _duplicate(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._duplicateTo.trim();if(!i||!s||s===i)return;const n=te();if(n&&void 0!==T(n.config)[s])return void(this._toolError=l("tools.name_taken",{name:s},this.hass));if(this._duplicatePending!==s)return void(this._duplicatePending=s);const a=Object.assign(Object.assign({},this._config),{template:s}),o=le(null!==(t=null==n?void 0:n.config)&&void 0!==t?t:this.lovelace,i),r=await this._saveDashboard(e=>{var t,i;return tt(e,null!==(i=null===(t=null==o?void 0:o.view)||void 0===t?void 0:t.index)&&void 0!==i?i:0,a)},"duplicate");r&&(this._duplicateTo="",this._duplicatePending=void 0)}}f([g({attribute:!1})],_c.prototype,"hass",void 0),f([g({attribute:!1})],_c.prototype,"lovelace",void 0),f([g({attribute:!1})],_c.prototype,"config",void 0),f([v()],_c.prototype,"_renameTo",void 0),f([v()],_c.prototype,"_renameError",void 0),f([v()],_c.prototype,"_renaming",void 0),f([v()],_c.prototype,"_renamePending",void 0),f([v()],_c.prototype,"_duplicateTo",void 0),f([v()],_c.prototype,"_duplicatePending",void 0),f([v()],_c.prototype,"_toolError",void 0),f([v()],_c.prototype,"_busy",void 0),f([v()],_c.prototype,"_modernisePending",void 0),f([v()],_c.prototype,"_remoteUsages",void 0),f([v()],_c.prototype,"_undoChanged",void 0),f([v()],_c.prototype,"_similarNames",void 0),f([v()],_c.prototype,"_similarPending",void 0),f([v()],_c.prototype,"_searchQuery",void 0),f([v()],_c.prototype,"_searching",void 0),f([v()],_c.prototype,"_searchResult",void 0),f([v()],_c.prototype,"_varFrom",void 0),f([v()],_c.prototype,"_varTo",void 0),f([v()],_c.prototype,"_varError",void 0),f([v()],_c.prototype,"_varPending",void 0),customElements.get("decluttering-template-usages-tab")||customElements.define("decluttering-template-usages-tab",_c);class yc extends _{constructor(){super(...arguments),this._selectedTab="settings",this._suggestedNothing=!1,this._busy=!1,this._declutterPending=!1,this._promoteName="",this._loadedElements=!1}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=te())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:E()}static describeSchema(){var e;return null!==(e=yc._describeSchema)&&void 0!==e||(yc._describeSchema=[{name:"template",label:l("template_editor.template_label"),selector:{text:{}}},{name:"thingType",label:l("template_editor.type_label"),selector:{select:{mode:"dropdown",options:[{value:"card",label:l("template_editor.type_card")},{value:"badge",label:l("template_editor.type_badge")},{value:"row",label:l("template_editor.type_row")},{value:"element",label:l("template_editor.type_element")}]}}},{name:"description",label:l("template_editor.description_label"),helper:l("template_editor.description_helper"),selector:{text:{multiline:!0}}},{name:"category",label:l("template_editor.category_label"),helper:l("template_editor.category_helper"),selector:{text:{}}}]),yc._describeSchema}static defaultsSchema(){var e;return null!==(e=yc._defaultsSchema)&&void 0!==e||(yc._defaultsSchema=[{name:"default",label:l("template_editor.defaults_label"),helper:l("template_editor.defaults_helper"),selector:{object:{}}}]),yc._defaultsSchema}setConfig(e){this._config=e,this._suggestion=void 0,this._suggestedNothing=!1}render(){var t;if(!this.hass||!this._config)return e``;const i={};L(this._config.default)&&L(this._config.defaults)||(i.default=l("error.variables_shape",void 0,this.hass)),Mt(this._config.variables)||(i.variables=l("template_editor.declarations_shape",void 0,this.hass));const s={template:this._config.template,thingType:null!==(t=F(this._config))&&void 0!==t?t:"card",description:this._config.description,category:this._config.category},n={default:Ne(this._config)},a=P(this._config).length;return e`
      <ha-tab-group .active=${this._selectedTab} @click=${this._activateTab}>
        <ha-tab-group-tab slot="nav" panel="settings">
          ${l("template_editor.tab_settings",void 0,this.hass)}
        </ha-tab-group-tab>
        ${"card"===s.thingType&&void 0===this._config.group?e`
                <ha-tab-group-tab slot="nav" panel="card">
                  ${l("template_editor.tab_card",void 0,this.hass)}
                </ha-tab-group-tab>
                <ha-tab-group-tab slot="nav" panel="change_card">
                  ${l("template_editor.tab_change_card",void 0,this.hass)}
                </ha-tab-group-tab>
              `:"row"===s.thingType?e`<ha-tab-group-tab slot="nav" panel="row">
                  ${l("template_editor.tab_row",void 0,this.hass)}
                </ha-tab-group-tab>`:e``}
        <ha-tab-group-tab slot="nav" panel="usages">
          ${l("template_editor.tab_usages",void 0,this.hass)}
        </ha-tab-group-tab>
        <ha-tab-group-tab slot="nav" panel="share">
          ${l("template_editor.tab_share",void 0,this.hass)}
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
                <span slot="header">${l("template_editor.panel_describe",void 0,this.hass)}</span>
                <div class="panel">
                  ${this._renderInUse()}
                  ${yc.describeSchema().map(t=>e`
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
                  >${l("template_editor.panel_variables",void 0,this.hass)}
                  <small>${l("declarations.count",{count:a},this.hass)}</small></span
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
                    .shared=${Vt(this._savedLovelace)}
                    @value-changed=${this._declarationsChanged}
                  ></decluttering-declarations-editor>
                  <div class="field-row">
                    <ha-form
                      .hass=${this.hass}
                      .data=${n}
                      .schema=${yc.defaultsSchema()}
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
                <span slot="header">${l("template_editor.panel_tools",void 0,this.hass)}</span>
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
    `}_renderDiagnostics(){if(!this._config||!Mt(this._config.variables))return e``;const{unused:t,duplicated:i,contradictory:s}=Ht(this._config);return e`
      ${t.length?e`<ha-alert alert-type="info">
              ${l(1===t.length?"template_editor.declared_unused_one":"template_editor.declared_unused_many",{names:t.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${i.length?e`<ha-alert alert-type="warning">
              ${l(1===i.length?"template_editor.duplicated_one":"template_editor.duplicated_many",{names:i.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${s.length?e`<ha-alert alert-type="warning">
              ${l(1===s.length?"template_editor.contradictory_one":"template_editor.contradictory_many",{names:s.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_renderLint(){if(!this._config)return e``;const t=this._savedLovelace,i=T(t,void 0,this._config)[this._config.template],s=Gs(this._config,[...Zs(i),...Object.keys(Q(t))]);return s.length?e`${s.map(t=>e`<ha-alert alert-type=${t.level}>
          ${l(t.key,t.params,this.hass)}${t.params.closest?l("error.did_you_mean",{closest:t.params.closest},this.hass):""}${t.path?l("lint.where",{path:t.path},this.hass):""}
        </ha-alert>`)}`:e``}_renderSortable(t,i,s){const n=(e,i)=>{e.preventDefault();const n=this._dragging;this._dragging=void 0,(null==n?void 0:n.list)===t&&s(n.from,i)};return e`
      <ul>
        ${i.map((a,o)=>e`
            <li
              draggable="true"
              @dragstart=${e=>{var i;this._dragging={list:t,from:o},null===(i=e.dataTransfer)||void 0===i||i.setData("text/plain",a.name),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}}
              @dragover=${e=>{var i;(null===(i=this._dragging)||void 0===i?void 0:i.list)===t&&e.preventDefault()}}
              @drop=${e=>n(e,o)}
              @dragend=${()=>{this._dragging=void 0}}
            >
              <ha-svg-icon class="handle" .path=${nn}></ha-svg-icon>
              <span>${a.label}</span>
              <span class="spacer"></span>
              <ha-icon-button
                .path=${"M7,15L12,10L17,15H7Z"}
                .disabled=${0===o}
                .label=${l("template_editor.move_up",{name:a.name},this.hass)}
                @click=${()=>s(o,o-1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,10L12,15L17,10H7Z"}
                .disabled=${o===i.length-1}
                .label=${l("template_editor.move_down",{name:a.name},this.hass)}
                @click=${()=>s(o,o+1)}
              ></ha-icon-button>
            </li>
          `)}
      </ul>
    `}_renderGroupOrder(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.group,s=Dt(i);if(void 0===i||s.length<2)return e``;const n=s.map((e,t)=>{var i,s,n,a;const o=null!==(n=null!==(s=null!==(i=null==e?void 0:e.name)&&void 0!==i?i:null==e?void 0:e.heading)&&void 0!==s?s:null==e?void 0:e.title)&&void 0!==n?n:null==e?void 0:e.entity,r=String(null!==(a=null==e?void 0:e.type)&&void 0!==a?a:"?").replace(/^custom:/,"");return{label:"string"==typeof o?`${r} (${o})`:r,name:`${t+1} ${r}`}});return e`
      <div class="order">
        <p class="hint">${l("template_editor.group_order_hint",void 0,this.hass)}</p>
        ${this._renderSortable("group",n,(e,t)=>{const n=be(s,e,t);n!==s&&this._config&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{group:qt(i,n)}))})}
      </div>
    `}_renderPromote(){const t=Vs(this._config);if(!this._config||!t)return e``;const i=function(e){const t=[],i=(e,s)=>{if(Array.isArray(e))e.forEach((e,t)=>i(e,[...s,t]));else if(e&&"object"==typeof e)for(const[t,n]of Object.entries(e))"type"===t&&"string"==typeof n||i(n,[...s,t]);else"string"==typeof e&&p.test(e)||s.length&&null!=e&&("string"!=typeof e&&"number"!=typeof e&&"boolean"!=typeof e||t.push({path:s,value:e,label:Hs(s)}))};return i(e,[]),t}(this._config[t]);if(!i.length)return e``;const s=this._promotePath?JSON.stringify(this._promotePath):"",n=e=>{const t=String(e);return t.length>40?`${t.slice(0,39)}…`:t};return e`
      <ha-expansion-panel outlined class="promote">
        <span slot="header">${l("template_editor.promote_header",void 0,this.hass)}</span>
        <p class="hint">${l("template_editor.promote_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${{setting:s}}
          .schema=${[{name:"setting",selector:{select:{mode:"dropdown",options:i.map(e=>({value:JSON.stringify(e.path),label:`${e.label} = ${n(e.value)}`}))}}}]}
          .computeLabel=${()=>l("template_editor.promote_pick",void 0,this.hass)}
          @value-changed=${this._promotePicked}
        ></ha-form>
        ${this._promotePath?e`
                ${an({label:l("template_editor.promote_name",void 0,this.hass),value:this._promoteName,onInput:e=>{this._promoteName=e,this._promoteError=void 0}})}
                ${this._promoteError?e`<ha-alert alert-type="error">${this._promoteError}</ha-alert>`:e``}
                <ha-button .disabled=${!this._promoteName.trim()} @click=${this._promote}>
                  ${l("template_editor.promote_button",void 0,this.hass)}
                </ha-button>
              `:e``}
      </ha-expansion-panel>
    `}_promotePicked(e){e.stopPropagation();const t=e.detail.value.setting;t&&(this._promotePath=JSON.parse(t),this._promoteName=function(e,t){const i=[...e].reverse().find(e=>"string"==typeof e),s=e[e.length-1];return Ns(("number"==typeof s?`${null!=i?i:"item"}_${s+1}`:null!=i?i:"value").replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value",t)}(this._promotePath,Ds(this._config)),this._promoteError=void 0)}_promote(){if(!this._config||!this._promotePath)return;const e=this._promoteName.trim(),t=function(e,t,i){if(!Fs.test(i))return{ok:!1,error:"name_invalid"};if(Ds(e).includes(i))return{ok:!1,error:"name_taken"};const s=Vs(e),n=s?function(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}(e[s],t):void 0;if(!s||null==n||"object"==typeof n)return{ok:!1,error:"gone"};const a={name:i,type:qs(n),default:n};return{ok:!0,template:Object.assign(Object.assign({},e),{[s]:Rs(e[s],t,`[[${i}]]`),variables:De(e.variables,[a])})}}(this._config,this._promotePath,e);t.ok?(this._promotePath=void 0,this._promoteName="",this._fireConfigChanged(t.template)):this._promoteError=l(`template_editor.promote_${t.error}`,{name:e},this.hass)}_renderInUse(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._savedLovelace;if(!i||!s)return e``;const{views:n,templates:a}=jt(s,i),o=n.reduce((e,t)=>e+t.count,0)+a.length;return o?e`<ha-alert alert-type="info">
      ${l(1===o?"template_editor.in_use_one":"template_editor.in_use_many",{total:o},this.hass)}
    </ha-alert>`:e``}_renderSuggest(t){var i;return t&&(null===(i=this._config)||void 0===i?void 0:i.card)?e`
      <div class="suggest">
        ${this._suggestedNothing?e`<ha-alert alert-type="info">
                ${l("template_editor.suggest_nothing",void 0,this.hass)}
              </ha-alert>`:e``}
        ${this._suggestion?e`<ha-alert alert-type="warning">
                ${l(1===this._suggestion.variables.length?"template_editor.suggest_confirm_one":"template_editor.suggest_confirm_many",{names:this._suggestion.variables.map(e=>e.name).join(", ")},this.hass)}
              </ha-alert>`:e``}
        <ha-button @click=${this._suggest}>
          ${l(this._suggestion?"template_editor.suggest_anyway":"template_editor.suggest_button",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}_suggest(){var e;if(!(null===(e=this._config)||void 0===e?void 0:e.card))return;if(this._suggestion){const e=Object.assign(Object.assign({},this._config),{card:this._suggestion.card});return e.variables=De(this._config.variables,this._suggestion.variables),this._suggestion=void 0,void this._fireConfigChanged(e)}this._suggestedNothing=!1;const t=P(this._config).map(e=>e.name),i=function(e,t){const i=new Set(t),s=[],n=new Map,a=(e,t)=>{const a=`${e.base} ${t}`,o=n.get(a);if(o)return o;let r=1,l=e.base;for(;i.has(l);)r+=1,l=`${e.base}_${r}`;return i.add(l),n.set(a,l),s.push({name:l,label:as(e,r),selector:e.selector,default:t}),l},o=e=>{if(Array.isArray(e))return e.map(o);if(!e||"object"!=typeof e)return e;const t={};for(const[i,s]of Object.entries(e)){const e=Object.prototype.hasOwnProperty.call(ns,i)?ns[i]:void 0;e&&"string"==typeof s&&!p.test(s)&&e.matches(s)?t[i]=`[[${a(e,s)}]]`:t[i]=o(s)}return t};return{card:o(e),variables:s}}(this._config.card,t);i.variables.length?this._suggestion=i:this._suggestedNothing=!0}_renderDeclutter(){var t,i;const s=this._savedLovelace,n=Ct(s),a="card"===F(null!==(t=this._config)&&void 0!==t?t:{})?Rt(s):[];if(!n.length&&!a.length||!this._config)return e``;const o=this._config.template,r=!!o&&o in T(s),c=null!==(i=this._declutterOriginal)&&void 0!==i?i:this._declutterSection;return e`
      <ha-expansion-panel outlined>
        <span slot="header">${l("template_editor.declutter_header",void 0,this.hass)}</span>
        <p class="hint">${l("template_editor.declutter_hint",void 0,this.hass)}</p>
        ${n.length?e`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:n.map((e,t)=>({value:String(t),label:e.label}))}}}]}
                .computeLabel=${()=>l("template_editor.declutter_pick",void 0,this.hass)}
                @value-changed=${e=>this._declutterPicked(e,n)}
              ></ha-form>`:e``}
        ${a.length?e`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:a.map((e,t)=>({value:String(t),label:l(1===e.cards.length?"template_editor.declutter_section_one":"template_editor.declutter_section_many",{where:e.label,count:e.cards.length},this.hass)}))}}}]}
                .computeLabel=${()=>l("template_editor.declutter_pick_section",void 0,this.hass)}
                @value-changed=${e=>this._declutterSectionPicked(e,a)}
              ></ha-form>`:e``}
        ${c?e`
                <ha-button .disabled=${this._busy||!r} @click=${this._declutterReplace}>
                  ${l(this._declutterPending?"template_editor.declutter_replace_confirm":this._declutterSection?"template_editor.declutter_replace_section":"template_editor.declutter_replace",void 0,this.hass)}
                </ha-button>
                ${r?e``:e`<p class="hint">${l("template_editor.declutter_save_first",void 0,this.hass)}</p>`}
              `:e``}
      </ha-expansion-panel>
    `}_declutterPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterOriginal=i.config,this._declutterSection=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{card:JSON.parse(JSON.stringify(i.config))});delete s.group,this._fireConfigChanged(s)}_declutterSectionPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterSection={view:i.view,section:i.section,cards:i.cards},this._declutterOriginal=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{group:{cards:JSON.parse(JSON.stringify(i.cards))}});delete s.card,this._fireConfigChanged(s)}async _declutterReplace(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.template,i=this._declutterOriginal,s=this._declutterSection;if(!t||!i&&!s)return;if(!this._declutterPending)return void(this._declutterPending=!0);const n={type:"custom:decluttering-card-plus",template:t};let a=!1;const o=await this._saveDashboard(e=>{if(i)return oe(e,i,n);const t=zt(e,s.view,s.section,s.cards,[n]);return a=t===e,t},"declutter");o&&a&&(this._toolError=l("template_editor.declutter_section_changed",void 0,this.hass)),o&&(this._declutterPending=!1,this._declutterOriginal=void 0,this._declutterSection=void 0)}_selectTab(e){e.stopPropagation(),this._selectedTab=e.detail}_activateTab(e){const t=e.composedPath().find(e=>"ha-tab-group-tab"===e.localName),i=null==t?void 0:t.getAttribute("panel");i&&(this._selectedTab=i)}_describeChanged(e){var t;if(!this._config)return;const i=Object.assign({template:this._config.template,thingType:null!==(t=F(this._config))&&void 0!==t?t:"card",description:this._config.description,category:this._config.category},e.detail.value),s=Object.assign(Object.assign({},this._config),{template:i.template});M(s,"description",i.description),M(s,"category",i.category);const n=void 0!==s.group&&"card"===i.thingType;n||delete s.group;for(const[a,o]of Object.entries(Qs))yc.stubMember(!n&&i.thingType===a,s,a,o);this._fireConfigChanged(s)}_declarationsChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);M(t,"variables",e.detail.value),this._fireConfigChanged(t)}_defaultsChanged(e){if(!this._config)return;const t=e.detail.value,i=Object.assign(Object.assign({},this._config),{default:t.default});void 0!==this._config.defaults&&(JSON.stringify(t.default)===JSON.stringify(Ne(this._config))?i.default=this._config.default:delete i.defaults),this._fireConfigChanged(i)}_childConfigChanged(e){e.stopPropagation(),this._fireConfigChanged(e.detail.config)}_cardChanged(e){if(e.stopPropagation(),!this._config)return;this._suggestion=void 0,this._suggestedNothing=!1;const t=Object.assign(Object.assign({},this._config),{card:e.detail.config});this._fireConfigChanged(t)}_cardPicked(e){this._selectedTab="card",this._cardChanged(e)}_rowChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign(Object.assign({},this._config),{row:e.detail.config});this._fireConfigChanged(t)}_fireConfigChanged(e){this._suggestion=void 0,this._suggestedNothing=!1,b(this,"config-changed",{config:e})}static stubMember(e,t,i,s){e?i in t||(t[i]=s):delete t[i]}static get styles(){return rn}_saveDashboard(e,t,i){return on(this,e,t,i)}async connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=O(()=>this.requestUpdate())),this._loadedElements||(await C(),await async function(){let e=customElements.get("hui-entities-card");if(!e){if(!Je)return;(await Je).createCardElement({type:"entities",entities:[]}),await customElements.whenDefined("hui-entities-card"),e=customElements.get("hui-entities-card")}e&&e.getConfigElement&&await e.getConfigElement()}(),this._loadedElements=!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}}f([v()],yc.prototype,"_config",void 0),f([v()],yc.prototype,"_selectedTab",void 0),f([v()],yc.prototype,"_suggestion",void 0),f([v()],yc.prototype,"_suggestedNothing",void 0),f([v()],yc.prototype,"_toolError",void 0),f([v()],yc.prototype,"_busy",void 0),f([v()],yc.prototype,"_declutterOriginal",void 0),f([v()],yc.prototype,"_declutterSection",void 0),f([v()],yc.prototype,"_declutterPending",void 0),f([v()],yc.prototype,"_promotePath",void 0),f([v()],yc.prototype,"_promoteName",void 0),f([v()],yc.prototype,"_promoteError",void 0),f([g()],yc.prototype,"lovelace",void 0),f([g()],yc.prototype,"hass",void 0);class bc extends _{connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=O(()=>this.requestUpdate()))}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}static get styles(){return y`
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
    `}render(){var t,i,s,n,a,o,r,c,d;const h=this.lovelace,p=Ee(h);if(p&&(null===(t=this._borrowed)||void 0===t?void 0:t.ll)!==h){this._borrowed={ll:h};const e=new Set(Object.keys(T(h)));Te(this.hass,h).then(t=>{var i;(null===(i=this._borrowed)||void 0===i?void 0:i.ll)===h&&(this._borrowed={ll:h,names:Object.keys(t).filter(t=>!e.has(t)),templates:t})})}const u=p&&!(null===(i=this._borrowed)||void 0===i?void 0:i.names),m=Ut(h,p&&null!==(n=null===(s=this._borrowed)||void 0===s?void 0:s.names)&&void 0!==n?n:[]),f=u?Object.assign(Object.assign({},m),{missingTemplates:[]}):m,g=Wt(h),v=Bt(h),_=null===(a=this._borrowed)||void 0===a?void 0:a.names,y=this._examplesChecked;u||(null==y?void 0:y.ll)===h&&(null==y?void 0:y.borrowed)===_||(this._examplesChecked={ll:h,borrowed:_,failed:ut(T(h),null!=_?_:[],this.hass)});const b=u?[]:null!==(r=null===(o=this._examplesChecked)||void 0===o?void 0:o.failed)&&void 0!==r?r:[],$=lc(h,null!==(d=null===(c=this._borrowed)||void 0===c?void 0:c.templates)&&void 0!==d?d:T(h)),w=!(f.missingTemplates.length||f.unsetVariables.length||f.unusedTemplates.length||g.length||v.length||b.length||$.length);return e`
      <ha-expansion-panel outlined>
        <span slot="header">${l("tools.health_header",void 0,this.hass)}</span>
        <slot></slot>
        ${w?e`<p class="hint">${l("tools.health_ok",void 0,this.hass)}</p>`:e`
                ${b.map(t=>e`<ha-alert alert-type="error">
                      ${l("tools.health_example",{template:t.template,number:t.example,problems:t.problems.join(" ")},this.hass)}
                    </ha-alert>`)}
                ${g.map(t=>e`<ha-alert alert-type="error">
                      ${l("tools.health_extends_loop",{path:t.join(" → ")},this.hass)}
                    </ha-alert>`)}
                ${f.missingTemplates.map(t=>e`<ha-alert alert-type="error">
                      ${l("tools.health_missing",{template:t.template,count:t.count},this.hass)}${t.closest?l("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${f.unsetVariables.map(t=>e`<ha-alert alert-type="warning">
                      ${l("tools.health_unset",{template:t.template,names:t.names.join(", "),count:t.count},this.hass)}
                    </ha-alert>`)}
                ${v.map(t=>{const i=[...t.views.map(e=>l("tools.health_view_uses",{view:e.title||l("template_editor.untitled_view",void 0,this.hass),count:e.count},this.hass)),...t.templates.map(e=>l("tools.health_template_uses",{name:e},this.hass))].join(", ");return e`<ha-alert alert-type="warning">
                    ${t.message?l("tools.health_deprecated_because",{template:t.template,message:t.message,uses:i},this.hass):l("tools.health_deprecated",{template:t.template,uses:i},this.hass)}
                  </ha-alert>`})}
                ${$.map(t=>e`<ha-alert alert-type="warning">
                      ${l("tools.health_unread",{template:t.template,name:t.name,count:t.count,view:t.view.title||t.view.path||l("template_editor.untitled_view",void 0,this.hass)},this.hass)}${"variables"===t.where?"":l(`tools.health_unread_${t.where}`,void 0,this.hass)}${t.closest?l("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${f.unusedTemplates.length?e`<ha-alert alert-type="info">
                        ${l("tools.health_unused",{names:f.unusedTemplates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
              `}
        ${this._renderTimings()}
      </ha-expansion-panel>
    `}_renderTimings(){const t=Kt.entries(),i=e=>e.toFixed(1),s=e`<h4 class="timings-header">${l("tools.timings_header",void 0,this.hass)}</h4>`;if(!t.length)return e`${s}
        <p class="hint">${l("tools.timings_none",void 0,this.hass)}</p>`;const{byTotal:n,byMax:a,repeats:o}=Jt(t);return e`
      ${s}
      <p class="hint">${l("tools.timings_hint",{count:t.length},this.hass)}</p>
      <p class="hint">${l("tools.timings_by_total",void 0,this.hass)}</p>
      <ul class="timings">
        ${n.map(t=>e`<li>
              ${l(1===t.builds?"tools.timings_total_row_one":"tools.timings_total_row",{template:t.template,total:i(t.total),builds:t.builds,max:i(t.max)},this.hass)}
            </li>`)}
      </ul>
      <p class="hint">${l("tools.timings_by_max",void 0,this.hass)}</p>
      <ul class="timings">
        ${a.map(t=>e`<li>
              ${l("tools.timings_max_row",{template:t.template,max:i(t.max)},this.hass)}
            </li>`)}
      </ul>
      ${o.length?e`
              <p class="hint">${l("tools.timings_repeats",void 0,this.hass)}</p>
              <ul class="timings">
                ${o.map(t=>{var i;return e`<li>
                      ${l(t.name?"tools.timings_repeat_named_row":"tools.timings_repeat_row",{template:t.template,name:null!==(i=t.name)&&void 0!==i?i:"",copies:t.copies},this.hass)}
                    </li>`})}
              </ul>
            `:e``}
    `}}f([g({attribute:!1})],bc.prototype,"hass",void 0),f([g({attribute:!1})],bc.prototype,"lovelace",void 0),f([v()],bc.prototype,"_borrowed",void 0),Yt(Zt,es),Yt(Gt,yc),Yt(Qt,bc);export{es as DeclutteringCardEditor,bc as DeclutteringHealthPanel,yc as DeclutteringTemplateEditor};
//# sourceMappingURL=decluttering-card-plus.editors-CDoZMCzG.js.map
