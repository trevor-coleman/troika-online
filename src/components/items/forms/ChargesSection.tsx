import React, { FunctionComponent, ChangeEvent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import {
  FormControlLabel, Switch, FormGroup, TextField,
} from '@material-ui/core';
import { FormValueChangeHandler, FormValueChange } from './FormValueChange';

interface IChargesSectionProps {
  charges?: { initial?: number, max?: number },
  hasCharges?: boolean,
  onChange: FormValueChangeHandler
}

type ChargesSectionProps = IChargesSectionProps;

const ChargesSection: FunctionComponent<IChargesSectionProps> = (props: IChargesSectionProps) => {
  const {
    hasCharges,
    charges,
    onChange,
  } = props;
  const classes = useStyles();

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

    onChange(updates);
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {

    let {
      id,
      value,
    } = e.target;
    id = id.slice(8);
    const intValue = parseInt(value);

    const newCharges = {
      ...charges,
      [id]: intValue,
    };


    if (id == "initial" && newCharges?.initial && newCharges?.max &&
        newCharges.initial > newCharges.max)
    {
      newCharges.max = newCharges.initial;
    }

    if (id == "max" && newCharges?.initial && newCharges?.max &&
        newCharges.max < newCharges.initial)
    {
      newCharges.initial = newCharges.max;
    }

    onChange([
               {
                 id   : "charges",
                 value: newCharges,
               },
             ]);

  }

  return (
      <Grid item
            container
            spacing={2}><Grid item
                              xs={3}>
        <FormControlLabel labelPlacement={"start"}
                          control={<Switch checked={hasCharges}
                                           onChange={handleChecked}
                                           id={"item-hasCharges"}
                                           name="item-hasCharges" />}
                          label={"Charges"} />
      </Grid>
        <Grid item
              xs={9}>
          <FormGroup row>
            <TextField value={charges?.initial ?? 0}
                       disabled={!hasCharges}
                       id={"charges-initial"}
                       variant={"outlined"}
                       onChange={handleChange}
                       label={"Initial"}
                       type={"number"}
                       InputLabelProps={{shrink: true}} />
            <TextField value={charges?.max ?? 0}
                       variant={"outlined"}
                       id={"charges-max"}
                       onChange={handleChange}
                       disabled={!hasCharges}
                       label={"Max"}
                       type={"number"}
                       InputLabelProps={{shrink: true}} /> </FormGroup>
        </Grid></Grid>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      ChargesSection: {},
    }));

export default ChargesSection;
