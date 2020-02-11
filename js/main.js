var STANDARD_DRINK_G = 10;
var METABOLIC_REMOVAL_RATE_GPH = 7.9;
var WATER_CONTENT_OF_BLOOD = 0.8157;
var ALCOHOL_SPECIFIC_GRAVITY = 0.79;

var STANDARD_DRINK_ML = STANDARD_DRINK_G / ALCOHOL_SPECIFIC_GRAVITY;
var METABOLIC_REMOVAL_RATE_MLPH = METABOLIC_REMOVAL_RATE_GPH / ALCOHOL_SPECIFIC_GRAVITY;

if (Number.EPSILON === undefined) {
  Number.EPSILON = Math.pow(2, -52);
}

var $gender = $('#gender');
var $age = $('#age');
var $weight = $('#weight');
var $height = $('#height');
var $brand = $('#brand');
var $beer = $('#beer');
var $categoryBeer = $('#category-beer');
var $beerCup = $('#beer-cup');
var $beerCupNumber = $('#beer-cup-number');
var $wine = $('#wine');
var $categoryWine = $('#category-wine');
var $wineCup = $('#wine-cup');
var $wineCupNumber = $('#wine-cup-number');
var $time = $('#time');
var $cup = $('#cup');
var $cupNumber = $('#cup-number');

$wine.hide();
$wineCup.hide();
$wineCupNumber.hide();

$('#brand').on('change', function () {
  if (this.value === 'beer') {
    $beer.show();
    $beerCup.show();
    $wine.hide();
    $wineCup.hide();
    $wineCupNumber.hide();
  } else {
    $beer.hide();
    $beerCup.hide();
    $wine.show();
    $wineCup.show();
    $wineCupNumber.show();
  }
});

$('#add').on('click', function () {
  var incompleteBio = false;

  var age = +$age.val();
  if (age <= 0) { incompleteBio = true; }

  var height = +$height.val();
  if (height <= 0) { incompleteBio = true; }

  var weight = +$weight.val();
  if (weight <= 0) { incompleteBio = true; }

  var time = +$time.val();
  if (time < 0) { incompleteBio = true; }

  if (incompleteBio) {
    return alert('Vui lòng nhập đầy đủ thông tin...');
  }

  var sex = $gender.val() === 'male' ? 'm' : 'f';

  var ingestedMl = rupAlcoholMlInDrinks();
  var outputIngestedMl = Math.round(ingestedMl * 100) / 100;
  var outputStandardDrinks = Math.round(ingestedMl / STANDARD_DRINK_ML * 100 + Number.EPSILON) / 100;

  if (ingestedMl === 0.00) {
    var outputRemainingMl = 0.00;
    var outputBAC = 0.000;
    var minutesToOhFive = 0;
  } else {
    var elapsedTime = +$time.val() / 60;
    var outputRemainingMl = rupCalcRemaining(ingestedMl, elapsedTime);
    if (outputRemainingMl < 0) {
      outputRemainingMl = 0;
    }
    var bac = rupCalcBac(outputRemainingMl, rupCalcBodyWater(height, weight, age, sex));

    var bodyWaterMl = rupCalcBodyWater(height, weight, age, sex);

    outputRemainingMl = Math.round(outputRemainingMl * 100) / 100;
    outputBAC = Math.round(bac * 1000) / 1000;

    minutesToOhFive = rupCalcMinutesFromBac(outputBAC, bodyWaterMl);
  }

  var status = 'Demo';

  if (outputBAC > 0.35) {
    status = 'Nồng độ cồn của bạn đã vượt quá 80 miligam/100 mililít máu, nếu tiếp tục điều khiển phương tiện giao thông trên đường sẽ bị phạt tiền từ 6.000.000 đồng đến 8.000.000, và bị tước quyền sử dụng Giấy phép lái xe từ 22 tháng đến 24 tháng.';
    
  } else if (outputBAC > 0.26) {
    status = 'Nồng độ cồn của bạn đã vượt quá 80 miligam/100 mililít máu, nếu tiếp tục điều khiển phương tiện giao thông trên đường sẽ bị phạt tiền từ 6.000.000 đồng đến 8.000.000, và bị tước quyền sử dụng Giấy phép lái xe từ 22 tháng đến 24 tháng.';

  } else if (outputBAC > 0.19) {
    status = 'Nồng độ cồn của bạn đã vượt quá 80 miligam/100 mililít máu, nếu tiếp tục điều khiển phương tiện giao thông trên đường sẽ bị phạt tiền từ 6.000.000 đồng đến 8.000.000, và bị tước quyền sử dụng Giấy phép lái xe từ 22 tháng đến 24 tháng.';

  } else if (outputBAC > 0.079) {
    status = 'Nồng độ cồn của bạn đã vượt quá 80 miligam/100 mililít máu, nếu tiếp tục điều khiển phương tiện giao thông trên đường sẽ bị phạt tiền từ 6.000.000 đồng đến 8.000.000, và bị tước quyền sử dụng Giấy phép lái xe từ 22 tháng đến 24 tháng.';

  } else if (outputBAC > 0.07) {
    status = 'Nồng độ cồn của bạn đã vượt quá 50 miligam đến 80 miligam/100 mililít máu, nếu tiếp tục điều khiển phương tiện giao thông trên đường sẽ bị phạt tiền từ 4.000.000 đồng đến 5.000.000, và bị tước quyền sử dụng Giấy phép lái xe từ 16 tháng đến 18 tháng.';

  } else if (outputBAC > 0.049) {
    status = 'Nồng độ cồn của bạn đã vượt quá 50 miligam đến 80 miligam/100 mililít máu, nếu tiếp tục điều khiển phương tiện giao thông trên đường sẽ bị phạt tiền từ 4.000.000 đồng đến 5.000.000, và bị tước quyền sử dụng Giấy phép lái xe từ 16 tháng đến 18 tháng.';

  } else if (outputBAC > 0.035) {
    status = 'Điều khiển phương tiện giao thông trên đường mà trong máu có nồng độ cồn nhưng chưa vượt quá 50 miligam/100 mililít máu, sẽ bị phạt tiền từ 2.000.000 đồng đến 3.000.000, và bị tước quyền sử dụng Giấy phép lái xe từ 10 tháng đến 12 tháng.';

  } else if (outputBAC > 0.005) {
    status = 'Điều khiển phương tiện giao thông trên đường mà trong máu có nồng độ cồn nhưng chưa vượt quá 50 miligam/100 mililít máu, sẽ bị phạt tiền từ 2.000.000 đồng đến 3.000.000, và bị tước quyền sử dụng Giấy phép lái xe từ 10 tháng đến 12 tháng.';

  }

  var $info = $(
    ' <div class="post"><p>Đã uống vào: <strong>' + outputIngestedMl +
    ' ml</strong><br>Còn lại trong cơ thể: <strong>' + outputRemainingMl +
    ' ml</strong><br>Nồng độ cồn trong máu: <strong>' + outputBAC +
    ' %</strong><br>Thời gian chờ để hết men: <strong>' + minutesToOhFive +
    ' phút</strong><br>Chỉ định: <strong>' + status +
    ' </strong></p></div>');
  $('.info').empty();
  $info.hide().prependTo('.info').fadeIn(300);
});

$('#reset').on('click', function () {
  $gender.val('male');
  $brand.val('beer');
  $beer.show();
  $beerCup.show();
  $wine.hide();
  $wineCup.hide();
  $wineCupNumber.hide();
  $weight.val('');
  $time.val('');
  $age.val('');
  $height.val('');
});

function rupCalcRemaining(ingested, elapsedTimeHours) {
  return (ingested - (METABOLIC_REMOVAL_RATE_MLPH * elapsedTimeHours));
}

function rupCalcBodyWater(height, weight, age, sex) {
  var HEIGHT_FACTOR = (sex == "m") ? 0.1074 : 0.1069;
  var WEIGHT_FACTOR = (sex == "m") ? 0.3362 : 0.2466;
  var AGE_FACTOR = (sex == "m") ? 0.09516 : 0;
  var BODY_WATER_CONST = (sex == "m") ? 2.447 : 2.097;
  var h = HEIGHT_FACTOR * height;
  var w = WEIGHT_FACTOR * weight;
  var a = AGE_FACTOR * age;
  var ml = (h - a + w + BODY_WATER_CONST) * 1000;
  return (ml);
}

// Result in % g/ml
function rupCalcBac(alcoholMl, bodyWaterMl) {
  bloodMl = bodyWaterMl / WATER_CONTENT_OF_BLOOD;
  alcoholGrams = alcoholMl * ALCOHOL_SPECIFIC_GRAVITY;
  bac = 100 * (alcoholGrams / bloodMl);
  return bac;
}

// // BAC in % g/ml
function rupCalcAlcoholRemainingFromBAC(bac, bodyWaterMl) {
  bloodMl = bodyWaterMl / WATER_CONTENT_OF_BLOOD;
  alcoholGrams = bloodMl * bac / 100
  alcoholMl = alcoholGrams / ALCOHOL_SPECIFIC_GRAVITY;
  return alcoholMl;
}

// BAC in % g/ml
function rupCalcMinutesFromBac(bac, bodyWaterMl) {
  if (bac <= 0) return 0;
  alcoholMl = rupCalcAlcoholRemainingFromBAC(bac, bodyWaterMl);
  return Math.ceil(alcoholMl * 60 / METABOLIC_REMOVAL_RATE_MLPH);
}

function rupAlcoholMlInDrinks() {
  var qty = 0, volume = 0, level = 0;
  if ($brand.val() === 'beer') {
    var beer = $categoryBeer.val().split('-');
    qty = $beerCupNumber.val();
    volume = beer[0];
    level = beer[1];
  } else {
    qty = $cupNumber.val();
    volume = $cup.val();
    level = $categoryWine.val();
  }
  return (qty * volume * level * 0.01);
}