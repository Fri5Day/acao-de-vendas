<template>
  <v-dialog v-model="internalIsActive" max-width="500">
    <v-card>
      <v-card-title class="headline">{{ text }}</v-card-title>
      <v-card-text>{{ errorMessage }}</v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="closeDialog">Fechar</v-btn>
      </v-card-actions>
    </v-card>
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
