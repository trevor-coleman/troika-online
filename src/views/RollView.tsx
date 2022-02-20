import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles} from '@material-ui/core/styles';
import RollTester from '../components/rolls/RollTester';
import Typography from '@material-ui/core/Typography';

interface RollVIewProps {
}

//COMPONENT
const RollView: FunctionComponent<RollVIewProps> = (props: RollVIewProps) => {
  const {} = props;
  const classes = useStyles();
  useDispatch();

    return (
      <div className={classes.root}>
        <Typography variant={"h1"}>Roll Dice!</Typography>
        <RollTester gameKey={"testGame"} />
      </div>);
};

const useStyles = makeStyles(() => (
    {
      root: {},
    }));

export default RollView;
