import React, { FunctionComponent, ChangeEvent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
} from '@material-ui/core';
import { Damage } from '../../../store/Schema';
import { FormValueChangeHandler } from './FormValueChange';

export const weaponNames: {[key:string]: string} = {
  sword        : "Sword",
  axe          : "Axe",
  knife        : "Knife",
  staff        : "Staff",
  hammer       : "Hammer",
  spear        : "Spear",
  longsword    : "Longsword",
  mace         : "Mace",
  polearm      : "Polearm",
  maul         : "Maul",
  greatsword   : "Greatsword",
  club         : "Club",
  unarmed      : "Unarmed",
  shield       : "Shield",
  fusil        : "Fusil",
  bow          : "Bow",
  crossbow     : "Crossbow",
  pistolet     : "Pistolet",
  smallBeast   : "Small Beast",
  modestBeast  : "Modest Beast",
  largeBeast   : "Large Beast",
  giganticBeast: "Gigantic Beast",
}

export const weaponDamage: { [key: string]: Damage } = {
  sword        : [4, 6, 6, 6, 6, 8, 10],
  axe          : [2, 2, 6, 6, 8, 10, 12],
  knife        : [2, 2, 2, 2, 4, 8, 10],
  staff        : [2, 4, 4, 4, 4, 6, 8],
  hammer       : [1, 2, 4, 6, 8, 10, 12],
  spear        : [4, 4, 6, 6, 8, 8, 10],
  longsword    : [4, 6, 8, 8, 10, 12, 14],
  mace         : [2, 4, 4, 6, 6, 8, 10],
  polearm      : [2, 4, 4, 8, 12, 14, 18],
  maul         : [1, 2, 3, 6, 12, 13, 14],
  greatsword   : [2, 4, 8, 10, 12, 14, 18],
  club         : [1, 1, 2, 3, 6, 8, 10],
  unarmed      : [1, 1, 1, 2, 2, 3, 4],
  shield       : [2, 2, 2, 4, 4, 6, 8],
  fusil        : [2, 4, 4, 6, 12, 18, 24],
  bow          : [2, 4, 6, 8, 8, 10, 12],
  crossbow     : [4, 4, 6, 8, 8, 8, 10],
  pistolet     : [2, 2, 4, 4, 6, 12, 16],
  smallBeast   : [2, 2, 3, 3, 4, 5, 6],
  modestBeast  : [4, 6, 6, 8, 8, 10, 12],
  largeBeast   : [4, 6, 8, 10, 12, 14, 16],
  giganticBeast: [4, 8, 12, 12, 16, 18, 24],

};

interface IDamageSectionProps {
  damage?: number[],
  doesDamage?: boolean,
  damagesAs?: string,
  onChange: FormValueChangeHandler,
}

type DamageSectionProps = IDamageSectionProps;

const DamageSection: FunctionComponent<IDamageSectionProps> = (props: IDamageSectionProps) => {
  const {
    damage,
    doesDamage,
    damagesAs,
    onChange,

  } = props;
  const classes = useStyles();

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange([
               {
                 id   : event.target.id.slice(5),
                 value: event.target.checked,
               },
             ]);
  };

  function handleDamageChoice(e: ChangeEvent<{ name?: string; value: any; }>): any {
    const {
      value,
    } = e.target;

    onChange([
               {
                 id: "damagesAs",
                 value,
               }, {
        id   : "damage",
        value: value == "custom"
               ? damage
               : weaponDamage[value],
      },
             ]);

  }

  function handleCustomDamageChange(e: ChangeEvent<HTMLInputElement>): void {
    const index = parseInt(e.target.id.slice(12));
    const value = damage
                  ? [...damage]
                  : Array(7);
    value[index] = e.target.value;
    onChange([
               {
                 id: "damage",
                 value,
               },
             ]);
  }

  const disableCustomFields = !doesDamage || damagesAs !== "custom";

  return (
      <>
        <FormControl fullWidth
                     disabled={!doesDamage}
                     className={classes.selectControl}>
          <Select variant="outlined"
                  id="damagesAs"
                  value={damagesAs ?? 0}
                  name={"damagesAs"}
                  onChange={handleDamageChoice}>
            {Object.keys(weaponDamage)
                   .sort()
                   .map((weapon, index) => (
                       <MenuItem key={`${index}-${weapon}`}
                                 value={weapon}>{weapon}</MenuItem>))}
            <MenuItem key={`${Object.keys(weaponDamage).length}-custom`}
                      value={"custom"}>Custom</MenuItem>
          </Select>
        </FormControl>
        <Table size="small">
          <TableBody>
            <TableRow>
              {(
                  damage ?? Array(7))
                  .map((_, index) => (
                      <TableCell padding={"none"}
                                 key={`damage-cell-${index}`}>
                        <TextField disabled={disableCustomFields}
                                   InputLabelProps={{
                                     classes: {
                                       root: classes.damageRoot,
                                     },
                                   }}
                                   InputProps={{
                                     classes: {
                                       root : classes.damageRoot,
                                       input: classes.damageInput,
                                     },
                                   }}
                                   label={`${index + 1}${index == 6
                                                         ? "+"
                                                         : ""}`}
                                   onChange={handleCustomDamageChange}
                                   variant={"outlined"}
                                   id={`damage-cell-${index}`}
                                   type={"number"}
                                   value={damage?.[index] ??
                                          0} /></TableCell>))}
            </TableRow>
          </TableBody>
        </Table>
        <FormGroup row>
          <FormControlLabel control={<Checkbox disabled={!doesDamage}
                                               onChange={handleChecked}
                                               name="item-ranged" />}
                            label="Ranged" />
          <FormControlLabel control={<Checkbox disabled={!doesDamage}
                                               onChange={handleChecked}
                                               name="item-twoHanded" />}
                            label="Two Handed" />
          <FormControlLabel control={<Checkbox disabled={!doesDamage}
                                               onChange={handleChecked}
                                               name="item-armourPiercing" />}
                            label="Armour Piercing" />
        </FormGroup>
      </>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      DamageSection: {},
      damageRoot   : {
        marginTop: theme.spacing(1),
      },
      damageInput  : {
        marginLeft  : theme.spacing(2),
        marginRight : theme.spacing(1),
        paddingLeft : 0,
        paddingRight: 0,
        textAlign   : "center",
      },
      selectControl: {
        flexGrow: 1,
      },
    }));

export default DamageSection;
