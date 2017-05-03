/**
 * Created by xin on 19/04/2017.
 * From an EFOtrait, query solr, parse solr search result and display in page
 */

var SearchState = {
    LOADING: {value: 0},
    NO_RESULTS: {value: 1},
    RESULTS: {value: 2}
};

var EPMC = "http://www.europepmc.org/abstract/MED/";
var OLS  = "http://www.ebi.ac.uk/ols/search?q=";
var ENSVAR = "http://www.ensembl.org/Homo_sapiens/Variation/";
var DBSNP  = "http://www.ncbi.nlm.nih.gov/SNP/snp_ref.cgi?rs=";
var UCSC   = "https://genome.ucsc.edu/cgi-bin/hgTracks?hgFind.matches=";
var ENS_SHARE_LINK = 'Variant_specific_location_link/97NKbgkp09vPRy1xXwnqG1x6KGgQ8s7S';
var CONTEXT_RANGE = 500;

var list_min = 2;
// $(document).ready(function() {
//     if (window.location.pathname.indexOf("beta") != -1) {
//         $('#beta-icon').show();
//     }
//     var searchTerm = $('#query').text();
//     console.log("Loading search module!");
//     console.log("efoTrait: " + searchTerm);
//     if (searchTerm != '') {
//         console.log("Start search for the efotrait " + searchTerm);
//         getEfoTraitData(searchTerm);
//     }
//     //load the data from html tag and render
//     // getVariantInfoFromEnsembl(searchTerm);
// });

// function getEfoTraitData(efotraitId) {
//     console.log("Solr research request received for " + efotraitId);
// //        setState(SearchState.LOADING);
//     $.getJSON('/gwas/api/search/efotrait',
//               {
//                   'q': efotraitId,
//                   'max': 1000
//               })
//             .done(function(data) {
//                 console.log(data);
// $("#hiddenresult").append(newItem(aaaa))
//                 // $("#header ul").append('<li><a href="/user/messages"><span class="tab">Message Center</span></a></li>');
//                 //
//                 // $("#queryresultJsonString").html=JSON.stringify(data, null, 0)
//
// //                    document.write(data);
// //                     document.getElementById("json").innerHTML = JSON.stringify(data, undefined, 2);
// //                    window.open("data:text/json," + encodeURIComponent(JSON.stringify(data, undefined, 2)),
// //                                "_blank");
//                 processEfotraitData(data, efotraitId);
//             });
//     //serilize the data in html tag and save it in a tag for visulization
//     console.log("Solr research done for " + efotraitId);
// }

// // Parse the Solr results and display the data on the HTML page
// function processEfotraitData(data, efotraitId) {
//     // Check if Solr returns some results
//     if (data.grouped.resourcename.matches == 0) {
//         $('#lower_container').html("<h2>The efotrait <em>" + efotraitId +
//                                    "</em> cannot be found in the GWAS Catalog database</h2>");
//     }
//     else {
//         //split the solr search by groups
//         var data_efo;
//         var data_study;
//         var data_association;
//         var data_diseasetrait;
//         var data_facet = data.facet_counts.facet_fields.resourcename;
//
//         $.each(data.grouped.resourcename.groups, function(index, group) {
//             if (group.groupValue == "efotrait") {
//                 data_efo = group.doclist;
//                 console.log(data_efo);
//             }
//             if (group.groupValue == "study") {
//                 data_study = group.doclist;
//                 console.log(data_study);
//             }
//             if (group.groupValue == "association") {
//                 data_association = group.doclist;
//                 console.log(data_association);
//             }
//             if (group.groupValue == "diseasetrait") {
//                 data_diseasetrait = group.doclist;
//                 console.log(data_diseasetrait);
//             }
//         })
//
//         //processing solr search data
//         // Variant summary panel
//         getEfoTraitInfo(data_efo.docs, efotraitId);
//         getSummary(data_study);
//         // External links panel
// //            getLinkButtons(data_facet,efotraitId);
// //            // Associations table
//         getEfotraitAssociations(data_association.docs);
// //            // Studies table
//         getEfotraitStudies(data_study.docs);
// //            // Traits table
// //            getEfotraitDiseasetrait(data_diseasetrait.docs);
// //
// //            //downloads link
// //            setDownloadLink(rsId);
//     }
// }

function getEfoTraitInfo(data, efotraitId) {
    var data_sample = data[0];
    var efotrait_id = efotraitId;
    var efotrait_link = data_sample.traitUri;
    var synonym = data_sample.synonym;
    var efotrait_label = data_sample.label;

    $("#efotrait-id").html(setExternalLink(efotrait_link, efotrait_id));
    $("#efotrait-label").html(efotrait_label);
    if(synonym){
        if (synonym.length > list_min) {
            $("#efotrait-synonym").html(longContentList("gwas_efotrait_synonym_div", synonym, 'synonyms'));
        }
        else {
            $("#efotrait-synonym").html(synonym.join(", "));
        }
    }
}

//xintodo done
function getEfotraitAssociations(data,cleanBeforeInsert) {
    //by default, we clean the table before inserting data
    if (cleanBeforeInsert === undefined) {
        cleanBeforeInsert = true;
    }

    var asso_count = data.length;

    $(".association_count").html(asso_count);

    if (asso_count == 1) {
        $(".association_label").html("Association");
    }

    if(cleanBeforeInsert){
        $("#association-table-body tr").remove();
    }

    $.each(data, function(index,asso) {

        var row = $('<tr/>');

        // Risk allele
        var riskAllele = asso.strongestAllele[0];
        var riskAlleleLabel = riskAllele;
        if (riskAlleleLabel.match(/\w+-.+/)) {
            riskAlleleLabel = riskAllele.split('-').join('-<b>')+'</b>';
        }
        riskAllele = setQueryUrl(riskAllele,riskAlleleLabel);
        row.append(newCell(riskAllele));

        // Risk allele frequency
        var riskAlleleFreq = asso.riskFrequency;
        row.append(newCell(riskAlleleFreq));

        // p-value
        var pValue = asso.pValueMantissa;
        if (pValue) {
            var pValueExp = " x 10<sup>" + asso.pValueExponent + "</sup>";
            pValue += pValueExp;
            if (asso.qualifier) {
                if (asso.qualifier[0].match(/\w/)) {
                    pValue += " " + asso.qualifier.join(',');
                }
            }
            row.append(newCell(pValue));
        } else {
            row.append(newCell('-'));
        }

        // OR
        var orValue = asso.orPerCopyNum;
        if (orValue) {
            if (asso.orDescription) {
                orValue += " " + asso.orDescription;
            }
            row.append(newCell(orValue));
        } else {
            row.append(newCell('-'));
        }

        // Beta
        var beta = asso.betaNum;
        if (beta) {
            if (asso.betaUnit) {
                beta += " " + asso.betaUnit;
            }
            if (asso.betaDirection) {
                beta += " " + asso.betaDirection;
            }
            row.append(newCell(beta));
        } else {
            row.append(newCell('-'));
        }

        // CI
        var ci = (asso.range) ? asso.range : '-';
        row.append(newCell(ci));
        // Reported genes
        var genes = [];
        var reportedGenes = asso.reportedGene;
        if (reportedGenes) {
            $.each(reportedGenes, function(index, gene) {
                genes.push(setQueryUrl(gene));
            });
            row.append(newCell(genes.join(', ')));
        } else {
            row.append(newCell('-'));
        }

        // Reported traits
        var traits = [];
        var reportedTraits = asso.traitName;
        if (reportedTraits) {
            $.each(reportedTraits, function(index, trait) {
                traits.push(setQueryUrl(trait));
            });
            row.append(newCell(traits.join(', ')));
        } else {
            row.append(newCell('-'));
        }

        // Mapped traits
        var mappedTraits = asso.mappedLabel;
        if (mappedTraits) {
            row.append(newCell(mappedTraits.join(', ')));
        } else {
            row.append(newCell('-'));
        }

        // Study
        var author = asso.author_s;
        var publicationDate = asso.publicationDate;
        var pubDate = publicationDate.split("-");
        var pubmedId = asso.pubmedId;
        var study = setQueryUrl(author, author + " - " + pubDate[0]);
        study += '<div><small>'+setExternalLink(EPMC+pubmedId,'PMID:'+pubmedId)+'</small></div>';
        row.append(newCell(study));

        var studyId = asso.studyId;

        // Populate the table
        $("#association-table-body").append(row);
    });
}


//xintodo done
function getEfotraitStudies(data,cleanBeforeInsert) {
    //by default, we clean the table before inserting data
    if (cleanBeforeInsert === undefined) {
        cleanBeforeInsert = true;
    }


    var study_ids = [];
    if(cleanBeforeInsert){
        $("#study-table-body tr").remove();
    }
    $.each(data, function(index, asso) {
        var study_id = asso.id;
        if (jQuery.inArray(study_id, study_ids) == -1) {

            var row = $('<tr/>');

            study_ids.push(study_id);

            // Author
            var author = asso.author_s;
            var publicationDate = asso.publicationDate;
            var pubDate = publicationDate.split("-");
            var pubmedId = asso.pubmedId;
            var study_author = setQueryUrl(author, author);
            study_author += '<div><small>'+setExternalLink(EPMC+pubmedId,'PMID:'+pubmedId)+'</small></div>';
            row.append(newCell(study_author));

            // Publication date
            var p_date = asso.publicationDate;
            var publi = p_date.split('T')[0];
            row.append(newCell(publi));

            // Journal
            row.append(newCell(asso.publication));

            // Title
            row.append(newCell(asso.title));

            // Initial sample desc
            var initial_sample_text = '-';
            if (asso.initialSampleDescription) {
                initial_sample_text = displayArrayAsList(asso.initialSampleDescription.split(', '));
            }
            row.append(newCell(initial_sample_text));

            // Replicate sample desc
            var replicate_sample_text = '-';
            if (asso.replicateSampleDescription) {
                replicate_sample_text = displayArrayAsList(asso.replicateSampleDescription.split(', '));
            }
            row.append(newCell(replicate_sample_text));

            // ancestralGroups
            var ancestral_groups_text = '-';
            if (asso.ancestralGroups) {
                ancestral_groups_text = displayArrayAsList(asso.ancestralGroups);
            }
            row.append(newCell(ancestral_groups_text));

            // Populate the table
            $("#study-table-body").append(row);
        }
    });
    // Study count //
    $(".study_count").html(study_ids.length);

    if (study_ids.length == 1) {
        $(".study_label").html("Study");
    }
}

function getEfotraitDiseasetrait(data) {

    // Fetch data //
    var traits = [];
    var mappedtraits = {};
    var mappedtraitsUri = {};
    var synonymtraits = {};
    var studytraits = {};
    $.each(data, function(index, asso) {
        // Trait
        var trait = asso.traitName_s;
        if (jQuery.inArray(trait, traits) == -1) {
            traits.push(trait);
        }

        // Mapped trait(s)
        mappedtraits[trait] = asso.mappedLabel;
        mappedtraitsUri[trait] = asso.mappedUri;

        // Synonym trait(s)
        synonymtraits[trait] = asso.synonym;

        // Study trait(s)
        var author = asso.study_author;
        var publicationDate = asso.study_publicationDate.split("-");
        var study  = setQueryUrl(author, author + " - " + publicationDate[0]);
            study += setExternalLinkIcon(EPMC + asso.study_pubmedId);
        if (jQuery.inArray(study, studytraits[trait]) == -1) {
            if (!studytraits[trait]) {
                studytraits[trait] = [];
            }
            studytraits[trait].push(study);
        }
    });

    // Display/print data //
    $(".diseasetrait_count").html(traits.length);

    if (traits.length == 1) {
        $(".diseasetrait_label").html("Trait");
    }

    traits.sort();
    $.each(traits, function(index,trait) {

        var row = $('<tr/>');

        // Trait
        row.append(newCell(setQueryUrl(trait)));

        // Mapped trait(s)
        var mappedtrait_html = newCell('-');
        if (mappedtraits[trait]) {
            var mappedtrait = [];
            $.each(mappedtraits[trait], function(index, mtrait) {
                var mapped_html = setQueryUrl(mtrait);
                mapped_html += setExternalLinkIcon(mappedtraitsUri[trait][index]);
                mappedtrait.push(mapped_html);
            });
            mappedtrait.sort();
            if (mappedtrait.length <= list_min) {
                mappedtrait_html = newCell(mappedtrait.join(',<br />'));
            }
            else {
                mappedtrait_html = newCell(longContentList("mapped_traits_div_" + index, mappedtrait, 'mapped traits'));
            }
        }
        row.append(mappedtrait_html);

        // Synonym trait(s)
        var synonym_html = newCell('-');
        if (synonymtraits[trait]) {
            var synonymtrait = [];
            $.each(synonymtraits[trait], function(i, syntrait) {
                synonymtrait.push(setQueryUrl(syntrait));
            });
            synonymtrait.sort();
            if (synonymtrait.length <= list_min) {
                synonym_html = newCell(synonymtrait.join(',<br />'));
            }
            else {
                synonym_html = newCell(longContentList("syn_traits_div_" + index, synonymtrait, 'synonym traits'));
            }
        }
        row.append(synonym_html);

        // Study trait(s)
        var studytrait_html = newCell('-');
        if (studytraits[trait]) {
            if (studytraits[trait].length <= list_min) {
                studytrait_html = newCell(studytraits[trait].join(',<br />'));
            }
            else {
                studytrait_html = newCell(longContentList("study_traits_div_" + index, studytraits[trait], 'study traits'));
            }
        }
        row.append(studytrait_html);

        $("#diseasetrait-table-body").append(row);
    });
}

// Generate the summary sentence, at the bottom of the summary panel
// xintodo done
function getSummary(data) {
    var first_report  = getFirstReportYear(data.docs);
    var count_studies = countStudies(data.docs);

    if (count_studies == 0) {
        count_studies = '';
    }
    else if (count_studies == 1) {
        count_studies = '<b>1</b> study reports this efotrait';
    }
    else if (count_studies > 1) {
        count_studies = '<a class="inpage-link" onclick="toggle_and_scroll('+"'"+'#study_panel'+"'"+')"><b>'+count_studies+'</b> studies report this efotrait</a>';
    }

    if (first_report != '' && count_studies != '') {
        first_report += ', ';
    }
    $("#efotrait-summary-content").html(first_report+count_studies);
    return first_report+count_studies;
}

// Create external link buttons
function getLinkButtons (data,rsId) {
    var data_sample = data[0];
    var chr = data_sample.chromosomeName[0];
    var pos = data_sample.chromosomePosition[0];
    var pos_start = pos - CONTEXT_RANGE;
    if (pos_start < 1) {
        pos_start = 1;
    }
    var pos_end = pos + CONTEXT_RANGE;
    var location = chr+':'+pos_start+'-'+pos_end;
    var ens_g_context = 'http://www.ensembl.org/Homo_sapiens/Location/View?db=core;r='+location+';v='+rsId+';share_config='+ENS_SHARE_LINK;

    // Summary panel
    $("#ensembl_button").attr('onclick',     "window.open('"+ENSVAR+"Explore?v="+rsId+"',    '_blank')");
    $("#ensembl_gc_button").attr('onclick',  "window.open('"+ens_g_context+"',               '_blank')");
    $("#ensembl_phe_button").attr('onclick', "window.open('"+ENSVAR+"Phenotype?v="+rsId+"',  '_blank')");
    $("#ensembl_gr_button").attr('onclick',  "window.open('"+ENSVAR+"Mappings?v="+rsId+"',   '_blank')");
    $("#ensembl_pg_button").attr('onclick',  "window.open('"+ENSVAR+"Population?v="+rsId+"', '_blank')");
    $("#ensembl_cit_button").attr('onclick', "window.open('"+ENSVAR+"Citations?v="+rsId+"',  '_blank')");
    $("#dbsnp_button").attr('onclick',       "window.open('"+DBSNP+rsId+"',                  '_blank')");
    $("#ucsc_button").attr('onclick',        "window.open('"+UCSC+rsId+"',                   '_blank')");
    // LD
    $("#ens_ld_button").attr('onclick',  "window.open('"+ENSVAR+"HighLD?v="+rsId+"', '_blank')");
}

// Pick up the most recent publication year
// xintodo done
function getFirstReportYear(data) {
    var study_date = '';
    $.each(data, function(index,asso) {
        var p_date = asso.publicationDate;
        var year = p_date.split('-')[0];
        if (year < study_date || study_date == '') {
            study_date = year;
        }
    });
    if (study_date != '') {
        study_date = "Variant first reported in GWAS Catalog in <b>" + study_date + "</b>";
    }
    return study_date;
}

// Pick up the most recent publication year
// xintodo done
function countStudies(data) {
    var study_text = '';
    var studies = [];
    $.each(data, function(index,asso) {
        var study_id = asso.id;
        if (jQuery.inArray(study_id, studies) == -1) {
            studies.push(study_id);
        }
    });
    return studies.length;
}

// Display the input array as a HTML list
function displayArrayAsList(data_array) {
    var data_text = '';

    if (data_array) {
        if (data_array.length == 1) {
            data_text = data_array[0];
        }
        else if (data_array.length > 1) {
            var list = $('<ul/>');
            list.css('padding-left', '0px');
            $.each(data_array, function(index, value) {
                list.append(newItem(value));
            });
            data_text = list;
        }
    }
    return data_text;
}

// Generate an internal link to the GWAS search page
function setQueryUrl(query, label) {
    if (!label) {
        label = query;
    }
    return '<a href="/gwas/search?query='+query+'">'+label+'</a>';
}

// Update the display of the variant functional class
function variationClassLabel(label) {
    var new_label = label.replace(/_/g, ' '); // Replace all the underscores by a space
    return new_label.charAt(0).toUpperCase() + new_label.slice(1);
}

// Generate an external link (text + icon)
function setExternalLink(url,label) {
    return '<a href="'+url+'" target="_blank">'+label+'<span class="glyphicon glyphicon-new-window external-link-smaller"></span></a>';

}

// Generate an external link (icon only)
function setExternalLinkIcon(url) {
    return '<a href="'+url+'" class="glyphicon glyphicon-new-window external-link" title="External link" target="_blank"></a>';
}

// Create a cell tag (<td>) and add content in it
function newCell(content) {
    return $("<td></td>").html(content);
}

// Create a list item tag (<li>) and add content in it
function newItem(content) {
    return $("<li></li>").html(content);
}


// Create a hidden list of items - Used when we have to display a more or less long list of information
function longContentList (content_id, list, type) {

    var content_text = $('<span></span>');
    content_text.css('padding-right', '8px');
    content_text.html('<b>'+list.length+'</b> '+type);

    var content_div  = $('<div></div>');
    content_div.attr('id', content_id);
    content_div.addClass('collapse');

    var content_list = $('<ul></ul>');
    content_list.css('padding-left', '25px');
    content_list.css('padding-top', '6px');
    $.each(list, function(index, item) {
        content_list.append(newItem(item));
    });
    content_div.append(content_list);

    var container = $('<div></div>');
    container.append(content_text);
    container.append(showHideDiv(content_id));
    container.append(content_div);

    return container;
}

// Create a button to show/hide content
function showHideDiv(div_id) {
    var div_button = $("<button></button>");
    div_button.attr('title', 'Click to show/hide more information');
    div_button.attr('id', 'button-'+div_id);
    div_button.attr('onclick', 'toggleDiv("'+div_id+'")');
    div_button.addClass("btn btn-default btn-xs btn-study");
    div_button.html('<span class="glyphicon glyphicon-plus tgb"></span>');

    return div_button;
}

// Toogle a table and scroll to it.
function toggle_and_scroll (id) {
    if ($(id +" div:first-child").find('span').hasClass('panel-collapsed')) {
        toggleSidebar(id + ' span.clickable');
    }
    $(window).scrollTop($(id).offset().top - 70);
}

function getVariantInfoFromEnsembl(rsId) {
    $.getJSON('http://rest.ensembl.org/variation/human/'+rsId+'?content-type=application/json')
            .done(function(data) {
                console.log(data);
                processVariantInfoFromEnsembl(rsId,data);
            });
    console.log("Ensembl REST query done to retrieve variant information");
}

function processVariantInfoFromEnsembl(rsId, data) {
    if (!data.error) {
        var var_id  = data.name;
        var alleles = 'NA';
        var strand  = '';
        $.each(data.mappings, function(index, mapping) {
            if (mapping.seq_region_name.match(/\w{1,2}/)) {
                alleles = mapping.allele_string;
                strand  = (mapping.strand == 1) ? 'forward' : 'reverse';
                strand  = '<span style="padding-left:5px"><small>('+strand+' strand)</small></span>';
                alleles += strand;
            }
        });
        var maf = (data.MAF) ? data.MAF : 'NA';
        var ma  = (data.minor_allele) ? data.minor_allele : 'NA';

        $("#variant-alleles").html(alleles);
        $("#variant-strand").html(strand);
        $("#minor-allele").html(ma);
        $("#minor-allele-freq").html(maf);

        if (var_id != rsId) {
            var var_link = setExternalLink(DBSNP+var_id,var_id);
            $("#merged-variant-label").html("Merged into");
            $("#merged-variant").html(var_link);
        }
    }
}

function setState(state) {
    var loading = $('#loading');
    var noresults = $('#noResults');
    var results = $('#results');
    console.log("Search state update...");
    console.log(state);
    switch (state.value) {
        case 0:
            loading.show();
            noresults.hide();
            results.hide();
            break;
        case 1:
            loading.hide();
            noresults.show();
            results.hide();
            break;
        case 2:
            loading.hide();
            noresults.hide();
            results.show();
            break;
        default:
            console.log("Unknown search state; redirecting to search page");
            window.location = "variant";
    }
}

function setDownloadLink(rsId) {
    var baseUrl = '../api/search/downloads?';
    var q = "q=".concat(rsId);

    var facet = '&facet=association';
    var efo = '&efo=true';
    var params = '&pvalfilter=&orfilter=&betafilter=&datefilter=&genomicfilter=&traitfilter[]=&dateaddedfilter=';


    var url = "window.open('".concat(baseUrl).concat(q).concat(params).concat(facet).concat(efo).concat("',    '_blank')");

    $("#download_data").attr('onclick', url);

}