import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { Notify, Loading } from 'quasar'

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
    }
  },
  persist: {
    paths: ['minHashRateLocalStorage', 'maxHashRateLocalStorage', 'darkmode']
  }
})
