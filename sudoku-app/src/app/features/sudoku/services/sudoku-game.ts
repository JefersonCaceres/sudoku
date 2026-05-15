import { Injectable } from '@angular/core';
import { SudokuBoardModel } from '../../../core/models/sudoku-board.model';
import { SudokuGenerator } from './sudoku-generator';
import { Difficulty } from '../../../core/models/difficulty.model';

@Injectable({
  providedIn: 'root'
})
export class SudokuGame {

constructor(private readonly sudokuGenerator: SudokuGenerator) {}

 getInitialBoard(difficulty: Difficulty = 'easy'): SudokuBoardModel {
  const solution = this.sudokuGenerator.generateSolution();
  const puzzle = this.sudokuGenerator.createPuzzle(solution, difficulty);

  return puzzle.map((rowValues, row) =>
    rowValues.map((value, col) => ({
      row,
      col,
      value,
      solutionValue: solution[row][col],
      fixed: value !== null,
      error: false
    }))
  );
}
}
