(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('@photo-sphere-viewer/core')) :
	typeof define === 'function' && define.amd ? define(['@photo-sphere-viewer/core'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PhotoSphereViewer));
})(this, (function (PhotoSphereViewer) { 'use strict';

	const a = "wassup";

	const baseUrl = "https://photo-sphere-viewer-data.netlify.app/assets/";

	const animatedValues = {
		pitch: { start: -Math.PI / 2, end: 0.2 },
		yaw: { start: Math.PI, end: 0 },
		zoom: { start: 0, end: 50 },
		fisheye: { start: 2, end: 0 },
	};

	const viewer = new PhotoSphereViewer.Viewer({
		container: "viewer",
		panorama: baseUrl + "sphere.jpg",
		caption: "Parc national du Mercantour <b>&copy; Damien Sorel</b>",
		defaultPitch: animatedValues.pitch.start,
		defaultYaw: animatedValues.yaw.start,
		defaultZoomLvl: animatedValues.zoom.start,
		fisheye: animatedValues.fisheye.start,
		navbar: [
			"autorotate",
			"zoom",
			{
				title: "Rerun animation",
				content: "🔄",
				onClick: intro,
			},
			"caption",
			"fullscreen",
		],
		plugins: [
			[
				PhotoSphereViewer.AutorotatePlugin,
				{
					autorotatePitch: "5deg",
				},
			],
		],
	});

	const autorotate = viewer.getPlugin(PhotoSphereViewer.AutorotatePlugin);

	viewer.addEventListener("ready", intro, { once: true });

	function intro() {
		autorotate.stop();

		new PhotoSphereViewer.utils.Animation({
			properties: animatedValues,
			duration: 2500,
			easing: "inOutQuad",
			onTick: (properties) => {
				viewer.setOption("fisheye", properties.fisheye);
				viewer.rotate({ yaw: properties.yaw, pitch: properties.pitch });
				viewer.zoom(properties.zoom);
			},
		}).then(() => {
			autorotate.start();
		});
	}

	viewer?.addEventListener("dblclick", ({ data }) => {
		viewer.animate({
			yaw: data.yaw,
			pitch: data.pitch,
			zoom: 100,
			speed: 1000,
		});
	});
	console.log("hell sdsdsso wosdsrld2");

	console.log(a);
	console.log(a);
	console.log(a);
	console.log(a);
	console.log(a);
	console.log(a);
	console.log(a);

}));
//# sourceMappingURL=main.js.map
