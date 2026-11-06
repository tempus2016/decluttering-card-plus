import{b as e,O as t,r as i,a as s,l as o,c as n,v as a,d as r,P as l,e as d,n as c,_ as h,f as p,g as u,i as m,h as f,j as g,k as v,m as _,B as y,o as b,t as $,p as w,q as x,s as k,H as j,u as A,w as S,x as O,y as C,z as E,A as T,C as P,D as N,E as L,F as I,G as F,I as M,J as V,K as q,L as D,M as H,N as R,Q as z,R as W,S as U,T as B,U as K,W as J,X as Y,Y as Z,Z as G,$ as Q,a0 as X,a1 as ee,a2 as te,a3 as ie,a4 as se,a5 as oe,a6 as ne,a7 as ae,a8 as re,a9 as le,aa as de,ab as ce,ac as he,ad as pe,ae as ue,af as me,ag as fe,ah as ge,ai as ve,aj as _e,ak as ye,al as be,am as $e,an as we,ao as xe,ap as ke,aq as je,ar as Ae,as as Se,at as Oe,au as Ce,av as Ee,aw as Te,ax as Pe,ay as Ne,az as Le,aA as Ie,aB as Fe,aC as Me,aD as Ve,aE as qe,aF as De,aG as He,aH as Re,aI as ze,aJ as We,aK as Ue,aL as Be,aM as Ke,aN as Je,aO as Ye,aP as Ze,aQ as Ge,aR as Qe,aS as Xe,aT as et,aU as tt,aV as it,aW as st,aX as ot,aY as nt,aZ as at,a_ as rt,a$ as lt,b0 as dt,V as ct,b1 as ht,b2 as pt,b3 as ut,b4 as mt,b5 as ft,b6 as gt,b7 as vt,b8 as _t,b9 as yt,ba as bt,bb as $t,bc as wt,bd as xt,be as kt,bf as jt,bg as At,bh as St,bi as Ot,bj as Ct,bk as Et,bl as Tt,bm as Pt,bn as Nt,bo as Lt,bp as It,bq as Ft,br as Mt,bs as Vt,bt as qt,bu as Dt,bv as Ht,bw as Rt,bx as zt,by as Wt,bz as Ut,bA as Bt,bB as Kt,bC as Jt,bD as Yt,bE as Zt,bF as Gt,bG as Qt,bH as Xt,bI as ei}from"./decluttering-card-plus.core-Cisdjjmy.js";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ti=Symbol.for(""),ii=e=>{if(e?.r===ti)return e?._$litStatic$},si=e=>({_$litStatic$:e,r:ti}),oi=new Map,ni=(e=>(t,...i)=>{const s=i.length;let o,n;const a=[],r=[];let l,d=0,c=!1;for(;d<s;){for(l=t[d];d<s&&void 0!==(n=i[d],o=ii(n));)l+=o+t[++d],c=!0;d!==s&&r.push(n),a.push(l),d++}if(d===s&&a.push(t[s]),c){const e=a.join("$$lit$$");void 0===(t=oi.get(e))&&(a.raw=a,oi.set(e,t=a)),i=r}return e(t,...i)})(e),ai=["grid_options","style",t,"strict","rebuild_on","debug","name","inherit_variables"];function ri(e){return"number"==typeof e&&Number.isFinite(e)?String(e):"string"==typeof e&&e.trim()?e.trim():void 0}function li(e){if("number"==typeof e)return e;if("string"!=typeof e||!e.trim())return;const t=e.trim(),i=Number(t);return Number.isFinite(i)&&/^\d+$/.test(t)?i:t}function di(e){return e===s?"hide":e&&"object"==typeof e&&!Array.isArray(e)?"card":"show"}function ci(e){const s={on_error_mode:di(e[t]),debug:(o=e.debug,!0===o?"json":"yaml"===o||"console"===o||"report"===o?o:"off")};var o;const n=e.grid_options,a=ri(null==n?void 0:n.columns),r=ri(null==n?void 0:n.rows);void 0!==a&&(s.grid_columns=a),void 0!==r&&(s.grid_rows=r),"string"==typeof e.style&&e.style&&(s.style=e.style),!0===e.strict&&(s.strict=!0);const l=i(e.rebuild_on);return l.length&&(s.rebuild_on=l),"string"==typeof e.name&&e.name&&(s.name=e.name),!0===e.inherit_variables&&(s.inherit_variables=!0),s}function hi(e,o){var n;const a=Object.assign({},e),r=Object.assign({},null!==(n=e.grid_options)&&void 0!==n?n:{}),l=li(o.grid_columns),d=li(o.grid_rows);void 0===l?delete r.columns:r.columns=l,void 0===d?delete r.rows:r.rows=d,Object.keys(r).length?a.grid_options=r:delete a.grid_options;const c="string"==typeof o.style?o.style:"";switch(c.trim()?a.style=c:delete a.style,o.on_error_mode){case"hide":a[t]=s;break;case"card":"card"!==di(e[t])&&delete a[t];break;default:delete a[t]}!0===o.strict?a.strict=!0:delete a.strict;const h=i(o.rebuild_on);switch(h.length?a.rebuild_on=h:delete a.rebuild_on,o.debug){case"json":a.debug=!0;break;case"yaml":case"console":case"report":a.debug=o.debug;break;default:delete a.debug}const p="string"==typeof o.name?o.name.trim():"";return p?a.name=p:delete a.name,!0===o.inherit_variables?a.inherit_variables=!0:delete a.inherit_variables,a}function pi(e){const i=e[t];return i&&"object"==typeof i&&!Array.isArray(i)?i:void 0}function ui(e,i){const s=Object.assign({},e);return i&&"object"==typeof i?s[t]=i:delete s[t],s}const mi=["1","2","3","4","5","6","7","8","9","10","11","12","full"],fi=["1","2","3","4","5","6","7","8","auto"];const gi=["for_each","for_each_from","columns","min_column_width","gap","lazy","lazy_eager","empty"],vi=["repeat","extras","fit","advanced",...ai],_i={grid_options:["grid_columns","grid_rows"],on_error:["on_error_mode"]};function yi(e){const t=null==e?void 0:e.editor_hide;return(Array.isArray(t)?t:void 0===t?[]:[t]).filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>e.trim().toLowerCase())}const bi=(e,t)=>void 0!==(null==e?void 0:e[t]);function $i(e,t,i){const s=new Set(yi(e)),o=ai.some(e=>bi(t,e));return{repeat:s.has("repeat")&&!gi.some(e=>bi(t,e)),extras:s.has("extras")&&!(null==i?void 0:i.length),fit:s.has("fit")&&!bi(t,"fit"),advanced:s.has("advanced")&&!o,advancedFields:[].concat(...ai.filter(e=>s.has(e)&&!bi(t,e)).map(e=>{var t;return null!==(t=_i[e])&&void 0!==t?t:[e]}))}}function wi(e,t,i,s){if(void 0===e)return;const o=JSON.stringify(e);if("string"!=typeof o||!l.test(o))return e;let n,a=!1;try{n=d(c(t),i,{value:e},void 0,s,!0,()=>{a=!0})}catch(p){return}if(a)return;const r=null==n?void 0:n.value,h=JSON.stringify(r);return"string"==typeof h&&l.test(h)?void 0:r}function xi(e,t){return e===t||"object"==typeof e&&null!==e&&"object"==typeof t&&null!==t&&JSON.stringify(e)===JSON.stringify(t)}const ki="decluttering-card-plus-card-slot";class ji extends m{constructor(){super(...arguments),this.label="",this.emptyHint="",this._picking=!1,this._editing=!1}static get styles(){return f`
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
    `}render(){const t=function(e){var t,i,s,n;if(!e||"object"!=typeof e||Array.isArray(e))return;const a=e,r="string"==typeof a.type?a.type:"",l=r.startsWith("custom:")?r.slice(7):r?r[0].toUpperCase()+r.slice(1):"",d=e=>"string"==typeof e&&e.trim()?e.split("\n")[0].trim():void 0,c=Array.isArray(a.cards)?a.cards.length:void 0;return{type:l,text:null!==(n=null!==(s=null!==(i=null!==(t=d(a.content))&&void 0!==t?t:d(a.title))&&void 0!==i?i:d(a.name))&&void 0!==s?s:d(a.entity))&&void 0!==n?n:void 0!==c?o("editor.slot.cards",{count:c}):""}}(this.value);return e`
      ${this.label?e`<p class="label">${this.label}</p>`:e``}
      <div class="slot ${t?"filled":""}">
        ${t?e`
                <div class="row">
                  <div class="text summary">
                    <b>${t.type}</b>
                    ${t.text?e`<small>${t.text}</small>`:e``}
                  </div>
                  <ha-button @click=${()=>this._toggleEdit()}>
                    ${o(this._editing?"editor.slot.done":"editor.slot.edit",void 0,this.hass)}
                  </ha-button>
                  <ha-button @click=${()=>this._set(void 0)}>
                    ${o("editor.slot.remove",void 0,this.hass)}
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
                    ${o(this._picking?"editor.slot.cancel":"editor.slot.choose",void 0,this.hass)}
                  </ha-button>
                </div>
                ${this._picking?e`<hui-card-picker
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        @config-changed=${this._picked}
                      ></hui-card-picker>`:e``}
              `}
      </div>
    `}_togglePick(){this._picking=!this._picking}_toggleEdit(){this._editing=!this._editing}_picked(e){var t;e.stopPropagation(),this._picking=!1,this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_edited(e){var t;e.stopPropagation(),this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_set(e){this._editing=this._editing&&!!e,g(this,"value-changed",{value:e&&"object"==typeof e?e:void 0})}}function Ai(e,t){const i=Math.max(0,t-e);return i<1?"<1 ms":`${Math.round(i)} ms`}h([p({attribute:!1})],ji.prototype,"hass",void 0),h([p({attribute:!1})],ji.prototype,"lovelace",void 0),h([p({attribute:!1})],ji.prototype,"value",void 0),h([p()],ji.prototype,"label",void 0),h([p()],ji.prototype,"emptyHint",void 0),h([u()],ji.prototype,"_picking",void 0),h([u()],ji.prototype,"_editing",void 0),"undefined"==typeof customElements||customElements.get(ki)||customElements.define(ki,ji);const Si="decluttering-card-plus-return";function Oi(e){try{return"undefined"==typeof sessionStorage?void 0:sessionStorage}catch(t){return}}const Ci="default";function Ei(e){const t=null==e?void 0:e[y];return t&&"object"==typeof t&&!Array.isArray(t)?t:void 0}function Ti(e,t,i){var s,o;const n={};for(const r of t){const e=null===(s=r.domain)||void 0===s?void 0:s.trim(),t=null===(o=r.template)||void 0===o?void 0:o.trim();e&&t&&e!==Ci&&(n[e]=t)}(null==i?void 0:i.trim())&&(n[Ci]=i.trim());const a=Object.assign({},e);return Object.keys(n).length?a[y]=n:delete a[y],a}function Pi(e,t){const i=new Set(t.map(e=>e.domain));return e.filter(e=>!i.has(e))}const Ni=["entities","areas","devices","floors","labels","views"];function Li(e){if(!e||"object"!=typeof e||Array.isArray(e))return;const t=e;if(void 0!==t.template||void 0!==t.range||void 0!==t.with)return;if(void 0!==t.exclude&&"object"==typeof t.exclude&&!Array.isArray(t.exclude))return;const i=Ni.filter(e=>void 0!==t[e]);return i.length>1?void 0:1===i.length?i[0]:b(e)?"entities":void 0}function Ii(e){var t;return void 0!==e.for_each_from?null!==(t=Li(e.for_each_from))&&void 0!==t?t:"other":void 0!==e.for_each?"list":"none"}function Fi(e){if(null==e||!0===e)return;return(Array.isArray(e)?e:[e]).filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>e.trim())}function Mi(e){const t="number"==typeof e?e:"string"==typeof e&&e.trim()?Number(e):NaN;return Number.isFinite(t)?t:void 0}const Vi=["domain","area","floor","label","device_class","integration","exclude"];function qi(e){if(e&&e.length)return 1===e.length?e[0]:e}function Di(e,t){var i,s;const o=Object.assign({},null!=e?e:{});o[null!==(i=Li(e))&&void 0!==i?i:"entities"]=!t.patterns||!t.patterns.length||qi(t.patterns.map(e=>e.trim()).filter(Boolean));for(const l of Vi){const e=qi(null===(s=t[l])||void 0===s?void 0:s.filter(e=>e.trim()));void 0===e?delete o[l]:o[l]=e}const n=[t.sort,t.then].filter(e=>"string"==typeof e&&""!==e.trim());n.length?o.sort=1===n.length?n[0]:n:delete o.sort,!0===t.reverse?o.reverse=!0:delete o.reverse;const a=Mi(t.limit);void 0===a?delete o.limit:o.limit=a;const r=Mi(t.offset);return void 0===r||0===r?delete o.offset:o.offset=r,"string"==typeof t.group_by&&t.group_by?o.group_by=t.group_by:delete o.group_by,!0===t.entity_category?Array.isArray(o.entity_category)||"string"==typeof o.entity_category||(o.entity_category="all"):delete o.entity_category,o}function Hi(e){return e.split(".")[0]}function Ri(e){var t;return[...new Set(Object.keys(null!==(t=null==e?void 0:e.states)&&void 0!==t?t:{}).map(Hi))].sort()}function zi(e){var t,i;const s=new Set;for(const o of Object.values(null!==(t=null==e?void 0:e.states)&&void 0!==t?t:{})){const e=null===(i=null==o?void 0:o.attributes)||void 0===i?void 0:i.device_class;"string"==typeof e&&e&&s.add(e)}return[...s].sort()}function Wi(e){var t;const i=new Set;for(const s of Object.values(null!==(t=null==e?void 0:e.entities)&&void 0!==t?t:{}))"string"==typeof(null==s?void 0:s.platform)&&s.platform&&i.add(s.platform);return[...i].sort()}const Ui=["name","-name","entity","area","floor","domain","entity_count","none"],Bi=["","area","floor","domain","label"];function Ki(e,t){return{select:{mode:"dropdown",multiple:!0,custom_value:!0,options:[...e,...(null!=t?t:[]).filter(t=>!e.includes(t))].map(e=>({value:e,label:e}))}}}function Ji(e,t){const i=["none","list",...Ni];return"other"===t&&i.push("other"),i.map(t=>({value:t,label:o(`editor.repeat.mode_${t}`,void 0,e)}))}const Yi=["card","badge","row","element","group"];function Zi(e,t){const i=t.toLowerCase().split(/\s+/).filter(Boolean);return i.length?e.filter(e=>i.every(t=>e.search.includes(t))):e}function Gi(e,t,i){const s=e=>e?""+(e.borrowed?"b:"+e.borrowed:e.category?"c:"+e.category:""):"";if(""!==s(e)&&s(e)!==s(t))return e.borrowed?o("editor.picker.borrowed_from",{dashboard:e.borrowed},i):e.category}function Qi(e,t){return 0===e?o("editor.picker.unused",void 0,t):1===e?o("editor.picker.used_one",void 0,t):o("editor.picker.used_many",{count:e},t)}function Xi(e,t,i){const s=new Map(function(e,t){return e.map((e,i)=>({id:e.value,primary:e.label,secondary:[e.description,Qi(e.count,t)].filter(Boolean).join(" · "),search:e.search,sorting_label:String(i).padStart(6,"0")}))}(e,i).map(e=>[e.id,e])),o=[];let n;for(const a of Zi(e,t)){const e=Gi(a,n,i);e&&o.push(e),o.push(s.get(a.value)),n=a}return o}const es={card:{type:"entity",entity:"sun.sun"},badge:{type:"entity",entity:"sun.sun"},row:{entity:"sun.sun"},element:{type:"icon",icon:"mdi:weather-sunny",style:{color:"yellow"}}},ts=50,is=e=>!!customElements.get(e),ss=e=>e.actions.length>0||e.urls.length>0||e.embeds||e.scripts||e.placeholders||e.overlay;const os=500,ns="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z";function as(t){const i=e=>{var i;return t.onInput(null!==(i=e.target.value)&&void 0!==i?i:"")},s=e=>{var i;return null===(i=t.onKeydown)||void 0===i?void 0:i.call(t,e)};return is("ha-input")?e`<ha-input
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
      ></ha-textfield>`}async function rs(e,t,i,s){var n;if(!w())return e._toolError=o("tools.cannot_save_here",void 0,e.hass),!1;e._busy=!0,e._toolError=void 0;try{return await x(e,e.hass,i,[{urlPath:k(),build:t}],s),e._undoChanged=void 0,!0}catch(a){return e._toolError=o("tools.save_failed",{message:null!==(n=null==a?void 0:a.message)&&void 0!==n?n:a},e.hass),!1}finally{e._busy=!1}}const ls="variable:";function ds(e,t,i){var s;const n=e&&"object"==typeof e?e:{},a=null!==(s=["areas","devices","floors","labels","views","entities"].find(e=>void 0!==n[e]))&&void 0!==s?s:b(e)?"entities":"items";return o(`editor.matches_${a}_${1===t?"one":"many"}`,void 0,i)}let cs,hs;function ps(e,t){const i=e.indexOf(t);return-1===i?[e,""]:[e.slice(0,i),e.slice(i+t.length)]}const us=new Set(["true","yes","on","1"]),ms=/:host|\.decluttering-container/;class fs extends m{constructor(){super(...arguments),this._shownAs=new Map,this._loadingTemplates=!1,this._ejectPending=!1,this._sectionsPending=!1,this._previewMode="yaml",this._copied=!1,this._markedLines=[],this._cannotOpen=!1,this._matchesOpen=!1,this._openItems=new Set,this._pickerFilter="",this._pickerItems=[],this._renderedTemplates={},this._renderingTemplates=new Set}static get styles(){return f`
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
      .picker {
        display: block;
        margin: 0 0 16px;
      }
      .pick-row {
        padding: 4px 0;
      }
      .pick-heading {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: var(--secondary-text-color);
        margin: 2px 0 6px;
      }
      .pick-name {
        display: flex;
        align-items: baseline;
        gap: 10px;
      }
      .pick-name small {
        color: var(--secondary-text-color);
      }
      .pick-name small.unused {
        color: var(--warning-color);
      }
      .pick-description {
        font-size: 12px;
        color: var(--secondary-text-color);
      }
    `}set lovelace(e){this._lovelace=e,this._templates=void 0,this._schema=void 0}_editingPlace(){const e=A(this),t=e?S(e):void 0;return null!=t?t:{view:O(this._lovelace)}}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}async connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=C(()=>this.requestUpdate())),await E()}setConfig(e){this._openedWith||(this._openedWith=e,this._resume=function(e,t,i=Date.now()){var s;const o=Oi();if(!o)return;let n;try{const e=o.getItem(Si);n=e?JSON.parse(e):void 0}catch(a){n=void 0}if(n)if(i-n.at>18e5)o.removeItem(Si);else if(JSON.stringify(null!==(s=n.openedWith)&&void 0!==s?s:null)===JSON.stringify(null!=e?e:null))return o.removeItem(Si),n}(e)),this._config=e}willUpdate(){var e;if(this.hass&&this._config&&(this._lovelace||(this._lovelace=null!==(e=T())&&void 0!==e?e:void 0),this._lovelace)){if(!this._templates){const e=this._editingPlace();this._templates=P(this._lovelace,e.view,void 0,e.section),this._loadBorrowedTemplates()}this._schema||(this._schema=[{name:"template",label:o("editor.template_label",void 0,this.hass),selector:{select:{mode:"dropdown",custom_value:!0,options:N(this._templates,this.hass)}}},{name:"variables",label:o("editor.variables_label",void 0,this.hass),helper:o("editor.variables_helper",void 0,this.hass),selector:{object:{}}}])}}render(){if(!(this.hass&&this._config&&this._templates&&this._schema))return e``;const t=this._templates[this._config.template],i=L(t),s=this._hiddenNames(t,i),n=i.filter(e=>!s.has(e.name)),a=I(this._config.variables),r=F(this._config),l=!!t&&"card"===M(t)||!!r||void 0!==this._config.for_each||void 0!==this._config.for_each_from,d=this._formData(i),c=$i(t,this._config,d.extras),h={};t||this._loadingTemplates||r&&!this._config.template||(h.template=o("editor.no_such_template",void 0,this.hass)),a||(h.variables=o("error.variables_shape",void 0,this.hass));const p=_(t);return e`
      ${(null==t?void 0:t.description)?e`<p class="description">${t.description}</p>`:e``}
      ${r?this._renderByDomain(r):e``}
      ${void 0===p?e``:e`<ha-alert alert-type="warning">
              ${p?o("editor.template_deprecated_because",{message:p},this.hass):o("editor.template_deprecated",void 0,this.hass)}
            </ha-alert>`}
      ${this._renderResume()} ${this._renderTemplatePicker(h.template)} ${this._renderResult(t)}
      ${this._renderSource(t)} ${this._renderStartFromExample(t)}
      ${this._renderDiagnostics(t,a)}
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
    `}_renderAdvanced(t){if(!this._config||t.advanced)return e``;const i=function(e){const t=ci(e);let i=0;return void 0===t.grid_columns&&void 0===t.grid_rows||(i+=1),void 0!==t.style&&(i+=1),"show"!==t.on_error_mode&&(i+=1),t.strict&&(i+=1),t.rebuild_on&&(i+=1),"off"!==t.debug&&(i+=1),void 0!==t.name&&(i+=1),t.inherit_variables&&(i+=1),i}(this._config),s=ci(this._config),n=this._onErrorMode&&"card"!==s.on_error_mode?Object.assign(Object.assign({},s),{on_error_mode:this._onErrorMode}):s;"card"===s.on_error_mode&&this._onErrorMode&&(this._onErrorMode=void 0);const a=pi(this._config),r=si(ki);return e`
      <ha-expansion-panel outlined class="advanced">
        <span slot="header">
          ${o("editor.advanced.header",void 0,this.hass)}
          <span class="count">
            ${0===i?"":1===i?o("editor.advanced.count_one",void 0,this.hass):o("editor.advanced.count_many",{count:i},this.hass)}
          </span>
        </span>
        <div class="advanced-body">
          <ha-form
            .hass=${this.hass}
            .data=${n}
            .schema=${function(e,t){return t.length?e.filter(e=>!t.includes(null==e?void 0:e.name)):e}(function(e){const t=t=>o(t,void 0,e),i=(e,i)=>e.map(e=>({value:e,label:/^\d+$/.test(e)?e:t(`${i}${e}`)}));return[{name:"grid_columns",label:t("editor.advanced.grid_columns_label"),helper:t("editor.advanced.grid_helper"),selector:{select:{mode:"dropdown",custom_value:!0,options:i(mi,"editor.advanced.grid_")}}},{name:"grid_rows",label:t("editor.advanced.grid_rows_label"),selector:{select:{mode:"dropdown",custom_value:!0,options:i(fi,"editor.advanced.grid_")}}},{name:"style",label:t("editor.advanced.style_label"),helper:t("editor.advanced.style_helper"),selector:{text:{multiline:!0}}},{name:"on_error_mode",label:t("editor.advanced.on_error_label"),helper:t("editor.advanced.on_error_helper"),selector:{select:{mode:"dropdown",options:[{value:"show",label:t("editor.advanced.on_error_show")},{value:"hide",label:t("editor.advanced.on_error_hide")},{value:"card",label:t("editor.advanced.on_error_card")}]}}},{name:"strict",label:t("editor.advanced.strict_label"),helper:t("editor.advanced.strict_helper"),selector:{boolean:{}}},{name:"rebuild_on",label:t("editor.advanced.rebuild_on_label"),helper:t("editor.advanced.rebuild_on_helper"),selector:{entity:{multiple:!0}}},{name:"debug",label:t("editor.advanced.debug_label"),helper:t("editor.advanced.debug_helper"),selector:{select:{mode:"dropdown",options:[{value:"off",label:t("editor.advanced.debug_off")},{value:"json",label:t("editor.advanced.debug_json")},{value:"yaml",label:t("editor.advanced.debug_yaml")},{value:"console",label:t("editor.advanced.debug_console")},{value:"report",label:t("editor.advanced.debug_report")}]}}},{name:"name",label:t("editor.advanced.name_label"),helper:t("editor.advanced.name_helper"),selector:{text:{}}},{name:"inherit_variables",label:t("editor.advanced.inherit_label"),helper:t("editor.advanced.inherit_helper"),selector:{boolean:{}}}]}(this.hass),t.advancedFields)}
            .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
            .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
            @value-changed=${this._advancedChanged}
          ></ha-form>
          ${"card"===n.on_error_mode?ni`<${r}
                  .hass=${this.hass}
                  .lovelace=${this._lovelace}
                  .value=${a}
                  .label=${o("editor.advanced.fallback_label",void 0,this.hass)}
                  .emptyHint=${o("editor.advanced.fallback_hint",void 0,this.hass)}
                  @value-changed=${this._fallbackChanged}
                ></${r}>`:e``}
        </div>
      </ha-expansion-panel>
    `}_advancedChanged(e){if(e.stopPropagation(),!this._config)return;const t=e.detail.value;this._onErrorMode="card"!==t.on_error_mode||pi(this._config)?void 0:"card",g(this,"config-changed",{config:hi(this._config,t)})}_fallbackChanged(e){e.stopPropagation(),this._config&&(e.detail.value&&(this._onErrorMode=void 0),g(this,"config-changed",{config:ui(this._config,e.detail.value)}))}_renderEmptySlot(t){if(!this._config||!t)return e``;if(!(void 0!==this._config.for_each||void 0!==this._config.for_each_from||void 0!==this._config.empty))return e``;const i=si(ki),s=this._config.empty;return ni`<${i}
      .hass=${this.hass}
      .lovelace=${this._lovelace}
      .value=${s&&"object"==typeof s?s:void 0}
      .label=${o("editor.empty_label",void 0,this.hass)}
      .emptyHint=${o("editor.empty_slot_hint",void 0,this.hass)}
      @value-changed=${this._emptyChanged}
    ></${i}>`}_emptyChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);V(t,"empty",e.detail.value),g(this,"config-changed",{config:t})}_renderStartFromExample(t){const i=q(t);return i.length&&this._config&&!D(this._config.variables).length?e`
      <div class="examples">
        <p class="hint">${o("editor.start_from_example_hint",void 0,this.hass)}</p>
        ${i.map((t,i)=>e`
            <ha-button @click=${()=>this._startFromExample(t)}>
              ${o("editor.start_from_example",{number:i+1},this.hass)}
            </ha-button>
          `)}
      </div>
    `:e``}_startFromExample(e){e.length&&g(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{variables:e})})}_renderByDomain(t){var i,s;if(!this._config)return e``;if(!function(e){const t=Ei(e);return!t||Object.values(t).every(e=>"string"==typeof e)}(this._config))return e`<ha-alert alert-type="info">
        ${o("editor.by_domain_hint",{templates:Object.entries(t).map(([e,t])=>`${e}: ${t}`).join(", ")},this.hass)}
      </ha-alert>`;const{rows:n,fallback:a}=function(e){var t;const i=null!==(t=Ei(e))&&void 0!==t?t:{};return{rows:Object.entries(i).filter(([e,t])=>e!==Ci&&"string"==typeof t).map(([e,t])=>({domain:e,template:t})),fallback:"string"==typeof i[Ci]?i[Ci]:void 0}}(this._config),r=null!==(i=this._byDomainDraft)&&void 0!==i?i:n,l=function(e,t){return Object.keys(e).filter(t=>{return!!(i=e[t])&&(void 0!==i.card||void 0!==i.group);var i}).sort().map(i=>({value:i,label:void 0!==_(e[i])?i+o("editor.deprecated_suffix",void 0,t):i}))}(null!==(s=this._templates)&&void 0!==s?s:{},this.hass),d=Ri(this.hass),c=(e,t)=>{const i=e.every(e=>{var t,i;return(null===(t=e.domain)||void 0===t?void 0:t.trim())&&(null===(i=e.template)||void 0===i?void 0:i.trim())});this._byDomainDraft=i?void 0:e,g(this,"config-changed",{config:Ti(this._config,e,t)})};return e`
      <div class="by-domain">
        <h3>${o("editor.by_domain.header",void 0,this.hass)}</h3>
        <p class="hint">${o("editor.by_domain.hint",void 0,this.hass)}</p>
        ${r.map((t,i)=>{return e`
            <div class="bd-row">
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",custom_value:!0,options:(s=t.domain,[...new Set([s,...d])].filter(Boolean).map(e=>({value:e,label:e})))}}}
                .value=${t.domain}
                .label=${o("editor.by_domain.domain",void 0,this.hass)}
                @value-changed=${e=>{e.stopPropagation(),c(r.map((t,s)=>{var o;return s===i?Object.assign(Object.assign({},t),{domain:String(null!==(o=e.detail.value)&&void 0!==o?o:"")}):t}),null!=a?a:"")}}
              ></ha-selector>
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",options:l}}}
                .value=${t.template}
                .label=${o("editor.by_domain.template",void 0,this.hass)}
                @value-changed=${e=>{e.stopPropagation(),c(r.map((t,s)=>{var o;return s===i?Object.assign(Object.assign({},t),{template:String(null!==(o=e.detail.value)&&void 0!==o?o:"")}):t}),null!=a?a:"")}}
              ></ha-selector>
              <ha-icon-button
                .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                .label=${o("editor.by_domain.remove",{domain:t.domain},this.hass)}
                @click=${()=>c(r.filter((e,t)=>t!==i),null!=a?a:"")}
              ></ha-icon-button>
            </div>
          `;var s})}
        <div class="bd-row">
          <span class="bd-default">${o("editor.by_domain.anything_else",void 0,this.hass)}</span>
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:l}}}
            .value=${null!=a?a:""}
            .label=${o("editor.by_domain.template",void 0,this.hass)}
            @value-changed=${e=>{var t;e.stopPropagation(),c(r,String(null!==(t=e.detail.value)&&void 0!==t?t:""))}}
          ></ha-selector>
          <span class="bd-spacer"></span>
        </div>
        <ha-button
          @click=${()=>{var e;return c([...r,{domain:null!==(e=Pi(d,r)[0])&&void 0!==e?e:"",template:""}],null!=a?a:"")}}
        >
          ${o("editor.by_domain.add",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderCardVariables(t){var i;const s=t.filter(e=>H(e));if(!s.length)return e``;const n=a(null===(i=this._config)||void 0===i?void 0:i.variables);return e`${s.map(t=>{var i;const s=n[t.name],a=!!s&&"object"==typeof s;return e`
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
                    ${o("editor.card_variable_clear",void 0,this.hass)}
                  </ha-button>
                `:e`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    @config-changed=${e=>this._cardVariableChanged(t.name,e)}
                  ></hui-card-picker>
                `}
        </div>
      `})}`}_registryItemsForPreview(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.for_each_from;if(!this.hass||!b(t))return;const i=R(t);if(void 0===i||Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))try{const e=z(this.hass,t,Object.assign(Object.assign({},W(this._lovelace)),{rendered:this._renderedTemplates}));return e.length?e:void 0}catch(s){return}}_cardVariableChanged(e,t){var i,s;null==t||t.stopPropagation();const o=null===(i=null==t?void 0:t.detail)||void 0===i?void 0:i.config,n=D(null===(s=this._config)||void 0===s?void 0:s.variables).filter(t=>U(t)!==e);o&&"object"==typeof o&&n.push({[e]:o});const a=Object.assign({},this._config);n.length?a.variables=n:delete a.variables,g(this,"config-changed",{config:a})}_renderResult(t){var s,n,a;if(!this._config)return e``;const r=null!==(s=B(this._config.for_each))&&void 0!==s?s:this._registryItemsForPreview();let l=(null==r?void 0:r.length)?K(r[0],this._config.variables,0,r.length):this._config.variables,c=t,h=this._config.template;if(F(this._config))try{const e=null!==(n=this._templates)&&void 0!==n?n:{};let t;({template:c,name:h,entity:t}=J(this._config,l,t=>e[t],this.hass,Object.keys(e))),l=Y(l,t)}catch(A){return e``}if(!c)return e``;const p=M(c);if(!p)return e``;const u=Z(c);let m;const f=performance.now();try{const e=G(this.hass,i(this._config.rebuild_on)),t=null!==(a=this._lovelace)&&void 0!==a?a:T();m=Q(d(l,c,u,h,e,!0,void 0,0,void 0,void 0,!1,{itemTemplates:X(t),context:W(t)}),this._config,p)}catch(S){return e`<ha-alert alert-type="warning">
        ${o("editor.result_error",{error:String(S)},this.hass)}
      </ha-alert>`}const g=performance.now(),v=(null==r?void 0:r.length)?o("editor.result_copies",{total:r.length},this.hass):"",[_,y]=ps(o("editor.result_hint",{kind:p},this.hass),"[[name]]"),$=ee(m);$!==this._lastYaml&&(this._markedLines=function(e,t){const i=""===t?[]:t.replace(/\n$/,"").split("\n");if(void 0===e)return i.map(e=>({text:e,changed:!1}));const s=new Set(e.replace(/\n$/,"").split("\n"));return i.map(e=>({text:e,changed:!s.has(e)}))}(this._lastYaml,$),this._lastYaml=$);const w=void 0!==this._editingPlace().section?"grid":void 0,x=function(e){return"card"===e?["rendered","yaml"]:["yaml"]}(p),k=x.includes(this._previewMode)?this._previewMode:"yaml",j=!(null==r?void 0:r.length)&&!b(this._config.for_each_from)&&m&&"object"==typeof m;return e`
      <div class="preview">
        <div class="preview-head">
          <span class="preview-title">${o("editor.preview.header",void 0,this.hass)}${v}</span>
          ${x.length>1?e`<div class="segmented" role="group">
                  ${x.map(t=>e`<button
                        type="button"
                        class=${t===k?"on":""}
                        aria-pressed=${t===k?"true":"false"}
                        @click=${()=>{this._previewMode=t}}
                      >
                        ${o(`editor.preview.${t}`,void 0,this.hass)}
                      </button>`)}
                </div>`:e``}
        </div>
        ${"rendered"===k?e`<div class="rendered">
                <hui-card .hass=${this.hass} .config=${m} .preview=${!0} .layout=${w}></hui-card>
              </div>`:e`<pre class="yaml">
${this._markedLines.map(t=>e`<span class="l ${t.changed?"changed":""}">${t.text}</span>`)}</pre>`}
        <p class="hint">
          ${o("editor.preview.built_in",{time:Ai(f,g),template:null!=h?h:""},this.hass)}
          ${"yaml"===k?o("editor.preview.changed_hint",void 0,this.hass):""}
        </p>
        <p class="hint">${_}<code>[[name]]</code>${y}</p>
        <div class="preview-actions">
          ${"yaml"===k?e`<ha-button @click=${()=>this._copyYaml($)}>
                  ${o(this._copied?"editor.preview.copied":"editor.preview.copy",void 0,this.hass)}
                </ha-button>`:e``}
          ${j?e`
                  <ha-button @click=${()=>this._eject(m)}>
                    ${o(this._ejectPending?"editor.eject_confirm":"editor.eject",void 0,this.hass)}
                  </ha-button>
                `:e``}
        </div>
      </div>
    `}_copyYaml(e){te(e).then(e=>{this._copied=e,e&&setTimeout(()=>this._copied=!1,1500)})}_renderResume(){const t=this._resume;return t?e`<ha-alert alert-type="info">
      ${o("editor.link.resume",{template:t.template},this.hass)}
      <div class="actions">
        <ha-button
          @click=${()=>{this._resume=void 0,g(this,"config-changed",{config:t.config})}}
        >
          ${o("editor.link.resume_button",void 0,this.hass)}
        </ha-button>
        <ha-button
          @click=${()=>{this._resume=void 0}}
        >
          ${o("editor.link.discard_button",void 0,this.hass)}
        </ha-button>
      </div>
    </ha-alert>`:e``}_openTemplate(e){var t,i,s,o;const n=w(),a=function(e,t){var i,s;const o=null==e?void 0:e.views;if(!Array.isArray(o))return;const n=e=>!!e&&v(e.type)&&e.template===t;for(let a=0;a<o.length;a+=1){const e=null!==(i=o[a])&&void 0!==i?i:{},t=Array.isArray(e.cards)?e.cards:[];for(let i=0;i<t.length;i+=1)if(n(t[i]))return[a,i];const r=Array.isArray(e.sections)?e.sections:[];for(let i=0;i<r.length;i+=1){const e=Array.isArray(null===(s=r[i])||void 0===s?void 0:s.cards)?r[i].cards:[];for(let t=0;t<e.length;t+=1)if(n(e[t]))return[a,i,t]}}}(null!==(t=null==n?void 0:n.config)&&void 0!==t?t:this._lovelace,e);if(!n||!a)return void(this._cannotOpen=!0);this._config&&function(e,i,s=Date.now()){const o=Oi();if(o)try{o.setItem(Si,JSON.stringify(Object.assign(Object.assign({},e),{at:s})))}catch(t){}}({config:this._config,openedWith:this._openedWith,template:e});const r=function(e,t){var i,s,o,n,a;const r=null===(i=null==e?void 0:e.views)||void 0===i?void 0:i[t[0]];if(!r)return;const l=3===t.length?null===(n=null===(o=null===(s=r.sections)||void 0===s?void 0:s[t[1]])||void 0===o?void 0:o.cards)||void 0===n?void 0:n[t[2]]:null===(a=r.cards)||void 0===a?void 0:a[t[1]];return l&&"object"==typeof l?l:void 0}(n.config,a),l=null!==(i=document.querySelector("home-assistant"))&&void 0!==i?i:document.body,d=()=>{g(l,"show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>Promise.resolve(),dialogParams:{lovelaceConfig:n.config,cardConfig:r,saveCardConfig:e=>n.saveConfig(r?oe(n.config,r,e):n.config),saveConfig:e=>n.saveConfig(e),path:a}})},c=A(this);if(!c)return void d();this._config&&(null===(s=c._discardDirtyStateChanges)||void 0===s||s.call(c),"_dirty"in c&&(c._dirty=!1));let h=!1;const p=()=>{h||(h=!0,setTimeout(d,0))};c.addEventListener("dialog-closed",p,{once:!0});!1!==(null===(o=c.closeDialog)||void 0===o?void 0:o.call(c))&&setTimeout(p,400)}_renderTemplatePicker(t){var i,s,n;if(!this._config||!this._templates)return e``;this._pickerFor!==this._templates&&(this._pickerFor=this._templates,this._pickerItems=function(e,t,i,s=()=>{}){const n=[];for(const[r,l]of Object.entries(e)){if(!Yi.some(e=>e in l))continue;const e=_(l),a="string"==typeof e&&e?e:"string"==typeof l.description?l.description:void 0,d="string"==typeof l.category&&l.category?l.category:void 0,c=s(r);n.push({value:r,label:void 0!==e?r+o("editor.deprecated_suffix",void 0,i):r,description:a,category:d,count:$(t,r),deprecated:void 0!==e,borrowed:c,search:[r,null!=a?a:"",null!=d?d:"",null!=c?c:""].join(" ").toLowerCase()})}const a=e=>{var t,i;return[e.borrowed?2:e.category?1:0,null!==(i=null!==(t=e.borrowed)&&void 0!==t?t:e.category)&&void 0!==i?i:"",e.deprecated?1:0,e.value.toLowerCase()]};return n.sort((e,t)=>{const i=a(e),s=a(t);for(let o=0;o<i.length;o+=1){if(i[o]<s[o])return-1;if(i[o]>s[o])return 1}return 0})}(this._templates,this._lovelace,this.hass,re));const a=Zi(this._pickerItems,this._pickerFilter),r=o("editor.template_label",void 0,this.hass),l=o("editor.picker.search",void 0,this.hass),d=Array.isArray(t)?t.join(" "):null!=t?t:"";if(is("ha-generic-picker")){const s=this._pickerItems,n=t=>{var i;return e`
        <div class="pick-row" style="padding: 6px 16px">
          <div class="pick-name">
            <span>${t.primary}</span>
            <small
              class=${(null===(i=t.secondary)||void 0===i?void 0:i.startsWith(o("editor.picker.unused",void 0,this.hass)))?"unused":""}
            >
              ${t.secondary}
            </small>
          </div>
        </div>
      `};return e`
        <ha-generic-picker
          class="picker"
          .hass=${this.hass}
          .label=${r}
          .helper=${l}
          .searchLabel=${l}
          .value=${null!==(i=this._config.template)&&void 0!==i?i:""}
          .getItems=${()=>Xi(s,"",this.hass)}
          .searchKeys=${[{name:"primary",weight:10},{name:"secondary",weight:5},{name:"search",weight:3}]}
          .searchFn=${e=>Xi(s,e,this.hass)}
          .rowRenderer=${n}
          .invalid=${!!t}
          .errorMessage=${d}
          allow-custom-value
          no-sort
          @value-changed=${this._templatePicked}
        ></ha-generic-picker>
      `}return is("ha-combo-box")?e`
      <ha-combo-box
        class="picker"
        .hass=${this.hass}
        .label=${o("editor.template_label",void 0,this.hass)}
        .helper=${o("editor.picker.search",void 0,this.hass)}
        .items=${this._pickerItems}
        .filteredItems=${a}
        .value=${null!==(n=this._config.template)&&void 0!==n?n:""}
        .renderer=${(t,i)=>{const s=Gi(t,a[i.index-1],this.hass);return e`
        <div class="pick-row">
          ${s?e`<div class="pick-heading">${s}</div>`:e``}
          <div class="pick-name">
            <span>${t.label}</span>
            <small class=${0===t.count?"unused":""}>${Qi(t.count,this.hass)}</small>
          </div>
          ${t.description?e`<div class="pick-description">${t.description}</div>`:e``}
        </div>
      `}}
        .invalid=${!!t}
        .errorMessage=${Array.isArray(t)?t.join(" "):null!=t?t:""}
        item-value-path="value"
        item-label-path="value"
        allow-custom-value
        @filter-changed=${e=>{var t,i;e.stopPropagation(),this._pickerFilter=String(null!==(i=null===(t=e.detail)||void 0===t?void 0:t.value)&&void 0!==i?i:"")}}
        @value-changed=${this._templatePicked}
      ></ha-combo-box>
    `:e`
        <ha-selector
          class="picker"
          .hass=${this.hass}
          .label=${r}
          .selector=${{select:{mode:"dropdown",custom_value:!0,options:this._pickerItems.map(e=>({value:e.value,label:e.label}))}}}
          .value=${null!==(s=this._config.template)&&void 0!==s?s:""}
          @value-changed=${this._templatePicked}
        ></ha-selector>
        ${t?e`<ha-alert alert-type="error">${d}</ha-alert>`:e``}
      `}_templatePicked(e){var t;e.stopPropagation();const i=null===(t=e.detail)||void 0===t?void 0:t.value;"string"==typeof i&&i&&this._config&&i!==this._config.template&&(this._pickerFilter="",g(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{template:i})}))}_renderSectionPerCopy(){var t;const i=null===(t=w())||void 0===t?void 0:t.config;return this._config&&i&&ie(i,this._config)?e`
      <div class="section-per-copy">
        <p class="hint">${o("editor.section_per_copy_hint",void 0,this.hass)}</p>
        ${this._sectionsError?e`<ha-alert alert-type="error">${this._sectionsError}</ha-alert>`:e``}
        <ha-button @click=${this._sectionPerCopy}>
          ${o(this._sectionsPending?"editor.section_per_copy_confirm":"editor.section_per_copy",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}async _sectionPerCopy(){var e,t;if(!this._sectionsPending)return void(this._sectionsPending=!0);this._sectionsPending=!1;const i=w(),s=this._config;if(!i||!s)return;try{await x(this,this.hass,"section_per_copy",[{urlPath:k(),build:e=>se(e,s)}])}catch(a){return void(this._sectionsError=o("tools.save_failed",{message:null!==(e=null==a?void 0:a.message)&&void 0!==e?e:a},this.hass))}let n=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;for(;n&&"hui-dialog-edit-card"!==n.localName;)n=n.parentNode instanceof ShadowRoot?n.parentNode.host:n.parentNode;null===(t=null==n?void 0:n.closeDialog)||void 0===t||t.call(n)}_eject(e){this._ejectPending?(this._ejectPending=!1,this._holdEjectUndo(e),g(this,"config-changed",{config:e})):this._ejectPending=!0}_holdEjectUndo(e){const t=w();if(!t||!this._openedWith)return;const i=oe(t.config,this._openedWith,e);i!==t.config&&ne({operation:"eject",at:Date.now(),dashboards:[{urlPath:k(),before:t.config,after:i}]})}_renderSource(t){var i;const s=null===(i=this._config)||void 0===i?void 0:i.template;if(!s||!t||this._loadingTemplates)return e``;const n=ae(this._lovelace,s);if(!n){const t=re(s);return e`<p class="hint">
        ${o("editor.source_borrowed",void 0,this.hass)}
        ${t?e`<a href=${a=t,`/${a.replace(/^\/+/,"")}`} target="_blank" rel="noreferrer"
                >${o("editor.link.open_dashboard",void 0,this.hass)}</a
              >`:e``}
      </p>`}var a;if(n.declared||!n.view)return e`<p class="hint">
        ${o("editor.source_declared",void 0,this.hass)}
        ${o("editor.link.raw_editor",void 0,this.hass)}
      </p>`;const{view:r}=n,l=document.location.pathname.split("/").slice(0,2).join("/"),[d,c]=ps(o("editor.source_view",{view:""},this.hass),"");return e`<p class="hint">
      ${d}<a href=${`${l}/${r.path||r.index}`} target="_blank" rel="noreferrer"
        >${r.title||r.path||o("editor.untitled_view",void 0,this.hass)}</a
      >${c}
      <a
        href="#"
        class="edit-template"
        @click=${e=>{e.preventDefault(),this._openTemplate(s)}}
        >${o("editor.link.edit_template",void 0,this.hass)}</a
      >
      ${this._cannotOpen?e`<br />${o("editor.link.cannot_open",void 0,this.hass)}`:e``}
    </p>`}_filledSource(e){var t,i;return le(null===(t=this._config)||void 0===t?void 0:t.for_each_from,null===(i=this._config)||void 0===i?void 0:i.variables,e,this.hass)}_renderedTemplateNames(e){const t=this._filledSource(e),i=R(t);if(!this.hass||void 0===i)return[];if(!Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))return[];const s=new Set,o=z(this.hass,t,{rendered:this._renderedTemplates});for(const n of o)for(const e of Object.keys(n))s.add(e);return[...s]}_renderEditorTemplate(e){this.hass&&!this._renderingTemplates.has(e)&&(this._renderingTemplates.add(e),de(this.hass,e).then(t=>{this._renderingTemplates.delete(e),this._renderedTemplates=Object.assign(Object.assign({},this._renderedTemplates),{[e]:t})}))}_renderMatches(t){var i,s;if(!this.hass||!b(null===(i=this._config)||void 0===i?void 0:i.for_each_from))return e``;const n=this._filledSource(t);ce(n)&&!he()&&pe(this.hass).then(()=>this.requestUpdate());const a=R(n);if(void 0!==a){const t=Object.prototype.hasOwnProperty.call(this._renderedTemplates,a)?this._renderedTemplates[a]:void 0;if(!t)return this._renderEditorTemplate(a),e`<p class="hint">${o("editor.matches_template_pending",void 0,this.hass)}</p>`;const i=ue(t);if(!("list"in i)){const t="error"===i.problem?"editor.matches_template_failed":"editor.matches_template_not_list";return e`<ha-alert alert-type="warning"> ${o(t,{detail:i.detail},this.hass)} </ha-alert>`}}let r=[];try{r=z(this.hass,n,Object.assign(Object.assign({},W(this._lovelace)),{rendered:this._renderedTemplates}))}catch(d){return e``}if(!r.length)return e`<ha-alert alert-type="warning">
        ${o("editor.matches_none",{but:(null===(s=this._config)||void 0===s?void 0:s.empty)?o("editor.matches_none_but_empty",void 0,this.hass):""},this.hass)}
      </ha-alert>`;const l=r.slice(0,12);return e`
      <div class="matches-line">
        <ha-svg-icon .path=${"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}></ha-svg-icon>
        <span>
          ${1===r.length?o("editor.matches_header_one",{what:ds(n,1,this.hass)},this.hass):o("editor.matches_header_many",{count:r.length,what:ds(n,r.length,this.hass)},this.hass)}
        </span>
        <ha-button
          @click=${()=>{this._matchesOpen=!this._matchesOpen}}
        >
          ${o(this._matchesOpen?"editor.repeat.matches_hide":"editor.repeat.matches_show",void 0,this.hass)}
        </ha-button>
      </div>
      ${this._matchesOpen?e`<div class="matches">
              <ul>
                ${l.map((t,i)=>e`<li>${me(t,i)}</li>`)}
              </ul>
              ${r.length>l.length?e`<p class="hint">
                      ${o("editor.matches_more",{count:r.length-l.length},this.hass)}
                    </p>`:e``}
              <p class="hint">
                ${o(void 0===a?"editor.matches_hint":"editor.matches_template_hint",void 0,this.hass)}
              </p>
            </div>`:e``}
    `}_suppliedNames(e){var t,i,s;return[...ge(null===(t=this._config)||void 0===t?void 0:t.for_each),...ve(null===(i=this._config)||void 0===i?void 0:i.for_each_from),...b(null===(s=this._config)||void 0===s?void 0:s.for_each_from)?fe:[],...e?this._renderedTemplateNames(e):[]]}_renderRepeat(t,i){if(!this._config||!t)return e``;const s=Ii(this._config),n=[{name:"mode",label:o("editor.repeat.mode_label",void 0,this.hass),helper:o("editor.repeat.mode_helper",void 0,this.hass),selector:{select:{mode:"dropdown",options:Ji(this.hass,s)}}}];return e`
      <div class="repeat">
        <h3>${o("editor.repeat.header",void 0,this.hass)}</h3>
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
    `}_renderLayout(t,i,s){const n=[...i?(null!=cs||(cs=[{name:"gap",label:o("editor.gap_label"),helper:o("editor.gap_helper"),selector:{number:{min:0,max:64,mode:"box"}}},{name:"columns",label:o("editor.columns_label"),helper:o("editor.columns_helper"),selector:{number:{min:1,max:6,mode:"box"}}},{name:"min_column_width",label:o("editor.min_column_width_label"),helper:o("editor.min_column_width_helper"),selector:{number:{min:50,max:1e3,step:10,mode:"box"}}},{name:"lazy",label:o("editor.lazy_label"),helper:o("editor.lazy_helper"),selector:{boolean:{}}},{name:"lazy_eager",label:o("editor.lazy_eager_label"),helper:o("editor.lazy_eager_helper"),selector:{number:{min:0,max:100,mode:"box"}}}]),cs):[],...s.fit?[]:(null!=hs||(hs=[{name:"fit",label:o("editor.fit_label"),helper:o("editor.fit_helper"),selector:{select:{mode:"dropdown",options:[{value:"box",label:o("editor.fit_box")},{value:"contents",label:o("editor.fit_contents")}]}}}]),hs)];return n.length?e`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${n}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:e``}_repeatModeChanged(e){var t;if(e.stopPropagation(),!this._config)return;const i=null===(t=e.detail.value)||void 0===t?void 0:t.mode;if(!i)return;const s=function(e,t){if(Ii(e)===t||"other"===t)return e;const i=Object.assign({},e);if(delete i.for_each,delete i.for_each_from,"list"===t)i.for_each=[];else if("none"!==t){const s=Li(e.for_each_from)?Object.assign({},e.for_each_from):{};for(const e of Ni)delete s[e];i.for_each_from=Object.assign({[t]:!0},s)}return i}(this._config,i);s!==this._config&&g(this,"config-changed",{config:s})}_renderRepeatBuilder(t){var i;const s=null===(i=this._config)||void 0===i?void 0:i.for_each_from,n=Li(s);if(!n)return e``;const a=function(e){var t,i,s;const o=null!=e?e:{},n={patterns:null!==(i=Fi(o[null!==(t=Li(e))&&void 0!==t?t:"entities"]))&&void 0!==i?i:[],reverse:!0===o.reverse,entity_category:!1};for(const c of Vi){const e=Fi(o[c]);e&&e.length&&(n[c]=e)}const a=null!==(s=Fi(o.sort))&&void 0!==s?s:[];a[0]&&(n.sort=a[0]),a[1]&&(n.then=a[1]);const r=Mi(o.limit);void 0!==r&&(n.limit=r);const l=Mi(o.offset);void 0!==l&&(n.offset=l),"string"==typeof o.group_by&&o.group_by&&(n.group_by=o.group_by);const d=o.entity_category;return n.entity_category=!0===d||"all"===d||"string"==typeof d&&!!d||Array.isArray(d)&&d.length>0,n}(s);return e`
      <ha-form
        .hass=${this.hass}
        .data=${a}
        .schema=${function(e,t,i){const s=t=>o(t,void 0,e),n=e=>({select:{mode:"dropdown",custom_value:!0,options:[...Ui,...e&&!Ui.includes(e)?[e]:[]].map(e=>({value:e,label:Ui.includes(e)?s(`editor.repeat.sort_${e.replace("-","desc_")}`):e}))}}),a="entities"===t,r="areas"===t,l="devices"===t;return[{name:"patterns",label:s(`editor.repeat.patterns_${t}`),helper:s("editor.repeat.patterns_helper"),selector:Ki([],null==i?void 0:i.patterns)},a&&{name:"domain",label:s("editor.repeat.domain_label"),selector:Ki(Ri(e),null==i?void 0:i.domain)},(a||l)&&{name:"area",label:s("editor.repeat.area_label"),selector:{area:{multiple:!0}}},(a||r||l)&&{name:"floor",label:s("editor.repeat.floor_label"),selector:{floor:{multiple:!0}}},(a||r||l)&&{name:"label",label:s("editor.repeat.label_label"),selector:{label:{multiple:!0}}},a&&{name:"device_class",label:s("editor.repeat.device_class_label"),selector:Ki(zi(e),null==i?void 0:i.device_class)},a&&{name:"integration",label:s("editor.repeat.integration_label"),selector:Ki(Wi(e),null==i?void 0:i.integration)},{name:"exclude",label:s("editor.repeat.exclude_label"),helper:s("editor.repeat.exclude_helper"),selector:a?{entity:{multiple:!0}}:Ki([],null==i?void 0:i.exclude)},{name:"sort",label:s("editor.repeat.sort_label"),selector:n(null==i?void 0:i.sort)},{name:"then",label:s("editor.repeat.then_label"),selector:n(null==i?void 0:i.then)},{name:"reverse",label:s("editor.repeat.reverse_label"),selector:{boolean:{}}},{name:"limit",label:s("editor.repeat.limit_label"),selector:{number:{min:0,max:500,mode:"box"}}},{name:"offset",label:s("editor.repeat.offset_label"),helper:s("editor.repeat.offset_helper"),selector:{number:{min:0,max:500,mode:"box"}}},a&&{name:"group_by",label:s("editor.repeat.group_by_label"),helper:s("editor.repeat.group_by_helper"),selector:{select:{mode:"dropdown",options:Bi.map(e=>({value:e,label:s(`editor.repeat.group_${e||"none"}`)}))}}},a&&{name:"entity_category",label:s("editor.repeat.entity_category_label"),helper:s("editor.repeat.entity_category_helper"),selector:{boolean:{}}}].filter(e=>!1!==e)}(this.hass,n,a)}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._repeatBuilderChanged}
      ></ha-form>
      ${this._renderMatches(t)}
    `}_repeatBuilderChanged(e){if(e.stopPropagation(),!this._config||void 0===Li(this._config.for_each_from))return;const t=Object.assign(Object.assign({},this._config),{for_each_from:Di(this._config.for_each_from,e.detail.value)});g(this,"config-changed",{config:t})}_renderOtherSource(t){var i;return e`
      <p class="hint">${o("editor.repeat.other_hint",void 0,this.hass)}</p>
      <ha-yaml-editor
        .hass=${this.hass}
        .defaultValue=${null===(i=this._config)||void 0===i?void 0:i.for_each_from}
        @value-changed=${this._otherSourceChanged}
      ></ha-yaml-editor>
      ${this._renderMatches(t)}
    `}_otherSourceChanged(e){var t;if(e.stopPropagation(),!this._config||!1===(null===(t=e.detail)||void 0===t?void 0:t.isValid))return;const i=Object.assign({},this._config);V(i,"for_each_from",e.detail.value),g(this,"config-changed",{config:i})}_listItems(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.for_each;return Array.isArray(t)?t:t&&"object"==typeof t?[t]:[]}_setList(e){this._config&&g(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{for_each:e})})}_renderRepeatList(){const t=this._listItems(),i=(e,t)=>function(e){var t,i;const s=Array.isArray(e)?Object.assign({},...e.filter(e=>e&&"object"==typeof e)):e&&"object"==typeof e?e:{},o=e=>"string"==typeof e&&e.trim()?e.trim():void 0,n=Object.values(s).find(e=>"string"==typeof e&&e.trim());return null!==(i=null!==(t=o(s.name))&&void 0!==t?t:o(s.entity))&&void 0!==i?i:"string"==typeof n?n.trim():""}(e)||o("editor.repeat.list_item",{number:t+1},this.hass),s=(e,i)=>{e.preventDefault();const s=this._dragging;this._dragging=void 0,void 0!==s&&s!==i&&this._setList(_e(t,s,i))};return e`
      <p class="hint">${o("editor.repeat.list_hint",void 0,this.hass)}</p>
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
                  .label=${o("editor.repeat.move_up",{name:i(n,a)},this.hass)}
                  @click=${()=>this._setList(_e(t,a,a-1))}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M7,10L12,15L17,10H7Z"}
                  .disabled=${a===t.length-1}
                  .label=${o("editor.repeat.move_down",{name:i(n,a)},this.hass)}
                  @click=${()=>this._setList(_e(t,a,a+1))}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"}
                  .label=${o("editor.repeat.list_edit",{name:i(n,a)},this.hass)}
                  @click=${()=>this._toggleItem(a)}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                  .label=${o("editor.repeat.list_remove",{name:i(n,a)},this.hass)}
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
      <ha-button @click=${()=>this._setList(function(e){const t=e[e.length-1],i=t&&"object"==typeof t&&!Array.isArray(t)?Object.keys(t):[],s={};for(const o of i.length?i:["entity"])s[o]="";return[...e,s]}(t))}>
        ${o("editor.repeat.list_add",void 0,this.hass)}
      </ha-button>
    `}_toggleItem(e){const t=new Set(this._openItems);t.has(e)?t.delete(e):t.add(e),this._openItems=t}_hiddenNames(e,t){var i;const s=new Set;if(!t.some(e=>void 0!==e.show_if||void 0!==e.hide_if))return s;const o=a(r(null===(i=this._config)||void 0===i?void 0:i.variables,e)),n=e=>o[e];for(const a of t)ye(a,n)||s.add(a.name);return s}_formSchema(e,t,i){if(!e.length)return this._schema.slice(1);const s=new Set(this._suppliedNames(i)),n=e=>{var t;const i=s.has(e.name);return{name:ls+e.name,label:null!==(t=e.label)&&void 0!==t?t:e.name,helper:i?o("editor.repeat.from_each_copy_helper",void 0,this.hass):e.description,selector:$e(e),required:!0===e.required&&!i,disabled:i}},a=[];for(const o of be(e.filter(e=>!H(e))))void 0===o.group?a.push(...o.declarations.map(n)):a.push({name:"",type:"expandable",title:o.group,schema:o.declarations.map(n)});return[...a,...t.extras?[]:[{name:"extras",label:o("editor.extras_label",void 0,this.hass),helper:o("editor.extras_helper",void 0,this.hass),selector:{object:{}}}]]}_formData(e){var t,i,s,o,n,l,d,c,h,p,u,m;if(!e.length)return this._config;const f=a(null===(t=this._config)||void 0===t?void 0:t.variables),g=new Set(e.map(e=>e.name)),v={template:null===(i=this._config)||void 0===i?void 0:i.template};this._shownAs=new Map;const _=function(e,t,i,s){const o=new Map;if(!i||!e.length)return o;const n=a(r(t,i));for(const a of e){if(!(a in n))continue;const e=wi(n[a],t,i,s);null!=e&&""!==e&&o.set(a,e)}return o}(e.filter(e=>!(e.name in f)&&!H(e)).map(e=>e.name),null===(s=this._config)||void 0===s?void 0:s.variables,null===(o=this._templates)||void 0===o?void 0:o[null===(n=this._config)||void 0===n?void 0:n.template],this.hass);for(const a of e){if(!(a.name in f)){if(!_.has(a.name))continue;let e=_.get(a.name);"boolean"in $e(a)&&"boolean"!=typeof e&&(e=us.has(String(e).trim().toLowerCase())),this._shownAs.set(a.name,{shown:e,written:void 0}),v[ls+a.name]=e;continue}const e=f[a.name];if("boolean"!=typeof e&&"boolean"in $e(a)){const t=us.has(String(e).trim().toLowerCase());this._shownAs.set(a.name,{shown:t,written:e}),v[ls+a.name]=t}else v[ls+a.name]=e}const y=D(null===(l=this._config)||void 0===l?void 0:l.variables).filter(e=>{const t=U(e);return void 0!==t&&!g.has(t)});return y.length&&(v.extras=y),void 0!==(null===(d=this._config)||void 0===d?void 0:d.columns)&&(v.columns=this._config.columns),void 0!==(null===(c=this._config)||void 0===c?void 0:c.min_column_width)&&(v.min_column_width=this._config.min_column_width),void 0!==(null===(h=this._config)||void 0===h?void 0:h.gap)&&(v.gap=this._config.gap),void 0!==(null===(p=this._config)||void 0===p?void 0:p.fit)&&(v.fit=this._config.fit),void 0!==(null===(u=this._config)||void 0===u?void 0:u.lazy)&&(v.lazy=this._config.lazy),void 0!==(null===(m=this._config)||void 0===m?void 0:m.lazy_eager)&&(v.lazy_eager=this._config.lazy_eager),v}_renderDiagnostics(t,s){var n,a,r,l,d,h,p,u,m,f,g,v,_,y,b,$,w;if(!t||this._loadingTemplates||!s||F(this._config))return e``;const x=[...this._suppliedNames(t),...i(null===(n=this._config)||void 0===n?void 0:n.rebuild_on),...we(t,c(null===(a=this._config)||void 0===a?void 0:a.variables)),...Object.keys(X(null!==(r=this._lovelace)&&void 0!==r?r:T()))].map(e=>({[e]:null})),{missing:k,unused:j,required:A}=xe(null===(l=this._config)||void 0===l?void 0:l.variables,t,x,[null===(d=this._config)||void 0===d?void 0:d.for_each_from,null===(h=this._config)||void 0===h?void 0:h.on_error],ke(t,X(null!==(p=this._lovelace)&&void 0!==p?p:T()))),S=je(null===(u=this._config)||void 0===u?void 0:u.variables,t,this.hass),O=this._hiddenNames(t,L(t)),C=A.filter(e=>!O.has(e)),E=k.filter(e=>!A.includes(e)&&!O.has(e)),P=new Set(D(null===(m=this._config)||void 0===m?void 0:m.variables).map(U)),N=[...O].filter(e=>P.has(e)),I=ms.test(`${null!==(f=t.style)&&void 0!==f?f:""}\n${null!==(v=null===(g=this._config)||void 0===g?void 0:g.style)&&void 0!==v?v:""}`),V="contents"===(null===(_=this._config)||void 0===_?void 0:_.fit)&&I,q=Number(null===(y=this._config)||void 0===y?void 0:y.columns),H=(void 0!==(null===(b=this._config)||void 0===b?void 0:b.for_each)||void 0!==(null===($=this._config)||void 0===$?void 0:$.for_each_from))&&q>1&&!(Number(null===(w=this._config)||void 0===w?void 0:w.min_column_width)>0),R=M(t),z=Ae(this._config,R);return e`
      ${z.map(t=>{var i,s;return e`<ha-alert alert-type="warning">
            ${o("editor.override_misplaced",{key:t,kind:R,template:null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""},this.hass)}
          </ha-alert>`})}
      ${H?e`<ha-alert alert-type="info">
              ${o("editor.columns_without_min_width",{columns:q},this.hass)}
            </ha-alert>`:e``}
      ${V?e`<ha-alert alert-type="warning">${o("editor.fit_hides_style",void 0,this.hass)}</ha-alert>`:e``}
      ${N.length?e`<ha-alert alert-type="warning">
              ${o(1===N.length?"editor.hidden_but_set_one":"editor.hidden_but_set_many",{names:N.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${C.length?e`<ha-alert alert-type="error">
              ${o(1===C.length?"editor.required_one":"editor.required_many",{names:C.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${E.length?e`<ha-alert alert-type="warning">
              ${o(1===E.length?"editor.optional_one":"editor.optional_many",{names:E.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${S.map(t=>e`<ha-alert alert-type="warning">
            ${o("editor.invalid_value",{name:t.name,expected:t.expected},this.hass)}
          </ha-alert>`)}
      ${j.length?e`<ha-alert alert-type="info">
              ${o(1===j.length?"editor.unused_one":"editor.unused_many",{names:j.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_valueChanged(e){var t,i;const s=e.detail.value,o=L(null===(t=this._templates)||void 0===t?void 0:t[s.template]);if(!o.length)return void g(this,"config-changed",{config:s});const n=[];for(const l of o){let e=s[ls+l.name];const t=this._shownAs.get(l.name);t&&xi(e,t.shown)&&(e=t.written),void 0!==e&&""!==e&&n.push({[l.name]:e})}Array.isArray(s.extras)&&n.push(...s.extras);const a=Object.assign(Object.assign({},this._config),{template:s.template}),r=Se(D(null===(i=this._config)||void 0===i?void 0:i.variables),n);r.length?a.variables=r:delete a.variables,V(a,"columns",s.columns),V(a,"min_column_width",s.min_column_width),V(a,"gap",s.gap),V(a,"lazy",!0===s.lazy||void 0),V(a,"lazy_eager",s.lazy_eager),g(this,"config-changed",{config:a})}_loadBorrowedTemplates(){if(!Oe(this._lovelace))return;this._loadingTemplates=!0;const e=this._editingPlace();Ce(this.hass,this._lovelace,e.view,void 0,e.section).then(e=>{this._templates=e,this._schema=void 0}).finally(()=>{this._loadingTemplates=!1,this.requestUpdate()})}}h([u()],fs.prototype,"_lovelace",void 0),h([u()],fs.prototype,"_config",void 0),h([p()],fs.prototype,"hass",void 0),h([u()],fs.prototype,"_loadingTemplates",void 0),h([u()],fs.prototype,"_ejectPending",void 0),h([u()],fs.prototype,"_sectionsPending",void 0),h([u()],fs.prototype,"_sectionsError",void 0),h([u()],fs.prototype,"_onErrorMode",void 0),h([u()],fs.prototype,"_previewMode",void 0),h([u()],fs.prototype,"_copied",void 0),h([u()],fs.prototype,"_cannotOpen",void 0),h([u()],fs.prototype,"_resume",void 0),h([u()],fs.prototype,"_matchesOpen",void 0),h([u()],fs.prototype,"_byDomainDraft",void 0),h([u()],fs.prototype,"_openItems",void 0),h([u()],fs.prototype,"_pickerFilter",void 0),h([u()],fs.prototype,"_renderedTemplates",void 0);const gs=/^[a-z_]+\.[a-z0-9_]+$/,vs={base:"entity",label:"Entity",selector:{entity:{}},matches:e=>gs.test(e)};function _s(e,t){return{base:e,label:t,selector:{text:{}},matches:e=>e.trim().length>0}}const ys={entity:vs,entity_id:vs,name:_s("name","Name"),title:_s("title","Title"),heading:_s("heading","Heading"),icon:{base:"icon",label:"Icon",selector:{icon:{}},matches:e=>e.includes(":")}};function bs(e,t){return 1===t?e.label:`${e.label} ${t}`}const $s=(e,t=200)=>{if("number"==typeof e&&(e=String(e)),"string"!=typeof e)return;const i=e.trim();return i?i.length>t?`${i.slice(0,t-1)}…`:i:void 0};function ws(e){const t=$s(e,2e3);if(t&&/^https?:\/\/[^\s/]+/i.test(t))return t}const xs=e=>[].concat(null!=e?e:[]).map(e=>$s(e)).filter(e=>!!e).slice(0,50);function ks(e){if("string"==typeof e){const t=$s(e);return t?{name:t}:void 0}if(!e||"object"!=typeof e||Array.isArray(e))return;const t=e,i=$s(t.github),s={name:$s(t.name),github:i&&/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(i)?i:void 0,email:$s(t.email),url:ws(t.url)};for(const o of Object.keys(s))void 0===s[o]&&delete s[o];return Object.keys(s).length?s:void 0}function js(e){const t=e&&"object"==typeof e?e:{},i={author:ks(t.author),license:$s(t.license),help:ws(t.help),homepage:ws(t.homepage),readme:$s(t.readme,8e3),related:xs(t.related),setup:xs(t.setup)};for(const s of["author","license","help","homepage","readme"])void 0===i[s]&&delete i[s];return i}const As=["author","license","help","homepage","readme","requires","setup","related"];function Ss(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);for(const i of As)delete t[i];return t}const Os={integrations:{kind:"integration",key:"integration"},entities:{kind:"entity",key:"entity"},custom_cards:{kind:"custom_card",key:"card"}},Cs=e=>{const t=$s(e,40);return t&&t.replace(/\+$/,"").trim()||void 0};function Es(e){var t;const i=null==e?void 0:e.requires;if(!i||"object"!=typeof i||Array.isArray(i))return[];const s=[];for(const[o,{kind:n,key:a}]of Object.entries(Os))for(const e of[].concat(null!==(t=i[o])&&void 0!==t?t:[]).slice(0,50)){const t=e&&"object"==typeof e&&!Array.isArray(e)?e:void 0,i=xs(t?t[a]:e).map(e=>"custom_card"===n?e.replace(/^custom:/,""):e);if(!i.length)continue;const o=t?$s(t.message,300):void 0;s.push(o?{kind:n,any:i,message:o}:{kind:n,any:i})}for(const o of["homeassistant","card"]){const e=Cs(i[o]);e&&s.push({kind:o,any:[e]})}return s}function Ts(e,t){var i,s;const o=e=>e.split(".").map(e=>parseInt(e,10)||0),n=o(e),a=o(t);for(let r=0;r<Math.max(n.length,a.length);r++){const e=null!==(i=n[r])&&void 0!==i?i:0,t=null!==(s=a[r])&&void 0!==s?s:0;if(e!==t)return e>t}return!0}function Ps(e,t){switch(e.kind){case"integration":return e.any.some(e=>Pe(t.components,e));case"entity":return e.any.some(e=>{const i=function(e){const t=e.replace(/[.+?^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*");return new RegExp(`^${t}$`,"i")}(e);return t.entities.some(e=>i.test(e))});case"custom_card":return e.any.some(e=>t.isDefined(e));case"homeassistant":return!t.homeassistant||Ts(t.homeassistant,e.any[0]);case"card":return t.card.startsWith("0.0.0")||Ts(t.card,e.any[0])}}function Ns(e,t){const i=Ee(e),s=Array.isArray(i)?i.filter(e=>e&&"object"==typeof e):i&&"object"==typeof i?Object.entries(i).map(([e,t])=>({[e]:t})):[],o=s.find(e=>Object.prototype.hasOwnProperty.call(e,t)),n=null==o?void 0:o[t];return"string"==typeof n||"number"==typeof n?String(n):void 0}function Ls(e,t){const i=js(e).setup.filter(e=>"string"==typeof t[e]&&""!==t[e]);if(!i.length)return e;const s=Ee(e),o=(Array.isArray(s)?s.filter(e=>e&&"object"==typeof e):s&&"object"==typeof s?Object.entries(s).map(([e,t])=>({[e]:t})):[]).filter(e=>!i.some(t=>Object.prototype.hasOwnProperty.call(e,t))),n=Object.assign(Object.assign({},e),{default:[...i.map(e=>({[e]:t[e]})),...o]});return delete n[Te],n}const Is={integrations:"requires_integrations",entities:"requires_entities",custom_cards:"requires_custom_cards"},Fs=e=>"string"==typeof e?e:"number"==typeof e?String(e):void 0,Ms=e=>[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);const Vs=e=>"string"==typeof e&&e.trim()?e.trim():void 0,qs=e=>[].concat(null!=e?e:[]).map(Vs).filter(e=>!!e);const Ds=[Fe,Me,...Ve],Hs=["card","badge","row","element","group"],Rs=["type","template","description","author","license","help","homepage","readme","requires","setup","related","variables","default",...Hs,"style"];function zs(e,t){if(Array.isArray(e))for(const i of e)zs(i,t);else if(e&&"object"==typeof e){t(e);for(const i of Object.values(e))zs(i,t)}}function Ws(e){const t=new Set,i=new Set;zs(e,e=>{const s=e.type;if("string"==typeof s){s.startsWith("custom:")&&!Ds.includes(s)&&t.add(s);for(const t of qe(e))i.add(t)}});for(const s of Ne(e))i.add(s);return{customTypes:[...t].sort(),templateRefs:[...i].sort()}}const Us=/\[\[!?([A-Za-z0-9_-]+)/g;function Bs(e,t){const i=JSON.stringify(null!=e?e:null),s=[];for(let o=Us.exec(i);null!==o;o=Us.exec(i)){const e=o[1];if(s.includes(e)||!Object.prototype.hasOwnProperty.call(t,e))continue;const i=t[e];i&&"object"==typeof i&&"item"in i&&s.push(e)}return Us.lastIndex=0,s}function Ks(e){return e.includes("[[")}function Js(e,t){const i=e.split(/\[\[[^\]]*\]\]/);if(!i.join(""))return[];const s=i.map(e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join(".+"),o=new RegExp(`^${s}$`);return t.filter(e=>o.test(e))}function Ys(e,t){var i,s;const n=e&&"object"==typeof e&&void 0!==e[Te]?Object.assign(Object.assign({},e),{default:Ee(e)}):e,a={};for(const o of Rs)void 0!==(null==n?void 0:n[o])&&(a[o]=n[o]);for(const o of Object.keys(null!=n?n:{}))o in a||o===Te||"source"===o||(a[o]=n[o]);const{customTypes:r,templateRefs:l}=Ws(e),d=new Set,h=new Set,p=null==t?void 0:t[null==e?void 0:e.template],u=(e,t)=>{const i=function(e,t){const i={template:e,bundled:[],askedFor:[]};if(!e||"object"!=typeof e||!t||!(Le in t))return i;const s=c(Ee(e)),o=c(t.default).slice(c(t[Le]).length);if(!o.length)return i;const n=new Set(s.map(e=>Object.keys(e)[0])),a=new Set(Ie(Object.assign(Object.assign({},e),{default:[...s,...o]}))),r=new Set(js(e).setup),l=[],d=[],h=[];for(const c of o){const e=Object.keys(c)[0];!a.has(e)||n.has(e)||d.includes(e)||h.includes(e)||(r.has(e)?h.push(e):(l.push(c),d.push(e)))}return l.length?{template:Object.assign(Object.assign({},e),{default:[...s,...l]}),bundled:d,askedFor:h}:{template:e,bundled:d,askedFor:h}}(e,t);for(const s of i.bundled)d.add(s);for(const s of i.askedFor)h.add(s);return i.template};if(p){const t=u(Object.assign(Object.assign({},e),{default:a.default}),p);void 0!==t.default&&(a.default=t.default)}const m=[],f=[];let g=!1;if(t){const i={},s=[...l,...Bs(e,t)],o=null==e?void 0:e.template,n=new Set(js(e).related.filter(e=>e!==o));for(s.push(...n);s.length;){const e=s.shift();if(e in i||e===o)continue;if(Ks(e)){f.includes(e)||f.push(e);const i=Js(e,Object.keys(t)).filter(e=>e!==o);i.length&&(g=!0),s.push(...i);continue}const a=t[e];if(a){i[e]=u(Gs(Zs(a)),a),s.push(...Ws(a).templateRefs,...Bs(a,t));for(const e of js(a).related)e===o||n.has(e)||(n.add(e),s.push(e))}else n.has(e)||m.push(e)}Object.keys(i).length&&(a.includes=i)}else for(const o of l)(Ks(o)?f:m).push(o);const v=new Set(r);for(const o of Object.values(null!==(i=a.includes)&&void 0!==i?i:{}))for(const e of Ws(o).customTypes)v.add(e);const _=new Set;for(const o of Es(a))"custom_card"===o.kind&&o.any.forEach(e=>_.add(e));const y=[...v].map(e=>e.replace(/^custom:/,"")).filter(e=>!_.has(e));if(y.length){const e=a.requires,t=e&&"object"==typeof e&&!Array.isArray(e)?Object.assign({},e):{};t.custom_cards=[...[].concat(null!==(s=t.custom_cards)&&void 0!==s?s:[]),...y.sort()],a.requires=t,function(e){const t=Object.entries(e);for(const[s]of t)delete e[s];const i=e=>{const t=Rs.indexOf(e);return-1===t?Rs.length:t};for(const[s,o]of t.sort((e,t)=>i(e[0])-i(t[0])))e[s]=o}(a)}const b=[];if(m.length&&b.push(o("share.uses_other_templates",{names:m.join(", ")})),f.length){const e=g?"share.picked_templates_found":"share.picked_templates";b.push(o(e,{names:f.join(", ")}))}d.size&&b.push(o("share.bundled_values",{names:[...d].sort().join(", ")})),h.size&&b.push(o("share.setup_values_left_out",{names:[...h].sort().join(", ")}));const $=function(e){const t=null==e?void 0:e.requires;return t&&"object"==typeof t?["homeassistant","card"].filter(e=>"number"==typeof t[e]):[]}(e);return $.length&&b.push(o("share.version_unquoted",{keys:$.join(", ")})),{payload:a,notes:b}}function Zs(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);return delete t.source,t}function Gs(e){if(!e||"object"!=typeof e||!(Le in e))return e;const t=e[Le],i=Object.assign({},e);return null==t||Array.isArray(t)&&!t.length?delete i.default:i.default=t,i}function Qs(e,t){if(!t.includes(e))return e;let i=2;for(;t.includes(`${e}_${i}`);)i+=1;return`${e}_${i}`}function Xs(e){if(!e||"object"!=typeof e||Array.isArray(e))return{ok:!1,errors:[o("share.import_not_a_template")]};const t=[];"string"==typeof e.template&&e.template.trim()||t.push(o("share.import_no_name"));const i=Hs.filter(t=>void 0!==e[t]);return 0===i.length?t.push(o("share.import_defines_nothing")):i.length>1&&t.push(o("share.import_defines_both",{first:i[0],second:i[1]})),{ok:0===t.length,errors:t}}function eo(e,t){const i=new Set;for(const s of e)for(const e of Ws(s).customTypes){const s=e.slice(7);s&&!t(s)&&i.add(s)}return[...i].sort()}const to=["card","badge","row","element","group"],io=/^[A-Za-z0-9_-]+$/,so=/^[a-z_]+\.[a-z0-9_]+$/;function oo(e){return to.find(t=>void 0!==(null==e?void 0:e[t])&&null!==(null==e?void 0:e[t]))}function no(e){return e.map(e=>"number"==typeof e?`#${e+1}`:e).join(" › ")}function ao(e){const t=new Set;for(const o of De(null==e?void 0:e.variables))o&&"string"==typeof o.name&&t.add(o.name);const i=JSON.stringify(null!=e?e:{}),s=/\[\[([A-Za-z0-9_-]+)/g;for(let o=s.exec(i);o;o=s.exec(i))t.add(o[1]);return[...t]}function ro(e){return"boolean"==typeof e?"boolean":"number"==typeof e?"number":"string"==typeof e&&so.test(e)?"entity":"string"==typeof e&&/^[a-z]+:[a-z0-9-]+$/.test(e)?"icon":"text"}function lo(e,t,i){if(!t.length)return i;const[s,...o]=t;return Array.isArray(e)?e.map((e,t)=>t===s?lo(e,o,i):e):Object.assign(Object.assign({},e),{[s]:lo(null==e?void 0:e[s],o,i)})}function co(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}function ho(e,t,i){if(!io.test(i))return{ok:!1,error:"name_invalid"};if(ao(e).includes(i))return{ok:!1,error:"name_taken"};const s=oo(e),o=s?co(e[s],t):void 0;if(!s||null==o||"object"==typeof o)return{ok:!1,error:"gone"};const n={name:i,type:ro(o),default:o};return{ok:!0,template:Object.assign(Object.assign({},e),{[s]:lo(e[s],t,`[[${i}]]`),variables:He(e.variables,[n])})}}function po(e,t){const i=oo(e);return i?co(e[i],t):void 0}function uo(e){const t=Object.assign({},e);return delete t.name,t}const mo=["card","badge","row","element","group","style","let","default","grid_options","name"],fo="default:";function go(e){return e.startsWith("or:")?Ye(e):We(e)}function vo(e,t,i){if(!e.includes("[[")&&!e.includes("]]"))return;const s=function(e){let t=0,i=!1;for(let s=0;s<e.length-1;s+=1){const o=e.slice(s,s+2);"[["===o?(t+=1,s+=1):"]]"===o&&(0===t?i=!0:t-=1,s+=1)}return{unclosed:t>0,stray:i}}(e);s.unclosed&&i.findings.push({level:"warning",key:"lint.unclosed",params:{},path:t}),s.stray&&i.findings.push({level:"warning",key:"lint.stray_close",params:{},path:t});let o=e;for(let n=0;n<5;n+=1){let e=!1;if(o=o.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(s,o)=>(e=!0,o.startsWith(Ue)||_o(o,t,i),"_")),!e)break}}function _o(e,t,i){const s=e.endsWith("?")?e.slice(0,-1):e,[o,...n]=s.split("|"),a=`[[${e}]]`,r=o.endsWith("?")?o.slice(0,-1):o,l=void 0===Be(r)?r.split(".")[0]:void 0;l&&"_"!==l&&!i.heads.has(l)&&i.heads.set(l,t);let d=!1;for(const c of n){if(!Ke(c)){const e=Je(c);i.findings.push({level:"warning",key:"lint.unknown_step",params:e?{step:c,placeholder:a,closest:e}:{step:c,placeholder:a},path:t});continue}(c.startsWith(fo)||c.startsWith("or:"))&&d&&i.findings.push({level:"warning",key:"lint.after_default",params:{step:c,placeholder:a},path:t}),c.startsWith(fo)&&c.length>8&&(d=!0);const e=go(c);e&&"_"!==e&&i.targets.push({name:e,placeholder:a,path:t})}}function yo(e,t,i){if("string"!=typeof e){if(Array.isArray(e))e.forEach((e,s)=>yo(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,o]of Object.entries(e))vo(s,t,i),yo(o,t?`${t}.${s}`:s,i)}else vo(e,t,i)}function bo(e){const t=new Set;for(const i of L(e))t.add(i.name);for(const i of[...c(Ee(e)),...c(null==e?void 0:e.let)]){const e=U(i);void 0!==e&&t.add(e)}return[...t]}function $o(e,t=[]){if(!e||"object"!=typeof e)return[];const i={findings:[],heads:new Map,targets:[]};for(const n of mo){const t=e[n];void 0!==t&&yo(t,n,i)}L(e).forEach((e,t)=>{void 0!==e.default&&yo(e.default,`variables[${t}].default`,i);for(const s of["show_if","hide_if"]){const o=`variables[${t}].${s}`;for(const t of Re(e,s)){const e=t.slice(3);if(!ze(t)){i.findings.push({level:"warning",key:"lint.condition_malformed",params:{key:s,condition:e},path:o});continue}const n=We(t);n&&i.targets.push({name:n.split(".")[0],placeholder:`${s}: ${e}`,path:o})}}});const s=new Set([...bo(e),...t,...fe,...we(e)]),o=[...i.findings],a=e=>s.has(e)||i.heads.has(e),r=e=>a(e)||e.split(".").some((e,t,i)=>t>0&&a(i.slice(0,t).join(".")));for(const c of i.targets){if(r(c.name))continue;const e=n(c.name,[...s,...i.heads.keys()]);o.push({level:"warning",key:"lint.target_unknown",params:e?{name:c.name,placeholder:c.placeholder,closest:e}:{name:c.name,placeholder:c.placeholder},path:c.path})}const l=[...i.heads.entries()].filter(([e])=>!s.has(e));l.length&&o.push({level:"info",key:"lint.undeclared",params:{names:l.map(([e,t])=>l.length>1?`${e} (${t})`:e).join(", ")},path:l.length>1?"":l[0][1]});for(const c of function(e){return yi(e).filter(e=>!vi.includes(e)).map(e=>{const t=n(e,vi);return t?{name:e,closest:t}:{name:e}})}(e))o.push({level:"warning",key:"lint.editor_hide_unknown",params:Object.assign({},c),path:"editor_hide"});const d=new Set;return o.filter(e=>{const t=JSON.stringify([e.key,e.params,e.path]);return!d.has(t)&&(d.add(t),!0)})}const wo=f`
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

  ${Ze.styles}
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
 */,xo=2,ko=e=>(...t)=>({_$litDirective$:e,values:t});let jo=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:Ao}=Ge,So=e=>e,Oo=()=>document.createComment(""),Co=(e,t,i)=>{const s=e._$AA.parentNode,o=void 0===t?e._$AB:t._$AA;if(void 0===i){const t=s.insertBefore(Oo(),o),n=s.insertBefore(Oo(),o);i=new Ao(t,n,e,e.options)}else{const t=i._$AB.nextSibling,n=i._$AM,a=n!==e;if(a){let t;i._$AQ?.(e),i._$AM=e,void 0!==i._$AP&&(t=e._$AU)!==n._$AU&&i._$AP(t)}if(t!==o||a){let e=i._$AA;for(;e!==t;){const t=So(e).nextSibling;So(s).insertBefore(e,o),e=t}}}return i},Eo=(e,t,i=e)=>(e._$AI(t,i),e),To={},Po=(e,t=To)=>e._$AH=t,No=e=>{e._$AR(),e._$AA.remove()},Lo=ko(class extends jo{constructor(){super(...arguments),this.key=Qe}render(e,t){return this.key=e,t}update(e,[t,i]){return t!==this.key&&(Po(e),this.key=t),i}}),Io=[{name:"room_light_tile",summary:"A tile per light, with the light named after itself.",template:{description:"A tile for one light, taking its name from Home Assistant.",variables:[{name:"entity",label:"Light",selector:{entity:{domain:"light"}},required:!0},{name:"name",label:"Name",description:"Leave empty to use the light’s own name",selector:{text:{}}}],card:{type:"tile",entity:"[[entity]]",name:"[[name|or:entity|friendly_name]]",features:[{type:"light-brightness"}]}}},{name:"room_summary",summary:"A heading per area, listing the lights in it. Uses grouping.",template:{description:"One card per area, with a tile for every light in that area.",card:{type:"vertical-stack",cards:[{type:"markdown",content:"## [[area]]\n\n[[entity_count]] lights"},{type:"custom:decluttering-card-plus",template:"room_light_tile",for_each:"[[items]]"}]}}},{name:"sensor_line",summary:"An Entities row showing one sensor with its area.",template:{description:"A row for one sensor, labelled with the area it is in.",variables:[{name:"entity",label:"Sensor",selector:{entity:{}},required:!0}],row:{entity:"[[entity]]",name:"[[entity|friendly_name]] ([[entity|area|default:no area]])"}}},{name:"status_badge",summary:"A badge that only appears when something needs attention.",template:{description:"A badge for one entity, hidden unless it is in the state you care about.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0},{name:"when",label:"Show when the state is",selector:{text:{}},default:"on"}],badge:{type:"entity",entity:"[[entity]]",visibility:[{condition:"state",entity:"[[entity]]",state:"[[when]]"}]}}},{name:"counted_grid",summary:'A numbered grid of anything, showing "3 of 12".',template:{description:"A tile that knows where it sits in a repeat.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0}],card:{type:"tile",entity:"[[entity]]",name:"[[entity|friendly_name]]",footer:{type:"markdown",content:"[[index]] of [[total|or:count]]"}}}}];
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Fo(e){return Io.find(t=>t.name===e)}function Mo(e,t){const i=new Set,s=e=>{Array.isArray(e)?e.forEach(s):e&&"object"==typeof e&&("string"==typeof e.type&&e.type.includes("decluttering-card")&&"string"==typeof e.template&&i.add(e.template),Object.values(e).forEach(s))};return s(e.template),[...i].filter(e=>!t.includes(e))}function Vo(e,t){return{library:e,version:t}}
/*! js-yaml 5.5.0 https://github.com/nodeca/js-yaml @license MIT */var qo=Symbol("NOT_RESOLVED");function Do(e,t){return{tagName:e,nodeKind:"scalar",implicit:t.implicit??!1,matchByTagPrefix:t.matchByTagPrefix??!1,implicitFirstChars:t.implicitFirstChars??null,resolve:t.resolve,identify:t.identify,represent:t.represent??(e=>String(e)),representTagName:t.representTagName??(()=>e)}}function Ho(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"sequence",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addItem:t.addItem,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}function Ro(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"mapping",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addPair:t.addPair,has:t.has,keys:t.keys,get:t.get,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}var zo=Do("tag:yaml.org,2002:str",{resolve:e=>e,identify:e=>"string"==typeof e}),Wo=["","~","null","Null","NULL"],Uo=Do("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==Wo.indexOf(e)?null:qo,identify:e=>null===e,represent:()=>"null"}),Bo=Do("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(e,t)=>"null"===e||t&&""===e?null:qo,identify:e=>null===e,represent:()=>"null"}),Ko=["","~","null","Null","NULL"],Jo=Do("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==Ko.indexOf(e)?null:qo,identify:e=>null===e,represent:()=>"null"}),Yo=["true","True","TRUE"],Zo=["false","False","FALSE"],Go=Do("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:e=>-1!==Yo.indexOf(e)||-1===Zo.indexOf(e)&&qo,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Qo=["true"],Xo=["false"],en=Do("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:e=>-1!==Qo.indexOf(e)||-1===Xo.indexOf(e)&&qo,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),tn=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],sn=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],on=Do("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:e=>-1!==tn.indexOf(e)||-1===sn.indexOf(e)&&qo,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),nn=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),an=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var rn=Do("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e,t){if(t){if(!an.test(e))return qo}else if(!nn.test(e))return qo;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:qo},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),ln=new RegExp("^-?(?:0|[1-9][0-9]*)$"),dn=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var cn=Do("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!dn.test(e))return qo}else if(!ln.test(e))return qo;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:qo},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),hn=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$");var pn=Do("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e){if(!hn.test(e))return qo;const t=function(e){let t=e.replace(/_/g,""),i=1;if("-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b"))return i*parseInt(t.slice(2),2);if(t.startsWith("0x"))return i*parseInt(t.slice(2),16);if(t.includes(":")){let e=0;for(const i of t.split(":"))e=60*e+Number(i);return i*e}return"0"!==t&&"0"===t[0]?i*parseInt(t,8):i*parseInt(t,10)}(e);return Number.isFinite(t)?t:qo},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),un=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),mn=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var fn=Do("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!un.test(e))return qo;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const s=i*parseFloat(t);return Number.isFinite(s)||mn.test(e)?s:qo},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),gn=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),vn=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var _n=Do("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!vn.test(e))return qo;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const s=i*parseFloat(t);return Number.isFinite(s)?s:qo}if(!gn.test(e))return qo;const i=Number(e);return Number.isFinite(i)?i:qo},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),yn=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),bn=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var $n=Do("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!yn.test(e))return qo;let t=e.toLowerCase().replace(/_/g,"");const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;let s=0;if(t.includes(":")){for(const e of t.split(":"))s=60*s+Number(e);s*=i}else s=i*parseFloat(t);return Number.isFinite(s)||bn.test(e)?s:qo},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),wn=Do("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(e,t)=>"<<"===e||t&&""===e?"<<":qo,identify:()=>!1}),xn=/^[A-Za-z0-9+/]*={0,2}$/;var kn=Do("tag:yaml.org,2002:binary",{resolve:function(e){const t=e.replace(/\s/g,"");if(t.length%4!=0||!xn.test(t))return qo;const i=atob(t),s=new Uint8Array(i.length);for(let o=0;o<i.length;o++)s[o]=i.charCodeAt(o);return s},identify:e=>"[object Uint8Array]"===Object.prototype.toString.call(e),represent:function(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t)}}),jn=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),An=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function Sn(e,t,i,s=0,o=0,n=0,a=0){const r=new Date(Date.UTC(e,t,i,s,o,n,a));return r.setUTCFullYear(e,t,i),r}var On=Do("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(e){let t=jn.exec(e);if(null===t&&(t=An.exec(e)),null===t)return qo;const i=+t[1],s=+t[2]-1,o=+t[3];if(!t[4]){const e=Sn(i,s,o);return e.getUTCFullYear()!==i||e.getUTCMonth()!==s||e.getUTCDate()!==o?qo:e}const n=+t[4],a=+t[5],r=+t[6];let l=0;if(n>23||a>59||r>59)return qo;if(t[7]){let e=t[7].slice(0,3);for(;e.length<3;)e+="0";l=+e}const d=Sn(i,s,o,n,a,r,l);if(d.getUTCFullYear()!==i||d.getUTCMonth()!==s||d.getUTCDate()!==o)return qo;if(t[9]){const e=+t[10],i=+(t[11]||0);if(e>23||i>59)return qo;const s=6e4*(60*e+i);d.setTime(d.getTime()-("-"===t[9]?-s:s))}return d},identify:e=>e instanceof Date,represent:e=>e.toISOString()}),Cn=Ho("tag:yaml.org,2002:seq",{create:()=>[],addItem:(e,t)=>{e.push(t)},identify:Array.isArray});function En(e){if(null===e||"object"!=typeof e||Array.isArray(e))return!1;const t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}function Tn(e,t){const i={};for(const s of t)void 0!==e[s]&&(i[s]=e[s]);return i}var Pn=Ho("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(e,t)=>{let i;if(t instanceof Map){if(1!==t.size)return"cannot resolve an ordered map item";i=t.keys().next().value}else{if(!En(t))return"cannot resolve an ordered map item";{const e=Object.keys(t);if(1!==e.length)return"cannot resolve an ordered map item";i=e[0]}}return e.seen.has(i)?"duplicate key in ordered map":(e.seen.add(i),e.list.push(t),"")},finalize:e=>e.list,identify:()=>!1}),Nn=Ho("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(e,t)=>{if(t instanceof Map)return 1!==t.size?"cannot resolve a pairs item":(e.push(t.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(t))return"cannot resolve a pairs item";const i=t,s=Object.keys(i);return 1!==s.length?"cannot resolve a pairs item":(e.push([s[0],i[s[0]]]),"")},identify:()=>!1}),Ln=Ro("tag:yaml.org,2002:map",{create:()=>({}),identify:En,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{if(null!==t&&"object"==typeof t)return"object-based map does not support complex keys";const s=String(t);return"__proto__"===s?Object.defineProperty(e,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[s]=i,""},has:(e,t)=>(null===t||"object"!=typeof t)&&Object.prototype.hasOwnProperty.call(e,String(t)),keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}}),In=Ro("tag:yaml.org,2002:set",{create:()=>new Set,identify:e=>e instanceof Set,represent:e=>{const t=new Map;for(const i of e)t.set(i,null);return t},addPair:(e,t,i)=>null!==i?"cannot resolve a set item":(e.add(t),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:()=>null});var Fn=class e{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(e){const t=function(e){const t=[];for(const i of e){let e=t.length;for(let s=0;s<t.length;s++){const o=t[s];if(o.nodeKind===i.nodeKind&&o.tagName===i.tagName&&o.matchByTagPrefix===i.matchByTagPrefix){e=s;break}}t[e]=i}return t}(e),i=[],s={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},o={scalar:[],sequence:[],mapping:[]};for(const d of t){if("scalar"===d.nodeKind&&d.implicit){if(d.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(d)}switch(d.nodeKind){case"scalar":d.matchByTagPrefix?o.scalar.push(d):s.scalar[d.tagName]=d;break;case"sequence":d.matchByTagPrefix?o.sequence.push(d):s.sequence[d.tagName]=d;break;case"mapping":d.matchByTagPrefix?o.mapping.push(d):s.mapping[d.tagName]=d}}const n=i.filter(e=>null===e.implicitFirstChars),a=new Set;for(const d of i)if(null!==d.implicitFirstChars)for(const e of d.implicitFirstChars)a.add(e);const r=new Map;for(const d of a)r.set(d,i.filter(e=>null===e.implicitFirstChars||-1!==e.implicitFirstChars.indexOf(d)));const l=s.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=t,this.implicitScalarTags=i,this.implicitScalarByFirstChar=r,this.implicitScalarAnyFirstChar=n,this.defaultScalarTag=l,this.defaultSequenceTag=s.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=s.mapping["tag:yaml.org,2002:map"],this.exact=s,this.prefix=o}lookupScalarTag(e){const t=this.exact.scalar[e];if(t)return t;for(const i of this.prefix.scalar)if(e.startsWith(i.tagName))return i}lookupSequenceTag(e){const t=this.exact.sequence[e];if(t)return t;for(const i of this.prefix.sequence)if(e.startsWith(i.tagName))return i}lookupMappingTag(e){const t=this.exact.mapping[e];if(t)return t;for(const i of this.prefix.mapping)if(e.startsWith(i.tagName))return i}resolveImplicitScalarTag(e){const t=this.implicitScalarByFirstChar.get(e.charAt(0))??this.implicitScalarAnyFirstChar;for(const s of t){const t=s.resolve(e,!1,s.tagName);if(t!==qo)return{value:t,tag:s}}const i=this.defaultScalarTag;return{value:i.resolve(e,!1,i.tagName),tag:i}}withTags(...t){let i=[];for(const e of t)i=i.concat(e);return new e([...this.tags,...i])}},Mn=new Fn([zo,Cn,Ln]);new Fn([...Mn.tags,Bo,en,cn,_n]);var Vn=new Fn([...Mn.tags,Uo,Go,rn,fn]);function qn(e){if(Array.isArray(e)){const t=Array.prototype.slice.call(e);for(let e=0;e<t.length;e++){if(Array.isArray(t[e]))return null;"object"==typeof t[e]&&"[object Object]"===Object.prototype.toString.call(t[e])&&(t[e]="[object Object]")}return String(t)}return"object"==typeof e&&"[object Object]"===Object.prototype.toString.call(e)?"[object Object]":String(e)}new Fn([...Mn.tags,Jo,on,pn,$n,On,wn,kn,Pn,Nn,In]).withTags({...pn,resolve:(e,t,i)=>{const s=pn.resolve(e,t,i);return s===qo?rn.resolve(e,t,i):s}},{...$n,resolve:(e,t,i)=>{const s=$n.resolve(e,t,i);return s===qo?fn.resolve(e,t,i):s}}),Ro("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(e,t,i)=>(e.set(t,i),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:(e,t)=>e.get(t),identify:e=>e instanceof Map||En(e),represent:e=>{if(e instanceof Map)return e;const t=new Map,i=e;for(const s of Object.keys(i))t.set(s,i[s]);return t}}),Ro("tag:yaml.org,2002:map",{create:()=>({}),identify:En,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{const s=qn(t);return null===s?"nested arrays are not supported inside keys":("__proto__"===s?Object.defineProperty(e,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[s]=i,"")},has:(e,t)=>{const i=qn(t);return null!==i&&Object.prototype.hasOwnProperty.call(e,i)},keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}});var Dn={maxLength:79,indent:1,linesBefore:3,linesAfter:2};function Hn(e,t,i,s,o){let n="",a="";const r=Math.floor(o/2)-1;return s-t>r&&(n=" ... ",t=s-r+n.length),i-s>r&&(a=" ...",i=s+r-a.length),{str:n+e.slice(t,i).replace(/\t/g,"→")+a,pos:s-t+n.length}}function Rn(e,t){return" ".repeat(Math.max(t-e.length,0))+e}function zn(e,t){let i="";return e.mark?(e.mark.name&&(i+=`in "${e.mark.name}" `),i+=`(${e.mark.line+1}:${e.mark.column+1})`,!t&&e.mark.snippet&&(i+=`\n\n${e.mark.snippet}`),`${e.reason} ${i}`):e.reason}var Wn=class e extends Error{reason;mark;constructor(e,t){super(),this.name="YAMLException",this.reason=e,this.mark=t,this.message=zn(this,!1),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}toString(e){return`${this.name}: ${zn(this,e)}`}static throwAt(t,i,s,o=""){let n=0,a=0;for(let e=0;e<i;e++){const i=t.charCodeAt(e);10===i?(n++,a=e+1):13===i&&(n++,10===t.charCodeAt(e+1)&&e++,a=e+1)}const r={name:o,buffer:t,position:i,line:n,column:i-a};throw r.snippet=function(e,t){if(!e.buffer)return null;const i={...Dn,...t},s=/\r?\n|\r|\0/g,o=[0],n=[];let a,r=-1;for(;a=s.exec(e.buffer);)n.push(a.index),o.push(a.index+a[0].length),e.position<=a.index&&r<0&&(r=o.length-2);r<0&&(r=o.length-1);let l="";const d=Math.min(e.line+i.linesAfter,n.length).toString().length,c=i.maxLength-(i.indent+d+3);for(let p=1;p<=i.linesBefore&&!(r-p<0);p++){const t=Hn(e.buffer,o[r-p],n[r-p],e.position-(o[r]-o[r-p]),c);l=`${" ".repeat(i.indent)}${Rn((e.line-p+1).toString(),d)} | ${t.str}\n${l}`}const h=Hn(e.buffer,o[r],n[r],e.position,c);l+=`${" ".repeat(i.indent)}${Rn((e.line+1).toString(),d)} | ${h.str}\n`,l+=`${"-".repeat(i.indent+d+3+h.pos)}^\n`;for(let p=1;p<=i.linesAfter&&!(r+p>=n.length);p++){const t=Hn(e.buffer,o[r+p],n[r+p],e.position-(o[r]-o[r+p]),c);l+=`${" ".repeat(i.indent)}${Rn((e.line+p+1).toString(),d)} | ${t.str}\n`}return l.replace(/\n$/,"")}(r),new e(s,r)}},Un=1,Bn=2,Kn=3,Jn=4,Yn=5,Zn=6,Gn=1,Qn=2,Xn=3,ea=4,ta=5,ia=1,sa=2,oa=1,na=2,aa=3;function ra(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}var la=new Array(256),da=new Array(256);for(let Qd=0;Qd<256;Qd++)la[Qd]=ra(Qd)?1:0,da[Qd]=ra(Qd);function ca(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function ha(e){return e>=48&&e<=57?e-48:(32|e)-97+10}function pa(e){return 120===e?2:117===e?4:8}function ua(e,t,i){let s=0;for(;t<i;){const i=e.charCodeAt(t);if(10===i)s++,t++;else if(13===i)s++,t++,10===e.charCodeAt(t)&&t++;else{if(32!==i&&9!==i)break;t++}}return{position:t,breaks:s}}function ma(e){return 1===e?" ":"\n".repeat(e-1)}function fa(e,t,i,s,o,n){const a=s<0?0:s,r=e.slice(t,i).replace(/\r\n?/g,"\n"),l=""===r?[]:(r.endsWith("\n")?r.slice(0,-1):r).split("\n");let d="",c=!1,h=0,p=!1;for(const u of l){let e=0;for(;e<a&&32===u.charCodeAt(e);)e++;if(s<0||e>=u.length){h++;continue}const t=u.slice(a),i=t.charCodeAt(0);n?32===i||9===i?(p=!0,d+="\n".repeat(c?1+h:h)):p?(p=!1,d+="\n".repeat(h+1)):0===h?c&&(d+=" "):d+="\n".repeat(h):d+="\n".repeat(c?1+h:h),d+=t,c=!0,h=0}return o===aa?d+="\n".repeat(c?1+h:h):o!==na&&c&&(d+="\n"),d}function ga(e,t){if(-1===t.valueStart)return"";const{valueStart:i,valueEnd:s}=t;if(t.fast)return e.slice(i,s);switch(t.style){case Qn:return function(e,t,i){let s="",o=t,n=t,a=t;for(;o<i;){const t=e.charCodeAt(o);if(39===t)s+=e.slice(n,o)+"'",o+=2,n=a=o;else if(10===t||13===t){s+=e.slice(n,a);const t=ua(e,o,i);s+=ma(t.breaks),o=n=a=t.position}else o++,32!==t&&9!==t&&(a=o)}return s+e.slice(n,i)}(e,i,s);case Xn:return function(e,t,i){let s="",o=t,n=t,a=t;for(;o<i;){const t=e.charCodeAt(o);if(92===t){s+=e.slice(n,o),o++;const t=e.charCodeAt(o);if(10===t||13===t)o=ua(e,o,i).position;else if(t<256&&la[t])s+=da[t],o++;else{let i=pa(t),n=0;for(;i>0;i--)o++,n=(n<<4)+ha(e.charCodeAt(o));s+=ca(n),o++}n=a=o}else if(10===t||13===t){s+=e.slice(n,a);const t=ua(e,o,i);s+=ma(t.breaks),o=n=a=t.position}else o++,32!==t&&9!==t&&(a=o)}return s+e.slice(n,i)}(e,i,s);case ea:return fa(e,i,s,t.indent,t.chomping,!1);case ta:return fa(e,i,s,t.indent,t.chomping,!0);default:return function(e,t,i){let s="",o=t,n=t,a=t;for(;o<i;){const t=e.charCodeAt(o);if(10===t||13===t){s+=e.slice(n,a);const t=ua(e,o,i);s+=ma(t.breaks),o=n=a=t.position}else o++,32!==t&&9!==t&&(a=o)}return s+e.slice(n,a)}(e,i,s)}}var va=Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"});function _a(e){let t="",i=0;for(;i<e.length;){if(37!==e.charCodeAt(i)){t+=e[i++];continue}let s=parseInt(e.slice(i+1,i+3),16);if(i+=3,s>=192){let t=s<224?1:s<240?2:3;for(s&=(1<<6-t)-1;t-- >0;)s=s<<6|63&parseInt(e.slice(i+1,i+3),16),i+=3}s<65536?t+=String.fromCharCode(s):(s-=65536,t+=String.fromCharCode(55296|s>>10,56320|1023&s))}return t}function ya(e,t){if(e.startsWith("!<")&&e.endsWith(">"))return _a(e.slice(2,-1));const i=e.indexOf("!",1),s=-1===i?"!":e.slice(0,i+1);return _a(t?.[s]??va[s]??s)+_a(e.slice(s.length))}var ba=-1,$a={filename:"",schema:Vn,json:!1,maxTotalMergeKeys:1e4,maxAliases:-1};function wa(e){return"tagStart"in e&&e.tagStart!==ba?e.tagStart:"anchorStart"in e&&e.anchorStart!==ba?e.anchorStart:"valueStart"in e&&e.valueStart!==ba?e.valueStart:"start"in e?e.start:0}function xa(e,t){Wn.throwAt(e.source,e.position,t,e.filename)}function ka(e,t,i,s){try{return i.finalize(s)}catch(o){if(o instanceof Wn)throw o;Wn.throwAt(e.source,t,o instanceof Error?o.message:String(o),e.filename)}}function ja(e,t){const i=ga(e.source,t),s=t.tagStart===ba?"":e.source.slice(t.tagStart,t.tagEnd),o=e.schema.defaultScalarTag;if(""!==s){if("!"===s)return{value:i,tag:o};const t=ya(s,e.tagHandlers),n=e.schema.lookupScalarTag(t);if(n){const s=n.resolve(i,!0,t);return s===qo&&xa(e,`cannot resolve a node with !<${t}> explicit tag`),{value:s,tag:n}}const a=e.schema.lookupMappingTag(t)??e.schema.lookupSequenceTag(t);if(a){""!==i&&xa(e,`cannot resolve a node with !<${t}> explicit tag`);const s=a.create(t);return{value:a.carrierIsResult?s:ka(e,e.position,a,s),tag:a}}xa(e,`unknown scalar tag !<${t}>`)}return t.style===Gn?e.schema.resolveImplicitScalarTag(i):{value:o.resolve(i,!1,o.tagName),tag:o}}function Aa(e,t,i){const s=t.tagStart===ba?"":e.source.slice(t.tagStart,t.tagEnd);return""===s||"!"===s?i:ya(s,e.tagHandlers)}function Sa(e){return"mapping"===e.nodeKind}function Oa(e){e.totalMergeKeys++,-1!==e.maxTotalMergeKeys&&e.totalMergeKeys>e.maxTotalMergeKeys&&xa(e,`merge keys exceeded maxTotalMergeKeys (${e.maxTotalMergeKeys})`)}function Ca(e,t,i,s){Oa(e);for(const o of s.keys(i)){if(Oa(e),t.tag.has(t.value,o))continue;const n=t.tag.addPair(t.value,o,s.get(i,o));n&&xa(e,n),t.overridable??=new Set,t.overridable.add(o)}}function Ea(e,t,i,s,o){if(e.position=t.keyPosition,t.keyIsMerge)return void function(e,t,i,s){if(e.position=t.keyPosition,Sa(s))Ca(e,t,i,s);else if("sequence"===s.nodeKind&&Array.isArray(i)){i.length>100&&xa(e,"abnormal merge sequence size");for(const s of i){const i=e.nodeTags.get(s);i||xa(e,"cannot merge mappings; the provided source object is unacceptable"),Ca(e,t,s,i)}}else xa(e,"cannot merge mappings; the provided source object is unacceptable")}(e,t,s,o);e.json||!t.tag.has(t.value,i)||t.overridable?.has(i)||xa(e,"duplicated mapping key");const n=t.tag.addPair(t.value,i,s);n&&xa(e,n),t.overridable?.delete(i)}function Ta(e,t,i){const s=e.frames[e.frames.length-1];if("document"===s.kind)s.value=t,s.hasValue=!0;else if("sequence"===s.kind){Sa(i)&&e.nodeTags.set(t,i);const o=s.tag.addItem(s.value,t,s.index++);o&&xa(e,o)}else if(s.hasKey){const o=s.key;s.key=void 0,s.hasKey=!1,Ea(e,s,o,t,i)}else s.key=t,s.keyPosition=e.position,s.hasKey=!0,s.keyIsMerge="tag:yaml.org,2002:merge"===i.tagName}function Pa(e,t,i,s,o){if(t.anchorStart!==ba){const n={value:i,tag:s,isValueFinal:o};return e.anchors.set(e.source.slice(t.anchorStart,t.anchorEnd),n),n}return null}var Na=-1,La=Object.prototype.hasOwnProperty,Ia=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Fa=/[,\[\]{}]/,Ma=/^(?:!|!!|![0-9A-Za-z-]+!)$/,Va=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,qa=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`,Da=new RegExp(`^(?:${Va})*$`),Ha=new RegExp(`^(?:${qa})+$`),Ra=new RegExp(`^(?:!(?:${Va})*|${qa}(?:${Va})*)$`),za={filename:"",maxDepth:100};function Wa(e,t,i,s,o,n,a){e.events.push({type:Bn,start:t,anchorStart:i,anchorEnd:s,tagStart:o,tagEnd:n,style:a})}function Ua(e,t,i,s,o,n,a){e.events.push({type:Kn,start:t,anchorStart:i,anchorEnd:s,tagStart:o,tagEnd:n,style:a})}function Ba(e,t){e.events.splice(t.eventsLength,0,{type:Kn,start:t.position,anchorStart:Na,anchorEnd:Na,tagStart:Na,tagEnd:Na,style:sa})}function Ka(e,t,i,s,o,n,a,r,l=oa,d=-1,c=!1){e.events.push({type:Jn,valueStart:t,valueEnd:i,anchorStart:s,anchorEnd:o,tagStart:n,tagEnd:a,style:r,chomping:l,indent:d,fast:c})}function Ja(e){e.events.push({type:Zn})}function Ya(e){Ka(e,Na,Na,Na,Na,Na,Na,Gn)}function Za(){return{anchorStart:Na,anchorEnd:Na,tagStart:Na,tagEnd:Na}}function Ga(e){return{position:e.position,line:e.line,lineStart:e.lineStart,lineIndent:e.lineIndent,firstTabInLine:e.firstTabInLine,eventsLength:e.events.length}}function Qa(e,t){e.position=t.position,e.line=t.line,e.lineStart=t.lineStart,e.lineIndent=t.lineIndent,e.firstTabInLine=t.firstTabInLine,e.events.length=t.eventsLength}function Xa(e,t){Wn.throwAt(e.input.slice(0,e.length),e.position,t,e.filename)}function er(e){return 10===e||13===e}function tr(e){return 9===e||32===e}function ir(e){return tr(e)||er(e)}function sr(e){return 0===e||ir(e)}function or(e){return 44===e||91===e||93===e||123===e||125===e}function nr(e){return e>=48&&e<=57?e-48:-1}function ar(e){if(e>=48&&e<=57)return e-48;const t=32|e;return t>=97&&t<=102?t-97+10:-1}function rr(e){return 120===e?2:117===e?4:85===e?8:0}function lr(e){return 48===e||97===e||98===e||116===e||9===e||110===e||118===e||102===e||114===e||101===e||32===e||34===e||47===e||92===e||78===e||95===e||76===e||80===e}function dr(e){10===e.input.charCodeAt(e.position)?e.position++:(e.position++,10===e.input.charCodeAt(e.position)&&e.position++),e.line++,e.lineStart=e.position,e.lineIndent=0,e.firstTabInLine=-1}function cr(e,t){let i=0,s=e.input.charCodeAt(e.position),o=e.position===e.lineStart||ir(e.input.charCodeAt(e.position-1));for(;0!==s;){for(;tr(s);)o=!0,9===s&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),s=e.input.charCodeAt(++e.position);if(t&&o&&35===s)do{s=e.input.charCodeAt(++e.position)}while(!er(s)&&0!==s);if(!er(s))break;for(dr(e),i++,o=!0,s=e.input.charCodeAt(e.position);32===s;)e.lineIndent++,s=e.input.charCodeAt(++e.position)}return i}function hr(e,t=e.position){const i=e.input.charCodeAt(t);if((45===i||46===i)&&i===e.input.charCodeAt(t+1)&&i===e.input.charCodeAt(t+2)){const i=e.input.charCodeAt(t+3);return 0===i||ir(i)}return!1}function pr(e){e.position===e.lineStart&&65279===e.input.charCodeAt(e.position)&&(e.position++,e.lineStart=e.position)}function ur(e){if(e.position!==e.lineStart)return!1;if(hr(e))return!0;if(65279!==e.input.charCodeAt(e.position))return!1;const t=Ga(e);pr(e),cr(e,!0);const i=e.input.charCodeAt(e.position),s=e.position===e.lineStart&&(37===i||45===i&&hr(e));return Qa(e,t),s}function mr(e){let t=e.input.charCodeAt(e.position);for(;0!==t&&!er(t);)t=e.input.charCodeAt(++e.position)}function fr(e,t,i){const s=Ia.exec(e.input.slice(t,i));null!==s&&(e.position=t+s.index+s[0].length-1,Xa(e,"the stream contains non-printable characters"))}function gr(e,t,i){if(33!==e.input.charCodeAt(e.position))return!1;t.tagStart!==Na&&Xa(e,"duplication of a tag property");const s=e.position;let o=!1,n=!1,a="!",r=e.input.charCodeAt(++e.position);60===r?(o=!0,r=e.input.charCodeAt(++e.position)):33===r&&(n=!0,a="!!",r=e.input.charCodeAt(++e.position));let l,d=e.position;if(o){for(;0!==r&&62!==r;)r=e.input.charCodeAt(++e.position);62!==r&&Xa(e,"unexpected end of the stream within a verbatim tag"),l=e.input.slice(d,e.position),e.position++}else{for(;!(0===r||ir(r)||i&&or(r));)33===r&&(n?Xa(e,"tag suffix cannot contain exclamation marks"):(a=e.input.slice(d-1,e.position+1),Ma.test(a)||Xa(e,"named tag handle cannot contain such characters"),n=!0,d=e.position+1)),r=e.input.charCodeAt(++e.position);l=e.input.slice(d,e.position),Fa.test(l)&&Xa(e,"tag suffix cannot contain flow indicator characters")}return l&&!(o?Da.test(l):Ha.test(l))&&Xa(e,`tag name cannot contain such characters: ${l}`),o||"!"===a||"!!"===a||La.call(e.tagHandlers,a)||Xa(e,`undeclared tag handle "${a}"`),t.tagStart=s,t.tagEnd=e.position,!0}function vr(e,t){if(38!==e.input.charCodeAt(e.position))return!1;t.anchorStart!==Na&&Xa(e,"duplication of an anchor property"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!ir(e.input.charCodeAt(e.position))&&!or(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&Xa(e,"name of an anchor node must contain at least one character"),t.anchorStart=i,t.anchorEnd=e.position,!0}function _r(e,t){if(42!==e.input.charCodeAt(e.position))return!1;t.anchorStart===Na&&t.tagStart===Na||Xa(e,"alias node should not have any properties"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!ir(e.input.charCodeAt(e.position))&&!or(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&Xa(e,"name of an alias node must contain at least one character"),function(e,t,i){e.events.push({type:Yn,anchorStart:t,anchorEnd:i})}(e,i,e.position),!0}function yr(e,t){cr(e,!1),e.lineIndent<t&&Xa(e,"deficient indentation")}function br(e,t,i,s){if(!function(e,t){const i=e.input.charCodeAt(e.position),s=1===t;if(0===i||ir(i)||35===i||38===i||42===i||33===i||124===i||62===i||39===i||34===i||37===i||64===i||96===i||or(i))return!1;if(63===i||45===i){const t=e.input.charCodeAt(e.position+1);if(sr(t)||s&&or(t))return!1}return!0}(e,i))return!1;const o=e.position;let n=e.position,a=e.input.charCodeAt(e.position);const r=1===i;let l=!1;for(;0!==a&&!ur(e);){if(58===a){const t=e.input.charCodeAt(e.position+1);if(sr(t)||r&&or(t))break}else if(35===a){if(ir(e.input.charCodeAt(e.position-1)))break}else{if(r&&or(a))break;if(er(a)){const i=e.position,s=e.line,o=e.lineStart,n=e.lineIndent;if(cr(e,!1),e.lineIndent>=t){l=!0,a=e.input.charCodeAt(e.position);continue}e.position=i,e.line=s,e.lineStart=o,e.lineIndent=n;break}}tr(a)||(n=e.position+1),a=e.input.charCodeAt(++e.position)}return n!==o&&(fr(e,o,n),Ka(e,o,n,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,Gn,oa,-1,!l),!0)}function $r(e,t){const i=e.line;cr(e,!0),(e.line>i&&e.lineIndent<t||-1!==e.firstTabInLine&&e.lineIndent<t)&&Xa(e,"deficient indentation")}function wr(e,t,i){if(-1!==e.firstTabInLine||45!==e.input.charCodeAt(e.position)||!sr(e.input.charCodeAt(e.position+1)))return!1;for(Wa(e,e.position,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,ia);45===e.input.charCodeAt(e.position)&&sr(e.input.charCodeAt(e.position+1));){-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,Xa(e,"tab characters must not be used in indentation"));const i=e.line;e.position++;const s=cr(e,!0)>0;if(-1!==e.firstTabInLine&&45===e.input.charCodeAt(e.position)&&sr(e.input.charCodeAt(e.position+1))&&Xa(e,"bad indentation of a sequence entry"),s&&e.lineIndent<=t?Ya(e):kr(e,t,3,!1,!0),cr(e,!0),e.lineIndent<t||e.position>=e.length)break;e.lineIndent>t&&Xa(e,"bad indentation of a sequence entry"),e.line===i&&45===e.input.charCodeAt(e.position)&&sr(e.input.charCodeAt(e.position+1))&&Xa(e,"bad indentation of a sequence entry")}return Ja(e),!0}function xr(e,t,i,s){let o=!1,n=!1,a=!1,r=!1;if(-1!==e.firstTabInLine)return!1;let l=e.input.charCodeAt(e.position);for(;0!==l;){o||-1===e.firstTabInLine||(e.position=e.firstTabInLine,Xa(e,"tab characters must not be used in indentation"));const d=e.input.charCodeAt(e.position+1),c=e.line;if(63!==l&&58!==l||!sr(d)){o&&(Ya(e),o=!1);const t=Ga(e);if(!kr(e,i,2,!1,!0))break;if(e.line===c){for(l=e.input.charCodeAt(e.position);tr(l);)l=e.input.charCodeAt(++e.position);if(58===l)l=e.input.charCodeAt(++e.position),sr(l)||Xa(e,"a whitespace character is expected after the key-value separator within a block mapping"),a||(e.events.splice(t.eventsLength,0,{type:Kn,start:t.position,anchorStart:s.anchorStart,anchorEnd:s.anchorEnd,tagStart:s.tagStart,tagEnd:s.tagEnd,style:ia}),a=!0),n=!0,o=!1,r=!1;else{if(!n)return s.anchorStart===Na&&s.tagStart===Na||(Qa(e,t),!1);Xa(e,"expected ':' after a mapping key")}}else{if(!n)return s.anchorStart===Na&&s.tagStart===Na||(Qa(e,t),!1);Xa(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else a||(Ua(e,e.position,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,ia),a=!0),63===l?(o&&Ya(e),n=!0,o=!0):(o||(Ya(e),n=!0),o=!1),e.position+=1,r=!0;if(kr(e,t,4,!0,r)&&(r=!1),o||r&&(Ya(e),r=!1),cr(e,!0),l=e.input.charCodeAt(e.position),(e.line===c||e.lineIndent>t)&&0!==l)Xa(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return!!n&&(o&&Ya(e),a&&Ja(e),!0)}function kr(e,t,i,s,o,n=!0){e.depth>=e.maxDepth&&Xa(e,`nesting exceeded maxDepth (${e.maxDepth})`),e.depth++;let a=1,r=!1,l=!1,d=null;const c=Za();let h=4===i||3===i,p=h;const u=h;if(s&&cr(e,!0)&&(r=!0,a=e.lineIndent>t?1:e.lineIndent===t?0:-1),1===a)for(;;){const s=e.input.charCodeAt(e.position),o=Ga(e);if(r&&1!==a&&(33===s||38===s))break;if(r&&u&&(c.tagStart!==Na||c.anchorStart!==Na)&&(33===s||38===s)){const i=Ga(e),s=t+1;if(xr(e,e.position-e.lineStart,s,c)&&e.events[i.eventsLength]?.type===Kn)return e.depth--,!0;Qa(e,i)}if(r&&(33===s&&c.tagStart!==Na||38===s&&c.anchorStart!==Na))break;if(!gr(e,c,1===i)&&!vr(e,c))break;null===d&&(d=o),cr(e,!0)?(r=!0,p=u,a=e.lineIndent>t?1:e.lineIndent===t?0:-1):p=!1}if(p&&(p=r||o),1===a||4===i){const s=1===i||2===i?t:t+1,o=e.position-e.lineStart;if(1===a)if(p&&(wr(e,o,c)||xr(e,o,s,c))||function(e,t,i){const s=e.input.charCodeAt(e.position),o=123===s,n=e.position;let a=!0;if(91!==s&&123!==s)return!1;const r=o?125:93;for(o?Ua(e,n,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,sa):Wa(e,n,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,sa),e.position++;0!==e.input.charCodeAt(e.position);){$r(e,t);let i=e.input.charCodeAt(e.position);if(i===r)return e.position++,Ja(e),!0;a?44===i&&Xa(e,"expected the node content, but found ','"):Xa(e,"missed comma between flow collection entries");let s=!1,n=!1;63===i&&ir(e.input.charCodeAt(e.position+1))&&(s=n=!0,e.position+=1,$r(e,t));const l=e.line,d=Ga(e),c=kr(e,t,1,!1,!0);$r(e,t),i=e.input.charCodeAt(e.position),(o||n||e.line===l)&&58===i?(s=!0,e.position++,$r(e,t),o||Ba(e,d),c||Ya(e),kr(e,t,1,!1,!0)||Ya(e),$r(e,t),o||Ja(e)):o&&s?(c||Ya(e),Ya(e)):o?Ya(e):s&&(Ba(e,d),c||Ya(e),Ya(e),Ja(e)),i=e.input.charCodeAt(e.position),44===i?(a=!0,e.position++):a=!1}Xa(e,"unexpected end of the stream within a flow collection")}(e,s,c))l=!0;else{const t=e.input.charCodeAt(e.position);if(null!==d&&n&&u&&!p&&124!==t&&62!==t){const t=Ga(e),i=d.position-d.lineStart;Qa(e,d),xr(e,i,s,Za())&&e.events[t.eventsLength]?.type===Kn?l=!0:Qa(e,t)}!l&&(h&&function(e,t,i){const s=e.input.charCodeAt(e.position);let o=oa,n=-1,a=!1;if(124!==s&&62!==s)return!1;const r=124===s?ea:ta;for(e.position++;0!==e.input.charCodeAt(e.position);){const i=e.input.charCodeAt(e.position),s=nr(i);if(43===i||45===i)o!==oa&&Xa(e,"repeat of a chomping mode identifier"),o=43===i?aa:na,e.position++;else{if(!(s>=0))break;0===s&&Xa(e,"bad explicit indentation width of a block scalar; it cannot be less than one"),a&&Xa(e,"repeat of an indentation width identifier"),n=t+s-1,a=!0,e.position++}}let l=!1;for(;tr(e.input.charCodeAt(e.position));)l=!0,e.position++;l&&35===e.input.charCodeAt(e.position)&&mr(e),er(e.input.charCodeAt(e.position))?dr(e):0!==e.input.charCodeAt(e.position)&&Xa(e,"a line break is expected");let d=a?n:-1,c=0;const h=e.position;let p=e.position;for(;0!==e.input.charCodeAt(e.position);){const i=e.position;let s=0;for(;32===e.input.charCodeAt(i+s);)s++;const o=e.input.charCodeAt(i+s);if(0===o){d>=0?s>d&&(p=i+s):s>0&&(p=i+s);break}if(ur(e))break;if(!a&&-1===d&&er(o)&&(c=Math.max(c,s)),a||-1!==d||er(o)||(9===o&&s<t&&(e.position=i+s,Xa(e,"tab characters must not be used in indentation")),s>=t&&s<c&&(e.position=i+s,Xa(e,"bad indentation of a mapping entry"))),-1===d&&0!==o&&!er(o)&&s<t){e.lineIndent=s,e.position=i+s;break}a||0===o||er(o)||-1!==d||(d=s);const n=-1===d?t+1:d;if(0!==o&&!er(o)&&s<n){e.lineIndent=s,e.position=i+s;break}mr(e),p=e.position,er(e.input.charCodeAt(e.position))&&(dr(e),p=e.position)}return fr(e,h,p),Ka(e,h,p,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,r,o,d),!0}(e,s,c)||function(e,t,i){if(39!==e.input.charCodeAt(e.position))return!1;e.position++;const s=e.position;let o=!0;for(;0!==e.input.charCodeAt(e.position);){const n=e.input.charCodeAt(e.position);if(39===n){if(39===e.input.charCodeAt(e.position+1)){o=!1,e.position+=2;continue}const t=e.position;return e.position++,Ka(e,s,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Qn,oa,-1,o),!0}er(n)?(o=!1,yr(e,t)):e.position===e.lineStart&&hr(e)?Xa(e,"unexpected end of the document within a single quoted scalar"):9!==n&&n<32?Xa(e,"expected valid JSON character"):e.position++}Xa(e,"unexpected end of the stream within a single quoted scalar")}(e,s,c)||function(e,t,i){if(34!==e.input.charCodeAt(e.position))return!1;e.position++;const s=e.position;let o=!0;for(;0!==e.input.charCodeAt(e.position);){const n=e.input.charCodeAt(e.position);if(34===n){const t=e.position;return e.position++,Ka(e,s,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Xn,oa,-1,o),!0}if(92===n){o=!1;const i=e.input.charCodeAt(++e.position);if(er(i))yr(e,t);else if(lr(i))e.position++;else{let t=rr(i);for(0===t&&Xa(e,"unknown escape sequence");t-- >0;)e.position++,ar(e.input.charCodeAt(e.position))<0&&Xa(e,"expected hexadecimal character");e.position++}}else er(n)?(o=!1,yr(e,t)):e.position===e.lineStart&&hr(e)?Xa(e,"unexpected end of the document within a double quoted scalar"):9!==n&&n<32?Xa(e,"expected valid JSON character"):e.position++}Xa(e,"unexpected end of the stream within a double quoted scalar")}(e,s,c)||_r(e,c)||br(e,s,i,c))&&(l=!0)}else 0===a&&(l=p&&wr(e,o,c))}return h=h&&!l,l||c.anchorStart===Na&&c.tagStart===Na&&!h||(Ka(e,Na,Na,c.anchorStart,c.anchorEnd,c.tagStart,c.tagEnd,Gn),l=!0),e.depth--,l||c.anchorStart!==Na||c.tagStart!==Na}function jr(e){if(e.lineIndent>0||37!==e.input.charCodeAt(e.position))return!1;e.position++;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!ir(e.input.charCodeAt(e.position));)e.position++;const i=e.input.slice(t,e.position),s=[];for(0===i.length&&Xa(e,"directive name must not be less than one character in length");0!==e.input.charCodeAt(e.position)&&!er(e.input.charCodeAt(e.position));){for(;tr(e.input.charCodeAt(e.position));)e.position++;if(35===e.input.charCodeAt(e.position)||er(e.input.charCodeAt(e.position))||0===e.input.charCodeAt(e.position))break;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!ir(e.input.charCodeAt(e.position));)e.position++;s.push(e.input.slice(t,e.position))}if(er(e.input.charCodeAt(e.position))&&dr(e),"YAML"===i){e.directives.some(e=>"yaml"===e.kind)&&Xa(e,"duplication of %YAML directive"),1!==s.length&&Xa(e,"YAML directive accepts exactly one argument");const t=/^([0-9]+)\.([0-9]+)$/.exec(s[0]);null===t&&Xa(e,"ill-formed argument of the YAML directive"),1!==parseInt(t[1],10)&&Xa(e,"unacceptable YAML version of the document"),e.directives.push({kind:"yaml",version:s[0]})}else if("TAG"===i){2!==s.length&&Xa(e,"TAG directive accepts exactly two arguments");const[t,i]=s;Ma.test(t)||Xa(e,"ill-formed tag handle (first argument) of the TAG directive"),La.call(e.tagHandlers,t)&&Xa(e,`there is a previously declared suffix for "${t}" tag handle`),Ra.test(i)||Xa(e,"ill-formed tag prefix (second argument) of the TAG directive"),e.tagHandlers[t]=i,e.directives.push({kind:"tag",handle:t,prefix:i})}return!0}function Ar(e){e.directives=[],e.tagHandlers=Object.create(null);let t=!1;for(cr(e,!0);jr(e);)t=!0,cr(e,!0);let i=!1,s=!1,o=!0;if(0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)&&sr(e.input.charCodeAt(e.position+3))){i=!0;const t=e.line;e.position+=3,cr(e,!0),o=e.line>t}else t&&Xa(e,"directives end mark is expected");const n=e.events.length;if(!i&&e.position===e.lineStart&&46===e.input.charCodeAt(e.position)&&hr(e))return e.position+=3,void cr(e,!0);if(function(e,t,i){e.events.push({type:Un,explicitStart:t,explicitEnd:i,directives:e.directives})}(e,i,!1),kr(e,e.lineIndent-1,4,!1,o,o)||Ya(e),cr(e,!0),e.position===e.lineStart&&hr(e)&&(s=46===e.input.charCodeAt(e.position),s)){const t=e.line;e.position+=3,cr(e,!0),e.line===t&&e.position<e.length&&Xa(e,"end of the stream or a document separator is expected")}const a=e.events[n];a?.type===Un&&(a.explicitEnd=s),Ja(e),!s&&e.position<e.length&&!ur(e)&&Xa(e,"end of the stream or a document separator is expected")}var Sr={...za,...$a};function Or(e,t={}){const i={...Sr,...t},s=String(e),o=Object.keys(za),n=Object.keys($a);return function(e,t){const i={...$a,...t,events:e,documents:[],eventIndex:0,position:0,frames:[],anchors:new Map,nodeTags:new Map,tagHandlers:Object.create(null),totalMergeKeys:0,aliasCount:0};for(;i.eventIndex<i.events.length;){const e=i.events[i.eventIndex++];switch(i.position=wa(e),e.type){case Un:i.anchors=new Map,i.nodeTags=new Map,i.aliasCount=0,i.tagHandlers=Object.create(null);for(const t of e.directives)"tag"===t.kind&&(i.tagHandlers[t.handle]=t.prefix);i.frames.push({kind:"document",position:i.position,value:void 0,hasValue:!1});break;case Jn:{const{value:t,tag:s}=ja(i,e);Pa(i,e,t,s,!0),Ta(i,t,s);break}case Bn:{const t=Aa(i,e,"tag:yaml.org,2002:seq"),s=i.schema.lookupSequenceTag(t);s||xa(i,`unknown sequence tag !<${t}>`);const o=s.create(t),n=Pa(i,e,o,s,s.carrierIsResult);i.frames.push({kind:"sequence",position:i.position,value:o,tag:s,anchor:n,index:0});break}case Kn:{const t=Aa(i,e,"tag:yaml.org,2002:map"),s=i.schema.lookupMappingTag(t);s||xa(i,`unknown mapping tag !<${t}>`);const o=s.create(t),n=Pa(i,e,o,s,s.carrierIsResult);i.frames.push({kind:"mapping",position:i.position,value:o,tag:s,anchor:n,key:void 0,keyPosition:i.position,hasKey:!1,keyIsMerge:!1,overridable:null});break}case Yn:{-1!==i.maxAliases&&++i.aliasCount>i.maxAliases&&xa(i,`aliases exceeded maxAliases (${i.maxAliases})`);const t=i.source.slice(e.anchorStart,e.anchorEnd),s=i.anchors.get(t);s||xa(i,`unidentified alias "${t}"`),s.isValueFinal||xa(i,`recursive alias "${t}" is not supported for tag ${s.tag.tagName} because it uses finalize()`),Ta(i,s.value,s.tag);break}case Zn:{const e=i.frames.pop();if("mapping"===e.kind&&e.hasKey&&(i.position=e.keyPosition,xa(i,"incomplete mapping pair in event stream")),"document"===e.kind)i.documents.push(e.value);else{const t=e.tag.carrierIsResult?e.value:ka(i,e.position,e.tag,e.value);e.anchor&&(e.anchor.value=t,e.anchor.isValueFinal=!0),Ta(i,t,e.tag)}break}}}return i.documents}(function(e,t){const i=e.length,s={...za,...t,input:`${e}\0`,length:i,position:0,line:0,lineStart:0,lineIndent:0,firstTabInLine:-1,depth:0,directives:[],tagHandlers:Object.create(null),events:[]},o=e.indexOf("\0");for(-1!==o&&Wn.throwAt(e,o,"null byte is not allowed in input",s.filename);s.position<s.length&&(pr(s),cr(s,!0),!(s.position>=s.length));){const e=s.position;Ar(s),s.position===e&&Xa(s,"can not read a document")}return s.events}(s,Tn(i,o)),{...Tn(i,n),source:s})}function Cr(e,t){return!!(e&1<<t)}var Er={applyQuoteFlowKeysOption:function(e){if(!e.presenterOptions.quoteFlowKeys)return;if(!e.isKey||!e.flowOnly||e.style!==Gn)return;e.style=Xn},doubleQuoteForInvisibles:function(e){e.style===Gn&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(e.node.value)&&(e.style=Xn)},doubleQuoteWhitespaceOnly:function(e){e.style===Gn&&/^\s+$/.test(e.node.value)&&(e.style=Xn)},applyForceQuotesOption:function(e){if(!e.presenterOptions.forceQuotes)return;if(e.isKey||e.style!==Gn)return;if(e.node.tag!==e.presenterOptions.schema.defaultScalarTag.tagName)return;e.style=e.node.value.includes("\n")?Xn:Tr(e)},tryLongOrMultilineAsBlock:function(e){if(e.style!==Gn||e.isKey)return;const t=e.node.value,i=-1!==t.indexOf("\n");if(!Cr(e.allowedStylesMask,ea))return void(i&&(e.style=Xn));const s=e.presenterOptions.lineWidth;if(-1===s)return void(i&&(e.style=ea));const o=Math.max(Math.min(s,40),s-e.shiftOfContent);let n=0,a=!1;for(;n<=t.length;){let e=t.length;const i=t.indexOf("\n",n);-1!==i&&(e=i);const s=t.slice(n,e);if(s.length>o&&" "!==s[0]&&/ [^ \t]/.test(s)&&(a=!0),-1===i)break;n=i+1}a?e.style=ta:i&&(e.style=ea)},quoteInvalidPlain:function(e){e.style!==Gn||Cr(e.allowedStylesMask,Gn)||(e.style=Tr(e))},fallbackToDoubleQuoted:function(e){Cr(e.allowedStylesMask,e.style)||(e.style=Xn)}};function Tr(e){return"single"===e.presenterOptions.quoteStyle&&Cr(e.allowedStylesMask,Qn)?Qn:Xn}Object.keys(Er).map(e=>Reflect.get(Er,e));const Pr="tempus2016/decluttering-card-plus",Nr="share-your-templates",Lr=`https://github.com/${Pr}/discussions/new?category=${Nr}`,Ir="decluttering-card-plus-community";function Fr(e){let t=2e4;const i=e=>(t-=1+Math.ceil(e/16))>=0,s=e=>"string"==typeof e?i(e.length):!!i(0)&&(Array.isArray(e)?e.every(s):!e||"object"!=typeof e||Object.entries(e).every(([e,t])=>i(e.length)&&s(t)));return s(e)}const Mr=e=>!!e&&"object"==typeof e&&!Array.isArray(e);function Vr(e){if(Fr(e))return JSON.parse(JSON.stringify(e),(e,t)=>"__proto__"===e?void 0:t)}const qr=/[\p{Cf}\u2800\u3164\u115F\u1160\uFFA0]/gu;function Dr(e){if("string"!=typeof e)return;const t=e.replace(qr,"").replace(/\s+/g," ").trim();return t?t.length>80?`${t.slice(0,79)}…`:t:void 0}const Hr=["card","badge","row","element","group"];function Rr(e){if(!Mr(e))return{};const t={};for(const[i,s]of Object.entries(e))Mr(s)&&Hr.some(e=>void 0!==s[e])&&(t[i]=s);return t}function zr(e,t){return"string"==typeof t&&/^https:\/\/github\.com\//.test(t)?t:`https://github.com/${Pr}/discussions/${e}`}function Wr(e){var t,i,s,o,n;const a=function(e){if("string"!=typeof e||e.length>65536)return;const t=/^ {0,3}(`{3,}|~{3,})[ \t]*([\w-]*)/,i=[];let s;for(const a of function(e){return e.replace(/<!--[\s\S]*?(?:-->|$)/g,"")}(e).split("\n")){if(s){a.trim()===s.fence?(i.push({lang:s.lang,text:s.lines.join("\n")+"\n"}),s=void 0):s.lines.push(a);continue}const e=t.exec(a);e&&(s={fence:e[1],lang:e[2],lines:[]})}const o=i.find(e=>/^ya?ml$/i.test(e.lang)),n=null!=o?o:i.find(e=>""===e.lang);return null==n?void 0:n.text}(null==e?void 0:e.body);if(!a)return;let r;try{if(r=Vr(function(e,t){const i=Or(e,t);if(0===i.length)throw new Wn("expected a document, but the input is empty");if(1===i.length)return i[0];throw new Wn("expected a single document in the stream, but found more")}(a,{maxAliases:50})),void 0===r)return}catch(h){return}if(!Xs(r).ok)return;if("number"!=typeof(null==e?void 0:e.number))return;const{template:l,includes:d}=r,c=Xe(r,["template","includes"]);return delete c.type,"string"!=typeof c.description&&delete c.description,{id:e.number,title:null!==(t=Dr(e.title))&&void 0!==t?t:l,author:"string"==typeof(null===(i=e.user)||void 0===i?void 0:i.login)?e.user.login:"",url:zr(e.number,e.html_url),name:l.trim(),template:c,includes:Rr(d),reactions:"number"==typeof(null===(s=e.reactions)||void 0===s?void 0:s.total_count)?e.reactions.total_count:0,updated:"string"==typeof(null!==(o=e.updated_at)&&void 0!==o?o:e.created_at)?null!==(n=e.updated_at)&&void 0!==n?n:e.created_at:""}}const Ur=["lock","alarm_control_panel","cover","valve","siren","script","automation","button","input_button","water_heater","lawn_mower","update"],Br=["more-info","navigate","none","assist"],Kr=["action","perform_action","service","type"],Jr=/\b[a-z][a-z0-9+.-]{1,31}:(?:\/\/)?[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?|\/\/[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?/gi,Yr=[/(?:url|image-set|src)\(\s*['"]?([^'")\s{}]+)/gi,/@import\s+(?:url\(\s*)?['"]?([^'")\s;{}]+)/gi],Zr=/^(?:\/(?!\/)|#|data:)/i,Gr=["image","url","url_path","entity_picture","camera_image","image_url","icon_url","src"],Qr=/\[\[\[|\{\{|\{%|\$\{/,Xr=/^\s*(?:javascript|data|vbscript):/i,el=/position\s*:\s*(?:fixed|absolute)/i,tl=/opacity\s*:\s*0(?:[^.\d]|$)|visibility\s*:\s*hidden|transparent/i,il=e=>"string"==typeof e&&Ur.includes(e.split(".")[0]),sl=e=>e.replace(/\\/g,"/"),ol="*";function nl(e,t){const i=[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);if(i.length)return i.includes(ol)?[ol]:i;const s=[].concat(null!=t?t:[]).filter(e=>"string"==typeof e);if(!s.length)return[ol];const o=s.map(e=>{const t=e.indexOf("."),i=-1===t?e:e.slice(0,t);return/^[a-z_]+$/.test(i)?i:ol});return o.includes(ol)?[ol]:[...new Set(o)]}function al(e,t,i=new Set){var s,o,n,a;if(Array.isArray(e))return e.forEach(e=>al(e,t,i)),i;if(!Mr(e))return i;const r="string"==typeof e.entity?e.entity:t,l=e.action;if("string"==typeof l&&!Br.includes(l)&&!l.includes("[[")&&"perform-action"!==l&&"call-service"!==l&&"fire-dom-event"!==l&&"url"!==l){const t=[].concat(null!==(a=null!==(n=null!==(o=null===(s=e.target)||void 0===s?void 0:s.entity_id)&&void 0!==o?o:e.entity_id)&&void 0!==n?n:r)&&void 0!==a?a:[]);t.length&&!t.some(e=>"string"!=typeof e||e.includes("[["))||i.add(l)}return Object.values(e).forEach(e=>al(e,r,i)),i}function rl(e,t){const i=Hr.find(t=>void 0!==e[t]);if(i)try{return d(t,e,e[i],void 0,void 0,!0)}catch(s){return}}function ll(e){const t=new Set,i=new Set;let s=!1,o=!1,n=!1,a=!1;const r=e=>{const t=sl(e).trim();!t||Zr.test(t)||t.startsWith("[[")||t.startsWith("{{")||/^[\w.-]+\.[a-z]{2,}(?:[:/?#]|$)/i.test(t)&&i.add(t)},l=new Set,d=(e,i)=>{for(const s of e)if(i.includes(ol))t.add(`${s} *`);else for(const e of i)Ur.includes(e)&&t.add(`${s} ${e}.*`)},c=(h,p)=>{var u;if("string"==typeof h)return void(e=>{var t;const s=sl(e);for(const o of null!==(t=s.match(Jr))&&void 0!==t?t:[])i.add(o);for(const o of Yr){o.lastIndex=0;let e=o.exec(s);for(;e;)Zr.test(e[1])||i.add(e[1]),e=o.exec(s)}Qr.test(e)&&(o=!0),el.test(e)&&tl.test(e)&&(a=!0)})(h);if(Array.isArray(h))return void h.forEach(e=>c(e,p));if(!Mr(h))return;const m="string"==typeof h.entity?h.entity:p;Object.keys(h).some(e=>e.includes("[["))&&(n=!0),Kr.some(e=>"string"==typeof h[e]&&h[e].includes("[["))&&(n=!0),"string"==typeof h.action&&((e,s)=>{var n,a,r,l,d,c;const h=e.action;if("perform-action"===h||"call-service"===h){const i=null!==(n=e.perform_action)&&void 0!==n?n:e.service;return void("string"!=typeof i?t.add("?"):i.includes("[[")||t.add(i))}if("fire-dom-event"===h)return void t.add("fire-dom-event");if("url"===h)return i.add("string"==typeof e.url_path?e.url_path:"?"),void("string"==typeof e.url_path&&Xr.test(e.url_path)&&(o=!0));if(Br.includes(h)||h.includes("[["))return;const p=[].concat(null!==(c=null!==(d=null!==(l=null!==(r=null===(a=e.target)||void 0===a?void 0:a.entity_id)&&void 0!==r?r:e.entity_id)&&void 0!==l?l:e.entity)&&void 0!==d?d:s)&&void 0!==c?c:[]);for(const i of p)il(i)&&t.add(`${h} ${i}`)})(h,m),"iframe"!==h.type&&"webpage"!==h.type||(s=!0);for(const e of Gr)"string"==typeof h[e]&&r(h[e]);if("string"==typeof h.type&&Ve.includes(h.type)){const t=(t=>{if("string"==typeof t)return t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0})(h.template);if(t){if(b(h.for_each_from)){const e=h.for_each_from,i=Hr.map(e=>t[e]).find(e=>void 0!==e);d(al(i,void 0),nl(e.domain,e.entities))}const e=(f=h.variables,Array.isArray(f)?f.filter(Mr):Mr(f)?Object.entries(f).map(([e,t])=>({[e]:t})):void 0);(null==e?void 0:e.length)&&!l.has(h.template)&&(l.add(h.template),c(rl(t,e),void 0),l.delete(h.template))}}var f;if("custom:auto-entities"===h.type&&Mr(h.filter))for(const e of[].concat(null!==(u=h.filter.include)&&void 0!==u?u:[])){if(!Mr(e))continue;const t=nl(e.domain,e.entity_id);d(al(e.options,void 0),t),d(al(h.card,void 0),t)}Object.values(h).forEach(e=>c(e,m))},h=[e.template,...Object.values(e.includes)].map(Ss);c(h,void 0);for(const p of h)c(rl(p),void 0);return{actions:[...t].sort(),urls:[...i].sort(),embeds:s,scripts:o,placeholders:n,overlay:a}}function dl(e){return e.filter(e=>{var t;return(null===(t=null==e?void 0:e.category)||void 0===t?void 0:t.slug)===Nr}).map(Wr).filter(e=>!!e).sort((e,t)=>t.reactions-e.reactions||t.updated.localeCompare(e.updated))}class cl extends Error{}function hl(e){var t;if(!Mr(e)||"number"!=typeof e.id||"string"!=typeof e.name)return;if(!Mr(e.template))return;const i=Vr({template:e.template,includes:e.includes});if(!i||!Mr(i.template))return;if(!Xs(Object.assign({template:e.name},i.template)).ok)return;const s=Object.assign({},i.template);return delete s.type,"string"!=typeof s.description&&delete s.description,{id:e.id,title:null!==(t=Dr(e.title))&&void 0!==t?t:e.name,author:"string"==typeof e.author?e.author:"",url:zr(e.id,e.url),name:e.name,template:s,includes:Rr(i.includes),reactions:"number"==typeof e.reactions?e.reactions:0,updated:"string"==typeof e.updated?e.updated:""}}async function pl(e={}){var t,i,s,o;const n=null!==(t=e.fetcher)&&void 0!==t?t:fetch.bind(globalThis),a=null!==(i=e.storage)&&void 0!==i?i:"undefined"==typeof localStorage?void 0:localStorage,r=null!==(s=e.now)&&void 0!==s?s:Date.now(),l=function(e){var t;try{const i=JSON.parse(null!==(t=null==e?void 0:e.getItem(Ir))&&void 0!==t?t:"null");if(!i||!Array.isArray(i.entries)||"number"!=typeof i.fetched)return;return{entries:i.entries.map(hl).filter(e=>!!e),fetched:i.fetched}}catch(i){return}}(a);if(l&&!e.refresh&&r-l.fetched<216e5)return l;const d=[];try{for(let e=1;e<=10;e+=1){const t=await n(`https://api.github.com/repos/${Pr}/discussions?per_page=100&page=${e}`,{headers:{Accept:"application/vnd.github+json"}});if(!t.ok){const e=new cl(`GitHub answered ${t.status}`);throw"0"===t.headers.get("x-ratelimit-remaining")&&(e.retryAt=1e3*Number(t.headers.get("x-ratelimit-reset"))||void 0),e}const i=await t.json();if(!Array.isArray(i))break;if(d.push(...i),i.length<100)break}}catch(h){const e=h instanceof cl?h:new cl(null!==(o=null==h?void 0:h.message)&&void 0!==o?o:String(h));throw e.cached=l,e}const c={entries:dl(d),fetched:r};try{null==a||a.setItem(Ir,JSON.stringify(c))}catch(p){}return c}function ul(e,t){return{discussion:e.id,updated:e.updated,name:t,author:e.author}}function ml(e,t){return Object.assign(Object.assign({},e),{source:t})}function fl(e,t){return e.map(({name:e,source:i})=>{var s;const o=t.entries.find(e=>e.id===i.discussion),n="string"==typeof i.name?i.name:void 0,a=o?function(e,t){return void 0===t||t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0}(o,n):void 0;if(!o||!a)return Object.assign({name:e,status:"gone"},o?{entry:o}:{});if("string"!=typeof i.author||!i.author||i.author!==o.author)return{name:e,status:"unverified",entry:o};const r=Date.parse(null!==(s=i.updated)&&void 0!==s?s:""),l=Date.parse(o.updated);return{name:e,status:(Number.isFinite(r)?Number.isFinite(l)&&l>r:Number.isFinite(l))?"update":"current",entry:o,latest:ml(a,ul(o,null!=n?n:o.name))}})}function gl(e){if(""===e)return[];const t=e.split("\n");return""===t[t.length-1]&&t.pop(),t}function vl(e,t){const i=e=>({kind:"remove",text:e}),s=e=>({kind:"add",text:e});if(!e.length||!t.length||e.length*t.length>4e6)return[...e.map(i),...t.map(s)];const o=e.length,n=t.length,a=Array.from({length:o+1},()=>new Uint32Array(n+1));for(let c=o-1;c>=0;c-=1)for(let i=n-1;i>=0;i-=1)a[c][i]=e[c]===t[i]?a[c+1][i+1]+1:Math.max(a[c+1][i],a[c][i+1]);const r=[];let l=0,d=0;for(;l<o&&d<n;)e[l]===t[d]?(r.push({kind:"same",text:e[l]}),l+=1,d+=1):a[l+1][d]>=a[l][d+1]?(r.push(i(e[l])),l+=1):(r.push(s(t[d])),d+=1);for(;l<o;)r.push(i(e[l++]));for(;d<n;)r.push(s(t[d++]));return r}const _l=e`<style>
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
</style>`;function yl(e){return"string"==typeof e?e:void 0===e?"":ee(e)}const bl={same:" ",add:"+",remove:"-"};function $l(t,i,s,n=3){const a=function(e,t){const i=gl(e),s=gl(t);let o=0;for(;o<i.length&&o<s.length&&i[o]===s[o];)o+=1;let n=i.length,a=s.length;for(;n>o&&a>o&&i[n-1]===s[a-1];)n-=1,a-=1;const r=i.slice(0,o).map(e=>({kind:"same",text:e})),l=i.slice(n).map(e=>({kind:"same",text:e}));return[...r,...vl(i.slice(o,n),s.slice(o,a)),...l]}(yl(t),yl(i));return function(e){return e.some(e=>"same"!==e.kind)}(a)?e`${_l}
    <div class="dcp-diff" role="figure" aria-label=${o("diff.label",void 0,s)}>
      ${function(e,t=3){const i=e.map(e=>"same"!==e.kind),s=new Array(e.length).fill(!1);e.forEach((i,o)=>{if("same"!==i.kind)for(let n=Math.max(0,o-t);n<=Math.min(e.length-1,o+t);n+=1)s[n]=!0});const o=[];let n=0;for(;n<e.length;){if(i[n]||s[n]){o.push(e[n]),n+=1;continue}let t=n;for(;t<e.length&&!i[t]&&!s[t];)t+=1;const a=t-n;1===a?o.push(e[n]):o.push({kind:"skip",count:a}),n=t}return o}(a,n).map(t=>function(t,i){return"skip"===t.kind?e`<div class="skip">${o("diff.skipped",{count:t.count},i)}</div>`:e`<div class=${t.kind}>${bl[t.kind]} ${t.text}</div>`}(t,s))}
    </div>`:e`${_l}
      <p class="dcp-diff-none">${o("diff.no_change",void 0,s)}</p>`}function wl(t,i,s){var n,a;const r=null!==(n=JSON.stringify(t))&&void 0!==n?n:"",l=null!==(a=JSON.stringify(i))&&void 0!==a?a:"";return e`
    ${$l(t,i,s)}
    <ha-expansion-panel outlined>
      <span slot="header">${o("diff.full",void 0,s)}</span>
      <p class="dcp-diff-none">${o("diff.before",void 0,s)}</p>
      ${Lo(r,e`<ha-yaml-editor .hass=${s} .defaultValue=${t} read-only></ha-yaml-editor>`)}
      <p class="dcp-diff-none">${o("diff.after",void 0,s)}</p>
      ${Lo(l,e`<ha-yaml-editor .hass=${s} .defaultValue=${i} read-only></ha-yaml-editor>`)}
    </ha-expansion-panel>
  `}const xl=["readme","related","setup","requires_entities","requires_homeassistant","requires_card"];class kl extends m{constructor(){super(...arguments),this._importParses=!0,this._importErrors=[],this._importArmedAt=0,this._copyState="",this._busy=!1,this._libraryDestination="view",this._communityLoading=!1,this._communityKnownFailed=!1,this._installArmedAt=0,this._postCopyState="",this._setupValues={},this._updatesLoading=!1,this._updateArmedAt=0,this._trashArmedAt=0}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=w())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:T()}static get styles(){return wo}_fireConfigChanged(e){g(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return rs(this,e,t,i)}render(){return this.hass&&this._config?this._renderShare():e``}async _loadTrash(){this.hass&&(this._trash=await et(this.hass))}_renderShare(){const{payload:t,notes:i}=Ys(this._config,P(this._savedLovelace));return e`
      <div class="share">
        ${this._renderDetails()}
        <h3>${o("share.export_header",void 0,this.hass)}</h3>
        <p class="hint">${o("share.export_hint",void 0,this.hass)}</p>
        ${i.map(t=>e`<ha-alert alert-type="info">${t}</ha-alert>`)}
        <ha-yaml-editor id="export" .hass=${this.hass} .defaultValue=${t} read-only></ha-yaml-editor>
        <ha-button @click=${this._copyExport}>
          ${"done"===this._copyState?o("share.copied",void 0,this.hass):"failed"===this._copyState?o("share.copy_failed",void 0,this.hass):o("share.copy",void 0,this.hass)}
        </ha-button>
        <ha-button @click=${this._downloadExport}> ${o("share.download",void 0,this.hass)} </ha-button>
        <ha-button @click=${this._copyPost}>
          ${"done"===this._postCopyState?o("share.copied",void 0,this.hass):"failed"===this._postCopyState?o("share.copy_failed",void 0,this.hass):o("share.post_copy",void 0,this.hass)}
        </ha-button>
        <p class="hint">
          ${o("share.post_hint",void 0,this.hass)}
          <a href=${Lr} target="_blank" rel="noopener noreferrer"
            >${o("share.post_open",void 0,this.hass)}</a
          >
        </p>

        <h3>${o("share.import_header",void 0,this.hass)}</h3>
        <p class="hint">${o("share.import_hint",void 0,this.hass)}</p>
        <ha-yaml-editor id="import" .hass=${this.hass} @value-changed=${this._importChanged}></ha-yaml-editor>
        <input
          id="import-file"
          type="file"
          accept=".yaml,.yml,.json,text/yaml,application/json"
          hidden
          @change=${this._importFile}
        />
        <ha-button @click=${()=>{var e;return null===(e=this.renderRoot.querySelector("#import-file"))||void 0===e?void 0:e.click()}}>
          ${o("share.import_file",void 0,this.hass)}
        </ha-button>
        ${this._importErrors.map(t=>e`<ha-alert alert-type="error">${t}</ha-alert>`)}
        ${this._renderImportDetails()}
        ${this._importClash?e`<ha-alert alert-type="warning">
                ${o("share.import_clash",{name:this._importClash},this.hass)}
              </ha-alert>`:e``}
        ${this._importRisks?this._renderRisks(this._importRisks,"share.import_risks"):e``}
        <ha-button @click=${this._import}>
          ${o(this._importClash||this._importRisks?"share.import_anyway":"share.import",void 0,this.hass)}
        </ha-button>
        ${this._importClash?e`<ha-button @click=${this._importAsCopy}>
                ${o("share.import_copy",void 0,this.hass)}
              </ha-button>`:e``}
        ${this._renderTrash()}

        <h3>${o("share.library_header",void 0,this.hass)}</h3>
        <p class="hint">${o("share.library_hint",void 0,this.hass)}</p>
        ${this._renderLibrary()}

        <h3>${o("share.community_header",void 0,this.hass)}</h3>
        <p class="hint">${o("share.community_hint",void 0,this.hass)}</p>
        ${this._renderCommunity()} ${this._renderInstalled()}
        ${this._toolError?e`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:e``}
      </div>
    `}_renderDetails(){var t,i,s,n;const a=this._config,r=function(e){const t=e&&"object"==typeof e?e:{},i=t.author&&"object"==typeof t.author&&!Array.isArray(t.author)?t.author:void 0,s=t.requires&&"object"==typeof t.requires&&!Array.isArray(t.requires)?t.requires:{},o={author_name:Fs(i?i.name:t.author),author_github:Fs(null==i?void 0:i.github),author_email:Fs(null==i?void 0:i.email),author_url:Fs(null==i?void 0:i.url),license:Fs(t.license),help:Fs(t.help),homepage:Fs(t.homepage),readme:Fs(t.readme),related:Ms(t.related),setup:Ms(t.setup),requires_integrations:Ms(s.integrations),requires_entities:Ms(s.entities),requires_custom_cards:Ms(s.custom_cards),requires_homeassistant:Fs(s.homeassistant),requires_card:Fs(s.card)};for(const n of Object.keys(o))void 0===o[n]&&delete o[n];return o}(a),l=e=>[...new Set(e)].sort().map(e=>({value:e,label:e})),d=e=>({select:{multiple:!0,custom_value:!0,options:l(e)}}),c=Object.keys(P(this._savedLovelace)).filter(e=>e!==a.template),h=[...L(a).map(e=>e.name),...null!==(t=r.setup)&&void 0!==t?t:[]],p=(Array.isArray(null===(s=null===(i=this.hass)||void 0===i?void 0:i.config)||void 0===s?void 0:s.components)?this.hass.config.components:[]).filter(e=>!e.includes(".")),u=(null!==(n=window.customCards)&&void 0!==n?n:[]).map(e=>e.type).filter(e=>"string"==typeof e),m=(e,t)=>({name:e,selector:t}),f=[m("author_name",{text:{}}),m("author_github",{text:{}}),m("author_email",{text:{}}),m("author_url",{text:{type:"url"}}),m("license",{text:{}}),m("help",{text:{type:"url"}}),m("homepage",{text:{type:"url"}}),m("readme",{text:{multiline:!0}}),m("related",d(c)),m("setup",d(h)),m("requires_integrations",d(p)),m("requires_entities",d([])),m("requires_custom_cards",d(u)),m("requires_homeassistant",{text:{}}),m("requires_card",{text:{}})];return e`
      <ha-expansion-panel outlined class="details">
        <span slot="header">${o("share.details_header",void 0,this.hass)}</span>
        <p class="hint">${o("share.details_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${r}
          .schema=${f}
          .computeLabel=${e=>o(`share.details_${e.name}`,void 0,this.hass)}
          .computeHelper=${e=>xl.includes(e.name)?o(`share.details_${e.name}_helper`,void 0,this.hass):""}
          @value-changed=${this._detailsChanged}
        ></ha-form>
      </ha-expansion-panel>
    `}_detailsChanged(e){if(e.stopPropagation(),!this._config)return;const t=function(e,t){var i;const s=Object.assign({},e),o=(e,t)=>{void 0===t||Array.isArray(t)&&!t.length?delete s[e]:s[e]=t},n={},a=Vs(t.author_name);a&&(n.name=a);for(const c of["github","email","url"]){const e=Vs(t[`author_${c}`]);e&&(n[c]=e)}const r=e.author&&"object"==typeof e.author&&!Array.isArray(e.author)?e.author:{};for(const[c,h]of Object.entries(r))["name","github","email","url"].includes(c)||(n[c]=h);const l=Object.keys(n);o("author",l.length?1===l.length&&a?a:n:void 0);for(const c of["license","help","homepage"])o(c,Vs(t[c]));o("readme","string"==typeof t.readme&&t.readme.trim()?t.readme:void 0),o("related",qs(t.related)),o("setup",qs(t.setup));const d=e.requires&&"object"==typeof e.requires&&!Array.isArray(e.requires)?Object.assign({},e.requires):{};for(const[c,h]of Object.entries(Is)){const e=[].concat(null!==(i=d[c])&&void 0!==i?i:[]).filter(e=>"string"!=typeof e),s=[...qs(t[h]),...e];s.length?d[c]=s:delete d[c]}for(const c of["homeassistant","card"]){const e=Vs(t[`requires_${c}`]);e?d[c]=e:delete d[c]}return o("requires",Object.keys(d).length?d:void 0),s}(this._config,e.detail.value);this._fireConfigChanged(t)}_renderCommunity(){const t=this._community,i=e`
      ${this._communityError?e`<ha-alert alert-type="warning">${this._communityError}</ha-alert>`:e``}
      ${this._communityError&&t?e`<p class="hint">
              ${o("share.community_showing_cached",{time:(e=>{var t,i;return new Date(e).toLocaleString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)})(t.fetched)},this.hass)}
            </p>`:e``}
    `;if(!t)return e`
        <div class="library">
          ${i}
          <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!1)}}>
            ${o(this._communityLoading?"share.community_loading":"share.community_load",void 0,this.hass)}
          </ha-button>
        </div>
      `;const s=this._communityExisting(),n=t.entries.find(e=>e.id===this._communitySelected),a=n?`community:${n.id}:${n.updated}`:"",r=!!n&&this._installPending===a,l=n&&s.includes(n.name)?Qs(n.name,s):void 0,d=n?function(e,t){const i=new Set,s=new Set;for(const o of[e.template,...Object.values(e.includes)]){const e=Ws(o);e.customTypes.forEach(e=>i.add(e)),e.templateRefs.forEach(e=>s.add(e))}return{customTypes:[...i].sort(),templates:[...s].filter(i=>i!==e.name&&!(i in e.includes)&&!t.includes(i)).sort()}}(n,s):void 0,c=n?Object.keys(n.includes).filter(e=>!s.includes(e)):[],h=n?ll(n):void 0,p=void 0!==this._communityKnown;return e`
      <div class="library">
        ${i}
        ${t.entries.length?e`<ha-form
                .hass=${this.hass}
                .data=${{entry:n?String(n.id):""}}
                .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:t.entries.map(e=>({value:String(e.id),label:o("share.community_by",{title:e.title,author:e.author},this.hass)}))}}}]}
                .computeLabel=${()=>o("share.community_pick",void 0,this.hass)}
                @value-changed=${this._communityPicked}
              ></ha-form>`:e`<p class="hint">${o("share.community_none",void 0,this.hass)}</p>`}
        ${n&&d?e`
                <p class="hint">
                  ${"string"==typeof n.template.description?n.template.description:""}
                  <a href=${n.url} target="_blank" rel="noopener noreferrer"
                    >${o("share.community_open",void 0,this.hass)}</a
                  >
                </p>
                ${this._renderAbout(n.template)}
                ${c.length?e`<p class="hint">
                        ${o("share.library_needs",{names:c.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderUnmet([n.template,...Object.values(n.includes)])}
                ${this._renderMissingCards([n.template,...Object.values(n.includes)])}
                ${d.templates.length?e`<ha-alert alert-type="warning">
                        ${o("share.community_needs_templates",{names:d.templates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
                ${h&&ss(h)?this._renderRisks(h,"share.community_risks"):e``}
                ${this._renderSetup([n.template,...Object.values(n.includes)])}
                <ha-expansion-panel outlined expanded>
                  <span slot="header">${o("share.library_preview",void 0,this.hass)}</span>
                  ${Lo(`${n.id}:${n.updated}`,e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${Object.assign(Object.assign({template:n.name},n.template),Object.keys(n.includes).length?{includes:n.includes}:{})}
                      read-only
                    ></ha-yaml-editor>`)}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{where:this._libraryDestination}}
                  .schema=${[{name:"where",selector:{select:{mode:"dropdown",options:[{value:"view",label:o("share.library_where_view",void 0,this.hass)},{value:"root",label:o("share.library_where_root",void 0,this.hass)}]}}}]}
                  .computeLabel=${()=>o("share.library_where",void 0,this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                ${this._communityKnownFailed?e`<ha-alert alert-type="error">
                        ${o("share.community_names_failed",void 0,this.hass)}
                      </ha-alert>`:e``}
                <ha-button .disabled=${this._busy||!p} @click=${()=>{this._installShared(n)}}>
                  ${p||this._communityKnownFailed?r?o("share.install_anyway",void 0,this.hass):l?o("share.community_install_as",{name:l},this.hass):o("share.install",void 0,this.hass):o("share.community_names_loading",void 0,this.hass)}
                </ha-button>
              `:e``}
        <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!0)}}>
          ${o(this._communityLoading?"share.community_loading":"share.community_refresh",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderAbout(t){var i,s,n;const a=js(t),r=(l=a.author)?[l.name,l.github?`@${l.github}`:void 0,l.email].filter(Boolean).join(" · "):"";var l;const d=null!==(s=null===(i=a.author)||void 0===i?void 0:i.url)&&void 0!==s?s:(null===(n=a.author)||void 0===n?void 0:n.github)?`https://github.com/${a.author.github}`:void 0,c=[a.help?{url:a.help,label:o("share.about_help",void 0,this.hass)}:void 0,a.homepage?{url:a.homepage,label:o("share.about_homepage",void 0,this.hass)}:void 0].filter(e=>!!e);return r||a.license||c.length||a.readme?e`
      ${r||a.license||c.length?e`<p class="hint about">
              ${r?e`<span
                      >${o("share.about_author",void 0,this.hass)}
                      ${d?e`<a href=${d} target="_blank" rel="noopener noreferrer">${r}</a>`:r}</span
                    >`:e``}
              ${a.license?e`<span>${o("share.about_license",{license:a.license},this.hass)}</span>`:e``}
              ${c.map(t=>e`<a href=${t.url} target="_blank" rel="noopener noreferrer">${t.label}</a>`)}
            </p>`:e``}
      ${a.readme?e`<ha-expansion-panel outlined>
              <span slot="header">${o("share.about_readme",void 0,this.hass)}</span>
              <ha-markdown class="readme" .content=${a.readme}></ha-markdown>
            </ha-expansion-panel>`:e``}
    `:e``}_renderUnmet(t){const i=t.filter(e=>void 0!==e),s=new Set(eo(i,is)),n=function(e,t){const i=new Set,s=[];for(const o of e)for(const e of Es(o)){const o=`${e.kind}:${e.any.join("|")}`;if(i.has(o))continue;if(i.add(o),Ps(e,t))continue;const n="homeassistant"===e.kind?t.homeassistant:"card"===e.kind?t.card:void 0;s.push(n?Object.assign(Object.assign({},e),{have:n}):e)}return s}(i,(a=this.hass,r=ct,l=is,{components:Array.isArray(null===(d=null==a?void 0:a.config)||void 0===d?void 0:d.components)?a.config.components:[],entities:Object.keys(null!==(c=null==a?void 0:a.states)&&void 0!==c?c:{}),homeassistant:"string"==typeof(null===(h=null==a?void 0:a.config)||void 0===h?void 0:h.version)?a.config.version:void 0,card:r,isDefined:l})).filter(e=>!("custom_card"===e.kind&&!e.message&&e.any.every(e=>s.has(e))));var a,r,l,d,c,h;return n.length?e`<ha-alert alert-type="warning" .title=${o("share.requires_header",void 0,this.hass)}>
      <ul class="risks">
        ${n.map(t=>e`<li>${this._unmetLine(t)}</li>`)}
      </ul>
      ${o("share.requires_hint",void 0,this.hass)}
    </ha-alert>`:e``}_unmetLine(e){var t;const i=o("share.requires_or",void 0,this.hass),s=o(`share.requires_${e.kind}`,{names:e.any.join(i),want:e.any[0],have:null!==(t=e.have)&&void 0!==t?t:"?"},this.hass);return e.message?`${s}: ${e.message}`:s}_renderSetup(t){const i=t.filter(e=>void 0!==e),s=function(e){const t=[];for(const i of e)for(const e of js(i).setup)t.includes(e)||t.push(e);return t}(i);if(!s.length)return e``;const n=e=>{if(e in this._setupValues)return this._setupValues[e];for(const t of i){const i=Ns(t,e);if(void 0!==i)return i}return""};return e`
      <h4>${o("share.setup_header",void 0,this.hass)}</h4>
      <p class="hint">${o("share.setup_hint",void 0,this.hass)}</p>
      <ha-form
        .hass=${this.hass}
        .data=${s.reduce((e,t)=>Object.assign(Object.assign({},e),{[t]:n(t)}),{})}
        .schema=${s.map(e=>({name:e,selector:{text:{}}}))}
        .computeLabel=${e=>e.name}
        @value-changed=${this._setupChanged}
      ></ha-form>
    `}_setupChanged(e){var t;e.stopPropagation();const i={};for(const[s,o]of Object.entries(null!==(t=e.detail.value)&&void 0!==t?t:{}))i[s]=null==o?"":String(o);this._setupValues=i}_keptSetup(e){const t={};for(const i of js(e).setup){const s=Ns(e,i);void 0!==s&&(t[i]=s)}return t}_renderRisks(t,i){return e`<ha-alert alert-type="warning" .title=${o(i,void 0,this.hass)}>
      <ul class="risks">
        ${t.actions.length?e`<li>${o("share.community_risk_actions",{list:t.actions.join(", ")},this.hass)}</li>`:e``}
        ${t.urls.length?e`<li>${o("share.community_risk_urls",{list:t.urls.join(", ")},this.hass)}</li>`:e``}
        ${t.embeds?e`<li>${o("share.community_risk_embeds",void 0,this.hass)}</li>`:e``}
        ${t.scripts?e`<li>${o("share.community_risk_scripts",void 0,this.hass)}</li>`:e``}
        ${t.placeholders?e`<li>${o("share.community_risk_placeholders",void 0,this.hass)}</li>`:e``}
        ${t.overlay?e`<li>${o("share.community_risk_overlay",void 0,this.hass)}</li>`:e``}
      </ul>
    </ha-alert>`}async _loadCommunity(e){var t,i;this._communityLoading=!0,this._communityError=void 0,this._installPending=void 0,this._communityKnown=void 0,this._communityKnownFailed=!1;try{this._community=await pl({refresh:e})}catch(s){const e=s;e.cached&&(this._community=e.cached),this._communityError=e.retryAt?o("share.community_rate_limited",{time:new Date(e.retryAt).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)},this.hass):o("share.community_failed",{message:e.message},this.hass)}finally{this._communityLoading=!1}this._community&&this._loadCommunityKnown()}_communityExisting(){var e;const t=Object.keys(P(this._savedLovelace));return[...new Set([...t,...null!==(e=this._communityKnown)&&void 0!==e?e:[]])]}async _loadCommunityKnown(){try{const e=await Ce(this.hass,this._savedLovelace);this._communityKnown=Object.keys(e)}catch(e){this._communityKnownFailed=!0}}_communityPicked(e){e.stopPropagation();const t=Number(e.detail.value.entry);this._communitySelected=Number.isFinite(t)&&t>0?t:void 0,this._installPending=void 0,this._setupValues={}}async _installShared(e){var t,i,s,o,n;if(void 0===this._communityKnown)return;const a=`community:${e.id}:${e.updated}`;if(this._installPending!==a)return this._installPending=a,void(this._installArmedAt=Date.now());if(Date.now()-this._installArmedAt<os)return;const r=w(),l=this._communityExisting(),d=l.includes(e.name)?Qs(e.name,l):e.name,c=[...Object.entries(e.includes).filter(([e])=>!l.includes(e)).map(([t,i])=>[t,ml(Ls(i,this._setupValues),ul(e,t))]),[d,ml(Ls(e.template,this._setupValues),ul(e,e.name))]],h=ae(null!==(t=null==r?void 0:r.config)&&void 0!==t?t:this.lovelace,null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""),p=null!==(n=null===(o=null==h?void 0:h.view)||void 0===o?void 0:o.index)&&void 0!==n?n:0;await this._saveDashboard(e=>c.reduce((e,[t,i])=>"root"===this._libraryDestination?tt(e,t,i):it(e,p,Object.assign({type:Fe,template:t},i,{type:Fe,template:t})),e),"community_install")&&(this._installPending=void 0,this._setupValues={})}_renderMissingCards(t){const i=eo(t.filter(e=>void 0!==e),is);return i.length?e`<ha-alert alert-type="warning">
      ${o(1===i.length?"share.missing_card_one":"share.missing_card_many",{cards:i.join(", ")},this.hass)}
    </ha-alert>`:e``}_renderInstalled(){var t;const i=st(this._savedLovelace);if(!i.length)return e``;const s=new Map((null!==(t=this._updates)&&void 0!==t?t:[]).map(e=>[e.name,e]));return e`
      <h3>${o("share.installed_header",void 0,this.hass)}</h3>
      <p class="hint">${o("share.installed_hint",void 0,this.hass)}</p>
      ${this._updatesError?e`<ha-alert alert-type="warning">${this._updatesError}</ha-alert>`:e``}
      <ul class="installed">
        ${i.map(({name:t,source:i,template:n})=>{var a,r;const l=s.get(t);return e`<li>
            ${t} —
            <a
              href=${null!==(r=null===(a=null==l?void 0:l.entry)||void 0===a?void 0:a.url)&&void 0!==r?r:`https://github.com/${Pr}/discussions/${i.discussion}`}
              target="_blank"
              rel="noopener noreferrer"
              >${o("share.installed_from",{discussion:i.discussion},this.hass)}</a
            >
            ${l?e`<span class="status"
                    >${o(`share.installed_status_${l.status}`,void 0,this.hass)}</span
                  >`:e``}
            ${"update"===(null==l?void 0:l.status)&&l.latest?this._renderUpdate(t,n,l):e``}
          </li>`})}
      </ul>
      <ha-button .disabled=${this._updatesLoading} @click=${()=>{this._checkUpdates()}}>
        ${o(this._updatesLoading?"share.community_loading":"share.installed_check",void 0,this.hass)}
      </ha-button>
    `}_renderUpdate(t,i,s){const n=Ls(s.latest,this._keptSetup(i)),a=e=>{const t=Object.assign({},e);return delete t.source,delete t.type,delete t.template,t},r=a(i),l=a(n),d=ll({template:l,includes:{}}),c=function(e,t){return{actions:e.actions.filter(e=>!t.actions.includes(e)),urls:e.urls.filter(e=>!t.urls.includes(e)),embeds:e.embeds&&!t.embeds,scripts:e.scripts&&!t.scripts,placeholders:e.placeholders&&!t.placeholders,overlay:e.overlay&&!t.overlay}}(d,ll({template:r,includes:{}})),h=this._updatePending===t;return e`
      <p class="hint">${o("share.installed_compare",void 0,this.hass)}</p>
      ${wl(r,l,this.hass)} ${this._renderMissingCards([n])} ${this._renderUnmet([n])}
      ${ss(c)?this._renderRisks(c,"share.installed_risks_new"):ss(d)?this._renderRisks(d,"share.installed_risks"):e``}
      ${h?e`<ha-alert alert-type="warning">
              ${o("share.installed_update_confirm",{name:t},this.hass)}
            </ha-alert>`:e``}
      <ha-button .disabled=${this._busy} @click=${()=>{this._updateShared(t,n)}}>
        ${o(h?"share.installed_update_anyway":"share.installed_update",void 0,this.hass)}
      </ha-button>
    `}async _checkUpdates(){var e,t;this._updatesLoading=!0,this._updatesError=void 0,this._updatePending=void 0;const i=st(this._savedLovelace);try{this._updates=fl(i,await pl({refresh:!0}))}catch(s){const i=s;this._updatesError=i.retryAt?o("share.community_rate_limited",{time:new Date(i.retryAt).toLocaleTimeString(null===(t=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===t?void 0:t.language)},this.hass):o("share.community_failed",{message:i.message},this.hass)}finally{this._updatesLoading=!1}}async _updateShared(e,t){var i,s;if(this._updatePending!==e)return this._updatePending=e,void(this._updateArmedAt=Date.now());if(Date.now()-this._updateArmedAt<os)return;await this._saveDashboard(i=>ot(i,e,t),"shared_update")&&(this._updatePending=void 0,this._updates=null===(i=this._updates)||void 0===i?void 0:i.map(t=>t.name===e?Object.assign(Object.assign({},t),{status:"current"}):t),(null===(s=this._config)||void 0===s?void 0:s.template)===e&&this._fireConfigChanged(Object.assign(Object.assign({},t),{type:this._config.type,template:e})))}_renderLibrary(){var t;const i=Object.keys(P(this._savedLovelace)),s=this._librarySelected?Fo(this._librarySelected):void 0,n=!!s&&i.includes(s.name),a=!!s&&this._installPending===s.name,r=s?Mo(s,i):[];return e`
      <div class="library">
        <ha-form
          .hass=${this.hass}
          .data=${{entry:null!==(t=this._librarySelected)&&void 0!==t?t:""}}
          .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:Io.map(e=>({value:e.name,label:e.name}))}}}]}
          .computeLabel=${()=>o("share.library_pick",void 0,this.hass)}
          @value-changed=${this._libraryPicked}
        ></ha-form>
        ${s?e`
                <p class="hint">${o(`library.${s.name}.summary`,void 0,this.hass)}</p>
                ${r.length?e`<p class="hint">
                        ${o("share.library_needs",{names:r.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderMissingCards([s,...r.map(e=>Fo(e))].map(e=>null==e?void 0:e.template))}
                <ha-expansion-panel outlined>
                  <span slot="header">${o("share.library_preview",void 0,this.hass)}</span>
                  ${Lo(s.name,e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${s.template}
                      read-only
                    ></ha-yaml-editor>`)}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{where:this._libraryDestination}}
                  .schema=${[{name:"where",selector:{select:{mode:"dropdown",options:[{value:"view",label:o("share.library_where_view",void 0,this.hass)},{value:"root",label:o("share.library_where_root",void 0,this.hass)}]}}}]}
                  .computeLabel=${()=>o("share.library_where",void 0,this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                <ha-button .disabled=${this._busy||n} @click=${()=>{this._install(s.name)}}>
                  ${o(n?"share.already_here":a?"share.install_anyway":"share.install",void 0,this.hass)}
                </ha-button>
              `:e``}
      </div>
    `}_libraryDestinationPicked(e){e.stopPropagation();const t=e.detail.value.where;this._libraryDestination="root"===t?"root":"view"}_libraryPicked(e){e.stopPropagation(),this._librarySelected=e.detail.value.entry||void 0,this._installPending=void 0}async _install(e){var t,i,s,o,n,a;const r=Fo(e);if(!r)return;if(this._installPending!==e)return void(this._installPending=e);const l=w(),d=Object.keys(P(null!==(t=null==l?void 0:l.config)&&void 0!==t?t:this._savedLovelace)),c=[...Mo(r,d),r.name].filter(e=>!d.includes(e)),h=ae(null!==(i=null==l?void 0:l.config)&&void 0!==i?i:this.lovelace,null!==(o=null===(s=this._config)||void 0===s?void 0:s.template)&&void 0!==o?o:""),p=null!==(a=null===(n=null==h?void 0:h.view)||void 0===n?void 0:n.index)&&void 0!==a?a:0;await this._saveDashboard(e=>c.reduce((e,t)=>{const i=Fo(t);if(!i)return e;const s=Object.assign(Object.assign({},i.template),{source:Vo(i.name,ct)});return"root"===this._libraryDestination?tt(e,i.name,s):it(e,p,Object.assign({type:Fe,template:i.name},s))},e),"library_install")&&(this._installPending=void 0)}async _copyExport(){const e=this.renderRoot.querySelector("#export"),t=null==e?void 0:e.yaml;if(!t)return;const{notes:i}=Ys(this._config,P(this._savedLovelace)),s=[...i.map(e=>`# ${e}`),t].join("\n");this._copyState=await te(s)?"done":"failed",setTimeout(()=>this._copyState="",3e3)}async _copyPost(){var e,t;const i=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!i)return;const{notes:s}=Ys(this._config,P(this._savedLovelace));this._postCopyState=await te(function(e,t,i){return[...[i,...t].filter(e=>"string"==typeof e&&e.trim()),"```yaml\n"+e.replace(/\n*$/,"")+"\n```"].join("\n\n")+"\n"}(i,s,null===(t=this._config)||void 0===t?void 0:t.description))?"done":"failed",setTimeout(()=>this._postCopyState="",3e3)}_downloadExport(){var e,t,i;const s=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!s)return;const{notes:o}=Ys(this._config,P(this._savedLovelace)),n=[...o.map(e=>`# ${e}`),s].join("\n"),a=document.createElement("a");a.href=URL.createObjectURL(new Blob([n],{type:"text/yaml"})),a.download=`${(null!==(i=null===(t=this._config)||void 0===t?void 0:t.template)&&void 0!==i?i:"template").replace(/[^\w-]+/g,"_")}.yaml`,a.click(),setTimeout(()=>URL.revokeObjectURL(a.href),1e3)}async _importFile(e){var t,i,s;const n=e.target,a=null===(t=n.files)||void 0===t?void 0:t[0];if(n.value="",!a)return;const r=await a.text(),l=null===(s=null===(i=this.renderRoot.querySelector("#import"))||void 0===i?void 0:i.shadowRoot)||void 0===s?void 0:s.querySelector("ha-code-editor");l?(l.value=r,l.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r}}))):this._importErrors=[o("share.import_not_yaml",void 0,this.hass)]}_renderTrash(){if(void 0===this._trash)return this._loadTrash(),e``;const t=e=>{var t,i;return new Date(e).toLocaleString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)};return e`
      <h3>${o("share.trash_header",void 0,this.hass)}</h3>
      <p class="hint">${o("share.trash_hint",void 0,this.hass)}</p>
      ${this._trash.length?e`<ul class="installed trash">
              ${this._trash.map((i,s)=>e`
                  <li>
                    <strong>${i.name}</strong>
                    <div class="status">
                      ${o("removed"===i.reason?"share.trash_removed":"share.trash_replaced",{when:t(i.at),dashboard:i.dashboard},this.hass)}
                    </div>
                    ${this._trashPending===s?e`<ha-alert alert-type="warning">
                            ${o("share.trash_clash",{name:i.name},this.hass)}
                          </ha-alert>`:e``}
                    <ha-button .disabled=${this._busy} @click=${()=>this._restore(i,s)}>
                      ${o(this._trashPending===s?"share.trash_restore_anyway":"share.trash_restore",void 0,this.hass)}
                    </ha-button>
                    <ha-button
                      @click=${()=>{this._trashShown=this._trashShown===s?void 0:s}}
                    >
                      ${o(this._trashShown===s?"share.trash_hide":"share.trash_show",void 0,this.hass)}
                    </ha-button>
                    <ha-button .disabled=${this._busy} @click=${()=>this._forget(i)}>
                      ${o("share.trash_forget",void 0,this.hass)}
                    </ha-button>
                    ${this._trashShown===s?e`<ha-yaml-editor
                            .hass=${this.hass}
                            .defaultValue=${i.template}
                            read-only
                          ></ha-yaml-editor>`:e``}
                  </li>
                `)}
            </ul>`:e`<p class="hint">${o("share.trash_empty",void 0,this.hass)}</p>`}
    `}async _restore(e,t){var i,s;if(!this.hass)return;const n=nt(this.hass);let a;try{a=await at(n,e.dashboard)}catch(l){return void(this._toolError=o("tools.save_failed",{message:null!==(i=null==l?void 0:l.message)&&void 0!==i?i:l},this.hass))}const r=e.name in P(a);if(r&&this._trashPending!==t)return this._trashPending=t,void(this._trashArmedAt=Date.now());if(!(r&&Date.now()-this._trashArmedAt<os)){this._busy=!0,this._toolError=void 0;try{await x(this,this.hass,"restore",[{urlPath:e.dashboard,build:t=>rt(t,e)}]),this._trashPending=void 0,this._trashShown=void 0,await this._forget(e)}catch(l){this._toolError=o("tools.save_failed",{message:null!==(s=null==l?void 0:l.message)&&void 0!==s?s:l},this.hass)}finally{this._busy=!1}}}async _forget(e){if(!this.hass)return;const t=lt(await et(this.hass),e);await dt(this.hass,t),this._trash=t,this._trashPending=void 0}_renderImportDetails(){const t=this._importValue;if(!this._importParses||!t||"object"!=typeof t||Array.isArray(t))return e``;if(!Fr(t))return e``;const i=[t,...t.includes&&"object"==typeof t.includes&&!Array.isArray(t.includes)?Object.values(t.includes):[]];return e`${this._renderAbout(t)} ${this._renderUnmet(i)} ${this._renderSetup(i)}`}_importChanged(e){e.stopPropagation(),this._importValue=e.detail.value,this._importParses=!1!==e.detail.isValid,this._importErrors=[],this._importClash=void 0,this._importRisks=void 0,this._setupValues={}}_import(){if(!this._config)return;if(!this._importParses)return void(this._importErrors=[o("share.import_not_yaml",void 0,this.hass)]);if(!Fr(this._importValue))return void(this._importErrors=[o("share.import_too_big",void 0,this.hass)]);const e=Xs(this._importValue);if(!e.ok)return this._importErrors=e.errors,void(this._importClash=void 0);this._importErrors=[];const t=this._importValue.template,i=P(this._savedLovelace),s=t!==this._config.template&&t in i?t:void 0,n=ll({template:this._importValue,includes:{}});if(s&&!this._importClash||ss(n)&&!this._importRisks)return this._importClash=s,this._importRisks=ss(n)?n:void 0,void(this._importArmedAt=Date.now());Date.now()-this._importArmedAt<os||this._applyImport(t)}_importAsCopy(){if(!this._config||!this._importParses)return;if(Date.now()-this._importArmedAt<os)return;const e=Object.keys(P(this._savedLovelace));this._applyImport(Qs(this._importValue.template,e))}_applyImport(e){var t;const i=function(e){const t=Zs(e);if((null==t?void 0:t.includes)&&"object"==typeof t.includes&&!Array.isArray(t.includes)){const e={};for(const[i,s]of Object.entries(t.includes))e[i]=Zs(s);t.includes=e}return t}(this._importValue),s=Ls(i,this._setupValues);s.includes&&"object"==typeof s.includes&&!Array.isArray(s.includes)&&(s.includes=Object.entries(s.includes).reduce((e,[t,i])=>Object.assign(Object.assign({},e),{[t]:i&&"object"==typeof i&&!Array.isArray(i)?Ls(i,this._setupValues):i}),{}));const o=s.includes;if(o&&"object"==typeof o&&!Array.isArray(o)){const e=Object.keys(P(this._savedLovelace)),t=Object.entries(o).filter(([t])=>!e.includes(t));t.length&&this._saveDashboard(e=>t.reduce((e,[t,i])=>tt(e,t,i),e),"import",this._config)}const n=Object.assign(Object.assign({},s),{template:e,type:null===(t=this._config)||void 0===t?void 0:t.type});delete n.includes,this._fireConfigChanged(n),this._importClash=void 0,this._importRisks=void 0,this._setupValues={},this.dispatchEvent(new CustomEvent("select-tab",{detail:"settings",bubbles:!0,composed:!0}))}}h([p({attribute:!1})],kl.prototype,"hass",void 0),h([p({attribute:!1})],kl.prototype,"lovelace",void 0),h([p({attribute:!1})],kl.prototype,"config",void 0),h([u()],kl.prototype,"_importErrors",void 0),h([u()],kl.prototype,"_importClash",void 0),h([u()],kl.prototype,"_importRisks",void 0),h([u()],kl.prototype,"_copyState",void 0),h([u()],kl.prototype,"_toolError",void 0),h([u()],kl.prototype,"_busy",void 0),h([u()],kl.prototype,"_installPending",void 0),h([u()],kl.prototype,"_librarySelected",void 0),h([u()],kl.prototype,"_libraryDestination",void 0),h([u()],kl.prototype,"_community",void 0),h([u()],kl.prototype,"_communityLoading",void 0),h([u()],kl.prototype,"_communityError",void 0),h([u()],kl.prototype,"_communitySelected",void 0),h([u()],kl.prototype,"_communityKnown",void 0),h([u()],kl.prototype,"_communityKnownFailed",void 0),h([u()],kl.prototype,"_postCopyState",void 0),h([u()],kl.prototype,"_setupValues",void 0),h([u()],kl.prototype,"_updates",void 0),h([u()],kl.prototype,"_updatesLoading",void 0),h([u()],kl.prototype,"_updatesError",void 0),h([u()],kl.prototype,"_updatePending",void 0),h([u()],kl.prototype,"_trash",void 0),h([u()],kl.prototype,"_trashShown",void 0),h([u()],kl.prototype,"_trashPending",void 0),customElements.get("decluttering-template-share-tab")||customElements.define("decluttering-template-share-tab",kl)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;const jl=(e,t,i)=>{const s=new Map;for(let o=t;o<=i;o++)s.set(e[o],o);return s},Al=ko(class extends jo{constructor(e){if(super(e),e.type!==xo)throw Error("repeat() can only be used in text expressions")}dt(e,t,i){let s;void 0===i?i=t:void 0!==t&&(s=t);const o=[],n=[];let a=0;for(const r of e)o[a]=s?s(r,a):a,n[a]=i(r,a),a++;return{values:n,keys:o}}render(e,t,i){return this.dt(e,t,i).values}update(e,[t,i,s]){const o=(e=>e._$AH)(e),{values:n,keys:a}=this.dt(t,i,s);if(!Array.isArray(o))return this.ut=a,n;const r=this.ut??=[],l=[];let d,c,h=0,p=o.length-1,u=0,m=n.length-1;for(;h<=p&&u<=m;)if(null===o[h])h++;else if(null===o[p])p--;else if(r[h]===a[u])l[u]=Eo(o[h],n[u]),h++,u++;else if(r[p]===a[m])l[m]=Eo(o[p],n[m]),p--,m--;else if(r[h]===a[m])l[m]=Eo(o[h],n[m]),Co(e,l[m+1],o[h]),h++,m--;else if(r[p]===a[u])l[u]=Eo(o[p],n[u]),Co(e,o[h],o[p]),p--,u++;else if(void 0===d&&(d=jl(a,u,m),c=jl(r,h,p)),d.has(r[h]))if(d.has(r[p])){const t=c.get(a[u]),i=void 0!==t?o[t]:null;if(null===i){const t=Co(e,o[h]);Eo(t,n[u]),l[u]=t}else l[u]=Eo(i,n[u]),Co(e,o[h],i),o[t]=null;u++}else No(o[p]),p--;else No(o[h]),h++;for(;u<=m;){const t=Co(e,l[m+1]);Eo(t,n[u]),l[u++]=t}for(;h<=p;){const e=o[h++];null!==e&&No(e)}return this.ut=a,Po(e,l),ht}}),Sl=["type","label","description","default","required","group","pattern","allowed","domain","device_class","min","max","step","unit","multiline","selector"];function Ol(e){const t={};for(const s of Sl){const i=e[s];void 0!==i&&(t[s]=i)}Object.assign(t,e.extra);const i={name:e.name};for(const s of e.order)s in t&&(i[s]=t[s]);for(const s of Object.keys(t))s in i||(i[s]=t[s]);return i}function Cl(e){return!!e&&"object"==typeof e&&!Array.isArray(e)}function El(e,t){const i=e.map(Ol);if("mapping"===t){const e={};for(const t of i){const{name:i}=t,s=Xe(t,["name"]),o=Object.keys(s);o.length?1!==o.length||"default"!==o[0]||Cl(s.default)||null===s.default?e[String(i)]=s:e[String(i)]=s.default:e[String(i)]=null}return e}if("none"!==t||i.length)return i}function Tl(e,t){const i=new Set(e.map(e=>e.name));if(!i.has(t))return t;let s=2;for(;i.has(`${t}_${s}`);)s+=1;return`${t}_${s}`}function Pl(e,t,i){const s=Object.assign(Object.assign({},e),{extra:Object.assign({},e.extra)});return void 0===i?delete s[t]:s[t]=i,s}function Nl(e){return void 0!==e.type?String(e.type):e.selector&&"object"==typeof e.selector&&"card"in e.selector?"card":""}const Ll=e=>Array.isArray(e)?e.map(String).join(", "):null==e?"":String(e),Il=e=>{const t=e.split(",").map(e=>e.trim()).filter(Boolean);return t.length?t:void 0};class Fl extends m{constructor(){super(...arguments),this._reorderedAsList=!1,this.shared=[],this._asYaml=!1,this._picking=!1}static get styles(){return f`
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
    `}get _rows(){return function(e){var t;const i=[];for(const s of De(e)){if(!s||"object"!=typeof s)continue;const e={name:"string"==typeof s.name?s.name:String(null!==(t=s.name)&&void 0!==t?t:""),extra:{},order:Object.keys(s).filter(e=>"name"!==e)};for(const[t,i]of Object.entries(s))"name"!==t&&(Sl.includes(t)?e[t]=i:e.extra[t]=i);i.push(e)}return i}(this.variables)}get _shape(){const e=(t=this.variables,Array.isArray(t)?"list":t&&"object"==typeof t?"mapping":"none");var t;return"none"===e?"list":e}render(){const t=this._rows;return e`
      ${this._asYaml?this._renderYaml():this._renderRows(t)}
      ${this._reorderedAsList?e`<p class="hint">${o("declarations.reordered_as_list",void 0,this.hass)}</p>`:Qe}
      <div class="add">
        <ha-button @click=${this._add}>${o("declarations.add",void 0,this.hass)}</ha-button>
        ${this.shared.length?e`<ha-button
                appearance="plain"
                @click=${()=>{this._picking=!this._picking}}
                >${o("declarations.take_shared",void 0,this.hass)}</ha-button
              >`:Qe}
        <span class="spacer"></span>
        <ha-button
          appearance="plain"
          @click=${()=>{this._asYaml=!this._asYaml}}
          >${o(this._asYaml?"declarations.as_rows":"declarations.as_yaml",void 0,this.hass)}</ha-button
        >
      </div>
      ${this._picking?this._renderShared(t):Qe}
    `}_renderRows(t){if(!t.length)return e`<div class="rows">
        <div class="empty">${o("declarations.none",void 0,this.hass)}</div>
      </div>`;const i=function(e){return e.map((t,i)=>{const s=void 0===t.group?void 0:String(t.group),o=i?e[i-1].group:void 0;return void 0!==s&&s!==(void 0===o?void 0:String(o))?s:void 0})}(t);return e`<div class="rows">
      ${Al(t,e=>e.name,(s,n)=>e`
          ${void 0!==i[n]?e`<div class="group">${i[n]}</div>`:Qe}
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
              aria-label=${o("template_editor.drag_hint",void 0,this.hass)}
              .path=${ns}
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
                .label=${o(this._open===s.name?"declarations.less":"declarations.more",void 0,this.hass)}
                @click=${()=>{this._open=this._open===s.name?void 0:s.name}}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,15L12,10L17,15H7Z"}
                .disabled=${0===n}
                .label=${o("template_editor.move_up",{name:s.name},this.hass)}
                @click=${()=>this._move(n,n-1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,10L12,15L17,10H7Z"}
                .disabled=${n===t.length-1}
                .label=${o("template_editor.move_down",{name:s.name},this.hass)}
                @click=${()=>this._move(n,n+1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                .label=${o("declarations.remove",{name:s.name},this.hass)}
                @click=${()=>this._remove(n)}
              ></ha-icon-button>
            </div>
          </div>
          ${this._open===s.name?this._renderMore(s,n):Qe}
        `)}
    </div>`}_renderMore(t,i){const s={description:t.description,group:t.group,pattern:t.pattern,domain:Ll(t.domain),device_class:Ll(t.device_class),min:t.min,max:t.max,step:t.step,unit:t.unit,allowed:Ll(t.allowed),multiline:t.multiline};return e`<div class="more">
      <ha-form
        .hass=${this.hass}
        .data=${s}
        .schema=${function(e,t){const i=Nl(e),s={name:"description",label:o("declarations.description",void 0,t),selector:{text:{multiline:!0}}},n=[{name:"group",label:o("declarations.group",void 0,t),selector:{text:{}}}],a="entity"===i?[{name:"domain",label:o("declarations.domain",void 0,t),selector:{text:{}}},{name:"device_class",label:o("declarations.device_class",void 0,t),selector:{text:{}}}]:"number"===i?[{name:"min",label:o("declarations.min",void 0,t),selector:{number:{mode:"box"}}},{name:"max",label:o("declarations.max",void 0,t),selector:{number:{mode:"box"}}},{name:"step",label:o("declarations.step",void 0,t),selector:{number:{mode:"box"}}},{name:"unit",label:o("declarations.unit",void 0,t),selector:{text:{}}}]:"select"===i?[{name:"allowed",label:o("declarations.allowed",void 0,t),selector:{text:{}}}]:"text"===i?[{name:"multiline",label:o("declarations.multiline",void 0,t),selector:{boolean:{}}}]:[],r="card"===i?[]:[{name:"pattern",label:o("declarations.pattern",void 0,t),selector:{text:{}}}];return[s,{name:"",type:"grid",column_min_width:"260px",schema:[...n,...a,..."select"!==i&&void 0!==e.allowed?[{name:"allowed",label:o("declarations.allowed",void 0,t),selector:{text:{}}}]:[],...r]}]}(t,this.hass)}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        @value-changed=${e=>this._moreChanged(e,i)}
      ></ha-form>
      ${void 0!==t.selector&&"card"!==Nl(t)?e`<ha-form
              .hass=${this.hass}
              .data=${{selector:t.selector}}
              .schema=${[{name:"selector",label:o("declarations.selector",void 0,this.hass),selector:{object:{}}}]}
              .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
              @value-changed=${e=>this._selectorChanged(e,i)}
            ></ha-form>`:Qe}
    </div>`}_renderYaml(){return e`<ha-form
      .hass=${this.hass}
      .data=${{variables:this.variables}}
      .schema=${[{name:"variables",label:o("template_editor.declarations_label",void 0,this.hass),helper:o("template_editor.declarations_helper",void 0,this.hass),selector:{object:{}}}]}
      .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
      .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
      @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value.variables)}}
    ></ha-form>`}_renderShared(t){const i=new Set(t.map(e=>e.name)),s=this.shared.filter(e=>!i.has(e.name));return e`<div class="pick">
      ${o("declarations.take_shared_hint",void 0,this.hass)}
      ${s.length?e`<ul>
              ${s.map(t=>e`<li>
                    <a @click=${()=>this._takeShared(t)}>${t.name}</a>
                    ${t.label?e` - ${t.label}`:Qe}
                  </li>`)}
            </ul>`:e`<p>${o("declarations.take_shared_none",void 0,this.hass)}</p>`}
    </div>`}_rowData(e){const t=void 0===e.default||["string","number","boolean"].includes(typeof e.default);return{name:e.name,type:Nl(e),label:e.label,default:t?void 0===e.default?void 0:String(e.default):e.default,required:!0===e.required}}_rowSchema(e){const t=void 0===e.default||["string","number","boolean"].includes(typeof e.default),[i]=(s=this.hass,[{name:"",type:"grid",column_min_width:"120px",schema:[{name:"name",label:o("declarations.name",void 0,s),selector:{text:{}}},{name:"type",label:o("declarations.type",void 0,s),selector:{select:{mode:"dropdown",options:[{value:"",label:o("declarations.type_any",void 0,s)},...pt.map(e=>({value:e,label:o(`type_name.${e}`,void 0,s)})),{value:"card",label:o("type_name.card",void 0,s)}]}}},{name:"label",label:o("declarations.label",void 0,s),selector:{text:{}}},{name:"default",label:o("declarations.default",void 0,s),selector:{text:{}}},{name:"required",label:o("declarations.required",void 0,s),selector:{boolean:{}}}]}]);var s;if(t)return[i];const n=i.schema.map(e=>"default"===e.name?(e=>({name:"default",label:o("declarations.default",void 0,e),selector:{object:{}}}))(this.hass):e);return[Object.assign(Object.assign({},i),{schema:n})]}_rowChanged(e,t){var i,s;e.stopPropagation();const o=this._rows,n=o[t];if(!n)return;const a=e.detail.value;let r=n;const l="string"==typeof a.name?a.name.trim():n.name;l&&l!==n.name&&(r=Pl(r,"name",Tl(o.filter((e,i)=>i!==t),l)),this._open===n.name&&(this._open=r.name)),(null!==(i=a.type)&&void 0!==i?i:"")!==Nl(n)&&(r=function(e,t){let i=Pl(e,"type",void 0);return i=Pl(i,"selector",void 0),"card"===t?Pl(i,"selector",{card:{}}):t?Pl(i,"type",t):i}(r,String(null!==(s=a.type)&&void 0!==s?s:""))),r=Pl(r,"label","string"==typeof a.label&&""!==a.label?a.label:void 0),r=Pl(r,"required",!0===a.required||void 0),a.default===n.default||""===a.default&&void 0===n.default||(r=Pl(r,"default",this._defaultFrom(a.default,n))),this._emit(El(o.map((e,i)=>i===t?r:e),this._shape))}_defaultFrom(e,t){if(""===e||null==e)return;if("string"!=typeof e)return e;const i=Nl(t);return"number"!==i||""===e.trim()||Number.isNaN(Number(e))?"boolean"===i&&["true","false"].includes(e.trim().toLowerCase())?"true"===e.trim():e:Number(e)}_moreChanged(e,t){e.stopPropagation();const i=this._rows,s=i[t];if(!s)return;const o=e.detail.value;let n=s;const a=e=>"string"==typeof e&&e.trim()?e:void 0;n=Pl(n,"description",a(o.description)),n=Pl(n,"group",a(o.group)),n=Pl(n,"pattern",a(o.pattern)),n=Pl(n,"unit",a(o.unit));for(const l of["min","max","step"])n=Pl(n,l,"number"==typeof o[l]?o[l]:void 0);n=Pl(n,"multiline",!0===o.multiline||void 0);const r=e=>{const t="string"==typeof e?Il(e):void 0;return void 0===t?void 0:1===t.length?t[0]:t};n=Pl(n,"domain",r(o.domain)),n=Pl(n,"device_class",r(o.device_class)),n=Pl(n,"allowed","string"==typeof o.allowed?Il(o.allowed):void 0),this._emit(El(i.map((e,i)=>i===t?n:e),this._shape))}_selectorChanged(e,t){e.stopPropagation();const i=this._rows,s=e.detail.value.selector,o=Pl(i[t],"selector",s&&"object"==typeof s?s:void 0);this._emit(El(i.map((e,i)=>i===t?o:e),this._shape))}_add(){const e=this._rows,t=function(e,t="variable"){return{name:Tl(e,t),extra:{},order:[]}}(e);this._open=t.name,this._emit(El([...e,t],this._shape))}_takeShared(e){const t=this._rows,i={name:e.name,extra:{},order:[]};this._picking=!1,this._emit(El([...t,i],this._shape))}_remove(e){const t=this._rows;this._emit(El(t.filter((t,i)=>i!==e),this._shape))}_move(e,t){const i=this._rows,s=function(e,t,i){if(t===i||t<0||i<0||t>=e.length||i>=e.length)return e;const s=[...e],[o]=s.splice(t,1);return s.splice(i,0,o),s}(i,e,t);if(s===i)return;const o="mapping"===this._shape?"list":this._shape;this._reorderedAsList="mapping"===this._shape,this._emit(El(s,o))}_drop(e,t){e.preventDefault();const i=this._dragging;this._dragging=void 0,void 0!==i&&this._move(i,t)}_emit(e){g(this,"value-changed",{value:e})}}h([p({attribute:!1})],Fl.prototype,"hass",void 0),h([p({attribute:!1})],Fl.prototype,"variables",void 0),h([u()],Fl.prototype,"_reorderedAsList",void 0),h([p({attribute:!1})],Fl.prototype,"shared",void 0),h([u()],Fl.prototype,"_open",void 0),h([u()],Fl.prototype,"_asYaml",void 0),h([u()],Fl.prototype,"_picking",void 0);const Ml="decluttering-declarations-editor";customElements.get(Ml)||customElements.define(Ml,Fl);const Vl=["name","title","label","entity","area","room"];function ql(e,t){const i=Object.assign({},a(t)),s=null==e?void 0:e.examples,o=null==s?[]:Array.isArray(s)?s:[s];return Object.assign(Object.assign({},e),{examples:[...o,i]})}class Dl extends m{static get styles(){return f`
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
    `}render(){var t;const i=this.config,s=null==i?void 0:i.template;if(!i||!s)return e``;const n=q(i),r=ut.get(s),l=void 0===r||r>=n.length?"":String(r),d=null!==(t=P(this.lovelace,void 0,i)[s])&&void 0!==t?t:i,c=n.length?mt({[s]:d},[],this.hass):[],h=n.length-c.length,p=""===l?void 0:c.find(e=>e.example===Number(l)+1),u=[{name:"example",label:o("template_editor.preview_example_label",void 0,this.hass),selector:{select:{mode:"dropdown",options:[{value:"",label:o("template_editor.preview_defaults",void 0,this.hass)},...n.map((e,t)=>{const i=function(e){const t=a(e);for(const s of Vl){const e=t[s];if("string"==typeof e&&e.trim())return e.trim();if("number"==typeof e)return String(e)}const i=e.map(U).find(e=>void 0!==e);if(void 0!==i){const e=t[i];if("string"==typeof e||"number"==typeof e)return`${i}: ${e}`}}(e),s=o("template_editor.example_n",{number:t+1},this.hass);return{value:String(t),label:i?`${s}: ${i}`:s}})]}}}];return e`
      <div class="strip">
        <ha-form
          .hass=${this.hass}
          .data=${{example:l}}
          .schema=${u}
          .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
          @value-changed=${this._picked}
        ></ha-form>
        ${n.length?e`<span class="passes ${h<n.length?"some":""}"
                >${o("template_editor.examples_pass",{passes:h,total:n.length},this.hass)}</span
              >`:Qe}
        <ha-icon-button
          .path=${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}
          .label=${o("template_editor.example_add",void 0,this.hass)}
          @click=${this._add}
        ></ha-icon-button>
      </div>
      ${p?e`<ha-alert alert-type="warning"
              >${o("tools.health_example",{template:s,number:p.example,problems:p.problems.join(" ")},this.hass)}</ha-alert
            >`:Qe}
    `}_picked(e){var t;e.stopPropagation();const i=null===(t=this.config)||void 0===t?void 0:t.template;if(!i)return;const s=e.detail.value.example;void 0===s||""===s?ut.delete(i):ut.set(i,Number(s)),window.dispatchEvent(new CustomEvent(ft,{detail:{template:i}})),this.dispatchEvent(new CustomEvent("example-picked",{detail:{template:i,example:""===s?void 0:Number(s)},bubbles:!0,composed:!0})),this.requestUpdate()}_add(){const e=this.config;if(!e)return;const t=q(e),i=ut.get(e.template),s=void 0!==i&&t[i]?t[i]:c(Ee(e));g(this,"config-changed",{config:ql(e,s)})}}h([p({attribute:!1})],Dl.prototype,"hass",void 0),h([p({attribute:!1})],Dl.prototype,"lovelace",void 0),h([p({attribute:!1})],Dl.prototype,"config",void 0);const Hl="decluttering-example-strip";customElements.get(Hl)||customElements.define(Hl,Dl);const Rl=G({states:{"light.kitchen_ceiling":{entity_id:"light.kitchen_ceiling",state:"on",attributes:{friendly_name:"Kitchen ceiling",brightness:180}},"sensor.garden_temperature":{entity_id:"sensor.garden_temperature",state:"14.6",attributes:{friendly_name:"Garden temperature",unit_of_measurement:"°C",device_class:"temperature"}},"binary_sensor.bedroom_window":{entity_id:"binary_sensor.bedroom_window",state:"off",attributes:{friendly_name:"Bedroom window",device_class:"window"}},"input_select.house_mode":{entity_id:"input_select.house_mode",state:"night",attributes:{friendly_name:"House mode",options:["day","night","away"]}}},entities:{"light.kitchen_ceiling":{entity_id:"light.kitchen_ceiling",device_id:"kitchen_hue",labels:["evening"]},"sensor.garden_temperature":{entity_id:"sensor.garden_temperature",device_id:"garden_aqara",labels:[]},"binary_sensor.bedroom_window":{entity_id:"binary_sensor.bedroom_window",area_id:"bedroom",icon:"mdi:window-closed-variant",labels:[]},"input_select.house_mode":{entity_id:"input_select.house_mode",labels:[]}},devices:{kitchen_hue:{id:"kitchen_hue",name:"Hue ceiling",manufacturer:"Signify",model:"Hue White",area_id:"kitchen"},garden_aqara:{id:"garden_aqara",name:"Garden sensor",manufacturer:"Aqara",model:"WSDCGQ11LM",area_id:"back_garden"}},areas:{kitchen:{area_id:"kitchen",name:"Kitchen",floor_id:"ground_floor",icon:"mdi:fridge"},back_garden:{area_id:"back_garden",name:"Back Garden",floor_id:null,icon:null},bedroom:{area_id:"bedroom",name:"Bedroom",floor_id:"first_floor",icon:"mdi:bed"}},floors:{ground_floor:{floor_id:"ground_floor",name:"Ground floor",icon:"mdi:home-floor-0"},first_floor:{floor_id:"first_floor",name:"First floor",icon:"mdi:home-floor-1"}},labels:{evening:{label_id:"evening",name:"Evening lights"}},language:"en",locale:{language:"en"},localize:()=>""},["light.kitchen_ceiling","sensor.garden_temperature","binary_sensor.bedroom_window","input_select.house_mode"]);function zl(e,t,i,s={},o=Rl){const n=d(e,s,{value:t},null==s?void 0:s.template,o,!0,e=>e.forEach(e=>i.add(e.split("|")[0].replace(/\?$/,""))));return{value:null==n?void 0:n.value,removed:!n||!("value"in n)}}function Wl(e){return e.removed?{value:void 0,kind:"removed"}:{value:e.value,kind:(t=e.value,null===t?"null":Array.isArray(t)?"list":"object"==typeof t?"mapping":"number"==typeof t?"number":"boolean"==typeof t?"boolean":"string"==typeof t&&/\[\[[^\]]/.test(t)?"unresolved":"text")};var t}function Ul(e,t,i,s){return function(e,t,i,s){const o=new Set,n=Wl(zl(e,t,o,i,s)),a=zl(e,`<${t}>`,new Set,i,s),r=[],l=function(e){const t=e.trim();if(!t.startsWith("[[")||!t.endsWith("]]"))return;const i=[];let s=0,o="";for(let r=2;r<t.length-2;r+=1){const e=t.slice(r,r+2);if("[["===e)s+=1,o+=e,r+=1;else if("]]"===e){if(0===s)return;s-=1,o+=e,r+=1}else"|"===t[r]&&0===s?(i.push(o),o=""):o+=t[r]}if(0!==s)return;i.push(o);const n=i.length-1,a=i[n].endsWith("?");return a&&(i[n]=i[n].slice(0,-1)),{name:i[0],steps:i.slice(1),optional:a}}(t);if(l&&l.steps.length)for(let d=0;d<=l.steps.length;d+=1){const t=`[[${[l.name,...l.steps.slice(0,d)].join("|")}${d===l.steps.length&&l.optional?"?":""}]]`;r.push(Object.assign({written:t,step:0===d?l.name:l.steps[d-1]},Wl(zl(e,t,new Set,i,s))))}return{steps:r,whole:n,inText:"string"==typeof a.value?a.value.slice(1,-1):void 0,unset:[...o]}}(t,i,null!=e?e:{},null!=s?s:Rl)}const Bl=["card","badge","row","element","group","style","let","default","defaults","grid_options","name"],Kl="[^[\\]]",Jl=new RegExp(`\\[\\[(?:${Kl}|${`\\[\\[(?:${Kl}|${`\\[\\[${Kl}*\\]\\]`})*\\]\\]`})*\\]\\]`,"g");function Yl(e){var t;const i=[];for(const s of null!==(t=e.match(Jl))&&void 0!==t?t:[])s.startsWith("[[!")||i.includes(s)||i.push(s);return i}const Zl=["slug","title","upper","default:","if:","bool","replace:","friendly_name","area","state"];class Gl extends m{constructor(){super(...arguments),this._expression="",this._more=!1}static get styles(){return f`
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
    `}render(){const t=this.config;if(!t||!this.hass)return e``;const i=function(e){if(!e||"object"!=typeof e)return[];const t=[];for(const i of Bl){const s=e[i];if(void 0===s)continue;const o="string"==typeof s?s:JSON.stringify(s);for(const e of Yl(o))t.includes(e)||t.push(e)}return t}(t),s=this._expression||i[0]||"",n=[{name:"placeholder",label:o("placeholder_tool.placeholder",void 0,this.hass),selector:{select:{mode:"dropdown",custom_value:!0,options:i.map(e=>({value:e,label:e}))}}}];return e`
      <ha-expansion-panel outlined>
        <span slot="header"
          >${o("placeholder_tool.header",void 0,this.hass)} <small>${this._exampleLabel()}</small></span
        >
        <div style="padding: 12px 4px 4px">
          <ha-form
            .hass=${this.hass}
            .data=${{placeholder:s}}
            .schema=${n}
            .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
            @value-changed=${this._picked}
          ></ha-form>
          <p class="hint">${o("placeholder_tool.hint",{count:i.length},this.hass)}</p>
          <div class="chips">
            <span>${o("placeholder_tool.add_step",void 0,this.hass)}</span>
            ${(this._more?[...gt,...vt.map(e=>`${e}:`)]:Zl).map(t=>e`<span class="chip" @click=${()=>this._addStep(s,t)}>${t}</span>`)}
            ${this._more?Qe:e`<span
                    class="chip"
                    @click=${()=>{this._more=!0}}
                    >…</span
                  >`}
          </div>
          ${s?this._renderResult(s):Qe}
        </div>
      </ha-expansion-panel>
    `}_exampleLabel(){var e;const t=null===(e=this.config)||void 0===e?void 0:e.template,i=t?ut.get(t):void 0;return void 0===i?o("placeholder_tool.under_defaults",void 0,this.hass):o("placeholder_tool.under_example",{number:i+1},this.hass)}_result(e){var t;const i=this.config;if(!i)return;const s=null!==(t=P(this.lovelace,void 0,i)[i.template])&&void 0!==t?t:i,o=_t(s,ut.get(i.template)),n=null!=o?o:c(Ee(s));try{return Ul(s,n,e,this.hass)}catch(a){return}}_renderResult(t){const i=this._result(t);if(!i)return e``;if(i.error)return e`<ha-alert alert-type="error">${i.error}</ha-alert>`;const s=i.steps.length?i.steps:[],n=s.findIndex(e=>"unresolved"===e.kind);return e`
      <table>
        <thead>
          <tr>
            <th>${o("placeholder_tool.col_step",void 0,this.hass)}</th>
            <th>${o("placeholder_tool.col_gives",void 0,this.hass)}</th>
            <th>${o("placeholder_tool.col_from",void 0,this.hass)}</th>
          </tr>
        </thead>
        <tbody>
          ${s.map((e,t)=>this._renderStep(e,t,n,i))}
          <tr class=${"unresolved"===i.whole.kind?"bad":""}>
            <td class="code">${o("placeholder_tool.result",void 0,this.hass)}</td>
            <td class="code ${"unresolved"===i.whole.kind?"bad":""}">
              <span class="value">${this._shown(i.whole.value,i.whole.kind)}</span>
            </td>
            <td class="from">${o(`placeholder_tool.kind_${i.whole.kind}`,void 0,this.hass)}</td>
          </tr>
        </tbody>
      </table>
      <p class="hint">${o("placeholder_tool.steps_hint",void 0,this.hass)}</p>
    `}_renderStep(t,i,s,n){const a="unresolved"===t.kind&&(-1===s||i===s),r=void 0===t.value||""===t.value||"removed"===t.kind,l=0===i?n.unset.includes(t.step)?o("placeholder_tool.from_unset",void 0,this.hass):o("placeholder_tool.from_variables",void 0,this.hass):a?o("placeholder_tool.from_refused",void 0,this.hass):"";return e`<tr class=${a?"bad":""}>
      <td class="code">${t.step}</td>
      <td class="code ${a?"bad":r?"gap":""}">
        <span class="value"
          >${r&&!a?o("placeholder_tool.nothing",void 0,this.hass):this._shown(t.value,t.kind)}</span
        >
      </td>
      <td class="from">${l}</td>
    </tr>`}_shown(e,t){return"removed"===t?o("placeholder_tool.removed",void 0,this.hass):void 0===e?"":"string"==typeof e?e:JSON.stringify(e)}_picked(e){e.stopPropagation();const t=e.detail.value.placeholder;this._expression="string"==typeof t?t:""}_addStep(e,t){let i=e.trim()||"[[]]";const s=i.endsWith("?]]");i=i.replace(/\??\]\]$/,"");const o=i.slice(2),n=""===o?t:`${o}|${t}`;this._expression=`[[${n}${s?"?":""}]]`}}h([p({attribute:!1})],Gl.prototype,"hass",void 0),h([p({attribute:!1})],Gl.prototype,"lovelace",void 0),h([p({attribute:!1})],Gl.prototype,"config",void 0),h([u()],Gl.prototype,"_expression",void 0),h([u()],Gl.prototype,"_more",void 0);const Ql="decluttering-placeholder-tool";customElements.get(Ql)||customElements.define(Ql,Gl);const Xl="https://tempus2016.github.io/decluttering-card-plus/",ed=`${Xl}help-index.json`,td={template:"Defining-Templates.html",type:"Defining-Templates.html",description:"Defining-Templates.html",category:"Defining-Templates.html",variables:"Describing-Variables.html",default:"Variables.html",defaults:"Variables.html",let:"Variables.html",extends:"Defining-Templates.html",examples:"Describing-Variables.html",for_each:"Repeating-a-Template.html",for_each_from:"Repeating-a-Template.html",columns:"Repeating-a-Template.html",min_column_width:"Repeating-a-Template.html",gap:"Styling.html",empty:"Repeating-a-Template.html",lazy:"Repeating-a-Template.html",style:"Styling.html",grid_options:"Styling.html",on_error:"Using-Templates.html",rebuild_on:"Using-Templates.html",debug:"Troubleshooting.html",strict:"Using-Templates.html",fit:"Styling.html",group:"Cards.html",publish:"Using-Templates.html",suggest_for:"Using-Templates.html",visibility:"Visibility.html"};let id;function sd(e=fetch){return null!=id||(id=e(ed,{cache:"force-cache"}).then(async e=>{if(!e.ok)return{};return function(e){const t={};if(!e||"object"!=typeof e)return t;for(const[i,s]of Object.entries(e)){if(!s||"object"!=typeof s)continue;const e=s;"string"==typeof e.page&&"string"==typeof e.text&&"string"==typeof e.url&&(e.url.startsWith(Xl)&&(t[i]=Object.assign(Object.assign({key:i,page:e.page,heading:"string"==typeof e.heading?e.heading:"",text:e.text},"string"==typeof e.yaml?{yaml:e.yaml}:{}),{url:e.url})))}return t}(await e.json())}).catch(()=>({}))),id}class od extends m{constructor(){super(...arguments),this.key="",this._open=!1,this._loaded=!1}static get styles(){return f`
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
        aria-label=${o("help.button",{key:this.key},this.hass)}
        title=${o("help.button",{key:this.key},this.hass)}
        @click=${this._toggle}
        @keydown=${this._keydown}
      >
        ?
      </button>
      ${this._open?this._renderPop():Qe}
    `}_renderPop(){var t;const i=this._entry,s=null!==(t=null==i?void 0:i.url)&&void 0!==t?t:function(e){var t;return Xl+(null!==(t=td[e])&&void 0!==t?t:"Configuration-Reference.html")}(this.key);return e`
      <div class="pop" role="dialog" @keydown=${this._keydown}>
        ${i?e`
                <h5>${i.page}${i.heading?` · ${i.heading}`:""}</h5>
                <p>${i.text}</p>
                ${i.yaml?e`<pre>${i.yaml}</pre>`:Qe}
              `:e`<p>
                ${o(this._loaded?"help.not_in_index":"help.loading",{key:this.key},this.hass)}
              </p>`}
        <div class="foot">
          <a href=${s} target="_blank" rel="noopener noreferrer"
            >${o("help.open_page",void 0,this.hass)}</a
          >
          <span class="esc">${o("help.esc",void 0,this.hass)}</span>
        </div>
      </div>
    `}async _toggle(){this._open=!this._open,this._open&&!this._loaded&&(this._entry=await async function(e,t){return(await sd(t))[e]}(this.key),this._loaded=!0)}_keydown(e){"Escape"===e.key&&this._open&&(e.stopPropagation(),this._open=!1)}}h([p({attribute:!1})],od.prototype,"hass",void 0),h([p()],od.prototype,"key",void 0),h([u()],od.prototype,"_open",void 0),h([u()],od.prototype,"_entry",void 0),h([u()],od.prototype,"_loaded",void 0);const nd="decluttering-help";customElements.get(nd)||customElements.define(nd,od);const ad=[0,100,300,1e3,2500];function rd(e,t){let i,s=!1;const o=new Set,n=()=>{for(const e of o)clearTimeout(e);o.clear();for(const e of ad){const i=setTimeout(()=>{o.delete(i),s||t()},e);o.add(i)}},a=()=>{if(s)return;const t=e.shadowRoot;if(null==i||i.disconnect(),i=new MutationObserver(n),i.observe(null!=t?t:e,{childList:!0,subtree:!0,attributes:!0}),n(),!t){const t=e.localName;(t.includes("-")&&"undefined"!=typeof customElements?customElements.whenDefined(t):Promise.resolve()).then(()=>e.updateComplete).then(()=>{!s&&e.shadowRoot&&a()}).catch(()=>{})}};return a(),()=>{s=!0,null==i||i.disconnect(),i=void 0;for(const e of o)clearTimeout(e);o.clear()}}const ld=/^[A-Za-z0-9_-]+$/;function dd(e){var t,i;const s=[];let o=e;for(;o;){if(o instanceof Element&&"ha-selector"===o.localName){const e=null!==(t=o.name)&&void 0!==t?t:null===(i=o.schema)||void 0===i?void 0:i.name;"string"==typeof e&&e&&s.unshift(e)}o=o.parentNode instanceof ShadowRoot?o.parentNode.host:o.parentNode}return s.length?s:void 0}class cd extends m{constructor(){super(...arguments),this._fields=[],this._form={name:"",label:"",default:"",required:!1},this._reusing=!1,this._onMove=()=>{this._raf||(this._raf=requestAnimationFrame(()=>{this._raf=void 0,this._measure()}))}}static get styles(){return f`
      :host {
        display: contents;
      }
      .origin {
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        pointer-events: none;
      }
      .btn {
        position: fixed;
        z-index: 900;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 0;
        background: transparent;
        color: var(--secondary-text-color);
        font-size: 18px;
        line-height: 28px;
        cursor: pointer;
        padding: 0;
        opacity: 0.6;
      }
      .btn:hover,
      .btn:focus-visible {
        opacity: 1;
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      }
      .menu,
      .dialog {
        position: fixed;
        z-index: 1000;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        font-size: 0.9em;
      }
      .menu {
        min-width: 220px;
        padding: 4px 0;
      }
      .menu div {
        display: flex;
        gap: 12px;
        padding: 8px 14px;
        cursor: pointer;
      }
      .menu div:hover {
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      }
      .menu div small {
        margin-left: auto;
        color: var(--secondary-text-color);
      }
      .menu .sub {
        padding-left: 28px;
        font-family: var(--ha-font-family-code, monospace);
      }
      .dialog {
        width: min(380px, 90vw);
        padding: 16px;
      }
      .dialog h4 {
        margin: 0 0 8px;
        font-size: 1.05em;
        font-weight: 500;
      }
      .dialog p {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
      }
      .dialog .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 8px;
      }
      ha-alert {
        display: block;
        margin: 8px 0;
      }
    `}updated(e){super.updated(e),e.has("target")&&this._watch(),e.has("config")&&this._measure()}connectedCallback(){super.connectedCallback(),window.addEventListener("scroll",this._onMove,!0),window.addEventListener("resize",this._onMove)}disconnectedCallback(){var e;super.disconnectedCallback(),window.removeEventListener("scroll",this._onMove,!0),window.removeEventListener("resize",this._onMove),null===(e=this._stopWatching)||void 0===e||e.call(this),this._stopWatching=void 0,this._raf&&cancelAnimationFrame(this._raf)}_watch(){var e;null===(e=this._stopWatching)||void 0===e||e.call(this),this._stopWatching=void 0;const t=this.target;t?this._stopWatching=rd(t,()=>this._measure()):this._fields=[]}_measure(){var e,t,i,s;const o=this.target,n=this.config;if(!o||!n)return void(this._fields=[]);const a=null===(e=this.renderRoot.querySelector(".origin"))||void 0===e?void 0:e.getBoundingClientRect(),r=null!==(t=null==a?void 0:a.left)&&void 0!==t?t:0,l=null!==(i=null==a?void 0:a.top)&&void 0!==i?i:0,d=[];for(const c of function*(e){var t;const i=[e];for(;i.length;){const e=i.shift();for(const s of[...null!==(t=e.children)&&void 0!==t?t:[]])"ha-selector"===s.localName&&(yield s),s.shadowRoot&&i.push(s.shadowRoot),i.push(s)}}(null!==(s=o.shadowRoot)&&void 0!==s?s:o)){if(c.selector&&"expandable"in c.selector)continue;const e=dd(c);if(!e)continue;const t=po(n,e);if(null==t||"object"==typeof t)continue;if("string"==typeof t&&/\[\[/.test(t))continue;const i=c.getBoundingClientRect();i.width&&i.height&&d.push({element:c,path:e,value:t,label:e.map(e=>"number"==typeof e?`#${e+1}`:e).join(" › "),top:i.top-l,left:i.left-r,width:i.width,height:i.height})}this._fields=d,this._menuFor&&!d.some(e=>{var t;return e.element===(null===(t=this._menuFor)||void 0===t?void 0:t.element)})&&(this._menuFor=void 0)}render(){return e`
      <span class="origin"></span>
      ${this._fields.map(t=>e`
          <button
            class="btn"
            style="top: ${t.top+4}px; left: ${t.left+t.width-32}px"
            title=${o("field_menu.button",{field:t.label},this.hass)}
            aria-label=${o("field_menu.button",{field:t.label},this.hass)}
            @click=${()=>this._openMenu(t)}
          >
            ⋮
          </button>
        `)}
      ${this._menuFor?this._renderMenu(this._menuFor):Qe}
      ${this._dialogFor?this._renderDialog(this._dialogFor):Qe}
    `}_openMenu(e){var t;this._menuFor=(null===(t=this._menuFor)||void 0===t?void 0:t.element)===e.element?void 0:e,this._reusing=!1,this._dialogFor=void 0}_renderMenu(t){const i=L(this.config);return e`
      <div
        class="menu"
        role="menu"
        style="top: ${t.top+36}px; left: ${Math.max(8,t.left+t.width-240)}px"
      >
        <div role="menuitem" @click=${()=>this._startPromote(t)}>
          ${o("field_menu.make_variable",void 0,this.hass)}
        </div>
        ${i.length?e`<div
                role="menuitem"
                @click=${()=>{this._reusing=!this._reusing}}
              >
                ${o("field_menu.use_existing",void 0,this.hass)} <small>${i.length}</small>
              </div>`:Qe}
        ${this._reusing?i.map(i=>e`<div class="sub" role="menuitem" @click=${()=>this._reuse(t,i.name)}>
                    [[${i.name}]]
                  </div>`):Qe}
        <div role="menuitem" @click=${()=>{this._copy(t)}}>
          ${o("field_menu.copy_value",void 0,this.hass)}
        </div>
      </div>
    `}_startPromote(e){const t=e.path[e.path.length-1],i="string"==typeof t?t.replace(/[^A-Za-z0-9_-]/g,"_"):"value",s=new Set(L(this.config).map(e=>e.name));let o=i,n=2;for(;s.has(o);)o=`${i}_${n++}`;this._form={name:o,label:"string"==typeof t?t.replace(/_/g," ").replace(/^\w/,e=>e.toUpperCase()):"",default:String(e.value),required:!1},this._error=void 0,this._menuFor=void 0,this._dialogFor=e}_renderDialog(t){const i=[{name:"name",label:o("field_menu.name",void 0,this.hass),selector:{text:{}}},{name:"label",label:o("field_menu.label",void 0,this.hass),selector:{text:{}}},{name:"default",label:o("field_menu.default",void 0,this.hass),selector:{text:{}}},{name:"required",label:o("field_menu.required",void 0,this.hass),selector:{boolean:{}}}];return e`
      <div
        class="dialog"
        role="dialog"
        style="top: ${Math.min(t.top+36,window.innerHeight-360)}px; left: ${Math.max(8,t.left+t.width-380)}px"
      >
        <h4>${o("field_menu.dialog_title",{field:t.label},this.hass)}</h4>
        <ha-form
          .hass=${this.hass}
          .data=${this._form}
          .schema=${i}
          .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
          @value-changed=${e=>{e.stopPropagation(),this._form=Object.assign(Object.assign({},this._form),e.detail.value),this._error=this._checkName(this._form.name)}}
        ></ha-form>
        <p>${o("field_menu.dialog_hint",{name:this._form.name||"…"},this.hass)}</p>
        ${this._error?e`<ha-alert alert-type="error">${this._error}</ha-alert>`:Qe}
        <div class="actions">
          <ha-button
            appearance="plain"
            @click=${()=>{this._dialogFor=void 0}}
            >${o("field_menu.cancel",void 0,this.hass)}</ha-button
          >
          <ha-button .disabled=${!!this._error||!this._form.name} @click=${()=>this._promote(t)}>
            ${o("field_menu.make",void 0,this.hass)}
          </ha-button>
        </div>
      </div>
    `}_checkName(e){if(e)return ld.test(e)?L(this.config).some(t=>t.name===e)?o("template_editor.promote_name_taken",{name:e},this.hass):void 0:o("template_editor.promote_name_invalid",void 0,this.hass)}_promote(e){const t=this.config;if(!t)return;const{name:i,label:s,required:n}=this._form,a=this._form.default,r=a===String(e.value)?void 0:"number"!=typeof e.value||Number.isNaN(Number(a))?"boolean"==typeof e.value?"true"===a.trim().toLowerCase():a:Number(a),l=function(e,t,i,s){const o=ho(e,t,i);if(!o.ok)return o;const n=De(o.template.variables),a=n.findIndex(e=>(null==e?void 0:e.name)===i);if(-1===a)return o;const r=Object.assign({},n[a]);s.label&&(r.label=s.label),s.required&&(r.required=!0),s.description&&(r.description=s.description),void 0!==s.default&&(r.default=s.default);const l=Array.isArray(o.template.variables)?n.map((e,t)=>t===a?r:e):Object.assign(Object.assign({},o.template.variables),{[i]:uo(r)});return{ok:!0,template:Object.assign(Object.assign({},o.template),{variables:l})}}(t,e.path,i,{label:s||void 0,required:n,default:r});l.ok?(this._dialogFor=void 0,g(this,"config-changed",{config:l.template})):this._error=o(`template_editor.promote_${l.error}`,{name:i},this.hass)}_reuse(e,t){const i=this.config;if(!i)return;const s=function(e,t,i){if(!io.test(i))return{ok:!1,error:"name_invalid"};const s=oo(e),o=s?co(e[s],t):void 0;return s&&null!=o&&"object"!=typeof o?{ok:!0,template:Object.assign(Object.assign({},e),{[s]:lo(e[s],t,`[[${i}]]`)})}:{ok:!1,error:"gone"}}(i,e.path,t);this._menuFor=void 0,s.ok&&g(this,"config-changed",{config:s.template})}async _copy(e){this._menuFor=void 0,await te(String(e.value))}}h([p({attribute:!1})],cd.prototype,"hass",void 0),h([p({attribute:!1})],cd.prototype,"config",void 0),h([p({attribute:!1})],cd.prototype,"target",void 0),h([u()],cd.prototype,"_fields",void 0),h([u()],cd.prototype,"_menuFor",void 0),h([u()],cd.prototype,"_dialogFor",void 0),h([u()],cd.prototype,"_form",void 0),h([u()],cd.prototype,"_error",void 0),h([u()],cd.prototype,"_reusing",void 0);const hd="decluttering-field-menus";customElements.get(hd)||customElements.define(hd,cd);const pd="[^[\\]]",ud=new RegExp(`\\[\\[(?:${pd}|${`\\[\\[(?:${pd}|${`\\[\\[${pd}*\\]\\]`})*\\]\\]`})*\\]\\]`,"g");function md(e,t){const i=[];let s;for(ud.lastIndex=0;null!==(s=ud.exec(e));){const e=s[0];if(e.startsWith("[[!"))continue;const{kind:o,message:n}=t(e);i.push({from:s.index,to:s.index+e.length,kind:o,text:e,message:n})}return i}const fd=vt.map(e=>`${e}:`),gd=["default:","if:","slug","friendly_name","area","bool","upper","lower","title","replace:"];function vd(e,t,i){const s=e.slice(0,t),o=s.lastIndexOf("[[");if(-1===o)return null;const n=s.slice(o+2);if(n.includes("]]")||n.includes("\n"))return null;const a=n.lastIndexOf("|");if(-1===a){if(!/^[\w.-]*$/.test(n))return null;const e=n.toLowerCase(),t=[...i.variables.map(e=>({label:e.name,detail:_d(e)})),...i.lets.map(e=>({label:e,detail:"let"})),...i.shared.filter(e=>!i.variables.some(t=>t.name===e.name)).map(e=>({label:e.name,detail:"dashboard"}))].filter(t=>t.label.toLowerCase().startsWith(e));return t.length?{from:o+2,heading:"variables",options:t}:null}const r=n.slice(a+1),l=r.indexOf(":");if(-1!==l){const e=r.slice(0,l),t=r.slice(l+1),i=function(e){switch(e){case"if":return["other","!other","mode=on","mode!=off"];case"round":return["0","1","2"];case"switch":return["on=green,off=grey,default=amber"];default:return[]}}(e).filter(e=>e.startsWith(t));return i.length?{from:o+2+a+1+l+1,heading:"values",options:i.map(e=>({label:e}))}:null}if(!/^[\w-]*$/.test(r))return null;const d=r.toLowerCase(),c=function(){const e=[...gt,...fd],t=e.filter(e=>!gd.includes(e)).sort();return[...gd.filter(t=>e.includes(t)),...t]}().filter(e=>e.toLowerCase().startsWith(d)).map(e=>({label:e,detail:i.sample&&e in yt?i.sample(e):void 0}));return c.length?{from:o+2+a+1,heading:"steps",options:c}:null}function _d(e){var t;const i=null!==(t=e.type)&&void 0!==t?t:e.selector&&"object"==typeof e.selector?Object.keys(e.selector)[0]:void 0;return`${null!=i?i:"any"}${e.required?", required":""}`}const yd=new WeakSet;class bd extends m{constructor(){super(...arguments),this._decorated=!1,this._selected=0,this._spans=[],this._tries=0}static get styles(){return f`
      :host {
        display: block;
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        font-size: 0.85em;
        color: var(--secondary-text-color);
        margin: 8px 0;
      }
      .legend i {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 3px;
        vertical-align: -1px;
        margin-right: 5px;
      }
      .legend .ok {
        background: color-mix(in srgb, var(--warning-color, #e39400) 40%, transparent);
      }
      .legend .unset {
        background: color-mix(in srgb, var(--secondary-text-color, #727272) 35%, transparent);
      }
      .legend .bad {
        background: color-mix(in srgb, var(--error-color, #db4437) 30%, transparent);
      }
      .pop {
        position: fixed;
        z-index: 1000;
        min-width: 220px;
        max-height: 260px;
        overflow: auto;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        padding: 4px 0;
        font-size: 0.9em;
      }
      .pop .hd {
        padding: 4px 14px 6px;
        font-size: 0.8em;
        color: var(--secondary-text-color);
        border-bottom: 1px solid var(--divider-color);
        margin-bottom: 2px;
      }
      .pop div.opt {
        display: flex;
        gap: 12px;
        padding: 6px 14px;
        cursor: pointer;
        font-family: var(--ha-font-family-code, monospace);
      }
      .pop div.opt.sel {
        background: color-mix(in srgb, var(--primary-color) 14%, transparent);
      }
      .pop div.opt small {
        margin-left: auto;
        color: var(--secondary-text-color);
        font-family: var(--ha-font-family, inherit);
      }
      pre.copy {
        margin: 0;
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.85em;
        white-space: pre-wrap;
        word-break: break-word;
      }
      pre.copy .dcp-ph {
        border-radius: 3px;
        padding: 0 1px;
      }
      pre.copy .dcp-ph-ok {
        background: color-mix(in srgb, var(--warning-color, #e39400) 22%, transparent);
      }
      pre.copy .dcp-ph-unset {
        background: color-mix(in srgb, var(--secondary-text-color, #727272) 18%, transparent);
      }
      pre.copy .dcp-ph-bad {
        background: color-mix(in srgb, var(--error-color, #db4437) 14%, transparent);
        text-decoration: underline wavy var(--error-color, #db4437);
      }
    `}updated(e){super.updated(e),e.has("target")&&this._watch(),(e.has("config")||e.has("hass"))&&this._refresh()}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopWatching)||void 0===e||e.call(this),this._stopWatching=void 0}_watch(){var e;null===(e=this._stopWatching)||void 0===e||e.call(this),this._stopWatching=void 0,this._editor=void 0,this._decorated=!1;const t=this.target;t&&(this._stopWatching=rd(t,()=>this._attach()))}_attach(){var e;const t=this.target;if(!t)return;const i=function(e,t){if(!e)return;const i=[e];for(e instanceof Element&&e.shadowRoot&&i.push(e.shadowRoot);i.length;){const e=i.shift(),s=e.querySelector(t);if(s)return s;for(const t of e.querySelectorAll("*"))t.shadowRoot&&i.push(t.shadowRoot)}}(null!==(e=t.shadowRoot)&&void 0!==e?e:t,"ha-code-editor");i?this._editor!==i&&(this._editor=i,this._tries=0,this._hookWhenReady(i)):this._editor&&(this._editor=void 0,this._completion=void 0)}_hookWhenReady(e){if(this._editor!==e)return;const t=e.codemirror;t?(yd.has(e)||(yd.add(e),this._decorate(e,t),e.addEventListener("keyup",e=>this._keyup(e)),e.addEventListener("click",()=>this._complete()),e.addEventListener("keydown",e=>this._keydown(e),!0),e.addEventListener("focusout",()=>setTimeout(()=>this._completion=void 0,150))),this._refresh()):this._tries++<40&&setTimeout(()=>this._hookWhenReady(e),100)}_resolved(){var e,t,i,s;const n=this.config;if(!n)return;const a=this.lovelace,r=null!==(e=P(a,void 0,n)[n.template])&&void 0!==e?e:n,l=null!==(t=_t(r,ut.get(n.template)))&&void 0!==t?t:c(Ee(r)),d=new Map;for(const c of $o(n,bo(r))){if("warning"!==c.level)continue;const e=null!==(s=null!==(i=c.params.name)&&void 0!==i?i:c.params.placeholder)&&void 0!==s?s:c.params.step;e&&d.set(e,o(c.key,c.params,this.hass)+(c.params.closest?o("error.did_you_mean",{closest:c.params.closest},this.hass):""))}return{template:r,variables:l,bad:d}}_judge(e,t){const i=e.slice(2).split(/[|?\]]/)[0];for(const[o,a]of t.bad)if(e.includes(o))return{kind:"bad",message:a};let s;try{s=Ul(t.template,t.variables,e,this.hass)}catch(n){return{kind:"unset"}}if("removed"===s.whole.kind)return{kind:"unset",message:o("code_hooks.unset_optional",{name:i},this.hass)};if("unresolved"===s.whole.kind||void 0===s.whole.value)return s.unset.length?{kind:"unset",message:o("code_hooks.unset",{name:s.unset.join(", ")},this.hass)}:{kind:"bad",message:o("code_hooks.left_as_written",void 0,this.hass)};return{kind:"ok",message:"string"==typeof s.whole.value?s.whole.value:JSON.stringify(s.whole.value)}}_refresh(){const e=this._editor,t=this._resolved(),i="string"==typeof(null==e?void 0:e.value)?e.value:"";this._spans=t?md(i,e=>this._judge(e,t)):[];const s=null==e?void 0:e.codemirror;if(s&&this._decorated)try{s.dispatch({})}catch(o){}}_decorate(e,t){var i;const{Decoration:s,ViewPlugin:o,StateEffect:n}=function(e,t){var i,s,o,n,a,r;let l,d=null==e?void 0:e.StateEffect,c=null==e?void 0:e.ViewPlugin,h=null==e?void 0:e.Decoration;try{if(!d&&(null===(i=null==e?void 0:e.langCompartment)||void 0===i?void 0:i.reconfigure)){const t=e.langCompartment.reconfigure([]);(null===(s=null==t?void 0:t.constructor)||void 0===s?void 0:s.appendConfig)&&(d=t.constructor)}}catch(p){}try{l=null===(o=null==e?void 0:e.highlightActiveLine)||void 0===o?void 0:o.call(e),!c&&(null===(n=null==l?void 0:l.constructor)||void 0===n?void 0:n.fromClass)&&(c=l.constructor)}catch(u){}try{if(!h&&l&&(null==t?void 0:t.plugin)){const e=t.plugin(l);let i;null===(r=null===(a=null==e?void 0:e.decorations)||void 0===a?void 0:a.between)||void 0===r||r.call(a,0,t.state.doc.length,(e,t,s)=>(i=s,!1));const s=i?Object.getPrototypeOf(i.constructor):void 0;(null==s?void 0:s.mark)&&(null==s?void 0:s.set)&&(h=s)}}catch(m){}return{Decoration:h,ViewPlugin:c,StateEffect:d}}(e._loadedCodeMirror,t);if(!s||!o||!n)return;const a=e=>{const t=this._resolved();if(!t)return s.none;const i=md(e.state.doc.toString(),e=>this._judge(e,t));return this._spans=i,s.set(i.map(e=>s.mark({class:`dcp-ph dcp-ph-${e.kind}`,attributes:e.message?{title:e.message}:void 0}).range(e.from,e.to)),!0)},r=o.fromClass(class{constructor(e){this.decorations=a(e)}update(e){this.decorations=a(e.view)}},{decorations:e=>e.decorations});try{t.dispatch({effects:n.appendConfig.of([r])});const s=document.createElement("style");s.textContent="\n  .dcp-ph { border-radius: 3px; padding: 0 1px; }\n  .dcp-ph-ok { background: color-mix(in srgb, var(--warning-color, #e39400) 22%, transparent); }\n  .dcp-ph-unset { background: color-mix(in srgb, var(--secondary-text-color, #727272) 18%, transparent); }\n  .dcp-ph-bad { background: color-mix(in srgb, var(--error-color, #db4437) 14%, transparent); text-decoration: underline wavy var(--error-color, #db4437); }\n",(null!==(i=e.shadowRoot)&&void 0!==i?i:e).appendChild(s),this._decorated=!0}catch(l){this._decorated=!1}}_keyup(e){["ArrowDown","ArrowUp","Enter","Tab","Escape"].includes(e.key)||this._complete()}_complete(){var e,t,i,s;const o=null===(e=this._editor)||void 0===e?void 0:e.codemirror,n=this.config;if(!o||!n)return;const a=o.state.doc.toString(),r=o.state.selection.main.head,l=null!==(t=P(this.lovelace,void 0,n)[n.template])&&void 0!==t?t:n,d=c(l.let).map(U).filter(e=>void 0!==e),h=this._sampleEntity(l),p=vd(a,r,{variables:L(n),lets:d,shared:bt(this.lovelace),sample:h?e=>{var i;try{return null===(i=yt[e])||void 0===i?void 0:i.call(yt,h,this.hass)}catch(t){return}}:void 0});if(!p)return void(this._completion=void 0);const u=o.coordsAtPos(r);this._completion=Object.assign(Object.assign({},p),{x:null!==(i=null==u?void 0:u.left)&&void 0!==i?i:0,y:null!==(s=null==u?void 0:u.bottom)&&void 0!==s?s:0,pos:r}),this._selected=0}_sampleEntity(e){var t,i,s,o;const n=ut.get(null!==(i=null===(t=this.config)||void 0===t?void 0:t.template)&&void 0!==i?i:""),a=[...null!==(s=_t(e,n))&&void 0!==s?s:[],...void 0===n&&null!==(o=q(e)[0])&&void 0!==o?o:[],...c(Ee(e))];for(const r of a){const e=Object.values(r)[0];if("string"==typeof e&&/^[a-z_]+\.[a-z0-9_]+$/.test(e))return e}}_keydown(e){const t=this._completion;if(t){if("ArrowDown"===e.key)this._selected=(this._selected+1)%t.options.length;else if("ArrowUp"===e.key)this._selected=(this._selected-1+t.options.length)%t.options.length;else if("Enter"===e.key||"Tab"===e.key)this._accept(this._selected);else{if("Escape"!==e.key)return;this._completion=void 0}e.preventDefault(),e.stopPropagation()}}_accept(e){var t,i;const s=this._completion,o=null===(t=this._editor)||void 0===t?void 0:t.codemirror;if(!s||!o)return;const n=s.options[e];if(!n)return;const a=null!==(i=n.insert)&&void 0!==i?i:n.label;try{o.dispatch({changes:{from:s.from,to:s.pos,insert:a},selection:{anchor:s.from+a.length}}),o.focus()}catch(r){}this._completion=void 0}render(){return this._editor?e`
      <div class="legend">
        <span><i class="ok"></i>${o("code_hooks.legend_ok",void 0,this.hass)}</span>
        <span><i class="unset"></i>${o("code_hooks.legend_unset",void 0,this.hass)}</span>
        <span><i class="bad"></i>${o("code_hooks.legend_bad",void 0,this.hass)}</span>
        <span>${o("code_hooks.legend_hint",void 0,this.hass)}</span>
      </div>
      ${this._decorated?Qe:this._renderCopy()}
      ${this._completion?this._renderPop(this._completion):Qe}
    `:e``}_renderCopy(){var t,i;const s="string"==typeof(null===(t=this._editor)||void 0===t?void 0:t.value)?this._editor.value:"";if(!s)return e``;const o=[];let n=0;for(const a of this._spans)o.push(s.slice(n,a.from)),o.push(e`<span class="dcp-ph dcp-ph-${a.kind}" title=${null!==(i=a.message)&&void 0!==i?i:""}>${a.text}</span>`),n=a.to;return o.push(s.slice(n)),e`<pre class="copy">${o}</pre>`}_renderPop(t){var i,s;return e`
      <div class="pop" style="left: ${t.x}px; top: ${t.y+4}px" role="listbox">
        <div class="hd">
          ${o(`code_hooks.heading_${t.heading}`,{template:null!==(s=null===(i=this.config)||void 0===i?void 0:i.template)&&void 0!==s?s:""},this.hass)}
        </div>
        ${t.options.slice(0,40).map((t,i)=>e`
            <div
              class="opt ${i===this._selected?"sel":""}"
              role="option"
              aria-selected=${i===this._selected}
              @mousedown=${e=>{e.preventDefault(),this._accept(i)}}
            >
              ${t.label} ${t.detail?e`<small>${t.detail}</small>`:Qe}
            </div>
          `)}
      </div>
    `}}h([p({attribute:!1})],bd.prototype,"hass",void 0),h([p({attribute:!1})],bd.prototype,"lovelace",void 0),h([p({attribute:!1})],bd.prototype,"config",void 0),h([p({attribute:!1})],bd.prototype,"target",void 0),h([u()],bd.prototype,"_editor",void 0),h([u()],bd.prototype,"_decorated",void 0),h([u()],bd.prototype,"_completion",void 0),h([u()],bd.prototype,"_selected",void 0),h([u()],bd.prototype,"_spans",void 0);const $d="decluttering-code-hooks";customElements.get($d)||customElements.define($d,bd);const wd=["card","badge","row","element"];function xd(e,t,i=[]){if(Array.isArray(e))e.forEach((e,s)=>xd(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,o]of Object.entries(e))xd(o,t?`${t}.${s}`:s,i);else null!=e&&i.push({path:t,value:String(e)});return i}const kd=["grid_options","visibility","view_layout","layout_options"];function jd(e){const t={};for(const[i,s]of Object.entries(null!=e?e:{}))kd.includes(i)||(t[i]=s);return t}function Ad(e){if(Array.isArray(e))return e.map(Ad);if(e&&"object"==typeof e){const t={};for(const i of Object.keys(e).sort())t[i]=Ad(e[i]);return t}return 0}function Sd(e,t=[],i=[]){if(Array.isArray(e))e.forEach((e,s)=>Sd(e,[...t,s],i));else if(e&&"object"==typeof e)for(const[s,o]of Object.entries(e))Sd(o,[...t,s],i);else i.push({path:t,value:e});return i}function Od(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}function Cd(e){const t=new Map;e.forEach((e,i)=>{var s;if(!e||"object"!=typeof e||"string"!=typeof e.type)return;const o=jd(e);if(JSON.stringify(o).includes("[["))return;const n=JSON.stringify([e.type,Ad(o)]);t.set(n,[...null!==(s=t.get(n))&&void 0!==s?s:[],i])});const i=[];for(const[s,o]of t){if(o.length<2)continue;const t=o.map(t=>jd(e[t])),n=Sd(t[0]).map(e=>e.path).filter(e=>t.some(i=>JSON.stringify(Od(i,e))!==JSON.stringify(Od(t[0],e))));!n.length||n.length>8||i.push({indices:o,type:e[o[0]].type,differing:n,key:s})}return i.sort((e,t)=>t.indices.length-e.indices.length||e.indices[0]-t.indices[0])}const Ed=e=>e.replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value";function Td(e){const t=e[e.length-1];if("string"==typeof t)return Ed(t);const i=[...e].reverse().find(e=>"string"==typeof e);return Ed(`${null!=i?i:"item"}_${t+1}`)}function Pd(e){const t=e.map(Td),i=[];return e.forEach((e,s)=>{const o=(n=t[s],t.filter(e=>e===n).length>1?function(e){return Ed(e.map(e=>"number"==typeof e?String(e+1):e).join("_"))}(e):t[s]);var n;i.push(Qs(o,i))}),i}function Nd(e){var t;const i=e.map(jd),s=null!==(t=i[0])&&void 0!==t?t:{},o=Sd(s).map(e=>e.path).filter(e=>i.some(t=>JSON.stringify(Od(t,e))!==JSON.stringify(Od(s,e)))),n=Pd(o),a=JSON.parse(JSON.stringify(s));return o.forEach((e,t)=>{Od(a,e.slice(0,-1))[e[e.length-1]]=`[[${n[t]}]]`}),{template:{card:a},names:n,variables:i.map(e=>o.map((t,i)=>({[n[i]]:Od(e,t)}))),layout:e.map(e=>{const t={};for(const i of kd)void 0!==(null==e?void 0:e[i])&&(t[i]=e[i]);return t})}}function Ld(e,t,i){return Object.assign({type:"custom:decluttering-card-plus",template:e,variables:t},i)}const Id="_";function Fd(e){let t="string"==typeof e?e:JSON.stringify(e);if("string"!=typeof t||!t.includes("[["))return[];const i=new Set;for(let s=0;s<5;s+=1){let e=!1;if(t=t.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(t,s)=>{if(e=!0,s.startsWith(Ue))return Id;const o=s.endsWith("?")?s.slice(0,-1):s,[n,...a]=o.split("|"),r=n.endsWith("?")?n.slice(0,-1):n;if(void 0===Be(r))for(const e of[r,r.split(".")[0]])e&&e!==Id&&i.add(e);for(const e of a){const t=e.startsWith("or:")?Ye(e):We(e);t&&t!==Id&&i.add(t)}return Id}),!e)break}return[...i]}function Md(e,t=[]){if(Array.isArray(e)){for(const i of e)Md(i,t);return t}if(!e||"object"!=typeof e)return t;Ve.includes(e.type)&&!0===e[kt]&&"string"==typeof e.template&&t.push(e.template);for(const i of Object.values(e))Md(i,t);return t}function Vd(e,t,i=new Set){const s=new Set;if(!e)return{names:s,complete:!0};Le in e&&(e=Object.assign(Object.assign({},e),{default:e[Le]}));for(const n of L(e))s.add(n.name);for(const n of c(Ee(e))){const e=U(n);void 0!==e&&s.add(e)}for(const n of Fd(e))s.add(n);let o=!0;for(const n of Md(e)){if(i.has(n))continue;if(i.add(n),!Object.prototype.hasOwnProperty.call(t,n)){o=!1;continue}const e=Vd(t[n],t,i);for(const t of e.names)s.add(t);e.complete||(o=!1)}return{names:s,complete:o}}function qd(e,t){const i=new Map,s=(e,t,s,o)=>{const n=JSON.stringify([e.index,t,o.name,s]),a=i.get(n);a?(a.count+=1,!a.closest&&o.closest&&(a.closest=o.closest)):i.set(n,Object.assign(Object.assign({view:e,template:t,name:o.name},o.closest?{closest:o.closest}:{}),{where:s,count:1}))},o=(e,i,a)=>{var r,l;if(Array.isArray(e))for(const t of e)o(t,i,a);else if(e&&"object"==typeof e){if(Ve.includes(e.type)&&"string"==typeof e.template){const o=Object.prototype.hasOwnProperty.call(t,e.template)?t[e.template]:void 0;if(o){const d=new Set,h=(r,l)=>{for(const h of function(e,t,i,s={lets:[],defaults:[]},o){if(!e)return[];const{names:a,complete:r}=Vd(e,t);if(!r)return[];const l=new Set([...c(e.let),...s.lets].map(U).filter(e=>void 0!==e)),d=D(i),h=new Set(a);for(const n of Fd(o))h.add(n);for(const n of[...s.lets,...s.defaults]){const e=U(n);if(void 0!==e)for(const t of Fd(n[e]))h.add(t)}const p=e=>!l.has(e)&&(h.has(e)||h.has(e.split(".")[0]));let u=!0;const m=new Set;for(;u;){u=!1;for(const e of d){const t=U(e);if(!m.has(t)&&p(t)){m.add(t);for(const i of Fd(e[t]))h.has(i)||(h.add(i),u=!0)}}}const f=new Set(d.map(e=>U(e))),g=[...h].filter(e=>!f.has(e)&&!l.has(e)),v=[];for(const c of f){if(p(c))continue;const e=n(c,g);v.push(e?{name:c,closest:e}:{name:c})}return v}(o,t,l,a,[e.on_error,e.for_each_from]))d.has(h.name)||(d.add(h.name),s(i,e.template,r,h))};h("variables",e.variables);for(const t of null!==(r=B(e.for_each))&&void 0!==r?r:[])h("for_each",t);const p=null===(l=e.for_each_from)||void 0===l?void 0:l.overrides;if(p&&"object"==typeof p)for(const e of Object.values(p))h("overrides",e)}}for(const t of Object.values(e))o(t,i,a)}};return wt(e,(t,i,s)=>{var n,a,r;const l=e.views[i];o(t,{title:null!==(a=null!==(n=null==l?void 0:l.title)&&void 0!==n?n:null==l?void 0:l.path)&&void 0!==a?a:"",path:null!==(r=null==l?void 0:l.path)&&void 0!==r?r:"",index:i},xt(e,i,s))}),[...i.values()].map(({view:e,template:t,name:i,closest:s,where:o,count:n})=>s?{view:e,template:t,name:i,closest:s,where:o,count:n}:{view:e,template:t,name:i,where:o,count:n})}function Dd(e,t,i){if(!e.includes("[["))return e;const s=e.replace(/\[\[([^[\]]+)\]\]/g,(e,s)=>s.startsWith(Ue)?e:`[[${function(e,t,i){const s=e.endsWith("?"),o=(s?e.slice(0,-1):e).split("|"),n=o[0],a=n.endsWith("?"),r=a?n.slice(0,-1):n;(r===t||r.startsWith(`${t}.`))&&(o[0]=`${i}${r.slice(t.length)}${a?"?":""}`);for(let l=1;l<o.length;l+=1){const e=o[l];if(e===`or:${t}`)o[l]=`or:${i}`;else if(We(e)===t){const s=e.startsWith("if:!")?"!":"";o[l]=`if:${s}${i}${e.slice(3+s.length+t.length)}`}}return`${o.join("|")}${s?"?":""}`}(s,t,i)}]]`);return s.replace(new RegExp(`\\[\\[${o=t,o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=\\.\\[\\[)`,"g"),`[[${i}`);var o}function Hd(e,t,i){if("string"==typeof e)return Dd(e,t,i);if(Array.isArray(e))return e.map(e=>Hd(e,t,i));if(e&&"object"==typeof e){const s={};for(const[o,n]of Object.entries(e))s[Dd(o,t,i)]=Hd(n,t,i);return s}return e}function Rd(e,t,i){const s=e=>!!e&&"object"==typeof e&&!Array.isArray(e),o=(e,t)=>s(e)&&Object.prototype.hasOwnProperty.call(e,t),n=e=>{if(!s(e))return e;const o={};for(const[s,n]of Object.entries(e))s!==i&&(o[s===t?i:s]=n);return o};return Array.isArray(e)?e.some(e=>o(e,t))?e.map(n).filter(e=>!s(e)||Object.keys(e).length>0):e:o(e,t)?n(e):e}function zd(e,t,i){const s=Hd(e,t,i);return Array.isArray(s.variables)?s.variables=s.variables.map(e=>e&&"object"==typeof e&&e.name===t?Object.assign(Object.assign({},e),{name:i}):e):s.variables&&"object"==typeof s.variables&&(s.variables=Rd(s.variables,t,i)),void 0!==s.default&&(s.default=Rd(s.default,t,i)),void 0!==s.defaults&&(s.defaults=Rd(s.defaults,t,i)),void 0!==s.let&&(s.let=Rd(s.let,t,i)),s}function Wd(e){const t=null==e?void 0:e.extends;return(Array.isArray(t)?t:[t]).filter(e=>"string"==typeof e)}function Ud(e,t,i){const s=$t(e),o=new Set([t]);for(const a of null!=i?i:[])Object.prototype.hasOwnProperty.call(s,a)||o.add(a);let n=!0;for(;n;){n=!1;for(const[e,t]of Object.entries(s))!o.has(e)&&Wd(t).some(e=>o.has(e))&&(o.add(e),n=!0)}return o}function Bd(e){if(!e)return[];const t=new Set(bo(e));for(const i of Fd(e))i.includes(".")||"_"===i||t.add(i);return[...t].sort()}function Kd(e,t,i,s,o){const n=Ud(e,t,o);let a=0,r=0;const l=(e,t)=>JSON.stringify(e)!==JSON.stringify(t),d=e=>{if(Array.isArray(e))return e.map(d);if(!e||"object"!=typeof e)return e;let t={};for(const[i,s]of Object.entries(e))t[i]=d(s);if(Ve.includes(e.type)&&n.has(e.template)){const e=function(e,t,i){var s;const o=Object.assign({},e);void 0!==o.variables&&(o.variables=Rd(o.variables,t,i)),Array.isArray(o.for_each)?o.for_each=o.for_each.map(e=>Rd(e,t,i)):void 0!==o.for_each&&(o.for_each=Rd(o.for_each,t,i));const n=null===(s=o.for_each_from)||void 0===s?void 0:s.overrides;if(n&&"object"==typeof n&&!Array.isArray(n)){const e={};for(const[s,o]of Object.entries(n))e[s]=Rd(o,t,i);o.for_each_from=Object.assign(Object.assign({},o.for_each_from),{overrides:e})}return"string"==typeof o.name&&(o.name=Dd(o.name,t,i)),o}(t,i,s);l(e,t)&&(a+=1),t=e}if(v(e.type)&&n.has(e.template)){const e=zd(t,i,s);l(e,t)&&(r+=1),t=e}return t},c=Object.assign({},e);Array.isArray(null==e?void 0:e.views)&&(c.views=d(e.views));const h=null==e?void 0:e.decluttering_templates;if(h&&"object"==typeof h){const e={};for(const[t,o]of Object.entries(h)){let a=d(o);if(n.has(t)){const e=zd(a,i,s);l(e,a)&&(r+=1),a=e}e[t]=a}c.decluttering_templates=e}return{config:c,cards:a,templates:r}}function Jd(e,t,i){if(Object.prototype.hasOwnProperty.call($t(e),t))return!1;if(i===jt)return!0;const s=At(e);return s.includes(i)||s.includes("*")}class Yd extends m{constructor(){super(...arguments),this._renameTo="",this._renaming=!1,this._duplicateTo="",this._busy=!1,this._modernisePending=!1,this._similarNames={},this._searchQuery="",this._searching=!1,this._varTo=""}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=w())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:T()}static get styles(){return wo}_fireConfigChanged(e){g(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return rs(this,e,t,i)}render(){return this.hass&&this._config?this._renderUsages():e``}_renderUsages(){var t,i;const s=null===(t=this._config)||void 0===t?void 0:t.template;if(!s)return e``;const n=this._savedLovelace;if(!n)return e`<div class="usages">
        <ha-alert alert-type="warning">${o("template_editor.usages_unreadable",void 0,this.hass)}</ha-alert>
      </div>`;(null===(i=this._usages)||void 0===i?void 0:i.name)===s&&this._usages.ll===n||(this._usages={name:s,ll:n,usages:St(n,s)});const{views:a,templates:r}=this._usages.usages,l=a.reduce((e,t)=>e+t.count,0),d=document.location.pathname.split("/").slice(0,2).join("/");return e`
      <div class="usages">
        ${0!==l||r.length?e`
                <p class="hint">
                  ${o(1===l?"template_editor.usages_one":"template_editor.usages_many",{total:l,name:s},this.hass)}
                </p>
                <ul>
                  ${a.map(t=>e`
                      <li>
                        <a href=${`${d}/${t.path||t.index}`} target="_blank" rel="noreferrer">
                          ${t.title||t.path||o("template_editor.untitled_view",void 0,this.hass)}
                        </a>
                        —
                        ${1===t.count?o("template_editor.used_once",void 0,this.hass):o("template_editor.used_times",{count:t.count},this.hass)}
                      </li>
                    `)}
                </ul>
              `:e`<ha-alert alert-type="info">
                ${o("template_editor.usages_none",{name:s},this.hass)}
              </ha-alert>`}
        ${r.length?e`<ha-alert alert-type="info">
                ${o(1===r.length?"template_editor.used_by_template":"template_editor.used_by_templates",{names:r.join(", ")},this.hass)}
              </ha-alert>`:e``}
        ${this._renderElsewhere(s)} ${this._renderImpact(n,s)}
        <decluttering-card-plus-health .hass=${this.hass} .lovelace=${n}
          >${this._renderUndo()}</decluttering-card-plus-health
        >
        ${this._renderSimilar(n)} ${this._renderSearch()} ${this._renderRename(s,l)}
        ${this._renderRenameVariable(s)} ${this._renderDuplicate(s)} ${this._renderModernise()}
        ${this._toolError?e`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:e``}
      </div>
    `}_renderUndo(){var t,i;const s=Ot();if(!s)return e``;const n=Ct(s.operation,this.hass),a=new Date(s.at).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language);return e`
      <div class="undo">
        <p class="hint">${o("undo.held",{operation:n,time:a},this.hass)}</p>
        ${this._undoChanged?e`<ha-alert alert-type="warning">
                ${o("undo.changed_here",{operation:n,dashboards:this._undoChanged.join(", ")},this.hass)}
              </ha-alert>`:e``}
        <ha-button .disabled=${this._busy} @click=${this._undo}>
          ${o(this._undoChanged?"undo.anyway_button":"undo.button",{operation:n},this.hass)}
        </ha-button>
      </div>
    `}async _undo(){const e=Ot();if(e){this._busy=!0;try{const t=await Et(this,this.hass,e,!!this._undoChanged,!1);this._undoChanged="changed"===(null==t?void 0:t.result)?t.dashboards:void 0}finally{this._busy=!1}}}_renderSimilar(t){var i;if((null===(i=this._similar)||void 0===i?void 0:i.ll)!==t){const e=Tt(t);this._similar={ll:t,cards:e,groups:Cd(e.map(e=>e.config))}}const{cards:s,groups:n}=this._similar;if(!n.length)return e``;const a=Object.keys(P(t));return e`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${o(1===n.length?"tools.similar_header_one":"tools.similar_header",{count:n.length},this.hass)}
        </span>
        <p class="hint">${o("tools.similar_hint",{max:8},this.hass)}</p>
        ${n.slice(0,10).map(e=>this._renderSimilarGroup(e,s,a))}
      </ha-expansion-panel>
    `}_renderSimilarGroup(t,i,s){var n;const a=t.indices.map(e=>i[e]),r=Nd(a.map(e=>e.config)),l=(null!==(n=this._similarNames[t.key])&&void 0!==n?n:function(e,t,i=[]){let s=Ed(e.replace(/^custom:/,"").replace(/-/g,"_")).toLowerCase();/(^|_)card$/.test(s)||(s=`${s}_card`);const o=new Set(i.map(e=>"string"==typeof(null==e?void 0:e.entity)&&e.entity.includes(".")?e.entity.split(".")[0]:"")),[n]=[...o];return 1===o.size&&n&&(s=`${Ed(n).toLowerCase()}_${s}`),Qs(s,t)}(t.type,s,a.map(e=>e.config))).trim(),d=this._similarPending===`${t.key}\0${l}`,c=s.includes(l);return e`
      <div class="similar">
        <h3>${o("tools.similar_group",{count:a.length,type:t.type},this.hass)}</h3>
        <p class="hint">${o("tools.similar_differ",{names:r.names.join(", ")},this.hass)}</p>
        <ul>
          ${a.slice(0,8).map(t=>e`<li>${t.label}</li>`)}
        </ul>
        ${a.length>8?e`<p class="hint">
                ${o("editor.matches_more",{count:a.length-8},this.hass)}
              </p>`:e``}
        ${c?e`<ha-alert alert-type="error">${o("tools.name_taken",{name:l},this.hass)}</ha-alert>`:e``}
        ${d?e`
                <ha-alert alert-type="warning">
                  ${o("tools.similar_confirm",{name:l,count:a.length},this.hass)}
                </ha-alert>
                <p class="hint">${o("tools.similar_template",{name:l},this.hass)}</p>
                ${Lo(`${t.key}\0${l}`,e`<ha-yaml-editor
                    .hass=${this.hass}
                    .defaultValue=${{[l]:r.template}}
                    read-only
                  ></ha-yaml-editor>`)}
                <p class="hint">${o("tools.similar_first_card",void 0,this.hass)}</p>
                ${$l(a[0].config,Ld(l,r.variables[0],r.layout[0]),this.hass)}
              `:e``}
        ${as({label:o("tools.similar_name",void 0,this.hass),value:l,disabled:this._busy,onInput:e=>{this._similarNames=Object.assign(Object.assign({},this._similarNames),{[t.key]:e}),this._similarPending=void 0}})}
        <ha-button
          .disabled=${this._busy||!l||c}
          @click=${()=>{this._makeTemplate(t,a,l)}}
        >
          ${o(d?"tools.similar_make_anyway":"tools.similar_make",void 0,this.hass)}
        </ha-button>
      </div>
    `}async _makeTemplate(e,t,i){const s=`${e.key}\0${i}`;if(this._similarPending!==s)return void(this._similarPending=s);const o=await this._saveDashboard(e=>function(e,t,i){const{template:s,variables:o,layout:n}=Nd(t);let a=tt(e,i,s);return t.forEach((e,t)=>{a=oe(a,e,Ld(i,o[t],n[t]))}),a}(e,t.map(e=>e.config),i),"make_template");if(o){this._similarPending=void 0;const t=Object.assign({},this._similarNames);delete t[e.key],this._similarNames=t}}_renderElsewhere(t){var i;if((null===(i=this._remoteUsages)||void 0===i?void 0:i.name)!==t){this._remoteUsages={name:t,list:[]};const e=document.location.pathname.split("/").filter(Boolean)[0];Pt(this.hass,t,e).then(e=>{var i;(null===(i=this._remoteUsages)||void 0===i?void 0:i.name)===t&&(this._remoteUsages={name:t,list:e})})}const s=this._remoteUsages.list;if(!s.length)return e``;const n=s.map(e=>`${e.urlPath} (${e.total})`).join(", ");return e`<ha-alert alert-type="info">
      ${o("template_editor.usages_elsewhere",{list:n},this.hass)}
    </ha-alert>`}_renderImpact(t,i){const s=Nt(t,i);if(!s||!this._config)return e``;const n=e=>{if(e)return d(s.variables,e,Z(e),i,this.hass,!0)};let a,r;try{a=n(P(t)[i]),r=n(P(t,void 0,this._config)[i])}catch(l){return e``}return e`
      <ha-expansion-panel outlined>
        <span slot="header">${o("template_editor.impact_header",void 0,this.hass)}</span>
        <p class="hint">${o("template_editor.impact_diff_hint",void 0,this.hass)}</p>
        ${wl(a,r,this.hass)}
      </ha-expansion-panel>
    `}_renderRename(t,i){const s=this._renameTo.trim(),n=!!s&&this._renamePending===s,a=i?1===i?o("tools.rewrites_one",void 0,this.hass):o("tools.rewrites_many",{count:i},this.hass):"";return e`
      <div class="rename">
        <h3>${o("tools.rename_header",void 0,this.hass)}</h3>
        <p class="hint">${o("tools.rename_hint",void 0,this.hass)}</p>
        ${this._renameError?e`<ha-alert alert-type="error">${this._renameError}</ha-alert>`:e``}
        ${n?e`<ha-alert alert-type="warning">
                ${o("tools.rename_confirm",{from:t,to:s,rewrites:a},this.hass)}
              </ha-alert>`:e``}
        ${as({label:o("tools.new_name",void 0,this.hass),value:this._renameTo,disabled:this._renaming,onInput:e=>this._renameChanged(e)})}
        <ha-button .disabled=${this._renaming||!s||s===t} @click=${this._rename}>
          ${n?o("tools.rename_anyway",void 0,this.hass):1===i?o("tools.rename_update_one",void 0,this.hass):i?o("tools.rename_update_many",{count:i},this.hass):o("tools.rename",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderModernise(){const t=this._savedLovelace,i=t?Lt(t):0;return i?e`
      <div class="rename">
        <h3>${o("tools.modernise_header",void 0,this.hass)}</h3>
        <p class="hint">
          ${o(1===i?"tools.modernise_hint_one":"tools.modernise_hint_many",{count:i},this.hass)}
        </p>
        ${this._modernisePending?e`<ha-alert alert-type="warning">
                ${o(1===i?"tools.modernise_confirm_one":"tools.modernise_confirm_many",{count:i},this.hass)}
              </ha-alert>`:e``}
        <ha-button .disabled=${this._busy} @click=${this._modernise}>
          ${o(this._modernisePending?"tools.modernise_anyway":1===i?"tools.modernise_one":"tools.modernise_many",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}async _modernise(){if(!this._modernisePending)return void(this._modernisePending=!0);await this._saveDashboard(e=>It(e),"modernise")&&(this._modernisePending=!1)}_renameChanged(e){this._renameTo=e,this._renameError=void 0,this._renamePending=void 0}async _rename(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._renameTo.trim();if(!i||!s||s===i)return;const n=w();if(n)if(void 0===P(n.config)[s])if(this._renamePending===s){this._renaming=!0,this._renameError=void 0;try{await x(this,this.hass,"rename_template",[{urlPath:k(),build:e=>Ft(e,i,s)}],this._config),this._undoChanged=void 0,this._fireConfigChanged(Object.assign(Object.assign({},this._config),{template:s})),this._renameTo="",this._renamePending=void 0}catch(a){this._renameError=o("tools.save_failed",{message:null!==(t=null==a?void 0:a.message)&&void 0!==t?t:a},this.hass)}finally{this._renaming=!1}}else this._renamePending=s;else this._renameError=o("tools.name_taken",{name:s},this.hass);else this._renameError=o("tools.cannot_rename_here",void 0,this.hass)}_renderSearch(){const t=this._searchQuery.trim(),i=this._searchResult,s=e=>"variables"===e.where?"":o(`tools.search_in_${e.where}`,void 0,this.hass),n=e=>e.view.title||e.view.path||o("template_editor.untitled_view",void 0,this.hass);return e`
      <div class="rename">
        <h3>${o("tools.search_header",void 0,this.hass)}</h3>
        <p class="hint">${o("tools.search_hint",void 0,this.hass)}</p>
        ${as({label:o("tools.search_label",void 0,this.hass),value:this._searchQuery,onInput:e=>{this._searchQuery=e},onKeydown:e=>{"Enter"===e.key&&this._search()}})}
        <ha-button .disabled=${this._searching||!t} @click=${()=>{this._search()}}>
          ${o(this._searching?"tools.searching":"tools.search",void 0,this.hass)}
        </ha-button>
        ${!i||i.cards.length||i.templates.length?e``:e`<p class="hint">${o("tools.search_none",{query:i.query},this.hass)}</p>`}
        ${(null==i?void 0:i.cards.length)?e`
                <p class="hint">${o("tools.search_cards",{count:i.cards.length},this.hass)}</p>
                <ul>
                  ${i.cards.slice(0,ts).map(t=>e`
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
                ${i.cards.length>ts?e`<p class="hint">
                        ${o("editor.matches_more",{count:i.cards.length-ts},this.hass)}
                      </p>`:e``}
              `:e``}
        ${(null==i?void 0:i.templates.length)?e`
                <p class="hint">${o("tools.search_templates",{count:i.templates.length},this.hass)}</p>
                <ul>
                  ${i.templates.slice(0,ts).map(t=>e`<li>
                          ${t.urlPath} › ${t.template}: <code>${t.path}</code> = ${t.value}
                        </li>`)}
                </ul>
                ${i.templates.length>ts?e`<p class="hint">
                        ${o("editor.matches_more",{count:i.templates.length-ts},this.hass)}
                      </p>`:e``}
              `:e``}
      </div>
    `}async _search(){const e=this._searchQuery.trim();if(e&&!this._searching){this._searching=!0;try{const i=k(),s=nt(this.hass),o=[{urlPath:i,config:this._savedLovelace}];for(const e of this.hass?await Mt(this.hass):[])if(Vt(e)!==i)try{o.push({urlPath:e,config:await at(s,e)})}catch(t){}this._searchResult=Object.assign({query:e},function(e,t){var i;const s=t.trim().toLowerCase(),o=[],n=[];if(!s)return{cards:o,templates:n};const a=e=>e.toLowerCase().includes(s);for(const{urlPath:r,config:l}of e){const e=(e,t)=>{var i,s;const n=(i,s,n)=>{o.push({urlPath:r,view:t,template:e.template,where:i,variable:s,value:n})},l=(e,t,i="")=>{for(const s of D(t)){const[t,o]=Object.entries(s)[0];for(const s of xd(o,`${i}${t}`))a(s.value)&&n(e,s.path,s.value)}};l("variables",e.variables);for(const o of null!==(i=B(e.for_each))&&void 0!==i?i:[])l("for_each",o);const d=null===(s=e.for_each_from)||void 0===s?void 0:s.overrides;if(d&&"object"==typeof d)for(const[o,r]of Object.entries(d))a(o)&&n("overrides",o,o),l("overrides",r,`${o} › `);for(const o of wd)if(void 0!==e[o])for(const t of xd(e[o],o))a(t.value)&&n("override_block",t.path,t.value)},t=(i,s)=>{if(Array.isArray(i))for(const e of i)t(e,s);else if(i&&"object"==typeof i&&!v(i.type)){Ve.includes(i.type)&&"string"==typeof i.template&&e(i,s);for(const e of Object.values(i))t(e,s)}};(null!==(i=null==l?void 0:l.views)&&void 0!==i?i:[]).forEach((e,i)=>{var s,o,n;return t(e,{title:null!==(o=null!==(s=null==e?void 0:e.title)&&void 0!==s?s:null==e?void 0:e.path)&&void 0!==o?o:"",path:null!==(n=null==e?void 0:e.path)&&void 0!==n?n:"",index:i})});for(const[i,s]of Object.entries($t(l))){const e=Object.assign({},null!=s?s:{});delete e.type,delete e.template;for(const t of xd(e,""))a(t.value)&&n.push(Object.assign({urlPath:r,template:i},t))}}return{cards:o,templates:n}}(o,e))}finally{this._searching=!1}}}_renderRenameVariable(t){const i=Bd(this._config);if(!i.length||!this._config)return e``;const s=this._varFrom&&i.includes(this._varFrom)?this._varFrom:void 0,n=this._varTo.trim(),a=this._varPending,r=!!a&&a.from===s&&a.to===n,l=r&&a.elsewhere.length?o("tools.rename_variable_elsewhere",{list:a.elsewhere.map(e=>`${e.urlPath} (${e.cards})`).join(", ")},this.hass):"";return e`
      <div class="rename">
        <h3>${o("tools.rename_variable_header",void 0,this.hass)}</h3>
        <p class="hint">${o("tools.rename_variable_hint",void 0,this.hass)}</p>
        ${this._varError?e`<ha-alert alert-type="error">${this._varError}</ha-alert>`:e``}
        ${r&&s?e`
                <ha-alert alert-type="warning">
                  ${o("tools.rename_variable_confirm",{from:s,to:n,templates:a.templates,cards:a.cards,elsewhere:l},this.hass)}
                </ha-alert>
                ${$l(this._config,zd(this._config,s,n),this.hass)}
              `:e``}
        <ha-form
          .hass=${this.hass}
          .data=${{variable:null!=s?s:""}}
          .schema=${[{name:"variable",selector:{select:{mode:"dropdown",options:i.map(e=>({value:e,label:e}))}}}]}
          .computeLabel=${()=>o("tools.rename_variable_pick",void 0,this.hass)}
          @value-changed=${this._varPicked}
        ></ha-form>
        ${as({label:o("tools.new_name",void 0,this.hass),value:this._varTo,disabled:this._busy,onInput:e=>this._varToChanged(e)})}
        <ha-button
          .disabled=${this._busy||!s||!n||n===s}
          @click=${()=>{this._renameVariable(t)}}
        >
          ${o(r?"tools.rename_anyway":"tools.rename_variable",void 0,this.hass)}
        </ha-button>
      </div>
    `}_varPicked(e){e.stopPropagation(),this._varFrom=e.detail.value.variable||void 0,this._varError=void 0,this._varPending=void 0}_varToChanged(e){this._varTo=e,this._varError=void 0,this._varPending=void 0}async _renameVariable(e){var t;const i=this._varFrom,s=this._varTo.trim();if(!i||!s||s===i||!this._config)return;if(!function(e){return/^[A-Za-z0-9_-]+$/.test(e)}(s))return void(this._varError=o("tools.rename_variable_invalid",{name:s},this.hass));const n=w();if(!n)return void(this._varError=o("tools.cannot_save_here",void 0,this.hass));if(function(e,t,i,s){const o=$t(e);for(const n of Ud(e,t))if(Bd(n===t&&s?s:o[n]).includes(i))return!0;return!1}(n.config,e,s,this._config))return void(this._varError=o("tools.rename_variable_taken",{name:s},this.hass));const a=k(),r=this._varPending;if(r&&r.from===i&&r.to===s){this._busy=!0,this._varError=void 0;try{let t;await x(this,this.hass,"rename_variable",[{urlPath:a,build:o=>(t=Ud(o,e),Kd(o,e,i,s).config)},...r.elsewhere.map(o=>({urlPath:o.urlPath,build:o=>Jd(o,e,a)?Kd(o,e,i,s,t).config:o}))],this._config),this._undoChanged=void 0,this._fireConfigChanged(zd(this._config,i,s)),this._varFrom=s,this._varTo="",this._varPending=void 0}catch(l){this._varError=o("tools.save_failed",{message:null!==(t=null==l?void 0:l.message)&&void 0!==t?t:l},this.hass)}finally{this._busy=!1}}else{this._busy=!0;try{const t=nt(this.hass),o=await at(t,a).catch(()=>n.config),r=Kd(o,e,i,s),l=Ud(o,e),c=[];for(const n of this.hass?await Mt(this.hass):[]){if(Vt(n)===a)continue;let o;try{o=await at(t,n)}catch(d){continue}if(!Jd(o,e,a))continue;const r=Kd(o,e,i,s,l);(r.cards||r.templates)&&c.push({urlPath:n,cards:r.cards})}this._varPending={from:i,to:s,cards:r.cards,templates:r.templates,elsewhere:c}}finally{this._busy=!1}}}_renderDuplicate(t){const i=this._duplicateTo.trim(),s=!!i&&this._duplicatePending===i;return e`
      <div class="rename">
        <h3>${o("tools.duplicate_header",void 0,this.hass)}</h3>
        <p class="hint">${o("tools.duplicate_hint",void 0,this.hass)}</p>
        ${s?e`<ha-alert alert-type="warning">
                ${o("tools.duplicate_confirm",{to:i,name:t},this.hass)}
              </ha-alert>`:e``}
        ${as({label:o("tools.copy_name",void 0,this.hass),value:this._duplicateTo,disabled:this._busy,onInput:e=>this._duplicateChanged(e)})}
        <ha-button .disabled=${this._busy||!i||i===t} @click=${this._duplicate}>
          ${o(s?"tools.duplicate_anyway":"tools.duplicate",void 0,this.hass)}
        </ha-button>
      </div>
    `}_duplicateChanged(e){this._duplicateTo=e,this._toolError=void 0,this._duplicatePending=void 0}async _duplicate(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._duplicateTo.trim();if(!i||!s||s===i)return;const n=w();if(n&&void 0!==P(n.config)[s])return void(this._toolError=o("tools.name_taken",{name:s},this.hass));if(this._duplicatePending!==s)return void(this._duplicatePending=s);const a=Object.assign(Object.assign({},this._config),{template:s}),r=ae(null!==(t=null==n?void 0:n.config)&&void 0!==t?t:this.lovelace,i),l=await this._saveDashboard(e=>{var t,i;return it(e,null!==(i=null===(t=null==r?void 0:r.view)||void 0===t?void 0:t.index)&&void 0!==i?i:0,a)},"duplicate");l&&(this._duplicateTo="",this._duplicatePending=void 0)}}h([p({attribute:!1})],Yd.prototype,"hass",void 0),h([p({attribute:!1})],Yd.prototype,"lovelace",void 0),h([p({attribute:!1})],Yd.prototype,"config",void 0),h([u()],Yd.prototype,"_renameTo",void 0),h([u()],Yd.prototype,"_renameError",void 0),h([u()],Yd.prototype,"_renaming",void 0),h([u()],Yd.prototype,"_renamePending",void 0),h([u()],Yd.prototype,"_duplicateTo",void 0),h([u()],Yd.prototype,"_duplicatePending",void 0),h([u()],Yd.prototype,"_toolError",void 0),h([u()],Yd.prototype,"_busy",void 0),h([u()],Yd.prototype,"_modernisePending",void 0),h([u()],Yd.prototype,"_remoteUsages",void 0),h([u()],Yd.prototype,"_undoChanged",void 0),h([u()],Yd.prototype,"_similarNames",void 0),h([u()],Yd.prototype,"_similarPending",void 0),h([u()],Yd.prototype,"_searchQuery",void 0),h([u()],Yd.prototype,"_searching",void 0),h([u()],Yd.prototype,"_searchResult",void 0),h([u()],Yd.prototype,"_varFrom",void 0),h([u()],Yd.prototype,"_varTo",void 0),h([u()],Yd.prototype,"_varError",void 0),h([u()],Yd.prototype,"_varPending",void 0),customElements.get("decluttering-template-usages-tab")||customElements.define("decluttering-template-usages-tab",Yd);class Zd extends m{constructor(){super(...arguments),this._selectedTab="settings",this._suggestedNothing=!1,this._busy=!1,this._declutterPending=!1,this._promoteName="",this._loadedElements=!1}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=w())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:T()}static describeSchema(){var e;return null!==(e=Zd._describeSchema)&&void 0!==e||(Zd._describeSchema=[{name:"template",label:o("template_editor.template_label"),selector:{text:{}}},{name:"thingType",label:o("template_editor.type_label"),selector:{select:{mode:"dropdown",options:[{value:"card",label:o("template_editor.type_card")},{value:"badge",label:o("template_editor.type_badge")},{value:"row",label:o("template_editor.type_row")},{value:"element",label:o("template_editor.type_element")}]}}},{name:"description",label:o("template_editor.description_label"),helper:o("template_editor.description_helper"),selector:{text:{multiline:!0}}},{name:"category",label:o("template_editor.category_label"),helper:o("template_editor.category_helper"),selector:{text:{}}}]),Zd._describeSchema}static defaultsSchema(){var e;return null!==(e=Zd._defaultsSchema)&&void 0!==e||(Zd._defaultsSchema=[{name:"default",label:o("template_editor.defaults_label"),helper:o("template_editor.defaults_helper"),selector:{object:{}}}]),Zd._defaultsSchema}setConfig(e){this._config=e,this._suggestion=void 0,this._suggestedNothing=!1}render(){var t;if(!this.hass||!this._config)return e``;const i={};I(this._config.default)&&I(this._config.defaults)||(i.default=o("error.variables_shape",void 0,this.hass)),qt(this._config.variables)||(i.variables=o("template_editor.declarations_shape",void 0,this.hass));const s={template:this._config.template,thingType:null!==(t=M(this._config))&&void 0!==t?t:"card",description:this._config.description,category:this._config.category},n={default:Ee(this._config)},a=L(this._config).length;return e`
      <ha-tab-group .active=${this._selectedTab} @click=${this._activateTab}>
        <ha-tab-group-tab slot="nav" panel="settings">
          ${o("template_editor.tab_settings",void 0,this.hass)}
        </ha-tab-group-tab>
        ${"card"===s.thingType&&void 0===this._config.group?e`
                <ha-tab-group-tab slot="nav" panel="card">
                  ${o("template_editor.tab_card",void 0,this.hass)}
                </ha-tab-group-tab>
                <ha-tab-group-tab slot="nav" panel="change_card">
                  ${o("template_editor.tab_change_card",void 0,this.hass)}
                </ha-tab-group-tab>
              `:"row"===s.thingType?e`<ha-tab-group-tab slot="nav" panel="row">
                  ${o("template_editor.tab_row",void 0,this.hass)}
                </ha-tab-group-tab>`:e``}
        <ha-tab-group-tab slot="nav" panel="usages">
          ${o("template_editor.tab_usages",void 0,this.hass)}
        </ha-tab-group-tab>
        <ha-tab-group-tab slot="nav" panel="share">
          ${o("template_editor.tab_share",void 0,this.hass)}
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
                <span slot="header">${o("template_editor.panel_describe",void 0,this.hass)}</span>
                <div class="panel">
                  ${this._renderInUse()}
                  ${Zd.describeSchema().map(t=>e`
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
                  >${o("template_editor.panel_variables",void 0,this.hass)}
                  <small>${o("declarations.count",{count:a},this.hass)}</small></span
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
                    .shared=${bt(this._savedLovelace)}
                    @value-changed=${this._declarationsChanged}
                  ></decluttering-declarations-editor>
                  <div class="field-row">
                    <ha-form
                      .hass=${this.hass}
                      .data=${n}
                      .schema=${Zd.defaultsSchema()}
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
                <span slot="header">${o("template_editor.panel_tools",void 0,this.hass)}</span>
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
                ${this._renderCardFromParents()}
                <hui-card-element-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .value=${this._cardForEditor()}
                  @config-changed=${this._cardChanged}
                ></hui-card-element-editor>
                <decluttering-field-menus
                  .hass=${this.hass}
                  .config=${this._config}
                  @config-changed=${this._childConfigChanged}
                ></decluttering-field-menus>
                <decluttering-code-hooks
                  .hass=${this.hass}
                  .lovelace=${this._savedLovelace}
                  .config=${this._config}
                ></decluttering-code-hooks>
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
    `}_renderDiagnostics(){if(!this._config||!qt(this._config.variables))return e``;const{unused:t,duplicated:i,contradictory:s}=Dt(this._config);return e`
      ${t.length?e`<ha-alert alert-type="info">
              ${o(1===t.length?"template_editor.declared_unused_one":"template_editor.declared_unused_many",{names:t.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${i.length?e`<ha-alert alert-type="warning">
              ${o(1===i.length?"template_editor.duplicated_one":"template_editor.duplicated_many",{names:i.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${s.length?e`<ha-alert alert-type="warning">
              ${o(1===s.length?"template_editor.contradictory_one":"template_editor.contradictory_many",{names:s.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_cardForEditor(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.card;if(!this._config||t&&"object"==typeof t&&"string"==typeof t.type)return t;const i=P(this._savedLovelace,void 0,this._config)[this._config.template],s=null==i?void 0:i.card;return s&&"object"==typeof s&&"string"==typeof s.type?s:t}_renderCardFromParents(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.card;if(!this._config||i&&"object"==typeof i&&"string"==typeof i.type)return e``;const s=Ne(this._config);return s.length?e`<ha-alert alert-type="info">
      ${o("template_editor.card_from_parents",{parents:s.join(", ")},this.hass)}
    </ha-alert>`:e``}_renderLint(){if(!this._config)return e``;const t=this._savedLovelace,i=P(t,void 0,this._config)[this._config.template],s=$o(this._config,[...bo(i),...Object.keys(X(t))]);return s.length?e`${s.map(t=>e`<ha-alert alert-type=${t.level}>
          ${o(t.key,t.params,this.hass)}${t.params.closest?o("error.did_you_mean",{closest:t.params.closest},this.hass):""}${t.path?o("lint.where",{path:t.path},this.hass):""}
        </ha-alert>`)}`:e``}_renderSortable(t,i,s){const n=(e,i)=>{e.preventDefault();const o=this._dragging;this._dragging=void 0,(null==o?void 0:o.list)===t&&s(o.from,i)};return e`
      <ul>
        ${i.map((a,r)=>e`
            <li
              draggable="true"
              @dragstart=${e=>{var i;this._dragging={list:t,from:r},null===(i=e.dataTransfer)||void 0===i||i.setData("text/plain",a.name),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}}
              @dragover=${e=>{var i;(null===(i=this._dragging)||void 0===i?void 0:i.list)===t&&e.preventDefault()}}
              @drop=${e=>n(e,r)}
              @dragend=${()=>{this._dragging=void 0}}
            >
              <ha-svg-icon class="handle" .path=${ns}></ha-svg-icon>
              <span>${a.label}</span>
              <span class="spacer"></span>
              <ha-icon-button
                .path=${"M7,15L12,10L17,15H7Z"}
                .disabled=${0===r}
                .label=${o("template_editor.move_up",{name:a.name},this.hass)}
                @click=${()=>s(r,r-1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,10L12,15L17,10H7Z"}
                .disabled=${r===i.length-1}
                .label=${o("template_editor.move_down",{name:a.name},this.hass)}
                @click=${()=>s(r,r+1)}
              ></ha-icon-button>
            </li>
          `)}
      </ul>
    `}_renderGroupOrder(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.group,s=Ht(i);if(void 0===i||s.length<2)return e``;const n=s.map((e,t)=>{var i,s,o,n;const a=null!==(o=null!==(s=null!==(i=null==e?void 0:e.name)&&void 0!==i?i:null==e?void 0:e.heading)&&void 0!==s?s:null==e?void 0:e.title)&&void 0!==o?o:null==e?void 0:e.entity,r=String(null!==(n=null==e?void 0:e.type)&&void 0!==n?n:"?").replace(/^custom:/,"");return{label:"string"==typeof a?`${r} (${a})`:r,name:`${t+1} ${r}`}});return e`
      <div class="order">
        <p class="hint">${o("template_editor.group_order_hint",void 0,this.hass)}</p>
        ${this._renderSortable("group",n,(e,t)=>{const o=_e(s,e,t);o!==s&&this._config&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{group:Rt(i,o)}))})}
      </div>
    `}_renderPromote(){const t=oo(this._config);if(!this._config||!t)return e``;const i=function(e){const t=[],i=(e,s)=>{if(Array.isArray(e))e.forEach((e,t)=>i(e,[...s,t]));else if(e&&"object"==typeof e)for(const[t,o]of Object.entries(e))"type"===t&&"string"==typeof o||i(o,[...s,t]);else"string"==typeof e&&l.test(e)||s.length&&null!=e&&("string"!=typeof e&&"number"!=typeof e&&"boolean"!=typeof e||t.push({path:s,value:e,label:no(s)}))};return i(e,[]),t}(this._config[t]);if(!i.length)return e``;const s=this._promotePath?JSON.stringify(this._promotePath):"",n=e=>{const t=String(e);return t.length>40?`${t.slice(0,39)}…`:t};return e`
      <ha-expansion-panel outlined class="promote">
        <span slot="header">${o("template_editor.promote_header",void 0,this.hass)}</span>
        <p class="hint">${o("template_editor.promote_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${{setting:s}}
          .schema=${[{name:"setting",selector:{select:{mode:"dropdown",options:i.map(e=>({value:JSON.stringify(e.path),label:`${e.label} = ${n(e.value)}`}))}}}]}
          .computeLabel=${()=>o("template_editor.promote_pick",void 0,this.hass)}
          @value-changed=${this._promotePicked}
        ></ha-form>
        ${this._promotePath?e`
                ${as({label:o("template_editor.promote_name",void 0,this.hass),value:this._promoteName,onInput:e=>{this._promoteName=e,this._promoteError=void 0}})}
                ${this._promoteError?e`<ha-alert alert-type="error">${this._promoteError}</ha-alert>`:e``}
                <ha-button .disabled=${!this._promoteName.trim()} @click=${this._promote}>
                  ${o("template_editor.promote_button",void 0,this.hass)}
                </ha-button>
              `:e``}
      </ha-expansion-panel>
    `}_promotePicked(e){e.stopPropagation();const t=e.detail.value.setting;t&&(this._promotePath=JSON.parse(t),this._promoteName=function(e,t){const i=[...e].reverse().find(e=>"string"==typeof e),s=e[e.length-1];return Qs(("number"==typeof s?`${null!=i?i:"item"}_${s+1}`:null!=i?i:"value").replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value",t)}(this._promotePath,ao(this._config)),this._promoteError=void 0)}_promote(){if(!this._config||!this._promotePath)return;const e=this._promoteName.trim(),t=ho(this._config,this._promotePath,e);t.ok?(this._promotePath=void 0,this._promoteName="",this._fireConfigChanged(t.template)):this._promoteError=o(`template_editor.promote_${t.error}`,{name:e},this.hass)}_renderInUse(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._savedLovelace;if(!i||!s)return e``;const{views:n,templates:a}=St(s,i),r=n.reduce((e,t)=>e+t.count,0)+a.length;return r?e`<ha-alert alert-type="info">
      ${o(1===r?"template_editor.in_use_one":"template_editor.in_use_many",{total:r},this.hass)}
    </ha-alert>`:e``}_renderSuggest(t){var i;return t&&(null===(i=this._config)||void 0===i?void 0:i.card)?e`
      <div class="suggest">
        ${this._suggestedNothing?e`<ha-alert alert-type="info">
                ${o("template_editor.suggest_nothing",void 0,this.hass)}
              </ha-alert>`:e``}
        ${this._suggestion?e`<ha-alert alert-type="warning">
                ${o(1===this._suggestion.variables.length?"template_editor.suggest_confirm_one":"template_editor.suggest_confirm_many",{names:this._suggestion.variables.map(e=>e.name).join(", ")},this.hass)}
              </ha-alert>`:e``}
        <ha-button @click=${this._suggest}>
          ${o(this._suggestion?"template_editor.suggest_anyway":"template_editor.suggest_button",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}_suggest(){var e;if(!(null===(e=this._config)||void 0===e?void 0:e.card))return;if(this._suggestion){const e=Object.assign(Object.assign({},this._config),{card:this._suggestion.card});return e.variables=He(this._config.variables,this._suggestion.variables),this._suggestion=void 0,void this._fireConfigChanged(e)}this._suggestedNothing=!1;const t=L(this._config).map(e=>e.name),i=function(e,t){const i=new Set(t),s=[],o=new Map,n=(e,t)=>{const n=`${e.base} ${t}`,a=o.get(n);if(a)return a;let r=1,l=e.base;for(;i.has(l);)r+=1,l=`${e.base}_${r}`;return i.add(l),o.set(n,l),s.push({name:l,label:bs(e,r),selector:e.selector,default:t}),l},a=e=>{if(Array.isArray(e))return e.map(a);if(!e||"object"!=typeof e)return e;const t={};for(const[i,s]of Object.entries(e)){const e=Object.prototype.hasOwnProperty.call(ys,i)?ys[i]:void 0;e&&"string"==typeof s&&!l.test(s)&&e.matches(s)?t[i]=`[[${n(e,s)}]]`:t[i]=a(s)}return t};return{card:a(e),variables:s}}(this._config.card,t);i.variables.length?this._suggestion=i:this._suggestedNothing=!0}_renderDeclutter(){var t,i;const s=this._savedLovelace,n=Tt(s),a="card"===M(null!==(t=this._config)&&void 0!==t?t:{})?zt(s):[];if(!n.length&&!a.length||!this._config)return e``;const r=this._config.template,l=!!r&&r in P(s),d=null!==(i=this._declutterOriginal)&&void 0!==i?i:this._declutterSection;return e`
      <ha-expansion-panel outlined>
        <span slot="header">${o("template_editor.declutter_header",void 0,this.hass)}</span>
        <p class="hint">${o("template_editor.declutter_hint",void 0,this.hass)}</p>
        ${n.length?e`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:n.map((e,t)=>({value:String(t),label:e.label}))}}}]}
                .computeLabel=${()=>o("template_editor.declutter_pick",void 0,this.hass)}
                @value-changed=${e=>this._declutterPicked(e,n)}
              ></ha-form>`:e``}
        ${a.length?e`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:a.map((e,t)=>({value:String(t),label:o(1===e.cards.length?"template_editor.declutter_section_one":"template_editor.declutter_section_many",{where:e.label,count:e.cards.length},this.hass)}))}}}]}
                .computeLabel=${()=>o("template_editor.declutter_pick_section",void 0,this.hass)}
                @value-changed=${e=>this._declutterSectionPicked(e,a)}
              ></ha-form>`:e``}
        ${d?e`
                <ha-button .disabled=${this._busy||!l} @click=${this._declutterReplace}>
                  ${o(this._declutterPending?"template_editor.declutter_replace_confirm":this._declutterSection?"template_editor.declutter_replace_section":"template_editor.declutter_replace",void 0,this.hass)}
                </ha-button>
                ${l?e``:e`<p class="hint">${o("template_editor.declutter_save_first",void 0,this.hass)}</p>`}
              `:e``}
      </ha-expansion-panel>
    `}_declutterPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterOriginal=i.config,this._declutterSection=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{card:JSON.parse(JSON.stringify(i.config))});delete s.group,this._fireConfigChanged(s)}_declutterSectionPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterSection={view:i.view,section:i.section,cards:i.cards},this._declutterOriginal=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{group:{cards:JSON.parse(JSON.stringify(i.cards))}});delete s.card,this._fireConfigChanged(s)}async _declutterReplace(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.template,i=this._declutterOriginal,s=this._declutterSection;if(!t||!i&&!s)return;if(!this._declutterPending)return void(this._declutterPending=!0);const n={type:"custom:decluttering-card-plus",template:t};let a=!1;const r=await this._saveDashboard(e=>{if(i)return oe(e,i,n);const t=Wt(e,s.view,s.section,s.cards,[n]);return a=t===e,t},"declutter");r&&a&&(this._toolError=o("template_editor.declutter_section_changed",void 0,this.hass)),r&&(this._declutterPending=!1,this._declutterOriginal=void 0,this._declutterSection=void 0)}_selectTab(e){e.stopPropagation(),this._selectedTab=e.detail}_activateTab(e){const t=e.composedPath().find(e=>"ha-tab-group-tab"===e.localName),i=null==t?void 0:t.getAttribute("panel");i&&(this._selectedTab=i)}_describeChanged(e){var t;if(!this._config)return;const i=Object.assign({template:this._config.template,thingType:null!==(t=M(this._config))&&void 0!==t?t:"card",description:this._config.description,category:this._config.category},e.detail.value),s=Object.assign(Object.assign({},this._config),{template:i.template});V(s,"description",i.description),V(s,"category",i.category);const o=void 0!==s.group&&"card"===i.thingType;o||delete s.group;for(const[n,a]of Object.entries(es))Zd.stubMember(!o&&i.thingType===n,s,n,a);this._fireConfigChanged(s)}_declarationsChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);V(t,"variables",e.detail.value),this._fireConfigChanged(t)}_defaultsChanged(e){if(!this._config)return;const t=e.detail.value,i=Object.assign(Object.assign({},this._config),{default:t.default});void 0!==this._config.defaults&&(JSON.stringify(t.default)===JSON.stringify(Ee(this._config))?i.default=this._config.default:delete i.defaults),this._fireConfigChanged(i)}_childConfigChanged(e){e.stopPropagation(),this._fireConfigChanged(e.detail.config)}_cardChanged(e){if(e.stopPropagation(),!this._config)return;const t=this._config.card;if(!(t&&"object"==typeof t&&"string"==typeof t.type)&&Ut(e.detail.config,this._cardForEditor()))return;this._suggestion=void 0,this._suggestedNothing=!1;const i=Object.assign(Object.assign({},this._config),{card:e.detail.config});this._fireConfigChanged(i)}_cardPicked(e){this._selectedTab="card",this._cardChanged(e)}_rowChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign(Object.assign({},this._config),{row:e.detail.config});this._fireConfigChanged(t)}_fireConfigChanged(e){this._suggestion=void 0,this._suggestedNothing=!1,g(this,"config-changed",{config:e})}static stubMember(e,t,i,s){e?i in t||(t[i]=s):delete t[i]}static get styles(){return wo}_saveDashboard(e,t,i){return rs(this,e,t,i)}async connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=C(()=>this.requestUpdate())),this._loadedElements||(await E(),await async function(){let e=customElements.get("hui-entities-card");if(!e){if(!j)return;(await j).createCardElement({type:"entities",entities:[]}),await customElements.whenDefined("hui-entities-card"),e=customElements.get("hui-entities-card")}e&&e.getConfigElement&&await e.getConfigElement()}(),this._loadedElements=!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}updated(e){var t;super.updated(e);const i=null!==(t=this.renderRoot.querySelector("hui-card-element-editor"))&&void 0!==t?t:void 0;for(const s of["decluttering-field-menus","decluttering-code-hooks"]){const e=this.renderRoot.querySelector(s);e&&e.target!==i&&(e.target=i)}}}h([u()],Zd.prototype,"_config",void 0),h([u()],Zd.prototype,"_selectedTab",void 0),h([u()],Zd.prototype,"_suggestion",void 0),h([u()],Zd.prototype,"_suggestedNothing",void 0),h([u()],Zd.prototype,"_toolError",void 0),h([u()],Zd.prototype,"_busy",void 0),h([u()],Zd.prototype,"_declutterOriginal",void 0),h([u()],Zd.prototype,"_declutterSection",void 0),h([u()],Zd.prototype,"_declutterPending",void 0),h([u()],Zd.prototype,"_promotePath",void 0),h([u()],Zd.prototype,"_promoteName",void 0),h([u()],Zd.prototype,"_promoteError",void 0),h([p()],Zd.prototype,"lovelace",void 0),h([p()],Zd.prototype,"hass",void 0);class Gd extends m{connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=C(()=>this.requestUpdate()))}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}static get styles(){return f`
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
    `}render(){var t,i,s,n,a,r,l,d,c;const h=this.lovelace,p=Oe(h);if(p&&(null===(t=this._borrowed)||void 0===t?void 0:t.ll)!==h){this._borrowed={ll:h};const e=new Set(Object.keys(P(h)));Ce(this.hass,h).then(t=>{var i;(null===(i=this._borrowed)||void 0===i?void 0:i.ll)===h&&(this._borrowed={ll:h,names:Object.keys(t).filter(t=>!e.has(t)),templates:t})})}const u=p&&!(null===(i=this._borrowed)||void 0===i?void 0:i.names),m=Bt(h,p&&null!==(n=null===(s=this._borrowed)||void 0===s?void 0:s.names)&&void 0!==n?n:[]),f=u?Object.assign(Object.assign({},m),{missingTemplates:[]}):m,g=Kt(h),v=Jt(h),_=null===(a=this._borrowed)||void 0===a?void 0:a.names,y=this._examplesChecked;u||(null==y?void 0:y.ll)===h&&(null==y?void 0:y.borrowed)===_||(this._examplesChecked={ll:h,borrowed:_,failed:mt(P(h),null!=_?_:[],this.hass)});const b=u?[]:null!==(l=null===(r=this._examplesChecked)||void 0===r?void 0:r.failed)&&void 0!==l?l:[],$=qd(h,null!==(c=null===(d=this._borrowed)||void 0===d?void 0:d.templates)&&void 0!==c?c:P(h)),w=!(f.missingTemplates.length||f.unsetVariables.length||f.unusedTemplates.length||g.length||v.length||b.length||$.length);return e`
      <ha-expansion-panel outlined>
        <span slot="header">${o("tools.health_header",void 0,this.hass)}</span>
        <slot></slot>
        ${w?e`<p class="hint">${o("tools.health_ok",void 0,this.hass)}</p>`:e`
                ${b.map(t=>e`<ha-alert alert-type="error">
                      ${o("tools.health_example",{template:t.template,number:t.example,problems:t.problems.join(" ")},this.hass)}
                    </ha-alert>`)}
                ${g.map(t=>e`<ha-alert alert-type="error">
                      ${o("tools.health_extends_loop",{path:t.join(" → ")},this.hass)}
                    </ha-alert>`)}
                ${f.missingTemplates.map(t=>e`<ha-alert alert-type="error">
                      ${o("tools.health_missing",{template:t.template,count:t.count},this.hass)}${t.closest?o("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${f.unsetVariables.map(t=>e`<ha-alert alert-type="warning">
                      ${o("tools.health_unset",{template:t.template,names:t.names.join(", "),count:t.count},this.hass)}
                    </ha-alert>`)}
                ${v.map(t=>{const i=[...t.views.map(e=>o("tools.health_view_uses",{view:e.title||o("template_editor.untitled_view",void 0,this.hass),count:e.count},this.hass)),...t.templates.map(e=>o("tools.health_template_uses",{name:e},this.hass))].join(", ");return e`<ha-alert alert-type="warning">
                    ${t.message?o("tools.health_deprecated_because",{template:t.template,message:t.message,uses:i},this.hass):o("tools.health_deprecated",{template:t.template,uses:i},this.hass)}
                  </ha-alert>`})}
                ${$.map(t=>e`<ha-alert alert-type="warning">
                      ${o("tools.health_unread",{template:t.template,name:t.name,count:t.count,view:t.view.title||t.view.path||o("template_editor.untitled_view",void 0,this.hass)},this.hass)}${"variables"===t.where?"":o(`tools.health_unread_${t.where}`,void 0,this.hass)}${t.closest?o("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${f.unusedTemplates.length?e`<ha-alert alert-type="info">
                        ${o("tools.health_unused",{names:f.unusedTemplates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
              `}
        ${this._renderTimings()}
      </ha-expansion-panel>
    `}_renderTimings(){const t=Yt.entries(),i=e=>e.toFixed(1),s=e`<h4 class="timings-header">${o("tools.timings_header",void 0,this.hass)}</h4>`;if(!t.length)return e`${s}
        <p class="hint">${o("tools.timings_none",void 0,this.hass)}</p>`;const{byTotal:n,byMax:a,repeats:r}=Zt(t);return e`
      ${s}
      <p class="hint">${o("tools.timings_hint",{count:t.length},this.hass)}</p>
      <p class="hint">${o("tools.timings_by_total",void 0,this.hass)}</p>
      <ul class="timings">
        ${n.map(t=>e`<li>
              ${o(1===t.builds?"tools.timings_total_row_one":"tools.timings_total_row",{template:t.template,total:i(t.total),builds:t.builds,max:i(t.max)},this.hass)}
            </li>`)}
      </ul>
      <p class="hint">${o("tools.timings_by_max",void 0,this.hass)}</p>
      <ul class="timings">
        ${a.map(t=>e`<li>
              ${o("tools.timings_max_row",{template:t.template,max:i(t.max)},this.hass)}
            </li>`)}
      </ul>
      ${r.length?e`
              <p class="hint">${o("tools.timings_repeats",void 0,this.hass)}</p>
              <ul class="timings">
                ${r.map(t=>{var i;return e`<li>
                      ${o(t.name?"tools.timings_repeat_named_row":"tools.timings_repeat_row",{template:t.template,name:null!==(i=t.name)&&void 0!==i?i:"",copies:t.copies},this.hass)}
                    </li>`})}
              </ul>
            `:e``}
    `}}h([p({attribute:!1})],Gd.prototype,"hass",void 0),h([p({attribute:!1})],Gd.prototype,"lovelace",void 0),h([u()],Gd.prototype,"_borrowed",void 0),Gt(Qt,fs),Gt(Xt,Zd),Gt(ei,Gd);export{fs as DeclutteringCardEditor,Gd as DeclutteringHealthPanel,Zd as DeclutteringTemplateEditor};
//# sourceMappingURL=decluttering-card-plus.editors-rlq-oCLV.js.map
