import{_ as t,r as e,n as i,i as s,a as n,e as a,d as o,c as r,o as l,l as c,g as h,b as d,t as u,f as p,h as m,j as f,k as g,m as _,p as v,q as y,s as b,u as $,v as w,w as x,x as k,y as S,z as A,A as j,B as O,C,D as E,E as T,F as N,G as P,H as I,I as F,J as L,K as M,L as D,M as R,N as V,O as z,P as q,Q as U,R as K,S as H,T as W,U as J,W as B,X as Y,Y as G,Z,$ as Q,a0 as X,a1 as tt,a2 as et,a3 as it,a4 as st,a5 as nt,a6 as at,a7 as ot,a8 as rt,a9 as lt,aa as ct,ab as ht,ac as dt,ad as ut,ae as pt,af as mt,ag as ft,ah as gt,ai as _t,aj as vt,ak as yt,al as bt,am as $t,an as wt,ao as xt,ap as kt,aq as St,ar as At,as as jt,at as Ot,au as Ct,av as Et,aw as Tt,ax as Nt,ay as Pt,az as It,aA as Ft,aB as Lt,aC as Mt,aD as Dt,aE as Rt,aF as Vt,aG as zt,aH as qt,aI as Ut,V as Kt,aJ as Ht,aK as Wt,aL as Jt,aM as Bt,aN as Yt,aO as Gt,aP as Zt,aQ as Qt,aR as Xt,aS as te,aT as ee,aU as ie,aV as se,aW as ne,aX as ae,aY as oe,aZ as re,a_ as le,a$ as ce,b0 as he,b1 as de,b2 as ue,b3 as pe,b4 as me,b5 as fe,b6 as ge,b7 as _e,b8 as ve,b9 as ye,ba as be,bb as $e,bc as we,bd as xe,be as ke,bf as Se,bg as Ae,bh as je,bi as Oe,bj as Ce}from"./decluttering-card-plus.core-sYJNSm8F.js";const Ee="variable:";let Te,Ne;function Pe(){return null!=Ne||(Ne=[{name:"fit",label:p("editor.fit_label"),helper:p("editor.fit_helper"),selector:{select:{mode:"dropdown",options:[{value:"box",label:p("editor.fit_box")},{value:"contents",label:p("editor.fit_contents")}]}}}]),Ne}function Ie(t,e){const i=t.indexOf(e);return-1===i?[t,""]:[t.slice(0,i),t.slice(i+e.length)]}const Fe=new Set(["true","yes","on","1"]),Le=/:host|\.decluttering-container/;class Me extends s{constructor(){super(...arguments),this._shownAs=new Map,this._loadingTemplates=!1,this._ejectPending=!1,this._sectionsPending=!1,this._renderedTemplates={},this._renderingTemplates=new Set}static get styles(){return n`
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
      ${this._renderDiagnostics(t,i)} ${this._renderMatches()}
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
      </ha-alert>`}const c=(null==i?void 0:i.length)?p("editor.result_copies",{total:i.length},this.hass):"",[h,d]=Ie(p("editor.result_hint",{kind:o},this.hass),"[[name]]");return m`
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
    `:m``}async _sectionPerCopy(){var t,e;if(!this._sectionsPending)return void(this._sectionsPending=!0);this._sectionsPending=!1;const i=L(),s=this._config;if(!i||!s)return;try{await D(this,this.hass,"section_per_copy",[{urlPath:V(),build:t=>R(t,s)}])}catch(a){return void(this._sectionsError=p("tools.save_failed",{message:null!==(t=null==a?void 0:a.message)&&void 0!==t?t:a},this.hass))}let n=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;for(;n&&"hui-dialog-edit-card"!==n.localName;)n=n.parentNode instanceof ShadowRoot?n.parentNode.host:n.parentNode;null===(e=null==n?void 0:n.closeDialog)||void 0===e||e.call(n)}_eject(t){this._ejectPending?(this._ejectPending=!1,this._holdEjectUndo(t),w(this,"config-changed",{config:t})):this._ejectPending=!0}_holdEjectUndo(t){const e=L();if(!e||!this._openedWith)return;const i=z(e.config,this._openedWith,t);i!==e.config&&q({operation:"eject",at:Date.now(),dashboards:[{urlPath:V(),before:e.config,after:i}]})}_renderSource(t){var e;const i=null===(e=this._config)||void 0===e?void 0:e.template;if(!i||!t||this._loadingTemplates)return m``;const s=U(this._lovelace,i);if(!s)return m`<p class="hint">${p("editor.source_borrowed",void 0,this.hass)}</p>`;if(s.declared||!s.view)return m`<p class="hint">${p("editor.source_declared",void 0,this.hass)}</p>`;const{view:n}=s,a=document.location.pathname.split("/").slice(0,2).join("/"),[o,r]=Ie(p("editor.source_view",{view:""},this.hass),"");return m`<p class="hint">
      ${o}<a href=${`${a}/${n.path||n.index}`} target="_blank" rel="noreferrer"
        >${n.title||n.path||p("editor.untitled_view",void 0,this.hass)}</a
      >${r}
    </p>`}_renderedTemplateNames(){var t;const e=null===(t=this._config)||void 0===t?void 0:t.for_each_from,i=K(e);if(!this.hass||void 0===i)return[];if(!Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))return[];const s=new Set,n=H(this.hass,e,{rendered:this._renderedTemplates});for(const a of n)for(const t of Object.keys(a))s.add(t);return[...s]}_renderEditorTemplate(t){this.hass&&!this._renderingTemplates.has(t)&&(this._renderingTemplates.add(t),W(this.hass,t).then(e=>{this._renderingTemplates.delete(t),this._renderedTemplates=Object.assign(Object.assign({},this._renderedTemplates),{[t]:e})}))}_renderMatches(){var t,e;const i=null===(t=this._config)||void 0===t?void 0:t.for_each_from;if(!this.hass||!F(i))return m``;J(i)&&!B()&&Y(this.hass).then(()=>this.requestUpdate());const s=K(i);if(void 0!==s){const t=Object.prototype.hasOwnProperty.call(this._renderedTemplates,s)?this._renderedTemplates[s]:void 0;if(!t)return this._renderEditorTemplate(s),m`<p class="hint">${p("editor.matches_template_pending",void 0,this.hass)}</p>`;const e=G(t);if(!("list"in e)){const t="error"===e.problem?"editor.matches_template_failed":"editor.matches_template_not_list";return m`<ha-alert alert-type="warning"> ${p(t,{detail:e.detail},this.hass)} </ha-alert>`}}let n=[];try{n=H(this.hass,i,Object.assign(Object.assign({},Z(this._lovelace)),{rendered:this._renderedTemplates}))}catch(o){return m``}if(!n.length)return m`<ha-alert alert-type="warning">
        ${p("editor.matches_none",{but:(null===(e=this._config)||void 0===e?void 0:e.empty)?p("editor.matches_none_but_empty",void 0,this.hass):""},this.hass)}
      </ha-alert>`;const a=n.slice(0,12);return m`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${1===n.length?p("editor.matches_header_one",void 0,this.hass):p("editor.matches_header_many",{count:n.length},this.hass)}
        </span>
        <div class="matches">
          <ul>
            ${a.map(t=>m`<li>${(t=>{var e,i,s,n,a,o;return String(null!==(a=null!==(n=null!==(s=null!==(i=null!==(e=t.entity)&&void 0!==e?e:t.area_id)&&void 0!==i?i:t.navigation_path)&&void 0!==s?s:t.item)&&void 0!==n?n:t.name)&&void 0!==a?a:`${null!==(o=t.total)&&void 0!==o?o:""}`)})(t)}</li>`)}
          </ul>
          ${n.length>a.length?m`<p class="hint">
                  ${p("editor.matches_more",{count:n.length-a.length},this.hass)}
                </p>`:m``}
          <p class="hint">
            ${p(void 0===s?"editor.matches_hint":"editor.matches_template_hint",void 0,this.hass)}
          </p>
        </div>
      </ha-expansion-panel>
    `}_formSchema(t,e){const i=e?(null!=Te||(Te=[{name:"for_each",label:p("editor.for_each_label"),helper:p("editor.for_each_helper"),selector:{object:{}}},{name:"for_each_from",label:p("editor.for_each_from_label"),helper:p("editor.for_each_from_helper"),selector:{object:{}}},{name:"gap",label:p("editor.gap_label"),helper:p("editor.gap_helper"),selector:{number:{min:0,max:64,mode:"box"}}},{name:"empty",label:p("editor.empty_label"),helper:p("editor.empty_helper"),selector:{object:{}}},{name:"columns",label:p("editor.columns_label"),helper:p("editor.columns_helper"),selector:{number:{min:1,max:6,mode:"box"}}},{name:"min_column_width",label:p("editor.min_column_width_label"),helper:p("editor.min_column_width_helper"),selector:{number:{min:50,max:1e3,step:10,mode:"box"}}},{name:"lazy",label:p("editor.lazy_label"),helper:p("editor.lazy_helper"),selector:{boolean:{}}},{name:"lazy_eager",label:p("editor.lazy_eager_label"),helper:p("editor.lazy_eager_helper"),selector:{number:{min:0,max:100,mode:"box"}}}]),Te):[];if(!t.length)return[...this._schema,...i,...Pe()];const s=t=>{var e;return{name:Ee+t.name,label:null!==(e=t.label)&&void 0!==e?e:t.name,helper:t.description,selector:X(t),required:!0===t.required}},n=[];for(const a of Q(t.filter(t=>!x(t))))void 0===a.group?n.push(...a.declarations.map(s)):n.push({name:"",type:"expandable",title:a.group,schema:a.declarations.map(s)});return[this._schema[0],...n,{name:"extras",label:p("editor.extras_label",void 0,this.hass),helper:p("editor.extras_helper",void 0,this.hass),selector:{object:{}}},...i,...Pe()]}_formData(t){var e,i,s,n,a,o,r,l,c,h,d,u;if(!t.length)return this._config;const p=k(null===(e=this._config)||void 0===e?void 0:e.variables),m=new Set(t.map(t=>t.name)),f={template:null===(i=this._config)||void 0===i?void 0:i.template};this._shownAs=new Map;for(const _ of t){if(!(_.name in p))continue;const t=p[_.name];if("boolean"!=typeof t&&"boolean"in X(_)){const e=Fe.has(String(t).trim().toLowerCase());this._shownAs.set(_.name,{shown:e,written:t}),f[Ee+_.name]=e}else f[Ee+_.name]=t}const g=$(null===(s=this._config)||void 0===s?void 0:s.variables).filter(t=>{const e=S(t);return void 0!==e&&!m.has(e)});return g.length&&(f.extras=g),void 0!==(null===(n=this._config)||void 0===n?void 0:n.for_each)&&(f.for_each=this._config.for_each),void 0!==(null===(a=this._config)||void 0===a?void 0:a.for_each_from)&&(f.for_each_from=this._config.for_each_from),void 0!==(null===(o=this._config)||void 0===o?void 0:o.columns)&&(f.columns=this._config.columns),void 0!==(null===(r=this._config)||void 0===r?void 0:r.min_column_width)&&(f.min_column_width=this._config.min_column_width),void 0!==(null===(l=this._config)||void 0===l?void 0:l.empty)&&(f.empty=this._config.empty),void 0!==(null===(c=this._config)||void 0===c?void 0:c.gap)&&(f.gap=this._config.gap),void 0!==(null===(h=this._config)||void 0===h?void 0:h.fit)&&(f.fit=this._config.fit),void 0!==(null===(d=this._config)||void 0===d?void 0:d.lazy)&&(f.lazy=this._config.lazy),void 0!==(null===(u=this._config)||void 0===u?void 0:u.lazy_eager)&&(f.lazy_eager=this._config.lazy_eager),f}_renderDiagnostics(t,e){var i,s,n,a,o,r,l,c,d,u,f,g,y,b,$,w;if(!t||this._loadingTemplates||!e||_(this._config))return m``;const x=[...et(null===(i=this._config)||void 0===i?void 0:i.for_each),...it(null===(s=this._config)||void 0===s?void 0:s.for_each_from),...F(null===(n=this._config)||void 0===n?void 0:n.for_each_from)?tt:[],...this._renderedTemplateNames(),...N(null===(a=this._config)||void 0===a?void 0:a.rebuild_on),...st(t,nt(null===(o=this._config)||void 0===o?void 0:o.variables)),...Object.keys(at(null!==(r=this._lovelace)&&void 0!==r?r:h()))].map(t=>({[t]:null})),{missing:k,unused:S,required:A}=ot(null===(l=this._config)||void 0===l?void 0:l.variables,t,x),j=rt(null===(c=this._config)||void 0===c?void 0:c.variables,t,this.hass),O=k.filter(t=>!A.includes(t)),C=Le.test(`${null!==(d=t.style)&&void 0!==d?d:""}\n${null!==(f=null===(u=this._config)||void 0===u?void 0:u.style)&&void 0!==f?f:""}`),E="contents"===(null===(g=this._config)||void 0===g?void 0:g.fit)&&C,T=Number(null===(y=this._config)||void 0===y?void 0:y.columns),P=(void 0!==(null===(b=this._config)||void 0===b?void 0:b.for_each)||void 0!==(null===($=this._config)||void 0===$?void 0:$.for_each_from))&&T>1&&!(Number(null===(w=this._config)||void 0===w?void 0:w.min_column_width)>0),I=v(t),L=lt(this._config,I);return m`
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
    `}_valueChanged(t){var e,i;const s=t.detail.value,n=f(null===(e=this._templates)||void 0===e?void 0:e[s.template]);if(!n.length)return void w(this,"config-changed",{config:s});const a=[];for(const l of n){let t=s[Ee+l.name];const e=this._shownAs.get(l.name);e&&t===e.shown&&(t=e.written),void 0!==t&&""!==t&&a.push({[l.name]:t})}Array.isArray(s.extras)&&a.push(...s.extras);const o=Object.assign(Object.assign({},this._config),{template:s.template}),r=ct($(null===(i=this._config)||void 0===i?void 0:i.variables),a);r.length?o.variables=r:delete o.variables,ht(o,"for_each",s.for_each),ht(o,"for_each_from",s.for_each_from),ht(o,"columns",s.columns),ht(o,"min_column_width",s.min_column_width),ht(o,"empty",s.empty),ht(o,"gap",s.gap),ht(o,"lazy",!0===s.lazy||void 0),ht(o,"lazy_eager",s.lazy_eager),w(this,"config-changed",{config:o})}_loadBorrowedTemplates(){if(!dt(this._lovelace))return;this._loadingTemplates=!0;const t=this._editingPlace();ut(this.hass,this._lovelace,t.view,void 0,t.section).then(t=>{this._templates=t,this._schema=void 0}).finally(()=>{this._loadingTemplates=!1,this.requestUpdate()})}}t([e()],Me.prototype,"_lovelace",void 0),t([e()],Me.prototype,"_config",void 0),t([i()],Me.prototype,"hass",void 0),t([e()],Me.prototype,"_loadingTemplates",void 0),t([e()],Me.prototype,"_ejectPending",void 0),t([e()],Me.prototype,"_sectionsPending",void 0),t([e()],Me.prototype,"_sectionsError",void 0),t([e()],Me.prototype,"_renderedTemplates",void 0);const De=/^[a-z_]+\.[a-z0-9_]+$/,Re={base:"entity",label:"Entity",selector:{entity:{}},matches:t=>De.test(t)};function Ve(t,e){return{base:t,label:e,selector:{text:{}},matches:t=>t.trim().length>0}}const ze={entity:Re,entity_id:Re,name:Ve("name","Name"),title:Ve("title","Title"),heading:Ve("heading","Heading"),icon:{base:"icon",label:"Icon",selector:{icon:{}},matches:t=>t.includes(":")}};function qe(t,e){return 1===e?t.label:`${t.label} ${e}`}const Ue=[_t,vt,...yt],Ke=["card","badge","row","element","group"],He=["type","template","description","variables","default",...Ke,"style"];function We(t,e){if(Array.isArray(t))for(const i of t)We(i,e);else if(t&&"object"==typeof t){e(t);for(const i of Object.values(t))We(i,e)}}function Je(t){const e=new Set,i=new Set;We(t,t=>{const s=t.type;if("string"==typeof s){s.startsWith("custom:")&&!Ue.includes(s)&&e.add(s);for(const e of bt(t))i.add(e)}});for(const s of gt(t))i.add(s);return{customTypes:[...e].sort(),templateRefs:[...i].sort()}}function Be(t,e){const i=t&&"object"==typeof t&&void 0!==t[mt]?Object.assign(Object.assign({},t),{default:ft(t)}):t,s={};for(const l of He)void 0!==(null==i?void 0:i[l])&&(s[l]=i[l]);for(const l of Object.keys(null!=i?i:{}))l in s||l===mt||"source"===l||(s[l]=i[l]);const{customTypes:n,templateRefs:a}=Je(t),o=[];if(e){const t={},i=[...a];for(;i.length;){const s=i.shift();if(s in t)continue;const n=e[s];n?(t[s]=Ye(n),i.push(...Je(n).templateRefs)):o.push(s)}Object.keys(t).length&&(s.includes=t)}else o.push(...a);const r=[];return n.length&&r.push(p("share.requires_custom_cards",{types:n.join(", ")})),o.length&&r.push(p("share.uses_other_templates",{names:o.join(", ")})),{payload:s,notes:r}}function Ye(t){if(!t||"object"!=typeof t||Array.isArray(t))return t;const e=Object.assign({},t);return delete e.source,e}function Ge(t,e){if(!e.includes(t))return t;let i=2;for(;e.includes(`${t}_${i}`);)i+=1;return`${t}_${i}`}function Ze(t){if(!t||"object"!=typeof t||Array.isArray(t))return{ok:!1,errors:[p("share.import_not_a_template")]};const e=[];"string"==typeof t.template&&t.template.trim()||e.push(p("share.import_no_name"));const i=Ke.filter(e=>void 0!==t[e]);return 0===i.length?e.push(p("share.import_defines_nothing")):i.length>1&&e.push(p("share.import_defines_both",{first:i[0],second:i[1]})),{ok:0===e.length,errors:e}}const Qe=["card","badge","row","element","group"],Xe=/^[A-Za-z0-9_-]+$/,ti=/^[a-z_]+\.[a-z0-9_]+$/;function ei(t){return Qe.find(e=>void 0!==(null==t?void 0:t[e])&&null!==(null==t?void 0:t[e]))}function ii(t){return t.map(t=>"number"==typeof t?`#${t+1}`:t).join(" › ")}function si(t){const e=new Set;for(const n of $t(null==t?void 0:t.variables))n&&"string"==typeof n.name&&e.add(n.name);const i=JSON.stringify(null!=t?t:{}),s=/\[\[([A-Za-z0-9_-]+)/g;for(let n=s.exec(i);n;n=s.exec(i))e.add(n[1]);return[...e]}function ni(t){return"boolean"==typeof t?"boolean":"number"==typeof t?"number":"string"==typeof t&&ti.test(t)?"entity":"string"==typeof t&&/^[a-z]+:[a-z0-9-]+$/.test(t)?"icon":"text"}function ai(t,e,i){if(!e.length)return i;const[s,...n]=e;return Array.isArray(t)?t.map((t,e)=>e===s?ai(t,n,i):t):Object.assign(Object.assign({},t),{[s]:ai(null==t?void 0:t[s],n,i)})}const oi=["card","badge","row","element","group","style","let","default","grid_options","name"],ri="default:",li="or:";function ci(t){if(St.includes(t))return!0;const e=t.indexOf(":");return e>0&&At.includes(t.slice(0,e))}function hi(t){const e=t.indexOf(":");if(e>0){const i=xt(t.slice(0,e),At);return i?`${i}:${t.slice(e+1)}`:void 0}return xt(t,St)}function di(t){return t.startsWith(li)?t.slice(3):jt(t)}function ui(t,e,i){if(!t.includes("[[")&&!t.includes("]]"))return;const s=function(t){let e=0,i=!1;for(let s=0;s<t.length-1;s+=1){const n=t.slice(s,s+2);"[["===n?(e+=1,s+=1):"]]"===n&&(0===e?i=!0:e-=1,s+=1)}return{unclosed:e>0,stray:i}}(t);s.unclosed&&i.findings.push({level:"warning",key:"lint.unclosed",params:{},path:e}),s.stray&&i.findings.push({level:"warning",key:"lint.stray_close",params:{},path:e});let n=t;for(let a=0;a<5;a+=1){let t=!1;if(n=n.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(s,n)=>(t=!0,n.startsWith(kt)||pi(n,e,i),"_")),!t)break}}function pi(t,e,i){const s=t.endsWith("?")?t.slice(0,-1):t,[n,...a]=s.split("|"),o=`[[${t}]]`,r=(n.endsWith("?")?n.slice(0,-1):n).split(".")[0];r&&"_"!==r&&!i.heads.has(r)&&i.heads.set(r,e);let l=!1;for(const c of a){if(!ci(c)){const t=hi(c);i.findings.push({level:"warning",key:"lint.unknown_step",params:t?{step:c,placeholder:o,closest:t}:{step:c,placeholder:o},path:e});continue}(c.startsWith(ri)||c.startsWith(li))&&l&&i.findings.push({level:"warning",key:"lint.after_default",params:{step:c,placeholder:o},path:e}),c.startsWith(ri)&&c.length>8&&(l=!0);const t=di(c);t&&"_"!==t&&i.targets.push({name:t,placeholder:o,path:e})}}function mi(t,e,i){if("string"!=typeof t){if(Array.isArray(t))t.forEach((t,s)=>mi(t,`${e}[${s}]`,i));else if(t&&"object"==typeof t)for(const[s,n]of Object.entries(t))ui(s,e,i),mi(n,e?`${e}.${s}`:s,i)}else ui(t,e,i)}function fi(t){const e=new Set;for(const i of f(t))e.add(i.name);for(const i of[...nt(ft(t)),...nt(null==t?void 0:t.let)]){const t=S(i);void 0!==t&&e.add(t)}return[...e]}const gi={card:{type:"entity",entity:"sun.sun"},badge:{type:"entity",entity:"sun.sun"},row:{entity:"sun.sun"},element:{type:"icon",icon:"mdi:weather-sunny",style:{color:"yellow"}}},_i=50,vi=t=>!!customElements.get(t),yi=t=>t.actions.length>0||t.urls.length>0||t.embeds||t.scripts||t.placeholders||t.overlay;const bi=500;function $i(t){const e=e=>{var i;return t.onInput(null!==(i=e.target.value)&&void 0!==i?i:"")},i=e=>{var i;return null===(i=t.onKeydown)||void 0===i?void 0:i.call(t,e)};return vi("ha-input")?m`<ha-input
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
      ></ha-textfield>`}async function wi(t,e,i,s){var n;if(!L())return t._toolError=p("tools.cannot_save_here",void 0,t.hass),!1;t._busy=!0,t._toolError=void 0;try{return await D(t,t.hass,i,[{urlPath:V(),build:e}],s),t._undoChanged=void 0,!0}catch(a){return t._toolError=p("tools.save_failed",{message:null!==(n=null==a?void 0:a.message)&&void 0!==n?n:a},t.hass),!1}finally{t._busy=!1}}const xi=n`
  ${Ct.styles}
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
 */;let ki=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Si={},Ai=(ji=class extends ki{constructor(){super(...arguments),this.key=Et}render(t,e){return this.key=t,e}update(t,[e,i]){return e!==this.key&&(((t,e=Si)=>{t._$AH=e;
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */})(t),this.key=e),i}},(...t)=>({_$litDirective$:ji,values:t}));var ji;const Oi=[{name:"room_light_tile",summary:"A tile per light, with the light named after itself.",template:{description:"A tile for one light, taking its name from Home Assistant.",variables:[{name:"entity",label:"Light",selector:{entity:{domain:"light"}},required:!0},{name:"name",label:"Name",description:"Leave empty to use the light’s own name",selector:{text:{}}}],card:{type:"tile",entity:"[[entity]]",name:"[[name|or:entity|friendly_name]]",features:[{type:"light-brightness"}]}}},{name:"room_summary",summary:"A heading per area, listing the lights in it. Uses grouping.",template:{description:"One card per area, with a tile for every light in that area.",card:{type:"vertical-stack",cards:[{type:"markdown",content:"## [[area]]\n\n[[entity_count]] lights"},{type:"custom:decluttering-card-plus",template:"room_light_tile",for_each:"[[items]]"}]}}},{name:"sensor_line",summary:"An Entities row showing one sensor with its area.",template:{description:"A row for one sensor, labelled with the area it is in.",variables:[{name:"entity",label:"Sensor",selector:{entity:{}},required:!0}],row:{entity:"[[entity]]",name:"[[entity|friendly_name]] ([[entity|area|default:no area]])"}}},{name:"status_badge",summary:"A badge that only appears when something needs attention.",template:{description:"A badge for one entity, hidden unless it is in the state you care about.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0},{name:"when",label:"Show when the state is",selector:{text:{}},default:"on"}],badge:{type:"entity",entity:"[[entity]]",visibility:[{condition:"state",entity:"[[entity]]",state:"[[when]]"}]}}},{name:"counted_grid",summary:'A numbered grid of anything, showing "3 of 12".',template:{description:"A tile that knows where it sits in a repeat.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0}],card:{type:"tile",entity:"[[entity]]",name:"[[entity|friendly_name]]",footer:{type:"markdown",content:"[[index]] of [[total|or:count]]"}}}}];function Ci(t){return Oi.find(e=>e.name===t)}function Ei(t,e){const i=new Set,s=t=>{Array.isArray(t)?t.forEach(s):t&&"object"==typeof t&&("string"==typeof t.type&&t.type.includes("decluttering-card")&&"string"==typeof t.template&&i.add(t.template),Object.values(t).forEach(s))};return s(t.template),[...i].filter(t=>!e.includes(t))}function Ti(t,e){return{library:t,version:e}}
/*! js-yaml 5.4.3 https://github.com/nodeca/js-yaml @license MIT */var Ni=Symbol("NOT_RESOLVED");function Pi(t,e){return{tagName:t,nodeKind:"scalar",implicit:e.implicit??!1,matchByTagPrefix:e.matchByTagPrefix??!1,implicitFirstChars:e.implicitFirstChars??null,resolve:e.resolve,identify:e.identify,represent:e.represent??(t=>String(t)),representTagName:e.representTagName??(()=>t)}}function Ii(t,e){const i=void 0===e.finalize;return{tagName:t,nodeKind:"sequence",implicit:!1,matchByTagPrefix:e.matchByTagPrefix??!1,create:e.create,addItem:e.addItem,finalize:e.finalize??(t=>t),carrierIsResult:i,identify:e.identify,represent:e.represent??(t=>t),representTagName:e.representTagName??(()=>t)}}function Fi(t,e){const i=void 0===e.finalize;return{tagName:t,nodeKind:"mapping",implicit:!1,matchByTagPrefix:e.matchByTagPrefix??!1,create:e.create,addPair:e.addPair,has:e.has,keys:e.keys,get:e.get,finalize:e.finalize??(t=>t),carrierIsResult:i,identify:e.identify,represent:e.represent??(t=>t),representTagName:e.representTagName??(()=>t)}}var Li=Pi("tag:yaml.org,2002:str",{resolve:t=>t,identify:t=>"string"==typeof t}),Mi=["","~","null","Null","NULL"],Di=Pi("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:t=>-1!==Mi.indexOf(t)?null:Ni,identify:t=>null===t,represent:()=>"null"}),Ri=Pi("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(t,e)=>"null"===t||e&&""===t?null:Ni,identify:t=>null===t,represent:()=>"null"}),Vi=["","~","null","Null","NULL"],zi=Pi("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:t=>-1!==Vi.indexOf(t)?null:Ni,identify:t=>null===t,represent:()=>"null"}),qi=["true","True","TRUE"],Ui=["false","False","FALSE"],Ki=Pi("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:t=>-1!==qi.indexOf(t)||-1===Ui.indexOf(t)&&Ni,identify:t=>"[object Boolean]"===Object.prototype.toString.call(t),represent:t=>t?"true":"false"}),Hi=["true"],Wi=["false"],Ji=Pi("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:t=>-1!==Hi.indexOf(t)||-1===Wi.indexOf(t)&&Ni,identify:t=>"[object Boolean]"===Object.prototype.toString.call(t),represent:t=>t?"true":"false"}),Bi=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],Yi=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],Gi=Pi("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:t=>-1!==Bi.indexOf(t)||-1===Yi.indexOf(t)&&Ni,identify:t=>"[object Boolean]"===Object.prototype.toString.call(t),represent:t=>t?"true":"false"}),Zi=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),Qi=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var Xi=Pi("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(t,e){if(e){if(!Qi.test(t))return Ni}else if(!Zi.test(t))return Ni;const i=function(t){let e=t,i=1;return"-"!==e[0]&&"+"!==e[0]||("-"===e[0]&&(i=-1),e=e.slice(1)),e.startsWith("0b")?i*parseInt(e.slice(2),2):e.startsWith("0o")?i*parseInt(e.slice(2),8):e.startsWith("0x")?i*parseInt(e.slice(2),16):i*parseInt(e,10)}(t);return Number.isFinite(i)?i:Ni},identify:t=>Number.isInteger(t)&&!Object.is(t,-0)&&t.toString(10).indexOf("e")<0,represent:t=>t.toString(10)}),ts=new RegExp("^-?(?:0|[1-9][0-9]*)$"),es=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$");var is=Pi("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(t,e){if(e){if(!es.test(t))return Ni}else if(!ts.test(t))return Ni;const i=function(t){let e=t,i=1;return"-"!==e[0]&&"+"!==e[0]||("-"===e[0]&&(i=-1),e=e.slice(1)),e.startsWith("0b")?i*parseInt(e.slice(2),2):e.startsWith("0o")?i*parseInt(e.slice(2),8):e.startsWith("0x")?i*parseInt(e.slice(2),16):i*parseInt(e,10)}(t);return Number.isFinite(i)?i:Ni},identify:t=>Number.isInteger(t)&&!Object.is(t,-0)&&t.toString(10).indexOf("e")<0,represent:t=>t.toString(10)}),ss=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$");var ns=Pi("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(t){if(!ss.test(t))return Ni;const e=function(t){let e=t.replace(/_/g,""),i=1;if("-"!==e[0]&&"+"!==e[0]||("-"===e[0]&&(i=-1),e=e.slice(1)),e.startsWith("0b"))return i*parseInt(e.slice(2),2);if(e.startsWith("0x"))return i*parseInt(e.slice(2),16);if(e.includes(":")){let t=0;for(const i of e.split(":"))t=60*t+Number(i);return i*t}return"0"!==e&&"0"===e[0]?i*parseInt(e,8):i*parseInt(e,10)}(t);return Number.isFinite(e)?e:Ni},identify:t=>Number.isInteger(t)&&!Object.is(t,-0)&&t.toString(10).indexOf("e")<0,represent:t=>t.toString(10)}),as=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),os=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var rs=Pi("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(t){if(!as.test(t))return Ni;let e=t.toLowerCase();const i="-"===e[0]?-1:1;if("+-".includes(e[0])&&(e=e.slice(1)),".inf"===e)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===e)return NaN;const s=i*parseFloat(e);return Number.isFinite(s)||os.test(t)?s:Ni},identify:t=>"number"==typeof t&&(!Number.isInteger(t)||Object.is(t,-0)||t.toString(10).indexOf("e")>=0),represent:function(t){if(isNaN(t))return".nan";if(t===Number.POSITIVE_INFINITY)return".inf";if(t===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(t,-0))return"-0.0";const e=t.toString(10);return/^[-+]?[0-9]+e/.test(e)?e.replace("e",".e"):e}}),ls=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),cs=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var hs=Pi("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(t,e){if(e){if(!cs.test(t))return Ni;let e=t.toLowerCase();const i="-"===e[0]?-1:1;if("+-".includes(e[0])&&(e=e.slice(1)),".inf"===e)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===e)return NaN;const s=i*parseFloat(e);return Number.isFinite(s)?s:Ni}if(!ls.test(t))return Ni;const i=Number(t);return Number.isFinite(i)?i:Ni},identify:t=>"number"==typeof t&&(!Number.isInteger(t)||Object.is(t,-0)||t.toString(10).indexOf("e")>=0),represent:function(t){if(isNaN(t))return".nan";if(t===Number.POSITIVE_INFINITY)return".inf";if(t===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(t,-0))return"-0.0";const e=t.toString(10);return/^[-+]?[0-9]+e/.test(e)?e.replace("e",".e"):e}}),ds=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),us=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var ps=Pi("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(t){if(!ds.test(t))return Ni;let e=t.toLowerCase().replace(/_/g,"");const i="-"===e[0]?-1:1;if("+-".includes(e[0])&&(e=e.slice(1)),".inf"===e)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===e)return NaN;let s=0;if(e.includes(":")){for(const t of e.split(":"))s=60*s+Number(t);s*=i}else s=i*parseFloat(e);return Number.isFinite(s)||us.test(t)?s:Ni},identify:t=>"number"==typeof t&&(!Number.isInteger(t)||Object.is(t,-0)||t.toString(10).indexOf("e")>=0),represent:function(t){if(isNaN(t))return".nan";if(t===Number.POSITIVE_INFINITY)return".inf";if(t===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(t,-0))return"-0.0";const e=t.toString(10);return/^[-+]?[0-9]+e/.test(e)?e.replace("e",".e"):e}}),ms=Pi("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(t,e)=>"<<"===t||e&&""===t?"<<":Ni,identify:()=>!1}),fs=/^[A-Za-z0-9+/]*={0,2}$/;var gs=Pi("tag:yaml.org,2002:binary",{resolve:function(t){const e=t.replace(/\s/g,"");if(e.length%4!=0||!fs.test(e))return Ni;const i=atob(e),s=new Uint8Array(i.length);for(let n=0;n<i.length;n++)s[n]=i.charCodeAt(n);return s},identify:t=>"[object Uint8Array]"===Object.prototype.toString.call(t),represent:function(t){let e="";for(let i=0;i<t.length;i++)e+=String.fromCharCode(t[i]);return btoa(e)}}),_s=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),vs=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function ys(t,e,i,s=0,n=0,a=0,o=0){const r=new Date(Date.UTC(t,e,i,s,n,a,o));return r.setUTCFullYear(t,e,i),r}var bs=Pi("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(t){let e=_s.exec(t);if(null===e&&(e=vs.exec(t)),null===e)return Ni;const i=+e[1],s=+e[2]-1,n=+e[3];if(!e[4]){const t=ys(i,s,n);return t.getUTCFullYear()!==i||t.getUTCMonth()!==s||t.getUTCDate()!==n?Ni:t}const a=+e[4],o=+e[5],r=+e[6];let l=0;if(a>23||o>59||r>59)return Ni;if(e[7]){let t=e[7].slice(0,3);for(;t.length<3;)t+="0";l=+t}const c=ys(i,s,n,a,o,r,l);if(c.getUTCFullYear()!==i||c.getUTCMonth()!==s||c.getUTCDate()!==n)return Ni;if(e[9]){const t=+e[10],i=+(e[11]||0);if(t>23||i>59)return Ni;const s=6e4*(60*t+i);c.setTime(c.getTime()-("-"===e[9]?-s:s))}return c},identify:t=>t instanceof Date,represent:t=>t.toISOString()}),$s=Ii("tag:yaml.org,2002:seq",{create:()=>[],addItem:(t,e)=>{t.push(e)},identify:Array.isArray});function ws(t){if(null===t||"object"!=typeof t||Array.isArray(t))return!1;const e=Object.getPrototypeOf(t);return null===e||e===Object.prototype}function xs(t,e){const i={};for(const s of e)void 0!==t[s]&&(i[s]=t[s]);return i}var ks=Ii("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(t,e)=>{let i;if(e instanceof Map){if(1!==e.size)return"cannot resolve an ordered map item";i=e.keys().next().value}else{if(!ws(e))return"cannot resolve an ordered map item";{const t=Object.keys(e);if(1!==t.length)return"cannot resolve an ordered map item";i=t[0]}}return t.seen.has(i)?"duplicate key in ordered map":(t.seen.add(i),t.list.push(e),"")},finalize:t=>t.list,identify:()=>!1}),Ss=Ii("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(t,e)=>{if(e instanceof Map)return 1!==e.size?"cannot resolve a pairs item":(t.push(e.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(e))return"cannot resolve a pairs item";const i=e,s=Object.keys(i);return 1!==s.length?"cannot resolve a pairs item":(t.push([s[0],i[s[0]]]),"")},identify:()=>!1}),As=Fi("tag:yaml.org,2002:map",{create:()=>({}),identify:ws,represent:t=>{const e=new Map;for(const i of Object.keys(t))e.set(i,t[i]);return e},addPair:(t,e,i)=>{if(null!==e&&"object"==typeof e)return"object-based map does not support complex keys";const s=String(e);return"__proto__"===s?Object.defineProperty(t,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[s]=i,""},has:(t,e)=>(null===e||"object"!=typeof e)&&Object.prototype.hasOwnProperty.call(t,String(e)),keys:t=>Object.keys(t),get:(t,e)=>{const i=String(e);return Object.prototype.hasOwnProperty.call(t,i)?t[i]:null}}),js=Fi("tag:yaml.org,2002:set",{create:()=>new Set,identify:t=>t instanceof Set,represent:t=>{const e=new Map;for(const i of t)e.set(i,null);return e},addPair:(t,e,i)=>null!==i?"cannot resolve a set item":(t.add(e),""),has:(t,e)=>t.has(e),keys:t=>t.keys(),get:()=>null});var Os=class t{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(t){const e=function(t){const e=[];for(const i of t){let t=e.length;for(let s=0;s<e.length;s++){const n=e[s];if(n.nodeKind===i.nodeKind&&n.tagName===i.tagName&&n.matchByTagPrefix===i.matchByTagPrefix){t=s;break}}e[t]=i}return e}(t),i=[],s={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},n={scalar:[],sequence:[],mapping:[]};for(const c of e){if("scalar"===c.nodeKind&&c.implicit){if(c.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(c)}switch(c.nodeKind){case"scalar":c.matchByTagPrefix?n.scalar.push(c):s.scalar[c.tagName]=c;break;case"sequence":c.matchByTagPrefix?n.sequence.push(c):s.sequence[c.tagName]=c;break;case"mapping":c.matchByTagPrefix?n.mapping.push(c):s.mapping[c.tagName]=c}}const a=i.filter(t=>null===t.implicitFirstChars),o=new Set;for(const c of i)if(null!==c.implicitFirstChars)for(const t of c.implicitFirstChars)o.add(t);const r=new Map;for(const c of o)r.set(c,i.filter(t=>null===t.implicitFirstChars||-1!==t.implicitFirstChars.indexOf(c)));const l=s.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=e,this.implicitScalarTags=i,this.implicitScalarByFirstChar=r,this.implicitScalarAnyFirstChar=a,this.defaultScalarTag=l,this.defaultSequenceTag=s.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=s.mapping["tag:yaml.org,2002:map"],this.exact=s,this.prefix=n}lookupScalarTag(t){const e=this.exact.scalar[t];if(e)return e;for(const i of this.prefix.scalar)if(t.startsWith(i.tagName))return i}lookupSequenceTag(t){const e=this.exact.sequence[t];if(e)return e;for(const i of this.prefix.sequence)if(t.startsWith(i.tagName))return i}lookupMappingTag(t){const e=this.exact.mapping[t];if(e)return e;for(const i of this.prefix.mapping)if(t.startsWith(i.tagName))return i}resolveImplicitScalarTag(t){const e=this.implicitScalarByFirstChar.get(t.charAt(0))??this.implicitScalarAnyFirstChar;for(const s of e){const e=s.resolve(t,!1,s.tagName);if(e!==Ni)return{value:e,tag:s}}const i=this.defaultScalarTag;return{value:i.resolve(t,!1,i.tagName),tag:i}}withTags(...e){let i=[];for(const t of e)i=i.concat(t);return new t([...this.tags,...i])}},Cs=new Os([Li,$s,As]);new Os([...Cs.tags,Ri,Ji,is,hs]);var Es=new Os([...Cs.tags,Di,Ki,Xi,rs]);function Ts(t){if(Array.isArray(t)){const e=Array.prototype.slice.call(t);for(let t=0;t<e.length;t++){if(Array.isArray(e[t]))return null;"object"==typeof e[t]&&"[object Object]"===Object.prototype.toString.call(e[t])&&(e[t]="[object Object]")}return String(e)}return"object"==typeof t&&"[object Object]"===Object.prototype.toString.call(t)?"[object Object]":String(t)}new Os([...Cs.tags,zi,Gi,ns,ps,bs,ms,gs,ks,Ss,js]).withTags({...ns,resolve:(t,e,i)=>{const s=ns.resolve(t,e,i);return s===Ni?Xi.resolve(t,e,i):s}},{...ps,resolve:(t,e,i)=>{const s=ps.resolve(t,e,i);return s===Ni?rs.resolve(t,e,i):s}}),Fi("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(t,e,i)=>(t.set(e,i),""),has:(t,e)=>t.has(e),keys:t=>t.keys(),get:(t,e)=>t.get(e),identify:t=>t instanceof Map||ws(t),represent:t=>{if(t instanceof Map)return t;const e=new Map,i=t;for(const s of Object.keys(i))e.set(s,i[s]);return e}}),Fi("tag:yaml.org,2002:map",{create:()=>({}),identify:ws,represent:t=>{const e=new Map;for(const i of Object.keys(t))e.set(i,t[i]);return e},addPair:(t,e,i)=>{const s=Ts(e);return null===s?"nested arrays are not supported inside keys":("__proto__"===s?Object.defineProperty(t,s,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[s]=i,"")},has:(t,e)=>{const i=Ts(e);return null!==i&&Object.prototype.hasOwnProperty.call(t,i)},keys:t=>Object.keys(t),get:(t,e)=>{const i=String(e);return Object.prototype.hasOwnProperty.call(t,i)?t[i]:null}});var Ns={maxLength:79,indent:1,linesBefore:3,linesAfter:2};function Ps(t,e,i,s,n){let a="",o="";const r=Math.floor(n/2)-1;return s-e>r&&(a=" ... ",e=s-r+a.length),i-s>r&&(o=" ...",i=s+r-o.length),{str:a+t.slice(e,i).replace(/\t/g,"→")+o,pos:s-e+a.length}}function Is(t,e){return" ".repeat(Math.max(e-t.length,0))+t}function Fs(t,e){let i="";return t.mark?(t.mark.name&&(i+=`in "${t.mark.name}" `),i+=`(${t.mark.line+1}:${t.mark.column+1})`,!e&&t.mark.snippet&&(i+=`\n\n${t.mark.snippet}`),`${t.reason} ${i}`):t.reason}var Ls=class t extends Error{reason;mark;constructor(t,e){super(),this.name="YAMLException",this.reason=t,this.mark=e,this.message=Fs(this,!1),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}toString(t){return`${this.name}: ${Fs(this,t)}`}static throwAt(e,i,s,n=""){let a=0,o=0;for(let t=0;t<i;t++){const i=e.charCodeAt(t);10===i?(a++,o=t+1):13===i&&(a++,10===e.charCodeAt(t+1)&&t++,o=t+1)}const r={name:n,buffer:e,position:i,line:a,column:i-o};throw r.snippet=function(t,e){if(!t.buffer)return null;const i={...Ns,...e},s=/\r?\n|\r|\0/g,n=[0],a=[];let o,r=-1;for(;o=s.exec(t.buffer);)a.push(o.index),n.push(o.index+o[0].length),t.position<=o.index&&r<0&&(r=n.length-2);r<0&&(r=n.length-1);let l="";const c=Math.min(t.line+i.linesAfter,a.length).toString().length,h=i.maxLength-(i.indent+c+3);for(let u=1;u<=i.linesBefore&&!(r-u<0);u++){const e=Ps(t.buffer,n[r-u],a[r-u],t.position-(n[r]-n[r-u]),h);l=`${" ".repeat(i.indent)}${Is((t.line-u+1).toString(),c)} | ${e.str}\n${l}`}const d=Ps(t.buffer,n[r],a[r],t.position,h);l+=`${" ".repeat(i.indent)}${Is((t.line+1).toString(),c)} | ${d.str}\n`,l+=`${"-".repeat(i.indent+c+3+d.pos)}^\n`;for(let u=1;u<=i.linesAfter&&!(r+u>=a.length);u++){const e=Ps(t.buffer,n[r+u],a[r+u],t.position-(n[r]-n[r+u]),h);l+=`${" ".repeat(i.indent)}${Is((t.line+u+1).toString(),c)} | ${e.str}\n`}return l.replace(/\n$/,"")}(r),new t(s,r)}},Ms=1,Ds=2,Rs=3,Vs=4,zs=5,qs=6,Us=1,Ks=2,Hs=3,Ws=4,Js=5,Bs=1,Ys=2,Gs=1,Zs=2,Qs=3;function Xs(t){switch(t){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}var tn=new Array(256),en=new Array(256);for(let Jo=0;Jo<256;Jo++)tn[Jo]=Xs(Jo)?1:0,en[Jo]=Xs(Jo);function sn(t){return t<=65535?String.fromCharCode(t):String.fromCharCode(55296+(t-65536>>10),56320+(t-65536&1023))}function nn(t){return t>=48&&t<=57?t-48:(32|t)-97+10}function an(t){return 120===t?2:117===t?4:8}function on(t,e,i){let s=0;for(;e<i;){const i=t.charCodeAt(e);if(10===i)s++,e++;else if(13===i)s++,e++,10===t.charCodeAt(e)&&e++;else{if(32!==i&&9!==i)break;e++}}return{position:e,breaks:s}}function rn(t){return 1===t?" ":"\n".repeat(t-1)}function ln(t,e,i,s,n,a){const o=s<0?0:s,r=t.slice(e,i).replace(/\r\n?/g,"\n"),l=""===r?[]:(r.endsWith("\n")?r.slice(0,-1):r).split("\n");let c="",h=!1,d=0,u=!1;for(const p of l){let t=0;for(;t<o&&32===p.charCodeAt(t);)t++;if(s<0||t>=p.length){d++;continue}const e=p.slice(o),i=e.charCodeAt(0);a?32===i||9===i?(u=!0,c+="\n".repeat(h?1+d:d)):u?(u=!1,c+="\n".repeat(d+1)):0===d?h&&(c+=" "):c+="\n".repeat(d):c+="\n".repeat(h?1+d:d),c+=e,h=!0,d=0}return n===Qs?c+="\n".repeat(h?1+d:d):n!==Zs&&h&&(c+="\n"),c}function cn(t,e){if(-1===e.valueStart)return"";const{valueStart:i,valueEnd:s}=e;if(e.fast)return t.slice(i,s);switch(e.style){case Ks:return function(t,e,i){let s="",n=e,a=e,o=e;for(;n<i;){const e=t.charCodeAt(n);if(39===e)s+=t.slice(a,n)+"'",n+=2,a=o=n;else if(10===e||13===e){s+=t.slice(a,o);const e=on(t,n,i);s+=rn(e.breaks),n=a=o=e.position}else n++,32!==e&&9!==e&&(o=n)}return s+t.slice(a,i)}(t,i,s);case Hs:return function(t,e,i){let s="",n=e,a=e,o=e;for(;n<i;){const e=t.charCodeAt(n);if(92===e){s+=t.slice(a,n),n++;const e=t.charCodeAt(n);if(10===e||13===e)n=on(t,n,i).position;else if(e<256&&tn[e])s+=en[e],n++;else{let i=an(e),a=0;for(;i>0;i--)n++,a=(a<<4)+nn(t.charCodeAt(n));s+=sn(a),n++}a=o=n}else if(10===e||13===e){s+=t.slice(a,o);const e=on(t,n,i);s+=rn(e.breaks),n=a=o=e.position}else n++,32!==e&&9!==e&&(o=n)}return s+t.slice(a,i)}(t,i,s);case Ws:return ln(t,i,s,e.indent,e.chomping,!1);case Js:return ln(t,i,s,e.indent,e.chomping,!0);default:return function(t,e,i){let s="",n=e,a=e,o=e;for(;n<i;){const e=t.charCodeAt(n);if(10===e||13===e){s+=t.slice(a,o);const e=on(t,n,i);s+=rn(e.breaks),n=a=o=e.position}else n++,32!==e&&9!==e&&(o=n)}return s+t.slice(a,o)}(t,i,s)}}var hn=Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"});function dn(t,e){if(t.startsWith("!<")&&t.endsWith(">"))return decodeURIComponent(t.slice(2,-1));const i=t.indexOf("!",1),s=-1===i?"!":t.slice(0,i+1),n=e?.[s]??hn[s]??s;return decodeURIComponent(n)+decodeURIComponent(t.slice(s.length))}var un=-1,pn={filename:"",schema:Es,json:!1,maxTotalMergeKeys:1e4,maxAliases:-1};function mn(t){return"tagStart"in t&&t.tagStart!==un?t.tagStart:"anchorStart"in t&&t.anchorStart!==un?t.anchorStart:"valueStart"in t&&t.valueStart!==un?t.valueStart:"start"in t?t.start:0}function fn(t,e){Ls.throwAt(t.source,t.position,e,t.filename)}function gn(t,e,i,s){try{return i.finalize(s)}catch(n){if(n instanceof Ls)throw n;Ls.throwAt(t.source,e,n instanceof Error?n.message:String(n),t.filename)}}function _n(t,e){const i=cn(t.source,e),s=e.tagStart===un?"":t.source.slice(e.tagStart,e.tagEnd),n=t.schema.defaultScalarTag;if(""!==s){if("!"===s)return{value:i,tag:n};const e=dn(s,t.tagHandlers),a=t.schema.lookupScalarTag(e);if(a){const s=a.resolve(i,!0,e);return s===Ni&&fn(t,`cannot resolve a node with !<${e}> explicit tag`),{value:s,tag:a}}const o=t.schema.lookupMappingTag(e)??t.schema.lookupSequenceTag(e);if(o){""!==i&&fn(t,`cannot resolve a node with !<${e}> explicit tag`);const s=o.create(e);return{value:o.carrierIsResult?s:gn(t,t.position,o,s),tag:o}}fn(t,`unknown scalar tag !<${e}>`)}return e.style===Us?t.schema.resolveImplicitScalarTag(i):{value:n.resolve(i,!1,n.tagName),tag:n}}function vn(t,e,i){const s=e.tagStart===un?"":t.source.slice(e.tagStart,e.tagEnd);return""===s||"!"===s?i:dn(s,t.tagHandlers)}function yn(t){return"mapping"===t.nodeKind}function bn(t){t.totalMergeKeys++,-1!==t.maxTotalMergeKeys&&t.totalMergeKeys>t.maxTotalMergeKeys&&fn(t,`merge keys exceeded maxTotalMergeKeys (${t.maxTotalMergeKeys})`)}function $n(t,e,i,s){bn(t);for(const n of s.keys(i)){if(bn(t),e.tag.has(e.value,n))continue;const a=e.tag.addPair(e.value,n,s.get(i,n));a&&fn(t,a),e.overridable??=new Set,e.overridable.add(n)}}function wn(t,e,i,s,n){if(t.position=e.keyPosition,e.keyIsMerge)return void function(t,e,i,s){if(t.position=e.keyPosition,yn(s))$n(t,e,i,s);else if("sequence"===s.nodeKind&&Array.isArray(i)){i.length>100&&fn(t,"abnormal merge sequence size");for(const s of i){const i=t.nodeTags.get(s);i||fn(t,"cannot merge mappings; the provided source object is unacceptable"),$n(t,e,s,i)}}else fn(t,"cannot merge mappings; the provided source object is unacceptable")}(t,e,s,n);t.json||!e.tag.has(e.value,i)||e.overridable?.has(i)||fn(t,"duplicated mapping key");const a=e.tag.addPair(e.value,i,s);a&&fn(t,a),e.overridable?.delete(i)}function xn(t,e,i){const s=t.frames[t.frames.length-1];if("document"===s.kind)s.value=e,s.hasValue=!0;else if("sequence"===s.kind){yn(i)&&t.nodeTags.set(e,i);const n=s.tag.addItem(s.value,e,s.index++);n&&fn(t,n)}else if(s.hasKey){const n=s.key;s.key=void 0,s.hasKey=!1,wn(t,s,n,e,i)}else s.key=e,s.keyPosition=t.position,s.hasKey=!0,s.keyIsMerge="tag:yaml.org,2002:merge"===i.tagName}function kn(t,e,i,s,n){if(e.anchorStart!==un){const a={value:i,tag:s,isValueFinal:n};return t.anchors.set(t.source.slice(e.anchorStart,e.anchorEnd),a),a}return null}var Sn=-1,An=Object.prototype.hasOwnProperty,jn=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,On=/[,\[\]{}]/,Cn=/^(?:!|!!|![0-9A-Za-z-]+!)$/,En=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,Tn=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`,Nn=new RegExp(`^(?:${En})*$`),Pn=new RegExp(`^(?:${Tn})+$`),In=new RegExp(`^(?:!(?:${En})*|${Tn}(?:${En})*)$`),Fn={filename:"",maxDepth:100};function Ln(t,e,i,s,n,a,o){t.events.push({type:Ds,start:e,anchorStart:i,anchorEnd:s,tagStart:n,tagEnd:a,style:o})}function Mn(t,e,i,s,n,a,o){t.events.push({type:Rs,start:e,anchorStart:i,anchorEnd:s,tagStart:n,tagEnd:a,style:o})}function Dn(t,e){t.events.splice(e.eventsLength,0,{type:Rs,start:e.position,anchorStart:Sn,anchorEnd:Sn,tagStart:Sn,tagEnd:Sn,style:Ys})}function Rn(t,e,i,s,n,a,o,r,l=Gs,c=-1,h=!1){t.events.push({type:Vs,valueStart:e,valueEnd:i,anchorStart:s,anchorEnd:n,tagStart:a,tagEnd:o,style:r,chomping:l,indent:c,fast:h})}function Vn(t){t.events.push({type:qs})}function zn(t){Rn(t,Sn,Sn,Sn,Sn,Sn,Sn,Us)}function qn(){return{anchorStart:Sn,anchorEnd:Sn,tagStart:Sn,tagEnd:Sn}}function Un(t){return{position:t.position,line:t.line,lineStart:t.lineStart,lineIndent:t.lineIndent,firstTabInLine:t.firstTabInLine,eventsLength:t.events.length}}function Kn(t,e){t.position=e.position,t.line=e.line,t.lineStart=e.lineStart,t.lineIndent=e.lineIndent,t.firstTabInLine=e.firstTabInLine,t.events.length=e.eventsLength}function Hn(t,e){Ls.throwAt(t.input.slice(0,t.length),t.position,e,t.filename)}function Wn(t){return 10===t||13===t}function Jn(t){return 9===t||32===t}function Bn(t){return Jn(t)||Wn(t)}function Yn(t){return 0===t||Bn(t)}function Gn(t){return 44===t||91===t||93===t||123===t||125===t}function Zn(t){return t>=48&&t<=57?t-48:-1}function Qn(t){if(t>=48&&t<=57)return t-48;const e=32|t;return e>=97&&e<=102?e-97+10:-1}function Xn(t){return 120===t?2:117===t?4:85===t?8:0}function ta(t){return 48===t||97===t||98===t||116===t||9===t||110===t||118===t||102===t||114===t||101===t||32===t||34===t||47===t||92===t||78===t||95===t||76===t||80===t}function ea(t){10===t.input.charCodeAt(t.position)?t.position++:(t.position++,10===t.input.charCodeAt(t.position)&&t.position++),t.line++,t.lineStart=t.position,t.lineIndent=0,t.firstTabInLine=-1}function ia(t,e){let i=0,s=t.input.charCodeAt(t.position),n=t.position===t.lineStart||Bn(t.input.charCodeAt(t.position-1));for(;0!==s;){for(;Jn(s);)n=!0,9===s&&-1===t.firstTabInLine&&(t.firstTabInLine=t.position),s=t.input.charCodeAt(++t.position);if(e&&n&&35===s)do{s=t.input.charCodeAt(++t.position)}while(!Wn(s)&&0!==s);if(!Wn(s))break;for(ea(t),i++,n=!0,s=t.input.charCodeAt(t.position);32===s;)t.lineIndent++,s=t.input.charCodeAt(++t.position)}return i}function sa(t,e=t.position){const i=t.input.charCodeAt(e);if((45===i||46===i)&&i===t.input.charCodeAt(e+1)&&i===t.input.charCodeAt(e+2)){const i=t.input.charCodeAt(e+3);return 0===i||Bn(i)}return!1}function na(t){t.position===t.lineStart&&65279===t.input.charCodeAt(t.position)&&(t.position++,t.lineStart=t.position)}function aa(t){if(t.position!==t.lineStart)return!1;if(sa(t))return!0;if(65279!==t.input.charCodeAt(t.position))return!1;const e=Un(t);na(t),ia(t,!0);const i=t.input.charCodeAt(t.position),s=t.position===t.lineStart&&(37===i||45===i&&sa(t));return Kn(t,e),s}function oa(t){let e=t.input.charCodeAt(t.position);for(;0!==e&&!Wn(e);)e=t.input.charCodeAt(++t.position)}function ra(t,e,i){jn.test(t.input.slice(e,i))&&Hn(t,"the stream contains non-printable characters")}function la(t,e,i){if(33!==t.input.charCodeAt(t.position))return!1;e.tagStart!==Sn&&Hn(t,"duplication of a tag property");const s=t.position;let n=!1,a=!1,o="!",r=t.input.charCodeAt(++t.position);60===r?(n=!0,r=t.input.charCodeAt(++t.position)):33===r&&(a=!0,o="!!",r=t.input.charCodeAt(++t.position));let l,c=t.position;if(n){for(;0!==r&&62!==r;)r=t.input.charCodeAt(++t.position);62!==r&&Hn(t,"unexpected end of the stream within a verbatim tag"),l=t.input.slice(c,t.position),t.position++}else{for(;!(0===r||Bn(r)||i&&Gn(r));)33===r&&(a?Hn(t,"tag suffix cannot contain exclamation marks"):(o=t.input.slice(c-1,t.position+1),Cn.test(o)||Hn(t,"named tag handle cannot contain such characters"),a=!0,c=t.position+1)),r=t.input.charCodeAt(++t.position);l=t.input.slice(c,t.position),On.test(l)&&Hn(t,"tag suffix cannot contain flow indicator characters")}return l&&!(n?Nn.test(l):Pn.test(l))&&Hn(t,`tag name cannot contain such characters: ${l}`),n||"!"===o||"!!"===o||An.call(t.tagHandlers,o)||Hn(t,`undeclared tag handle "${o}"`),e.tagStart=s,e.tagEnd=t.position,!0}function ca(t,e){if(38!==t.input.charCodeAt(t.position))return!1;e.anchorStart!==Sn&&Hn(t,"duplication of an anchor property"),t.position++;const i=t.position;for(;0!==t.input.charCodeAt(t.position)&&!Bn(t.input.charCodeAt(t.position))&&!Gn(t.input.charCodeAt(t.position));)t.position++;return t.position===i&&Hn(t,"name of an anchor node must contain at least one character"),e.anchorStart=i,e.anchorEnd=t.position,!0}function ha(t,e){if(42!==t.input.charCodeAt(t.position))return!1;e.anchorStart===Sn&&e.tagStart===Sn||Hn(t,"alias node should not have any properties"),t.position++;const i=t.position;for(;0!==t.input.charCodeAt(t.position)&&!Bn(t.input.charCodeAt(t.position))&&!Gn(t.input.charCodeAt(t.position));)t.position++;return t.position===i&&Hn(t,"name of an alias node must contain at least one character"),function(t,e,i){t.events.push({type:zs,anchorStart:e,anchorEnd:i})}(t,i,t.position),!0}function da(t,e){ia(t,!1),t.lineIndent<e&&Hn(t,"deficient indentation")}function ua(t,e,i,s){if(!function(t,e){const i=t.input.charCodeAt(t.position),s=1===e;if(0===i||Bn(i)||35===i||38===i||42===i||33===i||124===i||62===i||39===i||34===i||37===i||64===i||96===i||s&&Gn(i))return!1;if(63===i||45===i){const e=t.input.charCodeAt(t.position+1);if(Yn(e)||s&&Gn(e))return!1}return!0}(t,i))return!1;const n=t.position;let a=t.position,o=t.input.charCodeAt(t.position);const r=1===i;let l=!1;for(;0!==o&&!aa(t);){if(58===o){const e=t.input.charCodeAt(t.position+1);if(Yn(e)||r&&Gn(e))break}else if(35===o){if(Bn(t.input.charCodeAt(t.position-1)))break}else{if(r&&Gn(o))break;if(Wn(o)){const i=t.position,s=t.line,n=t.lineStart,a=t.lineIndent;if(ia(t,!1),t.lineIndent>=e){l=!0,o=t.input.charCodeAt(t.position);continue}t.position=i,t.line=s,t.lineStart=n,t.lineIndent=a;break}}Jn(o)||(a=t.position+1),o=t.input.charCodeAt(++t.position)}return a!==n&&(ra(t,n,a),Rn(t,n,a,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,Us,Gs,-1,!l),!0)}function pa(t,e){const i=t.line;ia(t,!0),(t.line>i&&t.lineIndent<e||-1!==t.firstTabInLine&&t.lineIndent<e)&&Hn(t,"deficient indentation")}function ma(t,e,i){if(-1!==t.firstTabInLine||45!==t.input.charCodeAt(t.position)||!Yn(t.input.charCodeAt(t.position+1)))return!1;for(Ln(t,t.position,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Bs);45===t.input.charCodeAt(t.position)&&Yn(t.input.charCodeAt(t.position+1));){-1!==t.firstTabInLine&&(t.position=t.firstTabInLine,Hn(t,"tab characters must not be used in indentation"));const i=t.line;t.position++;const s=ia(t,!0)>0;if(-1!==t.firstTabInLine&&45===t.input.charCodeAt(t.position)&&Yn(t.input.charCodeAt(t.position+1))&&Hn(t,"bad indentation of a sequence entry"),s&&t.lineIndent<=e?zn(t):ga(t,e,3,!1,!0),ia(t,!0),t.lineIndent<e||t.position>=t.length)break;t.lineIndent>e&&Hn(t,"bad indentation of a sequence entry"),t.line===i&&45===t.input.charCodeAt(t.position)&&Yn(t.input.charCodeAt(t.position+1))&&Hn(t,"bad indentation of a sequence entry")}return Vn(t),!0}function fa(t,e,i,s){let n=!1,a=!1,o=!1,r=!1;if(-1!==t.firstTabInLine)return!1;let l=t.input.charCodeAt(t.position);for(;0!==l;){n||-1===t.firstTabInLine||(t.position=t.firstTabInLine,Hn(t,"tab characters must not be used in indentation"));const c=t.input.charCodeAt(t.position+1),h=t.line;if(63!==l&&58!==l||!Yn(c)){n&&(zn(t),n=!1);const e=Un(t);if(!ga(t,i,2,!1,!0))break;if(t.line===h){for(l=t.input.charCodeAt(t.position);Jn(l);)l=t.input.charCodeAt(++t.position);if(58===l)l=t.input.charCodeAt(++t.position),Yn(l)||Hn(t,"a whitespace character is expected after the key-value separator within a block mapping"),o||(t.events.splice(e.eventsLength,0,{type:Rs,start:e.position,anchorStart:s.anchorStart,anchorEnd:s.anchorEnd,tagStart:s.tagStart,tagEnd:s.tagEnd,style:Bs}),o=!0),a=!0,n=!1,r=!1;else{if(!a)return s.anchorStart===Sn&&s.tagStart===Sn||(Kn(t,e),!1);Hn(t,"expected ':' after a mapping key")}}else{if(!a)return s.anchorStart===Sn&&s.tagStart===Sn||(Kn(t,e),!1);Hn(t,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else o||(Mn(t,t.position,s.anchorStart,s.anchorEnd,s.tagStart,s.tagEnd,Bs),o=!0),63===l?(n&&zn(t),a=!0,n=!0):(n||(zn(t),a=!0),n=!1),t.position+=1,r=!0;if(ga(t,e,4,!0,r)&&(r=!1),n||r&&(zn(t),r=!1),ia(t,!0),l=t.input.charCodeAt(t.position),(t.line===h||t.lineIndent>e)&&0!==l)Hn(t,"bad indentation of a mapping entry");else if(t.lineIndent<e)break}return!!a&&(n&&zn(t),o&&Vn(t),!0)}function ga(t,e,i,s,n,a=!0){t.depth>=t.maxDepth&&Hn(t,`nesting exceeded maxDepth (${t.maxDepth})`),t.depth++;let o=1,r=!1,l=!1,c=null;const h=qn();let d=4===i||3===i,u=d;const p=d;if(s&&ia(t,!0)&&(r=!0,o=t.lineIndent>e?1:t.lineIndent===e?0:-1),1===o)for(;;){const s=t.input.charCodeAt(t.position),n=Un(t);if(r&&1!==o&&(33===s||38===s))break;if(r&&p&&(h.tagStart!==Sn||h.anchorStart!==Sn)&&(33===s||38===s)){const i=Un(t),s=e+1;if(fa(t,t.position-t.lineStart,s,h)&&t.events[i.eventsLength]?.type===Rs)return t.depth--,!0;Kn(t,i)}if(r&&(33===s&&h.tagStart!==Sn||38===s&&h.anchorStart!==Sn))break;if(!la(t,h,1===i)&&!ca(t,h))break;null===c&&(c=n),ia(t,!0)?(r=!0,u=p,o=t.lineIndent>e?1:t.lineIndent===e?0:-1):u=!1}if(u&&(u=r||n),1===o||4===i){const s=1===i||2===i?e:e+1,n=t.position-t.lineStart;if(1===o)if(u&&(ma(t,n,h)||fa(t,n,s,h))||function(t,e,i){const s=t.input.charCodeAt(t.position),n=123===s,a=t.position;let o=!0;if(91!==s&&123!==s)return!1;const r=n?125:93;for(n?Mn(t,a,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Ys):Ln(t,a,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Ys),t.position++;0!==t.input.charCodeAt(t.position);){pa(t,e);let i=t.input.charCodeAt(t.position);if(i===r)return t.position++,Vn(t),!0;o?44===i&&Hn(t,"expected the node content, but found ','"):Hn(t,"missed comma between flow collection entries");let s=!1,a=!1;63===i&&Bn(t.input.charCodeAt(t.position+1))&&(s=a=!0,t.position+=1,pa(t,e));const l=t.line,c=Un(t),h=ga(t,e,1,!1,!0);pa(t,e),i=t.input.charCodeAt(t.position),(n||a||t.line===l)&&58===i?(s=!0,t.position++,pa(t,e),n||Dn(t,c),h||zn(t),ga(t,e,1,!1,!0)||zn(t),pa(t,e),n||Vn(t)):n&&s?(h||zn(t),zn(t)):n?zn(t):s&&(Dn(t,c),h||zn(t),zn(t),Vn(t)),i=t.input.charCodeAt(t.position),44===i?(o=!0,t.position++):o=!1}Hn(t,"unexpected end of the stream within a flow collection")}(t,s,h))l=!0;else{const e=t.input.charCodeAt(t.position);if(null!==c&&a&&p&&!u&&124!==e&&62!==e){const e=Un(t),i=c.position-c.lineStart;Kn(t,c),fa(t,i,s,qn())&&t.events[e.eventsLength]?.type===Rs?l=!0:Kn(t,e)}!l&&(d&&function(t,e,i){const s=t.input.charCodeAt(t.position);let n=Gs,a=-1,o=!1;if(124!==s&&62!==s)return!1;const r=124===s?Ws:Js;for(t.position++;0!==t.input.charCodeAt(t.position);){const i=t.input.charCodeAt(t.position),s=Zn(i);if(43===i||45===i)n!==Gs&&Hn(t,"repeat of a chomping mode identifier"),n=43===i?Qs:Zs,t.position++;else{if(!(s>=0))break;0===s&&Hn(t,"bad explicit indentation width of a block scalar; it cannot be less than one"),o&&Hn(t,"repeat of an indentation width identifier"),a=e+s-1,o=!0,t.position++}}let l=!1;for(;Jn(t.input.charCodeAt(t.position));)l=!0,t.position++;l&&35===t.input.charCodeAt(t.position)&&oa(t),Wn(t.input.charCodeAt(t.position))?ea(t):0!==t.input.charCodeAt(t.position)&&Hn(t,"a line break is expected");let c=o?a:-1,h=0;const d=t.position;let u=t.position;for(;0!==t.input.charCodeAt(t.position);){const i=t.position;let s=0;for(;32===t.input.charCodeAt(i+s);)s++;const n=t.input.charCodeAt(i+s);if(0===n){c>=0?s>c&&(u=i+s):s>0&&(u=i+s);break}if(aa(t))break;if(!o&&-1===c&&Wn(n)&&(h=Math.max(h,s)),o||-1!==c||Wn(n)||(9===n&&s<e&&(t.position=i+s,Hn(t,"tab characters must not be used in indentation")),s>=e&&s<h&&(t.position=i+s,Hn(t,"bad indentation of a mapping entry"))),-1===c&&0!==n&&!Wn(n)&&s<e){t.lineIndent=s,t.position=i+s;break}o||0===n||Wn(n)||-1!==c||(c=s);const a=-1===c?e+1:c;if(0!==n&&!Wn(n)&&s<a){t.lineIndent=s,t.position=i+s;break}oa(t),u=t.position,Wn(t.input.charCodeAt(t.position))&&(ea(t),u=t.position)}return ra(t,d,u),Rn(t,d,u,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,r,n,c),!0}(t,s,h)||function(t,e,i){if(39!==t.input.charCodeAt(t.position))return!1;t.position++;const s=t.position;let n=!0;for(;0!==t.input.charCodeAt(t.position);){const a=t.input.charCodeAt(t.position);if(39===a){if(39===t.input.charCodeAt(t.position+1)){n=!1,t.position+=2;continue}const e=t.position;return t.position++,Rn(t,s,e,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Ks,Gs,-1,n),!0}Wn(a)?(n=!1,da(t,e)):t.position===t.lineStart&&sa(t)?Hn(t,"unexpected end of the document within a single quoted scalar"):9!==a&&a<32?Hn(t,"expected valid JSON character"):t.position++}Hn(t,"unexpected end of the stream within a single quoted scalar")}(t,s,h)||function(t,e,i){if(34!==t.input.charCodeAt(t.position))return!1;t.position++;const s=t.position;let n=!0;for(;0!==t.input.charCodeAt(t.position);){const a=t.input.charCodeAt(t.position);if(34===a){const e=t.position;return t.position++,Rn(t,s,e,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,Hs,Gs,-1,n),!0}if(92===a){n=!1;const i=t.input.charCodeAt(++t.position);if(Wn(i))da(t,e);else if(ta(i))t.position++;else{let e=Xn(i);for(0===e&&Hn(t,"unknown escape sequence");e-- >0;)t.position++,Qn(t.input.charCodeAt(t.position))<0&&Hn(t,"expected hexadecimal character");t.position++}}else Wn(a)?(n=!1,da(t,e)):t.position===t.lineStart&&sa(t)?Hn(t,"unexpected end of the document within a double quoted scalar"):9!==a&&a<32?Hn(t,"expected valid JSON character"):t.position++}Hn(t,"unexpected end of the stream within a double quoted scalar")}(t,s,h)||ha(t,h)||ua(t,s,i,h))&&(l=!0)}else 0===o&&(l=u&&ma(t,n,h))}return d=d&&!l,l||h.anchorStart===Sn&&h.tagStart===Sn&&!d||(Rn(t,Sn,Sn,h.anchorStart,h.anchorEnd,h.tagStart,h.tagEnd,Us),l=!0),t.depth--,l||h.anchorStart!==Sn||h.tagStart!==Sn}function _a(t){if(t.lineIndent>0||37!==t.input.charCodeAt(t.position))return!1;t.position++;const e=t.position;for(;0!==t.input.charCodeAt(t.position)&&!Bn(t.input.charCodeAt(t.position));)t.position++;const i=t.input.slice(e,t.position),s=[];for(0===i.length&&Hn(t,"directive name must not be less than one character in length");0!==t.input.charCodeAt(t.position)&&!Wn(t.input.charCodeAt(t.position));){for(;Jn(t.input.charCodeAt(t.position));)t.position++;if(35===t.input.charCodeAt(t.position)||Wn(t.input.charCodeAt(t.position))||0===t.input.charCodeAt(t.position))break;const e=t.position;for(;0!==t.input.charCodeAt(t.position)&&!Bn(t.input.charCodeAt(t.position));)t.position++;s.push(t.input.slice(e,t.position))}if(Wn(t.input.charCodeAt(t.position))&&ea(t),"YAML"===i){t.directives.some(t=>"yaml"===t.kind)&&Hn(t,"duplication of %YAML directive"),1!==s.length&&Hn(t,"YAML directive accepts exactly one argument");const e=/^([0-9]+)\.([0-9]+)$/.exec(s[0]);null===e&&Hn(t,"ill-formed argument of the YAML directive"),1!==parseInt(e[1],10)&&Hn(t,"unacceptable YAML version of the document"),t.directives.push({kind:"yaml",version:s[0]})}else if("TAG"===i){2!==s.length&&Hn(t,"TAG directive accepts exactly two arguments");const[e,i]=s;Cn.test(e)||Hn(t,"ill-formed tag handle (first argument) of the TAG directive"),An.call(t.tagHandlers,e)&&Hn(t,`there is a previously declared suffix for "${e}" tag handle`),In.test(i)||Hn(t,"ill-formed tag prefix (second argument) of the TAG directive"),t.tagHandlers[e]=i,t.directives.push({kind:"tag",handle:e,prefix:i})}return!0}function va(t){t.directives=[],t.tagHandlers=Object.create(null);let e=!1;for(ia(t,!0);_a(t);)e=!0,ia(t,!0);let i=!1,s=!1,n=!0;if(0===t.lineIndent&&45===t.input.charCodeAt(t.position)&&45===t.input.charCodeAt(t.position+1)&&45===t.input.charCodeAt(t.position+2)&&Yn(t.input.charCodeAt(t.position+3))){i=!0;const e=t.line;t.position+=3,ia(t,!0),n=t.line>e}else e&&Hn(t,"directives end mark is expected");const a=t.events.length;if(!i&&t.position===t.lineStart&&46===t.input.charCodeAt(t.position)&&sa(t))return t.position+=3,void ia(t,!0);if(function(t,e,i){t.events.push({type:Ms,explicitStart:e,explicitEnd:i,directives:t.directives})}(t,i,!1),ga(t,t.lineIndent-1,4,!1,n,n)||zn(t),ia(t,!0),t.position===t.lineStart&&sa(t)&&(s=46===t.input.charCodeAt(t.position),s)){const e=t.line;t.position+=3,ia(t,!0),t.line===e&&t.position<t.length&&Hn(t,"end of the stream or a document separator is expected")}const o=t.events[a];o?.type===Ms&&(o.explicitEnd=s),Vn(t),!s&&t.position<t.length&&!aa(t)&&Hn(t,"end of the stream or a document separator is expected")}var ya={...Fn,...pn};function ba(t,e={}){const i={...ya,...e},s=String(t),n=Object.keys(Fn),a=Object.keys(pn);return function(t,e){const i={...pn,...e,events:t,documents:[],eventIndex:0,position:0,frames:[],anchors:new Map,nodeTags:new Map,tagHandlers:Object.create(null),totalMergeKeys:0,aliasCount:0};for(;i.eventIndex<i.events.length;){const t=i.events[i.eventIndex++];switch(i.position=mn(t),t.type){case Ms:i.anchors=new Map,i.nodeTags=new Map,i.aliasCount=0,i.tagHandlers=Object.create(null);for(const e of t.directives)"tag"===e.kind&&(i.tagHandlers[e.handle]=e.prefix);i.frames.push({kind:"document",position:i.position,value:void 0,hasValue:!1});break;case Vs:{const{value:e,tag:s}=_n(i,t);kn(i,t,e,s,!0),xn(i,e,s);break}case Ds:{const e=vn(i,t,"tag:yaml.org,2002:seq"),s=i.schema.lookupSequenceTag(e);s||fn(i,`unknown sequence tag !<${e}>`);const n=s.create(e),a=kn(i,t,n,s,s.carrierIsResult);i.frames.push({kind:"sequence",position:i.position,value:n,tag:s,anchor:a,index:0});break}case Rs:{const e=vn(i,t,"tag:yaml.org,2002:map"),s=i.schema.lookupMappingTag(e);s||fn(i,`unknown mapping tag !<${e}>`);const n=s.create(e),a=kn(i,t,n,s,s.carrierIsResult);i.frames.push({kind:"mapping",position:i.position,value:n,tag:s,anchor:a,key:void 0,keyPosition:i.position,hasKey:!1,keyIsMerge:!1,overridable:null});break}case zs:{-1!==i.maxAliases&&++i.aliasCount>i.maxAliases&&fn(i,`aliases exceeded maxAliases (${i.maxAliases})`);const e=i.source.slice(t.anchorStart,t.anchorEnd),s=i.anchors.get(e);s||fn(i,`unidentified alias "${e}"`),s.isValueFinal||fn(i,`recursive alias "${e}" is not supported for tag ${s.tag.tagName} because it uses finalize()`),xn(i,s.value,s.tag);break}case qs:{const t=i.frames.pop();if("mapping"===t.kind&&t.hasKey&&(i.position=t.keyPosition,fn(i,"incomplete mapping pair in event stream")),"document"===t.kind)i.documents.push(t.value);else{const e=t.tag.carrierIsResult?t.value:gn(i,t.position,t.tag,t.value);t.anchor&&(t.anchor.value=e,t.anchor.isValueFinal=!0),xn(i,e,t.tag)}break}}}return i.documents}(function(t,e){const i=t.length,s={...Fn,...e,input:`${t}\0`,length:i,position:0,line:0,lineStart:0,lineIndent:0,firstTabInLine:-1,depth:0,directives:[],tagHandlers:Object.create(null),events:[]},n=t.indexOf("\0");for(-1!==n&&Ls.throwAt(t,n,"null byte is not allowed in input",s.filename);s.position<s.length&&(na(s),ia(s,!0),!(s.position>=s.length));){const t=s.position;va(s),s.position===t&&Hn(s,"can not read a document")}return s.events}(s,xs(i,n)),{...xs(i,a),source:s})}function $a(t,e){return!!(t&1<<e)}var wa={applyQuoteFlowKeysOption:function(t){if(!t.presenterOptions.quoteFlowKeys)return;if(!t.isKey||!t.flowOnly||t.style!==Us)return;t.style=Hs},doubleQuoteForInvisibles:function(t){t.style===Us&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(t.node.value)&&(t.style=Hs)},doubleQuoteWhitespaceOnly:function(t){t.style===Us&&/^\s+$/.test(t.node.value)&&(t.style=Hs)},applyForceQuotesOption:function(t){if(!t.presenterOptions.forceQuotes)return;if(t.isKey||t.style!==Us)return;if(t.node.tag!==t.presenterOptions.schema.defaultScalarTag.tagName)return;t.style=t.node.value.includes("\n")?Hs:xa(t)},tryLongOrMultilineAsBlock:function(t){if(t.style!==Us||t.isKey)return;const e=t.node.value,i=-1!==e.indexOf("\n");if(!$a(t.allowedStylesMask,Ws))return void(i&&(t.style=Hs));const s=t.presenterOptions.lineWidth;if(-1===s)return void(i&&(t.style=Ws));const n=Math.max(Math.min(s,40),s-t.shiftOfContent);let a=0,o=!1;for(;a<=e.length;){let t=e.length;const i=e.indexOf("\n",a);-1!==i&&(t=i);const s=e.slice(a,t);if(s.length>n&&" "!==s[0]&&/ [^ \t]/.test(s)&&(o=!0),-1===i)break;a=i+1}o?t.style=Js:i&&(t.style=Ws)},quoteInvalidPlain:function(t){t.style!==Us||$a(t.allowedStylesMask,Us)||(t.style=xa(t))},fallbackToDoubleQuoted:function(t){$a(t.allowedStylesMask,t.style)||(t.style=Hs)}};function xa(t){return"single"===t.presenterOptions.quoteStyle&&$a(t.allowedStylesMask,Ks)?Ks:Hs}Object.keys(wa).map(t=>Reflect.get(wa,t));const ka="tempus2016/decluttering-card-plus",Sa="share-your-templates",Aa=`https://github.com/${ka}/discussions/new?category=${Sa}`,ja="decluttering-card-plus-community";function Oa(t){let e=2e4;const i=t=>(e-=1+Math.ceil(t/16))>=0,s=t=>"string"==typeof t?i(t.length):!!i(0)&&(Array.isArray(t)?t.every(s):!t||"object"!=typeof t||Object.entries(t).every(([t,e])=>i(t.length)&&s(e)));return s(t)}const Ca=t=>!!t&&"object"==typeof t&&!Array.isArray(t);function Ea(t){if(Oa(t))return JSON.parse(JSON.stringify(t),(t,e)=>"__proto__"===t?void 0:e)}const Ta=/[\p{Cf}\u2800\u3164\u115F\u1160\uFFA0]/gu;function Na(t){if("string"!=typeof t)return;const e=t.replace(Ta,"").replace(/\s+/g," ").trim();return e?e.length>80?`${e.slice(0,79)}…`:e:void 0}const Pa=["card","badge","row","element","group"];function Ia(t){if(!Ca(t))return{};const e={};for(const[i,s]of Object.entries(t))Ca(s)&&Pa.some(t=>void 0!==s[t])&&(e[i]=s);return e}function Fa(t,e){return"string"==typeof e&&/^https:\/\/github\.com\//.test(e)?e:`https://github.com/${ka}/discussions/${t}`}function La(t){var e,i,s,n,a;const o=function(t){if("string"!=typeof t||t.length>65536)return;const e=/^ {0,3}(`{3,}|~{3,})[ \t]*([\w-]*)/,i=[];let s;for(const o of function(t){return t.replace(/<!--[\s\S]*?(?:-->|$)/g,"")}(t).split("\n")){if(s){o.trim()===s.fence?(i.push({lang:s.lang,text:s.lines.join("\n")+"\n"}),s=void 0):s.lines.push(o);continue}const t=e.exec(o);t&&(s={fence:t[1],lang:t[2],lines:[]})}const n=i.find(t=>/^ya?ml$/i.test(t.lang)),a=null!=n?n:i.find(t=>""===t.lang);return null==a?void 0:a.text}(null==t?void 0:t.body);if(!o)return;let r;try{if(r=Ea(function(t,e){const i=ba(t,e);if(0===i.length)throw new Ls("expected a document, but the input is empty");if(1===i.length)return i[0];throw new Ls("expected a single document in the stream, but found more")}(o,{maxAliases:50})),void 0===r)return}catch(d){return}if(!Ze(r).ok)return;if("number"!=typeof(null==t?void 0:t.number))return;const{template:l,includes:c}=r,h=Tt(r,["template","includes"]);return delete h.type,"string"!=typeof h.description&&delete h.description,{id:t.number,title:null!==(e=Na(t.title))&&void 0!==e?e:l,author:"string"==typeof(null===(i=t.user)||void 0===i?void 0:i.login)?t.user.login:"",url:Fa(t.number,t.html_url),name:l.trim(),template:h,includes:Ia(c),reactions:"number"==typeof(null===(s=t.reactions)||void 0===s?void 0:s.total_count)?t.reactions.total_count:0,updated:"string"==typeof(null!==(n=t.updated_at)&&void 0!==n?n:t.created_at)?null!==(a=t.updated_at)&&void 0!==a?a:t.created_at:""}}const Ma=["lock","alarm_control_panel","cover","valve","siren","script","automation","button","input_button","water_heater","lawn_mower","update"],Da=["more-info","navigate","none","assist"],Ra=["action","perform_action","service","type"],Va=/\b[a-z][a-z0-9+.-]{1,31}:(?:\/\/)?[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?|\/\/[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?/gi,za=[/(?:url|image-set|src)\(\s*['"]?([^'")\s{}]+)/gi,/@import\s+(?:url\(\s*)?['"]?([^'")\s;{}]+)/gi],qa=/^(?:\/(?!\/)|#|data:)/i,Ua=["image","url","url_path","entity_picture","camera_image","image_url","icon_url","src"],Ka=/\[\[\[|\{\{|\{%|\$\{/,Ha=/^\s*(?:javascript|data|vbscript):/i,Wa=/position\s*:\s*(?:fixed|absolute)/i,Ja=/opacity\s*:\s*0(?:[^.\d]|$)|visibility\s*:\s*hidden|transparent/i,Ba=t=>"string"==typeof t&&Ma.includes(t.split(".")[0]),Ya=t=>t.replace(/\\/g,"/"),Ga="*";function Za(t,e){const i=[].concat(null!=t?t:[]).filter(t=>"string"==typeof t);if(i.length)return i.includes(Ga)?[Ga]:i;const s=[].concat(null!=e?e:[]).filter(t=>"string"==typeof t);if(!s.length)return[Ga];const n=s.map(t=>{const e=t.indexOf("."),i=-1===e?t:t.slice(0,e);return/^[a-z_]+$/.test(i)?i:Ga});return n.includes(Ga)?[Ga]:[...new Set(n)]}function Qa(t,e,i=new Set){var s,n,a,o;if(Array.isArray(t))return t.forEach(t=>Qa(t,e,i)),i;if(!Ca(t))return i;const r="string"==typeof t.entity?t.entity:e,l=t.action;if("string"==typeof l&&!Da.includes(l)&&!l.includes("[[")&&"perform-action"!==l&&"call-service"!==l&&"fire-dom-event"!==l&&"url"!==l){const e=[].concat(null!==(o=null!==(a=null!==(n=null===(s=t.target)||void 0===s?void 0:s.entity_id)&&void 0!==n?n:t.entity_id)&&void 0!==a?a:r)&&void 0!==o?o:[]);e.length&&!e.some(t=>"string"!=typeof t||t.includes("[["))||i.add(l)}return Object.values(t).forEach(t=>Qa(t,r,i)),i}function Xa(t,e){const i=Pa.find(e=>void 0!==t[e]);if(i)try{return I(e,t,t[i],void 0,void 0,!0)}catch(s){return}}function to(t){const e=new Set,i=new Set;let s=!1,n=!1,a=!1,o=!1;const r=t=>{const e=Ya(t).trim();!e||qa.test(e)||e.startsWith("[[")||e.startsWith("{{")||/^[\w.-]+\.[a-z]{2,}(?:[:/?#]|$)/i.test(e)&&i.add(e)},l=new Set,c=(t,i)=>{for(const s of t)if(i.includes(Ga))e.add(`${s} *`);else for(const t of i)Ma.includes(t)&&e.add(`${s} ${t}.*`)},h=(d,u)=>{var p;if("string"==typeof d)return void(t=>{var e;const s=Ya(t);for(const n of null!==(e=s.match(Va))&&void 0!==e?e:[])i.add(n);for(const n of za){n.lastIndex=0;let t=n.exec(s);for(;t;)qa.test(t[1])||i.add(t[1]),t=n.exec(s)}Ka.test(t)&&(n=!0),Wa.test(t)&&Ja.test(t)&&(o=!0)})(d);if(Array.isArray(d))return void d.forEach(t=>h(t,u));if(!Ca(d))return;const m="string"==typeof d.entity?d.entity:u;Object.keys(d).some(t=>t.includes("[["))&&(a=!0),Ra.some(t=>"string"==typeof d[t]&&d[t].includes("[["))&&(a=!0),"string"==typeof d.action&&((t,s)=>{var a,o,r,l,c,h;const d=t.action;if("perform-action"===d||"call-service"===d){const i=null!==(a=t.perform_action)&&void 0!==a?a:t.service;return void("string"!=typeof i?e.add("?"):i.includes("[[")||e.add(i))}if("fire-dom-event"===d)return void e.add("fire-dom-event");if("url"===d)return i.add("string"==typeof t.url_path?t.url_path:"?"),void("string"==typeof t.url_path&&Ha.test(t.url_path)&&(n=!0));if(Da.includes(d)||d.includes("[["))return;const u=[].concat(null!==(h=null!==(c=null!==(l=null!==(r=null===(o=t.target)||void 0===o?void 0:o.entity_id)&&void 0!==r?r:t.entity_id)&&void 0!==l?l:t.entity)&&void 0!==c?c:s)&&void 0!==h?h:[]);for(const i of u)Ba(i)&&e.add(`${d} ${i}`)})(d,m),"iframe"!==d.type&&"webpage"!==d.type||(s=!0);for(const t of Ua)"string"==typeof d[t]&&r(d[t]);if("string"==typeof d.type&&yt.includes(d.type)){const e=(e=>{if("string"==typeof e)return e===t.name?t.template:Object.prototype.hasOwnProperty.call(t.includes,e)?t.includes[e]:void 0})(d.template);if(e){if(F(d.for_each_from)){const t=d.for_each_from,i=Pa.map(t=>e[t]).find(t=>void 0!==t);c(Qa(i,void 0),Za(t.domain,t.entities))}const t=(f=d.variables,Array.isArray(f)?f.filter(Ca):Ca(f)?Object.entries(f).map(([t,e])=>({[t]:e})):void 0);(null==t?void 0:t.length)&&!l.has(d.template)&&(l.add(d.template),h(Xa(e,t),void 0),l.delete(d.template))}}var f;if("custom:auto-entities"===d.type&&Ca(d.filter))for(const t of[].concat(null!==(p=d.filter.include)&&void 0!==p?p:[])){if(!Ca(t))continue;const e=Za(t.domain,t.entity_id);c(Qa(t.options,void 0),e),c(Qa(d.card,void 0),e)}Object.values(d).forEach(t=>h(t,m))},d=[t.template,...Object.values(t.includes)];h(d,void 0);for(const u of d)h(Xa(u),void 0);return{actions:[...e].sort(),urls:[...i].sort(),embeds:s,scripts:n,placeholders:a,overlay:o}}function eo(t){return t.filter(t=>{var e;return(null===(e=null==t?void 0:t.category)||void 0===e?void 0:e.slug)===Sa}).map(La).filter(t=>!!t).sort((t,e)=>e.reactions-t.reactions||e.updated.localeCompare(t.updated))}class io extends Error{}function so(t){var e;if(!Ca(t)||"number"!=typeof t.id||"string"!=typeof t.name)return;if(!Ca(t.template))return;const i=Ea({template:t.template,includes:t.includes});if(!i||!Ca(i.template))return;if(!Ze(Object.assign({template:t.name},i.template)).ok)return;const s=Object.assign({},i.template);return delete s.type,"string"!=typeof s.description&&delete s.description,{id:t.id,title:null!==(e=Na(t.title))&&void 0!==e?e:t.name,author:"string"==typeof t.author?t.author:"",url:Fa(t.id,t.url),name:t.name,template:s,includes:Ia(i.includes),reactions:"number"==typeof t.reactions?t.reactions:0,updated:"string"==typeof t.updated?t.updated:""}}async function no(t={}){var e,i,s,n;const a=null!==(e=t.fetcher)&&void 0!==e?e:fetch.bind(globalThis),o=null!==(i=t.storage)&&void 0!==i?i:"undefined"==typeof localStorage?void 0:localStorage,r=null!==(s=t.now)&&void 0!==s?s:Date.now(),l=function(t){var e;try{const i=JSON.parse(null!==(e=null==t?void 0:t.getItem(ja))&&void 0!==e?e:"null");if(!i||!Array.isArray(i.entries)||"number"!=typeof i.fetched)return;return{entries:i.entries.map(so).filter(t=>!!t),fetched:i.fetched}}catch(i){return}}(o);if(l&&!t.refresh&&r-l.fetched<216e5)return l;const c=[];try{for(let t=1;t<=10;t+=1){const e=await a(`https://api.github.com/repos/${ka}/discussions?per_page=100&page=${t}`,{headers:{Accept:"application/vnd.github+json"}});if(!e.ok){const t=new io(`GitHub answered ${e.status}`);throw"0"===e.headers.get("x-ratelimit-remaining")&&(t.retryAt=1e3*Number(e.headers.get("x-ratelimit-reset"))||void 0),t}const i=await e.json();if(!Array.isArray(i))break;if(c.push(...i),i.length<100)break}}catch(d){const t=d instanceof io?d:new io(null!==(n=null==d?void 0:d.message)&&void 0!==n?n:String(d));throw t.cached=l,t}const h={entries:eo(c),fetched:r};try{null==o||o.setItem(ja,JSON.stringify(h))}catch(u){}return h}function ao(t,e){return{discussion:t.id,updated:t.updated,name:e,author:t.author}}function oo(t,e){return Object.assign(Object.assign({},t),{source:e})}function ro(t,e){return t.map(({name:t,source:i})=>{var s;const n=e.entries.find(t=>t.id===i.discussion),a="string"==typeof i.name?i.name:void 0,o=n?function(t,e){return void 0===e||e===t.name?t.template:Object.prototype.hasOwnProperty.call(t.includes,e)?t.includes[e]:void 0}(n,a):void 0;if(!n||!o)return Object.assign({name:t,status:"gone"},n?{entry:n}:{});if("string"!=typeof i.author||!i.author||i.author!==n.author)return{name:t,status:"unverified",entry:n};const r=Date.parse(null!==(s=i.updated)&&void 0!==s?s:""),l=Date.parse(n.updated);return{name:t,status:(Number.isFinite(r)?Number.isFinite(l)&&l>r:Number.isFinite(l))?"update":"current",entry:n,latest:oo(o,ao(n,null!=a?a:n.name))}})}function lo(t){if(""===t)return[];const e=t.split("\n");return""===e[e.length-1]&&e.pop(),e}function co(t,e){const i=t=>({kind:"remove",text:t}),s=t=>({kind:"add",text:t});if(!t.length||!e.length||t.length*e.length>4e6)return[...t.map(i),...e.map(s)];const n=t.length,a=e.length,o=Array.from({length:n+1},()=>new Uint32Array(a+1));for(let h=n-1;h>=0;h-=1)for(let i=a-1;i>=0;i-=1)o[h][i]=t[h]===e[i]?o[h+1][i+1]+1:Math.max(o[h+1][i],o[h][i+1]);const r=[];let l=0,c=0;for(;l<n&&c<a;)t[l]===e[c]?(r.push({kind:"same",text:t[l]}),l+=1,c+=1):o[l+1][c]>=o[l][c+1]?(r.push(i(t[l])),l+=1):(r.push(s(e[c])),c+=1);for(;l<n;)r.push(i(t[l++]));for(;c<a;)r.push(s(e[c++]));return r}const ho=m`<style>
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
</style>`;function uo(t){return"string"==typeof t?t:void 0===t?"":Nt(t)}const po={same:" ",add:"+",remove:"-"};function mo(t,e,i,s=3){const n=function(t,e){const i=lo(t),s=lo(e);let n=0;for(;n<i.length&&n<s.length&&i[n]===s[n];)n+=1;let a=i.length,o=s.length;for(;a>n&&o>n&&i[a-1]===s[o-1];)a-=1,o-=1;const r=i.slice(0,n).map(t=>({kind:"same",text:t})),l=i.slice(a).map(t=>({kind:"same",text:t}));return[...r,...co(i.slice(n,a),s.slice(n,o)),...l]}(uo(t),uo(e));return function(t){return t.some(t=>"same"!==t.kind)}(n)?m`${ho}
    <div class="dcp-diff" role="figure" aria-label=${p("diff.label",void 0,i)}>
      ${function(t,e=3){const i=t.map(t=>"same"!==t.kind),s=new Array(t.length).fill(!1);t.forEach((i,n)=>{if("same"!==i.kind)for(let a=Math.max(0,n-e);a<=Math.min(t.length-1,n+e);a+=1)s[a]=!0});const n=[];let a=0;for(;a<t.length;){if(i[a]||s[a]){n.push(t[a]),a+=1;continue}let e=a;for(;e<t.length&&!i[e]&&!s[e];)e+=1;const o=e-a;1===o?n.push(t[a]):n.push({kind:"skip",count:o}),a=e}return n}(n,s).map(t=>function(t,e){return"skip"===t.kind?m`<div class="skip">${p("diff.skipped",{count:t.count},e)}</div>`:m`<div class=${t.kind}>${po[t.kind]} ${t.text}</div>`}(t,i))}
    </div>`:m`${ho}
      <p class="dcp-diff-none">${p("diff.no_change",void 0,i)}</p>`}function fo(t,e,i){var s,n;const a=null!==(s=JSON.stringify(t))&&void 0!==s?s:"",o=null!==(n=JSON.stringify(e))&&void 0!==n?n:"";return m`
    ${mo(t,e,i)}
    <ha-expansion-panel outlined>
      <span slot="header">${p("diff.full",void 0,i)}</span>
      <p class="dcp-diff-none">${p("diff.before",void 0,i)}</p>
      ${Ai(a,m`<ha-yaml-editor .hass=${i} .defaultValue=${t} read-only></ha-yaml-editor>`)}
      <p class="dcp-diff-none">${p("diff.after",void 0,i)}</p>
      ${Ai(o,m`<ha-yaml-editor .hass=${i} .defaultValue=${e} read-only></ha-yaml-editor>`)}
    </ha-expansion-panel>
  `}class go extends s{constructor(){super(...arguments),this._importParses=!0,this._importErrors=[],this._importArmedAt=0,this._copyState="",this._busy=!1,this._libraryDestination="view",this._communityLoading=!1,this._communityKnownFailed=!1,this._installArmedAt=0,this._postCopyState="",this._updatesLoading=!1,this._updateArmedAt=0,this._trashArmedAt=0}get _config(){return this.config}get _savedLovelace(){var t,e,i;return null!==(i=null!==(e=null===(t=L())||void 0===t?void 0:t.config)&&void 0!==e?e:this.lovelace)&&void 0!==i?i:h()}static get styles(){return xi}_fireConfigChanged(t){w(this,"config-changed",{config:t})}_saveDashboard(t,e,i){return wi(this,t,e,i)}render(){return this.hass&&this._config?this._renderShare():m``}async _loadTrash(){this.hass&&(this._trash=await Pt(this.hass))}_renderShare(){const{payload:t,notes:e}=Be(this._config,d(this._savedLovelace));return m`
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
          <a href=${Aa} target="_blank" rel="noopener noreferrer"
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
      `;const i=this._communityExisting(),s=t.entries.find(t=>t.id===this._communitySelected),n=s?`community:${s.id}:${s.updated}`:"",a=!!s&&this._installPending===n,o=s&&i.includes(s.name)?Ge(s.name,i):void 0,r=s?function(t,e){const i=new Set,s=new Set;for(const n of[t.template,...Object.values(t.includes)]){const t=Je(n);t.customTypes.forEach(t=>i.add(t)),t.templateRefs.forEach(t=>s.add(t))}return{customTypes:[...i].sort(),templates:[...s].filter(i=>i!==t.name&&!(i in t.includes)&&!e.includes(i)).sort()}}(s,i):void 0,l=s?Object.keys(s.includes).filter(t=>!i.includes(t)):[],c=s?to(s):void 0,h=void 0!==this._communityKnown;return m`
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
                ${c&&yi(c)?this._renderRisks(c,"share.community_risks"):m``}
                <ha-expansion-panel outlined expanded>
                  <span slot="header">${p("share.library_preview",void 0,this.hass)}</span>
                  ${Ai(`${s.id}:${s.updated}`,m`<ha-yaml-editor
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
    </ha-alert>`}async _loadCommunity(t){var e,i;this._communityLoading=!0,this._communityError=void 0,this._installPending=void 0,this._communityKnown=void 0,this._communityKnownFailed=!1;try{this._community=await no({refresh:t})}catch(s){const t=s;t.cached&&(this._community=t.cached),this._communityError=t.retryAt?p("share.community_rate_limited",{time:new Date(t.retryAt).toLocaleTimeString(null===(i=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===i?void 0:i.language)},this.hass):p("share.community_failed",{message:t.message},this.hass)}finally{this._communityLoading=!1}this._community&&this._loadCommunityKnown()}_communityExisting(){var t;const e=Object.keys(d(this._savedLovelace));return[...new Set([...e,...null!==(t=this._communityKnown)&&void 0!==t?t:[]])]}async _loadCommunityKnown(){try{const t=await ut(this.hass,this._savedLovelace);this._communityKnown=Object.keys(t)}catch(t){this._communityKnownFailed=!0}}_communityPicked(t){t.stopPropagation();const e=Number(t.detail.value.entry);this._communitySelected=Number.isFinite(e)&&e>0?e:void 0,this._installPending=void 0}async _installShared(t){var e,i,s,n,a;if(void 0===this._communityKnown)return;const o=`community:${t.id}:${t.updated}`;if(this._installPending!==o)return this._installPending=o,void(this._installArmedAt=Date.now());if(Date.now()-this._installArmedAt<bi)return;const r=L(),l=this._communityExisting(),c=l.includes(t.name)?Ge(t.name,l):t.name,h=[...Object.entries(t.includes).filter(([t])=>!l.includes(t)).map(([e,i])=>[e,oo(i,ao(t,e))]),[c,oo(t.template,ao(t,t.name))]],d=U(null!==(e=null==r?void 0:r.config)&&void 0!==e?e:this.lovelace,null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""),u=null!==(a=null===(n=null==d?void 0:d.view)||void 0===n?void 0:n.index)&&void 0!==a?a:0;await this._saveDashboard(t=>h.reduce((t,[e,i])=>"root"===this._libraryDestination?It(t,e,i):Ft(t,u,Object.assign({type:_t,template:e},i,{type:_t,template:e})),t),"community_install")&&(this._installPending=void 0)}_renderMissingCards(t){const e=function(t,e){const i=new Set;for(const s of t)for(const t of Je(s).customTypes){const s=t.slice(7);s&&!e(s)&&i.add(s)}return[...i].sort()}(t.filter(t=>void 0!==t),vi);return e.length?m`<ha-alert alert-type="warning">
      ${p(1===e.length?"share.missing_card_one":"share.missing_card_many",{cards:e.join(", ")},this.hass)}
    </ha-alert>`:m``}_renderInstalled(){var t;const e=Lt(this._savedLovelace);if(!e.length)return m``;const i=new Map((null!==(t=this._updates)&&void 0!==t?t:[]).map(t=>[t.name,t]));return m`
      <h3>${p("share.installed_header",void 0,this.hass)}</h3>
      <p class="hint">${p("share.installed_hint",void 0,this.hass)}</p>
      ${this._updatesError?m`<ha-alert alert-type="warning">${this._updatesError}</ha-alert>`:m``}
      <ul class="installed">
        ${e.map(({name:t,source:e,template:s})=>{var n,a;const o=i.get(t);return m`<li>
            ${t} —
            <a
              href=${null!==(a=null===(n=null==o?void 0:o.entry)||void 0===n?void 0:n.url)&&void 0!==a?a:`https://github.com/${ka}/discussions/${e.discussion}`}
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
    `}_renderUpdate(t,e,i){const s=i.latest,n=t=>{const e=Object.assign({},t);return delete e.source,delete e.type,delete e.template,e},a=n(e),o=n(s),r=to({template:o,includes:{}}),l=function(t,e){return{actions:t.actions.filter(t=>!e.actions.includes(t)),urls:t.urls.filter(t=>!e.urls.includes(t)),embeds:t.embeds&&!e.embeds,scripts:t.scripts&&!e.scripts,placeholders:t.placeholders&&!e.placeholders,overlay:t.overlay&&!e.overlay}}(r,to({template:a,includes:{}})),c=this._updatePending===t;return m`
      <p class="hint">${p("share.installed_compare",void 0,this.hass)}</p>
      ${fo(a,o,this.hass)} ${this._renderMissingCards([s])}
      ${yi(l)?this._renderRisks(l,"share.installed_risks_new"):yi(r)?this._renderRisks(r,"share.installed_risks"):m``}
      ${c?m`<ha-alert alert-type="warning">
              ${p("share.installed_update_confirm",{name:t},this.hass)}
            </ha-alert>`:m``}
      <ha-button .disabled=${this._busy} @click=${()=>{this._updateShared(t,s)}}>
        ${p(c?"share.installed_update_anyway":"share.installed_update",void 0,this.hass)}
      </ha-button>
    `}async _checkUpdates(){var t,e;this._updatesLoading=!0,this._updatesError=void 0,this._updatePending=void 0;const i=Lt(this._savedLovelace);try{this._updates=ro(i,await no({refresh:!0}))}catch(s){const i=s;this._updatesError=i.retryAt?p("share.community_rate_limited",{time:new Date(i.retryAt).toLocaleTimeString(null===(e=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===e?void 0:e.language)},this.hass):p("share.community_failed",{message:i.message},this.hass)}finally{this._updatesLoading=!1}}async _updateShared(t,e){var i,s;if(this._updatePending!==t)return this._updatePending=t,void(this._updateArmedAt=Date.now());if(Date.now()-this._updateArmedAt<bi)return;await this._saveDashboard(i=>Mt(i,t,e),"shared_update")&&(this._updatePending=void 0,this._updates=null===(i=this._updates)||void 0===i?void 0:i.map(e=>e.name===t?Object.assign(Object.assign({},e),{status:"current"}):e),(null===(s=this._config)||void 0===s?void 0:s.template)===t&&this._fireConfigChanged(Object.assign(Object.assign({},e),{type:this._config.type,template:t})))}_renderLibrary(){var t;const e=Object.keys(d(this._savedLovelace)),i=this._librarySelected?Ci(this._librarySelected):void 0,s=!!i&&e.includes(i.name),n=!!i&&this._installPending===i.name,a=i?Ei(i,e):[];return m`
      <div class="library">
        <ha-form
          .hass=${this.hass}
          .data=${{entry:null!==(t=this._librarySelected)&&void 0!==t?t:""}}
          .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:Oi.map(t=>({value:t.name,label:t.name}))}}}]}
          .computeLabel=${()=>p("share.library_pick",void 0,this.hass)}
          @value-changed=${this._libraryPicked}
        ></ha-form>
        ${i?m`
                <p class="hint">${p(`library.${i.name}.summary`,void 0,this.hass)}</p>
                ${a.length?m`<p class="hint">
                        ${p("share.library_needs",{names:a.join(", ")},this.hass)}
                      </p>`:m``}
                ${this._renderMissingCards([i,...a.map(t=>Ci(t))].map(t=>null==t?void 0:t.template))}
                <ha-expansion-panel outlined>
                  <span slot="header">${p("share.library_preview",void 0,this.hass)}</span>
                  ${Ai(i.name,m`<ha-yaml-editor
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
    `}_libraryDestinationPicked(t){t.stopPropagation();const e=t.detail.value.where;this._libraryDestination="root"===e?"root":"view"}_libraryPicked(t){t.stopPropagation(),this._librarySelected=t.detail.value.entry||void 0,this._installPending=void 0}async _install(t){var e,i,s,n,a,o;const r=Ci(t);if(!r)return;if(this._installPending!==t)return void(this._installPending=t);const l=L(),c=Object.keys(d(null!==(e=null==l?void 0:l.config)&&void 0!==e?e:this._savedLovelace)),h=[...Ei(r,c),r.name].filter(t=>!c.includes(t)),u=U(null!==(i=null==l?void 0:l.config)&&void 0!==i?i:this.lovelace,null!==(n=null===(s=this._config)||void 0===s?void 0:s.template)&&void 0!==n?n:""),p=null!==(o=null===(a=null==u?void 0:u.view)||void 0===a?void 0:a.index)&&void 0!==o?o:0;await this._saveDashboard(t=>h.reduce((t,e)=>{const i=Ci(e);if(!i)return t;const s=Object.assign(Object.assign({},i.template),{source:Ti(i.name,Kt)});return"root"===this._libraryDestination?It(t,i.name,s):Ft(t,p,Object.assign({type:_t,template:i.name},s))},t),"library_install")&&(this._installPending=void 0)}async _copyExport(){const t=this.renderRoot.querySelector("#export"),e=null==t?void 0:t.yaml;if(!e)return;const{notes:i}=Be(this._config),s=[...i.map(t=>`# ${t}`),e].join("\n");this._copyState=await Dt(s)?"done":"failed",setTimeout(()=>this._copyState="",3e3)}async _copyPost(){var t,e;const i=null===(t=this.renderRoot.querySelector("#export"))||void 0===t?void 0:t.yaml;if(!i)return;const{notes:s}=Be(this._config,d(this._savedLovelace));this._postCopyState=await Dt(function(t,e,i){return[...[i,...e].filter(t=>"string"==typeof t&&t.trim()),"```yaml\n"+t.replace(/\n*$/,"")+"\n```"].join("\n\n")+"\n"}(i,s,null===(e=this._config)||void 0===e?void 0:e.description))?"done":"failed",setTimeout(()=>this._postCopyState="",3e3)}_downloadExport(){var t,e,i;const s=null===(t=this.renderRoot.querySelector("#export"))||void 0===t?void 0:t.yaml;if(!s)return;const{notes:n}=Be(this._config),a=[...n.map(t=>`# ${t}`),s].join("\n"),o=document.createElement("a");o.href=URL.createObjectURL(new Blob([a],{type:"text/yaml"})),o.download=`${(null!==(i=null===(e=this._config)||void 0===e?void 0:e.template)&&void 0!==i?i:"template").replace(/[^\w-]+/g,"_")}.yaml`,o.click(),setTimeout(()=>URL.revokeObjectURL(o.href),1e3)}async _importFile(t){var e,i,s;const n=t.target,a=null===(e=n.files)||void 0===e?void 0:e[0];if(n.value="",!a)return;const o=await a.text(),r=null===(s=null===(i=this.renderRoot.querySelector("#import"))||void 0===i?void 0:i.shadowRoot)||void 0===s?void 0:s.querySelector("ha-code-editor");r?(r.value=o,r.dispatchEvent(new CustomEvent("value-changed",{detail:{value:o}}))):this._importErrors=[p("share.import_not_yaml",void 0,this.hass)]}_renderTrash(){if(void 0===this._trash)return this._loadTrash(),m``;const t=t=>{var e,i;return new Date(t).toLocaleString(null===(i=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===i?void 0:i.language)};return m`
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
    `}async _restore(t,e){var i,s;if(!this.hass)return;const n=Rt(this.hass);let a;try{a=await Vt(n,t.dashboard)}catch(r){return void(this._toolError=p("tools.save_failed",{message:null!==(i=null==r?void 0:r.message)&&void 0!==i?i:r},this.hass))}const o=t.name in d(a);if(o&&this._trashPending!==e)return this._trashPending=e,void(this._trashArmedAt=Date.now());if(!(o&&Date.now()-this._trashArmedAt<bi)){this._busy=!0,this._toolError=void 0;try{await D(this,this.hass,"restore",[{urlPath:t.dashboard,build:e=>zt(e,t)}]),this._trashPending=void 0,this._trashShown=void 0,await this._forget(t)}catch(r){this._toolError=p("tools.save_failed",{message:null!==(s=null==r?void 0:r.message)&&void 0!==s?s:r},this.hass)}finally{this._busy=!1}}}async _forget(t){if(!this.hass)return;const e=qt(await Pt(this.hass),t);await Ut(this.hass,e),this._trash=e,this._trashPending=void 0}_importChanged(t){t.stopPropagation(),this._importValue=t.detail.value,this._importParses=!1!==t.detail.isValid,this._importErrors=[],this._importClash=void 0,this._importRisks=void 0}_import(){if(!this._config)return;if(!this._importParses)return void(this._importErrors=[p("share.import_not_yaml",void 0,this.hass)]);if(!Oa(this._importValue))return void(this._importErrors=[p("share.import_too_big",void 0,this.hass)]);const t=Ze(this._importValue);if(!t.ok)return this._importErrors=t.errors,void(this._importClash=void 0);this._importErrors=[];const e=this._importValue.template,i=d(this._savedLovelace),s=e!==this._config.template&&e in i?e:void 0,n=to({template:this._importValue,includes:{}});if(s&&!this._importClash||yi(n)&&!this._importRisks)return this._importClash=s,this._importRisks=yi(n)?n:void 0,void(this._importArmedAt=Date.now());Date.now()-this._importArmedAt<bi||this._applyImport(e)}_importAsCopy(){if(!this._config||!this._importParses)return;if(Date.now()-this._importArmedAt<bi)return;const t=Object.keys(d(this._savedLovelace));this._applyImport(Ge(this._importValue.template,t))}_applyImport(t){var e;const i=function(t){const e=Ye(t);if((null==e?void 0:e.includes)&&"object"==typeof e.includes&&!Array.isArray(e.includes)){const t={};for(const[i,s]of Object.entries(e.includes))t[i]=Ye(s);e.includes=t}return e}(this._importValue),s=i.includes;if(s&&"object"==typeof s&&!Array.isArray(s)){const t=Object.keys(d(this._savedLovelace)),e=Object.entries(s).filter(([e])=>!t.includes(e));e.length&&this._saveDashboard(t=>e.reduce((t,[e,i])=>It(t,e,i),t),"import",this._config)}const n=Object.assign(Object.assign({},i),{template:t,type:null===(e=this._config)||void 0===e?void 0:e.type});delete n.includes,this._fireConfigChanged(n),this._importClash=void 0,this._importRisks=void 0,this.dispatchEvent(new CustomEvent("select-tab",{detail:"settings",bubbles:!0,composed:!0}))}}t([i({attribute:!1})],go.prototype,"hass",void 0),t([i({attribute:!1})],go.prototype,"lovelace",void 0),t([i({attribute:!1})],go.prototype,"config",void 0),t([e()],go.prototype,"_importErrors",void 0),t([e()],go.prototype,"_importClash",void 0),t([e()],go.prototype,"_importRisks",void 0),t([e()],go.prototype,"_copyState",void 0),t([e()],go.prototype,"_toolError",void 0),t([e()],go.prototype,"_busy",void 0),t([e()],go.prototype,"_installPending",void 0),t([e()],go.prototype,"_librarySelected",void 0),t([e()],go.prototype,"_libraryDestination",void 0),t([e()],go.prototype,"_community",void 0),t([e()],go.prototype,"_communityLoading",void 0),t([e()],go.prototype,"_communityError",void 0),t([e()],go.prototype,"_communitySelected",void 0),t([e()],go.prototype,"_communityKnown",void 0),t([e()],go.prototype,"_communityKnownFailed",void 0),t([e()],go.prototype,"_postCopyState",void 0),t([e()],go.prototype,"_updates",void 0),t([e()],go.prototype,"_updatesLoading",void 0),t([e()],go.prototype,"_updatesError",void 0),t([e()],go.prototype,"_updatePending",void 0),t([e()],go.prototype,"_trash",void 0),t([e()],go.prototype,"_trashShown",void 0),t([e()],go.prototype,"_trashPending",void 0),customElements.get("decluttering-template-share-tab")||customElements.define("decluttering-template-share-tab",go);const _o=["card","badge","row","element"];function vo(t,e,i=[]){if(Array.isArray(t))t.forEach((t,s)=>vo(t,`${e}[${s}]`,i));else if(t&&"object"==typeof t)for(const[s,n]of Object.entries(t))vo(n,e?`${e}.${s}`:s,i);else null!=t&&i.push({path:e,value:String(t)});return i}const yo=["grid_options","visibility","view_layout","layout_options"];function bo(t){const e={};for(const[i,s]of Object.entries(null!=t?t:{}))yo.includes(i)||(e[i]=s);return e}function $o(t){if(Array.isArray(t))return t.map($o);if(t&&"object"==typeof t){const e={};for(const i of Object.keys(t).sort())e[i]=$o(t[i]);return e}return 0}function wo(t,e=[],i=[]){if(Array.isArray(t))t.forEach((t,s)=>wo(t,[...e,s],i));else if(t&&"object"==typeof t)for(const[s,n]of Object.entries(t))wo(n,[...e,s],i);else i.push({path:e,value:t});return i}function xo(t,e){return e.reduce((t,e)=>null==t?void 0:t[e],t)}function ko(t){const e=new Map;t.forEach((t,i)=>{var s;if(!t||"object"!=typeof t||"string"!=typeof t.type)return;const n=bo(t);if(JSON.stringify(n).includes("[["))return;const a=JSON.stringify([t.type,$o(n)]);e.set(a,[...null!==(s=e.get(a))&&void 0!==s?s:[],i])});const i=[];for(const[s,n]of e){if(n.length<2)continue;const e=n.map(e=>bo(t[e])),a=wo(e[0]).map(t=>t.path).filter(t=>e.some(i=>JSON.stringify(xo(i,t))!==JSON.stringify(xo(e[0],t))));!a.length||a.length>8||i.push({indices:n,type:t[n[0]].type,differing:a,key:s})}return i.sort((t,e)=>e.indices.length-t.indices.length||t.indices[0]-e.indices[0])}const So=t=>t.replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value";function Ao(t){const e=t[t.length-1];if("string"==typeof e)return So(e);const i=[...t].reverse().find(t=>"string"==typeof t);return So(`${null!=i?i:"item"}_${e+1}`)}function jo(t){const e=t.map(Ao),i=[];return t.forEach((t,s)=>{const n=(a=e[s],e.filter(t=>t===a).length>1?function(t){return So(t.map(t=>"number"==typeof t?String(t+1):t).join("_"))}(t):e[s]);var a;i.push(Ge(n,i))}),i}function Oo(t){var e;const i=t.map(bo),s=null!==(e=i[0])&&void 0!==e?e:{},n=wo(s).map(t=>t.path).filter(t=>i.some(e=>JSON.stringify(xo(e,t))!==JSON.stringify(xo(s,t)))),a=jo(n),o=JSON.parse(JSON.stringify(s));return n.forEach((t,e)=>{xo(o,t.slice(0,-1))[t[t.length-1]]=`[[${a[e]}]]`}),{template:{card:o},names:a,variables:i.map(t=>n.map((e,i)=>({[a[i]]:xo(t,e)}))),layout:t.map(t=>{const e={};for(const i of yo)void 0!==(null==t?void 0:t[i])&&(e[i]=t[i]);return e})}}function Co(t,e,i){return Object.assign({type:"custom:decluttering-card-plus",template:t,variables:e},i)}const Eo="_";function To(t){let e="string"==typeof t?t:JSON.stringify(t);if("string"!=typeof e||!e.includes("[["))return[];const i=new Set;for(let s=0;s<5;s+=1){let t=!1;if(e=e.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(e,s)=>{if(t=!0,s.startsWith(kt))return Eo;const n=s.endsWith("?")?s.slice(0,-1):s,[a,...o]=n.split("|"),r=a.endsWith("?")?a.slice(0,-1):a;for(const t of[r,r.split(".")[0]])t&&t!==Eo&&i.add(t);for(const t of o){const e=t.startsWith("or:")?t.slice(3):jt(t);e&&e!==Eo&&i.add(e)}return Eo}),!t)break}return[...i]}function No(t,e=[]){if(Array.isArray(t)){for(const i of t)No(i,e);return e}if(!t||"object"!=typeof t)return e;yt.includes(t.type)&&!0===t[Gt]&&"string"==typeof t.template&&e.push(t.template);for(const i of Object.values(t))No(i,e);return e}function Po(t,e,i=new Set){const s=new Set;if(!t)return{names:s,complete:!0};Yt in t&&(t=Object.assign(Object.assign({},t),{default:t[Yt]}));for(const a of f(t))s.add(a.name);for(const a of nt(ft(t))){const t=S(a);void 0!==t&&s.add(t)}for(const a of To(t))s.add(a);let n=!0;for(const a of No(t)){if(i.has(a))continue;if(i.add(a),!Object.prototype.hasOwnProperty.call(e,a)){n=!1;continue}const t=Po(e[a],e,i);for(const e of t.names)s.add(e);t.complete||(n=!1)}return{names:s,complete:n}}function Io(t,e){const i=new Map,s=(t,e,s,n)=>{const a=JSON.stringify([t.index,e,n.name,s]),o=i.get(a);o?(o.count+=1,!o.closest&&n.closest&&(o.closest=n.closest)):i.set(a,Object.assign(Object.assign({view:t,template:e,name:n.name},n.closest?{closest:n.closest}:{}),{where:s,count:1}))},n=(t,i,a)=>{var o,r;if(Array.isArray(t))for(const e of t)n(e,i,a);else if(t&&"object"==typeof t){if(yt.includes(t.type)&&"string"==typeof t.template){const n=Object.prototype.hasOwnProperty.call(e,t.template)?e[t.template]:void 0;if(n){const l=new Set,c=(o,r)=>{for(const c of function(t,e,i,s={lets:[],defaults:[]},n){if(!t)return[];const{names:a,complete:o}=Po(t,e);if(!o)return[];const r=new Set([...nt(t.let),...s.lets].map(S).filter(t=>void 0!==t)),l=$(i),c=new Set(a);for(const g of To(n))c.add(g);for(const g of[...s.lets,...s.defaults]){const t=S(g);if(void 0!==t)for(const e of To(g[t]))c.add(e)}const h=t=>!r.has(t)&&(c.has(t)||c.has(t.split(".")[0]));let d=!0;const u=new Set;for(;d;){d=!1;for(const t of l){const e=S(t);if(!u.has(e)&&h(e)){u.add(e);for(const i of To(t[e]))c.has(i)||(c.add(i),d=!0)}}}const p=new Set(l.map(t=>S(t))),m=[...c].filter(t=>!p.has(t)&&!r.has(t)),f=[];for(const g of p){if(h(g))continue;const t=xt(g,m);f.push(t?{name:g,closest:t}:{name:g})}return f}(n,e,r,a,t.on_error))l.has(c.name)||(l.add(c.name),s(i,t.template,o,c))};c("variables",t.variables);for(const e of null!==(o=A(t.for_each))&&void 0!==o?o:[])c("for_each",e);const h=null===(r=t.for_each_from)||void 0===r?void 0:r.overrides;if(h&&"object"==typeof h)for(const t of Object.values(h))c("overrides",t)}}for(const e of Object.values(t))n(e,i,a)}};return Jt(t,(e,i,s)=>{var a,o,r;const l=t.views[i];n(e,{title:null!==(o=null!==(a=null==l?void 0:l.title)&&void 0!==a?a:null==l?void 0:l.path)&&void 0!==o?o:"",path:null!==(r=null==l?void 0:l.path)&&void 0!==r?r:"",index:i},Bt(t,i,s))}),[...i.values()].map(({view:t,template:e,name:i,closest:s,where:n,count:a})=>s?{view:t,template:e,name:i,closest:s,where:n,count:a}:{view:t,template:e,name:i,where:n,count:a})}function Fo(t,e,i){if(!t.includes("[["))return t;const s=t.replace(/\[\[([^[\]]+)\]\]/g,(t,s)=>s.startsWith(kt)?t:`[[${function(t,e,i){const s=t.endsWith("?"),n=(s?t.slice(0,-1):t).split("|"),a=n[0],o=a.endsWith("?"),r=o?a.slice(0,-1):a;(r===e||r.startsWith(`${e}.`))&&(n[0]=`${i}${r.slice(e.length)}${o?"?":""}`);for(let l=1;l<n.length;l+=1){const t=n[l];if(t===`or:${e}`)n[l]=`or:${i}`;else if(jt(t)===e){const s=t.startsWith("if:!")?"!":"";n[l]=`if:${s}${i}${t.slice(3+s.length+e.length)}`}}return`${n.join("|")}${s?"?":""}`}(s,e,i)}]]`);return s.replace(new RegExp(`\\[\\[${n=e,n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=\\.\\[\\[)`,"g"),`[[${i}`);var n}function Lo(t,e,i){if("string"==typeof t)return Fo(t,e,i);if(Array.isArray(t))return t.map(t=>Lo(t,e,i));if(t&&"object"==typeof t){const s={};for(const[n,a]of Object.entries(t))s[Fo(n,e,i)]=Lo(a,e,i);return s}return t}function Mo(t,e,i){const s=t=>!!t&&"object"==typeof t&&!Array.isArray(t),n=(t,e)=>s(t)&&Object.prototype.hasOwnProperty.call(t,e),a=t=>{if(!s(t))return t;const n={};for(const[s,a]of Object.entries(t))s!==i&&(n[s===e?i:s]=a);return n};return Array.isArray(t)?t.some(t=>n(t,e))?t.map(a).filter(t=>!s(t)||Object.keys(t).length>0):t:n(t,e)?a(t):t}function Do(t,e,i){const s=Lo(t,e,i);return Array.isArray(s.variables)?s.variables=s.variables.map(t=>t&&"object"==typeof t&&t.name===e?Object.assign(Object.assign({},t),{name:i}):t):s.variables&&"object"==typeof s.variables&&(s.variables=Mo(s.variables,e,i)),void 0!==s.default&&(s.default=Mo(s.default,e,i)),void 0!==s.defaults&&(s.defaults=Mo(s.defaults,e,i)),void 0!==s.let&&(s.let=Mo(s.let,e,i)),s}function Ro(t){const e=null==t?void 0:t.extends;return(Array.isArray(e)?e:[e]).filter(t=>"string"==typeof t)}function Vo(t,e,i){const s=Ht(t),n=new Set([e]);for(const o of null!=i?i:[])Object.prototype.hasOwnProperty.call(s,o)||n.add(o);let a=!0;for(;a;){a=!1;for(const[t,e]of Object.entries(s))!n.has(t)&&Ro(e).some(t=>n.has(t))&&(n.add(t),a=!0)}return n}function zo(t){if(!t)return[];const e=new Set(fi(t));for(const i of To(t))i.includes(".")||"_"===i||e.add(i);return[...e].sort()}function qo(t,e,i,s,n){const a=Vo(t,e,n);let o=0,r=0;const l=(t,e)=>JSON.stringify(t)!==JSON.stringify(e),c=t=>{if(Array.isArray(t))return t.map(c);if(!t||"object"!=typeof t)return t;let e={};for(const[i,s]of Object.entries(t))e[i]=c(s);if(yt.includes(t.type)&&a.has(t.template)){const t=function(t,e,i){var s;const n=Object.assign({},t);void 0!==n.variables&&(n.variables=Mo(n.variables,e,i)),Array.isArray(n.for_each)?n.for_each=n.for_each.map(t=>Mo(t,e,i)):void 0!==n.for_each&&(n.for_each=Mo(n.for_each,e,i));const a=null===(s=n.for_each_from)||void 0===s?void 0:s.overrides;if(a&&"object"==typeof a&&!Array.isArray(a)){const t={};for(const[s,n]of Object.entries(a))t[s]=Mo(n,e,i);n.for_each_from=Object.assign(Object.assign({},n.for_each_from),{overrides:t})}return"string"==typeof n.name&&(n.name=Fo(n.name,e,i)),n}(e,i,s);l(t,e)&&(o+=1),e=t}if(Wt(t.type)&&a.has(t.template)){const t=Do(e,i,s);l(t,e)&&(r+=1),e=t}return e},h=Object.assign({},t);Array.isArray(null==t?void 0:t.views)&&(h.views=c(t.views));const d=null==t?void 0:t.decluttering_templates;if(d&&"object"==typeof d){const t={};for(const[e,n]of Object.entries(d)){let o=c(n);if(a.has(e)){const t=Do(o,i,s);l(t,o)&&(r+=1),o=t}t[e]=o}h.decluttering_templates=t}return{config:h,cards:o,templates:r}}function Uo(t,e,i){if(Object.prototype.hasOwnProperty.call(Ht(t),e))return!1;if(i===Zt)return!0;const s=Qt(t);return s.includes(i)||s.includes("*")}class Ko extends s{constructor(){super(...arguments),this._renameTo="",this._renaming=!1,this._duplicateTo="",this._busy=!1,this._modernisePending=!1,this._similarNames={},this._searchQuery="",this._searching=!1,this._varTo=""}get _config(){return this.config}get _savedLovelace(){var t,e,i;return null!==(i=null!==(e=null===(t=L())||void 0===t?void 0:t.config)&&void 0!==e?e:this.lovelace)&&void 0!==i?i:h()}static get styles(){return xi}_fireConfigChanged(t){w(this,"config-changed",{config:t})}_saveDashboard(t,e,i){return wi(this,t,e,i)}render(){return this.hass&&this._config?this._renderUsages():m``}_renderUsages(){var t,e;const i=null===(t=this._config)||void 0===t?void 0:t.template;if(!i)return m``;const s=this._savedLovelace;if(!s)return m`<div class="usages">
        <ha-alert alert-type="warning">${p("template_editor.usages_unreadable",void 0,this.hass)}</ha-alert>
      </div>`;(null===(e=this._usages)||void 0===e?void 0:e.name)===i&&this._usages.ll===s||(this._usages={name:i,ll:s,usages:Xt(s,i)});const{views:n,templates:a}=this._usages.usages,o=n.reduce((t,e)=>t+e.count,0),r=document.location.pathname.split("/").slice(0,2).join("/");return m`
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
    `}_renderUndo(){var t,e;const i=te();if(!i)return m``;const s=ee(i.operation,this.hass),n=new Date(i.at).toLocaleTimeString(null===(e=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===e?void 0:e.language);return m`
      <div class="undo">
        <p class="hint">${p("undo.held",{operation:s,time:n},this.hass)}</p>
        ${this._undoChanged?m`<ha-alert alert-type="warning">
                ${p("undo.changed_here",{operation:s,dashboards:this._undoChanged.join(", ")},this.hass)}
              </ha-alert>`:m``}
        <ha-button .disabled=${this._busy} @click=${this._undo}>
          ${p(this._undoChanged?"undo.anyway_button":"undo.button",{operation:s},this.hass)}
        </ha-button>
      </div>
    `}async _undo(){const t=te();if(t){this._busy=!0;try{const e=await ie(this,this.hass,t,!!this._undoChanged,!1);this._undoChanged="changed"===(null==e?void 0:e.result)?e.dashboards:void 0}finally{this._busy=!1}}}_renderSimilar(t){var e;if((null===(e=this._similar)||void 0===e?void 0:e.ll)!==t){const e=se(t);this._similar={ll:t,cards:e,groups:ko(e.map(t=>t.config))}}const{cards:i,groups:s}=this._similar;if(!s.length)return m``;const n=Object.keys(d(t));return m`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${p(1===s.length?"tools.similar_header_one":"tools.similar_header",{count:s.length},this.hass)}
        </span>
        <p class="hint">${p("tools.similar_hint",{max:8},this.hass)}</p>
        ${s.slice(0,10).map(t=>this._renderSimilarGroup(t,i,n))}
      </ha-expansion-panel>
    `}_renderSimilarGroup(t,e,i){var s;const n=t.indices.map(t=>e[t]),a=Oo(n.map(t=>t.config)),o=(null!==(s=this._similarNames[t.key])&&void 0!==s?s:function(t,e,i=[]){let s=So(t.replace(/^custom:/,"").replace(/-/g,"_")).toLowerCase();/(^|_)card$/.test(s)||(s=`${s}_card`);const n=new Set(i.map(t=>"string"==typeof(null==t?void 0:t.entity)&&t.entity.includes(".")?t.entity.split(".")[0]:"")),[a]=[...n];return 1===n.size&&a&&(s=`${So(a).toLowerCase()}_${s}`),Ge(s,e)}(t.type,i,n.map(t=>t.config))).trim(),r=this._similarPending===`${t.key}\0${o}`,l=i.includes(o);return m`
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
                ${Ai(`${t.key}\0${o}`,m`<ha-yaml-editor
                    .hass=${this.hass}
                    .defaultValue=${{[o]:a.template}}
                    read-only
                  ></ha-yaml-editor>`)}
                <p class="hint">${p("tools.similar_first_card",void 0,this.hass)}</p>
                ${mo(n[0].config,Co(o,a.variables[0],a.layout[0]),this.hass)}
              `:m``}
        ${$i({label:p("tools.similar_name",void 0,this.hass),value:o,disabled:this._busy,onInput:e=>{this._similarNames=Object.assign(Object.assign({},this._similarNames),{[t.key]:e}),this._similarPending=void 0}})}
        <ha-button
          .disabled=${this._busy||!o||l}
          @click=${()=>{this._makeTemplate(t,n,o)}}
        >
          ${p(r?"tools.similar_make_anyway":"tools.similar_make",void 0,this.hass)}
        </ha-button>
      </div>
    `}async _makeTemplate(t,e,i){const s=`${t.key}\0${i}`;if(this._similarPending!==s)return void(this._similarPending=s);const n=await this._saveDashboard(t=>function(t,e,i){const{template:s,variables:n,layout:a}=Oo(e);let o=It(t,i,s);return e.forEach((t,e)=>{o=z(o,t,Co(i,n[e],a[e]))}),o}(t,e.map(t=>t.config),i),"make_template");if(n){this._similarPending=void 0;const e=Object.assign({},this._similarNames);delete e[t.key],this._similarNames=e}}_renderElsewhere(t){var e;if((null===(e=this._remoteUsages)||void 0===e?void 0:e.name)!==t){this._remoteUsages={name:t,list:[]};const e=document.location.pathname.split("/").filter(Boolean)[0];ne(this.hass,t,e).then(e=>{var i;(null===(i=this._remoteUsages)||void 0===i?void 0:i.name)===t&&(this._remoteUsages={name:t,list:e})})}const i=this._remoteUsages.list;if(!i.length)return m``;const s=i.map(t=>`${t.urlPath} (${t.total})`).join(", ");return m`<ha-alert alert-type="info">
      ${p("template_editor.usages_elsewhere",{list:s},this.hass)}
    </ha-alert>`}_renderImpact(t,e){const i=ae(t,e);if(!i||!this._config)return m``;const s=t=>{if(t)return I(i.variables,t,E(t),e,this.hass,!0)};let n,a;try{n=s(d(t)[e]),a=s(d(t,void 0,this._config)[e])}catch(o){return m``}return m`
      <ha-expansion-panel outlined>
        <span slot="header">${p("template_editor.impact_header",void 0,this.hass)}</span>
        <p class="hint">${p("template_editor.impact_diff_hint",void 0,this.hass)}</p>
        ${fo(n,a,this.hass)}
      </ha-expansion-panel>
    `}_renderRename(t,e){const i=this._renameTo.trim(),s=!!i&&this._renamePending===i,n=e?1===e?p("tools.rewrites_one",void 0,this.hass):p("tools.rewrites_many",{count:e},this.hass):"";return m`
      <div class="rename">
        <h3>${p("tools.rename_header",void 0,this.hass)}</h3>
        <p class="hint">${p("tools.rename_hint",void 0,this.hass)}</p>
        ${this._renameError?m`<ha-alert alert-type="error">${this._renameError}</ha-alert>`:m``}
        ${s?m`<ha-alert alert-type="warning">
                ${p("tools.rename_confirm",{from:t,to:i,rewrites:n},this.hass)}
              </ha-alert>`:m``}
        ${$i({label:p("tools.new_name",void 0,this.hass),value:this._renameTo,disabled:this._renaming,onInput:t=>this._renameChanged(t)})}
        <ha-button .disabled=${this._renaming||!i||i===t} @click=${this._rename}>
          ${s?p("tools.rename_anyway",void 0,this.hass):1===e?p("tools.rename_update_one",void 0,this.hass):e?p("tools.rename_update_many",{count:e},this.hass):p("tools.rename",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderModernise(){const t=this._savedLovelace,e=t?oe(t):0;return e?m`
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
    `:m``}async _modernise(){if(!this._modernisePending)return void(this._modernisePending=!0);await this._saveDashboard(t=>re(t),"modernise")&&(this._modernisePending=!1)}_renameChanged(t){this._renameTo=t,this._renameError=void 0,this._renamePending=void 0}async _rename(){var t,e;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._renameTo.trim();if(!i||!s||s===i)return;const n=L();if(n)if(void 0===d(n.config)[s])if(this._renamePending===s){this._renaming=!0,this._renameError=void 0;try{await D(this,this.hass,"rename_template",[{urlPath:V(),build:t=>le(t,i,s)}],this._config),this._undoChanged=void 0,this._fireConfigChanged(Object.assign(Object.assign({},this._config),{template:s})),this._renameTo="",this._renamePending=void 0}catch(a){this._renameError=p("tools.save_failed",{message:null!==(e=null==a?void 0:a.message)&&void 0!==e?e:a},this.hass)}finally{this._renaming=!1}}else this._renamePending=s;else this._renameError=p("tools.name_taken",{name:s},this.hass);else this._renameError=p("tools.cannot_rename_here",void 0,this.hass)}_renderSearch(){const t=this._searchQuery.trim(),e=this._searchResult,i=t=>"variables"===t.where?"":p(`tools.search_in_${t.where}`,void 0,this.hass),s=t=>t.view.title||t.view.path||p("template_editor.untitled_view",void 0,this.hass);return m`
      <div class="rename">
        <h3>${p("tools.search_header",void 0,this.hass)}</h3>
        <p class="hint">${p("tools.search_hint",void 0,this.hass)}</p>
        ${$i({label:p("tools.search_label",void 0,this.hass),value:this._searchQuery,onInput:t=>{this._searchQuery=t},onKeydown:t=>{"Enter"===t.key&&this._search()}})}
        <ha-button .disabled=${this._searching||!t} @click=${()=>{this._search()}}>
          ${p(this._searching?"tools.searching":"tools.search",void 0,this.hass)}
        </ha-button>
        ${!e||e.cards.length||e.templates.length?m``:m`<p class="hint">${p("tools.search_none",{query:e.query},this.hass)}</p>`}
        ${(null==e?void 0:e.cards.length)?m`
                <p class="hint">${p("tools.search_cards",{count:e.cards.length},this.hass)}</p>
                <ul>
                  ${e.cards.slice(0,_i).map(t=>m`
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
                ${e.cards.length>_i?m`<p class="hint">
                        ${p("editor.matches_more",{count:e.cards.length-_i},this.hass)}
                      </p>`:m``}
              `:m``}
        ${(null==e?void 0:e.templates.length)?m`
                <p class="hint">${p("tools.search_templates",{count:e.templates.length},this.hass)}</p>
                <ul>
                  ${e.templates.slice(0,_i).map(t=>m`<li>
                          ${t.urlPath} › ${t.template}: <code>${t.path}</code> = ${t.value}
                        </li>`)}
                </ul>
                ${e.templates.length>_i?m`<p class="hint">
                        ${p("editor.matches_more",{count:e.templates.length-_i},this.hass)}
                      </p>`:m``}
              `:m``}
      </div>
    `}async _search(){const t=this._searchQuery.trim();if(t&&!this._searching){this._searching=!0;try{const i=V(),s=Rt(this.hass),n=[{urlPath:i,config:this._savedLovelace}];for(const t of this.hass?await ce(this.hass):[])if(he(t)!==i)try{n.push({urlPath:t,config:await Vt(s,t)})}catch(e){}this._searchResult=Object.assign({query:t},function(t,e){var i;const s=e.trim().toLowerCase(),n=[],a=[];if(!s)return{cards:n,templates:a};const o=t=>t.toLowerCase().includes(s);for(const{urlPath:r,config:l}of t){const t=(t,e)=>{var i,s;const a=(i,s,a)=>{n.push({urlPath:r,view:e,template:t.template,where:i,variable:s,value:a})},l=(t,e,i="")=>{for(const s of $(e)){const[e,n]=Object.entries(s)[0];for(const s of vo(n,`${i}${e}`))o(s.value)&&a(t,s.path,s.value)}};l("variables",t.variables);for(const n of null!==(i=A(t.for_each))&&void 0!==i?i:[])l("for_each",n);const c=null===(s=t.for_each_from)||void 0===s?void 0:s.overrides;if(c&&"object"==typeof c)for(const[n,r]of Object.entries(c))o(n)&&a("overrides",n,n),l("overrides",r,`${n} › `);for(const n of _o)if(void 0!==t[n])for(const e of vo(t[n],n))o(e.value)&&a("override_block",e.path,e.value)},e=(i,s)=>{if(Array.isArray(i))for(const t of i)e(t,s);else if(i&&"object"==typeof i&&!Wt(i.type)){yt.includes(i.type)&&"string"==typeof i.template&&t(i,s);for(const t of Object.values(i))e(t,s)}};(null!==(i=null==l?void 0:l.views)&&void 0!==i?i:[]).forEach((t,i)=>{var s,n,a;return e(t,{title:null!==(n=null!==(s=null==t?void 0:t.title)&&void 0!==s?s:null==t?void 0:t.path)&&void 0!==n?n:"",path:null!==(a=null==t?void 0:t.path)&&void 0!==a?a:"",index:i})});for(const[i,s]of Object.entries(Ht(l))){const t=Object.assign({},null!=s?s:{});delete t.type,delete t.template;for(const e of vo(t,""))o(e.value)&&a.push(Object.assign({urlPath:r,template:i},e))}}return{cards:n,templates:a}}(n,t))}finally{this._searching=!1}}}_renderRenameVariable(t){const e=zo(this._config);if(!e.length||!this._config)return m``;const i=this._varFrom&&e.includes(this._varFrom)?this._varFrom:void 0,s=this._varTo.trim(),n=this._varPending,a=!!n&&n.from===i&&n.to===s,o=a&&n.elsewhere.length?p("tools.rename_variable_elsewhere",{list:n.elsewhere.map(t=>`${t.urlPath} (${t.cards})`).join(", ")},this.hass):"";return m`
      <div class="rename">
        <h3>${p("tools.rename_variable_header",void 0,this.hass)}</h3>
        <p class="hint">${p("tools.rename_variable_hint",void 0,this.hass)}</p>
        ${this._varError?m`<ha-alert alert-type="error">${this._varError}</ha-alert>`:m``}
        ${a&&i?m`
                <ha-alert alert-type="warning">
                  ${p("tools.rename_variable_confirm",{from:i,to:s,templates:n.templates,cards:n.cards,elsewhere:o},this.hass)}
                </ha-alert>
                ${mo(this._config,Do(this._config,i,s),this.hass)}
              `:m``}
        <ha-form
          .hass=${this.hass}
          .data=${{variable:null!=i?i:""}}
          .schema=${[{name:"variable",selector:{select:{mode:"dropdown",options:e.map(t=>({value:t,label:t}))}}}]}
          .computeLabel=${()=>p("tools.rename_variable_pick",void 0,this.hass)}
          @value-changed=${this._varPicked}
        ></ha-form>
        ${$i({label:p("tools.new_name",void 0,this.hass),value:this._varTo,disabled:this._busy,onInput:t=>this._varToChanged(t)})}
        <ha-button
          .disabled=${this._busy||!i||!s||s===i}
          @click=${()=>{this._renameVariable(t)}}
        >
          ${p(a?"tools.rename_anyway":"tools.rename_variable",void 0,this.hass)}
        </ha-button>
      </div>
    `}_varPicked(t){t.stopPropagation(),this._varFrom=t.detail.value.variable||void 0,this._varError=void 0,this._varPending=void 0}_varToChanged(t){this._varTo=t,this._varError=void 0,this._varPending=void 0}async _renameVariable(t){var e;const i=this._varFrom,s=this._varTo.trim();if(!i||!s||s===i||!this._config)return;if(!function(t){return/^[A-Za-z0-9_-]+$/.test(t)}(s))return void(this._varError=p("tools.rename_variable_invalid",{name:s},this.hass));const n=L();if(!n)return void(this._varError=p("tools.cannot_save_here",void 0,this.hass));if(function(t,e,i,s){const n=Ht(t);for(const a of Vo(t,e))if(zo(a===e&&s?s:n[a]).includes(i))return!0;return!1}(n.config,t,s,this._config))return void(this._varError=p("tools.rename_variable_taken",{name:s},this.hass));const a=V(),o=this._varPending;if(o&&o.from===i&&o.to===s){this._busy=!0,this._varError=void 0;try{let e;await D(this,this.hass,"rename_variable",[{urlPath:a,build:n=>(e=Vo(n,t),qo(n,t,i,s).config)},...o.elsewhere.map(n=>({urlPath:n.urlPath,build:n=>Uo(n,t,a)?qo(n,t,i,s,e).config:n}))],this._config),this._undoChanged=void 0,this._fireConfigChanged(Do(this._config,i,s)),this._varFrom=s,this._varTo="",this._varPending=void 0}catch(r){this._varError=p("tools.save_failed",{message:null!==(e=null==r?void 0:r.message)&&void 0!==e?e:r},this.hass)}finally{this._busy=!1}}else{this._busy=!0;try{const e=Rt(this.hass),o=await Vt(e,a).catch(()=>n.config),r=qo(o,t,i,s),c=Vo(o,t),h=[];for(const n of this.hass?await ce(this.hass):[]){if(he(n)===a)continue;let o;try{o=await Vt(e,n)}catch(l){continue}if(!Uo(o,t,a))continue;const r=qo(o,t,i,s,c);(r.cards||r.templates)&&h.push({urlPath:n,cards:r.cards})}this._varPending={from:i,to:s,cards:r.cards,templates:r.templates,elsewhere:h}}finally{this._busy=!1}}}_renderDuplicate(t){const e=this._duplicateTo.trim(),i=!!e&&this._duplicatePending===e;return m`
      <div class="rename">
        <h3>${p("tools.duplicate_header",void 0,this.hass)}</h3>
        <p class="hint">${p("tools.duplicate_hint",void 0,this.hass)}</p>
        ${i?m`<ha-alert alert-type="warning">
                ${p("tools.duplicate_confirm",{to:e,name:t},this.hass)}
              </ha-alert>`:m``}
        ${$i({label:p("tools.copy_name",void 0,this.hass),value:this._duplicateTo,disabled:this._busy,onInput:t=>this._duplicateChanged(t)})}
        <ha-button .disabled=${this._busy||!e||e===t} @click=${this._duplicate}>
          ${p(i?"tools.duplicate_anyway":"tools.duplicate",void 0,this.hass)}
        </ha-button>
      </div>
    `}_duplicateChanged(t){this._duplicateTo=t,this._toolError=void 0,this._duplicatePending=void 0}async _duplicate(){var t,e;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._duplicateTo.trim();if(!i||!s||s===i)return;const n=L();if(n&&void 0!==d(n.config)[s])return void(this._toolError=p("tools.name_taken",{name:s},this.hass));if(this._duplicatePending!==s)return void(this._duplicatePending=s);const a=Object.assign(Object.assign({},this._config),{template:s}),o=U(null!==(e=null==n?void 0:n.config)&&void 0!==e?e:this.lovelace,i),r=await this._saveDashboard(t=>{var e,i;return Ft(t,null!==(i=null===(e=null==o?void 0:o.view)||void 0===e?void 0:e.index)&&void 0!==i?i:0,a)},"duplicate");r&&(this._duplicateTo="",this._duplicatePending=void 0)}}t([i({attribute:!1})],Ko.prototype,"hass",void 0),t([i({attribute:!1})],Ko.prototype,"lovelace",void 0),t([i({attribute:!1})],Ko.prototype,"config",void 0),t([e()],Ko.prototype,"_renameTo",void 0),t([e()],Ko.prototype,"_renameError",void 0),t([e()],Ko.prototype,"_renaming",void 0),t([e()],Ko.prototype,"_renamePending",void 0),t([e()],Ko.prototype,"_duplicateTo",void 0),t([e()],Ko.prototype,"_duplicatePending",void 0),t([e()],Ko.prototype,"_toolError",void 0),t([e()],Ko.prototype,"_busy",void 0),t([e()],Ko.prototype,"_modernisePending",void 0),t([e()],Ko.prototype,"_remoteUsages",void 0),t([e()],Ko.prototype,"_undoChanged",void 0),t([e()],Ko.prototype,"_similarNames",void 0),t([e()],Ko.prototype,"_similarPending",void 0),t([e()],Ko.prototype,"_searchQuery",void 0),t([e()],Ko.prototype,"_searching",void 0),t([e()],Ko.prototype,"_searchResult",void 0),t([e()],Ko.prototype,"_varFrom",void 0),t([e()],Ko.prototype,"_varTo",void 0),t([e()],Ko.prototype,"_varError",void 0),t([e()],Ko.prototype,"_varPending",void 0),customElements.get("decluttering-template-usages-tab")||customElements.define("decluttering-template-usages-tab",Ko);class Ho extends s{constructor(){super(...arguments),this._selectedTab="settings",this._suggestedNothing=!1,this._busy=!1,this._declutterPending=!1,this._promoteName="",this._loadedElements=!1}get _savedLovelace(){var t,e,i;return null!==(i=null!==(e=null===(t=L())||void 0===t?void 0:t.config)&&void 0!==e?e:this.lovelace)&&void 0!==i?i:h()}static schema(){var t;return null!==(t=Ho._schema)&&void 0!==t||(Ho._schema=[{name:"template",label:p("template_editor.template_label"),selector:{text:{}}},{name:"thingType",label:p("template_editor.type_label"),selector:{select:{mode:"dropdown",options:[{value:"card",label:p("template_editor.type_card")},{value:"badge",label:p("template_editor.type_badge")},{value:"row",label:p("template_editor.type_row")},{value:"element",label:p("template_editor.type_element")}]}}},{name:"description",label:p("template_editor.description_label"),helper:p("template_editor.description_helper"),selector:{text:{multiline:!0}}},{name:"variables",label:p("template_editor.declarations_label"),helper:p("template_editor.declarations_helper"),selector:{object:{}}},{name:"default",label:p("template_editor.defaults_label"),helper:p("template_editor.defaults_helper"),selector:{object:{}}}]),Ho._schema}setConfig(t){this._config=t,this._suggestion=void 0,this._suggestedNothing=!1}render(){var t;if(!this.hass||!this._config)return m``;const e={};g(this._config.default)&&g(this._config.defaults)||(e.default=p("error.variables_shape",void 0,this.hass)),de(this._config.variables)||(e.variables=p("template_editor.declarations_shape",void 0,this.hass));const i={template:this._config.template,thingType:null!==(t=v(this._config))&&void 0!==t?t:"card",description:this._config.description,variables:this._config.variables,default:ft(this._config)};return m`
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
                .schema=${Ho.schema()}
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
    `}_renderDiagnostics(){if(!this._config||!de(this._config.variables))return m``;const{unused:t,duplicated:e,contradictory:i}=ue(this._config);return m`
      ${t.length?m`<ha-alert alert-type="info">
              ${p(1===t.length?"template_editor.declared_unused_one":"template_editor.declared_unused_many",{names:t.join(", ")},this.hass)}
            </ha-alert>`:m``}
      ${e.length?m`<ha-alert alert-type="warning">
              ${p(1===e.length?"template_editor.duplicated_one":"template_editor.duplicated_many",{names:e.join(", ")},this.hass)}
            </ha-alert>`:m``}
      ${i.length?m`<ha-alert alert-type="warning">
              ${p(1===i.length?"template_editor.contradictory_one":"template_editor.contradictory_many",{names:i.join(", ")},this.hass)}
            </ha-alert>`:m``}
    `}_renderExamplePicker(){var t;const e=null===(t=this._config)||void 0===t?void 0:t.template,i=b(this._config);if(!e||!i.length)return m``;const s=pe.get(e);return m`
      <ha-form
        .hass=${this.hass}
        .data=${{example:void 0===s||s>=i.length?"":String(s)}}
        .schema=${[{name:"example",selector:{select:{mode:"dropdown",options:[{value:"",label:p("template_editor.preview_defaults",void 0,this.hass)},...i.map((t,e)=>({value:String(e),label:p("template_editor.example_n",{number:e+1},this.hass)}))]}}}]}
        .computeLabel=${()=>p("template_editor.preview_example_label",void 0,this.hass)}
        @value-changed=${this._previewExamplePicked}
      ></ha-form>
    `}_previewExamplePicked(t){var e;t.stopPropagation();const i=null===(e=this._config)||void 0===e?void 0:e.template;if(!i)return;const s=t.detail.value.example;void 0===s||""===s?pe.delete(i):pe.set(i,Number(s)),window.dispatchEvent(new CustomEvent(me,{detail:{template:i}})),this.requestUpdate()}_renderLint(){if(!this._config)return m``;const t=this._savedLovelace,e=d(t,void 0,this._config)[this._config.template],i=function(t,e=[]){if(!t||"object"!=typeof t)return[];const i={findings:[],heads:new Map,targets:[]};for(const r of oi){const e=t[r];void 0!==e&&mi(e,r,i)}f(t).forEach((t,e)=>{void 0!==t.default&&mi(t.default,`variables[${e}].default`,i)});const s=new Set([...fi(t),...e,...tt,...st(t)]),n=[...i.findings];for(const r of i.targets){if(s.has(r.name)||i.heads.has(r.name))continue;const t=xt(r.name,[...s,...i.heads.keys()]);n.push({level:"warning",key:"lint.target_unknown",params:t?{name:r.name,placeholder:r.placeholder,closest:t}:{name:r.name,placeholder:r.placeholder},path:r.path})}const a=[...i.heads.entries()].filter(([t])=>!s.has(t));a.length&&n.push({level:"info",key:"lint.undeclared",params:{names:a.map(([t,e])=>a.length>1?`${t} (${e})`:t).join(", ")},path:a.length>1?"":a[0][1]});const o=new Set;return n.filter(t=>{const e=JSON.stringify([t.key,t.params,t.path]);return!o.has(e)&&(o.add(e),!0)})}(this._config,[...fi(e),...Object.keys(at(t))]);return i.length?m`${i.map(t=>m`<ha-alert alert-type=${t.level}>
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
    `}_move(t,e){const i=f(this._config),s=fe(i,t,e);s!==i&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{variables:s}))}_renderGroupOrder(){var t;const e=null===(t=this._config)||void 0===t?void 0:t.group,i=ge(e);if(void 0===e||i.length<2)return m``;const s=i.map((t,e)=>{var i,s,n,a;const o=null!==(n=null!==(s=null!==(i=null==t?void 0:t.name)&&void 0!==i?i:null==t?void 0:t.heading)&&void 0!==s?s:null==t?void 0:t.title)&&void 0!==n?n:null==t?void 0:t.entity,r=String(null!==(a=null==t?void 0:t.type)&&void 0!==a?a:"?").replace(/^custom:/,"");return{label:"string"==typeof o?`${r} (${o})`:r,name:`${e+1} ${r}`}});return m`
      <div class="order">
        <p class="hint">${p("template_editor.group_order_hint",void 0,this.hass)}</p>
        ${this._renderSortable("group",s,(t,s)=>{const n=fe(i,t,s);n!==i&&this._config&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{group:_e(e,n)}))})}
      </div>
    `}_renderPromote(){const t=ei(this._config);if(!this._config||!t)return m``;const e=function(t){const e=[],i=(t,s)=>{if(Array.isArray(t))t.forEach((t,e)=>i(t,[...s,e]));else if(t&&"object"==typeof t)for(const[e,n]of Object.entries(t))"type"===e&&"string"==typeof n||i(n,[...s,e]);else"string"==typeof t&&pt.test(t)||s.length&&null!=t&&("string"!=typeof t&&"number"!=typeof t&&"boolean"!=typeof t||e.push({path:s,value:t,label:ii(s)}))};return i(t,[]),e}(this._config[t]);if(!e.length)return m``;const i=this._promotePath?JSON.stringify(this._promotePath):"",s=t=>{const e=String(t);return e.length>40?`${e.slice(0,39)}…`:e};return m`
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
                ${$i({label:p("template_editor.promote_name",void 0,this.hass),value:this._promoteName,onInput:t=>{this._promoteName=t,this._promoteError=void 0}})}
                ${this._promoteError?m`<ha-alert alert-type="error">${this._promoteError}</ha-alert>`:m``}
                <ha-button .disabled=${!this._promoteName.trim()} @click=${this._promote}>
                  ${p("template_editor.promote_button",void 0,this.hass)}
                </ha-button>
              `:m``}
      </ha-expansion-panel>
    `}_promotePicked(t){t.stopPropagation();const e=t.detail.value.setting;e&&(this._promotePath=JSON.parse(e),this._promoteName=function(t,e){const i=[...t].reverse().find(t=>"string"==typeof t),s=t[t.length-1];return Ge(("number"==typeof s?`${null!=i?i:"item"}_${s+1}`:null!=i?i:"value").replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value",e)}(this._promotePath,si(this._config)),this._promoteError=void 0)}_promote(){if(!this._config||!this._promotePath)return;const t=this._promoteName.trim(),e=function(t,e,i){if(!Xe.test(i))return{ok:!1,error:"name_invalid"};if(si(t).includes(i))return{ok:!1,error:"name_taken"};const s=ei(t),n=s?function(t,e){return e.reduce((t,e)=>null==t?void 0:t[e],t)}(t[s],e):void 0;if(!s||null==n||"object"==typeof n)return{ok:!1,error:"gone"};const a={name:i,type:ni(n),default:n};return{ok:!0,template:Object.assign(Object.assign({},t),{[s]:ai(t[s],e,`[[${i}]]`),variables:wt(t.variables,[a])})}}(this._config,this._promotePath,t);e.ok?(this._promotePath=void 0,this._promoteName="",this._fireConfigChanged(e.template)):this._promoteError=p(`template_editor.promote_${e.error}`,{name:t},this.hass)}_renderInUse(){var t;const e=null===(t=this._config)||void 0===t?void 0:t.template,i=this._savedLovelace;if(!e||!i)return m``;const{views:s,templates:n}=Xt(i,e),a=s.reduce((t,e)=>t+e.count,0)+n.length;return a?m`<ha-alert alert-type="info">
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
    `:m``}_suggest(){var t;if(!(null===(t=this._config)||void 0===t?void 0:t.card))return;if(this._suggestion){const t=Object.assign(Object.assign({},this._config),{card:this._suggestion.card});return t.variables=wt(this._config.variables,this._suggestion.variables),this._suggestion=void 0,void this._fireConfigChanged(t)}this._suggestedNothing=!1;const e=f(this._config).map(t=>t.name),i=function(t,e){const i=new Set(e),s=[],n=new Map,a=(t,e)=>{const a=`${t.base} ${e}`,o=n.get(a);if(o)return o;let r=1,l=t.base;for(;i.has(l);)r+=1,l=`${t.base}_${r}`;return i.add(l),n.set(a,l),s.push({name:l,label:qe(t,r),selector:t.selector,default:e}),l},o=t=>{if(Array.isArray(t))return t.map(o);if(!t||"object"!=typeof t)return t;const e={};for(const[i,s]of Object.entries(t)){const t=Object.prototype.hasOwnProperty.call(ze,i)?ze[i]:void 0;t&&"string"==typeof s&&!pt.test(s)&&t.matches(s)?e[i]=`[[${a(t,s)}]]`:e[i]=o(s)}return e};return{card:o(t),variables:s}}(this._config.card,e);i.variables.length?this._suggestion=i:this._suggestedNothing=!0}_renderDeclutter(){var t,e;const i=this._savedLovelace,s=se(i),n="card"===v(null!==(t=this._config)&&void 0!==t?t:{})?ve(i):[];if(!s.length&&!n.length||!this._config)return m``;const a=this._config.template,o=!!a&&a in d(i),r=null!==(e=this._declutterOriginal)&&void 0!==e?e:this._declutterSection;return m`
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
    `}_declutterPicked(t,e){t.stopPropagation();const i=e[Number(t.detail.value.pick)];if(!i||!this._config)return;this._declutterOriginal=i.config,this._declutterSection=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{card:JSON.parse(JSON.stringify(i.config))});delete s.group,this._fireConfigChanged(s)}_declutterSectionPicked(t,e){t.stopPropagation();const i=e[Number(t.detail.value.pick)];if(!i||!this._config)return;this._declutterSection={view:i.view,section:i.section,cards:i.cards},this._declutterOriginal=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{group:{cards:JSON.parse(JSON.stringify(i.cards))}});delete s.card,this._fireConfigChanged(s)}async _declutterReplace(){var t;const e=null===(t=this._config)||void 0===t?void 0:t.template,i=this._declutterOriginal,s=this._declutterSection;if(!e||!i&&!s)return;if(!this._declutterPending)return void(this._declutterPending=!0);const n={type:"custom:decluttering-card-plus",template:e};let a=!1;const o=await this._saveDashboard(t=>{if(i)return z(t,i,n);const e=ye(t,s.view,s.section,s.cards,[n]);return a=e===t,e},"declutter");o&&a&&(this._toolError=p("template_editor.declutter_section_changed",void 0,this.hass)),o&&(this._declutterPending=!1,this._declutterOriginal=void 0,this._declutterSection=void 0)}_selectTab(t){t.stopPropagation(),this._selectedTab=t.detail}_activateTab(t){const e=t.composedPath().find(t=>"ha-tab-group-tab"===t.localName),i=null==e?void 0:e.getAttribute("panel");i&&(this._selectedTab=i)}_valueChanged(t){if(!this._config)return;const e=t.detail.value,i=Object.assign(Object.assign({},this._config),{template:e.template,default:e.default});void 0!==this._config.defaults&&(JSON.stringify(e.default)===JSON.stringify(ft(this._config))?i.default=this._config.default:delete i.defaults),ht(i,"description",e.description),ht(i,"variables",e.variables);const s=void 0!==i.group&&"card"===e.thingType;s||delete i.group;for(const[n,a]of Object.entries(gi))Ho.stubMember(!s&&e.thingType===n,i,n,a);this._fireConfigChanged(i)}_cardChanged(t){if(t.stopPropagation(),!this._config)return;this._suggestion=void 0,this._suggestedNothing=!1;const e=Object.assign(Object.assign({},this._config),{card:t.detail.config});this._fireConfigChanged(e)}_cardPicked(t){this._selectedTab="card",this._cardChanged(t)}_rowChanged(t){if(t.stopPropagation(),!this._config)return;const e=Object.assign(Object.assign({},this._config),{row:t.detail.config});this._fireConfigChanged(e)}_fireConfigChanged(t){this._suggestion=void 0,this._suggestedNothing=!1,w(this,"config-changed",{config:t})}static stubMember(t,e,i,s){t?i in e||(e[i]=s):delete e[i]}static get styles(){return xi}_saveDashboard(t,e,i){return wi(this,t,e,i)}async connectedCallback(){var t;super.connectedCallback(),null!==(t=this._stopLanguageListener)&&void 0!==t||(this._stopLanguageListener=l(()=>this.requestUpdate())),this._loadedElements||(await c(),await async function(){let t=customElements.get("hui-entities-card");if(!t){if(!Ot)return;(await Ot).createCardElement({type:"entities",entities:[]}),await customElements.whenDefined("hui-entities-card"),t=customElements.get("hui-entities-card")}t&&t.getConfigElement&&await t.getConfigElement()}(),this._loadedElements=!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._stopLanguageListener)||void 0===t||t.call(this),this._stopLanguageListener=void 0}}t([e()],Ho.prototype,"_config",void 0),t([e()],Ho.prototype,"_selectedTab",void 0),t([e()],Ho.prototype,"_suggestion",void 0),t([e()],Ho.prototype,"_suggestedNothing",void 0),t([e()],Ho.prototype,"_toolError",void 0),t([e()],Ho.prototype,"_busy",void 0),t([e()],Ho.prototype,"_declutterOriginal",void 0),t([e()],Ho.prototype,"_declutterSection",void 0),t([e()],Ho.prototype,"_declutterPending",void 0),t([e()],Ho.prototype,"_promotePath",void 0),t([e()],Ho.prototype,"_promoteName",void 0),t([e()],Ho.prototype,"_promoteError",void 0),t([i()],Ho.prototype,"lovelace",void 0),t([i()],Ho.prototype,"hass",void 0);class Wo extends s{connectedCallback(){var t;super.connectedCallback(),null!==(t=this._stopLanguageListener)&&void 0!==t||(this._stopLanguageListener=l(()=>this.requestUpdate()))}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._stopLanguageListener)||void 0===t||t.call(this),this._stopLanguageListener=void 0}static get styles(){return n`
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
    `}render(){var t,e,i,s,n,a,o,r,l;const c=this.lovelace,h=dt(c);if(h&&(null===(t=this._borrowed)||void 0===t?void 0:t.ll)!==c){this._borrowed={ll:c};const t=new Set(Object.keys(d(c)));ut(this.hass,c).then(e=>{var i;(null===(i=this._borrowed)||void 0===i?void 0:i.ll)===c&&(this._borrowed={ll:c,names:Object.keys(e).filter(e=>!t.has(e)),templates:e})})}const u=h&&!(null===(e=this._borrowed)||void 0===e?void 0:e.names),f=be(c,h&&null!==(s=null===(i=this._borrowed)||void 0===i?void 0:i.names)&&void 0!==s?s:[]),g=u?Object.assign(Object.assign({},f),{missingTemplates:[]}):f,_=$e(c),v=we(c),y=null===(n=this._borrowed)||void 0===n?void 0:n.names,b=this._examplesChecked;u||(null==b?void 0:b.ll)===c&&(null==b?void 0:b.borrowed)===y||(this._examplesChecked={ll:c,borrowed:y,failed:xe(d(c),null!=y?y:[],this.hass)});const $=u?[]:null!==(o=null===(a=this._examplesChecked)||void 0===a?void 0:a.failed)&&void 0!==o?o:[],w=Io(c,null!==(l=null===(r=this._borrowed)||void 0===r?void 0:r.templates)&&void 0!==l?l:d(c)),x=!(g.missingTemplates.length||g.unsetVariables.length||g.unusedTemplates.length||_.length||v.length||$.length||w.length);return m`
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
    `}_renderTimings(){const t=ke.entries(),e=t=>t.toFixed(1),i=m`<h4 class="timings-header">${p("tools.timings_header",void 0,this.hass)}</h4>`;if(!t.length)return m`${i}
        <p class="hint">${p("tools.timings_none",void 0,this.hass)}</p>`;const{byTotal:s,byMax:n,repeats:a}=Se(t);return m`
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
    `}}t([i({attribute:!1})],Wo.prototype,"hass",void 0),t([i({attribute:!1})],Wo.prototype,"lovelace",void 0),t([e()],Wo.prototype,"_borrowed",void 0),Ae(je,Me),Ae(Oe,Ho),Ae(Ce,Wo);export{Me as DeclutteringCardEditor,Wo as DeclutteringHealthPanel,Ho as DeclutteringTemplateEditor};
//# sourceMappingURL=decluttering-card-plus.editors-Ckq95tGQ.js.map
