import { strs } from "./strs.js"
// DOM
const timeElement = document.getElementById('time');
const start = document.getElementById('start');
// const stop = document.getElementById('stop');
const reset = document.getElementById('reset');
const result = document.getElementById('result');
const typedField = document.getElementById('typed');
const untypedField = document.getElementById('untyped');

// 経過時間(ミリ秒)
let intervalId = null;
const time = 10000;
let remaining = time;

let typed = '';
let untyped = 'Start';
let missTypeCount = 0;
let successTypeCount = 0;

// 関数
function updateTime() {
  const ms = remaining % 1000;
  const s = Math.floor(remaining / 1000) % 60; //小数切り捨て
  const mi = Math.floor(remaining / (1000 * 60)) % 60;
  const h = Math.floor(remaining / (1000 * 60 * 60)) % 60;

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

function next() { //新たな問題を表示,1から単語をタイピング指せる関数
  typed = '';
  untyped = nextString();
  updateTextField();
}

function keyDownCallback(e) {
  if (e.key !== untyped.substring(0, 1)) { //押したキーが正しくないとき
    missTypeCount += 1;
    return;
  }
  successTypeCount += 1;
  typed += untyped.substring(0, 1); //はじまりから1文字とる
  untyped = untyped.substring(1);//2文字目から末尾まで

  updateTextField();

  if (untyped === '') { //全部打ち終わったら
    next();
  }
}

function gameStart() {
  let pre = new Date();
  intervalId = setInterval(function () { //第2引数の時間ごとに第1引数の関数の処理を行う
    const now = new Date();
    remaining -= now - pre;
    if (remaining < 0) {
      gameEnd();
    }
    pre = now;
    updateTime();
  }, 10)
  //タイピングイベント
  document.addEventListener('keydown', keyDownCallback);
  next();
}

function gameEnd() {
  remaining = 0;
  updateTime();
  clearInterval(intervalId);
  intervalId = null;
  document.removeEventListener('keydown', keyDownCallback);
  result.textContent = `ミスタイプ数: ${missTypeCount}, 総タイプ数${missTypeCount+successTypeCount}`
}

// タイマーイベント
start.addEventListener('click', function () {
  if (intervalId !== null) { return; }
  gameStart();
})

// stop.addEventListener('click', function () {
//   clearInterval(intervalId); //setIntervalを使用した動作のキャンセル
//   intervalId = null; //start連打で何回もタイマーが裏で動作しないように
// })

reset.addEventListener('click', function () {
  document.removeEventListener('keydown', keyDownCallback);
  clearInterval(intervalId);
  intervalId = null;
  remaining = time;
  updateTime();
  next();
  missTypeCount = 0;
  successTypeCount = 0;
  result.textContent = '';
})

