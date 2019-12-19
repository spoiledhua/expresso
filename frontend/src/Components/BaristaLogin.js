import React from 'react';
import { Header, Grid, Button, Segment, Form, Dimmer, Loader } from 'semantic-ui-react';
import { baristaLogin } from '../Axios/axios_getter';

class BaristaLogin extends React.Component {

  state = {
    username: '',
    password: '',
    invalid: null,
    loading: false
  }

  handleUsername = (e) => {
    this.setState({ username: e.target.value });
  }

  handlePassword = (e) => {
    this.setState({ password: e.target.value });
  }

  handleLogin = async () => {
    await this.setState({ loading: true });
    const user = { username: this.state.username, password: this.state.password };
    await baristaLogin(user)
      .then(data => {
        console.log(data)
        this.setState({ invalid: null });
        let url = (typeof this.props.history.location.state === "undefined") ? '/baristaorders' : this.props.history.location.state.requested
        this.props.history.push(url);
      })
      .catch(error => {
        console.log(error)
        this.setState({ invalid: 'Invalid login' });
      });
    await this.setState({ loading: false });
  }

  render() {

    return (
      <React.Fragment>
        <Dimmer active={this.state.loading} page inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        {/* Main Content */}
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' style={{color:'black', textAlign:'center', fontFamily:'Didot', fontStyle:'italic'}}>
              Barista Login
            </Header>
            <Form size='large'>
              <Segment stacked>
                <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' value={this.state.username} onChange={this.handleUsername}/>
                <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' value={this.state.password} onChange={this.handlePassword} type='password' />
                <Button onClick = {this.handleLogin} color='black' style={{background: '#EDAC86', fontFamily:'Avenir'}} fluid size='medium'>
                  Login
                </Button>
              </Segment>
            </Form>
            <Header as='h4' color='black' textAlign='center' fontFamily='Avenir'>
              {this.state.invalid}
            </Header>
          </Grid.Column>
        </Grid>
      </React.Fragment>

    );
  }
}

export default BaristaLogin;
