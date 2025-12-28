<template>
    <div class="page-wrapper q-pa-md">
        <div :class="quasar.screen.gt.xs ? 'dashboard-info' : 'dashboard-info-mobile'" class="q-mb-lg">
            <div class="card-title" style="font-size: 34px">{{ t("systemPage.title") }}</div>
            <span class="card-text">{{ t("systemPage.subtitle") }}</span>
        </div>
        <div class="q-px-lg" :class="quasar.screen.gt.xs ? 'q-py-xl power-card' : 'q-py-md power-card-mobile'">
            <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                    <q-card flat class="card q-pa-md">
                        <div class="card-title q-mb-md">{{ t("systemPage.deviceInfo") }}</div>
                        <q-list>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="text-grey-6">{{ t("systemPage.asicModel") }}</q-item-label>
                                    <q-item-label class="card-text">
                                        {{ validChipCount > 0 ? `${validChipCount} x ` : '' }}{{ axeStore?.infoData?.ASICModel || '-' }}
                                    </q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="text-grey-6">{{ t("systemPage.macAddress") }}</q-item-label>
                                    <q-item-label class="card-text">{{ axeStore?.infoData?.macAddr || '-'
                                    }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="text-grey-6">{{ t("systemPage.boardVersion") }}</q-item-label>
                                    <q-item-label class="card-text">{{ axeStore?.infoData?.boardVersion || '-'
                                    }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="text-grey-6">{{ t("systemPage.resetReason") }}</q-item-label>
                                    <q-item-label class="card-text">{{ axeStore?.infoData?.resetReason || '-'
                                    }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                        <div class="q-mt-md flex items-center q-gutter-sm">
                            <q-btn color="deep-purple" class="btn-background" no-caps @click="identifyDevice">
                                {{ t("systemPage.identifyButton") }}
                            </q-btn>
                            <span class="text-caption text-grey-6">{{ t("systemPage.identifyHelp") }}</span>
                        </div>
                    </q-card>
                </div>
                <div class="col-12 col-md-6">
                    <q-card flat class="card q-pa-md">
                        <div class="card-title q-mb-md">{{ t("systemPage.softwareInfo") }}</div>
                        <q-list>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="text-grey-6">{{ t("systemPage.firmwareVersion")
                                    }}</q-item-label>
                                    <q-item-label class="card-text">{{ axeStore?.infoData?.version || '-'
                                    }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="text-grey-6">{{ t("systemPage.axewellVersion")
                                    }}</q-item-label>
                                    <q-item-label class="card-text">v{{ version }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="text-grey-6">{{ t("systemPage.espIdfVersion") }}</q-item-label>
                                    <q-item-label class="card-text">{{ axeStore?.infoData?.idfVersion || '-'
                                    }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card>
                </div>
                <div class="col-12 col-md-6">
                    <q-card flat class="card q-pa-md">
                        <div class="card-title q-mb-md">{{ t("systemPage.memoryInfo") }}</div>
                        <q-list>
                            <q-item>
                                <q-item-section>
                                    <q-item-label class="text-grey-6">{{ t("systemPage.freeHeapMemory")
                                    }}</q-item-label>
                                    <q-item-label class="card-text">{{ freeHeapDisplay }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card>
                </div>
                <div class="col-12 col-md-6">
                    <q-card flat class="card q-pa-md">
                        <div class="card-title q-mb-md">{{ t("systemPage.logs") }}</div>
                        <div class="q-pa-sm">
                            <BtnLogsComponent></BtnLogsComponent>
                        </div>
                    </q-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, computed } from 'vue'
import { useAxeStore } from '@/stores/axe'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import BtnLogsComponent from '@/components/BtnLogsComponent.vue'
import axios from 'axios'

export default defineComponent({
    name: 'SystemPage',
    components: {
        BtnLogsComponent
    },
    setup() {
        const version = __APP_VERSION__
        const quasar = useQuasar()
        const axeStore = useAxeStore()
        const { t } = useI18n();
        const { locale } = useI18n();
        const route = useRoute();

        onBeforeMount(() => {
            const lang = route.query.lang || 'es';
            locale.value = lang;
        });

        const freeHeapDisplay = computed(() => {
            const bytes = axeStore?.infoData?.freeHeap
            if (bytes === null || bytes === undefined || bytes === '') {
                return '-'
            }
            const megabytes = Number(bytes) / (1024 * 1024)
            if (Number.isNaN(megabytes)) {
                return '-'
            }
            return `${megabytes.toFixed(2)} M`
        })

        const validChipCount = computed(() => {
            let count = 0;
            const fields = ['temp', 'temp2', 'temp3', 'temp4', 'temp5', 'temp6'];
            fields.forEach(field => {
                const val = axeStore?.infoData?.[field];
                if (val !== undefined && val !== null && val !== '' && val !== -1) {
                    count++;
                }
            });
            return count;
        });

        const identifyDevice = async () => {
            try {
                await axios.post('/api/system/identify', {})
                quasar.notify({
                    type: 'positive',
                    message: t('systemPage.identifySuccess')
                })
            } catch (error) {
                const status = error?.response?.status
                if (status === 0 || status === 200 || error?.message === 'Network Error') {
                    quasar.notify({
                        type: 'positive',
                        message: t('systemPage.identifySuccess')
                    })
                    return
                }
                quasar.notify({
                    type: 'negative',
                    message: t('systemPage.identifyError')
                })
            }
        }

        return {
            quasar,
            axeStore,
            t,
            version,
            freeHeapDisplay,
            validChipCount,
            identifyDevice
        }
    }
})
</script>
