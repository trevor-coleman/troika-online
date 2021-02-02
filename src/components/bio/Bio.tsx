import React, {
  FunctionComponent,
  ChangeEvent,
  useState, useEffect,
} from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Paper, Avatar } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Character } from '../../store/Schema';
import { blankCharacter } from '../../store/templates';
import { useFirebaseConnect, useFirebase } from 'react-redux-firebase';
import { useCharacter } from '../../store/selectors';
import DragAndDrop from '../DragAndDrop';
import DragAndDropPortrait from './DragAndDropPortrait';

interface BioAndInfoProps {
  characterKey:string;

}

//COMPONENT
const Bio: FunctionComponent<BioAndInfoProps> = (props: BioAndInfoProps) => {
  const {characterKey} = props;
  const classes = useStyles();
  useFirebaseConnect({
    path: `/characters/${characterKey}`
  });
  const character = useCharacter(characterKey);
  const firebase = useFirebase();
  useEffect(() => {
    if (character) setValues({...blankCharacter, ...character});
  }, [character]);

  const [values, setValues] = useState<Partial<Character>>(blankCharacter);

  async function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>):Promise<void> {
    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });

    await firebase.ref(`/characters/${characterKey}/${e.target.id}`)
                  .set(e.target.value);
  }

  return (
   <div><Typography variant={"h5"}>
     Bio & Info
   </Typography>
  <Button onClick={() => {}}>Random BG</Button>

  <Paper>
    <Box p={2}>
      <form noValidate
            autoComplete={"off"}>
        <Grid container spacing={2}>
          <Grid container item xs={12} sm={4} md={3} alignItems={"center"} justify={"center"}>
            <Grid item><DragAndDropPortrait alt={character?.name??"avatar placeholder"} characterKey={characterKey}/></Grid>
          </Grid>
        <Grid item container
              xs={12} sm={8} md={8}
              direction={"row"}
              spacing={2}>
          <Grid item
                xs={12}
                sm={12}
                md={12}
                lg={6}>
            <TextField label={"name"}
                       variant={"outlined"}
                       fullWidth
                       id={"name"}
                       value={values.name}
                       onChange={handleChange} />
          </Grid>
          <Grid item
                xs={12}
                sm={12}
                md={12}
                lg={6}

          >
            <TextField label={"Background"}
                       variant={"outlined"}
                       fullWidth
                       id={"background"}
                       value={values.background}
                       onChange={handleChange} />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField label={"Special"}
                       variant={"outlined"}
                       fullWidth
                       rows={4}
                       id={"special"}
                       multiline
                       value={values.special}
                       onChange={handleChange} />
          </Grid>
        </Grid></Grid>
      </form>
    </Box></Paper>
   </div>
  )
};

// noinspection JSUnusedLocalSymbols
const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},

    }));

export default Bio;
