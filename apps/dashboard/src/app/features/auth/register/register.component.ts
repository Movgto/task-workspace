import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "@dashboard/core/services/auth.service";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'
import { RouterLink } from "@angular/router";
import { SharedFormModule } from "@dashboard/shared/ui/shared-form.module";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    imports: [
        SharedFormModule
    ]
})
export class RegisterComponent {
    public registerForm: FormGroup;

    constructor(private fb: FormBuilder, private authService: AuthService) {
        this.registerForm = fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required]
        })
    }

    onSubmit() {
        if (this.registerForm.valid) {
            console.log(this.registerForm.value);
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    alert('You have been registered. You can now login!')
                },
                error: err => {
                    console.error('Registration failed. ', err);
                }
            })
        }
    }


}