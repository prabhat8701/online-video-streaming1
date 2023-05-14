
var slider;
var titleCont;

var firstLoad = false

if (localStorage.ljson == null) {
    console.log("No local JSON found, loading example")
    firstLoad = true

} else {

    console.log("Found local Data")
    data = JSON.parse(localStorage.ljson)[localStorage.current]
}

$(document).ready(function() {
    if (firstLoad) {
        $("#exampleModal").modal('show');
    }

    header = data['header']
    console.log(header)

    window.data = data

    td = data["series"]
    td = td.concat(data["movies"])

    if (firstLoad){
        rand = 7
    }
    else {
        var rand = Math.floor((new Date()).getTime() / 100000) % td.length
    }
    var sliderTitle = td[rand]
    console.log(sliderTitle)
    slider = new Vue({
        el: "#vue_slider",
        data: {
            title: sliderTitle,
        },
        methods: {
            getBackgroundStyle: function(str) {
                return "background-image:url(" + header + str + ");"
            },
            getType: function() {
                if (this.title.hasOwnProperty("main_id")) {
                    return "Film"
                } else {
                    return "TV Show"
                }
            },
            getColor: function(rating) {
                if (rating > 6) {
                    return "green"
                }
                return "red"
            },
            getAddress: function() {
                if (this.title.hasOwnProperty("id")) {
                    return "view.html?id=" + this.title["id"]
                } else {
                    return "view.html?id=" + this.title["title"]
                }
            }
        }
    })

    titleCont = new Vue({
        el: "#pannelCont",
        data: {
            titles: data["series"],
            header: "TV Shows"
        },
        methods: {
            addheader: function(str) {
                return header + str
            },
            getColor: function(rating) {
                if (rating > 6) {
                    return "green"
                }
                return "red"
            },
            getaddress: function(obj) {
                if (obj.hasOwnProperty("id")) {
                    return "view.html?id=" + obj["id"]
                } else {
                    return "view.html?id=" + obj["title"]
                }
            }
        }
    })
})


$(".men_item").on('click', function() {
    $(".men_item").removeClass("current-menu-item")
    $(this).addClass("current-menu-item")
    if ($(this).find("a").text().replace(/\s/g, '') == "Movies") {
        titleCont.titles = data["movies"]
        titleCont.header = "Movies"
    } else {
        titleCont.titles = data["series"]
        titleCont.header = "TV Shows"
    }

})

$(".genre_button").on("click", function() {
    $(".genre_button").removeClass("active")
    $(this).addClass("active")
    var genre = $(this).find("h6").text().replace(/\s/g, '')
    var list = []
    for (var i = 0; i < data["movies"].length; i++) {
        if (data["movies"][i]["genres"].indexOf(genre) >= 0) {
            list.push(data["movies"][i])
        }
    }
    for (var i = 0; i < data["series"].length; i++) {
        if (data["series"][i]["genres"].indexOf(genre) >= 0) {
            list.push(data["series"][i])
        }
    }
    titleCont.header = genre
    titleCont.titles = list

})

function search(query, movies, series, genre, minRating, maxRating) {
    list = []
    //get all matching movies
    if (movies) {
        for (i = 0; i < data["movies"].length; i++) {
            if (data["movies"][i]["rating"] > minRating && data["movies"][i]["rating"] < maxRating) {
                if (genre == "0") {
                    list.push(data["movies"][i])
                } else if (data["movies"][i]['genres'].indexOf(genre) >= 0) {
                    list.push(data["movies"][i])
                }
            }
        }
    }
    //get all matching series
    if (series) {
        for (i = 0; i < data["series"].length; i++) {
            if (data["series"][i]["rating"] > minRating && data["series"][i]["rating"] < maxRating) {
                if (genre == "0") {
                    list.push(data["series"][i])
                } else if (data["series"][i]['genres'].indexOf(genre) >= 0) {
                    list.push(data["series"][i])
                }
            }
        }
    }
    //rank by number of occurances of each individual word
    var obj = {}
    var nquery = query.toLowerCase()
    nquery = nquery.replace(",", "")
    nquery = nquery.replace(" the ", " ")
    nquery = nquery.replace(" of ", " ")
    nquery = nquery.replace(" and ", " ")
    nquery = nquery.replace(" a ", " ")
    nquery = nquery.replace(" to ", " ")
    nquery = nquery.replace(" on ", " ")
    nquery = nquery.replace("the ", "")

    var querylist = nquery.split(' ')

    for (i = 0; i < list.length; i++) {
        rank = 0
        main = list[i]
        for (j = 0; j < querylist.length; j++) {
            rank += count(main["title"].toLowerCase(), querylist[j])
            rank += count(main["description"].toLowerCase(), querylist[j])
        }
        obj[i] = {
            "title": main,
            "rank": rank
        }

    }
    //convert list
    console.log(obj)
    nlist = []
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key].rank == 0) {
                delete obj[key]
            } else {
                nlist.push(obj[key])
            }

        }
    }

    //sort by rank
    nlist.sort(compare)
    nalist = []
    for (var i = 0; i < nlist.length; i++) {
        nalist[i] = nlist[i]["title"]
    }
    //display
    titleCont.header = query
    titleCont.titles = nalist
    var url = new URL(window.location.href)
    $(window).scrollTo($("#pannelCont"), 800)

}

function compare(a, b) {
    if (a.rank < b.rank)
        return 1;
    if (a.rank > b.rank)
        return -1;
    return 0;
}

function count(main_str, sub_str) {
    main_str += '';
    sub_str += '';

    if (sub_str.length <= 0) {
        return main_str.length + 1;
    }

    subStr = sub_str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return (main_str.match(new RegExp(subStr, 'gi')) || []).length;
}

function getSearchPrams() {
    var genre = $("#genreSearch option:selected").text()
    if (genre == "All Genres") {
        genre = "0"
    }
    range = $(".range-example-rating-input").val()
    range = range.split(',')
    range[0] = parseInt(range[0])
    range[1] = parseInt(range[1])
    if (range[0] <= range[1]) {
        minR = range[0]
        maxR = range[1]
    } else {
        minR = range[1]
        maxR = range[0]
    }
    search($("#searchBar").val(), $("#movies-type").attr("checked") == "checked", $("#tv-type").attr("checked") == "checked", genre, minR, maxR)
}

$("#searchButton").on("click", function() {
    getSearchPrams()
})
$("#searchBar").keyup(function(event) {
    if (event.keyCode === 13) {
        getSearchPrams();
    }
});

$("#mobileSearch").keyup(function(event) {
    if (event.keyCode === 13) {
        search($("#mobileSearch").val(), true, true, "0", 0, 10)
    }
});

var url = new URL(window.location.href)
if (url.searchParams.get("search") == "true") {
    //query, movies, series, genre, minRating, maxRating
    var queryt = url.searchParams.get("query")

    var moviest = (url.searchParams.get("movies") == "true")
    var seriest = (url.searchParams.get("series") == "true")

    var genret = url.searchParams.get("genre")

    var minRatingt = parseInt(url.searchParams.get("minRating"))
    var maxRatingt = parseInt(url.searchParams.get("maxRating"))
    search(queryt, moviest, seriest, genret, minRatingt, maxRatingt)
}

if (url.searchParams.get("search") == "false") {
    $(document).ready(function() {
        $(".men_item").removeClass("current-menu-item")
        $(".movie_menu_item").addClass("current-menu-item")
        titleCont.titles = data["movies"]
        titleCont.header = "Movies"
    })

}

$(".fa-cogs").on('click', function() {
    $("#exampleModal").modal('show');
})

$("#saveChange").on('click', function() {
    loadJSON();
})

function loadJSON() {
    console.log("Saving Chanes")
    localStorage.removeItem("ljson")
    var file = $("#inputGroupFile01").get(0).files[0]
    if(!file) {
        console.log("No file Found")
        return
    }
    fr = new FileReader();
    fr.onload = recievedText;
    fr.readAsText(file)

    function recievedText(e) {
        lines = e.target.result;
        localStorage.ljson = JSON.stringify({
            "default": JSON.parse(lines)
        })
        localStorage.current = "default"
        location.reload()

    }
}
