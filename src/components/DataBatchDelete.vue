<template>
  <div class="q-pa-md text-h6 text-black" style="max-width: 300px">
    <div class="q-gutter-md text-h6 text-black">
      <div class="text-h6">選擇資料存入(更新)的日期：{{ dateRange }}</div>
      <q-date v-model="dateRange" range />
    </div>

    <q-dialog
      v-model="DeleteDialog"
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
          @click="deleteFun"
        >
          <q-btn class="text-h6" label="刪 除" v-close-popup />
        </div>

        <q-card-section v-if="deleteData.length > 0">
          <div class="text-h6">刪除的資料：{{ deleteData.length }}筆</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <!-- 顯示刪除的資料 -->
          <q-list bordered separator>
            <q-item
              clickable
              v-ripple
              v-for="(item, key) in deleteData"
              :key="key"
            >
              <q-item-section>
                <q-item-label>
                  <table width="100%">
                    <tr>
                      <td width="10%">
                        <span class="text-caption text-grey-8"
                          >刪除<input
                            id="del"
                            :name="`${item.name}`"
                            type="radio"
                            checked
                            @click="item.add = true" /></span
                        ><br />
                        <span class="text-caption text-grey-8"
                          >取消<input
                            id="cancel"
                            :name="`${item.name}`"
                            type="radio"
                            @click="item.del = false"
                        /></span>
                      </td>
                      <td width="20%">{{ item.name }}</td>
                      <td width="50%">{{ item.proTitle }}</td>
                      <td>{{ item.updateDate }}</td>
                      <!-- <td>{{item.id}}</td> -->
                    </tr>
                  </table>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <div
          class="full-width column text-black bg-grey-4"
          v-if="isOk"
          @click="deleteFun"
        >
          <q-btn class="text-h6" label="刪 除" v-close-popup />
        </div>

        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup> </q-btn>
        </q-bar>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { dbFirestore } from "boot/firebase";
import Vue from "vue";
import { date, Loading } from "quasar";
import { showErrorMessage } from "src/utils/function-show-error-message";

export default {
  name: "DataBatchDelete",
  data() {
    return {
      dateRange: null,
      DeleteDialog: false,
      deleteData: [],
      isOk: false,
    };
  },
  components: {},
  created() {},
  mounted() {},
  watch: {
    dateRange() {
      // console.log(this.dateRange);
      this.LastUpdate();
    },
  },
  computed: {},
  methods: {
    deleteFun() {
      // console.log(this.deleteData);
      this.$q
        .dialog({
          title: "刪除確認",
          message: "從資料庫中刪除",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.$q
            .dialog({
              title: "警告",
              message: "再次確認？",
              cancel: true,
            })
            .onOk(() => {
              // 設定批量
              var batch = dbFirestore.batch();

              let i = 0;
              this.deleteData.forEach((item) => {
                if (item.del) {
                  ++i;

                  // console.log(item.id, item.name,i);

                  var Ref = dbFirestore.collection("現場紀錄表").doc(item.id);
                  batch.delete(Ref);

                  // dbFirestore
                  //   .collection("現場紀錄表")
                  //   .doc(key)
                  //   .delete()
                  //   .then(() => {
                  //     console.log(item.id, "資料刪除成功！", i);
                  //   });
                }
              });
              // 批量寫入
              batch.commit().then(() => {
                console.log("批量資料刪除成功");
                showErrorMessage("批量資料刪除成功");
              });
            });
        });
    },
    //最近更新
    LastUpdate() {
      this.deleteData.length = 0;
      if(!this.dateRange) return
      if (this.dateRange.from === this.dateRange.to) {
        showErrorMessage("起始結束同一天");
        return;
      }
      let start = new Date(this.dateRange.from);
      let end = new Date(this.dateRange.to);

      // console.log(start, end);
      Loading.show();
      dbFirestore
        .collection("現場紀錄表")
        // .limit(100)
        .where("updateDate", ">=", start)
        .where("updateDate", "<=", end)
        .get()
        .then((qs) => {
          if (qs.empty) {
            this.$q.dialog({
              title: "",
              message: "查不到",
            });
            return false;
          }

          let i = 0;
          qs.forEach((doc) => {
            let todate1 = doc.data().updateDate;
            // console.log(
            //   doc.data().name,
            //   date.formatDate(todate1.toDate(), "YYYY-MM-DD HH:mm:ss")
            // );
            ++i;
            let data = {
              name: doc.data().name,
              proTitle: doc.data().proTitle,
              updateDate: date.formatDate(
                todate1.toDate(),
                "YYYY-MM-DD HH:mm:ss"
              ),
              del: true,
              id: doc.id,
            };
            this.deleteData.push(data);
            // Vue.set(dbData, doc.id, doc.data());
          });
          // console.log(i);

          Loading.hide();
          // 開啟視窗
          this.DeleteDialog = true;
          this.isOk = true;
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  }, //end methods
};
</script>

<style>
table {
  border-collapse: collapse;
  /* border: 3px #cccccc solid; */
  border: none;
}
td {
  border-collapse: collapse;
  /* border: 1px #cccccc solid; */
  border: none;
}
</style>
