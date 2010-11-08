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

function Gallery(){
  var root = "http://www.jenniferzwick.com/public/img/photography/bilaterography/",
      state = new (Model.create({ index: Model.None }))(),
      min = 0,
      max = data.length - 1,
      list = document.createElement("ul"),
      info = document.createElement("div");

  document.body.appendChild(info);
  info.id = "info";

  state.subscribe("index", function(value) {
    var item = data[value];
    Array.prototype.forEach.call(list.children, function(child, i) {
      if (i == value) {
        child.className = "active";
      } else {
        child.className = "";
      }
    });
    
    var current = data[value];
    info.innerHTML = "<h1>" + current.title + ", " + current.year  + "</h1>"
      + "<p>by <a href='http://jenniferzwick.com' target='_blank'>Jennifer Zwick</a></p>"
      + "<p>" + current.media + "</p>"
      + "<p>" + current.size + "</p>";
  });
  
  data.forEach(function(item) {
    var li = document.createElement("li");
    var img = li.appendChild(document.createElement("img"));
    img.src = root + item.file;
    list.appendChild(li);
    
    img.addEventListener("click", function(e) {
      var x = Array.prototype.indexOf.call(list.children, e.target.parentNode);
      state.index = x; // !!!
    }.bind(this), false);
  }, this);
  document.body.appendChild(list);
  var clone = list.cloneNode(true);
  clone.id = "clone";
  document.body.appendChild(clone);
  Array.prototype.forEach.call(clone.getElementsByTagName("li"), function(li) {
    li.innerHTML = "";
  });
  
  document.addEventListener("keydown", function(e) {
    if (e.keyIdentifier && e.keyIdentifier.match(/^right|down|left|up$/i)) {
      var next,
          current = state.index;

      if (e.keyIdentifier.match(/^right|down$/i)) {
        next = (current == max) ? 0 : current + 1;

      } else if (e.keyIdentifier.match(/^left|up$/i)) {
        next = (current == 0) ? max : current - 1;
      }

      state.index = next; // !!!
    }
  }.bind(this), false);
  
  // Start the gallery out with the first item.
  setTimeout(function() { state.index = 0; }, 250);
}

window.addEventListener("DOMContentLoaded", function() {
  window.gallery = new Gallery();
}, false);  
