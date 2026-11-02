import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dimenuous.lastabiders',
  appName: 'DIMENUOUS: The Last Abiders',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#05020c',
    allowMixedContent: false,
  },
};

export default config;
