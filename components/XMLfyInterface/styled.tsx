import styled from 'styled-components'

import { ROUTE } from 'constants/route'
import type { Routes } from 'types/route'

export const Container = styled.div<{ $route: Routes }>`
  animation: 500ms cubic-bezier(0.4, 0.5, 0.2, 1) 0s 1 normal forwards running enter;
  background-color: var(--xmlfy-secondary);
  box-shadow:
    rgba(0, 0, 0, 0.15) 0px 0px 20px,
    rgba(0, 0, 0, 0.35) 0px 4px 30px;
  border-radius: 24px;
  display: grid;
  gap: 8px;
  grid-template-rows: min-content 1fr;
  height: max-content;
  height: ${(props) => {
    if (props.$route === ROUTE.settings) {
      return '100px'
    }
    return '100px'
  }};
  overflow: visible;
  padding: 16px;
  position: fixed;
  top: 25px;
  transition:
    width 300ms cubic-bezier(0.2, 0.3, 0.2, 1),
    height 300ms cubic-bezier(0.2, 0.4, 0.2, 1);
  z-index: 123456789;
  width: 224px;

  @keyframes enter {
    0% {
      right: -344px;
    }
    100% {
      right: 24px;
    }
  }
`

export const LogoContainer = styled.div`
  align-items: center;
  display: grid;
  justify-content: center;
`

export const Logo = styled.img`
  height: 32px;
  width: 32px;
`

export const RoutesContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  padding: 0;
  position: relative;
  width: 100%;
`
