import{b as e,O as t,r as i,a as s,l as n,_ as a,n as o,c as r,i as l,d as c,f as h,e as d,g as u,h as p,o as m,j as f,k as g,m as _,t as v,p as y,q as b,s as $,u as w,v as x,w as k,x as S,y as j,z as A,A as C,B as O,C as E,D as T,E as N,F as P,G as I,H as F,I as L,J as M,K as D,L as V,M as R,N as z,P as q,Q as H,R as U,S as K,T as W,U as J,W as B,X as Y,Y as G,Z,$ as Q,a0 as X,a1 as ee,a2 as te,a3 as ie,a4 as se,a5 as ne,a6 as ae,a7 as oe,a8 as re,a9 as le,aa as ce,ab as he,ac as de,ad as ue,ae as pe,af as me,ag as fe,ah as ge,ai as _e,aj as ve,ak as ye,al as be,am as $e,an as we,ao as xe,ap as ke,aq as Se,ar as je,as as Ae,at as Ce,au as Oe,av as Ee,aw as Te,ax as Ne,ay as Pe,az as Ie,aA as Fe,aB as Le,aC as Me,aD as De,aE as Ve,aF as Re,aG as ze,aH as qe,aI as He,aJ as Ue,aK as Ke,aL as We,aM as Je,aN as Be,V as Ye,aO as Ge,aP as Ze,aQ as Qe,aR as Xe,aS as et,aT as tt,aU as it,aV as st,aW as nt,aX as at,aY as ot,aZ as rt,a_ as lt,a$ as ct,b0 as ht,b1 as dt,b2 as ut,b3 as pt,b4 as mt,b5 as ft,b6 as gt,b7 as _t,b8 as vt,b9 as yt,ba as bt,bb as $t,bc as wt,bd as xt,be as kt,bf as St,bg as jt,bh as At,bi as Ct,bj as Ot,bk as Et,bl as Tt,bm as Nt,bn as Pt,bo as It}from"./decluttering-card-plus.core-HSawWJ4Z.js";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ft=Symbol.for(""),Lt=e=>{if(e?.r===Ft)return e?._$litStatic$},Mt=e=>({_$litStatic$:e,r:Ft}),Dt=new Map,Vt=(Rt=e,(e,...t)=>{const i=t.length;let s,n;const a=[],o=[];let r,l=0,c=!1;for(;l<i;){for(r=e[l];l<i&&void 0!==(n=t[l],s=Lt(n));)r+=s+e[++l],c=!0;l!==i&&o.push(n),a.push(r),l++}if(l===i&&a.push(e[i]),c){const i=a.join("$$lit$$");void 0===(e=Dt.get(i))&&(a.raw=a,Dt.set(i,e=a)),t=o}return Rt(e,...t)});var Rt;function zt(e){return"number"==typeof e&&Number.isFinite(e)?String(e):"string"==typeof e&&e.trim()?e.trim():void 0}function qt(e){if("number"==typeof e)return e;if("string"!=typeof e||!e.trim())return;const t=e.trim(),i=Number(t);return Number.isFinite(i)&&/^\d+$/.test(t)?i:t}function Ht(e){return e===s?"hide":e&&"object"==typeof e&&!Array.isArray(e)?"card":"show"}function Ut(e){const s={on_error_mode:Ht(e[t]),debug:(n=e.debug,!0===n?"json":"yaml"===n||"console"===n||"report"===n?n:"off")};var n;const a=e.grid_options,o=zt(null==a?void 0:a.columns),r=zt(null==a?void 0:a.rows);void 0!==o&&(s.grid_columns=o),void 0!==r&&(s.grid_rows=r),"string"==typeof e.style&&e.style&&(s.style=e.style),!0===e.strict&&(s.strict=!0);const l=i(e.rebuild_on);return l.length&&(s.rebuild_on=l),"string"==typeof e.name&&e.name&&(s.name=e.name),!0===e.inherit_variables&&(s.inherit_variables=!0),s}function Kt(e,n){var a;const o=Object.assign({},e),r=Object.assign({},null!==(a=e.grid_options)&&void 0!==a?a:{}),l=qt(n.grid_columns),c=qt(n.grid_rows);void 0===l?delete r.columns:r.columns=l,void 0===c?delete r.rows:r.rows=c,Object.keys(r).length?o.grid_options=r:delete o.grid_options;const h="string"==typeof n.style?n.style:"";switch(h.trim()?o.style=h:delete o.style,n.on_error_mode){case"hide":o[t]=s;break;case"card":"card"!==Ht(e[t])&&delete o[t];break;default:delete o[t]}!0===n.strict?o.strict=!0:delete o.strict;const d=i(n.rebuild_on);switch(d.length?o.rebuild_on=d:delete o.rebuild_on,n.debug){case"json":o.debug=!0;break;case"yaml":case"console":case"report":o.debug=n.debug;break;default:delete o.debug}const u="string"==typeof n.name?n.name.trim():"";return u?o.name=u:delete o.name,!0===n.inherit_variables?o.inherit_variables=!0:delete o.inherit_variables,o}function Wt(e){const i=e[t];return i&&"object"==typeof i&&!Array.isArray(i)?i:void 0}function Jt(e,i){const s=Object.assign({},e);return i&&"object"==typeof i?s[t]=i:delete s[t],s}const Bt=["1","2","3","4","5","6","7","8","9","10","11","12","full"],Yt=["1","2","3","4","5","6","7","8","auto"];const Gt="decluttering-card-plus-card-slot";class Zt extends l{constructor(){super(...arguments),this.label="",this.emptyHint="",this._picking=!1,this._editing=!1}static get styles(){return c`
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
    `}render(){const t=function(e){var t,i,s,a;if(!e||"object"!=typeof e||Array.isArray(e))return;const o=e,r="string"==typeof o.type?o.type:"",l=r.startsWith("custom:")?r.slice(7):r?r[0].toUpperCase()+r.slice(1):"",c=e=>"string"==typeof e&&e.trim()?e.split("\n")[0].trim():void 0,h=Array.isArray(o.cards)?o.cards.length:void 0;return{type:l,text:null!==(a=null!==(s=null!==(i=null!==(t=c(o.content))&&void 0!==t?t:c(o.title))&&void 0!==i?i:c(o.name))&&void 0!==s?s:c(o.entity))&&void 0!==a?a:void 0!==h?n("editor.slot.cards",{count:h}):""}}(this.value);return e`
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
    `}_togglePick(){this._picking=!this._picking}_toggleEdit(){this._editing=!this._editing}_picked(e){var t;e.stopPropagation(),this._picking=!1,this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_edited(e){var t;e.stopPropagation(),this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_set(e){this._editing=this._editing&&!!e,h(this,"value-changed",{value:e&&"object"==typeof e?e:void 0})}}a([o({attribute:!1})],Zt.prototype,"hass",void 0),a([o({attribute:!1})],Zt.prototype,"lovelace",void 0),a([o({attribute:!1})],Zt.prototype,"value",void 0),a([o()],Zt.prototype,"label",void 0),a([o()],Zt.prototype,"emptyHint",void 0),a([r()],Zt.prototype,"_picking",void 0),a([r()],Zt.prototype,"_editing",void 0),"undefined"==typeof customElements||customElements.get(Gt)||customElements.define(Gt,Zt);const Qt="variable:";function Xt(e,t,i){var s;const a=e&&"object"==typeof e?e:{},o=null!==(s=["areas","devices","floors","labels","views","entities"].find(e=>void 0!==a[e]))&&void 0!==s?s:"items";return n(`editor.matches_${o}_${1===t?"one":"many"}`,void 0,i)}let ei,ti;function ii(){return null!=ti||(ti=[{name:"fit",label:n("editor.fit_label"),helper:n("editor.fit_helper"),selector:{select:{mode:"dropdown",options:[{value:"box",label:n("editor.fit_box")},{value:"contents",label:n("editor.fit_contents")}]}}}]),ti}function si(e,t){const i=e.indexOf(t);return-1===i?[e,""]:[e.slice(0,i),e.slice(i+t.length)]}const ni=new Set(["true","yes","on","1"]),ai=/:host|\.decluttering-container/;class oi extends l{constructor(){super(...arguments),this._shownAs=new Map,this._loadingTemplates=!1,this._ejectPending=!1,this._sectionsPending=!1,this._renderedTemplates={},this._renderingTemplates=new Set}static get styles(){return c`
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
    `}set lovelace(e){this._lovelace=e,this._templates=void 0,this._schema=void 0}_editingPlace(){const e=d(this),t=e?u(e):void 0;return null!=t?t:{view:p(this._lovelace)}}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}async connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=m(()=>this.requestUpdate())),await f()}setConfig(e){var t;null!==(t=this._openedWith)&&void 0!==t||(this._openedWith=e),this._config=e}willUpdate(){var e;if(this.hass&&this._config&&(this._lovelace||(this._lovelace=null!==(e=g())&&void 0!==e?e:void 0),this._lovelace)){if(!this._templates){const e=this._editingPlace();this._templates=_(this._lovelace,e.view,void 0,e.section),this._loadBorrowedTemplates()}this._schema||(this._schema=[{name:"template",label:n("editor.template_label",void 0,this.hass),selector:{select:{mode:"dropdown",custom_value:!0,options:v(this._templates,this.hass)}}},{name:"variables",label:n("editor.variables_label",void 0,this.hass),helper:n("editor.variables_helper",void 0,this.hass),selector:{object:{}}}])}}render(){if(!(this.hass&&this._config&&this._templates&&this._schema))return e``;const t=this._templates[this._config.template],i=y(t),s=b(this._config.variables),a=$(this._config),o=!!t&&"card"===w(t)||!!a||void 0!==this._config.for_each||void 0!==this._config.for_each_from,r={};t||this._loadingTemplates||a&&!this._config.template||(r.template=n("editor.no_such_template",void 0,this.hass)),s||(r.variables=n("error.variables_shape",void 0,this.hass));const l=x(t);return e`
      ${(null==t?void 0:t.description)?e`<p class="description">${t.description}</p>`:e``}
      ${a?e`<ha-alert alert-type="info">
              ${n("editor.by_domain_hint",{templates:Object.entries(a).map(([e,t])=>`${e}: ${t}`).join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${void 0===l?e``:e`<ha-alert alert-type="warning">
              ${l?n("editor.template_deprecated_because",{message:l},this.hass):n("editor.template_deprecated",void 0,this.hass)}
            </ha-alert>`}
      ${this._renderSource(t)} ${this._renderStartFromExample(t)}
      ${this._renderDiagnostics(t,s)} ${this._renderMatches(t)}
      <ha-form
        .hass=${this.hass}
        .data=${this._formData(i)}
        .schema=${this._formSchema(i,o)}
        .error=${r}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._renderCardVariables(i)} ${this._renderEmptySlot(o)} ${this._renderAdvanced()}
      ${this._renderResult(t)} ${this._renderSectionPerCopy()}
      <decluttering-card-plus-health .hass=${this.hass} .lovelace=${this._lovelace}></decluttering-card-plus-health>
    `}_renderAdvanced(){if(!this._config)return e``;const t=function(e){const t=Ut(e);let i=0;return void 0===t.grid_columns&&void 0===t.grid_rows||(i+=1),void 0!==t.style&&(i+=1),"show"!==t.on_error_mode&&(i+=1),t.strict&&(i+=1),t.rebuild_on&&(i+=1),"off"!==t.debug&&(i+=1),void 0!==t.name&&(i+=1),t.inherit_variables&&(i+=1),i}(this._config),i=Ut(this._config),s=this._onErrorMode&&"card"!==i.on_error_mode?Object.assign(Object.assign({},i),{on_error_mode:this._onErrorMode}):i;"card"===i.on_error_mode&&this._onErrorMode&&(this._onErrorMode=void 0);const a=Wt(this._config),o=Mt(Gt);return e`
      <ha-expansion-panel outlined class="advanced">
        <span slot="header">
          ${n("editor.advanced.header",void 0,this.hass)}
          <span class="count">
            ${0===t?"":1===t?n("editor.advanced.count_one",void 0,this.hass):n("editor.advanced.count_many",{count:t},this.hass)}
          </span>
        </span>
        <div class="advanced-body">
          <ha-form
            .hass=${this.hass}
            .data=${s}
            .schema=${function(e){const t=t=>n(t,void 0,e),i=(e,i)=>e.map(e=>({value:e,label:/^\d+$/.test(e)?e:t(`${i}${e}`)}));return[{name:"grid_columns",label:t("editor.advanced.grid_columns_label"),helper:t("editor.advanced.grid_helper"),selector:{select:{mode:"dropdown",custom_value:!0,options:i(Bt,"editor.advanced.grid_")}}},{name:"grid_rows",label:t("editor.advanced.grid_rows_label"),selector:{select:{mode:"dropdown",custom_value:!0,options:i(Yt,"editor.advanced.grid_")}}},{name:"style",label:t("editor.advanced.style_label"),helper:t("editor.advanced.style_helper"),selector:{text:{multiline:!0}}},{name:"on_error_mode",label:t("editor.advanced.on_error_label"),helper:t("editor.advanced.on_error_helper"),selector:{select:{mode:"dropdown",options:[{value:"show",label:t("editor.advanced.on_error_show")},{value:"hide",label:t("editor.advanced.on_error_hide")},{value:"card",label:t("editor.advanced.on_error_card")}]}}},{name:"strict",label:t("editor.advanced.strict_label"),helper:t("editor.advanced.strict_helper"),selector:{boolean:{}}},{name:"rebuild_on",label:t("editor.advanced.rebuild_on_label"),helper:t("editor.advanced.rebuild_on_helper"),selector:{entity:{multiple:!0}}},{name:"debug",label:t("editor.advanced.debug_label"),helper:t("editor.advanced.debug_helper"),selector:{select:{mode:"dropdown",options:[{value:"off",label:t("editor.advanced.debug_off")},{value:"json",label:t("editor.advanced.debug_json")},{value:"yaml",label:t("editor.advanced.debug_yaml")},{value:"console",label:t("editor.advanced.debug_console")},{value:"report",label:t("editor.advanced.debug_report")}]}}},{name:"name",label:t("editor.advanced.name_label"),helper:t("editor.advanced.name_helper"),selector:{text:{}}},{name:"inherit_variables",label:t("editor.advanced.inherit_label"),helper:t("editor.advanced.inherit_helper"),selector:{boolean:{}}}]}(this.hass)}
            .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
            .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
            @value-changed=${this._advancedChanged}
          ></ha-form>
          ${"card"===s.on_error_mode?Vt`<${o}
                  .hass=${this.hass}
                  .lovelace=${this._lovelace}
                  .value=${a}
                  .label=${n("editor.advanced.fallback_label",void 0,this.hass)}
                  .emptyHint=${n("editor.advanced.fallback_hint",void 0,this.hass)}
                  @value-changed=${this._fallbackChanged}
                ></${o}>`:e``}
        </div>
      </ha-expansion-panel>
    `}_advancedChanged(e){if(e.stopPropagation(),!this._config)return;const t=e.detail.value;this._onErrorMode="card"!==t.on_error_mode||Wt(this._config)?void 0:"card",h(this,"config-changed",{config:Kt(this._config,t)})}_fallbackChanged(e){e.stopPropagation(),this._config&&(e.detail.value&&(this._onErrorMode=void 0),h(this,"config-changed",{config:Jt(this._config,e.detail.value)}))}_renderEmptySlot(t){if(!this._config||!t)return e``;if(!(void 0!==this._config.for_each||void 0!==this._config.for_each_from||void 0!==this._config.empty))return e``;const i=Mt(Gt),s=this._config.empty;return Vt`<${i}
      .hass=${this.hass}
      .lovelace=${this._lovelace}
      .value=${s&&"object"==typeof s?s:void 0}
      .label=${n("editor.empty_label",void 0,this.hass)}
      .emptyHint=${n("editor.empty_slot_hint",void 0,this.hass)}
      @value-changed=${this._emptyChanged}
    ></${i}>`}_emptyChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);k(t,"empty",e.detail.value),h(this,"config-changed",{config:t})}_renderStartFromExample(t){const i=S(t);return i.length&&this._config&&!j(this._config.variables).length?e`
      <div class="examples">
        <p class="hint">${n("editor.start_from_example_hint",void 0,this.hass)}</p>
        ${i.map((t,i)=>e`
            <ha-button @click=${()=>this._startFromExample(t)}>
              ${n("editor.start_from_example",{number:i+1},this.hass)}
            </ha-button>
          `)}
      </div>
    `:e``}_startFromExample(e){e.length&&h(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{variables:e})})}_renderCardVariables(t){var i;const s=t.filter(e=>A(e));if(!s.length)return e``;const a=C(null===(i=this._config)||void 0===i?void 0:i.variables);return e`${s.map(t=>{var i;const s=a[t.name],o=!!s&&"object"==typeof s;return e`
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
      `})}`}_cardVariableChanged(e,t){var i,s;null==t||t.stopPropagation();const n=null===(i=null==t?void 0:t.detail)||void 0===i?void 0:i.config,a=j(null===(s=this._config)||void 0===s?void 0:s.variables).filter(t=>O(t)!==e);n&&"object"==typeof n&&a.push({[e]:n});const o=Object.assign({},this._config);a.length?o.variables=a:delete o.variables,h(this,"config-changed",{config:o})}_renderResult(t){var s;if(!this._config)return e``;const a=E(this._config.for_each);let o=(null==a?void 0:a.length)?T(a[0],this._config.variables,0,a.length):this._config.variables,r=t,l=this._config.template;if($(this._config))try{const e=null!==(s=this._templates)&&void 0!==s?s:{};let t;({template:r,name:l,entity:t}=N(this._config,o,t=>e[t],this.hass,Object.keys(e))),o=P(o,t)}catch(f){return e``}if(!r)return e``;const c=w(r);if(!c)return e``;const h=I(r);let d;try{const e=F(this.hass,i(this._config.rebuild_on));d=L(M(o,r,h,l,e,!0),this._config,c)}catch(g){return e`<ha-alert alert-type="warning">
        ${n("editor.result_error",{error:String(g)},this.hass)}
      </ha-alert>`}const u=(null==a?void 0:a.length)?n("editor.result_copies",{total:a.length},this.hass):"",[p,m]=si(n("editor.result_hint",{kind:c},this.hass),"[[name]]");return e`
      <ha-expansion-panel outlined>
        <span slot="header">${n("editor.result_header",void 0,this.hass)}${u}</span>
        <div class="result">
          <p class="hint">${p}<code>[[name]]</code>${m}</p>
          <ha-yaml-editor .hass=${this.hass} .defaultValue=${d} read-only></ha-yaml-editor>
          ${(null==a?void 0:a.length)||D(this._config.for_each_from)||!d||"object"!=typeof d?e``:e`
                  <ha-button @click=${()=>this._eject(d)}>
                    ${n(this._ejectPending?"editor.eject_confirm":"editor.eject",void 0,this.hass)}
                  </ha-button>
                `}
        </div>
      </ha-expansion-panel>
    `}_renderSectionPerCopy(){var t;const i=null===(t=V())||void 0===t?void 0:t.config;return this._config&&i&&R(i,this._config)?e`
      <div class="section-per-copy">
        <p class="hint">${n("editor.section_per_copy_hint",void 0,this.hass)}</p>
        ${this._sectionsError?e`<ha-alert alert-type="error">${this._sectionsError}</ha-alert>`:e``}
        <ha-button @click=${this._sectionPerCopy}>
          ${n(this._sectionsPending?"editor.section_per_copy_confirm":"editor.section_per_copy",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}async _sectionPerCopy(){var e,t;if(!this._sectionsPending)return void(this._sectionsPending=!0);this._sectionsPending=!1;const i=V(),s=this._config;if(!i||!s)return;try{await z(this,this.hass,"section_per_copy",[{urlPath:H(),build:e=>q(e,s)}])}catch(o){return void(this._sectionsError=n("tools.save_failed",{message:null!==(e=null==o?void 0:o.message)&&void 0!==e?e:o},this.hass))}let a=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;for(;a&&"hui-dialog-edit-card"!==a.localName;)a=a.parentNode instanceof ShadowRoot?a.parentNode.host:a.parentNode;null===(t=null==a?void 0:a.closeDialog)||void 0===t||t.call(a)}_eject(e){this._ejectPending?(this._ejectPending=!1,this._holdEjectUndo(e),h(this,"config-changed",{config:e})):this._ejectPending=!0}_holdEjectUndo(e){const t=V();if(!t||!this._openedWith)return;const i=U(t.config,this._openedWith,e);i!==t.config&&K({operation:"eject",at:Date.now(),dashboards:[{urlPath:H(),before:t.config,after:i}]})}_renderSource(t){var i;const s=null===(i=this._config)||void 0===i?void 0:i.template;if(!s||!t||this._loadingTemplates)return e``;const a=W(this._lovelace,s);if(!a)return e`<p class="hint">${n("editor.source_borrowed",void 0,this.hass)}</p>`;if(a.declared||!a.view)return e`<p class="hint">${n("editor.source_declared",void 0,this.hass)}</p>`;const{view:o}=a,r=document.location.pathname.split("/").slice(0,2).join("/"),[l,c]=si(n("editor.source_view",{view:""},this.hass),"");return e`<p class="hint">
      ${l}<a href=${`${r}/${o.path||o.index}`} target="_blank" rel="noreferrer"
        >${o.title||o.path||n("editor.untitled_view",void 0,this.hass)}</a
      >${c}
    </p>`}_filledSource(e){var t,i;return J(null===(t=this._config)||void 0===t?void 0:t.for_each_from,null===(i=this._config)||void 0===i?void 0:i.variables,e,this.hass)}_renderedTemplateNames(e){const t=this._filledSource(e),i=B(t);if(!this.hass||void 0===i)return[];if(!Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))return[];const s=new Set,n=Y(this.hass,t,{rendered:this._renderedTemplates});for(const a of n)for(const e of Object.keys(a))s.add(e);return[...s]}_renderEditorTemplate(e){this.hass&&!this._renderingTemplates.has(e)&&(this._renderingTemplates.add(e),G(this.hass,e).then(t=>{this._renderingTemplates.delete(e),this._renderedTemplates=Object.assign(Object.assign({},this._renderedTemplates),{[e]:t})}))}_renderMatches(t){var i,s;if(!this.hass||!D(null===(i=this._config)||void 0===i?void 0:i.for_each_from))return e``;const a=this._filledSource(t);Z(a)&&!Q()&&X(this.hass).then(()=>this.requestUpdate());const o=B(a);if(void 0!==o){const t=Object.prototype.hasOwnProperty.call(this._renderedTemplates,o)?this._renderedTemplates[o]:void 0;if(!t)return this._renderEditorTemplate(o),e`<p class="hint">${n("editor.matches_template_pending",void 0,this.hass)}</p>`;const i=ee(t);if(!("list"in i)){const t="error"===i.problem?"editor.matches_template_failed":"editor.matches_template_not_list";return e`<ha-alert alert-type="warning"> ${n(t,{detail:i.detail},this.hass)} </ha-alert>`}}let r=[];try{r=Y(this.hass,a,Object.assign(Object.assign({},te(this._lovelace)),{rendered:this._renderedTemplates}))}catch(c){return e``}if(!r.length)return e`<ha-alert alert-type="warning">
        ${n("editor.matches_none",{but:(null===(s=this._config)||void 0===s?void 0:s.empty)?n("editor.matches_none_but_empty",void 0,this.hass):""},this.hass)}
      </ha-alert>`;const l=r.slice(0,12);return e`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${1===r.length?n("editor.matches_header_one",{what:Xt(a,1,this.hass)},this.hass):n("editor.matches_header_many",{count:r.length,what:Xt(a,r.length,this.hass)},this.hass)}
        </span>
        <div class="matches">
          <ul>
            ${l.map((t,i)=>e`<li>${ie(t,i)}</li>`)}
          </ul>
          ${r.length>l.length?e`<p class="hint">
                  ${n("editor.matches_more",{count:r.length-l.length},this.hass)}
                </p>`:e``}
          <p class="hint">
            ${n(void 0===o?"editor.matches_hint":"editor.matches_template_hint",void 0,this.hass)}
          </p>
        </div>
      </ha-expansion-panel>
    `}_formSchema(e,t){const i=t?(null!=ei||(ei=[{name:"for_each",label:n("editor.for_each_label"),helper:n("editor.for_each_helper"),selector:{object:{}}},{name:"for_each_from",label:n("editor.for_each_from_label"),helper:n("editor.for_each_from_helper"),selector:{object:{}}},{name:"gap",label:n("editor.gap_label"),helper:n("editor.gap_helper"),selector:{number:{min:0,max:64,mode:"box"}}},{name:"columns",label:n("editor.columns_label"),helper:n("editor.columns_helper"),selector:{number:{min:1,max:6,mode:"box"}}},{name:"min_column_width",label:n("editor.min_column_width_label"),helper:n("editor.min_column_width_helper"),selector:{number:{min:50,max:1e3,step:10,mode:"box"}}},{name:"lazy",label:n("editor.lazy_label"),helper:n("editor.lazy_helper"),selector:{boolean:{}}},{name:"lazy_eager",label:n("editor.lazy_eager_label"),helper:n("editor.lazy_eager_helper"),selector:{number:{min:0,max:100,mode:"box"}}}]),ei):[];if(!e.length)return[...this._schema,...i,...ii()];const s=e=>{var t;return{name:Qt+e.name,label:null!==(t=e.label)&&void 0!==t?t:e.name,helper:e.description,selector:ne(e),required:!0===e.required}},a=[];for(const n of se(e.filter(e=>!A(e))))void 0===n.group?a.push(...n.declarations.map(s)):a.push({name:"",type:"expandable",title:n.group,schema:n.declarations.map(s)});return[this._schema[0],...a,{name:"extras",label:n("editor.extras_label",void 0,this.hass),helper:n("editor.extras_helper",void 0,this.hass),selector:{object:{}}},...i,...ii()]}_formData(e){var t,i,s,n,a,o,r,l,c,h,d;if(!e.length)return this._config;const u=C(null===(t=this._config)||void 0===t?void 0:t.variables),p=new Set(e.map(e=>e.name)),m={template:null===(i=this._config)||void 0===i?void 0:i.template};this._shownAs=new Map;for(const g of e){if(!(g.name in u))continue;const e=u[g.name];if("boolean"!=typeof e&&"boolean"in ne(g)){const t=ni.has(String(e).trim().toLowerCase());this._shownAs.set(g.name,{shown:t,written:e}),m[Qt+g.name]=t}else m[Qt+g.name]=e}const f=j(null===(s=this._config)||void 0===s?void 0:s.variables).filter(e=>{const t=O(e);return void 0!==t&&!p.has(t)});return f.length&&(m.extras=f),void 0!==(null===(n=this._config)||void 0===n?void 0:n.for_each)&&(m.for_each=this._config.for_each),void 0!==(null===(a=this._config)||void 0===a?void 0:a.for_each_from)&&(m.for_each_from=this._config.for_each_from),void 0!==(null===(o=this._config)||void 0===o?void 0:o.columns)&&(m.columns=this._config.columns),void 0!==(null===(r=this._config)||void 0===r?void 0:r.min_column_width)&&(m.min_column_width=this._config.min_column_width),void 0!==(null===(l=this._config)||void 0===l?void 0:l.gap)&&(m.gap=this._config.gap),void 0!==(null===(c=this._config)||void 0===c?void 0:c.fit)&&(m.fit=this._config.fit),void 0!==(null===(h=this._config)||void 0===h?void 0:h.lazy)&&(m.lazy=this._config.lazy),void 0!==(null===(d=this._config)||void 0===d?void 0:d.lazy_eager)&&(m.lazy_eager=this._config.lazy_eager),m}_renderDiagnostics(t,s){var a,o,r,l,c,h,d,u,p,m,f,_,v,y,b,x,k,S,j;if(!t||this._loadingTemplates||!s||$(this._config))return e``;const A=[...oe(null===(a=this._config)||void 0===a?void 0:a.for_each),...re(null===(o=this._config)||void 0===o?void 0:o.for_each_from),...D(null===(r=this._config)||void 0===r?void 0:r.for_each_from)?ae:[],...this._renderedTemplateNames(t),...i(null===(l=this._config)||void 0===l?void 0:l.rebuild_on),...le(t,ce(null===(c=this._config)||void 0===c?void 0:c.variables)),...Object.keys(he(null!==(h=this._lovelace)&&void 0!==h?h:g()))].map(e=>({[e]:null})),{missing:C,unused:O,required:E}=de(null===(d=this._config)||void 0===d?void 0:d.variables,t,A,[null===(u=this._config)||void 0===u?void 0:u.for_each_from,null===(p=this._config)||void 0===p?void 0:p.on_error],ue(t,he(null!==(m=this._lovelace)&&void 0!==m?m:g()))),T=pe(null===(f=this._config)||void 0===f?void 0:f.variables,t,this.hass),N=C.filter(e=>!E.includes(e)),P=ai.test(`${null!==(_=t.style)&&void 0!==_?_:""}\n${null!==(y=null===(v=this._config)||void 0===v?void 0:v.style)&&void 0!==y?y:""}`),I="contents"===(null===(b=this._config)||void 0===b?void 0:b.fit)&&P,F=Number(null===(x=this._config)||void 0===x?void 0:x.columns),L=(void 0!==(null===(k=this._config)||void 0===k?void 0:k.for_each)||void 0!==(null===(S=this._config)||void 0===S?void 0:S.for_each_from))&&F>1&&!(Number(null===(j=this._config)||void 0===j?void 0:j.min_column_width)>0),M=w(t),V=me(this._config,M);return e`
      ${V.map(t=>{var i,s;return e`<ha-alert alert-type="warning">
            ${n("editor.override_misplaced",{key:t,kind:M,template:null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""},this.hass)}
          </ha-alert>`})}
      ${L?e`<ha-alert alert-type="info">
              ${n("editor.columns_without_min_width",{columns:F},this.hass)}
            </ha-alert>`:e``}
      ${I?e`<ha-alert alert-type="warning">${n("editor.fit_hides_style",void 0,this.hass)}</ha-alert>`:e``}
      ${E.length?e`<ha-alert alert-type="error">
              ${n(1===E.length?"editor.required_one":"editor.required_many",{names:E.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${N.length?e`<ha-alert alert-type="warning">
              ${n(1===N.length?"editor.optional_one":"editor.optional_many",{names:N.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${T.map(t=>e`<ha-alert alert-type="warning">
            ${n("editor.invalid_value",{name:t.name,expected:t.expected},this.hass)}
          </ha-alert>`)}
      ${O.length?e`<ha-alert alert-type="info">
              ${n(1===O.length?"editor.unused_one":"editor.unused_many",{names:O.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_valueChanged(e){var t,i;const s=e.detail.value,n=y(null===(t=this._templates)||void 0===t?void 0:t[s.template]);if(!n.length)return void h(this,"config-changed",{config:s});const a=[];for(const l of n){let e=s[Qt+l.name];const t=this._shownAs.get(l.name);t&&e===t.shown&&(e=t.written),void 0!==e&&""!==e&&a.push({[l.name]:e})}Array.isArray(s.extras)&&a.push(...s.extras);const o=Object.assign(Object.assign({},this._config),{template:s.template}),r=fe(j(null===(i=this._config)||void 0===i?void 0:i.variables),a);r.length?o.variables=r:delete o.variables,k(o,"for_each",s.for_each),k(o,"for_each_from",s.for_each_from),k(o,"columns",s.columns),k(o,"min_column_width",s.min_column_width),k(o,"gap",s.gap),k(o,"lazy",!0===s.lazy||void 0),k(o,"lazy_eager",s.lazy_eager),h(this,"config-changed",{config:o})}_loadBorrowedTemplates(){if(!ge(this._lovelace))return;this._loadingTemplates=!0;const e=this._editingPlace();_e(this.hass,this._lovelace,e.view,void 0,e.section).then(e=>{this._templates=e,this._schema=void 0}).finally(()=>{this._loadingTemplates=!1,this.requestUpdate()})}}a([r()],oi.prototype,"_lovelace",void 0),a([r()],oi.prototype,"_config",void 0),a([o()],oi.prototype,"hass",void 0),a([r()],oi.prototype,"_loadingTemplates",void 0),a([r()],oi.prototype,"_ejectPending",void 0),a([r()],oi.prototype,"_sectionsPending",void 0),a([r()],oi.prototype,"_sectionsError",void 0),a([r()],oi.prototype,"_onErrorMode",void 0),a([r()],oi.prototype,"_renderedTemplates",void 0);const ri=/^[a-z_]+\.[a-z0-9_]+$/,li={base:"entity",label:"Entity",selector:{entity:{}},matches:e=>ri.test(e)};function ci(e,t){return{base:e,label:t,selector:{text:{}},matches:e=>e.trim().length>0}}const hi={entity:li,entity_id:li,name:ci("name","Name"),title:ci("title","Title"),heading:ci("heading","Heading"),icon:{base:"icon",label:"Icon",selector:{icon:{}},matches:e=>e.includes(":")}};function di(e,t){return 1===t?e.label:`${e.label} ${t}`}const ui=[we,xe,...ke],pi=["card","badge","row","element","group"],mi=["type","template","description","variables","default",...pi,"style"];function fi(e,t){if(Array.isArray(e))for(const i of e)fi(i,t);else if(e&&"object"==typeof e){t(e);for(const i of Object.values(e))fi(i,t)}}function gi(e){const t=new Set,i=new Set;fi(e,e=>{const s=e.type;if("string"==typeof s){s.startsWith("custom:")&&!ui.includes(s)&&t.add(s);for(const t of Se(e))i.add(t)}});for(const s of $e(e))i.add(s);return{customTypes:[...t].sort(),templateRefs:[...i].sort()}}function _i(e,t){const i=e&&"object"==typeof e&&void 0!==e[ye]?Object.assign(Object.assign({},e),{default:be(e)}):e,s={};for(const n of mi)void 0!==(null==i?void 0:i[n])&&(s[n]=i[n]);for(const n of Object.keys(null!=i?i:{}))n in s||n===ye||"source"===n||(s[n]=i[n]);const{customTypes:a,templateRefs:o}=gi(e),r=[];if(t){const e={},i=[...o];for(;i.length;){const s=i.shift();if(s in e)continue;const n=t[s];n?(e[s]=vi(n),i.push(...gi(n).templateRefs)):r.push(s)}Object.keys(e).length&&(s.includes=e)}else r.push(...o);const l=[];return a.length&&l.push(n("share.requires_custom_cards",{types:a.join(", ")})),r.length&&l.push(n("share.uses_other_templates",{names:r.join(", ")})),{payload:s,notes:l}}function vi(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);return delete t.source,t}function yi(e,t){if(!t.includes(e))return e;let i=2;for(;t.includes(`${e}_${i}`);)i+=1;return`${e}_${i}`}function bi(e){if(!e||"object"!=typeof e||Array.isArray(e))return{ok:!1,errors:[n("share.import_not_a_template")]};const t=[];"string"==typeof e.template&&e.template.trim()||t.push(n("share.import_no_name"));const i=pi.filter(t=>void 0!==e[t]);return 0===i.length?t.push(n("share.import_defines_nothing")):i.length>1&&t.push(n("share.import_defines_both",{first:i[0],second:i[1]})),{ok:0===t.length,errors:t}}const $i=["card","badge","row","element","group"],wi=/^[A-Za-z0-9_-]+$/,xi=/^[a-z_]+\.[a-z0-9_]+$/;function ki(e){return $i.find(t=>void 0!==(null==e?void 0:e[t])&&null!==(null==e?void 0:e[t]))}function Si(e){return e.map(e=>"number"==typeof e?`#${e+1}`:e).join(" › ")}function ji(e){const t=new Set;for(const n of je(null==e?void 0:e.variables))n&&"string"==typeof n.name&&t.add(n.name);const i=JSON.stringify(null!=e?e:{}),s=/\[\[([A-Za-z0-9_-]+)/g;for(let n=s.exec(i);n;n=s.exec(i))t.add(n[1]);return[...t]}function Ai(e){return"boolean"==typeof e?"boolean":"number"==typeof e?"number":"string"==typeof e&&xi.test(e)?"entity":"string"==typeof e&&/^[a-z]+:[a-z0-9-]+$/.test(e)?"icon":"text"}function Ci(e,t,i){if(!t.length)return i;const[s,...n]=t;return Array.isArray(e)?e.map((e,t)=>t===s?Ci(e,n,i):e):Object.assign(Object.assign({},e),{[s]:Ci(null==e?void 0:e[s],n,i)})}const Oi=["card","badge","row","element","group","style","let","default","grid_options","name"],Ei="default:",Ti="or:";function Ni(e){return e.startsWith(Ti)?e.slice(3):Ne(e)}function Pi(e,t,i){if(!e.includes("[[")&&!e.includes("]]"))return;const s=function(e){let t=0,i=!1;for(let s=0;s<e.length-1;s+=1){const n=e.slice(s,s+2);"[["===n?(t+=1,s+=1):"]]"===n&&(0===t?i=!0:t-=1,s+=1)}return{unclosed:t>0,stray:i}}(e);s.unclosed&&i.findings.push({level:"warning",key:"lint.unclosed",params:{},path:t}),s.stray&&i.findings.push({level:"warning",key:"lint.stray_close",params:{},path:t});let n=e;for(let a=0;a<5;a+=1){let e=!1;if(n=n.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(s,n)=>(e=!0,n.startsWith(Oe)||Ii(n,t,i),"_")),!e)break}}function Ii(e,t,i){const s=e.endsWith("?")?e.slice(0,-1):e,[n,...a]=s.split("|"),o=`[[${e}]]`,r=(n.endsWith("?")?n.slice(0,-1):n).split(".")[0];r&&"_"!==r&&!i.heads.has(r)&&i.heads.set(r,t);let l=!1;for(const c of a){if(!Ee(c)){const e=Te(c);i.findings.push({level:"warning",key:"lint.unknown_step",params:e?{step:c,placeholder:o,closest:e}:{step:c,placeholder:o},path:t});continue}(c.startsWith(Ei)||c.startsWith(Ti))&&l&&i.findings.push({level:"warning",key:"lint.after_default",params:{step:c,placeholder:o},path:t}),c.startsWith(Ei)&&c.length>8&&(l=!0);const e=Ni(c);e&&"_"!==e&&i.targets.push({name:e,placeholder:o,path:t})}}function Fi(e,t,i){if("string"!=typeof e){if(Array.isArray(e))e.forEach((e,s)=>Fi(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,n]of Object.entries(e))Pi(s,t,i),Fi(n,t?`${t}.${s}`:s,i)}else Pi(e,t,i)}function Li(e){const t=new Set;for(const i of y(e))t.add(i.name);for(const i of[...ce(be(e)),...ce(null==e?void 0:e.let)]){const e=O(i);void 0!==e&&t.add(e)}return[...t]}const Mi={card:{type:"entity",entity:"sun.sun"},badge:{type:"entity",entity:"sun.sun"},row:{entity:"sun.sun"},element:{type:"icon",icon:"mdi:weather-sunny",style:{color:"yellow"}}},Di=50,Vi=e=>!!customElements.get(e),Ri=e=>e.actions.length>0||e.urls.length>0||e.embeds||e.scripts||e.placeholders||e.overlay;const zi=500;function qi(t){const i=e=>{var i;return t.onInput(null!==(i=e.target.value)&&void 0!==i?i:"")},s=e=>{var i;return null===(i=t.onKeydown)||void 0===i?void 0:i.call(t,e)};return Vi("ha-input")?e`<ha-input
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
      ></ha-textfield>`}async function Hi(e,t,i,s){var a;if(!V())return e._toolError=n("tools.cannot_save_here",void 0,e.hass),!1;e._busy=!0,e._toolError=void 0;try{return await z(e,e.hass,i,[{urlPath:H(),build:t}],s),e._undoChanged=void 0,!0}catch(o){return e._toolError=n("tools.save_failed",{message:null!==(a=null==o?void 0:o.message)&&void 0!==a?a:o},e.hass),!1}finally{e._busy=!1}}const Ui=c`
  ${Ie.styles}
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
 */;let Ki=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Wi={},Ji=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends Ki{constructor(){super(...arguments),this.key=Fe}render(e,t){return this.key=e,t}update(e,[t,i]){return t!==this.key&&(((e,t=Wi)=>{e._$AH=t;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */})(e),this.key=t),i}}),Bi=[{name:"room_light_tile",summary:"A tile per light, with the light named after itself.",template:{description:"A tile for one light, taking its name from Home Assistant.",variables:[{name:"entity",label:"Light",selector:{entity:{domain:"light"}},required:!0},{name:"name",label:"Name",description:"Leave empty to use the light’s own name",selector:{text:{}}}],card:{type:"tile",entity:"[[entity]]",name:"[[name|or:entity|friendly_name]]",features:[{type:"light-brightness"}]}}},{name:"room_summary",summary:"A heading per area, listing the lights in it. Uses grouping.",template:{description:"One card per area, with a tile for every light in that area.",card:{type:"vertical-stack",cards:[{type:"markdown",content:"## [[area]]\n\n[[entity_count]] lights"},{type:"custom:decluttering-card-plus",template:"room_light_tile",for_each:"[[items]]"}]}}},{name:"sensor_line",summary:"An Entities row showing one sensor with its area.",template:{description:"A row for one sensor, labelled with the area it is in.",variables:[{name:"entity",label:"Sensor",selector:{entity:{}},required:!0}],row:{entity:"[[entity]]",name:"[[entity|friendly_name]] ([[entity|area|default:no area]])"}}},{name:"status_badge",summary:"A badge that only appears when something needs attention.",template:{description:"A badge for one entity, hidden unless it is in the state you care about.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0},{name:"when",label:"Show when the state is",selector:{text:{}},default:"on"}],badge:{type:"entity",entity:"[[entity]]",visibility:[{condition:"state",entity:"[[entity]]",state:"[[when]]"}]}}},{name:"counted_grid",summary:'A numbered grid of anything, showing "3 of 12".',template:{description:"A tile that knows where it sits in a repeat.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0}],card:{type:"tile",entity:"[[entity]]",name:"[[entity|friendly_name]]",footer:{type:"markdown",content:"[[index]] of [[total|or:count]]"}}}}];function Yi(e){return Bi.find(t=>t.name===e)}function Gi(e,t){const i=new Set,s=e=>{Array.isArray(e)?e.forEach(s):e&&"object"==typeof e&&("string"==typeof e.type&&e.type.includes("decluttering-card")&&"string"==typeof e.template&&i.add(e.template),Object.values(e).forEach(s))};return s(e.template),[...i].filter(e=>!t.includes(e))}function Zi(e,t){return{library:e,version:t}}
/*! js-yaml 5.5.0 https://github.com/nodeca/js-yaml @license MIT */var Qi=Symbol("NOT_RESOLVED");function Xi(e,t){return{tagName:e,nodeKind:"scalar",implicit:t.implicit??!1,matchByTagPrefix:t.matchByTagPrefix??!1,implicitFirstChars:t.implicitFirstChars??null,resolve:t.resolve,identify:t.identify,represent:t.represent??(e=>String(e)),representTagName:t.representTagName??(()=>e)}}function es(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"sequence",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addItem:t.addItem,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}function ts(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"mapping",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addPair:t.addPair,has:t.has,keys:t.keys,get:t.get,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}var is=Xi("tag:yaml.org,2002:str",{resolve:e=>e,identify:e=>"string"==typeof e}),ss=["","~","null","Null","NULL"],ns=Xi("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==ss.indexOf(e)?null:Qi,identify:e=>null===e,represent:()=>"null"}),as=Xi("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(e,t)=>"null"===e||t&&""===e?null:Qi,identify:e=>null===e,represent:()=>"null"}),os=["","~","null","Null","NULL"],rs=Xi("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==os.indexOf(e)?null:Qi,identify:e=>null===e,represent:()=>"null"}),ls=["true","True","TRUE"],cs=["false","False","FALSE"],hs=Xi("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:e=>-1!==ls.indexOf(e)||-1===cs.indexOf(e)&&Qi,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),ds=["true"],us=["false"],ps=Xi("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:e=>-1!==ds.indexOf(e)||-1===us.indexOf(e)&&Qi,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),ms=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],fs=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],gs=Xi("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:e=>-1!==ms.indexOf(e)||-1===fs.indexOf(e)&&Qi,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),_s=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),vs=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var ys=Xi("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e,t){if(t){if(!vs.test(e))return Qi}else if(!_s.test(e))return Qi;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:Qi},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),bs=new RegExp("^-?(?:0|[1-9][0-9]*)$"),$s=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var ws=Xi("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!$s.test(e))return Qi}else if(!bs.test(e))return Qi;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:Qi},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),xs=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$");var ks=Xi("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e){if(!xs.test(e))return Qi;const t=function(e){let t=e.replace(/_/g,""),i=1;if("-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b"))return i*parseInt(t.slice(2),2);if(t.startsWith("0x"))return i*parseInt(t.slice(2),16);if(t.includes(":")){let e=0;for(const i of t.split(":"))e=60*e+Number(i);return i*e}return"0"!==t&&"0"===t[0]?i*parseInt(t,8):i*parseInt(t,10)}(e);return Number.isFinite(t)?t:Qi},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),Ss=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),js=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var As=Xi("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!Ss.test(e))return Qi;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const s=i*parseFloat(t);return Number.isFinite(s)||js.test(e)?s:Qi},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),Cs=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),Os=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var Es=Xi("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!Os.test(e))return Qi;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const s=i*parseFloat(t);return Number.isFinite(s)?s:Qi}if(!Cs.test(e))return Qi;const i=Number(e);return Number.isFinite(i)?i:Qi},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),Ts=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),Ns=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var Ps=Xi("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!Ts.test(e))return Qi;let t=e.toLowerCase().replace(/_/g,"");const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;let s=0;if(t.includes(":")){for(const e of t.split(":"))s=60*s+Number(e);s*=i}else s=i*parseFloat(t);return Number.isFinite(s)||Ns.test(e)?s:Qi},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),Is=Xi("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(e,t)=>"<<"===e||t&&""===e?"<<":Qi,identify:()=>!1}),Fs=/^[A-Za-z0-9+/]*={0,2}$/;var Ls=Xi("tag:yaml.org,2002:binary",{resolve:function(e){const t=e.replace(/\s/g,"");if(t.length%4!=0||!Fs.test(t))return Qi;const i=atob(t),s=new Uint8Array(i.length);for(let n=0;n<i.length;n++)s[n]=i.charCodeAt(n);return s},identify:e=>"[object Uint8Array]"===Object.prototype.toString.call(e),represent:function(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t)}}),Ms=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Ds=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function Vs(e,t,i,s=0,n=0,a=0,o=0){const r=new Date(Date.UTC(e,t,i,s,n,a,o));return r.setUTCFullYear(e,t,i),r}var Rs=Xi("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(e){let t=Ms.exec(e);if(null===t&&(t=Ds.exec(e)),null===t)return Qi;const i=+t[1],s=+t[2]-1,n=+t[3];if(!t[4]){const e=Vs(i,s,n);return e.getUTCFullYear()!==i||e.getUTCMonth()!==s||e.getUTCDate()!==n?Qi:e}const a=+t[4],o=+t[5],r=+t[6];let l=0;if(a>23||o>59||r>59)return Qi;if(t[7]){let e=t[7].slice(0,3);for(;e.length<3;)e+="0";l=+e}const c=Vs(i,s,n,a,o,r,l);if(c.getUTCFullYear()!==i||c.getUTCMonth()!==s||c.getUTCDate()!==n)return Qi;if(t[9]){const e=+t[10],i=+(t[11]||0);if(e>23||i>59)return Qi;const s=6e4*(60*e+i);c.setTime(c.getTime()-("-"===t[9]?-s:s))}return c},identify:e=>e instanceof Date,represent:e=>e.toISOString()}),zs=es("tag:yaml.org,2002:seq",{create:()=>[],addItem:(e,t)=>{e.push(t)},identify:Array.isArray});function qs(e){if(null===e||"object"!=typeof e||Array.isArray(e))return!1;const t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}function Hs(e,t){const i={};for(const s of t)void 0!==e[s]&&(i[s]=e[s]);return i}var Us=es("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(e,t)=>{let i;if(t instanceof Map){if(1!==t.size)return"cannot resolve an ordered map item";i=t.keys().next().value}else{if(!qs(t))return"cannot resolve an ordered map item";{const e=Object.keys(t);if(1!==e.length)return"cannot resolve an ordered map item";i=e[0]}}return e.seen.has(i)?"duplicate key in ordered map":(e.seen.add(i),e.list.push(t),"")},finalize:e=>e.list,identify:()=>!1}),Ks=es("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(e,t)=>{if(t instanceof Map)return 1!==t.size?"cannot resolve a pairs item":(e.push(t.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(t))return"cannot resolve a pairs item";const i=t,s=Object.keys(i);return 1!==s.length?"cannot resolve a pairs item":(e.push([s[0],i[s[0]]]),"")},identify:()=>!1}),Ws=ts("tag:yaml.org,2002:map",{create:()=>({}),identify:qs,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{if(null!==t&&"object"==typeof t)return"object-based map does not support complex keys";const s=String(t);return"__proto__"===s?Object.defineProperty(e,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[s]=i,""},has:(e,t)=>(null===t||"object"!=typeof t)&&Object.prototype.hasOwnProperty.call(e,String(t)),keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}}),Js=ts("tag:yaml.org,2002:set",{create:()=>new Set,identify:e=>e instanceof Set,represent:e=>{const t=new Map;for(const i of e)t.set(i,null);return t},addPair:(e,t,i)=>null!==i?"cannot resolve a set item":(e.add(t),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:()=>null});var Bs=class e{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(e){const t=function(e){const t=[];for(const i of e){let e=t.length;for(let s=0;s<t.length;s++){const n=t[s];if(n.nodeKind===i.nodeKind&&n.tagName===i.tagName&&n.matchByTagPrefix===i.matchByTagPrefix){e=s;break}}t[e]=i}return t}(e),i=[],s={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},n={scalar:[],sequence:[],mapping:[]};for(const c of t){if("scalar"===c.nodeKind&&c.implicit){if(c.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(c)}switch(c.nodeKind){case"scalar":c.matchByTagPrefix?n.scalar.push(c):s.scalar[c.tagName]=c;break;case"sequence":c.matchByTagPrefix?n.sequence.push(c):s.sequence[c.tagName]=c;break;case"mapping":c.matchByTagPrefix?n.mapping.push(c):s.mapping[c.tagName]=c}}const a=i.filter(e=>null===e.implicitFirstChars),o=new Set;for(const c of i)if(null!==c.implicitFirstChars)for(const e of c.implicitFirstChars)o.add(e);const r=new Map;for(const c of o)r.set(c,i.filter(e=>null===e.implicitFirstChars||-1!==e.implicitFirstChars.indexOf(c)));const l=s.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=t,this.implicitScalarTags=i,this.implicitScalarByFirstChar=r,this.implicitScalarAnyFirstChar=a,this.defaultScalarTag=l,this.defaultSequenceTag=s.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=s.mapping["tag:yaml.org,2002:map"],this.exact=s,this.prefix=n}lookupScalarTag(e){const t=this.exact.scalar[e];if(t)return t;for(const i of this.prefix.scalar)if(e.startsWith(i.tagName))return i}lookupSequenceTag(e){const t=this.exact.sequence[e];if(t)return t;for(const i of this.prefix.sequence)if(e.startsWith(i.tagName))return i}lookupMappingTag(e){const t=this.exact.mapping[e];if(t)return t;for(const i of this.prefix.mapping)if(e.startsWith(i.tagName))return i}resolveImplicitScalarTag(e){const t=this.implicitScalarByFirstChar.get(e.charAt(0))??this.implicitScalarAnyFirstChar;for(const s of t){const t=s.resolve(e,!1,s.tagName);if(t!==Qi)return{value:t,tag:s}}const i=this.defaultScalarTag;return{value:i.resolve(e,!1,i.tagName),tag:i}}withTags(...t){let i=[];for(const e of t)i=i.concat(e);return new e([...this.tags,...i])}},Ys=new Bs([is,zs,Ws]);new Bs([...Ys.tags,as,ps,ws,Es]);var Gs=new Bs([...Ys.tags,ns,hs,ys,As]);function Zs(e){if(Array.isArray(e)){const t=Array.prototype.slice.call(e);for(let e=0;e<t.length;e++){if(Array.isArray(t[e]))return null;"object"==typeof t[e]&&"[object Object]"===Object.prototype.toString.call(t[e])&&(t[e]="[object Object]")}return String(t)}return"object"==typeof e&&"[object Object]"===Object.prototype.toString.call(e)?"[object Object]":String(e)}new Bs([...Ys.tags,rs,gs,ks,Ps,Rs,Is,Ls,Us,Ks,Js]).withTags({...ks,resolve:(e,t,i)=>{const s=ks.resolve(e,t,i);return s===Qi?ys.resolve(e,t,i):s}},{...Ps,resolve:(e,t,i)=>{const s=Ps.resolve(e,t,i);return s===Qi?As.resolve(e,t,i):s}}),ts("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(e,t,i)=>(e.set(t,i),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:(e,t)=>e.get(t),identify:e=>e instanceof Map||qs(e),represent:e=>{if(e instanceof Map)return e;const t=new Map,i=e;for(const s of Object.keys(i))t.set(s,i[s]);return t}}),ts("tag:yaml.org,2002:map",{create:()=>({}),identify:qs,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{const s=Zs(t);return null===s?"nested arrays are not supported inside keys":("__proto__"===s?Object.defineProperty(e,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[s]=i,"")},has:(e,t)=>{const i=Zs(t);return null!==i&&Object.prototype.hasOwnProperty.call(e,i)},keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}});var Qs={maxLength:79,indent:1,linesBefore:3,linesAfter:2};function Xs(e,t,i,s,n){let a="",o="";const r=Math.floor(n/2)-1;return s-t>r&&(a=" ... ",t=s-r+a.length),i-s>r&&(o=" ...",i=s+r-o.length),{str:a+e.slice(t,i).replace(/\t/g,"→")+o,pos:s-t+a.length}}function en(e,t){return" ".repeat(Math.max(t-e.length,0))+e}function tn(e,t){let i="";return e.mark?(e.mark.name&&(i+=`in "${e.mark.name}" `),i+=`(${e.mark.line+1}:${e.mark.column+1})`,!t&&e.mark.snippet&&(i+=`\n\n${e.mark.snippet}`),`${e.reason} ${i}`):e.reason}var sn=class e extends Error{reason;mark;constructor(e,t){super(),this.name="YAMLException",this.reason=e,this.mark=t,this.message=tn(this,!1),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}toString(e){return`${this.name}: ${tn(this,e)}`}static throwAt(t,i,s,n=""){let a=0,o=0;for(let e=0;e<i;e++){const i=t.charCodeAt(e);10===i?(a++,o=e+1):13===i&&(a++,10===t.charCodeAt(e+1)&&e++,o=e+1)}const r={name:n,buffer:t,position:i,line:a,column:i-o};throw r.snippet=function(e,t){if(!e.buffer)return null;const i={...Qs,...t},s=/\r?\n|\r|\0/g,n=[0],a=[];let o,r=-1;for(;o=s.exec(e.buffer);)a.push(o.index),n.push(o.index+o[0].length),e.position<=o.index&&r<0&&(r=n.length-2);r<0&&(r=n.length-1);let l="";const c=Math.min(e.line+i.linesAfter,a.length).toString().length,h=i.maxLength-(i.indent+c+3);for(let u=1;u<=i.linesBefore&&!(r-u<0);u++){const t=Xs(e.buffer,n[r-u],a[r-u],e.position-(n[r]-n[r-u]),h);l=`${" ".repeat(i.indent)}${en((e.line-u+1).toString(),c)} | ${t.str}\n${l}`}const d=Xs(e.buffer,n[r],a[r],e.position,h);l+=`${" ".repeat(i.indent)}${en((e.line+1).toString(),c)} | ${d.str}\n`,l+=`${"-".repeat(i.indent+c+3+d.pos)}^\n`;for(let u=1;u<=i.linesAfter&&!(r+u>=a.length);u++){const t=Xs(e.buffer,n[r+u],a[r+u],e.position-(n[r]-n[r+u]),h);l+=`${" ".repeat(i.indent)}${en((e.line+u+1).toString(),c)} | ${t.str}\n`}return l.replace(/\n$/,"")}(r),new e(s,r)}},nn=1,an=2,on=3,rn=4,ln=5,cn=6,hn=1,dn=2,un=3,pn=4,mn=5,fn=1,gn=2,_n=1,vn=2,yn=3;function bn(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}var $n=new Array(256),wn=new Array(256);for(let mr=0;mr<256;mr++)$n[mr]=bn(mr)?1:0,wn[mr]=bn(mr);function xn(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function kn(e){return e>=48&&e<=57?e-48:(32|e)-97+10}function Sn(e){return 120===e?2:117===e?4:8}function jn(e,t,i){let s=0;for(;t<i;){const i=e.charCodeAt(t);if(10===i)s++,t++;else if(13===i)s++,t++,10===e.charCodeAt(t)&&t++;else{if(32!==i&&9!==i)break;t++}}return{position:t,breaks:s}}function An(e){return 1===e?" ":"\n".repeat(e-1)}function Cn(e,t,i,s,n,a){const o=s<0?0:s,r=e.slice(t,i).replace(/\r\n?/g,"\n"),l=""===r?[]:(r.endsWith("\n")?r.slice(0,-1):r).split("\n");let c="",h=!1,d=0,u=!1;for(const p of l){let e=0;for(;e<o&&32===p.charCodeAt(e);)e++;if(s<0||e>=p.length){d++;continue}const t=p.slice(o),i=t.charCodeAt(0);a?32===i||9===i?(u=!0,c+="\n".repeat(h?1+d:d)):u?(u=!1,c+="\n".repeat(d+1)):0===d?h&&(c+=" "):c+="\n".repeat(d):c+="\n".repeat(h?1+d:d),c+=t,h=!0,d=0}return n===yn?c+="\n".repeat(h?1+d:d):n!==vn&&h&&(c+="\n"),c}function On(e,t){if(-1===t.valueStart)return"";const{valueStart:i,valueEnd:s}=t;if(t.fast)return e.slice(i,s);switch(t.style){case dn:return function(e,t,i){let s="",n=t,a=t,o=t;for(;n<i;){const t=e.charCodeAt(n);if(39===t)s+=e.slice(a,n)+"'",n+=2,a=o=n;else if(10===t||13===t){s+=e.slice(a,o);const t=jn(e,n,i);s+=An(t.breaks),n=a=o=t.position}else n++,32!==t&&9!==t&&(o=n)}return s+e.slice(a,i)}(e,i,s);case un:return function(e,t,i){let s="",n=t,a=t,o=t;for(;n<i;){const t=e.charCodeAt(n);if(92===t){s+=e.slice(a,n),n++;const t=e.charCodeAt(n);if(10===t||13===t)n=jn(e,n,i).position;else if(t<256&&$n[t])s+=wn[t],n++;else{let i=Sn(t),a=0;for(;i>0;i--)n++,a=(a<<4)+kn(e.charCodeAt(n));s+=xn(a),n++}a=o=n}else if(10===t||13===t){s+=e.slice(a,o);const t=jn(e,n,i);s+=An(t.breaks),n=a=o=t.position}else n++,32!==t&&9!==t&&(o=n)}return s+e.slice(a,i)}(e,i,s);case pn:return Cn(e,i,s,t.indent,t.chomping,!1);case mn:return Cn(e,i,s,t.indent,t.chomping,!0);default:return function(e,t,i){let s="",n=t,a=t,o=t;for(;n<i;){const t=e.charCodeAt(n);if(10===t||13===t){s+=e.slice(a,o);const t=jn(e,n,i);s+=An(t.breaks),n=a=o=t.position}else n++,32!==t&&9!==t&&(o=n)}return s+e.slice(a,o)}(e,i,s)}}var En=Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"});function Tn(e){let t="",i=0;for(;i<e.length;){if(37!==e.charCodeAt(i)){t+=e[i++];continue}let s=parseInt(e.slice(i+1,i+3),16);if(i+=3,s>=192){let t=s<224?1:s<240?2:3;for(s&=(1<<6-t)-1;t-- >0;)s=s<<6|63&parseInt(e.slice(i+1,i+3),16),i+=3}s<65536?t+=String.fromCharCode(s):(s-=65536,t+=String.fromCharCode(55296|s>>10,56320|1023&s))}return t}function Nn(e,t){if(e.startsWith("!<")&&e.endsWith(">"))return Tn(e.slice(2,-1));const i=e.indexOf("!",1),s=-1===i?"!":e.slice(0,i+1);return Tn(t?.[s]??En[s]??s)+Tn(e.slice(s.length))}var Pn=-1,In={filename:"",schema:Gs,json:!1,maxTotalMergeKeys:1e4,maxAliases:-1};function Fn(e){return"tagStart"in e&&e.tagStart!==Pn?e.tagStart:"anchorStart"in e&&e.anchorStart!==Pn?e.anchorStart:"valueStart"in e&&e.valueStart!==Pn?e.valueStart:"start"in e?e.start:0}function Ln(e,t){sn.throwAt(e.source,e.position,t,e.filename)}function Mn(e,t,i,s){try{return i.finalize(s)}catch(n){if(n instanceof sn)throw n;sn.throwAt(e.source,t,n instanceof Error?n.message:String(n),e.filename)}}function Dn(e,t){const i=On(e.source,t),s=t.tagStart===Pn?"":e.source.slice(t.tagStart,t.tagEnd),n=e.schema.defaultScalarTag;if(""!==s){if("!"===s)return{value:i,tag:n};const t=Nn(s,e.tagHandlers),a=e.schema.lookupScalarTag(t);if(a){const s=a.resolve(i,!0,t);return s===Qi&&Ln(e,`cannot resolve a node with !<${t}> explicit tag`),{value:s,tag:a}}const o=e.schema.lookupMappingTag(t)??e.schema.lookupSequenceTag(t);if(o){""!==i&&Ln(e,`cannot resolve a node with !<${t}> explicit tag`);const s=o.create(t);return{value:o.carrierIsResult?s:Mn(e,e.position,o,s),tag:o}}Ln(e,`unknown scalar tag !<${t}>`)}return t.style===hn?e.schema.resolveImplicitScalarTag(i):{value:n.resolve(i,!1,n.tagName),tag:n}}function Vn(e,t,i){const s=t.tagStart===Pn?"":e.source.slice(t.tagStart,t.tagEnd);return""===s||"!"===s?i:Nn(s,e.tagHandlers)}function Rn(e){return"mapping"===e.nodeKind}function zn(e){e.totalMergeKeys++,-1!==e.maxTotalMergeKeys&&e.totalMergeKeys>e.maxTotalMergeKeys&&Ln(e,`merge keys exceeded maxTotalMergeKeys (${e.maxTotalMergeKeys})`)}function qn(e,t,i,s){zn(e);for(const n of s.keys(i)){if(zn(e),t.tag.has(t.value,n))continue;const a=t.tag.addPair(t.value,n,s.get(i,n));a&&Ln(e,a),t.overridable??=new Set,t.overridable.add(n)}}function Hn(e,t,i,s,n){if(e.position=t.keyPosition,t.keyIsMerge)return void function(e,t,i,s){if(e.position=t.keyPosition,Rn(s))qn(e,t,i,s);else if("sequence"===s.nodeKind&&Array.isArray(i)){i.length>100&&Ln(e,"abnormal merge sequence size");for(const s of i){const i=e.nodeTags.get(s);i||Ln(e,"cannot merge mappings; the provided source object is unacceptable"),qn(e,t,s,i)}}else Ln(e,"cannot merge mappings; the provided source object is unacceptable")}(e,t,s,n);e.json||!t.tag.has(t.value,i)||t.overridable?.has(i)||Ln(e,"duplicated mapping key");const a=t.tag.addPair(t.value,i,s);a&&Ln(e,a),t.overridable?.delete(i)}function Un(e,t,i){const s=e.frames[e.frames.length-1];if("document"===s.kind)s.value=t,s.hasValue=!0;else if("sequence"===s.kind){Rn(i)&&e.nodeTags.set(t,i);const n=s.tag.addItem(s.value,t,s.index++);n&&Ln(e,n)}else if(s.hasKey){const n=s.key;s.key=void 0,s.hasKey=!1,Hn(e,s,n,t,i)}else s.key=t,s.keyPosition=e.position,s.hasKey=!0,s.keyIsMerge="tag:yaml.org,2002:merge"===i.tagName}function Kn(e,t,i,s,n){if(t.anchorStart!==Pn){const a={value:i,tag:s,isValueFinal:n};return e.anchors.set(e.source.slice(t.anchorStart,t.anchorEnd),a),a}return null}var Wn=-1,Jn=Object.prototype.hasOwnProperty,Bn=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Yn=/[,\[\]{}]/,Gn=/^(?:!|!!|![0-9A-Za-z-]+!)$/,Zn=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,Qn=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`,Xn=new RegExp(`^(?:${Zn})*$`),ea=new RegExp(`^(?:${Qn})+$`),ta=new RegExp(`^(?:!(?:${Zn})*|${Qn}(?:${Zn})*)$`),ia={filename:"",maxDepth:100};function sa(e,t,i,s,n,a,o){e.events.push({type:an,start:t,anchorStart:i,anchorEnd:s,tagStart:n,tagEnd:a,style:o})}function na(e,t,i,s,n,a,o){e.events.push({type:on,start:t,anchorStart:i,anchorEnd:s,tagStart:n,tagEnd:a,style:o})}function aa(e,t){e.events.splice(t.eventsLength,0,{type:on,start:t.position,anchorStart:Wn,anchorEnd:Wn,tagStart:Wn,tagEnd:Wn,style:gn})}function oa(e,t,i,s,n,a,o,r,l=_n,c=-1,h=!1){e.events.push({type:rn,valueStart:t,valueEnd:i,anchorStart:s,anchorEnd:n,tagStart:a,tagEnd:o,style:r,chomping:l,indent:c,fast:h})}function ra(e){e.events.push({type:cn})}function la(e){oa(e,Wn,Wn,Wn,Wn,Wn,Wn,hn)}function ca(){return{anchorStart:Wn,anchorEnd:Wn,tagStart:Wn,tagEnd:Wn}}function ha(e){return{position:e.position,line:e.line,lineStart:e.lineStart,lineIndent:e.lineIndent,firstTabInLine:e.firstTabInLine,eventsLength:e.events.length}}function da(e,t){e.position=t.position,e.line=t.line,e.lineStart=t.lineStart,e.lineIndent=t.lineIndent,e.firstTabInLine=t.firstTabInLine,e.events.length=t.eventsLength}function ua(e,t){sn.throwAt(e.input.slice(0,e.length),e.position,t,e.filename)}function pa(e){return 10===e||13===e}function ma(e){return 9===e||32===e}function fa(e){return ma(e)||pa(e)}function ga(e){return 0===e||fa(e)}function _a(e){return 44===e||91===e||93===e||123===e||125===e}function va(e){return e>=48&&e<=57?e-48:-1}function ya(e){if(e>=48&&e<=57)return e-48;const t=32|e;return t>=97&&t<=102?t-97+10:-1}function ba(e){return 120===e?2:117===e?4:85===e?8:0}function $a(e){return 48===e||97===e||98===e||116===e||9===e||110===e||118===e||102===e||114===e||101===e||32===e||34===e||47===e||92===e||78===e||95===e||76===e||80===e}function wa(e){10===e.input.charCodeAt(e.position)?e.position++:(e.position++,10===e.input.charCodeAt(e.position)&&e.position++),e.line++,e.lineStart=e.position,e.lineIndent=0,e.firstTabInLine=-1}function xa(e,t){let i=0,s=e.input.charCodeAt(e.position),n=e.position===e.lineStart||fa(e.input.charCodeAt(e.position-1));for(;0!==s;){for(;ma(s);)n=!0,9===s&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),s=e.input.charCodeAt(++e.position);if(t&&n&&35===s)do{s=e.input.charCodeAt(++e.position)}while(!pa(s)&&0!==s);if(!pa(s))break;for(wa(e),i++,n=!0,s=e.input.charCodeAt(e.position);32===s;)e.lineIndent++,s=e.input.charCodeAt(++e.position)}return i}function ka(e,t=e.position){const i=e.input.charCodeAt(t);if((45===i||46===i)&&i===e.input.charCodeAt(t+1)&&i===e.input.charCodeAt(t+2)){const i=e.input.charCodeAt(t+3);return 0===i||fa(i)}return!1}function Sa(e){e.position===e.lineStart&&65279===e.input.charCodeAt(e.position)&&(e.position++,e.lineStart=e.position)}function ja(e){if(e.position!==e.lineStart)return!1;if(ka(e))return!0;if(65279!==e.input.charCodeAt(e.position))return!1;const t=ha(e);Sa(e),xa(e,!0);const i=e.input.charCodeAt(e.position),s=e.position===e.lineStart&&(37===i||45===i&&ka(e));return da(e,t),s}function Aa(e){let t=e.input.charCodeAt(e.position);for(;0!==t&&!pa(t);)t=e.input.charCodeAt(++e.position)}function Ca(e,t,i){const s=Bn.exec(e.input.slice(t,i));null!==s&&(e.position=t+s.index+s[0].length-1,ua(e,"the stream contains non-printable characters"))}function Oa(e,t,i){if(33!==e.input.charCodeAt(e.position))return!1;t.tagStart!==Wn&&ua(e,"duplication of a tag property");const s=e.position;let n=!1,a=!1,o="!",r=e.input.charCodeAt(++e.position);60===r?(n=!0,r=e.input.charCodeAt(++e.position)):33===r&&(a=!0,o="!!",r=e.input.charCodeAt(++e.position));let l,c=e.position;if(n){for(;0!==r&&62!==r;)r=e.input.charCodeAt(++e.position);62!==r&&ua(e,"unexpected end of the stream within a verbatim tag"),l=e.input.slice(c,e.position),e.position++}else{for(;!(0===r||fa(r)||i&&_a(r));)33===r&&(a?ua(e,"tag suffix cannot contain exclamation marks"):(o=e.input.slice(c-1,e.position+1),Gn.test(o)||ua(e,"named tag handle cannot contain such characters"),a=!0,c=e.position+1)),r=e.input.charCodeAt(++e.position);l=e.input.slice(c,e.position),Yn.test(l)&&ua(e,"tag suffix cannot contain flow indicator characters")}return l&&!(n?Xn.test(l):ea.test(l))&&ua(e,`tag name cannot contain such characters: ${l}`),n||"!"===o||"!!"===o||Jn.call(e.tagHandlers,o)||ua(e,`undeclared tag handle "${o}"`),t.tagStart=s,t.tagEnd=e.position,!0}function Ea(e,t){if(38!==e.input.charCodeAt(e.position))return!1;t.anchorStart!==Wn&&ua(e,"duplication of an anchor property"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!fa(e.input.charCodeAt(e.position))&&!_a(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&ua(e,"name of an anchor node must contain at least one character"),t.anchorStart=i,t.anchorEnd=e.position,!0}function Ta(e,t){if(42!==e.input.charCodeAt(e.position))return!1;t.anchorStart===Wn&&t.tagStart===Wn||ua(e,"alias node should not have any properties"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!fa(e.input.charCodeAt(e.position))&&!_a(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&ua(e,"name of an alias node must contain at least one character"),function(e,t,i){e.events.push({type:ln,anchorStart:t,anchorEnd:i})}(e,i,e.position),!0}function Na(e,t){xa(e,!1),e.lineIndent<t&&ua(e,"deficient indentation")}function Pa(e,t,i,s){if(!function(e,t){const i=e.input.charCodeAt(e.position),s=1===t;if(0===i||fa(i)||35===i||38===i||42===i||33===i||124===i||62===i||39===i||34===i||37===i||64===i||96===i||_a(i))return!1;if(63===i||45===i){const t=e.input.charCodeAt(e.position+1);if(ga(t)||s&&_a(t))return!1}return!0}(e,i))return!1;const n=e.position;let a=e.position,o=e.input.charCodeAt(e.position);const r=1===i;let l=!1;for(;0!==o&&!ja(e);){if(58===o){const t=e.input.charCodeAt(e.position+1);if(ga(t)||r&&_a(t))break}else if(35===o){if(fa(e.input.charCodeAt(e.position-1)))break}else{if(r&&_a(o))break;if(pa(o)){const i=e.position,s=e.line,n=e.lineStart,a=e.lineIndent;if(xa(e,!1),e.lineIndent>=t){l=!0,o=e.input.charCodeAt(e.position);continue}e.position=i,e.line=s,e.lineStart=n,e.lineIndent=a;break}}ma(o)||(a=e.position+1),o=e.input.charCodeAt(++e.position)}return a!==n&&(Ca(e,n,a),oa(e,n,a,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,hn,_n,-1,!l),!0)}function Ia(e,t){const i=e.line;xa(e,!0),(e.line>i&&e.lineIndent<t||-1!==e.firstTabInLine&&e.lineIndent<t)&&ua(e,"deficient indentation")}function Fa(e,t,i){if(-1!==e.firstTabInLine||45!==e.input.charCodeAt(e.position)||!ga(e.input.charCodeAt(e.position+1)))return!1;for(sa(e,e.position,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,fn);45===e.input.charCodeAt(e.position)&&ga(e.input.charCodeAt(e.position+1));){-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,ua(e,"tab characters must not be used in indentation"));const i=e.line;e.position++;const s=xa(e,!0)>0;if(-1!==e.firstTabInLine&&45===e.input.charCodeAt(e.position)&&ga(e.input.charCodeAt(e.position+1))&&ua(e,"bad indentation of a sequence entry"),s&&e.lineIndent<=t?la(e):Ma(e,t,3,!1,!0),xa(e,!0),e.lineIndent<t||e.position>=e.length)break;e.lineIndent>t&&ua(e,"bad indentation of a sequence entry"),e.line===i&&45===e.input.charCodeAt(e.position)&&ga(e.input.charCodeAt(e.position+1))&&ua(e,"bad indentation of a sequence entry")}return ra(e),!0}function La(e,t,i,s){let n=!1,a=!1,o=!1,r=!1;if(-1!==e.firstTabInLine)return!1;let l=e.input.charCodeAt(e.position);for(;0!==l;){n||-1===e.firstTabInLine||(e.position=e.firstTabInLine,ua(e,"tab characters must not be used in indentation"));const c=e.input.charCodeAt(e.position+1),h=e.line;if(63!==l&&58!==l||!ga(c)){n&&(la(e),n=!1);const t=ha(e);if(!Ma(e,i,2,!1,!0))break;if(e.line===h){for(l=e.input.charCodeAt(e.position);ma(l);)l=e.input.charCodeAt(++e.position);if(58===l)l=e.input.charCodeAt(++e.position),ga(l)||ua(e,"a whitespace character is expected after the key-value separator within a block mapping"),o||(e.events.splice(t.eventsLength,0,{type:on,start:t.position,anchorStart:s.anchorStart,anchorEnd:s.anchorEnd,tagStart:s.tagStart,tagEnd:s.tagEnd,style:fn}),o=!0),a=!0,n=!1,r=!1;else{if(!a)return s.anchorStart===Wn&&s.tagStart===Wn||(da(e,t),!1);ua(e,"expected ':' after a mapping key")}}else{if(!a)return s.anchorStart===Wn&&s.tagStart===Wn||(da(e,t),!1);ua(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else o||(na(e,e.position,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,fn),o=!0),63===l?(n&&la(e),a=!0,n=!0):(n||(la(e),a=!0),n=!1),e.position+=1,r=!0;if(Ma(e,t,4,!0,r)&&(r=!1),n||r&&(la(e),r=!1),xa(e,!0),l=e.input.charCodeAt(e.position),(e.line===h||e.lineIndent>t)&&0!==l)ua(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return!!a&&(n&&la(e),o&&ra(e),!0)}function Ma(e,t,i,s,n,a=!0){e.depth>=e.maxDepth&&ua(e,`nesting exceeded maxDepth (${e.maxDepth})`),e.depth++;let o=1,r=!1,l=!1,c=null;const h=ca();let d=4===i||3===i,u=d;const p=d;if(s&&xa(e,!0)&&(r=!0,o=e.lineIndent>t?1:e.lineIndent===t?0:-1),1===o)for(;;){const s=e.input.charCodeAt(e.position),n=ha(e);if(r&&1!==o&&(33===s||38===s))break;if(r&&p&&(h.tagStart!==Wn||h.anchorStart!==Wn)&&(33===s||38===s)){const i=ha(e),s=t+1;if(La(e,e.position-e.lineStart,s,h)&&e.events[i.eventsLength]?.type===on)return e.depth--,!0;da(e,i)}if(r&&(33===s&&h.tagStart!==Wn||38===s&&h.anchorStart!==Wn))break;if(!Oa(e,h,1===i)&&!Ea(e,h))break;null===c&&(c=n),xa(e,!0)?(r=!0,u=p,o=e.lineIndent>t?1:e.lineIndent===t?0:-1):u=!1}if(u&&(u=r||n),1===o||4===i){const s=1===i||2===i?t:t+1,n=e.position-e.lineStart;if(1===o)if(u&&(Fa(e,n,h)||La(e,n,s,h))||function(e,t,i){const s=e.input.charCodeAt(e.position),n=123===s,a=e.position;let o=!0;if(91!==s&&123!==s)return!1;const r=n?125:93;for(n?na(e,a,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,gn):sa(e,a,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,gn),e.position++;0!==e.input.charCodeAt(e.position);){Ia(e,t);let i=e.input.charCodeAt(e.position);if(i===r)return e.position++,ra(e),!0;o?44===i&&ua(e,"expected the node content, but found ','"):ua(e,"missed comma between flow collection entries");let s=!1,a=!1;63===i&&fa(e.input.charCodeAt(e.position+1))&&(s=a=!0,e.position+=1,Ia(e,t));const l=e.line,c=ha(e),h=Ma(e,t,1,!1,!0);Ia(e,t),i=e.input.charCodeAt(e.position),(n||a||e.line===l)&&58===i?(s=!0,e.position++,Ia(e,t),n||aa(e,c),h||la(e),Ma(e,t,1,!1,!0)||la(e),Ia(e,t),n||ra(e)):n&&s?(h||la(e),la(e)):n?la(e):s&&(aa(e,c),h||la(e),la(e),ra(e)),i=e.input.charCodeAt(e.position),44===i?(o=!0,e.position++):o=!1}ua(e,"unexpected end of the stream within a flow collection")}(e,s,h))l=!0;else{const t=e.input.charCodeAt(e.position);if(null!==c&&a&&p&&!u&&124!==t&&62!==t){const t=ha(e),i=c.position-c.lineStart;da(e,c),La(e,i,s,ca())&&e.events[t.eventsLength]?.type===on?l=!0:da(e,t)}!l&&(d&&function(e,t,i){const s=e.input.charCodeAt(e.position);let n=_n,a=-1,o=!1;if(124!==s&&62!==s)return!1;const r=124===s?pn:mn;for(e.position++;0!==e.input.charCodeAt(e.position);){const i=e.input.charCodeAt(e.position),s=va(i);if(43===i||45===i)n!==_n&&ua(e,"repeat of a chomping mode identifier"),n=43===i?yn:vn,e.position++;else{if(!(s>=0))break;0===s&&ua(e,"bad explicit indentation width of a block scalar; it cannot be less than one"),o&&ua(e,"repeat of an indentation width identifier"),a=t+s-1,o=!0,e.position++}}let l=!1;for(;ma(e.input.charCodeAt(e.position));)l=!0,e.position++;l&&35===e.input.charCodeAt(e.position)&&Aa(e),pa(e.input.charCodeAt(e.position))?wa(e):0!==e.input.charCodeAt(e.position)&&ua(e,"a line break is expected");let c=o?a:-1,h=0;const d=e.position;let u=e.position;for(;0!==e.input.charCodeAt(e.position);){const i=e.position;let s=0;for(;32===e.input.charCodeAt(i+s);)s++;const n=e.input.charCodeAt(i+s);if(0===n){c>=0?s>c&&(u=i+s):s>0&&(u=i+s);break}if(ja(e))break;if(!o&&-1===c&&pa(n)&&(h=Math.max(h,s)),o||-1!==c||pa(n)||(9===n&&s<t&&(e.position=i+s,ua(e,"tab characters must not be used in indentation")),s>=t&&s<h&&(e.position=i+s,ua(e,"bad indentation of a mapping entry"))),-1===c&&0!==n&&!pa(n)&&s<t){e.lineIndent=s,e.position=i+s;break}o||0===n||pa(n)||-1!==c||(c=s);const a=-1===c?t+1:c;if(0!==n&&!pa(n)&&s<a){e.lineIndent=s,e.position=i+s;break}Aa(e),u=e.position,pa(e.input.charCodeAt(e.position))&&(wa(e),u=e.position)}return Ca(e,d,u),oa(e,d,u,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,r,n,c),!0}(e,s,h)||function(e,t,i){if(39!==e.input.charCodeAt(e.position))return!1;e.position++;const s=e.position;let n=!0;for(;0!==e.input.charCodeAt(e.position);){const a=e.input.charCodeAt(e.position);if(39===a){if(39===e.input.charCodeAt(e.position+1)){n=!1,e.position+=2;continue}const t=e.position;return e.position++,oa(e,s,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,dn,_n,-1,n),!0}pa(a)?(n=!1,Na(e,t)):e.position===e.lineStart&&ka(e)?ua(e,"unexpected end of the document within a single quoted scalar"):9!==a&&a<32?ua(e,"expected valid JSON character"):e.position++}ua(e,"unexpected end of the stream within a single quoted scalar")}(e,s,h)||function(e,t,i){if(34!==e.input.charCodeAt(e.position))return!1;e.position++;const s=e.position;let n=!0;for(;0!==e.input.charCodeAt(e.position);){const a=e.input.charCodeAt(e.position);if(34===a){const t=e.position;return e.position++,oa(e,s,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,un,_n,-1,n),!0}if(92===a){n=!1;const i=e.input.charCodeAt(++e.position);if(pa(i))Na(e,t);else if($a(i))e.position++;else{let t=ba(i);for(0===t&&ua(e,"unknown escape sequence");t-- >0;)e.position++,ya(e.input.charCodeAt(e.position))<0&&ua(e,"expected hexadecimal character");e.position++}}else pa(a)?(n=!1,Na(e,t)):e.position===e.lineStart&&ka(e)?ua(e,"unexpected end of the document within a double quoted scalar"):9!==a&&a<32?ua(e,"expected valid JSON character"):e.position++}ua(e,"unexpected end of the stream within a double quoted scalar")}(e,s,h)||Ta(e,h)||Pa(e,s,i,h))&&(l=!0)}else 0===o&&(l=u&&Fa(e,n,h))}return d=d&&!l,l||h.anchorStart===Wn&&h.tagStart===Wn&&!d||(oa(e,Wn,Wn,h.anchorStart,h.anchorEnd,h.tagStart,h.tagEnd,hn),l=!0),e.depth--,l||h.anchorStart!==Wn||h.tagStart!==Wn}function Da(e){if(e.lineIndent>0||37!==e.input.charCodeAt(e.position))return!1;e.position++;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!fa(e.input.charCodeAt(e.position));)e.position++;const i=e.input.slice(t,e.position),s=[];for(0===i.length&&ua(e,"directive name must not be less than one character in length");0!==e.input.charCodeAt(e.position)&&!pa(e.input.charCodeAt(e.position));){for(;ma(e.input.charCodeAt(e.position));)e.position++;if(35===e.input.charCodeAt(e.position)||pa(e.input.charCodeAt(e.position))||0===e.input.charCodeAt(e.position))break;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!fa(e.input.charCodeAt(e.position));)e.position++;s.push(e.input.slice(t,e.position))}if(pa(e.input.charCodeAt(e.position))&&wa(e),"YAML"===i){e.directives.some(e=>"yaml"===e.kind)&&ua(e,"duplication of %YAML directive"),1!==s.length&&ua(e,"YAML directive accepts exactly one argument");const t=/^([0-9]+)\.([0-9]+)$/.exec(s[0]);null===t&&ua(e,"ill-formed argument of the YAML directive"),1!==parseInt(t[1],10)&&ua(e,"unacceptable YAML version of the document"),e.directives.push({kind:"yaml",version:s[0]})}else if("TAG"===i){2!==s.length&&ua(e,"TAG directive accepts exactly two arguments");const[t,i]=s;Gn.test(t)||ua(e,"ill-formed tag handle (first argument) of the TAG directive"),Jn.call(e.tagHandlers,t)&&ua(e,`there is a previously declared suffix for "${t}" tag handle`),ta.test(i)||ua(e,"ill-formed tag prefix (second argument) of the TAG directive"),e.tagHandlers[t]=i,e.directives.push({kind:"tag",handle:t,prefix:i})}return!0}function Va(e){e.directives=[],e.tagHandlers=Object.create(null);let t=!1;for(xa(e,!0);Da(e);)t=!0,xa(e,!0);let i=!1,s=!1,n=!0;if(0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)&&ga(e.input.charCodeAt(e.position+3))){i=!0;const t=e.line;e.position+=3,xa(e,!0),n=e.line>t}else t&&ua(e,"directives end mark is expected");const a=e.events.length;if(!i&&e.position===e.lineStart&&46===e.input.charCodeAt(e.position)&&ka(e))return e.position+=3,void xa(e,!0);if(function(e,t,i){e.events.push({type:nn,explicitStart:t,explicitEnd:i,directives:e.directives})}(e,i,!1),Ma(e,e.lineIndent-1,4,!1,n,n)||la(e),xa(e,!0),e.position===e.lineStart&&ka(e)&&(s=46===e.input.charCodeAt(e.position),s)){const t=e.line;e.position+=3,xa(e,!0),e.line===t&&e.position<e.length&&ua(e,"end of the stream or a document separator is expected")}const o=e.events[a];o?.type===nn&&(o.explicitEnd=s),ra(e),!s&&e.position<e.length&&!ja(e)&&ua(e,"end of the stream or a document separator is expected")}var Ra={...ia,...In};function za(e,t={}){const i={...Ra,...t},s=String(e),n=Object.keys(ia),a=Object.keys(In);return function(e,t){const i={...In,...t,events:e,documents:[],eventIndex:0,position:0,frames:[],anchors:new Map,nodeTags:new Map,tagHandlers:Object.create(null),totalMergeKeys:0,aliasCount:0};for(;i.eventIndex<i.events.length;){const e=i.events[i.eventIndex++];switch(i.position=Fn(e),e.type){case nn:i.anchors=new Map,i.nodeTags=new Map,i.aliasCount=0,i.tagHandlers=Object.create(null);for(const t of e.directives)"tag"===t.kind&&(i.tagHandlers[t.handle]=t.prefix);i.frames.push({kind:"document",position:i.position,value:void 0,hasValue:!1});break;case rn:{const{value:t,tag:s}=Dn(i,e);Kn(i,e,t,s,!0),Un(i,t,s);break}case an:{const t=Vn(i,e,"tag:yaml.org,2002:seq"),s=i.schema.lookupSequenceTag(t);s||Ln(i,`unknown sequence tag !<${t}>`);const n=s.create(t),a=Kn(i,e,n,s,s.carrierIsResult);i.frames.push({kind:"sequence",position:i.position,value:n,tag:s,anchor:a,index:0});break}case on:{const t=Vn(i,e,"tag:yaml.org,2002:map"),s=i.schema.lookupMappingTag(t);s||Ln(i,`unknown mapping tag !<${t}>`);const n=s.create(t),a=Kn(i,e,n,s,s.carrierIsResult);i.frames.push({kind:"mapping",position:i.position,value:n,tag:s,anchor:a,key:void 0,keyPosition:i.position,hasKey:!1,keyIsMerge:!1,overridable:null});break}case ln:{-1!==i.maxAliases&&++i.aliasCount>i.maxAliases&&Ln(i,`aliases exceeded maxAliases (${i.maxAliases})`);const t=i.source.slice(e.anchorStart,e.anchorEnd),s=i.anchors.get(t);s||Ln(i,`unidentified alias "${t}"`),s.isValueFinal||Ln(i,`recursive alias "${t}" is not supported for tag ${s.tag.tagName} because it uses finalize()`),Un(i,s.value,s.tag);break}case cn:{const e=i.frames.pop();if("mapping"===e.kind&&e.hasKey&&(i.position=e.keyPosition,Ln(i,"incomplete mapping pair in event stream")),"document"===e.kind)i.documents.push(e.value);else{const t=e.tag.carrierIsResult?e.value:Mn(i,e.position,e.tag,e.value);e.anchor&&(e.anchor.value=t,e.anchor.isValueFinal=!0),Un(i,t,e.tag)}break}}}return i.documents}(function(e,t){const i=e.length,s={...ia,...t,input:`${e}\0`,length:i,position:0,line:0,lineStart:0,lineIndent:0,firstTabInLine:-1,depth:0,directives:[],tagHandlers:Object.create(null),events:[]},n=e.indexOf("\0");for(-1!==n&&sn.throwAt(e,n,"null byte is not allowed in input",s.filename);s.position<s.length&&(Sa(s),xa(s,!0),!(s.position>=s.length));){const e=s.position;Va(s),s.position===e&&ua(s,"can not read a document")}return s.events}(s,Hs(i,n)),{...Hs(i,a),source:s})}function qa(e,t){return!!(e&1<<t)}var Ha={applyQuoteFlowKeysOption:function(e){if(!e.presenterOptions.quoteFlowKeys)return;if(!e.isKey||!e.flowOnly||e.style!==hn)return;e.style=un},doubleQuoteForInvisibles:function(e){e.style===hn&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(e.node.value)&&(e.style=un)},doubleQuoteWhitespaceOnly:function(e){e.style===hn&&/^\s+$/.test(e.node.value)&&(e.style=un)},applyForceQuotesOption:function(e){if(!e.presenterOptions.forceQuotes)return;if(e.isKey||e.style!==hn)return;if(e.node.tag!==e.presenterOptions.schema.defaultScalarTag.tagName)return;e.style=e.node.value.includes("\n")?un:Ua(e)},tryLongOrMultilineAsBlock:function(e){if(e.style!==hn||e.isKey)return;const t=e.node.value,i=-1!==t.indexOf("\n");if(!qa(e.allowedStylesMask,pn))return void(i&&(e.style=un));const s=e.presenterOptions.lineWidth;if(-1===s)return void(i&&(e.style=pn));const n=Math.max(Math.min(s,40),s-e.shiftOfContent);let a=0,o=!1;for(;a<=t.length;){let e=t.length;const i=t.indexOf("\n",a);-1!==i&&(e=i);const s=t.slice(a,e);if(s.length>n&&" "!==s[0]&&/ [^ \t]/.test(s)&&(o=!0),-1===i)break;a=i+1}o?e.style=mn:i&&(e.style=pn)},quoteInvalidPlain:function(e){e.style!==hn||qa(e.allowedStylesMask,hn)||(e.style=Ua(e))},fallbackToDoubleQuoted:function(e){qa(e.allowedStylesMask,e.style)||(e.style=un)}};function Ua(e){return"single"===e.presenterOptions.quoteStyle&&qa(e.allowedStylesMask,dn)?dn:un}Object.keys(Ha).map(e=>Reflect.get(Ha,e));const Ka="tempus2016/decluttering-card-plus",Wa="share-your-templates",Ja=`https://github.com/${Ka}/discussions/new?category=${Wa}`,Ba="decluttering-card-plus-community";function Ya(e){let t=2e4;const i=e=>(t-=1+Math.ceil(e/16))>=0,s=e=>"string"==typeof e?i(e.length):!!i(0)&&(Array.isArray(e)?e.every(s):!e||"object"!=typeof e||Object.entries(e).every(([e,t])=>i(e.length)&&s(t)));return s(e)}const Ga=e=>!!e&&"object"==typeof e&&!Array.isArray(e);function Za(e){if(Ya(e))return JSON.parse(JSON.stringify(e),(e,t)=>"__proto__"===e?void 0:t)}const Qa=/[\p{Cf}\u2800\u3164\u115F\u1160\uFFA0]/gu;function Xa(e){if("string"!=typeof e)return;const t=e.replace(Qa,"").replace(/\s+/g," ").trim();return t?t.length>80?`${t.slice(0,79)}…`:t:void 0}const eo=["card","badge","row","element","group"];function to(e){if(!Ga(e))return{};const t={};for(const[i,s]of Object.entries(e))Ga(s)&&eo.some(e=>void 0!==s[e])&&(t[i]=s);return t}function io(e,t){return"string"==typeof t&&/^https:\/\/github\.com\//.test(t)?t:`https://github.com/${Ka}/discussions/${e}`}function so(e){var t,i,s,n,a;const o=function(e){if("string"!=typeof e||e.length>65536)return;const t=/^ {0,3}(`{3,}|~{3,})[ \t]*([\w-]*)/,i=[];let s;for(const o of function(e){return e.replace(/<!--[\s\S]*?(?:-->|$)/g,"")}(e).split("\n")){if(s){o.trim()===s.fence?(i.push({lang:s.lang,text:s.lines.join("\n")+"\n"}),s=void 0):s.lines.push(o);continue}const e=t.exec(o);e&&(s={fence:e[1],lang:e[2],lines:[]})}const n=i.find(e=>/^ya?ml$/i.test(e.lang)),a=null!=n?n:i.find(e=>""===e.lang);return null==a?void 0:a.text}(null==e?void 0:e.body);if(!o)return;let r;try{if(r=Za(function(e,t){const i=za(e,t);if(0===i.length)throw new sn("expected a document, but the input is empty");if(1===i.length)return i[0];throw new sn("expected a single document in the stream, but found more")}(o,{maxAliases:50})),void 0===r)return}catch(d){return}if(!bi(r).ok)return;if("number"!=typeof(null==e?void 0:e.number))return;const{template:l,includes:c}=r,h=Le(r,["template","includes"]);return delete h.type,"string"!=typeof h.description&&delete h.description,{id:e.number,title:null!==(t=Xa(e.title))&&void 0!==t?t:l,author:"string"==typeof(null===(i=e.user)||void 0===i?void 0:i.login)?e.user.login:"",url:io(e.number,e.html_url),name:l.trim(),template:h,includes:to(c),reactions:"number"==typeof(null===(s=e.reactions)||void 0===s?void 0:s.total_count)?e.reactions.total_count:0,updated:"string"==typeof(null!==(n=e.updated_at)&&void 0!==n?n:e.created_at)?null!==(a=e.updated_at)&&void 0!==a?a:e.created_at:""}}const no=["lock","alarm_control_panel","cover","valve","siren","script","automation","button","input_button","water_heater","lawn_mower","update"],ao=["more-info","navigate","none","assist"],oo=["action","perform_action","service","type"],ro=/\b[a-z][a-z0-9+.-]{1,31}:(?:\/\/)?[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?|\/\/[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?/gi,lo=[/(?:url|image-set|src)\(\s*['"]?([^'")\s{}]+)/gi,/@import\s+(?:url\(\s*)?['"]?([^'")\s;{}]+)/gi],co=/^(?:\/(?!\/)|#|data:)/i,ho=["image","url","url_path","entity_picture","camera_image","image_url","icon_url","src"],uo=/\[\[\[|\{\{|\{%|\$\{/,po=/^\s*(?:javascript|data|vbscript):/i,mo=/position\s*:\s*(?:fixed|absolute)/i,fo=/opacity\s*:\s*0(?:[^.\d]|$)|visibility\s*:\s*hidden|transparent/i,go=e=>"string"==typeof e&&no.includes(e.split(".")[0]),_o=e=>e.replace(/\\/g,"/"),vo="*";function yo(e,t){const i=[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);if(i.length)return i.includes(vo)?[vo]:i;const s=[].concat(null!=t?t:[]).filter(e=>"string"==typeof e);if(!s.length)return[vo];const n=s.map(e=>{const t=e.indexOf("."),i=-1===t?e:e.slice(0,t);return/^[a-z_]+$/.test(i)?i:vo});return n.includes(vo)?[vo]:[...new Set(n)]}function bo(e,t,i=new Set){var s,n,a,o;if(Array.isArray(e))return e.forEach(e=>bo(e,t,i)),i;if(!Ga(e))return i;const r="string"==typeof e.entity?e.entity:t,l=e.action;if("string"==typeof l&&!ao.includes(l)&&!l.includes("[[")&&"perform-action"!==l&&"call-service"!==l&&"fire-dom-event"!==l&&"url"!==l){const t=[].concat(null!==(o=null!==(a=null!==(n=null===(s=e.target)||void 0===s?void 0:s.entity_id)&&void 0!==n?n:e.entity_id)&&void 0!==a?a:r)&&void 0!==o?o:[]);t.length&&!t.some(e=>"string"!=typeof e||e.includes("[["))||i.add(l)}return Object.values(e).forEach(e=>bo(e,r,i)),i}function $o(e,t){const i=eo.find(t=>void 0!==e[t]);if(i)try{return M(t,e,e[i],void 0,void 0,!0)}catch(s){return}}function wo(e){const t=new Set,i=new Set;let s=!1,n=!1,a=!1,o=!1;const r=e=>{const t=_o(e).trim();!t||co.test(t)||t.startsWith("[[")||t.startsWith("{{")||/^[\w.-]+\.[a-z]{2,}(?:[:/?#]|$)/i.test(t)&&i.add(t)},l=new Set,c=(e,i)=>{for(const s of e)if(i.includes(vo))t.add(`${s} *`);else for(const e of i)no.includes(e)&&t.add(`${s} ${e}.*`)},h=(d,u)=>{var p;if("string"==typeof d)return void(e=>{var t;const s=_o(e);for(const n of null!==(t=s.match(ro))&&void 0!==t?t:[])i.add(n);for(const n of lo){n.lastIndex=0;let e=n.exec(s);for(;e;)co.test(e[1])||i.add(e[1]),e=n.exec(s)}uo.test(e)&&(n=!0),mo.test(e)&&fo.test(e)&&(o=!0)})(d);if(Array.isArray(d))return void d.forEach(e=>h(e,u));if(!Ga(d))return;const m="string"==typeof d.entity?d.entity:u;Object.keys(d).some(e=>e.includes("[["))&&(a=!0),oo.some(e=>"string"==typeof d[e]&&d[e].includes("[["))&&(a=!0),"string"==typeof d.action&&((e,s)=>{var a,o,r,l,c,h;const d=e.action;if("perform-action"===d||"call-service"===d){const i=null!==(a=e.perform_action)&&void 0!==a?a:e.service;return void("string"!=typeof i?t.add("?"):i.includes("[[")||t.add(i))}if("fire-dom-event"===d)return void t.add("fire-dom-event");if("url"===d)return i.add("string"==typeof e.url_path?e.url_path:"?"),void("string"==typeof e.url_path&&po.test(e.url_path)&&(n=!0));if(ao.includes(d)||d.includes("[["))return;const u=[].concat(null!==(h=null!==(c=null!==(l=null!==(r=null===(o=e.target)||void 0===o?void 0:o.entity_id)&&void 0!==r?r:e.entity_id)&&void 0!==l?l:e.entity)&&void 0!==c?c:s)&&void 0!==h?h:[]);for(const i of u)go(i)&&t.add(`${d} ${i}`)})(d,m),"iframe"!==d.type&&"webpage"!==d.type||(s=!0);for(const e of ho)"string"==typeof d[e]&&r(d[e]);if("string"==typeof d.type&&ke.includes(d.type)){const t=(t=>{if("string"==typeof t)return t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0})(d.template);if(t){if(D(d.for_each_from)){const e=d.for_each_from,i=eo.map(e=>t[e]).find(e=>void 0!==e);c(bo(i,void 0),yo(e.domain,e.entities))}const e=(f=d.variables,Array.isArray(f)?f.filter(Ga):Ga(f)?Object.entries(f).map(([e,t])=>({[e]:t})):void 0);(null==e?void 0:e.length)&&!l.has(d.template)&&(l.add(d.template),h($o(t,e),void 0),l.delete(d.template))}}var f;if("custom:auto-entities"===d.type&&Ga(d.filter))for(const e of[].concat(null!==(p=d.filter.include)&&void 0!==p?p:[])){if(!Ga(e))continue;const t=yo(e.domain,e.entity_id);c(bo(e.options,void 0),t),c(bo(d.card,void 0),t)}Object.values(d).forEach(e=>h(e,m))},d=[e.template,...Object.values(e.includes)];h(d,void 0);for(const u of d)h($o(u),void 0);return{actions:[...t].sort(),urls:[...i].sort(),embeds:s,scripts:n,placeholders:a,overlay:o}}function xo(e){return e.filter(e=>{var t;return(null===(t=null==e?void 0:e.category)||void 0===t?void 0:t.slug)===Wa}).map(so).filter(e=>!!e).sort((e,t)=>t.reactions-e.reactions||t.updated.localeCompare(e.updated))}class ko extends Error{}function So(e){var t;if(!Ga(e)||"number"!=typeof e.id||"string"!=typeof e.name)return;if(!Ga(e.template))return;const i=Za({template:e.template,includes:e.includes});if(!i||!Ga(i.template))return;if(!bi(Object.assign({template:e.name},i.template)).ok)return;const s=Object.assign({},i.template);return delete s.type,"string"!=typeof s.description&&delete s.description,{id:e.id,title:null!==(t=Xa(e.title))&&void 0!==t?t:e.name,author:"string"==typeof e.author?e.author:"",url:io(e.id,e.url),name:e.name,template:s,includes:to(i.includes),reactions:"number"==typeof e.reactions?e.reactions:0,updated:"string"==typeof e.updated?e.updated:""}}async function jo(e={}){var t,i,s,n;const a=null!==(t=e.fetcher)&&void 0!==t?t:fetch.bind(globalThis),o=null!==(i=e.storage)&&void 0!==i?i:"undefined"==typeof localStorage?void 0:localStorage,r=null!==(s=e.now)&&void 0!==s?s:Date.now(),l=function(e){var t;try{const i=JSON.parse(null!==(t=null==e?void 0:e.getItem(Ba))&&void 0!==t?t:"null");if(!i||!Array.isArray(i.entries)||"number"!=typeof i.fetched)return;return{entries:i.entries.map(So).filter(e=>!!e),fetched:i.fetched}}catch(i){return}}(o);if(l&&!e.refresh&&r-l.fetched<216e5)return l;const c=[];try{for(let e=1;e<=10;e+=1){const t=await a(`https://api.github.com/repos/${Ka}/discussions?per_page=100&page=${e}`,{headers:{Accept:"application/vnd.github+json"}});if(!t.ok){const e=new ko(`GitHub answered ${t.status}`);throw"0"===t.headers.get("x-ratelimit-remaining")&&(e.retryAt=1e3*Number(t.headers.get("x-ratelimit-reset"))||void 0),e}const i=await t.json();if(!Array.isArray(i))break;if(c.push(...i),i.length<100)break}}catch(d){const e=d instanceof ko?d:new ko(null!==(n=null==d?void 0:d.message)&&void 0!==n?n:String(d));throw e.cached=l,e}const h={entries:xo(c),fetched:r};try{null==o||o.setItem(Ba,JSON.stringify(h))}catch(u){}return h}function Ao(e,t){return{discussion:e.id,updated:e.updated,name:t,author:e.author}}function Co(e,t){return Object.assign(Object.assign({},e),{source:t})}function Oo(e,t){return e.map(({name:e,source:i})=>{var s;const n=t.entries.find(e=>e.id===i.discussion),a="string"==typeof i.name?i.name:void 0,o=n?function(e,t){return void 0===t||t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0}(n,a):void 0;if(!n||!o)return Object.assign({name:e,status:"gone"},n?{entry:n}:{});if("string"!=typeof i.author||!i.author||i.author!==n.author)return{name:e,status:"unverified",entry:n};const r=Date.parse(null!==(s=i.updated)&&void 0!==s?s:""),l=Date.parse(n.updated);return{name:e,status:(Number.isFinite(r)?Number.isFinite(l)&&l>r:Number.isFinite(l))?"update":"current",entry:n,latest:Co(o,Ao(n,null!=a?a:n.name))}})}function Eo(e){if(""===e)return[];const t=e.split("\n");return""===t[t.length-1]&&t.pop(),t}function To(e,t){const i=e=>({kind:"remove",text:e}),s=e=>({kind:"add",text:e});if(!e.length||!t.length||e.length*t.length>4e6)return[...e.map(i),...t.map(s)];const n=e.length,a=t.length,o=Array.from({length:n+1},()=>new Uint32Array(a+1));for(let h=n-1;h>=0;h-=1)for(let i=a-1;i>=0;i-=1)o[h][i]=e[h]===t[i]?o[h+1][i+1]+1:Math.max(o[h+1][i],o[h][i+1]);const r=[];let l=0,c=0;for(;l<n&&c<a;)e[l]===t[c]?(r.push({kind:"same",text:e[l]}),l+=1,c+=1):o[l+1][c]>=o[l][c+1]?(r.push(i(e[l])),l+=1):(r.push(s(t[c])),c+=1);for(;l<n;)r.push(i(e[l++]));for(;c<a;)r.push(s(t[c++]));return r}const No=e`<style>
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
</style>`;function Po(e){return"string"==typeof e?e:void 0===e?"":Me(e)}const Io={same:" ",add:"+",remove:"-"};function Fo(t,i,s,a=3){const o=function(e,t){const i=Eo(e),s=Eo(t);let n=0;for(;n<i.length&&n<s.length&&i[n]===s[n];)n+=1;let a=i.length,o=s.length;for(;a>n&&o>n&&i[a-1]===s[o-1];)a-=1,o-=1;const r=i.slice(0,n).map(e=>({kind:"same",text:e})),l=i.slice(a).map(e=>({kind:"same",text:e}));return[...r,...To(i.slice(n,a),s.slice(n,o)),...l]}(Po(t),Po(i));return function(e){return e.some(e=>"same"!==e.kind)}(o)?e`${No}
    <div class="dcp-diff" role="figure" aria-label=${n("diff.label",void 0,s)}>
      ${function(e,t=3){const i=e.map(e=>"same"!==e.kind),s=new Array(e.length).fill(!1);e.forEach((i,n)=>{if("same"!==i.kind)for(let a=Math.max(0,n-t);a<=Math.min(e.length-1,n+t);a+=1)s[a]=!0});const n=[];let a=0;for(;a<e.length;){if(i[a]||s[a]){n.push(e[a]),a+=1;continue}let t=a;for(;t<e.length&&!i[t]&&!s[t];)t+=1;const o=t-a;1===o?n.push(e[a]):n.push({kind:"skip",count:o}),a=t}return n}(o,a).map(t=>function(t,i){return"skip"===t.kind?e`<div class="skip">${n("diff.skipped",{count:t.count},i)}</div>`:e`<div class=${t.kind}>${Io[t.kind]} ${t.text}</div>`}(t,s))}
    </div>`:e`${No}
      <p class="dcp-diff-none">${n("diff.no_change",void 0,s)}</p>`}function Lo(t,i,s){var a,o;const r=null!==(a=JSON.stringify(t))&&void 0!==a?a:"",l=null!==(o=JSON.stringify(i))&&void 0!==o?o:"";return e`
    ${Fo(t,i,s)}
    <ha-expansion-panel outlined>
      <span slot="header">${n("diff.full",void 0,s)}</span>
      <p class="dcp-diff-none">${n("diff.before",void 0,s)}</p>
      ${Ji(r,e`<ha-yaml-editor .hass=${s} .defaultValue=${t} read-only></ha-yaml-editor>`)}
      <p class="dcp-diff-none">${n("diff.after",void 0,s)}</p>
      ${Ji(l,e`<ha-yaml-editor .hass=${s} .defaultValue=${i} read-only></ha-yaml-editor>`)}
    </ha-expansion-panel>
  `}class Mo extends l{constructor(){super(...arguments),this._importParses=!0,this._importErrors=[],this._importArmedAt=0,this._copyState="",this._busy=!1,this._libraryDestination="view",this._communityLoading=!1,this._communityKnownFailed=!1,this._installArmedAt=0,this._postCopyState="",this._updatesLoading=!1,this._updateArmedAt=0,this._trashArmedAt=0}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=V())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:g()}static get styles(){return Ui}_fireConfigChanged(e){h(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return Hi(this,e,t,i)}render(){return this.hass&&this._config?this._renderShare():e``}async _loadTrash(){this.hass&&(this._trash=await De(this.hass))}_renderShare(){const{payload:t,notes:i}=_i(this._config,_(this._savedLovelace));return e`
      <div class="share">
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
          <a href=${Ja} target="_blank" rel="noopener noreferrer"
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
    `}_renderCommunity(){const t=this._community,i=e`
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
      `;const s=this._communityExisting(),a=t.entries.find(e=>e.id===this._communitySelected),o=a?`community:${a.id}:${a.updated}`:"",r=!!a&&this._installPending===o,l=a&&s.includes(a.name)?yi(a.name,s):void 0,c=a?function(e,t){const i=new Set,s=new Set;for(const n of[e.template,...Object.values(e.includes)]){const e=gi(n);e.customTypes.forEach(e=>i.add(e)),e.templateRefs.forEach(e=>s.add(e))}return{customTypes:[...i].sort(),templates:[...s].filter(i=>i!==e.name&&!(i in e.includes)&&!t.includes(i)).sort()}}(a,s):void 0,h=a?Object.keys(a.includes).filter(e=>!s.includes(e)):[],d=a?wo(a):void 0,u=void 0!==this._communityKnown;return e`
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
                ${h.length?e`<p class="hint">
                        ${n("share.library_needs",{names:h.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderMissingCards([a.template,...Object.values(a.includes)])}
                ${c.templates.length?e`<ha-alert alert-type="warning">
                        ${n("share.community_needs_templates",{names:c.templates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
                ${d&&Ri(d)?this._renderRisks(d,"share.community_risks"):e``}
                <ha-expansion-panel outlined expanded>
                  <span slot="header">${n("share.library_preview",void 0,this.hass)}</span>
                  ${Ji(`${a.id}:${a.updated}`,e`<ha-yaml-editor
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
                <ha-button .disabled=${this._busy||!u} @click=${()=>{this._installShared(a)}}>
                  ${u||this._communityKnownFailed?r?n("share.install_anyway",void 0,this.hass):l?n("share.community_install_as",{name:l},this.hass):n("share.install",void 0,this.hass):n("share.community_names_loading",void 0,this.hass)}
                </ha-button>
              `:e``}
        <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!0)}}>
          ${n(this._communityLoading?"share.community_loading":"share.community_refresh",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderRisks(t,i){return e`<ha-alert alert-type="warning" .title=${n(i,void 0,this.hass)}>
      <ul class="risks">
        ${t.actions.length?e`<li>${n("share.community_risk_actions",{list:t.actions.join(", ")},this.hass)}</li>`:e``}
        ${t.urls.length?e`<li>${n("share.community_risk_urls",{list:t.urls.join(", ")},this.hass)}</li>`:e``}
        ${t.embeds?e`<li>${n("share.community_risk_embeds",void 0,this.hass)}</li>`:e``}
        ${t.scripts?e`<li>${n("share.community_risk_scripts",void 0,this.hass)}</li>`:e``}
        ${t.placeholders?e`<li>${n("share.community_risk_placeholders",void 0,this.hass)}</li>`:e``}
        ${t.overlay?e`<li>${n("share.community_risk_overlay",void 0,this.hass)}</li>`:e``}
      </ul>
    </ha-alert>`}async _loadCommunity(e){var t,i;this._communityLoading=!0,this._communityError=void 0,this._installPending=void 0,this._communityKnown=void 0,this._communityKnownFailed=!1;try{this._community=await jo({refresh:e})}catch(s){const e=s;e.cached&&(this._community=e.cached),this._communityError=e.retryAt?n("share.community_rate_limited",{time:new Date(e.retryAt).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)},this.hass):n("share.community_failed",{message:e.message},this.hass)}finally{this._communityLoading=!1}this._community&&this._loadCommunityKnown()}_communityExisting(){var e;const t=Object.keys(_(this._savedLovelace));return[...new Set([...t,...null!==(e=this._communityKnown)&&void 0!==e?e:[]])]}async _loadCommunityKnown(){try{const e=await _e(this.hass,this._savedLovelace);this._communityKnown=Object.keys(e)}catch(e){this._communityKnownFailed=!0}}_communityPicked(e){e.stopPropagation();const t=Number(e.detail.value.entry);this._communitySelected=Number.isFinite(t)&&t>0?t:void 0,this._installPending=void 0}async _installShared(e){var t,i,s,n,a;if(void 0===this._communityKnown)return;const o=`community:${e.id}:${e.updated}`;if(this._installPending!==o)return this._installPending=o,void(this._installArmedAt=Date.now());if(Date.now()-this._installArmedAt<zi)return;const r=V(),l=this._communityExisting(),c=l.includes(e.name)?yi(e.name,l):e.name,h=[...Object.entries(e.includes).filter(([e])=>!l.includes(e)).map(([t,i])=>[t,Co(i,Ao(e,t))]),[c,Co(e.template,Ao(e,e.name))]],d=W(null!==(t=null==r?void 0:r.config)&&void 0!==t?t:this.lovelace,null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""),u=null!==(a=null===(n=null==d?void 0:d.view)||void 0===n?void 0:n.index)&&void 0!==a?a:0;await this._saveDashboard(e=>h.reduce((e,[t,i])=>"root"===this._libraryDestination?Ve(e,t,i):Re(e,u,Object.assign({type:we,template:t},i,{type:we,template:t})),e),"community_install")&&(this._installPending=void 0)}_renderMissingCards(t){const i=function(e,t){const i=new Set;for(const s of e)for(const e of gi(s).customTypes){const s=e.slice(7);s&&!t(s)&&i.add(s)}return[...i].sort()}(t.filter(e=>void 0!==e),Vi);return i.length?e`<ha-alert alert-type="warning">
      ${n(1===i.length?"share.missing_card_one":"share.missing_card_many",{cards:i.join(", ")},this.hass)}
    </ha-alert>`:e``}_renderInstalled(){var t;const i=ze(this._savedLovelace);if(!i.length)return e``;const s=new Map((null!==(t=this._updates)&&void 0!==t?t:[]).map(e=>[e.name,e]));return e`
      <h3>${n("share.installed_header",void 0,this.hass)}</h3>
      <p class="hint">${n("share.installed_hint",void 0,this.hass)}</p>
      ${this._updatesError?e`<ha-alert alert-type="warning">${this._updatesError}</ha-alert>`:e``}
      <ul class="installed">
        ${i.map(({name:t,source:i,template:a})=>{var o,r;const l=s.get(t);return e`<li>
            ${t} —
            <a
              href=${null!==(r=null===(o=null==l?void 0:l.entry)||void 0===o?void 0:o.url)&&void 0!==r?r:`https://github.com/${Ka}/discussions/${i.discussion}`}
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
    `}_renderUpdate(t,i,s){const a=s.latest,o=e=>{const t=Object.assign({},e);return delete t.source,delete t.type,delete t.template,t},r=o(i),l=o(a),c=wo({template:l,includes:{}}),h=function(e,t){return{actions:e.actions.filter(e=>!t.actions.includes(e)),urls:e.urls.filter(e=>!t.urls.includes(e)),embeds:e.embeds&&!t.embeds,scripts:e.scripts&&!t.scripts,placeholders:e.placeholders&&!t.placeholders,overlay:e.overlay&&!t.overlay}}(c,wo({template:r,includes:{}})),d=this._updatePending===t;return e`
      <p class="hint">${n("share.installed_compare",void 0,this.hass)}</p>
      ${Lo(r,l,this.hass)} ${this._renderMissingCards([a])}
      ${Ri(h)?this._renderRisks(h,"share.installed_risks_new"):Ri(c)?this._renderRisks(c,"share.installed_risks"):e``}
      ${d?e`<ha-alert alert-type="warning">
              ${n("share.installed_update_confirm",{name:t},this.hass)}
            </ha-alert>`:e``}
      <ha-button .disabled=${this._busy} @click=${()=>{this._updateShared(t,a)}}>
        ${n(d?"share.installed_update_anyway":"share.installed_update",void 0,this.hass)}
      </ha-button>
    `}async _checkUpdates(){var e,t;this._updatesLoading=!0,this._updatesError=void 0,this._updatePending=void 0;const i=ze(this._savedLovelace);try{this._updates=Oo(i,await jo({refresh:!0}))}catch(s){const i=s;this._updatesError=i.retryAt?n("share.community_rate_limited",{time:new Date(i.retryAt).toLocaleTimeString(null===(t=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===t?void 0:t.language)},this.hass):n("share.community_failed",{message:i.message},this.hass)}finally{this._updatesLoading=!1}}async _updateShared(e,t){var i,s;if(this._updatePending!==e)return this._updatePending=e,void(this._updateArmedAt=Date.now());if(Date.now()-this._updateArmedAt<zi)return;await this._saveDashboard(i=>qe(i,e,t),"shared_update")&&(this._updatePending=void 0,this._updates=null===(i=this._updates)||void 0===i?void 0:i.map(t=>t.name===e?Object.assign(Object.assign({},t),{status:"current"}):t),(null===(s=this._config)||void 0===s?void 0:s.template)===e&&this._fireConfigChanged(Object.assign(Object.assign({},t),{type:this._config.type,template:e})))}_renderLibrary(){var t;const i=Object.keys(_(this._savedLovelace)),s=this._librarySelected?Yi(this._librarySelected):void 0,a=!!s&&i.includes(s.name),o=!!s&&this._installPending===s.name,r=s?Gi(s,i):[];return e`
      <div class="library">
        <ha-form
          .hass=${this.hass}
          .data=${{entry:null!==(t=this._librarySelected)&&void 0!==t?t:""}}
          .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:Bi.map(e=>({value:e.name,label:e.name}))}}}]}
          .computeLabel=${()=>n("share.library_pick",void 0,this.hass)}
          @value-changed=${this._libraryPicked}
        ></ha-form>
        ${s?e`
                <p class="hint">${n(`library.${s.name}.summary`,void 0,this.hass)}</p>
                ${r.length?e`<p class="hint">
                        ${n("share.library_needs",{names:r.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderMissingCards([s,...r.map(e=>Yi(e))].map(e=>null==e?void 0:e.template))}
                <ha-expansion-panel outlined>
                  <span slot="header">${n("share.library_preview",void 0,this.hass)}</span>
                  ${Ji(s.name,e`<ha-yaml-editor
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
    `}_libraryDestinationPicked(e){e.stopPropagation();const t=e.detail.value.where;this._libraryDestination="root"===t?"root":"view"}_libraryPicked(e){e.stopPropagation(),this._librarySelected=e.detail.value.entry||void 0,this._installPending=void 0}async _install(e){var t,i,s,n,a,o;const r=Yi(e);if(!r)return;if(this._installPending!==e)return void(this._installPending=e);const l=V(),c=Object.keys(_(null!==(t=null==l?void 0:l.config)&&void 0!==t?t:this._savedLovelace)),h=[...Gi(r,c),r.name].filter(e=>!c.includes(e)),d=W(null!==(i=null==l?void 0:l.config)&&void 0!==i?i:this.lovelace,null!==(n=null===(s=this._config)||void 0===s?void 0:s.template)&&void 0!==n?n:""),u=null!==(o=null===(a=null==d?void 0:d.view)||void 0===a?void 0:a.index)&&void 0!==o?o:0;await this._saveDashboard(e=>h.reduce((e,t)=>{const i=Yi(t);if(!i)return e;const s=Object.assign(Object.assign({},i.template),{source:Zi(i.name,Ye)});return"root"===this._libraryDestination?Ve(e,i.name,s):Re(e,u,Object.assign({type:we,template:i.name},s))},e),"library_install")&&(this._installPending=void 0)}async _copyExport(){const e=this.renderRoot.querySelector("#export"),t=null==e?void 0:e.yaml;if(!t)return;const{notes:i}=_i(this._config),s=[...i.map(e=>`# ${e}`),t].join("\n");this._copyState=await He(s)?"done":"failed",setTimeout(()=>this._copyState="",3e3)}async _copyPost(){var e,t;const i=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!i)return;const{notes:s}=_i(this._config,_(this._savedLovelace));this._postCopyState=await He(function(e,t,i){return[...[i,...t].filter(e=>"string"==typeof e&&e.trim()),"```yaml\n"+e.replace(/\n*$/,"")+"\n```"].join("\n\n")+"\n"}(i,s,null===(t=this._config)||void 0===t?void 0:t.description))?"done":"failed",setTimeout(()=>this._postCopyState="",3e3)}_downloadExport(){var e,t,i;const s=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!s)return;const{notes:n}=_i(this._config),a=[...n.map(e=>`# ${e}`),s].join("\n"),o=document.createElement("a");o.href=URL.createObjectURL(new Blob([a],{type:"text/yaml"})),o.download=`${(null!==(i=null===(t=this._config)||void 0===t?void 0:t.template)&&void 0!==i?i:"template").replace(/[^\w-]+/g,"_")}.yaml`,o.click(),setTimeout(()=>URL.revokeObjectURL(o.href),1e3)}async _importFile(e){var t,i,s;const a=e.target,o=null===(t=a.files)||void 0===t?void 0:t[0];if(a.value="",!o)return;const r=await o.text(),l=null===(s=null===(i=this.renderRoot.querySelector("#import"))||void 0===i?void 0:i.shadowRoot)||void 0===s?void 0:s.querySelector("ha-code-editor");l?(l.value=r,l.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r}}))):this._importErrors=[n("share.import_not_yaml",void 0,this.hass)]}_renderTrash(){if(void 0===this._trash)return this._loadTrash(),e``;const t=e=>{var t,i;return new Date(e).toLocaleString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)};return e`
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
    `}async _restore(e,t){var i,s;if(!this.hass)return;const a=Ue(this.hass);let o;try{o=await Ke(a,e.dashboard)}catch(l){return void(this._toolError=n("tools.save_failed",{message:null!==(i=null==l?void 0:l.message)&&void 0!==i?i:l},this.hass))}const r=e.name in _(o);if(r&&this._trashPending!==t)return this._trashPending=t,void(this._trashArmedAt=Date.now());if(!(r&&Date.now()-this._trashArmedAt<zi)){this._busy=!0,this._toolError=void 0;try{await z(this,this.hass,"restore",[{urlPath:e.dashboard,build:t=>We(t,e)}]),this._trashPending=void 0,this._trashShown=void 0,await this._forget(e)}catch(l){this._toolError=n("tools.save_failed",{message:null!==(s=null==l?void 0:l.message)&&void 0!==s?s:l},this.hass)}finally{this._busy=!1}}}async _forget(e){if(!this.hass)return;const t=Je(await De(this.hass),e);await Be(this.hass,t),this._trash=t,this._trashPending=void 0}_importChanged(e){e.stopPropagation(),this._importValue=e.detail.value,this._importParses=!1!==e.detail.isValid,this._importErrors=[],this._importClash=void 0,this._importRisks=void 0}_import(){if(!this._config)return;if(!this._importParses)return void(this._importErrors=[n("share.import_not_yaml",void 0,this.hass)]);if(!Ya(this._importValue))return void(this._importErrors=[n("share.import_too_big",void 0,this.hass)]);const e=bi(this._importValue);if(!e.ok)return this._importErrors=e.errors,void(this._importClash=void 0);this._importErrors=[];const t=this._importValue.template,i=_(this._savedLovelace),s=t!==this._config.template&&t in i?t:void 0,a=wo({template:this._importValue,includes:{}});if(s&&!this._importClash||Ri(a)&&!this._importRisks)return this._importClash=s,this._importRisks=Ri(a)?a:void 0,void(this._importArmedAt=Date.now());Date.now()-this._importArmedAt<zi||this._applyImport(t)}_importAsCopy(){if(!this._config||!this._importParses)return;if(Date.now()-this._importArmedAt<zi)return;const e=Object.keys(_(this._savedLovelace));this._applyImport(yi(this._importValue.template,e))}_applyImport(e){var t;const i=function(e){const t=vi(e);if((null==t?void 0:t.includes)&&"object"==typeof t.includes&&!Array.isArray(t.includes)){const e={};for(const[i,s]of Object.entries(t.includes))e[i]=vi(s);t.includes=e}return t}(this._importValue),s=i.includes;if(s&&"object"==typeof s&&!Array.isArray(s)){const e=Object.keys(_(this._savedLovelace)),t=Object.entries(s).filter(([t])=>!e.includes(t));t.length&&this._saveDashboard(e=>t.reduce((e,[t,i])=>Ve(e,t,i),e),"import",this._config)}const n=Object.assign(Object.assign({},i),{template:e,type:null===(t=this._config)||void 0===t?void 0:t.type});delete n.includes,this._fireConfigChanged(n),this._importClash=void 0,this._importRisks=void 0,this.dispatchEvent(new CustomEvent("select-tab",{detail:"settings",bubbles:!0,composed:!0}))}}a([o({attribute:!1})],Mo.prototype,"hass",void 0),a([o({attribute:!1})],Mo.prototype,"lovelace",void 0),a([o({attribute:!1})],Mo.prototype,"config",void 0),a([r()],Mo.prototype,"_importErrors",void 0),a([r()],Mo.prototype,"_importClash",void 0),a([r()],Mo.prototype,"_importRisks",void 0),a([r()],Mo.prototype,"_copyState",void 0),a([r()],Mo.prototype,"_toolError",void 0),a([r()],Mo.prototype,"_busy",void 0),a([r()],Mo.prototype,"_installPending",void 0),a([r()],Mo.prototype,"_librarySelected",void 0),a([r()],Mo.prototype,"_libraryDestination",void 0),a([r()],Mo.prototype,"_community",void 0),a([r()],Mo.prototype,"_communityLoading",void 0),a([r()],Mo.prototype,"_communityError",void 0),a([r()],Mo.prototype,"_communitySelected",void 0),a([r()],Mo.prototype,"_communityKnown",void 0),a([r()],Mo.prototype,"_communityKnownFailed",void 0),a([r()],Mo.prototype,"_postCopyState",void 0),a([r()],Mo.prototype,"_updates",void 0),a([r()],Mo.prototype,"_updatesLoading",void 0),a([r()],Mo.prototype,"_updatesError",void 0),a([r()],Mo.prototype,"_updatePending",void 0),a([r()],Mo.prototype,"_trash",void 0),a([r()],Mo.prototype,"_trashShown",void 0),a([r()],Mo.prototype,"_trashPending",void 0),customElements.get("decluttering-template-share-tab")||customElements.define("decluttering-template-share-tab",Mo);const Do=["card","badge","row","element"];function Vo(e,t,i=[]){if(Array.isArray(e))e.forEach((e,s)=>Vo(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,n]of Object.entries(e))Vo(n,t?`${t}.${s}`:s,i);else null!=e&&i.push({path:t,value:String(e)});return i}const Ro=["grid_options","visibility","view_layout","layout_options"];function zo(e){const t={};for(const[i,s]of Object.entries(null!=e?e:{}))Ro.includes(i)||(t[i]=s);return t}function qo(e){if(Array.isArray(e))return e.map(qo);if(e&&"object"==typeof e){const t={};for(const i of Object.keys(e).sort())t[i]=qo(e[i]);return t}return 0}function Ho(e,t=[],i=[]){if(Array.isArray(e))e.forEach((e,s)=>Ho(e,[...t,s],i));else if(e&&"object"==typeof e)for(const[s,n]of Object.entries(e))Ho(n,[...t,s],i);else i.push({path:t,value:e});return i}function Uo(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}function Ko(e){const t=new Map;e.forEach((e,i)=>{var s;if(!e||"object"!=typeof e||"string"!=typeof e.type)return;const n=zo(e);if(JSON.stringify(n).includes("[["))return;const a=JSON.stringify([e.type,qo(n)]);t.set(a,[...null!==(s=t.get(a))&&void 0!==s?s:[],i])});const i=[];for(const[s,n]of t){if(n.length<2)continue;const t=n.map(t=>zo(e[t])),a=Ho(t[0]).map(e=>e.path).filter(e=>t.some(i=>JSON.stringify(Uo(i,e))!==JSON.stringify(Uo(t[0],e))));!a.length||a.length>8||i.push({indices:n,type:e[n[0]].type,differing:a,key:s})}return i.sort((e,t)=>t.indices.length-e.indices.length||e.indices[0]-t.indices[0])}const Wo=e=>e.replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value";function Jo(e){const t=e[e.length-1];if("string"==typeof t)return Wo(t);const i=[...e].reverse().find(e=>"string"==typeof e);return Wo(`${null!=i?i:"item"}_${t+1}`)}function Bo(e){const t=e.map(Jo),i=[];return e.forEach((e,s)=>{const n=(a=t[s],t.filter(e=>e===a).length>1?function(e){return Wo(e.map(e=>"number"==typeof e?String(e+1):e).join("_"))}(e):t[s]);var a;i.push(yi(n,i))}),i}function Yo(e){var t;const i=e.map(zo),s=null!==(t=i[0])&&void 0!==t?t:{},n=Ho(s).map(e=>e.path).filter(e=>i.some(t=>JSON.stringify(Uo(t,e))!==JSON.stringify(Uo(s,e)))),a=Bo(n),o=JSON.parse(JSON.stringify(s));return n.forEach((e,t)=>{Uo(o,e.slice(0,-1))[e[e.length-1]]=`[[${a[t]}]]`}),{template:{card:o},names:a,variables:i.map(e=>n.map((t,i)=>({[a[i]]:Uo(e,t)}))),layout:e.map(e=>{const t={};for(const i of Ro)void 0!==(null==e?void 0:e[i])&&(t[i]=e[i]);return t})}}function Go(e,t,i){return Object.assign({type:"custom:decluttering-card-plus",template:e,variables:t},i)}const Zo="_";function Qo(e){let t="string"==typeof e?e:JSON.stringify(e);if("string"!=typeof t||!t.includes("[["))return[];const i=new Set;for(let s=0;s<5;s+=1){let e=!1;if(t=t.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(t,s)=>{if(e=!0,s.startsWith(Oe))return Zo;const n=s.endsWith("?")?s.slice(0,-1):s,[a,...o]=n.split("|"),r=a.endsWith("?")?a.slice(0,-1):a;for(const e of[r,r.split(".")[0]])e&&e!==Zo&&i.add(e);for(const e of o){const t=e.startsWith("or:")?e.slice(3):Ne(e);t&&t!==Zo&&i.add(t)}return Zo}),!e)break}return[...i]}function Xo(e,t=[]){if(Array.isArray(e)){for(const i of e)Xo(i,t);return t}if(!e||"object"!=typeof e)return t;ke.includes(e.type)&&!0===e[tt]&&"string"==typeof e.template&&t.push(e.template);for(const i of Object.values(e))Xo(i,t);return t}function er(e,t,i=new Set){const s=new Set;if(!e)return{names:s,complete:!0};et in e&&(e=Object.assign(Object.assign({},e),{default:e[et]}));for(const a of y(e))s.add(a.name);for(const a of ce(be(e))){const e=O(a);void 0!==e&&s.add(e)}for(const a of Qo(e))s.add(a);let n=!0;for(const a of Xo(e)){if(i.has(a))continue;if(i.add(a),!Object.prototype.hasOwnProperty.call(t,a)){n=!1;continue}const e=er(t[a],t,i);for(const t of e.names)s.add(t);e.complete||(n=!1)}return{names:s,complete:n}}function tr(e,t){const i=new Map,s=(e,t,s,n)=>{const a=JSON.stringify([e.index,t,n.name,s]),o=i.get(a);o?(o.count+=1,!o.closest&&n.closest&&(o.closest=n.closest)):i.set(a,Object.assign(Object.assign({view:e,template:t,name:n.name},n.closest?{closest:n.closest}:{}),{where:s,count:1}))},n=(e,i,a)=>{var o,r;if(Array.isArray(e))for(const t of e)n(t,i,a);else if(e&&"object"==typeof e){if(ke.includes(e.type)&&"string"==typeof e.template){const n=Object.prototype.hasOwnProperty.call(t,e.template)?t[e.template]:void 0;if(n){const l=new Set,c=(o,r)=>{for(const c of function(e,t,i,s={lets:[],defaults:[]},n){if(!e)return[];const{names:a,complete:o}=er(e,t);if(!o)return[];const r=new Set([...ce(e.let),...s.lets].map(O).filter(e=>void 0!==e)),l=j(i),c=new Set(a);for(const g of Qo(n))c.add(g);for(const g of[...s.lets,...s.defaults]){const e=O(g);if(void 0!==e)for(const t of Qo(g[e]))c.add(t)}const h=e=>!r.has(e)&&(c.has(e)||c.has(e.split(".")[0]));let d=!0;const u=new Set;for(;d;){d=!1;for(const e of l){const t=O(e);if(!u.has(t)&&h(t)){u.add(t);for(const i of Qo(e[t]))c.has(i)||(c.add(i),d=!0)}}}const p=new Set(l.map(e=>O(e))),m=[...c].filter(e=>!p.has(e)&&!r.has(e)),f=[];for(const g of p){if(h(g))continue;const e=Ce(g,m);f.push(e?{name:g,closest:e}:{name:g})}return f}(n,t,r,a,[e.on_error,e.for_each_from]))l.has(c.name)||(l.add(c.name),s(i,e.template,o,c))};c("variables",e.variables);for(const t of null!==(o=E(e.for_each))&&void 0!==o?o:[])c("for_each",t);const h=null===(r=e.for_each_from)||void 0===r?void 0:r.overrides;if(h&&"object"==typeof h)for(const e of Object.values(h))c("overrides",e)}}for(const t of Object.values(e))n(t,i,a)}};return Qe(e,(t,i,s)=>{var a,o,r;const l=e.views[i];n(t,{title:null!==(o=null!==(a=null==l?void 0:l.title)&&void 0!==a?a:null==l?void 0:l.path)&&void 0!==o?o:"",path:null!==(r=null==l?void 0:l.path)&&void 0!==r?r:"",index:i},Xe(e,i,s))}),[...i.values()].map(({view:e,template:t,name:i,closest:s,where:n,count:a})=>s?{view:e,template:t,name:i,closest:s,where:n,count:a}:{view:e,template:t,name:i,where:n,count:a})}function ir(e,t,i){if(!e.includes("[["))return e;const s=e.replace(/\[\[([^[\]]+)\]\]/g,(e,s)=>s.startsWith(Oe)?e:`[[${function(e,t,i){const s=e.endsWith("?"),n=(s?e.slice(0,-1):e).split("|"),a=n[0],o=a.endsWith("?"),r=o?a.slice(0,-1):a;(r===t||r.startsWith(`${t}.`))&&(n[0]=`${i}${r.slice(t.length)}${o?"?":""}`);for(let l=1;l<n.length;l+=1){const e=n[l];if(e===`or:${t}`)n[l]=`or:${i}`;else if(Ne(e)===t){const s=e.startsWith("if:!")?"!":"";n[l]=`if:${s}${i}${e.slice(3+s.length+t.length)}`}}return`${n.join("|")}${s?"?":""}`}(s,t,i)}]]`);return s.replace(new RegExp(`\\[\\[${n=t,n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=\\.\\[\\[)`,"g"),`[[${i}`);var n}function sr(e,t,i){if("string"==typeof e)return ir(e,t,i);if(Array.isArray(e))return e.map(e=>sr(e,t,i));if(e&&"object"==typeof e){const s={};for(const[n,a]of Object.entries(e))s[ir(n,t,i)]=sr(a,t,i);return s}return e}function nr(e,t,i){const s=e=>!!e&&"object"==typeof e&&!Array.isArray(e),n=(e,t)=>s(e)&&Object.prototype.hasOwnProperty.call(e,t),a=e=>{if(!s(e))return e;const n={};for(const[s,a]of Object.entries(e))s!==i&&(n[s===t?i:s]=a);return n};return Array.isArray(e)?e.some(e=>n(e,t))?e.map(a).filter(e=>!s(e)||Object.keys(e).length>0):e:n(e,t)?a(e):e}function ar(e,t,i){const s=sr(e,t,i);return Array.isArray(s.variables)?s.variables=s.variables.map(e=>e&&"object"==typeof e&&e.name===t?Object.assign(Object.assign({},e),{name:i}):e):s.variables&&"object"==typeof s.variables&&(s.variables=nr(s.variables,t,i)),void 0!==s.default&&(s.default=nr(s.default,t,i)),void 0!==s.defaults&&(s.defaults=nr(s.defaults,t,i)),void 0!==s.let&&(s.let=nr(s.let,t,i)),s}function or(e){const t=null==e?void 0:e.extends;return(Array.isArray(t)?t:[t]).filter(e=>"string"==typeof e)}function rr(e,t,i){const s=Ge(e),n=new Set([t]);for(const o of null!=i?i:[])Object.prototype.hasOwnProperty.call(s,o)||n.add(o);let a=!0;for(;a;){a=!1;for(const[e,t]of Object.entries(s))!n.has(e)&&or(t).some(e=>n.has(e))&&(n.add(e),a=!0)}return n}function lr(e){if(!e)return[];const t=new Set(Li(e));for(const i of Qo(e))i.includes(".")||"_"===i||t.add(i);return[...t].sort()}function cr(e,t,i,s,n){const a=rr(e,t,n);let o=0,r=0;const l=(e,t)=>JSON.stringify(e)!==JSON.stringify(t),c=e=>{if(Array.isArray(e))return e.map(c);if(!e||"object"!=typeof e)return e;let t={};for(const[i,s]of Object.entries(e))t[i]=c(s);if(ke.includes(e.type)&&a.has(e.template)){const e=function(e,t,i){var s;const n=Object.assign({},e);void 0!==n.variables&&(n.variables=nr(n.variables,t,i)),Array.isArray(n.for_each)?n.for_each=n.for_each.map(e=>nr(e,t,i)):void 0!==n.for_each&&(n.for_each=nr(n.for_each,t,i));const a=null===(s=n.for_each_from)||void 0===s?void 0:s.overrides;if(a&&"object"==typeof a&&!Array.isArray(a)){const e={};for(const[s,n]of Object.entries(a))e[s]=nr(n,t,i);n.for_each_from=Object.assign(Object.assign({},n.for_each_from),{overrides:e})}return"string"==typeof n.name&&(n.name=ir(n.name,t,i)),n}(t,i,s);l(e,t)&&(o+=1),t=e}if(Ze(e.type)&&a.has(e.template)){const e=ar(t,i,s);l(e,t)&&(r+=1),t=e}return t},h=Object.assign({},e);Array.isArray(null==e?void 0:e.views)&&(h.views=c(e.views));const d=null==e?void 0:e.decluttering_templates;if(d&&"object"==typeof d){const e={};for(const[t,n]of Object.entries(d)){let o=c(n);if(a.has(t)){const e=ar(o,i,s);l(e,o)&&(r+=1),o=e}e[t]=o}h.decluttering_templates=e}return{config:h,cards:o,templates:r}}function hr(e,t,i){if(Object.prototype.hasOwnProperty.call(Ge(e),t))return!1;if(i===it)return!0;const s=st(e);return s.includes(i)||s.includes("*")}class dr extends l{constructor(){super(...arguments),this._renameTo="",this._renaming=!1,this._duplicateTo="",this._busy=!1,this._modernisePending=!1,this._similarNames={},this._searchQuery="",this._searching=!1,this._varTo=""}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=V())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:g()}static get styles(){return Ui}_fireConfigChanged(e){h(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return Hi(this,e,t,i)}render(){return this.hass&&this._config?this._renderUsages():e``}_renderUsages(){var t,i;const s=null===(t=this._config)||void 0===t?void 0:t.template;if(!s)return e``;const a=this._savedLovelace;if(!a)return e`<div class="usages">
        <ha-alert alert-type="warning">${n("template_editor.usages_unreadable",void 0,this.hass)}</ha-alert>
      </div>`;(null===(i=this._usages)||void 0===i?void 0:i.name)===s&&this._usages.ll===a||(this._usages={name:s,ll:a,usages:nt(a,s)});const{views:o,templates:r}=this._usages.usages,l=o.reduce((e,t)=>e+t.count,0),c=document.location.pathname.split("/").slice(0,2).join("/");return e`
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
    `}_renderUndo(){var t,i;const s=at();if(!s)return e``;const a=ot(s.operation,this.hass),o=new Date(s.at).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language);return e`
      <div class="undo">
        <p class="hint">${n("undo.held",{operation:a,time:o},this.hass)}</p>
        ${this._undoChanged?e`<ha-alert alert-type="warning">
                ${n("undo.changed_here",{operation:a,dashboards:this._undoChanged.join(", ")},this.hass)}
              </ha-alert>`:e``}
        <ha-button .disabled=${this._busy} @click=${this._undo}>
          ${n(this._undoChanged?"undo.anyway_button":"undo.button",{operation:a},this.hass)}
        </ha-button>
      </div>
    `}async _undo(){const e=at();if(e){this._busy=!0;try{const t=await rt(this,this.hass,e,!!this._undoChanged,!1);this._undoChanged="changed"===(null==t?void 0:t.result)?t.dashboards:void 0}finally{this._busy=!1}}}_renderSimilar(t){var i;if((null===(i=this._similar)||void 0===i?void 0:i.ll)!==t){const e=lt(t);this._similar={ll:t,cards:e,groups:Ko(e.map(e=>e.config))}}const{cards:s,groups:a}=this._similar;if(!a.length)return e``;const o=Object.keys(_(t));return e`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${n(1===a.length?"tools.similar_header_one":"tools.similar_header",{count:a.length},this.hass)}
        </span>
        <p class="hint">${n("tools.similar_hint",{max:8},this.hass)}</p>
        ${a.slice(0,10).map(e=>this._renderSimilarGroup(e,s,o))}
      </ha-expansion-panel>
    `}_renderSimilarGroup(t,i,s){var a;const o=t.indices.map(e=>i[e]),r=Yo(o.map(e=>e.config)),l=(null!==(a=this._similarNames[t.key])&&void 0!==a?a:function(e,t,i=[]){let s=Wo(e.replace(/^custom:/,"").replace(/-/g,"_")).toLowerCase();/(^|_)card$/.test(s)||(s=`${s}_card`);const n=new Set(i.map(e=>"string"==typeof(null==e?void 0:e.entity)&&e.entity.includes(".")?e.entity.split(".")[0]:"")),[a]=[...n];return 1===n.size&&a&&(s=`${Wo(a).toLowerCase()}_${s}`),yi(s,t)}(t.type,s,o.map(e=>e.config))).trim(),c=this._similarPending===`${t.key}\0${l}`,h=s.includes(l);return e`
      <div class="similar">
        <h3>${n("tools.similar_group",{count:o.length,type:t.type},this.hass)}</h3>
        <p class="hint">${n("tools.similar_differ",{names:r.names.join(", ")},this.hass)}</p>
        <ul>
          ${o.slice(0,8).map(t=>e`<li>${t.label}</li>`)}
        </ul>
        ${o.length>8?e`<p class="hint">
                ${n("editor.matches_more",{count:o.length-8},this.hass)}
              </p>`:e``}
        ${h?e`<ha-alert alert-type="error">${n("tools.name_taken",{name:l},this.hass)}</ha-alert>`:e``}
        ${c?e`
                <ha-alert alert-type="warning">
                  ${n("tools.similar_confirm",{name:l,count:o.length},this.hass)}
                </ha-alert>
                <p class="hint">${n("tools.similar_template",{name:l},this.hass)}</p>
                ${Ji(`${t.key}\0${l}`,e`<ha-yaml-editor
                    .hass=${this.hass}
                    .defaultValue=${{[l]:r.template}}
                    read-only
                  ></ha-yaml-editor>`)}
                <p class="hint">${n("tools.similar_first_card",void 0,this.hass)}</p>
                ${Fo(o[0].config,Go(l,r.variables[0],r.layout[0]),this.hass)}
              `:e``}
        ${qi({label:n("tools.similar_name",void 0,this.hass),value:l,disabled:this._busy,onInput:e=>{this._similarNames=Object.assign(Object.assign({},this._similarNames),{[t.key]:e}),this._similarPending=void 0}})}
        <ha-button
          .disabled=${this._busy||!l||h}
          @click=${()=>{this._makeTemplate(t,o,l)}}
        >
          ${n(c?"tools.similar_make_anyway":"tools.similar_make",void 0,this.hass)}
        </ha-button>
      </div>
    `}async _makeTemplate(e,t,i){const s=`${e.key}\0${i}`;if(this._similarPending!==s)return void(this._similarPending=s);const n=await this._saveDashboard(e=>function(e,t,i){const{template:s,variables:n,layout:a}=Yo(t);let o=Ve(e,i,s);return t.forEach((e,t)=>{o=U(o,e,Go(i,n[t],a[t]))}),o}(e,t.map(e=>e.config),i),"make_template");if(n){this._similarPending=void 0;const t=Object.assign({},this._similarNames);delete t[e.key],this._similarNames=t}}_renderElsewhere(t){var i;if((null===(i=this._remoteUsages)||void 0===i?void 0:i.name)!==t){this._remoteUsages={name:t,list:[]};const e=document.location.pathname.split("/").filter(Boolean)[0];ct(this.hass,t,e).then(e=>{var i;(null===(i=this._remoteUsages)||void 0===i?void 0:i.name)===t&&(this._remoteUsages={name:t,list:e})})}const s=this._remoteUsages.list;if(!s.length)return e``;const a=s.map(e=>`${e.urlPath} (${e.total})`).join(", ");return e`<ha-alert alert-type="info">
      ${n("template_editor.usages_elsewhere",{list:a},this.hass)}
    </ha-alert>`}_renderImpact(t,i){const s=ht(t,i);if(!s||!this._config)return e``;const a=e=>{if(e)return M(s.variables,e,I(e),i,this.hass,!0)};let o,r;try{o=a(_(t)[i]),r=a(_(t,void 0,this._config)[i])}catch(l){return e``}return e`
      <ha-expansion-panel outlined>
        <span slot="header">${n("template_editor.impact_header",void 0,this.hass)}</span>
        <p class="hint">${n("template_editor.impact_diff_hint",void 0,this.hass)}</p>
        ${Lo(o,r,this.hass)}
      </ha-expansion-panel>
    `}_renderRename(t,i){const s=this._renameTo.trim(),a=!!s&&this._renamePending===s,o=i?1===i?n("tools.rewrites_one",void 0,this.hass):n("tools.rewrites_many",{count:i},this.hass):"";return e`
      <div class="rename">
        <h3>${n("tools.rename_header",void 0,this.hass)}</h3>
        <p class="hint">${n("tools.rename_hint",void 0,this.hass)}</p>
        ${this._renameError?e`<ha-alert alert-type="error">${this._renameError}</ha-alert>`:e``}
        ${a?e`<ha-alert alert-type="warning">
                ${n("tools.rename_confirm",{from:t,to:s,rewrites:o},this.hass)}
              </ha-alert>`:e``}
        ${qi({label:n("tools.new_name",void 0,this.hass),value:this._renameTo,disabled:this._renaming,onInput:e=>this._renameChanged(e)})}
        <ha-button .disabled=${this._renaming||!s||s===t} @click=${this._rename}>
          ${a?n("tools.rename_anyway",void 0,this.hass):1===i?n("tools.rename_update_one",void 0,this.hass):i?n("tools.rename_update_many",{count:i},this.hass):n("tools.rename",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderModernise(){const t=this._savedLovelace,i=t?dt(t):0;return i?e`
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
    `:e``}async _modernise(){if(!this._modernisePending)return void(this._modernisePending=!0);await this._saveDashboard(e=>ut(e),"modernise")&&(this._modernisePending=!1)}_renameChanged(e){this._renameTo=e,this._renameError=void 0,this._renamePending=void 0}async _rename(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._renameTo.trim();if(!i||!s||s===i)return;const a=V();if(a)if(void 0===_(a.config)[s])if(this._renamePending===s){this._renaming=!0,this._renameError=void 0;try{await z(this,this.hass,"rename_template",[{urlPath:H(),build:e=>pt(e,i,s)}],this._config),this._undoChanged=void 0,this._fireConfigChanged(Object.assign(Object.assign({},this._config),{template:s})),this._renameTo="",this._renamePending=void 0}catch(o){this._renameError=n("tools.save_failed",{message:null!==(t=null==o?void 0:o.message)&&void 0!==t?t:o},this.hass)}finally{this._renaming=!1}}else this._renamePending=s;else this._renameError=n("tools.name_taken",{name:s},this.hass);else this._renameError=n("tools.cannot_rename_here",void 0,this.hass)}_renderSearch(){const t=this._searchQuery.trim(),i=this._searchResult,s=e=>"variables"===e.where?"":n(`tools.search_in_${e.where}`,void 0,this.hass),a=e=>e.view.title||e.view.path||n("template_editor.untitled_view",void 0,this.hass);return e`
      <div class="rename">
        <h3>${n("tools.search_header",void 0,this.hass)}</h3>
        <p class="hint">${n("tools.search_hint",void 0,this.hass)}</p>
        ${qi({label:n("tools.search_label",void 0,this.hass),value:this._searchQuery,onInput:e=>{this._searchQuery=e},onKeydown:e=>{"Enter"===e.key&&this._search()}})}
        <ha-button .disabled=${this._searching||!t} @click=${()=>{this._search()}}>
          ${n(this._searching?"tools.searching":"tools.search",void 0,this.hass)}
        </ha-button>
        ${!i||i.cards.length||i.templates.length?e``:e`<p class="hint">${n("tools.search_none",{query:i.query},this.hass)}</p>`}
        ${(null==i?void 0:i.cards.length)?e`
                <p class="hint">${n("tools.search_cards",{count:i.cards.length},this.hass)}</p>
                <ul>
                  ${i.cards.slice(0,Di).map(t=>e`
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
                ${i.cards.length>Di?e`<p class="hint">
                        ${n("editor.matches_more",{count:i.cards.length-Di},this.hass)}
                      </p>`:e``}
              `:e``}
        ${(null==i?void 0:i.templates.length)?e`
                <p class="hint">${n("tools.search_templates",{count:i.templates.length},this.hass)}</p>
                <ul>
                  ${i.templates.slice(0,Di).map(t=>e`<li>
                          ${t.urlPath} › ${t.template}: <code>${t.path}</code> = ${t.value}
                        </li>`)}
                </ul>
                ${i.templates.length>Di?e`<p class="hint">
                        ${n("editor.matches_more",{count:i.templates.length-Di},this.hass)}
                      </p>`:e``}
              `:e``}
      </div>
    `}async _search(){const e=this._searchQuery.trim();if(e&&!this._searching){this._searching=!0;try{const i=H(),s=Ue(this.hass),n=[{urlPath:i,config:this._savedLovelace}];for(const e of this.hass?await mt(this.hass):[])if(ft(e)!==i)try{n.push({urlPath:e,config:await Ke(s,e)})}catch(t){}this._searchResult=Object.assign({query:e},function(e,t){var i;const s=t.trim().toLowerCase(),n=[],a=[];if(!s)return{cards:n,templates:a};const o=e=>e.toLowerCase().includes(s);for(const{urlPath:r,config:l}of e){const e=(e,t)=>{var i,s;const a=(i,s,a)=>{n.push({urlPath:r,view:t,template:e.template,where:i,variable:s,value:a})},l=(e,t,i="")=>{for(const s of j(t)){const[t,n]=Object.entries(s)[0];for(const s of Vo(n,`${i}${t}`))o(s.value)&&a(e,s.path,s.value)}};l("variables",e.variables);for(const n of null!==(i=E(e.for_each))&&void 0!==i?i:[])l("for_each",n);const c=null===(s=e.for_each_from)||void 0===s?void 0:s.overrides;if(c&&"object"==typeof c)for(const[n,r]of Object.entries(c))o(n)&&a("overrides",n,n),l("overrides",r,`${n} › `);for(const n of Do)if(void 0!==e[n])for(const t of Vo(e[n],n))o(t.value)&&a("override_block",t.path,t.value)},t=(i,s)=>{if(Array.isArray(i))for(const e of i)t(e,s);else if(i&&"object"==typeof i&&!Ze(i.type)){ke.includes(i.type)&&"string"==typeof i.template&&e(i,s);for(const e of Object.values(i))t(e,s)}};(null!==(i=null==l?void 0:l.views)&&void 0!==i?i:[]).forEach((e,i)=>{var s,n,a;return t(e,{title:null!==(n=null!==(s=null==e?void 0:e.title)&&void 0!==s?s:null==e?void 0:e.path)&&void 0!==n?n:"",path:null!==(a=null==e?void 0:e.path)&&void 0!==a?a:"",index:i})});for(const[i,s]of Object.entries(Ge(l))){const e=Object.assign({},null!=s?s:{});delete e.type,delete e.template;for(const t of Vo(e,""))o(t.value)&&a.push(Object.assign({urlPath:r,template:i},t))}}return{cards:n,templates:a}}(n,e))}finally{this._searching=!1}}}_renderRenameVariable(t){const i=lr(this._config);if(!i.length||!this._config)return e``;const s=this._varFrom&&i.includes(this._varFrom)?this._varFrom:void 0,a=this._varTo.trim(),o=this._varPending,r=!!o&&o.from===s&&o.to===a,l=r&&o.elsewhere.length?n("tools.rename_variable_elsewhere",{list:o.elsewhere.map(e=>`${e.urlPath} (${e.cards})`).join(", ")},this.hass):"";return e`
      <div class="rename">
        <h3>${n("tools.rename_variable_header",void 0,this.hass)}</h3>
        <p class="hint">${n("tools.rename_variable_hint",void 0,this.hass)}</p>
        ${this._varError?e`<ha-alert alert-type="error">${this._varError}</ha-alert>`:e``}
        ${r&&s?e`
                <ha-alert alert-type="warning">
                  ${n("tools.rename_variable_confirm",{from:s,to:a,templates:o.templates,cards:o.cards,elsewhere:l},this.hass)}
                </ha-alert>
                ${Fo(this._config,ar(this._config,s,a),this.hass)}
              `:e``}
        <ha-form
          .hass=${this.hass}
          .data=${{variable:null!=s?s:""}}
          .schema=${[{name:"variable",selector:{select:{mode:"dropdown",options:i.map(e=>({value:e,label:e}))}}}]}
          .computeLabel=${()=>n("tools.rename_variable_pick",void 0,this.hass)}
          @value-changed=${this._varPicked}
        ></ha-form>
        ${qi({label:n("tools.new_name",void 0,this.hass),value:this._varTo,disabled:this._busy,onInput:e=>this._varToChanged(e)})}
        <ha-button
          .disabled=${this._busy||!s||!a||a===s}
          @click=${()=>{this._renameVariable(t)}}
        >
          ${n(r?"tools.rename_anyway":"tools.rename_variable",void 0,this.hass)}
        </ha-button>
      </div>
    `}_varPicked(e){e.stopPropagation(),this._varFrom=e.detail.value.variable||void 0,this._varError=void 0,this._varPending=void 0}_varToChanged(e){this._varTo=e,this._varError=void 0,this._varPending=void 0}async _renameVariable(e){var t;const i=this._varFrom,s=this._varTo.trim();if(!i||!s||s===i||!this._config)return;if(!function(e){return/^[A-Za-z0-9_-]+$/.test(e)}(s))return void(this._varError=n("tools.rename_variable_invalid",{name:s},this.hass));const a=V();if(!a)return void(this._varError=n("tools.cannot_save_here",void 0,this.hass));if(function(e,t,i,s){const n=Ge(e);for(const a of rr(e,t))if(lr(a===t&&s?s:n[a]).includes(i))return!0;return!1}(a.config,e,s,this._config))return void(this._varError=n("tools.rename_variable_taken",{name:s},this.hass));const o=H(),r=this._varPending;if(r&&r.from===i&&r.to===s){this._busy=!0,this._varError=void 0;try{let t;await z(this,this.hass,"rename_variable",[{urlPath:o,build:n=>(t=rr(n,e),cr(n,e,i,s).config)},...r.elsewhere.map(n=>({urlPath:n.urlPath,build:n=>hr(n,e,o)?cr(n,e,i,s,t).config:n}))],this._config),this._undoChanged=void 0,this._fireConfigChanged(ar(this._config,i,s)),this._varFrom=s,this._varTo="",this._varPending=void 0}catch(l){this._varError=n("tools.save_failed",{message:null!==(t=null==l?void 0:l.message)&&void 0!==t?t:l},this.hass)}finally{this._busy=!1}}else{this._busy=!0;try{const t=Ue(this.hass),n=await Ke(t,o).catch(()=>a.config),r=cr(n,e,i,s),l=rr(n,e),h=[];for(const a of this.hass?await mt(this.hass):[]){if(ft(a)===o)continue;let n;try{n=await Ke(t,a)}catch(c){continue}if(!hr(n,e,o))continue;const r=cr(n,e,i,s,l);(r.cards||r.templates)&&h.push({urlPath:a,cards:r.cards})}this._varPending={from:i,to:s,cards:r.cards,templates:r.templates,elsewhere:h}}finally{this._busy=!1}}}_renderDuplicate(t){const i=this._duplicateTo.trim(),s=!!i&&this._duplicatePending===i;return e`
      <div class="rename">
        <h3>${n("tools.duplicate_header",void 0,this.hass)}</h3>
        <p class="hint">${n("tools.duplicate_hint",void 0,this.hass)}</p>
        ${s?e`<ha-alert alert-type="warning">
                ${n("tools.duplicate_confirm",{to:i,name:t},this.hass)}
              </ha-alert>`:e``}
        ${qi({label:n("tools.copy_name",void 0,this.hass),value:this._duplicateTo,disabled:this._busy,onInput:e=>this._duplicateChanged(e)})}
        <ha-button .disabled=${this._busy||!i||i===t} @click=${this._duplicate}>
          ${n(s?"tools.duplicate_anyway":"tools.duplicate",void 0,this.hass)}
        </ha-button>
      </div>
    `}_duplicateChanged(e){this._duplicateTo=e,this._toolError=void 0,this._duplicatePending=void 0}async _duplicate(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._duplicateTo.trim();if(!i||!s||s===i)return;const a=V();if(a&&void 0!==_(a.config)[s])return void(this._toolError=n("tools.name_taken",{name:s},this.hass));if(this._duplicatePending!==s)return void(this._duplicatePending=s);const o=Object.assign(Object.assign({},this._config),{template:s}),r=W(null!==(t=null==a?void 0:a.config)&&void 0!==t?t:this.lovelace,i),l=await this._saveDashboard(e=>{var t,i;return Re(e,null!==(i=null===(t=null==r?void 0:r.view)||void 0===t?void 0:t.index)&&void 0!==i?i:0,o)},"duplicate");l&&(this._duplicateTo="",this._duplicatePending=void 0)}}a([o({attribute:!1})],dr.prototype,"hass",void 0),a([o({attribute:!1})],dr.prototype,"lovelace",void 0),a([o({attribute:!1})],dr.prototype,"config",void 0),a([r()],dr.prototype,"_renameTo",void 0),a([r()],dr.prototype,"_renameError",void 0),a([r()],dr.prototype,"_renaming",void 0),a([r()],dr.prototype,"_renamePending",void 0),a([r()],dr.prototype,"_duplicateTo",void 0),a([r()],dr.prototype,"_duplicatePending",void 0),a([r()],dr.prototype,"_toolError",void 0),a([r()],dr.prototype,"_busy",void 0),a([r()],dr.prototype,"_modernisePending",void 0),a([r()],dr.prototype,"_remoteUsages",void 0),a([r()],dr.prototype,"_undoChanged",void 0),a([r()],dr.prototype,"_similarNames",void 0),a([r()],dr.prototype,"_similarPending",void 0),a([r()],dr.prototype,"_searchQuery",void 0),a([r()],dr.prototype,"_searching",void 0),a([r()],dr.prototype,"_searchResult",void 0),a([r()],dr.prototype,"_varFrom",void 0),a([r()],dr.prototype,"_varTo",void 0),a([r()],dr.prototype,"_varError",void 0),a([r()],dr.prototype,"_varPending",void 0),customElements.get("decluttering-template-usages-tab")||customElements.define("decluttering-template-usages-tab",dr);class ur extends l{constructor(){super(...arguments),this._selectedTab="settings",this._suggestedNothing=!1,this._busy=!1,this._declutterPending=!1,this._promoteName="",this._loadedElements=!1}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=V())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:g()}static schema(){var e;return null!==(e=ur._schema)&&void 0!==e||(ur._schema=[{name:"template",label:n("template_editor.template_label"),selector:{text:{}}},{name:"thingType",label:n("template_editor.type_label"),selector:{select:{mode:"dropdown",options:[{value:"card",label:n("template_editor.type_card")},{value:"badge",label:n("template_editor.type_badge")},{value:"row",label:n("template_editor.type_row")},{value:"element",label:n("template_editor.type_element")}]}}},{name:"description",label:n("template_editor.description_label"),helper:n("template_editor.description_helper"),selector:{text:{multiline:!0}}},{name:"variables",label:n("template_editor.declarations_label"),helper:n("template_editor.declarations_helper"),selector:{object:{}}},{name:"default",label:n("template_editor.defaults_label"),helper:n("template_editor.defaults_helper"),selector:{object:{}}}]),ur._schema}setConfig(e){this._config=e,this._suggestion=void 0,this._suggestedNothing=!1}render(){var t;if(!this.hass||!this._config)return e``;const i={};b(this._config.default)&&b(this._config.defaults)||(i.default=n("error.variables_shape",void 0,this.hass)),gt(this._config.variables)||(i.variables=n("template_editor.declarations_shape",void 0,this.hass));const s={template:this._config.template,thingType:null!==(t=w(this._config))&&void 0!==t?t:"card",description:this._config.description,variables:this._config.variables,default:be(this._config)};return e`
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
      ${"settings"===this._selectedTab?e`
              ${this._renderInUse()} ${this._renderDiagnostics()} ${this._renderExamplePicker()}
              ${this._renderSuggest("card"===s.thingType)} ${this._renderPromote()} ${this._renderOrder()}
              ${this._renderGroupOrder()}
              <ha-form
                .hass=${this.hass}
                .data=${s}
                .schema=${ur.schema()}
                .error=${i}
                .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
                .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
                @value-changed=${this._valueChanged}
              ></ha-form>
              ${this._renderLint()} ${this._renderDeclutter()}
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
    `}_renderDiagnostics(){if(!this._config||!gt(this._config.variables))return e``;const{unused:t,duplicated:i,contradictory:s}=_t(this._config);return e`
      ${t.length?e`<ha-alert alert-type="info">
              ${n(1===t.length?"template_editor.declared_unused_one":"template_editor.declared_unused_many",{names:t.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${i.length?e`<ha-alert alert-type="warning">
              ${n(1===i.length?"template_editor.duplicated_one":"template_editor.duplicated_many",{names:i.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${s.length?e`<ha-alert alert-type="warning">
              ${n(1===s.length?"template_editor.contradictory_one":"template_editor.contradictory_many",{names:s.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_renderExamplePicker(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=S(this._config);if(!i||!s.length)return e``;const a=vt.get(i);return e`
      <ha-form
        .hass=${this.hass}
        .data=${{example:void 0===a||a>=s.length?"":String(a)}}
        .schema=${[{name:"example",selector:{select:{mode:"dropdown",options:[{value:"",label:n("template_editor.preview_defaults",void 0,this.hass)},...s.map((e,t)=>({value:String(t),label:n("template_editor.example_n",{number:t+1},this.hass)}))]}}}]}
        .computeLabel=${()=>n("template_editor.preview_example_label",void 0,this.hass)}
        @value-changed=${this._previewExamplePicked}
      ></ha-form>
    `}_previewExamplePicked(e){var t;e.stopPropagation();const i=null===(t=this._config)||void 0===t?void 0:t.template;if(!i)return;const s=e.detail.value.example;void 0===s||""===s?vt.delete(i):vt.set(i,Number(s)),window.dispatchEvent(new CustomEvent(yt,{detail:{template:i}})),this.requestUpdate()}_renderLint(){if(!this._config)return e``;const t=this._savedLovelace,i=_(t,void 0,this._config)[this._config.template],s=function(e,t=[]){if(!e||"object"!=typeof e)return[];const i={findings:[],heads:new Map,targets:[]};for(const r of Oi){const t=e[r];void 0!==t&&Fi(t,r,i)}y(e).forEach((e,t)=>{void 0!==e.default&&Fi(e.default,`variables[${t}].default`,i)});const s=new Set([...Li(e),...t,...ae,...le(e)]),n=[...i.findings];for(const r of i.targets){if(s.has(r.name)||i.heads.has(r.name))continue;const e=Ce(r.name,[...s,...i.heads.keys()]);n.push({level:"warning",key:"lint.target_unknown",params:e?{name:r.name,placeholder:r.placeholder,closest:e}:{name:r.name,placeholder:r.placeholder},path:r.path})}const a=[...i.heads.entries()].filter(([e])=>!s.has(e));a.length&&n.push({level:"info",key:"lint.undeclared",params:{names:a.map(([e,t])=>a.length>1?`${e} (${t})`:e).join(", ")},path:a.length>1?"":a[0][1]});const o=new Set;return n.filter(e=>{const t=JSON.stringify([e.key,e.params,e.path]);return!o.has(t)&&(o.add(t),!0)})}(this._config,[...Li(i),...Object.keys(he(t))]);return s.length?e`${s.map(t=>e`<ha-alert alert-type=${t.level}>
          ${n(t.key,t.params,this.hass)}${t.params.closest?n("error.did_you_mean",{closest:t.params.closest},this.hass):""}${t.path?n("lint.where",{path:t.path},this.hass):""}
        </ha-alert>`)}`:e``}_renderOrder(){const t=y(this._config);return t.length<2?e``:e`
      <div class="order">
        <p class="hint">${n("template_editor.order_hint",void 0,this.hass)}</p>
        ${this._renderSortable("variables",t.map(e=>{var t;return{label:null!==(t=e.label)&&void 0!==t?t:e.name,name:e.name}}),(e,t)=>this._move(e,t))}
      </div>
    `}_renderSortable(t,i,s){const a=(e,i)=>{e.preventDefault();const n=this._dragging;this._dragging=void 0,(null==n?void 0:n.list)===t&&s(n.from,i)};return e`
      <ul>
        ${i.map((o,r)=>e`
            <li
              draggable="true"
              @dragstart=${e=>{var i;this._dragging={list:t,from:r},null===(i=e.dataTransfer)||void 0===i||i.setData("text/plain",o.name),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}}
              @dragover=${e=>{var i;(null===(i=this._dragging)||void 0===i?void 0:i.list)===t&&e.preventDefault()}}
              @drop=${e=>a(e,r)}
              @dragend=${()=>{this._dragging=void 0}}
            >
              <ha-svg-icon class="handle" .path=${"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"}></ha-svg-icon>
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
    `}_move(e,t){const i=y(this._config),s=bt(i,e,t);s!==i&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{variables:s}))}_renderGroupOrder(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.group,s=$t(i);if(void 0===i||s.length<2)return e``;const a=s.map((e,t)=>{var i,s,n,a;const o=null!==(n=null!==(s=null!==(i=null==e?void 0:e.name)&&void 0!==i?i:null==e?void 0:e.heading)&&void 0!==s?s:null==e?void 0:e.title)&&void 0!==n?n:null==e?void 0:e.entity,r=String(null!==(a=null==e?void 0:e.type)&&void 0!==a?a:"?").replace(/^custom:/,"");return{label:"string"==typeof o?`${r} (${o})`:r,name:`${t+1} ${r}`}});return e`
      <div class="order">
        <p class="hint">${n("template_editor.group_order_hint",void 0,this.hass)}</p>
        ${this._renderSortable("group",a,(e,t)=>{const n=bt(s,e,t);n!==s&&this._config&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{group:wt(i,n)}))})}
      </div>
    `}_renderPromote(){const t=ki(this._config);if(!this._config||!t)return e``;const i=function(e){const t=[],i=(e,s)=>{if(Array.isArray(e))e.forEach((e,t)=>i(e,[...s,t]));else if(e&&"object"==typeof e)for(const[t,n]of Object.entries(e))"type"===t&&"string"==typeof n||i(n,[...s,t]);else"string"==typeof e&&ve.test(e)||s.length&&null!=e&&("string"!=typeof e&&"number"!=typeof e&&"boolean"!=typeof e||t.push({path:s,value:e,label:Si(s)}))};return i(e,[]),t}(this._config[t]);if(!i.length)return e``;const s=this._promotePath?JSON.stringify(this._promotePath):"",a=e=>{const t=String(e);return t.length>40?`${t.slice(0,39)}…`:t};return e`
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
                ${qi({label:n("template_editor.promote_name",void 0,this.hass),value:this._promoteName,onInput:e=>{this._promoteName=e,this._promoteError=void 0}})}
                ${this._promoteError?e`<ha-alert alert-type="error">${this._promoteError}</ha-alert>`:e``}
                <ha-button .disabled=${!this._promoteName.trim()} @click=${this._promote}>
                  ${n("template_editor.promote_button",void 0,this.hass)}
                </ha-button>
              `:e``}
      </ha-expansion-panel>
    `}_promotePicked(e){e.stopPropagation();const t=e.detail.value.setting;t&&(this._promotePath=JSON.parse(t),this._promoteName=function(e,t){const i=[...e].reverse().find(e=>"string"==typeof e),s=e[e.length-1];return yi(("number"==typeof s?`${null!=i?i:"item"}_${s+1}`:null!=i?i:"value").replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value",t)}(this._promotePath,ji(this._config)),this._promoteError=void 0)}_promote(){if(!this._config||!this._promotePath)return;const e=this._promoteName.trim(),t=function(e,t,i){if(!wi.test(i))return{ok:!1,error:"name_invalid"};if(ji(e).includes(i))return{ok:!1,error:"name_taken"};const s=ki(e),n=s?function(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}(e[s],t):void 0;if(!s||null==n||"object"==typeof n)return{ok:!1,error:"gone"};const a={name:i,type:Ai(n),default:n};return{ok:!0,template:Object.assign(Object.assign({},e),{[s]:Ci(e[s],t,`[[${i}]]`),variables:Ae(e.variables,[a])})}}(this._config,this._promotePath,e);t.ok?(this._promotePath=void 0,this._promoteName="",this._fireConfigChanged(t.template)):this._promoteError=n(`template_editor.promote_${t.error}`,{name:e},this.hass)}_renderInUse(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._savedLovelace;if(!i||!s)return e``;const{views:a,templates:o}=nt(s,i),r=a.reduce((e,t)=>e+t.count,0)+o.length;return r?e`<ha-alert alert-type="info">
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
    `:e``}_suggest(){var e;if(!(null===(e=this._config)||void 0===e?void 0:e.card))return;if(this._suggestion){const e=Object.assign(Object.assign({},this._config),{card:this._suggestion.card});return e.variables=Ae(this._config.variables,this._suggestion.variables),this._suggestion=void 0,void this._fireConfigChanged(e)}this._suggestedNothing=!1;const t=y(this._config).map(e=>e.name),i=function(e,t){const i=new Set(t),s=[],n=new Map,a=(e,t)=>{const a=`${e.base} ${t}`,o=n.get(a);if(o)return o;let r=1,l=e.base;for(;i.has(l);)r+=1,l=`${e.base}_${r}`;return i.add(l),n.set(a,l),s.push({name:l,label:di(e,r),selector:e.selector,default:t}),l},o=e=>{if(Array.isArray(e))return e.map(o);if(!e||"object"!=typeof e)return e;const t={};for(const[i,s]of Object.entries(e)){const e=Object.prototype.hasOwnProperty.call(hi,i)?hi[i]:void 0;e&&"string"==typeof s&&!ve.test(s)&&e.matches(s)?t[i]=`[[${a(e,s)}]]`:t[i]=o(s)}return t};return{card:o(e),variables:s}}(this._config.card,t);i.variables.length?this._suggestion=i:this._suggestedNothing=!0}_renderDeclutter(){var t,i;const s=this._savedLovelace,a=lt(s),o="card"===w(null!==(t=this._config)&&void 0!==t?t:{})?xt(s):[];if(!a.length&&!o.length||!this._config)return e``;const r=this._config.template,l=!!r&&r in _(s),c=null!==(i=this._declutterOriginal)&&void 0!==i?i:this._declutterSection;return e`
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
    `}_declutterPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterOriginal=i.config,this._declutterSection=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{card:JSON.parse(JSON.stringify(i.config))});delete s.group,this._fireConfigChanged(s)}_declutterSectionPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterSection={view:i.view,section:i.section,cards:i.cards},this._declutterOriginal=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{group:{cards:JSON.parse(JSON.stringify(i.cards))}});delete s.card,this._fireConfigChanged(s)}async _declutterReplace(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.template,i=this._declutterOriginal,s=this._declutterSection;if(!t||!i&&!s)return;if(!this._declutterPending)return void(this._declutterPending=!0);const a={type:"custom:decluttering-card-plus",template:t};let o=!1;const r=await this._saveDashboard(e=>{if(i)return U(e,i,a);const t=kt(e,s.view,s.section,s.cards,[a]);return o=t===e,t},"declutter");r&&o&&(this._toolError=n("template_editor.declutter_section_changed",void 0,this.hass)),r&&(this._declutterPending=!1,this._declutterOriginal=void 0,this._declutterSection=void 0)}_selectTab(e){e.stopPropagation(),this._selectedTab=e.detail}_activateTab(e){const t=e.composedPath().find(e=>"ha-tab-group-tab"===e.localName),i=null==t?void 0:t.getAttribute("panel");i&&(this._selectedTab=i)}_valueChanged(e){if(!this._config)return;const t=e.detail.value,i=Object.assign(Object.assign({},this._config),{template:t.template,default:t.default});void 0!==this._config.defaults&&(JSON.stringify(t.default)===JSON.stringify(be(this._config))?i.default=this._config.default:delete i.defaults),k(i,"description",t.description),k(i,"variables",t.variables);const s=void 0!==i.group&&"card"===t.thingType;s||delete i.group;for(const[n,a]of Object.entries(Mi))ur.stubMember(!s&&t.thingType===n,i,n,a);this._fireConfigChanged(i)}_cardChanged(e){if(e.stopPropagation(),!this._config)return;this._suggestion=void 0,this._suggestedNothing=!1;const t=Object.assign(Object.assign({},this._config),{card:e.detail.config});this._fireConfigChanged(t)}_cardPicked(e){this._selectedTab="card",this._cardChanged(e)}_rowChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign(Object.assign({},this._config),{row:e.detail.config});this._fireConfigChanged(t)}_fireConfigChanged(e){this._suggestion=void 0,this._suggestedNothing=!1,h(this,"config-changed",{config:e})}static stubMember(e,t,i,s){e?i in t||(t[i]=s):delete t[i]}static get styles(){return Ui}_saveDashboard(e,t,i){return Hi(this,e,t,i)}async connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=m(()=>this.requestUpdate())),this._loadedElements||(await f(),await async function(){let e=customElements.get("hui-entities-card");if(!e){if(!Pe)return;(await Pe).createCardElement({type:"entities",entities:[]}),await customElements.whenDefined("hui-entities-card"),e=customElements.get("hui-entities-card")}e&&e.getConfigElement&&await e.getConfigElement()}(),this._loadedElements=!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}}a([r()],ur.prototype,"_config",void 0),a([r()],ur.prototype,"_selectedTab",void 0),a([r()],ur.prototype,"_suggestion",void 0),a([r()],ur.prototype,"_suggestedNothing",void 0),a([r()],ur.prototype,"_toolError",void 0),a([r()],ur.prototype,"_busy",void 0),a([r()],ur.prototype,"_declutterOriginal",void 0),a([r()],ur.prototype,"_declutterSection",void 0),a([r()],ur.prototype,"_declutterPending",void 0),a([r()],ur.prototype,"_promotePath",void 0),a([r()],ur.prototype,"_promoteName",void 0),a([r()],ur.prototype,"_promoteError",void 0),a([o()],ur.prototype,"lovelace",void 0),a([o()],ur.prototype,"hass",void 0);class pr extends l{connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=m(()=>this.requestUpdate()))}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0}static get styles(){return c`
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
    `}render(){var t,i,s,a,o,r,l,c,h;const d=this.lovelace,u=ge(d);if(u&&(null===(t=this._borrowed)||void 0===t?void 0:t.ll)!==d){this._borrowed={ll:d};const e=new Set(Object.keys(_(d)));_e(this.hass,d).then(t=>{var i;(null===(i=this._borrowed)||void 0===i?void 0:i.ll)===d&&(this._borrowed={ll:d,names:Object.keys(t).filter(t=>!e.has(t)),templates:t})})}const p=u&&!(null===(i=this._borrowed)||void 0===i?void 0:i.names),m=St(d,u&&null!==(a=null===(s=this._borrowed)||void 0===s?void 0:s.names)&&void 0!==a?a:[]),f=p?Object.assign(Object.assign({},m),{missingTemplates:[]}):m,g=jt(d),v=At(d),y=null===(o=this._borrowed)||void 0===o?void 0:o.names,b=this._examplesChecked;p||(null==b?void 0:b.ll)===d&&(null==b?void 0:b.borrowed)===y||(this._examplesChecked={ll:d,borrowed:y,failed:Ct(_(d),null!=y?y:[],this.hass)});const $=p?[]:null!==(l=null===(r=this._examplesChecked)||void 0===r?void 0:r.failed)&&void 0!==l?l:[],w=tr(d,null!==(h=null===(c=this._borrowed)||void 0===c?void 0:c.templates)&&void 0!==h?h:_(d)),x=!(f.missingTemplates.length||f.unsetVariables.length||f.unusedTemplates.length||g.length||v.length||$.length||w.length);return e`
      <ha-expansion-panel outlined>
        <span slot="header">${n("tools.health_header",void 0,this.hass)}</span>
        <slot></slot>
        ${x?e`<p class="hint">${n("tools.health_ok",void 0,this.hass)}</p>`:e`
                ${$.map(t=>e`<ha-alert alert-type="error">
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
                ${w.map(t=>e`<ha-alert alert-type="warning">
                      ${n("tools.health_unread",{template:t.template,name:t.name,count:t.count,view:t.view.title||t.view.path||n("template_editor.untitled_view",void 0,this.hass)},this.hass)}${"variables"===t.where?"":n(`tools.health_unread_${t.where}`,void 0,this.hass)}${t.closest?n("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${f.unusedTemplates.length?e`<ha-alert alert-type="info">
                        ${n("tools.health_unused",{names:f.unusedTemplates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
              `}
        ${this._renderTimings()}
      </ha-expansion-panel>
    `}_renderTimings(){const t=Ot.entries(),i=e=>e.toFixed(1),s=e`<h4 class="timings-header">${n("tools.timings_header",void 0,this.hass)}</h4>`;if(!t.length)return e`${s}
        <p class="hint">${n("tools.timings_none",void 0,this.hass)}</p>`;const{byTotal:a,byMax:o,repeats:r}=Et(t);return e`
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
    `}}a([o({attribute:!1})],pr.prototype,"hass",void 0),a([o({attribute:!1})],pr.prototype,"lovelace",void 0),a([r()],pr.prototype,"_borrowed",void 0),Tt(Nt,oi),Tt(Pt,ur),Tt(It,pr);export{oi as DeclutteringCardEditor,pr as DeclutteringHealthPanel,ur as DeclutteringTemplateEditor};
//# sourceMappingURL=decluttering-card-plus.editors-BIlKmIHy.js.map
