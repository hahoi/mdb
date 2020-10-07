<template>
  <q-page>
    <template>
      <div class="row q-ma-md q-gutter-x-md">
        <!-- <search /> -->
        <q-input
          class="col-6"
          clearable
          outlined
          color="purple-12"
          v-model="SearchText"
          label="多個關鍵字搜尋"
        />

        <q-btn
          :loading="Downloading"
          color="secondary"
          @click="doSearch"
          label="搜尋"
        />
      </div>
      <div class="q-px-md q-pb-lg absolute full-width column">
        <q-btn class="col-3" @click="getData">讀取資料</q-btn>
      </div>
    </template>

    <template v-if="Downloading">
      <span class="absolute-center">
        <h3>載入資料中請稍後...</h3>
        <q-spinner color="primary" size="8em" />
      </span>
    </template>
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
      dbData: {},
      i: 0,
      SearchText: "",
      tasksDownloaded: false,
      Downloading: false,
      fillData: {},
    };
  },
  components: {
    search: require("components/Search.vue").default,
  },
  created() {},
  mounted() {
    // console.log(this.dbDataStore);
    // if (Object.keys(this.dbData.length == 0)) {
    //   this.getData();
    // }
  },
  watch: {},
  computed: {
    ...mapState("search", ["FieldRecord"]),
    ...mapGetters("search", ["FindRecordLength"]),

    showingData() {
      let keys = [];
      let showTasks = {};
      let showKeys = [];
      Object.keys(this.DataFiltered).forEach((key) => {
        keys.push(key);
      });
      showKeys = keys.slice(0, this.actualMaxPosition);
      showKeys.forEach((key) => {
        Vue.set(showTasks, key, this.DataFiltered[key]);
      });
      // console.log(showTasks);
      return showTasks;
    },
  },
  methods: {
    ...mapMutations("search", ["addFieldRecord", "clearFieldReord","setFieldReord"]),
    // ...mapActions("search", ["setSearch"]),
    // ...mapActions("search", ["fbReadDataSER"]),

    LoginSet({ commit }, info) {
      let data = {};
      let item = info[0];
      return new Promise((resolve, reject) => {
        data = { username: item.username, introduce: item.introduce };
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    },

    async doSearch() {
      let ss = this.SearchWordFiltered();
      // console.log(ss);
      this.fillData = Object.assign({}, ss);
      this.setFieldReord(ss)
      await Object.keys(this.fillData).forEach((key) => {
        dbFirestore
          .collection("現場紀錄表")
          .doc(key)
          .get()
          .then((qs) => {
            // qs.forEach((doc) => {
            //   // Vue.set(this.dbData, doc.id, doc.data());

            // });
            console.log(key);
          })
          .catch((err) => {
            console.log(err.message);
          });
      });
      this.monitor();
    },
    async getData() {
      let ss = await this.ReadData();
      console.log(ss, this.i, this.dbData);
    },
    async ReadData() {
      this.dbData = {};
      this.i = 0;
      this.Downloading = true;
      await dbFirestore
        .collection("現場紀錄表")
        .get()
        .then((qs) => {
          if (qs.empty) {
            console.log("查不到");
            return false;
          }
          qs.forEach((doc) => {
            // console.log(doc.data().name);
            // dbData.data.push({
            //   id: doc.id,
            //   ...doc.data(),
            // });
            Vue.set(this.dbData, doc.id, doc.data());
            this.i++;
          });
          this.Downloading = false;
        })
        .catch((err) => {
          console.log(err.message);
        });

      return true;
    },

    SearchWordFiltered() {
      let DataSorted = this.dbData;
      let DataFiltered = {};
      let searchWord = this.SearchText.trim();
      //過濾條件用空白分割成字串，用正則可一個或多個空白去分割
      let arraySearchWord = searchWord.split(/\s+/);

      if (this.SearchText) {
        Object.keys(DataSorted).forEach((id) => {
          let task = DataSorted[id];

          let ok_flag = true; // and 都符合
          //用arr_flag保存每筆資料對每個關鍵字比對結果
          let arr_flag = [];
          let x = arraySearchWord.length; // flag陣列長度=要搜尋關鍵字的個數
          while (x--) {
            arr_flag[x] = false; //先將判斷flag，全部設為 false
          }

          //每一筆資料比對多個關鍵字 and
          arraySearchWord.forEach((keyword, index) => {
            // console.log(keyword)

            //搜尋每個欄位
            Object.keys(task).forEach((key) => {
              //搜尋文字型態個欄位
              if (typeof task[key] === "string") {
                let item = task[key];
                // console.log(key,task[key])
                let searchLowerCase = keyword.toLowerCase();
                if (item.includes(searchLowerCase)) {
                  // DataFiltered[id] = task
                  arr_flag[index] = true; //先把符合的記下來
                }
              }
            });
          });

          //判斷每一筆資料是否符合多個關鍵字
          //搜尋多條件，and 計算，其中一個是false就不符合
          arr_flag.forEach(function (a) {
            if (a == false) {
              ok_flag = false; //and
            }
          });

          //全部搜尋關鍵字都符合
          if (ok_flag) {
            DataFiltered[id] = task;
          }
        });
        return DataFiltered;
      }
      return DataSorted;
    },

    monitor() {
      dbFirestore
        .collection("現場紀錄表")
        .limit(1)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              // let payload = {
              //   id: change.doc.id,
              //   data: change.doc.data(),
              // };
              // commit("addFieldRecord", payload);
              console.log("add");
            }
            if (change.type === "modified") {
              // let payload = {
              //   id: change.doc.id,
              //   data: change.doc.data(),
              // };
              // commit("updateFieldRecord", payload);
              console.log("modified");
            }
            if (change.type === "removed") {
              // let payload = {
              //   id: change.doc.id,
              // };
              // commit("deleteFieldRecord", payload);
              console.log("removed");
            }
          });
        });
    },
  },
};
</script>

<style>
</style>
