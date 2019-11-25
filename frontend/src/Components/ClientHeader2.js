import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid, Button, Dropdown} from 'semantic-ui-react';

import MenuPage from './MenuPage';
import OrderPage from './OrderPage';
import ItemPopUp from './ItemPopUp';

import * as logo from '../Assets/logo.png';

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
        <Menu inverted fixed="top" fluid widths={7} secondary style={{ height: '10vh', background: '#F98F69' }}>
          <Menu.Item position='left'>
            <Image src={logo} size='mini' style={{ cursor: 'pointer' }} onClick={this.handleLogoItemClick}/>
          </Menu.Item>
          <Menu.Item position='right'>
            {/* Dropdown menu */}
            <Dropdown icon='sidebar' style={{color:'black'}}>
              <Dropdown.Menu direction='left' style={{background: '#F98F69' }}>
                <Dropdown.Item>
                  <Header as='h3' style={{ cursor: 'pointer' }}>
                    <Icon name='th list'/>
                    MENU
                  </Header>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Header as='h3'>
                    <Icon name='shopping bag'/>
                    MY ORDER
                  </Header>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Header as='h3'>
                    <Icon name='user'/>
                    VICTOR HUA
                  </Header>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Menu>
      </React.Fragment>
    );
  }
}

export default ClientHeader;
