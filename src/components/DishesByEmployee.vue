<script lang="ts" setup>
import { List, ListItem } from 'ant-design-vue'
const props = defineProps(['modelValue'])
</script>

<template>
  <List :locale="{ emptyText: '🗿 Нет данных' }" class="list">
    <ListItem class="listItem" v-for="(dish, index) in props.modelValue" :key="index">{{
      dish
    }}</ListItem>
  </List>
</template>

<style scoped>
.list {
  margin-top: 30px;
}

.listItem {
  padding: 0px;
  margin-bottom: 10px;
  font-size: 16px;
}
</style>
