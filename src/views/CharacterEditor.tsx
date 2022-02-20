import React, {FunctionComponent, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useFirebase, useFirebaseConnect} from 'react-redux-firebase';

import {useParams} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import RollDialog from '../components/rolls/RollDialog/RollDialog';
import CharacterSkills from '../components/skills/CharacterSkills';
import Stats from '../components/stats/Stats';
import Bio from '../components/bio/Bio';
import CharacterItems from '../components/items/CharacterItems';
import CharacterTitle from '../components/characters/CharacterTitle';
import ScrollToTopOnMount from '../components/utility/ScrollToTopOnMount';
import {CharacterContext} from '../contexts/CharacterContext';
import CharacterWeapons from '../components/weapons/CharacterWeapons';
import CharacterSheetSection
    from '../components/characterSheet/CharacterSheetSection';
import {useCharacterRollContext} from '../contexts/CharacterRollContext';
import {GameContext} from '../contexts/GameContext';
import {useAuth, useCharacter, useCharacterName, useCharacterOwner} from '../store/selectors';
import MoniesAndProvisions from '../components/moniesAndProvisions/MoniesAndProvisions';

interface CharacterEditorProps {
    init?: boolean
}

//COMPONENT
const CharacterEditor: FunctionComponent<CharacterEditorProps> = () => {
    const {characterKey} = useParams<{ characterKey: string }>();

    useFirebase();
    useFirebaseConnect([`/bios/${characterKey}/name`, `/characters/${characterKey}/owner`])
    const rollContext = useCharacterRollContext(characterKey);
    const characterName = useCharacterName(characterKey);
    const owner = useCharacterOwner(characterKey);
    const auth = useAuth();

    useEffect(() => {
        document.title = (characterName ?? "Character Editor") + " - Troika Online"
    }, [characterName])

    return (
        <GameContext.Provider value={rollContext}>
            <ScrollToTopOnMount/>
            <CharacterContext.Provider value={{character: characterKey, editable: owner === auth.uid}}>
                <Grid container direction={"column"}>
                    <CharacterTitle id={characterKey}/>
                    <Grid
                        item
                        container
                        direction={'column'}
                        spacing={0}>
                        <Grid
                            item
                            xs={12}>
                            <Bio/>
                        </Grid>
                        <Grid
                            item container spacing={2}
                            xs={12}>
                            <Grid
                                item
                                container
                                xs={9}>
                                <Grid
                                    item
                                    xs={12}>
                                    <CharacterSheetSection title={"Advanced Skills & Spells"}>
                                        <CharacterSkills/>
                                    </CharacterSheetSection>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}>
                                    <CharacterSheetSection title={"Weapons"}>
                                        <CharacterWeapons/>
                                    </CharacterSheetSection>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}>
                                    <CharacterSheetSection title={"Monies & Provisions"}>
                                        <MoniesAndProvisions/>
                                    </CharacterSheetSection>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}>
                                    <CharacterSheetSection title={"Inventory"}>
                                        <CharacterItems/>
                                    </CharacterSheetSection>
                                </Grid>
                            </Grid>
                            <Grid
                                item
                                container
                                xs={3}>
                                <CharacterSheetSection title={"Base Stats"}>
                                    <Stats/>
                                </CharacterSheetSection>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <RollDialog parent={"rolls"} id={characterKey} open={false}/>
            </CharacterContext.Provider>
        </GameContext.Provider>);


};

const useStyles = makeStyles(() => (
    {
        gridContainer: {
            flexWrap: "revert",
        },
        statInput: {
            textAlign: "center",
            paddingLeft: "1rem",
        },
    }));

export default CharacterEditor;
