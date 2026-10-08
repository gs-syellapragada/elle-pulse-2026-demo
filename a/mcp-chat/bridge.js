// Runs inside every embedded demo. Enter and Right arrow both mean "next action":
// the demo performs its next step if it has one, and once the demo is finished they move to the next slide.
// Each demo reports where it is through window.__elleState() ('ready' | 'busy' | 'done'). Demos without steps count as done.
(function () {
  if (window.parent === window) return;

  function state() {
    try { return typeof window.__elleState === 'function' ? window.__elleState() : 'done'; } catch (e) { return 'done'; }
  }
  function nextSlide() { parent.postMessage({ type: 'elle-nav', key: 'PageDown' }, '*'); }
  function pressEnter() {
    var ev = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true });
    ev.__elle = true;
    var el = document.activeElement && document.activeElement !== document.documentElement ? document.activeElement : document.body;
    el.dispatchEvent(ev);
  }
  // Returns true when the key was consumed here.
  function nextAction(key) {
    var s = state();
    if (s === 'done') { nextSlide(); return true; }
    if (key === 'ArrowRight') { if (s === 'ready') pressEnter(); return true; } // busy: ignore, never skip a running step
    return false; // Enter while a step is available or running: the demo handles it itself
  }

  addEventListener('keydown', function (e) {
    if (e.__elle) return;
    var t = e.target && e.target.tagName, field = t === 'INPUT' || t === 'TEXTAREA';
    var hasText = field && !!e.target.value;
    var plain = !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey;

    // Scripted text sits in the box, so Right arrow still counts as "next" while a step is ready (it sends the text).
    if (plain && (e.key === 'Enter' || e.key === 'ArrowRight') && (!hasText || (e.key === 'ArrowRight' && state() === 'ready'))) {
      if (nextAction(e.key)) { e.preventDefault(); e.stopImmediatePropagation(); }
      return;
    }
    var back = plain && e.key === 'ArrowLeft' && !hasText;
    var nav = back || e.key === 'PageDown' || e.key === 'PageUp' || (e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) || (!field && (e.key === ']' || e.key === '[')) || (!field && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'r' || e.key === 'R'));
    if (!nav) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    parent.postMessage({ type: 'elle-nav', key: e.key }, '*');
  }, true);

  // The shell forwards Enter / Right arrow here when the page itself has focus.
  addEventListener('message', function (e) {
    if (e.data && e.data.type === 'elle-key' && (e.data.key === 'Enter' || e.data.key === 'ArrowRight')) {
      var s = state();
      if (s === 'done') nextSlide(); else if (s === 'ready') pressEnter();
    }
  });
})();
