import { type Root, createRoot } from 'react-dom/client'
import { StyleSheetManager } from 'styled-components'

import { XMLFY_INTERFACE_CLOSE } from 'constants/events'
import { INITIALIZE_POPUP_ELEMENT } from 'constants/messages'
import { injectGlobalStyles } from 'utils/dom'

import XMLfyInterface from './components/XMLfyInterface'

export class XMLfyEement extends HTMLElement {
  private _root: null | Root
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._root = null
    this.handleXMLfyInterfaceClose = this.handleXMLfyInterfaceClose.bind(this)
  }

  connectedCallback() {
    injectGlobalStyles()

    chrome.runtime.onMessage.addListener((message) => {
      if (message && message.type === INITIALIZE_POPUP_ELEMENT) {
        this.render()
      }
    })

    this.addEventListener(XMLFY_INTERFACE_CLOSE, this.handleXMLfyInterfaceClose)
  }

  disconnectedCallback() {
    this.removeEventListener(XMLFY_INTERFACE_CLOSE, this.handleXMLfyInterfaceClose)
    if (this._root) {
      this._root.unmount()
      this._root = null
    }
  }

  handleXMLfyInterfaceClose() {
    this.render(false)
  }

  render(renderXMLfyInterface = true) {
    if (!renderXMLfyInterface) {
      this._root.unmount()
      return
    }

    this._root?.unmount()
    this.shadowRoot.innerHTML = ''

    const mountPoint = document.createElement('div')
    this.shadowRoot.appendChild(mountPoint)

    this._root = createRoot(mountPoint)
    this._root.render(
      <StyleSheetManager target={this.shadowRoot}>
        <XMLfyInterface />
      </StyleSheetManager>,
    )
  }
}
