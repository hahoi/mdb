<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-green-10 text-white">
      <q-toolbar>
        <!--   <q-btn
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
        <q-item-label header class="text-grey-8"> 功能選單 </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />
    </q-page-container>

    <q-footer elevated class="bg-green-5 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="row justify-around">
            <q-btn
              round
              color="deep-orange"
              glossy
              text-color="black"
              icon="home"
              @click="home"
            >
              <!-- <q-tooltip></q-tooltip> -->
            </q-btn>

            
              <div v-if="FindRecordLength > 0" class="text-h6">
                {{ FindRecordLength }}
                <span class="text-subtitle1 text-blue-grey-10">筆資料</span>
              </div>
            

            <q-btn
              round
              color="amber"
              glossy
              text-color="black"
              icon="add"
              to="PageAddContact"
            >
              <q-tooltip>新增資料</q-tooltip>
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
import EssentialLink from "components/EssentialLink.vue";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

const linksData = [
  {
    title: "查詢修改刪除",
    // caption: 'quasar.dev',
    icon: "school",
    link: "/PageLoadData",
  },
  {
    title: "新增",
    // caption: 'quasar.dev',
    icon: "school",
    link: "/PageAddRecord",
  },
  {
    title: "匯入",
    // caption: 'quasar.dev',
    icon: "school",
    link: "/PageImport",
  },
  {
    title: "模糊搜尋",
    // caption: 'quasar.dev',
    icon: "school",
    link: "/PageSearch",
  },
  {
    title: "首頁",
    // caption: 'quasar.dev',
    icon: "school",
    link: "/PageHome",
  },
];

export default {
  name: "MainLayout",
  components: { EssentialLink },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
    };
  },
  computed: {
    // ...mapState("fieldrecord", ["FieldReord", "tasksDownloaded"]),
    // ...mapGetters("fieldrecord", ["FindRecordLength"]),
    ...mapState("search", ["FieldReord", "tasksDownloaded"]),
    ...mapGetters("search", ["FindRecordLength"]),
  },
  methods: {
    home() {
      location.reload();
    },
  },
};
</script>
