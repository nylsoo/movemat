import React, { Component } from 'react';
import Input from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox';
import { Redirect } from 'react-router-dom';
import { constants as routerLinks } from '../../../../components/App/index';
import Box from '../../../../components/common/Box';

class StepsEdit extends Component {
  state = {
    allowedEmails: [],
    name: '',
    nameError: '',
    allowedEmailsError: '',
  };


  constructor(props) {
    super(props);

    // Bind handle submit because of error in _asyncToGenerator.
    // See issue: https://github.com/babel/babel/issues/4550
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    try {
      const id = this.props.computedMatch.params.id;
      const response = await fetch(`/api/admin/group/${id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',
      });
      const json = await response.json();
      this.setState({
        allowedEmails: json.allowedEmails,
        name: json.name,
      });
    } catch (exception) {
      console.log(exception);
    }
  }

  async handleSubmit(e, clicked = false) {
    if(clicked || e.key === 'Enter') {
      try {
        const id = this.props.computedMatch.params.id;
        const response = await fetch(`/api/admin/group/${id}`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: this.state.name,
            allowedEmails: this.state.allowedEmails
          }),
        });
        if(response.status === 200) {
          this.setState({ redirect: true });
        }
      } catch(exception) {
        console.log(exception);
        // Time out, 500, weird errors are handled here.
        // TODO: Call global function to handle these errors.
      }
    }
  }

  render() {
    return (
      <Box>
        <h2>Edit Steps</h2>
        {this.state.redirect && <Redirect to={routerLinks.STEPS_VIEW_ROUTE} />}
        <Input
          type='text'
          label='Familie naam'
          name='name'
          value={this.state.name}
          onKeyPress={this.handleSubmit}
          onChange={name => this.setState({ name })}
          error={this.state.nameError}
        />
        <Input
          type='text'
          label='E-mailadressen'
          name='email'
          value={this.state.allowedEmails.join(',')}
          onKeyPress={this.handleSubmit}
          onChange={allowedEmails => this.setState({ allowedEmails: allowedEmails.split(',') })}
          error={this.state.allowedEmailsError}
        />
        <Button label='Edit' raised primary onClick={e => this.handleSubmit(e, true)} />
      </Box>
    );
  }
}

export default StepsEdit;
