


<template>
  <div>
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="">
        <q-card-section>
          <q-btn @click="backup" label="備份行動資料庫資料"></q-btn>
        </q-card-section>
      </q-card>
      <q-card class="">
        <q-card-section>
          <q-input
            filled
            type="file"
            accept="application/json"
            @change="onFileChange"
          />
          </q-card-section>
            <q-card-section>
          <q-btn @click="restory" label="還原行動資料庫資料"></q-btn>
        </q-card-section>
      </q-card>
    </div>

    <!-- 
mobiledatabank照片檔copy 到本地硬碟
F:\www\copyStorage\MobileDataBank\gsutil cp -r gs://modatabank.appspot.com/現場紀錄表/ .  //後面這個.點不要忘記
// 上傳到 mobiledatabank storage
F:\www\copyStorage\MobileDataBank\gsutil cp -r 現場紀錄表 gs://modatabank.appspot.com/

上傳到PTHGDB
F:\www\copyStorage\MobileDataBank\gsutil cp -r 現場紀錄表 gs://pthgdb-9549c.appspot.com/

backup 備份行動資料庫資料，檔案格式為JSON

restory 還原行動資料庫資料，將備份的JSON檔還原

 -->
  </div>
</template>

<script>
import Vue from "vue";
import { exportFile, date, extend } from "quasar";
import { dbFirestore } from "boot/firebase";
export default {
  name: "",
  data() {
    return {
      file: null, // 匯入檔案object
      jsonData: {},
    };
  },
  components: {},
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    //資料庫備份
    backup() {
      // let temp = [];
      // let rawData = "";
      let rawJson = {};
      dbFirestore
        .collection("現場紀錄表")
        .get()
        .then((qs) => {
          qs.forEach((doc) => {
            // Object.assign(rawJson[doc.id], { ...doc.data() });
            Vue.set(rawJson, doc.id, { ...doc.data() });
          });
        })
        .then(() => {
          let newObject = extend(this.Data98, rawJson);
          let formattedString = date.formatDate(
            Date.now(),
            "YYYY-MM-DD HH:mm:ss"
          );
          // console.log(formattedString);
          const status = exportFile(
            "行動資料庫資料備份" + formattedString + ".json",
            JSON.stringify(rawJson),
            "text/plain;charset=utf-8"
          );
          if (status === true) {
            console.log("備份成功！");
          } else {
            console.log("備份失敗！");
          }
        });
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      // console.log(files[0]);
      this.readFile(files[0]);
    },
    readFile(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        //  console.log(e.target.result);
        this.jsonData = JSON.parse(e.target.result);
      };
      reader.readAsText(file);
    },

    restory() {
      // console.log(this.jsonData);
      let json = this.jsonData;
      Object.keys(json).forEach((id) => {
        let task = json[id];
        // console.log(task);
        // task.updateDate = new Date();
        dbFirestore
          .collection("現場紀錄表")
          .doc(id)
          .set(task)
          .then(() => {
            console.log("Document successfully written!");
          });
      });
    },
  }, //end methods
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
