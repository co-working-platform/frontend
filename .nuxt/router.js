import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _a142be0e = () => interopDefault(import('../pages/admin.vue' /* webpackChunkName: "pages/admin" */))
const _2bc1ca57 = () => interopDefault(import('../pages/change_contact.vue' /* webpackChunkName: "pages/change_contact" */))
const _2c61e95a = () => interopDefault(import('../pages/change_gender.vue' /* webpackChunkName: "pages/change_gender" */))
const _24b917f4 = () => interopDefault(import('../pages/change_password.vue' /* webpackChunkName: "pages/change_password" */))
const _5ebe31ae = () => interopDefault(import('../pages/change_photo.vue' /* webpackChunkName: "pages/change_photo" */))
const _3f0150af = () => interopDefault(import('../pages/change_username.vue' /* webpackChunkName: "pages/change_username" */))
const _a5cc2da2 = () => interopDefault(import('../pages/employees.vue' /* webpackChunkName: "pages/employees" */))
const _60a78421 = () => interopDefault(import('../pages/files.vue' /* webpackChunkName: "pages/files" */))
const _4b8b2a9c = () => interopDefault(import('../pages/keepLoggedIn.vue' /* webpackChunkName: "pages/keepLoggedIn" */))
const _4796f013 = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _b7e3d0ba = () => interopDefault(import('../pages/planning.vue' /* webpackChunkName: "pages/planning" */))
const _576b262a = () => interopDefault(import('../pages/products.vue' /* webpackChunkName: "pages/products" */))
const _8e6fe45a = () => interopDefault(import('../pages/profile.vue' /* webpackChunkName: "pages/profile" */))
const _97c6682e = () => interopDefault(import('../pages/register.vue' /* webpackChunkName: "pages/register" */))
const _dadc07de = () => interopDefault(import('../pages/user.vue' /* webpackChunkName: "pages/user" */))
const _975cbd20 = () => interopDefault(import('../pages/basefolder/_id.vue' /* webpackChunkName: "pages/basefolder/_id" */))
const _4c03c61b = () => interopDefault(import('../pages/createRecipe/_id.vue' /* webpackChunkName: "pages/createRecipe/_id" */))
const _62b580a6 = () => interopDefault(import('../pages/employeeFolder/_id.vue' /* webpackChunkName: "pages/employeeFolder/_id" */))
const _2140635f = () => interopDefault(import('../pages/folder/_id.vue' /* webpackChunkName: "pages/folder/_id" */))
const _016e7c7f = () => interopDefault(import('../pages/recipe/_id.vue' /* webpackChunkName: "pages/recipe/_id" */))
const _c34c9fe4 = () => interopDefault(import('../pages/uploadFile/_id.vue' /* webpackChunkName: "pages/uploadFile/_id" */))
const _25d751dc = () => interopDefault(import('../pages/uploadFileEmployee/_id.vue' /* webpackChunkName: "pages/uploadFileEmployee/_id" */))
const _7def4cfc = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/admin",
    component: _a142be0e,
    name: "admin"
  }, {
    path: "/change_contact",
    component: _2bc1ca57,
    name: "change_contact"
  }, {
    path: "/change_gender",
    component: _2c61e95a,
    name: "change_gender"
  }, {
    path: "/change_password",
    component: _24b917f4,
    name: "change_password"
  }, {
    path: "/change_photo",
    component: _5ebe31ae,
    name: "change_photo"
  }, {
    path: "/change_username",
    component: _3f0150af,
    name: "change_username"
  }, {
    path: "/employees",
    component: _a5cc2da2,
    name: "employees"
  }, {
    path: "/files",
    component: _60a78421,
    name: "files"
  }, {
    path: "/keepLoggedIn",
    component: _4b8b2a9c,
    name: "keepLoggedIn"
  }, {
    path: "/login",
    component: _4796f013,
    name: "login"
  }, {
    path: "/planning",
    component: _b7e3d0ba,
    name: "planning"
  }, {
    path: "/products",
    component: _576b262a,
    name: "products"
  }, {
    path: "/profile",
    component: _8e6fe45a,
    name: "profile"
  }, {
    path: "/register",
    component: _97c6682e,
    name: "register"
  }, {
    path: "/user",
    component: _dadc07de,
    name: "user"
  }, {
    path: "/basefolder/:id?",
    component: _975cbd20,
    name: "basefolder-id"
  }, {
    path: "/createRecipe/:id?",
    component: _4c03c61b,
    name: "createRecipe-id"
  }, {
    path: "/employeeFolder/:id?",
    component: _62b580a6,
    name: "employeeFolder-id"
  }, {
    path: "/folder/:id?",
    component: _2140635f,
    name: "folder-id"
  }, {
    path: "/recipe/:id?",
    component: _016e7c7f,
    name: "recipe-id"
  }, {
    path: "/uploadFile/:id?",
    component: _c34c9fe4,
    name: "uploadFile-id"
  }, {
    path: "/uploadFileEmployee/:id?",
    component: _25d751dc,
    name: "uploadFileEmployee-id"
  }, {
    path: "/",
    component: _7def4cfc,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
