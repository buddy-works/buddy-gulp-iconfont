# How to create iconfont from svg files with Buddy

All sample icons are from [Maki Icon Set](https://github.com/mapbox/maki).


**package.json**

```
{
  "name": "gulp-icons",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "iconfont": "gulp iconfont"
  },
  "license": "ISC",
  "devDependencies": {
    "gulp": "^3.9.1",
    "gulp-consolidate": "^0.1.2",
    "gulp-iconfont": "^5.0.1",
    "underscore": "^1.8.3"
  }
}

```

**gulpfile.js**

```js
var gulp = require('gulp'),
    consolidate = require('gulp-consolidate'),
    iconfont = require('gulp-iconfont');

gulp.task('iconfont', function () {
    return gulp.src('iconfont-src/svg/*.svg')
        .pipe(iconfont({
            fontName: 'iconfont',
            formats: ['ttf', 'eot', 'woff', 'woff2'],
            appendCodepoints: true,
            appendUnicode: false,
            normalize: true,
            fontHeight: 1000,
            centerHorizontally: true
        }))
        .on('glyphs', function (glyphs, options) {
            gulp.src('iconfont-src/iconfont.css')
                .pipe(consolidate('underscore', {
                    glyphs: glyphs,
                    fontName: options.fontName,
                    fontDate: new Date().getTime()
                }))
                .pipe(gulp.dest('iconfont'));
                
            gulp.src('iconfont-src/index.html')
                .pipe(consolidate('underscore', {
                    glyphs: glyphs,
                    fontName: options.fontName
                }))
                .pipe(gulp.dest('iconfont'));
        })
        .pipe(gulp.dest('iconfont'));
});
```

**iconfont-src/iconfont.css**

```
/**
<%= fontName %> Webfont
*/
@font-face {
	font-family: '<%= fontName %>';
	src: url('<%= fontName %>.eot?<%= fontDate %>');
	src: url('<%= fontName %>.eot?#iefix-<%= fontDate %>') format('embedded-opentype'),
		url('<%= fontName %>.woff2?<%= fontDate %>') format('woff2'),
		url('<%= fontName %>.woff?<%= fontDate %>') format('woff'),
		url('<%= fontName %>.ttf?<%= fontDate %>') format('truetype');
	font-weight: normal;
	font-style: normal;
}

[class^='icon-']:before,
[class*=' icon-']:before {
	font-family: '<%= fontName %>';
	display: inline-block;
	vertical-align: middle;
	line-height: 1;
	font-weight: normal;
	font-style: normal;
	speak: none;
	text-decoration: inherit;
	font-size: inherit;
	text-transform: none;
	text-rendering: optimizeLegibility;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

/*
Glyphs list
*/
<% _.each(glyphs, function(icon){ %>
.icon-<%= icon.name %>:before {
	content: '\<%= icon.unicode[0].charCodeAt(0).toString(16) %>';
}
<% }) %>
```

**iconfont-src/index.html**

```
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><%= fontName %> - glyphs list</title>

	<link rel="stylesheet" href="iconfont.css">
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			font-family: Helvetica, Verdana, sans-serif;
		}

		.wrap {
			max-width: 800px;
			margin: 0 auto;
		}

		.glyphs-list {
			margin: 0;
			padding: 0;
			list-style: none
		}

		.glyphs-list li {
			float: left;
			width: 25%;
			padding: 16px;
			text-align: center;
		}

		.glyphs-list li:hover {
			cursor: default;
			background: #fafafa;
		}

		.glyphs-list li:nth-child(4n+1) {
			clear: left;
		}

		.glyphs-list i {
			font-size: 48px;
			line-height: 1;
		}

		.glyphs-list code {
			display: block;
			margin: 16px 0 0;
		}

		.glyphs-list input {
			display: block;
			width: 100%;
			margin: 16px 0 0;
		}
	</style>
</head>
<body>
	<div class="wrap">
		<h1><%= fontName %> - glyphs list</h1>
		<ul class="glyphs-list">
			<% _.each(glyphs, function(icon){ %>
			<li>
				<i class="icon-<%= icon.name %>"></i>
				<code>\<%= icon.unicode[0].charCodeAt(0).toString(16) %></code>
				<input type="text" value="icon-<%= icon.name %>"/>
			</li>
			<% }) %>
		</ul>
	</div>
</body>
</html>
```

