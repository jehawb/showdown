import { View, StyleSheet } from "react-native"
import { TextInput, Button, Card, Text, IconButton, Snackbar } from "react-native-paper";
import { useState } from "react";
import * as WebBrowser from 'expo-web-browser';

export default function SearchSeries() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const onDismissSnackBar = () => setVisible(false);

  const handleFetch = () => {
    setLoading(true);
    fetch(`https://www.omdbapi.com/?apikey=${process.env.EXPO_PUBLIC_OMDB_API_KEY}&t=${title}`)
      .then(response => {
        if (!response.ok)
          throw new Error("Error in fetch: " + response.statusText);

        return response.json();
      })
      .then(data => {
        if (data.Title) {
          setContent(data)
        }
        else {
          // OMDb still returns a json if it can't find anything with a title, but the json does have only Response and Error keys.
          setVisible(true);
          return
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false))
  }

  const handleBrowse = async (url) => {
    try {
      let result = await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error('Error occurred while opening the browser:', error);
    }
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
        <Card style={{ marginBottom: 10 }}>
          <Card.Title title={content.Title} titleVariant="titleMedium" />
          <Card.Content>
            <Text variant="bodyMedium">{content.Plot}</Text>
          </Card.Content>
          <Card.Actions>
            <IconButton icon="web" onPress={() => handleBrowse(content.Poster)} />
            <IconButton icon="plus" onPress={() => handleBrowse(content.Poster)} />
          </Card.Actions>
        </Card>
        : null}

      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={3000}
      >
        No results found.
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
