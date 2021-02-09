import React, { FunctionComponent, ChangeEvent, useContext } from 'react';
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
  Switch,
} from '@material-ui/core';
import { Damage } from '../../../store/Schema';
import { FormValueChangeHandler, FormValueChange } from './FormValueChange';
import Grid from '@material-ui/core/Grid';
import { useFirebaseConnect, useFirebase } from 'react-redux-firebase';
import { useTypedSelector } from '../../../store';
import { CharacterContext } from '../../../views/CharacterContext';
import { ItemContext } from '../../../contexts/ItemContext';

export const weaponNames: { [key: string]: string } = {
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
};

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

const weaponAttributes: { [key: string]: { ranged?: boolean, armourPiercing?: boolean, twoHanded?: boolean } } = {
  hammer    : {
    armourPiercing: true,
  },
  mace      : {
    armourPiercing: true,
  },
  polearm   : {
    armourPiercing: true,
    twoHanded     : true,
  },
  maul      : {
    armourPiercing: true,
    twoHanded     : true,
  },
  greatsword: {
    twoHanded: true,
  },

  fusil        : {
    ranged: true,
    armourPiercing: true,
    twoHanded     : true,
  },
  bow          : {
    ranged: true,
    twoHanded: true,
  },
  crossbow     : {
    ranged: true,
    twoHanded: true,
  },
  pistolet     : {
    ranged: true,
    armourPiercing: true,
  },
  largeBeast   : {
    armourPiercing: true,

  },
  giganticBeast: {
    armourPiercing: true,
  },
};

interface IDamageSectionProps {
  onChange:FormValueChangeHandler
}

type DamageSectionProps = IDamageSectionProps;

const DamageSection: FunctionComponent<IDamageSectionProps> = (props: IDamageSectionProps) => {
  const {
    onChange
  } = props;
  const classes = useStyles();
  const {character} = useContext(CharacterContext);
  const item = useContext(ItemContext);
  const firebase = useFirebase();

  useFirebaseConnect([
      {path: `/items/${character}/${item}/damage`, storeAs:`/damageSection/${item}/damage`},
      {path: `/items/${character}/${item}/doesDamage`, storeAs:`/damageSection/${item}/doesDamage`},
      {path: `/characters/${character}/weapons`, storeAs:`/damageSection/${item}/weapons`},
      {path: `/items/${character}/${item}/damagesAs`, storeAs:`/damageSection/${item}/damagesAs`},
      {path: `/items/${character}/${item}/twoHanded`, storeAs:`/damageSection/${item}/twoHanded`},
      {path: `/items/${character}/${item}/ranged`, storeAs:`/damageSection/${item}/ranged`},
      {path: `/items/${character}/${item}/armourPiercing`, storeAs:`/damageSection/${item}/armourPiercing`},
                     ])

  const sectionInfo = useTypedSelector(state => state.firebase.data?.damageSection?.[item]) ?? {};

  const {damage = [0,0,0,0,0,0,0], weapons=[], doesDamage = false, damagesAs ="unarmed", twoHanded = false, ranged = false, armourPiercing = false} = sectionInfo;



  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {

    let {
      name   : id,
      checked: value,
    } = event.target;

    id = id.slice(5);

    const updates: FormValueChange<number | boolean>[] = [
      {
        id,
        value,
      },
    ];

    if(id=="doesDamage") {
      const newWeapons = weapons?.filter(weapon => weapon !== item) ?? [];
      console.log(newWeapons);

      if (value) {
        newWeapons.push(item);
      }

      firebase.ref(`/characters/${character}/weapons`).set(newWeapons);
    }

    onChange(updates);
  };

  function handleDamageChoice(e: ChangeEvent<{ name?: string; value: any; }>): any {
    const {
      value,
    } = e.target;

    const updates = [
      {
        id: "damagesAs",
        value,
      }, {
        id   : "damage",
        value: value == "custom"
               ? damage
               : weaponDamage[value],
      },
    ];

    const attributes = weaponAttributes[value];

        updates.push({
                       id   : "armourPiercing",
                       value: attributes?.armourPiercing ?? false,
                     });

        updates.push({
                       id   : "twoHanded",
                       value: attributes?.twoHanded ?? false,
                     });

    updates.push({
                   id   : "ranged",
                   value: attributes?.ranged ?? false,
                 });

        console.log(updates);

    onChange(updates);

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
      <Grid item
            container
            spacing={2}>
        <Grid item
              xs={3}>
          <FormControlLabel labelPlacement={"start"}
                            control={<Switch checked={doesDamage??false}
                                             onChange={handleChecked}
                                             id={"item-doesDamage"}
                                             name="item-doesDamage" />}
                            label={"Damage"} />
        </Grid>
        <Grid item
              xs={9}>
          <FormControl fullWidth
                       disabled={!doesDamage}>
            <Select variant="outlined"
                    id="damagesAs"
                    value={damagesAs ?? "unarmed"}
                    name={"damagesAs"}
                    onChange={handleDamageChoice}>
              {Object.keys(weaponDamage)
                     .sort()
                     .map((weapon, index) => (
                         <MenuItem key={`${index}-${weapon}`}
                                   value={weapon}>{weaponNames[weapon]}</MenuItem>))}
              <MenuItem key={`${Object.keys(weaponDamage).length}-custom`}
                        value={"custom"}>Custom</MenuItem>
            </Select>
          </FormControl>
          <Table size="small">
            <TableBody>
              <TableRow>
                {[0,0,0,0,0,0,0]
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
            <FormControlLabel control={<Checkbox
                checked={ranged}
                disabled={!doesDamage}
                                                 onChange={handleChecked}
                                                 name="item-ranged" />}
                              label="Ranged" />
            <FormControlLabel control={<Checkbox disabled={!doesDamage}
                                                 checked={twoHanded}
                                                 onChange={handleChecked}
                                                 name="item-twoHanded" />}
                              label="Two Handed" />
            <FormControlLabel control={<Checkbox disabled={!doesDamage}
                                                 checked={armourPiercing}
                                                 onChange={handleChecked}
                                                 name="item-armourPiercing" />}
                              label="Armour Piercing" />
          </FormGroup>
        </Grid>
      </Grid>
  )
}

const useStyles = makeStyles((theme: Theme) => (
    {
      formControl  : {margin: theme.spacing(1)},
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
    }));

export default DamageSection;
