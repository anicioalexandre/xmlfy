import { useEffect, useState } from 'react'

import { DEFAULT_XMLFY_SETTINGS, XMLFY_SETTINGS_KEY } from 'constants/settings'
import type { XMLfySettings } from 'types/settings'
import { getXMLfyElement } from 'utils/dom'
import { getXMLfySettings, setXMLfySettings } from 'utils/settings'
import { getTheme, setCSSVariables } from 'utils/theme'

const useSettings = () => {
  const [settings, setSettings] = useState<XMLfySettings>(DEFAULT_XMLFY_SETTINGS)

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      const previousSettings = changes[XMLFY_SETTINGS_KEY]?.oldValue
      const newSettings = changes[XMLFY_SETTINGS_KEY]?.newValue

      const isThemeModeChanged = previousSettings?.themeMode !== newSettings?.themeMode
      if (isThemeModeChanged) {
        const element = getXMLfyElement()
        const theme = getTheme(newSettings.themeMode)
        setCSSVariables(element, theme)
      }

      if (newSettings) {
        setSettings(newSettings)
      }
    }
  })

  const handleSetSettings = async (newSettings: Partial<XMLfySettings>) => {
    await setXMLfySettings(newSettings)
  }

  useEffect(() => {
    getXMLfySettings().then((settings) => {
      setSettings(settings)
    })
  }, [])

  return { settings, setSettings: handleSetSettings }
}

export default useSettings
