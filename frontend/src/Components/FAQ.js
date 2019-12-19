import React from 'react'
import { Header, Grid, Accordion, Icon, Divider, Responsive, Image } from 'semantic-ui-react'
import * as mug from '../Assets/coffee-line.png';
import * as faq from '../Assets/FAQ.png';

class FAQ extends React.Component {
 state = { activeIndex: 0 }

 handleClick = (e, titleProps) => {
   const { index } = titleProps
   const { activeIndex } = this.state
   const newIndex = activeIndex === index ? -1 : index

   this.setState({ activeIndex: newIndex })
 }

 render() {
   const { activeIndex } = this.state

   return (
     <React.Fragment>
     <Responsive minWidth={Responsive.onlyTablet.minWidth}>
       <Grid style={{marginTop:'-10%'}}>
          <Grid.Row style={{height: '90%'}}></Grid.Row>
          <Grid.Row style={{height: '90%'}}></Grid.Row>
          <Grid.Column width = {7}>
            <Grid.Row style={{height: '100px'}}></Grid.Row>
            <Grid.Row>
              <h5 style = {{paddingLeft:'30%', 'color':'#BC7E75',fontFamily:'Avenir', fontStyle: 'bold'}}> GOT QUESTIONS? </h5>
              <Header as='h2' style = {{paddingLeft:'30%', paddingRight:'10%', fontFamily:'Didot'}}>
                Don't worry because we <p></p>have answers.
              </Header>
            </Grid.Row>
            <Grid.Row style = {{paddingLeft:'20%',height:'80%'}}>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width = {6} padded style = {{paddingTop:'7%'}}>
            <Header as = 'h1' style={{fontFamily:'Didot', fontStyle:'italic'}}>
              Frequently Asked Questions
            </Header>
            <p style={{fontFamily:'Avenir'}}>
              Hey, we see you have some questions! If the answer isn't here, feel
              free to contact us using our Contact Us page or at our email
              coffeeclub@princeton.edu.
            </p>
            <br></br><br></br>
            <Accordion>
              <Accordion.Title
                  active={activeIndex === 0}
                  index={0}
                  onClick={this.handleClick}>
              <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
              <span style={{fontFamily:'Avenir'}}> What is the Coffee Club? </span>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <p style={{paddingLeft:'10%', fontFamily:'Avenir'}}>
                The Coffee Club is a student-run coffee shop on Princeton’s campus.
                It was founded in 2018 by Alex Kaplan ’21 and continues to be managed
                and staffed by Princeton students.
                </p>
              </Accordion.Content>
            <Divider> </Divider>
            <Accordion.Title
                active={activeIndex === 1}
                index={1}
                onClick={this.handleClick}>
            <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
            <span style={{fontFamily:'Avenir'}}>What is student charge?</span>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 1}>
              <p style={{paddingLeft:'10%', fontFamily:'Avenir'}}>
                Lorem ipsum dolor
              </p>
            </Accordion.Content>
            <Divider> </Divider>
            <Accordion.Title
                active={activeIndex === 2}
                index={2}
                onClick={this.handleClick}>
            <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
            <span style={{fontFamily:'Avenir'}}>Why should I order from Coffee Club?</span>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 2}>
             <p style={{paddingLeft:'10%', fontFamily:'Avenir'}}>
                Three common ways for a prospective owner to acquire a dog is from
                pet shops, private owners, or shelters.
            </p>
            </Accordion.Content>
            <Divider> </Divider>
            <Accordion.Title
                active={activeIndex === 3}
                index={3}
                onClick={this.handleClick}>
            <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
            <span style={{fontFamily:'Avenir'}}> Who is eligible for student charge?</span>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 3}>
            <p style={{paddingLeft:'10%', fontFamily:'Avenir'}}>
                Student charge is only eligible for undergraduate students at the University.
                Seniors will no longer be able to student charge after April 20th of their graduation year
                (e.g. the Class of 2021 can no longer use student charge after 4/20/21)
            </p>
            </Accordion.Content>
            <Divider> </Divider>
            <Accordion.Title
                active={activeIndex === 4}
                index={4}
                onClick={this.handleClick}>
            <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
            <span style={{fontFamily:'Avenir'}}> How will I know my order went through?</span>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 4}>
            <p style={{paddingLeft:'10%', fontFamily:'Avenir'}}>
                You will receive a confirmation email to your Princeton email
                with the items you ordered and the total cost.
                When your order is ready to pick up, you will receive another email.
            </p>
            </Accordion.Content>
            <Divider> </Divider>
            <Accordion.Title
                active={activeIndex === 4}
                index={4}
                onClick={this.handleClick}>
            <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
            <span style={{fontFamily:'Avenir'}}> How will I know my order went through?</span>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 4}>
            <p style={{paddingLeft:'10%', fontFamily:'Avenir'}}>
                You will receive a confirmation email to your Princeton email
                with the items you ordered and the total cost.
                When your order is ready to pick up, you will receive another email.
            </p>
            </Accordion.Content>
            <Divider> </Divider>
            <Accordion.Title
                active={activeIndex === 4}
                index={4}
                onClick={this.handleClick}>
              <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
            <span style={{fontFamily:'Avenir'}}> How will I know my order went through?</span>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 4}>
            <p style={{paddingLeft:'10%'}}>
                You will receive a confirmation email to your Princeton email
                with the items you ordered and the total cost.
                When your order is ready to pick up, you will receive another email.
            </p>
            </Accordion.Content>
            <Divider> </Divider>
            <Accordion.Title
                active={activeIndex === 4}
                index={4}
                onClick={this.handleClick}>
              <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
            <span style={{fontFamily:'Avenir'}}> How will I know my order went through? </span>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 4}>
            <p style={{paddingLeft:'10%', fontFamily:'Avenir'}}>
                You will receive a confirmation email to your Princeton email
                with the items you ordered and the total cost.
                When your order is ready to pick up, you will receive another email.
            </p>
            </Accordion.Content>
          </Accordion>
          </Grid.Column>
          <Grid.Row></Grid.Row>
          <Grid.Row></Grid.Row>
          <Grid.Row></Grid.Row>
          <Grid.Row></Grid.Row>
          <Grid.Row></Grid.Row>
          <Grid.Row></Grid.Row>
     </Grid>
     </Responsive>
     <Responsive {...Responsive.onlyMobile}>
      <Grid style={{backgroundColor: '#F5F5F5'}}>>
     <Grid.Column padded style = {{paddingTop:'10%', paddingLeft:'10%', paddingRight:'10%'}}>
       <h1 style = {{fontFamily:'Didot', fontStyle:'italic', textAlign:'center'}}> Frequently Asked Questions </h1>
       <br></br><br></br>
       <Accordion>
         <Accordion.Title
             active={activeIndex === 0}
             index={0}
             onClick={this.handleClick}>
         <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
         What is the Coffee Club?
         </Accordion.Title>
         <Accordion.Content active={activeIndex === 0}>
           <p style={{paddingLeft:'10%'}}>
           The Coffee Club is a student-run coffee shop on Princeton’s campus.
           It was founded in 2018 by Alex Kaplan ’21 and continues to be managed
           and staffed by Princeton students.
           </p>
         </Accordion.Content>
       <Divider> </Divider>
       <Accordion.Title
           active={activeIndex === 1}
           index={1}
           onClick={this.handleClick}>
       <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
       What is student charge?
       </Accordion.Title>
       <Accordion.Content active={activeIndex === 1}>
         <p style={{paddingLeft:'10%'}}>
           Lorem ipsum dolor
         </p>
       </Accordion.Content>
       <Divider> </Divider>
       <Accordion.Title
           active={activeIndex === 2}
           index={2}
           onClick={this.handleClick}>
       <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
       Why should I order from Coffee Club?
       </Accordion.Title>
       <Accordion.Content active={activeIndex === 2}>
        <p style={{paddingLeft:'10%'}}>
           Three common ways for a prospective owner to acquire a dog is from
           pet shops, private owners, or shelters.
       </p>
       </Accordion.Content>
       <Divider> </Divider>
       <Accordion.Title
           active={activeIndex === 3}
           index={3}
           onClick={this.handleClick}>
       <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
           Who is eligible for student charge?
       </Accordion.Title>
       <Accordion.Content active={activeIndex === 3}>
       <p style={{paddingLeft:'10%'}}>
           Student charge is only eligible for undergraduate students at the University.
           Seniors will no longer be able to student charge after April 20th of their graduation year
           (e.g. the Class of 2021 can no longer use student charge after 4/20/21)
       </p>
       </Accordion.Content>
       <Divider> </Divider>
       <Accordion.Title
           active={activeIndex === 4}
           index={4}
           onClick={this.handleClick}>
       <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
       How will I know my order went through?
       </Accordion.Title>
       <Accordion.Content active={activeIndex === 4}>
       <p style={{paddingLeft:'10%'}}>
           You will receive a confirmation email to your Princeton email
           with the items you ordered and the total cost.
           When your order is ready to pick up, you will receive another email.
       </p>
       </Accordion.Content>
       <Divider> </Divider>
       <Accordion.Title
           active={activeIndex === 4}
           index={4}
           onClick={this.handleClick}>
       <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
       How will I know my order went through?
       </Accordion.Title>
       <Accordion.Content active={activeIndex === 4}>
       <p style={{paddingLeft:'10%'}}>
           You will receive a confirmation email to your Princeton email
           with the items you ordered and the total cost.
           When your order is ready to pick up, you will receive another email.
       </p>
       </Accordion.Content>
       <Divider> </Divider>
       <Accordion.Title
           active={activeIndex === 4}
           index={4}
           onClick={this.handleClick}>
         <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
       How will I know my order went through?
       </Accordion.Title>
       <Accordion.Content active={activeIndex === 4}>
       <p style={{paddingLeft:'10%'}}>
           You will receive a confirmation email to your Princeton email
           with the items you ordered and the total cost.
           When your order is ready to pick up, you will receive another email.
       </p>
       </Accordion.Content>
       <Divider> </Divider>
       <Accordion.Title
           active={activeIndex === 4}
           index={4}
           onClick={this.handleClick}>
         <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
       How will I know my order went through?
       </Accordion.Title>
       <Accordion.Content active={activeIndex === 4}>
       <p style={{paddingLeft:'10%'}}>
           You will receive a confirmation email to your Princeton email
           with the items you ordered and the total cost.
           When your order is ready to pick up, you will receive another email.
       </p>
       </Accordion.Content>
     </Accordion>
     </Grid.Column>
     </Grid>
    </Responsive>
    </React.Fragment>
  );
 }
}
export default FAQ;
