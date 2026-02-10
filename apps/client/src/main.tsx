import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import App from './App.tsx';
import './index.css';
import { config } from './wagmi.config.ts';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Theme appearance='inherit' accentColor='indigo'>
          <App />
        </Theme>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
