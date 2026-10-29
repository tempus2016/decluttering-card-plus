import{b as t,l as e,_ as i,n as s,r as n,i as a,a as o,f as r,e as l,d as c,c as h,o as d,g as u,h as p,j as m,t as f,k as g,m as _,p as v,q as y,s as b,u as $,v as w,w as x,x as k,y as S,z as A,A as j,B as C,C as O,D as E,E as T,F as P,G as N,H as I,I as F,J as L,K as M,L as D,M as V,N as R,O as z,P as q,Q as U,R as H,S as K,T as W,U as J,W as B,X as Y,Y as G,Z,$ as Q,a0 as X,a1 as tt,a2 as et,a3 as it,a4 as st,a5 as nt,a6 as at,a7 as ot,a8 as rt,a9 as lt,aa as ct,ab as ht,ac as dt,ad as ut,ae as pt,af as mt,ag as ft,ah as gt,ai as _t,aj as vt,ak as yt,al as bt,am as $t,an as wt,ao as xt,ap as kt,aq as St,ar as At,as as jt,at as Ct,au as Ot,av as Et,aw as Tt,ax as Pt,ay as Nt,az as It,aA as Ft,aB as Lt,aC as Mt,aD as Dt,aE as Vt,aF as Rt,aG as zt,aH as qt,aI as Ut,aJ as Ht,aK as Kt,aL as Wt,V as Jt,aM as Bt,aN as Yt,aO as Gt,aP as Zt,aQ as Qt,aR as Xt,aS as te,aT as ee,aU as ie,aV as se,aW as ne,aX as ae,aY as oe,aZ as re,a_ as le,a$ as ce,b0 as he,b1 as de,b2 as ue,b3 as pe,b4 as me,b5 as fe,b6 as ge,b7 as _e,b8 as ve,b9 as ye,ba as be,bb as $e,bc as we,bd as xe,be as ke,bf as Se,bg as Ae,bh as je,bi as Ce,bj as Oe,bk as Ee,bl as Te,bm as Pe}from"./decluttering-card-plus.core-DrFHkkfU.js";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ne=Symbol.for(""),Ie=t=>{if(t?.r===Ne)return t?._$litStatic$},Fe=new Map,Le=(Me=t,(t,...e)=>{const i=e.length;let s,n;const a=[],o=[];let r,l=0,c=!1;for(;l<i;){for(r=t[l];l<i&&void 0!==(n=e[l],s=Ie(n));)r+=s+t[++l],c=!0;l!==i&&o.push(n),a.push(r),l++}if(l===i&&a.push(t[i]),c){const i=a.join("$$lit$$");void 0===(t=Fe.get(i))&&(a.raw=a,Fe.set(i,t=a)),e=o}return Me(t,...e)});var Me;const De="decluttering-card-plus-card-slot";class Ve extends a{constructor(){super(...arguments),this.label="",this.emptyHint="",this._picking=!1,this._editing=!1}static get styles(){return o`
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
    `}render(){const i=function(t){var i,s,n,a;if(!t||"object"!=typeof t||Array.isArray(t))return;const o=t,r="string"==typeof o.type?o.type:"",l=r.startsWith("custom:")?r.slice(7):r?r[0].toUpperCase()+r.slice(1):"",c=t=>"string"==typeof t&&t.trim()?t.split("\n")[0].trim():void 0,h=Array.isArray(o.cards)?o.cards.length:void 0;return{type:l,text:null!==(a=null!==(n=null!==(s=null!==(i=c(o.content))&&void 0!==i?i:c(o.title))&&void 0!==s?s:c(o.name))&&void 0!==n?n:c(o.entity))&&void 0!==a?a:void 0!==h?e("editor.slot.cards",{count:h}):""}}(this.value);return t`
      ${this.label?t`<p class="label">${this.label}</p>`:t``}
      <div class="slot ${i?"filled":""}">
        ${i?t`
                <div class="row">
                  <div class="text summary">
                    <b>${i.type}</b>
                    ${i.text?t`<small>${i.text}</small>`:t``}
                  </div>
                  <ha-button @click=${()=>this._toggleEdit()}>
                    ${e(this._editing?"editor.slot.done":"editor.slot.edit",void 0,this.hass)}
                  </ha-button>
                  <ha-button @click=${()=>this._set(void 0)}>
                    ${e("editor.slot.remove",void 0,this.hass)}
                  </ha-button>
                </div>
                ${this._editing?t`<hui-card-element-editor
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        .value=${this.value}
                        @config-changed=${this._edited}
                      ></hui-card-element-editor>`:t``}
              `:t`
                <div class="row">
                  <p class="text hint">${this.emptyHint}</p>
                  <ha-button @click=${()=>this._togglePick()}>
                    ${e(this._picking?"editor.slot.cancel":"editor.slot.choose",void 0,this.hass)}
                  </ha-button>
                </div>
                ${this._picking?t`<hui-card-picker
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        @config-changed=${this._picked}
                      ></hui-card-picker>`:t``}
              `}
      </div>
    `}_togglePick(){this._picking=!this._picking}_toggleEdit(){this._editing=!this._editing}_picked(t){var e;t.stopPropagation(),this._picking=!1,this._set(null===(e=t.detail)||void 0===e?void 0:e.config)}_edited(t){var e;t.stopPropagation(),this._set(null===(e=t.detail)||void 0===e?void 0:e.config)}_set(t){this._editing=this._editing&&!!t,r(this,"value-changed",{value:t&&"object"==typeof t?t:void 0})}}i([s({attribute:!1})],Ve.prototype,"hass",void 0),i([s({attribute:!1})],Ve.prototype,"lovelace",void 0),i([s({attribute:!1})],Ve.prototype,"value",void 0),i([s()],Ve.prototype,"label",void 0),i([s()],Ve.prototype,"emptyHint",void 0),i([n()],Ve.prototype,"_picking",void 0),i([n()],Ve.prototype,"_editing",void 0),"undefined"==typeof customElements||customElements.get(De)||customElements.define(De,Ve);const Re="variable:";function ze(t,i,s){var n;const a=t&&"object"==typeof t?t:{},o=null!==(n=["areas","devices","floors","labels","views","entities"].find(t=>void 0!==a[t]))&&void 0!==n?n:"items";return e(`editor.matches_${o}_${1===i?"one":"many"}`,void 0,s)}let qe,Ue;function He(){return null!=Ue||(Ue=[{name:"fit",label:e("editor.fit_label"),helper:e("editor.fit_helper"),selector:{select:{mode:"dropdown",options:[{value:"box",label:e("editor.fit_box")},{value:"contents",label:e("editor.fit_contents")}]}}}]),Ue}function Ke(t,e){const i=t.indexOf(e);return-1===i?[t,""]:[t.slice(0,i),t.slice(i+e.length)]}const We=new Set(["true","yes","on","1"]),Je=/:host|\.decluttering-container/;class Be extends a{constructor(){super(...arguments),this._shownAs=new Map,this._loadingTemplates=!1,this._ejectPending=!1,this._sectionsPending=!1,this._renderedTemplates={},this._renderingTemplates=new Set}static get styles(){return o`
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
    `}set lovelace(t){this._lovelace=t,this._templates=void 0,this._schema=void 0}_editingPlace(){const t=l(this),e=t?c(t):void 0;return null!=e?e:{view:h(this._lovelace)}}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._stopLanguageListener)||void 0===t||t.call(this),this._stopLanguageListener=void 0}async connectedCallback(){var t;super.connectedCallback(),null!==(t=this._stopLanguageListener)&&void 0!==t||(this._stopLanguageListener=d(()=>this.requestUpdate())),await u()}setConfig(t){var e;null!==(e=this._openedWith)&&void 0!==e||(this._openedWith=t),this._config=t}willUpdate(){var t;if(this.hass&&this._config&&(this._lovelace||(this._lovelace=null!==(t=p())&&void 0!==t?t:void 0),this._lovelace)){if(!this._templates){const t=this._editingPlace();this._templates=m(this._lovelace,t.view,void 0,t.section),this._loadBorrowedTemplates()}this._schema||(this._schema=[{name:"template",label:e("editor.template_label",void 0,this.hass),selector:{select:{mode:"dropdown",custom_value:!0,options:f(this._templates,this.hass)}}},{name:"variables",label:e("editor.variables_label",void 0,this.hass),helper:e("editor.variables_helper",void 0,this.hass),selector:{object:{}}}])}}render(){if(!(this.hass&&this._config&&this._templates&&this._schema))return t``;const i=this._templates[this._config.template],s=g(i),n=_(this._config.variables),a=v(this._config),o=!!i&&"card"===y(i)||!!a||void 0!==this._config.for_each||void 0!==this._config.for_each_from,r={};i||this._loadingTemplates||a&&!this._config.template||(r.template=e("editor.no_such_template",void 0,this.hass)),n||(r.variables=e("error.variables_shape",void 0,this.hass));const l=b(i);return t`
      ${(null==i?void 0:i.description)?t`<p class="description">${i.description}</p>`:t``}
      ${a?t`<ha-alert alert-type="info">
              ${e("editor.by_domain_hint",{templates:Object.entries(a).map(([t,e])=>`${t}: ${e}`).join(", ")},this.hass)}
            </ha-alert>`:t``}
      ${void 0===l?t``:t`<ha-alert alert-type="warning">
              ${l?e("editor.template_deprecated_because",{message:l},this.hass):e("editor.template_deprecated",void 0,this.hass)}
            </ha-alert>`}
      ${this._renderSource(i)} ${this._renderStartFromExample(i)}
      ${this._renderDiagnostics(i,n)} ${this._renderMatches(i)}
      <ha-form
        .hass=${this.hass}
        .data=${this._formData(s)}
        .schema=${this._formSchema(s,o)}
        .error=${r}
        .computeLabel=${t=>{var e;return null!==(e=t.label)&&void 0!==e?e:t.name}}
        .computeHelper=${t=>{var e;return null!==(e=t.helper)&&void 0!==e?e:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._renderCardVariables(s)} ${this._renderEmptySlot(o)} ${this._renderResult(i)}
      ${this._renderSectionPerCopy()}
      <decluttering-card-plus-health .hass=${this.hass} .lovelace=${this._lovelace}></decluttering-card-plus-health>
    `}_renderEmptySlot(i){if(!this._config||!i)return t``;if(!(void 0!==this._config.for_each||void 0!==this._config.for_each_from||void 0!==this._config.empty))return t``;const s=(t=>({_$litStatic$:t,r:Ne}))(De),n=this._config.empty;return Le`<${s}
      .hass=${this.hass}
      .lovelace=${this._lovelace}
      .value=${n&&"object"==typeof n?n:void 0}
      .label=${e("editor.empty_label",void 0,this.hass)}
      .emptyHint=${e("editor.empty_slot_hint",void 0,this.hass)}
      @value-changed=${this._emptyChanged}
    ></${s}>`}_emptyChanged(t){if(t.stopPropagation(),!this._config)return;const e=Object.assign({},this._config);$(e,"empty",t.detail.value),r(this,"config-changed",{config:e})}_renderStartFromExample(i){const s=w(i);return s.length&&this._config&&!x(this._config.variables).length?t`
      <div class="examples">
        <p class="hint">${e("editor.start_from_example_hint",void 0,this.hass)}</p>
        ${s.map((i,s)=>t`
            <ha-button @click=${()=>this._startFromExample(i)}>
              ${e("editor.start_from_example",{number:s+1},this.hass)}
            </ha-button>
          `)}
      </div>
    `:t``}_startFromExample(t){t.length&&r(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{variables:t})})}_renderCardVariables(i){var s;const n=i.filter(t=>k(t));if(!n.length)return t``;const a=S(null===(s=this._config)||void 0===s?void 0:s.variables);return t`${n.map(i=>{var s;const n=a[i.name],o=!!n&&"object"==typeof n;return t`
        <div class="card-variable">
          <h3>${null!==(s=i.label)&&void 0!==s?s:i.name}</h3>
          ${i.description?t`<p class="hint">${i.description}</p>`:t``}
          ${o?t`
                  <hui-card-element-editor
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    .value=${n}
                    @config-changed=${t=>this._cardVariableChanged(i.name,t)}
                  ></hui-card-element-editor>
                  <ha-button @click=${()=>this._cardVariableChanged(i.name)}>
                    ${e("editor.card_variable_clear",void 0,this.hass)}
                  </ha-button>
                `:t`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    @config-changed=${t=>this._cardVariableChanged(i.name,t)}
                  ></hui-card-picker>
                `}
        </div>
      `})}`}_cardVariableChanged(t,e){var i,s;null==e||e.stopPropagation();const n=null===(i=null==e?void 0:e.detail)||void 0===i?void 0:i.config,a=x(null===(s=this._config)||void 0===s?void 0:s.variables).filter(e=>A(e)!==t);n&&"object"==typeof n&&a.push({[t]:n});const o=Object.assign({},this._config);a.length?o.variables=a:delete o.variables,r(this,"config-changed",{config:o})}_renderResult(i){var s;if(!this._config)return t``;const n=j(this._config.for_each);let a=(null==n?void 0:n.length)?C(n[0],this._config.variables,0,n.length):this._config.variables,o=i,r=this._config.template;if(v(this._config))try{const t=null!==(s=this._templates)&&void 0!==s?s:{};let e;({template:o,name:r,entity:e}=O(this._config,a,e=>t[e],this.hass,Object.keys(t))),a=E(a,e)}catch(m){return t``}if(!o)return t``;const l=y(o);if(!l)return t``;const c=T(o);let h;try{const t=P(this.hass,N(this._config.rebuild_on));h=I(F(a,o,c,r,t,!0),this._config,l)}catch(f){return t`<ha-alert alert-type="warning">
        ${e("editor.result_error",{error:String(f)},this.hass)}
      </ha-alert>`}const d=(null==n?void 0:n.length)?e("editor.result_copies",{total:n.length},this.hass):"",[u,p]=Ke(e("editor.result_hint",{kind:l},this.hass),"[[name]]");return t`
      <ha-expansion-panel outlined>
        <span slot="header">${e("editor.result_header",void 0,this.hass)}${d}</span>
        <div class="result">
          <p class="hint">${u}<code>[[name]]</code>${p}</p>
          <ha-yaml-editor .hass=${this.hass} .defaultValue=${h} read-only></ha-yaml-editor>
          ${(null==n?void 0:n.length)||L(this._config.for_each_from)||!h||"object"!=typeof h?t``:t`
                  <ha-button @click=${()=>this._eject(h)}>
                    ${e(this._ejectPending?"editor.eject_confirm":"editor.eject",void 0,this.hass)}
                  </ha-button>
                `}
        </div>
      </ha-expansion-panel>
    `}_renderSectionPerCopy(){var i;const s=null===(i=M())||void 0===i?void 0:i.config;return this._config&&s&&D(s,this._config)?t`
      <div class="section-per-copy">
        <p class="hint">${e("editor.section_per_copy_hint",void 0,this.hass)}</p>
        ${this._sectionsError?t`<ha-alert alert-type="error">${this._sectionsError}</ha-alert>`:t``}
        <ha-button @click=${this._sectionPerCopy}>
          ${e(this._sectionsPending?"editor.section_per_copy_confirm":"editor.section_per_copy",void 0,this.hass)}
        </ha-button>
      </div>
    `:t``}async _sectionPerCopy(){var t,i;if(!this._sectionsPending)return void(this._sectionsPending=!0);this._sectionsPending=!1;const s=M(),n=this._config;if(!s||!n)return;try{await V(this,this.hass,"section_per_copy",[{urlPath:z(),build:t=>R(t,n)}])}catch(o){return void(this._sectionsError=e("tools.save_failed",{message:null!==(t=null==o?void 0:o.message)&&void 0!==t?t:o},this.hass))}let a=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;for(;a&&"hui-dialog-edit-card"!==a.localName;)a=a.parentNode instanceof ShadowRoot?a.parentNode.host:a.parentNode;null===(i=null==a?void 0:a.closeDialog)||void 0===i||i.call(a)}_eject(t){this._ejectPending?(this._ejectPending=!1,this._holdEjectUndo(t),r(this,"config-changed",{config:t})):this._ejectPending=!0}_holdEjectUndo(t){const e=M();if(!e||!this._openedWith)return;const i=q(e.config,this._openedWith,t);i!==e.config&&U({operation:"eject",at:Date.now(),dashboards:[{urlPath:z(),before:e.config,after:i}]})}_renderSource(i){var s;const n=null===(s=this._config)||void 0===s?void 0:s.template;if(!n||!i||this._loadingTemplates)return t``;const a=H(this._lovelace,n);if(!a)return t`<p class="hint">${e("editor.source_borrowed",void 0,this.hass)}</p>`;if(a.declared||!a.view)return t`<p class="hint">${e("editor.source_declared",void 0,this.hass)}</p>`;const{view:o}=a,r=document.location.pathname.split("/").slice(0,2).join("/"),[l,c]=Ke(e("editor.source_view",{view:""},this.hass),"");return t`<p class="hint">
      ${l}<a href=${`${r}/${o.path||o.index}`} target="_blank" rel="noreferrer"
        >${o.title||o.path||e("editor.untitled_view",void 0,this.hass)}</a
      >${c}
    </p>`}_filledSource(t){var e,i;return K(null===(e=this._config)||void 0===e?void 0:e.for_each_from,null===(i=this._config)||void 0===i?void 0:i.variables,t,this.hass)}_renderedTemplateNames(t){const e=this._filledSource(t),i=W(e);if(!this.hass||void 0===i)return[];if(!Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))return[];const s=new Set,n=J(this.hass,e,{rendered:this._renderedTemplates});for(const a of n)for(const t of Object.keys(a))s.add(t);return[...s]}_renderEditorTemplate(t){this.hass&&!this._renderingTemplates.has(t)&&(this._renderingTemplates.add(t),B(this.hass,t).then(e=>{this._renderingTemplates.delete(t),this._renderedTemplates=Object.assign(Object.assign({},this._renderedTemplates),{[t]:e})}))}_renderMatches(i){var s,n;if(!this.hass||!L(null===(s=this._config)||void 0===s?void 0:s.for_each_from))return t``;const a=this._filledSource(i);Y(a)&&!G()&&Z(this.hass).then(()=>this.requestUpdate());const o=W(a);if(void 0!==o){const i=Object.prototype.hasOwnProperty.call(this._renderedTemplates,o)?this._renderedTemplates[o]:void 0;if(!i)return this._renderEditorTemplate(o),t`<p class="hint">${e("editor.matches_template_pending",void 0,this.hass)}</p>`;const s=Q(i);if(!("list"in s)){const i="error"===s.problem?"editor.matches_template_failed":"editor.matches_template_not_list";return t`<ha-alert alert-type="warning"> ${e(i,{detail:s.detail},this.hass)} </ha-alert>`}}let r=[];try{r=J(this.hass,a,Object.assign(Object.assign({},X(this._lovelace)),{rendered:this._renderedTemplates}))}catch(c){return t``}if(!r.length)return t`<ha-alert alert-type="warning">
        ${e("editor.matches_none",{but:(null===(n=this._config)||void 0===n?void 0:n.empty)?e("editor.matches_none_but_empty",void 0,this.hass):""},this.hass)}
      </ha-alert>`;const l=r.slice(0,12);return t`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${1===r.length?e("editor.matches_header_one",{what:ze(a,1,this.hass)},this.hass):e("editor.matches_header_many",{count:r.length,what:ze(a,r.length,this.hass)},this.hass)}
        </span>
        <div class="matches">
          <ul>
            ${l.map((e,i)=>t`<li>${tt(e,i)}</li>`)}
          </ul>
          ${r.length>l.length?t`<p class="hint">
                  ${e("editor.matches_more",{count:r.length-l.length},this.hass)}
                </p>`:t``}
          <p class="hint">
            ${e(void 0===o?"editor.matches_hint":"editor.matches_template_hint",void 0,this.hass)}
          </p>
        </div>
      </ha-expansion-panel>
    `}_formSchema(t,i){const s=i?(null!=qe||(qe=[{name:"for_each",label:e("editor.for_each_label"),helper:e("editor.for_each_helper"),selector:{object:{}}},{name:"for_each_from",label:e("editor.for_each_from_label"),helper:e("editor.for_each_from_helper"),selector:{object:{}}},{name:"gap",label:e("editor.gap_label"),helper:e("editor.gap_helper"),selector:{number:{min:0,max:64,mode:"box"}}},{name:"columns",label:e("editor.columns_label"),helper:e("editor.columns_helper"),selector:{number:{min:1,max:6,mode:"box"}}},{name:"min_column_width",label:e("editor.min_column_width_label"),helper:e("editor.min_column_width_helper"),selector:{number:{min:50,max:1e3,step:10,mode:"box"}}},{name:"lazy",label:e("editor.lazy_label"),helper:e("editor.lazy_helper"),selector:{boolean:{}}},{name:"lazy_eager",label:e("editor.lazy_eager_label"),helper:e("editor.lazy_eager_helper"),selector:{number:{min:0,max:100,mode:"box"}}}]),qe):[];if(!t.length)return[...this._schema,...s,...He()];const n=t=>{var e;return{name:Re+t.name,label:null!==(e=t.label)&&void 0!==e?e:t.name,helper:t.description,selector:it(t),required:!0===t.required}},a=[];for(const e of et(t.filter(t=>!k(t))))void 0===e.group?a.push(...e.declarations.map(n)):a.push({name:"",type:"expandable",title:e.group,schema:e.declarations.map(n)});return[this._schema[0],...a,{name:"extras",label:e("editor.extras_label",void 0,this.hass),helper:e("editor.extras_helper",void 0,this.hass),selector:{object:{}}},...s,...He()]}_formData(t){var e,i,s,n,a,o,r,l,c,h,d;if(!t.length)return this._config;const u=S(null===(e=this._config)||void 0===e?void 0:e.variables),p=new Set(t.map(t=>t.name)),m={template:null===(i=this._config)||void 0===i?void 0:i.template};this._shownAs=new Map;for(const g of t){if(!(g.name in u))continue;const t=u[g.name];if("boolean"!=typeof t&&"boolean"in it(g)){const e=We.has(String(t).trim().toLowerCase());this._shownAs.set(g.name,{shown:e,written:t}),m[Re+g.name]=e}else m[Re+g.name]=t}const f=x(null===(s=this._config)||void 0===s?void 0:s.variables).filter(t=>{const e=A(t);return void 0!==e&&!p.has(e)});return f.length&&(m.extras=f),void 0!==(null===(n=this._config)||void 0===n?void 0:n.for_each)&&(m.for_each=this._config.for_each),void 0!==(null===(a=this._config)||void 0===a?void 0:a.for_each_from)&&(m.for_each_from=this._config.for_each_from),void 0!==(null===(o=this._config)||void 0===o?void 0:o.columns)&&(m.columns=this._config.columns),void 0!==(null===(r=this._config)||void 0===r?void 0:r.min_column_width)&&(m.min_column_width=this._config.min_column_width),void 0!==(null===(l=this._config)||void 0===l?void 0:l.gap)&&(m.gap=this._config.gap),void 0!==(null===(c=this._config)||void 0===c?void 0:c.fit)&&(m.fit=this._config.fit),void 0!==(null===(h=this._config)||void 0===h?void 0:h.lazy)&&(m.lazy=this._config.lazy),void 0!==(null===(d=this._config)||void 0===d?void 0:d.lazy_eager)&&(m.lazy_eager=this._config.lazy_eager),m}_renderDiagnostics(i,s){var n,a,o,r,l,c,h,d,u,m,f,g,_,b,$,w,x,k,S;if(!i||this._loadingTemplates||!s||v(this._config))return t``;const A=[...nt(null===(n=this._config)||void 0===n?void 0:n.for_each),...at(null===(a=this._config)||void 0===a?void 0:a.for_each_from),...L(null===(o=this._config)||void 0===o?void 0:o.for_each_from)?st:[],...this._renderedTemplateNames(i),...N(null===(r=this._config)||void 0===r?void 0:r.rebuild_on),...ot(i,rt(null===(l=this._config)||void 0===l?void 0:l.variables)),...Object.keys(lt(null!==(c=this._lovelace)&&void 0!==c?c:p()))].map(t=>({[t]:null})),{missing:j,unused:C,required:O}=ct(null===(h=this._config)||void 0===h?void 0:h.variables,i,A,[null===(d=this._config)||void 0===d?void 0:d.for_each_from,null===(u=this._config)||void 0===u?void 0:u.on_error],ht(i,lt(null!==(m=this._lovelace)&&void 0!==m?m:p()))),E=dt(null===(f=this._config)||void 0===f?void 0:f.variables,i,this.hass),T=j.filter(t=>!O.includes(t)),P=Je.test(`${null!==(g=i.style)&&void 0!==g?g:""}\n${null!==(b=null===(_=this._config)||void 0===_?void 0:_.style)&&void 0!==b?b:""}`),I="contents"===(null===($=this._config)||void 0===$?void 0:$.fit)&&P,F=Number(null===(w=this._config)||void 0===w?void 0:w.columns),M=(void 0!==(null===(x=this._config)||void 0===x?void 0:x.for_each)||void 0!==(null===(k=this._config)||void 0===k?void 0:k.for_each_from))&&F>1&&!(Number(null===(S=this._config)||void 0===S?void 0:S.min_column_width)>0),D=y(i),V=ut(this._config,D);return t`
      ${V.map(i=>{var s,n;return t`<ha-alert alert-type="warning">
            ${e("editor.override_misplaced",{key:i,kind:D,template:null!==(n=null===(s=this._config)||void 0===s?void 0:s.template)&&void 0!==n?n:""},this.hass)}
          </ha-alert>`})}
      ${M?t`<ha-alert alert-type="info">
              ${e("editor.columns_without_min_width",{columns:F},this.hass)}
            </ha-alert>`:t``}
      ${I?t`<ha-alert alert-type="warning">${e("editor.fit_hides_style",void 0,this.hass)}</ha-alert>`:t``}
      ${O.length?t`<ha-alert alert-type="error">
              ${e(1===O.length?"editor.required_one":"editor.required_many",{names:O.join(", ")},this.hass)}
            </ha-alert>`:t``}
      ${T.length?t`<ha-alert alert-type="warning">
              ${e(1===T.length?"editor.optional_one":"editor.optional_many",{names:T.join(", ")},this.hass)}
            </ha-alert>`:t``}
      ${E.map(i=>t`<ha-alert alert-type="warning">
            ${e("editor.invalid_value",{name:i.name,expected:i.expected},this.hass)}
          </ha-alert>`)}
      ${C.length?t`<ha-alert alert-type="info">
              ${e(1===C.length?"editor.unused_one":"editor.unused_many",{names:C.join(", ")},this.hass)}
            </ha-alert>`:t``}
    `}_valueChanged(t){var e,i;const s=t.detail.value,n=g(null===(e=this._templates)||void 0===e?void 0:e[s.template]);if(!n.length)return void r(this,"config-changed",{config:s});const a=[];for(const r of n){let t=s[Re+r.name];const e=this._shownAs.get(r.name);e&&t===e.shown&&(t=e.written),void 0!==t&&""!==t&&a.push({[r.name]:t})}Array.isArray(s.extras)&&a.push(...s.extras);const o=Object.assign(Object.assign({},this._config),{template:s.template}),l=pt(x(null===(i=this._config)||void 0===i?void 0:i.variables),a);l.length?o.variables=l:delete o.variables,$(o,"for_each",s.for_each),$(o,"for_each_from",s.for_each_from),$(o,"columns",s.columns),$(o,"min_column_width",s.min_column_width),$(o,"gap",s.gap),$(o,"lazy",!0===s.lazy||void 0),$(o,"lazy_eager",s.lazy_eager),r(this,"config-changed",{config:o})}_loadBorrowedTemplates(){if(!mt(this._lovelace))return;this._loadingTemplates=!0;const t=this._editingPlace();ft(this.hass,this._lovelace,t.view,void 0,t.section).then(t=>{this._templates=t,this._schema=void 0}).finally(()=>{this._loadingTemplates=!1,this.requestUpdate()})}}i([n()],Be.prototype,"_lovelace",void 0),i([n()],Be.prototype,"_config",void 0),i([s()],Be.prototype,"hass",void 0),i([n()],Be.prototype,"_loadingTemplates",void 0),i([n()],Be.prototype,"_ejectPending",void 0),i([n()],Be.prototype,"_sectionsPending",void 0),i([n()],Be.prototype,"_sectionsError",void 0),i([n()],Be.prototype,"_renderedTemplates",void 0);const Ye=/^[a-z_]+\.[a-z0-9_]+$/,Ge={base:"entity",label:"Entity",selector:{entity:{}},matches:t=>Ye.test(t)};function Ze(t,e){return{base:t,label:e,selector:{text:{}},matches:t=>t.trim().length>0}}const Qe={entity:Ge,entity_id:Ge,name:Ze("name","Name"),title:Ze("title","Title"),heading:Ze("heading","Heading"),icon:{base:"icon",label:"Icon",selector:{icon:{}},matches:t=>t.includes(":")}};function Xe(t,e){return 1===e?t.label:`${t.label} ${e}`}const ti=[bt,$t,...wt],ei=["card","badge","row","element","group"],ii=["type","template","description","variables","default",...ei,"style"];function si(t,e){if(Array.isArray(t))for(const i of t)si(i,e);else if(t&&"object"==typeof t){e(t);for(const i of Object.values(t))si(i,e)}}function ni(t){const e=new Set,i=new Set;si(t,t=>{const s=t.type;if("string"==typeof s){s.startsWith("custom:")&&!ti.includes(s)&&e.add(s);for(const e of xt(t))i.add(e)}});for(const s of yt(t))i.add(s);return{customTypes:[...e].sort(),templateRefs:[...i].sort()}}function ai(t,i){const s=t&&"object"==typeof t&&void 0!==t[_t]?Object.assign(Object.assign({},t),{default:vt(t)}):t,n={};for(const e of ii)void 0!==(null==s?void 0:s[e])&&(n[e]=s[e]);for(const e of Object.keys(null!=s?s:{}))e in n||e===_t||"source"===e||(n[e]=s[e]);const{customTypes:a,templateRefs:o}=ni(t),r=[];if(i){const t={},e=[...o];for(;e.length;){const s=e.shift();if(s in t)continue;const n=i[s];n?(t[s]=oi(n),e.push(...ni(n).templateRefs)):r.push(s)}Object.keys(t).length&&(n.includes=t)}else r.push(...o);const l=[];return a.length&&l.push(e("share.requires_custom_cards",{types:a.join(", ")})),r.length&&l.push(e("share.uses_other_templates",{names:r.join(", ")})),{payload:n,notes:l}}function oi(t){if(!t||"object"!=typeof t||Array.isArray(t))return t;const e=Object.assign({},t);return delete e.source,e}function ri(t,e){if(!e.includes(t))return t;let i=2;for(;e.includes(`${t}_${i}`);)i+=1;return`${t}_${i}`}function li(t){if(!t||"object"!=typeof t||Array.isArray(t))return{ok:!1,errors:[e("share.import_not_a_template")]};const i=[];"string"==typeof t.template&&t.template.trim()||i.push(e("share.import_no_name"));const s=ei.filter(e=>void 0!==t[e]);return 0===s.length?i.push(e("share.import_defines_nothing")):s.length>1&&i.push(e("share.import_defines_both",{first:s[0],second:s[1]})),{ok:0===i.length,errors:i}}const ci=["card","badge","row","element","group"],hi=/^[A-Za-z0-9_-]+$/,di=/^[a-z_]+\.[a-z0-9_]+$/;function ui(t){return ci.find(e=>void 0!==(null==t?void 0:t[e])&&null!==(null==t?void 0:t[e]))}function pi(t){return t.map(t=>"number"==typeof t?`#${t+1}`:t).join(" › ")}function mi(t){const e=new Set;for(const n of kt(null==t?void 0:t.variables))n&&"string"==typeof n.name&&e.add(n.name);const i=JSON.stringify(null!=t?t:{}),s=/\[\[([A-Za-z0-9_-]+)/g;for(let n=s.exec(i);n;n=s.exec(i))e.add(n[1]);return[...e]}function fi(t){return"boolean"==typeof t?"boolean":"number"==typeof t?"number":"string"==typeof t&&di.test(t)?"entity":"string"==typeof t&&/^[a-z]+:[a-z0-9-]+$/.test(t)?"icon":"text"}function gi(t,e,i){if(!e.length)return i;const[s,...n]=e;return Array.isArray(t)?t.map((t,e)=>e===s?gi(t,n,i):t):Object.assign(Object.assign({},t),{[s]:gi(null==t?void 0:t[s],n,i)})}const _i=["card","badge","row","element","group","style","let","default","grid_options","name"],vi="default:",yi="or:";function bi(t){return t.startsWith(yi)?t.slice(3):Et(t)}function $i(t,e,i){if(!t.includes("[[")&&!t.includes("]]"))return;const s=function(t){let e=0,i=!1;for(let s=0;s<t.length-1;s+=1){const n=t.slice(s,s+2);"[["===n?(e+=1,s+=1):"]]"===n&&(0===e?i=!0:e-=1,s+=1)}return{unclosed:e>0,stray:i}}(t);s.unclosed&&i.findings.push({level:"warning",key:"lint.unclosed",params:{},path:e}),s.stray&&i.findings.push({level:"warning",key:"lint.stray_close",params:{},path:e});let n=t;for(let a=0;a<5;a+=1){let t=!1;if(n=n.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(s,n)=>(t=!0,n.startsWith(jt)||wi(n,e,i),"_")),!t)break}}function wi(t,e,i){const s=t.endsWith("?")?t.slice(0,-1):t,[n,...a]=s.split("|"),o=`[[${t}]]`,r=(n.endsWith("?")?n.slice(0,-1):n).split(".")[0];r&&"_"!==r&&!i.heads.has(r)&&i.heads.set(r,e);let l=!1;for(const c of a){if(!Ct(c)){const t=Ot(c);i.findings.push({level:"warning",key:"lint.unknown_step",params:t?{step:c,placeholder:o,closest:t}:{step:c,placeholder:o},path:e});continue}(c.startsWith(vi)||c.startsWith(yi))&&l&&i.findings.push({level:"warning",key:"lint.after_default",params:{step:c,placeholder:o},path:e}),c.startsWith(vi)&&c.length>8&&(l=!0);const t=bi(c);t&&"_"!==t&&i.targets.push({name:t,placeholder:o,path:e})}}function xi(t,e,i){if("string"!=typeof t){if(Array.isArray(t))t.forEach((t,s)=>xi(t,`${e}[${s}]`,i));else if(t&&"object"==typeof t)for(const[s,n]of Object.entries(t))$i(s,e,i),xi(n,e?`${e}.${s}`:s,i)}else $i(t,e,i)}function ki(t){const e=new Set;for(const i of g(t))e.add(i.name);for(const i of[...rt(vt(t)),...rt(null==t?void 0:t.let)]){const t=A(i);void 0!==t&&e.add(t)}return[...e]}const Si={card:{type:"entity",entity:"sun.sun"},badge:{type:"entity",entity:"sun.sun"},row:{entity:"sun.sun"},element:{type:"icon",icon:"mdi:weather-sunny",style:{color:"yellow"}}},Ai=50,ji=t=>!!customElements.get(t),Ci=t=>t.actions.length>0||t.urls.length>0||t.embeds||t.scripts||t.placeholders||t.overlay;const Oi=500;function Ei(e){const i=t=>{var i;return e.onInput(null!==(i=t.target.value)&&void 0!==i?i:"")},s=t=>{var i;return null===(i=e.onKeydown)||void 0===i?void 0:i.call(e,t)};return ji("ha-input")?t`<ha-input
        label=${e.label}
        .value=${e.value}
        .disabled=${!0===e.disabled}
        @input=${i}
        @keydown=${s}
      ></ha-input>`:t`<ha-textfield
        label=${e.label}
        .value=${e.value}
        .disabled=${!0===e.disabled}
        @input=${i}
        @keydown=${s}
      ></ha-textfield>`}async function Ti(t,i,s,n){var a;if(!M())return t._toolError=e("tools.cannot_save_here",void 0,t.hass),!1;t._busy=!0,t._toolError=void 0;try{return await V(t,t.hass,s,[{urlPath:z(),build:i}],n),t._undoChanged=void 0,!0}catch(o){return t._toolError=e("tools.save_failed",{message:null!==(a=null==o?void 0:o.message)&&void 0!==a?a:o},t.hass),!1}finally{t._busy=!1}}const Pi=o`
  ${Pt.styles}
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
 */;let Ni=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ii={},Fi=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends Ni{constructor(){super(...arguments),this.key=Nt}render(t,e){return this.key=t,e}update(t,[e,i]){return e!==this.key&&(((t,e=Ii)=>{t._$AH=e;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */})(t),this.key=e),i}}),Li=[{name:"room_light_tile",summary:"A tile per light, with the light named after itself.",template:{description:"A tile for one light, taking its name from Home Assistant.",variables:[{name:"entity",label:"Light",selector:{entity:{domain:"light"}},required:!0},{name:"name",label:"Name",description:"Leave empty to use the light’s own name",selector:{text:{}}}],card:{type:"tile",entity:"[[entity]]",name:"[[name|or:entity|friendly_name]]",features:[{type:"light-brightness"}]}}},{name:"room_summary",summary:"A heading per area, listing the lights in it. Uses grouping.",template:{description:"One card per area, with a tile for every light in that area.",card:{type:"vertical-stack",cards:[{type:"markdown",content:"## [[area]]\n\n[[entity_count]] lights"},{type:"custom:decluttering-card-plus",template:"room_light_tile",for_each:"[[items]]"}]}}},{name:"sensor_line",summary:"An Entities row showing one sensor with its area.",template:{description:"A row for one sensor, labelled with the area it is in.",variables:[{name:"entity",label:"Sensor",selector:{entity:{}},required:!0}],row:{entity:"[[entity]]",name:"[[entity|friendly_name]] ([[entity|area|default:no area]])"}}},{name:"status_badge",summary:"A badge that only appears when something needs attention.",template:{description:"A badge for one entity, hidden unless it is in the state you care about.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0},{name:"when",label:"Show when the state is",selector:{text:{}},default:"on"}],badge:{type:"entity",entity:"[[entity]]",visibility:[{condition:"state",entity:"[[entity]]",state:"[[when]]"}]}}},{name:"counted_grid",summary:'A numbered grid of anything, showing "3 of 12".',template:{description:"A tile that knows where it sits in a repeat.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0}],card:{type:"tile",entity:"[[entity]]",name:"[[entity|friendly_name]]",footer:{type:"markdown",content:"[[index]] of [[total|or:count]]"}}}}];function Mi(t){return Li.find(e=>e.name===t)}function Di(t,e){const i=new Set,s=t=>{Array.isArray(t)?t.forEach(s):t&&"object"==typeof t&&("string"==typeof t.type&&t.type.includes("decluttering-card")&&"string"==typeof t.template&&i.add(t.template),Object.values(t).forEach(s))};return s(t.template),[...i].filter(t=>!e.includes(t))}function Vi(t,e){return{library:t,version:e}}
/*! js-yaml 5.5.0 https://github.com/nodeca/js-yaml @license MIT */var Ri=Symbol("NOT_RESOLVED");function zi(t,e){return{tagName:t,nodeKind:"scalar",implicit:e.implicit??!1,matchByTagPrefix:e.matchByTagPrefix??!1,implicitFirstChars:e.implicitFirstChars??null,resolve:e.resolve,identify:e.identify,represent:e.represent??(t=>String(t)),representTagName:e.representTagName??(()=>t)}}function qi(t,e){const i=void 0===e.finalize;return{tagName:t,nodeKind:"sequence",implicit:!1,matchByTagPrefix:e.matchByTagPrefix??!1,create:e.create,addItem:e.addItem,finalize:e.finalize??(t=>t),carrierIsResult:i,identify:e.identify,represent:e.represent??(t=>t),representTagName:e.representTagName??(()=>t)}}function Ui(t,e){const i=void 0===e.finalize;return{tagName:t,nodeKind:"mapping",implicit:!1,matchByTagPrefix:e.matchByTagPrefix??!1,create:e.create,addPair:e.addPair,has:e.has,keys:e.keys,get:e.get,finalize:e.finalize??(t=>t),carrierIsResult:i,identify:e.identify,represent:e.represent??(t=>t),representTagName:e.representTagName??(()=>t)}}var Hi=zi("tag:yaml.org,2002:str",{resolve:t=>t,identify:t=>"string"==typeof t}),Ki=["","~","null","Null","NULL"],Wi=zi("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:t=>-1!==Ki.indexOf(t)?null:Ri,identify:t=>null===t,represent:()=>"null"}),Ji=zi("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(t,e)=>"null"===t||e&&""===t?null:Ri,identify:t=>null===t,represent:()=>"null"}),Bi=["","~","null","Null","NULL"],Yi=zi("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:t=>-1!==Bi.indexOf(t)?null:Ri,identify:t=>null===t,represent:()=>"null"}),Gi=["true","True","TRUE"],Zi=["false","False","FALSE"],Qi=zi("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:t=>-1!==Gi.indexOf(t)||-1===Zi.indexOf(t)&&Ri,identify:t=>"[object Boolean]"===Object.prototype.toString.call(t),represent:t=>t?"true":"false"}),Xi=["true"],ts=["false"],es=zi("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:t=>-1!==Xi.indexOf(t)||-1===ts.indexOf(t)&&Ri,identify:t=>"[object Boolean]"===Object.prototype.toString.call(t),represent:t=>t?"true":"false"}),is=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],ss=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],ns=zi("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:t=>-1!==is.indexOf(t)||-1===ss.indexOf(t)&&Ri,identify:t=>"[object Boolean]"===Object.prototype.toString.call(t),represent:t=>t?"true":"false"}),as=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),os=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var rs=zi("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(t,e){if(e){if(!os.test(t))return Ri}else if(!as.test(t))return Ri;const i=function(t){let e=t,i=1;return"-"!==e[0]&&"+"!==e[0]||("-"===e[0]&&(i=-1),e=e.slice(1)),e.startsWith("0b")?i*parseInt(e.slice(2),2):e.startsWith("0o")?i*parseInt(e.slice(2),8):e.startsWith("0x")?i*parseInt(e.slice(2),16):i*parseInt(e,10)}(t);return Number.isFinite(i)?i:Ri},identify:t=>Number.isInteger(t)&&!Object.is(t,-0)&&t.toString(10).indexOf("e")<0,represent:t=>t.toString(10)}),ls=new RegExp("^-?(?:0|[1-9][0-9]*)$"),cs=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var hs=zi("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(t,e){if(e){if(!cs.test(t))return Ri}else if(!ls.test(t))return Ri;const i=function(t){let e=t,i=1;return"-"!==e[0]&&"+"!==e[0]||("-"===e[0]&&(i=-1),e=e.slice(1)),e.startsWith("0b")?i*parseInt(e.slice(2),2):e.startsWith("0o")?i*parseInt(e.slice(2),8):e.startsWith("0x")?i*parseInt(e.slice(2),16):i*parseInt(e,10)}(t);return Number.isFinite(i)?i:Ri},identify:t=>Number.isInteger(t)&&!Object.is(t,-0)&&t.toString(10).indexOf("e")<0,represent:t=>t.toString(10)}),ds=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$");var us=zi("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(t){if(!ds.test(t))return Ri;const e=function(t){let e=t.replace(/_/g,""),i=1;if("-"!==e[0]&&"+"!==e[0]||("-"===e[0]&&(i=-1),e=e.slice(1)),e.startsWith("0b"))return i*parseInt(e.slice(2),2);if(e.startsWith("0x"))return i*parseInt(e.slice(2),16);if(e.includes(":")){let t=0;for(const i of e.split(":"))t=60*t+Number(i);return i*t}return"0"!==e&&"0"===e[0]?i*parseInt(e,8):i*parseInt(e,10)}(t);return Number.isFinite(e)?e:Ri},identify:t=>Number.isInteger(t)&&!Object.is(t,-0)&&t.toString(10).indexOf("e")<0,represent:t=>t.toString(10)}),ps=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ms=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var fs=zi("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(t){if(!ps.test(t))return Ri;let e=t.toLowerCase();const i="-"===e[0]?-1:1;if("+-".includes(e[0])&&(e=e.slice(1)),".inf"===e)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===e)return NaN;const s=i*parseFloat(e);return Number.isFinite(s)||ms.test(t)?s:Ri},identify:t=>"number"==typeof t&&(!Number.isInteger(t)||Object.is(t,-0)||t.toString(10).indexOf("e")>=0),represent:function(t){if(isNaN(t))return".nan";if(t===Number.POSITIVE_INFINITY)return".inf";if(t===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(t,-0))return"-0.0";const e=t.toString(10);return/^[-+]?[0-9]+e/.test(e)?e.replace("e",".e"):e}}),gs=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),_s=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var vs=zi("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(t,e){if(e){if(!_s.test(t))return Ri;let e=t.toLowerCase();const i="-"===e[0]?-1:1;if("+-".includes(e[0])&&(e=e.slice(1)),".inf"===e)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===e)return NaN;const s=i*parseFloat(e);return Number.isFinite(s)?s:Ri}if(!gs.test(t))return Ri;const i=Number(t);return Number.isFinite(i)?i:Ri},identify:t=>"number"==typeof t&&(!Number.isInteger(t)||Object.is(t,-0)||t.toString(10).indexOf("e")>=0),represent:function(t){if(isNaN(t))return".nan";if(t===Number.POSITIVE_INFINITY)return".inf";if(t===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(t,-0))return"-0.0";const e=t.toString(10);return/^[-+]?[0-9]+e/.test(e)?e.replace("e",".e"):e}}),ys=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),bs=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var $s=zi("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(t){if(!ys.test(t))return Ri;let e=t.toLowerCase().replace(/_/g,"");const i="-"===e[0]?-1:1;if("+-".includes(e[0])&&(e=e.slice(1)),".inf"===e)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===e)return NaN;let s=0;if(e.includes(":")){for(const t of e.split(":"))s=60*s+Number(t);s*=i}else s=i*parseFloat(e);return Number.isFinite(s)||bs.test(t)?s:Ri},identify:t=>"number"==typeof t&&(!Number.isInteger(t)||Object.is(t,-0)||t.toString(10).indexOf("e")>=0),represent:function(t){if(isNaN(t))return".nan";if(t===Number.POSITIVE_INFINITY)return".inf";if(t===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(t,-0))return"-0.0";const e=t.toString(10);return/^[-+]?[0-9]+e/.test(e)?e.replace("e",".e"):e}}),ws=zi("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(t,e)=>"<<"===t||e&&""===t?"<<":Ri,identify:()=>!1}),xs=/^[A-Za-z0-9+/]*={0,2}$/;var ks=zi("tag:yaml.org,2002:binary",{resolve:function(t){const e=t.replace(/\s/g,"");if(e.length%4!=0||!xs.test(e))return Ri;const i=atob(e),s=new Uint8Array(i.length);for(let n=0;n<i.length;n++)s[n]=i.charCodeAt(n);return s},identify:t=>"[object Uint8Array]"===Object.prototype.toString.call(t),represent:function(t){let e="";for(let i=0;i<t.length;i++)e+=String.fromCharCode(t[i]);return btoa(e)}}),Ss=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),As=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function js(t,e,i,s=0,n=0,a=0,o=0){const r=new Date(Date.UTC(t,e,i,s,n,a,o));return r.setUTCFullYear(t,e,i),r}var Cs=zi("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(t){let e=Ss.exec(t);if(null===e&&(e=As.exec(t)),null===e)return Ri;const i=+e[1],s=+e[2]-1,n=+e[3];if(!e[4]){const t=js(i,s,n);return t.getUTCFullYear()!==i||t.getUTCMonth()!==s||t.getUTCDate()!==n?Ri:t}const a=+e[4],o=+e[5],r=+e[6];let l=0;if(a>23||o>59||r>59)return Ri;if(e[7]){let t=e[7].slice(0,3);for(;t.length<3;)t+="0";l=+t}const c=js(i,s,n,a,o,r,l);if(c.getUTCFullYear()!==i||c.getUTCMonth()!==s||c.getUTCDate()!==n)return Ri;if(e[9]){const t=+e[10],i=+(e[11]||0);if(t>23||i>59)return Ri;const s=6e4*(60*t+i);c.setTime(c.getTime()-("-"===e[9]?-s:s))}return c},identify:t=>t instanceof Date,represent:t=>t.toISOString()}),Os=qi("tag:yaml.org,2002:seq",{create:()=>[],addItem:(t,e)=>{t.push(e)},identify:Array.isArray});function Es(t){if(null===t||"object"!=typeof t||Array.isArray(t))return!1;const e=Object.getPrototypeOf(t);return null===e||e===Object.prototype}function Ts(t,e){const i={};for(const s of e)void 0!==t[s]&&(i[s]=t[s]);return i}var Ps=qi("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(t,e)=>{let i;if(e instanceof Map){if(1!==e.size)return"cannot resolve an ordered map item";i=e.keys().next().value}else{if(!Es(e))return"cannot resolve an ordered map item";{const t=Object.keys(e);if(1!==t.length)return"cannot resolve an ordered map item";i=t[0]}}return t.seen.has(i)?"duplicate key in ordered map":(t.seen.add(i),t.list.push(e),"")},finalize:t=>t.list,identify:()=>!1}),Ns=qi("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(t,e)=>{if(e instanceof Map)return 1!==e.size?"cannot resolve a pairs item":(t.push(e.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(e))return"cannot resolve a pairs item";const i=e,s=Object.keys(i);return 1!==s.length?"cannot resolve a pairs item":(t.push([s[0],i[s[0]]]),"")},identify:()=>!1}),Is=Ui("tag:yaml.org,2002:map",{create:()=>({}),identify:Es,represent:t=>{const e=new Map;for(const i of Object.keys(t))e.set(i,t[i]);return e},addPair:(t,e,i)=>{if(null!==e&&"object"==typeof e)return"object-based map does not support complex keys";const s=String(e);return"__proto__"===s?Object.defineProperty(t,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[s]=i,""},has:(t,e)=>(null===e||"object"!=typeof e)&&Object.prototype.hasOwnProperty.call(t,String(e)),keys:t=>Object.keys(t),get:(t,e)=>{const i=String(e);return Object.prototype.hasOwnProperty.call(t,i)?t[i]:null}}),Fs=Ui("tag:yaml.org,2002:set",{create:()=>new Set,identify:t=>t instanceof Set,represent:t=>{const e=new Map;for(const i of t)e.set(i,null);return e},addPair:(t,e,i)=>null!==i?"cannot resolve a set item":(t.add(e),""),has:(t,e)=>t.has(e),keys:t=>t.keys(),get:()=>null});var Ls=class t{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(t){const e=function(t){const e=[];for(const i of t){let t=e.length;for(let s=0;s<e.length;s++){const n=e[s];if(n.nodeKind===i.nodeKind&&n.tagName===i.tagName&&n.matchByTagPrefix===i.matchByTagPrefix){t=s;break}}e[t]=i}return e}(t),i=[],s={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},n={scalar:[],sequence:[],mapping:[]};for(const c of e){if("scalar"===c.nodeKind&&c.implicit){if(c.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(c)}switch(c.nodeKind){case"scalar":c.matchByTagPrefix?n.scalar.push(c):s.scalar[c.tagName]=c;break;case"sequence":c.matchByTagPrefix?n.sequence.push(c):s.sequence[c.tagName]=c;break;case"mapping":c.matchByTagPrefix?n.mapping.push(c):s.mapping[c.tagName]=c}}const a=i.filter(t=>null===t.implicitFirstChars),o=new Set;for(const c of i)if(null!==c.implicitFirstChars)for(const t of c.implicitFirstChars)o.add(t);const r=new Map;for(const c of o)r.set(c,i.filter(t=>null===t.implicitFirstChars||-1!==t.implicitFirstChars.indexOf(c)));const l=s.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=e,this.implicitScalarTags=i,this.implicitScalarByFirstChar=r,this.implicitScalarAnyFirstChar=a,this.defaultScalarTag=l,this.defaultSequenceTag=s.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=s.mapping["tag:yaml.org,2002:map"],this.exact=s,this.prefix=n}lookupScalarTag(t){const e=this.exact.scalar[t];if(e)return e;for(const i of this.prefix.scalar)if(t.startsWith(i.tagName))return i}lookupSequenceTag(t){const e=this.exact.sequence[t];if(e)return e;for(const i of this.prefix.sequence)if(t.startsWith(i.tagName))return i}lookupMappingTag(t){const e=this.exact.mapping[t];if(e)return e;for(const i of this.prefix.mapping)if(t.startsWith(i.tagName))return i}resolveImplicitScalarTag(t){const e=this.implicitScalarByFirstChar.get(t.charAt(0))??this.implicitScalarAnyFirstChar;for(const s of e){const e=s.resolve(t,!1,s.tagName);if(e!==Ri)return{value:e,tag:s}}const i=this.defaultScalarTag;return{value:i.resolve(t,!1,i.tagName),tag:i}}withTags(...e){let i=[];for(const t of e)i=i.concat(t);return new t([...this.tags,...i])}},Ms=new Ls([Hi,Os,Is]);new Ls([...Ms.tags,Ji,es,hs,vs]);var Ds=new Ls([...Ms.tags,Wi,Qi,rs,fs]);function Vs(t){if(Array.isArray(t)){const e=Array.prototype.slice.call(t);for(let t=0;t<e.length;t++){if(Array.isArray(e[t]))return null;"object"==typeof e[t]&&"[object Object]"===Object.prototype.toString.call(e[t])&&(e[t]="[object Object]")}return String(e)}return"object"==typeof t&&"[object Object]"===Object.prototype.toString.call(t)?"[object Object]":String(t)}new Ls([...Ms.tags,Yi,ns,us,$s,Cs,ws,ks,Ps,Ns,Fs]).withTags({...us,resolve:(t,e,i)=>{const s=us.resolve(t,e,i);return s===Ri?rs.resolve(t,e,i):s}},{...$s,resolve:(t,e,i)=>{const s=$s.resolve(t,e,i);return s===Ri?fs.resolve(t,e,i):s}}),Ui("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(t,e,i)=>(t.set(e,i),""),has:(t,e)=>t.has(e),keys:t=>t.keys(),get:(t,e)=>t.get(e),identify:t=>t instanceof Map||Es(t),represent:t=>{if(t instanceof Map)return t;const e=new Map,i=t;for(const s of Object.keys(i))e.set(s,i[s]);return e}}),Ui("tag:yaml.org,2002:map",{create:()=>({}),identify:Es,represent:t=>{const e=new Map;for(const i of Object.keys(t))e.set(i,t[i]);return e},addPair:(t,e,i)=>{const s=Vs(e);return null===s?"nested arrays are not supported inside keys":("__proto__"===s?Object.defineProperty(t,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[s]=i,"")},has:(t,e)=>{const i=Vs(e);return null!==i&&Object.prototype.hasOwnProperty.call(t,i)},keys:t=>Object.keys(t),get:(t,e)=>{const i=String(e);return Object.prototype.hasOwnProperty.call(t,i)?t[i]:null}});var Rs={maxLength:79,indent:1,linesBefore:3,linesAfter:2};function zs(t,e,i,s,n){let a="",o="";const r=Math.floor(n/2)-1;return s-e>r&&(a=" ... ",e=s-r+a.length),i-s>r&&(o=" ...",i=s+r-o.length),{str:a+t.slice(e,i).replace(/\t/g,"→")+o,pos:s-e+a.length}}function qs(t,e){return" ".repeat(Math.max(e-t.length,0))+t}function Us(t,e){let i="";return t.mark?(t.mark.name&&(i+=`in "${t.mark.name}" `),i+=`(${t.mark.line+1}:${t.mark.column+1})`,!e&&t.mark.snippet&&(i+=`\n\n${t.mark.snippet}`),`${t.reason} ${i}`):t.reason}var Hs=class t extends Error{reason;mark;constructor(t,e){super(),this.name="YAMLException",this.reason=t,this.mark=e,this.message=Us(this,!1),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}toString(t){return`${this.name}: ${Us(this,t)}`}static throwAt(e,i,s,n=""){let a=0,o=0;for(let t=0;t<i;t++){const i=e.charCodeAt(t);10===i?(a++,o=t+1):13===i&&(a++,10===e.charCodeAt(t+1)&&t++,o=t+1)}const r={name:n,buffer:e,position:i,line:a,column:i-o};throw r.snippet=function(t,e){if(!t.buffer)return null;const i={...Rs,...e},s=/\r?\n|\r|\0/g,n=[0],a=[];let o,r=-1;for(;o=s.exec(t.buffer);)a.push(o.index),n.push(o.index+o[0].length),t.position<=o.index&&r<0&&(r=n.length-2);r<0&&(r=n.length-1);let l="";const c=Math.min(t.line+i.linesAfter,a.length).toString().length,h=i.maxLength-(i.indent+c+3);for(let u=1;u<=i.linesBefore&&!(r-u<0);u++){const e=zs(t.buffer,n[r-u],a[r-u],t.position-(n[r]-n[r-u]),h);l=`${" ".repeat(i.indent)}${qs((t.line-u+1).toString(),c)} | ${e.str}\n${l}`}const d=zs(t.buffer,n[r],a[r],t.position,h);l+=`${" ".repeat(i.indent)}${qs((t.line+1).toString(),c)} | ${d.str}\n`,l+=`${"-".repeat(i.indent+c+3+d.pos)}^\n`;for(let u=1;u<=i.linesAfter&&!(r+u>=a.length);u++){const e=zs(t.buffer,n[r+u],a[r+u],t.position-(n[r]-n[r+u]),h);l+=`${" ".repeat(i.indent)}${qs((t.line+u+1).toString(),c)} | ${e.str}\n`}return l.replace(/\n$/,"")}(r),new t(s,r)}},Ks=1,Ws=2,Js=3,Bs=4,Ys=5,Gs=6,Zs=1,Qs=2,Xs=3,tn=4,en=5,sn=1,nn=2,an=1,on=2,rn=3;function ln(t){switch(t){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}var cn=new Array(256),hn=new Array(256);for(let ir=0;ir<256;ir++)cn[ir]=ln(ir)?1:0,hn[ir]=ln(ir);function dn(t){return t<=65535?String.fromCharCode(t):String.fromCharCode(55296+(t-65536>>10),56320+(t-65536&1023))}function un(t){return t>=48&&t<=57?t-48:(32|t)-97+10}function pn(t){return 120===t?2:117===t?4:8}function mn(t,e,i){let s=0;for(;e<i;){const i=t.charCodeAt(e);if(10===i)s++,e++;else if(13===i)s++,e++,10===t.charCodeAt(e)&&e++;else{if(32!==i&&9!==i)break;e++}}return{position:e,breaks:s}}function fn(t){return 1===t?" ":"\n".repeat(t-1)}function gn(t,e,i,s,n,a){const o=s<0?0:s,r=t.slice(e,i).replace(/\r\n?/g,"\n"),l=""===r?[]:(r.endsWith("\n")?r.slice(0,-1):r).split("\n");let c="",h=!1,d=0,u=!1;for(const p of l){let t=0;for(;t<o&&32===p.charCodeAt(t);)t++;if(s<0||t>=p.length){d++;continue}const e=p.slice(o),i=e.charCodeAt(0);a?32===i||9===i?(u=!0,c+="\n".repeat(h?1+d:d)):u?(u=!1,c+="\n".repeat(d+1)):0===d?h&&(c+=" "):c+="\n".repeat(d):c+="\n".repeat(h?1+d:d),c+=e,h=!0,d=0}return n===rn?c+="\n".repeat(h?1+d:d):n!==on&&h&&(c+="\n"),c}function _n(t,e){if(-1===e.valueStart)return"";const{valueStart:i,valueEnd:s}=e;if(e.fast)return t.slice(i,s);switch(e.style){case Qs:return function(t,e,i){let s="",n=e,a=e,o=e;for(;n<i;){const e=t.charCodeAt(n);if(39===e)s+=t.slice(a,n)+"'",n+=2,a=o=n;else if(10===e||13===e){s+=t.slice(a,o);const e=mn(t,n,i);s+=fn(e.breaks),n=a=o=e.position}else n++,32!==e&&9!==e&&(o=n)}return s+t.slice(a,i)}(t,i,s);case Xs:return function(t,e,i){let s="",n=e,a=e,o=e;for(;n<i;){const e=t.charCodeAt(n);if(92===e){s+=t.slice(a,n),n++;const e=t.charCodeAt(n);if(10===e||13===e)n=mn(t,n,i).position;else if(e<256&&cn[e])s+=hn[e],n++;else{let i=pn(e),a=0;for(;i>0;i--)n++,a=(a<<4)+un(t.charCodeAt(n));s+=dn(a),n++}a=o=n}else if(10===e||13===e){s+=t.slice(a,o);const e=mn(t,n,i);s+=fn(e.breaks),n=a=o=e.position}else n++,32!==e&&9!==e&&(o=n)}return s+t.slice(a,i)}(t,i,s);case tn:return gn(t,i,s,e.indent,e.chomping,!1);case en:return gn(t,i,s,e.indent,e.chomping,!0);default:return function(t,e,i){let s="",n=e,a=e,o=e;for(;n<i;){const e=t.charCodeAt(n);if(10===e||13===e){s+=t.slice(a,o);const e=mn(t,n,i);s+=fn(e.breaks),n=a=o=e.position}else n++,32!==e&&9!==e&&(o=n)}return s+t.slice(a,o)}(t,i,s)}}var vn=Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"});function yn(t){let e="",i=0;for(;i<t.length;){if(37!==t.charCodeAt(i)){e+=t[i++];continue}let s=parseInt(t.slice(i+1,i+3),16);if(i+=3,s>=192){let e=s<224?1:s<240?2:3;for(s&=(1<<6-e)-1;e-- >0;)s=s<<6|63&parseInt(t.slice(i+1,i+3),16),i+=3}s<65536?e+=String.fromCharCode(s):(s-=65536,e+=String.fromCharCode(55296|s>>10,56320|1023&s))}return e}function bn(t,e){if(t.startsWith("!<")&&t.endsWith(">"))return yn(t.slice(2,-1));const i=t.indexOf("!",1),s=-1===i?"!":t.slice(0,i+1);return yn(e?.[s]??vn[s]??s)+yn(t.slice(s.length))}var $n=-1,wn={filename:"",schema:Ds,json:!1,maxTotalMergeKeys:1e4,maxAliases:-1};function xn(t){return"tagStart"in t&&t.tagStart!==$n?t.tagStart:"anchorStart"in t&&t.anchorStart!==$n?t.anchorStart:"valueStart"in t&&t.valueStart!==$n?t.valueStart:"start"in t?t.start:0}function kn(t,e){Hs.throwAt(t.source,t.position,e,t.filename)}function Sn(t,e,i,s){try{return i.finalize(s)}catch(n){if(n instanceof Hs)throw n;Hs.throwAt(t.source,e,n instanceof Error?n.message:String(n),t.filename)}}function An(t,e){const i=_n(t.source,e),s=e.tagStart===$n?"":t.source.slice(e.tagStart,e.tagEnd),n=t.schema.defaultScalarTag;if(""!==s){if("!"===s)return{value:i,tag:n};const e=bn(s,t.tagHandlers),a=t.schema.lookupScalarTag(e);if(a){const s=a.resolve(i,!0,e);return s===Ri&&kn(t,`cannot resolve a node with !<${e}> explicit tag`),{value:s,tag:a}}const o=t.schema.lookupMappingTag(e)??t.schema.lookupSequenceTag(e);if(o){""!==i&&kn(t,`cannot resolve a node with !<${e}> explicit tag`);const s=o.create(e);return{value:o.carrierIsResult?s:Sn(t,t.position,o,s),tag:o}}kn(t,`unknown scalar tag !<${e}>`)}return e.style===Zs?t.schema.resolveImplicitScalarTag(i):{value:n.resolve(i,!1,n.tagName),tag:n}}function jn(t,e,i){const s=e.tagStart===$n?"":t.source.slice(e.tagStart,e.tagEnd);return""===s||"!"===s?i:bn(s,t.tagHandlers)}function Cn(t){return"mapping"===t.nodeKind}function On(t){t.totalMergeKeys++,-1!==t.maxTotalMergeKeys&&t.totalMergeKeys>t.maxTotalMergeKeys&&kn(t,`merge keys exceeded maxTotalMergeKeys (${t.maxTotalMergeKeys})`)}function En(t,e,i,s){On(t);for(const n of s.keys(i)){if(On(t),e.tag.has(e.value,n))continue;const a=e.tag.addPair(e.value,n,s.get(i,n));a&&kn(t,a),e.overridable??=new Set,e.overridable.add(n)}}function Tn(t,e,i,s,n){if(t.position=e.keyPosition,e.keyIsMerge)return void function(t,e,i,s){if(t.position=e.keyPosition,Cn(s))En(t,e,i,s);else if("sequence"===s.nodeKind&&Array.isArray(i)){i.length>100&&kn(t,"abnormal merge sequence size");for(const s of i){const i=t.nodeTags.get(s);i||kn(t,"cannot merge mappings; the provided source object is unacceptable"),En(t,e,s,i)}}else kn(t,"cannot merge mappings; the provided source object is unacceptable")}(t,e,s,n);t.json||!e.tag.has(e.value,i)||e.overridable?.has(i)||kn(t,"duplicated mapping key");const a=e.tag.addPair(e.value,i,s);a&&kn(t,a),e.overridable?.delete(i)}function Pn(t,e,i){const s=t.frames[t.frames.length-1];if("document"===s.kind)s.value=e,s.hasValue=!0;else if("sequence"===s.kind){Cn(i)&&t.nodeTags.set(e,i);const n=s.tag.addItem(s.value,e,s.index++);n&&kn(t,n)}else if(s.hasKey){const n=s.key;s.key=void 0,s.hasKey=!1,Tn(t,s,n,e,i)}else s.key=e,s.keyPosition=t.position,s.hasKey=!0,s.keyIsMerge="tag:yaml.org,2002:merge"===i.tagName}function Nn(t,e,i,s,n){if(e.anchorStart!==$n){const a={value:i,tag:s,isValueFinal:n};return t.anchors.set(t.source.slice(e.anchorStart,e.anchorEnd),a),a}return null}var In=-1,Fn=Object.prototype.hasOwnProperty,Ln=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Mn=/[,\[\]{}]/,Dn=/^(?:!|!!|![0-9A-Za-z-]+!)$/,Vn=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,Rn=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`,zn=new RegExp(`^(?:${Vn})*$`),qn=new RegExp(`^(?:${Rn})+$`),Un=new RegExp(`^(?:!(?:${Vn})*|${Rn}(?:${Vn})*)$`),Hn={filename:"",maxDepth:100};function Kn(t,e,i,s,n,a,o){t.events.push({type:Ws,start:e,anchorStart:i,anchorEnd:s,tagStart:n,tagEnd:a,style:o})}function Wn(t,e,i,s,n,a,o){t.events.push({type:Js,start:e,anchorStart:i,anchorEnd:s,tagStart:n,tagEnd:a,style:o})}function Jn(t,e){t.events.splice(e.eventsLength,0,{type:Js,start:e.position,anchorStart:In,anchorEnd:In,tagStart:In,tagEnd:In,style:nn})}function Bn(t,e,i,s,n,a,o,r,l=an,c=-1,h=!1){t.events.push({type:Bs,valueStart:e,valueEnd:i,anchorStart:s,anchorEnd:n,tagStart:a,tagEnd:o,style:r,chomping:l,indent:c,fast:h})}function Yn(t){t.events.push({type:Gs})}function Gn(t){Bn(t,In,In,In,In,In,In,Zs)}function Zn(){return{anchorStart:In,anchorEnd:In,tagStart:In,tagEnd:In}}function Qn(t){return{position:t.position,line:t.line,lineStart:t.lineStart,lineIndent:t.lineIndent,firstTabInLine:t.firstTabInLine,eventsLength:t.events.length}}function Xn(t,e){t.position=e.position,t.line=e.line,t.lineStart=e.lineStart,t.lineIndent=e.lineIndent,t.firstTabInLine=e.firstTabInLine,t.events.length=e.eventsLength}function ta(t,e){Hs.throwAt(t.input.slice(0,t.length),t.position,e,t.filename)}function ea(t){return 10===t||13===t}function ia(t){return 9===t||32===t}function sa(t){return ia(t)||ea(t)}function na(t){return 0===t||sa(t)}function aa(t){return 44===t||91===t||93===t||123===t||125===t}function oa(t){return t>=48&&t<=57?t-48:-1}function ra(t){if(t>=48&&t<=57)return t-48;const e=32|t;return e>=97&&e<=102?e-97+10:-1}function la(t){return 120===t?2:117===t?4:85===t?8:0}function ca(t){return 48===t||97===t||98===t||116===t||9===t||110===t||118===t||102===t||114===t||101===t||32===t||34===t||47===t||92===t||78===t||95===t||76===t||80===t}function ha(t){10===t.input.charCodeAt(t.position)?t.position++:(t.position++,10===t.input.charCodeAt(t.position)&&t.position++),t.line++,t.lineStart=t.position,t.lineIndent=0,t.firstTabInLine=-1}function da(t,e){let i=0,s=t.input.charCodeAt(t.position),n=t.position===t.lineStart||sa(t.input.charCodeAt(t.position-1));for(;0!==s;){for(;ia(s);)n=!0,9===s&&-1===t.firstTabInLine&&(t.firstTabInLine=t.position),s=t.input.charCodeAt(++t.position);if(e&&n&&35===s)do{s=t.input.charCodeAt(++t.position)}while(!ea(s)&&0!==s);if(!ea(s))break;for(ha(t),i++,n=!0,s=t.input.charCodeAt(t.position);32===s;)t.lineIndent++,s=t.input.charCodeAt(++t.position)}return i}function ua(t,e=t.position){const i=t.input.charCodeAt(e);if((45===i||46===i)&&i===t.input.charCodeAt(e+1)&&i===t.input.charCodeAt(e+2)){const i=t.input.charCodeAt(e+3);return 0===i||sa(i)}return!1}function pa(t){t.position===t.lineStart&&65279===t.input.charCodeAt(t.position)&&(t.position++,t.lineStart=t.position)}function ma(t){if(t.position!==t.lineStart)return!1;if(ua(t))return!0;if(65279!==t.input.charCodeAt(t.position))return!1;const e=Qn(t);pa(t),da(t,!0);const i=t.input.charCodeAt(t.position),s=t.position===t.lineStart&&(37===i||45===i&&ua(t));return Xn(t,e),s}function fa(t){let e=t.input.charCodeAt(t.position);for(;0!==e&&!ea(e);)e=t.input.charCodeAt(++t.position)}function ga(t,e,i){const s=Ln.exec(t.input.slice(e,i));null!==s&&(t.position=e+s.index+s[0].length-1,ta(t,"the stream contains non-printable characters"))}function _a(t,e,i){if(33!==t.input.charCodeAt(t.position))return!1;e.tagStart!==In&&ta(t,"duplication of a tag property");const s=t.position;let n=!1,a=!1,o="!",r=t.input.charCodeAt(++t.position);60===r?(n=!0,r=t.input.charCodeAt(++t.position)):33===r&&(a=!0,o="!!",r=t.input.charCodeAt(++t.position));let l,c=t.position;if(n){for(;0!==r&&62!==r;)r=t.input.charCodeAt(++t.position);62!==r&&ta(t,"unexpected end of the stream within a verbatim tag"),l=t.input.slice(c,t.position),t.position++}else{for(;!(0===r||sa(r)||i&&aa(r));)33===r&&(a?ta(t,"tag suffix cannot contain exclamation marks"):(o=t.input.slice(c-1,t.position+1),Dn.test(o)||ta(t,"named tag handle cannot contain such characters"),a=!0,c=t.position+1)),r=t.input.charCodeAt(++t.position);l=t.input.slice(c,t.position),Mn.test(l)&&ta(t,"tag suffix cannot contain flow indicator characters")}return l&&!(n?zn.test(l):qn.test(l))&&ta(t,`tag name cannot contain such characters: ${l}`),n||"!"===o||"!!"===o||Fn.call(t.tagHandlers,o)||ta(t,`undeclared tag handle "${o}"`),e.tagStart=s,e.tagEnd=t.position,!0}function va(t,e){if(38!==t.input.charCodeAt(t.position))return!1;e.anchorStart!==In&&ta(t,"duplication of an anchor property"),t.position++;const i=t.position;for(;0!==t.input.charCodeAt(t.position)&&!sa(t.input.charCodeAt(t.position))&&!aa(t.input.charCodeAt(t.position));)t.position++;return t.position===i&&ta(t,"name of an anchor node must contain at least one character"),e.anchorStart=i,e.anchorEnd=t.position,!0}function ya(t,e){if(42!==t.input.charCodeAt(t.position))return!1;e.anchorStart===In&&e.tagStart===In||ta(t,"alias node should not have any properties"),t.position++;const i=t.position;for(;0!==t.input.charCodeAt(t.position)&&!sa(t.input.charCodeAt(t.position))&&!aa(t.input.charCodeAt(t.position));)t.position++;return t.position===i&&ta(t,"name of an alias node must contain at least one character"),function(t,e,i){t.events.push({type:Ys,anchorStart:e,anchorEnd:i})}(t,i,t.position),!0}function ba(t,e){da(t,!1),t.lineIndent<e&&ta(t,"deficient indentation")}function $a(t,e,i,s){if(!function(t,e){const i=t.input.charCodeAt(t.position),s=1===e;if(0===i||sa(i)||35===i||38===i||42===i||33===i||124===i||62===i||39===i||34===i||37===i||64===i||96===i||aa(i))return!1;if(63===i||45===i){const e=t.input.charCodeAt(t.position+1);if(na(e)||s&&aa(e))return!1}return!0}(t,i))return!1;const n=t.position;let a=t.position,o=t.input.charCodeAt(t.position);const r=1===i;let l=!1;for(;0!==o&&!ma(t);){if(58===o){const e=t.input.charCodeAt(t.position+1);if(na(e)||r&&aa(e))break}else if(35===o){if(sa(t.input.charCodeAt(t.position-1)))break}else{if(r&&aa(o))break;if(ea(o)){const i=t.position,s=t.line,n=t.lineStart,a=t.lineIndent;if(da(t,!1),t.lineIndent>=e){l=!0,o=t.input.charCodeAt(t.position);continue}t.position=i,t.line=s,t.lineStart=n,t.lineIndent=a;break}}ia(o)||(a=t.position+1),o=t.input.charCodeAt(++t.position)}return a!==n&&(ga(t,n,a),Bn(t,n,a,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,Zs,an,-1,!l),!0)}function wa(t,e){const i=t.line;da(t,!0),(t.line>i&&t.lineIndent<e||-1!==t.firstTabInLine&&t.lineIndent<e)&&ta(t,"deficient indentation")}function xa(t,e,i){if(-1!==t.firstTabInLine||45!==t.input.charCodeAt(t.position)||!na(t.input.charCodeAt(t.position+1)))return!1;for(Kn(t,t.position,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,sn);45===t.input.charCodeAt(t.position)&&na(t.input.charCodeAt(t.position+1));){-1!==t.firstTabInLine&&(t.position=t.firstTabInLine,ta(t,"tab characters must not be used in indentation"));const i=t.line;t.position++;const s=da(t,!0)>0;if(-1!==t.firstTabInLine&&45===t.input.charCodeAt(t.position)&&na(t.input.charCodeAt(t.position+1))&&ta(t,"bad indentation of a sequence entry"),s&&t.lineIndent<=e?Gn(t):Sa(t,e,3,!1,!0),da(t,!0),t.lineIndent<e||t.position>=t.length)break;t.lineIndent>e&&ta(t,"bad indentation of a sequence entry"),t.line===i&&45===t.input.charCodeAt(t.position)&&na(t.input.charCodeAt(t.position+1))&&ta(t,"bad indentation of a sequence entry")}return Yn(t),!0}function ka(t,e,i,s){let n=!1,a=!1,o=!1,r=!1;if(-1!==t.firstTabInLine)return!1;let l=t.input.charCodeAt(t.position);for(;0!==l;){n||-1===t.firstTabInLine||(t.position=t.firstTabInLine,ta(t,"tab characters must not be used in indentation"));const c=t.input.charCodeAt(t.position+1),h=t.line;if(63!==l&&58!==l||!na(c)){n&&(Gn(t),n=!1);const e=Qn(t);if(!Sa(t,i,2,!1,!0))break;if(t.line===h){for(l=t.input.charCodeAt(t.position);ia(l);)l=t.input.charCodeAt(++t.position);if(58===l)l=t.input.charCodeAt(++t.position),na(l)||ta(t,"a whitespace character is expected after the key-value separator within a block mapping"),o||(t.events.splice(e.eventsLength,0,{type:Js,start:e.position,anchorStart:s.anchorStart,anchorEnd:s.anchorEnd,tagStart:s.tagStart,tagEnd:s.tagEnd,style:sn}),o=!0),a=!0,n=!1,r=!1;else{if(!a)return s.anchorStart===In&&s.tagStart===In||(Xn(t,e),!1);ta(t,"expected ':' after a mapping key")}}else{if(!a)return s.anchorStart===In&&s.tagStart===In||(Xn(t,e),!1);ta(t,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else o||(Wn(t,t.position,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,sn),o=!0),63===l?(n&&Gn(t),a=!0,n=!0):(n||(Gn(t),a=!0),n=!1),t.position+=1,r=!0;if(Sa(t,e,4,!0,r)&&(r=!1),n||r&&(Gn(t),r=!1),da(t,!0),l=t.input.charCodeAt(t.position),(t.line===h||t.lineIndent>e)&&0!==l)ta(t,"bad indentation of a mapping entry");else if(t.lineIndent<e)break}return!!a&&(n&&Gn(t),o&&Yn(t),!0)}function Sa(t,e,i,s,n,a=!0){t.depth>=t.maxDepth&&ta(t,`nesting exceeded maxDepth (${t.maxDepth})`),t.depth++;let o=1,r=!1,l=!1,c=null;const h=Zn();let d=4===i||3===i,u=d;const p=d;if(s&&da(t,!0)&&(r=!0,o=t.lineIndent>e?1:t.lineIndent===e?0:-1),1===o)for(;;){const s=t.input.charCodeAt(t.position),n=Qn(t);if(r&&1!==o&&(33===s||38===s))break;if(r&&p&&(h.tagStart!==In||h.anchorStart!==In)&&(33===s||38===s)){const i=Qn(t),s=e+1;if(ka(t,t.position-t.lineStart,s,h)&&t.events[i.eventsLength]?.type===Js)return t.depth--,!0;Xn(t,i)}if(r&&(33===s&&h.tagStart!==In||38===s&&h.anchorStart!==In))break;if(!_a(t,h,1===i)&&!va(t,h))break;null===c&&(c=n),da(t,!0)?(r=!0,u=p,o=t.lineIndent>e?1:t.lineIndent===e?0:-1):u=!1}if(u&&(u=r||n),1===o||4===i){const s=1===i||2===i?e:e+1,n=t.position-t.lineStart;if(1===o)if(u&&(xa(t,n,h)||ka(t,n,s,h))||function(t,e,i){const s=t.input.charCodeAt(t.position),n=123===s,a=t.position;let o=!0;if(91!==s&&123!==s)return!1;const r=n?125:93;for(n?Wn(t,a,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,nn):Kn(t,a,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,nn),t.position++;0!==t.input.charCodeAt(t.position);){wa(t,e);let i=t.input.charCodeAt(t.position);if(i===r)return t.position++,Yn(t),!0;o?44===i&&ta(t,"expected the node content, but found ','"):ta(t,"missed comma between flow collection entries");let s=!1,a=!1;63===i&&sa(t.input.charCodeAt(t.position+1))&&(s=a=!0,t.position+=1,wa(t,e));const l=t.line,c=Qn(t),h=Sa(t,e,1,!1,!0);wa(t,e),i=t.input.charCodeAt(t.position),(n||a||t.line===l)&&58===i?(s=!0,t.position++,wa(t,e),n||Jn(t,c),h||Gn(t),Sa(t,e,1,!1,!0)||Gn(t),wa(t,e),n||Yn(t)):n&&s?(h||Gn(t),Gn(t)):n?Gn(t):s&&(Jn(t,c),h||Gn(t),Gn(t),Yn(t)),i=t.input.charCodeAt(t.position),44===i?(o=!0,t.position++):o=!1}ta(t,"unexpected end of the stream within a flow collection")}(t,s,h))l=!0;else{const e=t.input.charCodeAt(t.position);if(null!==c&&a&&p&&!u&&124!==e&&62!==e){const e=Qn(t),i=c.position-c.lineStart;Xn(t,c),ka(t,i,s,Zn())&&t.events[e.eventsLength]?.type===Js?l=!0:Xn(t,e)}!l&&(d&&function(t,e,i){const s=t.input.charCodeAt(t.position);let n=an,a=-1,o=!1;if(124!==s&&62!==s)return!1;const r=124===s?tn:en;for(t.position++;0!==t.input.charCodeAt(t.position);){const i=t.input.charCodeAt(t.position),s=oa(i);if(43===i||45===i)n!==an&&ta(t,"repeat of a chomping mode identifier"),n=43===i?rn:on,t.position++;else{if(!(s>=0))break;0===s&&ta(t,"bad explicit indentation width of a block scalar; it cannot be less than one"),o&&ta(t,"repeat of an indentation width identifier"),a=e+s-1,o=!0,t.position++}}let l=!1;for(;ia(t.input.charCodeAt(t.position));)l=!0,t.position++;l&&35===t.input.charCodeAt(t.position)&&fa(t),ea(t.input.charCodeAt(t.position))?ha(t):0!==t.input.charCodeAt(t.position)&&ta(t,"a line break is expected");let c=o?a:-1,h=0;const d=t.position;let u=t.position;for(;0!==t.input.charCodeAt(t.position);){const i=t.position;let s=0;for(;32===t.input.charCodeAt(i+s);)s++;const n=t.input.charCodeAt(i+s);if(0===n){c>=0?s>c&&(u=i+s):s>0&&(u=i+s);break}if(ma(t))break;if(!o&&-1===c&&ea(n)&&(h=Math.max(h,s)),o||-1!==c||ea(n)||(9===n&&s<e&&(t.position=i+s,ta(t,"tab characters must not be used in indentation")),s>=e&&s<h&&(t.position=i+s,ta(t,"bad indentation of a mapping entry"))),-1===c&&0!==n&&!ea(n)&&s<e){t.lineIndent=s,t.position=i+s;break}o||0===n||ea(n)||-1!==c||(c=s);const a=-1===c?e+1:c;if(0!==n&&!ea(n)&&s<a){t.lineIndent=s,t.position=i+s;break}fa(t),u=t.position,ea(t.input.charCodeAt(t.position))&&(ha(t),u=t.position)}return ga(t,d,u),Bn(t,d,u,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,r,n,c),!0}(t,s,h)||function(t,e,i){if(39!==t.input.charCodeAt(t.position))return!1;t.position++;const s=t.position;let n=!0;for(;0!==t.input.charCodeAt(t.position);){const a=t.input.charCodeAt(t.position);if(39===a){if(39===t.input.charCodeAt(t.position+1)){n=!1,t.position+=2;continue}const e=t.position;return t.position++,Bn(t,s,e,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Qs,an,-1,n),!0}ea(a)?(n=!1,ba(t,e)):t.position===t.lineStart&&ua(t)?ta(t,"unexpected end of the document within a single quoted scalar"):9!==a&&a<32?ta(t,"expected valid JSON character"):t.position++}ta(t,"unexpected end of the stream within a single quoted scalar")}(t,s,h)||function(t,e,i){if(34!==t.input.charCodeAt(t.position))return!1;t.position++;const s=t.position;let n=!0;for(;0!==t.input.charCodeAt(t.position);){const a=t.input.charCodeAt(t.position);if(34===a){const e=t.position;return t.position++,Bn(t,s,e,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Xs,an,-1,n),!0}if(92===a){n=!1;const i=t.input.charCodeAt(++t.position);if(ea(i))ba(t,e);else if(ca(i))t.position++;else{let e=la(i);for(0===e&&ta(t,"unknown escape sequence");e-- >0;)t.position++,ra(t.input.charCodeAt(t.position))<0&&ta(t,"expected hexadecimal character");t.position++}}else ea(a)?(n=!1,ba(t,e)):t.position===t.lineStart&&ua(t)?ta(t,"unexpected end of the document within a double quoted scalar"):9!==a&&a<32?ta(t,"expected valid JSON character"):t.position++}ta(t,"unexpected end of the stream within a double quoted scalar")}(t,s,h)||ya(t,h)||$a(t,s,i,h))&&(l=!0)}else 0===o&&(l=u&&xa(t,n,h))}return d=d&&!l,l||h.anchorStart===In&&h.tagStart===In&&!d||(Bn(t,In,In,h.anchorStart,h.anchorEnd,h.tagStart,h.tagEnd,Zs),l=!0),t.depth--,l||h.anchorStart!==In||h.tagStart!==In}function Aa(t){if(t.lineIndent>0||37!==t.input.charCodeAt(t.position))return!1;t.position++;const e=t.position;for(;0!==t.input.charCodeAt(t.position)&&!sa(t.input.charCodeAt(t.position));)t.position++;const i=t.input.slice(e,t.position),s=[];for(0===i.length&&ta(t,"directive name must not be less than one character in length");0!==t.input.charCodeAt(t.position)&&!ea(t.input.charCodeAt(t.position));){for(;ia(t.input.charCodeAt(t.position));)t.position++;if(35===t.input.charCodeAt(t.position)||ea(t.input.charCodeAt(t.position))||0===t.input.charCodeAt(t.position))break;const e=t.position;for(;0!==t.input.charCodeAt(t.position)&&!sa(t.input.charCodeAt(t.position));)t.position++;s.push(t.input.slice(e,t.position))}if(ea(t.input.charCodeAt(t.position))&&ha(t),"YAML"===i){t.directives.some(t=>"yaml"===t.kind)&&ta(t,"duplication of %YAML directive"),1!==s.length&&ta(t,"YAML directive accepts exactly one argument");const e=/^([0-9]+)\.([0-9]+)$/.exec(s[0]);null===e&&ta(t,"ill-formed argument of the YAML directive"),1!==parseInt(e[1],10)&&ta(t,"unacceptable YAML version of the document"),t.directives.push({kind:"yaml",version:s[0]})}else if("TAG"===i){2!==s.length&&ta(t,"TAG directive accepts exactly two arguments");const[e,i]=s;Dn.test(e)||ta(t,"ill-formed tag handle (first argument) of the TAG directive"),Fn.call(t.tagHandlers,e)&&ta(t,`there is a previously declared suffix for "${e}" tag handle`),Un.test(i)||ta(t,"ill-formed tag prefix (second argument) of the TAG directive"),t.tagHandlers[e]=i,t.directives.push({kind:"tag",handle:e,prefix:i})}return!0}function ja(t){t.directives=[],t.tagHandlers=Object.create(null);let e=!1;for(da(t,!0);Aa(t);)e=!0,da(t,!0);let i=!1,s=!1,n=!0;if(0===t.lineIndent&&45===t.input.charCodeAt(t.position)&&45===t.input.charCodeAt(t.position+1)&&45===t.input.charCodeAt(t.position+2)&&na(t.input.charCodeAt(t.position+3))){i=!0;const e=t.line;t.position+=3,da(t,!0),n=t.line>e}else e&&ta(t,"directives end mark is expected");const a=t.events.length;if(!i&&t.position===t.lineStart&&46===t.input.charCodeAt(t.position)&&ua(t))return t.position+=3,void da(t,!0);if(function(t,e,i){t.events.push({type:Ks,explicitStart:e,explicitEnd:i,directives:t.directives})}(t,i,!1),Sa(t,t.lineIndent-1,4,!1,n,n)||Gn(t),da(t,!0),t.position===t.lineStart&&ua(t)&&(s=46===t.input.charCodeAt(t.position),s)){const e=t.line;t.position+=3,da(t,!0),t.line===e&&t.position<t.length&&ta(t,"end of the stream or a document separator is expected")}const o=t.events[a];o?.type===Ks&&(o.explicitEnd=s),Yn(t),!s&&t.position<t.length&&!ma(t)&&ta(t,"end of the stream or a document separator is expected")}var Ca={...Hn,...wn};function Oa(t,e={}){const i={...Ca,...e},s=String(t),n=Object.keys(Hn),a=Object.keys(wn);return function(t,e){const i={...wn,...e,events:t,documents:[],eventIndex:0,position:0,frames:[],anchors:new Map,nodeTags:new Map,tagHandlers:Object.create(null),totalMergeKeys:0,aliasCount:0};for(;i.eventIndex<i.events.length;){const t=i.events[i.eventIndex++];switch(i.position=xn(t),t.type){case Ks:i.anchors=new Map,i.nodeTags=new Map,i.aliasCount=0,i.tagHandlers=Object.create(null);for(const e of t.directives)"tag"===e.kind&&(i.tagHandlers[e.handle]=e.prefix);i.frames.push({kind:"document",position:i.position,value:void 0,hasValue:!1});break;case Bs:{const{value:e,tag:s}=An(i,t);Nn(i,t,e,s,!0),Pn(i,e,s);break}case Ws:{const e=jn(i,t,"tag:yaml.org,2002:seq"),s=i.schema.lookupSequenceTag(e);s||kn(i,`unknown sequence tag !<${e}>`);const n=s.create(e),a=Nn(i,t,n,s,s.carrierIsResult);i.frames.push({kind:"sequence",position:i.position,value:n,tag:s,anchor:a,index:0});break}case Js:{const e=jn(i,t,"tag:yaml.org,2002:map"),s=i.schema.lookupMappingTag(e);s||kn(i,`unknown mapping tag !<${e}>`);const n=s.create(e),a=Nn(i,t,n,s,s.carrierIsResult);i.frames.push({kind:"mapping",position:i.position,value:n,tag:s,anchor:a,key:void 0,keyPosition:i.position,hasKey:!1,keyIsMerge:!1,overridable:null});break}case Ys:{-1!==i.maxAliases&&++i.aliasCount>i.maxAliases&&kn(i,`aliases exceeded maxAliases (${i.maxAliases})`);const e=i.source.slice(t.anchorStart,t.anchorEnd),s=i.anchors.get(e);s||kn(i,`unidentified alias "${e}"`),s.isValueFinal||kn(i,`recursive alias "${e}" is not supported for tag ${s.tag.tagName} because it uses finalize()`),Pn(i,s.value,s.tag);break}case Gs:{const t=i.frames.pop();if("mapping"===t.kind&&t.hasKey&&(i.position=t.keyPosition,kn(i,"incomplete mapping pair in event stream")),"document"===t.kind)i.documents.push(t.value);else{const e=t.tag.carrierIsResult?t.value:Sn(i,t.position,t.tag,t.value);t.anchor&&(t.anchor.value=e,t.anchor.isValueFinal=!0),Pn(i,e,t.tag)}break}}}return i.documents}(function(t,e){const i=t.length,s={...Hn,...e,input:`${t}\0`,length:i,position:0,line:0,lineStart:0,lineIndent:0,firstTabInLine:-1,depth:0,directives:[],tagHandlers:Object.create(null),events:[]},n=t.indexOf("\0");for(-1!==n&&Hs.throwAt(t,n,"null byte is not allowed in input",s.filename);s.position<s.length&&(pa(s),da(s,!0),!(s.position>=s.length));){const t=s.position;ja(s),s.position===t&&ta(s,"can not read a document")}return s.events}(s,Ts(i,n)),{...Ts(i,a),source:s})}function Ea(t,e){return!!(t&1<<e)}var Ta={applyQuoteFlowKeysOption:function(t){if(!t.presenterOptions.quoteFlowKeys)return;if(!t.isKey||!t.flowOnly||t.style!==Zs)return;t.style=Xs},doubleQuoteForInvisibles:function(t){t.style===Zs&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(t.node.value)&&(t.style=Xs)},doubleQuoteWhitespaceOnly:function(t){t.style===Zs&&/^\s+$/.test(t.node.value)&&(t.style=Xs)},applyForceQuotesOption:function(t){if(!t.presenterOptions.forceQuotes)return;if(t.isKey||t.style!==Zs)return;if(t.node.tag!==t.presenterOptions.schema.defaultScalarTag.tagName)return;t.style=t.node.value.includes("\n")?Xs:Pa(t)},tryLongOrMultilineAsBlock:function(t){if(t.style!==Zs||t.isKey)return;const e=t.node.value,i=-1!==e.indexOf("\n");if(!Ea(t.allowedStylesMask,tn))return void(i&&(t.style=Xs));const s=t.presenterOptions.lineWidth;if(-1===s)return void(i&&(t.style=tn));const n=Math.max(Math.min(s,40),s-t.shiftOfContent);let a=0,o=!1;for(;a<=e.length;){let t=e.length;const i=e.indexOf("\n",a);-1!==i&&(t=i);const s=e.slice(a,t);if(s.length>n&&" "!==s[0]&&/ [^ \t]/.test(s)&&(o=!0),-1===i)break;a=i+1}o?t.style=en:i&&(t.style=tn)},quoteInvalidPlain:function(t){t.style!==Zs||Ea(t.allowedStylesMask,Zs)||(t.style=Pa(t))},fallbackToDoubleQuoted:function(t){Ea(t.allowedStylesMask,t.style)||(t.style=Xs)}};function Pa(t){return"single"===t.presenterOptions.quoteStyle&&Ea(t.allowedStylesMask,Qs)?Qs:Xs}Object.keys(Ta).map(t=>Reflect.get(Ta,t));const Na="tempus2016/decluttering-card-plus",Ia="share-your-templates",Fa=`https://github.com/${Na}/discussions/new?category=${Ia}`,La="decluttering-card-plus-community";function Ma(t){let e=2e4;const i=t=>(e-=1+Math.ceil(t/16))>=0,s=t=>"string"==typeof t?i(t.length):!!i(0)&&(Array.isArray(t)?t.every(s):!t||"object"!=typeof t||Object.entries(t).every(([t,e])=>i(t.length)&&s(e)));return s(t)}const Da=t=>!!t&&"object"==typeof t&&!Array.isArray(t);function Va(t){if(Ma(t))return JSON.parse(JSON.stringify(t),(t,e)=>"__proto__"===t?void 0:e)}const Ra=/[\p{Cf}\u2800\u3164\u115F\u1160\uFFA0]/gu;function za(t){if("string"!=typeof t)return;const e=t.replace(Ra,"").replace(/\s+/g," ").trim();return e?e.length>80?`${e.slice(0,79)}…`:e:void 0}const qa=["card","badge","row","element","group"];function Ua(t){if(!Da(t))return{};const e={};for(const[i,s]of Object.entries(t))Da(s)&&qa.some(t=>void 0!==s[t])&&(e[i]=s);return e}function Ha(t,e){return"string"==typeof e&&/^https:\/\/github\.com\//.test(e)?e:`https://github.com/${Na}/discussions/${t}`}function Ka(t){var e,i,s,n,a;const o=function(t){if("string"!=typeof t||t.length>65536)return;const e=/^ {0,3}(`{3,}|~{3,})[ \t]*([\w-]*)/,i=[];let s;for(const o of function(t){return t.replace(/<!--[\s\S]*?(?:-->|$)/g,"")}(t).split("\n")){if(s){o.trim()===s.fence?(i.push({lang:s.lang,text:s.lines.join("\n")+"\n"}),s=void 0):s.lines.push(o);continue}const t=e.exec(o);t&&(s={fence:t[1],lang:t[2],lines:[]})}const n=i.find(t=>/^ya?ml$/i.test(t.lang)),a=null!=n?n:i.find(t=>""===t.lang);return null==a?void 0:a.text}(null==t?void 0:t.body);if(!o)return;let r;try{if(r=Va(function(t,e){const i=Oa(t,e);if(0===i.length)throw new Hs("expected a document, but the input is empty");if(1===i.length)return i[0];throw new Hs("expected a single document in the stream, but found more")}(o,{maxAliases:50})),void 0===r)return}catch(d){return}if(!li(r).ok)return;if("number"!=typeof(null==t?void 0:t.number))return;const{template:l,includes:c}=r,h=It(r,["template","includes"]);return delete h.type,"string"!=typeof h.description&&delete h.description,{id:t.number,title:null!==(e=za(t.title))&&void 0!==e?e:l,author:"string"==typeof(null===(i=t.user)||void 0===i?void 0:i.login)?t.user.login:"",url:Ha(t.number,t.html_url),name:l.trim(),template:h,includes:Ua(c),reactions:"number"==typeof(null===(s=t.reactions)||void 0===s?void 0:s.total_count)?t.reactions.total_count:0,updated:"string"==typeof(null!==(n=t.updated_at)&&void 0!==n?n:t.created_at)?null!==(a=t.updated_at)&&void 0!==a?a:t.created_at:""}}const Wa=["lock","alarm_control_panel","cover","valve","siren","script","automation","button","input_button","water_heater","lawn_mower","update"],Ja=["more-info","navigate","none","assist"],Ba=["action","perform_action","service","type"],Ya=/\b[a-z][a-z0-9+.-]{1,31}:(?:\/\/)?[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?|\/\/[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?/gi,Ga=[/(?:url|image-set|src)\(\s*['"]?([^'")\s{}]+)/gi,/@import\s+(?:url\(\s*)?['"]?([^'")\s;{}]+)/gi],Za=/^(?:\/(?!\/)|#|data:)/i,Qa=["image","url","url_path","entity_picture","camera_image","image_url","icon_url","src"],Xa=/\[\[\[|\{\{|\{%|\$\{/,to=/^\s*(?:javascript|data|vbscript):/i,eo=/position\s*:\s*(?:fixed|absolute)/i,io=/opacity\s*:\s*0(?:[^.\d]|$)|visibility\s*:\s*hidden|transparent/i,so=t=>"string"==typeof t&&Wa.includes(t.split(".")[0]),no=t=>t.replace(/\\/g,"/"),ao="*";function oo(t,e){const i=[].concat(null!=t?t:[]).filter(t=>"string"==typeof t);if(i.length)return i.includes(ao)?[ao]:i;const s=[].concat(null!=e?e:[]).filter(t=>"string"==typeof t);if(!s.length)return[ao];const n=s.map(t=>{const e=t.indexOf("."),i=-1===e?t:t.slice(0,e);return/^[a-z_]+$/.test(i)?i:ao});return n.includes(ao)?[ao]:[...new Set(n)]}function ro(t,e,i=new Set){var s,n,a,o;if(Array.isArray(t))return t.forEach(t=>ro(t,e,i)),i;if(!Da(t))return i;const r="string"==typeof t.entity?t.entity:e,l=t.action;if("string"==typeof l&&!Ja.includes(l)&&!l.includes("[[")&&"perform-action"!==l&&"call-service"!==l&&"fire-dom-event"!==l&&"url"!==l){const e=[].concat(null!==(o=null!==(a=null!==(n=null===(s=t.target)||void 0===s?void 0:s.entity_id)&&void 0!==n?n:t.entity_id)&&void 0!==a?a:r)&&void 0!==o?o:[]);e.length&&!e.some(t=>"string"!=typeof t||t.includes("[["))||i.add(l)}return Object.values(t).forEach(t=>ro(t,r,i)),i}function lo(t,e){const i=qa.find(e=>void 0!==t[e]);if(i)try{return F(e,t,t[i],void 0,void 0,!0)}catch(s){return}}function co(t){const e=new Set,i=new Set;let s=!1,n=!1,a=!1,o=!1;const r=t=>{const e=no(t).trim();!e||Za.test(e)||e.startsWith("[[")||e.startsWith("{{")||/^[\w.-]+\.[a-z]{2,}(?:[:/?#]|$)/i.test(e)&&i.add(e)},l=new Set,c=(t,i)=>{for(const s of t)if(i.includes(ao))e.add(`${s} *`);else for(const t of i)Wa.includes(t)&&e.add(`${s} ${t}.*`)},h=(d,u)=>{var p;if("string"==typeof d)return void(t=>{var e;const s=no(t);for(const n of null!==(e=s.match(Ya))&&void 0!==e?e:[])i.add(n);for(const n of Ga){n.lastIndex=0;let t=n.exec(s);for(;t;)Za.test(t[1])||i.add(t[1]),t=n.exec(s)}Xa.test(t)&&(n=!0),eo.test(t)&&io.test(t)&&(o=!0)})(d);if(Array.isArray(d))return void d.forEach(t=>h(t,u));if(!Da(d))return;const m="string"==typeof d.entity?d.entity:u;Object.keys(d).some(t=>t.includes("[["))&&(a=!0),Ba.some(t=>"string"==typeof d[t]&&d[t].includes("[["))&&(a=!0),"string"==typeof d.action&&((t,s)=>{var a,o,r,l,c,h;const d=t.action;if("perform-action"===d||"call-service"===d){const i=null!==(a=t.perform_action)&&void 0!==a?a:t.service;return void("string"!=typeof i?e.add("?"):i.includes("[[")||e.add(i))}if("fire-dom-event"===d)return void e.add("fire-dom-event");if("url"===d)return i.add("string"==typeof t.url_path?t.url_path:"?"),void("string"==typeof t.url_path&&to.test(t.url_path)&&(n=!0));if(Ja.includes(d)||d.includes("[["))return;const u=[].concat(null!==(h=null!==(c=null!==(l=null!==(r=null===(o=t.target)||void 0===o?void 0:o.entity_id)&&void 0!==r?r:t.entity_id)&&void 0!==l?l:t.entity)&&void 0!==c?c:s)&&void 0!==h?h:[]);for(const i of u)so(i)&&e.add(`${d} ${i}`)})(d,m),"iframe"!==d.type&&"webpage"!==d.type||(s=!0);for(const t of Qa)"string"==typeof d[t]&&r(d[t]);if("string"==typeof d.type&&wt.includes(d.type)){const e=(e=>{if("string"==typeof e)return e===t.name?t.template:Object.prototype.hasOwnProperty.call(t.includes,e)?t.includes[e]:void 0})(d.template);if(e){if(L(d.for_each_from)){const t=d.for_each_from,i=qa.map(t=>e[t]).find(t=>void 0!==t);c(ro(i,void 0),oo(t.domain,t.entities))}const t=(f=d.variables,Array.isArray(f)?f.filter(Da):Da(f)?Object.entries(f).map(([t,e])=>({[t]:e})):void 0);(null==t?void 0:t.length)&&!l.has(d.template)&&(l.add(d.template),h(lo(e,t),void 0),l.delete(d.template))}}var f;if("custom:auto-entities"===d.type&&Da(d.filter))for(const t of[].concat(null!==(p=d.filter.include)&&void 0!==p?p:[])){if(!Da(t))continue;const e=oo(t.domain,t.entity_id);c(ro(t.options,void 0),e),c(ro(d.card,void 0),e)}Object.values(d).forEach(t=>h(t,m))},d=[t.template,...Object.values(t.includes)];h(d,void 0);for(const u of d)h(lo(u),void 0);return{actions:[...e].sort(),urls:[...i].sort(),embeds:s,scripts:n,placeholders:a,overlay:o}}function ho(t){return t.filter(t=>{var e;return(null===(e=null==t?void 0:t.category)||void 0===e?void 0:e.slug)===Ia}).map(Ka).filter(t=>!!t).sort((t,e)=>e.reactions-t.reactions||e.updated.localeCompare(t.updated))}class uo extends Error{}function po(t){var e;if(!Da(t)||"number"!=typeof t.id||"string"!=typeof t.name)return;if(!Da(t.template))return;const i=Va({template:t.template,includes:t.includes});if(!i||!Da(i.template))return;if(!li(Object.assign({template:t.name},i.template)).ok)return;const s=Object.assign({},i.template);return delete s.type,"string"!=typeof s.description&&delete s.description,{id:t.id,title:null!==(e=za(t.title))&&void 0!==e?e:t.name,author:"string"==typeof t.author?t.author:"",url:Ha(t.id,t.url),name:t.name,template:s,includes:Ua(i.includes),reactions:"number"==typeof t.reactions?t.reactions:0,updated:"string"==typeof t.updated?t.updated:""}}async function mo(t={}){var e,i,s,n;const a=null!==(e=t.fetcher)&&void 0!==e?e:fetch.bind(globalThis),o=null!==(i=t.storage)&&void 0!==i?i:"undefined"==typeof localStorage?void 0:localStorage,r=null!==(s=t.now)&&void 0!==s?s:Date.now(),l=function(t){var e;try{const i=JSON.parse(null!==(e=null==t?void 0:t.getItem(La))&&void 0!==e?e:"null");if(!i||!Array.isArray(i.entries)||"number"!=typeof i.fetched)return;return{entries:i.entries.map(po).filter(t=>!!t),fetched:i.fetched}}catch(i){return}}(o);if(l&&!t.refresh&&r-l.fetched<216e5)return l;const c=[];try{for(let t=1;t<=10;t+=1){const e=await a(`https://api.github.com/repos/${Na}/discussions?per_page=100&page=${t}`,{headers:{Accept:"application/vnd.github+json"}});if(!e.ok){const t=new uo(`GitHub answered ${e.status}`);throw"0"===e.headers.get("x-ratelimit-remaining")&&(t.retryAt=1e3*Number(e.headers.get("x-ratelimit-reset"))||void 0),t}const i=await e.json();if(!Array.isArray(i))break;if(c.push(...i),i.length<100)break}}catch(d){const t=d instanceof uo?d:new uo(null!==(n=null==d?void 0:d.message)&&void 0!==n?n:String(d));throw t.cached=l,t}const h={entries:ho(c),fetched:r};try{null==o||o.setItem(La,JSON.stringify(h))}catch(u){}return h}function fo(t,e){return{discussion:t.id,updated:t.updated,name:e,author:t.author}}function go(t,e){return Object.assign(Object.assign({},t),{source:e})}function _o(t,e){return t.map(({name:t,source:i})=>{var s;const n=e.entries.find(t=>t.id===i.discussion),a="string"==typeof i.name?i.name:void 0,o=n?function(t,e){return void 0===e||e===t.name?t.template:Object.prototype.hasOwnProperty.call(t.includes,e)?t.includes[e]:void 0}(n,a):void 0;if(!n||!o)return Object.assign({name:t,status:"gone"},n?{entry:n}:{});if("string"!=typeof i.author||!i.author||i.author!==n.author)return{name:t,status:"unverified",entry:n};const r=Date.parse(null!==(s=i.updated)&&void 0!==s?s:""),l=Date.parse(n.updated);return{name:t,status:(Number.isFinite(r)?Number.isFinite(l)&&l>r:Number.isFinite(l))?"update":"current",entry:n,latest:go(o,fo(n,null!=a?a:n.name))}})}function vo(t){if(""===t)return[];const e=t.split("\n");return""===e[e.length-1]&&e.pop(),e}function yo(t,e){const i=t=>({kind:"remove",text:t}),s=t=>({kind:"add",text:t});if(!t.length||!e.length||t.length*e.length>4e6)return[...t.map(i),...e.map(s)];const n=t.length,a=e.length,o=Array.from({length:n+1},()=>new Uint32Array(a+1));for(let h=n-1;h>=0;h-=1)for(let i=a-1;i>=0;i-=1)o[h][i]=t[h]===e[i]?o[h+1][i+1]+1:Math.max(o[h+1][i],o[h][i+1]);const r=[];let l=0,c=0;for(;l<n&&c<a;)t[l]===e[c]?(r.push({kind:"same",text:t[l]}),l+=1,c+=1):o[l+1][c]>=o[l][c+1]?(r.push(i(t[l])),l+=1):(r.push(s(e[c])),c+=1);for(;l<n;)r.push(i(t[l++]));for(;c<a;)r.push(s(e[c++]));return r}const bo=t`<style>
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
</style>`;function $o(t){return"string"==typeof t?t:void 0===t?"":Ft(t)}const wo={same:" ",add:"+",remove:"-"};function xo(i,s,n,a=3){const o=function(t,e){const i=vo(t),s=vo(e);let n=0;for(;n<i.length&&n<s.length&&i[n]===s[n];)n+=1;let a=i.length,o=s.length;for(;a>n&&o>n&&i[a-1]===s[o-1];)a-=1,o-=1;const r=i.slice(0,n).map(t=>({kind:"same",text:t})),l=i.slice(a).map(t=>({kind:"same",text:t}));return[...r,...yo(i.slice(n,a),s.slice(n,o)),...l]}($o(i),$o(s));return function(t){return t.some(t=>"same"!==t.kind)}(o)?t`${bo}
    <div class="dcp-diff" role="figure" aria-label=${e("diff.label",void 0,n)}>
      ${function(t,e=3){const i=t.map(t=>"same"!==t.kind),s=new Array(t.length).fill(!1);t.forEach((i,n)=>{if("same"!==i.kind)for(let a=Math.max(0,n-e);a<=Math.min(t.length-1,n+e);a+=1)s[a]=!0});const n=[];let a=0;for(;a<t.length;){if(i[a]||s[a]){n.push(t[a]),a+=1;continue}let e=a;for(;e<t.length&&!i[e]&&!s[e];)e+=1;const o=e-a;1===o?n.push(t[a]):n.push({kind:"skip",count:o}),a=e}return n}(o,a).map(i=>function(i,s){return"skip"===i.kind?t`<div class="skip">${e("diff.skipped",{count:i.count},s)}</div>`:t`<div class=${i.kind}>${wo[i.kind]} ${i.text}</div>`}(i,n))}
    </div>`:t`${bo}
      <p class="dcp-diff-none">${e("diff.no_change",void 0,n)}</p>`}function ko(i,s,n){var a,o;const r=null!==(a=JSON.stringify(i))&&void 0!==a?a:"",l=null!==(o=JSON.stringify(s))&&void 0!==o?o:"";return t`
    ${xo(i,s,n)}
    <ha-expansion-panel outlined>
      <span slot="header">${e("diff.full",void 0,n)}</span>
      <p class="dcp-diff-none">${e("diff.before",void 0,n)}</p>
      ${Fi(r,t`<ha-yaml-editor .hass=${n} .defaultValue=${i} read-only></ha-yaml-editor>`)}
      <p class="dcp-diff-none">${e("diff.after",void 0,n)}</p>
      ${Fi(l,t`<ha-yaml-editor .hass=${n} .defaultValue=${s} read-only></ha-yaml-editor>`)}
    </ha-expansion-panel>
  `}class So extends a{constructor(){super(...arguments),this._importParses=!0,this._importErrors=[],this._importArmedAt=0,this._copyState="",this._busy=!1,this._libraryDestination="view",this._communityLoading=!1,this._communityKnownFailed=!1,this._installArmedAt=0,this._postCopyState="",this._updatesLoading=!1,this._updateArmedAt=0,this._trashArmedAt=0}get _config(){return this.config}get _savedLovelace(){var t,e,i;return null!==(i=null!==(e=null===(t=M())||void 0===t?void 0:t.config)&&void 0!==e?e:this.lovelace)&&void 0!==i?i:p()}static get styles(){return Pi}_fireConfigChanged(t){r(this,"config-changed",{config:t})}_saveDashboard(t,e,i){return Ti(this,t,e,i)}render(){return this.hass&&this._config?this._renderShare():t``}async _loadTrash(){this.hass&&(this._trash=await Lt(this.hass))}_renderShare(){const{payload:i,notes:s}=ai(this._config,m(this._savedLovelace));return t`
      <div class="share">
        <h3>${e("share.export_header",void 0,this.hass)}</h3>
        <p class="hint">${e("share.export_hint",void 0,this.hass)}</p>
        ${s.map(e=>t`<ha-alert alert-type="info">${e}</ha-alert>`)}
        <ha-yaml-editor id="export" .hass=${this.hass} .defaultValue=${i} read-only></ha-yaml-editor>
        <ha-button @click=${this._copyExport}>
          ${"done"===this._copyState?e("share.copied",void 0,this.hass):"failed"===this._copyState?e("share.copy_failed",void 0,this.hass):e("share.copy",void 0,this.hass)}
        </ha-button>
        <ha-button @click=${this._downloadExport}> ${e("share.download",void 0,this.hass)} </ha-button>
        <ha-button @click=${this._copyPost}>
          ${"done"===this._postCopyState?e("share.copied",void 0,this.hass):"failed"===this._postCopyState?e("share.copy_failed",void 0,this.hass):e("share.post_copy",void 0,this.hass)}
        </ha-button>
        <p class="hint">
          ${e("share.post_hint",void 0,this.hass)}
          <a href=${Fa} target="_blank" rel="noopener noreferrer"
            >${e("share.post_open",void 0,this.hass)}</a
          >
        </p>

        <h3>${e("share.import_header",void 0,this.hass)}</h3>
        <p class="hint">${e("share.import_hint",void 0,this.hass)}</p>
        <ha-yaml-editor id="import" .hass=${this.hass} @value-changed=${this._importChanged}></ha-yaml-editor>
        <input
          id="import-file"
          type="file"
          accept=".yaml,.yml,.json,text/yaml,application/json"
          hidden
          @change=${this._importFile}
        />
        <ha-button @click=${()=>{var t;return null===(t=this.renderRoot.querySelector("#import-file"))||void 0===t?void 0:t.click()}}>
          ${e("share.import_file",void 0,this.hass)}
        </ha-button>
        ${this._importErrors.map(e=>t`<ha-alert alert-type="error">${e}</ha-alert>`)}
        ${this._importClash?t`<ha-alert alert-type="warning">
                ${e("share.import_clash",{name:this._importClash},this.hass)}
              </ha-alert>`:t``}
        ${this._importRisks?this._renderRisks(this._importRisks,"share.import_risks"):t``}
        <ha-button @click=${this._import}>
          ${e(this._importClash||this._importRisks?"share.import_anyway":"share.import",void 0,this.hass)}
        </ha-button>
        ${this._importClash?t`<ha-button @click=${this._importAsCopy}>
                ${e("share.import_copy",void 0,this.hass)}
              </ha-button>`:t``}
        ${this._renderTrash()}

        <h3>${e("share.library_header",void 0,this.hass)}</h3>
        <p class="hint">${e("share.library_hint",void 0,this.hass)}</p>
        ${this._renderLibrary()}

        <h3>${e("share.community_header",void 0,this.hass)}</h3>
        <p class="hint">${e("share.community_hint",void 0,this.hass)}</p>
        ${this._renderCommunity()} ${this._renderInstalled()}
        ${this._toolError?t`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:t``}
      </div>
    `}_renderCommunity(){const i=this._community,s=t`
      ${this._communityError?t`<ha-alert alert-type="warning">${this._communityError}</ha-alert>`:t``}
      ${this._communityError&&i?t`<p class="hint">
              ${e("share.community_showing_cached",{time:(t=>{var e,i;return new Date(t).toLocaleString(null===(i=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===i?void 0:i.language)})(i.fetched)},this.hass)}
            </p>`:t``}
    `;if(!i)return t`
        <div class="library">
          ${s}
          <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!1)}}>
            ${e(this._communityLoading?"share.community_loading":"share.community_load",void 0,this.hass)}
          </ha-button>
        </div>
      `;const n=this._communityExisting(),a=i.entries.find(t=>t.id===this._communitySelected),o=a?`community:${a.id}:${a.updated}`:"",r=!!a&&this._installPending===o,l=a&&n.includes(a.name)?ri(a.name,n):void 0,c=a?function(t,e){const i=new Set,s=new Set;for(const n of[t.template,...Object.values(t.includes)]){const t=ni(n);t.customTypes.forEach(t=>i.add(t)),t.templateRefs.forEach(t=>s.add(t))}return{customTypes:[...i].sort(),templates:[...s].filter(i=>i!==t.name&&!(i in t.includes)&&!e.includes(i)).sort()}}(a,n):void 0,h=a?Object.keys(a.includes).filter(t=>!n.includes(t)):[],d=a?co(a):void 0,u=void 0!==this._communityKnown;return t`
      <div class="library">
        ${s}
        ${i.entries.length?t`<ha-form
                .hass=${this.hass}
                .data=${{entry:a?String(a.id):""}}
                .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:i.entries.map(t=>({value:String(t.id),label:e("share.community_by",{title:t.title,author:t.author},this.hass)}))}}}]}
                .computeLabel=${()=>e("share.community_pick",void 0,this.hass)}
                @value-changed=${this._communityPicked}
              ></ha-form>`:t`<p class="hint">${e("share.community_none",void 0,this.hass)}</p>`}
        ${a&&c?t`
                <p class="hint">
                  ${"string"==typeof a.template.description?a.template.description:""}
                  <a href=${a.url} target="_blank" rel="noopener noreferrer"
                    >${e("share.community_open",void 0,this.hass)}</a
                  >
                </p>
                ${h.length?t`<p class="hint">
                        ${e("share.library_needs",{names:h.join(", ")},this.hass)}
                      </p>`:t``}
                ${this._renderMissingCards([a.template,...Object.values(a.includes)])}
                ${c.templates.length?t`<ha-alert alert-type="warning">
                        ${e("share.community_needs_templates",{names:c.templates.join(", ")},this.hass)}
                      </ha-alert>`:t``}
                ${d&&Ci(d)?this._renderRisks(d,"share.community_risks"):t``}
                <ha-expansion-panel outlined expanded>
                  <span slot="header">${e("share.library_preview",void 0,this.hass)}</span>
                  ${Fi(`${a.id}:${a.updated}`,t`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${Object.assign(Object.assign({template:a.name},a.template),Object.keys(a.includes).length?{includes:a.includes}:{})}
                      read-only
                    ></ha-yaml-editor>`)}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{where:this._libraryDestination}}
                  .schema=${[{name:"where",selector:{select:{mode:"dropdown",options:[{value:"view",label:e("share.library_where_view",void 0,this.hass)},{value:"root",label:e("share.library_where_root",void 0,this.hass)}]}}}]}
                  .computeLabel=${()=>e("share.library_where",void 0,this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                ${this._communityKnownFailed?t`<ha-alert alert-type="error">
                        ${e("share.community_names_failed",void 0,this.hass)}
                      </ha-alert>`:t``}
                <ha-button .disabled=${this._busy||!u} @click=${()=>{this._installShared(a)}}>
                  ${u||this._communityKnownFailed?r?e("share.install_anyway",void 0,this.hass):l?e("share.community_install_as",{name:l},this.hass):e("share.install",void 0,this.hass):e("share.community_names_loading",void 0,this.hass)}
                </ha-button>
              `:t``}
        <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!0)}}>
          ${e(this._communityLoading?"share.community_loading":"share.community_refresh",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderRisks(i,s){return t`<ha-alert alert-type="warning" .title=${e(s,void 0,this.hass)}>
      <ul class="risks">
        ${i.actions.length?t`<li>${e("share.community_risk_actions",{list:i.actions.join(", ")},this.hass)}</li>`:t``}
        ${i.urls.length?t`<li>${e("share.community_risk_urls",{list:i.urls.join(", ")},this.hass)}</li>`:t``}
        ${i.embeds?t`<li>${e("share.community_risk_embeds",void 0,this.hass)}</li>`:t``}
        ${i.scripts?t`<li>${e("share.community_risk_scripts",void 0,this.hass)}</li>`:t``}
        ${i.placeholders?t`<li>${e("share.community_risk_placeholders",void 0,this.hass)}</li>`:t``}
        ${i.overlay?t`<li>${e("share.community_risk_overlay",void 0,this.hass)}</li>`:t``}
      </ul>
    </ha-alert>`}async _loadCommunity(t){var i,s;this._communityLoading=!0,this._communityError=void 0,this._installPending=void 0,this._communityKnown=void 0,this._communityKnownFailed=!1;try{this._community=await mo({refresh:t})}catch(n){const t=n;t.cached&&(this._community=t.cached),this._communityError=t.retryAt?e("share.community_rate_limited",{time:new Date(t.retryAt).toLocaleTimeString(null===(s=null===(i=this.hass)||void 0===i?void 0:i.locale)||void 0===s?void 0:s.language)},this.hass):e("share.community_failed",{message:t.message},this.hass)}finally{this._communityLoading=!1}this._community&&this._loadCommunityKnown()}_communityExisting(){var t;const e=Object.keys(m(this._savedLovelace));return[...new Set([...e,...null!==(t=this._communityKnown)&&void 0!==t?t:[]])]}async _loadCommunityKnown(){try{const t=await ft(this.hass,this._savedLovelace);this._communityKnown=Object.keys(t)}catch(t){this._communityKnownFailed=!0}}_communityPicked(t){t.stopPropagation();const e=Number(t.detail.value.entry);this._communitySelected=Number.isFinite(e)&&e>0?e:void 0,this._installPending=void 0}async _installShared(t){var e,i,s,n,a;if(void 0===this._communityKnown)return;const o=`community:${t.id}:${t.updated}`;if(this._installPending!==o)return this._installPending=o,void(this._installArmedAt=Date.now());if(Date.now()-this._installArmedAt<Oi)return;const r=M(),l=this._communityExisting(),c=l.includes(t.name)?ri(t.name,l):t.name,h=[...Object.entries(t.includes).filter(([t])=>!l.includes(t)).map(([e,i])=>[e,go(i,fo(t,e))]),[c,go(t.template,fo(t,t.name))]],d=H(null!==(e=null==r?void 0:r.config)&&void 0!==e?e:this.lovelace,null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""),u=null!==(a=null===(n=null==d?void 0:d.view)||void 0===n?void 0:n.index)&&void 0!==a?a:0;await this._saveDashboard(t=>h.reduce((t,[e,i])=>"root"===this._libraryDestination?Mt(t,e,i):Dt(t,u,Object.assign({type:bt,template:e},i,{type:bt,template:e})),t),"community_install")&&(this._installPending=void 0)}_renderMissingCards(i){const s=function(t,e){const i=new Set;for(const s of t)for(const t of ni(s).customTypes){const s=t.slice(7);s&&!e(s)&&i.add(s)}return[...i].sort()}(i.filter(t=>void 0!==t),ji);return s.length?t`<ha-alert alert-type="warning">
      ${e(1===s.length?"share.missing_card_one":"share.missing_card_many",{cards:s.join(", ")},this.hass)}
    </ha-alert>`:t``}_renderInstalled(){var i;const s=Vt(this._savedLovelace);if(!s.length)return t``;const n=new Map((null!==(i=this._updates)&&void 0!==i?i:[]).map(t=>[t.name,t]));return t`
      <h3>${e("share.installed_header",void 0,this.hass)}</h3>
      <p class="hint">${e("share.installed_hint",void 0,this.hass)}</p>
      ${this._updatesError?t`<ha-alert alert-type="warning">${this._updatesError}</ha-alert>`:t``}
      <ul class="installed">
        ${s.map(({name:i,source:s,template:a})=>{var o,r;const l=n.get(i);return t`<li>
            ${i} —
            <a
              href=${null!==(r=null===(o=null==l?void 0:l.entry)||void 0===o?void 0:o.url)&&void 0!==r?r:`https://github.com/${Na}/discussions/${s.discussion}`}
              target="_blank"
              rel="noopener noreferrer"
              >${e("share.installed_from",{discussion:s.discussion},this.hass)}</a
            >
            ${l?t`<span class="status"
                    >${e(`share.installed_status_${l.status}`,void 0,this.hass)}</span
                  >`:t``}
            ${"update"===(null==l?void 0:l.status)&&l.latest?this._renderUpdate(i,a,l):t``}
          </li>`})}
      </ul>
      <ha-button .disabled=${this._updatesLoading} @click=${()=>{this._checkUpdates()}}>
        ${e(this._updatesLoading?"share.community_loading":"share.installed_check",void 0,this.hass)}
      </ha-button>
    `}_renderUpdate(i,s,n){const a=n.latest,o=t=>{const e=Object.assign({},t);return delete e.source,delete e.type,delete e.template,e},r=o(s),l=o(a),c=co({template:l,includes:{}}),h=function(t,e){return{actions:t.actions.filter(t=>!e.actions.includes(t)),urls:t.urls.filter(t=>!e.urls.includes(t)),embeds:t.embeds&&!e.embeds,scripts:t.scripts&&!e.scripts,placeholders:t.placeholders&&!e.placeholders,overlay:t.overlay&&!e.overlay}}(c,co({template:r,includes:{}})),d=this._updatePending===i;return t`
      <p class="hint">${e("share.installed_compare",void 0,this.hass)}</p>
      ${ko(r,l,this.hass)} ${this._renderMissingCards([a])}
      ${Ci(h)?this._renderRisks(h,"share.installed_risks_new"):Ci(c)?this._renderRisks(c,"share.installed_risks"):t``}
      ${d?t`<ha-alert alert-type="warning">
              ${e("share.installed_update_confirm",{name:i},this.hass)}
            </ha-alert>`:t``}
      <ha-button .disabled=${this._busy} @click=${()=>{this._updateShared(i,a)}}>
        ${e(d?"share.installed_update_anyway":"share.installed_update",void 0,this.hass)}
      </ha-button>
    `}async _checkUpdates(){var t,i;this._updatesLoading=!0,this._updatesError=void 0,this._updatePending=void 0;const s=Vt(this._savedLovelace);try{this._updates=_o(s,await mo({refresh:!0}))}catch(n){const s=n;this._updatesError=s.retryAt?e("share.community_rate_limited",{time:new Date(s.retryAt).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)},this.hass):e("share.community_failed",{message:s.message},this.hass)}finally{this._updatesLoading=!1}}async _updateShared(t,e){var i,s;if(this._updatePending!==t)return this._updatePending=t,void(this._updateArmedAt=Date.now());if(Date.now()-this._updateArmedAt<Oi)return;await this._saveDashboard(i=>Rt(i,t,e),"shared_update")&&(this._updatePending=void 0,this._updates=null===(i=this._updates)||void 0===i?void 0:i.map(e=>e.name===t?Object.assign(Object.assign({},e),{status:"current"}):e),(null===(s=this._config)||void 0===s?void 0:s.template)===t&&this._fireConfigChanged(Object.assign(Object.assign({},e),{type:this._config.type,template:t})))}_renderLibrary(){var i;const s=Object.keys(m(this._savedLovelace)),n=this._librarySelected?Mi(this._librarySelected):void 0,a=!!n&&s.includes(n.name),o=!!n&&this._installPending===n.name,r=n?Di(n,s):[];return t`
      <div class="library">
        <ha-form
          .hass=${this.hass}
          .data=${{entry:null!==(i=this._librarySelected)&&void 0!==i?i:""}}
          .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:Li.map(t=>({value:t.name,label:t.name}))}}}]}
          .computeLabel=${()=>e("share.library_pick",void 0,this.hass)}
          @value-changed=${this._libraryPicked}
        ></ha-form>
        ${n?t`
                <p class="hint">${e(`library.${n.name}.summary`,void 0,this.hass)}</p>
                ${r.length?t`<p class="hint">
                        ${e("share.library_needs",{names:r.join(", ")},this.hass)}
                      </p>`:t``}
                ${this._renderMissingCards([n,...r.map(t=>Mi(t))].map(t=>null==t?void 0:t.template))}
                <ha-expansion-panel outlined>
                  <span slot="header">${e("share.library_preview",void 0,this.hass)}</span>
                  ${Fi(n.name,t`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${n.template}
                      read-only
                    ></ha-yaml-editor>`)}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{where:this._libraryDestination}}
                  .schema=${[{name:"where",selector:{select:{mode:"dropdown",options:[{value:"view",label:e("share.library_where_view",void 0,this.hass)},{value:"root",label:e("share.library_where_root",void 0,this.hass)}]}}}]}
                  .computeLabel=${()=>e("share.library_where",void 0,this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                <ha-button .disabled=${this._busy||a} @click=${()=>{this._install(n.name)}}>
                  ${e(a?"share.already_here":o?"share.install_anyway":"share.install",void 0,this.hass)}
                </ha-button>
              `:t``}
      </div>
    `}_libraryDestinationPicked(t){t.stopPropagation();const e=t.detail.value.where;this._libraryDestination="root"===e?"root":"view"}_libraryPicked(t){t.stopPropagation(),this._librarySelected=t.detail.value.entry||void 0,this._installPending=void 0}async _install(t){var e,i,s,n,a,o;const r=Mi(t);if(!r)return;if(this._installPending!==t)return void(this._installPending=t);const l=M(),c=Object.keys(m(null!==(e=null==l?void 0:l.config)&&void 0!==e?e:this._savedLovelace)),h=[...Di(r,c),r.name].filter(t=>!c.includes(t)),d=H(null!==(i=null==l?void 0:l.config)&&void 0!==i?i:this.lovelace,null!==(n=null===(s=this._config)||void 0===s?void 0:s.template)&&void 0!==n?n:""),u=null!==(o=null===(a=null==d?void 0:d.view)||void 0===a?void 0:a.index)&&void 0!==o?o:0;await this._saveDashboard(t=>h.reduce((t,e)=>{const i=Mi(e);if(!i)return t;const s=Object.assign(Object.assign({},i.template),{source:Vi(i.name,Jt)});return"root"===this._libraryDestination?Mt(t,i.name,s):Dt(t,u,Object.assign({type:bt,template:i.name},s))},t),"library_install")&&(this._installPending=void 0)}async _copyExport(){const t=this.renderRoot.querySelector("#export"),e=null==t?void 0:t.yaml;if(!e)return;const{notes:i}=ai(this._config),s=[...i.map(t=>`# ${t}`),e].join("\n");this._copyState=await zt(s)?"done":"failed",setTimeout(()=>this._copyState="",3e3)}async _copyPost(){var t,e;const i=null===(t=this.renderRoot.querySelector("#export"))||void 0===t?void 0:t.yaml;if(!i)return;const{notes:s}=ai(this._config,m(this._savedLovelace));this._postCopyState=await zt(function(t,e,i){return[...[i,...e].filter(t=>"string"==typeof t&&t.trim()),"```yaml\n"+t.replace(/\n*$/,"")+"\n```"].join("\n\n")+"\n"}(i,s,null===(e=this._config)||void 0===e?void 0:e.description))?"done":"failed",setTimeout(()=>this._postCopyState="",3e3)}_downloadExport(){var t,e,i;const s=null===(t=this.renderRoot.querySelector("#export"))||void 0===t?void 0:t.yaml;if(!s)return;const{notes:n}=ai(this._config),a=[...n.map(t=>`# ${t}`),s].join("\n"),o=document.createElement("a");o.href=URL.createObjectURL(new Blob([a],{type:"text/yaml"})),o.download=`${(null!==(i=null===(e=this._config)||void 0===e?void 0:e.template)&&void 0!==i?i:"template").replace(/[^\w-]+/g,"_")}.yaml`,o.click(),setTimeout(()=>URL.revokeObjectURL(o.href),1e3)}async _importFile(t){var i,s,n;const a=t.target,o=null===(i=a.files)||void 0===i?void 0:i[0];if(a.value="",!o)return;const r=await o.text(),l=null===(n=null===(s=this.renderRoot.querySelector("#import"))||void 0===s?void 0:s.shadowRoot)||void 0===n?void 0:n.querySelector("ha-code-editor");l?(l.value=r,l.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r}}))):this._importErrors=[e("share.import_not_yaml",void 0,this.hass)]}_renderTrash(){if(void 0===this._trash)return this._loadTrash(),t``;const i=t=>{var e,i;return new Date(t).toLocaleString(null===(i=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===i?void 0:i.language)};return t`
      <h3>${e("share.trash_header",void 0,this.hass)}</h3>
      <p class="hint">${e("share.trash_hint",void 0,this.hass)}</p>
      ${this._trash.length?t`<ul class="installed trash">
              ${this._trash.map((s,n)=>t`
                  <li>
                    <strong>${s.name}</strong>
                    <div class="status">
                      ${e("removed"===s.reason?"share.trash_removed":"share.trash_replaced",{when:i(s.at),dashboard:s.dashboard},this.hass)}
                    </div>
                    ${this._trashPending===n?t`<ha-alert alert-type="warning">
                            ${e("share.trash_clash",{name:s.name},this.hass)}
                          </ha-alert>`:t``}
                    <ha-button .disabled=${this._busy} @click=${()=>this._restore(s,n)}>
                      ${e(this._trashPending===n?"share.trash_restore_anyway":"share.trash_restore",void 0,this.hass)}
                    </ha-button>
                    <ha-button
                      @click=${()=>{this._trashShown=this._trashShown===n?void 0:n}}
                    >
                      ${e(this._trashShown===n?"share.trash_hide":"share.trash_show",void 0,this.hass)}
                    </ha-button>
                    <ha-button .disabled=${this._busy} @click=${()=>this._forget(s)}>
                      ${e("share.trash_forget",void 0,this.hass)}
                    </ha-button>
                    ${this._trashShown===n?t`<ha-yaml-editor
                            .hass=${this.hass}
                            .defaultValue=${s.template}
                            read-only
                          ></ha-yaml-editor>`:t``}
                  </li>
                `)}
            </ul>`:t`<p class="hint">${e("share.trash_empty",void 0,this.hass)}</p>`}
    `}async _restore(t,i){var s,n;if(!this.hass)return;const a=qt(this.hass);let o;try{o=await Ut(a,t.dashboard)}catch(l){return void(this._toolError=e("tools.save_failed",{message:null!==(s=null==l?void 0:l.message)&&void 0!==s?s:l},this.hass))}const r=t.name in m(o);if(r&&this._trashPending!==i)return this._trashPending=i,void(this._trashArmedAt=Date.now());if(!(r&&Date.now()-this._trashArmedAt<Oi)){this._busy=!0,this._toolError=void 0;try{await V(this,this.hass,"restore",[{urlPath:t.dashboard,build:e=>Ht(e,t)}]),this._trashPending=void 0,this._trashShown=void 0,await this._forget(t)}catch(l){this._toolError=e("tools.save_failed",{message:null!==(n=null==l?void 0:l.message)&&void 0!==n?n:l},this.hass)}finally{this._busy=!1}}}async _forget(t){if(!this.hass)return;const e=Kt(await Lt(this.hass),t);await Wt(this.hass,e),this._trash=e,this._trashPending=void 0}_importChanged(t){t.stopPropagation(),this._importValue=t.detail.value,this._importParses=!1!==t.detail.isValid,this._importErrors=[],this._importClash=void 0,this._importRisks=void 0}_import(){if(!this._config)return;if(!this._importParses)return void(this._importErrors=[e("share.import_not_yaml",void 0,this.hass)]);if(!Ma(this._importValue))return void(this._importErrors=[e("share.import_too_big",void 0,this.hass)]);const t=li(this._importValue);if(!t.ok)return this._importErrors=t.errors,void(this._importClash=void 0);this._importErrors=[];const i=this._importValue.template,s=m(this._savedLovelace),n=i!==this._config.template&&i in s?i:void 0,a=co({template:this._importValue,includes:{}});if(n&&!this._importClash||Ci(a)&&!this._importRisks)return this._importClash=n,this._importRisks=Ci(a)?a:void 0,void(this._importArmedAt=Date.now());Date.now()-this._importArmedAt<Oi||this._applyImport(i)}_importAsCopy(){if(!this._config||!this._importParses)return;if(Date.now()-this._importArmedAt<Oi)return;const t=Object.keys(m(this._savedLovelace));this._applyImport(ri(this._importValue.template,t))}_applyImport(t){var e;const i=function(t){const e=oi(t);if((null==e?void 0:e.includes)&&"object"==typeof e.includes&&!Array.isArray(e.includes)){const t={};for(const[i,s]of Object.entries(e.includes))t[i]=oi(s);e.includes=t}return e}(this._importValue),s=i.includes;if(s&&"object"==typeof s&&!Array.isArray(s)){const t=Object.keys(m(this._savedLovelace)),e=Object.entries(s).filter(([e])=>!t.includes(e));e.length&&this._saveDashboard(t=>e.reduce((t,[e,i])=>Mt(t,e,i),t),"import",this._config)}const n=Object.assign(Object.assign({},i),{template:t,type:null===(e=this._config)||void 0===e?void 0:e.type});delete n.includes,this._fireConfigChanged(n),this._importClash=void 0,this._importRisks=void 0,this.dispatchEvent(new CustomEvent("select-tab",{detail:"settings",bubbles:!0,composed:!0}))}}i([s({attribute:!1})],So.prototype,"hass",void 0),i([s({attribute:!1})],So.prototype,"lovelace",void 0),i([s({attribute:!1})],So.prototype,"config",void 0),i([n()],So.prototype,"_importErrors",void 0),i([n()],So.prototype,"_importClash",void 0),i([n()],So.prototype,"_importRisks",void 0),i([n()],So.prototype,"_copyState",void 0),i([n()],So.prototype,"_toolError",void 0),i([n()],So.prototype,"_busy",void 0),i([n()],So.prototype,"_installPending",void 0),i([n()],So.prototype,"_librarySelected",void 0),i([n()],So.prototype,"_libraryDestination",void 0),i([n()],So.prototype,"_community",void 0),i([n()],So.prototype,"_communityLoading",void 0),i([n()],So.prototype,"_communityError",void 0),i([n()],So.prototype,"_communitySelected",void 0),i([n()],So.prototype,"_communityKnown",void 0),i([n()],So.prototype,"_communityKnownFailed",void 0),i([n()],So.prototype,"_postCopyState",void 0),i([n()],So.prototype,"_updates",void 0),i([n()],So.prototype,"_updatesLoading",void 0),i([n()],So.prototype,"_updatesError",void 0),i([n()],So.prototype,"_updatePending",void 0),i([n()],So.prototype,"_trash",void 0),i([n()],So.prototype,"_trashShown",void 0),i([n()],So.prototype,"_trashPending",void 0),customElements.get("decluttering-template-share-tab")||customElements.define("decluttering-template-share-tab",So);const Ao=["card","badge","row","element"];function jo(t,e,i=[]){if(Array.isArray(t))t.forEach((t,s)=>jo(t,`${e}[${s}]`,i));else if(t&&"object"==typeof t)for(const[s,n]of Object.entries(t))jo(n,e?`${e}.${s}`:s,i);else null!=t&&i.push({path:e,value:String(t)});return i}const Co=["grid_options","visibility","view_layout","layout_options"];function Oo(t){const e={};for(const[i,s]of Object.entries(null!=t?t:{}))Co.includes(i)||(e[i]=s);return e}function Eo(t){if(Array.isArray(t))return t.map(Eo);if(t&&"object"==typeof t){const e={};for(const i of Object.keys(t).sort())e[i]=Eo(t[i]);return e}return 0}function To(t,e=[],i=[]){if(Array.isArray(t))t.forEach((t,s)=>To(t,[...e,s],i));else if(t&&"object"==typeof t)for(const[s,n]of Object.entries(t))To(n,[...e,s],i);else i.push({path:e,value:t});return i}function Po(t,e){return e.reduce((t,e)=>null==t?void 0:t[e],t)}function No(t){const e=new Map;t.forEach((t,i)=>{var s;if(!t||"object"!=typeof t||"string"!=typeof t.type)return;const n=Oo(t);if(JSON.stringify(n).includes("[["))return;const a=JSON.stringify([t.type,Eo(n)]);e.set(a,[...null!==(s=e.get(a))&&void 0!==s?s:[],i])});const i=[];for(const[s,n]of e){if(n.length<2)continue;const e=n.map(e=>Oo(t[e])),a=To(e[0]).map(t=>t.path).filter(t=>e.some(i=>JSON.stringify(Po(i,t))!==JSON.stringify(Po(e[0],t))));!a.length||a.length>8||i.push({indices:n,type:t[n[0]].type,differing:a,key:s})}return i.sort((t,e)=>e.indices.length-t.indices.length||t.indices[0]-e.indices[0])}const Io=t=>t.replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value";function Fo(t){const e=t[t.length-1];if("string"==typeof e)return Io(e);const i=[...t].reverse().find(t=>"string"==typeof t);return Io(`${null!=i?i:"item"}_${e+1}`)}function Lo(t){const e=t.map(Fo),i=[];return t.forEach((t,s)=>{const n=(a=e[s],e.filter(t=>t===a).length>1?function(t){return Io(t.map(t=>"number"==typeof t?String(t+1):t).join("_"))}(t):e[s]);var a;i.push(ri(n,i))}),i}function Mo(t){var e;const i=t.map(Oo),s=null!==(e=i[0])&&void 0!==e?e:{},n=To(s).map(t=>t.path).filter(t=>i.some(e=>JSON.stringify(Po(e,t))!==JSON.stringify(Po(s,t)))),a=Lo(n),o=JSON.parse(JSON.stringify(s));return n.forEach((t,e)=>{Po(o,t.slice(0,-1))[t[t.length-1]]=`[[${a[e]}]]`}),{template:{card:o},names:a,variables:i.map(t=>n.map((e,i)=>({[a[i]]:Po(t,e)}))),layout:t.map(t=>{const e={};for(const i of Co)void 0!==(null==t?void 0:t[i])&&(e[i]=t[i]);return e})}}function Do(t,e,i){return Object.assign({type:"custom:decluttering-card-plus",template:t,variables:e},i)}const Vo="_";function Ro(t){let e="string"==typeof t?t:JSON.stringify(t);if("string"!=typeof e||!e.includes("[["))return[];const i=new Set;for(let s=0;s<5;s+=1){let t=!1;if(e=e.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(e,s)=>{if(t=!0,s.startsWith(jt))return Vo;const n=s.endsWith("?")?s.slice(0,-1):s,[a,...o]=n.split("|"),r=a.endsWith("?")?a.slice(0,-1):a;for(const t of[r,r.split(".")[0]])t&&t!==Vo&&i.add(t);for(const t of o){const e=t.startsWith("or:")?t.slice(3):Et(t);e&&e!==Vo&&i.add(e)}return Vo}),!t)break}return[...i]}function zo(t,e=[]){if(Array.isArray(t)){for(const i of t)zo(i,e);return e}if(!t||"object"!=typeof t)return e;wt.includes(t.type)&&!0===t[Xt]&&"string"==typeof t.template&&e.push(t.template);for(const i of Object.values(t))zo(i,e);return e}function qo(t,e,i=new Set){const s=new Set;if(!t)return{names:s,complete:!0};Qt in t&&(t=Object.assign(Object.assign({},t),{default:t[Qt]}));for(const a of g(t))s.add(a.name);for(const a of rt(vt(t))){const t=A(a);void 0!==t&&s.add(t)}for(const a of Ro(t))s.add(a);let n=!0;for(const a of zo(t)){if(i.has(a))continue;if(i.add(a),!Object.prototype.hasOwnProperty.call(e,a)){n=!1;continue}const t=qo(e[a],e,i);for(const e of t.names)s.add(e);t.complete||(n=!1)}return{names:s,complete:n}}function Uo(t,e){const i=new Map,s=(t,e,s,n)=>{const a=JSON.stringify([t.index,e,n.name,s]),o=i.get(a);o?(o.count+=1,!o.closest&&n.closest&&(o.closest=n.closest)):i.set(a,Object.assign(Object.assign({view:t,template:e,name:n.name},n.closest?{closest:n.closest}:{}),{where:s,count:1}))},n=(t,i,a)=>{var o,r;if(Array.isArray(t))for(const e of t)n(e,i,a);else if(t&&"object"==typeof t){if(wt.includes(t.type)&&"string"==typeof t.template){const n=Object.prototype.hasOwnProperty.call(e,t.template)?e[t.template]:void 0;if(n){const l=new Set,c=(o,r)=>{for(const c of function(t,e,i,s={lets:[],defaults:[]},n){if(!t)return[];const{names:a,complete:o}=qo(t,e);if(!o)return[];const r=new Set([...rt(t.let),...s.lets].map(A).filter(t=>void 0!==t)),l=x(i),c=new Set(a);for(const g of Ro(n))c.add(g);for(const g of[...s.lets,...s.defaults]){const t=A(g);if(void 0!==t)for(const e of Ro(g[t]))c.add(e)}const h=t=>!r.has(t)&&(c.has(t)||c.has(t.split(".")[0]));let d=!0;const u=new Set;for(;d;){d=!1;for(const t of l){const e=A(t);if(!u.has(e)&&h(e)){u.add(e);for(const i of Ro(t[e]))c.has(i)||(c.add(i),d=!0)}}}const p=new Set(l.map(t=>A(t))),m=[...c].filter(t=>!p.has(t)&&!r.has(t)),f=[];for(const g of p){if(h(g))continue;const t=At(g,m);f.push(t?{name:g,closest:t}:{name:g})}return f}(n,e,r,a,[t.on_error,t.for_each_from]))l.has(c.name)||(l.add(c.name),s(i,t.template,o,c))};c("variables",t.variables);for(const e of null!==(o=j(t.for_each))&&void 0!==o?o:[])c("for_each",e);const h=null===(r=t.for_each_from)||void 0===r?void 0:r.overrides;if(h&&"object"==typeof h)for(const t of Object.values(h))c("overrides",t)}}for(const e of Object.values(t))n(e,i,a)}};return Gt(t,(e,i,s)=>{var a,o,r;const l=t.views[i];n(e,{title:null!==(o=null!==(a=null==l?void 0:l.title)&&void 0!==a?a:null==l?void 0:l.path)&&void 0!==o?o:"",path:null!==(r=null==l?void 0:l.path)&&void 0!==r?r:"",index:i},Zt(t,i,s))}),[...i.values()].map(({view:t,template:e,name:i,closest:s,where:n,count:a})=>s?{view:t,template:e,name:i,closest:s,where:n,count:a}:{view:t,template:e,name:i,where:n,count:a})}function Ho(t,e,i){if(!t.includes("[["))return t;const s=t.replace(/\[\[([^[\]]+)\]\]/g,(t,s)=>s.startsWith(jt)?t:`[[${function(t,e,i){const s=t.endsWith("?"),n=(s?t.slice(0,-1):t).split("|"),a=n[0],o=a.endsWith("?"),r=o?a.slice(0,-1):a;(r===e||r.startsWith(`${e}.`))&&(n[0]=`${i}${r.slice(e.length)}${o?"?":""}`);for(let l=1;l<n.length;l+=1){const t=n[l];if(t===`or:${e}`)n[l]=`or:${i}`;else if(Et(t)===e){const s=t.startsWith("if:!")?"!":"";n[l]=`if:${s}${i}${t.slice(3+s.length+e.length)}`}}return`${n.join("|")}${s?"?":""}`}(s,e,i)}]]`);return s.replace(new RegExp(`\\[\\[${n=e,n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=\\.\\[\\[)`,"g"),`[[${i}`);var n}function Ko(t,e,i){if("string"==typeof t)return Ho(t,e,i);if(Array.isArray(t))return t.map(t=>Ko(t,e,i));if(t&&"object"==typeof t){const s={};for(const[n,a]of Object.entries(t))s[Ho(n,e,i)]=Ko(a,e,i);return s}return t}function Wo(t,e,i){const s=t=>!!t&&"object"==typeof t&&!Array.isArray(t),n=(t,e)=>s(t)&&Object.prototype.hasOwnProperty.call(t,e),a=t=>{if(!s(t))return t;const n={};for(const[s,a]of Object.entries(t))s!==i&&(n[s===e?i:s]=a);return n};return Array.isArray(t)?t.some(t=>n(t,e))?t.map(a).filter(t=>!s(t)||Object.keys(t).length>0):t:n(t,e)?a(t):t}function Jo(t,e,i){const s=Ko(t,e,i);return Array.isArray(s.variables)?s.variables=s.variables.map(t=>t&&"object"==typeof t&&t.name===e?Object.assign(Object.assign({},t),{name:i}):t):s.variables&&"object"==typeof s.variables&&(s.variables=Wo(s.variables,e,i)),void 0!==s.default&&(s.default=Wo(s.default,e,i)),void 0!==s.defaults&&(s.defaults=Wo(s.defaults,e,i)),void 0!==s.let&&(s.let=Wo(s.let,e,i)),s}function Bo(t){const e=null==t?void 0:t.extends;return(Array.isArray(e)?e:[e]).filter(t=>"string"==typeof t)}function Yo(t,e,i){const s=Bt(t),n=new Set([e]);for(const o of null!=i?i:[])Object.prototype.hasOwnProperty.call(s,o)||n.add(o);let a=!0;for(;a;){a=!1;for(const[t,e]of Object.entries(s))!n.has(t)&&Bo(e).some(t=>n.has(t))&&(n.add(t),a=!0)}return n}function Go(t){if(!t)return[];const e=new Set(ki(t));for(const i of Ro(t))i.includes(".")||"_"===i||e.add(i);return[...e].sort()}function Zo(t,e,i,s,n){const a=Yo(t,e,n);let o=0,r=0;const l=(t,e)=>JSON.stringify(t)!==JSON.stringify(e),c=t=>{if(Array.isArray(t))return t.map(c);if(!t||"object"!=typeof t)return t;let e={};for(const[i,s]of Object.entries(t))e[i]=c(s);if(wt.includes(t.type)&&a.has(t.template)){const t=function(t,e,i){var s;const n=Object.assign({},t);void 0!==n.variables&&(n.variables=Wo(n.variables,e,i)),Array.isArray(n.for_each)?n.for_each=n.for_each.map(t=>Wo(t,e,i)):void 0!==n.for_each&&(n.for_each=Wo(n.for_each,e,i));const a=null===(s=n.for_each_from)||void 0===s?void 0:s.overrides;if(a&&"object"==typeof a&&!Array.isArray(a)){const t={};for(const[s,n]of Object.entries(a))t[s]=Wo(n,e,i);n.for_each_from=Object.assign(Object.assign({},n.for_each_from),{overrides:t})}return"string"==typeof n.name&&(n.name=Ho(n.name,e,i)),n}(e,i,s);l(t,e)&&(o+=1),e=t}if(Yt(t.type)&&a.has(t.template)){const t=Jo(e,i,s);l(t,e)&&(r+=1),e=t}return e},h=Object.assign({},t);Array.isArray(null==t?void 0:t.views)&&(h.views=c(t.views));const d=null==t?void 0:t.decluttering_templates;if(d&&"object"==typeof d){const t={};for(const[e,n]of Object.entries(d)){let o=c(n);if(a.has(e)){const t=Jo(o,i,s);l(t,o)&&(r+=1),o=t}t[e]=o}h.decluttering_templates=t}return{config:h,cards:o,templates:r}}function Qo(t,e,i){if(Object.prototype.hasOwnProperty.call(Bt(t),e))return!1;if(i===te)return!0;const s=ee(t);return s.includes(i)||s.includes("*")}class Xo extends a{constructor(){super(...arguments),this._renameTo="",this._renaming=!1,this._duplicateTo="",this._busy=!1,this._modernisePending=!1,this._similarNames={},this._searchQuery="",this._searching=!1,this._varTo=""}get _config(){return this.config}get _savedLovelace(){var t,e,i;return null!==(i=null!==(e=null===(t=M())||void 0===t?void 0:t.config)&&void 0!==e?e:this.lovelace)&&void 0!==i?i:p()}static get styles(){return Pi}_fireConfigChanged(t){r(this,"config-changed",{config:t})}_saveDashboard(t,e,i){return Ti(this,t,e,i)}render(){return this.hass&&this._config?this._renderUsages():t``}_renderUsages(){var i,s;const n=null===(i=this._config)||void 0===i?void 0:i.template;if(!n)return t``;const a=this._savedLovelace;if(!a)return t`<div class="usages">
        <ha-alert alert-type="warning">${e("template_editor.usages_unreadable",void 0,this.hass)}</ha-alert>
      </div>`;(null===(s=this._usages)||void 0===s?void 0:s.name)===n&&this._usages.ll===a||(this._usages={name:n,ll:a,usages:ie(a,n)});const{views:o,templates:r}=this._usages.usages,l=o.reduce((t,e)=>t+e.count,0),c=document.location.pathname.split("/").slice(0,2).join("/");return t`
      <div class="usages">
        ${0!==l||r.length?t`
                <p class="hint">
                  ${e(1===l?"template_editor.usages_one":"template_editor.usages_many",{total:l,name:n},this.hass)}
                </p>
                <ul>
                  ${o.map(i=>t`
                      <li>
                        <a href=${`${c}/${i.path||i.index}`} target="_blank" rel="noreferrer">
                          ${i.title||i.path||e("template_editor.untitled_view",void 0,this.hass)}
                        </a>
                        —
                        ${1===i.count?e("template_editor.used_once",void 0,this.hass):e("template_editor.used_times",{count:i.count},this.hass)}
                      </li>
                    `)}
                </ul>
              `:t`<ha-alert alert-type="info">
                ${e("template_editor.usages_none",{name:n},this.hass)}
              </ha-alert>`}
        ${r.length?t`<ha-alert alert-type="info">
                ${e(1===r.length?"template_editor.used_by_template":"template_editor.used_by_templates",{names:r.join(", ")},this.hass)}
              </ha-alert>`:t``}
        ${this._renderElsewhere(n)} ${this._renderImpact(a,n)}
        <decluttering-card-plus-health .hass=${this.hass} .lovelace=${a}
          >${this._renderUndo()}</decluttering-card-plus-health
        >
        ${this._renderSimilar(a)} ${this._renderSearch()} ${this._renderRename(n,l)}
        ${this._renderRenameVariable(n)} ${this._renderDuplicate(n)} ${this._renderModernise()}
        ${this._toolError?t`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:t``}
      </div>
    `}_renderUndo(){var i,s;const n=se();if(!n)return t``;const a=ne(n.operation,this.hass),o=new Date(n.at).toLocaleTimeString(null===(s=null===(i=this.hass)||void 0===i?void 0:i.locale)||void 0===s?void 0:s.language);return t`
      <div class="undo">
        <p class="hint">${e("undo.held",{operation:a,time:o},this.hass)}</p>
        ${this._undoChanged?t`<ha-alert alert-type="warning">
                ${e("undo.changed_here",{operation:a,dashboards:this._undoChanged.join(", ")},this.hass)}
              </ha-alert>`:t``}
        <ha-button .disabled=${this._busy} @click=${this._undo}>
          ${e(this._undoChanged?"undo.anyway_button":"undo.button",{operation:a},this.hass)}
        </ha-button>
      </div>
    `}async _undo(){const t=se();if(t){this._busy=!0;try{const e=await ae(this,this.hass,t,!!this._undoChanged,!1);this._undoChanged="changed"===(null==e?void 0:e.result)?e.dashboards:void 0}finally{this._busy=!1}}}_renderSimilar(i){var s;if((null===(s=this._similar)||void 0===s?void 0:s.ll)!==i){const t=oe(i);this._similar={ll:i,cards:t,groups:No(t.map(t=>t.config))}}const{cards:n,groups:a}=this._similar;if(!a.length)return t``;const o=Object.keys(m(i));return t`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${e(1===a.length?"tools.similar_header_one":"tools.similar_header",{count:a.length},this.hass)}
        </span>
        <p class="hint">${e("tools.similar_hint",{max:8},this.hass)}</p>
        ${a.slice(0,10).map(t=>this._renderSimilarGroup(t,n,o))}
      </ha-expansion-panel>
    `}_renderSimilarGroup(i,s,n){var a;const o=i.indices.map(t=>s[t]),r=Mo(o.map(t=>t.config)),l=(null!==(a=this._similarNames[i.key])&&void 0!==a?a:function(t,e,i=[]){let s=Io(t.replace(/^custom:/,"").replace(/-/g,"_")).toLowerCase();/(^|_)card$/.test(s)||(s=`${s}_card`);const n=new Set(i.map(t=>"string"==typeof(null==t?void 0:t.entity)&&t.entity.includes(".")?t.entity.split(".")[0]:"")),[a]=[...n];return 1===n.size&&a&&(s=`${Io(a).toLowerCase()}_${s}`),ri(s,e)}(i.type,n,o.map(t=>t.config))).trim(),c=this._similarPending===`${i.key}\0${l}`,h=n.includes(l);return t`
      <div class="similar">
        <h3>${e("tools.similar_group",{count:o.length,type:i.type},this.hass)}</h3>
        <p class="hint">${e("tools.similar_differ",{names:r.names.join(", ")},this.hass)}</p>
        <ul>
          ${o.slice(0,8).map(e=>t`<li>${e.label}</li>`)}
        </ul>
        ${o.length>8?t`<p class="hint">
                ${e("editor.matches_more",{count:o.length-8},this.hass)}
              </p>`:t``}
        ${h?t`<ha-alert alert-type="error">${e("tools.name_taken",{name:l},this.hass)}</ha-alert>`:t``}
        ${c?t`
                <ha-alert alert-type="warning">
                  ${e("tools.similar_confirm",{name:l,count:o.length},this.hass)}
                </ha-alert>
                <p class="hint">${e("tools.similar_template",{name:l},this.hass)}</p>
                ${Fi(`${i.key}\0${l}`,t`<ha-yaml-editor
                    .hass=${this.hass}
                    .defaultValue=${{[l]:r.template}}
                    read-only
                  ></ha-yaml-editor>`)}
                <p class="hint">${e("tools.similar_first_card",void 0,this.hass)}</p>
                ${xo(o[0].config,Do(l,r.variables[0],r.layout[0]),this.hass)}
              `:t``}
        ${Ei({label:e("tools.similar_name",void 0,this.hass),value:l,disabled:this._busy,onInput:t=>{this._similarNames=Object.assign(Object.assign({},this._similarNames),{[i.key]:t}),this._similarPending=void 0}})}
        <ha-button
          .disabled=${this._busy||!l||h}
          @click=${()=>{this._makeTemplate(i,o,l)}}
        >
          ${e(c?"tools.similar_make_anyway":"tools.similar_make",void 0,this.hass)}
        </ha-button>
      </div>
    `}async _makeTemplate(t,e,i){const s=`${t.key}\0${i}`;if(this._similarPending!==s)return void(this._similarPending=s);const n=await this._saveDashboard(t=>function(t,e,i){const{template:s,variables:n,layout:a}=Mo(e);let o=Mt(t,i,s);return e.forEach((t,e)=>{o=q(o,t,Do(i,n[e],a[e]))}),o}(t,e.map(t=>t.config),i),"make_template");if(n){this._similarPending=void 0;const e=Object.assign({},this._similarNames);delete e[t.key],this._similarNames=e}}_renderElsewhere(i){var s;if((null===(s=this._remoteUsages)||void 0===s?void 0:s.name)!==i){this._remoteUsages={name:i,list:[]};const t=document.location.pathname.split("/").filter(Boolean)[0];re(this.hass,i,t).then(t=>{var e;(null===(e=this._remoteUsages)||void 0===e?void 0:e.name)===i&&(this._remoteUsages={name:i,list:t})})}const n=this._remoteUsages.list;if(!n.length)return t``;const a=n.map(t=>`${t.urlPath} (${t.total})`).join(", ");return t`<ha-alert alert-type="info">
      ${e("template_editor.usages_elsewhere",{list:a},this.hass)}
    </ha-alert>`}_renderImpact(i,s){const n=le(i,s);if(!n||!this._config)return t``;const a=t=>{if(t)return F(n.variables,t,T(t),s,this.hass,!0)};let o,r;try{o=a(m(i)[s]),r=a(m(i,void 0,this._config)[s])}catch(l){return t``}return t`
      <ha-expansion-panel outlined>
        <span slot="header">${e("template_editor.impact_header",void 0,this.hass)}</span>
        <p class="hint">${e("template_editor.impact_diff_hint",void 0,this.hass)}</p>
        ${ko(o,r,this.hass)}
      </ha-expansion-panel>
    `}_renderRename(i,s){const n=this._renameTo.trim(),a=!!n&&this._renamePending===n,o=s?1===s?e("tools.rewrites_one",void 0,this.hass):e("tools.rewrites_many",{count:s},this.hass):"";return t`
      <div class="rename">
        <h3>${e("tools.rename_header",void 0,this.hass)}</h3>
        <p class="hint">${e("tools.rename_hint",void 0,this.hass)}</p>
        ${this._renameError?t`<ha-alert alert-type="error">${this._renameError}</ha-alert>`:t``}
        ${a?t`<ha-alert alert-type="warning">
                ${e("tools.rename_confirm",{from:i,to:n,rewrites:o},this.hass)}
              </ha-alert>`:t``}
        ${Ei({label:e("tools.new_name",void 0,this.hass),value:this._renameTo,disabled:this._renaming,onInput:t=>this._renameChanged(t)})}
        <ha-button .disabled=${this._renaming||!n||n===i} @click=${this._rename}>
          ${a?e("tools.rename_anyway",void 0,this.hass):1===s?e("tools.rename_update_one",void 0,this.hass):s?e("tools.rename_update_many",{count:s},this.hass):e("tools.rename",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderModernise(){const i=this._savedLovelace,s=i?ce(i):0;return s?t`
      <div class="rename">
        <h3>${e("tools.modernise_header",void 0,this.hass)}</h3>
        <p class="hint">
          ${e(1===s?"tools.modernise_hint_one":"tools.modernise_hint_many",{count:s},this.hass)}
        </p>
        ${this._modernisePending?t`<ha-alert alert-type="warning">
                ${e(1===s?"tools.modernise_confirm_one":"tools.modernise_confirm_many",{count:s},this.hass)}
              </ha-alert>`:t``}
        <ha-button .disabled=${this._busy} @click=${this._modernise}>
          ${e(this._modernisePending?"tools.modernise_anyway":1===s?"tools.modernise_one":"tools.modernise_many",void 0,this.hass)}
        </ha-button>
      </div>
    `:t``}async _modernise(){if(!this._modernisePending)return void(this._modernisePending=!0);await this._saveDashboard(t=>he(t),"modernise")&&(this._modernisePending=!1)}_renameChanged(t){this._renameTo=t,this._renameError=void 0,this._renamePending=void 0}async _rename(){var t,i;const s=null===(t=this._config)||void 0===t?void 0:t.template,n=this._renameTo.trim();if(!s||!n||n===s)return;const a=M();if(a)if(void 0===m(a.config)[n])if(this._renamePending===n){this._renaming=!0,this._renameError=void 0;try{await V(this,this.hass,"rename_template",[{urlPath:z(),build:t=>de(t,s,n)}],this._config),this._undoChanged=void 0,this._fireConfigChanged(Object.assign(Object.assign({},this._config),{template:n})),this._renameTo="",this._renamePending=void 0}catch(o){this._renameError=e("tools.save_failed",{message:null!==(i=null==o?void 0:o.message)&&void 0!==i?i:o},this.hass)}finally{this._renaming=!1}}else this._renamePending=n;else this._renameError=e("tools.name_taken",{name:n},this.hass);else this._renameError=e("tools.cannot_rename_here",void 0,this.hass)}_renderSearch(){const i=this._searchQuery.trim(),s=this._searchResult,n=t=>"variables"===t.where?"":e(`tools.search_in_${t.where}`,void 0,this.hass),a=t=>t.view.title||t.view.path||e("template_editor.untitled_view",void 0,this.hass);return t`
      <div class="rename">
        <h3>${e("tools.search_header",void 0,this.hass)}</h3>
        <p class="hint">${e("tools.search_hint",void 0,this.hass)}</p>
        ${Ei({label:e("tools.search_label",void 0,this.hass),value:this._searchQuery,onInput:t=>{this._searchQuery=t},onKeydown:t=>{"Enter"===t.key&&this._search()}})}
        <ha-button .disabled=${this._searching||!i} @click=${()=>{this._search()}}>
          ${e(this._searching?"tools.searching":"tools.search",void 0,this.hass)}
        </ha-button>
        ${!s||s.cards.length||s.templates.length?t``:t`<p class="hint">${e("tools.search_none",{query:s.query},this.hass)}</p>`}
        ${(null==s?void 0:s.cards.length)?t`
                <p class="hint">${e("tools.search_cards",{count:s.cards.length},this.hass)}</p>
                <ul>
                  ${s.cards.slice(0,Ai).map(e=>t`
                      <li>
                        <a
                          href=${`/${e.urlPath}/${e.view.path||e.view.index}`}
                          target="_blank"
                          rel="noreferrer"
                          >${e.urlPath} › ${a(e)}</a
                        >
                        — ${e.template}: <code>${e.variable}</code> = ${e.value}${n(e)}
                      </li>
                    `)}
                </ul>
                ${s.cards.length>Ai?t`<p class="hint">
                        ${e("editor.matches_more",{count:s.cards.length-Ai},this.hass)}
                      </p>`:t``}
              `:t``}
        ${(null==s?void 0:s.templates.length)?t`
                <p class="hint">${e("tools.search_templates",{count:s.templates.length},this.hass)}</p>
                <ul>
                  ${s.templates.slice(0,Ai).map(e=>t`<li>
                          ${e.urlPath} › ${e.template}: <code>${e.path}</code> = ${e.value}
                        </li>`)}
                </ul>
                ${s.templates.length>Ai?t`<p class="hint">
                        ${e("editor.matches_more",{count:s.templates.length-Ai},this.hass)}
                      </p>`:t``}
              `:t``}
      </div>
    `}async _search(){const t=this._searchQuery.trim();if(t&&!this._searching){this._searching=!0;try{const i=z(),s=qt(this.hass),n=[{urlPath:i,config:this._savedLovelace}];for(const t of this.hass?await ue(this.hass):[])if(pe(t)!==i)try{n.push({urlPath:t,config:await Ut(s,t)})}catch(e){}this._searchResult=Object.assign({query:t},function(t,e){var i;const s=e.trim().toLowerCase(),n=[],a=[];if(!s)return{cards:n,templates:a};const o=t=>t.toLowerCase().includes(s);for(const{urlPath:r,config:l}of t){const t=(t,e)=>{var i,s;const a=(i,s,a)=>{n.push({urlPath:r,view:e,template:t.template,where:i,variable:s,value:a})},l=(t,e,i="")=>{for(const s of x(e)){const[e,n]=Object.entries(s)[0];for(const s of jo(n,`${i}${e}`))o(s.value)&&a(t,s.path,s.value)}};l("variables",t.variables);for(const n of null!==(i=j(t.for_each))&&void 0!==i?i:[])l("for_each",n);const c=null===(s=t.for_each_from)||void 0===s?void 0:s.overrides;if(c&&"object"==typeof c)for(const[n,r]of Object.entries(c))o(n)&&a("overrides",n,n),l("overrides",r,`${n} › `);for(const n of Ao)if(void 0!==t[n])for(const e of jo(t[n],n))o(e.value)&&a("override_block",e.path,e.value)},e=(i,s)=>{if(Array.isArray(i))for(const t of i)e(t,s);else if(i&&"object"==typeof i&&!Yt(i.type)){wt.includes(i.type)&&"string"==typeof i.template&&t(i,s);for(const t of Object.values(i))e(t,s)}};(null!==(i=null==l?void 0:l.views)&&void 0!==i?i:[]).forEach((t,i)=>{var s,n,a;return e(t,{title:null!==(n=null!==(s=null==t?void 0:t.title)&&void 0!==s?s:null==t?void 0:t.path)&&void 0!==n?n:"",path:null!==(a=null==t?void 0:t.path)&&void 0!==a?a:"",index:i})});for(const[i,s]of Object.entries(Bt(l))){const t=Object.assign({},null!=s?s:{});delete t.type,delete t.template;for(const e of jo(t,""))o(e.value)&&a.push(Object.assign({urlPath:r,template:i},e))}}return{cards:n,templates:a}}(n,t))}finally{this._searching=!1}}}_renderRenameVariable(i){const s=Go(this._config);if(!s.length||!this._config)return t``;const n=this._varFrom&&s.includes(this._varFrom)?this._varFrom:void 0,a=this._varTo.trim(),o=this._varPending,r=!!o&&o.from===n&&o.to===a,l=r&&o.elsewhere.length?e("tools.rename_variable_elsewhere",{list:o.elsewhere.map(t=>`${t.urlPath} (${t.cards})`).join(", ")},this.hass):"";return t`
      <div class="rename">
        <h3>${e("tools.rename_variable_header",void 0,this.hass)}</h3>
        <p class="hint">${e("tools.rename_variable_hint",void 0,this.hass)}</p>
        ${this._varError?t`<ha-alert alert-type="error">${this._varError}</ha-alert>`:t``}
        ${r&&n?t`
                <ha-alert alert-type="warning">
                  ${e("tools.rename_variable_confirm",{from:n,to:a,templates:o.templates,cards:o.cards,elsewhere:l},this.hass)}
                </ha-alert>
                ${xo(this._config,Jo(this._config,n,a),this.hass)}
              `:t``}
        <ha-form
          .hass=${this.hass}
          .data=${{variable:null!=n?n:""}}
          .schema=${[{name:"variable",selector:{select:{mode:"dropdown",options:s.map(t=>({value:t,label:t}))}}}]}
          .computeLabel=${()=>e("tools.rename_variable_pick",void 0,this.hass)}
          @value-changed=${this._varPicked}
        ></ha-form>
        ${Ei({label:e("tools.new_name",void 0,this.hass),value:this._varTo,disabled:this._busy,onInput:t=>this._varToChanged(t)})}
        <ha-button
          .disabled=${this._busy||!n||!a||a===n}
          @click=${()=>{this._renameVariable(i)}}
        >
          ${e(r?"tools.rename_anyway":"tools.rename_variable",void 0,this.hass)}
        </ha-button>
      </div>
    `}_varPicked(t){t.stopPropagation(),this._varFrom=t.detail.value.variable||void 0,this._varError=void 0,this._varPending=void 0}_varToChanged(t){this._varTo=t,this._varError=void 0,this._varPending=void 0}async _renameVariable(t){var i;const s=this._varFrom,n=this._varTo.trim();if(!s||!n||n===s||!this._config)return;if(!function(t){return/^[A-Za-z0-9_-]+$/.test(t)}(n))return void(this._varError=e("tools.rename_variable_invalid",{name:n},this.hass));const a=M();if(!a)return void(this._varError=e("tools.cannot_save_here",void 0,this.hass));if(function(t,e,i,s){const n=Bt(t);for(const a of Yo(t,e))if(Go(a===e&&s?s:n[a]).includes(i))return!0;return!1}(a.config,t,n,this._config))return void(this._varError=e("tools.rename_variable_taken",{name:n},this.hass));const o=z(),r=this._varPending;if(r&&r.from===s&&r.to===n){this._busy=!0,this._varError=void 0;try{let e;await V(this,this.hass,"rename_variable",[{urlPath:o,build:i=>(e=Yo(i,t),Zo(i,t,s,n).config)},...r.elsewhere.map(i=>({urlPath:i.urlPath,build:i=>Qo(i,t,o)?Zo(i,t,s,n,e).config:i}))],this._config),this._undoChanged=void 0,this._fireConfigChanged(Jo(this._config,s,n)),this._varFrom=n,this._varTo="",this._varPending=void 0}catch(l){this._varError=e("tools.save_failed",{message:null!==(i=null==l?void 0:l.message)&&void 0!==i?i:l},this.hass)}finally{this._busy=!1}}else{this._busy=!0;try{const e=qt(this.hass),i=await Ut(e,o).catch(()=>a.config),r=Zo(i,t,s,n),l=Yo(i,t),h=[];for(const a of this.hass?await ue(this.hass):[]){if(pe(a)===o)continue;let i;try{i=await Ut(e,a)}catch(c){continue}if(!Qo(i,t,o))continue;const r=Zo(i,t,s,n,l);(r.cards||r.templates)&&h.push({urlPath:a,cards:r.cards})}this._varPending={from:s,to:n,cards:r.cards,templates:r.templates,elsewhere:h}}finally{this._busy=!1}}}_renderDuplicate(i){const s=this._duplicateTo.trim(),n=!!s&&this._duplicatePending===s;return t`
      <div class="rename">
        <h3>${e("tools.duplicate_header",void 0,this.hass)}</h3>
        <p class="hint">${e("tools.duplicate_hint",void 0,this.hass)}</p>
        ${n?t`<ha-alert alert-type="warning">
                ${e("tools.duplicate_confirm",{to:s,name:i},this.hass)}
              </ha-alert>`:t``}
        ${Ei({label:e("tools.copy_name",void 0,this.hass),value:this._duplicateTo,disabled:this._busy,onInput:t=>this._duplicateChanged(t)})}
        <ha-button .disabled=${this._busy||!s||s===i} @click=${this._duplicate}>
          ${e(n?"tools.duplicate_anyway":"tools.duplicate",void 0,this.hass)}
        </ha-button>
      </div>
    `}_duplicateChanged(t){this._duplicateTo=t,this._toolError=void 0,this._duplicatePending=void 0}async _duplicate(){var t,i;const s=null===(t=this._config)||void 0===t?void 0:t.template,n=this._duplicateTo.trim();if(!s||!n||n===s)return;const a=M();if(a&&void 0!==m(a.config)[n])return void(this._toolError=e("tools.name_taken",{name:n},this.hass));if(this._duplicatePending!==n)return void(this._duplicatePending=n);const o=Object.assign(Object.assign({},this._config),{template:n}),r=H(null!==(i=null==a?void 0:a.config)&&void 0!==i?i:this.lovelace,s),l=await this._saveDashboard(t=>{var e,i;return Dt(t,null!==(i=null===(e=null==r?void 0:r.view)||void 0===e?void 0:e.index)&&void 0!==i?i:0,o)},"duplicate");l&&(this._duplicateTo="",this._duplicatePending=void 0)}}i([s({attribute:!1})],Xo.prototype,"hass",void 0),i([s({attribute:!1})],Xo.prototype,"lovelace",void 0),i([s({attribute:!1})],Xo.prototype,"config",void 0),i([n()],Xo.prototype,"_renameTo",void 0),i([n()],Xo.prototype,"_renameError",void 0),i([n()],Xo.prototype,"_renaming",void 0),i([n()],Xo.prototype,"_renamePending",void 0),i([n()],Xo.prototype,"_duplicateTo",void 0),i([n()],Xo.prototype,"_duplicatePending",void 0),i([n()],Xo.prototype,"_toolError",void 0),i([n()],Xo.prototype,"_busy",void 0),i([n()],Xo.prototype,"_modernisePending",void 0),i([n()],Xo.prototype,"_remoteUsages",void 0),i([n()],Xo.prototype,"_undoChanged",void 0),i([n()],Xo.prototype,"_similarNames",void 0),i([n()],Xo.prototype,"_similarPending",void 0),i([n()],Xo.prototype,"_searchQuery",void 0),i([n()],Xo.prototype,"_searching",void 0),i([n()],Xo.prototype,"_searchResult",void 0),i([n()],Xo.prototype,"_varFrom",void 0),i([n()],Xo.prototype,"_varTo",void 0),i([n()],Xo.prototype,"_varError",void 0),i([n()],Xo.prototype,"_varPending",void 0),customElements.get("decluttering-template-usages-tab")||customElements.define("decluttering-template-usages-tab",Xo);class tr extends a{constructor(){super(...arguments),this._selectedTab="settings",this._suggestedNothing=!1,this._busy=!1,this._declutterPending=!1,this._promoteName="",this._loadedElements=!1}get _savedLovelace(){var t,e,i;return null!==(i=null!==(e=null===(t=M())||void 0===t?void 0:t.config)&&void 0!==e?e:this.lovelace)&&void 0!==i?i:p()}static schema(){var t;return null!==(t=tr._schema)&&void 0!==t||(tr._schema=[{name:"template",label:e("template_editor.template_label"),selector:{text:{}}},{name:"thingType",label:e("template_editor.type_label"),selector:{select:{mode:"dropdown",options:[{value:"card",label:e("template_editor.type_card")},{value:"badge",label:e("template_editor.type_badge")},{value:"row",label:e("template_editor.type_row")},{value:"element",label:e("template_editor.type_element")}]}}},{name:"description",label:e("template_editor.description_label"),helper:e("template_editor.description_helper"),selector:{text:{multiline:!0}}},{name:"variables",label:e("template_editor.declarations_label"),helper:e("template_editor.declarations_helper"),selector:{object:{}}},{name:"default",label:e("template_editor.defaults_label"),helper:e("template_editor.defaults_helper"),selector:{object:{}}}]),tr._schema}setConfig(t){this._config=t,this._suggestion=void 0,this._suggestedNothing=!1}render(){var i;if(!this.hass||!this._config)return t``;const s={};_(this._config.default)&&_(this._config.defaults)||(s.default=e("error.variables_shape",void 0,this.hass)),me(this._config.variables)||(s.variables=e("template_editor.declarations_shape",void 0,this.hass));const n={template:this._config.template,thingType:null!==(i=y(this._config))&&void 0!==i?i:"card",description:this._config.description,variables:this._config.variables,default:vt(this._config)};return t`
      <ha-tab-group .active=${this._selectedTab} @click=${this._activateTab}>
        <ha-tab-group-tab slot="nav" panel="settings">
          ${e("template_editor.tab_settings",void 0,this.hass)}
        </ha-tab-group-tab>
        ${"card"===n.thingType&&void 0===this._config.group?t`
                <ha-tab-group-tab slot="nav" panel="card">
                  ${e("template_editor.tab_card",void 0,this.hass)}
                </ha-tab-group-tab>
                <ha-tab-group-tab slot="nav" panel="change_card">
                  ${e("template_editor.tab_change_card",void 0,this.hass)}
                </ha-tab-group-tab>
              `:"row"===n.thingType?t`<ha-tab-group-tab slot="nav" panel="row">
                  ${e("template_editor.tab_row",void 0,this.hass)}
                </ha-tab-group-tab>`:t``}
        <ha-tab-group-tab slot="nav" panel="usages">
          ${e("template_editor.tab_usages",void 0,this.hass)}
        </ha-tab-group-tab>
        <ha-tab-group-tab slot="nav" panel="share">
          ${e("template_editor.tab_share",void 0,this.hass)}
        </ha-tab-group-tab>
      </ha-tab-group>
      ${"settings"===this._selectedTab?t`
              ${this._renderInUse()} ${this._renderDiagnostics()} ${this._renderExamplePicker()}
              ${this._renderSuggest("card"===n.thingType)} ${this._renderPromote()} ${this._renderOrder()}
              ${this._renderGroupOrder()}
              <ha-form
                .hass=${this.hass}
                .data=${n}
                .schema=${tr.schema()}
                .error=${s}
                .computeLabel=${t=>{var e;return null!==(e=t.label)&&void 0!==e?e:t.name}}
                .computeHelper=${t=>{var e;return null!==(e=t.helper)&&void 0!==e?e:""}}
                @value-changed=${this._valueChanged}
              ></ha-form>
              ${this._renderLint()} ${this._renderDeclutter()}
            `:"card"===this._selectedTab?t`
                <hui-card-element-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .value=${this._config.card}
                  @config-changed=${this._cardChanged}
                ></hui-card-element-editor>
              `:"change_card"===this._selectedTab?t`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this.lovelace}
                    @config-changed=${this._cardPicked}
                  ></hui-card-picker>
                `:"row"===this._selectedTab?t`
                    <hui-row-element-editor
                      .hass=${this.hass}
                      .lovelace=${this.lovelace}
                      .value=${this._config.row}
                      @config-changed=${this._rowChanged}
                    ></hui-row-element-editor>
                  `:"usages"===this._selectedTab?t`<decluttering-template-usages-tab
                      .hass=${this.hass}
                      .lovelace=${this.lovelace}
                      .config=${this._config}
                      @select-tab=${this._selectTab}
                    ></decluttering-template-usages-tab>`:"share"===this._selectedTab?t`<decluttering-template-share-tab
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        .config=${this._config}
                        @select-tab=${this._selectTab}
                      ></decluttering-template-share-tab>`:t``}
    `}_renderDiagnostics(){if(!this._config||!me(this._config.variables))return t``;const{unused:i,duplicated:s,contradictory:n}=fe(this._config);return t`
      ${i.length?t`<ha-alert alert-type="info">
              ${e(1===i.length?"template_editor.declared_unused_one":"template_editor.declared_unused_many",{names:i.join(", ")},this.hass)}
            </ha-alert>`:t``}
      ${s.length?t`<ha-alert alert-type="warning">
              ${e(1===s.length?"template_editor.duplicated_one":"template_editor.duplicated_many",{names:s.join(", ")},this.hass)}
            </ha-alert>`:t``}
      ${n.length?t`<ha-alert alert-type="warning">
              ${e(1===n.length?"template_editor.contradictory_one":"template_editor.contradictory_many",{names:n.join(", ")},this.hass)}
            </ha-alert>`:t``}
    `}_renderExamplePicker(){var i;const s=null===(i=this._config)||void 0===i?void 0:i.template,n=w(this._config);if(!s||!n.length)return t``;const a=ge.get(s);return t`
      <ha-form
        .hass=${this.hass}
        .data=${{example:void 0===a||a>=n.length?"":String(a)}}
        .schema=${[{name:"example",selector:{select:{mode:"dropdown",options:[{value:"",label:e("template_editor.preview_defaults",void 0,this.hass)},...n.map((t,i)=>({value:String(i),label:e("template_editor.example_n",{number:i+1},this.hass)}))]}}}]}
        .computeLabel=${()=>e("template_editor.preview_example_label",void 0,this.hass)}
        @value-changed=${this._previewExamplePicked}
      ></ha-form>
    `}_previewExamplePicked(t){var e;t.stopPropagation();const i=null===(e=this._config)||void 0===e?void 0:e.template;if(!i)return;const s=t.detail.value.example;void 0===s||""===s?ge.delete(i):ge.set(i,Number(s)),window.dispatchEvent(new CustomEvent(_e,{detail:{template:i}})),this.requestUpdate()}_renderLint(){if(!this._config)return t``;const i=this._savedLovelace,s=m(i,void 0,this._config)[this._config.template],n=function(t,e=[]){if(!t||"object"!=typeof t)return[];const i={findings:[],heads:new Map,targets:[]};for(const r of _i){const e=t[r];void 0!==e&&xi(e,r,i)}g(t).forEach((t,e)=>{void 0!==t.default&&xi(t.default,`variables[${e}].default`,i)});const s=new Set([...ki(t),...e,...st,...ot(t)]),n=[...i.findings];for(const r of i.targets){if(s.has(r.name)||i.heads.has(r.name))continue;const t=At(r.name,[...s,...i.heads.keys()]);n.push({level:"warning",key:"lint.target_unknown",params:t?{name:r.name,placeholder:r.placeholder,closest:t}:{name:r.name,placeholder:r.placeholder},path:r.path})}const a=[...i.heads.entries()].filter(([t])=>!s.has(t));a.length&&n.push({level:"info",key:"lint.undeclared",params:{names:a.map(([t,e])=>a.length>1?`${t} (${e})`:t).join(", ")},path:a.length>1?"":a[0][1]});const o=new Set;return n.filter(t=>{const e=JSON.stringify([t.key,t.params,t.path]);return!o.has(e)&&(o.add(e),!0)})}(this._config,[...ki(s),...Object.keys(lt(i))]);return n.length?t`${n.map(i=>t`<ha-alert alert-type=${i.level}>
          ${e(i.key,i.params,this.hass)}${i.params.closest?e("error.did_you_mean",{closest:i.params.closest},this.hass):""}${i.path?e("lint.where",{path:i.path},this.hass):""}
        </ha-alert>`)}`:t``}_renderOrder(){const i=g(this._config);return i.length<2?t``:t`
      <div class="order">
        <p class="hint">${e("template_editor.order_hint",void 0,this.hass)}</p>
        ${this._renderSortable("variables",i.map(t=>{var e;return{label:null!==(e=t.label)&&void 0!==e?e:t.name,name:t.name}}),(t,e)=>this._move(t,e))}
      </div>
    `}_renderSortable(i,s,n){const a=(t,e)=>{t.preventDefault();const s=this._dragging;this._dragging=void 0,(null==s?void 0:s.list)===i&&n(s.from,e)};return t`
      <ul>
        ${s.map((o,r)=>t`
            <li
              draggable="true"
              @dragstart=${t=>{var e;this._dragging={list:i,from:r},null===(e=t.dataTransfer)||void 0===e||e.setData("text/plain",o.name),t.dataTransfer&&(t.dataTransfer.effectAllowed="move")}}
              @dragover=${t=>{var e;(null===(e=this._dragging)||void 0===e?void 0:e.list)===i&&t.preventDefault()}}
              @drop=${t=>a(t,r)}
              @dragend=${()=>{this._dragging=void 0}}
            >
              <ha-svg-icon class="handle" .path=${"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"}></ha-svg-icon>
              <span>${o.label}</span>
              <span class="spacer"></span>
              <ha-icon-button
                .path=${"M7,15L12,10L17,15H7Z"}
                .disabled=${0===r}
                .label=${e("template_editor.move_up",{name:o.name},this.hass)}
                @click=${()=>n(r,r-1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,10L12,15L17,10H7Z"}
                .disabled=${r===s.length-1}
                .label=${e("template_editor.move_down",{name:o.name},this.hass)}
                @click=${()=>n(r,r+1)}
              ></ha-icon-button>
            </li>
          `)}
      </ul>
    `}_move(t,e){const i=g(this._config),s=ve(i,t,e);s!==i&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{variables:s}))}_renderGroupOrder(){var i;const s=null===(i=this._config)||void 0===i?void 0:i.group,n=ye(s);if(void 0===s||n.length<2)return t``;const a=n.map((t,e)=>{var i,s,n,a;const o=null!==(n=null!==(s=null!==(i=null==t?void 0:t.name)&&void 0!==i?i:null==t?void 0:t.heading)&&void 0!==s?s:null==t?void 0:t.title)&&void 0!==n?n:null==t?void 0:t.entity,r=String(null!==(a=null==t?void 0:t.type)&&void 0!==a?a:"?").replace(/^custom:/,"");return{label:"string"==typeof o?`${r} (${o})`:r,name:`${e+1} ${r}`}});return t`
      <div class="order">
        <p class="hint">${e("template_editor.group_order_hint",void 0,this.hass)}</p>
        ${this._renderSortable("group",a,(t,e)=>{const i=ve(n,t,e);i!==n&&this._config&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{group:be(s,i)}))})}
      </div>
    `}_renderPromote(){const i=ui(this._config);if(!this._config||!i)return t``;const s=function(t){const e=[],i=(t,s)=>{if(Array.isArray(t))t.forEach((t,e)=>i(t,[...s,e]));else if(t&&"object"==typeof t)for(const[e,n]of Object.entries(t))"type"===e&&"string"==typeof n||i(n,[...s,e]);else"string"==typeof t&&gt.test(t)||s.length&&null!=t&&("string"!=typeof t&&"number"!=typeof t&&"boolean"!=typeof t||e.push({path:s,value:t,label:pi(s)}))};return i(t,[]),e}(this._config[i]);if(!s.length)return t``;const n=this._promotePath?JSON.stringify(this._promotePath):"",a=t=>{const e=String(t);return e.length>40?`${e.slice(0,39)}…`:e};return t`
      <ha-expansion-panel outlined class="promote">
        <span slot="header">${e("template_editor.promote_header",void 0,this.hass)}</span>
        <p class="hint">${e("template_editor.promote_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${{setting:n}}
          .schema=${[{name:"setting",selector:{select:{mode:"dropdown",options:s.map(t=>({value:JSON.stringify(t.path),label:`${t.label} = ${a(t.value)}`}))}}}]}
          .computeLabel=${()=>e("template_editor.promote_pick",void 0,this.hass)}
          @value-changed=${this._promotePicked}
        ></ha-form>
        ${this._promotePath?t`
                ${Ei({label:e("template_editor.promote_name",void 0,this.hass),value:this._promoteName,onInput:t=>{this._promoteName=t,this._promoteError=void 0}})}
                ${this._promoteError?t`<ha-alert alert-type="error">${this._promoteError}</ha-alert>`:t``}
                <ha-button .disabled=${!this._promoteName.trim()} @click=${this._promote}>
                  ${e("template_editor.promote_button",void 0,this.hass)}
                </ha-button>
              `:t``}
      </ha-expansion-panel>
    `}_promotePicked(t){t.stopPropagation();const e=t.detail.value.setting;e&&(this._promotePath=JSON.parse(e),this._promoteName=function(t,e){const i=[...t].reverse().find(t=>"string"==typeof t),s=t[t.length-1];return ri(("number"==typeof s?`${null!=i?i:"item"}_${s+1}`:null!=i?i:"value").replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value",e)}(this._promotePath,mi(this._config)),this._promoteError=void 0)}_promote(){if(!this._config||!this._promotePath)return;const t=this._promoteName.trim(),i=function(t,e,i){if(!hi.test(i))return{ok:!1,error:"name_invalid"};if(mi(t).includes(i))return{ok:!1,error:"name_taken"};const s=ui(t),n=s?function(t,e){return e.reduce((t,e)=>null==t?void 0:t[e],t)}(t[s],e):void 0;if(!s||null==n||"object"==typeof n)return{ok:!1,error:"gone"};const a={name:i,type:fi(n),default:n};return{ok:!0,template:Object.assign(Object.assign({},t),{[s]:gi(t[s],e,`[[${i}]]`),variables:St(t.variables,[a])})}}(this._config,this._promotePath,t);i.ok?(this._promotePath=void 0,this._promoteName="",this._fireConfigChanged(i.template)):this._promoteError=e(`template_editor.promote_${i.error}`,{name:t},this.hass)}_renderInUse(){var i;const s=null===(i=this._config)||void 0===i?void 0:i.template,n=this._savedLovelace;if(!s||!n)return t``;const{views:a,templates:o}=ie(n,s),r=a.reduce((t,e)=>t+e.count,0)+o.length;return r?t`<ha-alert alert-type="info">
      ${e(1===r?"template_editor.in_use_one":"template_editor.in_use_many",{total:r},this.hass)}
    </ha-alert>`:t``}_renderSuggest(i){var s;return i&&(null===(s=this._config)||void 0===s?void 0:s.card)?t`
      <div class="suggest">
        ${this._suggestedNothing?t`<ha-alert alert-type="info">
                ${e("template_editor.suggest_nothing",void 0,this.hass)}
              </ha-alert>`:t``}
        ${this._suggestion?t`<ha-alert alert-type="warning">
                ${e(1===this._suggestion.variables.length?"template_editor.suggest_confirm_one":"template_editor.suggest_confirm_many",{names:this._suggestion.variables.map(t=>t.name).join(", ")},this.hass)}
              </ha-alert>`:t``}
        <ha-button @click=${this._suggest}>
          ${e(this._suggestion?"template_editor.suggest_anyway":"template_editor.suggest_button",void 0,this.hass)}
        </ha-button>
      </div>
    `:t``}_suggest(){var t;if(!(null===(t=this._config)||void 0===t?void 0:t.card))return;if(this._suggestion){const t=Object.assign(Object.assign({},this._config),{card:this._suggestion.card});return t.variables=St(this._config.variables,this._suggestion.variables),this._suggestion=void 0,void this._fireConfigChanged(t)}this._suggestedNothing=!1;const e=g(this._config).map(t=>t.name),i=function(t,e){const i=new Set(e),s=[],n=new Map,a=(t,e)=>{const a=`${t.base} ${e}`,o=n.get(a);if(o)return o;let r=1,l=t.base;for(;i.has(l);)r+=1,l=`${t.base}_${r}`;return i.add(l),n.set(a,l),s.push({name:l,label:Xe(t,r),selector:t.selector,default:e}),l},o=t=>{if(Array.isArray(t))return t.map(o);if(!t||"object"!=typeof t)return t;const e={};for(const[i,s]of Object.entries(t)){const t=Object.prototype.hasOwnProperty.call(Qe,i)?Qe[i]:void 0;t&&"string"==typeof s&&!gt.test(s)&&t.matches(s)?e[i]=`[[${a(t,s)}]]`:e[i]=o(s)}return e};return{card:o(t),variables:s}}(this._config.card,e);i.variables.length?this._suggestion=i:this._suggestedNothing=!0}_renderDeclutter(){var i,s;const n=this._savedLovelace,a=oe(n),o="card"===y(null!==(i=this._config)&&void 0!==i?i:{})?$e(n):[];if(!a.length&&!o.length||!this._config)return t``;const r=this._config.template,l=!!r&&r in m(n),c=null!==(s=this._declutterOriginal)&&void 0!==s?s:this._declutterSection;return t`
      <ha-expansion-panel outlined>
        <span slot="header">${e("template_editor.declutter_header",void 0,this.hass)}</span>
        <p class="hint">${e("template_editor.declutter_hint",void 0,this.hass)}</p>
        ${a.length?t`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:a.map((t,e)=>({value:String(e),label:t.label}))}}}]}
                .computeLabel=${()=>e("template_editor.declutter_pick",void 0,this.hass)}
                @value-changed=${t=>this._declutterPicked(t,a)}
              ></ha-form>`:t``}
        ${o.length?t`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:o.map((t,i)=>({value:String(i),label:e(1===t.cards.length?"template_editor.declutter_section_one":"template_editor.declutter_section_many",{where:t.label,count:t.cards.length},this.hass)}))}}}]}
                .computeLabel=${()=>e("template_editor.declutter_pick_section",void 0,this.hass)}
                @value-changed=${t=>this._declutterSectionPicked(t,o)}
              ></ha-form>`:t``}
        ${c?t`
                <ha-button .disabled=${this._busy||!l} @click=${this._declutterReplace}>
                  ${e(this._declutterPending?"template_editor.declutter_replace_confirm":this._declutterSection?"template_editor.declutter_replace_section":"template_editor.declutter_replace",void 0,this.hass)}
                </ha-button>
                ${l?t``:t`<p class="hint">${e("template_editor.declutter_save_first",void 0,this.hass)}</p>`}
              `:t``}
      </ha-expansion-panel>
    `}_declutterPicked(t,e){t.stopPropagation();const i=e[Number(t.detail.value.pick)];if(!i||!this._config)return;this._declutterOriginal=i.config,this._declutterSection=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{card:JSON.parse(JSON.stringify(i.config))});delete s.group,this._fireConfigChanged(s)}_declutterSectionPicked(t,e){t.stopPropagation();const i=e[Number(t.detail.value.pick)];if(!i||!this._config)return;this._declutterSection={view:i.view,section:i.section,cards:i.cards},this._declutterOriginal=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{group:{cards:JSON.parse(JSON.stringify(i.cards))}});delete s.card,this._fireConfigChanged(s)}async _declutterReplace(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._declutterOriginal,n=this._declutterSection;if(!i||!s&&!n)return;if(!this._declutterPending)return void(this._declutterPending=!0);const a={type:"custom:decluttering-card-plus",template:i};let o=!1;const r=await this._saveDashboard(t=>{if(s)return q(t,s,a);const e=we(t,n.view,n.section,n.cards,[a]);return o=e===t,e},"declutter");r&&o&&(this._toolError=e("template_editor.declutter_section_changed",void 0,this.hass)),r&&(this._declutterPending=!1,this._declutterOriginal=void 0,this._declutterSection=void 0)}_selectTab(t){t.stopPropagation(),this._selectedTab=t.detail}_activateTab(t){const e=t.composedPath().find(t=>"ha-tab-group-tab"===t.localName),i=null==e?void 0:e.getAttribute("panel");i&&(this._selectedTab=i)}_valueChanged(t){if(!this._config)return;const e=t.detail.value,i=Object.assign(Object.assign({},this._config),{template:e.template,default:e.default});void 0!==this._config.defaults&&(JSON.stringify(e.default)===JSON.stringify(vt(this._config))?i.default=this._config.default:delete i.defaults),$(i,"description",e.description),$(i,"variables",e.variables);const s=void 0!==i.group&&"card"===e.thingType;s||delete i.group;for(const[n,a]of Object.entries(Si))tr.stubMember(!s&&e.thingType===n,i,n,a);this._fireConfigChanged(i)}_cardChanged(t){if(t.stopPropagation(),!this._config)return;this._suggestion=void 0,this._suggestedNothing=!1;const e=Object.assign(Object.assign({},this._config),{card:t.detail.config});this._fireConfigChanged(e)}_cardPicked(t){this._selectedTab="card",this._cardChanged(t)}_rowChanged(t){if(t.stopPropagation(),!this._config)return;const e=Object.assign(Object.assign({},this._config),{row:t.detail.config});this._fireConfigChanged(e)}_fireConfigChanged(t){this._suggestion=void 0,this._suggestedNothing=!1,r(this,"config-changed",{config:t})}static stubMember(t,e,i,s){t?i in e||(e[i]=s):delete e[i]}static get styles(){return Pi}_saveDashboard(t,e,i){return Ti(this,t,e,i)}async connectedCallback(){var t;super.connectedCallback(),null!==(t=this._stopLanguageListener)&&void 0!==t||(this._stopLanguageListener=d(()=>this.requestUpdate())),this._loadedElements||(await u(),await async function(){let t=customElements.get("hui-entities-card");if(!t){if(!Tt)return;(await Tt).createCardElement({type:"entities",entities:[]}),await customElements.whenDefined("hui-entities-card"),t=customElements.get("hui-entities-card")}t&&t.getConfigElement&&await t.getConfigElement()}(),this._loadedElements=!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._stopLanguageListener)||void 0===t||t.call(this),this._stopLanguageListener=void 0}}i([n()],tr.prototype,"_config",void 0),i([n()],tr.prototype,"_selectedTab",void 0),i([n()],tr.prototype,"_suggestion",void 0),i([n()],tr.prototype,"_suggestedNothing",void 0),i([n()],tr.prototype,"_toolError",void 0),i([n()],tr.prototype,"_busy",void 0),i([n()],tr.prototype,"_declutterOriginal",void 0),i([n()],tr.prototype,"_declutterSection",void 0),i([n()],tr.prototype,"_declutterPending",void 0),i([n()],tr.prototype,"_promotePath",void 0),i([n()],tr.prototype,"_promoteName",void 0),i([n()],tr.prototype,"_promoteError",void 0),i([s()],tr.prototype,"lovelace",void 0),i([s()],tr.prototype,"hass",void 0);class er extends a{connectedCallback(){var t;super.connectedCallback(),null!==(t=this._stopLanguageListener)&&void 0!==t||(this._stopLanguageListener=d(()=>this.requestUpdate()))}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._stopLanguageListener)||void 0===t||t.call(this),this._stopLanguageListener=void 0}static get styles(){return o`
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
    `}render(){var i,s,n,a,o,r,l,c,h;const d=this.lovelace,u=mt(d);if(u&&(null===(i=this._borrowed)||void 0===i?void 0:i.ll)!==d){this._borrowed={ll:d};const t=new Set(Object.keys(m(d)));ft(this.hass,d).then(e=>{var i;(null===(i=this._borrowed)||void 0===i?void 0:i.ll)===d&&(this._borrowed={ll:d,names:Object.keys(e).filter(e=>!t.has(e)),templates:e})})}const p=u&&!(null===(s=this._borrowed)||void 0===s?void 0:s.names),f=xe(d,u&&null!==(a=null===(n=this._borrowed)||void 0===n?void 0:n.names)&&void 0!==a?a:[]),g=p?Object.assign(Object.assign({},f),{missingTemplates:[]}):f,_=ke(d),v=Se(d),y=null===(o=this._borrowed)||void 0===o?void 0:o.names,b=this._examplesChecked;p||(null==b?void 0:b.ll)===d&&(null==b?void 0:b.borrowed)===y||(this._examplesChecked={ll:d,borrowed:y,failed:Ae(m(d),null!=y?y:[],this.hass)});const $=p?[]:null!==(l=null===(r=this._examplesChecked)||void 0===r?void 0:r.failed)&&void 0!==l?l:[],w=Uo(d,null!==(h=null===(c=this._borrowed)||void 0===c?void 0:c.templates)&&void 0!==h?h:m(d)),x=!(g.missingTemplates.length||g.unsetVariables.length||g.unusedTemplates.length||_.length||v.length||$.length||w.length);return t`
      <ha-expansion-panel outlined>
        <span slot="header">${e("tools.health_header",void 0,this.hass)}</span>
        <slot></slot>
        ${x?t`<p class="hint">${e("tools.health_ok",void 0,this.hass)}</p>`:t`
                ${$.map(i=>t`<ha-alert alert-type="error">
                      ${e("tools.health_example",{template:i.template,number:i.example,problems:i.problems.join(" ")},this.hass)}
                    </ha-alert>`)}
                ${_.map(i=>t`<ha-alert alert-type="error">
                      ${e("tools.health_extends_loop",{path:i.join(" → ")},this.hass)}
                    </ha-alert>`)}
                ${g.missingTemplates.map(i=>t`<ha-alert alert-type="error">
                      ${e("tools.health_missing",{template:i.template,count:i.count},this.hass)}${i.closest?e("error.did_you_mean",{closest:i.closest},this.hass):""}
                    </ha-alert>`)}
                ${g.unsetVariables.map(i=>t`<ha-alert alert-type="warning">
                      ${e("tools.health_unset",{template:i.template,names:i.names.join(", "),count:i.count},this.hass)}
                    </ha-alert>`)}
                ${v.map(i=>{const s=[...i.views.map(t=>e("tools.health_view_uses",{view:t.title||e("template_editor.untitled_view",void 0,this.hass),count:t.count},this.hass)),...i.templates.map(t=>e("tools.health_template_uses",{name:t},this.hass))].join(", ");return t`<ha-alert alert-type="warning">
                    ${i.message?e("tools.health_deprecated_because",{template:i.template,message:i.message,uses:s},this.hass):e("tools.health_deprecated",{template:i.template,uses:s},this.hass)}
                  </ha-alert>`})}
                ${w.map(i=>t`<ha-alert alert-type="warning">
                      ${e("tools.health_unread",{template:i.template,name:i.name,count:i.count,view:i.view.title||i.view.path||e("template_editor.untitled_view",void 0,this.hass)},this.hass)}${"variables"===i.where?"":e(`tools.health_unread_${i.where}`,void 0,this.hass)}${i.closest?e("error.did_you_mean",{closest:i.closest},this.hass):""}
                    </ha-alert>`)}
                ${g.unusedTemplates.length?t`<ha-alert alert-type="info">
                        ${e("tools.health_unused",{names:g.unusedTemplates.join(", ")},this.hass)}
                      </ha-alert>`:t``}
              `}
        ${this._renderTimings()}
      </ha-expansion-panel>
    `}_renderTimings(){const i=je.entries(),s=t=>t.toFixed(1),n=t`<h4 class="timings-header">${e("tools.timings_header",void 0,this.hass)}</h4>`;if(!i.length)return t`${n}
        <p class="hint">${e("tools.timings_none",void 0,this.hass)}</p>`;const{byTotal:a,byMax:o,repeats:r}=Ce(i);return t`
      ${n}
      <p class="hint">${e("tools.timings_hint",{count:i.length},this.hass)}</p>
      <p class="hint">${e("tools.timings_by_total",void 0,this.hass)}</p>
      <ul class="timings">
        ${a.map(i=>t`<li>
              ${e(1===i.builds?"tools.timings_total_row_one":"tools.timings_total_row",{template:i.template,total:s(i.total),builds:i.builds,max:s(i.max)},this.hass)}
            </li>`)}
      </ul>
      <p class="hint">${e("tools.timings_by_max",void 0,this.hass)}</p>
      <ul class="timings">
        ${o.map(i=>t`<li>
              ${e("tools.timings_max_row",{template:i.template,max:s(i.max)},this.hass)}
            </li>`)}
      </ul>
      ${r.length?t`
              <p class="hint">${e("tools.timings_repeats",void 0,this.hass)}</p>
              <ul class="timings">
                ${r.map(i=>{var s;return t`<li>
                      ${e(i.name?"tools.timings_repeat_named_row":"tools.timings_repeat_row",{template:i.template,name:null!==(s=i.name)&&void 0!==s?s:"",copies:i.copies},this.hass)}
                    </li>`})}
              </ul>
            `:t``}
    `}}i([s({attribute:!1})],er.prototype,"hass",void 0),i([s({attribute:!1})],er.prototype,"lovelace",void 0),i([n()],er.prototype,"_borrowed",void 0),Oe(Ee,Be),Oe(Te,tr),Oe(Pe,er);export{Be as DeclutteringCardEditor,er as DeclutteringHealthPanel,tr as DeclutteringTemplateEditor};
//# sourceMappingURL=decluttering-card-plus.editors-DXk2BGd2.js.map
