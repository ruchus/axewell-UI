const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/IndexPage.vue') },
      { path: 'swarm', name: 'swarm', component: () => import('pages/SwarmPage.vue') },
      { path: 'pool', name: 'pool', component: () => import('pages/PoolPage.vue') },
      { path: 'settings', name: 'settings', component: () => import('pages/SettingsPage.vue') },
      { path: 'network', name: 'network', component: () => import('pages/NetworkPage.vue') },
      { path: 'system', name: 'system', component: () => import('pages/SystemPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
