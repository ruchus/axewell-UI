import { mount } from '@vue/test-utils'
import SystemPage from '../SystemPage.vue'
import { vi } from 'vitest'
import axios from 'axios'

// Mock partial of vue-i18n
const mockT = (key) => key
const mockLocale = { value: 'en' }

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useI18n: () => ({
      t: mockT,
      locale: mockLocale
    })
  }
})

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {
      lang: 'es'
    }
  })
}))

// Mock Quasar
const mockNotify = vi.fn()
vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useQuasar: () => ({
      screen: {
        gt: { xs: true }
      },
      notify: mockNotify
    })
  }
})

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn()
  }
}))

// Definition of __APP_VERSION__ global
vi.stubGlobal('__APP_VERSION__', '1.2.3')

// Hoisted variables for mock store
const { mockAxeStore } = vi.hoisted(() => {
  return {
    mockAxeStore: {
      secondsToHms: '1d 2h 3m',
      infoData: {} // will be populated in beforeEach
    }
  }
})

vi.mock('@/stores/axe', () => ({
  useAxeStore: () => mockAxeStore
}))

describe('SystemPage.vue', () => {
  const mountComponent = () => {
    return mount(SystemPage, {
      global: {
        stubs: {
          'q-card': { template: '<div class="q-card"><slot /></div>' },
          'q-list': { template: '<div class="q-list"><slot /></div>' },
          'q-item': { template: '<div class="q-item"><slot /></div>' },
          'q-item-label': { template: '<span class="q-item-label"><slot /></span>' },
          'q-btn': { template: '<button class="q-btn"><slot /></button>' },
          'BtnLogsComponent': { template: '<div class="btn-logs-component"></div>' }
        }
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Reset store data before each test
    mockAxeStore.secondsToHms = '1d 2h 3m'
    mockAxeStore.infoData = {
      ASICModel: 'AxeBit',
      macAddr: '00:11:22:33:44:55',
      boardVersion: 'v2.0',
      resetReason: 'Power on',
      version: 'v1.0.0-fw',
      idfVersion: 'v4.4.2',
      hostname: 'axe-miner',
      ipv4: '192.168.1.100',
      ipv6: 'fe80::1',
      freeHeap: 1048576, // 1 MB
      temp: 50,
      temp2: 55,
      temp3: 0 // Invalid
    }
  })

  it('debe renderizar la información de red, hardware y software correctamente', () => {
    const wrapper = mountComponent()
    
    // Hardware
    expect(wrapper.text()).toContain('AxeBit')
    expect(wrapper.text()).toContain('00:11:22:33:44:55')
    expect(wrapper.text()).toContain('v2.0')
    expect(wrapper.text()).toContain('Power on')
    
    // Software & Net
    expect(wrapper.text()).toContain('v1.0.0-fw')
    expect(wrapper.text()).toContain('v1.2.3') // __APP_VERSION__
    expect(wrapper.text()).toContain('v4.4.2')
    expect(wrapper.text()).toContain('axe-miner')
    expect(wrapper.text()).toContain('192.168.1.100')
    expect(wrapper.text()).toContain('fe80::1')
  })

  it('debe mostrar el uptime desde el store', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('1d 2h 3m')
  })

  it('debe contar y mostrar la cantidad válida de chips multiplicando el modelo', () => {
    // InfoData tiene temp=50, temp2=55, temp3=0 -> 2 chips válidos
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('2 x AxeBit')
  })

  it('debe ocultar el multiplicador si no hay chips válidos', () => {
    mockAxeStore.infoData.temp = 0
    mockAxeStore.infoData.temp2 = -1
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('AxeBit')
    expect(wrapper.text()).not.toContain('x AxeBit')
  })

  it('debe calcular correctamente la memoria Heap en MB', () => {
    // 1048576 bytes = 1.00 MB
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('1.00 M')
  })

  it('debe mostrar - si el valor de Heap es null o undefined', () => {
    mockAxeStore.infoData.freeHeap = null
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('-')
  })

  it('debe enviar la petición a axios y notificar al hacer click en identify device', async () => {
    axios.post.mockResolvedValueOnce({ data: 'ok' })
    const wrapper = mountComponent()
    
    await wrapper.find('.q-btn').trigger('click')
    
    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith('/api/system/identify', {})
    
    // Wait for the async function to finish
    await new Promise(process.nextTick)
    
    expect(mockNotify).toHaveBeenCalledTimes(1)
    expect(mockNotify).toHaveBeenCalledWith({
      type: 'positive',
      message: 'systemPage.identifySuccess'
    })
  })

  it('debe notificar error si identify action falla catastróficamente', async () => {
    axios.post.mockRejectedValueOnce(new Error('Internal server error'))
    const wrapper = mountComponent()
    
    await wrapper.find('.q-btn').trigger('click')
    
    // Wait for promise resolution
    await new Promise(process.nextTick)
    
    expect(mockNotify).toHaveBeenCalledWith({
      type: 'negative',
      message: 'systemPage.identifyError'
    })
  })

  it('debe notificar éxito falso si la red falla (comportamiento legacy de Axios en este componente)', async () => {
    const networkError = new Error('Network Error')
    axios.post.mockRejectedValueOnce(networkError)
    const wrapper = mountComponent()
    
    await wrapper.find('.q-btn').trigger('click')
    
    await new Promise(process.nextTick)
    
    expect(mockNotify).toHaveBeenCalledWith({
      type: 'positive',
      message: 'systemPage.identifySuccess'
    })
  })
})
