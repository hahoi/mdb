<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated class="primary text-white">
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
          <!-- 新增按鈕 -->
          <q-btn
            fab
            icon="add"
            color="info"
            @click="dialogAdd = true"
            size="lg"
          />
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

      <q-footer elevated class="bg-white">
        <q-toolbar>
          <q-toolbar-title>
            <div class="row justify-around">
              <div v-if="FindRecordLength > 0" class="text-h6 text-black">
                {{ FindRecordLength }}
                <span class="text-subtitle1 text-blue-grey-10">筆資料</span>
              </div>
            </div>
          </q-toolbar-title>

        </q-toolbar>
          
      </q-footer>
    </q-layout>

    <!-- 新增資料視窗============================== -->
    <q-dialog
      v-model="dialogAdd"
      :maximized="true"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-grey-1 text-white">
        <q-bar>
          <q-btn flat icon="close" v-close-popup class="bg-black text-white"
            >離開
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
          <q-space />
        </q-bar>

        <q-card-section>
          <!-- 新增資料元件 -->
          <data-bank-add />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

const linksData = [
  {
    title: "第一版",
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
    title: "第二版",
    // caption: 'quasar.dev',
    icon: "school",
    link: "/PageHome20201010",
  },
  {
    title: "第三版",
    // caption: 'quasar.dev',
    icon: "school",
    link: "/PageHome20201011",
  },
  {
    title: "第四版",
    // caption: 'quasar.dev',
    icon: "school",
    link: "/PageLoadData20201012",
  },
];

export default {
  name: "MainLayout",
  components: {
    EssentialLink,
    DataBankAdd: require("components/DataBankAdd.vue").default,
  },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
      dialogAdd: false,
    };
  },
  computed: {
    // ...mapState("fieldrecord", ["FieldReord", "tasksDownloaded"]),
    // ...mapGetters("fieldrecord", ["FindRecordLength"]),
    ...mapState("LoadData", ["FieldReord", "tasksDownloaded"]),
    ...mapGetters("LoadData", ["FindRecordLength"]),
  },
  methods: {
    home() {
      location.reload();
    },
  },
};
</script>
