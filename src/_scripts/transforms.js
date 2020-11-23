module.exports = {
  raw(item) {
    const raw = JSON.stringify(item, null, 4);
    console.info(raw);
    return raw;
  },
};
