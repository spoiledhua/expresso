import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar, Button, Grid, Responsive, Dropdown, Container } from 'semantic-ui-react'
import * as victor from '../Assets/victor.jpg';
import * as karen  from '../Assets/karen.jpg';
import * as dora from '../Assets/dora.jpg';
import * as hari from '../Assets/hari.jpg';
import * as joseph from '../Assets/joseph.jpg';
import * as logo from '../Assets/logo.png';

const Profile = ({ image, name, major, role }) => {
	return (
		<Grid.Column width='2' style={{textAlign:'center'}}>
      <Grid.Row>
          <Image src={image} circular size='medium' style={{padding:'10px'}}/>
      </Grid.Row>
      <Grid.Row centered style={{margin:'0'}}>
        <h2 style={{margin: '0'}}><strong>{name}</strong></h2>
        <h3 style={{margin: '0'}}>{major}</h3>
        <h3 style={{margin: '0', fontStyle:'italic'}}>{role}</h3>
      </Grid.Row>
    </Grid.Column>
	);
}

const MobileProfile = ({ image, name, major, role }) => {
	return (
        <Grid.Row>
            <Grid.Column>
                <Image src={image} circular size='medium' style={{padding:'10px'}}/>
            </Grid.Column>
            <Grid.Column verticalAlign='middle' style={{textAlign:'center'}}>
                <h2 style={{margin: '0'}}><strong>{name}</strong></h2>
                <h3 style={{margin: '0'}}>{major}</h3>
                <h3 style={{margin: '0', fontStyle:'italic'}}>{role}</h3>
            </Grid.Column>
        </Grid.Row>
    );
}

class AboutTeam extends React.Component {
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
              style={{background: '#F98F69'}}
            >
              <Menu.Item as='a' onClick={this.landingRoute} style={{background: '#F98F69', textAlign: 'center'}}>
                <Header as='h3' style={{textAlign:'left'}}>
                  <Icon name='home'/>
                  Home
                </Header>
              </Menu.Item>
              <Menu.Item as='a' style={{background: '#F98F69'}}>
                <Header as='h3' style={{textAlign:'left'}}>
                  <Icon name='users'/>
                  Meet the Team
                </Header>
              </Menu.Item>
              <Menu.Item as='a' onClick={this.aboutRoute} style={{background: '#F98F69'}}>
                <Header as='h3' style={{textAlign:'left'}}>
                  <Icon name='coffee'/>
                  About Coffee Club
                </Header>
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher
              dimmed={this.state.visible}
              onClick={this.handlePusher}
            >
							<Grid verticalAlign='middle' style={{ 'marginBottom': '10vh' }}>
								<Grid.Row verticalAlign='middle' style={{height: '80px', background: '#F98F69', padding:'0'}}>
									<Grid.Column width={1} style={{textAlign: "center"}}>
										<Button onClick={this.setVisible} circular icon='sidebar' size='huge' style={{background: '#F98F69'}}>
										</Button>
									</Grid.Column>
									<Grid.Column width={6}></Grid.Column>
									<Grid.Column width={2}>
										<Image centered src={logo} size='mini' onClick={this.landingRoute} style={{ cursor: 'pointer'}}/>
									</Grid.Column>
									<Grid.Column width={5}></Grid.Column>
								</Grid.Row>
								<Grid.Row />
								<Grid.Row />
								<Grid.Row />
								<Grid.Row centered>
									<h1>The Team</h1>
								</Grid.Row>
								<Grid.Row />
								<Grid.Row centered>
									<Profile image={victor} name={'Victor Hua'} major={"COS '21"} role={'Frontend'}/>
									<Profile image={joseph} name={'Joseph Kim'} major={"COS '21"} role={'Backend'}/>
									<Profile image={hari} name={'Hari Raval'} major={"COS '21"} role={'Backend'}/>
									<Profile image={karen} name={'Karen Ying'} major={"COS '21"} role={'Frontend'}/>
									<Profile image={dora} name={'Dora Zhao'} major={"COS '21"} role={'Team Lead'}/>
								</Grid.Row>
								<Grid.Row />
								<Grid.Row />
								<Grid.Row>
									<Grid.Column>
										<center>
											<h1>About</h1>
											<br />
											<Container style={{ 'width': '720px' }}>
												<p style={{ 'fontSize': '20px' }}>
													<em>Expresso</em> is a web application developed and designed for <em>COS 333: Advanced Programming Techniques</em>during the Fall '19 semester for The Coffee Club.
												</p>
											</Container>
										</center>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row />
								<Grid.Row />
								<Grid.Row centered>
									<Grid.Column>
										<center>
											<h1>Acknowledgments</h1>
											<br />
											<u><h2>Dr. Robert Dondero</h2></u>
											<br />
											<p style={{ 'fontSize': '20px' }}>COS 333 Lead Instructor</p>
											<br />
											<u><h2>Jace Lu</h2></u>
											<br />
											<p style={{ 'fontSize': '20px' }}>Fall 19-20 COS 333 TA Advisor</p>
											<br />
											<u><h2>Greg Blaha</h2></u>
											<br />
											<p style={{ 'fontSize': '20px' }}>ODUS IT Manager</p>
											<br />
											<u><h2>Dean Fisher</h2></u>
											<br />
											<p style={{ 'fontSize': '20px' }}>Director of Student Agencies</p>
										</center>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row />
								<Grid.Row />
								<Grid.Row centered>
									<Grid.Column>
										<center>
											<h1>Note from the Developers</h1>
											<br />
											<Container style={{ 'width': '720px' }}>
												<p style={{ 'fontSize': '20px' }}>
													<em>Expresso</em> was designed to be a user-friendly and helpful web application to
													change the way students order their food and beverage from Coffee Club.
													With the goal of making the ordering process as simple and smooth as
													possible, we hope that <em>Expresso</em> brings even a little bit of convenience to
													the busy lives of students!
													<br />
													<br />
													Cheers,
													<br />
													Victor, Joseph, Hari, Karen, Dora
												</p>
											</Container>
										</center>
									</Grid.Column>
								</Grid.Row>
							</Grid>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
					<Grid style={{ 'marginBottom': '10vh' }} columns='equal'>
						<Grid.Row style={{height: '80px', background: '#F98F69', padding:'0'}}>
							<Button size='huge' style={{background: '#F98F69'}}>
								<Dropdown icon='sidebar' style={{color:'black'}}>
									<Dropdown.Menu style={{ background: '#F98F69' }}>
										<Dropdown.Item style={{ cursor: 'pointer' }} onClick={this.landingRoute}>
											<Header as='h3'>
												<Icon name='home'/>
												Home
											</Header>
										</Dropdown.Item>
										<Dropdown.Item style={{ cursor: 'pointer' }} >
											<Header as='h3'>
												<Icon name='users'/>
												Meet the Team
											</Header>
										</Dropdown.Item>
										<Dropdown.Item style={{ cursor: 'pointer' }} onClick={this.aboutRoute}>
											<Header as='h3'>
												<Icon name='coffee'/>
												About Coffee Club
											</Header>
										</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</Button>
						</Grid.Row>
						<Grid.Row />
						<Grid.Row />
						<Grid.Row centered>
							<h1>The Team</h1>
						</Grid.Row>
						<MobileProfile image={victor} name={'Victor Hua'} major={"COS '21"} role={'Frontend'}/>
						<MobileProfile image={joseph} name={'Joseph Kim'} major={"COS '21"} role={'Backend'}/>
						<MobileProfile image={hari} name={'Hari Raval'} major={"COS '21"} role={'Backend'}/>
						<MobileProfile image={karen} name={'Karen Ying'} major={"COS '21"} role={'Frontend'}/>
						<MobileProfile image={dora} name={'Dora Zhao'} major={"COS '21"} role={'Team Lead'}/>
						<Grid.Row />
						<Grid.Row />
						<Grid.Row centered>
							<Grid.Column>
								<center>
									<h1>About</h1>
									<br />
									<Container style={{ 'width': '720px' }}>
										<p style={{ 'fontSize': '20px' }}>
											<em>Expresso</em> is a web application developed and designed for <em>COS 333: Advanced Programming Techniques</em>during the Fall '19 semester for The Coffee Club.
										</p>
									</Container>
								</center>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row />
						<Grid.Row />
						<Grid.Row centered>
							<Grid.Column>
								<center>
									<h1>Acknowledgments</h1>
									<br />
									<u><h2>Dr. Robert Dondero</h2></u>
									<br />
									<p style={{ 'fontSize': '20px' }}>COS 333 Lead Instructor</p>
									<br />
									<u><h2>Jace Lu</h2></u>
									<br />
									<p style={{ 'fontSize': '20px' }}>Fall 19-20 COS 333 TA Advisor</p>
									<br />
									<u><h2>Greg Blaha</h2></u>
									<br />
									<p style={{ 'fontSize': '20px' }}>ODUS IT Manager</p>
									<br />
									<u><h2>Dean Fisher</h2></u>
									<br />
									<p style={{ 'fontSize': '20px' }}>Director of Student Agencies</p>
								</center>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row />
						<Grid.Row />
						<Grid.Row centered>
							<Grid.Column>
								<center>
									<h1>Note from the Developers</h1>
									<br />
									<Container style={{ 'width': '720px' }}>
										<p style={{ 'fontSize': '20px' }}>
											<em>Expresso</em> was designed to be a user-friendly and helpful web application to
											change the way students order their food and beverage from Coffee Club.
											With the goal of making the ordering process as simple and smooth as
											possible, we hope that <em>Expresso</em> brings even a little bit of convenience to
											the busy lives of students!
											<br />
											<br />
											Cheers,
											<br />
											Victor, Joseph, Hari, Karen, Dora
										</p>
									</Container>
								</center>
							</Grid.Column>
						</Grid.Row>
					</Grid>
        </Responsive>
      </React.Fragment>
    );
  }
}

export default AboutTeam;
