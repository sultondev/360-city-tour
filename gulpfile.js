const { src, dest, watch, parallel, series } = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const sourcemap = require("gulp-sourcemaps");
const clean = require("gulp-clean");
function watching() {
	watch(["app/scss/*.scss"], buildStyles);
	watch(["app/js/*.js"], buildScriptes);
	watch(["app/*.html", "app/pages/*.html"]).on("change", browserSync.reload);
}

function buildStyles() {
	return src([
		"app/scss/*.scss",
	])
		.pipe(concat("style.min.css"))
		.pipe(sourcemap.init())
		.pipe(scss({ outputStyle: "compressed" }).on("error", scss.logError))
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 4 versions"],
			})
		)
		.pipe(sourcemap.write())
		.pipe(dest("app/css"))
		.pipe(browserSync.stream());
}

function buildScriptes() {
	return src(["app/js/*.js"], { ignore: "app/js/main.min.{js}" })
		.pipe(concat("main.min.js"))
		.pipe(uglify())
		.pipe(dest("app/js/minified"))
		.pipe(browserSync.stream());
}

function build() {
	return src(
		[	
			"app/assets/fonts/**/*.{ttf, woff, woff2}",
			"app/assets/images/**/*.{png,jpg,svg}",
			"app/assets/images/*.{png,jpg,svg}",
			"app/css/style.min.css",
			"app/js/minified/main.min.js",
			"app/**/*.html",
		],
		{ base: "app" }
	).pipe(dest("dist"));
}

function cleanDist() {
	return src("dist").pipe(clean());
}

function reloadPageOnAnyChanges() {
	browserSync.init({
		server: {
			baseDir: "app/",
		},
	});
}

exports.buildStyles = buildStyles;
exports.buildScriptes = buildScriptes;
exports.watching = watching;
exports.reloadPageOnAnyChanges = reloadPageOnAnyChanges;

exports.cleanDist = cleanDist;
exports.build = series(cleanDist, build);
exports.default = parallel(reloadPageOnAnyChanges, watching);
