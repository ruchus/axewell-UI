import { mount } from '@vue/test-utils'
import HashRateCardComponent from '../HashRateCardComponent.vue'
import { vi } from 'vitest'

// Mock de i18n
const mockT = (key) => key

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useI18n: () => ({
      t: mockT
    })
  }
})

// Mock de Quasar
vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useQuasar: () => ({
      screen: {
        gt: { sm: true }
      }
    })
  }
})

// Objeto mock del store
const mockAxeStore = {
  darkmode: false,
  getHashRateRounded: '120.5',
  expectedHashRate: 150.4,
  maxHashRate: 200.1,
  minHashRate: 50.9,
  getHashRate1hRounded: '115.0',
  errorPercentage: 5.2,
  resetDataLocalStorage: vi.fn()
}

// Mock de Pinia Store
vi.mock('@/stores/axe', () => ({
  useAxeStore: () => mockAxeStore
}))

describe('HashRateCardComponent.vue', () => {
  const hashRateDataSample = {
    power: 1500,
    hashRate: 450000, // 450000 / 1000 = 450 Th/s
    bestDiff: 2500000000, // 2.5G
    bestSessionDiff: 1500000 // 1.5M
  }

  const mountComponent = (props = {}) => {
    return mount(HashRateCardComponent, {
      props: {
        hashRateData: hashRateDataSample,
        ...props
      },
      global: {
        mocks: {
          t: mockT
        },
        stubs: {
          'q-card': { template: '<div class="q-card"><slot /></div>' },
          'q-card-section': { template: '<div class="q-card-section"><slot /></div>' },
          'q-icon': true,
          'q-tooltip': { template: '<div><slot /></div>' },
          'q-badge': true,
          'q-btn': true,
          'q-dialog': { template: '<div><slot /></div>' },
          'q-avatar': true,
          'q-card-actions': { template: '<div><slot /></div>' }
        },
        directives: {
          'close-popup': {}
        }
      }
    })
  }

  // Limpiar los mocks antes de cada test
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe renderizar correctamente los datos del store de HashRate', () => {
    const wrapper = mountComponent()
    
    // getHashRateRounded
    expect(wrapper.text()).toContain('120.5 Gh/s')
    
    // expectedHashRate Math.round(150.4) = 150
    expect(wrapper.text()).toContain('150 Gh/s')
    
    // maxHashRate Math.round(200.1) = 200
    expect(wrapper.text()).toContain('200 Gh/s')
    
    // minHashRate Math.round(50.9) = 51
    expect(wrapper.text()).toContain('51 Gh/s')
    
    // getHashRate1hRounded
    expect(wrapper.text()).toContain('115.0 Gh/s')
    
    // errorPercentage
    expect(wrapper.text()).toContain('5.2 %')
  })

  it('debe calcular la eficiencia correctamente: J/Th y W/Th', () => {
    const wrapper = mountComponent()
    // calculation: power / (hashRate / 1000)
    // 1500 / (450000 / 1000) = 1500 / 450 = 3.333... rounded to 3
    expect(wrapper.text()).toContain('3 J/Th')
    expect(wrapper.text()).toContain('3 W/Th')
  })

  it('debe formatear e normalizar las dificultades de la sesión y mejor histórica', () => {
    const wrapper = mountComponent()
    
    const formatted2_5 = (2.5).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const formatted1_5 = (1.5).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    
    expect(wrapper.text()).toContain(`${formatted2_5}G`)
    expect(wrapper.text()).toContain(`${formatted1_5}M`)
  })

  it('debe mostrar la dificultad normalizada en K para valores menores a un millón', () => {
    const wrapper = mountComponent({
      hashRateData: {
        ...hashRateDataSample,
        bestDiff: 250000, // 250K
        bestSessionDiff: 1540 // 1.54K
      }
    })
    
    const formatted250 = (250).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const formatted1_5 = (1.5).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    
    expect(wrapper.text()).toContain(`${formatted250}K`)
    expect(wrapper.text()).toContain(`${formatted1_5}K`)
  })
})
