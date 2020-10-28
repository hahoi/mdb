<template>
  <div class="bg-white text-black" style="max-width: 600px; margin: auto">
    <q-card-section>
      <q-list class="text-h6">
        <q-item clickable>
          <q-item-section avatar class="col-5  text-grey-8">
            <q-avatar v-if="task.avatar.length !== 0">
              <img :src="task.avatar" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.name">{{ task.name }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced />
        <q-item clickable v-if="task.mobilePhone.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> 手機： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.mobilePhone">{{
              task.mobilePhone
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.mobilePhone.length !== 0" />

        <q-item clickable v-if="task.companyPhone.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> 公司電話： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.companyPhone">{{
              task.companyPhone
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.companyPhone.length !== 0" />

        <q-item clickable v-if="task.email.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> Email： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.email">{{
              task.email
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.email.length !== 0" />

        <q-item clickable v-if="task.county.length !== 0">
          <q-item-section class="col-5  text-grey-8">
            <q-item-label v-html="task.county"></q-item-label>
          </q-item-section>
          <q-item-section class="col-5  text-grey-8">
            <q-item-label v-html="task.district"></q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.county.length !== 0" />

        <q-item clickable v-if="task.address.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> 地址： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.address">{{
              task.address
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.address.length !== 0" />

        <q-item clickable v-if="task.classify.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> 分類： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.classify">{{
              task.classify
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.address.length !== 0" />

        <q-item clickable v-if="task.proTitle.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> 職業職稱： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.proTitle">{{
              task.proTitle
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.proTitle.length !== 0" />

        <q-item clickable v-if="task.clubTitle.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> 社團職稱： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.clubTitle">{{
              task.clubTitle
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.clubTitle.length !== 0" />

        <q-item clickable v-if="task.personalConnections.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> 人脈關係： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.personalConnections">{{
              task.personalConnections
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.personalConnections.length !== 0" />

        <q-item clickable v-if="task.meetNotes.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> 見面記事： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.meetNotes">{{
              task.meetNotes
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.meetNotes.length !== 0" />

        <q-item clickable v-if="task.suggestions.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> 建言事項： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.suggestions">{{
              task.suggestions
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.suggestions.length !== 0" />

        <q-item clickable v-if="task.petitionMatters.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> 陳情事項： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.petitionMatters">{{
              task.petitionMatters
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.petitionMatters.length !== 0" />

        <q-item clickable v-if="task.diet.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> 飲食： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.diet">{{ task.diet }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.diet.length !== 0" />

        <q-item clickable v-if="task.interest.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> 興趣： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.interest">{{
              task.interest
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.interest.length !== 0" />

        <q-item clickable v-if="task.topic.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> 話題： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.topic">{{ task.topic }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.topic.length !== 0" />

        <q-item clickable v-if="task.other.length !== 0">
          <q-item-section avatar class="col-5  text-grey-8"> 其他： </q-item-section>
          <q-item-section>
            <q-item-label v-html="task.other">{{ task.other }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced v-if="task.other.length !== 0" />
        <!-- 星級 --><!-- 紅點 -->
        <div class="q-gutter-md q-my-md row items-start">
          <q-rating v-model="task.star" size="2em" color="primary" readonly v-if="task.star > 0"/>
          <q-icon name="stop_circle" class="text-red" style="font-size: 2rem" v-if="task.RedDot"/>
        </div>

        <q-item clickable v-if="task.photo.length !== 0">
          <q-item-section top thumbnail class="q-ml-none">
            <div v-for="img in task.photo">
              <img :src="img.linkURL" @click="viewPhoto(img.linkURL)" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-dialog v-model="showPhoto">
      <q-card>
        <q-card-section class="row items-center q-py-none bg-grey-5">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <img :src="photoUrl" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  props: ["task", "id"],
  data() {
    return {
      showPhoto: false,
      photoUrl: "",
    };
  },
  components: {},
  created() {},
  mounted() {
    // console.log(this.task)
  },
  watch: {},
  computed: {},
  methods: {
    viewPhoto(url) {
      this.photoUrl = url;
      this.showPhoto = true;
    },
  },
};
</script>

<style>
</style>
