import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebase } from 'react-redux-firebase';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Dice from '../components/rolls/Dice';
import RollTester from '../components/rolls/RollTester';
import NewGameButton from '../components/game/NewGameButton';
import { TextField, Paper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CreateGame from '../components/game/CreateGame';
import AddFriend from '../components/friends/AddFriend';
import FriendRequests from '../components/friends/FriendRequests';
import Friends from '../components/friends/Friends';
import { useTypedSelector } from '../store';
import Games from '../components/game/Games';
import GameInvitations from '../components/game/GameInvitations';
import {ReactComponent as MainIcon} from '../svg/knowledge-svgrepo-com.svg';

interface HomeProps {
}

//COMPONENT
const Home: FunctionComponent<HomeProps> = (props: HomeProps) => {
  const {} = props;

  return (
      <div>
        <Box width={100}><MainIcon/></Box>
        <Typography variant={"h1"}>
          Troika Online
        </Typography>
        <Grid container spacing={2}>
          <Grid item container spacing={1} xs={12} sm={7} md={8}>
          <Grid item xs={12}>
            <CreateGame/>
          </Grid>
            <Grid item xs={12}>
              <GameInvitations />
            </Grid>
          <Grid item xs={12}>
            <Games/>
          </Grid>
        </Grid>
        <Grid item container spacing={1} xs={12} sm={5} md={4}>
          <Grid item xs={12}>
            <AddFriend/></Grid>
          <Grid item xs={12}>
            <FriendRequests /></Grid>
          <Grid item xs={12}>
            <Friends /></Grid>
        </Grid>
        </Grid>


      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default Home;
