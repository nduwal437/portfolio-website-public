import { Component, OnInit } from '@angular/core';
import { allSquares, isKnightMove, knightMovesFrom, pickN, randomSquare, shuffle } from '../square-utils';

interface Feedback {
  correct: boolean;
  message: string;
}

@Component({
  selector: 'app-knight-move-training',
  templateUrl: './knight-move-training.component.html',
  styleUrls: ['../drill-shared.css', './knight-move-training.component.css']
})
export class KnightMoveTrainingComponent implements OnInit {
  square = '';
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
        ? `Correct! ${this.correctAnswer} is one knight hop from ${this.square}.`
        : `Wrong — ${this.correctAnswer} is the knight hop from ${this.square}.`
    };
    this.awaitingAnswer = false;
  }

  nextRound(): void {
    this.square = randomSquare(this.square);
    const hops = knightMovesFrom(this.square);
    this.correctAnswer = pickN(hops, 1)[0];
    const distractorPool = allSquares().filter(sq => sq !== this.square && !isKnightMove(this.square, sq));
    const distractors = pickN(distractorPool, 3);
    this.options = shuffle([this.correctAnswer, ...distractors]);
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
