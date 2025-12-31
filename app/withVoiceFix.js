const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withVoiceFix(config) {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults;
    const app = manifest.manifest.application[0];

    // 1. Aseguramos que las herramientas 'tools' estén disponibles
    if (!manifest.manifest.$['xmlns:tools']) {
      manifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    // 2. CORRECCIÓN PRINCIPAL:
    // Definimos explícitamente quién es el "Jefe" (AndroidX)
    app.$['android:appComponentFactory'] = 'androidx.core.app.CoreComponentFactory';

    // Y le decimos a Android que use este valor ignorando a los demás
    if (app.$['tools:replace']) {
      if (!app.$['tools:replace'].includes('android:appComponentFactory')) {
        app.$['tools:replace'] += ',android:appComponentFactory';
      }
    } else {
      app.$['tools:replace'] = 'android:appComponentFactory';
    }

    // 3. Fix para android:exported (Seguridad Android 12+)
    const activities = app.activity || [];
    const services = app.service || [];
    const receivers = app.receiver || [];

    [...activities, ...services, ...receivers].forEach((item) => {
      if (typeof item.$['android:exported'] === 'undefined') {
        item.$['android:exported'] = 'true';
      }
    });

    return config;
  });
};