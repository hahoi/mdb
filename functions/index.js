const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');
const adminApp = admin.initializeApp();

exports.AdminListUsers = functions.https.onCall((data, context) => {
    return adminApp.auth().listUsers().then(listUsersResult => {
        let users = []
        listUsersResult.users.forEach((userRecord) => {
            users.push(userRecord.toJSON())
        })
        return users
    }).catch(err => {
        return err;
    })
})

exports.AdminDeleteUsers = functions.https.onCall((data, context) => {
    const uid = data.uid;
    return adminApp.auth().deleteUser(uid)
        .then(function () {
            console.log('Successfully deleted user');
            return 'Successfully deleted user'
        })
        .catch(function (error) {
            console.log('Error deleting user:', error);
        });
})