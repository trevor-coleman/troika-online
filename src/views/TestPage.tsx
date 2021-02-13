import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import { Paper, Checkbox } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

interface ITestPageProps {}

type TestPageProps = ITestPageProps;



const TestPage: FunctionComponent<ITestPageProps> = (props: ITestPageProps) => {
  const {} = props;
  const classes = useStyles();

  const {name="Skill Name", description="This includes any Skill you might think of that comes under the heading of arts and crafts. Blacksmithing, carpentry, painting, opera singing, anything like that. Roll Under the Skill if you want to do something that knowledge of this Skill would reasonably cover. A carpenter might be able to spot a weak bridge while a blacksmith could shoe a horse or an opera singer could identify an aria. Be flexible and reasonable.", rank=0, skill=0, used=false} = {}

  return (
      <div className={classes.TestPage}>
        <Grid container>
          <Grid item xs={12}>
            <Paper>
              <Box p={2}>
                <Grid container>
                 <Grid item>
                   <Checkbox/>
                 </Grid>
                  <Grid item>
                    <Typography>{name}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      TestPage: {},
    }));

export default TestPage;
