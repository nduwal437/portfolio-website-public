import { Component, OnInit } from '@angular/core';

type SquareColor = 'light' | 'dark';

interface Feedback {
  correct: boolean;
  message: string;
}

@Component({
  selector: 'app-color-training',
  templateUrl: './color-training.component.html',
  styleUrls: ['./color-training.component.css']
})
export class ColorTrainingComponent implements OnInit {
  private static readonly FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  square = '';
  correctCount = 0;
  totalCount = 0;
  feedback: Feedback | null = null;
  awaitingAnswer = true;

  ngOnInit(): void {
    this.nextSquare();
  }

  answer(choice: SquareColor): void {
    if (!this.awaitingAnswer) {
      return;
    }
    const actual = this.colorOf(this.square);
    const correct = choice === actual;
    this.totalCount += 1;
    if (correct) {
      this.correctCount += 1;
    }
    this.feedback = {
      correct,
      message: correct ? 'Correct!' : `Wrong — ${this.square} is ${actual}.`
    };
    this.awaitingAnswer = false;
  }

  nextSquare(): void {
    this.square = this.randomSquare(this.square);
    this.feedback = null;
    this.awaitingAnswer = true;
  }

  reset(): void {
    this.correctCount = 0;
    this.totalCount = 0;
    this.nextSquare();
  }

  get accuracy(): number {
    return this.totalCount === 0 ? 0 : Math.round((this.correctCount / this.totalCount) * 100);
  }

  private randomSquare(exclude: string): string {
    let next = exclude;
    while (next === exclude) {
      const file = ColorTrainingComponent.FILES[Math.floor(Math.random() * 8)];
      const rank = Math.floor(Math.random() * 8) + 1;
      next = `${file}${rank}`;
    }
    return next;
  }

  private colorOf(square: string): SquareColor {
    const fileIndex = ColorTrainingComponent.FILES.indexOf(square[0]);
    const rank = parseInt(square.slice(1), 10);
    // a1 is dark (fileIndex 0 + rank 1 = 1, odd → dark). h1 is light (7+1=8, even → light).
    return (fileIndex + rank) % 2 === 0 ? 'light' : 'dark';
  }
}
