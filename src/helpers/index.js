import { getFirestore, doc, onSnapshot } from 'firebase/firestore'

const findById = (resources, id) => {
  if (!resources) return null

  return resources.find((r) => r.id === id)
}

const upsert = (resources, resource) => {
  const index = resources.findIndex((r) => r.id === resource.id)
  if (resource.id && index !== -1) {
    resources[index] = resource
  } else {
    resources.push(resource)
  }
}

const makeAppendChildToParent = ({ parent, child }) => {
  return (store, { childId, parentId }) => {
    const resource = findById(store[parent], parentId)
    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}

const setItem = (store, resource, item) => {
  upsert(store[resource], item)
}

const fetchItem = (store, resource, id) => {
  return new Promise((resolve) => {
    const db = getFirestore()
    onSnapshot(doc(db, resource, id), (itemDoc) => {
      const item = { ...itemDoc.data(), id: itemDoc.id }
      setItem(store, resource, item)
      resolve(item)
    })
  })
}

const fetchItems = (store, resource, ids) => {
  return Promise.all(ids.map((id) => fetchItem(store, resource, id)))
}

export { findById, upsert, makeAppendChildToParent, setItem, fetchItem, fetchItems }
