<template>
  <q-card flat class="card hash-rate-data " :class="quasar.screen.gt.sm ? 'q-px-md q-py-lg' : ''">
    <q-card-section horizontal class="row" v-if="quasar.screen.gt.sm">
      <q-card-section class="col-lg-8 col-md-8">
        <div class="card-title">Hash Rate</div>
        <span>{{ t("dashboardPage.hashRate.subtitle") }}</span>

        <div>
          <div class="q-mt-md">
            <div class="card-title" style="text-align: center">
              <q-icon name="rocket_launch" size="md"
                :style="axeStore.darkmode ? 'color: #444444' : 'color:#343d47'" />{{
                  axeStore?.getHashRateRounded
                }}
              <span class="secondary-fields" style="font-size: 24px;">Gh/s</span>
            </div>
            <div class="text-center text-body2 text-grey-6">
              {{ t("dashboardPage.hashRate.expected") }}: {{ axeStore?.expectedHashRate }} Gh/s
              <q-icon name="info" size="xs" color="grey-7" class="q-mr-sm cursor-pointer" style="color: #629C44">
                <q-tooltip anchor="bottom middle" self="center middle">
                  {{ t("dashboardPage.hashRate.expHasRateHelp") }}
                </q-tooltip>
              </q-icon>
            </div>
            <div class="row text-center q-mt-md">
              <div class="col-6">
                <q-badge color="orange-2" rounded class="q-mr-sm parpadea" /> Max
                <span style="color: #444444"> {{ axeStore?.maxHashRate }} Gh/s</span>
              </div>
              <div class="col-6">
                <q-badge color="deep-purple-11" rounded class="q-mr-sm parpadea" />Min
                <span style="color: #444444">{{ axeStore?.minHashRate }} Gh/s</span><br>
                <q-btn class="q-ml-xl" label="Reset" style="text-decoration: underline;text-align: right;" flat no-caps
                  @click="axeStore.resetDataLocalStorage()" v-close-popup />

              </div>
            </div>
            <div class="row justify-evenly q-mt-md">
              <div class="col-6">
                <div class="small-container data-label rounded-borders text-left">{{
                  t("dashboardPage.hashRate.efficiency") }}
                </div>
              </div>
              <div class="col-4">
                <div class="small-container data-fields rounded-borders text-right">
                  {{ formatNumber(hashRateData?.power / (hashRateData?.hashRate / 1000)) }} <small>W/Th</small>
                </div>

              </div>
            </div>
            <div class="row justify-evenly q-mt-sm">
              <div class="col-6">
                <div class="small-container data-label rounded-borders text-left">{{
                  t("dashboardPage.hashRate.networkDifficulty")
                }}</div>
              </div>
              <div class="col-4">
                <div class="small-container data-fields rounded-borders text-right">
                  {{ hashRateData?.bestDiff }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="col-lg-4 col-md-4 card-text">
        {{ t("dashboardPage.hashRate.description") }}
      </q-card-section>
    </q-card-section>
    <q-card-section v-if="!quasar.screen.gt.sm">
      <div class="card-title">Hash Rate</div>
      <span>{{ t("dashboardPage.hashRate.subtitle") }}</span>
      <div style="width:100%;">
        <div class="q-mt-md">
          <div class="card-title text-center">
            <q-icon name="rocket_launch" size="md" style="color: #444444" />{{
              axeStore?.getHashRateRounded
            }}
            <span style="color: #d4d4d4;font-size: 32px;">Gh/s</span>
            <div class="text-center text-body2 text-grey-6">
              {{ t("dashboardPage.hashRate.expected") }}: {{ axeStore?.expectedHashRate }} Gh/s
              <q-icon name="info" size="xs" color="grey-7" class="q-mr-sm cursor-pointer" style="color: #629C44">
                <q-tooltip anchor="bottom middle" self="center middle">
                  {{ t("dashboardPage.hashRate.expHasRateHelp") }}
                </q-tooltip>
              </q-icon>
            </div>
          </div>
          <div class="row text-center q-mt-md">
            <div class="col-6">
              <q-badge color="orange-2" rounded class="q-mr-sm parpadea" /> Max
              <span style="color: #444444"> {{ axeStore?.maxHashRate }} Gh/s</span>
            </div>
            <div class="col-6">
              <q-badge color="deep-purple-11" rounded class="q-mr-sm parpadea" />Min
              <span style="color: #444444"> {{ axeStore?.minHashRate }} Gh/s</span>
              <div style="margin-left: 90px;">
                <q-btn align="right" style="color: #444444; text-decoration: underline" flat no-caps
                  @click="showDialogReset = !showDialogReset">Reset</q-btn>
              </div>
            </div>
          </div>
          <div class="row justify-evenly q-mt-md">
            <div class="col-7">
              <div class="small-container data-label rounded-borders text-left">{{
                t("dashboardPage.hashRate.efficiency") }}
              </div>
            </div>
            <div class="col-4">
              <div class="small-container data-fields rounded-borders text-right">{{ efficiency }} W/Th</div>
            </div>
          </div>
          <div class="row justify-evenly q-mt-sm">
            <div class="col-7">
              <div class="small-container data-label rounded-borders text-left">{{
                t("dashboardPage.hashRate.networkDifficulty")
              }}</div>
            </div>
            <div class="col-4">
              <div class="small-container data-fields rounded-borders text-right">
                {{ hashRateData?.bestDiff }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <q-card-section class="col-lg-4 col-md-4 card-text">
        {{ t("dashboardPage.hashRate.description") }}
      </q-card-section>
    </q-card-section>
  </q-card>
  <q-dialog v-model="showDialogReset" persistent backdrop-filter="blur(2px) saturate(150%)">
    <q-card class="dialogBg text-white text-weight-bold ">
      <q-card-section class="row items-center">
        <q-avatar icon="warning" class="btn-background" text-color="white" style="border-radius:25px" />
        <span class="q-ml-sm"><b>Hashrate data will be deleted. Are you sure?</b></span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn label="Reset" class="btn-background" @click="axeStore.resetDataLocalStorage()" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAxeStore } from '@/stores/axe'
import { useI18n } from 'vue-i18n';
export default defineComponent({
  name: 'HashRateCard',
  props: {
    hashRateData: Object
  },
  setup(props) {
    const quasar = useQuasar()
    const { hashRateData } = toRefs(props);
    const axeStore = useAxeStore()
    const { t } = useI18n();
    const i18n = useI18n();
    const showDialogReset = ref(false);
    const formatNumber = (value) => {
      if (!value) return '';
      return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    const efficiency = computed(() => {
      return (hashRateData?.value?.power / (hashRateData?.value?.hashRate / 1000)).toFixed(2);
    });

    return {
      quasar,
      axeStore,
      formatNumber,
      efficiency,
      i18n,
      t,
      showDialogReset,
    }
  }
})
</script>
