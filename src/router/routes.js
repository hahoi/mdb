
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
        // path: '', 
        // component: () => import('pages/PageMDBHomeAdv.vue'),
        // // meta: { title: '行動資料庫', role: 'MDBAdv', icon: 'view_list', divider: true }

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
        path: '/ExcelImport',
        component: () => import('pages/PageExcelImport'),
        meta: { title: 'Excel匯入', role: 'import', icon: 'group', divider: true }
      },
      {
        path: '/users',
        component: () => import('pages/PageUsers'),
        meta: { title: '使用者管理', role: 'users', icon: 'group', divider: true }
      },
      // {
      //   path: '/loglist',
      //   component: () => import('pages/PageLogList'),
      //   meta: { title: 'log紀錄', role: 'LogList', icon: 'group', divider: true }
      // },
      // {
      //   path: '/help',
      //   component: () => import('pages/PageHelp'),
      //   meta: { title: '使用說明', role: 'Help', icon: 'help', divider: true }
      // },       
      // {
      //   path: '/DbPaginate',
      //   component: () => import('pages/PageDbPaginate'),
      //   meta: { title: '資料庫分頁', role: 'DbPaginate', icon: 'help', divider: true }
      // },      
      // {
      //   path: '/LikeSearch',
      //   component: () => import('pages/PageLikeSearch'),
      //   meta: { title: 'like查詢', role: 'LikeSearch', icon: 'group', divider: true }
      // },     
      // {
      //   path: '/MDBAdv',
      //   component: () => import('pages/PageMDBHomeAdv'),
      //   meta: { title: '行動資料庫(改進)', role: 'MDBAdv', icon: 'group', divider: true }
      // },                       
      // {
      //   path: '/settings',
      //   component: () => import('pages/PageSettings'),
      //   meta: { title: '系統設定', role: 'settings', icon: 'api', divider: true }
      // },      
      // {
      //   path: '/import',
      //   component: () => import('pages/PageImport'),
      //   meta: { title: '匯入', role: 'users', icon: 'group', divider: true }
      // },     
      // // 暫時性的功能，注意role的設定，設成users暫時取代使用者管理功能             
      // {
      //   path: '/BackupRestory',
      //   component: () => import('pages/PageBackupRestory'),
      //   meta: { title: '備份還原', role: 'users', icon: 'backup_table', divider: true }
      // },
      // {
      //   path: '/OCR',
      //   component: () => import('pages/PageOCR'),
      //   meta: { title: '本文檢測', role: 'users', icon: 'group', divider: true }
      // },
    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]
