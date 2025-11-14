import React, { useEffect } from 'react';
import { LogBox, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { PaperProvider } from 'react-native-paper';
import { onAuthStateChanged } from 'firebase/auth';

import AppNavigator from './src/navigation/AppNavigator';
import { store, persistor } from './src/redux/store';
import { STRIPE_PUBLISHABLE_KEY } from './src/config/stripeConfig';
import { setAuthUser } from './src/redux/slices/authSlice';
import { auth } from './src/services/firebase';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function App(): React.JSX.Element {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        store.dispatch(
          setAuthUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          }),
        );
      } else {
        store.dispatch(setAuthUser(null));
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
          <PaperProvider>
            <SafeAreaProvider>
              <StatusBar barStyle="dark-content" />
              <AppNavigator />
            </SafeAreaProvider>
          </PaperProvider>
        </StripeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
