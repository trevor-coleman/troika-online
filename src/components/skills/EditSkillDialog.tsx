import React, {
  FunctionComponent, useState, ChangeEvent, useEffect, useContext,
} from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  DialogTitle, DialogContent, TextField, Dialog,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Skill } from '../../store/Schema';
import { useAuth, useSkill } from '../../store/selectors';
import {
  useFirebase, useFirebaseConnect, isLoaded,
} from 'react-redux-firebase';
import { CharacterContext } from '../../contexts/CharacterContext';
import { useTypedSelector } from '../../store';

interface EditSkillDialogProps {
  open: boolean;
  onClose: () => void;
  skill: string;
}

//COMPONENT
const EditSkillDialog: FunctionComponent<EditSkillDialogProps> = (props: EditSkillDialogProps) => {
  const {
    open,
    onClose,
      skill
  } = props;
  const auth = useAuth();
  const firebase = useFirebase();
  const {character} = useContext(CharacterContext);
  useFirebaseConnect([
      {path:`skills/${character}/${skill}`,
        storeAs: `editSkill/${skill}`
      }]);

  const {name, description} = useTypedSelector(state=> state.firebase.data.editSkill?.[skill]) ?? {}


  const handleClose = async (undo?:boolean)=> {
    onClose();
  }

  async function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    await firebase.ref(`/skills/${character}/${skill}/${e.target.id}`).set(e.target.value);
  }


  const isValid = name?.length && name.length > 0;

  return (
      <Dialog open={open}
              onClose={()=>handleClose(false)}
              maxWidth={"xs"}
              fullWidth>
        <DialogTitle>New Skill</DialogTitle>
        <DialogContent>
          <Grid container
                direction={"column"}
                spacing={1}>
            <Grid item>
              <TextField variant={"outlined"}
                         label={"Name"}
                         id={"name"}
                         value={name ?? ""}
                         onChange={handleChange}
                         placeholder={"New Skill"}
                         fullWidth />
            </Grid>
            <Grid item>
              <TextField variant={"outlined"}
                         multiline
                         id={"description"}
                         value={description ?? ""}
                         onChange={handleChange}
                         label={"description"}
                         rows={4}
                         fullWidth />
            </Grid>
            <Grid item
                  container
                  direction={"row"}
                  spacing={1}>
              <Grid item
                    xs={6} />
              <Grid item
                    xs={3}>
                <Button onClick={()=>handleClose(true)}
                        variant={"outlined"}
                        fullWidth>Discard</Button>
              </Grid>
              <Grid item
                    xs={3}>
                <Button disabled={!isValid}
                        onClick={()=>handleClose(false)}
                        color={'primary'}
                        variant={"contained"}
                        fullWidth>Save</Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default EditSkillDialog;
