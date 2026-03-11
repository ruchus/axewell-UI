import { mount } from '@vue/test-utils'
import SharesCardComponent from '../SharesCardComponent.vue'
import { vi } from 'vitest'

// Mock partial of vue-i18n
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

// Hoisted mock store
const { mockAxeStore } = vi.hoisted(() => {
  return {
    mockAxeStore: {
      getPercentageSharesAccepted: 98.6,
      getPercentageSharesRejected: 1.4
    }
  }
})

// En el componente se importa como '../stores/axe', así que
// interceptamos esa ruta o la versión alias '@/stores/axe'
vi.mock('../../stores/axe', () => ({
  useAxeStore: () => mockAxeStore
}))
// Por si acaso también mockeamos el alias común
vi.mock('@/stores/axe', () => ({
  useAxeStore: () => mockAxeStore
}))

describe('SharesCardComponent.vue', () => {

  const mountComponent = (props = {}) => {
    return mount(SharesCardComponent, {
      props: {
        shareData: {
          sharesAccepted: 1530,
          sharesRejected: 12
        },
        ...props
      },
      global: {
        mocks: {
          t: mockT
        },
        stubs: {
          'q-card': { template: '<div class="q-card"><slot /></div>' },
          'q-card-section': { template: '<div class="q-card-section"><slot /></div>' },
          'q-circular-progress': { template: '<div class="q-circular-progress"><slot /></div>' },
          'q-badge': true
        }
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockAxeStore.getPercentageSharesAccepted = 98.6
    mockAxeStore.getPercentageSharesRejected = 1.4
  })

  it('debe renderizar correctamente los shares aceptados y rechazados indicados por props', () => {
    const wrapper = mountComponent()
    
    // sharesAccepted = 1530
    expect(wrapper.text()).toContain('1530')
    // sharesRejected = 12
    expect(wrapper.text()).toContain('12')
  })

  it('debe renderizar los porcentajes de éxito y error extraídos del store de Pinia', () => {
    const wrapper = mountComponent()
    
    expect(wrapper.text()).toContain('98.6%')
    expect(wrapper.text()).toContain('1.4%')
  })

  it('debe manejar props vacíos sin fallar', () => {
    const wrapper = mountComponent({ shareData: null })
    
    expect(wrapper.exists()).toBe(true)
    // Cuando shareData es null, no debe renderizar las cifras
    expect(wrapper.text()).not.toContain('1530')
  })
})
