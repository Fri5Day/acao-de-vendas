import type { ItemDetalhado } from '@/interface/item/itemDetalhadoInterface';

export const filterItems = (items: ItemDetalhado[], filterType: string, filterValue: string) => {
  if (!filterValue) return items;

  return items.filter((item) => {
    if (filterType === 'Descrição') {
      return item.descricao.toLowerCase().includes(filterValue.toLowerCase());
    } else if (filterType === 'Código') {
      return item.item.toString() === filterValue;
    }
    return true;
  });
};
