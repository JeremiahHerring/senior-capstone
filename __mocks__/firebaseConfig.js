// __mocks__/firebaseConfig.js
export const auth = {
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '12345', email: 'test@test.com' } })),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '12345', email: 'test@test.com' } })),
};

export const db = {
  collection: jest.fn(() => ({
    addDoc: jest.fn(() => Promise.resolve('User added to database')),
  })),
};
