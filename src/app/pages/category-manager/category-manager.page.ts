import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.page.html',
  styleUrls: ['./category-manager.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CategoryManagerPage implements OnInit {
  categories: Category[] = [];

  // Colores predefinidos
  colors = [
    '#3880ff', // blue
    '#2dd36f', // green
    '#ffc409', // yellow
    '#eb445a', // red
    '#9d4edd', // purple
    '#f4a261', // orange
    '#e63946', // crimson
    '#06ffa5', // mint
  ];

  // Iconos predefinidos
  icons = [
    'person',
    'briefcase',
    'cart',
    'home',
    'fitness',
    'book',
    'restaurant',
    'car',
    'airplane',
    'gift',
    'heart',
    'star'
  ];

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
    const alert = await this.alertController.create({
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
          handler: (data) => {
            if (data.name && data.name.trim() !== '') {
              this.selectColorAndIcon(data.name);
              return true;
            }
            return false;
          }
        }
      ]
    });

    await alert.present();
  }

  async selectColorAndIcon(name: string) {
    const colorInputs = this.colors.map((color, index) => ({
      name: 'color',
      type: 'radio' as const,
      label: `Color ${index + 1}`,
      value: color,
      checked: index === 0
    }));

    const colorAlert = await this.alertController.create({
      header: 'Seleccionar Color',
      inputs: colorInputs,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Siguiente',
          handler: (color) => {
            this.selectIcon(name, color);
          }
        }
      ]
    });

    await colorAlert.present();
  }

  async selectIcon(name: string, color: string) {
    const iconInputs = this.icons.map((icon, index) => ({
      name: 'icon',
      type: 'radio' as const,
      label: icon.charAt(0).toUpperCase() + icon.slice(1),
      value: icon,
      checked: index === 0
    }));

    const iconAlert = await this.alertController.create({
      header: 'Seleccionar Icono',
      inputs: iconInputs,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: (icon) => {
            this.categoryService.addCategory(name.trim(), color, icon);
          }
        }
      ]
    });

    await iconAlert.present();
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
          handler: (data) => {
            if (data.name && data.name.trim() !== '') {
              this.selectColorAndIconForEdit(category, data.name);
              return true;
            }
            return false;
          }
        }
      ]
    });

    await alert.present();
  }

  async selectColorAndIconForEdit(category: Category, newName: string) {
    const colorInputs = this.colors.map(color => ({
      name: 'color',
      type: 'radio' as const,
      label: color,
      value: color,
      checked: color === category.color
    }));

    const colorAlert = await this.alertController.create({
      header: 'Seleccionar Color',
      inputs: colorInputs,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Siguiente',
          handler: (color) => {
            this.selectIconForEdit(category, newName, color);
          }
        }
      ]
    });

    await colorAlert.present();
  }

  async selectIconForEdit(category: Category, newName: string, newColor: string) {
    const iconInputs = this.icons.map(icon => ({
      name: 'icon',
      type: 'radio' as const,
      label: icon.charAt(0).toUpperCase() + icon.slice(1),
      value: icon,
      checked: icon === category.icon
    }));

    const iconAlert = await this.alertController.create({
      header: 'Seleccionar Icono',
      inputs: iconInputs,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Actualizar',
          handler: (icon) => {
            const updatedCategory: Category = {
              ...category,
              name: newName.trim(),
              color: newColor,
              icon: icon
            };
            this.categoryService.updateCategory(updatedCategory);
          }
        }
      ]
    });

    await iconAlert.present();
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
