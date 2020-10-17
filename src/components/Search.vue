<template>
	<q-input
		v-model="searchField"
		@keyup.esc="searchField = ''"
		
		outlined
		class="col"
		label="本機搜尋">

    <template v-slot:append>
      <q-icon v-if="searchField !== ''" name="close" @click="searchField = ''" class="cursor-pointer" />
      <q-icon name="search" />
    </template>

  </q-input>

  <!-- <q-input clearable filled color="purple-12" v-model="searchField" label="Search" class="col"/> -->
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import { selectAll } from 'src/directives/directive-select-all'

	export default {
		computed: {
			...mapState('LoadData', ['search']),
			searchField: {
				get() {
					return this.search
				},
				set(value) {
					this.setSearch(value)
				}
			}
		},
		methods: {
			...mapActions('LoadData', ['setSearch'])
		},
		directives: {
			selectAll
		}
	}
</script>