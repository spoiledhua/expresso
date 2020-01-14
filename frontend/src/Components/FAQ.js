import React from 'react'
import { Header, Grid, Accordion, Icon, Divider, Responsive } from 'semantic-ui-react'

import ClientHeader from './ClientHeader';

class FAQ extends React.Component {

 state = {
   activeIndex: 0,
   shoppingCart: []
 }

 componentDidMount = () => {
   if (JSON.parse(localStorage.getItem('shoppingCart')) !== null) {
     this.setState({ shoppingCart: JSON.parse(localStorage.getItem('shoppingCart'))});
   }
 }

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
       <ClientHeader history={this.props.history} shoppingCart={this.state.shoppingCart}/>
       <div style={{ height: '12vh' }} />
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
           <Grid.Column width = {6} style = {{paddingTop:'7%'}}>
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
                   Student charge means that charging to your student account. It is equivalent
                   to you swiping your prox at any physical register on campus. At
                   the moment, this functionality is only available to undergraduate students.
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
                   There are many reasons as to why Coffee Club should be your coffee shop of choice.
                   First, the entire business is founded, managed, and staffed by students. By choosing
                   Coffee Club, you are helping out Princeton students who are highly passionate about
                   coffee and community at the University. In addition, the coffee beans at Coffee Club are
                   responsibly sourced. Finally, Coffee Club is a hub for student life on campus. By supporting
                   Coffee Club, you are ensuring that members of the Princeton community have a place to hang out
                   and enjoy life outside of classes.
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
                   For this year, seniors will no longer be able to student charge after April 7th.
                   (e.g. the Class of 2020 can no longer use student charge after 4/7/21)
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
                 active={activeIndex === 5}
                 index={5}
                 onClick={this.handleClick}>
                 <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
                 <span style={{fontFamily:'Avenir'}}> Do I need to be an undergrad to use this app?</span>
               </Accordion.Title>
               <Accordion.Content active={activeIndex === 5}>
                 <p style={{paddingLeft:'10%', fontFamily:'Avenir'}}>
                   No. You can be a Princeton undergraduate student, graduate student, faculty, or employee.
                   So long as you have a Princeton netid, you can use this app.
                 </p>
               </Accordion.Content>
               <Divider> </Divider>
               <Accordion.Title
                 active={activeIndex === 6}
                 index={6}
                 onClick={this.handleClick}>
                 <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
                 <span style={{fontFamily:'Avenir'}}> Are the prices here the same as at the Coffee Club?</span>
               </Accordion.Title>
               <Accordion.Content active={activeIndex === 6}>
                 <p style={{paddingLeft:'10%'}}>
                   Yes, they are!!
                 </p>
               </Accordion.Content>
               <Divider> </Divider>
               <Accordion.Title
                 active={activeIndex === 7}
                 index={7}
                 onClick={this.handleClick}>
                 <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
                 <span style={{fontFamily:'Avenir'}}> This app is so cool. How do I get involved? </span>
               </Accordion.Title>
               <Accordion.Content active={activeIndex === 7}>
                 <p style={{paddingLeft:'10%', fontFamily:'Avenir'}}>
                   This project was made for COS 333: Advanced Programming Techniques. If you want to do
                   similar projects, you can take the course when it is offered. If you want to get involved
                   with this project, then you can get in contact with the Coffee Club to see if there are any openings.
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
         <Grid>
           <Grid.Column style = {{paddingTop:'10%', paddingLeft:'10%', paddingRight:'10%'}}>
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
                   Student charge means that charging to your student account. It is equivalent
                   to you swiping your prox at any physical register on campus. At
                   the moment, this functionality is only available to undergraduate students.
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
                   There are many reasons as to why Coffee Club should be your coffee shop of choice.
                   First, the entire business is founded, managed, and staffed by students. By choosing
                   Coffee Club, you are helping out Princeton students who are highly passionate about
                   coffee and community at the University. In addition, the coffee beans at Coffee Club are
                   responsibly sourced. Finally, Coffee Club is a hub for student life on campus. By supporting
                   Coffee Club, you are ensuring that members of the Princeton community have a place to hang out
                   and enjoy life outside of classes.
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
                   For this year, seniors will no longer be able to student charge after April 7th.
                   (e.g. the Class of 2020 can no longer use student charge after 4/7/21)
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
                 active={activeIndex === 5}
                 index={5}
                 onClick={this.handleClick}>
                 <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
                 <span style={{fontFamily:'Avenir'}}> Do I need to be an undergrad to use this app?</span>
               </Accordion.Title>
               <Accordion.Content active={activeIndex === 5}>
                 <p style={{paddingLeft:'10%', fontFamily:'Avenir'}}>
                   No. You can be a Princeton undergraduate student, graduate student, faculty, or employee.
                   So long as you have a Princeton netid, you can use this app.
                 </p>
               </Accordion.Content>
               <Divider> </Divider>
               <Accordion.Title
                 active={activeIndex === 6}
                 index={6}
                 onClick={this.handleClick}>
                 <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
                 <span style={{fontFamily:'Avenir'}}> Are the prices here the same as at the Coffee Club?</span>
               </Accordion.Title>
               <Accordion.Content active={activeIndex === 6}>
                 <p style={{paddingLeft:'10%', fontFamily:'Avenir'}}>
                   Yes, they are!!
                 </p>
               </Accordion.Content>
               <Divider> </Divider>
               <Accordion.Title
                 active={activeIndex === 7}
                 index={7}
                 onClick={this.handleClick}>
                 <Icon name='plus' style = {{'paddingRight':'9%','color': '#EDAC86'}}/>
                 <span style={{fontFamily:'Avenir'}}> This app is so cool. How do I get involved? </span>
               </Accordion.Title>
               <Accordion.Content active={activeIndex === 7}>
                 <p style={{paddingLeft:'10%', fontFamily:'Avenir'}}>
                   This project was made for COS 333: Advanced Programming Techniques. If you want to do
                   similar projects, you can take the course when it is offered. If you want to get involved
                   with this project, then you can get in contact with the Coffee Club to see if there are any openings.
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
