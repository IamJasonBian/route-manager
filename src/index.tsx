import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from "./App";
import { SelectedRoutesProvider } from './context/SelectedRoutesContext';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <SelectedRoutesProvider>
      <App />
    </SelectedRoutesProvider>
  </React.StrictMode>
);