<template>
  <div>
    <!-- 7880000@gmail.com 00000000(要修改)  管理者  -->
    <q-item class="" v-if="item.name !=='7880000'">
      <q-item-section avatar>
        <q-item-label lines="1">
          <span class="">使用系統</span>
        </q-item-label>
        <span class="text-grey-8">
          <q-checkbox color="positive" v-model="item.states"
        /></span>

      </q-item-section>

      <!-- :toggle="checkOk()" -->

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
          <span class="text-grey-8"> {{ createAt }}</span>
          <span class="text-weight-medium">註冊</span>
        </q-item-label>

        <q-item-label lines="1">
          <span class="text-grey-8">管理使用者</span>
          <span class="">
            <q-checkbox v-model="item.sysMana" color="info"
          /></span>
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <div class="text-grey-8 q-gutter-xs flex column">
          <q-btn size="18px" flat dense round icon="delete" @click="delFn()" />
          <q-btn
            size="18px"
            flat
            dense
            round
            icon="save"
            color="primary"
            @click="SaveFn()"
          />
        </div>
      </q-item-section>
    </q-item>

    <q-separator spaced />
    <!-- {{userId}} -->
  </div>
</template>

<script>
import { date } from "quasar";
import { firebaseAuth, dbFirestore, dbFunctions } from "boot/firebase";

export default {
  name: "",
  props: ["item"],
  data() {
    return {
      AllUsers: [],
      options: [],
    };
  },
  components: {},
  created() {},
  mounted() {
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
    SaveFn() {
      // console.log(this.item.sysMana, this.item.states);
      let role = ["Index"]
      if (this.item.states) {
        //可以使用的路由
         role = ["Index", "MDB"];
      }

      if (this.item.sysMana) {
        //可以使用的路由
         role = ["Index", "MDB", "users", "settings"];
      }
      dbFirestore
        .collection("MDBUsers")
        .doc(this.item.id)
        .update({
          states: this.item.states,
          role: role,
          sysMana: this.item.sysMana
        })
        .then(() => {
          console.log("資料庫修改成功！", this.item.states);
          //   this.$q.notify("資料庫修改成功！")
        })
        .catch((error) => {
          console.error("資料庫更新失敗！", error);
        });


    },

    //刪除使用者
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
              //users資料庫刪除
              dbFirestore
                .collection("MDBUsers")
                .doc(this.item.id)
                .delete()
                .then(() => {
                  this.$q.notify(`${this.item.name}已刪除`);
                  this.$router.go(-1);
                });
              //firebase authentication 刪除
              this.DeleteUsers(this.item.id);
            });
        });
    },

    //從cloud function 中讀取 Authentication 使用者
    ListAllUsers() {
      const AdminListUsers = dbFunctions.httpsCallable("AdminListUsers");
      AdminListUsers().then((result) => {
        // console.log(result.data);

        // console.log("displayName:", result.data.displayName)
				// console.log("email:", email)
				// console.log("emailVerified:", emailVerified)
				// console.log("photoURL:", photoURL)
				// console.log("isAnonymous:", isAnonymous)
				// console.log("uid:", uid)
				// console.log("isAnonymous:", providerData)
				// console.log(JSON.stringify(user, null, '  '))
        result.data.forEach((x) => {
          let data = {
            uid: x.uid,
            name: x.displayName,
            email: x.email,
            emailVerified: x.emailVerified,
            photoURL: x.photoURL,
            isAnonymous: x.isAnonymous,
            providerData: x.providerData,
            userData: JSON.stringify(x, null, '  '),
          };
          // console.log(x.name, x.lastSignInTime,x.creationTime)
          this.AllUsers.push(data);
          this.options.push(x.email);
        });
      });
    },
    //從cloud function 中刪除 使用者
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
