import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import { Casino } from '@material-ui/icons';
import React, {
  FunctionComponent, PropsWithChildren, useContext, useEffect, useState,
} from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  isLoaded, useFirebase, useFirebaseConnect,
} from 'react-redux-firebase';
import { CharacterContext } from '../../contexts/CharacterContext';
import { GameContext, IRollToAdvanceProps } from '../../contexts/GameContext';
import { useTypedSelector } from '../../store';
import { Character, Skill } from '../../store/Schema';
import { useCharacter } from '../../store/selectors';
import SkillListItem, { ISkillListItem } from '../rolls/RollDialog/SkillListItem';

interface IRestDialogProps {
  open: boolean,
  handleClose: () => void,
}

type RestDialogProps = PropsWithChildren<IRestDialogProps>

//COMPONENT
const RestDialog: FunctionComponent<RestDialogProps> = (props: RestDialogProps) => {
  const {
    open,
    handleClose,
  } = props;
  const classes = useStyles();
  const {character} = useContext(CharacterContext);
  useFirebaseConnect([
    {
      path       : `/skills/${character}`,
      queryParams: ['orderByChild=used', 'equalTo=true'],
      storeAs    : `/restDialog`,
    },
  ]);
  const {skill} = useCharacter(character) ?? {skill: 0};
  const {roll} = useContext(GameContext);
  let skills = useTypedSelector(state => state.firebase.ordered?.restDialog);

  const [rolledSkills, setRolledSkills] = useState<string[]>([]);

  function onClose() {
    handleClose();
    setRolledSkills([])
  }

  async function rollToAdvance(item: ISkillListItem, target: number) {

    if (rolledSkills.length >= 3) return;

    const {value: {name}} = item;

    const rollProps: IRollToAdvanceProps = {
      dice       : [6, 6],
      rolledSkill: name,
      rollerKey  : character,
      target,
      type       : 'advance',

    };

    const rollKey = await roll(rollProps);
    if (rollKey) {
      const newRolledSkills = [...rolledSkills];
      newRolledSkills.push(item.key);
      setRolledSkills([...newRolledSkills]);
    }

  }

  return (
      <Dialog
          open={open}
          maxWidth={"xs"}
          onClose={() => handleClose()}
          fullWidth>
        <DialogTitle>Advance Skills ({3 - rolledSkills.length} remaining)</DialogTitle>
        <DialogContent>
          <List>
            {skills
             ? skills.map((item) => <SkillListItem
                    key={item.key}
                    item={item}
                    skill={skill}
                    disabled={rolledSkills.includes(item.key)}
                    onRoll={rollToAdvance} />)
             : ""}</List>
        </DialogContent>
        <DialogActions><Button
            onClick={onClose}
            variant={"contained"}>Done</Button></DialogActions>
      </Dialog>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default RestDialog;
