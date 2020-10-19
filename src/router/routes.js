
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: '/auth',
        component: () => import('pages/PageEmailAuth.vue'),
      },
    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

export const powerRouter = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/index', component: () => import('pages/Index.vue'),
        meta: { title: '首頁', role: 'Index', icon: 'home', divider: true }

      },
      {
        path: '/MDB',
        component: () => import('pages/PageMDBHome.vue'),
        meta: { title: '行動資料庫', role: 'MDB', icon: 'view_list', divider: true }
      },      

      {
        path: '/auth',
        component: () => import('pages/PageEmailAuth.vue'),
        meta: { title: 'auth', role: 'auth', icon: 'home', divider: true }
      },      
      {
        path: '/users',
        component: () => import('pages/PageUsers'),
        meta: { title: '使用者管理', role: 'users', icon: 'group', divider: true }
      },     
      {
        path: '/settings',
        component: () => import('pages/PageSettings'),
        meta: { title: '系統設定', role: 'settings', icon: 'api', divider: true }
      },                 
      // {
      //   path: '/backup',
      //   component: () => import('pages/PageBackup'),
      //   meta: { title: '備份', role: 'PageBackup', icon: 'backup_table', divider: true }
      // },

    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]
