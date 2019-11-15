import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid, Responsive, Dropdown, Button} from 'semantic-ui-react';

class BaristaOrders extends React.Component {
    render() {
      
        return (
            <React.Fragment>
            <Grid divided='vertically'>
                {/*  new row for every order*/}
                <Grid.Row>
                    <Grid.Column verticalAlign='middle' width='2' style={{textAlign:'center'}}>
                        <h1>1</h1>
                    </Grid.Column>
                    <Grid.Column width='6'>
                        <h2 style={{margin: '0'}}>Latte (Large, Oat Milk, Vanilla)</h2>
                        <h3 style={{margin: '0'}}>Dora Zhao</h3>
                        <p>8:05:32</p>
                    </Grid.Column>
                    <Grid.Column width='4' verticalAlign='middle'>
                        <Button circular style={{background: '#F98F69'}}> IN PROGRESS</Button>
                        <Button circular style={{background: '#B7E4A9'}}>COMPLETE</Button>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle' >
                        <h3 style={{margin:'0', textAlign:'center'}}>$2.70</h3>
                        <Button circular color='red'>PAID</Button>
                    </Grid.Column>

                </Grid.Row>
                <Grid.Row>
                    <Grid.Column verticalAlign='middle' width='2' style={{textAlign:'center'}}>
                        <h1>2</h1>
                    </Grid.Column>
                    <Grid.Column width='6'>
                        <h2 style={{margin: '0'}}>Latte (Large, Oat Milk, Vanilla)</h2>
                        <h3 style={{margin: '0'}}>Dora Zhao</h3>
                        <p>8:05:32</p>
                    </Grid.Column>
                    <Grid.Column width='4' verticalAlign='middle'>
                        <Button circular style={{background: '#F98F69'}}>IN PROGRESS</Button>
                        <Button circular style={{background: '#B7E4A9'}}>COMPLETE</Button>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle'>
                        <h2>PAID</h2>
                    </Grid.Column>

                </Grid.Row>
            </Grid>
            </React.Fragment>
          
        );
    };
}


export default BaristaOrders