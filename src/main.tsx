import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ClassProvider } from './contexts/ClassProvider';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ClassProvider>
            <App />
        </ClassProvider>
    </StrictMode>
);
