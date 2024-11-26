# Showdown

## Description

This is a small solo project for Haaga-Helia University of Applied Sciences autumn 2024 Mobile Programming course.

Meant to help a small group to arrange time for watching movies/series together and to decide what to watch.

### Features

- User profiles
- Search for movies/series
- Choosing dates from calendar
- Voting for watchtimes and movies/series

## Used Technologies

Developed using:
- Expo Go
- React Native
- React Native Paper

External sources used:
- omdbapi.com for Movies/Series API
    - https://www.omdbapi.com/
- Google Firebase for Realtime Database
    - https://firebase.google.com/

Other node packaged used:
- react-native-community/datetimepicker
    - https://docs.expo.dev/versions/latest/sdk/date-time-picker/

## .env file

Project uses .env file for the connections to omdbapi.com and Firebase. Both the API key from ombdapi.com and a Realtime Database in Firebase needed for the app to work.

### Example .env file content:

```
EXPO_PUBLIC_OMDB_API_KEY=abcd1234
EXPO_PUBLIC_FIREBASE_API_KEY=AIzjSyA8Bh7rwerN4OGbVLedJ54hjWj6FHP3fqpegwQ
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=shoppingapp-91ahe.firebaseapp.com
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://shoppingapp-91-rtdb.us-west1.firebasedatabase.app
EXPO_PUBLIC_FIREBASE_PROJECT_ID=shoppingapp-91ede
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=shoppingapp-91ede.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1056464134052
EXPO_PUBLIC_FIREBASE_APP_ID=1:10864638354052:web:e959565f804cacd0ed691
```

## Usage

The project isn't published or compiled as of november 2024.

To start the expo server:

```
npx expo start
```

On your mobile phone you need a Expo Go app which can be found in app stores.