import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar, Button, Grid } from 'semantic-ui-react'
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
  }

  setVisible() {
    const { visible } = this.state;
    const change = !visible
    this.setState({ visible: change });
  }

  handlePusher() {
    const { visible } = this.state;
    if (visible) this.setState({ visible: false });

  };

  render() {
    return (
      <React.Fragment>
        <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          animation='overlay'
          icon='labeled'
          vertical
          visible={this.state.visible}
          width='wide'
          style={{background: '#F98F69'}}
        >
          <Menu.Item as='a' style={{background: '#F98F69', textAlign: 'center'}}>
            <Header as='h4'>
              <Icon name='home'/>
              HOME
            </Header>
          </Menu.Item>
          <Menu.Item as='a' style={{background: '#F98F69'}}>
            <Header as='h4'>
              <Icon name='users'/>
              MEET THE TEAM
            </Header>
          </Menu.Item>
          <Menu.Item as='a' style={{background: '#F98F69'}}>
            <Header as='h4'>
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
                            <Button circular basic color='black'>
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
                                    Fair Trade.<br/>
                                    Student Owned.<br/>

                                    Coffee Club.
                                </h1>
                            </Grid.Row>
                            <Grid.Row style={{height: '25%', textAlign:'center'}}>
                                <Button circular basic color='black' size='huge' style={{textAlign: "center"}}>
                                    <strong>ORDER NOW</strong>
                                </Button>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column stretched style={{padding:'0'}} centered>
                            <Image src={animation}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </React.Fragment>
    );
  }
}

export default LandingPage;

