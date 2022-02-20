import { TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React, {
  ChangeEvent,
  FunctionComponent,
  useState,
} from 'react';
import { makeStyles} from "@material-ui/core/styles";
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import { useTypedSelector } from '../../../store';
import { Profile } from '../../../store/Schema';
import { useAuth } from '../../../store/selectors';

interface IProfileSectionProps {}

const ProfileSection: FunctionComponent<IProfileSectionProps> = (props: IProfileSectionProps) => {
  const {} = props;
  useStyles();
    const auth = useAuth();
  const firebase = useFirebase();
  useFirebaseConnect([`/profiles/${auth.uid}`]);
  const profile: Partial<Profile> = useTypedSelector(state => state.firebase?.data?.profiles?.[auth.uid]) ?? {};

  const {
    name = "",
    email = "",
  } = profile;

  const [values, setValues] = useState<{name:string, email:string}>({name, email})


  function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setValues({...values, [e.target.id]: e.target.value});
    firebase.ref(`/profiles/${auth.uid}`).child(e.target.id).set(e.target.value);
  }


  return (
      <Grid
          container
          spacing={2}>
        <Grid
            item
            xs={12}>
          <TextField
              label={"email"}
              id={"email"}
              onChange={handleChange}
              value={values.email}
              fullWidth />
        </Grid>
        <Grid
            item
            xs={12}>
          <TextField
              label={"Display Name"}
              id={"name"}
              onChange={handleChange}
              value={values.name}
              fullWidth />
        </Grid>
      </Grid>);
};

const useStyles = makeStyles(() => (
    {
      ProfileSection: {},
    }));

export default ProfileSection;
