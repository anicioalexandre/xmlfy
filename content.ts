import '@webcomponents/custom-elements'

import { XMLFY_SETTINGS_KEY } from 'constants/settings'
import { getXMLfySettings } from 'utils/settings'
import { getTheme, setCSSVariables } from 'utils/theme'

import { XMLfyEement } from './xmlfy-element'

const initialize = async () => {
  window.customElements.define('xmlfy-element', XMLfyEement)
  const element = document.createElement('xmlfy-element')

  // TODO: grabing theme mode from the browser settings is not working
  // const isBrowserOnDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
  const { themeMode } = await getXMLfySettings()
  const theme = getTheme(themeMode)

  setCSSVariables(element, theme)

  document.documentElement.append(element)
}

initialize()

const xmlfy = (() => {
  let activeElement: Element | null = null
  let focusinListener: ((event: Event) => void) | null = null
  let focusoutListener: ((event: Event) => void) | null = null
  let isXMLfyEnabled = false

  const getActiveElement = () => {
    const activeElement = document.activeElement
    if (!activeElement) return null
    // TODO: if iframe.contentDocument.activeElement
    return activeElement
  }

  const readValue = (element?: HTMLElement) => {
    if (!element) return null

    if (element.isContentEditable) {
      return element.textContent
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      return element.value
    }

    return null
  }

  const getCursorOffset = (event: InputEvent): number | undefined => {
    const element = event.target as HTMLElement
    if (element.isContentEditable) {
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return undefined

      const range = selection.getRangeAt(0)

      // Create a range from the start of the element to the cursor
      const preCaretRange = document.createRange()
      preCaretRange.selectNodeContents(element)
      preCaretRange.setEnd(range.endContainer, range.endOffset)

      // Get the text content which properly handles newlines
      const preCaretText = preCaretRange.cloneContents().textContent || ''
      const offset = preCaretText.length
      return offset
    }
    // For textarea and input elements, selectionStart already gives absolute position
    else if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const offset = element.selectionStart ?? 0
      return offset
    }

    return undefined
  }

  const identifyPotentialXMLTag = (event: InputEvent) => {
    const element = event.target as HTMLElement
    const value = readValue(element)
    if (!value) return null

    const offset = getCursorOffset(event)
    if (offset === undefined) return null

    const MAX_XML_TAG_LENGTH = 50
    const startPos = Math.max(0, offset - MAX_XML_TAG_LENGTH)
    const searchString = value.slice(startPos, offset)

    const xmlTagRegex = /<([a-zA-Z_][\w\-.:]*)\s*>?$/
    const match = searchString.match(xmlTagRegex)

    return match ? match[1] : null
  }

  const writeValue = (
    element: HTMLElement,
    insertText: string,
    insertPosition: number,
    cursorPosition?: number,
  ) => {
    if (!element) return

    const currentValue = readValue(element) || ''
    const newValue =
      currentValue.slice(0, insertPosition) + insertText + currentValue.slice(insertPosition)

    if (element.isContentEditable) {
      // Instead of replacing textContent, insert at cursor position
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) return newValue

      const range = selection.getRangeAt(0)

      // Delete any selected content first
      range.deleteContents()

      // Create a text node with our insert text
      const textNode = document.createTextNode(insertText)
      range.insertNode(textNode)

      // Position cursor after the inserted text
      if (cursorPosition !== undefined) {
        // Calculate position relative to the inserted text
        const insertedLength = insertText.length
        const cursorOffset = cursorPosition - insertPosition

        if (cursorOffset >= 0 && cursorOffset <= insertedLength) {
          range.setStart(textNode, cursorOffset)
          range.setEnd(textNode, cursorOffset)
        } else {
          // Position after the inserted text
          range.setStartAfter(textNode)
          range.setEndAfter(textNode)
        }

        selection.removeAllRanges()
        selection.addRange(range)
      }

      element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
      return newValue
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value',
      )?.set
      const nativeInputSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set

      if (element.tagName === 'TEXTAREA' && nativeSetter) {
        nativeSetter.call(element, newValue)
      } else if (element.tagName === 'INPUT' && nativeInputSetter) {
        nativeInputSetter.call(element, newValue)
      } else {
        element.value = newValue
      }

      element.dispatchEvent(new Event('input', { bubbles: true }))
      element.dispatchEvent(new Event('change', { bubbles: true }))

      return newValue
    }
  }

  const watchValue = (event: InputEvent) => {
    const data = event.data
    const offset = getCursorOffset(event)
    if (data === '>') {
      const xmlTag = identifyPotentialXMLTag(event)
      if (xmlTag) {
        event.preventDefault()

        const insertText = `></${xmlTag}>`
        const value = readValue(event.target as HTMLElement)
        const adjustedOffset = offset ?? value?.length ?? 0
        const cursorPos = adjustedOffset + 1

        writeValue(event.target as HTMLElement, insertText, adjustedOffset, cursorPos)

        const element = event.target as HTMLElement

        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          element.setSelectionRange(cursorPos, cursorPos)
        }
      }
    }
  }

  const enableWatchFocus = () => {
    if (isXMLfyEnabled || focusinListener || focusoutListener) return

    focusinListener = (event) => {
      activeElement = getActiveElement()
      activeElement?.addEventListener('beforeinput', watchValue)
    }

    focusoutListener = (event) => {
      activeElement?.removeEventListener('beforeinput', watchValue)
      activeElement = null
    }

    document.addEventListener('focusin', focusinListener)
    document.addEventListener('focusout', focusoutListener)
    isXMLfyEnabled = true

    console.log('XMLfy focus listeners enabled')
  }

  const disableWatchFocus = () => {
    if (!isXMLfyEnabled || !focusinListener || !focusoutListener) return

    // Remove existing listeners
    document.removeEventListener('focusin', focusinListener)
    document.removeEventListener('focusout', focusoutListener)

    // Clean up any active element listener
    activeElement?.removeEventListener('beforeinput', watchValue)
    activeElement = null

    focusinListener = null
    focusoutListener = null
    isXMLfyEnabled = false

    console.log('XMLfy focus listeners disabled')
  }

  const handleSettingsChange = async () => {
    const settings = await getXMLfySettings()

    if (settings.enableXMLfy && !isXMLfyEnabled) {
      enableWatchFocus()
    } else if (!settings.enableXMLfy && isXMLfyEnabled) {
      disableWatchFocus()
    }
  }

  // Initialize based on current settings
  const init = async () => {
    await handleSettingsChange()

    // Watch for storage changes
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes[XMLFY_SETTINGS_KEY]) {
        console.log('XMLfy settings changed:', changes[XMLFY_SETTINGS_KEY])
        handleSettingsChange()
      }
    })
  }

  return { init, enableWatchFocus, disableWatchFocus }
})()

xmlfy.init()

export {}
