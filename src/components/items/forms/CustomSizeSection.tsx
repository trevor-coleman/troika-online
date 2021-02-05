import React, { FunctionComponent, ChangeEvent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import { FormControlLabel, Switch, TextField } from '@material-ui/core';
import { FormValueChangeHandler } from './FormValueChange';

interface ICustomSizeSectionProps {
  customSize: boolean;
  size: number;
  onChange: FormValueChangeHandler;
}

type CustomSizeSectionProps = ICustomSizeSectionProps;

const CustomSizeSection: FunctionComponent<ICustomSizeSectionProps> = (props: ICustomSizeSectionProps) => {
  const {
    customSize,
    size,
    onChange,
  } = props;
  const classes = useStyles();

  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    onChange([
               {
                 id   : event.target.id.slice(5),
                 value: event.target.checked,
               },
             ]);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange([
               {
                 id   : e.target.id.slice(5),
                 value: e.target.value,
                 source: "customSizeSection"
               },
             ]);

    console.log({
                  id   : e.target.id.slice(5),
                  value: e.target.value,
                });
  };
  return (
      <Grid item
            container
            spacing={2}>
        <Grid item
              xs={3}>
          <FormControlLabel labelPlacement={"start"}
                            control={<Switch checked={customSize}
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

const useStyles = makeStyles((theme: Theme) => (
    {
      CustomSizeSection: {},
    }));

export default CustomSizeSection;
