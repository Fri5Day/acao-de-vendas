import type { DetalhamentoInterface } from "./detalhamentoInterface"

export default interface ItemInterface {
  item: number
  descricao: string
  detalhamento: Array<DetalhamentoInterface>
}
