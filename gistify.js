(function(d,p){function l(a){this.name="GistifyError";this.message=a||"Unknown problem"}function q(a,c){this.element=a;this.options=d.extend({},r,c);if(!1==this.options.firstTime)if("save"==this.options.mode)this.save(a,this.options);else if("get"==this.options.mode)this.get(a,this.options);else throw new l('[Invalid argument] When gistify once initialized on a DOM element, in further calls, "options.mode" can be "save" or "get" but was "'+this.options.mode+'"');else{var b=this;if("create"==this.options.mode)this.loadAceLibrary(function(){b.create(a,
b.options)});else if("show"==this.options.mode)this.loadAceLibrary(function(){b.show(a,b.options)});else if("edit"==this.options.mode)this.loadAceLibrary(function(){b.edit(a,b.options)});else throw new l('[Invalid argument] In first invocation on a DOM element, "options.mode" can be "create"(default), "show" or "edit" but was "'+this.options.mode+'"');}}var n=!1,m;d(function(){d('<link id="gistify-style" rel="stylesheet" type="text/css"></link>').appendTo("head");d("#gistify-style").attr("href","gistify.css")});
var r={mode:"create",description:!0,saveButton:!1,height:"300px",width:"400px"};l.prototype=Error.prototype;q.prototype={loadAceLibrary:function(a){n?"function"==typeof a&&a():"object"===typeof p.ace&&"function"===typeof p.ace.edit?(n=!0,"function"==typeof a&&a()):d.ajax({type:"GET",url:"https://raw.github.com/ajaxorg/ace-builds/master/src-min-noconflict/ace.js",dataType:"script",cache:!0,success:function(){n=!0;ace.define("ace/ext/modelist",function(a,b,e){var d=[];a=function(a,b,c){this.name=a;
this.desc=b;this.mode="ace/mode/"+a;a=/\^/.test(c)?c.replace(/\|(\^)?/g,function(a,b){return"$|"+(b?"^":"^.*\\.")})+"$":"^.*\\.("+c+")$";this.extRe=RegExp(a,"gi")};a.prototype.supportsFile=function(a){return a.match(this.extRe)};var h={abap:["ABAP","abap"],asciidoc:["AsciiDoc","asciidoc"],c9search:["C9Search","c9search_results"],coffee:["CoffeeScript","^Cakefile|coffee|cf|cson"],coldfusion:["ColdFusion","cfm"],csharp:["C#","cs"],css:["CSS","css"],curly:["Curly","curly"],dart:["Dart","dart"],diff:["Diff",
"diff|patch"],dot:["Dot","dot"],ftl:["FreeMarker","ftl"],glsl:["Glsl","glsl|frag|vert"],golang:["Go","go"],groovy:["Groovy","groovy"],haxe:["haXe","hx"],haml:["HAML","haml"],html:["HTML","htm|html|xhtml"],c_cpp:["C/C++","c|cc|cpp|cxx|h|hh|hpp"],clojure:["Clojure","clj"],jade:["Jade","jade"],java:["Java","java"],jsp:["JSP","jsp"],javascript:["JavaScript","js"],json:["JSON","json"],jsx:["JSX","jsx"],latex:["LaTeX","latex|tex|ltx|bib"],less:["LESS","less"],lisp:["Lisp","lisp"],scheme:["Scheme","scm|rkt"],
liquid:["Liquid","liquid"],livescript:["LiveScript","ls"],logiql:["LogiQL","logic|lql"],lua:["Lua","lua"],luapage:["LuaPage","lp"],lucene:["Lucene","lucene"],lsl:["LSL","lsl"],makefile:["Makefile","^GNUmakefile|^makefile|^Makefile|^OCamlMakefile|make"],markdown:["Markdown","md|markdown"],mushcode:["TinyMUSH","mc|mush"],objectivec:["Objective-C","m"],ocaml:["OCaml","ml|mli"],pascal:["Pascal","pas|p"],perl:["Perl","pl|pm"],pgsql:["pgSQL","pgsql"],php:["PHP","php|phtml"],powershell:["Powershell","ps1"],
python:["Python","py"],r:["R","r"],rdoc:["RDoc","Rd"],rhtml:["RHTML","Rhtml"],ruby:["Ruby","ru|gemspec|rake|rb"],scad:["OpenSCAD","scad"],scala:["Scala","scala"],scss:["SCSS","scss"],sass:["SASS","sass"],sh:["SH","sh|bash|bat"],sql:["SQL","sql"],stylus:["Stylus","styl|stylus"],svg:["SVG","svg"],tcl:["Tcl","tcl"],tex:["Tex","tex"],text:["Text","txt"],textile:["Textile","textile"],tmsnippet:["tmSnippet","tmSnippet"],toml:["toml","toml"],typescript:["Typescript","typescript|ts|str"],vbscript:["VBScript",
"vbs"],xml:["XML","xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl"],xquery:["XQuery","xq"],yaml:["YAML","yaml"]},f;for(f in h)b=h[f],b=new a(f,b[0],b[1]),h[f]=b,d.push(b);e.exports={getModeFromPath:function(a){var b=h.text;a=a.split(/[\/\\]/).pop();for(var c=0;c<d.length;c++)if(d[c].supportsFile(a)){b=d[c];break}return b},modes:d,modesByName:h}});m=ace.require("ace/ext/modelist");"function"==typeof a&&a()},error:function(a,b,d){console.error("ACE library download failed.");console.error(b);console.error(d)}})},
buildDescription:function(a,c){if(!1!=c.description){a.append('<div class="gistify-size-determiner"><div class="gistify-bubble"><div class="gistify-gist-desc-container"><textarea class="gistify-gist-desc" placeholder="Gist a\u00e7\u0131klamas\u0131...">');d(".gistify-size-determiner").css("width",c.width).css("margin-bottom","10px");var b=a.find(".gistify-gist-desc-container").width()-4;a.find("textarea").width(b).css("max-width",b+"px").css("min-width",b+"px").css("resize","vertical")}},buildAnEditor:function(a){var c=
a.container,b=a.options,e=a.id,g='<div class="gistify-size-determiner"><div class="gistify-bubble"><div class="gistify-editor-container">'+a.meta+'<div class="gistify-ace" id="'+e+'"></div></div></div></div>';0<c.find(".gistify-footer").length?(c.find(".gistify-footer").before('<div class="gistify-gap">'),c.find(".gistify-footer").before(g)):c.append(g);c=c.find(".gistify-size-determiner").last();g=c.find(".gistify-bubble");c.css("height",b.height).css("width",b.width);b=g.height()-d(".gistify-meta").outerHeight()-
3;g.find("#"+e).css("height",b+"px");e=ace.edit(e);a=m.getModeFromPath(a.fileName);e.getSession().setMode(a.mode);e.setValue("");c.find(".gistify-language").text(a.desc);e.setTheme("ace/theme/github");d.data(c.get()[0],"gistify-aceEditor",e);d.data(c.get()[0],"zaa",13);return{aceEditor:e,sizeDeterminer:c}},create:function(a,c){var b=d(a).addClass("gistify-container").empty();this.buildDescription(b,c);var e=b.find(".gistify-editor-container").length+1,g=this.buildAnEditor({container:b,options:c,fileName:"Yeni dosya",
id:"gistifyEmbeddedGist-new_"+e,meta:'<div class="gistify-meta gistify-meta-create"><div class="gistify-filename-input-container"><a href="" class="mini-icon mini-icon-remove-close gistify-remove-button"></a><input class="gistify-filename" type="text" placeholder="Dosyay\u0131 adland\u0131r\u0131n..."></div><div class="gistify-filename-select-container"><select class="gistify-mode-select" size="1"><option value="abap">ABAP</option><option value="asciidoc">AsciiDoc</option><option value="c9search">C9Search</option><option value="coffee">CoffeeScript</option><option value="coldfusion">ColdFusion</option><option value="csharp">C#</option><option value="css">CSS</option><option value="curly">Curly</option><option value="dart">Dart</option><option value="diff">Diff</option><option value="dot">Dot</option><option value="ftl">FreeMarker</option><option value="glsl">Glsl</option><option value="golang">Go</option><option value="groovy">Groovy</option><option value="haxe">haXe</option><option value="haml">HAML</option><option value="html">HTML</option><option value="c_cpp">C/C++</option><option value="clojure">Clojure</option><option value="jade">Jade</option><option value="java">Java</option><option value="jsp">JSP</option><option value="javascript">JavaScript</option><option value="json">JSON</option><option value="jsx">JSX</option><option value="latex">LaTeX</option><option value="less">LESS</option><option value="lisp">Lisp</option><option value="scheme">Scheme</option><option value="liquid">Liquid</option><option value="livescript">LiveScript</option><option value="logiql">LogiQL</option><option value="lua">Lua</option><option value="luapage">LuaPage</option><option value="lucene">Lucene</option><option value="lsl">LSL</option><option value="makefile">Makefile</option><option value="markdown">Markdown</option><option value="mushcode">TinyMUSH</option><option value="objectivec">Objective-C</option><option value="ocaml">OCaml</option><option value="pascal">Pascal</option><option value="perl">Perl</option><option value="pgsql">pgSQL</option><option value="php">PHP</option><option value="powershell">Powershell</option><option value="python">Python</option><option value="r">R</option><option value="rdoc">RDoc</option><option value="rhtml">RHTML</option><option value="ruby">Ruby</option><option value="scad">OpenSCAD</option><option value="scala">Scala</option><option value="scss">SCSS</option><option value="sass">SASS</option><option value="sh">SH</option><option value="sql">SQL</option><option value="stylus">Stylus</option><option value="svg">SVG</option><option value="tcl">Tcl</option><option value="tex">Tex</option><option value="text" selected>Text</option><option value="textile">Textile</option><option value="tmsnippet">tmSnippet</option><option value="toml">toml</option><option value="typescript">Typescript</option><option value="vbscript">VBScript</option><option value="velocity">Velocity</option><option value="xml">XML</option><option value="xquery">XQuery</option><option value="yaml">YAML</option></select></div></div>'}),
h=this,f=g.sizeDeterminer,j=g.aceEditor;1==e&&f.find(".gistify-remove-button").remove();f.find(".gistify-mode-select").change(function(){j.getSession().setMode(m.modesByName[d(this).val()].mode)});f.find(".gistify-filename-input-container > input").keyup(function(){var a=m.getModeFromPath(d(this).val());j.getSession().setMode(a.mode);f.find(".gistify-mode-select").val(a.name);0<d(this).val().length?f.find(".gistify-mode-select").attr("disabled","true"):f.find(".gistify-mode-select").removeAttr("disabled")});
b.append('<div class="gistify-footer"><button class="gistify-new-btn">Yeni dosya ekle');b.find(".gistify-footer").css("width",c.width);b.find(".gistify-new-btn").click(function(){var a=h.buildAnEditor({container:b,options:c,fileName:"Yeni dosya",id:"gistifyEmbeddedGist-new_"+ ++e,meta:'<div class="gistify-meta gistify-meta-create"><div class="gistify-filename-input-container"><a href="" class="mini-icon mini-icon-remove-close gistify-remove-button"></a><input class="gistify-filename" type="text" placeholder="Dosyay\u0131 adland\u0131r\u0131n..."></div><div class="gistify-filename-select-container"><select class="gistify-mode-select" size="1"><option value="abap">ABAP</option><option value="asciidoc">AsciiDoc</option><option value="c9search">C9Search</option><option value="coffee">CoffeeScript</option><option value="coldfusion">ColdFusion</option><option value="csharp">C#</option><option value="css">CSS</option><option value="curly">Curly</option><option value="dart">Dart</option><option value="diff">Diff</option><option value="dot">Dot</option><option value="ftl">FreeMarker</option><option value="glsl">Glsl</option><option value="golang">Go</option><option value="groovy">Groovy</option><option value="haxe">haXe</option><option value="haml">HAML</option><option value="html">HTML</option><option value="c_cpp">C/C++</option><option value="clojure">Clojure</option><option value="jade">Jade</option><option value="java">Java</option><option value="jsp">JSP</option><option value="javascript">JavaScript</option><option value="json">JSON</option><option value="jsx">JSX</option><option value="latex">LaTeX</option><option value="less">LESS</option><option value="lisp">Lisp</option><option value="scheme">Scheme</option><option value="liquid">Liquid</option><option value="livescript">LiveScript</option><option value="logiql">LogiQL</option><option value="lua">Lua</option><option value="luapage">LuaPage</option><option value="lucene">Lucene</option><option value="lsl">LSL</option><option value="makefile">Makefile</option><option value="markdown">Markdown</option><option value="mushcode">TinyMUSH</option><option value="objectivec">Objective-C</option><option value="ocaml">OCaml</option><option value="pascal">Pascal</option><option value="perl">Perl</option><option value="pgsql">pgSQL</option><option value="php">PHP</option><option value="powershell">Powershell</option><option value="python">Python</option><option value="r">R</option><option value="rdoc">RDoc</option><option value="rhtml">RHTML</option><option value="ruby">Ruby</option><option value="scad">OpenSCAD</option><option value="scala">Scala</option><option value="scss">SCSS</option><option value="sass">SASS</option><option value="sh">SH</option><option value="sql">SQL</option><option value="stylus">Stylus</option><option value="svg">SVG</option><option value="tcl">Tcl</option><option value="tex">Tex</option><option value="text" selected>Text</option><option value="textile">Textile</option><option value="tmsnippet">tmSnippet</option><option value="toml">toml</option><option value="typescript">Typescript</option><option value="vbscript">VBScript</option><option value="velocity">Velocity</option><option value="xml">XML</option><option value="xquery">XQuery</option><option value="yaml">YAML</option></select></div></div>'});
a.sizeDeterminer.find(".gistify-remove-button").click(function(b){confirm("Bu dosyay\u0131 silmek istedi\u011finizden emin misiniz?")&&a.sizeDeterminer.remove();debugger;b.preventDefault()})});!0==c.saveButton&&(b.find(".gistify-footer").append('</button><button class="gistify-save-btn">Gisti kaydet</button>'),b.find(".gistify-save-btn").click(function(){}))},show:function(a,c){var b=this;jQuery.getJSON("https://api.github.com/gists/"+c.gistId,function(e){var g=d(a).addClass("gistify-container").empty();
b.buildDescription(g,c);var h=0,f;for(f in e.files)if(e.files.hasOwnProperty(f)){var j="gistifyEmbeddedGist-"+c.gistId+"_"+h++,k=b.buildAnEditor({container:g,options:c,fileName:f,id:j,meta:'<div class="gistify-meta gistify-meta-show"><span class="mini-icon mini-icon-gist"></span><span class="gistify-filename"></span><div class="gistify-file-actions"><span class="gistify-language"></span><ul class="gistify-button-group"><li><a href="" target="_blank" class="gistify-permalink" original-title="Permalink"><span class="mini-icon mini-icon-link"></span></a></li><li><a href="" target="_blank" class="gistify-raw-url" original-title="View Raw"><span class="mini-icon mini-icon-code"></span></a></li></ul></div></div>'}),
j=k.sizeDeterminer,k=k.aceEditor;j.find(".gistify-filename").text(f);var m=e.files[f];j.find(".gistify-raw-url").attr("href",m.raw_url);var l=e.html_url+"#file-"+f.replace(".","-"),l=l.toLowerCase();j.find(".gistify-permalink").attr("href",l);k.setValue(m.content);k.setReadOnly(!0);k.clearSelection();g.append('<div class="gistify-gap">')}g.find(".gistify-gap").last().remove()})},edit:function(){},get:function(a){var c={},b=d(a).find(".gistify-ace").toArray(),e;for(e in b){var g={},h=d(b[e]).closest(".gistify-size-determiner"),
f=d.data(h[0],"gistify-aceEditor");g.content=f.getValue();h=h.find(".gistify-filename").val();h=h.length?h:"Yeni dosya "+e;c[h]=g}return{description:d(a).find(".gistify-gist-desc").val(),"public":!0,files:c}},save:function(a,c,b,e){var g=this;d.ajax({type:"POST",url:"https://api.github.com/gists",data:JSON.stringify(this.get(a,c)),contentType:"application/json; charset=utf-8",dataType:"json",success:function(c,e,j){var k=c.id;d(a).empty();k=d.extend({},r,{gistId:k});g.show(a,k);"function"==typeof b&&
b(c,e,j)},error:function(a,b,c){debugger;"function"==typeof e&&e(a,b,c)}})}};d.fn.gistify=function(a){return this.each(function(){var c=void 0==d.data(this,"plugin_gistify");a=d.extend({},{firstTime:c},a);d.data(this,"plugin_gistify",new q(this,a))})}})(jQuery,window,document);