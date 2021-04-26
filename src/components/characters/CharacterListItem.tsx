import Button from '@material-ui/core/Button';
import { Delete } from '@material-ui/icons';
import React, {
  FunctionComponent,
  Component,
  PropsWithChildren,
  ComponentType,
  useState,
  useEffect,
} from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  ListItemText,
  ListItem,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";
import {
  useFirebaseConnect,
  isLoaded,
  useFirebase,
} from "react-redux-firebase";
import { useTypedSelector } from "../../store";
import { useHistory } from "react-router-dom";

interface CharacterListItemProps {
  characterKey: string;
  editing?: boolean;
  firstAction?: JSX.Element;
  onRemoveCharacter?: (character:string)=>void;
}

//COMPONENT
const CharacterListItem: FunctionComponent<CharacterListItemProps> = (
  props: CharacterListItemProps
): JSX.Element => {
  const { characterKey, firstAction, editing, onRemoveCharacter } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const firebase = useFirebase();

  useFirebaseConnect({ path: `/characters/${characterKey}` });
  const character = useTypedSelector(
    (state) =>
      state.firebase.data?.characters?.[characterKey] ?? {
        name: "",
        portrait: "",
      }
  );



  const [portraitUrl, setPortraitURL] = useState("");

  useEffect(() => {
    getPortrait();
  });

  async function getPortrait() {
    setPortraitURL(
      character?.portrait
        ? await firebase.storage().ref(character?.portrait).getDownloadURL()
        : portraitUrl
    );
  }

  const [showConfirm, setShowConfirm] = useState(false);



  return isLoaded(character) ? (
    <ListItem
      className={classes.root}
      button
      onClick={editing ? ()=>setShowConfirm(true) : () => history.push(`/character/${characterKey}/edit`)}
    >
      <ListItemAvatar>
        {editing
         ? <Avatar className={classes.deleteIcon}><Delete /></Avatar>
         : <Avatar src={portraitUrl}>{character.name.slice(0, 1)}</Avatar>}
      </ListItemAvatar>
      <ListItemText primary={character?.name ?? ""} />
      <ListItemSecondaryAction>
      {editing && showConfirm
       ?
         <><Button variant={"contained"} onClick={()=>setShowConfirm(false)}>Cancel</Button>{`  `}
         <Button variant={'contained'} color={'secondary'} onClick={()=> {
           if(onRemoveCharacter) onRemoveCharacter(characterKey);
         }}>DELETE</Button></>
       : ""}
      {firstAction ? (
        {firstAction}
      ) : (
        ""
      )}</ListItemSecondaryAction>
    </ListItem>
  ) : (
    <ListItem />
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    borderBottomWidth: 1,
    borderColor: theme.palette.divider,
    borderStyle: "solid",
  },
  deleteIcon: {
    backgroundColor: theme.palette.secondary.main
  }
}));

export default CharacterListItem;
