import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useFirebase } from 'react-redux-firebase';
import { default as slugify } from 'slugify';
import { useTypedSelector } from '../../store';
import { Redirect } from 'react-router-dom';
import { Game } from '../../store/Schema';

interface NewGameButtonProps {
  onCreate: (newKey: string) => void;
  onFail?: (message: string) => void;
  navigate?: boolean;
  template?: Partial<Game>;
  disabled?: boolean;
}


//COMPONENT
const NewGameButton: FunctionComponent<NewGameButtonProps> = (props: NewGameButtonProps) => {
  const {
    onCreate,
    template,
    onFail = (message?: string) => console.error(`Create game error: ${message ??
                                                                       'Failed to Create Game'}`),
    navigate,
      ...rest
  } = props;
  const classes = useStyles();
  const firebase = useFirebase();
  const auth = useTypedSelector(state => state.firebase.auth);
  const [key, setKey] = useState<string | null>(null);

  const create = async () => {

    const newGame: Partial<Game> & {name:string} = {
      owner: auth.uid,
      players: {[auth.uid]: true},
      ...template,
      name : template?.name ?? "New Game",
    };

    function makeid(length:number) {
      const result = [];
      const characters = 'abcdefghijklmnopqrstuvwxyz';
      for (let i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
                                                 characters.length)));
      }
      return result.join('');
    }

    async function makeUniqueSlug(name: string):Promise<string> {
      const nameSlug = slugify(name).slice(0, 24)
      const slug = `${nameSlug}#${makeid(4)}`
      const snap = await firebase.ref(`/games`)
                                     .orderByChild('slug')
                                     .equalTo(slug)
                                     .get()

      let result = snap.val()
                   ? await makeUniqueSlug(name)
                   : slug

      return result
    }

    newGame.sort_name = newGame.name.toLowerCase();
    newGame.slug =  await makeUniqueSlug(newGame.sort_name.toLowerCase());

    const gameRef = await firebase.push('/games/', newGame);

    if (gameRef.key) {
      await firebase.ref(`/profiles/${auth.uid}/games/`)
                    .update({[gameRef.key]: true});
      onCreate(gameRef.key);
      setKey(gameRef.key);
    }
    else {
      onFail('Failed to fetch game key');
    }

  };

  return (
      <div className={classes.root}>
        <Button
            color={"primary"}
            onClick={create} {...rest}>Create Game</Button>
        {key
         ? <Redirect to={`/game/${key}`} />
         : ""}</div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {}
    }));

export default NewGameButton;
