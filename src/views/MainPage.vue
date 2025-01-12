<script setup lang="ts">
import CurrentDate from '@/components/CurrentDate.vue'
import TitleContainer from '@/components/TitleContainer.vue'
import { currentDayView, getCurrentDateView } from '@/utils/constants'
import { getDishesFromMenu } from '@/utils/getDishesFromMenu'
import { getEmployeesByDish } from '@/utils/getEmployeesByDish'
import { getEmployeesFromMenu } from '@/utils/getEmployeesFromMenu'
import { getEmployeeMenuByDay } from '@/utils/getMenu'
import type { MenuData } from '@/utils/types'
import { Segmented, Spin } from 'ant-design-vue'
import { Flex } from 'ant-design-vue'

import { useMenuData } from '@/utils/useMenuData'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import DishesByEmployee from '@/components/DishesByEmployee.vue'
import EmployeesByDish from '@/components/EmployeesByDish.vue'
import SelectDay from '@/components/SelectDay.vue'
import SelectDish from '@/components/SelectDish.vue'
import SelectEmployee from '@/components/SelectEmployee.vue'

const menuDataFromStorage = localStorage.getItem('menuData')
const selectedEmployeeFromStorage = localStorage.getItem('selectedEmployee')
const menuStartDayFromStorage = localStorage.getItem('menuStartDate')

const menuData = ref(menuDataFromStorage ? (JSON.parse(menuDataFromStorage) as MenuData) : null)
const menuStartDay = ref(
  menuStartDayFromStorage ? new Date(JSON.parse(menuStartDayFromStorage)) : null,
)
const selectedEmployee = ref(selectedEmployeeFromStorage ?? undefined)
const selectedDish = ref(undefined)
const selectedDay = ref(currentDayView)
const isEmployeeMode = ref(true)

const isLoading = ref(false)

onMounted(async () => {
  const route = useRoute()
  const urlSheetId = route.params.sheetId as string

  isLoading.value = true
  await useMenuData(urlSheetId, menuData, menuStartDay)
  isLoading.value = false
})

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

const handleTogglehMode = () => (isEmployeeMode.value = !isEmployeeMode.value)

watch(selectedDay, () => (selectedDish.value = undefined))
</script>

<template>
  <Flex vertical gap="20">
    <CurrentDate />
    <TitleContainer />
  </Flex>

  <Spin class="spinner" size="large" v-if="isLoading" />
  <Flex vertical gap="25" v-else>
    <div :style="{ marginTop: '20px' }" v-if="menuStartDay">
      Меню от {{ getCurrentDateView(menuStartDay) }}
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
  margin: 20px;
  padding: 10px;
  color: #231f20;
  max-width: 800px;
}

.spinner {
  margin-top: 20px;
}
.spinner > span > i {
  background-color: gray !important;
}
</style>
