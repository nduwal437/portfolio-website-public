import { Component, OnInit } from '@angular/core';
import { PieceType, allSquares, pickN, pieceAttacksFrom, pieceLabel, randomSquare, shuffle } from '../square-utils';

interface Feedback {
  correct: boolean;
  message: string;
}

const PIECES: PieceType[] = ['bishop', 'rook', 'queen', 'knight', 'king'];

@Component({
  selector: 'app-piece-sight-training',
  templateUrl: './piece-sight-training.component.html',
  styleUrls: ['../drill-shared.css', './piece-sight-training.component.css']
})
export class PieceSightTrainingComponent implements OnInit {
  piece: PieceType = 'bishop';
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

  get prompt(): string {
    return `${pieceLabel(this.piece)} on ${this.square} — which square does it attack?`;
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
        ? `Correct! ${this.piece} on ${this.square} attacks ${this.correctAnswer}.`
        : `Wrong — ${this.piece} on ${this.square} attacks ${this.correctAnswer}.`
    };
    this.awaitingAnswer = false;
  }

  nextRound(): void {
    this.piece = PIECES[Math.floor(Math.random() * PIECES.length)];
    this.square = randomSquare(this.square);
    const attacked = pieceAttacksFrom(this.piece, this.square);
    if (attacked.length === 0) {
      this.nextRound();
      return;
    }
    this.correctAnswer = pickN(attacked, 1)[0];
    const attackedSet = new Set(attacked);
    const distractorPool = allSquares().filter(sq => sq !== this.square && !attackedSet.has(sq));
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
