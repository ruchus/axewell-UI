<template>
  <q-layout view="lHh Lpr lFf" class="bg-layout full-width-layout">
    <q-header class="bg-layout" style="left: 0; box-shadow: 0 1px 3px rgba(128, 128, 128, 0.15)">
      <div class="header-container">
        <!-- Desktop: Logo & Brand -->
        <div class="row items-center no-wrap q-pl-md" v-if="quasar.screen.gt.sm">
          <img 
            src="@/assets/logo.png" 
            alt="axewell" 
            width="28" 
            :style="axeStore.darkmode ? '' : 'filter: brightness(0)'"
          />
          <span class="axe-title q-ml-sm" style="font-size: 26px; letter-spacing: -1.2px;">axewell</span>
        </div>

        <!-- Desktop: Status & Controls -->
        <div class="right-aligned" v-if="quasar.screen.gt.sm">
          <!-- Status Badge Group -->
          <div class="status-group">
            <!-- Connection Section -->
            <span class="secondary-fields" style="font-size: 13px; font-weight: 500; white-space: nowrap; flex-shrink: 0;">
              {{ axeStore?.infoData?.ssid || 'No SSID' }}
            </span>
            
            <!-- Fixed width slot for WiFi icon -->
            <div style="width: 20px; min-width: 20px; display: flex; justify-content: center; flex-shrink: 0;">
              <q-icon 
                v-if="isWifiConnected" 
                :name="wifiIcon" 
                :color="wifiColor" 
                size="17px"
              >
                <q-tooltip>
                  {{ signalQualityText }} ({{ axeStore?.infoData?.wifiRSSI }} dBm)
                </q-tooltip>
              </q-icon>
              <q-icon v-else name="wifi_off" color="red-4" size="17px">
                <q-tooltip>{{ t('layout.notConnected') }}</q-tooltip>
              </q-icon>
            </div>

            <!-- Divider -->
            <div class="header-divider"></div>

            <!-- Uptime Section (Flattened for stability) -->
            <q-icon name="schedule" size="15px" class="secondary-fields" style="flex-shrink: 0; margin-right: -4px;" />
            <span class="secondary-fields" style="font-size: 13px; font-weight: 500; white-space: nowrap; flex-shrink: 0;">
              {{ axeStore.secondsToHms }}
            </span>

            <!-- Restart Button -->
            <q-btn 
              :loading="axeStore.restartSystemLoading"
              round 
              flat 
              dense
              size="sm"
              icon="restart_alt"
              class="secondary-fields"
              style="flex-shrink: 0; margin-left: 2px;"
              @click="confirm = !confirm"
            >
              <q-tooltip>{{ t('layout.restartText') }}</q-tooltip>
            </q-btn>
          </div>

          <!-- Action Buttons -->
          <div class="header-actions">
            <q-btn-dropdown
              flat
              no-caps
              dense
              :label="currentLanguage"
              icon="translate"
              class="translation-dropdown"
              style="border-radius: 8px;"
            >
              <q-list class="list">
                <q-item
                  v-for="(localeItem, index) in locales"
                  :key="index"
                  clickable
                  v-close-popup
                  @click="onLanguageClick(localeItem.value)"
                >
                  <q-item-section>{{ localeItem.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <q-btn
              round
              flat
              dense
              :icon="axeStore.darkmode ? 'light_mode' : 'dark_mode'"
              class="secondary-fields"
              @click="axeStore.darkmode = !axeStore.darkmode"
            >
              <q-tooltip>{{ axeStore.darkmode ? t('layout.lightMode') : t('layout.darkMode') }}</q-tooltip>
            </q-btn>
          </div>
        </div>


        <!-- Mobile View -->
        <div v-else class="mobile-header-container">
          <!-- Menu Button -->
          <q-btn
            dense
            round
            flat
            icon="menu"
            class="secondary-fields"
            @click="axeStore.isDrawerOpenMobile = !axeStore.isDrawerOpenMobile"
          />

          <!-- Center: Logo & Brand -->
          <div class="row items-center no-wrap">
            <img 
              src="@/assets/logo.png" 
              alt="axewell" 
              width="22" 
              :style="axeStore.darkmode ? '' : 'filter: brightness(0)'"
            />
            <span class="axe-title q-ml-xs" style="font-size: 18px; letter-spacing: -0.8px;">
              axewell
            </span>
          </div>

          <!-- Right: Compact Status -->
          <div class="status-group-mobile">
            <q-icon 
              v-if="isWifiConnected" 
              :name="wifiIcon" 
              :color="wifiColor" 
              size="16px"
            >
              <q-tooltip>
                {{ axeStore?.infoData?.ssid }}<br>
                {{ signalQualityText }} ({{ axeStore?.infoData?.wifiRSSI }} dBm)
              </q-tooltip>
            </q-icon>
            <q-icon v-else name="wifi_off" color="red-4" size="16px">
              <q-tooltip>{{ t('layout.notConnected') }}</q-tooltip>
            </q-icon>

            <q-btn
              dense
              flat
              round
              size="xs"
              icon="restart_alt"
              class="secondary-fields"
              :loading="axeStore.restartSystemLoading"
              @click="confirm = !confirm"
            >
              <q-tooltip>{{ t('layout.restartText') }}</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </q-header>

    <q-drawer
      class="bg-layout q-pl-sm q-pr-md q-pt-md"
      v-model="axeStore.isDrawerOpenMobile"
      show-if-above
      :class="quasar.screen.gt.sm ? 'padding-top-drawer' : 'q-pt-md'"
    >
      <div class="text-right" style="float: right" v-if="!quasar.screen.gt.sm">
        <q-btn
          icon="close"
          flat
          class="secondary-fields"
          @click="axeStore.isDrawerOpenMobile = !axeStore.isDrawerOpenMobile"
        ></q-btn>
      </div>
      <div class="q-ma-md text-center" v-if="!quasar.screen.gt.sm">
        <q-toolbar-title shrink class="row items-center no-wrap">
          <img src="@/assets/logo.png" alt="" width="30" :style="axeStore.darkmode ? '' : 'filter: brightness(0)'" />
          <span class="axe-title q-ml-sm">axewell</span>
        </q-toolbar-title>
      </div>
      <q-list>
        <q-item-label header v-if="quasar.screen.gt.sm"> </q-item-label>
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
        <div v-if="!quasar.screen.gt.sm" class="q-gutter-x-sm row items-center">
          <div style="width: 100%">
            <q-separator class="q-my-md" />
            <q-btn-dropdown
              split
              class="q-ml-sm translation-dropdown"
              icon="translate"
              flat
              no-caps
              :label="currentLanguage"
            >
              <q-list>
                <q-item
                  v-for="(localeItem, index) in locales"
                  :key="index"
                  clickable
                  v-close-popup
                  @click="onLanguageClick(localeItem.value)"
                >
                  <q-item-section>
                    <q-item-label>{{ localeItem.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn
              round
              :icon="axeStore.darkmode ? 'light_mode' : 'dark_mode'"
              flat
              class="q-ml-md secondary-fields"
              @click="axeStore.darkmode = !axeStore.darkmode"
            />
          </div>
        </div>
      </q-list>
    </q-drawer>
    <q-footer class="bg-layout footer text-center">
      <q-toolbar>
        <q-toolbar-title>
          <a
            href="https://github.com/ruchus/axewell-UI"
            target="_blank"
            rel="noopener noreferrer"
            style="color: var(--text-primary)"
            >axewell UI</a
          >
          v{{ version }}, running on Bitaxe
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="confirm" persistent backdrop-filter="blur(2px) saturate(150%)">
      <q-card class="dialogBg text-white text-weight-bold">
        <q-card-section class="row items-center">
          <q-avatar
            icon="warning"
            class="btn-background"
            text-color="white"
            style="border-radius: 25px"
          />
          <span class="q-ml-sm"
            ><b>{{ t('layout.restartText') }}</b></span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            label="OK"
            class="btn-background"
            @click="axeStore.restartSystem(t)"
            v-close-popup
          />
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
import { useI18n } from 'vue-i18n'
import { availableLocales } from '@/locales/index.js'
import { useRouter } from 'vue-router'
import '@quasar/extras/material-icons/material-icons.css'

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
    const { locale } = useI18n()
    locale.value = window.navigator.language.substring(0, 2) || 'en'
    const router = useRouter()
    const locales = availableLocales.map((locale) => {
      let label = ''
      switch (locale) {
        case 'es':
          label = 'Español'
          break
        case 'en':
          label = 'English'
          break
        case 'fr':
          label = 'Français'
          break
        case 'ru':
          label = 'Русский'
          break
        default:
          label = locale
      }
      return { label, value: locale }
    })
    watch(
      () => axeStore.darkmode,
      async (val, prevVal) => {
        // quasar.dark.set(axeStore.darkmode);
        if (val == true) {
          document.body.setAttribute('data-theme', 'dark')
        } else {
          document.body.setAttribute('data-theme', 'light')
        }
      }
    )
    const onLanguageClick = (localeItemSelected) => {
      // languageCode = localeItemSelected.substring(0, 2);
      var languageCode = localeItemSelected.substring(0, 2).toLowerCase()
      if (languageCode) {
        locale.value = languageCode
        localStorage.setItem('locale', locale.value)
        router.push({
          name: '',
          query: { lang: languageCode }
        })
      }
    }
    const isWifiConnected = computed(() => axeStore?.infoData?.wifiStatus === 'Connected!')

    const wifiIcon = computed(() => {
      if (!isWifiConnected.value) return 'wifi_off'
      const rssi = axeStore?.infoData?.wifiRSSI ?? -100
      if (rssi >= -55) return 'signal_wifi_4_bar'
      if (rssi >= -67) return 'network_wifi'
      if (rssi >= -75) return 'network_wifi_2_bar'
      if (rssi >= -82) return 'network_wifi_1_bar'
      return 'network_wifi'
    })

    const wifiColor = computed(() => {
      if (!isWifiConnected.value) return 'red-4'
      const rssi = axeStore?.infoData?.wifiRSSI ?? -100
      if (rssi >= -55) return 'green-4'
      if (rssi >= -67) return 'light-green-4'
      if (rssi >= -75) return 'amber-4'
      if (rssi >= -82) return 'orange-4'
      return 'red-4'
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
      var localeLabel = ''
      if (locale.value == 'es') {
        localeLabel = t('layout.locale')
      } else if (locale.value == 'en') {
        localeLabel = t('layout.locale')
      } else if (locale.value == 'fr') {
        localeLabel = t('layout.locale')
      } else if (locale.value == 'ru') {
        localeLabel = t('layout.locale')
      }
      return localeLabel
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
    ])

    const confirm = ref(false)

    onMounted(() => {
      setInterval(() => {
        axeStore.getSystemInfo()
      }, 5000)

      if (axeStore.darkmode == true) {
        document.body.setAttribute('data-theme', 'dark')
      } else {
        document.body.setAttribute('data-theme', 'light')
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
