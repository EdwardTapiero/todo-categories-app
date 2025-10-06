import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TASKS_KEY = 'tasks';
  private readonly CATEGORIES_KEY = 'categories';

  constructor() {
    this.initializeDefaultCategories();
  }

  // Tasks
  getTasks(): Task[] {
    const tasksJson = localStorage.getItem(this.TASKS_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  addTask(task: Task): void {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.saveTasks(tasks);
    }
  }

  deleteTask(taskId: string): void {
    const tasks = this.getTasks().filter(t => t.id !== taskId);
    this.saveTasks(tasks);
  }

  // Categories
  getCategories(): Category[] {
    const categoriesJson = localStorage.getItem(this.CATEGORIES_KEY);
    return categoriesJson ? JSON.parse(categoriesJson) : [];
  }

  saveCategories(categories: Category[]): void {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
  }

  addCategory(category: Category): void {
    const categories = this.getCategories();
    categories.push(category);
    this.saveCategories(categories);
  }

  updateCategory(updatedCategory: Category): void {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === updatedCategory.id);
    if (index !== -1) {
      categories[index] = updatedCategory;
      this.saveCategories(categories);
    }
  }

  deleteCategory(categoryId: string): void {
    const categories = this.getCategories().filter(c => c.id !== categoryId);
    this.saveCategories(categories);

    // También actualizar tareas que tenían esta categoría
    const tasks = this.getTasks().map(task => {
      if (task.categoryId === categoryId) {
        return { ...task, categoryId: undefined };
      }
      return task;
    });
    this.saveTasks(tasks);
  }

  private initializeDefaultCategories(): void {
    if (this.getCategories().length === 0) {
      const defaultCategories: Category[] = [
        {
          id: this.generateId(),
          name: 'Personal',
          color: '#3880ff',
          icon: 'person',
          createdAt: new Date()
        },
        {
          id: this.generateId(),
          name: 'Trabajo',
          color: '#2dd36f',
          icon: 'briefcase',
          createdAt: new Date()
        },
        {
          id: this.generateId(),
          name: 'Compras',
          color: '#ffc409',
          icon: 'cart',
          createdAt: new Date()
        }
      ];
      this.saveCategories(defaultCategories);
    }
  }

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
