import { NgModule } from '@angular/core';
import { RouterModule, Routes, NoPreloading } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProjectsComponent } from './projects/projects.component';
import { SkillsComponent } from './skills/skills.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { GamesComponent } from './games/games.component';
import { ChessComponent } from './games/chess/chess.component';
import { BlindfoldComponent } from './games/chess/blindfold/blindfold.component';
import { CategoryComponent } from './games/chess/blindfold/category/category.component';
import { ColorTrainingComponent } from './games/chess/blindfold/color-training/color-training.component';
import { DiagonalTrainingComponent } from './games/chess/blindfold/diagonal-training/diagonal-training.component';
import { SameColorTrainingComponent } from './games/chess/blindfold/same-color-training/same-color-training.component';
import { KingDistanceTrainingComponent } from './games/chess/blindfold/king-distance-training/king-distance-training.component';
import { PieceSightTrainingComponent } from './games/chess/blindfold/piece-sight-training/piece-sight-training.component';
import { KnightMoveTrainingComponent } from './games/chess/blindfold/knight-move-training/knight-move-training.component';
import { ForkSquareTrainingComponent } from './games/chess/blindfold/fork-square-training/fork-square-training.component';
import { AttackerPickTrainingComponent } from './games/chess/blindfold/attacker-pick-training/attacker-pick-training.component';
import { WhatsOnSquareTrainingComponent } from './games/chess/blindfold/whats-on-square-training/whats-on-square-training.component';
import { WherePieceTrainingComponent } from './games/chess/blindfold/where-piece-training/where-piece-training.component';
import { AuthGuard } from './guards/auth.guard';

const boardGeometryCategory = {
  title: 'Board Geometry',
  subtitle: 'Drills that build a mental grid of files, ranks, and squares.',
  drills: [
    {
      title: 'Color Training',
      description: 'A square is named — answer whether it is light or dark.',
      link: '/games/chess/blindfold/board-geometry/color',
      available: true
    },
    {
      title: 'Diagonal Naming',
      description: 'Pick which of four squares lies on a diagonal from the prompt.',
      link: '/games/chess/blindfold/board-geometry/diagonal',
      available: true
    },
    {
      title: 'Same-Color Pair',
      description: 'Two squares — decide if they share the same color.',
      link: '/games/chess/blindfold/board-geometry/same-color',
      available: true
    },
    {
      title: 'King Distance',
      description: 'How many king moves separate two squares?',
      link: '/games/chess/blindfold/board-geometry/king-distance',
      available: true
    }
  ]
};

const singlePieceCategory = {
  title: 'Single-Piece Visualization',
  subtitle: 'See where one piece can reach without looking at the board.',
  drills: [
    {
      title: 'Piece Sight',
      description: 'Pick the square attacked by the named piece.',
      link: '/games/chess/blindfold/single-piece/piece-sight',
      available: true
    },
    {
      title: 'Knight Move',
      description: 'Which of four squares is one knight hop away?',
      link: '/games/chess/blindfold/single-piece/knight-move',
      available: true
    }
  ]
};

const twoPieceCategory = {
  title: 'Two-Piece Interactions',
  subtitle: 'Forks, attackers, and defenders — relationships between two pieces.',
  drills: [
    {
      title: 'Fork Square',
      description: 'Where can a knight land to fork both targets?',
      link: '/games/chess/blindfold/two-piece/fork',
      available: true
    },
    {
      title: 'Attacker Pick',
      description: 'Which piece-on-square attacks the target?',
      link: '/games/chess/blindfold/two-piece/attacker',
      available: true
    }
  ]
};

const moveSequenceCategory = {
  title: 'Move-Sequence Memory',
  subtitle: 'Read a short opening line, then answer questions about the position.',
  drills: [
    {
      title: "What's on the Square?",
      description: 'After the moves, identify what occupies a target square.',
      link: '/games/chess/blindfold/move-sequence/whats-on-square',
      available: true
    },
    {
      title: 'Where is the Piece?',
      description: 'After the moves, locate a named piece on the board.',
      link: '/games/chess/blindfold/move-sequence/where-piece',
      available: true
    }
  ]
};

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'shopping-list',
    component: ShoppingListComponent,
    canActivate: [AuthGuard]
  },
  { path: 'games', component: GamesComponent },
  { path: 'games/chess', component: ChessComponent },
  { path: 'games/chess/blindfold', component: BlindfoldComponent },

  {
    path: 'games/chess/blindfold/board-geometry',
    component: CategoryComponent,
    data: { category: boardGeometryCategory }
  },
  { path: 'games/chess/blindfold/board-geometry/color', component: ColorTrainingComponent },
  { path: 'games/chess/blindfold/board-geometry/diagonal', component: DiagonalTrainingComponent },
  { path: 'games/chess/blindfold/board-geometry/same-color', component: SameColorTrainingComponent },
  { path: 'games/chess/blindfold/board-geometry/king-distance', component: KingDistanceTrainingComponent },

  { path: 'games/chess/blindfold/single-piece', component: CategoryComponent, data: { category: singlePieceCategory } },
  { path: 'games/chess/blindfold/single-piece/piece-sight', component: PieceSightTrainingComponent },
  { path: 'games/chess/blindfold/single-piece/knight-move', component: KnightMoveTrainingComponent },

  { path: 'games/chess/blindfold/two-piece', component: CategoryComponent, data: { category: twoPieceCategory } },
  { path: 'games/chess/blindfold/two-piece/fork', component: ForkSquareTrainingComponent },
  { path: 'games/chess/blindfold/two-piece/attacker', component: AttackerPickTrainingComponent },

  {
    path: 'games/chess/blindfold/move-sequence',
    component: CategoryComponent,
    data: { category: moveSequenceCategory }
  },
  { path: 'games/chess/blindfold/move-sequence/whats-on-square', component: WhatsOnSquareTrainingComponent },
  { path: 'games/chess/blindfold/move-sequence/where-piece', component: WherePieceTrainingComponent },

  { path: '**', redirectTo: '' } // Wildcard route - must be last
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false, // Set to true for debugging
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
      preloadingStrategy: NoPreloading // Using the actual NoPreloading class
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
