<template>
  <v-app>
    <NavbarComponent />
    <FilterComponent @filter="applyFilter" />
    <main style="margin-top: 64px">
      <v-container>
        <v-chip variant="outlined"> Total itens filtrados: {{ filteredProducts.length }} </v-chip>
        <v-row>
          <v-col
            v-for="produto in filteredProducts"
            :key="produto.item"
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
        <v-row v-if="filteredProducts.length === 0">
          <v-col>
            <v-alert type="info"> Nenhum produto encontrado com o filtro aplicado. </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

//serviços
import { fetchProducts } from '@/services/productService'
import { filterProducts } from '@/services/filterService'

//componentes
import NavbarComponent from '@/components/NavbarComponent.vue'
import FilterComponent from '@/components/FilterComponent.vue'

//interface
import type FilterPayload from '@/interface/filter'
import type ItemInterface from '@/interface/item'

const produtos = ref<ItemInterface[]>([])
const filteredProducts = ref<ItemInterface[]>([])

onMounted(async () => {
  produtos.value = await fetchProducts()
  filteredProducts.value = produtos.value
})

const applyFilter = (filter: FilterPayload) => {
  const { type, value } = filter

  let filtered = [...produtos.value]

  if (value) {
    filtered = filterProducts(filtered, type, value)
  }

  filteredProducts.value = filtered
}
</script>
