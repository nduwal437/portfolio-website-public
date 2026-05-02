import { Component, OnInit } from '@angular/core';
import { allSquares, isKnightMove, knightMovesFrom, pickN, randomSquare, shuffle } from '../square-utils';

interface Feedback {
  correct: boolean;
  message: string;
}

@Component({
  selector: 'app-fork-square-training',
  templateUrl: './fork-square-training.component.html',
  styleUrls: ['../drill-shared.css', './fork-square-training.component.css']
})
export class ForkSquareTrainingComponent implements OnInit {
  targetA = '';
  targetB = '';
  options: string[] = [];
  correctAnswer = '';
  selected: string | null = null;
  correctCount = 0;
  totalCount = 0;
  feedback: Feedback | null = null;
  awaitingAnswer = true;

  ngOnInit(): void {
    this.nextRound();
  }

  answer(choice: string): void {
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
        ? `Correct! A knight on ${this.correctAnswer} forks ${this.targetA} and ${this.targetB}.`
        : `Wrong — a knight on ${this.correctAnswer} forks ${this.targetA} and ${this.targetB}.`
    };
    this.awaitingAnswer = false;
  }

  nextRound(): void {
    let attempts = 0;
    while (attempts < 50) {
      attempts++;
      const a = randomSquare();
      const b = randomSquare(a);
      const aHops = new Set(knightMovesFrom(a));
      const forkSquares = knightMovesFrom(b).filter(sq => aHops.has(sq) && sq !== a && sq !== b);
      if (forkSquares.length === 0) {
        continue;
      }
      this.targetA = a;
      this.targetB = b;
      this.correctAnswer = pickN(forkSquares, 1)[0];
      const distractorPool = allSquares().filter(
        sq => sq !== a && sq !== b && sq !== this.correctAnswer && !(isKnightMove(sq, a) && isKnightMove(sq, b))
      );
      const distractors = pickN(distractorPool, 3);
      this.options = shuffle([this.correctAnswer, ...distractors]);
      this.selected = null;
      this.feedback = null;
      this.awaitingAnswer = true;
      return;
    }
  }

  reset(): void {
    this.correctCount = 0;
    this.totalCount = 0;
    this.nextRound();
  }

  get accuracy(): number {
    return this.totalCount === 0 ? 0 : Math.round((this.correctCount / this.totalCount) * 100);
  }

  optionClass(option: string): string {
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

  trackByOption(_: number, option: string): string {
    return option;
  }
}
