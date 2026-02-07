import { Component } from '@angular/core';
import { Auth } from '../../auth';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email = '';
  password = '';
  nombre = '';
  apellido = '';

  constructor(
    private auth: Auth,
    private fb: FormBuilder,
    private router: Router
  ) {};

  async signUp() {
    const { data, error } = await this.auth.signUp(this.email, this.password,);

    if (error) {
      alert('Error en el registro: ' + error.message);
    } else {
      alert('¡Registro exitoso! Revisa tu correo para confirmar.');
      this.router.navigate(['/login']);
    }
  }
}