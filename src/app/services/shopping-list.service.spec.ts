import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ShoppingListService, ShoppingItem } from './shopping-list.service';
import { environment } from '../../environments/environment';

describe('ShoppingListService', () => {
  let service: ShoppingListService;
  let httpMock: HttpTestingController;
  const API_URL = environment.apiBaseUrl + '/shopping_list_item';

  const mockItems: ShoppingItem[] = [
    { id: 1, name: 'Milk', is_needed: true },
    { id: 2, name: 'Bread', is_needed: false },
    { id: 3, name: 'Eggs', is_needed: true }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShoppingListService]
    });

    service = TestBed.inject(ShoppingListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getItems', () => {
    it('should fetch all shopping list items via GET', () => {
      service.getItems().subscribe(items => {
        expect(items.length).toBe(3);
        expect(items).toEqual(mockItems);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });

    it('should return an empty array when no items exist', () => {
      service.getItems().subscribe(items => {
        expect(items.length).toBe(0);
        expect(items).toEqual([]);
      });

      const req = httpMock.expectOne(API_URL);
      req.flush([]);
    });

    it('should propagate HTTP errors', () => {
      service.getItems().subscribe({
        next: () => fail('Should have failed'),
        error: error => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(API_URL);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('addItem', () => {
    it('should add a new item via POST', () => {
      const newItem: ShoppingItem = { id: 4, name: 'Butter', is_needed: true };

      service.addItem('Butter').subscribe(item => {
        expect(item).toEqual(newItem);
      });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ name: 'Butter' });
      req.flush(newItem);
    });

    it('should propagate HTTP errors on add', () => {
      service.addItem('Butter').subscribe({
        next: () => fail('Should have failed'),
        error: error => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(API_URL);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteItem', () => {
    it('should delete an item via DELETE', () => {
      service.deleteItem(1).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should propagate HTTP errors on delete', () => {
      service.deleteItem(999).subscribe({
        next: () => fail('Should have failed'),
        error: error => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${API_URL}/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateItem', () => {
    it('should update an item via PUT', () => {
      const updatedItem: ShoppingItem = { id: 1, name: 'Milk', is_needed: false };

      service.updateItem(1, { is_needed: false }).subscribe(item => {
        expect(item).toEqual(updatedItem);
      });

      const req = httpMock.expectOne(`${API_URL}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ is_needed: false });
      req.flush(updatedItem);
    });

    it('should propagate HTTP errors on update', () => {
      service.updateItem(999, { is_needed: true }).subscribe({
        next: () => fail('Should have failed'),
        error: error => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${API_URL}/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
