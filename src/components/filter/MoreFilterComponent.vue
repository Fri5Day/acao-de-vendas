<template>
  <v-dialog v-model="localDialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h5">Filtros adicionais</span>
      </v-card-title>

      <v-card-text>
        <v-select
          v-model="selectedVariation"
          :items="variations"
          label="Variação"
          outlined
        ></v-select>
        <v-select v-model="selectedColor" :items="colors" label="Cor" outlined></v-select>
        <v-select v-model="selectedFinish" :items="finishes" label="Acabamento" outlined></v-select>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="applyFilters">Aplicar</v-btn>
        <v-btn @click="closeDialog">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { fetchProducts } from '@/services/productService'

// Recebe a prop `dialog` que controla a abertura do modal
const props = defineProps<{ dialog: boolean }>()
const emit = defineEmits(['apply-more-filters', 'update:dialog'])

// Estado dos filtros
const selectedVariation = ref<string | null>(null)
const selectedColor = ref<string | null>(null)
const selectedFinish = ref<string | null>(null)

// Estado local para controlar o diálogo
const localDialog = ref(props.dialog)

// Arrays para armazenar os valores recebidos da API
const variations = ref<string[]>([])
const colors = ref<string[]>([])
const finishes = ref<string[]>([])

// Função para buscar as opções de filtro da API
const loadFilterOptions = async () => {
  const { products, error } = await fetchProducts()

  if (error) {
    console.error('Erro ao carregar filtros:', error)
    return
  }

  // Preenchendo as opções de filtro com base nos dados da API
  variations.value = [...new Set(products.map((p) => p.desVariacao))]
  colors.value = [...new Set(products.map((p) => p.desCor))]
  finishes.value = [...new Set(products.map((p) => p.desAcabamento))]
}

// Função para aplicar os filtros
const applyFilters = () => {
  const filters = {
    variation: selectedVariation.value || '',
    color: selectedColor.value || '',
    finish: selectedFinish.value || ''
  }
  emit('apply-more-filters', filters)
  closeDialog() 
}

const closeDialog = () => {
  emit('update:dialog', false) 
}

// Observe a prop `dialog` para atualizar o estado local
watch(
  () => props.dialog,
  (newVal) => {
    localDialog.value = newVal // Atualiza o estado local quando a prop mudar
  }
)

// Carregar as opções de filtro quando o componente for montado
onMounted(loadFilterOptions)
</script>
