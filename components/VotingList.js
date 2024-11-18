import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { app } from './firebaseConfig';
import { getDatabase, ref, push, onValue } from 'firebase/database';

const database = getDatabase(app);

export default function VotingList() {

  const [listings, setListings] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'listings/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setListings(Object.values(data));
      } else {
        setListings([]); // No items
      }
    })
  }, []);

  return (
    <View style={styles.container}>
      <Text>This is the list of added series and movies where you can vote them for watching.</Text>

      <FlatList
        data={listings}
        renderItem={({ item }) =>
          <View style={{ flexDirection: "row" }}>
            <Text>{item.Title}</Text>
          </View>
        }
      />
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