export interface SudokuCell {
  row: number;
  col: number;
  value: number | null;
  fixed: boolean;
  error: boolean;
}