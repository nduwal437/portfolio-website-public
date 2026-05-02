import { Component, OnInit } from '@angular/core';
import { PieceType, allSquares, pickN, pieceAttacksFrom, pieceLabel, randomSquare, shuffle } from '../square-utils';

interface Feedback {
  correct: boolean;
  message: string;
}

interface AttackerOption {
  piece: PieceType;
  square: string;
  label: string;
}

const PIECES: PieceType[] = ['bishop', 'rook', 'queen', 'knight', 'king'];

@Component({
  selector: 'app-attacker-pick-training',
  templateUrl: './attacker-pick-training.component.html',
  styleUrls: ['../drill-shared.css', './attacker-pick-training.component.css']
})
export class AttackerPickTrainingComponent implements OnInit {
  target = '';
  options: AttackerOption[] = [];
  correctIndex = 0;
  selectedIndex: number | null = null;
  correctCount = 0;
  totalCount = 0;
  feedback: Feedback | null = null;
  awaitingAnswer = true;

  ngOnInit(): void {
    this.nextRound();
  }

  answer(index: number): void {
    if (!this.awaitingAnswer) {
      return;
    }
    this.selectedIndex = index;
    const correct = index === this.correctIndex;
    this.totalCount += 1;
    if (correct) {
      this.correctCount += 1;
    }
    const winner = this.options[this.correctIndex];
    this.feedback = {
      correct,
      message: correct
        ? `Correct! ${winner.label} attacks ${this.target}.`
        : `Wrong — ${winner.label} attacks ${this.target}.`
    };
    this.awaitingAnswer = false;
  }

  nextRound(): void {
    let attempts = 0;
    while (attempts < 60) {
      attempts++;
      const target = randomSquare();
      const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
      const attackerCandidates = pieceAttacksFrom(piece, target).filter(sq => sq !== target);
      if (attackerCandidates.length === 0) {
        continue;
      }
      const attackerSquare = pickN(attackerCandidates, 1)[0];

      const distractorPool: AttackerOption[] = [];
      for (const dPiece of PIECES) {
        const attacks = new Set(pieceAttacksFrom(dPiece, target));
        for (const dSq of allSquares()) {
          if (dSq === target || dSq === attackerSquare) {
            continue;
          }
          if (!attacks.has(dSq)) {
            distractorPool.push({
              piece: dPiece,
              square: dSq,
              label: `${pieceLabel(dPiece)} on ${dSq}`
            });
          }
        }
      }
      const distractors = pickN(distractorPool, 3);
      const correctOption: AttackerOption = {
        piece,
        square: attackerSquare,
        label: `${pieceLabel(piece)} on ${attackerSquare}`
      };
      const ordered = shuffle([correctOption, ...distractors]);
      this.target = target;
      this.options = ordered;
      this.correctIndex = ordered.indexOf(correctOption);
      this.selectedIndex = null;
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

  optionClass(index: number): string {
    if (this.awaitingAnswer || this.selectedIndex === null) {
      return '';
    }
    if (index === this.correctIndex) {
      return 'option-correct';
    }
    if (index === this.selectedIndex) {
      return 'option-wrong';
    }
    return '';
  }

  trackByIndex(index: number): number {
    return index;
  }
}
