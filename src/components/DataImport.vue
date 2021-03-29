<template>
  <div>
    <section>
      <!-- <div class="h5">Excel檔匯入</div> -->
      <!-- <input type="file" @change="onChange" /> -->
      <div class="q-pa-md text-h6 text-black" style="max-width: 300px">
        <div class="q-gutter-md text-h6 text-black">
          <q-file
            v-model="file"
            label="選擇匯入的 Excel 檔案"
            @change="onChange"
          />
        </div>
      </div>
      <xlsx-read :file="file">
        <xlsx-sheets>
          <template #default="{ sheets }">
            <div class="q-pa-md" v-if="file">
              <span class="q-pr-md text-subtitle1 text-black">選擇活頁簿</span>
              <select v-model="selectedSheet" class="text-subtitle1 text-black">
                <option v-for="sheet in sheets" :key="sheet" :value="sheet">
                  {{ sheet }}
                </option>
              </select>
            </div>
          </template>
        </xlsx-sheets>

        <!-- <xlsx-table :sheet="selectedSheet" /> -->
        <!-- 會用 html table 顯示xlsx的資料-->

        <div class="q-pa-md q-gutter-sm text-black" v-if="file">
          <!-- <q-btn
            label="匯入資料預覽"
            @click="table_dialog = true"
            v-if="selectedSheet"
          /> -->

          <q-dialog
            v-model="table_dialog"
            persistent
            :maximized="true"
            transition-show="slide-up"
            transition-hide="slide-down"
          >
            <q-card class="">
              <q-bar>
                <q-space />
                <q-btn dense flat icon="close" v-close-popup>
                  <q-tooltip content-class="bg-white text-primary"
                    >Close</q-tooltip
                  >
                </q-btn>
              </q-bar>

              <q-card-section class="q-pt-none">
                <!-- html table 顯示 -->
                <xlsx-table :sheet="selectedSheet" />
              </q-card-section>

              <q-bar>
                <q-space />
                <q-btn dense flat icon="close" v-close-popup> </q-btn>
              </q-bar>
            </q-card>
          </q-dialog>
        </div>

        <xlsx-json :sheet="selectedSheet" @parsed="returnCollection">
          <!-- <template #default="{ collection }"> -->
          <!-- 會用 json 顯示xlsx的資料-->
          <!-- <div> {{ collection }} </div> -->
          <!-- </template>  -->
        </xlsx-json>
      </xlsx-read>

      <q-dialog
        v-model="DuplicateDialog"
        persistent
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card class="" style="max-height: 70vh; max-width: 70vw">
          <q-bar>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>
          <div
            class="full-width column text-black bg-grey-4"
            v-if="isOk"
            @click="importFun"
          >
            <q-btn class="text-h6 text-positive" label="匯 入" v-close-popup/>
          </div>

          <q-card-section v-if="Duplicate.length > 0">
            <div class="text-h6">
              資料庫中名字重複的資料<span class="text-caption"
                >(勾選確定新增會有兩筆同名字的資料)</span
              >
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <!-- 顯示重複資料 -->
            <q-list bordered separator>
              <!-- <q-infinite-scroll @load="loadMore" :offset="10"> -->

              <q-item
                clickable
                v-ripple
                v-for="(item, key) in Duplicate"
                :key="key"
              >
                <q-item-section>
                  <q-item-label
                    >{{ item.name
                    }}<span class="q-ml-xl text-caption text-grey-8"
                      >新增<input
                        id="add"
                        :name="`${item.name}`"
                        type="radio"
                        @click="item.add = true"
                    /></span>
                    <span class="q-ml-xl text-caption text-grey-8"
                      >更新<input
                        id="update"
                        :name="`${item.name}`"
                        type="radio"
                        @click="item.update = true"
                    /></span>
                    <span class="q-ml-xl text-caption text-grey-8"
                      >不匯入<input
                        id="cancel"
                        :name="`${item.name}`"
                        type="radio"
                        checked
                        @click="
                          item.update = false;
                          item.add = false;
                        "
                    /></span>
                  </q-item-label>
                  <q-item-label caption lines="4">
                    <table width="100%">
                      <tr>
                        <td align="center">(資料庫中)</td>
                        <td align="center">(新匯入)</td>
                      </tr>
                      <tr>
                        <td>{{ item.db.proTitle }}</td>
                        <td>{{ item.import.proTitle }}</td>
                      </tr>
                      <tr>
                        <td>{{ item.db.mobilePhone }}</td>
                        <td>{{ item.import.mobilePhone }}</td>
                      </tr>
                      <tr>
                        <td>{{ item.db.address }}</td>
                        <td>{{ item.import.address }}</td>
                      </tr>
                    </table>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-section v-if="NoDuplicate.length > 0">
            <div class="text-h6">要新增匯入的資料</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-list bordered separator>
              <q-item
                clickable
                v-ripple
                v-for="(item, key) in NoDuplicate"
                :key="key"
              >
                <q-item-section>
                  <q-item-label
                    >{{ item.add_data.name }}
                    <span class="q-ml-xl text-caption text-grey-8"
                      >匯入<input
                        id="add"
                        :name="`${item.add_data.name}`"
                        type="radio"
                        checked
                        @click="item.add = true"
                    /></span>
                    <span class="q-ml-xl text-caption text-grey-8"
                      >不匯入<input
                        id="cancel"
                        :name="`${item.add_data.name}`"
                        type="radio"
                        @click="item.add = false" /></span
                  ></q-item-label>
                  <q-item-label caption lines="3">
                    {{ item.add_data.proTitle }}<br />
                    {{ item.add_data.mobilePhone }}<br />
                    {{ item.add_data.address }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <div
            class="full-width column text-black bg-grey-4"
            v-if="isOk"
            @click="importFun"
          >
            <q-btn class="text-h6 text-positive" label="匯 入" v-close-popup/>
          </div>

          <q-bar>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup> </q-btn>
          </q-bar>
        </q-card>
      </q-dialog>
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
} from "vue-xlsx/dist/vue-xlsx.es";
import { dbFirestore } from "boot/firebase";
import Vue from "vue";
import { date, Loading } from "quasar";
import { showErrorMessage } from "src/utils/function-show-error-message";

export default {
  name: "DataImportAdd",
  data() {
    return {
      file: null,
      selectedSheet: "工作表一",
      sheetName: null,
      sheets: [{ name: "", data: [{ c: 2 }] }],
      collection: [{ a: 1, b: 2 }],
      sheet: "",
      table_dialog: false,

      dbData: null, //資料庫所有人員名單
      // addData: [],
      // updateData: [],
      DuplicateDialog: false,
      Duplicate: [],
      NoDuplicate: [],
      // Match: [],
      isOk: false,
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
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    onChange(event) {
      this.file = event.target.files ? event.target.files[0] : null;
      console.log(this.file);
    },
    reset() {
      this.file = null;
      this.table_dialog = false;
    },
    //========================= 選取工作表後，回傳 json資料 =====================================
    async returnCollection(collection_json) {
      this.Duplicate = [];
      this.NoDuplicate = [];

      Loading.show();
      this.dbData = await this.readDbData();
      Loading.hide();
      // console.log(this.selectedSheet); //工作表名稱
      // console.log(collection_json); //匯入的json
      if (collection_json.length > 1000) {
        showErrorMessage(
          "匯入資料超過1000筆，未免系統運作緩慢，請拆分成數個Excel檔後再匯入！"
        );
        this.reset();
        return false;
      }

      // 檢查欄位
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
        "等級",
        "註記",
        "資料更新日期",
      ];
      for (let key in collection_json[0]) {
        if (!title.includes(key)) {
          showErrorMessage("欄位名稱【 " + key + " 】不符！");
          this.reset();
          return false;
        }
      }
      // 遍歷匯入資料
      collection_json.forEach((x) => {
        if (!x.姓名) {
          showErrorMessage("姓名不能空白");
          this.reset();
          return false;
        }
        //初始資料，先都設成""，方便判斷全部欄位
        let data = {
          name: x.姓名.trim(),
          mobilePhone: x.手機 || "",
          companyPhone: x.公司電話 || "",
          county: x.縣市 || "",
          district: x.區域 || "",
          address: x.地址 || "",
          email: x.Email || "",
          classify: x.分類 || "",
          proTitle: x.職業職稱 || "",
          clubTitle: x.社團職稱 || "",
          personalConnections: x.人脈關係 || "",
          meetNotes: x.見面記事 || "",
          suggestions: x.建言事項 || "",
          petitionMatters: x.陳情事項 || "",
          diet: x.飲食 || "",
          interest: x.興趣 || "",
          topic: x.話題 || "",
          other: x.其他 || "",
          star: x.等級 || "",
          RedDot: x.註記 || "",
          // star: parseInt(x.等級) || 0,
          // RedDot: x.註記 === "●" ? true : false,
        };

        // 增加空白的欄位（屬性），資料庫「新增」時使用
        let data_add = {
          name: "",
          mobilePhone: "",
          companyPhone: "",
          avatar: "",
          photo: [],
          county: "",
          district: "",
          zip: "",
          address: "",
          email: "",
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
          updateDate: new Date(),
        };
        for (const key in data) {
          if (data[key] !== "") {
            data_add[key] = data[key];
            //匯入資料有值時，再轉換型態
            data_add.RedDot = data_add.RedDot === "●" ? true : false;
            data_add.star = parseInt(data_add.star);
          }
        }
        // console.log("add_data", data_add);
        // 新增資料array
        // this.addData.push(data_add);

        //過濾掉空白的欄位（屬性），資料庫「更新」時使用
        let data_update = {};
        for (const key in data) {
          if (data[key] !== "") {
            data_update[key] = data[key];
            data_update.RedDot = data_update.RedDot === "●" ? true : false;
            if (data_update.star > 0) {
              data_update.star = parseInt(data_update.star);
            }
          }
        }
        data_update.updateDate = new Date(); //加上更新時間

        // console.log("update_data", data_update);
        //更新資料array
        // this.updateData.push(data_update);

        // 開始比對資料
        // 這邊用data_add的資料
        let match = this.SearchName(data_add.name, this.dbData);
        let aMatch = Object.values(match)[0]; //取出物件
        let aKey = Object.keys(match)[0];
        // console.log(aMatch)
        if (aMatch) {
          //重複
          // console.log("新增", data);
          // console.log("資料庫中", aMatch);
          let dup = {
            name: data_add.name,
            db: {
              mobilePhone: aMatch.mobilePhone,
              address: aMatch.address,
              proTitle: aMatch.proTitle,
            },
            import: {
              mobilePhone: data_add.mobilePhone,
              address: data_add.address,
              proTitle: data_add.proTitle,
            },
            id: aKey,
            add_data: data_add,
            update_data: data_update,
            Duplicate: true,
            add: false,
            update: false,
          };
          // console.log(dup);

          this.Duplicate.push(dup);
        }
        //沒有重複的部分，新增匯入
        else {
          let noDup = {
            add: true,
            add_data: data_add,
          };
          this.NoDuplicate.push(noDup);
        }
      });
      this.DuplicateDialog = true;
      this.isOk = true;
    },

    //讀取資料庫所有人員名單
    readDbData() {
      return new Promise((resolve, reject) => {
        let dbData = {};
        dbFirestore
          .collection("現場紀錄表")
          .get()
          .then((qs) => {
            qs.forEach((doc) => {
              // console.log(doc.data().name);
              Vue.set(dbData, doc.id, doc.data());
            });
            // console.log(dbData);
            resolve(dbData); // 這邊需要傳回
          })
          .catch((err) => {
            console.log("讀取資料錯誤！", err.message);
            reject(false);
          });
      });
    },
    //搜尋名字
    SearchName(name, data) {
      let match = {};
      Object.keys(data).forEach((key) => {
        if (data[key]["name"].includes(name)) {
          // ++this.i
          // console.log(data[key]["name"], date.formatDate(data[key]["updateDate"].toDate(), 'YYYY-MM-DD HH:mm:ss'));
          Vue.set(match, key, data[key]); //符合條件的存在物件中
        }
      });
      // console.log(match);
      return match;
    },
    //======================================================= 匯入資料================================================
    importFun() {
      // console.log(this.Duplicate);
      // console.log(this.NoDuplicate);
      // 設定批量
      var batch = dbFirestore.batch();
      //==============重複資料=============
      this.Duplicate.forEach((item) => {
        // -----新增------
        if (item.add) {
          console.log("新增", item.add_data);
          let ref = dbFirestore.collection("現場紀錄表").doc();
          batch.set(ref, item.add_data);
        }
        //------更新-----
        if (item.update) {
          console.log("更新", item.id, item.update_data);
          let ref = dbFirestore.collection("現場紀錄表").doc(item.id);
          batch.update(ref, item.update_data);
        }
      });
      //===============不重複資料================

      this.NoDuplicate.forEach((item) => {
        if (item.add) {
          console.log("不重複", item.add_data);
          let ref = dbFirestore.collection("現場紀錄表").doc();
          batch.set(ref, item.add_data);
        }
      });
      // 批量寫入
      batch.commit().then(() => {
        console.log("資料庫批量寫入成功");
        showErrorMessage("資料庫批量匯入成功")

      });
    },
  }, // end methods
};
</script>

<style scope>
table {
  border-collapse: collapse;
  /* border: 3px #cccccc solid; */
}
td {
  border-collapse: collapse;
  border: 1px #cccccc solid;
}
</style>
