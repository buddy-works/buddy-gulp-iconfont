# How to create webfont from SVG files with Buddy

In this tutorial, we’ll look at how to turn SVG icons into a web font using Buddy and Gulp.js. Then, we’ll look at how to use the generated font files and CSS in a web page.

**Prepare your icons**

Firstly we need a few icons in SVG format. You can use Illustrator, Inkscape or other vector-draving tool. Because I'm too lazy, I used icons from [Maki Icon Set](https://github.com/mapbox/maki). All icons have the same dimensions and should be with solid black color and white background. Once you have done this for all of the icons, you are ready to create a web font.

**package.json**

Because we will use gulp.js to create webfont, you must create `package.json` file with those content:

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

`gulp` and `gulp-iconfont` are the main part of our script, but we will use two other dependencies `gulp-consolidate` and `underscore` to create HTML and CSS files from prepared templates. Thereby we can use all classes in CSS or variables in SCSS or LESS.

**gulpfile.js**

In the next step create `gulpfile.js` file with content shown below. We need only one gulp task, because it does everything we need.

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

Let's look at its contents. At the beginning we grab all SVG files from `iconfont-src/svg/`. This is the main directory and you should put all SVG sources to it. In the next step gulp.js will create webfonts in 4 different formats: `ttf`, `eot`, `woff` and `woff2`. You can modify this line and set only necessary font extensions. Other settings are selected to best font rendering. You can obviously experiment with this options.

When all font are generated and ready to save gulp.js trigger `glyphs` event and we will use it to save font character codepoints to CSS file and HTML demo page. We will use `iconfont-src/iconfont.css` and `iconfont-src/index.html` underscore templates. All font data will be used like underscore template. Look at my files:

**iconfont-src/iconfont.css**

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

CSS template is most important, because it will be used as main part of our website. Thereby you can use icons in your HTML file with this syntax: `<i class="icon-rocket"></i>` or in CSS: `content: '\ea09';`.

**iconfont-src/index.html**

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

## Buddy configuration

Firstly go to [Buddy App](http://buddy.works) and create new project. You can host your own code or fork our sample repository from https://github.com/buddy-works/tutorial-gulp-iconfont.

When your code is ready, create new Pipeline. In new window name the new action and select mode to *Automatic*. This means that after push to your repository webfont will be generated automatically. You can also select manual mode, but remember that you will have to manually run build after any change. 

Click *Add a new pipeline*. In new window you can add necessary actions. Our pipeline will consist of two actions: generating webfont and transferring result to FTP server. 

**Docker configuration**

Because we use gulp to generating webfont first action that we need is *Node*. In configuration window select newest Node.js version and add two commands in *Execute commands* input:

```
npm install
gulp iconfont
```

![Webfont preview](/_img/gulp-action.png?raw=true)

We also need run one initial command. To add it click *More options* and fill *Setup commands* input with this command:

```
npm install -g gulp
```

Now we can use `gulp` command in our Docker container.

Click *Save this action*. First step is finished. 

**Transfering files to FTP server**

In second action we will transfer all generated files to FTP server. Click on *View & manage actions* section and add new *FTP action*. You can of course use another transfer action to send webfont on your server. We will use FTP, because its configuration is easy and fast.

![Webfont preview](/_img/ftp-action.png?raw=true)

In the opened window select *From a Docker container* mode, because we will need files generated in previous action. Fill *Hostname*, *Login* and *Password* fields and click *More options* link. Fill *Artifacts path* input with `/iconfont/`, because all webfont files are in this directory. We set this path in `gulpfile.js`. In this step you can also set *Remote Path* on your server. At the and click *Test connection & save this action on success* button. If you filled inputs with correct data, action should be added successfully.

**Test your Pipeline**

To test your first pipeline click on it, and click *Run pipeline* in side menu. Buddy will create new Docker container, make webfont from svg files and transfer it to FTP server. When pipeline will be finished go to your website and check results. All glyphs preview is in generated `index.html` file. You should see similar page when you open it:

![Webfont preview](/_img/webfont-preview.png?raw=true)

**How I can use generated webfont in my website**

To use generated webfont you need only include `iconfont.css` on your website. Paste this code to `<head>` section:

```html
<link rel="stylesheet" href="iconfont.css">
```

Now you can use custom glyphs in HTML, eg. `<i class="icon-zoo"></i>` or in CSS: `content: '\ea09';`. Remember to use correct paths to CSS file and webfont files. 

Now, if you need new icon on website, you should only put new SVG file to `iconfont-src/scr` directory. Buddy will do dirty job for you.