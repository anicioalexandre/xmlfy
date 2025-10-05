import { useEffect, useState } from 'react'


import Icon from 'assets/icon.png'
import IconLight from 'assets/icon_light.png'
import { XMLFY_INTERFACE_CLOSE } from 'constants/events'
import { ROUTE } from 'constants/route'
import type { Routes } from 'types/route'
import { getXMLfyElement } from 'utils/dom'
import { getXMLfySettings } from 'utils/settings'
import Settings from './Settings'
import { Container, Logo, LogoContainer, RoutesContainer } from './styled'
import useSettings from 'hooks/useSettings'

const XMLfyInterface = () => {
  const [route, _setRoute] = useState<Routes>(ROUTE.settings)
  const { settings } = useSettings()
  const xmlfyElement = getXMLfyElement()

  const handleInterfaceClose = () => {
    const event = new CustomEvent(XMLFY_INTERFACE_CLOSE, {
      bubbles: true,
      composed: true,
    })
    xmlfyElement?.dispatchEvent(event)
  }

  const handleDocumentClick = async (e: MouseEvent) => {
    const isClickInsideInterface = e.composedPath().includes(xmlfyElement)

    if (isClickInsideInterface) return

    const settings = await getXMLfySettings()
    if (settings.closeInterfaceOnClickOutside) {
      handleInterfaceClose()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])

  const isSettingsRoute = route === ROUTE.settings

  return (
    <Container $route={route}>
      <LogoContainer>
        <Logo src={settings.themeMode === 'dark' ? Icon : IconLight} alt="XMLfy logo" />
      </LogoContainer>
      <RoutesContainer>
        {isSettingsRoute && <Settings isVisible={isSettingsRoute} />}
      </RoutesContainer>
    </Container>
  )
}

export default XMLfyInterface
