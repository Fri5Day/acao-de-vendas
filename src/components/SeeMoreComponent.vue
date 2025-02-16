<template>
  <v-dialog :model-value="isActive" @update:model-value="closeDialog" max-width="450">
    <v-card v-if="item" max-width="500px">
      <v-img height="200px" src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" cover></v-img>
      <h3 class="text-h5 ml-5 mt-2">{{ item.descricao }}</h3>
      <v-card-text>
        <div>Código: {{ fullCodeItem }}</div>
        <div>Variação: {{ item.desVariacao }}</div>
        <div>Cor: {{ item.desCor }}</div>
        <div>Acabamento: {{ item.desAcabamento }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="outlined" color="error" @click="closeDialog">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import type ItemInterface from '@/interface/item'

const props = defineProps({
  isActive: {
    type: Boolean,
    required: true
  },
  item: {
    type: Object as () => ItemInterface | null,
    required: true
  }
})

const fullCodeItem = computed(() => {
  return props.item
    ? `${props.item.item}.${props.item.variacao}.${props.item.cor}.${props.item.acabamento}`
    : ''
})

const emit = defineEmits(['update:isActive'])

const closeDialog = () => {
  emit('update:isActive', false)
}
</script>
