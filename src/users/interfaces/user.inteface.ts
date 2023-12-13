export enum EGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTRO',
}

export interface IUser {
  name: string;
  email: string;
  username: string;
  age: number;
  password: string;
  gender: EGender;
}
