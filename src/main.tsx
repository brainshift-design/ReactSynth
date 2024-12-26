import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { NodeProvider } from './nodes/NodeContext.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <NodeProvider>
            <App />
        </NodeProvider>
    </StrictMode>
);
