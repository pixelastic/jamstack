const config = require('./src/_data/config.js');
const _ = require('golgoth/lodash');

module.exports = {
  playlists: ['PL58Wk5g77lF-UQ39pejLX2Zn5DxQyExBa'],
  knownVideosWithoutCaptions: [],
  algoliaCredentials: {
    appId: config.algolia.appId,
    indexName: config.algolia.indexName,
    settings: {
      // We manually disable typo on years
      disableTypoToleranceOnWords: _.times(60, (year) => `${1970 + year}`),
    },
  },
};
