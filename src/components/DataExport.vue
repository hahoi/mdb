<template>
  <div>
    <!-- <section v-if="$q.platform.is.desktop"> -->
      <xlsx-workbook>
        <xlsx-sheet :collection="exportData" sheet-name="工作表一" />
        <xlsx-download :filename="exportFilename">
          <div class="full-width column">
            <q-btn class="text-h6" label="匯 出" @click="exportDataFun" />
          </div>
        </xlsx-download>
      </xlsx-workbook>
    <!-- </section> -->
  </div>
</template>

<script>
import {
  XlsxRead,
  XlsxTable,
  XlsxSheets,
  XlsxJson,
  XlsxWorkbook,
  XlsxSheet,
  XlsxDownload,
} from "../../node_modules/vue-xlsx/dist/vue-xlsx.es.js";

import { date } from "quasar";
import { mapState, mapGetters } from "vuex";
import { dbFirestore } from "boot/firebase";

export default {
  name: "DataExport",
  data() {
    return {
      exportData: [{}], //加上v-if 確保有資料，再顯示
      exportFilename: "mobileDataBank.xlsx",
    };
  },
  components: {
    XlsxRead,
    XlsxTable,
    XlsxSheets,
    XlsxJson,
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload,
  },
  created() {},
  mounted() {
    // this.exportDataFun();
  },
  watch: {},
  computed: {
    ...mapState("LoadData", [
      "FieldReord",
      "tasksDownloaded",
      "FieldRecordTotalCount",
    ]),
    ...mapGetters("LoadData", ["FieldReordFiltered", "FindRecordLength"]),
  },
  methods: {
    // 整理匯出excel的資料
    // [{ "姓名".name, "手機":mobilePhone .......}]
    async exportDataFun() {
      //錯誤 this.exportData = [{}]; 匯出會多一空白紀錄， 錯誤 this.exportData = [] 出現型態錯誤
      /*
      this.exportData[0] type 型態為object [{}] 
      清空設為 this.exportData = [] ，出現 type error
          設為 this.exportData = [{}]， 匯出會多一空白紀錄
          設為 this.exportData.length = 0 ， 會出現 Error in callback for watcher "readyToParse": "TypeError: lib[type] is not a function"
      解決辦法：
      F:\www\Quasar\MDB123\node_modules\vue-xlsx\dist\components\XlsxSheet.js 
      parseCollection(collection) {     加上判斷 undefined，因非同步，尚未取得資料，而造成問題
        if(!collection[0]) {return}    
      2021/04/03 更新
      因為之前都是在 mounted() 中就執行 this.exportDataFun()，資料尚未取得，故會出錯，改click執行後，就沒上述問題。
      */

      //  判斷設備
      if (this.$q.platform.is.mobile) {
        // console.log("mobile")
        this.$q
          .dialog({
            title: "提示",
            message: "請在電腦上操作匯入匯出。",
            // persistent: true,
          })
          .onOk(() => {
          })
      }
      if (this.$q.platform.is.desktop) {
        // console.log("desktop")
      }
      this.exportData.length = 0; //正確

      if (this.FindRecordLength < 3000) {
        Object.keys(this.FieldReordFiltered).forEach((key) => {
          let x = this.FieldReordFiltered[key];
          let data = {
            姓名: x.name,
            手機: x.mobilePhone,
            公司電話: x.companyPhone,
            縣市: x.county,
            區域: x.district,
            地址: x.address,
            Email: x.email,
            分類: x.classify,
            職業職稱: x.proTitle,
            社團職稱: x.clubTitle,
            人脈關係: x.personalConnections,
            見面記事: x.meetNotes,
            建言事項: x.suggestions,
            陳情事項: x.petitionMatters,
            飲食: x.diet,
            興趣: x.interest,
            話題: x.topic,
            其他: x.other,
            等級: x.star,
            註記: x.RedDot ? "●" : "",
            資料更新日期: date.formatDate(x.updateDate.toDate(), "YYYY-MM-DD"),
          };
          // console.log(data)
          this.exportData.push(data);
        });
      } else {
        await dbFirestore
          .collection("現場紀錄表")
          .get()
          .then((qs) => {
            qs.forEach((doc) => {
              let x = doc.data();
              let key = doc.id;
              let data = {
                姓名: x.name,
                手機: x.mobilePhone,
                公司電話: x.companyPhone,
                縣市: x.county,
                區域: x.district,
                地址: x.address,
                Email: x.email,
                分類: x.classify,
                職業職稱: x.proTitle,
                社團職稱: x.clubTitle,
                人脈關係: x.personalConnections,
                見面記事: x.meetNotes,
                建言事項: x.suggestions,
                陳情事項: x.petitionMatters,
                飲食: x.diet,
                興趣: x.interest,
                話題: x.topic,
                其他: x.other,
                等級: x.star,
                註記: x.RedDot ? "●" : "",
                資料更新日期: date.formatDate(
                  x.updateDate.toDate(),
                  "YYYY-MM-DD"
                ),
              };
              // console.log(data)
              this.exportData.push(data);
            });
          });
      }
    },
  },
};
</script>

<style>
</style>
