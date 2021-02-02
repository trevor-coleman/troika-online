import React, {
  FunctionComponent, useState, ChangeEvent, useEffect,
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

interface EditSkillDialogProps {
  open: boolean;
  onClose: () => void;
  skillKey: string;
  character: string | null;
}

//COMPONENT
const EditSkillDialog: FunctionComponent<EditSkillDialogProps> = (props: EditSkillDialogProps) => {
  const {
    open,
    onClose,
    character,
      skillKey
  } = props;
  const auth = useAuth();
  const firebase = useFirebase();
  useFirebaseConnect([`skills/${skillKey}`]);
  const skill = useSkill(skillKey)

  const [values, setValues] = useState<Partial<Skill>>({
    description: '',
    name: '',
  });

  const [oldValues, setOldValues] = useState<Partial<Skill>>({
    description: '',
    name: '',
  });

  const [firstLoad, setFirstLoad] = useState(true);


  useEffect(()=> {
    if (isLoaded(skill)) {
      if(firstLoad) {
        setOldValues(skill);
        setFirstLoad(false);
      };
      setValues(skill);

    }
  }, [skill, firstLoad])


  const handleClose = async (undo?:boolean)=> {
    setFirstLoad(true);
    if(undo) {
      await firebase.ref(`/skills/${skillKey}`)
                    .update(oldValues);
    }
    onClose();
  }

  async function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });

    await firebase.ref(`/skills/${skillKey}/${e.target.id}`).set(e.target.value);
  }


  const isValid = values.name?.length && values.name.length > 0;

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
