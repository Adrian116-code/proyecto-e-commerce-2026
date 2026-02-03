import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { adminGuard } from './auth/admin-guard';
import { CarritoDeCompras } from './carrito-de-compras/carrito-de-compras';
import { MetodoDePago } from './metodo-de-pago/metodo-de-pago';
import { DetallesDelPedido } from './detalles-del-pedido/detalles-del-pedido';
import { CrearObjetos } from './crear-objetos/crear-objetos';
import { ListaObjetos } from './lista-objetos/lista-objetos';
import { ModificarObjetos } from './modificar-objetos/modificar-objetos';

export const routes: Routes = [
{ path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { 
    path: 'admin', 
    component: AdminDashboard, 
    canActivate: [adminGuard]
  },
  { path:'carrito-de-compras', component: CarritoDeCompras},
  { path:'metodo-de-pago', component: MetodoDePago},
  { path:'detalles-del-pedido', component: DetallesDelPedido},
  { 
    path: 'crear-objetos', 
    component: CrearObjetos, 
    canActivate: [adminGuard]
  },
  { 
    path: 'lista-objetos', 
    component: ListaObjetos, 
    canActivate: [adminGuard]
  },
    { 
    path: 'modificar-objetos', 
    component: ModificarObjetos, 
    canActivate: [adminGuard]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
