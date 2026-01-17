import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterLink } from "@angular/router";

@NgModule({
    imports: [
        MatFormFieldModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        ReactiveFormsModule,
        RouterLink,
        CommonModule,        
    ],
    exports: [
        MatFormFieldModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        ReactiveFormsModule,
        RouterLink,
        CommonModule
    ]
})
export class SharedFormModule { }