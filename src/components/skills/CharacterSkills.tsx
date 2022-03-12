import React, {FunctionComponent, useState, useContext} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {useFirebaseConnect, useFirebase, isEmpty} from 'react-redux-firebase';
import {useTypedSelector} from '../../store';
import {CharacterContext} from '../../contexts/CharacterContext';
import {useAuth} from '../../store/selectors';
import {Skill} from '../../store/Schema';
import AddSkillsDialog from './AddSkillsDialog';
import EditSkillDialog from './EditSkillDialog';
import SkillCard from './SkillCard';
import Grid from '@material-ui/core/Grid';
import {Fade} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {AddCircleOutline} from '@material-ui/icons';

interface CharacterSkillsProps {

}

const initialState: { add: boolean; new: boolean; edit: boolean; remove: boolean } = {
    add: false,
    new: false,
    edit: false,
    remove: false,
};

//COMPONENT
const CharacterSkills: FunctionComponent<CharacterSkillsProps> = () => {

    const classes = useStyles();
    const firebase = useFirebase();
    const auth = useAuth();
    const {character, editable} = useContext(CharacterContext);


    useFirebaseConnect([
        {
            path: `/characters/${character}/skillList`,
            storeAs: `characters/${character}/skillList`,
        },
    ]);
    const skillList = useTypedSelector(state => state.firebase.data?.characters?.[character]?.skillList) ??
        [];
    const [selectedSkill, setSelectedSkill] = useState("");

    const [dialogState, setDialogState] = useState<{ [key: string]: boolean }>(
        initialState);

    function showDialog(dialog?: string, key?: string): void {
        setSelectedSkill(key ?? "");
        const newState = initialState;
        setDialogState(dialog
            ? {
                ...newState,
                [dialog]: true,
            }
            : newState);
    }

    const createSkill = (
        (newSkill: Partial<Skill>) => {
            const newKey = firebase.ref(`/skills/${character}`)
                .push({
                    ...newSkill,
                    name: newSkill.name ?? "New Skill",
                    owner: auth.uid,
                    character: character,
                }).key;
            const newSkillList = [...skillList, newKey];
            firebase.ref(`/characters/${character}/skillList`)
                .set(newSkillList);
        });

    const addSkills = async (skills: { [key: string]: Skill }) => {
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
            await skillsRef.child(newKey)
                .set(skills[selectedKey]);
        }

        const newSkillList = skillList.concat(newKeys);
        await firebase.ref(`/characters/${character}/skillList`)
            .set(newSkillList);
    };



    const [addVisible, setAddVisible] = useState(false);

    const toggleAdd = () => {
        setAddVisible(!addVisible);
    };

    return (
        <div>
            <Grid
                container
                direction={"column"}>
                {isEmpty(skillList)
                    ? <Grid
                        item
                        xs={12}
                        className={classes.missingMessage}>
                        <Typography>Click the button below to add a
                            skill</Typography>
                    </Grid>
                    : ""}
                {skillList
                    .map(skill => <Grid
                        item
                        xs={12}
                        key={skill}>
                        <SkillCard
                            skill={skill}
                            onEdit={() => {

                                showDialog("edit", skill);
                            }}
                            onRemove={() => {
                                showDialog("remove", skill);
                            }}/>
                        <Grid
                            item
                            container
                            xs={12}>
                            <Grid item>

                            </Grid>
                        </Grid>
                    </Grid>)}
            </Grid>

            <Grid
                container
                className={classes.root}>
                <Grid
                    item
                    container
                    direction={"row"}
                    alignItems={"center"}
                    spacing={2}
                    xs={12}>
                    <Grid item>
                        <Button classes={{text: classes.addNewSkillText}} startIcon={<AddCircleOutline/>}
                                disabled={!editable} onClick={toggleAdd}>
                            Add New Skill
                        </Button>
                    </Grid>
                    <Grid item>
                        <Fade in={addVisible}>
                            <Button
                                onClick={() => {
                                    showDialog("add");
                                    setAddVisible(false);
                                }}
                                variant={"contained"}>From SRD</Button>
                        </Fade>
                    </Grid>
                    <Grid item>
                        <Fade in={addVisible}>
                            <Button
                                onClick={() => {
                                    createSkill({});
                                    setAddVisible(false);
                                }}
                                variant={"contained"}>New</Button>
                        </Fade>
                    </Grid>

                </Grid>
            </Grid>
            <AddSkillsDialog
                open={dialogState.add}
                character={character}
                onClose={() => showDialog()}
                onAdd={addSkills}/>
            <EditSkillDialog
                open={dialogState.edit}
                onClose={() => showDialog()}
                skill={selectedSkill}/>
        </div>);
};

const useStyles = makeStyles((theme: Theme) => {
    return (
        {
            root: {
                paddingLeft: theme.spacing(2),
            },
            sectionTitle: {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: theme.spacing(2),
            },
            missingMessage: {
                color: theme.palette.text.disabled,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: theme.spacing(4),
            },
            addNewSkillText: {
                color: theme.palette.grey["500"]
            }
        });
});

export default CharacterSkills;
