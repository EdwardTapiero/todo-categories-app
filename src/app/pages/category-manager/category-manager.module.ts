import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryManagerPageRoutingModule } from './category-manager-routing.module';

import { CategoryManagerPage } from './category-manager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryManagerPageRoutingModule,
    CategoryManagerPage
  ]
})
export class CategoryManagerPageModule {}
