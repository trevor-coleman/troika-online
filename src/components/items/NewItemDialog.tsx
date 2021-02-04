import React, {
  FunctionComponent,
  useState,
  ChangeEvent, PropsWithChildren,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  DialogTitle,
  DialogContent,
  TextField,
  Dialog,
  FormControlLabel,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListItemIcon,
  Collapse,
  TableContainer,
  Paper,
  TableBody,
  Table,
  TableCell, TableRow,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useAuth } from '../../store/selectors';
import { useFirebase } from 'react-redux-firebase';
import { Possession, Damage } from '../../store/Schema';
import { CheckBox } from '@material-ui/icons';
import { type } from 'os';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

interface NewItemDialogProps {
  open: boolean;
  onClose: () => void;
  itemKey?: string;
  character: string | null;
  srd?: boolean;
}

type PossessionValues = Partial<Possession> & { customSize: boolean }

const weaponDamage: { [key: string]: Damage } = {
  sword: [4, 6, 6, 6, 6, 8, 10],
  axe: [2, 2, 6, 6, 8, 10, 12],
  knife: [2, 2, 2, 2, 4, 8, 10],
  staff: [2, 4, 4, 4, 4, 6, 8],
  hammer: [1, 2, 4, 6, 8, 10, 12],
  spear: [4, 4, 6, 6, 8, 8, 10],
  longsword: [4, 6, 8, 8, 10, 12, 14],
  mace: [2, 4, 4, 6, 6, 8, 10],
  polearm: [2, 4, 4, 8, 12, 14, 18],
  maul: [1, 2, 3, 6, 12, 13, 14],
  greatsword: [2, 4, 8, 10, 12, 14, 18],
  club: [1, 1, 2, 3, 6, 8, 10],
  unarmed: [1, 1, 1, 2, 2, 3, 4],
  shield: [2, 2, 2, 4, 4, 6, 8],
  fusil: [2, 4, 4, 6, 12, 18, 24],
  bow: [2, 4, 6, 8, 8, 10, 12],
  crossbow: [4, 4, 6, 8, 8, 8, 10],
  pistolet: [2, 2, 4, 4, 6, 12, 16],
  smallBeast: [2, 2, 3, 3, 4, 5, 6],
  modestBeast: [4, 6, 6, 8, 8, 10, 12],
  largeBeast: [4, 6, 8, 10, 12, 14, 16],
  giganticBeast: [4, 8, 12, 12, 16, 18, 24],

}

const initialState: PossessionValues = {
  armourPiercing: false,
  customSize: false,
  characters: {},
  charges: {
    current: 0,
    max: 0
  },
  damagesAs: "unarmed",
  damage: weaponDamage["unarmed"],
  doesDamage: false,
  hasCharges: false,
  hasModifiers: false,
  modifiers: {},
  protection: 0,
  size: 0,
  description: '',
  name: '',
  protects: false
};

//COMPONENT
const NewItemDialog: FunctionComponent<NewItemDialogProps> = (props: NewItemDialogProps) => {
  const {
    open,
    onClose,
    character,
    srd,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useAuth();
  const firebase = useFirebase();

  const [values, setValues] = useState<PossessionValues>(initialState);

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.id.slice(5)]: event.target.checked
    });
  };


  function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): any {
    setValues({
      ...values,
      [e.target.id.slice(5)]: e.target.value,
    });
  }

  async function saveItem() {

    const characterKeys = character
                          ? {
          [character]: true,
        }
                          : null;
    const itemRef = await firebase.ref('/items')
                                  .push({
                                    ...values,
                                    owner: srd
                                           ? "srd"
                                           : auth.uid,
                                    characters: characterKeys,
                                  });
    if (itemRef.key && character) {
      await firebase.ref(`/characters/${character}/items/${itemRef.key}`)
                    .set(true);
    }
    setValues(initialState);

    onClose();

  }

  const isValid = values.name?.length && values.name.length > 0;

  function handleSelect(e:any): void {
    console.log(typeof(e), e);
  }




  function handleDamageChoice(e: ChangeEvent<{ name?: string; value: any; }>): any {
    const {name, value} = e.target;
    setValues({...values, damagesAs:value, damage:value == "custom" ? values.damage : weaponDamage[value]});
  }

  return (
      <Dialog open={true}
              onClose={onClose}
              maxWidth={"sm"}
              fullWidth>
        <DialogTitle>New Item</DialogTitle>
        <DialogContent>
          <Grid container
                direction={"column"}
                spacing={2}>
            <Grid item>
              <TextField variant={"outlined"}
                         label={"Name"}
                         id={"item-name"}
                         value={values.name}
                         onChange={handleChange}
                         placeholder={"New Item"}
                         fullWidth />
            </Grid>
            <Grid item>
              <TextField variant={"outlined"}
                         multiline
                         id={"item-description"}
                         value={values.description}
                         onChange={handleChange}
                         label={"description"}
                         rows={2}
                         fullWidth />
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={3}>
                <FormControlLabel labelPlacement={"start"} control={<Switch checked={values.protects}
                        onChange={handleChecked}
                        id={"item-protects"}
                        name="item-protects" />} label={"Protects"}/>
              </Grid>
              <Grid item xs={6}>
                  <FormControl fullWidth
                                         disabled={!values.protects}
                                         className={classes.selectControl}>
                    <Select id="protection"
                            value={values.protection ?? 0}
                            name={"protection"}
                            onChange={handleSelect}>
                      <MenuItem value={0}>Unarmoured (0)</MenuItem>
                      <MenuItem value={-1}>Light (-1)</MenuItem>
                      <MenuItem value={-2}>Medium (-2)</MenuItem>
                      <MenuItem value={-3}>Heavy (-3)</MenuItem>
                    </Select>
                  </FormControl>
              </Grid></Grid>
            <Grid item container spacing={2}>
              <Grid item xs={3}>
                <FormControlLabel labelPlacement={"start"}
                                  control={<Switch checked={values.doesDamage}
                                                   onChange={handleChecked}
                                                   id={"item-doesDamage"}
                                                   name="item-doesDamage" />}
                                  label={"Damage"} />
              </Grid>
              <Grid item
                    xs={6}>
                <FormControl fullWidth
                             disabled={!values.doesDamage}
                             className={classes.selectControl}>
                  <Select id="damagesAs"
                          value={values.damagesAs ?? 0}
                          name={"damagesAs"}
                          onChange={handleDamageChoice}>
                    {Object.keys(weaponDamage).sort().map((weapon,index)=>(<MenuItem key={`${index}-${weapon}`} value={weapon}>{weapon}</MenuItem>))}
                    <MenuItem key={`${Object.keys(weaponDamage).length}-custom`}
                              value={"custom"}>Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Collapse in={values.doesDamage}>
            <Grid item container spacing={2}>
              <Grid item xs={3}/>
              <Grid item xs={9}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      {(values.damage??Array(7)).map((_,index)=> <TableCell padding={"none"} key={`damage-cell-${index}`}><TextField InputLabelProps={{classes: {
                          root: classes.damageCell
                        }}} InputProps={{classes: {root:classes.damageCell}}} label={`${index+1}${index==6?"+":""}`} variant={"outlined" } type={"number"} value={values?.damage?.[index] ?? 0}/></TableCell>)}
                    </TableRow>
                  </TableBody>
                </Table>
            </Grid>
          </Grid>
            </Collapse>
            <Grid item container spacing={2}>

            <Grid item xs={3}>
              <FormControlLabel labelPlacement={"start"}
                                control={<Switch checked={values.customSize}
                                                 onChange={handleChecked}
                                                 id={"item-customSize"}
                                                 name="item-customSize" />}
                                label={"Custom Size"} />
            </Grid>
            <Grid item xs={9}>
              <TextField type={"number"} variant={"outlined"} label={"Size"} disabled={!values.customSize} value={values.size ?? 0 } InputLabelProps={{shrink:true}}/>

            </Grid>
            </Grid>

            {/*Size*/}
            <Grid item
                    container>
              <Grid item>

              </Grid>

             </Grid>
             <Grid item
                    container>
               {"Size"}
             </Grid>







            {/*Two Handed*/}

              <Grid item
                     container>
               {"Two Handed"}
             </Grid>

            <Grid item
                     container>
               {"Damage / AP"}
             </Grid>


            <Grid item
                     container>
               {"Charges"}
             </Grid>


            {/*Modifiers*/}

              <Grid item
                     container>
               {"Modifiers"}
             </Grid>

            <Grid item
                  container
                  direction={"row"}
                  spacing={1}>
              <Grid item
                    xs={6} />
              <Grid item
                    xs={3}>
                <Button onClick={onClose}
                        variant={"outlined"}
                        fullWidth>Cancel</Button>
              </Grid>
              <Grid item
                    xs={3}>
                <Button disabled={!isValid}
                        onClick={saveItem}
                        color={'primary'}
                        variant={"contained"}
                        fullWidth>Save</Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>);
};

const FormItem = ({children}:PropsWithChildren<any>)=><ListItem><ListItemText inset>{children}</ListItemText></ListItem>

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      selectControl: {
        flexGrow:1
      },
      damageCell: {
        marginTop: theme.spacing(1)
      }
    }));

export default NewItemDialog;
