import { Component, OnInit } from '@angular/core';
import { colorOf, randomSquare } from '../square-utils';

type SameAnswer = 'same' | 'different';

interface Feedback {
  correct: boolean;
  message: string;
}

@Component({
  selector: 'app-same-color-training',
  templateUrl: './same-color-training.component.html',
  styleUrls: ['./same-color-training.component.css']
})
export class SameColorTrainingComponent implements OnInit {
  squareA = '';
  squareB = '';
  correctCount = 0;
  totalCount = 0;
  feedback: Feedback | null = null;
  awaitingAnswer = true;

  ngOnInit(): void {
    this.nextRound();
  }

  answer(choice: SameAnswer): void {
    if (!this.awaitingAnswer) {
      return;
    }
    const actual: SameAnswer = colorOf(this.squareA) === colorOf(this.squareB) ? 'same' : 'different';
    const correct = choice === actual;
    this.totalCount += 1;
    if (correct) {
      this.correctCount += 1;
    }
    this.feedback = {
      correct,
      message: correct
        ? 'Correct!'
        : `Wrong — ${this.squareA} is ${colorOf(this.squareA)}, ${this.squareB} is ${colorOf(this.squareB)}.`
    };
    this.awaitingAnswer = false;
  }

  nextRound(): void {
    this.squareA = randomSquare();
    this.squareB = randomSquare(this.squareA);
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
}
