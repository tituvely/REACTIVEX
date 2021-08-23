// 시간을 다루는 Operator 2
// debounceTime, auditTime, sampleTime, throttleTime
const { fromEvent, interval } = rxjs;
const { timeInterval, pluck, scan, tap } = rxjs.operators;

const clicks$ = fromEvent(document, "click").pipe(
  timeInterval(),
  pluck("interval"),
  scan((acc, i) => acc + i, 0),
  tap((x) => console.log("CLICKED: " + x))
);

let subscriber = clicks$.subscribe();

subscriber.unsubscribe();
// 1. debounceTime : 정해진 시간안에 다른 이벤트가 발생하지 않을 때 출력
// (타이핑 할 때 주로 사용)
const { debounceTime } = rxjs.operators;

subscriber = clicks$
  .pipe(debounceTime(1000))
  .subscribe((x) => console.log("OUTPUT: -------- " + x));

subscriber.unsubscribe();
// 2. auditTime : 특정 값이 입력이 되면 정해진 시간 안에서 마지막으로 입력된 값이 출력이 됨
const { auditTime } = rxjs.operators;

subscriber = clicks$
  .pipe(auditTime(1000))
  .subscribe((x) => console.log("OUTPUT: -------- " + x));

subscriber.unsubscribe();
// 3. sampleTime : 값을 입력하면 그 다음에 interval에 마지막 값이 출력.
// 언제 값을 입력하든 특정 시간 간격으로 값을 출력하고 싶을 때 사용
const { sampleTime } = rxjs.operators;

subscriber = clicks$
  .pipe(sampleTime(1000), timeInterval())
  .subscribe((x) =>
    console.log("OUTPUT: -------- " + x.value + " :" + x.interval)
  );

subscriber.unsubscribe();
// 4. throttleTime: 값 입력 후 정해진 시간 안에서 첫번째 값, 또는 마지막 값 출력
const { throttleTime } = rxjs.operators;

subscriber = clicks$
  .pipe(
    throttleTime(1000, undefined, {
      leading: true,
      trailing: false,
    })
  )
  .subscribe((x) => console.log("OUTPUT: -------- " + x));

subscriber.unsubscribe();
// auditTime 과의 차이: 스트림이 끝나는 시점에 마지막값을 출력하느냐 아니냐의 차이
subscriber = clicks$
  .pipe(
    throttleTime(1000, undefined, {
      leading: false,
      trailing: true,
    })
  )
  .subscribe((x) => console.log("OUTPUT: -------- " + x));

subscriber.unsubscribe();
subscriber = clicks$
  .pipe(
    throttleTime(1000, undefined, {
      leading: true,
      trailing: true,
    })
  )
  .subscribe((x) => console.log("OUTPUT: -------- " + x));
subscriber.unsubscribe();

// ~Time이 붙지 않은 연산자들
// debounce, audit, sample, throttle
const { debounce, audit, sample, throttle } = rxjs.operators;

subscriber = fromEvent(document, "click")
  .pipe(
    pluck("y"),
    debounce((y) => interval(y * 10))
  )
  .subscribe(console.log);
subscriber.unsubscribe();

subscriber = fromEvent(document, "click")
  .pipe(
    pluck("y"),
    audit((y) => interval(y * 10))
  )
  .subscribe(console.log);
subscriber.unsubscribe();

const { BehaviorSubject } = rxjs;

const bs = new BehaviorSubject(1000);

// bs의 마지막값 시간만큼 동안 새로운 입력이 없으면 bs.next()수행
subscriber = fromEvent(document, "click")
  .pipe(
    tap((_) => console.log(bs.getValue())),
    debounce((e) => interval(bs.getValue())),
    tap((_) => bs.next(bs.getValue() + 500))
  )
  .subscribe((_) => console.log("CLICK"));
subscriber.unsubscribe();

// 클릭시마다 마지막 값이 출력
subscriber = interval(1000)
  .pipe(sample(fromEvent(document, "click")))
  .subscribe(console.log);
subscriber.unsubscribe();

// 첫번째 클릭이 발생하면 1초 동안 다른 클릭은 받지 않음
subscriber = fromEvent(document, "click")
  .pipe(
    throttle((e) => interval(1000)),
    timeInterval(),
    pluck("interval")
  )
  .subscribe(console.log);
