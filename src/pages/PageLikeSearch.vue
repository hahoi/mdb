<template>
  <div>
    <q-btn label="檢查資料star=NaN" @click="checkDataType()" />
    <q-btn label="印出100筆比對" @click="load100()" />
    <q-btn label="測試分頁印到尾端" @click="test_Log()" />
    <q-btn label="測試分頁寫入資料庫(pageNum筆)" @click="load10()" />
    <q-btn
      label="資料庫加入搜尋關鍵字（螢幕console）"
      @click="show_keyword()"
    />
    <q-btn label="log資料用遞迴方式分頁印到尾端" @click="Recursive_Log()" />
    <q-btn
      label="現場紀錄資料用遞迴方式分頁印到尾端"
      @click="Recursive_fieldRecord()"
    />
    <hr />
    <q-btn
      label="遞迴方式加入搜尋關鍵字（寫入資料庫）"
      @click="write_keyword100()"
    />
    <hr />
    <div class="q-pa-md">
      <div class="q-gutter-md" style="max-width: 300px">
        <q-input v-model="nameLike" label="名字like搜尋">
          <template v-slot:append>
            <q-icon
              v-if="nameLike !== ''"
              name="close"
              @click="nameLike = ''"
              class="cursor-pointer"
            />
            <q-icon
              name="search"
              class="cursor-pointer"
              @click="nameLikeSearch()"
            />
          </template>
        </q-input>
      </div>
    </div>
    <!-- <q-btn
      label="姓名拆分"
      @click="
        nameSplit('謝孟良');
        nameSplit('HsiehD, fsdfs');
        nameSplit('謝  孟 良');
      "
    /> -->
    <hr />
    <div v-for="(item, index) in data_list" :key="index">
      <div class="row">
        <div class="col">
          {{ item.id }}
        </div>
        <div class="col">
          {{ item.name }}
        </div>
        <div class="col ellipsis">
          {{ item.proTitle }}
        </div>
        <div class="col">
          {{ item.nameKeyword }}
        </div>
        <div class="col">
          {{ item.updateDate | dataFormat }}
        </div>
      </div>
    </div>
    <hr />
  </div>
</template>

<script>
import { dbFirestore } from "boot/firebase";
import { date } from "quasar";

export default {
  name: "",
  data() {
    return {
      data_list: [],
      data_list100: [],
      currentPage: 1, //開始顯示第一頁
      pageNum: 500, //每頁顯示數量
      perPageNum: 15, //每頁顯示數量
      lastDoc: "", //第一次要用空字串
      serial: 0,
      nameLike: "",
    };
  },
  components: {},
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    checkDataType() {
      dbFirestore
        .collection("現場紀錄表")
        // .limit(1000)
        .where("nameKeyword", "array-contains", "劉勇威")
        .get()
        .then((qs) => {
          qs.forEach((doc) => {
            let x =  doc.data()
            // if (typeof doc.data().star === "string") {
              console.log(doc.id, x.name,x.star, x );
               // 這筆資料star = NAN ，不僅顯示錯誤還無法編輯 isNaN(x.star)
          });
        });
    },
    //搜尋名字keyword陣列
    async nameLikeSearch() {
      console.log(this.nameLike);
      const snapshot = await dbFirestore
        .collection("現場紀錄表")
        .where("nameKeyword", "array-contains", this.nameLike)
        .get()
        .then((qs) => {
          console.log(qs.size, qs.empty);
          qs.forEach((doc) => {
            console.log(doc.id, doc.data().name);
          });
        });
    },
    Paginate() {
      return new Promise((resolve, reject) => {
        const perPageData = [];
        const query = dbFirestore.collection("現場紀錄表");
        const snapshot = query
          .orderBy("updateDate", "desc")
          .startAfter(this.lastDoc) // updateDate 的值，一開始為空白
          .limit(this.pageNum) //每次捲動數量
          .get();
        snapshot.then((qs) => {
          qs.forEach((doc) => {
            let x = doc.data();
            x.id = doc.id;
            x.nameKeyword = this.nameSplit(x.name);
            perPageData.push(x);
            this.lastDoc = x.updateDate; //這次查詢最後一筆 updateDate值
          });
          resolve(perPageData); // 這邊需要傳回
        });
      });
    },
    //每次回傳 this.pageNum 的筆數
    async load10() {
      this.data_list = await this.Paginate();
      var batch = dbFirestore.batch();
      this.data_list.forEach((item) => {
        console.log(item.id, { nameKeyword: item.nameKeyword });
        const ref = dbFirestore.collection("現場紀錄表").doc(item.id);
        batch.update(ref, { nameKeyword: item.nameKeyword });
      });

      // 批量寫入
      //   batch.commit().then(() => {
      //     console.log("資料庫批量寫入成功");
      //   });
    },
    //印出100筆比對
    load100() {
      const query = dbFirestore.collection("現場紀錄表");
      const snapshot = query.orderBy("updateDate", "desc").limit(100).get();
      snapshot.then((qs) => {
        qs.forEach((doc) => {
          let x = doc.data();
          this.data_list100.push(x);
        });
      });
      this.data_list100.forEach((x, i) => {
        console.log(i, x.name, x.nameKeyword || "");
      });
    },

    //姓名拆分
    nameSplit(name) {
      let len = name.length;
      let keyword = [];
      name = name.toLowerCase().replace(/[\s*]/g, "");

      for (let i = 0; i < len; i++) {
        generateKeyWords(name);
        name = name.substr(1).toLowerCase().replace(/[\s*]/g, "");
        // console.log(name) //謝孟良、孟良、良
      }
      //   console.log(keyword);
      return keyword;

      //組成星狀的keyword
      function generateKeyWords(name) {
        let nameArr = Array.from(name); //字串轉陣列
        let nameLength = name.length;
        for (let j = 0; j < nameLength; j++) {
          let str = "";
          for (let i = 0; i <= j; i++) {
            str += nameArr[i];
          }
          //   console.log(str);
          keyword.push(str);
        }
      }
    },
    async test_Log() {
      let i = 0;
      const qs = await dbFirestore.collection("log").get();
      let NumPage = 15;
      let Tcount = qs.size;
      let totalPage = Math.ceil(Tcount / NumPage);
      let lastDoc = "";

      for (let page = 0; page < totalPage; page++) {
        console.log(page);
        await dbFirestore
          .collection("log")
          .orderBy("date", "desc")
          .startAfter(lastDoc)
          .limit(NumPage)
          .get()
          .then((qs) => {
            qs.forEach((doc) => {
              let x = doc.data();
              console.log(
                ++i,
                date.formatDate(x.date.toDate(), "YYYY-MM-DD HH:mm:ss")
              );
              lastDoc = x.date; //這次查詢最後一筆 date值
            });
          });
      }
    },
    //資料庫加入搜尋關鍵字（螢幕console）
    async show_keyword() {
      let i = 0;
      const qs = await dbFirestore.collection("現場紀錄表").get();
      let perPageNum = 500;
      let Tcount = qs.size;
      let totalPage = Math.ceil(Tcount / perPageNum);
      let lastDoc = "";

      for (let page = 0; page < totalPage; page++) {
        console.log(page);
        await dbFirestore
          .collection("現場紀錄表")
          .orderBy("updateDate", "desc")
          .startAfter(lastDoc)
          .limit(perPageNum)
          .get()
          .then((qs) => {
            qs.forEach((doc) => {
              let x = doc.data();
              console.log(
                ++i,
                x.name,
                this.nameSplit(x.name),
                date.formatDate(x.updateDate.toDate(), "YYYY-MM-DD HH:mm:ss")
              );
              lastDoc = x.updateDate; //這次查詢最後一筆 date值
            });
          });
      }
    },

    // log資料用遞迴方式分頁印到尾端
    async Recursive_Log(lastDoc = "") {
      if (lastDoc === "") {
        this.serial = 0;
        this.perPageNum = 15;
      }
      // if (lastDoc === false) return;
      let rd = await this.rd(lastDoc);
      lastDoc = rd.lastDoc;
      let dbData = rd.dbData;
      if (lastDoc === false) return; //放在這個位置才對
      console.log(lastDoc, dbData);
      this.Recursive_Log(lastDoc);
    },
    rd(lastDoc) {
      return new Promise((resolve) => {
        let dbData = [];
        dbFirestore
          .collection("log")
          .orderBy("date", "desc")
          .startAfter(lastDoc)
          .limit(this.perPageNum)
          .get()
          .then((qs) => {
            if (qs.empty) {
              resolve({ lastDoc: false });
            }
            qs.forEach((doc) => {
              let x = doc.data();
              console.log(
                ++this.serial,
                date.formatDate(x.date.toDate(), "YYYY-MM-DD HH:mm:ss")
              );
              dbData.push({ ...x, id: doc.id });
              lastDoc = x.date; //這次查詢最後一筆 date值
            });
            let r = {
              dbData: dbData,
              lastDoc: lastDoc,
            };
            resolve(r);
          });
      });
    },
    // 現場紀錄資料用遞迴方式分頁印到尾端
    async Recursive_fieldRecord(lastDoc = "") {
      if (lastDoc === "") {
        this.serial = 0;
        this.perPageNum = 500; //每次讀取數量
      }
      let rd = await this.dbFieldRecord_read(lastDoc);
      lastDoc = rd.lastDoc;
      let dbData = rd.dbData;
      if (lastDoc === false) return;
      this.Recursive_fieldRecord(lastDoc);
    },
    //資料庫分頁讀取
    dbFieldRecord_read(lastDoc) {
      return new Promise((resolve) => {
        let dbData = [];
        dbFirestore
          .collection("現場紀錄表")
          .orderBy("updateDate", "desc")
          .startAfter(lastDoc)
          .limit(this.perPageNum)
          .get()
          .then((qs) => {
            if (qs.empty) {
              resolve({ lastDoc: false });
            }
            qs.forEach((doc) => {
              let x = doc.data();
              x.id = doc.id;
              ++this.serial;
              // console.log(
              //   this.serial,
              //   x.id,
              //   x.name,
              //   date.formatDate(x.updateDate.toDate(), "YYYY-MM-DD HH:mm:ss")
              // );
              dbData.push({ ...x, id: doc.id });
              lastDoc = x.updateDate; //這次查詢最後一筆 date值
            });
            let r = {
              dbData: dbData,
              lastDoc: lastDoc,
            };
            resolve(r);
          });
      });
    },
    //分頁寫入收尋名字關鍵字
    dbFieldRecord_batch_write(dbData) {
      return new Promise((resolve) => {
        // 設定批量
        var batch = dbFirestore.batch();
        dbData.forEach((x) => {
          let data = {
            nameKeyword: this.nameSplit(x.name),
          };
          console.log(x.id, data.nameKeyword);
          let ref = dbFirestore.collection("現場紀錄表").doc(x.id);
          batch.update(ref, data);
        });
        // 批量寫入
        batch.commit().then(() => {
          console.log("資料庫批量寫入成功", this.serial);
          resolve(true);
        });
      });
    },
    //加入搜尋關鍵字（寫入資料庫）
    async write_keyword100(lastDoc = "") {
      if (lastDoc === "") {
        //第一次遞迴，設定初值
        this.serial = 0;
        this.perPageNum = 500; //每次讀取數量
      }
      let rd = await this.dbFieldRecord_read(lastDoc);
      lastDoc = rd.lastDoc;
      let dbData = rd.dbData;
      // if (this.serial >= 10) return; //先測試100筆
      // 沒有資料，跳開遞迴
      if (lastDoc === false) return;
      // 寫入資料庫
      await this.dbFieldRecord_batch_write(dbData);
      // 確定寫完，繼續遞迴
      this.write_keyword100(lastDoc);
    },
  },
  filters: {
    dataFormat(value) {
      return date.formatDate(value.toDate(), "YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style>
</style>
