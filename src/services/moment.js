import moment from 'moment'
import 'moment/locale/es';

moment.updateLocale('es', {
    monthsShort : [
        "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
        "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"
    ]
})

moment.locale('es')

export const momentEs = moment