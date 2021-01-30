import React, { PropsWithChildren } from 'react';
import { Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { isLoaded, useFirebase } from 'react-redux-firebase';
import { RootState } from './store';
import SignIn from './components/auth/SignIn';
import PrivateRoute from './components/auth/PrivateRoute';
import Home from './views/Home';
import RollView from './views/RollView';
import { Route, Switch } from 'react-router-dom';

import firebase from 'firebase/app';
import 'firebase/auth';
import Game from './views/Game';
import Layout from './layouts/Layout';
import CharacterEditor from './views/CharacterEditor';

function AuthIsLoaded({children}:PropsWithChildren<any>) {
  const auth = useSelector((state:RootState) => state.firebase.auth)
  if (!isLoaded(auth)) return <div>splash screen...</div>;
  return children
}

function App(props:any) {
  const auth = useSelector((state:RootState) => state.firebase.auth)
  const firebase = useFirebase();

  return (<div className="App">
      <Container>
        <AuthIsLoaded>
          <Layout>
          <Switch>
            <PrivateRoute path={"/home"}><Home/></PrivateRoute>
            <PrivateRoute path={"/roll"}><RollView /></PrivateRoute>
            <PrivateRoute path={"/game/:gameKey"}><Game /></PrivateRoute>
            <PrivateRoute path={"/character/:characterKey/edit"}><CharacterEditor /></PrivateRoute>
            <PrivateRoute path={"/character/:characterKey/new"}><CharacterEditor init /></PrivateRoute>
          <Route path={"/sign-in"}><SignIn/></Route>
          </Switch>
          </Layout>
        </AuthIsLoaded>
      </Container>
    </div>
  );
}

export default App;
