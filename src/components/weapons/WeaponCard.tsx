import React, { FunctionComponent, useContext, ChangeEvent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { CharacterContext } from '../../views/CharacterContext';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  MenuItem, Select, Table, TableRow, TableCell,
} from '@material-ui/core';
import SkillSelectItem from '../skills/SkillSelectItem';
import Button from '@material-ui/core/Button';
import { Casino, FormatListBulletedSharp } from '@material-ui/icons';
import SkillInfoButton from '../skills/skillSections/SkillInfoButton';
import DamageTable from './DamageTable';
import { ItemContext } from '../../contexts/ItemContext';
import WeaponInfoPopperContent from './WeaponInfoPopperContent';
import IconButton from '@material-ui/core/IconButton';

interface IWeaponCardProps {weapon: string}

type WeaponCardProps = IWeaponCardProps;

const WeaponCard: FunctionComponent<IWeaponCardProps> = (props: IWeaponCardProps) => {
  const {weapon} = props;
  const classes = useStyles();
  const {character} = useContext(CharacterContext);
  const firebase = useFirebase();
  useFirebaseConnect([
                       {
                         path   : `/items/${character}/${weapon}`,
                         storeAs: `/weaponTableRow/${weapon}/weapon`,
                       }, {
      path   : `/skills/${character}`,
      storeAs: `/weaponTableRow/${weapon}/skills`,
    },
                     ]);
  const {
    name = "",
    damage = [0, 0, 0, 0, 0, 0, 0],
    ranged = false,
    twoHanded = false,
    armourPiercing = false,
    skill: weaponSkill = "none",
  } = useTypedSelector(state => state.firebase.data?.weaponTableRow?.[weapon]?.weapon) ??
      {};

  const skills = useTypedSelector(state => state.firebase.data?.weaponTableRow?.[weapon]?.skills) ??
                 {};

  const skillKeys = Object.keys(skills);

  const showAttributes = ranged || twoHanded || armourPiercing;

  const attributes = [
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
  ].reduce<string>((prev, curr, index) => curr.value
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

  return (
      <ItemContext.Provider value={weapon}>
      <Grid container>
        <Grid item container xs={1} alignItems={"center"} justify={"center"}><Grid item><IconButton><FormatListBulletedSharp/></IconButton></Grid></Grid>
        <Grid
            item
            container
            className={classes.nameContainer}
            alignItems={"center"}
            justify={"flex-start"}
            xs={3}>
          <Grid item>
            <Typography>{name}</Typography>
          </Grid>
        </Grid>
        <Grid
            item
            container
            xs={1}
            alignItems={"center"}
            justify={"center"}>
          <Grid item><SkillInfoButton><WeaponInfoPopperContent/></SkillInfoButton></Grid>
        </Grid>
        <Grid
            item
            container
            className={classes.selectContainer}
            alignItems={"center"}
            justify={"flex-start"}
            xs={4}>
          <Grid item xs={12}>
            <Select
                fullWidth
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
        <Grid
            item
            xs={3}
            alignItems={"center"}
            justify={"center"}
            container
            spacing={1}
            className={classes.buttons}>
          <Grid item xs={6}/>
          <Grid
              item
              xs={6}>
            <Button
                variant={"contained"}
                color={"secondary"}
                fullWidth
            >
              <Casino />
            </Button>
          </Grid>

        </Grid>

      </Grid>
      </ItemContext.Provider>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      WeaponCard     : {},
      nameContainer: {
        paddingLeft: theme.spacing(2),
      },

      selectContainer: {
        paddingRight: theme.spacing(2)
      },

      buttons        : {
        padding: theme.spacing(1),
      },
    }));

export default WeaponCard;
