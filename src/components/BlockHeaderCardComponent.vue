<template>
  <q-card flat class="card power-info q-mt-md" :class="quasar.screen.gt.sm ? 'q-px-md q-py-sm' : ''">
    <q-card-section horizontal class="row" v-if="quasar.screen.gt.sm">
      <q-card-section class="col-lg-5 col-md-5 q-ml-md">
        <div class="row items-center q-pb-sm">
          <div class="card-title">{{ t("dashboardPage.blockHeader.title") }}</div>
          <div v-if="blockData?.blockSignals && blockData?.blockSignals.length > 0" class="q-ml-sm">
            <q-badge v-for="signal in blockData.blockSignals" :key="signal" color="positive" class="q-ml-xs">
              {{ signal }}
            </q-badge>
          </div>
        </div>
      </q-card-section>
      <q-separator vertical class="q-ml-md" />
      <q-card-section class="col-lg-5 col-md-5 q-mx-md" style="margin-top: 10px;">
        <div class="row justify-evenly q-mt-sm">
          <div class="col-4">
            <div class="small-container data-label rounded-borders text-left">{{ t("dashboardPage.blockHeader.height") }}</div>
          </div>
          <div class="col-7">
            <div class="small-container data-fields rounded-borders text-right" style="padding-right: 0">
              {{ blockData?.blockHeight ?? '-' }}
            </div>
          </div>
        </div>

        <div class="row justify-evenly q-mt-sm">
          <div class="col-4">
            <div class="small-container data-label rounded-borders text-left">{{ t("dashboardPage.blockHeader.difficulty") }}</div>
          </div>
          <div class="col-7">
            <div class="small-container data-fields rounded-borders text-right" style="padding-right: 0">
              <span v-if="blockData?.networkDifficulty" class="cursor-pointer">
                {{ formatDifficulty(blockData.networkDifficulty) }}
                <q-tooltip anchor="bottom middle" self="center middle">
                  {{ formatNumber(blockData.networkDifficulty) }}
                </q-tooltip>
              </span>
              <span v-else>-</span>
            </div>
          </div>
        </div>

        <div class="row justify-evenly q-mt-sm">
          <div class="col-4">
            <div class="small-container data-label rounded-borders text-left">{{ t("dashboardPage.blockHeader.scriptsig") }}</div>
          </div>
          <div class="col-7">
            <div class="small-container data-fields rounded-borders text-right" style="padding-right: 0; font-family: monospace; font-size: 12px; word-break: break-all;">
              {{ blockData?.scriptsig ?? '-' }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card-section>

    <q-card-section v-else>
      <div class="row items-center q-pb-sm">
        <div class="card-title">{{ t("dashboardPage.blockHeader.title") }}</div>
        <div v-if="blockData?.blockSignals && blockData?.blockSignals.length > 0" class="q-ml-sm">
          <q-badge v-for="signal in blockData.blockSignals" :key="signal" color="positive" class="q-ml-xs">
            {{ signal }}
          </q-badge>
        </div>
      </div>

      <div class="row justify-evenly q-mt-sm">
        <div class="col-4">
          <div class="small-container data-label rounded-borders text-left">{{ t("dashboardPage.blockHeader.height") }}</div>
        </div>
        <div class="col-7">
          <div class="small-container data-fields rounded-borders text-right" style="padding-right: 0">
            {{ blockData?.blockHeight ?? '-' }}
          </div>
        </div>
      </div>

      <div class="row justify-evenly q-mt-sm">
        <div class="col-4">
          <div class="small-container data-label rounded-borders text-left">{{ t("dashboardPage.blockHeader.difficulty") }}</div>
        </div>
        <div class="col-7">
          <div class="small-container data-fields rounded-borders text-right" style="padding-right: 0">
            <span v-if="blockData?.networkDifficulty" class="cursor-pointer">
              {{ formatDifficulty(blockData.networkDifficulty) }}
              <q-tooltip anchor="bottom middle" self="center middle">
                {{ formatNumber(blockData.networkDifficulty) }}
              </q-tooltip>
            </span>
            <span v-else>-</span>
          </div>
        </div>
      </div>

      <div class="row justify-evenly q-mt-sm">
        <div class="col-4">
          <div class="small-container data-label rounded-borders text-left">{{ t("dashboardPage.blockHeader.scriptsig") }}</div>
        </div>
        <div class="col-7">
          <div class="small-container data-fields rounded-borders text-right" style="padding-right: 0; font-family: monospace; font-size: 12px; word-break: break-all;">
            {{ blockData?.scriptsig ?? '-' }}
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'BlockHeaderCardComponent',
  props: {
    blockData: {
      type: Object,
      required: true
    }
  },
  setup() {
    const { t } = useI18n()
    const quasar = useQuasar()

    const formatNumber = (num) => {
      if (num === null || num === undefined) return '-'
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num)
    }

    const formatDifficulty = (value) => {
      if (value === undefined || value === null) return '-'
      if (value === 0) return '0'
      const suffixes = ["", "K", "M", "G", "T", "P", "E", "Z", "Y"]
      const i = Math.floor(Math.log(value) / Math.log(1000))
      return (value / Math.pow(1000, i)).toFixed(2) + " " + suffixes[i]
    }

    return {
      t,
      quasar,
      formatNumber,
      formatDifficulty
    }
  }
})
</script>
