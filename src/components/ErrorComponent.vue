<template>
  <v-dialog v-model="internalIsActive" max-width="500" persistent>
    <v-sheet
      class="pa-4 text-center mx-auto"
      elevation="12"
      max-width="600"
      rounded="lg"
      width="100%"
    >
      <v-icon class="mb-5" :color="errorColor" size="112">{{ errorIcon }}</v-icon>
      <div class="d-flex flex-column align-center mb-4">
        <h2 class="text-h5 font-weight-bold">{{ text }}</h2>
        <span class="text-subtitle-1" :class="statusColor">{{ statusText }}</span>
      </div>

      <p class="mb-4 text-medium-emphasis text-body-2">{{ errorMessage }}</p>
      <v-divider class="mb-4"></v-divider>
      <div class="text-end">
        <v-btn
          class="text-none"
          :color="errorColor"
          variant="flat"
          width="90"
          rounded
          @click="closeDialog"
        >
          Fechar
        </v-btn>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps({
  errorMessage: {
    type: String,
    default: 'Erro desconhecido!'
  },
  text: {
    type: String,
    default: 'Erro'
  },
  status: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true
  },
  retryAction: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['update:isActive'])

const internalIsActive = ref(props.isActive)

watch(
  () => props.isActive,
  (newVal) => {
    internalIsActive.value = newVal
  }
)

const errorIcon = computed(() => {
  if (props.status >= 500) return 'mdi-server-network-off'
  if (props.status === 401 || props.status === 403) return 'mdi-lock-alert'
  return 'mdi-close-circle'
})

const errorColor = computed(() => {
  if (props.status >= 500) return 'secondary'
  if (props.status === 401 || props.status === 403) return 'error'
  return 'error'
})

const statusText = computed(() => {
  return `Status: ${props.status}`
})

const statusColor = computed(() => {
  if (props.status >= 500) return 'text-secondary'
  if (props.status === 401 || props.status === 403) return 'text-error'
  return 'text-error'
})

const closeDialog = () => {
  internalIsActive.value = false
  emit('update:isActive', false)
}
</script>

<style scoped>
.text-subtitle-1 {
  font-size: 1rem;
  font-weight: 500;
}
</style>
