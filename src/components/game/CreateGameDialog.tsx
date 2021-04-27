import Button from '@material-ui/core/Button';
import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {
  TextField, Paper, Dialog, DialogTitle, DialogActions, DialogContent,
} from '@material-ui/core';
import NewGameButton from './NewGameButton';

interface CreateGameProps {
  open: boolean,
  onClose: () => void;
}

//COMPONENT
const CreateGameDialog: FunctionComponent<CreateGameProps> = (props: CreateGameProps) => {
  const {open, onClose} = props;
  const classes = useStyles();

  const [gameName, setGameName] = useState("")
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const onCreate = (key: string) => {}

  const onFail = (message:string) => {
    setIsError(true);
    setErrorMessage(message);
  }

  const handleChange = (e:ChangeEvent<HTMLTextAreaElement | HTMLInputElement >) => {
    setIsError(false);
    setErrorMessage("");
    setGameName(e.target.value);
  }

  return (
      <Dialog
          maxWidth={'xs'}
          fullWidth
          open={open}
          onClose={onClose}>
        <DialogTitle>Create Game</DialogTitle>
          <DialogContent><TextField value={gameName}
                     error={isError}
                     label={"Name of Game"}
                     variant={'outlined'}
                     placeholder={"Saturday Night Troika Group"}
                     onChange={handleChange} className={classes.input} />
        {isError
         ? <Typography color={'error'}>{errorMessage}</Typography>
         : ""}</DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <NewGameButton onCreate={onCreate}
                         onFail={onFail}
                         navigate
                         template={gameName != ""
                                   ? {name: gameName}
                                   : undefined} />
            </DialogActions>
        </Dialog>);

};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {flexGrow: 1},
      input: {width: "100%"}
    }));

export default CreateGameDialog;
