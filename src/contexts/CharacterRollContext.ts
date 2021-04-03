import { useState } from 'react';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import { rollKey } from '../components/rolls/rollKey';
import { useTypedSelector } from '../store';
import { FbRoll } from '../store/Schema';
import { IGameContextRollProps, TGameContext } from './GameContext';

export const useCharacterRollContext = (characterKey: string): TGameContext => {
  const firebase = useFirebase();
  const [lastSeen, setLastSeen] = useState<string | null>("firstOpen");
  useFirebaseConnect({
    path       : `/rolls/${characterKey}`,
    storeAs    : `/rollDialog/`,
    queryParams: ['orderByKey', 'limitToLast=1'],
  });
  const lastRolls = useTypedSelector(state => state.firebase.ordered?.rollDialog);

  return {
    id         : characterKey,
    lastSeen   : lastSeen,
    setLastSeen: (key: string) => {
      console.log(`settingLastSeen(${key})`);
      setLastSeen(key);
    },
    lastRoll   : lastRolls
                 ? lastRolls[0]
                 : null,
    async roll(props: IGameContextRollProps) {
      const {
        target,
        dice,
        rollerName,
        rolledAbility,
      } = props;

      const rollTitle = target === undefined
                        ? `${rollerName} tests ${rolledAbility}`
                        : target == 0
                          ? `${rollerName} rolls 2d6`
                          : `${rollerName} rolling under ${target} for ${rolledAbility}`;

      const rollsRef = firebase.ref(`/rolls/${characterKey}`);

      const newRef = rollsRef.push();

      const {key} = newRef;

      const roll = rollKey(key ?? Math.random()
                                      .toString(), dice);

      const total = roll.reduce((prev, curr) => prev + curr, 0) + 2;

      // const diceEmbeds: any[] = [];

      // roll.forEach(die => {
      //   diceEmbeds.push({
      //     image: {
      //       url: `https://troika-online.vercel.app/dice/${die + 1}.png`,
      //     },
      //   });
      // });

      const requestOptions = {
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body   : JSON.stringify({
          username: `Rollerbot`,
          content : `**${rollerName}** ${target == 0
                                         ? `rolling 2d6`
                                         : target === undefined
                                           ? `tests ${rolledAbility}`
                                           : `rolling under **${target}** for **${rolledAbility}**`}
> Result: 
> **${total}**
${target
  ? total > target
    ? `\`\`\`diff
- Fail
\`\`\``
    : `\`\`\`diff
+ Success
\`\`\``
  : ''}`,
          // embeds  : diceEmbeds,
        }),
      };
      fetch(
          'https://discord.com/api/webhooks/827982601712435221/FqfPOT5svA0seeDUHFvoNaxHdSq7omtT4JiI2dccdX9vLaS8usvvyHEWdMmZc2Zl_E-n',
          requestOptions)
          .then(response => console.log(response));

      await newRef.set({
        title: rollTitle,
        dice,
        target,
        roll,
        total,
      });

      if (lastSeen === "firstOpen") {setLastSeen(null);}

      return key;
    },
  };
};
