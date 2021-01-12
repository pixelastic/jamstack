const theme = require('norska/theme');
const { refinementList } = require('norska/frontend/algolia/widgets');
const numeral = require('numeral');
const prettyMs = require('pretty-ms');
// const lazyloadAttributes = require('norska/frontend/lazyload/attributes');

(async () => {
  await theme.init({
    searchParameters: {
      facetingAfterDistinct: true,
    },
    widgets: [
      {
        type: refinementList,
        options: {
          container: '#tags',
          attribute: 'playlist.title',
          sortBy: ['count:desc', 'name:asc'],
        },
      },
    ],
    transforms: {
      displayDuration(item) {
        console.info(item.video.duration);
        return prettyMs(item.video.duration * 1000);
      },
      displayViews(item) {
        return numeral(item.video.ranking.views).format('Oa');
      },
    },
  });
})();
