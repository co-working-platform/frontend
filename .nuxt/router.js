import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _65e50c35 = () => interopDefault(import('../pages/admin.vue' /* webpackChunkName: "pages/admin" */))
const _5f7a429b = () => interopDefault(import('../pages/change_contact.vue' /* webpackChunkName: "pages/change_contact" */))
const _57575896 = () => interopDefault(import('../pages/change_gender.vue' /* webpackChunkName: "pages/change_gender" */))
const _680fa830 = () => interopDefault(import('../pages/change_password.vue' /* webpackChunkName: "pages/change_password" */))
const _4de2a06d = () => interopDefault(import('../pages/change_photo.vue' /* webpackChunkName: "pages/change_photo" */))
const _fb503e2a = () => interopDefault(import('../pages/change_username.vue' /* webpackChunkName: "pages/change_username" */))
const _d07f532a = () => interopDefault(import('../pages/employees.vue' /* webpackChunkName: "pages/employees" */))
const _172def5d = () => interopDefault(import('../pages/files.vue' /* webpackChunkName: "pages/files" */))
const _577c23f6 = () => interopDefault(import('../pages/keepLoggedIn.vue' /* webpackChunkName: "pages/keepLoggedIn" */))
const _03c54962 = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _488712e7 = () => interopDefault(import('../pages/planning.vue' /* webpackChunkName: "pages/planning" */))
const _0837bd24 = () => interopDefault(import('../pages/products.vue' /* webpackChunkName: "pages/products" */))
const _313ecbe2 = () => interopDefault(import('../pages/profile.vue' /* webpackChunkName: "pages/profile" */))
const _5895c72d = () => interopDefault(import('../pages/register.vue' /* webpackChunkName: "pages/register" */))
const _df998d56 = () => interopDefault(import('../pages/user.vue' /* webpackChunkName: "pages/user" */))
const _2febcc98 = () => interopDefault(import('../pages/basefolder/_id.vue' /* webpackChunkName: "pages/basefolder/_id" */))
const _737f3d5f = () => interopDefault(import('../pages/createRecipe/_id.vue' /* webpackChunkName: "pages/createRecipe/_id" */))
const _051ff5f1 = () => interopDefault(import('../pages/employeeFolder/_id.vue' /* webpackChunkName: "pages/employeeFolder/_id" */))
const _e930c4ba = () => interopDefault(import('../pages/folder/_id.vue' /* webpackChunkName: "pages/folder/_id" */))
const _6b95b6c3 = () => interopDefault(import('../pages/recipe/_id.vue' /* webpackChunkName: "pages/recipe/_id" */))
const _5bdbaf5c = () => interopDefault(import('../pages/uploadFile/_id.vue' /* webpackChunkName: "pages/uploadFile/_id" */))
const _d07573c0 = () => interopDefault(import('../pages/uploadFileEmployee/_id.vue' /* webpackChunkName: "pages/uploadFileEmployee/_id" */))
const _3475b838 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _65e50c35,
    name: "admin"
  }, {
    path: "/change_contact",
    component: _5f7a429b,
    name: "change_contact"
  }, {
    path: "/change_gender",
    component: _57575896,
    name: "change_gender"
  }, {
    path: "/change_password",
    component: _680fa830,
    name: "change_password"
  }, {
    path: "/change_photo",
    component: _4de2a06d,
    name: "change_photo"
  }, {
    path: "/change_username",
    component: _fb503e2a,
    name: "change_username"
  }, {
    path: "/employees",
    component: _d07f532a,
    name: "employees"
  }, {
    path: "/files",
    component: _172def5d,
    name: "files"
  }, {
    path: "/keepLoggedIn",
    component: _577c23f6,
    name: "keepLoggedIn"
  }, {
    path: "/login",
    component: _03c54962,
    name: "login"
  }, {
    path: "/planning",
    component: _488712e7,
    name: "planning"
  }, {
    path: "/products",
    component: _0837bd24,
    name: "products"
  }, {
    path: "/profile",
    component: _313ecbe2,
    name: "profile"
  }, {
    path: "/register",
    component: _5895c72d,
    name: "register"
  }, {
    path: "/user",
    component: _df998d56,
    name: "user"
  }, {
    path: "/basefolder/:id?",
    component: _2febcc98,
    name: "basefolder-id"
  }, {
    path: "/createRecipe/:id?",
    component: _737f3d5f,
    name: "createRecipe-id"
  }, {
    path: "/employeeFolder/:id?",
    component: _051ff5f1,
    name: "employeeFolder-id"
  }, {
    path: "/folder/:id?",
    component: _e930c4ba,
    name: "folder-id"
  }, {
    path: "/recipe/:id?",
    component: _6b95b6c3,
    name: "recipe-id"
  }, {
    path: "/uploadFile/:id?",
    component: _5bdbaf5c,
    name: "uploadFile-id"
  }, {
    path: "/uploadFileEmployee/:id?",
    component: _d07573c0,
    name: "uploadFileEmployee-id"
  }, {
    path: "/",
    component: _3475b838,
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
