import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore('CategoriesStore', {
  state: () => {
    return {
      categories: []
    }
  },
  getters: {},
  actions: {}
})
