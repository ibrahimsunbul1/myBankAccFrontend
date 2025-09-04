import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { userAPI, authAPI } from '../services/api';

// Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  balance: 0,
  accounts: [],
};

// Action Types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  SET_BALANCE: 'SET_BALANCE',
  SET_ACCOUNTS: 'SET_ACCOUNTS',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ActionTypes.SET_USER:
      console.log('Reducer SET_USER called with payload:', action.payload);
      const newState = {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null,
      };
      console.log('New state after SET_USER:', newState);
      return newState;
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };
    case ActionTypes.SET_BALANCE:
      return {
        ...state,
        balance: action.payload,
      };
    case ActionTypes.SET_ACCOUNTS:
      return {
        ...state,
        accounts: action.payload,
      };
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};


const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  
  // Test console log - bu görünmeli
  console.log('UserProvider loaded - Console çalışıyor!', new Date().toLocaleTimeString());


  const login = async (credentials) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      dispatch({ type: ActionTypes.CLEAR_ERROR });
      
      console.log('Login attempt with credentials:', credentials);
      const response = await authAPI.login(credentials);
      console.log('Login response:', response);
      
      if (response && response.user) {
        console.log('Login successful with session-based auth');
        console.log('Response user:', response.user);
        
        // Session-based auth için sadece user data'yı localStorage'a kaydet
        localStorage.setItem('userData', JSON.stringify(response.user));
        
        dispatch({ type: ActionTypes.SET_USER, payload: response.user });
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        console.log('User state updated, dispatched SET_USER with payload:', response.user);
        
        return { success: true };
      } else {
        console.log('Login failed - no user in response');
        const errorMessage = response?.message || 'Giriş başarısız. Kullanıcı adı veya şifre hatalı.';
        dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.log('Login error:', error);
      const errorMessage = error.message || 'Bağlantı hatası. Lütfen tekrar deneyin.';
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('userData');
    authAPI.logout();
    dispatch({ type: ActionTypes.LOGOUT });
  };

  const loadUserData = async () => {
    try {
   
      const balanceResponse = await userAPI.getBalance();
      dispatch({ type: ActionTypes.SET_BALANCE, payload: balanceResponse.balance });
      
    
      const accountsResponse = await userAPI.getAccounts();
      dispatch({ type: ActionTypes.SET_ACCOUNTS, payload: accountsResponse.accounts });
      
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const updateBalance = (newBalance) => {
    dispatch({ type: ActionTypes.SET_BALANCE, payload: newBalance });
  };

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

 
  useEffect(() => {
    const initializeAuth = () => {
    try {
      const userData = localStorage.getItem('userData');
      
      console.log('InitializeAuth - userData:', userData);
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('InitializeAuth - parsed user:', parsedUser);
        dispatch({ type: ActionTypes.SET_USER, payload: parsedUser });
      } else {
        console.log('InitializeAuth - no user data found');
      }
    } catch (error) {
      console.error('InitializeAuth error:', error);
      localStorage.removeItem('userData');
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

    initializeAuth();
  }, []);

  const value = {
    ...state,
    login,
    logout,
    loadUserData,
    updateBalance,
    clearError,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;