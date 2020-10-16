<template>
  <q-form ref="form" @submit.prevent="submitForm">
    <q-card flat style="width: 100%; max-width: 300px; margin: 0 auto">
      <q-card-section>
        <q-input
          v-model="formData.email"
          :rules="[
            (val) => !!val || '* 這個欄位必須要輸入',
            (val) => isValidEmailAddress(val) || '不合格式的 e-mail.',
          ]"
          ref="email"
          type="email"
          lazy-rules
          class="col text-h6"
          label="Email"
          stack-label
          clearable
          dense
        />
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="formData.password"
          :rules="[(val) => !!val || '* 這個欄位必須要輸入']"
          ref="password"
          lazy-rules
          type="password"
          class="col text-h6"
          label="密碼"
          stack-label
          clearable
          dense
        />
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-btn flat label="忘記密碼？" @click="sendPasswordResetEmail" />
        <q-space />

        <q-btn
          color="primary"
          label="登入"
          type="submit"
          class="btn-fixed-width"
        />
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { firebaseDb, firebaseAuth, dbFirestore } from "boot/firebase";
import { showErrorMessage } from "src/utils/function-show-error-message";

export default {
  name: "",
  props: ["tab"],
  data() {
    return {
      // department: [],
      formData: {
        email: "",
        password: "",
      },
    };
  },
  components: {},
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    ...mapActions("auth", ["loginUser"]),

    isValidEmailAddress(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },

    submitForm() {
      if (this.$refs.form.validate()) {
        this.loginUser(this.formData);
      }
    },
    //發送密碼重置電子郵件
    sendPasswordResetEmail() {
      // let userId = firebaseAuth.currentUser.uid;
      // console.log(userId)
      let vm = this;

      this.$q
        .dialog({
          title: "提示",
          message: "輸入註冊的Email",
          prompt: {
            model: "",
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          // console.log(">>>> OK, received", data);
          firebaseAuth
            .sendPasswordResetEmail(data)
            .then(function () {
              vm.$q.notify(`已發送${data}密碼重置電子郵件`);
            })
            .catch(function (error) {
              // An error happened.
            });
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
  },
};
</script>

<style>
</style>
