import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import { rollKey } from '../components/rolls/rollKey';
import { useTypedSelector } from '../store';
import { FbRoll } from '../store/Schema';
import { IGameContextRollProps, TGameContext } from './GameContext';

export const useCharacterRollContext = (characterKey: string) => {
  const firebase = useFirebase();
  useFirebaseConnect({path: `/rolls/${characterKey}`,
    storeAs: `/rollDialog/`,
  queryParams: ['orderByKey', 'limitToLast=1']})
  const lastRolls = useTypedSelector(state=>state.firebase.ordered?.rollDialog)
   console.log(lastRolls);

  return {
    id       : characterKey,
    lastRoll: lastRolls ? lastRolls[0] : null,
    async roll(props: IGameContextRollProps) {
      const {
        target,
        dice,
        rollerName,
        rolledAbility,
      } = props;

      const rollTitle = target === undefined
                        ? `${rollerName} tests ${rolledAbility}`
                        : `${rollerName} rolling under ${target} for ${rolledAbility}`;

      const rollsRef = firebase.ref(`/rolls/${characterKey}`);

      const newRef = rollsRef.push();

      const {key} = newRef;

      const roll = rollKey(key ?? Math.random()
                                      .toString(), dice);

      const total = roll.reduce((prev, curr) => prev + curr, 0) + 2;

      await newRef.set({
        title: rollTitle,
        dice,
        roll,
        total
      });
      return key;
    },
  };
};
