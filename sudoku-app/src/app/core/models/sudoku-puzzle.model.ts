import { Difficulty } from './difficulty.model';

export interface SudokuPuzzle {
  difficulty: Difficulty;
  puzzle: (number | null)[][];
  solution: number[][];
}