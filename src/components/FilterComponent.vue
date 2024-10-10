<template>
  <v-container class="d-flex justify-center align-center mt-15" fluid>
    <v-card class="pa-4 filter-card">
      <v-row class="align-center justify-center">
        <v-col cols="6">
          <v-select
            v-model="filterType"
            :items="filterOptions"
            label="Filtrar por"
            outlined
            dense
            hide-details
          ></v-select>
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-if="filterType === 'Descrição'"
            v-model="filterValue"
            label="Digite a descrição"
            outlined
            dense
            hide-details
          ></v-text-field>

          <v-text-field
            v-if="filterType === 'Código'"
            v-model="filterValue"
            label="Digite o código"
            type="number"
            outlined
            dense
            hide-details
          ></v-text-field>
        </v-col>

        <v-col cols="3">
          <v-btn color="primary" @click="emitFilter" elevation="2" class="full-width">Buscar</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const emit = defineEmits<{
  (e: 'filter', payload: { type: string; value: string }): void
}>()

const filterType = ref('Descrição')
const filterValue = ref('')

const filterOptions = ['Descrição', 'Código']

const emitFilter = () => {
  if (filterValue.value.trim()) {
    emit('filter', {
      type: filterType.value,
      value: filterValue.value.trim()
    })
  } else {
    emit('filter', {
      type: filterType.value,
      value: '' 
    })
  }
}
</script>

<style scoped>
.filter-card {
  background-color: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
