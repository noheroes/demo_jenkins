export interface ISedeFilial {
  idSedeFilial: string;
  codigo: string;
  ubigeo: string;
  descripcionUbigeo: string;
  esSedeFilial: true;
  idCatalogo: string;
}

export interface ISedesFiliales {
  isLoading: boolean;
  error: any;
  sedes: ISedeFilial[];
}

export interface IFormatoSedeFilial {
  id: string;
  idVersion: string;
  mallaCurrilulares: [];
  personas: [];
  sedeFiliales: [];
}
