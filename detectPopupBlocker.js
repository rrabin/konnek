// Return true if unable to open a new window
function popup_blocked() {
  var popup = window.open('','_blank','toolbar=no,scrollbars=no');
  if (!popup) {
    return true;
  } else {
    popup.close();
    return false;
  }
}