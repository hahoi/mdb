<!--  -->
<template>
  <div class=""></div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.quickstart();
  },
  methods: {
    async quickstart() {
      // Imports the Google Cloud client library
      const vision = require("@google-cloud/vision");

      // Creates a client
      const client = new vision.ImageAnnotatorClient();

      // Performs label detection on the image file
      const [result] = await client.labelDetection("../assets/IMG_1154.JPG");
      const labels = result.labelAnnotations;
      console.log("Labels:");
      labels.forEach(label => console.log(label.description));
    }
  }
};
</script>
<style scoped></style>
