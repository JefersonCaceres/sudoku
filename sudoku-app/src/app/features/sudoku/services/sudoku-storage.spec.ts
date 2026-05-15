import { TestBed } from '@angular/core/testing';

import { SudokuStorage } from './sudoku-storage';

describe('SudokuStorage', () => {
  let service: SudokuStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SudokuStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
