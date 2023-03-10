// main.tsx
import { createRoot } from 'noact-dom/client'

const element = (
  <div className="blue">
    hello world <span>Laffey</span>
  </div>
)

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(element)
