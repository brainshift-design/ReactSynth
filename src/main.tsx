import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { NodeProvider } from './nodes/NodeContext.tsx';
import { AudioOutputProvider } from './audio/AudioOutputContext.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AudioOutputProvider>
            <NodeProvider>
                <App />
            </NodeProvider>
        </AudioOutputProvider>
    </StrictMode>
);
