export const millisecondsDay = 1000 * 60 * 60 * 24

export const getCurrentDateView = (date: Date, config?: { withWeekday: boolean }) => {
  const options = {
    ...(config?.withWeekday ? { weekday: 'long' } : {}),
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  } as Intl.DateTimeFormatOptions

  const formattedDate = date.toLocaleDateString('ru-RU', options)

  return `${formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}`
}

export const arrayDays = ['пн', 'вт', 'ср', 'чт', 'пт']

export const days = new Set(arrayDays)

const getCurrentWeekDay = () => {
  const currentDay = new Date().getDay() - 1

  return arrayDays[currentDay] ?? arrayDays[0]
}

export const currentDayView = getCurrentWeekDay()

export const maxEmployeesCount = 200

export const startIndex = 4
