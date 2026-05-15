import { Routes } from '@angular/router';
import { Home } from './features/sudoku/pages/home/home';
import { Game } from './features/sudoku/pages/game/game';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'game',
    component: Game
  }
];