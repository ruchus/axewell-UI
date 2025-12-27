<template>
  <q-layout view="lHh Lpr lFf" class="bg-layout full-width-layout">
    <q-header class="bg-layout q-pt-md q-pb-sm" style="left: 0; box-shadow: 0 1px 2px rgba(128, 128, 128, 0.3);">
      <div class="header-container card-text">
        <div class="row left-aligned items-center q-pl-lg q-pt-md" v-if="quasar.screen.gt.sm">
          <template v-if="axeStore.darkmode">
            <img src="@/assets/logo.png" alt="" width="30">
          </template>
          <template v-else>
            <img src="@/assets/logod.png" alt="" width="30">
          </template>
          <span class="axe-title q-pl-sm">axewell</span>
        </div>

        <div class="right-aligned" v-if="quasar.screen.gt.sm">
          <div :style="axeStore.darkmode ? '' : 'font-weight:600'">
            <div class="q-mt-sm">
              <span class="secondary-fields  q-mr-sm">{{ axeStore?.infoData?.ssid }}</span>
              <q-icon v-if="isWifiConnected" :name="wifiIcon" :color="wifiColor" size="sm">
                <q-tooltip anchor="bottom middle" self="top middle">
                  {{ t('layout.signalQuality') }}: {{ signalQualityText }} ({{ axeStore?.infoData?.wifiRSSI }} dBm)
                </q-tooltip>
              </q-icon>
              <span v-else style="color:red">{{ t("layout.notConnected") }}</span>
            </div>
            <span class="secondary-fields">{{ t("layout.uptime") }}: {{ axeStore.secondsToHms }}</span>
            <q-btn :loading="axeStore.restartSystemLoading" round class="secondary-fields" style="background: none" flat
              @click="confirm = !confirm" icon="restart_alt" />
          </div>
          <div class="q-mx-lg">
            <q-btn-dropdown split class="translation-dropdown q-mr-md" icon="translate" no-caps flat
              :label="currentLanguage">
              <q-list v-for="(localeItem, index) in locales" class="list">
                <q-item clickable v-close-popup @click="onLanguageClick(localeItem.value)" :key="index">
                  <q-item-section>
                    <q-item-label>{{ localeItem.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn round :icon="axeStore.darkmode ? 'light_mode' : 'dark_mode'" flat size="md" class="secondary-fields"
              @click="axeStore.darkmode = !axeStore.darkmode"></q-btn>
          </div>

        </div>

        <div v-else class="q-py-sm">
          <div class="row">
            <div>
              <q-btn dense round flat aria-label="Menu" icon="menu" class="q-ml-md secondary-fields"
                @click="axeStore.isDrawerOpenMobile = !axeStore.isDrawerOpenMobile" />
            </div>
            <div class="text-subtitle2 q-ml-lg" style="color: #d4d4d4;"
              :style="axeStore.darkmode ? '' : 'font-weight:500'">
              <div>
                <span class="secondary-fields q-mr-sm">{{ axeStore?.infoData?.ssid }}</span>
                <q-icon v-if="isWifiConnected" :name="wifiIcon" :color="wifiColor" size="sm">
                  <q-tooltip anchor="bottom middle" self="top middle">
                    {{ t('layout.signalQuality') }}: {{ signalQualityText }} ({{ axeStore?.infoData?.wifiRSSI }} dBm)
                  </q-tooltip>
                </q-icon>
                <span v-else style="color:red">{{ t("layout.notConnected") }}</span>
              </div>
              <div>
                <span class="secondary-fields">{{ t("layout.uptime") }} {{ axeStore.secondsToHms }}</span>
                <q-btn :loading="axeStore.restartSystemLoading" round style="background: transparent"
                  class="secondary-fields" flat @click="confirm = !confirm" icon="restart_alt" />
              </div>
            </div>
          </div>


        </div>

        <!-- <q-btn v-if="!quasar.screen.gt.sm" dense round flat aria-label="Menu" icon="menu" color="white" class="q-ml-md"
          @click="axeStore.isDrawerOpenMobile = !axeStore.isDrawerOpenMobile">
        </q-btn> -->
      </div>
    </q-header>

    <q-drawer class="bg-layout q-pl-sm q-pr-md q-pt-md" v-model="axeStore.isDrawerOpenMobile" show-if-above
      :class="quasar.screen.gt.sm ? 'padding-top-drawer' : 'q-pt-md'">
      <div class="text-right" style="float: right" v-if="!quasar.screen.gt.sm">
        <q-btn icon="close" flat class="secondary-fields"
          @click="axeStore.isDrawerOpenMobile = !axeStore.isDrawerOpenMobile"></q-btn>
      </div>
      <div class="q-ma-md text-center" v-if="!quasar.screen.gt.sm">
        <q-toolbar-title shrink class="row items-center no-wrap">
          <img src="@/assets/logo.png" alt="" width="30">
          <span class="axe-title q-ml-sm">axewell</span>
        </q-toolbar-title>

      </div>
      <q-list>
        <q-item-label header v-if="quasar.screen.gt.sm"> </q-item-label>
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
        <div v-if="!quasar.screen.gt.sm" class="q-gutter-x-sm row items-center">

          <div style="width: 100%;">
            <q-separator class="q-my-md" />
            <q-btn-dropdown split class="q-ml-sm translation-dropdown" icon="translate" flat no-caps
              :label="currentLanguage">
              <q-list>
                <q-item v-for="(localeItem, index) in locales" :key="index" clickable v-close-popup
                  @click="onLanguageClick(localeItem.value)">
                  <q-item-section>
                    <q-item-label>{{ localeItem.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn round :icon="axeStore.darkmode ? 'light_mode' : 'dark_mode'" flat class="q-ml-md secondary-fields"
              @click="axeStore.darkmode = !axeStore.darkmode" />

          </div>

        </div>
      </q-list>
    </q-drawer>
    <q-footer class="bg-layout footer text-center">
      <q-toolbar>
        <q-toolbar-title>
          <a href="https://github.com/ruchus/axewell-UI" target="_blank" rel="noopener noreferrer"
            style="color: var(--text-primary)">axewell UI</a>
          v{{ version }}, running on Bitaxe
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="confirm" persistent backdrop-filter="blur(2px) saturate(150%)">
      <q-card class="dialogBg text-white text-weight-bold ">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" class="btn-background" text-color="white" style="border-radius: 25px;" />
          <span class="q-ml-sm"><b>{{ t("layout.restartText") }}</b></span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn label="OK" class="btn-background" @click="axeStore.restartSystem(t)" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { defineComponent, ref, watch, onMounted, computed } from 'vue'
import EssentialLink from '@/components/EssentialLink.vue'
import { useAxeStore } from '@/stores/axe'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n';
import { availableLocales } from '@/locales/index.js'
import { useRouter } from 'vue-router';
import '@quasar/extras/material-icons/material-icons.css';

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup() {
    const version = __APP_VERSION__
    const quasar = useQuasar()
    const axeStore = useAxeStore()
    const { t } = useI18n()
    const { locale } = useI18n();
    locale.value = window.navigator.language.substring(0, 2) || 'en';
    const router = useRouter()
    const locales = availableLocales.map(locale => {
      let label = '';
      switch (locale) {
        case 'es':
          label = 'Español';
          break;
        case 'en':
          label = 'English';
          break;
        case 'fr':
          label = 'Français';
          break;
        case 'ru':
          label = 'Русский';
          break;
        default:
          label = locale;
      }
      return { label, value: locale };
    });
    watch(() => axeStore.darkmode, async (val, prevVal) => {
      // quasar.dark.set(axeStore.darkmode);
      if (val == true) {
        document.body.setAttribute('data-theme', 'dark');
      } else {
        document.body.setAttribute('data-theme', 'light');
      }
    })
    const onLanguageClick = (localeItemSelected) => {
      // languageCode = localeItemSelected.substring(0, 2);
      var languageCode = localeItemSelected.substring(0, 2).toLowerCase()
      if (languageCode) {
        locale.value = languageCode;
        localStorage.setItem("locale", locale.value);
        router.push({
          name: "",
          query: { lang: languageCode },
        });
      }
    }
    const isWifiConnected = computed(() => axeStore?.infoData?.wifiStatus === 'Connected!')

    const wifiIcon = computed(() => {
      if (!isWifiConnected.value) return 'wifi_off'
      const rssi = axeStore?.infoData?.wifiRSSI ?? -100
      if (rssi >= -55) return 'signal_wifi_4_bar'
      if (rssi >= -67) return 'signal_wifi_3_bar'
      if (rssi >= -75) return 'signal_wifi_2_bar'
      if (rssi >= -82) return 'signal_wifi_1_bar'
      return 'signal_wifi_0_bar'
    })

    const wifiColor = computed(() => {
      if (!isWifiConnected.value) return 'red'
      const rssi = axeStore?.infoData?.wifiRSSI ?? -100
      if (rssi >= -55) return 'green'
      if (rssi >= -67) return 'light-green-6'
      if (rssi >= -75) return 'amber-7'
      if (rssi >= -82) return 'deep-orange-8'
      return 'red'
    })

    const signalQualityText = computed(() => {
      const rssi = axeStore?.infoData?.wifiRSSI ?? -100
      if (rssi >= -55) return t('layout.excellent')
      if (rssi >= -67) return t('layout.good')
      if (rssi >= -75) return t('layout.fair')
      if (rssi >= -82) return t('layout.weak')
      return t('layout.poor')
    })

    const currentLanguage = computed(() => {
      var localeLabel = '';
      if (locale.value == 'es') {
        localeLabel = t('layout.locale')
      } else if (locale.value == 'en') {
        localeLabel = t('layout.locale')
      } else if (locale.value == 'fr') {
        localeLabel = t('layout.locale')
      } else if (locale.value == 'ru') {
        localeLabel = t('layout.locale')
      }
      return localeLabel;
    })

    const linksList = computed(() => [
      {
        title: t('layout.dashboard'),
        icon: 'home',
        link: 'Dashboard'
      },
      {
        title: t('layout.swarm'),
        icon: 'device_hub',
        link: 'Swarm'
      },
      {
        title: 'Pool',
        icon: 'currency_bitcoin',
        link: 'Pool'
      },
      {
        title: t('layout.settings'),
        icon: 'settings',
        link: 'Settings'
      },
      {
        title: t('layout.system'),
        icon: 'memory',
        link: 'System'
      },
      {
        title: t('layout.network'),
        icon: 'wifi',
        link: 'Network'
      }
    ]);

    const confirm = ref(false);

    onMounted(() => {
      setInterval(() => {
        axeStore.getSystemInfo()
      }, 5000)

      if (axeStore.darkmode == true) {
        document.body.setAttribute('data-theme', 'dark');
      } else {
        document.body.setAttribute('data-theme', 'light');
      }
    })

    return {
      linksList,
      axeStore,
      quasar,
      onLanguageClick,
      locales,
      locale,
      currentLanguage,
      confirm,
      t,
      version,
      isWifiConnected,
      wifiIcon,
      wifiColor,
      signalQualityText

    }
  }
})
</script>