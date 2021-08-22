// Take 관련 Operator
// 1. take : 앞에서부터 N개 선택
const { range, interval, timer, fromEvent } = rxjs
const { take, filter, pluck, tap } = rxjs.operators
const { ajax } = rxjs.ajax

range(1, 20).pipe(
    take(5)
).subscribe(console.log)

range(1, 20).pipe(
    filter(x => x % 2 === 0),
    take(5)
).subscribe(console.log)

range(1, 20).pipe(
    take(5),
    filter(x => x % 2 === 0)
).subscribe(console.log)

// interval(1000).pipe(
//     take(5)
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

// fromEvent(document, 'click').pipe(
//     take(5),
//     pluck('x')
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

// fromEvent(document, 'click').pipe(
//     pluck('x'),
//     filter(x => x < 200),
//     take(5),
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

console.clear();
// 2. takeLast : 뒤에서부터 N개 선택
const { takeLast } = rxjs.operators
range(1, 20).pipe(
    takeLast(5)
).subscribe(console.log)

// // 아무것도 출력되지 않음
// interval(1000).pipe(
//     takeLast(5)
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

// interval(1000).pipe(
//     take(10),
//     takeLast(5)
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

// // 아무것도 출력되지 않음
// fromEvent(document, 'click').pipe(
//     takeLast(5),
//     pluck('x')
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

// fromEvent(document, 'click').pipe(
//     take(10),
//     takeLast(5),
//     pluck('x')
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

console.clear();
// 3. takeWhile : ~하는동안 선택
const { takeWhile } = rxjs.operators
range(1, 20).pipe(
    takeWhile(x => x <= 10)
).subscribe(console.log)

// interval(1000).pipe(
//     takeWhile(x => x < 5)
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )
// fromEvent(document, 'click').pipe(
//     pluck('x'),
//     takeWhile(x => x < 200),
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

console.clear();
// 4. takeUntil : 기준이 되는 스트림이 발행하기까지
const { takeUntil } = rxjs.operators
// obs1$ = interval(1000)
// obs2$ = fromEvent(document, 'click')

// obs1$.pipe(
//     takeUntil(obs2$)
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

// obs3$ = timer(5000)

// obs2$.pipe(
//     pluck('x'),
//     takeUntil(obs3$)
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

// interval(50).pipe(
//     takeUntil(
//         ajax('http://127.0.0.1:3000/people/name/random').pipe(
//             pluck('response'),
//             tap(console.log)
//         )
//     )
// ).subscribe(console.log)

console.clear();
// skip 관련 Operator
// 1. skip : 앞에서부터 N개 건너뛰기
const { skip } = rxjs.operators

range(1, 20).pipe(
    skip(5)
).subscribe(console.log)

// interval(1000).pipe(
//     skip(5)
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

// fromEvent(document, 'click').pipe(
//     skip(5),
//     pluck('x')
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

console.clear();
// 2. skipLast : 뒤에서부터 N개 건너뛰기
const { skipLast } = rxjs.operators

range(1, 20).pipe(
    skipLast(5)
).subscribe(console.log)

// // 5초후부터 첫번째 아이템부터 발행되기 시작 (5초후에 -5번째 아이템을 발행하는 것이라 생각하면 됨)
// interval(1000).pipe(
//     skipLast(5)
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

// // 6번째 클릭부터 첫번재 클릭을 발행
// fromEvent(document, 'click').pipe(
//     skipLast(5),
//     pluck('x')
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

console.clear();
// 3. skipWhile : ~하는동안 건너뛰기
const { skipWhile } = rxjs.operators

range(1, 20).pipe(
    skipWhile(x => x <= 10)
).subscribe(console.log)

// interval(1000).pipe(
//     skipWhile(x => x < 5)
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

// fromEvent(document, 'click').pipe(
//     pluck('x'),
//     skipWhile(x => x < 200),
// ).subscribe(
//     console.log,
//     err => console.error(err),
//     _ => console.log('COMPLETE')
// )

console.clear();
// 3. skipUntil : 기준이 되는 스트림이 발행하고부터
const { skipUntil } = rxjs.operators
const obs4$ = interval(1000)
const obs5$ = fromEvent(document, 'click')

obs4$.pipe(
    skipUntil(obs5$)
).subscribe(
    console.log,
    err => console.error(err),
    _ => console.log('COMPLETE')
)

const obs6$ = timer(5000)

obs5$.pipe(
    pluck('x'),
    skipUntil(obs6$)
).subscribe(
    console.log,
    err => console.error(err),
    _ => console.log('COMPLETE')
)
