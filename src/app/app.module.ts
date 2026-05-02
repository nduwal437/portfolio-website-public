import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ProjectsComponent,
    SkillsComponent,
    ContactComponent,
    LoginComponent,
    ShoppingListComponent,
    GamesComponent,
    ChessComponent,
    BlindfoldComponent,
    CategoryComponent,
    ColorTrainingComponent,
    DiagonalTrainingComponent,
    SameColorTrainingComponent,
    KingDistanceTrainingComponent,
    PieceSightTrainingComponent,
    KnightMoveTrainingComponent,
    ForkSquareTrainingComponent,
    AttackerPickTrainingComponent,
    WhatsOnSquareTrainingComponent,
    WherePieceTrainingComponent
  ],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
