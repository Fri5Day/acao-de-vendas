<template>
  <div class="text-center">
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination
              :model-value="page"
              :length="totalPages"
              class="my-4"
              @update:model-value="onPageChange"
            ></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Props recebidas da HomeView
const props = defineProps<{
  totalItems: number
  currentPage: number
}>()

const emit = defineEmits(['page-changed'])

const page = ref(props.currentPage)
const itemsPerPage = 12
console.log('page:', page)

// Computed para calcular o número total de páginas
const totalPages = computed(() => {
  return Math.ceil(props.totalItems / itemsPerPage)
})

// Atualizar a página quando a prop `currentPage` mudar
watch(
  () => props.currentPage,
  (newPage) => {
    page.value = newPage
  }
)

// Emitir o evento de mudança de página
const onPageChange = (newPage: number) => {
  console.log('page antes:', newPage)
  page.value = newPage
  emit('page-changed', newPage)
  console.log('page depois:', newPage)
}

</script>
