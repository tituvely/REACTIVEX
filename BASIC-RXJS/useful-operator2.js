// 1. startWith/endWith : 맨 앞/뒤에 1~N개 요소 추가
const { of } = rxjs;
const { startWith, endWith } = rxjs.operators;

const obs$ = of(1, 2, 3);

obs$.pipe(startWith(0)).subscribe(console.log);
obs$.pipe(startWith(-2, -1, 0)).subscribe(console.log);

obs$.pipe(endWith(0)).subscribe(console.log);

console.clear();
// 2. every : 모든 발행물들이 주어진 조건에 부합하는가 여부
const { every } = rxjs.operators;

of(1, 3, 5, 7, 9, 11, 13, 15)
  .pipe(every((x) => x % 2 !== 0))
  .subscribe(console.log);

console.clear();
// 3. defaultIfEmpty : 발행물이 없을 시 기본값 발행
const { fromEvent, timer } = rxjs;
const { defaultIfEmpty, pluck, takeUntil } = rxjs.operators;

subscriber = fromEvent(document, "click")
  .pipe(takeUntil(timer(5000)), pluck("x"), defaultIfEmpty("NO CLICK"))
  .subscribe(console.log);
subscriber.unsubscribe();

// 4. retry : 발행 실패시 N회 재시도
const { range } = rxjs;
const { ajax } = rxjs.ajax;
const { mergeMap, retry } = rxjs.operators;

subscriber = range(1, 20)
  .pipe(
    mergeMap((keyword) =>
      ajax(`http://localhost:3000/people/quarter-error/${keyword}`).pipe(
        pluck("response", "first_name"),
        retry(3)
      )
    )
  )
  .subscribe(console.log);
subscriber.unsubscribe();

// 5. defer : 조건에 따라 스트림 발행
// 구독하는 순간에 조건에 따른 스트림을 생성 💡 옵저버블이 해당 코드가 실행되는 부분시점에서 생성되기 때문에 당시의 상태에 따라 만들어질 옵저버블이 결정되도록 할 수 있습니다.
const { defer } = rxjs;

subscriber = fromEvent(document.querySelector("#check"), "change")
  .pipe(pluck("target", "checked"))
  .subscribe((checked) => {
    defer((_) => (checked ? of("CHECKED") : of("UNCHECKED"))).subscribe(
      console.log
    );
  });
subscriber.unsubscribe();

// 6. iif : 단순화된 defer: 조건에 따라 두 스트림 중 하나 발행
const { iif } = rxjs;

subscriber = fromEvent(document.querySelector("#check"), "change")
  .pipe(pluck("target", "checked"))
  .subscribe((checked) => {
    iif((_) => checked, of("CHECKED"), of("UNCHECKED")).subscribe(
      console.log,
      (err) => console.log(err),
      (_) => console.log("COMPLETE")
    );
  });
subscriber.unsubscribe();

subscriber = fromEvent(document.querySelector("#check"), "change")
  .pipe(pluck("target", "checked"))
  .subscribe((checked) => {
    iif((_) => checked, of("CHECKED")).subscribe(
      console.log,
      (err) => console.log(err),
      (_) => console.log("COMPLETE")
    );
  });
subscriber.unsubscribe();

// 7. empty: 빈 값 발행
const { empty } = rxjs;

empty().subscribe(console.log, console.error, (_) => console.log("COMPLETE"));

// 8. throwError
const { throwError } = rxjs;

throwError("ERROR").subscribe(console.log, console.error, (_) =>
  console.log("COMPLETE")
);

// 9. share : 스트림을 여러 구독자들간 공유
// 스트림의 부작용(tap 등)이 한 번만 발생
// observable을 subject처럼 multicast로 만듦
const { interval } = rxjs;
const { take, tap, takeLast, share } = rxjs.operators;

const obs2$ = interval(1000).pipe(
  take(20),
  tap((x) => console.log(`side effect: ${x}`))
  //   share()
);

obs2$.subscribe((x) => console.log(`subscriber 1: ${x}`));

setTimeout((_) => {
  obs2$.subscribe((x) => console.log(`subscriber 2: ${x}`));
}, 5000);
setTimeout((_) => {
  obs2$.subscribe((x) => console.log(`subscriber 3: ${x}`));
}, 10000);

// 10. shareReplay : share 된 스트림의 마지막 N개 발행물을 새 구독자에게 발행
const { shareReplay } = rxjs.operators

const obs3$ = interval(1000).pipe(
  take(20),
  tap(x => console.log(`side effect: ${x}`)),
  shareReplay(3)
)

obs3$.subscribe(x => console.log(`subscriber 1: ${x}`))

setTimeout(_ => {
  obs3$.subscribe(x => console.log(`subscriber 2: ${x}`))
}, 5000)
setTimeout(_ => {
  obs3$.subscribe(x => console.log(`subscriber 3: ${x}`))
}, 10000)