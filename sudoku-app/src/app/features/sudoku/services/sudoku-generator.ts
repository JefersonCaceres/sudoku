import { Injectable } from '@angular/core';
import { Difficulty } from '../../../core/models/difficulty.model';

@Injectable({
  providedIn: 'root'
})
export class SudokuGenerator {

  generateSolution(): number[][] {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));

    this.fillBoard(board);

    return board;
  }

  createPuzzle(solution: number[][], difficulty: Difficulty): (number | null)[][] {
    const puzzle: (number | null)[][] = solution.map(row => [...row]);

    const cellsToRemove = this.getCellsToRemove(difficulty);
    let removed = 0;

    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (puzzle[row][col] !== null) {
        puzzle[row][col] = null;
        removed++;
      }
    }

    return puzzle;
  }

  private fillBoard(board: number[][]): boolean {
    const emptyCell = this.findEmptyCell(board);

    if (!emptyCell) {
      return true;
    }

    const [row, col] = emptyCell;
    const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const number of numbers) {
      if (this.isValid(board, row, col, number)) {
        board[row][col] = number;

        if (this.fillBoard(board)) {
          return true;
        }

        board[row][col] = 0;
      }
    }

    return false;
  }

  private findEmptyCell(board: number[][]): [number, number] | null {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          return [row, col];
        }
      }
    }

    return null;
  }

  private isValid(board: number[][], row: number, col: number, number: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === number || board[i][col] === number) {
        return false;
      }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (board[r][c] === number) {
          return false;
        }
      }
    }

    return true;
  }

  private shuffle(numbers: number[]): number[] {
    return numbers.sort(() => Math.random() - 0.5);
  }

  private getCellsToRemove(difficulty: Difficulty): number {
    switch (difficulty) {
      case 'easy':
        return 35;
      case 'medium':
        return 45;
      case 'hard':
        return 52;
      case 'extreme':
        return 58;
      case 'master':
        return 62;
    }
  }
}
