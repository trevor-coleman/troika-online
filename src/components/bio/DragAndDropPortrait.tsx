import { ReactComponent } from '*.svg';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import DragAndDrop from '../DragAndDrop';
import { usePortrait, useCharacter } from '../../store/selectors';
import {
  useFirebaseConnect, isLoaded, useFirebase, isEmpty,
} from 'react-redux-firebase';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { ReactComponent as SirHorse } from './horse-svgrepo-com.svg'

interface DragAndDropAvatarProps {
  characterKey: string,
  alt: string
}

//COMPONENT
const DragAndDropPortrait: FunctionComponent<DragAndDropAvatarProps> = (props: DragAndDropAvatarProps) => {
  const {
    characterKey,
    alt,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const firebase = useFirebase();
  useFirebaseConnect([
    `/portraits/${characterKey}`, `/characters/${characterKey}/portrait`,
  ]);
  const character = useCharacter(characterKey);
  const portrait = usePortrait(characterKey);
  const [portraitUrl, setPortraitURL] = useState("");

  async function getPortrait() {
    setPortraitURL(character?.portrait
                   ? await firebase.storage()
                                   .ref(character?.portrait)
                                   .getDownloadURL()
                   : portraitUrl);
  }

  useEffect(() => {
    getPortrait();
  }, [portrait, character]);

  const handleDrop = async (files: FileList): Promise<void> => {
    if (!isValidFiles(files)) return;
    const fileExtensions: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/png' : 'png',
      'image/gif' : 'gif',
    };

    const name = `${characterKey}.${fileExtensions[files[0].type]}`;

    const ref = await firebase.uploadFile('portraits',
        files[0],
        `/characters/${characterKey}/portraits`,
        {name});

    if (ref) {
      if (!isEmpty(character?.portrait)) {
        await firebase.storage()
                      .ref(character?.portrait)
                      .delete();
      }
      await firebase.ref(`/characters/${characterKey}/portrait`)
                    .set(ref.uploadTaskSnapshot.metadata.fullPath);
    }
  };

  function isValidFiles(files: FileList | undefined): boolean {
    if (!files) return false;
    if (files.length == 0 || files.length > 1) return false;
    const file = files[0];
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (!acceptedImageTypes.includes(file.type)) return false;
    if (file.size > 1048576) return false;
    return true;
  }

  return (
      <Box
          alignItems={"center"}
          justifyItems={"center"}
          className={classes.root}>

        <DragAndDrop handleDrop={handleDrop}>{portraitUrl == ""
                                              ? <Box className={classes.placeHolder} ><SirHorse /></Box>
                                              : <img
                                                  alt={alt ??
                                                       "avatar-placeholder"}
                                                  src={portraitUrl}
                                                  className={classes.portrait} />}</DragAndDrop>
        <Typography
            paragraph
            align={"center"}
            className={classes.caption}
            variant={"caption"}>Drag and Drop to Upload</Typography>
      </Box>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root    : {
        width        : "100%",
        height       : "100%",
        maxWidth     : 175,
        maxHeight    : 250,
        display      : "flex",
        flexDirection: "column",
      },
      portrait: {
        minWidth : 175,
        maxWidth: 225,
        minHeight: 175,
        maxHeight: 225,
        objectFit: "contain",
      },
      placeHolder: {
        width    : 200,
        height   : 200,
        objectFit: "contain",
        opacity: 0.3,
      },
      caption : {
        color: theme.palette.grey['400'],
      },
    }));

export default DragAndDropPortrait;
