import type ItemInterface from "@/interface/item";
import type AdditionalFilters from "@/interface/moreFilter";

export const applyAdditionalFilters = (products: ItemInterface[], filters: AdditionalFilters): ItemInterface[] => {
  let result = products;

  if (filters.variation) {
    result = result.filter(p => p.desVariacao === filters.variation);
  }
  if (filters.color) {
    result = result.filter(p => p.desCor === filters.color);
  }
  if (filters.finish) {
    result = result.filter(p => p.desAcabamento === filters.finish);
  }

  return result;
};
