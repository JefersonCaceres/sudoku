import { TestBed } from '@angular/core/testing';

import { SudokuGenerator } from './sudoku-generator';

describe('SudokuGenerator', () => {
  let service: SudokuGenerator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SudokuGenerator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
