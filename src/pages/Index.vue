<template>
  <q-page class="flex flex-center column">
    <div v-if="this.settings.announcement.length == 0">
      <div class="" @click="go">
        <img alt="行動資料庫" src="~assets/MDB.png" />
      </div>
      <div
        class="text-h5 text-weight text-center"
        style="font-family: 'Dancing Script', cursive"
      >
        Mobile Data Bank<br />
        <span class="text-caption">V 1.6 </span>
      </div>
    </div>
    <div v-else>
      <q-card style="" class="q-ma-md">
        <q-card-section
          class="fit flex row items-start text-h6"
          v-html="this.settings.announcement"
        >
          {{ this.settings.announcement }}
        </q-card-section>
      </q-card>
    </div>
    <q-btn
      color="white"
      text-color="black"
      label="網頁重整"      
      @click="reload"     
    />
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "PageIndex",
  data() {
    return {
      // 目前版本存在LocalStore
      version: LocalStorage.getItem('version') || ""
    };
  },
  created() {},

  mounted() {
    // console.log(this.settings.announcement.length);

    this.setMDB(false);
    setTimeout(() => {
      //跳轉
      this.go();
    }, this.settings.delay);
  },
  computed: {
    // ...mapState("settings", ["version"]),
    ...mapGetters("settings", ["settings"]),
    //決定是否顯示更新
    updateFlag() {
      //讀取資料庫版本
      this.getSettings();
      // 讀取LocalStoreage版本
      this.version = LocalStorage.getItem('version')
      //兩個版本不一樣就顯示更新按鈕
      return this.settings.version !== this.version;
    },
  },
  methods: {
    ...mapMutations("LoadData", ["setMDB"]),
    ...mapActions("settings", ["getSettings", "setVersion"]),
    go() {
      this.setMDB(true);
      this.$router.push("/MDB").catch((err) => {});
    },
    reload() {
      //更新
      window.location.reload(true);
      //保存最新版本
      // LocalStorage.set("version", this.settings.version);
    },
  },
};
</script>
