import React, { FunctionComponent, useState } from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { useFirebaseConnect, isEmpty, useFirebase } from 'react-redux-firebase';
import {
  Paper, Table, TableRow, TableCell, TableContainer, TableBody, TableHead,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useAuth, useCharacterSkills } from '../../store/selectors';
import { KeyList, Skill } from '../../store/Schema';
import Button from '@material-ui/core/Button';
import AddSkillsDialog from './AddSkillsDialog';
import NewSkillDialog from './NewSkillDialog';
import SkillTableRow from './SkillTableRow';
import EditSkillDialog from './EditSkillDialog';
import RemoveSkillDialog from './RemoveSkillDialog';

interface CharacterSkillsProps {
  characterKey: string,
  skills?: { [key: string]: Skill } | KeyList
}

const initialState: { add: boolean; new: boolean; edit: boolean; remove: boolean } = {
  add: false,
  new: false,
  edit: false,
  remove: false
};

//COMPONENT
const CharacterSkills: FunctionComponent<CharacterSkillsProps> = (props: CharacterSkillsProps) => {
  const {
    characterKey,
    skills,
  } = props;

  const theme = useTheme();
  const classes = useStyles();
  const auth = useAuth();
  const firebase=useFirebase();
  useFirebaseConnect([`/character/${characterKey}/skills`]);
  const characterSkills = useCharacterSkills(characterKey);
  const [dialogState, setDialogState] = useState<{ [key: string]: boolean }>(initialState);

  const [selectedSkill, setSelectedSkill] = useState("");



  function showDialog(dialog?: string, key?: string): void {
    const newState = initialState;
    setDialogState(dialog
                   ? {
          ...newState,
          [dialog]: true,
        }
                   : newState);
  }

  async function removeSkill(selectedSkill: string) {
    await Promise.all([
      firebase.ref(`/skills/${selectedSkill}/characters/${characterKey}`)
              .set(null),
      firebase.ref(`/characters/${characterKey}/skills/${selectedSkill}`)
              .set(null),
    ])
  }

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
                           align={"center"}
                >
                  Total
                </TableCell>
                <TableCell className={classes.iconButtonCol}/>
              </TableRow>
            </TableHead>
            <TableBody>{!isEmpty(characterSkills)
                        ? Object.keys(characterSkills)
                                .map(skillKey => <SkillTableRow key={skillKey}
                                                                skillKey={skillKey}
                                                                characterKey={characterKey}
                                                                onEdit={() => {setSelectedSkill(skillKey); showDialog("edit")}}
                                                                onRemove={() => {
                                                                  setSelectedSkill(
                                                                      skillKey);
                                                                  showDialog(
                                                                      "remove")
                                                                }}/>)
                        : undefined}
            </TableBody>
          </Table>
        </TableContainer>


        <AddSkillsDialog open={dialogState.add}
                         onClose={() => showDialog()}
                        characterKey={characterKey}/>
        <NewSkillDialog open={dialogState.new}
                        character={characterKey}
                        onClose={() => showDialog()} />
        <EditSkillDialog open={dialogState.edit} onClose={()=>showDialog()} skillKey={selectedSkill} character={characterKey}/>
        <RemoveSkillDialog open={dialogState.remove} onClose={(remove:boolean)=> {
          if(remove)removeSkill(selectedSkill);
          showDialog();}} skillKey={selectedSkill} character={characterKey}/>


      </div>);
};

const useStyles = makeStyles((theme: Theme) => {
  return (
      {
        root: {},
        checkBoxCol: {
          paddingLeft: theme.spacing(2),
        },
        nameCol: {
          flexGrow: 1,
        },
        skillRankCol: {
          paddingLeft: 0,
          paddingRight: 0,
          width: "5rem"
        },
        centeredInput: {
          textAlign: "center",
        },
        iconButtonCol: {
          width: "3rem"
        },
      });
});

export default CharacterSkills;
