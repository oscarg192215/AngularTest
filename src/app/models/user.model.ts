
import { Property } from "./property.model";

export class User {
    id: number;
    idOwner: number;
    name: string;
    address: string;
    photo?: string | null;
    birthday: string;
    email: string;
    password: string;
    properties: Property[];
  
    constructor() {
      this.id = 0; 
      this.idOwner = 0;
      this.name = '';
      this.address = '';
      this.photo = null;
      this.birthday = '';
      this.email = '';
      this.password = '';
      this.properties = []
    }
  }
  