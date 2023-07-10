const { src, dest, watch, parallel, series, task } = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const sourcemap = require("gulp-sourcemaps");
const clean = require("gulp-clean");
const rollup = require("rollup");

async function hotreload() {
	browserSync.reload();
	return Promise.resolve(true);
}

function watching() {
	watch(["app/assets/*"], series(copyAssets, hotreload));
	watch(["app/scss/*.scss"], series(buildStyles, hotreload));
	watch(["app/js/*.js"], series(buildScripts, hotreload));
	watch(["app/*.html", "app/pages/*.html"]).on(
		"change",

		series(buildMarkups, hotreload)
	);
}

function buildStyles() {
	return src(["app/scss/*.scss"])
		.pipe(concat("style.min.css"))
		.pipe(sourcemap.init())
		.pipe(scss({ outputStyle: "compressed" }).on("error", scss.logError))
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 4 versions"],
			})
		)
		.pipe(sourcemap.write())
		.pipe(dest("dist/css"))
		.pipe(browserSync.stream());
}

function buildMarkups() {
	return src(["app/**/*.html"]).pipe(dest("dist"));
}

async function buildScripts() {
	const bundle = await rollup.rollup({
		input: "./app/js/main.js",
	});

	bundle.write({
		file: "./dist/js/main.js",
		format: "umd",
		name: "core-scripts",
		sourcemap: true,
	});
}

function copyAssets() {
	return src(
		[
			"app/assets/fonts/**/*.{ttf, woff, woff2}",
			"app/assets/images/**/*.{png,jpg,svg}",
			"app/assets/images/*.{png,jpg,svg}",
		],
		{ base: "app" }
	).pipe(dest("dist"));
}

function cleanDist() {
	return src("dist", { allowEmpty: true }).pipe(clean());
}

function reloadPageOnAnyChanges() {
	browserSync.init({
		server: {
			baseDir: "dist/",
		},
	});
}

exports.cleanDist = cleanDist;
exports.build = series(
	cleanDist,
	copyAssets,
	buildMarkups,
	buildStyles,
	buildScripts
);
exports.dev = parallel(reloadPageOnAnyChanges, watching);
