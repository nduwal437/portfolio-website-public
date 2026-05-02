import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingListService, ShoppingItem } from '../services/shopping-list.service';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;
  let shoppingListService: jasmine.SpyObj<ShoppingListService>;

  const mockItems: ShoppingItem[] = [
    { id: 1, name: 'Milk', is_needed: true },
    { id: 2, name: 'Bread', is_needed: false },
    { id: 3, name: 'Eggs', is_needed: true }
  ];

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('ShoppingListService', ['getItems', 'addItem', 'deleteItem', 'updateItem']);
    serviceSpy.getItems.and.returnValue(of(mockItems.map(item => ({ ...item }))));

    await TestBed.configureTestingModule({
      declarations: [ShoppingListComponent],
      imports: [FormsModule, RouterTestingModule, NoopAnimationsModule],
      providers: [{ provide: ShoppingListService, useValue: serviceSpy }]
    }).compileComponents();

    shoppingListService = TestBed.inject(ShoppingListService) as jasmine.SpyObj<ShoppingListService>;
  });

  beforeEach(() => {
    sessionStorage.removeItem('shoppingListDraft');
    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.removeItem('shoppingListDraft');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load items on init', () => {
      expect(shoppingListService.getItems).toHaveBeenCalled();
      expect(component.shoppingItems.length).toBe(3);
    });

    it('should separate items into required and received', () => {
      expect(component.requiredItems.length).toBe(2);
      expect(component.receivedItems.length).toBe(1);
    });

    it('should set isInitialLoading to false after items load', () => {
      expect(component.isInitialLoading).toBeFalse();
    });

    it('should restore draft from sessionStorage', () => {
      sessionStorage.setItem('shoppingListDraft', 'Saved draft');

      const newFixture = TestBed.createComponent(ShoppingListComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      expect(newComponent.newItemName).toBe('Saved draft');
    });
  });

  describe('loadItems', () => {
    it('should set error message on failure', () => {
      shoppingListService.getItems.and.returnValue(throwError(() => new Error('Network error')));

      component.loadItems();

      expect(component.errorMessage).toBe('Failed to load shopping items. Please try again.');
      expect(component.isInitialLoading).toBeFalse();
    });

    it('should clear error message before loading', () => {
      component.errorMessage = 'Previous error';

      shoppingListService.getItems.and.returnValue(of([]));
      component.loadItems();

      expect(component.errorMessage).toBe('');
    });

    it('should handle empty items list', () => {
      shoppingListService.getItems.and.returnValue(of([]));

      component.loadItems();

      expect(component.shoppingItems.length).toBe(0);
      expect(component.requiredItems.length).toBe(0);
      expect(component.receivedItems.length).toBe(0);
    });
  });

  describe('separateItems', () => {
    it('should filter required items where is_needed is true', () => {
      component.shoppingItems = mockItems;
      component.separateItems();

      expect(component.requiredItems).toEqual([
        { id: 3, name: 'Eggs', is_needed: true },
        { id: 1, name: 'Milk', is_needed: true }
      ]);
    });

    it('should filter received items where is_needed is false', () => {
      component.shoppingItems = mockItems;
      component.separateItems();

      expect(component.receivedItems).toEqual([{ id: 2, name: 'Bread', is_needed: false }]);
    });

    it('should filter items by search term', () => {
      component.shoppingItems = mockItems;
      component.searchTerm = 'milk';
      component.separateItems();

      expect(component.requiredItems.length).toBe(1);
      expect(component.requiredItems[0].name).toBe('Milk');
      expect(component.receivedItems.length).toBe(0);
    });

    it('should be case-insensitive when filtering by search term', () => {
      component.shoppingItems = mockItems;
      component.searchTerm = 'BREAD';
      component.separateItems();

      expect(component.receivedItems.length).toBe(1);
      expect(component.receivedItems[0].name).toBe('Bread');
    });

    it('should return all items when search term is empty', () => {
      component.shoppingItems = mockItems;
      component.searchTerm = '';
      component.separateItems();

      expect(component.requiredItems.length).toBe(2);
      expect(component.receivedItems.length).toBe(1);
    });

    it('should return all items when search term is whitespace only', () => {
      component.shoppingItems = mockItems;
      component.searchTerm = '   ';
      component.separateItems();

      expect(component.requiredItems.length).toBe(2);
      expect(component.receivedItems.length).toBe(1);
    });

    it('should return no items when search term matches nothing', () => {
      component.shoppingItems = mockItems;
      component.searchTerm = 'xyz';
      component.separateItems();

      expect(component.requiredItems.length).toBe(0);
      expect(component.receivedItems.length).toBe(0);
    });

    it('should match partial names', () => {
      component.shoppingItems = mockItems;
      component.searchTerm = 'gg';
      component.separateItems();

      expect(component.requiredItems.length).toBe(1);
      expect(component.requiredItems[0].name).toBe('Eggs');
    });
  });

  describe('search functionality', () => {
    it('should re-separate items on search change', () => {
      component.shoppingItems = mockItems;
      component.searchTerm = 'Milk';

      component.onSearchChange();

      expect(component.requiredItems.length).toBe(1);
      expect(component.requiredItems[0].name).toBe('Milk');
    });

    it('should clear search term and show all items', () => {
      component.shoppingItems = mockItems;
      component.searchTerm = 'Milk';
      component.separateItems();

      component.clearSearch();

      expect(component.searchTerm).toBe('');
      expect(component.requiredItems.length).toBe(2);
      expect(component.receivedItems.length).toBe(1);
    });
  });

  describe('addItem', () => {
    it('should set error when item name is empty', () => {
      component.newItemName = '   ';

      component.addItem();

      expect(component.errorMessage).toBe('Item name cannot be empty');
      expect(shoppingListService.addItem).not.toHaveBeenCalled();
    });

    it('should set error when item name exceeds max length', () => {
      component.newItemName = 'a'.repeat(101);

      component.addItem();

      expect(component.errorMessage).toBe('Item name must be 100 characters or less');
      expect(shoppingListService.addItem).not.toHaveBeenCalled();
    });

    it('should set error when duplicate item name exists', () => {
      component.shoppingItems = [{ id: 1, name: 'Milk', is_needed: true }];
      component.newItemName = 'milk';

      component.addItem();

      expect(component.errorMessage).toBe('An item with this name already exists');
      expect(shoppingListService.addItem).not.toHaveBeenCalled();
    });

    it('should optimistically add item and replace with real item on success', () => {
      const newItem: ShoppingItem = { id: 4, name: 'Butter', is_needed: true };
      shoppingListService.addItem.and.returnValue(of(newItem));
      component.newItemName = 'Butter';

      component.addItem();

      expect(shoppingListService.addItem).toHaveBeenCalledWith('Butter');
      expect(component.shoppingItems).toContain(newItem);
      expect(component.newItemName).toBe('');
      expect(component.isAdding).toBeFalse();
    });

    it('should trim whitespace from item name', () => {
      const newItem: ShoppingItem = { id: 4, name: 'Butter', is_needed: true };
      shoppingListService.addItem.and.returnValue(of(newItem));
      component.newItemName = '  Butter  ';

      component.addItem();

      expect(shoppingListService.addItem).toHaveBeenCalledWith('Butter');
    });

    it('should default is_needed to true when API omits it', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newItem: any = { id: 4, name: 'Butter' };
      shoppingListService.addItem.and.returnValue(of(newItem));
      component.newItemName = 'Butter';

      component.addItem();

      expect(component.shoppingItems[component.shoppingItems.length - 1].is_needed).toBeTrue();
    });

    it('should rollback on failure and restore input', () => {
      shoppingListService.addItem.and.returnValue(throwError(() => new Error('Server error')));
      component.newItemName = 'Butter';
      const initialCount = component.shoppingItems.length;

      component.addItem();

      expect(component.errorMessage).toBe('Failed to add item. Please try again.');
      expect(component.isAdding).toBeFalse();
      expect(component.newItemName).toBe('Butter');
      expect(component.shoppingItems.length).toBe(initialCount);
    });

    it('should clear sessionStorage draft on successful add', () => {
      sessionStorage.setItem('shoppingListDraft', 'Butter');
      const newItem: ShoppingItem = { id: 4, name: 'Butter', is_needed: true };
      shoppingListService.addItem.and.returnValue(of(newItem));
      component.newItemName = 'Butter';

      component.addItem();

      expect(sessionStorage.getItem('shoppingListDraft')).toBeNull();
    });

    it('should track recently added items for highlight', fakeAsync(() => {
      const newItem: ShoppingItem = { id: 4, name: 'Butter', is_needed: true };
      shoppingListService.addItem.and.returnValue(of(newItem));
      component.newItemName = 'Butter';

      component.addItem();

      expect(component.recentlyAddedIds.has(4)).toBeTrue();

      tick(2000);

      expect(component.recentlyAddedIds.has(4)).toBeFalse();
    }));
  });

  describe('deleteItem (undo toast)', () => {
    it('should remove item from UI immediately and show undo toast', () => {
      shoppingListService.deleteItem.and.returnValue(of(undefined));
      component.shoppingItems = mockItems.map(item => ({ ...item }));
      component.separateItems();

      component.deleteItem(1);

      expect(component.shoppingItems.find(item => item.id === 1)).toBeUndefined();
      expect(component.undoToast).not.toBeNull();
      expect(component.undoToast!.item.id).toBe(1);
    });

    it('should restore item when undo is clicked', () => {
      shoppingListService.deleteItem.and.returnValue(of(undefined));
      component.shoppingItems = mockItems.map(item => ({ ...item }));
      component.separateItems();

      component.deleteItem(1);
      component.undoDelete();

      expect(component.shoppingItems.find(item => item.id === 1)).toBeDefined();
      expect(component.undoToast).toBeNull();
      expect(shoppingListService.deleteItem).not.toHaveBeenCalled();
    });

    it('should finalize delete after timeout', fakeAsync(() => {
      shoppingListService.deleteItem.and.returnValue(of(undefined));
      component.shoppingItems = mockItems.map(item => ({ ...item }));
      component.separateItems();

      component.deleteItem(1);
      tick(5000);

      expect(shoppingListService.deleteItem).toHaveBeenCalledWith(1);
      expect(component.undoToast).toBeNull();
    }));

    it('should finalize previous delete when a new delete starts', () => {
      shoppingListService.deleteItem.and.returnValue(of(undefined));
      component.shoppingItems = mockItems.map(item => ({ ...item }));
      component.separateItems();

      component.deleteItem(1);
      component.deleteItem(3);

      expect(shoppingListService.deleteItem).toHaveBeenCalledWith(1);
      expect(component.undoToast!.item.id).toBe(3);
    });

    it('should rollback on API error', fakeAsync(() => {
      shoppingListService.deleteItem.and.returnValue(throwError(() => new Error('Server error')));
      component.shoppingItems = mockItems.map(item => ({ ...item }));
      component.separateItems();

      component.deleteItem(1);
      tick(5000);

      expect(component.shoppingItems.find(item => item.id === 1)).toBeDefined();
      expect(component.errorMessage).toBe('Failed to delete item. The item has been restored.');

      // Flush the error auto-dismiss timer
      tick(5000);
    }));

    it('should do nothing when item not found', () => {
      component.shoppingItems = mockItems.map(item => ({ ...item }));

      component.deleteItem(999);

      expect(component.undoToast).toBeNull();
    });
  });

  describe('toggleItemStatus (optimistic)', () => {
    it('should optimistically toggle item from needed to not needed', () => {
      const item: ShoppingItem = { id: 1, name: 'Milk', is_needed: true };
      shoppingListService.updateItem.and.returnValue(of({ id: 1, name: 'Milk', is_needed: false }));
      component.shoppingItems = [{ ...item }];

      component.toggleItemStatus(item);

      expect(shoppingListService.updateItem).toHaveBeenCalledWith(1, { is_needed: false });
      expect(component.shoppingItems[0].is_needed).toBeFalse();
    });

    it('should toggle item from not needed to needed', () => {
      const item: ShoppingItem = { id: 2, name: 'Bread', is_needed: false };
      shoppingListService.updateItem.and.returnValue(of({ id: 2, name: 'Bread', is_needed: true }));
      component.shoppingItems = [{ ...item }];

      component.toggleItemStatus(item);

      expect(shoppingListService.updateItem).toHaveBeenCalledWith(2, { is_needed: true });
      expect(component.shoppingItems[0].is_needed).toBeTrue();
    });

    it('should rollback on failure', () => {
      const item: ShoppingItem = { id: 1, name: 'Milk', is_needed: true };
      shoppingListService.updateItem.and.returnValue(throwError(() => new Error('Server error')));
      component.shoppingItems = [{ ...item }];

      component.toggleItemStatus(item);

      expect(component.shoppingItems[0].is_needed).toBeTrue();
      expect(component.errorMessage).toBe('Failed to update item status. Please try again.');
      expect(component.loadingItems.has(1)).toBeFalse();
    });

    it('should track per-item loading state', () => {
      const item: ShoppingItem = { id: 1, name: 'Milk', is_needed: true };
      shoppingListService.updateItem.and.returnValue(of({ id: 1, name: 'Milk', is_needed: false }));
      component.shoppingItems = [{ ...item }];

      // Before toggle completes (synchronous with of())
      component.toggleItemStatus(item);

      // After observable completes, loading should be cleared
      expect(component.loadingItems.has(1)).toBeFalse();
    });

    it('should re-separate items after toggling', () => {
      const item: ShoppingItem = { id: 1, name: 'Milk', is_needed: true };
      shoppingListService.updateItem.and.returnValue(of({ id: 1, name: 'Milk', is_needed: false }));
      component.shoppingItems = [{ ...item }];

      component.toggleItemStatus(item);

      expect(component.requiredItems.length).toBe(0);
      expect(component.receivedItems.length).toBe(1);
    });
  });

  describe('inline editing', () => {
    it('should start editing with correct item name', () => {
      const item: ShoppingItem = { id: 1, name: 'Milk', is_needed: true };

      component.startEditing(item);

      expect(component.editingItemId).toBe(1);
      expect(component.editingItemName).toBe('Milk');
    });

    it('should not start editing if item is loading', () => {
      const item: ShoppingItem = { id: 1, name: 'Milk', is_needed: true };
      component.loadingItems.add(1);

      component.startEditing(item);

      expect(component.editingItemId).toBeNull();
    });

    it('should cancel editing', () => {
      component.editingItemId = 1;
      component.editingItemName = 'Updated';

      component.cancelEditing();

      expect(component.editingItemId).toBeNull();
      expect(component.editingItemName).toBe('');
    });

    it('should save edited name optimistically', () => {
      const item: ShoppingItem = { id: 1, name: 'Milk', is_needed: true };
      shoppingListService.updateItem.and.returnValue(of({ id: 1, name: 'Oat Milk', is_needed: true }));
      component.shoppingItems = [{ ...item }];
      component.editingItemId = 1;
      component.editingItemName = 'Oat Milk';

      component.saveEditing(item);

      expect(shoppingListService.updateItem).toHaveBeenCalledWith(1, { name: 'Oat Milk' });
      expect(component.shoppingItems[0].name).toBe('Oat Milk');
      expect(component.editingItemId).toBeNull();
    });

    it('should cancel if name unchanged', () => {
      const item: ShoppingItem = { id: 1, name: 'Milk', is_needed: true };
      component.shoppingItems = [{ ...item }];
      component.editingItemId = 1;
      component.editingItemName = 'Milk';

      component.saveEditing(item);

      expect(shoppingListService.updateItem).not.toHaveBeenCalled();
      expect(component.editingItemId).toBeNull();
    });

    it('should show error for empty name', () => {
      const item: ShoppingItem = { id: 1, name: 'Milk', is_needed: true };
      component.editingItemId = 1;
      component.editingItemName = '   ';

      component.saveEditing(item);

      expect(component.errorMessage).toBe('Item name cannot be empty');
    });

    it('should show error for duplicate name', () => {
      const item1: ShoppingItem = { id: 1, name: 'Milk', is_needed: true };
      const item2: ShoppingItem = { id: 2, name: 'Bread', is_needed: true };
      component.shoppingItems = [{ ...item1 }, { ...item2 }];
      component.editingItemId = 1;
      component.editingItemName = 'Bread';

      component.saveEditing(item1);

      expect(component.errorMessage).toBe('An item with this name already exists');
      expect(shoppingListService.updateItem).not.toHaveBeenCalled();
    });

    it('should rollback name on API error', () => {
      const item: ShoppingItem = { id: 1, name: 'Milk', is_needed: true };
      shoppingListService.updateItem.and.returnValue(throwError(() => new Error('Server error')));
      component.shoppingItems = [{ ...item }];
      component.editingItemId = 1;
      component.editingItemName = 'Oat Milk';

      component.saveEditing(item);

      expect(component.shoppingItems[0].name).toBe('Milk');
      expect(component.errorMessage).toBe('Failed to rename item. Please try again.');
    });

    it('should not save if editingItemId does not match', () => {
      const item: ShoppingItem = { id: 1, name: 'Milk', is_needed: true };
      component.editingItemId = 2;
      component.editingItemName = 'Updated';

      component.saveEditing(item);

      expect(shoppingListService.updateItem).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should dismiss error manually', () => {
      component.errorMessage = 'Some error';

      component.dismissError();

      expect(component.errorMessage).toBe('');
    });

    it('should auto-dismiss error after 5 seconds', fakeAsync(() => {
      // Trigger an error via a method that uses showError
      shoppingListService.getItems.and.returnValue(throwError(() => new Error('fail')));
      component.loadItems();

      expect(component.errorMessage).toBeTruthy();

      tick(5000);

      expect(component.errorMessage).toBe('');
    }));
  });

  describe('keyboard and input', () => {
    it('should clear input on clearInput()', () => {
      component.newItemName = 'Something';
      sessionStorage.setItem('shoppingListDraft', 'Something');

      component.clearInput();

      expect(component.newItemName).toBe('');
      expect(component.errorMessage).toBe('');
      expect(sessionStorage.getItem('shoppingListDraft')).toBeNull();
    });

    it('should persist draft to sessionStorage on change', () => {
      component.onDraftChange('Hello');

      expect(sessionStorage.getItem('shoppingListDraft')).toBe('Hello');
    });

    it('should remove draft from sessionStorage when input cleared', () => {
      sessionStorage.setItem('shoppingListDraft', 'old');

      component.onDraftChange('   ');

      expect(sessionStorage.getItem('shoppingListDraft')).toBeNull();
    });
  });

  describe('swipe-to-delete', () => {
    it('should track swipe offset on touch move', () => {
      const startEvent = { touches: [{ clientX: 200, clientY: 100 }] } as unknown as TouchEvent;
      const moveEvent = {
        touches: [{ clientX: 100, clientY: 105 }],
        preventDefault: jasmine.createSpy()
      } as unknown as TouchEvent;

      component.onTouchStart(startEvent, 1);
      component.onTouchMove(moveEvent, 1);

      expect(component.swipeOffsets.get(1)).toBe(-100);
    });

    it('should cancel swipe on vertical scroll', () => {
      const startEvent = { touches: [{ clientX: 200, clientY: 100 }] } as unknown as TouchEvent;
      const moveEvent = { touches: [{ clientX: 195, clientY: 150 }] } as unknown as TouchEvent;

      component.onTouchStart(startEvent, 1);
      component.onTouchMove(moveEvent, 1);

      expect(component.swipeOffsets.has(1)).toBeFalse();
    });

    it('should trigger delete when swipe exceeds threshold', () => {
      spyOn(component, 'deleteItem');
      const startEvent = { touches: [{ clientX: 200, clientY: 100 }] } as unknown as TouchEvent;
      const moveEvent = {
        touches: [{ clientX: 100, clientY: 105 }],
        preventDefault: jasmine.createSpy()
      } as unknown as TouchEvent;
      const endEvent = {} as TouchEvent;

      component.onTouchStart(startEvent, 1);
      component.onTouchMove(moveEvent, 1);
      component.onTouchEnd(endEvent, 1);

      expect(component.deleteItem).toHaveBeenCalledWith(1);
    });

    it('should snap back when swipe does not exceed threshold', () => {
      spyOn(component, 'deleteItem');
      const startEvent = { touches: [{ clientX: 200, clientY: 100 }] } as unknown as TouchEvent;
      const moveEvent = {
        touches: [{ clientX: 170, clientY: 102 }],
        preventDefault: jasmine.createSpy()
      } as unknown as TouchEvent;
      const endEvent = {} as TouchEvent;

      component.onTouchStart(startEvent, 1);
      component.onTouchMove(moveEvent, 1);
      component.onTouchEnd(endEvent, 1);

      expect(component.deleteItem).not.toHaveBeenCalled();
      expect(component.swipeOffsets.has(1)).toBeFalse();
    });

    it('should return empty string for non-swiping items', () => {
      expect(component.getSwipeTransform(1)).toBe('');
    });

    it('should return translateX for swiping items', () => {
      component.swipeOffsets.set(1, -50);
      expect(component.getSwipeTransform(1)).toBe('translateX(-50px)');
    });
  });

  describe('trackByItemId', () => {
    it('should return item id', () => {
      const item: ShoppingItem = { id: 42, name: 'Test', is_needed: true };
      expect(component.trackByItemId(0, item)).toBe(42);
    });
  });

  describe('cleanup', () => {
    it('should complete destroy$ on ngOnDestroy', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const destroySpy = spyOn((component as any).destroy$, 'next');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const completeSpy = spyOn((component as any).destroy$, 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should finalize pending delete on destroy', () => {
      shoppingListService.deleteItem.and.returnValue(of(undefined));
      component.shoppingItems = mockItems.map(item => ({ ...item }));
      component.separateItems();

      component.deleteItem(1);
      expect(component.undoToast).not.toBeNull();

      component.ngOnDestroy();

      expect(shoppingListService.deleteItem).toHaveBeenCalledWith(1);
    });
  });
});
