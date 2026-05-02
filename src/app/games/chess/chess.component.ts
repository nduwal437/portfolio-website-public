import { Component } from '@angular/core';

interface ChessModeTile {
  title: string;
  description: string;
  link: string;
  available: boolean;
}

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.css']
})
export class ChessComponent {
  readonly modes: ChessModeTile[] = [
    {
      title: 'Visualization Training',
      description: 'Train your ability to visualize the board without seeing the pieces.',
      link: '/games/chess/visualization',
      available: true
    }
  ];

  trackByTitle(_: number, item: ChessModeTile): string {
    return item.title;
  }
}
