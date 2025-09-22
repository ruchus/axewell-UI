<template>
    <div class="page-wrapper q-pa-md">
        <div :class="quasar.screen.gt.xs ? 'dashboard-info' : 'dashboard-info-mobile'" class="q-mb-lg">
            <div class="card-title" style="font-size: 34px">{{ t("poolPage.title") }}</div>
            <span class="card-text">{{ t("poolPage.subtitle") }}</span>
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
                        <q-input class="q-my-md" filled color="deep-purple" stack-label
                            v-model="form.fallbackStratumURL" :label="t('settingsPage.fallbackStratumURL')"
                            :dark="axeStore.darkmode ? true : false" />
                        <q-input class="q-mb-md" filled color="deep-purple" stack-label
                            v-model="form.fallbackStratumPort" :label="t('settingsPage.fallbackStratumPort')"
                            :dark="axeStore.darkmode ? true : false" />
                        <q-input class="q-mb-md" filled color="deep-purple" stack-label
                            v-model="form.fallbackStratumUser" :label="t('settingsPage.fallbackStratumUser')"
                            :dark="axeStore.darkmode ? true : false" />
                        <q-input class="q-mb-md" v-model="form.fallbackStratumPassword" filled color="deep-purple"
                            stack-label :type="isPwd ? 'password' : 'text'"
                            :label="t('settingsPage.fallbackStratumPassword')" :dark="axeStore.darkmode ? true : false">
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                    @click="isPwd = !isPwd" />
                            </template>
                        </q-input>
                    </div>
                    <div class="col-12 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                        <div class="card-title">{{ t("poolPage.advanced") }}</div>
                        <span class="card-text">{{ t("poolPage.advancedDesc") }}</span>
                        <q-input class="q-my-md" filled color="deep-purple" stack-label type="number" step="1"
                            @keydown="(e) => !/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Tab' && e.preventDefault()"
                            v-model.number="form.stratumSuggestedDifficulty"
                            :label="t('poolPage.stratumSuggestedDifficulty')"
                            :dark="axeStore.darkmode ? true : false" />

                        <q-toggle :model-value="form.extraNounce === 1"
                            @update:model-value="form.extraNounce = $event ? 1 : 0" :label="t('poolPage.extraNounce')"
                            color="deep-purple" />
                        <q-icon name="info" size="xs" color="grey-7" class="q-mr-sm cursor-pointer"
                            style="color: #629C44">
                            <q-tooltip anchor="bottom middle" self="center middle">
                                {{ t("poolPage.extraNounceInfo") }}
                            </q-tooltip>
                        </q-icon>
                    </div>
                </div>

                <div class="row justify-center">
                    <q-btn class="q-px-xl btn-background btn-titles" no-caps type="submit"
                        :style="quasar.screen.gt.sm ? '' : 'margin-top: 30%;'">{{
                            t("settingsPage.update") }}</q-btn>
                </div>

            </q-form>
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
import { defineComponent, ref, onBeforeMount, computed } from 'vue'
import axios from 'axios'
import { useAxeStore } from '@/stores/axe'
import { useQuasar } from 'quasar'
import { Notify } from "quasar";
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
export default defineComponent({
    name: 'PoolPage',
    setup() {
        const quasar = useQuasar()
        const axeStore = useAxeStore()
        const { t } = useI18n();
        const { locale } = useI18n();
        const route = useRoute();
        const confirm = ref(false);

        onBeforeMount(() => {
            const lang = route.query.lang || 'es';
            locale.value = lang;
        });

        const form = ref({
            stratumPort: parseInt(axeStore.infoData?.stratumPort) ?? 0,
            stratumURL: axeStore.infoData?.stratumURL ?? '',
            stratumUser: axeStore.infoData?.stratumUser ?? '',
            stratumPass: '',
            fallbackStratumPort: parseInt(axeStore.infoData?.fallbackStratumPort) ?? 0,
            fallbackStratumURL: axeStore.infoData?.fallbackStratumURL ?? '',
            fallbackStratumUser: axeStore.infoData?.fallbackStratumUser ?? '',
            fallbackStratumPassword: '',
            stratumSuggestedDifficulty: parseInt(axeStore.infoData?.stratumSuggestedDifficulty) ?? 1000,
            extraNounce: axeStore.infoData?.stratumExtranonceSubscribe ?? 0,
        })

        const submitForm = async (e) => {
            //console.log(temperatureValue.value);
            e.preventDefault();
            return axios
                .patch(
                    `/api/system`,
                    {
                        stratumPort: parseInt(form.value.stratumPort),
                        stratumURL: form.value.stratumURL,
                        stratumUser: form.value.stratumUser,
                        stratumPass: form.value.stratumPass,
                        stratumExtranonceSubscribe: form.value.extraNounce,
                        stratumSuggestedDifficulty: parseInt(form.value.stratumSuggestedDifficulty),
                        fallbackStratumPort: parseInt(form.value.fallbackStratumPort),
                        fallbackStratumURL: form.value.fallbackStratumURL,
                        fallbackStratumPassword: form.value.fallbackStratumPassword,
                        fallbackStratumUser: form.value.fallbackStratumUser,
                        fallbackStratumSuggestedDifficulty: parseInt(form.value.stratumSuggestedDifficulty),
                        fallbackStratumExtranonceSubscribe: form.value.extraNounce,
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
                    console.error('There was an error:', error)
                })
        }
        return {
            form,
            confirm,
            submitForm,
            quasar,
            t,
            axeStore
        }
    }
})
</script>
