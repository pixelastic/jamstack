const indexing = require('algolia-indexing');
const readJson = require('firost/readJson');
const glob = require('firost/glob');
const consoleError = require('firost/consoleError');
const pMap = require('golgoth/pMap');
const config = require('../src/_data/config.js');
const _ = require('golgoth/lodash');

(async function () {
  const credentials = {
    appId: config.algolia.appId,
    apiKey: process.env.ALGOLIA_API_KEY,
    indexName: config.algolia.indexName,
  };
  const settings = {
    searchableAttributes: [
      'unordered(video.title)',
      'unordered(caption.content)',
      'unordered(playlist.title)',
    ],
    customRanking: [
      // 'desc(video.hasCaptions)',
      // 'desc(video.popularity.score)',
      // 'desc(video.hasManualCaptions)',
      // 'desc(video.publishedDate.day)',
      // 'desc(video.duration.minutes)',
      'asc(playlist.position)',
      'asc(caption.start)',
    ],
    attributesForFaceting: ['playlist.title', 'video.id', 'video.title'],
    attributesToSnippet: ['caption.content:8'],
    distinct: true,
    attributeForDistinct: 'video.id',
    advancedSyntax: true,
    // We manually disable typo on years
    disableTypoToleranceOnWords: _.times(60, (year) => `${1970 + year}`),
  };

  indexing.verbose();
  indexing.config({
    batchMaxSize: 100,
  });

  try {
    const files = await glob('./data/*/*.json');
    const records = _.flatten(await pMap(files, readJson));
    await indexing.fullAtomic(credentials, records, settings);
  } catch (err) {
    consoleError(err.message);
    process.exit(1);
  }
})();
