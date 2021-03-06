import React, { ChangeEvent, useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Paper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Character } from '../../store/Schema';
import { blankCharacter } from '../../store/templates';
import {
  useFirebaseConnect, useFirebase, isLoaded,
} from 'react-redux-firebase';
import DragAndDropPortrait from './DragAndDropPortrait';
import { useTypedSelector } from '../../store';
import { Popper } from '@material-ui/core';

interface BioAndInfoProps {
  characterKey: string;
}

//COMPONENT
const Bio = (props: BioAndInfoProps) => {
  const {characterKey} = props;
  useFirebaseConnect([
      {path: `/characters/${characterKey}/name`, storeAs: `/bio/${characterKey}/name` },
      {path: `/characters/${characterKey}/background`, storeAs: `/bio/${characterKey}/background` },
      {path: `/characters/${characterKey}/special`, storeAs: `/bio/${characterKey}/special` },
                     ]);

  const name = useTypedSelector(state => state.firebase.data?.bio?.[characterKey]?.name);
  const special = useTypedSelector(state => state.firebase.data?.bio?.[characterKey]?.special);
  const background = useTypedSelector(state => state.firebase.data?.bio?.[characterKey]?.background);
  const firebase = useFirebase();

  useEffect(()=>{},[name,special, background])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    firebase.ref(`/characters/${characterKey}`).update({
                                                         [e.target.id]: e.target.value,
                                                       });
  };

  return (
      <div>
        <Paper>
          <Box p={2}>
            <form noValidate
                  autoComplete={"off"}>
              <Grid container
                    spacing={2}>
                <Grid container
                      item
                      xs={12}
                      sm={4}
                      md={3}
                      alignItems={"center"}
                      justify={"center"}>
                  <Grid item><DragAndDropPortrait alt={name ??
                                                       "avatar placeholder"}
                                                  characterKey={characterKey} /></Grid>
                </Grid>
                <Grid item
                      container
                      xs={12}
                      sm={8}
                      md={6}
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
                               value={name ?? ""}
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
                               value={background ?? ""}
                               onChange={handleChange} />
                  </Grid>
                  <Grid item
                        xs={12}
                        md={12}>
                    <TextField label={"Special"}
                               variant={"outlined"}
                               fullWidth
                               rows={4}
                               id={"special"}
                               multiline
                               value={special ?? ""}
                               onChange={handleChange} />
                  </Grid>
                </Grid></Grid>
            </form>
          </Box></Paper>
      </div>);
};

// noinspection JSUnusedLocalSymbols
const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},

    }));

export default Bio;
