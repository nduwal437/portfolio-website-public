import { Component, OnInit } from '@angular/core';
import { pickN, randomSquare, shuffle } from '../square-utils';
import { MOVE_SEQUENCES, MoveSequence, pieceDisplayName } from '../move-sequences';

interface Feedback {
  correct: boolean;
  message: string;
}

const EMPTY_LABEL = 'Empty';

@Component({
  selector: 'app-whats-on-square-training',
  templateUrl: './whats-on-square-training.component.html',
  styleUrls: ['../drill-shared.css', './whats-on-square-training.component.css']
})
export class WhatsOnSquareTrainingComponent implements OnInit {
  sequence: MoveSequence = MOVE_SEQUENCES[0];
  targetSquare = '';
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
        ? `Correct! ${this.targetSquare} is ${this.correctAnswer.toLowerCase()}.`
        : `Wrong — ${this.targetSquare} is ${this.correctAnswer.toLowerCase()}.`
    };
    this.awaitingAnswer = false;
    this.movesRevealed = true;
  }

  nextRound(): void {
    this.sequence = MOVE_SEQUENCES[Math.floor(Math.random() * MOVE_SEQUENCES.length)];
    const occupied = Object.keys(this.sequence.position);

    // Pick the target square — usually occupied, sometimes empty for variety.
    const askEmpty = Math.random() < 0.25 || occupied.length === 0;
    if (askEmpty) {
      let candidate = randomSquare();
      while (occupied.includes(candidate)) {
        candidate = randomSquare(candidate);
      }
      this.targetSquare = candidate;
      this.correctAnswer = EMPTY_LABEL;
    } else {
      this.targetSquare = pickN(occupied, 1)[0];
      this.correctAnswer = pieceDisplayName(this.sequence.position[this.targetSquare]);
    }

    const allLabels = new Set<string>();
    for (const symbol of Object.values(this.sequence.position)) {
      allLabels.add(pieceDisplayName(symbol));
    }
    allLabels.add(EMPTY_LABEL);
    allLabels.add('White pawn');
    allLabels.add('Black pawn');
    allLabels.add('White knight');
    allLabels.add('Black knight');
    allLabels.delete(this.correctAnswer);

    const distractors = pickN(Array.from(allLabels), 3);
    this.options = shuffle([this.correctAnswer, ...distractors]);
    this.selected = null;
    this.feedback = null;
    this.awaitingAnswer = true;
    this.movesRevealed = true;
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
