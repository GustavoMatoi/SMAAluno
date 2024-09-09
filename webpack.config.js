const { withExpo } = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await withExpo(env, argv);

  // Adiciona o polyfill para o módulo 'crypto'
  config.resolve.fallback = {
    crypto: require.resolve('crypto-browserify'),
    // Adicione outros polyfills, se necessário
  };

  return config;
};
