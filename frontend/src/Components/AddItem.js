import React from 'react';
import { Button, Grid, Card, Form, Checkbox, Radio, Header} from 'semantic-ui-react';

import { addItem } from '../Axios/axios_getter';

class AddItem extends React.Component {

    state = {
      showSmallPrice: false,
      showLargePrice: false,
      showOneSizePrice: false,
      smallPrice: '',
      largePrice: '',
      oneSizePrice: '',
      price: '',
      drinkSelected: true,
      foodSelected: false,
      addonSelected: false,
      finalAdd: { category: 'Drink', name: '', description: '', definition: '', small: '', large: '', oneSize: '', noSize: ''},
      error: null
    }

    handleSmallChange = () => {
        const showSmallPrice = !this.state.showSmallPrice;
        this.setState({showSmallPrice});
        if (showSmallPrice) {
          this.setState({ showOneSizePrice: false});
        }
    }

    handleLargeChange = () => {
        const showLargePrice = !this.state.showLargePrice;
        this.setState({showLargePrice});
        if (showLargePrice) {
          this.setState({ showOneSizePrice: false});
        }
    }

    handleOneSizeChange = () => {
        const showOneSizePrice = !this.state.showOneSizePrice;
        this.setState({showOneSizePrice});
        if (showOneSizePrice) {
          this.setState({ showSmallPrice: false});
          this.setState({ showLargePrice: false});
        }
    }

    selectDrink = () => {
        this.setState({drinkSelected: true})
        this.setState({foodSelected: false})
        this.setState({addonSelected: false})
        this.clear()
    }

    selectFood = () => {
        this.setState({drinkSelected: false})
        this.setState({foodSelected: true})
        this.setState({addonSelected: false})
        this.clear()
    }

    selectAddon = () => {
        this.setState({drinkSelected: false})
        this.setState({foodSelected: false})
        this.setState({addonSelected: true})
        this.clear()
        this.setState({finalAdd: { category: 'Add', name: '', description: '', definition: '', small: '', large: '', oneSize: '', noSize: ''}})
    }

    clear = () => {
      this.setState({smallPrice: ''})
      this.setState({largePrice: ''})
      this.setState({oneSizePrice: ''})
      this.setState({price: ''})
      this.setState({error: null})
      this.setState({finalAdd: { category: 'Food', name: '', description: '', definition: '', small: '', large: '', oneSize: '', noSize: ''}})
    }

    handleNameChange = (e) => {
      e.persist()
      this.setState(prevState => {
        let finalAdd = { ...prevState.finalAdd };
        finalAdd.name = e.target.value;
        return { finalAdd }
      });
    }

    handleDescriptionChange = (e) => {
      e.persist()
      this.setState(prevState => {
        let finalAdd = { ...prevState.finalAdd };
        finalAdd.description = e.target.value;
        return { finalAdd }
      });
    }

    handleDefinitionChange = (e) => {
      e.persist()
      this.setState(prevState => {
        let finalAdd = { ...prevState.finalAdd };
        finalAdd.definition = e.target.value;
        return { finalAdd }
      });
    }

    handleSmallPriceChange = (e) => {
      e.persist()
      this.setState({smallPrice: e.target.value});
    }

    handleLargePriceChange = (e) => {
      e.persist()
      this.setState({largePrice: e.target.value});
    }

    handleOneSizePriceChange = (e) => {
      e.persist()
      this.setState({oneSizePrice: e.target.value});
    }

    handlePriceChange = (e) => {
      e.persist()
      this.setState({price: e.target.value});
    }

    submitItem = async () => {
      this.setState({ loading: true })
      // verify admin
      let { finalAdd } = this.state

      let errorFree = true

      if (finalAdd.category === 'Drink') {

        if ((finalAdd.name === '' || finalAdd.description === '') || finalAdd.definition === '') {
          this.setState({ error: 'Please fill out all fields' })
          errorFree = false
        }

        else {

          if ((!this.state.showSmallPrice && !this.state.showLargePrice) && !this.state.showOneSizePrice) {
            this.setState({ error: 'Please select at least one size and enter a price'})
            errorFree = false
          }

          else {
            if (this.state.showSmallPrice) {
              if (this.state.smallPrice === '') {
                this.setState({ error: 'Please fill out all fields' })
                errorFree = false
              }
              else {
                let finalAdd = this.state.finalAdd;
                finalAdd.small = this.state.smallPrice;
                this.setState({ finalAdd: finalAdd });
              }
            }
            if (this.state.showLargePrice) {
              if (this.state.largePrice === '') {
                this.setState({ error: 'Please fill out all fields' })
                errorFree = false
              }
              else {
                let finalAdd = this.state.finalAdd;
                finalAdd.large = this.state.LargePrice;
                this.setState({ finalAdd: finalAdd });
              }
            }
            if (this.state.showOneSizePrice) {
              if (this.state.oneSizePrice === '') {
                this.setState({ error: 'Please fill out all fields' })
                errorFree = false
              }
              else {
                let finalAdd = this.state.finalAdd;
                finalAdd.oneSize = this.state.oneSizePrice;
                this.setState({ finalAdd: finalAdd });
              }
            }
          }

          if (errorFree) {
            this.setState({ error: null });
            let finalAddition = { category: finalAdd.category, name: finalAdd.name, description: finalAdd.description, definition: finalAdd.definition, noSize: null };
            finalAddition.smallSize = (this.state.smallPrice === '') ? null : this.state.smallPrice;
            finalAddition.largeSize = (this.state.largePrice === '') ? null : this.state.largePrice;
            finalAddition.oneSize = (this.state.oneSizePrice === '') ? null : this.state.oneSizePrice;
            addItem(finalAddition, JSON.parse(localStorage.getItem('token')))
              .then(data => {
                this.setState({ error: data.error });
                if (data.error === null) {
                  this.setState({ error: null });
                  this.props.inventoryRefresh();
                  this.props.handleAddClose();
                  this.props.toggleOnAdd();
                  this.clear();
                }
                });
          }
        }
      }

      else if (finalAdd.category === 'Food') {
        if ((finalAdd.name === '' || finalAdd.description === '' ) || (finalAdd.definition === '' || this.state.price === '')) {
          this.setState({ error: 'Please fill out all fields' })
        }

        else {
          this.setState({ error: null })
          let finalAddition = { category: finalAdd.category, name: finalAdd.name, description: finalAdd.description, definition: finalAdd.definition, noSize: null, smallSize: null, largeSize: null, oneSize: this.state.price };
          addItem(finalAddition)
            .then(data => {
              this.setState({ error: data.error });
              if (data.error === null) {
                this.props.inventoryRefresh();
                this.props.handleAddClose();
                this.props.toggleOnAdd();
                this.clear();
            }
            });
          }
      }

      else if (finalAdd.category === 'Add') {

        if (finalAdd.name === '' || this.state.price === '') {
          this.setState({ error: 'Please fill out all fields' })
        }

        else {
          this.setState({ error: null })
          let finalAddition = { category: finalAdd.category, name: finalAdd.name, description: 'No Description', definition: 'No Definition', noSize: this.state.price, smallSize: null, largeSize: null, oneSize: null };
          addItem(finalAddition)
            .then(data => {
              this.setState({ error: data.error });
              if (data.error === null) {
                this.props.inventoryRefresh();
                this.props.handleAddClose();
                this.props.toggleOnAdd();
                this.clear();
            }
          });
        }
      }

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
                        <Button circular icon='close' size='medium' floated='right' basic color='black' onClick={this.props.handleAddClose}/>
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
                                <Grid.Column width='4'>
                                  <Radio
                                    label='Drink'
                                    checked={this.state.drinkSelected}
                                    onChange={this.selectDrink}
                                  />
                                </Grid.Column>
                                <Grid.Column width='4'>
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
                            <input placeholder='Item Name' onChange={this.handleNameChange} value={this.state.finalAdd.name}/>
                          </Form.Field>
                          {(this.state.drinkSelected | this.state.foodSelected) ? (
                            <React.Fragment>
                              <Form.Field>
                                <label>Description</label>
                                <input placeholder='Description' onChange={this.handleDescriptionChange} value={this.state.finalAdd.description}/>
                              </Form.Field>
                              <Form.Field>
                                <label>Definition</label>
                                <input placeholder='Definition' onChange={this.handleDefinitionChange} value={this.state.finalAdd.definition}/>
                              </Form.Field>
                            </React.Fragment>
                          ) : null}
                          {this.state.drinkSelected ? (
                            <Form.Field>
                              <label>Available sizes</label>
                              <Checkbox label='Small' checked={this.state.showSmallPrice} onChange={this.handleSmallChange}/> <br/>
                              <Checkbox label='Large' checked={this.state.showLargePrice} onChange={this.handleLargeChange}/> <br/>
                              <Checkbox label='One Size' checked={this.state.showOneSizePrice} onChange={this.handleOneSizeChange}/> <br/>
                            </Form.Field>
                          ) : null}
                          {(this.state.drinkSelected & this.state.showSmallPrice) ? (
                            <Form.Field>
                              <label>Small Price</label>
                              <input onChange={this.handleSmallPriceChange} placeholder='0.00' value={this.state.smallPrice}/>
                            </Form.Field>
                          ) : null}
                          {(this.state.drinkSelected & this.state.showLargePrice) ? (
                            <Form.Field>
                              <label>Large Price</label>
                              <input onChange={this.handleLargePriceChange} placeholder='0.00' value={this.state.largePrice}/>
                            </Form.Field>
                          ) : null}
                          {(this.state.drinkSelected & this.state.showOneSizePrice) ? (
                            <Form.Field>
                              <label>One Size</label>
                              <input onChange={this.handleOneSizePriceChange} placeholder='0.00' value={this.state.oneSizePrice}/>
                            </Form.Field>
                          ) : null}
                          {(this.state.foodSelected | this.state.addonSelected) ? (
                            <Form.Field>
                              <label>Price</label>
                              <input onChange={this.handlePriceChange} placeholder='0.00' value={this.state.price}/>
                            </Form.Field>
                          ) : null}
                          <br />
                          <br />
                          <Button circular onClick={this.submitItem} style={{backgroundColor:'#85A290', fontfamily:'Avenir', color:'white'}}>Add Item</Button>
                          <Button circular onClick={this.handleAddClose} basic style={{backgroundColor:'#85A290', fontfamily:'Avenir', color:'white'}}>Cancel</Button>
                        </Form>
                        <Header as='h3' color='black' textAlign='center'>
                          {this.state.error}
                        </Header>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </React.Fragment>
        )
    }
}

export default AddItem;
