import { createRoot } from 'react-dom/client';
import './styles/style.css';
import App from './App';

const container = document.querySelector('#app');
const root = createRoot(container);

root.render(<App />);