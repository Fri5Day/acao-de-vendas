<template>
  <v-dialog :model-value="isActive" persistent max-width="450">
    <v-card v-if="item" class="detail-card">
      <v-card-title class="d-flex justify-space-between align-center pa-2 ml-2">
        <span class="text-h6">Item detalhado</span>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
      </v-card-title>
      <v-divider />
      <v-img v-if="hasImages" class="detail-image" :max-height="300" cover>
        <v-carousel
          v-if="item.imagens.length > 1"
          hide-delimiters
          show-arrows="hover"
          height="300"
          class="rounded-t-lg"
        >
          <v-carousel-item
            v-for="(imagem, index) in item.imagens"
            :key="index"
            :src="imagem.url"
            cover
          />
        </v-carousel>
        <img v-else :src="item.imagens[0].url" alt="Imagem do item" class="single-image" />
      </v-img>

      <v-card-text class="detail-content pa-4">
        <h3 class="text-h6 mb-3">{{ item.descricao }}</h3>
        <div class="info-list">
          <div class="info-item">
            <span class="label">Código:</span>
            <span class="value">{{ fullCodeItem }}</span>
          </div>
          <div class="info-item">
            <span class="label">Variação:</span>
            <span class="value">{{ item.desVariacao }}</span>
          </div>
          <div class="info-item">
            <span class="label">Cor:</span>
            <span class="value">{{ item.desCor }}</span>
          </div>
          <div class="info-item">
            <span class="label">Acabamento:</span>
            <span class="value">{{ item.desAcabamento }}</span>
          </div>
          <div class="info-item">
            <span class="label">Saldo:</span>
            <span class="value">{{ item.saldo }}</span>
          </div>
        </div>
      </v-card-text>
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

const hasImages = computed(() => {
  return props.item?.imagens && props.item.imagens.length > 0
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

<style scoped>
.detail-image {
  width: 100%;
  margin: 8px 0;
  padding: 0 16px;
}

.single-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  word-break: break-word;
}

.label {
  font-weight: 500;
  min-width: 100px;
  color: #666;
  margin-right: 8px;
}
</style>
