import React, {
  FunctionComponent,
  ChangeEvent,
  KeyboardEvent,
  FocusEvent,
  useContext,
  useState,
  useEffect, useRef,
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
import { CharacterContext } from '../../../contexts/CharacterContext';

interface IChargesSectionProps {
  onChange: FormValueChangeHandler
}

interface EventTarget {
  value: any;
  id: string;
}

type ChargesSectionProps = IChargesSectionProps;

const ChargesSection: FunctionComponent<IChargesSectionProps> = (props: IChargesSectionProps) => {
  const {
    onChange,
  } = props;
  const item=useContext(ItemContext);
  const {character, editable} = useContext(CharacterContext)
  const [values, setValues] = useState({name:"", description:""})
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
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
    console.log("blur");

    onChange([
               {
                 id   : e.target.id.slice(6),
                 value: e.target.value,
               },
             ]);
  }



  function handleKey(e:React.KeyboardEvent<HTMLInputElement>): void {
    if(e.key  == "Escape"){
      // @ts-ignore
      document.activeElement?.blur();
    }

    if (e.key == "Enter") {
      // @ts-ignore
      const {id, value}:{id:string, value:string} = e.target;
      onChange([{
                 id: id.slice(6),
               value
               }])

      if(id.includes("name")) { // @ts-ignore
        document.activeElement?.blur();
      }


    }

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
                disabled={!editable}
                value={values.name ?? ""}
                inputRef={nameRef}
                       id={"basic-name"}
                       variant={"outlined"}
                       onChange={handleChange}
                       label={"Name"}
                       type={"text"}
                       InputLabelProps={{shrink: true}}
                      onBlur={handleBlur}
                  onKeyDown={handleKey}/>
          </Grid>
          <Grid item>
            <TextField
                ref={descriptionRef}
                disabled={!editable}
                value={values.description ?? ""}
                       fullWidth
                       multiline
                       rows={4}
                       variant={"outlined"}
                       id={"basic-description"}
                       onChange={handleChange}
                       label={"Description"}
                       type={"text"}
                       InputLabelProps={{shrink: true}}
                       onBlur={handleBlur}
                       onKeyDown={handleKey}
            />
          </Grid>
        </Grid></Grid>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      ChargesSection: {},
    }));

export default ChargesSection;
