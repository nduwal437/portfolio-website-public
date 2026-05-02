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
    }
  ];

  trackByTitle(_: number, item: GameTile): string {
    return item.title;
  }
}
