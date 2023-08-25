const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const isEscapeKey = (evt) => evt.key === 'Escape';

export {getRandomArrayElement, isEscapeKey};
