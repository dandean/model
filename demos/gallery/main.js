var data = [
  {
    title: "Cranes and Pole",
    year: 2009,
    media: "Archival pigment print",
    size: "40\" x 40\"",
    file: "cranes-and-pole.jpg"
  },
  {
    title: "Saya's Sink",
    year: 2009,
    media: "Archival pigment print",
    size: "40\" x 40\"",
    file: "sayas-sink.jpg"
  },
  {
    title: "Garage Doors",
    year: 2009,
    media: "Archival pigment print",
    size: "40\" x 40\"",
    file: "garage-doors.jpg"
  },
  {
    title: "Green House Gray House",
    year: 2009,
    media: "Archival pigment print",
    size: "40\" x 40\"",
    file: "green-house-gray-house.jpg"
  },
  {
    title: "Cranes and Snow",
    year: 2009,
    media: "Archival pigment print",
    size: "40\" x 40\"",
    file: "cranes-and-snow.jpg"
  },
  {
    title: "Poles with Hedge",
    year: 2009,
    media: "Archival pigment print",
    size: "40\" x 40\"",
    file: "poles-with-hedge.jpg"
  }
];

Number.prototype.constrain = function(min, max) {
  if (this >= min && this <= max) {
    return this;
  } else if (this < min) {
    return min;
  }
  return max;
};

function Application(){
  var root = "http://www.jenniferzwick.com/public/img/photography/bilaterography/",
      state = new (Model.create({ index: Model.None }))(),
      min = 0,
      max = data.length - 1;

  state.subscribe("index", function(value) {
    var item = data[value];
  });
  
  this.view = function(i) {
    i = i.constrain(min, max);
    state.index = i;
    return this;
  };
  
  var list = document.createElement("ul");
  data.forEach(function(item) {
    var li = document.createElement("li");
    var img = li.appendChild(document.createElement("img"));
    img.src = root + item.file;
    list.appendChild(li);
    
    img.addEventListener("click", function(e) {
      var x = Array.prototype.indexOf.call(list.children, e.target.parentNode);
      this.view(x);
    }.bind(this), false);
  }, this);
  document.body.appendChild(list);
  var clone = document.body.appendChild(list.cloneNode(true));
  clone.className = "clone";
}

window.addEventListener("DOMContentLoaded", function() {
  window.app = new Application();
}, false);  
