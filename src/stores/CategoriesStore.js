import { defineStore } from 'pinia'
import { getFirestore, getDocs, collection } from 'firebase/firestore'
import { fetchItem, fetchItems, setItem } from '../helpers'

export const useCategoriesStore = defineStore('CategoriesStore', {
  state: () => {
    return {
      categories: []
    }
  },
  getters: {},
  actions: {
    fetchAllCategories() {
      return new Promise((resolve) => {
        const db = getFirestore()
        getDocs(collection(db, 'categories')).then((querySnapshot) => {
          const categories = querySnapshot.docs.map((docCat) => {
            const item = { id: docCat.id, ...docCat.data() }
            setItem(this, 'categories', item)
            return item
          })
          resolve(categories)
        })
      })
    },
    fetchCategory(id) {
      return fetchItem(this, 'categories', id)
    },
    fetchCategories(ids) {
      return fetchItems(this, 'categories', ids)
    }
  }
})
