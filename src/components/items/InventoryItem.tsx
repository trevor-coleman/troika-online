import React, { FunctionComponent, PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  useFirebase,
  useFirebaseConnect, isLoaded,
} from 'react-redux-firebase';
import { useAuth, useItem } from '../../store/selectors';
import {
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Collapse, CardActions,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {
  DragHandle,
  Security,
  MoreVert, SecurityTwoTone,
} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';

interface IInventoryItemProps {
  id: string;
}

type InventoryItemProps = PropsWithChildren<IInventoryItemProps>

//COMPONENT
const InventoryItem: FunctionComponent<InventoryItemProps> = (props: InventoryItemProps) => {
  const {
    id,
  } = props;
  const classes = useStyles();
  const firebase = useFirebase();
  const auth = useAuth();
  useFirebaseConnect([`/items/${id}`]);
  const item = useItem(id);

  return (
      <Grid item xs={6}><Card>
        <CardHeader avatar={<DragHandle/>} title={item?.name} subheader={"Weapon, Protection, Charges"} action={<><Avatar><MoreVert/></Avatar>
        </>}/>
        <CardActions><IconButton><SecurityTwoTone/></IconButton></CardActions>
        <Collapse in={false}><CardContent>
          <Typography>{item?.description ?? ""}</Typography>
        </CardContent></Collapse>
      </Card></Grid>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default InventoryItem;
