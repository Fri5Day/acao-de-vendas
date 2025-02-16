<template>
  <div class="filter-container">
    <v-select
      v-model="model"
      :label="label"
      :items="items"
      multiple
      density="compact"
      variant="outlined"
      clearable
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string[]
  label: string
  items: string[]
}>()
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<style scoped>
.filter-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-btn {
  margin-left: auto;
}
</style>
