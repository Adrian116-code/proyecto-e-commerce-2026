import { Component } from '@angular/core';
import { Auth } from '../../auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
email = '';
  password = '';


  constructor(private auth: Auth, private router: Router) {}

  async signIn() {
    const { data, error } = await this.auth.signIn(this.email, this.password);

    if (error) {
      alert('Error al iniciar sesión: ' + error.message);
    } else {
      console.log('Usuario logueado con éxito:', data);
      this.router.navigate(['/home']);
    }
    
  }
  
  
}
