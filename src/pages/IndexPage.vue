<template>
  <q-page class="page-wrapper q-px-md">
    <div :class="quasar.screen.gt.xs ? 'dashboard-info' : 'dashboard-info-mobile'">
      <div class="card-title" style="font-size: 34px">{{ t("dashboardPage.title") }}</div>
      <div class="card-text ">{{ t("dashboardPage.subtitle") }}</div>
    </div>

    <q-spinner v-if="axeStore.firstLoading === true" color="deep-purple-11" size="3em" :thickness="2" />
    <div v-else class="row q-mt-lg " style="max-width: 1500px; width: 100%;">
      <div class="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-xs-12"
        :class="quasar.screen.gt.xs ? 'q-mx-md q-mb-md' : ''">
        <HashRateCardComponent :hashRateData="axeStore?.infoData"></HashRateCardComponent>
      </div>


      <div class="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-xs-12"
        :class="quasar.screen.gt.xs ? 'q-mx-md q-mb-md' : ''">
        <q-card flat class="card" :class="quasar.screen.gt.xs ? 'q-mb-md q-px-md q-py-sm' : 'q-my-md q-px-md q-py-sm'">
          <template v-if="quasar.screen.gt.sm">
            <q-card-section v-if="axeStore?.infoData?.stratumURL" class="pool-info-container">
              <div class="row items-center q-gutter-md justify-between">

                <div class="col-auto">
                  <div class="card-title q-mr-lg">Main pool</div>
                </div>

                <div class="col">
                  <div class="card-text">
                    <q-icon v-if="axeStore?.infoData?.isUsingFallbackStratum === 0" name="cloud" size="sm"
                      class="q-mr-sm" style="color: #629C44">
                      <q-tooltip anchor="bottom middle" self="center middle">
                        {{ t("pool.activeTooltip") }}
                      </q-tooltip>
                    </q-icon>
                    <q-icon v-else name="o_cloud" size="sm" class="q-mr-sm">
                      <q-tooltip anchor="bottom middle" self="center middle">
                        {{ t("pool.inactiveTooltip") }}
                      </q-tooltip>
                    </q-icon>
                    {{ axeStore?.infoData?.stratumURL }}:{{ axeStore?.infoData?.stratumPort }}
                    <br />
                    <span style="word-wrap: break-word; white-space: normal;margin-left: 40px;">
                      <template v-if="mainStratumUser?.url">
                        <a :href="mainStratumUser.url" target="_blank" rel="noopener" class="text-grey-7">{{
                          mainStratumUser.display }}</a>
                      </template>
                      <template v-else>
                        {{ mainStratumUser.display }}
                      </template>
                    </span>
                  </div>
                </div>


              </div>
            </q-card-section>
            <q-card-section v-else class="pool-info-container items-center">
              <div class="card-title">Main pool</div>
              <div class="card-text q-ml-md">
                {{ t("pool.notConnected") }}
                <q-btn no-caps flat dense class="q-px-md q-ml-md btn-ajustes" :to="{ name: 'Network' }">
                  <q-icon left size="sm" name="cloud_off" class="cloud-off parpadea" />
                  <div> {{ t("pool.settings") }}</div>
                </q-btn>
              </div>
            </q-card-section>
            <q-card-section v-if="axeStore?.infoData?.fallbackStratumURL" class="pool-info-container items-center">
              <div class="row items-center q-gutter-md">

                <div class="col-auto">
                  <div class="card-title" style="font-size: 16px;">Fallback pool</div>
                </div>
                <div class="col">
                  <div class="card-text q-ml-md">
                    <q-icon v-if="axeStore?.infoData?.isUsingFallbackStratum === 1" name="cloud" size="sm"
                      class="q-mr-sm" style="color: #629C44">
                      <q-tooltip anchor="bottom middle" self="center middle">
                        {{ t("pool.activeTooltip") }}
                      </q-tooltip>
                    </q-icon>
                    <q-icon v-else name="o_cloud" size="sm" class="q-mr-sm">
                      <q-tooltip anchor="bottom middle" self="center middle">
                        {{ t("pool.inactiveTooltip") }}
                      </q-tooltip>
                    </q-icon>
                    {{ axeStore?.infoData?.fallbackStratumURL }}:{{ axeStore?.infoData?.fallbackStratumPort }} <br />
                    <span style="word-wrap: break-word; white-space: normal;margin-left: 40px;">
                      <template v-if="fallbackStratumUser?.url">
                        <a :href="fallbackStratumUser.url" target="_blank" rel="noopener" class="text-grey-7">{{
                          fallbackStratumUser.display
                          }}</a>
                      </template>
                      <template v-else>
                        {{ fallbackStratumUser.display }}
                      </template>
                    </span>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-card-section v-else class="pool-info-container items-center">
              <div class="card-title" style="font-size: 16px;">Fallback Pool</div>
              <div class="card-text q-ml-sm">
                {{ t("pool.notConnected") }}
                <q-btn no-caps flat dense class="q-px-md q-ml-md btn-ajustes" :to="{ name: 'Network' }">
                  <q-icon left size="sm" name="cloud_off" class="cloud-off parpadea" />
                  <div> {{ t("pool.settings") }}</div>
                </q-btn>
              </div>
            </q-card-section>
            <q-card-section v-if="axeStore?.infoData?.stratumURL || axeStore?.infoData?.fallbackStratumURL"
              class="pool-info-container items-center">
              <div class="row items-center q-gutter-md">
                <div class="col-auto">
                  <div class="card-title" style="font-size: 16px;">{{ t("pool.responseTime") }}</div>
                </div>
                <div class="col">
                  <div class="card-text q-ml-md">
                    <span class="card-text" :style="`color: ${responseTimeColor}; font-size: 18px;`">
                      {{ responseTimeRounded }}
                    </span>
                    <span class="card-text q-ml-xs" style="font-size: 12px;">ms </span>
                    <q-icon name="info" size="xs" color="grey-7" class="q-mr-sm cursor-pointer" style="color: #629C44">
                      <q-tooltip anchor="bottom middle" self="center middle">
                        {{ t("pool.responseTimeTooltip") }}
                      </q-tooltip>
                    </q-icon>
                  </div>
                </div>
              </div>
            </q-card-section>
          </template>
          <template v-else class="items-center">
            <div v-if="axeStore?.infoData?.stratumURL" class="pool-info-container items-center">
              <div class="card-title">Main pool</div>
              <q-item>
                <div class="card-text q-ml-md">
                  <q-icon v-if="axeStore?.infoData?.isUsingFallbackStratum === 0" name="cloud" size="sm" class="q-mr-sm"
                    style="color: #629C44">
                    <q-tooltip anchor="bottom middle" self="center middle">
                      {{ t("pool.activeTooltip") }}
                    </q-tooltip>
                  </q-icon>
                  <q-icon v-else name="o_cloud" size="sm" class="q-mr-sm">
                    <q-tooltip anchor="bottom middle" self="center middle">
                      {{ t("pool.inactiveTooltip") }}
                    </q-tooltip>
                  </q-icon>
                  {{ axeStore?.infoData?.stratumURL }}:{{ axeStore?.infoData?.stratumPort }} <br />
                  <template v-if="mainStratumUser?.url">
                    <a :href="mainStratumUser.url" target="_blank" rel="noopener" class="text-grey-7">{{
                      mainStratumUser.display }}</a>
                  </template>
                  <template v-else>
                    {{ mainStratumUser.display }}
                  </template>
                </div>
              </q-item>
            </div>
            <div v-if="axeStore?.infoData?.fallbackStratumURL" class="pool-info-container items-center q-mt-md">
              <div class="card-title" style="font-size: 16px;">Fallback pool</div>
              <q-item>
                <div class="card-text q-ml-md">
                  <q-icon v-if="axeStore?.infoData?.isUsingFallbackStratum === 1" name="cloud" size="sm" class="q-mr-sm"
                    style="color: #629C44">
                    <q-tooltip anchor="bottom middle" self="center middle">
                      {{ t("pool.activeTooltip") }}
                    </q-tooltip>
                  </q-icon>
                  <q-icon v-else name="o_cloud" size="sm" class="q-mr-sm">
                    <q-tooltip anchor="bottom middle" self="center middle">
                      {{ t("pool.inactiveTooltip") }}
                    </q-tooltip>
                  </q-icon>
                  {{ axeStore?.infoData?.fallbackStratumURL }}:{{ axeStore?.infoData?.fallbackStratumPort }} <br />
                  <template v-if="fallbackStratumUser?.url">
                    <a :href="fallbackStratumUser.url" target="_blank" rel="noopener" class="text-grey-7">{{
                      fallbackStratumUser.display
                      }}</a>
                  </template>
                  <template v-else>
                    {{ fallbackStratumUser.display }}
                  </template>
                </div>
              </q-item>
            </div>
            <div v-else>
              <div class="pool-info-container justify-between items-center q-pb-md">
                <div>
                  <div class="card-title">Main Pool</div>
                  <div class="card-text ">{{ t("pool.notConnected") }}</div>
                </div>

              </div>
              <q-btn no-caps dense flat class="q-px-md btn-ajustes" :to="{ name: 'Network' }">
                <q-icon left size="sm" name="cloud_off" class="cloud-off parpadea" />
                <div>{{ t("pool.settings") }}</div>
              </q-btn>
              <div class="pool-info-container justify-between items-center q-pb-md q-mt-md">
                <div>
                  <div class="card-title" style="font-size: 16px;">Fallback Pool</div>
                  <div class="card-text ">{{ t("pool.notConnected") }}</div>
                </div>


              </div>
              <q-btn no-caps dense flat class="q-px-md btn-ajustes" :to="{ name: 'Network' }">
                <q-icon left size="sm" name="cloud_off" class="cloud-off parpadea" />
                <div>{{ t("pool.settings") }}</div>
              </q-btn>
            </div>


            <div v-if="axeStore?.infoData?.stratumURL || axeStore?.infoData?.fallbackStratumURL" class="q-mt-md">
              <div class="card-title" style="font-size: 16px;">{{ t("pool.responseTime") }}</div>
              <q-item>
                <div class="card-text q-ml-md">
                  <q-icon name="speed" size="sm" class="q-mr-sm" :style="`color: ${responseTimeColor}`" />
                  <span class="card-text" :style="`color: ${responseTimeColor}; font-size: 18px; font-weight: bold;`">
                    {{ responseTimeRounded }}
                  </span>
                  <span class="card-text q-ml-xs" style="font-size: 12px;">ms </span>
                  <q-icon name="info" size="xs" color="grey-7" class="q-mr-sm cursor-pointer" style="color: #629C44">
                    <q-tooltip anchor="bottom middle" self="center middle">
                      {{ t("pool.responseTimeTooltip") }}
                    </q-tooltip>
                  </q-icon>
                </div>
              </q-item>
            </div>

          </template>
        </q-card>
        <SharesCardComponent :shareData="axeStore?.infoData"></SharesCardComponent>
      </div>
    </div>
    <PowerInfoCardComponent :powerData="axeStore?.infoData"></PowerInfoCardComponent>
  </q-page>
</template>

<script>
import { defineComponent, computed, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import HashRateCardComponent from '@/components/HashRateCardComponent.vue'
import SharesCardComponent from '@/components/SharesCardComponent.vue'
import PowerInfoCardComponent from '@/components/PowerInfoCardComponent.vue'
import { useAxeStore } from '@/stores/axe'
import { useI18n } from 'vue-i18n';
import { useRoute } from "vue-router";
export default defineComponent({
  name: 'IndexPage',
  components: {
    HashRateCardComponent,
    SharesCardComponent,
    PowerInfoCardComponent
  },

  setup() {
    const { t } = useI18n();
    const quasar = useQuasar()
    const axeStore = useAxeStore()
    const route = useRoute();
    const { locale } = useI18n();
    onBeforeMount(() => {
      const lang = route.query.lang || 'es';
      locale.value = lang;
    });
    const shortenString = (value, visibleChars = 6) => {
      if (!value) return '-';
      const str = String(value);
      if (str.length <= visibleChars * 2) return str;
      return `${str.slice(0, visibleChars)}...${str.slice(-visibleChars)}`;
    }

    const poolLinkResolvers = [
      { search: 'public-pool.io', build: (user) => `https://web.public-pool.io/#/app/${user}` },
      { search: 'nerdminer.de', build: (user) => `https://pool.nerdminer.de/#/app/${user}` },
      { search: 'solomining.de', build: (user) => `https://pool.solomining.de/#/app/${user}` },
      { search: 'yourdevice.ch', build: (user) => `https://blitzpool.yourdevice.ch/#/app/${user}` },
      { search: 'ocean.xyz', build: (user) => `https://ocean.xyz/stats/${user}` },
      { search: 'pool.noderunners.network', build: (user) => `https://noderunners.network/en/pool/user/${user}` },
      { search: 'satoshiradio.nl', build: (user) => `https://pool.satoshiradio.nl/user/${user}` },
      { search: 'solohash.co.uk', build: (user) => `https://solohash.co.uk/user/${user}` },
      { search: 'solo.stratum.braiins.com', build: (user) => `https://solo.braiins.com/stats/${user}` },
      { search: 'parasite.wtf', build: (user) => `https://parasite.space/user/${user}` },
      {
        regex: /^(?:https?:\/\/)?((?:eu|au)?solo[46]?\.)?ckpool\.org/i,
        build: (user, match) => {
          const regionRaw = match?.[1]?.replace('.', '') ?? '';
          const region = regionRaw.replace(/solo[46]?/i, '');
          const subdomain = region ? `${region}solostats` : 'solostats';
          return `https://${subdomain}.ckpool.org/users/${user}`;
        }
      },
      { search: 'atlaspool.io', build: (user) => `https://atlaspool.io/dashboard.html?wallet=${user}` },
    ];

    const resolvePoolLink = (url, user) => {
      if (!url || !user) return null;
      const entry = poolLinkResolvers.find((resolver) => {
        if (resolver.search) return url.includes(resolver.search);
        if (resolver.regex) return resolver.regex.test(url);
        return false;
      });
      if (!entry) return null;
      if (entry.regex) {
        const match = url.match(entry.regex);
        return match ? entry.build(user, match) : null;
      }
      return entry.build(user);
    };

    const buildUserLink = (user, url) => {
      if (!user) return { display: '-', url: null };
      return {
        display: shortenString(user),
        url: resolvePoolLink(url, user)
      };
    };

    const mainStratumUser = computed(() => {
      return buildUserLink(axeStore?.infoData?.stratumUser, axeStore?.infoData?.stratumURL);
    })
    const fallbackStratumUser = computed(() => {
      return buildUserLink(axeStore?.infoData?.fallbackStratumUser, axeStore?.infoData?.fallbackStratumURL);
    })

    const responseTimeRounded = computed(() => {
      const responseTime = axeStore?.infoData?.responseTime;
      return responseTime !== undefined && responseTime !== null ? Math.round(responseTime) : '-';
    })

    const responseTimeColor = computed(() => {
      const responseTime = axeStore?.infoData?.responseTime;
      if (responseTime === undefined || responseTime === null) return '#A8A8A8';
      if (responseTime >= 0 && responseTime <= 100) return '#629C44';
      if (responseTime >= 101 && responseTime <= 200) return '#FFA500';
      return '#E53935';
    })

    return {
      quasar,
      axeStore,
      t,
      mainStratumUser,
      fallbackStratumUser,
      responseTimeRounded,
      responseTimeColor
    }
  }
})
</script>
