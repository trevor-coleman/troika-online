import { useState } from 'react';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import { rollKey } from '../components/rolls/rollKey';
import { useTypedSelector } from '../store';
import {
  IRollWeaponProps,
  RollProps,
  TGameContext,
  IRollSkillProps,
  IRollBasicProps,
  IRollDamageProps,
  RollFormatter, IRollSpellProps,
} from './GameContext';

export const useCharacterRollContext = (characterKey: string): TGameContext => {
  const firebase = useFirebase();
  const [lastSeen, setLastSeen] = useState<string | null>("firstOpen");
  useFirebaseConnect({
    path       : `/rolls/${characterKey}`,
    storeAs    : `/lastRoll/`,
    queryParams: ['orderByKey', 'limitToLast=1'],
  });
  const lastRolls = useTypedSelector(state => state.firebase.ordered?.lastRoll);

  console.log("roll context character key", characterKey);

  async function rollSpell(props: IRollSpellProps) {
    const {
      target,
      rollerName,
      rolledSkill,
    } = props;

    const formatter: RollFormatter = (
        total => {
          console.log(`formatting spell result: ${total} ${typeof total}`)
          let result = "";
          if(total == 2){
            result = `${total} - Guaranteed Success`}
          else if (total == 12) {
            result = `${total} - Fumble!`
          }
          else if(total <= target) {
            result = `${total} - Success!`
          } else {
            result = `${total} - Failed.`
          }

          return (
              {
                title      : `${rollerName} Casts ${rolledSkill}`,
                description: `Under ${target}`,
                result
              });
        });

    const {
      key,
    } = await pushNewRoll(props, formatter);

    return key;
  }

  async function rollSkill(props: IRollSkillProps) {
    const {
      target,
      rollerName,
      rolledSkill,
    } = props;

    const formatter: RollFormatter = (
        total => (
            {
              title : `${rollerName} - ${rolledSkill}`,
              description: `Under ${target}`,
              result: total <= target
                      ? `${total} - Success!`
                      : `${total} - Failed.`,
            }));

    const {
      key,
    } = await pushNewRoll(props, formatter);

    return key;
  }

  async function rollWeapon(props: IRollWeaponProps) {
    const {
      rolledWeapon,
      rollerName,
      rolledSkill,
      rank,
      skill,
    } = props;

    const formatter: RollFormatter = (
        total => (
            {
              title : `${rollerName} attacks with ${rolledWeapon} (${rolledSkill})`,
              result: `Attacks with ${total + rank +
                                      skill} power (Roll: ${total}, Rank: ${rank}, Skill: ${skill})`,
            }));
    const newRoll = await pushNewRoll(props, formatter);

    console.log(newRoll);

    const {
      key,
    } = newRoll;

    return key;

  }

  async function rollDamage(props: IRollDamageProps) {
    const {
      rolledWeapon,
      rollerName,
      damage,
    } = props;

    const formatter: RollFormatter = (total) => (
        {
          title : `${rollerName} rolls damage with ${rolledWeapon}`,
          result: `Rolled a ${total} for ${damage[total - 1]} damage`,
        });

    const {key} = await pushNewRoll(props, formatter);

    return key;

  }

  async function pushNewRoll(props: RollProps, formatter: RollFormatter) {
    const rollsRef = firebase.ref(`/rolls/${characterKey}`);

    const newRef = rollsRef.push();

    const {key} = newRef;
    const {dice} = props;
    const roll = rollKey(key ?? Math.random()
                                    .toString(), dice);


    const total = roll.reduce((prev, curr) => prev + curr);

    const {
      title,
      result,
      description,
    } = formatter(total, props);

    await newRef.set({
      ...props,
      title,
      result,
      description: description ?? null,
      roll,
      total,
    });

    if (lastSeen === "firstOpen") {setLastSeen(null);}

    return {
      newRef,
      roll,
      total,
      key,
    };

  }

  async function rollBasic(props: IRollBasicProps) {
    const {
      rollerName,
      dice,

    } = props;

    const {key} = await pushNewRoll(props, (total => ({
      title: `${rollerName} rolls ${dice.length}d6`,
      result: `Rolled a ${total}`
    })) );

    return key;
  }

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
    async roll(props) {
      switch (props.type) {
        case 'basic':
          return rollBasic(props);
        case 'damage':
          return rollDamage(props);
        case 'skill':
          return rollSkill(props);
        case 'weapon':
          return rollWeapon(props);
        case 'spell':
          return rollSpell(props)
        default:
          return null;
      }
    },
  };
};
