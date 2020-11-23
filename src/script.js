const algolia = require('norska/frontend/algolia');
const lazyload = require('norska/frontend/lazyload');

const { searchBox, hits } = require('norska/frontend/algolia/widgets');
const transforms = require('./_scripts/transforms.js');
const algoliaCredentials = window.CONFIG.algolia;

const widgets = [
  /**
   * Searchbar
   **/
  {
    type: searchBox,
    options: {
      container: '#searchbox',
      placeholder: 'Search for content',
      autofocus: true,
      showReset: false,
      showSubmit: false,
      showLoadingIndicator: false,
    },
  },
  /**
   * Hits
   **/
  {
    type: hits,
    options: {
      container: '#hits',
      templates: {
        item: document.getElementById('hitTemplate').value,
        empty: document.getElementById('emptyTemplate').value,
      },
    },
  },
];

algolia
  .init(algoliaCredentials)
  .setWidgets(widgets)
  .setTransforms(transforms)
  // .onDisplay(hit => {
  //   console.info(hit.picture);
  // })
  .start();

lazyload.init();
