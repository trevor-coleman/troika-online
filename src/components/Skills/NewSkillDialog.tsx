import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  DialogTitle, DialogContent, TextField, Dialog,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Skill } from '../../store/Schema';
import { useAuth } from '../../store/selectors';
import { useFirebase } from 'react-redux-firebase';

interface NewSkillDialogProps {
  open: boolean;
  onClose: () => void;
  skillKey?: string;
  character: string | null;
}

//COMPONENT
const NewSkillDialog: FunctionComponent<NewSkillDialogProps> = (props: NewSkillDialogProps) => {
  const {
    open,
    onClose,
    character,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useAuth();
  const firebase = useFirebase();

  const [values, setValues] = useState<Partial<Skill>>({
    description: '',
    name: '',
  });

  function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): any {
    console.log(values);
    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });
  }

  async function saveSkill() {
    const skillRef = firebase.ref('/skills')
                             .push({
                               ...values,
                               owner: auth.uid,
                               character,
                             });
    if (skillRef.key) onClose();

  }

  const isValid = values.name?.length && values.name.length > 0;

  return (
      <Dialog open={open}
              onClose={onClose}
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
                         value={values.name}
                         onChange={handleChange}
                         placeholder={"New Skill"}
                         fullWidth />
            </Grid>
            <Grid item>
              <TextField variant={"outlined"}
                         multiline
                         id={"description"}
                         value={values.description}
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
                <Button onClick={onClose}
                        variant={"outlined"}
                        fullWidth>Cancel</Button>
              </Grid>
              <Grid item
                    xs={3}>
                <Button disabled={!isValid}
                        onClick={saveSkill}
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

export default NewSkillDialog;
