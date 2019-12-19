import React from 'react';
import {Grid, Segment, Label, Sidebar, Menu, Icon, Image, Container, Header, Dimmer, Divider, Loader, Responsive, Dropdown, Card, Button } from 'semantic-ui-react';

import MenuPage from './MenuPage';
import OrderPage from './OrderPage';
import FAQPage from './FAQ';
import ContactUs from './ContactUs';
import ClientHistory from './ClientHistory';

import * as logo from '../Assets/logo.png';
import { postMakeOrder } from '../Axios/axios_getter';
import { getUser, authenticate, clientLogout } from '../Axios/axios_getter';

class MobileMenu extends React.Component {

  state = {
    selectedPage: 'MobileMenu',
    shoppingCart: [],
    id: 0,
    loading: false,
    user: null,
    userLogoutConfirm: false,
    availabilityConfirm: false
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

  handleMenuItemClick = async () => {
    // redirect to Menu Page
    await this.setState({ loading: true });
    await setTimeout(() => { this.setState({ selectedPage: 'MenuPage' }) }, 10);
    await this.setState({ loading: false });
  }

  handleOrderItemClick = async () => {
    // redirect to Order page
    await this.setState({ loading: true });
    await setTimeout(() => { this.setState({ selectedPage: 'OrderPage' }) }, 1000);
    await this.setState({ loading: false });
  }

  handleUserItemClick = async () => {
    // redirect to User page
    await this.setState({ loading: true });
    await setTimeout(() => { this.setState({ selectedPage: 'User' }) }, 1000);
    await this.setState({ loading: false });
  }

  handleFAQClick = async () => {
    // redirect to FAQ page
    await this.setState({ loading: true });
    await setTimeout(() => { this.setState({ selectedPage: 'FAQPage' }) }, 1000);
    await this.setState({ loading: false });
  }

  handleContactClick = async () => {
    // redirect to FAQ page
    await this.setState({ loading: true });
    await setTimeout(() => { this.setState({ selectedPage: 'ContactUs' }) }, 1000);
    await this.setState({ loading: false });
  }

  handleLogoClick = () => {
    this.props.history.push('/landing');
  }

  handleItemSubmit = async (item) => {
    await this.setState({ loading: true });
    item.id = this.state.id;
    await this.setState({ id: this.state.id + 1 });
    await this.setState(prevState => {
      let shoppingCart = prevState.shoppingCart;
      shoppingCart.push(item);
      return { shoppingCart }
    });
    await this.setState({ loading: false });
  }

  handleFeedback = (e) => {
    window.open('https://forms.gle/6rxsKdj2gh3yPbXV8');
  }

  handleRemoveItem = async (id) => {
    await this.setState({ loading: true });
    await this.setState(prevState => {
      let shoppingCart = prevState.shoppingCart;
      shoppingCart = shoppingCart.filter(item => item.id !== id);
      return { shoppingCart }
    });
    await this.setState({ loading: false });
  }

  emptyCart = () => {
    this.setState({ shoppingCart: [] });
  }

  postOrder = async (payment) => {

    const { shoppingCart } = this.state;

    await this.setState({ loading: true });

    let items = [];
    for (let i = 0; i < shoppingCart.length; i++) {
      const item = shoppingCart[i];
      let addons = []
      for (let j = 0; j < item.addons.length; j++) {
        const addon = { name: item.addons[j].name };
        addons.push(addon);
      }
      const update = {
        item: { name: item.item.name },
        addons: addons,
        sp: item.sp[0]
      }
      items.push(update);
    }

    const finalUpdate = {
      netid: this.state.user,
      cost: this.getPrice(),
      payment: payment,
      status: payment,
      items: items
    };
    postMakeOrder(this.state.user, finalUpdate)
      .then(data => {
        if (!data.availability) {
          this.setState({ availabilityConfirm: true });
        }
      });
    await this.setState({ loading: false });
  }

  handleUserLogout = () => {
    this.setState({ userLogoutConfirm: true });
  }

  handleUserLogoutCancel = () => {
    this.setState({ userLogoutConfirm: false });
  }

  handleUserLogoutConfirm = () => {
    clientLogout()
      .then(data => {
        window.location.href = data.url
      });
  }

  handleAvailabilityCancel = () => {
    this.setState({ availabilityConfirm: false });
    this.setState({ selectedPage: 'MenuPage' });
  }

  redirect = () => {
    this.setState({ selectedPage: 'MenuPage' });
  }


  render() {

    var appPages = {
      'MenuPage': <MenuPage handleItemSubmit={this.handleItemSubmit}/>,
      'OrderPage': <OrderPage shoppingCart={this.state.shoppingCart} handleRemoveItem={this.handleRemoveItem} emptyCart={this.emptyCart} postOrder={this.postOrder} redirect={this.redirect}/>,
      'User': <ClientHistory netid={this.state.user}/>,
      'FAQPage': <FAQPage/>,
      'ContactUs': <ContactUs/>
    };

    return (

      <React.Fragment>
        <Responsive {...Responsive.onlyMobile}>
          <Menu
            fluid
            vertical
            inverted
            borderless
            style={{background: '#E2DBCF', marginTop:'-18%'}}
          >
            <Menu.Item>
              <Icon name='x' size='large' style={{cursor:'pointer', color:'black'}} onClick={this.handleMenuItemClick}/>
            </Menu.Item>
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item onClick={this.handleLogoClick}>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>01.&nbsp;&nbsp;&nbsp;&nbsp;Home</span>
              </Header>
            </Menu.Item>
            <Menu.Item onClick={this.handleMenuItemClick}>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>02.&nbsp;&nbsp;&nbsp;&nbsp;Menu</span>
              </Header>
            </Menu.Item>
            <Menu.Item onClick={this.handleUserItemClick}>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>03.&nbsp;&nbsp;&nbsp;&nbsp;Orders</span>
              </Header>
            </Menu.Item>
            <Menu.Item>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>04.&nbsp;&nbsp;&nbsp;&nbsp;FAQ</span>
              </Header>
            </Menu.Item>
            <Menu.Item onClick={this.handleContactClick}>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>05.&nbsp;&nbsp;&nbsp;&nbsp;Contact</span>
              </Header>
            </Menu.Item>
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item style={{backgroundColor:'#85A290'}}/>
            <Menu.Item style={{backgroundColor:'#85A290'}}>
              <Grid column={3}>
                <Grid.Row>
                  <Grid.Column />
                  <Grid.Column>
                      <span style={{paddingLeft:'10%', color:'black'}}> { this.state.user} </span>
                  </Grid.Column>
                  <Grid.Column style={{width:'60%'}}/>
                  <Grid.Column>
                      <span style={{paddingRight:'5%', color:'black'}}> Logout </span>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Menu.Item>
            <Menu.Item style={{backgroundColor:'#85A290'}}/>
          </Menu>
        </Responsive>
      </React.Fragment>
    );
  }
}

export default MobileMenu;
