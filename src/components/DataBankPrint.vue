<template>
  <div
    class="bg-white text-black"
    style="width: 649px; height: 978px; margin: auto"
  >
    <q-card-section>
      <q-btn v-print="'#oContent'" label="列印" size="xl" />
    </q-card-section>

    <q-card-section>
      <!-- border:1px solid #000000; -->
      <div id="oContent" style="">
        <q-markup-table separator="cell" flat bordered>
          <tbody>
            <tr>
              <td width="25%">姓名</td>
              <td width="25%">{{ task.name }}</td>
              <td width="50%" colspan="2" rowspan="5" align="center">
                <img :src="task.avatar" style="max-width: 300px;max-height:200px"/>
              </td>
            </tr>
            <tr>
              <td>手機</td>
              <td>{{ task.mobilePhone }}</td>
            </tr>
            <tr>
              <td>公司電話</td>
              <td>{{ task.mobilePhone }}</td>
            </tr>
            <tr>
              <td>分類</td>
              <td>{{ task.classify }}</td>
            </tr>
            <tr>
              <td>縣市</td>
              <td>{{ task.county }}</td>
            </tr>
            <tr>
              <td>地址</td>
              <td colspan="3">{{ task.address }}</td>
            </tr>
            <tr>
              <td>職業職稱</td>
              <td colspan="3">{{ task.proTitle }}</td>
            </tr>
            <tr>
              <td>社團職稱</td>
              <td colspan="3">{{ task.clubTitle }}</td>
            </tr>
            <tr>
              <td>人脈關係</td>
              <td colspan="3">{{ task.personalConnections }}</td>
            </tr>
            <tr>
              <td>見面記事</td>
              <td colspan="3">{{
              task.meetNotes
            }}</td>
            </tr>
            <tr>
              <td>建言事項</td>
              <td colspan="3">{{
              task.suggestions
            }}</td>
            </tr>
            <tr>
              <td>陳情事項</td>
              <td colspan="3">{{
              task.petitionMatters
            }}</td>
            </tr>

            <tr>
              <td width="25%">飲食</td>
              <td width="25%">{{ task.diet }}</td>
              <td width="25%">興趣</td>
              <td width="25%">{{
              task.interest
            }}</td>
            </tr>
            <tr>
              <td width="25%">話題</td>
              <td width="25%">{{ task.topic }}</td>
              <td width="25%">其他</td>
              <td width="25%">{{ task.other }}</td>
            </tr>
            <tr>
              <td></td>
              <td>{{task.star}}星</td>
              <td></td>
              <td>{{task.RedDot ? "●" : ""}}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </q-card-section>


  </div>
</template>

<script>
export default {
  name: "",
  props: ["task"],
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
