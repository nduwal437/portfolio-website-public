import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { ShoppingListService, ShoppingItem } from '../services/shopping-list.service';
import { environment } from '../../environments/environment';

interface UndoToast {
  item: ShoppingItem;
  timer: ReturnType<typeof setTimeout>;
}

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  animations: [
    trigger('listItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(20px)' }))])
    ]),
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }), animate('300ms ease-out', style({ opacity: 1 }))])
    ]),
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50%) translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(-50%) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(-50%) translateY(20px)' }))
      ])
    ])
  ]
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  @ViewChild('addInput') addInputRef!: ElementRef<HTMLInputElement>;

  shoppingItems: ShoppingItem[] = [];
  requiredItems: ShoppingItem[] = [];
  receivedItems: ShoppingItem[] = [];
  newItemName = '';
  errorMessage = '';

  // Per-item loading states (replaces global isLoading)
  isInitialLoading = true;
  isAdding = false;
  loadingItems = new Set<number>();

  // Inline editing
  editingItemId: number | null = null;
  editingItemName = '';

  // Undo toast for delete
  undoToast: UndoToast | null = null;

  // Success highlight
  recentlyAddedIds = new Set<number>();

  // Swipe-to-delete
  swipeOffsets = new Map<number, number>();

  private readonly destroy$ = new Subject<void>();
  private readonly MAX_ITEM_NAME_LENGTH = 100;
  private readonly DRAFT_STORAGE_KEY = 'shoppingListDraft';
  private readonly UNDO_TIMEOUT = 5000;
  private readonly SWIPE_THRESHOLD = 80;
  private errorDismissTimer: ReturnType<typeof setTimeout> | null = null;
  private touchStartX = 0;
  private touchStartY = 0;
  private swipingItemId: number | null = null;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    const savedDraft = sessionStorage.getItem(this.DRAFT_STORAGE_KEY);
    if (savedDraft) {
      this.newItemName = savedDraft;
    }
    this.loadItems();
  }

  ngOnDestroy(): void {
    if (this.undoToast) {
      this.finalizeDelete(this.undoToast);
    }
    this.clearErrorTimer();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- Loading helpers ---

  isItemLoading(id: number): boolean {
    return this.loadingItems.has(id);
  }

  // --- Error handling ---

  private showError(message: string): void {
    this.errorMessage = message;
    this.clearErrorTimer();
    this.errorDismissTimer = setTimeout(() => {
      this.errorMessage = '';
      this.errorDismissTimer = null;
    }, 5000);
  }

  private clearErrorTimer(): void {
    if (this.errorDismissTimer) {
      clearTimeout(this.errorDismissTimer);
      this.errorDismissTimer = null;
    }
  }

  dismissError(): void {
    this.errorMessage = '';
    this.clearErrorTimer();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private logError(message: string, error?: unknown): void {
    if (!environment.production) {
      console.warn(message, error);
    }
  }

  // --- Data loading ---

  loadItems(): void {
    this.isInitialLoading = true;
    this.errorMessage = '';

    this.shoppingListService
      .getItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: items => {
          this.shoppingItems = items;
          this.separateItems();
          this.isInitialLoading = false;
        },
        error: error => {
          this.logError('Error fetching shopping items:', error);
          this.showError('Failed to load shopping items. Please try again.');
          this.isInitialLoading = false;
        }
      });
  }

  separateItems(): void {
    this.requiredItems = this.shoppingItems.filter(item => item.is_needed);
    this.receivedItems = this.shoppingItems.filter(item => !item.is_needed);
  }

  // --- Add item (optimistic) ---

  addItem(): void {
    const trimmedName = this.newItemName.trim();

    if (!trimmedName) {
      this.showError('Item name cannot be empty');
      return;
    }

    if (trimmedName.length > this.MAX_ITEM_NAME_LENGTH) {
      this.showError(`Item name must be ${this.MAX_ITEM_NAME_LENGTH} characters or less`);
      return;
    }

    const isDuplicate = this.shoppingItems.some(item => item.name.toLowerCase() === trimmedName.toLowerCase());
    if (isDuplicate) {
      this.showError('An item with this name already exists');
      return;
    }

    // Optimistic: add temp item immediately
    const tempId = -Date.now();
    const tempItem: ShoppingItem = { id: tempId, name: trimmedName, is_needed: true };
    this.shoppingItems.push(tempItem);
    this.separateItems();

    const savedName = trimmedName;
    this.newItemName = '';
    sessionStorage.removeItem(this.DRAFT_STORAGE_KEY);
    this.isAdding = true;
    this.errorMessage = '';

    setTimeout(() => this.addInputRef?.nativeElement.focus(), 0);

    this.shoppingListService
      .addItem(savedName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: newItem => {
          newItem.is_needed = newItem.is_needed ?? true;
          const tempIndex = this.shoppingItems.findIndex(i => i.id === tempId);
          if (tempIndex !== -1) {
            this.shoppingItems[tempIndex] = newItem;
          }
          this.separateItems();
          this.isAdding = false;

          // Brief highlight for success feedback
          this.recentlyAddedIds.add(newItem.id);
          setTimeout(() => this.recentlyAddedIds.delete(newItem.id), 2000);
        },
        error: error => {
          this.logError('Error adding item:', error);
          // Rollback
          this.shoppingItems = this.shoppingItems.filter(i => i.id !== tempId);
          this.separateItems();
          this.newItemName = savedName;
          sessionStorage.setItem(this.DRAFT_STORAGE_KEY, savedName);
          this.isAdding = false;
          this.showError('Failed to add item. Please try again.');
        }
      });
  }

  // --- Delete item (undo toast) ---

  deleteItem(id: number): void {
    // Finalize any pending delete immediately
    if (this.undoToast) {
      this.finalizeDelete(this.undoToast);
    }

    const itemIndex = this.shoppingItems.findIndex(i => i.id === id);
    if (itemIndex === -1) return;

    const deletedItem = { ...this.shoppingItems[itemIndex] };

    // Optimistic: remove from UI immediately
    this.shoppingItems = this.shoppingItems.filter(i => i.id !== id);
    this.separateItems();
    this.swipeOffsets.delete(id);
    this.errorMessage = '';

    this.undoToast = {
      item: deletedItem,
      timer: setTimeout(() => {
        this.finalizeDelete(this.undoToast!);
      }, this.UNDO_TIMEOUT)
    };
  }

  undoDelete(): void {
    if (!this.undoToast) return;

    clearTimeout(this.undoToast.timer);
    const item = this.undoToast.item;
    this.shoppingItems.push(item);
    this.separateItems();
    this.undoToast = null;
  }

  private finalizeDelete(toast: UndoToast): void {
    clearTimeout(toast.timer);
    if (this.undoToast === toast) {
      this.undoToast = null;
    }

    this.shoppingListService
      .deleteItem(toast.item.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: error => {
          this.logError('Error deleting item:', error);
          // Rollback: add item back
          this.shoppingItems.push(toast.item);
          this.separateItems();
          this.showError('Failed to delete item. The item has been restored.');
        }
      });
  }

  // --- Toggle status (optimistic) ---

  toggleItemStatus(item: ShoppingItem): void {
    const previousStatus = item.is_needed;
    const newStatus = !previousStatus;

    // Optimistic: update immediately
    const index = this.shoppingItems.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.shoppingItems[index] = { ...this.shoppingItems[index], is_needed: newStatus };
      this.separateItems();
    }

    this.loadingItems.add(item.id);
    this.errorMessage = '';

    this.shoppingListService
      .updateItem(item.id, { is_needed: newStatus })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadingItems.delete(item.id);
        },
        error: error => {
          this.logError('Error updating item:', error);
          // Rollback
          const rollbackIndex = this.shoppingItems.findIndex(i => i.id === item.id);
          if (rollbackIndex !== -1) {
            this.shoppingItems[rollbackIndex] = { ...this.shoppingItems[rollbackIndex], is_needed: previousStatus };
            this.separateItems();
          }
          this.loadingItems.delete(item.id);
          this.showError('Failed to update item status. Please try again.');
        }
      });
  }

  // --- Inline editing ---

  startEditing(item: ShoppingItem): void {
    if (this.isItemLoading(item.id)) return;
    this.editingItemId = item.id;
    this.editingItemName = item.name;
    setTimeout(() => {
      const input = document.getElementById('edit-input-' + item.id) as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 0);
  }

  cancelEditing(): void {
    this.editingItemId = null;
    this.editingItemName = '';
  }

  saveEditing(item: ShoppingItem): void {
    if (this.editingItemId !== item.id) return;

    const trimmedName = this.editingItemName.trim();

    if (!trimmedName) {
      this.showError('Item name cannot be empty');
      this.cancelEditing();
      return;
    }

    if (trimmedName.length > this.MAX_ITEM_NAME_LENGTH) {
      this.showError(`Item name must be ${this.MAX_ITEM_NAME_LENGTH} characters or less`);
      return;
    }

    const isDuplicate = this.shoppingItems.some(
      i => i.id !== item.id && i.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      this.showError('An item with this name already exists');
      return;
    }

    if (trimmedName === item.name) {
      this.cancelEditing();
      return;
    }

    // Optimistic update
    const previousName = item.name;
    const index = this.shoppingItems.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.shoppingItems[index] = { ...this.shoppingItems[index], name: trimmedName };
      this.separateItems();
    }

    this.editingItemId = null;
    this.editingItemName = '';
    this.loadingItems.add(item.id);
    this.errorMessage = '';

    this.shoppingListService
      .updateItem(item.id, { name: trimmedName })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadingItems.delete(item.id);
        },
        error: error => {
          this.logError('Error renaming item:', error);
          const rollbackIndex = this.shoppingItems.findIndex(i => i.id === item.id);
          if (rollbackIndex !== -1) {
            this.shoppingItems[rollbackIndex] = { ...this.shoppingItems[rollbackIndex], name: previousName };
            this.separateItems();
          }
          this.loadingItems.delete(item.id);
          this.showError('Failed to rename item. Please try again.');
        }
      });
  }

  // --- Keyboard & input ---

  clearInput(): void {
    this.newItemName = '';
    this.errorMessage = '';
    sessionStorage.removeItem(this.DRAFT_STORAGE_KEY);
  }

  onDraftChange(value: string): void {
    if (value.trim()) {
      sessionStorage.setItem(this.DRAFT_STORAGE_KEY, value);
    } else {
      sessionStorage.removeItem(this.DRAFT_STORAGE_KEY);
    }
  }

  // --- Swipe-to-delete ---

  onTouchStart(event: TouchEvent, itemId: number): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.swipingItemId = itemId;
  }

  onTouchMove(event: TouchEvent, itemId: number): void {
    if (this.swipingItemId !== itemId) return;

    const deltaX = event.touches[0].clientX - this.touchStartX;
    const deltaY = Math.abs(event.touches[0].clientY - this.touchStartY);

    // If scrolling vertically, cancel swipe
    if (deltaY > 30) {
      this.swipingItemId = null;
      this.swipeOffsets.delete(itemId);
      return;
    }

    // Only allow left swipe (negative deltaX)
    if (deltaX < 0) {
      this.swipeOffsets.set(itemId, Math.max(deltaX, -150));
    }
  }

  onTouchEnd(_event: TouchEvent, itemId: number): void {
    if (this.swipingItemId !== itemId) return;

    const offset = this.swipeOffsets.get(itemId) || 0;

    if (Math.abs(offset) >= this.SWIPE_THRESHOLD) {
      this.swipeOffsets.delete(itemId);
      this.deleteItem(itemId);
    } else {
      this.swipeOffsets.delete(itemId);
    }

    this.swipingItemId = null;
  }

  getSwipeTransform(itemId: number): string {
    const offset = this.swipeOffsets.get(itemId);
    if (offset !== undefined && offset < 0) {
      return `translateX(${offset}px)`;
    }
    return '';
  }

  trackByItemId(_index: number, item: ShoppingItem): number {
    return item.id;
  }
}
