import { Observable, BehaviorSubject } from 'rxjs';

const P = <T>(property: (object: T) => void) => {
  const chaine = property.toString();
  const arr = chaine.match(/[\s\S]*{[\s\S]*\.([^\.; ]*)[ ;\n]*}/);
  return arr[ 1 ];
};


export class Store<T> {
  private _state$: BehaviorSubject<T>;

  protected constructor(initialState: T) {
    this._state$ = new BehaviorSubject(initialState);
  }

  get state$(): Observable<T> {
    return this._state$.asObservable();
  }

  get state(): T {
    return this._state$.getValue();
  }

  setState(nextState: T): void {
    this._state$.next(nextState);
  }

  buildScopedSetState<E>(propName?: string) {
    if (!propName) {
      return (state: E) => { this.setState({ ...this.state, ...state }); };
    }

    return (state: E) => { this.setState({ ...this.state, [ propName ]: state }); };
  }

  buildScopedGetState<E>(propName?: string) {

    return (): E => propName ? this.state[ propName ] : this.state;
  }



  /**
   * Nuevas propiedades
   */

  dispatch = (newState: T, prop = null) => {

    const state = (typeof newState === 'function') ?
      newState((prop ? this.state[ prop ] : this.state)) :
      newState;

    if (prop) {
      this.setState({ ...this.state, [ prop ]: state });
    } else {
      this.setState({ ...this.state, ...state });
    }
  }



  buildDispatch = (exp: ((obj: T) => any)) => {
    //console.log('tipo de: ', P<T>(exp));
    return (newState) => { this.dispatch(newState, P<T>(exp)); };
  }


}
