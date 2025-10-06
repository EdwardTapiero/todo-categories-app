import { Component, OnInit } from '@angular/core';
import {ModalController, AlertController, IonicModule} from '@ionic/angular';
import { Task } from '../models/task.model';
import { Category } from '../models/category.model';
import { TaskService } from '../services/task.service';
import { StorageService } from '../services/storage.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class HomePage implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  categories: Category[] = [];
  selectedCategory: string = 'all';

  constructor(
    private taskService: TaskService,
    private storageService: StorageService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadData();
    this.taskService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.filterTasks();
    });
  }

  loadData() {
    this.categories = this.storageService.getCategories();
    this.tasks = this.taskService.getTasks();
    this.filterTasks();
  }

  filterTasks() {
    if (this.selectedCategory === 'all') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(t => t.categoryId === this.selectedCategory);
    }
  }

  toggleTask(taskId: string) {
    this.taskService.toggleTask(taskId);
  }

  async deleteTask(taskId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Eliminar esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.taskService.deleteTask(taskId);
          }
        }
      ]
    });

    await alert.present();
  }

  async openAddTaskModal() {
    const alert = await this.alertController.create({
      header: 'Nueva Tarea',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título de la tarea'
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descripción (opcional)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Siguiente',
          handler: (data) => {
            if (data.title && data.title.trim() !== '') {
              this.selectCategory(data.title, data.description);
              return true;
            }
            return false;
          }
        }
      ]
    });

    await alert.present();
  }

  async selectCategory(title: string, description?: string) {
    const alert = await this.alertController.create({
      header: 'Seleccionar Categoría',
      inputs: [
        {
          name: 'categoryId',
          type: 'radio',
          label: 'Sin categoría',
          value: '',
          checked: true
        },
        ...this.categories.map(c => ({
          name: 'categoryId',
          type: 'radio' as const,
          label: c.name,
          value: c.id,
          checked: false
        }))
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (categoryId) => {
            this.taskService.addTask(
              title.trim(),
              description?.trim(),
              categoryId || undefined
            );
          }
        }
      ]
    });

    await alert.present();
  }

  async openCategoryManager() {
    // Implementaremos esto en la siguiente rama
    console.log('Abrir gestor de categorías');
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }

  getCategoryColor(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.color : '#cccccc';
  }
}
