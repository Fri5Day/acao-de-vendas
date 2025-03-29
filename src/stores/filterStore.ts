import { defineStore } from 'pinia'
import type FilterState from '@/interface/filter/filterState'

export const useFilterStore = defineStore('filter', {
  state: () => ({
    selectedFilters: {
      variations: { include: [], exclude: [] },
      colors: { include: [], exclude: [] },
      finishes: { include: [], exclude: [] }
    } as FilterState
  }),
  
  actions: {
    updateFilters(filters: FilterState) {
      this.selectedFilters = filters
    },
    
    clearFilters() {
      this.selectedFilters = {
        variations: { include: [], exclude: [] },
        colors: { include: [], exclude: [] },
        finishes: { include: [], exclude: [] }
      }
    }
  }
})
