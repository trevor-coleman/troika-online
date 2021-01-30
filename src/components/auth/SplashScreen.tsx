import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

interface SplashScreenProps {
}

//COMPONENT
const SplashScreen: FunctionComponent<SplashScreenProps> = (props: SplashScreenProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
      <div className={classes.root}>
        <Typography variant={"h1"}>Splash Screen</Typography>
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default SplashScreen;
