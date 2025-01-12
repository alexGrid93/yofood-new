<script lang="ts" setup>
import { getOptionsForSelect } from '@/utils/getOptionsForSelect'
import { Select } from 'ant-design-vue'
import type { SelectValue } from 'ant-design-vue/es/select'
import { computed } from 'vue'

const props = defineProps({
  modelValue: String,
  options: {
    type: Array<string>,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const formattedOptions = computed(() => getOptionsForSelect(props.options))

const updateSelectedDish = (value: SelectValue) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <Select
    class="selectDish"
    :options="formattedOptions"
    :value="modelValue"
    @change="updateSelectedDish"
  />
</template>

<style></style>
