$(function () {
});

function addPair() {
    $('.pairs').append(
        `<div class="pair-row row" onchange="calcPairProfit(event.target)">
                    <div class="col-2 pair">
                        <select class="form-select" name="pair" aria-label="Default select example">
                            <option selected>Select pair</option>
                            <option value="AUD,CAD">AUDCAD</option>
                            <option value="AUD,USD">AUDUSD</option>
                            <option value="EUR,USD">EURUSD</option>
                            <option value="GBP,USD">GBPUSD</option>
                            <option value="NZD,USD">NZDUSD</option>
                            <option value="USD,CAD">USDCAD</option>
                            <option value="XAU,USD">XAUUSD</option>
                        </select>
                    </div>
                    <div class="col-2 position">
                        <select class="form-select" id="position" name="position" aria-label="Default select example">
                            <option value="buy" selected>BUY</option>
                            <option value="sell">SELL</option>
                        </select>
                    </div>
                    <div class="col-1 lot"><input class="form-control" type="text" name="lot"></div>
                    <div class="col-2 swap"><input class="form-control" type="text" name="swap" value="0"></div>
                    <div class="col-2 opening-price"><input class="form-control" type="text" name="opening-price"value="0"></div>
                    <div class="col-2 profit"><input class="form-control" type="text" name="profit" value='0' readonly>
                    </div>
                    <div class="col-1 lot"><button type="button" class="btn btn-outline-danger" onclick="removePair(this)">Delete</button></div>
                </div>`
    )
    calcTotalProfit();
}

function removePair(el) {
    $('.pairs').find(el).parent().parent().remove();
    calcPairProfit();
}

function calcPairProfit(element) {
    const trade = $(element.closest('.pair-row'));

    if ($(trade).find($('select[name="pair"]')).val() == 'XAU,USD') {
        calcGold(element);
        return;
    }

    const lot = parseFloat(trade.find('input[name=lot]').val());
    const position = trade.find('#position').val();
    // const comission = Math.round((lot * 6) * 100) / 100;
    const swap = parseFloat(trade.find('input[name=swap]').val());
    const qb_rate = parseFloat($('input[name=qb-rate]').val());
    const opening_price = parseFloat(trade.find('input[name=opening-price]').val());
    const current_price = parseFloat($('input[name=current-price]').val());

    let pips = ((current_price - opening_price).toFixed(5) * 10000);
    if (position === 'sell') {
        pips *= -1;
    }
    let profit = ((pips * (10 * lot) * qb_rate) - swap).toFixed(2);
    trade.find('input[name=profit]').val(profit);
    calcTotalProfit();
}

function calcGold(element) {
    console.log('calculating gold');
    const trade = $(element.closest('.pair-row'));
    const lot = parseFloat(trade.find('input[name=lot]').val());
    const position = trade.find('#position').val();
    const opening_price = parseFloat(trade.find('input[name=opening-price]').val());
    const current_price = parseFloat($('input[name=current-price]').val());

    let pips = (current_price - opening_price);
    if (position === 'sell') {
        pips *= -1;
    }
    let profit = ((pips * (100 * lot))).toFixed(2);
    trade.find('input[name=profit]').val(profit);
    calcTotalProfit();
}

function updatePairProfit() {
    const pairProfits = $('input[name=profit]').toArray();
    pairProfits.forEach(pair => {
        calcPairProfit(pair);
    });
}

function calcTotalProfit() {
    const pairProfits = $('input[name=profit]').toArray();
    let total = 0;
    pairProfits.forEach(pair => {
        total += parseFloat(pair.value);
    });

    $('input[name=total-profit]').val(total.toFixed(2));
}

function raiseTarget(val) {
    const current_price = parseFloat($('input[name=current-price]').val());
    let new_current_price = parseFloat(current_price + (val / 10000)).toFixed(5);
    $('input[name=current-price]').val(new_current_price);
    updatePairProfit();
}

function lowerTarget(val) {
    const current_price = parseFloat($('input[name=current-price]').val());
    let new_current_price = parseFloat(current_price - (val / 10000)).toFixed(5);
    $('input[name=current-price]').val(new_current_price);
    updatePairProfit();
}