import type { DayMenu, FoodItem } from '@/utils/types.ts'
import { EmojiMap } from '@/constants/emojiMap.ts'

export const useDeliveryCheck = () => {
  const menuDataFromStorage = localStorage.getItem('menuData')

  const getTotalDishes = (day: string): Record<string, FoodItem[]> | null => {
    if (!menuDataFromStorage) return null

    const menuDataByDay: DayMenu = JSON.parse(menuDataFromStorage)[day]

    return Object.values(menuDataByDay).reduce<Record<string, FoodItem[]>>((acc, dayFoods) => {
      dayFoods.forEach((food) => {
        const key = Object.values(EmojiMap).find(
          (item) => item.emoji === food.substring(0, 2).trim(),
        )?.key || 'other' // эмодзи

        const rest = food.slice(2).trim()
        const [ruName, rsName] = rest.split('/').map((s) => s.trim())

        acc[key] ??= []

        const existing = acc[key].find((item) => item.ruName === ruName && item.rsName === rsName)

        if (existing) {
          existing.count += 1
        } else {
          acc[key].push({ ruName, rsName, count: 1 })
        }
      })

      return acc
    }, {})
  }

  const setTotalToStore = (total: Record<string, FoodItem[]>) => {
    localStorage.setItem('totalDishes', JSON.stringify(total))
  };
  const getTotalFromStore = (): Record<string, FoodItem[]> | null => {
    const total = localStorage.getItem('totalDishes')

    if (!total || total === 'undefined') return null

    return JSON.parse(total)
  }

  const updateDishStatus = (type: string, name: string, status: string) => {
    const fromStore = getTotalFromStore();

    if (!fromStore) return

    const newType: FoodItem[] = [...fromStore[type].map(item => {
      if (item.rsName === name) {
        return {
          ...item,
          status: status
        }
      }

      return item
    })] as FoodItem[]

    const newTotal = {
      ...fromStore,
      [type]: newType,
    }

    setTotalToStore(newTotal)
    return newTotal;
  };

  return {
    getTotalDishes,
    setTotalToStore,
    getTotalFromStore,
    updateDishStatus,
  }
}
