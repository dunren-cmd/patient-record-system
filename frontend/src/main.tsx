import ReactDOM from 'react-dom/client'
import App from './App'
import './style.css'

const rootElement = document.getElementById('app');
console.log('Root element:', rootElement);

if (!rootElement) {
    console.error('Root element not found!');
} else {
    console.log('Rendering React app...');
    ReactDOM.createRoot(rootElement).render(<App />);
    console.log('React app rendered');
}
