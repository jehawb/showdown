import { StyleSheet, View, FlatList, Image } from 'react-native';
import { Button, Card, Text, IconButton, Snackbar, Icon } from "react-native-paper";
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

  const handleBrowse = async (imdbID) => {
    try {
      let result = await WebBrowser.openBrowserAsync(`https://www.imdb.com/title/${imdbID}/`);
    } catch (error) {
      console.error('Error occurred while opening the browser:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text>This is the list of added series and movies where you can vote them for watching.</Text>

      <FlatList
        data={listings}
        renderItem={({ item }) =>
          <Card style={{ marginTop: 15, width: '95%' }}>
          <Card.Title
            title={item.Title}
            subtitle={item.Year}
            titleVariant="titleLarge"
          />
          <Card.Content style={{ flexDirection: 'column', alignItems: "flex-start" }}>
            <View style={{ flexDirection: 'row', alignItems: "flex-start" }}>
              <Image
                source={{ uri: item.Poster }}
                style={{
                  width: 150,
                  height: 250,
                  resizeMode: 'contain',
                  marginRight: 15
                }}
              />
              <Text variant="bodyMedium"
                numberOfLines={15}
                ellipsizeMode="tail"
                style={{ flex: 1 }}>{item.Plot}
              </Text>
            </View>
            <Text>Runtime: {item.Runtime}</Text>
            {item.totalSeasons ? <Text>Seasons: {item.totalSeasons}</Text>: null}
            <Text>IMDB rating: {item.imdbRating}</Text>
            <Text>Metacritic score: {item.Metascore}</Text>
          </Card.Content>
          <Card.Actions>
            <IconButton icon="web" onPress={() => handleBrowse(item.imdbID)} />
            {/* <IconButton icon="plus" onPress={() => handleToAddList()} /> */}
          </Card.Actions>
        </Card>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 120,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});