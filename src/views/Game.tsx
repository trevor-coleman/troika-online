import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { useFirebaseConnect } from 'react-redux-firebase';
import { useGame } from '../store/selectors';
import Grid from '@material-ui/core/Grid';
import Players from '../components/players/Players';

interface GameProps {

}

//COMPONENT
const Game: FunctionComponent<GameProps> = (props: GameProps) => {
  const {} = props;
  const {gameKey} = useParams<{ gameKey: string }>();
  const classes = useStyles();

  useFirebaseConnect([`/games/${gameKey}`]);

  const game = useGame(gameKey);

  return (
      <div className={classes.root}>
        <Typography variant={"h3"}>{ game?.name ?? "No Game"}</Typography>
        <Typography variant={"subtitle1"}>{gameKey}</Typography>
        <Grid container>
          <Grid item container direction={"column"} sm={5}><Players gameKey={gameKey}/></Grid>
          <Grid item container direction={"column"} sm={7}></Grid>
        </Grid>
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default Game;
