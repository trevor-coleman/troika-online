import {
  Avatar, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Casino, Check } from '@material-ui/icons';
import React, { FunctionComponent, useContext } from 'react';
import { isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { CharacterContext } from '../../../contexts/CharacterContext';
import { useTypedSelector } from '../../../store';
import { Skill } from '../../../store/Schema';
import { useCharacter } from '../../../store/selectors';

export interface ISkillListItem {
  key: string,
  value: Skill
}

interface ISkillListItemProps {
  item: ISkillListItem,
  skill: number,
  disabled: boolean,
  rollsCompleted: boolean,
  onRoll: (item: ISkillListItem, target: number, rank: number) => void,
}

const SkillListItem: FunctionComponent<ISkillListItemProps> = (props: ISkillListItemProps) => {
  const {
    item: {
      key,
      value: {name},
    },
    skill,
    onRoll,
    disabled,
    rollsCompleted,
  } = props;
  const classes = useStyles();
  const {character} = useContext(CharacterContext);
  useFirebaseConnect(`/skillValues/${character}/${key}/rank`);
  const rank = useTypedSelector(state => state.firebase.data?.skillValues?.[character]?.[key]?.rank) ??
               0;

  return <ListItem key={key}>
    <ListItemAvatar><Avatar>{rank + skill}</Avatar></ListItemAvatar>
    <ListItemText
        primary={name ?? "Loading"}
    />
    <ListItemSecondaryAction><Button
        disabled={disabled || rollsCompleted}
        className={classes.rollButton}
        onClick={() => onRoll(props.item, rank + skill, rank)}
        variant={'contained'}
        startIcon={disabled
                   ? <Check />
                   : <Casino />}>{disabled
                                  ? "Rolled"
                                  : "Roll"}</Button></ListItemSecondaryAction>
  </ListItem>;
};

const useStyles = makeStyles((theme)=>({
 rollButton: {
   width: theme.spacing(14)
 }
}))

export default SkillListItem;
