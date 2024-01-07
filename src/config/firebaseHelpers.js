import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import firebaseConfig from '@/config/firebase'

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore()

export { firebaseApp, db }
