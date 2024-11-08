import {ModelBase} from './model-base';
import {Department} from './department';
import {User} from './user';
import {Shift} from './shift';
import {Occupation} from './occupation';

export class Employee extends ModelBase {
  public id: number;
  public name: string= null;
  public register: string= null;
  public type_situation: string;
  public department: Department;
  public user: User;
  public user_id: number;
  public departmentDescription: string= null;
  public signature: string;
  public user_obj: User;
  public email: string;
  public cpf: string;
  public qty_evaluation: number;
  public shift: Shift;
  public birth_date: string = null;
  public admission_date: string = null;
  public leadership_id: string;
  public occupation: Occupation;




}
