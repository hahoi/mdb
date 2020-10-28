<template>
  <q-page style="max-width: 600px; margin: auto">
    <q-card
      class="rounded-borders q-ma-md q-mt-lg bg-grey-1"
      @click="cloudSearch = true"
    >
      <q-card-section>
        <div class="row q-ma-md q-gutter-xs text-h6">
          <q-select
            class="col-12 text-h6"
            v-model="county"
            :options="counties"
            label="選擇縣市"
            clearable
            outlined
            popup-content-class="text-h6"
          />
          <q-select
            class="col-12 text-h6"
            v-model="classify"
            :options="Cassify"
            label="分類"
            clearable
            outlined
            popup-content-class="text-h6"
          />
          <!-- 例:(王 王大 王大軍 <=正確)（大 大軍 <= 錯誤） -->
          <q-input
            class="col-12 text-h6"
            bottom-slots
            outlined
            v-model="name"
            label="姓名"
            maxlength="50"
          >
            <template v-slot:append>
              <q-icon
                v-if="name !== ''"
                name="close"
                @click="name = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </div>
        <div class="row q-mx-md q-gutter-r-md">
          <div class="col-10" @click="ratingFn">
            <q-rating
              v-model="star"
              size="2em"
              :max="5"
              color="primary"
              icon="star_border"
              icon-selected="star"
            />
          </div>
          <div class="col-1">
            <div v-if="RedDot" @click="toggle">
              <q-icon
                name="brightness_1"
                class="text-red"
                style="font-size: 2rem"
              />
            </div>
            <div v-else @click="toggle">
              <q-icon
                name="panorama_fish_eye"
                class="text-red"
                style="font-size: 2rem; outline"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- <q-card-section> -->
      <!-- <div class="text-subtitle2" v-if="conditions">查詢條件</div>
        <div class="bg-grey-2 q-ma-md row-wrap" v-html="conditions"></div> -->
      <q-card-actions vertical>
        <q-btn
          color="info"
          label="雲端搜尋"
          @click="LoadDbData"
          class="full-width"
          icon="search"
          size="lg"
        />
      </q-card-actions>
    </q-card>

    <template v-if="Downloading">
      <div class="text-center">
        <span class="">
          <q-spinner-dots color="primary" size="40px" />
        </span>
      </div>
    </template>
    <!-- v-if="conditions !== ''" -->
    <template v-else>
      <div class="q-mt-xl q-pt-xl" ref="showRecord" >
        <show-record></show-record>
      </div>
    </template>

        <q-dialog v-model="inception">
      <q-card>
        <q-card-section>
          <div class="text-h6">沒有輸入查詢條件</div>
        </q-card-section>
        <q-card-section class="row items-center q-gutter-sm">
          <q-btn
            flat
            label="列出全部資料"
            color=""
            v-close-popup
            @click="listAllRecord"
          />
          <q-btn v-close-popup label="關閉" color="primary" />

          <!-- <q-dialog v-model="secondDialog">
            <q-card>
              <q-card-section>
                <div class="text-h6">
                  下載全部資料若資料筆數過大，需要一些時間，仍要繼續...
                </div>
              </q-card-section>
              <q-card-section
                align="right"
                class="bg-white text-teal q-gutter-sm"
              >
                <q-btn v-close-popup="2" label="確定" @click="listAllRecord" />
                <q-btn v-close-popup="2" label="不要" />
              </q-card-section>
            </q-card>
          </q-dialog> -->
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- 新增資料視窗============================== -->
    <template>
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
    </template>
    <q-page-sticky position="top-right" :scroll-offset="0" :offset="[-13, -18]">
      <div class="flex justify-end q-ma-md">
        <!-- 新增按鈕 -->
        <q-btn
          fab
          icon="add"
          color="info"
          @click="dialogAdd = true"
          size="sm"
          class="q-my-xs"
        />
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script>
import Vue from "vue";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { dbFirestore } from "boot/firebase";

import { scroll } from "quasar";

export default {
  name: "",
  data() {
    return {
      dialogAdd: false,
      cloudSearch: true,
      taskShow: true,
      Downloading: false,
      //雲端搜尋條件變數
      county: "",
      name: "",
      classify: "",
      star: 0,
      RedDot: false,

      inception: false,
      secondDialog: false,
    };
  },
  components: {
    ShowRecord: require("components/ShowRecord.vue").default,
    DataBankAdd: require("components/DataBankAdd.vue").default,
  },
  created() {
    //讀入分類
    // this.readProfessionalTitle();
    this.ReadCassify();
  },
  mounted() {
    this.clearFieldReord();
  },
  watch: {},
  computed: {
    ...mapState("LoadData", ["FindRecordLength", "tasksDownloaded"]),
    ...mapState("phrase", ["professionalTitle", "Cassify", "counties"]),

    //顯示查詢字串
    conditionsSetSearch() {
      let string = "";
      let star = this.star;
      let name = this.name.trim();
      let county = !this.county ? "" : this.county;
      let classify = !this.classify ? "" : this.classify;
      // let star = this.star + ""
      name = name === "" ? "" : name + " ";
      county = county === "" ? "" : county + " ";
      classify = classify === "" ? "" : classify + " ";

      string = county + classify + name;
      return string;
    },
    conditions() {
      let star = this.star === 0 ? "" : this.star + "星";
      let RedDot = this.RedDot ? "紅點" : "";
      return this.conditionsSetSearch + star + RedDot;
    },
  },
  methods: {
    ...mapMutations("LoadData", [
      "setFieldReord",
      "setSearch",
      "setTasksDownloaded",
      "clearFieldReord",
      "setMDB",
    ]),
    ...mapActions("LoadData", ["setFilter", "setSearch"]),
    ...mapActions("phrase", ["readProfessionalTitle", "ReadCassify"]),

    //紅點切換
    toggle() {
      this.RedDot = !this.RedDot;
      // console.log(this.RedDot);
    },
    ratingFn() {
      // console.log(this.star);
    },

    //========================================================================
    async LoadDbData() {
      let vm = this;
      //  let showRecord = vm.$refs.showRecord
      // vm.scrollToElement()
      //清空顯示資料
      this.cloudSearch = false;
      this.clearFieldReord();
      //顯示查詢字串
      this.setSearch(this.conditionsSetSearch);
      //多條件查詢
      let dbData = {};
      let star = this.star;
      let name = this.name.trim();
      let county = !this.county ? "" : this.county;
      let classify = !this.classify ? "" : this.classify;
      let RedDot = this.RedDot;

      //查詢條件空白
      if (
        name === "" &&
        county === "" &&
        classify === "" &&
        star === 0 &&
        RedDot === false
      ) {
        this.inception = true;
        // this.$q.dialog({
        //   title: "",
        //   message: "請輸入查詢條件！",
        // });
        return false;
      }

      this.Downloading = true;

      // ============================================================================================
      //有紅點
      if (RedDot) {
        //姓名
        if (name !== "" && county === "" && classify === "" && star === 0) {
          console.log("姓名");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            // .where("star", "==", star)
            .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              //名字搜尋
              dbData = this.SearchName(name, dbData);
              this.Downloading = false;
              if (Object.keys(dbData).length == 0) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                return false;
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
        //縣市
        if (name === "" && county !== "" && classify === "" && star === 0) {
          console.log("縣市");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            // .where("star", "==", star)
            .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              this.Downloading = false;
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
        //分類
        if (name === "" && county === "" && classify !== "" && star === 0) {
          console.log("分類");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            // .where("star", "==", star)
            .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              this.Downloading = false;
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
        //縣市 分類
        if (name === "" && county !== "" && classify !== "" && star === 0) {
          console.log("縣市 分類");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            // .where("star", "==", star)
            .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              this.Downloading = false;
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
        //縣市 姓名
        if (name !== "" && county !== "" && classify === "" && star === 0) {
          console.log("縣市 姓名");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            // .where("star", "==", star)
            .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              //名字搜尋
              dbData = this.SearchName(name, dbData);
              this.Downloading = false;
              if (Object.keys(dbData).length == 0) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                return false;
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
        //分類 姓名
        if (name !== "" && county === "" && classify !== "" && star === 0) {
          console.log("分類 姓名");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            // .where("star", "==", star)
            .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              //名字搜尋
              dbData = this.SearchName(name, dbData);
              this.Downloading = false;
              if (Object.keys(dbData).length == 0) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                return false;
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
        //縣市 分類 姓名
        if (name !== "" && county !== "" && classify !== "" && star === 0) {
          console.log("縣市 分類 姓名");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            // .where("star", "==", star)
            .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              //名字搜尋
              dbData = this.SearchName(name, dbData);
              this.Downloading = false;
              if (Object.keys(dbData).length == 0) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                return false;
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
        //縣市 星級
        if (county !== "" && classify === "" && star > 0) {
          console.log("縣市 星級");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            .where("star", ">=", star)
            .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              this.Downloading = false;
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }

        //分類 星級
        if (county === "" && classify !== "" && star > 0) {
          console.log("分類 星級");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            .where("star", ">=", star)
            .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              this.Downloading = false;
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }

        //縣市 分類 星級
        if (county !== "" && classify !== "" && star > 0) {
          console.log("縣市 分類 星級");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            .where("star", ">=", star)
            .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              this.Downloading = false;
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          this.Downloading = false;
          return true;
        }
        //星級 姓名
        if (name !== "" && county === "" && classify === "" && star > 0) {
          console.log("星級 姓名");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            .where("star", ">=", star)
            .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              //名字搜尋
              dbData = this.SearchName(name, dbData);
              this.Downloading = false;
              if (Object.keys(dbData).length == 0) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                return false;
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }

        //星級  紅點
        if (name === "" && county === "" && classify === "" && star > 0) {
          console.log("星級 紅點");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            .where("star", ">=", star)
            .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              this.Downloading = false;
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }

        //=======================================================================================
        //沒有紅點
      } else {
        if (name !== "" && county === "" && classify === "" && star === 0) {
          console.log("姓名");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            // .where("star", "==", star)
            // .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                Vue.set(dbData, doc.id, doc.data());
              });
              //名字搜尋
              dbData = this.SearchName(name, dbData);
              this.Downloading = false;
              if (Object.keys(dbData).length == 0) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                return false;
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
        //縣市
        if (name === "" && county !== "" && classify === "" && star === 0) {
          console.log("縣市");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            // .where("star", "==", star)
            // .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              this.Downloading = false;
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
        //分類
        if (name === "" && county === "" && classify !== "" && star === 0) {
          console.log("分類");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            // .where("star", "==", star)
            // .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              this.Downloading = false;
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
        //縣市 分類
        if (name === "" && county !== "" && classify !== "" && star === 0) {
          console.log("縣市 分類");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            // .where("star", "==", star)
            // .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              this.Downloading = false;
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
        //縣市 姓名
        if (name !== "" && county !== "" && classify === "" && star === 0) {
          console.log("縣市 姓名");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            // .where("star", "==", star)
            // .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              //名字搜尋
              dbData = this.SearchName(name, dbData);
              this.Downloading = false;
              if (Object.keys(dbData).length == 0) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                return false;
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
        //分類 姓名
        if (name !== "" && county === "" && classify !== "" && star === 0) {
          console.log("分類 姓名");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            // .where("star", "==", star)
            // .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              //名字搜尋
              dbData = this.SearchName(name, dbData);
              this.Downloading = false;
              if (Object.keys(dbData).length == 0) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                return false;
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
        //縣市 分類 姓名
        if (name !== "" && county !== "" && classify !== "" && star === 0) {
          console.log("縣市 分類 姓名");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            // .where("star", "==", star)
            // .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              //名字搜尋
              dbData = this.SearchName(name, dbData);
              this.Downloading = false;
              if (Object.keys(dbData).length == 0) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                return false;
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
        //縣市 星級
        if (county !== "" && classify === "" && star > 0) {
          console.log("縣市 星級");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            .where("star", ">=", star)
            // .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              this.Downloading = false;
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }

        //分類 星級
        if (county === "" && classify !== "" && star > 0) {
          console.log("分類 星級");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            .where("star", ">=", star)
            // .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              this.Downloading = false;
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }

        //縣市 分類 星級
        if (county !== "" && classify !== "" && star > 0) {
          console.log("縣市 分類 星級");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            .where("star", ">=", star)
            // .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              this.Downloading = false;
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          this.Downloading = false;
          return true;
        }
        //星級 姓名
        if (name !== "" && county === "" && classify === "" && star > 0) {
          console.log("星級 姓名");
          let dbData = {};
          await dbFirestore
            .collection("現場紀錄表")
            .where("star", ">=", star)
            // .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            // .where("name", ">=", name)
            // .where("name", "<=", name + "\uf8ff")
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                this.Downloading = false;
                return false;
              }
              qs.forEach((doc) => {
                // console.log(doc.data().name);
                Vue.set(dbData, doc.id, doc.data());
              });
              //名字搜尋
              dbData = this.SearchName(name, dbData);
              this.Downloading = false;
              if (Object.keys(dbData).length == 0) {
                this.$q.dialog({
                  title: "",
                  message: "查不到",
                });
                return false;
              }
            })
            .catch((err) => {
              console.log(err.message);
            });
          this.setFieldReord(dbData);
          await vm.scrollToElement();
          return true;
        }
      }
      // =======================================================================================
      //只有紅點，沒其他條件
      if (RedDot) {
        console.log("只有紅點，沒其他條件");

        // console.log(RedDot,star)
        let dbData = {};
        await dbFirestore
          .collection("現場紀錄表")
          .where("RedDot", "==", true)
          // .where("star", ">=", star)
          .get()
          .then((qs) => {
            if (qs.empty) {
              this.$q.dialog({
                title: "",
                message: "查不到",
              });
              this.Downloading = false;
              return false;
            }
            qs.forEach((doc) => {
              // console.log(doc.data().name);
              Vue.set(dbData, doc.id, doc.data());
            });
            this.Downloading = false;
          })
          .catch((err) => {
            console.log(err.message);
          });
        this.setFieldReord(dbData);
        await vm.scrollToElement();
      } else if (star > 0) {
        //沒有紅點,有星級
        console.log("沒有紅點,有星級");
        let dbData = {};
        await dbFirestore
          .collection("現場紀錄表")
          // .where("RedDot", "==", true)
          .where("star", ">=", star)
          .get()
          .then((qs) => {
            if (qs.empty) {
              this.$q.dialog({
                title: "",
                message: "查不到",
              });
              this.Downloading = false;
              return false;
            }
            qs.forEach((doc) => {
              // console.log(doc.data().name);
              Vue.set(dbData, doc.id, doc.data());
            });
            this.Downloading = false;
          })
          .catch((err) => {
            console.log(err.message);
          });
        this.setFieldReord(dbData);
        await vm.scrollToElement();
      }
      this.Downloading = false;
    }, //LoadData end

    //＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //搜尋名字
    SearchName(name, data) {
      let match = {};
      Object.keys(data).forEach((key) => {
        if (data[key]["name"].includes(name)) {
          // console.log(data[key]["name"]);
          Vue.set(match, key, data[key]); //符合條件的存在物件中
        }
      });
      // console.log(match);
      return match;
    },
    scrollToElement() {
      let vm = this;
      let el = vm.$refs.showRecord;
      const { getScrollTarget, setScrollPosition } = scroll;
      let target = getScrollTarget(el);
      // console.log(target);
      let offset = el.offsetTop - el.scrollHeight;
      let duration = 1000;
      setScrollPosition(target, offset, duration);
    },
    
    //沒有下查詢條件列出所有紀錄
    async listAllRecord() {
      let vm = this;
      this.cloudSearch = false;
      this.clearFieldReord();

      let dbData = {};
      this.Downloading = true;
      await dbFirestore
        .collection("現場紀錄表")
        .get()
        .then((qs) => {
          if (qs.empty) {
            this.$q.dialog({
              title: "",
              message: "查不到",
            });
            this.Downloading = false;
            return false;
          }
          qs.forEach((doc) => {
            // console.log(doc.data().name);
            Vue.set(dbData, doc.id, doc.data());
          });
          this.Downloading = false;
        })
        .catch((err) => {
          console.log(err.message);
        });
      this.setFieldReord(dbData);
      await vm.scrollToElement();
      return true;
    },
  }, // methods end
};
</script>

<style>
</style>
