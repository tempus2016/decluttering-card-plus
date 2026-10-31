import{b as e,O as t,r as i,a as s,l as a,c as n,_ as o,n as r,d as l,i as c,e as d,f as h,g as u,h as p,j as m,k as f,o as g,m as _,p as v,q as y,t as b,s as $,u as w,v as x,w as k,x as A,y as j,z as S,A as O,B as C,C as E,D as T,E as P,F as N,G as I,H as L,I as F,J as M,K as q,L as D,M as V,N as R,P as z,Q as H,R as U,S as W,T as K,U as Y,W as B,X as J,Y as Z,Z as G,$ as Q,a0 as X,a1 as ee,a2 as te,a3 as ie,a4 as se,a5 as ae,a6 as ne,a7 as oe,a8 as re,a9 as le,aa as ce,ab as de,ac as he,ad as ue,ae as pe,af as me,ag as fe,ah as ge,ai as _e,aj as ve,ak as ye,al as be,am as $e,an as we,ao as xe,ap as ke,aq as Ae,ar as je,as as Se,at as Oe,au as Ce,av as Ee,aw as Te,ax as Pe,ay as Ne,az as Ie,aA as Le,aB as Fe,aC as Me,aD as qe,aE as De,aF as Ve,aG as Re,aH as ze,aI as He,aJ as Ue,aK as We,aL as Ke,aM as Ye,aN as Be,aO as Je,aP as Ze,aQ as Ge,aR as Qe,aS as Xe,aT as et,aU as tt,V as it,aV as st,aW as at,aX as nt,aY as ot,aZ as rt,a_ as lt,a$ as ct,b0 as dt,b1 as ht,b2 as ut,b3 as pt,b4 as mt,b5 as ft,b6 as gt,b7 as _t,b8 as vt,b9 as yt,ba as bt,bb as $t,bc as wt,bd as xt,be as kt,bf as At,bg as jt,bh as St,bi as Ot,bj as Ct,bk as Et,bl as Tt,bm as Pt,bn as Nt,bo as It,bp as Lt,bq as Ft,br as Mt,bs as qt,bt as Dt,bu as Vt,bv as Rt,bw as zt,bx as Ht}from"./decluttering-card-plus.core-BbA4-1N2.js";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=Symbol.for(""),Wt=e=>{if(e?.r===Ut)return e?._$litStatic$},Kt=e=>({_$litStatic$:e,r:Ut}),Yt=new Map,Bt=(e=>(t,...i)=>{const s=i.length;let a,n;const o=[],r=[];let l,c=0,d=!1;for(;c<s;){for(l=t[c];c<s&&void 0!==(n=i[c],a=Wt(n));)l+=a+t[++c],d=!0;c!==s&&r.push(n),o.push(l),c++}if(c===s&&o.push(t[s]),d){const e=o.join("$$lit$$");void 0===(t=Yt.get(e))&&(o.raw=o,Yt.set(e,t=o)),i=r}return e(t,...i)})(e),Jt=["grid_options","style",t,"strict","rebuild_on","debug","name","inherit_variables"];function Zt(e){return"number"==typeof e&&Number.isFinite(e)?String(e):"string"==typeof e&&e.trim()?e.trim():void 0}function Gt(e){if("number"==typeof e)return e;if("string"!=typeof e||!e.trim())return;const t=e.trim(),i=Number(t);return Number.isFinite(i)&&/^\d+$/.test(t)?i:t}function Qt(e){return e===s?"hide":e&&"object"==typeof e&&!Array.isArray(e)?"card":"show"}function Xt(e){const s={on_error_mode:Qt(e[t]),debug:(a=e.debug,!0===a?"json":"yaml"===a||"console"===a||"report"===a?a:"off")};var a;const n=e.grid_options,o=Zt(null==n?void 0:n.columns),r=Zt(null==n?void 0:n.rows);void 0!==o&&(s.grid_columns=o),void 0!==r&&(s.grid_rows=r),"string"==typeof e.style&&e.style&&(s.style=e.style),!0===e.strict&&(s.strict=!0);const l=i(e.rebuild_on);return l.length&&(s.rebuild_on=l),"string"==typeof e.name&&e.name&&(s.name=e.name),!0===e.inherit_variables&&(s.inherit_variables=!0),s}function ei(e,a){var n;const o=Object.assign({},e),r=Object.assign({},null!==(n=e.grid_options)&&void 0!==n?n:{}),l=Gt(a.grid_columns),c=Gt(a.grid_rows);void 0===l?delete r.columns:r.columns=l,void 0===c?delete r.rows:r.rows=c,Object.keys(r).length?o.grid_options=r:delete o.grid_options;const d="string"==typeof a.style?a.style:"";switch(d.trim()?o.style=d:delete o.style,a.on_error_mode){case"hide":o[t]=s;break;case"card":"card"!==Qt(e[t])&&delete o[t];break;default:delete o[t]}!0===a.strict?o.strict=!0:delete o.strict;const h=i(a.rebuild_on);switch(h.length?o.rebuild_on=h:delete o.rebuild_on,a.debug){case"json":o.debug=!0;break;case"yaml":case"console":case"report":o.debug=a.debug;break;default:delete o.debug}const u="string"==typeof a.name?a.name.trim():"";return u?o.name=u:delete o.name,!0===a.inherit_variables?o.inherit_variables=!0:delete o.inherit_variables,o}function ti(e){const i=e[t];return i&&"object"==typeof i&&!Array.isArray(i)?i:void 0}function ii(e,i){const s=Object.assign({},e);return i&&"object"==typeof i?s[t]=i:delete s[t],s}const si=["1","2","3","4","5","6","7","8","9","10","11","12","full"],ai=["1","2","3","4","5","6","7","8","auto"];const ni=["for_each","for_each_from","columns","min_column_width","gap","lazy","lazy_eager","empty"],oi=["repeat","extras","fit","advanced",...Jt],ri={grid_options:["grid_columns","grid_rows"],on_error:["on_error_mode"]};function li(e){const t=null==e?void 0:e.editor_hide;return(Array.isArray(t)?t:void 0===t?[]:[t]).filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>e.trim().toLowerCase())}const ci=(e,t)=>void 0!==(null==e?void 0:e[t]);function di(e,t,i){const s=new Set(li(e)),a=Jt.some(e=>ci(t,e));return{repeat:s.has("repeat")&&!ni.some(e=>ci(t,e)),extras:s.has("extras")&&!(null==i?void 0:i.length),fit:s.has("fit")&&!ci(t,"fit"),advanced:s.has("advanced")&&!a,advancedFields:[].concat(...Jt.filter(e=>s.has(e)&&!ci(t,e)).map(e=>{var t;return null!==(t=ri[e])&&void 0!==t?t:[e]}))}}const hi="decluttering-card-plus-card-slot";class ui extends c{constructor(){super(...arguments),this.label="",this.emptyHint="",this._picking=!1,this._editing=!1}static get styles(){return d`
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
    `}render(){const t=function(e){var t,i,s,n;if(!e||"object"!=typeof e||Array.isArray(e))return;const o=e,r="string"==typeof o.type?o.type:"",l=r.startsWith("custom:")?r.slice(7):r?r[0].toUpperCase()+r.slice(1):"",c=e=>"string"==typeof e&&e.trim()?e.split("\n")[0].trim():void 0,d=Array.isArray(o.cards)?o.cards.length:void 0;return{type:l,text:null!==(n=null!==(s=null!==(i=null!==(t=c(o.content))&&void 0!==t?t:c(o.title))&&void 0!==i?i:c(o.name))&&void 0!==s?s:c(o.entity))&&void 0!==n?n:void 0!==d?a("editor.slot.cards",{count:d}):""}}(this.value);return e`
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
    `}_togglePick(){this._picking=!this._picking}_toggleEdit(){this._editing=!this._editing}_picked(e){var t;e.stopPropagation(),this._picking=!1,this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_edited(e){var t;e.stopPropagation(),this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_set(e){this._editing=this._editing&&!!e,h(this,"value-changed",{value:e&&"object"==typeof e?e:void 0})}}function pi(e,t){const i=Math.max(0,t-e);return i<1?"<1 ms":`${Math.round(i)} ms`}o([r({attribute:!1})],ui.prototype,"hass",void 0),o([r({attribute:!1})],ui.prototype,"lovelace",void 0),o([r({attribute:!1})],ui.prototype,"value",void 0),o([r()],ui.prototype,"label",void 0),o([r()],ui.prototype,"emptyHint",void 0),o([l()],ui.prototype,"_picking",void 0),o([l()],ui.prototype,"_editing",void 0),"undefined"==typeof customElements||customElements.get(hi)||customElements.define(hi,ui);const mi="decluttering-card-plus-return";function fi(e){try{return"undefined"==typeof sessionStorage?void 0:sessionStorage}catch(t){return}}const gi="variable:";function _i(e,t,i){var s;const n=e&&"object"==typeof e?e:{},o=null!==(s=["areas","devices","floors","labels","views","entities"].find(e=>void 0!==n[e]))&&void 0!==s?s:"items";return a(`editor.matches_${o}_${1===t?"one":"many"}`,void 0,i)}let vi,yi;function bi(e,t){const i=e.indexOf(t);return-1===i?[e,""]:[e.slice(0,i),e.slice(i+t.length)]}const $i=new Set(["true","yes","on","1"]),wi=/:host|\.decluttering-container/;class xi extends c{constructor(){super(...arguments),this._shownAs=new Map,this._loadingTemplates=!1,this._ejectPending=!1,this._sectionsPending=!1,this._previewMode="yaml",this._copied=!1,this._markedLines=[],this._cannotOpen=!1,this._renderedTemplates={},this._renderingTemplates=new Set}static get styles(){return d`
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
    `}set lovelace(e){this._lovelace=e,this._templates=void 0,this._schema=void 0}_editingPlace(){const e=p(this),t=e?m(e):void 0;return null!=t?t:{view:f(this._lovelace)}}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}async connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=g(()=>this.requestUpdate())),await _()}setConfig(e){this._openedWith||(this._openedWith=e,this._resume=function(e,t,i=Date.now()){var s;const a=fi();if(!a)return;let n;try{const e=a.getItem(mi);n=e?JSON.parse(e):void 0}catch(o){n=void 0}if(n)if(i-n.at>18e5)a.removeItem(mi);else if(JSON.stringify(null!==(s=n.openedWith)&&void 0!==s?s:null)===JSON.stringify(null!=e?e:null))return a.removeItem(mi),n}(e)),this._config=e}willUpdate(){var e;if(this.hass&&this._config&&(this._lovelace||(this._lovelace=null!==(e=v())&&void 0!==e?e:void 0),this._lovelace)){if(!this._templates){const e=this._editingPlace();this._templates=y(this._lovelace,e.view,void 0,e.section),this._loadBorrowedTemplates()}this._schema||(this._schema=[{name:"template",label:a("editor.template_label",void 0,this.hass),selector:{select:{mode:"dropdown",custom_value:!0,options:b(this._templates,this.hass)}}},{name:"variables",label:a("editor.variables_label",void 0,this.hass),helper:a("editor.variables_helper",void 0,this.hass),selector:{object:{}}}])}}render(){if(!(this.hass&&this._config&&this._templates&&this._schema))return e``;const t=this._templates[this._config.template],i=$(t),s=this._hiddenNames(t,i),n=i.filter(e=>!s.has(e.name)),o=w(this._config.variables),r=x(this._config),l=!!t&&"card"===k(t)||!!r||void 0!==this._config.for_each||void 0!==this._config.for_each_from,c=this._formData(i),d=di(t,this._config,c.extras),h={};t||this._loadingTemplates||r&&!this._config.template||(h.template=a("editor.no_such_template",void 0,this.hass)),o||(h.variables=a("error.variables_shape",void 0,this.hass));const u=A(t);return e`
      ${(null==t?void 0:t.description)?e`<p class="description">${t.description}</p>`:e``}
      ${r?e`<ha-alert alert-type="info">
              ${a("editor.by_domain_hint",{templates:Object.entries(r).map(([e,t])=>`${e}: ${t}`).join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${void 0===u?e``:e`<ha-alert alert-type="warning">
              ${u?a("editor.template_deprecated_because",{message:u},this.hass):a("editor.template_deprecated",void 0,this.hass)}
            </ha-alert>`}
      ${this._renderResume()} ${this._renderResult(t)} ${this._renderSource(t)}
      ${this._renderStartFromExample(t)} ${this._renderDiagnostics(t,o)}
      ${this._renderMatches(t)}
      <ha-form
        .hass=${this.hass}
        .data=${c}
        .schema=${this._formSchema(n,l&&!d.repeat,d)}
        .error=${h}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._renderCardVariables(n)} ${this._renderEmptySlot(l)} ${this._renderAdvanced(d)}
      ${this._renderSectionPerCopy()}
      <decluttering-card-plus-health .hass=${this.hass} .lovelace=${this._lovelace}></decluttering-card-plus-health>
    `}_renderAdvanced(t){if(!this._config||t.advanced)return e``;const i=function(e){const t=Xt(e);let i=0;return void 0===t.grid_columns&&void 0===t.grid_rows||(i+=1),void 0!==t.style&&(i+=1),"show"!==t.on_error_mode&&(i+=1),t.strict&&(i+=1),t.rebuild_on&&(i+=1),"off"!==t.debug&&(i+=1),void 0!==t.name&&(i+=1),t.inherit_variables&&(i+=1),i}(this._config),s=Xt(this._config),n=this._onErrorMode&&"card"!==s.on_error_mode?Object.assign(Object.assign({},s),{on_error_mode:this._onErrorMode}):s;"card"===s.on_error_mode&&this._onErrorMode&&(this._onErrorMode=void 0);const o=ti(this._config),r=Kt(hi);return e`
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
            .schema=${function(e,t){return t.length?e.filter(e=>!t.includes(null==e?void 0:e.name)):e}(function(e){const t=t=>a(t,void 0,e),i=(e,i)=>e.map(e=>({value:e,label:/^\d+$/.test(e)?e:t(`${i}${e}`)}));return[{name:"grid_columns",label:t("editor.advanced.grid_columns_label"),helper:t("editor.advanced.grid_helper"),selector:{select:{mode:"dropdown",custom_value:!0,options:i(si,"editor.advanced.grid_")}}},{name:"grid_rows",label:t("editor.advanced.grid_rows_label"),selector:{select:{mode:"dropdown",custom_value:!0,options:i(ai,"editor.advanced.grid_")}}},{name:"style",label:t("editor.advanced.style_label"),helper:t("editor.advanced.style_helper"),selector:{text:{multiline:!0}}},{name:"on_error_mode",label:t("editor.advanced.on_error_label"),helper:t("editor.advanced.on_error_helper"),selector:{select:{mode:"dropdown",options:[{value:"show",label:t("editor.advanced.on_error_show")},{value:"hide",label:t("editor.advanced.on_error_hide")},{value:"card",label:t("editor.advanced.on_error_card")}]}}},{name:"strict",label:t("editor.advanced.strict_label"),helper:t("editor.advanced.strict_helper"),selector:{boolean:{}}},{name:"rebuild_on",label:t("editor.advanced.rebuild_on_label"),helper:t("editor.advanced.rebuild_on_helper"),selector:{entity:{multiple:!0}}},{name:"debug",label:t("editor.advanced.debug_label"),helper:t("editor.advanced.debug_helper"),selector:{select:{mode:"dropdown",options:[{value:"off",label:t("editor.advanced.debug_off")},{value:"json",label:t("editor.advanced.debug_json")},{value:"yaml",label:t("editor.advanced.debug_yaml")},{value:"console",label:t("editor.advanced.debug_console")},{value:"report",label:t("editor.advanced.debug_report")}]}}},{name:"name",label:t("editor.advanced.name_label"),helper:t("editor.advanced.name_helper"),selector:{text:{}}},{name:"inherit_variables",label:t("editor.advanced.inherit_label"),helper:t("editor.advanced.inherit_helper"),selector:{boolean:{}}}]}(this.hass),t.advancedFields)}
            .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
            .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
            @value-changed=${this._advancedChanged}
          ></ha-form>
          ${"card"===n.on_error_mode?Bt`<${r}
                  .hass=${this.hass}
                  .lovelace=${this._lovelace}
                  .value=${o}
                  .label=${a("editor.advanced.fallback_label",void 0,this.hass)}
                  .emptyHint=${a("editor.advanced.fallback_hint",void 0,this.hass)}
                  @value-changed=${this._fallbackChanged}
                ></${r}>`:e``}
        </div>
      </ha-expansion-panel>
    `}_advancedChanged(e){if(e.stopPropagation(),!this._config)return;const t=e.detail.value;this._onErrorMode="card"!==t.on_error_mode||ti(this._config)?void 0:"card",h(this,"config-changed",{config:ei(this._config,t)})}_fallbackChanged(e){e.stopPropagation(),this._config&&(e.detail.value&&(this._onErrorMode=void 0),h(this,"config-changed",{config:ii(this._config,e.detail.value)}))}_renderEmptySlot(t){if(!this._config||!t)return e``;if(!(void 0!==this._config.for_each||void 0!==this._config.for_each_from||void 0!==this._config.empty))return e``;const i=Kt(hi),s=this._config.empty;return Bt`<${i}
      .hass=${this.hass}
      .lovelace=${this._lovelace}
      .value=${s&&"object"==typeof s?s:void 0}
      .label=${a("editor.empty_label",void 0,this.hass)}
      .emptyHint=${a("editor.empty_slot_hint",void 0,this.hass)}
      @value-changed=${this._emptyChanged}
    ></${i}>`}_emptyChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);j(t,"empty",e.detail.value),h(this,"config-changed",{config:t})}_renderStartFromExample(t){const i=S(t);return i.length&&this._config&&!O(this._config.variables).length?e`
      <div class="examples">
        <p class="hint">${a("editor.start_from_example_hint",void 0,this.hass)}</p>
        ${i.map((t,i)=>e`
            <ha-button @click=${()=>this._startFromExample(t)}>
              ${a("editor.start_from_example",{number:i+1},this.hass)}
            </ha-button>
          `)}
      </div>
    `:e``}_startFromExample(e){e.length&&h(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{variables:e})})}_renderCardVariables(t){var i;const s=t.filter(e=>C(e));if(!s.length)return e``;const n=E(null===(i=this._config)||void 0===i?void 0:i.variables);return e`${s.map(t=>{var i;const s=n[t.name],o=!!s&&"object"==typeof s;return e`
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
      `})}`}_registryItemsForPreview(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.for_each_from;if(!this.hass||!T(t))return;const i=P(t);if(void 0===i||Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))try{const e=N(this.hass,t,Object.assign(Object.assign({},I(this._lovelace)),{rendered:this._renderedTemplates}));return e.length?e:void 0}catch(s){return}}_cardVariableChanged(e,t){var i,s;null==t||t.stopPropagation();const a=null===(i=null==t?void 0:t.detail)||void 0===i?void 0:i.config,n=O(null===(s=this._config)||void 0===s?void 0:s.variables).filter(t=>L(t)!==e);a&&"object"==typeof a&&n.push({[e]:a});const o=Object.assign({},this._config);n.length?o.variables=n:delete o.variables,h(this,"config-changed",{config:o})}_renderResult(t){var s,n,o;if(!this._config)return e``;const r=null!==(s=F(this._config.for_each))&&void 0!==s?s:this._registryItemsForPreview();let l=(null==r?void 0:r.length)?M(r[0],this._config.variables,0,r.length):this._config.variables,c=t,d=this._config.template;if(x(this._config))try{const e=null!==(n=this._templates)&&void 0!==n?n:{};let t;({template:c,name:d,entity:t}=q(this._config,l,t=>e[t],this.hass,Object.keys(e))),l=D(l,t)}catch(j){return e``}if(!c)return e``;const h=k(c);if(!h)return e``;const u=V(c);let p;const m=performance.now();try{const e=R(this.hass,i(this._config.rebuild_on)),t=null!==(o=this._lovelace)&&void 0!==o?o:v();p=z(H(l,c,u,d,e,!0,void 0,0,void 0,void 0,!1,{itemTemplates:U(t),context:I(t)}),this._config,h)}catch(S){return e`<ha-alert alert-type="warning">
        ${a("editor.result_error",{error:String(S)},this.hass)}
      </ha-alert>`}const f=performance.now(),g=(null==r?void 0:r.length)?a("editor.result_copies",{total:r.length},this.hass):"",[_,y]=bi(a("editor.result_hint",{kind:h},this.hass),"[[name]]"),b=W(p);b!==this._lastYaml&&(this._markedLines=function(e,t){const i=""===t?[]:t.replace(/\n$/,"").split("\n");if(void 0===e)return i.map(e=>({text:e,changed:!1}));const s=new Set(e.replace(/\n$/,"").split("\n"));return i.map(e=>({text:e,changed:!s.has(e)}))}(this._lastYaml,b),this._lastYaml=b);const $=function(e){return"card"===e?["rendered","yaml"]:["yaml"]}(h),w=$.includes(this._previewMode)?this._previewMode:"yaml",A=!(null==r?void 0:r.length)&&!T(this._config.for_each_from)&&p&&"object"==typeof p;return e`
      <div class="preview">
        <div class="preview-head">
          <span class="preview-title">${a("editor.preview.header",void 0,this.hass)}${g}</span>
          ${$.length>1?e`<div class="segmented" role="group">
                  ${$.map(t=>e`<button
                        type="button"
                        class=${t===w?"on":""}
                        aria-pressed=${t===w?"true":"false"}
                        @click=${()=>{this._previewMode=t}}
                      >
                        ${a(`editor.preview.${t}`,void 0,this.hass)}
                      </button>`)}
                </div>`:e``}
        </div>
        ${"rendered"===w?e`<div class="rendered">
                <hui-card .hass=${this.hass} .config=${p} .preview=${!0}></hui-card>
              </div>`:e`<pre class="yaml">
${this._markedLines.map(t=>e`<span class="l ${t.changed?"changed":""}">${t.text}</span>`)}</pre>`}
        <p class="hint">
          ${a("editor.preview.built_in",{time:pi(m,f),template:null!=d?d:""},this.hass)}
          ${"yaml"===w?a("editor.preview.changed_hint",void 0,this.hass):""}
        </p>
        <p class="hint">${_}<code>[[name]]</code>${y}</p>
        <div class="preview-actions">
          ${"yaml"===w?e`<ha-button @click=${()=>this._copyYaml(b)}>
                  ${a(this._copied?"editor.preview.copied":"editor.preview.copy",void 0,this.hass)}
                </ha-button>`:e``}
          ${A?e`
                  <ha-button @click=${()=>this._eject(p)}>
                    ${a(this._ejectPending?"editor.eject_confirm":"editor.eject",void 0,this.hass)}
                  </ha-button>
                `:e``}
        </div>
      </div>
    `}_copyYaml(e){K(e).then(e=>{this._copied=e,e&&setTimeout(()=>this._copied=!1,1500)})}_renderResume(){const t=this._resume;return t?e`<ha-alert alert-type="info">
      ${a("editor.link.resume",{template:t.template},this.hass)}
      <div class="actions">
        <ha-button
          @click=${()=>{this._resume=void 0,h(this,"config-changed",{config:t.config})}}
        >
          ${a("editor.link.resume_button",void 0,this.hass)}
        </ha-button>
        <ha-button
          @click=${()=>{this._resume=void 0}}
        >
          ${a("editor.link.discard_button",void 0,this.hass)}
        </ha-button>
      </div>
    </ha-alert>`:e``}_openTemplate(e){var t,i,s,a;const n=Y(),o=function(e,t){var i,s;const a=null==e?void 0:e.views;if(!Array.isArray(a))return;const n=e=>!!e&&u(e.type)&&e.template===t;for(let o=0;o<a.length;o+=1){const e=null!==(i=a[o])&&void 0!==i?i:{},t=Array.isArray(e.cards)?e.cards:[];for(let i=0;i<t.length;i+=1)if(n(t[i]))return[o,i];const r=Array.isArray(e.sections)?e.sections:[];for(let i=0;i<r.length;i+=1){const e=Array.isArray(null===(s=r[i])||void 0===s?void 0:s.cards)?r[i].cards:[];for(let t=0;t<e.length;t+=1)if(n(e[t]))return[o,i,t]}}}(null!==(t=null==n?void 0:n.config)&&void 0!==t?t:this._lovelace,e);if(!n||!o)return void(this._cannotOpen=!0);this._config&&function(e,i,s=Date.now()){const a=fi();if(a)try{a.setItem(mi,JSON.stringify(Object.assign(Object.assign({},e),{at:s})))}catch(t){}}({config:this._config,openedWith:this._openedWith,template:e});const r=function(e,t){var i,s,a,n,o;const r=null===(i=null==e?void 0:e.views)||void 0===i?void 0:i[t[0]];if(!r)return;const l=3===t.length?null===(n=null===(a=null===(s=r.sections)||void 0===s?void 0:s[t[1]])||void 0===a?void 0:a.cards)||void 0===n?void 0:n[t[2]]:null===(o=r.cards)||void 0===o?void 0:o[t[1]];return l&&"object"==typeof l?l:void 0}(n.config,o),l=null!==(i=document.querySelector("home-assistant"))&&void 0!==i?i:document.body,c=()=>{h(l,"show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>Promise.resolve(),dialogParams:{lovelaceConfig:n.config,cardConfig:r,saveCardConfig:e=>n.saveConfig(r?Q(n.config,r,e):n.config),saveConfig:e=>n.saveConfig(e),path:o}})},d=p(this);if(!d)return void c();this._config&&(null===(s=d._discardDirtyStateChanges)||void 0===s||s.call(d),"_dirty"in d&&(d._dirty=!1));let m=!1;const f=()=>{m||(m=!0,setTimeout(c,0))};d.addEventListener("dialog-closed",f,{once:!0});!1!==(null===(a=d.closeDialog)||void 0===a?void 0:a.call(d))&&setTimeout(f,400)}_renderSectionPerCopy(){var t;const i=null===(t=Y())||void 0===t?void 0:t.config;return this._config&&i&&B(i,this._config)?e`
      <div class="section-per-copy">
        <p class="hint">${a("editor.section_per_copy_hint",void 0,this.hass)}</p>
        ${this._sectionsError?e`<ha-alert alert-type="error">${this._sectionsError}</ha-alert>`:e``}
        <ha-button @click=${this._sectionPerCopy}>
          ${a(this._sectionsPending?"editor.section_per_copy_confirm":"editor.section_per_copy",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}async _sectionPerCopy(){var e,t;if(!this._sectionsPending)return void(this._sectionsPending=!0);this._sectionsPending=!1;const i=Y(),s=this._config;if(!i||!s)return;try{await J(this,this.hass,"section_per_copy",[{urlPath:G(),build:e=>Z(e,s)}])}catch(o){return void(this._sectionsError=a("tools.save_failed",{message:null!==(e=null==o?void 0:o.message)&&void 0!==e?e:o},this.hass))}let n=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;for(;n&&"hui-dialog-edit-card"!==n.localName;)n=n.parentNode instanceof ShadowRoot?n.parentNode.host:n.parentNode;null===(t=null==n?void 0:n.closeDialog)||void 0===t||t.call(n)}_eject(e){this._ejectPending?(this._ejectPending=!1,this._holdEjectUndo(e),h(this,"config-changed",{config:e})):this._ejectPending=!0}_holdEjectUndo(e){const t=Y();if(!t||!this._openedWith)return;const i=Q(t.config,this._openedWith,e);i!==t.config&&X({operation:"eject",at:Date.now(),dashboards:[{urlPath:G(),before:t.config,after:i}]})}_renderSource(t){var i;const s=null===(i=this._config)||void 0===i?void 0:i.template;if(!s||!t||this._loadingTemplates)return e``;const n=ee(this._lovelace,s);if(!n){const t=te(s);return e`<p class="hint">
        ${a("editor.source_borrowed",void 0,this.hass)}
        ${t?e`<a href=${o=t,`/${o.replace(/^\/+/,"")}`} target="_blank" rel="noreferrer"
                >${a("editor.link.open_dashboard",void 0,this.hass)}</a
              >`:e``}
      </p>`}var o;if(n.declared||!n.view)return e`<p class="hint">
        ${a("editor.source_declared",void 0,this.hass)}
        ${a("editor.link.raw_editor",void 0,this.hass)}
      </p>`;const{view:r}=n,l=document.location.pathname.split("/").slice(0,2).join("/"),[c,d]=bi(a("editor.source_view",{view:""},this.hass),"");return e`<p class="hint">
      ${c}<a href=${`${l}/${r.path||r.index}`} target="_blank" rel="noreferrer"
        >${r.title||r.path||a("editor.untitled_view",void 0,this.hass)}</a
      >${d}
      <a
        href="#"
        class="edit-template"
        @click=${e=>{e.preventDefault(),this._openTemplate(s)}}
        >${a("editor.link.edit_template",void 0,this.hass)}</a
      >
      ${this._cannotOpen?e`<br />${a("editor.link.cannot_open",void 0,this.hass)}`:e``}
    </p>`}_filledSource(e){var t,i;return ie(null===(t=this._config)||void 0===t?void 0:t.for_each_from,null===(i=this._config)||void 0===i?void 0:i.variables,e,this.hass)}_renderedTemplateNames(e){const t=this._filledSource(e),i=P(t);if(!this.hass||void 0===i)return[];if(!Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))return[];const s=new Set,a=N(this.hass,t,{rendered:this._renderedTemplates});for(const n of a)for(const e of Object.keys(n))s.add(e);return[...s]}_renderEditorTemplate(e){this.hass&&!this._renderingTemplates.has(e)&&(this._renderingTemplates.add(e),se(this.hass,e).then(t=>{this._renderingTemplates.delete(e),this._renderedTemplates=Object.assign(Object.assign({},this._renderedTemplates),{[e]:t})}))}_renderMatches(t){var i,s;if(!this.hass||!T(null===(i=this._config)||void 0===i?void 0:i.for_each_from))return e``;const n=this._filledSource(t);ae(n)&&!ne()&&oe(this.hass).then(()=>this.requestUpdate());const o=P(n);if(void 0!==o){const t=Object.prototype.hasOwnProperty.call(this._renderedTemplates,o)?this._renderedTemplates[o]:void 0;if(!t)return this._renderEditorTemplate(o),e`<p class="hint">${a("editor.matches_template_pending",void 0,this.hass)}</p>`;const i=re(t);if(!("list"in i)){const t="error"===i.problem?"editor.matches_template_failed":"editor.matches_template_not_list";return e`<ha-alert alert-type="warning"> ${a(t,{detail:i.detail},this.hass)} </ha-alert>`}}let r=[];try{r=N(this.hass,n,Object.assign(Object.assign({},I(this._lovelace)),{rendered:this._renderedTemplates}))}catch(c){return e``}if(!r.length)return e`<ha-alert alert-type="warning">
        ${a("editor.matches_none",{but:(null===(s=this._config)||void 0===s?void 0:s.empty)?a("editor.matches_none_but_empty",void 0,this.hass):""},this.hass)}
      </ha-alert>`;const l=r.slice(0,12);return e`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${1===r.length?a("editor.matches_header_one",{what:_i(n,1,this.hass)},this.hass):a("editor.matches_header_many",{count:r.length,what:_i(n,r.length,this.hass)},this.hass)}
        </span>
        <div class="matches">
          <ul>
            ${l.map((t,i)=>e`<li>${le(t,i)}</li>`)}
          </ul>
          ${r.length>l.length?e`<p class="hint">
                  ${a("editor.matches_more",{count:r.length-l.length},this.hass)}
                </p>`:e``}
          <p class="hint">
            ${a(void 0===o?"editor.matches_hint":"editor.matches_template_hint",void 0,this.hass)}
          </p>
        </div>
      </ha-expansion-panel>
    `}_hiddenNames(e,t){var i;const s=new Set;if(!t.some(e=>void 0!==e.show_if||void 0!==e.hide_if))return s;const a=E(ce(null===(i=this._config)||void 0===i?void 0:i.variables,e)),n=e=>a[e];for(const o of t)de(o,n)||s.add(o.name);return s}_formSchema(e,t,i){const s=t?(null!=vi||(vi=[{name:"for_each",label:a("editor.for_each_label"),helper:a("editor.for_each_helper"),selector:{object:{}}},{name:"for_each_from",label:a("editor.for_each_from_label"),helper:a("editor.for_each_from_helper"),selector:{object:{}}},{name:"gap",label:a("editor.gap_label"),helper:a("editor.gap_helper"),selector:{number:{min:0,max:64,mode:"box"}}},{name:"columns",label:a("editor.columns_label"),helper:a("editor.columns_helper"),selector:{number:{min:1,max:6,mode:"box"}}},{name:"min_column_width",label:a("editor.min_column_width_label"),helper:a("editor.min_column_width_helper"),selector:{number:{min:50,max:1e3,step:10,mode:"box"}}},{name:"lazy",label:a("editor.lazy_label"),helper:a("editor.lazy_helper"),selector:{boolean:{}}},{name:"lazy_eager",label:a("editor.lazy_eager_label"),helper:a("editor.lazy_eager_helper"),selector:{number:{min:0,max:100,mode:"box"}}}]),vi):[],n=i.fit?[]:(null!=yi||(yi=[{name:"fit",label:a("editor.fit_label"),helper:a("editor.fit_helper"),selector:{select:{mode:"dropdown",options:[{value:"box",label:a("editor.fit_box")},{value:"contents",label:a("editor.fit_contents")}]}}}]),yi);if(!e.length)return[...this._schema,...s,...n];const o=e=>{var t;return{name:gi+e.name,label:null!==(t=e.label)&&void 0!==t?t:e.name,helper:e.description,selector:ue(e),required:!0===e.required}},r=[];for(const a of he(e.filter(e=>!C(e))))void 0===a.group?r.push(...a.declarations.map(o)):r.push({name:"",type:"expandable",title:a.group,schema:a.declarations.map(o)});return[this._schema[0],...r,...i.extras?[]:[{name:"extras",label:a("editor.extras_label",void 0,this.hass),helper:a("editor.extras_helper",void 0,this.hass),selector:{object:{}}}],...s,...n]}_formData(e){var t,i,s,a,n,o,r,l,c,d,h;if(!e.length)return this._config;const u=E(null===(t=this._config)||void 0===t?void 0:t.variables),p=new Set(e.map(e=>e.name)),m={template:null===(i=this._config)||void 0===i?void 0:i.template};this._shownAs=new Map;for(const g of e){if(!(g.name in u)){"boolean"==typeof g.default&&"boolean"in ue(g)&&(this._shownAs.set(g.name,{shown:g.default,written:void 0}),m[gi+g.name]=g.default);continue}const e=u[g.name];if("boolean"!=typeof e&&"boolean"in ue(g)){const t=$i.has(String(e).trim().toLowerCase());this._shownAs.set(g.name,{shown:t,written:e}),m[gi+g.name]=t}else m[gi+g.name]=e}const f=O(null===(s=this._config)||void 0===s?void 0:s.variables).filter(e=>{const t=L(e);return void 0!==t&&!p.has(t)});return f.length&&(m.extras=f),void 0!==(null===(a=this._config)||void 0===a?void 0:a.for_each)&&(m.for_each=this._config.for_each),void 0!==(null===(n=this._config)||void 0===n?void 0:n.for_each_from)&&(m.for_each_from=this._config.for_each_from),void 0!==(null===(o=this._config)||void 0===o?void 0:o.columns)&&(m.columns=this._config.columns),void 0!==(null===(r=this._config)||void 0===r?void 0:r.min_column_width)&&(m.min_column_width=this._config.min_column_width),void 0!==(null===(l=this._config)||void 0===l?void 0:l.gap)&&(m.gap=this._config.gap),void 0!==(null===(c=this._config)||void 0===c?void 0:c.fit)&&(m.fit=this._config.fit),void 0!==(null===(d=this._config)||void 0===d?void 0:d.lazy)&&(m.lazy=this._config.lazy),void 0!==(null===(h=this._config)||void 0===h?void 0:h.lazy_eager)&&(m.lazy_eager=this._config.lazy_eager),m}_renderDiagnostics(t,s){var n,o,r,l,c,d,h,u,p,m,f,g,_,y,b,w,A,j,S,C;if(!t||this._loadingTemplates||!s||x(this._config))return e``;const E=[...me(null===(n=this._config)||void 0===n?void 0:n.for_each),...fe(null===(o=this._config)||void 0===o?void 0:o.for_each_from),...T(null===(r=this._config)||void 0===r?void 0:r.for_each_from)?pe:[],...this._renderedTemplateNames(t),...i(null===(l=this._config)||void 0===l?void 0:l.rebuild_on),...ge(t,_e(null===(c=this._config)||void 0===c?void 0:c.variables)),...Object.keys(U(null!==(d=this._lovelace)&&void 0!==d?d:v()))].map(e=>({[e]:null})),{missing:P,unused:N,required:I}=ve(null===(h=this._config)||void 0===h?void 0:h.variables,t,E,[null===(u=this._config)||void 0===u?void 0:u.for_each_from,null===(p=this._config)||void 0===p?void 0:p.on_error],ye(t,U(null!==(m=this._lovelace)&&void 0!==m?m:v()))),F=be(null===(f=this._config)||void 0===f?void 0:f.variables,t,this.hass),M=this._hiddenNames(t,$(t)),q=I.filter(e=>!M.has(e)),D=P.filter(e=>!I.includes(e)&&!M.has(e)),V=new Set(O(null===(g=this._config)||void 0===g?void 0:g.variables).map(L)),R=[...M].filter(e=>V.has(e)),z=wi.test(`${null!==(_=t.style)&&void 0!==_?_:""}\n${null!==(b=null===(y=this._config)||void 0===y?void 0:y.style)&&void 0!==b?b:""}`),H="contents"===(null===(w=this._config)||void 0===w?void 0:w.fit)&&z,W=Number(null===(A=this._config)||void 0===A?void 0:A.columns),K=(void 0!==(null===(j=this._config)||void 0===j?void 0:j.for_each)||void 0!==(null===(S=this._config)||void 0===S?void 0:S.for_each_from))&&W>1&&!(Number(null===(C=this._config)||void 0===C?void 0:C.min_column_width)>0),Y=k(t),B=$e(this._config,Y);return e`
      ${B.map(t=>{var i,s;return e`<ha-alert alert-type="warning">
            ${a("editor.override_misplaced",{key:t,kind:Y,template:null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""},this.hass)}
          </ha-alert>`})}
      ${K?e`<ha-alert alert-type="info">
              ${a("editor.columns_without_min_width",{columns:W},this.hass)}
            </ha-alert>`:e``}
      ${H?e`<ha-alert alert-type="warning">${a("editor.fit_hides_style",void 0,this.hass)}</ha-alert>`:e``}
      ${R.length?e`<ha-alert alert-type="warning">
              ${a(1===R.length?"editor.hidden_but_set_one":"editor.hidden_but_set_many",{names:R.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${q.length?e`<ha-alert alert-type="error">
              ${a(1===q.length?"editor.required_one":"editor.required_many",{names:q.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${D.length?e`<ha-alert alert-type="warning">
              ${a(1===D.length?"editor.optional_one":"editor.optional_many",{names:D.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${F.map(t=>e`<ha-alert alert-type="warning">
            ${a("editor.invalid_value",{name:t.name,expected:t.expected},this.hass)}
          </ha-alert>`)}
      ${N.length?e`<ha-alert alert-type="info">
              ${a(1===N.length?"editor.unused_one":"editor.unused_many",{names:N.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_valueChanged(e){var t,i;const s=e.detail.value,a=$(null===(t=this._templates)||void 0===t?void 0:t[s.template]);if(!a.length)return void h(this,"config-changed",{config:s});const n=[];for(const l of a){let e=s[gi+l.name];const t=this._shownAs.get(l.name);t&&e===t.shown&&(e=t.written),void 0!==e&&""!==e&&n.push({[l.name]:e})}Array.isArray(s.extras)&&n.push(...s.extras);const o=Object.assign(Object.assign({},this._config),{template:s.template}),r=we(O(null===(i=this._config)||void 0===i?void 0:i.variables),n);r.length?o.variables=r:delete o.variables,j(o,"for_each",s.for_each),j(o,"for_each_from",s.for_each_from),j(o,"columns",s.columns),j(o,"min_column_width",s.min_column_width),j(o,"gap",s.gap),j(o,"lazy",!0===s.lazy||void 0),j(o,"lazy_eager",s.lazy_eager),h(this,"config-changed",{config:o})}_loadBorrowedTemplates(){if(!xe(this._lovelace))return;this._loadingTemplates=!0;const e=this._editingPlace();ke(this.hass,this._lovelace,e.view,void 0,e.section).then(e=>{this._templates=e,this._schema=void 0}).finally(()=>{this._loadingTemplates=!1,this.requestUpdate()})}}o([l()],xi.prototype,"_lovelace",void 0),o([l()],xi.prototype,"_config",void 0),o([r()],xi.prototype,"hass",void 0),o([l()],xi.prototype,"_loadingTemplates",void 0),o([l()],xi.prototype,"_ejectPending",void 0),o([l()],xi.prototype,"_sectionsPending",void 0),o([l()],xi.prototype,"_sectionsError",void 0),o([l()],xi.prototype,"_onErrorMode",void 0),o([l()],xi.prototype,"_previewMode",void 0),o([l()],xi.prototype,"_copied",void 0),o([l()],xi.prototype,"_cannotOpen",void 0),o([l()],xi.prototype,"_resume",void 0),o([l()],xi.prototype,"_renderedTemplates",void 0);const ki=/^[a-z_]+\.[a-z0-9_]+$/,Ai={base:"entity",label:"Entity",selector:{entity:{}},matches:e=>ki.test(e)};function ji(e,t){return{base:e,label:t,selector:{text:{}},matches:e=>e.trim().length>0}}const Si={entity:Ai,entity_id:Ai,name:ji("name","Name"),title:ji("title","Title"),heading:ji("heading","Heading"),icon:{base:"icon",label:"Icon",selector:{icon:{}},matches:e=>e.includes(":")}};function Oi(e,t){return 1===t?e.label:`${e.label} ${t}`}const Ci=(e,t=200)=>{if("number"==typeof e&&(e=String(e)),"string"!=typeof e)return;const i=e.trim();return i?i.length>t?`${i.slice(0,t-1)}…`:i:void 0};function Ei(e){const t=Ci(e,2e3);if(t&&/^https?:\/\/[^\s/]+/i.test(t))return t}const Ti=e=>[].concat(null!=e?e:[]).map(e=>Ci(e)).filter(e=>!!e).slice(0,50);function Pi(e){if("string"==typeof e){const t=Ci(e);return t?{name:t}:void 0}if(!e||"object"!=typeof e||Array.isArray(e))return;const t=e,i=Ci(t.github),s={name:Ci(t.name),github:i&&/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(i)?i:void 0,email:Ci(t.email),url:Ei(t.url)};for(const a of Object.keys(s))void 0===s[a]&&delete s[a];return Object.keys(s).length?s:void 0}function Ni(e){const t=e&&"object"==typeof e?e:{},i={author:Pi(t.author),license:Ci(t.license),help:Ei(t.help),homepage:Ei(t.homepage),readme:Ci(t.readme,8e3),related:Ti(t.related),setup:Ti(t.setup)};for(const s of["author","license","help","homepage","readme"])void 0===i[s]&&delete i[s];return i}const Ii=["author","license","help","homepage","readme","requires","setup","related"];function Li(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);for(const i of Ii)delete t[i];return t}const Fi={integrations:{kind:"integration",key:"integration"},entities:{kind:"entity",key:"entity"},custom_cards:{kind:"custom_card",key:"card"}},Mi=e=>{const t=Ci(e,40);return t&&t.replace(/\+$/,"").trim()||void 0};function qi(e){var t;const i=null==e?void 0:e.requires;if(!i||"object"!=typeof i||Array.isArray(i))return[];const s=[];for(const[a,{kind:n,key:o}]of Object.entries(Fi))for(const e of[].concat(null!==(t=i[a])&&void 0!==t?t:[]).slice(0,50)){const t=e&&"object"==typeof e&&!Array.isArray(e)?e:void 0,i=Ti(t?t[o]:e).map(e=>"custom_card"===n?e.replace(/^custom:/,""):e);if(!i.length)continue;const a=t?Ci(t.message,300):void 0;s.push(a?{kind:n,any:i,message:a}:{kind:n,any:i})}for(const a of["homeassistant","card"]){const e=Mi(i[a]);e&&s.push({kind:a,any:[e]})}return s}function Di(e,t){var i,s;const a=e=>e.split(".").map(e=>parseInt(e,10)||0),n=a(e),o=a(t);for(let r=0;r<Math.max(n.length,o.length);r++){const e=null!==(i=n[r])&&void 0!==i?i:0,t=null!==(s=o[r])&&void 0!==s?s:0;if(e!==t)return e>t}return!0}function Vi(e,t){switch(e.kind){case"integration":{const i=new Set;for(const e of t.components)i.add(e),i.add(e.split(".").pop());return e.any.some(e=>i.has(e))}case"entity":return e.any.some(e=>{const i=function(e){const t=e.replace(/[.+?^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*");return new RegExp(`^${t}$`,"i")}(e);return t.entities.some(e=>i.test(e))});case"custom_card":return e.any.some(e=>t.isDefined(e));case"homeassistant":return!t.homeassistant||Di(t.homeassistant,e.any[0]);case"card":return t.card.startsWith("0.0.0")||Di(t.card,e.any[0])}}function Ri(e,t){const i=je(e),s=Array.isArray(i)?i.filter(e=>e&&"object"==typeof e):i&&"object"==typeof i?Object.entries(i).map(([e,t])=>({[e]:t})):[],a=s.find(e=>Object.prototype.hasOwnProperty.call(e,t)),n=null==a?void 0:a[t];return"string"==typeof n||"number"==typeof n?String(n):void 0}function zi(e,t){const i=Ni(e).setup.filter(e=>"string"==typeof t[e]&&""!==t[e]);if(!i.length)return e;const s=je(e),a=(Array.isArray(s)?s.filter(e=>e&&"object"==typeof e):s&&"object"==typeof s?Object.entries(s).map(([e,t])=>({[e]:t})):[]).filter(e=>!i.some(t=>Object.prototype.hasOwnProperty.call(e,t))),n=Object.assign(Object.assign({},e),{default:[...i.map(e=>({[e]:t[e]})),...a]});return delete n[Se],n}const Hi={integrations:"requires_integrations",entities:"requires_entities",custom_cards:"requires_custom_cards"},Ui=e=>"string"==typeof e?e:"number"==typeof e?String(e):void 0,Wi=e=>[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);const Ki=e=>"string"==typeof e&&e.trim()?e.trim():void 0,Yi=e=>[].concat(null!=e?e:[]).map(Ki).filter(e=>!!e);const Bi=[Ce,Ee,...Te],Ji=["card","badge","row","element","group"],Zi=["type","template","description","author","license","help","homepage","readme","requires","setup","related","variables","default",...Ji,"style"];function Gi(e,t){if(Array.isArray(e))for(const i of e)Gi(i,t);else if(e&&"object"==typeof e){t(e);for(const i of Object.values(e))Gi(i,t)}}function Qi(e){const t=new Set,i=new Set;Gi(e,e=>{const s=e.type;if("string"==typeof s){s.startsWith("custom:")&&!Bi.includes(s)&&t.add(s);for(const t of Pe(e))i.add(t)}});for(const s of Oe(e))i.add(s);return{customTypes:[...t].sort(),templateRefs:[...i].sort()}}function Xi(e,t){const i=e&&"object"==typeof e&&void 0!==e[Se]?Object.assign(Object.assign({},e),{default:je(e)}):e,s={};for(const a of Zi)void 0!==(null==i?void 0:i[a])&&(s[a]=i[a]);for(const a of Object.keys(null!=i?i:{}))a in s||a===Se||"source"===a||(s[a]=i[a]);const{customTypes:n,templateRefs:o}=Qi(e),r=[];if(t){const i={},a=[...o],n=null==e?void 0:e.template,l=new Set(Ni(e).related.filter(e=>e!==n));for(a.push(...l);a.length;){const e=a.shift();if(e in i)continue;const s=t[e];if(s){i[e]=es(s),a.push(...Qi(s).templateRefs);for(const e of Ni(s).related)e===n||l.has(e)||(l.add(e),a.push(e))}else l.has(e)||r.push(e)}Object.keys(i).length&&(s.includes=i)}else r.push(...o);const l=[];n.length&&l.push(a("share.requires_custom_cards",{types:n.join(", ")})),r.length&&l.push(a("share.uses_other_templates",{names:r.join(", ")}));const c=function(e){const t=null==e?void 0:e.requires;return t&&"object"==typeof t?["homeassistant","card"].filter(e=>"number"==typeof t[e]):[]}(e);return c.length&&l.push(a("share.version_unquoted",{keys:c.join(", ")})),{payload:s,notes:l}}function es(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);return delete t.source,t}function ts(e,t){if(!t.includes(e))return e;let i=2;for(;t.includes(`${e}_${i}`);)i+=1;return`${e}_${i}`}function is(e){if(!e||"object"!=typeof e||Array.isArray(e))return{ok:!1,errors:[a("share.import_not_a_template")]};const t=[];"string"==typeof e.template&&e.template.trim()||t.push(a("share.import_no_name"));const i=Ji.filter(t=>void 0!==e[t]);return 0===i.length?t.push(a("share.import_defines_nothing")):i.length>1&&t.push(a("share.import_defines_both",{first:i[0],second:i[1]})),{ok:0===t.length,errors:t}}function ss(e,t){const i=new Set;for(const s of e)for(const e of Qi(s).customTypes){const s=e.slice(7);s&&!t(s)&&i.add(s)}return[...i].sort()}const as=["card","badge","row","element","group"],ns=/^[A-Za-z0-9_-]+$/,os=/^[a-z_]+\.[a-z0-9_]+$/;function rs(e){return as.find(t=>void 0!==(null==e?void 0:e[t])&&null!==(null==e?void 0:e[t]))}function ls(e){return e.map(e=>"number"==typeof e?`#${e+1}`:e).join(" › ")}function cs(e){const t=new Set;for(const a of Ne(null==e?void 0:e.variables))a&&"string"==typeof a.name&&t.add(a.name);const i=JSON.stringify(null!=e?e:{}),s=/\[\[([A-Za-z0-9_-]+)/g;for(let a=s.exec(i);a;a=s.exec(i))t.add(a[1]);return[...t]}function ds(e){return"boolean"==typeof e?"boolean":"number"==typeof e?"number":"string"==typeof e&&os.test(e)?"entity":"string"==typeof e&&/^[a-z]+:[a-z0-9-]+$/.test(e)?"icon":"text"}function hs(e,t,i){if(!t.length)return i;const[s,...a]=t;return Array.isArray(e)?e.map((e,t)=>t===s?hs(e,a,i):e):Object.assign(Object.assign({},e),{[s]:hs(null==e?void 0:e[s],a,i)})}const us=["card","badge","row","element","group","style","let","default","grid_options","name"],ps="default:",ms="or:";function fs(e){return e.startsWith(ms)?e.slice(3):Me(e)}function gs(e,t,i){if(!e.includes("[[")&&!e.includes("]]"))return;const s=function(e){let t=0,i=!1;for(let s=0;s<e.length-1;s+=1){const a=e.slice(s,s+2);"[["===a?(t+=1,s+=1):"]]"===a&&(0===t?i=!0:t-=1,s+=1)}return{unclosed:t>0,stray:i}}(e);s.unclosed&&i.findings.push({level:"warning",key:"lint.unclosed",params:{},path:t}),s.stray&&i.findings.push({level:"warning",key:"lint.stray_close",params:{},path:t});let a=e;for(let n=0;n<5;n+=1){let e=!1;if(a=a.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(s,a)=>(e=!0,a.startsWith(qe)||_s(a,t,i),"_")),!e)break}}function _s(e,t,i){const s=e.endsWith("?")?e.slice(0,-1):e,[a,...n]=s.split("|"),o=`[[${e}]]`,r=(a.endsWith("?")?a.slice(0,-1):a).split(".")[0];r&&"_"!==r&&!i.heads.has(r)&&i.heads.set(r,t);let l=!1;for(const c of n){if(!De(c)){const e=Ve(c);i.findings.push({level:"warning",key:"lint.unknown_step",params:e?{step:c,placeholder:o,closest:e}:{step:c,placeholder:o},path:t});continue}(c.startsWith(ps)||c.startsWith(ms))&&l&&i.findings.push({level:"warning",key:"lint.after_default",params:{step:c,placeholder:o},path:t}),c.startsWith(ps)&&c.length>8&&(l=!0);const e=fs(c);e&&"_"!==e&&i.targets.push({name:e,placeholder:o,path:t})}}function vs(e,t,i){if("string"!=typeof e){if(Array.isArray(e))e.forEach((e,s)=>vs(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,a]of Object.entries(e))gs(s,t,i),vs(a,t?`${t}.${s}`:s,i)}else gs(e,t,i)}function ys(e){const t=new Set;for(const i of $(e))t.add(i.name);for(const i of[..._e(je(e)),..._e(null==e?void 0:e.let)]){const e=L(i);void 0!==e&&t.add(e)}return[...t]}function bs(e,t=[]){if(!e||"object"!=typeof e)return[];const i={findings:[],heads:new Map,targets:[]};for(const n of us){const t=e[n];void 0!==t&&vs(t,n,i)}$(e).forEach((e,t)=>{void 0!==e.default&&vs(e.default,`variables[${t}].default`,i);for(const s of["show_if","hide_if"]){const a=`variables[${t}].${s}`;for(const t of Le(e,s)){const e=t.slice(3);if(!Fe(t)){i.findings.push({level:"warning",key:"lint.condition_malformed",params:{key:s,condition:e},path:a});continue}const n=Me(t);n&&i.targets.push({name:n.split(".")[0],placeholder:`${s}: ${e}`,path:a})}}});const s=new Set([...ys(e),...t,...pe,...ge(e)]),a=[...i.findings],o=e=>s.has(e)||i.heads.has(e),r=e=>o(e)||e.split(".").some((e,t,i)=>t>0&&o(i.slice(0,t).join(".")));for(const d of i.targets){if(r(d.name))continue;const e=n(d.name,[...s,...i.heads.keys()]);a.push({level:"warning",key:"lint.target_unknown",params:e?{name:d.name,placeholder:d.placeholder,closest:e}:{name:d.name,placeholder:d.placeholder},path:d.path})}const l=[...i.heads.entries()].filter(([e])=>!s.has(e));l.length&&a.push({level:"info",key:"lint.undeclared",params:{names:l.map(([e,t])=>l.length>1?`${e} (${t})`:e).join(", ")},path:l.length>1?"":l[0][1]});for(const d of function(e){return li(e).filter(e=>!oi.includes(e)).map(e=>{const t=n(e,oi);return t?{name:e,closest:t}:{name:e}})}(e))a.push({level:"warning",key:"lint.editor_hide_unknown",params:Object.assign({},d),path:"editor_hide"});const c=new Set;return a.filter(e=>{const t=JSON.stringify([e.key,e.params,e.path]);return!c.has(t)&&(c.add(t),!0)})}const $s={card:{type:"entity",entity:"sun.sun"},badge:{type:"entity",entity:"sun.sun"},row:{entity:"sun.sun"},element:{type:"icon",icon:"mdi:weather-sunny",style:{color:"yellow"}}},ws=50,xs=e=>!!customElements.get(e),ks=e=>e.actions.length>0||e.urls.length>0||e.embeds||e.scripts||e.placeholders||e.overlay;const As=500,js="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z";function Ss(t){const i=e=>{var i;return t.onInput(null!==(i=e.target.value)&&void 0!==i?i:"")},s=e=>{var i;return null===(i=t.onKeydown)||void 0===i?void 0:i.call(t,e)};return xs("ha-input")?e`<ha-input
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
      ></ha-textfield>`}async function Os(e,t,i,s){var n;if(!Y())return e._toolError=a("tools.cannot_save_here",void 0,e.hass),!1;e._busy=!0,e._toolError=void 0;try{return await J(e,e.hass,i,[{urlPath:G(),build:t}],s),e._undoChanged=void 0,!0}catch(o){return e._toolError=a("tools.save_failed",{message:null!==(n=null==o?void 0:o.message)&&void 0!==n?n:o},e.hass),!1}finally{e._busy=!1}}const Cs=d`
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

  ${ze.styles}
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
`
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,Es=2,Ts=e=>(...t)=>({_$litDirective$:e,values:t});let Ps=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:Ns}=He,Is=e=>e,Ls=()=>document.createComment(""),Fs=(e,t,i)=>{const s=e._$AA.parentNode,a=void 0===t?e._$AB:t._$AA;if(void 0===i){const t=s.insertBefore(Ls(),a),n=s.insertBefore(Ls(),a);i=new Ns(t,n,e,e.options)}else{const t=i._$AB.nextSibling,n=i._$AM,o=n!==e;if(o){let t;i._$AQ?.(e),i._$AM=e,void 0!==i._$AP&&(t=e._$AU)!==n._$AU&&i._$AP(t)}if(t!==a||o){let e=i._$AA;for(;e!==t;){const t=Is(e).nextSibling;Is(s).insertBefore(e,a),e=t}}}return i},Ms=(e,t,i=e)=>(e._$AI(t,i),e),qs={},Ds=(e,t=qs)=>e._$AH=t,Vs=e=>{e._$AR(),e._$AA.remove()},Rs=Ts(class extends Ps{constructor(){super(...arguments),this.key=Ue}render(e,t){return this.key=e,t}update(e,[t,i]){return t!==this.key&&(Ds(e),this.key=t),i}}),zs=[{name:"room_light_tile",summary:"A tile per light, with the light named after itself.",template:{description:"A tile for one light, taking its name from Home Assistant.",variables:[{name:"entity",label:"Light",selector:{entity:{domain:"light"}},required:!0},{name:"name",label:"Name",description:"Leave empty to use the light’s own name",selector:{text:{}}}],card:{type:"tile",entity:"[[entity]]",name:"[[name|or:entity|friendly_name]]",features:[{type:"light-brightness"}]}}},{name:"room_summary",summary:"A heading per area, listing the lights in it. Uses grouping.",template:{description:"One card per area, with a tile for every light in that area.",card:{type:"vertical-stack",cards:[{type:"markdown",content:"## [[area]]\n\n[[entity_count]] lights"},{type:"custom:decluttering-card-plus",template:"room_light_tile",for_each:"[[items]]"}]}}},{name:"sensor_line",summary:"An Entities row showing one sensor with its area.",template:{description:"A row for one sensor, labelled with the area it is in.",variables:[{name:"entity",label:"Sensor",selector:{entity:{}},required:!0}],row:{entity:"[[entity]]",name:"[[entity|friendly_name]] ([[entity|area|default:no area]])"}}},{name:"status_badge",summary:"A badge that only appears when something needs attention.",template:{description:"A badge for one entity, hidden unless it is in the state you care about.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0},{name:"when",label:"Show when the state is",selector:{text:{}},default:"on"}],badge:{type:"entity",entity:"[[entity]]",visibility:[{condition:"state",entity:"[[entity]]",state:"[[when]]"}]}}},{name:"counted_grid",summary:'A numbered grid of anything, showing "3 of 12".',template:{description:"A tile that knows where it sits in a repeat.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0}],card:{type:"tile",entity:"[[entity]]",name:"[[entity|friendly_name]]",footer:{type:"markdown",content:"[[index]] of [[total|or:count]]"}}}}];
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Hs(e){return zs.find(t=>t.name===e)}function Us(e,t){const i=new Set,s=e=>{Array.isArray(e)?e.forEach(s):e&&"object"==typeof e&&("string"==typeof e.type&&e.type.includes("decluttering-card")&&"string"==typeof e.template&&i.add(e.template),Object.values(e).forEach(s))};return s(e.template),[...i].filter(e=>!t.includes(e))}function Ws(e,t){return{library:e,version:t}}
/*! js-yaml 5.5.0 https://github.com/nodeca/js-yaml @license MIT */var Ks=Symbol("NOT_RESOLVED");function Ys(e,t){return{tagName:e,nodeKind:"scalar",implicit:t.implicit??!1,matchByTagPrefix:t.matchByTagPrefix??!1,implicitFirstChars:t.implicitFirstChars??null,resolve:t.resolve,identify:t.identify,represent:t.represent??(e=>String(e)),representTagName:t.representTagName??(()=>e)}}function Bs(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"sequence",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addItem:t.addItem,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}function Js(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"mapping",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addPair:t.addPair,has:t.has,keys:t.keys,get:t.get,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}var Zs=Ys("tag:yaml.org,2002:str",{resolve:e=>e,identify:e=>"string"==typeof e}),Gs=["","~","null","Null","NULL"],Qs=Ys("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==Gs.indexOf(e)?null:Ks,identify:e=>null===e,represent:()=>"null"}),Xs=Ys("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(e,t)=>"null"===e||t&&""===e?null:Ks,identify:e=>null===e,represent:()=>"null"}),ea=["","~","null","Null","NULL"],ta=Ys("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==ea.indexOf(e)?null:Ks,identify:e=>null===e,represent:()=>"null"}),ia=["true","True","TRUE"],sa=["false","False","FALSE"],aa=Ys("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:e=>-1!==ia.indexOf(e)||-1===sa.indexOf(e)&&Ks,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),na=["true"],oa=["false"],ra=Ys("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:e=>-1!==na.indexOf(e)||-1===oa.indexOf(e)&&Ks,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),la=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],ca=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],da=Ys("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:e=>-1!==la.indexOf(e)||-1===ca.indexOf(e)&&Ks,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),ha=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),ua=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var pa=Ys("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e,t){if(t){if(!ua.test(e))return Ks}else if(!ha.test(e))return Ks;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:Ks},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),ma=new RegExp("^-?(?:0|[1-9][0-9]*)$"),fa=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var ga=Ys("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!fa.test(e))return Ks}else if(!ma.test(e))return Ks;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:Ks},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),_a=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$");var va=Ys("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e){if(!_a.test(e))return Ks;const t=function(e){let t=e.replace(/_/g,""),i=1;if("-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b"))return i*parseInt(t.slice(2),2);if(t.startsWith("0x"))return i*parseInt(t.slice(2),16);if(t.includes(":")){let e=0;for(const i of t.split(":"))e=60*e+Number(i);return i*e}return"0"!==t&&"0"===t[0]?i*parseInt(t,8):i*parseInt(t,10)}(e);return Number.isFinite(t)?t:Ks},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),ya=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ba=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var $a=Ys("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!ya.test(e))return Ks;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const s=i*parseFloat(t);return Number.isFinite(s)||ba.test(e)?s:Ks},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),wa=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),xa=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var ka=Ys("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!xa.test(e))return Ks;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const s=i*parseFloat(t);return Number.isFinite(s)?s:Ks}if(!wa.test(e))return Ks;const i=Number(e);return Number.isFinite(i)?i:Ks},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),Aa=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ja=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var Sa=Ys("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!Aa.test(e))return Ks;let t=e.toLowerCase().replace(/_/g,"");const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;let s=0;if(t.includes(":")){for(const e of t.split(":"))s=60*s+Number(e);s*=i}else s=i*parseFloat(t);return Number.isFinite(s)||ja.test(e)?s:Ks},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),Oa=Ys("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(e,t)=>"<<"===e||t&&""===e?"<<":Ks,identify:()=>!1}),Ca=/^[A-Za-z0-9+/]*={0,2}$/;var Ea=Ys("tag:yaml.org,2002:binary",{resolve:function(e){const t=e.replace(/\s/g,"");if(t.length%4!=0||!Ca.test(t))return Ks;const i=atob(t),s=new Uint8Array(i.length);for(let a=0;a<i.length;a++)s[a]=i.charCodeAt(a);return s},identify:e=>"[object Uint8Array]"===Object.prototype.toString.call(e),represent:function(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t)}}),Ta=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Pa=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function Na(e,t,i,s=0,a=0,n=0,o=0){const r=new Date(Date.UTC(e,t,i,s,a,n,o));return r.setUTCFullYear(e,t,i),r}var Ia=Ys("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(e){let t=Ta.exec(e);if(null===t&&(t=Pa.exec(e)),null===t)return Ks;const i=+t[1],s=+t[2]-1,a=+t[3];if(!t[4]){const e=Na(i,s,a);return e.getUTCFullYear()!==i||e.getUTCMonth()!==s||e.getUTCDate()!==a?Ks:e}const n=+t[4],o=+t[5],r=+t[6];let l=0;if(n>23||o>59||r>59)return Ks;if(t[7]){let e=t[7].slice(0,3);for(;e.length<3;)e+="0";l=+e}const c=Na(i,s,a,n,o,r,l);if(c.getUTCFullYear()!==i||c.getUTCMonth()!==s||c.getUTCDate()!==a)return Ks;if(t[9]){const e=+t[10],i=+(t[11]||0);if(e>23||i>59)return Ks;const s=6e4*(60*e+i);c.setTime(c.getTime()-("-"===t[9]?-s:s))}return c},identify:e=>e instanceof Date,represent:e=>e.toISOString()}),La=Bs("tag:yaml.org,2002:seq",{create:()=>[],addItem:(e,t)=>{e.push(t)},identify:Array.isArray});function Fa(e){if(null===e||"object"!=typeof e||Array.isArray(e))return!1;const t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}function Ma(e,t){const i={};for(const s of t)void 0!==e[s]&&(i[s]=e[s]);return i}var qa=Bs("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(e,t)=>{let i;if(t instanceof Map){if(1!==t.size)return"cannot resolve an ordered map item";i=t.keys().next().value}else{if(!Fa(t))return"cannot resolve an ordered map item";{const e=Object.keys(t);if(1!==e.length)return"cannot resolve an ordered map item";i=e[0]}}return e.seen.has(i)?"duplicate key in ordered map":(e.seen.add(i),e.list.push(t),"")},finalize:e=>e.list,identify:()=>!1}),Da=Bs("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(e,t)=>{if(t instanceof Map)return 1!==t.size?"cannot resolve a pairs item":(e.push(t.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(t))return"cannot resolve a pairs item";const i=t,s=Object.keys(i);return 1!==s.length?"cannot resolve a pairs item":(e.push([s[0],i[s[0]]]),"")},identify:()=>!1}),Va=Js("tag:yaml.org,2002:map",{create:()=>({}),identify:Fa,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{if(null!==t&&"object"==typeof t)return"object-based map does not support complex keys";const s=String(t);return"__proto__"===s?Object.defineProperty(e,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[s]=i,""},has:(e,t)=>(null===t||"object"!=typeof t)&&Object.prototype.hasOwnProperty.call(e,String(t)),keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}}),Ra=Js("tag:yaml.org,2002:set",{create:()=>new Set,identify:e=>e instanceof Set,represent:e=>{const t=new Map;for(const i of e)t.set(i,null);return t},addPair:(e,t,i)=>null!==i?"cannot resolve a set item":(e.add(t),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:()=>null});var za=class e{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(e){const t=function(e){const t=[];for(const i of e){let e=t.length;for(let s=0;s<t.length;s++){const a=t[s];if(a.nodeKind===i.nodeKind&&a.tagName===i.tagName&&a.matchByTagPrefix===i.matchByTagPrefix){e=s;break}}t[e]=i}return t}(e),i=[],s={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},a={scalar:[],sequence:[],mapping:[]};for(const c of t){if("scalar"===c.nodeKind&&c.implicit){if(c.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(c)}switch(c.nodeKind){case"scalar":c.matchByTagPrefix?a.scalar.push(c):s.scalar[c.tagName]=c;break;case"sequence":c.matchByTagPrefix?a.sequence.push(c):s.sequence[c.tagName]=c;break;case"mapping":c.matchByTagPrefix?a.mapping.push(c):s.mapping[c.tagName]=c}}const n=i.filter(e=>null===e.implicitFirstChars),o=new Set;for(const c of i)if(null!==c.implicitFirstChars)for(const e of c.implicitFirstChars)o.add(e);const r=new Map;for(const c of o)r.set(c,i.filter(e=>null===e.implicitFirstChars||-1!==e.implicitFirstChars.indexOf(c)));const l=s.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=t,this.implicitScalarTags=i,this.implicitScalarByFirstChar=r,this.implicitScalarAnyFirstChar=n,this.defaultScalarTag=l,this.defaultSequenceTag=s.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=s.mapping["tag:yaml.org,2002:map"],this.exact=s,this.prefix=a}lookupScalarTag(e){const t=this.exact.scalar[e];if(t)return t;for(const i of this.prefix.scalar)if(e.startsWith(i.tagName))return i}lookupSequenceTag(e){const t=this.exact.sequence[e];if(t)return t;for(const i of this.prefix.sequence)if(e.startsWith(i.tagName))return i}lookupMappingTag(e){const t=this.exact.mapping[e];if(t)return t;for(const i of this.prefix.mapping)if(e.startsWith(i.tagName))return i}resolveImplicitScalarTag(e){const t=this.implicitScalarByFirstChar.get(e.charAt(0))??this.implicitScalarAnyFirstChar;for(const s of t){const t=s.resolve(e,!1,s.tagName);if(t!==Ks)return{value:t,tag:s}}const i=this.defaultScalarTag;return{value:i.resolve(e,!1,i.tagName),tag:i}}withTags(...t){let i=[];for(const e of t)i=i.concat(e);return new e([...this.tags,...i])}},Ha=new za([Zs,La,Va]);new za([...Ha.tags,Xs,ra,ga,ka]);var Ua=new za([...Ha.tags,Qs,aa,pa,$a]);function Wa(e){if(Array.isArray(e)){const t=Array.prototype.slice.call(e);for(let e=0;e<t.length;e++){if(Array.isArray(t[e]))return null;"object"==typeof t[e]&&"[object Object]"===Object.prototype.toString.call(t[e])&&(t[e]="[object Object]")}return String(t)}return"object"==typeof e&&"[object Object]"===Object.prototype.toString.call(e)?"[object Object]":String(e)}new za([...Ha.tags,ta,da,va,Sa,Ia,Oa,Ea,qa,Da,Ra]).withTags({...va,resolve:(e,t,i)=>{const s=va.resolve(e,t,i);return s===Ks?pa.resolve(e,t,i):s}},{...Sa,resolve:(e,t,i)=>{const s=Sa.resolve(e,t,i);return s===Ks?$a.resolve(e,t,i):s}}),Js("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(e,t,i)=>(e.set(t,i),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:(e,t)=>e.get(t),identify:e=>e instanceof Map||Fa(e),represent:e=>{if(e instanceof Map)return e;const t=new Map,i=e;for(const s of Object.keys(i))t.set(s,i[s]);return t}}),Js("tag:yaml.org,2002:map",{create:()=>({}),identify:Fa,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{const s=Wa(t);return null===s?"nested arrays are not supported inside keys":("__proto__"===s?Object.defineProperty(e,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[s]=i,"")},has:(e,t)=>{const i=Wa(t);return null!==i&&Object.prototype.hasOwnProperty.call(e,i)},keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}});var Ka={maxLength:79,indent:1,linesBefore:3,linesAfter:2};function Ya(e,t,i,s,a){let n="",o="";const r=Math.floor(a/2)-1;return s-t>r&&(n=" ... ",t=s-r+n.length),i-s>r&&(o=" ...",i=s+r-o.length),{str:n+e.slice(t,i).replace(/\t/g,"→")+o,pos:s-t+n.length}}function Ba(e,t){return" ".repeat(Math.max(t-e.length,0))+e}function Ja(e,t){let i="";return e.mark?(e.mark.name&&(i+=`in "${e.mark.name}" `),i+=`(${e.mark.line+1}:${e.mark.column+1})`,!t&&e.mark.snippet&&(i+=`\n\n${e.mark.snippet}`),`${e.reason} ${i}`):e.reason}var Za=class e extends Error{reason;mark;constructor(e,t){super(),this.name="YAMLException",this.reason=e,this.mark=t,this.message=Ja(this,!1),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}toString(e){return`${this.name}: ${Ja(this,e)}`}static throwAt(t,i,s,a=""){let n=0,o=0;for(let e=0;e<i;e++){const i=t.charCodeAt(e);10===i?(n++,o=e+1):13===i&&(n++,10===t.charCodeAt(e+1)&&e++,o=e+1)}const r={name:a,buffer:t,position:i,line:n,column:i-o};throw r.snippet=function(e,t){if(!e.buffer)return null;const i={...Ka,...t},s=/\r?\n|\r|\0/g,a=[0],n=[];let o,r=-1;for(;o=s.exec(e.buffer);)n.push(o.index),a.push(o.index+o[0].length),e.position<=o.index&&r<0&&(r=a.length-2);r<0&&(r=a.length-1);let l="";const c=Math.min(e.line+i.linesAfter,n.length).toString().length,d=i.maxLength-(i.indent+c+3);for(let u=1;u<=i.linesBefore&&!(r-u<0);u++){const t=Ya(e.buffer,a[r-u],n[r-u],e.position-(a[r]-a[r-u]),d);l=`${" ".repeat(i.indent)}${Ba((e.line-u+1).toString(),c)} | ${t.str}\n${l}`}const h=Ya(e.buffer,a[r],n[r],e.position,d);l+=`${" ".repeat(i.indent)}${Ba((e.line+1).toString(),c)} | ${h.str}\n`,l+=`${"-".repeat(i.indent+c+3+h.pos)}^\n`;for(let u=1;u<=i.linesAfter&&!(r+u>=n.length);u++){const t=Ya(e.buffer,a[r+u],n[r+u],e.position-(a[r]-a[r+u]),d);l+=`${" ".repeat(i.indent)}${Ba((e.line+u+1).toString(),c)} | ${t.str}\n`}return l.replace(/\n$/,"")}(r),new e(s,r)}},Ga=1,Qa=2,Xa=3,en=4,tn=5,sn=6,an=1,nn=2,on=3,rn=4,ln=5,cn=1,dn=2,hn=1,un=2,pn=3;function mn(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}var fn=new Array(256),gn=new Array(256);for(let wl=0;wl<256;wl++)fn[wl]=mn(wl)?1:0,gn[wl]=mn(wl);function _n(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function vn(e){return e>=48&&e<=57?e-48:(32|e)-97+10}function yn(e){return 120===e?2:117===e?4:8}function bn(e,t,i){let s=0;for(;t<i;){const i=e.charCodeAt(t);if(10===i)s++,t++;else if(13===i)s++,t++,10===e.charCodeAt(t)&&t++;else{if(32!==i&&9!==i)break;t++}}return{position:t,breaks:s}}function $n(e){return 1===e?" ":"\n".repeat(e-1)}function wn(e,t,i,s,a,n){const o=s<0?0:s,r=e.slice(t,i).replace(/\r\n?/g,"\n"),l=""===r?[]:(r.endsWith("\n")?r.slice(0,-1):r).split("\n");let c="",d=!1,h=0,u=!1;for(const p of l){let e=0;for(;e<o&&32===p.charCodeAt(e);)e++;if(s<0||e>=p.length){h++;continue}const t=p.slice(o),i=t.charCodeAt(0);n?32===i||9===i?(u=!0,c+="\n".repeat(d?1+h:h)):u?(u=!1,c+="\n".repeat(h+1)):0===h?d&&(c+=" "):c+="\n".repeat(h):c+="\n".repeat(d?1+h:h),c+=t,d=!0,h=0}return a===pn?c+="\n".repeat(d?1+h:h):a!==un&&d&&(c+="\n"),c}function xn(e,t){if(-1===t.valueStart)return"";const{valueStart:i,valueEnd:s}=t;if(t.fast)return e.slice(i,s);switch(t.style){case nn:return function(e,t,i){let s="",a=t,n=t,o=t;for(;a<i;){const t=e.charCodeAt(a);if(39===t)s+=e.slice(n,a)+"'",a+=2,n=o=a;else if(10===t||13===t){s+=e.slice(n,o);const t=bn(e,a,i);s+=$n(t.breaks),a=n=o=t.position}else a++,32!==t&&9!==t&&(o=a)}return s+e.slice(n,i)}(e,i,s);case on:return function(e,t,i){let s="",a=t,n=t,o=t;for(;a<i;){const t=e.charCodeAt(a);if(92===t){s+=e.slice(n,a),a++;const t=e.charCodeAt(a);if(10===t||13===t)a=bn(e,a,i).position;else if(t<256&&fn[t])s+=gn[t],a++;else{let i=yn(t),n=0;for(;i>0;i--)a++,n=(n<<4)+vn(e.charCodeAt(a));s+=_n(n),a++}n=o=a}else if(10===t||13===t){s+=e.slice(n,o);const t=bn(e,a,i);s+=$n(t.breaks),a=n=o=t.position}else a++,32!==t&&9!==t&&(o=a)}return s+e.slice(n,i)}(e,i,s);case rn:return wn(e,i,s,t.indent,t.chomping,!1);case ln:return wn(e,i,s,t.indent,t.chomping,!0);default:return function(e,t,i){let s="",a=t,n=t,o=t;for(;a<i;){const t=e.charCodeAt(a);if(10===t||13===t){s+=e.slice(n,o);const t=bn(e,a,i);s+=$n(t.breaks),a=n=o=t.position}else a++,32!==t&&9!==t&&(o=a)}return s+e.slice(n,o)}(e,i,s)}}var kn=Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"});function An(e){let t="",i=0;for(;i<e.length;){if(37!==e.charCodeAt(i)){t+=e[i++];continue}let s=parseInt(e.slice(i+1,i+3),16);if(i+=3,s>=192){let t=s<224?1:s<240?2:3;for(s&=(1<<6-t)-1;t-- >0;)s=s<<6|63&parseInt(e.slice(i+1,i+3),16),i+=3}s<65536?t+=String.fromCharCode(s):(s-=65536,t+=String.fromCharCode(55296|s>>10,56320|1023&s))}return t}function jn(e,t){if(e.startsWith("!<")&&e.endsWith(">"))return An(e.slice(2,-1));const i=e.indexOf("!",1),s=-1===i?"!":e.slice(0,i+1);return An(t?.[s]??kn[s]??s)+An(e.slice(s.length))}var Sn=-1,On={filename:"",schema:Ua,json:!1,maxTotalMergeKeys:1e4,maxAliases:-1};function Cn(e){return"tagStart"in e&&e.tagStart!==Sn?e.tagStart:"anchorStart"in e&&e.anchorStart!==Sn?e.anchorStart:"valueStart"in e&&e.valueStart!==Sn?e.valueStart:"start"in e?e.start:0}function En(e,t){Za.throwAt(e.source,e.position,t,e.filename)}function Tn(e,t,i,s){try{return i.finalize(s)}catch(a){if(a instanceof Za)throw a;Za.throwAt(e.source,t,a instanceof Error?a.message:String(a),e.filename)}}function Pn(e,t){const i=xn(e.source,t),s=t.tagStart===Sn?"":e.source.slice(t.tagStart,t.tagEnd),a=e.schema.defaultScalarTag;if(""!==s){if("!"===s)return{value:i,tag:a};const t=jn(s,e.tagHandlers),n=e.schema.lookupScalarTag(t);if(n){const s=n.resolve(i,!0,t);return s===Ks&&En(e,`cannot resolve a node with !<${t}> explicit tag`),{value:s,tag:n}}const o=e.schema.lookupMappingTag(t)??e.schema.lookupSequenceTag(t);if(o){""!==i&&En(e,`cannot resolve a node with !<${t}> explicit tag`);const s=o.create(t);return{value:o.carrierIsResult?s:Tn(e,e.position,o,s),tag:o}}En(e,`unknown scalar tag !<${t}>`)}return t.style===an?e.schema.resolveImplicitScalarTag(i):{value:a.resolve(i,!1,a.tagName),tag:a}}function Nn(e,t,i){const s=t.tagStart===Sn?"":e.source.slice(t.tagStart,t.tagEnd);return""===s||"!"===s?i:jn(s,e.tagHandlers)}function In(e){return"mapping"===e.nodeKind}function Ln(e){e.totalMergeKeys++,-1!==e.maxTotalMergeKeys&&e.totalMergeKeys>e.maxTotalMergeKeys&&En(e,`merge keys exceeded maxTotalMergeKeys (${e.maxTotalMergeKeys})`)}function Fn(e,t,i,s){Ln(e);for(const a of s.keys(i)){if(Ln(e),t.tag.has(t.value,a))continue;const n=t.tag.addPair(t.value,a,s.get(i,a));n&&En(e,n),t.overridable??=new Set,t.overridable.add(a)}}function Mn(e,t,i,s,a){if(e.position=t.keyPosition,t.keyIsMerge)return void function(e,t,i,s){if(e.position=t.keyPosition,In(s))Fn(e,t,i,s);else if("sequence"===s.nodeKind&&Array.isArray(i)){i.length>100&&En(e,"abnormal merge sequence size");for(const s of i){const i=e.nodeTags.get(s);i||En(e,"cannot merge mappings; the provided source object is unacceptable"),Fn(e,t,s,i)}}else En(e,"cannot merge mappings; the provided source object is unacceptable")}(e,t,s,a);e.json||!t.tag.has(t.value,i)||t.overridable?.has(i)||En(e,"duplicated mapping key");const n=t.tag.addPair(t.value,i,s);n&&En(e,n),t.overridable?.delete(i)}function qn(e,t,i){const s=e.frames[e.frames.length-1];if("document"===s.kind)s.value=t,s.hasValue=!0;else if("sequence"===s.kind){In(i)&&e.nodeTags.set(t,i);const a=s.tag.addItem(s.value,t,s.index++);a&&En(e,a)}else if(s.hasKey){const a=s.key;s.key=void 0,s.hasKey=!1,Mn(e,s,a,t,i)}else s.key=t,s.keyPosition=e.position,s.hasKey=!0,s.keyIsMerge="tag:yaml.org,2002:merge"===i.tagName}function Dn(e,t,i,s,a){if(t.anchorStart!==Sn){const n={value:i,tag:s,isValueFinal:a};return e.anchors.set(e.source.slice(t.anchorStart,t.anchorEnd),n),n}return null}var Vn=-1,Rn=Object.prototype.hasOwnProperty,zn=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Hn=/[,\[\]{}]/,Un=/^(?:!|!!|![0-9A-Za-z-]+!)$/,Wn=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,Kn=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`,Yn=new RegExp(`^(?:${Wn})*$`),Bn=new RegExp(`^(?:${Kn})+$`),Jn=new RegExp(`^(?:!(?:${Wn})*|${Kn}(?:${Wn})*)$`),Zn={filename:"",maxDepth:100};function Gn(e,t,i,s,a,n,o){e.events.push({type:Qa,start:t,anchorStart:i,anchorEnd:s,tagStart:a,tagEnd:n,style:o})}function Qn(e,t,i,s,a,n,o){e.events.push({type:Xa,start:t,anchorStart:i,anchorEnd:s,tagStart:a,tagEnd:n,style:o})}function Xn(e,t){e.events.splice(t.eventsLength,0,{type:Xa,start:t.position,anchorStart:Vn,anchorEnd:Vn,tagStart:Vn,tagEnd:Vn,style:dn})}function eo(e,t,i,s,a,n,o,r,l=hn,c=-1,d=!1){e.events.push({type:en,valueStart:t,valueEnd:i,anchorStart:s,anchorEnd:a,tagStart:n,tagEnd:o,style:r,chomping:l,indent:c,fast:d})}function to(e){e.events.push({type:sn})}function io(e){eo(e,Vn,Vn,Vn,Vn,Vn,Vn,an)}function so(){return{anchorStart:Vn,anchorEnd:Vn,tagStart:Vn,tagEnd:Vn}}function ao(e){return{position:e.position,line:e.line,lineStart:e.lineStart,lineIndent:e.lineIndent,firstTabInLine:e.firstTabInLine,eventsLength:e.events.length}}function no(e,t){e.position=t.position,e.line=t.line,e.lineStart=t.lineStart,e.lineIndent=t.lineIndent,e.firstTabInLine=t.firstTabInLine,e.events.length=t.eventsLength}function oo(e,t){Za.throwAt(e.input.slice(0,e.length),e.position,t,e.filename)}function ro(e){return 10===e||13===e}function lo(e){return 9===e||32===e}function co(e){return lo(e)||ro(e)}function ho(e){return 0===e||co(e)}function uo(e){return 44===e||91===e||93===e||123===e||125===e}function po(e){return e>=48&&e<=57?e-48:-1}function mo(e){if(e>=48&&e<=57)return e-48;const t=32|e;return t>=97&&t<=102?t-97+10:-1}function fo(e){return 120===e?2:117===e?4:85===e?8:0}function go(e){return 48===e||97===e||98===e||116===e||9===e||110===e||118===e||102===e||114===e||101===e||32===e||34===e||47===e||92===e||78===e||95===e||76===e||80===e}function _o(e){10===e.input.charCodeAt(e.position)?e.position++:(e.position++,10===e.input.charCodeAt(e.position)&&e.position++),e.line++,e.lineStart=e.position,e.lineIndent=0,e.firstTabInLine=-1}function vo(e,t){let i=0,s=e.input.charCodeAt(e.position),a=e.position===e.lineStart||co(e.input.charCodeAt(e.position-1));for(;0!==s;){for(;lo(s);)a=!0,9===s&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),s=e.input.charCodeAt(++e.position);if(t&&a&&35===s)do{s=e.input.charCodeAt(++e.position)}while(!ro(s)&&0!==s);if(!ro(s))break;for(_o(e),i++,a=!0,s=e.input.charCodeAt(e.position);32===s;)e.lineIndent++,s=e.input.charCodeAt(++e.position)}return i}function yo(e,t=e.position){const i=e.input.charCodeAt(t);if((45===i||46===i)&&i===e.input.charCodeAt(t+1)&&i===e.input.charCodeAt(t+2)){const i=e.input.charCodeAt(t+3);return 0===i||co(i)}return!1}function bo(e){e.position===e.lineStart&&65279===e.input.charCodeAt(e.position)&&(e.position++,e.lineStart=e.position)}function $o(e){if(e.position!==e.lineStart)return!1;if(yo(e))return!0;if(65279!==e.input.charCodeAt(e.position))return!1;const t=ao(e);bo(e),vo(e,!0);const i=e.input.charCodeAt(e.position),s=e.position===e.lineStart&&(37===i||45===i&&yo(e));return no(e,t),s}function wo(e){let t=e.input.charCodeAt(e.position);for(;0!==t&&!ro(t);)t=e.input.charCodeAt(++e.position)}function xo(e,t,i){const s=zn.exec(e.input.slice(t,i));null!==s&&(e.position=t+s.index+s[0].length-1,oo(e,"the stream contains non-printable characters"))}function ko(e,t,i){if(33!==e.input.charCodeAt(e.position))return!1;t.tagStart!==Vn&&oo(e,"duplication of a tag property");const s=e.position;let a=!1,n=!1,o="!",r=e.input.charCodeAt(++e.position);60===r?(a=!0,r=e.input.charCodeAt(++e.position)):33===r&&(n=!0,o="!!",r=e.input.charCodeAt(++e.position));let l,c=e.position;if(a){for(;0!==r&&62!==r;)r=e.input.charCodeAt(++e.position);62!==r&&oo(e,"unexpected end of the stream within a verbatim tag"),l=e.input.slice(c,e.position),e.position++}else{for(;!(0===r||co(r)||i&&uo(r));)33===r&&(n?oo(e,"tag suffix cannot contain exclamation marks"):(o=e.input.slice(c-1,e.position+1),Un.test(o)||oo(e,"named tag handle cannot contain such characters"),n=!0,c=e.position+1)),r=e.input.charCodeAt(++e.position);l=e.input.slice(c,e.position),Hn.test(l)&&oo(e,"tag suffix cannot contain flow indicator characters")}return l&&!(a?Yn.test(l):Bn.test(l))&&oo(e,`tag name cannot contain such characters: ${l}`),a||"!"===o||"!!"===o||Rn.call(e.tagHandlers,o)||oo(e,`undeclared tag handle "${o}"`),t.tagStart=s,t.tagEnd=e.position,!0}function Ao(e,t){if(38!==e.input.charCodeAt(e.position))return!1;t.anchorStart!==Vn&&oo(e,"duplication of an anchor property"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!co(e.input.charCodeAt(e.position))&&!uo(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&oo(e,"name of an anchor node must contain at least one character"),t.anchorStart=i,t.anchorEnd=e.position,!0}function jo(e,t){if(42!==e.input.charCodeAt(e.position))return!1;t.anchorStart===Vn&&t.tagStart===Vn||oo(e,"alias node should not have any properties"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!co(e.input.charCodeAt(e.position))&&!uo(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&oo(e,"name of an alias node must contain at least one character"),function(e,t,i){e.events.push({type:tn,anchorStart:t,anchorEnd:i})}(e,i,e.position),!0}function So(e,t){vo(e,!1),e.lineIndent<t&&oo(e,"deficient indentation")}function Oo(e,t,i,s){if(!function(e,t){const i=e.input.charCodeAt(e.position),s=1===t;if(0===i||co(i)||35===i||38===i||42===i||33===i||124===i||62===i||39===i||34===i||37===i||64===i||96===i||uo(i))return!1;if(63===i||45===i){const t=e.input.charCodeAt(e.position+1);if(ho(t)||s&&uo(t))return!1}return!0}(e,i))return!1;const a=e.position;let n=e.position,o=e.input.charCodeAt(e.position);const r=1===i;let l=!1;for(;0!==o&&!$o(e);){if(58===o){const t=e.input.charCodeAt(e.position+1);if(ho(t)||r&&uo(t))break}else if(35===o){if(co(e.input.charCodeAt(e.position-1)))break}else{if(r&&uo(o))break;if(ro(o)){const i=e.position,s=e.line,a=e.lineStart,n=e.lineIndent;if(vo(e,!1),e.lineIndent>=t){l=!0,o=e.input.charCodeAt(e.position);continue}e.position=i,e.line=s,e.lineStart=a,e.lineIndent=n;break}}lo(o)||(n=e.position+1),o=e.input.charCodeAt(++e.position)}return n!==a&&(xo(e,a,n),eo(e,a,n,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,an,hn,-1,!l),!0)}function Co(e,t){const i=e.line;vo(e,!0),(e.line>i&&e.lineIndent<t||-1!==e.firstTabInLine&&e.lineIndent<t)&&oo(e,"deficient indentation")}function Eo(e,t,i){if(-1!==e.firstTabInLine||45!==e.input.charCodeAt(e.position)||!ho(e.input.charCodeAt(e.position+1)))return!1;for(Gn(e,e.position,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,cn);45===e.input.charCodeAt(e.position)&&ho(e.input.charCodeAt(e.position+1));){-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,oo(e,"tab characters must not be used in indentation"));const i=e.line;e.position++;const s=vo(e,!0)>0;if(-1!==e.firstTabInLine&&45===e.input.charCodeAt(e.position)&&ho(e.input.charCodeAt(e.position+1))&&oo(e,"bad indentation of a sequence entry"),s&&e.lineIndent<=t?io(e):Po(e,t,3,!1,!0),vo(e,!0),e.lineIndent<t||e.position>=e.length)break;e.lineIndent>t&&oo(e,"bad indentation of a sequence entry"),e.line===i&&45===e.input.charCodeAt(e.position)&&ho(e.input.charCodeAt(e.position+1))&&oo(e,"bad indentation of a sequence entry")}return to(e),!0}function To(e,t,i,s){let a=!1,n=!1,o=!1,r=!1;if(-1!==e.firstTabInLine)return!1;let l=e.input.charCodeAt(e.position);for(;0!==l;){a||-1===e.firstTabInLine||(e.position=e.firstTabInLine,oo(e,"tab characters must not be used in indentation"));const c=e.input.charCodeAt(e.position+1),d=e.line;if(63!==l&&58!==l||!ho(c)){a&&(io(e),a=!1);const t=ao(e);if(!Po(e,i,2,!1,!0))break;if(e.line===d){for(l=e.input.charCodeAt(e.position);lo(l);)l=e.input.charCodeAt(++e.position);if(58===l)l=e.input.charCodeAt(++e.position),ho(l)||oo(e,"a whitespace character is expected after the key-value separator within a block mapping"),o||(e.events.splice(t.eventsLength,0,{type:Xa,start:t.position,anchorStart:s.anchorStart,anchorEnd:s.anchorEnd,tagStart:s.tagStart,tagEnd:s.tagEnd,style:cn}),o=!0),n=!0,a=!1,r=!1;else{if(!n)return s.anchorStart===Vn&&s.tagStart===Vn||(no(e,t),!1);oo(e,"expected ':' after a mapping key")}}else{if(!n)return s.anchorStart===Vn&&s.tagStart===Vn||(no(e,t),!1);oo(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else o||(Qn(e,e.position,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,cn),o=!0),63===l?(a&&io(e),n=!0,a=!0):(a||(io(e),n=!0),a=!1),e.position+=1,r=!0;if(Po(e,t,4,!0,r)&&(r=!1),a||r&&(io(e),r=!1),vo(e,!0),l=e.input.charCodeAt(e.position),(e.line===d||e.lineIndent>t)&&0!==l)oo(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return!!n&&(a&&io(e),o&&to(e),!0)}function Po(e,t,i,s,a,n=!0){e.depth>=e.maxDepth&&oo(e,`nesting exceeded maxDepth (${e.maxDepth})`),e.depth++;let o=1,r=!1,l=!1,c=null;const d=so();let h=4===i||3===i,u=h;const p=h;if(s&&vo(e,!0)&&(r=!0,o=e.lineIndent>t?1:e.lineIndent===t?0:-1),1===o)for(;;){const s=e.input.charCodeAt(e.position),a=ao(e);if(r&&1!==o&&(33===s||38===s))break;if(r&&p&&(d.tagStart!==Vn||d.anchorStart!==Vn)&&(33===s||38===s)){const i=ao(e),s=t+1;if(To(e,e.position-e.lineStart,s,d)&&e.events[i.eventsLength]?.type===Xa)return e.depth--,!0;no(e,i)}if(r&&(33===s&&d.tagStart!==Vn||38===s&&d.anchorStart!==Vn))break;if(!ko(e,d,1===i)&&!Ao(e,d))break;null===c&&(c=a),vo(e,!0)?(r=!0,u=p,o=e.lineIndent>t?1:e.lineIndent===t?0:-1):u=!1}if(u&&(u=r||a),1===o||4===i){const s=1===i||2===i?t:t+1,a=e.position-e.lineStart;if(1===o)if(u&&(Eo(e,a,d)||To(e,a,s,d))||function(e,t,i){const s=e.input.charCodeAt(e.position),a=123===s,n=e.position;let o=!0;if(91!==s&&123!==s)return!1;const r=a?125:93;for(a?Qn(e,n,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,dn):Gn(e,n,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,dn),e.position++;0!==e.input.charCodeAt(e.position);){Co(e,t);let i=e.input.charCodeAt(e.position);if(i===r)return e.position++,to(e),!0;o?44===i&&oo(e,"expected the node content, but found ','"):oo(e,"missed comma between flow collection entries");let s=!1,n=!1;63===i&&co(e.input.charCodeAt(e.position+1))&&(s=n=!0,e.position+=1,Co(e,t));const l=e.line,c=ao(e),d=Po(e,t,1,!1,!0);Co(e,t),i=e.input.charCodeAt(e.position),(a||n||e.line===l)&&58===i?(s=!0,e.position++,Co(e,t),a||Xn(e,c),d||io(e),Po(e,t,1,!1,!0)||io(e),Co(e,t),a||to(e)):a&&s?(d||io(e),io(e)):a?io(e):s&&(Xn(e,c),d||io(e),io(e),to(e)),i=e.input.charCodeAt(e.position),44===i?(o=!0,e.position++):o=!1}oo(e,"unexpected end of the stream within a flow collection")}(e,s,d))l=!0;else{const t=e.input.charCodeAt(e.position);if(null!==c&&n&&p&&!u&&124!==t&&62!==t){const t=ao(e),i=c.position-c.lineStart;no(e,c),To(e,i,s,so())&&e.events[t.eventsLength]?.type===Xa?l=!0:no(e,t)}!l&&(h&&function(e,t,i){const s=e.input.charCodeAt(e.position);let a=hn,n=-1,o=!1;if(124!==s&&62!==s)return!1;const r=124===s?rn:ln;for(e.position++;0!==e.input.charCodeAt(e.position);){const i=e.input.charCodeAt(e.position),s=po(i);if(43===i||45===i)a!==hn&&oo(e,"repeat of a chomping mode identifier"),a=43===i?pn:un,e.position++;else{if(!(s>=0))break;0===s&&oo(e,"bad explicit indentation width of a block scalar; it cannot be less than one"),o&&oo(e,"repeat of an indentation width identifier"),n=t+s-1,o=!0,e.position++}}let l=!1;for(;lo(e.input.charCodeAt(e.position));)l=!0,e.position++;l&&35===e.input.charCodeAt(e.position)&&wo(e),ro(e.input.charCodeAt(e.position))?_o(e):0!==e.input.charCodeAt(e.position)&&oo(e,"a line break is expected");let c=o?n:-1,d=0;const h=e.position;let u=e.position;for(;0!==e.input.charCodeAt(e.position);){const i=e.position;let s=0;for(;32===e.input.charCodeAt(i+s);)s++;const a=e.input.charCodeAt(i+s);if(0===a){c>=0?s>c&&(u=i+s):s>0&&(u=i+s);break}if($o(e))break;if(!o&&-1===c&&ro(a)&&(d=Math.max(d,s)),o||-1!==c||ro(a)||(9===a&&s<t&&(e.position=i+s,oo(e,"tab characters must not be used in indentation")),s>=t&&s<d&&(e.position=i+s,oo(e,"bad indentation of a mapping entry"))),-1===c&&0!==a&&!ro(a)&&s<t){e.lineIndent=s,e.position=i+s;break}o||0===a||ro(a)||-1!==c||(c=s);const n=-1===c?t+1:c;if(0!==a&&!ro(a)&&s<n){e.lineIndent=s,e.position=i+s;break}wo(e),u=e.position,ro(e.input.charCodeAt(e.position))&&(_o(e),u=e.position)}return xo(e,h,u),eo(e,h,u,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,r,a,c),!0}(e,s,d)||function(e,t,i){if(39!==e.input.charCodeAt(e.position))return!1;e.position++;const s=e.position;let a=!0;for(;0!==e.input.charCodeAt(e.position);){const n=e.input.charCodeAt(e.position);if(39===n){if(39===e.input.charCodeAt(e.position+1)){a=!1,e.position+=2;continue}const t=e.position;return e.position++,eo(e,s,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,nn,hn,-1,a),!0}ro(n)?(a=!1,So(e,t)):e.position===e.lineStart&&yo(e)?oo(e,"unexpected end of the document within a single quoted scalar"):9!==n&&n<32?oo(e,"expected valid JSON character"):e.position++}oo(e,"unexpected end of the stream within a single quoted scalar")}(e,s,d)||function(e,t,i){if(34!==e.input.charCodeAt(e.position))return!1;e.position++;const s=e.position;let a=!0;for(;0!==e.input.charCodeAt(e.position);){const n=e.input.charCodeAt(e.position);if(34===n){const t=e.position;return e.position++,eo(e,s,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,on,hn,-1,a),!0}if(92===n){a=!1;const i=e.input.charCodeAt(++e.position);if(ro(i))So(e,t);else if(go(i))e.position++;else{let t=fo(i);for(0===t&&oo(e,"unknown escape sequence");t-- >0;)e.position++,mo(e.input.charCodeAt(e.position))<0&&oo(e,"expected hexadecimal character");e.position++}}else ro(n)?(a=!1,So(e,t)):e.position===e.lineStart&&yo(e)?oo(e,"unexpected end of the document within a double quoted scalar"):9!==n&&n<32?oo(e,"expected valid JSON character"):e.position++}oo(e,"unexpected end of the stream within a double quoted scalar")}(e,s,d)||jo(e,d)||Oo(e,s,i,d))&&(l=!0)}else 0===o&&(l=u&&Eo(e,a,d))}return h=h&&!l,l||d.anchorStart===Vn&&d.tagStart===Vn&&!h||(eo(e,Vn,Vn,d.anchorStart,d.anchorEnd,d.tagStart,d.tagEnd,an),l=!0),e.depth--,l||d.anchorStart!==Vn||d.tagStart!==Vn}function No(e){if(e.lineIndent>0||37!==e.input.charCodeAt(e.position))return!1;e.position++;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!co(e.input.charCodeAt(e.position));)e.position++;const i=e.input.slice(t,e.position),s=[];for(0===i.length&&oo(e,"directive name must not be less than one character in length");0!==e.input.charCodeAt(e.position)&&!ro(e.input.charCodeAt(e.position));){for(;lo(e.input.charCodeAt(e.position));)e.position++;if(35===e.input.charCodeAt(e.position)||ro(e.input.charCodeAt(e.position))||0===e.input.charCodeAt(e.position))break;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!co(e.input.charCodeAt(e.position));)e.position++;s.push(e.input.slice(t,e.position))}if(ro(e.input.charCodeAt(e.position))&&_o(e),"YAML"===i){e.directives.some(e=>"yaml"===e.kind)&&oo(e,"duplication of %YAML directive"),1!==s.length&&oo(e,"YAML directive accepts exactly one argument");const t=/^([0-9]+)\.([0-9]+)$/.exec(s[0]);null===t&&oo(e,"ill-formed argument of the YAML directive"),1!==parseInt(t[1],10)&&oo(e,"unacceptable YAML version of the document"),e.directives.push({kind:"yaml",version:s[0]})}else if("TAG"===i){2!==s.length&&oo(e,"TAG directive accepts exactly two arguments");const[t,i]=s;Un.test(t)||oo(e,"ill-formed tag handle (first argument) of the TAG directive"),Rn.call(e.tagHandlers,t)&&oo(e,`there is a previously declared suffix for "${t}" tag handle`),Jn.test(i)||oo(e,"ill-formed tag prefix (second argument) of the TAG directive"),e.tagHandlers[t]=i,e.directives.push({kind:"tag",handle:t,prefix:i})}return!0}function Io(e){e.directives=[],e.tagHandlers=Object.create(null);let t=!1;for(vo(e,!0);No(e);)t=!0,vo(e,!0);let i=!1,s=!1,a=!0;if(0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)&&ho(e.input.charCodeAt(e.position+3))){i=!0;const t=e.line;e.position+=3,vo(e,!0),a=e.line>t}else t&&oo(e,"directives end mark is expected");const n=e.events.length;if(!i&&e.position===e.lineStart&&46===e.input.charCodeAt(e.position)&&yo(e))return e.position+=3,void vo(e,!0);if(function(e,t,i){e.events.push({type:Ga,explicitStart:t,explicitEnd:i,directives:e.directives})}(e,i,!1),Po(e,e.lineIndent-1,4,!1,a,a)||io(e),vo(e,!0),e.position===e.lineStart&&yo(e)&&(s=46===e.input.charCodeAt(e.position),s)){const t=e.line;e.position+=3,vo(e,!0),e.line===t&&e.position<e.length&&oo(e,"end of the stream or a document separator is expected")}const o=e.events[n];o?.type===Ga&&(o.explicitEnd=s),to(e),!s&&e.position<e.length&&!$o(e)&&oo(e,"end of the stream or a document separator is expected")}var Lo={...Zn,...On};function Fo(e,t={}){const i={...Lo,...t},s=String(e),a=Object.keys(Zn),n=Object.keys(On);return function(e,t){const i={...On,...t,events:e,documents:[],eventIndex:0,position:0,frames:[],anchors:new Map,nodeTags:new Map,tagHandlers:Object.create(null),totalMergeKeys:0,aliasCount:0};for(;i.eventIndex<i.events.length;){const e=i.events[i.eventIndex++];switch(i.position=Cn(e),e.type){case Ga:i.anchors=new Map,i.nodeTags=new Map,i.aliasCount=0,i.tagHandlers=Object.create(null);for(const t of e.directives)"tag"===t.kind&&(i.tagHandlers[t.handle]=t.prefix);i.frames.push({kind:"document",position:i.position,value:void 0,hasValue:!1});break;case en:{const{value:t,tag:s}=Pn(i,e);Dn(i,e,t,s,!0),qn(i,t,s);break}case Qa:{const t=Nn(i,e,"tag:yaml.org,2002:seq"),s=i.schema.lookupSequenceTag(t);s||En(i,`unknown sequence tag !<${t}>`);const a=s.create(t),n=Dn(i,e,a,s,s.carrierIsResult);i.frames.push({kind:"sequence",position:i.position,value:a,tag:s,anchor:n,index:0});break}case Xa:{const t=Nn(i,e,"tag:yaml.org,2002:map"),s=i.schema.lookupMappingTag(t);s||En(i,`unknown mapping tag !<${t}>`);const a=s.create(t),n=Dn(i,e,a,s,s.carrierIsResult);i.frames.push({kind:"mapping",position:i.position,value:a,tag:s,anchor:n,key:void 0,keyPosition:i.position,hasKey:!1,keyIsMerge:!1,overridable:null});break}case tn:{-1!==i.maxAliases&&++i.aliasCount>i.maxAliases&&En(i,`aliases exceeded maxAliases (${i.maxAliases})`);const t=i.source.slice(e.anchorStart,e.anchorEnd),s=i.anchors.get(t);s||En(i,`unidentified alias "${t}"`),s.isValueFinal||En(i,`recursive alias "${t}" is not supported for tag ${s.tag.tagName} because it uses finalize()`),qn(i,s.value,s.tag);break}case sn:{const e=i.frames.pop();if("mapping"===e.kind&&e.hasKey&&(i.position=e.keyPosition,En(i,"incomplete mapping pair in event stream")),"document"===e.kind)i.documents.push(e.value);else{const t=e.tag.carrierIsResult?e.value:Tn(i,e.position,e.tag,e.value);e.anchor&&(e.anchor.value=t,e.anchor.isValueFinal=!0),qn(i,t,e.tag)}break}}}return i.documents}(function(e,t){const i=e.length,s={...Zn,...t,input:`${e}\0`,length:i,position:0,line:0,lineStart:0,lineIndent:0,firstTabInLine:-1,depth:0,directives:[],tagHandlers:Object.create(null),events:[]},a=e.indexOf("\0");for(-1!==a&&Za.throwAt(e,a,"null byte is not allowed in input",s.filename);s.position<s.length&&(bo(s),vo(s,!0),!(s.position>=s.length));){const e=s.position;Io(s),s.position===e&&oo(s,"can not read a document")}return s.events}(s,Ma(i,a)),{...Ma(i,n),source:s})}function Mo(e,t){return!!(e&1<<t)}var qo={applyQuoteFlowKeysOption:function(e){if(!e.presenterOptions.quoteFlowKeys)return;if(!e.isKey||!e.flowOnly||e.style!==an)return;e.style=on},doubleQuoteForInvisibles:function(e){e.style===an&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(e.node.value)&&(e.style=on)},doubleQuoteWhitespaceOnly:function(e){e.style===an&&/^\s+$/.test(e.node.value)&&(e.style=on)},applyForceQuotesOption:function(e){if(!e.presenterOptions.forceQuotes)return;if(e.isKey||e.style!==an)return;if(e.node.tag!==e.presenterOptions.schema.defaultScalarTag.tagName)return;e.style=e.node.value.includes("\n")?on:Do(e)},tryLongOrMultilineAsBlock:function(e){if(e.style!==an||e.isKey)return;const t=e.node.value,i=-1!==t.indexOf("\n");if(!Mo(e.allowedStylesMask,rn))return void(i&&(e.style=on));const s=e.presenterOptions.lineWidth;if(-1===s)return void(i&&(e.style=rn));const a=Math.max(Math.min(s,40),s-e.shiftOfContent);let n=0,o=!1;for(;n<=t.length;){let e=t.length;const i=t.indexOf("\n",n);-1!==i&&(e=i);const s=t.slice(n,e);if(s.length>a&&" "!==s[0]&&/ [^ \t]/.test(s)&&(o=!0),-1===i)break;n=i+1}o?e.style=ln:i&&(e.style=rn)},quoteInvalidPlain:function(e){e.style!==an||Mo(e.allowedStylesMask,an)||(e.style=Do(e))},fallbackToDoubleQuoted:function(e){Mo(e.allowedStylesMask,e.style)||(e.style=on)}};function Do(e){return"single"===e.presenterOptions.quoteStyle&&Mo(e.allowedStylesMask,nn)?nn:on}Object.keys(qo).map(e=>Reflect.get(qo,e));const Vo="tempus2016/decluttering-card-plus",Ro="share-your-templates",zo=`https://github.com/${Vo}/discussions/new?category=${Ro}`,Ho="decluttering-card-plus-community";function Uo(e){let t=2e4;const i=e=>(t-=1+Math.ceil(e/16))>=0,s=e=>"string"==typeof e?i(e.length):!!i(0)&&(Array.isArray(e)?e.every(s):!e||"object"!=typeof e||Object.entries(e).every(([e,t])=>i(e.length)&&s(t)));return s(e)}const Wo=e=>!!e&&"object"==typeof e&&!Array.isArray(e);function Ko(e){if(Uo(e))return JSON.parse(JSON.stringify(e),(e,t)=>"__proto__"===e?void 0:t)}const Yo=/[\p{Cf}\u2800\u3164\u115F\u1160\uFFA0]/gu;function Bo(e){if("string"!=typeof e)return;const t=e.replace(Yo,"").replace(/\s+/g," ").trim();return t?t.length>80?`${t.slice(0,79)}…`:t:void 0}const Jo=["card","badge","row","element","group"];function Zo(e){if(!Wo(e))return{};const t={};for(const[i,s]of Object.entries(e))Wo(s)&&Jo.some(e=>void 0!==s[e])&&(t[i]=s);return t}function Go(e,t){return"string"==typeof t&&/^https:\/\/github\.com\//.test(t)?t:`https://github.com/${Vo}/discussions/${e}`}function Qo(e){var t,i,s,a,n;const o=function(e){if("string"!=typeof e||e.length>65536)return;const t=/^ {0,3}(`{3,}|~{3,})[ \t]*([\w-]*)/,i=[];let s;for(const o of function(e){return e.replace(/<!--[\s\S]*?(?:-->|$)/g,"")}(e).split("\n")){if(s){o.trim()===s.fence?(i.push({lang:s.lang,text:s.lines.join("\n")+"\n"}),s=void 0):s.lines.push(o);continue}const e=t.exec(o);e&&(s={fence:e[1],lang:e[2],lines:[]})}const a=i.find(e=>/^ya?ml$/i.test(e.lang)),n=null!=a?a:i.find(e=>""===e.lang);return null==n?void 0:n.text}(null==e?void 0:e.body);if(!o)return;let r;try{if(r=Ko(function(e,t){const i=Fo(e,t);if(0===i.length)throw new Za("expected a document, but the input is empty");if(1===i.length)return i[0];throw new Za("expected a single document in the stream, but found more")}(o,{maxAliases:50})),void 0===r)return}catch(h){return}if(!is(r).ok)return;if("number"!=typeof(null==e?void 0:e.number))return;const{template:l,includes:c}=r,d=We(r,["template","includes"]);return delete d.type,"string"!=typeof d.description&&delete d.description,{id:e.number,title:null!==(t=Bo(e.title))&&void 0!==t?t:l,author:"string"==typeof(null===(i=e.user)||void 0===i?void 0:i.login)?e.user.login:"",url:Go(e.number,e.html_url),name:l.trim(),template:d,includes:Zo(c),reactions:"number"==typeof(null===(s=e.reactions)||void 0===s?void 0:s.total_count)?e.reactions.total_count:0,updated:"string"==typeof(null!==(a=e.updated_at)&&void 0!==a?a:e.created_at)?null!==(n=e.updated_at)&&void 0!==n?n:e.created_at:""}}const Xo=["lock","alarm_control_panel","cover","valve","siren","script","automation","button","input_button","water_heater","lawn_mower","update"],er=["more-info","navigate","none","assist"],tr=["action","perform_action","service","type"],ir=/\b[a-z][a-z0-9+.-]{1,31}:(?:\/\/)?[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?|\/\/[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?/gi,sr=[/(?:url|image-set|src)\(\s*['"]?([^'")\s{}]+)/gi,/@import\s+(?:url\(\s*)?['"]?([^'")\s;{}]+)/gi],ar=/^(?:\/(?!\/)|#|data:)/i,nr=["image","url","url_path","entity_picture","camera_image","image_url","icon_url","src"],or=/\[\[\[|\{\{|\{%|\$\{/,rr=/^\s*(?:javascript|data|vbscript):/i,lr=/position\s*:\s*(?:fixed|absolute)/i,cr=/opacity\s*:\s*0(?:[^.\d]|$)|visibility\s*:\s*hidden|transparent/i,dr=e=>"string"==typeof e&&Xo.includes(e.split(".")[0]),hr=e=>e.replace(/\\/g,"/"),ur="*";function pr(e,t){const i=[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);if(i.length)return i.includes(ur)?[ur]:i;const s=[].concat(null!=t?t:[]).filter(e=>"string"==typeof e);if(!s.length)return[ur];const a=s.map(e=>{const t=e.indexOf("."),i=-1===t?e:e.slice(0,t);return/^[a-z_]+$/.test(i)?i:ur});return a.includes(ur)?[ur]:[...new Set(a)]}function mr(e,t,i=new Set){var s,a,n,o;if(Array.isArray(e))return e.forEach(e=>mr(e,t,i)),i;if(!Wo(e))return i;const r="string"==typeof e.entity?e.entity:t,l=e.action;if("string"==typeof l&&!er.includes(l)&&!l.includes("[[")&&"perform-action"!==l&&"call-service"!==l&&"fire-dom-event"!==l&&"url"!==l){const t=[].concat(null!==(o=null!==(n=null!==(a=null===(s=e.target)||void 0===s?void 0:s.entity_id)&&void 0!==a?a:e.entity_id)&&void 0!==n?n:r)&&void 0!==o?o:[]);t.length&&!t.some(e=>"string"!=typeof e||e.includes("[["))||i.add(l)}return Object.values(e).forEach(e=>mr(e,r,i)),i}function fr(e,t){const i=Jo.find(t=>void 0!==e[t]);if(i)try{return H(t,e,e[i],void 0,void 0,!0)}catch(s){return}}function gr(e){const t=new Set,i=new Set;let s=!1,a=!1,n=!1,o=!1;const r=e=>{const t=hr(e).trim();!t||ar.test(t)||t.startsWith("[[")||t.startsWith("{{")||/^[\w.-]+\.[a-z]{2,}(?:[:/?#]|$)/i.test(t)&&i.add(t)},l=new Set,c=(e,i)=>{for(const s of e)if(i.includes(ur))t.add(`${s} *`);else for(const e of i)Xo.includes(e)&&t.add(`${s} ${e}.*`)},d=(h,u)=>{var p;if("string"==typeof h)return void(e=>{var t;const s=hr(e);for(const a of null!==(t=s.match(ir))&&void 0!==t?t:[])i.add(a);for(const a of sr){a.lastIndex=0;let e=a.exec(s);for(;e;)ar.test(e[1])||i.add(e[1]),e=a.exec(s)}or.test(e)&&(a=!0),lr.test(e)&&cr.test(e)&&(o=!0)})(h);if(Array.isArray(h))return void h.forEach(e=>d(e,u));if(!Wo(h))return;const m="string"==typeof h.entity?h.entity:u;Object.keys(h).some(e=>e.includes("[["))&&(n=!0),tr.some(e=>"string"==typeof h[e]&&h[e].includes("[["))&&(n=!0),"string"==typeof h.action&&((e,s)=>{var n,o,r,l,c,d;const h=e.action;if("perform-action"===h||"call-service"===h){const i=null!==(n=e.perform_action)&&void 0!==n?n:e.service;return void("string"!=typeof i?t.add("?"):i.includes("[[")||t.add(i))}if("fire-dom-event"===h)return void t.add("fire-dom-event");if("url"===h)return i.add("string"==typeof e.url_path?e.url_path:"?"),void("string"==typeof e.url_path&&rr.test(e.url_path)&&(a=!0));if(er.includes(h)||h.includes("[["))return;const u=[].concat(null!==(d=null!==(c=null!==(l=null!==(r=null===(o=e.target)||void 0===o?void 0:o.entity_id)&&void 0!==r?r:e.entity_id)&&void 0!==l?l:e.entity)&&void 0!==c?c:s)&&void 0!==d?d:[]);for(const i of u)dr(i)&&t.add(`${h} ${i}`)})(h,m),"iframe"!==h.type&&"webpage"!==h.type||(s=!0);for(const e of nr)"string"==typeof h[e]&&r(h[e]);if("string"==typeof h.type&&Te.includes(h.type)){const t=(t=>{if("string"==typeof t)return t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0})(h.template);if(t){if(T(h.for_each_from)){const e=h.for_each_from,i=Jo.map(e=>t[e]).find(e=>void 0!==e);c(mr(i,void 0),pr(e.domain,e.entities))}const e=(f=h.variables,Array.isArray(f)?f.filter(Wo):Wo(f)?Object.entries(f).map(([e,t])=>({[e]:t})):void 0);(null==e?void 0:e.length)&&!l.has(h.template)&&(l.add(h.template),d(fr(t,e),void 0),l.delete(h.template))}}var f;if("custom:auto-entities"===h.type&&Wo(h.filter))for(const e of[].concat(null!==(p=h.filter.include)&&void 0!==p?p:[])){if(!Wo(e))continue;const t=pr(e.domain,e.entity_id);c(mr(e.options,void 0),t),c(mr(h.card,void 0),t)}Object.values(h).forEach(e=>d(e,m))},h=[e.template,...Object.values(e.includes)].map(Li);d(h,void 0);for(const u of h)d(fr(u),void 0);return{actions:[...t].sort(),urls:[...i].sort(),embeds:s,scripts:a,placeholders:n,overlay:o}}function _r(e){return e.filter(e=>{var t;return(null===(t=null==e?void 0:e.category)||void 0===t?void 0:t.slug)===Ro}).map(Qo).filter(e=>!!e).sort((e,t)=>t.reactions-e.reactions||t.updated.localeCompare(e.updated))}class vr extends Error{}function yr(e){var t;if(!Wo(e)||"number"!=typeof e.id||"string"!=typeof e.name)return;if(!Wo(e.template))return;const i=Ko({template:e.template,includes:e.includes});if(!i||!Wo(i.template))return;if(!is(Object.assign({template:e.name},i.template)).ok)return;const s=Object.assign({},i.template);return delete s.type,"string"!=typeof s.description&&delete s.description,{id:e.id,title:null!==(t=Bo(e.title))&&void 0!==t?t:e.name,author:"string"==typeof e.author?e.author:"",url:Go(e.id,e.url),name:e.name,template:s,includes:Zo(i.includes),reactions:"number"==typeof e.reactions?e.reactions:0,updated:"string"==typeof e.updated?e.updated:""}}async function br(e={}){var t,i,s,a;const n=null!==(t=e.fetcher)&&void 0!==t?t:fetch.bind(globalThis),o=null!==(i=e.storage)&&void 0!==i?i:"undefined"==typeof localStorage?void 0:localStorage,r=null!==(s=e.now)&&void 0!==s?s:Date.now(),l=function(e){var t;try{const i=JSON.parse(null!==(t=null==e?void 0:e.getItem(Ho))&&void 0!==t?t:"null");if(!i||!Array.isArray(i.entries)||"number"!=typeof i.fetched)return;return{entries:i.entries.map(yr).filter(e=>!!e),fetched:i.fetched}}catch(i){return}}(o);if(l&&!e.refresh&&r-l.fetched<216e5)return l;const c=[];try{for(let e=1;e<=10;e+=1){const t=await n(`https://api.github.com/repos/${Vo}/discussions?per_page=100&page=${e}`,{headers:{Accept:"application/vnd.github+json"}});if(!t.ok){const e=new vr(`GitHub answered ${t.status}`);throw"0"===t.headers.get("x-ratelimit-remaining")&&(e.retryAt=1e3*Number(t.headers.get("x-ratelimit-reset"))||void 0),e}const i=await t.json();if(!Array.isArray(i))break;if(c.push(...i),i.length<100)break}}catch(h){const e=h instanceof vr?h:new vr(null!==(a=null==h?void 0:h.message)&&void 0!==a?a:String(h));throw e.cached=l,e}const d={entries:_r(c),fetched:r};try{null==o||o.setItem(Ho,JSON.stringify(d))}catch(u){}return d}function $r(e,t){return{discussion:e.id,updated:e.updated,name:t,author:e.author}}function wr(e,t){return Object.assign(Object.assign({},e),{source:t})}function xr(e,t){return e.map(({name:e,source:i})=>{var s;const a=t.entries.find(e=>e.id===i.discussion),n="string"==typeof i.name?i.name:void 0,o=a?function(e,t){return void 0===t||t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0}(a,n):void 0;if(!a||!o)return Object.assign({name:e,status:"gone"},a?{entry:a}:{});if("string"!=typeof i.author||!i.author||i.author!==a.author)return{name:e,status:"unverified",entry:a};const r=Date.parse(null!==(s=i.updated)&&void 0!==s?s:""),l=Date.parse(a.updated);return{name:e,status:(Number.isFinite(r)?Number.isFinite(l)&&l>r:Number.isFinite(l))?"update":"current",entry:a,latest:wr(o,$r(a,null!=n?n:a.name))}})}function kr(e){if(""===e)return[];const t=e.split("\n");return""===t[t.length-1]&&t.pop(),t}function Ar(e,t){const i=e=>({kind:"remove",text:e}),s=e=>({kind:"add",text:e});if(!e.length||!t.length||e.length*t.length>4e6)return[...e.map(i),...t.map(s)];const a=e.length,n=t.length,o=Array.from({length:a+1},()=>new Uint32Array(n+1));for(let d=a-1;d>=0;d-=1)for(let i=n-1;i>=0;i-=1)o[d][i]=e[d]===t[i]?o[d+1][i+1]+1:Math.max(o[d+1][i],o[d][i+1]);const r=[];let l=0,c=0;for(;l<a&&c<n;)e[l]===t[c]?(r.push({kind:"same",text:e[l]}),l+=1,c+=1):o[l+1][c]>=o[l][c+1]?(r.push(i(e[l])),l+=1):(r.push(s(t[c])),c+=1);for(;l<a;)r.push(i(e[l++]));for(;c<n;)r.push(s(t[c++]));return r}const jr=e`<style>
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
</style>`;function Sr(e){return"string"==typeof e?e:void 0===e?"":W(e)}const Or={same:" ",add:"+",remove:"-"};function Cr(t,i,s,n=3){const o=function(e,t){const i=kr(e),s=kr(t);let a=0;for(;a<i.length&&a<s.length&&i[a]===s[a];)a+=1;let n=i.length,o=s.length;for(;n>a&&o>a&&i[n-1]===s[o-1];)n-=1,o-=1;const r=i.slice(0,a).map(e=>({kind:"same",text:e})),l=i.slice(n).map(e=>({kind:"same",text:e}));return[...r,...Ar(i.slice(a,n),s.slice(a,o)),...l]}(Sr(t),Sr(i));return function(e){return e.some(e=>"same"!==e.kind)}(o)?e`${jr}
    <div class="dcp-diff" role="figure" aria-label=${a("diff.label",void 0,s)}>
      ${function(e,t=3){const i=e.map(e=>"same"!==e.kind),s=new Array(e.length).fill(!1);e.forEach((i,a)=>{if("same"!==i.kind)for(let n=Math.max(0,a-t);n<=Math.min(e.length-1,a+t);n+=1)s[n]=!0});const a=[];let n=0;for(;n<e.length;){if(i[n]||s[n]){a.push(e[n]),n+=1;continue}let t=n;for(;t<e.length&&!i[t]&&!s[t];)t+=1;const o=t-n;1===o?a.push(e[n]):a.push({kind:"skip",count:o}),n=t}return a}(o,n).map(t=>function(t,i){return"skip"===t.kind?e`<div class="skip">${a("diff.skipped",{count:t.count},i)}</div>`:e`<div class=${t.kind}>${Or[t.kind]} ${t.text}</div>`}(t,s))}
    </div>`:e`${jr}
      <p class="dcp-diff-none">${a("diff.no_change",void 0,s)}</p>`}function Er(t,i,s){var n,o;const r=null!==(n=JSON.stringify(t))&&void 0!==n?n:"",l=null!==(o=JSON.stringify(i))&&void 0!==o?o:"";return e`
    ${Cr(t,i,s)}
    <ha-expansion-panel outlined>
      <span slot="header">${a("diff.full",void 0,s)}</span>
      <p class="dcp-diff-none">${a("diff.before",void 0,s)}</p>
      ${Rs(r,e`<ha-yaml-editor .hass=${s} .defaultValue=${t} read-only></ha-yaml-editor>`)}
      <p class="dcp-diff-none">${a("diff.after",void 0,s)}</p>
      ${Rs(l,e`<ha-yaml-editor .hass=${s} .defaultValue=${i} read-only></ha-yaml-editor>`)}
    </ha-expansion-panel>
  `}const Tr=["readme","related","setup","requires_entities","requires_homeassistant","requires_card"];class Pr extends c{constructor(){super(...arguments),this._importParses=!0,this._importErrors=[],this._importArmedAt=0,this._copyState="",this._busy=!1,this._libraryDestination="view",this._communityLoading=!1,this._communityKnownFailed=!1,this._installArmedAt=0,this._postCopyState="",this._setupValues={},this._updatesLoading=!1,this._updateArmedAt=0,this._trashArmedAt=0}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=Y())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:v()}static get styles(){return Cs}_fireConfigChanged(e){h(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return Os(this,e,t,i)}render(){return this.hass&&this._config?this._renderShare():e``}async _loadTrash(){this.hass&&(this._trash=await Ke(this.hass))}_renderShare(){const{payload:t,notes:i}=Xi(this._config,y(this._savedLovelace));return e`
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
          <a href=${zo} target="_blank" rel="noopener noreferrer"
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
    `}_renderDetails(){var t,i,s,n;const o=this._config,r=function(e){const t=e&&"object"==typeof e?e:{},i=t.author&&"object"==typeof t.author&&!Array.isArray(t.author)?t.author:void 0,s=t.requires&&"object"==typeof t.requires&&!Array.isArray(t.requires)?t.requires:{},a={author_name:Ui(i?i.name:t.author),author_github:Ui(null==i?void 0:i.github),author_email:Ui(null==i?void 0:i.email),author_url:Ui(null==i?void 0:i.url),license:Ui(t.license),help:Ui(t.help),homepage:Ui(t.homepage),readme:Ui(t.readme),related:Wi(t.related),setup:Wi(t.setup),requires_integrations:Wi(s.integrations),requires_entities:Wi(s.entities),requires_custom_cards:Wi(s.custom_cards),requires_homeassistant:Ui(s.homeassistant),requires_card:Ui(s.card)};for(const n of Object.keys(a))void 0===a[n]&&delete a[n];return a}(o),l=e=>[...new Set(e)].sort().map(e=>({value:e,label:e})),c=e=>({select:{multiple:!0,custom_value:!0,options:l(e)}}),d=Object.keys(y(this._savedLovelace)).filter(e=>e!==o.template),h=[...$(o).map(e=>e.name),...null!==(t=r.setup)&&void 0!==t?t:[]],u=(Array.isArray(null===(s=null===(i=this.hass)||void 0===i?void 0:i.config)||void 0===s?void 0:s.components)?this.hass.config.components:[]).filter(e=>!e.includes(".")),p=(null!==(n=window.customCards)&&void 0!==n?n:[]).map(e=>e.type).filter(e=>"string"==typeof e),m=(e,t)=>({name:e,selector:t}),f=[m("author_name",{text:{}}),m("author_github",{text:{}}),m("author_email",{text:{}}),m("author_url",{text:{type:"url"}}),m("license",{text:{}}),m("help",{text:{type:"url"}}),m("homepage",{text:{type:"url"}}),m("readme",{text:{multiline:!0}}),m("related",c(d)),m("setup",c(h)),m("requires_integrations",c(u)),m("requires_entities",c([])),m("requires_custom_cards",c(p)),m("requires_homeassistant",{text:{}}),m("requires_card",{text:{}})];return e`
      <ha-expansion-panel outlined class="details">
        <span slot="header">${a("share.details_header",void 0,this.hass)}</span>
        <p class="hint">${a("share.details_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${r}
          .schema=${f}
          .computeLabel=${e=>a(`share.details_${e.name}`,void 0,this.hass)}
          .computeHelper=${e=>Tr.includes(e.name)?a(`share.details_${e.name}_helper`,void 0,this.hass):""}
          @value-changed=${this._detailsChanged}
        ></ha-form>
      </ha-expansion-panel>
    `}_detailsChanged(e){if(e.stopPropagation(),!this._config)return;const t=function(e,t){var i;const s=Object.assign({},e),a=(e,t)=>{void 0===t||Array.isArray(t)&&!t.length?delete s[e]:s[e]=t},n={},o=Ki(t.author_name);o&&(n.name=o);for(const d of["github","email","url"]){const e=Ki(t[`author_${d}`]);e&&(n[d]=e)}const r=e.author&&"object"==typeof e.author&&!Array.isArray(e.author)?e.author:{};for(const[d,h]of Object.entries(r))["name","github","email","url"].includes(d)||(n[d]=h);const l=Object.keys(n);a("author",l.length?1===l.length&&o?o:n:void 0);for(const d of["license","help","homepage"])a(d,Ki(t[d]));a("readme","string"==typeof t.readme&&t.readme.trim()?t.readme:void 0),a("related",Yi(t.related)),a("setup",Yi(t.setup));const c=e.requires&&"object"==typeof e.requires&&!Array.isArray(e.requires)?Object.assign({},e.requires):{};for(const[d,h]of Object.entries(Hi)){const e=[].concat(null!==(i=c[d])&&void 0!==i?i:[]).filter(e=>"string"!=typeof e),s=[...Yi(t[h]),...e];s.length?c[d]=s:delete c[d]}for(const d of["homeassistant","card"]){const e=Ki(t[`requires_${d}`]);e?c[d]=e:delete c[d]}return a("requires",Object.keys(c).length?c:void 0),s}(this._config,e.detail.value);this._fireConfigChanged(t)}_renderCommunity(){const t=this._community,i=e`
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
      `;const s=this._communityExisting(),n=t.entries.find(e=>e.id===this._communitySelected),o=n?`community:${n.id}:${n.updated}`:"",r=!!n&&this._installPending===o,l=n&&s.includes(n.name)?ts(n.name,s):void 0,c=n?function(e,t){const i=new Set,s=new Set;for(const a of[e.template,...Object.values(e.includes)]){const e=Qi(a);e.customTypes.forEach(e=>i.add(e)),e.templateRefs.forEach(e=>s.add(e))}return{customTypes:[...i].sort(),templates:[...s].filter(i=>i!==e.name&&!(i in e.includes)&&!t.includes(i)).sort()}}(n,s):void 0,d=n?Object.keys(n.includes).filter(e=>!s.includes(e)):[],h=n?gr(n):void 0,u=void 0!==this._communityKnown;return e`
      <div class="library">
        ${i}
        ${t.entries.length?e`<ha-form
                .hass=${this.hass}
                .data=${{entry:n?String(n.id):""}}
                .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:t.entries.map(e=>({value:String(e.id),label:a("share.community_by",{title:e.title,author:e.author},this.hass)}))}}}]}
                .computeLabel=${()=>a("share.community_pick",void 0,this.hass)}
                @value-changed=${this._communityPicked}
              ></ha-form>`:e`<p class="hint">${a("share.community_none",void 0,this.hass)}</p>`}
        ${n&&c?e`
                <p class="hint">
                  ${"string"==typeof n.template.description?n.template.description:""}
                  <a href=${n.url} target="_blank" rel="noopener noreferrer"
                    >${a("share.community_open",void 0,this.hass)}</a
                  >
                </p>
                ${this._renderAbout(n.template)}
                ${d.length?e`<p class="hint">
                        ${a("share.library_needs",{names:d.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderUnmet([n.template,...Object.values(n.includes)])}
                ${this._renderMissingCards([n.template,...Object.values(n.includes)])}
                ${c.templates.length?e`<ha-alert alert-type="warning">
                        ${a("share.community_needs_templates",{names:c.templates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
                ${h&&ks(h)?this._renderRisks(h,"share.community_risks"):e``}
                ${this._renderSetup([n.template,...Object.values(n.includes)])}
                <ha-expansion-panel outlined expanded>
                  <span slot="header">${a("share.library_preview",void 0,this.hass)}</span>
                  ${Rs(`${n.id}:${n.updated}`,e`<ha-yaml-editor
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
                <ha-button .disabled=${this._busy||!u} @click=${()=>{this._installShared(n)}}>
                  ${u||this._communityKnownFailed?r?a("share.install_anyway",void 0,this.hass):l?a("share.community_install_as",{name:l},this.hass):a("share.install",void 0,this.hass):a("share.community_names_loading",void 0,this.hass)}
                </ha-button>
              `:e``}
        <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!0)}}>
          ${a(this._communityLoading?"share.community_loading":"share.community_refresh",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderAbout(t){var i,s,n;const o=Ni(t),r=(l=o.author)?[l.name,l.github?`@${l.github}`:void 0,l.email].filter(Boolean).join(" · "):"";var l;const c=null!==(s=null===(i=o.author)||void 0===i?void 0:i.url)&&void 0!==s?s:(null===(n=o.author)||void 0===n?void 0:n.github)?`https://github.com/${o.author.github}`:void 0,d=[o.help?{url:o.help,label:a("share.about_help",void 0,this.hass)}:void 0,o.homepage?{url:o.homepage,label:a("share.about_homepage",void 0,this.hass)}:void 0].filter(e=>!!e);return r||o.license||d.length||o.readme?e`
      ${r||o.license||d.length?e`<p class="hint about">
              ${r?e`<span
                      >${a("share.about_author",void 0,this.hass)}
                      ${c?e`<a href=${c} target="_blank" rel="noopener noreferrer">${r}</a>`:r}</span
                    >`:e``}
              ${o.license?e`<span>${a("share.about_license",{license:o.license},this.hass)}</span>`:e``}
              ${d.map(t=>e`<a href=${t.url} target="_blank" rel="noopener noreferrer">${t.label}</a>`)}
            </p>`:e``}
      ${o.readme?e`<ha-expansion-panel outlined>
              <span slot="header">${a("share.about_readme",void 0,this.hass)}</span>
              <ha-markdown class="readme" .content=${o.readme}></ha-markdown>
            </ha-expansion-panel>`:e``}
    `:e``}_renderUnmet(t){const i=t.filter(e=>void 0!==e),s=new Set(ss(i,xs)),n=function(e,t){const i=new Set,s=[];for(const a of e)for(const e of qi(a)){const a=`${e.kind}:${e.any.join("|")}`;if(i.has(a))continue;if(i.add(a),Vi(e,t))continue;const n="homeassistant"===e.kind?t.homeassistant:"card"===e.kind?t.card:void 0;s.push(n?Object.assign(Object.assign({},e),{have:n}):e)}return s}(i,(o=this.hass,r=it,l=xs,{components:Array.isArray(null===(c=null==o?void 0:o.config)||void 0===c?void 0:c.components)?o.config.components:[],entities:Object.keys(null!==(d=null==o?void 0:o.states)&&void 0!==d?d:{}),homeassistant:"string"==typeof(null===(h=null==o?void 0:o.config)||void 0===h?void 0:h.version)?o.config.version:void 0,card:r,isDefined:l})).filter(e=>!("custom_card"===e.kind&&!e.message&&e.any.every(e=>s.has(e))));var o,r,l,c,d,h;return n.length?e`<ha-alert alert-type="warning" .title=${a("share.requires_header",void 0,this.hass)}>
      <ul class="risks">
        ${n.map(t=>e`<li>${this._unmetLine(t)}</li>`)}
      </ul>
      ${a("share.requires_hint",void 0,this.hass)}
    </ha-alert>`:e``}_unmetLine(e){var t;const i=a("share.requires_or",void 0,this.hass),s=a(`share.requires_${e.kind}`,{names:e.any.join(i),want:e.any[0],have:null!==(t=e.have)&&void 0!==t?t:"?"},this.hass);return e.message?`${s}: ${e.message}`:s}_renderSetup(t){const i=t.filter(e=>void 0!==e),s=function(e){const t=[];for(const i of e)for(const e of Ni(i).setup)t.includes(e)||t.push(e);return t}(i);if(!s.length)return e``;const n=e=>{if(e in this._setupValues)return this._setupValues[e];for(const t of i){const i=Ri(t,e);if(void 0!==i)return i}return""};return e`
      <h4>${a("share.setup_header",void 0,this.hass)}</h4>
      <p class="hint">${a("share.setup_hint",void 0,this.hass)}</p>
      <ha-form
        .hass=${this.hass}
        .data=${s.reduce((e,t)=>Object.assign(Object.assign({},e),{[t]:n(t)}),{})}
        .schema=${s.map(e=>({name:e,selector:{text:{}}}))}
        .computeLabel=${e=>e.name}
        @value-changed=${this._setupChanged}
      ></ha-form>
    `}_setupChanged(e){var t;e.stopPropagation();const i={};for(const[s,a]of Object.entries(null!==(t=e.detail.value)&&void 0!==t?t:{}))i[s]=null==a?"":String(a);this._setupValues=i}_keptSetup(e){const t={};for(const i of Ni(e).setup){const s=Ri(e,i);void 0!==s&&(t[i]=s)}return t}_renderRisks(t,i){return e`<ha-alert alert-type="warning" .title=${a(i,void 0,this.hass)}>
      <ul class="risks">
        ${t.actions.length?e`<li>${a("share.community_risk_actions",{list:t.actions.join(", ")},this.hass)}</li>`:e``}
        ${t.urls.length?e`<li>${a("share.community_risk_urls",{list:t.urls.join(", ")},this.hass)}</li>`:e``}
        ${t.embeds?e`<li>${a("share.community_risk_embeds",void 0,this.hass)}</li>`:e``}
        ${t.scripts?e`<li>${a("share.community_risk_scripts",void 0,this.hass)}</li>`:e``}
        ${t.placeholders?e`<li>${a("share.community_risk_placeholders",void 0,this.hass)}</li>`:e``}
        ${t.overlay?e`<li>${a("share.community_risk_overlay",void 0,this.hass)}</li>`:e``}
      </ul>
    </ha-alert>`}async _loadCommunity(e){var t,i;this._communityLoading=!0,this._communityError=void 0,this._installPending=void 0,this._communityKnown=void 0,this._communityKnownFailed=!1;try{this._community=await br({refresh:e})}catch(s){const e=s;e.cached&&(this._community=e.cached),this._communityError=e.retryAt?a("share.community_rate_limited",{time:new Date(e.retryAt).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)},this.hass):a("share.community_failed",{message:e.message},this.hass)}finally{this._communityLoading=!1}this._community&&this._loadCommunityKnown()}_communityExisting(){var e;const t=Object.keys(y(this._savedLovelace));return[...new Set([...t,...null!==(e=this._communityKnown)&&void 0!==e?e:[]])]}async _loadCommunityKnown(){try{const e=await ke(this.hass,this._savedLovelace);this._communityKnown=Object.keys(e)}catch(e){this._communityKnownFailed=!0}}_communityPicked(e){e.stopPropagation();const t=Number(e.detail.value.entry);this._communitySelected=Number.isFinite(t)&&t>0?t:void 0,this._installPending=void 0,this._setupValues={}}async _installShared(e){var t,i,s,a,n;if(void 0===this._communityKnown)return;const o=`community:${e.id}:${e.updated}`;if(this._installPending!==o)return this._installPending=o,void(this._installArmedAt=Date.now());if(Date.now()-this._installArmedAt<As)return;const r=Y(),l=this._communityExisting(),c=l.includes(e.name)?ts(e.name,l):e.name,d=[...Object.entries(e.includes).filter(([e])=>!l.includes(e)).map(([t,i])=>[t,wr(zi(i,this._setupValues),$r(e,t))]),[c,wr(zi(e.template,this._setupValues),$r(e,e.name))]],h=ee(null!==(t=null==r?void 0:r.config)&&void 0!==t?t:this.lovelace,null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""),u=null!==(n=null===(a=null==h?void 0:h.view)||void 0===a?void 0:a.index)&&void 0!==n?n:0;await this._saveDashboard(e=>d.reduce((e,[t,i])=>"root"===this._libraryDestination?Ye(e,t,i):Be(e,u,Object.assign({type:Ce,template:t},i,{type:Ce,template:t})),e),"community_install")&&(this._installPending=void 0,this._setupValues={})}_renderMissingCards(t){const i=ss(t.filter(e=>void 0!==e),xs);return i.length?e`<ha-alert alert-type="warning">
      ${a(1===i.length?"share.missing_card_one":"share.missing_card_many",{cards:i.join(", ")},this.hass)}
    </ha-alert>`:e``}_renderInstalled(){var t;const i=Je(this._savedLovelace);if(!i.length)return e``;const s=new Map((null!==(t=this._updates)&&void 0!==t?t:[]).map(e=>[e.name,e]));return e`
      <h3>${a("share.installed_header",void 0,this.hass)}</h3>
      <p class="hint">${a("share.installed_hint",void 0,this.hass)}</p>
      ${this._updatesError?e`<ha-alert alert-type="warning">${this._updatesError}</ha-alert>`:e``}
      <ul class="installed">
        ${i.map(({name:t,source:i,template:n})=>{var o,r;const l=s.get(t);return e`<li>
            ${t} —
            <a
              href=${null!==(r=null===(o=null==l?void 0:l.entry)||void 0===o?void 0:o.url)&&void 0!==r?r:`https://github.com/${Vo}/discussions/${i.discussion}`}
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
    `}_renderUpdate(t,i,s){const n=zi(s.latest,this._keptSetup(i)),o=e=>{const t=Object.assign({},e);return delete t.source,delete t.type,delete t.template,t},r=o(i),l=o(n),c=gr({template:l,includes:{}}),d=function(e,t){return{actions:e.actions.filter(e=>!t.actions.includes(e)),urls:e.urls.filter(e=>!t.urls.includes(e)),embeds:e.embeds&&!t.embeds,scripts:e.scripts&&!t.scripts,placeholders:e.placeholders&&!t.placeholders,overlay:e.overlay&&!t.overlay}}(c,gr({template:r,includes:{}})),h=this._updatePending===t;return e`
      <p class="hint">${a("share.installed_compare",void 0,this.hass)}</p>
      ${Er(r,l,this.hass)} ${this._renderMissingCards([n])} ${this._renderUnmet([n])}
      ${ks(d)?this._renderRisks(d,"share.installed_risks_new"):ks(c)?this._renderRisks(c,"share.installed_risks"):e``}
      ${h?e`<ha-alert alert-type="warning">
              ${a("share.installed_update_confirm",{name:t},this.hass)}
            </ha-alert>`:e``}
      <ha-button .disabled=${this._busy} @click=${()=>{this._updateShared(t,n)}}>
        ${a(h?"share.installed_update_anyway":"share.installed_update",void 0,this.hass)}
      </ha-button>
    `}async _checkUpdates(){var e,t;this._updatesLoading=!0,this._updatesError=void 0,this._updatePending=void 0;const i=Je(this._savedLovelace);try{this._updates=xr(i,await br({refresh:!0}))}catch(s){const i=s;this._updatesError=i.retryAt?a("share.community_rate_limited",{time:new Date(i.retryAt).toLocaleTimeString(null===(t=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===t?void 0:t.language)},this.hass):a("share.community_failed",{message:i.message},this.hass)}finally{this._updatesLoading=!1}}async _updateShared(e,t){var i,s;if(this._updatePending!==e)return this._updatePending=e,void(this._updateArmedAt=Date.now());if(Date.now()-this._updateArmedAt<As)return;await this._saveDashboard(i=>Ze(i,e,t),"shared_update")&&(this._updatePending=void 0,this._updates=null===(i=this._updates)||void 0===i?void 0:i.map(t=>t.name===e?Object.assign(Object.assign({},t),{status:"current"}):t),(null===(s=this._config)||void 0===s?void 0:s.template)===e&&this._fireConfigChanged(Object.assign(Object.assign({},t),{type:this._config.type,template:e})))}_renderLibrary(){var t;const i=Object.keys(y(this._savedLovelace)),s=this._librarySelected?Hs(this._librarySelected):void 0,n=!!s&&i.includes(s.name),o=!!s&&this._installPending===s.name,r=s?Us(s,i):[];return e`
      <div class="library">
        <ha-form
          .hass=${this.hass}
          .data=${{entry:null!==(t=this._librarySelected)&&void 0!==t?t:""}}
          .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:zs.map(e=>({value:e.name,label:e.name}))}}}]}
          .computeLabel=${()=>a("share.library_pick",void 0,this.hass)}
          @value-changed=${this._libraryPicked}
        ></ha-form>
        ${s?e`
                <p class="hint">${a(`library.${s.name}.summary`,void 0,this.hass)}</p>
                ${r.length?e`<p class="hint">
                        ${a("share.library_needs",{names:r.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderMissingCards([s,...r.map(e=>Hs(e))].map(e=>null==e?void 0:e.template))}
                <ha-expansion-panel outlined>
                  <span slot="header">${a("share.library_preview",void 0,this.hass)}</span>
                  ${Rs(s.name,e`<ha-yaml-editor
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
    `}_libraryDestinationPicked(e){e.stopPropagation();const t=e.detail.value.where;this._libraryDestination="root"===t?"root":"view"}_libraryPicked(e){e.stopPropagation(),this._librarySelected=e.detail.value.entry||void 0,this._installPending=void 0}async _install(e){var t,i,s,a,n,o;const r=Hs(e);if(!r)return;if(this._installPending!==e)return void(this._installPending=e);const l=Y(),c=Object.keys(y(null!==(t=null==l?void 0:l.config)&&void 0!==t?t:this._savedLovelace)),d=[...Us(r,c),r.name].filter(e=>!c.includes(e)),h=ee(null!==(i=null==l?void 0:l.config)&&void 0!==i?i:this.lovelace,null!==(a=null===(s=this._config)||void 0===s?void 0:s.template)&&void 0!==a?a:""),u=null!==(o=null===(n=null==h?void 0:h.view)||void 0===n?void 0:n.index)&&void 0!==o?o:0;await this._saveDashboard(e=>d.reduce((e,t)=>{const i=Hs(t);if(!i)return e;const s=Object.assign(Object.assign({},i.template),{source:Ws(i.name,it)});return"root"===this._libraryDestination?Ye(e,i.name,s):Be(e,u,Object.assign({type:Ce,template:i.name},s))},e),"library_install")&&(this._installPending=void 0)}async _copyExport(){const e=this.renderRoot.querySelector("#export"),t=null==e?void 0:e.yaml;if(!t)return;const{notes:i}=Xi(this._config),s=[...i.map(e=>`# ${e}`),t].join("\n");this._copyState=await K(s)?"done":"failed",setTimeout(()=>this._copyState="",3e3)}async _copyPost(){var e,t;const i=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!i)return;const{notes:s}=Xi(this._config,y(this._savedLovelace));this._postCopyState=await K(function(e,t,i){return[...[i,...t].filter(e=>"string"==typeof e&&e.trim()),"```yaml\n"+e.replace(/\n*$/,"")+"\n```"].join("\n\n")+"\n"}(i,s,null===(t=this._config)||void 0===t?void 0:t.description))?"done":"failed",setTimeout(()=>this._postCopyState="",3e3)}_downloadExport(){var e,t,i;const s=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!s)return;const{notes:a}=Xi(this._config),n=[...a.map(e=>`# ${e}`),s].join("\n"),o=document.createElement("a");o.href=URL.createObjectURL(new Blob([n],{type:"text/yaml"})),o.download=`${(null!==(i=null===(t=this._config)||void 0===t?void 0:t.template)&&void 0!==i?i:"template").replace(/[^\w-]+/g,"_")}.yaml`,o.click(),setTimeout(()=>URL.revokeObjectURL(o.href),1e3)}async _importFile(e){var t,i,s;const n=e.target,o=null===(t=n.files)||void 0===t?void 0:t[0];if(n.value="",!o)return;const r=await o.text(),l=null===(s=null===(i=this.renderRoot.querySelector("#import"))||void 0===i?void 0:i.shadowRoot)||void 0===s?void 0:s.querySelector("ha-code-editor");l?(l.value=r,l.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r}}))):this._importErrors=[a("share.import_not_yaml",void 0,this.hass)]}_renderTrash(){if(void 0===this._trash)return this._loadTrash(),e``;const t=e=>{var t,i;return new Date(e).toLocaleString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)};return e`
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
    `}async _restore(e,t){var i,s;if(!this.hass)return;const n=Ge(this.hass);let o;try{o=await Qe(n,e.dashboard)}catch(l){return void(this._toolError=a("tools.save_failed",{message:null!==(i=null==l?void 0:l.message)&&void 0!==i?i:l},this.hass))}const r=e.name in y(o);if(r&&this._trashPending!==t)return this._trashPending=t,void(this._trashArmedAt=Date.now());if(!(r&&Date.now()-this._trashArmedAt<As)){this._busy=!0,this._toolError=void 0;try{await J(this,this.hass,"restore",[{urlPath:e.dashboard,build:t=>Xe(t,e)}]),this._trashPending=void 0,this._trashShown=void 0,await this._forget(e)}catch(l){this._toolError=a("tools.save_failed",{message:null!==(s=null==l?void 0:l.message)&&void 0!==s?s:l},this.hass)}finally{this._busy=!1}}}async _forget(e){if(!this.hass)return;const t=et(await Ke(this.hass),e);await tt(this.hass,t),this._trash=t,this._trashPending=void 0}_renderImportDetails(){const t=this._importValue;if(!this._importParses||!t||"object"!=typeof t||Array.isArray(t))return e``;if(!Uo(t))return e``;const i=[t,...t.includes&&"object"==typeof t.includes&&!Array.isArray(t.includes)?Object.values(t.includes):[]];return e`${this._renderAbout(t)} ${this._renderUnmet(i)} ${this._renderSetup(i)}`}_importChanged(e){e.stopPropagation(),this._importValue=e.detail.value,this._importParses=!1!==e.detail.isValid,this._importErrors=[],this._importClash=void 0,this._importRisks=void 0,this._setupValues={}}_import(){if(!this._config)return;if(!this._importParses)return void(this._importErrors=[a("share.import_not_yaml",void 0,this.hass)]);if(!Uo(this._importValue))return void(this._importErrors=[a("share.import_too_big",void 0,this.hass)]);const e=is(this._importValue);if(!e.ok)return this._importErrors=e.errors,void(this._importClash=void 0);this._importErrors=[];const t=this._importValue.template,i=y(this._savedLovelace),s=t!==this._config.template&&t in i?t:void 0,n=gr({template:this._importValue,includes:{}});if(s&&!this._importClash||ks(n)&&!this._importRisks)return this._importClash=s,this._importRisks=ks(n)?n:void 0,void(this._importArmedAt=Date.now());Date.now()-this._importArmedAt<As||this._applyImport(t)}_importAsCopy(){if(!this._config||!this._importParses)return;if(Date.now()-this._importArmedAt<As)return;const e=Object.keys(y(this._savedLovelace));this._applyImport(ts(this._importValue.template,e))}_applyImport(e){var t;const i=function(e){const t=es(e);if((null==t?void 0:t.includes)&&"object"==typeof t.includes&&!Array.isArray(t.includes)){const e={};for(const[i,s]of Object.entries(t.includes))e[i]=es(s);t.includes=e}return t}(this._importValue),s=zi(i,this._setupValues);s.includes&&"object"==typeof s.includes&&!Array.isArray(s.includes)&&(s.includes=Object.entries(s.includes).reduce((e,[t,i])=>Object.assign(Object.assign({},e),{[t]:i&&"object"==typeof i&&!Array.isArray(i)?zi(i,this._setupValues):i}),{}));const a=s.includes;if(a&&"object"==typeof a&&!Array.isArray(a)){const e=Object.keys(y(this._savedLovelace)),t=Object.entries(a).filter(([t])=>!e.includes(t));t.length&&this._saveDashboard(e=>t.reduce((e,[t,i])=>Ye(e,t,i),e),"import",this._config)}const n=Object.assign(Object.assign({},s),{template:e,type:null===(t=this._config)||void 0===t?void 0:t.type});delete n.includes,this._fireConfigChanged(n),this._importClash=void 0,this._importRisks=void 0,this._setupValues={},this.dispatchEvent(new CustomEvent("select-tab",{detail:"settings",bubbles:!0,composed:!0}))}}o([r({attribute:!1})],Pr.prototype,"hass",void 0),o([r({attribute:!1})],Pr.prototype,"lovelace",void 0),o([r({attribute:!1})],Pr.prototype,"config",void 0),o([l()],Pr.prototype,"_importErrors",void 0),o([l()],Pr.prototype,"_importClash",void 0),o([l()],Pr.prototype,"_importRisks",void 0),o([l()],Pr.prototype,"_copyState",void 0),o([l()],Pr.prototype,"_toolError",void 0),o([l()],Pr.prototype,"_busy",void 0),o([l()],Pr.prototype,"_installPending",void 0),o([l()],Pr.prototype,"_librarySelected",void 0),o([l()],Pr.prototype,"_libraryDestination",void 0),o([l()],Pr.prototype,"_community",void 0),o([l()],Pr.prototype,"_communityLoading",void 0),o([l()],Pr.prototype,"_communityError",void 0),o([l()],Pr.prototype,"_communitySelected",void 0),o([l()],Pr.prototype,"_communityKnown",void 0),o([l()],Pr.prototype,"_communityKnownFailed",void 0),o([l()],Pr.prototype,"_postCopyState",void 0),o([l()],Pr.prototype,"_setupValues",void 0),o([l()],Pr.prototype,"_updates",void 0),o([l()],Pr.prototype,"_updatesLoading",void 0),o([l()],Pr.prototype,"_updatesError",void 0),o([l()],Pr.prototype,"_updatePending",void 0),o([l()],Pr.prototype,"_trash",void 0),o([l()],Pr.prototype,"_trashShown",void 0),o([l()],Pr.prototype,"_trashPending",void 0),customElements.get("decluttering-template-share-tab")||customElements.define("decluttering-template-share-tab",Pr)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;const Nr=(e,t,i)=>{const s=new Map;for(let a=t;a<=i;a++)s.set(e[a],a);return s},Ir=Ts(class extends Ps{constructor(e){if(super(e),e.type!==Es)throw Error("repeat() can only be used in text expressions")}dt(e,t,i){let s;void 0===i?i=t:void 0!==t&&(s=t);const a=[],n=[];let o=0;for(const r of e)a[o]=s?s(r,o):o,n[o]=i(r,o),o++;return{values:n,keys:a}}render(e,t,i){return this.dt(e,t,i).values}update(e,[t,i,s]){const a=(e=>e._$AH)(e),{values:n,keys:o}=this.dt(t,i,s);if(!Array.isArray(a))return this.ut=o,n;const r=this.ut??=[],l=[];let c,d,h=0,u=a.length-1,p=0,m=n.length-1;for(;h<=u&&p<=m;)if(null===a[h])h++;else if(null===a[u])u--;else if(r[h]===o[p])l[p]=Ms(a[h],n[p]),h++,p++;else if(r[u]===o[m])l[m]=Ms(a[u],n[m]),u--,m--;else if(r[h]===o[m])l[m]=Ms(a[h],n[m]),Fs(e,l[m+1],a[h]),h++,m--;else if(r[u]===o[p])l[p]=Ms(a[u],n[p]),Fs(e,a[h],a[u]),u--,p++;else if(void 0===c&&(c=Nr(o,p,m),d=Nr(r,h,u)),c.has(r[h]))if(c.has(r[u])){const t=d.get(o[p]),i=void 0!==t?a[t]:null;if(null===i){const t=Fs(e,a[h]);Ms(t,n[p]),l[p]=t}else l[p]=Ms(i,n[p]),Fs(e,a[h],i),a[t]=null;p++}else Vs(a[u]),u--;else Vs(a[h]),h++;for(;p<=m;){const t=Fs(e,l[m+1]);Ms(t,n[p]),l[p++]=t}for(;h<=u;){const e=a[h++];null!==e&&Vs(e)}return this.ut=o,Ds(e,l),st}}),Lr=["type","label","description","default","required","group","pattern","allowed","domain","device_class","min","max","step","unit","multiline","selector"];function Fr(e){const t={};for(const s of Lr){const i=e[s];void 0!==i&&(t[s]=i)}Object.assign(t,e.extra);const i={name:e.name};for(const s of e.order)s in t&&(i[s]=t[s]);for(const s of Object.keys(t))s in i||(i[s]=t[s]);return i}function Mr(e){return!!e&&"object"==typeof e&&!Array.isArray(e)}function qr(e,t){const i=e.map(Fr);if("mapping"===t){const e={};for(const t of i){const{name:i}=t,s=We(t,["name"]),a=Object.keys(s);a.length?1!==a.length||"default"!==a[0]||Mr(s.default)||null===s.default?e[String(i)]=s:e[String(i)]=s.default:e[String(i)]=null}return e}if("none"!==t||i.length)return i}function Dr(e,t){const i=new Set(e.map(e=>e.name));if(!i.has(t))return t;let s=2;for(;i.has(`${t}_${s}`);)s+=1;return`${t}_${s}`}function Vr(e,t,i){const s=Object.assign(Object.assign({},e),{extra:Object.assign({},e.extra)});return void 0===i?delete s[t]:s[t]=i,s}function Rr(e){return void 0!==e.type?String(e.type):e.selector&&"object"==typeof e.selector&&"card"in e.selector?"card":""}const zr=e=>Array.isArray(e)?e.map(String).join(", "):null==e?"":String(e),Hr=e=>{const t=e.split(",").map(e=>e.trim()).filter(Boolean);return t.length?t:void 0};class Ur extends c{constructor(){super(...arguments),this._reorderedAsList=!1,this.shared=[],this._asYaml=!1,this._picking=!1}static get styles(){return d`
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
    `}get _rows(){return function(e){var t;const i=[];for(const s of Ne(e)){if(!s||"object"!=typeof s)continue;const e={name:"string"==typeof s.name?s.name:String(null!==(t=s.name)&&void 0!==t?t:""),extra:{},order:Object.keys(s).filter(e=>"name"!==e)};for(const[t,i]of Object.entries(s))"name"!==t&&(Lr.includes(t)?e[t]=i:e.extra[t]=i);i.push(e)}return i}(this.variables)}get _shape(){const e=(t=this.variables,Array.isArray(t)?"list":t&&"object"==typeof t?"mapping":"none");var t;return"none"===e?"list":e}render(){const t=this._rows;return e`
      ${this._asYaml?this._renderYaml():this._renderRows(t)}
      ${this._reorderedAsList?e`<p class="hint">${a("declarations.reordered_as_list",void 0,this.hass)}</p>`:Ue}
      <div class="add">
        <ha-button @click=${this._add}>${a("declarations.add",void 0,this.hass)}</ha-button>
        ${this.shared.length?e`<ha-button
                appearance="plain"
                @click=${()=>{this._picking=!this._picking}}
                >${a("declarations.take_shared",void 0,this.hass)}</ha-button
              >`:Ue}
        <span class="spacer"></span>
        <ha-button
          appearance="plain"
          @click=${()=>{this._asYaml=!this._asYaml}}
          >${a(this._asYaml?"declarations.as_rows":"declarations.as_yaml",void 0,this.hass)}</ha-button
        >
      </div>
      ${this._picking?this._renderShared(t):Ue}
    `}_renderRows(t){if(!t.length)return e`<div class="rows">
        <div class="empty">${a("declarations.none",void 0,this.hass)}</div>
      </div>`;const i=function(e){return e.map((t,i)=>{const s=void 0===t.group?void 0:String(t.group),a=i?e[i-1].group:void 0;return void 0!==s&&s!==(void 0===a?void 0:String(a))?s:void 0})}(t);return e`<div class="rows">
      ${Ir(t,e=>e.name,(s,n)=>e`
          ${void 0!==i[n]?e`<div class="group">${i[n]}</div>`:Ue}
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
              .path=${js}
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
                .path=${"M7,10L12,15L17,10H7Z"}
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
          ${this._open===s.name?this._renderMore(s,n):Ue}
        `)}
    </div>`}_renderMore(t,i){const s={description:t.description,group:t.group,pattern:t.pattern,domain:zr(t.domain),device_class:zr(t.device_class),min:t.min,max:t.max,step:t.step,unit:t.unit,allowed:zr(t.allowed),multiline:t.multiline};return e`<div class="more">
      <ha-form
        .hass=${this.hass}
        .data=${s}
        .schema=${function(e,t){const i=Rr(e);return[{name:"",type:"grid",column_min_width:"160px",schema:[{name:"description",label:a("declarations.description",void 0,t),selector:{text:{multiline:!0}}},{name:"group",label:a("declarations.group",void 0,t),selector:{text:{}}},..."entity"===i?[{name:"domain",label:a("declarations.domain",void 0,t),selector:{text:{}}},{name:"device_class",label:a("declarations.device_class",void 0,t),selector:{text:{}}}]:"number"===i?[{name:"min",label:a("declarations.min",void 0,t),selector:{number:{mode:"box"}}},{name:"max",label:a("declarations.max",void 0,t),selector:{number:{mode:"box"}}},{name:"step",label:a("declarations.step",void 0,t),selector:{number:{mode:"box"}}},{name:"unit",label:a("declarations.unit",void 0,t),selector:{text:{}}}]:"select"===i?[{name:"allowed",label:a("declarations.allowed",void 0,t),selector:{text:{}}}]:"text"===i?[{name:"multiline",label:a("declarations.multiline",void 0,t),selector:{boolean:{}}}]:[],..."card"===i?[]:[{name:"pattern",label:a("declarations.pattern",void 0,t),selector:{text:{}}}]]}]}(t,this.hass)}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        @value-changed=${e=>this._moreChanged(e,i)}
      ></ha-form>
      ${void 0!==t.selector&&"card"!==Rr(t)?e`<ha-form
              .hass=${this.hass}
              .data=${{selector:t.selector}}
              .schema=${[{name:"selector",label:a("declarations.selector",void 0,this.hass),selector:{object:{}}}]}
              .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
              @value-changed=${e=>this._selectorChanged(e,i)}
            ></ha-form>`:Ue}
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
                    ${t.label?e` - ${t.label}`:Ue}
                  </li>`)}
            </ul>`:e`<p>${a("declarations.take_shared_none",void 0,this.hass)}</p>`}
    </div>`}_rowData(e){const t=void 0===e.default||["string","number","boolean"].includes(typeof e.default);return{name:e.name,type:Rr(e),label:e.label,default:t?void 0===e.default?void 0:String(e.default):e.default,required:!0===e.required}}_rowSchema(e){const t=void 0===e.default||["string","number","boolean"].includes(typeof e.default),[i]=(s=this.hass,[{name:"",type:"grid",column_min_width:"120px",schema:[{name:"name",label:a("declarations.name",void 0,s),selector:{text:{}}},{name:"type",label:a("declarations.type",void 0,s),selector:{select:{mode:"dropdown",options:[{value:"",label:a("declarations.type_any",void 0,s)},...at.map(e=>({value:e,label:a(`type_name.${e}`,void 0,s)})),{value:"card",label:a("type_name.card",void 0,s)}]}}},{name:"label",label:a("declarations.label",void 0,s),selector:{text:{}}},{name:"default",label:a("declarations.default",void 0,s),selector:{text:{}}},{name:"required",label:a("declarations.required",void 0,s),selector:{boolean:{}}}]}]);var s;if(t)return[i];const n=i.schema.map(e=>"default"===e.name?(e=>({name:"default",label:a("declarations.default",void 0,e),selector:{object:{}}}))(this.hass):e);return[Object.assign(Object.assign({},i),{schema:n})]}_rowChanged(e,t){var i,s;e.stopPropagation();const a=this._rows,n=a[t];if(!n)return;const o=e.detail.value;let r=n;const l="string"==typeof o.name?o.name.trim():n.name;l&&l!==n.name&&(r=Vr(r,"name",Dr(a.filter((e,i)=>i!==t),l)),this._open===n.name&&(this._open=r.name)),(null!==(i=o.type)&&void 0!==i?i:"")!==Rr(n)&&(r=function(e,t){let i=Vr(e,"type",void 0);return i=Vr(i,"selector",void 0),"card"===t?Vr(i,"selector",{card:{}}):t?Vr(i,"type",t):i}(r,String(null!==(s=o.type)&&void 0!==s?s:""))),r=Vr(r,"label","string"==typeof o.label&&""!==o.label?o.label:void 0),r=Vr(r,"required",!0===o.required||void 0),o.default===n.default||""===o.default&&void 0===n.default||(r=Vr(r,"default",this._defaultFrom(o.default,n))),this._emit(qr(a.map((e,i)=>i===t?r:e),this._shape))}_defaultFrom(e,t){if(""===e||null==e)return;if("string"!=typeof e)return e;const i=Rr(t);return"number"!==i||""===e.trim()||Number.isNaN(Number(e))?"boolean"===i&&["true","false"].includes(e.trim().toLowerCase())?"true"===e.trim():e:Number(e)}_moreChanged(e,t){e.stopPropagation();const i=this._rows,s=i[t];if(!s)return;const a=e.detail.value;let n=s;const o=e=>"string"==typeof e&&e.trim()?e:void 0;n=Vr(n,"description",o(a.description)),n=Vr(n,"group",o(a.group)),n=Vr(n,"pattern",o(a.pattern)),n=Vr(n,"unit",o(a.unit));for(const l of["min","max","step"])n=Vr(n,l,"number"==typeof a[l]?a[l]:void 0);n=Vr(n,"multiline",!0===a.multiline||void 0);const r=e=>{const t="string"==typeof e?Hr(e):void 0;return void 0===t?void 0:1===t.length?t[0]:t};n=Vr(n,"domain",r(a.domain)),n=Vr(n,"device_class",r(a.device_class)),n=Vr(n,"allowed","string"==typeof a.allowed?Hr(a.allowed):void 0),this._emit(qr(i.map((e,i)=>i===t?n:e),this._shape))}_selectorChanged(e,t){e.stopPropagation();const i=this._rows,s=e.detail.value.selector,a=Vr(i[t],"selector",s&&"object"==typeof s?s:void 0);this._emit(qr(i.map((e,i)=>i===t?a:e),this._shape))}_add(){const e=this._rows,t=function(e,t="variable"){return{name:Dr(e,t),extra:{},order:[]}}(e);this._open=t.name,this._emit(qr([...e,t],this._shape))}_takeShared(e){const t=this._rows,i={name:e.name,extra:{},order:[]};this._picking=!1,this._emit(qr([...t,i],this._shape))}_remove(e){const t=this._rows;this._emit(qr(t.filter((t,i)=>i!==e),this._shape))}_move(e,t){const i=this._rows,s=function(e,t,i){if(t===i||t<0||i<0||t>=e.length||i>=e.length)return e;const s=[...e],[a]=s.splice(t,1);return s.splice(i,0,a),s}(i,e,t);if(s===i)return;const a="mapping"===this._shape?"list":this._shape;this._reorderedAsList="mapping"===this._shape,this._emit(qr(s,a))}_drop(e,t){e.preventDefault();const i=this._dragging;this._dragging=void 0,void 0!==i&&this._move(i,t)}_emit(e){h(this,"value-changed",{value:e})}}o([r({attribute:!1})],Ur.prototype,"hass",void 0),o([r({attribute:!1})],Ur.prototype,"variables",void 0),o([l()],Ur.prototype,"_reorderedAsList",void 0),o([r({attribute:!1})],Ur.prototype,"shared",void 0),o([l()],Ur.prototype,"_open",void 0),o([l()],Ur.prototype,"_asYaml",void 0),o([l()],Ur.prototype,"_picking",void 0);const Wr="decluttering-declarations-editor";customElements.get(Wr)||customElements.define(Wr,Ur);const Kr=["card","badge","row","element"];function Yr(e,t,i=[]){if(Array.isArray(e))e.forEach((e,s)=>Yr(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,a]of Object.entries(e))Yr(a,t?`${t}.${s}`:s,i);else null!=e&&i.push({path:t,value:String(e)});return i}const Br=["grid_options","visibility","view_layout","layout_options"];function Jr(e){const t={};for(const[i,s]of Object.entries(null!=e?e:{}))Br.includes(i)||(t[i]=s);return t}function Zr(e){if(Array.isArray(e))return e.map(Zr);if(e&&"object"==typeof e){const t={};for(const i of Object.keys(e).sort())t[i]=Zr(e[i]);return t}return 0}function Gr(e,t=[],i=[]){if(Array.isArray(e))e.forEach((e,s)=>Gr(e,[...t,s],i));else if(e&&"object"==typeof e)for(const[s,a]of Object.entries(e))Gr(a,[...t,s],i);else i.push({path:t,value:e});return i}function Qr(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}function Xr(e){const t=new Map;e.forEach((e,i)=>{var s;if(!e||"object"!=typeof e||"string"!=typeof e.type)return;const a=Jr(e);if(JSON.stringify(a).includes("[["))return;const n=JSON.stringify([e.type,Zr(a)]);t.set(n,[...null!==(s=t.get(n))&&void 0!==s?s:[],i])});const i=[];for(const[s,a]of t){if(a.length<2)continue;const t=a.map(t=>Jr(e[t])),n=Gr(t[0]).map(e=>e.path).filter(e=>t.some(i=>JSON.stringify(Qr(i,e))!==JSON.stringify(Qr(t[0],e))));!n.length||n.length>8||i.push({indices:a,type:e[a[0]].type,differing:n,key:s})}return i.sort((e,t)=>t.indices.length-e.indices.length||e.indices[0]-t.indices[0])}const el=e=>e.replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value";function tl(e){const t=e[e.length-1];if("string"==typeof t)return el(t);const i=[...e].reverse().find(e=>"string"==typeof e);return el(`${null!=i?i:"item"}_${t+1}`)}function il(e){const t=e.map(tl),i=[];return e.forEach((e,s)=>{const a=(n=t[s],t.filter(e=>e===n).length>1?function(e){return el(e.map(e=>"number"==typeof e?String(e+1):e).join("_"))}(e):t[s]);var n;i.push(ts(a,i))}),i}function sl(e){var t;const i=e.map(Jr),s=null!==(t=i[0])&&void 0!==t?t:{},a=Gr(s).map(e=>e.path).filter(e=>i.some(t=>JSON.stringify(Qr(t,e))!==JSON.stringify(Qr(s,e)))),n=il(a),o=JSON.parse(JSON.stringify(s));return a.forEach((e,t)=>{Qr(o,e.slice(0,-1))[e[e.length-1]]=`[[${n[t]}]]`}),{template:{card:o},names:n,variables:i.map(e=>a.map((t,i)=>({[n[i]]:Qr(e,t)}))),layout:e.map(e=>{const t={};for(const i of Br)void 0!==(null==e?void 0:e[i])&&(t[i]=e[i]);return t})}}function al(e,t,i){return Object.assign({type:"custom:decluttering-card-plus",template:e,variables:t},i)}const nl="_";function ol(e){let t="string"==typeof e?e:JSON.stringify(e);if("string"!=typeof t||!t.includes("[["))return[];const i=new Set;for(let s=0;s<5;s+=1){let e=!1;if(t=t.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(t,s)=>{if(e=!0,s.startsWith(qe))return nl;const a=s.endsWith("?")?s.slice(0,-1):s,[n,...o]=a.split("|"),r=n.endsWith("?")?n.slice(0,-1):n;for(const e of[r,r.split(".")[0]])e&&e!==nl&&i.add(e);for(const e of o){const t=e.startsWith("or:")?e.slice(3):Me(e);t&&t!==nl&&i.add(t)}return nl}),!e)break}return[...i]}function rl(e,t=[]){if(Array.isArray(e)){for(const i of e)rl(i,t);return t}if(!e||"object"!=typeof e)return t;Te.includes(e.type)&&!0===e[ct]&&"string"==typeof e.template&&t.push(e.template);for(const i of Object.values(e))rl(i,t);return t}function ll(e,t,i=new Set){const s=new Set;if(!e)return{names:s,complete:!0};lt in e&&(e=Object.assign(Object.assign({},e),{default:e[lt]}));for(const n of $(e))s.add(n.name);for(const n of _e(je(e))){const e=L(n);void 0!==e&&s.add(e)}for(const n of ol(e))s.add(n);let a=!0;for(const n of rl(e)){if(i.has(n))continue;if(i.add(n),!Object.prototype.hasOwnProperty.call(t,n)){a=!1;continue}const e=ll(t[n],t,i);for(const t of e.names)s.add(t);e.complete||(a=!1)}return{names:s,complete:a}}function cl(e,t){const i=new Map,s=(e,t,s,a)=>{const n=JSON.stringify([e.index,t,a.name,s]),o=i.get(n);o?(o.count+=1,!o.closest&&a.closest&&(o.closest=a.closest)):i.set(n,Object.assign(Object.assign({view:e,template:t,name:a.name},a.closest?{closest:a.closest}:{}),{where:s,count:1}))},a=(e,i,o)=>{var r,l;if(Array.isArray(e))for(const t of e)a(t,i,o);else if(e&&"object"==typeof e){if(Te.includes(e.type)&&"string"==typeof e.template){const a=Object.prototype.hasOwnProperty.call(t,e.template)?t[e.template]:void 0;if(a){const c=new Set,d=(r,l)=>{for(const d of function(e,t,i,s={lets:[],defaults:[]},a){if(!e)return[];const{names:o,complete:r}=ll(e,t);if(!r)return[];const l=new Set([..._e(e.let),...s.lets].map(L).filter(e=>void 0!==e)),c=O(i),d=new Set(o);for(const n of ol(a))d.add(n);for(const n of[...s.lets,...s.defaults]){const e=L(n);if(void 0!==e)for(const t of ol(n[e]))d.add(t)}const h=e=>!l.has(e)&&(d.has(e)||d.has(e.split(".")[0]));let u=!0;const p=new Set;for(;u;){u=!1;for(const e of c){const t=L(e);if(!p.has(t)&&h(t)){p.add(t);for(const i of ol(e[t]))d.has(i)||(d.add(i),u=!0)}}}const m=new Set(c.map(e=>L(e))),f=[...d].filter(e=>!m.has(e)&&!l.has(e)),g=[];for(const _ of m){if(h(_))continue;const e=n(_,f);g.push(e?{name:_,closest:e}:{name:_})}return g}(a,t,l,o,[e.on_error,e.for_each_from]))c.has(d.name)||(c.add(d.name),s(i,e.template,r,d))};d("variables",e.variables);for(const t of null!==(r=F(e.for_each))&&void 0!==r?r:[])d("for_each",t);const h=null===(l=e.for_each_from)||void 0===l?void 0:l.overrides;if(h&&"object"==typeof h)for(const e of Object.values(h))d("overrides",e)}}for(const t of Object.values(e))a(t,i,o)}};return ot(e,(t,i,s)=>{var n,o,r;const l=e.views[i];a(t,{title:null!==(o=null!==(n=null==l?void 0:l.title)&&void 0!==n?n:null==l?void 0:l.path)&&void 0!==o?o:"",path:null!==(r=null==l?void 0:l.path)&&void 0!==r?r:"",index:i},rt(e,i,s))}),[...i.values()].map(({view:e,template:t,name:i,closest:s,where:a,count:n})=>s?{view:e,template:t,name:i,closest:s,where:a,count:n}:{view:e,template:t,name:i,where:a,count:n})}function dl(e,t,i){if(!e.includes("[["))return e;const s=e.replace(/\[\[([^[\]]+)\]\]/g,(e,s)=>s.startsWith(qe)?e:`[[${function(e,t,i){const s=e.endsWith("?"),a=(s?e.slice(0,-1):e).split("|"),n=a[0],o=n.endsWith("?"),r=o?n.slice(0,-1):n;(r===t||r.startsWith(`${t}.`))&&(a[0]=`${i}${r.slice(t.length)}${o?"?":""}`);for(let l=1;l<a.length;l+=1){const e=a[l];if(e===`or:${t}`)a[l]=`or:${i}`;else if(Me(e)===t){const s=e.startsWith("if:!")?"!":"";a[l]=`if:${s}${i}${e.slice(3+s.length+t.length)}`}}return`${a.join("|")}${s?"?":""}`}(s,t,i)}]]`);return s.replace(new RegExp(`\\[\\[${a=t,a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=\\.\\[\\[)`,"g"),`[[${i}`);var a}function hl(e,t,i){if("string"==typeof e)return dl(e,t,i);if(Array.isArray(e))return e.map(e=>hl(e,t,i));if(e&&"object"==typeof e){const s={};for(const[a,n]of Object.entries(e))s[dl(a,t,i)]=hl(n,t,i);return s}return e}function ul(e,t,i){const s=e=>!!e&&"object"==typeof e&&!Array.isArray(e),a=(e,t)=>s(e)&&Object.prototype.hasOwnProperty.call(e,t),n=e=>{if(!s(e))return e;const a={};for(const[s,n]of Object.entries(e))s!==i&&(a[s===t?i:s]=n);return a};return Array.isArray(e)?e.some(e=>a(e,t))?e.map(n).filter(e=>!s(e)||Object.keys(e).length>0):e:a(e,t)?n(e):e}function pl(e,t,i){const s=hl(e,t,i);return Array.isArray(s.variables)?s.variables=s.variables.map(e=>e&&"object"==typeof e&&e.name===t?Object.assign(Object.assign({},e),{name:i}):e):s.variables&&"object"==typeof s.variables&&(s.variables=ul(s.variables,t,i)),void 0!==s.default&&(s.default=ul(s.default,t,i)),void 0!==s.defaults&&(s.defaults=ul(s.defaults,t,i)),void 0!==s.let&&(s.let=ul(s.let,t,i)),s}function ml(e){const t=null==e?void 0:e.extends;return(Array.isArray(t)?t:[t]).filter(e=>"string"==typeof e)}function fl(e,t,i){const s=nt(e),a=new Set([t]);for(const o of null!=i?i:[])Object.prototype.hasOwnProperty.call(s,o)||a.add(o);let n=!0;for(;n;){n=!1;for(const[e,t]of Object.entries(s))!a.has(e)&&ml(t).some(e=>a.has(e))&&(a.add(e),n=!0)}return a}function gl(e){if(!e)return[];const t=new Set(ys(e));for(const i of ol(e))i.includes(".")||"_"===i||t.add(i);return[...t].sort()}function _l(e,t,i,s,a){const n=fl(e,t,a);let o=0,r=0;const l=(e,t)=>JSON.stringify(e)!==JSON.stringify(t),c=e=>{if(Array.isArray(e))return e.map(c);if(!e||"object"!=typeof e)return e;let t={};for(const[i,s]of Object.entries(e))t[i]=c(s);if(Te.includes(e.type)&&n.has(e.template)){const e=function(e,t,i){var s;const a=Object.assign({},e);void 0!==a.variables&&(a.variables=ul(a.variables,t,i)),Array.isArray(a.for_each)?a.for_each=a.for_each.map(e=>ul(e,t,i)):void 0!==a.for_each&&(a.for_each=ul(a.for_each,t,i));const n=null===(s=a.for_each_from)||void 0===s?void 0:s.overrides;if(n&&"object"==typeof n&&!Array.isArray(n)){const e={};for(const[s,a]of Object.entries(n))e[s]=ul(a,t,i);a.for_each_from=Object.assign(Object.assign({},a.for_each_from),{overrides:e})}return"string"==typeof a.name&&(a.name=dl(a.name,t,i)),a}(t,i,s);l(e,t)&&(o+=1),t=e}if(u(e.type)&&n.has(e.template)){const e=pl(t,i,s);l(e,t)&&(r+=1),t=e}return t},d=Object.assign({},e);Array.isArray(null==e?void 0:e.views)&&(d.views=c(e.views));const h=null==e?void 0:e.decluttering_templates;if(h&&"object"==typeof h){const e={};for(const[t,a]of Object.entries(h)){let o=c(a);if(n.has(t)){const e=pl(o,i,s);l(e,o)&&(r+=1),o=e}e[t]=o}d.decluttering_templates=e}return{config:d,cards:o,templates:r}}function vl(e,t,i){if(Object.prototype.hasOwnProperty.call(nt(e),t))return!1;if(i===dt)return!0;const s=ht(e);return s.includes(i)||s.includes("*")}class yl extends c{constructor(){super(...arguments),this._renameTo="",this._renaming=!1,this._duplicateTo="",this._busy=!1,this._modernisePending=!1,this._similarNames={},this._searchQuery="",this._searching=!1,this._varTo=""}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=Y())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:v()}static get styles(){return Cs}_fireConfigChanged(e){h(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return Os(this,e,t,i)}render(){return this.hass&&this._config?this._renderUsages():e``}_renderUsages(){var t,i;const s=null===(t=this._config)||void 0===t?void 0:t.template;if(!s)return e``;const n=this._savedLovelace;if(!n)return e`<div class="usages">
        <ha-alert alert-type="warning">${a("template_editor.usages_unreadable",void 0,this.hass)}</ha-alert>
      </div>`;(null===(i=this._usages)||void 0===i?void 0:i.name)===s&&this._usages.ll===n||(this._usages={name:s,ll:n,usages:ut(n,s)});const{views:o,templates:r}=this._usages.usages,l=o.reduce((e,t)=>e+t.count,0),c=document.location.pathname.split("/").slice(0,2).join("/");return e`
      <div class="usages">
        ${0!==l||r.length?e`
                <p class="hint">
                  ${a(1===l?"template_editor.usages_one":"template_editor.usages_many",{total:l,name:s},this.hass)}
                </p>
                <ul>
                  ${o.map(t=>e`
                      <li>
                        <a href=${`${c}/${t.path||t.index}`} target="_blank" rel="noreferrer">
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
    `}_renderUndo(){var t,i;const s=pt();if(!s)return e``;const n=mt(s.operation,this.hass),o=new Date(s.at).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language);return e`
      <div class="undo">
        <p class="hint">${a("undo.held",{operation:n,time:o},this.hass)}</p>
        ${this._undoChanged?e`<ha-alert alert-type="warning">
                ${a("undo.changed_here",{operation:n,dashboards:this._undoChanged.join(", ")},this.hass)}
              </ha-alert>`:e``}
        <ha-button .disabled=${this._busy} @click=${this._undo}>
          ${a(this._undoChanged?"undo.anyway_button":"undo.button",{operation:n},this.hass)}
        </ha-button>
      </div>
    `}async _undo(){const e=pt();if(e){this._busy=!0;try{const t=await ft(this,this.hass,e,!!this._undoChanged,!1);this._undoChanged="changed"===(null==t?void 0:t.result)?t.dashboards:void 0}finally{this._busy=!1}}}_renderSimilar(t){var i;if((null===(i=this._similar)||void 0===i?void 0:i.ll)!==t){const e=gt(t);this._similar={ll:t,cards:e,groups:Xr(e.map(e=>e.config))}}const{cards:s,groups:n}=this._similar;if(!n.length)return e``;const o=Object.keys(y(t));return e`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${a(1===n.length?"tools.similar_header_one":"tools.similar_header",{count:n.length},this.hass)}
        </span>
        <p class="hint">${a("tools.similar_hint",{max:8},this.hass)}</p>
        ${n.slice(0,10).map(e=>this._renderSimilarGroup(e,s,o))}
      </ha-expansion-panel>
    `}_renderSimilarGroup(t,i,s){var n;const o=t.indices.map(e=>i[e]),r=sl(o.map(e=>e.config)),l=(null!==(n=this._similarNames[t.key])&&void 0!==n?n:function(e,t,i=[]){let s=el(e.replace(/^custom:/,"").replace(/-/g,"_")).toLowerCase();/(^|_)card$/.test(s)||(s=`${s}_card`);const a=new Set(i.map(e=>"string"==typeof(null==e?void 0:e.entity)&&e.entity.includes(".")?e.entity.split(".")[0]:"")),[n]=[...a];return 1===a.size&&n&&(s=`${el(n).toLowerCase()}_${s}`),ts(s,t)}(t.type,s,o.map(e=>e.config))).trim(),c=this._similarPending===`${t.key}\0${l}`,d=s.includes(l);return e`
      <div class="similar">
        <h3>${a("tools.similar_group",{count:o.length,type:t.type},this.hass)}</h3>
        <p class="hint">${a("tools.similar_differ",{names:r.names.join(", ")},this.hass)}</p>
        <ul>
          ${o.slice(0,8).map(t=>e`<li>${t.label}</li>`)}
        </ul>
        ${o.length>8?e`<p class="hint">
                ${a("editor.matches_more",{count:o.length-8},this.hass)}
              </p>`:e``}
        ${d?e`<ha-alert alert-type="error">${a("tools.name_taken",{name:l},this.hass)}</ha-alert>`:e``}
        ${c?e`
                <ha-alert alert-type="warning">
                  ${a("tools.similar_confirm",{name:l,count:o.length},this.hass)}
                </ha-alert>
                <p class="hint">${a("tools.similar_template",{name:l},this.hass)}</p>
                ${Rs(`${t.key}\0${l}`,e`<ha-yaml-editor
                    .hass=${this.hass}
                    .defaultValue=${{[l]:r.template}}
                    read-only
                  ></ha-yaml-editor>`)}
                <p class="hint">${a("tools.similar_first_card",void 0,this.hass)}</p>
                ${Cr(o[0].config,al(l,r.variables[0],r.layout[0]),this.hass)}
              `:e``}
        ${Ss({label:a("tools.similar_name",void 0,this.hass),value:l,disabled:this._busy,onInput:e=>{this._similarNames=Object.assign(Object.assign({},this._similarNames),{[t.key]:e}),this._similarPending=void 0}})}
        <ha-button
          .disabled=${this._busy||!l||d}
          @click=${()=>{this._makeTemplate(t,o,l)}}
        >
          ${a(c?"tools.similar_make_anyway":"tools.similar_make",void 0,this.hass)}
        </ha-button>
      </div>
    `}async _makeTemplate(e,t,i){const s=`${e.key}\0${i}`;if(this._similarPending!==s)return void(this._similarPending=s);const a=await this._saveDashboard(e=>function(e,t,i){const{template:s,variables:a,layout:n}=sl(t);let o=Ye(e,i,s);return t.forEach((e,t)=>{o=Q(o,e,al(i,a[t],n[t]))}),o}(e,t.map(e=>e.config),i),"make_template");if(a){this._similarPending=void 0;const t=Object.assign({},this._similarNames);delete t[e.key],this._similarNames=t}}_renderElsewhere(t){var i;if((null===(i=this._remoteUsages)||void 0===i?void 0:i.name)!==t){this._remoteUsages={name:t,list:[]};const e=document.location.pathname.split("/").filter(Boolean)[0];_t(this.hass,t,e).then(e=>{var i;(null===(i=this._remoteUsages)||void 0===i?void 0:i.name)===t&&(this._remoteUsages={name:t,list:e})})}const s=this._remoteUsages.list;if(!s.length)return e``;const n=s.map(e=>`${e.urlPath} (${e.total})`).join(", ");return e`<ha-alert alert-type="info">
      ${a("template_editor.usages_elsewhere",{list:n},this.hass)}
    </ha-alert>`}_renderImpact(t,i){const s=vt(t,i);if(!s||!this._config)return e``;const n=e=>{if(e)return H(s.variables,e,V(e),i,this.hass,!0)};let o,r;try{o=n(y(t)[i]),r=n(y(t,void 0,this._config)[i])}catch(l){return e``}return e`
      <ha-expansion-panel outlined>
        <span slot="header">${a("template_editor.impact_header",void 0,this.hass)}</span>
        <p class="hint">${a("template_editor.impact_diff_hint",void 0,this.hass)}</p>
        ${Er(o,r,this.hass)}
      </ha-expansion-panel>
    `}_renderRename(t,i){const s=this._renameTo.trim(),n=!!s&&this._renamePending===s,o=i?1===i?a("tools.rewrites_one",void 0,this.hass):a("tools.rewrites_many",{count:i},this.hass):"";return e`
      <div class="rename">
        <h3>${a("tools.rename_header",void 0,this.hass)}</h3>
        <p class="hint">${a("tools.rename_hint",void 0,this.hass)}</p>
        ${this._renameError?e`<ha-alert alert-type="error">${this._renameError}</ha-alert>`:e``}
        ${n?e`<ha-alert alert-type="warning">
                ${a("tools.rename_confirm",{from:t,to:s,rewrites:o},this.hass)}
              </ha-alert>`:e``}
        ${Ss({label:a("tools.new_name",void 0,this.hass),value:this._renameTo,disabled:this._renaming,onInput:e=>this._renameChanged(e)})}
        <ha-button .disabled=${this._renaming||!s||s===t} @click=${this._rename}>
          ${n?a("tools.rename_anyway",void 0,this.hass):1===i?a("tools.rename_update_one",void 0,this.hass):i?a("tools.rename_update_many",{count:i},this.hass):a("tools.rename",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderModernise(){const t=this._savedLovelace,i=t?yt(t):0;return i?e`
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
    `:e``}async _modernise(){if(!this._modernisePending)return void(this._modernisePending=!0);await this._saveDashboard(e=>bt(e),"modernise")&&(this._modernisePending=!1)}_renameChanged(e){this._renameTo=e,this._renameError=void 0,this._renamePending=void 0}async _rename(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._renameTo.trim();if(!i||!s||s===i)return;const n=Y();if(n)if(void 0===y(n.config)[s])if(this._renamePending===s){this._renaming=!0,this._renameError=void 0;try{await J(this,this.hass,"rename_template",[{urlPath:G(),build:e=>$t(e,i,s)}],this._config),this._undoChanged=void 0,this._fireConfigChanged(Object.assign(Object.assign({},this._config),{template:s})),this._renameTo="",this._renamePending=void 0}catch(o){this._renameError=a("tools.save_failed",{message:null!==(t=null==o?void 0:o.message)&&void 0!==t?t:o},this.hass)}finally{this._renaming=!1}}else this._renamePending=s;else this._renameError=a("tools.name_taken",{name:s},this.hass);else this._renameError=a("tools.cannot_rename_here",void 0,this.hass)}_renderSearch(){const t=this._searchQuery.trim(),i=this._searchResult,s=e=>"variables"===e.where?"":a(`tools.search_in_${e.where}`,void 0,this.hass),n=e=>e.view.title||e.view.path||a("template_editor.untitled_view",void 0,this.hass);return e`
      <div class="rename">
        <h3>${a("tools.search_header",void 0,this.hass)}</h3>
        <p class="hint">${a("tools.search_hint",void 0,this.hass)}</p>
        ${Ss({label:a("tools.search_label",void 0,this.hass),value:this._searchQuery,onInput:e=>{this._searchQuery=e},onKeydown:e=>{"Enter"===e.key&&this._search()}})}
        <ha-button .disabled=${this._searching||!t} @click=${()=>{this._search()}}>
          ${a(this._searching?"tools.searching":"tools.search",void 0,this.hass)}
        </ha-button>
        ${!i||i.cards.length||i.templates.length?e``:e`<p class="hint">${a("tools.search_none",{query:i.query},this.hass)}</p>`}
        ${(null==i?void 0:i.cards.length)?e`
                <p class="hint">${a("tools.search_cards",{count:i.cards.length},this.hass)}</p>
                <ul>
                  ${i.cards.slice(0,ws).map(t=>e`
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
                ${i.cards.length>ws?e`<p class="hint">
                        ${a("editor.matches_more",{count:i.cards.length-ws},this.hass)}
                      </p>`:e``}
              `:e``}
        ${(null==i?void 0:i.templates.length)?e`
                <p class="hint">${a("tools.search_templates",{count:i.templates.length},this.hass)}</p>
                <ul>
                  ${i.templates.slice(0,ws).map(t=>e`<li>
                          ${t.urlPath} › ${t.template}: <code>${t.path}</code> = ${t.value}
                        </li>`)}
                </ul>
                ${i.templates.length>ws?e`<p class="hint">
                        ${a("editor.matches_more",{count:i.templates.length-ws},this.hass)}
                      </p>`:e``}
              `:e``}
      </div>
    `}async _search(){const e=this._searchQuery.trim();if(e&&!this._searching){this._searching=!0;try{const i=G(),s=Ge(this.hass),a=[{urlPath:i,config:this._savedLovelace}];for(const e of this.hass?await wt(this.hass):[])if(xt(e)!==i)try{a.push({urlPath:e,config:await Qe(s,e)})}catch(t){}this._searchResult=Object.assign({query:e},function(e,t){var i;const s=t.trim().toLowerCase(),a=[],n=[];if(!s)return{cards:a,templates:n};const o=e=>e.toLowerCase().includes(s);for(const{urlPath:r,config:l}of e){const e=(e,t)=>{var i,s;const n=(i,s,n)=>{a.push({urlPath:r,view:t,template:e.template,where:i,variable:s,value:n})},l=(e,t,i="")=>{for(const s of O(t)){const[t,a]=Object.entries(s)[0];for(const s of Yr(a,`${i}${t}`))o(s.value)&&n(e,s.path,s.value)}};l("variables",e.variables);for(const a of null!==(i=F(e.for_each))&&void 0!==i?i:[])l("for_each",a);const c=null===(s=e.for_each_from)||void 0===s?void 0:s.overrides;if(c&&"object"==typeof c)for(const[a,r]of Object.entries(c))o(a)&&n("overrides",a,a),l("overrides",r,`${a} › `);for(const a of Kr)if(void 0!==e[a])for(const t of Yr(e[a],a))o(t.value)&&n("override_block",t.path,t.value)},t=(i,s)=>{if(Array.isArray(i))for(const e of i)t(e,s);else if(i&&"object"==typeof i&&!u(i.type)){Te.includes(i.type)&&"string"==typeof i.template&&e(i,s);for(const e of Object.values(i))t(e,s)}};(null!==(i=null==l?void 0:l.views)&&void 0!==i?i:[]).forEach((e,i)=>{var s,a,n;return t(e,{title:null!==(a=null!==(s=null==e?void 0:e.title)&&void 0!==s?s:null==e?void 0:e.path)&&void 0!==a?a:"",path:null!==(n=null==e?void 0:e.path)&&void 0!==n?n:"",index:i})});for(const[i,s]of Object.entries(nt(l))){const e=Object.assign({},null!=s?s:{});delete e.type,delete e.template;for(const t of Yr(e,""))o(t.value)&&n.push(Object.assign({urlPath:r,template:i},t))}}return{cards:a,templates:n}}(a,e))}finally{this._searching=!1}}}_renderRenameVariable(t){const i=gl(this._config);if(!i.length||!this._config)return e``;const s=this._varFrom&&i.includes(this._varFrom)?this._varFrom:void 0,n=this._varTo.trim(),o=this._varPending,r=!!o&&o.from===s&&o.to===n,l=r&&o.elsewhere.length?a("tools.rename_variable_elsewhere",{list:o.elsewhere.map(e=>`${e.urlPath} (${e.cards})`).join(", ")},this.hass):"";return e`
      <div class="rename">
        <h3>${a("tools.rename_variable_header",void 0,this.hass)}</h3>
        <p class="hint">${a("tools.rename_variable_hint",void 0,this.hass)}</p>
        ${this._varError?e`<ha-alert alert-type="error">${this._varError}</ha-alert>`:e``}
        ${r&&s?e`
                <ha-alert alert-type="warning">
                  ${a("tools.rename_variable_confirm",{from:s,to:n,templates:o.templates,cards:o.cards,elsewhere:l},this.hass)}
                </ha-alert>
                ${Cr(this._config,pl(this._config,s,n),this.hass)}
              `:e``}
        <ha-form
          .hass=${this.hass}
          .data=${{variable:null!=s?s:""}}
          .schema=${[{name:"variable",selector:{select:{mode:"dropdown",options:i.map(e=>({value:e,label:e}))}}}]}
          .computeLabel=${()=>a("tools.rename_variable_pick",void 0,this.hass)}
          @value-changed=${this._varPicked}
        ></ha-form>
        ${Ss({label:a("tools.new_name",void 0,this.hass),value:this._varTo,disabled:this._busy,onInput:e=>this._varToChanged(e)})}
        <ha-button
          .disabled=${this._busy||!s||!n||n===s}
          @click=${()=>{this._renameVariable(t)}}
        >
          ${a(r?"tools.rename_anyway":"tools.rename_variable",void 0,this.hass)}
        </ha-button>
      </div>
    `}_varPicked(e){e.stopPropagation(),this._varFrom=e.detail.value.variable||void 0,this._varError=void 0,this._varPending=void 0}_varToChanged(e){this._varTo=e,this._varError=void 0,this._varPending=void 0}async _renameVariable(e){var t;const i=this._varFrom,s=this._varTo.trim();if(!i||!s||s===i||!this._config)return;if(!function(e){return/^[A-Za-z0-9_-]+$/.test(e)}(s))return void(this._varError=a("tools.rename_variable_invalid",{name:s},this.hass));const n=Y();if(!n)return void(this._varError=a("tools.cannot_save_here",void 0,this.hass));if(function(e,t,i,s){const a=nt(e);for(const n of fl(e,t))if(gl(n===t&&s?s:a[n]).includes(i))return!0;return!1}(n.config,e,s,this._config))return void(this._varError=a("tools.rename_variable_taken",{name:s},this.hass));const o=G(),r=this._varPending;if(r&&r.from===i&&r.to===s){this._busy=!0,this._varError=void 0;try{let t;await J(this,this.hass,"rename_variable",[{urlPath:o,build:a=>(t=fl(a,e),_l(a,e,i,s).config)},...r.elsewhere.map(a=>({urlPath:a.urlPath,build:a=>vl(a,e,o)?_l(a,e,i,s,t).config:a}))],this._config),this._undoChanged=void 0,this._fireConfigChanged(pl(this._config,i,s)),this._varFrom=s,this._varTo="",this._varPending=void 0}catch(l){this._varError=a("tools.save_failed",{message:null!==(t=null==l?void 0:l.message)&&void 0!==t?t:l},this.hass)}finally{this._busy=!1}}else{this._busy=!0;try{const t=Ge(this.hass),a=await Qe(t,o).catch(()=>n.config),r=_l(a,e,i,s),l=fl(a,e),d=[];for(const n of this.hass?await wt(this.hass):[]){if(xt(n)===o)continue;let a;try{a=await Qe(t,n)}catch(c){continue}if(!vl(a,e,o))continue;const r=_l(a,e,i,s,l);(r.cards||r.templates)&&d.push({urlPath:n,cards:r.cards})}this._varPending={from:i,to:s,cards:r.cards,templates:r.templates,elsewhere:d}}finally{this._busy=!1}}}_renderDuplicate(t){const i=this._duplicateTo.trim(),s=!!i&&this._duplicatePending===i;return e`
      <div class="rename">
        <h3>${a("tools.duplicate_header",void 0,this.hass)}</h3>
        <p class="hint">${a("tools.duplicate_hint",void 0,this.hass)}</p>
        ${s?e`<ha-alert alert-type="warning">
                ${a("tools.duplicate_confirm",{to:i,name:t},this.hass)}
              </ha-alert>`:e``}
        ${Ss({label:a("tools.copy_name",void 0,this.hass),value:this._duplicateTo,disabled:this._busy,onInput:e=>this._duplicateChanged(e)})}
        <ha-button .disabled=${this._busy||!i||i===t} @click=${this._duplicate}>
          ${a(s?"tools.duplicate_anyway":"tools.duplicate",void 0,this.hass)}
        </ha-button>
      </div>
    `}_duplicateChanged(e){this._duplicateTo=e,this._toolError=void 0,this._duplicatePending=void 0}async _duplicate(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._duplicateTo.trim();if(!i||!s||s===i)return;const n=Y();if(n&&void 0!==y(n.config)[s])return void(this._toolError=a("tools.name_taken",{name:s},this.hass));if(this._duplicatePending!==s)return void(this._duplicatePending=s);const o=Object.assign(Object.assign({},this._config),{template:s}),r=ee(null!==(t=null==n?void 0:n.config)&&void 0!==t?t:this.lovelace,i),l=await this._saveDashboard(e=>{var t,i;return Be(e,null!==(i=null===(t=null==r?void 0:r.view)||void 0===t?void 0:t.index)&&void 0!==i?i:0,o)},"duplicate");l&&(this._duplicateTo="",this._duplicatePending=void 0)}}o([r({attribute:!1})],yl.prototype,"hass",void 0),o([r({attribute:!1})],yl.prototype,"lovelace",void 0),o([r({attribute:!1})],yl.prototype,"config",void 0),o([l()],yl.prototype,"_renameTo",void 0),o([l()],yl.prototype,"_renameError",void 0),o([l()],yl.prototype,"_renaming",void 0),o([l()],yl.prototype,"_renamePending",void 0),o([l()],yl.prototype,"_duplicateTo",void 0),o([l()],yl.prototype,"_duplicatePending",void 0),o([l()],yl.prototype,"_toolError",void 0),o([l()],yl.prototype,"_busy",void 0),o([l()],yl.prototype,"_modernisePending",void 0),o([l()],yl.prototype,"_remoteUsages",void 0),o([l()],yl.prototype,"_undoChanged",void 0),o([l()],yl.prototype,"_similarNames",void 0),o([l()],yl.prototype,"_similarPending",void 0),o([l()],yl.prototype,"_searchQuery",void 0),o([l()],yl.prototype,"_searching",void 0),o([l()],yl.prototype,"_searchResult",void 0),o([l()],yl.prototype,"_varFrom",void 0),o([l()],yl.prototype,"_varTo",void 0),o([l()],yl.prototype,"_varError",void 0),o([l()],yl.prototype,"_varPending",void 0),customElements.get("decluttering-template-usages-tab")||customElements.define("decluttering-template-usages-tab",yl);class bl extends c{constructor(){super(...arguments),this._selectedTab="settings",this._suggestedNothing=!1,this._busy=!1,this._declutterPending=!1,this._promoteName="",this._loadedElements=!1}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=Y())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:v()}static describeSchema(){var e;return null!==(e=bl._describeSchema)&&void 0!==e||(bl._describeSchema=[{name:"template",label:a("template_editor.template_label"),selector:{text:{}}},{name:"thingType",label:a("template_editor.type_label"),selector:{select:{mode:"dropdown",options:[{value:"card",label:a("template_editor.type_card")},{value:"badge",label:a("template_editor.type_badge")},{value:"row",label:a("template_editor.type_row")},{value:"element",label:a("template_editor.type_element")}]}}},{name:"description",label:a("template_editor.description_label"),helper:a("template_editor.description_helper"),selector:{text:{multiline:!0}}},{name:"category",label:a("template_editor.category_label"),helper:a("template_editor.category_helper"),selector:{text:{}}}]),bl._describeSchema}static defaultsSchema(){var e;return null!==(e=bl._defaultsSchema)&&void 0!==e||(bl._defaultsSchema=[{name:"default",label:a("template_editor.defaults_label"),helper:a("template_editor.defaults_helper"),selector:{object:{}}}]),bl._defaultsSchema}setConfig(e){this._config=e,this._suggestion=void 0,this._suggestedNothing=!1}render(){var t;if(!this.hass||!this._config)return e``;const i={};w(this._config.default)&&w(this._config.defaults)||(i.default=a("error.variables_shape",void 0,this.hass)),kt(this._config.variables)||(i.variables=a("template_editor.declarations_shape",void 0,this.hass));const s={template:this._config.template,thingType:null!==(t=k(this._config))&&void 0!==t?t:"card",description:this._config.description,category:this._config.category},n={default:je(this._config)},o=$(this._config).length;return e`
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
      ${"settings"===this._selectedTab?e`
              <ha-expansion-panel outlined expanded>
                <span slot="header">${a("template_editor.panel_describe",void 0,this.hass)}</span>
                <div class="panel">
                  ${this._renderInUse()}
                  <ha-form
                    .hass=${this.hass}
                    .data=${s}
                    .schema=${bl.describeSchema()}
                    .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
                    .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
                    @value-changed=${this._describeChanged}
                  ></ha-form>
                </div>
              </ha-expansion-panel>
              <ha-expansion-panel outlined expanded>
                <span slot="header"
                  >${a("template_editor.panel_variables",void 0,this.hass)}
                  <small>${a("declarations.count",{count:o},this.hass)}</small></span
                >
                <div class="panel">
                  ${this._renderDiagnostics()} ${this._renderExamplePicker()}
                  ${i.variables?e`<ha-alert alert-type="error">${i.variables}</ha-alert>`:e``}
                  <decluttering-declarations-editor
                    .hass=${this.hass}
                    .variables=${this._config.variables}
                    .shared=${At(this._savedLovelace)}
                    @value-changed=${this._declarationsChanged}
                  ></decluttering-declarations-editor>
                  <ha-form
                    .hass=${this.hass}
                    .data=${n}
                    .schema=${bl.defaultsSchema()}
                    .error=${i}
                    .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
                    .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
                    @value-changed=${this._defaultsChanged}
                  ></ha-form>
                  ${this._renderLint()} ${this._renderSuggest("card"===s.thingType)}
                </div>
              </ha-expansion-panel>
              <ha-expansion-panel outlined>
                <span slot="header">${a("template_editor.panel_tools",void 0,this.hass)}</span>
                <div class="panel">${this._renderPromote()} ${this._renderGroupOrder()} ${this._renderDeclutter()}</div>
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
    `}_renderDiagnostics(){if(!this._config||!kt(this._config.variables))return e``;const{unused:t,duplicated:i,contradictory:s}=jt(this._config);return e`
      ${t.length?e`<ha-alert alert-type="info">
              ${a(1===t.length?"template_editor.declared_unused_one":"template_editor.declared_unused_many",{names:t.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${i.length?e`<ha-alert alert-type="warning">
              ${a(1===i.length?"template_editor.duplicated_one":"template_editor.duplicated_many",{names:i.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${s.length?e`<ha-alert alert-type="warning">
              ${a(1===s.length?"template_editor.contradictory_one":"template_editor.contradictory_many",{names:s.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_renderExamplePicker(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=S(this._config);if(!i||!s.length)return e``;const n=St.get(i);return e`
      <ha-form
        .hass=${this.hass}
        .data=${{example:void 0===n||n>=s.length?"":String(n)}}
        .schema=${[{name:"example",selector:{select:{mode:"dropdown",options:[{value:"",label:a("template_editor.preview_defaults",void 0,this.hass)},...s.map((e,t)=>({value:String(t),label:a("template_editor.example_n",{number:t+1},this.hass)}))]}}}]}
        .computeLabel=${()=>a("template_editor.preview_example_label",void 0,this.hass)}
        @value-changed=${this._previewExamplePicked}
      ></ha-form>
    `}_previewExamplePicked(e){var t;e.stopPropagation();const i=null===(t=this._config)||void 0===t?void 0:t.template;if(!i)return;const s=e.detail.value.example;void 0===s||""===s?St.delete(i):St.set(i,Number(s)),window.dispatchEvent(new CustomEvent(Ot,{detail:{template:i}})),this.requestUpdate()}_renderLint(){if(!this._config)return e``;const t=this._savedLovelace,i=y(t,void 0,this._config)[this._config.template],s=bs(this._config,[...ys(i),...Object.keys(U(t))]);return s.length?e`${s.map(t=>e`<ha-alert alert-type=${t.level}>
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
              <ha-svg-icon class="handle" .path=${js}></ha-svg-icon>
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
    `}_renderGroupOrder(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.group,s=Ct(i);if(void 0===i||s.length<2)return e``;const n=s.map((e,t)=>{var i,s,a,n;const o=null!==(a=null!==(s=null!==(i=null==e?void 0:e.name)&&void 0!==i?i:null==e?void 0:e.heading)&&void 0!==s?s:null==e?void 0:e.title)&&void 0!==a?a:null==e?void 0:e.entity,r=String(null!==(n=null==e?void 0:e.type)&&void 0!==n?n:"?").replace(/^custom:/,"");return{label:"string"==typeof o?`${r} (${o})`:r,name:`${t+1} ${r}`}});return e`
      <div class="order">
        <p class="hint">${a("template_editor.group_order_hint",void 0,this.hass)}</p>
        ${this._renderSortable("group",n,(e,t)=>{const a=Et(s,e,t);a!==s&&this._config&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{group:Tt(i,a)}))})}
      </div>
    `}_renderPromote(){const t=rs(this._config);if(!this._config||!t)return e``;const i=function(e){const t=[],i=(e,s)=>{if(Array.isArray(e))e.forEach((e,t)=>i(e,[...s,t]));else if(e&&"object"==typeof e)for(const[t,a]of Object.entries(e))"type"===t&&"string"==typeof a||i(a,[...s,t]);else"string"==typeof e&&Ae.test(e)||s.length&&null!=e&&("string"!=typeof e&&"number"!=typeof e&&"boolean"!=typeof e||t.push({path:s,value:e,label:ls(s)}))};return i(e,[]),t}(this._config[t]);if(!i.length)return e``;const s=this._promotePath?JSON.stringify(this._promotePath):"",n=e=>{const t=String(e);return t.length>40?`${t.slice(0,39)}…`:t};return e`
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
                ${Ss({label:a("template_editor.promote_name",void 0,this.hass),value:this._promoteName,onInput:e=>{this._promoteName=e,this._promoteError=void 0}})}
                ${this._promoteError?e`<ha-alert alert-type="error">${this._promoteError}</ha-alert>`:e``}
                <ha-button .disabled=${!this._promoteName.trim()} @click=${this._promote}>
                  ${a("template_editor.promote_button",void 0,this.hass)}
                </ha-button>
              `:e``}
      </ha-expansion-panel>
    `}_promotePicked(e){e.stopPropagation();const t=e.detail.value.setting;t&&(this._promotePath=JSON.parse(t),this._promoteName=function(e,t){const i=[...e].reverse().find(e=>"string"==typeof e),s=e[e.length-1];return ts(("number"==typeof s?`${null!=i?i:"item"}_${s+1}`:null!=i?i:"value").replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value",t)}(this._promotePath,cs(this._config)),this._promoteError=void 0)}_promote(){if(!this._config||!this._promotePath)return;const e=this._promoteName.trim(),t=function(e,t,i){if(!ns.test(i))return{ok:!1,error:"name_invalid"};if(cs(e).includes(i))return{ok:!1,error:"name_taken"};const s=rs(e),a=s?function(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}(e[s],t):void 0;if(!s||null==a||"object"==typeof a)return{ok:!1,error:"gone"};const n={name:i,type:ds(a),default:a};return{ok:!0,template:Object.assign(Object.assign({},e),{[s]:hs(e[s],t,`[[${i}]]`),variables:Ie(e.variables,[n])})}}(this._config,this._promotePath,e);t.ok?(this._promotePath=void 0,this._promoteName="",this._fireConfigChanged(t.template)):this._promoteError=a(`template_editor.promote_${t.error}`,{name:e},this.hass)}_renderInUse(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._savedLovelace;if(!i||!s)return e``;const{views:n,templates:o}=ut(s,i),r=n.reduce((e,t)=>e+t.count,0)+o.length;return r?e`<ha-alert alert-type="info">
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
    `:e``}_suggest(){var e;if(!(null===(e=this._config)||void 0===e?void 0:e.card))return;if(this._suggestion){const e=Object.assign(Object.assign({},this._config),{card:this._suggestion.card});return e.variables=Ie(this._config.variables,this._suggestion.variables),this._suggestion=void 0,void this._fireConfigChanged(e)}this._suggestedNothing=!1;const t=$(this._config).map(e=>e.name),i=function(e,t){const i=new Set(t),s=[],a=new Map,n=(e,t)=>{const n=`${e.base} ${t}`,o=a.get(n);if(o)return o;let r=1,l=e.base;for(;i.has(l);)r+=1,l=`${e.base}_${r}`;return i.add(l),a.set(n,l),s.push({name:l,label:Oi(e,r),selector:e.selector,default:t}),l},o=e=>{if(Array.isArray(e))return e.map(o);if(!e||"object"!=typeof e)return e;const t={};for(const[i,s]of Object.entries(e)){const e=Object.prototype.hasOwnProperty.call(Si,i)?Si[i]:void 0;e&&"string"==typeof s&&!Ae.test(s)&&e.matches(s)?t[i]=`[[${n(e,s)}]]`:t[i]=o(s)}return t};return{card:o(e),variables:s}}(this._config.card,t);i.variables.length?this._suggestion=i:this._suggestedNothing=!0}_renderDeclutter(){var t,i;const s=this._savedLovelace,n=gt(s),o="card"===k(null!==(t=this._config)&&void 0!==t?t:{})?Pt(s):[];if(!n.length&&!o.length||!this._config)return e``;const r=this._config.template,l=!!r&&r in y(s),c=null!==(i=this._declutterOriginal)&&void 0!==i?i:this._declutterSection;return e`
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
        ${c?e`
                <ha-button .disabled=${this._busy||!l} @click=${this._declutterReplace}>
                  ${a(this._declutterPending?"template_editor.declutter_replace_confirm":this._declutterSection?"template_editor.declutter_replace_section":"template_editor.declutter_replace",void 0,this.hass)}
                </ha-button>
                ${l?e``:e`<p class="hint">${a("template_editor.declutter_save_first",void 0,this.hass)}</p>`}
              `:e``}
      </ha-expansion-panel>
    `}_declutterPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterOriginal=i.config,this._declutterSection=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{card:JSON.parse(JSON.stringify(i.config))});delete s.group,this._fireConfigChanged(s)}_declutterSectionPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterSection={view:i.view,section:i.section,cards:i.cards},this._declutterOriginal=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{group:{cards:JSON.parse(JSON.stringify(i.cards))}});delete s.card,this._fireConfigChanged(s)}async _declutterReplace(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.template,i=this._declutterOriginal,s=this._declutterSection;if(!t||!i&&!s)return;if(!this._declutterPending)return void(this._declutterPending=!0);const n={type:"custom:decluttering-card-plus",template:t};let o=!1;const r=await this._saveDashboard(e=>{if(i)return Q(e,i,n);const t=Nt(e,s.view,s.section,s.cards,[n]);return o=t===e,t},"declutter");r&&o&&(this._toolError=a("template_editor.declutter_section_changed",void 0,this.hass)),r&&(this._declutterPending=!1,this._declutterOriginal=void 0,this._declutterSection=void 0)}_selectTab(e){e.stopPropagation(),this._selectedTab=e.detail}_activateTab(e){const t=e.composedPath().find(e=>"ha-tab-group-tab"===e.localName),i=null==t?void 0:t.getAttribute("panel");i&&(this._selectedTab=i)}_describeChanged(e){if(!this._config)return;const t=e.detail.value,i=Object.assign(Object.assign({},this._config),{template:t.template});j(i,"description",t.description),j(i,"category",t.category);const s=void 0!==i.group&&"card"===t.thingType;s||delete i.group;for(const[a,n]of Object.entries($s))bl.stubMember(!s&&t.thingType===a,i,a,n);this._fireConfigChanged(i)}_declarationsChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);j(t,"variables",e.detail.value),this._fireConfigChanged(t)}_defaultsChanged(e){if(!this._config)return;const t=e.detail.value,i=Object.assign(Object.assign({},this._config),{default:t.default});void 0!==this._config.defaults&&(JSON.stringify(t.default)===JSON.stringify(je(this._config))?i.default=this._config.default:delete i.defaults),this._fireConfigChanged(i)}_cardChanged(e){if(e.stopPropagation(),!this._config)return;this._suggestion=void 0,this._suggestedNothing=!1;const t=Object.assign(Object.assign({},this._config),{card:e.detail.config});this._fireConfigChanged(t)}_cardPicked(e){this._selectedTab="card",this._cardChanged(e)}_rowChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign(Object.assign({},this._config),{row:e.detail.config});this._fireConfigChanged(t)}_fireConfigChanged(e){this._suggestion=void 0,this._suggestedNothing=!1,h(this,"config-changed",{config:e})}static stubMember(e,t,i,s){e?i in t||(t[i]=s):delete t[i]}static get styles(){return Cs}_saveDashboard(e,t,i){return Os(this,e,t,i)}async connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=g(()=>this.requestUpdate())),this._loadedElements||(await _(),await async function(){let e=customElements.get("hui-entities-card");if(!e){if(!Re)return;(await Re).createCardElement({type:"entities",entities:[]}),await customElements.whenDefined("hui-entities-card"),e=customElements.get("hui-entities-card")}e&&e.getConfigElement&&await e.getConfigElement()}(),this._loadedElements=!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}}o([l()],bl.prototype,"_config",void 0),o([l()],bl.prototype,"_selectedTab",void 0),o([l()],bl.prototype,"_suggestion",void 0),o([l()],bl.prototype,"_suggestedNothing",void 0),o([l()],bl.prototype,"_toolError",void 0),o([l()],bl.prototype,"_busy",void 0),o([l()],bl.prototype,"_declutterOriginal",void 0),o([l()],bl.prototype,"_declutterSection",void 0),o([l()],bl.prototype,"_declutterPending",void 0),o([l()],bl.prototype,"_promotePath",void 0),o([l()],bl.prototype,"_promoteName",void 0),o([l()],bl.prototype,"_promoteError",void 0),o([r()],bl.prototype,"lovelace",void 0),o([r()],bl.prototype,"hass",void 0);class $l extends c{connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=g(()=>this.requestUpdate()))}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}static get styles(){return d`
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
    `}render(){var t,i,s,n,o,r,l,c,d;const h=this.lovelace,u=xe(h);if(u&&(null===(t=this._borrowed)||void 0===t?void 0:t.ll)!==h){this._borrowed={ll:h};const e=new Set(Object.keys(y(h)));ke(this.hass,h).then(t=>{var i;(null===(i=this._borrowed)||void 0===i?void 0:i.ll)===h&&(this._borrowed={ll:h,names:Object.keys(t).filter(t=>!e.has(t)),templates:t})})}const p=u&&!(null===(i=this._borrowed)||void 0===i?void 0:i.names),m=It(h,u&&null!==(n=null===(s=this._borrowed)||void 0===s?void 0:s.names)&&void 0!==n?n:[]),f=p?Object.assign(Object.assign({},m),{missingTemplates:[]}):m,g=Lt(h),_=Ft(h),v=null===(o=this._borrowed)||void 0===o?void 0:o.names,b=this._examplesChecked;p||(null==b?void 0:b.ll)===h&&(null==b?void 0:b.borrowed)===v||(this._examplesChecked={ll:h,borrowed:v,failed:Mt(y(h),null!=v?v:[],this.hass)});const $=p?[]:null!==(l=null===(r=this._examplesChecked)||void 0===r?void 0:r.failed)&&void 0!==l?l:[],w=cl(h,null!==(d=null===(c=this._borrowed)||void 0===c?void 0:c.templates)&&void 0!==d?d:y(h)),x=!(f.missingTemplates.length||f.unsetVariables.length||f.unusedTemplates.length||g.length||_.length||$.length||w.length);return e`
      <ha-expansion-panel outlined>
        <span slot="header">${a("tools.health_header",void 0,this.hass)}</span>
        <slot></slot>
        ${x?e`<p class="hint">${a("tools.health_ok",void 0,this.hass)}</p>`:e`
                ${$.map(t=>e`<ha-alert alert-type="error">
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
                ${_.map(t=>{const i=[...t.views.map(e=>a("tools.health_view_uses",{view:e.title||a("template_editor.untitled_view",void 0,this.hass),count:e.count},this.hass)),...t.templates.map(e=>a("tools.health_template_uses",{name:e},this.hass))].join(", ");return e`<ha-alert alert-type="warning">
                    ${t.message?a("tools.health_deprecated_because",{template:t.template,message:t.message,uses:i},this.hass):a("tools.health_deprecated",{template:t.template,uses:i},this.hass)}
                  </ha-alert>`})}
                ${w.map(t=>e`<ha-alert alert-type="warning">
                      ${a("tools.health_unread",{template:t.template,name:t.name,count:t.count,view:t.view.title||t.view.path||a("template_editor.untitled_view",void 0,this.hass)},this.hass)}${"variables"===t.where?"":a(`tools.health_unread_${t.where}`,void 0,this.hass)}${t.closest?a("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${f.unusedTemplates.length?e`<ha-alert alert-type="info">
                        ${a("tools.health_unused",{names:f.unusedTemplates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
              `}
        ${this._renderTimings()}
      </ha-expansion-panel>
    `}_renderTimings(){const t=qt.entries(),i=e=>e.toFixed(1),s=e`<h4 class="timings-header">${a("tools.timings_header",void 0,this.hass)}</h4>`;if(!t.length)return e`${s}
        <p class="hint">${a("tools.timings_none",void 0,this.hass)}</p>`;const{byTotal:n,byMax:o,repeats:r}=Dt(t);return e`
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
    `}}o([r({attribute:!1})],$l.prototype,"hass",void 0),o([r({attribute:!1})],$l.prototype,"lovelace",void 0),o([l()],$l.prototype,"_borrowed",void 0),Vt(Rt,xi),Vt(zt,bl),Vt(Ht,$l);export{xi as DeclutteringCardEditor,$l as DeclutteringHealthPanel,bl as DeclutteringTemplateEditor};
//# sourceMappingURL=decluttering-card-plus.editors-DzMNhgNT.js.map
