import React from 'react';
import './App.css';

import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import LandingPage from './Components/LandingPage'
import AboutTeam from './Components/AboutTeam'
import LocationPage from './Components/LocationPage'

import ClientHeader from './Components/ClientHeader';
import ClientHistory from './Components/ClientHistory';

import BaristaLogin from './Components/BaristaLogin';
import BaristaOrders from './Components/BaristaOrders';
import BaristaHistory from './Components/BaristaHistory';
import BaristaInventory from './Components/BaristaInventory';

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
            <Route path="/baristaorders" component={BaristaOrders} />
            <Route path="/baristahistory" component={BaristaHistory} />
            <Route path="/baristainventory" component={BaristaInventory} />
            <Route path="/team" component={AboutTeam} />
            <Route path="/location" component={LocationPage} />
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;
