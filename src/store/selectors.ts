import {useTypedSelector, RootState} from './index';
import {useFirebase, useFirebaseConnect} from 'react-redux-firebase';
import {useSelector} from 'react-redux';
import {Game, Character} from './Schema';
import {KeyList} from './KeyList';

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

export const usePortrait = (characterKey: string) => useTypedSelector(state => state.firebase.data?.portraits?.[characterKey]?.portrait)
export const useCharacterGameKey = (characterKey: string)=> useTypedSelector(state => state.firebase.data.characters?.[characterKey]?.game)
export const useCharacterOwner = (characterKey: string)=> useTypedSelector(state => state.firebase.data.characters?.[characterKey]?.owner)
export const useInventory = (characterKey: string) => useTypedSelector(state => state.firebase.data?.characters?.[characterKey]?.inventory);
export const useItems = (characterKey: string) => useTypedSelector(state => state.firebase.data?.characters?.[characterKey]?.items);
export const useItem = (itemKey: string) => useTypedSelector(state => state.firebase.data?.items?.[itemKey]);
export const useMonies = (characterKey: string) => useTypedSelector(state => state.firebase.data?.moniesAndProvisions?.[characterKey]?.monies ?? 0);
export const useProvisions = (characterKey: string) => useTypedSelector(state => state.firebase.data?.moniesAndProvisions?.[characterKey]?.provisions ?? 0);

export const useStamina = (characterKey: string) => useTypedSelector(state => state.firebase.data?.baseStats?.[characterKey]?.stamina_current ?? 0)
export const useMaxStamina = (characterKey: string) => useTypedSelector(state => state.firebase.data?.baseStats?.[characterKey]?.stamina_max ?? 0);
export const useLuck = (characterKey: string) => useTypedSelector(state => state.firebase.data?.baseStats?.[characterKey]?.luck_current ?? 0)
export const useSkillStat = (characterKey: string) => useTypedSelector(state => state.firebase.data?.baseStats?.[characterKey]?.skill ?? 0)
export const useLuckMax = (characterKey: string) => useTypedSelector(state => state.firebase.data?.baseStats?.[characterKey]?.luck_max ?? 0);
export const useBio = (characterKey:string) => useTypedSelector(state => state.firebase.data?.bios?.[characterKey])
export const useBaseStats = (characterKey: string) => useTypedSelector(state => state.firebase.data?.baseStats?.[characterKey])
export const useCharacterName = (characterKey: string) => {
    return useTypedSelector(state => state.firebase.data?.bios?.[characterKey]?.name ?? "");
};
export const useCharacterBackground = (characterKey: string) => useTypedSelector(state => state.firebase.data?.bios?.[characterKey]?.background ?? "");
export const useCharacterSpecial = (characterKey: string) => useTypedSelector(state => state.firebase.data?.bios?.[characterKey]?.special ?? "");

export const useLastRolls = (characterKey:string)=> {
    useFirebaseConnect([
        {
            path: `/rolls/${characterKey}`,
            storeAs: `/lastRoll/`,
            queryParams: ['orderByKey', 'limitToLast=1'],
        }])

    return useTypedSelector(state => state.firebase.ordered?.lastRoll);
}
