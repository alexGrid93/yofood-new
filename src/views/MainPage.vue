<script setup lang="ts">
import CurrentDate from '@/components/CurrentDate.vue'
import TitleContainer from '@/components/TitleContainer.vue'
import { currentDayView, getCurrentDateView, millisecondsDay } from '@/utils/constants'
import { getDishesFromMenu } from '@/utils/getDishesFromMenu'
import { getEmployeesByDish } from '@/utils/getEmployeesByDish'
import { getEmployeesFromMenu } from '@/utils/getEmployeesFromMenu'
import { getEmployeeMenuByDay } from '@/utils/getEmployeeMenuByDay'
import type { MenuData } from '@/utils/types'
import { Segmented, Spin, Button } from 'ant-design-vue'
import { Flex } from 'ant-design-vue'

import { useUpdateMenu } from '@/utils/useUpdateMenu'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DishesByEmployee from '@/components/DishesByEmployee.vue'
import EmployeesByDish from '@/components/EmployeesByDish.vue'
import SelectDay from '@/components/SelectDay.vue'
import SelectDish from '@/components/SelectDish.vue'
import SelectEmployee from '@/components/SelectEmployee.vue'
import Text from 'ant-design-vue/es/typography/Text'

const route = useRoute()
const adminSheetId = route.query.sheetid as string

const menuDataFromStorage = localStorage.getItem('menuData')
const selectedEmployeeFromStorage = localStorage.getItem('selectedEmployee')
const menuStartDayFromStorage = localStorage.getItem('menuStartDate')

const menuData = ref(menuDataFromStorage ? (JSON.parse(menuDataFromStorage) as MenuData) : null)
const menuStartDay = ref(
  menuStartDayFromStorage ? new Date(JSON.parse(menuStartDayFromStorage)) : null,
)

const errorState = ref(null)
const currentDate = ref(new Date())
const selectedEmployee = ref(selectedEmployeeFromStorage ?? undefined)
const selectedDish = ref(undefined)
const selectedDay = ref(currentDayView)
const isEmployeeMode = ref(true)

const isLoading = ref(false)

const employeesToSelect = computed(() => {
  if (!menuData.value) return []

  return getEmployeesFromMenu(menuData) ?? []
})

const dishesToSelect = computed(() => {
  if (!menuData.value) return {}
  return getDishesFromMenu(menuData.value) ?? {}
})

const employeeMenuByDay = computed(() =>
  getEmployeeMenuByDay(selectedDay.value, selectedEmployee.value, menuData.value),
)

const employeesByDish = computed(() =>
  getEmployeesByDish(selectedDay.value, selectedDish.value, menuData.value),
)

const isActualMenu = computed(() => {
  if (!menuStartDay.value) return false

  const timeDiff = currentDate.value.getTime() - menuStartDay.value.getTime()

  return timeDiff < 5 * millisecondsDay
})

const reloadButtonUrl = computed(() =>
  isActualMenu.value ? 'src/assets/reload_disabled.svg' : 'src/assets/reload.svg',
)

const updateDate = () => {
  currentDate.value = new Date()
}

onMounted(() => {
  updateDate()

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateDate()
  })

  window.addEventListener('focus', updateDate)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', updateDate)
  window.removeEventListener('focus', updateDate)
})

const handleTogglehMode = () => (isEmployeeMode.value = !isEmployeeMode.value)

const handleUpdateMenu = async () => {
  errorState.value = null
  isLoading.value = true
  await useUpdateMenu(adminSheetId, menuData, menuStartDay, errorState)
  isLoading.value = false
}

watch(selectedDay, () => (selectedDish.value = undefined))
</script>

<template>
  <img @click="handleUpdateMenu" :src="reloadButtonUrl" class="reloadButton" />
  <Flex vertical gap="20">
    <CurrentDate :date="currentDate" />
    <TitleContainer />
  </Flex>
  <Text type="danger" v-if="!adminSheetId"
    >Вы попали в корень сайта, так не работает. <br />
    <br />
    Пожалуйста, перейдите по ссылке из вашего чата.
  </Text>
  <Flex gap="20" vertical v-else-if="errorState">
    <Text type="danger">{{ errorState }}</Text>
    <Button type="primary" @click="handleUpdateMenu">Обновить меню</Button>
  </Flex>

  <Spin class="spinner" size="large" v-else-if="isLoading" />
  <Button type="primary" v-else-if="!menuStartDay" @click="handleUpdateMenu">Обновить меню</Button>

  <Flex vertical gap="25" v-else>
    <div
      :class="isActualMenu ? 'actualMenuDate' : 'expiredMenuDate'"
      :style="{ marginTop: '20px' }"
      v-if="menuStartDay"
    >
      Меню от {{ getCurrentDateView(menuStartDay) }} {{ !isActualMenu ? '(не актуальное)' : '' }}
    </div>
    <div>
      <Segmented
        :value="isEmployeeMode ? 'Искать по имени' : 'Искать по блюду'"
        :options="['Искать по имени', 'Искать по блюду']"
        @change="handleTogglehMode"
      />
    </div>
    <div v-if="isEmployeeMode">
      <Flex gap="10">
        <SelectDay v-model="selectedDay" />
        <SelectEmployee v-model="selectedEmployee" :options="employeesToSelect" />
      </Flex>
      <DishesByEmployee v-model="employeeMenuByDay" />
    </div>
    <div v-else>
      <Flex vertical gap="10">
        <SelectDay v-model="selectedDay" />
        <SelectDish v-model="selectedDish" :options="dishesToSelect[selectedDay]" />
      </Flex>
      <EmployeesByDish v-model="employeesByDish" />
    </div>
  </Flex>
</template>

<style>
body {
  position: relative;
  margin: 20px;
  padding: 10px;
  color: #231f20;
  max-width: 800px;
}

.reloadButton {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  position: absolute;
  right: 20px;
  top: 10px;
  width: 60px;
  height: 60px;
}

.spinner {
  margin-top: 20px;
}
.spinner > span > i {
  background-color: gray !important;
}

.actualMenuDate {
  color: #41b619;
}

.expiredMenuDate {
  color: #ce3d1d;
}
</style>
