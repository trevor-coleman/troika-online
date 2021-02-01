import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  DialogTitle,
  DialogContent,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText, Dialog,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';

interface AddSkillsDialogProps {
  open: boolean
  onClose: ()=>void
}

//COMPONENT
const AddSkillsDialog: FunctionComponent<AddSkillsDialogProps> = (props: AddSkillsDialogProps) => {
  const {open, onClose} = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
      <Dialog open={open} onClose={onClose}
              maxWidth={"xs"}
              fullWidth>
        <DialogTitle>Add Skills</DialogTitle>
        <DialogContent>
          <Grid container
                direction={"column"}
                spacing={1}>
            <Grid item>
              <List>
                <ListItem>
                  <ListItemIcon><Checkbox /></ListItemIcon>
                  <ListItemText primary={"Skill"} />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default AddSkillsDialog;
