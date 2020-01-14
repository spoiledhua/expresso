import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Grid, Image } from 'semantic-ui-react';

import * as logo from '../Assets/logo.png';

const NotFound = () => (
  <React.Fragment>
    <div style={{ 'height': '32vh' }} />
    <Grid textAlign='center'>
      <Grid.Row>
        <Image centered={true} src={logo} size='small'/>
      </Grid.Row>
      <Grid.Row>
        <Header as='h1' style={{fontSize: '200%', fontFamily:'Didot', marginTop:'0vh'}}>
          Sorry, the page you're looking for cannot be found.
        </Header>
      </Grid.Row>
      <Grid.Row>
        <Link to="/" style={{fontSize: '150%', fontFamily:'Didot', marginTop:'0vh'}}>Return to landing page</Link>
      </Grid.Row>
    </Grid>
  </React.Fragment>
);

export default NotFound;
