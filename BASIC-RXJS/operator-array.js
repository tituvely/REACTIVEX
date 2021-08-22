//산수 관련 Operator
const { of } = rxjs;
const { count, max, min, reduce } = rxjs.operators;

const obs$ = of(4, 2, 6, 10, 8);

obs$.pipe(count()).subscribe((x) => console.log("count: " + x));
obs$.pipe(max()).subscribe((x) => console.log("max: " + x));
obs$.pipe(min()).subscribe((x) => console.log("min: " + x));
obs$
  .pipe(
    reduce((acc, x) => {
      return acc + x;
    }, 0)
  )
  .subscribe((x) => console.log("reduce: " + x));

//선택 관련 Operator
const { from } = rxjs;
const { first, last, elementAt, filter, distinct } = rxjs.operators;

const obs2$ = from([
  9, 3, 10, 5, 1, 10, 9, 9, 1, 4, 1, 8, 6, 2, 7, 2, 5, 5, 10, 2,
]);
obs2$.pipe(first()).subscribe((x) => console.log("first: " + x));
obs2$.pipe(last()).subscribe((x) => console.log("last: " + x));
obs2$.pipe(elementAt(5)).subscribe((x) => console.log("elementAt: " + x));
obs2$.pipe(distinct()).subscribe((x) => console.log("distinct: " + x));
obs2$
  .pipe(filter((x) => x % 2 === 1))
  .subscribe((x) => console.log("filter: " + x));

console.clear();
//짝수들 중에서 가장 큰 수
obs2$
  .pipe(
    filter((x) => x % 2 === 0),
    max()
  )
  .subscribe((x) => console.log(x));

//5보다 큰 3번째 짝수
obs$
  .pipe(
    filter((x) => x > 5),
    filter((x) => x % 2 === 0),
    elementAt(2)
  )
  .subscribe((x) => console.log(x));

//한 번 이상 나온 홀수들의 갯수, 합
obs2$
  .pipe(
    distinct(),
    filter((x) => x % 2 === 1),
    count()
  )
  .subscribe((x) => console.log(x));

console.clear();
//tap Operator
const { tap } = rxjs.operators;

from([9, 3, 10, 5, 1, 10, 9, 9, 1, 4, 1, 8, 6, 2, 7, 2, 5, 5, 10, 2])
  .pipe(
    tap((x) => console.log("-------------- 처음 탭: " + x)),
    filter((x) => x % 2 === 0),
    tap((x) => console.log("--------- 필터 후: " + x)),
    distinct(),
    tap((x) => console.log("중복 제거 후: " + x))
  )
  .subscribe((x) => console.log("발행물: " + x));
