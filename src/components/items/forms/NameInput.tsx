import React, {
  FunctionComponent,
  PropsWithChildren, ChangeEvent,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import { useAuth } from '../../../store/selectors';
import { TextField } from '@material-ui/core';

interface INameInputProps {
  name:string,
  onChange: (e:ChangeEvent<HTMLInputElement>)=>void,
}



//COMPONENT
const NameInput: FunctionComponent<INameInputProps> = (props: INameInputProps) => {
  const {name, onChange}=props;
  const classes = useStyles();

  return (
      <TextField variant={"outlined"}
                 label={"Name"}
                 id={"item-name"}
                 value={name}
                 onChange={onChange}
                 placeholder={"New Item"}
                 fullWidth />);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default NameInput;
