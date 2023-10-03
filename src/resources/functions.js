/**
 * Images Platform:
 * Author: Aaron Renner (admin@aaronrenner.com)
 */

/** Reads HTTP Query Params
 * @return (Array) of Objects 
 */
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

/** Append query K/V pair to URL
 *  @param (String) key
 *  @param (String) value
 *  @return (String)
 */
function appendQueryToThisURL(key, value) {
    let protocol;
    let host;
    let queryParam;

    if(window.location.hostname == "") { /** localhost / Dev env */
        protocol = window.location.protocol;
        host = window.location.pathname;
    } else { /** Prod env */
        protocol = window.location.protocol;
        host = window.location.hostname;
    }

    queryParam = "?"+key+"="+value;
    return protocol+host+queryParam;
}

// function asyncLoadImages() {
//     for(i=0; i<mainDataJSON.length; i++) {
//         let buffer = mainDataJSON[i];
//         $.ajax({
//             url: APP_BACKEND_URL+"/"+buffer.uuid,
//             method : 'GET',
//             contentType : 'application/json',
//             success: function(data, status, xhr){
//                 $('#'+data.uuid+'-image').replaceWith('<td><a href=\''+ appendQueryToThisURL('imageUuid', data.uuid) +'\'><image style=\'width: 96px; height: 96px;\' src=data:'+ data.mimeType +';base64,'+ data.image +'></a></td>');
//             },
//             error: function(error, status, xhr){
//                 $('#'+buffer.uuid+'-image').replaceWith('<td><image style=\"width: 96px; height: 96px;\" src=./resources/error.png></td>');
//             }
//         });
//     }
// }

function setActiveUuid(uuid) {
    const uuidSplit = uuid.split("-");
    console.log("Setting new selected id="+uuidSplit[0]+",action="+uuidSplit[1]);
    activeId = uuidSplit[0];
    activeAction = uuidSplit[1];
}

function saveNewConfig() {
    const dataIn = readConfigFromHTML("form");
    let action = $('#formAction').val();
    action = action.toLowerCase();

    if(dataIn.contractAddress.match("(-?[A-Za-z0-9]+)") && 
       dataIn.interval >= 10000) {

        $.ajax({
            url: APP_BACKEND_URL+action+"s?apikey="+APP_BACKEND_API_KEY,
            method : 'POST',
            contentType : 'application/json',
            data: JSON.stringify(dataIn),
            success:function(data, status, xhr){
                // split location header by foward slash
                const location = xhr.getResponseHeader('Location').split('/');
                // get last entry of location array for id
                const id = location[location.length-1];
                buildEditView((id+"-"+action));
            },
            error:function(error, status){
                console.log(error);
                alert(JSON.stringify(error));
            }
        });  
    } else {
        alert("Invalid contract address and/or interval");
    }
}

function loadConfigs() {
    /** Setup HTML elements */
    $('#loadingView').show();
    mainBody.innerHTML = "";

    // Load listings
    $.ajax({
        url: APP_BACKEND_URL+"listings?showAll=true&apikey="+APP_BACKEND_API_KEY,
        method : 'GET',
        contentType : 'application/json',
        success: function(data, status, xhr){
            console.log(data);
            data = data.reverse();
            mainListJSON = data;
            let db = data;

            // Init vars
            let text = '';

            for (i=0; i < db.length; i++) {
                const uuid = db[i].id+"-listing";
                text += '<tr id=\"'+uuid+'\">';
                text += '<td id=\"'+uuid+'-image\"><div class=\"spinner-grow\" role=\"status\" style=\"width: 48px; height: 48px;\""></div></td>';
                text += '<td id=\"'+uuid+'-contract\"><a href="#" onclick=\"buildEditView(\''+uuid+'\');\">'+ db[i].contractAddress +'</a></td>';
                text += '<td id=\"'+uuid+'-eventType\">Listings</td>';
                text += '<td id=\"'+uuid+'-disabledDiscord\">'+ db[i].excludeDiscord +'</td>';
                text += '<td id=\"'+uuid+'-disabledDiscord\">'+ db[i].excludeTwitter +'</td>';
                text += '<td id=\"'+uuid+'-active\">'+ db[i].active +'</td>';
                text += '</tr>';
                getCollectionImageByConfigIdAndEventType(db[i].contractAddress, uuid);
            }

            // Present
            mainBody.innerHTML += text;
        },
        error: function(error, status, xhr){
            console.log(error);
            alert(JSON.stringify(error));
        }
    });

    // Load sales
    $.ajax({
        url: APP_BACKEND_URL+"sales?showAll=true&apikey="+APP_BACKEND_API_KEY,
        method : 'GET',
        contentType : 'application/json',
        success: function(data, status, xhr){
            console.log(data);
            data = data.reverse();
            mainSaleJSON = data;
            let db = data;

            // Init vars
             let text = '';

            for (i=0; i < db.length; i++) {
                const uuid = db[i].id+"-sale";
                text += '<tr id=\"'+uuid+'\">';
                text += '<td id=\"'+uuid+'-image\"><div class=\"spinner-grow\" role=\"status\" style=\"width: 48px; height: 48px;\""></div></td>';
                text += '<td id=\"'+uuid+'-contract\"><a href="#" onclick=\"buildEditView(\''+uuid+'\');\">'+ db[i].contractAddress +'</a></td>';
                text += '<td id=\"'+uuid+'-eventType\">Sales</td>';
                text += '<td id=\"'+uuid+'-disabledDiscord\">'+ db[i].excludeDiscord +'</td>';
                text += '<td id=\"'+uuid+'-disabledDiscord\">'+ db[i].excludeTwitter +'</td>';
                text += '<td id=\"'+uuid+'-active\">'+ db[i].active +'</td>';
                text += '</tr>';
                getCollectionImageByConfigIdAndEventType(db[i].contractAddress, uuid);
            }
            // Present
            mainBody.innerHTML += text;
        },
        error: function(error, status, xhr){
            console.log(error);
            alert(JSON.stringify(error));
        }
    });
    $('#loadingView').hide();
}

function loadActiveConfig() {
    $.ajax({
        url: APP_BACKEND_URL+"/"+activeAction+"s/"+activeId+"?apikey="+APP_BACKEND_API_KEY,
        method : 'GET',
        contentType : 'application/json',
        success: function(data){
            console.log(data);
            $('#eFormActive').prop("checked", data.active);
            $('#eFormAction').val(activeAction.toUpperCase());
            $('#eFormContract').val(data.contractAddress);
            $('#eFormInterval').val(data.interval);
            $('#eFormDiscordExclude').prop("checked", data.excludeDiscord);
            $('#eFormDiscordToken').val(data.discordToken);
            $('#eFormDiscordChannelId').val(data.discordChannelId);
            $('#eFormDiscordMessageColor').val((data.discordMessageColor != null) ? ("#"+data.discordMessageColor.toString(16)) : "#FFC800");
            $('#eFormTwitterExclude').prop("checked", data.excludeTwitter);
            $('#eFormTwitterAccessToken').val(data.twitterAccessToken);
            $('#eFormTwitterAccessTokenSecret').val(data.twitterAccessTokenSecret);
            $('#eFormTwitterApiKey').val(data.twitterApiKey);
            $('#eFormTwitterApiKeySecret').val(data.twitterApiKeySecret);
            $('#eFormTwitterTemplate').val(data.twitterMessageTemplate);
            $('#eFormOpenseaExclude').prop("checked", data.excludeOpensea);
            $('#eFormOpenseaShowBundles').prop("checked", data.showBundles);
            $('#eFormOpenseaSlug').prop("checked", data.isSlug);
            $('#eFormOpenseaSolana').prop("checked", data.solanaOnOpensea);
            $('#eFormOpenseaPolygon').prop("checked", data.polygonOnOpensea);
            $('#eFormLooksrareExclude').prop("checked", data.excludeLooksrare);
            $('#eFormRarityEngine').val(data.rarityEngine);

            // Save response body in memory
            activeConfig = data;
        },
        error: function(error, status, xhr){
            alert("The requested config could not be found");
        }
    });
}

function updateActiveConfig() {
    const dataInput = readConfigFromHTML("eForm");
    console.log(dataInput);
    const dataDiff = getConfigDiff(dataInput);
    console.log(dataDiff);
    const action = activeAction.toLowerCase();

    if(dataInput.contractAddress.match("(-?[A-Za-z0-9]+)") && 
    dataInput.interval >= 10000) {
        // $.ajax({
        //     url: APP_BACKEND_URL+action+"s/"+activeId+"?apikey="+APP_BACKEND_API_KEY,
        //     method : 'PATCH',
        //     contentType : 'application/json',
        //     data: JSON.stringify(dataDiff),
        //     dataType: 'application/json',
        //     success:function(){
        //         buildEditView((activeId+"-"+action));
        //         alert("Configuration updated");
        //     },
        //     error:function(error, status){
        //         console.log(error);
        //         alert(JSON.stringify(error));
        //     }
        // });  
    }
}

function deleteActiveConfig() {
    $.ajax({
        url: APP_BACKEND_URL+activeAction+"s/"+activeId+"?apikey="+APP_BACKEND_API_KEY,
        method : 'DELETE',
        success:function(){
            location.reload();
        },
        error:function(error, status){
            console.log(error);
            alert(JSON.stringify(error));
        }
    });
}

function updateEditBtn() {
    let editBtn = document.querySelector('#editBtn');
    editBtn.innerText = "Selected Config: " + activeId + " (" + activeAction + ")";
    eFormName.innerText="Edit task: " + activeId + " (" + activeAction + ")"
    editBtn.style.display="";
}

function buildEditView(uuid) {
    console.log(uuid);
    // Update active config
    setActiveUuid(uuid);
    // Load config into memory and set UI
    loadActiveConfig();
    // Setters
    let mainView = document.querySelector("#mainView");
    let addConfigView = document.querySelector("#addConfigView");
    let editConfigView = document.querySelector("#editConfigView");
    // Update CSS
    mainView.style.display = "none";
    addConfigView.style.display = "none";
    editConfigView.style.display = "block";
    updateEditBtn();
}

function readConfigFromHTML(prefix) {
    const color = $('#'+prefix+'DiscordMessageColor').val().substring(1);
    let discordToken = null;
    let discordChannelId = null;
    let twitterTemplate = null;
    let twitterAccessToken = null;
    let twitterAccessTokenSecret = null;
    let twitterApiKey = null;
    let twitterApiKeySecret = null;

    // Discord Token
    const discordTokenDataFromPage = $('#'+prefix+'DiscordToken').val();
    if(discordTokenDataFromPage.length > 1) {
        discordToken = discordTokenDataFromPage;
    }
    // Discord Channel ID
    const discordChannelIdDataFromPage = $('#'+prefix+'DiscordChannelId').val();
    if(discordChannelIdDataFromPage.length > 1) {
        discordChannelId = discordChannelIdDataFromPage;
    }
    // Twitter Template
    const twitterTemplateDataFromPage = $('#'+prefix+'TwitterTemplate').val();
    if(twitterTemplateDataFromPage.length > 1) {
        twitterTemplate = twitterTemplateDataFromPage;
    }
    // Twitter Access Token
    const twitterAccessTokenDataFromPage = $('#'+prefix+'TwitterAccessToken').val();
    if(twitterAccessTokenDataFromPage.length > 1) {
        twitterAccessToken = twitterAccessTokenDataFromPage;
    }
    // Twitter Access Token Secret
    const twitterAccessTokenSecretDataFromPage = $('#'+prefix+'TwitterAccessTokenSecret').val();
    if(twitterAccessTokenSecretDataFromPage.length > 1) {
        twitterAccessTokenSecret = twitterAccessTokenSecretDataFromPage;
    }
    // Twitter Api Key
    const twitterApiKeyDataFromPage = $('#'+prefix+'TwitterApiKey').val();
    if(twitterApiKeyDataFromPage.length > 1) {
        twitterApiKey = twitterApiKeyDataFromPage;
    }
    // Twitter Api Key Secret
    const twitterApiKeySecretDataFromPage = $('#'+prefix+'TwitterApiKeySecret').val();
    if(twitterApiKeySecretDataFromPage.length > 1) {
        twitterApiKeySecret = twitterApiKeySecretDataFromPage;
    }

    const dataOut = {
        active: $('#'+prefix+'Active').prop("checked"),
        contractAddress: $('#'+prefix+'Contract').val(),
        interval: parseInt($('#'+prefix+'Interval').val()),
        excludeDiscord: $('#'+prefix+'DiscordExclude').prop("checked"),
        discordToken: discordToken,
        discordChannelId: discordChannelId,
        discordMessageColor: parseInt(color, 16),
        excludeTwitter: $('#'+prefix+'TwitterExclude').prop("checked"),
        twitterAccessToken: twitterAccessToken,
        twitterAccessTokenSecret: twitterAccessTokenSecret,
        twitterApiKey: twitterApiKey,
        twitterApiKeySecret: twitterApiKeySecret,
        twitterMessageTemplate: twitterTemplate,
        excludeOpensea: $('#'+prefix+'OpenseaExclude').prop("checked"),
        excludeLooksrare: $('#'+prefix+'LooksrareExclude').prop("checked"),
        showBundles: $('#'+prefix+'OpenseaShowBundles').prop("checked"),
        isSlug: $('#'+prefix+'OpenseaSlug').prop("checked"),
        solanaOnOpensea: $('#'+prefix+'OpenseaSolana').prop("checked"),
        polygonOnOpensea: $('#'+prefix+'OpenseaPolygon').prop("checked"),
        rarityEngine: $('#'+prefix+'RarityEngine').val(),
    };
    console.log("Read config from HTML: " + JSON.stringify(dataOut));
    return dataOut;
}

function getConfigDiff(inConf) {
    let outData = {}
    // Active
    if(inConf.active != activeConfig.active) {
        outData["active"] = inConf.active;
    }
    // Contract Address
    if(inConf.contractAddress != activeConfig.contractAddress) {
        outData["contractAddress"] = inConf.contractAddress;
    }
    // Interval
    if(inConf.interval != activeConfig.interval) {
        outData["interval"] = inConf.interval;
    }
    // Discord Exclude
    if(inConf.excludeDiscord != activeConfig.excludeDiscord) {
        outData["excludeDiscord"] = inConf.excludeDiscord;
    }
    // Discord Token
    if(inConf.discordToken != activeConfig.discordToken) {
        outData["discordToken"] = inConf.discordToken;
    }
    // Discord Channel ID
    if(inConf.discordChannelId != activeConfig.discordChannelId) {
        outData["discordChannelId"] = inConf.discordChannelId;
    }
    // Discord Message Color
    if((inConf.discordMessageColor != activeConfig.discordMessageColor) && (inConf.discordMessageColor != 16762880)) {
        outData["discordMessageColor"] = inConf.discordMessageColor;
    }
    // Twitter Exclude
    if(inConf.excludeTwitter != activeConfig.excludeTwitter) {
        outData["excludeTwitter"] = inConf.excludeTwitter;
    }
    // Twitter Access Token
    if(inConf.twitterAccessToken != activeConfig.twitterAccessToken) {
        outData["twitterAccessToken"] = inConf.twitterAccessToken;
    }
    // Twitter Access Token Secret
    if(inConf.twitterAccessTokenSecret != activeConfig.twitterAccessTokenSecret) {
        outData["twitterAccessTokenSecret"] = inConf.twitterAccessTokenSecret;
    }
    // Twitter Api Key
    if(inConf.twitterApiKey != activeConfig.twitterApiKey) {
        outData["twitterApiKey"] = inConf.twitterApiKey;
    }
    // Twitter Api Key Secret
    if(inConf.twitterApiKeySecret != activeConfig.twitterApiKeySecret) {
        outData["twitterApiKeySecret"] = inConf.twitterApiKeySecret;
    }
    // Twitter Message Template
    if(inConf.twitterMessageTemplate != activeConfig.twitterMessageTemplate) {
        outData["twitterMessageTemplate"] = inConf.twitterMessageTemplate;
    }
    // Opensea Exclude
    if(inConf.excludeOpensea != activeConfig.excludeOpensea) {
        outData["excludeOpensea"] = inConf.excludeOpensea;
    }
    // Looksrare Exclude
    if(inConf.excludeLooksrare != activeConfig.excludeLooksrare) {
        outData["excludeLooksrare"] = inConf.excludeLooksrare;
    }
    // Show Bundles
    if(inConf.showBundles != activeConfig.showBundles) {
        outData["showBundles"] = inConf.showBundles;
    }
    // Opensea Slug
    if(inConf.isSlug != activeConfig.isSlug) {
        outData["isSlug"] = inConf.isSlug;
    }
    // Opensea Solana
    if(inConf.solanaOnOpensea != activeConfig.solanaOnOpensea) {
        outData["solanaOnOpensea"] = inConf.solanaOnOpensea;
    }
    // Opensea Polygon
    if(inConf.polygonOnOpensea != activeConfig.polygonOnOpensea) {
        outData["polygonOnOpensea"] = inConf.polygonOnOpensea;
    }
    // Rarity Engine
    if(inConf.rarityEngine != activeConfig.rarityEngine) {
        outData["rarityEngine"] = inConf.rarityEngine;
    }
    return outData;
}

async function getCollectionImageByConfigIdAndEventType(internalContractId, uuid) {
    $.ajax({
        url: APP_BACKEND_URL+"events?apikey="+APP_BACKEND_API_KEY+"&contractAddress="+internalContractId+"&limit=1",
        method : 'GET',
        datatype : 'json',
        success: function(data, status, xhr){
            console.log(data["content"][0]);
            const imageUrl = data["content"][0]["collectionImageUrl"];
            console.log("Got collection image: " + imageUrl);
            // create new image
            var image = new Image();
            // set image style
            image.style.width = "96px";
            image.style.height = "96px";
            // sets image url
            image.src = imageUrl;
            $('#'+uuid+'-image').replaceWith(image);
        },
        error: function(error, status, xhr){
            $('#'+buffer.uuid+'-image').replaceWith('<td><image style=\"width: 96px; height: 96px;\" src=./resources/error.png></td>');
        }
    });
}