import type ItemInterface from '@/interface/item';

export const filterProducts = (products: ItemInterface[], filterType: string, filterValue: string) => {
  if (!filterValue) return products;

  return products.filter((product) => {
    if (filterType === 'Descrição') {
      return product.descricao.toLowerCase().includes(filterValue.toLowerCase());
    } else if (filterType === 'Código') {
      return product.item.toString() === filterValue;
    }
    return true;
  });
};
