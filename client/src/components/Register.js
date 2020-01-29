import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Typography, Box, TextField, Button } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

import axios from 'axios';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue
  },
});

class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login: '',
      password: '',
      feedback: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { login, password } = this.state;
    // Send form data to API, create new user
    axios.post('/api/users', { login, password }).then(() => {
      this.props.history.push('/login');
    }).catch((error) => {
      this.setState({ feedback: error.response.data.message });
    });
  }

  render() {
    return (
      <Box mt={5}>
        <Container maxWidth="xs">
          <ThemeProvider theme={theme}>
            <Typography variant="h2">Register</Typography>
            <form onSubmit={this.handleSubmit} style={{ marginTop: '16px' }}>
              <TextField
                autoComplete="flogin"
                margin="normal"
                name="login"
                variant="outlined"
                required
                fullWidth
                id="login"
                label="Login"
                onChange={this.handleInputChange}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={this.handleInputChange}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Sign Up
            </Button>
              <Link to="/login" style={{ color: '#2196f3' }}>
                Already have an account? Sign in
              </Link>
            </form>
            <Typography variant="body1">{this.state.feedback}</Typography>
          </ThemeProvider>
        </Container>
      </Box>
    );
  }
}

// "withRouter" to use the history props
export default withRouter(Register);
