
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Index.vue'),
        component: () => import('pages/Index.vue'),
        meta: {
          keepAlive: true
        }
      },

      // { path: '/PageLoadData', component: () => import('pages/PageLoadData.vue') },
      // { path: '/PageAddRecord', component: () => import('pages/PageAddRecord.vue') },
      // { path: '/PageImport', component: () => import('pages/PageImport.vue') },
      // { path: '/PageMocks', component: () => import('pages/PageMocks.vue') },
      // { path: '/PageSearch', component: () => import('pages/PageSearch.vue') },
      // {
      //   path: '/PageHome20201010',
      //   component: () => import('pages/PageHome20201010.vue'),
      //   meta: {
      //     keepAlive: true
      //   }
      // },
      // { path: '/PageAddContact', component: () => import('pages/PageAddContact.vue') },
      // { path: '/PageHome20201011', component: () => import('pages/PageHome20201011.vue') },
      // { path: '/PageLoadData20201012', component: () => import('pages/PageLoadData20201012.vue') },
      { path: '/PageLoadData20201013', component: () => import('pages/PageLoadData20201013.vue') },

      

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export const powerRouter = [
]

export default routes
