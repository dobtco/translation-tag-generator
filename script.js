function restoreFromTranslationArray() {
  try {
    var storedTranslations = JSON.parse(store.get('translationsArray'));

    if (typeof storedTranslations === 'object' && storedTranslations.length > 0) {
      var firstLang = storedTranslations.shift();
      $('.translation_language').val(firstLang[0]);
      $('.translation_text').val(firstLang[1]);


      for (i in storedTranslations) {
        var $newTr = $('tbody tr').last().clone();
        $newTr.find('.translation_language').val(storedTranslations[i][0]);
        $newTr.find('.translation_text').val(storedTranslations[i][1]);
        $('tbody').append($newTr);
      }
    }
    calculateResult();
  } catch(err) {

  }
}

function getTranslationsArray() {
  var translations = []

  $('tbody tr').each(function(){
    translations.push([$(this).find('select').val(), $(this).find('textarea').val()]);
  });

  return translations;
}

var storeResult = _.throttle(function() {
  store.set('translationsArray', JSON.stringify(getTranslationsArray()));
}, 100);

function calculateResult() {
  var translations = getTranslationsArray().reverse();
  var liquidStr = ''
  var firstLang = translations.shift()

  liquidStr = liquidStr + "{% if base_lang == '" + firstLang[0] + "' %}" + firstLang[1];

  for (i in translations) {
    if (translations.length == parseInt(i) + 1) {
      liquidStr = liquidStr + "{% else %}" + translations[i][1];
    } else {
      liquidStr = liquidStr + "{% elsif base_lang == '" + translations[i][0] + "' %}" + translations[i][1];
    }
  }

  liquidStr = liquidStr + "{% endif %}"

  $('.result').val(liquidStr)
  storeResult()
}

function addLanguage() {
  var $newTr = $('tbody tr').last().clone();
  $newTr.find(':input').val('')
  $('tbody').append($newTr);
  calculateResult()
}

function removeLanguage() {
  if ($('tbody tr').length > 1) {
    $(this).closest('tr').remove();
  }
  calculateResult()
}

restoreFromTranslationArray();

$(document).on('input', ':input', calculateResult);
$(document).on('click', '.js_add_language', addLanguage);
$(document).on('click', '.js_remove_language', removeLanguage);
$(document).on('click', '.result', function(){
  $(this).select();
});
