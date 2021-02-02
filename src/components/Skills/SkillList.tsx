import React, {
  FunctionComponent, PropsWithChildren, ChangeEvent, useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { useTypedSelector } from '../../store';
import {
  ListItemText,
  Checkbox,
  Popover, ListItemSecondaryAction,
} from '@material-ui/core';
import { CheckBox, InfoOutlined } from '@material-ui/icons';
import { useFirebaseConnect } from 'react-redux-firebase';
import Typography from '@material-ui/core/Typography';

interface SkillListProps {
  skills:string[];
  setValues:(values:{[key: string]:boolean})=>void;
  values: {[key:string]:boolean};
}

//COMPONENT
const SkillList: FunctionComponent<SkillListProps> = (props: SkillListProps) => {
  const {skills, values, setValues} = props;
  const classes = useStyles();
  const dispatch = useDispatch();



  const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
    setValues({...values, [e.target.id]: e.target.checked})
  }

  return (
      <List>
        {skills.map(skill=><SkillListItem key={skill} skill={skill} selected={values[skill] ?? false} onChange={handleChange} />)}
            </List>
        );
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
      popover: {
          pointerEvents: 'none',
      },
      paper: {
        padding: theme.spacing(1),
        maxWidth: theme.spacing(40)
      }
    }));

export default SkillList;

interface SkillListItemProps {
  skill:string,
  onChange: (e:ChangeEvent<HTMLInputElement>)=>void;
  selected: boolean;
}

const SkillListItem = ({skill, onChange, selected}:SkillListItemProps)=> {
  useFirebaseConnect([`/skills/${skill}`])
  const classes =  useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = (s:string) => {
    console.log(s);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  console.log(open);


  const skillInfo = useTypedSelector(state => state.firebase.data.skills[skill])
  return <><ListItem><Checkbox id={skill} onChange={onChange} checked={selected??false} /> <ListItemText primary={skillInfo?.name ?? ""}
                                                                                                         onMouseEnter={handlePopoverOpen}
                                                                                                         onMouseLeave={() => handlePopoverClose(
                                                                                                             "boo")}/></ListItem>
    <Popover id={"mouse-popper"}
             open={open}
             className={classes.popover}
             classes={{
               paper: classes.paper,
             }}
             anchorEl={anchorEl}
             onClose={(e)=>{}}
             anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'center',
             }}
             transformOrigin={{
               vertical: 'top',
               horizontal: 'center',
             }}
             disableRestoreFocus>
      <Typography>{skillInfo?.description ?? ""}</Typography>
    </Popover></>
}
