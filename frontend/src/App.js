import React from 'react';
import './App.css';
import { Button } from 'semantic-ui-react';

import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import MenuPage from './Components/MenuPage';
import ItemPopUp from './Components/ItemPopUp';
import OrderPage from './Components/OrderPage';
import ClientHeader2 from './Components/ClientHeader2';
import Test from './Components/Test';
import LandingPage from './Components/LandingPage'
import AboutTeam from './Components/AboutTeam'

import ClientHeader from './Components/ClientHeader';
import BaristaHeader from './Components/BaristaHeader';
import BaristaLogin from './Components/BaristaLogin';
import ClientHistory from './Components/ClientHistory';

class App extends React.Component {

  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/landing" />} />
            <Route path="/landing" component={LandingPage} />
            <Route path="/menu" component={ClientHeader} />
            <Route path="/profile" component={ClientHistory} />
            <Route path="/baristalogin" component={BaristaLogin} />
            <Route path="/barista" component={BaristaHeader} />
            <Route path="/team" component={AboutTeam} />
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;
