<template>
  <q-page class="page-wrapper q-px-md">
    <div :class="quasar.screen.gt.xs ? 'dashboard-info' : 'dashboard-info-mobile'" class="q-mb-lg">
      <div class="card-title" style="font-size: 34px">{{ t("swarmPage.title") }}</div>
      <span class="card-text">{{ t("swarmPage.subtitle") }}</span>
    </div>
    <q-card flat class="power-card q-pa-md q-mt-md " v-if="quasar.screen.gt.sm">
      <template v-if="isLoadingDevices">
        <div class="text-center q-py-xl">
          <q-spinner-puff color="purple" size="5rem" />
        </div>
      </template>
      <template v-else>
        <q-card-section>
          <div class="row justify-between">
            <div class="card-title q-ml-sm">{{ t("swarmPage.devices") }}</div>
            <q-btn :label="t('swarmPage.addDevice')" class="q-px-xl btn-titles btn-background" no-caps
              @click="openDialog = !openDialog"></q-btn>
            <q-dialog v-model="openDialog" persistent backdrop-filter="brightness(60%)" @show="focusInput">
              <q-card style="width: 600px; max-width: 600px;" class="dialogBg">
                <q-card-actions align="right">
                  <q-btn flat icon="close" v-close-popup color="white" />
                </q-card-actions>
                <q-card-section class="q-ml-sm">
                  <div class="card-title q-pb-md" style="font-size: 34px; color:white!important">{{
                    t("swarmPage.addDevice") }}</div>

                  <!-- Row to align input and button -->
                  <q-form :class="quasar.screen.gt.xs ? 'justify-between' : 'justify-center'" @submit="onSubmit()"
                    @submit.prevent="">
                    <div class="row items-start">

                      <q-input dense ref="ipInputRef" filled color="deep-purple" stack-label v-model="form.ip"
                        label="IP address" dark style="width: 400px;" :rules="[validateIPAddress]" />

                      <q-btn class="q-ml-md q-px-lg btn-titles btn-background" type="submit" :label="t('swarmPage.add')"
                        no-caps></q-btn>

                    </div>
                  </q-form>

                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
          <div class="row q-mt-md justify-between">
            <!-- column names -->
            <div class="col-lg-7 col-md-8 col-sm-5">
              <div v-if="SWARM_DATA?.length > 0">
                <Transition name="slide-fade">
                  <div class="row">
                    <div class="col-lg-4 col-md-4">
                      <div class="row justify-evenly q-mt-md">
                        <div class="col-6">
                          <div class="rounded-borders data-label text-left" style="font-size: 20px!important;">
                            <span>{{ t("swarmPage.ip") }}</span>
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="rounded-borders data-label text-left" style="font-size: 20px!important;">
                            <span>{{ t("swarmPage.uptime") }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4">
                      <div class="row justify-evenly q-mt-md">
                        <div class="col-5">
                          <div class="rounded-borders data-label text-left" style="font-size: 20px!important;">
                            <span>Gh/s</span>
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="rounded-borders data-label text-left" style="font-size: 20px!important;">
                            <span>{{ t("swarmPage.temp") }}</span>
                          </div>
                        </div>
                        <div class="col-2">
                          <div class="rounded-borders data-label text-left" style="font-size: 20px!important;">
                            <span>{{ t("swarmPage.power") }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>

              <div v-for="(device, index) in SWARM_DATA" :key="index">
                <!--  -->
                <Transition name="slide-fade">
                  <q-card-section horizontal v-if="SWARM_DATA?.length > 0">
                    <template v-if="device?.isActive">
                      <div class="col-lg-4 col-md-4">
                        <div class="row justify-evenly q-mt-md">
                          <div class="col-6">
                            <div class="small-container data-label rounded-borders text-left">
                              {{ device?.IP }}
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="small-container data-label rounded-borders text-right">
                              {{ uptimeFormatted(device?.uptimeSeconds) }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-5 col-md-5">
                        <div class="row justify-evenly q-mt-md">
                          <div class="col-4">
                            <div class="small-container data-fields rounded-borders text-left">
                              {{ device?.hashRate?.toFixed(2) }} Gh/s
                            </div>
                          </div>
                          <div class="col-3">
                            <div class="small-container data-fields rounded-borders text-right">
                              {{ Math.round(device.temp) }} º
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="small-container data-fields rounded-borders text-right">
                              {{ Math.round(device?.power) }} W
                            </div>
                          </div>
                        </div>
                      </div>
                      <template v-if="device?.IP !== currentDeviceIP">
                        <q-btn flat round color="deep-purple-11" icon="restart_alt"
                          @click="openDialogRestart(device.IP)">
                          <q-tooltip>
                            {{ t("swarmPage.restartDevice") }}
                          </q-tooltip>
                        </q-btn>
                        <q-btn flat round color="deep-purple-11" icon="playlist_remove"
                          @click="openDialogDelete(device.IP)">
                          <q-tooltip>
                            {{ t("swarmPage.deleteDevice") }}
                          </q-tooltip>
                        </q-btn>
                      </template>
                    </template>
                    <template v-else>
                      <div class="col-9 small-container q-my-sm rounded-borders"
                        style="color:#B70F0A !important; border-radius: 5px;">
                        {{ device?.IP }} <q-icon name="sensors_off"></q-icon> {{ t("swarmPage.cantConnect") }}
                      </div>
                    </template>
                  </q-card-section>
                </Transition>
              </div>
            </div>

            <!-- Cards column -->
            <div class="col-12 col-lg-5 col-md-4" v-if="SWARM_DATA.length > 0">
              <div :class="quasar.screen.gt.lg ? 'row justify-between' : 'q-gutter-md'">
                <q-card flat class="swarmCards q-pa-sm card" :style="quasar.screen.gt.lg ? 'width:240px' : ''">
                  <q-card-section>
                    <span class="card-title">{{ t("swarmPage.miningPower") }}</span>
                    <div class="card-text">{{ t("swarmPage.miningPowerSubtitle") }}</div>
                  </q-card-section>
                  <q-card-section>
                    <div class="text-center">
                      <div>
                        <span class="q-mx-sm  yellowData" style="font-size: 20px; font-weight: 600;">
                          {{ totalHashRate?.totalValue.toFixed(2) }} {{ totalHashRate?.unit }} </span>
                        <span>
                          {{ t("swarmPage.hashrate") }}
                        </span>
                      </div>
                      <div><span class="q-xl-sm yellowData" style="font-size: 20px; font-weight: 600;">
                          {{ totalEfficiency }} J/Th</span>
                        <span>&nbsp;{{ t("swarmPage.efficiency") }} <small>(≈ {{ efficiency }} W/Th)</small></span>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>

                <q-card flat class="swarmCards q-pa-sm card"
                  :style="quasar.screen.gt.lg ? 'width:240px!important' : ''">
                  <q-card-section>
                    <span class="card-title">{{ t("swarmPage.consumption") }}</span>
                    <div class="card-text">{{ t("swarmPage.consumptionSubtitle") }}</div>
                  </q-card-section>
                  <q-card-section class="text-center">
                    <q-icon name="flash_on" color="yellow-8" size="lg" />
                    <span class="yellowData text-h6 q-mx-sm text-bold">{{ Math.round(totalPowerConsumption) }} </span>
                    <span>Watts</span>
                  </q-card-section>
                </q-card>

                <q-card flat class="swarmCards q-pa-sm card col-12" :class="quasar.screen.gt.lg ? 'q-mt-md' : ''">
                  <q-card-section>
                    <span class="card-title">{{ t("swarmPage.electricalCost") }}</span>
                    <div>
                      <span class="card-text">{{ t("swarmPage.electricalSubtitle") }}</span>
                    </div>
                    <div>
                      <q-item>
                        <q-input class="q-my-md q-mr-xs" filled color="deep-purple" stack-label
                          @keydown="(e) => !/^[0-9.]+$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab' && e.preventDefault()"
                          :label="t('swarmPage.price') + ' Kw/h'" :dark="axeStore.darkmode ? true : false"
                          v-model="costKwh" />

                        <q-select class="q-my-md" filled color="deep-purple" stack-label :dark="axeStore.darkmode"
                          v-model="currency" :options="currencyOptions" option-label="label" option-value="symbol"
                          emit-value map-options />
                      </q-item>
                    </div>
                  </q-card-section>

                  <q-card-section class="text-center">
                    <div class="row q-col-gutter-md">
                      <div class="col-4">
                        <div class="card-text text-grey-7">{{ t('swarmPage.daily') }}</div>
                        <div class="text-h6 yellowData">{{ currency.symbol ?? currency }} {{ dailyCost.toFixed(2) }}
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="card-text text-grey-7">{{ t('swarmPage.monthly') }}</div>
                        <div class="text-h6 yellowData">{{ currency.symbol ?? currency }} {{ Math.round(monthlyCost) }}
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="card-text text-grey-7">{{ t('swarmPage.yearly') }}</div>
                        <div class="text-h6 yellowData">{{ currency.symbol ?? currency }} {{ Math.round(yearlyCost) }}
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>

        </q-card-section>
      </template>
    </q-card>
    <div v-if="!quasar.screen.gt.sm">
      <template v-if="isLoadingDevices" class="text-center">
        <q-spinner-puff color="primary" size="4em" />
      </template>
      <template v-else>
        <q-tabs no-caps inline-label v-model="tab" active-color="deep-purple-5" class="text-grey shadow-container">
          <q-tab class="q-mx-sm" icon="device_hub" :label="t('swarmPage.title')" name="swarmDevices" />
          <q-tab class="q-mx-sm" icon="speed" :label="t('swarmPage.totalValues')" name="totalValues" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated class="bg-transparent">
          <q-tab-panel name="swarmDevices">
            <!-- Btn Add Device -->
            <div class="row justify-center q-mt-md">
              <q-btn :label="t('swarmPage.addDevice')" class="q-px-xl btn-titles btn-background" no-caps
                @click="openDialog = !openDialog"></q-btn>
            </div>
            <q-dialog v-model="openDialog" persistent backdrop-filter="brightness(60%)">
              <q-card style="width: 550px; max-width: 550px;" class="dialogBg">
                <q-card-actions align="right">
                  <q-btn flat icon="close" v-close-popup color="white" />
                </q-card-actions>
                <q-card-section class="q-mx-auto">
                  <div class="card-title q-mb-md" style="font-size: 24px">{{ t("swarmPage.addDevice") }}</div>
                  <!-- Row to align input and button -->
                  <q-form @submit="onSubmit()" @submit.prevent="">
                    <div class="row items-baseline">

                      <q-input class="q-mb-md" ref="ipInputRef" filled color="deep-purple" stack-label v-model="form.ip"
                        label="IP address" dark style="width: 300px;" :rules="[validateIPAddress]" />

                      <q-btn class="q-mx-auto q-px-lg btn-titles btn-background" type="submit"
                        :label="t('swarmPage.add')" no-caps></q-btn>

                    </div>
                  </q-form>

                </q-card-section>
              </q-card>
            </q-dialog>
            <!-- Arr of devices -->
            <div v-for="(device, index) in SWARM_DATA" :key="index">
              <Transition name="slide-fade" v-if="SWARM_DATA?.length > 0">
                <template v-if="device?.isActive">
                  <q-card flat class="power-card-mobile q-mt-md">
                    <q-card-section class="q-py-lg">
                      <div class="device-title q-ml-lg row data-label contents-center">
                        <q-icon name="leak_add" size="sm" class="q-mr-md parpadea" />
                        {{ t("swarmPage.device") }}: {{ device?.IP }}

                        <!-- Menu 3 puntos (opciones) -->
                        <q-btn flat round icon="more_vert" @click="showMenu = !showMenu" class="q-ml-sm" />
                        <q-menu v-show="showMenu" flat>
                          <q-list>
                            <q-item clickable @click="openDialogRestart(device.IP)">
                              <q-btn flat round color="deep-purple-11" icon="restart_alt"
                                :label="t('swarmPage.restartDevice')" no-caps>
                              </q-btn>
                            </q-item>
                            <q-item clickable @click="openDialogDelete(device.IP)">
                              <q-btn flat round color="deep-purple-11" :label="t('swarmPage.deleteDevice')" no-caps
                                icon="playlist_remove">
                              </q-btn>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </div>

                      <div class="col-sm-6 col-xs-6">
                        <div class="row justify-evenly q-mt-md">
                          <div class="col-4">
                            <div class="small-container data-label rounded-borders text-left">
                              {{ t("swarmPage.uptime") }}
                            </div>
                          </div>
                          <div class="col-7">
                            <div class="small-container data-label rounded-borders text-right">
                              {{ uptimeFormatted(device?.uptimeSeconds) }}
                            </div>
                          </div>
                        </div>
                        <div class="row justify-evenly q-mt-md">
                          <div class="col-4">
                            <div class="small-container rounded-borders text-left">
                              Gh/s
                            </div>
                          </div>
                          <div class="col-6">
                            <div class="small-container data-fields rounded-borders text-right">
                              {{ device?.hashRate.toFixed(2) }} Gh/s
                            </div>
                          </div>
                        </div>
                        <div class="row justify-evenly q-mt-md">
                          <div class="col-4">
                            <div class="small-container data-label rounded-borders text-left">
                              {{ t("swarmPage.temp") }}
                            </div>
                          </div>
                          <div class="col-6">
                            <div class="small-container data-fields rounded-borders text-right">
                              {{ device?.temp }} º
                            </div>
                          </div>
                        </div>
                        <div class="row justify-evenly q-mt-md">
                          <div class="col-6">
                            <div class="small-container data-label rounded-borders text-left">
                              {{ t("swarmPage.power") }}
                            </div>
                          </div>
                          <div class="col-6">
                            <div class="small-container data-fields rounded-borders text-right">
                              {{ Math.round(device?.power) }} W
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </template>
                <template v-else>
                  <div class="col-9 q-my-sm small-container rounded-borders"
                    style="color:#B70F0A !important;border-radius: 5px; ">
                    {{ device?.IP }} <q-icon name="sensors_off"></q-icon> {{ t("swarmPage.cantConnect") }}
                  </div>
                </template>

              </Transition>
            </div>
          </q-tab-panel>
          <q-tab-panel name="totalValues">

            <template v-if="SWARM_DATA.length > 0">
              <q-card flat class="swarmCardsMobile q-pa-xs card q-my-md ">
                <q-card-section>
                  <span class="card-title"> {{ t("swarmPage.miningPower") }}</span>
                  <div>
                    <span class="card-text"> {{ t("swarmPage.miningPowerSubtitle") }}</span>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="text-center">
                    <div>
                      <span class="q-mx-sm text-h6 yellowData">
                        {{ totalHashRate?.totalValue.toFixed(2) }} {{ totalHashRate?.unit }} </span>
                      <span>
                        {{ t("swarmPage.hashrate") }}
                      </span>
                    </div>
                    <div><span class="q-mx-sm text-h6 yellowData">
                        {{ totalEfficiency }} J/Th</span>
                      <span>&nbsp;{{ t("swarmPage.efficiency") }} <small>(≈ {{ efficiency }} W/Th)</small></span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
              <q-card flat class="swarmCardsMobile q-pa-sm card q-my-md">
                <q-card-section>
                  <span class="card-title">{{ t("swarmPage.consumption") }}</span>
                  <div>
                    <span class="card-text">{{ t("swarmPage.consumptionSubtitle") }}</span>
                  </div>
                </q-card-section>

                <q-card-section class="text-center">
                  <q-icon name="flash_on" color="yellow-8" size="lg" />
                  <span class="yellowData q-mx-sm text-h6">{{ Math.round(totalPowerConsumption) }}</span>
                  <span> Watts</span>
                </q-card-section>
              </q-card>


              <q-card flat class="swarmCardsMobile q-pa-md card q-my-md">
                <q-card-section>
                  <span class="card-title">{{ t("swarmPage.electricalCost") }}</span>
                  <div>
                    <span class="card-text">{{ t("swarmPage.electricalSubtitle") }}</span>
                  </div>
                  <div>
                    <q-item>
                      <q-input class="q-my-md q-mr-xs" filled color="deep-purple" stack-label
                        @keydown="(e) => !/^[0-9.]+$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab' && e.preventDefault()"
                        :label="t('swarmPage.price') + ' Kw/h'" :dark="axeStore.darkmode ? true : false"
                        v-model="costKwh" />

                      <q-select class="q-my-md" filled color="deep-purple" stack-label :dark="axeStore.darkmode"
                        v-model="currency" :options="currencyOptions" option-label="label" option-value="symbol"
                        emit-value map-options />
                    </q-item>
                  </div>
                </q-card-section>

                <q-card-section class="text-center">
                  <div class="row q-col-gutter-md">
                    <div class="col-4">
                      <div class="text-caption text-grey-7">{{ t('swarmPage.daily') }}</div>
                      <div class="text-h6 yellowData">{{ currency.symbol ?? currency }} {{ dailyCost.toFixed(2) }}</div>
                    </div>
                    <div class="col-4">
                      <div class="text-caption text-grey-7">{{ t('swarmPage.monthly') }}</div>
                      <div class="text-h6 yellowData">{{ currency.symbol ?? currency }} {{ Math.round(monthlyCost) }}
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="text-caption text-grey-7">{{ t('swarmPage.yearly') }}</div>
                      <div class="text-h6 yellowData">{{ currency.symbol ?? currency }} {{ Math.round(yearlyCost) }}
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

            </template>


            <q-banner v-else class="banner-card q-py-md ">
              <template v-slot:avatar>
                <q-icon name="info_outline" color="deep-purple-4" size="sm" />
              </template>
              {{ t("swarmPage.noDeviceInfo") }}
            </q-banner>

          </q-tab-panel>
        </q-tab-panels>
      </template>
    </div>
  </q-page>
  <q-dialog v-model="confirmRestart" persistent backdrop-filter="blur(2px) saturate(150%)">
    <q-card class="dialogBg text-white text-weight-bold ">
      <q-card-section class="row items-center">
        <q-avatar icon="warning" class="btn-background" text-color="white" style="border-radius: 25px;" />
        <span class="q-ml-sm"><b>{{ t('swarmPage.restartDialog') }}</b></span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn label="OK" class="btn-background" @click="restartSwarmDevice(deviceSelected)" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- dialog delete swarm device -->
  <q-dialog v-model="confirmDelete" persistent backdrop-filter="blur(2px) saturate(150%)">
    <q-card class="dialogBg text-white text-weight-bold ">
      <q-card-section class="row items-center">
        <q-avatar icon="warning" class="btn-background" text-color="white" style="border-radius: 25px;" />
        <span class="q-ml-sm"><b>{{ t('swarmPage.deleteDialog') }}</b></span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn label="OK" class="btn-background" @click="removeDevice(deviceSelected)" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, computed, ref, reactive, nextTick, onBeforeMount, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from "vue-router";
import { useQuasar, Notify, Dialog } from "quasar"
import { useAxeStore } from '@/stores/axe';
import axios from 'axios'
import { useI18n } from 'vue-i18n';
// import DialogRestartSwarmDeviceComponent from '@/components/DialogRestartSwarmDeviceComponent.vue';
export default defineComponent({
  name: 'SwarmPage',
  components: {
    // DialogRestartSwarmDeviceComponent,
  },
  setup() {
    const quasar = useQuasar();
    const axeStore = useAxeStore();
    const openDialog = ref(false);
    const ipInputRef = ref(null)
    const SWARM_DATA = ref([]);
    const tab = ref("swarmDevices");
    const { t } = useI18n();
    const { locale } = useI18n();
    const route = useRoute();
    const showMenu = ref(false);

    const currentDeviceIP = ref(null);
    const isLoadingDevices = ref(true);
    const isFirstLoad = ref(true);

    const confirmRestart = ref(false);
    const confirmDelete = ref(false);
    const deviceSelected = ref(null);

    const currencyOptions = ref([
      { label: '$ (USD)', symbol: '$' },
      { label: '€ (EUR)', symbol: '€' },
      { label: '£ (GBP)', symbol: '£' },
      { label: '₽ (RUB)', symbol: '₽' },
      { label: '¥ (CNY)', symbol: '¥' },
      { label: '₹ (INR)', symbol: '₹' },
      { label: 'C$ (CAD)', symbol: 'C$' },
      { label: 'A$ (AUD)', symbol: 'A$' },
      { label: '(CHF)', symbol: 'CHF' },
      { label: '₿ (BTC)', symbol: '₿' },
      { label: 'Ξ (ETH)', symbol: 'Ξ' }
    ]);

    const getInitialCurrency = () => {
      try {
        const saved = localStorage.getItem('currency');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Asegurarse de que tenga el formato correcto
          return {
            label: parsed.label || '€ (EUR)',
            symbol: parsed.symbol || '€'
          };
        }
      } catch (e) {
        console.error('Error al cargar la moneda:', e);
      }
      // Valor por defecto
      return { label: '€ (EUR)', symbol: '€' };
    };
    const currency = ref(getInitialCurrency());

    const costKwh = ref(parseFloat(localStorage.getItem('costKwh')) || 0.25);

    const dailyCost = computed(() => {
      return costKwh.value * (totalPowerConsumption.value / 1000) * 24;
    });
    const monthlyCost = computed(() => {
      return costKwh.value * (totalPowerConsumption.value / 1000) * 24 * 30;
    });
    const yearlyCost = computed(() => {
      return costKwh.value * (totalPowerConsumption.value / 1000) * 24 * 365;
    });

    watch(costKwh, () => {
      localStorage.setItem('costKwh', costKwh.value);
    });

    watch(currency, (newValue) => {
      console.log('Guardando moneda:', newValue);

      let currencyToSave;
      if (typeof newValue === 'string') {
        // Si solo es el símbolo, buscamos el objeto correspondiente
        const found = currencyOptions.value.find(opt => opt.symbol === newValue);
        currencyToSave = found || currencyOptions.value[1]; // EUR por defecto
      } else {
        // Si es un objeto, lo usamos directamente
        currencyToSave = newValue;
      }

      localStorage.setItem('currency', JSON.stringify({
        label: currencyToSave.label,
        symbol: currencyToSave.symbol
      }));
    }, { deep: true, immediate: true });


    onBeforeMount(() => {
      const lang = route.query.lang || 'es';
      locale.value = lang;
    });
    const form = reactive({
      ip: ""
    })
    const focusInput = () => {
      nextTick(() => {
        ipInputRef.value?.focus?.();
      });
    };
    const totalPowerConsumption = computed(() => {
      var total = SWARM_DATA.value.reduce((accumulated, device) => {
        if (device?.isActive) {
          return accumulated + device?.power;
        }
        return accumulated;
      }, 0);
      return total;
    })
    const totalHashRate = computed(() => {
      var total = SWARM_DATA.value.reduce((accumulated, device) => {
        if (device?.isActive) {
          return accumulated + device?.hashRate;
        }
        return accumulated;
      }, 0);

      var totalHashRateRounded = parseFloat(total.toFixed(2));
      if (totalHashRateRounded >= 1000) {
        const thzValue = (totalHashRateRounded / 1000);
        return { totalValue: thzValue, unit: 'Th/s' };
      }
      return { totalValue: totalHashRateRounded, unit: 'Gh/s' };
    });

    const totalEfficiency = computed(() => {
      var divisor;
      if (totalHashRate?.value?.unit === 'Th/s')
        divisor = 1;
      else// GH/s
        divisor = 1000;

      var totalEfficiency = totalPowerConsumption?.value / (totalHashRate?.value?.totalValue / divisor)
      return Math.round(totalEfficiency);
    })

    const uptimeFormatted = (uptimeSeconds) => {
      var d = Number(uptimeSeconds)
      var days = Math.floor(d / 86400);
      var h = Math.floor((d % 86400) / 3600);
      var m = Math.floor((d % 3600) / 60);
      var s = Math.floor((d % 3600) % 60);

      return `${days}d:${h}h:${m}m`;
    }
    const validateIPAddress = (value) => {
      const ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;
      return ipRegex.test(value) || 'Please enter a valid IP address';
    }
    const updateSwarm = async (ip) => {
      return axios.get(`http://${ip}/api/swarm`);
    }
    const removeDevice = async (device) => {

      const deviceExists = SWARM_DATA.value.some((d) => d.IP === device);
      if (!deviceExists) return;

      const newSwarm = SWARM_DATA.value.filter((deviceFromArr) => deviceFromArr.IP != device);

      localStorage.setItem('SWARM_DATA', JSON.stringify(newSwarm));

      SWARM_DATA.value = newSwarm;

      Notify.create({
        message: t('swarmPage.deletedDevice'),
        position: "top",
        timeout: 4000,
        type: 'positive',
      });
    }
    const restartSwarmDevice = (device) => {
      return axios
        .post(`http://${device}/api/system/restart`)
        .then((res) => {
          return res.data;
        })
        .finally(() => {
          Notify.create({
            message: t('swarmPage.restartedDevice'),
            position: "top",
            timeout: 4000,
            type: 'positive',
          });
        })
    }

    const openDialogRestart = (deviceIP) => {
      confirmRestart.value = !confirmRestart.value;
      deviceSelected.value = deviceIP;
    };
    const openDialogDelete = (deviceIP) => {
      confirmDelete.value = !confirmDelete.value;
      deviceSelected.value = deviceIP;
    };
    const getSwarmDeviceInfo = async (deviceIP) => {
      try {
        const res = await axios.get(`http://${deviceIP}/api/system/info`, { timeout: 5000 });
        return { IP: deviceIP, isActive: true, ...res.data };
      } catch (err) {
        return { IP: deviceIP, isActive: false };
      }
    };

    const addNewDevice = (newIp) => {
      if (SWARM_DATA.value.some(item => item.IP === newIp)) {
        Notify.create({
          message: t('swarmPage.duplicateDevice'),
          position: "top",
          timeout: 4000,
          type: 'warning',
        });

        return;
      }

      try {
        return axios.get(`http://${newIp}/api/system/info`, { timeout: 5000 }).then(res => {
          if (res?.data) {
            SWARM_DATA.value.push({ IP: newIp, isActive: true, ...res.data });
            localStorage.setItem('SWARM_DATA', JSON.stringify(SWARM_DATA.value));
          }
        }).catch(err => {
          SWARM_DATA.value.push({ IP: newIp, isActive: false });
          localStorage.setItem('SWARM_DATA', JSON.stringify(SWARM_DATA.value));
        });
      } catch {
        SWARM_DATA.value.push({ IP: newIp, isActive: false });
        localStorage.setItem('SWARM_DATA', JSON.stringify(SWARM_DATA.value));
      }
    };

    const onSubmit = async () => {
      if (ipInputRef.value.validate()) {
        openDialog.value = !openDialog.value;
        try {
          const newIp = form.ip;
          const [newSwarmInfo, existingSwarmInfo] = await Promise.all([
            addNewDevice(newIp),
            getSwarmDeviceInfo(newIp)
          ]);

          if (newSwarmInfo && existingSwarmInfo) {
            const swarmUpdatePromises = SWARM_DATA.value?.map(({ IP }) => {
              return updateSwarm(IP, [{ ip: newIp }, ...newSwarmInfo, existingSwarmInfo]);
            });

            const newAxeOsPromise = updateSwarm(newIp, [{ ip: newIp }, existingSwarmInfo]);

            await Promise.all([newAxeOsPromise, ...swarmUpdatePromises]);

            SWARM_DATA.value.push({
              existingSwarmInfo,
              ip: newIp
            });


          } else {
            return { IP: ip, isActive: false };
          }
        } catch {
          return { IP: ip, isActive: false };
        } finally {

        }
      }
    };

    const loadDevicesFromLocalStorage = async (urlIP) => {
      if (isFirstLoad.value) {
        isLoadingDevices.value = true;
      }
      try {
        const storedDevices = localStorage.getItem('SWARM_DATA');
        if (storedDevices) {
          const devices = JSON.parse(storedDevices);
          const updatedDevices = await Promise.all(devices.map(async (device) => {
            const deviceInfo = await getSwarmDeviceInfo(device?.IP);
            return { ...device, ...deviceInfo };
          }));
          SWARM_DATA.value = updatedDevices;
          let currentDeviceInSwarm = SWARM_DATA.value.some(device => device?.IP === urlIP);
          if (!currentDeviceInSwarm) {
            await getCurrentDevice();
          }
        } else {
          await getCurrentDevice();
        }
      } catch (error) {

      } finally {
        if (isFirstLoad.value) {
          isLoadingDevices.value = false;
          isFirstLoad.value = false;
        }
      }
    };
    const getCurrentDevice = async () => {
      return axios.get(`/api/system/info`).then(res => {
        if (res?.data) {
          SWARM_DATA.value.push({ IP: currentDeviceIP.value, isActive: true, ...res.data });
          localStorage.setItem('SWARM_DATA', JSON.stringify(SWARM_DATA.value));
        }
      });
    }
    const getIpOfDevice = () => {
      var url = window.location.href;
      var ip = url.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
      return ip ? ip[0] : null;
    };
    let intervalId = 0;

    onMounted(() => {
      currentDeviceIP.value = getIpOfDevice();
      console.log(currentDeviceIP.value)

      intervalId = setInterval(() => {
        loadDevicesFromLocalStorage(currentDeviceIP.value);
      }, 5000);
    })

    onUnmounted(() => {
      clearInterval(intervalId);
    });

    return {
      quasar,
      openDialog,
      form,
      validateIPAddress,
      onSubmit,
      ipInputRef,
      SWARM_DATA,
      removeDevice,
      totalPowerConsumption,
      totalHashRate,
      totalEfficiency,
      uptimeFormatted,
      tab,
      t,
      openDialogRestart,
      openDialogDelete,
      focusInput,
      ipInputRef,
      deviceSelected,
      confirmDelete,
      confirmRestart,
      restartSwarmDevice,
      showMenu,
      currentDeviceIP,
      isLoadingDevices,
      isFirstLoad,
      costKwh,
      currency,
      currencyOptions,
      axeStore,
      dailyCost,
      monthlyCost,
      yearlyCost
    }
  }
})
</script>
<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>