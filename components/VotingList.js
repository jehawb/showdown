import { StyleSheet, Text, View } from 'react-native';

export default function VotingList() {
  return (
    <View style={styles.container}>
      <Text>This is the list of added series and movies where you can vote them for watching.</Text>
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