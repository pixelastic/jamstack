const theme = require('norska/theme');
const { refinementList } = require('norska/frontend/algolia/widgets');
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
      // preview(item) {
      //   const previewUrl = item.picture.preview;
      //   const options = { width: 600, placeholder: { width: 200 } };
      //   return lazyloadAttributes(previewUrl, options);
      // },
    },
  });
})();
