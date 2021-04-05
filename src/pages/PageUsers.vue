<template>
  <q-page style="max-width: 500px; margin: auto">
    <q-list bordered class="rounded-borders">
      <q-item-label header class="text-h6">使用者管理</q-item-label>
      <q-separator spaced />
      <user-list v-for="item in dbData" :key="item.email" :item="item">
      </user-list>
    </q-list>
    <q-btn @click="mergeUserData">最近登入</q-btn>
    <!-- {{ AllUsers }} -->
    <q-dialog v-model="lastSignIn">
      <q-card>
        <q-card-section>
          <div class="text-h6">最近登入</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list bordered separator v-for="item in dbData" :key="item.email">
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label lines="1">
                  <span class="text-weight-medium text-h6">{{
                    item.name
                  }}</span>
                </q-item-label>
                <q-item-label lines="1">
                  <span class="text-grey-8">{{ item.lastSignInTime }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      AllUsers: [],
      options: [],
      lastSignIn: false,
    };
  },
  components: {
    UserList: require("components/UserList.vue").default,
  },
  created() {
    this.ListAllUsers();
    this.readDbData();
  },
  mounted() {
    // this.mergeUserData()
  },
  watch: {},
  computed: {},
  methods: {
    mergeUserData() {
      this.lastSignIn = true;
      // await this.ListAllUsers()
      this.dbData.forEach((item) => {
        let d = this.findMetaData(item.id);
        // console.log(d)
        let t = date.formatDate(
          d.user.metadata.lastSignInTime,
          "YYYY-MM-DD HH:mm:ss"
        );
        // console.log(t)
        item.lastSignInTime = t;
      });

      // console.log(this.dbData);
    },
    findMetaData(uid) {
      // console.log(uid)
      return this.AllUsers.find((item) => {
        // console.log(uid, item.user.uid)
        return item.user.uid == uid;
      });
    },
    readDbData() {
      let dbData = [];
      dbFirestore
        .collection("MDBUsers")
        .get()
        .then((qs) => {
          qs.forEach((doc) => {
            // console.log(doc.data().name);
            this.dbData.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        })
        .catch((err) => {
          console.log(err.message);
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
            userData: JSON.stringify(x, null, "  "), //變成字串好閱讀，知道有哪些物件參數
            user: x,
          };

          this.AllUsers.push(data);
          this.options.push(x.email);
        });
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
