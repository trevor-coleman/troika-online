import React, { FunctionComponent, ChangeEvent, useState } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import {
  FormControlLabel, Switch, FormControl, Select, MenuItem, TextField, FormGroup,
} from '@material-ui/core';
import { FormValueChange, FormValueChangeHandler } from './FormValueChange';

interface IArmourSectionProps {
  enabled: boolean;
  protection: number | undefined;
  onChange: FormValueChangeHandler,
}

interface ArmourEnabledUpdate extends FormValueChange<boolean> {
  id: "protects",
  value: boolean,
}

interface ProtectionUpdate extends FormValueChange<number> {
  id: "protection",
  value: number,
}

const useStyles = makeStyles((theme: Theme) => (
    {
      ArmourSection: {},
      selectControl: {
        flexGrow: 1,
      },
    }));

const ArmourSection: FunctionComponent<IArmourSectionProps> = (props: IArmourSectionProps) => {
  const {
    enabled,
    protection,
    onChange,
  } = props;
  const classes = useStyles();
  const selectOptions = ["Unarmoured", "Light", "Medium", "Heavy"];

  const [selected, setSelected] = useState(typeof protection === 'undefined' ||
                                           protection > 0 || protection < -3
                                           ? 1
                                           : protection);
  const [customValue, setCustomValue] = useState(protection);
  const [custom, setCustom] = useState(false);

  let handleEnabled: (e: ChangeEvent<HTMLInputElement>) => void = (e) => {
    onChange([
               {
                 id   : "protects",
                 value: e.target.checked,
               },
             ]);
  };

  function handleSelectProtection(e: ChangeEvent<{ value: any; }>): void {

    const {value} = e.target;
    let size;

    if (value > 0)
    {
      setCustomValue(selected);
      size=selected;
      setCustom(true);
      setSelected(value);
    }
    else
    {
      setCustomValue(value);
      setCustom(false);
      size = value;
    }

    onChange([
               {
                 id: "protection",
                 value: size,
               }
             ]);

    setSelected(value);
  }

  function handleProtectionChange(e: ChangeEvent<HTMLInputElement>) {
    console.log("protection change", e.target.value);

    let value: number = parseInt(e.target.value);
    value = value <= 0
                   ? value
                   : 0;
    setCustomValue(value);
    onChange([
               {
                 id: 'protection',
                 value,
               },
               {
                 id: 'size',
                 value: value * -2
               }
             ]);

  }

  return (
      <><Grid item
              xs={3}>
        <FormControlLabel labelPlacement={"start"}
                          control={<Switch checked={enabled}
                                           onChange={handleEnabled}
                                           id={"item-protects"}
                                           name="item-protects" />}
                          label={"Armour"} />
      </Grid>
        <Grid item
              xs={9}>
          <FormGroup row><FormControl disabled={!enabled}
                                      className={classes.selectControl}>
            <Select variant={"outlined"}
                    id={"protection"}
                    value={selected}
                    name={"protection"}
                    onChange={handleSelectProtection}>
              {selectOptions.map((item, index) =>
                                     <MenuItem key={`select-protection-${selected}-${index}`}
                                               value={-index}>{`${item}`}</MenuItem>)}
              <MenuItem value={1}>Custom</MenuItem>
            </Select>
          </FormControl>
            <TextField disabled={!enabled || !custom}
                       variant={"outlined"}
                       label={"Damage Reduction"}
                       type={"number"}
                       value={customValue ?? 0}
                       onChange={handleProtectionChange} />
          </FormGroup>
        </Grid></>);
};

export default ArmourSection;
