<template>

  <q-form ref="form" @submit.prevent="submitForm">
    <q-card flat style="width: 100%; max-width: 300px; margin: 0 auto" class="text-h6">
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
          autocomplete="user-email"
        />
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="formData.name"
          :rules="[(val) => !!val || '* 這個欄位必須要輸入']"
          ref="name"
          lazy-rules
          class="col text-h6"
          label="姓名"
          stack-label
          clearable
          dense
          autocomplete="username"
        />

      </q-card-section>
      <q-card-section>
        <q-input
          v-model="formData.telephone"
          :rules="[(val) => !!val || '* 這個欄位必須要輸入']"
          ref="telephone"
          lazy-rules
          class="col text-h6"
          label="連絡電話"
          stack-label
          clearable
          dense
          autocomplete="username"
        />
        
      </q-card-section>
      <q-card-section><q-input
          v-model="formData.password"
          :rules="[
            (val) => !!val || '* 這個欄位必須要輸入',
            (val) => val.length >= 6 || 'Please enter at least 6 characters.',
          ]"
          ref="password"
          lazy-rules
          type="password"
          class="col text-h6"
          label="設定密碼"
          stack-label
          clearable
          dense
          autocomplete="new-password"
        />
        
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="password2"
          :rules="[(val) => val === formData.password || '兩次密碼不一樣']"
          ref="password2"
          lazy-rules
          type="password"
          class="col text-h6"
          label="輸入相同的密碼"
          stack-label
          clearable
          dense
          autocomplete="new-password"
        />
        
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-space />
        
        <q-btn color="primary" label="註冊" type="submit" class="btn-fixed-width"/>
      </q-card-actions>
    </q-card>


  </q-form>





  
        

</template>

<script>
import { mapState, mapActions } from "vuex";
import { firebaseDb, firebaseAuth, dbFirestore } from "boot/firebase";

export default {
  name: "",
  props: ["tab"],
  data() {
    return {
      // department: [],
      formData: {
        email: "",
        password: "",
        name: "",
        telephone: "",
      },
      password2: "",
    };
  },
  components: {},
  created() {},
  mounted() {},
  watch: {},
  computed: {
  },
  methods: {
    ...mapActions("auth", ["registerUser"]),

    isValidEmailAddress(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },

    submitForm() {
      // console.log(
      //   "refs.form",
      //   this.$refs.form.validate(),
      //   this.$refs.email.validate(),
      //   this.$refs.name.validate(),
      //   this.$refs.department.validate(),
      //   this.$refs.telephone.validate(),
      //   this.$refs.password.validate(),
      //   this.$refs.password2.validate()
      // );

      if (this.$refs.form.validate()) {
        this.registerUser(this.formData);
      }
    },
  },
};
</script>

<style>
</style>
