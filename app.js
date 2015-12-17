// -*- indent-tabs-mode: nil; tab-width: 2; js2-basic-offset: 2; coding: utf-8 -*-
/* global $, history, console, repl, external */

(function(){
  "use strict";

  /**
   * @param {string} plaintext
   * @return {Array}
   */
  var servercheck = function(plaintext) {
    // TODO: this is a mock, should send plaintext to server
    return [[0,4,"fail",["cake","cheese"]],
            [10,20,"weak",["coffee","armadillo"]]];
  };

  /**
   * @param {string} plaintext
   * @return {string}
   */
  var preclean = function(plaintext) {
    // TODO: maybe keep \n\n?
    return plaintext.replace(/\s\s+/g, " ").trim();
  };

  /**
   * Gather plaintext, call server, change DOM
   */
  var checkit = function() {
    console.log("Checking");
    var plaintext = preclean($("#form").text());
    var res = servercheck(plaintext);
    // TODO: worth looking into doing it async? We can't really change
    // the text after the user has typed unless the text still
    // matches what we sent.
    squiggle(plaintext, res);
  };

  /**
   * Changes DOM
   *
   * @param {string} plaintext
   * @param {Array} res
   */
  var squiggle = function(plaintext, res) {
    var errors = Array.sort(res);

    var form = document.getElementById('form');
    $('#form').empty();
    for(var i=0, done=0; i < errors.length; i++)
    {
      var beg = errors[i][0],
          end = errors[i][1],
          typ = errors[i][2],
          rep = errors[i][3],
          pre = plaintext.slice(done, beg),
          err = plaintext.slice(beg, end),
          span = document.createElement('span');
      form.appendChild(document.createTextNode(pre));
      span.textContent = err;
      span.onclick = function(){ return showsugg(this, rep); };
      span.className += " error";
      form.appendChild(span);
      done = end;
    }
    form.appendChild(document.createTextNode(plaintext.slice(done)));
  };

  /**
   * Changes DOM
   * TODO: should show menu
   *
   * @param {Node} elt
   * @param {Array<string>} rep
   */
  var showsugg = function(span, rep) {
    var spanoff = $(span).offset();
    var suggmenu = $('#suggmenu');
    suggmenu.offset({ top: spanoff.top+20,
                            left: spanoff.left });
    suggmenu.toggle(true);
  };

  var init = function () {
    $("#check_b").click(checkit);
    checkit();
  };
  window.onload=init;

})();
