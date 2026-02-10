import { config } from './wagmi.config';

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
