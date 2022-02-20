import React, { ChangeEvent } from 'react';
import { makeStyles} from "@material-ui/core/styles";
import { TextField } from '@material-ui/core';

interface IDescriptionInputProps {
  description:string;
  onChange: (e:ChangeEvent<HTMLInputElement>)=>void;
}

type DescriptionInputProps = IDescriptionInputProps;

const useStyles = makeStyles(() => (
    {
      DescriptionInput: {},
    }));

const DescriptionInput = (props: DescriptionInputProps) => {
  const {description, onChange}=props;
  useStyles();

    return (
      <TextField variant={"outlined"}
                 multiline
                 id={"item-description"}
                 value={description}
                 onChange={onChange}
                 label={"description"}
                 rows={2}
                 fullWidth />);
};

export default DescriptionInput;
