https://blackstarzck.github.io/chanki-portfolio

<h1>[1] 이미지에서 물체 감지</h1>

벤치마킹: 오늘의집

<img width="390" src="https://user-images.githubusercontent.com/65368411/177924145-2f0abc74-95ed-46c7-88d5-a8296349245e.png">

위 이미지에 표시된 물체들은 사용자가 직접 물체의 위치를 선택하는 방식이다. 사용자가 일일이 작업해야하는 수고를 덜어 AI학습을 통해 
오늘의집 DB를 조회하여 자동으로 표시해주면 사용자로 하여금 작업시간을 많이 줄어줄 수 있을거라고 생각해 위 프로젝트를 진행하였다.

<h3><strong>1-1. 프로젝트 설명:</strong></h3>

1. 핵심기능: 물체인식 → tensorflow.js(라이브러리)
2. 애니메이션: gsap.js(라이브러리)
3. 카카오톡으로 링크를 공유할 수 있습니다.
4. 반응형 레이아웃입니다.
5. 모바일과 PC에서 감지된 결과를 보여주는 레이아웃이 조금 다릅니다.
6. 바닐라 자바스크립트로 작업하였습니다.
7. 싱글 페이지로 만들었습니다.
8. 부드럽고 자연스로운 사용자 흐름을 위해 작업했습니다.

오늘의집 DB를 가지고 있지 않기 때문에 감지된 물체를 어떻게 표현할지 고민한 결과 사용자에게 시각적인 재미를 제공하기 위해 SVG 애니메이션을 사용해 결과를 표현하였다.
또한 SVG 코드를 복사할 수 있고 다운받을 수도있도록 UI를 구성하였다.

<h3><strong>1-2. 물체감지 실패 후 흐름에 대한 고민</strong></h3>
사용자가 기대했던 결과가 아닐 경우 크게 2가지 상황이 발생할 수 있다.<br>
첫 째, 물체가 감지되어 결과가 출력되었으나 사용자가 기대했던 물체가 아닌 경우 (100% 불일치)<br>
둘 때, 물체가 감지되어 결과가 출력되었으나 사용자가 기대했던 물체와 비슷했을 경우 (50% 일치)

결국 두가지 상황 모두 사용자의 선택이 필요하다.<br>
[step1] 감지된 물체가 정확한지 확인<br>
[step2] 100% 또는 50% 일치할 경우 감지된 물체들 중 사용자가 직접 선택<br>
[step3] 사용자가 만족한 결과 노출 후 작업<br>

<img height="300" src="https://user-images.githubusercontent.com/65368411/177937681-92ef8dc3-a262-4c29-a772-00f686a86acf.png"> <img height="300" src="https://user-images.githubusercontent.com/65368411/177937778-f24a7695-a315-4fe4-9bd5-f5ced07a082f.png"> <img height="300" src="https://user-images.githubusercontent.com/65368411/177937901-bff56643-5394-40ec-aba7-d4c1956f4a50.png">


<h3><strong>1-3. 어려웠던 점:</strong></h3>

1. 시퀀스(흐름)를 계획하는 것이 제일 어려웠습니다.<br>
  물체정보 입력 → 물제감지 시작 → 결과출력의 단순한 흐름이지만 사용자에게 어떻게 쉽고 간단하게 보여줄지 고민한 결과 사용자의 선택을 요구해
진행흐름을 직접 선택하도록 유도하였다. 단계별로 넘어가는 순간순간은 화려하지 않은 fade-in, fade-out 애니메이션으로 사용자와의 인터랙션을 높힐 수 있도록 하였다.

2. 카드 충돌방지<br>
  감지된 여러개의 물체를 단순히 노출만 시킨다면 지루할 것 같아 물체를 카드형식으로 담아 자석효과를 더해 사용자의 지루함을 덜 수 있도록 하였다.
이때 물체들끼리 충돌하지 않고 사용자에게 온전히 보여주기 위해 출동방지 로직을 구현했다. 기능구현은 하였으나 충돌과정을 체크할때 렌더링이 많이 일어날 수 있어
사용자에게 최종 결과를 보여주기까지 시간이 걸릴 수 있다. 속도가 느려 사용자의 이탈을 방지하기 위해 로딩애니메이션을 넣었다.

<img height="200" src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fc68y2z%2FbtrEBsQnjzR%2FYwR0XKM0dRPIEMUPn2ghTk%2Fimg.png">  <img height="200" src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Feshv6K%2FbtrEw612wfQ%2FfaBYlx53RinLLHHD9slBzK%2Fimg.png">


4. 캔버스 애니메이션<br>
  조금 더 시각적인 재미를 주기위해 캔버스 애니메이셔을 구현하였다. 이미지 위에 감지된 물체의 위치를 보여주기 위해 동그라미(점)를 물체 위에 노출시키고 
그 동그라미(점)와 카드를 이어주는 선을 그리는 애니메이션을 만들었습니다.

6. 이벤트 연속발생 방지<br>
  사용자가 이벤트(클릭)를 일으켰을때 대부분 애니메이션이 진행되는데 이때 애니메이션을 끊고 바로 다음 행동에 대한 결과를 노출시킬 것인지 고민이 필요했다.
자연스러움을 위해 진행하고 있는 애니메이션이 있는 경우 다음행동은 막도록 하였습니다.




