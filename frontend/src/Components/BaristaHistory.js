import React from 'react';
import { Menu, Icon, Image, Container, Header, Grid, Responsive, Dropdown, Button} from 'semantic-ui-react';

class BaristaHistory extends React.Component {
    render() {

        return (
            <React.Fragment>
                <Grid divided='vertically'>
                    {/*  new row for every order*/}
                    <Grid.Row>
                        <Grid.Column width='1'></Grid.Column>
                        <Grid.Column width='2' verticalAlign='middle'>
                            <p>10:32:52</p>
                        </Grid.Column>
                        <Grid.Column width='4' verticalAlign='middle'>
                            <h2>Black Coffee</h2>
                        </Grid.Column>
                        <Grid.Column width='2' verticalAlign='middle'>
                            <h3>$2.30</h3>
                        </Grid.Column>
                        <Grid.Column verticalAlign='middle' width='2'>
                            <h3>dorothyz</h3>
                        </Grid.Column>
                        <Grid.Column verticalAlign='middle' width='2'>
                            <p>In-Store</p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width='1'></Grid.Column>
                        <Grid.Column width='2' verticalAlign='middle'>
                            <p>10:32:52</p>
                        </Grid.Column>
                        <Grid.Column width='4' verticalAlign='middle'>
                            <h2>Latte</h2>
                        </Grid.Column>
                        <Grid.Column width='2' verticalAlign='middle'>
                            <h3>$4.00</h3>
                        </Grid.Column>
                        <Grid.Column verticalAlign='middle' width='2'>
                            <h3>kyying</h3>
                        </Grid.Column>
                        <Grid.Column verticalAlign='middle' width='2'>
                            <p>Student-Charge</p>
                        </Grid.Column>
                    </Grid.Row>


                </Grid>
            </React.Fragment>

        );
    };
}


export default BaristaHistory
