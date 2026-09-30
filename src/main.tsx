import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { appStore } from './store';
import './ui/global.css';

void appStore.getState().init();
createRoot(document.getElementById('root') as HTMLElement).render(<App />);
