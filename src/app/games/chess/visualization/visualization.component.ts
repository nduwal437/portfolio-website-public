import { Component } from '@angular/core';

interface DrillTile {
  title: string;
  description: string;
  link: string;
  available: boolean;
}

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent {
  readonly drills: DrillTile[] = [
    {
      title: 'Board Geometry',
      description: 'Color, diagonals, distance — the mental grid of files and ranks.',
      link: '/games/chess/visualization/board-geometry',
      available: true
    },
    {
      title: 'Single-Piece Visualization',
      description: 'See where one piece can reach without looking at the board.',
      link: '/games/chess/visualization/single-piece',
      available: true
    },
    {
      title: 'Two-Piece Interactions',
      description: 'Forks, attackers, defenders — relationships between two pieces.',
      link: '/games/chess/visualization/two-piece',
      available: true
    },
    {
      title: 'Move-Sequence Memory',
      description: 'Track a short opening line in your head, then answer about the position.',
      link: '/games/chess/visualization/move-sequence',
      available: true
    }
  ];

  trackByTitle(_: number, item: DrillTile): string {
    return item.title;
  }
}
