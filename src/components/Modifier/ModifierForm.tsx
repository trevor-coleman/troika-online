import React, { useState } from 'react';
import { Modifier} from '../../types/troika';
import {
  TextField,
  Checkbox,
  FormGroup, FormControlLabel, Grid
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

interface ModifierFormProps {
  modifiers: Modifier[];
  addModifier: (modifier: Modifier)=>void
}


const ModifierForm = ({modifiers, addModifier}:ModifierFormProps) => {
  const [targetSelf, setTargetSelf] = useState(false);
  const [targetEnemy, setTargetEnemy] = useState(false);
  const [targetPlayer, setTargetPlayer] = useState(false);
  const [targetObject, setTargetObject] = useState(false);

  return (<div>
    <Typography variant={"subtitle1"}>Modifiers</Typography>
    <Grid container spacing={2}>
      <Grid item>
    <TextField id={"modifier-value"} label={"value"} />
      </Grid>
      <Grid item>
    <TextField id={"modifier-affects"} label={"effect"} />
      </Grid>
    </Grid>
    <FormGroup row>
      <FormControlLabel control={<Checkbox checked={targetSelf}
                                           onChange={(e)=>setTargetSelf(e.target.checked)}
                                           name="targetSelf" />}
                        label="Self" />
      <FormControlLabel control={<Checkbox checked={targetEnemy}
                                           onChange={(e) => setTargetEnemy(e.target.checked)}
                                           name="targetEnemy" />} label="Enemy" />
      <FormControlLabel control={<Checkbox checked={targetPlayer}
                                           onChange={(e) => setTargetPlayer(e.target.checked)}
                                           name="targetPlayer" />} label="Character" />
      <FormControlLabel control={<Checkbox checked={targetObject}
                                           onChange={(e) => setTargetObject(e.target.checked)}
                                           name="tagetObject" />} label="Object" />
    </FormGroup>
  </div>);
  }

export default ModifierForm;


// export interface Modifier {
//   value: number;
//   type: "equipped" | "permanent" | "one-roll",
//   targetTypes: Target[],
//   targets: string[],
// }

