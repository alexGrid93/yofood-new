export type DayMenu = Record<string, string[]>

export type MenuData = Record<string, DayMenu>

export interface FoodItem {
  ruName: string
  rsName: string
  count: number
  status?: 'done' | 'notAll' | 'noDelivery'
}
