import React, { FunctionComponent, PropsWithChildren, Props } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  BrowserRouter, Switch, Route, Redirect
} from 'react-router-dom';
import { useSelector } from 'react-redux'
import { isLoaded, isEmpty } from 'react-redux-firebase'
import { RootState } from '../../store';

interface PrivateRouteProps {
  path: string,
  restricted?: boolean,
}

//COMPONENT
const PrivateRoute: FunctionComponent<PropsWithChildren<PrivateRouteProps>> = ({children, restricted, ...rest}: PropsWithChildren<PrivateRouteProps>) => {
  const auth = useSelector((state:RootState) => state.firebase.auth)

  const permitted = !restricted || auth.email === "trevor@trevorcoleman.design";

  return (
      <Route
          {...rest} render={({location}) => isLoaded(auth) && !isEmpty(auth) && permitted
                                            ? (
                                                children)
                                            : (
                                                <Redirect to={{
                                                  pathname: "/sign-in",
                                                  state: {from: location}
                                                }} />)} />);
};

const useStyles = makeStyles((theme: Theme) => (
    {
      root: {},
    }));

export default PrivateRoute;
