const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withVoiceFix(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    
    // 1. Aseguramos manualmente que las herramientas 'tools' estén disponibles en la etiqueta raíz
    if (!androidManifest.manifest.$) {
        androidManifest.manifest.$ = {};
    }
    if (!androidManifest.manifest.$['xmlns:tools']) {
      androidManifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    const mainApplication = androidManifest.manifest.application[0];

    // 2. DEFINIMOS EL VALOR PRIMERO (Lo que faltó la vez pasada)
    // Escribimos explícitamente el valor que queremos que tenga
    mainApplication.$['android:appComponentFactory'] = 'androidx.core.app.CoreComponentFactory';

    // 3. AGREGAMOS LA REGLA DE REEMPLAZO MANUALMENTE
    // Obtenemos lo que ya haya en tools:replace
    let currentReplace = mainApplication.$['tools:replace'] || '';
    
    // Convertimos a array para verificar si ya existe
    let replaceList = currentReplace.split(',').map(s => s.trim()).filter(Boolean);
    
    if (!replaceList.includes('android:appComponentFactory')) {
        replaceList.push('android:appComponentFactory');
    }
    
    // Lo guardamos de nuevo unido por comas
    mainApplication.$['tools:replace'] = replaceList.join(',');

    // 4. Fix para android:exported (Seguridad Android 12+)
    const itemsToFix = [
      ...(mainApplication.activity || []),
      ...(mainApplication.service || []),
      ...(mainApplication.receiver || [])
    ];

    itemsToFix.forEach((item) => {
      if (item.$ && typeof item.$['android:exported'] === 'undefined') {
        item.$['android:exported'] = 'true';
      }
    });

    return config;
  });
};