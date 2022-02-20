import React, { FunctionComponent, useEffect} from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebase } from 'react-redux-firebase';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import AddFriend from '../components/friends/AddFriend';
import FriendRequests from '../components/friends/FriendRequests';
import Friends from '../components/friends/Friends';
import Games from '../components/game/Games';
import GameInvitations from '../components/game/GameInvitations';
import { Profile } from '../store/Schema';
import { useAuth } from '../store/selectors';
import {ReactComponent as MainIcon} from '../svg/knowledge-svgrepo-com.svg';

interface HomeProps {
}

//COMPONENT
const Home: FunctionComponent<HomeProps> = (props: HomeProps) => {
  const {} = props;
  const firebase = useFirebase()
  const auth=useAuth();

  useEffect(()=>{
    document.title = "Home - Troika Online"

    const profileRef = firebase.ref(`/profiles/${auth.uid}`);
    profileRef.once(`value`).then(snap=>{
      if(!snap.val()) return;
      const profile:Profile = snap.val();

      const update: Partial<Profile> = {}

      let updateRequired = false;
      if(auth.displayName && (profile.name+'') !== auth.displayName ) {
        update.name = auth.displayName;
        updateRequired = true;
      }
      if(auth.email && profile.email !== auth.email) {
        update.email = auth.email;
        updateRequired = true;
      }

      if(updateRequired) {
        profileRef.update(update)
      }
    })



  }, [auth.uid])

  return (
      <div>
        <Box width={100}><MainIcon/></Box>
        <Typography variant={"h1"}>
          Troika Online
        </Typography>
        <Grid container spacing={2}>
          <Grid item container spacing={1} xs={12} sm={7} md={8}>
            <Grid
                item
                xs={12}>
              <Games />
            </Grid>
            <Grid item xs={12}>
              <GameInvitations />
            </Grid>
        </Grid>
        <Grid item container spacing={1} xs={12} sm={5} md={4}>
          <Grid item xs={12}>
            <AddFriend/>
          </Grid>
          <Grid item xs={12}>
            <FriendRequests />
          </Grid>
          <Grid item xs={12}>
            <Friends />
          </Grid>
        </Grid>
        </Grid>


      </div>);
};

makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default Home;
