(window.webpackJsonp=window.webpackJsonp||[]).push([[43],{459:function(e,t,r){"use strict";r(23);t.a={required:function(e){return function(t){return t&&t.length>0||"You must input a ".concat(e)}},minLength:function(e,t){return function(r){return r&&r.length>=t||"".concat(e," must be at least ").concat(t," characters")}},maxLength:function(e,t){return function(r){return r&&r.length<=t||"".concat(e," must be less than ").concat(t," characters")}},emailFormat:function(){var e=/^\w+([/.-]?\w+)*@\w+([/.-]?\w+)*(\.\w{2,24})+$/;return function(t){return t&&e.test(t)||"Must be a valid email"}},numberFormat:function(){var e=/^[/+]?[(]?[0-9]{3}[)]?[-\s/.]?[0-9]{3}[-\s/.]?[0-9]{4,6}$/im;return function(t){return t&&e.test(t)||"Must be a valid phone number"}}}},533:function(e,t,r){"use strict";r.r(t);r(9),r(6),r(8),r(11),r(7),r(12);var n=r(2),o=r(79),c=r.n(o),l=r(459);function f(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}var d={name:"UserChanges",data:function(){return function(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}({gender:"",genders:["Female","Male","Prefer not to say"],valid:!0,checkbox:!1},l.a)},methods:{changeGender:function(){var e=this;this.formData=new FormData,this.formData.append("gender",this.gender),c()({url:"http://212.227.210.204:8765/user/update_gender",method:"PUT",headers:{"Content-Type":"multipart/form-data",Authorization:this.$auth.getToken("local")},data:this.formData}).then((function(t){e.$router.push("/user")})).catch((function(e){console.log("in catch"),window.alert("An error occurred. Please try again!");var t=e.response;console.log(JSON.stringify(t.data.errors))})),this.resetForm()},resetForm:function(){this.$refs.form.reset()}}},h=r(78),m=r(96),v=r.n(m),w=r(231),O=r(455),y=r(474),k=r(460),_=r(57),j=r(451),$=r(64),x=r(208),component=Object(h.a)(d,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-card",[r("v-toolbar",{attrs:{color:"transparent",dark:""}},[r("v-toolbar-title",[e._v(e._s(e.$t("changeYourCurrentGender")))]),e._v(" "),r("v-spacer")],1),e._v(" "),r("v-form",{ref:"form",model:{value:e.valid,callback:function(t){e.valid=t},expression:"valid"}},[r("v-select",{ref:"gender",attrs:{items:e.genders,rules:[function(t){return!!t||e.$t("itemIsRequired")}],label:e.$t("gender"),required:""},model:{value:e.gender,callback:function(t){e.gender=t},expression:"gender"}}),e._v(" "),r("v-checkbox",{attrs:{rules:[function(t){return!!t||e.$t("youMustAgreeToContinue")}],label:e.$t("isInformationCorrect"),required:""},model:{value:e.checkbox,callback:function(t){e.checkbox=t},expression:"checkbox"}}),e._v(" "),r("v-btn",{attrs:{color:"success",disabled:!e.valid},on:{click:function(t){return e.changeGender()}}},[e._v("\n      "+e._s(e.$t("submit"))+"\n    ")]),e._v(" "),r("v-btn",{attrs:{color:"error"},on:{click:function(t){return e.resetForm()}}},[e._v("\n      "+e._s(e.$t("resetForm"))+"\n    ")])],1)],1)}),[],!1,null,"3362042c",null);t.default=component.exports;v()(component,{VBtn:w.a,VCard:O.a,VCheckbox:y.a,VForm:k.a,VSelect:_.a,VSpacer:j.a,VToolbar:$.a,VToolbarTitle:x.a})},616:function(e,t,r){"use strict";r.r(t);var n={mounted:function(){!1===this.$auth.loggedIn&&(window.location="/login")}},o=r(78),c=r(96),l=r.n(c),f=r(468),d=r(467),component=Object(o.a)(n,(function(){var e=this.$createElement,t=this._self._c||e;return t("v-row",{attrs:{justify:"center"}},[t("v-col",{attrs:{cols:"12"}},[t("UserGenderUpdate")],1)],1)}),[],!1,null,null,null);t.default=component.exports;l()(component,{UserGenderUpdate:r(533).default}),l()(component,{VCol:f.a,VRow:d.a})}}]);