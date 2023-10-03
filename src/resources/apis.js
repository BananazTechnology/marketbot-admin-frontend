/**
 * Platform: API Calls
 * Author: Aaron Renner (admin@aar.dev)
 */

/**
 * Saves a new configuration by making a POST request to the API.
 * Reads configuration data from the HTML form, validates it, and sends it to the API.
 */
function saveNewConfig() {
    const dataIn = readConfigFromHTML("form");
    let action = $('#formAction').val();
    action = action.toLowerCase();

    if (dataIn.contractAddress.match("(-?[A-Za-z0-9]+)") && dataIn.interval >= 10000) {
        $.ajax({
            url: APP_BACKEND_URL + action + "s?apikey=" + APP_BACKEND_API_KEY,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(dataIn),
            success: function (data, status, xhr) {
                // Extract the ID from the response header's Location field
                const location = xhr.getResponseHeader('Location').split('/');
                const id = location[location.length - 1];
                // Build and display the edit view for the newly created config
                buildEditView((id + "-" + action));
            },
            error: function (error, status) {
                console.log(error);
                alert(JSON.stringify(error));
            }
        });
    } else {
        alert("Invalid contract address and/or interval");
    }
}

/**
 * Loads configurations by making GET requests to the API.
 * Populates the HTML table with configuration data retrieved from the API.
 */
function loadConfigs() {
    $('#loadingView').show();
    mainBody.innerHTML = "";

    function loadContent(url, mainListJSON, eventType) {
        $.ajax({
            url: url,
            method: 'GET',
            contentType: 'application/json',
            success: function (data, status, xhr) {
                console.log(data);
                data = data.reverse();
                mainListJSON = data;
                let db = data;
                let text = '';

                for (let i = 0; i < db.length; i++) {
                    const uuid = db[i].id + "-" + eventType;
                    text += '<tr id="' + uuid + '">';
                    text += '<td id="' + uuid + '-image"><div class="spinner-grow" role="status" style="width: 48px; height: 48px;"></div></td>';
                    text += '<td id="' + uuid + '-contract"><a href="#" onclick="buildEditView(\'' + uuid + '\');">' + db[i].contractAddress + '</a></td>';
                    text += '<td id="' + uuid + '-eventType">' + capitalizeFirstLetter(eventType + 's') + '</td>';
                    text += '<td id="' + uuid + '-active">' + db[i].active + '</td>';
                    text += '</tr>';
                    getCollectionImageByConfigIdAndEventType(db[i].contractAddress, uuid);
                }

                mainBody.innerHTML += text;
            },
            error: function (error, status, xhr) {
                console.log(error);
                alert(JSON.stringify(error));
            }
        });
    }

    loadContent(APP_BACKEND_URL + "listings?showAll=true&apikey=" + APP_BACKEND_API_KEY, mainListJSON, "listing");
    loadContent(APP_BACKEND_URL + "sales?showAll=true&apikey=" + APP_BACKEND_API_KEY, mainSaleJSON, "sale");

    $('#loadingView').hide();
}

/**
 * Loads the active configuration by making a GET request to the API.
 * Populates the HTML form with the retrieved configuration data.
 */
function loadActiveConfig() {
    $.ajax({
        url: APP_BACKEND_URL + "/" + activeAction + "s/" + activeId + "?apikey=" + APP_BACKEND_API_KEY,
        method: 'GET',
        contentType: 'application/json',
        success: function (data) {
            console.log(data);
            // Populate the HTML form with data from the retrieved configuration
            $('#eFormActive').prop("checked", data.active);
            $('#eFormAction').val(activeAction.toUpperCase());
            $('#eFormContract').val(data.contractAddress);
            $('#eFormInterval').val(data.interval);
            $('#eFormDiscordExclude').prop("checked", data.excludeDiscord);
            $('#eFormDiscordToken').val(data.discordToken);
            $('#eFormDiscordChannelId').val(data.discordChannelId);
            $('#eFormDiscordMessageColor').val((data.discordMessageColor != null) ? ("#" + data.discordMessageColor.toString(16)) : "#FFC800");
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
        error: function (error, status, xhr) {
            alert("The requested config could not be found");
        }
    });
}

/**
 * Updates the active configuration by making a PATCH request to the API.
 * Compares the current configuration with the edited configuration and sends the differences to the API.
 */
function updateActiveConfig() {
    const dataInput = readConfigFromHTML("eForm");
    console.log(dataInput);
    const dataDiff = getConfigDiff(dataInput);
    console.log(dataDiff);
    const action = activeAction.toLowerCase();

    if (dataInput.contractAddress.match("(-?[A-Za-z0-9]+)") && dataInput.interval >= 10000) {
        // The following code sends a PATCH request to update the configuration (commented out).
        $.ajax({
            url: APP_BACKEND_URL + action + "s/" + activeId + "?apikey=" + APP_BACKEND_API_KEY,
            method: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify(dataDiff),
            dataType: 'application/json',
            success: function () {
                buildEditView((activeId + "-" + action));
                alert("Configuration updated");
            },
            error: function (error, status) {
                console.log(error);
                alert(JSON.stringify(error));
            }
        });
    }
}

/**
 * Deletes the active configuration by making a DELETE request to the API.
 * Deletes the configuration specified by the activeAction and activeId.
 */
function deleteActiveConfig() {
    $.ajax({
        url: APP_BACKEND_URL + activeAction + "s/" + activeId + "?apikey=" + APP_BACKEND_API_KEY,
        method: 'DELETE',
        success: function () {
            location.reload(); // Reload the page after successful deletion.
        },
        error: function (error, status) {
            console.log(error);
            alert(JSON.stringify(error));
        }
    });
}

/**
 * Retrieves a collection image by making a GET request to the API.
 * Fetches the collection image URL associated with a specific internalContractId and updates it in the UI.
 */
async function getCollectionImageByConfigIdAndEventType(internalContractId, uuid) {
    $.ajax({
        url: APP_BACKEND_URL + "events?apikey=" + APP_BACKEND_API_KEY + "&contractAddress=" + internalContractId + "&limit=1",
        method: 'GET',
        dataType: 'json',
        success: function (data, status, xhr) {
            console.log(data["content"][0]);
            const imageUrl = data["content"][0]["collectionImageUrl"];
            console.log("Got collection image: " + imageUrl);
            // Create a new image element.
            var image = new Image();
            // Set image style attributes.
            image.style.width = "96px";
            image.style.height = "96px";
            // Set the image URL.
            image.src = imageUrl;
            $('#' + uuid + '-image').replaceWith(image); // Replace the existing image in the UI.
        },
        error: function (error, status, xhr) {
            // Handle errors by displaying an error image (replace the image with an error image).
            $('#' + buffer.uuid + '-image').replaceWith('<td><image style="width: 96px; height: 96px;" src=./resources/error.png></td>');
        }
    });
}
