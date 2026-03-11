import { mount } from '@vue/test-utils'
import EssentialLink from '../EssentialLink.vue'

// Mock de vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  }),
  useRoute: () => ({
    name: 'Home'
  })
}))

describe('EssentialLink.vue', () => {
  it('debe renderizar el título correctamente', () => {
    const wrapper = mount(EssentialLink, {
      props: {
        title: 'Prueba de Link',
        link: 'test-link',
        icon: 'home'
      },
      global: {
        stubs: {
          'q-item': { template: '<div><slot /></div>' },
          'q-item-section': { template: '<div><slot /></div>' },
          'q-icon': true,
          'q-item-label': { template: '<span><slot /></span>' }
        }
      }
    })
    expect(wrapper.text()).toContain('Prueba de Link')
  })
})
