import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import fb from 'firebase';
import React, { FunctionComponent, useState } from 'react';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useFirebaseConnect } from 'react-redux-firebase';
import { useAuth } from '../../../store/selectors';

interface IPasswordSectionProps {}

const initialPasswordState= {
  "new-pw"    : "",
  "confirm-pw": "",
  "current-pw": "",
}

const PasswordSection: FunctionComponent<IPasswordSectionProps> = (props: IPasswordSectionProps) => {
  const {} = props;
  const classes = useStyles();
  const auth = useAuth();
  const [passwordState, setPasswordState] = useState<{ [key:string]: string }>(
      initialPasswordState);

  useFirebaseConnect([`/profiles/${auth.uid}`]);


  const provider = fb.auth().currentUser?.providerData[0]?.providerId;
  const user = fb.auth().currentUser;

  const statusMessages = {
    'unmatched': 'Passwords do not match.',
    'wrong-pw': 'Incorrect password.',
    'too-short': 'Password must be at least 6 characters.',
    'success': 'Password updated.'
  }

  let otherMessage = '';

  type PasswordChangeStatus = 'unmatched' | 'wrong-pw' | 'too-short' | 'success' | 'other';

  const [status, setStatus] = useState<PasswordChangeStatus | null>(null);

  const handlePassword = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const {id, value} = e.target
    const newState = {...passwordState}
    newState[id] = value;
    if (newState['new-pw'].length > 0 && newState['new-pw'].length < 6) {
      setStatus('too-short')
    }
    else if (newState['new-pw'].length > 0 && newState['confirm-pw'].length > 0 && newState['new-pw'] !== newState['confirm-pw']) {
      setStatus('unmatched')
    }  else {
      setStatus(null)
    }

    setPasswordState(newState);
  };

  const reauthAndUpdatePassword = async () => {

    let credential;
    if (provider === 'password') {
      credential =
          fb.auth.EmailAuthProvider.credential(auth.email ?? "",
              passwordState['current-pw']);

      user?.reauthenticateWithCredential(credential)
          .then(() => {
            user?.updatePassword(passwordState['new-pw'])
                .then(() => {
                  setStatus("success");
                  setPasswordState(initialPasswordState)
                })
                .catch(e => {
                  if(e.code ==="auth/wrong-password") {
                    setStatus('wrong-pw')
                  } else {

                    setStatus('other')
                    otherMessage = e.message;
                  }
                })
          })
          .catch(e => {
            if (e.code === "auth/wrong-password") {
              setStatus('wrong-pw')
            }
            else {

              setStatus('other')
              otherMessage = e.message;
            }
          });
    }
  };

  const preventSave = status === 'unmatched'
                      || status === 'too-short'
                      || status === 'wrong-pw'
                      || passwordState['new-pw'] === ''
                      || passwordState['confirm-pw'] === ''
                      || passwordState['current-pw'] === ''

  return (
      <Grid
          container
          spacing={2}>
        <Grid
            item
            xs={12}>
          <TextField
              label={"New Password"}
              value={passwordState['new-pw']}
              type="password"
              error={status === 'unmatched' || status === 'too-short'}
              autoComplete="new-password"
              onChange={(e)=>handlePassword(e)}
              id={"new-pw"}
              fullWidth />
        </Grid>
        <Grid
            item
            xs={12}>
          <TextField
              label={"Confirm New Password"}
              type="password"
              error={status === 'unmatched'}
              autoComplete="new-password"
              onChange={handlePassword}
              value={passwordState['confirm-pw']}
              id={'confirm-pw'}
              fullWidth />
        </Grid>
        <Grid
            item
            xs={12}>
          <TextField
              label={"Current Password"}
              value={passwordState['current-pw']}
              error={status==="wrong-pw"}
              type="password"
              onChange={handlePassword}
              id={'current-pw'}
              autoComplete="current-password"
              fullWidth />
        </Grid>
        <Grid item xs={12} container>
        <Grid
            item
            xs={8}>
          {status
           ? <Typography className={status === "success"
                                    ? classes.successMessage
                                    : classes.errorMessage}>
             {status === "other" ? otherMessage : statusMessages[status]}
             </Typography>
           : ""
          }
        </Grid>
        <Grid
            item
            container
            xs={4}
            justify={'flex-end'}><Button
            disabled={preventSave}
            variant={'contained'}
            color={'secondary'}
            onClick={reauthAndUpdatePassword}>Save
                                              Changes</Button></Grid>
        </Grid>
      </Grid>

  );
};

const useStyles = makeStyles((theme: Theme) => (
    {
      PasswordSection: {},
      errorMessage: {
        color: theme.palette.error.main
      },
      successMessage: {
        color: theme.palette.success.main
      }
    }));

export default PasswordSection;
