if(typeof navigator.userAgent.match(/Chrome|Firefox/i) == 'object' && navigator.userAgent.match(/Chrome|Firefox/i) == null) {
  $("#header p").hide();
}

// Установка масок ввода
$("body").on('click', function(){
  $('#appForms input[name="login"]').mask("0(000)000-00-00");
  $('#appForms input[name="calls"]').mask("0(000)000-00-00");
})



// Показывает/скрывает #panel в зависимости от ее типа
$(document).on("click","#userPanel nav ul li",function() {

  if($(this).attr("data-panel") == $("#userPanel nav ul").attr("data-clicked")) {
    $("#panel").toggleClass("ng-hide");
  }


  // Если чат и информационная панель одновременно видимы
  if(!$("#chat").hasClass("ng-hide") && !$("#panel").hasClass("ng-hide")) {

    if(isMobileDevice()) {
      $("#chat").css({
        'marginLeft': MOBILELEFTASIDEWIDTH + INFOPANELWIDTH,
        'width': $("body").outerWidth() - MOBILELEFTASIDEWIDTH - INFOPANELWIDTH - RIGHTASIDEWIDTH
      })  
    } else {
      $("#chat").css({
        'marginLeft': LEFTASIDEWIDTH + INFOPANELWIDTH,
        'width': $("body").outerWidth() - LEFTASIDEWIDTH - INFOPANELWIDTH - RIGHTASIDEWIDTH
      })
    }

    $("#chat input").css({
      'width': "65%"
    })
  }
   
  $("#userPanel nav ul").attr("data-clicked", $(this).attr("data-panel"));


});

// Добавляет/убирает жирность к ссылкам фильтра
$(document).on("click",".filters li a",function() {
  $(this).toggleClass('active');
});


// Functions

/**
 * Создает base64 строку из файла
 * @param {object} - объект файла
 * @param {function} callback - функция обратного вызова
 */

function makeBase64(file,callback) {
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function () {
		callback(reader.result.split(",")[1]);
	};
	reader.onerror = function (error) {
		// TODO:
	};
}

/**
 * Читает файл и выставляет превью
 * @param {*} input - id поля с файлом 
 */
function readFile(input) {
  $("form div > span").hide();
  $("form div > input[type=file]").hide();
  $('form div > img').show();
  var reader = new FileReader();
  reader.onload = function(e) {
    if(input.files[0].type != 'image/jpeg' && input.files[0].type != 'image/jpg' && input.files[0].type != 'image/png') {
      alert("Загрузите изображение");
      return;
    }
    $('form div > img').attr('src', e.target.result)
  }
  reader.readAsDataURL(input.files[0]);
}

/**
 * Конвертирует  base64 в объект "Файл"
 * @param {*} url 
 * @param {*} filename 
 * @param {*} mimeType 
 */
function urltoFile(url, filename, mimeType){
  return (fetch(url)
    .then(function(res){return res.arrayBuffer();})
    .then(function(buf){return new File([buf], filename, {type:mimeType});})
  );
}

/**
 * Отрисовывает аккаунты в топе
 * @param {object} translations - транслируемые аккаунты 
 */
function setTop(translations,callback){
	$('.topItems .eye-container-full').html('');
  translations.sort(compareTranslation);
	let count = translations.length;
	let html = '';
    for (let i = count;i>0;i--){
    	if (translations[i-1].type != "0"){
          // translations[i-1].userAvatar = "https://eyeinc.ru/api/assets/avatar/"+translations[i-1].avatar;
          translations[i-1].userAvatar = (translations[i-1].avatar.includes("http")) ? translations[i-1].avatar : "https://eyeinc.ru/api/assets/avatar/"+translations[i-1].avatar;
      } else {
			translations[i-1].userAvatar = translations[i-1].preview;
      } 
      
      if (!translations[i-1].address){
        translations[i-1].address = '';
      }
      if (!translations[i-1].name){
        translations[i-1].name = '';
      }
      html += '<div class="eye-x-12 eye-m-3"><div onclick="openAccount('+translations[i-1].id+')" class="text-center objectItem"><img src="'+translations[i-1].userAvatar+ '"/><p class="objectName">' + translations[i-1].name + '</p><ul class="list-inline objectStat"><li><i class="icon icon-eye-like"></i>'+translations[i-1].likes+'</li><li><i class="icon icon-eye-view"></i>'+translations[i-1].watchers+'</li><li><i class="icon icon-eye-plus"></i>'+translations[i-1].followers+'</li></ul></div></div>';
    }

  $('.topItems .eye-container-full').html(html);

  callback();
}

/**
 * Открывает аккаут пользователя (правую панель) по его id
 * @param {*} id - id пользователя
 */
function openAccount(id) {
  angular.element(document.body).scope().getUserDataById(id);
  angular.element(document.body).scope().isShowTop = false;
  angular.element(".openToggle i").removeClass('icon-eye-opentop');
	angular.element(".openToggle i").addClass('icon-eye-closetop');
}

/**
 * Определяет, зашел ли пользователь с мобильного устройства/планшета
 */
function isMobileDevice() {
  if(navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
    return true;
  } else {
    return false;
  }
}