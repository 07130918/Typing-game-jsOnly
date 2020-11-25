import { strs } from "./strs.js"
// DOM
const timeElement = document.getElementById('time');
const shortTime = document.getElementById('shortTime');
const midiumTime = document.getElementById('midiumTime');
const longTime = document.getElementById('longTime');
const start = document.getElementById('start');
const reset = document.getElementById('reset');
const result = document.getElementById('result');
const typedField = document.getElementById('typed');
const untypedField = document.getElementById('untyped');

let time;
//時間指定イベント
shortTime.addEventListener('click', function () {
  time = 10000;
  updateTime();

})
midiumTime.addEventListener('click', function () {
  time = 20000;
  updateTime();
})
longTime.addEventListener('click', function () {
  time = 30000;
  updateTime();
})

// 経過時間(ミリ秒)
let intervalId = null;
let typed = '';
let untyped = 'Start';
let missTypeCount = 0;
let successTypeCount = 0;

// 関数
function updateTime() {
  const ms = time % 1000;
  const s = Math.floor(time / 1000) % 60; //小数切り捨て
  const mi = Math.floor(time / (1000 * 60)) % 60;
  const h = Math.floor(time / (1000 * 60 * 60)) % 60;

  const msStr = ms.toString().padStart(3, '0') //数値を文字列に変換
  const sStr = s.toString().padStart(2, '0')
  const miStr = mi.toString().padStart(2, '0')
  const hStr = h.toString().padStart(2, '0')

  timeElement.innerHTML = `${hStr}:${miStr}:${sStr}.${msStr}`;
}

function getRandomWord() { //単語ランダム抽出
  const i = Math.floor(Math.random() * Math.floor(strs.length));
  return strs[i];
}

function updateTextField() {
  typedField.textContent = typed;
  untypedField.textContent = untyped;
}

function next() { //新たな問題を表示,1から単語をタイピング指せる関数
  typed = '';
  untyped = getRandomWord();
  updateTextField();
}

function keypressCallback(e) {
  if (e.key !== untyped.substring(0, 1)) { //押したキーが正しくないとき
    missTypeCount++;
    return;
  }
  successTypeCount++;
  typed += untyped.substring(0, 1); //はじまりから1文字とる
  untyped = untyped.substring(1);//2文字目から末尾まで

  updateTextField();

  if (untyped === '') { next() } //全部打ち終わったら
}

function gameStart() {
  let pre = new Date();
  intervalId = setInterval(function () { //第2引数の時間ごとに第1引数の関数の処理を行う
    const now = new Date();
    time -= now - pre;
    if (time < 0) {
      gameEnd();
    }
    pre = now;
    updateTime();
  }, 10)
  //タイピングイベント
  document.addEventListener('keypress', keypressCallback);
  next();
}

function gameEnd() {
  time = 0;
  updateTime();
  clearInterval(intervalId);
  intervalId = null;
  document.removeEventListener('keypress', keypressCallback);
  result.textContent = `ミスタイプ数: ${missTypeCount}, 総タイプ数${missTypeCount + successTypeCount}`
  alert('終了!!!');
}

// タイマーイベント
start.addEventListener('click', function () {
  if (time === 0) { alert('時間を選んでください') }
  if (intervalId !== null) { return; }
  gameStart();
})

reset.addEventListener('click', function () {
  document.removeEventListener('keypress', keypressCallback);
  clearInterval(intervalId);
  intervalId = null;
  time = 0;
  updateTime();
  next();
  missTypeCount = 0;
  successTypeCount = 0;
  result.textContent = '';
})

