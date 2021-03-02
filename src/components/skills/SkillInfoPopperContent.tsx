import React, { FunctionComponent, PropsWithChildren, useContext } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { CardHeader, CardContent, CardActions, Card } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Close, ChatBubbleTwoTone } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { SkillContext } from './context/SkillContext';
import { useFirebaseConnect } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import { CharacterContext } from '../../contexts/CharacterContext';
import { PopperContext } from './skillSections/SkillInfoButton';

interface ISkillInfoPopperContentProps {}

type SkillInfoPopperContentProps = PropsWithChildren<ISkillInfoPopperContentProps>;

const SkillInfoPopperContent: FunctionComponent<SkillInfoPopperContentProps> = (props: SkillInfoPopperContentProps) => {

  const classes = useStyles();
  const closePopper = useContext(PopperContext);
  const {character} = useContext(CharacterContext);
  const skill = useContext(SkillContext);
  useFirebaseConnect([
                       {
                         path   : `/skills/${character}/${skill}/name`,
                         storeAs: `skillInfoPopperContent/${character}/${skill}/name`,
                       }, {
      path   : `/skills/${character}/${skill}/description`,
      storeAs: `skillInfoPopperContent/${character}/${skill}/description`,
    },
                     ]);

  const {
    name = "",
    description = ""
  } = useTypedSelector(state => state.firebase.data?.skillInfoButton?.[character]?.[skill]) ??
      "";

  return (
      <Card>
        <CardHeader
            title={name}
            titleTypographyProps={{variant: "subtitle2"}}
            action={<IconButton
                size={"small"}
                onClick={closePopper}><Close /></IconButton>} />
        <CardContent className={classes.cardContent}>
          <Typography variant={"body2"}>{description}</Typography>
        </CardContent>
        <CardActions>
          <Button startIcon={<ChatBubbleTwoTone />}>Chat</Button>
          <Button onClick={closePopper} startIcon={<Close />}>Close</Button>
        </CardActions>
      </Card>
      );
};

const useStyles = makeStyles((theme: Theme) => (
    {
      SkillInfoPopperContent: {},
      cardContent: {paddingTop: 0,}
    }));

export default SkillInfoPopperContent;
