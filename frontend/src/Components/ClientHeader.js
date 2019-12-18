import React from 'react';
import {Segment, Label, Menu, Icon, Image, Container, Header, Dimmer, Divider, Loader, Responsive, Dropdown, Card, Button } from 'semantic-ui-react';

import MenuPage from './MenuPage';
import OrderPage from './OrderPage';
import FAQPage from './FAQ';
import ContactUs from './ContactUs';
import ClientHistory from './ClientHistory';

import * as logo from '../Assets/logo.png';
import { postMakeOrder } from '../Axios/axios_getter';
import { getUser, authenticate, clientLogout } from '../Axios/axios_getter';

class ClientHeader extends React.Component {

  state = {
    selectedPage: 'MenuPage',
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
    await setTimeout(() => { this.setState({ selectedPage: 'MenuPage' }) }, 1000);
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
        <Dimmer active={this.state.loading} page inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Dimmer active={this.state.userLogoutConfirm} onClickOutside={this.handleUserLogoutCancel} page>
          <Container style={{ width: '720px' }}>
            <Card fluid>
              <Card.Content>
                <Header as='h3' color='grey' style={{fontFamily:'Avenir'}}>Are you sure you want to logout?</Header>
              </Card.Content>
              <Button.Group>
                <Button style={{fontFamily:'Avenir'}}
                  onClick={this.handleUserLogoutCancel}>Cancel</Button>
                <Button style={{fontFamily:'Avenir', color:'white',backgroundColor:'#85A290'}}
                  positive onClick={this.handleUserLogoutConfirm}>Logout</Button>
              </Button.Group>
            </Card>
          </Container>
        </Dimmer>
        <Dimmer active={this.state.availabilityConfirm} onClickOutside={this.handleAvailabilityCancel} page>
          <Container style={{ width: '720px' }}>
            <Card fluid>
              <Card.Content>
                <Header as='h3' color='grey'>Sorry, but one of the items in your cart is out of stock; your order wasn't placed. The menu will be refreshed. Please update your cart accordingly.</Header>
              </Card.Content>
              <Button.Group>
                <Button onClick={this.handleAvailabilityCancel}>Exit</Button>
              </Button.Group>
            </Card>
          </Container>
        </Dimmer>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          {/* Top Menu               /*<Header as='h4' style={{fontFamily:'Avenir', color: 'black'}}>
                          HOME
                        </Header>         fluid widths='12'*/}
          <Menu borderless inverted fixed="top" fluid widths = '12' style={{ height: '7vh', background: '#BEB19B' }}>
            <Menu.Item style={{width:'5%'}}/>
            <Menu.Item style={{cursor: 'pointer', width:'8%'}} onClick={this.handleLogoClick}>
              <Header as='h4' style={{fontFamily:'Avenir', color: 'white'}}>
                HOME
              </Header>
            </Menu.Item>
            <Menu.Item style={{cursor: 'pointer', width:'8%'}} onClick={this.handleMenuItemClick}>
              <Header as='h4' style={{fontFamily:'Avenir', color: 'white'}}>
                MENU
              </Header>
            </Menu.Item>
            <Menu.Item style={{cursor: 'pointer', width:'8%'}} onClick={this.handleFAQClick}>
              <Header as='h4' style={{fontFamily:'Avenir', color: 'white'}}>
                FAQ
              </Header>
            </Menu.Item>
            <Menu.Item style={{cursor: 'pointer', width:'8%'}} onClick={this.handleContactClick}>
              <Header as='h4' style={{fontFamily:'Avenir', color: 'white'}}>
                CONTACT
              </Header>
            </Menu.Item>
            <Menu.Item style={{cursor: 'pointer', width:'26%'}} onClick={this.handleLogoClick}>
              <Header as='h2' style={{fontFamily:'Didot', color: 'white', fontStyle:'italic'}}>
                · the coffee club ·
              </Header>
            </Menu.Item>
            <Menu.Item style={{width:'20%'}} />
            <Menu.Item position='right'>
              <Header as='h4' style={{ textTransform: 'lowercase', fontFamily:'Avenir', color: 'white'}}>
                <Dropdown text floating style={{paddingRight:'1em'}}>
                  <Dropdown.Menu style={{ top:'170%',background: 'white', width:'50em' }}>
                    <Dropdown.Item style={{height:'6vh'}}>
                      <Header as='h4' style={{fontFamily:'Avenir', fontStyle:'italic', marginTop:'1vh'}}>
                      Your Account
                      </Header>
                    </Dropdown.Item>
                    <Divider/>
                    <Dropdown.Item onClick={this.handleUserItemClick}>
                      <Header as='h5' style={{fontFamily:'Avenir', color:'gray'}}>
                        My Profile
                      </Header>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={this.handleUserItemClick}>
                      <Header as='h5' style={{fontFamily:'Avenir', color:'gray'}}>
                        Orders
                      </Header>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={this.handleFeedback}>
                      <Header as='h5' style={{fontFamily:'Avenir', color:'gray'}}>
                        Feedback
                      </Header>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={this.handleUserLogout}>
                      <Header as='h5' style={{fontFamily:'Avenir', color:'gray'}}>
                        Logout
                      </Header>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                   { this.state.user}
              </Header>
            </Menu.Item>
            <Menu.Item position='right' style={{width:'10%', cursor: 'pointer'}} onClick={this.handleOrderItemClick}>
                <Icon name='cart' size = 'large' style={{paddingLeft:'10%', paddingRight:'3%', color: 'white'}}/>
                <Label basic circular size='tiny' horizontal style={{borderColor:'white', background:'#EDAC86',color:'white'}}>
                12
                </Label>
            </Menu.Item>
          </Menu>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <Menu inverted fixed="top" fluid widths='7' secondary style={{ height: '7vh', background: '#EDAC86' }}>
            <Menu.Item position='left'>
              <Image src={logo} size='mini' style={{ cursor: 'pointer' }} onClick={this.handleLogoClick}/>
            </Menu.Item>
            <Menu.Item position='right'>
              {/* Dropdown menu */}
              <Dropdown icon='sidebar' style={{color:'white'}}>
                <Dropdown.Menu direction='left' style={{ background: 'white' }}>
                  <Dropdown.Item style={{ cursor: 'pointer' }} onClick={this.handleMenuItemClick}>
                    <Header>
                      Menu
                    </Header>
                  </Dropdown.Item>
                  <Dropdown.Item style={{ cursor: 'pointer' }} onClick={this.handleOrderItemClick}>
                    <Header as='h3'>
                      My Cart
                    </Header>
                  </Dropdown.Item>
                  <Dropdown.Item style={{ cursor: 'pointer' }} onClick={this.handleUserItemClick}>
                    <Header as='h3'>
                      History
                    </Header>
                  </Dropdown.Item>
                  <Dropdown.Item style={{ cursor: 'pointer' }} onClick={this.handleUserLogout}>
                    <Header as='h3'>
                      Logout
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
