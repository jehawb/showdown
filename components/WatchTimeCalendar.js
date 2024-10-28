import { StyleSheet, Text, View } from 'react-native';

export default function WatchTimeCalendar() {
  return (
    <View style={styles.container}>
      <Text>This is a calendar for marking down potential watch times.</Text>
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