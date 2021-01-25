export const APP_LOCAL_STORAGE = {
  LIC_PATTERN_KEY: 'linu.',
  LIC_SESSION_KEY: 'linu.session',
  LIC_CURRENT_PROC_KEY: 'linu.cf',
};
export const APP_FORM_VALIDATOR = {
  // RE = REGULAR_EXPRESSION
  LIC_RE_NUMERO: '/^[0-9]d*$/',
  LIC_RE_NUMERO_2: '^[0-9]+$',
  LIC_RE_DNI: '^[0-9]{8,8}$',
  LIC_RE_CE: '^[A-Za-z0-9]{12,12}$',
  LIC_RE_RUC: '^[0-9]{11,11}$',
  LIC_RE_LETRAS: '^[áéíóúñA-Za-z ]*[áéíóúñA-Za-z][áéíóúñA-Za-z ]*$',
  LIC_RE_LETRAS_MAYUSCULAS: '^[áéíóúñÁÉÍÓÚÑA-Za-z ]*[áéíóúñÁÉÍÓÚÑA-Za-z][áéíóúñÁÉÍÓÚÑA-Za-z ]*$',
  LIC_RE_TELEFONO: '^[0-9]{7,9}$',
  LIC_RE_CASILLA: '^[0-9]{0,11}$',
  LIC_RE_NUM_SOLICITUD: '^([0-9]{4})((-){0,1}?)[SOLPRO15]*$',
  LIC_RE_NUM_SOLICITUD_LINU: '^([0-9]{4})((-){0,1}?)[SOLINU]*$',
  LIC_RE_NUM_RESOLUCION: '^[áéíóúñÁÉÍÓÚÑA-Za-z0-9° /.-]*$',
  LIC_RE_NOMBRECURSO: '^[áéíóúñÁÉÍÓÚÑäëïöüÄËÏÖÜA-Za-z0-9\(\)&° /.-]*$',
  LIC_RE_NOMBRES_APELLIDOS : '^[áéíóúñÁÉÍÓÚÑäëïöüÄËÏÖÜA-Za-z][áéíóúñÁÉÍÓÚÑäëïöüÄËÏÖÜA-Za-z ,.\'-]+$',
  LIC_RE_TELEFONO_CELULAR: '^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]+$', // '^[0-9]{9}$',
  LIC_RE_TELEFONO_FIJO_PROVINCIA: '^[\(][0-9][0-9][0-9][\)][0-9][0-9][0-9][0-9][0-9][0-9]+$',// '^\([0-9]{2}\)[0-9]{6}$',
  LIC_RE_TELEFONO_FIJO_LIMA: '^[\(][0-9][0-9][\)][0-9][0-9][0-9][0-9][0-9][0-9][0-9]+$'// '^\([0-9]{2}\)[0-9]{7}$'
};

export const APP_CLOSE_MODAL = {
  LIC_CLOSE_MODAL_LABEL : 'Cerrar',
  LIC_CLOSE_MODAL_ICON : 'arrow_back'
}
