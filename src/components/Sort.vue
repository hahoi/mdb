<template>
	<q-select
		v-model="sortBy"
		:options="options"
		emit-value
		map-options
		class="col q-ml-sm"
		filled
		label="排序"
		stack-label />
</template>

<script>
	import { mapState, mapActions } from 'vuex'

	export default {
		data () {
		  return {
		    options: [
		      {
		      	label: '不排序',
		      	value: 'none'
		      },
		      {
		      	label: '姓名',
		      	value: 'name'
		      },
		      {
		      	label: '地址',
		      	value: 'address'
		      }
		    ]
		  }
		},
		computed: {
			...mapState('fieldrecord', ['sort']),
			sortBy: {
				get() {
					return this.sort
				},
				set(value) {
					this.setSort(value)
				}
			}
		},
		methods: {
			...mapActions('fieldrecord', ['setSort'])
		}
	}
</script>

<style scoped>
	.q-select {
		flex: 0 0 112px;
	}
</style>