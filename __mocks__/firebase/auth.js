export const getAuth = jest.fn(() => ({
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({
    user: { email: "testuser@example.com" }
  }))
}));
