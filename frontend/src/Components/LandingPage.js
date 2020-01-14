import React from 'react';
import { Header, Icon, Image, Menu, Segment, Sidebar, Button, Grid, Responsive, Container} from 'semantic-ui-react';
import { authenticate, getUser } from '../Axios/axios_getter';
import * as logo from '../Assets/logo.png';
import * as animation from '../Assets/animation.png';
import * as cartoon from '../Assets/coffeesteam.gif';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    }
    this.setVisible = this.setVisible.bind(this);
    this.handlePusher = this.handlePusher.bind(this);
    this.route = this.route.bind(this);
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

  route() {
    getUser()
      .then(user => {
        if (user.user == null) {
          authenticate()
            .then(data => {
              window.location.href = data.url;
            });
        }
        else {
          localStorage.setItem('token', JSON.stringify(user.token));
          this.props.history.push('/menu');
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  baristaRoute = () => {
    this.props.history.push('/baristalogin');
  }

  teamRoute = () => {
    this.props.history.push('/team');
  }

  locationRoute = () => {
    this.props.history.push('/location');
  }

  aboutRoute = () => {
    window.open('https://pucoffeeclub.com');
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
              <Menu.Item as='a' style={{background: '#EDAC86', textAlign: 'center'}}>
                <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                  <span>01.&nbsp;&nbsp;&nbsp;&nbsp;Home</span>
                </Header>
              </Menu.Item>
              <Menu.Item as='a' onClick={this.teamRoute} style={{background: '#EDAC86'}}>
                <Header as='h2' style={{paddingLeft:'5%', color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                  <span>02.&nbsp;&nbsp;&nbsp;&nbsp;Team</span>
                </Header>
              </Menu.Item>
              <Menu.Item as='a' onClick={this.aboutRoute} style={{background: '#EDAC86'}}>
                <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                  <span>03.&nbsp;&nbsp;&nbsp;&nbsp;About</span>
                </Header>
              </Menu.Item>
              <Menu.Item as='a' onClick={this.locationRoute} style={{background: '#EDAC86'}}>
                <Header as='h2' style={{paddingLeft:'5%', color:'black',textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                  <span>04.&nbsp;&nbsp;&nbsp;&nbsp;Location</span>
                </Header>
              </Menu.Item>
              <Menu.Item>
                <hr></hr>
              </Menu.Item>
              <Menu.Item/>
              <Menu.Item/>
              <Menu.Item/>
              <Menu.Item/>
              <Menu.Item/>
              <Menu.Item/>
              <Menu.Item/>
              <Menu.Item>
                <Header as='h5' style={{textAlign:'center', fontFamily:'Didot', fontStyle:'italic', color:'black'}}>
                  © 2020 Expresso
                </Header>
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher
              dimmed={this.state.visible}
              onClick={this.handlePusher}
            >
              <Grid columns='equal' style={{height: '100vh', margin:'0'}}>
                <Grid.Row verticalAlign='middle' style={{height: '7vh', background: '#BEB19B', padding:'0'}}>
                  <Menu inverted fixed="top" fluid widths='6' secondary style={{ height: '7vh', background: '#BEB19B' }}>
                    <Menu.Item position='left' style={{width:'5%'}}>
                      <Icon name='sidebar' size ='large' onClick={this.setVisible} style={{color:'black', background: 'none', cursor: 'pointer'}} />
                    </Menu.Item>
                    <Menu.Item />
                    <Menu.Item />
                    <Menu.Item />
                    <Menu.Item />
                    <Menu.Item>
                      <Button circular style={{background:'none'}} onClick={this.baristaRoute}>
                        <strong style={{color:'black', textShadowColor:'black',fontFamily:'Avenir'}}>Barista Login</strong>
                      </Button>
                    </Menu.Item>
                  </Menu>
                </Grid.Row>
                <Grid.Row style={{padding:'0', height: '100%', textAlign:'center'}}>
                  <Grid.Column stretched style={{ padding:'0'}}>
                    <Grid.Row style={{height: '5%'}}></Grid.Row>
                    <Grid.Row style={{height: '10%'}}>
                      <Image centered={true} src={cartoon} size='tiny'/>
                    </Grid.Row>
                    <Container style={{margin:'2%'}}>
                      <Grid.Row style={{height: '25%'}}>
                        <Header as='h1' style={{textAlign:'center', fontSize: '400%', fontFamily:'Didot', marginTop:'0vh'}}>
                          Responsibly Sourced.<br/>
                          Student Owned.<br/>
                          Coffee Club.
                        </Header>
                      </Grid.Row>
                    </Container>
                    <Grid.Row style={{height: '5%', textAlign:'center'}}>
                      <Button circular basic color='black' size='huge' style={{textAlign: "center"}} onClick={this.route}>
                        <strong>ORDER NOW</strong>
                      </Button>
                    </Grid.Row>
                    <Grid.Row />
                    <Grid.Row />
                    <Grid.Row />
                    <Grid.Row />
                  </Grid.Column>
                  <Grid.Column stretched style={{padding:'0'}}>
                    <Image src={animation} style={{objectFit: 'cover'}}/>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
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
              <Icon name='x' size='large' style={{cursor:'pointer', color:'black'}} onClick={this.handlePusher}/>
            </Menu.Item>
            <Menu.Item style={{height:'12vh'}}/>
            <Menu.Item>
              <Image centered={true} src={logo} size='mini'/>
            </Menu.Item>
            <Menu.Item>
              <hr></hr>
            </Menu.Item>
            <Menu.Item as='a' style={{background: '#EDAC86', textAlign: 'center'}}>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>01.&nbsp;&nbsp;&nbsp;&nbsp;Home</span>
              </Header>
            </Menu.Item>
            <Menu.Item as='a' onClick={this.teamRoute} style={{background: '#EDAC86'}}>
              <Header as='h2' style={{paddingLeft:'5%', color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>02.&nbsp;&nbsp;&nbsp;&nbsp;Team</span>
              </Header>
            </Menu.Item>
            <Menu.Item as='a' onClick={this.aboutRoute} style={{background: '#EDAC86'}}>
              <Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>03.&nbsp;&nbsp;&nbsp;&nbsp;About</span>
              </Header>
            </Menu.Item>
            <Menu.Item as='a' onClick={this.locationRoute} style={{background: '#EDAC86'}}>
              <Header as='h2' style={{paddingLeft:'5%', color:'black',textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>04.&nbsp;&nbsp;&nbsp;&nbsp;Location</span>
              </Header>
            </Menu.Item>
            <Menu.Item>
              <Header as='h2' onClick={this.baristaRoute} style={{paddingLeft:'5%', color:'black',textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
                <span>05.&nbsp;&nbsp;&nbsp;&nbsp;Barista Login</span>
              </Header>
            </Menu.Item>
            <Menu.Item>
              <hr></hr>
            </Menu.Item>
            <Menu.Item/>
            <Menu.Item/>
            <Menu.Item/>
            <Menu.Item/>
            <Menu.Item/>
            <Menu.Item/>
            <Menu.Item>
              <Header as='h5' style={{textAlign:'center', fontFamily:'Didot', fontStyle:'italic', color:'black'}}>
                © 2020 Expresso
              </Header>
            </Menu.Item>
          </Sidebar>
          <Grid style={{margin:'0', height: '100vh'}}>
            <Grid.Row style={{height: '7vh', background: '#BEB19B', padding:'0'}}>
              <Menu inverted fixed="top" fluid widths='6' secondary style={{ height: '7vh', background: '#BEB19B' }}>
                <Menu.Item position='left' style={{width:'15%'}}>
                  <Icon name='sidebar' size ='large' onClick={this.setVisible} style={{color:'black', background: 'none', cursor: 'pointer'}} />
                </Menu.Item>
              </Menu>
            </Grid.Row>
            <Grid.Row style={{padding:'0', height:'90%', textAlign:'center'}}>
              <Grid.Column>
                <Grid.Row style={{height:'5%'}}></Grid.Row>
                <Grid.Row style={{height:'10%'}}>
                  <Image centered={true} src={cartoon} size='tiny'/>
                </Grid.Row>
                <Grid.Row style={{height:'20%'}}></Grid.Row>
                <Grid.Row style={{height:'30%'}}>
                  <Container>
                    <Header as='h1' style={{textAlign:'center', fontSize: '35px', fontFamily:'Didot'}}>
                      Responsibly Sourced.<br/>
                      Student Owned.<br/>
                      Coffee Club.
                    </Header>
                  </Container>
                </Grid.Row>
                <Grid.Row style={{height:'5%'}}></Grid.Row>
                <Grid.Row style={{height:'10%'}}>
                  <Container style={{margin:'2%'}}>
                    <Button circular basic color='black' size='huge' style={{textAlign: "center"}} onClick={this.route}>
                      <strong>ORDER NOW</strong>
                    </Button>
                  </Container>
                </Grid.Row>
                <Grid.Row />
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

export default LandingPage;
