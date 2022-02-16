/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-builder",
factory: function (require) {
var plugin=(()=>{var gs=r=>{if(typeof require!="undefined")return require(r);throw new Error('Dynamic require of "'+r+'" is not supported')};var i=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports);var h=i((bp,Rt)=>{var _r=function(r){return r&&r.Math==Math&&r};Rt.exports=_r(typeof globalThis=="object"&&globalThis)||_r(typeof window=="object"&&window)||_r(typeof self=="object"&&self)||_r(typeof global=="object"&&global)||function(){return this}()||Function("return this")()});var C=i((gp,Ct)=>{Ct.exports=function(r){try{return!!r()}catch(e){return!0}}});var A=i((qp,Nt)=>{var qs=C();Nt.exports=!qs(function(){return Object.defineProperty({},1,{get:function(){return 7}})[1]!=7})});var fr=i((mp,kt)=>{var ms=C();kt.exports=!ms(function(){var r=function(){}.bind();return typeof r!="function"||r.hasOwnProperty("prototype")})});var U=i((wp,Lt)=>{var ws=fr(),Rr=Function.prototype.call;Lt.exports=ws?Rr.bind(Rr):function(){return Rr.apply(Rr,arguments)}});var Gt=i(At=>{"use strict";var Dt={}.propertyIsEnumerable,Mt=Object.getOwnPropertyDescriptor,Es=Mt&&!Dt.call({1:2},1);At.f=Es?function(e){var t=Mt(this,e);return!!t&&t.enumerable}:Dt});var fe=i((Op,Ft)=>{Ft.exports=function(r,e){return{enumerable:!(r&1),configurable:!(r&2),writable:!(r&4),value:e}}});var I=i((Sp,Kt)=>{var Bt=fr(),Ut=Function.prototype,Os=Ut.bind,ve=Ut.call,Ss=Bt&&Os.bind(ve,ve);Kt.exports=Bt?function(r){return r&&Ss(r)}:function(r){return r&&function(){return ve.apply(r,arguments)}}});var Cr=i((Tp,Vt)=>{var Wt=I(),Ts=Wt({}.toString),js=Wt("".slice);Vt.exports=function(r){return js(Ts(r),8,-1)}});var de=i((jp,$t)=>{var Is=h(),Ps=I(),xs=C(),_s=Cr(),pe=Is.Object,Rs=Ps("".split);$t.exports=xs(function(){return!pe("z").propertyIsEnumerable(0)})?function(r){return _s(r)=="String"?Rs(r,""):pe(r)}:pe});var he=i((Ip,Ht)=>{var Cs=h(),Ns=Cs.TypeError;Ht.exports=function(r){if(r==null)throw Ns("Can't call method on "+r);return r}});var Nr=i((Pp,Yt)=>{var ks=de(),Ls=he();Yt.exports=function(r){return ks(Ls(r))}});var w=i((xp,zt)=>{zt.exports=function(r){return typeof r=="function"}});var K=i((_p,Jt)=>{var Ds=w();Jt.exports=function(r){return typeof r=="object"?r!==null:Ds(r)}});var W=i((Rp,Xt)=>{var ye=h(),Ms=w(),As=function(r){return Ms(r)?r:void 0};Xt.exports=function(r,e){return arguments.length<2?As(ye[r]):ye[r]&&ye[r][e]}});var kr=i((Cp,Qt)=>{var Gs=I();Qt.exports=Gs({}.isPrototypeOf)});var vr=i((Np,Zt)=>{var Fs=W();Zt.exports=Fs("navigator","userAgent")||""});var Dr=i((kp,on)=>{var rn=h(),be=vr(),en=rn.process,tn=rn.Deno,nn=en&&en.versions||tn&&tn.version,an=nn&&nn.v8,N,Lr;an&&(N=an.split("."),Lr=N[0]>0&&N[0]<4?1:+(N[0]+N[1]));!Lr&&be&&(N=be.match(/Edge\/(\d+)/),(!N||N[1]>=74)&&(N=be.match(/Chrome\/(\d+)/),N&&(Lr=+N[1])));on.exports=Lr});var ge=i((Lp,un)=>{var sn=Dr(),Bs=C();un.exports=!!Object.getOwnPropertySymbols&&!Bs(function(){var r=Symbol();return!String(r)||!(Object(r)instanceof Symbol)||!Symbol.sham&&sn&&sn<41})});var qe=i((Dp,ln)=>{var Us=ge();ln.exports=Us&&!Symbol.sham&&typeof Symbol.iterator=="symbol"});var me=i((Mp,cn)=>{var Ks=h(),Ws=W(),Vs=w(),$s=kr(),Hs=qe(),Ys=Ks.Object;cn.exports=Hs?function(r){return typeof r=="symbol"}:function(r){var e=Ws("Symbol");return Vs(e)&&$s(e.prototype,Ys(r))}});var pr=i((Ap,fn)=>{var zs=h(),Js=zs.String;fn.exports=function(r){try{return Js(r)}catch(e){return"Object"}}});var Y=i((Gp,vn)=>{var Xs=h(),Qs=w(),Zs=pr(),ru=Xs.TypeError;vn.exports=function(r){if(Qs(r))return r;throw ru(Zs(r)+" is not a function")}});var Mr=i((Fp,pn)=>{var eu=Y();pn.exports=function(r,e){var t=r[e];return t==null?void 0:eu(t)}});var hn=i((Bp,dn)=>{var tu=h(),we=U(),Ee=w(),Oe=K(),nu=tu.TypeError;dn.exports=function(r,e){var t,n;if(e==="string"&&Ee(t=r.toString)&&!Oe(n=we(t,r))||Ee(t=r.valueOf)&&!Oe(n=we(t,r))||e!=="string"&&Ee(t=r.toString)&&!Oe(n=we(t,r)))return n;throw nu("Can't convert object to primitive value")}});var Se=i((Up,yn)=>{yn.exports=!1});var Ar=i((Kp,gn)=>{var bn=h(),iu=Object.defineProperty;gn.exports=function(r,e){try{iu(bn,r,{value:e,configurable:!0,writable:!0})}catch(t){bn[r]=e}return e}});var Gr=i((Wp,mn)=>{var au=h(),ou=Ar(),qn="__core-js_shared__",su=au[qn]||ou(qn,{});mn.exports=su});var Te=i((Vp,En)=>{var uu=Se(),wn=Gr();(En.exports=function(r,e){return wn[r]||(wn[r]=e!==void 0?e:{})})("versions",[]).push({version:"3.21.0",mode:uu?"pure":"global",copyright:"\xA9 2014-2022 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.21.0/LICENSE",source:"https://github.com/zloirock/core-js"})});var je=i(($p,On)=>{var lu=h(),cu=he(),fu=lu.Object;On.exports=function(r){return fu(cu(r))}});var L=i((Hp,Sn)=>{var vu=I(),pu=je(),du=vu({}.hasOwnProperty);Sn.exports=Object.hasOwn||function(e,t){return du(pu(e),t)}});var Ie=i((Yp,Tn)=>{var hu=I(),yu=0,bu=Math.random(),gu=hu(1 .toString);Tn.exports=function(r){return"Symbol("+(r===void 0?"":r)+")_"+gu(++yu+bu,36)}});var k=i((zp,_n)=>{var qu=h(),mu=Te(),jn=L(),wu=Ie(),In=ge(),Pn=qe(),nr=mu("wks"),z=qu.Symbol,xn=z&&z.for,Eu=Pn?z:z&&z.withoutSetter||wu;_n.exports=function(r){if(!jn(nr,r)||!(In||typeof nr[r]=="string")){var e="Symbol."+r;In&&jn(z,r)?nr[r]=z[r]:Pn&&xn?nr[r]=xn(e):nr[r]=Eu(e)}return nr[r]}});var kn=i((Jp,Nn)=>{var Ou=h(),Su=U(),Rn=K(),Cn=me(),Tu=Mr(),ju=hn(),Iu=k(),Pu=Ou.TypeError,xu=Iu("toPrimitive");Nn.exports=function(r,e){if(!Rn(r)||Cn(r))return r;var t=Tu(r,xu),n;if(t){if(e===void 0&&(e="default"),n=Su(t,r,e),!Rn(n)||Cn(n))return n;throw Pu("Can't convert object to primitive value")}return e===void 0&&(e="number"),ju(r,e)}});var Pe=i((Xp,Ln)=>{var _u=kn(),Ru=me();Ln.exports=function(r){var e=_u(r,"string");return Ru(e)?e:e+""}});var _e=i((Qp,Mn)=>{var Cu=h(),Dn=K(),xe=Cu.document,Nu=Dn(xe)&&Dn(xe.createElement);Mn.exports=function(r){return Nu?xe.createElement(r):{}}});var Re=i((Zp,An)=>{var ku=A(),Lu=C(),Du=_e();An.exports=!ku&&!Lu(function(){return Object.defineProperty(Du("div"),"a",{get:function(){return 7}}).a!=7})});var Fr=i(Fn=>{var Mu=A(),Au=U(),Gu=Gt(),Fu=fe(),Bu=Nr(),Uu=Pe(),Ku=L(),Wu=Re(),Gn=Object.getOwnPropertyDescriptor;Fn.f=Mu?Gn:function(e,t){if(e=Bu(e),t=Uu(t),Wu)try{return Gn(e,t)}catch(n){}if(Ku(e,t))return Fu(!Au(Gu.f,e,t),e[t])}});var Un=i((ed,Bn)=>{var Vu=A(),$u=C();Bn.exports=Vu&&$u(function(){return Object.defineProperty(function(){},"prototype",{value:42,writable:!1}).prototype!=42})});var G=i((td,Wn)=>{var Kn=h(),Hu=K(),Yu=Kn.String,zu=Kn.TypeError;Wn.exports=function(r){if(Hu(r))return r;throw zu(Yu(r)+" is not an object")}});var ir=i($n=>{var Ju=h(),Xu=A(),Qu=Re(),Zu=Un(),Br=G(),Vn=Pe(),rl=Ju.TypeError,Ce=Object.defineProperty,el=Object.getOwnPropertyDescriptor,Ne="enumerable",ke="configurable",Le="writable";$n.f=Xu?Zu?function(e,t,n){if(Br(e),t=Vn(t),Br(n),typeof e=="function"&&t==="prototype"&&"value"in n&&Le in n&&!n[Le]){var o=el(e,t);o&&o[Le]&&(e[t]=n.value,n={configurable:ke in n?n[ke]:o[ke],enumerable:Ne in n?n[Ne]:o[Ne],writable:!1})}return Ce(e,t,n)}:Ce:function(e,t,n){if(Br(e),t=Vn(t),Br(n),Qu)try{return Ce(e,t,n)}catch(o){}if("get"in n||"set"in n)throw rl("Accessors not supported");return"value"in n&&(e[t]=n.value),e}});var Ur=i((id,Hn)=>{var tl=A(),nl=ir(),il=fe();Hn.exports=tl?function(r,e,t){return nl.f(r,e,il(1,t))}:function(r,e,t){return r[e]=t,r}});var dr=i((ad,Yn)=>{var al=I(),ol=w(),De=Gr(),sl=al(Function.toString);ol(De.inspectSource)||(De.inspectSource=function(r){return sl(r)});Yn.exports=De.inspectSource});var Xn=i((od,Jn)=>{var ul=h(),ll=w(),cl=dr(),zn=ul.WeakMap;Jn.exports=ll(zn)&&/native code/.test(cl(zn))});var ri=i((sd,Zn)=>{var fl=Te(),vl=Ie(),Qn=fl("keys");Zn.exports=function(r){return Qn[r]||(Qn[r]=vl(r))}});var Me=i((ud,ei)=>{ei.exports={}});var Ke=i((ld,oi)=>{var pl=Xn(),ti=h(),Ae=I(),dl=K(),hl=Ur(),Ge=L(),Fe=Gr(),yl=ri(),bl=Me(),ni="Object already initialized",Be=ti.TypeError,gl=ti.WeakMap,Kr,hr,Wr,ql=function(r){return Wr(r)?hr(r):Kr(r,{})},ml=function(r){return function(e){var t;if(!dl(e)||(t=hr(e)).type!==r)throw Be("Incompatible receiver, "+r+" required");return t}};pl||Fe.state?(V=Fe.state||(Fe.state=new gl),ii=Ae(V.get),Ue=Ae(V.has),ai=Ae(V.set),Kr=function(r,e){if(Ue(V,r))throw new Be(ni);return e.facade=r,ai(V,r,e),e},hr=function(r){return ii(V,r)||{}},Wr=function(r){return Ue(V,r)}):(J=yl("state"),bl[J]=!0,Kr=function(r,e){if(Ge(r,J))throw new Be(ni);return e.facade=r,hl(r,J,e),e},hr=function(r){return Ge(r,J)?r[J]:{}},Wr=function(r){return Ge(r,J)});var V,ii,Ue,ai,J;oi.exports={set:Kr,get:hr,has:Wr,enforce:ql,getterFor:ml}});var li=i((cd,ui)=>{var We=A(),wl=L(),si=Function.prototype,El=We&&Object.getOwnPropertyDescriptor,Ve=wl(si,"name"),Ol=Ve&&function(){}.name==="something",Sl=Ve&&(!We||We&&El(si,"name").configurable);ui.exports={EXISTS:Ve,PROPER:Ol,CONFIGURABLE:Sl}});var yr=i((fd,pi)=>{var Tl=h(),ci=w(),jl=L(),fi=Ur(),Il=Ar(),Pl=dr(),vi=Ke(),xl=li().CONFIGURABLE,_l=vi.get,Rl=vi.enforce,Cl=String(String).split("String");(pi.exports=function(r,e,t,n){var o=n?!!n.unsafe:!1,c=n?!!n.enumerable:!1,v=n?!!n.noTargetGet:!1,f=n&&n.name!==void 0?n.name:e,l;if(ci(t)&&(String(f).slice(0,7)==="Symbol("&&(f="["+String(f).replace(/^Symbol\(([^)]*)\)/,"$1")+"]"),(!jl(t,"name")||xl&&t.name!==f)&&fi(t,"name",f),l=Rl(t),l.source||(l.source=Cl.join(typeof f=="string"?f:""))),r===Tl){c?r[e]=t:Il(e,t);return}else o?!v&&r[e]&&(c=!0):delete r[e];c?r[e]=t:fi(r,e,t)})(Function.prototype,"toString",function(){return ci(this)&&_l(this).source||Pl(this)})});var $e=i((vd,di)=>{var Nl=Math.ceil,kl=Math.floor;di.exports=function(r){var e=+r;return e!==e||e===0?0:(e>0?kl:Nl)(e)}});var yi=i((pd,hi)=>{var Ll=$e(),Dl=Math.max,Ml=Math.min;hi.exports=function(r,e){var t=Ll(r);return t<0?Dl(t+e,0):Ml(t,e)}});var gi=i((dd,bi)=>{var Al=$e(),Gl=Math.min;bi.exports=function(r){return r>0?Gl(Al(r),9007199254740991):0}});var Vr=i((hd,qi)=>{var Fl=gi();qi.exports=function(r){return Fl(r.length)}});var Ei=i((yd,wi)=>{var Bl=Nr(),Ul=yi(),Kl=Vr(),mi=function(r){return function(e,t,n){var o=Bl(e),c=Kl(o),v=Ul(n,c),f;if(r&&t!=t){for(;c>v;)if(f=o[v++],f!=f)return!0}else for(;c>v;v++)if((r||v in o)&&o[v]===t)return r||v||0;return!r&&-1}};wi.exports={includes:mi(!0),indexOf:mi(!1)}});var Ti=i((bd,Si)=>{var Wl=I(),He=L(),Vl=Nr(),$l=Ei().indexOf,Hl=Me(),Oi=Wl([].push);Si.exports=function(r,e){var t=Vl(r),n=0,o=[],c;for(c in t)!He(Hl,c)&&He(t,c)&&Oi(o,c);for(;e.length>n;)He(t,c=e[n++])&&(~$l(o,c)||Oi(o,c));return o}});var Ii=i((gd,ji)=>{ji.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]});var xi=i(Pi=>{var Yl=Ti(),zl=Ii(),Jl=zl.concat("length","prototype");Pi.f=Object.getOwnPropertyNames||function(e){return Yl(e,Jl)}});var Ri=i(_i=>{_i.f=Object.getOwnPropertySymbols});var Ni=i((wd,Ci)=>{var Xl=W(),Ql=I(),Zl=xi(),rc=Ri(),ec=G(),tc=Ql([].concat);Ci.exports=Xl("Reflect","ownKeys")||function(e){var t=Zl.f(ec(e)),n=rc.f;return n?tc(t,n(e)):t}});var Di=i((Ed,Li)=>{var ki=L(),nc=Ni(),ic=Fr(),ac=ir();Li.exports=function(r,e,t){for(var n=nc(e),o=ac.f,c=ic.f,v=0;v<n.length;v++){var f=n[v];!ki(r,f)&&!(t&&ki(t,f))&&o(r,f,c(e,f))}}});var Ye=i((Od,Mi)=>{var oc=C(),sc=w(),uc=/#|\.prototype\./,br=function(r,e){var t=cc[lc(r)];return t==vc?!0:t==fc?!1:sc(e)?oc(e):!!e},lc=br.normalize=function(r){return String(r).replace(uc,".").toLowerCase()},cc=br.data={},fc=br.NATIVE="N",vc=br.POLYFILL="P";Mi.exports=br});var $r=i((Sd,Ai)=>{var ze=h(),pc=Fr().f,dc=Ur(),hc=yr(),yc=Ar(),bc=Di(),gc=Ye();Ai.exports=function(r,e){var t=r.target,n=r.global,o=r.stat,c,v,f,l,y,b;if(n?v=ze:o?v=ze[t]||yc(t,{}):v=(ze[t]||{}).prototype,v)for(f in e){if(y=e[f],r.noTargetGet?(b=pc(v,f),l=b&&b.value):l=v[f],c=gc(n?f:t+(o?".":"#")+f,r.forced),!c&&l!==void 0){if(typeof y==typeof l)continue;bc(y,l)}(r.sham||l&&l.sham)&&dc(y,"sham",!0),hc(v,f,y,r)}}});var Je=i(()=>{var qc=$r(),mc=A(),Gi=ir().f;qc({target:"Object",stat:!0,forced:Object.defineProperty!==Gi,sham:!mc},{defineProperty:Gi})});var Fi=i((Id,Qe)=>{var Xe=function(r){"use strict";var e=Object.prototype,t=e.hasOwnProperty,n,o=typeof Symbol=="function"?Symbol:{},c=o.iterator||"@@iterator",v=o.asyncIterator||"@@asyncIterator",f=o.toStringTag||"@@toStringTag";function l(s,a,u){return Object.defineProperty(s,a,{value:u,enumerable:!0,configurable:!0,writable:!0}),s[a]}try{l({},"")}catch(s){l=function(a,u,d){return a[u]=d}}function y(s,a,u,d){var p=a&&a.prototype instanceof er?a:er,g=Object.create(p.prototype),S=new ue(d||[]);return g._invoke=ys(s,u,S),g}r.wrap=y;function b(s,a,u){try{return{type:"normal",arg:s.call(a,u)}}catch(d){return{type:"throw",arg:d}}}var x="suspendedStart",E="suspendedYield",m="executing",M="completed",O={};function er(){}function q(){}function $(){}var ae={};l(ae,c,function(){return this});var oe=Object.getPrototypeOf,Pr=oe&&oe(oe(le([])));Pr&&Pr!==e&&t.call(Pr,c)&&(ae=Pr);var tr=$.prototype=er.prototype=Object.create(ae);q.prototype=$,l(tr,"constructor",$),l($,"constructor",q),q.displayName=l($,f,"GeneratorFunction");function Pt(s){["next","throw","return"].forEach(function(a){l(s,a,function(u){return this._invoke(a,u)})})}r.isGeneratorFunction=function(s){var a=typeof s=="function"&&s.constructor;return a?a===q||(a.displayName||a.name)==="GeneratorFunction":!1},r.mark=function(s){return Object.setPrototypeOf?Object.setPrototypeOf(s,$):(s.__proto__=$,l(s,f,"GeneratorFunction")),s.prototype=Object.create(tr),s},r.awrap=function(s){return{__await:s}};function xr(s,a){function u(g,S,T,_){var j=b(s[g],s,S);if(j.type==="throw")_(j.arg);else{var ce=j.arg,cr=ce.value;return cr&&typeof cr=="object"&&t.call(cr,"__await")?a.resolve(cr.__await).then(function(H){u("next",H,T,_)},function(H){u("throw",H,T,_)}):a.resolve(cr).then(function(H){ce.value=H,T(ce)},function(H){return u("throw",H,T,_)})}}var d;function p(g,S){function T(){return new a(function(_,j){u(g,S,_,j)})}return d=d?d.then(T,T):T()}this._invoke=p}Pt(xr.prototype),l(xr.prototype,v,function(){return this}),r.AsyncIterator=xr,r.async=function(s,a,u,d,p){p===void 0&&(p=Promise);var g=new xr(y(s,a,u,d),p);return r.isGeneratorFunction(a)?g:g.next().then(function(S){return S.done?S.value:g.next()})};function ys(s,a,u){var d=x;return function(g,S){if(d===m)throw new Error("Generator is already running");if(d===M){if(g==="throw")throw S;return _t()}for(u.method=g,u.arg=S;;){var T=u.delegate;if(T){var _=xt(T,u);if(_){if(_===O)continue;return _}}if(u.method==="next")u.sent=u._sent=u.arg;else if(u.method==="throw"){if(d===x)throw d=M,u.arg;u.dispatchException(u.arg)}else u.method==="return"&&u.abrupt("return",u.arg);d=m;var j=b(s,a,u);if(j.type==="normal"){if(d=u.done?M:E,j.arg===O)continue;return{value:j.arg,done:u.done}}else j.type==="throw"&&(d=M,u.method="throw",u.arg=j.arg)}}}function xt(s,a){var u=s.iterator[a.method];if(u===n){if(a.delegate=null,a.method==="throw"){if(s.iterator.return&&(a.method="return",a.arg=n,xt(s,a),a.method==="throw"))return O;a.method="throw",a.arg=new TypeError("The iterator does not provide a 'throw' method")}return O}var d=b(u,s.iterator,a.arg);if(d.type==="throw")return a.method="throw",a.arg=d.arg,a.delegate=null,O;var p=d.arg;if(!p)return a.method="throw",a.arg=new TypeError("iterator result is not an object"),a.delegate=null,O;if(p.done)a[s.resultName]=p.value,a.next=s.nextLoc,a.method!=="return"&&(a.method="next",a.arg=n);else return p;return a.delegate=null,O}Pt(tr),l(tr,f,"Generator"),l(tr,c,function(){return this}),l(tr,"toString",function(){return"[object Generator]"});function bs(s){var a={tryLoc:s[0]};1 in s&&(a.catchLoc=s[1]),2 in s&&(a.finallyLoc=s[2],a.afterLoc=s[3]),this.tryEntries.push(a)}function se(s){var a=s.completion||{};a.type="normal",delete a.arg,s.completion=a}function ue(s){this.tryEntries=[{tryLoc:"root"}],s.forEach(bs,this),this.reset(!0)}r.keys=function(s){var a=[];for(var u in s)a.push(u);return a.reverse(),function d(){for(;a.length;){var p=a.pop();if(p in s)return d.value=p,d.done=!1,d}return d.done=!0,d}};function le(s){if(s){var a=s[c];if(a)return a.call(s);if(typeof s.next=="function")return s;if(!isNaN(s.length)){var u=-1,d=function p(){for(;++u<s.length;)if(t.call(s,u))return p.value=s[u],p.done=!1,p;return p.value=n,p.done=!0,p};return d.next=d}}return{next:_t}}r.values=le;function _t(){return{value:n,done:!0}}return ue.prototype={constructor:ue,reset:function(s){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(se),!s)for(var a in this)a.charAt(0)==="t"&&t.call(this,a)&&!isNaN(+a.slice(1))&&(this[a]=n)},stop:function(){this.done=!0;var s=this.tryEntries[0],a=s.completion;if(a.type==="throw")throw a.arg;return this.rval},dispatchException:function(s){if(this.done)throw s;var a=this;function u(_,j){return g.type="throw",g.arg=s,a.next=_,j&&(a.method="next",a.arg=n),!!j}for(var d=this.tryEntries.length-1;d>=0;--d){var p=this.tryEntries[d],g=p.completion;if(p.tryLoc==="root")return u("end");if(p.tryLoc<=this.prev){var S=t.call(p,"catchLoc"),T=t.call(p,"finallyLoc");if(S&&T){if(this.prev<p.catchLoc)return u(p.catchLoc,!0);if(this.prev<p.finallyLoc)return u(p.finallyLoc)}else if(S){if(this.prev<p.catchLoc)return u(p.catchLoc,!0)}else if(T){if(this.prev<p.finallyLoc)return u(p.finallyLoc)}else throw new Error("try statement without catch or finally")}}},abrupt:function(s,a){for(var u=this.tryEntries.length-1;u>=0;--u){var d=this.tryEntries[u];if(d.tryLoc<=this.prev&&t.call(d,"finallyLoc")&&this.prev<d.finallyLoc){var p=d;break}}p&&(s==="break"||s==="continue")&&p.tryLoc<=a&&a<=p.finallyLoc&&(p=null);var g=p?p.completion:{};return g.type=s,g.arg=a,p?(this.method="next",this.next=p.finallyLoc,O):this.complete(g)},complete:function(s,a){if(s.type==="throw")throw s.arg;return s.type==="break"||s.type==="continue"?this.next=s.arg:s.type==="return"?(this.rval=this.arg=s.arg,this.method="return",this.next="end"):s.type==="normal"&&a&&(this.next=a),O},finish:function(s){for(var a=this.tryEntries.length-1;a>=0;--a){var u=this.tryEntries[a];if(u.finallyLoc===s)return this.complete(u.completion,u.afterLoc),se(u),O}},catch:function(s){for(var a=this.tryEntries.length-1;a>=0;--a){var u=this.tryEntries[a];if(u.tryLoc===s){var d=u.completion;if(d.type==="throw"){var p=d.arg;se(u)}return p}}throw new Error("illegal catch attempt")},delegateYield:function(s,a,u){return this.delegate={iterator:le(s),resultName:a,nextLoc:u},this.method==="next"&&(this.arg=n),O}},r}(typeof Qe=="object"?Qe.exports:{});try{regeneratorRuntime=Xe}catch(r){typeof globalThis=="object"?globalThis.regeneratorRuntime=Xe:Function("r","regeneratorRuntime = r")(Xe)}});var Ki=i((Pd,Ui)=>{var wc=h(),Ec=Y(),Oc=je(),Sc=de(),Tc=Vr(),jc=wc.TypeError,Bi=function(r){return function(e,t,n,o){Ec(t);var c=Oc(e),v=Sc(c),f=Tc(c),l=r?f-1:0,y=r?-1:1;if(n<2)for(;;){if(l in v){o=v[l],l+=y;break}if(l+=y,r?l<0:f<=l)throw jc("Reduce of empty array with no initial value")}for(;r?l>=0:f>l;l+=y)l in v&&(o=t(o,v[l],l,c));return o}};Ui.exports={left:Bi(!1),right:Bi(!0)}});var Vi=i((xd,Wi)=>{"use strict";var Ic=C();Wi.exports=function(r,e){var t=[][r];return!!t&&Ic(function(){t.call(null,e||function(){throw 1},1)})}});var gr=i((_d,$i)=>{var Pc=Cr(),xc=h();$i.exports=Pc(xc.process)=="process"});var Yi=i(()=>{"use strict";var _c=$r(),Rc=Ki().left,Cc=Vi(),Hi=Dr(),Nc=gr(),kc=Cc("reduce"),Lc=!Nc&&Hi>79&&Hi<83;_c({target:"Array",proto:!0,forced:!kc||Lc},{reduce:function(e){var t=arguments.length;return Rc(this,e,t,t>1?arguments[1]:void 0)}})});var Hr=i((Nd,Ji)=>{var Dc=k(),Mc=Dc("toStringTag"),zi={};zi[Mc]="z";Ji.exports=String(zi)==="[object z]"});var zr=i((kd,Xi)=>{var Ac=h(),Gc=Hr(),Fc=w(),Yr=Cr(),Bc=k(),Uc=Bc("toStringTag"),Kc=Ac.Object,Wc=Yr(function(){return arguments}())=="Arguments",Vc=function(r,e){try{return r[e]}catch(t){}};Xi.exports=Gc?Yr:function(r){var e,t,n;return r===void 0?"Undefined":r===null?"Null":typeof(t=Vc(e=Kc(r),Uc))=="string"?t:Wc?Yr(e):(n=Yr(e))=="Object"&&Fc(e.callee)?"Arguments":n}});var Zi=i((Ld,Qi)=>{"use strict";var $c=Hr(),Hc=zr();Qi.exports=$c?{}.toString:function(){return"[object "+Hc(this)+"]"}});var ra=i(()=>{var Yc=Hr(),zc=yr(),Jc=Zi();Yc||zc(Object.prototype,"toString",Jc,{unsafe:!0})});var ta=i((Ad,ea)=>{var Xc=h();ea.exports=Xc.Promise});var ia=i((Gd,na)=>{var Qc=yr();na.exports=function(r,e,t){for(var n in e)Qc(r,n,e[n],t);return r}});var sa=i((Fd,oa)=>{var aa=h(),Zc=w(),rf=aa.String,ef=aa.TypeError;oa.exports=function(r){if(typeof r=="object"||Zc(r))return r;throw ef("Can't set "+rf(r)+" as a prototype")}});var la=i((Bd,ua)=>{var tf=I(),nf=G(),af=sa();ua.exports=Object.setPrototypeOf||("__proto__"in{}?function(){var r=!1,e={},t;try{t=tf(Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set),t(e,[]),r=e instanceof Array}catch(n){}return function(o,c){return nf(o),af(c),r?t(o,c):o.__proto__=c,o}}():void 0)});var va=i((Ud,fa)=>{var of=ir().f,sf=L(),uf=k(),ca=uf("toStringTag");fa.exports=function(r,e,t){r&&!t&&(r=r.prototype),r&&!sf(r,ca)&&of(r,ca,{configurable:!0,value:e})}});var ha=i((Kd,da)=>{"use strict";var lf=W(),cf=ir(),ff=k(),vf=A(),pa=ff("species");da.exports=function(r){var e=lf(r),t=cf.f;vf&&e&&!e[pa]&&t(e,pa,{configurable:!0,get:function(){return this}})}});var ba=i((Wd,ya)=>{var pf=h(),df=kr(),hf=pf.TypeError;ya.exports=function(r,e){if(df(e,r))return r;throw hf("Incorrect invocation")}});var Jr=i((Vd,qa)=>{var ga=I(),yf=Y(),bf=fr(),gf=ga(ga.bind);qa.exports=function(r,e){return yf(r),e===void 0?r:bf?gf(r,e):function(){return r.apply(e,arguments)}}});var Ze=i(($d,ma)=>{ma.exports={}});var Ea=i((Hd,wa)=>{var qf=k(),mf=Ze(),wf=qf("iterator"),Ef=Array.prototype;wa.exports=function(r){return r!==void 0&&(mf.Array===r||Ef[wf]===r)}});var rt=i((Yd,Sa)=>{var Of=zr(),Oa=Mr(),Sf=Ze(),Tf=k(),jf=Tf("iterator");Sa.exports=function(r){if(r!=null)return Oa(r,jf)||Oa(r,"@@iterator")||Sf[Of(r)]}});var ja=i((zd,Ta)=>{var If=h(),Pf=U(),xf=Y(),_f=G(),Rf=pr(),Cf=rt(),Nf=If.TypeError;Ta.exports=function(r,e){var t=arguments.length<2?Cf(r):e;if(xf(t))return _f(Pf(t,r));throw Nf(Rf(r)+" is not iterable")}});var xa=i((Jd,Pa)=>{var kf=U(),Ia=G(),Lf=Mr();Pa.exports=function(r,e,t){var n,o;Ia(r);try{if(n=Lf(r,"return"),!n){if(e==="throw")throw t;return t}n=kf(n,r)}catch(c){o=!0,n=c}if(e==="throw")throw t;if(o)throw n;return Ia(n),t}});var ka=i((Xd,Na)=>{var Df=h(),Mf=Jr(),Af=U(),Gf=G(),Ff=pr(),Bf=Ea(),Uf=Vr(),_a=kr(),Kf=ja(),Wf=rt(),Ra=xa(),Vf=Df.TypeError,Xr=function(r,e){this.stopped=r,this.result=e},Ca=Xr.prototype;Na.exports=function(r,e,t){var n=t&&t.that,o=!!(t&&t.AS_ENTRIES),c=!!(t&&t.IS_ITERATOR),v=!!(t&&t.INTERRUPTED),f=Mf(e,n),l,y,b,x,E,m,M,O=function(q){return l&&Ra(l,"normal",q),new Xr(!0,q)},er=function(q){return o?(Gf(q),v?f(q[0],q[1],O):f(q[0],q[1])):v?f(q,O):f(q)};if(c)l=r;else{if(y=Wf(r),!y)throw Vf(Ff(r)+" is not iterable");if(Bf(y)){for(b=0,x=Uf(r);x>b;b++)if(E=er(r[b]),E&&_a(Ca,E))return E;return new Xr(!1)}l=Kf(r,y)}for(m=l.next;!(M=Af(m,l)).done;){try{E=er(M.value)}catch(q){Ra(l,"throw",q)}if(typeof E=="object"&&E&&_a(Ca,E))return E}return new Xr(!1)}});var Ga=i((Qd,Aa)=>{var $f=k(),La=$f("iterator"),Da=!1;try{Ma=0,et={next:function(){return{done:!!Ma++}},return:function(){Da=!0}},et[La]=function(){return this},Array.from(et,function(){throw 2})}catch(r){}var Ma,et;Aa.exports=function(r,e){if(!e&&!Da)return!1;var t=!1;try{var n={};n[La]=function(){return{next:function(){return{done:t=!0}}}},r(n)}catch(o){}return t}});var Va=i((Zd,Wa)=>{var Hf=I(),Yf=C(),Fa=w(),zf=zr(),Jf=W(),Xf=dr(),Ba=function(){},Qf=[],Ua=Jf("Reflect","construct"),tt=/^\s*(?:class|function)\b/,Zf=Hf(tt.exec),rv=!tt.exec(Ba),qr=function(e){if(!Fa(e))return!1;try{return Ua(Ba,Qf,e),!0}catch(t){return!1}},Ka=function(e){if(!Fa(e))return!1;switch(zf(e)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return!1}try{return rv||!!Zf(tt,Xf(e))}catch(t){return!0}};Ka.sham=!0;Wa.exports=!Ua||Yf(function(){var r;return qr(qr.call)||!qr(Object)||!qr(function(){r=!0})||r})?Ka:qr});var Ha=i((rh,$a)=>{var ev=h(),tv=Va(),nv=pr(),iv=ev.TypeError;$a.exports=function(r){if(tv(r))return r;throw iv(nv(r)+" is not a constructor")}});var Ja=i((eh,za)=>{var Ya=G(),av=Ha(),ov=k(),sv=ov("species");za.exports=function(r,e){var t=Ya(r).constructor,n;return t===void 0||(n=Ya(t)[sv])==null?e:av(n)}});var eo=i((th,ro)=>{var uv=fr(),Xa=Function.prototype,Qa=Xa.apply,Za=Xa.call;ro.exports=typeof Reflect=="object"&&Reflect.apply||(uv?Za.bind(Qa):function(){return Za.apply(Qa,arguments)})});var no=i((nh,to)=>{var lv=W();to.exports=lv("document","documentElement")});var ao=i((ih,io)=>{var cv=I();io.exports=cv([].slice)});var so=i((ah,oo)=>{var fv=h(),vv=fv.TypeError;oo.exports=function(r,e){if(r<e)throw vv("Not enough arguments");return r}});var nt=i((oh,uo)=>{var pv=vr();uo.exports=/(?:ipad|iphone|ipod).*applewebkit/i.test(pv)});var vt=i((sh,bo)=>{var P=h(),dv=eo(),hv=Jr(),lo=w(),yv=L(),bv=C(),co=no(),gv=ao(),fo=_e(),qv=so(),mv=nt(),wv=gr(),it=P.setImmediate,at=P.clearImmediate,Ev=P.process,ot=P.Dispatch,Ov=P.Function,vo=P.MessageChannel,Sv=P.String,st=0,mr={},po="onreadystatechange",wr,X,ut,lt;try{wr=P.location}catch(r){}var ct=function(r){if(yv(mr,r)){var e=mr[r];delete mr[r],e()}},ft=function(r){return function(){ct(r)}},ho=function(r){ct(r.data)},yo=function(r){P.postMessage(Sv(r),wr.protocol+"//"+wr.host)};(!it||!at)&&(it=function(e){qv(arguments.length,1);var t=lo(e)?e:Ov(e),n=gv(arguments,1);return mr[++st]=function(){dv(t,void 0,n)},X(st),st},at=function(e){delete mr[e]},wv?X=function(r){Ev.nextTick(ft(r))}:ot&&ot.now?X=function(r){ot.now(ft(r))}:vo&&!mv?(ut=new vo,lt=ut.port2,ut.port1.onmessage=ho,X=hv(lt.postMessage,lt)):P.addEventListener&&lo(P.postMessage)&&!P.importScripts&&wr&&wr.protocol!=="file:"&&!bv(yo)?(X=yo,P.addEventListener("message",ho,!1)):po in fo("script")?X=function(r){co.appendChild(fo("script"))[po]=function(){co.removeChild(this),ct(r)}}:X=function(r){setTimeout(ft(r),0)});bo.exports={set:it,clear:at}});var qo=i((uh,go)=>{var Tv=vr(),jv=h();go.exports=/ipad|iphone|ipod/i.test(Tv)&&jv.Pebble!==void 0});var wo=i((lh,mo)=>{var Iv=vr();mo.exports=/web0s(?!.*chrome)/i.test(Iv)});var _o=i((ch,xo)=>{var Q=h(),Eo=Jr(),Pv=Fr().f,pt=vt().set,xv=nt(),_v=qo(),Rv=wo(),dt=gr(),Oo=Q.MutationObserver||Q.WebKitMutationObserver,So=Q.document,To=Q.process,Qr=Q.Promise,jo=Pv(Q,"queueMicrotask"),Io=jo&&jo.value,Er,Z,Or,ar,ht,yt,Zr,Po;Io||(Er=function(){var r,e;for(dt&&(r=To.domain)&&r.exit();Z;){e=Z.fn,Z=Z.next;try{e()}catch(t){throw Z?ar():Or=void 0,t}}Or=void 0,r&&r.enter()},!xv&&!dt&&!Rv&&Oo&&So?(ht=!0,yt=So.createTextNode(""),new Oo(Er).observe(yt,{characterData:!0}),ar=function(){yt.data=ht=!ht}):!_v&&Qr&&Qr.resolve?(Zr=Qr.resolve(void 0),Zr.constructor=Qr,Po=Eo(Zr.then,Zr),ar=function(){Po(Er)}):dt?ar=function(){To.nextTick(Er)}:(pt=Eo(pt,Q),ar=function(){pt(Er)}));xo.exports=Io||function(r){var e={fn:r,next:void 0};Or&&(Or.next=e),Z||(Z=e,ar()),Or=e}});var bt=i((fh,Co)=>{"use strict";var Ro=Y(),Cv=function(r){var e,t;this.promise=new r(function(n,o){if(e!==void 0||t!==void 0)throw TypeError("Bad Promise constructor");e=n,t=o}),this.resolve=Ro(e),this.reject=Ro(t)};Co.exports.f=function(r){return new Cv(r)}});var ko=i((vh,No)=>{var Nv=G(),kv=K(),Lv=bt();No.exports=function(r,e){if(Nv(r),kv(e)&&e.constructor===r)return e;var t=Lv.f(r),n=t.resolve;return n(e),t.promise}});var Do=i((ph,Lo)=>{var Dv=h();Lo.exports=function(r,e){var t=Dv.console;t&&t.error&&(arguments.length==1?t.error(r):t.error(r,e))}});var Ao=i((dh,Mo)=>{Mo.exports=function(r){try{return{error:!1,value:r()}}catch(e){return{error:!0,value:e}}}});var Bo=i((hh,Fo)=>{var Go=function(){this.head=null,this.tail=null};Go.prototype={add:function(r){var e={item:r,next:null};this.head?this.tail.next=e:this.head=e,this.tail=e},get:function(){var r=this.head;if(r)return this.head=r.next,this.tail===r&&(this.tail=null),r.item}};Fo.exports=Go});var Ko=i((yh,Uo)=>{Uo.exports=typeof window=="object"});var cs=i(()=>{"use strict";var re=$r(),ee=Se(),F=h(),Mv=W(),B=U(),te=ta(),Wo=yr(),Av=ia(),Vo=la(),Gv=va(),Fv=ha(),gt=Y(),Sr=w(),Bv=K(),Uv=ba(),Kv=dr(),$o=ka(),Wv=Ga(),Vv=Ja(),Ho=vt().set,qt=_o(),$v=ko(),Hv=Do(),Yo=bt(),mt=Ao(),Yv=Bo(),wt=Ke(),zv=Ye(),Jv=k(),Xv=Ko(),ne=gr(),zo=Dr(),Qv=Jv("species"),D="Promise",Jo=wt.getterFor(D),Zv=wt.set,rp=wt.getterFor(D),rr=te&&te.prototype,R=te,or=rr,Xo=F.TypeError,Et=F.document,Ot=F.process,sr=Yo.f,ep=sr,tp=!!(Et&&Et.createEvent&&F.dispatchEvent),Qo=Sr(F.PromiseRejectionEvent),Zo="unhandledrejection",np="rejectionhandled",rs=0,es=1,ip=2,St=1,ts=2,Tt=!1,ie,ns,jt,is,Tr=zv(D,function(){var r=Kv(R),e=r!==String(R);if(!e&&zo===66||ee&&!or.finally)return!0;if(zo>=51&&/native code/.test(r))return!1;var t=new R(function(c){c(1)}),n=function(c){c(function(){},function(){})},o=t.constructor={};return o[Qv]=n,Tt=t.then(function(){})instanceof n,Tt?!e&&Xv&&!Qo:!0}),ap=Tr||!Wv(function(r){R.all(r).catch(function(){})}),as=function(r){var e;return Bv(r)&&Sr(e=r.then)?e:!1},os=function(r,e){var t=e.value,n=e.state==es,o=n?r.ok:r.fail,c=r.resolve,v=r.reject,f=r.domain,l,y,b;try{o?(n||(e.rejection===ts&&sp(e),e.rejection=St),o===!0?l=t:(f&&f.enter(),l=o(t),f&&(f.exit(),b=!0)),l===r.promise?v(Xo("Promise-chain cycle")):(y=as(l))?B(y,l,c,v):c(l)):v(t)}catch(x){f&&!b&&f.exit(),v(x)}},ss=function(r,e){r.notified||(r.notified=!0,qt(function(){for(var t=r.reactions,n;n=t.get();)os(n,r);r.notified=!1,e&&!r.rejection&&op(r)}))},us=function(r,e,t){var n,o;tp?(n=Et.createEvent("Event"),n.promise=e,n.reason=t,n.initEvent(r,!1,!0),F.dispatchEvent(n)):n={promise:e,reason:t},!Qo&&(o=F["on"+r])?o(n):r===Zo&&Hv("Unhandled promise rejection",t)},op=function(r){B(Ho,F,function(){var e=r.facade,t=r.value,n=ls(r),o;if(n&&(o=mt(function(){ne?Ot.emit("unhandledRejection",t,e):us(Zo,e,t)}),r.rejection=ne||ls(r)?ts:St,o.error))throw o.value})},ls=function(r){return r.rejection!==St&&!r.parent},sp=function(r){B(Ho,F,function(){var e=r.facade;ne?Ot.emit("rejectionHandled",e):us(np,e,r.value)})},ur=function(r,e,t){return function(n){r(e,n,t)}},lr=function(r,e,t){r.done||(r.done=!0,t&&(r=t),r.value=e,r.state=ip,ss(r,!0))},It=function(r,e,t){if(!r.done){r.done=!0,t&&(r=t);try{if(r.facade===e)throw Xo("Promise can't be resolved itself");var n=as(e);n?qt(function(){var o={done:!1};try{B(n,e,ur(It,o,r),ur(lr,o,r))}catch(c){lr(o,c,r)}}):(r.value=e,r.state=es,ss(r,!1))}catch(o){lr({done:!1},o,r)}}};if(Tr&&(R=function(e){Uv(this,or),gt(e),B(ie,this);var t=Jo(this);try{e(ur(It,t),ur(lr,t))}catch(n){lr(t,n)}},or=R.prototype,ie=function(e){Zv(this,{type:D,done:!1,notified:!1,parent:!1,reactions:new Yv,rejection:!1,state:rs,value:void 0})},ie.prototype=Av(or,{then:function(e,t){var n=rp(this),o=sr(Vv(this,R));return n.parent=!0,o.ok=Sr(e)?e:!0,o.fail=Sr(t)&&t,o.domain=ne?Ot.domain:void 0,n.state==rs?n.reactions.add(o):qt(function(){os(o,n)}),o.promise},catch:function(r){return this.then(void 0,r)}}),ns=function(){var r=new ie,e=Jo(r);this.promise=r,this.resolve=ur(It,e),this.reject=ur(lr,e)},Yo.f=sr=function(r){return r===R||r===jt?new ns(r):ep(r)},!ee&&Sr(te)&&rr!==Object.prototype)){is=rr.then,Tt||(Wo(rr,"then",function(e,t){var n=this;return new R(function(o,c){B(is,n,o,c)}).then(e,t)},{unsafe:!0}),Wo(rr,"catch",or.catch,{unsafe:!0}));try{delete rr.constructor}catch(r){}Vo&&Vo(rr,or)}re({global:!0,wrap:!0,forced:Tr},{Promise:R});Gv(R,D,!1,!0);Fv(D);jt=Mv(D);re({target:D,stat:!0,forced:Tr},{reject:function(e){var t=sr(this);return B(t.reject,void 0,e),t.promise}});re({target:D,stat:!0,forced:ee||Tr},{resolve:function(e){return $v(ee&&this===jt?R:this,e)}});re({target:D,stat:!0,forced:ap},{all:function(e){var t=this,n=sr(t),o=n.resolve,c=n.reject,v=mt(function(){var f=gt(t.resolve),l=[],y=0,b=1;$o(e,function(x){var E=y++,m=!1;b++,B(f,t,x).then(function(M){m||(m=!0,l[E]=M,--b||o(l))},c)}),--b||o(l)});return v.error&&c(v.value),n.promise},race:function(e){var t=this,n=sr(t),o=n.reject,c=mt(function(){var v=gt(t.resolve);$o(e,function(f){B(v,t,f).then(n.resolve,o)})});return c.error&&o(c.value),n.promise}})});var ds=i((jr,ps)=>{"use strict";Je();Object.defineProperty(jr,"__esModule",{value:!0});jr.default=void 0;Fi();Yi();ra();cs();var up=gs("@yarnpkg/core");function fs(r,e,t,n,o,c,v){try{var f=r[c](v),l=f.value}catch(y){t(y);return}f.done?e(l):Promise.resolve(l).then(n,o)}function vs(r){return function(){var e=this,t=arguments;return new Promise(function(n,o){var c=r.apply(e,t);function v(l){fs(c,n,o,v,f,"next",l)}function f(l){fs(c,n,o,v,f,"throw",l)}v(void 0)})}}var lp={title:"Preparing builder plugin",task:function(){var r=vs(regeneratorRuntime.mark(function t(n){var o;return regeneratorRuntime.wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return o=n.workspaces,n.useBuilderWorkspaces=[],v.next=4,o.reduce(function(){var f=vs(regeneratorRuntime.mark(function l(y,b){var x;return regeneratorRuntime.wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,y;case 2:return m.next=4,up.scriptUtils.getWorkspaceAccessibleBinaries(b);case 4:x=m.sent,x.has("builder")&&n.useBuilderWorkspaces.push(b);case 6:case"end":return m.stop()}},l)}));return function(l,y){return f.apply(this,arguments)}}(),Promise.resolve());case 4:case"end":return v.stop()}},t)}));function e(t){return r.apply(this,arguments)}return e}()},cp={title:"Building yarn plugins in workspaces",enabled:function(e){var t=e.useBuilderWorkspaces;return(t==null?void 0:t.length)!==0},task:function(e,t){var n=e.useBuilderWorkspaces,o=e.runWithWorkspaces;return o(n,["builder","build","plugin"],{stdout:t.stdout()})}},fp=function(e){return e.add({title:"Run builder plugin",task:function(n,o){return o.newListr([lp,cp])}})};jr.default=fp;ps.exports=jr.default});var hp=i((Ir,hs)=>{"use strict";Je();Object.defineProperty(Ir,"__esModule",{value:!0});Ir.default=void 0;var vp=pp(ds());function pp(r){return r&&r.__esModule?r:{default:r}}var dp={hooks:{build:vp.default}};Ir.default=dp;hs.exports=Ir.default});return hp();})();
return plugin;
}
};