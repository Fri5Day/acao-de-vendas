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

      <template v-else-if="filteredItems.length != 0">
        <v-chip variant="outlined">
          Total itens filtrados: {{ filteredItems?.length || 0 }}
        </v-chip>

        <div class="mt-5">
          <v-data-table
            :headers="headers"
            :items="paginatedItems"
            :items-per-page="itemsPerPage"
            :page="currentPage"
            hide-default-footer
            class="truncate"
          >
            <template v-slot:item.actions="{ item }">
              <v-btn variant="text" color="primary" icon="$info" @click="openItemDetails(item)" />
            </template>
          </v-data-table>
        </div>
      </template>

      <template v-else>
        <v-row class="mt-10" v-if="filteredItems.length === 0">
          <v-col>
            <v-empty-state
              icon="mdi-magnify-close"
              title="Nenhum registro encontrado."
              text="Não foi possível encontrar nenhum registro para o filtro aplicado."
            ></v-empty-state>
          </v-col>
        </v-row>
      </template>
    </v-container>

    <ErrorComponent
      :errorMessage="errorMessage"
      text="Erro na listagem dos itens"
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
import { ref, computed, onMounted } from 'vue'
import { fetchItems } from '@/services/getApiService'
import { filterItems } from '@/utils/filter/filterService'
import { applyAdditionalFilters } from '@/utils/filter/moreFilterService'
import { getPaginatedItems } from '@/utils/pagination'
import NavbarComponent from '@/components/NavbarComponent.vue'
import FilterComponent from '@/components/filter/FilterComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import Pagination from '@/components/PaginationComponent.vue'
import SeeMoreComponent from '@/components/SeeMoreComponent.vue'
import type FilterPayload from '@/interface/filter'
import type ItemInterface from '@/interface/item/itemInterface'
import type { ItemDetalhado } from '@/interface/item/itemDetalhadoInterface'
import type AdditionalFilters from '@/interface/moreFilter'

const items = ref<ItemInterface[]>([])
const filteredItems = ref<ItemDetalhado[]>([])
const selectedItem = ref<ItemDetalhado | null>(null)

const isLoading = ref<boolean>(true)
const errorMessage = ref('')
const showErrorDialog = ref(false)
const showSeeMoreDialog = ref(false)

const currentPage = ref(1)
const itemsPerPage = 10

const activeFilters = ref({
  primary: { type: '', value: '' },
  additional: {} as AdditionalFilters
})

const headers = ref([
  { title: 'Código', key: 'item', align: 'start' },
  { title: 'Descrição', key: 'descricao', align: 'start' },
  { title: 'Variação', key: 'desVariacao', align: 'start' },
  { title: 'Cor', key: 'desCor', align: 'start' },
  { title: 'Acabamento', key: 'desAcabamento', align: 'start' },
  { title: 'Ações', key: 'actions', align: 'center', sortable: false }
])

const transformItems = (items: ItemInterface[]): ItemDetalhado[] => {
  return items.flatMap((item) =>
    item.detalhamento.map((detalhe) => ({
      ...item,
      ...detalhe
    }))
  )
}

onMounted(async () => {
  try {
    isLoading.value = true
    const { items: fetchedItems, error } = await fetchItems()

    if (error) {
      errorMessage.value = error
      showErrorDialog.value = true
    } else {
      items.value = fetchedItems
      filteredItems.value = transformItems(fetchedItems)
    }
  } catch (err) {
    errorMessage.value = 'Ocorreu um erro inesperado.'
    showErrorDialog.value = true
  } finally {
    isLoading.value = false
  }
})

function openItemDetails(item: ItemDetalhado) {
  selectedItem.value = item
  showSeeMoreDialog.value = true
}

const paginatedItems = computed(() =>
  getPaginatedItems(filteredItems.value, currentPage.value, itemsPerPage)
)

const applyFilter = (filter: FilterPayload) => {
  activeFilters.value.primary = filter
  applyAllFilters()
}

const applyMoreFilters = (filters: AdditionalFilters) => {
  activeFilters.value.additional = filters
  applyAllFilters()
}

const applyAllFilters = () => {
  let filtered = transformItems(items.value)

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

  filteredItems.value = filtered
  currentPage.value = 1
}

const changePage = (page: number) => {
  currentPage.value = page
}
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
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
