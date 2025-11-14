import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';

import type { FirebaseUserProfile } from '../../utils/types';
import { auth } from '../../services/firebase';

const mapFirebaseUser = (user: User): FirebaseUserProfile => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
});

export const signUpWithEmail = createAsyncThunk(
  'auth/signUp',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      return mapFirebaseUser(user);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const signInWithEmail = createAsyncThunk(
  'auth/signIn',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
      return mapFirebaseUser(user);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const signOutUser = createAsyncThunk('auth/signOut', async () => {
  await signOut(auth);
});

export const sendPasswordReset = createAsyncThunk(
  'auth/resetPassword',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return email;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

interface AuthState {
  user: FirebaseUserProfile | null;
  loading: boolean;
  error: string | null;
  passwordResetEmail?: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  passwordResetEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<FirebaseUserProfile | null>) => {
      state.user = action.payload;
    },
    clearAuthError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signUpWithEmail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signInWithEmail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signOutUser.fulfilled, state => {
        state.user = null;
        state.error = null;
      })
      .addCase(sendPasswordReset.pending, state => {
        state.loading = true;
        state.error = null;
        state.passwordResetEmail = null;
      })
      .addCase(sendPasswordReset.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetEmail = action.payload as string;
      })
      .addCase(sendPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAuthUser, clearAuthError } = authSlice.actions;

export default authSlice.reducer;

