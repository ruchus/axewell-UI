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
                                    <q-item-label class="card-text">{{ axeStore?.infoData?.ASICModel || '-'
                                    }}</q-item-label>
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

        return {
            quasar,
            axeStore,
            t,
            version,
            freeHeapDisplay
        }
    }
})
</script>
