import { View, StyleSheet, Image } from "react-native"
import { TextInput, Button, Card, Text, IconButton, Snackbar, Icon } from "react-native-paper";
import { useState } from "react";
import * as WebBrowser from 'expo-web-browser';
import { app } from './firebaseConfig';
import { getDatabase, ref, push } from "firebase/database";

const database = getDatabase(app);

export default function SearchSeries() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');

  const onDismissSnackBar = () => setVisible(false);

  const handleFetch = () => {
    setLoading(true);
    fetch(`https://www.omdbapi.com/?apikey=${process.env.EXPO_PUBLIC_OMDB_API_KEY}&t=${title}&plot=full`)
      .then(response => {
        if (!response.ok)
          throw new Error("Error in fetch: " + response.statusText);

        return response.json();
      })
      .then(data => {
        // OMDb still returns a json if it can't find anything with a title, but the json does have only Response and Error keys.
        if (data.Title) {
          setContent(data)
        }
        else {
          setSnackbarText('No results found.')
          setVisible(true);
          return
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false))
  }

  const handleBrowse = async (imdbID) => {
    try {
      let result = await WebBrowser.openBrowserAsync(`https://www.imdb.com/title/${imdbID}/`);
    } catch (error) {
      console.error('Error occurred while opening the browser:', error);
    }
  }

  const handleToAddList = () => {
    // Using state here would "lag behind" and construct listings with old data
    // TODO: Change "USERNAME" to reflect the current user once users are implemented
    // const listing = {Title: content.Title, Poster: content.Poster, likes: ["USERNAME"], imdbID: content.imdbID};
    const listing = {...content, likes: ["USERNAME"]};
    //console.log(listing);

    push(ref(database, 'listings/'), listing);
    setSnackbarText('Added to the voting list')
    setVisible(true);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={{ width: '70%', margin: 10 }}
        label="Title"
        value={title}
        mode="outlined"
        onChangeText={text => setTitle(text)}
      />

      <Button loading={loading} mode="contained" icon="search-web" onPress={handleFetch}>
        Search
      </Button>

      {content ?
        <Card style={{ marginTop: 15, width: '95%' }}>
          <Card.Title
            title={content.Title}
            subtitle={content.Year}
            titleVariant="titleLarge"
          />
          <Card.Content style={{ flexDirection: 'column', alignItems: "flex-start" }}>
            <View style={{ flexDirection: 'row', alignItems: "flex-start" }}>
              <Image
                source={{ uri: content.Poster }}
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
                style={{ flex: 1 }}>{content.Plot}
              </Text>
            </View>
            <Text>Runtime: {content.Runtime}</Text>
            {content.totalSeasons ? <Text>Seasons: {content.totalSeasons}</Text>: null}
            <Text>IMDB rating: {content.imdbRating}</Text>
            <Text>Metacritic score: {content.Metascore}</Text>
          </Card.Content>
          <Card.Actions>
            <IconButton icon="web" onPress={() => handleBrowse(content.imdbID)} />
            <IconButton icon="plus" onPress={() => handleToAddList()} />
          </Card.Actions>
        </Card>
        : null}

      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000}
      >
        {snackbarText}
      </Snackbar>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
