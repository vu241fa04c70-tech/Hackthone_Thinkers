import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LanguageProvider } from './localization/LanguageContext.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#0B1D12',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#1B4332',
            padding: '32px',
            borderRadius: '24px',
            maxWidth: '650px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            textAlign: 'left'
          }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>🌾 కిసాన్ మిత్ర (Kisan Mitra)</h2>
            <p style={{ fontSize: '13px', color: '#4B5563', marginBottom: '16px', textAlign: 'center' }}>
              Error: {this.state.error?.message || String(this.state.error)}
            </p>
            <pre style={{
              background: '#F3F4F6',
              color: '#DC2626',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '11px',
              overflowX: 'auto',
              maxHeight: '180px',
              marginBottom: '16px'
            }}>
              {this.state.error?.stack || 'No stack trace available'}
            </pre>
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                style={{
                  background: '#2D6A4F',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                🔄 క్లియర్ & రీలోడ్ చేయండి (Reset & Reload App)
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

