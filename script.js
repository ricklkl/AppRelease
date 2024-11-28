var releases = [{
        "releaseNumber": "1.0",
        "releaseDate": "28 novembre 2024",
        "items": [{
                "type": "new",
                "title": "Ajout de la commande automatique",
                "description": "Possibilité de configurer des commandes automatiques pour l'ouverture et la fermeture des volets en fonction de l'heure."
            },
            {
                "type": "updated",
                "title": "Amélioration de la gestion des groupes de volets",
                "description": "Ajout de nouvelles options pour gérer plusieurs groupes de volets à partir d'une interface unique."
            },
            {
                "type": "fixed",
                "title": "Correction de la synchronisation des volets",
                "description": "Résolution d'un problème qui empêchait certains volets de se synchroniser correctement avec l'application."
            },
            {
                "type": "updated",
                "title": "Amélioration des notifications d'état",
                "description": "Les notifications sur l'état des volets (ouverts, fermés, en cours de mouvement) sont maintenant plus détaillées."
            },
            {
                "type": "removed",
                "title": "Suppression de la fonctionnalité d'import manuel des volets",
                "description": "La fonction d'import manuel a été remplacée par une synchronisation automatique avec la base de données."
            }
        ]
    },
    {
        "releaseNumber": "1.1",
        "releaseDate": "15 décembre 2024",
        "items": [{
                "type": "new",
                "title": "Intégration avec les capteurs météo",
                "description": "Les volets peuvent maintenant être programmés pour réagir aux conditions météorologiques comme le vent ou la pluie."
            },
            {
                "type": "updated",
                "title": "Interface utilisateur simplifiée",
                "description": "Refonte de l'interface pour rendre la navigation plus intuitive et rapide."
            },
            {
                "type": "fixed",
                "title": "Bug d'affichage des commandes planifiées",
                "description": "Résolution d'un problème où certaines commandes planifiées n'étaient pas affichées correctement dans l'historique."
            },
            {
                "type": "new",
                "title": "Ajout de rapports d'utilisation",
                "description": "Possibilité de générer des rapports sur l'utilisation des volets pour analyse."
            }
        ]
    }
]

// Get elements from the document
var module = $('#release-notes');
$('#search-sec').hide();
$('.border-translucent-white').mouseenter(function() {
    $('#search-sec').stop().slideToggle(1000);
});

// Create elements
function sectionBuilder(release) {
    var build = '';
    build += '<section class="release-note position-relative container-new py-6 px-3 text-left">';
    build += '<header class="timeline-decorator d-flex flex-items-center mb-3">';
    build += '<span class="version-badge d-inline-block bg-purple p-1 rounded-1 mr-2 text-bold">v' + release.releaseNumber + '</span>';
    build += '<h2 class="f3-light css-truncate css-truncate-target">' + release.releaseDate + '</h2>';
    build += '</header>';
    build += '<ul class="list-style-none change-log">';
    build += itemBuilder(release.items);
    build += '</ul>';
    build += '</section>';
    return build;
}

function itemBuilder(items) {
    items.sort(function(a, b) {
        if (a.title < b.title) {
            return -1;
        }
        if (a.title > b.title) {
            return 1;
        }
        return 0;
    });
    var build = '';
    $.each(items, function(i, v) {
        if (v.type === "new") {
            build += typeBuilder(v);
        }
    });
    $.each(items, function(i, v) {
        if (v.type === "updated") {
            build += typeBuilder(v);
        }
    });
    $.each(items, function(i, v) {
        if (v.type === "fixed") {
            build += typeBuilder(v);
        }
    });
    $.each(items, function(i, v) {
        if (v.type === "removed") {
            build += typeBuilder(v);
        }
    });
    return build;
}

function typeBuilder(item) {
    var build = '';
    build += '<li class="d-flex flex-items-start mb-2">';
    build += '<div class="change-badge change-badge-' + item.type + '">' + item.type + '</div>';
    build += '<div class="change-description"><strong>' + item.title + '</strong> - ' + item.description + '</div>';
    build += '</li>';
    return build;
}
// Bind Events

// Do work
function domBuilder(releases) {
    // var newItems;
    // var updates;
    // var removals;
    releases.sort(function(a, b) {
        var x = a.releaseNumber,
            y = b.releaseNumber;
        return x - y;
    });
    releases.reverse();
    var timeline = '';
    $.each(releases, function(i, v) {
        timeline += sectionBuilder(v);
    });
    module.html(timeline);
}
domBuilder(releases);

// Core Search Function
function searchEng() {
    var array = JSON.parse(JSON.stringify(releases));
    var searchField = $.trim($('#search').val());
    if (searchField === '') {
        domBuilder(releases);
    } else {
        var caseExp = new RegExp(searchField, "i");
        // get data from json file
        var results = [];
        $.each(array, function(ri, rv) {
            var items = [];
            var rele = {};
            $.each(rv.items, function(ii, iv) {
                if ((iv.title.search(caseExp) !== -1) || (iv.description.search(caseExp) !== -1)) {
                    items.push(iv);
                }
            });
            if (items.length > 0) {
                rele = rv;
                rele.items = items;
                results.push(rele);
            }
        });
        if (results.length > 0) {
            domBuilder(results);
        } else {
            var noResult = '<section class="release-note position-relative container-new py-6 px-3 text-left"><header class="timeline-decorator d-flex flex-items-center mb-3"><span class="version-badge d-inline-block bg-purple p-1 rounded-1 mr-2 text-bold">Oops!</span><h2 class="f3-light css-truncate css-truncate-target">We couldn\'t find any release notes for that.</h2></header>'
            $('#release-notes').html(noResult);
        }
    }
    return;
}

$('#searchButton').click(searchEng);
// Search by key press
$('#search').keypress(function(e) {
    if (e.which === 13) {
        searchEng();
        return false;
    }
});