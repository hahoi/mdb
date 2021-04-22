<template>
  <div>
    <template>
      <div class="q-pa-md" style="max-width: 800px">
        <q-list bordered>
          <q-expansion-item
            group="somegroup"
            icon="explore"
            label="First"
            default-opened
            header-class="text-primary"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-expansion-item
            group="somegroup"
            icon="perm_identity"
            label="Second"
            header-class="text-teal"
          >
            <q-card>
              <q-card-section>
                <div class="q-pa-md">
                  <q-list bordered>
                    <q-expansion-item group="somegroup1" label="First">
                      <q-card>
                        <q-card-section>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Quidem, eius reprehenderit eos corrupti commodi
                          magni quaerat ex numquam, dolorum officiis modi facere
                          maiores architecto suscipit iste eveniet doloribus
                          ullam aliquid.
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>

                    <q-separator />

                    <q-expansion-item group="somegroup1" label="Second">
                      <q-card>
                        <q-card-section>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Quidem, eius reprehenderit eos corrupti commodi
                          magni quaerat ex numquam, dolorum officiis modi facere
                          maiores architecto suscipit iste eveniet doloribus
                          ullam aliquid.
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>

                    <q-separator />

                    <q-expansion-item group="somegroup1" label="Third">
                      <q-card>
                        <q-card-section>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Quidem, eius reprehenderit eos corrupti commodi
                          magni quaerat ex numquam, dolorum officiis modi facere
                          maiores architecto suscipit iste eveniet doloribus
                          ullam aliquid.
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>

                    <q-separator />

                    <q-expansion-item group="somegroup1" label="Fourth">
                      <q-card class="">
                        <q-card-section>
                          <div class="row">
                            <div class="col">
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit. Quidem, eius reprehenderit eos
                              corrupti commodi magni quaerat ex numquam, dolorum
                              officiis modi facere maiores architecto suscipit
                              iste eveniet doloribus ullam aliquid.
                            </div>
                            <div class="col">
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit. Quidem, eius reprehenderit eos
                              corrupti commodi magni quaerat ex numquam, dolorum
                              officiis modi facere maiores architecto suscipit
                              iste eveniet doloribus ullam aliquid.
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>
                  </q-list>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-expansion-item
            group="somegroup"
            icon="shopping_cart"
            label="Third"
            header-class="text-purple"
          >
            <q-card>
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <q-separator />

          <q-expansion-item
            group="somegroup"
            icon="bluetooth"
            label="Fourth"
            header-class="bg-teal text-white"
            expand-icon-class="text-white"
          >
            <q-card class="bg-teal-2">
              <q-card-section>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex
                numquam, dolorum officiis modi facere maiores architecto
                suscipit iste eveniet doloribus ullam aliquid.
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </div>
    </template>
  </div>
</template>  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  components: {},
  created() {},
  mounted() {},
  watch: {},
  computed: {},
  methods: {},
};
</script>

<style>
</style>
