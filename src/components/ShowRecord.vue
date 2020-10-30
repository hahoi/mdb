<template>
  <div>
     <q-card>
        <q-card-section class="">
          <div class="full-width column">
            <q-btn class="text-h6" label="匯 出" @click="exportFun" />
          </div>
          <search />
          <!-- <q-scroll-area class="q-scroll-area-tasks">   -->
          <q-list bordered separator>
            <q-infinite-scroll @load="loadMore" :offset="10">
              <data-bank-list-item
                v-for="(task, key) in showingData"
                :key="key"
                :task="task"
                :id="key"
              ></data-bank-list-item>
              <template
                v-slot:loading
                v-if="this.actualMaxPosition < this.FindRecordLength"
              >
                <div class="row justify-center q-my-md">
                  {{ actualMaxPosition }} / {{ FindRecordLength }}
                </div>
                <div class="row justify-center">
                  <q-spinner-dots color="primary" size="40px" />
                </div>
              </template>
            </q-infinite-scroll>
          </q-list>
          <!-- </q-scroll-area> -->
        </q-card-section>
      </q-card>
  </div>
</template>

<script>
import Vue from "vue";
import { date, exportFile } from "quasar";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { showErrorMessage } from "src/utils/function-show-error-message";

export default {
  name: "",
  data() {
    return {
      dialogAdd: false,
      tasks: [],
      actualMaxPosition: 10,
      timer: null,
      index: 1,
    };
  },
  components: {
    search: require("components/Search.vue").default,
    sort: require("components/Sort.vue").default,
    DataBankListItem: require("components/DataBankListItem.vue").default,
  },
  created() {},
  mounted() {
    // this.readProfessionalTitle();
  },
  watch: {},
  computed: {
    ...mapState("LoadData", ["FieldReord", "tasksDownloaded"]),
    ...mapGetters("LoadData", ["FieldReordFiltered", "FindRecordLength"]),
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
      // console.log("showTasks",showTasks);
      return showTasks;
    },
  },
  methods: {
    ...mapMutations("LoadData", ["setCurrentId"]),
    ...mapActions("LoadData", [""]),
    ...mapActions("phrase", ["readProfessionalTitle"]),

    loadMore(index, done) {
      //   console.log("index", index);
      this.timer = setTimeout(() => {
        this.actualMaxPosition += 9;
        done();
      }, 50);
    },
    done() {
      // clearTimeout(this.timer);
    },
    exportFun() {
      let timeStamp = Date.now();
      let fileName = "MDB" + date.formatDate(timeStamp, "YYYYMMDDHHmmss");
      // console.log(formattedString);
      // console.log(this.FieldReordFiltered);
      let title = [
        "姓名",
        "手機",
        "公司電話",
        "縣市",
        "區域",
        "地址",
        "Email",
        "分類",
        "職業職稱",
        "社團職稱",
        "人脈關係",
        "見面記事",
        "建言事項",
        "陳情事項",
        "飲食",
        "興趣",
        "話題",
        "其他",
        "星級",
        "紅點",
      ];

      let data = {
        name: "",
        mobilePhone: "",
        companyPhone: "",
        county: "",
        district: "",
        address: "",
        email:"",
        classify: "",
        proTitle: "",
        clubTitle: "",
        personalConnections: "",
        meetNotes: "",
        suggestions: "",
        petitionMatters: "",
        diet: "",
        interest: "",
        topic: "",
        other: "",
        star: 0,
        RedDot: false,
      };
      let rawData = "";
      //   let html = '`<html xmlns:o="urn:schemas-microsoft-com:office:office"'
      // html += 'xmlns:x="urn:schemas-microsoft-com:office:excel"'
      // html += 'xmlns="http://www.w3.org/TR/REC-html40">'
      // html += '<head></head><body>'

      // let tr = "<table id='tblData' ref='tblData' border='1'>";
      //     tr +="<thead><tr><th>姓名</th><th>手機</th><th>公司電話</th><th>縣市</th><th>區域</th><th>地址</th><th>分類</th><th>職業職稱</th><th>社團職稱</th><th>人脈關係</th><th>見面記事</th><th>建言事項</th><th>陳情事項</th><th>飲食</th><th>興趣</th><th>話題</th><th>其他</th><th>星級</th><th>紅點</th></tr></thead>"

      rawData += `姓名,手機,公司電話,縣市,區域,地址,Email,分類,職業職稱,社團職稱,人脈關係,見面記事,建言事項,陳情事項,飲食,興趣,話題,其他,星級,紅點\r\n`;

      Object.keys(this.FieldReordFiltered).forEach((key) => {
        let x = this.FieldReordFiltered[key];

        let RedDot = x.RedDot ? "●" : "";
        let star = x.star + "星";

        rawData += `${x.name},${x.mobilePhone},${x.companyPhone},${x.county},${
          x.district
        },${x.address},${x.email},${x.classify},${x.proTitle},${x.clubTitle},${
          x.personalConnections
        },${x.meetNotes.replace(/\n/g, "")},${x.suggestions.replace(
          /\n/g,
          ""
        )},${x.petitionMatters.replace(/\n/g, "")},${x.diet},${x.interest},${
          x.topic
        },${x.other},${star},${RedDot}\r\n`;
      });

      //   tr += `<tr><td>${x.name}</td><td>${x.mobilePhone}</td><td>${
      //     x.companyPhone
      //   }</td><td>${x.county}</td><td>${x.district}</td><td>${
      //     x.address
      //   }</td><td>${x.classify}</td><td>${x.proTitle}</td><td>${x.clubTitle}</td><td>${
      //     x.personalConnections
      //   }</td><td>${x.meetNotes.replace(
      //     /\n/g,
      //     ""
      //   )}</td><td>${x.suggestions.replace(
      //     /\n/g,
      //     ""
      //   )}</td><td>${x.petitionMatters.replace(/\n/g, "")}</td><td>${
      //     x.diet
      //   }</td><td>${x.interest}</td><td>${x.topic}</td><td>${
      //     x.other
      //   }</td><td>${star}</td><td>${RedDot}</td></tr>`;
      // });
      // tr += "</table>";
      // html += tr
      // html += '</body></html>'

      //匯出excel檔案
      // console.log(html);
      // this.exportTableToExcel(html, fileName)

      //匯出csv 檔案
      const csvfileName = fileName + ".csv";
      const mimeType = "data:text/csv; charset=utf-8,";
      const universalBOM = "\uFEFF";
      const csvString = universalBOM + rawData;
      const status = exportFile(csvfileName, csvString, mimeType);

      if (status === true) {
        showErrorMessage(`匯出 ${csvfileName} 完成`, "提醒");
        this.menuDialog = false;
      } else {
        showErrorMessage("匯出檔案失敗" + status);
      }
    },

    // exportTableToExcel(tableHTML, filename = "") {
    //   var downloadLink;
    //   var dataType = "application/vnd.ms-excel";

    //   tableHTML = tableHTML.replace(/ /g, "%20");
    //   // Specify file name
    //   filename = filename ? filename + ".xls" : "excel_data.xls";

    //   // Create download link element
    //   downloadLink = document.createElement("a");

    //   document.body.appendChild(downloadLink);

    //   if (navigator.msSaveOrOpenBlob) {
    //     var blob = new Blob(["\ufeff", tableHTML], {
    //       type: dataType,
    //     });
    //     navigator.msSaveOrOpenBlob(blob, filename);
    //   } else {
    //     // Create a link to the file
    //     downloadLink.href = "data:" + dataType + ", " + tableHTML;

    //     // Setting the file name
    //     downloadLink.download = filename;

    //     //triggering the function
    //     downloadLink.click();
    //   }
    // },
  }, //methods
};
</script>

<style>
/* .q-scroll-area-tasks {
  display: flex;
  flex-grow: 1;
} */
</style>
