import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid, Dimmer, Loader, Responsive, Dropdown } from 'semantic-ui-react';

import MenuPage from './MenuPage';
import OrderPage from './OrderPage';
import ItemPopUp from './ItemPopUp';
import ClientHistory from './ClientHistory';

import * as logo from '../Assets/logo.png';
import { postMakeOrder } from '../Axios/axios_getter';
import { getUser, authenticate } from '../Axios/axios_getter';

class ClientHeader extends React.Component {

  state = {
    selectedPage: 'MenuPage',
    shoppingCart: [],
    id: 0,
    loading: false,
    user: null
  }

  componentDidMount = async () => {
    getUser()
      .then(user => {
        if (user.user == null) {
          authenticate()
            .then(data => {
              window.location.href = data.url;
            });
        }
        else {
          this.setState({ user: user.user });
        }
      });
  }

  getPrice = () => {
    let { shoppingCart } = this.state;
    let price = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
      price += Number(shoppingCart[i].sp[1]);
      for (let j = 0; j < shoppingCart[i].addons.length; j++) {
        price += Number(shoppingCart[i].addons[j].price);
      }
    }
    return price;
  }

  handleMenuItemClick = (e) => {
    // redirect to Menu Page
    this.setState({ loading: true })
    this.setState({ selectedPage: 'MenuPage' });
    this.setState({ loading: false })
  }

  handleOrderItemClick = (e) => {
    // redirect to Order page
    this.setState({ loading: true });
    this.setState({ selectedPage: 'OrderPage' });
    this.setState({ loading: false });
  }

  handleUserItemClick = (e) => {
    // redirect to User page
    this.setState({ loading: true });
    this.setState({ selectedPage: 'User' });
    this.setState({ loading: false });
  }

  handleLogoClick = () => {
    this.props.history.push('/landing');
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

  postOrder = async (payment) => {

    const { shoppingCart } = this.state;

    this.setState({ loading: true });

    let itemNames = [];
    const update = {
      netid: this.state.user,
      cost: this.getPrice(),
      payment: payment,
      status: false,
      items: shoppingCart
    };
    postMakeOrder(update);
    this.setState({ loading: false });
  }

  render() {

    const { selectedItem } = this.state

    var appPages = {
      'MenuPage': <MenuPage handleItemSubmit={this.handleItemSubmit}/>,
      'OrderPage': <OrderPage shoppingCart={this.state.shoppingCart} handleRemoveItem={this.handleRemoveItem} emptyCart={this.emptyCart} postOrder={this.postOrder}/>,
      'User': <ClientHistory netid={this.state.user}/>
    };

    return (

      <React.Fragment>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Dimmer active={this.state.loading} page inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
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
                MY CART
              </Header>
            </Menu.Item>
            <Menu.Item />
            <Menu.Item>
              <Image src={logo} onClick={this.handleLogoClick} size='mini' style={{ cursor: 'pointer' }} />
            </Menu.Item>
            <Menu.Item />
            <Menu.Item />
            <Menu.Item style={{ cursor: 'pointer' }} onClick={this.handleUserItemClick}>
              <Header as='h3'>
                <Icon name='user'/>
                {this.state.user}
              </Header>
            </Menu.Item>
          </Menu>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <Menu inverted fixed="top" fluid widths='7' secondary style={{ height: '10vh', background: '#F98F69' }}>
            <Menu.Item position='left'>
              <Image src={logo} size='mini' style={{ cursor: 'pointer' }} onClick={this.handleLogoItemClick}/>
            </Menu.Item>
            <Menu.Item position='right'>
              {/* Dropdown menu */}
              <Dropdown icon='sidebar' style={{color:'black'}}>
                <Dropdown.Menu direction='left' style={{background: '#F98F69' }}>
                  <Dropdown.Item style={{ cursor: 'pointer' }} onClick={this.handleMenuItemClick}>
                    <Header>
                      <Icon name='th list'/>
                      MENU
                    </Header>
                  </Dropdown.Item>
                  <Dropdown.Item style={{ cursor: 'pointer' }} onClick={this.handleOrderItemClick}>
                    <Header as='h3'>
                      <Icon name='shopping bag'/>
                      MY CART
                    </Header>
                  </Dropdown.Item>
                  <Dropdown.Item style={{ cursor: 'pointer' }} onClick={this.handleUserItemClick}>
                    <Header as='h3'>
                      <Icon name='user'/>
                      {this.state.user}
                    </Header>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Menu>
        </Responsive>
        <div style={{ height: '15vh' }} />
        {appPages[this.state.selectedPage]}
      </React.Fragment>
    );
  }
}

export default ClientHeader;