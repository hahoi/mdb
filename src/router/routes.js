
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },      
      { path: '/PageLoadData', component: () => import('pages/PageLoadData.vue') },      
      { path: '/PageFieldRecord', component: () => import('pages/PageFieldRecord.vue') },      
      { path: '/PageMocks', component: () => import('pages/PageMocks.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
