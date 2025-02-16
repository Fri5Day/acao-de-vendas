import type ItemInterface from "@/interface/item";
import type AdditionalFilters from "@/interface/moreFilter";

export const applyAdditionalFilters = (items: ItemInterface[], filters: AdditionalFilters): ItemInterface[] => {
  let result = items;

  if (filters.variations && filters.variations.length > 0) {
    result = result.filter(p => filters.variations.includes(p.desVariacao));
  }
  if (filters.colors && filters.colors.length > 0) {
    result = result.filter(p => filters.colors.includes(p.desCor));
  }
  if (filters.finishes && filters.finishes.length > 0) {
    result = result.filter(p => filters.finishes.includes(p.desAcabamento));
  }

  return result;
};