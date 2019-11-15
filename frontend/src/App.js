import React from 'react';
import './App.css';
import { Button } from 'semantic-ui-react';

import MenuPage from './Components/MenuPage';
import ItemPopUp from './Components/ItemPopUp';
import OrderPage from './Components/OrderPage';
import ClientHeader from './Components/ClientHeader';
import Test from './Components/Test';

class App extends React.Component {

  render() {
    return (
      <React.Fragment>
        <ClientHeader />
      </React.Fragment>
    );
  }
}

export default App;
