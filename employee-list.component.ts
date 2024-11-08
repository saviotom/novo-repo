import {Component, ViewChild} from '@angular/core';
import {TitlePageService} from '../../../services/title-page.service';

import {Employee} from '../../../models/employee';
import {MatSort} from '@angular/material';
import {EmployeeService} from '../../../services/employee.service';
import {TranslateService} from '../../../translate/translate.service';
import {MatDialog} from '@angular/material/dialog';
import {ToastService} from '../../../services/toast-service';
import {Department} from '../../../models/department';
import {DepartmentService} from '../../../services/department.service';
import {FormControl} from '@angular/forms';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {Observable} from 'rxjs/Observable';
import {EmployeeCpfDialogComponent} from '../employee-cpf-dialog/employee-cpf-dialog.component';
import {EntityListComponent} from '../../crud/entity-list.component';
import {BaseService} from '../../../services/base.service';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  providers: [DepartmentService]
})
export class EmployeeListComponent extends EntityListComponent<Employee> {



  @ViewChild('file')
  inputFile: any;

  sort: MatSort;

  departments: Department[] = [];
  descriptionFilter: String;
  fieldSearch: string;
  public isDialog=false;
  employee: Employee = new Employee();


  public departmentFormCtrl: FormControl = new FormControl();
  public filteredDepartment: Observable<any[]>;

  constructor(public dialog: MatDialog,
              public service: EmployeeService,
              public serviceDepartment: DepartmentService,
              public toast: ToastService,
              public translate: TranslateService,
              public pageTitleService: TitlePageService) {
    super(service, dialog, toast, translate, pageTitleService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.fieldSearch = '';
    this.listDepartment();
  }





  addParamentersFilters(serviceFilter: BaseService<any>): void {
    if (this.descriptionFilter) {
      serviceFilter.addParameter('description', String(this.descriptionFilter));
    }
    if (this.fieldSearch) {
      const department = this.departments.find(m => m.description === this.fieldSearch);
      serviceFilter.addParameter('department', String(department.id));

    }
  }

  getDisplayedColumns(): string[] {
    return ['employee', 'registration', 'department','last_access','group', 'situation','settings'];
  }

  getSubTitle(): string {
    return   this.translate._('label_module_employee');
  }


  public listDepartment(): void {
    this.serviceDepartment.getAll().subscribe(response => {
        this.departments = response;
        this.autoCompleteDepartment();
      },
      ex => {
        this.toast.error(this.translate._('title-employee'), ex);
      });
  }
  public itemsFilteredDepartment(filter: any) {
   return this.departments ? this.departments.filter(departments =>
     departments.description.toLowerCase().indexOf(filter.toLowerCase()) === 0) : [];
  }

  public autoCompleteDepartment() {
    this.filteredDepartment = this.departmentFormCtrl.valueChanges
      .pipe(
        startWith(''),
        map(department => department ? this.itemsFilteredDepartment(department) : this.departments.slice())
      );
  }



  public fileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const invalidFile = file.name.split('.').pop().toLocaleLowerCase() !== 'csv';
      if (!invalidFile) {
        this.service.importEmplyees(file).subscribe(
          (response) => {
            this.toast.success(this.translate._('toast-success-title'), this.translate._('label-import-success'));
            this.inputFile.nativeElement.value = '';
            this.retrieve();
          },
          ex => {
            this.inputFile.nativeElement.value = '';
            this.toast.error(this.translate._('title-error'), ex);
          });
      } else {
        this.inputFile.nativeElement.value = '';
        this.toast.error(this.translate._('title-error'), this.translate._('label-file-invalid'));
      }

    }
  }



  public openDialog(employee): void {
    const data =  {id: employee.id, cpf: employee.cpf, register: employee.register, name: employee.name};
    this.dialog.open(EmployeeCpfDialogComponent, {
      width: '400px',
      data: data
    }).afterClosed().subscribe(result => {
      this.retrieve();
    });
  }


}
