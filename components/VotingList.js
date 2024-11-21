import { StyleSheet, View, FlatList, Image } from 'react-native';
import { Button, Card, Text, IconButton, Snackbar, Icon } from "react-native-paper";
import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { app } from './firebaseConfig';
import { getDatabase, ref, push, onValue } from 'firebase/database';

const database = getDatabase(app);

export default function VotingList() {

  const [listings, setListings] = useState([]);

  // useEffect(() => {
  //   const itemsRef = ref(database, 'listings/');
  //   onValue(itemsRef, (snapshot) => {
  //     const data = snapshot.val();
  //     if (data) {
  //       setListings(Object.values(data));
  //     } else {
  //       setListings([]); // No items
  //     }
  //   })
  // }, []);

  useEffect(() => {
    onValue(ref(database, 'listings/'), (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const keys = Object.keys(data);
        // Combine keys with data 
        const dataWithKeys = Object.values(data).map((obj, index) => {
          return { ...obj, key: keys[index] }
        });
        setListings(dataWithKeys);
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

  const handleLike = async (item) => {
    console.log(item.key);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        renderItem={({ item }) =>
          <Card style={{ marginTop: 15, width: '95%' }}>
            <Card.Title
              title={item.Title}
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
              </View>
            </Card.Content>
            <Card.Actions>
              <IconButton icon="web" onPress={() => handleBrowse(item.imdbID)} />
              {/* If likes array even exists is checked first */}
              {item.likes && item.likes.includes("USERNAME") ?
                <IconButton icon="thumb-up" iconColor='orange' onPress={() => handleLike(item)} />
                :
                <IconButton icon="thumb-up-outline" onPress={() => handleLike(item)} />}
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