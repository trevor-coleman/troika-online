import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirebase, isEmpty } from 'react-redux-firebase';
import { makeStyles } from '@material-ui/core/styles';
import { RootState } from '../../store';
import GoogleButton from 'react-google-button';
import { Container, TextField, Paper, Box } from '@material-ui/core';
import { Redirect, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
        <div>
          <Typography paragraph variant={"h2"}>Sign In</Typography>
          <Typography paragraph>Need an account? <Link to={"/register"}>Register Here</Link></Typography>
          {isEmpty(auth)
           ? <Paper><Box p={2}><Grid container
                   spacing={2}
                   direction={"column"}>
             <Grid item
                   xs={12}
                   sm={6}
                   md={4}
                   lg={2}>
               <TextField variant={"outlined"}
                          fullWidth
                          className={classes.input}
                          label={"email"}
                          value={email}
                          type={"email"}
                          onChange={(e) => setEmail(e.target.value)} /></Grid>
             <Grid item
                   xs={12}
                   sm={6}
                   md={4}
                   lg={2}>
               <TextField variant={"outlined"}
                          label={"password"}
                          fullWidth
                          value={password}
                          type={"password"}
                          onChange={(e) => setPassword(e.target.value)} /></Grid>
             <Grid item
                   xs={12}
                   sm={6}
                   md={4}
                   lg={2}><Button onClick={loginWithEmailAndPassword} fullWidth color={"primary"} variant={"contained"}>Sign
                                                                      in</Button></Grid>
             <Grid item
                   xs={12}
                   sm={6}
                   md={4}
                   lg={2}><GoogleButton onClick={loginWithGoogle} /></Grid>
              </Grid></Box></Paper>
           : <Redirect to={"/home"} />}
        </div>
      );
}

const useStyles = makeStyles(theme => (
    {
      input: {
        background: theme.palette.background.paper,
      }
    }));

export default SignIn;
