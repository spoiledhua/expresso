import React from 'react'
import { Segment, Grid, Header, Form, Button, Sidebar } from 'semantic-ui-react'

import ClientHeader from './ClientHeader';

import { contact } from '../Axios/axios_getter';

class ContactUs extends React.Component {

  state = {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    error: null,
    shoppingCart: [],
    transition: false
  }

  componentDidMount = () => {
    if (JSON.parse(localStorage.getItem('shoppingCart')) !== null) {
      this.setState({ shoppingCart: JSON.parse(localStorage.getItem('shoppingCart'))});
    }
  }

  toggleOn = () => {
    this.setState({ transition: true });
    this.timeout = setTimeout(() => {this.setState({ transition: false })}, 3000);
  }

  handleFirstNameChange = (e) => {
    e.persist()
    this.setState({ firstName: e.target.value });
  }

  handleLastNameChange = (e) => {
    e.persist()
    this.setState({ lastName: e.target.value });
  }

  handleEmailChange = (e) => {
    e.persist()
    this.setState({ email: e.target.value });
  }

  handleMessageChange = (e) => {
    e.persist()
    this.setState({ message: e.target.value });
  }

  submitMessage = () => {
    if ((this.state.firstName === '' || this.state.lastName === '') || (this.state.email === '' || this.state.message === '')) {
      this.setState({ error: 'Please fill out all fields' });
    }
    else {
      this.setState({ error: null });
      const submission = { firstname: this.state.firstName, lastname: this.state.lastName, email: this.state.email, message: this.state.message };
      contact(submission)
        .then(data => {
          this.setState({ error: data.error });
          if (data.error === null) {
            this.toggleOn();
          }
        });
    }

  }

 render() {

   return (
     <React.Fragment>
       <Sidebar as={Header} direction='top' width='very wide' visible={this.state.transition} animation='overlay' style={{ 'zIndex': '1' }}>
         <div style={{ height: '5vh' }} />
         <Segment raised textAlign='center' style={{color: 'white', fontFamily:'Avenir', background: '#EDAC86'}}>
           Your message has been sent!
         </Segment>
       </Sidebar>
       <ClientHeader history={this.props.history} shoppingCart={this.state.shoppingCart}/>
       <div style={{ height: '12vh' }} />
       <Grid textAlign='center' style={{ height: '100vh', marginTop:'-10%'}} verticalAlign='middle'>
         <Grid.Column style={{ maxWidth: 800, backgroundColor:'white'}}>
           <Segment raised style = {{padding: '5%'}}>
             <Header as='h1' style = {{fontFamily:'Didot', fontStyle:'italic', textAlign:'center', marginBottom:'5%'}}>
               Contact Us
             </Header>
             <Form>
               <Form.Group widths='equal'>
                 <Form.Field>
                   <label style={{textAlign:'left'}}>* First Name</label>
                   <input onChange={this.handleFirstNameChange} value={this.state.firstName} style = {{borderRadius:'100px'}} placeholder='First Name' />
                 </Form.Field>
                 <Form.Field>
                   <label style={{textAlign:'left'}}>* Last Name</label>
                   <input onChange={this.handleLastNameChange} value={this.state.lastName} style = {{borderRadius:'100px'}} placeholder='Last Name' />
                 </Form.Field>
               </Form.Group>
               <Form.Field>
                 <label style={{textAlign:'left'}}>* Email </label>
                 <input onChange={this.handleEmailChange} value={this.state.email} style = {{borderRadius:'100px'}} placeholder='Email' />
               </Form.Field>
               <Form.Field style={{textAlign:'left', marginBottom:'1%'}}>
                 <Form.TextArea onChange={this.handleMessageChange} value={this.state.message} style = {{borderRadius:'10px'}} label ='* Message' placeholder='Message' />
               </Form.Field>
               <br />
               <br />
               <Button fluid circular type='submit' onClick={this.submitMessage} style = {{backgroundColor:'#EDAC86', fontFamily:'Avenir', color:'white'}}>Send</Button>
             </Form>
           </Segment>
           <Header as='h3' color='black' textAlign='center'>
             {this.state.error}
           </Header>
          </Grid.Column>
        </Grid>
    </React.Fragment>
  );
 }
}

export default ContactUs;
