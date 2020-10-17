<template>
  <div>
    <q-item clickable v-ripple @click="dowork">
      <q-item-section avatar>
        <q-avatar v-if="task.avatar.length !== 0">
          <img :src="task.avatar" />
        </q-avatar>
      </q-item-section>

      <!-- <q-item-section class="col-6"> -->
      <q-item-section class="col-6">
        <q-item-label
          >{{ task.name }}
          <q-icon
            name="stop_circle"
            class="text-red"
            style="font-size: 0.5rem"
            v-if="task.RedDot"
          />
        </q-item-label>
        <q-item-label caption lines="1">
          <span class="text-weight-bold" style="font-size: 1rem">{{
            task.proTitle
          }}</span>
          <!-- {{ task.professionalTitle }}-{{ task.clubTitle }} -->
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <!-- {{ task.update }} -->
        <!-- <div class="text-orange fit row wrap justify-start items-center content-center" v-for="star in task.star"> -->
        <template v-for="star in task.star">
        <div class="text-orange q-ma-none q-pa-none row">
          <q-icon name="star" size="0.5rem" />
        </div>
        </template>
      </q-item-section>
    </q-item>
    <!-- </q-slide-item> -->

    <q-separator inset="item" />

    <!-- 顯示詳細資料視窗=========================== -->
    <q-dialog
      v-model="dialogList"
      :maximized="true"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-grey-1">
        <q-bar >
          <q-btn flat icon="close"  class="bg-black text-white" @click.stop.prevent="dialogList=false"   >離開
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>

          <q-space />
          <q-btn
            flat
            icon="edit"
            @click="onEdit"
            v-close-popup
            class="bg-positive text-white"
            >修改</q-btn
          >
          <q-btn
            flat
            icon="delete"
            @click="onDelete"
            v-close-popup
            class="bg-negative text-white"
            >刪除</q-btn
          >
        </q-bar>

        <q-card-section>
          <!-- 顯示每筆詳細資料 -->
          <data-bank-list :task="copyTask" :id="id"></data-bank-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- 修改資料視窗============================== -->
    <q-dialog
      v-model="dialogEdit"
      :maximized="true"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-grey-1 text-white">
        <q-bar>
          <q-btn flat icon="close" v-close-popup class="bg-black text-white"
            >離開
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
          <q-space />
        </q-bar>

        <q-card-section>
          <data-bank-edit
            :task="editTask"
            :id="id"
            @listenToChild="getChildMsg"
          ></data-bank-edit>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { dbFirestore, dbStorage } from "boot/firebase";
import { extend } from "quasar";
import { deepCopy } from "src/utils/function-tree";
export default {
  name: "",
  props: ["task", "id"],

  data() {
    return {
      dialogList: false,
      dialogEdit: false,
      maximizedToggle: true,
      copyTask: null,
      editTask: {},
    };
  },
  components: {
    DataBankList: require("components/DataBankList.vue").default,
    DataBankEdit: require("components/DataBankEdit.vue").default,
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {
    ...mapState("LoadData", ["search"]),
  },
  methods: {
    ...mapActions("LoadData", ["deleteFieldRecord", "updateFieldRecord"]),
    onEdit() {
      // this.$q.notify("修改這筆資料");
      //深複製copy一份進行編輯
      // this.editTask = Object.assign({}, this.task);
      this.editTask = deepCopy(this.task);
      this.dialogEdit = true;
      // this.finalize(reset);
    },
    getChildMsg(val) {
      this.dialogEdit = val;
    },
    onSave() {},

    onDelete({ reset }) {
      if (this.id == "") {
        return false;
      }
      this.$q
        .dialog({
          title: "刪除確認",
          message: `要刪除${this.task.name}嗎？`,
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
              console.log(this.id);
              //刪除圖檔
              if (this.task.photo.length > 0) {
                this.task.photo.forEach((p) => {
                  if (p.findKey) {
                    console.log(p.findKey);
                    dbStorage.ref().child(p.findKey).delete();
                  }
                });
              }
              //刪除資料庫
              this.deleteFieldRecord(this.id);
              this.dialogList = false;
              this.$q.notify(`${this.task.name}已刪除`);
            });
        });
    },

    finalize(reset) {
      this.timer = setTimeout(() => {
        reset();
      }, 1000);
    },

    beforeDestroy() {
      clearTimeout(this.timer);
    },

    //顯示每筆詳細資料
    dowork() {
      this.dialogList = true;
      //複製一份
      let task = Object.assign({}, this.task);
      if (this.search) {
        //將找到符合的關鍵字用紅色字顯示
        let arraySearchWord = this.search.split(/\s+/);
        //每一筆資料比對多個關鍵字 and
        arraySearchWord.forEach((keyword, index) => {
          //搜尋每個欄位
          Object.keys(task).forEach((key) => {
            //搜尋文字型態個欄位
            if (key == "photo") return; //照片不搜尋取代
            if (key == "avatar") return; //頭像照片不搜尋取代
            if (typeof task[key] === "string") {
              let item = task[key];
              // console.log(key,task[key])
              let searchLowerCase = keyword.toLowerCase();
              if (item.includes(searchLowerCase)) {
                let regex = new RegExp(keyword, "i");
                let match = item.match(regex);
                // console.log(regex,match)
                if (match) {
                  item = item.replace(
                    regex,
                    "<span class='bg-red text-white'>" + match[0] + "</span>"
                  );
                  task[key] = item;
                }
              }
            }
          });
          // console.log(task);
        });
      }
      this.copyTask = task;
    },
  },
};
</script>

<style>
.q-scroll-area-tasks {
  display: flex;
  flex-grow: 1;
}
</style>
