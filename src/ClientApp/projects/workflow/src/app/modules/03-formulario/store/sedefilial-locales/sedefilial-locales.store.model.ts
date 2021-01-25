import { IFormatoBody } from './sedefilial-locales.store.interface';

export class SedeFilialLocales implements IFormatoBody{
  isLoading=false;
  error=null;
  id=null;
  idVersion=null;
  sedeFilialLocales=[];
}

export class SedeFilialLocalesStoreModel{
  sedeFilialLocales = new SedeFilialLocales();
}
