;(function ($, window, document) {
  'use strict';

  var aceLibraryUrl = 'https://raw.github.com/ajaxorg/ace-builds/master/src-min-noconflict/ace.js';
  // var aceLibraryModelistUrl = 'https://raw.github.com/ajaxorg/ace/bc745dc90875152b8c82d283ad0e0361ad5ad27c/lib/ace/ext/modelist.js';
  var gistApiUrl = 'https://api.github.com/gists';
  var aceIsAvailable = false;
  var modelist;//ace extension to decide highlight mode by file name

  var loadingHtml = '<div class="gistify-loading"><img src="https://a248.e.akamai.net/assets.github.com/images/spinners/octocat-spinner-64.gif" alt="' + localize('Yükleniyor...') + '"></div>';
  var modeSelectHtml = '<select class="gistify-mode-select" size="1"><option value="abap">ABAP</option><option value="asciidoc">AsciiDoc</option><option value="c9search">C9Search</option><option value="coffee">CoffeeScript</option><option value="coldfusion">ColdFusion</option><option value="csharp">C#</option><option value="css">CSS</option><option value="curly">Curly</option><option value="dart">Dart</option><option value="diff">Diff</option><option value="dot">Dot</option><option value="ftl">FreeMarker</option><option value="glsl">Glsl</option><option value="golang">Go</option><option value="groovy">Groovy</option><option value="haxe">haXe</option><option value="haml">HAML</option><option value="html">HTML</option><option value="c_cpp">C/C++</option><option value="clojure">Clojure</option><option value="jade">Jade</option><option value="java">Java</option><option value="jsp">JSP</option><option value="javascript">JavaScript</option><option value="json">JSON</option><option value="jsx">JSX</option><option value="latex">LaTeX</option><option value="less">LESS</option><option value="lisp">Lisp</option><option value="scheme">Scheme</option><option value="liquid">Liquid</option><option value="livescript">LiveScript</option><option value="logiql">LogiQL</option><option value="lua">Lua</option><option value="luapage">LuaPage</option><option value="lucene">Lucene</option><option value="lsl">LSL</option><option value="makefile">Makefile</option><option value="markdown">Markdown</option><option value="mushcode">TinyMUSH</option><option value="objectivec">Objective-C</option><option value="ocaml">OCaml</option><option value="pascal">Pascal</option><option value="perl">Perl</option><option value="pgsql">pgSQL</option><option value="php">PHP</option><option value="powershell">Powershell</option><option value="python">Python</option><option value="r">R</option><option value="rdoc">RDoc</option><option value="rhtml">RHTML</option><option value="ruby">Ruby</option><option value="scad">OpenSCAD</option><option value="scala">Scala</option><option value="scss">SCSS</option><option value="sass">SASS</option><option value="sh">SH</option><option value="sql">SQL</option><option value="stylus">Stylus</option><option value="svg">SVG</option><option value="tcl">Tcl</option><option value="tex">Tex</option><option value="text" selected>Text</option><option value="textile">Textile</option><option value="tmsnippet">tmSnippet</option><option value="toml">toml</option><option value="typescript">Typescript</option><option value="vbscript">VBScript</option><option value="velocity">Velocity</option><option value="xml">XML</option><option value="xquery">XQuery</option><option value="yaml">YAML</option></select>';

  var metaForCreate = '\
    <div class="gistify-meta gistify-meta-create">\
      <div class="gistify-filename-input-container">\
        <a href="#" class="mini-icon mini-icon-remove-close gistify-remove-button"></a>\
        <input class="gistify-filename" type="text" placeholder="'+ localize('Dosyayı adlandırın...') +'">\
      </div>\
      <div class="gistify-filename-select-container">' + modeSelectHtml + '</div>\
    </div>';

    var metaForShow = '\
      <div class="gistify-meta gistify-meta-show">\
        <span class="mini-icon mini-icon-show mini-icon-gist"></span>\
        <span class="gistify-filename"></span>\
        <div class="gistify-file-actions">\
          <span class="gistify-language"></span>\
          <ul class="gistify-button-group">\
            <li><a href="" target="_blank" class="gistify-permalink" original-title="Permalink"><span class="mini-icon mini-icon-show mini-icon-link"></span></a></li>\
            <li><a href="" target="_blank" class="gistify-raw-url" original-title="View Raw"><span class="mini-icon mini-icon-show mini-icon-code"></span></a></li>\
          </ul>\
        </div>\
      </div>';

  //css injection
  $(function() {
    $('<link id="gistify-style" rel="stylesheet" type="text/css"></link>').appendTo('head');
    $('#gistify-style').attr('href', 'gistify.css');
  });

  // Create the defaults once
  var pluginName = "gistify";
  var defaults = {
    mode: 'create', // first run: 'create' | 'show' | 'edit' # not first run: 'save' | 'get'
    description: true,
    saveButton: false,//only meaningful when mode:create
    height: '300px',
    width: '400px',
    callback: undefined //function meaningful when mode:get
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

    //show loading
    debugger;
    var loadingContainerWidth = $(element).empty().append(loadingHtml).find('.gistify-loading').height(this.options.height).width(this.options.width).width();
    $(element).find('.gistify-loading>img').css('left', loadingContainerWidth / 2 - 64 + 'px');
    
    if(this.options.firstTime == false){

      if(this.options.mode == 'save'){
        this.save(element, this.options);
      }
      else if(this.options.mode == 'get'){
        this.get(element, this.options);
      }
      else if(this.options.mode == 'convertToEdit'){//user enters mode as 'edit' and it is converted to 'convertToEdit' in plugin init
        this.edit(element, this.options);
      }
      else{
        throw new GistifyError('[Invalid argument] When gistify once initialized on a DOM element, in further calls, "options.mode" can be "save", "get" or "edit" but was "' + this.options.mode + '"');
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
        thiz.showOrEdit(element, thiz.options);
      });
    }
    else if(this.options.mode == 'edit'){
      this.loadAceLibrary(function() {
        thiz.showOrEdit(element, thiz.options);
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

      var el = sizeDeterminer.find('#' + divId)[0];
      var aceEditor = ace.edit(el);
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
    bindCreateEvents: function(sizeDeterminer, aceEditor){
      //mode select change event
      sizeDeterminer.find('.gistify-mode-select').change(function() {
        aceEditor.getSession().setMode(modelist.modesByName[$(this).val()].mode);
      });

      //filename input change(keyup) event
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

      //remove button click event
      sizeDeterminer.find('.gistify-remove-button').click(function(event){
        if(confirm(localize('Bu dosyayı silmek istediğinizden emin misiniz?'))){
          sizeDeterminer.remove();
        }
        event.preventDefault();
      });

      sizeDeterminer.find('.gistify-filename-input-container > input').trigger('keyup');
    },
    appendFooter: function(container, options) {
      var thiz = this;
      //append footer
      container.append('<div class="gistify-footer"><button class="gistify-new-btn gistify-btn">' + localize('Yeni dosya ekle'));
      container.find('.gistify-footer').css('width', options.width);
      var index = container.find('.gistify-editor-container').length + 1;//total gists in this container + 1

      //bind footer new button's action
      container.find('.gistify-new-btn').click(function() {
        var retVal = thiz.buildAnEditor({
          container: container,
          options: options,
          fileName: localize('Yeni dosya'),
          id: 'gistifyEmbeddedGist-' + 'new' + '_' + ++index,//don't forget to increase the index, otherwise no ace editor is shown
          meta: metaForCreate
        });

        //put filename into input field
        retVal.sizeDeterminer.find('.gistify-filename-input-container > input').val(localize('Yeni dosya'));

        thiz.bindCreateEvents(retVal.sizeDeterminer, retVal.aceEditor);
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
    create: function (element, options) {
      //container is the element to be gistified
      var container = $(element).addClass('gistify-container').empty();

      this.buildDescription(container, options);

      var index = container.find('.gistify-editor-container').length + 1;//total gists in this container + 1

      var retVal = this.buildAnEditor({
        container: container,
        options: options,
        fileName: localize('Yeni dosya'),
        id: 'gistifyEmbeddedGist-' + 'new' + '_' + index,
        meta: metaForCreate
      });
      var thiz = this;

      var sizeDeterminer = retVal.sizeDeterminer;
      var aceEditor = retVal.aceEditor;

      if(index == 1){
        sizeDeterminer.find('.gistify-remove-button').remove();
      }

      //put filename into input field
      sizeDeterminer.find('.gistify-filename-input-container > input').val(localize('Yeni dosya'));

      this.bindCreateEvents(sizeDeterminer, aceEditor);

      this.appendFooter(container, options);
    },
    showOrEdit: function (element, options) {
      var thiz = this;
      jQuery.getJSON(gistApiUrl + '/' + options.gistId , function(data) {
        //container is the element to be gistified
        var container = $(element).addClass('gistify-container').empty();

        thiz.buildDescription(container, options);

        var index = 0;
        for (var fileName in data.files) {
          if (data.files.hasOwnProperty(fileName)) {

            var divId = 'gistifyEmbeddedGist-' + options.gistId + '_' + index++;

            var retVal = thiz.buildAnEditor({
              container: container,
              options: options,
              fileName: fileName,
              id: divId,
              meta: metaForShow
            });

            var sizeDeterminer = retVal.sizeDeterminer;
            var aceEditor = retVal.aceEditor;

            sizeDeterminer.find('.gistify-filename').text(fileName);

            var file = data.files[fileName];
            sizeDeterminer.find('.gistify-raw-url').attr('href', file.raw_url);

            var permalink = data.html_url + '#file-' + fileName.replace('.', '-');
            permalink = permalink.toLowerCase();
            sizeDeterminer.find('.gistify-permalink').attr('href', permalink);

            aceEditor.setReadOnly(true);
            aceEditor.setValue(file.content);
            aceEditor.clearSelection();//by default all content comes as selected, don't know why

            container.append('<div class="gistify-gap">');
          }
        }

        if(options.mode == 'edit'){
          thiz.edit(element, options);
        }

        container.find('.gistify-gap').last().remove();
        return;
      });
    },
    edit: function(element, options) {
      var container = $(element);
      var thiz = this;

      $(element).find('.gistify-ace').each(function(index, domElement) {
        var aceEditor = $.data($(domElement).closest('.gistify-size-determiner')[0], 'gistify-aceEditor');
        aceEditor.setReadOnly(false);
        var fileName = $(domElement).prev('.gistify-meta').find('.gistify-filename').text();

        $(domElement).prev('.gistify-meta').replaceWith(metaForCreate);

        var sizeDeterminer = $(domElement).closest('.gistify-size-determiner');

        //put filename into input field
        sizeDeterminer.find('.gistify-filename-input-container > input').val(fileName);

        thiz.bindCreateEvents(sizeDeterminer, aceEditor);
      });

      this.appendFooter(container, options);
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

      var retVal = {
        'description': $(element).find('.gistify-gist-desc').val(),
        'public': true,
        'files': files
      };

      if(typeof options.callback == 'function'){
        options.callback(retVal);
      }
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
          thiz.showOrEdit(element, opt);

          if(typeof success == 'function'){
            success(data, textStatus, jqXHR);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          if(typeof error == 'function'){
            error(jqXHR, textStatus, errorThrown);
          }
        }
      });
    }
  };//Plugin.prototype

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options, callback) {

    //process options object
    if(typeof options == 'string'){
      if(options == 'edit'){
        options = {
          mode: 'convertToEdit'
        };
      }
      else if(options == 'save'){
        options = {
          mode: 'save'
        };
      }
      else if(options == 'get'){
        options = {
          mode: 'get',
          callback: callback
        };
      }
    }
    else{
      //if data-gist-id is present assume mode:show or edit
      var gistId = $(this).data('gistid');
      if(typeof options != 'object'){
        options = {};
      }

      if(gistId){
        options.mode = options.mode ? options.mode : 'show';
        options.gistId = gistId;
      }
    }

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
