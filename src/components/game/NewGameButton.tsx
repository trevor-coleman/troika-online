import React, { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useFirebase } from 'react-redux-firebase';
import { useTypedSelector } from '../../store';
import { Redirect } from 'react-router-dom';
import { Game } from '../../store/Schema';


interface NewGameButtonProps {
  onCreate:(newKey: string)=>void;
  onFail?:()=>void;
  navigate?:boolean;
  template?: Partial<Game>;
}

//COMPONENT
const NewGameButton: FunctionComponent<NewGameButtonProps> = (props: NewGameButtonProps) => {
  const {onCreate, template} = props;
  const classes=useStyles();
  const onFail = props.onFail ? props.onFail : ()=>console.log("Failed to created new game.")
  const firebase = useFirebase()
  const auth = useTypedSelector(state => state.firebase.auth);
  const [key, setKey] = useState<string|null>(null);

  const create = async ()=>{


    const newGame = {
      owner: auth.uid,
      name: "New Game",
      ...template
    };

    newGame.sort_name = newGame.name.toLowerCase();


    const gameRef = await firebase.push('/games/',newGame)
    if(gameRef.key) {
      await firebase.ref(`/profiles/${auth.uid}/games/`).update({[gameRef.key]: true})
      onCreate(gameRef.key);
      setKey(gameRef.key);
    }else {
      onFail();
    }

  }


  return (
      <div className={classes.root}>
        <Button variant="contained" color={"primary"} onClick={create}>Create Game</Button>
        {key?<Redirect to={`/game/${key}`}/>:""}</div>);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {paddingTop: theme.spacing(1)},
    }));

export default NewGameButton;
