export const getXMLfyElement = (): HTMLElement => document.querySelector('xmlfy-element')

export const injectGlobalStyles = () => {
  const styleId = 'xmlfy-global-styles'

  // Check if the styles are already injected
  if (document.getElementById(styleId)) {
    return
  }

  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
    @keyframes xmlfy-animation {
      0% {
        background: #2f2f2f;
        opacity: 0.8;
      }
      50% {
        background: #4b4b4b;
        opacity: 0.5;
      }
      100% {
        background: #2f2f2f;
        opacity: 0.8;
      }
    }
  `

  document.head.appendChild(style)
}
