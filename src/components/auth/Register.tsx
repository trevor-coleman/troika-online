import React, { FunctionComponent, ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { TextField, Box, Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import GoogleButton from 'react-google-button';
import { useFirebase, isEmpty } from 'react-redux-firebase';
import Typography from '@material-ui/core/Typography';
import { Redirect, Link } from 'react-router-dom';
import { useAuth } from '../../store/selectors';

interface RegisterProps {
}

//COMPONENT
const Register: FunctionComponent<RegisterProps> = (props: RegisterProps) => {
  const {} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const auth = useAuth();
  const [values, setValues] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): any {
    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });
  }

  function createUserWithEmailAndPassword() {
    firebase.createUser({
      email: values.email,
      password:values.password
    })
  }

  function loginWithGoogle() {
    return firebase.login({
      provider: 'google',
      type: 'popup',
    });
  }

  function emailIsValid(email:string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isError = {
    email: values.email.length > 0 && !emailIsValid(values.email),
    password: values.password.length > 0 && values.password.length < 6,
    displayName: values.displayName.length > 0 && values.displayName.length < 3,
    confirmPassword: values.confirmPassword.length > 0 && values.confirmPassword.length <= 6 && values.confirmPassword !== values.password
  }

  return (
      <div className={classes.root}>
        <Typography paragraph variant={"h2"}>Register</Typography>
        <Typography paragraph>Already have an account? <Link to={"/register"}>Sign In
                                                                      Here</Link></Typography>
        {isEmpty(auth)?
        <Paper>
          <Box p={2}>
        <Grid container
              spacing={2}
              direction={"column"}>
          <Grid item
                xs={12}
                sm={6}
                md={4}
                lg={2}>
            <TextField  label={"Display Name"}
                        variant={"outlined"}
                        fullWidth
                        error={isError.displayName}
                       value={values.displayName}
                       id={"displayName"}
                       type={"name"}
                       onChange={handleChange} /></Grid>
          <Grid item
                xs={12}
                sm={6}
                md={4}
                lg={2}>
            <TextField label={"Email"}
                       variant={"outlined"}
                       fullWidth
                       error={isError.email}
                       value={values.email}
                       id={"email"}
                       type={"email"}
                       onChange={handleChange} /></Grid>
          <Grid item
                xs={12}
                sm={6}
                md={4}
                lg={2}>
            <TextField label={"Password"}
                       variant={"outlined"}
                       fullWidth
                       id={"password"}
                       error={isError.password}
                       value={values.password}
                       type={"password"}
                       onChange={handleChange} />
          </Grid>
          <Grid item
                xs={12}
                sm={6}
                md={4}
                lg={2}>
            <TextField label={"Confirm Password"}
                       variant={"outlined"}
                       fullWidth
                       id={"confirmPassword"}
                       error={isError.confirmPassword}
                       value={values.confirmPassword}
                       type={"password"}
                       onChange={handleChange} />
          </Grid>
          <Grid item
                xs={12}
                sm={6}
                md={4}
                lg={2}><Button fullWidth variant={"contained"} color={"primary"} onClick={createUserWithEmailAndPassword}>Create Account</Button></Grid>
          <Grid item
                xs={12}
                sm={6}
                md={4}
                lg={2}><GoogleButton onClick={loginWithGoogle} /></Grid>
        </Grid></Box></Paper>: <Redirect to={"/home"} />}</div>
      )

}

  const useStyles = makeStyles((theme: Theme) => (
      {
        root: {},
      }));

  export default Register;
