
var img_url;
var user_name;
var user_gender;
var user_mail;
var user_birthday;

function error(type, str) {
  $(type + '-error').text(str);
  $(type).addClass('err');
}

function clear() {
  $('#name-error').text("");
  $('#datepicker-error').text("");
  $('#mail-error').text("");
  $('#name').removeClass('err');
  $('#datepicker').removeClass('err');
  $('#mail').removeClass('err');


}
function check() {
  clear();
  var english = /^[A-Za-z0-9]+$/;
  const correctmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const name = user_name;
  const datepicker = user_birthday;
  const mail = user_mail;
  let ans = true;


  if (datepicker==""){
      error("#datepicker", '此為必填欄位');
      ans = false;        
  }

  if (name == "") {
      error("#name", '此為必填欄位');
      ans = false;
  }

  if (mail == "") {
      error("#mail", '此為必填欄位');
      ans = false;
  } else {
      if (!correctmail.test(mail)) {
          error("#mail", '電子郵件無效');
          ans = false;
      }
  }

  return ans;

}

function buttonenable() {
  let buttons = document.getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = false;
      buttons[i].style.cursor = "pointer";
  }
}

function hrefenable() {
  let hrefs = document.getElementsByTagName('a');
  for (let i = 0; i < hrefs.length; i++) {
      hrefs[i].style.cursor = "pointer";
      hrefs[i].style.pointerEvents = "auto";

  }
}

function buttonunable() {
  let buttons = document.getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      buttons[i].style.cursor = "default";
  }
  $('.checkconfirm').css("cursor", "pointer");
  $('.checkconfirm').prop("disabled", false);
}

function hrefunable() {
  let hrefs = document.getElementsByTagName('a');
  for (let i = 0; i < hrefs.length; i++) {
      hrefs[i].style.cursor = "default";
      hrefs[i].style.pointerEvents = "none";
  }
}

$(document).ready(function() {
  //console.log("hello");
  

    let bannerbuttons = document.getElementsByClassName('bannerbutton');
   // console.log(bannerbuttons);
   // bannerbuttons[0].classList.add('active');


    for (let i = 0; i < bannerbuttons.length; i++) {
        bannerbuttons[i].addEventListener('click', function(e) {
            for (let i = 0; i < bannerbuttons.length; i++) {
                bannerbuttons[i].classList.remove('active');
            }
            e.target.classList.add('active');
        });
    }
    $( function() {
      $( "#datepicker" ).datepicker({
        showOtherMonths: true,
        selectOtherMonths: true
      });
    });
    (function () {//upload img file
      var uploader = document.createElement('input'),
        image = document.getElementById('img-result');
        add_button = document.getElementById('upload_img');
      uploader.type = 'file';
      uploader.accept = 'image/*';

      add_button.onclick = function() {
        uploader.click();
      }

      uploader.onchange = function() {
        var reader = new FileReader();
        reader.onload = function(evt) {
          image.style.backgroundImage = 'url(' + evt.target.result + ')';
          img_url=evt.target.result;
        }
        reader.readAsDataURL(uploader.files[0]);
      }

      document.querySelector('.hide-button').onclick = function () {
        document.querySelector('.upload-result').style.display = 'none';
      };

      document.querySelector('.show-button').onclick = function () {
        document.querySelector('.upload-result').style.display = 'block';
      };
    })();

    $(document).on('mouseenter', '#send_button', function () {
      $(this).css('background','#D0D9DC').css('color','#4B515F');
  	}).on('mouseleave', '#send_button', function () {
      $(this).css('background','#799FB4').css('color','#F7F6E4');
  	});
    $(document).on('mouseenter', '#upload_img', function () {
      $(this).css('background','#D0D9DC').css('color','#4B515F');
    }).on('mouseleave', '#upload_img', function () {
      $(this).css('background','#799FB4').css('color','#F7F6E4');
    });
    $(document).on('mouseenter', '#switch_data', function () {
      $(this).css('opacity',0.75);
  	}).on('mouseleave', '#switch_data', function () {
      $(this).css('opacity',1);
  	});

    $(document).on('mouseenter', '#user', function () {
      $(this).css('border-color','#D0D9DC');
  	}).on('mouseleave', '#user', function () {
      $(this).css('border-color','#789FB3');
  	});
    let span_menu=0;
    $(document).on('click', '#user', function () {
      if(!span_menu){
        $('.menubar').css('visibility','visible');
        span_menu=1;
      }
      else{
        $('.menubar').css('visibility','hidden');
        span_menu=0;
      }
    });
    $(document).on('click',"#bar1",function(){
      localStorage.clear();
    })
    //click region except menubar
    $(document).mouseup(function(e){
      var _con = $('.menubar'); 
      if(!_con.is(e.target) && _con.has(e.target).length === 0){ 
        $('.menubar').css('visibility','hidden');
        span_menu=0;
      }
    });
    $(document).on('mouseenter', '.menubar', function () {
      $(this).css('background','#d6dde4');
  	}).on('mouseleave', '.menubar', function () {
      $(this).css('background','#b8bec4');
  	});

    
    $(document).on('click','#send_button',function(){
      console.log(localStorage.getItem("account"))

      if($("#name").val())
          user_name=$("#name").val().trim();
      if($("#mail").val())
        user_mail=$("#mail").val().trim();
      
      user_gender=$("#gender").val()==1? '男':'女';
      if($("#datepicker").val())
        user_birthday=$("#datepicker").val();
      console.log("sexial: "+user_gender);
      if(check()){
        $.post('./Users/changedata',{
          id:localStorage.getItem("account"),
          icon:img_url,
          name:user_name,
          mail:user_mail,
          gender:user_gender,
          birthday:user_birthday
        },(res)=>{
         console.log("post success!");
         buttonunable();
         hrefunable();

         $('.alert-mess').text('資料已更新')
         $('.check').css("visibility", "visible");
         $('.mask').css("visibility", "visible");
        });
      }
      
    })

    $('.checkconfirm').click(function(e) {
      buttonenable();
      hrefenable();
      $('.check').css("visibility", "hidden");
      $('.mask').css("visibility", "hidden");
    });

    let tri=0;
    $(document).on('click','#switch_data',function(){
      if(!tri){
        document.getElementById('data_bar').textContent='我的足跡';
        $('#left_data').css('visibility','hidden');
        $('#upload_img').css('visibility','hidden');
        $('#img_post').css('visibility','hidden');
        document.getElementById('switch_data').classList.remove('triangle');
        document.getElementById('switch_data').classList.add('anti-triangle');
        tri=1;
      }
      else{
        document.getElementById('data_bar').textContent='我的檔案';
        $('#left_data').css('visibility','visible');
        $('#upload_img').css('visibility','visible');
        $('#img_post').css('visibility','visible');
        document.getElementById('switch_data').classList.remove('anti-triangle');
        document.getElementById('switch_data').classList.add('triangle');
        tri=0;
      }

    });
  });

function getUser() {
    var account = localStorage.getItem("account");
    $.get('./users/find/' + account, {}, (res) => {
        console.log(res.gender);
        document.getElementById('name').placeholder=res.name;
        document.getElementById('img-result').style.backgroundImage = 'url('+res.icon+')';
        $('#user').css('background-image','url('+res.icon+')').css('background-size','cover');
        document.getElementById('mail').placeholder = res.mail;
        document.getElementById('gender').value = (res.gender=='男'? 1:2);
        document.getElementById('datepicker').placeholder = res.birthday;

        img_url=res.icon;
        user_name=res.name;
        user_gender=res.gender;
        user_mail=res.mail;
        user_birthday=res.birthday;

    });
}
