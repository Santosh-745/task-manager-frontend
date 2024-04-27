import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TasksService } from '../../services/tasks.service';
import { NgFor } from '@angular/common';
import { ProjectsService } from '../../services/projects.service';
import { CreateProject, Project } from '../../projects-list/project.model';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    NgFor,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './create-project-modal.component.html',
  styleUrl: './create-project-modal.component.css',
  providers: [provideNativeDateAdapter()]
})
export class ModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateProject,
    private taskService: TasksService,
    private projectService: ProjectsService,
    @Inject(MAT_DIALOG_DATA) public users: any,
  ) {}

  ngOnInit() {
    this.users = this.taskService.getUsers()
      .subscribe((res) => {
        this.users = res.users;
      });
    
    this.projectService.newProject
      .subscribe((project: CreateProject) => {
        this.data = project;
      })
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}