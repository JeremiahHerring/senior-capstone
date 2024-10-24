import '@testing-library/jest-dom';
global.structuredClone = (value) => {
  return JSON.parse(JSON.stringify(value));
};