import React, {
  FunctionComponent, ChangeEvent, FocusEvent, useContext, useState, useEffect,
} from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import {
  FormControlLabel, Switch, FormGroup, TextField,
} from '@material-ui/core';
import { FormValueChangeHandler, FormValueChange } from './FormValueChange';
import { useFirebaseConnect } from 'react-redux-firebase';
import { useTypedSelector } from '../../../store';
import { ItemContext } from '../../../contexts/ItemContext';
import { CharacterContext } from '../../../views/CharacterContext';

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
  const [values, setValues] = useState({name:"", description:""})
  useFirebaseConnect([
                       {
                         path   : `/items/${character}/${item}/name`,
                         storeAs: `/basicInfoSection/${item}/name`
                       },
                       {
      path   : `/items/${character}/${item}/description`,
      storeAs: `/basicInfoSection/${item}/description`
    },

                     ])

  const sectionInfo = useTypedSelector(state => state.firebase.data?.basicInfoSection?.[item]) ??
                      {};

  useEffect(()=>{
    setValues(sectionInfo);
  },[sectionInfo]);

  console.log(sectionInfo);
  const {
    name="New Item",
      description = ""
  } = sectionInfo;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValues({
                ...values,
                [e.target.id.slice(6)]: e.target.value
              }
    );

  }



  function handleBlur(e:FocusEvent<HTMLInputElement>): any {
    console.log(e.target.id, e.target.value);
    onChange([
               {
                 id   : e.target.id.slice(6),
                 value: e.target.value,
               },
             ]);
  }

  return (
      <Grid item
            container
            spacing={2}><Grid item
                              xs={3}/>
        <Grid item
              xs={9} direction={"column"} container spacing={2}>
          <Grid item >
            <TextField
                fullWidth
                value={values.name ?? ""}
                       id={"basic-name"}
                       variant={"outlined"}
                       onChange={handleChange}
                       label={"Name"}
                       type={"text"}
                       InputLabelProps={{shrink: true}}
                      onBlur={handleBlur}/>
          </Grid>
          <Grid item>
            <TextField value={values.description ?? ""}
                       fullWidth
                       multiline
                       rows={4}
                       variant={"outlined"}
                       id={"basic-description"}
                       onChange={handleChange}
                       label={"Description"}
                       type={"text"}
                       InputLabelProps={{shrink: true}} />
          </Grid>
        </Grid></Grid>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      ChargesSection: {},
    }));

export default ChargesSection;
