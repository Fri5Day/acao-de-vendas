import type ItemInterface from "./itemInterface";

export interface ItemDetalhado extends ItemInterface {
  imagens: Array<{ url: string }>
}