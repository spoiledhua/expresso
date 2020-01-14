import React from 'react';
import { Menu, Icon, Image, Container, Header, Responsive, Checkbox, Dimmer, Loader, Card, Button, Label, Sidebar } from 'semantic-ui-react';
import * as logo from '../Assets/logo.png';

import { baristaGetUser, baristaLogout, postStoreStatus, getStoreStatus } from '../Axios/axios_getter';


class BaristaHeader extends React.Component {

  state = {
    user: null,
    baristaLogoutConfirm: false,
    visible: false,
    loading: false,
    storeStatus: false
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    baristaGetUser(JSON.parse(localStorage.getItem('token')))
      .then(user => {
        if (user.user === null) {
          this.props.history.push({
            pathname: '/baristalogin',
            state: { requested: this.props.history.location.pathname }
          });
        }
        else {
          this.setState({ user: user.username });
        }
      })
      .catch(error => {
        console.log(error);
      });
    this.getStatus();
    this.intervalId = setInterval(this.getStatus, 10000);
    this.setState({ loading: false });
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalId);
  }

  setVisible = () => {
    const { visible } = this.state;
    const change = !visible
    this.setState({ visible: change });
  }

  handlePusher = () => {
    const { visible } = this.state;
    if (visible) this.setState({ visible: false });
  }

  handleOrdersClick = () => {
    // redirect to current orders page
    this.setState({ loading: true });
    this.props.history.push({
      pathname: '/baristaorders',
      state: { requested: '/baristaorders' }
    });
    this.setState({ loading: false });
  }

  handleHistoryClick = () => {
    // redirect to current orders page
    this.setState({ loading: true });
    this.props.history.push({
      pathname: '/baristahistory',
      state: { requested: '/baristahistory' }
    });
    this.setState({ loading: false });
  }

  handleLandingClick = () => {
    this.setState({ loading: true });
    this.props.history.push('/landing');
    this.setState({ loading: false });
  }

  handleInventoryClick = async () => {
    this.setState({ loading: true });
    this.props.history.push({
      pathname: '/baristainventory',
      state: { requested: '/baristainventory' }
    });
    this.setState({ loading: false });
  }

  handleBaristaLogout = () => {
    this.setState({ loading: true });
    this.setState({ baristaLogoutConfirm: true });
    this.setState({ loading: false });
  }

  handleBaristaLogoutCancel = () => {
    this.setState({ baristaLogoutConfirm: false });
  }

  handleBaristaLogoutConfirm = async () => {
    this.setState({ loading: true });
    baristaLogout()
      .then(data => {
        localStorage.setItem('token', JSON.stringify(null));
      })
    this.setState({ loading: false });
    this.props.history.push('/landing');
  }

  getStatus = () => {
    getStoreStatus(JSON.parse(localStorage.getItem('token')))
      .then(data => {
        this.setState({ storeStatus: data.status });
      });
  }

  handleAcceptingClick = async () => {
    await postStoreStatus(JSON.parse(localStorage.getItem('token')));
    this.getStatus();
  }

  render() {

    return (
      <React.Fragment>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Dimmer active={this.state.loading} page inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
          <Dimmer active={this.state.baristaLogoutConfirm} onClickOutside={this.handleBaristaLogoutCancel} page>
            <Container style={{ width: '720px' }}>
              <Card fluid>
                <Card.Content>
                  <Header as='h3' color='grey'>Are you sure you want to logout?</Header>
                </Card.Content>
                <Button.Group>
                  <Button onClick={this.handleBaristaLogoutCancel}>Cancel</Button>
                  <Button positive onClick={this.handleBaristaLogoutConfirm} style={{ background: '#85A290' }}>Logout</Button>
                </Button.Group>
              </Card>
            </Container>
          </Dimmer>
          {/* Top Menu */}
          <Menu borderless inverted widths='12' fixed="top" fluid secondary style={{ height: '7vh', background: '#BEB19B' }}>
            <Menu.Item style={{cursor: 'pointer', width:'9%'}} onClick={this.handleLandingClick}>
              <Header as='h4' style={{fontFamily:'Avenir', color: 'white'}}>
                HOME
              </Header>
            </Menu.Item>
            <Menu.Item style={{cursor: 'pointer', width:'9%'}} onClick={this.handleOrdersClick}>
              <Header as='h4' style={{fontFamily:'Avenir', color:'white'}}>
                ORDERS
              </Header>
            </Menu.Item>
            <Menu.Item style={{cursor: 'pointer', width:'9%'}} onClick={this.handleHistoryClick}>
              <Header as='h4' style={{fontFamily:'Avenir', color:'white'}}>
                HISTORY
              </Header>
            </Menu.Item>
            <Menu.Item style={{cursor: 'pointer', width:'11%'}} onClick={this.handleInventoryClick}>
              <Header as='h4' style={{fontFamily:'Avenir', color:'white'}}>
                INVENTORY
              </Header>
            </Menu.Item>
            <Menu.Item style={{cursor: 'pointer', width:'24%'}} onClick={this.handleLandingClick}>
              <Header as='h2' style={{fontFamily:'Didot', color: 'white', fontStyle:'italic'}}>
                · the coffee club ·
              </Header>
            </Menu.Item>
            <Menu.Item style={{width:'10%'}} />
            <Menu.Item position='right' style={{width:'21%', marginTop:'1em'}} >
              <Header>
                <Checkbox toggle checked={this.state.storeStatus} onChange={this.handleAcceptingClick} style={{marginRight:'1em'}} />
                <Label as='h3' style={{background:'None', marginLeft:'-10%', marginBottom:'5%', color:'white'}}> ACCEPTING ORDERS </Label>
              </Header>
            </Menu.Item>
            <Menu.Item position='right' onClick={this.handleBaristaLogout}>
              <Header as='h4' style={{fontFamily:'Avenir', color:'white'}}>
                LOGOUT
              </Header>
            </Menu.Item>
          </Menu>


        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <Dimmer active={this.state.loading} page inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
          <Dimmer active={this.state.baristaLogoutConfirm} onClickOutside={this.handleBaristaLogoutCancel} page>
            <Container style={{ width: '720px' }}>
              <Card fluid>
                <Card.Content>
                  <Header as='h3' color='grey'>Are you sure you want to logout?</Header>
                </Card.Content>
                <Button.Group>
                  <Button onClick={this.handleBaristaLogoutCancel}>Cancel</Button>
                  <Button positive onClick={this.handleBaristaLogoutConfirm}>Logout</Button>
                </Button.Group>
              </Card>
            </Container>
          </Dimmer>
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
              <Icon name='x' size='large' style={{cursor:'pointer', color:'black'}} onClick={this.handlePusher}/>
            </Menu.Item>
            <Menu.Item style={{height:'12vh'}}/>
            <Menu.Item>
              <Image centered={true} src={logo} size='mini'/>
            </Menu.Item>
            <Menu.Item>
              <hr></hr>
            </Menu.Item>
            <Menu.Item onClick={this.handleOrdersClick}>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>01.&nbsp;&nbsp;&nbsp;&nbsp;Orders</span>
              </Header>
            </Menu.Item>
            <Menu.Item onClick={this.handleHistoryClick}>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>02.&nbsp;&nbsp;&nbsp;&nbsp;History</span>
              </Header>
            </Menu.Item>
            <Menu.Item onClick={this.handleInventoryClick}>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>03.&nbsp;&nbsp;&nbsp;&nbsp;Inventory</span>
              </Header>
            </Menu.Item>
            <Menu.Item onClick={this.handleBaristaLogout}>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>04.&nbsp;&nbsp;&nbsp;&nbsp;Logout</span>
              </Header>
            </Menu.Item>
            <Menu.Item>
              <hr></hr>
            </Menu.Item>
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
            <Menu.Item />
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
              <Header as='h4'>
                <Checkbox toggle checked={this.state.storeStatus} onClick={this.handleAcceptingClick} style={{marginRight:'1em'}} />
              </Header>
            </Menu.Item>
            <Menu.Item/>
          </Menu>
        </Responsive>
      </React.Fragment>
    );
  };
}


export default BaristaHeader;
