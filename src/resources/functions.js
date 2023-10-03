/**
 * Library Functions
 * Author: Aaron Renner (admin@aaronrenner.com)
 */

/**
 * Reads HTTP Query Parameters from the current URL.
 * @returns {Array} - An array of query parameters as objects.
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

/**
 * Appends a query key-value pair to the current URL.
 * @param {String} key - The query parameter key to append.
 * @param {String} value - The value to assign to the query parameter.
 * @returns {String} - The updated URL with the appended query parameter.
 */
function appendQueryToThisURL(key, value) {
    let protocol;
    let host;
    let queryParam;

    if (window.location.hostname == "") { // localhost / Dev environment
        protocol = window.location.protocol;
        host = window.location.pathname;
    } else { // Production environment
        protocol = window.location.protocol;
        host = window.location.hostname;
    }

    queryParam = "?" + key + "=" + value;
    return protocol + host + queryParam;
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

/**
 * Sets the active configuration's ID and action based on the provided UUID.
 * @param {string} uuid - The UUID in the format "id-action".
 */
function setActiveUuid(uuid) {
    const uuidSplit = uuid.split("-");
    console.log("Setting new selected id=" + uuidSplit[0] + ", action=" + uuidSplit[1]);
    activeId = uuidSplit[0];
    activeAction = uuidSplit[1];
}

/**
 * Updates the content of the "Edit" button and the displayed form name.
 * @function
 */
function updateEditBtn() {
    let editBtn = document.querySelector('#editBtn');
    editBtn.innerText = "Selected Config: " + activeId + " (" + activeAction + ")";
    eFormName.innerText = "Edit task: " + activeId + " (" + activeAction + ")";
    editBtn.style.display = "";
}

/**
 * Builds the edit view for a configuration specified by the provided UUID.
 * @param {string} uuid - The UUID of the configuration to edit.
 */
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

/**
 * Reads configuration data from HTML elements with the specified prefix.
 * @param {string} prefix - The prefix used to identify HTML elements.
 * @returns {Object} - An object containing the configuration data.
 */
function readConfigFromHTML(prefix) {
    const getInputValue = (id) => {
        const value = $('#' + prefix + id).val();
        return value && value.length > 1 ? value : null;
    };

    const getCheckboxValue = (id) => {
        return $('#' + prefix + id).prop("checked");
    };

    const getColorValue = (id) => {
        const color = $('#' + prefix + id).val().substring(1);
        return color && color.length > 1 ? parseInt(color, 16) : null;
    };

    return {
        active: getCheckboxValue('Active'),
        contractAddress: getInputValue('Contract'),
        interval: parseInt($('#' + prefix + 'Interval').val()),
        excludeDiscord: getCheckboxValue('DiscordExclude'),
        discordToken: getInputValue('DiscordToken'),
        discordChannelId: getInputValue('DiscordChannelId'),
        discordMessageColor: getColorValue('DiscordMessageColor'),
        excludeTwitter: getCheckboxValue('TwitterExclude'),
        twitterAccessToken: getInputValue('TwitterAccessToken'),
        twitterAccessTokenSecret: getInputValue('TwitterAccessTokenSecret'),
        twitterApiKey: getInputValue('TwitterApiKey'),
        twitterApiKeySecret: getInputValue('TwitterApiKeySecret'),
        twitterMessageTemplate: getInputValue('TwitterTemplate'),
        excludeOpensea: getCheckboxValue('OpenseaExclude'),
        excludeLooksrare: getCheckboxValue('LooksrareExclude'),
        showBundles: getCheckboxValue('OpenseaShowBundles'),
        isSlug: getCheckboxValue('OpenseaSlug'),
        solanaOnOpensea: getCheckboxValue('OpenseaSolana'),
        polygonOnOpensea: getCheckboxValue('OpenseaPolygon'),
        rarityEngine: $('#' + prefix + 'RarityEngine').val(),
    };
}

/**
 * Compares the differences between two configurations and returns the changed fields.
 * @param {Object} inConf - The input configuration.
 * @returns {Object} - An object containing the changed fields and their new values.
 */
function getConfigDiff(inConf) {
    let outData = {};

    for (const key in inConf) {
        if (inConf.hasOwnProperty(key) && inConf[key] !== activeConfig[key]) {
            outData[key] = inConf[key];
        }
    }

    // Exclude discord message color if it's the default value
    if (inConf.discordMessageColor !== activeConfig.discordMessageColor && inConf.discordMessageColor !== 16762880) {
        outData.discordMessageColor = inConf.discordMessageColor;
    }

    return outData;
}