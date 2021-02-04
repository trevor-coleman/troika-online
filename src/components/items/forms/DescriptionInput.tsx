import React, { FunctionComponent, ChangeEvent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

interface IDescriptionInputProps {
  description:string;
  onChange: (e:ChangeEvent<HTMLInputElement>)=>void;
}

type DescriptionInputProps = IDescriptionInputProps;

const useStyles = makeStyles((theme: Theme) => (
    {
      DescriptionInput: {},
    }));

const DescriptionInput = (props: DescriptionInputProps) => {
  const {description, onChange}=props;
  const classes = useStyles();

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
