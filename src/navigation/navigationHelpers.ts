import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList, RootTabParamList } from './routes';

export const useRootNavigation = (): NativeStackNavigationProp<RootStackParamList> =>
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();

export const useTabNavigation = (): BottomTabNavigationProp<RootTabParamList> =>
  useNavigation<BottomTabNavigationProp<RootTabParamList>>();
