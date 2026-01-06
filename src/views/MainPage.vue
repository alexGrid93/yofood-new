<script setup lang="ts">
import CurrentDate from '@/components/CurrentDate.vue'
import TitleContainer from '@/components/TitleContainer.vue'
import { currentDayView, getCurrentDateView, millisecondsDay } from '@/utils/constants'
import { getDishesFromMenu } from '@/utils/getDishesFromMenu'
import { getEmployeesByDish } from '@/utils/getEmployeesByDish'
import { getEmployeesFromMenu } from '@/utils/getEmployeesFromMenu'
import { getEmployeeMenuByDay } from '@/utils/getEmployeeMenuByDay'
import type { MenuData } from '@/utils/types'
import {
  Segmented,
  Button,
  Image,
  Flex,
  Modal,
  Typography,
  Spin,
  TypographyTitle,
  Input,
  Divider,
  Alert,
} from 'ant-design-vue'
import { ShareAltOutlined } from '@ant-design/icons-vue'

import reloadSvg from '@/assets/reload.svg'
import reloadDisabledSvg from '@/assets/reload_disabled.svg'

import { useUpdateMenu } from '@/utils/useUpdateMenu'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import DishesByEmployee from '@/components/DishesByEmployee.vue'
import EmployeesByDish from '@/components/EmployeesByDish.vue'
import SelectDay from '@/components/SelectDay.vue'
import SelectDish from '@/components/SelectDish.vue'
import SelectEmployee from '@/components/SelectEmployee.vue'
import Text from 'ant-design-vue/es/typography/Text'
import { useShareImage } from '@/features/useShareImage.ts'

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
const isUpdateModalOpen = ref(false)
const pastedUrl = ref('')
const inputStatus = ref<'warning' | 'error' | ''>('')
const pastedSheetId = ref<string | null>(null)

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

const reloadButtonUrl = computed(() => (isActualMenu.value ? reloadDisabledSvg : reloadSvg))

const updateDate = () => {
  currentDate.value = new Date()
}

const pasteFromClipboard = async () => {
  const text = await navigator.clipboard.readText()
  pastedUrl.value = text
}

const reloadPage = () => {
  window.location.reload()
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
  isUpdateModalOpen.value = false
  pastedUrl.value = ''
  await useUpdateMenu(pastedSheetId.value, menuData, menuStartDay, errorState)
  isLoading.value = false
}

const SHEETS_URL_REGEX = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9_-]+/

const isValidGoogleSheetUrl = (value: string): boolean => {
  return SHEETS_URL_REGEX.test(value.trim())
}

const extractGoogleSheetId = (url: string): string | null => {
  if (!url) return null

  const match = url.match(/^https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)

  return match ? match[1] : null
}

const { onClick, isOpenShareModal, imageResponse, resetImageResponse } = useShareImage()

const onUpdateDay = () => {
  resetImageResponse()
}
const onUpdateEmployee = () => {
  resetImageResponse()
}

watch(pastedUrl, (val) => {
  if (!val) {
    inputStatus.value = ''
    pastedSheetId.value = null

    return
  }

  const isValid = isValidGoogleSheetUrl(val)

  if (isValid) {
    inputStatus.value = ''
    pastedSheetId.value = extractGoogleSheetId(val)
  } else {
    inputStatus.value = 'error'
    pastedSheetId.value = ''
  }
})

watch(selectedDay, () => (selectedDish.value = undefined))
</script>

<template>
  <Flex class="menu" align="center" gap="small">
    <img
      @click="
        () => {
          if (!isLoading) {
            isUpdateModalOpen = true
          }
        }
      "
      :src="reloadButtonUrl"
      :class="{ reloadButton: true, 'reloadButton--loading': isLoading }"
    />

    <Button
      v-if="isEmployeeMode && selectedEmployee"
      @click="
        () =>
          onClick({
            dateInfo: selectedDay,
            menu: employeeMenuByDay || [''],
            userName: selectedEmployee || '',
          })
      "
      size="large"
    >
      <template #icon>
        <ShareAltOutlined />
      </template>
    </Button>

    <Modal
      v-model:open="isUpdateModalOpen"
      cancelText="Отменить"
      :ok-button-props="{
        disabled: !pastedSheetId,
        onClick: () => handleUpdateMenu(),
      }"
      :cancelButtonProps="{
        onClick: () => {
          pastedUrl = ''
          isUpdateModalOpen = false
        },
      }"
      :getContainer="false"
    >
      <template #title> Обновить меню </template>
      <Flex :gap="10" vertical>
        <Text>Вставьте ссылку на актуальную таблицу</Text>
        <Input v-model:value="pastedUrl" :status="inputStatus" placeholder="Ссылка" allow-clear />
        <Button @click="pasteFromClipboard">Вставить</Button>
      </Flex>
      <Divider />
      <Alert
        message="Автоподгрузка актуальной таблицы отключена.
Админские таблицы больше не используются. Их можно удалить."
      />
      <Divider />
    </Modal>

    <Modal
      v-model:open="isOpenShareModal"
      :getContainer="false"
      :footer="false"
      okText="Сохранить"
      destroyOnClose
      centered
    >
      <template #title>Поделиться едой</template>
      <Flex align="center" justify="center" class="imageContainer">
        <Spin v-if="!imageResponse" size="large" />
        <Image
          v-else
          :src="imageResponse"
          :preview="false"
          :placeholder="true"
          width="600"
          height="600"
        />
      </Flex>

      <TypographyTitle :level="5">Как сохранить?</TypographyTitle>
      <Typography>1. Нажмите и удерживайте это изображение.</Typography>
      <Typography
        >2. В открывшемся меню выберите действие: сохранить изображение; копировать
        изображение.</Typography
      >
    </Modal>
  </Flex>

  <Flex vertical gap="20">
    <CurrentDate :date="currentDate" />
    <TitleContainer />
  </Flex>
  <Flex gap="20" vertical v-if="errorState">
    <Text type="danger">{{ errorState }}</Text>
    <Button @click="reloadPage">Перезагрузить</Button>
  </Flex>

  <Text class="spinner" v-else-if="isLoading">Меню обновляется...</Text>

  <Flex vertical gap="25" v-else-if="menuStartDay">
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
        <SelectDay @update:day="onUpdateDay" v-model="selectedDay" />
        <SelectEmployee
          @update:employee="onUpdateEmployee"
          v-model="selectedEmployee"
          :options="employeesToSelect"
        />
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.menu {
  position: absolute;
  right: 20px;
  top: -15px;
}

.reloadButton {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  width: 60px;
  height: 60px;
  transition: transform 0.3s ease-in-out;
}

.reloadButton--loading {
  animation: spin 1s linear infinite;
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

.imageContainer {
  width: 100%;
  height: 100%;
  aspect-ratio: 1/1;
}
</style>
