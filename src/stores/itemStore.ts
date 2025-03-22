import { defineStore } from 'pinia'
import { fetchItems } from '@/services/getApiService'
import type ItemInterface from '@/interface/item/itemInterface'

export const useItemStore = defineStore('items', {
  state: () => ({
    items: [] as ItemInterface[],
    loading: false,
    error: null as string | null,
    errorStatus: null as number | null
  }),
  actions: {
    async loadItems() {
      this.loading = true
      this.error = null
      this.errorStatus = null
      try {
        this.items = await fetchItems()
      } catch (error) {
        console.error('Erro ao carregar itens:', error)
        if (error instanceof Error) {
          this.error = error.message
          this.errorStatus = (error as any).status
        }
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
