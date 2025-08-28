<template>
  <q-card flat class="card hash-rate-data" :class="quasar.screen.gt.sm ? 'q-px-md q-py-sm' : ''">
    <q-card-section horizontal class="row" v-if="quasar.screen.gt.sm">
      <q-card-section class="col-lg-5 col-md-5 q-ml-md">
        <div class="card-title">{{ t("dashboardPage.shares.title") }}</div>
        <span class="card-text">{{ t("dashboardPage.shares.subtitle") }}</span>
        <div>
          <q-circular-progress show-value font-size="20px" :value="axeStore.getPercentageSharesAccepted" size="120px"
            :thickness="0.05" track-color="red" class="purple-primary q-ma-md">
            <div class="column text-center">
              {{ axeStore.getPercentageSharesAccepted }}%
              <span class="q-mt-md" style="font-size: 13px; color: red">
                {{ axeStore.getPercentageSharesRejected }}%</span>
            </div>
          </q-circular-progress>
          <div>
            <div class="q-mb-sm">
              <q-badge color="deep-purple-11" rounded class="q-mr-sm" />
              <span class="data-label">
                {{ t("dashboardPage.shares.accepted") }}
              </span>
              <span style="color: #444444; text-align: right" class="q-ml-md">{{
                shareData?.sharesAccepted
              }}</span>
            </div>
            <q-badge color="red" rounded class="q-mr-sm" />
            <span class="data-label">
              {{ t("dashboardPage.shares.rejected") }}
            </span>
            <span style="color: #444444; text-align: right" class="q-ml-md">{{
              shareData?.sharesRejected
            }}</span>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="col-6 col-md-6 card-text">
        {{ t("dashboardPage.shares.description") }}
      </q-card-section>
    </q-card-section>
    <q-card-section class="row" v-if="!quasar.screen.gt.sm">
      <q-card-section class="col-lg-5 col-md-5">
        <div class="card-title">{{ t("dashboardPage.shares.title") }}</div>
        <span class="card-text">{{ t("dashboardPage.shares.subtitle") }}</span>

        <div>
          <div style="width:150px; margin-left: auto;margin-right: auto;">
            <q-circular-progress show-value font-size="20px" :value="axeStore.getPercentageSharesAccepted" size="120px"
              :thickness="0.05" track-color="red" class="purple-primary q-ma-md">
              <div class="column text-center">
                {{ axeStore.getPercentageSharesAccepted }}%
                <span class="q-mt-md" style="font-size: 13px; color: red">
                  {{ axeStore.getPercentageSharesRejected }}%</span>
              </div>
            </q-circular-progress>
          </div>
          <div class="row justify-evenly" style="margin-left: auto;margin-right: auto;width: 300px;">
            <div class="q-mr-lg">
              <q-badge color="deep-purple-11" rounded class="q-mr-sm" /> {{ t("dashboardPage.shares.accepted") }}
              <span style="color: #444444; text-align: right" class="q-ml-md">{{
                shareData?.sharesAccepted
              }}</span>
            </div>
            <div>
              <q-badge color="red" rounded class="q-mr-sm" /> {{ t("dashboardPage.shares.rejected") }}
              <span style="color: #444444; text-align: right" class="q-ml-md">{{
                shareData?.sharesRejected
              }}</span>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="card-text">
        {{ t("dashboardPage.shares.description") }}
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAxeStore } from '../stores/axe'
import { useI18n } from 'vue-i18n';
export default defineComponent({
  name: 'SharesCardComponent',
  props: {
    shareData: Object
  },
  setup() {
    const quasar = useQuasar()
    const axeStore = useAxeStore()
    const { t } = useI18n();
    return {
      quasar,
      axeStore,
      t
    }
  }
})
</script>
