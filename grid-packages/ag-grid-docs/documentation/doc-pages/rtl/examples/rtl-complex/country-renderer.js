var COUNTRY_CODES = {
    Ireland: 'ie',
    Luxembourg: 'lu',
    Belgium: 'be',
    Spain: 'es',
    'United Kingdom': 'gb',
    France: 'fr',
    Germany: 'de',
    Sweden: 'se',
    Italy: 'it',
    Greece: 'gr',
    Iceland: 'is',
    Portugal: 'pt',
    Malta: 'mt',
    Norway: 'no',
    Brazil: 'br',
    Argentina: 'ar',
    Colombia: 'co',
    Peru: 'pe',
    Venezuela: 've',
    Uruguay: 'uy',
}


function getCountryCellRenderer() {
    class CountryCellRenderer {

        eGui;

        init(params) {
            this.eGui = document.createElement('span')
            this.eGui.style.cursor = 'default'

            //get flags from here: http://www.freeflagicons.com/
            if (
                params.value == null ||
                params.value === '' ||
                params.value === '(Select All)'
            ) {
                this.eGui.innerHTML = params.value
            } else {
                var flag =
                    '<img border="0" width="15" height="10" src="https://flags.fmcdn.net/data/flags/mini/' +
                    COUNTRY_CODES[params.value] +
                    '.png">'
                this.eGui.innerHTML = flag + ' ' + params.value
            }
        }

        getGui() {
            return this.eGui
        }

        refresh(params) {
            return true;
        }
    }
    return CountryCellRenderer
}