export function getColorFromText(str) {
    let colors = { bitcoin: 'F8A035', monero: '3A9C40', ethereum: '5A3987', ripple: 'CC5741', 'bitcoin-cash': '2B8478', litecoin: '9F3885', dash: '982D00', tokencard: '02475E', neo: '9F5C00', omisego: '005F4A' };
    if(colors[str] != null) return colors[str];

    let hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let c = (hash & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

