(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{467:function(e,t,r){"use strict";r(6),r(8),r(11),r(12);var n=r(2),o=(r(29),r(37),r(23),r(9),r(30),r(65),r(209),r(20),r(38),r(210),r(211),r(212),r(213),r(214),r(215),r(216),r(217),r(218),r(219),r(220),r(221),r(222),r(41),r(7),r(297),r(1)),c=r(43),l=r(0);function f(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function d(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var v=["sm","md","lg","xl"],h=["start","end","center"];function m(e,t){return v.reduce((function(r,n){return r[e+Object(l.H)(n)]=t(),r}),{})}var y=function(e){return[].concat(h,["baseline","stretch"]).includes(e)},O=m("align",(function(){return{type:String,default:null,validator:y}})),j=function(e){return[].concat(h,["space-between","space-around"]).includes(e)},w=m("justify",(function(){return{type:String,default:null,validator:j}})),C=function(e){return[].concat(h,["space-between","space-around","stretch"]).includes(e)},_=m("alignContent",(function(){return{type:String,default:null,validator:C}})),k={align:Object.keys(O),justify:Object.keys(w),alignContent:Object.keys(_)},S={align:"align",justify:"justify",alignContent:"align-content"};function x(e,t,r){var n=S[e];if(null!=r){if(t){var o=t.replace(e,"");n+="-".concat(o)}return(n+="-".concat(r)).toLowerCase()}}var P=new Map;t.a=o.a.extend({name:"v-row",functional:!0,props:d(d(d({tag:{type:String,default:"div"},dense:Boolean,noGutters:Boolean,align:{type:String,default:null,validator:y}},O),{},{justify:{type:String,default:null,validator:j}},w),{},{alignContent:{type:String,default:null,validator:C}},_),render:function(e,t){var r=t.props,data=t.data,o=t.children,l="";for(var f in r)l+=String(r[f]);var d=P.get(l);return d||function(){var e,t;for(t in d=[],k)k[t].forEach((function(e){var n=r[e],o=x(t,e,n);o&&d.push(o)}));d.push((e={"no-gutters":r.noGutters,"row--dense":r.dense},Object(n.a)(e,"align-".concat(r.align),r.align),Object(n.a)(e,"justify-".concat(r.justify),r.justify),Object(n.a)(e,"align-content-".concat(r.alignContent),r.alignContent),e)),P.set(l,d)}(),e(r.tag,Object(c.a)(data,{staticClass:"row",class:d}),o)}})},468:function(e,t,r){"use strict";r(6),r(8),r(11),r(12);var n=r(2),o=(r(22),r(9),r(30),r(65),r(209),r(20),r(38),r(210),r(211),r(212),r(213),r(214),r(215),r(216),r(217),r(218),r(219),r(220),r(221),r(222),r(41),r(29),r(7),r(73),r(297),r(1)),c=r(43),l=r(0);function f(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function d(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var v=["sm","md","lg","xl"],h=v.reduce((function(e,t){return e[t]={type:[Boolean,String,Number],default:!1},e}),{}),m=v.reduce((function(e,t){return e["offset"+Object(l.H)(t)]={type:[String,Number],default:null},e}),{}),y=v.reduce((function(e,t){return e["order"+Object(l.H)(t)]={type:[String,Number],default:null},e}),{}),O={col:Object.keys(h),offset:Object.keys(m),order:Object.keys(y)};function j(e,t,r){var n=e;if(null!=r&&!1!==r){if(t){var o=t.replace(e,"");n+="-".concat(o)}return"col"!==e||""!==r&&!0!==r?(n+="-".concat(r)).toLowerCase():n.toLowerCase()}}var w=new Map;t.a=o.a.extend({name:"v-col",functional:!0,props:d(d(d(d({cols:{type:[Boolean,String,Number],default:!1}},h),{},{offset:{type:[String,Number],default:null}},m),{},{order:{type:[String,Number],default:null}},y),{},{alignSelf:{type:String,default:null,validator:function(e){return["auto","start","end","center","baseline","stretch"].includes(e)}},tag:{type:String,default:"div"}}),render:function(e,t){var r=t.props,data=t.data,o=t.children,l=(t.parent,"");for(var f in r)l+=String(r[f]);var d=w.get(l);return d||function(){var e,t;for(t in d=[],O)O[t].forEach((function(e){var n=r[e],o=j(t,e,n);o&&d.push(o)}));var o=d.some((function(e){return e.startsWith("col-")}));d.push((e={col:!o||!r.cols},Object(n.a)(e,"col-".concat(r.cols),r.cols),Object(n.a)(e,"offset-".concat(r.offset),r.offset),Object(n.a)(e,"order-".concat(r.order),r.order),Object(n.a)(e,"align-self-".concat(r.alignSelf),r.alignSelf),e)),w.set(l,d)}(),e(r.tag,Object(c.a)(data,{class:d}),o)}})},488:function(e,t,r){var content=r(514);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(17).default)("98768b2a",content,!0,{sourceMap:!1})},513:function(e,t,r){"use strict";r(488)},514:function(e,t,r){var n=r(16)(!1);n.push([e.i,".title[data-v-091c19d6]{color:#fafafa}.myClass[data-v-091c19d6]{background:#1e1e1e;color:snow}.text[data-v-091c19d6]{font-size:large}",""]),e.exports=n},542:function(e,t,r){"use strict";r.r(t);r(24);var n=r(79),o=r.n(n),c={data:function(){return{formData:null,selectDepartment:"",departments:[],folders:[],allDepartments:[],user:null,fileModel:"",dialogSuccess:!1,selectFolder:"",employeeCheckbox:!1,managment:!1}},watch:{dialogSuccess:function(e){e||this.close()}},mounted:function(){this.checkRole()},methods:{checkRole:function(){var e=this;o.a.get("http://212.227.210.204:8765/user",{headers:{Authorization:this.$auth.getToken("local")}}).then((function(t){var r=t.data;"ADMIN"!==r.role.name&&"CEO"!==r.role.name&&"DEPARTMENT"!==r.role.name||(e.managment=!0)})).catch((function(e){window.alert("An error occurred. Please try again!");var t=e.response;console.log(JSON.stringify(t.data.errors))}))},close:function(e){this.dialogSuccess=!1},handleFileUpload:function(){this.formData=new FormData,this.formData.append("file",this.fileModel),this.formData.append("folder_id",this.$route.params.id),this.formData.append("confidential",!1),this.formData.append("available",this.employeeCheckbox)},submitFile:function(e){var t=this,r="";"CEO"!==this.$auth.user.role.name&&"ADMIN"!==this.$auth.user.role.name&&"DEPARTMENT"!==this.$auth.user.role.name||(r="http://212.227.210.204:8765/upload_file/"+this.$route.params.id),"EMPLOYEE"===this.$auth.user.role.name&&(r="http://212.227.210.204:8765/employee/upload_file/"+this.$route.params.id),o()({url:r,method:"POST",data:this.formData,headers:{Authorization:this.$auth.getToken("local"),"Content-Type":"multipart/form-data"}}).then((function(e){t.dialogSuccess=!0,t.$refs.form.reset(),t.$refs.file.reset(),t.employeeCheckbox=!1})).catch((function(e){window.alert("An error occurred. Please try again!");var t=e.response;console.log(JSON.stringify(t.data.errors))}))}}},l=(r(513),r(78)),f=r(96),d=r.n(f),v=r(231),h=r(455),m=r(454),y=r(468),O=r(453),j=r(475),w=r(607),C=r(460),_=r(467),k=r(451),S=r(64),component=Object(l.a)(c,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-container",{staticClass:"mx-auto"},[r("v-form",{ref:"form"},[r("v-toolbar",{attrs:{color:"transparent",dark:""}},[r("v-container",[r("v-row",[r("v-col",{attrs:{"align-self":"center"}},[r("label",{staticClass:"title"},[e._v(e._s(e.$t("uploadAFile")))])]),e._v(" "),r("v-col",{staticClass:"text-right",attrs:{"align-self":"center"}},[r("v-btn",{staticClass:"myClass"},[r("router-link",{staticClass:"router",attrs:{to:"/user"}},[e._v("\n                "+e._s(e.$t("userPage"))+"\n              ")])],1)],1)],1)],1)],1),e._v(" "),r("hr"),e._v(" "),r("hr"),e._v(" "),r("hr"),e._v(" "),r("v-row",[e.managment?r("v-container",[r("input",{directives:[{name:"model",rawName:"v-model",value:e.employeeCheckbox,expression:"employeeCheckbox"}],attrs:{id:"employeeCheckbox",type:"checkbox"},domProps:{checked:Array.isArray(e.employeeCheckbox)?e._i(e.employeeCheckbox,null)>-1:e.employeeCheckbox},on:{change:function(t){var r=e.employeeCheckbox,n=t.target,o=!!n.checked;if(Array.isArray(r)){var c=e._i(r,null);n.checked?c<0&&(e.employeeCheckbox=r.concat([null])):c>-1&&(e.employeeCheckbox=r.slice(0,c).concat(r.slice(c+1)))}else e.employeeCheckbox=o}}}),e._v(" "),r("label",{staticClass:"text"},[e._v(e._s(e.$t("availableForEmployee")))])]):e._e()],1),e._v(" "),r("hr"),e._v(" "),r("v-file-input",{ref:"file",attrs:{color:"deep-purple accent-4",counter:"",label:e.$t("fileInput"),placeholder:"Select your files","prepend-icon":"mdi-paperclip","show-size":1e3},on:{change:function(t){return e.handleFileUpload()}},model:{value:e.fileModel,callback:function(t){e.fileModel=t},expression:"fileModel"}}),e._v(" "),r("hr"),e._v(" "),r("v-btn",{staticClass:"myClass",on:{click:e.submitFile}},[e._v("\n      "+e._s(e.$t("submit"))+"\n    ")]),e._v(" "),r("v-col"),e._v(" "),r("v-row"),e._v(" "),r("v-card"),e._v(" "),r("hr")],1),e._v(" "),r("v-dialog",{attrs:{"max-width":"500px"},model:{value:e.dialogSuccess,callback:function(t){e.dialogSuccess=t},expression:"dialogSuccess"}},[r("v-card",[r("v-card-title",{staticClass:"headline"},[e._v("\n        "+e._s(e.$t("theFileWasUploaded"))+"\n      ")]),e._v(" "),r("v-card-actions",[r("v-spacer"),e._v(" "),r("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:e.close}},[e._v("\n          "+e._s(e.$t("close"))+"\n        ")]),e._v(" "),r("v-spacer")],1)],1)],1)],1)}),[],!1,null,"091c19d6",null);t.default=component.exports;d()(component,{VBtn:v.a,VCard:h.a,VCardActions:m.a,VCardTitle:m.c,VCol:y.a,VContainer:O.a,VDialog:j.a,VFileInput:w.a,VForm:C.a,VRow:_.a,VSpacer:k.a,VToolbar:S.a})}}]);