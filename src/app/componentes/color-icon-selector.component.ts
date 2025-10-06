import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-color-icon-selector',
  templateUrl: './color-icon-selector.component.html',
  styleUrls: ['./color-icon-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ColorIconSelectorComponent {
  @Input() selectedColor: string = '#3880ff';
  @Input() selectedIcon: string = 'folder';
  @Input() categoryName: string = '';

  colors = [
    { value: '#3880ff', name: 'Azul' },
    { value: '#2dd36f', name: 'Verde' },
    { value: '#ffc409', name: 'Amarillo' },
    { value: '#eb445a', name: 'Rojo' },
    { value: '#9d4edd', name: 'Morado' },
    { value: '#f4a261', name: 'Naranja' },
    { value: '#e63946', name: 'Carmesí' },
    { value: '#06ffa5', name: 'Menta' }
  ];

  icons = [
    { value: 'person', name: 'Persona' },
    { value: 'briefcase', name: 'Maletín' },
    { value: 'cart', name: 'Carrito' },
    { value: 'home', name: 'Casa' },
    { value: 'fitness', name: 'Fitness' },
    { value: 'book', name: 'Libro' },
    { value: 'restaurant', name: 'Restaurante' },
    { value: 'car', name: 'Auto' },
    { value: 'airplane', name: 'Avión' },
    { value: 'gift', name: 'Regalo' },
    { value: 'heart', name: 'Corazón' },
    { value: 'star', name: 'Estrella' }
  ];

  constructor(private modalController: ModalController) {}

  selectColor(color: string) {
    this.selectedColor = color;
  }

  selectIcon(icon: string) {
    this.selectedIcon = icon;
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  confirm() {
    this.modalController.dismiss({
      color: this.selectedColor,
      icon: this.selectedIcon
    }, 'confirm');
  }
}
