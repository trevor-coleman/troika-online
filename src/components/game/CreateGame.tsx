import React, { FunctionComponent, useState } from 'react';
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

  const onCreate = (key: string) => {
    console.log(key);
  }

  return (
        <Paper className={classes.root}><Box p={2}>
          <Typography variant={"h5"}>Create Game</Typography>
          <TextField value={gameName}
                     placeholder={"New Game"}
                     onChange={(e) => setGameName(e.target.value)} className={classes.input} />
          <NewGameButton onCreate={onCreate}
                         navigate
                         template={gameName != ""
                                   ? {name: gameName}
                                   : undefined} />
        </Box></Paper>);

};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {flexGrow: 1},
      input: {width: "100%"}
    }));

export default CreateGame;
