<template>
  <v-app>
    <NavbarComponent />
    <FilterComponent @filter="applyFilter" @apply-more-filters="applyMoreFilters" />
    <main style="margin-top: 64px">
      <v-container>
        <!-- Exibe o spinner durante o carregamento -->
        <v-row justify="center" v-if="isLoading">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-col>
        </v-row>

        <!-- Exibe o conteúdo após o carregamento -->
        <template v-else>
          <v-chip variant="outlined"> Total itens filtrados: {{ filteredProducts.length }} </v-chip>
          <v-row>
            <v-col
              v-for="(produto, index) in paginatedProducts"
              :key="index"
              cols="12"
              sm="6"
              md="3"
              class="mb-4 mt-10"
            >
              <v-card>
                <v-card-title>{{ produto.descricao }}</v-card-title>
                <v-card-subtitle class="pt-4">Código do Item: {{ produto.item }}</v-card-subtitle>

                <v-card-text>
                  <div>Variação: {{ produto.desVariacao }}</div>
                  <div>Cor: {{ produto.desCor }}</div>
                  <div>Acabamento: {{ produto.desAcabamento }}</div>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" text="Ver Mais" />
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="mt-10" v-if="filteredProducts.length === 0">
            <v-col>
              <v-alert type="info"> Nenhum item encontrado com o filtro aplicado. </v-alert>
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
        :total-items="filteredProducts.length"
        :current-page="currentPage"
        @page-changed="changePage"
      />
    </main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Serviços
import { fetchProducts } from '@/services/productService'
import { filterProducts } from '@/utils/filter/filterService'
import { applyAdditionalFilters } from '@/utils/filter/moreFilterService'

// Componentes
import NavbarComponent from '@/components/NavbarComponent.vue'
import FilterComponent from '@/components/filter/FilterComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import Pagination from '@/components/PaginationComponent.vue'

// Interface
import type FilterPayload from '@/interface/filter'
import type ItemInterface from '@/interface/item'
import type AdditionalFilters from '@/interface/moreFilter'

// Variáveis de estado
const produtos = ref<ItemInterface[]>([])
const filteredProducts = ref<ItemInterface[]>([])
const isLoading = ref<boolean>(true)
const errorMessage = ref('')
const showErrorDialog = ref(false)
const currentPage = ref(1)
const itemsPerPage = 12

// Função para buscar os itens
onMounted(async () => {
  try {
    isLoading.value = true
    const { produtos: fetchedProducts, error } = await fetchProducts()

    if (error) {
      errorMessage.value = error
      showErrorDialog.value = true
    } else {
      produtos.value = fetchedProducts
      filteredProducts.value = fetchedProducts
    }
  } catch (err) {
    errorMessage.value = 'Ocorreu um erro inesperado.'
    showErrorDialog.value = true
  } finally {
    isLoading.value = false
  }
})

// Computed property para calcular os produtos paginados
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// Função para aplicar filtro
const applyFilter = (filter: FilterPayload) => {
  const { type, value } = filter

  if (value) {
    const filtered = filterProducts(produtos.value, type, value)
    filteredProducts.value = filtered
  } else {
    filteredProducts.value = [...produtos.value]
  }
  currentPage.value = 1 // Resetar a página ao aplicar novo filtro
}

// Função para aplicar filtros adicionais
const applyMoreFilters = (filters: AdditionalFilters) => {
  const filtered = applyAdditionalFilters(produtos.value, filters)
  filteredProducts.value = filtered
  currentPage.value = 1 // Resetar a página ao aplicar novo filtro
}

// Função para alterar a página
const changePage = (page: number) => {
  currentPage.value = page
}
</script>
