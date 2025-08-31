// Mock Firebase implementation for development
// This avoids Firebase dependency issues while allowing the app to function

interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface MockAuth {
  currentUser: MockUser | null;
  onAuthStateChanged: (callback: (user: MockUser | null) => void) => () => void;
  signInWithPopup: (provider: any) => Promise<{ user: MockUser }>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string>;
}

// Create mock user data
const mockUsers: MockUser[] = [
  {
    uid: 'mock-user-1',
    email: 'user@example.com',
    displayName: 'Test User',
    photoURL: 'https://via.placeholder.com/40'
  },
  {
    uid: 'mock-admin-1',
    email: 'admin@example.com',
    displayName: 'Admin User',
    photoURL: 'https://via.placeholder.com/40'
  }
];

let currentUser: MockUser | null = null;
let authStateCallbacks: ((user: MockUser | null) => void)[] = [];

const mockAuth: MockAuth = {
  currentUser,
  
  onAuthStateChanged: (callback) => {
    authStateCallbacks.push(callback);
    // Immediately call with current state
    callback(currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = authStateCallbacks.indexOf(callback);
      if (index > -1) {
        authStateCallbacks.splice(index, 1);
      }
    };
  },
  
  signInWithPopup: async (provider) => {
    // Simulate sign in with first mock user
    currentUser = mockUsers[0];
    mockAuth.currentUser = currentUser;
    
    // Notify all listeners
    authStateCallbacks.forEach(callback => callback(currentUser));
    
    return { user: currentUser };
  },
  
  signOut: async () => {
    currentUser = null;
    mockAuth.currentUser = null;
    
    // Notify all listeners
    authStateCallbacks.forEach(callback => callback(null));
  },
  
  getIdToken: async () => {
    if (!currentUser) {
      throw new Error('No user signed in');
    }
    return `mock-token-${currentUser.uid}`;
  }
};

console.log('🔧 Using mock Firebase authentication for development');

export const auth = mockAuth as any;
