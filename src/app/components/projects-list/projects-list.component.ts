import { Component, ViewChild } from '@angular/core';
import { CreateProject, Project } from './project.model';
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
import { TasksService } from '../services/tasks.service';
import { Router } from '@angular/router';

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
  constructor(
    private projectsService: ProjectsService,
    private dialog: MatDialog,
    private router: Router
  ) {}
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
      this.projects = result.map(project => ({
        ...project,
        ownerEmail: project?.owner?.email
      }));
      this.dataSource = new MatTableDataSource<Project>(this.projects);
      this.dataSource.paginator = this.paginator;
    });
    this.projectsService.getProjects();
  }

  openDialog(id: number): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectsService.editProject(result, +id);
      }
    });
  }

  onEdit(project: Project, id: number) {
    this.projectsService.newProject.next({
      ...project,
      userIds: project?.users?.map(user => user?.id) as number[]
    });
    this.openDialog(id);
  }

  onDelete(id: number) {
    this.projectsService.deleteProject(id);
  }

  viewTasks(id: number) {
    this.router.navigate(['tasks-list', id]);
  }
}
