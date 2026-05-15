import { Injectable } from '@angular/core';
import { SudokuRecord } from '../../../core/models/sudoku-record.model';

@Injectable({
  providedIn: 'root'
})
export class SudokuStorage {

  private readonly STORAGE_KEY = 'sudoku-game';
  private readonly RECORDS_KEY = 'sudoku-records';

  saveGame(data: unknown): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  loadGame(): any {
    if (!this.isBrowser()) {
      return null;
    }

    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearGame(): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.removeItem(this.STORAGE_KEY);
  }

  saveRecord(record: SudokuRecord): void {
    if (!this.isBrowser()) {
      return;
    }

    const records = this.getRecords();

    records.push(record);

    const topRecords = records
      .filter(item => item.difficulty === record.difficulty)
      .sort((a, b) => a.seconds - b.seconds)
      .slice(0, 10);

    const otherRecords = records.filter(
      item => item.difficulty !== record.difficulty
    );

    localStorage.setItem(
      this.RECORDS_KEY,
      JSON.stringify([...otherRecords, ...topRecords])
    );
  }

  getRecords(): SudokuRecord[] {
    if (!this.isBrowser()) {
      return [];
    }

    const data = localStorage.getItem(this.RECORDS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' &&
           typeof localStorage !== 'undefined';
  }
}