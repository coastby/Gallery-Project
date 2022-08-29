function setNew (_menu) {
  var menus = document.querySelectorAll('nav li');
  menus.forEach(function (menu) {
    menu.classList.remove('on');
  })

  document.querySelector('nav .' + _menu).classList.add('on');
  document.querySelector("main").className = _menu;
}

function camera_click () {
  var camera_icon = document.getElementsByClassName('add-box');
  camera_icon[0].addEventListener("click", function () {setNew('upload');});
}


function cnt_description () {
  var desc_span = document.querySelector('#upload .cnt_str');
  var desc_len = document.querySelector('#upload input.description').value.length;

  desc_span.innerHTML = desc_len + "/20";
}

function showMyInfo () {
  var id_box = document.querySelector('#myinfo table > tbody > tr:nth-child(1) > td');
  id_box.innerHTML = my_info['id'];

  var name_box = document.querySelector('#myinfo table > tbody > tr:nth-child(2) > td');
  name_box.innerHTML = my_info['user_name'];

  var intro_box = document.querySelector('#myinfo table > tbody > tr:nth-child(3) > td > span');
  intro_box.innerHTML = my_info['introduction'];

  document.querySelector("#myinfo table td input[name=_level][value="+my_info.as+"]").checked = true;
  
  document.querySelector("#myinfo table td input[type=checkbox]").checked = false;
  my_info.interest.forEach(function (item) {
    document.querySelector("#myinfo table td input[type=checkbox][value="+item+"]").checked = true;
  })
}

function init () {
  showMyInfo();
  showPhotos ();
  setOptEvent ();
  setFilterEvent ();
  camera_click ();
}

function editing () {
  document.querySelector('#myinfo > div.edit_off').className = 'edit_on';
  var inputs = document.querySelectorAll('#myinfo table td input');
  inputs.forEach(function (input) {
    input.disabled = false;
    document.querySelector('#myinfo #intro_inp').value = my_info['introduction'];
  })
}

function myinfo_exit () {
  document.querySelector('#myinfo > div.edit_on').className = 'edit_off'
  var inputs = document.querySelectorAll('#myinfo table td input');
  inputs.forEach(function (input) {
    input.disabled = true;
  })
}

function myinfo_submit () {
  myinfo_exit();
  var intro_val = document.querySelector('#myinfo #intro_inp').value;
  var level_val = document.querySelector('#myinfo input[name=_level]:checked').value;
  var interest_arr = document.querySelectorAll('#myinfo input[type=checkbox]:checked');
  var interest_val = [];
  interest_arr.forEach(function(item) {
    interest_val.push(item.value);
  })
  
  my_info['introduction'] = intro_val;
  my_info['as'] = level_val;
  my_info['interest'] = interest_val;
  showMyInfo();
}

var sorts = {
  recent : function (a, b) {return (a.idx > b.idx) ? -1 : 1},
  like : function (a, b) {return (a.likes > b.likes) ? -1 : 1}
};
var filters = {
  all : function (it) {return true;},
  mine : function (it) {return it.user_id === my_info['user_name']},
  like : function (it) {return my_info['like'].indexOf(it.idx) > -1;},
  follow : function (it) {return my_info['follow'].indexOf(it.user_id) > -1;}
}

var sort = function (a, b) {return (a.idx > b. idx) ? -1 : 1};
var filter = filters.all;

function setFilterEvent () {
  var options = document.getElementsByClassName('pic-op');
  options[0].addEventListener('click', function(event){
  var opt = event.target.id;
  setFilter(opt);
  });  
}

function setFilter (opt) {
  filter = filters[opt];
  showPhotos();

  var menus = document.querySelectorAll('.pic-op li');
  menus.forEach(function (menu) {
    menu.classList.remove('on');
  })
  document.querySelector('.pic-op #' + opt).classList.add('on');
}

function setOptEvent () {
  var orders = document.getElementsByClassName('view-op');
  orders[0].addEventListener('click', function(event){
  var order = event.target.id;
  setSort(order);
  });  
}


function setSort (order) {
  //사진 정렬 바꾸기
  sort = sorts[order];
  showPhotos();
  //선택한 메뉴 디자인 바꾸기
  var menus = document.querySelectorAll('.view-op li');
  menus.forEach(function (menu) {
    menu.classList.remove('on');
  })
  document.querySelector('.view-op #' + order).classList.add('on');
}

function sayHi () {
  console.log ("hello");
}


function showPhotos () {
  //계속 붙이기만 하니까 함수 실행할때마다 늘어남, 비우는 것도 필요할 듯
  var existingNodes = document.querySelectorAll('#gallery article:not(.hidden)');
  existingNodes.forEach(function (existingNode) {existingNode.remove();})

  var filtered = photos.filter(filter);
  filtered.sort(sort);

  var gallery = document.querySelector('.article-box');
  var smaple_article = gallery.querySelector("article.sample");
  
  filtered.forEach(function(photo) {
    var new_article = smaple_article.cloneNode(true);
    var id = photo.idx;
    new_article.setAttribute("id", id);
    new_article.querySelector(".photo-img").src = "img/photo/"+photo['file_name'];
    new_article.querySelector(".likes-num").innerHTML = photo['likes'];
    new_article.querySelector(".user-name").innerHTML = photo['user_name'];
    new_article.querySelector(".photo-desc").innerHTML = photo['description'];
    if(my_info['like'].indexOf(photo['idx']) > -1) {
      new_article.querySelector('.heart-icon img').src = "img/interface/heart_on.png";
    } else {
      new_article.querySelector('.heart-icon img').src = "img/interface/heart_off.png";
    }
    new_article.querySelector('.heart-icon').addEventListener("click", function(){heartToggle(id);})
    new_article.classList.remove("hidden");
    new_article.classList.remove("sample");

    gallery.append(new_article);
  });
}


function heartToggle (idx) { 
  var int_idx = parseInt(idx);
  var like_index = my_info['like'].indexOf(idx);
  var sel_article = document.getElementById(idx);
  var likes = photos[int_idx-1]['likes'];
  if (like_index > -1) {
    //내 좋아요 목록에서 빼기
    my_info['like'].splice(like_index, 1);
    //하트 그림 클래스 off로 해주기
    sel_article.querySelector('.heart-icon img').src = "img/interface/heart_off.png";
    //숫자 하나 낮추기
    photos[int_idx-1]['likes'] = likes - 1;
    sel_article.querySelector('.likes-num').innerHTML = likes - 1;
  } else {
    //내 좋아요 목록에 추가
    my_info['like'].push(idx);
    //하트 그림 on으로 바꾸기
    sel_article.querySelector('.heart-icon img').src = "img/interface/heart_on.png";
    //숫자 하나 올리기
    var likes = photos[int_idx-1]['likes'];
    photos[int_idx-1]['likes'] = likes + 1;
    sel_article.querySelector('.likes-num').innerHTML = likes + 1;
  }
}

