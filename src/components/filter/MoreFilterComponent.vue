<template>
  <v-dialog v-model="dialogModel" max-width="600" persistent>
    <v-card class="d-flex flex-column" style="max-height: 90vh">
      <v-card-title class="d-flex align-center dialog-header">
        <div class="d-flex align-center ml-2">
          <v-icon icon="mdi-filter-variant" class="mr-2"></v-icon>
          Filtros Avançados
        </div>
        <v-spacer />
        <v-btn
          class="mr-2"
          icon="mdi-close"
          variant="text"
          density="comfortable"
          @click="closeDialog"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <div class="flex-grow-1 overflow-y-auto">
        <v-card-text class="pa-4">
          <v-row no-gutters>
            <v-col cols="12" v-for="(filter, index) in filters" :key="filter.key" class="mb-4">
              <FilterCard
                v-model="filters[index]"
                :label="filter.label"
                :icon="filter.icon"
                :items="filter.items"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </div>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-row no-gutters>
          <v-col cols="12" sm="6" class="d-flex justify-center pr-sm-2">
            <v-btn
              color="error"
              variant="text"
              block
              class="mb-2 mb-sm-0"
              @click="clearAllFilters"
              prepend-icon="mdi-close-circle"
            >
              Limpar Todos
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" class="d-flex justify-center pl-sm-2">
            <v-btn
              color="success"
              variant="elevated"
              block
              @click="applyFilters"
              prepend-icon="mdi-check-circle"
            >
              Aplicar Filtros
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useItemStore } from '@/stores/itemStore'
import { useFilterStore } from '@/stores/filterStore'
import FilterCard from './FilterCard.vue'
import type FilterConfig from '@/interface/filter/filterConfig'
import type FilterState from '@/interface/filter/filterState'

const props = defineProps<{
  dialog: boolean
  selectedFilters: FilterState
  primaryFilter: { type: string; value: string }
}>()

const emit = defineEmits(['update:dialog', 'apply-more-filters'])

const dialogModel = computed({
  get: () => props.dialog,
  set: (value) => emit('update:dialog', value)
})

const itemStore = useItemStore()
const filterStore = useFilterStore()

const originalFilters = ref<FilterConfig[]>([])

const filters = ref<FilterConfig[]>([
  {
    key: 'variations',
    label: 'Variações',
    icon: 'mdi-shape-outline',
    items: [],
    selectedItems: [],
    filterType: 'include'
  },
  {
    key: 'colors',
    label: 'Cores',
    icon: 'mdi-palette',
    items: [],
    selectedItems: [],
    filterType: 'include'
  },
  {
    key: 'finishes',
    label: 'Acabamentos',
    icon: 'mdi-texture',
    items: [],
    selectedItems: [],
    filterType: 'include'
  }
])

const uniqueValues = computed(() => {
  if (!itemStore.items.length) return null

  const values = {
    variations: new Set<string>(),
    colors: new Set<string>(),
    finishes: new Set<string>()
  }

  itemStore.items.forEach((item) => {
    if (item.detalhamento?.length) {
      item.detalhamento.forEach((detalhe) => {
        if (detalhe.desVariacao) values.variations.add(detalhe.desVariacao)
        if (detalhe.desCor) values.colors.add(detalhe.desCor)
        if (detalhe.desAcabamento) values.finishes.add(detalhe.desAcabamento)
      })
    }
  })

  return {
    variations: [...values.variations].sort(),
    colors: [...values.colors].sort(),
    finishes: [...values.finishes].sort()
  }
})

watch(
  uniqueValues,
  (newValues) => {
    if (newValues) {
      filters.value.forEach((filter: FilterConfig) => {
        const key = filter.key as keyof typeof newValues
        filter.items = newValues[key]
      })
    }
  },
  { immediate: true }
)

watch(
  () => filterStore.selectedFilters,
  (newSelectedFilters) => {
    if (newSelectedFilters) {
      filters.value.forEach((filter: FilterConfig) => {
        const key = filter.key as keyof FilterState
        const hasExclude = newSelectedFilters[key].exclude.length > 0

        filter.filterType = hasExclude ? 'exclude' : 'include'
        filter.selectedItems = hasExclude
          ? [...newSelectedFilters[key].exclude]
          : [...newSelectedFilters[key].include]
      })

      originalFilters.value = filters.value.map((filter) => ({
        ...filter,
        selectedItems: [...filter.selectedItems],
        filterType: filter.filterType
      }))
    } else {
      filters.value.forEach((filter) => {
        filter.selectedItems = []
        filter.filterType = 'include'
      })
      originalFilters.value = filters.value.map((filter) => ({
        ...filter,
        selectedItems: [],
        filterType: 'include'
      }))
    }
  },
  { immediate: true }
)

const clearAllFilters = () => {
  filters.value.forEach((filter: FilterConfig) => {
    filter.selectedItems = []
    filter.filterType = 'include'
  })
}

const closeDialog = () => {
  filters.value = originalFilters.value.map((filter) => ({
    ...filter,
    selectedItems: [...filter.selectedItems],
    filterType: filter.filterType
  }))
  emit('update:dialog', false)
}

const applyFilters = () => {
  const filtersToApply = filters.value.reduce<FilterState>(
    (acc: FilterState, filter: FilterConfig) => {
      acc[filter.key as keyof FilterState] = {
        include: filter.filterType === 'include' ? filter.selectedItems : [],
        exclude: filter.filterType === 'exclude' ? filter.selectedItems : []
      }
      return acc
    },
    {
      variations: { include: [], exclude: [] },
      colors: { include: [], exclude: [] },
      finishes: { include: [], exclude: [] }
    }
  )

  originalFilters.value = filters.value.map((filter) => ({
    ...filter,
    selectedItems: [...filter.selectedItems],
    filterType: filter.filterType
  }))

  filterStore.updateFilters(filtersToApply)
  emit('apply-more-filters', {
    filters: filtersToApply,
    primaryFilter: props.primaryFilter
  })
  emit('update:dialog', false)
}
</script>

<style scoped>
.dialog-header {
  padding: 16px;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

:deep(.v-card-title) {
  padding: 0;
}

.flex-grow-1 {
  flex-grow: 1;
}

.overflow-y-auto {
  overflow-y: auto;
}

:deep(.v-card-actions) {
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
