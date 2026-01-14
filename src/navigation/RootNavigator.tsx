import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTheme } from '@ui/theme';
import { BrowseScreen } from '@ui/screens/BrowseScreen';
import { CareCalendarScreen } from '@ui/screens/CareCalendarScreen';
import { MyGardenScreen } from '@ui/screens/MyGardenScreen';
import { SettingsScreen } from '@ui/screens/SettingsScreen';
import { WishlistScreen } from '@ui/screens/WishlistScreen';
import { PlantDetailScreen } from '@ui/screens/PlantDetailScreen';
import { GardenPlantFormScreen } from '@ui/screens/GardenPlantFormScreen';

import { Routes, type RootStackParamList, type RootTabParamList } from './routes';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const RootTabs = (): React.ReactElement => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          height: theme.sizing.bottomNavHeight,
        },
        sceneContainerStyle: {
          paddingBottom: theme.sizing.bottomNavHeight,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily.body,
          fontSize: theme.typography.sizes.bodyM,
        },
        tabBarIcon: ({ focused, color }) => {
          const iconName =
            route.name === Routes.Browse
              ? focused
                ? 'search'
                : 'search-outline'
              : route.name === Routes.Calendar
                ? focused
                  ? 'calendar'
                  : 'calendar-outline'
                : route.name === Routes.Garden
                  ? focused
                    ? 'leaf'
                    : 'leaf-outline'
                  : route.name === Routes.Wishlist
                    ? focused
                      ? 'heart'
                      : 'heart-outline'
                    : focused
                      ? 'settings'
                      : 'settings-outline';

          return <Ionicons name={iconName} size={theme.sizing.iconSize} color={color} />;
        },
      })}
    >
      <Tab.Screen name={Routes.Browse} component={BrowseScreen} />
      <Tab.Screen name={Routes.Calendar} component={CareCalendarScreen} />
      <Tab.Screen name={Routes.Garden} component={MyGardenScreen} />
      <Tab.Screen name={Routes.Wishlist} component={WishlistScreen} />
      <Tab.Screen name={Routes.Settings} component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export const RootNavigator = (): React.ReactElement => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Routes.RootTabs} component={RootTabs} />
    <Stack.Screen name={Routes.PlantDetail} component={PlantDetailScreen} />
    <Stack.Screen name={Routes.GardenForm} component={GardenPlantFormScreen} />
  </Stack.Navigator>
);
