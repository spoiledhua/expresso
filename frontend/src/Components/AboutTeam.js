import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar, Grid, Responsive, Container } from 'semantic-ui-react'
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
		window.open('https://pucoffeeclub.com');
	}

	locationRoute = () => {
		this.props.history.push('/location');
	}

	baristaRoute = () => {
		this.props.history.push('/baristalogin');
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
							<Menu.Item as='a' onClick={this.landingRoute} style={{background: '#EDAC86', textAlign: 'center'}}>
								<Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
									<span>01.&nbsp;&nbsp;&nbsp;&nbsp;Home</span>
								</Header>
							</Menu.Item>
							<Menu.Item as='a' style={{background: '#EDAC86'}}>
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
							<Grid verticalAlign='middle' style={{ 'marginBottom': '10vh' }}>
								<Grid.Row verticalAlign='middle' style={{height: '7vh', background: '#BEB19B', padding:'0'}}>
									<Menu inverted fixed="top" fluid widths='6' secondary style={{ height: '7vh', background: '#BEB19B' }}>
										<Menu.Item position='left' style={{width:'5%'}}>
											<Icon name='sidebar' size ='large' onClick={this.setVisible} style={{color:'black', background: 'none', cursor: 'pointer'}} />
										</Menu.Item>
									</Menu>
								</Grid.Row>
								<Grid.Row />
								<Grid.Row />
								<Grid.Row />
								<Grid.Row centered>
									<span><h1 style={{fontFamily:'Didot', fontStyle:'italic'}}>The Team</h1></span>
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
											<h2 style={{fontFamily:'Avenir'}}>About</h2>
											<br />
											<Container style={{ 'width': '720px' }}>
												<p style={{fontSize:'18px',fontStyle:'Avenir'}}>
													<em>Expresso</em> is a web application developed and designed for <em>COS 333: Advanced Programming Techniques</em> during the Fall '19 semester for The Coffee Club.
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
											<h2 style={{fontStyle:'Avenir'}}>Acknowledgments</h2>
											<br />
											<u><h2>Dr. Robert Dondero</h2></u>
											<br />
											<p style={{fontSize:'18px', fontStyle:'Avenir'}}>COS 333 Lead Instructor</p>
											<br />
											<u><h2>Jace Lu</h2></u>
											<br />
											<p style={{fontSize:'18px', fontStyle:'Avenir'}}>Fall 19-20 COS 333 TA Advisor</p>
											<br />
											<u><h2>Greg Blaha</h2></u>
											<br />
											<p style={{fontSize:'18px', fontStyle:'Avenir'}}>ODUS IT Manager</p>
											<br />
											<u><h2>Dean Fisher</h2></u>
											<br />
											<p style={{fontSize:'18px', fontStyle:'Avenir'}}>Director of Student Agencies</p>
											<br />
											<u><h2>Suzanne Bellan</h2></u>
											<br />
											<p style={{fontSize:'18px', fontStyle:'Avenir'}}>Princeton Office of Finance and Treasury</p>
											<br />
											<u><h2>Emma M. Marshall</h2></u>
											<br />
											<p style={{fontSize:'18px', fontStyle:'Avenir'}}>Princeton Tiger Card Services</p>
											<br />
											<u><h2>Maria L. Bizzarri</h2></u>
											<br />
											<p style={{fontSize:'18px', fontStyle:'Avenir'}}>Princeton's Bursar</p>
										</center>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row />
								<Grid.Row />
								<Grid.Row centered>
									<Grid.Column>
										<center>
											<h2 style={{fontStyle:'Avenir'}}>Note from the Developers</h2>
											<br />
											<Container style={{ 'width': '720px' }}>
												<p style={{fontSize:'18px',fontStyle:'Avenir'}}>
													<em>Expresso</em> was designed to be a user-friendly and helpful web application to
													change the way students order their food and beverage from The Coffee Club.
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
						<Menu.Item as='a' onClick={this.landingRoute} style={{background: '#EDAC86', textAlign: 'center'}}>
							<Header as='h2' style={{paddingLeft:'5%',color:'black', textAlign:'left', fontFamily:'Didot', fontStyle:'italic'}}>
								<span>01.&nbsp;&nbsp;&nbsp;&nbsp;Home</span>
							</Header>
						</Menu.Item>
						<Menu.Item as='a' style={{background: '#EDAC86'}}>
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
					<Grid style={{ 'marginBottom': '10vh' }} columns='equal'>
						<Grid.Row>
							<Menu inverted fixed="top" fluid widths='6' secondary style={{ height: '7vh', background: '#BEB19B' }}>
								<Menu.Item position='left' style={{width:'15%'}}>
									<Icon name='sidebar' size ='large' onClick={this.setVisible} style={{color:'black', background: 'none', cursor: 'pointer'}} />
								</Menu.Item>
							</Menu>
						</Grid.Row>
						<Grid.Row />
						<Grid.Row />
						<Grid.Row centered>
							<span><h1 style={{fontFamily:'Didot', fontStyle:'italic'}}>The Team</h1></span>
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
									<h2 style={{fontFamily:'Avenir'}}>About</h2>
									<br />
									<Container style={{ 'width': '720px' }}>
										<p style={{fontSize:'18px',fontStyle:'Avenir'}}>
											<em>Expresso</em> is a web application developed and designed for <em>COS 333: Advanced Programming Techniques</em> during the Fall '19 semester for The Coffee Club.
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
									<h2 style={{fontStyle:'Avenir'}}>Acknowledgments</h2>
									<br />
									<u><h2>Dr. Robert Dondero</h2></u>
									<br />
									<p style={{fontSize:'18px', fontStyle:'Avenir'}}>COS 333 Lead Instructor</p>
									<br />
									<u><h2>Jace Lu</h2></u>
									<br />
									<p style={{fontSize:'18px', fontStyle:'Avenir'}}>Fall 19-20 COS 333 TA Advisor</p>
									<br />
									<u><h2>Greg Blaha</h2></u>
									<br />
									<p style={{fontSize:'18px', fontStyle:'Avenir'}}>ODUS IT Manager</p>
									<br />
									<u><h2>Dean Fisher</h2></u>
									<br />
									<p style={{fontSize:'18px', fontStyle:'Avenir'}}>Director of Student Agencies</p>
									<br />
									<u><h2>Suzanne Bellan</h2></u>
									<br />
									<p style={{fontSize:'18px', fontStyle:'Avenir'}}>Princeton Office of Finance and Treasury</p>
									<br />
									<u><h2>Emma M. Marshall</h2></u>
									<br />
									<p style={{fontSize:'18px', fontStyle:'Avenir'}}>Princeton Tiger Card Services</p>
									<br />
									<u><h2>Maria L. Bizzarri</h2></u>
									<br />
									<p style={{fontSize:'18px', fontStyle:'Avenir'}}>Princeton's Bursar</p>
								</center>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row />
						<Grid.Row />
						<Grid.Row centered>
							<Grid.Column>
								<center>
									<h2 style={{fontStyle:'Avenir'}}>Note from the Developers</h2>
									<br />
									<Container style={{ 'width': '720px' }}>
										<p style={{fontSize:'18px',fontStyle:'Avenir'}}>
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
