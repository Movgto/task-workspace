import { Component, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "@dashboard/core/services/auth.service";
import { SharedFormModule } from "@dashboard/shared/ui/shared-form.module";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [
        SharedFormModule
    ]
})
export class LoginComponent {
    private fb = new FormBuilder();
    public formGroup = this.fb.group({
        email: ['', Validators.email],
        password: ['', Validators.required]
    })
    private authService = inject(AuthService);

    onSubmit() {
        if (!this.formGroup.valid) {
            console.log('The form is not valid');
            console.log(this.formGroup.value)
            return;
        }

        this.authService.login(this.formGroup.value).subscribe({
            next: () => {
                alert('You have logged in!')
            }
        })
    }
}