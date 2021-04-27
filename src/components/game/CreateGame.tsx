import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { TextField, Paper } from '@material-ui/core';
import NewGameButton from './NewGameButton';

interface CreateGameProps {
}

//COMPONENT
const CreateGame: FunctionComponent<CreateGameProps> = (props: CreateGameProps) => {
  const {} = props;
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
        <Paper className={classes.root}><Box p={2}>
          <Typography variant={"h5"}>Create Game</Typography>
          <TextField value={gameName}
                     error={isError}
                     label={"Name of Game"}
                     variant={'outlined'}
                     placeholder={"Saturday Night Troika Group"}
                     onChange={handleChange} className={classes.input} />
          <NewGameButton onCreate={onCreate}
                         onFail={onFail}
                         navigate
                         template={gameName != ""
                                   ? {name: gameName}
                                   : undefined} />
          {isError ? <Typography color={'error'}>{errorMessage}</Typography>:""}
        </Box></Paper>);

};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {flexGrow: 1},
      input: {width: "100%"}
    }));

export default CreateGame;
