import { defineStore } from 'pinia'

export const useAppStore = defineStore('AppStore', {
  state: () => {
    return {
      unsubscribes: []
    }
  },
  actions: {
    appendUnsubsribe(unsubscribe) {
      this.unsubscribes.push(unsubscribe)
    },
    clearAllUnsubscribes() {
      this.unsubscribes = []
    },
    unsubscribeAllSnapshots() {
      this.unsubscribes.forEach((unsubscribe) => unsubscribe())
      this.clearAllUnsubscribes()
    }
  }
})
