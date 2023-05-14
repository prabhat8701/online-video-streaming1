var header = "https://ipfs.io/ipfs/"

var url = new URL(window.location.href)
var id = url.searchParams.get("id")

var j = 0

if (localStorage.ljson == null) {
    console.log("No local JSON found, loading example")
    firstLoad = true
    /*
    localStorage.ljson = JSON.stringify({
        "default": data
    })
    localStorage.current = "default"
    location.reload()
    */


} else {

    console.log("Found local Data")
    data = JSON.parse(localStorage.ljson)[localStorage.current]
}

var main_obj
var type
var titleIndex
var cS
var cE

var sidebar
var ratingBar
var desBox
var seaBox
var epBox
var player


for (var i = 0; i < data["movies"].length; i++) {
    if (data["movies"][i]["imdb_id"] == id) {
        type = "movies"
        titleIndex = i
        defineVueElm();
    }
}

for (var i = 0; i < data["series"].length; i++) {
    if (data["series"][i]["imdb_id"] == id) {
        type = "series"
        titleIndex = i
        cS = data["series"][i]["cS"]
        cE = data["series"][i]["cE"]
        defineVueElm();
    }
}

player = new Plyr("#main_video", {
    ratio : "16:9"
})
player.poster = header + data[type][titleIndex]["wide"]


window.data = data




if (type == "series") {
    $("#trailer_Button").hide()

    $($(".seasonButton").get(cS)).addClass("current")
    $($(".title").get(cE)).css("border", "solid #3FB03F 3px")

    $(".seasonButton").on("click", function() {
        $(".seasonButton").removeClass("current")
        $(this).addClass("current")
        var numS = $(this).attr("data-index")
        seaBox.selectSeason = numS
        epBox.episodes = data[type][titleIndex]["ep_map"][numS]["episodes"]
    })
    $(".episode").on("click", function() {
        numE = $(this).parent().parent().attr("data-index")
        $(".episode").parent().css("border","")
        $(this).parent().css("border", "solid #3FB03F 3px")

        console.log(seaBox)
        ratingBar.title = data[type][titleIndex]["ep_map"][seaBox.selectSeason]["episodes"][numE]["title"]

        cS = seaBox.selectSeason
        cE = numE

        data[type][titleIndex]["cS"] = seaBox.selectSeason
        data[type][titleIndex]["cE"] = numE

        player.source = {
            type: 'video',
            title: data[type][titleIndex]["title"],
            sources: [{
                src: header + data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["id"],
                type: 'video/mp4'
            }]
        }

        $(window).scrollTo({left:0,top:0},800)

        //player.currentTime = ((data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["progress"]/100) * player.duration)
        setTimeout(function(){ player.currentTime = (((data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["progress"]/100) * player.duration)); },300);
    })


    player.source = {
        type: 'video',
        title: data[type][titleIndex]["title"],
        sources: [{
            src: header + data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["id"],
            type: 'video/mp4'
        }]
    }
}
else {
    $("#seriesCont").hide()
    player.source = {
        type: 'video',
        title: data[type][titleIndex]["title"],
        sources: [{
            src: header + data[type][titleIndex]["main_id"],
            type: 'video/mp4'
        }]
    }
}

player.on('ready', event => {
    console.log("video Ready")
    if (type == "series"){
        setTimeout(function(){ player.currentTime = ((data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["progress"]/100.0) * player.duration); },500);
    }
    else if(j % 2 == 0) {
        setTimeout(function(){ player.currentTime = ((data[type][titleIndex]["progress"]/100) * player.duration); },500);
    }
});

function defineVueElm() {
    sideBar = new Vue({
        el: "#content-sidebar-pro",
        data: {
            title: data[type][titleIndex],
            header: header
        }
    })

    var tit

    if(type == "series") {
        tit = data[type][titleIndex]["ep_map"][cS]["episodes"][cE]["title"]
    }

    ratingBar = new Vue({
        el: "#ratingBar",
        data:{
            rating: data[type][titleIndex]["rating"],
            title: tit
        },
        methods: {
            getColor: function(rating) {
                if (rating > 6) {
                    return "green"
                }
                return "red"
            }
        }
    })

    desBox = new Vue({
        el: "#desBox",
        data: {
            description: data[type][titleIndex]["description"]
        }
    })

    if (type == "series"){
        seaBox = new Vue({
            el:"#seasonBox",
            data: {
                sList: data[type][titleIndex]["ep_map"],
                selectSeason: cS
            }
        })
        epBox = new Vue({
            el: "#epBox",
            data:{
                episodes: data[type][titleIndex]["ep_map"][cS]["episodes"],
                header: header
            }
        })
    }
}







$("#trailer_Button").on("click", function() {
    if (j % 2 == 0) {
        player.source = {
            type: 'video',
            title: data[type][titleIndex]["title"],
            sources: [{
                src: header + data[type][titleIndex]["trailer_id"],
                type: 'video/mp4'
            }]
        }

        $("#trailer_Button").html("<i class='fas fa-play'></i>Watch Film")
    } else {
        player.source = {
            type: 'video',
            title: data[type][titleIndex]["title"],
            sources: [{
                src: header + data[type][titleIndex]["main_id"],
                type: 'video/mp4'
            }]
        }

        $("#trailer_Button").html("<i class='fas fa-play'></i>Watch Trailer")
    }
    j++;
})

function navtoLoc(loc, obj){
    str = loc + "?"
    for(key in obj){
        if (obj.hasOwnProperty(key)){
            str = str + key + "=" + obj[key]
            str += "&"
        }
    }
    str = str.slice(0, -1)
    window.location = str
}

function getSearchPrams() {
    var genre = $("#genreSearch option:selected").text()
    if (genre == "All Genres"){
        genre = "0"
    }
    console.log(genre)
    range = $(".range-example-rating-input").val()
    range = range.split(',')
    range[0] = parseInt(range[0])
    range[1] = parseInt(range[1])
    if (range[0] <= range[1]) {
        minR = range[0]
        maxR = range[1]
    }
    else {
        minR = range[1]
        maxR = range[0]
    }
    navtoLoc("index.html",{
        "search":true,
        "query": $("#searchBar").val(),
        "movies": ($("#movies-type").attr("checked") == "checked"),
        "series": ($("#tv-type").attr("checked") == "checked"),
        "genre": genre,
        "minRating": minR,
        "maxRating": maxR
    })
}

$("#searchButton").on("click", function() {
    getSearchPrams()
})
$("#searchBar").keydown(function(event) {
    if (event.keyCode === 13) {
        getSearchPrams();
    }
});

$("#mobileSearch").keydown(function(event) {
    if (event.keyCode === 13) {
        navtoLoc("index.html",{
            "search":true,
            "query": $("#mobileSearch").val(),
            "movies": true,
            "series": true,
            "genre": "0",
            "minRating": 0,
            "maxRating": 10
        })
    }
});

$(".movieButton").on('click', function() {
    navtoLoc("index.html",{"search":false})
})

window.setInterval(function(){
    if(player.playing) {
        if(type == "series") {
            data["series"][titleIndex]["ep_map"][cS]["episodes"][cE]["progress"] = 100 * (player.currentTime/player.duration)
        }
        else if(j % 2 == 0) {
            data["movies"][titleIndex]["progress"] = 100 * (player.currentTime/player.duration)
        }
        localStorage.ljson = JSON.stringify({
            "default": data
        })
    }
}, 2000);
