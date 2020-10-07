<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-green-10 text-white">
      <q-toolbar>
        <!-- <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        /> -->

        <q-toolbar-title class="text-center text-weight text-h5">  
          行動資料庫
        </q-toolbar-title>

        
      </q-toolbar>
    </q-header>

    <!-- <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          功能選單
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->

    <q-page-container>

      <router-view />
    
    </q-page-container>

    <q-footer elevated class="bg-green-5 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="row justify-around">
            <q-btn round color="amber" glossy text-color="black" icon="add" >
            <q-tooltip>新增資料</q-tooltip>
            </q-btn>

            <div v-if="FindRecordLength > 0" class="text-h6">{{FindRecordLength}}筆資料</div>
            <q-btn  round color="deep-orange" glossy text-color="black" icon="account_circle">
              <q-tooltip>通訊錄維護<br/>請洽分機<br/>6338</q-tooltip>
            </q-btn>
            <!-- <q-btn
              round
              color="secondary"
              glossy
              text-color="black"
              icon="account_circle"
              to="users"
            ></q-btn> -->
            
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

const linksData = [
  {
    title: '查詢修改刪除',
    // caption: 'quasar.dev',
    icon: 'school',
    link: '/PageLoadData'
  },
  {
    title: '新增',
    // caption: 'quasar.dev',
    icon: 'school',
    link: '/PageAddRecord'
  },
  {
    title: '匯入',
    // caption: 'quasar.dev',
    icon: 'school',
    link: '/PageImport'
  },
  {
    title: '模糊搜尋',
    // caption: 'quasar.dev',
    icon: 'school',
    link: '/PageSearch'
  },
  {
    title: '首頁',
    // caption: 'quasar.dev',
    icon: 'school',
    link: '/PageHome'
  },
  // {
  //   title: '模擬資料',
  //   // caption: 'quasar.dev',
  //   icon: 'code',
  //   link: '/PageMocks'
  // },
  // {
  //   title: 'Github',
  //   caption: 'github.com/quasarframework',
  //   icon: 'code',
  //   link: 'https://github.com/quasarframework'
  // },
  // {
  //   title: 'Discord Chat Channel',
  //   caption: 'chat.quasar.dev',
  //   icon: 'chat',
  //   link: 'https://chat.quasar.dev'
  // },
  // {
  //   title: 'Forum',
  //   caption: 'forum.quasar.dev',
  //   icon: 'record_voice_over',
  //   link: 'https://forum.quasar.dev'
  // },
  // {
  //   title: 'Twitter',
  //   caption: '@quasarframework',
  //   icon: 'rss_feed',
  //   link: 'https://twitter.quasar.dev'
  // },
  // {
  //   title: 'Facebook',
  //   caption: '@QuasarFramework',
  //   icon: 'public',
  //   link: 'https://facebook.quasar.dev'
  // },
  // {
  //   title: 'Quasar Awesome',
  //   caption: 'Community Quasar projects',
  //   icon: 'favorite',
  //   link: 'https://awesome.quasar.dev'
  // }
];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  computed: {
    ...mapState("fieldrecord", ["FieldReord", "tasksDownloaded"]),
    ...mapGetters("fieldrecord", ["FindRecordLength"]),
    ...mapGetters("search", ["FindRecordLength"]),
  }

}
</script>
