module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      polyfills: [
        'es.promise',
        'es.symbol'
      ],
  
    }]
  ],
  plugins: ["@babel/plugin-proposal-nullish-coalescing-operator"]
};
