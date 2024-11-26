import { StyleSheet, View, FlatList } from 'react-native';
import { Portal, Modal, Button, Card, Text, IconButton, Snackbar, Icon, PaperProvider } from "react-native-paper";
import { useState, useEffect } from 'react';
import { app } from './firebaseConfig';
import { getDatabase, ref, push, remove, update, set, onValue } from 'firebase/database';
import DateTimePicker from '@react-native-community/datetimepicker';

const database = getDatabase(app);

export default function WatchTimeCalendar({ username }) {

  const [watchtimes, setWatchtimes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const toggleTimePicker = () => setShowTimePicker(!showTimePicker);

  useEffect(() => {
    onValue(ref(database, 'watchtimes/'), (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const keys = Object.keys(data);
        // Combine keys with data 
        const dataWithKeys = Object.values(data).map((obj, index) => {
          return { ...obj, key: keys[index] }
        });
        setWatchtimes(dataWithKeys);
      } else {
        setWatchtimes([]); // No items
      }
    })
  }, []);

  const addWatchTime = () => {

    
    // const newWatchtime = {
    //   date: formatDate(selectedDate),
    //   time: formatTime(selectedTime),
    //   day: getDayOfWeek(selectedDate),
    //   likes: [username, "Bob"],
    //   dislikes: ["Katy", "Perry"]
    // };

    const newWatchtime = {
      date: formatDate(selectedDate),
      time: formatTime(selectedTime),
      day: getDayOfWeek(selectedDate),
      likes: [username]
    };

    push(ref(database, 'watchtimes/'), newWatchtime);

    hideModal();
  }

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

      update(ref(database, `watchtimes/${date.key}`), updatedDate);

    }
  }

  const handleDislike = async (watchtime) => {
    let updatedWatchtime = { ...watchtime };

    // Remove key and add possibly missing arrays
    delete updatedWatchtime.key;
    if (!updatedWatchtime.likes) {
      updatedWatchtime.likes = [];
    }
    if (!updatedWatchtime.dislikes) {
      updatedWatchtime.dislikes = []
    }

    if (!watchtime.dislikes.includes(username)) {

      updatedWatchtime.dislikes.push(username);

      if (updatedWatchtime.likes.includes(username)) {
        updatedWatchtime.likes = updatedWatchtime.likes.filter(name => name != username);
      }

      update(ref(database, `watchtimes/${watchtime.key}`), updatedWatchtime);

    }
  }

  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatTime = (date) => {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getDayOfWeek = (date) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={watchtimes}
        renderItem={({ item }) =>
          <Card style={{ marginTop: 15, width: 300 }}>
            <Card.Title
              title={item.day + " " + item.time}
              subtitle={item.date}
              titleVariant="titleLarge"
            />
            <Card.Content style={{ flexDirection: 'column', alignItems: "flex-start" }}>
              <View style={{ flexDirection: 'column', alignItems: "flex-start" }}>
                <FlatList
                  data={item.likes}
                  // ListEmptyComponent={emptyListComponent}
                  renderItem={({ item }) =>
                    <View style={{ flexDirection: 'row', alignItems: "flex-start" }}>
                      <Icon source="thumb-up" color="orange"/>
                      <Text> {item}</Text>
                    </View>
                  }
                />
                <FlatList
                  data={item.dislikes}
                  // ListEmptyComponent={emptyListComponent}
                  renderItem={({ item }) =>
                    <View style={{ flexDirection: 'row', alignItems: "flex-start" }}>
                      <Icon source="thumb-down" color="red" />
                      <Text> {item}</Text>
                    </View>
                  }
                />
              </View>
            </Card.Content>
            <Card.Actions>
              {/* <IconButton icon="trash-can-outline" iconColor="DeepPink" onPress={() => deleteDate(item.key)} /> */}

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

      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal} style={{ backgroundColor: 'white', padding: 50 }}>
          <Text>Selected Date: {formatDate(selectedDate)}</Text>
          <Text>Selected Time: {formatTime(selectedTime)}</Text>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              onChange={(event, date) => {
                setShowDatePicker(false);
                setSelectedDate(date);
              }}
              mode="date"
              display="default"
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              onChange={(event, time) => {
                setShowTimePicker(false);
                setSelectedTime(time);
              }}
              mode="time"
              display="default"
            />
          )}

          <Button mode="contained" icon="calendar" onPress={toggleDatePicker} style={styles.button}>
            Select Date
          </Button>
          <Button mode="contained" icon="clock" onPress={toggleTimePicker} style={styles.button}>
            Select Time
          </Button>

          <Button mode="contained" icon="plus" onPress={addWatchTime} style={styles.button}>
            Add watch time
          </Button>
        </Modal>
      </Portal>
      <Button mode="contained" icon="calendar-clock" onPress={showModal} style={styles.button}>Add new watch time</Button>

    </View>
  );
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