import type { CapacitorConfig } from '@anthropic/capacitor-cli';

const config: CapacitorConfig = {
  appId: 'de.saschabecker.gravityroll',
  appName: 'Gravity Roll',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0c10'
    },
    ScreenOrientation: {
      defaultOrientation: 'portrait'
    },
    Haptics: {}
  },
  android: {
    backgroundColor: '#0a0c10',
    allowMixedContent: false,
    overScrollMode: 'never'
  }
};

export default config;
