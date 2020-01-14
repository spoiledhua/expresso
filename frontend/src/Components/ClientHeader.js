import React from 'react';
import { Menu, Icon, Image, Container, Header, Dimmer, Loader, Responsive, Dropdown, Card, Button, Label, Sidebar } from 'semantic-ui-react';

import * as logo from '../Assets/logo.png';
import { getUser, authenticate, clientLogout } from '../Axios/axios_getter';

class ClientHeader extends React.Component {

  state = {
    loading: false,
    visible: false,
    user: null,
    userLogoutConfirm: false
  }

  componentDidMount = async () => {

    getUser()
      .then(user => {
        if (user.user === null) {
          authenticate()
            .then(data => {
              window.location.href = data.url;
            });
        }
        else {
          this.setState({ user: user.user });
          localStorage.setItem('user', JSON.stringify(user.user));
          localStorage.setItem('token', JSON.stringify(user.token));
        }
      });
  }

  setVisible = () => {
    const { visible } = this.state;
    const change = !visible;
    this.setState({ visible: change });
  }

  handlePusher = () => {
    const { visible } = this.state;
    if (visible) this.setState({ visible: false });
  }

  handleMenuItemClick = async () => {
    // redirect to Menu Page
    this.props.history.push({
      pathname: '/menu',
      state: { requested: '/menu' }
    });
  }

  handleOrderItemClick = async () => {
    // redirect to Order page
    this.props.history.push({
      pathname: '/order',
      state: { requested: '/order' }
    });
  }

  handleUserItemClick = async () => {
    // redirect to User page
    this.props.history.push({
      pathname: '/history',
      state: { requested: '/history' }
    });
  }

  handleFAQClick = async () => {
    // redirect to FAQ Page
    this.props.history.push({
      pathname: '/FAQ',
      state: { requested: '/FAQ' }
    });
  }

  handleContactClick = async () => {
    // redirect to FAQ Page
    this.props.history.push({
      pathname: '/contact',
      state: { requested: '/contact' }
    });
  }

  handleFeedback = () => {
    window.open('https://forms.gle/6rxsKdj2gh3yPbXV8');
  }

  handleLandingClick = async () => {
    this.props.history.push('/landing');
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
        localStorage.setItem('user', JSON.stringify(null));
        localStorage.setItem('token', JSON.stringify(null));
        window.location.href = data.url;
      });
  }

  handleAvailabilityCancel = () => {
    this.setState({ availabilityConfirm: false });
    this.setState({ selectedPage: 'MenuPage' });
  }

  render() {

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
                <Button style={{fontFamily:'Avenir'}} onClick={this.handleUserLogoutCancel}>Cancel</Button>
                <Button style={{fontFamily:'Avenir', color:'white',backgroundColor:'#85A290'}} positive onClick={this.handleUserLogoutConfirm}>Logout</Button>
              </Button.Group>
            </Card>
          </Container>
        </Dimmer>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Menu borderless inverted fixed="top" fluid widths = '12' style={{ height: '7vh', background: '#BEB19B' }}>
            <Menu.Item style={{width:'5%'}}/>
            <Menu.Item style={{cursor: 'pointer', width:'8%'}} onClick={this.handleLandingClick}>
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
            <Menu.Item style={{cursor: 'pointer', width:'26%'}} onClick={this.handleLandingClick}>
              <Header as='h2' style={{fontFamily:'Didot', color: 'white', fontStyle:'italic'}}>
                · the coffee club ·
              </Header>
            </Menu.Item>
            <Menu.Item style={{width:'20%'}} />
            <Menu.Item position='right'>
              <Header as='h4' style={{ textTransform: 'lowercase', fontFamily:'Avenir', color: 'white'}}>
                <Dropdown text={this.state.user} floating style={{paddingRight:'1em'}}>
                  <Dropdown.Menu style={{ top:'170%', background: 'white', width:'50em' }}>
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
              </Header>
            </Menu.Item>
            <Menu.Item position='right' style={{width:'10%', cursor: 'pointer'}} onClick={this.handleOrderItemClick}>
              <Icon name='cart' size = 'large' style={{paddingLeft:'10%', paddingRight:'3%', color: 'white'}}/>
              <Label basic circular size='tiny' horizontal style={{borderColor:'white', background:'#EDAC86',color:'white'}}>
                {this.props.shoppingCart.length}
              </Label>
            </Menu.Item>
          </Menu>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <Sidebar
            as={Menu}
            animation='push'
            fluid
            vertical
            inverted
            borderless
            visible={this.state.visible}
            style={{background: '#EDAC86'}}
          >
            <Menu.Item>
              <Icon name='x' size='large' style={{cursor:'pointer', color:'black'}} onClick={this.setVisible}/>
            </Menu.Item>
            <Menu.Item style={{height:'12vh'}}/>
            <Menu.Item>
              <Image centered={true} src={logo} size='mini'/>
            </Menu.Item>
            <Menu.Item>
              <hr></hr>
            </Menu.Item>
            <Menu.Item onClick={this.handleLandingClick}>
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
            <Menu.Item onClick={this.handleFAQClick}>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>04.&nbsp;&nbsp;&nbsp;&nbsp;FAQ</span>
              </Header>
            </Menu.Item>
            <Menu.Item onClick={this.handleContactClick}>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>05.&nbsp;&nbsp;&nbsp;&nbsp;Contact</span>
              </Header>
            </Menu.Item>
            <Menu.Item onClick={this.handleFeedback}>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>06.&nbsp;&nbsp;&nbsp;&nbsp;Feedback</span>
              </Header>
            </Menu.Item>
            <Menu.Item onClick={this.handleUserLogout}>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>07.&nbsp;&nbsp;&nbsp;&nbsp;Logout</span>
              </Header>
            </Menu.Item>
            <Menu.Item>
              <hr></hr>
            </Menu.Item>
            <Menu.Item>
              <Header as='h5' style={{textAlign:'center', fontFamily:'Didot', fontStyle:'italic', color:'white'}}>
                © 2020 Expresso
              </Header>
            </Menu.Item>
          </Sidebar>
          <Menu inverted fixed="top" fluid widths='7' secondary style={{ height: '7vh', background: '#BEB19B' }}>
            <Menu.Item />
            <Menu.Item style={{width:'10%'}}>
              <Icon name='sidebar' style={{color:'white'}} onClick={this.setVisible}/>
            </Menu.Item>
            <Menu.Item/>
            <Menu.Item style={{width:'35%'}} onClick={this.handleLandingClick}>
              <Header as='h3' style={{fontFamily:'Didot', color: 'white', fontStyle:'italic'}}>
                · the coffee club ·
              </Header>
            </Menu.Item>
            <Menu.Item/>
            <Menu.Item position='right' onClick={this.handleOrderItemClick}>
              <Icon name='cart' size = 'large' style={{paddingLeft:'10%', paddingRight:'3%', color: 'white'}}/>
              <Label basic circular size='tiny' horizontal style={{borderColor:'white', background:'#EDAC86',color:'white'}}>
                {this.props.shoppingCart.length}
              </Label>
            </Menu.Item>
            <Menu.Item/>
          </Menu>
        </Responsive>
      </React.Fragment>
    );
  }
}

export default ClientHeader;
