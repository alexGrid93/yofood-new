import { LocalStorageKey } from '@/enums/LocalStorageKey.ts'
import { arrayDays, currentDayView } from '@/utils/constants.ts'
import { type Ref, ref } from 'vue'

interface IUseFoodAlert {
  isShow: Ref<boolean>;
  onClose: () => void;
}

const isClosedTodayOrYesterday = (dateStr: string): boolean => {
  const closeDate = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  return (
    closeDate.toDateString() === today.toDateString() ||
    closeDate.toDateString() === yesterday.toDateString()
  )
}

export const useFoodAlert = (): IUseFoodAlert => {
  const isShow = ref<boolean>(false);

  const daysForShow = [arrayDays[3], arrayDays[4]]

  const lastCloseFoodAlertValue = localStorage.getItem(LocalStorageKey.LAST_CLOSE_FOOD_ALERT)

  const isAllowedDay = daysForShow.includes(currentDayView)
  const isNotClosedRecently = !lastCloseFoodAlertValue || !isClosedTodayOrYesterday(lastCloseFoodAlertValue)

  if (isAllowedDay && isNotClosedRecently) {
    isShow.value = true
  }

  const onClose = (): void => {
    localStorage.setItem(LocalStorageKey.LAST_CLOSE_FOOD_ALERT, new Date().toDateString())
    isShow.value = false
  };

  return {
    isShow,
    onClose,
  }
};
