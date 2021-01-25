import { IFormato } from '../formato.store.interface';

export class FormatoActions {
  constructor(
    private getState: () => IFormato,
    private setState: (newState: IFormato) => void,
  ) {

  }
}
