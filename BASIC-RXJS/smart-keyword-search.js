// Step 1. 검색된 결과값들 보여주기
// 타이핑된 키워드 검색
const { fromEvent, from, merge } = rxjs;
const { ajax } = rxjs.ajax;
const {
  mergeMap,
  switchMap,
  pluck,
  retry,
  map,
  mapTo,
  scan,
  filter,
  debounceTime,
  distinctUntilChanged,
} = rxjs.operators;

const url = "http://localhost:3000/people/quarter-error";
const keyword = document.querySelector("#keyword");
const result = document.querySelector("#result");

// Step 1. 검색된 결과값들 보여주기
// // 타이핑된 키워드 검색
// fromEvent(keyword, "keyup")
//   .pipe(
//     pluck("target", "value"),
//     // 다음 ajax가 호출되면 이전 과정을 멈추도록 mergeMap 대신 switchMap 사용
//     switchMap((keyword) => ajax(`${url}?name=${keyword}`).pipe(retry(3))),
//     // mergeMap((keyword) => ajax(`${url}?name=${keyword}`).pipe(retry(3))),
//     pluck("response")
//   )
//   .subscribe(showResults);

// // 결과 하단에 출력
// function showResults(results) {
//   from(results)
//     .pipe(
//       map((person) => `${person.first_name} ${person.last_name}`),
//       map((name) => `<article>${name}</article>`),
//       scan((acc, article) => (acc += article), "")
//     )
//     .subscribe((people) => (result.innerHTML = people));
// }

// // 불필요한 Ajax 요청 생략
// fromEvent(keyword, 'keyup').pipe(
//     pluck('target', 'value'),
//     filter(typed => typed.length > 1), // 1글자 이상일 때만
//     debounceTime(500), // 0.5초 공백 후 발행
//     distinctUntilChanged(), // 연속된 같은 문자열 생략
//     switchMap(keyword =>
//       ajax(`${url}?name=${keyword}`).pipe(retry(3))
//     ),
//     pluck('response')
//   ).subscribe(showResults)

// // 백스페이스를 누를 때 변화한 값으로 검색되지 않도록
// fromEvent(keyword, "keyup")
//   .pipe(
//     filter((event) => event.code != "Backspace"), // 백스페이스 생략
//     pluck("target", "value"),
//     filter((typed) => typed.length > 1),
//     debounceTime(500),
//     distinctUntilChanged(),
//     switchMap((typed) => ajax(`${url}?name=${typed}`).pipe(retry(3))),
//     pluck("response")
//   )
//   .subscribe(showResults);

// Step2. 상태표시 추가
// 스트림을 입력받는 부분과 그 이후의 Ajax 결과로 분리
// 두 스트림의 결과를 merge하여 한 subscriber에 적용
const searchInit$ = fromEvent(keyword, "keyup").pipe(
  filter((event) => event.code != "Backspace"), // 백스페이스 생략
  pluck("target", "value"),
  filter((typed) => typed.length > 1),
  debounceTime(500),
  distinctUntilChanged()
);

const searching$ = searchInit$.pipe(
  mapTo('<div class="searching">Searching...</div>')
);

const searchResult$ = searchInit$.pipe(
  switchMap((keyword) => ajax(`${url}?name=${keyword}`).pipe(retry(3))),
  pluck("response"),
  mergeMap((results) =>
    from(results).pipe(
      map((person) => `${person.first_name} ${person.last_name}`),
      map((name) => `<article>${name}</article>`),
      scan((acc, article) => (acc += article), "")
    )
  )
);

merge(searching$, searchResult$).subscribe((text) => (result.innerHTML = text));
