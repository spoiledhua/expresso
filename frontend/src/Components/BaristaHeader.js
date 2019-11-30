import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid, Responsive, Dropdown, Checkbox } from 'semantic-ui-react';
import * as logo from '../Assets/logo.png';

import BaristaOrders from './BaristaOrders';
import BaristaHistory from './BaristaHistory';
import BaristaInventory from './BaristaInventory';


import { baristaGetUser } from '../Axios/axios_getter';


class BaristaHeader extends React.Component {

  state = {
    user: null,
    selectedPage: 'BaristaOrders',
  }

  componentDidMount = async () => {
    baristaGetUser()
      .then(user => {
        if (user.user == null) {
          this.props.history.push('/baristalogin');
        }
        else {
          this.setState({ user: user.username });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleOrdersClick = (e) => {
    // redirect to current orders page
    this.setState({ selectedPage: 'BaristaOrders' })
  }

  handleHistoryClick = (e) => {
    // redirect to current orders page
    this.setState({ selectedPage: 'BaristaHistory' })
  }

  handleLogoClick = (e) => {
    this.props.history.push('/landing');
  }

  handleInventoryClick = (e) => {
    // redirect to inventory page
    this.setState({ selectedPage: 'BaristaInventory' })

  }

  render() {
    var appPages = {
      'BaristaOrders': <BaristaOrders />,
      'BaristaHistory': <BaristaHistory />,
      'BaristaInventory' : <BaristaInventory />
    };

    return (
      <React.Fragment>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          {/* Top Menu */}
          <Menu inverted fixed="top" fluid secondary style={{ height: '10vh', background: '#F98F69' }}>
            <Menu.Item width='2' style={{ cursor: 'pointer' }} onClick={this.handleOrdersClick}>
              <Header as='h3'>
                ORDERS
              </Header>
            </Menu.Item>
            <Menu.Item width='2' style={{ cursor: 'pointer' }} onClick={this.handleHistoryClick}>
              <Header as='h3'>
                HISTORY
              </Header>
            </Menu.Item>
            <Menu.Item width='2' style={{ cursor: 'pointer' }} onClick={this.handleInventoryClick}>
              <Header as='h3'>
                INVENTORY
              </Header>
            </Menu.Item>
            <Menu.Item width='2' position='right'>
              <Header as='h3'>
                <Checkbox toggle label='Accepting Orders' />
              </Header>
            </Menu.Item>
            <Menu.Item position='right' width='2'>
              <Image src={logo} onClick={this.handleLogoClick} size='mini' style={{ cursor: 'pointer' }} />
            </Menu.Item>
          </Menu>

        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <Menu inverted fixed="top" fluid secondary style={{ height: '10vh', background: '#F98F69' }}>
            <Menu.Item position='left'>
              <Dropdown icon='sidebar' style={{ color: 'black' }}>
                <Dropdown.Menu style={{ background: '#F98F69' }}>
                  <Dropdown.Item style={{ cursor: 'pointer' }} onClick={this.handleOrdersClick}>
                    <Header as='h3'>
                      ORDERS
                    </Header>
                  </Dropdown.Item>
                  <Dropdown.Item style={{ cursor: 'pointer' }} onClick={this.handleHistoryClick}>
                    <Header as='h3'>
                      HISTORY
                    </Header>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
            <Menu.Item>
            <Checkbox toggle label='Accepting Orders' />
            </Menu.Item>
            <Menu.Item position='right'>
              <Image src={logo} size='mini' style={{ cursor: 'pointer' }} />
            </Menu.Item>
          </Menu>
        </Responsive>
        <div style={{ height: '15vh' }} />
        {appPages[this.state.selectedPage]}
      </React.Fragment>
    );
  };
}


export default BaristaHeader;
