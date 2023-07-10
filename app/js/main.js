import mapCities from './constants'

const baseUrl = "./../assets/images/360/";

const mapCities = [
    {
        style: '--diagonal-deg: 140deg;',
        elementClass: 'diagonal__btn',
        btnSymbolValue: 'P1',
        btnTextValue: 'Pinthouse',
		yCoordinate: '192px',
		xCoordiante: '986px'
    }
] 



let viewer = null;

function init() {
	viewer = new PhotoSphereViewer.Viewer({
		container: "viewer",
		panorama: baseUrl + "2.png",
		caption: "Parc national du Mercantour <b>&copy; Damien Sorel</b>",
		loadingImg: baseUrl + "loader.gif",
		touchmoveTwoFingers: true,
		mousewheelCtrlKey: true,
		yCoordinate: ''
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

let mainMapCitiesBtns = ''

mapCities.forEach((item) => {
	mainMapCitiesBtns += `
		<button style="--diagonal-deg: 140deg;transform:translate(${item.xCoordiante}, ${item.yCoordinate})" class="diagonal__btn">
		<div class="btn__symbol">
			P1
		</div>
		<div class="btn__text">
			dwa
		</div>
		</button>
	`
})

mainMapPicture.innerHTML += mainMapCitiesBtns;

// mainMapPicture.addEventListener("click", (event) => {
// 	var x = (event.clientX / window.innerWidth) * 100;
// 	var y = (event.clientY / window.innerHeight) * 100;

// 	console.log("clientX: " + event.clientX + " - clientY: " + event.clientY);
// });

// console.log("clientX: 986 - clientY: 197");
