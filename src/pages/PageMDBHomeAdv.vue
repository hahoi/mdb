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
          @click="queryData"
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
    <template v-else>
      <div class="q-mt-xl q-pt-xl" ref="showRecord">
        <!-- 列出查詢結果 -->
        <show-record></show-record>
        <template v-if="pageSticky">
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn label="- 查看更多 -" @click="morePaginate" />
          </q-page-sticky>
        </template>
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

import { scroll, Notify } from "quasar";

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

      lastDoc: "", //分頁讀取用
      pageSticky: false, //查看更多按鈕
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
    this.setFieldRecordTotalCount(0);
  },
  mounted() {
    this.clearFieldReord();
  },
  watch: {
    conditions() {
      if (this.conditions === "") {
        this.clearFieldReord();
      }
    },
  },
  computed: {
    ...mapState("auth", ["userData"]),
    ...mapState("LoadData", ["tasksDownloaded", "FieldRecordTotalCount","FieldRecord500"]),
    ...mapGetters("LoadData", ["FindRecordLength"]),
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
      "setFieldRecordTotalCount",
      "setFieldRecord500",
      "clearFieldRecord500",
    ]),
    ...mapActions("LoadData", ["setFilter", "setSearch", "log"]),
    ...mapActions("phrase", ["readProfessionalTitle", "ReadCassify"]),

    //紅點切換
    toggle() {
      this.RedDot = !this.RedDot;
      // console.log(this.RedDot);
    },
    ratingFn() {
      // console.log(this.star);
    },

    queryNoData() {
      this.$q.dialog({
        title: "",
        message: "查不到",
      });
      this.Downloading = false;
    },

    /*
    ABCD四個條件，組合情形
    A、B、C、D、AB、AC、AD、ABC、ABD、ACD、ABCD、BC、BD、BCD、CD 共15種
    C(4,1) = 4  挑1個字元組合  n!/(n-r)!*r! =  4!/(3)!*1!
    C(4,2) = 6  挑2個字元組合
    C(4,3) = 4  挑3個字元組合
    C(4,4) = 1  挑4個字元組合
    */
    async queryData() {
      let vm = this;
      //清空顯示資料
      this.cloudSearch = false;
      this.clearFieldReord();
      this.setFieldRecordTotalCount(0);
      //顯示查詢字串
      this.setSearch(this.conditionsSetSearch);
      //多條件查詢
      let dbData = {};
      let star = this.star;
      let name = this.name.trim();
      let county = !this.county ? "" : this.county;
      let classify = !this.classify ? "" : this.classify;
      let RedDot = this.RedDot;

      // // 紀錄
      // let payload = {
      //   do: "查詢資料",
      //   data: this.conditionsSetSearch,
      // };
      // this.log(payload);

      //查詢條件空白
      if (
        name === "" &&
        county === "" &&
        classify === "" &&
        star === 0 &&
        RedDot === false
      ) {
        this.inception = true;
        return false;
      }

      this.Downloading = true;

      // 查詢資料庫
      const query = dbFirestore.collection("現場紀錄表");

      //有 紅點
      if (RedDot) {
        //1縣市 紅點
        if (county !== "" && classify === "" && name === "" && star === 0) {
          console.log("1縣市 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            // .where("nameKeyword", "array-contains", name.toLowerCase())
            // .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //2分類 紅點
        if (county === "" && classify !== "" && name === "" && star === 0) {
          console.log("2分類 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            // .where("nameKeyword", "array-contains", name.toLowerCase())
            // .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //3姓名 紅點
        if (county === "" && classify === "" && name !== "" && star === 0) {
          console.log("3姓名 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            .where("nameKeyword", "array-contains", name.toLowerCase())
            // .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //4星級 紅點
        if (county === "" && classify === "" && name === "" && star > 0) {
          console.log("4星級 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            // .where("nameKeyword", "array-contains", name.toLowerCase())
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //5縣市 分類 紅點
        if (county !== "" && classify !== "" && name === "" && star === 0) {
          console.log("5縣市 分類 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            // .where("nameKeyword", "array-contains", name.toLowerCase())
            // .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //6縣市 姓名 紅點
        if (county !== "" && classify === "" && name !== "" && star === 0) {
          console.log("6縣市 姓名 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            .where("nameKeyword", "array-contains", name.toLowerCase())
            // .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //7縣市 星級 紅點
        if (county !== "" && classify === "" && name === "" && star > 0) {
          console.log("7縣市 星級 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            // .where("nameKeyword", "array-contains", name.toLowerCase())
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //8分類 姓名 紅點
        if (county === "" && classify !== "" && name !== "" && star === 0) {
          console.log("8分類 姓名 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            .where("nameKeyword", "array-contains", name.toLowerCase())
            // .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //9分類 星級 紅點
        if (county === "" && classify !== "" && name === "" && star > 0) {
          console.log("9分類 星級 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            // .where("nameKeyword", "array-contains", name.toLowerCase())
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //10姓名 星級 紅點
        if (county === "" && classify === "" && name !== "" && star > 0) {
          console.log("10姓名 星級 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            .where("nameKeyword", "array-contains", name.toLowerCase())
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //11縣市 分類 姓名 紅點
        if (county !== "" && classify !== "" && name !== "" && star === 0) {
          console.log("11縣市 分類 姓名 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            .where("nameKeyword", "array-contains", name.toLowerCase())
            // .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //12縣市 分類 星級 紅點
        if (county !== "" && classify !== "" && name === "" && star > 0) {
          console.log("12縣市 分類 星級 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            // .where("nameKeyword", "array-contains", name.toLowerCase())
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //13縣市 姓名 星級 紅點
        if (county !== "" && classify === "" && name !== "" && star > 0) {
          console.log("13縣市 姓名 星級 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            // .where("classify", "==", classify) //分類
            .where("nameKeyword", "array-contains", name.toLowerCase())
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //14分類 姓名 星級 紅點
        if (county === "" && classify !== "" && name !== "" && star > 0) {
          console.log("14分類 姓名 星級 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            // .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            .where("nameKeyword", "array-contains", name.toLowerCase())
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //15縣市 分類 姓名 星級 紅點
        if (county !== "" && classify !== "" && name !== "" && star > 0) {
          console.log("15縣市 分類 姓名 星級 紅點 ");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            .where("nameKeyword", "array-contains", name.toLowerCase())
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //16只有紅點
        if (county === "" && classify === "" && name === "" && star === 0) {
          console.log("16紅點");
          const snapshot = await query
            .where("RedDot", "==", RedDot)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
      }
      //沒有紅點
      else {
        //1縣市
        if (county !== "" && classify === "" && name === "" && star === 0) {
          console.log("1縣市");
          const snapshot = await query
            .where("county", "==", county) //縣市
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //2分類
        if (county === "" && classify !== "" && name === "" && star === 0) {
          console.log("2分類");
          const snapshot = await query
            .where("classify", "==", classify) //分類
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //3姓名
        if (county === "" && classify === "" && name !== "" && star === 0) {
          console.log("3姓名");
          const snapshot = await query
            .where("nameKeyword", "array-contains", name.toLowerCase())
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //4星級
        if (county === "" && classify === "" && name === "" && star > 0) {
          console.log("4星級");
          const snapshot = await query
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //5縣市 分類
        if (county !== "" && classify !== "" && name === "" && star === 0) {
          console.log("5縣市 分類");
          const snapshot = await query
            .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //6縣市 姓名
        if (county !== "" && classify === "" && name !== "" && star === 0) {
          console.log("6縣市 姓名");
          const snapshot = await query
            .where("county", "==", county) //縣市
            .where("nameKeyword", "array-contains", name.toLowerCase())
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //7縣市 星級
        if (county !== "" && classify === "" && name === "" && star > 0) {
          console.log("7縣市 星級");
          const snapshot = await query
            .where("county", "==", county) //縣市
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //8分類 姓名
        if (county === "" && classify !== "" && name !== "" && star === 0) {
          console.log("8分類 姓名");
          const snapshot = await query
            .where("classify", "==", classify) //分類
            .where("nameKeyword", "array-contains", name.toLowerCase())
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //9分類 星級
        if (county === "" && classify !== "" && name === "" && star > 0) {
          console.log("9分類 星級");
          const snapshot = await query
            .where("classify", "==", classify) //分類
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //10姓名 星級
        if (county === "" && classify === "" && name !== "" && star > 0) {
          console.log("10姓名 星級");
          const snapshot = await query
            .where("nameKeyword", "array-contains", name.toLowerCase())
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //11縣市 分類 姓名
        if (county !== "" && classify !== "" && name !== "" && star === 0) {
          console.log("11縣市 分類 姓名");
          const snapshot = await query
            .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            .where("nameKeyword", "array-contains", name.toLowerCase())
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //12縣市 分類 星級
        if (county !== "" && classify !== "" && name === "" && star > 0) {
          console.log("12縣市 分類 星級");
          const snapshot = await query
            .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //13縣市 姓名 星級
        if (county !== "" && classify === "" && name !== "" && star > 0) {
          console.log("13縣市 姓名 星級");
          const snapshot = await query
            .where("county", "==", county) //縣市
            .where("nameKeyword", "array-contains", name.toLowerCase())
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //14分類 姓名 星級
        if (county === "" && classify !== "" && name !== "" && star > 0) {
          console.log("14分類 姓名 星級");
          const snapshot = await query
            .where("classify", "==", classify) //分類
            .where("nameKeyword", "array-contains", name.toLowerCase())
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
        //15縣市 分類 姓名 星級
        if (county !== "" && classify !== "" && name !== "" && star > 0) {
          console.log("15縣市 分類 姓名 星級");
          const snapshot = await query
            .where("county", "==", county) //縣市
            .where("classify", "==", classify) //分類
            .where("nameKeyword", "array-contains", name.toLowerCase())
            .where("star", ">=", star)
            .get()
            .then((qs) => {
              if (qs.empty) {
                this.queryNoData();
                return false;
              }
              qs.forEach((doc) => {
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
      } //end if redDot
    }, //end queryData

    //＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //搜尋名字
    SearchName(name, data) {
      let match = {};
      Object.keys(data).forEach((key) => {
        let searchLowerCase = data[key]["name"].toLowerCase(); //要轉成小寫英文姓名才不會出錯
        let nameLowerCase = name.toLowerCase(); //要轉成小寫英文姓名才不會出錯
        if (searchLowerCase.includes(nameLowerCase)) {
          // console.log(nameLowerCase,searchLowerCase);
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
      this.clearFieldRecord500();
      this.lastDoc = "";

      this.Downloading = true;

      //讀取總筆數
      await dbFirestore
        .collection("現場紀錄表_counter")
        .doc("counter")
        .get()
        .then((doc) => {
          console.log(doc.data());
          this.setFieldRecordTotalCount(doc.data().count); //設定總筆數
        });
      // 分頁讀取，每次500筆
      let dbObj = await this.Paginate();
      // console.log(dbObj);
      this.pageSticky = true; //查看更多按鈕
      this.setFieldRecord500(Object.keys(dbObj).length);
      this.setFieldReord(dbObj);
      await vm.scrollToElement();

      // // 紀錄
      // let payload = {
      //   do: "列出全部資料",
      //   data: null,
      // };
      // this.log(payload);
    },
    async morePaginate() {
      // 分頁讀取，每次500筆
      let dbObj = await this.Paginate();
      // console.log(dbObj);
      if((Object.keys(dbObj).length === 0 && dbObj.constructor === Object) || this.FieldRecord500 > this.FieldRecordTotalCount ){
        console.log("沒有了");
        this.$q.notify("沒有了...");
        this.pageSticky = false;
        return;
      }
      // console.log(Object.keys(dbObj).length)
      this.setFieldRecord500(Object.keys(dbObj).length);
      this.setFieldReord(dbObj);
      await this.scrollToElement();
    },

    Paginate() {
      return new Promise((resolve, reject) => {
        let dbObj = {};
        const query = dbFirestore.collection("現場紀錄表");
        const snapshot = query
          .orderBy("updateDate", "desc")
          .startAfter(this.lastDoc)
          .limit(500)
          .get();
        snapshot.then((qs) => {
          // console.log(qs.empty)
          if (qs.empty) {
            resolve({});
          }

          qs.forEach((doc) => {
            let x = doc.data();
            Vue.set(dbObj, doc.id, x);
            this.lastDoc = x.updateDate; //這次查詢最後一筆 date值
          });
          this.Downloading = false;
          resolve(dbObj);
        });
      });
    },
  }, // methods end
};
</script>

<style>
</style>
