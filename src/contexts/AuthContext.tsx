import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterData, AuthContextType } from '../types/auth';
import { api, clearToken, loadStoredToken } from '../services/api';

const AUTH_STORAGE_KEY = 'tijaniyah_auth_user';
const USERS_STORAGE_KEY = 'tijaniyah_users_data';

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_GUEST'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isGuest: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
        error: null,
      };
    case 'SET_GUEST':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isGuest: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Load user from storage on app start
  useEffect(() => {
    const initializeApp = async () => {
      await loadStoredToken();
      await loadStoredUser();
    };
    initializeApp();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const storeUser = (user: User) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user:', error);
    }
  };

  const removeStoredUser = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing stored user:', error);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Try backend authentication first
      try {
        const response = await api.login(credentials.email, credentials.password);
        console.log('✅ Backend authentication successful');
        
        // If backend login successful, fetch user profile or create user object
        const user: User = {
          id: response.user?.id || Date.now().toString(),
          email: credentials.email.toLowerCase(),
          name: response.user?.name || credentials.email.split('@')[0],
          role: response.user?.role || 'user',
          preferences: {
            prayerMethod: 'MWL',
            language: 'en',
            notifications: true,
          },
          createdAt: response.user?.createdAt || new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        storeUser(user);
        dispatch({ type: 'SET_USER', payload: user });
        return;
      } catch (backendError: any) {
        console.log('⚠️ Backend authentication failed:', backendError.message);
        
        // Fallback to local storage for demo accounts
        const users = getStoredUsers();
        const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());

        if (!user) {
          throw new Error('User not found. Please check your email or register.');
        }

        // Special handling for demo accounts
        if (user.email === 'demo@tijaniyah.com' && credentials.password !== 'demo123') {
          throw new Error('Invalid password for demo account. Use: demo123');
        }

        if (user.email === 'admin@tijaniyahpro.com' && credentials.password !== 'admin123') {
          throw new Error('Invalid password for admin account. Use: admin123');
        }

        if (user.email === 'moderator@tijaniyahpro.com' && credentials.password !== 'moderator123') {
          throw new Error('Invalid password for moderator account. Use: moderator123');
        }

        // Update last login
        const updatedUser = {
          ...user,
          lastLogin: new Date().toISOString(),
        };

        storeUser(updatedUser);
        dispatch({ type: 'SET_USER', payload: updatedUser });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Validation
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Try backend registration first
      try {
        await api.signup(data.email, data.password, data.name);
        console.log('✅ Backend account created successfully');
        
        // Login after registration
        const response = await api.login(data.email, data.password);
        
        const newUser: User = {
          id: response.user?.id || Date.now().toString(),
          email: data.email.toLowerCase(),
          name: data.name.trim(),
          phone: data.phone?.trim(),
          profilePicture: data.profilePicture,
          role: 'user',
          location: data.location,
          preferences: {
            prayerMethod: 'MWL',
            language: 'en',
            notifications: true,
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        storeUser(newUser);
        dispatch({ type: 'SET_USER', payload: newUser });
        return;
      } catch (backendError: any) {
        console.log('⚠️ Backend registration failed:', backendError.message);
        
        // Fallback to local storage
        const users = getStoredUsers();
        const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
        if (existingUser) {
          throw new Error('An account with this email already exists');
        }

        const newUser: User = {
          id: Date.now().toString(),
          email: data.email.toLowerCase(),
          name: data.name.trim(),
          phone: data.phone?.trim(),
          profilePicture: data.profilePicture,
          role: 'user',
          location: data.location,
          preferences: {
            prayerMethod: 'MWL',
            language: 'en',
            notifications: true,
          },
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
        storeUser(newUser);
        dispatch({ type: 'SET_USER', payload: newUser });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Registration failed' });
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      removeStoredUser();
      await clearToken();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const continueAsGuest = () => {
    dispatch({ type: 'SET_GUEST', payload: true });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const updatedUser = { ...authState.user, ...updates };
      storeUser(updatedUser);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Update failed' });
    }
  };

  const resetPassword = async (email: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // In a real app, this would call the backend API
      console.log('Password reset requested for:', email);
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Password reset failed' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const isAdmin = (): boolean => {
    return authState.user?.role === 'admin' || authState.user?.role === 'super_admin';
  };

  const isSuperAdmin = (): boolean => {
    return authState.user?.role === 'super_admin';
  };

  const isModerator = (): boolean => {
    return authState.user?.role === 'moderator' || isAdmin();
  };

  const getUserRole = (): string => {
    return authState.user?.role || 'user';
  };

  const getStoredUsers = (): User[] => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
      console.error('Error loading stored users:', error);
      return [];
    }
  };

  const value: AuthContextType = {
    authState,
    login,
    register,
    logout,
    continueAsGuest,
    updateProfile,
    resetPassword,
    clearError,
    isAdmin,
    isSuperAdmin,
    isModerator,
    getUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

