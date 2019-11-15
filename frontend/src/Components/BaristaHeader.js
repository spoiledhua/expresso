import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid, Responsive, Dropdown} from 'semantic-ui-react';
import * as logo from '../Assets/logo.png';

import BaristaOrders from './BaristaOrders'
import BaristaHistory from './BaristaHistory'


class BaristaHeader extends React.Component {
    state = {
        selectedPage: 'BaristaOrders',
    }
    
    handleOrdersClick = (e) => {
        // redirect to current orders page
        this.setState({selectedPage: 'BaristaOrders'})
    }

    handleHistoryClick = (e) => {
        // redirect to current orders page
        this.setState({selectedPage: 'BaristaHistory'})
    }
    
    render() {
        var appPages = {
            'BaristaOrders': <BaristaOrders />,
            'BaristaHistory' : <BaristaHistory />
        };

        return (
            <React.Fragment>
            <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            {/* Top Menu */}
            <Menu inverted fixed="top" fluid  secondary style={{ height: '10vh', background: '#F98F69' }}>
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
                <Menu.Item position='right'>
                    <Image src={logo} size='mini' style={{ cursor: 'pointer' }} onClick={this.handleLogoItemClick}/>
                </Menu.Item>
            </Menu> 
            </Responsive>
            <div style={{ height: '15vh' }} />
            {appPages[this.state.selectedPage]}
          </React.Fragment>
          
        );
    };
}


export default BaristaHeader