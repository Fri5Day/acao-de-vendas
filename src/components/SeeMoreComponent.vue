<template>
  <v-dialog :model-value="isActive" @update:model-value="closeDialog" max-width="450">
    <v-card v-if="item" max-width="500px" max-height="600px">
      <v-img :max-width="500" :max-height="600" v-if="item?.imagens[0]?.url != null">
        <v-carousel hide-delimiters show-arrows="hover">
          <v-carousel-item v-for="(imagem, index) in item.imagens" :key="index" :src="imagem.url" />
        </v-carousel>
      </v-img>
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
import type { ItemDetalhado } from '@/interface/item/itemDetalhadoInterface'

const props = defineProps({
  isActive: {
    type: Boolean,
    required: true
  },
  item: {
    type: Object as () => ItemDetalhado | null,
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
