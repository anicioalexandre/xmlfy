import { DEFAULT_XMLFY_SETTINGS, XMLFY_SETTINGS_KEY } from 'constants/settings'
import type { XMLfySettings } from 'types/settings'

export const getXMLfySettings = (): Promise<XMLfySettings> => {
  return new Promise((resolve) => {
    chrome.storage.local.get([XMLFY_SETTINGS_KEY], (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting settings:', chrome.runtime.lastError)
        return resolve(DEFAULT_XMLFY_SETTINGS)
      }
      const settings = result[XMLFY_SETTINGS_KEY] || DEFAULT_XMLFY_SETTINGS
      resolve(settings)
    })
  })
}

export const setXMLfySettings = (
  newSettings: Partial<XMLfySettings>,
): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    getXMLfySettings().then((currentSettings: XMLfySettings) => {
      const updatedSettings = { ...currentSettings, ...newSettings }
      chrome.storage.local.set({ [XMLFY_SETTINGS_KEY]: updatedSettings }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error setting settings:', chrome.runtime.lastError)
          return resolve({ success: false })
        }
        resolve({ success: true })
      })
    })
  })
}
