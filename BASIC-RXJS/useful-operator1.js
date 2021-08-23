// 1. sequenceEqual Operator
// 타이밍에 관계없이, 두 스트림 발행물들의 순서와 값 동일 여부 반환
const { from, fromEvent, of, interval, range, combineLatest } = rxjs;
const { sequenceEqual, distinctUntilChanged } = rxjs.operators;
const { buffer, bufferCount, bufferTime } = rxjs.operators;
const { mergeMap, map, take, pluck, tap } = rxjs.operators;
const { groupBy, toArray } = rxjs.operators;

const num$ = from([3, 1, 4, 7, 5, 8, 2]);

const key$ = fromEvent(document, "keyup")
  .pipe(
    map((e) => Number(e.code.replace("Digit", ""))),
    take(7),
    sequenceEqual(num$)
  )
  .subscribe(console.log);

// 2. distinctUntilChanged Operator
// 같은 값이 연속되는 것만 제외
of(1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 3, 4, 4, 1)
  .pipe(distinctUntilChanged())
  .subscribe(console.log);

const students = [
  { name: "홍길동", sex: "male" },
  { name: "전우치", sex: "male" },
  { name: "아라치", sex: "female" },
  { name: "성춘향", sex: "female" },
  { name: "임꺽정", sex: "male" },
];
from(students)
  .pipe(distinctUntilChanged((a, b) => a.sex === b.sex))
  .subscribe(console.log);

console.clear();
// 3. combineLatest Operator
// 두 스트림을 각 최신 값들끼리 결합 ( zip과 비교)
subscriber = combineLatest(
  interval(2000),
  fromEvent(document, "click").pipe(pluck("x"))
).subscribe(console.log);
subscriber.unsubscribe();

// 4. buffer Operator
// 첫번째 스트림에서 나왔던 값들을 두번째 스트림에서 값이 발행될 때마다 한꺼번에 출력
subscriber = interval(1000)
  .pipe(buffer(fromEvent(document, "click")))
  .subscribe(console.log);
subscriber.unsubscribe();

// 5. bufferCount Operator
// 10개씩 자르고, 5개씩 shift
range(1, 100).pipe(bufferCount(10, 5)).subscribe(console.log);
// 10개씩 자르고, 1개씩 shift
range(1, 100).pipe(bufferCount(10, 1)).subscribe(console.log);
// 10개씩 자르고, 10개씩 shift
range(1, 100).pipe(bufferCount(10, 10)).subscribe(console.log);
range(1, 100).pipe(bufferCount(10)).subscribe(console.log);

subscriber = fromEvent(document, "click")
  .pipe(pluck("x"), bufferCount(3))
  .subscribe(console.log);
subscriber.unsubscribe();

// 클릭 3번중 한 번만 반응하기
subscriber = fromEvent(document, "click")
  .pipe(bufferCount(3))
  .subscribe((_) => console.log("FIRE"));
subscriber.unsubscribe();

console.clear();
// 6. bufferTime Operator​
// 0.2초에 한 번 씩 interval을 내보내고 2초씩 끊어줌
subscriber = interval(200).pipe(bufferTime(2000)).subscribe(console.log);
subscriber.unsubscribe();

// 7. groupBy Operator
// 3으로 나눈 나머지에 따라 observable을 생성하고, 그것을 다지 mergemap해서 하나로 출력함
range(1, 50)
  .pipe(
    groupBy((x) => x % 3),
    mergeMap((groups$) => groups$.pipe(toArray()))
  )
  .subscribe(console.log);
