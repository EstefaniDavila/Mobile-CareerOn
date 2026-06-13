import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { MascotaProvider } from './src/components/mascota/MascotaProvider';
import MascotaIcon from './src/components/mascota/MascotaIcon';

export default function App() {
  return (
    <MascotaProvider>
      <View style={{ flex: 1 }}>
        <AppNavigator />
        <MascotaIcon />
        <StatusBar style="light" />
      </View>
    </MascotaProvider>
  );
}