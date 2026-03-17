import type { CapacitorConfig } from '@anthropic/capacitor-cli';

const config: CapacitorConfig = {
  appId: 'de.saschabecker.gravityroll',
  appName: 'Gravity Roll',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  android: {
    backgroundColor: '#0d1117',
    allowMixedContent: false,
    overScrollMode: 'never'
  }
};

export default config;
