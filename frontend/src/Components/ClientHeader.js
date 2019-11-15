import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid } from 'semantic-ui-react';

import MenuPage from './MenuPage';
import OrderPage from './OrderPage';
import ItemPopUp from './ItemPopUp';

import * as logo from '../Assets/logo.png';
import { getLastOrder } from '../Axios/axios_getter';

class ClientHeader extends React.Component {

  state = {
    selectedPage: 'MenuPage',
    orderNumber: null
  }

  handleMenuItemClick = (e) => {
    // redirect to Menu Page
    this.setState({ selectedPage: 'MenuPage' });
    this.setState({ orderNumber: null });
  }

  handleOrderItemClick = (e) => {
    // redirect to Order page
    this.setState({ selectedPage: 'OrderPage' });
    getLastOrder().then(orderid => {
      const display = 'Order ID: ' + orderid + ' Net ID: Victor Hua Cost: 3.5';
      this.setState({ orderNumber: <Header>{display}</Header> });
      });
  }

  handleLogoItemClick = (e) => {
    // redirect to company website
    this.setState({ selectedItem: 'Logo' });
  }

  handleUserItemClick = (e) => {
    // redirect to User page
    this.setState({ selectedItem: 'User' });
  }

  render() {

    const { selectedItem } = this.state

    var appPages = {
      'MenuPage': <MenuPage />,
      'OrderPage': <OrderPage />,
      'ItemPopUp': <ItemPopUp />,
      'User': <div>User</div>
    };

    return (

      <React.Fragment>
        {/* Top Menu */}
        <Menu inverted fixed="top" fluid widths={7} secondary style={{ height: '10vh', background: '#F98F69' }}>
          <Menu.Item style={{ cursor: 'pointer' }} onClick={this.handleMenuItemClick}>
            <Header as='h3' style={{ cursor: 'pointer' }}>
              <Icon name='th list'/>
              MENU
            </Header>
          </Menu.Item>
          <Menu.Item style={{ cursor: 'pointer' }} onClick={this.handleOrderItemClick}>
            <Header as='h3'>
              <Icon name='shopping bag'/>
              MY ORDER
            </Header>
          </Menu.Item>
          <Menu.Item>
          </Menu.Item>
          <Menu.Item>
            <Image src={logo} size='mini' style={{ cursor: 'pointer' }} onClick={this.handleLogoItemClick}/>
          </Menu.Item>
          <Menu.Item>
          </Menu.Item>
          <Menu.Item>
          </Menu.Item>
          <Menu.Item style={{ cursor: 'pointer' }} onClick={this.handleUserItemClick}>
            <Header as='h3'>
              <Icon name='user'/>
              VICTOR HUA
            </Header>
          </Menu.Item>
        </Menu>
        <div style={{ height: '15vh' }} />
        {appPages[this.state.selectedPage]}
      </React.Fragment>
    );
  }
}

export default ClientHeader;
