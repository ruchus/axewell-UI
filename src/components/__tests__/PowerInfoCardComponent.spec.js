import { mount } from '@vue/test-utils'
import PowerInfoCardComponent from '../PowerInfoCardComponent.vue'

// Mock parcial de Quasar: mantiene los componentes originales, solo reemplaza useQuasar
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

// Mock parcial de vue-i18n
vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useI18n: () => ({
      t: (key) => key
    })
  }
})

describe('PowerInfoCardComponent.vue', () => {
  const powerDataSample = {
    power: 120.5,
    coreVoltageActual: 800,
    voltage: 12100,
    current: 1000,
    frequency: 500,
    fanspeed: 50.4,
    fanrpm: 3000,
    temp: 55,
    temp2: 60
  }

  const mountComponent = (props = {}) => {
    return mount(PowerInfoCardComponent, {
      props: {
        powerData: powerDataSample,
        ...props
      },
      global: {
        stubs: {
          'q-card': { template: '<div><slot /></div>' },
          'q-card-section': { template: '<div><slot /></div>' },
          'q-icon': true
        }
      }
    })
  }

  it('debe calcular correctamente el consumo de energía (redondeado)', () => {
    const wrapper = mountComponent()
    // Math.round(120.5) = 121
    expect(wrapper.text()).toContain('121 W')
  })

  it('debe calcular correctamente el voltaje del ASIC', () => {
    const wrapper = mountComponent()
    // 800 / 1000 = 0.80
    expect(wrapper.text()).toContain('0.80 V')
  })

  it('debe calcular correctamente el voltaje y corriente de entrada', () => {
    const wrapper = mountComponent()
    // 12100 / 1000 = 12.10 y 1000 / 1000 = 1.00
    expect(wrapper.text()).toContain('12.10')
    expect(wrapper.text()).toContain('1.00')
  })

  it('debe mostrar la frecuencia', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('500 Mhz')
  })

  it('debe mostrar la velocidad del ventilador en % y RPM', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('(50%)')
    expect(wrapper.text()).toContain('3000 RPM')
  })

  it('debe procesar múltiples temperaturas de chip correctamente', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('ASIC 1')
    expect(wrapper.text()).toContain('55 ºC')
    expect(wrapper.text()).toContain('ASIC 2')
    expect(wrapper.text()).toContain('60 ºC')
  })

  it('debe ocultar temperaturas inválidas (0 o -1)', () => {
    const wrapper = mountComponent({
      powerData: {
        ...powerDataSample,
        temp2: 0,
        temp3: -1
      }
    })
    // Solo queda 1 temp válida (temp=55), así que el componente
    // la muestra sin label "ASIC X" (rama v-else del template)
    expect(wrapper.text()).toContain('55 ºC')
    expect(wrapper.text()).not.toContain('ASIC 2')
    expect(wrapper.text()).not.toContain('ASIC 3')
  })

  it('debe mostrar una sola temperatura sin label cuando solo hay una', () => {
    const wrapper = mountComponent({
      powerData: {
        ...powerDataSample,
        temp: 45,
        temp2: 0,
        temp3: undefined
      }
    })
    expect(wrapper.text()).toContain('45 ºC')
    expect(wrapper.text()).not.toContain('ASIC 1')
  })
})
