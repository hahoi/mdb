<template>
  <div>
    <q-item clickable v-ripple @click="dowork">
      <q-item-section avatar>
        <q-avatar v-if="task.avatar.length !== 0">
          <img :src="task.avatar" />
        </q-avatar>
      </q-item-section>

      <!-- <q-item-section class="col-6"> -->
      <q-item-section>
        <q-item-label>{{ task.name }}</q-item-label>
        <!-- <q-item-label caption lines="2">
          <span class="text-weight-bold">{{ task.address }}</span>
          {{ task.professionalTitle }}-{{ task.clubTitle }}
        </q-item-label> -->
      </q-item-section>

      <q-item-section side>
        <!-- {{ task.update }} -->
        <!-- <div class="text-orange fit row wrap justify-start items-center content-center" v-for="star in task.star"> -->
        <div class="text-orange q-ma-none q-pa-none row" v-for="star in task.star">
          <q-icon name="star" size="0.5rem" />
        </div>
      </q-item-section>
    </q-item>
    <!-- </q-slide-item> -->

    <q-separator inset="item" />

    <!-- 列表顯示資料============================== -->
    <q-dialog
      v-model="dialogList"
      :maximized="true"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-teal text-white">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup
            >關閉
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <task-list :task="copyTask" :id="id"></task-list>
        </q-card-section>
        <q-card-actions  align="around">
          <q-btn
            dense
            flat
            icon="edit"
            @click="onEdit"
            v-close-popup
            class="bg-purple text-white"
            >修改</q-btn
          >
          <q-btn
            dense
            flat
            icon="delete"
            @click="onDelete"
            v-close-popup
            class="bg-red text-white"
            >刪除</q-btn
          >
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>關閉</q-btn>
        </q-card-actions>
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
      <q-card class="bg-purple text-white">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup
            >離開
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <task-edit
            :task="editTask"
            :id="id"
            @listenToChild="getChildMsg"
          ></task-edit>
        </q-card-section>
        <q-card-actions align="around">
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>離開</q-btn>
        </q-card-actions>
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
    TaskList: require("components/TaskList.vue").default,
    TaskEdit: require("components/TaskEdit.vue").default,
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {
    ...mapState("fieldrecord", ["search"]),
  },
  methods: {
    ...mapActions("fieldrecord", ["deleteFieldRecord", "updateFieldRecord"]),
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
              this.task.photo.forEach((p) => {
                console.log(p.findKey);
                dbStorage.ref().child(p.findKey).delete();
              });
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
