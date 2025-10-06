import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadTasks();
  }

  private loadTasks(): void {
    const tasks = this.storageService.getTasks();
    this.tasksSubject.next(tasks);
  }

  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  getTasksByCategory(categoryId: string): Task[] {
    return this.tasksSubject.value.filter(t => t.categoryId === categoryId);
  }

  addTask(title: string, description?: string, categoryId?: string): void {
    const newTask: Task = {
      id: this.storageService.generateId(),
      title,
      description,
      completed: false,
      categoryId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.storageService.addTask(newTask);
    this.loadTasks();
  }

  toggleTask(taskId: string): void {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      task.completed = !task.completed;
      task.updatedAt = new Date();
      this.storageService.updateTask(task);
      this.loadTasks();
    }
  }

  updateTask(task: Task): void {
    task.updatedAt = new Date();
    this.storageService.updateTask(task);
    this.loadTasks();
  }

  deleteTask(taskId: string): void {
    this.storageService.deleteTask(taskId);
    this.loadTasks();
  }
}
