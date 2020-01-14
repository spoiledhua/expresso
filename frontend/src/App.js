import React from 'react';
import './App.css';

import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import LandingPage from './Components/LandingPage';
import AboutTeam from './Components/AboutTeam';
import LocationPage from './Components/LocationPage';

import MenuPage from './Components/MenuPage';
import OrderPage from './Components/OrderPage';
import ContactUs from './Components/ContactUs';
import FAQ from './Components/FAQ';
import ClientHistory from './Components/ClientHistory';

import BaristaLogin from './Components/BaristaLogin';
import BaristaOrders from './Components/BaristaOrders';
import BaristaHistory from './Components/BaristaHistory';
import BaristaInventory from './Components/BaristaInventory';

import NotFound from './Components/NotFound';

class App extends React.Component {

  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/landing" />} />
            <Route path="/landing" component={LandingPage} />
            <Route path="/team" component={AboutTeam} />
            <Route path="/location" component={LocationPage} />
            <Route path="/menu" component={MenuPage} />
            <Route path="/order" component={OrderPage} />
            <Route path="/FAQ" component={FAQ} />
            <Route path="/contact" component={ContactUs} />
            <Route path="/history" component={ClientHistory} />
            <Route path="/profile" component={ClientHistory} />
            <Route path="/baristalogin" component={BaristaLogin} />
            <Route path="/baristaorders" component={BaristaOrders} />
            <Route path="/baristahistory" component={BaristaHistory} />
            <Route path="/baristainventory" component={BaristaInventory} />
            <Route path="*" component={NotFound} />
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;
