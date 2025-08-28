<template>
  <div class="page-wrapper q-pa-md">
    <div :class="quasar.screen.gt.xs ? 'dashboard-info' : 'dashboard-info-mobile'" class="q-mb-lg">
      <div class="card-title" style="font-size: 34px">{{ t("networkPage.title") }}</div>
      <span class="card-text">{{ t("networkPage.subtitle") }}</span>
    </div>
    <div class="q-py-xl q-px-lg" :class="quasar.screen.gt.xs ? 'power-card' : 'power-card-mobile'">
      <q-form @submit="confirm = !confirm">
        <div class="row" :class="quasar.screen.gt.xs ? 'justify-between' : 'justify-center'">
          <div class="col-12 col-lg-6 col-md-6 col-sm-6 col-xs-12" style="width: 450px">
            <div class="card-title q-mb-md">{{ t("networkPage.network") }}</div>
            <q-input class="q-mb-md" filled color="deep-purple" stack-label v-model="form.ssid" label="WiFi SSID"
              :dark="axeStore.darkmode ? true : false" />
            <q-input class="q-mb-md" v-model="form.password" filled color="deep-purple" stack-label ref="wifiPassRef"
              lazy-rules :rules="wifiPassRules" :type="isPwd ? 'password' : 'text'" :label="t('networkPage.password')"
              :dark="axeStore.darkmode ? true : false">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-lg-6 col-md-6 col-sm-6 col-xs-12" style="width: 450px">
            <div class="card-title q-mb-md">{{ t("networkPage.asicTitle") }}</div>
            <q-input class="q-mb-md" filled color="deep-purple" stack-label v-model="form.hostname"
              :label="t('networkPage.hostname')" :dark="axeStore.darkmode ? true : false" />
          </div>
        </div>
        <div class="row justify-center">
          <q-btn class="q-px-xl btn-titles btn-background" no-caps type="submit"
            :style="quasar.screen.gt.sm ? '' : 'margin-top: 30%;'">{{
              t("networkPage.update") }}</q-btn>
        </div>

      </q-form>
    </div>
    <q-dialog v-model="confirm" persistent backdrop-filter="blur(2px) saturate(150%)">
      <q-card class="dialogBg text-white text-weight-bold ">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" class="btn-background" text-color="white" style="border-radius:25px" />
          <span class="q-ml-sm"><b>{{ t('networkPage.restartText') }}</b></span>
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
import { defineComponent, onMounted, ref, onBeforeMount } from 'vue'
import axios from 'axios'
import { useAxeStore } from '@/stores/axe'
import { useQuasar } from 'quasar'
import { Notify, Loading } from "quasar";
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
export default defineComponent({
  name: 'NetworkPage',
  setup() {
    const quasar = useQuasar()
    const axeStore = useAxeStore()
    const { t } = useI18n();
    const { locale } = useI18n();
    const route = useRoute();
    const confirm = ref(false);
    const form = ref({
      hostname: axeStore.infoData?.hostname ?? '',
      ssid: axeStore.infoData?.ssid ?? '',
      password: '',
    })
    const isPwd = ref(true)
    const binaryfileFirmware = ref(null)
    const binaryfileWebsite = ref(null)
    const isCombinationPressed = ref(false)

    onBeforeMount(() => {
      const lang = route.query.lang || 'es';
      locale.value = lang;
    });

    const submitForm = async (e) => {
      e.preventDefault();
      return axios
        .patch(
          `/api/system`,
          {
            hostname: form.value.hostname,
            ssid: form.value.ssid,
            wifiPass: form.value.password,
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        )
        .then((res) => {
          Notify.create({
            message: t('networkPage.restartText'),
            position: "top",
            timeout: 4000,
            type: 'positive',
          });
          return res.data
        })
        .then((res) => {
          axeStore.restartSystem();
        })
        .catch((error) => {
          console.error('There was an error updating the product:', error)
        })
    }

    return {
      form,
      confirm,
      submitForm,
      axeStore,
      isPwd,
      quasar,
      t,
      wifiPassRules: [
        val => (val && val.length > 0) || 'Field is required*'
      ]
    }
  }
})
</script>
