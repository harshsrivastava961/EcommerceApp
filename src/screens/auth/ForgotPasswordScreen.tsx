import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  clearAuthError,
  sendPasswordReset,
} from '../../redux/slices/authSlice';
import { COLORS } from '../../utils/constants';
import type { AuthStackParamList } from '../../navigation/AppNavigator';

type ForgotPasswordNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const dispatch = useAppDispatch();
  const { loading, error, passwordResetEmail } = useAppSelector(
    state => state.auth,
  );

  const [email, setEmail] = useState('');

  useEffect(
    () => () => {
      dispatch(clearAuthError());
    },
    [dispatch],
  );

  const handleReset = () => {
    dispatch(sendPasswordReset({ email }));
  };

  useEffect(() => {
    if (passwordResetEmail) {
      navigation.navigate('Login');
    }
  }, [navigation, passwordResetEmail]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>
          Reset Password
        </Text>
        <TextInput
          label="Email"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          style={styles.input}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          mode="contained"
          onPress={handleReset}
          loading={loading}
          style={styles.primaryButton}
        >
          Send Reset Email
        </Button>
        <Button onPress={() => navigation.navigate('Login')}>
          Back to Login
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
    justifyContent: 'center',
  },
  content: {
    gap: 16,
  },
  title: {
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
  },
  primaryButton: {
    marginTop: 8,
  },
  errorText: {
    color: COLORS.danger,
  },
});

export default ForgotPasswordScreen;

