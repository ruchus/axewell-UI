<template>
  <div class="page-wrapper q-pa-md">
    <div :class="quasar.screen.gt.xs ? 'dashboard-info' : 'dashboard-info-mobile'" class="q-mb-lg">
      <div class="card-title" style="font-size: 34px">{{ t("settingsPage.title") }}</div>
      <span class="card-text">{{ t("settingsPage.subtitle") }}</span>
    </div>
    <div class="q-px-lg" :class="quasar.screen.gt.xs ? 'q-py-xl power-card' : 'q-py-md power-card-mobile'">
      <q-form @submit="confirm = !confirm">
        <div class="row" :class="quasar.screen.gt.sm ? 'justify-between' : 'justify-evenly'">
          <div class="col-12 col-lg-4 col-md-4 col-sm-12 col-xs-12"
            :class="quasar.screen.gt.md ? 'column-width-settings-big' : 'column-mobile-tablet'">
            <div class="card-title">{{ t("settingsPage.pool") }}</div>
            <span class="card-text">{{ t("settingsPage.poolText") }}</span>
            <q-input class="q-my-md" filled color="deep-purple" stack-label v-model="form.stratumURL"
              :label="t('settingsPage.stratumURL')" :dark="axeStore.darkmode ? true : false" />
            <q-input class="q-mb-md" filled color="deep-purple" stack-label v-model="form.stratumPort"
              :label="t('settingsPage.stratumPort')" :dark="axeStore.darkmode ? true : false" />
            <q-input class="q-mb-md" filled color="deep-purple" stack-label v-model="form.stratumUser"
              :label="t('settingsPage.stratumUser')" :dark="axeStore.darkmode ? true : false" />
            <q-input class="q-mb-md" v-model="form.stratumPass" filled color="deep-purple" stack-label
              :type="isPwd ? 'password' : 'text'" :label="t('settingsPage.stratumPassword')"
              :dark="axeStore.darkmode ? true : false">

              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-lg-4 col-md-4 col-sm-12 col-xs-12"
            :class="quasar.screen.gt.md ? 'column-width-settings-big' : 'column-mobile-tablet'">
            <div class="card-title">Fallback Pool</div>
            <span class="card-text">{{ t("settingsPage.fallbackPoolText") }}</span>
            <q-input class="q-my-md" filled color="deep-purple" stack-label v-model="form.fallbackStratumURL"
              :label="t('settingsPage.fallbackStratumURL')" :dark="axeStore.darkmode ? true : false" />
            <q-input class="q-mb-md" filled color="deep-purple" stack-label v-model="form.fallbackStratumPort"
              :label="t('settingsPage.fallbackStratumPort')" :dark="axeStore.darkmode ? true : false" />
            <q-input class="q-mb-md" filled color="deep-purple" stack-label v-model="form.fallbackStratumUser"
              :label="t('settingsPage.fallbackStratumUser')" :dark="axeStore.darkmode ? true : false" />
            <q-input class="q-mb-md" v-model="form.fallbackStratumPassword" filled color="deep-purple" stack-label
              :type="isPwd ? 'password' : 'text'" :label="t('settingsPage.fallbackStratumPassword')"
              :dark="axeStore.darkmode ? true : false">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-lg-4 col-md-4 col-sm-12 col-xs-12" style="width: 300px">
            <div class="card-title">{{ t("settingsPage.miningPower") }}</div>
            <q-item>
              <span class="card-text">{{ t("settingsPage.miningPowerDesc") }}</span>
            </q-item>
            <div class="q-pa-md">
              <q-slider v-model="model" :min="0" :max="optionsFrequencies.length - 1" step="1" track-size="6px"
                color="deep-purple-11" markers :dark="axeStore.darkmode ? true : false" class="gradient-slider" />
              <div>
                <div class="row ">
                  <q-icon name="speed" color="darkgrey" size="sm" class="q-mr-xs q-mt-xs" />
                  <span class="small-container rounded-borders text-left q-mr-sm" style="width: 100px;">{{
                    t('settingsPage.frequency') }}</span>
                  <span class="small-container rounded-borders text-left" style="width: 100px;">
                    {{ optionsFrequencies[model]?.label }}
                  </span>
                </div>
                <div class="row q-mt-sm">
                  <q-icon name="bolt" color="darkgrey" size="sm" class="q-mr-xs q-mt-xs" />
                  <span class="small-container rounded-borders text-left q-mr-sm" style="width: 100px;">{{
                    t('settingsPage.coreVoltage') }}</span>
                  <span class="small-container rounded-borders text-left" style="width: 100px;">
                    {{ optionsFrequencies[model]?.voltage }}
                  </span>
                </div>
              </div>
            </div>

            <div class="card-title q-mt-lg">{{ t("settingsPage.tempTarget") }}</div>
            <q-item>
              <span class="card-text">{{ t("settingsPage.tempTargetDesc") }}
                <q-icon name="info" size="xs" color="grey-7" class="q-mr-sm cursor-pointer" style="color: #629C44">
                  <q-tooltip anchor="top middle" self="center middle">
                    {{ t("settingsPage.tempTargetInfo") }}
                  </q-tooltip>
                </q-icon>
              </span>
            </q-item>

            <div class="q-pa-md">

              <q-slider v-model="temperatureValue" :min="50" :max="70" :step="5" track-size="6px" color="deep-purple-11"
                class="gradient-slider" markers :marker-labels="markerLabels" label
                :label-value="`${temperatureValue}°C`" />
            </div>
          </div>
        </div>

        <div class="row justify-center">
          <q-btn class="q-px-xl btn-background btn-titles" no-caps type="submit"
            :style="quasar.screen.gt.sm ? '' : 'margin-top: 30%;'">{{
              t("settingsPage.update") }}</q-btn>
        </div>

      </q-form>
    </div>

    <div class="row q-mt-lg" :class="quasar.screen.gt.xs ? 'justify-start' : 'justify-center q-mt-xs'">
      <!-- Update firmware -->
      <div class="q-py-lg q-px-lg" :class="quasar.screen.gt.xs ? 'power-card' : 'power-card-mobile'">
        <div class="card-title">{{ t("settingsPage.updateFirmware") }}</div>
        <q-file class="q-mt-xl" color="deep-purple" filled v-model="binaryfileFirmware" :dark="axeStore.darkmode"
          counter @update:model-value="handleFileChangeFirmware"
          :rules="[val => !val || val.name === 'esp-miner.bin' || t('settingsPage.espFileError')]">
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
          <template v-slot:hint>esp-miner.bin</template>
        </q-file>
      </div>
      <!-- Update website -->
      <div class="q-ml-lg q-py-lg q-px-lg" :class="quasar.screen.gt.xs ? 'power-card' : 'power-card-mobile'">
        <div class="card-title">{{ t("settingsPage.updateWebsite") }}</div>
        <q-file class="q-mt-xl" color="deep-purple" filled v-model="binaryfileWebsite" :dark="axeStore.darkmode" counter
          @update:model-value="handleFileChangeWebsite"
          :rules="[val => !val || val.name === 'www.bin' || t('settingsPage.wwwFileError')]">
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
          <template v-slot:hint>www.bin </template>
        </q-file>
      </div>
    </div>

    <q-dialog v-model="confirm" persistent backdrop-filter="blur(2px) saturate(150%)">
      <q-card class="dialogBg text-white text-weight-bold ">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" class="btn-background" text-color="white" style="border-radius:25px" />
          <span class="q-ml-sm"><b>{{ t("settingsPage.restartText") }}</b></span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn label="OK" class="btn-background" @click="submitForm" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, onBeforeMount, computed, watch } from 'vue'
import axios from 'axios'
import { useAxeStore } from '@/stores/axe'
import { useQuasar } from 'quasar'
import { Notify, Loading } from "quasar";
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { defaultFrequencies, defaultVoltages } from '@/constants/asicModel'
export default defineComponent({
  name: 'SettingsPage',
  setup() {
    const quasar = useQuasar()
    const axeStore = useAxeStore()
    const { t } = useI18n();
    const { locale } = useI18n();
    const route = useRoute();
    const confirm = ref(false);
    const asicSettings = ref(null);
    const ASICModel = ref(axeStore.infoData.ASICModel);
    const frequencyOptions = ref([]);
    const voltageOptions = ref([]);
    const temperatureValue = ref(axeStore.infoData?.temptarget); // Valor inicial del slider de temperatura
    const markerLabels = {
      50: '50°C',
      55: '55°C',
      60: '60°C',
      65: '65°C',
      70: '70°C'
    }

    const model = ref(0)
    const form = ref({
      autofanspeed: true,
      coreVoltage: axeStore.infoData?.coreVoltage,
      fanspeed: axeStore.infoData?.fanspeed ?? 0,
      flipscreen: true,
      frequency: axeStore.infoData?.frequency ?? 0,
      invertfanpolarity: true,
      invertscreen: false,
      overheat_mode: axeStore.infoData?.overheat_mode ?? '',
      stratumPort: parseInt(axeStore.infoData?.stratumPort) ?? 0,
      stratumURL: axeStore.infoData?.stratumURL ?? '',
      stratumUser: axeStore.infoData?.stratumUser ?? '',
      stratumPass: '',
      fallbackStratumPort: parseInt(axeStore.infoData?.fallbackStratumPort) ?? 0,
      fallbackStratumURL: axeStore.infoData?.fallbackStratumURL ?? '',
      fallbackStratumUser: axeStore.infoData?.fallbackStratumUser ?? '',
      fallbackStratumPassword: ''
    })
    const isPwd = ref(true)
    const binaryfileFirmware = ref(null)
    const binaryfileWebsite = ref(null)

    let initialized = false;

    watch(() => model.value, (val) => {
      if (!initialized) {
        initialized = true;
        return;
      }
      const selectedIndex = optionsFrequencies.value[val];
      if (selectedIndex) {
        form.value.frequency = optionsFrequencies.value[val].value;
        form.value.coreVoltage = optionsFrequencies.value[val].voltage;
      }
    });


    onBeforeMount(() => {
      const lang = route.query.lang || 'es';
      locale.value = lang;
    });

    onMounted(async () => {
      try {
        // Cargar datos primero
        asicSettings.value = await axeStore.getAsicSettings();
        ASICModel.value = axeStore.infoData.ASICModel;
        frequencyOptions.value = asicSettings.value.frequencyOptions;
        voltageOptions.value = asicSettings.value.voltageOptions;

        // Ahora buscar el índice
        const index = optionsFrequencies.value.findIndex(
          option => option.value === (axeStore.infoData?.frequency ?? defaultFrequencies[ASICModel.value])
        );

        // Establecer el modelo después de asegurar que las opciones están cargadas
        model.value = index !== -1 ? index : 0;

        // Actualizar el formulario
        form.value.frequency = axeStore.infoData?.frequency ?? defaultFrequencies[ASICModel.value];
        form.value.coreVoltage = axeStore.infoData?.coreVoltage ?? defaultVoltages[ASICModel.value];

      } catch (error) {
        console.error('Error loading settings:', error);
        // Manejar el error apropiadamente
      }
    });
    // const optionsFrequencies = ref([ { label: '400', value: 400, voltage: 1100 }, { label: '425', value: 425, voltage: 1100 }, { label: '450', value: 450, voltage: 1150 }, { label: '475', value: 475, voltage: 1150 }, { label: '485 (default)', value: 485, voltage: 1200 }, { label: '500', value: 500, voltage: 1250 }, { label: '525', value: 525, voltage: 1250 }, { label: '550', value: 550, voltage: 1300 }, { label: '575', value: 575, voltage: 1300 } ]);
    const optionsFrequencies = computed(() => {
      if (!frequencyOptions?.value?.length) return [];
      const options = [];
      const voltageStep = voltageOptions.value.length / frequencyOptions?.value?.length;
      for (let i = 0; i < frequencyOptions?.value?.length; i++) {
        const freq = frequencyOptions?.value[i];
        const isDefault = defaultFrequencies[ASICModel.value] === freq;

        let voltageIndex;
        if (i > 0 && i % 2 !== 0 && frequencyOptions?.value[i] > defaultFrequencies[ASICModel.value]) {
          voltageIndex = Math.ceil(i * voltageStep);
        } else {
          voltageIndex = Math.floor(i * voltageStep);
        }
        if (voltageIndex >= voltageOptions.value.length) {
          voltageIndex = voltageOptions.value.length - 1;
        }

        const voltage = voltageOptions.value[voltageIndex];
        const label = freq === isDefault ? `${freq} (default)` : `${freq}`;

        options.push({
          label: label,
          value: freq,
          voltage: voltage
        });
      }
      return options;
    })

    const uploadBinaryFile = () => {
      if (!binaryfileWebsite.value || binaryfileWebsite.value.name !== 'www.bin') {
        console.error('Invalid file selected');
        return;
      }
      Loading.show({
        message: t("settingsPage.uploadingFile"),
      });
      const file = binaryfileWebsite.value
      return axios
        .post(`/api/system/OTAWWW `, file, {
          headers: { 'Content-Type': 'application/octet-stream' }
        })
        .then((res) => {
          console.log('upload successful')
          Notify.create({
            message: t("settingsPage.uploadSuccessful"),
            position: "top",
            timeout: 4000,
            type: 'positive',
          });
          return res.data
        })
        .then(() => {
          return axeStore.restartSystem(t)
        })
        .catch((error) => {
          console.error('There was an error updating the product:', error)
        })
        .finally(() => {
          Loading.hide();
        })
    }

    const uploadFirmwareFile = () => {
      if (!binaryfileFirmware.value || binaryfileFirmware.value.name !== 'esp-miner.bin') {
        console.error('Invalid file selected');
        return;
      }
      Loading.show({
        message: "Subiendo el archivo",
      });
      const file = binaryfileFirmware.value
      return axios
        .post(`/api/system/OTA `, file, {
          headers: { 'Content-Type': 'application/octet-stream' }
        })
        .then((res) => {
          console.log('upload successful')
          Notify.create({
            message: t("settingsPage.uploadSuccessful"),
            position: "top",
            timeout: 4000,
            type: 'positive',
          });
          return res.data
        })
        .catch((error) => {
          console.error('There was an error updating the product:', error)
        })
        .finally(() => {
          Loading.hide();
        })
    }


    const handleFileChangeWebsite = (file) => {
      binaryfileWebsite.value = file;
      // Solo proceder con la carga si el archivo es válido
      if (file && file.name === 'www.bin') {
        uploadBinaryFile();
      }
    }
    
    const handleFileChangeFirmware = (file) => {
      binaryfileFirmware.value = file;
      // Solo proceder con la carga si el archivo es válido
      if (file && file.name === 'esp-miner.bin') {
        uploadFirmwareFile();
      }
    }

    const submitForm = async (e) => {
      //console.log(temperatureValue.value);
      e.preventDefault();
      return axios
        .patch(
          `/api/system`,
          {
            coreVoltage: form.value.coreVoltage,
            fanspeed: form.value.fanspeed,
            flipscreen: form.value.flipscreen,
            frequency: form.value.frequency,
            invertfanpolarity: form.value.invertfanpolarity,
            invertscreen: form.value.invertscreen,
            overheat_mode: form.value.overheat_mode,
            stratumPort: parseInt(form.value.stratumPort),
            stratumURL: form.value.stratumURL,
            stratumUser: form.value.stratumUser,
            stratumPass: form.value.stratumPass,
            fallbackStratumPort: parseInt(form.value.fallbackStratumPort),
            fallbackStratumURL: form.value.fallbackStratumURL,
            fallbackStratumPassword: form.value.fallbackStratumPassword,
            fallbackStratumUser: form.value.fallbackStratumUser,
            autofanspeed: form.value.autofanspeed,
            tempTarget: temperatureValue.value,
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )
        .then((res) => res.data)
        .then(() => {
          axeStore.restartSystem(t);
        })
        .catch((error) => {
          console.error('There was an error updating the product:', error)
        })
    }
    return {
      form,
      confirm,
      submitForm,
      binaryfileWebsite,
      binaryfileFirmware,
      handleFileChangeWebsite,
      handleFileChangeFirmware,
      isPwd,
      quasar,
      t,
      axeStore,
      // optionsVoltages,
      optionsFrequencies,
      //markerLabels,
      model,
      temperatureValue,
      markerLabels
    }
  }
})
</script>
<style>
.gradient-slider .q-slider__track-container .q-slider__track {
  background: linear-gradient(to right, green, red);
  height: 10px;
  border-radius: 5px;
}
</style>