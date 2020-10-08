<template>
  <div>
    <q-input
      @input="
        (val) => {
          file = val[0];
        }
      "
      filled
      type="file"
      hint="請務必確認檔案格式符合匯入條件"
    />
    <q-btn @click="importFun">匯入</q-btn>
    <q-btn @click="saveToFirestore">存到資料庫</q-btn>
    <q-btn @click="likeSearch">查詢測試</q-btn>
    <q-separator />
    <q-btn @click="doPaginate">分頁</q-btn>
    <!-- {{this.writeToDbArray[1]}} -->
    {{ i }}

    <q-separator />
    <q-btn @click="readKeyFun">讀取資料庫doc Key</q-btn>
    <q-btn @click="updateFun">添加updateDate更新時間</q-btn>
  </div>
</template>

<script>
import com_fun from "src/utils/util.js";
import { dbFirestore } from "boot/firebase";
export default {
  name: "",
  data() {
    return {
      inputFileStr: "",
      file: null, // 匯入檔案object
      writeToDbArray: [],
      i: 0,
      pageSize: 100,
      dbData: [],
      dbKey: []
    };
  },
  components: {},
  created() {},
  mounted() {

  },
  watch: {},
  computed: {},
  methods: {
    readKeyFun(){
      dbFirestore
        .collection("現場紀錄表")
        .get()
        .then((qs) => {
          qs.forEach((doc) => {
            this.dbKey.push(doc.id); //只存id
          })
           console.log(this.dbKey.length)           
        })
        .catch((err) => {
          console.log(err.message);
        });
       

    },
    updateFun(){
      for(let i=0 ;  i < this.dbKey.length; i++){
            
        dbFirestore
        .collection("現場紀錄表")
        .doc(this.dbKey[i])
        .update({
          updateDate: new Date()
        })
        .then(() => {
                console.log("資料庫更新成功！",this.dbKey[i]);
            })
            .catch(error => {
                console.error("資料庫更新失敗！", error);
            });

        }
    },
    doPaginate() {
      let rt = this.paginate();
      console.log(rt);
    },
    paginate() {
      // [START paginate]
      var first = dbFirestore
        .collection("現場紀錄表")
        .orderBy("name")
        .limit(25);

      return first.get().then(function (documentSnapshots) {
        // Get the last visible document
        var lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1]; //這裡是輸出 doc
        console.log("last", lastVisible);
        // console.log("id=>",lastVisible.id ,"data=>", lastVisible.data().name);

        // Construct a new query starting at this document,
        // get the next 25 cities.
        var next = dbFirestore
          .collection("現場紀錄表")
          .orderBy("name")
          .startAfter(lastVisible)
          .limit(25);
      });
      // [END paginate]
    },

    async likeSearch() {
      await dbFirestore
        .collection("現場紀錄表")
        // .orderBy('name').startAt('謝').endAt('謝' + "\uf8ff")
        // .where("name", ">=", "謝")
        // .where("name", "<=", "謝" + "\uf8ff")
        // .orderBy('name').startAt('王振福').endAt('王振福' + "\uf8ff")
        // .where("county", ">=", "台")
        // .where("county", "<=", "台" + "\uf8ff")

        // .where("county", "==", "台北市")
        .get()
        .then((qs) => {
          console.log(qs);
          if (qs.empty) {
            console.log("查不到");
            return false;
          }
          qs.forEach((doc) => {
            // console.log(doc.data().name);
            this.dbData.push({
              id: doc.id,
              ...doc.data(),
            });
            this.i++;
          });
        })
        .catch((err) => {
          console.log(err.message);
          // this.$q.dialog({
          //     title: "錯誤",
          //     message: err.message,
          // });
        });

      let greatData = [];
      let a=0,b=0
      for (let i = 1; i <= 10; i++) {
        this.dbData.forEach((item) => {
          greatData.push(item);
          a++
        });
      }
      greatData.forEach((item) => {
        if (item.name.includes("謝")) {
          b++
          console.log(item.name);
        }
      });
      console.log(a,b)
    },

    importFun() {
      this.readFile(this.file);
    },

    readFile(selectedFile) {
      const reader = new FileReader();
      // 文件内容载入完毕之后的回调。
      reader.onload = (e) => {
        // console.log(e.target.result);
        this.inputFileStr = e.target.result;
        let inputFileArr = this.inputFileStr.split("\n").filter((x) => {
          return !x.includes("//"); //去除註解
        });

        // console.log(inputFileArr);
        let clearData = inputFileArr.filter((line) => {
          let item = line.split(",");
          return item.length === 7 && item[0] !== ""; //過濾格式不對，及 email是空白的（節點目錄）
        });

        clearData.forEach((line) => {
          // console.log(item.split(/\s+/));
          let item = line.split(",");

          let data = {
            name: item[0].trim(),
            proTitle: item[1].trim() || "",
            zip: item[2].trim() || "",
            address: item[3].trim() || "",
            mobilePhone: item[4].trim() || "",
            companyPhone: item[5].trim() || "",
            email: item[5].trim() || "",
            avatar: "",
            photo: [],
            county: item[3].trim().substring(0, 3),
            district: "",
            classify: "",
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
            update: "",
            star: 0,
          };
          this.writeToDbArray.push(data);
        });

        console.log(this.writeToDbArray);
        // writeToDbArray.forEach((item) => {
        //   this.addContact(item); //mapActions 寫入資料庫
        // });
      };
      reader.readAsText(selectedFile);
    },
    saveToFirestore() {
      this.writeToDbArray.forEach((data) => {
        // console.log(data);
        dbFirestore
          .collection("現場紀錄表")
          .add(data)
          .then((ref) => {
            console.log("資料庫新增成功！", ref.id);
          })
          .catch((error) => {
            console.error("資料庫儲存失敗！", error);
          });
      });
    },
  },
};
</script>

<style>
</style>
