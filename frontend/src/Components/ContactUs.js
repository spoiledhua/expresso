import React from 'react'
import { Segment, Grid, Header, Form, Button, Responsive } from 'semantic-ui-react'

class ContactUs extends React.Component {

 render() {

   return (
     <React.Fragment>
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
                  <input style = {{borderRadius:'100px'}} placeholder='First Name' />
                </Form.Field>
                <Form.Field>
                  <label style={{textAlign:'left'}}>* Last Name</label>
                  <input style = {{borderRadius:'100px'}} placeholder='Last Name' />
                </Form.Field>
              </Form.Group>
              <Form.Field>
                <label style={{textAlign:'left'}}>* Email </label>
                <input style = {{borderRadius:'100px'}} placeholder='Email' />
              </Form.Field>
              <Form style={{textAlign:'left', marginBottom:'1%'}}>
                <Form.TextArea style = {{borderRadius:'10px'}} label ='* Message' placeholder='Message' />
              </Form>
              <br />
              <br />
              <Button fluid circular type='submit'
                style = {{backgroundColor:'#EDAC86', fontFamily:'Avenir', color:'white'}}>Send</Button>
            </Form>
            </Segment>
          </Grid.Column>
        </Grid>
    </React.Fragment>
  );
 }
}
export default ContactUs;
