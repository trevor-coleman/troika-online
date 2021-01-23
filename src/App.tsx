import React from 'react';
import SkillsSection from './components/Skills/SkillsSection';
import ItemsSection from './components/Items/ItemsSection';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';

function App() {
  return (
    <div className="App">
      <Container>
        <Grid container spacing={2}>
        <Grid item>
        <ItemsSection parent={"library"} />
        </Grid>
        <Grid item>
          <SkillsSection parent={"library"}/>
        </Grid>
      </Grid>
      </Container>
    </div>
  );
}

export default App;
