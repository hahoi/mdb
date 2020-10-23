<template>
  <div
    class="bg-white text-black"
    style="width: 649px; height: 978px; margin: auto"
  >
    <q-card-section>
      <q-btn v-print="'#printContent'" label="列印" size="xl" />
    </q-card-section>

    <q-card-section>
      <!-- border:1px solid #000000; -->
      <div id="printContent"  class="text-h6">
        <q-markup-table separator="cell" flat bordered>
          <tbody >
            <tr>
              <td width="25%"  style="font-size:18px">姓名</td>
              <td width="25%"  style="font-size:18px">{{ task.name }}</td>
              <td width="50%" colspan="2" rowspan="5" align="center">
                <img
                  :src="task.avatar"
                  style="max-width: 300px; max-height: 200px"
                />
              </td>
            </tr>
            <tr>
              <td style="font-size:18px">手機</td>
              <td style="font-size:18px">{{ task.mobilePhone }}</td>
            </tr>
            <tr>
              <td style="font-size:18px">公司電話</td>
              <td style="font-size:18px">{{ task.mobilePhone }}</td>
            </tr>
            <tr>
              <td style="font-size:18px">分類</td>
              <td style="font-size:18px">{{ task.classify }}</td>
            </tr>
            <tr>
              <td style="font-size:18px">縣市</td>
              <td style="font-size:18px">{{ task.county }}</td>
            </tr>
            <tr>
              <td style="font-size:18px">地址</td>
              <td colspan="3" style="font-size:18px">{{ task.address }}</td>
            </tr>
            <tr>
              <td style="font-size:18px">職業職稱</td>
              <td colspan="3" style="font-size:18px">{{ task.proTitle }}</td>
            </tr>
            <tr>
              <td style="font-size:18px">社團職稱</td>
              <td colspan="3" style="font-size:18px">{{ task.clubTitle }}</td>
            </tr>
            <tr>
              <td style="font-size:18px">人脈關係</td>
              <td colspan="3" style="font-size:18px">{{ task.personalConnections }}</td>
            </tr>
            <tr>
              <td style="font-size:18px">見面記事</td>
              <td colspan="3" style="font-size:18px">{{ task.meetNotes }}</td>
            </tr>
            <tr>
              <td style="font-size:18px">建言事項</td>
              <td colspan="3" style="font-size:18px">{{ task.suggestions }}</td>
            </tr>
            <tr>
              <td style="font-size:18px">陳情事項</td>
              <td colspan="3" style="font-size:18px">{{ task.petitionMatters }}</td>
            </tr>

            <tr>
              <td width="25%" style="font-size:18px">飲食</td>
              <td width="25%" style="font-size:18px">{{ task.diet }}</td>
              <td width="25%" style="font-size:18px">興趣</td>
              <td width="25%" style="font-size:18px">{{ task.interest }}</td>
            </tr>
            <tr>
              <td width="25%" style="font-size:18px">話題</td>
              <td width="25%" style="font-size:18px">{{ task.topic }}</td>
              <td width="25%" style="font-size:18px">其他</td>
              <td width="25%" style="font-size:18px">{{ task.other }}</td>
            </tr>
            <tr>
              <td></td>
              <td style="font-size:18px">{{ task.star }}星</td>
              <td></td>
              <td style="font-size:18px">{{ task.RedDot ? "●" : "" }}</td>
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
@media print {
  #printContent {
    margin: 5mm; /* this affects the margin in the printer settings */
  }
}
</style>
