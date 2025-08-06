<template>
  <div class="pagination-wrapper">
    <v-pagination
      v-model="page"
      :length="totalPages"
      :total-visible="isMobile ? 1 : 7"
      class="pagination"
      @update:model-value="onPageChange"
    ></v-pagination>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  totalItems: number
  currentPage: number
  itemsPerPage?: number
}>(), {
  itemsPerPage: 12
})
const emit = defineEmits(['page-changed'])

const isMobile = ref(false)
const page = ref(props.currentPage)
const currentItemsPerPage = ref(props.itemsPerPage)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 600
  currentItemsPerPage.value = isMobile.value ? 5 : props.itemsPerPage
}

watch(() => props.currentPage, (newPage) => {
  page.value = newPage
}, { immediate: true })

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const totalPages = computed(() => {
  if (props.totalItems <= 0 || currentItemsPerPage.value <= 0) return 1
  return Math.ceil(props.totalItems / currentItemsPerPage.value)
})

const onPageChange = (newPage: number) => {
  page.value = newPage
  emit('page-changed', newPage)
}
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

.pagination {
  margin: 0;
}
</style>
