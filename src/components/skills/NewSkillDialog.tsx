import React, {
  FunctionComponent, useState, ChangeEvent,
} from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  DialogTitle,
  DialogContent,
  TextField,
  Dialog,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Skill } from '../../store/Schema';

interface NewSkillDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (newSkill: Partial<Skill>) => void;
  clearOnCreate?: boolean;
  defaultSpell?: boolean;
}



//COMPONENT
const NewSkillDialog: FunctionComponent<NewSkillDialogProps> = (props: NewSkillDialogProps) => {
  const {
    open,
    onClose,
    onCreate,
    clearOnCreate,
    defaultSpell,
  } = props;

  const classes = useStyles();

  const initialValues: Partial<Skill> = {
    description: '',
    name       : '',
    isSpell    : defaultSpell ?? false,
    staminaCost: 0,
  }

  const [values, setValues] = useState<Partial<Skill>>(initialValues);

  const handleToggle = (e: any) => {
    setValues({
      ...values,
      isSpell: e.target.checked,
    });
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    console.log(e.target.value);
    if (e.target.id === 'staminaCost') {
      const staminaCost = parseInt(e.target.value) >= 0
                          ? parseInt(e.target.value)
                          : 0;

      setValues({
        ...values,
        staminaCost,
      });
      console.log(values);
      return;
    }
    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });
    console.log(values);
    return;
  };

  function saveSkill() {
    onCreate(values);
    if (clearOnCreate) {
      setValues(initialValues);
    }
    onClose();
  }

  const isValid = values.name?.length && values.name.length > 0;

  return (
      <Dialog
          open={open}
          onClose={onClose}
          maxWidth={"xs"}
          fullWidth>
        <DialogTitle>New Skill</DialogTitle>
        <DialogContent>
          <Grid
              container
              direction={"column"}
              spacing={1}>
            <Grid item>
              <TextField
                  variant={"outlined"}
                  label={"Name"}
                  id={"name"}
                  value={values.name}
                  onChange={handleChange}
                  placeholder={"New Skill"}
                  fullWidth />
            </Grid>
            <Grid item>
              <TextField
                  variant={"outlined"}
                  multiline
                  id={"description"}
                  value={values.description}
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
                      checked={values.isSpell}
                      onChange={handleToggle}
                      id={"is-spell"}
                      name="is-spell" />}
                  label={"Spell"} /></Grid>
              <Grid
                  item
                  xs={8}><TextField
                  variant={"outlined"}
                  label={"Stamina Cost"}
                  id={"staminaCost"}
                  value={values.staminaCost}
                  type={"number"}
                  onChange={handleChange}
                  fullWidth />
              </Grid>
            </Grid>
            <Grid
                item
                container
                direction={"row"}
                spacing={1}>
              <Grid
                  item
                  xs={6} />
              <Grid
                  item
                  xs={3}>
                <Button
                    onClick={onClose}
                    variant={"outlined"}
                    fullWidth>Cancel</Button>
              </Grid>
              <Grid
                  item
                  xs={3}>
                <Button
                    disabled={!isValid}
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
      root        : {},
      checkboxGrid: {padding: theme.spacing(1)},
    }));

export default NewSkillDialog;
