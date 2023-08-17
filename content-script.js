'use strict';

window.addEventListener('DOMContentLoaded', event => {
  if (window.location.pathname.includes('/pedigree/') ||   //血統情報
      window.location.pathname.includes('/simulation/')) { //仮想配合
    //「5代血統表」省スペース化
    var divs = document.querySelectorAll('.data-3__items div');
    for (const div of divs)
      div.style.padding = '1px';
  }

  //一部表の省スペース化
  var divs = document.querySelectorAll('[class^=data-6-] div');
  for (const div of divs) {
    if (document.querySelectorAll(div.className + ' dl').length > 0)
      continue;
    div.style.paddingLeft = '1px';
    div.style.paddingRight = '1px';
  }

  //[表をコピー」ボタン
  var spaces = document.querySelectorAll('[class^=space-]');
  for (const space of spaces) {
    var data = space.querySelectorAll(':scope > div');
    for (const datum of data) {
      if (!datum.className.startsWith('data-6-') &&
	  !datum.className.startsWith('data-7-'))
        continue;
      var rows = datum.querySelectorAll(':scope > div');
      if (!rows.length) {
        rows = datum.querySelectorAll(':scope > dl');
        if (rows.length > 0)
	  rows = rows[0].querySelectorAll(':scope > div');
      }
      while (rows.length > 0 && rows[0].className != '')
        rows = rows[0].querySelectorAll(':scope > div');
      if (!rows.length)
	continue;

      //tsvデータ作成
      var text = "";
      for (const row of rows) {
	var line = "";
	var cols = row.querySelectorAll(':scope > div, :scope > dt, :scope > dd');
	for (const col of cols) {
	  var col2 = col.cloneNode(true);
          for (const child of col2.children) {
	    if (child.tagName == 'DIV' && child.className.length > 0)
	      child.remove();
	  }
	  var val = col2.innerHTML.replace(/(<([^>]+)>)/g, ' ').trim().replace(/[ \t\n]+/g, ' ');
	  if (isNaN(val))
	    val = '"' + val + '"';
	  if (line.length > 0)
	    line += '\t';
	  line += val;
	}
	text += line + '\n';
      }

      //hiddenで埋め込み
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'tsv';
      input.value = text;
      datum.appendChild(input);

      //ボタン追加
      var button = document.createElement("button");
      button.className = 'btnSquare-4';
      button.innerHTML = '表をコピー';
      button.onclick = function() {
	var tsv = datum.querySelector('[name=tsv]');
	navigator.clipboard.writeText(tsv.value);
      };
      space.insertBefore(button, datum);
    }
  }
});
