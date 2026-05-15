export interface SudokuCell {
  row: number;
  col: number;
  value: number | null;
  solutionValue: number;
  fixed: boolean;
  error: boolean;
}