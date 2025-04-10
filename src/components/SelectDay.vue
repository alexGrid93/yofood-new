<script lang="ts" setup>
import { arrayDays } from '@/utils/constants'
import { getOptionsForSelect } from '@/utils/getOptionsForSelect'
import { Select } from 'ant-design-vue'
import type { SelectValue } from 'ant-design-vue/es/select'
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'update:day'])

const updateSelectedDay = (value: SelectValue) => {
  emit('update:modelValue', value)
  emit('update:day')
}

const options = computed(() => getOptionsForSelect(arrayDays))
</script>

<template>
  <Select size="large" :options="options" :value="props.modelValue" @change="updateSelectedDay" />
</template>
