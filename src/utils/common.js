const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const isEscapeKey = (evt) => evt.key === 'Escape';

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

function debounce (callback, timeoutDelay = 1000) {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}

export {getRandomArrayElement, isEscapeKey, updateItem, debounce};
