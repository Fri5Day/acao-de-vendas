<template>
  <v-card variant="outlined" class="filter-card">
    <div class="d-flex align-center justify-space-between pa-4 flex-wrap">
      <div class="d-flex align-center mb-2 mb-sm-0">
        <v-icon :icon="icon" class="mr-2" :color="modelValue.filterType === 'include' ? 'primary' : 'error'"></v-icon>
        <span class="text-subtitle-1 font-weight-medium filter-label">{{ label }}</span>
      </div>
      <v-radio-group
        v-model="filterType"
        inline 
        density="compact"
        class="radio-group ma-0"
      >
        <v-radio
          label="Seleção"
          value="include"
          color="primary"
          density="compact"
          class="radio-button"
        ></v-radio>
        <v-radio
          label="Exceção"
          value="exclude"
          color="error"
          density="compact"
          class="radio-button"
        ></v-radio>
      </v-radio-group>
    </div>

    <v-divider></v-divider>

    <div class="pa-4">
      <v-select
        v-model="selectedItems"
        :items="items"
        :label="'Selecionar ' + label"
        multiple
        chips
        closable-chips
        variant="outlined"
        density="comfortable"
        :color="modelValue.filterType === 'include' ? 'primary' : 'error'"
        hide-details
      >
        <template v-slot:prepend>
          <v-icon 
            :icon="modelValue.filterType === 'include' ? 'mdi-checkbox-multiple-marked' : 'mdi-close-circle'" 
            :color="modelValue.filterType === 'include' ? 'primary' : 'error'"
          ></v-icon>
        </template>
      </v-select>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type FilterConfig from '@/interface/filter/filterConfig'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: FilterConfig
  label: string
  icon: string
  items: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterConfig): void
}>()

const selectedItems = computed({
  get: () => props.modelValue.selectedItems,
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      selectedItems: value
    })
  }
})

const filterType = computed({
  get: () => props.modelValue.filterType,
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      filterType: value
    })
  }
})
</script>

<style scoped>
.filter-card {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;
}

.filter-card:hover {
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.radio-group {
  display: flex;
  gap: 8px;
  margin-left: auto;
  align-items: center;
  min-width: 200px;
  justify-content: flex-end;
}

.radio-button {
  margin-right: 16px;
}

.filter-label {
  color: #666;
  min-width: 120px;
}

:deep(.v-field) {
  border-color: rgba(0, 0, 0, 0.08);
}

:deep(.v-field:hover) {
  border-color: rgba(0, 0, 0, 0.2);
}

@media (max-width: 600px) {
  .radio-group {
    width: 100%;
    justify-content: flex-end;
    margin-top: 8px;
    min-width: 100%;
  }

  .radio-button {
    margin-right: 8px;
  }

  .filter-label {
    min-width: auto;
  }
}
</style>
