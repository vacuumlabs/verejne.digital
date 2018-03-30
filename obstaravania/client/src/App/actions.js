import { PATH_BUTTON_TEXT } from './state'

export const toggleButtonText = () => ({
  type: 'Toggle button text',
  path: PATH_BUTTON_TEXT,
  reducer: (text) => (text === 'Hello' ? 'World!' : 'Hello'),
})
