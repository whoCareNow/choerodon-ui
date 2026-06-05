/**
 * Resolve Pro Display UMD namespace (supports legacy global names from older builds).
 */
(function (global) {
  function resolveProDisplay() {
    return (
      global['choerodon-ui/pro-display'] ||
      global['choerodon-ui-pro-display.min'] ||
      global['choerodon-ui-pro-display']
    );
  }

  global.getChoerodonProDisplay = function getChoerodonProDisplay() {
    const lib = resolveProDisplay();
    if (!lib) {
      throw new Error(
        'Pro Display UMD not loaded. Run `npm run dist:pro-display` and serve this page over HTTP (not file://).',
      );
    }
    return lib;
  };
})(window);
