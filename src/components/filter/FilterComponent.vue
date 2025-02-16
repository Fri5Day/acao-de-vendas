<template>
  <v-container class="d-flex justify-center align-center mt-15" fluid>
    <v-row class="align-center justify-center">
      <v-col cols="12" sm="6" md="4" lg="4">
        <v-select
          v-model="filterType"
          :items="filterOptions"
          label="Filtrar por"
          density="compact"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="4">
        <v-text-field
          v-if="filterType === 'Descrição'"
          v-model="filterValue"
          label="Digite a descrição"
          density="compact"
          variant="outlined"
        />

        <v-text-field
          v-if="filterType === 'Código'"
          v-model="filterValue"
          label="Digite o código"
          type="number"
          density="compact"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12" sm="12" md="4" lg="2" class="teste d-flex align-center justify-end gap-2">
        <v-btn color="success" elevation="2" @click="emitFilter">Buscar</v-btn>

        <v-btn color="success" elevation="2" variant="outlined" @click="openMoreFiltersDialog">
          +Filtros
        </v-btn>

        <v-btn icon="mdi-filter-remove" color="error" variant="text" @click="emptyFilter" />
      </v-col>
    </v-row>

    <MoreFilterComponent
      :dialog="showMoreFiltersDialog"
      @apply-more-filters="onApplyMoreFilters"
      @update:dialog="onClose"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import MoreFilterComponent from '@/components/filter/MoreFilterComponent.vue'

const emit = defineEmits<{
  (e: 'filter', payload: { type: string; value: string }): void
  (
    e: 'apply-more-filters',
    filters: { variation: string[]; color: string[]; finish: string[] }
  ): void
  (e: 'clear-filters'): void
}>()

const filterType = ref('Descrição')
const filterValue = ref('')
const filterOptions = ['Descrição', 'Código']
const showMoreFiltersDialog = ref(false)

const selectedFilters = ref<{ variations: string[]; colors: string[]; finishes: string[] }>({
  variations: [],
  colors: [],
  finishes: []
})

const emitFilter = () => {
  emit('filter', {
    type: filterType.value,
    value: filterValue.value.trim()
  })
}

const openMoreFiltersDialog = () => {
  showMoreFiltersDialog.value = true
}

const emptyFilter = () => {
  filterValue.value = ''
  selectedFilters.value = { variations: [], colors: [], finishes: [] }
  emitFilter()
  emit('apply-more-filters', selectedFilters.value)
}

const onApplyMoreFilters = (filters: {
  variations: string[]
  colors: string[]
  finishes: string[]
}) => {
  selectedFilters.value = filters
  emit('apply-more-filters', filters)
  showMoreFiltersDialog.value = false
}

const onClose = () => {
  showMoreFiltersDialog.value = false
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.teste {
  margin-top: -20px;
}
</style>
