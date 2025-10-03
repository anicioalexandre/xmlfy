import { useEffect, useState } from 'react'

import IconButton from 'components/design-system/IconButton'
import Text from 'components/design-system/Text'
import BackIcon from 'components/design-system/icons/BackIcon'
import CloseIcon from 'components/design-system/icons/CloseIcon'
import SettingsIcon from 'components/design-system/icons/SettingsIcon'
import { XMLFY_INTERFACE_CLOSE } from 'constants/events'
import { ROUTE } from 'constants/route'
import type { Routes } from 'types/route'
import { getXMLfyElement } from 'utils/dom'
import { getXMLfySettings } from 'utils/settings'

import Settings from './Settings'
import { Container, IconButtonsContainer, RoutesContainer } from './styled'

const XMLfyInterface = () => {
  const [route, _setRoute] = useState<Routes>(ROUTE.settings)

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
      <IconButtonsContainer>
        <IconButton onClick={handleInterfaceClose} style={{ zIndex: 1 }}>
          <CloseIcon />
        </IconButton>
        <Text $variant="h1" style={{ marginLeft: '-24px' }}>
          XMLfy
        </Text>
      </IconButtonsContainer>
      <RoutesContainer>
        {isSettingsRoute && <Settings isVisible={isSettingsRoute} />}
      </RoutesContainer>
    </Container>
  )
}

export default XMLfyInterface
