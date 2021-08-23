// 스트림 결합 연산자
// 1. merge : 두 스트림을 순서관계없이 병합
const { merge, interval, fromEvent } = rxjs;
const { map, take, pluck } = rxjs.operators;

let interval$ = interval(1000).pipe(map((_) => "interval"));
let click$ = fromEvent(document, "click").pipe(map((_) => "click"));

let subscriber = merge(interval$, click$).subscribe(console.log);

subscriber.unsubscribe();
const intv1$ = interval(1000).pipe(
  map((_) => "INTERVAL 1"),
  take(3)
);
const intv2$ = interval(1000).pipe(
  map((_) => "INTERVAL 2"),
  take(6)
);
const intv3$ = interval(1000).pipe(
  map((_) => "INTERVAL 3"),
  take(9)
);
const intv4$ = interval(1000).pipe(
  map((_) => "INTERVAL 4"),
  take(9)
);
const intv5$ = interval(1000).pipe(
  map((_) => "INTERVAL 5"),
  take(9)
);

subscriber = merge(intv1$, intv2$, intv3$, intv4$, intv5$, 3).subscribe(
  console.log
);

subscriber.unsubscribe();
// 2. concat : 스트림을 순서대로 이어붙임
const { concat } = rxjs;

subscriber = concat(intv1$, intv2$, intv3$).subscribe(console.log);
subscriber.unsubscribe();

interval$ = interval(1000).pipe(
  map((_) => "interval"),
  take(5)
);
click$ = fromEvent(document, "click").pipe(map((_) => "click"));

// 첫번째 Observable 구독이 끝난 시점부터 두번째 Observable 구독이 시작되기 때문에 interval이 나오는 동안은 click이 작동되지 않는다.
subscriber = concat(interval$, click$).subscribe(console.log);
subscriber.unsubscribe();

// 3. mergeMap : (mergeAll 참조)
const { mergeMap } = rxjs.operators;

subscriber = fromEvent(document, "click")
  .pipe(
    mergeMap((e) =>
      interval(1000).pipe(
        map((i) => e.x + " : " + i),
        take(5)
      )
    )
  )
  .subscribe(console.log);
subscriber.unsubscribe();

// 4. mergeMap : (mergeAll 참조)
const { of } = rxjs;
const { ajax } = rxjs.ajax;

subscriber = of(3, 15, 4, 9, 1, 7)
  .pipe(
    mergeMap((keyword) =>
      ajax(`http:/localhost:3000/people/${keyword}`).pipe(
        pluck("response", "first_name")
      )
    )
  )
  .subscribe(console.log);
subscriber.unsubscribe();

// 🚨 mergeMap 역시 두 번째 인자로 몇 개의 스트림을 동시 진행할 것인지 설정할 수 있습니다.
subscriber = of(3, 15, 4, 9, 1, 7)
  .pipe(
    mergeMap(
      (keyword) =>
        ajax(`http://localhost:3000/people/${keyword}`).pipe(
          pluck("response", "first_name")
        ),
      3
    ) // 한 번에 3개 스트림만
  )
  .subscribe(console.log);
subscriber.unsubscribe();

// 5. concatMap : (concatAll 참조)
const { concatMap } = rxjs.operators;

subscriber = fromEvent(document, "click")
  .pipe(
    concatMap((e) =>
      interval(1000).pipe(
        map((i) => e.x + " : " + i),
        take(5)
      )
    )
  )
  .subscribe(console.log);
subscriber.unsubscribe();

// 🚨 mergeMap 예제와 달리 concatMap으로 ajax 요청들을 보내면 늘 동일한 순서로 이름들이 반환됩니다.
subscriber = of(3, 15, 4, 9, 1, 7)
  .pipe(
    concatMap((keyword) =>
      ajax(`http://localhost:3000/people/${keyword}`).pipe(
        pluck("response", "first_name")
      )
    )
  )
  .subscribe(console.log);
subscriber.unsubscribe();

// 6. switchMap : 기준 스트림이 새 값을 발행하면 진행중이던 스트림을 멈춤
const { switchMap } = rxjs.operators;

subscriber = fromEvent(document, "click")
  .pipe(
    switchMap((e) =>
      interval(1000).pipe(
        map((i) => e.x + " : " + i),
        take(5)
      )
    )
  )
  .subscribe(console.log);
subscriber.unsubscribe();

// ~MapTo 연산자들 : 값은 두번째 스트림에서만 발행 (첫번째 스트림의 값을 쓰지 않을 때)
// mergeMapTo, concatMapTo, switchMapTo
const { mergeMapTo, concatMapTo, switchMapTo } = rxjs.operators;

subscriber = fromEvent(document, "click")
  .pipe(mergeMapTo(interval(1000).pipe(take(5))))
  .subscribe(console.log);
subscriber.unsubscribe();

subscriber = fromEvent(document, "click")
  .pipe(concatMapTo(interval(1000).pipe(take(5))))
  .subscribe(console.log);
subscriber.unsubscribe();

subscriber = fromEvent(document, "click")
  .pipe(switchMapTo(interval(1000).pipe(take(5))))
  .subscribe(console.log);
