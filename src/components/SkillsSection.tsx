import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import { Typography, Collapse } from '@material-ui/core';
import SkillForm from './SkillForm';
import SkillsList from './SkillsList';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

interface SkillsSectionProps {
  parent: string
}

//COMPONENT
const SkillsSection: FunctionComponent<SkillsSectionProps> = (props: SkillsSectionProps) => {
  const {parent} = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
      <Paper className={classes.root}>
        <Box p={2}>
          <Grid container direction={"column"} spacing={2}>
            <Grid item>
            <Typography variant={"h6"}>Skills</Typography>
            </Grid>
            <Grid item>
              <Typography paragraph variant={"subtitle1"}>Add New Skill</Typography>
            <SkillForm parent={parent} />
            </Grid>
            <Grid item>
            </Grid>
            <Grid item>
              <Divider />
            <SkillsList parent={parent} />
            </Grid>
          </Grid>
        </Box>
      </Paper>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {maxWidth: 600},
    }));

export default SkillsSection;
