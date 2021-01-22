import React from 'react';
import SkillsList from './components/SkillsList';
import SkillsSection from './components/SkillsSection';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SkillsSection parent={"library"}/>
      </header>
    </div>
  );
}

export default App;
