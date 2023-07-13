const baseUrl = "assets/images/360/";

const animatedValues = {
	pitch: { start: -Math.PI / 2, end: 0.2 },
	yaw: { start: Math.PI, end: 0 },
	zoom: { start: 0, end: 50 },
	fisheye: { start: 2, end: 0 },
};
const viewer = new PhotoSphereViewer.Viewer({
	container: "viewer",
	panorama: baseUrl + "2.png",
	caption: "Parc national du Mercantour <b>&copy; Damien Sorel</b>",
	loadingImg: baseUrl + "2.png",
	touchmoveTwoFingers: false,
	mousewheelCtrlKey: false,
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
				autostartDelay: null,
				autostartOnIdle: false,
				autorotatePitch: animatedValues.pitch.end,
			},
		],
	],
});

viewer.addEventListener("dblclick", ({ data }) => {
	viewer.animate({
		yaw: data.yaw,
		pitch: data.pitch,
		zoom: 100,
		speed: 1000,
	});
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

const mapCities = [
	{
		style: "--diagonal-deg: 140deg;",
		elementClass: "diagonal__btn",
		btnSymbolValue: "M1",
		btnTextValue: "Apartments",
		yCoordinate: "192px",
		xCoordiante: "986px",
		image: "test3.jpg",
	},

	{
		style: "--diagonal-deg: 140deg;",
		elementClass: "diagonal__btn",
		btnSymbolValue: "P1",
		btnTextValue: "Park",
		yCoordinate: "497px",
		xCoordiante: "655px",
		image: "test3.jpg",
	},
	{
		style: "--diagonal-deg: 140deg;",
		elementClass: "diagonal__btn",
		btnSymbolValue: "M2",
		btnTextValue: "Mantions",
		yCoordinate: "542px",
		xCoordiante: "229px",
		image: "test3.jpg",
	},
	{
		style: "--diagonal-deg: 140deg;",
		elementClass: "diagonal__btn",
		btnSymbolValue: "R2",
		btnTextValue: "Road",
		yCoordinate: "680px",
		xCoordiante: "1199px",
		image: "2.png",
	},
];

const mainMapContainer = document.querySelector("#picked-places");
const tourCloser = document.querySelector("#tour__closer");
const contactCloser = document.querySelector("#contact__closer");
let mainMapCitiesBtns = "";

mapCities.forEach((item) => {
	mainMapCitiesBtns += `
		<button style="position:absolute;--diagonal-deg: 140deg;transform:translate(${item.xCoordiante}, ${item.yCoordinate})" class="tour-container__opener diagonal__btn">
			<div class="btn__symbol">
				${item.btnSymbolValue}
			</div>
			<div class="btn__text">
				${item.btnTextValue}
			</div>
		</button>
	`;
});
mainMapContainer.innerHTML += mainMapCitiesBtns;

document.querySelector(".diagonal__btn").addEventListener("click", (event) => {
	event.preventDefault();
});

document.querySelectorAll(".tour-container__opener").forEach((el, idx) => {
	el.addEventListener("click", () => {
		const comparing =
			viewer.config.panorama !== baseUrl + mapCities[idx].image;
		if (comparing) {
			viewer.setPanorama(baseUrl + mapCities[idx].image);
		}

		gsap.to(".tour-container", {
			duration: 0.5,
			opacity: 1,
			scale: 1,
			pointerEvents: "auto",
		});
		gsap.to("#modal", {
			duration: 0.2,
			opacity: 1,
			background: "#00000099",
			backdropFilter: "none",
			pointerEvents: "auto",
			zIndex: 100,
		});
		autorotate.stop();
	});
});

function printMousePos(event) {
	console.log("clientX: " + event.clientX + " - clientY: " + event.clientY);
}

tourCloser.addEventListener("click", () => {
	gsap.to(".tour-container", {
		duration: 1,
		opacity: 0,
		scale: 0.8,
		pointerEvents: "none",
	});
	gsap.to("#modal", {
		duration: 0.4,
		opacity: 0,
		pointerEvents: "none",
	});
});
contactCloser.addEventListener("click", () => {
	gsap.to(".contact-container", {
		duration: 1,
		opacity: 0,
		scale: 0.8,
		pointerEvents: "none",
	});
	gsap.to("#modal", {
		duration: 0.4,
		opacity: 0,
		pointerEvents: "none",
	});
});

document.addEventListener("click", printMousePos);
