/**
 * Images Platform:
 * Author: Aaron Renner (admin@aaronrenner.com)
 */

$(document).ready(function() {
  /** Enable search box tooltips */
  $('#formSearch').tooltip()

  /** UI interaction */
  let showMainViewBtn = document.querySelector('#showMainViewBtn');
  let refreshBtn = document.querySelector("#refreshBtn");
  let showAddViewBtn = document.querySelector('#showAddViewBtn');

  /** UI Views */
  let mainView = document.querySelector("#mainView");

  /** UI Add */
  let formSaveBtn = document.querySelector("#formSaveBtn");
  let addConfigView = document.querySelector("#addConfigView");

  /** UI Edit */
  let editBtn = document.querySelector('#editBtn');
  let editConfigView = document.querySelector("#editConfigView");
  let eFormSaveBtn = document.querySelector("#eFormSaveBtn");
  // let eformId = document.querySelector("#eformId");
  // let eformTask = document.querySelector("#eformTask");
  // let eformName = document.querySelector("#eformName");
  // let eFormSaveBtn = document.querySelector("#eFormSaveBtn");

  showMainViewBtn.addEventListener('click', showOverview);
  refreshBtn.addEventListener('click', loadConfigs);
  showAddViewBtn.addEventListener('click', showAdd);
  formSaveBtn.addEventListener('click', saveNewConfig);
  editBtn.addEventListener('click', showEdit);
  eFormSaveBtn.addEventListener('click', updateActiveConfig);
  eFormDeleteBtn.addEventListener('click', deleteActiveConfig);
  // eFormSaveBtn.addEventListener('click', console.log("change"));

  $('#loadingViewLookup').hide();

  /**
   * Show add images view
   */
  function showAdd() {
    mainView.style.display = "none";
    addConfigView.style.display = "block";
    // editView.style.display = "none";
    editConfigView.style.display = "none";
  }

  /**
   * Show list of images
   */
  function showOverview() {
    mainView.style.display = "block";
    addConfigView.style.display = "none";
    // editView.style.display = "none";
    editConfigView.style.display = "none";
  }

  /**
   * Show edit view
   * 
   * Disabled till permissions released
  */
  function showEdit() {
    mainView.style.display = "none";
    addConfigView.style.display = "none";
    // editView.style.display = "block";
    editConfigView.style.display = "block";
    //editTable();
  }

  /**
  function editTable() {
    let text = '';
    for (n=0; n < db.length; n++) {
      text += '<tr>';
      text += '<td>'+ db[n].uuid +'</td>';
      text += '<td>'+ db[n].description +'</td>';
      text += '<td>'+ db[n].name +'</td>';
      text += '<td><button data-id="'+n+'" class="btn btn-warning edit">Edit</button></td>';
      text += '<td><button id="'+n+'" class="btn btn-info done">Done!</button></td>';
      text += '</tr>';
    }
    editBody.innerHTML = text;
    let doneBtn = document.querySelectorAll(".done");
    let editBtn = document.querySelectorAll(".edit");
    for (k=0; k < doneBtn.length; k++) {
    doneBtn[k].addEventListener('click',done);
      editBtn[k].addEventListener('click',edit);
    }
  }

  function edit() {
    mainView.style.display = "none";
    addConfigView.style.display = "none";
    editView.style.display = "none";
    editConfigView.style.display = "block";
    id = this.getAttribute('data-id');
    eformId.value = db[id].uuid;
    eformTask.value = db[id].description;
    eformName.value = db[id].name;
  }

  function change() {
    let formId = eformId.value;
    let formTask = eformTask.value;
    let formName = eformName.value;

    db[id] = {
      id : formId,
      task: formTask,
      name: formName
    };
``
    //createTable();
    showOverview();
  }

  function done() {
    let id = this.uuid;
    db.splice(id,1);
    //createTable();
    showOverview();
  }
  */

  loadConfigs();
  if(getUrlVars()['selectedUuid'] != undefined) {
    const selectedUuid = getUrlVars()['selectedUuid'];
    buildEditView(selectedUuid);
  } else {
    showOverview();
  }
});