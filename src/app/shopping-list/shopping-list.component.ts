import { Component, OnInit } from '@angular/core';
import { ShoppingListService, ShoppingItem } from '../services/shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  shoppingItems: ShoppingItem[] = [];
  requiredItems: ShoppingItem[] = [];
  receivedItems: ShoppingItem[] = [];
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
        this.separateItems();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching shopping items:', error);
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
    
    this.shoppingListService.addItem(this.newItemName.trim()).subscribe({
      next: (newItem) => {
        // Ensure the new item is marked as needed regardless of API response
        newItem.is_needed = true;
        this.shoppingItems.push(newItem);
        this.separateItems();
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
        this.separateItems();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting item:', error);
        this.errorMessage = 'Failed to delete item. Please try again.';
        this.isLoading = false;
      }
    });
  }

  toggleItemStatus(item: ShoppingItem): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Toggle the is_needed status
    const newStatus = !item.is_needed;
    
    this.shoppingListService.updateItem(item.id, { is_needed: newStatus }).subscribe({
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
        console.error('Error updating item:', error);
        this.errorMessage = 'Failed to update item status. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
