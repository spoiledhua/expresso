import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar, Button, Grid, Responsive, Dropdown, Popup, Card, Form, Checkbox, Radio} from 'semantic-ui-react'
import { getBaristaOrders } from '../Axios/axios_getter';

class AddItem extends React.Component {
    state = {
        showOSPrice: false,
        showSmallPrice: false,
        showLargePrice: false,
        drinkSelected: true,
        foodSelected: false,
        addonSelected: false
    }

    handleOSChange = () => {
        const showOSPrice = !(this.state.showOSPrice);
        this.setState({showOSPrice}); 
    }

    handleSmallChange = () => {
        const showSmallPrice = !(this.state.showSmallPrice);
        this.setState({showSmallPrice}); 
    }

    handleLargeChange = () => {
        const showLargePrice = !(this.state.showLargePrice);
        this.setState({showLargePrice}); 
    }

    selectDrink = () => {
        this.setState({drinkSelected: true})
        this.setState({foodSelected: false})
        this.setState({addonSelected: false})
    }
    selectFood = () => {
        this.setState({drinkSelected: false})
        this.setState({foodSelected: true})
        this.setState({addonSelected: false})
    }
    selectAddon = () => {
        this.setState({drinkSelected: false})
        this.setState({foodSelected: false})
        this.setState({addonSelected: true})
        
    }

    render() {
        console.log(this.state.drinkSelected)
        console.log(this.state.foodSelected)
        console.log(this.state.addonSelected)

        return (
            <React.Fragment>
                <Card fluid>
                    <Card.Content>
                        <Grid stackable>
                            <Grid.Row>
                                <Grid.Column width='14'/>
                                <Grid.Column width='2'>
                    
                                    <Button circular icon='close' size='medium' floated='right' onClick={this.props.handleAddClose}/>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width='2'/>
                                <Grid.Column width='12'>
                                <Form style={{textAlign:'left'}}>
                                    <Form.Field>
                                        <label>Category</label>
                                        <Grid>
                                            <Grid.Row>
                                                <Grid.Column width='3'>
                                                <Radio
                                                    label='Drink'
                                                    checked={this.state.drinkSelected}
                                                    onChange={this.selectDrink}
                                                    />
                                                </Grid.Column>
                                                <Grid.Column width='3'>
                                                <Radio
                                                    label='Food'
                                                    checked={this.state.foodSelected}
                                                    onChange={this.selectFood}
                                                    />
                                                </Grid.Column>
                                                <Grid.Column width='4'>
                                                <Radio
                                                    label='Add-On'
                                                    checked={this.state.addonSelected}
                                                    onChange={this.selectAddon}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Name</label>
                                        <input placeholder='Item Name' />
                                    </Form.Field>
                                    {(this.state.drinkSelected | this.state.foodSelected) ? (
                                        <Form.Field>
                                        <label>Description</label>
                                        <input placeholder='Description' />
                                        </Form.Field>
                                    ) : null}
                                    {this.state.drinkSelected ? (
                                    <Form.Field>
                                        <label>Available sizes</label>
                                        <Checkbox label='Small' onChange={this.handleSmallChange}/> <br/>
                                        <Checkbox label='Large' onChange={this.handleLargeChange}/> <br/>
                                    </Form.Field>
                                    ) : null}
                                    {(this.state.drinkSelected & this.state.showSmallPrice) ? (
                                        <Form.Field>
                                            <label>Small Price</label>
                                            <input placeholder='$0.00' />
                                        </Form.Field>
                                    ) : null}
                                    {(this.state.drinkSelected & this.state.showLargePrice) ? (
                                        <Form.Field>
                                            <label>Large Price</label>
                                            <input placeholder='$0.00' />
                                        </Form.Field>
                                    ) : null}
                                    {(this.state.foodSelected | this.state.addonSelected) ? (
                                        <Form.Field>
                                        <label>Price</label>
                                        <input placeholder='$0.00' />
                                        </Form.Field>
                                    ) : null}
                                </Form>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Card.Content>
                    <Card.Content>
                        <Button circular basic color='green'>Add Item</Button>
                        <Button circular basic color='red'>Cancel</Button>
                    </Card.Content>
                </Card>
            </React.Fragment>
        )
    }
}

export default AddItem;
