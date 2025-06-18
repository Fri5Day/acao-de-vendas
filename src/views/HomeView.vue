<template>
  <v-app>
    <NavbarComponent />
    <FilterComponent @filter="applyFilter" @apply-more-filters="applyMoreFilters" />
    <v-container>
      <v-row justify="center" v-if="isLoading">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <p>Carregando Itens...</p>
        </v-col>
      </v-row>

      <template v-else-if="filteredItems.length === 0">
        <v-row class="mt-10">
          <v-col>
            <v-empty-state
              icon="mdi-magnify-close"
              title="Nenhum registro encontrado."
              text="Não foi possível encontrar nenhum registro para o filtro aplicado."
            ></v-empty-state>
          </v-col>
        </v-row>
      </template>

      <template v-else>
        <div class="d-flex align-center filtered-items-count">
          <v-chip variant="outlined">
            Total: {{ filteredItems?.length || 0 }} Itens
          </v-chip>

          <v-tooltip v-if="hasActiveFilters" :text="getActiveFiltersText" location="bottom">
            <template v-slot:activator="{ props }">
              <v-chip
                v-bind="props"
                size="small"
                color="primary"
                class="active-filters-chip ml-2"
                variant="elevated"
              >
                <v-icon icon="mdi-filter-check" size="small" class="mr-1"></v-icon>
              </v-chip>
            </template>
          </v-tooltip>
        </div>

        <div class="mt-5">
          <v-data-table
            :headers="responsiveHeaders"
            :items="paginatedItems"
            :items-per-page="itemsPerPage"
            :page="currentPage"
            hide-default-footer
          >
            <template #[`item.actions`]="{ item }">
              <v-tooltip text="Ver detalhes">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="text"
                    color="primary"
                    icon="$info"
                    @click="openItemDetails(item)"
                  />
                </template>
              </v-tooltip>
            </template>
          </v-data-table>
        </div>
      </template>
    </v-container>

    <ErrorComponent
      :errorMessage="errorMessage"
      text="Erro na listagem dos itens"
      :status="itemStore.errorStatus || 500"
      :isActive="showErrorDialog"
      @update:isActive="showErrorDialog = $event"
    />
    <Pagination
      :total-items="filteredItems.length"
      :current-page="currentPage"
      @page-changed="changePage"
    />
    <SeeMoreComponent
      v-if="selectedItem"
      :isActive="showSeeMoreDialog"
      :item="selectedItem"
      @update:isActive="showSeeMoreDialog = $event"
    />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { filterItems } from '@/utils/filter/filterService'
import { applyAdditionalFilters } from '@/utils/filter/moreFilterService'
import { getPaginatedItems } from '@/utils/pagination'
import { useItemStore } from '@/stores/itemStore'
import { useFilterStore } from '@/stores/filterStore'
import NavbarComponent from '@/components/NavbarComponent.vue'
import FilterComponent from '@/components/filter/FilterComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import Pagination from '@/components/PaginationComponent.vue'
import SeeMoreComponent from '@/components/SeeMoreComponent.vue'
import type FilterPayload from '@/interface/filter/filter'
import type ItemInterface from '@/interface/item/itemInterface'
import type { ItemDetalhado } from '@/interface/item/itemDetalhadoInterface'
import type AdditionalFilters from '@/interface/filter/moreFilter'

const itemStore = useItemStore()
const filterStore = useFilterStore()

const items = ref<ItemInterface[]>([])
const selectedItem = ref<ItemDetalhado | null>(null)
const isLoading = ref<boolean>(true)
const errorMessage = ref('')
const showErrorDialog = ref(false)
const showSeeMoreDialog = ref(false)
const isMobile = ref(window.innerWidth <= 600)
const currentPage = ref(1)
const itemsPerPage = computed(() => isMobile.value ? 5 : 10)

const activeFilters = ref({
  primary: { type: '', value: '' },
  additional: {
    variations: { include: [], exclude: [] },
    colors: { include: [], exclude: [] },
    finishes: { include: [], exclude: [] }
  } as AdditionalFilters
})

const headers = ref([
  { title: 'Código', key: 'item', align: 'start' as const },
  { title: 'Descrição', key: 'descricao', align: 'start' as const },
  { title: 'Variação', key: 'desVariacao', align: 'start' as const },
  { title: 'Cor', key: 'desCor', align: 'start' as const },
  { title: 'Acabamento', key: 'desAcabamento', align: 'start' as const },
  { title: 'Saldo', key: 'qtMontagem', align: 'start' as const },
  { title: 'Ações', key: 'actions', align: 'center' as const, sortable: false }
])

const hasActiveFilters = computed(() => {
  return Object.values(filterStore.selectedFilters).some(
    (filter) => filter.include.length > 0 || filter.exclude.length > 0
  )
})

const getActiveFiltersText = computed(() => {
  const filterLabels = {
    variations: 'Variações',
    colors: 'Cores',
    finishes: 'Acabamentos'
  }

  return Object.entries(filterStore.selectedFilters)
    .flatMap(([key, filter]) => {
      const texts = []
      if (filter.include.length > 0) {
        texts.push(`${filterLabels[key as keyof typeof filterLabels]}: ${filter.include.length} selecionada(s)`)
      }
      if (filter.exclude.length > 0) {
        texts.push(`${filterLabels[key as keyof typeof filterLabels]}: ${filter.exclude.length} excluída(s)`)
      }
      return texts
    })
    .join('\n')
})

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 600
}

const filteredItems = computed(() => {
  if (!activeFilters.value.primary.value && 
      !Object.values(activeFilters.value.additional).some(filter => 
        filter.include.length > 0 || filter.exclude.length > 0
      )) {
    return items.value
  }

  let filtered = items.value

  if (activeFilters.value.primary.value) {
    filtered = filterItems(
      filtered,
      activeFilters.value.primary.type,
      activeFilters.value.primary.value
    )
  }

  if (Object.values(activeFilters.value.additional).some(filter => 
    filter.include.length > 0 || filter.exclude.length > 0
  )) {
    filtered = applyAdditionalFilters(filtered, activeFilters.value.additional)
  }

  return filtered
})

const paginatedItems = computed(() =>
  getPaginatedItems(filteredItems.value, currentPage.value, itemsPerPage.value)
)

const responsiveHeaders = computed(() => {
  if (isMobile.value) {
    return headers.value.filter((header) => header.key === 'descricao' || header.key === 'actions')
  }
  return headers.value
})

const updateLoadingState = (loading: boolean) => {
  isLoading.value = loading
}

const updateItems = (newItems: ItemInterface[]) => {
  items.value = newItems
}

const updateError = (error: string | null) => {
  errorMessage.value = error || 'Ocorreu um erro inesperado.'
  showErrorDialog.value = !!error
}

onMounted(async () => {
  try {
    updateLoadingState(true)
    await itemStore.loadItems()
    updateItems(itemStore.items)
  } catch (err) {
    updateError(itemStore.error)
  } finally {
    updateLoadingState(false)
  }
})

const applyFilter = (filter: FilterPayload) => {
  activeFilters.value.primary = filter
  currentPage.value = 1
}

const applyMoreFilters = (payload: { filters: AdditionalFilters; primaryFilter: FilterPayload }) => {
  activeFilters.value.primary = payload.primaryFilter
  activeFilters.value.additional = payload.filters
  currentPage.value = 1
}

const openItemDetails = (item: ItemDetalhado) => {
  selectedItem.value = item
  showSeeMoreDialog.value = true
}

const changePage = (page: number) => {
  currentPage.value = page
}

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<style scoped>
.v-data-table {
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-data-table :deep(.v-table__wrapper > table > tbody > tr:hover) {
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.active-filters-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.filtered-items-count {
  color: #0b4667;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filtered-items-count :deep(.v-chip) {
  background-color: #e3f2fd;
  color: #1976d2;
  border: none;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 4px 12px;
  height: 28px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

@media (max-width: 600px) {
  .active-filters-chip {
    margin-left: 8px;
  }
}
</style>
