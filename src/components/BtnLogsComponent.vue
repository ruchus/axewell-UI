<template>
  <q-btn
    icon="manage_history"
    size="md"
    no-caps
    @click="openLog = !openLog"
    style="color: var(--accent)"
    :label="t('logs.viewLogs')"
  />

  <q-dialog v-model="openLog" persistent backdrop-filter="brightness(60%)" full-width full-height>
    <q-card class="dialogBg">
      <q-card-actions align="right">
        <q-btn flat icon="close" v-close-popup color="white" />
      </q-card-actions>
      <q-card-section class="q-ml-sm">
        <div class="card-title" style="font-size: 34px; color: white !important">
          {{ t('logs.realtimeLogs') }}
        </div>
        <div v-if="quasar.screen.gt.sm" class="row justify-between items-baseline">
          <div class="card-text q-mt-md" style="color: #c0c0c0 !important">{{ t('logs.description') }}</div>
          <q-btn
            class="q-mr-md btn-titles btn-background"
            :label="autoScroll ? 'Stop scroll' : 'Start scroll'"
            no-caps
            @click="toggleScroll"
          ></q-btn>
        </div>
        <div v-else>
          <div class="card-text q-mb-sm" style="color: #c0c0c0 !important">{{ t('logs.description') }}</div>
          <div class="text-center">
            <q-btn
              class="q-mr-md btn-titles btn-background q-px-lg"
              :style="!quasar.screen.gt.sm ? '' : ''"
              :label="autoScroll ? 'Stop scroll' : 'Start scroll'"
              no-caps
              @click="toggleScroll"
            ></q-btn>
          </div>
        </div>
      </q-card-section>

      <q-scroll-area
        ref="scrollArea"
        class="q-pa-md q-ml-auto q-mr-auto"
        style="
          height: 70vh;
          width: 90vw;
          background-color: #444444;
          color: #c0c0c0;
          font-family: monospace;
        "
      >
        <div v-for="(newresponse, index) in logResponse" :key="index" class="q-py-xs">
          {{ newresponse }}
        </div>
      </q-scroll-area>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
export default defineComponent({
  name: 'BtnLogsComponent',
  setup() {
    const openLog = ref(false)
    const logResponse = ref([])
    const autoScroll = ref(true)
    const scrollArea = ref(null)
    const { t } = useI18n()
    const quasar = useQuasar()
    let ws

    const toggleScroll = () => {
      autoScroll.value = !autoScroll.value
    }

    const scrollToBottom = () => {
      if (scrollArea.value) {
        const scrollTarget = scrollArea.value.getScrollTarget()
        scrollTarget.scrollTop = scrollTarget.scrollHeight
      }
    }

    onMounted(() => {
      const getIpOfDevice = () => {
        var url = window.location.href
        var ip = url.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/)
        return ip ? ip[0] : null
      }

      const deviceIP = getIpOfDevice()

      if (deviceIP) {
        ws = new WebSocket(`ws://${deviceIP}/api/ws`)
        ws.onmessage = function (event) {
          const modifiedData = event.data
            .replace(/\[0;32mI/g, '₿')
            .replace(/\[0;31mE/g, '₿')
            .replace(/\[0m/g, '')

          logResponse.value.push(modifiedData)

          // Scroll to the bottom if auto-scroll is enabled
          if (autoScroll.value) {
            scrollToBottom()
          }
        }

        ws.onerror = function (error) {
          console.error('WebSocket error:', error)
        }

        ws.onclose = function () {
          console.log('WebSocket closed')
        }
      }
    })

    return {
      openLog,
      logResponse,
      scrollArea,
      t,
      autoScroll,
      toggleScroll,
      quasar
    }
  }
})
</script>

<style scoped>
.dialogBg {
  background-color: #333;
}

.btn-titles {
  color: #fff;
  font-weight: bold;
}
</style>
