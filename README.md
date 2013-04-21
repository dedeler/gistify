Gistify
=======

jQuery plugin to create and modify Github gists. Converts a div into gist editor. See [demo](http://dedeler.github.io/gistify)

API
===

Include `gistify.js` and `gistify.css` into your path. Note that these 2 files must be in same directory as `gistify.js` loads the css file dynamically.

```
<script src="gistify.js"></script>
```

Options
-------
Possible options and defaults are shown:
```
{
	mode: 'create', // String, Optional first run: 'create'(default) | 'show' | 'edit' # not first run: 'save' | 'get'
	description: true,// Boolean, Optional whether show gist description
	saveButton: false, // Boolean, Optional only meaningful when mode:create
	height: '300px', // String, Optional
	width: '400px',//  String, Optional
	callback: undefined //function(data) meaningful when mode:get. data is the json object ready to be send to github api
}
```

Create
------
Converts a div into a Github style editor to create new gist. You can also save the gist publicly (anonymously)

```
<div id="targetDiv"></div>
<script>
$('#targetDiv').gistify({
	mode: 'create'
});
</script>
```

---

Default `mode` is `create`.
```
<div id="targetDiv"></div>
<script>
$('#targetDiv').gistify();
</script>
```

Show
----
Shows an existing gist. Better UI than Github's own embedding.

```
<div id="targetDiv"></div>
<script>
$('#targetDiv').gistify({
	mode:'show',
	gistId:'c37c4f2d6c67e1a72e77'
});
</script>
```

---

If a div has `data-gistid` then gistify behaves in `show` mode even no options are provided. In this usage options are optional.
```
<div id="targetDiv" data-gistid="c37c4f2d6c67e1a72e77"></div>
<script>
$('#targetDiv').gistify();
</script>
```

Edit
----
Upcoming...


