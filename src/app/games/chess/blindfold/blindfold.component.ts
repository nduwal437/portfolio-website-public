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
      title: 'Color Training',
      description: 'A square is named — answer whether it is light or dark without looking at the board.',
      link: '/games/chess/blindfold/color',
      available: true
    }
  ];

  trackByTitle(_: number, item: DrillTile): string {
    return item.title;
  }
}
