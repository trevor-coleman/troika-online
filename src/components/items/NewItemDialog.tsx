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
  Fade, CircularProgress,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useAuth } from '../../store/selectors';
import { useFirebase } from 'react-redux-firebase';
import { Possession } from '../../store/Schema';
import { Add } from '@material-ui/icons';
import Box from '@material-ui/core/Box';
import NameInput from './forms/NameInput';
import DescriptionInput from './forms/DescriptionInput';
import ArmourSection from './forms/ArmourSection';
import DamageSection, { weaponDamage } from './forms/DamageSection';
import { FormValueChange } from './forms/FormValueChange';
import CustomSizeSection from './forms/CustomSizeSection';
import ChargesSection from './forms/ChargesSection';
import { calculateSize } from './calculateSize';

interface NewItemDialogProps {
  open: boolean;
  onClose: () => void;
  itemKey?: string;
  character: string | null;
  inventory?: string[];
  srd?: boolean;
}

const initialState: Possession = {
  ranged        : false,
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
  twoHanded     : false,
  size          : 1,
  description   : '',
  name          : '',
  protects      : false,
};

//COMPONENT
const NewItemDialog: FunctionComponent<NewItemDialogProps> = (props: NewItemDialogProps) => {
  const {
    open,
    onClose,
      inventory,
    character,
    srd,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useAuth();
  const firebase = useFirebase();

  const [values, setValues] = useState<Possession>(initialState);
  const [isSaving, setIsSaving] = useState(false);

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


  function handleValueUpdates(updates: FormValueChange<any>[]) {

    const update = updates.reduce<Partial<Possession>>((prev, curr, index) => {
      const sizeOverride = calculateSize(values, curr);
      console.log(curr.id, curr.value);

      return {
        ...prev,
        [curr.id]: curr.value, ...sizeOverride,
      };
    }, {});

    setValues({...values, ...update});
  }

  async function saveItem() {
    setIsSaving(true)

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
    if (itemRef.key)
    {
      if(!character){
        setValues(initialState);
        setIsSaving(false);
        onClose();
        return
      }

      const newInventory = [...(inventory ?? []), itemRef.key]

      const saveToProfile = firebase.ref(`/profiles/${auth.uid}/items/${itemRef.key}`).set(true);
      const saveToCharacter = firebase.ref(`/characters/${character}/items/${itemRef.key}`)
                    .set(true);
      const saveToCharacterInventory= firebase.ref(`/characters/${character}/inventory`).set(newInventory);


      await Promise.all([
                          saveToProfile,
                          saveToCharacter,
                          saveToCharacterInventory
                        ]);
      setIsSaving(false);
    } else {
      setIsSaving(false);
    }





  }

  const isValid = values.name?.length && values.name.length > 0;

  function handleSelect(e: any): void {
    console.log(typeof (
        e), e);
  }

  return (
      <Dialog open={open}
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
              <ArmourSection protects={values.protects}
                             protection={values.protection}
                             onChange={handleValueUpdates} />
            </Grid>
            <Grid item
                  container
                  spacing={2}>
              <DamageSection damagesAs={values.damagesAs}
                             damage={values.damage}
                             doesDamage={values.doesDamage}
                             twoHanded={values.twoHanded}
                             ranged={values.ranged}
                             armourPiercing={values.armourPiercing}
                             onChange={handleValueUpdates} />

            </Grid>
            <Grid item
                  container
                  spacing={2}>

              <CustomSizeSection customSize={values.customSize}
                                 size={values.size}
                                 onChange={handleValueUpdates} />


            </Grid>

            <Grid item
                  container
                  spacing={2}>
              <ChargesSection charges={values.charges} hasCharges={values.hasCharges} onChange={handleValueUpdates}/>
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
                    xs={6} className={classes.saveButton}>
                <Button onClick={onClose}
                        variant={"outlined"}
                        fullWidth>Cancel</Button>
                <Button disabled={!isValid || isSaving}
                        onClick={saveItem}
                        color={"primary"}
                        variant={"contained"}
                        fullWidth>{isSaving? "Saving" : "Save"}</Button>
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
      saveButton: {
        margin  : theme.spacing(1),
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
      },
      buttonProgress: {
        position  : 'absolute',
        top       : '50%',
        left      : '50%',
        marginTop : -12,
        marginLeft: -12,
      },
    }));

export default NewItemDialog;
