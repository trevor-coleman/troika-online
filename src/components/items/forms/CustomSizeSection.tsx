import React, { FunctionComponent, ChangeEvent, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import { FormControlLabel, Switch, TextField } from '@material-ui/core';
import updateInventoryPositions from '../../../api/updateInventoryPositions';
import { FormValueChangeHandler } from './FormValueChange';
import { useFirebaseConnect } from 'react-redux-firebase';
import { useTypedSelector } from '../../../store';
import { CharacterContext } from '../../../contexts/CharacterContext';
import { ItemContext } from '../../../contexts/ItemContext';

interface ICustomSizeSectionProps {
  onChange: FormValueChangeHandler;
}

type CustomSizeSectionProps = ICustomSizeSectionProps;

const CustomSizeSection: FunctionComponent<CustomSizeSectionProps> = (props: CustomSizeSectionProps) => {
  const {
    onChange,
  } = props;


  const {character} = useContext(CharacterContext);
  const item = useContext(ItemContext);

  useFirebaseConnect([
                       {
                         path   : `/items/${character}/${item}/customSize`,
                         storeAs: `/customSizeSection/${item}/customSize`
                       }, {
      path   : `/items/${character}/${item}/size`,
      storeAs: `/customSizeSection/${item}/size`
    }

                     ])

  const sectionInfo = useTypedSelector(state => state.firebase.data?.customSizeSection?.[item]) ??
                      {};
  const {
    customSize = false,
      size = 1
  } = sectionInfo;

  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    onChange([
               {
                 id   : event.target.id.slice(5),
                 value: event.target.checked,
               },
             ]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const id= e.target.id.slice(5)
    const value  = id == "size" ? parseInt(e.target.value) : e.target.value;

    onChange([
               {
                 id,
                 value,
                 source: "customSizeSection"
               },
             ]);

    updateInventoryPositions(character, new Date().toString())

  };
  return (
      <Grid item
            container
            spacing={2}>
        <Grid item
              xs={3}>
          <FormControlLabel labelPlacement={"start"}
                            control={<Switch checked={customSize ?? false}
                                             onChange={handleChecked}
                                             id={"item-customSize"}
                                             name="item-customSize" />}
                            label={"Custom Size"} />
        </Grid>
        <Grid item
              xs={9}>
          <TextField fullWidth
                     type={"number"}
                     id={"item-size"}
                     variant={"outlined"}
                     label={"Size"}
                     disabled={!customSize}
                     onChange={handleChange}
                     value={size ?? 1}
                     InputLabelProps={{shrink: true}} />
        </Grid>
      </Grid>);
};


export default CustomSizeSection;
