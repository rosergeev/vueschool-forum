import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import FontAwesome from '@/plugins/FontAwesome'
import { firebaseApp } from '@/config/firebaseHelpers'
import ClickOutsideDirective from '@/plugins/ClickOutsideDirective'
import PageScrollDirective from '@/plugins/PageScrollDirective'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase

import App from '@/App.vue'
import router from '@/router'
import AppDate from '@/components/AppDate.vue'

const forumApp = createApp(App)

forumApp.use(createPinia())
forumApp.use(router)
forumApp.use(FontAwesome)
forumApp.use(ClickOutsideDirective)
forumApp.use(PageScrollDirective)

// const requireComponent = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/)
// requireComponent.keys().forEach(function (fileName) {
//   let baseComponentConfig = requireComponent(fileName)
//   baseComponentConfig = baseComponentConfig.default || baseComponentConfig
//   const baseComponentName =
//     baseComponentConfig.name || fileName.replace(/^.+\//, '').replace(/\.\w+$/, '')
//   forumApp.component(baseComponentName, baseComponentConfig)
// })

forumApp.component('AppDate', AppDate)
forumApp.provide('firebaseApp', firebaseApp)

forumApp.mount('#app')
