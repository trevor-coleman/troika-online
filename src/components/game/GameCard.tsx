import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia, Collapse,
  ListItem,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { FunctionComponent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { useGame } from '../../store/selectors';
import CharacterListItem from '../characters/CharacterListItem';
import PlayersTextList from '../players/PlayersTextList';

interface IGameCardProps {gameKey: string}

type GameCardProps = IGameCardProps;

const GameCard: FunctionComponent<IGameCardProps> = (props: IGameCardProps) => {
  const {gameKey} = props;
  const classes = useStyles();
  const history = useHistory()
  useFirebaseConnect({path: `/games/${gameKey}`});
  const game = useGame(gameKey);
  const characters = game?.characters;

  const [open, setOpen] = useState(false);

  const toggle = ()=> {setOpen(!open);}

  return (
      <Card className={classes.cardContent}>

        <CardHeader title={game?.name ?? "Unnnamed Game"}
                    subheader={<PlayersTextList gameKey={gameKey}/>}
                    action={<IconButton onClick={toggle}>{open?<ExpandLessIcon/>:<ExpandMoreIcon/>}</IconButton>}/>
        <Collapse in={open}>

          <List>
            {isLoaded(characters)
             ? Object.keys(characters)
                     .map(item => (
                         <CharacterListItem
                             key={item}
                             characterKey={item}
                         />))
             : <ListItem />}
          </List>

        </Collapse>
        <CardActions>
          <Button color={'primary'} onClick={()=>history.push(`/game/${gameKey}`)}>Load Game</Button>
        </CardActions>
      </Card>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      GameCard: {},
      cardContent: {
        borderLeftWidth: 10,
        borderLeftColor: theme.palette.warning.dark,
        borderLeftStyle: 'solid'
      }
    }));

export default GameCard;
