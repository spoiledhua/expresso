import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar, Button, Grid, Responsive, Dropdown, Popup, Card, Form, Checkbox } from 'semantic-ui-react'

class AddItem extends React.Component {
    state = {
        showOSPrice: false,
        showSmallPrice: false,
        showLargePrice: false
    }

    handleOSClick = () => {
        console.log('hi')
        console.log(this.state.showOSPrice)
        const showOSPrice = !(this.state.showOSPrice);
        this.setState({showOSPrice}); 
    }

    handleSmallClick = () => {
        const showSmallPrice = !(this.state.showSmallPrice);
        this.setState({showSmallPrice}); 
    }

    handleLargeClick = () => {
        const showLargePrice = !(this.state.showLargePrice);
        this.setState({showLargePrice}); 
    }

    render() {

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
                                        <label>Item Name</label>
                                        <input placeholder='Item Name' />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Description</label>
                                        <input placeholder='Description' />
                                    </Form.Field>
                                    
                                    <Form.Field>
                                        <label>Available sizes</label>
                                        <Checkbox label='One size' onChange={this.handleOSClick}/> <br/>
                                        <Checkbox label='Small' onChange={this.handleSmallClick}/> <br/>
                                        <Checkbox label='Large' onChange={this.handleLargeClick}/> <br/>
                                    </Form.Field>
                                    {this.state.showOSPrice ? (
                                        <Form.Field>
                                            <label>One Size Price</label>
                                            <input placeholder='$0.00' />
                                        </Form.Field>
                                    ): null}
                                    {this.state.showSmallPrice ? (
                                        <Form.Field>
                                            <label>Small Price</label>
                                            <input placeholder='$0.00' />
                                        </Form.Field>
                                    ): null}
                                    {this.state.showLargePrice ? (
                                        <Form.Field>
                                            <label>Large Price</label>
                                            <input placeholder='$0.00' />
                                        </Form.Field>
                                    ): null}
                                    <Form.Field><label>Choose Category</label></Form.Field>
                                    <Form.Select placeholder='Category' options={[{key:1, text: 'Drink'}, {key:2, text: 'Food'}, {key:3,text: 'Add-On'}]}>
                                    </Form.Select>
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
