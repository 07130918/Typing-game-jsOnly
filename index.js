import {strs} from "./strs.js"
const timeElement = document.getElementById('time')
const start = document.getElementById('start')
const stop = document.getElementById('stop')
const reset = document.getElementById('reset')

const typedField = document.getElementById('typed');
const untypedField = document.getElementById('untyped');

const time = 10000;


let typed = ''
let untyped = 'Start';

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