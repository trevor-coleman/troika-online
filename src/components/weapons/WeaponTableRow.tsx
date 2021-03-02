import React, { FunctionComponent, useContext, ChangeEvent } from 'react';
import { TableCell, TableRow, Select, MenuItem } from '@material-ui/core';
import { useFirebaseConnect, useFirebase } from 'react-redux-firebase';
import { CharacterContext } from '../../contexts/CharacterContext';
import { useTypedSelector } from '../../store';
import { Item } from '../../store/Item';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Casino } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Skill } from '../../store/Schema';

interface IWeaponTableRowProps {weapon: string}

type WeaponTableRowProps = IWeaponTableRowProps;

export interface WeaponTableRowState {
  weapon: Item,
  skills: { [key: string]: Skill },
}

const WeaponTableHeader: FunctionComponent = () => {
  const classes = useStyles();

  const damage = Array.from(Array(7).keys());

  return (
      <TableRow>
        <TableCell>
          Weapon
        </TableCell>
        <TableCell colSpan={7}
                   align={"center"}>
          Damage
        </TableCell>
        <TableCell>
          Skill
        </TableCell>
        <TableCell>
          Roll
        </TableCell>
      </TableRow>);
};

const WeaponTableRow: FunctionComponent<IWeaponTableRowProps> = (props: IWeaponTableRowProps) => {
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
      <TableRow>
        <TableCell>
          <Typography paragraph={false}
                      className={classes.name}>{name}</Typography>
          <Typography className={classes.attributes}
                      variant={"caption"}>{showAttributes
                                           ? `(${attributes})`
                                           : ''}</Typography>
        </TableCell>
        {damage.map((item, index) => (
            <TableCell className={classes.damageCell}
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
        <TableCell className={classes.skillSelect}>
          <Select fullWidth
                  onChange={handleSelect}
                  value={weaponSkill}>
            {skillKeys.map(skill => <MenuItem key={skill}
                                              value={skill}><SkillText name={skills[skill].name}
                                                                       skill={skill} /></MenuItem>)}
          </Select>
        </TableCell>
        <TableCell>
          <IconButton disabled
                      color="primary"><Casino /></IconButton>
        </TableCell>
      </TableRow>);
};

interface SkillTextProps {
  name: string,
  skill: string,
}

const SkillText: FunctionComponent<SkillTextProps> = ({
                                                        name,
                                                        skill: id,
                                                      }: SkillTextProps) => {
  const {character} = useContext(CharacterContext);
  const classes = useItemStyles();
  useFirebaseConnect([
                       {
                         path   : `/skillValues/${character}/${id}`,
                         storeAs: `/skillText/${id}`,
                       },
                     ]);

  const test = useTypedSelector(state => state.firebase.data?.skillText?.[id]);
  const {
    rank = 0,
    skill = 0,
  } = useTypedSelector(state => state.firebase.data?.skillText?.[id]) ?? {};
  return <div className={classes.skillItemWrapper}>
    <div className={classes.skillName}>{name}</div>
    <div className={classes.skillValue}>{rank + skill}</div>
  </div>;
};

const useItemStyles = makeStyles((theme: Theme) => (
    {
      skillName       : {
        display : "inline-block",
        flexGrow: 1,
      },
      skillValue      : {
        display        : "inline-block",
        paddingRight   : theme.spacing(0.5),
        paddingLeft    : theme.spacing(0.5),
        color          : theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        textAlign      : "center",
      },
      skillItemWrapper: {
        display: 'flex',
        width  : "100%",
      },

    }));

const useStyles = makeStyles((theme: Theme) => (
    {
      WeaponTableRow : {},
      damageItem     : {
        border      : "1px solid",
        borderColor : theme.palette.divider,
        textAlign   : "center",
        display     : "inline-block",
        minWidth    : "1rem",
        paddingLeft : theme.spacing(1),
        paddingRight: theme.spacing(1),
        marginLeft  : theme.spacing(0.5),
        marginRight : theme.spacing(0.5),
        color       : theme.palette.text.primary,
      },
      damageRollLabel: {
        fontSize: theme.typography.fontSize - 3,
        color   : theme.palette.text.hint,

      },
      attributes     : {
        color  : theme.palette.text.hint,
        display: "inline",
      },
      name           : {
        display: "inline",
      },
      skillSelect    : {
        width: "10rem",
      },
      damageCell     : {
        width        : "2rem",
        textAlign    : "center",
        padding      : 0,
        paddingTop   : 6,
        verticalAlign: "baseline",
      },
    }));

export { WeaponTableRow, WeaponTableHeader };
