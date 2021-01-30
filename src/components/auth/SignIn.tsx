import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirebase, isEmpty } from 'react-redux-firebase';
import { makeStyles } from '@material-ui/core/styles';
import { RootState } from '../../store';
import GoogleButton from 'react-google-button';
import { Container, TextField } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

// import GoogleButton from 'react-google-button' // optional

function SignIn() {
  const classes = useStyles();
  const firebase = useFirebase();
  const auth = useSelector((state: RootState) => state.firebase.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function loginWithEmailAndPassword() {
    return firebase.login({
      email,
      password,
    });
  }

  function loginWithGoogle() {
    return firebase.login({
      provider: 'google',
      type: 'popup',
    });
  }

  return (
      <Container>
        <div>
          <h2>Auth</h2>
          {isEmpty(auth)
           ? <Grid container spacing={2} direction={"column"}>
             <Grid item>
               <TextField label={"email"}
                          value={email}
                          type={"email"}
                          onChange={(e) => setEmail(e.target.value)} /></Grid>
             <Grid item>
               <TextField label={"password"}
                          value={password}
                          type={"password"}
                          onChange={(e) => setPassword(e.target.value)} /></Grid>
             <Grid item><Button onClick={loginWithEmailAndPassword}>Sign
                                                                    in</Button></Grid>
             <Grid item><GoogleButton onClick={loginWithGoogle} /></Grid>
           </Grid>
           : <Redirect to={"/home"} />}
        </div>
      </Container>);
}

const useStyles = makeStyles(theme => (
    {}));

export default SignIn;
