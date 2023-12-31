const { src, dest, watch, parallel, series, task } = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const sourcemap = require("gulp-sourcemaps");
const clean = require("gulp-clean");
const imagemin = require("gulp-imagemin");
const avif = require("gulp-avif");
const webp = require("gulp-webp");
const cached = require("gulp-cached");

function watching() {
	series(
		cleanDist,
		buildAssets(),
		imgSquashAvif,
		buildStyles(),
		buildScripts(),
		buildMarkups,
		reloadPageOnAnyChanges
	)();

	watch(["app/scss/*.scss"], buildStyles(true));
	watch(["app/js/*.js"], buildScripts(true));
	watch(["app/assets/**/*"], buildAssets);
	watch(["app/**/*.html"], buildMarkups);
	watch(["app/**/*.html"]).on("change", browserSync.reload);
}

function buildStyles(watch = false) {
	return function buildStyles() {
		const task = src(["app/scss/*.scss"])
			.pipe(concat("style.min.css"))
			.pipe(sourcemap.init())
			.pipe(
				scss({ outputStyle: "compressed" }).on("error", scss.logError)
			)
			.pipe(
				autoprefixer({
					overrideBrowserslist: ["last 4 versions"],
				})
			)
			.pipe(sourcemap.write())
			.pipe(dest("dist/css"));

		if (watch) {
			task.pipe(browserSync.stream());
		}

		return task;
	};
}

function buildScripts(watch = false) {
	return function buildScripts() {
		const task = src([
			// "app/js/visual-tasks.js",
			"./node_modules/three/build/three.js",
			"./node_modules/@photo-sphere-viewer/core/index.js",
			"./node_modules/@photo-sphere-viewer/autorotate-plugin/index.js",
			"app/js/main.js",
		])
			.pipe(concat("main.js"))
			.pipe(uglify())
			.pipe(dest("dist/js/"));

		if (watch) task.pipe(browserSync.stream());

		return task;
	};
}

function build(done) {
	return series(
		cleanDist,
		buildAssets(),
		imgSquash,
		buildStyles(),
		buildScripts(),
		buildMarkups
	)(done());
}

function buildAssets(watch = false) {
	return function buildAssets() {
		const task = src(
			[
				"app/assets/fonts/**/*.{ttf, woff, woff2}",
				"app/assets/images/**/*.{png,jpg,svg}",
				"app/assets/images/**/*.{png,jpg,svg}",
				"app/assets/images/*.{png,jpg,svg}",
			],
			{ base: "app" }
		).pipe(dest("dist"));

		if (watch) task.pipe(browserSync.stream());
		return task;
	};
}
function buildMarkups() {
	return src(["app/**/*.html"], { base: "app" }).pipe(dest("dist"));
}

function cleanDist() {
	return src("dist", { allowEmpty: true }).pipe(clean());
}

function imgSquash() {
	return src(["dist/assets/images/**/*.*", "!dist/assets/images/**/*.svg"])
		.pipe(avif())

		.pipe(src("dist/assets/images/**/*.*"))
		.pipe(
			webp({
				qaulity: 70,
			})
		)

		.pipe(src("dist/assets/images/**/*.*"))
		.pipe(imagemin())

		.pipe(dest("dist/assets/images"));
}

function imgSquashAvif() {
	return src(["dist/assets/images/**/*.*", "!dist/assets/images/**/*.svg"])
		.pipe(avif())
		.pipe(dest("dist/assets/images"));
}

function reloadPageOnAnyChanges() {
	browserSync.init({
		server: {
			baseDir: "dist/",
		},
	});
}
exports.cleanDist = cleanDist;
exports.build = build;
exports.img = imgSquash;

exports.default = watching;
