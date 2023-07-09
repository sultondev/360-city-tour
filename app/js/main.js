const baseUrl = "..//images/360/";

const animatedValues = {
	pitch: { start: -Math.PI / 2, end: 0.2 },
	yaw: { start: Math.PI, end: 0 },
	zoom: { start: 0, end: 50 },
	fisheye: { start: 2, end: 0 },
};

const viewer = new PhotoSphereViewer.Viewer({
	container: "viewer",
	panorama: baseUrl + "test3.jpg",
	caption: "Parc national du Mercantour <b>&copy; Damien Sorel</b>",
	loadingImg: baseUrl + "loader.gif",
	touchmoveTwoFingers: true,
	mousewheelCtrlKey: true,
});

viewer.addEventListener("dblclick", ({ data }) => {
	viewer.animate({
		yaw: data.yaw,
		pitch: data.pitch,
		zoom: 100,
		speed: 1000,
	});
});
console.log("hello world");
