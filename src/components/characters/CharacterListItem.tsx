import Button from '@material-ui/core/Button';
import { Delete } from '@material-ui/icons';
import React, {
  FunctionComponent,
  useState,
  useEffect, useMemo, useRef,
} from "react";
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
import { useHistory } from "react-router-dom";
import {
  useAuth,
  useCharacter,
  useCharacterGameKey,
  useCharacterName,
  useGame,
  usePortrait, usePortraitUrl
} from '../../store/selectors';

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

  const history = useHistory();
  const firebase = useFirebase();

  useFirebaseConnect([`/characters/${characterKey}`, `/portraits/${characterKey}/portrait`] );

  const auth=useAuth();
  const gameKey=useCharacterGameKey(characterKey);
  const game=useGame(gameKey ?? "")
  const name=useCharacterName(characterKey)
  const character = useCharacter(characterKey);
  const portraitUrl = usePortraitUrl(characterKey);

  const hasEditPermission = (
      character?.owner === auth.uid || game?.owner === auth.uid)
  const showEditButton = editing && hasEditPermission;



  const [showConfirm, setShowConfirm] = useState(false);



  return isLoaded(character) ? (
    <ListItem
        disabled={editing && !hasEditPermission}
      className={classes.root}
      button
      onClick={showEditButton ? ()=>setShowConfirm(true) : () => history.push(`/character/${characterKey}/edit`)}
    >
      <ListItemAvatar>
        {showEditButton
         ? <Avatar className={classes.deleteIcon}><Delete /></Avatar>
         : <Avatar src={portraitUrl}>{name.slice(0, 1)}</Avatar>}
      </ListItemAvatar>
      <ListItemText primary={character?.name ?? ""} />
      <ListItemSecondaryAction>
      {showEditButton && showConfirm
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
