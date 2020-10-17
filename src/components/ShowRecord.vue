<template>
  <div>
    <template>
      <div class="q-px-md q-mb-xl q-pb-xl absolute full-width column">
        <q-btn label="匯出" @click="exportFun" />
        <search />
        <!-- <q-scroll-area class="q-scroll-area-tasks">  //FieldReordFiltered -->
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
      </div>
    </template>

    <!-- 向上捲動 回到頂部 -->
    <!-- <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 18]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller> -->
  </div>
</template>

<script>
import Vue from "vue";
import { date , exportFile} from "quasar";
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
      }, 500);
    },
    done() {
      // clearTimeout(this.timer);
    },
    exportFun() {      
      const mimeType = "text/plain;charset=utf-8";
      let timeStamp = Date.now();
      let formattedString =
        "MDB" + date.formatDate(timeStamp, "YYYYMMDDHHmmss");
      // console.log(formattedString);
      // console.log(this.FieldReordFiltered);
      let title = [
        "姓名",
        "手機",
        "公司電話",
        "縣市",
        "區域",
        "地址",
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
        classify: "",
        proTitle: "",
        professionalTitle: "",
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
      let rawData = ""
      Object.keys(this.FieldReordFiltered).forEach((key) => {
        let x = this.FieldReordFiltered[key];
        let RedDot = x.RedDot ? "●" : ""
        let star = x.star +"星"
        rawData += `${x.name},${x.mobilePhone},${x.companyPhone},${x.county},${x.district},${x.address},${x.classify},${x.proTitle},${x.professionalTitle},${x.clubTitle},${x.personalConnections},${x.meetNotes},${x.suggestions},${x.petitionMatters},${x.diet},${x.interest},${x.topic},${x.other},${star},${RedDot}\r\n`;
      });
      console.log(rawData);

      //匯出檔案
      const txtfileName = formattedString + ".txt"
      const csvfileName = formattedString + ".csv"
      const status = exportFile(csvfileName, rawData, mimeType);

      if (status === true) {
        showErrorMessage(`匯出 ${csvfileName} 完成`, "提醒");
        this.menuDialog = false;
      } else {
        showErrorMessage("匯出檔案失敗" + status);
      }
    },
  },
};
</script>

<style>
</style>
