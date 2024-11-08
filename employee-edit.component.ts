import {Component, OnInit, ViewChild} from '@angular/core';
import {TitlePageService} from '../../../services/title-page.service';
import {TranslateService} from '../../../translate/translate.service';
import {ToastService} from '../../../services/toast-service';
import {Employee} from '../../../models/employee';
import {ProfileService} from '../../../services/profile-configuration.service';
import {EmployeeService} from '../../../services/employee.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../../models/user';
import {GroupService} from '../../../services/group.service';
import {Group} from '../../../models/group';
import {FileItem, FileUploader} from 'ng2-file-upload';
import {DialogComponent} from '../../core/dialog/dialog.component';
import {MatDialog} from '@angular/material';
import {EmployeeBiometryDialogComponent} from '../employee-biometry-dialog/employee-biometry-dialog.component';
import {CanActivateAuth} from '../../../guard/can-activate-auth';
import * as EmailValidator from 'email-validator';
import {SignaturePadFormComponent} from '../../signature-pad/signature-pad-form/signature-pad-form.component';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {ControlPlan} from '../../../models/control-plan';
import {Shift} from '../../../models/shift';


@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss'],
  providers: [ProfileService]
})
export class EmployeeEditComponent implements OnInit {

  public labelBiometry: string;
  public employee: Employee;
  public groups: Group[] = [];
  public user: User;
  hide = true;
  public rolesChangeEmployeesPasswords = ['admin', 'employee_change_password'];
  public canChangeEmployeesPasswords = false;
  @ViewChild('componentForm')
  form: FormData;
  params_register: number;
  type_situation = [{'description': 'Ativo', 'value': 1},
    {'description': 'Desativado', 'value': 2}];

  constructor(private pageTitleService: TitlePageService,
              private toast: ToastService,
              private translate: TranslateService,
              private service: EmployeeService,
              private route: ActivatedRoute,
              private router: Router,
              private serviceProf: GroupService,
              private canActivateAuth: CanActivateAuth,
              private dialog: MatDialog) {}
  ngOnInit() {
    this.labelBiometry = this.translate._('label-employee-register-biometrics');
    this.employee = new Employee();
    this.user = new User();
    this.getProfile();
    this.pageTitleService.setSubTitle('label_module_employee_add');
    this.pageTitleService.setShowBtnRouter('employee');
    this.setRouteParamts();
    this.validateRoleChangeEmployeesPasswords();
     }

  public setRouteParamts(): void {
    this.route.params
      .subscribe((value) => {
        this.params_register =  +value['register'];
        if (this.params_register) {
          this.getEmployeeByRegister(this.params_register);
        }
      });
  }

  public getEmployeeByRegister(idParaments) {
    this.service.clearParameter();
    this.service.getById(idParaments).subscribe(
      (response) => {
        this.employee = response;
        this.employee.departmentDescription = this.employee.department.description;
        this.setUser(this.employee);
        this.getProfile();
        this.updateLabelBiometry();
      },
      ex => {
      });
  }

  private getProfile() {
    this.serviceProf.clearParameter();
    this.serviceProf.getAll().subscribe(
      response => {
        this.groups = response;
      },
      ex => {
        this.toast.error(this.translate._('title-work-instruction'), ex);
      }
    );
  }

  private getDepartment() {
    this.serviceProf.clearParameter();
    this.serviceProf.getAll().subscribe(
      response => {
        this.groups = response;
      },
      ex => {
        this.toast.error(this.translate._('title-work-instruction'), ex);
      }
    );
  }


  private updateLabelBiometry(){
    if (this.employee.user_obj && this.employee.user_obj.biometry_list && this.employee.user_obj.biometry_list.length > 0){
      this.labelBiometry = this.translate._('label-employee-edit-biometrics');
    } else {
      this.labelBiometry = this.translate._('label-employee-register-biometrics');
    }
  }

  private setUser(employee: Employee) {
    if (employee.user_obj === null) {
      this.user =  new User();
      this.user.employee = employee.id;
      this.user.groups = [];
      this.user.group_list = [];
    } else {
      this.user = employee.user_obj;
      if ( this.user.groups === null) {
        this.user.groups = [];
        this.user.group_list = [];
      }
    }
  }



  public get_groups() {
    const groups = [];
    if (this.user.group_list != null) {
      for (const a of this.user.group_list) {
        groups.push(a.id);
      }
    }
    return groups;
  }

  public saveOrUpdate(): void {
    this.employee.user_obj = this.user;
    if (this.employee.email) {
      if (!EmailValidator.validate(this.employee.email)) {
        return this.toast.error(this.translate._('toast-error-title'), this.translate._('VALID_EMAIL'));
      }
    }
    this.employee.user_obj.groups = this.get_groups();
    if ( this.employee.user_obj.groups.length ==0) {
      return this.toast.error(this.translate._('toast-error-title'), this.translate._('required_profiles'));
    }


    if (!this.employee.id) {
       this.service.save(this.employee).subscribe(
        (response) => {
          this.user.id = response.id;
          this.toast.success(this.translate._('toast-success-title'), this.translate._('toast-saved-successfully'));

        },
        ex => {

            this.toast.error(this.translate._('toast-error-title'), ex);

        });
     } else {
      this.service.update(this.employee.id, this.employee).subscribe(
        (response) => {
          this.toast.success(this.translate._('toast-success-title'), this.translate._('toast-saved-successfully'));
          this.addBiometry();
          //this.gotToList();
        },
        ex => {
          this.toast.error(this.translate._('toast-error-title'), ex);

        });
     }
  }

  upload =  (item, uploader)  => {
    item.url = this.service.getURLToUploadEmployee(this.employee.id);
    item.withCredentials = false;
    uploader.uploadAll();
  };

  public initUploaderImgEmployee(): FileUploader {
    const uploader =  this.service.getFileUploader();
    uploader.onAfterAddingFile =  (fileItem: FileItem) => {
      this.upload(fileItem, uploader);
    };

    uploader.onSuccessItem = (fileItem, response: any, status, headers) => {
      const result = JSON.parse(response) as Employee;
      this.employee.signature = result.signature;
      this.successToast();
    };
    return uploader;
  }

  public saveEmployee(){
    this.service.update(this.employee.id, this.employee).subscribe(
      (response) => {
        this.toast.success(this.translate._('toast-success-title'), this.translate._('toast-saved-successfully'));
      },
      ex => {
        this.toast.error(this.translate._('toast-error-title'), ex);
      });
  }

  public deleteImage(employee) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {model: employee, description: this.translate._('label-confirm-remove-item')}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'data' ) {
        employee.signature = null;
        this.saveEmployee();
      }
    });
  }

  private gotToList() {
    this.router.navigate(['../modules/employee']);
  }

  successToast = () => {
    this.toast.success(this.translate._('toast-success-title'), this.translate._('toast-saved-successfully'));
  };

  public openCreateDialog(): void {
    this.dialog.open(EmployeeBiometryDialogComponent, {
      width: '600px',
      data: this.user
    }).afterClosed().subscribe(result => {
    });
  }


  public openSignatureDialog(): void {
    this.dialog.open(SignaturePadFormComponent, {
      width: '870px',
      data: this.user
    }).afterClosed().subscribe(result => {
      if (result.sucess){
        const fileFromBlob = result.data;
        const uploader = this.initUploaderImgEmployee();
        uploader.addToQueue(new Array<File>(fileFromBlob));
        uploader.uploadAll();

      }
    });
  }

  public validateRoleChangeEmployeesPasswords(){
    this.canChangeEmployeesPasswords = this.canActivateAuth.containsRoles(this.rolesChangeEmployeesPasswords);
  }

  public imagesInfo(imgs: string): string {
    if(imgs){
      const host_media = this.service.hostMedia();
      return `${host_media[0].concat('//').concat(host_media[1])}${imgs}`;
    }
  }

  public addBiometry(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {id: '', description: this.translate._('CONFIRM_ADD_BIOMETRY')}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'data') {
        this.gotToList();
      }else{
        this.getEmployeeByRegister(this.params_register);
      }
    });
  }

}
