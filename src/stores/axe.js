import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { Notify, Loading } from 'quasar'
import { i18n } from '@/plugins/i18n'

// Lee la variable de entorno
const apiBaseUrlPrefix = import.meta.env.VITE_AXIOS_BASE_URL_PREFIX
if (apiBaseUrlPrefix) {
  axios.defaults.baseURL = apiBaseUrlPrefix
}

export const useAxeStore = defineStore('axe', {
  state: () => ({
    loadingHashRate: true,
    infoData: null,
    restartSystemLoading: false,
    isDrawerOpenMobile: false,
    hashRates: [],
    totalShares: 0,
    wifiPass: null,
    maxHashRateLocalStorage: 0,
    minHashRateLocalStorage: 0,
    firstLoading: false,
    isFirstRequest: true,
    darkmode: true,
    isSystemUpdating: false
  }),
  getters: {
    minHashRate() {
      if (this.hashRates.length === 0) {
        return 0
      }
      var currentMinHashRate = Math.min(...this.hashRates)
      if (currentMinHashRate > 5 && this.minHashRateLocalStorage == 0) {
        this.minHashRateLocalStorage = currentMinHashRate
      } else if (this.minHashRateLocalStorage > 0) {
        if (currentMinHashRate > 5 && currentMinHashRate < this.minHashRateLocalStorage) {
          this.minHashRateLocalStorage = currentMinHashRate
        }
      }
      return this.minHashRateLocalStorage || 0
    },
    maxHashRate() {
      var currentMaxHashRate = Math.max(...this.hashRates)
      if (currentMaxHashRate > this.maxHashRateLocalStorage) {
        this.maxHashRateLocalStorage = currentMaxHashRate
      }
      return this.maxHashRateLocalStorage // Calcula el max
    },
    expectedHashRate() {
      return this.infoData?.expectedHashrate
    },
    getPercentageSharesAccepted() {
      var percentageSharesAccepted = (this.infoData?.sharesAccepted / this.totalShares) * 100
      return percentageSharesAccepted?.toFixed(2)
    },
    getPercentageSharesRejected() {
      var percentageSharesRejected = (this.infoData?.sharesRejected / this.totalShares) * 100
      return percentageSharesRejected?.toFixed(2)
    },
    errorPercentage() {
      return (this.infoData?.errorPercentage ?? 0).toFixed(2)
    },
    getHashRateRounded() {
      let hashRate = this.infoData?.hashRate
      return hashRate?.toFixed(2)
    },
    getHashRate1hRounded() {
      let hashRate_1h = this.infoData?.hashRate_1h
      return hashRate_1h?.toFixed(2)
    },
    secondsToHms() {
      var d = Number(this.infoData?.uptimeSeconds)
      var days = Math.floor(d / 86400)
      var h = Math.floor((d % 86400) / 3600)
      var m = Math.floor((d % 3600) / 60)
      var s = Math.floor((d % 3600) % 60)

      return `${days}d:${h}h:${m}m`
    }
  },
  actions: {
    getSystemInfo() {
      if (this.isSystemUpdating) return
      if (this.isFirstRequest) {
        this.firstLoading = true
        this.isFirstRequest = false
      }
      return axios
        .get(`/api/system/info`)
        .then((res) => {
          this.infoData = res?.data
          //Arr de hashRates para encontrar el max y min
          var currentHashRate = res?.data?.hashRate
          this.hashRates.push(currentHashRate?.toFixed(2))

          // shares
          this.totalShares = res?.data?.sharesAccepted + res?.data?.sharesRejected
          return res?.data
        })
        .finally(() => {
          this.firstLoading = false
        })
    },
    restartSystem(t) {
      Loading.show({
        message: 'Restarting system'
      })
      return axios
        .post(`/api/system/restart`)
        .then((res) => {
          return res.data
        })
        .finally(() => {
          Loading.hide()
          Notify.create({
            message: t('layout.restartedDevice'),
            type: 'positive',
            position: 'top'
          })
          this.restartSystemLoading = false
        })
    },

    restartExternalSystem(ip) {
      return axios
        .post(`http://${ip}/api/system/restart`)
        .then((res) => {
          return res.data
        })
        .finally(() => {
          Notify.create({
            message: 'Device restarted successfuly',
            type: 'positive',
            position: 'top'
          })
        })
    },
    remove(ip) {
      return axios
        .post(`http://${ip}/api/system/restart`)
        .then((res) => {
          return res.data
        })
        .finally(() => {
          Notify.create({
            message: 'Device removed succesfully',
            type: 'positive',
            position: 'top'
          })
        })
    },
    resetDataLocalStorage() {
      this.minHashRateLocalStorage = 0
      this.maxHashRateLocalStorage = 0
      this.hashRates = []
    },
    getAsicSettings() {
      return axios.get(`/api/system/asic`).then((res) => {
        return res.data
      })
    },

    formatearFecha(fecha) {
      const ahora = new Date()
      const f = new Date(fecha)

      const esMismoDia = (a, b) =>
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()

      const ayer = new Date()
      ayer.setDate(ahora.getDate() - 1)

      const horas = f.getHours().toString().padStart(2, '0')
      const minutos = f.getMinutes().toString().padStart(2, '0')
      const horaFormateada = `${horas}:${minutos}h`

      if (esMismoDia(f, ahora)) {
        return `hoy, ${horaFormateada}`
      } else if (esMismoDia(f, ayer)) {
        return `ayer, ${horaFormateada}`
      } else {
        const dia = f.getDate().toString().padStart(2, '0')
        const mes = (f.getMonth() + 1).toString().padStart(2, '0')
        const año = f.getFullYear()
        return `${dia}/${mes}/${año}, ${horaFormateada}`
      }
    },
    getCoinInfo(address) {
      if (!address) return null;
      const addr = String(address).trim();
      // Bitcoin (BTC)
      if (addr.toLowerCase().startsWith('bc1')) {
        return {
          name: 'Bitcoin',
          code: 'BTC',
          image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPCEtLSBDcmVhdG9yOiBDb3JlbERSQVcgMjAxOSAoNjQtQml0KSAtLT4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZlcnNpb249IjEuMSIgc2hhcGUtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIHRleHQtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIGltYWdlLXJlbmRlcmluZz0ib3B0aW1pemVRdWFsaXR5IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIKdmlld0JveD0iMCAwIDQwOTEuMjcgNDA5MS43MyIKIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIgogeG1sbnM6eG9kbT0iaHR0cDovL3d3dy5jb3JlbC5jb20vY29yZWxkcmF3L29kbS8yMDAzIj4KIDxnIGlkPSJMYXllcl94MDAyMF8xIj4KICA8bWV0YWRhdGEgaWQ9IkNvcmVsQ29ycElEXzBDb3JlbC1MYXllciIvPgogIDxnIGlkPSJfMTQyMTM0NDAyMzMyOCI+CiAgIDxwYXRoIGZpbGw9IiNGNzkzMUEiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQwMzAuMDYgMjU0MC43N2MtMjczLjI0LDEwOTYuMDEgLTEzODMuMzIsMTc2My4wMiAtMjQ3OS40NiwxNDg5LjcxIC0xMDk1LjY4LC0yNzMuMjQgLTE3NjIuNjksLTEzODMuMzkgLTE0ODkuMzMsLTI0NzkuMzEgMjczLjEyLC0xMDk2LjEzIDEzODMuMiwtMTc2My4xOSAyNDc5LC0xNDg5Ljk1IDEwOTYuMDYsMjczLjI0IDE3NjMuMDMsMTM4My41MSAxNDg5Ljc2LDI0NzkuNTdsMC4wMiAtMC4wMnoiLz4KICAgPHBhdGggZmlsbD0id2hpdGUiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTI5NDcuNzcgMTc1NC4zOGM0MC43MiwtMjcyLjI2IC0xNjYuNTYsLTQxOC42MSAtNDUwLC01MTYuMjRsOTEuOTUgLTM2OC44IC0yMjQuNSAtNTUuOTQgLTg5LjUxIDM1OS4wOWMtNTkuMDIsLTE0LjcyIC0xMTkuNjMsLTI4LjU5IC0xNzkuODcsLTQyLjM0bDkwLjE2IC0zNjEuNDYgLTIyNC4zNiwtNTUuOTQgLTkyIDM2OC42OGMtNDguODQsLTExLjEyIC05Ni44MSwtMjIuMTEgLTE0My4zNSwtMzMuNjlsMC4yNiAtMS4xNiAtMzA5LjU5IC03Ny4zMSAtNTkuNzIgMjM5Ljc4YzAsMCAxNjYuNTYsMzguMTggMTYzLjA1LDQwLjUzIDkwLjkxLDIyLjY5IDEwNy4zNSw4Mi44NyAxMDQuNjIsMTMwLjU3bC0xMDQuNzQgNDIwLjE1YzYuMjYsMS41OSAxNC4zOCwzLjg5IDIzLjM0LDcuNDkgLTcuNDksLTEuODYgLTE1LjQ2LC0zLjg5IC0yMy43MywtNS44N2wtMTQ2LjgxIDU4OC41N2MtMTEuMTEsMjcuNjIgLTM5LjMxLDY5LjA3IC0xMDIuODcsNTMuMzMgMi4yNSwzLjI2IC0xNjMuMTcsLTQwLjcyIC0xNjMuMTcsLTQwLjcybC0xMTEuNDYgMjU2Ljk4IDI5Mi4xNSA3Mi44M2M1NC4zNSwxMy42MyAxMDcuNjEsMjcuODkgMTYwLjA2LDQxLjNsLTkyLjkgMzczLjAzIDIyNC4yNCA1NS45NCA5MiAtMzY5LjA3YzYxLjI2LDE2LjYzIDEyMC43MSwzMS45NyAxNzguOTEsNDYuNDNsLTkxLjY5IDM2Ny4zMyAyMjQuNTEgNTUuOTQgOTIuODkgLTM3Mi4zM2MzODIuODIsNzIuNDUgNjcwLjY3LDQzLjI0IDc5MS44MywtMzAzLjAyIDk3LjYzLC0yNzguNzggLTQuODYsLTQzOS41OCAtMjA2LjI2LC01NDQuNDQgMTQ2LjY5LC0zMy44MyAyNTcuMTgsLTEzMC4zMSAyODYuNjQsLTMyOS42MWwtMC4wNyAtMC4wNXptLTUxMi45MyA3MTkuMjZjLTY5LjM4LDI3OC43OCAtNTM4Ljc2LDEyOC4wOCAtNjkwLjk0LDkwLjI5bDEyMy4yOCAtNDk0LjJjMTUyLjE3LDM3Ljk5IDY0MC4xNywxMTMuMTcgNTY3LjY3LDQwMy45MXptNjkuNDMgLTcyMy4zYy02My4yOSwyNTMuNTggLTQ1My45NiwxMjQuNzUgLTU4MC42OSw5My4xNmwxMTEuNzcgLTQ0OC4yMWMxMjYuNzMsMzEuNTkgNTM0Ljg1LDkwLjU1IDQ2OC45NCwzNTUuMDVsLTAuMDIgMHoiLz4KICA8L2c+CiA8L2c+Cjwvc3ZnPgo='
        };
      }
      // Peercoin (PPC)
      if (addr.toUpperCase().startsWith('P')) {
        return {
          name: 'Peercoin',
          code: 'PPC',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjEyOCIgZmlsbD0iIzNDQjA0MyIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMDAgNzBoNDBjMjAgMCAzNSAxNSAzNSAzNXMtMTUgMzUtMzUgMzVoLTI1djI1aC0xNVY3MHptMTUgNTVoMjVjMTIgMCAyMC04IDIwLTIwcy04LTIwLTIwLTIwaC0yNXY0MHoiLz48L3N2Zz4='
        };
      }
      // Namecoin (NMC)
      if (addr.toUpperCase().startsWith('N') || addr.toUpperCase().startsWith('M')) {
        return {
          name: 'Namecoin',
          code: 'NMC',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjEyOCIgZmlsbD0iIzE4Njc5YSIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik04NSA3MGgyMGw2NSA4MFY3MGgyMHYxMTZoLTIwbC02NS04MHYxMTZIODVWNzB6Ii8+PC9zdmc+'
        };
      }
      // Elastos (ELA)
      if (addr.toUpperCase().startsWith('E')) {
        return {
          name: 'Elastos',
          code: 'ELA',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjEyOCIgZmlsbD0iIzMwMzAzMCIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik04NSA3MGg3MHYxNUg4NXYzMGg2MHYxNUg4NXYzMGg3MHYxNUg3MFY3MGgxNXoiLz48L3N2Zz4='
        };
      }
      // Syscoin (SYS)
      if (addr.startsWith('sys1')) {
        return {
          name: 'Syscoin',
          code: 'SYS',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjEyOCIgZmlsbD0iIzAwODJjNiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMjggNjRsLTY0IDY0IDY0IDY0IDY0LTY0LTY0LTY0em0wIDMybDMyIDMyLTMyIDMyLTMyLTMyIDMyLTMyeiIvPjwvc3ZnPg=='
        };
      }
      // DigiByte (DGB)
      if (addr.startsWith('dgb1q') || addr.startsWith('S') || addr.startsWith('d') || addr.startsWith('D')) {
        return {
          name: 'DigiByte',
          code: 'DGB',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NzkuOCA0NzkuOCI+PGNpcmNsZSBjeD0iMjM5LjkiIGN5PSIyMzkuOSIgcj0iMjE5LjUiIGZpbGw9IiMwMDIzNTIiIHN0cm9rZT0iIzA2YyIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjQwLjgiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTE2LjkgMTgyLjloMTU1czUzLjUtLjUgMTYuNSA2OC41YzAgMC0yNyA1NC05NCA1M2wzNi4xLTkyLjJhNy4zIDcuMyAwIDAgMC02LjYtMTBsLTQ3LjUtLjgtNjAgMTQ2czIwIDIgMzEgMWwtNiAxNWgyOC4zYTMuOCAzLjggMCAwIDAgMy42LTIuNWw1LjEtMTMuNSAxMi0xLTcgMTdIMjExYTUgNSAwIDAgMCA0LjctMy4ybDcuNy0xOS44czg0LTE0IDEyMi04MmMwIDAgNTEtNzktOS0xMDdhMTE2IDExNiAwIDAgMC0zNy0xMGw3LTE3LjNhMy40IDMuNCAwIDAgMC0zLjEtNC43aC0yNS45bC04IDIxaC0xMWw2LjItMTYuM2EzLjUgMy41IDAgMCAwLTMuMi00LjdoLTI2bC04IDIxaC04MC44YTEyIDEyIDAgMCAwLTEwLjYgNi4zeiIvPjwvc3ZnPg=='
        };
      }
      // Bitcoin Cash (BCH)
      if (addr.startsWith('q') || addr.startsWith('bitcoincash:q') || (addr.startsWith('p') && addr.length === 42)) {
        return {
          name: 'Bitcoin Cash',
          code: 'BCH',
          image: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA3ODggNzg4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3ODggNzg4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzBBQzE4RTt9Cgkuc3Qxe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+CjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjM5NCIgY3k9IjM5NCIgcj0iMzk0Ii8+CjxwYXRoIGlkPSJzeW1ib2xfMV8iIGNsYXNzPSJzdDEiIGQ9Ik01MTYuOSwyNjEuN2MtMTkuOC00NC45LTY1LjMtNTQuNS0xMjEtNDUuMkwzNzgsMTQ3LjFMMzM1LjgsMTU4bDE3LjYsNjkuMgoJYy0xMS4xLDIuOC0yMi41LDUuMi0zMy44LDguNEwzMDIsMTY2LjhsLTQyLjIsMTAuOWwxNy45LDY5LjRjLTkuMSwyLjYtODUuMiwyMi4xLTg1LjIsMjIuMWwxMS42LDQ1LjJjMCwwLDMxLTguNywzMC43LTgKCWMxNy4yLTQuNSwyNS4zLDQuMSwyOS4xLDEyLjJsNDkuMiwxOTAuMmMwLjYsNS41LTAuNCwxNC45LTEyLjIsMTguMWMwLjcsMC40LTMwLjcsNy45LTMwLjcsNy45bDQuNiw1Mi43YzAsMCw3NS40LTE5LjMsODUuMy0yMS44CglsMTguMSw3MC4ybDQyLjItMTAuOWwtMTguMS03MC43YzExLjYtMi43LDIyLjktNS41LDMzLjktOC40bDE4LDcwLjNsNDIuMi0xMC45bC0xOC4xLTcwLjFjNjUtMTUuOCwxMTAuOS01Ni44LDEwMS41LTExOS41CgljLTYtMzcuOC00Ny4zLTY4LjgtODEuNi03Mi4zQzUxOS4zLDMyNC43LDUzMCwyOTcuNCw1MTYuOSwyNjEuN0w1MTYuOSwyNjEuN3ogTTQ5Ni42LDQyNy4yYzguNCw2Mi4xLTc3LjksNjkuNy0xMDYuNCw3Ny4yCglsLTI0LjgtOTIuOUMzOTQsNDA0LDQ4Mi40LDM3Mi41LDQ5Ni42LDQyNy4yeiBNNDQ0LjYsMzAwLjdjOC45LDU1LjItNjQuOSw2MS42LTg4LjcsNjcuN2wtMjIuNi04NC4zCglDMzU3LjIsMjc4LjIsNDI2LjUsMjQ5LjYsNDQ0LjYsMzAwLjd6Ii8+Cjwvc3ZnPgo='
        };
      }
      // Bitcoinii (BTCI)
      if (addr.startsWith('B')) {
        return {
          name: 'Bitcoinii',
          code: 'BTCI',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjEyOCIgZmlsbD0iI0Y3OTMxQSIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik05NSA3MGg0NWMyMCAwIDM1IDE1IDM1IDM1YzAgMTAtNSAxOC0xMiAyNCA3IDYgMTIgMTQgMTIgMjQgMCAyMC0xNSAzNS0zNSAzNUg5NVY3MHptMTUgNTBoMzBjMTIgMCAyMC04IDIwLTIwcy04LTIwLTIwLTIwaC0zMHY0MHptMCA1NWgzNWMxMiAwIDIwLTggMjAtMjBzLTgtMjAtMjAtMjBoLTM1djQweiIvPjwvc3ZnPg=='
        };
      }
      return {
        name: i18n.global.t('swarmPage.unknownToken'),
        code: '¿?',
        image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjEyOCIgZmlsbD0iI0JEQkREIi8+PHRleHQgeD0iNTAlIiB5PSIxNjUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNjAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSI+PzwvdGV4dD48L3N2Zz4='
      };
    }
  },
  persist: {
    paths: ['minHashRateLocalStorage', 'maxHashRateLocalStorage', 'darkmode']
  }
})
