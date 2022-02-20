import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,



} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import React, {
  FunctionComponent, PropsWithChildren, useContext, useState,
} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import {
  useFirebaseConnect,
} from 'react-redux-firebase';
import { CharacterContext } from '../../contexts/CharacterContext';
import { GameContext, IRollToAdvanceProps } from '../../contexts/GameContext';
import { useTypedSelector } from '../../store';
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
  useStyles();
    const {character} = useContext(CharacterContext);
  useFirebaseConnect([
    {
      path       : `/skills/${character}`,
      queryParams: ['orderByChild=used', 'equalTo=true'],
      storeAs    : `/restDialog`,
    },
  ]);
  const {skill, name:rollerName} = useCharacter(character) ?? {skill: 0};
  const {roll} = useContext(GameContext);
  let skills = useTypedSelector(state => state.firebase.ordered?.restDialog);

  const [rolledSkills, setRolledSkills] = useState<string[]>([]);

  function onClose() {
    handleClose();
    setRolledSkills([])
  }

  async function rollToAdvance(item: ISkillListItem, target: number, rank:number) {

    if (rolledSkills.length >= 3) return;

    const {value: {name}} = item;

    const rollProps: IRollToAdvanceProps = {
      dice           : [6, 6],
      rolledSkillName: name,
      rolledSkillKey: item.key,
      rolledSkillRank: rank,
      rollerKey      : character,
      rollerName,
      target,
      type           : 'advance',

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
                    rollsCompleted={rolledSkills.length >=3}
                    onRoll={rollToAdvance} />)
             : ""}</List>
        </DialogContent>
        <DialogActions><Button
            onClick={onClose}
            variant={"contained"} color={rolledSkills.length >= 3 ? 'secondary' : 'primary'}>Done</Button></DialogActions>
      </Dialog>);
};

const useStyles = makeStyles(() => (
    {
      root: {},
    }));

export default RestDialog;
