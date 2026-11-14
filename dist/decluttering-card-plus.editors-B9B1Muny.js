import{b as e,j as t,E as i,_ as s,n as a,r as o,i as r,a as n,t as l,A as d,l as c,c as h,d as u,s as p,e as m,f as v,g as _,h as f,k as g,m as b,O as y,o as $,p as w,q as x,W as k,u as j,v as O,w as A,S,x as C,y as P,P as E,z as L,B as T,C as N,D as M,F as V,G as D,H as z,I as F,J as H,K as R,L as q,M as I,N as W,Q as J,R as U,T as B,U as K,X as Z,Y,Z as G,$ as Q,a0 as X,a1 as ee,a2 as te,a3 as ie,a4 as se,a5 as ae,a6 as oe,a7 as re,a8 as ne,a9 as le,aa as de,ab as ce,ac as he,ad as ue,ae as pe,af as me,ag as ve,ah as _e,ai as fe,aj as ge,ak as be,al as ye,am as $e,an as we,ao as xe,ap as ke,aq as je,ar as Oe,as as Ae,at as Se,au as Ce,av as Pe,aw as Ee,ax as Le,ay as Te,az as Ne,aA as Me,aB as Ve,aC as De,aD as ze,aE as Fe,aF as He,aG as Re,aH as qe,aI as Ie,aJ as We,aK as Je,aL as Ue,aM as Be,aN as Ke,aO as Ze,aP as Ye,aQ as Ge,aR as Qe,aS as Xe,aT as et,aU as tt,aV as it,aW as st,aX as at,aY as ot,aZ as rt,a_ as nt,a$ as lt,b0 as dt,b1 as ct,b2 as ht,b3 as ut,b4 as pt,b5 as mt,b6 as vt,b7 as _t,b8 as ft,b9 as gt,ba as bt,bb as yt,bc as $t,bd as wt,be as xt,bf as kt,bg as jt,bh as Ot,bi as At,bj as St,bk as Ct,bl as Pt,bm as Et,bn as Lt,bo as Tt,bp as Nt,bq as Mt,br as Vt,bs as Dt,bt as zt,bu as Ft,bv as Ht,bw as Rt,bx as qt,by as It,bz as Wt,bA as Jt,bB as Ut,bC as Bt,bD as Kt,bE as Zt,bF as Yt,bG as Gt,bH as Qt,bI as Xt,bJ as ei,bK as ti,bL as ii,bM as si,bN as ai,bO as oi,bP as ri,bQ as ni,bR as li,bS as di,bT as ci,bU as hi,bV as ui,bW as pi,bX as mi,bY as vi,bZ as _i,b_ as fi,b$ as gi,c0 as bi,c1 as yi,c2 as $i,V as wi,c3 as xi,c4 as ki,c5 as ji,c6 as Oi,c7 as Ai,c8 as Si,c9 as Ci,ca as Pi,cb as Ei,cc as Li,cd as Ti,ce as Ni,cf as Mi,cg as Vi,ch as Di,ci as zi,cj as Fi,ck as Hi,cl as Ri,cm as qi,cn as Ii,co as Wi,cp as Ji,cq as Ui,cr as Bi,cs as Ki,ct as Zi,cu as Yi,cv as Gi,cw as Qi,cx as Xi,cy as es,cz as ts,cA as is,cB as ss,cC as as,cD as os,cE as rs,cF as ns,cG as ls,cH as ds,cI as cs,cJ as hs,cK as us,cL as ps,cM as ms,cN as vs,cO as _s,cP as fs,cQ as gs,cR as bs,cS as ys}from"./decluttering-card-plus.core-BfS1yOcF.js";import{l as $s,S as ws,t as xs}from"./decluttering-card-plus.placeholder-tool-CNxidQrc.js";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ks=Symbol.for(""),js=e=>{if(e?.r===ks)return e?._$litStatic$},Os=e=>({_$litStatic$:e,r:ks}),As=new Map,Ss=(e=>(t,...i)=>{const s=i.length;let a,o;const r=[],n=[];let l,d=0,c=!1;for(;d<s;){for(l=t[d];d<s&&void 0!==(o=i[d],a=js(o));)l+=a+t[++d],c=!0;d!==s&&n.push(o),r.push(l),d++}if(d===s&&r.push(t[s]),c){const e=r.join("$$lit$$");void 0===(t=As.get(e))&&(r.raw=r,As.set(e,t=r)),i=n}return e(t,...i)})(e),Cs=2,Ps=e=>(...t)=>({_$litDirective$:e,values:t});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Es=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{I:Ls}=t,Ts=e=>e,Ns=()=>document.createComment(""),Ms=(e,t,i)=>{const s=e._$AA.parentNode,a=void 0===t?e._$AB:t._$AA;if(void 0===i){const t=s.insertBefore(Ns(),a),o=s.insertBefore(Ns(),a);i=new Ls(t,o,e,e.options)}else{const t=i._$AB.nextSibling,o=i._$AM,r=o!==e;if(r){let t;i._$AQ?.(e),i._$AM=e,void 0!==i._$AP&&(t=e._$AU)!==o._$AU&&i._$AP(t)}if(t!==a||r){let e=i._$AA;for(;e!==t;){const t=Ts(e).nextSibling;Ts(s).insertBefore(e,a),e=t}}}return i},Vs=(e,t,i=e)=>(e._$AI(t,i),e),Ds={},zs=(e,t=Ds)=>e._$AH=t,Fs=e=>{e._$AR(),e._$AA.remove()},Hs=(e,t,i)=>{const s=new Map;for(let a=t;a<=i;a++)s.set(e[a],a);return s},Rs=Ps(class extends Es{constructor(e){if(super(e),e.type!==Cs)throw Error("repeat() can only be used in text expressions")}dt(e,t,i){let s;void 0===i?i=t:void 0!==t&&(s=t);const a=[],o=[];let r=0;for(const n of e)a[r]=s?s(n,r):r,o[r]=i(n,r),r++;return{values:o,keys:a}}render(e,t,i){return this.dt(e,t,i).values}update(e,[t,s,a]){const o=(e=>e._$AH)(e),{values:r,keys:n}=this.dt(t,s,a);if(!Array.isArray(o))return this.ut=n,r;const l=this.ut??=[],d=[];let c,h,u=0,p=o.length-1,m=0,v=r.length-1;for(;u<=p&&m<=v;)if(null===o[u])u++;else if(null===o[p])p--;else if(l[u]===n[m])d[m]=Vs(o[u],r[m]),u++,m++;else if(l[p]===n[v])d[v]=Vs(o[p],r[v]),p--,v--;else if(l[u]===n[v])d[v]=Vs(o[u],r[v]),Ms(e,d[v+1],o[u]),u++,v--;else if(l[p]===n[m])d[m]=Vs(o[p],r[m]),Ms(e,o[u],o[p]),p--,m++;else if(void 0===c&&(c=Hs(n,m,v),h=Hs(l,u,p)),c.has(l[u]))if(c.has(l[p])){const t=h.get(n[m]),i=void 0!==t?o[t]:null;if(null===i){const t=Ms(e,o[u]);Vs(t,r[m]),d[m]=t}else d[m]=Vs(i,r[m]),Ms(e,o[u],i),o[t]=null;m++}else Fs(o[p]),p--;else Fs(o[u]),u++;for(;m<=v;){const t=Ms(e,d[v+1]);Vs(t,r[m]),d[m++]=t}for(;u<=p;){const e=o[u++];null!==e&&Fs(e)}return this.ut=n,zs(e,d),i}}),qs={desktop:void 0,tablet:768,phone:388},Is={"primary-background-color":"#111111","card-background-color":"#1c1c1c","secondary-background-color":"#202020","clear-background-color":"#111111","primary-text-color":"#e1e1e1","secondary-text-color":"#9b9b9b","disabled-text-color":"#6f6f6f","app-header-text-color":"#e1e1e1","app-header-background-color":"#101e24","switch-unchecked-button-color":"#999999","switch-unchecked-track-color":"#9b9b9b","divider-color":"rgba(225, 225, 225, .12)","outline-color":"rgba(225, 225, 225, .12)","outline-hover-color":"rgba(225, 225, 225, .24)","mdc-ripple-color":"#AAAAAA","mdc-linear-progress-buffer-color":"rgba(255, 255, 255, 0.1)","input-idle-line-color":"rgba(255, 255, 255, 0.42)","input-hover-line-color":"rgba(255, 255, 255, 0.87)","input-disabled-line-color":"rgba(255, 255, 255, 0.06)","input-outlined-idle-border-color":"rgba(255, 255, 255, 0.38)","input-outlined-hover-border-color":"rgba(255, 255, 255, 0.87)","input-outlined-disabled-border-color":"rgba(255, 255, 255, 0.06)","input-fill-color":"rgba(255, 255, 255, 0.05)","input-disabled-fill-color":"rgba(255, 255, 255, 0.02)","input-ink-color":"rgba(255, 255, 255, 0.87)","input-label-ink-color":"rgba(255, 255, 255, 0.6)","input-disabled-ink-color":"rgba(255, 255, 255, 0.37)","input-dropdown-icon-color":"rgba(255, 255, 255, 0.54)","codemirror-keyword":"#C792EA","codemirror-operator":"#89DDFF","codemirror-variable":"#f07178","codemirror-variable-2":"#EEFFFF","codemirror-variable-3":"#DECB6B","codemirror-builtin":"#FFCB6B","codemirror-atom":"#F78C6C","codemirror-number":"#FF5370","codemirror-def":"#82AAFF","codemirror-string":"#C3E88D","codemirror-string-2":"#f07178","codemirror-comment":"#545454","codemirror-tag":"#FF5370","codemirror-meta":"#FFCB6B","codemirror-attribute":"#C792EA","codemirror-property":"#C792EA","codemirror-qualifier":"#DECB6B","codemirror-type":"#DECB6B","energy-grid-return-color":"#a280db","map-filter":"invert(.9) hue-rotate(170deg) brightness(1.5) contrast(1.2) saturate(.3)","disabled-color":"#464646"},Ws={"primary-background-color":"#fafafa","card-background-color":"#ffffff","ha-card-background":"#ffffff","secondary-background-color":"#e5e5e5","clear-background-color":"#ffffff","primary-text-color":"#212121","secondary-text-color":"#727272","disabled-text-color":"#bdbdbd","app-header-text-color":"#ffffff","app-header-background-color":"#03a9f4","switch-unchecked-button-color":"#fafafa","switch-unchecked-track-color":"#000000","divider-color":"rgba(0, 0, 0, .12)","outline-color":"rgba(0, 0, 0, .12)","outline-hover-color":"rgba(0, 0, 0, .24)","mdc-ripple-color":"#000000","input-idle-line-color":"rgba(0, 0, 0, 0.42)","input-hover-line-color":"rgba(0, 0, 0, 0.87)","input-fill-color":"rgba(0, 0, 0, 0.04)","input-ink-color":"rgba(0, 0, 0, 0.87)","input-label-ink-color":"rgba(0, 0, 0, 0.6)","input-dropdown-icon-color":"rgba(0, 0, 0, 0.54)","disabled-color":"#bdbdbd"};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Js extends r{constructor(){super(...arguments),this.kind="card",this.renderedOnly=!1,this._mode="rendered",this._theme="light",this._width="desktop",this._things=new Map,this._themed=new WeakMap}static get styles(){return n`
      :host {
        display: block;
      }
      .bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin: 0 0 10px;
      }
      .bar .spacer {
        flex: 1;
      }
      .seg {
        display: inline-flex;
        border: 1px solid var(--divider-color);
        border-radius: 20px;
        overflow: hidden;
        font-size: 0.85em;
      }
      .seg button {
        border: 0;
        background: transparent;
        color: var(--secondary-text-color);
        padding: 5px 12px;
        font: inherit;
        cursor: pointer;
      }
      .seg button[aria-pressed='true'] {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
      .stage {
        background: var(--primary-background-color);
        border-radius: 12px;
        padding: 12px;
        margin: 0 auto;
        position: relative;
      }
      .stage.narrow {
        border-inline-start: 1px dashed var(--secondary-text-color);
        border-inline-end: 1px dashed var(--secondary-text-color);
        border-radius: 0;
      }
      /*
       * Side by side, each half of the width: minmax(0, 1fr), as plain 1fr will not go below
       * a 768px stage's width and the pair runs out of the dialog. At Desktop each stage fills
       * its half; a narrow one is capped to its half, as a single stage is to the dialog.
       */
      .both {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 12px;
      }
      .both .stage:not(.narrow) {
        margin: 0;
      }
      .label {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        margin: 0 0 6px;
      }
      .caption {
        text-align: center;
        font-size: 0.8em;
        color: var(--secondary-text-color);
        margin: 6px 0 0;
      }
      pre {
        margin: 0;
        padding: 8px 12px;
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.85em;
        line-height: 1.5;
        overflow: auto;
        -webkit-user-select: text;
        user-select: text;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
      }
      /* One block per line: inline spans would run together on a single line (round 1, idea 19). */
      pre span {
        display: block;
        min-height: 1.5em;
        white-space: pre;
        /* Code reads left to right in a right-to-left dashboard too. */
        direction: ltr;
        text-align: left;
      }
      pre .hl {
        background: color-mix(in srgb, var(--warning-color, #ffa600) 20%, transparent);
      }
      .note {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        margin: 6px 0 0;
      }
    `}updated(e){var t;super.updated(e);const i=this.renderRoot.querySelector(".stage");i&&"undefined"!=typeof ResizeObserver&&(null!==(t=this._sizes)&&void 0!==t||(this._sizes=new ResizeObserver(e=>{var t,i;const s=Math.round(null!==(i=null===(t=e[0])||void 0===t?void 0:t.contentRect.width)&&void 0!==i?i:0);s&&s!==this._measured&&(this._measured=s)})),this._sizes.disconnect(),this._sizes.observe(i))}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._sizes)||void 0===e||e.disconnect()}willUpdate(e){var t;if(super.willUpdate(e),e.has("config")){const e=l(null!==(t=this.config)&&void 0!==t?t:{});if(void 0!==this._lastYaml&&this._lastYaml!==e){const t=this._lastYaml.split("\n"),i=e.split("\n").findIndex((e,i)=>t[i]!==e);this._changed=-1===i?void 0:i}this._lastYaml=e}}render(){if(!this.hass||!this.config)return e``;const t=(t,i,s,a)=>e`<span class="seg" role="group">
        ${t.map(t=>e`<button aria-pressed=${t===i} @click=${()=>s(t)}>${a(t)}</button>`)}
      </span>`;return e`
      <div class="bar">
        ${this.renderedOnly?d:t(["rendered","yaml"],this._mode,e=>this._mode=e,e=>c(`preview.mode_${e}`,void 0,this.hass))}
        <span class="spacer"></span>
        ${!this.renderedOnly&&"rendered"!==this._mode||"element"===this.kind?d:e`${t(["light","dark","both"],this._theme,e=>this._theme=e,e=>c(`preview.theme_${e}`,void 0,this.hass))}
              ${t(["desktop","tablet","phone"],this._width,e=>this._width=e,e=>c(`preview.width_${e}`,void 0,this.hass))}`}
      </div>
      ${"yaml"!==this._mode||this.renderedOnly?this._renderRendered():this._renderYaml()}
    `}_renderYaml(){var t,i;const s=(null!==(t=this._lastYaml)&&void 0!==t?t:l(this.config)).split("\n"),a=null!==(i=this.changedLine)&&void 0!==i?i:this._changed;return e`
      <pre>${s.map((t,i)=>e`<span class=${i===a?"hl":""}>${t}</span>`)}</pre>
      ${void 0!==a?e`<p class="note">${c("preview.changed_line",void 0,this.hass)}</p>`:d}
    `}_renderRendered(){const t=qs[this._width],i=t?`width: ${t}px; max-width: calc(100% - 26px);`:"",s=(s,a)=>e`
      <div class="stage ${t?"narrow":""}" style=${i}>
        ${a?e`<p class="label">${a}</p>`:d} ${this._thing(s)}
      </div>
    `,a=this._caption(t);return e`
      ${"both"===this._theme?e`<div class="both">
              ${s(!1,c("preview.theme_light",void 0,this.hass))}
              ${s(!0,c("preview.theme_dark",void 0,this.hass))}
            </div>`:s("dark"===this._theme)}
      ${a?e`<p class="caption">${a}</p>`:d}
    `}_caption(e){var t;if(!e)return"";const i=this._measured,s=i&&i<e-1?i:e,a=this.repeat;let o;if(!a||a.copies<2)o=c("preview.width_px",{width:s},this.hass);else{const e=h(s,a.max,a.minWidth);o=c((a.minWidth?"preview.width_columns_min":"preview.width_columns")+(1===e?"_one":""),{width:s,columns:e,min:null!==(t=a.minWidth)&&void 0!==t?t:""},this.hass)}return s===e?o:`${o} ${c("preview.width_narrower",{width:e},this.hass)}`}_thing(t){const i=`${t}:${JSON.stringify(this.config)}:${this.kind}`;for(const e of[...this._things.keys()])e!==i&&e.startsWith(`${t}:`)&&this._things.delete(e);let s=this._things.get(i);if(!s){const t=this._make();if(!t)return e`<p class="note">${c("preview.cannot_render",void 0,this.hass)}</p>`;const a=document.createElement("div");a.appendChild(t),s=a,this._things.set(i,s)}const a=s.firstElementChild;return a&&(a.hass=this.hass),this._applyTheme(s,t),s}_make(){const e=this.config;if("card"===this.kind){const t=customElements.get("hui-card");if(!t)return;const i=new t;return i.preview=!0,this.layout&&(i.layout=this.layout),i.config=e,i}if("badge"===this.kind){const t=customElements.get("hui-badge");if(!t)return;const i=new t;return i.preview=!0,i.config=e,i}const t=customElements.get("hui-card");if(!t)return;const i=new t;return i.preview=!0,i.config="row"===this.kind?{type:"entities",entities:[e]}:{type:"picture-elements",image:"https://demo.home-assistant.io/stub_config/floorplan.png",elements:[e]},i}_applyTheme(e,t){var i,s,a,o,r,n,l,d,c,h,p,m;const v=this.hass,_=null==v?void 0:v.themes,f=null!==(a=null!==(s=null===(i=null==v?void 0:v.selectedTheme)||void 0===i?void 0:i.theme)&&void 0!==s?s:null==_?void 0:_.default_theme)&&void 0!==a?a:"default";if(_&&"default"!==f)try{u(e,_,f,!1)}catch(b){}for(const u of null!==(o=this._themed.get(e))&&void 0!==o?o:[])e.style.removeProperty(`--${u}`);const g=t?Object.assign(Object.assign({},Is),null!==(d=null===(l=null===(n=null===(r=null==_?void 0:_.themes)||void 0===r?void 0:r[f])||void 0===n?void 0:n.modes)||void 0===l?void 0:l.dark)&&void 0!==d?d:{}):Object.assign(Object.assign({},Ws),null!==(m=null===(p=null===(h=null===(c=null==_?void 0:_.themes)||void 0===c?void 0:c[f])||void 0===h?void 0:h.modes)||void 0===p?void 0:p.light)&&void 0!==m?m:{});for(const[u,y]of Object.entries(g))e.style.setProperty(`--${u}`,String(y));this._themed.set(e,Object.keys(g)),e.style.background="var(--primary-background-color)",e.style.color="var(--primary-text-color)",e.style.colorScheme=t?"dark":"light"}}s([a({attribute:!1})],Js.prototype,"hass",void 0),s([a({attribute:!1})],Js.prototype,"config",void 0),s([a({attribute:!1})],Js.prototype,"kind",void 0),s([a({attribute:!1})],Js.prototype,"repeat",void 0),s([a({attribute:!1})],Js.prototype,"changedLine",void 0),s([a({attribute:!1})],Js.prototype,"renderedOnly",void 0),s([a({attribute:!1})],Js.prototype,"layout",void 0),s([o()],Js.prototype,"_mode",void 0),s([o()],Js.prototype,"_theme",void 0),s([o()],Js.prototype,"_width",void 0),s([o()],Js.prototype,"_changed",void 0),s([o()],Js.prototype,"_measured",void 0);const Us="decluttering-preview-frame";function Bs(e,t,...i){return[...i,null==e?void 0:e.config,null==e?void 0:e.user,null==e?void 0:e.locale,null==e?void 0:e.language,null==e?void 0:e.localize,...m(e),t.join("\n"),...t.map(t=>{var i;return null===(i=null==e?void 0:e.states)||void 0===i?void 0:i[t]})]}customElements.get(Us)||customElements.define(Us,Js);class Ks{constructor(){this.kept=new Map,this.builds=0}get(e,t,i){const s=this.kept.get(e);if(s&&p(s.key,t))return s.value;const a=i();return this.builds+=1,this.kept.set(e,{key:t,value:a}),a}holds(e,t){const i=this.kept.get(e);return!!i&&p(i.key,t)}last(e){var t;return null===(t=this.kept.get(e))||void 0===t?void 0:t.value}clear(){this.kept.clear()}}function Zs(e){return v(null==e?void 0:e.options_from)}function Ys(e,t,i,s=!1){const a=b(t,{},e,void 0,i,!0,void 0,0,void 0,void 0,s);if(null==a)return;const o="string"==typeof a?a:JSON.stringify(a);return""===o.trim()?void 0:o}function Gs(e,t){var i;const s=function(e,t){var i;if(!t||!Zs(e))return[];const s=_(t,e.options_from),a=null!==(i=e.option_value)&&void 0!==i?i:"[[value]]",o=[],r=new Set;return s.forEach((i,n)=>{var l,d,c,h,u,p,m;const v=null!==(u=null!==(h=null!==(c=null!==(d=null!==(l=i.entity)&&void 0!==l?l:i.device_id)&&void 0!==d?d:i.label_id)&&void 0!==c?c:i.floor_id)&&void 0!==h?h:i.area_id)&&void 0!==u?u:i.path,_=f(Object.assign({value:v},i),void 0,n,s.length),b=Ys(a,_,t,!0);if(void 0===b||r.has(b))return;r.add(b);const y=null!==(m=Ys(null!==(p=e.option_label)&&void 0!==p?p:a,_,t))&&void 0!==m?m:g(b);o.push({value:b,label:y})}),o}(e,t),a=null===(i=e.selector)||void 0===i?void 0:i.select,o=a&&"object"==typeof a?a:{mode:"dropdown"};return{select:Object.assign(Object.assign({},o),{options:s})}}function Qs(e){return null==e?"default":"all"===e||"read"===e?e:"custom"}function Xs(e){return Array.isArray(e)?e.map(String).join(", "):String(e)}const ea=["grid_options","style",y,"strict","rebuild_on","rebuild_on_watch","debug","name","inherit_variables"];function ta(e){return"number"==typeof e&&Number.isFinite(e)?String(e):"string"==typeof e&&e.trim()?e.trim():void 0}function ia(e){if("number"==typeof e)return e;if("string"!=typeof e||!e.trim())return;const t=e.trim(),i=Number(t);return Number.isFinite(i)&&/^\d+$/.test(t)?i:t}function sa(e){return e===A?"hide":e&&"object"==typeof e&&!Array.isArray(e)?"card":"show"}function aa(e){return Array.isArray(e)?e:null==e?[]:[e]}function oa(e){return aa(e.rebuild_on).filter(e=>j(e)||O(e))}function ra(e,t){const i=Object.assign({},e),s=aa(e.rebuild_on).filter(e=>e!==t);return s.length?i.rebuild_on=s:delete i.rebuild_on,i}function na(e){var t,i;const s=$(e.strict),a={on_error_mode:sa(e[y]),strict_errors:null!==(t=s.errors)&&void 0!==t?t:"ignore",strict_warnings:null!==(i=s.warnings)&&void 0!==i?i:"ignore",rebuild_on_watch:Qs(e.rebuild_on_watch),debug:(o=e.debug,!0===o?"json":"yaml"===o||"console"===o||"report"===o?o:"off")};var o;const r=e.grid_options,n=ta(null==r?void 0:r.columns),l=ta(null==r?void 0:r.rows);void 0!==n&&(a.grid_columns=n),void 0!==l&&(a.grid_rows=l),"string"==typeof e.style&&e.style&&(a.style=e.style);const d=w(aa(e.rebuild_on).filter(e=>"string"==typeof e));return d.length&&(a.rebuild_on=d),"string"==typeof e.name&&e.name&&(a.name=e.name),!0===e.inherit_variables&&(a.inherit_variables=!0),a}function la(e,t){var i,s,a;const o=Object.assign({},e),r=Object.assign({},null!==(i=e.grid_options)&&void 0!==i?i:{}),n=ia(t.grid_columns),l=ia(t.grid_rows);void 0===n?delete r.columns:r.columns=n,void 0===l?delete r.rows:r.rows=l,Object.keys(r).length?o.grid_options=r:delete o.grid_options;const d="string"==typeof t.style?t.style:"";switch(d.trim()?o.style=d:delete o.style,t.on_error_mode){case"hide":o[y]=A;break;case"card":"card"!==sa(e[y])&&delete o[y];break;default:delete o[y]}const c=null!==(s=t.strict_errors)&&void 0!==s?s:"ignore",h=null!==(a=t.strict_warnings)&&void 0!==a?a:"ignore",u=e.strict&&"object"==typeof e.strict?$(e.strict):{},p=Object.assign(Object.assign({},"ignore"!==c||u.errors?{errors:c}:{}),"ignore"!==h||u.warnings?{warnings:h}:{});c!==S.errors||h!==S.warnings||u.warnings?Object.keys(p).length?o.strict=p:delete o.strict:o.strict=!0;const m=oa(e),v=[...w(t.rebuild_on),...m];switch(v.length?o.rebuild_on=v:delete o.rebuild_on,t.rebuild_on_watch){case"all":case"read":o.rebuild_on_watch=t.rebuild_on_watch;break;case"custom":"custom"!==Qs(e.rebuild_on_watch)&&delete o.rebuild_on_watch;break;default:delete o.rebuild_on_watch}switch(t.debug){case"json":o.debug=!0;break;case"yaml":case"console":case"report":o.debug=t.debug;break;default:delete o.debug}const _="string"==typeof t.name?t.name.trim():"";return _?o.name=_:delete o.name,!0===t.inherit_variables?o.inherit_variables=!0:delete o.inherit_variables,o}function da(e){const t=e[y];return t&&"object"==typeof t&&!Array.isArray(t)?t:void 0}function ca(e,t){const i=Object.assign({},e);return t&&"object"==typeof t?i[y]=t:delete i[y],i}const ha=["1","2","3","4","5","6","7","8","9","10","11","12","full"],ua=["1","2","3","4","5","6","7","8","auto"];const pa=["for_each","for_each_from","columns","min_column_width","gap","lazy","lazy_eager","empty"],ma=["repeat","extras","fit","advanced",...ea],va={grid_options:["grid_columns","grid_rows"],on_error:["on_error_mode"],strict:["strict_errors","strict_warnings"]};function _a(e){const t=null==e?void 0:e.editor_hide;return(Array.isArray(t)?t:void 0===t?[]:[t]).filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>e.trim().toLowerCase())}const fa=(e,t)=>void 0!==(null==e?void 0:e[t]);function ga(e,t,i){const s=new Set(_a(e)),a=ea.some(e=>fa(t,e));return{repeat:s.has("repeat")&&!pa.some(e=>fa(t,e)),extras:s.has("extras")&&!(null==i?void 0:i.length),fit:s.has("fit")&&!fa(t,"fit"),advanced:s.has("advanced")&&!a,advancedFields:[].concat(...ea.filter(e=>s.has(e)&&!fa(t,e)).map(e=>{var t;return null!==(t=va[e])&&void 0!==t?t:[e]}))}}function ba(e,t,i,s,a){if(void 0===e)return;const o=JSON.stringify(e);if("string"!=typeof o||!E.test(o))return e;let r,n=!1;try{r=b(L(t),i,{value:e},void 0,s,!0,()=>{n=!0},0,void 0,void 0,!1,a)}catch(c){return}if(n)return;const l=null==r?void 0:r.value,d=JSON.stringify(l);return"string"==typeof d&&E.test(d)?void 0:l}function ya(e,t){return e===t||"object"==typeof e&&null!==e&&"object"==typeof t&&null!==t&&JSON.stringify(e)===JSON.stringify(t)}const $a=(e,t)=>t in T(e),wa=(e,t)=>e===t||e.startsWith(`${t}.`);function xa(e,t){const i=e=>{if(!e||"object"!=typeof e||Array.isArray(e))return e;const i={};for(const[s,a]of Object.entries(e))wa(s,t)||(i[s]=a);return Object.keys(i).length?i:void 0};if(Array.isArray(e)){const t=e.map(i).filter(e=>void 0!==e);return t.length?t:void 0}return i(e)}function ka(e,t){const i=Object.assign({},e),s=xa(e.variables,t);return void 0===s?delete i.variables:i.variables=s,i}function ja(e,t,i,s={}){if(!i)return;const a=P(xa(t,e),i).find(t=>t.variable===e);if(!a)return;let o;switch(a.from){case"section_let":o="section";break;case"view_let":o="view";break;case"dashboard_let":o="dashboard";break;case"view":o=$a(s.section,e)?"section":"view";break;case"dashboard":o=!$a(s.dashboard,e)&&$a(s.library,e)?"library":"dashboard";break;default:o="template"}return{value:a.value,source:o}}function Oa(e){return null==e?"":"string"==typeof e?e:Array.isArray(e)?`[${e.map(Oa).join(", ")}]`:"object"==typeof e?`{${Object.entries(e).map(([e,t])=>`${e}: ${Oa(t)}`).join(", ")}}`:String(e)}const Aa="decluttering-card-plus-card-slot";class Sa extends r{constructor(){super(...arguments),this.label="",this.emptyHint="",this._picking=!1,this._editing=!1}static get styles(){return n`
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
    `}render(){const t=function(e){var t,i,s,a;if(!e||"object"!=typeof e||Array.isArray(e))return;const o=e,r="string"==typeof o.type?o.type:"",n=r.startsWith("custom:")?r.slice(7):r?r[0].toUpperCase()+r.slice(1):"",l=e=>"string"==typeof e&&e.trim()?e.split("\n")[0].trim():void 0,d=Array.isArray(o.cards)?o.cards.length:void 0;return{type:n,text:null!==(a=null!==(s=null!==(i=null!==(t=l(o.content))&&void 0!==t?t:l(o.title))&&void 0!==i?i:l(o.name))&&void 0!==s?s:l(o.entity))&&void 0!==a?a:void 0!==d?c("editor.slot.cards",{count:d}):""}}(this.value);return e`
      ${this.label?e`<p class="label">${this.label}</p>`:e``}
      <div class="slot ${t?"filled":""}">
        ${t?e`
                <div class="row">
                  <div class="text summary">
                    <b>${t.type}</b>
                    ${t.text?e`<small>${t.text}</small>`:e``}
                  </div>
                  <ha-button @click=${()=>this._toggleEdit()}>
                    ${c(this._editing?"editor.slot.done":"editor.slot.edit",void 0,this.hass)}
                  </ha-button>
                  <ha-button @click=${()=>this._set(void 0)}>
                    ${c("editor.slot.remove",void 0,this.hass)}
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
                    ${c(this._picking?"editor.slot.cancel":"editor.slot.choose",void 0,this.hass)}
                  </ha-button>
                </div>
                ${this._picking?e`<hui-card-picker
                        .hass=${this.hass}
                        .lovelace=${this.lovelace}
                        @config-changed=${this._picked}
                      ></hui-card-picker>`:e``}
              `}
      </div>
    `}_togglePick(){this._picking=!this._picking}_toggleEdit(){this._editing=!this._editing}_picked(e){var t;e.stopPropagation(),this._picking=!1,this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_edited(e){var t;e.stopPropagation(),this._set(null===(t=e.detail)||void 0===t?void 0:t.config)}_set(e){this._editing=this._editing&&!!e,M(this,"value-changed",{value:e&&"object"==typeof e?e:void 0})}}function Ca(e,t){const i=Math.max(0,t-e);return i<1?"<1 ms":`${Math.round(i)} ms`}s([a({attribute:!1})],Sa.prototype,"hass",void 0),s([a({attribute:!1})],Sa.prototype,"lovelace",void 0),s([a({attribute:!1})],Sa.prototype,"value",void 0),s([a()],Sa.prototype,"label",void 0),s([a()],Sa.prototype,"emptyHint",void 0),s([o()],Sa.prototype,"_picking",void 0),s([o()],Sa.prototype,"_editing",void 0),"undefined"==typeof customElements||customElements.get(Aa)||customElements.define(Aa,Sa);const Pa="decluttering-card-plus-return";function Ea(e){try{return"undefined"==typeof sessionStorage?void 0:sessionStorage}catch(t){return}}const La=["card","badge","row","element","group"];function Ta(e){return!0===(null==e?void 0:e.base)}function Na(e,t){const i=t.toLowerCase().split(/\s+/).filter(Boolean);return i.length?e.filter(e=>i.every(t=>e.search.includes(t))):e}function Ma(e,t,i){const s=e=>e?""+(e.borrowed?"b:"+e.borrowed:e.category?"c:"+e.category:""):"";if(""!==s(e)&&s(e)!==s(t))return e.borrowed?c("editor.picker.borrowed_from",{dashboard:e.borrowed},i):e.category}function Va(e,t){return 0===e?c("editor.picker.unused",void 0,t):1===e?c("editor.picker.used_one",void 0,t):c("editor.picker.used_many",{count:e},t)}const Da="default";function za(e){const t=null==e?void 0:e[F];return t&&"object"==typeof t&&!Array.isArray(t)?t:void 0}function Fa(e,t,i){var s,a;const o={};for(const n of t){const e=null===(s=n.domain)||void 0===s?void 0:s.trim(),t=null===(a=n.template)||void 0===a?void 0:a.trim();e&&t&&e!==Da&&(o[e]=t)}(null==i?void 0:i.trim())&&(o[Da]=i.trim());const r=Object.assign({},e);return Object.keys(o).length?r[F]=o:delete r[F],r}function Ha(e,t){const i=new Set(t.map(e=>e.domain));return e.filter(e=>!i.has(e))}const Ra=["entities","areas","devices","floors","labels","views"];function qa(e){if(!e||"object"!=typeof e||Array.isArray(e))return;const t=e;if(void 0!==t.template||void 0!==t.range||void 0!==t.with)return;if(void 0!==t.exclude&&"object"==typeof t.exclude&&!Array.isArray(t.exclude))return;const i=Ra.filter(e=>void 0!==t[e]);return i.length>1?void 0:1===i.length?i[0]:v(e)?"entities":void 0}function Ia(e){var t;return void 0!==e.for_each_from?null!==(t=qa(e.for_each_from))&&void 0!==t?t:"other":void 0!==e.for_each?"list":"none"}function Wa(e){if(null==e||!0===e)return;return(Array.isArray(e)?e:[e]).filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>e.trim())}function Ja(e){const t="number"==typeof e?e:"string"==typeof e&&e.trim()?Number(e):NaN;return Number.isFinite(t)?t:void 0}const Ua=["domain","area","floor","label","device_class","integration","exclude"];function Ba(e){if(e&&e.length)return 1===e.length?e[0]:e}function Ka(e,t){var i,s;const a=Object.assign({},null!=e?e:{});a[null!==(i=qa(e))&&void 0!==i?i:"entities"]=!t.patterns||!t.patterns.length||Ba(t.patterns.map(e=>e.trim()).filter(Boolean));for(const l of Ua){const e=Ba(null===(s=t[l])||void 0===s?void 0:s.filter(e=>e.trim()));void 0===e?delete a[l]:a[l]=e}const o=[t.sort,t.then].filter(e=>"string"==typeof e&&""!==e.trim());o.length?a.sort=1===o.length?o[0]:o:delete a.sort,!0===t.reverse?a.reverse=!0:delete a.reverse;const r=Ja(t.limit);void 0===r?delete a.limit:a.limit=r;const n=Ja(t.offset);return void 0===n||0===n?delete a.offset:a.offset=n,"string"==typeof t.group_by&&t.group_by?a.group_by=t.group_by:delete a.group_by,!0===t.entity_category?Array.isArray(a.entity_category)||"string"==typeof a.entity_category||(a.entity_category="all"):delete a.entity_category,a}function Za(e){return e.split(".")[0]}function Ya(e){var t;return[...new Set(Object.keys(null!==(t=null==e?void 0:e.states)&&void 0!==t?t:{}).map(Za))].sort()}function Ga(e){var t,i;const s=new Set;for(const a of Object.values(null!==(t=null==e?void 0:e.states)&&void 0!==t?t:{})){const e=null===(i=null==a?void 0:a.attributes)||void 0===i?void 0:i.device_class;"string"==typeof e&&e&&s.add(e)}return[...s].sort()}function Qa(e){var t;const i=new Set;for(const s of Object.values(null!==(t=null==e?void 0:e.entities)&&void 0!==t?t:{}))"string"==typeof(null==s?void 0:s.platform)&&s.platform&&i.add(s.platform);return[...i].sort()}const Xa=["name","-name","entity","area","floor","domain","entity_count","none"],eo=["","area","floor","domain","label"];function to(e,t){return{select:{mode:"dropdown",multiple:!0,custom_value:!0,options:[...e,...(null!=t?t:[]).filter(t=>!e.includes(t))].map(e=>({value:e,label:e}))}}}function io(e,t){const i=["none","list",...Ra];return"other"===t&&i.push("other"),i.map(t=>({value:t,label:c(`editor.repeat.mode_${t}`,void 0,e)}))}function so(e,t,i){const s=new Map(function(e,t){return e.map((e,i)=>({id:e.value,primary:e.label,secondary:[e.description,Va(e.count,t)].filter(Boolean).join(" · "),search:e.search,sorting_label:String(i).padStart(6,"0")}))}(e,i).map(e=>[e.id,e])),a=[];let o;for(const r of Na(e,t)){const e=Ma(r,o,i);e&&a.push(e),a.push(s.get(r.value)),o=r}return a}const ao={card:{type:"entity",entity:"sun.sun"},badge:{type:"entity",entity:"sun.sun"},row:{entity:"sun.sun"},element:{type:"icon",icon:"mdi:weather-sunny",style:{color:"yellow"}}},oo=50,ro=e=>e.actions.length>0||e.urls.length>0||e.embeds||e.scripts||e.placeholders||e.overlay;const no=500,lo="M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z";async function co(e,t,i,s){var a;if(!H())return e._toolError=c("tools.cannot_save_here",void 0,e.hass),!1;e._busy=!0,e._toolError=void 0;try{return await R(e,e.hass,i,[{urlPath:q(),build:t}],s),e._undoChanged=void 0,ho(e,c("undo.toast",{operation:I(i,e.hass)},e.hass)),!0}catch(o){return e._toolError=c("tools.save_failed",{message:null!==(a=null==o?void 0:o.message)&&void 0!==a?a:o},e.hass),!1}finally{e._busy=!1}}function ho(e,t){e.dispatchEvent(new CustomEvent("decluttering-announce",{detail:{text:t},bubbles:!0,composed:!0}))}function uo(e,t,i){const s=U(t)[i];if(!s)return e;const a=B(e.variables),o=new Set(s.map(e=>K(e))),r=a.filter(e=>!o.has(K(e)));return Object.assign(Object.assign({},e),{variables:[...r,...s]})}const po="variable:";function mo(e,t,i){var s;const a=e&&"object"==typeof e?e:{},o=null!==(s=["areas","devices","floors","labels","views","entities"].find(e=>void 0!==a[e]))&&void 0!==s?s:v(e)?"entities":"items";return c(`editor.matches_${o}_${1===t?"one":"many"}`,void 0,i)}const vo=/^[a-z0-9_]+\.[a-z0-9_]+$/i;let _o,fo;function go(e,t){const i=e.indexOf(t);return-1===i?[e,""]:[e.slice(0,i),e.slice(i+t.length)]}const bo=new Set(["true","yes","on","1"]),yo=/:host|\.decluttering-container/;class $o extends r{constructor(){super(...arguments),this._shownAs=new Map,this._loadingTemplates=!1,this._ejectPending=!1,this._sectionsPending=!1,this._previewMode="yaml",this._holdStops=[],this._builds=new Ks,this._resultDue=!1,this._copied=!1,this._markedLines=[],this._cannotOpen=!1,this._matchesOpen=!1,this._openItems=new Set,this._pickerFilter="",this._pickerItems=[],this._openGroups=new Set,this._renderedTemplates={},this._renderingTemplates=new Set,this._optionsFrom=new Map}static get styles(){return n`
      /* Code stays left to right inside a right-to-left sentence. */
      code {
        direction: ltr;
        unicode-bidi: isolate;
      }
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          transition: none !important;
          animation: none !important;
        }
      }
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
        padding-inline-start: 18px;
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
        margin-inline-start: 8px;
      }
      .advanced-body {
        padding: 8px 8px 0;
      }
      /* What rebuild_on holds that the entity picker cannot draw (#411). */
      .rebuild-extra {
        margin: 12px 0 24px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      /* The words line up with the field's helper above them, the boxes with the field. */
      .rebuild-label {
        margin: 0 0 4px;
        padding-inline-start: 16px;
      }
      .rebuild-list {
        list-style: none;
        margin: 0 0 8px;
        padding: 0;
      }
      .rebuild-list li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0 8px;
        min-height: 40px;
        padding-inline-start: 12px;
        border-radius: 8px;
        border: 1px solid var(--divider-color);
        margin-bottom: 4px;
      }
      .rebuild-list code {
        color: var(--primary-text-color);
        font-family: var(--ha-font-family-code, monospace);
        overflow-wrap: anywhere;
      }
      .rebuild-filled {
        flex: 1;
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .rebuild-remove {
        --mdc-icon-button-size: 40px;
        margin-inline-start: auto;
      }
      .rebuild-template {
        margin: 0;
        padding-inline-start: 16px;
        overflow-wrap: anywhere;
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
        /* Code reads left to right in a right-to-left dashboard too. */
        direction: ltr;
        text-align: left;
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
        margin-inline-start: 6px;
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
      .presets .actions {
        margin-top: 8px;
        display: flex;
        gap: 8px;
      }
      /* The declared variables, one form each so a field can carry its Reset (#255). */
      .declared > *:not(:last-child),
      .declared-group-body > *:not(:last-child) {
        margin-bottom: 24px;
      }
      .declared-field {
        display: flex;
        align-items: flex-start;
        gap: 4px;
      }
      .declared-field ha-form {
        flex: 1;
        min-width: 0;
      }
      /* The Reset's place, kept on every declared field so widths never move (#255). */
      .declared-field .reset-slot {
        flex: none;
        width: 48px;
        margin-top: 4px;
      }
      .declared-field .reset {
        color: var(--secondary-text-color);
      }
      ha-expansion-panel.declared-group {
        display: block;
        margin-top: 0;
        --expansion-panel-content-padding: 0;
        border-radius: 6px;
        --ha-card-border-radius: 6px;
      }
      .declared-group-body {
        padding: 12px;
      }
    `}set lovelace(e){this._lovelace=e,this._templates=void 0,this._schema=void 0}_editingPlace(){const e=Z(this),t=e?Y(e):void 0;return null!=t?t:{view:G(this._lovelace)}}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0;for(const t of this._holdStops)t();this._holdStops=[],clearTimeout(this._resultTimer),this._resultTimer=void 0}async connectedCallback(){var e;super.connectedCallback(),this._holdStops.length||(this._holdStops=[Q(e=>{"render"===e&&(this._builtAnyway=this._config),this.requestUpdate()}),X()]),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=ee(()=>{this._builds.clear(),this.requestUpdate()})),await te()}_selectorFor(e){if(!Zs(e))return ie(e);const t=JSON.stringify([e.options_from,e.option_value,e.option_label,e.selector]),i=this._optionsFrom.get(t);if(i)return i;const s=Gs(e,this.hass);return this.hass&&this._optionsFrom.set(t,s),s}setConfig(e){this._openedWith||(this._openedWith=e,this._resume=function(e,t,i=Date.now()){var s;const a=Ea();if(!a)return;let o;try{const e=a.getItem(Pa);o=e?JSON.parse(e):void 0}catch(r){o=void 0}if(o)if(i-o.at>18e5)a.removeItem(Pa);else if(JSON.stringify(null!==(s=o.openedWith)&&void 0!==s?s:null)===JSON.stringify(null!=e?e:null))return a.removeItem(Pa),o}(e)),this._config=e}willUpdate(){var e;if(!this.hass||!this._config)return;if(this._lovelace||(this._lovelace=null!==(e=se())&&void 0!==e?e:void 0),!this._lovelace)return;const t=ae(this.hass);if(this._templates&&this._templatesLanguage!==t&&(this._templates=void 0,this._schema=void 0),!this._templates){const e=this._editingPlace();this._templatesLanguage=t,this._templates=oe(re(this._lovelace,e.view,void 0,e.section),this.hass),this._loadBorrowedTemplates()}this._schema||(this._schema=[{name:"template",label:c("editor.template_label",void 0,this.hass),selector:{select:{mode:"dropdown",custom_value:!0,options:ne(this._templates,this.hass)}}},{name:"variables",label:c("editor.variables_label",void 0,this.hass),helper:c("editor.variables_helper",void 0,this.hass),selector:{object:{}}}])}render(){if(!(this.hass&&this._config&&this._templates&&this._schema))return e``;const t=this._templates[this._config.template],i=le(t),s=this._hiddenNames(t,i),a=i.filter(e=>!s.has(e.name)),o=de(this._config.variables),r=ce(this._config),n=!!t&&"card"===he(t)||!!r||void 0!==this._config.for_each||void 0!==this._config.for_each_from,l=this._formData(i),d=ga(t,this._config,l.extras),h={};t||this._loadingTemplates||r&&!this._config.template||(h.template=c("editor.no_such_template",void 0,this.hass)),o||(h.variables=c("error.variables_shape",void 0,this.hass));const u=D(t);return e`
      ${(null==t?void 0:t.description)?e`<p class="description">${t.description}</p>`:e``}
      ${r?this._renderByDomain(r):e``}
      ${void 0===u?e``:e`<ha-alert alert-type="warning">
              ${u?c("editor.template_deprecated_because",{message:u},this.hass):c("editor.template_deprecated",void 0,this.hass)}
            </ha-alert>`}
      ${this._renderResume()} ${this._renderTemplatePicker(h.template)} ${this._renderResult(t)}
      ${this._renderSource(t)} ${this._renderPresets(t)} ${this._renderDiagnostics(t,o)}
      ${this._renderVariablesForm(l,a,d,t,h)} ${this._renderCardVariables(a)}
      ${this._renderRepeat(n&&!d.repeat,t)}
      ${this._renderLayout(l,n&&!d.repeat,d)} ${this._renderEmptySlot(n)}
      ${this._renderAdvanced(d)} ${this._renderSectionPerCopy()}
      <decluttering-card-plus-health .hass=${this.hass} .lovelace=${this._lovelace}></decluttering-card-plus-health>
    `}_renderAdvanced(t){var i;if(!this._config||t.advanced)return e``;const s=null===(i=this._templates)||void 0===i?void 0:i[this._config.template],a=function(e,t){const i=na(e);let s=0;void 0===i.grid_columns&&void 0===i.grid_rows||(s+=1),void 0!==i.style&&(s+=1),"show"!==i.on_error_mode&&(s+=1),"ignore"===i.strict_errors&&"ignore"===i.strict_warnings||(s+=1);const a=aa(null==t?void 0:t.rebuild_on);return(i.rebuild_on||oa(e).length||a.length)&&(s+=1),"default"!==i.rebuild_on_watch&&(s+=1),"off"!==i.debug&&(s+=1),void 0!==i.name&&(s+=1),i.inherit_variables&&(s+=1),s}(this._config,s),o=na(this._config),r=this._onErrorMode&&"card"!==o.on_error_mode?Object.assign(Object.assign({},o),{on_error_mode:this._onErrorMode}):o;"card"===o.on_error_mode&&this._onErrorMode&&(this._onErrorMode=void 0);const n=da(this._config),l=Os(Aa);return e`
      <ha-expansion-panel outlined class="advanced">
        <span slot="header">
          ${c("editor.advanced.header",void 0,this.hass)}
          <span class="count">
            ${0===a?"":1===a?c("editor.advanced.count_one",void 0,this.hass):c("editor.advanced.count_many",{count:a},this.hass)}
          </span>
        </span>
        <div class="advanced-body">
          ${this._renderAdvancedForm(r,function(e,t){return t.length?e.filter(e=>!t.includes(null==e?void 0:e.name)):e}(function(e,t,i){const s=t=>c(t,void 0,e),a=null==i?void 0:i.rebuild_on_watch,o=[{value:"default",label:null==a?s("editor.advanced.rebuild_on_watch_default"):c("editor.advanced.rebuild_on_watch_template",{value:Xs(a)},e)},{value:"read",label:s("editor.advanced.rebuild_on_watch_read")},{value:"all",label:s("editor.advanced.rebuild_on_watch_all")},..."custom"===Qs(null==t?void 0:t.rebuild_on_watch)?[{value:"custom",label:c("editor.advanced.rebuild_on_watch_custom",{value:Xs(null==t?void 0:t.rebuild_on_watch)},e)}]:[]],r=(e,t)=>e.map(e=>({value:e,label:/^\d+$/.test(e)?e:s(`${t}${e}`)}));return[{name:"grid_columns",label:s("editor.advanced.grid_columns_label"),helper:s("editor.advanced.grid_helper"),selector:{select:{mode:"dropdown",custom_value:!0,options:r(ha,"editor.advanced.grid_")}}},{name:"grid_rows",label:s("editor.advanced.grid_rows_label"),selector:{select:{mode:"dropdown",custom_value:!0,options:r(ua,"editor.advanced.grid_")}}},{name:"style",label:s("editor.advanced.style_label"),helper:s("editor.advanced.style_helper"),selector:{text:{multiline:!0}}},{name:"on_error_mode",label:s("editor.advanced.on_error_label"),helper:s("editor.advanced.on_error_helper"),selector:{select:{mode:"dropdown",options:[{value:"show",label:s("editor.advanced.on_error_show")},{value:"hide",label:s("editor.advanced.on_error_hide")},{value:"card",label:s("editor.advanced.on_error_card")}]}}},{name:"strict_errors",label:s("editor.advanced.strict_errors_label"),helper:s("editor.advanced.strict_errors_helper"),selector:{select:{mode:"dropdown",options:x.map(e=>({value:e,label:s(`editor.advanced.strict_errors_${e}`)}))}}},{name:"strict_warnings",label:s("editor.advanced.strict_warnings_label"),helper:s("editor.advanced.strict_warnings_helper"),selector:{select:{mode:"dropdown",options:k.map(e=>({value:e,label:s(`editor.advanced.strict_warnings_${e}`)}))}}},{name:"rebuild_on",label:s("editor.advanced.rebuild_on_label"),helper:s("editor.advanced.rebuild_on_helper"),selector:{entity:{multiple:!0}}},{name:"rebuild_on_watch",label:s("editor.advanced.rebuild_on_watch_label"),helper:s("editor.advanced.rebuild_on_watch_helper"),selector:{select:{mode:"dropdown",options:o}}},{name:"debug",label:s("editor.advanced.debug_label"),helper:s("editor.advanced.debug_helper"),selector:{select:{mode:"dropdown",options:[{value:"off",label:s("editor.advanced.debug_off")},{value:"json",label:s("editor.advanced.debug_json")},{value:"yaml",label:s("editor.advanced.debug_yaml")},{value:"console",label:s("editor.advanced.debug_console")},{value:"report",label:s("editor.advanced.debug_report")}]}}},{name:"name",label:s("editor.advanced.name_label"),helper:s("editor.advanced.name_helper"),selector:{text:{}}},{name:"inherit_variables",label:s("editor.advanced.inherit_label"),helper:s("editor.advanced.inherit_helper"),selector:{boolean:{}}}]}(this.hass,this._config,s),t.advancedFields),s)}
          ${"card"===r.on_error_mode?Ss`<${l}
                  .hass=${this.hass}
                  .lovelace=${this._lovelace}
                  .value=${n}
                  .label=${c("editor.advanced.fallback_label",void 0,this.hass)}
                  .emptyHint=${c("editor.advanced.fallback_hint",void 0,this.hass)}
                  @value-changed=${this._fallbackChanged}
                ></${l}>`:e``}
        </div>
      </ha-expansion-panel>
    `}_renderAdvancedForm(t,i,s){const a=i=>e`<ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${i}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._advancedChanged}
      ></ha-form>`,o=i.findIndex(e=>"rebuild_on"===(null==e?void 0:e.name)),r=o<0||!this._config?[]:this._rebuildOnEach(s),n=new Set(this._config?oa(this._config):[]),l=r.filter(e=>"card"===e.from&&n.has(e.entry)),d=r.filter(e=>"template"===e.from);if(!l.length&&!d.length)return a(i);const h=e=>{const t=pt(e.entry);return"string"==typeof t?t:JSON.stringify(e.entry)},u=e=>{const t=O(e.entry)?e.entry.watch:void 0;return void 0===t?"":c("editor.advanced.rebuild_on_watches",{parts:Xs(t)},this.hass)},p=e=>{const t=pt(e.entry);if(!j(t))return"";if(e.entities.length)return c("editor.advanced.rebuild_on_now",{value:e.entities.join(", ")},this.hass);const i=O(e.entry)?JSON.stringify(e.entry):e.entry;return!e.rejects.length||1===e.rejects.length&&e.rejects[0]===i?c("editor.advanced.rebuild_on_nothing",void 0,this.hass):c("editor.advanced.rebuild_on_not_entity",{value:e.rejects.join(", ")},this.hass)},m=e=>[p(e),u(e)].filter(Boolean).join(", ");return e`${a(i.slice(0,o+1))}
      <div class="rebuild-extra">
        ${l.length?e`<div class="rebuild-label">
                  ${c(l.some(e=>O(e.entry))?"editor.advanced.rebuild_on_written":"editor.advanced.rebuild_on_placeholders",void 0,this.hass)}
                </div>
                <ul class="rebuild-list">
                  ${l.map(t=>e`<li>
                        <code>${h(t)}</code>
                        <span class="rebuild-filled">${m(t)}</span>
                        <ha-icon-button
                          class="rebuild-remove"
                          .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                          .label=${c("editor.advanced.rebuild_on_remove",{entry:h(t)},this.hass)}
                          title=${c("editor.advanced.rebuild_on_remove",{entry:h(t)},this.hass)}
                          data-entry=${h(t)}
                          @click=${()=>this._removeRebuildEntry(t.entry)}
                        ></ha-icon-button>
                      </li>`)}
                </ul>`:e``}
        ${d.length?e`<p class="rebuild-template">
                ${c("editor.advanced.rebuild_on_template",{entries:d.map(e=>m(e)?`${h(e)} (${m(e)})`:h(e)).join(", ")},this.hass)}
              </p>`:e``}
      </div>
      ${o+1<i.length?a(i.slice(o+1)):e``}`}_removeRebuildEntry(e){this._config&&M(this,"config-changed",{config:ra(this._config,e)})}_advancedChanged(e){if(e.stopPropagation(),!this._config)return;const t=e.detail.value;this._onErrorMode="card"!==t.on_error_mode||da(this._config)?void 0:"card",M(this,"config-changed",{config:la(this._config,t)})}_fallbackChanged(e){e.stopPropagation(),this._config&&(e.detail.value&&(this._onErrorMode=void 0),M(this,"config-changed",{config:ca(this._config,e.detail.value)}))}_renderEmptySlot(t){if(!this._config||!t)return e``;if(!(void 0!==this._config.for_each||void 0!==this._config.for_each_from||void 0!==this._config.empty))return e``;const i=Os(Aa),s=this._config.empty;return Ss`<${i}
      .hass=${this.hass}
      .lovelace=${this._lovelace}
      .value=${s&&"object"==typeof s?s:void 0}
      .label=${c("editor.empty_label",void 0,this.hass)}
      .emptyHint=${c("editor.empty_slot_hint",void 0,this.hass)}
      @value-changed=${this._emptyChanged}
    ></${i}>`}_emptyChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);ue(t,"empty",e.detail.value),M(this,"config-changed",{config:t})}_renderPresets(t){var i,s;const a=function(e){return J(e).map((e,t)=>({value:String(t),label:e}))}(t);if(!a.length||!this._config)return e``;const o=function(e,t){const i=T(t),s=U(e);for(let a=0;a<s.length;a+=1){const e=T(s[a]),t=Object.keys(e);if(t.length&&t.every(t=>JSON.stringify(i[t])===JSON.stringify(e[t])))return a}}(t,this._config.variables),r=this._presetPending;return e`
      <div class="presets">
        <ha-form
          .hass=${this.hass}
          .data=${{preset:void 0===o?"":String(o)}}
          .schema=${[{name:"preset",label:c("editor.preset.label",void 0,this.hass),helper:void 0===o&&B(this._config.variables).length?c("editor.preset.none",void 0,this.hass):c("editor.preset.helper",void 0,this.hass),selector:{select:{mode:"dropdown",options:a}}}]}
          .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
          .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
          @value-changed=${e=>this._presetPicked(e,t)}
        ></ha-form>
        ${r?e`<ha-alert alert-type="warning">
                ${c("editor.preset.confirm",{preset:null!==(s=null===(i=a[r.index])||void 0===i?void 0:i.label)&&void 0!==s?s:"",names:r.names.join(", ")},this.hass)}
                <div class="actions">
                  <ha-button @click=${()=>this._applyPreset(t,r.index)}>
                    ${c("editor.preset.apply_anyway",void 0,this.hass)}
                  </ha-button>
                  <ha-button
                    @click=${()=>{this._presetPending=void 0}}
                  >
                    ${c("editor.preset.keep",void 0,this.hass)}
                  </ha-button>
                </div>
              </ha-alert>`:e``}
      </div>
    `}_presetPicked(e,t){var i;e.stopPropagation();const s=null===(i=e.detail.value)||void 0===i?void 0:i.preset;if(void 0===s||""===s||!this._config)return;const a=Number(s);if(!Number.isInteger(a))return;const o=function(e,t,i){const s=U(e)[t];if(!s)return[];const a=T(i),o=T(s);return Object.keys(o).filter(e=>e in a&&JSON.stringify(a[e])!==JSON.stringify(o[e]))}(t,a,this._config.variables);o.length?this._presetPending={index:a,names:o}:this._applyPreset(t,a)}_applyPreset(e,t){this._config&&(this._presetPending=void 0,M(this,"config-changed",{config:uo(this._config,e,t)}))}_renderByDomain(t){var i,s;if(!this._config)return e``;if(!function(e){const t=za(e);return!t||Object.values(t).every(e=>"string"==typeof e)}(this._config))return e`<ha-alert alert-type="info">
        ${c("editor.by_domain_hint",{templates:Object.entries(t).map(([e,t])=>`${e}: ${t}`).join(", ")},this.hass)}
      </ha-alert>`;const{rows:a,fallback:o}=function(e){var t;const i=null!==(t=za(e))&&void 0!==t?t:{};return{rows:Object.entries(i).filter(([e,t])=>e!==Da&&"string"==typeof t).map(([e,t])=>({domain:e,template:t})),fallback:"string"==typeof i[Da]?i[Da]:void 0}}(this._config),r=null!==(i=this._byDomainDraft)&&void 0!==i?i:a,n=function(e,t){return Object.keys(e).filter(t=>{return!(!(i=e[t])||void 0===i.card&&void 0===i.group||Ta(e[t]));var i}).sort().map(i=>({value:i,label:void 0!==D(e[i])?i+c("editor.deprecated_suffix",void 0,t):i}))}(null!==(s=this._templates)&&void 0!==s?s:{},this.hass),l=Ya(this.hass),d=(e,t)=>{const i=e.every(e=>{var t,i;return(null===(t=e.domain)||void 0===t?void 0:t.trim())&&(null===(i=e.template)||void 0===i?void 0:i.trim())});this._byDomainDraft=i?void 0:e,M(this,"config-changed",{config:Fa(this._config,e,t)})};return e`
      <div class="by-domain">
        <h3>${c("editor.by_domain.header",void 0,this.hass)}</h3>
        <p class="hint">${c("editor.by_domain.hint",void 0,this.hass)}</p>
        ${r.map((t,i)=>{return e`
            <div class="bd-row">
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",custom_value:!0,options:(s=t.domain,[...new Set([s,...l])].filter(Boolean).map(e=>({value:e,label:e})))}}}
                .value=${t.domain}
                .label=${c("editor.by_domain.domain",void 0,this.hass)}
                @value-changed=${e=>{e.stopPropagation(),d(r.map((t,s)=>{var a;return s===i?Object.assign(Object.assign({},t),{domain:String(null!==(a=e.detail.value)&&void 0!==a?a:"")}):t}),null!=o?o:"")}}
              ></ha-selector>
              <ha-selector
                .hass=${this.hass}
                .selector=${{select:{mode:"dropdown",options:n}}}
                .value=${t.template}
                .label=${c("editor.by_domain.template",void 0,this.hass)}
                @value-changed=${e=>{e.stopPropagation(),d(r.map((t,s)=>{var a;return s===i?Object.assign(Object.assign({},t),{template:String(null!==(a=e.detail.value)&&void 0!==a?a:"")}):t}),null!=o?o:"")}}
              ></ha-selector>
              <ha-icon-button
                .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                .label=${c("editor.by_domain.remove",{domain:t.domain},this.hass)}
                @click=${()=>d(r.filter((e,t)=>t!==i),null!=o?o:"")}
              ></ha-icon-button>
            </div>
          `;var s})}
        <div class="bd-row">
          <span class="bd-default">${c("editor.by_domain.anything_else",void 0,this.hass)}</span>
          <ha-selector
            .hass=${this.hass}
            .selector=${{select:{mode:"dropdown",options:n}}}
            .value=${null!=o?o:""}
            .label=${c("editor.by_domain.template",void 0,this.hass)}
            @value-changed=${e=>{var t;e.stopPropagation(),d(r,String(null!==(t=e.detail.value)&&void 0!==t?t:""))}}
          ></ha-selector>
          <span class="bd-spacer"></span>
        </div>
        <ha-button
          @click=${()=>{var e;return d([...r,{domain:null!==(e=Ha(l,r)[0])&&void 0!==e?e:"",template:""}],null!=o?o:"")}}
        >
          ${c("editor.by_domain.add",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderCardVariables(t){var i;const s=t.filter(e=>pe(e));if(!s.length)return e``;const a=T(null===(i=this._config)||void 0===i?void 0:i.variables);return e`${s.map(t=>{var i;const s=a[t.name],o=!!s&&"object"==typeof s;return e`
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
                    ${c("editor.card_variable_clear",void 0,this.hass)}
                  </ha-button>
                `:e`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    @config-changed=${e=>this._cardVariableChanged(t.name,e)}
                  ></hui-card-picker>
                `}
        </div>
      `})}`}_registryItemsForPreview(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.for_each_from;if(!this.hass||!v(t))return;const i=me(t);if(void 0===i||Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))try{const e=_(this.hass,t,Object.assign(Object.assign({},ve(this._lovelace)),{rendered:this._renderedTemplates}));return e.length?e:void 0}catch(s){return}}_cardVariableChanged(e,t){var i,s;null==t||t.stopPropagation();const a=null===(i=null==t?void 0:t.detail)||void 0===i?void 0:i.config,o=B(null===(s=this._config)||void 0===s?void 0:s.variables).filter(t=>K(t)!==e);a&&"object"==typeof a&&o.push({[e]:a});const r=Object.assign({},this._config);o.length?r.variables=o:delete r.variables,M(this,"config-changed",{config:r})}_pausedText(){const e=mt();return void 0!==e?c("card.preview_paused_slow",{ms:e},this.hass):c("card.preview_paused",void 0,this.hass)}_buildResult(e,t,i,s){var a;const o=_e(t),r=[],n=performance.now();try{const l=fe(this.hass,this._rebuildOnFor(t)),d=null!==(a=this._lovelace)&&void 0!==a?a:se(),c=ge(b(e,t,o,i,l,!0,e=>r.push(...e),0,void 0,void 0,!1,{itemTemplates:be(d),context:ve(d)}),this._config,s),h=performance.now();return ye(h-n),{resolved:c,unresolved:r,time:Ca(n,h)}}catch(l){return{error:String(l)}}}_renderResult(t){var i,s,a,o;if(!this._config)return e``;const r=null!==(i=$e(this._config.for_each))&&void 0!==i?i:this._registryItemsForPreview(),n=we(this._config).variables;let d=(null==r?void 0:r.length)?f(r[0],n,0,r.length):n,h=t,u=this._config.template;if(ce(this._config))try{const e=null!==(s=this._templates)&&void 0!==s?s:{};let t;({template:h,name:u,entity:t}=xe(this._config,d,t=>e[t],this.hass,Object.keys(e))),d=ke(d,t)}catch(N){return e``}if(!h)return e``;const p=he(h);if(!p)return e``;const m=vt(),_=this._builtAnyway===this._config,g=m&&!_,b=v(this._config.for_each_from)||!!ce(this._config),y=this._readsKey(h,u,b?JSON.stringify(d):""),$=!(g||_||this._resultDue||this._builds.holds("result",y)||!this._builds.last("result"));$&&(clearTimeout(this._resultTimer),this._resultTimer=setTimeout(()=>{this._resultTimer=void 0,this._resultDue=!0,this.requestUpdate()},250)),this._resultDue=!1;const w=g?void 0:$?this._builds.last("result"):this._builds.get("result",y,()=>this._buildResult(d,h,u,p));if(w&&"error"in w)return e`<ha-alert alert-type="warning">
        ${c("editor.result_error",{error:w.error},this.hass)}
      </ha-alert>`;const x=null==w?void 0:w.resolved,k=null!==(a=null==w?void 0:w.unresolved)&&void 0!==a?a:[],j=(null==r?void 0:r.length)?c("editor.result_copies",{total:r.length},this.hass):"",[O,A]=go(c("editor.result_hint",{kind:p},this.hass),"[[name]]"),S=g?null!==(o=this._lastYaml)&&void 0!==o?o:"":l(x);g||S===this._lastYaml||(this._markedLines=function(e,t){const i=""===t?[]:t.replace(/\n$/,"").split("\n");if(void 0===e)return i.map(e=>({text:e,changed:!1}));const s=new Set(e.replace(/\n$/,"").split("\n"));return i.map(e=>({text:e,changed:!s.has(e)}))}(this._lastYaml,S),this._lastYaml=S);const C=void 0!==this._editingPlace().section?"grid":void 0,P=function(e){return"card"===e?["rendered","yaml"]:["yaml"]}(p),E=P.includes(this._previewMode)?this._previewMode:"yaml",L=!g&&!(null==r?void 0:r.length)&&!v(this._config.for_each_from)&&x&&"object"==typeof x&&!je(this),T=(null==r?void 0:r.length)||g?[]:Oe(le(h),k);return e`
      <div class="preview">
        <div class="preview-head">
          <span class="preview-title">${c("editor.preview.header",void 0,this.hass)}${j}</span>
          ${P.length>1?e`<div class="segmented" role="group">
                  ${P.map(t=>e`<button
                        type="button"
                        class=${t===E?"on":""}
                        aria-pressed=${t===E?"true":"false"}
                        @click=${()=>{this._previewMode=t}}
                      >
                        ${c(`editor.preview.${t}`,void 0,this.hass)}
                      </button>`)}
                </div>`:e``}
        </div>
        ${"rendered"===E?e`<div class="rendered">
                ${_||!m&&!T.length?e`<decluttering-preview-frame
                        .hass=${this.hass}
                        .config=${x}
                        .kind=${p}
                        .layout=${C}
                        .renderedOnly=${!0}
                        .repeat=${(null==r?void 0:r.length)?{copies:r.length,max:Number(this._config.columns)||1,minWidth:Number(this._config.min_column_width)||void 0}:void 0}
                      ></decluttering-preview-frame>`:e`<ha-alert alert-type=${m&&void 0!==mt()?"error":"info"}>
                        ${m?this._pausedText():c(1===T.length?"card.preview_required_one":"card.preview_required_many",{which:T.map(e=>`[[${e}]]`).join(", ")},this.hass)}
                      </ha-alert>`}
              </div>`:g?e`<ha-alert alert-type=${void 0!==mt()?"error":"info"}
                  >${this._pausedText()}</ha-alert
                >`:e`<pre class="yaml">
${this._markedLines.map(t=>e`<span class="l ${t.changed?"changed":""}">${t.text}</span>`)}</pre>`}
        ${w?e`<p class="hint">
                ${c("editor.preview.built_in",{time:w.time,template:null!=u?u:""},this.hass)}
                ${"yaml"===E?c("editor.preview.changed_hint",void 0,this.hass):""}
              </p>`:e``}
        <p class="hint">${O}<code>[[name]]</code>${A}</p>
        <div class="preview-actions">
          <ha-button
            title=${c("editor.preview.pause_helper",void 0,this.hass)}
            @click=${()=>Ae(!m)}
          >
            ${c(m?"editor.preview.resume":"editor.preview.pause",void 0,this.hass)}
          </ha-button>
          ${m||T.length?e`<ha-button @click=${()=>Se()}>
                  ${c("card.preview_render_now",void 0,this.hass)}
                </ha-button>`:e``}
          ${"yaml"!==E||g?e``:e`<ha-button @click=${()=>this._copyYaml(S)}>
                  ${c(this._copied?"editor.preview.copied":"editor.preview.copy",void 0,this.hass)}
                </ha-button>`}
          ${L?e`
                  <ha-button @click=${()=>this._eject(x)}>
                    ${c(this._ejectPending?"editor.eject_confirm":"editor.eject",void 0,this.hass)}
                  </ha-button>
                `:e``}
        </div>
      </div>
    `}_copyYaml(e){Ce(e).then(e=>{this._copied=e,e&&setTimeout(()=>this._copied=!1,1500)})}_renderResume(){const t=this._resume;return t?e`<ha-alert alert-type="info">
      ${c("editor.link.resume",{template:t.template},this.hass)}
      <div class="actions">
        <ha-button
          @click=${()=>{this._resume=void 0,M(this,"config-changed",{config:t.config})}}
        >
          ${c("editor.link.resume_button",void 0,this.hass)}
        </ha-button>
        <ha-button
          @click=${()=>{this._resume=void 0}}
        >
          ${c("editor.link.discard_button",void 0,this.hass)}
        </ha-button>
      </div>
    </ha-alert>`:e``}_openTemplate(e){var t,i,s,a;const o=H(),r=function(e,t){var i,s;const a=null==e?void 0:e.views;if(!Array.isArray(a))return;const o=e=>!!e&&V(e.type)&&e.template===t;for(let r=0;r<a.length;r+=1){const e=null!==(i=a[r])&&void 0!==i?i:{},t=Array.isArray(e.cards)?e.cards:[];for(let i=0;i<t.length;i+=1)if(o(t[i]))return[r,i];const n=Array.isArray(e.sections)?e.sections:[];for(let i=0;i<n.length;i+=1){const e=Array.isArray(null===(s=n[i])||void 0===s?void 0:s.cards)?n[i].cards:[];for(let t=0;t<e.length;t+=1)if(o(e[t]))return[r,i,t]}}}(null!==(t=null==o?void 0:o.config)&&void 0!==t?t:this._lovelace,e);if(!o||!r)return void(this._cannotOpen=!0);this._config&&function(e,i,s=Date.now()){const a=Ea();if(a)try{a.setItem(Pa,JSON.stringify(Object.assign(Object.assign({},e),{at:s})))}catch(t){}}({config:this._config,openedWith:this._openedWith,template:e});const n=function(e,t){var i,s,a,o,r;const n=null===(i=null==e?void 0:e.views)||void 0===i?void 0:i[t[0]];if(!n)return;const l=3===t.length?null===(o=null===(a=null===(s=n.sections)||void 0===s?void 0:s[t[1]])||void 0===a?void 0:a.cards)||void 0===o?void 0:o[t[2]]:null===(r=n.cards)||void 0===r?void 0:r[t[1]];return l&&"object"==typeof l?l:void 0}(o.config,r),l=null!==(i=document.querySelector("home-assistant"))&&void 0!==i?i:document.body,d=()=>{M(l,"show-dialog",{dialogTag:"hui-dialog-edit-card",dialogImport:()=>Promise.resolve(),dialogParams:{lovelaceConfig:o.config,cardConfig:n,saveCardConfig:e=>o.saveConfig(n?Ne(o.config,n,e):o.config),saveConfig:e=>o.saveConfig(e),path:r}})},c=Z(this);if(!c)return void d();this._config&&(null===(s=c._discardDirtyStateChanges)||void 0===s||s.call(c),"_dirty"in c&&(c._dirty=!1));let h=!1;const u=()=>{h||(h=!0,setTimeout(d,0))};c.addEventListener("dialog-closed",u,{once:!0});!1!==(null===(a=c.closeDialog)||void 0===a?void 0:a.call(c))&&setTimeout(u,400)}_renderTemplatePicker(t){var i,s,a;if(!this._config||!this._templates)return e``;this._pickerFor===this._templates&&this._pickerCurrent===this._config.template||(this._pickerFor=this._templates,this._pickerCurrent=this._config.template,this._pickerItems=function(e,t,i,s=()=>{},a){const o=[];for(const[n,l]of Object.entries(e)){if(!La.some(e=>e in l))continue;if(Ta(l)&&n!==a)continue;const e=D(l),r="string"==typeof e&&e?e:"string"==typeof l.description?l.description:void 0,d="string"==typeof l.category&&l.category?l.category:void 0,h=s(n);o.push({value:n,label:void 0!==e?n+c("editor.deprecated_suffix",void 0,i):n,description:r,category:d,count:z(t,n),deprecated:void 0!==e,borrowed:h,search:[n,null!=r?r:"",null!=d?d:"",null!=h?h:""].join(" ").toLowerCase()})}const r=e=>{var t,i;return[e.borrowed?2:e.category?1:0,null!==(i=null!==(t=e.borrowed)&&void 0!==t?t:e.category)&&void 0!==i?i:"",e.deprecated?1:0,e.value.toLowerCase()]};return o.sort((e,t)=>{const i=r(e),s=r(t);for(let a=0;a<i.length;a+=1){if(i[a]<s[a])return-1;if(i[a]>s[a])return 1}return 0})}(this._templates,this._lovelace,this.hass,Pe,this._config.template));const o=Na(this._pickerItems,this._pickerFilter),r=c("editor.template_label",void 0,this.hass),n=c("editor.picker.search",void 0,this.hass),l=Array.isArray(t)?t.join(" "):null!=t?t:"";if(Ee("ha-generic-picker")){const s=this._pickerItems,a=t=>{var i;return e`
        <div class="pick-row" style="padding: 6px 16px">
          <div class="pick-name">
            <span>${t.primary}</span>
            <small
              class=${(null===(i=t.secondary)||void 0===i?void 0:i.startsWith(c("editor.picker.unused",void 0,this.hass)))?"unused":""}
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
          .helper=${n}
          .searchLabel=${n}
          .value=${null!==(i=this._config.template)&&void 0!==i?i:""}
          .getItems=${()=>so(s,"",this.hass)}
          .searchKeys=${[{name:"primary",weight:10},{name:"secondary",weight:5},{name:"search",weight:3}]}
          .searchFn=${e=>so(s,e,this.hass)}
          .rowRenderer=${a}
          .invalid=${!!t}
          .errorMessage=${l}
          allow-custom-value
          no-sort
          @value-changed=${this._templatePicked}
        ></ha-generic-picker>
      `}return Ee("ha-combo-box")?e`
      <ha-combo-box
        class="picker"
        .hass=${this.hass}
        .label=${c("editor.template_label",void 0,this.hass)}
        .helper=${c("editor.picker.search",void 0,this.hass)}
        .items=${this._pickerItems}
        .filteredItems=${o}
        .value=${null!==(a=this._config.template)&&void 0!==a?a:""}
        .renderer=${(t,i)=>{const s=Ma(t,o[i.index-1],this.hass);return e`
        <div class="pick-row">
          ${s?e`<div class="pick-heading">${s}</div>`:e``}
          <div class="pick-name">
            <span>${t.label}</span>
            <small class=${0===t.count?"unused":""}>${Va(t.count,this.hass)}</small>
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
        ${t?e`<ha-alert alert-type="error">${l}</ha-alert>`:e``}
      `}_templatePicked(e){var t;e.stopPropagation();const i=null===(t=e.detail)||void 0===t?void 0:t.value;"string"==typeof i&&i&&this._config&&i!==this._config.template&&(this._pickerFilter="",M(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{template:i})}))}_renderSectionPerCopy(){var t;const i=null===(t=H())||void 0===t?void 0:t.config;return this._config&&i&&Le(i,this._config)?e`
      <div class="section-per-copy">
        <p class="hint">${c("editor.section_per_copy_hint",void 0,this.hass)}</p>
        ${this._sectionsError?e`<ha-alert alert-type="error">${this._sectionsError}</ha-alert>`:e``}
        <ha-button @click=${this._sectionPerCopy}>
          ${c(this._sectionsPending?"editor.section_per_copy_confirm":"editor.section_per_copy",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}async _sectionPerCopy(){var e,t;if(!this._sectionsPending)return void(this._sectionsPending=!0);this._sectionsPending=!1;const i=H(),s=this._config;if(!i||!s)return;try{await R(this,this.hass,"section_per_copy",[{urlPath:q(),build:e=>Te(e,s)}])}catch(o){return void(this._sectionsError=c("tools.save_failed",{message:null!==(e=null==o?void 0:o.message)&&void 0!==e?e:o},this.hass))}let a=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;for(;a&&"hui-dialog-edit-card"!==a.localName;)a=a.parentNode instanceof ShadowRoot?a.parentNode.host:a.parentNode;null===(t=null==a?void 0:a.closeDialog)||void 0===t||t.call(a)}_eject(e){this._ejectPending?(this._ejectPending=!1,this._holdEjectUndo(e),M(this,"config-changed",{config:e})):this._ejectPending=!0}_holdEjectUndo(e){const t=H();if(!t||!this._openedWith)return;const i=Ne(t.config,this._openedWith,e);i!==t.config&&Me({operation:"eject",at:Date.now(),dashboards:[{urlPath:q(),before:t.config,after:i}]})}_renderSource(t){var i;const s=null===(i=this._config)||void 0===i?void 0:i.template;if(!s||!t||this._loadingTemplates)return e``;const a=Ve(this._lovelace,s);if(!a){const t=Pe(s);return e`<p class="hint">
        ${c("editor.source_borrowed",void 0,this.hass)}
        ${t?e`<a href=${o=t,`/${o.replace(/^\/+/,"")}`} target="_blank" rel="noreferrer"
                >${c("editor.link.open_dashboard",void 0,this.hass)}</a
              >`:e``}
      </p>`}var o;if(a.declared||!a.view)return e`<p class="hint">
        ${c("editor.source_declared",void 0,this.hass)}
        ${c("editor.link.raw_editor",void 0,this.hass)}
      </p>`;const{view:r}=a,n=document.location.pathname.split("/").slice(0,2).join("/"),[l,d]=go(c("editor.source_view",{view:""},this.hass),"");return e`<p class="hint">
      ${l}<a href=${`${n}/${r.path||r.index}`} target="_blank" rel="noreferrer"
        >${r.title||r.path||c("editor.untitled_view",void 0,this.hass)}</a
      >${d}
      <a
        href="#"
        class="edit-template"
        @click=${e=>{e.preventDefault(),this._openTemplate(s)}}
        >${c("editor.link.edit_template",void 0,this.hass)}</a
      >
      ${this._cannotOpen?e`<br />${c("editor.link.cannot_open",void 0,this.hass)}`:e``}
    </p>`}_filledSource(e){var t,i;return De(null===(t=this._config)||void 0===t?void 0:t.for_each_from,null===(i=this._config)||void 0===i?void 0:i.variables,e,this.hass)}_renderedTemplateNames(e){const t=this._filledSource(e),i=me(t);if(!this.hass||void 0===i)return[];if(!Object.prototype.hasOwnProperty.call(this._renderedTemplates,i))return[];const s=new Set,a=_(this.hass,t,{rendered:this._renderedTemplates});for(const o of a)for(const e of Object.keys(o))s.add(e);return[...s]}_renderEditorTemplate(e){this.hass&&!this._renderingTemplates.has(e)&&(this._renderingTemplates.add(e),ze(this.hass,e).then(t=>{this._renderingTemplates.delete(e),this._renderedTemplates=Object.assign(Object.assign({},this._renderedTemplates),{[e]:t})}))}_renderMatches(t){var i,s;if(!this.hass||!v(null===(i=this._config)||void 0===i?void 0:i.for_each_from))return e``;const a=this._filledSource(t);Fe(a)&&!He()&&Re(this.hass).then(()=>this.requestUpdate());const o=me(a);if(void 0!==o){const t=Object.prototype.hasOwnProperty.call(this._renderedTemplates,o)?this._renderedTemplates[o]:void 0;if(!t)return this._renderEditorTemplate(o),e`<p class="hint">${c("editor.matches_template_pending",void 0,this.hass)}</p>`;const i=qe(t);if(!("list"in i)){const t="error"===i.problem?"editor.matches_template_failed":"editor.matches_template_not_list";return e`<ha-alert alert-type="warning"> ${c(t,{detail:i.detail},this.hass)} </ha-alert>`}}let r=[];try{r=_(this.hass,a,Object.assign(Object.assign({},ve(this._lovelace)),{rendered:this._renderedTemplates}))}catch(h){return e``}const n=Ie(this.hass,a),l=n?We(n,this.hass):void 0;if(!r.length){const t=(null===(s=this._config)||void 0===s?void 0:s.empty)?c("editor.matches_none_but_empty",void 0,this.hass):"";return e`<ha-alert alert-type="warning">
        ${c(l?"editor.matches_none_left_out":"editor.matches_none",Object.assign({but:t},l),this.hass)}
      </ha-alert>`}const d=r.slice(0,12);return e`
      <div class="matches-line">
        <ha-svg-icon .path=${"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}></ha-svg-icon>
        <span>
          ${1===r.length?c("editor.matches_header_one",{what:mo(a,1,this.hass)},this.hass):c("editor.matches_header_many",{count:r.length,what:mo(a,r.length,this.hass)},this.hass)}
        </span>
        <ha-button
          @click=${()=>{this._matchesOpen=!this._matchesOpen}}
        >
          ${c(this._matchesOpen?"editor.repeat.matches_hide":"editor.repeat.matches_show",void 0,this.hass)}
        </ha-button>
      </div>
      ${l?e`<p class="hint">${c("editor.matches_left_out",l,this.hass)}</p>`:e``}
      ${this._matchesOpen?e`<div class="matches">
              <ul>
                ${d.map((t,i)=>e`<li>${Je(t,i)}</li>`)}
              </ul>
              ${r.length>d.length?e`<p class="hint">
                      ${c("editor.matches_more",{count:r.length-d.length},this.hass)}
                    </p>`:e``}
              <p class="hint">
                ${c(void 0===o?"editor.matches_hint":"editor.matches_template_hint",void 0,this.hass)}
              </p>
            </div>`:e``}
    `}_suppliedNames(e){var t,i,s;return[...Be(null===(t=this._config)||void 0===t?void 0:t.for_each),...Ke(null===(i=this._config)||void 0===i?void 0:i.for_each_from),...v(null===(s=this._config)||void 0===s?void 0:s.for_each_from)?Ue:[],...e?this._renderedTemplateNames(e):[]]}_renderRepeat(t,i){if(!this._config||!t)return e``;const s=Ia(this._config),a=[{name:"mode",label:c("editor.repeat.mode_label",void 0,this.hass),helper:c("editor.repeat.mode_helper",void 0,this.hass),selector:{select:{mode:"dropdown",options:io(this.hass,s)}}}];return e`
      <div class="repeat">
        <h3>${c("editor.repeat.header",void 0,this.hass)}</h3>
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
    `}_renderLayout(t,i,s){const a=[...i?(null!=_o||(_o=[{name:"gap",label:c("editor.gap_label"),helper:c("editor.gap_helper"),selector:{number:{min:0,max:64,mode:"box"}}},{name:"columns",label:c("editor.columns_label"),helper:c("editor.columns_helper"),selector:{number:{min:1,max:6,mode:"box"}}},{name:"min_column_width",label:c("editor.min_column_width_label"),helper:c("editor.min_column_width_helper"),selector:{number:{min:50,max:1e3,step:10,mode:"box"}}},{name:"lazy",label:c("editor.lazy_label"),helper:c("editor.lazy_helper"),selector:{boolean:{}}},{name:"lazy_eager",label:c("editor.lazy_eager_label"),helper:c("editor.lazy_eager_helper"),selector:{number:{min:0,max:100,mode:"box"}}}]),_o):[],...s.fit?[]:(null!=fo||(fo=[{name:"fit",label:c("editor.fit_label"),helper:c("editor.fit_helper"),selector:{select:{mode:"dropdown",options:[{value:"box",label:c("editor.fit_box")},{value:"contents",label:c("editor.fit_contents")}]}}}]),fo)];return a.length?e`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${a}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:e``}_repeatModeChanged(e){var t;if(e.stopPropagation(),!this._config)return;const i=null===(t=e.detail.value)||void 0===t?void 0:t.mode;if(!i)return;const s=function(e,t){if(Ia(e)===t||"other"===t)return e;const i=Object.assign({},e);if(delete i.for_each,delete i.for_each_from,"list"===t)i.for_each=[];else if("none"!==t){const s=qa(e.for_each_from)?Object.assign({},e.for_each_from):{};for(const e of Ra)delete s[e];i.for_each_from=Object.assign({[t]:!0},s)}return i}(this._config,i);s!==this._config&&M(this,"config-changed",{config:s})}_renderRepeatBuilder(t){var i;const s=null===(i=this._config)||void 0===i?void 0:i.for_each_from,a=qa(s);if(!a)return e``;const o=function(e){var t,i,s;const a=null!=e?e:{},o={patterns:null!==(i=Wa(a[null!==(t=qa(e))&&void 0!==t?t:"entities"]))&&void 0!==i?i:[],reverse:!0===a.reverse,entity_category:!1};for(const c of Ua){const e=Wa(a[c]);e&&e.length&&(o[c]=e)}const r=null!==(s=Wa(a.sort))&&void 0!==s?s:[];r[0]&&(o.sort=r[0]),r[1]&&(o.then=r[1]);const n=Ja(a.limit);void 0!==n&&(o.limit=n);const l=Ja(a.offset);void 0!==l&&(o.offset=l),"string"==typeof a.group_by&&a.group_by&&(o.group_by=a.group_by);const d=a.entity_category;return o.entity_category=!0===d||"all"===d||"string"==typeof d&&!!d||Array.isArray(d)&&d.length>0,o}(s);return e`
      <ha-form
        .hass=${this.hass}
        .data=${o}
        .schema=${function(e,t,i){const s=t=>c(t,void 0,e),a=e=>({select:{mode:"dropdown",custom_value:!0,options:[...Xa,...e&&!Xa.includes(e)?[e]:[]].map(e=>({value:e,label:Xa.includes(e)?s(`editor.repeat.sort_${e.replace("-","desc_")}`):e}))}}),o="entities"===t,r="areas"===t,n="devices"===t;return[{name:"patterns",label:s(`editor.repeat.patterns_${t}`),helper:s("editor.repeat.patterns_helper"),selector:to([],null==i?void 0:i.patterns)},o&&{name:"domain",label:s("editor.repeat.domain_label"),selector:to(Ya(e),null==i?void 0:i.domain)},(o||n)&&{name:"area",label:s("editor.repeat.area_label"),selector:{area:{multiple:!0}}},(o||r||n)&&{name:"floor",label:s("editor.repeat.floor_label"),selector:{floor:{multiple:!0}}},(o||r||n)&&{name:"label",label:s("editor.repeat.label_label"),selector:{label:{multiple:!0}}},o&&{name:"device_class",label:s("editor.repeat.device_class_label"),selector:to(Ga(e),null==i?void 0:i.device_class)},o&&{name:"integration",label:s("editor.repeat.integration_label"),selector:to(Qa(e),null==i?void 0:i.integration)},{name:"exclude",label:s("editor.repeat.exclude_label"),helper:s("editor.repeat.exclude_helper"),selector:o?{entity:{multiple:!0}}:to([],null==i?void 0:i.exclude)},{name:"sort",label:s("editor.repeat.sort_label"),selector:a(null==i?void 0:i.sort)},{name:"then",label:s("editor.repeat.then_label"),selector:a(null==i?void 0:i.then)},{name:"reverse",label:s("editor.repeat.reverse_label"),selector:{boolean:{}}},{name:"limit",label:s("editor.repeat.limit_label"),selector:{number:{min:0,max:500,mode:"box"}}},{name:"offset",label:s("editor.repeat.offset_label"),helper:s("editor.repeat.offset_helper"),selector:{number:{min:0,max:500,mode:"box"}}},o&&{name:"group_by",label:s("editor.repeat.group_by_label"),helper:s("editor.repeat.group_by_helper"),selector:{select:{mode:"dropdown",options:eo.map(e=>({value:e,label:s(`editor.repeat.group_${e||"none"}`)}))}}},o&&{name:"entity_category",label:s("editor.repeat.entity_category_label"),helper:s("editor.repeat.entity_category_helper"),selector:{boolean:{}}}].filter(e=>!1!==e)}(this.hass,a,o)}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._repeatBuilderChanged}
      ></ha-form>
      ${this._renderMatches(t)}
    `}_repeatBuilderChanged(e){if(e.stopPropagation(),!this._config||void 0===qa(this._config.for_each_from))return;const t=Object.assign(Object.assign({},this._config),{for_each_from:Ka(this._config.for_each_from,e.detail.value)});M(this,"config-changed",{config:t})}_renderOtherSource(t){var i;return e`
      <p class="hint">${c("editor.repeat.other_hint",void 0,this.hass)}</p>
      <ha-yaml-editor
        .hass=${this.hass}
        .defaultValue=${null===(i=this._config)||void 0===i?void 0:i.for_each_from}
        @value-changed=${this._otherSourceChanged}
      ></ha-yaml-editor>
      ${this._renderMatches(t)}
    `}_otherSourceChanged(e){var t;if(e.stopPropagation(),!this._config||!1===(null===(t=e.detail)||void 0===t?void 0:t.isValid))return;const i=Object.assign({},this._config);ue(i,"for_each_from",e.detail.value),M(this,"config-changed",{config:i})}_listItems(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.for_each;return Array.isArray(t)?t:t&&"object"==typeof t?[t]:[]}_setList(e){this._config&&M(this,"config-changed",{config:Object.assign(Object.assign({},this._config),{for_each:e})})}_renderRepeatList(){const t=this._listItems(),i=(e,t)=>function(e){var t,i;const s=Array.isArray(e)?Object.assign({},...e.filter(e=>e&&"object"==typeof e)):e&&"object"==typeof e?e:{},a=e=>"string"==typeof e&&e.trim()?e.trim():void 0,o=Object.values(s).find(e=>"string"==typeof e&&e.trim());return null!==(i=null!==(t=a(s.name))&&void 0!==t?t:a(s.entity))&&void 0!==i?i:"string"==typeof o?o.trim():""}(e)||c("editor.repeat.list_item",{number:t+1},this.hass),s=(e,i)=>{e.preventDefault();const s=this._dragging;this._dragging=void 0,void 0!==s&&s!==i&&this._setList(Ze(t,s,i))};return e`
      <p class="hint">${c("editor.repeat.list_hint",void 0,this.hass)}</p>
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
                <ha-svg-icon
                  class="handle"
                  role="img"
                  aria-label=${c("template_editor.drag_hint",void 0,this.hass)}
                  .path=${"M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z"}
                ></ha-svg-icon>
                <span class="item-name">${i(a,o)}</span>
                <span class="spacer"></span>
                <ha-icon-button
                  .path=${"M7,15L12,10L17,15H7Z"}
                  .disabled=${0===o}
                  .label=${c("editor.repeat.move_up",{name:i(a,o)},this.hass)}
                  @click=${()=>this._setList(Ze(t,o,o-1))}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M7,10L12,15L17,10H7Z"}
                  .disabled=${o===t.length-1}
                  .label=${c("editor.repeat.move_down",{name:i(a,o)},this.hass)}
                  @click=${()=>this._setList(Ze(t,o,o+1))}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"}
                  .label=${c("editor.repeat.list_edit",{name:i(a,o)},this.hass)}
                  @click=${()=>this._toggleItem(o)}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                  .label=${c("editor.repeat.list_remove",{name:i(a,o)},this.hass)}
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
      <ha-button @click=${()=>this._setList(function(e){const t=e[e.length-1],i=t&&"object"==typeof t&&!Array.isArray(t)?Object.keys(t):[],s={};for(const a of i.length?i:["entity"])s[a]="";return[...e,s]}(t))}>
        ${c("editor.repeat.list_add",void 0,this.hass)}
      </ha-button>
    `}_toggleItem(e){const t=new Set(this._openItems);t.has(e)?t.delete(e):t.add(e),this._openItems=t}_hiddenNames(e,t){return this._builds.get("hidden",this._readsKey(e),()=>this._hiddenNamesNow(e,t))}_hiddenNamesNow(e,t){var i;const s=new Set;if(!t.some(e=>void 0!==e.show_if||void 0!==e.hide_if))return s;const a=T(N(null===(i=this._config)||void 0===i?void 0:i.variables,e)),o=this._config,r=_t(a,t=>{var i;if(!o||!e)return t;const s=null!==(i=this._lovelace)&&void 0!==i?i:se(),a=fe(this.hass,this._rebuildOnFor(e)),r=we(o).variables;return b(r,e,t,o.template,a,!0,void 0,0,void 0,void 0,!1,{itemTemplates:be(s),context:ve(s)})});for(const n of t)Ye(n,r)||s.add(n.name);return s}_formSchema(e,t,i,s=new Map){if(!e.length)return this._schema.slice(1);const a=new Set(this._suppliedNames(i)),o=e=>{var t;const i=a.has(e.name),o=i?void 0:s.get(e.name),r=o?[e.description,c(`editor.default.${o.source}`,{value:o.text},this.hass)+(o.chain?` ${c("editor.default.chain",{chain:o.chain},this.hass)}`:"")].filter(Boolean).join(" · "):e.description;return{name:po+e.name,label:null!==(t=e.label)&&void 0!==t?t:e.name,helper:i?c("editor.repeat.from_each_copy_helper",void 0,this.hass):r,selector:this._selectorFor(e),required:!0===e.required&&!i,disabled:i}},r=[];for(const n of Ge(e.filter(e=>!pe(e))))void 0===n.group?r.push(...n.declarations.map(o)):r.push({name:"",type:"expandable",title:n.group,schema:n.declarations.map(o)});return[...r,...t.extras?[]:[{name:"extras",label:c("editor.extras_label",void 0,this.hass),helper:c("editor.extras_helper",void 0,this.hass),selector:{object:{}}}]]}_rebuildOnEach(e){var t;const i=null!==(t=this._lovelace)&&void 0!==t?t:se();return Qe(this._config,e,this.hass,{itemTemplates:be(i),context:ve(i)})}_rebuildOnFor(e){var t;const i=null!==(t=this._lovelace)&&void 0!==t?t:se();return this._builds.get("rebuild_on",Bs(this.hass,[],this._config,e,i,et()),()=>Xe(this._config,e,this.hass,{itemTemplates:be(i),context:ve(i)}).entities)}_readsKey(e,...t){var i;const s=null!==(i=this._lovelace)&&void 0!==i?i:se(),a=this._editingPlace();return Bs(this.hass,this._rebuildOnFor(e),this._config,e,this._templates,s,a.view,a.section,et(),"undefined"==typeof window?"":window.location.pathname,...t)}_renderVariablesForm(t,i,s,a,o){const r=this._resetTargets(i,a),n=this._formSchema(i,s,a,r),l=i=>e`<ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${i}
        .error=${o}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
        @value-changed=${this._valueChanged}
      ></ha-form>`;if(!i.length)return l(n);const d=t=>{var i,s;if("string"!=typeof t.name||!t.name.startsWith(po))return l([t]);const a=t.name.slice(9),o=t.disabled?void 0:r.get(a);return e`<div class="declared-field">
        ${l([t])}
        <span class="reset-slot"
          >${(null==o?void 0:o.set)?e`<ha-icon-button
                  class="reset"
                  .path=${"M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"}
                  .label=${c("editor.default.reset",{name:null!==(i=t.label)&&void 0!==i?i:a},this.hass)}
                  title=${c("editor.default.reset",{name:null!==(s=t.label)&&void 0!==s?s:a},this.hass)}
                  data-variable=${a}
                  @click=${()=>this._resetVariable(a)}
                ></ha-icon-button>`:e``}</span
        >
      </div>`},h=e=>{var t;return"expandable"===e.type?`group:${null!==(t=e.title)&&void 0!==t?t:""}`:String(e.name)};return e`<div class="declared">
      ${Rs(n,h,t=>{var i,s,a;return"expandable"===t.type?e`<ha-expansion-panel
              outlined
              class="declared-group"
              .header=${null!==(i=t.title)&&void 0!==i?i:""}
              .expanded=${this._openGroups.has(null!==(s=t.title)&&void 0!==s?s:"")}
              @expanded-changed=${e=>{var i;return this._groupToggled(null!==(i=t.title)&&void 0!==i?i:"",e)}}
            >
              <div class="declared-group-body">${Rs(null!==(a=t.schema)&&void 0!==a?a:[],h,d)}</div>
            </ha-expansion-panel>`:d(t)})}
    </div>`}_groupToggled(e,t){var i;t.stopPropagation();const s=new Set(this._openGroups);(null===(i=t.detail)||void 0===i?void 0:i.expanded)?s.add(e):s.delete(e),this._openGroups=s}_resetTargets(e,t){const i=e.map(e=>e.name).join("\n");return this._builds.get("resets",this._readsKey(t,i),()=>this._resetTargetsNow(e,t))}_resetTargetsNow(e,t){var i,s,a,o,r,n;const l=new Map,d=null===(i=this._config)||void 0===i?void 0:i.variables;if(!t)return l;const c=null!==(s=this._lovelace)&&void 0!==s?s:se(),h=this._editingPlace(),u={section:void 0===h.view||void 0===h.section||null===(n=null===(r=null===(o=null===(a=null==c?void 0:c.views)||void 0===a?void 0:a[h.view])||void 0===o?void 0:o.sections)||void 0===r?void 0:r[h.section])||void 0===n?void 0:n.decluttering_defaults,dashboard:it(c),library:tt().defaults},p={itemTemplates:be(c),context:ve(c)},m=fe(this.hass,this._rebuildOnFor(t)),v=T(d);for(const _ of e){if(pe(_))continue;const e=ja(_.name,d,t,u);if(!e)continue;const i=JSON.stringify(e.value),s="string"==typeof i&&E.test(i),a=s?ba(e.value,xa(d,_.name),t,m,p):e.value;l.set(_.name,{text:Oa(void 0===a?e.value:a)||'""',source:e.source,chain:s&&void 0!==a?Oa(e.value):void 0,set:_.name in v})}return l}_resetVariable(e){this._config&&M(this,"config-changed",{config:ka(this._config,e)})}_formData(e){var t,i,s,a,o,r,n,l,d,c,h,u;if(!e.length)return this._config;const p=T(null===(t=this._config)||void 0===t?void 0:t.variables),m=new Set(e.map(e=>e.name)),v={template:null===(i=this._config)||void 0===i?void 0:i.template};this._shownAs=new Map;const _=e.filter(e=>!(e.name in p)&&!pe(e)).map(e=>e.name),f=null!==(s=this._lovelace)&&void 0!==s?s:se(),g=null===(a=this._templates)||void 0===a?void 0:a[null===(o=this._config)||void 0===o?void 0:o.template],b=this._builds.get("defaults",this._readsKey(g,_.join("\n")),()=>{var e;return function(e,t,i,s,a){const o=new Map;if(!i||!e.length)return o;const r=T(N(t,i));for(const n of e){if(!(n in r))continue;const e=ba(r[n],t,i,s,a);null!=e&&""!==e&&o.set(n,e)}return o}(_,null===(e=this._config)||void 0===e?void 0:e.variables,g,fe(this.hass,this._rebuildOnFor(g)),{itemTemplates:be(f),context:ve(f)})});for(const $ of e){if(!($.name in p)){if(!b.has($.name))continue;let e=b.get($.name);"boolean"in ie($)&&"boolean"!=typeof e&&(e=bo.has(String(e).trim().toLowerCase())),this._shownAs.set($.name,{shown:e,written:void 0}),v[po+$.name]=e;continue}const e=p[$.name];if("boolean"!=typeof e&&"boolean"in ie($)){const t=bo.has(String(e).trim().toLowerCase());this._shownAs.set($.name,{shown:t,written:e}),v[po+$.name]=t}else v[po+$.name]=e}const y=B(null===(r=this._config)||void 0===r?void 0:r.variables).filter(e=>{const t=K(e);return void 0!==t&&!m.has(t)});return y.length&&(v.extras=y),void 0!==(null===(n=this._config)||void 0===n?void 0:n.columns)&&(v.columns=this._config.columns),void 0!==(null===(l=this._config)||void 0===l?void 0:l.min_column_width)&&(v.min_column_width=this._config.min_column_width),void 0!==(null===(d=this._config)||void 0===d?void 0:d.gap)&&(v.gap=this._config.gap),void 0!==(null===(c=this._config)||void 0===c?void 0:c.fit)&&(v.fit=this._config.fit),void 0!==(null===(h=this._config)||void 0===h?void 0:h.lazy)&&(v.lazy=this._config.lazy),void 0!==(null===(u=this._config)||void 0===u?void 0:u.lazy_eager)&&(v.lazy_eager=this._config.lazy_eager),v}_renderDiagnostics(t,i){var s,a,o,r,n,l,d,h,u,p,m,v,_,f,g;if(!t||this._loadingTemplates||!i||ce(this._config))return e``;const b=[...this._suppliedNames(t),...this._rebuildOnFor(t),...st(t,L(null===(s=this._config)||void 0===s?void 0:s.variables)),...Object.keys(be(null!==(a=this._lovelace)&&void 0!==a?a:se()))].map(e=>({[e]:null})),{missing:y,unused:$,required:w}=at(this._config?we(this._config).variables:void 0,t,b,[null===(o=this._config)||void 0===o?void 0:o.for_each_from,null===(r=this._config)||void 0===r?void 0:r.on_error],ot(t,be(null!==(n=this._lovelace)&&void 0!==n?n:se()))),x=rt(null===(l=this._config)||void 0===l?void 0:l.variables,t,this.hass),k=this._hiddenNames(t,le(t)),j=w.filter(e=>!k.has(e)),O=y.filter(e=>!w.includes(e)&&vo.test(e)),A=y.filter(e=>!w.includes(e)&&!k.has(e)&&!O.includes(e)),S=new Set(B(null===(d=this._config)||void 0===d?void 0:d.variables).map(K)),C=[...k].filter(e=>S.has(e)),P=yo.test(`${null!==(h=t.style)&&void 0!==h?h:""}\n${null!==(p=null===(u=this._config)||void 0===u?void 0:u.style)&&void 0!==p?p:""}`),E="contents"===(null===(m=this._config)||void 0===m?void 0:m.fit)&&P,T=Number(null===(v=this._config)||void 0===v?void 0:v.columns),N=(void 0!==(null===(_=this._config)||void 0===_?void 0:_.for_each)||void 0!==(null===(f=this._config)||void 0===f?void 0:f.for_each_from))&&T>1&&!(Number(null===(g=this._config)||void 0===g?void 0:g.min_column_width)>0),M=he(t),V=nt(this._config,M),D=this._failedChecks(t);return e`
      ${D.map(t=>{var i;return e`<ha-alert alert-type=${"error"===t.level?"error":"warning"}>
            ${c(t.name?"editor.check_failed_named":"editor.check_failed",{name:null!==(i=t.name)&&void 0!==i?i:"",message:t.message},this.hass)}
          </ha-alert>`})}
      ${V.map(t=>{var i,s;return e`<ha-alert alert-type="warning">
            ${c("editor.override_misplaced",{key:t,kind:M,template:null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""},this.hass)}
          </ha-alert>`})}
      ${N?e`<ha-alert alert-type="info">
              ${c("editor.columns_without_min_width",{columns:T},this.hass)}
            </ha-alert>`:e``}
      ${E?e`<ha-alert alert-type="warning">${c("editor.fit_hides_style",void 0,this.hass)}</ha-alert>`:e``}
      ${C.length?e`<ha-alert alert-type="warning">
              ${c(1===C.length?"editor.hidden_but_set_one":"editor.hidden_but_set_many",{names:C.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${j.length?e`<ha-alert alert-type="error">
              ${c(1===j.length?"editor.required_one":"editor.required_many",{names:j.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${O.length?e`<ha-alert alert-type="warning">
              ${c("editor.rebuild_on_hint",{names:O.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${A.length?e`<ha-alert alert-type="warning">
              ${c(1===A.length?"editor.optional_one":"editor.optional_many",{names:A.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${x.map(t=>e`<ha-alert alert-type="warning">
            ${c("editor.invalid_value",{name:t.name,expected:t.expected},this.hass)}
          </ha-alert>`)}
      ${$.length?e`<ha-alert alert-type="info">
              ${c(1===$.length?"editor.unused_one":"editor.unused_many",{names:$.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_failedChecks(e){return lt(e).length&&this._config?this._builds.get("checks",this._readsKey(e),()=>this._failedChecksNow(e)):[]}_failedChecksNow(e){var t;if(!this._config)return[];const i=null!==(t=this._lovelace)&&void 0!==t?t:se(),s=fe(this.hass,this._rebuildOnFor(e)),a=this._config.template,o=we(this._config).variables;try{return dt(e,a,t=>b(o,e,t,a,s,!0,void 0,0,void 0,void 0,!1,{itemTemplates:be(i),context:ve(i)}),this.hass).filter(e=>"info"!==e.level)}catch(r){return[]}}_valueChanged(e){var t,i;const s=e.detail.value,a=le(null===(t=this._templates)||void 0===t?void 0:t[s.template]);if(!a.length)return void M(this,"config-changed",{config:s});const o=[];for(const l of a){let e=s[po+l.name];const t=this._shownAs.get(l.name);t&&ya(e,t.shown)&&(e=t.written),void 0!==e&&""!==e&&o.push({[l.name]:e})}Array.isArray(s.extras)&&o.push(...s.extras);const r=Object.assign(Object.assign({},this._config),{template:s.template}),n=ct(B(null===(i=this._config)||void 0===i?void 0:i.variables),o);n.length?r.variables=n:delete r.variables,ue(r,"columns",s.columns),ue(r,"min_column_width",s.min_column_width),ue(r,"gap",s.gap),ue(r,"lazy",!0===s.lazy||void 0),ue(r,"lazy_eager",s.lazy_eager),M(this,"config-changed",{config:r})}_loadBorrowedTemplates(){if(!ht(this._lovelace))return;this._loadingTemplates=!0;const e=this._editingPlace();ut(this.hass,this._lovelace,e.view,void 0,e.section).then(e=>{this._templates=oe(e,this.hass),this._schema=void 0}).finally(()=>{this._loadingTemplates=!1,this.requestUpdate()})}}s([o()],$o.prototype,"_lovelace",void 0),s([o()],$o.prototype,"_config",void 0),s([a()],$o.prototype,"hass",void 0),s([o()],$o.prototype,"_loadingTemplates",void 0),s([o()],$o.prototype,"_ejectPending",void 0),s([o()],$o.prototype,"_sectionsPending",void 0),s([o()],$o.prototype,"_sectionsError",void 0),s([o()],$o.prototype,"_onErrorMode",void 0),s([o()],$o.prototype,"_previewMode",void 0),s([o()],$o.prototype,"_builtAnyway",void 0),s([o()],$o.prototype,"_copied",void 0),s([o()],$o.prototype,"_cannotOpen",void 0),s([o()],$o.prototype,"_resume",void 0),s([o()],$o.prototype,"_matchesOpen",void 0),s([o()],$o.prototype,"_byDomainDraft",void 0),s([o()],$o.prototype,"_openItems",void 0),s([o()],$o.prototype,"_pickerFilter",void 0),s([o()],$o.prototype,"_openGroups",void 0),s([o()],$o.prototype,"_presetPending",void 0),s([o()],$o.prototype,"_renderedTemplates",void 0);const wo=/^[a-z_]+\.[a-z0-9_]+$/,xo={base:"entity",label:"Entity",selector:{entity:{}},matches:e=>wo.test(e)};function ko(e,t){return{base:e,label:t,selector:{text:{}},matches:e=>e.trim().length>0}}const jo={entity:xo,entity_id:xo,name:ko("name","Name"),title:ko("title","Title"),heading:ko("heading","Heading"),icon:{base:"icon",label:"Icon",selector:{icon:{}},matches:e=>e.includes(":")}};function Oo(e,t){return 1===t?e.label:`${e.label} ${t}`}const Ao=(e,t=200)=>{if("number"==typeof e&&(e=String(e)),"string"!=typeof e)return;const i=e.trim();return i?i.length>t?`${i.slice(0,t-1)}…`:i:void 0};function So(e){const t=Ao(e,2e3);if(t&&/^https?:\/\/[^\s/]+/i.test(t))return t}const Co=e=>[].concat(null!=e?e:[]).map(e=>Ao(e)).filter(e=>!!e).slice(0,50);function Po(e){if("string"==typeof e){const t=Ao(e);return t?{name:t}:void 0}if(!e||"object"!=typeof e||Array.isArray(e))return;const t=e,i=Ao(t.github),s={name:Ao(t.name),github:i&&/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(i)?i:void 0,email:Ao(t.email),url:So(t.url)};for(const a of Object.keys(s))void 0===s[a]&&delete s[a];return Object.keys(s).length?s:void 0}function Eo(e){const t=e&&"object"==typeof e?e:{},i={author:Po(t.author),license:Ao(t.license),help:So(t.help),homepage:So(t.homepage),readme:Ao(t.readme,8e3),related:Co(t.related),setup:Co(t.setup)};for(const s of["author","license","help","homepage","readme"])void 0===i[s]&&delete i[s];return i}const Lo=["author","license","help","homepage","readme","requires","setup","related"];function To(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);for(const i of Lo)delete t[i];return t}const No={integrations:{kind:"integration",key:"integration"},entities:{kind:"entity",key:"entity"},custom_cards:{kind:"custom_card",key:"card"}},Mo=e=>{const t=Ao(e,40);return t&&t.replace(/\+$/,"").trim()||void 0};function Vo(e){var t;const i=null==e?void 0:e.requires;if(!i||"object"!=typeof i||Array.isArray(i))return[];const s=[];for(const[a,{kind:o,key:r}]of Object.entries(No))for(const e of[].concat(null!==(t=i[a])&&void 0!==t?t:[]).slice(0,50)){const t=e&&"object"==typeof e&&!Array.isArray(e)?e:void 0,i=Co(t?t[r]:e).map(e=>"custom_card"===o?e.replace(/^custom:/,""):e);if(!i.length)continue;const a=t?Ao(t.message,300):void 0;s.push(a?{kind:o,any:i,message:a}:{kind:o,any:i})}for(const a of["homeassistant","card"]){const e=Mo(i[a]);e&&s.push({kind:a,any:[e]})}return s}function Do(e,t){var i,s;const a=e=>e.split(".").map(e=>parseInt(e,10)||0),o=a(e),r=a(t);for(let n=0;n<Math.max(o.length,r.length);n++){const e=null!==(i=o[n])&&void 0!==i?i:0,t=null!==(s=r[n])&&void 0!==s?s:0;if(e!==t)return e>t}return!0}function zo(e,t){switch(e.kind){case"integration":return e.any.some(e=>bt(t.components,e));case"entity":return e.any.some(e=>{const i=function(e){const t=e.replace(/[.+?^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*");return new RegExp(`^${t}$`,"i")}(e);return t.entities.some(e=>i.test(e))});case"custom_card":return e.any.some(e=>t.isDefined(e));case"homeassistant":return!t.homeassistant||Do(t.homeassistant,e.any[0]);case"card":return t.card.startsWith("0.0.0")||Do(t.card,e.any[0])}}function Fo(e,t){const i=ft(e),s=Array.isArray(i)?i.filter(e=>e&&"object"==typeof e):i&&"object"==typeof i?Object.entries(i).map(([e,t])=>({[e]:t})):[],a=s.find(e=>Object.prototype.hasOwnProperty.call(e,t)),o=null==a?void 0:a[t];return"string"==typeof o||"number"==typeof o?String(o):void 0}function Ho(e,t){const i=Eo(e).setup.filter(e=>"string"==typeof t[e]&&""!==t[e]);if(!i.length)return e;const s=ft(e),a=(Array.isArray(s)?s.filter(e=>e&&"object"==typeof e):s&&"object"==typeof s?Object.entries(s).map(([e,t])=>({[e]:t})):[]).filter(e=>!i.some(t=>Object.prototype.hasOwnProperty.call(e,t))),o=Object.assign(Object.assign({},e),{default:[...i.map(e=>({[e]:t[e]})),...a]});return delete o[gt],o}const Ro={integrations:"requires_integrations",entities:"requires_entities",custom_cards:"requires_custom_cards"},qo=e=>"string"==typeof e?e:"number"==typeof e?String(e):void 0,Io=e=>[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);const Wo=e=>"string"==typeof e&&e.trim()?e.trim():void 0,Jo=e=>[].concat(null!=e?e:[]).map(Wo).filter(e=>!!e);const Uo=[At,St,...Ct],Bo=["card","badge","row","element","group"],Ko=["type","template","description","author","license","help","homepage","readme","requires","setup","related","variables","default",...Bo,"style","language"];function Zo(e,t){if(Array.isArray(e))for(const i of e)Zo(i,t);else if(e&&"object"==typeof e){t(e);for(const i of Object.values(e))Zo(i,t)}}function Yo(e){const t=new Set,i=new Set;Zo(e,e=>{const s=e.type;if("string"==typeof s){s.startsWith("custom:")&&!Uo.includes(s)&&t.add(s);for(const t of Pt(e))i.add(t)}});for(const s of yt(e))i.add(s);return{customTypes:[...t].sort(),templateRefs:[...i].sort()}}const Go=/\[\[!?([A-Za-z0-9_-]+)/g;function Qo(e,t){const i=$t(null!=e?e:null),s=[];for(let a=Go.exec(i);null!==a;a=Go.exec(i)){const e=a[1];if(s.includes(e)||!Object.prototype.hasOwnProperty.call(t,e))continue;const i=t[e];i&&"object"==typeof i&&"item"in i&&s.push(e)}Go.lastIndex=0;for(const a of wt(null!=e?e:null))!s.includes(a)&&Object.prototype.hasOwnProperty.call(t,a)&&xt(t[a])&&!kt(a)&&s.push(a);return s}function Xo(e){return e.includes("[[")}function er(e,t){const i=e.split(/\[\[[^\]]*\]\]/);if(!i.join(""))return[];const s=i.map(e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join(".+"),a=new RegExp(`^${s}$`);return t.filter(e=>a.test(e))}function tr(e,t){var i,s;const a=e&&"object"==typeof e&&void 0!==e[gt]?Object.assign(Object.assign({},e),{default:ft(e)}):e,o={};for(const c of Ko)void 0!==(null==a?void 0:a[c])&&(o[c]=a[c]);for(const c of Object.keys(null!=a?a:{}))c in o||c===gt||"source"===c||(o[c]=a[c]);const{customTypes:r,templateRefs:n}=Yo(e),l=new Set,d=new Set,h=null==t?void 0:t[null==e?void 0:e.template],u=(e,t)=>{const i=function(e,t){const i={template:e,bundled:[],askedFor:[]};if(!e||"object"!=typeof e||!t||!(jt in t))return i;const s=L(ft(e)),a=L(t.default).slice(L(t[jt]).length);if(!a.length)return i;const o=new Set(s.map(e=>Object.keys(e)[0])),r=new Set(Ot(Object.assign(Object.assign({},e),{default:[...s,...a]}))),n=new Set(Eo(e).setup),l=[],d=[],c=[];for(const h of a){const e=Object.keys(h)[0];!r.has(e)||o.has(e)||d.includes(e)||c.includes(e)||(n.has(e)?c.push(e):(l.push(h),d.push(e)))}return l.length?{template:Object.assign(Object.assign({},e),{default:[...s,...l]}),bundled:d,askedFor:c}:{template:e,bundled:d,askedFor:c}}(e,t);for(const s of i.bundled)l.add(s);for(const s of i.askedFor)d.add(s);return i.template};if(h){const t=u(Object.assign(Object.assign({},e),{default:o.default}),h);void 0!==t.default&&(o.default=t.default)}const p=[],m=[];let v=!1;if(t){const i={},s=[...n,...Qo(e,t)],a=null==e?void 0:e.template,r=new Set(Eo(e).related.filter(e=>e!==a));for(s.push(...r);s.length;){const e=s.shift();if(e in i||e===a)continue;if(Xo(e)){m.includes(e)||m.push(e);const i=er(e,Object.keys(t)).filter(e=>e!==a);i.length&&(v=!0),s.push(...i);continue}const o=t[e];if(o){i[e]=u(sr(ir(o)),o),s.push(...Yo(o).templateRefs,...Qo(o,t));for(const e of Eo(o).related)e===a||r.has(e)||(r.add(e),s.push(e))}else r.has(e)||p.push(e)}Object.keys(i).length&&(o.includes=i)}else for(const c of n)(Xo(c)?m:p).push(c);const _=new Set(r);for(const c of Object.values(null!==(i=o.includes)&&void 0!==i?i:{}))for(const e of Yo(c).customTypes)_.add(e);const f=new Set;for(const c of Vo(o))"custom_card"===c.kind&&c.any.forEach(e=>f.add(e));const g=[..._].map(e=>e.replace(/^custom:/,"")).filter(e=>!f.has(e));if(g.length){const e=o.requires,t=e&&"object"==typeof e&&!Array.isArray(e)?Object.assign({},e):{};t.custom_cards=[...[].concat(null!==(s=t.custom_cards)&&void 0!==s?s:[]),...g.sort()],o.requires=t,function(e){const t=Object.entries(e);for(const[s]of t)delete e[s];const i=e=>{const t=Ko.indexOf(e);return-1===t?Ko.length:t};for(const[s,a]of t.sort((e,t)=>i(e[0])-i(t[0])))e[s]=a}(o)}const b=[];if(p.length&&b.push(c("share.uses_other_templates",{names:p.join(", ")})),m.length){const e=v?"share.picked_templates_found":"share.picked_templates";b.push(c(e,{names:m.join(", ")}))}l.size&&b.push(c("share.bundled_values",{names:[...l].sort().join(", ")})),d.size&&b.push(c("share.setup_values_left_out",{names:[...d].sort().join(", ")}));const y=function(e){const t=null==e?void 0:e.requires;return t&&"object"==typeof t?["homeassistant","card"].filter(e=>"number"==typeof t[e]):[]}(e);return y.length&&b.push(c("share.version_unquoted",{keys:y.join(", ")})),{payload:o,notes:b}}function ir(e){if(!e||"object"!=typeof e||Array.isArray(e))return e;const t=Object.assign({},e);return delete t.source,t}function sr(e){if(!e||"object"!=typeof e||!(jt in e))return e;const t=e[jt],i=Object.assign({},e);return null==t||Array.isArray(t)&&!t.length?delete i.default:i.default=t,i}function ar(e,t){if(!t.includes(e))return e;let i=2;for(;t.includes(`${e}_${i}`);)i+=1;return`${e}_${i}`}function or(e){if(!e||"object"!=typeof e||Array.isArray(e))return{ok:!1,errors:[c("share.import_not_a_template")]};const t=[];"string"==typeof e.template&&e.template.trim()||t.push(c("share.import_no_name"));const i=Bo.filter(t=>void 0!==e[t]);return 0===i.length?t.push(c("share.import_defines_nothing")):i.length>1&&t.push(c("share.import_defines_both",{first:i[0],second:i[1]})),{ok:0===t.length,errors:t}}function rr(e,t){const i=new Set;for(const s of e)for(const e of Yo(s).customTypes){const s=e.slice(7);s&&!t(s)&&i.add(s)}return[...i].sort()}const nr=["card","badge","row","element","group"],lr=/^[A-Za-z0-9_-]+$/,dr=/^[a-z_]+\.[a-z0-9_]+$/;function cr(e){return nr.find(t=>void 0!==(null==e?void 0:e[t])&&null!==(null==e?void 0:e[t]))}function hr(e){return e.map(e=>"number"==typeof e?`#${e+1}`:e).join(" › ")}function ur(e){const t=new Set;for(const a of Et(null==e?void 0:e.variables))a&&"string"==typeof a.name&&t.add(a.name);const i=$t(null!=e?e:{}),s=/\[\[([A-Za-z0-9_-]+)/g;for(let a=s.exec(i);a;a=s.exec(i))t.add(a[1]);return[...t]}function pr(e){return"boolean"==typeof e?"boolean":"number"==typeof e?"number":"string"==typeof e&&dr.test(e)?"entity":"string"==typeof e&&/^[a-z]+:[a-z0-9-]+$/.test(e)?"icon":"text"}function mr(e,t,i){if(!t.length)return i;const[s,...a]=t;return Array.isArray(e)?e.map((e,t)=>t===s?mr(e,a,i):e):Object.assign(Object.assign({},e),{[s]:mr(null==e?void 0:e[s],a,i)})}function vr(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}function _r(e,t,i){if(!lr.test(i))return{ok:!1,error:"name_invalid"};if(ur(e).includes(i))return{ok:!1,error:"name_taken"};const s=cr(e),a=s?vr(e[s],t):void 0;if(!s||null==a||"object"==typeof a)return{ok:!1,error:"gone"};const o={name:i,type:pr(a),default:a};return{ok:!0,template:Object.assign(Object.assign({},e),{[s]:mr(e[s],t,`[[${i}]]`),variables:Lt(e.variables,[o])})}}function fr(e,t){const i=cr(e);return i?vr(e[i],t):void 0}function gr(e){const t=Object.assign({},e);return delete t.name,t}const br=["card","badge","row","element","group","style","let","default","grid_options","name","alert","function"],yr="dashboard",$r="default:";function wr(e){return e.startsWith("or:")?li(e):zt(e)}function xr(e,t,i){if(!e.includes("[[")&&!e.includes("]]"))return;const s=function(e){let t=0,i=!1;for(let s=0;s<e.length-1;s+=1){const a=e.slice(s,s+2);"[["===a?(t+=1,s+=1):"]]"===a&&(0===t?i=!0:t-=1,s+=1)}return{unclosed:t>0,stray:i}}(e);s.unclosed&&i.findings.push({level:"warning",key:"lint.unclosed",params:{},path:t}),s.stray&&i.findings.push({level:"warning",key:"lint.stray_close",params:{},path:t});let a=e;for(let o=0;o<5;o+=1){let e=!1;if(a=a.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(s,a)=>(e=!0,a.startsWith(ai)||kr(a,t,i),"_")),!e)break}}function kr(e,t,i){var s;const a=e.endsWith("?")?e.slice(0,-1):e,[o,...r]=a.split("|"),n=`[[${e}]]`,l=o.endsWith("?")?o.slice(0,-1):o;Xt(l)&&i.lookups.push({key:l.slice(1),placeholder:n,path:t});const d=void 0!==oi(l)||Xt(l)?void 0:l.split(".")[0];d&&"_"!==d&&!i.heads.has(d)&&i.heads.set(d,t);let c=!1,h=!1;const u=r.findIndex(e=>/^repeat:./.test(e));-1!==u&&d&&(null!==(s=i.repeats)&&void 0!==s?s:i.repeats=[]).push({source:r[u].slice(7),after:r.slice(u+1),placeholder:n,path:t});for(const p of r){if(!ri(p,i.functions)){const e=ni(p,i.functions);i.findings.push({level:"warning",key:"lint.unknown_step",params:e?{step:p,placeholder:n,closest:e}:{step:p,placeholder:n},path:t});continue}(p.startsWith($r)||p.startsWith("or:"))&&c&&i.findings.push({level:"warning",key:"lint.after_default",params:{step:p,placeholder:n},path:t}),p.startsWith($r)&&p.length>8&&(c=!0);const e=wr(p);!e||"_"===e||h&&zt(p)||i.targets.push({name:e,placeholder:n,path:t}),/^(?:with|repeat)(?::|$)/.test(p)&&(h=!0)}}function jr(e,t,i){if("string"!=typeof e){if(Array.isArray(e))e.forEach((e,s)=>jr(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,a]of Object.entries(e))xr(s,t,i),jr(a,t?`${t}.${s}`:s,i)}else xr(e,t,i)}const Or=/\[\[(\$[^|[\]?]+)[^[\]]*\]\]/g;function Ar(e,t,i){if("string"!=typeof e||!e.includes("[[$"))return;const s=new RegExp(Or.source,"g");for(let a=s.exec(e);null!==a;a=s.exec(e))i.lookups.push({key:a[1].slice(1),placeholder:a[0],path:t})}const Sr=["label","description","helper","group"];function Cr(e){const t=new Set(Wt(e).map(e=>Jt+e));for(const i of le(e))t.add(i.name);for(const i of[...L(ft(e)),...L(null==e?void 0:e.let)]){const e=K(i);void 0!==e&&t.add(e)}return[...t]}function Pr(e,t=[],i={}){var s;if(!e||"object"!=typeof e)return[];const a=null!==(s=i.functions)&&void 0!==s?s:Tt(),o={findings:[],heads:new Map,targets:[],functions:a,lookups:[]};!function(e,t){Ar(e.description,"description",t),le(e).forEach((e,i)=>{for(const s of Sr)Ar(e[s],`variables[${i}].${s}`,t)});const i=e.examples;(Array.isArray(i)?i:i?[i]:[]).forEach((e,i)=>{Ar(null==e?void 0:e.name,`examples[${i}].name`,t)})}(e,o);for(const p of br){const t=e[p];void 0!==t&&jr(t,p,o)}if(void 0!==e[yr]){const{rest:t}=Nt(e[yr]);jr(Mt(t),yr,o);const i={findings:[],heads:new Map,targets:[],functions:a,lookups:[]};jr(t,yr,i),o.findings.push(...i.findings)}le(e).forEach((e,t)=>{void 0!==e.default&&jr(e.default,`variables[${t}].default`,o);for(const i of["show_if","hide_if"]){const s=`variables[${t}].${i}`;for(const t of Vt(e,i)){const e=t.slice(3);if(!Dt(t)){o.findings.push({level:"warning",key:"lint.condition_malformed",params:{key:i,condition:e},path:s});continue}const a=zt(t);a&&o.targets.push({name:a.split(".")[0],placeholder:`${i}: ${e}`,path:s})}}}),function(e,t){const i=e[Ut];null!=i&&(Array.isArray(i)?i.forEach((e,i)=>{const s=`${Ut}[${i}]`;if(!e||"object"!=typeof e||Array.isArray(e))return void t.findings.push({level:"warning",key:"lint.check_not_mapping",params:{},path:s});const a=e;jr(a.message,`${s}.message`,t);for(const l of Object.keys(a))Bt.includes(l)||t.findings.push({level:"warning",key:"lint.check_key_unknown",params:{key:l},path:s});void 0===Kt(a.level)&&t.findings.push({level:"warning",key:"lint.check_level_unknown",params:{level:String(a.level)},path:`${s}.level`});const o=a.condition;if(null==o||""===o)return void t.findings.push({level:"warning",key:"lint.check_no_condition",params:{},path:s});if("boolean"==typeof o||"number"==typeof o)return;if("string"!=typeof o)return void t.findings.push({level:"warning",key:"lint.check_condition_malformed",params:{condition:JSON.stringify(o)},path:`${s}.condition`});const r=Zt(o);if(void 0===r)return void jr(o,`${s}.condition`,t);if(/^(?:true|false)$/i.test(o.trim()))return;if(!Dt(r))return void t.findings.push({level:"warning",key:"lint.check_condition_malformed",params:{condition:o},path:`${s}.condition`});const n=zt(r);n&&t.targets.push({name:n.split(".")[0],placeholder:`condition: ${o}`,path:`${s}.condition`})}):t.findings.push({level:"warning",key:"lint.checks_not_list",params:{},path:Ut}))}(e,o);const r=xt(e);r&&i.name&&kt(i.name)&&o.findings.push({level:"warning",key:"lint.function_shadowed",params:{name:i.name},path:"function"}),r||void 0===e.parameters||o.findings.push({level:"info",key:"lint.parameters_without_function",params:{},path:"parameters"});const n=new Set([...Cr(e),...t,...Ue,...Ft,...st(e),Ht,...r?[Rt,...qt(e)]:[]]),l=[...o.findings];!function(e,t,i,s){const a=e[Yt];if(null!=a)if("object"!=typeof a||Array.isArray(a))s.push({level:"warning",key:"lint.language_not_mapping",params:{},path:Yt});else for(const[d,c]of Object.entries(a))c&&"object"==typeof c&&!Array.isArray(c)||s.push({level:"warning",key:"lint.language_entry_not_mapping",params:{language:d},path:`${Yt}.${d}`});const o=Gt(e),r=Wt(e);if(o&&Object.keys(o).length>1)for(const[d,c]of Object.entries(o)){const e=Qt(c),t=r.filter(t=>!e.has(t));t.length&&s.push({level:"warning",key:"lint.translation_missing_in",params:{language:d,keys:t.join(", ")},path:`${Yt}.${d}`})}const n=new Set([...r,...t.filter(Xt).map(e=>e.slice(1))]),l=new Set;for(const d of i.lookups){if(n.has(d.key)||l.has(d.key))continue;l.add(d.key);const e=C(d.key,[...n]);s.push({level:"warning",key:"lint.translation_unknown",params:e?{key:d.key,placeholder:d.placeholder,closest:e}:{key:d.key,placeholder:d.placeholder},path:d.path})}}(e,t,o,l),function(e,t,i){var s;if(!(null===(s=t.repeats)||void 0===s?void 0:s.length))return;const a=T(N(void 0,e));for(const o of t.repeats){if(o.after.includes(ei)||o.after.includes(ti))continue;const e=a[o.source];if(!v(e))continue;const t=Object.keys(e),s=t.filter(e=>ii.includes(e)),r=t.filter(e=>!si.includes(e));s.length&&r.length&&i.push({level:"warning",key:"lint.mixed_repeat_source",params:{placeholder:o.placeholder,name:o.source,filters:s.join(", "),others:r.join(", ")},path:o.path})}}(e,o,l);const d=e=>n.has(e)||o.heads.has(e),c=e=>d(e)||e.split(".").some((e,t,i)=>t>0&&d(i.slice(0,t).join(".")));for(const p of o.targets){if(c(p.name))continue;const e=C(p.name,[...n,...o.heads.keys()]);l.push({level:"warning",key:"lint.target_unknown",params:e?{name:p.name,placeholder:p.placeholder,closest:e}:{name:p.name,placeholder:p.placeholder},path:p.path})}const h=[...o.heads.entries()].filter(([e])=>!n.has(e));h.length&&l.push({level:"info",key:"lint.undeclared",params:{names:h.map(([e,t])=>h.length>1?`${e} (${t})`:e).join(", ")},path:h.length>1?"":h[0][1]});for(const p of function(e){return _a(e).filter(e=>!ma.includes(e)).map(e=>{const t=C(e,ma);return t?{name:e,closest:t}:{name:e}})}(e))l.push({level:"warning",key:"lint.editor_hide_unknown",params:Object.assign({},p),path:"editor_hide"});for(const p of It(e.strict))l.push({level:"warning",key:"lint.strict_unknown",params:p,path:"strict"});const u=new Set;return l.filter(e=>{const t=JSON.stringify([e.key,e.params,e.path]);return!u.has(t)&&(u.add(t),!0)})}const Er=n`
  /* Code stays left to right inside a right-to-left sentence. */
  code {
    direction: ltr;
    unicode-bidi: isolate;
  }
  /* The Settings tab's three panels (idea 32). */
  ha-expansion-panel {
    display: block;
    margin-bottom: 12px;
  }
  ha-expansion-panel small {
    color: var(--secondary-text-color);
    font-weight: 400;
    margin-inline-start: 6px;
  }
  .panel {
    padding: 12px 4px 4px;
  }

  /* Read by a screen reader, drawn by nothing (idea 55). */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition: none !important;
      animation: none !important;
    }
  }

  ${di.styles}
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
    padding-inline-start: 20px;
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
    padding-inline-start: 20px;
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
    padding-inline-start: 20px;
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

  /* The counts on the tabs (idea 31): a pill after the label, not a digit glued to it. */
  ha-tab-group-tab .pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-inline-start: 6px;
    min-width: 18px;
    height: 18px;
    padding: 0 6px;
    border-radius: 9px;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    font-size: 11px;
    font-weight: 600;
    line-height: 1;
    vertical-align: middle;
  }
  ha-tab-group-tab .pill.grey {
    background: var(--disabled-color, #bdbdbd);
    color: var(--primary-text-color);
  }
  ha-tab-group-tab .pill.warn {
    background: var(--warning-color, #ffa600);
    color: #000;
  }
  ha-tab-group-tab .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-inline-start: 6px;
    border-radius: 50%;
    background: var(--warning-color, #ffa600);
    vertical-align: middle;
  }
`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,Lr=Ps(class extends Es{constructor(){super(...arguments),this.key=d}render(e,t){return this.key=e,t}update(e,[t,i]){return t!==this.key&&(zs(e),this.key=t),i}}),Tr=[{name:"room_light_tile",summary:"A tile per light, with the light named after itself.",template:{description:"A tile for one light, taking its name from Home Assistant.",variables:[{name:"entity",label:"Light",selector:{entity:{domain:"light"}},required:!0},{name:"name",label:"Name",description:"Leave empty to use the light’s own name",selector:{text:{}}}],card:{type:"tile",entity:"[[entity]]",name:"[[name|or:entity|friendly_name]]",features:[{type:"light-brightness"}]}}},{name:"room_summary",summary:"A heading per area, listing the lights in it. Uses grouping.",template:{description:"One card per area, with a tile for every light in that area.",card:{type:"vertical-stack",cards:[{type:"markdown",content:"## [[area]]\n\n[[entity_count]] lights"},{type:"custom:decluttering-card-plus",template:"room_light_tile",for_each:"[[items]]"}]}}},{name:"sensor_line",summary:"An Entities row showing one sensor with its area.",template:{description:"A row for one sensor, labelled with the area it is in.",variables:[{name:"entity",label:"Sensor",selector:{entity:{}},required:!0}],row:{entity:"[[entity]]",name:"[[entity|friendly_name]] ([[entity|area|default:no area]])"}}},{name:"status_badge",summary:"A badge that only appears when something needs attention.",template:{description:"A badge for one entity, hidden unless it is in the state you care about.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0},{name:"when",label:"Show when the state is",selector:{text:{}},default:"on"}],badge:{type:"entity",entity:"[[entity]]",visibility:[{condition:"state",entity:"[[entity]]",state:"[[when]]"}]}}},{name:"counted_grid",summary:'A numbered grid of anything, showing "3 of 12".',template:{description:"A tile that knows where it sits in a repeat.",variables:[{name:"entity",label:"Entity",selector:{entity:{}},required:!0}],card:{type:"tile",entity:"[[entity]]",name:"[[entity|friendly_name]]",footer:{type:"markdown",content:"[[index]] of [[total|or:count]]"}}}}];function Nr(e){return Tr.find(t=>t.name===e)}function Mr(e,t){const i=new Set,s=e=>{Array.isArray(e)?e.forEach(s):e&&"object"==typeof e&&("string"==typeof e.type&&e.type.includes("decluttering-card")&&"string"==typeof e.template&&i.add(e.template),Object.values(e).forEach(s))};return s(e.template),[...i].filter(e=>!t.includes(e))}function Vr(e,t){return{library:e,version:t}}const Dr="tempus2016/decluttering-card-plus",zr="share-your-templates",Fr=`https://github.com/${Dr}/discussions/new?category=${zr}`,Hr="decluttering-card-plus-community";function Rr(e){let t=2e4;const i=e=>(t-=1+Math.ceil(e/16))>=0,s=e=>"string"==typeof e?i(e.length):!!i(0)&&(Array.isArray(e)?e.every(s):!e||"object"!=typeof e||Object.entries(e).every(([e,t])=>i(e.length)&&s(t)));return s(e)}const qr=e=>!!e&&"object"==typeof e&&!Array.isArray(e);function Ir(e){if(Rr(e))return JSON.parse(JSON.stringify(e),(e,t)=>"__proto__"===e?void 0:t)}const Wr=/[\p{Cf}\u2800\u3164\u115F\u1160\uFFA0]/gu;function Jr(e){if("string"!=typeof e)return;const t=e.replace(Wr,"").replace(/\s+/g," ").trim();return t?t.length>80?`${t.slice(0,79)}…`:t:void 0}const Ur=["card","badge","row","element","group"];function Br(e){if(!qr(e))return{};const t={};for(const[i,s]of Object.entries(e))qr(s)&&Ur.some(e=>void 0!==s[e])&&(t[i]=s);return t}function Kr(e,t){return"string"==typeof t&&/^https:\/\/github\.com\//.test(t)?t:`https://github.com/${Dr}/discussions/${e}`}function Zr(e){var t,i,s,a,o;const r=function(e){if("string"!=typeof e||e.length>65536)return;const t=/^ {0,3}(`{3,}|~{3,})[ \t]*([\w-]*)/,i=[];let s;for(const r of function(e){return e.replace(/<!--[\s\S]*?(?:-->|$)/g,"")}(e).split("\n")){if(s){r.trim()===s.fence?(i.push({lang:s.lang,text:s.lines.join("\n")+"\n"}),s=void 0):s.lines.push(r);continue}const e=t.exec(r);e&&(s={fence:e[1],lang:e[2],lines:[]})}const a=i.find(e=>/^ya?ml$/i.test(e.lang)),o=null!=a?a:i.find(e=>""===e.lang);return null==o?void 0:o.text}(null==e?void 0:e.body);if(!r)return;let n;try{if(n=Ir($s(r,{maxAliases:50})),void 0===n)return}catch(h){return}if(!or(n).ok)return;if("number"!=typeof(null==e?void 0:e.number))return;const{template:l,includes:d}=n,c=ci(n,["template","includes"]);return delete c.type,"string"!=typeof c.description&&delete c.description,{id:e.number,title:null!==(t=Jr(e.title))&&void 0!==t?t:l,author:"string"==typeof(null===(i=e.user)||void 0===i?void 0:i.login)?e.user.login:"",url:Kr(e.number,e.html_url),name:l.trim(),template:c,includes:Br(d),reactions:"number"==typeof(null===(s=e.reactions)||void 0===s?void 0:s.total_count)?e.reactions.total_count:0,updated:"string"==typeof(null!==(a=e.updated_at)&&void 0!==a?a:e.created_at)?null!==(o=e.updated_at)&&void 0!==o?o:e.created_at:""}}const Yr=["lock","alarm_control_panel","cover","valve","siren","script","automation","button","input_button","water_heater","lawn_mower","update"],Gr=["more-info","navigate","none","assist"],Qr=["action","perform_action","service","type"],Xr=/\b[a-z][a-z0-9+.-]{1,31}:(?:\/\/)?[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?|\/\/[\w-]+(?:\.[\w-]+)+(?::\d+)?(?:[/?#][^\s"'<>)\]{}]*)?/gi,en=[/(?:url|image-set|src)\(\s*['"]?([^'")\s{}]+)/gi,/@import\s+(?:url\(\s*)?['"]?([^'")\s;{}]+)/gi],tn=/^(?:\/(?!\/)|#|data:)/i,sn=["image","url","url_path","entity_picture","camera_image","image_url","icon_url","src"],an=/\[\[\[|\{\{|\{%|\$\{/,on=/^\s*(?:javascript|data|vbscript):/i,rn=/position\s*:\s*(?:fixed|absolute)/i,nn=/opacity\s*:\s*0(?:[^.\d]|$)|visibility\s*:\s*hidden|transparent/i,ln=e=>"string"==typeof e&&Yr.includes(e.split(".")[0]),dn=e=>e.replace(/\\/g,"/"),cn="*";function hn(e,t){const i=[].concat(null!=e?e:[]).filter(e=>"string"==typeof e);if(i.length)return i.includes(cn)?[cn]:i;const s=[].concat(null!=t?t:[]).filter(e=>"string"==typeof e);if(!s.length)return[cn];const a=s.map(e=>{const t=e.indexOf("."),i=-1===t?e:e.slice(0,t);return/^[a-z_]+$/.test(i)?i:cn});return a.includes(cn)?[cn]:[...new Set(a)]}function un(e,t,i=new Set){var s,a,o,r;if(Array.isArray(e))return e.forEach(e=>un(e,t,i)),i;if(!qr(e))return i;const n="string"==typeof e.entity?e.entity:t,l=e.action;if("string"==typeof l&&!Gr.includes(l)&&!l.includes("[[")&&"perform-action"!==l&&"call-service"!==l&&"fire-dom-event"!==l&&"url"!==l){const t=[].concat(null!==(r=null!==(o=null!==(a=null===(s=e.target)||void 0===s?void 0:s.entity_id)&&void 0!==a?a:e.entity_id)&&void 0!==o?o:n)&&void 0!==r?r:[]);t.length&&!t.some(e=>"string"!=typeof e||e.includes("[["))||i.add(l)}return Object.values(e).forEach(e=>un(e,n,i)),i}function pn(e,t){const i=Ur.find(t=>void 0!==e[t]);if(i)try{return b(t,e,e[i],void 0,void 0,!0)}catch(s){return}}function mn(e){const t=new Set,i=new Set;let s=!1,a=!1,o=!1,r=!1;const n=e=>{const t=dn(e).trim();!t||tn.test(t)||t.startsWith("[[")||t.startsWith("{{")||/^[\w.-]+\.[a-z]{2,}(?:[:/?#]|$)/i.test(t)&&i.add(t)},l=new Set,d=(e,i)=>{for(const s of e)if(i.includes(cn))t.add(`${s} *`);else for(const e of i)Yr.includes(e)&&t.add(`${s} ${e}.*`)},c=(h,u)=>{var p;if("string"==typeof h)return void(e=>{var t;const s=dn(e);for(const a of null!==(t=s.match(Xr))&&void 0!==t?t:[])i.add(a);for(const a of en){a.lastIndex=0;let e=a.exec(s);for(;e;)tn.test(e[1])||i.add(e[1]),e=a.exec(s)}an.test(e)&&(a=!0),rn.test(e)&&nn.test(e)&&(r=!0)})(h);if(Array.isArray(h))return void h.forEach(e=>c(e,u));if(!qr(h))return;const m="string"==typeof h.entity?h.entity:u;Object.keys(h).some(e=>e.includes("[["))&&(o=!0),Qr.some(e=>"string"==typeof h[e]&&h[e].includes("[["))&&(o=!0),"string"==typeof h.action&&((e,s)=>{var o,r,n,l,d,c;const h=e.action;if("perform-action"===h||"call-service"===h){const i=null!==(o=e.perform_action)&&void 0!==o?o:e.service;return void("string"!=typeof i?t.add("?"):i.includes("[[")||t.add(i))}if("fire-dom-event"===h)return void t.add("fire-dom-event");if("url"===h)return i.add("string"==typeof e.url_path?e.url_path:"?"),void("string"==typeof e.url_path&&on.test(e.url_path)&&(a=!0));if(Gr.includes(h)||h.includes("[["))return;const u=[].concat(null!==(c=null!==(d=null!==(l=null!==(n=null===(r=e.target)||void 0===r?void 0:r.entity_id)&&void 0!==n?n:e.entity_id)&&void 0!==l?l:e.entity)&&void 0!==d?d:s)&&void 0!==c?c:[]);for(const i of u)ln(i)&&t.add(`${h} ${i}`)})(h,m),"iframe"!==h.type&&"webpage"!==h.type||(s=!0);for(const e of sn)"string"==typeof h[e]&&n(h[e]);if("string"==typeof h.type&&Ct.includes(h.type)){const t=(t=>{if("string"==typeof t)return t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0})(h.template);if(t){if(v(h.for_each_from)){const e=h.for_each_from,i=Ur.map(e=>t[e]).find(e=>void 0!==e);d(un(i,void 0),hn(e.domain,e.entities))}const e=(_=h.variables,Array.isArray(_)?_.filter(qr):qr(_)?Object.entries(_).map(([e,t])=>({[e]:t})):void 0);(null==e?void 0:e.length)&&!l.has(h.template)&&(l.add(h.template),c(pn(t,e),void 0),l.delete(h.template))}}var _;if("custom:auto-entities"===h.type&&qr(h.filter))for(const e of[].concat(null!==(p=h.filter.include)&&void 0!==p?p:[])){if(!qr(e))continue;const t=hn(e.domain,e.entity_id);d(un(e.options,void 0),t),d(un(h.card,void 0),t)}Object.values(h).forEach(e=>c(e,m))},h=[e.template,...Object.values(e.includes)].map(To);c(h,void 0);for(const u of h)c(pn(u),void 0);return{actions:[...t].sort(),urls:[...i].sort(),embeds:s,scripts:a,placeholders:o,overlay:r}}function vn(e){return e.filter(e=>{var t;return(null===(t=null==e?void 0:e.category)||void 0===t?void 0:t.slug)===zr}).map(Zr).filter(e=>!!e).sort((e,t)=>t.reactions-e.reactions||t.updated.localeCompare(e.updated))}class _n extends Error{}function fn(e){var t;if(!qr(e)||"number"!=typeof e.id||"string"!=typeof e.name)return;if(!qr(e.template))return;const i=Ir({template:e.template,includes:e.includes});if(!i||!qr(i.template))return;if(!or(Object.assign({template:e.name},i.template)).ok)return;const s=Object.assign({},i.template);return delete s.type,"string"!=typeof s.description&&delete s.description,{id:e.id,title:null!==(t=Jr(e.title))&&void 0!==t?t:e.name,author:"string"==typeof e.author?e.author:"",url:Kr(e.id,e.url),name:e.name,template:s,includes:Br(i.includes),reactions:"number"==typeof e.reactions?e.reactions:0,updated:"string"==typeof e.updated?e.updated:""}}async function gn(e={}){var t,i,s,a;const o=null!==(t=e.fetcher)&&void 0!==t?t:fetch.bind(globalThis),r=null!==(i=e.storage)&&void 0!==i?i:"undefined"==typeof localStorage?void 0:localStorage,n=null!==(s=e.now)&&void 0!==s?s:Date.now(),l=function(e){var t;try{const i=JSON.parse(null!==(t=null==e?void 0:e.getItem(Hr))&&void 0!==t?t:"null");if(!i||!Array.isArray(i.entries)||"number"!=typeof i.fetched)return;return{entries:i.entries.map(fn).filter(e=>!!e),fetched:i.fetched}}catch(i){return}}(r);if(l&&!e.refresh&&n-l.fetched<216e5)return l;const d=[];try{for(let e=1;e<=10;e+=1){const t=await o(`https://api.github.com/repos/${Dr}/discussions?per_page=100&page=${e}`,{headers:{Accept:"application/vnd.github+json"}});if(!t.ok){const e=new _n(`GitHub answered ${t.status}`);throw"0"===t.headers.get("x-ratelimit-remaining")&&(e.retryAt=1e3*Number(t.headers.get("x-ratelimit-reset"))||void 0),e}const i=await t.json();if(!Array.isArray(i))break;if(d.push(...i),i.length<100)break}}catch(h){const e=h instanceof _n?h:new _n(null!==(a=null==h?void 0:h.message)&&void 0!==a?a:String(h));throw e.cached=l,e}const c={entries:vn(d),fetched:n};try{null==r||r.setItem(Hr,JSON.stringify(c))}catch(u){}return c}function bn(e,t){return{discussion:e.id,updated:e.updated,name:t,author:e.author}}function yn(e,t){return Object.assign(Object.assign({},e),{source:t})}function $n(e,t){return e.map(({name:e,source:i})=>{var s;const a=t.entries.find(e=>e.id===i.discussion),o="string"==typeof i.name?i.name:void 0,r=a?function(e,t){return void 0===t||t===e.name?e.template:Object.prototype.hasOwnProperty.call(e.includes,t)?e.includes[t]:void 0}(a,o):void 0;if(!a||!r)return Object.assign({name:e,status:"gone"},a?{entry:a}:{});if("string"!=typeof i.author||!i.author||i.author!==a.author)return{name:e,status:"unverified",entry:a};const n=Date.parse(null!==(s=i.updated)&&void 0!==s?s:""),l=Date.parse(a.updated);return{name:e,status:(Number.isFinite(n)?Number.isFinite(l)&&l>n:Number.isFinite(l))?"update":"current",entry:a,latest:yn(r,bn(a,null!=o?o:a.name))}})}function wn(e){if(""===e)return[];const t=e.split("\n");return""===t[t.length-1]&&t.pop(),t}function xn(e,t){const i=wn(e),s=wn(t);let a=0;for(;a<i.length&&a<s.length&&i[a]===s[a];)a+=1;let o=i.length,r=s.length;for(;o>a&&r>a&&i[o-1]===s[r-1];)o-=1,r-=1;const n=i.slice(0,a).map(e=>({kind:"same",text:e})),l=i.slice(o).map(e=>({kind:"same",text:e}));return[...n,...kn(i.slice(a,o),s.slice(a,r)),...l]}function kn(e,t){const i=e=>({kind:"remove",text:e}),s=e=>({kind:"add",text:e});if(!e.length||!t.length||e.length*t.length>4e6)return[...e.map(i),...t.map(s)];const a=e.length,o=t.length,r=Array.from({length:a+1},()=>new Uint32Array(o+1));for(let c=a-1;c>=0;c-=1)for(let i=o-1;i>=0;i-=1)r[c][i]=e[c]===t[i]?r[c+1][i+1]+1:Math.max(r[c+1][i],r[c][i+1]);const n=[];let l=0,d=0;for(;l<a&&d<o;)e[l]===t[d]?(n.push({kind:"same",text:e[l]}),l+=1,d+=1):r[l+1][d]>=r[l][d+1]?(n.push(i(e[l])),l+=1):(n.push(s(t[d])),d+=1);for(;l<a;)n.push(i(e[l++]));for(;d<o;)n.push(s(t[d++]));return n}const jn=e`<style>
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
    /* Code reads left to right in a right-to-left dashboard too. */
    direction: ltr;
    text-align: left;
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
</style>`;function On(e){return"string"==typeof e?e:void 0===e?"":l(e)}const An={same:" ",add:"+",remove:"-"};function Sn(t,i,s,a=3){const o=xn(On(t),On(i));return function(e){return e.some(e=>"same"!==e.kind)}(o)?e`${jn}
    <div class="dcp-diff" role="figure" aria-label=${c("diff.label",void 0,s)}>
      ${function(e,t=3){const i=e.map(e=>"same"!==e.kind),s=new Array(e.length).fill(!1);e.forEach((i,a)=>{if("same"!==i.kind)for(let o=Math.max(0,a-t);o<=Math.min(e.length-1,a+t);o+=1)s[o]=!0});const a=[];let o=0;for(;o<e.length;){if(i[o]||s[o]){a.push(e[o]),o+=1;continue}let t=o;for(;t<e.length&&!i[t]&&!s[t];)t+=1;const r=t-o;1===r?a.push(e[o]):a.push({kind:"skip",count:r}),o=t}return a}(o,a).map(t=>function(t,i){return"skip"===t.kind?e`<div class="skip">${c("diff.skipped",{count:t.count},i)}</div>`:e`<div class=${t.kind}>${An[t.kind]} ${t.text}</div>`}(t,s))}
    </div>`:e`${jn}
      <p class="dcp-diff-none">${c("diff.no_change",void 0,s)}</p>`}function Cn(t,i,s){var a,o;const r=null!==(a=JSON.stringify(t))&&void 0!==a?a:"",n=null!==(o=JSON.stringify(i))&&void 0!==o?o:"";return e`
    ${Sn(t,i,s)}
    <ha-expansion-panel outlined>
      <span slot="header">${c("diff.full",void 0,s)}</span>
      <p class="dcp-diff-none">${c("diff.before",void 0,s)}</p>
      ${Lr(r,e`<ha-yaml-editor .hass=${s} .defaultValue=${t} read-only></ha-yaml-editor>`)}
      <p class="dcp-diff-none">${c("diff.after",void 0,s)}</p>
      ${Lr(n,e`<ha-yaml-editor .hass=${s} .defaultValue=${i} read-only></ha-yaml-editor>`)}
    </ha-expansion-panel>
  `}const Pn=e=>null!==e&&"object"==typeof e&&!Array.isArray(e);function En(e,t=new Set){return Array.isArray(e)?e.forEach(e=>En(e,t)):Pn(e)&&("string"==typeof e.type&&e.type.startsWith("custom:")&&t.add(e.type),Object.values(e).forEach(e=>En(e,t))),[...t].sort()}function Ln(e){if("group"in e)return"group";const t=he(e);return null!=t?t:"unknown"}const Tn=e=>{const t=e.variables;return Array.isArray(t)?t.length:Pn(t)?Object.keys(t).length:0},Nn=e=>{var t,i;const s=JSON.stringify(null!==(i=null!==(t=e.card)&&void 0!==t?t:e.group)&&void 0!==i?i:{});return s.includes('"for_each_from"')||s.includes("|repeat:")};function Mn(e,t){if("string"==typeof e.category&&e.category.trim())return e.category.trim();const i=Ln(e),s="badge"===i?"gallery.category_badges":"row"===i?"gallery.category_rows":"element"===i?"gallery.category_elements":"group"===i?"gallery.category_groups":Nn(e)?"gallery.category_repeats":"gallery.category_cards";return c(s,void 0,t)}function Vn(e,t,i,s,a,o,r,n={}){return Object.assign({key:t,source:e,name:i,title:s,description:"string"==typeof a.description?a.description:"",category:Mn(a,r),template:a,includes:o,kind:Ln(a),variables:Tn(a),repeats:Nn(a),customCards:En([a,...Object.values(o)])},n)}function Dn(e,t){var i;const s=(null!==(i=t.query)&&void 0!==i?i:"").trim().toLowerCase();return e.filter(e=>{var i;if(t.source&&e.source!==t.source)return!1;if(t.category&&e.category!==t.category)return!1;if(!s)return!0;return[e.name,e.title,e.description,null!==(i=e.author)&&void 0!==i?i:"",...e.customCards].join("\n").toLowerCase().includes(s)})}const zn=fe(ws,Object.keys(ws.states)),Fn={area:"Kitchen",area_id:"kitchen",area_name:"Kitchen",room:"Kitchen",floor:"Ground floor",floor_id:"ground_floor",label:"Evening lights",label_id:"evening",name:"Kitchen ceiling",title:"Kitchen",entity_count:2,count:3,total:3,index:1,index0:0,first:!0,last:!1,device:"Hue ceiling",device_id:"kitchen_hue"},Hn=Object.keys(ws.states);function Rn(e){if(null==e?void 0:e.length){const t=Hn.find(t=>e.includes(t.split(".")[0]));if(t)return t}return Hn[0]}const qn=e=>Array.isArray(e)?e.filter(e=>"string"==typeof e):"string"==typeof e?[e]:void 0;function In(e,t){var i,s;const a=U(e)[0];if(null==a?void 0:a.length)return a;const o=[],r=new Set,n=(()=>{try{return le(e)}catch(i){return[]}})();for(const d of n){if(!(null==d?void 0:d.name)||"default"in d)continue;const e=d.selector,t=Pn(e)&&Pn(e.entity)?e.entity:void 0,a=d.type;if(t||"entity"===a||"entity"===d.name){const e=t?null!==(i=qn(t.domain))&&void 0!==i?i:qn(null===(s=t.filter)||void 0===s?void 0:s.domain):void 0;o.push({[d.name]:Rn(e)}),r.add(d.name)}else d.name in Fn&&"name"!==d.name?(o.push({[d.name]:Fn[d.name]}),r.add(d.name)):(o.push({[d.name]:""}),r.add(d.name))}const l=new Set(n.map(e=>null==e?void 0:e.name));for(const d of function(e){const t=new Set,i=$t(null!=e?e:""),s=/\[\[([a-zA-Z_][\w.]*)/g;let a;for(;null!==(a=s.exec(i));)t.add(a[1].split(".")[0]);return[...t]}(t))r.has(d)||l.has(d)||(d in Fn?o.push({[d]:Fn[d]}):("entity"===d||d.endsWith("_entity"))&&o.push({[d]:Rn(void 0)}));return o}const Wn=["custom:decluttering-card-plus","custom:decluttering-card"];function Jn(e,t,i){if(i>4)return e;if(Array.isArray(e))return e.map(e=>Jn(e,t,i));if(!Pn(e))return e;if("string"==typeof e.type&&Wn.includes(e.type)&&"string"==typeof e.template){const s=t[e.template];if(Pn(s))try{const a="card"===he(s)?_e(s):void 0;if(a){const o=[...Array.isArray(e.variables)?e.variables:Pn(e.variables)?Object.entries(e.variables).map(([e,t])=>({[e]:t})):[],...In(s,a)],r=b(o,s,a,e.template,zn,!0);if(Pn(r))return Jn(r,t,i+1)}}catch(a){}return e}const s={};for(const[o,r]of Object.entries(e))s[o]=Jn(r,t,i);return s}function Un(e,t={}){if("card"!==e.kind&&"group"!==e.kind)return;const i=e.template;try{const s="group"===e.kind?function(e){const t=e.group;return(Array.isArray(t)?t:Pn(t)&&Array.isArray(t.cards)?t.cards:[])[0]}(i):_e(i);if(!s)return;const a=In(i,s),o=b(a,i,s,e.name,zn,!0);if(!Pn(o)||"string"!=typeof o.type)return;const{for_each_from:r,for_each:n}=o,l=ci(o,["for_each_from","for_each"]),d=Jn(l,Object.assign(Object.assign(Object.assign({},t),e.includes),{[e.name]:e.template}),0);return Pn(d)?d:l}catch(s){return}}function Bn(e){if(e)return Object.assign(Object.assign({},e),{states:Object.assign({},ws.states),entities:Object.assign({},ws.entities),devices:Object.assign({},ws.devices),areas:Object.assign({},ws.areas),floors:Object.assign({},ws.floors)})}const Kn=e=>null!==e&&"object"==typeof e&&!Array.isArray(e),Zn=/^\s*\[\[\[\s*return\s+variables(?:\.([A-Za-z_$][\w$]*)|\[\s*['"]([^'"]+)['"]\s*\])\s*;?\s*\]\]\]\s*$/,Yn=/\[\[\[[\s\S]*?\]\]\]/,Gn=/\bvariables(?:\s*\.\s*([A-Za-z_$][\w$]*)|\s*\[\s*['"]([^'"]+)['"]\s*\])/g;function Qn(e,t,i){var s,a;if("string"==typeof e){const o=Zn.exec(e);if(o){const e=null!==(s=o[1])&&void 0!==s?s:o[2];return t.plain.add(e),`[[${e}]]`}if(Yn.test(e)){t.kept.push(i),Gn.lastIndex=0;for(let i=Gn.exec(e);i;i=Gn.exec(e))t.js.add(null!==(a=i[1])&&void 0!==a?a:i[2])}return e}if(Array.isArray(e))return e.map((e,s)=>Qn(e,t,`${i}[${s}]`));if(Kn(e)){const s={};for(const[a,o]of Object.entries(e))s[a]=Qn(o,t,i?`${i}.${a}`:a);return s}return e}const Xn=e=>(Array.isArray(e)?e:void 0!==e?[e]:[]).filter(e=>"string"==typeof e);function el(e,t,i,s){if(Kn(t.variables)&&e in t.variables)return!0;for(const a of Xn(t.template))if(!s.has(a)&&Kn(i[a])&&(s.add(a),el(e,i[a],i,s)))return!0;return!1}function tl(e,t,i,s){const a=Object.keys(i),{variables:o,template:r}=t,n=ci(t,["variables","template"]),l={plain:new Set,js:new Set,kept:[]},d=Qn(Object.assign({type:"custom:button-card"},n),l,"");if(l.js.size){const e={};for(const t of l.js)e[t]=`[[${t}]]`;d.variables=e}const h=[];if(Kn(o))for(const[c,m]of Object.entries(o))h.push(null==m?{name:c}:{name:c,default:m});for(const c of[...l.plain,...l.js])h.some(e=>e.name===c)||el(c,t,i,new Set([e]))||h.push({name:c});const u={},p=Xn(r);if(p.length){const t=p.filter(e=>a.includes(e)),i=p.filter(e=>!a.includes(e));t.length&&(u.extends=1===t.length?t[0]:t),i.length&&s.push(c("convert.parent_unknown",{name:e,parents:i.join(", ")}))}return h.length&&(u.variables=h),u.card=d,l.kept.length&&s.push(c("convert.js_kept",{name:e,count:l.kept.length,paths:l.kept.join(", ")})),u}const il=["variables","styles","show_name","show_icon","show_state","tap_action","icon","entity","name","template","state","custom_fields","label","color","color_type","size","aspect_ratio"];function sl(e){return(void 0===e.type||"custom:button-card"===e.type)&&(void 0===e.card&&void 0===e.row&&void 0===e.badge&&Object.keys(e).some(e=>il.includes(e)))}const al={domain:"domain",area:"area",floor:"floor",label:"label",integration:"integration",device_class:"device_class",entity_category:"entity_category",hidden:"include_hidden"},ol=["state","attributes","last_changed","last_updated","last_triggered","not","or","and"],rl="converted_rows",nl=/\bthis\.entity_id\b/g;function ll(e){if("string"==typeof e)return e.replace(nl,"[[entity]]");if(Array.isArray(e))return e.map(ll);if(Kn(e)){const t={};for(const[i,s]of Object.entries(e))t[i]=ll(s);return t}return e}function dl(e,t=new Set){return Array.isArray(e)?e.forEach(e=>dl(e,t)):Kn(e)&&("string"==typeof e.type&&e.type.startsWith("custom:")&&t.add(e.type),Object.values(e).forEach(e=>dl(e,t))),[...t].sort()}function cl(e){var t;return null!==(t=function(e){var t;if(!Kn(e)||"custom:auto-entities"!==e.type)return;const i=[],s=[],a=Kn(e.filter)?e.filter:{},o=Array.isArray(a.include)?a.include.filter(Kn):[],r=Array.isArray(a.exclude)?a.exclude.filter(Kn):[],n={};o.length>1&&i.push(c("convert.many_includes",{count:o.length}));const l=null!==(t=o[0])&&void 0!==t?t:{};for(const[y,$]of Object.entries(l))"entity_id"===y?n.entities=$:y in al?n[al[y]]=$:"options"===y||(ol.includes(y)?s.push(c("convert.state_filter_dropped",{key:y,value:JSON.stringify($)})):s.push(c("convert.filter_unknown",{key:y})));void 0===n.entities&&(n.entities=!0);const d=r.map(e=>"string"==typeof e.entity_id?e.entity_id:void 0).filter(e=>void 0!==e);for(const y of r)"string"!=typeof y.entity_id&&s.push(c("convert.exclude_dropped",{rule:JSON.stringify(y)}));d.length&&(n.exclude=d);const h=Kn(e.sort)?e.sort:void 0;h&&("name"===h.method||"friendly_name"===h.method?n.sort="name":"entity_id"===h.method?n.sort="entity_id":void 0!==h.method&&s.push(c("convert.sort_dropped",{method:String(h.method)})),!0===h.reverse&&(n.reverse=!0),"number"==typeof h.count&&(n.limit=h.count)),!1===e.show_empty&&i.push(c("convert.show_empty"));const u=Kn(l.options)?ll(l.options):{},p=Kn(e.card)?e.card:{type:"entities"},m="string"==typeof e.card_param&&e.card_param?e.card_param:"entities",v=p,_=m;v[_];const f=ci(v,["symbol"==typeof _?_:_+""]),g={variables:[{name:"source",default:n}],let:{row:Object.assign({entity:"[[entity]]"},u)},card:Object.assign(Object.assign({type:"entities"},f),{[m]:["[[row|repeat:source]]"]})},b={type:"custom:decluttering-card-plus",template:rl};return i.push("entities"===p.type||void 0===p.type?c("convert.rows_repeat"):c("convert.list_repeat",{key:m})),{templates:{[rl]:g},card:b,from:"auto-entities",notes:i,dropped:s,needs:dl([p,u])}}(e))&&void 0!==t?t:function(e){if(!Kn(e))return;let t;if(Kn(e.button_card_templates)?t=e.button_card_templates:sl(e)?t={converted:e}:Object.values(e).length&&Object.values(e).every(e=>Kn(e)&&sl(e))&&(t=e),!t||!Object.keys(t).length)return;const i=[],s=Object.keys(t),a={};for(const o of s)a[o]=tl(o,t[o],t,i);return{templates:a,from:"button-card",notes:i,dropped:[],needs:["custom:button-card"]}}(e)}function hl(e){const[t,...i]=Object.keys(e.templates),s=Object.assign({template:t},e.templates[t]);if(i.length){const t={};for(const s of i)t[s]=e.templates[s];s.includes=t}return s}function ul(e){if(!e||"object"!=typeof e)return{};const t=Object.assign({},e);return delete t.template,delete t.type,t}const pl=["readme","related","setup","requires_entities","requires_homeassistant","requires_card"];class ml extends r{constructor(){super(...arguments),this._importParses=!0,this._importErrors=[],this._importArmedAt=0,this._copyState="",this._galleryOpen=!1,this._convertParses=!0,this._conversionKey=0,this._convertArmedAt=0,this._convertTried=!1,this._convertCopyState="",this._busy=!1,this._libraryDestination="view",this._communityLoading=!1,this._communityKnownFailed=!1,this._installArmedAt=0,this._postCopyState="",this._setupValues={},this._updatesLoading=!1,this._updateArmedAt=0,this._comparePending=!1,this._compareArmedAt=0,this._trashArmedAt=0}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=H())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:se()}static get styles(){return Er}_fireConfigChanged(e){M(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return co(this,e,t,i)}render(){return this.hass&&this._config?this._renderShare():e``}updated(e){var t;if(super.updated(e),e.has("_updates")){const e=(null!==(t=this._updates)&&void 0!==t?t:[]).filter(e=>"update"===e.status).length;this.dispatchEvent(new CustomEvent("updates-found",{detail:e,bubbles:!0,composed:!0}))}}async _loadTrash(){this.hass&&(this._trash=await hi(this.hass))}_renderShare(){const{payload:t,notes:i}=tr(this._config,re(this._savedLovelace));return e`
      <div class="share">
        ${this._renderDetails()}
        <h3>${c("share.export_header",void 0,this.hass)}</h3>
        <p class="hint">${c("share.export_hint",void 0,this.hass)}</p>
        ${i.map(t=>e`<ha-alert alert-type="info">${t}</ha-alert>`)}
        <ha-yaml-editor id="export" .hass=${this.hass} .defaultValue=${t} read-only></ha-yaml-editor>
        <ha-button @click=${this._copyExport}>
          ${"done"===this._copyState?c("share.copied",void 0,this.hass):"failed"===this._copyState?c("share.copy_failed",void 0,this.hass):c("share.copy",void 0,this.hass)}
        </ha-button>
        <ha-button @click=${this._downloadExport}> ${c("share.download",void 0,this.hass)} </ha-button>
        <ha-button @click=${this._copyPost}>
          ${"done"===this._postCopyState?c("share.copied",void 0,this.hass):"failed"===this._postCopyState?c("share.copy_failed",void 0,this.hass):c("share.post_copy",void 0,this.hass)}
        </ha-button>
        <p class="hint">
          ${c("share.post_hint",void 0,this.hass)}
          <a href=${Fr} target="_blank" rel="noopener noreferrer"
            >${c("share.post_open",void 0,this.hass)}</a
          >
        </p>

        <h3>${c("share.import_header",void 0,this.hass)}</h3>
        <p class="hint">${c("share.import_hint",void 0,this.hass)}</p>
        <ha-yaml-editor id="import" .hass=${this.hass} @value-changed=${this._importChanged}></ha-yaml-editor>
        <input
          id="import-file"
          type="file"
          accept=".yaml,.yml,.json,text/yaml,application/json"
          hidden
          @change=${this._importFile}
        />
        <ha-button @click=${()=>{var e;return null===(e=this.renderRoot.querySelector("#import-file"))||void 0===e?void 0:e.click()}}>
          ${c("share.import_file",void 0,this.hass)}
        </ha-button>
        ${this._importErrors.map(t=>e`<ha-alert alert-type="error">${t}</ha-alert>`)}
        ${this._renderImportDetails()}
        ${this._importClash?e`<ha-alert alert-type="warning">
                ${c("share.import_clash",{name:this._importClash},this.hass)}
              </ha-alert>`:e``}
        ${this._importRisks?this._renderRisks(this._importRisks,"share.import_risks"):e``}
        <ha-button @click=${this._import}>
          ${c(this._importClash||this._importRisks?"share.import_anyway":"share.import",void 0,this.hass)}
        </ha-button>
        ${this._importClash?e`<ha-button @click=${this._importAsCopy}>
                ${c("share.import_copy",void 0,this.hass)}
              </ha-button>`:e``}
        ${this._renderConvert()} ${this._renderTrash()} ${this._renderCompare()}

        <h3>${c("share.library_header",void 0,this.hass)}</h3>
        <p class="hint">${c("share.library_hint",void 0,this.hass)}</p>
        <ha-button
          @click=${()=>{this._galleryOpen=!0}}
        >
          ${c("gallery.open",void 0,this.hass)}
        </ha-button>
        ${this._renderGallery()} ${this._renderLibrary()}

        <h3>${c("share.community_header",void 0,this.hass)}</h3>
        <p class="hint">${c("share.community_hint",void 0,this.hass)}</p>
        ${this._renderCommunity()} ${this._renderInstalled()}
        ${this._toolError?e`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:e``}
      </div>
    `}_renderDetails(){var t,i,s,a;const o=this._config,r=function(e){const t=e&&"object"==typeof e?e:{},i=t.author&&"object"==typeof t.author&&!Array.isArray(t.author)?t.author:void 0,s=t.requires&&"object"==typeof t.requires&&!Array.isArray(t.requires)?t.requires:{},a={author_name:qo(i?i.name:t.author),author_github:qo(null==i?void 0:i.github),author_email:qo(null==i?void 0:i.email),author_url:qo(null==i?void 0:i.url),license:qo(t.license),help:qo(t.help),homepage:qo(t.homepage),readme:qo(t.readme),related:Io(t.related),setup:Io(t.setup),requires_integrations:Io(s.integrations),requires_entities:Io(s.entities),requires_custom_cards:Io(s.custom_cards),requires_homeassistant:qo(s.homeassistant),requires_card:qo(s.card)};for(const o of Object.keys(a))void 0===a[o]&&delete a[o];return a}(o),n=e=>[...new Set(e)].sort().map(e=>({value:e,label:e})),l=e=>({select:{multiple:!0,custom_value:!0,options:n(e)}}),d=Object.keys(re(this._savedLovelace)).filter(e=>e!==o.template),h=[...le(o).map(e=>e.name),...null!==(t=r.setup)&&void 0!==t?t:[]],u=(Array.isArray(null===(s=null===(i=this.hass)||void 0===i?void 0:i.config)||void 0===s?void 0:s.components)?this.hass.config.components:[]).filter(e=>!e.includes(".")),p=(null!==(a=window.customCards)&&void 0!==a?a:[]).map(e=>e.type).filter(e=>"string"==typeof e),m=(e,t)=>({name:e,selector:t}),v=[m("author_name",{text:{}}),m("author_github",{text:{}}),m("author_email",{text:{}}),m("author_url",{text:{type:"url"}}),m("license",{text:{}}),m("help",{text:{type:"url"}}),m("homepage",{text:{type:"url"}}),m("readme",{text:{multiline:!0}}),m("related",l(d)),m("setup",l(h)),m("requires_integrations",l(u)),m("requires_entities",l([])),m("requires_custom_cards",l(p)),m("requires_homeassistant",{text:{}}),m("requires_card",{text:{}})];return e`
      <ha-expansion-panel outlined class="details">
        <span slot="header">${c("share.details_header",void 0,this.hass)}</span>
        <p class="hint">${c("share.details_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${r}
          .schema=${v}
          .computeLabel=${e=>c(`share.details_${e.name}`,void 0,this.hass)}
          .computeHelper=${e=>pl.includes(e.name)?c(`share.details_${e.name}_helper`,void 0,this.hass):""}
          @value-changed=${this._detailsChanged}
        ></ha-form>
      </ha-expansion-panel>
    `}_detailsChanged(e){if(e.stopPropagation(),!this._config)return;const t=function(e,t){var i;const s=Object.assign({},e),a=(e,t)=>{void 0===t||Array.isArray(t)&&!t.length?delete s[e]:s[e]=t},o={},r=Wo(t.author_name);r&&(o.name=r);for(const c of["github","email","url"]){const e=Wo(t[`author_${c}`]);e&&(o[c]=e)}const n=e.author&&"object"==typeof e.author&&!Array.isArray(e.author)?e.author:{};for(const[c,h]of Object.entries(n))["name","github","email","url"].includes(c)||(o[c]=h);const l=Object.keys(o);a("author",l.length?1===l.length&&r?r:o:void 0);for(const c of["license","help","homepage"])a(c,Wo(t[c]));a("readme","string"==typeof t.readme&&t.readme.trim()?t.readme:void 0),a("related",Jo(t.related)),a("setup",Jo(t.setup));const d=e.requires&&"object"==typeof e.requires&&!Array.isArray(e.requires)?Object.assign({},e.requires):{};for(const[c,h]of Object.entries(Ro)){const e=[].concat(null!==(i=d[c])&&void 0!==i?i:[]).filter(e=>"string"!=typeof e),s=[...Jo(t[h]),...e];s.length?d[c]=s:delete d[c]}for(const c of["homeassistant","card"]){const e=Wo(t[`requires_${c}`]);e?d[c]=e:delete d[c]}return a("requires",Object.keys(d).length?d:void 0),s}(this._config,e.detail.value);this._fireConfigChanged(t)}_renderCommunity(){const t=this._community,i=e`
      ${this._communityError?e`<ha-alert alert-type="warning">${this._communityError}</ha-alert>`:e``}
      ${this._communityError&&t?e`<p class="hint">
              ${c("share.community_showing_cached",{time:(e=>{var t,i;return new Date(e).toLocaleString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)})(t.fetched)},this.hass)}
            </p>`:e``}
    `;if(!t)return e`
        <div class="library">
          ${i}
          <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!1)}}>
            ${c(this._communityLoading?"share.community_loading":"share.community_load",void 0,this.hass)}
          </ha-button>
        </div>
      `;const s=this._communityExisting(),a=t.entries.find(e=>e.id===this._communitySelected),o=a?`community:${a.id}:${a.updated}`:"",r=!!a&&this._installPending===o,n=a&&s.includes(a.name)?ar(a.name,s):void 0,l=a?function(e,t){const i=new Set,s=new Set;for(const a of[e.template,...Object.values(e.includes)]){const e=Yo(a);e.customTypes.forEach(e=>i.add(e)),e.templateRefs.forEach(e=>s.add(e))}return{customTypes:[...i].sort(),templates:[...s].filter(i=>i!==e.name&&!(i in e.includes)&&!t.includes(i)).sort()}}(a,s):void 0,d=a?Object.keys(a.includes).filter(e=>!s.includes(e)):[],h=a?mn(a):void 0,u=void 0!==this._communityKnown;return e`
      <div class="library">
        ${i}
        ${t.entries.length?e`<ha-form
                .hass=${this.hass}
                .data=${{entry:a?String(a.id):""}}
                .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:t.entries.map(e=>({value:String(e.id),label:c("share.community_by",{title:e.title,author:e.author},this.hass)}))}}}]}
                .computeLabel=${()=>c("share.community_pick",void 0,this.hass)}
                @value-changed=${this._communityPicked}
              ></ha-form>`:e`<p class="hint">${c("share.community_none",void 0,this.hass)}</p>`}
        ${a&&l?e`
                <p class="hint">
                  ${"string"==typeof a.template.description?a.template.description:""}
                  <a href=${a.url} target="_blank" rel="noopener noreferrer"
                    >${c("share.community_open",void 0,this.hass)}</a
                  >
                </p>
                ${this._renderAbout(a.template)}
                ${d.length?e`<p class="hint">
                        ${c("share.library_needs",{names:d.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderUnmet([a.template,...Object.values(a.includes)])}
                ${this._renderMissingCards([a.template,...Object.values(a.includes)])}
                ${l.templates.length?e`<ha-alert alert-type="warning">
                        ${c("share.community_needs_templates",{names:l.templates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
                ${h&&ro(h)?this._renderRisks(h,"share.community_risks"):e``}
                ${this._renderSetup([a.template,...Object.values(a.includes)])}
                <ha-expansion-panel outlined expanded>
                  <span slot="header">${c("share.library_preview",void 0,this.hass)}</span>
                  ${Lr(`${a.id}:${a.updated}`,e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${Object.assign(Object.assign({template:a.name},a.template),Object.keys(a.includes).length?{includes:a.includes}:{})}
                      read-only
                    ></ha-yaml-editor>`)}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{where:this._libraryDestination}}
                  .schema=${[{name:"where",selector:{select:{mode:"dropdown",options:[{value:"view",label:c("share.library_where_view",void 0,this.hass)},{value:"root",label:c("share.library_where_root",void 0,this.hass)}]}}}]}
                  .computeLabel=${()=>c("share.library_where",void 0,this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                ${this._communityKnownFailed?e`<ha-alert alert-type="error">
                        ${c("share.community_names_failed",void 0,this.hass)}
                      </ha-alert>`:e``}
                <ha-button .disabled=${this._busy||!u} @click=${()=>{this._installShared(a)}}>
                  ${u||this._communityKnownFailed?r?c("share.install_anyway",void 0,this.hass):n?c("share.community_install_as",{name:n},this.hass):c("share.install",void 0,this.hass):c("share.community_names_loading",void 0,this.hass)}
                </ha-button>
              `:e``}
        <ha-button .disabled=${this._communityLoading} @click=${()=>{this._loadCommunity(!0)}}>
          ${c(this._communityLoading?"share.community_loading":"share.community_refresh",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderAbout(t){var i,s,a;const o=Eo(t),r=(n=o.author)?[n.name,n.github?`@${n.github}`:void 0,n.email].filter(Boolean).join(" · "):"";var n;const l=null!==(s=null===(i=o.author)||void 0===i?void 0:i.url)&&void 0!==s?s:(null===(a=o.author)||void 0===a?void 0:a.github)?`https://github.com/${o.author.github}`:void 0,d=[o.help?{url:o.help,label:c("share.about_help",void 0,this.hass)}:void 0,o.homepage?{url:o.homepage,label:c("share.about_homepage",void 0,this.hass)}:void 0].filter(e=>!!e);return r||o.license||d.length||o.readme?e`
      ${r||o.license||d.length?e`<p class="hint about">
              ${r?e`<span
                      >${c("share.about_author",void 0,this.hass)}
                      ${l?e`<a href=${l} target="_blank" rel="noopener noreferrer">${r}</a>`:r}</span
                    >`:e``}
              ${o.license?e`<span>${c("share.about_license",{license:o.license},this.hass)}</span>`:e``}
              ${d.map(t=>e`<a href=${t.url} target="_blank" rel="noopener noreferrer">${t.label}</a>`)}
            </p>`:e``}
      ${o.readme?e`<ha-expansion-panel outlined>
              <span slot="header">${c("share.about_readme",void 0,this.hass)}</span>
              <ha-markdown class="readme" .content=${o.readme}></ha-markdown>
            </ha-expansion-panel>`:e``}
    `:e``}_renderUnmet(t){const i=t.filter(e=>void 0!==e),s=new Set(rr(i,Ee)),a=function(e,t){const i=new Set,s=[];for(const a of e)for(const e of Vo(a)){const a=`${e.kind}:${e.any.join("|")}`;if(i.has(a))continue;if(i.add(a),zo(e,t))continue;const o="homeassistant"===e.kind?t.homeassistant:"card"===e.kind?t.card:void 0;s.push(o?Object.assign(Object.assign({},e),{have:o}):e)}return s}(i,(o=this.hass,r=wi,n=Ee,{components:Array.isArray(null===(l=null==o?void 0:o.config)||void 0===l?void 0:l.components)?o.config.components:[],entities:Object.keys(null!==(d=null==o?void 0:o.states)&&void 0!==d?d:{}),homeassistant:"string"==typeof(null===(h=null==o?void 0:o.config)||void 0===h?void 0:h.version)?o.config.version:void 0,card:r,isDefined:n})).filter(e=>!("custom_card"===e.kind&&!e.message&&e.any.every(e=>s.has(e))));var o,r,n,l,d,h;return a.length?e`<ha-alert alert-type="warning" .title=${c("share.requires_header",void 0,this.hass)}>
      <ul class="risks">
        ${a.map(t=>e`<li>${this._unmetLine(t)}</li>`)}
      </ul>
      ${c("share.requires_hint",void 0,this.hass)}
    </ha-alert>`:e``}_unmetLine(e){var t;const i=c("share.requires_or",void 0,this.hass),s=c(`share.requires_${e.kind}`,{names:e.any.join(i),want:e.any[0],have:null!==(t=e.have)&&void 0!==t?t:"?"},this.hass);return e.message?`${s}: ${e.message}`:s}_renderSetup(t){const i=t.filter(e=>void 0!==e),s=function(e){const t=[];for(const i of e)for(const e of Eo(i).setup)t.includes(e)||t.push(e);return t}(i);if(!s.length)return e``;const a=e=>{if(e in this._setupValues)return this._setupValues[e];for(const t of i){const i=Fo(t,e);if(void 0!==i)return i}return""};return e`
      <h4>${c("share.setup_header",void 0,this.hass)}</h4>
      <p class="hint">${c("share.setup_hint",void 0,this.hass)}</p>
      <ha-form
        .hass=${this.hass}
        .data=${s.reduce((e,t)=>Object.assign(Object.assign({},e),{[t]:a(t)}),{})}
        .schema=${s.map(e=>({name:e,selector:{text:{}}}))}
        .computeLabel=${e=>e.name}
        @value-changed=${this._setupChanged}
      ></ha-form>
    `}_setupChanged(e){var t;e.stopPropagation();const i={};for(const[s,a]of Object.entries(null!==(t=e.detail.value)&&void 0!==t?t:{}))i[s]=null==a?"":String(a);this._setupValues=i}_keptSetup(e){const t={};for(const i of Eo(e).setup){const s=Fo(e,i);void 0!==s&&(t[i]=s)}return t}_renderRisks(t,i){return e`<ha-alert alert-type="warning" .title=${c(i,void 0,this.hass)}>
      <ul class="risks">
        ${t.actions.length?e`<li>${c("share.community_risk_actions",{list:t.actions.join(", ")},this.hass)}</li>`:e``}
        ${t.urls.length?e`<li>${c("share.community_risk_urls",{list:t.urls.join(", ")},this.hass)}</li>`:e``}
        ${t.embeds?e`<li>${c("share.community_risk_embeds",void 0,this.hass)}</li>`:e``}
        ${t.scripts?e`<li>${c("share.community_risk_scripts",void 0,this.hass)}</li>`:e``}
        ${t.placeholders?e`<li>${c("share.community_risk_placeholders",void 0,this.hass)}</li>`:e``}
        ${t.overlay?e`<li>${c("share.community_risk_overlay",void 0,this.hass)}</li>`:e``}
      </ul>
    </ha-alert>`}async _loadCommunity(e){var t,i;this._communityLoading=!0,this._communityError=void 0,this._installPending=void 0,this._communityKnown=void 0,this._communityKnownFailed=!1;try{this._community=await gn({refresh:e})}catch(s){const e=s;e.cached&&(this._community=e.cached),this._communityError=e.retryAt?c("share.community_rate_limited",{time:new Date(e.retryAt).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)},this.hass):c("share.community_failed",{message:e.message},this.hass)}finally{this._communityLoading=!1}this._community&&this._loadCommunityKnown()}_communityExisting(){var e;const t=Object.keys(re(this._savedLovelace));return[...new Set([...t,...null!==(e=this._communityKnown)&&void 0!==e?e:[]])]}async _loadCommunityKnown(){try{const e=await ut(this.hass,this._savedLovelace);this._communityKnown=Object.keys(e)}catch(e){this._communityKnownFailed=!0}}_communityPicked(e){e.stopPropagation();const t=Number(e.detail.value.entry);this._communitySelected=Number.isFinite(t)&&t>0?t:void 0,this._installPending=void 0,this._setupValues={}}async _installShared(e){var t,i,s,a,o;if(void 0===this._communityKnown)return;const r=`community:${e.id}:${e.updated}`;if(this._installPending!==r)return this._installPending=r,void(this._installArmedAt=Date.now());if(Date.now()-this._installArmedAt<no)return;const n=H(),l=this._communityExisting(),d=l.includes(e.name)?ar(e.name,l):e.name,c=[...Object.entries(e.includes).filter(([e])=>!l.includes(e)).map(([t,i])=>[t,yn(Ho(i,this._setupValues),bn(e,t))]),[d,yn(Ho(e.template,this._setupValues),bn(e,e.name))]],h=Ve(null!==(t=null==n?void 0:n.config)&&void 0!==t?t:this.lovelace,null!==(s=null===(i=this._config)||void 0===i?void 0:i.template)&&void 0!==s?s:""),u=null!==(o=null===(a=null==h?void 0:h.view)||void 0===a?void 0:a.index)&&void 0!==o?o:0;await this._saveDashboard(e=>c.reduce((e,[t,i])=>"root"===this._libraryDestination?ui(e,t,i):pi(e,u,Object.assign({type:At,template:t},i,{type:At,template:t})),e),"community_install")&&(this._installPending=void 0,this._setupValues={})}_renderMissingCards(t){const i=rr(t.filter(e=>void 0!==e),Ee);return i.length?e`<ha-alert alert-type="warning">
      ${c(1===i.length?"share.missing_card_one":"share.missing_card_many",{cards:i.join(", ")},this.hass)}
    </ha-alert>`:e``}_renderInstalled(){var t;const i=mi(this._savedLovelace);if(!i.length)return e``;const s=new Map((null!==(t=this._updates)&&void 0!==t?t:[]).map(e=>[e.name,e]));return e`
      <h3>${c("share.installed_header",void 0,this.hass)}</h3>
      <p class="hint">${c("share.installed_hint",void 0,this.hass)}</p>
      ${this._updatesError?e`<ha-alert alert-type="warning">${this._updatesError}</ha-alert>`:e``}
      <ul class="installed">
        ${i.map(({name:t,source:i,template:a})=>{var o,r;const n=s.get(t);return e`<li>
            ${t} —
            <a
              href=${null!==(r=null===(o=null==n?void 0:n.entry)||void 0===o?void 0:o.url)&&void 0!==r?r:`https://github.com/${Dr}/discussions/${i.discussion}`}
              target="_blank"
              rel="noopener noreferrer"
              >${c("share.installed_from",{discussion:i.discussion},this.hass)}</a
            >
            ${n?e`<span class="status"
                    >${c(`share.installed_status_${n.status}`,void 0,this.hass)}</span
                  >`:e``}
            ${"update"===(null==n?void 0:n.status)&&n.latest?this._renderUpdate(t,a,n):e``}
          </li>`})}
      </ul>
      <ha-button .disabled=${this._updatesLoading} @click=${()=>{this._checkUpdates()}}>
        ${c(this._updatesLoading?"share.community_loading":"share.installed_check",void 0,this.hass)}
      </ha-button>
    `}_renderUpdate(t,i,s){const a=Ho(s.latest,this._keptSetup(i)),o=e=>{const t=Object.assign({},e);return delete t.source,delete t.type,delete t.template,t},r=o(i),n=o(a),l=mn({template:n,includes:{}}),d=function(e,t){return{actions:e.actions.filter(e=>!t.actions.includes(e)),urls:e.urls.filter(e=>!t.urls.includes(e)),embeds:e.embeds&&!t.embeds,scripts:e.scripts&&!t.scripts,placeholders:e.placeholders&&!t.placeholders,overlay:e.overlay&&!t.overlay}}(l,mn({template:r,includes:{}})),h=this._updatePending===t;return e`
      <p class="hint">${c("share.installed_compare",void 0,this.hass)}</p>
      ${Cn(r,n,this.hass)} ${this._renderMissingCards([a])} ${this._renderUnmet([a])}
      ${ro(d)?this._renderRisks(d,"share.installed_risks_new"):ro(l)?this._renderRisks(l,"share.installed_risks"):e``}
      ${h?e`<ha-alert alert-type="warning">
              ${c("share.installed_update_confirm",{name:t},this.hass)}
            </ha-alert>`:e``}
      <ha-button .disabled=${this._busy} @click=${()=>{this._updateShared(t,a)}}>
        ${c(h?"share.installed_update_anyway":"share.installed_update",void 0,this.hass)}
      </ha-button>
    `}async _checkUpdates(){var e,t;this._updatesLoading=!0,this._updatesError=void 0,this._updatePending=void 0;const i=mi(this._savedLovelace);try{this._updates=$n(i,await gn({refresh:!0}))}catch(s){const i=s;this._updatesError=i.retryAt?c("share.community_rate_limited",{time:new Date(i.retryAt).toLocaleTimeString(null===(t=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===t?void 0:t.language)},this.hass):c("share.community_failed",{message:i.message},this.hass)}finally{this._updatesLoading=!1}}async _updateShared(e,t){var i,s,a;if(this._updatePending!==e)return this._updatePending=e,void(this._updateArmedAt=Date.now());if(Date.now()-this._updateArmedAt<no)return;const o=(null===(i=this._config)||void 0===i?void 0:i.template)===e?this._config:void 0;await this._saveDashboard(i=>vi(i,e,t),"shared_update",o)&&(this._updatePending=void 0,this._updates=null===(s=this._updates)||void 0===s?void 0:s.map(t=>t.name===e?Object.assign(Object.assign({},t),{status:"current"}):t),(null===(a=this._config)||void 0===a?void 0:a.template)===e&&this._fireConfigChanged(Object.assign(Object.assign({},t),{type:this._config.type,template:e})))}_renderCompare(){var t;const i=this._config;if(!(null==i?void 0:i.template))return e``;const s=i.template,a=function(e,t){var i,s,a,o,r,n;const l=[],d=e=>({id:`library:${e.name}`,kind:"library",label:t.labels.library(e.name),template:e.template});for(const h of null!==(i=t.library)&&void 0!==i?i:[])h.name===e&&l.push(d(h));for(const h of null!==(s=t.installed)&&void 0!==s?s:[])h.name===e&&h.latest&&h.entry&&l.push({id:`shared:${h.entry.id}`,kind:"shared",label:t.labels.shared(h.entry.title,h.entry.author),template:ul(h.latest)});for(const h of null!==(a=t.elsewhere)&&void 0!==a?a:[])l.push({id:`elsewhere:${h.urlPath}`,kind:"elsewhere",label:t.labels.elsewhere(h.urlPath),template:ul(h.template)});const c=null!==(o=t.now)&&void 0!==o?o:Date.now();for(const h of[...null!==(r=t.trash)&&void 0!==r?r:[]].filter(t=>t.name===e).sort((e,t)=>t.at-e.at))l.push({id:`trash:${h.at}`,kind:"trash",label:t.labels.trash(t.labels.ago(c-h.at),h.reason),template:ul(h.template)});for(const h of null!==(n=t.library)&&void 0!==n?n:[])h.name!==e&&l.push(d(h));return l}(s,{library:Tr,installed:this._updates,trash:this._trash,labels:{library:e=>c("compare.source_library",{name:e},this.hass),shared:(e,t)=>c("compare.source_shared",{title:e,author:t},this.hass),elsewhere:e=>c("compare.source_elsewhere",{dashboard:e},this.hass),trash:(e,t)=>c(`compare.source_trash_${t}`,{when:e},this.hass),ago:e=>{const t=function(e){const t=Math.max(0,Math.round(e/6e4));if(t<60)return{count:t,unit:"minute"};const i=Math.round(t/60);return i<48?{count:i,unit:"hour"}:{count:Math.round(i/24),unit:"day"}}(e);return c(`compare.ago_${t.unit}`,{count:t.count},this.hass)}}});if(!a.length)return e``;const o=null!==(t=a.find(e=>e.id===this._compareWith))&&void 0!==t?t:a[0],r=ul(i),n=function(e,t){const i=xn(l(ul(t)),l(ul(e)));let s=0,a=0,o=0,r=!1;for(const n of i){"add"===n.kind&&(s+=1),"remove"===n.kind&&(a+=1);const e="same"!==n.kind;e&&!r&&(o+=1),r=e}return{added:s,removed:a,places:o}}(r,o.template);return e`
      <div class="compare">
        <h3>${c("compare.header",void 0,this.hass)}</h3>
        <p class="hint">${c("compare.hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${{source:o.id}}
          .schema=${[{name:"source",label:c("compare.with",void 0,this.hass),selector:{select:{mode:"dropdown",options:a.map(e=>({value:e.id,label:e.label}))}}}]}
          .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
          @value-changed=${e=>{e.stopPropagation(),this._compareWith=e.detail.value.source,this._comparePending=!1}}
        ></ha-form>
        <p class="stats">
          ${c("compare.against",{name:s,label:o.label},this.hass)}
          <span class="add">+${n.added}</span> <span class="remove">−${n.removed}</span>
          ${c("compare.places",{places:n.places},this.hass)}
        </p>
        ${Cn(o.template,r,this.hass)}
        ${n.added||n.removed?e`<ha-button .disabled=${this._busy} @click=${()=>{this._takeVersion(s,o)}}>
                ${c(this._comparePending?"compare.take_confirm":"compare.take",void 0,this.hass)}
              </ha-button>`:e``}
      </div>
    `}async _takeVersion(e,t){var i,s;if(!this._comparePending)return this._comparePending=!0,void(this._compareArmedAt=Date.now());if(Date.now()-this._compareArmedAt<no)return;const a=t.template,o=(null===(i=this._config)||void 0===i?void 0:i.template)===e?this._config:void 0;await this._saveDashboard(t=>vi(t,e,a),"compare_take",o)&&(this._comparePending=!1,(null===(s=this._config)||void 0===s?void 0:s.template)===e&&this._fireConfigChanged(Object.assign(Object.assign({},a),{type:this._config.type,template:e})))}_renderLibrary(){var t;const i=Object.keys(re(this._savedLovelace)),s=this._librarySelected?Nr(this._librarySelected):void 0,a=!!s&&i.includes(s.name),o=!!s&&this._installPending===s.name,r=s?Mr(s,i):[];return e`
      <div class="library">
        <ha-form
          .hass=${this.hass}
          .data=${{entry:null!==(t=this._librarySelected)&&void 0!==t?t:""}}
          .schema=${[{name:"entry",selector:{select:{mode:"dropdown",options:Tr.map(e=>({value:e.name,label:e.name}))}}}]}
          .computeLabel=${()=>c("share.library_pick",void 0,this.hass)}
          @value-changed=${this._libraryPicked}
        ></ha-form>
        ${s?e`
                <p class="hint">${c(`library.${s.name}.summary`,void 0,this.hass)}</p>
                ${r.length?e`<p class="hint">
                        ${c("share.library_needs",{names:r.join(", ")},this.hass)}
                      </p>`:e``}
                ${this._renderMissingCards([s,...r.map(e=>Nr(e))].map(e=>null==e?void 0:e.template))}
                <ha-expansion-panel outlined>
                  <span slot="header">${c("share.library_preview",void 0,this.hass)}</span>
                  ${Lr(s.name,e`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${s.template}
                      read-only
                    ></ha-yaml-editor>`)}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{where:this._libraryDestination}}
                  .schema=${[{name:"where",selector:{select:{mode:"dropdown",options:[{value:"view",label:c("share.library_where_view",void 0,this.hass)},{value:"root",label:c("share.library_where_root",void 0,this.hass)}]}}}]}
                  .computeLabel=${()=>c("share.library_where",void 0,this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                <ha-button .disabled=${this._busy||a} @click=${()=>{this._install(s.name)}}>
                  ${c(a?"share.already_here":o?"share.install_anyway":"share.install",void 0,this.hass)}
                </ha-button>
              `:e``}
      </div>
    `}_libraryDestinationPicked(e){e.stopPropagation();const t=e.detail.value.where;this._libraryDestination="root"===t?"root":"view"}_libraryPicked(e){e.stopPropagation(),this._librarySelected=e.detail.value.entry||void 0,this._installPending=void 0}async _install(e){var t,i,s,a,o,r;const n=Nr(e);if(!n)return;if(this._installPending!==e)return void(this._installPending=e);const l=H(),d=Object.keys(re(null!==(t=null==l?void 0:l.config)&&void 0!==t?t:this._savedLovelace)),c=[...Mr(n,d),n.name].filter(e=>!d.includes(e)),h=Ve(null!==(i=null==l?void 0:l.config)&&void 0!==i?i:this.lovelace,null!==(a=null===(s=this._config)||void 0===s?void 0:s.template)&&void 0!==a?a:""),u=null!==(r=null===(o=null==h?void 0:h.view)||void 0===o?void 0:o.index)&&void 0!==r?r:0;await this._saveDashboard(e=>c.reduce((e,t)=>{const i=Nr(t);if(!i)return e;const s=Object.assign(Object.assign({},i.template),{source:Vr(i.name,wi)});return"root"===this._libraryDestination?ui(e,i.name,s):pi(e,u,Object.assign({type:At,template:i.name},s))},e),"library_install")&&(this._installPending=void 0)}async _copyExport(){const e=this.renderRoot.querySelector("#export"),t=null==e?void 0:e.yaml;if(!t)return;const{notes:i}=tr(this._config,re(this._savedLovelace)),s=[...i.map(e=>`# ${e}`),t].join("\n");this._copyState=await Ce(s)?"done":"failed",ho(this,c("done"===this._copyState?"share.copied":"share.copy_failed",void 0,this.hass)),setTimeout(()=>this._copyState="",3e3)}async _copyPost(){var e,t;const i=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!i)return;const{notes:s}=tr(this._config,re(this._savedLovelace));this._postCopyState=await Ce(function(e,t,i){return[...[i,...t].filter(e=>"string"==typeof e&&e.trim()),"```yaml\n"+e.replace(/\n*$/,"")+"\n```"].join("\n\n")+"\n"}(i,s,null===(t=this._config)||void 0===t?void 0:t.description))?"done":"failed",ho(this,c("done"===this._postCopyState?"share.copied":"share.copy_failed",void 0,this.hass)),setTimeout(()=>this._postCopyState="",3e3)}_downloadExport(){var e,t,i;const s=null===(e=this.renderRoot.querySelector("#export"))||void 0===e?void 0:e.yaml;if(!s)return;const{notes:a}=tr(this._config,re(this._savedLovelace)),o=[...a.map(e=>`# ${e}`),s].join("\n"),r=document.createElement("a");r.href=URL.createObjectURL(new Blob([o],{type:"text/yaml"})),r.download=`${(null!==(i=null===(t=this._config)||void 0===t?void 0:t.template)&&void 0!==i?i:"template").replace(/[^\w-]+/g,"_")}.yaml`,r.click(),setTimeout(()=>URL.revokeObjectURL(r.href),1e3)}async _importFile(e){var t,i,s;const a=e.target,o=null===(t=a.files)||void 0===t?void 0:t[0];if(a.value="",!o)return;const r=await o.text(),n=null===(s=null===(i=this.renderRoot.querySelector("#import"))||void 0===i?void 0:i.shadowRoot)||void 0===s?void 0:s.querySelector("ha-code-editor");n?(n.value=r,n.dispatchEvent(new CustomEvent("value-changed",{detail:{value:r}}))):this._importErrors=[c("share.import_not_yaml",void 0,this.hass)]}_renderTrash(){if(void 0===this._trash)return this._loadTrash(),e``;const t=e=>{var t,i;return new Date(e).toLocaleString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language)};return e`
      <h3>${c("share.trash_header",void 0,this.hass)}</h3>
      <p class="hint">${c("share.trash_hint",void 0,this.hass)}</p>
      ${this._trash.length?e`<ul class="installed trash">
              ${this._trash.map((i,s)=>e`
                  <li>
                    <strong>${i.name}</strong>
                    <div class="status">
                      ${c("removed"===i.reason?"share.trash_removed":"share.trash_replaced",{when:t(i.at),dashboard:i.dashboard},this.hass)}
                    </div>
                    ${this._trashPending===s?e`<ha-alert alert-type="warning">
                            ${c("share.trash_clash",{name:i.name},this.hass)}
                          </ha-alert>`:e``}
                    <ha-button .disabled=${this._busy} @click=${()=>this._restore(i,s)}>
                      ${c(this._trashPending===s?"share.trash_restore_anyway":"share.trash_restore",void 0,this.hass)}
                    </ha-button>
                    <ha-button
                      @click=${()=>{this._trashShown=this._trashShown===s?void 0:s}}
                    >
                      ${c(this._trashShown===s?"share.trash_hide":"share.trash_show",void 0,this.hass)}
                    </ha-button>
                    <ha-button .disabled=${this._busy} @click=${()=>this._forget(i)}>
                      ${c("share.trash_forget",void 0,this.hass)}
                    </ha-button>
                    ${this._trashShown===s?e`<ha-yaml-editor
                            .hass=${this.hass}
                            .defaultValue=${i.template}
                            read-only
                          ></ha-yaml-editor>`:e``}
                  </li>
                `)}
            </ul>`:e`<p class="hint">${c("share.trash_empty",void 0,this.hass)}</p>`}
    `}async _restore(e,t){var i,s;if(!this.hass)return;const a=_i(this.hass);let o;try{o=await fi(a,e.dashboard)}catch(n){return void(this._toolError=c("tools.save_failed",{message:null!==(i=null==n?void 0:n.message)&&void 0!==i?i:n},this.hass))}const r=e.name in re(o);if(r&&this._trashPending!==t)return this._trashPending=t,void(this._trashArmedAt=Date.now());if(!(r&&Date.now()-this._trashArmedAt<no)){this._busy=!0,this._toolError=void 0;try{await R(this,this.hass,"restore",[{urlPath:e.dashboard,build:t=>gi(t,e)}]),this._trashPending=void 0,this._trashShown=void 0,await this._forget(e)}catch(n){this._toolError=c("tools.save_failed",{message:null!==(s=null==n?void 0:n.message)&&void 0!==s?s:n},this.hass)}finally{this._busy=!1}}}async _forget(e){if(!this.hass)return;const t=bi(await hi(this.hass),e);await yi(this.hass,t),this._trash=t,this._trashPending=void 0}_renderImportDetails(){const t=this._importValue;if(!this._importParses||!t||"object"!=typeof t||Array.isArray(t))return e``;if(!Rr(t))return e``;const i=[t,...t.includes&&"object"==typeof t.includes&&!Array.isArray(t.includes)?Object.values(t.includes):[]];return e`${this._renderAbout(t)} ${this._renderUnmet(i)} ${this._renderSetup(i)}`}_galleryEntries(){var e;return function(e,t,i){var s;const a=[];for(const o of e.library){const e=Object.assign({},o.template);e.description||(e.description=t(o.name)),a.push(Vn("library",`library:${o.name}`,o.name,o.name,e,{},i))}for(const o of null!==(s=e.community)&&void 0!==s?s:[])a.push(Vn("community",`community:${o.id}`,o.name,o.title,o.template,o.includes,i,{author:o.author,url:o.url,communityId:o.id}));for(const[o,r]of Object.entries(e.installed)){const e=null==r?void 0:r.source;Pn(e)&&a.push(Vn("installed",`installed:${o}`,o,o,r,{},i,{author:"string"==typeof e.author?e.author:void 0,url:"string"==typeof e.url?e.url:void 0}))}return a}({library:Tr,community:null===(e=this._community)||void 0===e?void 0:e.entries,installed:re(this._savedLovelace)},e=>c(`library.${e}.summary`,void 0,this.hass),this.hass)}_galleryStatus(e){var t;const i={already:!1,armed:!1,busy:this._busy,needs:[],brings:[],missingCards:[],risks:[],destination:this._libraryDestination,communityLoaded:void 0!==this._community,communityLoading:this._communityLoading};if(!e)return i;if("library"===e.source){const t=Object.keys(re(this._savedLovelace)),s=Nr(e.name),a=s?Mr(s,t):[];return Object.assign(Object.assign({},i),{already:t.includes(e.name),armed:this._installPending===e.name,needs:a,missingCards:rr([null==s?void 0:s.template,...a.map(e=>{var t;return null===(t=Nr(e))||void 0===t?void 0:t.template})].filter(e=>void 0!==e),Ee)})}if("community"===e.source){const s=this._communityExisting(),a=null===(t=this._community)||void 0===t?void 0:t.entries.find(t=>t.id===e.communityId),o=a?mn(a):void 0;return Object.assign(Object.assign({},i),{already:!1,armed:!!a&&this._installPending===`community:${a.id}:${a.updated}`,brings:Object.keys(e.includes).filter(e=>!s.includes(e)),missingCards:rr([e.template,...Object.values(e.includes)],Ee),risks:o?this._riskSentences(o):[],busy:this._busy||void 0===this._communityKnown})}return Object.assign(Object.assign({},i),{already:!0})}_riskSentences(e){const t=[];return e.actions.length&&t.push(c("share.community_risk_actions",{list:e.actions.join(", ")},this.hass)),e.urls.length&&t.push(c("share.community_risk_urls",{list:e.urls.join(", ")},this.hass)),e.embeds&&t.push(c("share.community_risk_embeds",void 0,this.hass)),e.scripts&&t.push(c("share.community_risk_scripts",void 0,this.hass)),e.placeholders&&t.push(c("share.community_risk_placeholders",void 0,this.hass)),e.overlay&&t.push(c("share.community_risk_overlay",void 0,this.hass)),t}_renderGallery(){if(!this._galleryOpen)return e``;const t=this._galleryEntries(),i=t.find(e=>e.key===this._gallerySelected);if(!this._galleryDialog){const e=document.createElement($i);e.addEventListener("gallery-closed",()=>{this._galleryOpen=!1,this._installPending=void 0}),e.addEventListener("gallery-select",e=>{var t;this._gallerySelected=null===(t=e.detail)||void 0===t?void 0:t.key,this._installPending=void 0}),e.addEventListener("gallery-load-community",()=>{this._loadCommunity(!1)}),e.addEventListener("gallery-install",e=>{var t;this._installFromGallery(null===(t=e.detail)||void 0===t?void 0:t.key)}),this._galleryDialog=e}const s=this._galleryDialog;return s.hass=this.hass,s.entries=t,s.open=!0,s.selectedKey=this._gallerySelected,s.status=this._galleryStatus(i),e`${s}`}async _installFromGallery(e){var t;const i=this._galleryEntries().find(t=>t.key===e);if(i)if("library"===i.source)this._librarySelected=i.name,await this._install(i.name);else if("community"===i.source){const e=null===(t=this._community)||void 0===t?void 0:t.entries.find(e=>e.id===i.communityId);if(!e)return;this._communitySelected=e.id,await this._installShared(e)}}_renderConvert(){const t=this._conversion;return e`
      <h3>${c("convert.header",void 0,this.hass)}</h3>
      <p class="hint">${c("convert.hint",void 0,this.hass)}</p>
      <ha-yaml-editor id="convert" .hass=${this.hass} @value-changed=${this._convertChanged}></ha-yaml-editor>
      ${this._convertTried&&!t?e`<ha-alert alert-type="warning">${c("convert.nothing",void 0,this.hass)}</ha-alert>`:e``}
      ${t?e`
              <p class="hint">${c("convert.result",void 0,this.hass)}</p>
              ${Lr(this._conversionKey,e`<ha-yaml-editor
                    id="converted"
                    .hass=${this.hass}
                    .defaultValue=${hl(t)}
                    read-only
                  ></ha-yaml-editor>
                  ${t.card?e`<p class="hint">${c("convert.card_result",void 0,this.hass)}</p>
                          <ha-yaml-editor
                            id="converted-card"
                            .hass=${this.hass}
                            .defaultValue=${t.card}
                            read-only
                          ></ha-yaml-editor>`:e``}`)}
              ${t.notes.map(t=>e`<ha-alert alert-type="info">${t}</ha-alert>`)}
              ${t.dropped.map(t=>e`<ha-alert alert-type="warning">${t}</ha-alert>`)}
              ${t.needs.length?e`<ha-alert alert-type="info">
                      ${c("convert.needs",{types:t.needs.join(", ")},this.hass)}
                    </ha-alert>`:e``}
              <ha-button @click=${this._copyConversion}>
                ${"done"===this._convertCopyState?c("share.copied",void 0,this.hass):"failed"===this._convertCopyState?c("share.copy_failed",void 0,this.hass):c("convert.copy",void 0,this.hass)}
              </ha-button>
              <ha-button .disabled=${this._busy} @click=${()=>{this._installConversion()}}>
                ${c(this._convertClash?"share.install_anyway":"convert.install",void 0,this.hass)}
              </ha-button>
              ${this._convertClash?e`<ha-alert alert-type="warning">
                      ${c("convert.clash",{names:this._convertClash.join(", ")},this.hass)}
                    </ha-alert>`:e``}
              ${this._convertInstalled?e`<ha-alert alert-type="success">
                      ${c("convert.installed",{names:this._convertInstalled.join(", ")},this.hass)}
                    </ha-alert>`:e``}
            `:e``}
    `}_convertChanged(e){e.stopPropagation(),this._convertValue=e.detail.value,this._convertParses=!1!==e.detail.isValid,this._convertCopyState="",this._convertTried=void 0!==this._convertValue&&null!==this._convertValue&&""!==this._convertValue,this._conversion=this._convertParses&&this._convertTried?cl(this._convertValue):void 0,this._conversionKey+=1,this._convertClash=void 0,this._convertInstalled=void 0}async _copyConversion(){if(!this._conversion)return;const e=[l(hl(this._conversion)),this._conversion.card?l(this._conversion.card):""].filter(Boolean).join("\n---\n");this._convertCopyState=await Ce(e)?"done":"failed"}async _installConversion(){const e=this._conversion;if(!e||this._busy)return;const t=Object.keys(e.templates),i=Object.keys(re(this._savedLovelace)),s=t.filter(e=>i.includes(e));if(s.length&&!this._convertClash)return this._convertClash=s,void(this._convertArmedAt=Date.now());if(this._convertClash&&Date.now()-this._convertArmedAt<no)return;const a=await this._saveDashboard(s=>t.reduce((t,s)=>i.includes(s)?vi(t,s,e.templates[s]):ui(t,s,e.templates[s]),s),"convert");this._convertClash=void 0,a&&(this._convertInstalled=t)}_importChanged(e){e.stopPropagation(),this._importValue=e.detail.value,this._importParses=!1!==e.detail.isValid,this._importErrors=[],this._importClash=void 0,this._importRisks=void 0,this._setupValues={}}_import(){if(!this._config)return;if(!this._importParses)return void(this._importErrors=[c("share.import_not_yaml",void 0,this.hass)]);if(!Rr(this._importValue))return void(this._importErrors=[c("share.import_too_big",void 0,this.hass)]);const e=or(this._importValue);if(!e.ok)return this._importErrors=e.errors,void(this._importClash=void 0);this._importErrors=[];const t=this._importValue.template,i=re(this._savedLovelace),s=t!==this._config.template&&t in i?t:void 0,a=mn({template:this._importValue,includes:{}});if(s&&!this._importClash||ro(a)&&!this._importRisks)return this._importClash=s,this._importRisks=ro(a)?a:void 0,void(this._importArmedAt=Date.now());Date.now()-this._importArmedAt<no||this._applyImport(t)}_importAsCopy(){if(!this._config||!this._importParses)return;if(Date.now()-this._importArmedAt<no)return;const e=Object.keys(re(this._savedLovelace));this._applyImport(ar(this._importValue.template,e))}_applyImport(e){var t;const i=function(e){const t=ir(e);if((null==t?void 0:t.includes)&&"object"==typeof t.includes&&!Array.isArray(t.includes)){const e={};for(const[i,s]of Object.entries(t.includes))e[i]=ir(s);t.includes=e}return t}(this._importValue),s=Ho(i,this._setupValues);s.includes&&"object"==typeof s.includes&&!Array.isArray(s.includes)&&(s.includes=Object.entries(s.includes).reduce((e,[t,i])=>Object.assign(Object.assign({},e),{[t]:i&&"object"==typeof i&&!Array.isArray(i)?Ho(i,this._setupValues):i}),{}));const a=s.includes;if(a&&"object"==typeof a&&!Array.isArray(a)){const e=Object.keys(re(this._savedLovelace)),t=Object.entries(a).filter(([t])=>!e.includes(t));t.length&&this._saveDashboard(e=>t.reduce((e,[t,i])=>ui(e,t,i),e),"import",this._config)}const o=Object.assign(Object.assign({},s),{template:e,type:null===(t=this._config)||void 0===t?void 0:t.type});delete o.includes,this._fireConfigChanged(o),this._importClash=void 0,this._importRisks=void 0,this._setupValues={},this.dispatchEvent(new CustomEvent("select-tab",{detail:"settings",bubbles:!0,composed:!0}))}}s([a({attribute:!1})],ml.prototype,"hass",void 0),s([a({attribute:!1})],ml.prototype,"lovelace",void 0),s([a({attribute:!1})],ml.prototype,"config",void 0),s([o()],ml.prototype,"_importErrors",void 0),s([o()],ml.prototype,"_importClash",void 0),s([o()],ml.prototype,"_importRisks",void 0),s([o()],ml.prototype,"_copyState",void 0),s([o()],ml.prototype,"_galleryOpen",void 0),s([o()],ml.prototype,"_gallerySelected",void 0),s([o()],ml.prototype,"_conversion",void 0),s([o()],ml.prototype,"_convertClash",void 0),s([o()],ml.prototype,"_convertInstalled",void 0),s([o()],ml.prototype,"_convertTried",void 0),s([o()],ml.prototype,"_convertCopyState",void 0),s([o()],ml.prototype,"_toolError",void 0),s([o()],ml.prototype,"_busy",void 0),s([o()],ml.prototype,"_installPending",void 0),s([o()],ml.prototype,"_librarySelected",void 0),s([o()],ml.prototype,"_libraryDestination",void 0),s([o()],ml.prototype,"_community",void 0),s([o()],ml.prototype,"_communityLoading",void 0),s([o()],ml.prototype,"_communityError",void 0),s([o()],ml.prototype,"_communitySelected",void 0),s([o()],ml.prototype,"_communityKnown",void 0),s([o()],ml.prototype,"_communityKnownFailed",void 0),s([o()],ml.prototype,"_postCopyState",void 0),s([o()],ml.prototype,"_setupValues",void 0),s([o()],ml.prototype,"_updates",void 0),s([o()],ml.prototype,"_updatesLoading",void 0),s([o()],ml.prototype,"_updatesError",void 0),s([o()],ml.prototype,"_updatePending",void 0),s([o()],ml.prototype,"_trash",void 0),s([o()],ml.prototype,"_compareWith",void 0),s([o()],ml.prototype,"_comparePending",void 0),s([o()],ml.prototype,"_trashShown",void 0),s([o()],ml.prototype,"_trashPending",void 0),customElements.get("decluttering-template-share-tab")||customElements.define("decluttering-template-share-tab",ml);const vl=["type","label","description","default","required","group","pattern","allowed","domain","device_class","min","max","step","unit","multiline","selector"];function _l(e){const t={};for(const s of vl){const i=e[s];void 0!==i&&(t[s]=i)}Object.assign(t,e.extra);const i={name:e.name};for(const s of e.order)s in t&&(i[s]=t[s]);for(const s of Object.keys(t))s in i||(i[s]=t[s]);return i}function fl(e){return!!e&&"object"==typeof e&&!Array.isArray(e)}function gl(e,t){const i=e.map(_l);if("mapping"===t){const e={};for(const t of i){const{name:i}=t,s=ci(t,["name"]),a=Object.keys(s);a.length?1!==a.length||"default"!==a[0]||fl(s.default)||null===s.default?e[String(i)]=s:e[String(i)]=s.default:e[String(i)]=null}return e}if("none"!==t||i.length)return i}function bl(e,t){const i=new Set(e.map(e=>e.name));if(!i.has(t))return t;let s=2;for(;i.has(`${t}_${s}`);)s+=1;return`${t}_${s}`}function yl(e,t,i){const s=Object.assign(Object.assign({},e),{extra:Object.assign({},e.extra)});return void 0===i?delete s[t]:s[t]=i,s}function $l(e){return void 0!==e.type?String(e.type):e.selector&&"object"==typeof e.selector&&"card"in e.selector?"card":""}const wl=e=>Array.isArray(e)?e.map(String).join(", "):null==e?"":String(e),xl=e=>{const t=e.split(",").map(e=>e.trim()).filter(Boolean);return t.length?t:void 0};class kl extends r{constructor(){super(...arguments),this._reorderedAsList=!1,this.shared=[],this._asYaml=!1,this._picking=!1}static get styles(){return n`
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
        padding-inline-start: 18px;
      }
      .pick a {
        cursor: pointer;
        color: var(--primary-color);
      }
      .empty {
        padding: 12px;
        color: var(--secondary-text-color);
      }
    `}get _rows(){return function(e){var t;const i=[];for(const s of Et(e)){if(!s||"object"!=typeof s)continue;const e={name:"string"==typeof s.name?s.name:String(null!==(t=s.name)&&void 0!==t?t:""),extra:{},order:Object.keys(s).filter(e=>"name"!==e)};for(const[t,i]of Object.entries(s))"name"!==t&&(vl.includes(t)?e[t]=i:e.extra[t]=i);i.push(e)}return i}(this.variables)}get _shape(){const e=(t=this.variables,Array.isArray(t)?"list":t&&"object"==typeof t?"mapping":"none");var t;return"none"===e?"list":e}render(){const t=this._rows;return e`
      ${this._asYaml?this._renderYaml():this._renderRows(t)}
      ${this._reorderedAsList?e`<p class="hint">${c("declarations.reordered_as_list",void 0,this.hass)}</p>`:d}
      <div class="add">
        <ha-button @click=${this._add}>${c("declarations.add",void 0,this.hass)}</ha-button>
        ${this.shared.length?e`<ha-button
                appearance="plain"
                @click=${()=>{this._picking=!this._picking}}
                >${c("declarations.take_shared",void 0,this.hass)}</ha-button
              >`:d}
        <span class="spacer"></span>
        <ha-button
          appearance="plain"
          @click=${()=>{this._asYaml=!this._asYaml}}
          >${c(this._asYaml?"declarations.as_rows":"declarations.as_yaml",void 0,this.hass)}</ha-button
        >
      </div>
      ${this._picking?this._renderShared(t):d}
    `}_renderRows(t){if(!t.length)return e`<div class="rows">
        <div class="empty">${c("declarations.none",void 0,this.hass)}</div>
      </div>`;const i=function(e){return e.map((t,i)=>{const s=void 0===t.group?void 0:String(t.group),a=i?e[i-1].group:void 0;return void 0!==s&&s!==(void 0===a?void 0:String(a))?s:void 0})}(t);return e`<div class="rows">
      ${Rs(t,e=>e.name,(s,a)=>e`
          ${void 0!==i[a]?e`<div class="group">${i[a]}</div>`:d}
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
              aria-label=${c("template_editor.drag_hint",void 0,this.hass)}
              .path=${lo}
            ></ha-svg-icon>
            <ha-form
              .hass=${this.hass}
              .data=${this._rowData(s)}
              .schema=${this._rowSchema(s)}
              .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
              .computeHelper=${e=>this._translatedHelper(s,e.name)}
              @value-changed=${e=>this._rowChanged(e,a)}
            ></ha-form>
            <div class="buttons">
              <ha-icon-button
                .path=${"M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z"}
                .label=${c(this._open===s.name?"declarations.less":"declarations.more",void 0,this.hass)}
                @click=${()=>{this._open=this._open===s.name?void 0:s.name}}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,15L12,10L17,15H7Z"}
                .disabled=${0===a}
                .label=${c("template_editor.move_up",{name:s.name},this.hass)}
                @click=${()=>this._move(a,a-1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,10L12,15L17,10H7Z"}
                .disabled=${a===t.length-1}
                .label=${c("template_editor.move_down",{name:s.name},this.hass)}
                @click=${()=>this._move(a,a+1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                .label=${c("declarations.remove",{name:s.name},this.hass)}
                @click=${()=>this._remove(a)}
              ></ha-icon-button>
            </div>
          </div>
          ${this._open===s.name?this._renderMore(s,a):d}
        `)}
    </div>`}_translatedHelper(e,t){if("label"!==t&&"description"!==t&&"group"!==t)return"";const i=e[t];return"string"==typeof i&&xi(i)?c("declarations.translated",{text:ki(i,this.texts,this.hass)},this.hass):""}_renderMore(t,i){const s={description:t.description,group:t.group,pattern:t.pattern,domain:wl(t.domain),device_class:wl(t.device_class),min:t.min,max:t.max,step:t.step,unit:t.unit,allowed:wl(t.allowed),multiline:t.multiline};return e`<div class="more">
      <ha-form
        .hass=${this.hass}
        .data=${s}
        .schema=${function(e,t){const i=$l(e),s={name:"description",label:c("declarations.description",void 0,t),selector:{text:{multiline:!0}}},a=[{name:"group",label:c("declarations.group",void 0,t),selector:{text:{}}}],o="entity"===i?[{name:"domain",label:c("declarations.domain",void 0,t),selector:{text:{}}},{name:"device_class",label:c("declarations.device_class",void 0,t),selector:{text:{}}}]:"number"===i?[{name:"min",label:c("declarations.min",void 0,t),selector:{number:{mode:"box"}}},{name:"max",label:c("declarations.max",void 0,t),selector:{number:{mode:"box"}}},{name:"step",label:c("declarations.step",void 0,t),selector:{number:{mode:"box"}}},{name:"unit",label:c("declarations.unit",void 0,t),selector:{text:{}}}]:"select"===i?[{name:"allowed",label:c("declarations.allowed",void 0,t),selector:{text:{}}}]:"text"===i?[{name:"multiline",label:c("declarations.multiline",void 0,t),selector:{boolean:{}}}]:[],r="card"===i?[]:[{name:"pattern",label:c("declarations.pattern",void 0,t),selector:{text:{}}}];return[s,{name:"",type:"grid",column_min_width:"260px",schema:[...a,...o,..."select"!==i&&void 0!==e.allowed?[{name:"allowed",label:c("declarations.allowed",void 0,t),selector:{text:{}}}]:[],...r]}]}(t,this.hass)}
        .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
        .computeHelper=${e=>this._translatedHelper(t,e.name)}
        @value-changed=${e=>this._moreChanged(e,i)}
      ></ha-form>
      ${void 0!==t.selector&&"card"!==$l(t)?e`<ha-form
              .hass=${this.hass}
              .data=${{selector:t.selector}}
              .schema=${[{name:"selector",label:c("declarations.selector",void 0,this.hass),selector:{object:{}}}]}
              .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
              @value-changed=${e=>this._selectorChanged(e,i)}
            ></ha-form>`:d}
    </div>`}_renderYaml(){return e`<ha-form
      .hass=${this.hass}
      .data=${{variables:this.variables}}
      .schema=${[{name:"variables",label:c("template_editor.declarations_label",void 0,this.hass),helper:c("template_editor.declarations_helper",void 0,this.hass),selector:{object:{}}}]}
      .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
      .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
      @value-changed=${e=>{e.stopPropagation(),this._emit(e.detail.value.variables)}}
    ></ha-form>`}_renderShared(t){const i=new Set(t.map(e=>e.name)),s=this.shared.filter(e=>!i.has(e.name));return e`<div class="pick">
      ${c("declarations.take_shared_hint",void 0,this.hass)}
      ${s.length?e`<ul>
              ${s.map(t=>e`<li>
                    <a @click=${()=>this._takeShared(t)}>${t.name}</a>
                    ${t.label?e` - ${ki(t.label,this.texts,this.hass)}`:d}
                  </li>`)}
            </ul>`:e`<p>${c("declarations.take_shared_none",void 0,this.hass)}</p>`}
    </div>`}_rowData(e){const t=void 0===e.default||["string","number","boolean"].includes(typeof e.default);return{name:e.name,type:$l(e),label:e.label,default:t?void 0===e.default?void 0:String(e.default):e.default,required:!0===e.required}}_rowSchema(e){const t=void 0===e.default||["string","number","boolean"].includes(typeof e.default),[i]=(s=this.hass,[{name:"",type:"grid",column_min_width:"120px",schema:[{name:"name",label:c("declarations.name",void 0,s),selector:{text:{}}},{name:"type",label:c("declarations.type",void 0,s),selector:{select:{mode:"dropdown",options:[{value:"",label:c("declarations.type_any",void 0,s)},...ji.map(e=>({value:e,label:c(`type_name.${e}`,void 0,s)})),{value:"card",label:c("type_name.card",void 0,s)}]}}},{name:"label",label:c("declarations.label",void 0,s),selector:{text:{}}},{name:"default",label:c("declarations.default",void 0,s),selector:{text:{}}},{name:"required",label:c("declarations.required",void 0,s),selector:{boolean:{}}}]}]);var s;if(t)return[i];const a=i.schema.map(e=>"default"===e.name?(e=>({name:"default",label:c("declarations.default",void 0,e),selector:{object:{}}}))(this.hass):e);return[Object.assign(Object.assign({},i),{schema:a})]}_rowChanged(e,t){var i,s;e.stopPropagation();const a=this._rows,o=a[t];if(!o)return;const r=e.detail.value;let n=o;const l="string"==typeof r.name?r.name.trim():o.name;l&&l!==o.name&&(n=yl(n,"name",bl(a.filter((e,i)=>i!==t),l)),this._open===o.name&&(this._open=n.name)),(null!==(i=r.type)&&void 0!==i?i:"")!==$l(o)&&(n=function(e,t){let i=yl(e,"type",void 0);return i=yl(i,"selector",void 0),"card"===t?yl(i,"selector",{card:{}}):t?yl(i,"type",t):i}(n,String(null!==(s=r.type)&&void 0!==s?s:""))),n=yl(n,"label","string"==typeof r.label&&""!==r.label?r.label:void 0),n=yl(n,"required",!0===r.required||void 0),r.default===o.default||""===r.default&&void 0===o.default||(n=yl(n,"default",this._defaultFrom(r.default,o))),this._emit(gl(a.map((e,i)=>i===t?n:e),this._shape))}_defaultFrom(e,t){if(""===e||null==e)return;if("string"!=typeof e)return e;const i=$l(t);return"number"!==i||""===e.trim()||Number.isNaN(Number(e))?"boolean"===i&&["true","false"].includes(e.trim().toLowerCase())?"true"===e.trim():e:Number(e)}_moreChanged(e,t){e.stopPropagation();const i=this._rows,s=i[t];if(!s)return;const a=e.detail.value;let o=s;const r=e=>"string"==typeof e&&e.trim()?e:void 0;o=yl(o,"description",r(a.description)),o=yl(o,"group",r(a.group)),o=yl(o,"pattern",r(a.pattern)),o=yl(o,"unit",r(a.unit));for(const l of["min","max","step"])o=yl(o,l,"number"==typeof a[l]?a[l]:void 0);o=yl(o,"multiline",!0===a.multiline||void 0);const n=e=>{const t="string"==typeof e?xl(e):void 0;return void 0===t?void 0:1===t.length?t[0]:t};o=yl(o,"domain",n(a.domain)),o=yl(o,"device_class",n(a.device_class)),o=yl(o,"allowed","string"==typeof a.allowed?xl(a.allowed):void 0),this._emit(gl(i.map((e,i)=>i===t?o:e),this._shape))}_selectorChanged(e,t){e.stopPropagation();const i=this._rows,s=e.detail.value.selector,a=yl(i[t],"selector",s&&"object"==typeof s?s:void 0);this._emit(gl(i.map((e,i)=>i===t?a:e),this._shape))}_add(){const e=this._rows,t=function(e,t="variable"){return{name:bl(e,t),extra:{},order:[]}}(e);this._open=t.name,this._emit(gl([...e,t],this._shape))}_takeShared(e){const t=this._rows,i={name:e.name,extra:{},order:[]};this._picking=!1,this._emit(gl([...t,i],this._shape))}_remove(e){const t=this._rows;this._emit(gl(t.filter((t,i)=>i!==e),this._shape))}_move(e,t){const i=this._rows,s=function(e,t,i){if(t===i||t<0||i<0||t>=e.length||i>=e.length)return e;const s=[...e],[a]=s.splice(t,1);return s.splice(i,0,a),s}(i,e,t);if(s===i)return;const a="mapping"===this._shape?"list":this._shape;this._reorderedAsList="mapping"===this._shape,this._emit(gl(s,a))}_drop(e,t){e.preventDefault();const i=this._dragging;this._dragging=void 0,void 0!==i&&this._move(i,t)}_emit(e){M(this,"value-changed",{value:e})}}s([a({attribute:!1})],kl.prototype,"hass",void 0),s([a({attribute:!1})],kl.prototype,"variables",void 0),s([o()],kl.prototype,"_reorderedAsList",void 0),s([a({attribute:!1})],kl.prototype,"shared",void 0),s([a({attribute:!1})],kl.prototype,"texts",void 0),s([o()],kl.prototype,"_open",void 0),s([o()],kl.prototype,"_asYaml",void 0),s([o()],kl.prototype,"_picking",void 0);const jl="decluttering-declarations-editor";customElements.get(jl)||customElements.define(jl,kl);const Ol=["name","title","label","entity","area","room"];function Al(e,t){const i=Object.assign({},T(t)),s=null==e?void 0:e.examples,a=null==s?[]:Array.isArray(s)?s:[s];return Object.assign(Object.assign({},e),{examples:[...a,i]})}class Sl extends r{static get styles(){return n`
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
    `}render(){var t;const i=this.config,s=null==i?void 0:i.template;if(!i||!s)return e``;const a=U(i),o=Oi.get(s),r=void 0===o||o>=a.length?"":String(o),n=null!==(t=re(this.lovelace,void 0,i)[s])&&void 0!==t?t:i,l=a.length?Ai({[s]:n},[],this.hass):[],h=a.length-l.length,u=""===r?void 0:l.find(e=>e.example===Number(r)+1),p=[{name:"example",label:c("template_editor.preview_example_label",void 0,this.hass),selector:{select:{mode:"dropdown",options:[{value:"",label:c("template_editor.preview_defaults",void 0,this.hass)},...a.map((e,t)=>{const i=function(e){const t=T(e);for(const s of Ol){const e=t[s];if("string"==typeof e&&e.trim())return e.trim();if("number"==typeof e)return String(e)}const i=e.map(K).find(e=>void 0!==e);if(void 0!==i){const e=t[i];if("string"==typeof e||"number"==typeof e)return`${i}: ${e}`}}(e),s=c("template_editor.example_n",{number:t+1},this.hass);return{value:String(t),label:i?`${s}: ${i}`:s}})]}}}];return e`
      <div class="strip">
        <ha-form
          .hass=${this.hass}
          .data=${{example:r}}
          .schema=${p}
          .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
          @value-changed=${this._picked}
        ></ha-form>
        ${a.length?e`<span class="passes ${h<a.length?"some":""}"
                >${c("template_editor.examples_pass",{passes:h,total:a.length},this.hass)}</span
              >`:d}
        <ha-icon-button
          .path=${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}
          .label=${c("template_editor.example_add",void 0,this.hass)}
          @click=${this._add}
        ></ha-icon-button>
      </div>
      ${u?e`<ha-alert alert-type="warning"
              >${c("tools.health_example",{template:s,number:u.example,problems:u.problems.join(" ")},this.hass)}</ha-alert
            >`:d}
    `}_picked(e){var t;e.stopPropagation();const i=null===(t=this.config)||void 0===t?void 0:t.template;if(!i)return;const s=e.detail.value.example;void 0===s||""===s?Oi.delete(i):Oi.set(i,Number(s)),window.dispatchEvent(new CustomEvent(Si,{detail:{template:i}})),this.dispatchEvent(new CustomEvent("example-picked",{detail:{template:i,example:""===s?void 0:Number(s)},bubbles:!0,composed:!0})),this.requestUpdate()}_add(){const e=this.config;if(!e)return;const t=U(e),i=Oi.get(e.template),s=void 0!==i&&t[i]?t[i]:L(ft(e));M(this,"config-changed",{config:Al(e,s)})}}s([a({attribute:!1})],Sl.prototype,"hass",void 0),s([a({attribute:!1})],Sl.prototype,"lovelace",void 0),s([a({attribute:!1})],Sl.prototype,"config",void 0);const Cl="decluttering-example-strip";customElements.get(Cl)||customElements.define(Cl,Sl);const Pl="https://tempus2016.github.io/decluttering-card-plus/",El=`${Pl}help-index.json`,Ll={template:"Defining-Templates.html",type:"Defining-Templates.html",description:"Defining-Templates.html",category:"Defining-Templates.html",variables:"Describing-Variables.html",default:"Variables.html",defaults:"Variables.html",let:"Variables.html",extends:"Defining-Templates.html",base:"Defining-Templates.html",examples:"Describing-Variables.html",for_each:"Repeating-a-Template.html",for_each_from:"Repeating-a-Template.html",columns:"Repeating-a-Template.html",min_column_width:"Repeating-a-Template.html",gap:"Styling.html",empty:"Repeating-a-Template.html",lazy:"Repeating-a-Template.html",style:"Styling.html",grid_options:"Styling.html",on_error:"Using-Templates.html",checks:"Troubleshooting.html",alert:"Troubleshooting.html",rebuild_on:"Using-Templates.html",rebuild_on_watch:"Using-Templates.html",debug:"Troubleshooting.html",strict:"Using-Templates.html",fit:"Styling.html",group:"Cards.html",publish:"Using-Templates.html",suggest_for:"Using-Templates.html",visibility:"Visibility.html"};let Tl;function Nl(e=fetch){return null!=Tl||(Tl=e(El,{cache:"force-cache"}).then(async e=>{if(!e.ok)return{};return function(e){const t={};if(!e||"object"!=typeof e)return t;for(const[i,s]of Object.entries(e)){if(!s||"object"!=typeof s)continue;const e=s;"string"==typeof e.page&&"string"==typeof e.text&&"string"==typeof e.url&&(e.url.startsWith(Pl)&&(t[i]=Object.assign(Object.assign({key:i,page:e.page,heading:"string"==typeof e.heading?e.heading:"",text:e.text},"string"==typeof e.yaml?{yaml:e.yaml}:{}),{url:e.url})))}return t}(await e.json())}).catch(()=>({}))),Tl}class Ml extends r{constructor(){super(...arguments),this.key="",this._open=!1,this._loaded=!1}static get styles(){return n`
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
        inset-inline-end: 0;
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
        text-align: start;
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
        /* Code reads left to right in a right-to-left dashboard too. */
        direction: ltr;
        text-align: left;
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
        margin-inline-start: auto;
      }
    `}render(){return e`
      <button
        aria-expanded=${this._open}
        aria-label=${c("help.button",{key:this.key},this.hass)}
        title=${c("help.button",{key:this.key},this.hass)}
        @click=${this._toggle}
        @keydown=${this._keydown}
      >
        ?
      </button>
      ${this._open?this._renderPop():d}
    `}_renderPop(){var t;const i=this._entry,s=null!==(t=null==i?void 0:i.url)&&void 0!==t?t:function(e){var t;return Pl+(null!==(t=Ll[e])&&void 0!==t?t:"Configuration-Reference.html")}(this.key);return e`
      <div class="pop" role="dialog" @keydown=${this._keydown}>
        ${i?e`
                <h5>${i.page}${i.heading?` · ${i.heading}`:""}</h5>
                <p>${i.text}</p>
                ${i.yaml?e`<pre>${i.yaml}</pre>`:d}
              `:e`<p>
                ${c(this._loaded?"help.not_in_index":"help.loading",{key:this.key},this.hass)}
              </p>`}
        <div class="foot">
          <a href=${s} target="_blank" rel="noopener noreferrer"
            >${c("help.open_page",void 0,this.hass)}</a
          >
          <span class="esc">${c("help.esc",void 0,this.hass)}</span>
        </div>
      </div>
    `}async _toggle(){this._open=!this._open,this._open&&!this._loaded&&(this._entry=await async function(e,t){return(await Nl(t))[e]}(this.key),this._loaded=!0)}_keydown(e){"Escape"===e.key&&this._open&&(e.stopPropagation(),this._open=!1)}}s([a({attribute:!1})],Ml.prototype,"hass",void 0),s([a()],Ml.prototype,"key",void 0),s([o()],Ml.prototype,"_open",void 0),s([o()],Ml.prototype,"_entry",void 0),s([o()],Ml.prototype,"_loaded",void 0);const Vl="decluttering-help";customElements.get(Vl)||customElements.define(Vl,Ml);const Dl=[0,100,300,1e3,2500];function zl(e,t){let i,s=!1;const a=new Set,o=()=>{for(const e of a)clearTimeout(e);a.clear();for(const e of Dl){const i=setTimeout(()=>{a.delete(i),s||t()},e);a.add(i)}},r=()=>{if(s)return;const t=e.shadowRoot;if(null==i||i.disconnect(),i=new MutationObserver(o),i.observe(null!=t?t:e,{childList:!0,subtree:!0,attributes:!0}),o(),!t){const t=e.localName;(t.includes("-")&&"undefined"!=typeof customElements?customElements.whenDefined(t):Promise.resolve()).then(()=>e.updateComplete).then(()=>{!s&&e.shadowRoot&&r()}).catch(()=>{})}};return r(),()=>{s=!0,null==i||i.disconnect(),i=void 0;for(const e of a)clearTimeout(e);a.clear()}}const Fl=/^[A-Za-z0-9_-]+$/;function Hl(e){var t,i;const s=[];let a=e;for(;a;){if(a instanceof Element&&"ha-selector"===a.localName){const e=null!==(t=a.name)&&void 0!==t?t:null===(i=a.schema)||void 0===i?void 0:i.name;"string"==typeof e&&e&&s.unshift(e)}a=a.parentNode instanceof ShadowRoot?a.parentNode.host:a.parentNode}return s.length?s:void 0}class Rl extends r{constructor(){super(...arguments),this._fields=[],this._form={name:"",label:"",default:"",required:!1},this._reusing=!1,this._onMove=()=>{this._raf||(this._raf=requestAnimationFrame(()=>{this._raf=void 0,this._measure()}))}}static get styles(){return n`
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
        margin-inline-start: auto;
        color: var(--secondary-text-color);
      }
      .menu .sub {
        padding-inline-start: 28px;
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
    `}updated(e){super.updated(e),e.has("target")&&this._watch(),e.has("config")&&this._measure()}connectedCallback(){super.connectedCallback(),window.addEventListener("scroll",this._onMove,!0),window.addEventListener("resize",this._onMove)}disconnectedCallback(){var e;super.disconnectedCallback(),window.removeEventListener("scroll",this._onMove,!0),window.removeEventListener("resize",this._onMove),null===(e=this._stopWatching)||void 0===e||e.call(this),this._stopWatching=void 0,this._raf&&cancelAnimationFrame(this._raf)}_watch(){var e;null===(e=this._stopWatching)||void 0===e||e.call(this),this._stopWatching=void 0;const t=this.target;t?this._stopWatching=zl(t,()=>this._measure()):this._fields=[]}_measure(){var e,t,i,s;const a=this.target,o=this.config;if(!a||!o)return void(this._fields=[]);const r=null===(e=this.renderRoot.querySelector(".origin"))||void 0===e?void 0:e.getBoundingClientRect(),n=null!==(t=null==r?void 0:r.left)&&void 0!==t?t:0,l=null!==(i=null==r?void 0:r.top)&&void 0!==i?i:0,d=[];for(const c of function*(e){var t;const i=[e];for(;i.length;){const e=i.shift();for(const s of[...null!==(t=e.children)&&void 0!==t?t:[]])"ha-selector"===s.localName&&(yield s),s.shadowRoot&&i.push(s.shadowRoot),i.push(s)}}(null!==(s=a.shadowRoot)&&void 0!==s?s:a)){if(c.selector&&"expandable"in c.selector)continue;const e=Hl(c);if(!e)continue;const t=fr(o,e);if(null==t||"object"==typeof t)continue;if("string"==typeof t&&/\[\[/.test(t))continue;const i=c.getBoundingClientRect();i.width&&i.height&&d.push({element:c,path:e,value:t,label:e.map(e=>"number"==typeof e?`#${e+1}`:e).join(" › "),top:i.top-l,left:i.left-n,width:i.width,height:i.height})}this._fields=d,this._menuFor&&!d.some(e=>{var t;return e.element===(null===(t=this._menuFor)||void 0===t?void 0:t.element)})&&(this._menuFor=void 0)}render(){return e`
      <span class="origin"></span>
      ${this._fields.map(t=>e`
          <button
            class="btn"
            style="top: ${t.top+4}px; left: ${t.left+t.width-32}px"
            title=${c("field_menu.button",{field:t.label},this.hass)}
            aria-label=${c("field_menu.button",{field:t.label},this.hass)}
            @click=${()=>this._openMenu(t)}
          >
            ⋮
          </button>
        `)}
      ${this._menuFor?this._renderMenu(this._menuFor):d}
      ${this._dialogFor?this._renderDialog(this._dialogFor):d}
    `}_openMenu(e){var t;this._menuFor=(null===(t=this._menuFor)||void 0===t?void 0:t.element)===e.element?void 0:e,this._reusing=!1,this._dialogFor=void 0}_renderMenu(t){const i=le(this.config);return e`
      <div
        class="menu"
        role="menu"
        style="top: ${t.top+36}px; left: ${Math.max(8,t.left+t.width-240)}px"
      >
        <div role="menuitem" @click=${()=>this._startPromote(t)}>
          ${c("field_menu.make_variable",void 0,this.hass)}
        </div>
        ${i.length?e`<div
                role="menuitem"
                @click=${()=>{this._reusing=!this._reusing}}
              >
                ${c("field_menu.use_existing",void 0,this.hass)} <small>${i.length}</small>
              </div>`:d}
        ${this._reusing?i.map(i=>e`<div class="sub" role="menuitem" @click=${()=>this._reuse(t,i.name)}>
                    [[${i.name}]]
                  </div>`):d}
        <div role="menuitem" @click=${()=>{this._copy(t)}}>
          ${c("field_menu.copy_value",void 0,this.hass)}
        </div>
      </div>
    `}_startPromote(e){const t=e.path[e.path.length-1],i="string"==typeof t?t.replace(/[^A-Za-z0-9_-]/g,"_"):"value",s=new Set(le(this.config).map(e=>e.name));let a=i,o=2;for(;s.has(a);)a=`${i}_${o++}`;this._form={name:a,label:"string"==typeof t?t.replace(/_/g," ").replace(/^\w/,e=>e.toUpperCase()):"",default:String(e.value),required:!1},this._error=void 0,this._menuFor=void 0,this._dialogFor=e}_renderDialog(t){const i=[{name:"name",label:c("field_menu.name",void 0,this.hass),selector:{text:{}}},{name:"label",label:c("field_menu.label",void 0,this.hass),selector:{text:{}}},{name:"default",label:c("field_menu.default",void 0,this.hass),selector:{text:{}}},{name:"required",label:c("field_menu.required",void 0,this.hass),selector:{boolean:{}}}];return e`
      <div
        class="dialog"
        role="dialog"
        style="top: ${Math.min(t.top+36,window.innerHeight-360)}px; left: ${Math.max(8,t.left+t.width-380)}px"
      >
        <h4>${c("field_menu.dialog_title",{field:t.label},this.hass)}</h4>
        <ha-form
          .hass=${this.hass}
          .data=${this._form}
          .schema=${i}
          .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
          @value-changed=${e=>{e.stopPropagation(),this._form=Object.assign(Object.assign({},this._form),e.detail.value),this._error=this._checkName(this._form.name)}}
        ></ha-form>
        <p>${c("field_menu.dialog_hint",{name:this._form.name||"…"},this.hass)}</p>
        ${this._error?e`<ha-alert alert-type="error">${this._error}</ha-alert>`:d}
        <div class="actions">
          <ha-button
            appearance="plain"
            @click=${()=>{this._dialogFor=void 0}}
            >${c("field_menu.cancel",void 0,this.hass)}</ha-button
          >
          <ha-button .disabled=${!!this._error||!this._form.name} @click=${()=>this._promote(t)}>
            ${c("field_menu.make",void 0,this.hass)}
          </ha-button>
        </div>
      </div>
    `}_checkName(e){if(e)return Fl.test(e)?le(this.config).some(t=>t.name===e)?c("template_editor.promote_name_taken",{name:e},this.hass):void 0:c("template_editor.promote_name_invalid",void 0,this.hass)}_promote(e){const t=this.config;if(!t)return;const{name:i,label:s,required:a}=this._form,o=this._form.default,r=o===String(e.value)?void 0:"number"!=typeof e.value||Number.isNaN(Number(o))?"boolean"==typeof e.value?"true"===o.trim().toLowerCase():o:Number(o),n=function(e,t,i,s){const a=_r(e,t,i);if(!a.ok)return a;const o=Et(a.template.variables),r=o.findIndex(e=>(null==e?void 0:e.name)===i);if(-1===r)return a;const n=Object.assign({},o[r]);s.label&&(n.label=s.label),s.required&&(n.required=!0),s.description&&(n.description=s.description),void 0!==s.default&&(n.default=s.default);const l=Array.isArray(a.template.variables)?o.map((e,t)=>t===r?n:e):Object.assign(Object.assign({},a.template.variables),{[i]:gr(n)});return{ok:!0,template:Object.assign(Object.assign({},a.template),{variables:l})}}(t,e.path,i,{label:s||void 0,required:a,default:r});n.ok?(this._dialogFor=void 0,M(this,"config-changed",{config:n.template})):this._error=c(`template_editor.promote_${n.error}`,{name:i},this.hass)}_reuse(e,t){const i=this.config;if(!i)return;const s=function(e,t,i){if(!lr.test(i))return{ok:!1,error:"name_invalid"};const s=cr(e),a=s?vr(e[s],t):void 0;return s&&null!=a&&"object"!=typeof a?{ok:!0,template:Object.assign(Object.assign({},e),{[s]:mr(e[s],t,`[[${i}]]`)})}:{ok:!1,error:"gone"}}(i,e.path,t);this._menuFor=void 0,s.ok&&M(this,"config-changed",{config:s.template})}async _copy(e){this._menuFor=void 0,await Ce(String(e.value))}}s([a({attribute:!1})],Rl.prototype,"hass",void 0),s([a({attribute:!1})],Rl.prototype,"config",void 0),s([a({attribute:!1})],Rl.prototype,"target",void 0),s([o()],Rl.prototype,"_fields",void 0),s([o()],Rl.prototype,"_menuFor",void 0),s([o()],Rl.prototype,"_dialogFor",void 0),s([o()],Rl.prototype,"_form",void 0),s([o()],Rl.prototype,"_error",void 0),s([o()],Rl.prototype,"_reusing",void 0);const ql="decluttering-field-menus";customElements.get(ql)||customElements.define(ql,Rl);const Il="[^[\\]]",Wl=new RegExp(`\\[\\[(?:${Il}|${`\\[\\[(?:${Il}|${`\\[\\[${Il}*\\]\\]`})*\\]\\]`})*\\]\\]`,"g");function Jl(e,t){const i=[];let s;for(Wl.lastIndex=0;null!==(s=Wl.exec(e));){const e=s[0];if(e.startsWith("[[!"))continue;const{kind:a,message:o}=t(e);i.push({from:s.index,to:s.index+e.length,kind:a,text:e,message:o})}return i}const Ul=Ei.map(e=>`${e}:`),Bl=["default:","if:","slug","friendly_name","area","bool","upper","lower","title","replace:"];function Kl(e,t,i){var s;const a=e.slice(0,t),o=a.lastIndexOf("[[");if(-1===o)return null;const r=a.slice(o+2);if(r.includes("]]")||r.includes("\n"))return null;const n=r.lastIndexOf("|");if(-1===n){if(/^\$[\w.-]*$/.test(r)){const e=r.slice(1).toLowerCase(),t=(null!==(s=i.translations)&&void 0!==s?s:[]).filter(t=>t.key.toLowerCase().startsWith(e)).map(e=>({label:`$${e.key}`,detail:e.text}));return t.length?{from:o+2,heading:"texts",options:t}:null}if(!/^[\w.-]*$/.test(r))return null;const e=r.toLowerCase(),t=[...i.variables.map(e=>({label:e.name,detail:Zl(e)})),...i.lets.map(e=>({label:e,detail:"let"})),...i.shared.filter(e=>!i.variables.some(t=>t.name===e.name)).map(e=>({label:e.name,detail:"dashboard"}))].filter(t=>t.label.toLowerCase().startsWith(e));return t.length?{from:o+2,heading:"variables",options:t}:null}const l=r.slice(n+1),d=l.indexOf(":");if(-1!==d){const e=l.slice(0,d),t=l.slice(d+1),i=function(e){switch(e){case"if":return["other","!other","mode=on","mode!=off"];case"round":return["0","1","2"];case"switch":return["on=green,off=grey,default=amber"];case"pick":return["name=value,icon"];case"to_list":return["key=name,value=entity"];case"to_map":return["key=name,value=icon"];case"merge":return["other"];default:return[]}}(e).filter(e=>e.startsWith(t));return i.length?{from:o+2+n+1+d+1,heading:"values",options:i.map(e=>({label:e}))}:null}if(!/^[\w-]*$/.test(l))return null;const c=l.toLowerCase(),h=function(e=Tt()){const t=[...Pi,...Ul],i=t.filter(e=>!Bl.includes(e)).sort(),s=[...e].filter(e=>!t.includes(e)&&!t.includes(`${e}:`)).sort();return[...Bl.filter(e=>t.includes(e)),...i,...s]}().filter(e=>e.toLowerCase().startsWith(c)).map(e=>({label:e,detail:i.sample&&e in Ci?i.sample(e):Tt().includes(e)?"function":void 0}));return h.length?{from:o+2+n+1,heading:"steps",options:h}:null}function Zl(e){var t;const i=null!==(t=e.type)&&void 0!==t?t:e.selector&&"object"==typeof e.selector?Object.keys(e.selector)[0]:void 0;return`${null!=i?i:"any"}${e.required?", required":""}`}const Yl=new WeakSet;class Gl extends r{constructor(){super(...arguments),this._decorated=!1,this._selected=0,this._spans=[],this._tries=0}static get styles(){return n`
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
        margin-inline-end: 5px;
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
        margin-inline-start: auto;
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
        /* Code reads left to right in a right-to-left dashboard too. */
        direction: ltr;
        text-align: left;
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
    `}updated(e){super.updated(e),e.has("target")&&this._watch(),(e.has("config")||e.has("hass"))&&this._refresh()}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopWatching)||void 0===e||e.call(this),this._stopWatching=void 0}_watch(){var e;null===(e=this._stopWatching)||void 0===e||e.call(this),this._stopWatching=void 0,this._editor=void 0,this._decorated=!1;const t=this.target;t&&(this._stopWatching=zl(t,()=>this._attach()))}_attach(){var e;const t=this.target;if(!t)return;const i=function(e,t){if(!e)return;const i=[e];for(e instanceof Element&&e.shadowRoot&&i.push(e.shadowRoot);i.length;){const e=i.shift(),s=e.querySelector(t);if(s)return s;for(const t of e.querySelectorAll("*"))t.shadowRoot&&i.push(t.shadowRoot)}}(null!==(e=t.shadowRoot)&&void 0!==e?e:t,"ha-code-editor");i?this._editor!==i&&(this._editor=i,this._tries=0,this._hookWhenReady(i)):this._editor&&(this._editor=void 0,this._completion=void 0)}_hookWhenReady(e){if(this._editor!==e)return;const t=e.codemirror;t?(Yl.has(e)||(Yl.add(e),this._decorate(e,t),e.addEventListener("keyup",e=>this._keyup(e)),e.addEventListener("click",()=>this._complete()),e.addEventListener("keydown",e=>this._keydown(e),!0),e.addEventListener("focusout",()=>setTimeout(()=>this._completion=void 0,150))),this._refresh()):this._tries++<40&&setTimeout(()=>this._hookWhenReady(e),100)}_resolved(){var e,t,i,s;const a=this.config;if(!a)return;const o=this.lovelace,r=null!==(e=re(o,void 0,a)[a.template])&&void 0!==e?e:a,n=null!==(t=Li(r,Oi.get(a.template)))&&void 0!==t?t:L(ft(r)),l=new Map;for(const d of Pr(a,Cr(r))){if("warning"!==d.level)continue;const e=null!==(s=null!==(i=d.params.name)&&void 0!==i?i:d.params.placeholder)&&void 0!==s?s:d.params.step;e&&l.set(e,c(d.key,d.params,this.hass)+(d.params.closest?c("error.did_you_mean",{closest:d.params.closest},this.hass):""))}return{template:r,variables:n,bad:l}}_judge(e,t){const i=e.slice(2).split(/[|?\]]/)[0];for(const[o,r]of t.bad)if(e.includes(o))return{kind:"bad",message:r};let s;try{s=xs(t.template,t.variables,e,this.hass)}catch(a){return{kind:"unset"}}if("removed"===s.whole.kind)return{kind:"unset",message:c("code_hooks.unset_optional",{name:i},this.hass)};if("unresolved"===s.whole.kind||void 0===s.whole.value)return s.unset.length?{kind:"unset",message:c("code_hooks.unset",{name:s.unset.join(", ")},this.hass)}:{kind:"bad",message:c("code_hooks.left_as_written",void 0,this.hass)};return{kind:"ok",message:"string"==typeof s.whole.value?s.whole.value:JSON.stringify(s.whole.value)}}_refresh(){const e=this._editor,t=this._resolved(),i="string"==typeof(null==e?void 0:e.value)?e.value:"";this._spans=t?Jl(i,e=>this._judge(e,t)):[];const s=null==e?void 0:e.codemirror;if(s&&this._decorated)try{s.dispatch({})}catch(a){}}_decorate(e,t){var i;const{Decoration:s,ViewPlugin:a,StateEffect:o}=function(e,t){var i,s,a,o,r,n;let l,d=null==e?void 0:e.StateEffect,c=null==e?void 0:e.ViewPlugin,h=null==e?void 0:e.Decoration;try{if(!d&&(null===(i=null==e?void 0:e.langCompartment)||void 0===i?void 0:i.reconfigure)){const t=e.langCompartment.reconfigure([]);(null===(s=null==t?void 0:t.constructor)||void 0===s?void 0:s.appendConfig)&&(d=t.constructor)}}catch(u){}try{l=null===(a=null==e?void 0:e.highlightActiveLine)||void 0===a?void 0:a.call(e),!c&&(null===(o=null==l?void 0:l.constructor)||void 0===o?void 0:o.fromClass)&&(c=l.constructor)}catch(p){}try{if(!h&&l&&(null==t?void 0:t.plugin)){const e=t.plugin(l);let i;null===(n=null===(r=null==e?void 0:e.decorations)||void 0===r?void 0:r.between)||void 0===n||n.call(r,0,t.state.doc.length,(e,t,s)=>(i=s,!1));const s=i?Object.getPrototypeOf(i.constructor):void 0;(null==s?void 0:s.mark)&&(null==s?void 0:s.set)&&(h=s)}}catch(m){}return{Decoration:h,ViewPlugin:c,StateEffect:d}}(e._loadedCodeMirror,t);if(!s||!a||!o)return;const r=e=>{const t=this._resolved();if(!t)return s.none;const i=Jl(e.state.doc.toString(),e=>this._judge(e,t));return this._spans=i,s.set(i.map(e=>s.mark({class:`dcp-ph dcp-ph-${e.kind}`,attributes:e.message?{title:e.message}:void 0}).range(e.from,e.to)),!0)},n=a.fromClass(class{constructor(e){this.decorations=r(e)}update(e){this.decorations=r(e.view)}},{decorations:e=>e.decorations});try{t.dispatch({effects:o.appendConfig.of([n])});const s=document.createElement("style");s.textContent="\n  .dcp-ph { border-radius: 3px; padding: 0 1px; }\n  .dcp-ph-ok { background: color-mix(in srgb, var(--warning-color, #e39400) 22%, transparent); }\n  .dcp-ph-unset { background: color-mix(in srgb, var(--secondary-text-color, #727272) 18%, transparent); }\n  .dcp-ph-bad { background: color-mix(in srgb, var(--error-color, #db4437) 14%, transparent); text-decoration: underline wavy var(--error-color, #db4437); }\n",(null!==(i=e.shadowRoot)&&void 0!==i?i:e).appendChild(s),this._decorated=!0}catch(l){this._decorated=!1}}_keyup(e){["ArrowDown","ArrowUp","Enter","Tab","Escape"].includes(e.key)||this._complete()}_complete(){var e,t,i,s;const a=null===(e=this._editor)||void 0===e?void 0:e.codemirror,o=this.config;if(!a||!o)return;const r=a.state.doc.toString(),n=a.state.selection.main.head,l=null!==(t=re(this.lovelace,void 0,o)[o.template])&&void 0!==t?t:o,d=L(l.let).map(K).filter(e=>void 0!==e),c=this._sampleEntity(l),h=Kl(r,n,{variables:le(o),lets:d,shared:Ni(this.lovelace),translations:Ti(l,ae(this.hass)).map(e=>{const[t]=Object.keys(e),i=e[t];return{key:t.slice(1),text:"string"==typeof i?i:JSON.stringify(i)}}),sample:c?e=>{var i;try{return null===(i=Ci[e])||void 0===i?void 0:i.call(Ci,c,this.hass)}catch(t){return}}:void 0});if(!h)return void(this._completion=void 0);const u=a.coordsAtPos(n);this._completion=Object.assign(Object.assign({},h),{x:null!==(i=null==u?void 0:u.left)&&void 0!==i?i:0,y:null!==(s=null==u?void 0:u.bottom)&&void 0!==s?s:0,pos:n}),this._selected=0}_sampleEntity(e){var t,i,s,a;const o=Oi.get(null!==(i=null===(t=this.config)||void 0===t?void 0:t.template)&&void 0!==i?i:""),r=[...null!==(s=Li(e,o))&&void 0!==s?s:[],...void 0===o&&null!==(a=U(e)[0])&&void 0!==a?a:[],...L(ft(e))];for(const n of r){const e=Object.values(n)[0];if("string"==typeof e&&/^[a-z_]+\.[a-z0-9_]+$/.test(e))return e}}_keydown(e){const t=this._completion;if(t){if("ArrowDown"===e.key)this._selected=(this._selected+1)%t.options.length;else if("ArrowUp"===e.key)this._selected=(this._selected-1+t.options.length)%t.options.length;else if("Enter"===e.key||"Tab"===e.key)this._accept(this._selected);else{if("Escape"!==e.key)return;this._completion=void 0}e.preventDefault(),e.stopPropagation()}}_accept(e){var t,i;const s=this._completion,a=null===(t=this._editor)||void 0===t?void 0:t.codemirror;if(!s||!a)return;const o=s.options[e];if(!o)return;const r=null!==(i=o.insert)&&void 0!==i?i:o.label;try{a.dispatch({changes:{from:s.from,to:s.pos,insert:r},selection:{anchor:s.from+r.length}}),a.focus()}catch(n){}this._completion=void 0}render(){return this._editor?e`
      <div class="legend">
        <span><i class="ok"></i>${c("code_hooks.legend_ok",void 0,this.hass)}</span>
        <span><i class="unset"></i>${c("code_hooks.legend_unset",void 0,this.hass)}</span>
        <span><i class="bad"></i>${c("code_hooks.legend_bad",void 0,this.hass)}</span>
        <span>${c("code_hooks.legend_hint",void 0,this.hass)}</span>
      </div>
      ${this._decorated?d:this._renderCopy()}
      ${this._completion?this._renderPop(this._completion):d}
    `:e``}_renderCopy(){var t,i;const s="string"==typeof(null===(t=this._editor)||void 0===t?void 0:t.value)?this._editor.value:"";if(!s)return e``;const a=[];let o=0;for(const r of this._spans)a.push(s.slice(o,r.from)),a.push(e`<span class="dcp-ph dcp-ph-${r.kind}" title=${null!==(i=r.message)&&void 0!==i?i:""}>${r.text}</span>`),o=r.to;return a.push(s.slice(o)),e`<pre class="copy">${a}</pre>`}_renderPop(t){var i,s;return e`
      <div class="pop" style="left: ${t.x}px; top: ${t.y+4}px" role="listbox">
        <div class="hd">
          ${c(`code_hooks.heading_${t.heading}`,{template:null!==(s=null===(i=this.config)||void 0===i?void 0:i.template)&&void 0!==s?s:""},this.hass)}
        </div>
        ${t.options.slice(0,40).map((t,i)=>e`
            <div
              class="opt ${i===this._selected?"sel":""}"
              role="option"
              aria-selected=${i===this._selected}
              @mousedown=${e=>{e.preventDefault(),this._accept(i)}}
            >
              ${t.label} ${t.detail?e`<small>${t.detail}</small>`:d}
            </div>
          `)}
      </div>
    `}}s([a({attribute:!1})],Gl.prototype,"hass",void 0),s([a({attribute:!1})],Gl.prototype,"lovelace",void 0),s([a({attribute:!1})],Gl.prototype,"config",void 0),s([a({attribute:!1})],Gl.prototype,"target",void 0),s([o()],Gl.prototype,"_editor",void 0),s([o()],Gl.prototype,"_decorated",void 0),s([o()],Gl.prototype,"_completion",void 0),s([o()],Gl.prototype,"_selected",void 0),s([o()],Gl.prototype,"_spans",void 0);const Ql="decluttering-code-hooks";customElements.get(Ql)||customElements.define(Ql,Gl);const Xl=["card","badge","row","element"];function ed(e,t,i=[]){if(Array.isArray(e))e.forEach((e,s)=>ed(e,`${t}[${s}]`,i));else if(e&&"object"==typeof e)for(const[s,a]of Object.entries(e))ed(a,t?`${t}.${s}`:s,i);else null!=e&&i.push({path:t,value:String(e)});return i}const td=["grid_options","visibility","view_layout","layout_options"];function id(e){const t={};for(const[i,s]of Object.entries(null!=e?e:{}))td.includes(i)||(t[i]=s);return t}function sd(e){if(Array.isArray(e))return e.map(sd);if(e&&"object"==typeof e){const t={};for(const i of Object.keys(e).sort())t[i]=sd(e[i]);return t}return 0}function ad(e,t=[],i=[]){if(Array.isArray(e))e.forEach((e,s)=>ad(e,[...t,s],i));else if(e&&"object"==typeof e)for(const[s,a]of Object.entries(e))ad(a,[...t,s],i);else i.push({path:t,value:e});return i}function od(e,t){return t.reduce((e,t)=>null==e?void 0:e[t],e)}function rd(e){const t=new Map;e.forEach((e,i)=>{var s;if(!e||"object"!=typeof e||"string"!=typeof e.type)return;const a=id(e);if($t(a).includes("[["))return;const o=JSON.stringify([e.type,sd(a)]);t.set(o,[...null!==(s=t.get(o))&&void 0!==s?s:[],i])});const i=[];for(const[s,a]of t){if(a.length<2)continue;const t=a.map(t=>id(e[t])),o=ad(t[0]).map(e=>e.path).filter(e=>t.some(i=>JSON.stringify(od(i,e))!==JSON.stringify(od(t[0],e))));!o.length||o.length>8||i.push({indices:a,type:e[a[0]].type,differing:o,key:s})}return i.sort((e,t)=>t.indices.length-e.indices.length||e.indices[0]-t.indices[0])}const nd=e=>e.replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value";function ld(e){const t=e[e.length-1];if("string"==typeof t)return nd(t);const i=[...e].reverse().find(e=>"string"==typeof e);return nd(`${null!=i?i:"item"}_${t+1}`)}function dd(e){const t=e.map(ld),i=[];return e.forEach((e,s)=>{const a=(o=t[s],t.filter(e=>e===o).length>1?function(e){return nd(e.map(e=>"number"==typeof e?String(e+1):e).join("_"))}(e):t[s]);var o;i.push(ar(a,i))}),i}function cd(e){var t;const i=e.map(id),s=null!==(t=i[0])&&void 0!==t?t:{},a=ad(s).map(e=>e.path).filter(e=>i.some(t=>JSON.stringify(od(t,e))!==JSON.stringify(od(s,e)))),o=dd(a),r=JSON.parse(JSON.stringify(s));return a.forEach((e,t)=>{od(r,e.slice(0,-1))[e[e.length-1]]=`[[${o[t]}]]`}),{template:{card:r},names:o,variables:i.map(e=>a.map((t,i)=>({[o[i]]:od(e,t)}))),layout:e.map(e=>{const t={};for(const i of td)void 0!==(null==e?void 0:e[i])&&(t[i]=e[i]);return t})}}function hd(e,t,i){return Object.assign({type:"custom:decluttering-card-plus",template:e,variables:t},i)}const ud="_";function pd(e){let t="string"==typeof e?e:$t(e);if("string"!=typeof t||!t.includes("[["))return[];const i=new Set;for(let s=0;s<5;s+=1){let e=!1;if(t=t.replace(new RegExp("\\[\\[([^[\\]]*)\\]\\]","g"),(t,s)=>{if(e=!0,s.startsWith(ai))return ud;const a=s.endsWith("?")?s.slice(0,-1):s,[o,...r]=a.split("|"),n=o.endsWith("?")?o.slice(0,-1):o;if(void 0===oi(n))for(const e of[n,n.split(".")[0]])e&&e!==ud&&i.add(e);for(const e of r){const t=e.startsWith("or:")?li(e):zt(e);t&&t!==ud&&i.add(t)}return ud}),!e)break}return[...i]}function md(e,t=[]){if(Array.isArray(e)){for(const i of e)md(i,t);return t}if(!e||"object"!=typeof e)return t;Ct.includes(e.type)&&!0===e[zi]&&"string"==typeof e.template&&t.push(e.template);for(const i of Object.values(e))md(i,t);return t}function vd(e,t,i=new Set){const s=new Set;if(!e)return{names:s,complete:!0};jt in e&&(e=Object.assign(Object.assign({},e),{default:e[jt]}));for(const o of le(e))s.add(o.name);for(const o of L(ft(e))){const e=K(o);void 0!==e&&s.add(e)}for(const o of pd(e))s.add(o);let a=!0;for(const o of md(e)){if(i.has(o))continue;if(i.add(o),!Object.prototype.hasOwnProperty.call(t,o)){a=!1;continue}const e=vd(t[o],t,i);for(const t of e.names)s.add(t);e.complete||(a=!1)}return{names:s,complete:a}}function _d(e,t){const i=new Map,s=(e,t,s,a)=>{const o=JSON.stringify([e.index,t,a.name,s]),r=i.get(o);r?(r.count+=1,!r.closest&&a.closest&&(r.closest=a.closest)):i.set(o,Object.assign(Object.assign({view:e,template:t,name:a.name},a.closest?{closest:a.closest}:{}),{where:s,count:1}))},a=(e,i,o)=>{var r,n;if(Array.isArray(e))for(const t of e)a(t,i,o);else if(e&&"object"==typeof e){if(Ct.includes(e.type)&&"string"==typeof e.template){const a=Object.prototype.hasOwnProperty.call(t,e.template)?t[e.template]:void 0;if(a){const l=new Set,d=(r,n)=>{for(const d of function(e,t,i,s={lets:[],defaults:[]},a){if(!e)return[];const{names:o,complete:r}=vd(e,t);if(!r)return[];const n=new Set([...L(e.let),...s.lets].map(K).filter(e=>void 0!==e)),l=B(i),d=new Set(o);for(const _ of pd(a))d.add(_);for(const _ of[...s.lets,...s.defaults]){const e=K(_);if(void 0!==e)for(const t of pd(_[e]))d.add(t)}const c=e=>!n.has(e)&&(d.has(e)||d.has(e.split(".")[0]));let h=!0;const u=new Set;for(;h;){h=!1;for(const e of l){const t=K(e);if(!u.has(t)&&c(t)){u.add(t);for(const i of pd(e[t]))d.has(i)||(d.add(i),h=!0)}}}const p=new Set(l.map(e=>K(e))),m=[...d].filter(e=>!p.has(e)&&!n.has(e)),v=[];for(const _ of p){if(c(_))continue;const e=C(_,m);v.push(e?{name:_,closest:e}:{name:_})}return v}(a,t,n,o,[e.on_error,e.for_each_from]))l.has(d.name)||(l.add(d.name),s(i,e.template,r,d))};d("variables",e.variables);for(const t of null!==(r=$e(e.for_each))&&void 0!==r?r:[])d("for_each",t);const c=null===(n=e.for_each_from)||void 0===n?void 0:n.overrides;if(c&&"object"==typeof c)for(const e of Object.values(c))d("overrides",e)}}for(const t of Object.values(e))a(t,i,o)}};return Vi(e,(t,i,s)=>{var o,r,n;const l=e.views[i];a(t,{title:null!==(r=null!==(o=null==l?void 0:l.title)&&void 0!==o?o:null==l?void 0:l.path)&&void 0!==r?r:"",path:null!==(n=null==l?void 0:l.path)&&void 0!==n?n:"",index:i},Di(e,i,s))}),[...i.values()].map(({view:e,template:t,name:i,closest:s,where:a,count:o})=>s?{view:e,template:t,name:i,closest:s,where:a,count:o}:{view:e,template:t,name:i,where:a,count:o})}function fd(e,t,i){if(!e.includes("[["))return e;const s=e.replace(/\[\[([^[\]]+)\]\]/g,(e,s)=>s.startsWith(ai)?e:`[[${function(e,t,i){const s=e.endsWith("?"),a=(s?e.slice(0,-1):e).split("|"),o=a[0],r=o.endsWith("?"),n=r?o.slice(0,-1):o;(n===t||n.startsWith(`${t}.`))&&(a[0]=`${i}${n.slice(t.length)}${r?"?":""}`);for(let l=1;l<a.length;l+=1){const e=a[l];if(e===`or:${t}`)a[l]=`or:${i}`;else if(zt(e)===t){const s=e.startsWith("unless:")?"unless:":"if:",o=e.startsWith(`${s}!`)?"!":"";a[l]=`${s}${o}${i}${e.slice(s.length+o.length+t.length)}`}}return`${a.join("|")}${s?"?":""}`}(s,t,i)}]]`);return s.replace(new RegExp(`\\[\\[${a=t,a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=\\.\\[\\[)`,"g"),`[[${i}`);var a}function gd(e,t,i){if("string"==typeof e)return fd(e,t,i);if(Array.isArray(e))return e.map(e=>gd(e,t,i));if(e&&"object"==typeof e){const s={};for(const[a,o]of Object.entries(e))s[fd(a,t,i)]=gd(o,t,i);return s}return e}function bd(e,t,i){const s=e=>!!e&&"object"==typeof e&&!Array.isArray(e),a=(e,t)=>s(e)&&Object.prototype.hasOwnProperty.call(e,t),o=e=>{if(!s(e))return e;const a={};for(const[s,o]of Object.entries(e))s!==i&&(a[s===t?i:s]=o);return a};return Array.isArray(e)?e.some(e=>a(e,t))?e.map(o).filter(e=>!s(e)||Object.keys(e).length>0):e:a(e,t)?o(e):e}function yd(e,t,i){const s=gd(e,t,i);return Array.isArray(s.variables)?s.variables=s.variables.map(e=>e&&"object"==typeof e&&e.name===t?Object.assign(Object.assign({},e),{name:i}):e):s.variables&&"object"==typeof s.variables&&(s.variables=bd(s.variables,t,i)),void 0!==s.default&&(s.default=bd(s.default,t,i)),void 0!==s.defaults&&(s.defaults=bd(s.defaults,t,i)),void 0!==s.let&&(s.let=bd(s.let,t,i)),s}function $d(e,t,i){var s;const a=Object.assign({},e);void 0!==a.variables&&(a.variables=bd(a.variables,t,i)),Array.isArray(a.for_each)?a.for_each=a.for_each.map(e=>bd(e,t,i)):void 0!==a.for_each&&(a.for_each=bd(a.for_each,t,i));const o=null===(s=a.for_each_from)||void 0===s?void 0:s.overrides;if(o&&"object"==typeof o&&!Array.isArray(o)){const e={};for(const[s,a]of Object.entries(o))e[s]=bd(a,t,i);a.for_each_from=Object.assign(Object.assign({},a.for_each_from),{overrides:e})}return"string"==typeof a.name&&(a.name=fd(a.name,t,i)),a}function wd(e){const t=null==e?void 0:e.extends;return(Array.isArray(t)?t:[t]).filter(e=>"string"==typeof e)}function xd(e,t,i){const s=Mi(e),a=new Set([t]);for(const r of null!=i?i:[])Object.prototype.hasOwnProperty.call(s,r)||a.add(r);let o=!0;for(;o;){o=!1;for(const[e,t]of Object.entries(s))!a.has(e)&&wd(t).some(e=>a.has(e))&&(a.add(e),o=!0)}return a}function kd(e){if(!e)return[];const t=new Set(Cr(e));for(const i of pd(e))i.includes(".")||"_"===i||t.add(i);return[...t].sort()}function jd(e,t,i,s,a){const o=xd(e,t,a);let r=0,n=0;const l=(e,t)=>JSON.stringify(e)!==JSON.stringify(t),d=e=>{if(Array.isArray(e))return e.map(d);if(!e||"object"!=typeof e)return e;let t={};for(const[i,s]of Object.entries(e))t[i]=d(s);if(Ct.includes(e.type)&&o.has(e.template)){const e=$d(t,i,s);l(e,t)&&(r+=1),t=e}if(V(e.type)&&o.has(e.template)){const e=yd(t,i,s);l(e,t)&&(n+=1),t=e}return t},c=Object.assign({},e);Array.isArray(null==e?void 0:e.views)&&(c.views=d(e.views));const h=null==e?void 0:e.decluttering_templates;if(h&&"object"==typeof h){const e={};for(const[t,a]of Object.entries(h)){let r=d(a);if(o.has(t)){const e=yd(r,i,s);l(e,r)&&(n+=1),r=e}e[t]=r}c.decluttering_templates=e}return{config:c,cards:r,templates:n}}function Od(e,t,i){if(Object.prototype.hasOwnProperty.call(Mi(e),t))return!1;if(i===Fi)return!0;const s=Hi(e);return s.includes(i)||s.includes("*")}function Ad(e){const t=cr(e),i=t?e[t]:void 0;return i&&"object"==typeof i&&!Array.isArray(i)?i:{}}function Sd(e,t,i=new Set){const s=e[t];if(!s||i.has(t))return{};i.add(t);let a={};for(const n of yt(s))a=Object.assign(Object.assign({},a),Sd(e,n,i));const o=Ad(s),r=Object.assign({},a);for(const[n,l]of Object.entries(o))null===l?delete r[n]:r[n]=l;return r}function Cd(e,t,i,s){const a=e[t],o=yt(a),r=Ad(a),n=o.length?Sd(e,o[o.length-1],new Set([t])):{},l=o.length>1?o.reduce((i,s)=>Object.assign(Object.assign({},i),Sd(e,s,new Set([t]))),{}):n,d={name:t,children:[],uses:i(t),deprecated:void 0!==D(a),sets:o.length?[]:Object.keys(r),changes:o.length?Object.keys(r).filter(e=>e in l&&null!==r[e]&&!function(e,t){return JSON.stringify(e)===JSON.stringify(t)}(r[e],l[e])):[],adds:o.length?Object.keys(r).filter(e=>!(e in l)&&null!==r[e]):[],drops:o.length?Object.keys(r).filter(e=>null===r[e]):[]},c=o.find(t=>!e[t]);c&&(d.missingParent=c),s.add(t);for(const h of Object.keys(e)){if(s.has(h))continue;const a=yt(e[h]);a.length&&a[a.length-1]===t&&d.children.push(Cd(e,h,i,s))}return d.children.sort((e,t)=>e.name.localeCompare(t.name)),d}class Pd extends r{constructor(){super(...arguments),this._renameTo="",this._renaming=!1,this._duplicateTo="",this._busy=!1,this._modernisePending=!1,this._similarNames={},this._searchQuery="",this._searching=!1,this._varTo=""}get _config(){return this.config}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=H())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:se()}static get styles(){return Er}_fireConfigChanged(e){M(this,"config-changed",{config:e})}_saveDashboard(e,t,i){return co(this,e,t,i)}render(){return this.hass&&this._config?this._renderUsages():e``}_renderUsages(){var t,i;const s=null===(t=this._config)||void 0===t?void 0:t.template;if(!s)return e``;const a=this._savedLovelace;if(!a)return e`<div class="usages">
        <ha-alert alert-type="warning">${c("template_editor.usages_unreadable",void 0,this.hass)}</ha-alert>
      </div>`;(null===(i=this._usages)||void 0===i?void 0:i.name)===s&&this._usages.ll===a||(this._usages={name:s,ll:a,usages:Ri(a,s)});const{views:o,templates:r}=this._usages.usages,n=o.reduce((e,t)=>e+t.count,0),l=document.location.pathname.split("/").slice(0,2).join("/");return e`
      <div class="usages">
        ${0!==n||r.length?e`
                <p class="hint">
                  ${c(1===n?"template_editor.usages_one":"template_editor.usages_many",{total:n,name:s},this.hass)}
                </p>
                <ul>
                  ${o.map(t=>e`
                      <li>
                        <a href=${`${l}/${t.path||t.index}`} target="_blank" rel="noreferrer">
                          ${t.title||t.path||c("template_editor.untitled_view",void 0,this.hass)}
                        </a>
                        —
                        ${1===t.count?c("template_editor.used_once",void 0,this.hass):c("template_editor.used_times",{count:t.count},this.hass)}
                      </li>
                    `)}
                </ul>
              `:e`<ha-alert alert-type="info">
                ${c("template_editor.usages_none",{name:s},this.hass)}
              </ha-alert>`}
        ${r.length?e`<ha-alert alert-type="info">
                ${c(1===r.length?"template_editor.used_by_template":"template_editor.used_by_templates",{names:r.join(", ")},this.hass)}
              </ha-alert>`:e``}
        ${this._renderElsewhere(s)} ${this._renderFamily(a,s)} ${this._renderImpact(a,s)}
        <decluttering-card-plus-health .hass=${this.hass} .lovelace=${a}
          >${this._renderUndo()}</decluttering-card-plus-health
        >
        ${this._renderSimilar(a)} ${this._renderSearch()} ${this._renderRename(s,n)}
        ${this._renderRenameVariable(s)} ${this._renderDuplicate(s)} ${this._renderModernise()}
        ${this._toolError?e`<ha-alert alert-type="error">${this._toolError}</ha-alert>`:e``}
      </div>
    `}_renderUndo(){var t,i;const s=qi();if(!s)return e``;const a=I(s.operation,this.hass),o=new Date(s.at).toLocaleTimeString(null===(i=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===i?void 0:i.language);return e`
      <div class="undo">
        <p class="hint">${c("undo.held",{operation:a,time:o},this.hass)}</p>
        ${this._undoChanged?e`<ha-alert alert-type="warning">
                ${c("undo.changed_here",{operation:a,dashboards:this._undoChanged.join(", ")},this.hass)}
              </ha-alert>`:e``}
        <ha-button .disabled=${this._busy} @click=${this._undo}>
          ${c(this._undoChanged?"undo.anyway_button":"undo.button",{operation:a},this.hass)}
        </ha-button>
      </div>
    `}async _undo(){const e=qi();if(e){this._busy=!0;try{const t=await Ii(this,this.hass,e,!!this._undoChanged,!1);this._undoChanged="changed"===(null==t?void 0:t.result)?t.dashboards:void 0}finally{this._busy=!1}}}_renderSimilar(t){var i;if((null===(i=this._similar)||void 0===i?void 0:i.ll)!==t){const e=Wi(t);this._similar={ll:t,cards:e,groups:rd(e.map(e=>e.config))}}const{cards:s,groups:a}=this._similar;if(!a.length)return e``;const o=Object.keys(re(t));return e`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${c(1===a.length?"tools.similar_header_one":"tools.similar_header",{count:a.length},this.hass)}
        </span>
        <p class="hint">${c("tools.similar_hint",{max:8},this.hass)}</p>
        ${a.slice(0,10).map(e=>this._renderSimilarGroup(e,s,o))}
      </ha-expansion-panel>
    `}_renderSimilarGroup(t,i,s){var a;const o=t.indices.map(e=>i[e]),r=cd(o.map(e=>e.config)),n=(null!==(a=this._similarNames[t.key])&&void 0!==a?a:function(e,t,i=[]){let s=nd(e.replace(/^custom:/,"").replace(/-/g,"_")).toLowerCase();/(^|_)card$/.test(s)||(s=`${s}_card`);const a=new Set(i.map(e=>"string"==typeof(null==e?void 0:e.entity)&&e.entity.includes(".")?e.entity.split(".")[0]:"")),[o]=[...a];return 1===a.size&&o&&(s=`${nd(o).toLowerCase()}_${s}`),ar(s,t)}(t.type,s,o.map(e=>e.config))).trim(),l=this._similarPending===`${t.key}\0${n}`,d=s.includes(n);return e`
      <div class="similar">
        <h3>${c("tools.similar_group",{count:o.length,type:t.type},this.hass)}</h3>
        <p class="hint">${c("tools.similar_differ",{names:r.names.join(", ")},this.hass)}</p>
        <ul>
          ${o.slice(0,8).map(t=>e`<li>${t.label}</li>`)}
        </ul>
        ${o.length>8?e`<p class="hint">
                ${c("editor.matches_more",{count:o.length-8},this.hass)}
              </p>`:e``}
        ${d?e`<ha-alert alert-type="error">${c("tools.name_taken",{name:n},this.hass)}</ha-alert>`:e``}
        ${l?e`
                <ha-alert alert-type="warning">
                  ${c("tools.similar_confirm",{name:n,count:o.length},this.hass)}
                </ha-alert>
                <p class="hint">${c("tools.similar_template",{name:n},this.hass)}</p>
                ${Lr(`${t.key}\0${n}`,e`<ha-yaml-editor
                    .hass=${this.hass}
                    .defaultValue=${{[n]:r.template}}
                    read-only
                  ></ha-yaml-editor>`)}
                <p class="hint">${c("tools.similar_first_card",void 0,this.hass)}</p>
                ${Sn(o[0].config,hd(n,r.variables[0],r.layout[0]),this.hass)}
              `:e``}
        ${Ji({label:c("tools.similar_name",void 0,this.hass),value:n,disabled:this._busy,onInput:e=>{this._similarNames=Object.assign(Object.assign({},this._similarNames),{[t.key]:e}),this._similarPending=void 0}})}
        <ha-button
          .disabled=${this._busy||!n||d}
          @click=${()=>{this._makeTemplate(t,o,n)}}
        >
          ${c(l?"tools.similar_make_anyway":"tools.similar_make",void 0,this.hass)}
        </ha-button>
      </div>
    `}async _makeTemplate(e,t,i){const s=`${e.key}\0${i}`;if(this._similarPending!==s)return void(this._similarPending=s);const a=await this._saveDashboard(e=>function(e,t,i){const{template:s,variables:a,layout:o}=cd(t);let r=ui(e,i,s);return t.forEach((e,t)=>{r=Ne(r,e,hd(i,a[t],o[t]))}),r}(e,t.map(e=>e.config),i),"make_template");if(a){this._similarPending=void 0;const t=Object.assign({},this._similarNames);delete t[e.key],this._similarNames=t}}_renderElsewhere(t){var i;if((null===(i=this._remoteUsages)||void 0===i?void 0:i.name)!==t){this._remoteUsages={name:t,list:[]};const e=document.location.pathname.split("/").filter(Boolean)[0];Ui(this.hass,t,e).then(e=>{var i;(null===(i=this._remoteUsages)||void 0===i?void 0:i.name)===t&&(this._remoteUsages={name:t,list:e})})}const s=this._remoteUsages.list;if(!s.length)return e``;const a=s.map(e=>`${e.urlPath} (${e.total})`).join(", ");return e`<ha-alert alert-type="info">
      ${c("template_editor.usages_elsewhere",{list:a},this.hass)}
    </ha-alert>`}_renderFamily(t,i){const s=Mi(t),a=function(e,t){const i=Object.keys(e),s=new Set;for(const r of i){const t=yt(e[r]);t.length&&s.add(t[t.length-1])}const a=new Set,o=[];for(const r of i.sort()){const i=yt(e[r]),n=i.length>0&&!i.every(t=>e[t]);i.length&&!n||a.has(r)||(s.has(r)||n)&&o.push(Cd(e,r,t,a))}return o}(s,e=>Ri(t,e).views.reduce((e,t)=>e+t.count,0)),o=function(e,t){const i=e=>e.name===t||e.children.some(i);return e.find(i)}(a,i);if(!o)return e``;const r=function(e){let t=0,i=0;const s=e=>{t+=1,i+=e.uses,e.children.forEach(s)};return s(e),{templates:t,cards:i}}(o),n=document.location.pathname.split("/").slice(0,2).join("/"),d=function(e,t){const i=[],s=(t,a)=>{if(!a.has(t)&&e[t]){a.add(t);for(const i of yt(e[t]))s(i,a);i.push(t)}};return s(t,new Set),i.map(t=>({from:t,content:Ad(e[t])}))}(s,i);return e`
      <div class="family">
        <h3>${c("family.header",void 0,this.hass)}</h3>
        <p class="hint">${c("family.hint",{templates:r.templates,cards:r.cards},this.hass)}</p>
        <ul class="tree">
          ${this._renderFamilyNode(o,i,t,n)}
        </ul>
        ${d.length>1?e`
                <ha-expansion-panel outlined>
                  <span slot="header">${c("family.layers_header",{name:i},this.hass)}</span>
                  <pre class="layers">
${d.map(e=>`# ${c("family.from",{name:e.from},this.hass)}\n${l(e.content).replace(/\s+$/,"")}`).join("\n")}</pre>
                </ha-expansion-panel>
              `:e``}
      </div>
    `}_renderFamilyNode(t,i,s,a){const o=Ve(s,t.name),r=[],n=(e,t)=>{t.length&&r.push(c(e,{keys:t.join(", ")},this.hass))};n("family.sets",t.sets),n("family.changes",t.changes),n("family.adds",t.adds),n("family.drops",t.drops),t.missingParent&&r.push(c("family.missing_parent",{name:t.missingParent},this.hass));const l=1===t.uses?c("template_editor.used_once",void 0,this.hass):c("template_editor.used_times",{count:t.uses},this.hass);return e`
      <li>
        <span class="node ${t.name===i?"me":""} ${t.deprecated?"dep":""}">
          ${(null==o?void 0:o.view)&&t.name!==i?e`<a href=${`${a}/${o.view.path||o.view.index}`} target="_blank" rel="noreferrer"
                  ><code>${t.name}</code></a
                >`:e`<code>${t.name}</code>`}
          <small>${t.deprecated?c("family.deprecated",void 0,this.hass)+" · ":""}${l}</small>
          ${r.length?e`<small class="ov">${r.join(" · ")}</small>`:e``}
        </span>
        ${t.children.length?e`<ul>
                ${t.children.map(e=>this._renderFamilyNode(e,i,s,a))}
              </ul>`:e``}
      </li>
    `}_renderImpact(t,i){const s=Bi(t,i);if(!s||!this._config)return e``;const a=e=>{if(e)return b(s.variables,e,_e(e),i,this.hass,!0)};let o,r;try{o=a(re(t)[i]),r=a(re(t,void 0,this._config)[i])}catch(n){return e``}return e`
      <ha-expansion-panel outlined>
        <span slot="header">${c("template_editor.impact_header",void 0,this.hass)}</span>
        <p class="hint">${c("template_editor.impact_diff_hint",void 0,this.hass)}</p>
        ${Cn(o,r,this.hass)}
      </ha-expansion-panel>
    `}_renderRename(t,i){const s=this._renameTo.trim(),a=!!s&&this._renamePending===s,o=i?1===i?c("tools.rewrites_one",void 0,this.hass):c("tools.rewrites_many",{count:i},this.hass):"";return e`
      <div class="rename">
        <h3>${c("tools.rename_header",void 0,this.hass)}</h3>
        <p class="hint">${c("tools.rename_hint",void 0,this.hass)}</p>
        ${this._renameError?e`<ha-alert alert-type="error">${this._renameError}</ha-alert>`:e``}
        ${a?e`<ha-alert alert-type="warning">
                ${c("tools.rename_confirm",{from:t,to:s,rewrites:o},this.hass)}
              </ha-alert>`:e``}
        ${Ji({label:c("tools.new_name",void 0,this.hass),value:this._renameTo,disabled:this._renaming,onInput:e=>this._renameChanged(e)})}
        <ha-button .disabled=${this._renaming||!s||s===t} @click=${this._rename}>
          ${a?c("tools.rename_anyway",void 0,this.hass):1===i?c("tools.rename_update_one",void 0,this.hass):i?c("tools.rename_update_many",{count:i},this.hass):c("tools.rename",void 0,this.hass)}
        </ha-button>
      </div>
    `}_renderModernise(){const t=this._savedLovelace,i=t?Ki(t):0;return i?e`
      <div class="rename">
        <h3>${c("tools.modernise_header",void 0,this.hass)}</h3>
        <p class="hint">
          ${c(1===i?"tools.modernise_hint_one":"tools.modernise_hint_many",{count:i},this.hass)}
        </p>
        ${this._modernisePending?e`<ha-alert alert-type="warning">
                ${c(1===i?"tools.modernise_confirm_one":"tools.modernise_confirm_many",{count:i},this.hass)}
              </ha-alert>`:e``}
        <ha-button .disabled=${this._busy} @click=${this._modernise}>
          ${c(this._modernisePending?"tools.modernise_anyway":1===i?"tools.modernise_one":"tools.modernise_many",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}async _modernise(){if(!this._modernisePending)return void(this._modernisePending=!0);await this._saveDashboard(e=>Zi(e),"modernise")&&(this._modernisePending=!1)}_renameChanged(e){this._renameTo=e,this._renameError=void 0,this._renamePending=void 0}async _rename(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._renameTo.trim();if(!i||!s||s===i)return;const a=H();if(a)if(void 0===re(a.config)[s])if(this._renamePending===s){this._renaming=!0,this._renameError=void 0;try{await R(this,this.hass,"rename_template",[{urlPath:q(),build:e=>Yi(e,i,s)}],this._config),this._undoChanged=void 0,this._fireConfigChanged(Object.assign(Object.assign({},this._config),{template:s})),this._renameTo="",this._renamePending=void 0}catch(o){this._renameError=c("tools.save_failed",{message:null!==(t=null==o?void 0:o.message)&&void 0!==t?t:o},this.hass)}finally{this._renaming=!1}}else this._renamePending=s;else this._renameError=c("tools.name_taken",{name:s},this.hass);else this._renameError=c("tools.cannot_rename_here",void 0,this.hass)}_renderSearch(){const t=this._searchQuery.trim(),i=this._searchResult,s=e=>"variables"===e.where?"":c(`tools.search_in_${e.where}`,void 0,this.hass),a=e=>e.view.title||e.view.path||c("template_editor.untitled_view",void 0,this.hass);return e`
      <div class="rename">
        <h3>${c("tools.search_header",void 0,this.hass)}</h3>
        <p class="hint">${c("tools.search_hint",void 0,this.hass)}</p>
        ${Ji({label:c("tools.search_label",void 0,this.hass),value:this._searchQuery,onInput:e=>{this._searchQuery=e},onKeydown:e=>{"Enter"===e.key&&this._search()}})}
        <ha-button .disabled=${this._searching||!t} @click=${()=>{this._search()}}>
          ${c(this._searching?"tools.searching":"tools.search",void 0,this.hass)}
        </ha-button>
        ${!i||i.cards.length||i.templates.length?e``:e`<p class="hint">${c("tools.search_none",{query:i.query},this.hass)}</p>`}
        ${(null==i?void 0:i.cards.length)?e`
                <p class="hint">${c("tools.search_cards",{count:i.cards.length},this.hass)}</p>
                <ul>
                  ${i.cards.slice(0,oo).map(t=>e`
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
                ${i.cards.length>oo?e`<p class="hint">
                        ${c("editor.matches_more",{count:i.cards.length-oo},this.hass)}
                      </p>`:e``}
              `:e``}
        ${(null==i?void 0:i.templates.length)?e`
                <p class="hint">${c("tools.search_templates",{count:i.templates.length},this.hass)}</p>
                <ul>
                  ${i.templates.slice(0,oo).map(t=>e`<li>
                          ${t.urlPath} › ${t.template}: <code>${t.path}</code> = ${t.value}
                        </li>`)}
                </ul>
                ${i.templates.length>oo?e`<p class="hint">
                        ${c("editor.matches_more",{count:i.templates.length-oo},this.hass)}
                      </p>`:e``}
              `:e``}
      </div>
    `}async _search(){const e=this._searchQuery.trim();if(e&&!this._searching){this._searching=!0;try{const i=q(),s=_i(this.hass),a=[{urlPath:i,config:this._savedLovelace}];for(const e of this.hass?await Gi(this.hass):[])if(Qi(e)!==i)try{a.push({urlPath:e,config:await fi(s,e)})}catch(t){}this._searchResult=Object.assign({query:e},function(e,t){var i;const s=t.trim().toLowerCase(),a=[],o=[];if(!s)return{cards:a,templates:o};const r=e=>e.toLowerCase().includes(s);for(const{urlPath:n,config:l}of e){const e=(e,t)=>{var i,s;const o=(i,s,o)=>{a.push({urlPath:n,view:t,template:e.template,where:i,variable:s,value:o})},l=(e,t,i="")=>{for(const s of B(t)){const[t,a]=Object.entries(s)[0];for(const s of ed(a,`${i}${t}`))r(s.value)&&o(e,s.path,s.value)}};l("variables",e.variables);for(const a of null!==(i=$e(e.for_each))&&void 0!==i?i:[])l("for_each",a);const d=null===(s=e.for_each_from)||void 0===s?void 0:s.overrides;if(d&&"object"==typeof d)for(const[a,n]of Object.entries(d))r(a)&&o("overrides",a,a),l("overrides",n,`${a} › `);for(const a of Xl)if(void 0!==e[a])for(const t of ed(e[a],a))r(t.value)&&o("override_block",t.path,t.value)},t=(i,s)=>{if(Array.isArray(i))for(const e of i)t(e,s);else if(i&&"object"==typeof i&&!V(i.type)){Ct.includes(i.type)&&"string"==typeof i.template&&e(i,s);for(const e of Object.values(i))t(e,s)}};(null!==(i=null==l?void 0:l.views)&&void 0!==i?i:[]).forEach((e,i)=>{var s,a,o;return t(e,{title:null!==(a=null!==(s=null==e?void 0:e.title)&&void 0!==s?s:null==e?void 0:e.path)&&void 0!==a?a:"",path:null!==(o=null==e?void 0:e.path)&&void 0!==o?o:"",index:i})});for(const[i,s]of Object.entries(Mi(l))){const e=Object.assign({},null!=s?s:{});delete e.type,delete e.template;for(const t of ed(e,""))r(t.value)&&o.push(Object.assign({urlPath:n,template:i},t))}}return{cards:a,templates:o}}(a,e))}finally{this._searching=!1}}}_renderRenameVariable(t){const i=kd(this._config);if(!i.length||!this._config)return e``;const s=this._varFrom&&i.includes(this._varFrom)?this._varFrom:void 0,a=this._varTo.trim(),o=this._varPending,r=!!o&&o.from===s&&o.to===a,n=r&&o.elsewhere.length?c("tools.rename_variable_elsewhere",{list:o.elsewhere.map(e=>`${e.urlPath} (${e.cards})`).join(", ")},this.hass):"";return e`
      <div class="rename">
        <h3>${c("tools.rename_variable_header",void 0,this.hass)}</h3>
        <p class="hint">${c("tools.rename_variable_hint",void 0,this.hass)}</p>
        ${this._varError?e`<ha-alert alert-type="error">${this._varError}</ha-alert>`:e``}
        ${r&&s?e`
                <ha-alert alert-type="warning">
                  ${c("tools.rename_variable_confirm",{from:s,to:a,templates:o.templates,cards:o.cards,elsewhere:n},this.hass)}
                </ha-alert>
                ${Sn(this._config,yd(this._config,s,a),this.hass)}
              `:e``}
        <ha-form
          .hass=${this.hass}
          .data=${{variable:null!=s?s:""}}
          .schema=${[{name:"variable",selector:{select:{mode:"dropdown",options:i.map(e=>({value:e,label:e}))}}}]}
          .computeLabel=${()=>c("tools.rename_variable_pick",void 0,this.hass)}
          @value-changed=${this._varPicked}
        ></ha-form>
        ${Ji({label:c("tools.new_name",void 0,this.hass),value:this._varTo,disabled:this._busy,onInput:e=>this._varToChanged(e)})}
        <ha-button
          .disabled=${this._busy||!s||!a||a===s}
          @click=${()=>{this._renameVariable(t)}}
        >
          ${c(r?"tools.rename_anyway":"tools.rename_variable",void 0,this.hass)}
        </ha-button>
      </div>
    `}_varPicked(e){e.stopPropagation(),this._varFrom=e.detail.value.variable||void 0,this._varError=void 0,this._varPending=void 0}_varToChanged(e){this._varTo=e,this._varError=void 0,this._varPending=void 0}async _renameVariable(e){var t;const i=this._varFrom,s=this._varTo.trim();if(!i||!s||s===i||!this._config)return;if(!function(e){return/^[A-Za-z0-9_-]+$/.test(e)}(s))return void(this._varError=c("tools.rename_variable_invalid",{name:s},this.hass));const a=H();if(!a)return void(this._varError=c("tools.cannot_save_here",void 0,this.hass));if(function(e,t,i,s){const a=Mi(e);for(const o of xd(e,t))if(kd(o===t&&s?s:a[o]).includes(i))return!0;return!1}(a.config,e,s,this._config))return void(this._varError=c("tools.rename_variable_taken",{name:s},this.hass));const o=q(),r=this._varPending;if(r&&r.from===i&&r.to===s){this._busy=!0,this._varError=void 0;try{let t;await R(this,this.hass,"rename_variable",[{urlPath:o,build:a=>(t=xd(a,e),jd(a,e,i,s).config)},...r.elsewhere.map(a=>({urlPath:a.urlPath,build:a=>Od(a,e,o)?jd(a,e,i,s,t).config:a}))],this._config),this._undoChanged=void 0,this._fireConfigChanged(yd(this._config,i,s)),this._varFrom=s,this._varTo="",this._varPending=void 0}catch(n){this._varError=c("tools.save_failed",{message:null!==(t=null==n?void 0:n.message)&&void 0!==t?t:n},this.hass)}finally{this._busy=!1}}else{this._busy=!0;try{const t=_i(this.hass),r=await fi(t,o).catch(()=>a.config),n=jd(r,e,i,s),d=xd(r,e),c=[];for(const a of this.hass?await Gi(this.hass):[]){if(Qi(a)===o)continue;let r;try{r=await fi(t,a)}catch(l){continue}if(!Od(r,e,o))continue;const n=jd(r,e,i,s,d);(n.cards||n.templates)&&c.push({urlPath:a,cards:n.cards})}this._varPending={from:i,to:s,cards:n.cards,templates:n.templates,elsewhere:c}}finally{this._busy=!1}}}_renderDuplicate(t){const i=this._duplicateTo.trim(),s=!!i&&this._duplicatePending===i;return e`
      <div class="rename">
        <h3>${c("tools.duplicate_header",void 0,this.hass)}</h3>
        <p class="hint">${c("tools.duplicate_hint",void 0,this.hass)}</p>
        ${s?e`<ha-alert alert-type="warning">
                ${c("tools.duplicate_confirm",{to:i,name:t},this.hass)}
              </ha-alert>`:e``}
        ${Ji({label:c("tools.copy_name",void 0,this.hass),value:this._duplicateTo,disabled:this._busy,onInput:e=>this._duplicateChanged(e)})}
        <ha-button .disabled=${this._busy||!i||i===t} @click=${this._duplicate}>
          ${c(s?"tools.duplicate_anyway":"tools.duplicate",void 0,this.hass)}
        </ha-button>
      </div>
    `}_duplicateChanged(e){this._duplicateTo=e,this._toolError=void 0,this._duplicatePending=void 0}async _duplicate(){var e,t;const i=null===(e=this._config)||void 0===e?void 0:e.template,s=this._duplicateTo.trim();if(!i||!s||s===i)return;const a=H();if(a&&void 0!==re(a.config)[s])return void(this._toolError=c("tools.name_taken",{name:s},this.hass));if(this._duplicatePending!==s)return void(this._duplicatePending=s);const o=Object.assign(Object.assign({},this._config),{template:s}),r=Ve(null!==(t=null==a?void 0:a.config)&&void 0!==t?t:this.lovelace,i),n=await this._saveDashboard(e=>{var t,i;return pi(e,null!==(i=null===(t=null==r?void 0:r.view)||void 0===t?void 0:t.index)&&void 0!==i?i:0,o)},"duplicate");n&&(this._duplicateTo="",this._duplicatePending=void 0)}}function Ed(e){var t;return null!==(t=he(e))&&void 0!==t?t:xt(e)?"function":"card"}s([a({attribute:!1})],Pd.prototype,"hass",void 0),s([a({attribute:!1})],Pd.prototype,"lovelace",void 0),s([a({attribute:!1})],Pd.prototype,"config",void 0),s([o()],Pd.prototype,"_renameTo",void 0),s([o()],Pd.prototype,"_renameError",void 0),s([o()],Pd.prototype,"_renaming",void 0),s([o()],Pd.prototype,"_renamePending",void 0),s([o()],Pd.prototype,"_duplicateTo",void 0),s([o()],Pd.prototype,"_duplicatePending",void 0),s([o()],Pd.prototype,"_toolError",void 0),s([o()],Pd.prototype,"_busy",void 0),s([o()],Pd.prototype,"_modernisePending",void 0),s([o()],Pd.prototype,"_remoteUsages",void 0),s([o()],Pd.prototype,"_undoChanged",void 0),s([o()],Pd.prototype,"_similarNames",void 0),s([o()],Pd.prototype,"_similarPending",void 0),s([o()],Pd.prototype,"_searchQuery",void 0),s([o()],Pd.prototype,"_searching",void 0),s([o()],Pd.prototype,"_searchResult",void 0),s([o()],Pd.prototype,"_varFrom",void 0),s([o()],Pd.prototype,"_varTo",void 0),s([o()],Pd.prototype,"_varError",void 0),s([o()],Pd.prototype,"_varPending",void 0),customElements.get("decluttering-template-usages-tab")||customElements.define("decluttering-template-usages-tab",Pd);class Ld extends r{constructor(){super(...arguments),this._selectedTab="settings",this._updateCount=0,this._suggestedNothing=!1,this._busy=!1,this._declutterPending=!1,this._promoteName="",this._loadedElements=!1,this._announcement="",this._onAnnounce=e=>{var t,i;e.stopPropagation(),this._announce(String(null!==(i=null===(t=e.detail)||void 0===t?void 0:t.text)&&void 0!==i?i:""))},this._tabPointerAt=0,this._tabChooseAt=0}get _savedLovelace(){var e,t,i;return null!==(i=null!==(t=null===(e=H())||void 0===e?void 0:e.config)&&void 0!==t?t:this.lovelace)&&void 0!==i?i:se()}static describeSchema(){var e;return null!==(e=Ld._describeSchema)&&void 0!==e||(Ld._describeSchema=[{name:"template",label:c("template_editor.template_label"),selector:{text:{}}},{name:"thingType",label:c("template_editor.type_label"),selector:{select:{mode:"dropdown",options:[{value:"card",label:c("template_editor.type_card")},{value:"badge",label:c("template_editor.type_badge")},{value:"row",label:c("template_editor.type_row")},{value:"element",label:c("template_editor.type_element")},{value:"function",label:c("template_editor.type_function")}]}}},{name:"description",label:c("template_editor.description_label"),helper:c("template_editor.description_helper"),selector:{text:{multiline:!0}}},{name:"category",label:c("template_editor.category_label"),helper:c("template_editor.category_helper"),selector:{text:{}}}]),Ld._describeSchema}static defaultsSchema(){var e;return null!==(e=Ld._defaultsSchema)&&void 0!==e||(Ld._defaultsSchema=[{name:"default",label:c("template_editor.defaults_label"),helper:c("template_editor.defaults_helper"),selector:{object:{}}}]),Ld._defaultsSchema}setConfig(e){this._config=e,this._suggestion=void 0,this._suggestedNothing=!1}render(){if(!this.hass||!this._config)return e``;const t={};de(this._config.default)&&de(this._config.defaults)||(t.default=c("error.variables_shape",void 0,this.hass)),Xi(this._config.variables)||(t.variables=c("template_editor.declarations_shape",void 0,this.hass));const i={template:this._config.template,thingType:Ed(this._config),description:this._config.description,category:this._config.category},s={default:ft(this._config)},a=le(this._config).length,o=this._renderPills(),r=c("card"===this._selectedTab?"template_editor.tab_card":"change_card"===this._selectedTab?"template_editor.tab_change_card":"row"===this._selectedTab?"template_editor.tab_row":"usages"===this._selectedTab?"template_editor.tab_usages":"share"===this._selectedTab?"template_editor.tab_share":"template_editor.tab_settings",void 0,this.hass);return e`
      <div class="sr-only" role="status" aria-live="polite">${this._announcement}</div>
      <ha-tab-group
        .active=${this._selectedTab}
        @click=${this._activateTab}
        @pointerdown=${this._tabPointer}
        @keydown=${this._tabKey}
        @wa-tab-show=${this._tabShown}
        @sl-tab-show=${this._tabShown}
      >
        <ha-tab-group-tab slot="nav" panel="settings">
          ${c("template_editor.tab_settings",void 0,this.hass)}
        </ha-tab-group-tab>
        ${"card"===i.thingType&&void 0===this._config.group?e`
                <ha-tab-group-tab slot="nav" panel="card">
                  ${c("template_editor.tab_card",void 0,this.hass)}
                </ha-tab-group-tab>
                <ha-tab-group-tab slot="nav" panel="change_card">
                  ${c("template_editor.tab_change_card",void 0,this.hass)}
                </ha-tab-group-tab>
              `:"row"===i.thingType?e`<ha-tab-group-tab slot="nav" panel="row">
                  ${c("template_editor.tab_row",void 0,this.hass)}
                </ha-tab-group-tab>`:e``}
        <ha-tab-group-tab slot="nav" panel="usages">
          ${c("template_editor.tab_usages",void 0,this.hass)} ${o.usages}
        </ha-tab-group-tab>
        <ha-tab-group-tab slot="nav" panel="share">
          ${c("template_editor.tab_share",void 0,this.hass)} ${o.share}
        </ha-tab-group-tab>
      </ha-tab-group>
      <decluttering-example-strip
        .hass=${this.hass}
        .lovelace=${this._savedLovelace}
        .config=${this._config}
        @config-changed=${this._childConfigChanged}
      ></decluttering-example-strip>
      <h3 id="panel-heading" class="sr-only" tabindex="-1">${r}</h3>
      ${"settings"===this._selectedTab?e`
              <ha-expansion-panel outlined expanded>
                <span slot="header">${c("template_editor.panel_describe",void 0,this.hass)}</span>
                <div class="panel">
                  ${this._renderInUse()}
                  ${Ld.describeSchema().map(t=>e`
                      <div class="field-row">
                        <ha-form
                          .hass=${this.hass}
                          .data=${i}
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
                  >${c("template_editor.panel_variables",void 0,this.hass)}
                  <small>${c("declarations.count",{count:a},this.hass)}</small></span
                >
                <div class="panel">
                  ${this._renderDiagnostics()}
                  ${t.variables?e`<ha-alert alert-type="error">${t.variables}</ha-alert>`:e``}
                  <div class="field-row help-only">
                    <decluttering-help .hass=${this.hass} key="variables"></decluttering-help>
                  </div>
                  <decluttering-declarations-editor
                    .hass=${this.hass}
                    .variables=${this._config.variables}
                    .shared=${Ni(this._savedLovelace)}
                    .texts=${this._resolvedTexts()}
                    @value-changed=${this._declarationsChanged}
                  ></decluttering-declarations-editor>
                  <div class="field-row">
                    <ha-form
                      .hass=${this.hass}
                      .data=${s}
                      .schema=${Ld.defaultsSchema()}
                      .error=${t}
                      .computeLabel=${e=>{var t;return null!==(t=e.label)&&void 0!==t?t:e.name}}
                      .computeHelper=${e=>{var t;return null!==(t=e.helper)&&void 0!==t?t:""}}
                      @value-changed=${this._defaultsChanged}
                    ></ha-form>
                    <decluttering-help .hass=${this.hass} key="default"></decluttering-help>
                  </div>
                  ${this._renderLint()} ${this._renderSuggest("card"===i.thingType)}
                </div>
              </ha-expansion-panel>
              <ha-expansion-panel outlined>
                <span slot="header">${c("template_editor.panel_tools",void 0,this.hass)}</span>
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
                ${this._renderCardPreview()}
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
                        @updates-found=${e=>{e.stopPropagation(),this._updateCount=e.detail}}
                      ></decluttering-template-share-tab>`:e``}
    `}_renderDiagnostics(){if(!this._config||!Xi(this._config.variables))return e``;const{unused:t,duplicated:i,contradictory:s}=es(this._config);return e`
      ${t.length?e`<ha-alert alert-type="info">
              ${c(1===t.length?"template_editor.declared_unused_one":"template_editor.declared_unused_many",{names:t.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${i.length?e`<ha-alert alert-type="warning">
              ${c(1===i.length?"template_editor.duplicated_one":"template_editor.duplicated_many",{names:i.join(", ")},this.hass)}
            </ha-alert>`:e``}
      ${s.length?e`<ha-alert alert-type="warning">
              ${c(1===s.length?"template_editor.contradictory_one":"template_editor.contradictory_many",{names:s.join(", ")},this.hass)}
            </ha-alert>`:e``}
    `}_cardForEditor(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.card;if(!this._config||t&&"object"==typeof t&&"string"==typeof t.type)return t;const i=re(this._savedLovelace,void 0,this._config)[this._config.template],s=null==i?void 0:i.card;return s&&"object"==typeof s&&"string"==typeof s.type?s:t}_renderCardFromParents(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.card;if(!this._config||i&&"object"==typeof i&&"string"==typeof i.type)return e``;const s=yt(this._config);return s.length?e`<ha-alert alert-type="info">
      ${c("template_editor.card_from_parents",{parents:s.join(", ")},this.hass)}
    </ha-alert>`:e``}_resolvedTexts(){if(!this._config)return;const e=re(this._savedLovelace,void 0,this._config)[this._config.template];return null!=e?e:this._config}_renderLint(){if(!this._config)return e``;const t=this._savedLovelace,i=re(t,void 0,this._config)[this._config.template],s=be(t),a=[...ts(s),...xt(this._config)&&this._config.template?[this._config.template]:[]],o=Pr(this._config,[...Cr(i),...Object.keys(s)],{name:this._config.template,functions:a});return o.length?e`${o.map(t=>e`<ha-alert alert-type=${t.level}>
          ${c(t.key,t.params,this.hass)}${t.params.closest?c("error.did_you_mean",{closest:t.params.closest},this.hass):""}${t.path?c("lint.where",{path:t.path},this.hass):""}
        </ha-alert>`)}`:e``}_renderSortable(t,i,s){const a=(e,i)=>{e.preventDefault();const a=this._dragging;this._dragging=void 0,(null==a?void 0:a.list)===t&&s(a.from,i)};return e`
      <ul>
        ${i.map((o,r)=>e`
            <li
              draggable="true"
              @dragstart=${e=>{var i;this._dragging={list:t,from:r},null===(i=e.dataTransfer)||void 0===i||i.setData("text/plain",o.name),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}}
              @dragover=${e=>{var i;(null===(i=this._dragging)||void 0===i?void 0:i.list)===t&&e.preventDefault()}}
              @drop=${e=>a(e,r)}
              @dragend=${()=>{this._dragging=void 0}}
            >
              <ha-svg-icon
                class="handle"
                role="img"
                aria-label=${c("template_editor.drag_hint",void 0,this.hass)}
                .path=${lo}
              ></ha-svg-icon>
              <span>${o.label}</span>
              <span class="spacer"></span>
              <ha-icon-button
                .path=${"M7,15L12,10L17,15H7Z"}
                .disabled=${0===r}
                .label=${c("template_editor.move_up",{name:o.name},this.hass)}
                @click=${()=>s(r,r-1)}
              ></ha-icon-button>
              <ha-icon-button
                .path=${"M7,10L12,15L17,10H7Z"}
                .disabled=${r===i.length-1}
                .label=${c("template_editor.move_down",{name:o.name},this.hass)}
                @click=${()=>s(r,r+1)}
              ></ha-icon-button>
            </li>
          `)}
      </ul>
    `}_renderGroupOrder(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.group,s=is(i);if(void 0===i||s.length<2)return e``;const a=s.map((e,t)=>{var i,s,a,o;const r=null!==(a=null!==(s=null!==(i=null==e?void 0:e.name)&&void 0!==i?i:null==e?void 0:e.heading)&&void 0!==s?s:null==e?void 0:e.title)&&void 0!==a?a:null==e?void 0:e.entity,n=String(null!==(o=null==e?void 0:e.type)&&void 0!==o?o:"?").replace(/^custom:/,"");return{label:"string"==typeof r?`${n} (${r})`:n,name:`${t+1} ${n}`}});return e`
      <div class="order">
        <p class="hint">${c("template_editor.group_order_hint",void 0,this.hass)}</p>
        ${this._renderSortable("group",a,(e,t)=>{const a=Ze(s,e,t);a!==s&&this._config&&this._fireConfigChanged(Object.assign(Object.assign({},this._config),{group:ss(i,a)}))})}
      </div>
    `}_renderPromote(){const t=cr(this._config);if(!this._config||!t)return e``;const i=function(e){const t=[],i=(e,s)=>{if(Array.isArray(e))e.forEach((e,t)=>i(e,[...s,t]));else if(e&&"object"==typeof e)for(const[t,a]of Object.entries(e))"type"===t&&"string"==typeof a||i(a,[...s,t]);else"string"==typeof e&&E.test(e)||s.length&&null!=e&&("string"!=typeof e&&"number"!=typeof e&&"boolean"!=typeof e||t.push({path:s,value:e,label:hr(s)}))};return i(e,[]),t}(this._config[t]);if(!i.length)return e``;const s=this._promotePath?JSON.stringify(this._promotePath):"",a=e=>{const t=String(e);return t.length>40?`${t.slice(0,39)}…`:t};return e`
      <ha-expansion-panel outlined class="promote">
        <span slot="header">${c("template_editor.promote_header",void 0,this.hass)}</span>
        <p class="hint">${c("template_editor.promote_hint",void 0,this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${{setting:s}}
          .schema=${[{name:"setting",selector:{select:{mode:"dropdown",options:i.map(e=>({value:JSON.stringify(e.path),label:`${e.label} = ${a(e.value)}`}))}}}]}
          .computeLabel=${()=>c("template_editor.promote_pick",void 0,this.hass)}
          @value-changed=${this._promotePicked}
        ></ha-form>
        ${this._promotePath?e`
                ${Ji({label:c("template_editor.promote_name",void 0,this.hass),value:this._promoteName,onInput:e=>{this._promoteName=e,this._promoteError=void 0}})}
                ${this._promoteError?e`<ha-alert alert-type="error">${this._promoteError}</ha-alert>`:e``}
                <ha-button .disabled=${!this._promoteName.trim()} @click=${this._promote}>
                  ${c("template_editor.promote_button",void 0,this.hass)}
                </ha-button>
              `:e``}
      </ha-expansion-panel>
    `}_promotePicked(e){e.stopPropagation();const t=e.detail.value.setting;t&&(this._promotePath=JSON.parse(t),this._promoteName=function(e,t){const i=[...e].reverse().find(e=>"string"==typeof e),s=e[e.length-1];return ar(("number"==typeof s?`${null!=i?i:"item"}_${s+1}`:null!=i?i:"value").replace(/[^A-Za-z0-9_-]+/g,"_").replace(/^_+|_+$/g,"")||"value",t)}(this._promotePath,ur(this._config)),this._promoteError=void 0)}_promote(){if(!this._config||!this._promotePath)return;const e=this._promoteName.trim(),t=_r(this._config,this._promotePath,e);t.ok?(this._promotePath=void 0,this._promoteName="",this._fireConfigChanged(t.template)):this._promoteError=c(`template_editor.promote_${t.error}`,{name:e},this.hass)}_renderInUse(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._savedLovelace;if(!i||!s)return e``;const{views:a,templates:o}=Ri(s,i),r=a.reduce((e,t)=>e+t.count,0)+o.length;return r?e`<ha-alert alert-type="info">
      ${c(1===r?"template_editor.in_use_one":"template_editor.in_use_many",{total:r},this.hass)}
    </ha-alert>`:e``}_renderSuggest(t){var i;return t&&(null===(i=this._config)||void 0===i?void 0:i.card)?e`
      <div class="suggest">
        ${this._suggestedNothing?e`<ha-alert alert-type="info">
                ${c("template_editor.suggest_nothing",void 0,this.hass)}
              </ha-alert>`:e``}
        ${this._suggestion?e`<ha-alert alert-type="warning">
                ${c(1===this._suggestion.variables.length?"template_editor.suggest_confirm_one":"template_editor.suggest_confirm_many",{names:this._suggestion.variables.map(e=>e.name).join(", ")},this.hass)}
              </ha-alert>`:e``}
        <ha-button @click=${this._suggest}>
          ${c(this._suggestion?"template_editor.suggest_anyway":"template_editor.suggest_button",void 0,this.hass)}
        </ha-button>
      </div>
    `:e``}_suggest(){var e;if(!(null===(e=this._config)||void 0===e?void 0:e.card))return;if(this._suggestion){const e=Object.assign(Object.assign({},this._config),{card:this._suggestion.card});return e.variables=Lt(this._config.variables,this._suggestion.variables),this._suggestion=void 0,void this._fireConfigChanged(e)}this._suggestedNothing=!1;const t=le(this._config).map(e=>e.name),i=function(e,t){const i=new Set(t),s=[],a=new Map,o=(e,t)=>{const o=`${e.base} ${t}`,r=a.get(o);if(r)return r;let n=1,l=e.base;for(;i.has(l);)n+=1,l=`${e.base}_${n}`;return i.add(l),a.set(o,l),s.push({name:l,label:Oo(e,n),selector:e.selector,default:t}),l},r=e=>{if(Array.isArray(e))return e.map(r);if(!e||"object"!=typeof e)return e;const t={};for(const[i,s]of Object.entries(e)){const e=Object.prototype.hasOwnProperty.call(jo,i)?jo[i]:void 0;e&&"string"==typeof s&&!E.test(s)&&e.matches(s)?t[i]=`[[${o(e,s)}]]`:t[i]=r(s)}return t};return{card:r(e),variables:s}}(this._config.card,t);i.variables.length?this._suggestion=i:this._suggestedNothing=!0}_renderDeclutter(){var t,i;const s=this._savedLovelace,a=Wi(s),o="card"===he(null!==(t=this._config)&&void 0!==t?t:{})?as(s):[];if(!a.length&&!o.length||!this._config)return e``;const r=this._config.template,n=!!r&&r in re(s),l=null!==(i=this._declutterOriginal)&&void 0!==i?i:this._declutterSection;return e`
      <ha-expansion-panel outlined>
        <span slot="header">${c("template_editor.declutter_header",void 0,this.hass)}</span>
        <p class="hint">${c("template_editor.declutter_hint",void 0,this.hass)}</p>
        ${a.length?e`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:a.map((e,t)=>({value:String(t),label:e.label}))}}}]}
                .computeLabel=${()=>c("template_editor.declutter_pick",void 0,this.hass)}
                @value-changed=${e=>this._declutterPicked(e,a)}
              ></ha-form>`:e``}
        ${o.length?e`<ha-form
                .hass=${this.hass}
                .data=${{}}
                .schema=${[{name:"pick",selector:{select:{mode:"dropdown",options:o.map((e,t)=>({value:String(t),label:c(1===e.cards.length?"template_editor.declutter_section_one":"template_editor.declutter_section_many",{where:e.label,count:e.cards.length},this.hass)}))}}}]}
                .computeLabel=${()=>c("template_editor.declutter_pick_section",void 0,this.hass)}
                @value-changed=${e=>this._declutterSectionPicked(e,o)}
              ></ha-form>`:e``}
        ${l?e`
                <ha-button .disabled=${this._busy||!n} @click=${this._declutterReplace}>
                  ${c(this._declutterPending?"template_editor.declutter_replace_confirm":this._declutterSection?"template_editor.declutter_replace_section":"template_editor.declutter_replace",void 0,this.hass)}
                </ha-button>
                ${n?e``:e`<p class="hint">${c("template_editor.declutter_save_first",void 0,this.hass)}</p>`}
              `:e``}
      </ha-expansion-panel>
    `}_declutterPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterOriginal=i.config,this._declutterSection=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{card:JSON.parse(JSON.stringify(i.config))});delete s.group,this._fireConfigChanged(s)}_declutterSectionPicked(e,t){e.stopPropagation();const i=t[Number(e.detail.value.pick)];if(!i||!this._config)return;this._declutterSection={view:i.view,section:i.section,cards:i.cards},this._declutterOriginal=void 0,this._declutterPending=!1,this._suggestion=void 0,this._suggestedNothing=!1;const s=Object.assign(Object.assign({},this._config),{group:{cards:JSON.parse(JSON.stringify(i.cards))}});delete s.card,this._fireConfigChanged(s)}async _declutterReplace(){var e;const t=null===(e=this._config)||void 0===e?void 0:e.template,i=this._declutterOriginal,s=this._declutterSection;if(!t||!i&&!s)return;if(!this._declutterPending)return void(this._declutterPending=!0);const a={type:"custom:decluttering-card-plus",template:t};let o=!1;const r=await this._saveDashboard(e=>{if(i)return Ne(e,i,a);const t=os(e,s.view,s.section,s.cards,[a]);return o=t===e,t},"declutter");r&&o&&(this._toolError=c("template_editor.declutter_section_changed",void 0,this.hass)),r&&(this._declutterPending=!1,this._declutterOriginal=void 0,this._declutterSection=void 0)}_selectTab(e){e.stopPropagation(),this._selectedTab=e.detail}_activateTab(e){const t=e.composedPath().find(e=>"ha-tab-group-tab"===e.localName);this._showTab(null==t?void 0:t.getAttribute("panel"),0===e.detail)}_tabPointer(){this._tabPointerAt=Date.now()}_tabShown(e){var t;const i=e.detail,s="string"==typeof i?i:null!==(t=null==i?void 0:i.name)&&void 0!==t?t:null==i?void 0:i.panel,a=e.composedPath().find(e=>"ha-tab-group-tab"===e.localName);this._showTab(null!=s?s:null==a?void 0:a.getAttribute("panel"),Date.now()-this._tabChooseAt<500)}_tabKey(e){var t;if("Enter"!==e.key&&" "!==e.key)return;this._tabChooseAt=Date.now();const i=e.composedPath().find(e=>"ha-tab-group-tab"===e.localName);(null==i?void 0:i.getAttribute("panel"))===this._selectedTab&&(null===(t=this.renderRoot.querySelector("#panel-heading"))||void 0===t||t.focus())}_showTab(e,t){e&&e!==this._selectedTab&&(this._selectedTab=e,t&&this.updateComplete.then(()=>{var e;null===(e=this.renderRoot.querySelector("#panel-heading"))||void 0===e||e.focus()}))}_announce(e){this._announceTimer&&clearTimeout(this._announceTimer),this._announcement="",this._announceTimer=setTimeout(()=>{this._announcement=e,this._announceTimer=setTimeout(()=>this._announcement="",4e3)},50)}_describeChanged(e){if(!this._config)return;const t=Object.assign({template:this._config.template,thingType:Ed(this._config),description:this._config.description,category:this._config.category},e.detail.value),i=Object.assign(Object.assign({},this._config),{template:t.template}),s="function"===Ed(this._config),a=i;"function"!==t.thingType||xt(i)||(a.function="[[value]]"),s&&"function"!==t.thingType&&(delete a.function,delete a.parameters),ue(i,"description",t.description),ue(i,"category",t.category);const o=void 0!==i.group&&"card"===t.thingType;o||delete i.group;for(const[r,n]of Object.entries(ao))Ld.stubMember(!o&&t.thingType===r,i,r,n);this._fireConfigChanged(i)}_declarationsChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign({},this._config);ue(t,"variables",e.detail.value),this._fireConfigChanged(t)}_defaultsChanged(e){if(!this._config)return;const t=e.detail.value,i=Object.assign(Object.assign({},this._config),{default:t.default});void 0!==this._config.defaults&&(JSON.stringify(t.default)===JSON.stringify(ft(this._config))?i.default=this._config.default:delete i.defaults),this._fireConfigChanged(i)}_childConfigChanged(e){e.stopPropagation(),this._fireConfigChanged(e.detail.config)}_cardChanged(e){if(e.stopPropagation(),!this._config)return;const t=this._config.card;if(!(t&&"object"==typeof t&&"string"==typeof t.type)&&rs(e.detail.config,this._cardForEditor()))return;this._suggestion=void 0,this._suggestedNothing=!1;const i=Object.assign(Object.assign({},this._config),{card:e.detail.config});this._fireConfigChanged(i)}_cardPicked(e){this._selectedTab="card",this._cardChanged(e)}_rowChanged(e){if(e.stopPropagation(),!this._config)return;const t=Object.assign(Object.assign({},this._config),{row:e.detail.config});this._fireConfigChanged(t)}_fireConfigChanged(e){this._suggestion=void 0,this._suggestedNothing=!1,M(this,"config-changed",{config:e})}static stubMember(e,t,i,s){e?i in t||(t[i]=s):delete t[i]}static get styles(){return Er}_saveDashboard(e,t,i){return co(this,e,t,i)}async _loadTrash(){this.hass&&(this._trash=await hi(this.hass))}_renderPills(){var t;const i=null===(t=this._config)||void 0===t?void 0:t.template,s=this._savedLovelace;if(!i||!s)return{usages:e``,share:e``};const a=function(e,t,i,s){return{usages:e,unset:t.filter(e=>e.template===s).reduce((e,t)=>e+t.count,0),trash:(null!=i?i:[]).filter(e=>e.name===s).length}}(z(s,i),ns(s).unsetVariables,this._trash,i);return{usages:0===a.usages?e`<span class="pill grey" title=${c("template_editor.pill_unused",void 0,this.hass)}>0</span>`:e`<span class="pill">${a.usages}</span>${a.unset?e`<span class="pill warn"
                    >${c("template_editor.pill_unset",{count:a.unset},this.hass)}</span
                  >`:e``}`,share:e`${this._updateCount?e`<span class="dot" title=${c("template_editor.pill_update",void 0,this.hass)}></span>`:e``}${a.trash?e`<span class="pill grey"
            >${c("template_editor.pill_trash",{count:a.trash},this.hass)}</span
          >`:e``}`}}_renderCardPreview(){var t,i;const s=this._config;if(!(null==s?void 0:s.card)||!this.hass)return e``;const a=null!==(t=re(this._savedLovelace,void 0,s)[s.template])&&void 0!==t?t:s,o=null!==(i=Li(a,Oi.get(s.template)))&&void 0!==i?i:[];let r;try{r=b(o,a,a.card,s.template,this.hass,!0)}catch(n){return e``}return r&&"object"==typeof r?e`
      <h4 class="preview-header">${c("preview.header",void 0,this.hass)}</h4>
      <decluttering-preview-frame .hass=${this.hass} .config=${r} kind="card"></decluttering-preview-frame>
    `:e``}async connectedCallback(){var e;super.connectedCallback();const t=ls();t&&(this._selectedTab=t),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=ee(()=>this.requestUpdate())),this._unwatchTrash=ds(()=>{this._loadTrash()}),this._loadTrash(),this.addEventListener("decluttering-announce",this._onAnnounce),this._loadedElements||(await te(),await async function(){let e=customElements.get("hui-entities-card");if(!e){if(!W)return;(await W).createCardElement({type:"entities",entities:[]}),await customElements.whenDefined("hui-entities-card"),e=customElements.get("hui-entities-card")}e&&e.getConfigElement&&await e.getConfigElement()}(),this._loadedElements=!0)}disconnectedCallback(){var e,t;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0,this.removeEventListener("decluttering-announce",this._onAnnounce),null===(t=this._unwatchTrash)||void 0===t||t.call(this),this._unwatchTrash=void 0}updated(e){var t;super.updated(e);const i=null!==(t=this.renderRoot.querySelector("hui-card-element-editor"))&&void 0!==t?t:void 0;for(const s of["decluttering-field-menus","decluttering-code-hooks"]){const e=this.renderRoot.querySelector(s);e&&e.target!==i&&(e.target=i)}}}s([o()],Ld.prototype,"_config",void 0),s([o()],Ld.prototype,"_selectedTab",void 0),s([o()],Ld.prototype,"_trash",void 0),s([o()],Ld.prototype,"_updateCount",void 0),s([o()],Ld.prototype,"_suggestion",void 0),s([o()],Ld.prototype,"_suggestedNothing",void 0),s([o()],Ld.prototype,"_toolError",void 0),s([o()],Ld.prototype,"_busy",void 0),s([o()],Ld.prototype,"_declutterOriginal",void 0),s([o()],Ld.prototype,"_declutterSection",void 0),s([o()],Ld.prototype,"_declutterPending",void 0),s([o()],Ld.prototype,"_promotePath",void 0),s([o()],Ld.prototype,"_promoteName",void 0),s([o()],Ld.prototype,"_promoteError",void 0),s([a()],Ld.prototype,"lovelace",void 0),s([a()],Ld.prototype,"hass",void 0),s([o()],Ld.prototype,"_announcement",void 0);function Td(e){const t=null==e?void 0:e.version,i="number"==typeof t?t:"string"==typeof t?Number(t):NaN;return Number.isFinite(i)?i:void 0}const Nd="[A-Za-z_][\\w.]*";function Md(e,t){const i=t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),s=[new RegExp(`\\b${i}\\b\\s+(?:is now|became|renamed to|replaced by|->|→)\\s+\`?(${Nd})\`?`,"i"),new RegExp(`\`${i}\`\\s+(?:is now|became|renamed to|replaced by|->|→)\\s+\`?(${Nd})\`?`,"i")];for(const a of s){const i=a.exec(e);if(i&&i[1]!==t)return i[1]}}function Vd(e,t){const i=new RegExp(`(^|[^\\w])${t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}([^\\w]|$)`);for(const s of function(e){const t=null==e?void 0:e.changes;if(!t||"object"!=typeof t)return[];const i=[];for(const[s,a]of Object.entries(t)){const e=Number(s);if(!Number.isFinite(e))continue;const t=Array.isArray(a)?a:[a];for(const s of t)"string"==typeof s&&s.trim()&&i.push({version:e,note:s.trim()})}return i.sort((e,t)=>t.version-e.version)}(e)){if(!i.test(s.note))continue;const e=Md(s.note,t);return e?Object.assign(Object.assign({},s),{replacement:e}):s}}function Dd(e,t,i,s,a){const o=e=>{if(Array.isArray(e))return e.map(o);if(!e||"object"!=typeof e)return e;if(Ct.includes(e.type)&&e.template===i&&(t=e,JSON.stringify(t).includes(`"${s}"`)))return $d(e,s,a);var t;const r={};for(const[i,s]of Object.entries(e))r[i]=o(s);return r},r=Array.isArray(null==e?void 0:e.views)?e.views:[];return Object.assign(Object.assign({},e),{views:r.map((e,i)=>i===t?o(e):e)})}const zd="decluttering-card-plus-stats";function Fd(e){var t,i;return void 0!==e.card?`card:${e.card}`:JSON.stringify([e.template,null!==(t=e.name)&&void 0!==t?t:null,null!==(i=e.view)&&void 0!==i?i:null])}function Hd(e,t){var i;const s=new Map,a=new Set;let o=0;for(const n of e){const e=null!==(i=s.get(n.template))&&void 0!==i?i:{template:n.template,views:[],builds:0,total:0,slowest:0};e.builds+=1,e.total+=n.ms,e.slowest=Math.max(e.slowest,n.ms),n.view&&!e.views.includes(n.view)&&e.views.push(n.view),s.set(n.template,e);const t=Fd(n);a.has(t)&&n.follows&&(o+=1),a.add(t)}const r=[...s.values()];for(const n of r){const e=null==t?void 0:t[n.template];e&&(n.delta=Math.round(n.total-e.total),n.builds<e.builds&&n.delta<0?n.reason="lazy":n.builds>e.builds&&n.delta>0&&(n.reason="rebuilt"))}return r.sort((e,t)=>t.total-e.total||e.template.localeCompare(t.template)),{cardsBuilt:a.size,templatesInUse:r.length,totalMs:Math.round(r.reduce((e,t)=>e+t.total,0)),rebuiltOnState:o,rows:r.map(e=>Object.assign(Object.assign({},e),{total:Math.round(e.total),slowest:Math.round(e.slowest)}))}}class Rd extends r{constructor(){super(...arguments),this.expanded=!1,this._sortBy="total",this._copiedStats=!1,this._snapshotRead=!1,this._loadedAt=performance.now(),this._writeSnapshot=()=>{try{sessionStorage.setItem(zd,JSON.stringify(function(e){const t={};for(const i of e.rows)t[i.template]={total:i.total,builds:i.builds};return t}(Hd(cs.entries()))))}catch(e){}}}connectedCallback(){var e;super.connectedCallback(),null!==(e=this._stopLanguageListener)&&void 0!==e||(this._stopLanguageListener=ee(()=>this.requestUpdate())),window.addEventListener("pagehide",this._writeSnapshot)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._stopLanguageListener)||void 0===e||e.call(this),this._stopLanguageListener=void 0,window.removeEventListener("pagehide",this._writeSnapshot)}static get styles(){return n`
      /* Code stays left to right inside a right-to-left sentence. */
      code {
        direction: ltr;
        unicode-bidi: isolate;
      }
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
        padding-inline-start: 20px;
        font-size: 0.9em;
      }
      .timings-header small {
        color: var(--secondary-text-color);
        font-weight: 400;
        margin-inline-start: 6px;
      }
      .kpis {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 8px;
        margin: 0 0 12px;
      }
      .kpis div {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 8px 10px;
      }
      .kpis b {
        display: block;
        font-size: 1.4em;
        font-weight: 400;
      }
      .kpis small {
        color: var(--secondary-text-color);
      }
      table.stats {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9em;
      }
      table.stats th {
        text-align: start;
        font-weight: 500;
        color: var(--secondary-text-color);
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
      }
      table.stats th.sortable {
        cursor: pointer;
      }
      table.stats th[aria-sort='descending'] {
        color: var(--primary-text-color);
      }
      table.stats td {
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
        vertical-align: top;
      }
      table.stats td.num {
        text-align: end;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }
      .bar {
        display: inline-block;
        height: 8px;
        border-radius: 2px;
        background: var(--primary-color);
        vertical-align: middle;
        margin-inline-end: 6px;
      }
      .bar.slow {
        background: var(--warning-color, #ffa600);
      }
      td.trend {
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.9em;
        white-space: nowrap;
      }
      td.trend.up {
        color: var(--error-color, #db4437);
      }
      td.trend.down {
        color: var(--success-color, #43a047);
      }
      td.trend small {
        font-family: var(--ha-font-family, inherit);
        color: var(--secondary-text-color);
        margin-inline-start: 4px;
      }
    `}render(){var t,i,s,a,o,r,n,l,d,h;const u=this.lovelace,p=ht(u);if(p&&(null===(t=this._borrowed)||void 0===t?void 0:t.ll)!==u){this._borrowed={ll:u};const e=new Set(Object.keys(re(u)));ut(this.hass,u).then(t=>{var i;(null===(i=this._borrowed)||void 0===i?void 0:i.ll)===u&&(this._borrowed={ll:u,names:Object.keys(t).filter(t=>!e.has(t)),templates:t})})}p&&(null===(i=this._lenders)||void 0===i?void 0:i.ll)!==u&&(this._lenders={ll:u,templates:{},from:{}},hs(this.hass,u).then(e=>{var t;(null===(t=this._lenders)||void 0===t?void 0:t.ll)===u&&(this._lenders=Object.assign({ll:u},e))}));const m=this._lenders?function(e,t,i){var s;const a=[];for(const[o,r]of Object.entries(e)){const e=Td(r),n=Td(t[o]);void 0===e||void 0===n||n>=e||a.push({template:o,here:e,there:n,dashboard:null!==(s=i[o])&&void 0!==s?s:""})}return a}(re(u),this._lenders.templates,this._lenders.from):[],v=p&&!(null===(s=this._borrowed)||void 0===s?void 0:s.names),_=ns(u,p&&null!==(o=null===(a=this._borrowed)||void 0===a?void 0:a.names)&&void 0!==o?o:[]),f=v?Object.assign(Object.assign({},_),{missingTemplates:[]}):_,g=us(u),b=ps(u),y=null===(r=this._borrowed)||void 0===r?void 0:r.names,$=this._examplesChecked;v||(null==$?void 0:$.ll)===u&&(null==$?void 0:$.borrowed)===y||(this._examplesChecked={ll:u,borrowed:y,failed:Ai(re(u),null!=y?y:[],this.hass)});const w=v?[]:null!==(l=null===(n=this._examplesChecked)||void 0===n?void 0:n.failed)&&void 0!==l?l:[],x=null!==(h=null===(d=this._borrowed)||void 0===d?void 0:d.templates)&&void 0!==h?h:re(u),k=(j=_d(u,x),O=x,j.map(e=>{const t=Vd(Object.prototype.hasOwnProperty.call(O,e.template)?O[e.template]:void 0,e.name);return t?Object.assign(Object.assign({},e),{since:t}):e}));var j,O;const A=!(f.missingTemplates.length||f.unsetVariables.length||f.unusedTemplates.length||g.length||b.length||w.length||k.length||m.length);return e`
      <ha-expansion-panel outlined .expanded=${this.expanded}>
        <span slot="header">${c("tools.health_header",void 0,this.hass)}</span>
        <slot></slot>
        ${A?e`<p class="hint">${c("tools.health_ok",void 0,this.hass)}</p>`:e`
                ${w.map(t=>e`<ha-alert alert-type="error">
                      ${c("tools.health_example",{template:t.template,number:t.example,problems:t.problems.join(" ")},this.hass)}
                    </ha-alert>`)}
                ${g.map(t=>e`<ha-alert alert-type="error">
                      ${c("tools.health_extends_loop",{path:t.join(" → ")},this.hass)}
                    </ha-alert>`)}
                ${f.missingTemplates.map(t=>e`<ha-alert alert-type="error">
                      ${c("tools.health_missing",{template:t.template,count:t.count},this.hass)}${t.closest?c("error.did_you_mean",{closest:t.closest},this.hass):""}
                    </ha-alert>`)}
                ${f.unsetVariables.map(t=>e`<ha-alert alert-type="warning">
                      ${c("tools.health_unset",{template:t.template,names:t.names.join(", "),count:t.count},this.hass)}
                    </ha-alert>`)}
                ${b.map(t=>{const i=[...t.views.map(e=>c("tools.health_view_uses",{view:e.title||c("template_editor.untitled_view",void 0,this.hass),count:e.count},this.hass)),...t.templates.map(e=>c("tools.health_template_uses",{name:e},this.hass))].join(", ");return e`<ha-alert alert-type="warning">
                    ${t.message?c("tools.health_deprecated_because",{template:t.template,message:t.message,uses:i},this.hass):c("tools.health_deprecated",{template:t.template,uses:i},this.hass)}
                  </ha-alert>`})}
                ${k.map(t=>{var i;return e`<ha-alert alert-type="warning">
                      ${c("tools.health_unread",{template:t.template,name:t.name,count:t.count,view:t.view.title||t.view.path||c("template_editor.untitled_view",void 0,this.hass)},this.hass)}${"variables"===t.where?"":c(`tools.health_unread_${t.where}`,void 0,this.hass)}${t.closest?c("error.did_you_mean",{closest:t.closest},this.hass):""}${t.since?c("tools.health_dropped_since",{version:t.since.version,note:t.since.note},this.hass):""}
                      ${(null===(i=t.since)||void 0===i?void 0:i.replacement)?e`<ha-button
                              slot="action"
                              @click=${()=>{var e,i;return this._renameOnCards(t.view.index,t.template,t.name,null!==(i=null===(e=t.since)||void 0===e?void 0:e.replacement)&&void 0!==i?i:"")}}
                            >
                              ${c("tools.health_rename_to",{name:t.since.replacement},this.hass)}
                            </ha-button>`:""}
                    </ha-alert>`})}
                ${m.map(t=>e`<ha-alert alert-type="info">
                      ${c("tools.health_older_elsewhere",{template:t.template,dashboard:t.dashboard,here:t.here,there:t.there},this.hass)}
                    </ha-alert>`)}
                ${f.unusedTemplates.length?e`<ha-alert alert-type="info">
                        ${c("tools.health_unused",{names:f.unusedTemplates.join(", ")},this.hass)}
                      </ha-alert>`:e``}
              `}
        ${this._renderTimings()} ${this._renderStats()} ${this._renderSaid()}
      </ha-expansion-panel>
    `}_renameOnCards(e,t,i,s){s&&R(this,this.hass,"rename_variable",[{urlPath:q(),build:a=>Dd(a,e,t,i,s)}])}_renderTimings(){const t=cs.entries(),i=e=>e.toFixed(1),s=e`<h4 class="timings-header">${c("tools.timings_header",void 0,this.hass)}</h4>`;if(!t.length)return e`${s}
        <p class="hint">${c("tools.timings_none",void 0,this.hass)}</p>`;const{byTotal:a,byMax:o,repeats:r}=ms(t);return e`
      ${s}
      <p class="hint">${c("tools.timings_hint",{count:t.length},this.hass)}</p>
      <p class="hint">${c("tools.timings_by_total",void 0,this.hass)}</p>
      <ul class="timings">
        ${a.map(t=>e`<li>
              ${c(1===t.builds?"tools.timings_total_row_one":"tools.timings_total_row",{template:t.template,total:i(t.total),builds:t.builds,max:i(t.max)},this.hass)}
            </li>`)}
      </ul>
      <p class="hint">${c("tools.timings_by_max",void 0,this.hass)}</p>
      <ul class="timings">
        ${o.map(t=>e`<li>
              ${c("tools.timings_max_row",{template:t.template,max:i(t.max)},this.hass)}
            </li>`)}
      </ul>
      ${r.length?e`
              <p class="hint">${c("tools.timings_repeats",void 0,this.hass)}</p>
              <ul class="timings">
                ${r.map(t=>{var i;return e`<li>
                      ${c(t.name?"tools.timings_repeat_named_row":"tools.timings_repeat_row",{template:t.template,name:null!==(i=t.name)&&void 0!==i?i:"",copies:t.copies},this.hass)}
                    </li>`})}
              </ul>
            `:e``}
    `}_renderStats(){if(!this._snapshotRead){this._snapshotRead=!0;try{const e=sessionStorage.getItem(zd);this._snapshot=e?JSON.parse(e):void 0}catch(r){this._snapshot=void 0}}const t=Hd(cs.entries(),this._snapshot),i=Math.round((performance.now()-this._loadedAt)/6e4),s=function(e,t){const i=[...e];return"template"===t?i.sort((e,t)=>e.template.localeCompare(t.template)):i.sort((e,i)=>{var s,a;return(null!==(s=i[t])&&void 0!==s?s:-1/0)-(null!==(a=e[t])&&void 0!==a?a:-1/0)||e.template.localeCompare(i.template)})}(t.rows,this._sortBy),a=s.reduce((e,t)=>Math.max(e,t.total),0)||1,o=e=>c(`stats.col_${e}`,void 0,this.hass);return e`
      <h4 class="timings-header">
        ${c("stats.header",void 0,this.hass)}
        <small>${c("stats.since",{minutes:i},this.hass)}</small>
      </h4>
      <div class="kpis">
        <div><b>${t.cardsBuilt}</b><small>${c("stats.cards_built",void 0,this.hass)}</small></div>
        <div>
          <b>${t.templatesInUse}</b><small>${c("stats.templates_in_use",void 0,this.hass)}</small>
        </div>
        <div><b>${t.totalMs} ms</b><small>${c("stats.total_time",void 0,this.hass)}</small></div>
        <div><b>${t.rebuiltOnState}</b><small>${c("stats.rebuilt",void 0,this.hass)}</small></div>
      </div>
      ${s.length?e`
              <table class="stats">
                <thead>
                  <tr>
                    ${["template","views","builds","total","slowest","delta"].map(t=>e`<th
                          class=${"views"===t?"":"sortable"}
                          aria-sort=${this._sortBy===t?"descending":"none"}
                          @click=${()=>{"views"!==t&&(this._sortBy=t)}}
                        >
                          ${o(t)}
                        </th>`)}
                  </tr>
                </thead>
                <tbody>
                  ${s.map(t=>e`
                      <tr>
                        <td><code>${t.template}</code></td>
                        <td>${t.views.join(", ")}</td>
                        <td class="num">${t.builds}</td>
                        <td class="num">
                          <span
                            class="bar ${t.total===a&&s.length>1?"slow":""}"
                            style="width: ${Math.max(4,Math.round(t.total/a*80))}px"
                          ></span
                          >${t.total} ms
                        </td>
                        <td class="num">${t.slowest} ms</td>
                        <td
                          class="trend ${void 0===t.delta?"":t.delta>0?"up":t.delta<0?"down":""}"
                        >
                          ${void 0===t.delta?"":`${t.delta>0?"+":t.delta<0?"−":"±"}${Math.abs(t.delta)} ms`}
                          ${t.reason?e`<small>${c(`stats.reason_${t.reason}`,void 0,this.hass)}</small>`:""}
                        </td>
                      </tr>
                    `)}
                </tbody>
              </table>
              <p class="hint">${c("stats.hint",void 0,this.hass)}</p>
              <ha-button appearance="plain" @click=${this._copyStats}>
                ${c(this._copiedStats?"share.copied":"stats.copy",void 0,this.hass)}
              </ha-button>
              <ha-button appearance="plain" @click=${this._resetStats}
                >${c("stats.reset",void 0,this.hass)}</ha-button
              >
            `:e`<p class="hint">${c("tools.timings_none",void 0,this.hass)}</p>`}
    `}async _copyStats(){const e=Hd(cs.entries(),this._snapshot),t=["template","views","builds","total","slowest","delta"].map(e=>c(`stats.col_${e}`,void 0,this.hass));this._copiedStats=await Ce(function(e,t){return[`| ${t.join(" | ")} |`,`| ${t.map(()=>"---").join(" | ")} |`,...e.rows.map(e=>[e.template,e.views.join(", "),String(e.builds),`${e.total} ms`,`${e.slowest} ms`,void 0===e.delta?"":`${e.delta>0?"+":""}${e.delta} ms`].join(" | "))].map((e,t)=>t<2?e:`| ${e} |`).join("\n")}(e,t)),setTimeout(()=>{this._copiedStats=!1},2e3)}_resetStats(){cs.clear(),this._loadedAt=performance.now(),this.requestUpdate()}_renderSaid(){const t=vs();if(!t.length)return e``;const i=this._loadedAt,s=t.slice(-50).reverse();return e`
      <h4 class="timings-header">${c("stats.said_header",void 0,this.hass)}</h4>
      <table class="stats said">
        <thead>
          <tr>
            <th>${c("stats.said_when",void 0,this.hass)}</th>
            <th>${c("stats.said_card",void 0,this.hass)}</th>
            <th>${c("stats.said_what",void 0,this.hass)}</th>
          </tr>
        </thead>
        <tbody>
          ${s.map(t=>{var s,a;return e`
              <tr>
                <td class="num">${Math.max(0,(t.at-i)/1e3).toFixed(2)} s</td>
                <td>${null!==(a=null!==(s=t.card)&&void 0!==s?s:t.template)&&void 0!==a?a:""}</td>
                <td>${t.message}</td>
              </tr>
            `})}
        </tbody>
      </table>
      ${t.length>s.length?e`<p class="hint">${c("stats.said_more",{count:t.length-s.length},this.hass)}</p>`:""}
    `}}s([a({attribute:!1})],Rd.prototype,"hass",void 0),s([a({attribute:!1})],Rd.prototype,"lovelace",void 0),s([a({type:Boolean})],Rd.prototype,"expanded",void 0),s([o()],Rd.prototype,"_borrowed",void 0),s([o()],Rd.prototype,"_lenders",void 0),s([o()],Rd.prototype,"_sortBy",void 0),s([o()],Rd.prototype,"_copiedStats",void 0);class qd extends r{constructor(){super(...arguments),this.entries=[],this.open=!1,this._source="library",this._query="",this._showYaml=!1,this._thumbnails=new Map}static get styles(){return n`
      ha-dialog {
        --mdc-dialog-min-width: min(1040px, 96vw);
        --mdc-dialog-max-width: min(1040px, 96vw);
      }
      .tabs {
        display: flex;
        gap: 4px;
        border-bottom: 1px solid var(--divider-color);
        margin: 0 0 12px;
      }
      .tabs button {
        background: none;
        border: 0;
        border-bottom: 2px solid transparent;
        padding: 10px 14px;
        font: inherit;
        color: var(--secondary-text-color);
        cursor: pointer;
      }
      .tabs button[aria-selected='true'] {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
        font-weight: 500;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 10px 0 14px;
      }
      .chips button {
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        border-radius: 8px;
        padding: 6px 10px;
        font: inherit;
        font-size: 13px;
        cursor: pointer;
        color: var(--primary-text-color);
      }
      .chips button[aria-pressed='true'] {
        background: rgba(var(--rgb-primary-color), 0.12);
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 14px;
        max-height: 52vh;
        overflow: auto;
        padding: 2px;
      }
      .tile {
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        overflow: hidden;
        background: var(--card-background-color);
        cursor: pointer;
        text-align: start;
        padding: 0;
        font: inherit;
        color: inherit;
        display: flex;
        flex-direction: column;
      }
      .tile[aria-pressed='true'] {
        outline: 2px solid var(--primary-color);
      }
      .tile .preview {
        background: var(--secondary-background-color);
        padding: 10px;
        min-height: 96px;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        overflow: hidden;
      }
      .tile .preview {
        display: block;
      }
      .tile .preview .thumb {
        display: block;
        width: 100%;
        min-width: 0;
      }
      .tile .preview .thumb > * {
        display: block;
        width: 100%;
      }
      .tile .preview .kind {
        display: block;
        text-align: center;
        padding: 32px 0;
      }
      .tile .preview .kind {
        color: var(--secondary-text-color);
        font-size: 13px;
      }
      .tile .name {
        padding: 10px 12px 4px;
        font-weight: 500;
        word-break: break-word;
      }
      .tile .name small {
        display: block;
        color: var(--secondary-text-color);
        font-weight: 400;
        font-size: 12px;
      }
      .tile .about {
        padding: 0 12px 12px;
        color: var(--secondary-text-color);
        font-size: 12.5px;
        line-height: 1.35;
      }
      .empty {
        color: var(--secondary-text-color);
        padding: 24px 0;
        text-align: center;
      }
      .foot {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--divider-color);
        margin-top: 12px;
        flex-wrap: wrap;
      }
      .foot .summary {
        flex: 1;
        color: var(--secondary-text-color);
        font-size: 13px;
        min-width: 200px;
      }
      .foot .summary b {
        color: var(--primary-text-color);
        font-weight: 500;
      }
      ha-alert {
        display: block;
        margin: 8px 0;
      }
      ha-yaml-editor {
        display: block;
        margin: 8px 0 0;
      }
      @media (prefers-reduced-motion: reduce) {
        * {
          transition: none !important;
          animation: none !important;
        }
      }
    `}updated(){const e=new Set(this.entries.map(e=>e.key));for(const t of[...this._thumbnails.keys()])e.has(t)||this._thumbnails.delete(t)}_t(e,t){return c(e,t,this.hass)}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_close(){this._fire("gallery-closed")}_thumbnail(t){if(!this._thumbnails.has(t.key)){let e=null;const i=Un(t,function(e){const t={};for(const i of e){for(const[e,s]of Object.entries(i.includes))e in t||(t[e]=s);i.name in t||(t[i.name]=i.template)}return t}(this.entries)),s=customElements.get("hui-card");if(i&&s&&this.hass)try{const t=new s;t.preview=!0,t.config=i,t.hass=Bn(this.hass),e=t}catch(a){e=null}this._thumbnails.set(t.key,e)}const i=this._thumbnails.get(t.key);if(i)return this.hass&&(i.hass=Bn(this.hass)),e`<div class="thumb">${i}</div>`;const s="badge"===t.kind?"gallery.kind_badge":"row"===t.kind?"gallery.kind_row":"element"===t.kind?"gallery.kind_element":"gallery.kind_unknown";return e`<span class="kind">${this._t(s)}</span>`}_renderTile(t){const i=t.key===this.selectedKey,s=1===t.variables?this._t("gallery.variables_one"):this._t("gallery.variables_many",{count:t.variables});return e`
      <button
        class="tile"
        aria-pressed=${i?"true":"false"}
        @click=${()=>this._fire("gallery-select",{key:t.key})}
      >
        <div class="preview">${this._thumbnail(t)}</div>
        <div class="name">
          ${t.title}
          ${t.author?e`<small>${this._t("gallery.by",{author:t.author})}</small>`:d}
        </div>
        <div class="about">
          ${t.description} ${t.variables?s+".":""}
          ${t.repeats?this._t("gallery.repeats"):""}
        </div>
      </button>
    `}_renderFoot(t){const i=this.status;if(!t||!i)return e``;const s=[],a=[...i.needs,...i.brings];a.length&&s.push(this._t("gallery.brings",{names:a.join(", ")})),s.push(this._t("root"===i.destination?"gallery.into_root":"gallery.into_view"));const o="installed"!==t.source&&!i.already;return e`
      ${i.missingCards.length?e`<ha-alert alert-type="info">
              ${this._t(1===i.missingCards.length?"share.missing_card_one":"share.missing_card_many",{cards:i.missingCards.join(", ")})}
            </ha-alert>`:d}
      ${i.armed&&i.risks.length?e`<ha-alert alert-type="warning">
              ${this._t("share.community_risks")}
              <ul>
                ${i.risks.map(t=>e`<li>${t}</li>`)}
              </ul>
            </ha-alert>`:d}
      ${this._showYaml?e`<ha-yaml-editor .hass=${this.hass} .defaultValue=${t.template} read-only></ha-yaml-editor>`:d}
      <div class="foot">
        <span class="summary">
          <b>${t.name}</b>
          ${i.already?` · ${this._t("gallery.installed_already")}`:s.length?` · ${s.join(" · ")}`:""}
        </span>
        <ha-button
          @click=${()=>{this._showYaml=!this._showYaml}}
        >
          ${this._t(this._showYaml?"gallery.preview_hide":"gallery.preview_full")}
        </ha-button>
        ${o?e`<ha-button
                .disabled=${i.busy}
                @click=${()=>this._fire("gallery-install",{key:t.key})}
              >
                ${this._t(i.armed?"share.install_anyway":"share.install")}
              </ha-button>`:d}
      </div>
    `}render(){var t,i,s;if(!this.open)return e``;const a=function(e){const t={library:0,community:0,installed:0};for(const i of e)t[i.source]+=1;return t}(this.entries),o=Dn(this.entries,{source:this._source}),r=function(e){const t=[];for(const i of e)t.includes(i.category)||t.push(i.category);return t}(o),n=this._category&&r.includes(this._category)?this._category:void 0,l=Dn(o,{category:n,query:this._query}),c=this.entries.find(e=>e.key===this.selectedKey);return e`
      <ha-dialog
        open
        .heading=${this._t("gallery.title")}
        .headerTitle=${this._t("gallery.title")}
        @closed=${this._close}
        scrimClickAction=""
        escapeKeyAction="close"
      >
        <div>
          <div class="tabs" role="tablist">
            ${[["library","gallery.tab_library"],["community","gallery.tab_community"],["installed","gallery.tab_installed"]].map(([t,i])=>e`<button
                  role="tab"
                  aria-selected=${this._source===t?"true":"false"}
                  @click=${()=>{this._source=t,this._category=void 0}}
                >
                  ${this._t(i)} · ${a[t]}
                </button>`)}
          </div>
          ${Ji({label:this._t("gallery.search"),value:this._query,onInput:e=>{this._query=e}})}
          ${r.length>1?e`<div class="chips">
                  <button
                    aria-pressed=${n?"false":"true"}
                    @click=${()=>{this._category=void 0}}
                  >
                    ${this._t("gallery.all")}
                  </button>
                  ${r.map(t=>e`<button
                        aria-pressed=${n===t?"true":"false"}
                        @click=${()=>{this._category=t}}
                      >
                        ${t}
                      </button>`)}
                </div>`:d}
          ${"community"!==this._source||(null===(t=this.status)||void 0===t?void 0:t.communityLoaded)?l.length?e`<div class="grid">${l.map(e=>this._renderTile(e))}</div>`:e`<p class="empty">${this._t("gallery.none")}</p>`:e`<p class="empty">
                  ${this._t("gallery.load_shared")}
                  <br />
                  <ha-button
                    .disabled=${!0===(null===(i=this.status)||void 0===i?void 0:i.communityLoading)}
                    @click=${()=>this._fire("gallery-load-community")}
                  >
                    ${this._t((null===(s=this.status)||void 0===s?void 0:s.communityLoading)?"share.community_loading":"share.community_load")}
                  </ha-button>
                </p>`}
          ${this._renderFoot(c)}
        </div>
        ${_s(e`<ha-button slot="primaryAction" @click=${this._close}>${this._t("gallery.close")}</ha-button>`)}
      </ha-dialog>
    `}}s([a({attribute:!1})],qd.prototype,"hass",void 0),s([a({attribute:!1})],qd.prototype,"entries",void 0),s([a({type:Boolean})],qd.prototype,"open",void 0),s([a({attribute:!1})],qd.prototype,"selectedKey",void 0),s([a({attribute:!1})],qd.prototype,"status",void 0),s([o()],qd.prototype,"_source",void 0),s([o()],qd.prototype,"_category",void 0),s([o()],qd.prototype,"_query",void 0),s([o()],qd.prototype,"_showYaml",void 0),fs(gs,$o),fs(bs,Ld),fs(ys,Rd),fs($i,qd);export{$o as DeclutteringCardEditor,qd as DeclutteringGalleryDialog,Rd as DeclutteringHealthPanel,Ld as DeclutteringTemplateEditor};
//# sourceMappingURL=decluttering-card-plus.editors-B9B1Muny.js.map
