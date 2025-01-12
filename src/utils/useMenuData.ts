import type { Ref } from 'vue'
import { downloadAndParseMenuSheet } from './downloadAndParseMenuSheet'
import type { MenuData } from './types'

export const useMenuData = async (
  urlSheetId: string,
  menuState: Ref<MenuData | null>,
  startDayState: Ref<Date | null>,
) => {
  const storageSheetId = localStorage.getItem('sheetId')
  const storageMenuData = localStorage.getItem('menuData')

  const needNewParse = !storageSheetId || !storageMenuData || urlSheetId !== storageSheetId

  if (needNewParse) {
    const { menuMap, menuStartDay } = await downloadAndParseMenuSheet(urlSheetId)
    menuState.value = menuMap
    startDayState.value = menuStartDay!
    localStorage.setItem('menuData', JSON.stringify(menuMap))
    localStorage.setItem('menuStartDate', JSON.stringify(menuStartDay))
  }
}
