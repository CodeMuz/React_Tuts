import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={`${props.winner} square`}  onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square
            key={i}
            value={this.props.squares[i]}
            winner={this.props.winningSquares.includes(i)?'winner':''}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {

        return (
            <div>
                {
                    [0, 1, 2].map((n) => {
                        return (
                            <div key={n} className="board-row">
                                {
                                    [0, 1, 2].map((z) => {
                                        return (
                                            this.renderSquare(n + (z * 3))
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coOrd: {}
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const coOrd = {
            x: i % 3,
            y: Math.floor(i / 3)
        };
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                coOrd: coOrd
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    reorderMoves(){
        const oldHistory = this.state.history;
        let newHistory = [];
        for (let i = 0;i < oldHistory.length;i++){
            newHistory[i] = oldHistory[oldHistory.length - 1 - i];
        }
        this.setState({
            history: newHistory
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                `Go to move (${step.coOrd.x},${step.coOrd.y})` :
                'Go to game start';
            const listClass = (this.state.stepNumber === move) ? 'current' : '';
            return (
                <li key={move} className={listClass}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner.winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningSquares={winner ? winner.line:[]}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <button onClick={(i) => this.reorderMoves(i)}>
                    Sort Moves
                </button>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                'winner': squares[a],
                'line' : [a,b,c]
            }
        }
    }
    return null;
}