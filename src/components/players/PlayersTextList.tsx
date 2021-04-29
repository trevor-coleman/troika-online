import React, { FunctionComponent } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import { useAuth, useGame } from '../../store/selectors';

interface IPlayersTextListProps {gameKey: string}

type PlayersTextListProps = IPlayersTextListProps;

const PlayersTextList: FunctionComponent<IPlayersTextListProps> = (props: IPlayersTextListProps) => {
  const {gameKey} = props;
  const classes = useStyles();
  const auth = useAuth();

  const game = useGame(gameKey);
  let displayString = ""
  let players:string[] = []
  const paths:string[] = []
  if(game?.players)
  {
    Object.keys(game?.players).forEach(playerKey=>{
      if(playerKey !== (auth.uid ?? "--")) {
        paths.push(`/profiles/${playerKey}/name`);
        players.push(playerKey)
      }
    })
  }
  useFirebaseConnect(paths);

  const playerNames = useTypedSelector(state => {
    const result:string[] = []
    const anonymousPlayers=0;

    return players.map(player=> state.firebase?.data?.profiles?.[player]?.name ?? "Anonymous").join(', ');
  })

  return (
      <span className={classes.PlayersTextList}>{playerNames}</span>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      PlayersTextList: {fontSize: theme.typography.caption.fontSize},
    }));

export default PlayersTextList;
