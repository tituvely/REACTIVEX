// Pipable operators:
// Observable의 데이터를 pure function으로 가공
// (현존하는 데이터를 수정하지 않음)
// rxjs.operators에서 로드
// pipe 함수에 하나 이상 넣어 연결
const { range } = rxjs;

const { filter, map, tap } = rxjs.operators;
const observable$ = range(1, 10);

const observer = {
  next: (x) => console.log(x + " 발행"),
  error: (err) => console.error("발행중 오류", err),
  complete: () => console.log("발행물 완결"),
};

observable$.pipe(filter((x) => x % 2 === 0)).subscribe(observer);

// 파이프에는 하나 이상의 operator들이 쉽표로 구분되어 들어갈 수 있습니다.
observable$
  .pipe(
    filter((x) => x % 2 === 0),
    map((x) => x * x)
  )
  .subscribe(observer);

console.clear();
// 시간, 이벤트에 의한 발행물에 적용해보기
const { interval } = rxjs;
const observable2$ = interval(1000);
// ... observer 정의
const timeSubscription = observable2$
  .pipe(
    tap(console.log),
    filter((x) => x % 2 === 0),
    map((x) => x * x)
  )
  .subscribe(observer);
setTimeout((_) => timeSubscription.unsubscribe(), 10000);

const { fromEvent } = rxjs;
const observable3$ = fromEvent(document, "click");
// ... observer 정의
const eventSubscription = observable3$
  .pipe(map((e) => e.x + " " + e.y))
  .subscribe(observer);
