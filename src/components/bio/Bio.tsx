import React, {
  FunctionComponent,
  ChangeEvent,
  useState, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
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

interface BioAndInfoProps {
  characterKey:string;

}

//COMPONENT
const Bio: FunctionComponent<BioAndInfoProps> = (props: BioAndInfoProps) => {
  const {characterKey} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  useFirebaseConnect({
    path: `/characters/${characterKey}`
  });
  const character = useCharacter(characterKey);
  const firebase = useFirebase();
  useEffect(() => {
    if (character) setValues({...blankCharacter, ...character});
  }, [character]);

  const [values, setValues] = useState<Partial<Character>>(blankCharacter);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): any {
    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });

    firebase.ref(`/characters/${characterKey}/${e.target.id}`)
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
            <Grid item><Avatar alt={character?.name ?? "avatar-placeholder"} src={"https://yt3.ggpht.com/ytc/AAUvwnjNN87SwFXqcv0Pl21LCRvAd-cmUDmv5uAY6mH8_w=s900-c-k-c0x00ffffff-no-rj"} className={classes.avatar} ></Avatar></Grid>
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

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      avatar: {
        width: "100%",
        height: "100%",
        maxHeight: 175,
        maxWidth: 175
      }
    }));

export default Bio;
