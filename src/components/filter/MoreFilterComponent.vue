<template>
  <v-dialog v-model="dialogModel" max-width="500" @click:outside="closeDialog">
    <v-card>
      <v-card-title>Filtros Adicionais</v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12">
            <FilterSelect v-model="selectedVariations" label="Variação" :items="variations" />
          </v-col>
          <v-col cols="12">
            <FilterSelect v-model="selectedColors" label="Cor" :items="colors" />
          </v-col>
          <v-col cols="12">
            <FilterSelect v-model="selectedFinishes" label="Acabamento" :items="finishes" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="closeDialog">Cancelar</v-btn>
        <v-btn variant="outlined" color="primary" :loading="isApplying" @click="applyFilters"
          >Aplicar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import FilterSelect from '@/components/filter/FilterSelect.vue'
import { fetchItems } from '@/services/getApiService'

const props = defineProps<{ dialog: boolean }>()
const emit = defineEmits(['update:dialog', 'apply-more-filters'])

const dialogModel = computed({
  get: () => props.dialog,
  set: (value) => emit('update:dialog', value)
})

const variations = ref<string[]>([])
const colors = ref<string[]>([])
const finishes = ref<string[]>([])

const selectedVariations = ref<string[]>([])
const selectedColors = ref<string[]>([])
const selectedFinishes = ref<string[]>([])
const isApplying = ref(false)

const loadFilterOptions = async () => {
  try {
    const { items, error } = await fetchItems()
    if (error) {
      console.error('Erro ao carregar filtros:', error)
      return
    }

    const uniqueValues = {
      variations: new Set<string>(),
      colors: new Set<string>(),
      finishes: new Set<string>()
    }

    items.forEach((p) => {
      uniqueValues.variations.add(p.desVariacao)
      uniqueValues.colors.add(p.desCor)
      uniqueValues.finishes.add(p.desAcabamento)
    })

    variations.value = [...uniqueValues.variations]
    colors.value = [...uniqueValues.colors]
    finishes.value = [...uniqueValues.finishes]
  } catch (err) {
    console.error('Erro inesperado ao carregar filtros:', err)
  }
}

watch(
  () => props.dialog,
  (newVal) => {
    if (!newVal) {
      selectedVariations.value = []
      selectedColors.value = []
      selectedFinishes.value = []
    }
  }
)

const applyFilters = () => {
  try {
    isApplying.value = true

    const filters = {
      variations: selectedVariations.value,
      colors: selectedColors.value,
      finishes: selectedFinishes.value
    }

    // if (Object.values(filters).flat().length === 0) {
    //   alert('Selecione pelo menos um filtro para aplicar.')
    //   isApplying.value = false
    //   return
    // }

    emit('apply-more-filters', filters)
    closeDialog()
  } catch (error) {
    console.error(error)
  } finally {
    isApplying.value = false
  }
}
const closeDialog = () => {
  emit('update:dialog', false)
}

onMounted(loadFilterOptions)
</script>
