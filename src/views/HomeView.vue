<template>
  <v-app>
    <NavbarComponent />
    <FilterComponent @filter="applyFilter" />
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
              v-for="(produto, index) in filteredProducts"
              :key="index"
              cols="12"
              sm="6"
              md="4"
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
                  <v-btn color="orange" text="Ver mais"></v-btn>
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
      
      <!-- Componente de erro -->
      <ErrorComponent
        :errorMessage="errorMessage"
        text="Erro na listagem dos itens"
        :isActive="showErrorDialog"
        @update:isActive="showErrorDialog = $event"
      />
    </main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Serviços
import { fetchProducts } from '@/services/productService'
import { filterProducts } from '@/services/filterService'

// Componentes
import NavbarComponent from '@/components/NavbarComponent.vue'
import FilterComponent from '@/components/FilterComponent.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'

// Interface
import type FilterPayload from '@/interface/filter'
import type ItemInterface from '@/interface/item'

// Variáveis de estado
const produtos = ref<ItemInterface[]>([])
const filteredProducts = ref<ItemInterface[]>([])
const isLoading = ref<boolean>(true)
const errorMessage = ref('')
const showErrorDialog = ref(false)

// Função para buscar os itens
onMounted(async () => {
  try {
    isLoading.value = true
    const { produtos: fetchedProducts, error } = await fetchProducts()

    if (error) {
      console.log('passou')
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

// Função para aplicar filtro
const applyFilter = (filter: FilterPayload) => {
  const { type, value } = filter

  if (value) {
    const filtered = filterProducts(produtos.value, type, value)
    filteredProducts.value = filtered
  } // remover else, provisorio.
  else {
    const filtered = filterProducts(produtos.value, type, value)
    filteredProducts.value = [...filtered]
  }
}
</script>
