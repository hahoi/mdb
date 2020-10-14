import { LocalStorage, Loading } from 'quasar'
import { firebaseAuth, dbFirestore } from 'boot/firebase'
import { powerRouter } from 'src/router/routes'


const state = {
	loggedIn: false,
	newRouter: [],
	newMenu: [],
	allRoles: [],
	userData: {},
	DepartmentArray: [],
	DepartmentObject: {}
}

const mutations = {
	setLoggedIn(state, value) {
		state.loggedIn = value
	},
	setNewRouter(state, value) {
		state.newRouter = value
	},
	setNewMenu(state, value) {
		state.newMenu = value
	},
	setAllRoles(state, value) {
		state.allRoles = value
	},
	setUserData(state, value) {
		state.userData = value
	},
	setDepartmentArray(state, value) {
		state.DepartmentArray = value
	},
	setDepartmentObject(state, value) {
		state.DepartmentObject = value
	},
	clearUserData(state) {
		state.userData = {}
	},
	clearNewMenu(state) {
		state.newMenu = []
	},
	clearNewRouter(state) {
		state.newRouter = []
	},
	clearAllRoles(state) {
		state.allRoles = []
	}
}

const actions = {
	// setNewRouter({ commit }, value) {
	// 	commit('setNewRouter', value)
	// },
	// setNewMenu({ commit }, value) {
	// 	commit('setNewMenu', value)
	// },
	registerUser({ }, payload) {
		Loading.show()
		firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
			.then(response => {
				console.log('response: ', response)
				//註冊成功，送出回傳認證，顯示提示視窗
				firebaseAuth.currentUser.sendEmailVerification()
					.then(() => {
						// response.user.emailVerified  的狀態是 false
						this.$q.notify("請到註冊的郵件信箱收信，點擊連結回傳確認。", "註冊成功")
					})
					.catch(error => {
						this.$q.notify("寄發認證郵件錯誤" + error)
					})
				//================新增=================
				// payload.authId = response.user.uid;
				payload.createAt = new Date(); //後台寫入物件日期
				payload.changeAt = new Date();
				// payload.emailVerified = false
				payload.role = []
				payload.memo = ""
				payload.states = false
				delete payload.password //password 不保存在自訂user資料庫中

				// console.log("payload",payload);
				dbFirestore
					.collection("MenuUsers")
					.doc(response.user.uid)
					.set(payload)
					.then(() => {
						console.log("註冊新增使用者");
					})
					.catch(error => {
						console.log(error);
					});
			})
			.catch(error => {
				var errorCode = error.code;
				// var errorMessage = error.message;
				if (errorCode == "auth/weak-password") {
					errorCode = "這個密碼太簡單！";
				}
				if (errorCode == "auth/email-already-in-use") {
					errorCode = "這個 email 帳號已經被使用過了！";
				}
				if (errorCode == "auth/invalid-email") {
					errorCode = "email 不符規定！";
				}
				if (errorCode == "auth/operation-not-allowed") {
					errorCode = "未啟用「電子郵件/密碼」登入方式！";
				}
				// this.$q.notify(error.message)
				this.$q.notify(errorCode)

			})
	},
	loginUser({ state }, payload) {
		Loading.show()
		firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
			.then(response => {
				console.log("login:", response)
			})
			.catch(error => {
				this.$q.notify(error.message)
			})
	},
	logoutUser() {
		console.log('logoutUser')
		firebaseAuth.signOut()
	},

	//從入口App.vue就開始監聽，mounted＝>this.handleAuthStateChange()
	//監聽使用者是否登入
	//網頁reload、開新視窗、分頁，user值都會存在
	//將loggedIn值，分別存在 state 及 LocalStorage
	//router.beforeEach 每次跳轉頁面，從 LocalStorage 取值做判斷，而不是執行 onAuthStateChange
	//開發設計時，因user值一直存在，需要注意loggedIn、userData的值，是否符合實際登入狀態，否則會出錯
	handleAuthStateChange({ state, commit, dispatch }) {
		firebaseAuth.onAuthStateChanged(user => {
			// console.log("user",user) 網頁reload、開新視窗、分頁，user都會存在
			Loading.hide()
			if (user) {
				var displayName = user.displayName;
				var email = user.email;
				var emailVerified = user.emailVerified;
				var photoURL = user.photoURL;
				var isAnonymous = user.isAnonymous;
				var uid = user.uid;
				var providerData = user.providerData;
				console.log("displayName:", displayName)
				console.log("email:", email)
				console.log("emailVerified:", emailVerified)
				console.log("photoURL:", photoURL)
				console.log("isAnonymous:", isAnonymous)
				console.log("uid:", uid)
				console.log("providerData:", providerData)
				console.log(JSON.stringify(user, null, '  '))

				// const domain = user.email.split("@")[1];
				// if (domain === "pthg.gov.tw") {
				// 	console.log("====================login sussed=================================");
				// } else {
				// 	this.$q.notify("不是屏東縣政府G Suite帳號");
				// 	firebaseAuth.signOut();
				// 	return false
				// }


				if (user.emailVerified) {
					dispatch('getUserData', user.uid)
					// dispatch('tasks/fbReadData', null, { root: true })
				} else {
					this.$q.notify("你註冊的Email帳號尚未驗證！請到註冊的郵件信箱收信，點擊連結回傳確認。", "注意")
					return false
				}
			}
			else {
				// commit('tasks/clearTasks', null, { root: true })
				// commit('tasks/setTasksDownloaded', false, { root: true })
				commit('setLoggedIn', false)
				commit('clearUserData', null)
				commit('clearNewMenu', null)
				commit('clearNewRouter', null)
				LocalStorage.set('loggedIn', false)
				this.$router.replace('/auth').catch(err => { })
			}
		})
	},
	// 取得使用者資料
	// 依權限設定路由、功能表選項
	getUserData({ commit, state }, userid) {
		dbFirestore
			.collection("MenuUsers").doc(userid)
			.get()
			.then(doc => {
				let UserData = {
					// authId: doc.data().authId,
					email: doc.data().email,
					department: doc.data().department,
					name: doc.data().name,
					role: doc.data().role,
					// emailVerified: doc.data().emailVerified,
					memo: doc.data().memo,
					telephone: doc.data().telephone,
					states: doc.data().states
				};
				commit('setUserData', UserData)
			})
			.then(() => {
				if (!state.userData.states) {
					this.$q.notify(`你的Email帳號${state.userData.name}已註冊並回傳認證，但目前是停用狀態，請洽系統管理員。`, "注意")
					firebaseAuth.signOut()
				} else {
					let newrouter = powerRouter //路由換成主要功能的路由
					let newchildren = powerRouter[0].children.filter(route => {
						if (route.meta) {
							//檢查 route.mata.role 是否存在 使用者權限陣列 store.getters.role 中
							if (state.userData.role.indexOf(route.meta.role) === -1) {
								return false
							} else {
								return true // 產生 newchildren 陣列
							}
						}
					})
					newrouter[0].children = newchildren //使用者權限的路由
					console.log(newrouter[0].children)
					let essentialLinks = newrouter[0].children.map((item) => {
						let menu = {
							title: item.meta.title,
							// caption: item.meta.title,
							icon: item.meta.icon,
							link: item.path,
						};
						console.log(menu)
						return menu;
					});

					// 為使用者添加權限路由及功能表
					commit('setNewMenu', essentialLinks)
					commit('setNewRouter', newrouter)
					this.$router.addRoutes(newrouter) //添加动态路由

					// 登入首頁
					commit('setLoggedIn', true)
					LocalStorage.set('loggedIn', true)
					this.$router.replace('/').catch(err => { })
				}
			})
	},


	//讀取機關單位
	getDepartment({ commit, state }) {
		let departArray = []

		dbFirestore
			.collection("SettingData")
			.doc("Department") //單位
			.get()
			.then((doc) => {
				let depart = doc.data().depart;
				depart
					.sort(function (a, b) {
						return a.order - b.order; //小的排在前面，注意字串排序，用減號 不是 <
					})
					.forEach((item, inx) => {
						departArray.push(item.title);
					});
				commit('setDepartmentObject', depart)
				commit('setDepartmentArray', departArray)
				// console.log(state.DepartmentArray)
				// console.log(state.DepartmentObject)
			})
	},

	//讀取所有的權限
	getAllRoles({ commit, state }) {
		let allRoles = []
		powerRouter[0].children.forEach(item => {
			// console.log(item)
			if (item.meta) {
				allRoles.push(item.meta.role);
			}
		});
		// console.log(allRoles)
		commit('setAllRoles', allRoles)
	}

}

const getters = {

}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}