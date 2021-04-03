import React, { FunctionComponent, PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  ListSubheader,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useGame } from '../store/selectors';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { Star, ExpandLess } from '@material-ui/icons';
import Roll from '../components/rolls/Roll';
import { FbRoll } from '../store/Schema';
import Stats from '../components/stats/Stats';
import Bio from '../components/bio/Bio';
import CharacterSkills from '../components/skills/CharacterSkills';
import { rollKey } from '../components/rolls/rollKey';
import { CharacterContext } from '../contexts/CharacterContext';

interface SessionProps {

}

//COMPONENT
const characterKey: string = "-MSYuD2W2xrlOZCRy_Ez";
const Play: FunctionComponent<SessionProps> = (props: SessionProps) => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const {gameKey} = useParams<{ gameKey: string }>();
  const game = useGame(gameKey);
  const theme = useTheme();

  const Dummy = ({
                   children,
                   h,
                   bg,
      className
                 }: PropsWithChildren<{ h?: string | number, bg?: string, className?:string }>) =>
      <div style={{
        width: "100%",
        height: h ?? "100%",

      }} className={className}><Paper style={{
        background: bg ?? theme.palette.background.paper,
      }}><Box height={h ?? "100%"}
              p={2}>{children}</Box></Paper></div>;

  return (
      <div className={classes.content}>
        <Grid container
              spacing={2}>
          <Grid container
                item
                sm={3}>
            <Dummy>
              <ListSubheader>
                Starred
              </ListSubheader>
              <List>
                <ListItem selected classes={{
                  selected: classes.selected}}>
                  <ListItemAvatar>
                    <Avatar src={"https://firebasestorage.googleapis.com/v0/b/troika-online.appspot.com/o/portraits%2F-MSYuD2W2xrlOZCRy_Ez.jpg?alt=media&token=9fb69b34-c8b1-4858-bab8-452f82287774"}/>
                  </ListItemAvatar>
                  <ListItemText primary={'Gerald the Disquieting'} />
                  <ListItemSecondaryAction><Star /></ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={"http://assets1.ignimgs.com/2014/07/25/223unnamedjpg-0d206a.jpg"} />
                  </ListItemAvatar>
                  <ListItemText primary={'Thor the Unhurried'} />
                  <ListItemSecondaryAction><Star /></ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={"https://firebasestorage.googleapis.com/v0/b/troika-online.appspot.com/o/portraits%2F-MSYuD2W2xrlOZCRy_Ez.jpg?alt=media&token=9fb69b34-c8b1-4858-bab8-452f82287774"} />
                  </ListItemAvatar>
                  <ListItemText primary={'Starred Sheet'} />
                  <ListItemSecondaryAction><Star /></ListItemSecondaryAction>
                </ListItem>
              </List>
              <ListSubheader>
                Recent <ExpandLess/>
              </ListSubheader>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={"https://firebasestorage.googleapis.com/v0/b/troika-online.appspot.com/o/portraits%2F-MSYuD2W2xrlOZCRy_Ez.jpg?alt=media&token=9fb69b34-c8b1-4858-bab8-452f82287774"} />
                  </ListItemAvatar>
                  <ListItemText primary={'The Mountebank'} />
                  <ListItemSecondaryAction><Star /></ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={"http://assets1.ignimgs.com/2014/07/25/223unnamedjpg-0d206a.jpg"} />
                  </ListItemAvatar>
                  <ListItemText primary={'Salazar di Balazalaralama'} />
                  <ListItemSecondaryAction><Star /></ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={"https://firebasestorage.googleapis.com/v0/b/troika-online.appspot.com/o/portraits%2F-MSYuD2W2xrlOZCRy_Ez.jpg?alt=media&token=9fb69b34-c8b1-4858-bab8-452f82287774"} />
                  </ListItemAvatar>
                  <ListItemText primary={'Lord Quincy: A Quincy Production'} />
                  <ListItemSecondaryAction><Star /></ListItemSecondaryAction>
                </ListItem>
              </List>
              <ListSubheader>
                Library
              </ListSubheader>
              <TreeView defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}>
                <TreeItem nodeId="1"
                          label="Player Characters">
                  <TreeItem nodeId="2"
                            label="Sir Garry of House Inkleton" />
                  <TreeItem nodeId="3"
                            label="Salazar di Balazalarama" />
                  <TreeItem nodeId="4"
                            label="Thor the Unhurried" />
                </TreeItem>
                <TreeItem nodeId="5"
                          label="The Mountebank">
                  <TreeItem nodeId="10"
                            label="The Spider" />
                  <TreeItem nodeId="11"
                            label="Cristobell" />
                  <TreeItem nodeId="10"
                            label="An unwelcome visitor at court" />
                  <TreeItem nodeId="10"
                            label="Three headed dog" />
                </TreeItem>
              </TreeView></Dummy></Grid>


          <Grid container
                spacing={1}
                item
                sm={6}
                className={classes.characterSheet}>
            <Dummy>
              <CharacterContext.Provider value={{character: characterKey}}>
              <Bio characterKey={characterKey} />
              <Stats />
              <CharacterSkills />
              </CharacterContext.Provider>
            </Dummy>
          </Grid>

        <Grid container
              item
              spacing={2}
              sm={3}>
          <Grid item xs={12}>
            <Dummy h={"20vh"}><Typography variant={'h6'}>Initiative</Typography> </Dummy>
          </Grid>
          <Grid item xs={12}>
          <Dummy h={"70vh"}
                 bg={theme.palette.grey["200"]} className={classes.rolls}>
            <Typography><b>Sir
                           Gary of House Inkerton</b> rolls <b>Fishmongering</b></Typography>
            <Roll rollKey={"1234"}
                  animate={false}
                  roll={{key: "1234", value:roll()}} />
            <Typography><b>Thor the Unhurried</b> rolls <b>Slow Perambulation</b></Typography>
            <Roll rollKey={"1234"}
                  animate={false}
                  roll={{
                    key  : "1234",
                    value: roll()
                  }} />
            <Typography><b>Middlesbrook the Middling</b> rolls <b>Average Intellect</b></Typography>
            <Roll rollKey={"1234"}
                  roll={{
                    key  : "1234",
                    value: roll()
                  }} /></Dummy>
          </Grid>

        </Grid></Grid>

      </div>);
};

const roll = ()=> ({
  dice: [6, 6],
  roll: rollKey(Math.random().toString(), [6, 6]),
  target: 3,
  title: 'My Roll',
  total: 5,
});

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {
        flexGrow: 1,
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      selected: {
        border: "1px solid",
        borderColor: theme.palette.primary.dark
      },
      title: {
        flexGrow: 1,
      },
      characterSheet: {
        height: '100vh',
        overflow: "auto",
      },
      rolls: {overflow: 'auto'},
      content: {
        height: '100vh',
        overflow: "hidden",
      },
    }));

export default Play;
