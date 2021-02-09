import React, {
  FunctionComponent, useState, useEffect, useContext,
} from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  useFirebaseConnect, useFirebase, isLoaded,
} from 'react-redux-firebase';
import {
  Paper, Table, TableRow, TableCell, TableContainer, TableBody, TableHead,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddSkillsDialog from './AddSkillsDialog';
import NewSkillDialog from './NewSkillDialog';
import SkillTableRow from './SkillTableRow';
import EditSkillDialog from './EditSkillDialog';
import RemoveSkillDialog from './RemoveSkillDialog';
import { useTypedSelector } from '../../store';
import { CharacterContext } from '../../views/CharacterContext';
import { useAuth } from '../../store/selectors';
import { Skill } from '../../store/Schema';

interface CharacterSkillsProps {

}

const initialState: { add: boolean; new: boolean; edit: boolean; remove: boolean } = {
  add   : false,
  new   : false,
  edit  : false,
  remove: false,
};

//COMPONENT
const CharacterSkills: FunctionComponent<CharacterSkillsProps> = (props: CharacterSkillsProps) => {

  const classes = useStyles();
  const firebase = useFirebase();
  const auth = useAuth();
  const {character} = useContext(CharacterContext);

  useFirebaseConnect([{path:`/characters/${character}/skillList`, storeAs:`characterSkills/${character}/skillList`}]);
  const skillList = useTypedSelector(state => state.firebase.data?.characters?.[character]?.skillList) ?? [];
  const [selectedSkill, setSelectedSkill] = useState("");

  const [dialogState, setDialogState] = useState<{ [key: string]: boolean }>(
      initialState);

  function showDialog(dialog?: string, key?: string): void {
    const newState = initialState;
    setDialogState(dialog
                   ? {
          ...newState,
          [dialog]: true,
        }
                   : newState);
  }

  const createSkill = ((newSkill:Partial<Skill>)=>{
    const newKey = firebase.ref(`/skills/${character}`).push({...newSkill, owner: auth.uid, character: character}).key;
    const newSkillList = [...skillList, newKey];
    firebase.ref(`/characters/${character}/skillList`).set(newSkillList);
  })

  const addSkills = async (skills: { [key:string]:Skill })=>{
    const newKeys = [];
    const skillsRef = firebase.ref(`/skills/${character}`);
    for (let selectedKey in skills) {
      const newKey = skillsRef.push().key;
      if (!newKey) {
        console.error("Failed to create skill",
                      selectedKey,
                      skills[selectedKey]);
        return;
      }
      newKeys.push(newKey);
      skillsRef.child(newKey).set(skills[selectedKey]);
    }

    const newInventory = skillList.concat(newKeys);
    await firebase.ref(`/characters/${character}/inventory`)
                  .set(newInventory);
  }

  const removeSkill = (selectedSkill: string) => {
    firebase.ref(`/skills/${character}/${selectedSkill}`)
            .set(null);
    const newInventory = skillList.filter(skill => skill !== selectedSkill);
    firebase.ref(`/characters/${character}/skillList`).set(newInventory);
  };

  return (
      <div>
        <Typography variant={"h5"}>
          Skills </Typography>
        <Button onClick={() => showDialog("add")}>Import Skill</Button>
        <Button onClick={() => showDialog("new")}>New Skill</Button>

        <TableContainer component={Paper}>
          <Table size={'small'}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.checkBoxCol}>Used
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell className={classes.skillRankCol}
                           align={"center"}>
                  Rank
                </TableCell>
                <TableCell className={classes.skillRankCol}
                           align={"center"}>
                  Skill
                </TableCell>
                <TableCell className={classes.skillRankCol}
                           align={"center"}>
                  Total
                </TableCell>
                <TableCell className={classes.iconButtonCol} />
              </TableRow>
            </TableHead>
            <TableBody>{skillList
                .map(skill => <SkillTableRow key={skill}
                                             skill={skill}
                                             onEdit={() => {
                                               setSelectedSkill(skill);
                                               showDialog("edit");
                                             }}
                                             onRemove={() => {
                                               setSelectedSkill(skill);
                                               showDialog("remove");
                                             }} />)}
            </TableBody>
          </Table>
        </TableContainer>


        <AddSkillsDialog open={dialogState.add}
                         onAdd={addSkills}
                         onClose={() => showDialog()}
                         character={character} />
        <NewSkillDialog open={dialogState.new}
                        onCreate={createSkill}
                        onClose={() => showDialog()} />
        <EditSkillDialog open={dialogState.edit}
                         onClose={() => showDialog()}
                         skill={selectedSkill} />
        <RemoveSkillDialog open={dialogState.remove}
                           onClose={(remove: boolean) => {
                             if (remove) removeSkill(selectedSkill);
                             showDialog();
                           }}
                           skillKey={selectedSkill} />


      </div>);
};

const useStyles = makeStyles((theme: Theme) => {
  return (
      {
        root         : {},
        checkBoxCol  : {
          paddingLeft: theme.spacing(2),
        },
        nameCol      : {
          flexGrow: 1,
        },
        skillRankCol : {
          paddingLeft : 0,
          paddingRight: 0,
          width       : "5rem",
        },
        centeredInput: {
          textAlign: "center",
        },
        iconButtonCol: {
          width: "3rem",
        },
      });
});

export default CharacterSkills;
