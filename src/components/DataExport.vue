<template>
  <div>
    <section>
      <xlsx-workbook>
        <xlsx-sheet :collection="exportData" sheet-name="工作表一" />
        <xlsx-download>
          <div class="full-width column">
            <q-btn class="text-h6" label="匯 出" />
          </div>
        </xlsx-download>
      </xlsx-workbook>
    </section>
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

export default {
  name: "DataExport",
  data() {
    return {
      exportData: [{}], //a: 1, b: 2 先設定初值避免錯誤
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
    this.exportDataFun();
  },
  watch: {},
  computed: {
    ...mapState("LoadData", ["FieldReord", "tasksDownloaded"]),
    ...mapGetters("LoadData", ["FieldReordFiltered", "FindRecordLength"]),
  },
  methods: {
    // 整理匯出excel的資料
    // [{ "姓名".name, "手機":mobilePhone .......}]
    exportDataFun() {
      this.exportData.length = 0; //先清空
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
    },
  },
};
</script>

<style>
</style>
