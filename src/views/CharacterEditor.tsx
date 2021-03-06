import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';

import { useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
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
import { GameContext, TGameContext } from '../contexts/GameContext';
import { useTypedSelector } from '../store';
import { FbRoll } from '../store/Schema';

interface CharacterEditorProps {
  init?: boolean
}

function onRender(id: string, // the "id" prop of the Profiler tree that has just committed
                  phase: string, // either "mount" (if the tree just mounted)
                                 // or "update" (if it re-rendered)
                  actualDuration: any, // time spent rendering the committed
                                       // update
                  baseDuration: any, // estimated time to render the entire
                                     // subtree without memoization
                  startTime: any, // when React began rendering this update
                  commitTime: any, // when React committed this update
                  interactions: any, // the Set of interactions belonging to
                  // this update
)
{
  console.log({
                id,
                phase,
                actualDuration,
                baseDuration,
                startTime,
                commitTime,
                interactions,
              });
}

//COMPONENT
const CharacterEditor: FunctionComponent<CharacterEditorProps> = (props: CharacterEditorProps) => {
  const {characterKey} = useParams<{ characterKey: string }>();
  const [id, setId] = useState("");

  useEffect(() => {
    if (id !== characterKey) {
      setId(characterKey);
    }
  }, [characterKey]);

  const firebase = useFirebase()

  const rollContext = useCharacterRollContext(characterKey);

  return (
      <GameContext.Provider value={rollContext}>
      <CharacterContext.Provider value={{character: characterKey}}>
        <div>
          <CharacterTitle id={id} />
          <Grid
              container
              direction={'column'}
              spacing={0}>
            <Grid
                item
                xs={12}>
              <Bio characterKey={id} />
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
        <RollDialog parent={"123"} id={"123"} open={true}/>
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
