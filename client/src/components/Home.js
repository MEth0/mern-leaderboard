import React, { Component } from 'react';
import { Container, Box, Grid } from '@material-ui/core';
import axios from 'axios';
import Score from './Score';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaderScore: 0
    }
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      axios.get('/api/teams/all/leader').then(res => {
        this.setState({ leaderScore: res.data.team.score });
      })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const { leaderScore } = this.state;
    return (
      <Box mt={5}>
        <Container>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="flex-start"
          >
            <Score team='0' leaderScore={leaderScore} connectedUser={this.props.connectedUser} />
            <Score team='1' leaderScore={leaderScore} connectedUser={this.props.connectedUser} />
            <Score team='2' leaderScore={leaderScore} connectedUser={this.props.connectedUser} />
            <Score team='3' leaderScore={leaderScore} connectedUser={this.props.connectedUser} />
          </Grid>
        </Container>
      </Box>
    );
  }
}

export default Home;
