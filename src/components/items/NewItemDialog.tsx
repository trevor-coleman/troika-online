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

  function calculateSize(update: FormValueChange<any>) {
    const sizeOverride: Partial<Possession> = {};
    const {
      id,
      value,
      source,
    } = update;

    function twoHandedSize(isTwoHanded: boolean) {

      return isTwoHanded
             ? Math.max(2,
                        (
                            values.protects && values.protection)
                        ? values.protection * -2
                        : 0,
                        1)
             : Math.max((
                            values.protects && values.protection)
                        ? values.protection * -2
                        : 0, 1);
    }

    function protectionSize(protects: boolean, protection: number) {
      console.log(protects, Math.max(1,

                           values.doesDamage && values.twoHanded
                           ? 2
                           : 0,

                           protects && protection
                           ? protection * -2
                           : 0))
      return protects
             ? Math.max(1,

                        values.doesDamage && values.twoHanded
                        ? 2
                        : 0,

                        protects && protection
                        ? protection * -2
                        : 0)

             : Math.max(1,
                        (
                            values.doesDamage && values.twoHanded)
                        ? 2
                        : 0);
    }

    //reject changes if custom size is enabled
    if (values.customSize && id === "size" && source !== "customSizeSection")
    {
      sizeOverride.size = value.size;
    }

    //recalculate size if disabling custom size
    else if (id === "customSize" && !value)
    {
      sizeOverride.size =
          Math.max(values.twoHanded
                   ? 2
                   : 0,
                   values.protects && values.protection
                   ? values.protection * -2
                   : 0,
                   1);
    }

    else if (id === "doesDamage")
    {
      if (value && values.twoHanded)
      {
        sizeOverride.size = twoHandedSize(values.twoHanded);
      }
      else
      {
        sizeOverride.size = twoHandedSize(false);
        console.log(sizeOverride);
      }
    }

    //adjust size if needed for two handed weapons
    else if (id === "twoHanded" && !values.customSize)
    {
      sizeOverride.size = twoHandedSize(value);
    }

    else if (id == "protects" && !values.customSize)
    {
      sizeOverride.size = protectionSize(value, values.protection ?? 0);
    }

    //adjust size if needed for armour
    else if (id === "protection" && !values.customSize)
    {
      sizeOverride.size = protectionSize(values.protects, value);
    }

    return sizeOverride;
  }

  function handleValueUpdates(updates: FormValueChange<any>[]) {

    const update = updates.reduce<Partial<Possession>>((prev, curr, index) => {
      const sizeOverride = calculateSize(curr);

      return {
        ...prev,
        [curr.id]: curr.value, ...sizeOverride,
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
      const newInventory = [...(inventory ?? []), itemRef.key]

      await firebase.ref(`/characters/${character}/items/${itemRef.key}`)
                    .set(true);
      await firebase.ref(`/characters/${character}/inventory`).set(newInventory);
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
              <ArmourSection enabled={values.protects}
                             protection={values.protection}
                             onChange={handleValueUpdates} />
            </Grid>
            <Grid item
                  container
                  spacing={2}>
              <DamageSection damagesAs={values.damagesAs}
                             damage={values.damage}
                             doesDamage={values.doesDamage}
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
