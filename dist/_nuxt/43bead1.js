(window.webpackJsonp=window.webpackJsonp||[]).push([[57],{626:function(e,t,n){"use strict";n.r(t);n(9),n(6),n(8),n(11),n(7),n(12);var r=n(2),o=n(130);function c(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}var l={computed:function(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?c(Object(source),!0).forEach((function(t){Object(r.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):c(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}({},Object(o.b)(["loggedInUser"])),mounted:function(){!1===this.$auth.loggedIn&&(window.location="/login")}},O=n(78),component=Object(O.a)(l,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",{staticClass:"section"},[n("div",{staticClass:"container"},[n("h2",{staticClass:"title"},[e._v("\n      My Profile\n    ")]),e._v(" "),n("div",{staticClass:"content"},[n("p",[n("strong",[e._v("Username:")]),e._v("\n        "+e._s(e.loggedInUser.username)+"\n      ")]),e._v(" "),n("p",[n("strong",[e._v("Email:")]),e._v("\n        "+e._s(e.loggedInUser.email)+"\n      ")])])])])}),[],!1,null,null,null);t.default=component.exports}}]);