import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Grid, Responsive, Sidebar, Segment, Menu, Icon, Header, Dropdown, Image, Divider } from 'semantic-ui-react';
import * as logo from '../Assets/logo.png';

import './Marker.css';

const Marker = (props) => {
  const { color, name, id } = props;
  return (
    <div>
      <div
        className="pin bounce"
        style={{ backgroundColor: color, cursor: 'pointer' }}
        title={name}
      />
      <div className="pulse" />
    </div>
  );
};


const Map = () => {
  const [center, setCenter] = useState({ lat: 40.347626, lng: -74.654417 });
  const [zoom, setZoom] = useState(18);
  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyAPokdpjVv5Nl3nXgF6vinc5eHqEg_UEj4' }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        <Marker
          lat={40.347626}
          lng={-74.654417}
          name="My Marker"
          color="#c96148"
        />
      </GoogleMapReact>
    </div>
  );
}

class LocationPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    }
    this.setVisible = this.setVisible.bind(this);
    this.handlePusher = this.handlePusher.bind(this);
  }

  setVisible() {
    const { visible } = this.state;
    const change = !visible
    this.setState({ visible: change });
  }

  handlePusher() {
    const { visible } = this.state;
    if (visible) this.setState({ visible: false });
  }

  landingRoute = () => {
    this.props.history.push('/landing');
  }

  aboutRoute = () => {
    window.location.href = 'https://pucoffeeclub.com/';
  }

  teamRoute = () => {
    this.props.history.push('/team');
  }

  locationRoute = () => {
    this.props.history.push('/location');
  }

  render() {

    return (
      <React.Fragment>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Sidebar.Pushable as={Segment}>
            <Sidebar
              as={Menu}
              animation='push'
              vertical
              inverted
              borderless
              visible={this.state.visible}
              style={{ background: '#EDAC86' }}
              width='thick'
            >
              <Menu.Item>
                <Icon name='x' size='large' style={{ cursor: 'pointer', color: 'white' }} onClick={this.handlePusher} />
              </Menu.Item>
              <Menu.Item style={{ height: '12vh' }} />
              <Menu.Item>
                <Image centered={true} src={logo} size='mini' />
              </Menu.Item>
              <Menu.Item>
                <hr></hr>
              </Menu.Item>
              <Menu.Item as='a' onClick={this.landingRoute} style={{ background: '#EDAC86', textAlign: 'center' }}>
                <Header as='h2' style={{ paddingLeft: '5%', color: 'white', textAlign: 'left', fontFamily: 'Didot', fontStyle: 'italic' }}>
                  <span>01.&nbsp;&nbsp;&nbsp;&nbsp;Home</span>
                </Header>
              </Menu.Item>
              <Menu.Item as='a' onClick={this.teamRoute} style={{ background: '#EDAC86' }}>
                <Header as='h2' style={{ paddingLeft: '5%', color: 'white', textAlign: 'left', fontFamily: 'Didot', fontStyle: 'italic' }}>
                  <span>02.&nbsp;&nbsp;&nbsp;&nbsp;Team</span>
                </Header>
              </Menu.Item>
              <Menu.Item as='a' onClick={this.aboutRoute} style={{ background: '#EDAC86' }}>
                <Header as='h2' style={{ paddingLeft: '5%', color: 'white', textAlign: 'left', fontFamily: 'Didot', fontStyle: 'italic' }}>
                  <span>03.&nbsp;&nbsp;&nbsp;&nbsp;About</span>
                </Header>
              </Menu.Item>
              <Menu.Item as='a' onClick={this.aboutRoute} style={{ background: '#EDAC86' }}>
                <Header as='h2' style={{ paddingLeft: '5%', color: 'white', textAlign: 'left', fontFamily: 'Didot', fontStyle: 'italic' }}>
                  <span>04.&nbsp;&nbsp;&nbsp;&nbsp;Location</span>
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
                <Header as='h5' style={{ textAlign: 'center', fontFamily: 'Didot', fontStyle: 'italic', color: 'white' }}>
                  © 2020 Expresso
                              </Header>
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher
              dimmed={this.state.visible}
              onClick={this.handlePusher}
            >
              <Grid columns='equal' style={{ height: '100vh', margin: '0' }}>
                <Grid.Row verticalAlign='middle' style={{ height: '7vh', background: '#BEB19B', padding: '0' }}>
                  <Menu inverted fixed="top" fluid widths='6' secondary style={{ height: '7vh', background: '#BEB19B' }}>
                    <Menu.Item position='left' style={{ width: '10%' }}>
                      <Icon name='sidebar' size='large' onClick={this.setVisible} style={{ color: 'white', background: 'none' }} />
                    </Menu.Item>
                  </Menu>
                </Grid.Row >
                <Grid.Column>
                  <Grid.Row style={{ height: '10%' }} />
                  <Grid.Row style={{ height: '10%' }}>
                    <Header as='h1' style={{ textAlign: 'center', fontSize: '400%', fontFamily: 'Didot', marginTop: '0vh', fontStyle: 'italic' }}>
                      Find Us!
                      </Header>
                  </Grid.Row>
                  <Grid.Row style={{ height: '5%' }} />
                  <Grid.Row style={{ height: '10%' }}>
                    <Header as='h2' style={{ textAlign: 'center', marginTop: '0vh', fontFamily: 'Didot', fontStyle: 'italic' }}>
                      Conveniently located at
                      </Header>
                  </Grid.Row>
                  <Grid.Row style={{ height: '15%' }}>
                    <Header as='h1' style={{ textAlign: 'center', marginTop: '0vh', fontFamily: 'Proxima Nova', color: '#edac86' }}>
                      Campus Club Taproom
                      </Header>
                    <Header as='p' style={{ textAlign: 'center', marginTop: '0vh', fontFamily: 'Proxima Nova' }}>
                      5 Prospect Ave, Princeton, NJ
                      </Header>
                  </Grid.Row>
                  <Grid.Row style={{ height: '5%' }} />
                  <Divider />
                  <Grid.Row style={{ height: '5%' }} />
                  <Grid.Row style={{ height: '25%' }}>
                    <Header as='h1' style={{ textAlign: 'center', marginTop: '0vh', fontFamily: 'Proxima Nova', color: '#edac86' }}>
                      Hours
                      </Header>
                    <Header as='p' style={{ textAlign: 'center', marginTop: '0vh', fontFamily: 'Proxima Nova' }}>
                      Monday - Friday: 8AM-6PM<br />
                      Saturday: 10AM-2AM<br />
                      Sunday: 10AM-6PM
                      </Header>
                  </Grid.Row>
                </Grid.Column>
                <Grid.Column style={{ padding: '10px' }}>
                  <Map />
                </Grid.Column>

                <Grid.Row />

              </Grid>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <Sidebar.Pushable as={Segment}>
            <Sidebar
              as={Menu}
              animation='push'
              fluid
              vertical
              inverted
              borderless
              visible={this.state.visible}
              style={{ background: '#EDAC86' }}
            >
              <Menu.Item>
                <Icon name='x' size='large' style={{ cursor: 'pointer', color: 'white' }} onClick={this.handlePusher} />
              </Menu.Item>
              <Menu.Item style={{ height: '12vh' }} />
              <Menu.Item>
                <Image centered={true} src={logo} size='mini' />
              </Menu.Item>
              <Menu.Item>
                <hr></hr>
              </Menu.Item>
              <Menu.Item as='a' style={{ background: '#EDAC86', textAlign: 'center' }}>
                <Header as='h2' style={{ paddingLeft: '5%', color: 'white', textAlign: 'left', fontFamily: 'Didot', fontStyle: 'italic' }}>
                  <span>01.&nbsp;&nbsp;&nbsp;&nbsp;Home</span>
                </Header>
              </Menu.Item>
              <Menu.Item as='a' onClick={this.teamRoute} style={{ background: '#EDAC86' }}>
                <Header as='h2' style={{ paddingLeft: '5%', color: 'white', textAlign: 'left', fontFamily: 'Didot', fontStyle: 'italic' }}>
                  <span>02.&nbsp;&nbsp;&nbsp;&nbsp;Team</span>
                </Header>
              </Menu.Item>
              <Menu.Item as='a' onClick={this.aboutRoute} style={{ background: '#EDAC86' }}>
                <Header as='h2' style={{ paddingLeft: '5%', color: 'white', textAlign: 'left', fontFamily: 'Didot', fontStyle: 'italic' }}>
                  <span>03.&nbsp;&nbsp;&nbsp;&nbsp;About</span>
                </Header>
              </Menu.Item>
              <Menu.Item as='a' onClick={this.locationRoute} style={{ background: '#EDAC86' }}>
                <Header as='h2' style={{ paddingLeft: '5%', color: 'white', textAlign: 'left', fontFamily: 'Didot', fontStyle: 'italic' }}>
                  <span>04.&nbsp;&nbsp;&nbsp;&nbsp;Location</span>
                </Header>
              </Menu.Item>
              <Menu.Item>
                <Header as='h2' onClick={this.baristaRoute} style={{ paddingLeft: '5%', color: 'white', textAlign: 'left', fontFamily: 'Didot', fontStyle: 'italic' }}>
                  <span>05.&nbsp;&nbsp;&nbsp;&nbsp;Barista Login</span>
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
              <Menu.Item>
                <Header as='h5' style={{ textAlign: 'center', fontFamily: 'Didot', fontStyle: 'italic', color: 'white' }}>
                  © 2020 Expresso
            </Header>
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher
              dimmed={this.state.visible}
              onClick={this.handlePusher}
            >
              <Grid style={{ margin: '0', height: '100vh' }}>
                <Grid.Row style={{ height: '7vh', background: '#BEB19B', padding: '0' }}>
                  <Menu inverted fixed="top" fluid widths='6' secondary style={{ height: '7vh', background: '#BEB19B' }}>
                    <Menu.Item position='left' style={{ width: '10%' }}>
                      <Icon name='sidebar' size='large' onClick={this.setVisible} style={{ color: 'white', background: 'none' }} />
                    </Menu.Item>
                  </Menu>
                </Grid.Row>
                <Grid.Row style={{height:'90%'}}>
                  <Grid.Column>
                <Grid.Row style={{ height: '10%' }} />
                <Grid.Row style={{ height: '10%' }}>
                  <Header as='h1' style={{ textAlign: 'center', fontSize: '400%', fontFamily: 'Didot', marginTop: '0vh', fontStyle: 'italic' }}>
                    Find Us!
                      </Header>
                </Grid.Row>
                <Grid.Row style={{ height: '5%' }} />
                <Grid.Row style={{ height: '10%' }}>
                  <Header as='h2' style={{ textAlign: 'center', marginTop: '0vh', fontFamily: 'Didot', fontStyle: 'italic' }}>
                    Conveniently located at
                      </Header>
                </Grid.Row>
                <Grid.Row style={{ height: '15%' }}>
                  <Header as='h1' style={{ textAlign: 'center', marginTop: '0vh', fontFamily: 'Proxima Nova', color: '#edac86' }}>
                    Campus Club Taproom
                      </Header>
                  <Header as='p' style={{ textAlign: 'center', marginTop: '0vh', fontFamily: 'Proxima Nova' }}>
                    5 Prospect Ave, Princeton, NJ
                      </Header>
                </Grid.Row>
                <Grid.Row style={{ height: '5%' }} />
                <Divider />
                <Grid.Row style={{ height: '5%' }} />
                <Grid.Row style={{ height: '25%' }}>
                  <Header as='h1' style={{ textAlign: 'center', marginTop: '0vh', fontFamily: 'Proxima Nova', color: '#edac86' }}>
                    Hours
                      </Header>
                  <Header as='p' style={{ textAlign: 'center', marginTop: '0vh', fontFamily: 'Proxima Nova' }}>
                    Monday - Friday: 8AM-6PM<br />
                    Saturday: 10AM-2AM<br />
                    Sunday: 10AM-6PM
                      </Header>
                </Grid.Row>
                </Grid.Column>
                </Grid.Row>

              </Grid>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Responsive>

      </React.Fragment>
    );
  }
}


export default LocationPage;