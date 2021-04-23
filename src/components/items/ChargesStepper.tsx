import React, { FunctionComponent, useContext } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import { CharacterContext } from '../../contexts/CharacterContext';
import StepInput from '../utility/StepInput';

interface IChargesStepperProps {
  item: string,
  labelPosition?: "bottom" | "end" | "start" | "top",
  label?: string,
}

type ChargesStepperProps = IChargesStepperProps;

export type ChargesStepperState = {
  charges: {
    initial: number, max: number,
  }
}

const ChargesStepper: FunctionComponent<IChargesStepperProps> = (props: IChargesStepperProps) => {
  const {
    item,
      label = "Charges",
    labelPosition = "bottom",
  } = props;
  const classes = useStyles();
  const {character} = useContext(CharacterContext);
  useFirebaseConnect({
    path: `/items/${character}/${item}/charges`,
    storeAs: `/chargesStepper/${item}/charges`,
  });
  const firebase = useFirebase();

  const {charges} = useTypedSelector(state => state.firebase.data?.chargesStepper?.[item]) ??
                    {};
  const handleChange = (amount: number) => {
    firebase.ref(`/items/${character}/${item}/charges/initial`)
            .set((
                     charges?.initial ?? 0) + amount);
  };

  return (
      <div className={classes.ChargesStepper}>
        <StepInput
            label={label}
            labelPosition={labelPosition}
            value={charges?.initial ?? 0}
            maximum={charges?.max}
            onDecrease={() => handleChange(-1)}
            onIncrease={() => handleChange(1)} />
      </div>);
  0;
};

const useStyles = makeStyles((theme: Theme) => (
    {
      ChargesStepper: {},
    }));

export default ChargesStepper;
