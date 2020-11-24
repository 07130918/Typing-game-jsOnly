import { strs } from "./strs.js"
// DOM
const timeElement = document.getElementById('time')
const start = document.getElementById('start')
const stop = document.getElementById('stop')
const reset = document.getElementById('reset')
const typedField = document.getElementById('typed');
const untypedField = document.getElementById('untyped');

// const time = 10000;
// 経過時間(ミリ秒)
let elapsed = 0;
let intervalId = null;

let typed = '';
let untyped = 'Start';

// 関数
function updateTime () {
  const ms = elapsed % 1000;
  const s = Math.floor(elapsed / 1000) % 60; //小数切り捨て
  const mi = Math.floor(elapsed / (1000 * 60)) % 60;
  const h = Math.floor(elapsed / (1000 * 60 * 60)) % 60; 

  const msStr = ms.toString().padStart(3, '0') //数値を文字列に変換
  const sStr = s.toString().padStart(2, '0')
  const miStr = mi.toString().padStart(2, '0')
  const hStr = h.toString().padStart(2, '0')

  timeElement.innerHTML = `${hStr}:${miStr}:${sStr}.${msStr}`;
}

function getRandomInt(max) { //単語ランダム抽出
  return Math.floor(Math.random() * Math.floor(max));
}

function nextString() {//ランダムに抽出された単語を返す
  const i = getRandomInt(strs.length);
  return strs[i];
}

function updateTextField() {
  typedField.textContent = typed;
  untypedField.textContent = untyped;
}

function next() {
  typed = '';
  untyped = nextString();
  updateTextField();
}

// タイマーイベント
start.addEventListener('click', function (e) {
  if (intervalId !== null) { return; }
  let pre = new Date();
  intervalId = setInterval(function () { //第2引数の時間ごとに第1引数の関数の処理を行う
    const now = new Date();
    elapsed += now - pre;
    pre = now;
    updateTime();
    console.log(elapsed);
  }, 10)
})

stop.addEventListener('click', function () {
  clearInterval(intervalId); //setIntervalを使用した動作のキャンセル
  intervalId = null; //start連打で何回もタイマーが裏で動作しないように
})

reset.addEventListener('click', function () {
  elapsed = 0;
  updateTime();
})

//タイピングイベント
document.addEventListener('keydown', function (e) {
  if (e.key !== untyped.substring(0, 1)) { return; } //押したキーが正しくないとき何もせず返す
  typed += untyped.substring(0, 1); //はじまりから1文字とる
  untyped = untyped.substring(1);//2文字目から末尾まで

  updateTextField();

  if (untyped === '') { //全部打ち終わったら
    next();
  }
});

next();