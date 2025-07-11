import { Component, OnInit } from '@angular/core';
import { ShoppingListService, ShoppingItem } from '../services/shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  shoppingItems: ShoppingItem[] = [];
  newItemName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.shoppingListService.getItems().subscribe({
      next: (items) => {
        this.shoppingItems = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching shopping items:', error);
        this.errorMessage = 'Failed to load shopping items. Please try again.';
        this.isLoading = false;
      }
    });
  }

  addItem(): void {
    if (!this.newItemName.trim()) {
      this.errorMessage = 'Item name cannot be empty';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.shoppingListService.addItem(this.newItemName.trim()).subscribe({
      next: (newItem) => {
        this.shoppingItems.push(newItem);
        this.newItemName = '';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error adding item:', error);
        this.errorMessage = 'Failed to add item. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteItem(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.shoppingListService.deleteItem(id).subscribe({
      next: () => {
        this.shoppingItems = this.shoppingItems.filter(item => item.id !== id);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting item:', error);
        this.errorMessage = 'Failed to delete item. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
