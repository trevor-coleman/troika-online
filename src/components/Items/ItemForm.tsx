import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import ModifierForm from '../Modifier/ModifierForm';
import { Modifier } from '../../types/troika';

interface ItemFormProps {
  parent: string;
}

//COMPONENT
const ItemForm: FunctionComponent<ItemFormProps> = (props: ItemFormProps) => {
  const {parent} = props;
  const classes = useStyles();
  const firebase = useFirebase();
  useFirebaseConnect(() => []);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hasCharges, setHasCharges] = useState(false);
  const [chargesRemaining, setChargesRemaining] = useState("");
  const [chargesTotal, setChargesTotal] = useState("");

  const item = {
    name,
    description,
  };

  function createItem() {
    return firebase.push(`items/${parent}`, item);
  }

  return (
      <form className={classes.root} noValidate autoComplete={"off"}>
        <Grid container direction={"column"} spacing={2}>
          <Grid item>
            <TextField fullWidth
                       size={"small"}
                       id="item-name"
                       variant={"outlined"}
                       label={"Name"}
                       value={name}
                       onChange={(e) => setName(e.target.value)} />
          </Grid>
          <Grid item>
            <TextField multiline
                       fullWidth
                       size={"small"}
                       id="item-description"
                       variant={"outlined"}
                       label={"Description"}
                       value={description}
                       onChange={(e) => setDescription(e.target.value)} />
          </Grid>
          <Grid item>
            <Typography paragraph variant={"subtitle1"}>Charges</Typography>
            <Checkbox id={"has-charges"}
                      value={hasCharges}
                      onClick={() => setHasCharges(!hasCharges)} />
            <TextField disabled={!hasCharges}
                       id={"charges-remaining"}
                       variant={"outlined"}
                       label={"Remaining"}
                       value={chargesRemaining}
                       onChange={(e) => setChargesRemaining(e.target.value)} />{" / "}
            <TextField id={"total-charges"}
                       disabled={!hasCharges}
                       variant={"outlined"}
                       label={"Total"}
                       value={chargesTotal}
                       onChange={(e) => setChargesTotal(e.target.value)} />
          </Grid>
          <Grid item>
            <ModifierForm modifiers={[]}
                          addModifier={(modifier: Modifier) => {return;}} />
          </Grid>
          <Grid item>
            <Button color={"primary"}
                    variant={"contained"}
                    onClick={createItem}>
              Create Item
            </Button>
          </Grid>
        </Grid>

      </form>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {
        width: "100%",
      },
    }));

export default ItemForm;
