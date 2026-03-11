import * as Components from './components'
import BaseComponent from './components/base/index'
import { Store } from './services'

export type AppState = {
  components: BaseComponent[]
}

export type ComponentsType = {
  [key in keyof typeof Components]: BaseComponent
}

const isComponent = (component: unknown): component is typeof BaseComponent => {
  return typeof component === 'function'
}

const DATA_SET = {
  componentName: 'data-component',
  moduleName: 'data-module',
}

const SELECTORS = {
  component: `[${DATA_SET.componentName}]`,
  module: `[${DATA_SET.moduleName}]`,
}

const MODS = {
  transitionDisabled: 'app_transition_disabled',
}

const components = document.querySelectorAll(SELECTORS.component)

export const appStore = new Store<AppState>({
  components: [],
})

components.forEach(component => {
  const componentName = component.getAttribute(
    DATA_SET.componentName,
  ) as keyof ComponentsType

  if (componentName in Components) {
    const CurrentComponent = Components[componentName]

    if (isComponent(CurrentComponent)) {
      appStore.setState({
        components: [
          ...(appStore.getState().components as AppState['components']),
          new CurrentComponent(component as HTMLElement, {
            name: componentName,
          }),
        ],
      })
    }
  }
})

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove(MODS.transitionDisabled)
})
