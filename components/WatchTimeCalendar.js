import { StyleSheet, View, FlatList, Image } from 'react-native';
import { Portal, Modal, Button, Card, Text, IconButton, Snackbar, Icon, PaperProvider } from "react-native-paper";
import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { app } from './firebaseConfig';
import { getDatabase, ref, remove, update, set, onValue } from 'firebase/database';

const database = getDatabase(app);

export default function WatchTimeCalendar() {

  const [dates, setDates] = useState([]);

  // TODO: Setup user profiles
  const username = "USERNAME";

  useEffect(() => {
    onValue(ref(database, 'dates/'), (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const keys = Object.keys(data);
        // Combine keys with data 
        const dataWithKeys = Object.values(data).map((obj, index) => {
          return { ...obj, key: keys[index] }
        });
        setDates(dataWithKeys);
      } else {
        setDates([]); // No items
      }
    })
  }, []);

  const handleLike = async (date) => {
    let updatedDate = { ...date };

    // Remove key and add possibly missing arrays
    delete updatedDate.key;
    if (!updatedDate.likes) {
      updatedDate.likes = [];
    }
    if (!updatedDate.dislikes) {
      updatedDate.dislikes = []
    }

    if (!date.likes.includes(username)) {

      updatedDate.likes.push(username);

      if (updatedDate.dislikes.includes(username)) {
        updatedDate.dislikes = updatedDate.dislikes.filter(name => name != username);
      }

      update(ref(database, `dates/${date.key}`), updatedDate);

    }
  }

  const handleDislike = async (date) => {
    let updatedDate = { ...date };

    // Remove key and add possibly missing arrays
    delete updatedDate.key;
    if (!updatedDate.likes) {
      updatedDate.likes = [];
    }
    if (!updatedDate.dislikes) {
      updatedDate.dislikes = []
    }

    if (!date.dislikes.includes(username)) {

      updatedDate.dislikes.push(username);

      if (updatedDate.likes.includes(username)) {
        updatedDate.likes = updatedDate.likes.filter(name => name != username);
      }

      update(ref(database, `dates/${date.key}`), updatedDate);

    }
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={dates}
        renderItem={({ item }) =>
          <Card style={{ marginTop: 15, width: '95%' }}>
            <Card.Title
              title={item.date}
              titleVariant="titleLarge"
            />
            <Card.Content style={{ flexDirection: 'column', alignItems: "flex-start" }}>
              <View style={{ flexDirection: 'row', alignItems: "flex-start" }}>
                <Text>?????</Text>
              </View>
            </Card.Content>
            <Card.Actions>
              {/* <IconButton icon="trash-can-outline" iconColor="red" onPress={() => deleteListing(item.key)} /> */}

              {item.dislikes && item.dislikes.includes(username)
                ?
                <IconButton icon="thumb-down" iconColor="red" onPress={() => handleDislike(item)} />
                :
                <IconButton icon="thumb-down-outline" onPress={() => handleDislike(item)} />}

              {item.likes && item.likes.includes(username)
                ?
                <IconButton icon="thumb-up" iconColor="orange" onPress={() => handleLike(item)} />
                :
                <IconButton icon="thumb-up-outline" onPress={() => handleLike(item)} />}

            </Card.Actions>
          </Card>
        }
      />

      <Button>BUTTON</Button>

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