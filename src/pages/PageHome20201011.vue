<template>
  <q-page style="max-width: 600px; margin: auto">
    <template>
      <div class="row q-ma-md q-gutter-xs">
        <!-- <search /> -->
        <q-select
          class="col-12"
          v-model="county"
          :options="counties"
          label="選擇縣市"
          clearable
          outlined
        />
        <q-select
          class="col-12"
          v-model="classify"
          :options="professionalTitle"
          label="分類"
          clearable
          outlined
        />
        <q-input
          class="col-12"
          bottom-slots
          outlined
          v-model="name"
          label="姓名"
          maxlength="5"
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
      <div class="row q-ma-md q-gutter-x-md">
        <div class="col-8" @click="ratingFn">
          <q-rating
            v-model="star"
            size="2em"
            :max="5"
            color="primary"
            icon="star_border"
            icon-selected="star"
          />
        </div>
        <div class="col-2">
          <!-- <q-toggle v-model="RedDot" color="red" /> -->
          <!-- <q-radio v-model="RedDot" val="true" label="" color="red" @click="toggle"/> -->
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

      <div class="col-12 q-ma-md">
        <q-btn
          color="info"
          label="搜尋"
          @click="ReadDataMultipleConditions"
          class="full-width"
          icon="search"
          size="lg"
        />
      </div>

      <div class="q-px-md q-pb-lg absolute full-width column">

<search />

        <!-- <q-scroll-area class="q-scroll-area-tasks">  //FieldReordFiltered -->
        <q-list bordered separator>
          <q-infinite-scroll @load="loadMore" :offset="10">
            <!-- 顯示每個人名 -->
            <contact-list-item
              v-for="(task, key) in showingData"
              :key="key"
              :task="task"
              :id="key"
            ></contact-list-item>
            <template
              v-slot:loading
              v-if="this.actualMaxPosition < this.FindRecordLength"
            >
              <div class="row justify-center q-my-md">
                {{ actualMaxPosition }} / {{ FindRecordLength }}
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-list>
        <!-- </q-scroll-area> -->
      </div>
    </template>

    <!-- 向上捲動 回到頂部 -->
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>
  </q-page>
</template>

<script>
import Vue from "vue";
import { dbFirestore } from "boot/firebase";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "",
  data() {
    return {
      Downloading: false,
      SearchText: "",
      // tasks: [],
      actualMaxPosition: 10, //一次捲動10筆資料
      timer: null,
      index: 1,
      dbData: {}, //登入時，將所有資料下載儲存

      county: "",
      name: "",
      classify: "",
      star: 0,
      RedDot: false,
    };
  },
  components: {
    search: require("components/Search.vue").default,
    ContactListItem: require("components/ContactListItem.vue").default,
  },
  created() {
    this.readProfessionalTitle();
  },
  mounted() {
    // this.getData(); //登入時，將所有資料下載儲存
  },

  watch: {},
  computed: {
    ...mapState("search", ["FieldRecord", "tasksDownloaded"]),
    ...mapGetters("search", ["FindRecordLength", "FieldReordFiltered"]),
    ...mapState("phrase", ["professionalTitle", "counties", "districts"]),

    //螢幕顯示可捲動資料
    showingData() {
      let keys = [];
      let showTasks = {};
      let showKeys = [];
      Object.keys(this.FieldReordFiltered).forEach((key) => {
        keys.push(key);
      });
      showKeys = keys.slice(0, this.actualMaxPosition);
      showKeys.forEach((key) => {
        Vue.set(showTasks, key, this.FieldReordFiltered[key]);
      });
      // console.log(showTasks);
      return showTasks;
    },
  },
  methods: {
    ...mapMutations("search", ["setFieldReord", "setSearch", "setStar"]),
    ...mapActions("search", ["monitor"]),

    ...mapMutations("fieldrecord", [
      "setDistrict",
      "setCounty",
      "setName",
      "setTasksDownloaded",
    ]),
    ...mapActions("phrase", ["readProfessionalTitle"]),

    toggle() {
      this.RedDot = !this.RedDot;
      console.log(this.RedDot);
    },
    ratingFn() {
      console.log(this.star);
    },
    async doSearch() {
      // if(!this.SearchText){ //null 或 undefine

      let dbData = {};
      if (this.star > 0 && this.RedDot) {
        //同時搜尋星級、紅點
        //要建立索引，會出現錯誤提示建立索引的網址。注意：自己在網頁操作建立的索引不起作用
        dbData = await this.ReadDataStarRedDot();
      } else if (this.RedDot) {
        //搜尋星級
        dbData = await this.ReadDataRedDot();
      } else if (this.star > 0) {
        //搜尋紅點
        dbData = await this.ReadDataStar();
      } else {
        //全文搜尋
        if (
          !this.SearchText ||
          this.SearchText.replace(/(^s*)|(s*$)/g, "").length == 0
        ) {
          this.$q.dialog({
            title: "提醒",
            message: "請輸入搜尋關鍵字！",
          });
          return false;
        }
        dbData = Object.assign({}, this.dbData);

        // this.$q.notify({
        //   color: "purple",
        //   message: "過濾資料中....",
        //   position: "left",
        // });
      }
      if (Object.keys(dbData).length === 0) {
        this.$q.dialog({
          title: "",
          message: "查不到資料！",
        });
        return false;
      }
      //將搜尋結果下載，並存到vuex store.state.FieldRecord
      this.setFieldReord(dbData);
      //開始過濾，顯示在畫面上
      this.setSearch(this.SearchText);
      // this.$q.notify("過濾資料中....");
    },

    //登入時，將所有資料下載儲存
    async getData() {
      await this.ReadData();
      // console.log(Object.keys(this.dbData).length)
      if (Object.keys(this.dbData).length !== 0) {
        //複製到vuex store.state.FiledRecord
        this.setFieldReord(this.dbData);
      }
    },
    //一開始全部資料載入
    async ReadData() {
      // let dbData = {};
      // this.i = 0;
      this.Downloading = true;
      await dbFirestore
        .collection("現場紀錄表")
        .orderBy("updateDate", "desc")
        // .limit(10)
        .get()
        .then((qs) => {
          qs.forEach((doc) => {
            Vue.set(this.dbData, doc.id, doc.data());
          });
          this.Downloading = false;
        })
        .catch((err) => {
          console.log(err.message);
        });
      // return dbData;
    },
    //同時搜尋星級、紅點
    async ReadDataStarRedDot() {
      let dbData = {};
      // this.i = 0;
      this.Downloading = true;
      await dbFirestore
        .collection("現場紀錄表")
        .where("star", ">=", this.star)
        .where("RedDot", "==", this.RedDot)
        .get()
        .then((qs) => {
          qs.forEach((doc) => {
            Vue.set(dbData, doc.id, doc.data());
          });
          this.Downloading = false;
        })
        .catch((err) => {
          console.log(err.message);
        });
      return dbData;
    },
    //搜尋星級
    async ReadDataStar() {
      let dbData = {};
      // this.i = 0;
      this.Downloading = true;
      await dbFirestore
        .collection("現場紀錄表")
        .where("star", ">=", this.star)
        .get()
        .then((qs) => {
          qs.forEach((doc) => {
            Vue.set(dbData, doc.id, doc.data());
          });
          this.Downloading = false;
        })
        .catch((err) => {
          console.log(err.message);
        });
      return dbData;
    },
    //搜尋紅點
    async ReadDataRedDot() {
      let dbData = {};
      // this.i = 0;
      this.Downloading = true;
      await dbFirestore
        .collection("現場紀錄表")
        .where("RedDot", "==", this.RedDot)
        .get()
        .then((qs) => {
          qs.forEach((doc) => {
            Vue.set(dbData, doc.id, doc.data());
          });
          this.Downloading = false;
        })
        .catch((err) => {
          console.log(err.message);
        });

      return dbData;
    },

    //多條件
    async ReadDataMultipleConditions() {
      let dbData = {};
      let star = this.star;
      let name = this.name.trim();
      let county = !this.county ? "" : this.county;
      let classify = !this.classify ? "" : this.classify;

      console.log("name", name);
      console.log("star", star);
      console.log("RedDot", this.RedDot);
      console.log("county", county);
      console.log("classify", classify);

      if (name !== "" && county === "" && classify === "" && star === 0) {
        console.log("A");

        let dbData = {};
        // this.i = 0;
        this.Downloading = true;
        await dbFirestore
          .collection("現場紀錄表")
          // .where("star", "==", this.star)
          // .where("RedDot", "==", this.RedDot)
          // .where("county", "==", this.flt.county) //縣市
          // .where("classify", "==", this.flt.classify) //分類
          .where("name", ">=", name)
          .where("name", "<=", name + "\uf8ff")
          .get()
          .then((qs) => {
            console.log(qs);
            if (qs.empty) {
              console.log("查不到");
              return false;
            }
            qs.forEach((doc) => {
              console.log(doc.data().name);
              Vue.set(dbData, doc.id, doc.data());
            });
            this.Downloading = false;
            console.log(dbData);
            
          })
          .catch((err) => {
            console.log(err.message);
          });
          this.setFieldReord(dbData);
          this.setSearch(name);
        // return dbData;
      }
    },

    loadMore(index, done) {
      //   console.log("index", index);
      this.timer = setTimeout(() => {
        this.actualMaxPosition += 9;
        done();
      }, 100);
    },
  }, //Methods
};
</script>

<style>
</style>
