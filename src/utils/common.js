const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const isEscapeKey = (evt) => evt.key === 'Escape';

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

export {getRandomArrayElement, isEscapeKey, updateItem};
