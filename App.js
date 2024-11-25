import { useState, } from 'react';
import { PaperProvider, BottomNavigation, Text } from 'react-native-paper';
import SearchSeries from './components/SearchSeries'; // It seems that BottomNavigation needs these component's as separate imports
import VotingList from './components/VotingList';
import WatchTimeCalendar from './components/WatchTimeCalendar';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {

  // States and variables for the BottomNavigation
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'calendar', title: 'Calendar', focusedIcon: 'calendar-clock', unfocusedIcon: 'calendar-clock-outline' },
    { key: 'search', title: 'Search', focusedIcon: 'movie-search', unfocusedIcon: 'movie-search-outline' },
    { key: 'list', title: 'List', focusedIcon: 'ballot', unfocusedIcon: 'ballot-outline' },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    calendar: WatchTimeCalendar,
    search: SearchSeries,
    list: VotingList,
  });

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
}
