import React, {
  FunctionComponent,
  ChangeEvent,
} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

interface INameInputProps {
  name:string,
  onChange: (e:ChangeEvent<HTMLInputElement>)=>void,
}



//COMPONENT
const NameInput: FunctionComponent<INameInputProps> = (props: INameInputProps) => {
  const {name, onChange}=props;
  useStyles();

    return (
      <TextField variant={"outlined"}
                 label={"Name"}
                 id={"item-name"}
                 value={name}
                 onChange={onChange}
                 placeholder={"New Item"}
                 fullWidth />);
};

const useStyles = makeStyles(() => (
    {
      root: {},
    }));

export default NameInput;
