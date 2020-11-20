const youtinx = require('youtinx');
const onEach = require('../lib/onEach.js');

(async () => {
  const playlistId = 'PL58Wk5g77lF-UQ39pejLX2Zn5DxQyExBa';
  await youtinx.run(playlistId, { onEach });
})();
