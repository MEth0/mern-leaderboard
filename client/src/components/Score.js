import React, { Component } from 'react';
import { Grid, LinearProgress, CircularProgress, TextField, Typography } from '@material-ui/core';
import { createMuiTheme, ThemeProvider, lighten, withStyles } from '@material-ui/core/styles';
import axios from 'axios';

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});

const BorderLinearProgress = withStyles({
  root: {
    height: 20,
    backgroundColor: props => lighten(props.teamcolor, 0.5),
    flexGrow: 1,
    borderRadius: 20
  },
  bar: {
    borderRadius: 20,
    backgroundColor: props => props.teamcolor,
  },
})(LinearProgress);

class Score extends Component {

  constructor(props) {
    super(props);
    this.state = {
      team: 0,
      name: undefined,
      color: undefined,
      score: 0,
      pts: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.timer = this.timer.bind(this);
  }

  timer() {
    const { team } = this.props;

    // Get team data
    axios.get(`/api/teams/${team}`).then(res => {
      this.setState({
        team: res.data.team,
        name: res.data.name,
        color: res.data.color,
        score: res.data.score
      });
    }).catch(err => {
      console.log(err);
    });
  }

  componentDidMount() {
    this.timer();
    this.intervalId = setInterval(this.timer, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    // Change team points
    const pts = parseInt(this.state.pts)
    if (pts && pts !== 0) {
      const newScore = this.state.score + pts;
      this.setState({ score: parseInt(newScore) });
      axios.post(`/api/teams/${this.state.team}/add/${pts}`).then(res => {
        console.log(res.data)
      })
    }
  }

  render() {
    const { name, color, score } = this.state;

    if (this.state.name !== undefined) {
      return (
        <React.Fragment>
          <ThemeProvider theme={theme}>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              {/* Display +/- input only if connected */}
              {this.props.connectedUser &&
                <form onSubmit={this.handleSubmit}>
                  <TextField type="number" onChange={this.handleChange} style={{ width: '40px' }} name="pts" label="+-" size="small" />
                </form>
              }
              <img src={`/images/${name}.png`} alt={name} />
              <Grid
                container item xs={9}
                direction="column"
              >
                <BorderLinearProgress
                  variant="determinate"
                  value={score * 100 / parseInt(this.props.leaderScore)}
                  teamcolor={color}
                />
                <Typography variant="body1">{this.props.leaderScore === score ? '🏆' : ''} {score}</Typography>
              </Grid>
            </Grid>
          </ThemeProvider>
        </React.Fragment>
      );
    } else {
      return <CircularProgress />;
    }
  }
}

export default Score;
