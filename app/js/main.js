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
console.log("hello world");
