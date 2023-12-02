import { defineStore } from 'pinia'
import { makeAppendChildToParent } from '@/helpers'
import { fetchItem, fetchItems } from '../helpers'

export const useForumsStore = defineStore('ForumsStore', {
  state: () => {
    return {
      forums: []
    }
  },
  getters: {},
  actions: {
    appendThreadToForum: makeAppendChildToParent({ parent: 'forums', child: 'threads' }),
    fetchForum(id) {
      return fetchItem(this, 'forums', id)
    },
    fetchForums(ids) {
      return fetchItems(this, 'forums', ids)
    }
  }
})
