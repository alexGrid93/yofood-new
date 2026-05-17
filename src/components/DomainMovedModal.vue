<script setup lang="ts">
import { Modal, Button, message } from 'ant-design-vue'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { writeClipboard } from '@/utils/writeClipboard'
import mascotMoving from '@/assets/masot-moving.png'

const { t } = useI18n()

const open = ref(false)
const DOMAIN_URL = 'https://yofood.org'

onMounted(() => {
  open.value = true
})

const copyLink = async () => {
  try {
    await writeClipboard(DOMAIN_URL)
    message.success(t('domain_moved_modal.copy_success'))
  } catch {
    message.error(t('domain_moved_modal.copy_error'))
  }
}
</script>

<template>
  <Modal
    v-model:open="open"
    :getContainer="false"
    :footer="null"
    centered
    class="domain-moved-modal"
  >
    <div class="domain-moved-modal-body">
      <img :src="mascotMoving" alt="" class="domain-moved-modal-body__img" />

      <p class="domain-moved-modal-body__text">
        {{ t('domain_moved_modal.message') }}
      </p>

      <a
        :href="DOMAIN_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="domain-moved-modal-body__link"
      >
        {{ t('domain_moved_modal.link_text') }}
      </a>

      <Button class="domain-moved-modal-body__copy" @click="copyLink">
        {{ t('domain_moved_modal.copy_link') }}
      </Button>
    </div>
  </Modal>
</template>

<style scoped>
.domain-moved-modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.domain-moved-modal-body__img {
  display: block;
  max-width: 100%;
  height: auto;
  max-height: 220px;
  object-fit: contain;
}

.domain-moved-modal-body__text {
  margin: 0;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
}

.domain-moved-modal-body__link {
  align-self: center;
  font-size: 16px;
  font-weight: 500;
  text-decoration: underline;
}

.domain-moved-modal-body__copy {
  align-self: stretch;
}
</style>
