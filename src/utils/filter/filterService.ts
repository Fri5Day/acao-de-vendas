import type { ItemDetalhado } from '@/interface/item/itemDetalhadoInterface';

export const filterItems = (items: ItemDetalhado[], filterType: string, filterValue: string) => {
  if (!filterValue) return items;

  const searchValue = filterValue.toLowerCase();
  
  // Otimização para busca por código
  if (filterType === 'Código') {
    return items.filter((item) => item.item.toString() === filterValue);
  }
  
  // Otimização para busca por descrição
  if (filterType === 'Descrição') {
    return items.filter((item) => item.descricao.toLowerCase().includes(searchValue));
  }

  return items;
};
