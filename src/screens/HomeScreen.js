import { StyleSheet, Text, View, Image } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: "https://res.cloudinary.com/dpuu7ddmk/image/upload/f_auto,q_auto/v1/WhatsApp_Image_2026-05-15_at_07.33.47_f5iq9x" }} 
        style={{ width: 250, height: 250, resizeMode: 'contain', marginBottom: 20 }} 
      />
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1C1C1C' }}>CarrerOn</Text>
      <Text style={{ fontSize: 16, color: '#5F6368', marginTop: 10 }}>Tu Copiloto de Empleabilidad</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
