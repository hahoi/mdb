<template>
  <div class="q-ma-md">
    <q-btn label="資料庫分頁測試loadMore" @click="Paginate()" />

    <q-btn label="資料庫計算筆數console" @click="countRecord" />
    <q-btn label="從記錄讀取筆數console" @click="dbRecordCount" />
    <hr />
    <!-- {{ list_Data }}
    <div v-for="item in Paginate_Data" :key="item.id">
      {{ item }}
    </div> -->

    <!-- <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="currentPage"
        color="purple"
        :max="Math.ceil(list_Data.length / pageNum)"
        :max-pages="6"
        :boundary-numbers="true"
      >
      </q-pagination>
    </div> -->
    <hr />
    <q-infinite-scroll @load="loadMore2" :offset="10">
      <div v-for="(item, index) in showingData" :key="index">
        <div class="row">
          <div class="col">
            {{ item.name }}
          </div>
          <div class="col">
            {{ item.proTitle }}
          </div>
          <div class="col">
            {{ item.mobilePhone }}
          </div>
          <div class="col ellipsis">
            {{ item.updateDate | dataFormat }}
          </div>
        </div>
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <hr />
    <!-- <q-infinite-scroll @load="loadMore" :offset="10">
      <div v-for="(item, index) in showingDataArray" :key="index">
        <div class="row">
          <div class="col">
            {{ item.date }}
          </div>
          <div class="col">
            {{ item.name }}
          </div>
          <div class="col">
            {{ item.do }}
          </div>
          <div class="col ellipsis">
            {{ item.data }}
          </div>
        </div>
      </div>
      <template v-slot:loading v-if="actualMaxPosition < logData.length">
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll> -->
  </div>
</template>

<script>
import Vue from "vue";
import { dbFirestore } from "boot/firebase";
import { date } from "quasar";
export default {
  name: "",
  data() {
    return {
      logData: [],
      logDataMore: [],
      lastDoc: "", //第一次要用空字串
      actualMaxPosition: 10,
      showingDataArray: [],

      currentPage: 1, //開始顯示第一頁
      pageNum: 10, //每頁顯示數量
      list_Data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    };
  },
  components: {},
  created() {
    // dbFirestore
    //   .collection("log")
    //   .orderBy("date", "desc")
    //   .limit(1000)
    //   .get()
    //   .then((qs) => {
    //     qs.forEach((doc) => {
    //       // console.log(doc.data().name);
    //       let x = doc.data();
    //       let data = {
    //         date: date.formatDate(x.date.toDate(), "YYYY-MM-DD HH:mm:ss"),
    //         name: x.name,
    //         do: x.do,
    //         data: x.data,
    //       };
    //       this.logData.push(data);
    //     });
    //   });
  },
  mounted() {},
  watch: {},
  computed: {
    Paginate_Data() {
      let offset = (this.currentPage - 1) * this.pageNum;
      return this.list_Data.slice(offset, offset + this.pageNum);
    },
    showingData() {
      return this.logDataMore.slice(0, this.actualMaxPosition);
    },
  },

  methods: {
    async countRecord() {
      const query = dbFirestore.collection("現場紀錄表");
      const snapshot = await query.get();
      const count = snapshot.size; //計算總筆數
      console.log(count);
    },

    async loadDbMore() {
      let vm = this;
      const snapshot = await dbFirestore
        .collection("log")
        .orderBy("date", "desc")
        .startAfter(vm.lastDoc)
        .limit(10)
        .get();
      return snapshot.docs.map((doc) => {
        const x = doc.data();
        return x;
      });
    },

    loadMore(index, done) {
      if (
        this.logData.length !== 0 &&
        this.actualMaxPosition > this.logData.length
      )
        return;
      this.timer = setTimeout(() => {
        this.actualMaxPosition += 9;
        this.showingDataArray = this.logData.slice(0, this.actualMaxPosition);
        done();
      }, 500);
    },

    loadMore2(index, done) {
      this.timer = setTimeout(() => {
        this.currentPage += 1;

        this.actualMaxPosition += this.pageNum;
        this.Paginate();
        done();
      }, 500);
    },

    /*
          .collection("??").doc("??").get() //只有一筆 
          .collection("??").get()           //陣列 

          qs.docs                       //Array 符合的紀錄陣列
          qs.docs[qs.docs.length - 1]   //這次查詢最後一筆紀錄，doc
          qs.size                       //count 紀錄筆數
          qs.forEach((doc)=>{
              doc.id                      // id
            doc.data()                  // 紀錄內容
          })
      */

    Paginate() {
      //   return new Promise((resolve, reject) => {
      console.log("------1-----", this.lastDoc);
      const query = dbFirestore.collection("現場紀錄表");
      const snapshot = query
        .orderBy("updateDate", "desc")
        .startAfter(this.lastDoc)
        .limit(this.pageNum)
        .get();
      //   .orderBy("updateDate", "desc")
      //   .startAfter(this.lastDoc) // date 的值，一開始為空白
      //   .limit(this.pageNum) //每次捲動數量
      //   .get()
      snapshot.then((qs) => {
        qs.forEach((doc) => {
          let x = doc.data();
          this.logDataMore.push(x);
          this.lastDoc = x.updateDate; //這次查詢最後一筆 date值
        });

        console.log("-----2------", this.lastDoc, this.logDataMore);
      });
    },

    dbRecordCount() {
      dbFirestore
        .collection("現場紀錄表_counter")
        .doc("counter")
        .get()
        .then((doc) => {
          console.log(doc.data());
        });
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
