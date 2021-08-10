// Observer - 구독자 만들기
const { from } = rxjs;
const observable$ = from([1, 2, 3, 4, 5]);

// 구독자 생성 코드
const observer = {
  next: console.log,
  error: (err) => console.error("발행중 오류", err),
  complete: () => console.log("발행물 완결"),
};

observable$.subscribe(observer);

// 💡 부분적으로만 지정 가능
const observer_1 = {
  next: console.log,
  error: (err) => console.error("발행중 오류", err),
};

const observer_2 = {
  next: console.log,
};

observable$.subscribe(observer_1);
observable$.subscribe(observer_2);

// 💡 다음과 같이 적용 가능
observable$.subscribe(
  console.log,
  (err) => console.error("발행중 오류", err),
  (_) => console.log("발행물 완결")
);

console.clear();
// Error와 Complete 살펴보기
// 💡 Error
const { Observable } = rxjs;

const obs$ = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  null[0];
  subscriber.next(4);
});

obs$.subscribe(
  console.log,
  (err) => console.error("발행중 오류", err),
  (_) => console.log("발행물 완결")
);

// 💡 Complete
const obs2$ = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
  subscriber.next(4);
});

obs2$.subscribe(
  console.log,
  (err) => console.error("발행중 오류", err),
  (_) => console.log("발행물 완결")
);

console.clear();
// 구독 해제하기
// 구독을 변수/상수로 지정한 뒤 unsubscribe() 사용
const { interval } = rxjs;

const obs3$ = interval(1000);
const subscription = obs3$.subscribe(console.log);

setTimeout((_) => subscription.unsubscribe(), 5500);

setTimeout((_) => obs3$.subscribe(console.log), 7500);
