import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid } from 'semantic-ui-react';
import MenuBar from './MenuBar';
import axios from 'axios';

import * as logo from '../Assets/logo.png';

class ClientComponent extends React.Component {

  state = {
    selectedItem: 'Menu'
  }

  handleMenuItemClick = (e) => {
    // redirect to Menu Page
    this.setState({ selectedItem: 'Menu' });
  }

  handleOrderItemClick = (e) => {
    // redirect to Order page
    axios.get('http://localhost:5000/customer/orderinfo')
      .then(res => {
        console.log(res.data);
      });
    this.setState({ selectedItem: 'Order' });
  }

  handleLogoItemClick = (e) => {
    // redirect to company website
    this.setState({ selectedItem: 'Logo' });
  }

  handleUserItemClick = (e) => {
    // redirect to User page
    this.setState({ selectedItem: 'User' });
  }

  handleDrinksItemClick = (e) => {
    // speed scroll to Drinks
  }

  handleFoodItemClick = (e) => {
    // speed scroll to Food
  }

  handleAddonsItemClick = (e) => {
    // speed scroll to Add-ons
  }

  render() {

    const { selectedItem } = this.state

    var appMenus = {'Menu':
    <Header as='h2'>
      <Icon name='settings' />
      <Header.Content>
        Account Settings
        <Header.Subheader>Manage your preferences</Header.Subheader>
      </Header.Content>
    </Header>,
    'Order': <div>My Order</div>,
    'User': <div>User</div>};

    return (
      <React.Fragment>

        {/* Side menu */}
        <Menu vertical secondary fixed='left' color='grey' size='massive'>
          {/* div is used for spacing */}
          <div style={{ height: '30vh' }} />
          <Menu.Item onClick={this.handleDrinksItemClick}>
            <div style={{ height: '2vh'}} />
            <Container textAlign='center'>
              <Header as='h2'>
                <Icon name='coffee'/>
                DRINKS
              </Header>
            </Container>
            <div style={{ height: '2vh'}} />
          </Menu.Item>
          <Menu.Item style={{ cursor: 'pointer' }} onClick={this.handleFoodItemClick}>
            <div style={{ height: '2vh'}} />
            <Container textAlign='center'>
              <Header as='h2'>
                <Icon name='utensils'/>
                FOOD
              </Header>
            </Container>
            <div style={{ height: '2vh'}} />
          </Menu.Item>
          <Menu.Item style={{ cursor: 'pointer' }} onClick={this.handleAddonsItemClick}>
            <div style={{ height: '2vh'}} />
            <Container textAlign='center'>
              <Header as='h2'>
                <Icon name='add'/>
                ADD-ONS
              </Header>
            </Container>
            <div style={{ height: '2vh'}} />
          </Menu.Item>
        </Menu>

        {/* Top Menu */}
        <Menu inverted fixed="top" fluid widths={7} secondary style={{ height: '10vh', background: '#D3D3D3' }}>
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
          <Menu.Item>
          </Menu.Item>
          <Menu.Item>
            <Image src={logo} size='tiny' style={{ cursor: 'pointer' }} onClick={this.handleLogoItemClick}/>
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

        {/* Main Content */}
        <div style={{ height: '15vh' }} />
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
            </Grid.Column>
            <Grid.Column width={10}>
              <Grid divided='vertically'>
                <Grid.Row>
                  <div style={{ height: '3vh' }} />
                  <Header style={{ 'font-size': '3em' }}>
                    MENU
                  </Header>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={1}>
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <Container>
                      <div style={{ height: '2em' }} />
                      <MenuBar title="Drinks" />
                      <MenuBar title="Food" />
                      <MenuBar title="Add-Ons" />
                    </Container>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column width={2}>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default ClientComponent;
