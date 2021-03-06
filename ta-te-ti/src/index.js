import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Toggle from 'react-toggle-component'
import "react-toggle-component/styles.css"

function Square(props) {
    return(
        <button className={props.winnerStyle ? "winnerSquare" : "square"} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i,row,column) {
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick={()=>this.props.onClick(i,row,column)}
                key = {i}
                winnerStyle = {this.props.winners ? this.props.winners.includes(i) : false}
            />
        );
    }
    
    generateBoard(rows,columns) {
        return [...Array(columns)].map((_,x) => {
            return (
                <div className="board-row" key={`col${x}`}>
                    {
                        [...Array(rows)].map((_,y) => {
                            const index = x*columns+y;
                            return this.renderSquare(index,y,x);        
                        })
                    }
                </div>
            );
        })
    }
    render() {
        return(
            <div>{this.generateBoard(3,3)}</div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                row: 0,
                column: 0,
            }],
            xIsNext: true,
            stepNumber: 0,
            ascendingOrder: true,
        };
    }

    handleClick(i,row,colum) {
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                row: row,
                column: colum,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step%2)===0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares)

        const moves = history.map((step, move) => {
            var desc= 'Go to game start';
            if (move) {
                desc = move === this.state.stepNumber ? <b>Go to move #{move}</b> : `Go to move #${move}`;
            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = `Winner: ${this.state.xIsNext ? "O" : "X"}`;
        }
        else {
            const drawMatch = !current.squares.includes(null);
            if (drawMatch) {
                status = "Draw Match!";
            }
            else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }

        return (
            <div className="game">
            <div className="game-board">
              <Board 
                squares={current.squares}
                onClick={(i,row,column) => this.handleClick(i,row,column)}
                winners ={winner}
              />
            </div>
            <div className="game-info">
                <div>
                    <Toggle label={this.state.ascendingOrder ? "Ascending" : "Descending"} 
                    onToggle={() => { this.setState( { ascendingOrder : !this.state.ascendingOrder })}}
                    />
                </div>
              <div>{status}</div>
              <ol reversed = {!this.state.ascendingOrder}>{this.state.ascendingOrder ? moves : moves.slice().reverse()}</ol>
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
    for (let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a]=== squares[b] && squares[a] === squares[c]) {
            return [a,b,c];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );