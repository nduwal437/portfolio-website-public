import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface DrillTile {
  title: string;
  description: string;
  link: string;
  available: boolean;
}

interface CategoryData {
  title: string;
  subtitle: string;
  drills: DrillTile[];
}

@Component({
  selector: 'app-visualization-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnDestroy {
  title = '';
  subtitle = '';
  drills: DrillTile[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(route: ActivatedRoute) {
    route.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      const category = data['category'] as CategoryData | undefined;
      if (category) {
        this.title = category.title;
        this.subtitle = category.subtitle;
        this.drills = category.drills;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByTitle(_: number, item: DrillTile): string {
    return item.title;
  }
}
