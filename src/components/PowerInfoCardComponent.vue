<template>
    <q-card class="power-card q-pa-md q-mt-md q-mx-md" flat v-if="quasar.screen.gt.sm">
        <q-card-section>
            <div class="card-title q-ml-lg"> {{ t("dashboardPage.power.title") }}</div>
            <q-card-section horizontal>
                <div class="col-lg-4 col-md-4">
                    <div class="row justify-evenly q-mt-md">
                        <div class="col-6">
                            <div class="small-container data-label rounded-borders text-left">
                                {{ t("dashboardPage.power.powerConsumption") }}
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="small-container data-fields rounded-borders text-right">
                                {{ powerConsumption }} W
                            </div>
                        </div>
                    </div>
                    <div class="row justify-evenly q-mt-md">
                        <div class="col-6">
                            <div class="small-container data-label rounded-borders text-left">
                                {{ t("dashboardPage.power.inputVoltage") }}
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="small-container data-fields rounded-borders text-right">
                                {{ powerData?.voltage }} V
                            </div>
                        </div>
                    </div>
                    <div class="row justify-evenly q-mt-md">
                        <div class="col-6">
                            <div class="small-container data-label rounded-borders text-left">
                                {{ t("dashboardPage.power.inputCurrent") }}
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="small-container data-fields rounded-borders text-right">
                                {{ powerData?.current }} V
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4">
                    <div class="row justify-evenly q-mt-md">
                        <div class="col-6">
                            <div class="small-container data-label rounded-borders text-left">
                                {{ t("dashboardPage.power.frequency") }}
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="small-container data-fields rounded-borders text-right">
                                {{ powerData?.frequency }} Mhz
                            </div>
                        </div>
                    </div>
                    <div class="row justify-evenly q-mt-md">
                        <div class="col-6">
                            <div class="small-container data-label rounded-borders text-left">
                                {{ t("dashboardPage.power.voltageRequested") }}
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="small-container data-fields rounded-borders text-right">
                                {{ powerData?.coreVoltage }} V
                            </div>
                        </div>
                    </div>
                    <div class="row justify-evenly q-mt-md">
                        <div class="col-6">
                            <div class="small-container data-label rounded-borders text-left">
                                {{ t("dashboardPage.power.voltageMeasured") }}
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="small-container data-fields rounded-borders text-right">
                                {{ powerData?.coreVoltageActual }} V
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-4">
                    <div class="row justify-evenly q-mt-md">
                        <div class="col-6">
                            <div class="small-container data-label rounded-borders text-left">
                                {{ t("dashboardPage.power.fanSpeed") }}
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="small-container data-fields rounded-borders text-right">
                                {{ powerData?.fanspeed }} RPM
                            </div>
                        </div>
                    </div>
                    <div class="row justify-evenly q-mt-md">
                        <div class="col-6">
                            <div class="small-container data-label rounded-borders text-left">
                                {{ t("dashboardPage.power.chipTemperature") }}
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="small-container data-fields rounded-borders text-right">
                                {{ powerData?.temp }} ºC
                            </div>
                        </div>
                    </div>
                </div>
            </q-card-section>
        </q-card-section>
    </q-card>
    <q-card flat class="power-card-mobile q-mt-md" v-if="!quasar.screen.gt.sm">
        <q-card-section class="q-px-xs">
            <div class="card-title q-ml-lg"> {{ t("dashboardPage.power.title") }}</div>

            <div class="col-sm-6 col-xs-6">
                <div class="row justify-evenly q-mt-md">
                    <div class="col-6">
                        <div class="small-container data-label rounded-borders text-left">
                            {{ t("dashboardPage.power.powerConsumption") }}
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="small-container data-fields rounded-borders text-right">
                            {{ powerConsumption }} W
                        </div>
                    </div>
                </div>
                <div class="row justify-evenly q-mt-md">
                    <div class="col-6">
                        <div class="small-container data-label rounded-borders text-left">
                            {{ t("dashboardPage.power.inputVoltage") }}
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="small-container data-fields rounded-borders text-right">
                            {{ powerData?.voltage }} V
                        </div>
                    </div>
                </div>
                <div class="row justify-evenly q-mt-md">
                    <div class="col-6">
                        <div class="small-container data-label rounded-borders text-left">
                            {{ t("dashboardPage.power.inputCurrent") }}
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="small-container data-fields rounded-borders text-right">
                            {{ powerData?.current }} V
                        </div>
                    </div>
                </div>
                <div class="row justify-evenly q-mt-md">
                    <div class="col-6">
                        <div class="small-container data-label rounded-borders text-left">
                            {{ t("dashboardPage.power.frequency") }}
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="small-container data-fields rounded-borders text-right">
                            {{ powerData?.frequency }} Mhz
                        </div>
                    </div>
                </div>

            </div>
            <div class="col-sm-6 col-xs-6">
                <div class="row justify-evenly q-mt-md">
                    <div class="col-6">
                        <div class="small-container data-label rounded-borders text-left">
                            {{ t("dashboardPage.power.voltageRequested") }}
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="small-container data-fields rounded-borders text-right">
                            {{ powerData?.coreVoltage }} V
                        </div>
                    </div>
                </div>
                <div class="row justify-evenly q-mt-md">
                    <div class="col-6">
                        <div class="small-container data-label rounded-borders text-left">
                            {{ t("dashboardPage.power.voltageMeasured") }}
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="small-container data-fields rounded-borders text-right">
                            {{ powerData?.coreVoltageActual }} V
                        </div>
                    </div>
                </div>
                <div class="row justify-evenly q-mt-md">
                    <div class="col-6">
                        <div class="small-container data-label rounded-borders text-left">
                            {{ t("dashboardPage.power.fanSpeed") }}
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="small-container data-fields rounded-borders text-right">
                            {{ powerData?.fanspeed }} RPM
                        </div>
                    </div>
                </div>
                <div class="row justify-evenly q-mt-md">
                    <div class="col-6">
                        <div class="small-container data-label rounded-borders text-left">
                            {{ t("dashboardPage.power.chipTemperature") }}
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="small-container data-fields rounded-borders text-right">
                            {{ powerData?.temp }} ºC
                        </div>
                    </div>
                </div>

            </div>
        </q-card-section>

    </q-card>
</template>

<script>
import { defineComponent, onMounted, computed, toRefs } from 'vue'
import { useRouter } from "vue-router";
import { useQuasar } from "quasar"
import { useI18n } from 'vue-i18n';
export default defineComponent({
    name: 'PowerInfoCardComponent',
    props: {
        powerData: Object
    },
    setup(props) {
        const quasar = useQuasar();
        const { powerData } = toRefs(props);
        const powerConsumption = computed(() => Math.round(powerData?.value?.power))
        const { t } = useI18n();
        return {
            quasar,
            powerConsumption,
            t
        }
    }
})
</script>