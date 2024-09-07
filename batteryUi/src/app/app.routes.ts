import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { ClientComponent } from './main/individual/client.component';


export const routes: Routes = [
    {path:'', component:LoginComponent},
    {
        path: 'main',
        component: MainComponent,
        children: [
          { path: 'client', component: ClientComponent },
        ]
      }
];
