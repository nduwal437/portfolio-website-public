import { Component, OnInit } from '@angular/core';
import { kingDistance, randomSquare, shuffle } from '../square-utils';

interface Feedback {
  correct: boolean;
  message: string;
}

@Component({
  selector: 'app-king-distance-training',
  templateUrl: './king-distance-training.component.html',
  styleUrls: ['./king-distance-training.component.css']
})
export class KingDistanceTrainingComponent implements OnInit {
  squareA = '';
  squareB = '';
  options: number[] = [];
  correctAnswer = 0;
  selected: number | null = null;
  correctCount = 0;
  totalCount = 0;
  feedback: Feedback | null = null;
  awaitingAnswer = true;

  ngOnInit(): void {
    this.nextRound();
  }

  answer(choice: number): void {
    if (!this.awaitingAnswer) {
      return;
    }
    this.selected = choice;
    const correct = choice === this.correctAnswer;
    this.totalCount += 1;
    if (correct) {
      this.correctCount += 1;
    }
    this.feedback = {
      correct,
      message: correct
        ? `Correct! ${this.squareA} to ${this.squareB} is ${this.correctAnswer} king moves.`
        : `Wrong — ${this.squareA} to ${this.squareB} is ${this.correctAnswer} king moves.`
    };
    this.awaitingAnswer = false;
  }

  nextRound(): void {
    this.squareA = randomSquare();
    this.squareB = randomSquare(this.squareA);
    this.correctAnswer = kingDistance(this.squareA, this.squareB);

    const candidates = new Set<number>([this.correctAnswer]);
    let offset = 1;
    while (candidates.size < 4) {
      for (const sign of [-1, 1]) {
        const candidate = this.correctAnswer + sign * offset;
        if (candidate >= 1 && candidate <= 7) {
          candidates.add(candidate);
        }
        if (candidates.size === 4) {
          break;
        }
      }
      offset += 1;
      if (offset > 7) {
        break;
      }
    }

    this.options = shuffle(Array.from(candidates));
    this.selected = null;
    this.feedback = null;
    this.awaitingAnswer = true;
  }

  reset(): void {
    this.correctCount = 0;
    this.totalCount = 0;
    this.nextRound();
  }

  get accuracy(): number {
    return this.totalCount === 0 ? 0 : Math.round((this.correctCount / this.totalCount) * 100);
  }

  optionClass(option: number): string {
    if (this.awaitingAnswer || this.selected === null) {
      return '';
    }
    if (option === this.correctAnswer) {
      return 'option-correct';
    }
    if (option === this.selected) {
      return 'option-wrong';
    }
    return '';
  }

  trackByOption(_: number, option: number): number {
    return option;
  }
}
