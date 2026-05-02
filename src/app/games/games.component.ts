import { Component } from '@angular/core';

interface GameTile {
  title: string;
  description: string;
  link: string;
  available: boolean;
}

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent {
  readonly games: GameTile[] = [
    {
      title: 'Chess',
      description: 'Sharpen your chess intuition with focused training drills.',
      link: '/games/chess',
      available: true
    },
    {
      title: 'Tic Tac Toe',
      description: 'Classic 3-in-a-row. Play against the machine or a friend.',
      link: '/games/tic-tac-toe',
      available: true
    }
  ];

  trackByTitle(_: number, item: GameTile): string {
    return item.title;
  }
}
