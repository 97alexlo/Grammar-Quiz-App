import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Level1 from "./views/Level1";
import {HashRouter as Router} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Level1}/>
      </Switch>
    </Router>
  );
}

export default App;
