import { Component, OnInit } from '@angular/core';
import { SudokuBoardModel } from '../../../../core/models/sudoku-board.model';
import { SudokuGame } from '../../services/sudoku-game';
import { Board } from '../../components/board/board';

@Component({
  selector: 'app-game',
  imports: [Board],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class Game implements OnInit {
  board: SudokuBoardModel = [];

  constructor(private readonly sudokuGame: SudokuGame) {}

  ngOnInit(): void {
    this.board = this.sudokuGame.getInitialBoard();
  }
}