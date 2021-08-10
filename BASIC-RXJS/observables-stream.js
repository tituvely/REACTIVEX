// Observables - 스트림 생성기 만들기
// 1. 배열된 스트림
const { of, from, range, generate } = rxjs;

const obs1$ = of(1, 2, 3, 4, 5);
const obs2$ = from([6, 7, 8, 9, 10]);
const obs3$ = range(11, 5);
const obs4$ = generate(
  15,
  (x) => x < 30,
  (x) => x + 2
);

// obs1$.subscribe((item) => console.log(`of: ${item}`));
// obs2$.subscribe((item) => console.log(`from: ${item}`));
// obs3$.subscribe((item) => console.log(`range: ${item}`));
// obs4$.subscribe((item) => console.log(`generate: ${item}`));

// 2. 시간에 의한 스트림
const { interval, timer } = rxjs;

const obs5$ = interval(1000);
const obs6$ = timer(3000);

// obs5$.subscribe((item) => console.log(`interval: ${item}`));
// obs6$.subscribe((item) => console.log(`timer: ${item}`));

// 3. 이벤트에 의한 스트림
const { fromEvent } = rxjs;

const obs7$ = fromEvent(document, "click");
const obs8$ = fromEvent(document.getElementById("myInput"), "keypress");

// obs7$.subscribe((item) => console.log(item));
// obs8$.subscribe((item) => console.log(item));

// 4. Ajax를 통한 스트림
const { ajax } = rxjs.ajax;

const obs9$ = ajax(`http://localhost:3000/people/1`);
// obs9$.subscribe((result) => console.log(result.response));

// 5. 직접 만드는 스트림
const { Observable } = rxjs;

const obs10$ = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);

  // 값을 다 발행한 뒤에는 complete를 실행하여 메모리 해제
  subscriber.complete();
});

// obs10$.subscribe((item) => console.log(item));

//⭐ Observable은 lazy(게으르다)
// 누군가 구독을 해야 발행을 시작
// 각 구독자에게 따로 발행

const obs11$ = of("a", "b", "c");
const obs12$ = interval(1000);
const obs13$ = fromEvent(document, "click");

setTimeout((_) => {
  console.log("of 구독 시작");
  obs11$.subscribe((item) => console.log(item));
}, 5000);
setTimeout((_) => {
  console.log("interval 구독 시작");
  obs12$.subscribe((item) => console.log(item));
}, 10000);
setTimeout((_) => {
  console.log("fromEvent 구독 시작");
  obs13$.subscribe((_) => console.log("click!"));
}, 15000);
setTimeout((_) => {
  console.log("interval 구독 시작 2");
  obs12$.subscribe((item) => console.log(item));
}, 20000);
