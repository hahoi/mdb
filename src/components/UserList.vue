<template>
  <div>
    <q-item class="">
      <q-item-section avatar>
        <q-toggle
          v-model="item.states"
          checked-icon="check"
          color="green"
          unchecked-icon="clear"
          :toggle="checkOk()"
        />
      </q-item-section>

      <q-item-section top>
        <q-item-label lines="1">
          <span class="text-weight-medium text-h6">{{ item.name }}</span>
        </q-item-label>
        <q-item-label lines="1">
          <span class="text-grey-8">{{ item.email }}</span>
        </q-item-label>
        <q-item-label lines="1">
          <span class="text-grey-8">Tel : {{ item.telephone }}</span>
        </q-item-label>

        <q-item-label lines="1">
          <span class="text-weight-medium">註冊</span>
          <span class="text-grey-8"> {{ createAt }}</span>
        </q-item-label>
      </q-item-section>

      <q-item-section top side>
        <div class="text-grey-8 q-gutter-xs">
          <q-btn size="12px" flat dense round icon="delete" @click="delFn" />
          <!-- <q-btn size="12px" flat dense round icon="more_vert" /> -->
        </div>
      </q-item-section>
    </q-item>

    <!-- <q-separator spaced /> -->
    <!-- {{userId}} -->
  </div>
</template>

<script>
import { date } from "quasar";
import { firebaseAuth,dbFirestore, dbFunctions } from "boot/firebase";

export default {
  name: "",
  props: ["item"],
  data() {
    return {
      first: true,
      AllUsers: [],
      options: [],
      userId: ""
    };
  },
  components: {},
  created() {},
  mounted() {
    // this.ListAllUsers();
    // this.userId = firebaseAuth.currentUser.uid;
    //   console.log(userId)
  },
  watch: {},
  computed: {
    createAt() {
      return date.formatDate(
        this.item.createAt.toDate(),
        "YYYY-MM-DD HH:mm:ss"
      );
    },
  },
  methods: {
    checkOk() {
      console.log(this.item.id, this.first);
      //   if(this.first) {
      //         return
      //   }
      dbFirestore
        .collection("MDBUsers")
        .doc(this.item.id)
        .update({
          states: this.item.states,
        })
        .then(() => {
          console.log("資料庫修改成功！", this.item.states);
        //   this.$q.notify("資料庫修改成功！")
        })
        .catch((error) => {
          console.error("資料庫更新失敗！", error);
        });
    },
    delFn() {
      if (this.item.id == "") {
        return false;
      }
      this.$q
        .dialog({
          title: "刪除確認",
          message: `要刪除${this.item.name}嗎？`,
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
              dbFirestore
                .collection("MDBUsers")
                .doc(this.item.id)
                .delete()
                .then(() => {
                  this.$q.notify(`${this.item.name}已刪除`);
                  this.$router.go(-1);
                });
                this.DeleteUsers(this.item.id)
            });
        });
    },

    //從cloud function 中讀取 Authentication 使用者
    ListAllUsers() {
      const AdminListUsers = dbFunctions.httpsCallable("AdminListUsers");
      AdminListUsers().then((result) => {
        // console.log(result.data);
        result.data.forEach((x) => {
          let data = {
            uid: x.uid,
            name: x.displayName,
            email: x.email,
          };
          this.AllUsers.push(data);
          this.options.push(x.email);
        });
      });
    },
    DeleteUsers(id) {
      const AdminDeleteUsers = dbFunctions.httpsCallable("AdminDeleteUsers");
      AdminDeleteUsers({ uid: id }).then((result) => {
        console.log(result.data);
      });
    },
  }, //methods
};
</script>

<style>
</style>
