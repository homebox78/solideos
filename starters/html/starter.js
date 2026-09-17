/*
 * SOLIDEO Design System — 스타터 킷 동작
 *
 * 프레임워크 없이 표준 DOM API 만 씁니다. jQuery 도 필요 없습니다.
 * 접근성에 관계된 부분(포커스 · aria)이 어디인지 주석으로 표시했습니다.
 */
(function () {
  'use strict';

  /* ---------------------------------------------- KRDS · 글자 크기 설정 */
  var KEY = 'solideo:font-scale';
  var buttons = document.querySelectorAll('[data-scale]');

  function applyScale(scale) {
    document.documentElement.setAttribute('data-font-scale', scale);
    for (var i = 0; i < buttons.length; i++) {
      /* 선택 상태를 aria-pressed 로 알립니다. 색만으로는 전달되지 않습니다. */
      buttons[i].setAttribute('aria-pressed', String(buttons[i].dataset.scale === scale));
    }
    try { localStorage.setItem(KEY, scale); } catch (e) { /* 사생활 보호 모드 */ }
  }

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
      applyScale(this.dataset.scale);
    });
  }
  try {
    var saved = localStorage.getItem(KEY);
    if (saved) applyScale(saved);
  } catch (e) { /* noop */ }

  /* ------------------------------------------------------- 전체 동의 */
  var all = document.getElementById('agree-all');
  var terms = document.querySelectorAll('#agree-1, #agree-2');

  if (all) {
    all.addEventListener('change', function () {
      for (var i = 0; i < terms.length; i++) terms[i].checked = all.checked;
    });
    for (var j = 0; j < terms.length; j++) {
      terms[j].addEventListener('change', function () {
        var every = true;
        for (var k = 0; k < terms.length; k++) if (!terms[k].checked) every = false;
        all.checked = every;
      });
    }
  }

  /* ----------------------------------------------------------- 모달 */
  /*
   * <dialog>.showModal() 이 포커스 트랩 · Esc 닫기 · 배경 비활성화를 처리합니다.
   * 직접 구현하지 마세요. 닫을 때 원래 버튼으로 초점을 되돌리는 것만 챙기면 됩니다.
   */
  var dialog = document.getElementById('confirm-dialog');
  var opener = document.getElementById('submit-btn');

  if (dialog && opener) {
    opener.addEventListener('click', function () {
      dialog.showModal();
    });
    dialog.addEventListener('close', function () {
      opener.focus();
    });
    var closers = dialog.querySelectorAll('[data-close]');
    for (var m = 0; m < closers.length; m++) {
      closers[m].addEventListener('click', function () { dialog.close(); });
    }
  }

  /* ------------------------------------------------- 글자 수 카운터 */
  /*
   * data-counter="대상 textarea id" 를 붙인 요소에 현재 글자 수를 씁니다.
   * 한도는 textarea 의 maxlength 를 읽습니다.
   * 입력할 때마다 낭독하면 시끄러우므로 aria-live 를 쓰지 않고,
   * 한도에 닿았을 때만 role="status" 로 한 번 알립니다.
   */
  var counters = document.querySelectorAll('[data-counter]');
  for (var c = 0; c < counters.length; c++) {
    (function (out) {
      var field = document.getElementById(out.getAttribute('data-counter'));
      if (!field) return;
      var max = parseInt(field.getAttribute('maxlength'), 10) || 0;
      function update() {
        var len = field.value.length;
        out.textContent = max ? len + ' / ' + max + '자' : len + '자';
        if (max && len >= max) out.setAttribute('role', 'status');
        else out.removeAttribute('role');
      }
      field.addEventListener('input', update);
      update();
    })(counters[c]);
  }

  /* ------------------------------------------ 사업자등록번호 서식 */
  /*
   * data-format="bizno" · 숫자만 남기고 000-00-00000 으로 맞춥니다.
   * 화면 표시용 서식입니다. 서버에서는 하이픈을 제거한 뒤 검증하세요.
   * 커서가 끝이 아닐 때(중간 수정)는 서식을 강제하지 않아 입력이 튀지 않습니다.
   */
  function formatBizNo(v) {
    var d = v.replace(/\D/g, '').slice(0, 10);
    if (d.length > 5) return d.slice(0, 3) + '-' + d.slice(3, 5) + '-' + d.slice(5);
    if (d.length > 3) return d.slice(0, 3) + '-' + d.slice(3);
    return d;
  }
  var bizFields = document.querySelectorAll('[data-format="bizno"]');
  for (var b = 0; b < bizFields.length; b++) {
    bizFields[b].addEventListener('input', function () {
      var atEnd = this.selectionStart === this.value.length;
      if (atEnd) this.value = formatBizNo(this.value);
    });
    bizFields[b].addEventListener('blur', function () {
      this.value = formatBizNo(this.value);
    });
  }

  /* --------------------------------------------- 표 가로 스크롤 정리 */
  /*
   * 스크롤이 필요 없는 화면 폭에서는 탭 정지점을 없앱니다.
   * 항상 tabindex=0 이면 키보드 이용자가 불필요하게 한 번 더 멈춥니다.
   */
  function syncScrollRegions() {
    var wraps = document.querySelectorAll('.sds-table-wrap');
    for (var i = 0; i < wraps.length; i++) {
      var overflows = wraps[i].scrollWidth > wraps[i].clientWidth + 1;
      if (overflows) {
        wraps[i].setAttribute('tabindex', '0');
        wraps[i].setAttribute('role', 'region');
      } else {
        wraps[i].removeAttribute('tabindex');
        wraps[i].removeAttribute('role');
      }
    }
  }
  syncScrollRegions();
  window.addEventListener('resize', syncScrollRegions);
})();
