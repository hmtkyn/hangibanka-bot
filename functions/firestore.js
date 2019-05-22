import admin from 'firebase-admin'
import serviceAccount from './firestore-key.json'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'forextakip-web.appspot.com',
})

const fire = admin

export default fire
