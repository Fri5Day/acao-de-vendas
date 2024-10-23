<template>
  <v-dialog :model-value="isActive" @update:model-value="closeDialog" max-width="500">
    <v-card v-if="product"> 
      <h3 class="ml-5 mt-2">{{ product.descricao }}</h3>
      <v-card-text>
        <div>Id: {{ product.item }}</div>
        <div>Variação: {{ product.variacao }} - {{ product.desVariacao }}</div>
        <div>Cor: {{ product.cor }} - {{ product.desCor }}</div>
        <div>Acabamento: {{ product.acabamento }} - {{ product.desAcabamento }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="closeDialog">Fechar</v-btn>
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
  product: {
    type: Object as () => ItemInterface | null, 
    required: true
  }
})

const emit = defineEmits(['update:isActive'])

const closeDialog = () => {
  emit('update:isActive', false)
}
</script>
