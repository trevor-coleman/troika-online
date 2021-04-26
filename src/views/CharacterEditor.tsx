import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';

import { useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import RestDialog from '../components/rest/RestDialog';
import RollDialog from '../components/rolls/RollDialog/RollDialog';
import { rollKey } from '../components/rolls/rollKey';
import CharacterSkills from '../components/skills/CharacterSkills';
import Stats from '../components/stats/Stats';
import Bio from '../components/bio/Bio';
import CharacterItems from '../components/items/CharacterItems';
import CharacterTitle from '../components/characters/CharacterTitle';
import { CharacterContext } from '../contexts/CharacterContext';
import CharacterWeapons from '../components/weapons/CharacterWeapons';
import CharacterSheetSection
  from '../components/characterSheet/CharacterSheetSection';
import { useCharacterRollContext } from '../contexts/CharacterRollContext';
import { GameContext } from '../contexts/GameContext';
import { useAuth, useCharacter } from '../store/selectors';

interface CharacterEditorProps {
  init?: boolean
}

//COMPONENT
const CharacterEditor: FunctionComponent<CharacterEditorProps> = (props: CharacterEditorProps) => {
  const {characterKey} = useParams<{ characterKey: string }>();

  const firebase = useFirebase()

  const rollContext = useCharacterRollContext(characterKey);
  const character = useCharacter(characterKey);
  const auth = useAuth();

  useEffect(()=>{
    document.title = (character?.name ?? "Character Editor") + " - Troika Online"
  }, [character])

  return (
      <GameContext.Provider value={rollContext}>
      <CharacterContext.Provider value={{character: characterKey, editable: character?.owner === auth.uid }}>
        <div>
          <CharacterTitle id={characterKey} />
          <Grid
              container
              direction={'column'}
              spacing={0}>
            <Grid
                item
                xs={12}>
              <Bio />
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
                    <CharacterSkills />
                  </CharacterSheetSection>
                </Grid>
                <Grid
                    item
                    xs={12}>
                  <CharacterSheetSection title={"Weapons"}>
                    <CharacterWeapons />
                  </CharacterSheetSection>
                </Grid>
                <Grid
                    item
                    xs={12}>
                  <CharacterSheetSection title={"Inventory"}>
                    <CharacterItems />
                  </CharacterSheetSection>
                </Grid>
              </Grid>
              <Grid
                  item
                  container
                  xs={3}>
                <CharacterSheetSection title={"Base Stats"}>
                  <Stats />
                </CharacterSheetSection>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <RollDialog parent={"rolls"} id={characterKey} open={false}/>

      </CharacterContext.Provider>
      </GameContext.Provider>);

  const classes = useStyles();
  const dispatch = useDispatch();
};

const useStyles = makeStyles((theme: Theme) => (
    {
      statInput: {
        textAlign: "center",
        paddingLeft: "1rem",
      },
    }));

export default CharacterEditor;
