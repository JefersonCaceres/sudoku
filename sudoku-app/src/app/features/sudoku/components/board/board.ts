import { Component, Input, HostListener, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuBoardModel } from '../../../../core/models/sudoku-board.model';
import { Difficulty } from '../../../../core/models/difficulty.model';
import { SudokuGame } from '../../services/sudoku-game';
import { SudokuStorage } from '../../services/sudoku-storage';
import { SudokuRecord } from '../../../../core/models/sudoku-record.model';


@Component({
  selector: 'app-board',
  imports: [CommonModule],
  templateUrl: './board.html',
  styleUrl: './board.css'
})

export class Board implements OnInit, OnDestroy{
  @Input() board: SudokuBoardModel = [];
  selectedRow: number | null = null;
  selectedCol: number | null = null;
  errors = 0;
  maxErrors = 3;
  seconds = signal(0);
  timerId: ReturnType<typeof setInterval> | null = null;
  paused = false;
  gameCompleted = false;
  difficulty: Difficulty = 'easy';

constructor(private readonly sudokuGame: SudokuGame,
  private readonly sudokuStorage: SudokuStorage) {}

  ngOnInit(): void {

  const savedGame = this.sudokuStorage.loadGame();

  if (savedGame) {

    this.board = savedGame.board;
    this.errors = savedGame.errors;
    this.helpsUsed = savedGame.helpsUsed;
    this.difficulty = savedGame.difficulty;

    this.seconds.set(savedGame.seconds);

  } else {

    this.newGame(this.difficulty);
  }

  this.startTimer();
}

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  selectCell(row: number, col: number): void {
    if (this.gameCompleted) {
      return;
    }
    if (this.paused) {
      return;
    }
    this.selectedRow = row;
    this.selectedCol = col;
  }

  isSelected(row: number, col: number): boolean {
    return this.selectedRow === row && this.selectedCol === col;
  } 

  resetBoard(): void {
    window.location.reload();
  }

  isSameRow(row: number): boolean {
  return this.selectedRow === row;
}

  isSameCol(col: number): boolean {
    return this.selectedCol === col;
  }

  isSameBlock(row: number, col: number): boolean {
    if (this.selectedRow === null || this.selectedCol === null) {
      return false;
    }

    const selectedBlockRow = Math.floor(this.selectedRow / 3);
    const selectedBlockCol = Math.floor(this.selectedCol / 3);

    const currentBlockRow = Math.floor(row / 3);
    const currentBlockCol = Math.floor(col / 3);

    return selectedBlockRow === currentBlockRow &&
          selectedBlockCol === currentBlockCol;
  }

  isHighlighted(row: number, col: number): boolean {
    return this.isSameRow(row) ||
          this.isSameCol(col) ||
          this.isSameBlock(row, col);
  }


  setCellValue(number: number): void {
      if (this.gameCompleted) {
        return;
      }

      if (this.paused) {
        return;
      }

      if (this.selectedRow === null || this.selectedCol === null) {
        return;
      }

      const cell = this.board[this.selectedRow][this.selectedCol];

      if (cell.fixed) {
        return;
      }

      cell.value = number;

      if (number !== cell.solutionValue) {

        cell.error = true;

        this.errors++;

        if (this.errors >= this.maxErrors) {

          alert('Perdiste la partida');

          this.resetBoard();
        }

        return;
      }

      cell.error = false;
      this.checkWin();
      this.saveGame();
    }

  @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {

      if (event.key === 'Backspace' || event.key === 'Delete') {
        this.clearSelectedCell();
      return;
      }

      const number = Number(event.key);

      if (number < 1 || number > 9) {
        return;
      }

      this.setCellValue(number);
  }

  clearSelectedCell(): void {
  if (this.gameCompleted) {
    return;
  }    

  if (this.paused) {
    return;
  }
  if (this.selectedRow === null || this.selectedCol === null) {
    return;
  }

  const cell = this.board[this.selectedRow][this.selectedCol];

  if (cell.fixed) {
    return;
  }

  cell.value = null;
  cell.error = false;
  this.saveGame();
}

helpsUsed = 0;
maxHelps = 3;

useHelp(): void {
  if (this.gameCompleted) {
    return;
  }  
  if (this.helpsUsed >= this.maxHelps) {
    return;
  }

  if (this.selectedRow === null || this.selectedCol === null) {
    return;
  }

  const cell = this.board[this.selectedRow][this.selectedCol];

  if (cell.fixed) {
    return;
  }

  cell.value = cell.solutionValue;
  cell.error = false;
  cell.fixed = true;

  this.helpsUsed++;
  this.saveGame();
}


startTimer(): void {
  this.timerId = setInterval(() => {
    if (!this.paused) {
      this.seconds.update(value => value + 1);
    }
  }, 1000);
}

togglePause(): void {
  this.paused = !this.paused;
}

getFormattedTime(): string {
  const totalSeconds = this.seconds();

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

checkWin(): void {

  const completed = this.board.every(row =>
    row.every(cell =>
      cell.value === cell.solutionValue && !cell.error
    )
  );

  if (!completed) {
    return;
  }

  this.gameCompleted = true;
  this.paused = true;

  const record: SudokuRecord = {
    difficulty: this.difficulty,
    seconds: this.seconds(),
    date: new Date().toISOString()
  };

  this.sudokuStorage.saveRecord(record);
  this.sudokuStorage.clearGame();

  alert(`Ganaste. Tiempo: ${this.getFormattedTime()}`);
}

newGame(difficulty: Difficulty): void {

  this.difficulty = difficulty;

  this.board = this.sudokuGame.getInitialBoard(difficulty);

  this.errors = 0;
  this.helpsUsed = 0;
  this.seconds.set(0);

  this.gameCompleted = false;
  this.paused = false;

  this.selectedRow = null;
  this.selectedCol = null;
  this.saveGame();
}

saveGame(): void {
  if (this.gameCompleted) {
    return;
  }

  this.sudokuStorage.saveGame({
    board: this.board,
    errors: this.errors,
    helpsUsed: this.helpsUsed,
    difficulty: this.difficulty,
    seconds: this.seconds()
  });
}
getDifficultyRecords(): SudokuRecord[] {

  return this.sudokuStorage
    .getRecords()
    .filter(record => record.difficulty === this.difficulty)
    .sort((a, b) => a.seconds - b.seconds)
    .slice(0, 10);
}

formatRecordTime(totalSeconds: number): string {

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

}