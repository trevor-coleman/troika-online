import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

interface SplashScreenProps {
}

//COMPONENT
const SplashScreen: FunctionComponent<SplashScreenProps> = (props: SplashScreenProps) => {
  const {} = props;
  const classes = useStyles();
  useDispatch();

    return (
      <div className={classes.root}>
        <Typography variant={"h1"}>Splash Screen</Typography>
      </div>);
};

const useStyles = makeStyles(() => (
    {
      root: {},
    }));

export default SplashScreen;
