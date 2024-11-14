<template>
  <v-app>
    <NavbarComponent />
    <FilterComponent @filter="applyFilter" @apply-more-filters="applyMoreFilters" />
    <main style="margin-top: 64px">
      <v-container>
        <v-row justify="center" v-if="isLoading">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p>Carregando Itens...</p>
          </v-col>
        </v-row>

        <template v-else>
          <v-chip variant="outlined"> Total itens filtrados: {{ filteredItems.length }} </v-chip>
          <v-row>
            <v-col
              v-for="(item, index) in paginatedItems"
              :key="index"
              cols="12"
              sm="6"
              md="3"
              class="mb-4 mt-10"
            >
              <v-card>
                <v-card-title>{{ item.descricao }}</v-card-title>
                <v-card-subtitle class="pt-4">Código do Item: {{ item.item }}</v-card-subtitle>

                <v-card-text class="headline">
                  <div class="truncate">Variação: {{ item.desVariacao }}</div>
                  <div class="truncate">Cor: {{ item.desCor }}</div>
                  <div class="truncate">Acabamento: {{ item.desAcabamento }}</div>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" text="Ver Mais" @click="openItemDetails(item)" />
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="mt-10" v-if="filteredItems.length === 0">
            <v-col>
              <v-alert type="info"> Nenhum item encontrado com o filtro aplicado. </v-alert>
            </v-col>
          </v-row>
        </template>
      </v-container>

      <!-- Componentes -->
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
    </main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Serviços
import { fetchItems } from '@/services/getApiService'
import { filterItems } from '@/utils/filter/filterService'
import { applyAdditionalFilters } from '@/utils/filter/moreFilterService'
import { getPaginatedItems } from '@/utils/pagination'

// Componentes
import NavbarComponent from '@/components/NavbarComponent.vue'
import FilterComponent from '@/components/filter/FilterComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import Pagination from '@/components/PaginationComponent.vue'
import SeeMoreComponent from '@/components/SeeMoreComponent.vue'

// Interface
import type FilterPayload from '@/interface/filter'
import type ItemInterface from '@/interface/item'
import type AdditionalFilters from '@/interface/moreFilter'

// Estado dos itens
const items = ref<ItemInterface[]>([])
const filteredItems = ref<ItemInterface[]>([])
const selectedItem = ref<ItemInterface | null>(null)

// Variáveis de estado
const isLoading = ref<boolean>(true)
const errorMessage = ref('')
const showErrorDialog = ref(false)
const showSeeMoreDialog = ref(false)

// Paginação
const currentPage = ref(1)
const itemsPerPage = 12

const activeFilters = ref({
  primary: { type: '', value: '' },
  additional: {} as AdditionalFilters
});

onMounted(async () => {
  try {
    isLoading.value = true
    const { items: fetchedItems, error } = await fetchItems()

    if (error) {
      errorMessage.value = error
      showErrorDialog.value = true
    } else {
      items.value = fetchedItems
      filteredItems.value = fetchedItems
    }
  } catch (err) {
    errorMessage.value = 'Ocorreu um erro inesperado.'
    showErrorDialog.value = true
  } finally {
    isLoading.value = false
  }
})

function openItemDetails(item: ItemInterface) {
  selectedItem.value = item
  showSeeMoreDialog.value = true
}

const paginatedItems = computed(() =>
  getPaginatedItems(filteredItems.value, currentPage.value, itemsPerPage)
)

const applyFilter = (filter: FilterPayload) => {
  activeFilters.value.primary = filter;
  applyAllFilters();
}

const applyMoreFilters = (filters: AdditionalFilters) => {
  activeFilters.value.additional = filters;
  applyAllFilters();
}

const applyAllFilters = () => {
  let filtered = [...items.value];

  if (activeFilters.value.primary.value) {
    filtered = filterItems(filtered, activeFilters.value.primary.type, activeFilters.value.primary.value);
  }

  if (Object.keys(activeFilters.value.additional).length > 0) {
    filtered = applyAdditionalFilters(filtered, activeFilters.value.additional);
  }

  filteredItems.value = filtered;
  currentPage.value = 1;
}

const changePage = (page: number) => {
  currentPage.value = page;
}
</script>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; 
}
</style>