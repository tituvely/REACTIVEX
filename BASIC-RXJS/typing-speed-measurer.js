const { Subject, BehaviorSubject, fromEvent, combineLatest, from } = rxjs
const { ajax } = rxjs.ajax
const { tap, switchMap, pluck, startWith, filter, timeInterval, map, scan, reduce, skip } = rxjs.operators

// 서버로부터 임의의 이름 받아오기
const given = document.getElementById('given')
const input = document.getElementById('input')
const start = document.getElementById('start')
const logs = document.getElementById('logs')

fromEvent(start, 'click').subscribe(_ => {
    input.focus()
    ajaxSubject.next()
})

const ajaxSubject = new Subject().pipe(
    tap(_ => given.innerHTML = '<span class="loading">LOADING...<span>'),
    switchMap(_ => ajax('http://localhost:3000/people/name/random').pipe(
        pluck('response', Math.random() > 0.5 ? 'first_name': 'last_name'),
        tap(console.log)
    ))
)

ajaxSubject.subscribe(word => {
    wordSubject.next(null) // 단어가 도착한 순간부터 초를 재기 위함
    wordSubject.next(word)
})

const wordSubject = new Subject().pipe(
    tap(word => given.innerHTML = `<span class="word">${word}</span>`)
)

// 1. 받아온 이름과 타이핑된 글자 combine
// 2. 둘이 같을 때 또는 이름을 갓 받아왔을 때(word === null) 발행
// 3. 받아온 이름대로 타이핑시 입력칸 지우고 새 이름 받아오기
// 4. 이름이 입력될때마다의 시간 간격 얻기
combineLatest(
    wordSubject,
    fromEvent(input, 'keyup').pipe(
        pluck('target', 'value'),
        startWith(null) // 첫 단어 직전의 null과 combine되기 위한 초기값
    )
).pipe(
    filter(([word, typed]) => {
        return [typed, null].includes(word)
    }),
    timeInterval()  // 단어가 갓 주어졌을 때 ~ 입력 성공했을 때
).subscribe(result => {
    console.log(result.value)
    if (result.value[0] !== null) { // 받아온 이름과 타이핑이 일치할 때
        input.value = ''
        ajaxSubject.next()
    }
    printRecords({
        interval: result.interval,
        value: result.value[0]
    })
})

// 입력 완료시마다 내역 쌓고 평균 구하기
// function printRecords (result) {
//     console.log(result)
// }
// 대체
function printRecords (result) {
    recordSubject.next(result)
}

const recordSubject = new BehaviorSubject({
    records: [],
    average: null
}).pipe(
    filter(result => result.value !== null),
    scan((acc, cur) => {
        acc.records.push(cur)
        from(acc.records).pipe(
            reduce((acc2, cur2) => {
                return {
                    lettersTotal: acc2.lettersTotal += cur2.value.length,
                    intervalTotal: acc2.intervalTotal += cur2.interval
                }
            }, {
                lettersTotal: 0,
                intervalTotal: 0
            })
        ).subscribe(result => {
            acc.average = result.intervalTotal / result.lettersTotal
        })
        return acc
    })
)

// 내역과 평균 출력
// recordSubject.subscribe(console.log)
//대체
recordSubject.pipe(
    skip(1)
).subscribe(result => {
    logs.innerHTML = `<div class="average">Average: <span>${result.average}</span></div>`
    + result.records.map(record => {
        return `<div class="score">${record.value}: <span>${record.interval}</span></div>`
    }).join('')
})