import React, { Component } from 'react';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import { Route, Switch, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.linkStyle = {
      color: 'white',
      textDecoration: 'none'
    };
    this.state = {
      connectedUser: undefined
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    // Check if user is logged in
    axios.get('/api/auth/me').then((res) => {
      if (res.data.connected) {
        this.setState({ connectedUser: res.data.user });
      }
    }).catch(err => {
      console.log('Seesion expired', err.response.data);
      this.setState({ connectedUser: undefined });
    })
  }

  login(connectedUser) {
    this.setState({ connectedUser });
  }

  handleLogout() {
    // Log out user, remove cookie
    axios.post('/api/auth/logout').then(() => {
      this.setState({ connectedUser: undefined });
    });
  }

  getNavLinks() {
    const { connectedUser } = this.state;
    if (connectedUser) {

      // Display Logout if user connected
      return (
        <Toolbar>
          <Button color="inherit"><Link style={this.linkStyle} to="/">Home</Link></Button>
          <Button color="inherit" onClick={this.handleLogout}>Logout</Button>
        </Toolbar>
      );
    }
  }

  render() {

    return (
      <React.Fragment>
        {/* Navbar */}
        <AppBar position="static">
          {this.getNavLinks()}
        </AppBar>

        {/* Main */}
        <Switch>
          <Route exact path="/" render={(props) => <Home {...props} connectedUser={this.state.connectedUser} />} />
          <Route exact path="/login" render={(props) => <Login {...props} connectedUser={this.state.connectedUser} />} />
          <Route exact path="/register" render={(props) => <Register {...props} connectedUser={this.state.connectedUser} />} />
        </Switch>

      </React.Fragment>
    );
  }
}

export default App;
