// Observable과의 차이
// - Observable
//     누군가 구독을 해야 발행을 시작
//     각 구독자에게 따로 발행
//     unicast
//     🧊 cold 발행
//     Netflix
// - Subject
//     개발자가 원하는 때에 발행
//     모든 구독자에게 똑같이 발행
//     multicast
//     🔥 hot 발행
//     TV채널
const { Subject } = rxjs;
const subject = new Subject();

subject.subscribe(console.log);

subject.next(1);
subject.next(3);
subject.next(5);

// Observable
const { interval } = rxjs;

const obs$ = interval(1000);

obs$.subscribe((x) => console.log("바로구독: " + x));
setTimeout((_) => {
  obs$.subscribe((x) => console.log("3초 후 구독: " + x));
}, 3000);
setTimeout((_) => {
  obs$.subscribe((x) => console.log("5초 후 구독: " + x));
}, 5000);
setTimeout((_) => {
  obs$.subscribe((x) => console.log("10초 후 구독: " + x));
}, 10000);

// ⭐ 다른 시기에 구독을 시작한 observer들이 같은 값을 발행받도록 할 때 Subject를 사용할 수 있습니다.
const subject2 = new Subject();

setTimeout((_) => {
  let x = 0;
  setInterval((_) => {
    subject2.next(x++);
  }, 2000);
}, 5000);

subject2.subscribe((x) => console.log("바로구독: " + x));
setTimeout((_) => {
  subject2.subscribe((x) => console.log("3초 후 구독: " + x));
}, 3000);
setTimeout((_) => {
  subject2.subscribe((x) => console.log("10초 후 구독: " + x));
}, 10000);
setTimeout((_) => {
  subject2.subscribe((x) => console.log("14초 후 구독: " + x));
}, 14000);

// 일반 Observable에 결합하기
const subject3 = new Subject();
const obs2$ = interval(1000);

obs2$.subscribe(subject3);

subject3.subscribe((x) => console.log("바로구독: " + x));
setTimeout((_) => {
  subject3.subscribe((x) => console.log("3초 후 구독: " + x));
}, 3000);
setTimeout((_) => {
  subject3.subscribe((x) => console.log("5초 후 구독: " + x));
}, 5000);
setTimeout((_) => {
  subject3.subscribe((x) => console.log("10초 후 구독: " + x));
}, 10000);

// EXTRA
// 추가 기능이 있는 Subject
// 1. BehaviorSubject
// 마지막 값을 저장 후 추가 구독자에게 발행
const { BehaviorSubject } = rxjs;
const subject4 = new BehaviorSubject(0); // 초기값이 있음

subject4.subscribe((x) => console.log("A: " + x));

subject4.next(1);
subject4.next(2);
subject4.next(3);

subject4.subscribe((x) => console.log("B: " + x));

subject4.next(4);
subject4.next(5);

// 아래와 같이 서브젝트가 마지막으로 발행한 값을 얻을 수 있습니다.
const lastValue = subject4.getValue();
console.log(lastValue);

console.clear();
// 2. ReplaySubject
// 마지막 N개 값을 저장 후 추가 구독자에게 발행
const { ReplaySubject } = rxjs;
const subject5 = new ReplaySubject(3); // 마지막 3개 값 저장

subject5.subscribe((x) => console.log("A: " + x));

subject5.next(1);
subject5.next(2);
subject5.next(3);
subject5.next(4);
subject5.next(5);

subject5.subscribe((x) => console.log("B: " + x));

subject5.next(6);
subject5.next(7);

console.clear();
// 3. AsyncSubject
// Complete 후의 마지막 값만 발행
const { AsyncSubject } = rxjs;
const subject6 = new AsyncSubject();

subject6.subscribe((x) => console.log("A: " + x));

subject6.next(1);
subject6.next(2);
subject6.next(3);

subject6.subscribe((x) => console.log("B: " + x));

subject6.next(4);
subject6.next(5);

subject6.subscribe((x) => console.log("C: " + x));

subject6.next(6);
subject6.next(7);
subject6.complete();
