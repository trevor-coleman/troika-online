import { useEffect, useState } from 'react';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import { abilityWebhook, callDiscordWebhook } from '../api/discord';
import { rollKey } from '../components/rolls/rollKey';
import { useTypedSelector } from '../store';
import { useGame } from '../store/selectors';
import { Roll } from '../types/troika';
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
  IRollInventoryProps,
  IRollToAdvanceProps,
  IRollToAdvanceSecondRollProps,
} from './GameContext';

const errorRoll = (characterName: string = 'Character') => (
    {
      title             : `${characterName} - Error`,
      dialogDetail      : `Something went wrong - please try again.`,
      discordDescription: `Something went wrong - please try again`,
      dialogResult      : `Error`,
      success           : false,
    });

export const useCharacterRollContext = (characterKey: string): TGameContext => {
  const firebase = useFirebase();
  const [lastSeen, setLastSeen] = useState<string | null>("firstOpen");
  useFirebaseConnect([
    {
      path       : `/rolls/${characterKey}`,
      storeAs    : `/lastRoll/`,
      queryParams: ['orderByKey', 'limitToLast=1'],
    }, {path: `/characters/${characterKey}/name`},
  ]);

  const lastRolls = useTypedSelector(state => state.firebase.ordered?.lastRoll);
  const characterName = useTypedSelector(state => state.firebase.data?.characters?.[characterKey]?.name) ??
                        "Character";
  const characterAvatar = useTypedSelector(state => state.firebase.data.characters?.[characterKey]?.portrait);
  const gameKey = useTypedSelector(state=>state.firebase.data.characters?.[characterKey]?.game);

  const {enableDiscord = false, discordWebhookUrl = ""}  = useGame(gameKey) ?? {};


  const isSnakeEyes = (roll: number[]) => roll.every(die => die === 1);
  const isBoxCars = (roll: number[]) => roll.every(die => die === 6);

  async function rollSpell(props: IRollSpellProps) {
    const {
      target,
      rollerName = characterName,
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
                title             : `${rollerName} casts ${rolledSkill}`,
                dialogDetail      : `Roll under ${target} to case ${rolledSkill}`,
                discordDescription: `rolls to ***cast ${rolledSkill}*** (under ${target})`,
                dialogResult      : result,
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

  async function rollInventory(props: IRollInventoryProps) {
    const {
      itemName,
      position,
      rollerName = characterName,
    } = props;

    const formatter: RollFormatter = (
        props => {
          const {
            total = 0,
            roll = [0, 0],
          } = props;

          let result = "";
          let success: boolean;

          if (isBoxCars(roll)) {
            success = true;
            result = `${total} - Automatic Success!`;
          }
          else if (isSnakeEyes(roll)) {
            success = false;
            result = `${total} - Fumble`;
          }
          else {
            success = total >= position;
            result =
                success
                ? `${total} - Success!`
                : `${total} - Failed.`;
          }

          return (
              {
                title             : `${rollerName} - Get ${itemName} from Inventory`,
                dialogDetail      : `Roll over ${position} to retrieve ${itemName}`,
                discordDescription: `rolls to ***retrieve ${itemName}*** (over ${position})`,
                dialogResult      : result,
                success,
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
      rollerName = characterName,
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
                title             : `${rollerName} tests ${rolledSkill}`,
                dialogDetail      : `roll under ${target} to test ${rolledSkill}`,
                discordDescription: `tests ***${rolledSkill}*** (under ${target})`,
                dialogResult      : result,
                success,
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
      rollerName = characterName,
      rolledSkill,
      rank,
      skill,
    } = props;

    const formatter: RollFormatter = (
        props => {
          const {total = 0} = props;
          return (
              {
                title             : `${rollerName} attacks with ${rolledWeapon} (${rolledSkill})`,
                dialogDetail      : `roll to attack with ${rolledWeapon} using ${rolledSkill}`,
                discordDescription: `attacks with ***${rolledWeapon}*** using ***${rolledSkill}***`,
                dialogResult      : `Attacks with ${total + rank +
                                                    skill} power (Roll: ${total ??
                                                                          0}, Rank: ${rank ??
                                                                                      0}, Skill: ${skill ??
                                                                                                   0})`,
                discordResult     : `**${total + rank +
                                         skill}**\n_(Roll: ${total ??
                                                             0}, Rank: ${rank ??
                                                                         0}, Skill: ${skill ??
                                                                                      0})_`,
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
      rollerName = characterName,
      damage,
    } = props;

    const formatter: RollFormatter = ({total = 0}) => (
        {
          title             : `${rollerName} rolls damage with ${rolledWeapon}`,
          dialogDetail      : `Roll damage with ${rolledWeapon}`,
          discordDescription: `rolls ***damage*** with ***${rolledWeapon}***`,
          dialogResult      : `Rolled a ${total} for ${damage[total -
                                                              1]} damage`,
        });

    const {key} = await pushNewRoll(props, formatter);

    return key;

  }

  async function rollBasic(props: IRollBasicProps) {
    const {
      rollerName = characterName,
      dice,

    } = props;

    const {key} = await pushNewRoll(
        props,
        (
            ({total = 0}) => (
                {
                  title             : `${rollerName} rolls ${dice.length}d6`,
                  dialogDetail      : `Roll ${dice.length}d6`,
                  discordDescription: `rolls ***${dice.length}d6***`,
                  dialogResult      : `Total: ${total}`,
                })));

    return key;
  }

  async function rollToAdvanceSecondRoll(props: IRollToAdvanceSecondRollProps): Promise<string | null> {
    const {
      rolledSkillName,
      rollerName = characterName,
      target = 0,
      total = 0,
    } = props;

    const formatter: RollFormatter = (
        (props) => {
          if (props.type !== 'second') {
            return errorRoll(props.rollerName);
          }

          const {
            total = 0,
            roll = [0, 0],
            rollerName = characterName,
            rolledSkillKey,
            rolledSkillRank,
          } = props;

          const success = total === 12;
          const result = success
                         ? ` 12 + ${total} - Success! Rolled Twelve Twice!`
                         : `12 + ${total} - Failed. Need to toll 12 twice to advance.`;

          if (success) {
            setTimeout(() => {
              firebase.ref(`/skillValues/${characterKey}/${rolledSkillKey}/rank`)
                      .set(rolledSkillRank + 1);
            }, 1000);
          }

          return (
              {
                title             : `${rollerName} rolls again to advance ${rolledSkillName}`,
                dialogDetail      : `Roll another 12 to advance ${rolledSkillName}.`,
                discordDescription: `needs another ***12*** to advance ***${rolledSkillName}***`,
                dialogResult      : result,
                success,
              });

        });

    const {key} = await pushNewRoll(props, formatter);

    return key;

  }

  async function rollToAdvance(props: IRollToAdvanceProps): Promise<string | null> {
    const {
      rolledSkillName,
      rollerName = characterName,
      target = 0,
      total = 0,
    } = props;

    const formatter: RollFormatter = (
        (props) => {
          if (props.type !== 'advance') {
            return errorRoll(props.rollerName);
          }

          const {
            total = 0,
            roll = [0, 0],
            rollerName = characterName,
            rolledSkillKey,
            rolledSkillRank,
          } = props;


          const success = (
                              target <= 12 && total >= target) || total === 12;
          const result = success
                         ? target <= 12
                           ? `${total} - Success!`
                           : `Rolled 12 -- Rolling again...`
                         : `${total} - Failed.`;

          setTimeout(() => {
            if (success) {
              if (target > 12) {
                rollToAdvanceSecondRoll({
                  ...props,
                  type: 'second',
                });
              }
              else {
                firebase.ref(`/skillValues/${characterKey}/${rolledSkillKey}/rank`)
                        .set(rolledSkillRank + 1);
              }
            }
          }, 2000);

          return (
              {
                title             : `${rollerName} rolls to advance ${rolledSkillName}`,
                dialogDetail      : target <= 12
                                    ? `Roll over ${target} to advance ${rolledSkillName}`
                                    : `Roll 12 twice to advance ***${rolledSkillName}***`,
                discordDescription: target <= 12
                                    ? `tries to advance ***${rolledSkillName}*** (over ${target})`
                                    : `needs to roll ***12*** twice to advance ***${rolledSkillName} (Skill Total:${target})***`,
                dialogResult      : result,
                success,
              });
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

    let newRollProps: RollProps = {
      ...props, ...formatter({
        ...props,
        total,
        roll,
      }),
      roll,
      total,
    };
    await newRef.set(newRollProps);

    if (lastSeen === "firstOpen") {setLastSeen(null);}

    console.log(newRollProps);
    if(enableDiscord) {
      callDiscordWebhook(newRollProps, discordWebhookUrl);
    }

    return {
      newRef,
      roll,
      total,
      key,
    };

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
    async roll(props: RollProps) {
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
        case 'inventory':
          return rollInventory(props);
        case 'advance':
          return rollToAdvance(props);
        case 'second':
          return rollToAdvanceSecondRoll(props);
        default:
          return null;
      }
    },
  };
};
