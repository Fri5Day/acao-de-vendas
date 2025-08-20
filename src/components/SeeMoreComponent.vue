<template>
  <v-dialog :model-value="isActive" persistent max-width="450">
    <v-card v-if="item" class="detail-card">
      <v-card-title class="d-flex justify-space-between align-center pa-2 ml-2">
        <span class="text-h6">Item detalhado</span>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
      </v-card-title>
      <v-divider />

      <div v-if="hasImage" class="detail-image">
        <v-carousel 
          v-if="Array.isArray(item.url) && item.url.length > 1"
          height="300"
          show-arrows="hover"
          hide-delimiter-background
        >
          <v-carousel-item
            v-for="(imageUrl, index) in item.url"
            :key="index"
          >
            <v-img
              :src="imageUrl"
              height="300"
              class="image"
              cover
              alt="Imagem do item"
            />
          </v-carousel-item>
        </v-carousel>
        <v-img
          v-else
          :src="Array.isArray(item.url) ? item.url[0] : item.url"
          :max-height="300"
          cover
          class="image"
          alt="Imagem do item"
        />
      </div>

      <!-- <div v-else class="no-image-message">
        <v-icon icon="mdi-image-off" size="large" color="grey"></v-icon>
        <p class="text-grey">Nenhuma imagem disponível para este item</p>
      </div> -->

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
            <span class="value">{{ item.qtMontagem }}</span>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import type ItemInterface from '@/interface/item/itemInterface'

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

const hasImage = computed(() => {
  if (!props.item?.url) return false
  return Array.isArray(props.item.url) ? props.item.url.length > 0 : props.item.url.trim() !== ''
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

.image {
  width: 100%;
  border-radius: 8px;
}

.no-image-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  text-align: center;
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
