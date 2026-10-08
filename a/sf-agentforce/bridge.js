// Forwards screen-navigation keys from an embedded demo to the shell (the iframe swallows keys otherwise).
(function () {
  if (window.parent === window) return;
  addEventListener('keydown', function (e) {
    var t = e.target && e.target.tagName, field = t === 'INPUT' || t === 'TEXTAREA';
    var plain = !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey;
    var arrow = plain && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && (!field || !e.target.value);
    var nav = arrow || e.key === 'PageDown' || e.key === 'PageUp' || (e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) || (!field && (e.key === ']' || e.key === '[')) || (!field && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'r' || e.key === 'R'));
    if (!nav) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    parent.postMessage({ type: 'elle-nav', key: e.key }, '*');
  }, true);
})();
