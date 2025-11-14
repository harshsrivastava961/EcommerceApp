import React from 'react';
import { NavigationContainer, type RouteProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAppSelector } from '../redux/hooks';
import type { RootState } from '../redux/store';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import OrderSuccessScreen from '../screens/checkout/OrderSuccessScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { COLORS } from '../utils/constants';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { productId: number };
};

export type TabParamList = {
  Shop: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string };
};

const AuthStack = createStackNavigator<AuthStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={{ title: 'Product Details' }}
    />
  </HomeStack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({
      route,
    }: {
      route: RouteProp<TabParamList, keyof TabParamList>;
    }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarIcon: ({ color, size }: { color: string; size: number }) => {
        let iconName = 'home';
        if (route.name === 'Cart') {
          iconName = 'cart';
        } else if (route.name === 'Profile') {
          iconName = 'account';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Shop" component={HomeStackNavigator} />
    <Tab.Screen name="Cart" component={CartScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Signup" component={SignupScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

const RootNavigator = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <RootStack.Screen name="Main" component={TabNavigator} />
            <RootStack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen
              name="OrderSuccess"
              component={OrderSuccessScreen}
            />
          </>
        ) : (
          <RootStack.Screen name="Main" component={AuthStackNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const AppNavigator = () => <RootNavigator />;

export default AppNavigator;

