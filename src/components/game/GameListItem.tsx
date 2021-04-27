import Divider from '@material-ui/core/Divider';
import { GroupWork } from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebaseConnect } from 'react-redux-firebase';
import {
  ListItemText, ListItem, ListItemSecondaryAction, ListItemAvatar, Avatar,
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
        <ListItemText className={classes.gameName} primary={game?.name ?? ""} />
        {firstAction
         ? <ListItemSecondaryAction>{firstAction}</ListItemSecondaryAction>
         : ""}
        <Divider />
      </ListItem>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      gameName: {
        color: theme.palette.primary.main
      }
    }));

export default GameListItem;
