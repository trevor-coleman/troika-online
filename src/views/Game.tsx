import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Paper,
  Switch, TextField,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import firebase from 'firebase/app';
import React, {
  ChangeEvent, FunctionComponent, useEffect, useState,
} from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useParams, useHistory, Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import ScrollToTopOnMount from '../components/utility/ScrollToTopOnMount';
import { useAuth, useGame } from '../store/selectors';
import Grid from '@material-ui/core/Grid';
import Players from '../components/players/Players';
import Characters from '../components/characters/Characters';
import { useTypedSelector } from '../store';
import Button from '@material-ui/core/Button';
import { PlayArrowRounded, Casino } from '@material-ui/icons';
import Collapse from '@material-ui/core/Collapse';

interface GameProps {

}

//COMPONENT
const Game: FunctionComponent<GameProps> = (props: GameProps) => {
  const {} = props;
  const {gameKey} = useParams<{ gameKey: string }>();
  const history = useHistory();
  const classes = useStyles();
  const firebase = useFirebase();
  const auth = useAuth();

  useFirebaseConnect([`/games/${gameKey}`]);

  const game = useGame(gameKey);

  useEffect(() => {
    document.title = `${game?.name ?? "Game"} - Troika Online`;
  }, [game]);

  const [showGameID, setShowGameId] = useState(false);
  const onCloseGameId = () => setShowGameId(false);
  const [webhookErrorIsVisible, setWebhookErrorIsVisible] = useState(false);
  const [webhookError, setWebhookError] = useState("");
  const [webhookUrl, setWebhookURL] = useState(game?.discordWebhookUrl)
  const [enableDiscord, setEnableDiscord] =  useState(game?.enableDiscord ?? false);

  const handleDiscordChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=> {
    const url = e.target.value;
    const discordWebhookUrlRegex = /^https?:\/\/discord(app)?.com\/api\/webhooks\/[A-Za-z0-9]*\/[A-Za-z0-9_\-]*\/?$/


    console.log(url, discordWebhookUrlRegex.test(url));

    setWebhookURL(url);

    if(url.length > 0 && !discordWebhookUrlRegex.test(url)){
      setWebhookErrorIsVisible(true);
      setWebhookError("Not a valid discord webhook");
      return;
    }

    setWebhookErrorIsVisible(false);

    firebase.ref(`/games/${gameKey}/discordWebhookUrl`).set(e.target.value)

  }

  const handleCheckPublic = (e: ChangeEvent<HTMLInputElement>) => {
    firebase.ref(`/games/${gameKey}/public`)
            .set(e.target.checked);
  };

  const handleCheckDiscord = (e: ChangeEvent<HTMLInputElement>) => {
    firebase.ref(`/games/${gameKey}/enableDiscord`)
            .set(e.target.checked);
  };

  return (
      <div className={classes.root}>
        <ScrollToTopOnMount />
        <Link to={`/home`}>
          <Typography paragraph>{"<"} Back </Typography>
        </Link>
        <Typography variant={"h1"}>{game?.name ?? "No Game"}</Typography>
        {/*<Button startIcon={<Casino/>} onClick={()=>history.push(`/play/${gameKey}`)} size={"large"} variant={"contained"} color={"secondary"} className={classes.playButton}>Play</Button>*/}
        <Grid
            container
            spacing={2}>
          <Grid
              container
              item
              spacing={2}>
            <Grid
                item
                container
                direction={"column"}
                sm={7}>
              <Characters gameKey={gameKey} />
            </Grid>
            <Grid
                item
                container
                direction={"column"}
                sm={5}>
              <Players gameKey={gameKey} />
            </Grid>
          </Grid>
          {game?.owner === auth.uid
           ? <Grid
               item
               container
               xs={7}>
             <Box width={"100%"}>
               <Paper>
                 <Box p={2}>
                   <Grid
                       container
                       spacing={2}
                       direction={"row"}>
                     <Grid
                         item
                         xs={12}>
                       <Typography variant={'h5'}>Sharing</Typography>
                     </Grid>
                     <Grid item xs={4}>
                       <FormControlLabel
                           labelPlacement={"start"}
                           control={<Switch
                               checked={game?.public ?? false}
                               onChange={handleCheckPublic}
                               id={"isPublic"}
                               name="isPublic" />}
                           label={"Allow Join by Code"} />
                     </Grid>
                     <Grid item xs={8}>
                       <Button
                           disabled={!game?.public}
                           onClick={() => setShowGameId(true)}
                           variant={'contained'}>Get Game ID</Button>
                     </Grid>
                   </Grid>
                 </Box>
               </Paper>
             </Box>
           </Grid>
           : ""}
          {game?.owner === auth.uid
           ? <Grid
               item
               container
               xs={7}>
             <Box width={"100%"}>
               <Paper>
                 <Box p={2}>
                   <Grid
                       container
                       spacing={2}
                       direction={"row"}>
                     <Grid
                         item
                         xs={12}>
                       <Typography variant={'h5'}>Discord</Typography>
                     </Grid>
                     <Grid item xs={4}>
                       <FormControlLabel
                           labelPlacement={"start"}
                           control={<Switch
                               checked={game?.enableDiscord ?? false}
                               onChange={handleCheckDiscord}
                               id={"enableDiscord"}
                               name="enableDiscord" />}
                           label={"Post Rolls to Discord"} />
                     </Grid>
                     <Grid item xs={8}>
                       <TextField fullWidth error={webhookErrorIsVisible} label={"Webhook URL"} variant={"outlined"} value={webhookUrl ?? ""} placeholder={"https://discord.com/api/webhooks/ID/TOKEN"} onChange={handleDiscordChange}/>
                       <Collapse in={webhookErrorIsVisible}>
                         <Typography color={"error"}>{webhookError}</Typography>
                       </Collapse>
                     </Grid>
                   </Grid>
                 </Box>
               </Paper>
             </Box>
           </Grid>
           : ""}

        </Grid>
        <Dialog
            open={showGameID}
            onClose={onCloseGameId}
            maxWidth={'xs'}
            fullWidth>
          <DialogTitle>Game ID</DialogTitle>
          <DialogContent>
            <Typography>Share this code to allow players to join your
                        game:</Typography>
            <pre className={classes.pre}>{game?.slug ?? "No Game Id"}</pre>
            <DialogActions>
              <Button onClick={onCloseGameId}>Close</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root      : {},
      playButton: {
        paddingLeft : theme.spacing(8),
        paddingRight: theme.spacing(8),
      },
      pre       : {
        fontSize: 24,
      },
    }));

export default Game;
