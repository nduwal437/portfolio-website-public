import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ShoppingItem {
  id: number;
  name: string;
  is_needed?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private readonly API_URL = environment.apiBaseUrl + '/shopping_list_item';

  constructor(private http: HttpClient) { }

  /**
   * Get all shopping list items
   */
  getItems(): Observable<ShoppingItem[]> {
    return this.http.get<ShoppingItem[]>(this.API_URL);
  }

  /**
   * Add a new item to the shopping list
   */
  addItem(name: string): Observable<ShoppingItem> {
    return this.http.post<ShoppingItem>(this.API_URL, { name });
  }

  /**
   * Delete an item from the shopping list
   */
  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  /**
   * Update an item in the shopping list
   */
  updateItem(id: number, updates: Partial<ShoppingItem>): Observable<ShoppingItem> {
    return this.http.put<ShoppingItem>(`${this.API_URL}/${id}`, updates);
  }
}
