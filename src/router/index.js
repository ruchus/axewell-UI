import { createRouter, createWebHashHistory } from 'vue-router'
import IndexPage from '../pages/IndexPage.vue'
import MainLayout from '../layouts/MainLayout.vue'
import SettingsPage from '../pages/SettingsPage.vue'
import NetworkPage from '../pages/NetworkPage.vue'
import SwarmPage from '../pages/SwarmPage.vue'
import { i18n } from '../plugins/i18n'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', name: 'Dashboard', component: IndexPage },
        { path: 'settings', name: 'Settings', component: SettingsPage },
        { path: 'network', name: 'Network', component: NetworkPage },
        { path: 'swarm', name: 'Swarm', component: SwarmPage }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  let lang = to.query.lang

  if (!lang) {
    lang = i18n.global.locale.value
    if (to.query.lang !== lang) {
      const queryParams = { ...to.query, lang }
      return next({ path: to.path, query: queryParams })
    }
  }

  if (lang !== i18n.global.locale.value) {
    i18n.global.locale.value = lang
  }

  next()
})

export default router
