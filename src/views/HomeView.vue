<template>
  <main>
    <NavbarComponent />
    <v-container>
      <v-row>
        <v-col cols="12" md="4" v-for="produto in produtos" :key="produto.item">
          <v-card class="mx-auto" max-width="400">
            <v-card-title>{{ produto.descricao }}</v-card-title>
            <v-card-subtitle class="pt-4">Código do Item: {{ produto.item }}</v-card-subtitle>

            <v-card-text>
              <div>Variação: {{ produto.desVariacao }}</div>
              <div>Cor: {{ produto.desCor }}</div>
              <div>Acabamento: {{ produto.desAcabamento }}</div>
            </v-card-text>

            <v-card-actions>
              <v-btn color="orange" text="Ver mais" />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
import { api } from '@/services/api'
import type ItemInterface from '@/interface/item'

// Definindo a lista de produtos
const produtos = ref<ItemInterface[]>([])
const token = import.meta.env.VITE_API_TOKEN

onMounted(async () => {
  const fetchProdutos = async () => {
    try {
      const response = await api.get('/TSMCadGR_Unidades_Codificacao.ExecutarMetodoInterpretado', {
        params: {
          UnitEMetodo: 'ACAO_DE_VENDAS.JsonItens',
          Body: 0
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      produtos.value = response.data
    } catch (error) {
      console.error('Erro ao buscar os dados da API:', error)
    }
  }

  await fetchProdutos()
})
</script>
