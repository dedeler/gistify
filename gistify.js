// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ($, window, document) {
  /* window and document are passed through as local variable rather than global
  * as this (slightly) quickens the resolution process and can be more efficiently
  * minified (especially when both are regularly referenced in your plugin).
  */

  'use strict';

  var aceLibraryUrl = 'https://raw.github.com/ajaxorg/ace-builds/master/src-min-noconflict/ace.js';
  // var aceLibraryModelistUrl = 'https://raw.github.com/ajaxorg/ace/bc745dc90875152b8c82d283ad0e0361ad5ad27c/lib/ace/ext/modelist.js';
  var gistApiUrl = 'https://api.github.com/gists';
  var aceIsAvailable = false;
  var modelist;//ace extension to decide highlight mode by file name

  var modeSelectHtml = '<select class="gistify-mode-select" size="1"><option value="abap">ABAP</option><option value="asciidoc">AsciiDoc</option><option value="c9search">C9Search</option><option value="coffee">CoffeeScript</option><option value="coldfusion">ColdFusion</option><option value="csharp">C#</option><option value="css">CSS</option><option value="curly">Curly</option><option value="dart">Dart</option><option value="diff">Diff</option><option value="dot">Dot</option><option value="ftl">FreeMarker</option><option value="glsl">Glsl</option><option value="golang">Go</option><option value="groovy">Groovy</option><option value="haxe">haXe</option><option value="haml">HAML</option><option value="html">HTML</option><option value="c_cpp">C/C++</option><option value="clojure">Clojure</option><option value="jade">Jade</option><option value="java">Java</option><option value="jsp">JSP</option><option value="javascript">JavaScript</option><option value="json">JSON</option><option value="jsx">JSX</option><option value="latex">LaTeX</option><option value="less">LESS</option><option value="lisp">Lisp</option><option value="scheme">Scheme</option><option value="liquid">Liquid</option><option value="livescript">LiveScript</option><option value="logiql">LogiQL</option><option value="lua">Lua</option><option value="luapage">LuaPage</option><option value="lucene">Lucene</option><option value="lsl">LSL</option><option value="makefile">Makefile</option><option value="markdown">Markdown</option><option value="mushcode">TinyMUSH</option><option value="objectivec">Objective-C</option><option value="ocaml">OCaml</option><option value="pascal">Pascal</option><option value="perl">Perl</option><option value="pgsql">pgSQL</option><option value="php">PHP</option><option value="powershell">Powershell</option><option value="python">Python</option><option value="r">R</option><option value="rdoc">RDoc</option><option value="rhtml">RHTML</option><option value="ruby">Ruby</option><option value="scad">OpenSCAD</option><option value="scala">Scala</option><option value="scss">SCSS</option><option value="sass">SASS</option><option value="sh">SH</option><option value="sql">SQL</option><option value="stylus">Stylus</option><option value="svg">SVG</option><option value="tcl">Tcl</option><option value="tex">Tex</option><option value="text" selected>Text</option><option value="textile">Textile</option><option value="tmsnippet">tmSnippet</option><option value="toml">toml</option><option value="typescript">Typescript</option><option value="vbscript">VBScript</option><option value="velocity">Velocity</option><option value="xml">XML</option><option value="xquery">XQuery</option><option value="yaml">YAML</option></select>';

  //css injection
  $(function() {
    window.css = '@font-face{font-family:"Octicons Regular";src:url("https://a248.e.akamai.net/assets.github.com/assets/octicons/octicons-regular-webfont-f8cb074da115b589d1518e9701e5ce0145a9a04b.eot");src:url("https://a248.e.akamai.net/assets.github.com/assets/octicons/octicons-regular-webfont-f8cb074da115b589d1518e9701e5ce0145a9a04b.eot#iefix") format("embedded-opentype"),url("https://a248.e.akamai.net/assets.github.com/assets/octicons/octicons-regular-webfont-ca94a86a0e39e28efb023a130cb748731bb0ab58.woff") format("woff"),url("https://a248.e.akamai.net/assets.github.com/assets/octicons/octicons-regular-webfont-83378e6a590d9a4a7242c6cf23f1a1b49ce7aa14.ttf") format("truetype"),url("https://a248.e.akamai.net/assets.github.com/assets/octicons/octicons-regular-webfont-e1451ddc22ffbea19d2e8fca0742d5667940b793.svg#newFontRegular") format("svg");font-weight:normal;font-style:normal}.mini-icon{display:inline-block;font-family:"Octicons Regular";font-size:16px;font-style:normal;font-variant:normal;font-weight:normal;height:16px;line-height:16px}.mini-icon-gist:before{content:"\f00e";color:#999}.mini-icon-link:before{content:"\f05c"}.mini-icon-code:before{content:"\f05f"}.gistify-button-group a,.gistify-button-group a:hover,.gistify-button-group a:visited,.gistify-button-group a:active{color:#333}.gistify-button-group{display:inline-block;font-family:Helvetica,arial,freesans,clean,sans-serif;font-size:12px;height:34px;line-height:34px;margin:0;padding:0;vertical-align:middle;width:74px}.gistify-button-group li{border-left:1px solid #d8d8d8;list-style-type:none;float:left;width:36px}.gistify-editor-container{border:1px solid #ccc;border-radius:3px}.gistify-filename{font-weight:bold;font-size:13px}.gistify-language{font-weight:bold;font-size:12px;color:#999;padding:8px}.gistify-bubble{padding:3px;background:#eee;border-radius:3px;height:100%}.gistify-editor-container>.ace_editor{width:100%;height:100%}.gistify-meta{background-color:#fafafa;border-bottom-color:#d8d8d8;border-bottom-style:solid;border-bottom-width:1px;color:#555;display:block;font-family:Helvetica,arial,freesans,clean,sans-serif;line-height:16px}.gistify-filename-input-container>input{background-attachment:scroll;background-clip:border-box;background-color:white;background-image:none;background-origin:padding-box;background-size:auto;border-bottom-color:#333;border-bottom-style:none;border-bottom-width:0;border-left-color:#333;border-left-style:none;border-left-width:0;border-right-color:#333;border-right-style:none;border-right-width:0;border-top-color:#333;border-top-style:none;border-top-width:0;color:#333;cursor:auto;display:inline-block;font-family:helvetica,arial,freesans,sans-serif;font-size:12px;font-style:normal;font-variant:normal;font-weight:normal;height:14px;letter-spacing:normal;line-height:normal;margin-bottom:0;margin-left:0;margin-right:0;margin-top:0;outline-color:#333;outline-style:none;outline-width:0;padding-bottom:4px;padding-left:4px;padding-right:4px;padding-top:4px;text-align:start;text-indent:0;text-shadow:none;text-transform:none;vertical-align:baseline;width:142px;word-spacing:0}.gistify-filename-select-container{display:inline-block}.mini-icon-remove-close:before{content:"\f050"}.gistify-remove-button{color:#4183c4;float:left;display:inline-block;font-family:"Octicons Regular";font-size:16px;padding:3px;text-decoration:none}.gistify-filename-select-container>select{color:#333;display:inline-block;font-family:Helvetica,arial,freesans,clean,sans-serif;font-size:12px;font-style:normal;font-variant:normal;height:25px;line-height:16px;position:relative;text-align:left;text-shadow:white 0 1px 0;top:-1px;width:124px;font-weight:bold}.gistify-filename-select-container>select:disabled{color:#999}.gistify-filename-input-container{background-attachment:scroll;background-clip:border-box;background-color:white;background-image:none;background-origin:padding-box;background-size:auto;border-bottom-color:#CCC;border-bottom-left-radius:3px;border-bottom-right-radius:3px;border-bottom-style:solid;border-bottom-width:1px;border-left-color:#CCC;border-left-style:solid;border-left-width:1px;border-right-color:#CCC;border-right-style:solid;border-right-width:1px;border-top-color:#CCC;border-top-left-radius:3px;border-top-right-radius:3px;border-top-style:solid;border-top-width:1px;color:#555;display:inline-block;font-family:Helvetica,arial,freesans,clean,sans-serif;font-size:12px;font-style:normal;font-variant:normal;font-weight:normal;height:22px;line-height:0;padding-bottom:1px;padding-left:2px;padding-right:2px;padding-top:1px;text-align:left;text-shadow:white 0 1px 0;width:175px}.gistify-meta-create{height:26px;padding:6px}.gistify-meta-show{height:34px}.gistify-file-actions{float:right;height:34px;line-height:34px}.ace_gutter{background-color:#fff!important;border-right:1px solid #eee;color:#aaa}.gistify-gap{height:10px}.gistify-gist-desc-container{min-height:60px;border:1px solid #cacaca;background-color:#fff}.gistify-gist-desc-container>textarea{border:0;margin:0;min-height:60px;display:block}.gistify-footer{margin-top:10px;text-align:right}';
    $('<style id="gistify-style" type="text/css">' + css + '</style>').appendTo('head');
    $('#gistify-style').html(css);
  });

  // Create the defaults once
  var pluginName = "gistify";
  var defaults = {
    mode: 'create', // first run: 'create' | 'show' | 'edit' # not first run: 'save' | 'get'
    description: true,
    saveButton: false,//only meaningful when mode:create
    height: '300px',
    width: '400px',
  };

  //Gistify exception
  function GistifyError(message) {
    this.name = "GistifyError";
    this.message = (message || "Unknown problem");
  }
  GistifyError.prototype = Error.prototype;

  // Plugin constructor
  function Plugin(element, options) {

    this.element = element;
    this.options = $.extend({}, defaults, options);
    // this._defaults = defaults;
    // this._name = pluginName;
    
    if(this.options.firstTime == false){

      //TODO extract element data attributes if any
      //if data-gist-id is present assume mode:show or edit

      if(this.options.mode == 'save'){
        this.save(element, this.options);
      }
      else if(this.options.mode == 'get'){
        this.get(element, this.options);
      }
      else{
        throw new GistifyError('[Invalid argument] When gistify once initialized on a DOM element, in further calls, "options.mode" can be "save" or "get" but was "' + this.options.mode + '"');
      }
      return;
    }

    var thiz = this;
    if(this.options.mode == 'create'){
      this.loadAceLibrary(function() {
        thiz.create(element, thiz.options);
      });
    }
    else if(this.options.mode == 'show'){
      this.loadAceLibrary(function() {
        thiz.show(element, thiz.options);
      });
    }
    else if(this.options.mode == 'edit'){
      this.loadAceLibrary(function() {
        thiz.edit(element, thiz.options);
      });
    }
    else{
      throw new GistifyError('[Invalid argument] In first invocation on a DOM element, "options.mode" can be "create"(default), "show" or "edit" but was "' + this.options.mode + '"');
    }
  }
  
  Plugin.prototype = {
    loadAceLibrary: function (callback) {
      if(aceIsAvailable){
        if (typeof callback == 'function') {
          callback();
        }
        return;
      }

      if(typeof window.ace === 'object' && typeof window.ace.edit === 'function'){
        aceIsAvailable = true;
        if (typeof callback == 'function') {
          callback();
        }
        return;
      }

      $.ajax({
        type: "GET",
        url: aceLibraryUrl,
        dataType: "script",
        cache: true,
        success: function() {
          aceIsAvailable = true;
          
          loadModeList(function() {
            modelist = ace.require('ace/ext/modelist');//https://github.com/ajaxorg/ace/pull/1348

            if (typeof callback == 'function') {
              callback();
            }
          });
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error('ACE library download failed.');
          console.error(textStatus);
          console.error(errorThrown);
        }
      });

    },//loadAceLibrary
    buildDescription: function(container, options) {
      if(options.description == false){
        return;
      }

      container.append('\
        <div class="gistify-size-determiner">\
        <div class="gistify-bubble">\
        <div class="gistify-gist-desc-container">\
        <textarea class="gistify-gist-desc" placeholder="' + localize('Gist açıklaması...') + '">'
      );

      $('.gistify-size-determiner').css('width', options.width).css('margin-bottom', '10px');

      var descWidth = container.find('.gistify-gist-desc-container').width() - 4;
      
      container.find('textarea')
      .width(descWidth)
      .css('max-width', descWidth + 'px')
      .css('min-width', descWidth + 'px')
      .css('resize', 'vertical');
    },
    buildAnEditor: function(params){
      var container = params.container;
      var options = params.options;
      var divId = params.id;

      var structure = '\
        <div class="gistify-size-determiner">\
          <div class="gistify-bubble">\
            <div class="gistify-editor-container">\
              ' + params.meta + '\
              <div class="gistify-ace" id="' + divId + '"></div>\
            </div>\
          </div>\
        </div>\
      ';

      if(container.find('.gistify-footer').length > 0){
        //guaranteed to be only 1 footer by implementation, no checks needed
        container.find('.gistify-footer').before('<div class="gistify-gap">');
        container.find('.gistify-footer').before(structure);
      }
      else{
        container.append(structure);
      }

      var sizeDeterminer = container.find('.gistify-size-determiner').last();
      var bubble = sizeDeterminer.find('.gistify-bubble');
 
      sizeDeterminer.css('height', options.height).css('width', options.width);

      var height = bubble.height() - $('.gistify-meta').outerHeight() - 3;//3 for padding
      bubble.find('#' + divId).css('height', height + 'px');

      var aceEditor = ace.edit(divId);
      //determine language by extension
      var mode = modelist.getModeFromPath(params.fileName);
      aceEditor.getSession().setMode(mode.mode);
      aceEditor.setValue('');

      //set mode text
      sizeDeterminer.find('.gistify-language').text(mode.desc);

      aceEditor.setTheme("ace/theme/github");

      $.data(sizeDeterminer.get()[0], 'gistify-aceEditor', aceEditor);
      $.data(sizeDeterminer.get()[0], 'zaa', 13);

      return {
        aceEditor: aceEditor,
        sizeDeterminer: sizeDeterminer
      };
    },
    create: function (element, options) {
      //container is the element to be gistified
      var container = $(element).addClass('gistify-container').empty();

      this.buildDescription(container, options);

      var index = container.find('.gistify-editor-container').length + 1;//total gists in this container + 1
      var meta = '\
      <div class="gistify-meta gistify-meta-create">\
        <div class="gistify-filename-input-container">\
          <a href="" class="mini-icon mini-icon-remove-close gistify-remove-button"></a>\
          <input class="gistify-filename" type="text" placeholder="'+ localize('Dosyayı adlandırın...') +'">\
        </div>\
        <div class="gistify-filename-select-container">' + modeSelectHtml + '</div>\
      </div>';

      var retVal = this.buildAnEditor({
        container: container,
        options: options,
        fileName: localize('Yeni dosya'),
        id: 'gistifyEmbeddedGist-' + 'new' + '_' + index,
        meta: meta
      });
      var thiz = this;

      var sizeDeterminer = retVal.sizeDeterminer;
      var aceEditor = retVal.aceEditor;

      if(index == 1){
        sizeDeterminer.find('.gistify-remove-button').remove();
      }

      sizeDeterminer.find('.gistify-mode-select').change(function() {
        aceEditor.getSession().setMode(modelist.modesByName[$(this).val()].mode);
      });

      sizeDeterminer.find('.gistify-filename-input-container > input').keyup(function() {
        var mode = modelist.getModeFromPath($(this).val());
        aceEditor.getSession().setMode(mode.mode);
        sizeDeterminer.find('.gistify-mode-select').val(mode.name);

        if($(this).val().length > 0){
          sizeDeterminer.find('.gistify-mode-select').attr('disabled', 'true');
        }
        else{
          sizeDeterminer.find('.gistify-mode-select').removeAttr('disabled');
        }

      });

      //append footer
      container.append('<div class="gistify-footer"><button class="gistify-new-btn">' + localize('Yeni dosya ekle'));
      container.find('.gistify-footer').css('width', options.width);

      //bind footer new button's action
      container.find('.gistify-new-btn').click(function() {
        var retVal = thiz.buildAnEditor({
          container: container,
          options: options,
          fileName: localize('Yeni dosya'),
          id: 'gistifyEmbeddedGist-' + 'new' + '_' + ++index,//don't forget to increase the index, otherwise no ace editor is shown
          meta: meta
        });

        retVal.sizeDeterminer.find('.gistify-remove-button').click(function(event){
          if(confirm(localize('Bu dosyayı silmek istediğinizden emin misiniz?'))){
            retVal.sizeDeterminer.remove();
          }
          debugger;
          event.preventDefault();
        });

      });

      //append save button if desired
      if(options.saveButton == true){
        container.find('.gistify-footer').append('</button><button class="gistify-save-btn">' + localize('Gisti kaydet') + '</button>');
        
        //bind footer save button's action
        container.find('.gistify-save-btn').click(function() {
          //TODO
        });
      }

    },
    show: function (element, options) {
      var thiz = this;
      jQuery.getJSON(gistApiUrl + '/' + options.gistId , function(data) {
        //container is the element to be gistified
        var container = $(element).addClass('gistify-container').empty();

        thiz.buildDescription(container, options);

        var index = 0;
        for (var fileName in data.files) {
          if (data.files.hasOwnProperty(fileName)) {

            var divId = 'gistifyEmbeddedGist-' + options.gistId + '_' + index++;

            var meta = '\
            <div class="gistify-meta gistify-meta-show">\
              <span class="mini-icon mini-icon-gist"></span>\
              <span class="gistify-filename"></span>\
              <div class="gistify-file-actions">\
                <span class="gistify-language"></span>\
                <ul class="gistify-button-group">\
                  <li><a href="" target="_blank" class="gistify-permalink" original-title="Permalink"><span class="mini-icon mini-icon-link"></span></a></li>\
                  <li><a href="" target="_blank" class="gistify-raw-url" original-title="View Raw"><span class="mini-icon mini-icon-code"></span></a></li>\
                </ul>\
              </div>\
            </div>';

            var retVal = thiz.buildAnEditor({
              container: container,
              options: options,
              fileName: fileName,
              id: divId,
              meta: meta
            });

            var sizeDeterminer = retVal.sizeDeterminer;
            var aceEditor = retVal.aceEditor;

            sizeDeterminer.find('.gistify-filename').text(fileName);

            var file = data.files[fileName];
            sizeDeterminer.find('.gistify-raw-url').attr('href', file.raw_url);

            var permalink = data.html_url + '#file-' + fileName.replace('.', '-');
            permalink = permalink.toLowerCase();
            sizeDeterminer.find('.gistify-permalink').attr('href', permalink);

            aceEditor.setValue(file.content);
            aceEditor.setReadOnly(true);
            aceEditor.clearSelection();//by default all content comes as selected, don't know why

            container.append('<div class="gistify-gap">');
          }
        }
        container.find('.gistify-gap').last().remove();
        return;
      });
    },
    edit: function (element, options) {

    },
    get: function(element, options) {
      var files = {};

      var array = $(element).find('.gistify-ace').toArray();
      for(var i in array){
        var item = array[i];
        var $item = $(item);
        var file = {};
        var sizeDeterminer = $item.closest('.gistify-size-determiner');

        var aceEditor = $.data(sizeDeterminer[0], 'gistify-aceEditor');
        file.content = aceEditor.getValue();
        var fileName = sizeDeterminer.find('.gistify-filename').val();
        fileName = fileName.length ? fileName : localize('Yeni dosya ' + i);

        files[fileName] = file;
      }

      return {
        'description': $(element).find('.gistify-gist-desc').val(),
        'public': true,
        'files': files
      };
    },
    save: function(element, options, success, error) {
      var thiz = this;
      $.ajax({
        type: 'POST',
        url: gistApiUrl,
        data: JSON.stringify(this.get(element, options)),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data, textStatus, jqXHR) {
          var id = data.id;
          $(element).empty();
          var opt = $.extend({}, defaults, {gistId: id});
          thiz.show(element, opt);

          if(typeof success == 'function'){
            success(data, textStatus, jqXHR);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          debugger;
          
          if(typeof error == 'function'){
            error(jqXHR, textStatus, errorThrown);
          }
        }
      });
    }
  };//Plugin.prototype

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var firstTime = $.data(this, "plugin_" + pluginName) == undefined;
      options = $.extend({}, {firstTime:firstTime}, options);
      $.data(this, "plugin_" + pluginName, new Plugin(this, options));
    });
  };

  function localize(string) {
    return string;
  }

/**
  To prevent further network traffic ace editor's modelist plugin is embedded into gistify plugin
  Since this function abstracts the loading of modelist plugin,
it can be downloaded from ace's CDN urls if desired in the future
*/
function loadModeList(callback) {
  
  ace.define('ace/ext/modelist', function(require, exports, module) {
    "use strict";

 var modes = [];

 function getModeFromPath(path) {
    var mode = modesByName.text;
    var fileName = path.split(/[\/\\]/).pop();
    for (var i = 0; i < modes.length; i++) {
      if (modes[i].supportsFile(fileName)) {
        mode = modes[i];
        break;
      }
    }
    return mode;
  }

var Mode = function(name, desc, extensions) {
  this.name = name;
  this.desc = desc;
  this.mode = "ace/mode/" + name;
  if (/\^/.test(extensions)) {
    var re = extensions.replace(/\|(\^)?/g, function(a, b){
      return "$|" + (b ? "^" : "^.*\\.");
    }) + "$";
  } else {
    var re = "^.*\\.(" + extensions + ")$";
  }

  this.extRe = new RegExp(re, "gi");
};

Mode.prototype.supportsFile = function(filename) {
  return filename.match(this.extRe);
};

/**
 * An object containing properties that map to rendering modes. Each property
 *  contains an array where element 0 is the name of the mode and element 1
 *  contains information about the file extensions where this mode is
 *  applicable.
 */
 var modesByName = {
  abap:       ["ABAP"         , "abap"],
  asciidoc:   ["AsciiDoc"     , "asciidoc"],
  c9search:   ["C9Search"     , "c9search_results"],
  coffee:     ["CoffeeScript" , "^Cakefile|coffee|cf|cson"],
  coldfusion: ["ColdFusion"   , "cfm"],
  csharp:     ["C#"           , "cs"],
  css:        ["CSS"          , "css"],
  curly:      ["Curly"        , "curly"],
  dart:       ["Dart"         , "dart"],
  diff:       ["Diff"         , "diff|patch"],
  dot:        ["Dot"          , "dot"],
  ftl:        ["FreeMarker"   , "ftl"],
  glsl:       ["Glsl"         , "glsl|frag|vert"],
  golang:     ["Go"           , "go"],
  groovy:     ["Groovy"       , "groovy"],
  haxe:       ["haXe"         , "hx"],
  haml:       ["HAML"         , "haml"],
  html:       ["HTML"         , "htm|html|xhtml"],
  c_cpp:      ["C/C++"        , "c|cc|cpp|cxx|h|hh|hpp"],
  clojure:    ["Clojure"      , "clj"],
  jade:       ["Jade"         , "jade"],
  java:       ["Java"         , "java"],
  jsp:        ["JSP"          , "jsp"],
  javascript: ["JavaScript"   , "js"],
  json:       ["JSON"         , "json"],
  jsx:        ["JSX"          , "jsx"],
  latex:      ["LaTeX"        , "latex|tex|ltx|bib"],
  less:       ["LESS"         , "less"],
  lisp:       ["Lisp"         , "lisp"],
  scheme:     ["Scheme"       , "scm|rkt"],
  liquid:     ["Liquid"       , "liquid"],
  livescript: ["LiveScript"   , "ls"],
  logiql:     ["LogiQL"       , "logic|lql"],
  lua:        ["Lua"          , "lua"],
  luapage:    ["LuaPage"      , "lp"], // http://keplerproject.github.com/cgilua/manual.html#templates
  lucene:     ["Lucene"       , "lucene"],
  lsl:        ["LSL"          , "lsl"],
  makefile:   ["Makefile"     , "^GNUmakefile|^makefile|^Makefile|^OCamlMakefile|make"],
  markdown:   ["Markdown"     , "md|markdown"],
  mushcode:   ["TinyMUSH"     , "mc|mush"],
  objectivec: ["Objective-C"  , "m"],
  ocaml:      ["OCaml"        , "ml|mli"],
  pascal:     ["Pascal"       , "pas|p"],
  perl:       ["Perl"         , "pl|pm"],
  pgsql:      ["pgSQL"        , "pgsql"],
  php:        ["PHP"          , "php|phtml"],
  powershell: ["Powershell"   , "ps1"],
  python:     ["Python"       , "py"],
  r:          ["R"            , "r"],
  rdoc:       ["RDoc"         , "Rd"],
  rhtml:      ["RHTML"        , "Rhtml"],
  ruby:       ["Ruby"         , "ru|gemspec|rake|rb"],
  scad:       ["OpenSCAD"     , "scad"],
  scala:      ["Scala"        , "scala"],
  scss:       ["SCSS"         , "scss"],
  sass:       ["SASS"         , "sass"],
  sh:         ["SH"           , "sh|bash|bat"],
  sql:        ["SQL"          , "sql"],
  stylus:     ["Stylus"       , "styl|stylus"],
  svg:        ["SVG"          , "svg"],
  tcl:        ["Tcl"          , "tcl"],
  tex:        ["Tex"          , "tex"],
  text:       ["Text"         , "txt"],
  textile:    ["Textile"      , "textile"],
  tmsnippet:  ["tmSnippet"    , "tmSnippet"],
  toml:       ["toml"         , "toml"],
  typescript: ["Typescript"   , "typescript|ts|str"],
  vbscript:   ["VBScript"     , "vbs"],
  xml:        ["XML"          , "xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl"],
  xquery:     ["XQuery"       , "xq"],
  yaml:       ["YAML"         , "yaml"]
};

  for (var name in modesByName) {
    var mode = modesByName[name];
    mode = new Mode(name, mode[0], mode[1]);
    modesByName[name] = mode;
    modes.push(mode);
  }

  module.exports = {
    getModeFromPath: getModeFromPath,
    modes: modes,
    modesByName: modesByName
  };


});

  callback();
}//end of loadModeList


})(jQuery, window, document);
