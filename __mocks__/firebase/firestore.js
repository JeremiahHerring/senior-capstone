export const getFirestore = jest.fn();
export const collection = jest.fn();
export const addDoc = jest.fn(() => Promise.resolve({ id: "123" }));
