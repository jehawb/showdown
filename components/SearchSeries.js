import { StyleSheet, Text, View } from 'react-native';

export default function SearchSeries() {
  return (
    <View style={styles.container}>
      <Text>Here you can search for series or movies to watch and add them to the list.</Text>
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