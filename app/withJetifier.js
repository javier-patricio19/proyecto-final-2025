const { withGradleProperties } = require('@expo/config-plugins');

module.exports = function withJetifier(config) {
  return withGradleProperties(config, (config) => {
    // 1. Buscamos si ya existen y las borramos para evitar duplicados
    config.modResults = config.modResults.filter(
      item => item.key !== 'android.useAndroidX' && item.key !== 'android.enableJetifier'
    );

    // 2. Las agregamos con el valor TRUE forzado
    config.modResults.push(
      { type: 'property', key: 'android.useAndroidX', value: 'true' },
      { type: 'property', key: 'android.enableJetifier', value: 'true' }
    );

    return config;
  });
};