import { Component } from '@angular/core';

interface DrillTile {
  title: string;
  description: string;
  link: string;
  available: boolean;
}

@Component({
  selector: 'app-blindfold',
  templateUrl: './blindfold.component.html',
  styleUrls: ['./blindfold.component.css']
})
export class BlindfoldComponent {
  readonly drills: DrillTile[] = [
    {
      title: 'Board Geometry',
      description: 'Color, diagonals, distance — the mental grid of files and ranks.',
      link: '/games/chess/blindfold/board-geometry',
      available: true
    },
    {
      title: 'Single-Piece Visualization',
      description: 'See where one piece can reach without looking at the board.',
      link: '/games/chess/blindfold/single-piece',
      available: true
    },
    {
      title: 'Two-Piece Interactions',
      description: 'Forks, attackers, defenders — relationships between two pieces.',
      link: '/games/chess/blindfold/two-piece',
      available: true
    },
    {
      title: 'Move-Sequence Memory',
      description: 'Track a short opening line in your head, then answer about the position.',
      link: '/games/chess/blindfold/move-sequence',
      available: true
    }
  ];

  trackByTitle(_: number, item: DrillTile): string {
    return item.title;
  }
}
