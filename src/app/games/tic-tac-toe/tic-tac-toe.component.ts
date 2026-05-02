import { Component } from '@angular/core';

type Cell = 'X' | 'O' | '';
type GameMode = 'one-player' | 'two-player';
type Player = 'X' | 'O';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent {
  private static readonly WIN_LINES: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  mode: GameMode | null = null;
  board: Cell[] = Array(9).fill('');
  currentPlayer: Player = 'X';
  winner: Player | null = null;
  winningLine: number[] | null = null;
  isDraw = false;
  machineThinking = false;

  xWins = 0;
  oWins = 0;
  draws = 0;

  selectMode(mode: GameMode): void {
    this.mode = mode;
    this.resetScore();
    this.newGame();
  }

  changeMode(): void {
    this.mode = null;
    this.board = Array(9).fill('');
    this.winner = null;
    this.winningLine = null;
    this.isDraw = false;
    this.currentPlayer = 'X';
  }

  play(index: number): void {
    if (this.board[index] !== '' || this.winner || this.isDraw || this.machineThinking) {
      return;
    }
    this.board[index] = this.currentPlayer;

    if (this.checkEnd()) {
      return;
    }

    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

    if (this.mode === 'one-player' && this.currentPlayer === 'O') {
      this.runMachineTurn();
    }
  }

  newGame(): void {
    this.board = Array(9).fill('');
    this.winner = null;
    this.winningLine = null;
    this.isDraw = false;
    this.currentPlayer = 'X';
    this.machineThinking = false;
  }

  resetScore(): void {
    this.xWins = 0;
    this.oWins = 0;
    this.draws = 0;
  }

  trackByIndex(index: number): number {
    return index;
  }

  get statusMessage(): string {
    if (this.winner) {
      if (this.mode === 'one-player') {
        return this.winner === 'X' ? 'You win!' : 'Machine wins.';
      }
      return `Player ${this.winner} wins!`;
    }
    if (this.isDraw) {
      return "It's a draw.";
    }
    if (this.mode === 'one-player') {
      return this.currentPlayer === 'X' ? 'Your turn (X)' : "Machine's turn (O)";
    }
    return `Player ${this.currentPlayer}'s turn`;
  }

  private runMachineTurn(): void {
    this.machineThinking = true;
    setTimeout(() => {
      const move = this.bestMove(this.board);
      if (move !== -1) {
        this.board[move] = 'O';
        if (!this.checkEnd()) {
          this.currentPlayer = 'X';
        }
      }
      this.machineThinking = false;
    }, 350);
  }

  private checkEnd(): boolean {
    const line = this.findWinningLine(this.board);
    if (line) {
      this.winner = this.board[line[0]] as Player;
      this.winningLine = line;
      if (this.winner === 'X') {
        this.xWins += 1;
      } else {
        this.oWins += 1;
      }
      return true;
    }
    if (this.board.every((c) => c !== '')) {
      this.isDraw = true;
      this.draws += 1;
      return true;
    }
    return false;
  }

  private findWinningLine(board: Cell[]): number[] | null {
    for (const line of TicTacToeComponent.WIN_LINES) {
      const [a, b, c] = line;
      if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
        return line;
      }
    }
    return null;
  }

  private bestMove(board: Cell[]): number {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < 9; i += 1) {
      if (board[i] === '') {
        board[i] = 'O';
        const score = this.minimax(board, 0, false);
        board[i] = '';
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  private minimax(board: Cell[], depth: number, isMaximizing: boolean): number {
    const line = this.findWinningLine(board);
    if (line) {
      const winner = board[line[0]];
      if (winner === 'O') return 10 - depth;
      if (winner === 'X') return depth - 10;
    }
    if (board.every((c) => c !== '')) {
      return 0;
    }

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i += 1) {
        if (board[i] === '') {
          board[i] = 'O';
          best = Math.max(best, this.minimax(board, depth + 1, false));
          board[i] = '';
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i += 1) {
        if (board[i] === '') {
          board[i] = 'X';
          best = Math.min(best, this.minimax(board, depth + 1, true));
          board[i] = '';
        }
      }
      return best;
    }
  }
}
