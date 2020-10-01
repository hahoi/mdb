import * as firebase from "firebase/app"

import "firebase/auth"
import "firebase/database"
import 'firebase/firestore'
import 'firebase/storage'
import "firebase/functions"

// ADD YOUR FIREBASE CONFIG OBJECT HERE:
var firebaseConfig = {
  apiKey: "AIzaSyBYCDtdD4-sjpgDvB4gRjSqOq9w7KjDe38",
  authDomain: "pthgdb-9549c.firebaseapp.com",
  databaseURL: "https://pthgdb-9549c.firebaseio.com",
  projectId: "pthgdb-9549c",
  storageBucket: "pthgdb-9549c.appspot.com",
  messagingSenderId: "404918654035",
  appId: "1:404918654035:web:4a7a1e1f7d7d6dd05a62a6"
}

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebaseApp.auth()
const firebaseDb = firebaseApp.database()
const dbFirestore = firebaseApp.firestore()
const dbStorage = firebaseApp.storage()
const dbFunctions = firebaseApp.functions()

export { firebaseAuth, firebaseDb,dbFirestore,dbStorage, dbFunctions }