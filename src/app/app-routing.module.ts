import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './services/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { UploadComponent } from './upload/upload.component';
import { ListingComponent } from './listing/listing.component';

const routes: Routes = [
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  {
    path: "login",
    component: LoginComponent,
    title: "Login"
  },
  {
    path: "register",
    component: RegisterComponent,
    title: "Register",
  },
  {
    path: "menu",
    component: MenuComponent,
    title: "Menu",
  },
  {
    path: "profile/:username",
    component: ProfileComponent,
    title: "Profile",
    canActivate: [AuthGuard]
  },
  {
    path: "upload",
    component: UploadComponent,
    title: "Upload",
    canActivate: [AuthGuard]
  },

  { 
    path: 'listing/:listingNumber', 
    component: ListingComponent,
    title: "Listing",
    canActivate: [AuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
