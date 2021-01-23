import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

interface SkillFormProps {
  parent: string;
}

//COMPONENT
const SkillForm: FunctionComponent<SkillFormProps> = (props: SkillFormProps) => {
  const {parent} = props;
  const classes = useStyles();
  const firebase = useFirebase();
  useFirebaseConnect(() => []);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const skill = {
    name,
    description,
  };

  function createSkill() {
    return firebase.push(`skills/${parent}`, skill);
  }

  return (
      <form className={classes.root} noValidate autoComplete={"off"}>
        <Grid container direction={"column"} spacing={2}>
          <Grid item>
            <TextField fullWidth
                       size={"small"}
                       id="skill-name"
                       variant={"outlined"}
                       label={"Name"}
                       value={name}
                       onChange={(e) => setName(e.target.value)} />
          </Grid>
          <Grid item>
            <TextField multiline
                       fullWidth
                       size={"small"}
                       id="skill-description"
                       variant={"outlined"}
                       label={"Description"}
                       value={description}
                       onChange={(e) => setDescription(e.target.value)} />
          </Grid>

          <Grid item>
            <Button color={"primary"}
                    variant={"contained"}
                    onClick={createSkill}>
              Create Skill
            </Button>
          </Grid>
        </Grid>
      </form>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {
        width: "100%",
      },
    }));

export default SkillForm;
