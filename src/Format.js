class Format {

    static number(decimals) {
        return new Intl.NumberFormat('de-DE', {
            style: 'decimal',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

}

export default Format;