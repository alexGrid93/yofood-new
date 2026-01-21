<script setup lang="ts">
import CurrentDate from '@/components/CurrentDate.vue'
import TitleContainer from '@/components/TitleContainer.vue'
import { Flex, List, ListItem, Badge } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { currentDayView } from '@/utils/constants.ts'
import ActualMenu from '@/components/ActualMenu.vue'
import { useDeliveryCheck } from '@/features/useDeliveryCheck.ts'
import { EmojiMap } from '@/constants/emojiMap.ts'
import type { FoodItem } from '@/utils/types.ts'
import { sortByPriority } from '@/utils/sortByPriority.ts'

const currentDate = ref(new Date())
const { getTotalDishes, setTotalToStore, getTotalFromStore, updateDishStatus } = useDeliveryCheck()

const totalDishes = ref<Record<string, FoodItem[]>>({})

const updateStatus = (type: string, name: string) => {
  const getStatus = () => {
    const currentItem = totalDishes.value[type].find((item) => item.rsName === name)

    switch (currentItem?.status) {
      case 'done':
        return 'notAll'
      case 'notAll':
        return 'noDelivery'
      case 'noDelivery':
        return 'done'
      default:
        return 'noDelivery'
    }
  }

  const newTotal = updateDishStatus(type, name, getStatus())

  totalDishes.value = newTotal
}

onMounted(() => {
  const currentTotalDay = localStorage.getItem('currentTotalDay')

  if (!currentTotalDay) {
    localStorage.setItem('currentTotalDay', currentDayView)
  }

  if (currentTotalDay === currentDayView) {
    const totalDishesFromStore = getTotalFromStore()

    if (totalDishesFromStore) {
      totalDishes.value = totalDishesFromStore
      return
    }
  }

  const total = getTotalDishes(currentDayView)

  setTotalToStore(total)

  totalDishes.value = total

  localStorage.setItem('currentTotalDay', currentDayView)

  return
})

const priority = [EmojiMap.breakfast.key, EmojiMap.juice.key]
</script>

<template>
  <Flex vertical gap="20">
    <CurrentDate :date="currentDate" />
    <TitleContainer />
    <ActualMenu />

    <Flex vertical gap="10">
      <template
        v-for="type in Object.entries(totalDishes).sort((a, b) =>
          sortByPriority<string>(a[0], b[0], priority),
        )"
        :key="`type-${type}`"
      >
        <h3>{{ EmojiMap[type[0]].name }}&nbsp;{{ EmojiMap[type[0]].emoji }}</h3>

        <List :locale="{ emptyText: '🗿 Нет данных' }" class="list">
          <ListItem
            @click="updateStatus(type[0], dish.rsName)"
            class="listItem dish"
            v-for="(dish, index) in totalDishes[type[0]].sort((a, b) => b.count - a.count)"
            :key="index"
            :class="[`dish--status-${dish.status}`]"
          >
            <Flex
              gap="10"
              :style="{
                justifyContent: 'space-between',
                width: '100%',
              }"
            >
              {{ dish.rsName.split(',').join(' ') }}

              <Badge :count="dish.count" color="blue" />
            </Flex>
          </ListItem>
        </List>
      </template>
    </Flex>
  </Flex>
</template>

<style scoped>
.dish {
  transition:
    color 0.3s ease,
    text-decoration 0.3s ease;
}
.dish--status-done {
  color: #648e6e;
  text-decoration: line-through;
}
.dish--status-notAll {
  color: #d8a405;
}

.listItem {
  padding: 0px;
  margin-bottom: 15px;
  font-size: 16px;
}
</style>
