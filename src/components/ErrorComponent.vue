<template>
  <v-dialog v-model="internalIsActive" max-width="500">
    <v-sheet
      class="pa-4 text-center mx-auto"
      elevation="12"
      max-width="600"
      rounded="lg"
      width="100%"
    >
      <v-icon class="mb-5" color="error" icon="mdi-close-circle" size="112"></v-icon>
      <h2 class="text-h5 mb-6">{{ text }}</h2>
      <p class="mb-4 text-medium-emphasis text-body-2">{{ errorMessage }}</p>
      <v-divider class="mb-4"></v-divider>
      <div class="text-end">
        <v-btn
          class="text-none"
          color="error"
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
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  errorMessage: {
    type: String,
    default: 'Erro desconhecido!'
  },
  text: {
    type: String,
    default: 'Erro'
  },
  isActive: {
    type: Boolean,
    required: true
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

const closeDialog = () => {
  internalIsActive.value = false
  emit('update:isActive', false)
}
</script>
