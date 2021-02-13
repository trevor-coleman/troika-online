import React, { FunctionComponent, useState, useContext } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import { Info, Close, ChatBubble, ChatBubbleTwoTone } from '@material-ui/icons';
import Popper from '@material-ui/core/Popper';
import {
  Paper,
  Card,
  CardContent,
  CardActions, CardHeader,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useFirebaseConnect } from 'react-redux-firebase';
import { useTypedSelector } from '../../../store';
import { CharacterContext } from '../../../views/CharacterContext';
import { SkillContext } from '../context/SkillContext';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

interface ISkillInfoButtonProps {}

type SkillInfoButtonProps = ISkillInfoButtonProps;

const SkillInfoButton: FunctionComponent<ISkillInfoButtonProps> = (props: ISkillInfoButtonProps) => {
  const {} = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const {character} = useContext(CharacterContext);
  const skill = useContext(SkillContext);
  useFirebaseConnect([
                       {
                         path   : `/skills/${character}/${skill}/name`,
                         storeAs: `skillInfoButton/${character}/${skill}/name`,
                       },{
                         path   : `/skills/${character}/${skill}/description`,
                         storeAs: `skillInfoButton/${character}/${skill}/description`,
                       },
                     ]);

  const {name = "", description=""} = useTypedSelector(state => state.firebase.data?.skillInfoButton?.[character]?.[skill]) ??
               "";

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl
                ? null
                : event.currentTarget);
  };

  const closePopper = ()=>{
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl);
  const id = open
             ? 'simple-popper'
             : undefined;

  return (
        <>
          <IconButton onClick={handleClick}>
            <Info />
          </IconButton>
          <Popper
              className={classes.popper}
              anchorEl={anchorEl}
              open={open}
              placement="right-start"
              disablePortal={false}
              modifiers={{
                flip           : {
                  enabled: true,
                },
                preventOverflow: {
                  enabled          : true,
                  boundariesElement: 'viewport',
                },
              }}
          >
            <Paper className={classes.paper}>
              <Card>
                <CardHeader title={name}
                            titleTypographyProps={{variant:"subtitle2"}}
                            action={<IconButton size={"small"}
                                                onClick={closePopper}><Close /></IconButton>}/>
                <CardContent className={classes.cardContent}><Typography variant={"body2"}>{description}</Typography></CardContent>
                <CardActions>
                  <Button startIcon={<ChatBubbleTwoTone/>}>Chat</Button>
                  <Button startIcon={<Close/>}>Close</Button>
                </CardActions>
              </Card>
            </Paper>
          </Popper>
        </>
      );
};

const useStyles = makeStyles((theme: Theme) => (
    {
      SkillInfoButton: {},
      paper: {
        border: "1px solid",
        borderColor: theme.palette.primary.light,
        width: theme.spacing(30),
      },
      popper: {
        zIndex:1,
      },
      cardContent: {paddingTop: 0,}

    }));

export default SkillInfoButton;
