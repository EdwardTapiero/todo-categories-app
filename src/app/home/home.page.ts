import { Component, OnInit } from '@angular/core';
import {ModalController, AlertController, IonicModule} from '@ionic/angular';
import { Task } from '../models/task.model';
import { Category } from '../models/category.model';
import { TaskService } from '../services/task.service';
import { StorageService } from '../services/storage.service';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {CategoryManagerPage} from "../pages/category-manager/category-manager.page";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonicModule,
    FormsModule,
    NgIf,
    NgForOf
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
              // Cerrar este alert antes de abrir el siguiente
              setTimeout(() => {
                this.selectCategory(data.title, data.description);
              }, 250);
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
    const inputs: any[] = [
      {
        name: 'categoryId',
        type: 'radio',
        label: 'Sin categoría',
        value: '',
        checked: true
      }
    ];

    // Agregar categorías
    this.categories.forEach(c => {
      inputs.push({
        name: 'categoryId',
        type: 'radio',
        label: c.name,
        value: c.id,
        checked: false
      });
    });

    const alert = await this.alertController.create({
      header: 'Seleccionar Categoría',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (categoryId) => {
            console.log('Agregando tarea:', { title, description, categoryId });
            this.taskService.addTask(
              title.trim(),
              description?.trim(),
              categoryId || undefined
            );
            console.log('Tarea agregada');
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async openCategoryManager() {
    const modal = await this.modalController.create({
      component: CategoryManagerPage
    });

    await modal.present();

    // Recargar categorías cuando se cierre el modal
    await modal.onDidDismiss();
    this.loadData();
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
