import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import App from './App';
import { AboutPage } from './pages/AboutPage';
import { AboutSection } from './pages/AboutSection';
import { SettingsPage } from './pages/SettingsPage';
import overviewMd from './content/overview.md?raw';
import backgroundMd from './content/background.md?raw';
import architectureMd from './content/architecture.md?raw';
import techStackMd from './content/tech-stack.md?raw';
import futureMd from './content/future.md?raw';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview"      element={<AboutSection content={overviewMd} />} />
            <Route path="background"    element={<AboutSection content={backgroundMd} />} />
            <Route path="architecture"  element={<AboutSection content={architectureMd} />} />
            <Route path="tech-stack"    element={<AboutSection content={techStackMd} />} />
            <Route path="future"        element={<AboutSection content={futureMd} />} />
          </Route>
        </Routes>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
