import { ref } from 'vue';
import { api } from '@/services/api';
import type ItemInterface from '@/interface/item';

const token = import.meta.env.VITE_API_TOKEN;

export const fetchProducts = async (): Promise<ItemInterface[]> => { 
  const produtos = ref<ItemInterface[]>([]);
  try {
    const response = await api.get('/TSMCadGR_Unidades_Codificacao.ExecutarMetodoInterpretado', {
      params: {
        UnitEMetodo: 'ACAO_DE_VENDAS.JsonItens',
        Body: 0
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    produtos.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar os dados da API:', error);
  }
  return produtos.value; 
};
