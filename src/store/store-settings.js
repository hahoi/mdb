import { LocalStorage } from 'quasar'
import { dbFirestore } from 'boot/firebase'


const state = {
	// version : "",
	settings: {
		announcement: "",
		delay: 3000,
		sysTitle: "行動資料庫",
		version:"",
	}
}

const mutations = {
	// setVersion(state, value) {
	// 	state.version = value
	// },
	setAnnouncement(state, value) {
		state.settings.announcement = value
	},
	setDelay(state, value) {
		state.settings.delay = value
	},
	setDelay(state, value) {
		state.settings.delay = value
	},

	setSettings(state, settings) {
		Object.assign(state.settings, settings)
	}
}

const actions = {
	setAnnouncement({ commit, dispatch }, value) {
		commit('setAnnouncement', value)
		dispatch('saveSettings')
	},
	setDelay({ commit, dispatch }, value) {
		commit('setDelay', value)
		dispatch('saveSettings')
	},

	setSysTitle({ commit, dispatch }, value) {
		commit('setSysTitle', value)
		dispatch('saveSettings')
	},
	saveSettings({ state }) {
		// LocalStorage.set('settings', state.settings)

		dbFirestore
			.collection("SettingData")
			.doc("系統參數")
			.set(state.settings)
			.then(() => {
				console.log("SettingData資料庫存檔成功！");
			})
			.catch(error => {
				console.error("資料庫更新失敗！", error);
			});




	},
	getSettings({ commit }) {
		dbFirestore
			.collection("SettingData")
			.doc("系統參數")
			.get()
			.then(doc => {
				// console.log("restore系統參數",doc.data())
				commit('setSettings', doc.data())
			}).catch(err => {
				console.log(err.message)
			});

		// let settings = LocalStorage.getItem('settings')
		// if (settings) {
		// 	commit('setSettings', settings)
		// }
	}
}

const getters = {
	settings: state => {
		return state.settings
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}