import { Component, OnInit } from '@angular/core';
import { SudokuBoardModel } from '../../../../core/models/sudoku-board.model';
import { SudokuGame } from '../../services/sudoku-game';
import { Board } from '../../components/board/board';
import { ActivatedRoute } from '@angular/router';
import { Difficulty } from '../../../../core/models/difficulty.model';

@Component({
  selector: 'app-game',
  imports: [Board],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class Game implements OnInit {
  board: SudokuBoardModel = [];

  constructor(private readonly sudokuGame: SudokuGame,
    private readonly route: ActivatedRoute
  ) {}

  difficulty: Difficulty = 'easy';

ngOnInit(): void {
  const difficultyParam = this.route.snapshot.queryParamMap.get('difficulty') as Difficulty | null;

  if (difficultyParam) {
    this.difficulty = difficultyParam;
  }
}
}