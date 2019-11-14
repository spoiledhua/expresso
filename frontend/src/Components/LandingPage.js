import React from 'react';
import * as animation from '../Assets/animation.jpg';
import * as logo from '../Assets/logo.png';
import {Grid, Image, Icon, Button} from 'semantic-ui-react';

class LandingPage extends React.Component {
    render () {
		return (
            <React.Fragment>
                <Grid columns='equal' style={{height: '100vh'}}>
                    <Grid.Row verticalAlign='middle' style={{height: '91px', background: '#F98F69', padding:'0'}}>
                        <Grid.Column width={1} style={{textAlign: "center"}}>
                            <Icon size='big' name='sidebar'/>
                        </Grid.Column>
                        <Grid.Column width={13}></Grid.Column>
                        <Grid.Column width={2}>
                            <Button circular basic color='black'>
                                <strong>Barista Login</strong>
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{padding:'0', height:'90%'}}>
                        <Grid.Column stretched style={{ padding:'0'}}>
                            <Grid.Row style={{height: '5%'}}></Grid.Row>
                            <Grid.Row style={{height: '15%'}}>
                                <Image centered src={logo} size='tiny'/>
                            </Grid.Row>
                            <Grid.Row style={{height: '5%'}}></Grid.Row>
                            <Grid.Row style={{height: '40%'}}>
                                <h1 style={{textAlign:'center', fontSize: '55px'}}>
                                    Fair Trade.<br/> 
                                    Student Owned.<br/> 
                                    Coffee Club.
                                </h1>
                            </Grid.Row>
                            <Grid.Row style={{height: '25%', textAlign:'center'}}>
                                <Button circular basic color='black' size='huge' style={{textAlign: "center"}}>
                                    <strong>Order Now</strong>
                                </Button>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column stretched style={{padding:'0'}}>
                            
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </React.Fragment>
        );
    }
}

export default LandingPage