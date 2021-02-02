import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { useFirebaseConnect } from 'react-redux-firebase';
import { useGame } from '../store/selectors';
import Grid from '@material-ui/core/Grid';
import Players from '../components/players/Players';
import Characters from '../components/characters/Characters';
import { useTypedSelector } from '../store';
import Button from '@material-ui/core/Button';
import { PlayArrowRounded, Casino } from '@material-ui/icons';

interface GameProps {

}

//COMPONENT
const Game: FunctionComponent<GameProps> = (props: GameProps) => {
  const {} = props;
  const {gameKey} = useParams<{ gameKey: string }>();
  const history = useHistory();
  const classes = useStyles();

  useFirebaseConnect([`/games/${gameKey}`]);

  const game = useGame(gameKey);

  return (
      <div className={classes.root}>
        <Typography variant={"h3"}>{ game?.name ?? "No Game"}</Typography>
        <Button startIcon={<Casino/>} onClick={()=>history.push(`/play/${gameKey}`)} size={"large"} variant={"contained"} color={"secondary"} className={classes.playButton}>Play</Button>
        <Typography variant={"subtitle1"}>{gameKey}</Typography>
        <Grid container spacing={2}>
          <Grid item container direction={"column"} sm={5}><Players gameKey={gameKey}/></Grid>
          <Grid item container direction={"column"} sm={7}><Characters gameKey={gameKey}/></Grid>
        </Grid>
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      playButton: {
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(8)
      }
    }));

export default Game;
