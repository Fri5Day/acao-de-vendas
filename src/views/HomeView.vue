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
        <v-chip variant="outlined">
          Total itens filtrados: {{ filteredItems?.length || 0 }}
        </v-chip>

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

const items = ref<ItemInterface[]>([])
const selectedItem = ref<ItemDetalhado | null>(null)
const isLoading = ref<boolean>(true)
const errorMessage = ref('')
const showErrorDialog = ref(false)
const showSeeMoreDialog = ref(false)
const isMobile = ref(window.innerWidth <= 600)
const currentPage = ref(1)
const itemsPerPage = 10

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
  { title: 'Saldo', key: 'saldo', align: 'start' as const },
  { title: 'Ações', key: 'actions', align: 'center' as const, sortable: false }
])

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 600
}

onMounted(() => {
  window.addEventListener('resize', updateIsMobile)
})

const transformItems = (items: ItemInterface[]): ItemDetalhado[] => {
  return items.flatMap((item) =>
    item.detalhamento
      ? item.detalhamento.map((detalhe) => ({
          ...item,
          ...detalhe
        }))
      : []
  )
}

const transformedItems = computed(() => transformItems(items.value))

const filteredItems = computed(() => {
  let filtered = transformedItems.value

  if (activeFilters.value.primary.value) {
    filtered = filterItems(
      filtered,
      activeFilters.value.primary.type,
      activeFilters.value.primary.value
    )
  }

  if (Object.keys(activeFilters.value.additional).length > 0) {
    filtered = applyAdditionalFilters(filtered, activeFilters.value.additional)
  }

  return filtered
})

const paginatedItems = computed(() =>
  getPaginatedItems(filteredItems.value, currentPage.value, itemsPerPage)
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

const applyMoreFilters = (filters: AdditionalFilters) => {
  activeFilters.value.additional = filters
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

.v-data-table tbody tr:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}
</style>
