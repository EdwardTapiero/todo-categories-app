import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import {ColorIconSelectorComponent} from "../../componentes/color-icon-selector.component";

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.page.html',
  styleUrls: ['./category-manager.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CategoryManagerPage implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.categoryService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  loadCategories() {
    this.categories = this.categoryService.getCategories();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openAddCategoryModal() {
    // Primero pedir el nombre
    const nameAlert = await this.alertController.create({
      header: 'Nueva Categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre de la categoría'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Siguiente',
          handler: async (data) => {
            if (data.name && data.name.trim() !== '') {
              await this.openColorIconSelector(data.name.trim());
              return true;
            }
            return false;
          }
        }
      ]
    });

    await nameAlert.present();
  }

  async openColorIconSelector(name: string, category?: Category) {
    const modal = await this.modalController.create({
      component: ColorIconSelectorComponent,
      componentProps: {
        categoryName: name,
        selectedColor: category?.color || '#3880ff',
        selectedIcon: category?.icon || 'folder'
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      if (category) {
        // Actualizar categoría existente
        const updatedCategory: Category = {
          ...category,
          name: name,
          color: data.color,
          icon: data.icon
        };
        this.categoryService.updateCategory(updatedCategory);
      } else {
        // Crear nueva categoría
        this.categoryService.addCategory(name, data.color, data.icon);
      }
    }
  }

  async editCategory(category: Category) {
    const alert = await this.alertController.create({
      header: 'Editar Categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre',
          value: category.name
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Siguiente',
          handler: async (data) => {
            if (data.name && data.name.trim() !== '') {
              await this.openColorIconSelector(data.name.trim(), category);
              return true;
            }
            return false;
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteCategory(categoryId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Eliminar esta categoría? Las tareas asociadas perderán su categoría.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.categoryService.deleteCategory(categoryId);
          }
        }
      ]
    });

    await alert.present();
  }
}
