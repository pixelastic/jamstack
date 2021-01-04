const config = require('./src/_data/config.js');

module.exports = {
  playlists: ['PL58Wk5g77lF-UQ39pejLX2Zn5DxQyExBa'],
  knownVideosWithoutCaptions: [],
  algoliaCredentials: {
    appId: config.algolia.appId,
    indexName: config.algolia.indexName,
  },
};
