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
import { Casino } from '@material-ui/icons';

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
    skill: weaponSkill = "",
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
      <Grid container>
        <Grid
            item
            container
            className={classes.nameContainer}
            alignItems={"center"}
            justify={"flex-start"}
            xs={2}>
          <Grid item>
            <Typography>{name}</Typography>
          </Grid>
        </Grid>
        <Grid
            item
            container
            className={classes.selectContainer}
            alignItems={"center"}
            justify={"flex-start"}
            xs={3}>
          <Grid item xs={12}>
            <Select
                fullWidth
                onChange={handleSelect}
                value={weaponSkill}>
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
            alignItems={"center"}
            justify={"center"}
            xs={5}
        >
          <Table
          >
            <TableRow >{damage.map((item, index) => (
                <TableCell
                    className={classes.damageCell}
                    key={`damage-header-${item}-${index}`}>
                  <div className={classes.damageRollLabel}>
                    {index + 1}
                    {index == 6
                     ? "+"
                     : ""}
                  </div>
                  <Typography className={classes.damageItem}>
                    {item}
                  </Typography>
                </TableCell>))}
            </TableRow>
          </Table>
        </Grid>
        <Grid
            item
            xs={2}
            alignItems={"center"}
            justify={"center"}
            container
            spacing={1}
            className={classes.buttons}>
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

      </Grid>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      WeaponCard     : {},
      nameContainer: {
        paddingLeft: theme.spacing(2),
      },
      damageCell     : {
        padding      : 0,
        width        : "1rem",
        textAlign    : "center",
        verticalAlign: "baseline",
        borderBottom: 0,
      },
      selectContainer: {
        paddingRight: theme.spacing(2)
      },
      damageRollLabel: {
        fontSize: theme.typography.fontSize - 3,
        color   : theme.palette.text.hint,
        padding:0,
      },
      damageTable: {
        border: 0,
      },
      damageRow: {
        border: 0
      },
      damageItem     : {
        border      : "1px solid",
        borderColor : theme.palette.divider,
        textAlign   : "center",
        display     : "inline-block",
        minWidth    : "1rem",
        paddingLeft : theme.spacing(0.5),
        paddingRight: theme.spacing(0.5),
        marginLeft  : 0,
        marginRight : 0,
        color       : theme.palette.text.primary,
      },
      buttons        : {
        padding: theme.spacing(1),
      },
    }));

export default WeaponCard;
