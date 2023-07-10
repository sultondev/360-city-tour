import mapCities from './constants'

const baseUrl = "./../assets/images/360/";

const animatedValues = {
	pitch: { start: -Math.PI / 2, end: 0.2 },
	yaw: { start: Math.PI, end: 0 },
	zoom: { start: 0, end: 50 },
	fisheye: { start: 2, end: 0 },
};

let viewer = null;

function init() {
	viewer = new PhotoSphereViewer.Viewer({
		container: "viewer",
		panorama: baseUrl + "2.png",
		caption: "Parc national du Mercantour <b>&copy; Damien Sorel</b>",
		loadingImg: baseUrl + "loader.gif",
		touchmoveTwoFingers: true,
		mousewheelCtrlKey: true,
	});
}
viewer.addEventListener("dblclick", ({ data }) => {
	viewer.animate({
		yaw: data.yaw,
		pitch: data.pitch,
		zoom: 100,
		speed: 1000,
	});
});

const mainMapPicture = document.querySelector(".main-city");
console.log(mapCities)
document.querySelector(".diagonal__btn").addEventListener("click", (event) => {
	event.preventDefault();
	document.querySelector("#viewer").target.style = "z-index:100;";
	init();
});

// mainMapPicture.addEventListener("click", (event) => {
// 	var x = (event.clientX / window.innerWidth) * 100;
// 	var y = (event.clientY / window.innerHeight) * 100;

// 	console.log("clientX: " + event.clientX + " - clientY: " + event.clientY);
// });

// console.log("clientX: 986 - clientY: 197");
