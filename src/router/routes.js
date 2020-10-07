
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageHome.vue') },      
        
      { path: '/PageLoadData', component: () => import('pages/PageLoadData.vue') },      
      { path: '/PageAddRecord', component: () => import('pages/PageAddRecord.vue') },      
      { path: '/PageImport', component: () => import('pages/PageImport.vue') },  
      { path: '/PageMocks', component: () => import('pages/PageMocks.vue') },  
      { path: '/PageSearch', component: () => import('pages/PageSearch.vue') },       
      { path: '/PageHome', component: () => import('pages/PageHome.vue') },
    
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
