In this tutorial we'll turn SVG icons into a webfont with Gulp.js and use it with a CSS in a web page.

# Preparing SVG icons

First, we need a few icons in the SVG format. You can use Illustrator, Inkscape or another vector-drawing tool. For this example I shall use icons from the [Maki Icon Set](https://github.com/mapbox/maki).

All icons should be:

- the same size
- in solid black color
- on white background

Once you aplly these settings to all icons, you are ready to create the webfont.

!![Prepared SVG icons](https://buddy.works/data/blog/_images/build-webfont/gulp-1.png)

# Generating package.json

To create a webfont with gulp.js, we need a `package.json` with the following content:

```json
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

The main parts of our script are `gulp` and `gulp-iconfont`, but we will use two other dependencies, `gulp-consolidate` and `underscore`, to create HTML and CSS files from prepared templates. This way we'll be able to generate classes in the CSS, or variables in the SCSS.

# Generating gulpfile.js

Now we have to generate a `gulpfile.js`. We need only one gulp task, because it will do everything we need:

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

# How gulpfile.js works

- First we grab all SVG files from `iconfont-src/svg/`. This is the main directory where you should put all SVG sources.
- Next gulp.js creates webfonts in 4 formats: `ttf`, `eot`, `woff` and `woff2`. You can modify this line to your desired extensions.
- The rest of settings define font rendering. You can experiment with these options to your liking.
- When the font's been generated, gulp.js triggers the `glyphs` event which saves font character codepoints to CSS file and HTML demo page: `iconfont-src/iconfont.css` and `iconfont-src/index.html`.

# Contents of iconfont-src/iconfont.css

The gulp file defines all font data. It will be used as an underscore template. The CSS template is the most important, because it will be used as the main part of our website.

You can use the icons with this syntax:

- in HTML: `<i class="icon-rocket"></i>`
- in CSS: `content: '\ea09';`

Remember that this is only source and all results will be placed in the `iconfont` directory.

```css
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

# Contents of iconfont-src/index.html

The second template will show all icons with codepoints and CSS classes, making it easier to view the results. You don't need to create it, but it's very useful for development.

```html
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

---

# Buddy configuration

## Setting up delivery pipeline

1. Fire up [Buddy](https://buddy.works) and create a new project. Select Buddy as the provider and push your code, or fork our sample repository from [https://github.com/buddy-works/tutorial-gulp-iconfont](https://github.com/buddy-works/tutorial-gulp-iconfont).

2. Create a new pipeline and set the trigger mode to **On every push**: the webfont will be generated automatically every time you make a push to the specified branch:
 
	!![Setting pipeline details](https://buddy.works/data/blog/_images/build-webfont/gulp-2.png)
	
3. (Optional) Click **More options** and paste the URL to your website to quickly access it from the pipeline view.

---

## Configuring build

1. Since we use gulp to generate the webfont, add **node** as the first action:

	!![Choosing build action](https://buddy.works/data/blog/_images/build-webfont/gulp-3.png)

2. On the action config view select the newest Node.js version and enter these commands in the input:

		npm install
		gulp iconfont
	
	The node action comes with `npm install -g gulp` predefined, so there's no need to install anything else.

	!![Configuring build commands](build-webfont/gulp-4.png)

3. Click **Add this action** to save changes.

---

## Configuring delivery

1. Add another action and select the transfer action for your server type. In this example we'll use FTP:

	!![Choosing delivery action](build-webfont/gulp-5.png)

2. On the action config view, select **pipeline filesystem** as the source.

3. Provide login details to your server and set the source path to `iconfont`. It contains all webfont files (we set this path in `gulpfiles.js`)

	!![Configuring FTP delivery](https://buddy.works/data/blog/_images/build-webfont/gulp-6.png)

4. Confirm changes and test connection. If everything's correct, Buddy will add the action to the pipeline.

---

## Testing your pipeline

Congratulations! You have just automated webfont generation for your site. When you're ready, click **Run pipeline** > **Run now** to test the process:

!![Testing pipeline](https://buddy.works/data/blog/_images/build-webfont/gulp-7.png)

Buddy will create a Docker container, make the webfont from SVG files, and transfer it to your FTP server:

!![Execution summary](https://buddy.works/data/blog/_images/build-webfont/gulp-8.png)

When the release is over, go to your website and check the results. All glyphs have been generated in `index.html`. The page should be similar to this:

!![Results preview](https://buddy.works/data/blog/_images/build-webfont/gulp-9.png)

---

# How to use the new webfont on my website

To use the generated webfont on your site, just paste `iconfont.css` in the `<head>` section:

```html
<link rel="stylesheet" href="iconfont.css">
```

Now you can use custom glyphs:

* in  HTML: `<i class="icon-zoo"></i>`
* in CSS: `content: '\ea09';`

Remember to use correct paths to your CSS and webfont files!

# Adding new SVG files to generator 

From now on, any time you need to add a new icon on your website just put the SVG file in the `iconfont-src/scr` directory, and Buddy will take care of the rest.
