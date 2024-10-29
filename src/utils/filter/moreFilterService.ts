import type ItemInterface from "@/interface/item";
import type AdditionalFilters from "@/interface/moreFilter";

export const applyAdditionalFilters = (items: ItemInterface[], filters: AdditionalFilters): ItemInterface[] => {
  let result = items;

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
