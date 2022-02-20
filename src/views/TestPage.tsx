import React, { FunctionComponent } from 'react';
import { makeStyles} from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import { Paper, Checkbox } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

interface ITestPageProps {}


const TestPage: FunctionComponent<ITestPageProps> = (props: ITestPageProps) => {
  const {} = props;
  const classes = useStyles();

  const {name="Skill Name"} = {}

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

const useStyles = makeStyles(() => (
    {
      TestPage: {},
    }));

export default TestPage;
