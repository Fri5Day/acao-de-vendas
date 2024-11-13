<template>
  <v-dialog v-model="localDialog" max-width="500" @click:outside="closeDialog">
    <v-card>
      <v-card-title>
        <span class="text-h5">Filtros adicionais</span>
      </v-card-title>

      <v-card-text>
        <v-row align="center">
          <v-col cols="10">
            <v-select
              v-model="selectedVariation"
              :items="variations"
              label="Variação"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="2" class="d-flex align-center justify-center">
            <v-btn icon variant="plain" @click="clearFilter('variation')">
              <v-icon small>mdi-close-circle</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row align="center">
          <v-col cols="10">
            <v-select
              v-model="selectedColor"
              :items="colors"
              label="Cor"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="2" class="d-flex align-center justify-center">
            <v-btn icon variant="plain" @click="clearFilter('color')">
              <v-icon small>mdi-close-circle</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row align="center">
          <v-col cols="10">
            <v-select
              v-model="selectedFinish"
              :items="finishes"
              label="Acabamento"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="2" class="d-flex align-center justify-center">
            <v-btn icon variant="plain" @click="clearFilter('finish')">
              <v-icon small>mdi-close-circle</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn color="error" @click="closeDialog">Fechar</v-btn>
        <v-btn color="primary" @click="applyFilters">Aplicar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { fetchItems } from '@/services/getApiService'

const props = defineProps<{ dialog: boolean }>()
const emit = defineEmits(['apply-more-filters', 'update:dialog'])

// Estado dos filtros
const selectedVariation = ref<string | null>(null)
const selectedColor = ref<string | null>(null)
const selectedFinish = ref<string | null>(null)

// Estado local para controlar o diálogo
const localDialog = ref(false)

// Arrays para armazenar os valores recebidos da API
const variations = ref<string[]>([])
const colors = ref<string[]>([])
const finishes = ref<string[]>([])

const loadFilterOptions = async () => {
  const { items, error } = await fetchItems()

  if (error) {
    console.error('Erro ao carregar filtros:', error)
    return
  }

  variations.value = [...new Set(items.map((p) => p.desVariacao))]
  colors.value = [...new Set(items.map((p) => p.desCor))]
  finishes.value = [...new Set(items.map((p) => p.desAcabamento))]
}

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
  localDialog.value = false
  emit('update:dialog', false)
}

const clearFilter = (filterType: 'variation' | 'color' | 'finish') => {
  if (filterType === 'variation') {
    selectedVariation.value = null
  } else if (filterType === 'color') {
    selectedColor.value = null
  } else if (filterType === 'finish') {
    selectedFinish.value = null
  }
}

watch(
  () => props.dialog,
  (newVal) => {
    localDialog.value = newVal
  }
)

onMounted(loadFilterOptions)
</script>
