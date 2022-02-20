import { DeleteOutline } from '@material-ui/icons';
import React, {
  FunctionComponent, ChangeEvent, useContext,
} from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  DialogTitle, DialogContent, TextField, Dialog, FormControlLabel, Switch,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useAuth} from '../../store/selectors';
import {
  useFirebase, useFirebaseConnect,
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
  useAuth();
    const classes = useStyles();
  const firebase = useFirebase();
  const {character} = useContext(CharacterContext);
  useFirebaseConnect([
      {path:`skills/${character}/${skill}`,
        storeAs: `editSkill/${skill}`
      }]);

  const {name, description, isSpell, staminaCost} = useTypedSelector(state=> state.firebase.data.editSkill?.[skill]) ?? {}

  const handleDelete = async ()=> {
    await firebase.ref(`/skills/${character}/${skill}/`).set(null)
    await firebase.ref(`/characters/${character}/skillList`).once('value',(snap)=>{
      if(!snap.val()) return;
      const skillList = snap.val();
      const newList = skillList.filter((id:string)=>id!==skill);
      firebase.ref(`/characters/${character}/skillList`).set(newList);
    })
    onClose();

  }

  const handleClose = async ()=> {
    onClose();
  }

  async function handleToggle(isChecked:boolean) {
    await firebase.ref(`/skills/${character}/${skill}/isSpell/`).set(isChecked);
  }

  async function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    await firebase.ref(`/skills/${character}/${skill}/${e.target.id}`).set(e.target.value);
  }


  const isValid = name?.length && name.length > 0;

  return (
      <Dialog open={open}
              onClose={()=>handleClose()}
              maxWidth={"xs"}
              fullWidth>
        <DialogTitle>{name ?? "Unnamed Skill"}</DialogTitle>
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
            <Grid
                item
                container
                direction={"row"}
                xs={12}>
              <Grid
                  item
                  xs={4}
                  className={classes.checkboxGrid}><FormControlLabel
                  labelPlacement={"end"}
                  control={<Switch
                      checked={isSpell ?? false}
                      onChange={(e)=>handleToggle(e.target.checked)}
                      id={"is-spell"}
                      name="is-spell" />}
                  label={"Spell"} /></Grid>
              <Grid
                  item
                  xs={8}><TextField
                  variant={"outlined"}
                  disabled={!isSpell}
                  label={"Stamina Cost"}
                  id={"staminaCost"}
                  value={staminaCost ?? 0}
                  type={"number"}
                  onChange={handleChange}
                  fullWidth />
              </Grid>
            </Grid>
            <Grid item
                  container
                  direction={"row"}
                  spacing={1}>
              <Grid
                  item
                  xs={3}>
                <Button
                    startIcon={<DeleteOutline/>}
                    onClick={handleDelete}
                    color={"secondary"}
                    variant={"outlined"}
                    fullWidth>Delete</Button>
              </Grid>
              <Grid
                  item
                  xs={3} />
              <Grid item
                    xs={3}>
                <Button onClick={()=>handleClose()}
                        variant={"outlined"}
                        fullWidth>Cancel</Button>
              </Grid>
              <Grid item
                    xs={3}>
                <Button disabled={!isValid}
                        onClick={()=>handleClose()}
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
      checkboxGrid: {padding: theme.spacing(1)},
    }));

export default EditSkillDialog;
