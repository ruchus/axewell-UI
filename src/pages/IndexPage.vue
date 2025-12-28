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
                    <div class="row no-wrap items-center">
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
                      <span class="text-bold">{{ axeStore?.infoData?.stratumURL }}:{{ axeStore?.infoData?.stratumPort }}</span>
                    </div>
                    <div class="row no-wrap items-center q-mt-xs">
                      <template v-if="mainStratumUser.coin">
                        <q-img v-if="mainStratumUser.coin.image" :src="mainStratumUser.coin.image"
                          style="width: 20px; height: 20px;" class="q-mr-sm">
                          <q-tooltip>{{ mainStratumUser.coin.name }} ({{ mainStratumUser.coin.code }})</q-tooltip>
                        </q-img>
                        <q-icon v-else :name="mainStratumUser.coin.icon" :color="mainStratumUser.coin.color" size="xs"
                          class="q-mr-sm">
                          <q-tooltip>{{ mainStratumUser.coin.name }} ({{ mainStratumUser.coin.code }})</q-tooltip>
                        </q-icon>
                      </template>
                      <template v-else>
                         <div style="width: 20px" class="q-mr-sm"></div>
                      </template>

                      <template v-if="mainStratumUser?.url">
                        <a :href="mainStratumUser.url" target="_blank" rel="noopener" class="text-grey-7 text-bold" style="word-break: break-all;">{{
                          mainStratumUser.display }}</a>
                      </template>
                      <template v-else>
                        <span class="text-bold" style="word-break: break-all;">{{ mainStratumUser.display }}</span>
                      </template>
                    </div>
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
                    <div class="row no-wrap items-center">
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
                      <span class="text-bold">{{ axeStore?.infoData?.fallbackStratumURL }}:{{ axeStore?.infoData?.fallbackStratumPort }}</span>
                    </div>
                    <div class="row no-wrap items-center q-mt-xs">
                      <template v-if="fallbackStratumUser.coin">
                        <q-img v-if="fallbackStratumUser.coin.image" :src="fallbackStratumUser.coin.image"
                          style="width: 20px; height: 20px;" class="q-mr-sm">
                          <q-tooltip>{{ fallbackStratumUser.coin.name }} ({{ fallbackStratumUser.coin.code }})</q-tooltip>
                        </q-img>
                        <q-icon v-else :name="fallbackStratumUser.coin.icon" :color="fallbackStratumUser.coin.color" size="xs"
                          class="q-mr-sm">
                          <q-tooltip>{{ fallbackStratumUser.coin.name }} ({{ fallbackStratumUser.coin.code }})</q-tooltip>
                        </q-icon>
                      </template>
                      <template v-else>
                         <div style="width: 20px" class="q-mr-sm"></div>
                      </template>

                      <template v-if="fallbackStratumUser?.url">
                        <a :href="fallbackStratumUser.url" target="_blank" rel="noopener" class="text-grey-7 text-bold" style="word-break: break-all;">{{
                          fallbackStratumUser.display
                          }}</a>
                      </template>
                      <template v-else>
                        <span class="text-bold" style="word-break: break-all;">{{ fallbackStratumUser.display }}</span>
                      </template>
                    </div>
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
                  <div class="row no-wrap items-center">
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
                    <span class="text-bold">{{ axeStore?.infoData?.stratumURL }}:{{ axeStore?.infoData?.stratumPort }}</span>
                  </div>
                  <div class="row no-wrap items-center q-mt-xs">
                    <template v-if="mainStratumUser.coin">
                      <q-img v-if="mainStratumUser.coin.image" :src="mainStratumUser.coin.image"
                        style="width: 20px; height: 20px;" class="q-mr-sm">
                        <q-tooltip>{{ mainStratumUser.coin.name }} ({{ mainStratumUser.coin.code }})</q-tooltip>
                      </q-img>
                      <q-icon v-else :name="mainStratumUser.coin.icon" :color="mainStratumUser.coin.color" size="xs"
                        class="q-mr-sm">
                        <q-tooltip>{{ mainStratumUser.coin.name }} ({{ mainStratumUser.coin.code }})</q-tooltip>
                      </q-icon>
                    </template>
                    <template v-else>
                       <div style="width: 20px" class="q-mr-sm"></div>
                    </template>

                    <template v-if="mainStratumUser?.url">
                      <a :href="mainStratumUser.url" target="_blank" rel="noopener" class="text-grey-7 text-bold" style="word-break: break-all;">{{
                        mainStratumUser.display }}</a>
                    </template>
                    <template v-else>
                      <span class="text-bold" style="word-break: break-all;">{{ mainStratumUser.display }}</span>
                    </template>
                  </div>
                </div>
              </q-item>
            </div>
            <div v-if="axeStore?.infoData?.fallbackStratumURL" class="pool-info-container items-center q-mt-md">
              <div class="card-title" style="font-size: 16px;">Fallback pool</div>
              <q-item>
                <div class="card-text q-ml-md">
                  <div class="row no-wrap items-center">
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
                    <span class="text-bold">{{ axeStore?.infoData?.fallbackStratumURL }}:{{ axeStore?.infoData?.fallbackStratumPort }}</span>
                  </div>
                  <div class="row no-wrap items-center q-mt-xs">
                    <template v-if="fallbackStratumUser.coin">
                      <q-img v-if="fallbackStratumUser.coin.image" :src="fallbackStratumUser.coin.image"
                        style="width: 20px; height: 20px;" class="q-mr-sm">
                        <q-tooltip>{{ fallbackStratumUser.coin.name }} ({{ fallbackStratumUser.coin.code }})</q-tooltip>
                      </q-img>
                      <q-icon v-else :name="fallbackStratumUser.coin.icon" :color="fallbackStratumUser.coin.color" size="xs"
                        class="q-mr-sm">
                        <q-tooltip>{{ fallbackStratumUser.coin.name }} ({{ fallbackStratumUser.coin.code }})</q-tooltip>
                      </q-icon>
                    </template>
                    <template v-else>
                       <div style="width: 20px" class="q-mr-sm"></div>
                    </template>

                    <template v-if="fallbackStratumUser?.url">
                      <a :href="fallbackStratumUser.url" target="_blank" rel="noopener" class="text-grey-7 text-bold" style="word-break: break-all;">{{
                        fallbackStratumUser.display
                        }}</a>
                    </template>
                    <template v-else>
                      <span class="text-bold" style="word-break: break-all;">{{ fallbackStratumUser.display }}</span>
                    </template>
                  </div>
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

    const getCoinInfo = (address) => {
      if (!address) return null;
      const addr = String(address).trim();
      // Bitcoin (BTC)
      if (addr.startsWith('bc1q') || addr.startsWith('bc1p') || addr.startsWith('3') || addr.startsWith('1')) {
        return {
          name: 'Bitcoin',
          code: 'BTC',
          image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPCEtLSBDcmVhdG9yOiBDb3JlbERSQVcgMjAxOSAoNjQtQml0KSAtLT4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZlcnNpb249IjEuMSIgc2hhcGUtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIHRleHQtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIKdmlld0JveD0iMCAwIDQwOTEuMjcgNDA5MS43MyIKIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIgogeG1sbnM6eG9kbT0iaHR0cDovL3d3dy5jb3JlbC5jb20vY29yZWxkcmF3L29kbS8yMDAzIj4KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4KICA8bWV0YWRhdGEgaWQ9IkNvcmVsQ29ycElEXzBDb3JlbC1MYXllciIvPgogIDxnIGlkPSJfMTQyMTM0NDAyMzMyOCI+CiAgIDxwYXRoIGZpbGw9IiNGNzkzMUEiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQwMzAuMDYgMjU0MC43N2MtMjczLjI0LDEwOTYuMDEgLTEzODMuMzIsMTc2My4wMiAtMjQ3OS40NiwxNDg5LjcxIC0xMDk1LjY4LC0yNzMuMjQgLTE3NjIuNjksLTEzODMuMzkgLTE0ODkuMzMsLTI0NzkuMzEgMjczLjEyLC0xMDk2LjEzIDEzODMuMiwtMTc2My4xOSAyNDc5LC0xNDg5Ljk1IDEwOTYuMDYsMjczLjI0IDE3NjMuMDMsMTM4My41MSAxNDg5Ljc2LDI0NzkuNTdsMC4wMiAtMC4wMnoiLz4KICAgPHBhdGggZmlsbD0id2hpdGUiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTI5NDcuNzcgMTc1NC4zOGM0MC43MiwtMjcyLjI2IC0xNjYuNTYsLTQxOC42MSAtNDUwLC01MTYuMjRsOTEuOTUgLTM2OC44IC0yMjQuNSAtNTUuOTQgLTg5LjUxIDM1OS4wOWMtNTkuMDIsLTE0LjcyIC0xMTkuNjMsLTI4LjU5IC0xNzkuODcsLTQyLjM0bDkwLjE2IC0zNjEuNDYgLTIyNC4zNiAtNTUuOTQgLTkyIDM2OC42OGMtNDguODQsLTExLjEyIC05Ni44MSwtMjIuMTEgLTE0My4zNSwtMzMuNjlsMC4yNiAtMS4xNiAtMzA5LjU5IC03Ny4zMSAtNTkuNzIgMjM5Ljc4YzAsMCAxNjYuNTYsMzguMTggMTYzLjA1LDQwLjUzIDkwLjkxLDIyLjY5IDEwNy4zNSw4Mi44NyAxMDQuNjIsMTMwLjU3bC0xMDQuNzQgNDIwLjE1YzYuMjYsMS41OSAxNC4zOCwzLjg5IDIzLjM0LDcuNDkgLTcuNDksLTEuODYgLTE1LjQ2LC0zLjg5IC0yMy43MywtNS44N2wtMTQ2LjgxIDU4OC41N2MtMTEuMTEsMjcuNjIgLTM5LjMxLDY5LjA3IC0xMDIuODcsNTMuMzMgMi4yNSwzLjI2IC0xNjMuMTcsLTQwLjcyIC0xNjMuMTcsLTQwLjcybC0xMTEuNDYgMjU2Ljk4IDI5Mi4xNSA3Mi44M2M1NC4zNSwxMy42MyAxMDcuNjEsMjcuODkgMTYwLjA2LDQxLjNsLTkyLjkgMzczLjAzIDIyNC4yNCA1NS45NCA5MiAtMzY5LjA3YzYxLjI2LDE2LjYzIDEyMC43MSwzMS45NyAxNzguOTEsNDYuNDNsLTkxLjY5IDM2Ny4zMyAyMjQuNTEgNTUuOTQgOTIuODkgLTM3Mi4zM2MzODIuODIsNzIuNDUgNjcwLjY3LDQzLjI0IDc5MS44MywtMzAzLjAyIDk3LjYzLC0yNzguNzggLTQuODYsLTQzOS41OCAtMjA2LjI2LC01NDQuNDQgMTQ2LjY5LC0zMy44MyAyNTcuMTgsLTEzMC4zMSAyODYuNjQsLTMyOS42MWwtMC4wNyAtMC4wNXptLTUxMi45MyA3MTkuMjZjLTY5LjM4LDI3OC43OCAtNTM4Ljc2LDEyOC4wOCAtNjkwLjk0LDkwLjI5bDEyMy4yOCAtNDk0LjJjMTUyLjE3LDM3Ljk5IDY0MC4xNywxMTMuMTcgNTY3LjY3LDQwMy45MXptNjkuNDMgLTcyMy4zYy02My4yOSwyNTMuNTggLTQ1My45NiwxMjQuNzUgLTU4MC42OSw5My4xNmwxMTEuNzcgLTQ0OC4yMWMxMjYuNzMsMzEuNTkgNTM0Ljg1LDkwLjU1IDQ2OC45NCwzNTUuMDVsLTAuMDIgMHoiLz4KICA8L2c+CiA8L2c+Cjwvc3ZnPgo='
        };
      }
      // DigiByte (DGB)
      if (addr.startsWith('dgb1q') || addr.startsWith('S') || addr.startsWith('D')) {
        return {
          name: 'DigiByte',
          code: 'DGB',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NzkuOCA0NzkuOCI+PGNpcmNsZSBjeD0iMjM5LjkiIGN5PSIyMzkuOSIgcj0iMjE5LjUiIGZpbGw9IiMwMDIzNTIiIHN0cm9rZT0iIzA2YyIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjQwLjgiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTE2LjkgMTgyLjloMTU1czUzLjUtLjUgMTYuNSA2OC41YzAgMC0yNyA1NC05NCA1M2wzNi4xLTkyLjJhNy4zIDcuMyAwIDAgMC02LjYtMTBsLTQ3LjUtLjgtNjAgMTQ2czIwIDIgMzEgMWwtNiAxNWgyOC4zYTMuOCAzLjggMCAwIDAgMy42LTIuNWw1LjEtMTMuNSAxMi0xLTcgMTdIMjExYTUgNSAwIDAgMCA0LjctMy4ybDcuNy0xOS44czg0LTE0IDEyMi04MmMwIDAgNTEtNzktOS0xMDdhMTE2IDExNiAwIDAgMC0zNy0xMGw3LTE3LjNhMy40IDMuNCAwIDAgMC0zLjEtNC43aC0yNS45bC04IDIxaC0xMWw2LjItMTYuM2EzLjUgMy41IDAgMCAwLTMuMi00LjdoLTI2bC04IDIxaC04MC44YTEyIDEyIDAgMCAwLTEwLjYgNi4zeiIvPjwvc3ZnPg=='
        };
      }
      // Bitcoin Cash (BCH)
      if (addr.startsWith('q') || addr.startsWith('bitcoincash:q')) {
        return {
          name: 'Bitcoin Cash',
          code: 'BCH',
          image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA3ODggNzg4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3ODggNzg4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzBBQzE4RTt9Cgkuc3Qxe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+CjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjM5NCIgY3k9IjM5NCIgcj0iMzk0Ii8+CjxwYXRoIGlkPSJzeW1ib2xfMV8iIGNsYXNzPSJzdDEiIGQ9Ik01MTYuOSwyNjEuN2MtMTkuOC00NC45LTY1LjMtNTQuNS0xMjEtNDUuMkwzNzgsMTQ3LjFMMzM1LjgsMTU4bDE3LjYsNjkuMgoJYy0xMS4xLDIuOC0yMi41LDUuMi0zMy44LDguNEwzMDIsMTY2LjhsLTQyLjIsMTAuOWwxNy45LDY5LjRjLTkuMSwyLjYtODUuMiwyMi4xLTg1LjIsMjIuMWwxMS42LDQ1LjJjMCwwLDMxLTguNywzMC43LTgKCWMxNy4yLTQuNSwyNS4zLDQuMSwyOS4xLDEyLjJsNDkuMiwxOTAuMmMwLjYsNS41LTAuNCwxNC45LTEyLjIsMTguMWMwLjcsMC40LTMwLjcsNy45LTMwLjcsNy45bDQuNiw1Mi43YzAsMCw3NS40LTE5LjMsODUuMy0yMS44CglsMTguMSw3MC4ybDQyLjItMTAuOWwtMTguMS03MC43YzExLjYtMi43LDIyLjktNS41LDMzLjktOC40bDE4LDcwLjNsNDIuMi0xMC45bC0xOC4xLTcwLjFjNjUtMTUuOCwxMTAuOS01Ni44LDEwMS41LTExOS41CgljLTYtMzcuOC00Ny4zLTY4LjgtODEuNi03Mi4zQzUxOS4zLDMyNC43LDUzMCwyOTcuNCw1MTYuOSwyNjEuN0w1MTYuOSwyNjEuN3ogTTQ5Ni42LDQyNy4yYzguNCw2Mi4xLTc3LjksNjkuNy0xMDYuNCw3Ny4yCglsLTI0LjgtOTIuOUMzOTQsNDA0LDQ4Mi40LDM3Mi41LDQ5Ni42LDQyNy4yeiBNNDQ0LjYsMzAwLjdjOC45LDU1LjItNjQuOSw2MS42LTg4LjcsNjcuN2wtMjIuNi04NC4zCglDMzU3LjIsMjc4LjIsNDI2LjUsMjQ5LjYsNDQ0LjYsMzAwLjd6Ii8+Cjwvc3ZnPgo='
        };
      }
      // Bitcoinii (BTCI)
      if (addr.startsWith('i') || addr.startsWith('0x')) {
        return {
          name: 'Bitcoinii',
          code: 'BTCI',
          image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCI+++Cg=='
        };
      }
      return null;
    };

    const buildUserLink = (user, url) => {
      if (!user) return { display: '-', url: null, coin: null };
      return {
        display: shortenString(user),
        url: resolvePoolLink(url, user),
        coin: getCoinInfo(user)
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
