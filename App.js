import { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from "react-native"
import { Portal, Modal, PaperProvider, BottomNavigation, Button, Snackbar, TextInput, Text } from 'react-native-paper';
import SearchSeries from './components/SearchSeries'; // It seems that BottomNavigation needs these component's as separate imports
import VotingList from './components/VotingList';
import WatchTimeCalendar from './components/WatchTimeCalendar';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { app } from './components/firebaseConfig';
import { getDatabase, ref, push, remove, update, set, onValue } from 'firebase/database';

const database = getDatabase(app);

export default function App() {

  const [index, setIndex] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProfile, setNewProfile] = useState({
    username: '',
    password: ''
  })
  const [loginProfile, setLoginProfile] = useState({
    username: '',
    password: ''
  });
  const [profiles, setProfiles] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const onDismissSnackBar = () => setSnackbarVisible(false);

  const [routes] = useState([
    { key: 'calendar', title: 'Calendar', focusedIcon: 'calendar-clock', unfocusedIcon: 'calendar-clock-outline' },
    { key: 'search', title: 'Search', focusedIcon: 'movie-search', unfocusedIcon: 'movie-search-outline' },
    { key: 'list', title: 'List', focusedIcon: 'ballot', unfocusedIcon: 'ballot-outline' },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    calendar: () => <WatchTimeCalendar username={loginProfile.username} />,
    search: () => <SearchSeries username={loginProfile.username} />,
    list: () => <VotingList username={loginProfile.username} />,
  });

  useEffect(() => {
    onValue(ref(database, 'profiles/'), (snapshot) => {
      const data = snapshot.val();
      const keys = Object.keys(data);
      // Combine keys with data 
      const dataWithKeys = Object.values(data).map((obj, index) => {
        return { ...obj, key: keys[index] }
      });

      setProfiles(dataWithKeys);
    })
  }, []);

  const createNewProfile = () => {
    if (newProfile.username != '' && newProfile.password != '') {

      if (profiles.some(profile => profile.username === newProfile.username)) {
        Alert.alert('Error', 'Username in use already.\nPlease choose another username.');
        return;
      }

      push(ref(database, 'profiles/'), newProfile);
      hideModal();
      setSnackbarText('Added new user profile.')
      setSnackbarVisible(true);
      setNewProfile({
        username: '',
        password: ''
      });
    }
    else {
      Alert.alert('Error', 'Error creating new profile.\nDid you give both the username and the password?');
    }
  }

  const handleLogIn = () => {
    if (profiles.some(profile => profile.username === loginProfile.username && profile.password === loginProfile.password)) {
      setLoggedIn(true);
    } else {
      Alert.alert('Error', 'Error logging in.\nPlease check the username and the password.');
    }
  }

  if (loggedIn) {
    return (
      <SafeAreaProvider>
        <PaperProvider>
          <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
          />
        </PaperProvider>
      </SafeAreaProvider>
    );
  } else {
    return (
      <SafeAreaProvider>
        <PaperProvider>
          <View style={styles.container}>
            <Text variant="displayLarge">SHOWDOWN</Text>
            <Text variant="headlineMedium">Please log in or create a new profile.</Text>
            <TextInput
              placeholder='Username'
              style={{ marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(username) => setLoginProfile({ ...loginProfile, username: username })}
              value={loginProfile.username} />
            <TextInput
              placeholder='Password'
              style={{ marginTop: 5, marginBottom: 5, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(password) => setLoginProfile({ ...loginProfile, password: password })}
              value={loginProfile.password} />
            <Button mode="contained" icon="login" onPress={handleLogIn} title="Log In" style={styles.button}>Log In</Button>
            <Button mode="contained" icon="head-plus-outline" onPress={showModal} style={styles.button}>Create new profile</Button>
          </View>
          <Portal>
            <Modal visible={modalVisible} onDismiss={hideModal} style={{
              backgroundColor: 'white', padding: 50, alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TextInput
                placeholder='Username'
                style={{ marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={(username) => setNewProfile({ ...newProfile, username: username })}
                value={newProfile.username} />
              <TextInput
                placeholder='Password'
                style={{ marginTop: 5, marginBottom: 5, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={(password) => setNewProfile({ ...newProfile, password: password })}
                value={newProfile.password} />
              <Button mode="contained" icon="head-plus-outline" onPress={createNewProfile} style={styles.button}>Create new profile</Button>
            </Modal>
          </Portal>

          <Snackbar
            visible={snackbarVisible}
            onDismiss={onDismissSnackBar}
            duration={3000}
          >
            {snackbarText}
          </Snackbar>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20
  },
  button: {
    margin: 10,
  },
});