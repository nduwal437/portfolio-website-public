import { Component, OnInit } from '@angular/core';
import { allSquares, pickN, shuffle } from '../square-utils';
import { MOVE_SEQUENCES, MoveSequence, pieceDisplayName } from '../move-sequences';

interface Feedback {
  correct: boolean;
  message: string;
}

@Component({
  selector: 'app-where-piece-training',
  templateUrl: './where-piece-training.component.html',
  styleUrls: ['../drill-shared.css', './where-piece-training.component.css']
})
export class WherePieceTrainingComponent implements OnInit {
  sequence: MoveSequence = MOVE_SEQUENCES[0];
  pieceLabel = '';
  options: string[] = [];
  correctAnswer = '';
  selected: string | null = null;
  correctCount = 0;
  totalCount = 0;
  feedback: Feedback | null = null;
  awaitingAnswer = true;
  movesRevealed = true;

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
        ? `Correct! The ${this.pieceLabel.toLowerCase()} is on ${this.correctAnswer}.`
        : `Wrong — the ${this.pieceLabel.toLowerCase()} is on ${this.correctAnswer}.`
    };
    this.awaitingAnswer = false;
    this.movesRevealed = true;
  }

  nextRound(): void {
    let attempts = 0;
    while (attempts < 30) {
      attempts++;
      const candidate = MOVE_SEQUENCES[Math.floor(Math.random() * MOVE_SEQUENCES.length)];
      const entries = Object.entries(candidate.position);
      // Group squares by piece label so we only quiz pieces with one occurrence.
      const byLabel: Record<string, string[]> = {};
      for (const [sq, symbol] of entries) {
        const label = pieceDisplayName(symbol);
        (byLabel[label] = byLabel[label] || []).push(sq);
      }
      const uniqueLabels = Object.keys(byLabel).filter(label => byLabel[label].length === 1);
      if (uniqueLabels.length === 0) {
        continue;
      }
      const chosenLabel = pickN(uniqueLabels, 1)[0];
      this.sequence = candidate;
      this.pieceLabel = chosenLabel;
      this.correctAnswer = byLabel[chosenLabel][0];

      const occupied = new Set(entries.map(([sq]) => sq));
      const distractorPool = allSquares().filter(sq => sq !== this.correctAnswer && !occupied.has(sq));
      const distractors = pickN(distractorPool, 3);
      this.options = shuffle([this.correctAnswer, ...distractors]);
      this.selected = null;
      this.feedback = null;
      this.awaitingAnswer = true;
      this.movesRevealed = true;
      return;
    }
  }

  hideMoves(): void {
    this.movesRevealed = false;
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
