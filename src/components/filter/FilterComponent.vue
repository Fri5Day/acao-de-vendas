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

      <v-col cols="12" sm="12" md="4" lg="3" class="margin">
        <v-row no-gutters>
          <v-col cols="12" class="d-flex align-center gap-2 mb-2 mb-sm-0">
            <v-btn color="success" elevation="2" block class="search-button" @click="emitFilter">
              <v-icon icon="mdi-magnify" class="mr-1"></v-icon>
              Buscar
            </v-btn>

            <v-btn
              color="success"
              elevation="2"
              variant="outlined"
              @click="openMoreFiltersDialog"
              class="filter-button"
              block
            >
              <v-icon icon="mdi-filter-variant" class="mr-1"></v-icon>
              Filtros
            </v-btn>

            <v-tooltip text="Limpar filtros">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-filter-remove"
                  color="error"
                  variant="text"
                  @click="emptyFilter"
                  class="clear-button"
                />
              </template>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <MoreFilterComponent
      v-model:dialog="showMoreFiltersDialog"
      :selectedFilters="selectedFilters"
      :primaryFilter="{ type: filterType, value: filterValue }"
      @apply-more-filters="onApplyMoreFilters"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, defineEmits, computed } from 'vue'
import MoreFilterComponent from '@/components/filter/MoreFilterComponent.vue'
import { useFilterStore } from '@/stores/filterStore'

const emit = defineEmits<{
  (e: 'filter', payload: { type: string; value: string }): void
  (e: 'apply-more-filters', payload: any): void
}>()

const filterStore = useFilterStore()

const filterType = ref('Descrição')
const filterValue = ref('')
const filterOptions = ['Descrição', 'Código']
const showMoreFiltersDialog = ref(false)

const selectedFilters = computed(() => filterStore.selectedFilters)

const emitFilter = () => {
  const filterPayload = {
    type: filterType.value,
    value: filterValue.value.trim()
  }
  emit('filter', filterPayload)
  emit('apply-more-filters', {
    filters: selectedFilters.value,
    primaryFilter: filterPayload
  })
}

const openMoreFiltersDialog = () => {
  showMoreFiltersDialog.value = true
}

const emptyFilter = () => {
  filterValue.value = ''
  filterStore.clearFilters()
  emit('filter', { type: filterType.value, value: '' })
  emit('apply-more-filters', {
    filters: {
      variations: { include: [], exclude: [] },
      colors: { include: [], exclude: [] },
      finishes: { include: [], exclude: [] }
    },
    primaryFilter: { type: filterType.value, value: '' }
  })
}

const onApplyMoreFilters = (payload: { filters: typeof selectedFilters.value; primaryFilter: { type: string; value: string } }) => {
  showMoreFiltersDialog.value = false
  emit('apply-more-filters', payload)
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.margin {
  margin-top: -20px;
}

.filter-button,
.search-button {
  min-width: 120px;
  max-width: 120px;
}

.clear-button {
  margin-left: 0;
}

@media (max-width: 600px) {
  .filter-button,
  .search-button {
    min-width: 120px;
    max-width: 120px;
    padding: 0 12px;
  }

  .margin {
    margin-top: 0;
  }
}
</style>
