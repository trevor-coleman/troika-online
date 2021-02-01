import React, { FunctionComponent, useState } from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { useFirebaseConnect, isEmpty } from 'react-redux-firebase';
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

interface CharacterSkillsProps {
  characterKey: string,
  skills?: { [key: string]: Skill } | KeyList
}

//COMPONENT
const CharacterSkills: FunctionComponent<CharacterSkillsProps> = (props: CharacterSkillsProps) => {
  const {
    characterKey,
    skills,
  } = props;

  const theme = useTheme();
  const classes = useStyles();
  const auth = useAuth();
  useFirebaseConnect({
    path: `/skills/`,
    storeAs: `/characterSkills/${characterKey}`,
    queryParams: [`orderByChild=character`, `equalTo=${characterKey}`],
  });
  const characterSkills = useCharacterSkills(characterKey);

  const [dialogState, setDialogState] = useState<{ [key: string]: boolean }>({
    add: false,
    new: false,
    edit:false,
  });

  const [selectedSkill, setSelectedSkill] = useState("");

  function showDialog(dialog?: string, key?: string): void {
    const newState = {
      add: false,
      new: false,
      edit:false,
    };
    setDialogState(dialog
                   ? {
          ...newState,
          [dialog]: true,
        }
                   : newState);
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
                <TableCell className={classes.iconButtonCol}>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{!isEmpty(characterSkills)
                        ? Object.keys(characterSkills)
                                .map(skillKey => <SkillTableRow key={skillKey}
                                                                skillKey={skillKey}
                                                                characterKey={characterKey}
                                                                onEdit={() => {setSelectedSkill(skillKey); showDialog("edit")}} />)
                        : undefined}
            </TableBody>
          </Table>
        </TableContainer>


        <AddSkillsDialog open={dialogState.add}
                         onClose={() => showDialog()} />
        <NewSkillDialog open={dialogState.new}
                        character={characterKey}
                        onClose={() => showDialog()} />
        <EditSkillDialog open={dialogState.edit} onClose={()=>showDialog()} skillKey={selectedSkill} character={characterKey}/>


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
        },
        centeredInput: {
          textAlign: "center",
        },
        iconButtonCol: {
        },
      });
});

export default CharacterSkills;
