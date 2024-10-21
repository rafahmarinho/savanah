import { registerUser, loginUser } from '../pages/api/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
}));

describe('Auth Functions', () => {
  it('should register a user', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: { uid: '123' } });
    
    const user = await registerUser(email, password);
    expect(user).toHaveProperty('uid');
  });

  it('should login a user', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: { uid: '123' } });
    
    const user = await loginUser(email, password);
    expect(user).toHaveProperty('uid');
  });
});
