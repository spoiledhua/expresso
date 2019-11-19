import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid, Dimmer, Loader } from 'semantic-ui-react';

import MenuPage from './MenuPage';
import OrderPage from './OrderPage';
import ItemPopUp from './ItemPopUp';

import * as logo from '../Assets/logo.png';
import { getLastOrder } from '../Axios/axios_getter';

class ClientHeader extends React.Component {

  state = {
    selectedPage: 'MenuPage',
    shoppingCart: [],
    id: 0,
    loading: false
  }

  handleMenuItemClick = (e) => {
    // redirect to Menu Page
    this.setState({ loading: true })
    this.setState({ selectedPage: 'MenuPage' });
    this.setState({ loading: false })
  }

  handleOrderItemClick = (e) => {
    // redirect to Order page
    this.setState({ loading: true })
    this.setState({ selectedPage: 'OrderPage' });
    this.setState({ loading: false })
  }

  handleUserItemClick = (e) => {
    // redirect to User page
    this.setState({ loading: true })
    this.setState({ selectedItem: 'User' });
    this.setState({ loading: false })
  }

  handleItemSubmit = async (item) => {
    this.setState({ loading: true });
    item.id = this.state.id;
    await this.setState({ id: this.state.id + 1 });
    await this.setState(prevState => {
      let shoppingCart = prevState.shoppingCart;
      shoppingCart.push(item);
      return { shoppingCart }
    });
    this.setState({ loading: false });
  }

  handleRemoveItem = async (id) => {
    this.setState({ loading: true });
    await this.setState(prevState => {
      let shoppingCart = prevState.shoppingCart;
      shoppingCart = shoppingCart.filter(item => item.id != id);
      return { shoppingCart }
    });
    this.setState({ loading: false });
  }

  emptyCart = () => {
    this.setState({ shoppingCart: [] });
  }

  render() {

    const { selectedItem } = this.state

    var appPages = {
      'MenuPage': <MenuPage handleItemSubmit={this.handleItemSubmit}/>,
      'OrderPage': <OrderPage shoppingCart={this.state.shoppingCart} handleRemoveItem={this.handleRemoveItem} emptyCart={this.emptyCart}/>,
      'User': <div>User</div>
    };

    return (

      <React.Fragment>
        <Dimmer active={this.state.loading} page inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        {/* Top Menu */}
        <Menu inverted fixed="top" fluid widths={7} secondary style={{ height: '10vh', background: '#F98F69' }}>
          <Menu.Item style={{ cursor: 'pointer' }} onClick={this.handleMenuItemClick}>
            <Header as='h3' style={{ cursor: 'pointer' }}>
              <Icon name='home'/>
              MENU
            </Header>
          </Menu.Item>
          <Menu.Item style={{ cursor: 'pointer' }} onClick={this.handleOrderItemClick}>
            <Header as='h3'>
              <Icon name='unordered list'/>
              MY ORDER
            </Header>
          </Menu.Item>
          <Menu.Item />
          <Menu.Item>
            <Image src={logo} href="https://pucoffeeclub.com" size='tiny' style={{ cursor: 'pointer' }} />
          </Menu.Item>
          <Menu.Item />
          <Menu.Item />
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
