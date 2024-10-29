<template>
  <v-dialog :model-value="isActive" @update:model-value="closeDialog" max-width="500">
    <v-card v-if="item"> 
      <h3 class="ml-5 mt-2">{{ item.descricao }}</h3>
      <v-card-text>
        <div>Código: {{ item.item }}</div>
        <div>Variação: {{ item.variacao }} - {{ item.desVariacao }}</div>
        <div>Cor: {{ item.cor }} - {{ item.desCor }}</div>
        <div>Acabamento: {{ item.acabamento }} - {{ item.desAcabamento }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="closeDialog">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type ItemInterface from '@/interface/item'

defineProps({
  isActive: {
    type: Boolean,
    required: true
  },
  item: {
    type: Object as () => ItemInterface | null, 
    required: true
  }
})

const emit = defineEmits(['update:isActive'])

const closeDialog = () => {
  emit('update:isActive', false)
}
</script>
