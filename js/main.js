/* Animate.css extension*/
$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };
      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));
    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  },
});

/*Another helper function for the intervals*/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var max_concepts = 100; //How many wiki titles we get from the Wikipedia API
var req_url = "http://es.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit=" + max_concepts; //Url for wiki api
var quantum = 10000; //10sec
var concept_data;
var image_data;
var stop_search = false;

//Returns wikipedia api data
async function getConcepts(callback){
	axios.post('/getPostedUrl.php', {
		enlace : req_url
	}).then(function (response) {
		console.log(response);
		concept_data = response.data;
		callback();
	}).catch(function (error) {
		console.log(error);
		concept_data = "Error";
		callback();
	});
}

//Get image from wikimedia id
async function getImage(id, callback){
	axios.post('/getPostedUrl.php', {
		enlace : "http://es.wikipedia.org/w/api.php?action=query&prop=info&pageids=" + id + "&prop=pageimages&format=json&pithumbsize=512"
	}).then(function (response) {
		console.log(response);
		image_data = response.data;
		callback();
	}).catch(function (error) {
		console.log(error);
		image_data = "Error";
		callback();
	});
}

$('#start').click(function(){
	if (!this.classList.contains("disabled")) {
		$("#stop").removeClass("disabled");
		$("#start").addClass("disabled");
		stop_search = false;
		getConcepts(start);
	}
});

$('#stop').click(function(){
	if (!this.classList.contains("disabled")) {
		$("#stop").addClass("disabled");
		$("#start").removeClass("disabled");
		stop();
	}
});

function stop(){
	stop_search = true;
	setConcept("Pulsa Start para empezar");
}
function setConcept(concept){
	document.getElementById("concept").innerHTML = concept;
	$('#concept').animateCss('bounce');
}

function setImage(enlace){
	if (enlace == "na") {
		document.getElementById("image").innerHTML = "";
	}else{
		document.getElementById("image").innerHTML = "<img src=\"" + enlace + "\">";
	}
}

async function start(){	
	if (concept_data == "Error") {
		alert("Error: can't connect to WikiMedia API.");
		stop();
		return;
	}
	var i = 0;
	while(i < max_concepts && !stop_search){
		setConcept(concept_data.query.random[i].title);
		getImage(concept_data.query.random[i].id, hola);
		//Toma callback ahi to bueno
		function hola(){
			if (image_data != "Error") {
				setImage(Object.values(image_data.query.pages)[0].thumbnail.source);
			}else{
				setImage("na");
			}
		}
		await sleep(quantum);
		i++;
		setImage("na");
	}
	if (!stop_search) { getConcepts(start); }
}