import type { ImagemInterface } from "./imagemInterface"

export interface DetalhamentoInterface {
  variacao: number
  desVariacao: string
  cor: number
  desCor: string
  acabamento: number
  desAcabamento: string
  saldo: number
  imagens: Array<ImagemInterface>
}
