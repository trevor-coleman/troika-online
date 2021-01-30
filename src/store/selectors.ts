import { useTypedSelector, RootState } from './index';
import { useFirebase } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { Game, KeyList } from './Schema';

export const useGame = (gameKey: string) => useSelector<RootState, Partial<Game>|undefined>(state => state.firebase.data.games ? state.firebase.data.games[gameKey]: undefined);

export const useGameRef= (gameKey:string) => useFirebase().ref(`/games/${gameKey}`)

export const usePlayers = (gameKey: string) => useSelector<RootState, KeyList|undefined>((state:RootState) => state.firebase.data.games &&
                                                                         state.firebase.data.games[gameKey]
                                                                         ? state.firebase.data.games[gameKey].players
                                                                         : {});

export const useAuth = () => useTypedSelector(state => state.firebase.auth);
export const useProfile = () => useTypedSelector(state => state.firebase.profile);

export const useOtherProfile = (friendKey: string) => (
    {
      data: useTypedSelector(state => state.firebase.data.profiles &&
                                      state.firebase.data.profiles['friendKey']
                                      ? state.firebase.data.profiles['friendKey']
                                      : {}),
      ref: useFirebase().ref(`/profiles/${friendKey}`),
    });

