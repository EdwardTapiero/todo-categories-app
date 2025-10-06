import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadCategories();
  }

  private loadCategories(): void {
    const categories = this.storageService.getCategories();
    this.categoriesSubject.next(categories);
  }

  getCategories(): Category[] {
    return this.categoriesSubject.value;
  }

  addCategory(name: string, color: string, icon?: string): void {
    const newCategory: Category = {
      id: this.storageService.generateId(),
      name,
      color,
      icon,
      createdAt: new Date()
    };

    this.storageService.addCategory(newCategory);
    this.loadCategories();
  }

  updateCategory(category: Category): void {
    this.storageService.updateCategory(category);
    this.loadCategories();
  }

  deleteCategory(categoryId: string): void {
    this.storageService.deleteCategory(categoryId);
    this.loadCategories();
  }
}
