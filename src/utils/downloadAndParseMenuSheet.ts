import xlsx from 'node-xlsx'
import { getJsDateFromExcel } from 'excel-date-to-js'
import { days, maxEmployeesCount, startIndex } from './constants'
import type { DayMenu, MenuData } from './types'
import { addListItemEmojies } from './addListItemEmojies'
import { getMenuUrl } from './getMenuUrl'

export const downloadAndParseMenuSheet = async (adminSheetId: string) => {
  let menuStartDay: Date | undefined
  let error: string | undefined

  const { menuTableUrl, adminError, menuSheetId } = await getMenuUrl(adminSheetId)

  if (adminError || !menuTableUrl || !menuSheetId) {
    error = adminError
    return { error }
  }

  const response = await fetch(menuTableUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  })
  if (!response.ok) {
    error = `Ошибка загрузки таблицы c меню. Обратитесь к администратору приложения.`
    return { error }
  }
  const arrayBuffer = await response.arrayBuffer()
  const workbook = xlsx.parse(arrayBuffer, { type: 'array' })

  const menuMap = workbook.reduce((acc: MenuData, sheet) => {
    if (!days.has(sheet.name.toLowerCase())) {
      return acc
    }

    if (!menuStartDay) {
      menuStartDay = getJsDateFromExcel(sheet.data[0][0])
    }

    const sheetData = sheet.data.slice(startIndex, maxEmployeesCount)

    const dayMenu = sheetData.reduce((acc: DayMenu, current: string[]) => {
      const cleanedCurrent = current.slice(current.findIndex((item) => item !== undefined))

      const itemsWithEmojies = addListItemEmojies(cleanedCurrent)

      const filteredRow = itemsWithEmojies.filter((el) => typeof el === 'string')

      const employeeName = filteredRow.shift()?.trim()

      if (!employeeName) return acc

      acc[employeeName] = filteredRow

      return acc
    }, {})

    acc[sheet.name.toLowerCase()] = dayMenu

    return acc
  }, {})

  localStorage.setItem('menuSheetId', menuSheetId)

  return { menuMap, menuStartDay }
}
