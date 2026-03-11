import { EventBus } from '@/services'

export type ComponentOptions = {
  name: string
}

export default class BaseComponent extends EventBus {
  public element: HTMLElement
  public name: string

  constructor(element: HTMLElement, options: ComponentOptions = { name: '' }) {
    super()

    this.element = element
    this.name = options.name
  }
}
