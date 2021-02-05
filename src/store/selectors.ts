import { useTypedSelector, RootState } from './index';
import { useFirebase } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { Game, KeyList, Character } from './Schema';

export const useGame = (gameKey: string) => useSelector<RootState, Partial<Game> | undefined>(
    state => state.firebase.data.games
             ? state.firebase.data.games[gameKey]
             : undefined);

export const useGameRef = (gameKey: string) => useFirebase()
    .ref(`/games/${gameKey}`);

export const usePlayers = (gameKey: string) => useSelector<RootState, KeyList | undefined>(
    (state: RootState) => state.firebase.data.games &&
                          state.firebase.data.games[gameKey]
                          ? state.firebase.data.games[gameKey].players
                          : undefined);

export const useAuth = () => useTypedSelector(state => state.firebase.auth);
export const useProfile = () => useTypedSelector(state => state.firebase.profile);

export const useOtherProfile = (friendKey: string) => (
    {
      data: useTypedSelector(state => state.firebase.data.profiles &&
                                      state.firebase.data.profiles['friendKey']
                                      ? state.firebase.data.profiles['friendKey']
                                      : undefined),
      ref: useFirebase().ref(`/profiles/${friendKey}`),
    });

export const useInvitations = () => useTypedSelector(state => state.firebase.profile);

export const useCharacter = (characterKey: string) => useSelector<RootState, Character | undefined>(
    state => state.firebase.data.characters
             ? (
                 state.firebase.data.characters[characterKey])
             : undefined);

export const useCharacterSkills = (characterKey: string) => useTypedSelector(
    state => state.firebase.data?.characters?.[characterKey]?.skills);

export const useSkill = (skillKey: string) => useTypedSelector(state => state.firebase.data.skills?.[skillKey]);
export const useCharacterSkillValues = (character: string,
                                        skill: string) => useTypedSelector(state => state.firebase.data.characters?.[character]?.skillValues?.[skill]);

export const usePortrait = (characterKey:string)=> useTypedSelector(state => state.firebase.data?.characters?.[characterKey]?.portrait)

export const useInventory = (characterKey:string) => useTypedSelector(state => state.firebase.data?.characters?.[characterKey]?.inventory);
export const useItems = (characterKey:string) => useTypedSelector(state => state.firebase.data?.characters?.[characterKey]?.items);
export const useItem = (itemKey: string) => useTypedSelector(state => state.firebase.data?.items?.[itemKey]);
