import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { AppBar, Toolbar, Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu'
import { useGame } from '../store/selectors';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
interface SessionProps {

}

//COMPONENT
const Play: FunctionComponent<SessionProps> = (props: SessionProps) => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const {gameKey} = useParams<{ gameKey:string }>()
  const game = useGame(gameKey);

  return (<div className={classes.root}>
    <AppBar position={"sticky"}>
        <Toolbar>
          <IconButton edge="start"
                      className={classes.menuButton}
                      color="inherit"
                      aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6"
                      className={classes.title}>
            {game?.name ?? "Loading"}
          </Typography>
          <Button color="inherit">Sign Out</Button>
      </Toolbar>
    </AppBar>
    <div className={classes.content}></div>
  </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {
        flexGrow: 1,
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      title: {
        flexGrow: 1,
      },
      content: {
        flexGrow:1,
      }
    }));

export default Play;
