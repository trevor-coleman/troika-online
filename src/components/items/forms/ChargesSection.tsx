import React, { FunctionComponent, ChangeEvent, useContext } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import {
  FormControlLabel, Switch, FormGroup, TextField,
} from '@material-ui/core';
import { FormValueChangeHandler, FormValueChange } from './FormValueChange';
import { useFirebaseConnect } from 'react-redux-firebase';
import { useTypedSelector } from '../../../store';
import { ItemContext } from '../../../contexts/ItemContext';
import { CharacterContext } from '../../../contexts/CharacterContext';

interface IChargesSectionProps {
  onChange: FormValueChangeHandler
}

type ChargesSectionProps = IChargesSectionProps;

const ChargesSection: FunctionComponent<IChargesSectionProps> = (props: IChargesSectionProps) => {
  const {
    onChange,
  } = props;
  const item=useContext(ItemContext);
  const {character} = useContext(CharacterContext)

  useFirebaseConnect([
                       {
                         path   : `/items/${character}/${item}/hasCharges`,
                         storeAs: `/chargesSection/${item}/hasCharges`
                       },
                       {
      path   : `/items/${character}/${item}/charges`,
      storeAs: `/chargesSection/${item}/charges`
    },

                     ])

  const sectionInfo = useTypedSelector(state => state.firebase.data?.chargesSection?.[item]) ??
                      {};

  console.log(sectionInfo);
  const {
    hasCharges = false,
      charges = {initial: 0, max: 0}
  } = sectionInfo;

  const {max = 0, initial = 0} = charges ?? {};

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

    console.log(updates);
    onChange(updates);
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {

    const charges = {initial, max};

    let {
      id,
      value,
    } = e.target;
    id = id.slice(8);
    let intValue = parseInt(value);
    intValue = intValue < 0 ? 0 : intValue;

    const newCharges = {
      ...charges,
      [id]: intValue,
    };


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
                          control={<Switch checked={hasCharges ?? false}
                                           onChange={handleChecked}
                                           id={"item-hasCharges"}
                                           name="item-hasCharges" />}
                          label={"Charges"} />
      </Grid>
        <Grid item
              xs={9}>
          <FormGroup row>
            <TextField value={initial ?? 0}
                       disabled={!hasCharges}
                       id={"charges-initial"}
                       variant={"outlined"}
                       onChange={handleChange}
                       label={"Current"}
                       type={"number"}
                       InputLabelProps={{shrink: true}} />
            <TextField value={max ?? 0}
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
