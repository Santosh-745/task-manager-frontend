import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectsService } from '../services/projects.service';
import { Subscription } from 'rxjs';
import { User } from '../authentication/user.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatListModule,
    MatChipsModule,
    MatTableModule,
    CommonModule
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectsService
  ) {}

  id: number = 0;
  paramsSubscription: Subscription | undefined;
  displayedColumns: string[] = ['property', 'value'];
  dataSource: any[] = [
    { property: "Project Title" },
    { property: "Project Owner" },
    { property: "Project Start Date" },
    { property: "Project End Date" },
    { property: "Project Memebers" },
  ];

  ngOnInit(): void {  
    this.paramsSubscription = this.route.params
      .subscribe((params: Params) => {
        this.id = +params['id'];
        this.projectService.getProject(this.id).subscribe(({project}) => {
          this.dataSource[0]["value"] = `${project?.title}`;
          this.dataSource[1]["value"] = project?.owner?.email;
          this.dataSource[2]["value"] = moment(project?.startDate).format('YYYY-MM-DD HH:mm:ss');
          this.dataSource[3]["value"] = moment(project?.endDate).format('YYYY-MM-DD HH:mm:ss');
          this.dataSource[4]["value"] = project?.users?.map((user: User) => user?.email)
        });
      })
  }

  ngOnDestroy() {
    this.paramsSubscription?.unsubscribe();
  }

}
