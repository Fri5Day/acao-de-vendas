<template>
  <v-dialog v-model="dialogModel" max-width="600" @click:outside="closeDialog">
    <transition name="slide-alert">
      <v-alert
        v-if="alertFilter"
        class="alert-top-right"
        text="Selecione ao menos um filtro para aplicar!"
        type="warning"
      ></v-alert>
    </transition>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-filter-variant" class="mr-2"></v-icon>
        Filtros Avançados
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" density="comfortable" @click="closeDialog"></v-btn>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" v-for="filter in filters" :key="filter.key" class="mb-4">
            <v-card variant="outlined" class="pa-3">
              <div class="d-flex align-center mb-2">
                <v-icon :icon="filter.icon" class="mr-2"></v-icon>
                <span class="text-subtitle-1 font-weight-medium">{{ filter.label }}</span>
              </div>

              <v-row no-gutters>
                <v-col cols="12" class="mb-2">
                  <v-select
                    v-model="filter.selected"
                    :items="filter.items"
                    :label="'Selecionar ' + filter.label"
                    multiple
                    chips
                    closable-chips
                    density="compact"
                    variant="outlined"
                    class="mb-2"
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-checkbox-multiple-marked"></v-icon>
                    </template>
                  </v-select>
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="filter.excluded"
                    :items="filter.items"
                    :label="'Excluir ' + filter.label"
                    multiple
                    chips
                    closable-chips
                    density="compact"
                    variant="outlined"
                    color="error"
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-close-circle"></v-icon>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-row no-gutters>
          <v-col cols="12" sm="6" class="d-flex justify-center">
            <v-btn color="error" variant="text" block class="mb-2 mb-sm-0" @click="clearAllFilters">
              Limpar Todos
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" class="d-flex justify-center">
            <v-btn
              color="primary"
              variant="outlined"
              :loading="isApplying"
              block
              @click="applyFilters"
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
import type FilterConfig from '@/interface/filter/filterConfig'
import type FilterState from '@/interface/filter/filterState'

const props = defineProps<{
  dialog: boolean
  selectedFilters?: FilterState
}>()

const emit = defineEmits(['update:dialog', 'apply-more-filters'])

const dialogModel = computed({
  get: () => props.dialog,
  set: (value) => emit('update:dialog', value)
})

const itemStore = useItemStore()

const filters = ref<FilterConfig[]>([
  {
    key: 'variations',
    label: 'Variações',
    icon: 'mdi-shape-outline',
    items: [],
    selected: [],
    excluded: []
  },
  {
    key: 'colors',
    label: 'Cores',
    icon: 'mdi-palette',
    items: [],
    selected: [],
    excluded: []
  },
  {
    key: 'finishes',
    label: 'Acabamentos',
    icon: 'mdi-texture',
    items: [],
    selected: [],
    excluded: []
  }
])

const isApplying = ref(false)
const alertFilter = ref(false)

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

const hasActiveFilters = computed(() => {
  return filters.value.some(
    (filter: FilterConfig) => filter.selected.length > 0 || filter.excluded.length > 0
  )
})

const applyFilters = () => {
  try {
    isApplying.value = true

    if (!hasActiveFilters.value) {
      alertFilter.value = true
      setTimeout(() => (alertFilter.value = false), 4000)
      return
    }

    const filtersToApply = filters.value.reduce<FilterState>(
      (acc: FilterState, filter: FilterConfig) => {
        acc[filter.key as keyof FilterState] = {
          include: filter.selected,
          exclude: filter.excluded
        }
        return acc
      },
      {
        variations: { include: [], exclude: [] },
        colors: { include: [], exclude: [] },
        finishes: { include: [], exclude: [] }
      }
    )

    emit('apply-more-filters', filtersToApply)
    closeDialog()
  } catch (error) {
    console.error('Erro ao aplicar filtros:', error)
  } finally {
    isApplying.value = false
  }
}

const clearAllFilters = () => {
  filters.value.forEach((filter: FilterConfig) => {
    filter.selected = []
    filter.excluded = []
  })
}

watch(
  () => props.selectedFilters,
  (newSelectedFilters) => {
    if (newSelectedFilters) {
      filters.value.forEach((filter: FilterConfig) => {
        const key = filter.key as keyof FilterState
        filter.selected = newSelectedFilters[key].include
        filter.excluded = newSelectedFilters[key].exclude
      })
    }
  },
  { immediate: true }
)

const closeDialog = () => {
  emit('update:dialog', false)
}
</script>

<style scoped>
.alert-top-right {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  width: auto;
  max-width: calc(100% - 20px);
}

.slide-alert-enter-active,
.slide-alert-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.slide-alert-enter-from {
  transform: translateX(10%);
  opacity: 0;
}

.slide-alert-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-alert-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-alert-leave-to {
  transform: translateX(10%);
  opacity: 0;
}
</style>
