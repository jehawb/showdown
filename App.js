import { useState, } from 'react';
import { StyleSheet, View, Alert } from "react-native"
import { Portal, Modal, PaperProvider, BottomNavigation, Button, Snackbar, TextInput } from 'react-native-paper';
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
    { key: 'calendar', title: 'Calendar', focusedIcon: 'calendar-clock', unfocusedIcon: 'calendar-clock-outline', props: { username: "TESTUSERNAME" } },
    { key: 'search', title: 'Search', focusedIcon: 'movie-search', unfocusedIcon: 'movie-search-outline', props: { username: "TESTUSERNAME" } },
    { key: 'list', title: 'List', focusedIcon: 'ballot', unfocusedIcon: 'ballot-outline', props: { username: "TESTUSERNAME" } },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    calendar: WatchTimeCalendar,
    search: SearchSeries,
    list: VotingList,
  });

  const createNewProfile = () => {
    if (newProfile.username && newProfile.password) {
      push(ref(database, 'profiles/'), newProfile);
      hideModal();
      setSnackbarText('Added new user profile.')
      setSnackbarVisible(true);
    }
    else {
      Alert.alert('Error', 'Error creating new profile.\nDid you give both the username and the password?');
    }
  }

  const handleLogIn = () => {
    setLoggedIn(!loggedIn);
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
          <View style={{ marginTop: 200 }}>
            <Button mode="contained" icon="login" onPress={handleLogIn} title="Log In" style={styles.button}>Log In</Button>
            <Button mode="contained" icon="head-plus-outline" onPress={showModal} style={styles.button}>Create new profile</Button>
          </View>
          <Portal>
            <Modal visible={modalVisible} onDismiss={hideModal} style={{ backgroundColor: 'white', padding: 50 }}>
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
    marginTop: 50
  },
  button: {
    margin: 10,
  },
});