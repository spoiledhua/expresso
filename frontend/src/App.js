import React from 'react';
import './App.css';
import { Button } from 'semantic-ui-react';

import ClientComponent from './Components/ClientComponent';
import Test from './Components/Test';

class App extends React.Component {

  render() {
    return (
      <React.Fragment>
        <ClientComponent/>
      </React.Fragment>
    );
  }
}

export default App;
