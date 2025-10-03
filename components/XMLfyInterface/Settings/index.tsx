import { type FC } from 'react'

import AnimatedTransition from 'components/design-system/AnimatedTransition'
import RouteContainer from 'components/design-system/RouteContainer'
import Switch from 'components/design-system/Switch'
import useSettings from 'hooks/useSettings'
import type { XMLfySettingsKeys } from 'types/settings'
import { setXMLfySettings } from 'utils/settings'

import type { SettingsProps } from './types'

const Settings: FC<SettingsProps> = ({ isVisible }) => {
  const { settings } = useSettings()

  const toggleThemeMode = async (checked: boolean) => {
    const mode = checked ? 'dark' : 'light'
    await setXMLfySettings({ themeMode: mode })
  }

  const handleSettingsToggle = (settingKey: XMLfySettingsKeys) => async (checked: boolean) => {
    await setXMLfySettings({
      [settingKey]: checked,
    })
  }

  return (
    <AnimatedTransition $isVisible={isVisible}>
      <RouteContainer>
        <Switch
          label="Enable XMLfy"
          checked={settings.enableXMLfy}
          onChange={handleSettingsToggle('enableXMLfy')}
        />
        <Switch
          label="Light/Dark mode"
          checked={settings.themeMode === 'dark'}
          onChange={toggleThemeMode}
        />
        {/*<Switch
          label="Close interface on click outside"
          checked={settings.closeInterfaceOnClickOutside}
          onChange={handleSettingsToggle('closeInterfaceOnClickOutside')}
        />*/}
      </RouteContainer>
    </AnimatedTransition>
  )
}

export default Settings
