import { Component, ViewChild } from '@angular/core';
import { Project } from './project.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProjectsService } from '../services/projects.service';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../create-project/create-project-modal/create-project-modal.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    SideNavComponent,
    MatTableModule, 
    MatPaginatorModule,
    CommonModule,
    MatButtonModule,
    CreateProjectComponent,
    MatToolbarModule
  ],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css'
})
export class ProjectsListComponent {
  constructor(private projectsService: ProjectsService, private dialog: MatDialog) {}
  displayedColumns: string[] = [
    'position', 
    'title', 
    'startDate', 
    'endDate', 
    'owner',
    'actionsColumn'
  ];
  projects: Project[] = [];
  dataSource = new MatTableDataSource<Project>(this.projects);
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.projectsService.projectsChanged.subscribe(result => {
      this.projects = result;
      this.dataSource = new MatTableDataSource<Project>(this.projects);
      this.dataSource.paginator = this.paginator;
    });
    this.projectsService.getProjects();
  }

  openDialog(data: Project, index: number): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectsService.editProject(result, index);
      }
    });
  }

  onEdit(project: Project, index: number) {
    this.projectsService.newProject.next(project);
    this.openDialog(project, index);
  }

  onDelete(index: number) {
    this.projectsService.deleteProject(index);
  }
}
