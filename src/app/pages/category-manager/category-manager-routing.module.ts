import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryManagerPage } from './category-manager.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryManagerPageRoutingModule {}
