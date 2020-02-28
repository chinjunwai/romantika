import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dos', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'addbranch',
    loadChildren: () => import('./addbranch/addbranch.module').then( m => m.AddbranchPageModule)
  },
  {
    path: 'adminlogin',
    loadChildren: () => import('./adminlogin/adminlogin.module').then( m => m.AdminloginPageModule)
  },
  {
    path: 'adminregis',
    loadChildren: () => import('./adminregis/adminregis.module').then( m => m.AdminregisPageModule)
  },
  {
    path: 'dos',
    loadChildren: () => import('./dos/dos.module').then( m => m.DosPageModule)
  },
  {
    path: 'branchdo/:key/:bID',
    loadChildren: () => import('./branchdo/branchdo.module').then( m => m.BranchdoPageModule)
  },
  {
    path: 'report/:key/:bID',
    loadChildren: () => import('./report/report.module').then( m => m.ReportPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
