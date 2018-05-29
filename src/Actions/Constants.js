const constants = {
   ADD_IN_SESSION_LOG            : "ADD_IN_SESSION_LOG",             /* => agrega un LOG a la sesión de trabajo */
   REMOVE_IN_SESSION_LOG         : "REMOVE_IN_SESSION_LOG",          /* => agrega un LOG a la sesión de trabajo */
   ACTIVATE_LOG                  : "ACTIVATE_LOG",                   /* => agrega LOG existente en sesión a visualización */
   DEACTIVATE_LOG                : "DEACTIVATE_LOG",                 /* => quita LOG existente en sesión de visualización */
   ADD_CHANNEL                   : "ADD_CHANNEL",                    /* => agrega canal a sesión de trabajo */
   REMOVE_CHANNEL                : "REMOVE_CHANNEL",                 /* => remueve canal de sesión de trabajo */
   ACTIVATE_CHANNEL              : "ACTIVATE_CHANNEL",               /* => agrega un gráfico mostrando canal seleccionado para logs activos */
   DEACTIVATE_CHANNEL            : "DEACTIVATE_CHANNEL",             /* => quita gráfico de canal seleccionado  */
   CHANGE_X_ZOOM                 : "CHANGE_X_ZOOM",                  /* => modifica eje X en todos los active-channels */
   CHANGE_Y_ZOOM                 : "CHANGE_Y_ZOOM",                  /* => modifica eje Y en active-channel desde el que se triggerea esta action */
   SHIFT_CURVE_X                 : "SHIFT_CURVE_X"                   /* => shiftea curva a izquierda o derecha */
}

export default constants;
