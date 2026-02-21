import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ShoppingListService, ShoppingItem } from '../services/shopping-list.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  shoppingItems: ShoppingItem[] = [];
  requiredItems: ShoppingItem[] = [];
  receivedItems: ShoppingItem[] = [];
  newItemName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  private readonly destroy$ = new Subject<void>();

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.loadItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Conditional logging method that won't trigger debugger pauses
  private logError(message: string, error?: any): void {
    if (!environment.production) {
      // Use console.warn instead of console.error to avoid debugger pauses
      console.warn(message, error);
    }
  }

  loadItems(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.shoppingListService.getItems().pipe(takeUntil(this.destroy$)).subscribe({
      next: (items) => {
        this.shoppingItems = items;
        this.separateItems();
        this.isLoading = false;
      },
      error: (error) => {
        this.logError('Error fetching shopping items:', error);
        this.errorMessage = 'Failed to load shopping items. Please try again.';
        this.isLoading = false;
      }
    });
  }

  separateItems(): void {
    this.requiredItems = this.shoppingItems.filter(item => item.is_needed);
    this.receivedItems = this.shoppingItems.filter(item => !item.is_needed);
  }

  addItem(): void {
    if (!this.newItemName.trim()) {
      this.errorMessage = 'Item name cannot be empty';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    // Create a new item with is_needed explicitly set to true
    const itemToAdd = {
      name: this.newItemName.trim(),
      is_needed: true
    };
    
    this.shoppingListService.addItem(this.newItemName.trim()).pipe(takeUntil(this.destroy$)).subscribe({
      next: (newItem) => {
        // Ensure the new item is marked as needed regardless of API response
        newItem.is_needed = true;
        this.shoppingItems.push(newItem);
        this.separateItems();
        this.newItemName = '';
        this.isLoading = false;
      },
      error: (error) => {
        this.logError('Error adding item:', error);
        this.errorMessage = 'Failed to add item. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteItem(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.shoppingListService.deleteItem(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.shoppingItems = this.shoppingItems.filter(item => item.id !== id);
        this.separateItems();
        this.isLoading = false;
      },
      error: (error) => {
        this.logError('Error deleting item:', error);
        this.errorMessage = 'Failed to delete item. Please try again.';
        this.isLoading = false;
      }
    });
  }

  trackByItemId(index: number, item: ShoppingItem): number {
    return item.id;
  }

  toggleItemStatus(item: ShoppingItem): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Toggle the is_needed status
    const newStatus = !item.is_needed;
    
    this.shoppingListService.updateItem(item.id, { is_needed: newStatus }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (updatedItem) => {
        // Update the item in the local array
        const index = this.shoppingItems.findIndex(i => i.id === item.id);
        if (index !== -1) {
          this.shoppingItems[index] = { ...this.shoppingItems[index], is_needed: newStatus };
        }
        this.separateItems();
        this.isLoading = false;
      },
      error: (error) => {
        this.logError('Error updating item:', error);
        this.errorMessage = 'Failed to update item status. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
