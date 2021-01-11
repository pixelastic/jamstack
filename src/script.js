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
        return prettyMs(item.video.duration * 1000, { colonNotation: true });
      },
      displayViews(item) {
        return numeral(item.ranking.views).format('Oa');
      },
      // preview(item) {
      //   const previewUrl = item.picture.preview;
      //   const options = { width: 600, placeholder: { width: 200 } };
      //   return lazyloadAttributes(previewUrl, options);
      // },
    },
  });
})();
