import { defineStore } from 'pinia'
import { makeAppendChildToParent } from '@/helpers'

export const useForumsStore = defineStore('ForumsStore', {
  state: () => {
    return {
      forums: []
    }
  },
  getters: {},
  actions: {
    appendThreadToForum: makeAppendChildToParent({ parent: 'forums', child: 'threads' })
  }
})
