import React, {
  FunctionComponent, useState, ChangeEvent, PropsWithChildren,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  DialogTitle,
  DialogContent,
  TextField,
  Dialog,
  FormControlLabel,
  Switch,
  ListItem,
  ListItemText,
  FormGroup,
  Chip,
  Avatar,
  Fade,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useAuth } from '../../store/selectors';
import { useFirebase } from 'react-redux-firebase';
import { Possession, Damage } from '../../store/Schema';
import Divider from '@material-ui/core/Divider';
import { Add } from '@material-ui/icons';
import Box from '@material-ui/core/Box';
import NameInput from './forms/NameInput';
import DescriptionInput from './forms/DescriptionInput';
import ArmourSection from './forms/ArmourSection';
import DamageSection, { weaponDamage } from './forms/DamageSection';
import { FormValueChange } from './forms/FormValueChange';

interface NewItemDialogProps {
  open: boolean;
  onClose: () => void;
  itemKey?: string;
  character: string | null;
  srd?: boolean;
}

const initialState: Possession = {
  armourPiercing: false,
  customSize    : false,
  characters    : {},
  charges       : {
    initial: 0,
    max    : 0,
  },
  damagesAs     : "unarmed",
  damage        : weaponDamage["unarmed"],
  doesDamage    : false,
  hasCharges    : false,
  hasModifiers  : false,
  modifiers     : {},
  protection    : 0,
  size          : 0,
  description   : '',
  name          : '',
  protects      : false,
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

  const [values, setValues] = useState<Possession>(initialState);

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
                ...values,
                [event.target.id.slice(5)]: event.target.checked,
              });
  };

  function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): any {
    setValues({
                ...values,
                [e.target.id.slice(5)]: e.target.value,
              });
  }

  function handleValueUpdate(updates: FormValueChange<any>[]) {

    const update = updates.reduce<Partial<Possession>>((prev, curr, index) => {
      return {
        ...prev,
        [curr.id]: curr.value,
      };
    }, {});

    setValues({...values, ...update});
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
                                          owner     : srd
                                                      ? "srd"
                                                      : auth.uid,
                                          characters: characterKeys,
                                        });
    if (itemRef.key && character)
    {
      await firebase.ref(`/characters/${character}/items/${itemRef.key}`)
                    .set(true);
    }
    setValues(initialState);

    onClose();

  }

  const isValid = values.name?.length && values.name.length > 0;

  function handleSelect(e: any): void {
    console.log(typeof (
        e), e);
  }

  return (
      <Dialog open={true}
              onClose={onClose}
              maxWidth={"sm"}
              fullWidth>
        <DialogTitle>{values.name && values.name.length
                      ? values.name
                      : "New Item"}</DialogTitle>
        <DialogContent>
          <Grid container
                direction={"column"}
                spacing={2}>
            <Grid item>
              <NameInput name={values.name}
                         onChange={handleChange} />
            </Grid>
            <Grid item>
              <DescriptionInput description={values.description}
                                onChange={handleChange} />
            </Grid>
            <Grid item
                  container
                  spacing={2}>
              <ArmourSection enabled={values.protects}
                             protection={values.protection}
                             onChange={handleValueUpdate} />
            </Grid>
            <Grid item
                  container
                  spacing={2}>
              <Grid item
                    xs={3}>
                <FormControlLabel labelPlacement={"start"}
                                  control={<Switch checked={values.doesDamage}
                                                   onChange={handleChecked}
                                                   id={"item-doesDamage"}
                                                   name="item-doesDamage" />}
                                  label={"Damage"} />
              </Grid>
              <Grid item
                    xs={9}>
                <DamageSection damagesAs={values.damagesAs}
                               damage={values.damage}
                               doesDamage={values.doesDamage}
                               onChange={handleValueUpdate} />

              </Grid>
            </Grid>

            <Grid item
                  container
                  spacing={2}>

              <Grid item
                    xs={3}>
                <FormControlLabel labelPlacement={"start"}
                                  control={<Switch checked={values.customSize}
                                                   onChange={handleChecked}
                                                   id={"item-customSize"}
                                                   name="item-customSize" />}
                                  label={"Custom Size"} />
              </Grid>
              <Grid item
                    xs={9}>
                <TextField fullWidth
                           type={"number"}
                           variant={"outlined"}
                           label={"Size"}
                           disabled={!values.customSize}
                           value={values.size ?? 0}
                           InputLabelProps={{shrink: true}} />
              </Grid>
            </Grid>

            <Grid item
                  container
                  spacing={2}>
              <Grid item
                    xs={3}>
                <FormControlLabel labelPlacement={"start"}
                                  control={<Switch checked={values.hasCharges}
                                                   onChange={handleChecked}
                                                   id={"item-hasCharges"}
                                                   name="item-hasCharges" />}
                                  label={"Charges"} />
              </Grid>
              <Grid item
                    xs={9}>
                <FormGroup row>
                  <TextField value={values.charges?.initial ?? 0}
                             disabled={!values.hasCharges}
                             variant={"outlined"}
                             label={"Initial"}
                             type={"number"}
                             InputLabelProps={{shrink: true}} />
                  <TextField value={values.charges?.initial ?? 0}
                             variant={"outlined"}
                             disabled={!values.hasCharges}
                             label={"Max"}
                             type={"number"}
                             InputLabelProps={{shrink: true}} /> </FormGroup>
              </Grid>
            </Grid>

            <Grid item
                  container
                  spacing={2}>
              <Grid item
                    xs={3}><FormControlLabel labelPlacement={"start"}
                                             control={
                                               <Switch checked={values.hasModifiers}
                                                       onChange={handleChecked}
                                                       id={"item-hasModifiers"}
                                                       name="item-hasModifiers" />}
                                             label={"Modifiers"} /></Grid>
              <Grid item
                    xs={9}><Box p={2}>
                <Fade in={values.hasModifiers}>
                  <Grid container
                        spacing={2}><Chip avatar={<Avatar>+1</Avatar>}
                                          label="Second Sight"
                                          clickable
                                          onDelete={(e) => {console.log(e);}}
                                          color="primary" />
                    <Chip avatar={<Avatar><Add /></Avatar>}
                          clickable
                          label="New Modifier" /></Grid>
                </Fade></Box>
              </Grid></Grid>

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

const FormItem = ({children}: PropsWithChildren<any>) =>
    <ListItem><ListItemText inset>{children}</ListItemText></ListItem>;

const useStyles = makeStyles((theme: Theme) => (
    {
      root         : {},
      selectControl: {
        flexGrow: 1,
      },
    }));

export default NewItemDialog;
