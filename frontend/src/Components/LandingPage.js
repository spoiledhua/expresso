import React from 'react';
import { withRouter } from 'react-router-dom';
import { Header, Icon, Image, Menu, Segment, Sidebar, Button, Grid, Responsive, Dropdown} from 'semantic-ui-react';
import { authenticate, getUser } from '../Axios/axios_getter';
import * as logo from '../Assets/logo.png';
import * as animation from '../Assets/animation.png';

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
          this.props.history.push('/menu');
        }
      });
  }

  baristaRoute = () => {
    this.props.history.push('/baristalogin');
  }

  teamRoute = () => {
    this.props.history.push('/team');
  }

  landingRoute = () => {
    this.props.history.push('/landing');
  }

  aboutRoute = () => {
    window.location.href = 'https://pucoffeeclub.com/';
  }

  render() {

    return (
      <React.Fragment>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Sidebar.Pushable as={Segment}>
            <Sidebar
              as={Menu}
              animation='overlay'
              icon='labeled'
              vertical
              visible={this.state.visible}
              width='narrow'
              style={{background: '#F98F69'}}
            >
              <Menu.Item as='a' style={{background: '#F98F69', textAlign: 'center'}}>
                <Header as='h3' style={{textAlign:'left'}}>
                  <Icon name='home'/>
                  HOME
                </Header>
              </Menu.Item>
              <Menu.Item as='a' onClick={this.teamRoute} style={{background: '#F98F69'}}>
                <Header as='h3' style={{textAlign:'left'}}>
                  <Icon name='users'/>
                  MEET THE TEAM
                </Header>
              </Menu.Item>
              <Menu.Item as='a' onClick={this.aboutRoute} style={{background: '#F98F69'}}>
                <Header as='h3' style={{textAlign:'left'}}>
                  <Icon name='coffee'/>
                  ABOUT COFFEE CLUB
                </Header>
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher
              dimmed={this.state.visible}
              onClick={this.handlePusher}
            >
              <Grid columns='equal' style={{height: '100vh', margin:'0'}}>
                <Grid.Row verticalAlign='middle' style={{height: '80px', background: '#F98F69', padding:'0'}}>
                  <Grid.Column width={1} style={{textAlign: "center"}}>
                    <Button onClick={this.setVisible} circular icon='sidebar' size='huge' style={{background: '#F98F69'}}>
                    </Button>
                  </Grid.Column>
                  <Grid.Column width={13}></Grid.Column>
                  <Grid.Column width={2}>
                    <Button circular basic color='black' onClick={this.baristaRoute}>
                      <strong>BARISTA LOGIN</strong>
                    </Button>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row style={{padding:'0', height:'90%', textAlign:'center'}}>
                  <Grid.Column stretched style={{ padding:'0'}}>
                    <Grid.Row style={{height: '5%'}}></Grid.Row>
                    <Grid.Row style={{height: '15%'}}>
                      <Image centered src={logo} size='tiny'/>
                    </Grid.Row>
                    <Grid.Row style={{height: '5%'}}></Grid.Row>
                    <Grid.Row style={{height: '40%'}}>
                      <h1 style={{textAlign:'center', fontSize: '55px', fontFamily:'Didot'}}>
                        Responsibly Sourced.<br/>
                        Student Owned.<br/>
                        Coffee Club.
                      </h1>
                    </Grid.Row>
                    <Grid.Row style={{height: '25%', textAlign:'center'}}>
                      <Button circular basic color='black' size='huge' style={{textAlign: "center"}} onClick={this.route}>
                        <strong>ORDER NOW</strong>
                      </Button>
                    </Grid.Row>
                  </Grid.Column>
                  <Grid.Column stretched style={{padding:'0'}} centered>
                    <Image src={animation} style={{objectFit: 'cover'}}/>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <Grid style={{margin:'0', height: '100vh'}}>
            <Grid.Row style={{height: '80px', background: '#F98F69', padding:'0'}}>
              <Button size='huge' style={{background: '#F98F69'}}>
                <Dropdown icon='sidebar' style={{color:'black'}}>
                  <Dropdown.Menu style={{background: '#F98F69' }}>
                    <Dropdown.Item style={{ cursor: 'pointer' }}>
                      <Header as='h3'>
                        <Icon name='home'/>
                        HOME
                      </Header>
                    </Dropdown.Item>
                    <Dropdown.Item style={{ cursor: 'pointer' }} onClick={this.teamRoute}>
                      <Header as='h3'>
                        <Icon name='users'/>
                        MEET THE TEAM
                      </Header>
                    </Dropdown.Item>
                    <Dropdown.Item style={{ cursor: 'pointer' }} onClick={this.aboutRoute}>
                      <Header as='h3'>
                        <Icon name='coffee'/>
                        ABOUT COFFEE CLUB
                      </Header>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Button>
            </Grid.Row>
            <Grid.Row style={{padding:'0', height:'90%', textAlign:'center'}}>
              <Grid.Column>
                <Grid.Row style={{height:'10%'}}></Grid.Row>
                <Grid.Row style={{height:'10%'}}>
                  <Image centered src={logo} size='tiny'/>
                </Grid.Row>
                <Grid.Row style={{height:'15%'}}></Grid.Row>
                <Grid.Row style={{height:'25%'}}>
                  <h1 style={{textAlign:'center', fontSize: '35px', fontFamily:'Didot'}}>
                    Fair Trade.<br/>
                    Student Owned.<br/>
                    Coffee Club.
                  </h1>
                </Grid.Row>
                <Grid.Row style={{height:'15%'}}></Grid.Row>
                <Grid.Row style={{height:'15%'}}>
                  <Button circular basic color='black' size='huge' style={{textAlign: "center"}} onClick={this.route}>
                    <strong>ORDER NOW</strong>
                  </Button>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Responsive>
      </React.Fragment>
    );
  }
}

export default LandingPage;
