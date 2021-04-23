import { FormControlLabel, Switch } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";

interface IStepInputProps {
  label: string,
  labelPosition?: "bottom" | "end" | "start" | "top",
  value: number,
  maximum?: number,
  onIncrease: ()=>void,
  onDecrease: ()=>void,
}

type StepInputProps = IStepInputProps;

const StepInput: FunctionComponent<IStepInputProps> = (props: IStepInputProps) => {
  const {
    label,
      labelPosition = "bottom",
    value,
      maximum,
    onDecrease,
    onIncrease
  } = props;
  const classes = useStyles();

  const isError = maximum !== undefined && maximum > 0 &&  value > maximum

  return (
      <div className={classes.Stepper}>

        <FormControlLabel
            control={(
                <div className={classes.counter}>
                  <IconButton size={'small'} className={classes.counterButton} onClick={onIncrease}>
                    <AddIcon />
                  </IconButton>
                  <Typography paragraph={false} className={isError ? classes.errorText : undefined }>{value}{maximum !== undefined && maximum > 0 ? ` / ${maximum}`:''}</Typography>
                  <IconButton size={'small'} className={classes.counterButton} onClick={onDecrease}>
                    <RemoveIcon />
                  </IconButton>
                </div>)}
            label={label ?? ""}
            labelPlacement={labelPosition}
        />
      </div>)
}


const useStyles = makeStyles((theme: Theme) => (
    {
      Stepper: {display: 'flex', flexDirection:'column', alignItems:'center'},
      counter: {display:'flex', flexDirection:'row', alignItems: 'center'},
      errorText: {color: theme.palette.error.main},
      counterButton: {
        paddingBottom:7,
        paddingTop: 7,
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
      },
    }));

export default StepInput;
