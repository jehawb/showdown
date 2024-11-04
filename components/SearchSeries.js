import { View, StyleSheet, FlatList } from "react-native"
import { TextInput, Button, Card, Text, IconButton } from "react-native-paper";
import { useState } from "react";
import * as WebBrowser from 'expo-web-browser';

export default function SearchSeries() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState();
  const [loading, setLoading] = useState(false);

  const handleFetch = () => {
    setLoading(true);
    fetch(`https://www.omdbapi.com/?apikey=${process.env.EXPO_PUBLIC_OMDB_API_KEY}&t=${title}`)
      .then(response => {
        if (!response.ok)
          throw new Error("Error in fetch: " + response.statusText);

        return response.json();
      })
      .then(data => setContent(data))
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
