import{_ as t,r as e,n as i,i as s,a as n,e as a,d as o,c as r,o as l,l as c,g as h,b as d,t as u,f as p,h as m,j as f,k as g,m as _,p as v,q as y,s as b,u as $,v as w,w as x,x as k,y as S,z as A,A as j,B as O,C,D as E,E as T,F as N,G as P,H as I,I as F,J as L,K as M,L as D,M as R,N as V,O as z,P as q,Q as U,R as K,S as H,T as W,U as J,W as B,X as Y,Y as G,Z,$ as Q,a0 as X,a1 as tt,a2 as et,a3 as it,a4 as st,a5 as nt,a6 as at,a7 as ot,a8 as rt,a9 as lt,aa as ct,ab as ht,ac as dt,ad as ut,ae as pt,af as mt,ag as ft,ah as gt,ai as _t,aj as vt,ak as yt,al as bt,am as $t,an as wt,ao as xt,ap as kt,aq as St,ar as At,as as jt,at as Ot,au as Ct,av as Et,aw as Tt,ax as Nt,ay as Pt,az as It,aA as Ft,aB as Lt,aC as Mt,aD as Dt,aE as Rt,aF as Vt,aG as zt,aH as qt,aI as Ut,aJ as Kt,V as Ht,aK as Wt,aL as Jt,aM as Bt,aN as Yt,aO as Gt,aP as Zt,aQ as Qt,aR as Xt,aS as te,aT as ee,aU as ie,aV as se,aW as ne,aX as ae,aY as oe,aZ as re,a_ as le,a$ as ce,b0 as he,b1 as de,b2 as ue,b3 as pe,b4 as me,b5 as fe,b6 as ge,b7 as _e,b8 as ve,b9 as ye,ba as be,bb as $e,bc as we,bd as xe,be as ke,bf as Se,bg as Ae,bh as je,bi as Oe,bj as Ce,bk as Ee}from"./decluttering-card-plus.core-DuUyKJqO.js";const Te="variable:";let Ne,Pe;function Ie(){return null!=Pe||(Pe=[{name:"fit",label:p("editor.fit_label"),helper:p("editor.fit_helper"),selector:{select:{mode:"dropdown",options:[{value:"box",label:p("editor.fit_box")},{value:"contents",label:p("editor.fit_contents")}]}}}]),Pe}function Fe(t,e){const i=t.indexOf(e);return-1===i?[t,""]:[t.slice(0,i),t.slice(i+e.length)]}const Le=new Set(["true","yes","on","1"]),Me=/:host|\.decluttering-container/;class De extends s{constructor(){super(...arguments),this._shownAs=new Map,this._loadingTemplates=!1,this._ejectPending=!1,this._sectionsPending=!1,this._renderedTemplates={},this._renderingTemplates=new Set}static get styles(){return n`
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
    `}set lovelace(t){this._lovelace=t,this._templates=void 0,this._schema=void 0}_editingPlace(){const t=a(this),e=t?o(t):void 0;return null!=e?e:{view:r(this._lovelace)}}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._stopLanguageListener)||void 0===t||t.call(this),this._stopLanguageListener=void 0}async connectedCallback(){var t;super.connectedCallback(),null!==(t=this._stopLanguageListener)&&void 0!==t||(this._stopLanguageListener=l(()=>this.requestUpdate())),await c()}setConfig(t){var e;null!==(e=this._openedWith)&&void 0!==e||(this._openedWith=t),this._config=t}willUpdate(){var t;if(this.hass&&this._config&&(this._lovelace||(this._lovelace=null!==(t=h())&&void 0!==t?t:void 0),this._lovelace)){if(!this._templates){const t=this._editingPlace();this._templates=d(this._lovelace,t.view,void 0,t.section),this._loadBorrowedTemplates()}this._schema||(this._schema=[{name:"template",label:p("editor.template_label",void 0,this.hass),selector:{select:{mode:"dropdown",custom_value:!0,options:u(this._templates,this.hass)}}},{name:"variables",label:p("editor.variables_label",void 0,this.hass),helper:p("editor.variables_helper",void 0,this.hass),selector:{object:{}}}])}}render(){if(!(this.hass&&this._config&&this._templates&&this._schema))return m``;const t=this._templates[this._config.template],e=f(t),i=g(this._config.variables),s=_(this._config),n=!!t&&"card"===v(t)||!!s||void 0!==this._config.for_each||void 0!==this._config.for_each_from,a={};t||this._loadingTemplates||s&&!this._config.template||(a.template=p("editor.no_such_template",void 0,this.hass)),i||(a.variables=p("error.variables_shape",void 0,this.hass));const o=y(t);return m`
      ${(null==t?void 0:t.description)?m`<p class="description">${t.description}</p>`:m``}
      ${s?m`<ha-alert alert-type="info">
              ${p("editor.by_domain_hint",{templates:Object.entries(s).map(([t,e])=>`${t}: ${e}`).join(", ")},this.hass)}
            </ha-alert>`:m``}
      ${void 0===o?m``:m`<ha-alert alert-type="warning">
              ${o?p("editor.template_deprecated_because",{message:o},this.hass):p("editor.template_deprecated",void 0,this.hass)}
            </ha-alert>`}
      ${this._renderSource(t)} ${this._renderStartFromExample(t)}
      ${this._renderDiagnostics(t,i)} ${this._renderMatches(t)}
      <ha-form
        .hass=${this.hass}
        .data=${this._formData(e)}
        .schema=${this._formSchema(e,n)}
        .error=${a}
        .computeLabel=${t=>{var e;return null!==(e=t.label)&&void 0!==e?e:t.name}}
        .computeHelper=${t=>{var e;return null!==(e=t.helper)&&void 0!==e?e:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._renderCardVariables(e)} ${this._renderResult(t)} ${this._renderSectionPerCopy()}
      <decluttering-card-plus-health .hass=${this.hass} .lovelace=${this._lovelace}></decluttering-card-plus-health>
    `}_renderStartFromExample(t){const e=b(t);return e.length&&this._config&&!$(this._config.variables).length?m`
      <div class="examples">
        <p class="hint">${p("editor.start_from_example_hint",void 0,this.hass)}</p>
        ${e.map((t,e)=>m`
            <ha-button @click=${()=>this._startFromExample(t)}>
              ${p("editor.start_from_example",{number:e+1},this.hass)}
            </ha-button>
          `)}
      </div>
    `:m``}_startFromExample(t){t.length&&w(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{variables:t})})}_renderCardVariables(t){var e;const i=t.filter(t=>x(t));if(!i.length)return m``;const s=k(null===(e=this._config)||void 0===e?void 0:e.variables);return m`${i.map(t=>{var e;const i=s[t.name],n=!!i&&"object"==typeof i;return m`
        <div class="card-variable">
          <h3>${null!==(e=t.label)&&void 0!==e?e:t.name}</h3>
          ${t.description?m`<p class="hint">${t.description}</p>`:m``}
          ${n?m`
                  <hui-card-element-editor
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    .value=${i}
                    @config-changed=${e=>this._cardVariableChanged(t.name,e)}
                  ></hui-card-element-editor>
                  <ha-button @click=${()=>this._cardVariableChanged(t.name)}>
                    ${p("editor.card_variable_clear",void 0,this.hass)}
                  </ha-button>
                `:m`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    @config-changed=${e=>this._cardVariableChanged(t.name,e)}
                  ></hui-card-picker>
                `}
        </div>
      `})}`}_cardVariableChanged(t,e){var i,s;null==e||e.stopPropagation();const n=null===(i=null==e?void 0:e.detail)||void 0===i?void 0:i.config,a=$(null===(s=this._config)||void 0===s?void 0:s.variables).filter(e=>S(e)!==t);n&&"object"==typeof n&&a.push({[t]:n});const o=Object.assign({},this._config);a.length?o.variables=a:delete o.variables,w(this,"config-changed",{config:o})}_renderResult(t){var e;if(!this._config)return m``;const i=A(this._config.for_each);let s=(null==i?void 0:i.length)?j(i[0],this._config.variables,0,i.length):this._config.variables,n=t,a=this._config.template;if(_(this._config))try{const t=null!==(e=this._templates)&&void 0!==e?e:{};let i;({template:n,name:a,entity:i}=O(this._config,s,e=>t[e],this.hass,Object.keys(t))),s=C(s,i)}catch(u){return m``}if(!n)return m``;const o=v(n);if(!o)return m``;const r=E(n);let l;try{const t=T(this.hass,N(this._config.rebuild_on));l=P(I(s,n,r,a,t,!0),this._config,o)}catch(f){return m`<ha-alert alert-type="warning">
        ${p("editor.result_error",{error:String(f)},this.hass)}
      </ha-alert>`}const c=(null==i?void 0:i.length)?p("editor.result_copies",{total:i.length},this.hass):"",[h,d]=Fe(p("editor.result_hint",{kind:o},this.hass),"[[name]]");return m`
      <ha-expansion-panel outlined>
        <span slot="header">${p("editor.result_header",void 0,this.hass)}${c}</span>
        <div class="result">
          <p class="hint">${h}<code>[[name]]</code>${d}</p>
          <ha-yaml-editor .hass=${this.hass} .defaultValue=${l} read-only></ha-yaml-editor>
          ${(null==i?void 0:i.length)||F(this._config.for_each_from)||!l||"object"!=typeof l?m``:m`
                  <ha-button @click=${()=>this._eject(l)}>
                    ${p(this._ejectPending?"editor.eject_confirm":"editor.eject",void 0,this.hass)}
                  </ha-button>
                `}
        </div>
      </ha-expansion-panel>
    `}_renderSectionPerCopy(){var t;const e=null===(t=L())||void 0===t?void 0:t.config;return this._config&&e&&M(e,this._config)?m`
      <div class="section-per-copy">
        <p class="hint">${p("editor.section_per_copy_hint",void 0,this.hass)}</p>
        ${this._sectionsError?m`<ha-alert alert-type="error">${this._sectionsError}</ha-alert>`:m``}
        <ha-button @click=${this._sectionPerCopy}>
          ${p(this._sectionsPending?"editor.section_per_copy_confirm":"editor.section_per_copy",void 0,this.hass)}
        </ha-button>
      </div>
    `:m``}async _sectionPerCopy(){var t,e;if(!this._sectionsPending)return void(this._sectionsPending=!0);this._sectionsPending=!1;const i=L(),s=this._config;if(!i||!s)return;try{await D(this,this.hass,"section_per_copy",[{urlPath:V(),build:t=>R(t,s)}])}catch(a){return void(this._sectionsError=p("tools.save_failed",{message:null!==(t=null==a?void 0:a.message)&&void 0!==t?t:a},this.hass))}let n=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;for(;n&&"hui-dialog-edit-card"!==n.localName;)n=n.parentNode instanceof ShadowRoot?n.parentNode.host:n.parentNode;null===(e=null==n?void 0:n.closeDialog)||void 0===e||e.call(n)}_eject(t){this._ejectPending?(this._ejectPending=!1,this._holdEjectUndo(t),w(this,"config-changed",{config:t})):this._ejectPending=!0}_holdEjectUndo(t){const e=L();if(!e||!this._openedWith)return;const i=z(e.config,this._openedWith,t);i!==e.config&&q({operation:"eject",at:Date.now(),dashboards:[{urlPath:V(),before:e.config,after:i}]})}_renderSource(t){var e;const i=null===(e=this._config)||void 0===e?void 0:e.template;if(!i||!t||this._loadingTemplates)return m``;const s=U(this._lovelace,i);if(!s)return m`<p class="hint">${p("editor.source_borrowed",void 0,this.hass)}</p>`;if(s.declared||!s.view)return m`<p class="hint">${p("editor.source_declared",void 0,this.hass)}</p>`;const{view:n}=s,a=document.location.pathname.split("/").slice(0,2).join("/"),[o,r]=Fe(p("editor.source_view",{view:""},this.hass),"");return m`<p class="hint">
      ${o}<a href=${`${a}/${n.path||n.index}`} target="_blank" rel="noreferrer"
        >${n.title||n.path||p("editor.untitled_view",void 0,this.hass)}</a
      >${r}
    </p>`}_filledSource(t){var e,i;return K(null===(e=this._config)||void 0===e?void 0:e.for_each_from,null===(i=this._config)||void 0===i?void 0:i.variables,t,this.hass)}_renderedTemplateNames(t){const e=this._filledSource(t),i=H(e);if(!this.hass||void 0===i)return[];if(!Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))return[];const s=new Set,n=W(this.hass,e,{rendered:this._renderedTemplates});for(const a of n)for(const t of Object.keys(a))s.add(t);return[...s]}_renderEditorTemplate(t){this.hass&&!this._renderingTemplates.has(t)&&(this._renderingTemplates.add(t),J(this.hass,t).then(e=>{this._renderingTemplates.delete(t),this._renderedTemplates=Object.assign(Object.assign({},this._renderedTemplates),{[t]:e})}))}_renderMatches(t){var e,i;if(!this.hass||!F(null===(e=this._config)||void 0===e?void 0:e.for_each_from))return m``;const s=this._filledSource(t);B(s)&&!Y()&&G(this.hass).then(()=>this.requestUpdate());const n=H(s);if(void 0!==n){const t=Object.prototype.hasOwnProperty.call(this._renderedTemplates,n)?this._renderedTemplates[n]:void 0;if(!t)return this._renderEditorTemplate(n),m`<p class="hint">${p("editor.matches_template_pending",void 0,this.hass)}</p>`;const e=Z(t);if(!("list"in e)){const t="error"===e.problem?"editor.matches_template_failed":"editor.matches_template_not_list";return m`<ha-alert alert-type="warning"> ${p(t,{detail:e.detail},this.hass)} </ha-alert>`}}let a=[];try{a=W(this.hass,s,Object.assign(Object.assign({},Q(this._lovelace)),{rendered:this._renderedTemplates}))}catch(r){return m``}if(!a.length)return m`<ha-alert alert-type="warning">
        ${p("editor.matches_none",{but:(null===(i=this._config)||void 0===i?void 0:i.empty)?p("editor.matches_none_but_empty",void 0,this.hass):""},this.hass)}
      </ha-alert>`;const o=a.slice(0,12);return m`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${1===a.length?p("editor.matches_header_one",void 0,this.hass):p("editor.matches_header_many",{count:a.length},this.hass)}
        </span>
        <div class="matches">
          <ul>
            ${o.map(t=>m`<li>${(t=>{var e,i,s,n,a,o;return String(null!==(a=null!==(n=null!==(s=null!==(i=null!==(e=t.entity)&&void 0!==e?e:t.area_id)&&void 0!==i?i:t.navigation_path)&&void 0!==s?s:t.item)&&void 0!==n?n:t.name)&&void 0!==a?a:`${null!==(o=t.total)&&void 0!==o?o:""}`)})(t)}</li>`)}
          </ul>
          ${a.length>o.length?m`<p class="hint">
                  ${p("editor.matches_more",{count:a.length-o.length},this.hass)}
                </p>`:m``}
          <p class="hint">
            ${p(void 0===n?"editor.matches_hint":"editor.matches_template_hint",void 0,this.hass)}
          </p>
        </div>
      </ha-expansion-panel>
    `}_formSchema(t,e){const i=e?(null!=Ne||(Ne=[{name:"for_each",label:p("editor.for_each_label"),helper:p("editor.for_each_helper"),selector:{object:{}}},{name:"for_each_from",label:p("editor.for_each_from_label"),helper:p("editor.for_each_from_helper"),selector:{object:{}}},{name:"gap",label:p("editor.gap_label"),helper:p("editor.gap_helper"),selector:{number:{min:0,max:64,mode:"box"}}},{name:"empty",label:p("editor.empty_label"),helper:p("editor.empty_helper"),selector:{object:{}}},{name:"columns",label:p("editor.columns_label"),helper:p("editor.columns_helper"),selector:{number:{min:1,max:6,mode:"box"}}},{name:"min_column_width",label:p("editor.min_column_width_label"),helper:p("editor.min_column_width_helper"),selector:{number:{min:50,max:1e3,step:10,mode:"box"}}},{name:"lazy",label:p("editor.lazy_label"),helper:p("editor.lazy_helper"),selector:{boolean:{}}},{name:"lazy_eager",label:p("editor.lazy_eager_label"),helper:p("editor.lazy_eager_helper"),selector:{number:{min:0,max:100,mode:"box"}}}]),Ne):[];if(!t.length)return[...this._schema,...i,...Ie()];const s=t=>{var e;return{name:Te+t.name,label:null!==(e=t.label)&&void 0!==e?e:t.name,helper:t.description,selector:tt(t),required:!0===t.required}},n=[];for(const a of X(t.filter(t=>!x(t))))void 0===a.group?n.push(...a.declarations.map(s)):n.push({name:"",type:"expandable",title:a.group,schema:a.declarations.map(s)});return[this._schema[0],...n,{name:"extras",label:p("editor.extras_label",void 0,this.hass),helper:p("editor.extras_helper",void 0,this.hass),selector:{object:{}}},...i,...Ie()]}_formData(t){var e,i,s,n,a,o,r,l,c,h,d,u;if(!t.length)return this._config;const p=k(null===(e=this._config)||void 0===e?void 0:e.variables),m=new Set(t.map(t=>t.name)),f={template:null===(i=this._config)||void 0===i?void 0:i.template};this._shownAs=new Map;for(const _ of t){if(!(_.name in p))continue;const t=p[_.name];if("boolean"!=typeof t&&"boolean"in tt(_)){const e=Le.has(String(t).trim().toLowerCase());this._shownAs.set(_.name,{shown:e,written:t}),f[Te+_.name]=e}else f[Te+_.name]=t}const g=$(null===(s=this._config)||void 0===s?void 0:s.variables).filter(t=>{const e=S(t);return void 0!==e&&!m.has(e)});return g.length&&(f.extras=g),void 0!==(null===(n=this._config)||void 0===n?void 0:n.for_each)&&(f.for_each=this._config.for_each),void 0!==(null===(a=this._config)||void 0===a?void 0:a.for_each_from)&&(f.for_each_from=this._config.for_each_from),void 0!==(null===(o=this._config)||void 0===o?void 0:o.columns)&&(f.columns=this._config.columns),void 0!==(null===(r=this._config)||void 0===r?void 0:r.min_column_width)&&(f.min_column_width=this._config.min_column_width),void 0!==(null===(l=this._config)||void 0===l?void 0:l.empty)&&(f.empty=this._config.empty),void 0!==(null===(c=this._config)||void 0===c?void 0:c.gap)&&(f.gap=this._config.gap),void 0!==(null===(h=this._config)||void 0===h?void 0:h.fit)&&(f.fit=this._config.fit),void 0!==(null===(d=this._config)||void 0===d?void 0:d.lazy)&&(f.lazy=this._config.lazy),void 0!==(null===(u=this._config)||void 0===u?void 0:u.lazy_eager)&&(f.lazy_eager=this._config.lazy_eager),f}_renderDiagnostics(t,e){var i,s,n,a,o,r,l,c,d,u,f,g,y,b,$,w;if(!t||this._loadingTemplates||!e||_(this._config))return m``;const x=[...it(null===(i=this._config)||void 0===i?void 0:i.for_each),...st(null===(s=this._config)||void 0===s?void 0:s.for_each_from),...F(null===(n=this._config)||void 0===n?void 0:n.for_each_from)?et:[],...this._renderedTemplateNames(t),...N(null===(a=this._config)||void 0===a?void 0:a.rebuild_on),...nt(t,at(null===(o=this._config)||void 0===o?void 0:o.variables)),...Object.keys(ot(null!==(r=this._lovelace)&&void 0!==r?r:h()))].map(t=>({[t]:null})),{missing:k,unused:S,required:A}=rt(null===(l=this._config)||void 0===l?void 0:l.variables,t,x),j=lt(null===(c=this._config)||void 0===c?void 0:c.variables,t,this.hass),O=k.filter(t=>!A.includes(t)),C=Me.test(`${null!==(d=t.style)&&void 0!==d?d:""}\n${null!==(f=null===(u=this._config)||void 0===u?void 0:u.style)&&void 0!==f?f:""}`),E="contents"===(null===(g=this._config)||void 0===g?void 0:g.fit)&&C,T=Number(null===(y=this._config)||void 0===y?void 0:y.columns),P=(void 0!==(null===(b=this._config)||void 0===b?void 0:b.for_each)||void 0!==(null===($=this._config)||void 0===$?void 0:$.for_each_from))&&T>1&&!(Number(null===(w=this._config)||void 0===w?void 0:w.min_column_width)>0),I=v(t),L=ct(this._config,I);return m`
      ${L.map(t=>{var e,i;return m`<ha-alert alert-type="warning">
            ${p("editor.override_misplaced",{key:t,kind:I,template:null!==(i=null===(e=this._config)||void 0===e?void 0:e.template)&&void 0!==i?i:""},this.hass)}
          </ha-alert>`})}
      ${P?m`<ha-alert alert-type="info">
              ${p("editor.columns_without_min_width",{columns:T},this.hass)}
            </ha-alert>`:m``}
      ${E?m`<ha-alert alert-type="warning">${p("editor.fit_hides_style",void 0,this.hass)}</ha-alert>`:m``}
      ${A.length?m`<ha-alert alert-type="error">
              ${p(1===A.length?"editor.required_one":"editor.required_many",{names:A.join(", ")},this.hass)}
            </ha-alert>`:m``}
      ${O.length?m`<ha-alert alert-type="warning">
              ${p(1===O.length?"editor.optional_one":"editor.optional_many",{names:O.join(", ")},this.hass)}
            </ha-alert>`:m``}
      ${j.map(t=>m`<ha-alert alert-type="warning">
            ${p("editor.invalid_value",{name:t.name,expected:t.expected},this.hass)}
          </ha-alert>`)}
      ${S.length?m`<ha-alert alert-type="info">
              ${p(1===S.length?"editor.unused_one":"editor.unused_many",{names:S.join(", ")},this.hass)}
            </ha-alert>`:m``}
    `}_valueChanged(t){var e,i;const s=t.detail.value,n=f(null===(e=this._templates)||void 0===e?void 0:e[s.template]);if(!n.length)return void w(this,"config-changed",{config:s});const a=[];for(const l of n){let t=s[Te+l.name];const e=this._shownAs.get(l.name);e&&t===e.shown&&(t=e.written),void 0!==t&&""!==t&&a.push({[l.name]:t})}Array.isArray(s.extras)&&a.push(...s.extras);const o=Object.assign(Object.assign({},this._config),{template:s.template}),r=ht($(null===(i=this._config)||void 0===i?void 0:i.variables),a);r.length?o.variables=r:delete o.variables,dt(o,"for_each",s.for_each),dt(o,"for_each_from",s.for_each_from),dt(o,"columns",s.columns),dt(o,"min_column_width",s.min_column_width),dt(o,"empty",s.empty),dt(o,"gap",s.gap),dt(o,"lazy",!0===s.lazy||void 0),dt(o,"lazy_eager",s.lazy_eager),w(this,"config-changed",{config:o})}_loadBorrowedTemplates(){if(!ut(this._lovelace))return;this._loadingTemplates=!0;const t=this._editingPlace();pt(this.hass,this._lovelace,t.view,void 0,t.section).then(t=>{this._templates=t,this._schema=void 0}).finally(()=>{this._loadingTemplates=!1,this.requestUpdate()})}}t([e()],De.prototype,"_lovelace",void 0),t([e()],De.prototype,"_config",void 0),t([i()],De.prototype,"hass",void 0),t([e()],De.prototype,"_loadingTemplates",void 0),t([e()],De.prototype,"_ejectPending",void 0),t([e()],De.prototype,"_sectionsPending",void 0),t([e()],De.prototype,"_sectionsError",void 0),t([e()],De.prototype,"_renderedTemplates",void 0);const Re=/^[a-z_]+\.[a-z0-9_]+$/,Ve={base:"entity",label:"Entity",selector:{entity:{}},matches:t=>Re.test(t)};function ze(t,e){return{base:t,label:e,selector:{text:{}},matches:t=>t.trim().length>0}}const qe={entity:Ve,entity_id:Ve,name:ze("name","Name"),title:ze("title","Title"),heading:ze("heading","Heading"),icon:{base:"icon",label:"Icon",selector:{icon:{}},matches:t=>t.includes(":")}};function Ue(t,e){return 1===e?t.label:`${t.label} ${e}`}const Ke=[vt,yt,...bt],He=["card","badge","row","element","group"],We=["type","template","description","variables","default",...He,"style"];function Je(t,e){if(Array.isArray(t))for(const i of t)Je(i,e);else if(t&&"object"==typeof t){e(t);for(const i of Object.values(t))Je(i,e)}}function Be(t){const e=new Set,i=new Set;Je(t,t=>{const s=t.type;if("string"==typeof s){s.startsWith("custom:")&&!Ke.includes(s)&&e.add(s);for(const e of $t(t))i.add(e)}});for(const s of _t(t))i.add(s);return{customTypes:[...e].sort(),templateRefs:[...i].sort()}}function Ye(t,e){const i=t&&"object"==typeof t&&void 0!==t[ft]?Object.assign(Object.assign({},t),{default:gt(t)}):t,s={};for(const l of We)void 0!==(null==i?void 0:i[l])&&(s[l]=i[l]);for(const l of Object.keys(null!=i?i:{}))l in s||l===ft||"source"===l||(s[l]=i[l]);const{customTypes:n,templateRefs:a}=Be(t),o=[];if(e){const t={},i=[...a];for(;i.length;){const s=i.shift();if(s in t)continue;const n=e[s];n?(t[s]=Ge(n),i.push(...Be(n).templateRefs)):o.push(s)}Object.keys(t).length&&(s.includes=t)}else o.push(...a);const r=[];return n.length&&r.push(p("share.requires_custom_cards",{types:n.join(", ")})),o.length&&r.push(p("share.uses_other_templates",{names:o.join(", ")})),{payload:s,notes:r}}function Ge(t){if(!t||"object"!=typeof t||Array.isArray(t))return t;const e=Object.assign({},t);return delete e.source,e}function Ze(t,e){if(!e.includes(t))return t;let i=2;for(;e.includes(`${t}_${i}`);)i+=1;return`${t}_${i}`}function Qe(t){if(!t||"object"!=typeof t||Array.isArray(t))return{ok:!1,errors:[p("share.import_not_a_template")]};const e=[];"string"==typeof t.template&&t.template.trim()||e.push(p("share.import_no_name"));const i=He.filter(e=>void 0!==t[e]);return 0===i.length?e.push(p("share.import_defines_nothing")):i.length>1&&e.push(p("share.import_defines_both",{first:i[0],second:i[1]})),{ok:0===e.length,errors:e}}const Xe=["card","badge","row","element","group"],ti=/^[A-Za-z0-9_-]+$/,ei=/^[a-z_]+\.[a-z0-9_]+$/;function ii(t){return Xe.find(e=>void 0!==(null==t?void 0:t[e])&&null!==(null==t?void 0:t[e]))}function si(t){return t.map(t=>"number"==typeof t?`#${t+1}`:t).join(" › ")}function ni(t){const e=new Set;for(const n of wt(null==t?void 0:t.variables))n&&"string"==typeof n.name&&e.add(n.name);const i=JSON.stringify(null!=t?t:{}),s=/\[\[([A-Za-z0-9_-]+)/g;for(let n=s.exec(i);n;n=s.exec(i))e.add(n[1]);return[...e]}function ai(t){return"boolean"==typeof t?"boolean":"number"==typeof t?"number":"string"==typeof t&&ei.test(t)?"entity":"string"==typeof t&&/^[a-z]+:[a-z0-9-]+$/.test(t)?"icon":"text"}function oi(t,e,i){if(!e.length)return i;const[s,...n]=e;return Array.isArray(t)?t.map((t,e)=>e===s?oi(t,n,i):t):Object.assign(Object.assign({},t),{[s]:oi(null==t?void 0:t[s],n,i)})}const ri=["card","badge","row","element","group","style","let","default","grid_options","name"],li="default:",ci="or:";function hi(t){if(At.includes(t))return!0;const e=t.indexOf(":");return e>0&&jt.includes(t.slice(0,e))}function di(t){const e=t.indexOf(":");if(e>0){const i=kt(t.slice(0,e),jt);return i?`${i}:${t.slice(e+1)}`:void 0}return kt(t,At)}function ui(t){return t.startsWith(ci)?t.slice(3):Ot(t)}function pi(t,e,i){if(!t.includes("[[")&&!t.includes("]]"))return;const s=function(t){let e=0,i=!1;for(let s=0;s<t.length-1;s+=1){const n=t.slice(s,s+2);"[["===n?(e+=1,s+=1):"]]"===n&&(0===e?i=!0:e-=1,s+=1)}return{unclosed:e>0,stray:i}}(t);s.unclosed&&i.findings.push({level:"warning",key:"lint.unclosed",params:{},path:e}),s.stray&&i.findings.push({level:"warning",key:"lint.stray_close",params:{},path:e});let n=t;for(let a=0;a<5;a+=1){let t=!1;if(n=n.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(s,n)=>(t=!0,n.startsWith(St)||mi(n,e,i),"_")),!t)break}}function mi(t,e,i){const s=t.endsWith("?")?t.slice(0,-1):t,[n,...a]=s.split("|"),o=`[[${t}]]`,r=(n.endsWith("?")?n.slice(0,-1):n).split(".")[0];r&&"_"!==r&&!i.heads.has(r)&&i.heads.set(r,e);let l=!1;for(const c of a){if(!hi(c)){const t=di(c);i.findings.push({level:"warning",key:"lint.unknown_step",params:t?{step:c,placeholder:o,closest:t}:{step:c,placeholder:o},path:e});continue}(c.startsWith(li)||c.startsWith(ci))&&l&&i.findings.push({level:"warning",key:"lint.after_default",params:{step:c,placeholder:o},path:e}),c.startsWith(li)&&c.length>8&&(l=!0);const t=ui(c);t&&"_"!==t&&i.targets.push({name:t,placeholder:o,path:e})}}function fi(t,e,i){if("string"!=typeof t){if(Array.isArray(t))t.forEach((t,s)=>fi(t,`${e}[${s}]`,i));else if(t&&"object"==typeof t)for(const[s,n]of Object.entries(t))pi(s,e,i),fi(n,e?`${e}.${s}`:s,i)}else pi(t,e,i)}function gi(t){const e=new Set;for(const i of f(t))e.add(i.name);for(const i of[...at(gt(t)),...at(null==t?void 0:t.let)]){const t=S(i);void 0!==t&&e.add(t)}return[...e]}const _i={card:{type:"entity",entity:"sun.sun"},badge:{type:"entity",entity:"sun.sun"},row:{entity:"sun.sun"},element:{type:"icon",icon:"mdi:weather-sunny",style:{color:"yellow"}}},vi=50,yi=t=>!!customElements.get(t),bi=t=>t.actions.length>0||t.urls.length>0||t.embeds||t.scripts||t.placeholders||t.overlay;const $i=500;function wi(t){const e=e=>{var i;return t.onInput(null!==(i=e.target.value)&&void 0!==i?i:"")},i=e=>{var i;return null===(i=t.onKeydown)||void 0===i?void 0:i.call(t,e)};return yi("ha-input")?m`<ha-input
        label=${t.label}
        .value=${t.value}
        .disabled=${!0===t.disabled}
        @input=${e}
        @keydown=${i}
      ></ha-input>`:m`<ha-textfield
        label=${t.label}
        .value=${t.value}
        .disabled=${!0===t.disabled}
        @input=${e}
        @keydown=${i}
      ></ha-textfield>`}async function xi(t,e,i,s){var n;if(!L())return t._toolError=p("tools.cannot_save_here",void 0,t.hass),!1;t._busy=!0,t._toolError=void 0;try{return await D(t,t.hass,i,[{urlPath:V(),build:e}],s),t._undoChanged=void 0,!0}catch(a){return t._toolError=p("tools.save_failed",{message:null!==(n=null==a?void 0:a.message)&&void 0!==n?n:a},t.hass),!1}finally{t._busy=!1}}const ki=n`
  ${Et.styles}
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
 */;let Si=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ai={},ji=(Oi=class extends Si{constructor(){super(...arguments),this.key=Tt}render(t,e){return this.key=t,e}update(t,[e,i]){return e!==this.key&&(((t,e=Ai)=>{t._$AH=e;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */})(t),this.key=e),i}},(...t)=>({_$litDirective$:Oi,values:t}));var Oi;const Ci=[{name:"room_light_tile",summary:"A tile per light, with the light named after itself.",template:{description:"A tile for one light, taking its name from Home Assistant.",variables:[{name:"entity",label:"Light",selector:{entity:{domain:"light"}},required:!0},{name:"name",label:"Name",description:"Leave empty to use the light’s own name",selector:{text:{}}}],card:{type:"tile",entity:"[[entity]]",name:"[[name|or:entity|friendly_name]]",features:[{type:"light-brightness"}]}}},{name:"room_summary",summary:"A heading per area, listing the lights in it. Uses grouping.",template:{description:"One card per area, with a tile for every light in that area.",card:{type:"vertical-stack",cards:[{type:"markdown",content:"## [[area]]\n\n[[entity_count]] lights"},{type:"custom:decluttering-card-plus",template:"room_light_tile",for_each:"[[items]]"}]}}},{name:"sensor_line",summary:"An Entities row showing one sensor with its area.",template:{description:"A row for one sensor, labelled with the area it is in.",variables:[{name:"entity",label:"Sensor",selector:{entity:{}},required:!0}],row:{entity:"[[entity]]",name:"[[entity|friendly_name]] ([[entity|area|default:no area]])"}}},{name:"status_badge",summary:"A badge that only appears when something needs attention.",template:{description:"A badge for one entity, hidden unless it is in the state you care about.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0},{name:"when",label:"Show when the state is",selector:{text:{}},default:"on"}],badge:{type:"entity",entity:"[[entity]]",visibility:[{condition:"state",entity:"[[entity]]",state:"[[when]]"}]}}},{name:"counted_grid",summary:'A numbered grid of anything, showing "3 of 12".',template:{description:"A tile that knows where it sits in a repeat.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0}],card:{type:"tile",entity:"[[entity]]",name:"[[entity|friendly_name]]",footer:{type:"markdown",content:"[[index]] of [[total|or:count]]"}}}}];function Ei(t){return Ci.find(e=>e.name===t)}function Ti(t,e){const i=new Set,s=t=>{Array.isArray(t)?t.forEach(s):t&&"object"==typeof t&&("string"==typeof t.type&&t.type.includes("decluttering-card")&&"string"==typeof t.template&&i.add(t.template),Object.values(t).forEach(s))};return s(t.template),[...i].filter(t=>!e.includes(t))}function Ni(t,e){return{library:t,version:e}}
/*! js-yaml 5.4.3 https://github.com/nodeca/js-yaml @license MIT */var Pi=Symbol("NOT_RESOLVED");function Ii(t,e){return{tagName:t,nodeKind:"scalar",implicit:e.implicit??!1,matchByTagPrefix:e.matchByTagPrefix??!1,implicitFirstChars:e.implicitFirstChars??null,resolve:e.resolve,identify:e.identify,represent:e.represent??(t=>String(t)),representTagName:e.representTagName??(()=>t)}}function Fi(t,e){const i=void 0===e.finalize;return{tagName:t,nodeKind:"sequence",implicit:!1,matchByTagPrefix:e.matchByTagPrefix??!1,create:e.create,addItem:e.addItem,finalize:e.finalize??(t=>t),carrierIsResult:i,identify:e.identify,represent:e.represent??(t=>t),representTagName:e.representTagName??(()=>t)}}function Li(t,e){const i=void 0===e.finalize;return{tagName:t,nodeKind:"mapping",implicit:!1,matchByTagPrefix:e.matchByTagPrefix??!1,create:e.create,addPair:e.addPair,has:e.has,keys:e.keys,get:e.get,finalize:e.finalize??(t=>t),carrierIsResult:i,identify:e.identify,represent:e.represent??(t=>t),representTagName:e.representTagName??(()=>t)}}var Mi=Ii("tag:yaml.org,2002:str",{resolve:t=>t,identify:t=>"string"==typeof t}),Di=["","~","null","Null","NULL"],Ri=Ii("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:t=>-1!==Di.indexOf(t)?null:Pi,identify:t=>null===t,represent:()=>"null"}),Vi=Ii("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(t,e)=>"null"===t||e&&""===t?null:Pi,identify:t=>null===t,represent:()=>"null"}),zi=["","~","null","Null","NULL"],qi=Ii("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:t=>-1!==zi.indexOf(t)?null:Pi,identify:t=>null===t,represent:()=>"null"}),Ui=["true","True","TRUE"],Ki=["false","False","FALSE"],Hi=Ii("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:t=>-1!==Ui.indexOf(t)||-1===Ki.indexOf(t)&&Pi,identify:t=>"[object Boolean]"===Object.prototype.toString.call(t),represent:t=>t?"true":"false"}),Wi=["true"],Ji=["false"],Bi=Ii("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:t=>-1!==Wi.indexOf(t)||-1===Ji.indexOf(t)&&Pi,identify:t=>"[object Boolean]"===Object.prototype.toString.call(t),represent:t=>t?"true":"false"}),Yi=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],Gi=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],Zi=Ii("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:t=>-1!==Yi.indexOf(t)||-1===Gi.indexOf(t)&&Pi,identify:t=>"[object Boolean]"===Object.prototype.toString.call(t),represent:t=>t?"true":"false"}),Qi=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),Xi=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var ts=Ii("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(t,e){if(e){if(!Xi.test(t))return Pi}else if(!Qi.test(t))return Pi;const i=function(t){let e=t,i=1;return"-"!==e[0]&&"+"!==e[0]||("-"===e[0]&&(i=-1),e=e.slice(1)),e.startsWith("0b")?i*parseInt(e.slice(2),2):e.startsWith("0o")?i*parseInt(e.slice(2),8):e.startsWith("0x")?i*parseInt(e.slice(2),16):i*parseInt(e,10)}(t);return Number.isFinite(i)?i:Pi},identify:t=>Number.isInteger(t)&&!Object.is(t,-0)&&t.toString(10).indexOf("e")<0,represent:t=>t.toString(10)}),es=new RegExp("^-?(?:0|[1-9][0-9]*)$"),is=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var ss=Ii("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(t,e){if(e){if(!is.test(t))return Pi}else if(!es.test(t))return Pi;const i=function(t){let e=t,i=1;return"-"!==e[0]&&"+"!==e[0]||("-"===e[0]&&(i=-1),e=e.slice(1)),e.startsWith("0b")?i*parseInt(e.slice(2),2):e.startsWith("0o")?i*parseInt(e.slice(2),8):e.startsWith("0x")?i*parseInt(e.slice(2),16):i*parseInt(e,10)}(t);return Number.isFinite(i)?i:Pi},identify:t=>Number.isInteger(t)&&!Object.is(t,-0)&&t.toString(10).indexOf("e")<0,represent:t=>t.toString(10)}),ns=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$");var as=Ii("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(t){if(!ns.test(t))return Pi;const e=function(t){let e=t.replace(/_/g,""),i=1;if("-"!==e[0]&&"+"!==e[0]||("-"===e[0]&&(i=-1),e=e.slice(1)),e.startsWith("0b"))return i*parseInt(e.slice(2),2);if(e.startsWith("0x"))return i*parseInt(e.slice(2),16);if(e.includes(":")){let t=0;for(const i of e.split(":"))t=60*t+Number(i);return i*t}return"0"!==e&&"0"===e[0]?i*parseInt(e,8):i*parseInt(e,10)}(t);return Number.isFinite(e)?e:Pi},identify:t=>Number.isInteger(t)&&!Object.is(t,-0)&&t.toString(10).indexOf("e")<0,represent:t=>t.toString(10)}),os=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),rs=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var ls=Ii("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(t){if(!os.test(t))return Pi;let e=t.toLowerCase();const i="-"===e[0]?-1:1;if("+-".includes(e[0])&&(e=e.slice(1)),".inf"===e)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===e)return NaN;const s=i*parseFloat(e);return Number.isFinite(s)||rs.test(t)?s:Pi},identify:t=>"number"==typeof t&&(!Number.isInteger(t)||Object.is(t,-0)||t.toString(10).indexOf("e")>=0),represent:function(t){if(isNaN(t))return".nan";if(t===Number.POSITIVE_INFINITY)return".inf";if(t===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(t,-0))return"-0.0";const e=t.toString(10);return/^[-+]?[0-9]+e/.test(e)?e.replace("e",".e"):e}}),cs=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),hs=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var ds=Ii("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(t,e){if(e){if(!hs.test(t))return Pi;let e=t.toLowerCase();const i="-"===e[0]?-1:1;if("+-".includes(e[0])&&(e=e.slice(1)),".inf"===e)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===e)return NaN;const s=i*parseFloat(e);return Number.isFinite(s)?s:Pi}if(!cs.test(t))return Pi;const i=Number(t);return Number.isFinite(i)?i:Pi},identify:t=>"number"==typeof t&&(!Number.isInteger(t)||Object.is(t,-0)||t.toString(10).indexOf("e")>=0),represent:function(t){if(isNaN(t))return".nan";if(t===Number.POSITIVE_INFINITY)return".inf";if(t===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(t,-0))return"-0.0";const e=t.toString(10);return/^[-+]?[0-9]+e/.test(e)?e.replace("e",".e"):e}}),us=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ps=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var ms=Ii("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(t){if(!us.test(t))return Pi;let e=t.toLowerCase().replace(/_/g,"");const i="-"===e[0]?-1:1;if("+-".includes(e[0])&&(e=e.slice(1)),".inf"===e)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===e)return NaN;let s=0;if(e.includes(":")){for(const t of e.split(":"))s=60*s+Number(t);s*=i}else s=i*parseFloat(e);return Number.isFinite(s)||ps.test(t)?s:Pi},identify:t=>"number"==typeof t&&(!Number.isInteger(t)||Object.is(t,-0)||t.toString(10).indexOf("e")>=0),represent:function(t){if(isNaN(t))return".nan";if(t===Number.POSITIVE_INFINITY)return".inf";if(t===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(t,-0))return"-0.0";const e=t.toString(10);return/^[-+]?[0-9]+e/.test(e)?e.replace("e",".e"):e}}),fs=Ii("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(t,e)=>"<<"===t||e&&""===t?"<<":Pi,identify:()=>!1}),gs=/^[A-Za-z0-9+/]*={0,2}$/;var _s=Ii("tag:yaml.org,2002:binary",{resolve:function(t){const e=t.replace(/\s/g,"");if(e.length%4!=0||!gs.test(e))return Pi;const i=atob(e),s=new Uint8Array(i.length);for(let n=0;n<i.length;n++)s[n]=i.charCodeAt(n);return s},identify:t=>"[object Uint8Array]"===Object.prototype.toString.call(t),represent:function(t){let e="";for(let i=0;i<t.length;i++)e+=String.fromCharCode(t[i]);return btoa(e)}}),vs=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),ys=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function bs(t,e,i,s=0,n=0,a=0,o=0){const r=new Date(Date.UTC(t,e,i,s,n,a,o));return r.setUTCFullYear(t,e,i),r}var $s=Ii("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(t){let e=vs.exec(t);if(null===e&&(e=ys.exec(t)),null===e)return Pi;const i=+e[1],s=+e[2]-1,n=+e[3];if(!e[4]){const t=bs(i,s,n);return t.getUTCFullYear()!==i||t.getUTCMonth()!==s||t.getUTCDate()!==n?Pi:t}const a=+e[4],o=+e[5],r=+e[6];let l=0;if(a>23||o>59||r>59)return Pi;if(e[7]){let t=e[7].slice(0,3);for(;t.length<3;)t+="0";l=+t}const c=bs(i,s,n,a,o,r,l);if(c.getUTCFullYear()!==i||c.getUTCMonth()!==s||c.getUTCDate()!==n)return Pi;if(e[9]){const t=+e[10],i=+(e[11]||0);if(t>23||i>59)return Pi;const s=6e4*(60*t+i);c.setTime(c.getTime()-("-"===e[9]?-s:s))}return c},identify:t=>t instanceof Date,represent:t=>t.toISOString()}),ws=Fi("tag:yaml.org,2002:seq",{create:()=>[],addItem:(t,e)=>{t.push(e)},identify:Array.isArray});function xs(t){if(null===t||"object"!=typeof t||Array.isArray(t))return!1;const e=Object.getPrototypeOf(t);return null===e||e===Object.prototype}function ks(t,e){const i={};for(const s of e)void 0!==t[s]&&(i[s]=t[s]);return i}var Ss=Fi("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(t,e)=>{let i;if(e instanceof Map){if(1!==e.size)return"cannot resolve an ordered map item";i=e.keys().next().value}else{if(!xs(e))return"cannot resolve an ordered map item";{const t=Object.keys(e);if(1!==t.length)return"cannot resolve an ordered map item";i=t[0]}}return t.seen.has(i)?"duplicate key in ordered map":(t.seen.add(i),t.list.push(e),"")},finalize:t=>t.list,identify:()=>!1}),As=Fi("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(t,e)=>{if(e instanceof Map)return 1!==e.size?"cannot resolve a pairs item":(t.push(e.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(e))return"cannot resolve a pairs item";const i=e,s=Object.keys(i);return 1!==s.length?"cannot resolve a pairs item":(t.push([s[0],i[s[0]]]),"")},identify:()=>!1}),js=Li("tag:yaml.org,2002:map",{create:()=>({}),identify:xs,represent:t=>{const e=new Map;for(const i of Object.keys(t))e.set(i,t[i]);return e},addPair:(t,e,i)=>{if(null!==e&&"object"==typeof e)return"object-based map does not support complex keys";const s=String(e);return"__proto__"===s?Object.defineProperty(t,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[s]=i,""},has:(t,e)=>(null===e||"object"!=typeof e)&&Object.prototype.hasOwnProperty.call(t,String(e)),keys:t=>Object.keys(t),get:(t,e)=>{const i=String(e);return Object.prototype.hasOwnProperty.call(t,i)?t[i]:null}}),Os=Li("tag:yaml.org,2002:set",{create:()=>new Set,identify:t=>t instanceof Set,represent:t=>{const e=new Map;for(const i of t)e.set(i,null);return e},addPair:(t,e,i)=>null!==i?"cannot resolve a set item":(t.add(e),""),has:(t,e)=>t.has(e),keys:t=>t.keys(),get:()=>null});var Cs=class t{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(t){const e=function(t){const e=[];for(const i of t){let t=e.length;for(let s=0;s<e.length;s++){const n=e[s];if(n.nodeKind===i.nodeKind&&n.tagName===i.tagName&&n.matchByTagPrefix===i.matchByTagPrefix){t=s;break}}e[t]=i}return e}(t),i=[],s={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},n={scalar:[],sequence:[],mapping:[]};for(const c of e){if("scalar"===c.nodeKind&&c.implicit){if(c.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(c)}switch(c.nodeKind){case"scalar":c.matchByTagPrefix?n.scalar.push(c):s.scalar[c.tagName]=c;break;case"sequence":c.matchByTagPrefix?n.sequence.push(c):s.sequence[c.tagName]=c;break;case"mapping":c.matchByTagPrefix?n.mapping.push(c):s.mapping[c.tagName]=c}}const a=i.filter(t=>null===t.implicitFirstChars),o=new Set;for(const c of i)if(null!==c.implicitFirstChars)for(const t of c.implicitFirstChars)o.add(t);const r=new Map;for(const c of o)r.set(c,i.filter(t=>null===t.implicitFirstChars||-1!==t.implicitFirstChars.indexOf(c)));const l=s.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=e,this.implicitScalarTags=i,this.implicitScalarByFirstChar=r,this.implicitScalarAnyFirstChar=a,this.defaultScalarTag=l,this.defaultSequenceTag=s.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=s.mapping["tag:yaml.org,2002:map"],this.exact=s,this.prefix=n}lookupScalarTag(t){const e=this.exact.scalar[t];if(e)return e;for(const i of this.prefix.scalar)if(t.startsWith(i.tagName))return i}lookupSequenceTag(t){const e=this.exact.sequence[t];if(e)return e;for(const i of this.prefix.sequence)if(t.startsWith(i.tagName))return i}lookupMappingTag(t){const e=this.exact.mapping[t];if(e)return e;for(const i of this.prefix.mapping)if(t.startsWith(i.tagName))return i}resolveImplicitScalarTag(t){const e=this.implicitScalarByFirstChar.get(t.charAt(0))??this.implicitScalarAnyFirstChar;for(const s of e){const e=s.resolve(t,!1,s.tagName);if(e!==Pi)return{value:e,tag:s}}const i=this.defaultScalarTag;return{value:i.resolve(t,!1,i.tagName),tag:i}}withTags(...e){let i=[];for(const t of e)i=i.concat(t);return new t([...this.tags,...i])}},Es=new Cs([Mi,ws,js]);new Cs([...Es.tags,Vi,Bi,ss,ds]);var Ts=new Cs([...Es.tags,Ri,Hi,ts,ls]);function Ns(t){if(Array.isArray(t)){const e=Array.prototype.slice.call(t);for(let t=0;t<e.length;t++){if(Array.isArray(e[t]))return null;"object"==typeof e[t]&&"[object Object]"===Object.prototype.toString.call(e[t])&&(e[t]="[object Object]")}return String(e)}return"object"==typeof t&&"[object Object]"===Object.prototype.toString.call(t)?"[object Object]":String(t)}new Cs([...Es.tags,qi,Zi,as,ms,$s,fs,_s,Ss,As,Os]).withTags({...as,resolve:(t,e,i)=>{const s=as.resolve(t,e,i);return s===Pi?ts.resolve(t,e,i):s}},{...ms,resolve:(t,e,i)=>{const s=ms.resolve(t,e,i);return s===Pi?ls.resolve(t,e,i):s}}),Li("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(t,e,i)=>(t.set(e,i),""),has:(t,e)=>t.has(e),keys:t=>t.keys(),get:(t,e)=>t.get(e),identify:t=>t instanceof Map||xs(t),represent:t=>{if(t instanceof Map)return t;const e=new Map,i=t;for(const s of Object.keys(i))e.set(s,i[s]);return e}}),Li("tag:yaml.org,2002:map",{create:()=>({}),identify:xs,represent:t=>{const e=new Map;for(const i of Object.keys(t))e.set(i,t[i]);return e},addPair:(t,e,i)=>{const s=Ns(e);return null===s?"nested arrays are not supported inside keys":("__proto__"===s?Object.defineProperty(t,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[s]=i,"")},has:(t,e)=>{const i=Ns(e);return null!==i&&Object.prototype.hasOwnProperty.call(t,i)},keys:t=>Object.keys(t),get:(t,e)=>{const i=String(e);return Object.prototype.hasOwnProperty.call(t,i)?t[i]:null}});var Ps={maxLength:79,indent:1,linesBefore:3,linesAfter:2};function Is(t,e,i,s,n){let a="",o="";const r=Math.floor(n/2)-1;return s-e>r&&(a=" ... ",e=s-r+a.length),i-s>r&&(o=" ...",i=s+r-o.length),{str:a+t.slice(e,i).replace(/\t/g,"→")+o,pos:s-e+a.length}}function Fs(t,e){return" ".repeat(Math.max(e-t.length,0))+t}function Ls(t,e){let i="";return t.mark?(t.mark.name&&(i+=`in "${t.mark.name}" `),i+=`(${t.mark.line+1}:${t.mark.column+1})`,!e&&t.mark.snippet&&(i+=`\n\n${t.mark.snippet}`),`${t.reason} ${i}`):t.reason}var Ms=class t extends Error{reason;mark;constructor(t,e){super(),this.name="YAMLException",this.reason=t,this.mark=e,this.message=Ls(this,!1),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}toString(t){return`${this.name}: ${Ls(this,t)}`}static throwAt(e,i,s,n=""){let a=0,o=0;for(let t=0;t<i;t++){const i=e.charCodeAt(t);10===i?(a++,o=t+1):13===i&&(a++,10===e.charCodeAt(t+1)&&t++,o=t+1)}const r={name:n,buffer:e,position:i,line:a,column:i-o};throw r.snippet=function(t,e){if(!t.buffer)return null;const i={...Ps,...e},s=/\r?\n|\r|\0/g,n=[0],a=[];let o,r=-1;for(;o=s.exec(t.buffer);)a.push(o.index),n.push(o.index+o[0].length),t.position<=o.index&&r<0&&(r=n.length-2);r<0&&(r=n.length-1);let l="";const c=Math.min(t.line+i.linesAfter,a.length).toString().length,h=i.maxLength-(i.indent+c+3);for(let u=1;u<=i.linesBefore&&!(r-u<0);u++){const e=Is(t.buffer,n[r-u],a[r-u],t.position-(n[r]-n[r-u]),h);l=`${" ".repeat(i.indent)}${Fs((t.line-u+1).toString(),c)} | ${e.str}\n${l}`}const d=Is(t.buffer,n[r],a[r],t.position,h);l+=`${" ".repeat(i.indent)}${Fs((t.line+1).toString(),c)} | ${d.str}\n`,l+=`${"-".repeat(i.indent+c+3+d.pos)}^\n`;for(let u=1;u<=i.linesAfter&&!(r+u>=a.length);u++){const e=Is(t.buffer,n[r+u],a[r+u],t.position-(n[r]-n[r+u]),h);l+=`${" ".repeat(i.indent)}${Fs((t.line+u+1).toString(),c)} | ${e.str}\n`}return l.replace(/\n$/,"")}(r),new t(s,r)}},Ds=1,Rs=2,Vs=3,zs=4,qs=5,Us=6,Ks=1,Hs=2,Ws=3,Js=4,Bs=5,Ys=1,Gs=2,Zs=1,Qs=2,Xs=3;function tn(t){switch(t){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}var en=new Array(256),sn=new Array(256);for(let Bo=0;Bo<256;Bo++)en[Bo]=tn(Bo)?1:0,sn[Bo]=tn(Bo);function nn(t){return t<=65535?String.fromCharCode(t):String.fromCharCode(55296+(t-65536>>10),56320+(t-65536&1023))}function an(t){return t>=48&&t<=57?t-48:(32|t)-97+10}function on(t){return 120===t?2:117===t?4:8}function rn(t,e,i){let s=0;for(;e<i;){const i=t.charCodeAt(e);if(10===i)s++,e++;else if(13===i)s++,e++,10===t.charCodeAt(e)&&e++;else{if(32!==i&&9!==i)break;e++}}return{position:e,breaks:s}}function ln(t){return 1===t?" ":"\n".repeat(t-1)}function cn(t,e,i,s,n,a){const o=s<0?0:s,r=t.slice(e,i).replace(/\r\n?/g,"\n"),l=""===r?[]:(r.endsWith("\n")?r.slice(0,-1):r).split("\n");let c="",h=!1,d=0,u=!1;for(const p of l){let t=0;for(;t<o&&32===p.charCodeAt(t);)t++;if(s<0||t>=p.length){d++;continue}const e=p.slice(o),i=e.charCodeAt(0);a?32===i||9===i?(u=!0,c+="\n".repeat(h?1+d:d)):u?(u=!1,c+="\n".repeat(d+1)):0===d?h&&(c+=" "):c+="\n".repeat(d):c+="\n".repeat(h?1+d:d),c+=e,h=!0,d=0}return n===Xs?c+="\n".repeat(h?1+d:d):n!==Qs&&h&&(c+="\n"),c}function hn(t,e){if(-1===e.valueStart)return"";const{valueStart:i,valueEnd:s}=e;if(e.fast)return t.slice(i,s);switch(e.style){case Hs:return function(t,e,i){let s="",n=e,a=e,o=e;for(;n<i;){const e=t.charCodeAt(n);if(39===e)s+=t.slice(a,n)+"'",n+=2,a=o=n;else if(10===e||13===e){s+=t.slice(a,o);const e=rn(t,n,i);s+=ln(e.breaks),n=a=o=e.position}else n++,32!==e&&9!==e&&(o=n)}return s+t.slice(a,i)}(t,i,s);case Ws:return function(t,e,i){let s="",n=e,a=e,o=e;for(;n<i;){const e=t.charCodeAt(n);if(92===e){s+=t.slice(a,n),n++;const e=t.charCodeAt(n);if(10===e||13===e)n=rn(t,n,i).position;else if(e<256&&en[e])s+=sn[e],n++;else{let i=on(e),a=0;for(;i>0;i--)n++,a=(a<<4)+an(t.charCodeAt(n));s+=nn(a),n++}a=o=n}else if(10===e||13===e){s+=t.slice(a,o);const e=rn(t,n,i);s+=ln(e.breaks),n=a=o=e.position}else n++,32!==e&&9!==e&&(o=n)}return s+t.slice(a,i)}(t,i,s);case Js:return cn(t,i,s,e.indent,e.chomping,!1);case Bs:return cn(t,i,s,e.indent,e.chomping,!0);default:return function(t,e,i){let s="",n=e,a=e,o=e;for(;n<i;){const e=t.charCodeAt(n);if(10===e||13===e){s+=t.slice(a,o);const e=rn(t,n,i);s+=ln(e.breaks),n=a=o=e.position}else n++,32!==e&&9!==e&&(o=n)}return s+t.slice(a,o)}(t,i,s)}}var dn=Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"});function un(t,e){if(t.startsWith("!<")&&t.endsWith(">"))return decodeURIComponent(t.slice(2,-1));const i=t.indexOf("!",1),s=-1===i?"!":t.slice(0,i+1),n=e?.[s]??dn[s]??s;return decodeURIComponent(n)+decodeURIComponent(t.slice(s.length))}var pn=-1,mn={filename:"",schema:Ts,json:!1,maxTotalMergeKeys:1e4,maxAliases:-1};function fn(t){return"tagStart"in t&&t.tagStart!==pn?t.tagStart:"anchorStart"in t&&t.anchorStart!==pn?t.anchorStart:"valueStart"in t&&t.valueStart!==pn?t.valueStart:"start"in t?t.start:0}function gn(t,e){Ms.throwAt(t.source,t.position,e,t.filename)}function _n(t,e,i,s){try{return i.finalize(s)}catch(n){if(n instanceof Ms)throw n;Ms.throwAt(t.source,e,n instanceof Error?n.message:String(n),t.filename)}}function vn(t,e){const i=hn(t.source,e),s=e.tagStart===pn?"":t.source.slice(e.tagStart,e.tagEnd),n=t.schema.defaultScalarTag;if(""!==s){if("!"===s)return{value:i,tag:n};const e=un(s,t.tagHandlers),a=t.schema.lookupScalarTag(e);if(a){const s=a.resolve(i,!0,e);return s===Pi&&gn(t,`cannot resolve a node with !<${e}> explicit tag`),{value:s,tag:a}}const o=t.schema.lookupMappingTag(e)??t.schema.lookupSequenceTag(e);if(o){""!==i&&gn(t,`cannot resolve a node with !<${e}> explicit tag`);const s=o.create(e);return{value:o.carrierIsResult?s:_n(t,t.position,o,s),tag:o}}gn(t,`unknown scalar tag !<${e}>`)}return e.style===Ks?t.schema.resolveImplicitScalarTag(i):{value:n.resolve(i,!1,n.tagName),tag:n}}function yn(t,e,i){const s=e.tagStart===pn?"":t.source.slice(e.tagStart,e.tagEnd);return""===s||"!"===s?i:un(s,t.tagHandlers)}function bn(t){return"mapping"===t.nodeKind}function $n(t){t.totalMergeKeys++,-1!==t.maxTotalMergeKeys&&t.totalMergeKeys>t.maxTotalMergeKeys&&gn(t,`merge keys exceeded maxTotalMergeKeys (${t.maxTotalMergeKeys})`)}function wn(t,e,i,s){$n(t);for(const n of s.keys(i)){if($n(t),e.tag.has(e.value,n))continue;const a=e.tag.addPair(e.value,n,s.get(i,n));a&&gn(t,a),e.overridable??=new Set,e.overridable.add(n)}}function xn(t,e,i,s,n){if(t.position=e.keyPosition,e.keyIsMerge)return void function(t,e,i,s){if(t.position=e.keyPosition,bn(s))wn(t,e,i,s);else if("sequence"===s.nodeKind&&Array.isArray(i)){i.length>100&&gn(t,"abnormal merge sequence size");for(const s of i){const i=t.nodeTags.get(s);i||gn(t,"cannot merge mappings; the provided source object is unacceptable"),wn(t,e,s,i)}}else gn(t,"cannot merge mappings; the provided source object is unacceptable")}(t,e,s,n);t.json||!e.tag.has(e.value,i)||e.overridable?.has(i)||gn(t,"duplicated mapping key");const a=e.tag.addPair(e.value,i,s);a&&gn(t,a),e.overridable?.delete(i)}function kn(t,e,i){const s=t.frames[t.frames.length-1];if("document"===s.kind)s.value=e,s.hasValue=!0;else if("sequence"===s.kind){bn(i)&&t.nodeTags.set(e,i);const n=s.tag.addItem(s.value,e,s.index++);n&&gn(t,n)}else if(s.hasKey){const n=s.key;s.key=void 0,s.hasKey=!1,xn(t,s,n,e,i)}else s.key=e,s.keyPosition=t.position,s.hasKey=!0,s.keyIsMerge="tag:yaml.org,2002:merge"===i.tagName}function Sn(t,e,i,s,n){if(e.anchorStart!==pn){const a={value:i,tag:s,isValueFinal:n};return t.anchors.set(t.source.slice(e.anchorStart,e.anchorEnd),a),a}return null}var An=-1,jn=Object.prototype.hasOwnProperty,On=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Cn=/[,\[\]{}]/,En=/^(?:!|!!|![0-9A-Za-z-]+!)$/,Tn=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,Nn=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`,Pn=new RegExp(`^(?:${Tn})*$`),In=new RegExp(`^(?:${Nn})+$`),Fn=new RegExp(`^(?:!(?:${Tn})*|${Nn}(?:${Tn})*)$`),Ln={filename:"",maxDepth:100};function Mn(t,e,i,s,n,a,o){t.events.push({type:Rs,start:e,anchorStart:i,anchorEnd:s,tagStart:n,tagEnd:a,style:o})}function Dn(t,e,i,s,n,a,o){t.events.push({type:Vs,start:e,anchorStart:i,anchorEnd:s,tagStart:n,tagEnd:a,style:o})}function Rn(t,e){t.events.splice(e.eventsLength,0,{type:Vs,start:e.position,anchorStart:An,anchorEnd:An,tagStart:An,tagEnd:An,style:Gs})}function Vn(t,e,i,s,n,a,o,r,l=Zs,c=-1,h=!1){t.events.push({type:zs,valueStart:e,valueEnd:i,anchorStart:s,anchorEnd:n,tagStart:a,tagEnd:o,style:r,chomping:l,indent:c,fast:h})}function zn(t){t.events.push({type:Us})}function qn(t){Vn(t,An,An,An,An,An,An,Ks)}function Un(){return{anchorStart:An,anchorEnd:An,tagStart:An,tagEnd:An}}function Kn(t){return{position:t.position,line:t.line,lineStart:t.lineStart,lineIndent:t.lineIndent,firstTabInLine:t.firstTabInLine,eventsLength:t.events.length}}function Hn(t,e){t.position=e.position,t.line=e.line,t.lineStart=e.lineStart,t.lineIndent=e.lineIndent,t.firstTabInLine=e.firstTabInLine,t.events.length=e.eventsLength}function Wn(t,e){Ms.throwAt(t.input.slice(0,t.length),t.position,e,t.filename)}function Jn(t){return 10===t||13===t}function Bn(t){return 9===t||32===t}function Yn(t){return Bn(t)||Jn(t)}function Gn(t){return 0===t||Yn(t)}function Zn(t){return 44===t||91===t||93===t||123===t||125===t}function Qn(t){return t>=48&&t<=57?t-48:-1}function Xn(t){if(t>=48&&t<=57)return t-48;const e=32|t;return e>=97&&e<=102?e-97+10:-1}function ta(t){return 120===t?2:117===t?4:85===t?8:0}function ea(t){return 48===t||97===t||98===t||116===t||9===t||110===t||118===t||102===t||114===t||101===t||32===t||34===t||47===t||92===t||78===t||95===t||76===t||80===t}function ia(t){10===t.input.charCodeAt(t.position)?t.position++:(t.position++,10===t.input.charCodeAt(t.position)&&t.position++),t.line++,t.lineStart=t.position,t.lineIndent=0,t.firstTabInLine=-1}function sa(t,e){let i=0,s=t.input.charCodeAt(t.position),n=t.position===t.lineStart||Yn(t.input.charCodeAt(t.position-1));for(;0!==s;){for(;Bn(s);)n=!0,9===s&&-1===t.firstTabInLine&&(t.firstTabInLine=t.position),s=t.input.charCodeAt(++t.position);if(e&&n&&35===s)do{s=t.input.charCodeAt(++t.position)}while(!Jn(s)&&0!==s);if(!Jn(s))break;for(ia(t),i++,n=!0,s=t.input.charCodeAt(t.position);32===s;)t.lineIndent++,s=t.input.charCodeAt(++t.position)}return i}function na(t,e=t.position){const i=t.input.charCodeAt(e);if((45===i||46===i)&&i===t.input.charCodeAt(e+1)&&i===t.input.charCodeAt(e+2)){const i=t.input.charCodeAt(e+3);return 0===i||Yn(i)}return!1}function aa(t){t.position===t.lineStart&&65279===t.input.charCodeAt(t.position)&&(t.position++,t.lineStart=t.position)}function oa(t){if(t.position!==t.lineStart)return!1;if(na(t))return!0;if(65279!==t.input.charCodeAt(t.position))return!1;const e=Kn(t);aa(t),sa(t,!0);const i=t.input.charCodeAt(t.position),s=t.position===t.lineStart&&(37===i||45===i&&na(t));return Hn(t,e),s}function ra(t){let e=t.input.charCodeAt(t.position);for(;0!==e&&!Jn(e);)e=t.input.charCodeAt(++t.position)}function la(t,e,i){On.test(t.input.slice(e,i))&&Wn(t,"the stream contains non-printable characters")}function ca(t,e,i){if(33!==t.input.charCodeAt(t.position))return!1;e.tagStart!==An&&Wn(t,"duplication of a tag property");const s=t.position;let n=!1,a=!1,o="!",r=t.input.charCodeAt(++t.position);60===r?(n=!0,r=t.input.charCodeAt(++t.position)):33===r&&(a=!0,o="!!",r=t.input.charCodeAt(++t.position));let l,c=t.position;if(n){for(;0!==r&&62!==r;)r=t.input.charCodeAt(++t.position);62!==r&&Wn(t,"unexpected end of the stream within a verbatim tag"),l=t.input.slice(c,t.position),t.position++}else{for(;!(0===r||Yn(r)||i&&Zn(r));)33===r&&(a?Wn(t,"tag suffix cannot contain exclamation marks"):(o=t.input.slice(c-1,t.position+1),En.test(o)||Wn(t,"named tag handle cannot contain such characters"),a=!0,c=t.position+1)),r=t.input.charCodeAt(++t.position);l=t.input.slice(c,t.position),Cn.test(l)&&Wn(t,"tag suffix cannot contain flow indicator characters")}return l&&!(n?Pn.test(l):In.test(l))&&Wn(t,`tag name cannot contain such characters: ${l}`),n||"!"===o||"!!"===o||jn.call(t.tagHandlers,o)||Wn(t,`undeclared tag handle "${o}"`),e.tagStart=s,e.tagEnd=t.position,!0}function ha(t,e){if(38!==t.input.charCodeAt(t.position))return!1;e.anchorStart!==An&&Wn(t,"duplication of an anchor property"),t.position++;const i=t.position;for(;0!==t.input.charCodeAt(t.position)&&!Yn(t.input.charCodeAt(t.position))&&!Zn(t.input.charCodeAt(t.position));)t.position++;return t.position===i&&Wn(t,"name of an anchor node must contain at least one character"),e.anchorStart=i,e.anchorEnd=t.position,!0}function da(t,e){if(42!==t.input.charCodeAt(t.position))return!1;e.anchorStart===An&&e.tagStart===An||Wn(t,"alias node should not have any properties"),t.position++;const i=t.position;for(;0!==t.input.charCodeAt(t.position)&&!Yn(t.input.charCodeAt(t.position))&&!Zn(t.input.charCodeAt(t.position));)t.position++;return t.position===i&&Wn(t,"name of an alias node must contain at least one character"),function(t,e,i){t.events.push({type:qs,anchorStart:e,anchorEnd:i})}(t,i,t.position),!0}function ua(t,e){sa(t,!1),t.lineIndent<e&&Wn(t,"deficient indentation")}function pa(t,e,i,s){if(!function(t,e){const i=t.input.charCodeAt(t.position),s=1===e;if(0===i||Yn(i)||35===i||38===i||42===i||33===i||124===i||62===i||39===i||34===i||37===i||64===i||96===i||s&&Zn(i))return!1;if(63===i||45===i){const e=t.input.charCodeAt(t.position+1);if(Gn(e)||s&&Zn(e))return!1}return!0}(t,i))return!1;const n=t.position;let a=t.position,o=t.input.charCodeAt(t.position);const r=1===i;let l=!1;for(;0!==o&&!oa(t);){if(58===o){const e=t.input.charCodeAt(t.position+1);if(Gn(e)||r&&Zn(e))break}else if(35===o){if(Yn(t.input.charCodeAt(t.position-1)))break}else{if(r&&Zn(o))break;if(Jn(o)){const i=t.position,s=t.line,n=t.lineStart,a=t.lineIndent;if(sa(t,!1),t.lineIndent>=e){l=!0,o=t.input.charCodeAt(t.position);continue}t.position=i,t.line=s,t.lineStart=n,t.lineIndent=a;break}}Bn(o)||(a=t.position+1),o=t.input.charCodeAt(++t.position)}return a!==n&&(la(t,n,a),Vn(t,n,a,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,Ks,Zs,-1,!l),!0)}function ma(t,e){const i=t.line;sa(t,!0),(t.line>i&&t.lineIndent<e||-1!==t.firstTabInLine&&t.lineIndent<e)&&Wn(t,"deficient indentation")}function fa(t,e,i){if(-1!==t.firstTabInLine||45!==t.input.charCodeAt(t.position)||!Gn(t.input.charCodeAt(t.position+1)))return!1;for(Mn(t,t.position,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Ys);45===t.input.charCodeAt(t.position)&&Gn(t.input.charCodeAt(t.position+1));){-1!==t.firstTabInLine&&(t.position=t.firstTabInLine,Wn(t,"tab characters must not be used in indentation"));const i=t.line;t.position++;const s=sa(t,!0)>0;if(-1!==t.firstTabInLine&&45===t.input.charCodeAt(t.position)&&Gn(t.input.charCodeAt(t.position+1))&&Wn(t,"bad indentation of a sequence entry"),s&&t.lineIndent<=e?qn(t):_a(t,e,3,!1,!0),sa(t,!0),t.lineIndent<e||t.position>=t.length)break;t.lineIndent>e&&Wn(t,"bad indentation of a sequence entry"),t.line===i&&45===t.input.charCodeAt(t.position)&&Gn(t.input.charCodeAt(t.position+1))&&Wn(t,"bad indentation of a sequence entry")}return zn(t),!0}function ga(t,e,i,s){let n=!1,a=!1,o=!1,r=!1;if(-1!==t.firstTabInLine)return!1;let l=t.input.charCodeAt(t.position);for(;0!==l;){n||-1===t.firstTabInLine||(t.position=t.firstTabInLine,Wn(t,"tab characters must not be used in indentation"));const c=t.input.charCodeAt(t.position+1),h=t.line;if(63!==l&&58!==l||!Gn(c)){n&&(qn(t),n=!1);const e=Kn(t);if(!_a(t,i,2,!1,!0))break;if(t.line===h){for(l=t.input.charCodeAt(t.position);Bn(l);)l=t.input.charCodeAt(++t.position);if(58===l)l=t.input.charCodeAt(++t.position),Gn(l)||Wn(t,"a whitespace character is expected after the key-value separator within a block mapping"),o||(t.events.splice(e.eventsLength,0,{type:Vs,start:e.position,anchorStart:s.anchorStart,anchorEnd:s.anchorEnd,tagStart:s.tagStart,tagEnd:s.tagEnd,style:Ys}),o=!0),a=!0,n=!1,r=!1;else{if(!a)return s.anchorStart===An&&s.tagStart===An||(Hn(t,e),!1);Wn(t,"expected ':' after a mapping key")}}else{if(!a)return s.anchorStart===An&&s.tagStart===An||(Hn(t,e),!1);Wn(t,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else o||(Dn(t,t.position,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,Ys),o=!0),63===l?(n&&qn(t),a=!0,n=!0):(n||(qn(t),a=!0),n=!1),t.position+=1,r=!0;if(_a(t,e,4,!0,r)&&(r=!1),n||r&&(qn(t),r=!1),sa(t,!0),l=t.input.charCodeAt(t.position),(t.line===h||t.lineIndent>e)&&0!==l)Wn(t,"bad indentation of a mapping entry");else if(t.lineIndent<e)break}return!!a&&(n&&qn(t),o&&zn(t),!0)}function _a(t,e,i,s,n,a=!0){t.depth>=t.maxDepth&&Wn(t,`nesting exceeded maxDepth (${t.maxDepth})`),t.depth++;let o=1,r=!1,l=!1,c=null;const h=Un();let d=4===i||3===i,u=d;const p=d;if(s&&sa(t,!0)&&(r=!0,o=t.lineIndent>e?1:t.lineIndent===e?0:-1),1===o)for(;;){const s=t.input.charCodeAt(t.position),n=Kn(t);if(r&&1!==o&&(33===s||38===s))break;if(r&&p&&(h.tagStart!==An||h.anchorStart!==An)&&(33===s||38===s)){const i=Kn(t),s=e+1;if(ga(t,t.position-t.lineStart,s,h)&&t.events[i.eventsLength]?.type===Vs)return t.depth--,!0;Hn(t,i)}if(r&&(33===s&&h.tagStart!==An||38===s&&h.anchorStart!==An))break;if(!ca(t,h,1===i)&&!ha(t,h))break;null===c&&(c=n),sa(t,!0)?(r=!0,u=p,o=t.lineIndent>e?1:t.lineIndent===e?0:-1):u=!1}if(u&&(u=r||n),1===o||4===i){const s=1===i||2===i?e:e+1,n=t.position-t.lineStart;if(1===o)if(u&&(fa(t,n,h)||ga(t,n,s,h))||function(t,e,i){const s=t.input.charCodeAt(t.position),n=123===s,a=t.position;let o=!0;if(91!==s&&123!==s)return!1;const r=n?125:93;for(n?Dn(t,a,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Gs):Mn(t,a,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Gs),t.position++;0!==t.input.charCodeAt(t.position);){ma(t,e);let i=t.input.charCodeAt(t.position);if(i===r)return t.position++,zn(t),!0;o?44===i&&Wn(t,"expected the node content, but found ','"):Wn(t,"missed comma between flow collection entries");let s=!1,a=!1;63===i&&Yn(t.input.charCodeAt(t.position+1))&&(s=a=!0,t.position+=1,ma(t,e));const l=t.line,c=Kn(t),h=_a(t,e,1,!1,!0);ma(t,e),i=t.input.charCodeAt(t.position),(n||a||t.line===l)&&58===i?(s=!0,t.position++,ma(t,e),n||Rn(t,c),h||qn(t),_a(t,e,1,!1,!0)||qn(t),ma(t,e),n||zn(t)):n&&s?(h||qn(t),qn(t)):n?qn(t):s&&(Rn(t,c),h||qn(t),qn(t),zn(t)),i=t.input.charCodeAt(t.position),44===i?(o=!0,t.position++):o=!1}Wn(t,"unexpected end of the stream within a flow collection")}(t,s,h))l=!0;else{const e=t.input.charCodeAt(t.position);if(null!==c&&a&&p&&!u&&124!==e&&62!==e){const e=Kn(t),i=c.position-c.lineStart;Hn(t,c),ga(t,i,s,Un())&&t.events[e.eventsLength]?.type===Vs?l=!0:Hn(t,e)}!l&&(d&&function(t,e,i){const s=t.input.charCodeAt(t.position);let n=Zs,a=-1,o=!1;if(124!==s&&62!==s)return!1;const r=124===s?Js:Bs;for(t.position++;0!==t.input.charCodeAt(t.position);){const i=t.input.charCodeAt(t.position),s=Qn(i);if(43===i||45===i)n!==Zs&&Wn(t,"repeat of a chomping mode identifier"),n=43===i?Xs:Qs,t.position++;else{if(!(s>=0))break;0===s&&Wn(t,"bad explicit indentation width of a block scalar; it cannot be less than one"),o&&Wn(t,"repeat of an indentation width identifier"),a=e+s-1,o=!0,t.position++}}let l=!1;for(;Bn(t.input.charCodeAt(t.position));)l=!0,t.position++;l&&35===t.input.charCodeAt(t.position)&&ra(t),Jn(t.input.charCodeAt(t.position))?ia(t):0!==t.input.charCodeAt(t.position)&&Wn(t,"a line break is expected");let c=o?a:-1,h=0;const d=t.position;let u=t.position;for(;0!==t.input.charCodeAt(t.position);){const i=t.position;let s=0;for(;32===t.input.charCodeAt(i+s);)s++;const n=t.input.charCodeAt(i+s);if(0===n){c>=0?s>c&&(u=i+s):s>0&&(u=i+s);break}if(oa(t))break;if(!o&&-1===c&&Jn(n)&&(h=Math.max(h,s)),o||-1!==c||Jn(n)||(9===n&&s<e&&(t.position=i+s,Wn(t,"tab characters must not be used in indentation")),s>=e&&s<h&&(t.position=i+s,Wn(t,"bad indentation of a mapping entry"))),-1===c&&0!==n&&!Jn(n)&&s<e){t.lineIndent=s,t.position=i+s;break}o||0===n||Jn(n)||-1!==c||(c=s);const a=-1===c?e+1:c;if(0!==n&&!Jn(n)&&s<a){t.lineIndent=s,t.position=i+s;break}ra(t),u=t.position,Jn(t.input.charCodeAt(t.position))&&(ia(t),u=t.position)}return la(t,d,u),Vn(t,d,u,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,r,n,c),!0}(t,s,h)||function(t,e,i){if(39!==t.input.charCodeAt(t.position))return!1;t.position++;const s=t.position;let n=!0;for(;0!==t.input.charCodeAt(t.position);){const a=t.input.charCodeAt(t.position);if(39===a){if(39===t.input.charCodeAt(t.position+1)){n=!1,t.position+=2;continue}const e=t.position;return t.position++,Vn(t,s,e,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Hs,Zs,-1,n),!0}Jn(a)?(n=!1,ua(t,e)):t.position===t.lineStart&&na(t)?Wn(t,"unexpected end of the document within a single quoted scalar"):9!==a&&a<32?Wn(t,"expected valid JSON character"):t.position++}Wn(t,"unexpected end of the stream within a single quoted scalar")}(t,s,h)||function(t,e,i){if(34!==t.input.charCodeAt(t.position))return!1;t.position++;const s=t.position;let n=!0;for(;0!==t.input.charCodeAt(t.position);){const a=t.input.charCodeAt(t.position);if(34===a){const e=t.position;return t.position++,Vn(t,s,e,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Ws,Zs,-1,n),!0}if(92===a){n=!1;const i=t.input.charCodeAt(++t.position);if(Jn(i))ua(t,e);else if(ea(i))t.position++;else{let e=ta(i);for(0===e&&Wn(t,"unknown escape sequence");e-- >0;)t.position++,Xn(t.input.charCodeAt(t.position))<0&&Wn(t,"expected hexadecimal character");t.position++}}else Jn(a)?(n=!1,ua(t,e)):t.position===t.lineStart&&na(t)?Wn(t,"unexpected end of the document within a double quoted scalar"):9!==a&&a<32?Wn(t,"expected valid JSON character"):t.position++}Wn(t,"unexpected end of the stream within a double quoted scalar")}(t,s,h)||da(t,h)||pa(t,s,i,h))&&(l=!0)}else 0===o&&(l=u&&fa(t,n,h))}return d=d&&!l,l||h.anchorStart===An&&h.tagStart===An&&!d||(Vn(t,An,An,h.anchorStart,h.anchorEnd,h.tagStart,h.tagEnd,Ks),l=!0),t.depth--,l||h.anchorStart!==An||h.tagStart!==An}function va(t){if(t.lineIndent>0||37!==t.input.charCodeAt(t.position))return!1;t.position++;const e=t.position;for(;0!==t.input.charCodeAt(t.position)&&!Yn(t.input.charCodeAt(t.position));)t.position++;const i=t.input.slice(e,t.position),s=[];for(0===i.length&&Wn(t,"directive name must not be less than one character in length");0!==t.input.charCodeAt(t.position)&&!Jn(t.input.charCodeAt(t.position));){for(;Bn(t.input.charCodeAt(t.position));)t.position++;if(35===t.input.charCodeAt(t.position)||Jn(t.input.charCodeAt(t.position))||0===t.input.charCodeAt(t.position))break;const e=t.position;for(;0!==t.input.charCodeAt(t.position)&&!Yn(t.input.charCodeAt(t.position));)t.position++;s.push(t.input.slice(e,t.position))}if(Jn(t.input.charCodeAt(t.position))&&ia(t),"YAML"===i){t.directives.some(t=>"yaml"===t.kind)&&Wn(t,"duplication of %YAML directive"),1!==s.length&&Wn(t,"YAML directive accepts exactly one argument");const e=/^([0-9]+)\.([0-9]+)$/.exec(s[0]);null===e&&Wn(t,"ill-formed argument of the YAML directive"),1!==parseInt(e[1],10)&&Wn(t,"unacceptable YAML version of the document"),t.directives.push({kind:"yaml",version:s[0]})}else if("TAG"===i){2!==s.length&&Wn(t,"TAG directive accepts exactly two arguments");const[e,i]=s;En.test(e)||Wn(t,"ill-formed tag handle (first argument) of the TAG directive"),jn.call(t.tagHandlers,e)&&Wn(t,`there is a previously declared suffix for "${e}" tag handle`),Fn.test(i)||Wn(t,"ill-formed tag prefix (second argument) of the TAG directive"),t.tagHandlers[e]=i,t.directives.push({kind:"tag",handle:e,prefix:i})}return!0}function ya(t){t.directives=[],t.tagHandlers=Object.create(null);let e=!1;for(sa(t,!0);va(t);)e=!0,sa(t,!0);let i=!1,s=!1,n=!0;if(0===t.lineIndent&&45===t.input.charCodeAt(t.position)&&45===t.input.charCodeAt(t.position+1)&&45===t.input.charCodeAt(t.position+2)&&Gn(t.input.charCodeAt(t.position+3))){i=!0;const e=t.line;t.position+=3,sa(t,!0),n=t.line>e}else e&&Wn(t,"directives end mark is expected");const a=t.events.length;if(!i&&t.position===t.lineStart&&46===t.input.charCodeAt(t.position)&&na(t))return t.position+=3,void sa(t,!0);if(function(t,e,i){t.events.push({type:Ds,explicitStart:e,explicitEnd:i,directives:t.directives})}(t,i,!1),_a(t,t.lineIndent-1,4,!1,n,n)||qn(t),sa(t,!0),t.position===t.lineStart&&na(t)&&(s=46===t.input.charCodeAt(t.position),s)){const e=t.line;t.position+=3,sa(t,!0),t.line===e&&t.position<t.length&&Wn(t,"end of the stream or a document separator is expected")}const o=t.events[a];o?.type===Ds&&(o.explicitEnd=s),zn(t),!s&&t.position<t.length&&!oa(t)&&Wn(t,"end of the stream or a document separator is expected")}var ba={...Ln,...mn};function $a(t,e={}){const i={...ba,...e},s=String(t),n=Object.keys(Ln),a=Object.keys(mn);return function(t,e){const i={...mn,...e,events:t,documents:[],eventIndex:0,position:0,frames:[],anchors:new Map,nodeTags:new Map,tagHandlers:Object.create(null),totalMergeKeys:0,aliasCount:0};for(;i.eventIndex<i.events.length;){const t=i.events[i.eventIndex++];switch(i.position=fn(t),t.type){case Ds:i.anchors=new Map,i.nodeTags=new Map,i.aliasCount=0,i.tagHandlers=Object.create(null);for(const e of t.directives)"tag"===e.kind&&(i.tagHandlers[e.handle]=e.prefix);i.frames.push({kind:"document",position:i.position,value:void 0,hasValue:!1});break;case zs:{const{value:e,tag:s}=vn(i,t);Sn(i,t,e,s,!0),kn(i,e,s);break}case Rs:{const e=yn(i,t,"tag:yaml.org,2002:seq"),s=i.schema.lookupSequenceTag(e);s||gn(i,`unknown sequence tag !<${e}>`);const n=s.create(e),a=Sn(i,t,n,s,s.carrierIsResult);i.frames.push({kind:"sequence",position:i.position,value:n,tag:s,anchor:a,index:0});break}case Vs:{const e=yn(i,t,"tag:yaml.org,2002:map"),s=i.schema.lookupMappingTag(e);s||gn(i,`unknown mapping tag !<${e}>`);const n=s.create(e),a=Sn(i,t,n,s,s.carrierIsResult);i.frames.push({kind:"mapping",position:i.position,value:n,tag:s,anchor:a,key:void 0,keyPosition:i.position,hasKey:!1,keyIsMerge:!1,overridable:null});break}case qs:{-1!==i.maxAliases&&++i.aliasCount>i.maxAliases&&gn(i,`aliases exceeded maxAliases (${i.maxAliases})`);const e=i.source.slice(t.anchorStart,t.anchorEnd),s=i.anchors.get(e);s||gn(i,`unidentified alias "${e}"`),s.isValueFinal||gn(i,`recursive alias "${e}" is not supported for tag ${s.tag.tagName} because it uses finalize()`),kn(i,s.value,s.tag);break}case Us:{const t=i.frames.pop();if("mapping"===t.kind&&t.hasKey&&(i.position=t.keyPosition,gn(i,"incomplete mapping pair in event stream")),"document"===t.kind)i.documents.push(t.value);else{const e=t.tag.carrierIsResult?t.value:_n(i,t.position,t.tag,t.value);t.anchor&&(t.anchor.value=e,t.anchor.isValueFinal=!0),kn(i,e,t.tag)}break}}}return i.documents}(function(t,e){const i=t.length,s={...Ln,...e,input:`${t}\0`,length:i,position:0,line:0,lineStart:0,lineIndent:0,firstTabInLine:-1,depth:0,directives:[],tagHandlers:Object.create(null),events:[]},n=t.indexOf("\0");for(-1!==n&&Ms.throwAt(t,n,"null byte is not allowed in input",s.filename);s.position<s.length&&(aa(s),sa(s,!0),!(s.position>=s.length));){const t=s.position;ya(s),s.position===t&&Wn(s,"can not read a document")}return s.events}(s,ks(i,n)),{...ks(i,a),source:s})}function wa(t,e){return!!(t&1<<e)}var xa={applyQuoteFlowKeysOption:function(t){if(!t.presenterOptions.quoteFlowKeys)return;if(!t.isKey||!t.flowOnly||t.style!==Ks)return;t.style=Ws},doubleQuoteForInvisibles:function(t){t.style===Ks&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(t.node.value)&&(t.style=Ws)},doubleQuoteWhitespaceOnly:function(t){t.style===Ks&&/^\s+$/.test(t.node.value)&&(t.style=Ws)},applyForceQuotesOption:function(t){if(!t.presenterOptions.forceQuotes)return;if(t.isKey||t.style!==Ks)return;if(t.node.tag!==t.presenterOptions.schema.defaultScalarTag.tagName)return;t.style=t.node.value.includes("\n")?Ws:ka(t)},tryLongOrMultilineAsBlock:function(t){if(t.style!==Ks||t.isKey)return;const e=t.node.value,i=-1!==e.indexOf("\n");if(!wa(t.allowedStylesMask,Js))return void(i&&(t.style=Ws));const s=t.presenterOptions.lineWidth;if(-1===s)return void(i&&(t.style=Js));const n=Math.max(Math.min(s,40),s-t.shiftOfContent);let a=0,o=!1;for(;a<=e.length;){let t=e.length;const i=e.indexOf("\n",a);-1!==i&&(t=i);const s=e.slice(a,t);if(s.length>n&&" "!==s[0]&&/ [^ \t]/.test(s)&&(o=!0),-1===i)break;a=i+1}o?t.style=Bs:i&&(t.style=Js)},quoteInvalidPlain:function(t){t.style!==Ks||wa(t.allowedStylesMask,Ks)||(t.style=ka(t))},fallbackToDoubleQuoted:function(t){wa(t.allowedStylesMask,t.style)||(t.style=Ws)}};function ka(t){return"single"===t.presenterOptions.quoteStyle&&wa(t.allowedStylesMask,Hs)?Hs:Ws}Object.keys(xa).map(t=>Reflect.get(xa,t));const Sa="tempus2016/decluttering-card-plus",Aa="share-your-templates",ja=`https://github.com/${Sa}/discussions/new?category=${Aa}`,Oa="decluttering-card-plus-community";function Ca(t){let e=2e4;const i=t=>(e-=1+Math.ceil(t/16))>=0,s=t=>"string"==typeof t?i(t.length):!!i(0)&&(Array.isArray(t)?t.every(s):!t||"object"!=typeof t||Object.entries(t).every(([t,e])=>i(t.length)&&s(e)));return s(t)}const Ea=t=>!!t&&"object"==typeof t&&!Array.isArray(t);function Ta(t){if(Ca(t))return JSON.parse(JSON.stringify(t),(t,e)=>"__proto__"===t?void 0:e)}const Na=/[\p{Cf}\u2800\u3164\u115F\u1160\uFFA0]/gu;function Pa(t){if("string"!=typeof t)return;const e=t.replace(Na,"").replace(/\s+/g," ").trim();return e?e.length>80?`${e.slice(0,79)}…`:e:void 0}const Ia=["card","badge","row","element","group"];function Fa(t){if(!Ea(t))return{};const e={};for(const[i,s]of Object.entries(t))Ea(s)&&Ia.some(t=>void 0!==s[t])&&(e[i]=s);return e}function La(t,e){return"string"==typeof e&&/^https:\/\/github\.com\//.test(e)?e:`https://github.com/${Sa}/discussions/${t}`}function Ma(t){var e,i,s,n,a;const o=function(t){if("string"!=typeof t||t.length>65536)return;const e=/^ {0,3}(`{3,}|~{3,})[ \t]*([\w-]*)/,i=[];let s;for(const o of function(t){return t.replace(/<!--[\s\S]*?(?:-->|$)/g,"")}(t).split("\n")){if(s){o.trim()===s.fence?(i.push({lang:s.lang,text:s.lines.join("\n")+"\n"}),s=void 0):s.lines.push(o);continue}const t=e.exec(o);t&&(s={fence:t[1],lang:t[2],lines:[]})}const n=i.find(t=>/^ya?ml$/i.test(t.lang)),a=null!=n?n:i.find(t=>""===t.lang);return null==a?void 0:a.text}(null==t?void 0:t.body);if(!o)return;let r;try{if(r=Ta(function(t,e){const i=$a(t,e);if(0===i.length)throw new Ms("expected a document, but the input is empty");if(1===i.length)return i[0];throw new Ms("expected a single document in the stream, but found more")}(o,{maxAliases:50})),void 0===r)return}catch(d){return}if(!Qe(r).ok)return;if("number"!=typeof(null==t?void 0:t.number))return;const{template:l,includes:c}=r,h=Nt(r,["template","includes"]);return delete h.type,"string"!=typeof h.description&&delete h.description,{id:t.number,title:null!==(e=Pa(t.title))&&void 0!==e?e:l,author:"string"==typeof(null===(i=t.user)||void 0===i?void 0:i.login)?t.user.login:"",url:La(t.number,t.html_url),name:l.trim(),template:h,includes:Fa(c),reactions:"number"==typeof(null===(s=t.reactions)||void 0===s?void 0:s.total_count)?t.reactions.total_count:0,updated:"string"==typeof(null!==(n=t.updated_at)&&void 0!==n?n:t.created_at)?null!==(a=t.updated_at)&&void 0!==a?a:t.created_at:""}}const Da=["lock","alarm_control_panel","cover","valve","siren","script","automation","button","input_button","water_heater","lawn_mower","update"],Ra=["more-info","navigate","none","assist"],Va=["action","perform_action","service","type"],za=/\b[a-z][a-z0-9+.-]{1,31}:(?:\/\/)?[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?|\/\/[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?/gi,qa=[/(?:url|image-set|src)\(\s*['"]?([^'")\s{}]+)/gi,/@import\s+(?:url\(\s*)?['"]?([^'")\s;{}]+)/gi],Ua=/^(?:\/(?!\/)|#|data:)/i,Ka=["image","url","url_path","entity_picture","camera_image","image_url","icon_url","src"],Ha=/\[\[\[|\{\{|\{%|\$\{/,Wa=/^\s*(?:javascript|data|vbscript):/i,Ja=/position\s*:\s*(?:fixed|absolute)/i,Ba=/opacity\s*:\s*0(?:[^.\d]|$)|visibility\s*:\s*hidden|transparent/i,Ya=t=>"string"==typeof t&&Da.includes(t.split(".")[0]),Ga=t=>t.replace(/\\/g,"/"),Za="*";function Qa(t,e){const i=[].concat(null!=t?t:[]).filter(t=>"string"==typeof t);if(i.length)return i.includes(Za)?[Za]:i;const s=[].concat(null!=e?e:[]).filter(t=>"string"==typeof t);if(!s.length)return[Za];const n=s.map(t=>{const e=t.indexOf("."),i=-1===e?t:t.slice(0,e);return/^[a-z_]+$/.test(i)?i:Za});return n.includes(Za)?[Za]:[...new Set(n)]}function Xa(t,e,i=new Set){var s,n,a,o;if(Array.isArray(t))return t.forEach(t=>Xa(t,e,i)),i;if(!Ea(t))return i;const r="string"==typeof t.entity?t.entity:e,l=t.action;if("string"==typeof l&&!Ra.includes(l)&&!l.includes("[[")&&"perform-action"!==l&&"call-service"!==l&&"fire-dom-event"!==l&&"url"!==l){const e=[].concat(null!==(o=null!==(a=null!==(n=null===(s=t.target)||void 0===s?void 0:s.entity_id)&&void 0!==n?n:t.entity_id)&&void 0!==a?a:r)&&void 0!==o?o:[]);e.length&&!e.some(t=>"string"!=typeof t||t.includes("[["))||i.add(l)}return Object.values(t).forEach(t=>Xa(t,r,i)),i}function to(t,e){const i=Ia.find(e=>void 0!==t[e]);if(i)try{return I(e,t,t[i],void 0,void 0,!0)}catch(s){return}}function eo(t){const e=new Set,i=new Set;let s=!1,n=!1,a=!1,o=!1;const r=t=>{const e=Ga(t).trim();!e||Ua.test(e)||e.startsWith("[[")||e.startsWith("{{")||/^[\w.-]+\.[a-z]{2,}(?:[:/?#]|$)/i.test(e)&&i.add(e)},l=new Set,c=(t,i)=>{for(const s of t)if(i.includes(Za))e.add(`${s} *`);else for(const t of i)Da.includes(t)&&e.add(`${s} ${t}.*`)},h=(d,u)=>{var p;if("string"==typeof d)return void(t=>{var e;const s=Ga(t);for(const n of null!==(e=s.match(za))&&void 0!==e?e:[])i.add(n);for(const n of qa){n.lastIndex=0;let t=n.exec(s);for(;t;)Ua.test(t[1])||i.add(t[1]),t=n.exec(s)}Ha.test(t)&&(n=!0),Ja.test(t)&&Ba.test(t)&&(o=!0)})(d);if(Array.isArray(d))return void d.forEach(t=>h(t,u));if(!Ea(d))return;const m="string"==typeof d.entity?d.entity:u;Object.keys(d).some(t=>t.includes("[["))&&(a=!0),Va.some(t=>"string"==typeof d[t]&&d[t].includes("[["))&&(a=!0),"string"==typeof d.action&&((t,s)=>{var a,o,r,l,c,h;const d=t.action;if("perform-action"===d||"call-service"===d){const i=null!==(a=t.perform_action)&&void 0!==a?a:t.service;return void("string"!=typeof i?e.add("?"):i.includes("[[")||e.add(i))}if("fire-dom-event"===d)return void e.add("fire-dom-event");if("url"===d)return i.add("string"==typeof t.url_path?t.url_path:"?"),void("string"==typeof t.url_path&&Wa.test(t.url_path)&&(n=!0));if(Ra.includes(d)||d.includes("[["))return;const u=[].concat(null!==(h=null!==(c=null!==(l=null!==(r=null===(o=t.target)||void 0===o?void 0:o.entity_id)&&void 0!==r?r:t.entity_id)&&void 0!==l?l:t.entity)&&void 0!==c?c:s)&&void 0!==h?h:[]);for(const i of u)Ya(i)&&e.add(`${d} ${i}`)})(d,m),"iframe"!==d.type&&"webpage"!==d.type||(s=!0);for(const t of Ka)"string"==typeof d[t]&&r(d[t]);if("string"==typeof d.type&&bt.includes(d.type)){const e=(e=>{if("string"==typeof e)return e===t.name?t.template:Object.prototype.hasOwnProperty.call(t.includes,e)?t.includes[e]:void 0})(d.template);if(e){if(F(d.for_each_from)){const t=d.for_each_from,i=Ia.map(t=>e[t]).find(t=>void 0!==t);c(Xa(i,void 0),Qa(t.domain,t.entities))}const t=(f=d.variables,Array.isArray(f)?f.filter(Ea):Ea(f)?Object.entries(f).map(([t,e])=>({[t]:e})):void 0);(null==t?void 0:t.length)&&!l.has(d.template)&&(l.add(d.template),h(to(e,t),void 0),l.delete(d.template))}}var f;if("custom:auto-entities"===d.type&&Ea(d.filter))for(const t of[].concat(null!==(p=d.filter.include)&&void 0!==p?p:[])){if(!Ea(t))continue;const e=Qa(t.domain,t.entity_id);c(Xa(t.options,void 0),e),c(Xa(d.card,void 0),e)}Object.values(d).forEach(t=>h(t,m))},d=[t.template,...Object.values(t.includes)];h(d,void 0);for(const u of d)h(to(u),void 0);return{actions:[...e].sort(),urls:[...i].sort(),embeds:s,scripts:n,placeholders:a,overlay:o}}function io(t){return t.filter(t=>{var e;return(null===(e=null==t?void 0:t.category)||void 0===e?void 0:e.slug)===Aa}).map(Ma).filter(t=>!!t).sort((t,e)=>e.reactions-t.reactions||e.updated.localeCompare(t.updated))}class so extends Error{}function no(t){var e;if(!Ea(t)||"number"!=typeof t.id||"string"!=typeof t.name)return;if(!Ea(t.template))return;const i=Ta({template:t.template,includes:t.includes});if(!i||!Ea(i.template))return;if(!Qe(Object.assign({template:t.name},i.template)).ok)return;const s=Object.assign({},i.template);return delete s.type,"string"!=typeof s.description&&delete s.description,{id:t.id,title:null!==(e=Pa(t.title))&&void 0!==e?e:t.name,author:"string"==typeof t.author?t.author:"",url:La(t.id,t.url),name:t.name,template:s,includes:Fa(i.includes),reactions:"number"==typeof t.reactions?t.reactions:0,updated:"string"==typeof t.updated?t.updated:""}}async function ao(t={}){var e,i,s,n;const a=null!==(e=t.fetcher)&&void 0!==e?e:fetch.bind(globalThis),o=null!==(i=t.storage)&&void 0!==i?i:"undefined"==typeof localStorage?void 0:localStorage,r=null!==(s=t.now)&&void 0!==s?s:Date.now(),l=function(t){var e;try{const i=JSON.parse(null!==(e=null==t?void 0:t.getItem(Oa))&&void 0!==e?e:"null");if(!i||!Array.isArray(i.entries)||"number"!=typeof i.fetched)return;return{entries:i.entries.map(no).filter(t=>!!t),fetched:i.fetched}}catch(i){return}}(o);if(l&&!t.refresh&&r-l.fetched<216e5)return l;const c=[];try{for(let t=1;t<=10;t+=1){const e=await a(`https://api.github.com/repos/${Sa}/discussions?per_page=100&page=${t}`,{headers:{Accept:"application/vnd.github+json"}});if(!e.ok){const t=new so(`GitHub answered ${e.status}`);throw"0"===e.headers.get("x-ratelimit-remaining")&&(t.retryAt=1e3*Number(e.headers.get("x-ratelimit-reset"))||void 0),t}const i=await e.json();if(!Array.isArray(i))break;if(c.push(...i),i.length<100)break}}catch(d){const t=d instanceof so?d:new so(null!==(n=null==d?void 0:d.message)&&void 0!==n?n:String(d));throw t.cached=l,t}const h={entries:io(c),fetched:r};try{null==o||o.setItem(Oa,JSON.stringify(h))}catch(u){}return h}function oo(t,e){return{discussion:t.id,updated:t.updated,name:e,author:t.author}}function ro(t,e){return Object.assign(Object.assign({},t),{source:e})}function lo(t,e){return t.map(({name:t,source:i})=>{var s;const n=e.entries.find(t=>t.id===i.discussion),a="string"==typeof i.name?i.name:void 0,o=n?function(t,e){return void 0===e||e===t.name?t.template:Object.prototype.hasOwnProperty.call(t.includes,e)?t.includes[e]:void 0}(n,a):void 0;if(!n||!o)return Object.assign({name:t,status:"gone"},n?{entry:n}:{});if("string"!=typeof i.author||!i.author||i.author!==n.author)return{name:t,status:"unverified",entry:n};const r=Date.parse(null!==(s=i.updated)&&void 0!==s?s:""),l=Date.parse(n.updated);return{name:t,status:(Number.isFinite(r)?Number.isFinite(l)&&l>r:Number.isFinite(l))?"update":"current",entry:n,latest:ro(o,oo(n,null!=a?a:n.name))}})}function co(t){if(""===t)return[];const e=t.split("\n");return""===e[e.length-1]&&e.pop(),e}function ho(t,e){const i=t=>({kind:"remove",text:t}),s=t=>({kind:"add",text:t});if(!t.length||!e.length||t.length*e.length>4e6)return[...t.map(i),...e.map(s)];const n=t.length,a=e.length,o=Array.from({length:n+1},()=>new Uint32Array(a+1));for(let h=n-1;h>=0;h-=1)for(let i=a-1;i>=0;i-=1)o[h][i]=t[h]===e[i]?o[h+1][i+1]+1:Math.max(o[h+1][i],o[h][i+1]);const r=[];let l=0,c=0;for(;l<n&&c<a;)t[l]===e[c]?(r.push({kind:"same",text:t[l]}),l+=1,c+=1):o[l+1][c]>=o[l][c+1]?(r.push(i(t[l])),l+=1):(r.push(s(e[c])),c+=1);for(;l<n;)r.push(i(t[l++]));for(;c<a;)r.push(s(e[c++]));return r}const uo=m`<style>
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
</style>`;function po(t){return"string"==typeof t?t:void 0===t?"":Pt(t)}const mo={same:" ",add:"+",remove:"-"};function fo(t,e,i,s=3){const n=function(t,e){const i=co(t),s=co(e);let n=0;for(;n<i.length&&n<s.length&&i[n]===s[n];)n+=1;let a=i.length,o=s.length;for(;a>n&&o>n&&i[a-1]===s[o-1];)a-=1,o-=1;const r=i.slice(0,n).map(t=>({kind:"same",text:t})),l=i.slice(a).map(t=>({kind:"same",text:t}));return[...r,...ho(i.slice(n,a),s.slice(n,o)),...l]}(po(t),po(e));return function(t){return t.some(t=>"same"!==t.kind)}(n)?m`${uo}
    <div class="dcp-diff" role="figure" aria-label=${p("diff.label",void 0,i)}>
      ${function(t,e=3){const i=t.map(t=>"same"!==t.kind),s=new Array(t.length).fill(!1);t.forEach((i,n)=>{if("same"!==i.kind)for(let a=Math.max(0,n-e);a<=Math.min(t.length-1,n+e);a+=1)s[a]=!0});const n=[];let a=0;for(;a<t.length;){if(i[a]||s[a]){n.push(t[a]),a+=1;continue}let e=a;for(;e<t.length&&!i[e]&&!s[e];)e+=1;const o=e-a;1===o?n.push(t[a]):n.push({kind:"skip",count:o}),a=e}return n}(n,s).map(t=>function(t,e){return"skip"===t.kind?m`<div class="skip">${p("diff.skipped",{count:t.count},e)}</div>`:m`<div class=${t.kind}>${mo[t.kind]} ${t.text}</div>`}(t,i))}
    </div>`:m`${uo}
      <p class="dcp-diff-none">${p("diff.no_change",void 0,i)}</p>`}function go(t,e,i){var s,n;const a=null!==(s=JSON.stringify(t))&&void 0!==s?s:"",o=null!==(n=JSON.stringify(e))&&void 0!==n?n:"";return m`
    ${fo(t,e,i)}
    <ha-expansion-panel outlined>
      <span slot="header">${p("diff.full",void 0,i)}</span>
      <p class="dcp-diff-none">${p("diff.before",void 0,i)}</p>
      ${ji(a,m`<ha-yaml-editor .hass=${i} .defaultValue=${t} read-only></ha-yaml-editor>`)}
      <p class="dcp-diff-none">${p("diff.after",void 0,i)}</p>
      ${ji(o,m`<ha-yaml-editor .hass=${i} .defaultValue=${e} read-only></ha-yaml-editor>`)}
    </ha-expansion-panel>
  `}class _o extends s{constructor(){super(...arguments),this._importParses=!0,this._importErrors=[],this._importArmedAt=0,this._copyState="",this._busy=!1,this._libraryDestination="view",this._communityLoading=!1,this._communityKnownFailed=!1,this._installArmedAt=0,this._postCopyState="",this._updatesLoading=!1,this._updateArmedAt=0,this._trashArmedAt=0}get _config(){return this.config}get _savedLovelace(){var t,e,i;return null!==(i=null!==(e=null===(t=L())||void 0===t?void 0:t.config)&&void 0!==e?e:this.lovelace)&&void 0!==i?i:h()}static get styles(){return ki}_fireConfigChanged(t){w(this,"config-changed",{config:t})}_saveDashboard(t,e,i){return xi(this,t,e,i)}render(){return this.hass&&this._config?this._renderShare():m``}async _loadTrash(){this.hass&&(this._trash=await It(this.hass))}_renderShare(){const{payload:t,notes:e}=Ye(this._config,d(this._savedLovelace));return m`
      <div class="share">
        <h3>${p("share.export_header",void 0,this.hass)}</h3>
        <p class="hint">${p("share.export_hint",void 0,this.hass)}</p>
        ${e.map(t=>m`<ha-alert alert-type="info">${t}</ha-alert>`)}
        <ha-yaml-editor id="export" .hass=${this.hass} .defaultValue=${t} read-only></ha-yaml-editor>
        <ha-button @click=${this._copyExport}>
          ${"done"===this._copyState?p("share.copied",void 0,this.hass):"failed"===this._copyState?p("share.copy_failed",void 0,this.hass):p("share.copy",void 0,this.hass)}
        </ha-button>
        <ha-button @click=${this._downloadExport}> ${p("share.download",void 0,this.hass)} </ha-button>
        <ha-button @click=${this._copyPost}>
          ${"done"===this._postCopyState?p("share.copied",void 0,this.hass):"failed"===this._postCopyState?p("share.copy_failed",void 0,this.hass):p("share.post_copy",void 0,this.hass)}
        </ha-button>
        <p class="hint">
          ${p("share.post_hint",void 0,this.hass)}
          <a href=${ja} target="_blank" rel="noopener noreferrer"
            >${p("share.post_open",void 0,this.hass)}</a
          >
        </p>

        <h3>${p("share.import_header",void 0,this.hass)}</h3>
        <p class="hint">${p("share.import_hint",void 0,this.hass)}</p>
        <ha-yaml-editor id="import" .hass=${this.hass} @value-changed=${this._importChanged}></ha-yaml-editor>
        <input
          id="import-file"
          type="file"
          accept=".yaml,.yml,.json,text/yaml,application/json"
          hidden
          @change=${this._importFile}
        />
        <ha-button @click=${()=>{var t;return null===(t=this.renderRoot.querySelector("#import-file"))||void 0===t?void 0:t.click()}}>
          ${p("share.import_file",void 0,this.hass)}
        </ha-button>
        ${this._importErrors.map(t=>m`<ha-alert alert-type="error">${t}</ha-alert>`)}
        ${this._importClash?m`<ha-alert alert-type="warning">
                ${p("share.import_clash",{name:this._importClash},this.hass)}
              </ha-alert>`:m``}
        ${this._importRisks?this._renderRisks(this._importRisks,"share.import_risks"):m``}
        <ha-button @click=${this._import}>
          ${p(this._importClash||this._importRisks?"share.import_anyway":"share.import",void 0,this.hass)}
        </ha-button>
        ${this._importClash?m`<ha-button @click=${this._importAsCopy}>
                ${p("share.import_copy",void 0,this.hass)}
              </ha-button>`:m``}
        ${this._renderTrash()}

        <h3>${p("share.library_header",void 0,this.hass)}</h3>
        <p class="hint">${p("share.library_hint",void 0,this.hass)}</p>
        ${this._renderLibrary()}

        <h3>${p("share.community_header",void 0,this.hass)}</h3>
        <p class="hint">${p("share.community_hint",void 0,this.hass)}</p>
        ${this._renderCommunity()} ${this._renderInstalled()}
        ${this._toolError?m`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:m``}
      </div>
    `}_renderCommunity(){const t=this._community,e=m`
      ${this._communityError?m`<ha-alert alert-type="warning">${this._communityError}</ha-alert>`:m``}
      ${this._communityError&&t?m`<p class="hint">
              ${p("share.community_showing_cached",{time:(t=>{var e,i;return new Date(t).toLocaleString(null===(i=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===i?void 0:i.language)})(t.fetched)},this.hass)}
            </p>`:m``}
    `;if(!t)return m`
        <div class="library">
          ${e}
          <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!1)}}>
            ${p(this._communityLoading?"share.community_loading":"share.community_load",void 0,this.hass)}
          </ha-button>
        </div>
      `;const i=this._communityExisting(),s=t.entries.find(t=>t.id===this._communitySelected),n=s?`community:${s.id}:${s.updated}`:"",a=!!s&&this._installPending===n,o=s&&i.includes(s.name)?Ze(s.name,i):void 0,r=s?function(t,e){const i=new Set,s=new Set;for(const n of[t.template,...Object.values(t.includes)]){const t=Be(n);t.customTypes.forEach(t=>i.add(t)),t.templateRefs.forEach(t=>s.add(t))}return{customTypes:[...i].sort(),templates:[...s].filter(i=>i!==t.name&&!(i in t.includes)&&!e.includes(i)).sort()}}(s,i):void 0,l=s?Object.keys(s.includes).filter(t=>!i.includes(t)):[],c=s?eo(s):void 0,h=void 0!==this._communityKnown;return m`
      <div class="library">
        ${e}
        ${t.entries.length?m`<ha-form
                .hass=${this.hass}
                .data=${{entry:s?String(s.id):""}}
                .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:t.entries.map(t=>({value:String(t.id),label:p("share.community_by",{title:t.title,author:t.author},this.hass)}))}}}]}
                .computeLabel=${()=>p("share.community_pick",void 0,this.hass)}
                @value-changed=${this._communityPicked}
              ></ha-form>`:m`<p class="hint">${p("share.community_none",void 0,this.hass)}</p>`}
        ${s&&r?m`
                <p class="hint">
                  ${"string"==typeof s.template.description?s.template.description:""}
                  <a href=${s.url} target="_blank" rel="noopener noreferrer"
                    >${p("share.community_open",void 0,this.hass)}</a
                  >
                </p>
                ${l.length?m`<p class="hint">
                        ${p("share.library_needs",{names:l.join(", ")},this.hass)}
                      </p>`:m``}
                ${this._renderMissingCards([s.template,...Object.values(s.includes)])}
                ${r.templates.length?m`<ha-alert alert-type="warning">
                        ${p("share.community_needs_templates",{names:r.templates.join(", ")},this.hass)}
                      </ha-alert>`:m``}
                ${c&&bi(c)?this._renderRisks(c,"share.community_risks"):m``}
                <ha-expansion-panel outlined expanded>
                  <span slot="header">${p("share.library_preview",void 0,this.hass)}</span>
                  ${ji(`${s.id}:${s.updated}`,m`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${Object.assign(Object.assign({template:s.name},s.template),Object.keys(s.includes).length?{includes:s.includes}:{})}
                      read-only
                    ></ha-yaml-editor>`)}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{where:this._libraryDestination}}
                  .schema=${[{name:"where",selector:{select:{mode:"dropdown",options:[{value:"view",label:p("share.library_where_view",void 0,this.hass)},{value:"root",label:p("share.library_where_root",void 0,this.hass)}]}}}]}
                  .computeLabel=${()=>p("share.library_where",void 0,this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                ${this._communityKnownFailed?m`<ha-alert alert-type="error">
                        ${p("share.community_names_failed",void 0,this.hass)}
                      </ha-alert>`:m``}
                <ha-button .disabled=${this._busy||!h} @click=${()=>{this._installShared(s)}}>
                  ${h||this._communityKnownFailed?a?p("share.install_anyway",void 0,this.hass):o?p("share.community_install_as",{name:o},this.hass):p("share.install",void 0,this.hass):p("share.community_names_loading",void 0,this.hass)}
                </ha-button>
              `:m``}
        <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!0)}}>
          ${p(this._communityLoading?"share.community_loading":"share.community_refresh",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderRisks(t,e){return m`<ha-alert alert-type="warning" .title=${p(e,void 0,this.hass)}>
      <ul class="risks">
        ${t.actions.length?m`<li>${p("share.community_risk_actions",{list:t.actions.join(", ")},this.hass)}</li>`:m``}
        ${t.urls.length?m`<li>${p("share.community_risk_urls",{list:t.urls.join(", ")},this.hass)}</li>`:m``}
        ${t.embeds?m`<li>${p("share.community_risk_embeds",void 0,this.hass)}</li>`:m``}
        ${t.scripts?m`<li>${p("share.community_risk_scripts",void 0,this.hass)}</li>`:m``}
        ${t.placeholders?m`<li>${p("share.community_risk_placeholders",void 0,this.hass)}</li>`:m``}
        ${t.overlay?m`<li>${p("share.community_risk_overlay",void 0,this.hass)}</li>`:m``}
      </ul>
    </ha-alert>`}async _loadCommunity(t){var e,i;this._communityLoading=!0,this._communityError=void 0,this._installPending=void 0,this._communityKnown=void 0,this._communityKnownFailed=!1;try{this._community=await ao({refresh:t})}catch(s){const t=s;t.cached&&(this._community=t.cached),this._communityError=t.retryAt?p("share.community_rate_limited",{time:new Date(t.retryAt).toLocaleTimeString(null===(i=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===i?void 0:i.language)},this.hass):p("share.community_failed",{message:t.message},this.hass)}finally{this._communityLoading=!1}this._community&&this._loadCommunityKnown()}_communityExisting(){var t;const e=Object.keys(d(this._savedLovelace));return[...new Set([...e,...null!==(t=this._communityKnown)&&void 0!==t?t:[]])]}async _loadCommunityKnown(){try{const t=await pt(this.hass,this._savedLovelace);this._communityKnown=Object.keys(t)}catch(t){this._communityKnownFailed=!0}}_communityPicked(t){t.stopPropagation();const e=Number(t.detail.value.entry);this._communitySelected=Number.isFinite(e)&&e>0?e:void 0,this._installPending=void 0}async _installShared(t){var e,i,s,n,a;if(void 0===this._communityKnown)return;const o=`community:${t.id}:${t.updated}`;if(this._installPending!==o)return this._installPending=o,void(this._installArmedAt=Date.now());if(Date.now()-this._installArmedAt<$i)return;const r=L(),l=this._communityExisting(),c=l.includes(t.name)?Ze(t.name,l):t.name,h=[...Object.entries(t.includes).filter(([t])=>!l.includes(t)).map(([e,i])=>[e,ro(i,oo(t,e))]),[c,ro(t.template,oo(t,t.name))]],d=U(null!==(e=null==r?void 0:r.config)&&void 0!==e?e:this.lovelace,null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""),u=null!==(a=null===(n=null==d?void 0:d.view)||void 0===n?void 0:n.index)&&void 0!==a?a:0;await this._saveDashboard(t=>h.reduce((t,[e,i])=>"root"===this._libraryDestination?Ft(t,e,i):Lt(t,u,Object.assign({type:vt,template:e},i,{type:vt,template:e})),t),"community_install")&&(this._installPending=void 0)}_renderMissingCards(t){const e=function(t,e){const i=new Set;for(const s of t)for(const t of Be(s).customTypes){const s=t.slice(7);s&&!e(s)&&i.add(s)}return[...i].sort()}(t.filter(t=>void 0!==t),yi);return e.length?m`<ha-alert alert-type="warning">
      ${p(1===e.length?"share.missing_card_one":"share.missing_card_many",{cards:e.join(", ")},this.hass)}
    </ha-alert>`:m``}_renderInstalled(){var t;const e=Mt(this._savedLovelace);if(!e.length)return m``;const i=new Map((null!==(t=this._updates)&&void 0!==t?t:[]).map(t=>[t.name,t]));return m`
      <h3>${p("share.installed_header",void 0,this.hass)}</h3>
      <p class="hint">${p("share.installed_hint",void 0,this.hass)}</p>
      ${this._updatesError?m`<ha-alert alert-type="warning">${this._updatesError}</ha-alert>`:m``}
      <ul class="installed">
        ${e.map(({name:t,source:e,template:s})=>{var n,a;const o=i.get(t);return m`<li>
            ${t} —
            <a
              href=${null!==(a=null===(n=null==o?void 0:o.entry)||void 0===n?void 0:n.url)&&void 0!==a?a:`https://github.com/${Sa}/discussions/${e.discussion}`}
              target="_blank"
              rel="noopener noreferrer"
              >${p("share.installed_from",{discussion:e.discussion},this.hass)}</a
            >
            ${o?m`<span class="status"
                    >${p(`share.installed_status_${o.status}`,void 0,this.hass)}</span
                  >`:m``}
            ${"update"===(null==o?void 0:o.status)&&o.latest?this._renderUpdate(t,s,o):m``}
          </li>`})}
      </ul>
      <ha-button .disabled=${this._updatesLoading} @click=${()=>{this._checkUpdates()}}>
        ${p(this._updatesLoading?"share.community_loading":"share.installed_check",void 0,this.hass)}
      </ha-button>
    `}_renderUpdate(t,e,i){const s=i.latest,n=t=>{const e=Object.assign({},t);return delete e.source,delete e.type,delete e.template,e},a=n(e),o=n(s),r=eo({template:o,includes:{}}),l=function(t,e){return{actions:t.actions.filter(t=>!e.actions.includes(t)),urls:t.urls.filter(t=>!e.urls.includes(t)),embeds:t.embeds&&!e.embeds,scripts:t.scripts&&!e.scripts,placeholders:t.placeholders&&!e.placeholders,overlay:t.overlay&&!e.overlay}}(r,eo({template:a,includes:{}})),c=this._updatePending===t;return m`
      <p class="hint">${p("share.installed_compare",void 0,this.hass)}</p>
      ${go(a,o,this.hass)} ${this._renderMissingCards([s])}
      ${bi(l)?this._renderRisks(l,"share.installed_risks_new"):bi(r)?this._renderRisks(r,"share.installed_risks"):m``}
      ${c?m`<ha-alert alert-type="warning">
              ${p("share.installed_update_confirm",{name:t},this.hass)}
            </ha-alert>`:m``}
      <ha-button .disabled=${this._busy} @click=${()=>{this._updateShared(t,s)}}>
        ${p(c?"share.installed_update_anyway":"share.installed_update",void 0,this.hass)}
      </ha-button>
    `}async _checkUpdates(){var t,e;this._updatesLoading=!0,this._updatesError=void 0,this._updatePending=void 0;const i=Mt(this._savedLovelace);try{this._updates=lo(i,await ao({refresh:!0}))}catch(s){const i=s;this._updatesError=i.retryAt?p("share.community_rate_limited",{time:new Date(i.retryAt).toLocaleTimeString(null===(e=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===e?void 0:e.language)},this.hass):p("share.community_failed",{message:i.message},this.hass)}finally{this._updatesLoading=!1}}async _updateShared(t,e){var i,s;if(this._updatePending!==t)return this._updatePending=t,void(this._updateArmedAt=Date.now());if(Date.now()-this._updateArmedAt<$i)return;await this._saveDashboard(i=>Dt(i,t,e),"shared_update")&&(this._updatePending=void 0,this._updates=null===(i=this._updates)||void 0===i?void 0:i.map(e=>e.name===t?Object.assign(Object.assign({},e),{status:"current"}):e),(null===(s=this._config)||void 0===s?void 0:s.template)===t&&this._fireConfigChanged(Object.assign(Object.assign({},e),{type:this._config.type,template:t})))}_renderLibrary(){var t;const e=Object.keys(d(this._savedLovelace)),i=this._librarySelected?Ei(this._librarySelected):void 0,s=!!i&&e.includes(i.name),n=!!i&&this._installPending===i.name,a=i?Ti(i,e):[];return m`
      <div class="library">
        <ha-form
          .hass=${this.hass}
          .data=${{entry:null!==(t=this._librarySelected)&&void 0!==t?t:""}}
          .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:Ci.map(t=>({value:t.name,label:t.name}))}}}]}
          .computeLabel=${()=>p("share.library_pick",void 0,this.hass)}
          @value-changed=${this._libraryPicked}
        ></ha-form>
        ${i?m`
                <p class="hint">${p(`library.${i.name}.summary`,void 0,this.hass)}</p>
                ${a.length?m`<p class="hint">
                        ${p("share.library_needs",{names:a.join(", ")},this.hass)}
                      </p>`:m``}
                ${this._renderMissingCards([i,...a.map(t=>Ei(t))].map(t=>null==t?void 0:t.template))}
                <ha-expansion-panel outlined>
                  <span slot="header">${p("share.library_preview",void 0,this.hass)}</span>
                  ${ji(i.name,m`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${i.template}
                      read-only
                    ></ha-yaml-editor>`)}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{where:this._libraryDestination}}
                  .schema=${[{name:"where",selector:{select:{mode:"dropdown",options:[{value:"view",label:p("share.library_where_view",void 0,this.hass)},{value:"root",label:p("share.library_where_root",void 0,this.hass)}]}}}]}
                  .computeLabel=${()=>p("share.library_where",void 0,this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                <ha-button .disabled=${this._busy||s} @click=${()=>{this._install(i.name)}}>
                  ${p(s?"share.already_here":n?"share.install_anyway":"share.install",void 0,this.hass)}
                </ha-button>
              `:m``}
      </div>
    `}_libraryDestinationPicked(t){t.stopPropagation();const e=t.detail.value.where;this._libraryDestination="root"===e?"root":"view"}_libraryPicked(t){t.stopPropagation(),this._librarySelected=t.detail.value.entry||void 0,this._installPending=void 0}async _install(t){var e,i,s,n,a,o;const r=Ei(t);if(!r)return;if(this._installPending!==t)return void(this._installPending=t);const l=L(),c=Object.keys(d(null!==(e=null==l?void 0:l.config)&&void 0!==e?e:this._savedLovelace)),h=[...Ti(r,c),r.name].filter(t=>!c.includes(t)),u=U(null!==(i=null==l?void 0:l.config)&&void 0!==i?i:this.lovelace,null!==(n=null===(s=this._config)||void 0===s?void 0:s.template)&&void 0!==n?n:""),p=null!==(o=null===(a=null==u?void 0:u.view)||void 0===a?void 0:a.index)&&void 0!==o?o:0;await this._saveDashboard(t=>h.reduce((t,e)=>{const i=Ei(e);if(!i)return t;const s=Object.assign(Object.assign({},i.template),{source:Ni(i.name,Ht)});return"root"===this._libraryDestination?Ft(t,i.name,s):Lt(t,p,Object.assign({type:vt,template:i.name},s))},t),"library_install")&&(this._installPending=void 0)}async _copyExport(){const t=this.renderRoot.querySelector("#export"),e=null==t?void 0:t.yaml;if(!e)return;const{notes:i}=Ye(this._config),s=[...i.map(t=>`# ${t}`),e].join("\n");this._copyState=await Rt(s)?"done":"failed",setTimeout(()=>this._copyState="",3e3)}async _copyPost(){var t,e;const i=null===(t=this.renderRoot.querySelector("#export"))||void 0===t?void 0:t.yaml;if(!i)return;const{notes:s}=Ye(this._config,d(this._savedLovelace));this._postCopyState=await Rt(function(t,e,i){return[...[i,...e].filter(t=>"string"==typeof t&&t.trim()),"```yaml\n"+t.replace(/\n*$/,"")+"\n```"].join("\n\n")+"\n"}(i,s,null===(e=this._config)||void 0===e?void 0:e.description))?"done":"failed",setTimeout(()=>this._postCopyState="",3e3)}_downloadExport(){var t,e,i;const s=null===(t=this.renderRoot.querySelector("#export"))||void 0===t?void 0:t.yaml;if(!s)return;const{notes:n}=Ye(this._config),a=[...n.map(t=>`# ${t}`),s].join("\n"),o=document.createElement("a");o.href=URL.createObjectURL(new Blob([a],{type:"text/yaml"})),o.download=`${(null!==(i=null===(e=this._config)||void 0===e?void 0:e.template)&&void 0!==i?i:"template").replace(/[^\w-]+/g,"_")}.yaml`,o.click(),setTimeout(()=>URL.revokeObjectURL(o.href),1e3)}async _importFile(t){var e,i,s;const n=t.target,a=null===(e=n.files)||void 0===e?void 0:e[0];if(n.value="",!a)return;const o=await a.text(),r=null===(s=null===(i=this.renderRoot.querySelector("#import"))||void 0===i?void 0:i.shadowRoot)||void 0===s?void 0:s.querySelector("ha-code-editor");r?(r.value=o,r.dispatchEvent(new CustomEvent("value-changed",{detail:{value:o}}))):this._importErrors=[p("share.import_not_yaml",void 0,this.hass)]}_renderTrash(){if(void 0===this._trash)return this._loadTrash(),m``;const t=t=>{var e,i;return new Date(t).toLocaleString(null===(i=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===i?void 0:i.language)};return m`
      <h3>${p("share.trash_header",void 0,this.hass)}</h3>
      <p class="hint">${p("share.trash_hint",void 0,this.hass)}</p>
      ${this._trash.length?m`<ul class="installed trash">
              ${this._trash.map((e,i)=>m`
                  <li>
                    <strong>${e.name}</strong>
                    <div class="status">
                      ${p("removed"===e.reason?"share.trash_removed":"share.trash_replaced",{when:t(e.at),dashboard:e.dashboard},this.hass)}
                    </div>
                    ${this._trashPending===i?m`<ha-alert alert-type="warning">
                            ${p("share.trash_clash",{name:e.name},this.hass)}
                          </ha-alert>`:m``}
                    <ha-button .disabled=${this._busy} @click=${()=>this._restore(e,i)}>
                      ${p(this._trashPending===i?"share.trash_restore_anyway":"share.trash_restore",void 0,this.hass)}
                    </ha-button>
                    <ha-button
                      @click=${()=>{this._trashShown=this._trashShown===i?void 0:i}}
                    >
                      ${p(this._trashShown===i?"share.trash_hide":"share.trash_show",void 0,this.hass)}
                    </ha-button>
                    <ha-button .disabled=${this._busy} @click=${()=>this._forget(e)}>
                      ${p("share.trash_forget",void 0,this.hass)}
                    </ha-button>
                    ${this._trashShown===i?m`<ha-yaml-editor
                            .hass=${this.hass}
                            .defaultValue=${e.template}
                            read-only
                          ></ha-yaml-editor>`:m``}
                  </li>
                `)}
            </ul>`:m`<p class="hint">${p("share.trash_empty",void 0,this.hass)}</p>`}
    `}async _restore(t,e){var i,s;if(!this.hass)return;const n=Vt(this.hass);let a;try{a=await zt(n,t.dashboard)}catch(r){return void(this._toolError=p("tools.save_failed",{message:null!==(i=null==r?void 0:r.message)&&void 0!==i?i:r},this.hass))}const o=t.name in d(a);if(o&&this._trashPending!==e)return this._trashPending=e,void(this._trashArmedAt=Date.now());if(!(o&&Date.now()-this._trashArmedAt<$i)){this._busy=!0,this._toolError=void 0;try{await D(this,this.hass,"restore",[{urlPath:t.dashboard,build:e=>qt(e,t)}]),this._trashPending=void 0,this._trashShown=void 0,await this._forget(t)}catch(r){this._toolError=p("tools.save_failed",{message:null!==(s=null==r?void 0:r.message)&&void 0!==s?s:r},this.hass)}finally{this._busy=!1}}}async _forget(t){if(!this.hass)return;const e=Ut(await It(this.hass),t);await Kt(this.hass,e),this._trash=e,this._trashPending=void 0}_importChanged(t){t.stopPropagation(),this._importValue=t.detail.value,this._importParses=!1!==t.detail.isValid,this._importErrors=[],this._importClash=void 0,this._importRisks=void 0}_import(){if(!this._config)return;if(!this._importParses)return void(this._importErrors=[p("share.import_not_yaml",void 0,this.hass)]);if(!Ca(this._importValue))return void(this._importErrors=[p("share.import_too_big",void 0,this.hass)]);const t=Qe(this._importValue);if(!t.ok)return this._importErrors=t.errors,void(this._importClash=void 0);this._importErrors=[];const e=this._importValue.template,i=d(this._savedLovelace),s=e!==this._config.template&&e in i?e:void 0,n=eo({template:this._importValue,includes:{}});if(s&&!this._importClash||bi(n)&&!this._importRisks)return this._importClash=s,this._importRisks=bi(n)?n:void 0,void(this._importArmedAt=Date.now());Date.now()-this._importArmedAt<$i||this._applyImport(e)}_importAsCopy(){if(!this._config||!this._importParses)return;if(Date.now()-this._importArmedAt<$i)return;const t=Object.keys(d(this._savedLovelace));this._applyImport(Ze(this._importValue.template,t))}_applyImport(t){var e;const i=function(t){const e=Ge(t);if((null==e?void 0:e.includes)&&"object"==typeof e.includes&&!Array.isArray(e.includes)){const t={};for(const[i,s]of Object.entries(e.includes))t[i]=Ge(s);e.includes=t}return e}(this._importValue),s=i.includes;if(s&&"object"==typeof s&&!Array.isArray(s)){const t=Object.keys(d(this._savedLovelace)),e=Object.entries(s).filter(([e])=>!t.includes(e));e.length&&this._saveDashboard(t=>e.reduce((t,[e,i])=>Ft(t,e,i),t),"import",this._config)}const n=Object.assign(Object.assign({},i),{template:t,type:null===(e=this._config)||void 0===e?void 0:e.type});delete n.includes,this._fireConfigChanged(n),this._importClash=void 0,this._importRisks=void 0,this.dispatchEvent(new CustomEvent("select-tab",{detail:"settings",bubbles:!0,composed:!0}))}}t([i({attribute:!1})],_o.prototype,"hass",void 0),t([i({attribute:!1})],_o.prototype,"lovelace",void 0),t([i({attribute:!1})],_o.prototype,"config",void 0),t([e()],_o.prototype,"_importErrors",void 0),t([e()],_o.prototype,"_importClash",void 0),t([e()],_o.prototype,"_importRisks",void 0),t([e()],_o.prototype,"_copyState",void 0),t([e()],_o.prototype,"_toolError",void 0),t([e()],_o.prototype,"_busy",void 0),t([e()],_o.prototype,"_installPending",void 0),t([e()],_o.prototype,"_librarySelected",void 0),t([e()],_o.prototype,"_libraryDestination",void 0),t([e()],_o.prototype,"_community",void 0),t([e()],_o.prototype,"_communityLoading",void 0),t([e()],_o.prototype,"_communityError",void 0),t([e()],_o.prototype,"_communitySelected",void 0),t([e()],_o.prototype,"_communityKnown",void 0),t([e()],_o.prototype,"_communityKnownFailed",void 0),t([e()],_o.prototype,"_postCopyState",void 0),t([e()],_o.prototype,"_updates",void 0),t([e()],_o.prototype,"_updatesLoading",void 0),t([e()],_o.prototype,"_updatesError",void 0),t([e()],_o.prototype,"_updatePending",void 0),t([e()],_o.prototype,"_trash",void 0),t([e()],_o.prototype,"_trashShown",void 0),t([e()],_o.prototype,"_trashPending",void 0),customElements.get("decluttering-template-share-tab")||customElements.define("decluttering-template-share-tab",_o);const vo=["card","badge","row","element"];function yo(t,e,i=[]){if(Array.isArray(t))t.forEach((t,s)=>yo(t,`${e}[${s}]`,i));else if(t&&"object"==typeof t)for(const[s,n]of Object.entries(t))yo(n,e?`${e}.${s}`:s,i);else null!=t&&i.push({path:e,value:String(t)});return i}const bo=["grid_options","visibility","view_layout","layout_options"];function $o(t){const e={};for(const[i,s]of Object.entries(null!=t?t:{}))bo.includes(i)||(e[i]=s);return e}function wo(t){if(Array.isArray(t))return t.map(wo);if(t&&"object"==typeof t){const e={};for(const i of Object.keys(t).sort())e[i]=wo(t[i]);return e}return 0}function xo(t,e=[],i=[]){if(Array.isArray(t))t.forEach((t,s)=>xo(t,[...e,s],i));else if(t&&"object"==typeof t)for(const[s,n]of Object.entries(t))xo(n,[...e,s],i);else i.push({path:e,value:t});return i}function ko(t,e){return e.reduce((t,e)=>null==t?void 0:t[e],t)}function So(t){const e=new Map;t.forEach((t,i)=>{var s;if(!t||"object"!=typeof t||"string"!=typeof t.type)return;const n=$o(t);if(JSON.stringify(n).includes("[["))return;const a=JSON.stringify([t.type,wo(n)]);e.set(a,[...null!==(s=e.get(a))&&void 0!==s?s:[],i])});const i=[];for(const[s,n]of e){if(n.length<2)continue;const e=n.map(e=>$o(t[e])),a=xo(e[0]).map(t=>t.path).filter(t=>e.some(i=>JSON.stringify(ko(i,t))!==JSON.stringify(ko(e[0],t))));!a.length||a.length>8||i.push({indices:n,type:t[n[0]].type,differing:a,key:s})}return i.sort((t,e)=>e.indices.length-t.indices.length||t.indices[0]-e.indices[0])}const Ao=t=>t.replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value";function jo(t){const e=t[t.length-1];if("string"==typeof e)return Ao(e);const i=[...t].reverse().find(t=>"string"==typeof t);return Ao(`${null!=i?i:"item"}_${e+1}`)}function Oo(t){const e=t.map(jo),i=[];return t.forEach((t,s)=>{const n=(a=e[s],e.filter(t=>t===a).length>1?function(t){return Ao(t.map(t=>"number"==typeof t?String(t+1):t).join("_"))}(t):e[s]);var a;i.push(Ze(n,i))}),i}function Co(t){var e;const i=t.map($o),s=null!==(e=i[0])&&void 0!==e?e:{},n=xo(s).map(t=>t.path).filter(t=>i.some(e=>JSON.stringify(ko(e,t))!==JSON.stringify(ko(s,t)))),a=Oo(n),o=JSON.parse(JSON.stringify(s));return n.forEach((t,e)=>{ko(o,t.slice(0,-1))[t[t.length-1]]=`[[${a[e]}]]`}),{template:{card:o},names:a,variables:i.map(t=>n.map((e,i)=>({[a[i]]:ko(t,e)}))),layout:t.map(t=>{const e={};for(const i of bo)void 0!==(null==t?void 0:t[i])&&(e[i]=t[i]);return e})}}function Eo(t,e,i){return Object.assign({type:"custom:decluttering-card-plus",template:t,variables:e},i)}const To="_";function No(t){let e="string"==typeof t?t:JSON.stringify(t);if("string"!=typeof e||!e.includes("[["))return[];const i=new Set;for(let s=0;s<5;s+=1){let t=!1;if(e=e.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(e,s)=>{if(t=!0,s.startsWith(St))return To;const n=s.endsWith("?")?s.slice(0,-1):s,[a,...o]=n.split("|"),r=a.endsWith("?")?a.slice(0,-1):a;for(const t of[r,r.split(".")[0]])t&&t!==To&&i.add(t);for(const t of o){const e=t.startsWith("or:")?t.slice(3):Ot(t);e&&e!==To&&i.add(e)}return To}),!t)break}return[...i]}function Po(t,e=[]){if(Array.isArray(t)){for(const i of t)Po(i,e);return e}if(!t||"object"!=typeof t)return e;bt.includes(t.type)&&!0===t[Zt]&&"string"==typeof t.template&&e.push(t.template);for(const i of Object.values(t))Po(i,e);return e}function Io(t,e,i=new Set){const s=new Set;if(!t)return{names:s,complete:!0};Gt in t&&(t=Object.assign(Object.assign({},t),{default:t[Gt]}));for(const a of f(t))s.add(a.name);for(const a of at(gt(t))){const t=S(a);void 0!==t&&s.add(t)}for(const a of No(t))s.add(a);let n=!0;for(const a of Po(t)){if(i.has(a))continue;if(i.add(a),!Object.prototype.hasOwnProperty.call(e,a)){n=!1;continue}const t=Io(e[a],e,i);for(const e of t.names)s.add(e);t.complete||(n=!1)}return{names:s,complete:n}}function Fo(t,e){const i=new Map,s=(t,e,s,n)=>{const a=JSON.stringify([t.index,e,n.name,s]),o=i.get(a);o?(o.count+=1,!o.closest&&n.closest&&(o.closest=n.closest)):i.set(a,Object.assign(Object.assign({view:t,template:e,name:n.name},n.closest?{closest:n.closest}:{}),{where:s,count:1}))},n=(t,i,a)=>{var o,r;if(Array.isArray(t))for(const e of t)n(e,i,a);else if(t&&"object"==typeof t){if(bt.includes(t.type)&&"string"==typeof t.template){const n=Object.prototype.hasOwnProperty.call(e,t.template)?e[t.template]:void 0;if(n){const l=new Set,c=(o,r)=>{for(const c of function(t,e,i,s={lets:[],defaults:[]},n){if(!t)return[];const{names:a,complete:o}=Io(t,e);if(!o)return[];const r=new Set([...at(t.let),...s.lets].map(S).filter(t=>void 0!==t)),l=$(i),c=new Set(a);for(const g of No(n))c.add(g);for(const g of[...s.lets,...s.defaults]){const t=S(g);if(void 0!==t)for(const e of No(g[t]))c.add(e)}const h=t=>!r.has(t)&&(c.has(t)||c.has(t.split(".")[0]));let d=!0;const u=new Set;for(;d;){d=!1;for(const t of l){const e=S(t);if(!u.has(e)&&h(e)){u.add(e);for(const i of No(t[e]))c.has(i)||(c.add(i),d=!0)}}}const p=new Set(l.map(t=>S(t))),m=[...c].filter(t=>!p.has(t)&&!r.has(t)),f=[];for(const g of p){if(h(g))continue;const t=kt(g,m);f.push(t?{name:g,closest:t}:{name:g})}return f}(n,e,r,a,[t.on_error,t.for_each_from]))l.has(c.name)||(l.add(c.name),s(i,t.template,o,c))};c("variables",t.variables);for(const e of null!==(o=A(t.for_each))&&void 0!==o?o:[])c("for_each",e);const h=null===(r=t.for_each_from)||void 0===r?void 0:r.overrides;if(h&&"object"==typeof h)for(const t of Object.values(h))c("overrides",t)}}for(const e of Object.values(t))n(e,i,a)}};return Bt(t,(e,i,s)=>{var a,o,r;const l=t.views[i];n(e,{title:null!==(o=null!==(a=null==l?void 0:l.title)&&void 0!==a?a:null==l?void 0:l.path)&&void 0!==o?o:"",path:null!==(r=null==l?void 0:l.path)&&void 0!==r?r:"",index:i},Yt(t,i,s))}),[...i.values()].map(({view:t,template:e,name:i,closest:s,where:n,count:a})=>s?{view:t,template:e,name:i,closest:s,where:n,count:a}:{view:t,template:e,name:i,where:n,count:a})}function Lo(t,e,i){if(!t.includes("[["))return t;const s=t.replace(/\[\[([^[\]]+)\]\]/g,(t,s)=>s.startsWith(St)?t:`[[${function(t,e,i){const s=t.endsWith("?"),n=(s?t.slice(0,-1):t).split("|"),a=n[0],o=a.endsWith("?"),r=o?a.slice(0,-1):a;(r===e||r.startsWith(`${e}.`))&&(n[0]=`${i}${r.slice(e.length)}${o?"?":""}`);for(let l=1;l<n.length;l+=1){const t=n[l];if(t===`or:${e}`)n[l]=`or:${i}`;else if(Ot(t)===e){const s=t.startsWith("if:!")?"!":"";n[l]=`if:${s}${i}${t.slice(3+s.length+e.length)}`}}return`${n.join("|")}${s?"?":""}`}(s,e,i)}]]`);return s.replace(new RegExp(`\\[\\[${n=e,n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=\\.\\[\\[)`,"g"),`[[${i}`);var n}function Mo(t,e,i){if("string"==typeof t)return Lo(t,e,i);if(Array.isArray(t))return t.map(t=>Mo(t,e,i));if(t&&"object"==typeof t){const s={};for(const[n,a]of Object.entries(t))s[Lo(n,e,i)]=Mo(a,e,i);return s}return t}function Do(t,e,i){const s=t=>!!t&&"object"==typeof t&&!Array.isArray(t),n=(t,e)=>s(t)&&Object.prototype.hasOwnProperty.call(t,e),a=t=>{if(!s(t))return t;const n={};for(const[s,a]of Object.entries(t))s!==i&&(n[s===e?i:s]=a);return n};return Array.isArray(t)?t.some(t=>n(t,e))?t.map(a).filter(t=>!s(t)||Object.keys(t).length>0):t:n(t,e)?a(t):t}function Ro(t,e,i){const s=Mo(t,e,i);return Array.isArray(s.variables)?s.variables=s.variables.map(t=>t&&"object"==typeof t&&t.name===e?Object.assign(Object.assign({},t),{name:i}):t):s.variables&&"object"==typeof s.variables&&(s.variables=Do(s.variables,e,i)),void 0!==s.default&&(s.default=Do(s.default,e,i)),void 0!==s.defaults&&(s.defaults=Do(s.defaults,e,i)),void 0!==s.let&&(s.let=Do(s.let,e,i)),s}function Vo(t){const e=null==t?void 0:t.extends;return(Array.isArray(e)?e:[e]).filter(t=>"string"==typeof t)}function zo(t,e,i){const s=Wt(t),n=new Set([e]);for(const o of null!=i?i:[])Object.prototype.hasOwnProperty.call(s,o)||n.add(o);let a=!0;for(;a;){a=!1;for(const[t,e]of Object.entries(s))!n.has(t)&&Vo(e).some(t=>n.has(t))&&(n.add(t),a=!0)}return n}function qo(t){if(!t)return[];const e=new Set(gi(t));for(const i of No(t))i.includes(".")||"_"===i||e.add(i);return[...e].sort()}function Uo(t,e,i,s,n){const a=zo(t,e,n);let o=0,r=0;const l=(t,e)=>JSON.stringify(t)!==JSON.stringify(e),c=t=>{if(Array.isArray(t))return t.map(c);if(!t||"object"!=typeof t)return t;let e={};for(const[i,s]of Object.entries(t))e[i]=c(s);if(bt.includes(t.type)&&a.has(t.template)){const t=function(t,e,i){var s;const n=Object.assign({},t);void 0!==n.variables&&(n.variables=Do(n.variables,e,i)),Array.isArray(n.for_each)?n.for_each=n.for_each.map(t=>Do(t,e,i)):void 0!==n.for_each&&(n.for_each=Do(n.for_each,e,i));const a=null===(s=n.for_each_from)||void 0===s?void 0:s.overrides;if(a&&"object"==typeof a&&!Array.isArray(a)){const t={};for(const[s,n]of Object.entries(a))t[s]=Do(n,e,i);n.for_each_from=Object.assign(Object.assign({},n.for_each_from),{overrides:t})}return"string"==typeof n.name&&(n.name=Lo(n.name,e,i)),n}(e,i,s);l(t,e)&&(o+=1),e=t}if(Jt(t.type)&&a.has(t.template)){const t=Ro(e,i,s);l(t,e)&&(r+=1),e=t}return e},h=Object.assign({},t);Array.isArray(null==t?void 0:t.views)&&(h.views=c(t.views));const d=null==t?void 0:t.decluttering_templates;if(d&&"object"==typeof d){const t={};for(const[e,n]of Object.entries(d)){let o=c(n);if(a.has(e)){const t=Ro(o,i,s);l(t,o)&&(r+=1),o=t}t[e]=o}h.decluttering_templates=t}return{config:h,cards:o,templates:r}}function Ko(t,e,i){if(Object.prototype.hasOwnProperty.call(Wt(t),e))return!1;if(i===Qt)return!0;const s=Xt(t);return s.includes(i)||s.includes("*")}class Ho extends s{constructor(){super(...arguments),this._renameTo="",this._renaming=!1,this._duplicateTo="",this._busy=!1,this._modernisePending=!1,this._similarNames={},this._searchQuery="",this._searching=!1,this._varTo=""}get _config(){return this.config}get _savedLovelace(){var t,e,i;return null!==(i=null!==(e=null===(t=L())||void 0===t?void 0:t.config)&&void 0!==e?e:this.lovelace)&&void 0!==i?i:h()}static get styles(){return ki}_fireConfigChanged(t){w(this,"config-changed",{config:t})}_saveDashboard(t,e,i){return xi(this,t,e,i)}render(){return this.hass&&this._config?this._renderUsages():m``}_renderUsages(){var t,e;const i=null===(t=this._config)||void 0===t?void 0:t.template;if(!i)return m``;const s=this._savedLovelace;if(!s)return m`<div class="usages">
        <ha-alert alert-type="warning">${p("template_editor.usages_unreadable",void 0,this.hass)}</ha-alert>
      </div>`;(null===(e=this._usages)||void 0===e?void 0:e.name)===i&&this._usages.ll===s||(this._usages={name:i,ll:s,usages:te(s,i)});const{views:n,templates:a}=this._usages.usages,o=n.reduce((t,e)=>t+e.count,0),r=document.location.pathname.split("/").slice(0,2).join("/");return m`
      <div class="usages">
        ${0!==o||a.length?m`
                <p class="hint">
                  ${p(1===o?"template_editor.usages_one":"template_editor.usages_many",{total:o,name:i},this.hass)}
                </p>
                <ul>
                  ${n.map(t=>m`
                      <li>
                        <a href=${`${r}/${t.path||t.index}`} target="_blank" rel="noreferrer">
                          ${t.title||t.path||p("template_editor.untitled_view",void 0,this.hass)}
                        </a>
                        —
                        ${1===t.count?p("template_editor.used_once",void 0,this.hass):p("template_editor.used_times",{count:t.count},this.hass)}
                      </li>
                    `)}
                </ul>
              `:m`<ha-alert alert-type="info">
                ${p("template_editor.usages_none",{name:i},this.hass)}
              </ha-alert>`}
        ${a.length?m`<ha-alert alert-type="info">
                ${p(1===a.length?"template_editor.used_by_template":"template_editor.used_by_templates",{names:a.join(", ")},this.hass)}
              </ha-alert>`:m``}
        ${this._renderElsewhere(i)} ${this._renderImpact(s,i)}
        <decluttering-card-plus-health .hass=${this.hass} .lovelace=${s}
          >${this._renderUndo()}</decluttering-card-plus-health
        >
        ${this._renderSimilar(s)} ${this._renderSearch()} ${this._renderRename(i,o)}
        ${this._renderRenameVariable(i)} ${this._renderDuplicate(i)} ${this._renderModernise()}
        ${this._toolError?m`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:m``}
      </div>
    `}_renderUndo(){var t,e;const i=ee();if(!i)return m``;const s=ie(i.operation,this.hass),n=new Date(i.at).toLocaleTimeString(null===(e=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===e?void 0:e.language);return m`
      <div class="undo">
        <p class="hint">${p("undo.held",{operation:s,time:n},this.hass)}</p>
        ${this._undoChanged?m`<ha-alert alert-type="warning">
                ${p("undo.changed_here",{operation:s,dashboards:this._undoChanged.join(", ")},this.hass)}
              </ha-alert>`:m``}
        <ha-button .disabled=${this._busy} @click=${this._undo}>
          ${p(this._undoChanged?"undo.anyway_button":"undo.button",{operation:s},this.hass)}
        </ha-button>
      </div>
    `}async _undo(){const t=ee();if(t){this._busy=!0;try{const e=await se(this,this.hass,t,!!this._undoChanged,!1);this._undoChanged="changed"===(null==e?void 0:e.result)?e.dashboards:void 0}finally{this._busy=!1}}}_renderSimilar(t){var e;if((null===(e=this._similar)||void 0===e?void 0:e.ll)!==t){const e=ne(t);this._similar={ll:t,cards:e,groups:So(e.map(t=>t.config))}}const{cards:i,groups:s}=this._similar;if(!s.length)return m``;const n=Object.keys(d(t));return m`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${p(1===s.length?"tools.similar_header_one":"tools.similar_header",{count:s.length},this.hass)}
        </span>
        <p class="hint">${p("tools.similar_hint",{max:8},this.hass)}</p>
        ${s.slice(0,10).map(t=>this._renderSimilarGroup(t,i,n))}
      </ha-expansion-panel>
    `}_renderSimilarGroup(t,e,i){var s;const n=t.indices.map(t=>e[t]),a=Co(n.map(t=>t.config)),o=(null!==(s=this._similarNames[t.key])&&void 0!==s?s:function(t,e,i=[]){let s=Ao(t.replace(/^custom:/,"").replace(/-/g,"_")).toLowerCase();/(^|_)card$/.test(s)||(s=`${s}_card`);const n=new Set(i.map(t=>"string"==typeof(null==t?void 0:t.entity)&&t.entity.includes(".")?t.entity.split(".")[0]:"")),[a]=[...n];return 1===n.size&&a&&(s=`${Ao(a).toLowerCase()}_${s}`),Ze(s,e)}(t.type,i,n.map(t=>t.config))).trim(),r=this._similarPending===`${t.key}\0${o}`,l=i.includes(o);return m`
      <div class="similar">
        <h3>${p("tools.similar_group",{count:n.length,type:t.type},this.hass)}</h3>
        <p class="hint">${p("tools.similar_differ",{names:a.names.join(", ")},this.hass)}</p>
        <ul>
          ${n.slice(0,8).map(t=>m`<li>${t.label}</li>`)}
        </ul>
        ${n.length>8?m`<p class="hint">
                ${p("editor.matches_more",{count:n.length-8},this.hass)}
              </p>`:m``}
        ${l?m`<ha-alert alert-type="error">${p("tools.name_taken",{name:o},this.hass)}</ha-alert>`:m``}
        ${r?m`
                <ha-alert alert-type="warning">
                  ${p("tools.similar_confirm",{name:o,count:n.length},this.hass)}
                </ha-alert>
                <p class="hint">${p("tools.similar_template",{name:o},this.hass)}</p>
                ${ji(`${t.key}\0${o}`,m`<ha-yaml-editor
                    .hass=${this.hass}
                    .defaultValue=${{[o]:a.template}}
                    read-only
                  ></ha-yaml-editor>`)}
                <p class="hint">${p("tools.similar_first_card",void 0,this.hass)}</p>
                ${fo(n[0].config,Eo(o,a.variables[0],a.layout[0]),this.hass)}
              `:m``}
        ${wi({label:p("tools.similar_name",void 0,this.hass),value:o,disabled:this._busy,onInput:e=>{this._similarNames=Object.assign(Object.assign({},this._similarNames),{[t.key]:e}),this._similarPending=void 0}})}
        <ha-button
          .disabled=${this._busy||!o||l}
          @click=${()=>{this._makeTemplate(t,n,o)}}
        >
          ${p(r?"tools.similar_make_anyway":"tools.similar_make",void 0,this.hass)}
        </ha-button>
      </div>
    `}async _makeTemplate(t,e,i){const s=`${t.key}\0${i}`;if(this._similarPending!==s)return void(this._similarPending=s);const n=await this._saveDashboard(t=>function(t,e,i){const{template:s,variables:n,layout:a}=Co(e);let o=Ft(t,i,s);return e.forEach((t,e)=>{o=z(o,t,Eo(i,n[e],a[e]))}),o}(t,e.map(t=>t.config),i),"make_template");if(n){this._similarPending=void 0;const e=Object.assign({},this._similarNames);delete e[t.key],this._similarNames=e}}_renderElsewhere(t){var e;if((null===(e=this._remoteUsages)||void 0===e?void 0:e.name)!==t){this._remoteUsages={name:t,list:[]};const e=document.location.pathname.split("/").filter(Boolean)[0];ae(this.hass,t,e).then(e=>{var i;(null===(i=this._remoteUsages)||void 0===i?void 0:i.name)===t&&(this._remoteUsages={name:t,list:e})})}const i=this._remoteUsages.list;if(!i.length)return m``;const s=i.map(t=>`${t.urlPath} (${t.total})`).join(", ");return m`<ha-alert alert-type="info">
      ${p("template_editor.usages_elsewhere",{list:s},this.hass)}
    </ha-alert>`}_renderImpact(t,e){const i=oe(t,e);if(!i||!this._config)return m``;const s=t=>{if(t)return I(i.variables,t,E(t),e,this.hass,!0)};let n,a;try{n=s(d(t)[e]),a=s(d(t,void 0,this._config)[e])}catch(o){return m``}return m`
      <ha-expansion-panel outlined>
        <span slot="header">${p("template_editor.impact_header",void 0,this.hass)}</span>
        <p class="hint">${p("template_editor.impact_diff_hint",void 0,this.hass)}</p>
        ${go(n,a,this.hass)}
      </ha-expansion-panel>
    `}_renderRename(t,e){const i=this._renameTo.trim(),s=!!i&&this._renamePending===i,n=e?1===e?p("tools.rewrites_one",void 0,this.hass):p("tools.rewrites_many",{count:e},this.hass):"";return m`
      <div class="rename">
        <h3>${p("tools.rename_header",void 0,this.hass)}</h3>
        <p class="hint">${p("tools.rename_hint",void 0,this.hass)}</p>
        ${this._renameError?m`<ha-alert alert-type="error">${this._renameError}</ha-alert>`:m``}
        ${s?m`<ha-alert alert-type="warning">
                ${p("tools.rename_confirm",{from:t,to:i,rewrites:n},this.hass)}
              </ha-alert>`:m``}
        ${wi({label:p("tools.new_name",void 0,this.hass),value:this._renameTo,disabled:this._renaming,onInput:t=>this._renameChanged(t)})}
        <ha-button .disabled=${this._renaming||!i||i===t} @click=${this._rename}>
          ${s?p("tools.rename_anyway",void 0,this.hass):1===e?p("tools.rename_update_one",void 0,this.hass):e?p("tools.rename_update_many",{count:e},this.hass):p("tools.rename",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderModernise(){const t=this._savedLovelace,e=t?re(t):0;return e?m`
      <div class="rename">
        <h3>${p("tools.modernise_header",void 0,this.hass)}</h3>
        <p class="hint">
          ${p(1===e?"tools.modernise_hint_one":"tools.modernise_hint_many",{count:e},this.hass)}
        </p>
        ${this._modernisePending?m`<ha-alert alert-type="warning">
                ${p(1===e?"tools.modernise_confirm_one":"tools.modernise_confirm_many",{count:e},this.hass)}
              </ha-alert>`:m``}
        <ha-button .disabled=${this._busy} @click=${this._modernise}>
          ${p(this._modernisePending?"tools.modernise_anyway":1===e?"tools.modernise_one":"tools.modernise_many",void 0,this.hass)}
        </ha-button>
      </div>
    `:m``}async _modernise(){if(!this._modernisePending)return void(this._modernisePending=!0);await this._saveDashboard(t=>le(t),"modernise")&&(this._modernisePending=!1)}_renameChanged(t){this._renameTo=t,this._renameError=void 0,this._renamePending=void 0}async _rename(){var t,e;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._renameTo.trim();if(!i||!s||s===i)return;const n=L();if(n)if(void 0===d(n.config)[s])if(this._renamePending===s){this._renaming=!0,this._renameError=void 0;try{await D(this,this.hass,"rename_template",[{urlPath:V(),build:t=>ce(t,i,s)}],this._config),this._undoChanged=void 0,this._fireConfigChanged(Object.assign(Object.assign({},this._config),{template:s})),this._renameTo="",this._renamePending=void 0}catch(a){this._renameError=p("tools.save_failed",{message:null!==(e=null==a?void 0:a.message)&&void 0!==e?e:a},this.hass)}finally{this._renaming=!1}}else this._renamePending=s;else this._renameError=p("tools.name_taken",{name:s},this.hass);else this._renameError=p("tools.cannot_rename_here",void 0,this.hass)}_renderSearch(){const t=this._searchQuery.trim(),e=this._searchResult,i=t=>"variables"===t.where?"":p(`tools.search_in_${t.where}`,void 0,this.hass),s=t=>t.view.title||t.view.path||p("template_editor.untitled_view",void 0,this.hass);return m`
      <div class="rename">
        <h3>${p("tools.search_header",void 0,this.hass)}</h3>
        <p class="hint">${p("tools.search_hint",void 0,this.hass)}</p>
        ${wi({label:p("tools.search_label",void 0,this.hass),value:this._searchQuery,onInput:t=>{this._searchQuery=t},onKeydown:t=>{"Enter"===t.key&&this._search()}})}
        <ha-button .disabled=${this._searching||!t} @click=${()=>{this._search()}}>
          ${p(this._searching?"tools.searching":"tools.search",void 0,this.hass)}
        </ha-button>
        ${!e||e.cards.length||e.templates.length?m``:m`<p class="hint">${p("tools.search_none",{query:e.query},this.hass)}</p>`}
        ${(null==e?void 0:e.cards.length)?m`
                <p class="hint">${p("tools.search_cards",{count:e.cards.length},this.hass)}</p>
                <ul>
                  ${e.cards.slice(0,vi).map(t=>m`
                      <li>
                        <a
                          href=${`/${t.urlPath}/${t.view.path||t.view.index}`}
                          target="_blank"
                          rel="noreferrer"
                          >${t.urlPath} › ${s(t)}</a
                        >
                        — ${t.template}: <code>${t.variable}</code> = ${t.value}${i(t)}
                      </li>
                    `)}
                </ul>
                ${e.cards.length>vi?m`<p class="hint">
                        ${p("editor.matches_more",{count:e.cards.length-vi},this.hass)}
                      </p>`:m``}
              `:m``}
        ${(null==e?void 0:e.templates.length)?m`
                <p class="hint">${p("tools.search_templates",{count:e.templates.length},this.hass)}</p>
                <ul>
                  ${e.templates.slice(0,vi).map(t=>m`<li>
                          ${t.urlPath} › ${t.template}: <code>${t.path}</code> = ${t.value}
                        </li>`)}
                </ul>
                ${e.templates.length>vi?m`<p class="hint">
                        ${p("editor.matches_more",{count:e.templates.length-vi},this.hass)}
                      </p>`:m``}
              `:m``}
      </div>
    `}async _search(){const t=this._searchQuery.trim();if(t&&!this._searching){this._searching=!0;try{const i=V(),s=Vt(this.hass),n=[{urlPath:i,config:this._savedLovelace}];for(const t of this.hass?await he(this.hass):[])if(de(t)!==i)try{n.push({urlPath:t,config:await zt(s,t)})}catch(e){}this._searchResult=Object.assign({query:t},function(t,e){var i;const s=e.trim().toLowerCase(),n=[],a=[];if(!s)return{cards:n,templates:a};const o=t=>t.toLowerCase().includes(s);for(const{urlPath:r,config:l}of t){const t=(t,e)=>{var i,s;const a=(i,s,a)=>{n.push({urlPath:r,view:e,template:t.template,where:i,variable:s,value:a})},l=(t,e,i="")=>{for(const s of $(e)){const[e,n]=Object.entries(s)[0];for(const s of yo(n,`${i}${e}`))o(s.value)&&a(t,s.path,s.value)}};l("variables",t.variables);for(const n of null!==(i=A(t.for_each))&&void 0!==i?i:[])l("for_each",n);const c=null===(s=t.for_each_from)||void 0===s?void 0:s.overrides;if(c&&"object"==typeof c)for(const[n,r]of Object.entries(c))o(n)&&a("overrides",n,n),l("overrides",r,`${n} › `);for(const n of vo)if(void 0!==t[n])for(const e of yo(t[n],n))o(e.value)&&a("override_block",e.path,e.value)},e=(i,s)=>{if(Array.isArray(i))for(const t of i)e(t,s);else if(i&&"object"==typeof i&&!Jt(i.type)){bt.includes(i.type)&&"string"==typeof i.template&&t(i,s);for(const t of Object.values(i))e(t,s)}};(null!==(i=null==l?void 0:l.views)&&void 0!==i?i:[]).forEach((t,i)=>{var s,n,a;return e(t,{title:null!==(n=null!==(s=null==t?void 0:t.title)&&void 0!==s?s:null==t?void 0:t.path)&&void 0!==n?n:"",path:null!==(a=null==t?void 0:t.path)&&void 0!==a?a:"",index:i})});for(const[i,s]of Object.entries(Wt(l))){const t=Object.assign({},null!=s?s:{});delete t.type,delete t.template;for(const e of yo(t,""))o(e.value)&&a.push(Object.assign({urlPath:r,template:i},e))}}return{cards:n,templates:a}}(n,t))}finally{this._searching=!1}}}_renderRenameVariable(t){const e=qo(this._config);if(!e.length||!this._config)return m``;const i=this._varFrom&&e.includes(this._varFrom)?this._varFrom:void 0,s=this._varTo.trim(),n=this._varPending,a=!!n&&n.from===i&&n.to===s,o=a&&n.elsewhere.length?p("tools.rename_variable_elsewhere",{list:n.elsewhere.map(t=>`${t.urlPath} (${t.cards})`).join(", ")},this.hass):"";return m`
      <div class="rename">
        <h3>${p("tools.rename_variable_header",void 0,this.hass)}</h3>
        <p class="hint">${p("tools.rename_variable_hint",void 0,this.hass)}</p>
        ${this._varError?m`<ha-alert alert-type="error">${this._varError}</ha-alert>`:m``}
        ${a&&i?m`
                <ha-alert alert-type="warning">
                  ${p("tools.rename_variable_confirm",{from:i,to:s,templates:n.templates,cards:n.cards,elsewhere:o},this.hass)}
                </ha-alert>
                ${fo(this._config,Ro(this._config,i,s),this.hass)}
              `:m``}
        <ha-form
          .hass=${this.hass}
          .data=${{variable:null!=i?i:""}}
          .schema=${[{name:"variable",selector:{select:{mode:"dropdown",options:e.map(t=>({value:t,label:t}))}}}]}
          .computeLabel=${()=>p("tools.rename_variable_pick",void 0,this.hass)}
          @value-changed=${this._varPicked}
        ></ha-form>
        ${wi({label:p("tools.new_name",void 0,this.hass),value:this._varTo,disabled:this._busy,onInput:t=>this._varToChanged(t)})}
        <ha-button
          .disabled=${this._busy||!i||!s||s===i}
          @click=${()=>{this._renameVariable(t)}}
        >
          ${p(a?"tools.rename_anyway":"tools.rename_variable",void 0,this.hass)}
        </ha-button>
      </div>
    `}_varPicked(t){t.stopPropagation(),this._varFrom=t.detail.value.variable||void 0,this._varError=void 0,this._varPending=void 0}_varToChanged(t){this._varTo=t,this._varError=void 0,this._varPending=void 0}async _renameVariable(t){var e;const i=this._varFrom,s=this._varTo.trim();if(!i||!s||s===i||!this._config)return;if(!function(t){return/^[A-Za-z0-9_-]+$/.test(t)}(s))return void(this._varError=p("tools.rename_variable_invalid",{name:s},this.hass));const n=L();if(!n)return void(this._varError=p("tools.cannot_save_here",void 0,this.hass));if(function(t,e,i,s){const n=Wt(t);for(const a of zo(t,e))if(qo(a===e&&s?s:n[a]).includes(i))return!0;return!1}(n.config,t,s,this._config))return void(this._varError=p("tools.rename_variable_taken",{name:s},this.hass));const a=V(),o=this._varPending;if(o&&o.from===i&&o.to===s){this._busy=!0,this._varError=void 0;try{let e;await D(this,this.hass,"rename_variable",[{urlPath:a,build:n=>(e=zo(n,t),Uo(n,t,i,s).config)},...o.elsewhere.map(n=>({urlPath:n.urlPath,build:n=>Ko(n,t,a)?Uo(n,t,i,s,e).config:n}))],this._config),this._undoChanged=void 0,this._fireConfigChanged(Ro(this._config,i,s)),this._varFrom=s,this._varTo="",this._varPending=void 0}catch(r){this._varError=p("tools.save_failed",{message:null!==(e=null==r?void 0:r.message)&&void 0!==e?e:r},this.hass)}finally{this._busy=!1}}else{this._busy=!0;try{const e=Vt(this.hass),o=await zt(e,a).catch(()=>n.config),r=Uo(o,t,i,s),c=zo(o,t),h=[];for(const n of this.hass?await he(this.hass):[]){if(de(n)===a)continue;let o;try{o=await zt(e,n)}catch(l){continue}if(!Ko(o,t,a))continue;const r=Uo(o,t,i,s,c);(r.cards||r.templates)&&h.push({urlPath:n,cards:r.cards})}this._varPending={from:i,to:s,cards:r.cards,templates:r.templates,elsewhere:h}}finally{this._busy=!1}}}_renderDuplicate(t){const e=this._duplicateTo.trim(),i=!!e&&this._duplicatePending===e;return m`
      <div class="rename">
        <h3>${p("tools.duplicate_header",void 0,this.hass)}</h3>
        <p class="hint">${p("tools.duplicate_hint",void 0,this.hass)}</p>
        ${i?m`<ha-alert alert-type="warning">
                ${p("tools.duplicate_confirm",{to:e,name:t},this.hass)}
              </ha-alert>`:m``}
        ${wi({label:p("tools.copy_name",void 0,this.hass),value:this._duplicateTo,disabled:this._busy,onInput:t=>this._duplicateChanged(t)})}
        <ha-button .disabled=${this._busy||!e||e===t} @click=${this._duplicate}>
          ${p(i?"tools.duplicate_anyway":"tools.duplicate",void 0,this.hass)}
        </ha-button>
      </div>
    `}_duplicateChanged(t){this._duplicateTo=t,this._toolError=void 0,this._duplicatePending=void 0}async _duplicate(){var t,e;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._duplicateTo.trim();if(!i||!s||s===i)return;const n=L();if(n&&void 0!==d(n.config)[s])return void(this._toolError=p("tools.name_taken",{name:s},this.hass));if(this._duplicatePending!==s)return void(this._duplicatePending=s);const a=Object.assign(Object.assign({},this._config),{template:s}),o=U(null!==(e=null==n?void 0:n.config)&&void 0!==e?e:this.lovelace,i),r=await this._saveDashboard(t=>{var e,i;return Lt(t,null!==(i=null===(e=null==o?void 0:o.view)||void 0===e?void 0:e.index)&&void 0!==i?i:0,a)},"duplicate");r&&(this._duplicateTo="",this._duplicatePending=void 0)}}t([i({attribute:!1})],Ho.prototype,"hass",void 0),t([i({attribute:!1})],Ho.prototype,"lovelace",void 0),t([i({attribute:!1})],Ho.prototype,"config",void 0),t([e()],Ho.prototype,"_renameTo",void 0),t([e()],Ho.prototype,"_renameError",void 0),t([e()],Ho.prototype,"_renaming",void 0),t([e()],Ho.prototype,"_renamePending",void 0),t([e()],Ho.prototype,"_duplicateTo",void 0),t([e()],Ho.prototype,"_duplicatePending",void 0),t([e()],Ho.prototype,"_toolError",void 0),t([e()],Ho.prototype,"_busy",void 0),t([e()],Ho.prototype,"_modernisePending",void 0),t([e()],Ho.prototype,"_remoteUsages",void 0),t([e()],Ho.prototype,"_undoChanged",void 0),t([e()],Ho.prototype,"_similarNames",void 0),t([e()],Ho.prototype,"_similarPending",void 0),t([e()],Ho.prototype,"_searchQuery",void 0),t([e()],Ho.prototype,"_searching",void 0),t([e()],Ho.prototype,"_searchResult",void 0),t([e()],Ho.prototype,"_varFrom",void 0),t([e()],Ho.prototype,"_varTo",void 0),t([e()],Ho.prototype,"_varError",void 0),t([e()],Ho.prototype,"_varPending",void 0),customElements.get("decluttering-template-usages-tab")||customElements.define("decluttering-template-usages-tab",Ho);class Wo extends s{constructor(){super(...arguments),this._selectedTab="settings",this._suggestedNothing=!1,this._busy=!1,this._declutterPending=!1,this._promoteName="",this._loadedElements=!1}get _savedLovelace(){var t,e,i;return null!==(i=null!==(e=null===(t=L())||void 0===t?void 0:t.config)&&void 0!==e?e:this.lovelace)&&void 0!==i?i:h()}static schema(){var t;return null!==(t=Wo._schema)&&void 0!==t||(Wo._schema=[{name:"template",label:p("template_editor.template_label"),selector:{text:{}}},{name:"thingType",label:p("template_editor.type_label"),selector:{select:{mode:"dropdown",options:[{value:"card",label:p("template_editor.type_card")},{value:"badge",label:p("template_editor.type_badge")},{value:"row",label:p("template_editor.type_row")},{value:"element",label:p("template_editor.type_element")}]}}},{name:"description",label:p("template_editor.description_label"),helper:p("template_editor.description_helper"),selector:{text:{multiline:!0}}},{name:"variables",label:p("template_editor.declarations_label"),helper:p("template_editor.declarations_helper"),selector:{object:{}}},{name:"default",label:p("template_editor.defaults_label"),helper:p("template_editor.defaults_helper"),selector:{object:{}}}]),Wo._schema}setConfig(t){this._config=t,this._suggestion=void 0,this._suggestedNothing=!1}render(){var t;if(!this.hass||!this._config)return m``;const e={};g(this._config.default)&&g(this._config.defaults)||(e.default=p("error.variables_shape",void 0,this.hass)),ue(this._config.variables)||(e.variables=p("template_editor.declarations_shape",void 0,this.hass));const i={template:this._config.template,thingType:null!==(t=v(this._config))&&void 0!==t?t:"card",description:this._config.description,variables:this._config.variables,default:gt(this._config)};return m`
      <ha-tab-group .active=${this._selectedTab} @click=${this._activateTab}>
        <ha-tab-group-tab slot="nav" panel="settings">
          ${p("template_editor.tab_settings",void 0,this.hass)}
        </ha-tab-group-tab>
        ${"card"===i.thingType&&void 0===this._config.group?m`
                <ha-tab-group-tab slot="nav" panel="card">
                  ${p("template_editor.tab_card",void 0,this.hass)}
                </ha-tab-group-tab>
                <ha-tab-group-tab slot="nav" panel="change_card">
                  ${p("template_editor.tab_change_card",void 0,this.hass)}
                </ha-tab-group-tab>
              `:"row"===i.thingType?m`<ha-tab-group-tab slot="nav" panel="row">
                  ${p("template_editor.tab_row",void 0,this.hass)}
                </ha-tab-group-tab>`:m``}
        <ha-tab-group-tab slot="nav" panel="usages">
          ${p("template_editor.tab_usages",void 0,this.hass)}
        </ha-tab-group-tab>
        <ha-tab-group-tab slot="nav" panel="share">
          ${p("template_editor.tab_share",void 0,this.hass)}
        </ha-tab-group-tab>
      </ha-tab-group>
      ${"settings"===this._selectedTab?m`
              ${this._renderInUse()} ${this._renderDiagnostics()} ${this._renderExamplePicker()}
              ${this._renderSuggest("card"===i.thingType)} ${this._renderPromote()} ${this._renderOrder()}
              ${this._renderGroupOrder()}
              <ha-form
                .hass=${this.hass}
                .data=${i}
                .schema=${Wo.schema()}
                .error=${e}
                .computeLabel=${t=>{var e;return null!==(e=t.label)&&void 0!==e?e:t.name}}
                .computeHelper=${t=>{var e;return null!==(e=t.helper)&&void 0!==e?e:""}}
                @value-changed=${this._valueChanged}
              ></ha-form>
              ${this._renderLint()} ${this._renderDeclutter()}
            `:"card"===this._selectedTab?m`
                <hui-card-element-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .value=${this._config.card}
                  @config-changed=${this._cardChanged}
                ></hui-card-element-editor>
              `:"change_card"===this._selectedTab?m`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this.lovelace}
                    @config-changed=${this._cardPicked}
                  ></hui-card-picker>
                `:"row"===this._selectedTab?m`
                    <hui-row-element-editor
                      .hass=${this.hass}
                      .lovelace=${this.lovelace}
                      .value=${this._config.row}
                      @config-changed=${this._rowChanged}
                    ></hui-row-element-editor>
                  `:"usages"===this._selectedTab?m`<decluttering-template-usages-tab
                      .hass=${this.hass}
                      .lovelace=${this.lovelace}
                      .config=${this._config}
                      @select-tab=${this._selectTab}
                    ></decluttering-template-usages-tab>`:"share"===this._selectedTab?m`<decluttering-template-share-tab
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        .config=${this._config}
                        @select-tab=${this._selectTab}
                      ></decluttering-template-share-tab>`:m``}
    `}_renderDiagnostics(){if(!this._config||!ue(this._config.variables))return m``;const{unused:t,duplicated:e,contradictory:i}=pe(this._config);return m`
      ${t.length?m`<ha-alert alert-type="info">
              ${p(1===t.length?"template_editor.declared_unused_one":"template_editor.declared_unused_many",{names:t.join(", ")},this.hass)}
            </ha-alert>`:m``}
      ${e.length?m`<ha-alert alert-type="warning">
              ${p(1===e.length?"template_editor.duplicated_one":"template_editor.duplicated_many",{names:e.join(", ")},this.hass)}
            </ha-alert>`:m``}
      ${i.length?m`<ha-alert alert-type="warning">
              ${p(1===i.length?"template_editor.contradictory_one":"template_editor.contradictory_many",{names:i.join(", ")},this.hass)}
            </ha-alert>`:m``}
    `}_renderExamplePicker(){var t;const e=null===(t=this._config)||void 0===t?void 0:t.template,i=b(this._config);if(!e||!i.length)return m``;const s=me.get(e);return m`
      <ha-form
        .hass=${this.hass}
        .data=${{example:void 0===s||s>=i.length?"":String(s)}}
        .schema=${[{name:"example",selector:{select:{mode:"dropdown",options:[{value:"",label:p("template_editor.preview_defaults",void 0,this.hass)},...i.map((t,e)=>({value:String(e),label:p("template_editor.example_n",{number:e+1},this.hass)}))]}}}]}
        .computeLabel=${()=>p("template_editor.preview_example_label",void 0,this.hass)}
        @value-changed=${this._previewExamplePicked}
      ></ha-form>
    `}_previewExamplePicked(t){var e;t.stopPropagation();const i=null===(e=this._config)||void 0===e?void 0:e.template;if(!i)return;const s=t.detail.value.example;void 0===s||""===s?me.delete(i):me.set(i,Number(s)),window.dispatchEvent(new CustomEvent(fe,{detail:{template:i}})),this.requestUpdate()}_renderLint(){if(!this._config)return m``;const t=this._savedLovelace,e=d(t,void 0,this._config)[this._config.template],i=function(t,e=[]){if(!t||"object"!=typeof t)return[];const i={findings:[],heads:new Map,targets:[]};for(const r of ri){const e=t[r];void 0!==e&&fi(e,r,i)}f(t).forEach((t,e)=>{void 0!==t.default&&fi(t.default,`variables[${e}].default`,i)});const s=new Set([...gi(t),...e,...et,...nt(t)]),n=[...i.findings];for(const r of i.targets){if(s.has(r.name)||i.heads.has(r.name))continue;const t=kt(r.name,[...s,...i.heads.keys()]);n.push({level:"warning",key:"lint.target_unknown",params:t?{name:r.name,placeholder:r.placeholder,closest:t}:{name:r.name,placeholder:r.placeholder},path:r.path})}const a=[...i.heads.entries()].filter(([t])=>!s.has(t));a.length&&n.push({level:"info",key:"lint.undeclared",params:{names:a.map(([t,e])=>a.length>1?`${t} (${e})`:t).join(", ")},path:a.length>1?"":a[0][1]});const o=new Set;return n.filter(t=>{const e=JSON.stringify([t.key,t.params,t.path]);return!o.has(e)&&(o.add(e),!0)})}(this._config,[...gi(e),...Object.keys(ot(t))]);return i.length?m`${i.map(t=>m`<ha-alert alert-type=${t.level}>
          ${p(t.key,t.params,this.hass)}${t.params.closest?p("error.did_you_mean",{closest:t.params.closest},this.hass):""}${t.path?p("lint.where",{path:t.path},this.hass):""}
        </ha-alert>`)}`:m``}_renderOrder(){const t=f(this._config);return t.length<2?m``:m`
      <div class="order">
        <p class="hint">${p("template_editor.order_hint",void 0,this.hass)}</p>
        ${this._renderSortable("variables",t.map(t=>{var e;return{label:null!==(e=t.label)&&void 0!==e?e:t.name,name:t.name}}),(t,e)=>this._move(t,e))}
      </div>
    `}_renderSortable(t,e,i){const s=(e,s)=>{e.preventDefault();const n=this._dragging;this._dragging=void 0,(null==n?void 0:n.list)===t&&i(n.from,s)};return m`
      <ul>
        ${e.map((n,a)=>m`
            <li
              draggable="true"
              @dragstart=${e=>{var i;this._dragging={list:t,from:a},null===(i=e.dataTransfer)||void 0===i||i.setData("text/plain",n.name),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}}
              @dragover=${e=>{var i;(null===(i=this._dragging)||void 0===i?void 0:i.list)===t&&e.preventDefault()}}
              @drop=${t=>s(t,a)}
              @dragend=${()=>{this._dragging=void 0}}
            >
              <ha-svg-icon class="handle" .path=${"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"}></ha-svg-icon>
              <span>${n.label}</span>
              <span class="spacer"></span>
              <ha-icon-button
                .path=${"M7,15L12,10L17,15H7Z"}
                .disabled=${0===a}
                .label=${p("template_editor.move_up",{name:n.name},this.hass)}
                @click=${()=>i(a,a-1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,10L12,15L17,10H7Z"}
                .disabled=${a===e.length-1}
                .label=${p("template_editor.move_down",{name:n.name},this.hass)}
                @click=${()=>i(a,a+1)}
              ></ha-icon-button>
            </li>
          `)}
      </ul>
    `}_move(t,e){const i=f(this._config),s=ge(i,t,e);s!==i&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{variables:s}))}_renderGroupOrder(){var t;const e=null===(t=this._config)||void 0===t?void 0:t.group,i=_e(e);if(void 0===e||i.length<2)return m``;const s=i.map((t,e)=>{var i,s,n,a;const o=null!==(n=null!==(s=null!==(i=null==t?void 0:t.name)&&void 0!==i?i:null==t?void 0:t.heading)&&void 0!==s?s:null==t?void 0:t.title)&&void 0!==n?n:null==t?void 0:t.entity,r=String(null!==(a=null==t?void 0:t.type)&&void 0!==a?a:"?").replace(/^custom:/,"");return{label:"string"==typeof o?`${r} (${o})`:r,name:`${e+1} ${r}`}});return m`
      <div class="order">
        <p class="hint">${p("template_editor.group_order_hint",void 0,this.hass)}</p>
        ${this._renderSortable("group",s,(t,s)=>{const n=ge(i,t,s);n!==i&&this._config&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{group:ve(e,n)}))})}
      </div>
    `}_renderPromote(){const t=ii(this._config);if(!this._config||!t)return m``;const e=function(t){const e=[],i=(t,s)=>{if(Array.isArray(t))t.forEach((t,e)=>i(t,[...s,e]));else if(t&&"object"==typeof t)for(const[e,n]of Object.entries(t))"type"===e&&"string"==typeof n||i(n,[...s,e]);else"string"==typeof t&&mt.test(t)||s.length&&null!=t&&("string"!=typeof t&&"number"!=typeof t&&"boolean"!=typeof t||e.push({path:s,value:t,label:si(s)}))};return i(t,[]),e}(this._config[t]);if(!e.length)return m``;const i=this._promotePath?JSON.stringify(this._promotePath):"",s=t=>{const e=String(t);return e.length>40?`${e.slice(0,39)}…`:e};return m`
      <ha-expansion-panel outlined class="promote">
        <span slot="header">${p("template_editor.promote_header",void 0,this.hass)}</span>
        <p class="hint">${p("template_editor.promote_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${{setting:i}}
          .schema=${[{name:"setting",selector:{select:{mode:"dropdown",options:e.map(t=>({value:JSON.stringify(t.path),label:`${t.label} = ${s(t.value)}`}))}}}]}
          .computeLabel=${()=>p("template_editor.promote_pick",void 0,this.hass)}
          @value-changed=${this._promotePicked}
        ></ha-form>
        ${this._promotePath?m`
                ${wi({label:p("template_editor.promote_name",void 0,this.hass),value:this._promoteName,onInput:t=>{this._promoteName=t,this._promoteError=void 0}})}
                ${this._promoteError?m`<ha-alert alert-type="error">${this._promoteError}</ha-alert>`:m``}
                <ha-button .disabled=${!this._promoteName.trim()} @click=${this._promote}>
                  ${p("template_editor.promote_button",void 0,this.hass)}
                </ha-button>
              `:m``}
      </ha-expansion-panel>
    `}_promotePicked(t){t.stopPropagation();const e=t.detail.value.setting;e&&(this._promotePath=JSON.parse(e),this._promoteName=function(t,e){const i=[...t].reverse().find(t=>"string"==typeof t),s=t[t.length-1];return Ze(("number"==typeof s?`${null!=i?i:"item"}_${s+1}`:null!=i?i:"value").replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value",e)}(this._promotePath,ni(this._config)),this._promoteError=void 0)}_promote(){if(!this._config||!this._promotePath)return;const t=this._promoteName.trim(),e=function(t,e,i){if(!ti.test(i))return{ok:!1,error:"name_invalid"};if(ni(t).includes(i))return{ok:!1,error:"name_taken"};const s=ii(t),n=s?function(t,e){return e.reduce((t,e)=>null==t?void 0:t[e],t)}(t[s],e):void 0;if(!s||null==n||"object"==typeof n)return{ok:!1,error:"gone"};const a={name:i,type:ai(n),default:n};return{ok:!0,template:Object.assign(Object.assign({},t),{[s]:oi(t[s],e,`[[${i}]]`),variables:xt(t.variables,[a])})}}(this._config,this._promotePath,t);e.ok?(this._promotePath=void 0,this._promoteName="",this._fireConfigChanged(e.template)):this._promoteError=p(`template_editor.promote_${e.error}`,{name:t},this.hass)}_renderInUse(){var t;const e=null===(t=this._config)||void 0===t?void 0:t.template,i=this._savedLovelace;if(!e||!i)return m``;const{views:s,templates:n}=te(i,e),a=s.reduce((t,e)=>t+e.count,0)+n.length;return a?m`<ha-alert alert-type="info">
      ${p(1===a?"template_editor.in_use_one":"template_editor.in_use_many",{total:a},this.hass)}
    </ha-alert>`:m``}_renderSuggest(t){var e;return t&&(null===(e=this._config)||void 0===e?void 0:e.card)?m`
      <div class="suggest">
        ${this._suggestedNothing?m`<ha-alert alert-type="info">
                ${p("template_editor.suggest_nothing",void 0,this.hass)}
              </ha-alert>`:m``}
        ${this._suggestion?m`<ha-alert alert-type="warning">
                ${p(1===this._suggestion.variables.length?"template_editor.suggest_confirm_one":"template_editor.suggest_confirm_many",{names:this._suggestion.variables.map(t=>t.name).join(", ")},this.hass)}
              </ha-alert>`:m``}
        <ha-button @click=${this._suggest}>
          ${p(this._suggestion?"template_editor.suggest_anyway":"template_editor.suggest_button",void 0,this.hass)}
        </ha-button>
      </div>
    `:m``}_suggest(){var t;if(!(null===(t=this._config)||void 0===t?void 0:t.card))return;if(this._suggestion){const t=Object.assign(Object.assign({},this._config),{card:this._suggestion.card});return t.variables=xt(this._config.variables,this._suggestion.variables),this._suggestion=void 0,void this._fireConfigChanged(t)}this._suggestedNothing=!1;const e=f(this._config).map(t=>t.name),i=function(t,e){const i=new Set(e),s=[],n=new Map,a=(t,e)=>{const a=`${t.base} ${e}`,o=n.get(a);if(o)return o;let r=1,l=t.base;for(;i.has(l);)r+=1,l=`${t.base}_${r}`;return i.add(l),n.set(a,l),s.push({name:l,label:Ue(t,r),selector:t.selector,default:e}),l},o=t=>{if(Array.isArray(t))return t.map(o);if(!t||"object"!=typeof t)return t;const e={};for(const[i,s]of Object.entries(t)){const t=Object.prototype.hasOwnProperty.call(qe,i)?qe[i]:void 0;t&&"string"==typeof s&&!mt.test(s)&&t.matches(s)?e[i]=`[[${a(t,s)}]]`:e[i]=o(s)}return e};return{card:o(t),variables:s}}(this._config.card,e);i.variables.length?this._suggestion=i:this._suggestedNothing=!0}_renderDeclutter(){var t,e;const i=this._savedLovelace,s=ne(i),n="card"===v(null!==(t=this._config)&&void 0!==t?t:{})?ye(i):[];if(!s.length&&!n.length||!this._config)return m``;const a=this._config.template,o=!!a&&a in d(i),r=null!==(e=this._declutterOriginal)&&void 0!==e?e:this._declutterSection;return m`
      <ha-expansion-panel outlined>
        <span slot="header">${p("template_editor.declutter_header",void 0,this.hass)}</span>
        <p class="hint">${p("template_editor.declutter_hint",void 0,this.hass)}</p>
        ${s.length?m`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:s.map((t,e)=>({value:String(e),label:t.label}))}}}]}
                .computeLabel=${()=>p("template_editor.declutter_pick",void 0,this.hass)}
                @value-changed=${t=>this._declutterPicked(t,s)}
              ></ha-form>`:m``}
        ${n.length?m`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:n.map((t,e)=>({value:String(e),label:p(1===t.cards.length?"template_editor.declutter_section_one":"template_editor.declutter_section_many",{where:t.label,count:t.cards.length},this.hass)}))}}}]}
                .computeLabel=${()=>p("template_editor.declutter_pick_section",void 0,this.hass)}
                @value-changed=${t=>this._declutterSectionPicked(t,n)}
              ></ha-form>`:m``}
        ${r?m`
                <ha-button .disabled=${this._busy||!o} @click=${this._declutterReplace}>
                  ${p(this._declutterPending?"template_editor.declutter_replace_confirm":this._declutterSection?"template_editor.declutter_replace_section":"template_editor.declutter_replace",void 0,this.hass)}
                </ha-button>
                ${o?m``:m`<p class="hint">${p("template_editor.declutter_save_first",void 0,this.hass)}</p>`}
              `:m``}
      </ha-expansion-panel>
    `}_declutterPicked(t,e){t.stopPropagation();const i=e[Number(t.detail.value.pick)];if(!i||!this._config)return;this._declutterOriginal=i.config,this._declutterSection=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{card:JSON.parse(JSON.stringify(i.config))});delete s.group,this._fireConfigChanged(s)}_declutterSectionPicked(t,e){t.stopPropagation();const i=e[Number(t.detail.value.pick)];if(!i||!this._config)return;this._declutterSection={view:i.view,section:i.section,cards:i.cards},this._declutterOriginal=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{group:{cards:JSON.parse(JSON.stringify(i.cards))}});delete s.card,this._fireConfigChanged(s)}async _declutterReplace(){var t;const e=null===(t=this._config)||void 0===t?void 0:t.template,i=this._declutterOriginal,s=this._declutterSection;if(!e||!i&&!s)return;if(!this._declutterPending)return void(this._declutterPending=!0);const n={type:"custom:decluttering-card-plus",template:e};let a=!1;const o=await this._saveDashboard(t=>{if(i)return z(t,i,n);const e=be(t,s.view,s.section,s.cards,[n]);return a=e===t,e},"declutter");o&&a&&(this._toolError=p("template_editor.declutter_section_changed",void 0,this.hass)),o&&(this._declutterPending=!1,this._declutterOriginal=void 0,this._declutterSection=void 0)}_selectTab(t){t.stopPropagation(),this._selectedTab=t.detail}_activateTab(t){const e=t.composedPath().find(t=>"ha-tab-group-tab"===t.localName),i=null==e?void 0:e.getAttribute("panel");i&&(this._selectedTab=i)}_valueChanged(t){if(!this._config)return;const e=t.detail.value,i=Object.assign(Object.assign({},this._config),{template:e.template,default:e.default});void 0!==this._config.defaults&&(JSON.stringify(e.default)===JSON.stringify(gt(this._config))?i.default=this._config.default:delete i.defaults),dt(i,"description",e.description),dt(i,"variables",e.variables);const s=void 0!==i.group&&"card"===e.thingType;s||delete i.group;for(const[n,a]of Object.entries(_i))Wo.stubMember(!s&&e.thingType===n,i,n,a);this._fireConfigChanged(i)}_cardChanged(t){if(t.stopPropagation(),!this._config)return;this._suggestion=void 0,this._suggestedNothing=!1;const e=Object.assign(Object.assign({},this._config),{card:t.detail.config});this._fireConfigChanged(e)}_cardPicked(t){this._selectedTab="card",this._cardChanged(t)}_rowChanged(t){if(t.stopPropagation(),!this._config)return;const e=Object.assign(Object.assign({},this._config),{row:t.detail.config});this._fireConfigChanged(e)}_fireConfigChanged(t){this._suggestion=void 0,this._suggestedNothing=!1,w(this,"config-changed",{config:t})}static stubMember(t,e,i,s){t?i in e||(e[i]=s):delete e[i]}static get styles(){return ki}_saveDashboard(t,e,i){return xi(this,t,e,i)}async connectedCallback(){var t;super.connectedCallback(),null!==(t=this._stopLanguageListener)&&void 0!==t||(this._stopLanguageListener=l(()=>this.requestUpdate())),this._loadedElements||(await c(),await async function(){let t=customElements.get("hui-entities-card");if(!t){if(!Ct)return;(await Ct).createCardElement({type:"entities",entities:[]}),await customElements.whenDefined("hui-entities-card"),t=customElements.get("hui-entities-card")}t&&t.getConfigElement&&await t.getConfigElement()}(),this._loadedElements=!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._stopLanguageListener)||void 0===t||t.call(this),this._stopLanguageListener=void 0}}t([e()],Wo.prototype,"_config",void 0),t([e()],Wo.prototype,"_selectedTab",void 0),t([e()],Wo.prototype,"_suggestion",void 0),t([e()],Wo.prototype,"_suggestedNothing",void 0),t([e()],Wo.prototype,"_toolError",void 0),t([e()],Wo.prototype,"_busy",void 0),t([e()],Wo.prototype,"_declutterOriginal",void 0),t([e()],Wo.prototype,"_declutterSection",void 0),t([e()],Wo.prototype,"_declutterPending",void 0),t([e()],Wo.prototype,"_promotePath",void 0),t([e()],Wo.prototype,"_promoteName",void 0),t([e()],Wo.prototype,"_promoteError",void 0),t([i()],Wo.prototype,"lovelace",void 0),t([i()],Wo.prototype,"hass",void 0);class Jo extends s{connectedCallback(){var t;super.connectedCallback(),null!==(t=this._stopLanguageListener)&&void 0!==t||(this._stopLanguageListener=l(()=>this.requestUpdate()))}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._stopLanguageListener)||void 0===t||t.call(this),this._stopLanguageListener=void 0}static get styles(){return n`
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
    `}render(){var t,e,i,s,n,a,o,r,l;const c=this.lovelace,h=ut(c);if(h&&(null===(t=this._borrowed)||void 0===t?void 0:t.ll)!==c){this._borrowed={ll:c};const t=new Set(Object.keys(d(c)));pt(this.hass,c).then(e=>{var i;(null===(i=this._borrowed)||void 0===i?void 0:i.ll)===c&&(this._borrowed={ll:c,names:Object.keys(e).filter(e=>!t.has(e)),templates:e})})}const u=h&&!(null===(e=this._borrowed)||void 0===e?void 0:e.names),f=$e(c,h&&null!==(s=null===(i=this._borrowed)||void 0===i?void 0:i.names)&&void 0!==s?s:[]),g=u?Object.assign(Object.assign({},f),{missingTemplates:[]}):f,_=we(c),v=xe(c),y=null===(n=this._borrowed)||void 0===n?void 0:n.names,b=this._examplesChecked;u||(null==b?void 0:b.ll)===c&&(null==b?void 0:b.borrowed)===y||(this._examplesChecked={ll:c,borrowed:y,failed:ke(d(c),null!=y?y:[],this.hass)});const $=u?[]:null!==(o=null===(a=this._examplesChecked)||void 0===a?void 0:a.failed)&&void 0!==o?o:[],w=Fo(c,null!==(l=null===(r=this._borrowed)||void 0===r?void 0:r.templates)&&void 0!==l?l:d(c)),x=!(g.missingTemplates.length||g.unsetVariables.length||g.unusedTemplates.length||_.length||v.length||$.length||w.length);return m`
      <ha-expansion-panel outlined>
        <span slot="header">${p("tools.health_header",void 0,this.hass)}</span>
        <slot></slot>
        ${x?m`<p class="hint">${p("tools.health_ok",void 0,this.hass)}</p>`:m`
                ${$.map(t=>m`<ha-alert alert-type="error">
                      ${p("tools.health_example",{template:t.template,number:t.example,problems:t.problems.join(" ")},this.hass)}
                    </ha-alert>`)}
                ${_.map(t=>m`<ha-alert alert-type="error">
                      ${p("tools.health_extends_loop",{path:t.join(" → ")},this.hass)}
                    </ha-alert>`)}
                ${g.missingTemplates.map(t=>m`<ha-alert alert-type="error">
                      ${p("tools.health_missing",{template:t.template,count:t.count},this.hass)}${t.closest?p("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${g.unsetVariables.map(t=>m`<ha-alert alert-type="warning">
                      ${p("tools.health_unset",{template:t.template,names:t.names.join(", "),count:t.count},this.hass)}
                    </ha-alert>`)}
                ${v.map(t=>{const e=[...t.views.map(t=>p("tools.health_view_uses",{view:t.title||p("template_editor.untitled_view",void 0,this.hass),count:t.count},this.hass)),...t.templates.map(t=>p("tools.health_template_uses",{name:t},this.hass))].join(", ");return m`<ha-alert alert-type="warning">
                    ${t.message?p("tools.health_deprecated_because",{template:t.template,message:t.message,uses:e},this.hass):p("tools.health_deprecated",{template:t.template,uses:e},this.hass)}
                  </ha-alert>`})}
                ${w.map(t=>m`<ha-alert alert-type="warning">
                      ${p("tools.health_unread",{template:t.template,name:t.name,count:t.count,view:t.view.title||t.view.path||p("template_editor.untitled_view",void 0,this.hass)},this.hass)}${"variables"===t.where?"":p(`tools.health_unread_${t.where}`,void 0,this.hass)}${t.closest?p("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${g.unusedTemplates.length?m`<ha-alert alert-type="info">
                        ${p("tools.health_unused",{names:g.unusedTemplates.join(", ")},this.hass)}
                      </ha-alert>`:m``}
              `}
        ${this._renderTimings()}
      </ha-expansion-panel>
    `}_renderTimings(){const t=Se.entries(),e=t=>t.toFixed(1),i=m`<h4 class="timings-header">${p("tools.timings_header",void 0,this.hass)}</h4>`;if(!t.length)return m`${i}
        <p class="hint">${p("tools.timings_none",void 0,this.hass)}</p>`;const{byTotal:s,byMax:n,repeats:a}=Ae(t);return m`
      ${i}
      <p class="hint">${p("tools.timings_hint",{count:t.length},this.hass)}</p>
      <p class="hint">${p("tools.timings_by_total",void 0,this.hass)}</p>
      <ul class="timings">
        ${s.map(t=>m`<li>
              ${p(1===t.builds?"tools.timings_total_row_one":"tools.timings_total_row",{template:t.template,total:e(t.total),builds:t.builds,max:e(t.max)},this.hass)}
            </li>`)}
      </ul>
      <p class="hint">${p("tools.timings_by_max",void 0,this.hass)}</p>
      <ul class="timings">
        ${n.map(t=>m`<li>
              ${p("tools.timings_max_row",{template:t.template,max:e(t.max)},this.hass)}
            </li>`)}
      </ul>
      ${a.length?m`
              <p class="hint">${p("tools.timings_repeats",void 0,this.hass)}</p>
              <ul class="timings">
                ${a.map(t=>{var e;return m`<li>
                      ${p(t.name?"tools.timings_repeat_named_row":"tools.timings_repeat_row",{template:t.template,name:null!==(e=t.name)&&void 0!==e?e:"",copies:t.copies},this.hass)}
                    </li>`})}
              </ul>
            `:m``}
    `}}t([i({attribute:!1})],Jo.prototype,"hass",void 0),t([i({attribute:!1})],Jo.prototype,"lovelace",void 0),t([e()],Jo.prototype,"_borrowed",void 0),je(Oe,De),je(Ce,Wo),je(Ee,Jo);export{De as DeclutteringCardEditor,Jo as DeclutteringHealthPanel,Wo as DeclutteringTemplateEditor};
//# sourceMappingURL=decluttering-card-plus.editors-DYbSs_rC.js.map
