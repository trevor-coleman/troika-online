import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebaseConnect } from 'react-redux-firebase';
import {
  ListItemText, ListItem, ListItemSecondaryAction,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useGame } from '../../store/selectors';

interface GameListItemProps {
  gameKey: string,
  firstAction?: JSX.Element
}

//COMPONENT
const GameListItem: FunctionComponent<GameListItemProps> = (props: GameListItemProps) => {
  const {
    gameKey,
    firstAction,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  useFirebaseConnect({path: `/games/${gameKey}`});

  const CustomLink = React.useMemo(() => React.forwardRef((linkProps,
                                                           ref: any) => (
      <Link ref={ref} to={`/game/${gameKey}`} {...linkProps} />)), [gameKey]);

  const game = useGame(gameKey);

  return (
      <ListItem button component={CustomLink}>
        <ListItemText primary={game?.name ?? ""} />
        {firstAction
         ? <ListItemSecondaryAction>{firstAction}</ListItemSecondaryAction>
         : ""}
      </ListItem>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default GameListItem;
