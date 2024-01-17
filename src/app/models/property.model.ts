
    export class Property {
    idProperty: number = 0;
    name: string  | null = null ;
    address: string  | null = null;
    price: number  | null = null;
    codeInternal: string  | null = null;
    year: number | null = null;
    idOwner: number  | null = null;
    propertiesImage: PropertyImage =new PropertyImage();
    propertiesTrace: PropertyTrace = new PropertyTrace();
  }
  
  export class PropertyImage {
    idPropertyImage: number = 0;
    idProperty: number = 0;
    files?: string  | null = null;
    enabled: boolean  | null = null;
  }
  
  export class PropertyTrace {
    idPropertyTrace: number = 0;
    idProperty: number = 0;
    dateSale: string  | null = null;
    name: string  | null = null;
    value: number  | null = null;
    tax: number  | null = null;
  }

  export class PropertyDetail {
    idProperty: number = 0;
    name: string  | null = null ;
    address: string  | null = null;
    price: number  | null = null;
    codeInternal: string  | null = null;
    year: number | null = null;
    idOwner: number  | null = null;
    value: number  | null = null;
    tax: number  | null = null;
    dateSale: string  | null = null;
    files?: string  | null = null;
  }
  