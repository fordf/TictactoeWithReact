import React from 'react';
import ReactDOM from 'react-dom';
import {range} from 'lodash';
import './index.css';

function Square(props) {
  const style = {
    backgroundColor: props.highlight ? '#ff9' : '#fff'
  }
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={style}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        highlight={this.props.winner && this.props.winner.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let rows = [];
    range
    for (let x of range(3)) {
      let squares = [];
      for (let y of range(3)) {
        squares.push(this.renderSquare(x * 3 + y));
      }
      rows.push(<div key={x} className="board-row">{squares}</div>);
    }
    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        movedesc: null
      }],
      stepNumber: 0,
      player: 'X',
      winner: null,
    };
  }

  handleClick(i) {
    if (!this.state.winner) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];

      if (!current.squares[i]) {
        const squares = current.squares.slice();
        squares[i] = this.state.player;
        const winner = calculateWinner(squares);
        this.setState({
          history: history.concat([{
            squares: squares,
            movedesc: `${this.state.player} -> (${Math.floor(i/3)}, ${i%3})`
          }]),
          player: this.state.player === 'X' ? 'O' : 'X',
          winner: winner,
          stepNumber: history.length
        });
      }
    }
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      player: move % 2 ? 'O' : 'X',
      winner: calculateWinner(this.state.history[move].squares)
    });
  }

  render() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];

    let status;
    if (this.state.winner) {
      status = 'Winner: ' + current.squares[this.state.winner[0]];
    } else if (this.state.stepNumber === 9) {
      status = "Cat's game"
    } else {
      status = 'Next player: ' + this.state.player;
    }

    const moves = history.map((step, move) => {
      let desc = move ?
        'Go to move: ' + step.movedesc :
        'Go to game start';
      if (move === this.state.stepNumber) {
        desc = <b>{desc}</b>;
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winner={this.state.winner}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
