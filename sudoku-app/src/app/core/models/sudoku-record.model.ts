import { Difficulty } from './difficulty.model';

export interface SudokuRecord {
  difficulty: Difficulty;
  seconds: number;
  date: string;
}