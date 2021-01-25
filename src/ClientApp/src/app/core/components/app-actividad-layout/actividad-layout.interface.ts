
export interface IActividadColumnDefinition {
  label: string;
  field: string;
  custom: string;
  isDatetime?: boolean;
  dateTimeFormat?: string;
}

export interface IActividadHeaderDefinition {
  fields: IActividadColumnDefinition[];
}
