import { StyleSheet, View, FlatList, Image } from 'react-native';
import { Portal, Modal, Button, Card, Text, IconButton, Snackbar, Icon, PaperProvider } from "react-native-paper";
import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { app } from './firebaseConfig';
import { getDatabase, ref, remove, update, set, onValue } from 'firebase/database';

const database = getDatabase(app);

export default function VotingList() {

  const [listings, setListings] = useState([]);

  // TODO: Setup user profiles
  const username = "USERNAME";

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

  const handleLike = async (listing) => {
    let updatedListing = { ...listing };

    if (listing.likes && listing.likes.includes(username)) {

      delete updatedListing.key;
      updatedListing.likes = updatedListing.likes.filter(name => name != username);
      update(ref(database, `listings/${listing.key}`), updatedListing);

      // console.log("Removed key and USERNAME", updatedListing);
    } else {

      // Firebase likes to delete empty arrays.
      if (!updatedListing.likes) {
        updatedListing.likes = [];
      }

      updatedListing.likes.push(username);  // push() returns the length of the array not the array itself :(
      update(ref(database, `listings/${listing.key}`), updatedListing);

      // console.log("Added USERNAME", updatedListing);
    }
  }

  // TODO: Add a confirmation here, react paper native dialog for example.
  const deleteListing = (key) => {
    remove(ref(database, `listings/${key}`));
  }

  // TODO: Swich View tags to PaperProvider
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
              <IconButton icon="trash-can-outline" iconColor="DeepPink" onPress={() => deleteListing(item.key)} />
              <IconButton icon="web" onPress={() => handleBrowse(item.imdbID)} />
              {/* If likes array even exists is checked first */}
              {
                item.likes && item.likes.includes(username)
                  ?
                  <>
                    <IconButton icon="thumb-up" iconColor="orange" onPress={() => handleLike(item)} />
                    <Text>{item.likes.length}</Text>
                  </>
                  :
                  <>
                    <IconButton icon="thumb-up-outline" onPress={() => handleLike(item)} />
                    {item.likes ? <Text>{item.likes.length}</Text> : <Text>0</Text>}
                  </>
              }
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