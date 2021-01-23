import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { firebaseReducer, FirebaseReducer, getFirebase, actionTypes as rrfActionTypes } from 'react-redux-firebase';
import { Skill, Item, Weapon, Spell } from '../types/troika';
import Schema from './Schema';

// noinspection SpellCheckingInspection
const fbConfig = {
  apiKey: "AIzaSyD8_nUxyjBAvGId93tYDK0O1v88A8Tgm7Q",
  authDomain: "troika-online.firebaseapp.com",
  projectId: "troika-online",
  storageBucket: "troika-online.appspot.com",
  messagingSenderId: "616277408442",
  appId: "1:616277408442:web:1fef19d4d2d69e6e6f2083",
  measurementId: "G-7QFHN3RXPP",
};

const rrfConfig = {
  userProfile: 'people',
};

firebase.initializeApp(fbConfig);

// Initialize other services on firebase instance if needed
// firebase.functions() // <- needed if using httpsCallable

const rootReducer = combineReducers({
  firebase: firebaseReducer,
});

interface Profile {
  name: string;
  email: string;
}



export interface RootState {
  firebase: FirebaseReducer.Reducer<Profile, Schema>
}

const extraArgument = {
  getFirebase
}

const middleware = [
  ...getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        // just ignore every redux-firebase and react-redux-firebase action type
        ...Object.keys(rrfActionTypes)
                 .map(type => `@@reactReduxFirebase/${type}`)
      ],
      ignoredPaths: ['firebase']
    },
    thunk: {
      extraArgument
    }
  })
]

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const store = configureStore({
  reducer: rootReducer,
  middleware
});

export type AppDispatch = typeof store.dispatch;

export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
};

console.log(firebase.database);

export default store;
