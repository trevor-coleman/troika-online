import React, { FunctionComponent, useContext, ChangeEvent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { CharacterContext } from '../../contexts/CharacterContext';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import { GameContext } from '../../contexts/GameContext';
import { useTypedSelector } from '../../store';
import Grid from '@material-ui/core/Grid';
import { MenuItem, Select } from '@material-ui/core';
import SkillSelectItem from '../skills/SkillSelectItem';
import Button from '@material-ui/core/Button';
import {
  Check,
  FiberManualRecordOutlined,

} from '@material-ui/icons';
import SkillInfoButton from '../skills/skillSections/SkillInfoButton';
import { ItemContext } from '../../contexts/ItemContext';
import WeaponInfoPopperContent from './WeaponInfoPopperContent';
import IconButton from '@material-ui/core/IconButton';

interface IWeaponCardProps {weapon: string}

const WeaponCard: FunctionComponent<IWeaponCardProps> = (props: IWeaponCardProps) => {
  const {weapon} = props;
  const classes = useStyles();
  const {character, editable} = useContext(CharacterContext);
  const {roll} = useContext(GameContext);
  const firebase = useFirebase();
  useFirebaseConnect([
    {
      path   : `/items/${character}/${weapon}`,
      storeAs: `/weaponTableRow/${weapon}/weapon`,
    }, {
      path   : `/skills/${character}`,
      storeAs: `/weaponTableRow/${weapon}/skills`,
    }, {path: `/characters/${character}/name`},
  ]);
  const {
    name = weapon == "unarmed" ? "Unarmed" : "",
    ranged = false,
    twoHanded = false,
      isEquipped = false,
    armourPiercing = false,
    skill: weaponSkill = "none",
  } = useTypedSelector(state => state.firebase.data?.weaponTableRow?.[weapon]?.weapon) ??
      {};

  const characterName = useTypedSelector(state => state.firebase.data.characters?.[character]?.name);
  const skills = useTypedSelector(state => state.firebase.data?.weaponTableRow?.[weapon]?.skills) ??
                 {};

  useFirebaseConnect([
    {
      path   : `/skillValues/${character}/${weaponSkill}`,
      storeAs: `/weaponTableRow/${weapon}/weaponSkillValues`,
    }, {
      path   : `/characters/${character}/skill`,
      storeAs: `/weaponTableRow/${weapon}/skill`,
    },
  ]);
  useTypedSelector(state => (
      {
        rank : state.firebase.data?.weaponTableRow?.[weapon]?.weaponSkillValues?.rank ??
               0,
        skill: state.firebase.data.weaponTableRow?.[weapon]?.skill ?? 0,
      }));

  const skillKeys = Object.keys(skills);


  [
    {
      name : "Ranged",
      value: ranged,
    }, {
      name : "2H",
      value: twoHanded,
    }, {
      name : "AP",
      value: armourPiercing,
    },
  ].reduce<string>((prev, curr) => curr.value
                                          ? prev === ""
                                            ? prev + curr.name
                                            : prev + `, ${curr.name}`
                                          : prev

      , "");

  function handleSelect(e: ChangeEvent<{ name?: string, value: unknown }>): void {
    firebase.ref(`/items/${character}/${weapon}`)
            .child('skill')
            .set(e.target.value);
  }

  async function rollWeapon() {
    const characterSkillSnap = await firebase.ref(`/characters/${character}/skill`)
                               .once('value')
    const characterSkill = characterSkillSnap.val();

    let rank=0;
    let rolledSkill: string;


    if (weaponSkill == "none") {
      rolledSkill = "Base Skill"
    } else {
      const snap = await firebase.ref(`/skillValues/${character}/${weaponSkill}`)
                                 .once('value')
      const weaponSkillValues = snap.val();
      rank = weaponSkillValues.rank;
      rolledSkill = skills[weaponSkill].name
    }

      await roll({
        type        : 'weapon',
        dice        : [6, 6],
        rolledSkill,
        rollerKey: character,
        weaponKey: weapon,
        rolledWeapon: name,
        rollerName  : characterName,
        rank        : rank,
        skill       : characterSkill,
      });
  }

  return (
      <ItemContext.Provider value={weapon}>
        <Grid container>
          <Grid
              item
              container
              xs={1}
              alignItems={"center"}
              justify={"center"}>
            <Grid item>
              <IconButton disabled>
                {isEquipped ? <Check/> : <FiberManualRecordOutlined />}
              </IconButton>
            </Grid>
          </Grid>
          <Grid
              item
              xs={3}
              container
              alignItems={"center"}
              justify={"flex-start"}
          >
            <Grid item className={classes.weaponNameButtonContainer}>
              <Button
                  classes={{
                    root: classes.weaponNameButtonRoot,
                    text:classes.weaponNameButtonText
                  }}
                  fullWidth
                  disabled={!editable}
                  onClick={rollWeapon}
                  color={'primary'}>{name}</Button>
            </Grid>
          </Grid>
          <Grid
              item
              xs={1}
              container
              alignItems={"center"}
              justify={"center"}>
            <Grid item>
              <SkillInfoButton disabled={weapon=="unarmed"}>
                <WeaponInfoPopperContent />
              </SkillInfoButton>
            </Grid>
          </Grid>
          <Grid
              item
              xs={5}
              container
              className={classes.selectContainer}
              alignItems={"center"}
              justify={"flex-start"}
          >
            <Grid
                item
                xs={12}>
              <Select
                  fullWidth
                  disabled={!editable}
                  onChange={handleSelect}
                  value={weaponSkill}>
                <MenuItem
                    value={"none"}>No Skill</MenuItem>
                {skillKeys.map(skill => <MenuItem
                    key={skill}
                    value={skill}>
                  <SkillSelectItem
                      name={skills[skill].name}
                      skill={skill} />
                </MenuItem>)}
              </Select>
            </Grid>
          </Grid>
        </Grid>
      </ItemContext.Provider>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      WeaponCard: {},
      nameButton: {
        alignItems    : "flex-start",
        justifyContent: "flex-start",
      },
      selectContainer: {
        paddingRight: theme.spacing(2),
      },

      buttons: {
        padding: theme.spacing(1),
      },
      weaponNameButtonText: {
        textAlign: "left",
      },
      weaponNameButtonContainer: {
        width: "100%"
      },
      weaponNameButtonRoot: {
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%"
      }
    }));

export default WeaponCard;
