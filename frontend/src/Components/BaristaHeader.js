import React from 'react';
import { Label, Menu, Icon, Image, Container, Header, Responsive, Dropdown, Checkbox, Dimmer, Loader, Card, Button } from 'semantic-ui-react';
import * as logo from '../Assets/logo.png';


import { baristaGetUser, baristaLogout } from '../Axios/axios_getter';


class BaristaHeader extends React.Component {

  state = {
    user: null,
    baristaLogoutConfirm: false,
    loading: false
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    baristaGetUser()
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
    this.setState({ loading: false });
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

  handleLogoClick = () => {
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
    await setTimeout(() => { baristaLogout() }, 1000);
    this.setState({ loading: false });
    this.props.history.push('/landing');
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
                  <Button positive onClick={this.handleBaristaLogoutConfirm}>Logout</Button>
                </Button.Group>
              </Card>
            </Container>
          </Dimmer>
          {/* Top Menu */}
          <Menu borderless inverted widths='12' fixed="top" fluid secondary style={{ height: '7vh', background: '#BEB19B' }}>
            <Menu.Item style={{cursor: 'pointer', width:'9%'}} onClick={this.handleLogoClick}>
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
            <Menu.Item style={{cursor: 'pointer', width:'24%'}} onClick={this.handleLogoClick}>
              <Header as='h2' style={{fontFamily:'Didot', color: 'white', fontStyle:'italic'}}>
                · the coffee club ·
              </Header>
            </Menu.Item>
            <Menu.Item style={{width:'10%'}} />
            <Menu.Item position='right' style={{width:'21%', marginTop:'1em'}} >
              <Header as='h4'>
                <Checkbox toggle style={{marginRight:'1em'}} />
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
          <Menu inverted fixed="top" fluid secondary style={{ height: '7vh', background: '#F98F69' }}>
            <Menu.Item position='left'>
              <Dropdown icon='sidebar' style={{ color: 'black' }}>
                <Dropdown.Menu style={{ background: '#F98F69' }}>
                  <Dropdown.Item onClick={this.handleOrdersClick}>
                    <Header as='h3'>
                      <Icon name='unordered list' />
                      Orders
                    </Header>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.handleHistoryClick}>
                    <Header as='h3'>
                      <Icon name='history' />
                      History
                    </Header>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.handleInventoryClick}>
                    <Header as='h3'>
                      <Icon name='archive' />
                      Inventory
                    </Header>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={this.handleBaristaLogout}>
                    <Header as='h3'>
                      <Icon name='sign-out' />
                      Logout
                    </Header>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
            <Menu.Item position='right'>
              <Image src={logo} size='mini' style={{ cursor: 'pointer' }} />
            </Menu.Item>
            <Menu.Item>
              <Checkbox toggle label='Accepting Orders' />
            </Menu.Item>
          </Menu>
        </Responsive>
        <div style={{ height: '15vh' }} />
      </React.Fragment>
    );
  };
}


export default BaristaHeader;
