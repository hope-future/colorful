// 変数
var os_dark = window.matchMedia('(prefers-color-scheme: dark)');

var onoff_switch = document.getElementById('myonoffswitch');


// IE の判別
if (!document.currentScript) {
  var ie = true;
  var stylesheet = document.getElementById('stylesheet');
}


// 関数
function dark_on() {
  document.documentElement.classList.add('dark-mode');
  onoff_switch.checked = true;
  sessionStorage.setItem('dark-mode', 'on');

  if (ie) {
    stylesheet.href = 'css/ie-dark.css';
  }
}

function dark_off() {
  document.documentElement.classList.remove('dark-mode');
  onoff_switch.checked = false;
  sessionStorage.setItem('dark-mode', 'off');

  if (ie) {
    stylesheet.href = 'css/ie-light.css';
  }
}


// モードの状態に応じて切り替え
if (sessionStorage.getItem('dark-mode') === 'on') {
  dark_on();
} else if (sessionStorage.getItem('dark-mode') === 'off') {
  dark_off();
} else if (os_dark.matches) {
  dark_on();
} else if (ie) {
  dark_off();
}


// オンオフスイッチを切り替えたとき
onoff_switch.addEventListener('change', function () {
  if (onoff_switch.checked) {
    dark_on();
  } else {
    dark_off();
  }
});


// OS 外観モードを切り替えたとき
os_dark.addListener(function () {
  if (os_dark.matches) {
    dark_on();
  } else {
    dark_off();
  }
});
