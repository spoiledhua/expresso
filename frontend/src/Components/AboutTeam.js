import React from 'react';
import * as victor from '../Assets/victor.jpg';
import * as karen  from '../Assets/karen.jpg';
import * as dora from '../Assets/dora.jpg';
import * as hari from '../Assets/hari.jpg';
import * as joseph from '../Assets/joseph.jpg';
import * as logo from '../Assets/logo.png';

import { Grid, Image, Icon, Button} from 'semantic-ui-react';

const Profile = ({ image, name, major, role }) => {
	return (
		<Grid verticalAlign='middle' style={{marginLeft:'12px', marginRight:'12px'}}>
            <Grid.Row>
                <Image src={image} circular size='medium'/>
            </Grid.Row>
            <Grid.Row centered>
                <h2 style={{margin: '0'}}><strong>{name}</strong></h2><br/>
                <h3 style={{margin: '0'}}>{major}</h3><br/>
                <h3 style={{margin: '0', fontStyle:'italic'}}>{role}</h3>
            </Grid.Row>
        </Grid>
	);
}

class AboutTeam extends React.Component {
    render () {
        return (
            <React.Fragment>
                <Grid verticalAlign='middle' style={{height: '100vh', margin:'0'}}>
                    <Grid.Row style={{height: '80px', background: '#F98F69', padding:'0px'}}>
                        <Grid.Column width={1} style={{textAlign: "center"}}>
                            <Icon size='big' name='sidebar'/>
                        </Grid.Column>
                        <Grid.Column width={6}></Grid.Column>
                        <Grid.Column width={2}>
                            <Image centered src={logo} size='mini'/>
                        </Grid.Column>
                        <Grid.Column width={5}></Grid.Column>
                        <Grid.Column width={2}>
                            <Button circular basic color='black'>
                                <strong>BARISTA LOGIN</strong>
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{padding:'0px'}}>
                        <Grid.Column width={2}></Grid.Column>
                        <Grid.Column width={14}>
                            <h1 style={{fontFamily:'Didot'}}>The Team</h1>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row centered>
                        <Grid.Column width={2}>
                            <Profile image={victor} name={'Victor Hua'} major={"COS '21"} role={'Frontend'}/>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Profile image={joseph} name={'Joseph Kim'} major={"COS '21"} role={'Backend'}/>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Profile image={hari} name={'Hari Raval'} major={"COS '21"} role={'Backend'}/>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Profile image={karen} name={'Karen Ying'} major={"COS '21"} role={'Frontend'}/>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Profile image={dora} name={'Dora Zhao'} major={"COS '21"} role={'Team Lead'}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={2}></Grid.Column>
                        <Grid.Column width={14}>
                            <h2 style={{fontFamily:'Didot'}}>Acknowledgements</h2>
                            <p>Expresso was designed and developed for <em>COS 333: Advanced Programming Techniques</em> during the Fall '19 semester for The Coffee Club.<br/>
                            Thanks to COS 333 course head Professor Dondero, Director of Student Agencies Dean Fisher, and IT Manager Greg Blaha. Also special thanks to our project advisor Jace Luo.
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </React.Fragment>
        );
    }
}

export default AboutTeam