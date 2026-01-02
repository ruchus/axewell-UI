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
                                {{ inputVoltage }} V / {{ inputCurrent }} A
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
                                {{ t("dashboardPage.power.voltageMeasured") }}
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="small-container data-fields rounded-borders text-right">
                                {{ ASICvoltage }} V
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
                                ({{ Math.round(powerData?.fanspeed) }}%) {{ Math.round(powerData?.fanrpm) }} RPM
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
                                <div v-if="chipTemperatures.length > 1" class="column text-right">
                                    <div v-for="(temp, index) in chipTemperatures" :key="index" :class="{ 'q-mb-xs': index < chipTemperatures.length - 1 }">
                                        <span class="text-caption text-grey-6">{{ temp.label }}</span>
                                        <span class="q-ml-xs">{{ Math.round(temp.value) }} ºC</span>
                                    </div>
                                </div>
                                <template v-else>
                                    <span v-if="chipTemperatures.length === 1">{{ Math.round(chipTemperatures[0].value) }} ºC</span>
                                    <span v-else>-</span>
                                </template>
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
                            {{ inputVoltage }}V / {{ inputCurrent }}A
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
                            {{ t("dashboardPage.power.voltageMeasured") }}
                        </div>
                    </div>
                    <div class="col-4">
                        <div class="small-container data-fields rounded-borders text-right">
                            {{ ASICvoltage }} V
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
                            ({{ Math.round(powerData?.fanspeed) }}%) {{ Math.round(powerData?.fanrpm) }} RPM
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
                            <div v-if="chipTemperatures.length > 1" class="column text-right">
                                <div v-for="(temp, index) in chipTemperatures" :key="index" :class="{ 'q-mb-xs': index < chipTemperatures.length - 1 }">
                                    <span class="text-caption text-grey-6">{{ temp.label }}</span>
                                    <span class="q-ml-xs">{{ Math.round(temp.value) }} ºC</span>
                                </div>
                            </div>
                            <template v-else>
                                <span v-if="chipTemperatures.length === 1">{{ Math.round(chipTemperatures[0].value) }} ºC</span>
                                <span v-else>-</span>
                            </template>
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
        const ASICvoltage = computed(() => (powerData?.value?.coreVoltageActual / 1000).toFixed(2))
        const inputVoltage = computed(() => (powerData?.value?.voltage / 1000).toFixed(2))
        const inputCurrent = computed(() => (powerData?.value?.current / 1000).toFixed(2))
        const hasValidTemp = (value) => value !== undefined && value !== null && value !== '' && value !== -1
        const chipTemperatures = computed(() => {
            const temps = [];
            const fields = ['temp', 'temp2', 'temp3', 'temp4', 'temp5', 'temp6'];
            fields.forEach((field, index) => {
                const val = powerData?.value?.[field];
                if (hasValidTemp(val)) {
                    temps.push({
                        label: `ASIC ${index + 1}`,
                        value: val
                    });
                }
            });
            return temps;
        });

        const { t } = useI18n();
        return {
            quasar,
            powerConsumption,
            ASICvoltage,
            inputVoltage,
            inputCurrent,
            hasValidTemp,
            chipTemperatures,
            t
        }
    }
})
</script>