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
	// caption: "Parc national du Mercantour <b>&copy; Damien Sorel</b>",
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

// intro animation for virtual tour viewer
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

// constant data of marked places not to repeat in layout
const mapCities = [
	{
		style: "--diagonal-deg: 20deg;",
		elementClass: "df__btn",
		btnSymbolValue: "M1",
		btnTextValue: "Apartments",
		yCoordinate: 192,
		xCoordiante: 986,
		image: "1.png",
	},

	{
		style: "--diagonal-deg: -20deg;",
		elementClass: "df__btn",
		btnSymbolValue: "P1",
		btnTextValue: "Park",
		yCoordinate: 497,
		xCoordiante: 655,
		image: "2.png",
	},
	{
		style: "--diagonal-deg: -26deg;",
		elementClass: "df__btn",
		btnSymbolValue: "M2",
		btnTextValue: "Mantions",
		yCoordinate: 542,
		xCoordiante: 229,
		image: "4.png",
	},
	{
		style: "--diagonal-deg: -30deg;",
		elementClass: "df__btn",
		btnSymbolValue: "R2",
		btnTextValue: "Road",
		yCoordinate: 680,
		xCoordiante: 1199,
		image: "3.png",
	},
];

const mainMapContainer = document.querySelector("#marked-places");
const tourCloser = document.querySelector("#tour__closer");
const contactCloser = document.querySelector("#contact__closer");

let mainMapCitiesBtns = "";

mapCities.forEach((item) => {
	const percentageCoordinates = convertToPercentage(
		item.xCoordiante,
		item.yCoordinate
	);

	mainMapCitiesBtns += `
		<button style="position:absolute;left: ${percentageCoordinates.x}%;top: ${percentageCoordinates.y}%;${item.style}" class="tour-container__opener df__btn">
			<div class="btn__symbol">
				${item.btnSymbolValue}
			</div>
			<div class="btn__text">
				${item.btnTextValue}
			</div>
		</button>
	`;
});

// merging the buttons into mainMapContainer
mainMapContainer.innerHTML += mainMapCitiesBtns;

// after mergine getting all buttons to open invidual 360 picture with button
const markedPlacesButtons = document.querySelectorAll(
	".tour-container__opener"
);
const contactOpenner = document.querySelector("#tour__download");

markedPlacesButtons.forEach((el, idx) => {
	el.addEventListener("click", () => {
		viewer.setPanorama(baseUrl + mapCities[idx].image);
		animateContainer(".tour-container", 0.5, 1, 1, "auto");
		animateContainer("#modal", 0.2, 1, 1, "auto", {
			background: "#00000099",
			backdropFilter: "none",
			pointerEvents: "auto",
			zIndex: 100,
		});
		autorotate.stop();
	});
});

tourCloser.addEventListener("click", () => {
	animateContainer(".tour-container", 1, 0, 0.8, "none");
	animateContainer("#modal", 0.4, 0, 1, "none");
	viewer.zoom(0);
});

contactCloser.addEventListener("click", () => {
	animateContainer(".contact-container", 1, 0, 0.8, "none");
	animateContainer("#modal", 0.4, 0, 1, "none");
});

contactOpenner.addEventListener("click", () => {
	animateContainer(".contact-container", 0.5, 1, 1, "auto");

	animateContainer("#modal", 0.4, 1, 1, "auto", {
		zIndex: 999,
		background: "rgba(0, 0, 0, 1)",
		backdropFilter: "blur(10px)",
	});
});

// convetor of x and y coordinates of marked places buttons
function convertToPercentage(
	markerX,
	markerY,
	stickImageClass = ".main-city__picture"
) {
	var image = document.querySelector(stickImageClass);
	var imageWidth = image.offsetWidth;
	var imageHeight = image.offsetHeight;

	var percentX = (markerX / imageWidth) * 100;
	var percentY = (markerY / imageHeight) * 100;

	return { x: percentX, y: percentY };
}

function animateContainer(
	containerSelector,
	duration = 2,
	opacity = 1,
	scale = 1,
	pointerEvents = "auto",
	customProperties = {}
) {
	gsap.to(containerSelector, {
		duration: duration,
		opacity: opacity,
		scale: scale,
		pointerEvents: pointerEvents,
		...customProperties,
	});
}

// function written to get new x and y coordinates in px unit

// function printMousePos(event) {
// 	console.log("clientX: " + event.clientX + " - clientY: " + event.clientY);
// }
// document.addEventListener("click", printMousePos);
