import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, {
  FunctionComponent, PropsWithChildren, useEffect,
} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { useFirebase, useFirebaseConnect } from 'react-redux-firebase';
import PasswordSection from '../components/settings/sections/PasswordSection';
import ProfileSection from '../components/settings/sections/ProfileSection';
import SettingsSection from '../components/settings/SettingsSection';
import { useAuth } from '../store/selectors';
import { useTypedSelector } from '../store';
import { Profile } from '../store/Schema';
import 'firebase/auth';

interface ISettingsProps {}

type SettingsProps = PropsWithChildren<ISettingsProps>

//COMPONENT
const Settings: FunctionComponent<SettingsProps> = () => {
  useStyles();
    useFirebase();
    const auth = useAuth();
  const provider = auth?.providerData?.[0]?.providerId;

  useFirebaseConnect(`/profiles/${auth.uid}/name`);
  const name = useTypedSelector(state => state.firebase.data?.profiles?.[auth.uid]?.name) ?? "Anonymous User"

  useEffect(() => {
    document.title = "Settings - Troika Online";
  }, []);

  return (
      <Grid
            container
            spacing={0}>
        <Grid item>
          <Typography variant={'h1'}>Settings</Typography>
          <Typography variant={'h2'}>{name}</Typography>
        </Grid>
          <Grid
              item
              xs={9}>
            <SettingsSection title={"Profile"}>
              <ProfileSection/>
            </SettingsSection>
            {provider === "password" ? <SettingsSection title={"Password"}>
              <PasswordSection/>
            </SettingsSection>
             :""}
          </Grid>
        </Grid>
      );
};

const useStyles = makeStyles(() => (
    {
      root: {},
    }));

export default Settings;
