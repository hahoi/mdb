<template>
  <q-page style="max-width: 500px; margin: auto">
    <q-list bordered class="rounded-borders">
      <q-item-label header class="text-h6">使用者管理</q-item-label>
      <q-separator spaced />
      <user-list v-for="item in dbData" :key="item.email" :item="item">
      </user-list>
    </q-list>

  </q-page>
</template>

<script>
import { firebaseAuth, dbFirestore, dbFunctions } from "boot/firebase";
import { date } from "quasar";

export default {
  name: "",
  data() {
    return {
      dbData: [],
    };
  },
  components: {
    UserList: require("components/UserList.vue").default,
  },
  created() {
    // 將firestore user使用者 與Authentication使用者 結合
    this.mergeUserData()
  },
  mounted() { },
  watch: {},
  computed: {},
  methods: {
    // 將firestore user使用者 與Authentication使用者 結合
    async mergeUserData(){
      //Authentication 所有使用者
      let allUsers =  await this.ListAllUsers()
      //firestore 使用者資料
      let dbUsers = await this.readDbData()
      
      //結合
      dbUsers.forEach((item) => {
        //傳入allUser 陣列 及 ID，找到最近登入時間
        let d = this.findMetaData(allUsers, item.id);
        let t = date.formatDate(
          d.user.metadata.lastSignInTime,
          "YYYY-MM-DD HH:mm:ss"
        );
        //加入 firestore Users 中
        item.lastSignInTime = t;        
      });
      //結合好的Array，傳址給 this.dbData ，模版用
      this.dbData = dbUsers
    },

    //找到uid相同，傳回auth User 資料
    findMetaData(allUsers , uid) {
      // console.log(uid)
      return allUsers.find((item) => {
        // console.log(uid, item.user.uid)
        return item.user.uid == uid;
      });
    },

    //需寫成非同步，才能傳回資料
    async readDbData() {
      let dbData = [];
      await dbFirestore
        .collection("MDBUsers")
        .get()
        .then((qs) => {
          qs.forEach((doc) => {
            dbData.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          // console.log(dbData) 
          return dbData // 這邊需要傳回
        })
        .catch((err) => {
          console.log(err.message);
        });

        return dbData // 這裡再傳回
    },

    //從cloud function 中讀取 Authentication 使用者
    ListAllUsers() {
      const AdminListUsers = dbFunctions.httpsCallable("AdminListUsers");
      return AdminListUsers().then((result) => {
        // console.log(result.data);

        // console.log("displayName:", result.data.displayName)
        // console.log("email:", email)
        // console.log("emailVerified:", emailVerified)
        // console.log("photoURL:", photoURL)
        // console.log("isAnonymous:", isAnonymous)
        // console.log("uid:", uid)
        // console.log("isAnonymous:", providerData)
        // console.log(JSON.stringify(user, null, '  '))
        let userdata = []
        result.data.forEach((x) => {
          let data = {
            userData: JSON.stringify(x, null, "  "), //變成字串好閱讀，知道有哪些物件參數
            user: x,
          };
          userdata.push(data)
        });
        return userdata
      });
    },
    listUserData() {
      this.AllUsers.forEach((data) => {
        console.log(
          date.formatDate(
            data.user.metadata.lastSignInTime,
            "YYYY-MM-DD HH:mm:ss.SSSZ"
          )
        );
        // console.log(data.email, data.mata.lastSignInTime, data.mata.creationTime);
      });
    },
  },
};
</script>

<style>
</style>
