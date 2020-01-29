import React, { Component } from 'react';
import { Container, Typography, Box, TextField, Button } from '@material-ui/core';
import axios from 'axios';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { yellow } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: yellow
  },
});

class Login extends Component {

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
    // Send form data to API
    axios.post('/api/auth/login', { login: this.state.login, password: this.state.password }).then((res) => {
      // Return to "/"
      window.location = '/';
    }).catch((error) => {
      this.setState({ feedback: error.response.data.message });
    });
  }

  render() {
    const { connectedUser } = this.props;
    if (connectedUser) {
      return (
        <Typography variant="body1">Already Logged in</Typography>
      );
    }
    return (
      <Box mt={5}>
        <Container maxWidth="xs">
          <ThemeProvider theme={theme}>
            <Typography variant="h2">Login</Typography>
            <form onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="login"
                label="Login"
                name="login"
                autoComplete="login"
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
                Sign In
            </Button>
            </form>
            <Typography variant="body1">{this.state.feedback}</Typography>
          </ThemeProvider>
        </Container>
      </Box>
    );
  }
}

export default Login;
