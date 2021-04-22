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
  RollFormatter,
  IRollSpellProps,
  RollSuccessChecker,
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

  const isSnakeEyes = (roll: number[]) => roll.every(die => die === 1);
  const isBoxCars = (roll: number[]) => roll.every(die => die === 6);

  async function rollSpell(props: IRollSpellProps) {
    const {
      target,
      rollerName,
      rolledSkill,
    } = props;

    const formatter: RollFormatter = (
        props => {
          const {
            total = 0,
            roll = [0, 0],
          } = props;

          let result = "";
          let success: boolean;
          if (isSnakeEyes(roll)) {
            success = true;
            result = `${total} - Guaranteed Success`;
          }
          else if (isBoxCars(roll)) {
            success = false;
            result = `${total} - OOPS!`;
          }
          else {
            success = total <= target;
            result =
                success
                ? `${total} - Success!`
                : `${total} - Failed.`;
          }

          return (
              {
                title      : `${rollerName} Casts ${rolledSkill}`,
                description: `Under ${target}`,
                result,
                total,
                success,
                roll,
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
        props => {
          const {
            total = 0,
            roll = [0,0],
          } = props;

          let result = "";
          let success: boolean;

          if (isBoxCars(roll)) {
            success = false;
            result = `${total} - Fumble!`;
          }
          else if (isSnakeEyes(roll)) {
            success = true;
            result = `${total} - Automatic Success`;
          }
          else {
            success = total <= target;
            result =
                success
                ? `${total} - Success!`
                : `${total} - Failed.`;

          }

          return (
              {
                title      : `${rollerName} - ${rolledSkill}`,
                description: `Under ${target}`,
                result,
                success
              });
        });

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
        props => {
          const {total = 0} = props;
          return (
              {
                title : `${rollerName} attacks with ${rolledWeapon} (${rolledSkill})`,
                result: `Attacks with ${total + rank +
                                        skill} power (Roll: ${total ??
                                                              0}, Rank: ${rank ??
                                                                          0}, Skill: ${skill ??
                                                                                       0})`,
              });
        });
    const newRoll = await pushNewRoll(props, formatter);


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

    const formatter: RollFormatter = ({total=0}) => (
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
    } = formatter({...props, total, roll});

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

    const {key} = await pushNewRoll(
        props,
        (
            ({total=0}) => (
                {
                  title : `${rollerName} rolls ${dice.length}d6`,
                  result: `Total: ${total}`,
                })));

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
          return rollSpell(props);
        default:
          return null;
      }
    },
  };
};
